import { type StageName } from './types'

/**
 * Approximate Claude 3.5 Haiku pricing (USD per million tokens). These are
 * intentionally conservative estimates for budget-guarding purposes only —
 * check current pricing at https://www.anthropic.com/pricing before relying
 * on this for real billing reconciliation.
 */
const PRICE_PER_MILLION_INPUT_TOKENS = 1.0
const PRICE_PER_MILLION_OUTPUT_TOKENS = 5.0

export const DEFAULT_BUDGET_USD = Number(
  process.env.QUORUM_LOOP_BUDGET_USD ?? '0.30',
)

/**
 * Very rough token estimate (chars / 4) — good enough for a pre-flight
 * budget check, not meant to be exact. Actual usage is read back from the
 * Anthropic API response after each call and used to update the running
 * total.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export function estimateCostUsd(inputTokens: number, outputTokens: number) {
  return (
    (inputTokens / 1_000_000) * PRICE_PER_MILLION_INPUT_TOKENS +
    (outputTokens / 1_000_000) * PRICE_PER_MILLION_OUTPUT_TOKENS
  )
}

/**
 * Stages ordered from highest to lowest priority. When the running spend
 * plus a stage's projected cost would blow the budget, the tracker skips
 * stages starting from the END of this list (lowest priority first) rather
 * than failing the whole sequence.
 */
export const STAGE_PRIORITY: StageName[] = [
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

export class BudgetTracker {
  private spentUsd = 0
  private readonly capUsd: number

  constructor(capUsd: number = DEFAULT_BUDGET_USD) {
    this.capUsd = capUsd
  }

  get remainingUsd() {
    return Math.max(0, this.capUsd - this.spentUsd)
  }

  get totalSpentUsd() {
    return this.spentUsd
  }

  /**
   * Returns true if a stage with the given projected input/output token
   * counts can run without exceeding the cap.
   */
  canAfford(estimatedInputTokens: number, maxOutputTokens: number): boolean {
    const projected = estimateCostUsd(estimatedInputTokens, maxOutputTokens)
    return this.spentUsd + projected <= this.capUsd
  }

  recordUsage(inputTokens: number, outputTokens: number) {
    this.spentUsd += estimateCostUsd(inputTokens, outputTokens)
  }
}
