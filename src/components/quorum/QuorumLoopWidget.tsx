'use client'

import { useState } from 'react'
import { Turnstile, useTurnstile } from 'react-turnstile'

import { consumeQuorumLoopStream } from '@/lib/quorumLoop/client'
import { MAX_QUESTION_LENGTH } from '@/lib/quorumLoop/prompts'
import {
  PERSONA_LABELS,
  type PersonaKey,
  type QuorumLoopEvent,
  type StageName,
} from '@/lib/quorumLoop/types'

// Kept in sync with TURNSTILE_ACTION in src/lib/quorumLoop/turnstile.ts —
// duplicated rather than imported so this client component doesn't pull a
// server-only module (which reads TURNSTILE_SECRET_KEY) into the browser
// bundle.
const TURNSTILE_ACTION = 'quorum-submit'

type StageStatus = 'pending' | 'start' | 'done' | 'skipped' | 'error'

interface StageState {
  status: StageStatus
  content?: string
  reason?: string
}

const PERSONAS: PersonaKey[] = ['engineer', 'business', 'stakeholder']

const ALL_STAGES: StageName[] = [
  'engineer',
  'business',
  'stakeholder',
  'synthesis',
  'loop-critique',
  'loop-revise',
  'reaction-engineer',
  'reaction-business',
  'reaction-stakeholder',
]

function initialStages(): Record<StageName, StageState> {
  return Object.fromEntries(
    ALL_STAGES.map((stage) => [stage, { status: 'pending' as StageStatus }]),
  ) as Record<StageName, StageState>
}

function PersonaCard({
  persona,
  state,
}: {
  persona: PersonaKey
  state: StageState
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-signal-navy p-4">
      <p className="font-mono text-xs uppercase tracking-wide text-signal-teal">
        {PERSONA_LABELS[persona]}
      </p>
      <div className="mt-2 min-h-[2.5rem] text-sm text-zinc-300">
        {state.status === 'pending' && (
          <span className="text-zinc-500">Waiting…</span>
        )}
        {state.status === 'start' && (
          <span className="animate-pulse text-zinc-400">Thinking…</span>
        )}
        {state.status === 'skipped' && (
          <span className="text-zinc-500">{state.reason ?? 'Skipped.'}</span>
        )}
        {state.status === 'error' && (
          <span className="text-signal-rose">
            {state.reason ?? 'Something went wrong.'}
          </span>
        )}
        {state.status === 'done' && <p>{state.content}</p>}
      </div>
    </div>
  )
}

