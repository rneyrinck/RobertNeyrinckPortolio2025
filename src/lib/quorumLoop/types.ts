export type PersonaKey = 'engineer' | 'business' | 'stakeholder'

export const PERSONA_LABELS: Record<PersonaKey, string> = {
  engineer: 'The Engineer',
  business: 'The Business Owner',
  stakeholder: 'The Stakeholder / User',
}

export type StageName =
  | PersonaKey
  | 'synthesis'
  | 'loop-critique'
  | 'loop-revise'
  | `reaction-${PersonaKey}`

export type StageStatus = 'start' | 'done' | 'skipped' | 'error'

export interface QuorumLoopEvent {
  stage: StageName | 'done' | 'error'
  status: StageStatus
  content?: string
  reason?: string
}

export interface QuorumLoopRequestBody {
  question: string
  turnstileToken?: string
}
