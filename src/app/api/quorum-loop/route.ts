import { NextRequest } from 'next/server'

import { BudgetTracker, estimateTokens } from '@/lib/quorumLoop/budget'
import { callModel, isConfigured } from '@/lib/quorumLoop/anthropic'
import {
  loopCritiqueUserPrompt,
  LOOP_CRITIQUE_SYSTEM_PROMPT,
  loopReviseUserPrompt,
  LOOP_REVISE_SYSTEM_PROMPT,
  MAX_QUESTION_LENGTH,
  personaSystemPrompt,
  personaUserPrompt,
  reactionSystemPrompt,
  reactionUserPrompt,
  SYNTHESIS_SYSTEM_PROMPT,
  synthesisUserPrompt,
} from '@/lib/quorumLoop/prompts'
import {
  type PersonaKey,
  type QuorumLoopEvent,
  type QuorumLoopRequestBody,
  type StageName,
} from '@/lib/quorumLoop/types'
import { verifyTurnstileToken } from '@/lib/quorumLoop/turnstile'

export const runtime = 'nodejs'

const PERSONAS: PersonaKey[] = ['engineer', 'business', 'stakeholder']

// Per-call output token caps, keyed by stage. Kept small on purpose: this
// is a portfolio demo widget, not a chat product, and small caps are the
// main lever that keeps the whole sequence cheap and fast.
const MAX_OUTPUT_TOKENS: Record<StageName, number> = {
  engineer: 180,
  business: 180,
  stakeholder: 180,
  synthesis: 260,
  'loop-critique': 200,
  'loop-revise': 260,
  'reaction-engineer': 170,
  'reaction-business': 170,
  'reaction-stakeholder': 170,
}

// Very small in-memory, per-IP rate limiter. Resets on cold start and does
// not coordinate across instances — it's a cheap defense-in-depth layer
// alongside the Turnstile captcha, not a substitute for it.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 3
const rateLimitHits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const hits = (rateLimitHits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  )
  hits.push(now)
  rateLimitHits.set(ip, hits)
  return hits.length > RATE_LIMIT_MAX_REQUESTS
}

function sse(event: QuorumLoopEvent) {
  return `data: ${JSON.stringify(event)}\n\n`
}

export async function POST(req: NextRequest) {
  let body: QuorumLoopRequestBody
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  const question = (body.question ?? '').trim()
  if (!question) {
    return new Response('Missing question', { status: 400 })
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return new Response(
      `Question too long (max ${MAX_QUESTION_LENGTH} characters)`,
      { status: 400 },
    )
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return new Response('Too many requests — try again in a minute.', {
      status: 429,
    })
  }

  const captcha = await verifyTurnstileToken(body.turnstileToken, ip)
  if (!captcha.success) {
    return new Response('Captcha verification failed', { status: 403 })
  }

  if (!isConfigured()) {
    // Demo mode: no ANTHROPIC_API_KEY set. Return a single friendly event
    // instead of erroring, so the widget stays usable while wiring up a
    // key separately.
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            sse({
              stage: 'error',
              status: 'error',
              reason:
                'This widget is running in demo mode — the site owner hasn’t connected a model API key yet.',
            }),
          ),
        )
        controller.close()
      },
    })
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  }

  const budget = new BudgetTracker()

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      const emit = (event: QuorumLoopEvent) =>
        controller.enqueue(encoder.encode(sse(event)))

      function shouldSkip(
        stage: StageName,
        systemPrompt: string,
        userPrompt: string,
      ) {
        const estimatedInput = estimateTokens(systemPrompt + userPrompt)
        const maxOut = MAX_OUTPUT_TOKENS[stage]
        if (budget.canAfford(estimatedInput, maxOut)) return false
        return true
      }

      async function runStage(
        stage: StageName,
        systemPrompt: string,
        userPrompt: string,
      ): Promise<string | null> {
        if (shouldSkip(stage, systemPrompt, userPrompt)) {
          emit({
            stage,
            status: 'skipped',
            reason:
              'Skipped to stay within the response budget for this session.',
          })
          return null
        }
        emit({ stage, status: 'start' })
        try {
          const result = await callModel(
            systemPrompt,
            userPrompt,
            MAX_OUTPUT_TOKENS[stage],
          )
          budget.recordUsage(result.inputTokens, result.outputTokens)
          emit({ stage, status: 'done', content: result.text })
          return result.text
        } catch (err) {
          emit({
            stage,
            status: 'error',
            reason: err instanceof Error ? err.message : 'Model call failed',
          })
          return null
        }
      }

      try {
        // Stage 1: three personas, in parallel.
        const personaPrompt = personaUserPrompt(question)
        const [engineer, business, stakeholder] = await Promise.all(
          PERSONAS.map((p) =>
            runStage(p, personaSystemPrompt(p), personaPrompt),
          ),
        )

        const responses: Record<PersonaKey, string> = {
          engineer: engineer ?? '',
          business: business ?? '',
          stakeholder: stakeholder ?? '',
        }

        // Stage 2: synthesis (needs at least one persona response to mean anything).
        let synthesis: string | null = null
        if (engineer || business || stakeholder) {
          synthesis = await runStage(
            'synthesis',
            SYNTHESIS_SYSTEM_PROMPT,
            synthesisUserPrompt(question, responses),
          )
        } else {
          emit({
            stage: 'synthesis',
            status: 'skipped',
            reason: 'No persona responses available to synthesize.',
          })
        }

        // Stage 3: Loop critique + revise (chained on the synthesis).
        let critique: string | null = null
        let revised: string | null = null
        if (synthesis) {
          critique = await runStage(
            'loop-critique',
            LOOP_CRITIQUE_SYSTEM_PROMPT,
            loopCritiqueUserPrompt(question, synthesis),
          )
          if (critique) {
            revised = await runStage(
              'loop-revise',
              LOOP_REVISE_SYSTEM_PROMPT,
              loopReviseUserPrompt(question, synthesis, critique),
            )
          }
        }

        // Stage 4: short honest reactions from each persona to the revised
        // synthesis. Lowest priority — first to get skipped under budget
        // pressure.
        if (revised) {
          await Promise.all(
            PERSONAS.map((p) => {
              const own = responses[p]
              if (!own) return Promise.resolve(null)
              return runStage(
                `reaction-${p}` as StageName,
                reactionSystemPrompt(p),
                reactionUserPrompt(question, own, revised as string),
              )
            }),
          )
        }

        emit({ stage: 'done', status: 'done' })
      } catch (err) {
        emit({
          stage: 'error',
          status: 'error',
          reason: err instanceof Error ? err.message : 'Unexpected error',
        })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