export function QuorumLoopWidget() {
  const [question, setQuestion] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | undefined>(
    undefined,
  )
  const [stages, setStages] =
    useState<Record<StageName, StageState>>(initialStages())
  const [running, setRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [topLevelError, setTopLevelError] = useState<string | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const captchaRequired = Boolean(siteKey)
  const turnstile = useTurnstile()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || running) return
    if (captchaRequired && !captchaToken) {
      setTopLevelError('Please complete the captcha first.')
      return
    }

    setRunning(true)
    setHasRun(true)
    setTopLevelError(null)
    setStages(initialStages())

    try {
      const res = await fetch('/api/quorum-loop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, turnstileToken: captchaToken }),
      })

      if (!res.ok) {
        setTopLevelError(await res.text())
        return
      }

      await consumeQuorumLoopStream(res, (event: QuorumLoopEvent) => {
        if (event.stage === 'done') return
        if (event.stage === 'error') {
          setTopLevelError(event.reason ?? 'Something went wrong.')
          return
        }
        setStages((prev) => ({
          ...prev,
          [event.stage]: {
            status: event.status,
            content: event.content,
            reason: event.reason,
          },
        }))
      })
    } catch {
      setTopLevelError('Network error — please try again.')
    } finally {
      setRunning(false)
      // Turnstile tokens are single-use — reset so the next submission
      // gets a fresh one instead of silently failing captcha verification.
      if (captchaRequired) {
        turnstile.reset()
        setCaptchaToken(undefined)
      }
    }
  }

  const synthesis = stages.synthesis
  const critique = stages['loop-critique']
  const revised = stages['loop-revise']
  const anyReactionStarted = PERSONAS.some(
    (p) => stages[`reaction-${p}`].status !== 'pending',
  )

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-700/40 dark:bg-zinc-900/40">
      <p className="font-mono text-xs uppercase tracking-wide text-signal-rose">
        The Quorum + Loop
      </p>
      <h3 className="mt-2 font-display text-2xl font-bold text-zinc-800 dark:text-zinc-100">
        Ask a question, watch how I actually think through problems
      </h3>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
        This is the real method behind the case studies above: run the question
        past three differently-profiled advisors — an engineer, a business
        owner, and the stakeholder living with the result — then have an agentic
        critique pass (&ldquo;Loop&rdquo;) stress-test the synthesis before the
        advisors get a last honest word. Costs are capped per submission, so
        this may occasionally skip a low-priority step to stay within budget.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <label htmlFor="quorum-question" className="sr-only">
          Your question
        </label>
        <textarea
          id="quorum-question"
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value.slice(0, MAX_QUESTION_LENGTH))
          }
          placeholder="Ask anything — e.g. “Should we rebuild this in-house or buy?”"
          rows={3}
          maxLength={MAX_QUESTION_LENGTH}
          disabled={running}
          className="w-full resize-none rounded-md border border-zinc-900/10 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm placeholder:text-zinc-400 focus:border-signal-teal focus:outline-none focus:ring-2 focus:ring-signal-teal/40 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        <div className="mt-1 text-right font-mono text-xs text-zinc-400">
          {question.length}/{MAX_QUESTION_LENGTH}
        </div>

        {captchaRequired && (
          <div className="mt-3">
            <Turnstile
              sitekey={siteKey as string}
              action={TURNSTILE_ACTION}
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(undefined)}
            />
          </div>
        )}

        {topLevelError && (
          <p className="mt-3 text-sm text-signal-rose" role="alert">
            {topLevelError}
          </p>
        )}

        <button
          type="submit"
          disabled={
            running || !question.trim() || (captchaRequired && !captchaToken)
          }
          className="mt-4 inline-flex items-center justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-teal disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700 dark:hover:bg-zinc-600"
        >
          {running ? 'Running the quorum…' : 'Run the quorum'}
        </button>
      </form>

      {hasRun && (
        <div className="mt-8 space-y-6" aria-live="polite">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-zinc-400">
              Quorum
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PERSONAS.map((p) => (
                <PersonaCard key={p} persona={p} state={stages[p]} />
              ))}
            </div>
          </div>

          {synthesis.status !== 'pending' && (
            <div className="rounded-xl border border-signal-amber/30 bg-signal-navy p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-signal-amber">
                Synthesis
              </p>
              <div className="mt-2 text-sm text-zinc-200">
                {synthesis.status === 'start' && (
                  <span className="animate-pulse text-zinc-400">
                    Synthesizing…
                  </span>
                )}
                {synthesis.status === 'skipped' && (
                  <span className="text-zinc-500">{synthesis.reason}</span>
                )}
                {synthesis.status === 'done' && <p>{synthesis.content}</p>}
              </div>
            </div>
          )}

          {(critique.status !== 'pending' || revised.status !== 'pending') && (
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-zinc-400">
                Loop
              </p>
              <div className="mt-3 space-y-3">
                {critique.status !== 'pending' && (
                  <div className="rounded-xl border border-signal-rose/30 bg-signal-navy p-4">
                    <p className="font-mono text-xs uppercase tracking-wide text-signal-rose">
                      Critique
                    </p>
                    <div className="mt-2 text-sm text-zinc-200">
                      {critique.status === 'start' && (
                        <span className="animate-pulse text-zinc-400">
                          Critiquing the synthesis…
                        </span>
                      )}
                      {critique.status === 'skipped' && (
                        <span className="text-zinc-500">{critique.reason}</span>
                      )}
                      {critique.status === 'done' && <p>{critique.content}</p>}
                    </div>
                  </div>
                )}
                {revised.status !== 'pending' && (
                  <div className="rounded-xl border border-signal-amber/30 bg-signal-navy p-4">
                    <p className="font-mono text-xs uppercase tracking-wide text-signal-amber">
                      Revised synthesis
                    </p>
                    <div className="mt-2 text-sm text-zinc-200">
                      {revised.status === 'start' && (
                        <span className="animate-pulse text-zinc-400">
                          Revising…
                        </span>
                      )}
                      {revised.status === 'skipped' && (
                        <span className="text-zinc-500">{revised.reason}</span>
                      )}
                      {revised.status === 'done' && <p>{revised.content}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {anyReactionStarted && (
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-zinc-400">
                Final word
              </p>
              <ul className="mt-3 space-y-2">
                {PERSONAS.map((p) => {
                  const state = stages[`reaction-${p}`]
                  if (state.status === 'pending') return null
                  return (
                    <li
                      key={p}
                      className="rounded-lg border border-white/10 bg-signal-navy px-4 py-3 text-sm text-zinc-200"
                    >
                      <span className="font-mono text-xs uppercase tracking-wide text-signal-teal">
                        {PERSONA_LABELS[p]}:{' '}
                      </span>
                      {state.status === 'start' && (
                        <span className="animate-pulse text-zinc-400">
                          Reacting…
                        </span>
                      )}
                      {state.status === 'skipped' && (
                        <span className="text-zinc-500">{state.reason}</span>
                      )}
                      {state.status === 'done' && <span>{state.content}</span>}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
