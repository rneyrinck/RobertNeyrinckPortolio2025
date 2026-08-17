const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const VERIFY_TIMEOUT_MS = 10_000

export const TURNSTILE_ACTION = 'quorum-submit'

export function isCaptchaConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY)
}

/**
 * Hostnames Turnstile responses are allowed to have come from. Defaults to
 * the production site plus its www subdomain; can be overridden/extended
 * via TURNSTILE_ALLOWED_HOSTNAMES (comma-separated). localhost/127.0.0.1
 * are only accepted outside production — per Cloudflare's own guidance,
 * production deployments must not allowlist local hostnames.
 */
function allowedHostnames(): string[] {
  const configured = process.env.TURNSTILE_ALLOWED_HOSTNAMES
  const base = configured
    ? configured.split(',').map((h) => h.trim()).filter(Boolean)
    : ['robertneyrinck.com', 'www.robertneyrinck.com']

  if (process.env.NODE_ENV !== 'production') {
    return [...base, 'localhost', '127.0.0.1']
  }
  return base
}

interface SiteverifyResponse {
  success: boolean
  action?: string
  hostname?: string
  ['error-codes']?: string[]
}

/**
 * Verifies a Cloudflare Turnstile token server-side, following the
 * documented pattern: POST secret+response+remoteip to siteverify, then
 * require success, a matching action, and an approved hostname — not just
 * `success === true` on its own. If Turnstile isn't configured (no secret
 * key set — e.g. local dev), this passes through so the widget stays
 * usable, but that should never be the case in production: the captcha is
 * the abuse/cost-volume guard in front of a real LLM spend.
 */
export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp: string,
): Promise<{ success: boolean; reason?: string }> {
  if (!isCaptchaConfigured()) {
    return { success: true, reason: 'captcha-not-configured' }
  }

  if (!token) {
    return { success: false, reason: 'missing-token' }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS)

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: remoteIp,
      }),
      signal: controller.signal,
    })
    const data = (await res.json()) as SiteverifyResponse

    if (!data.success) {
      return {
        success: false,
        reason: data['error-codes']?.join(',') ?? 'verification-failed',
      }
    }
    if (data.action && data.action !== TURNSTILE_ACTION) {
      return { success: false, reason: 'action-mismatch' }
    }
    if (data.hostname && !allowedHostnames().includes(data.hostname)) {
      return { success: false, reason: 'hostname-not-allowed' }
    }

    return { success: true }
  } catch {
    // Covers both network failures and the abort-on-timeout case.
    return { success: false, reason: 'verification-request-failed' }
  } finally {
    clearTimeout(timeout)
  }
}
