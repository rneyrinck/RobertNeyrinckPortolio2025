const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export function isCaptchaConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY)
}

/**
 * Verifies a Cloudflare Turnstile token server-side. If Turnstile isn't
 * configured (no secret key set — e.g. local dev), this passes through so
 * the widget stays usable, but that should not be the case in production:
 * the captcha is the abuse/cost-volume guard in front of a real LLM spend.
 */
export async function verifyTurnstileToken(
  token: string | undefined,
): Promise<{ success: boolean; reason?: string }> {
  if (!isCaptchaConfigured()) {
    return { success: true, reason: 'captcha-not-configured' }
  }

  if (!token) {
    return { success: false, reason: 'missing-token' }
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    })
    const data = (await res.json()) as { success: boolean }
    return {
      success: data.success,
      reason: data.success ? undefined : 'verification-failed',
    }
  } catch {
    return { success: false, reason: 'verification-request-failed' }
  }
}
