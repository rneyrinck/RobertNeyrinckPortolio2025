import { type PersonaKey, type StageName } from '@/lib/quorumLoop/types'

// Static, pre-computed Quorum + Loop transcripts. These exist so a visitor
// can see the full sequence — three personas, the Loop critique/revise
// pass, and the final reactions — instantly, with zero API cost and no
// captcha. They are real example runs, not live model output; the widget
// makes that distinction clear in the UI.

export interface PresetStage {
  status: 'done' | 'skipped'
  content?: string
  reason?: string
}

export interface QuorumPreset {
  id: string
  label: string
  question: string
  stages: Record<StageName, PresetStage>
}

function personaStages(
  engineer: string,
  business: string,
  stakeholder: string,
): Record<PersonaKey, PresetStage> {
  return {
    engineer: { status: 'done', content: engineer },
    business: { status: 'done', content: business },
    stakeholder: { status: 'done', content: stakeholder },
  }
}

function reactionStages(
  engineer: string,
  business: string,
  stakeholder: string,
): Record<`reaction-${PersonaKey}`, PresetStage> {
  return {
    'reaction-engineer': { status: 'done', content: engineer },
    'reaction-business': { status: 'done', content: business },
    'reaction-stakeholder': { status: 'done', content: stakeholder },
  }
}

export const QUORUM_PRESETS: QuorumPreset[] = [
  {
    id: 'dubclub-auth',
    label: 'DubClub: build or buy auth?',
    question:
      'Should DubClub build its own auth system, or use a third-party provider like Clerk or Auth0?',
    stages: {
      ...personaStages(
        "Buy it. Auth is a solved problem with a huge blast radius if we get it wrong — session handling, password resets, OAuth edge cases. Clerk or Auth0 gets us production-grade auth in a day instead of weeks, and we can always migrate off later if we outgrow it.",
        "Every week we spend on auth is a week we're not validating whether subscribers actually want this product. Buying auth is cheap relative to our runway, and it lets us keep the team focused on the subscriber-signal experiment that's the actual open question.",
        "As a user I don't care who built the login screen — I care that it works, that password reset doesn't break, and that my account is secure. Whatever gets there fastest without bugs is fine by me.",
      ),
      synthesis: {
        status: 'done',
        content:
          "All three land in the same place: buy, don't build. The engineering risk of rolling custom auth is high for a problem that's already solved well, the business cost of the delay outweighs any savings, and the end user has no preference either way. Use a managed provider (Clerk/Auth0) and put the saved time into the subscriber-signal validation work that actually needs custom engineering.",
      },
      'loop-critique': {
        status: 'done',
        content:
          "The synthesis assumes 'buy' has no downside, but it skips a real cost: vendor lock-in and per-user pricing that scales badly if DubClub's subscriber base grows past a few thousand users. It also doesn't address what happens to auth if the vendor has an outage during a live betting event — worth at least naming as a monitored risk rather than ignoring it.",
      },
      'loop-revise': {
        status: 'done',
        content:
          "All three land in the same place: buy, don't build — the engineering risk of custom auth is high for a solved problem, the business cost of delay outweighs any near-term savings, and the end user has no preference either way. Use a managed provider (Clerk/Auth0) now, but revisit the cost curve once the subscriber base scales past a few thousand users, and add basic monitoring so an auth-vendor outage during a live event gets caught immediately instead of silently.",
      },
      ...reactionStages(
        "Fair catch on lock-in — I'd add a thin adapter layer around the auth calls so swapping providers later isn't a rewrite, just a config change.",
        "Agreed on revisiting at scale. I'll flag the per-user pricing tiers now so it's not a surprise later, not a blocker today.",
        "Outage monitoring is the part I actually care about — as long as I'm not locked out during a game, the rest is invisible to me.",
      ),
    },
  },
  {
    id: 'frontpage-ship',
    label: 'Frontpage: polish onboarding or ship now?',
    question:
      "Do we keep polishing onboarding, or ship the rough version to real users this week?",
    stages: {
      ...personaStages(
        "Ship it. I can keep refining onboarding in a vacuum for weeks and still guess wrong about where people actually get stuck. Real usage data from even 10 users this week beats another week of my own assumptions.",
        "We have zero signal on whether anyone wants this product yet. Polishing an onboarding flow nobody's used is optimizing a guess. Ship the rough version, watch the first 50 users, and let their behavior tell us what's actually broken.",
        "I'd rather use something rough today and tell you what's confusing than wait for something polished that might still miss what I actually need. Just be ready to fix things fast once I hit them.",
      ),
      synthesis: {
        status: 'done',
        content:
          "Unanimous: ship now. Every persona converges on the same risk — polishing in isolation is optimizing against assumptions instead of real behavior. Get the rough version in front of the first users this week, watch what they actually do, and let that data — not more internal guessing — decide what gets polished next.",
      },
      'loop-critique': {
        status: 'done',
        content:
          "The synthesis is directionally right but glosses over a real risk: 'rough' can also mean 'broken enough that early users bounce and never come back.' It should distinguish between rough-but-functional and rough-in-a-way-that-kills-first-impressions before treating all roughness as acceptable.",
      },
      'loop-revise': {
        status: 'done',
        content:
          "Unanimous: ship now, not later — polishing onboarding in isolation is optimizing against assumptions instead of real user behavior. But 'rough' needs a floor: ship the version that's unpolished but functional, not one with broken paths that burn the first impression with early users. Get it in front of the first cohort this week, watch what they actually do, and let that data decide what gets polished next.",
      },
      ...reactionStages(
        "Good line to draw — I'll smoke-test the core signup-to-first-value path specifically before we ship, and let everything else stay rough.",
        "That's the right bar. I'd rather delay a day to fix a broken path than burn our only shot at a first impression with 50 users.",
        "That's exactly it — rough is fine, confusing-to-the-point-I-give-up isn't.",
      ),
    },
  },
  {
    id: 'sapphire-rewrite',
    label: 'Sapphire Studios: rewrite or patch?',
    question:
      'The platform feels slow and 5,500 users are complaining. Do we do a full rewrite or patch the current stack?',
    stages: {
      ...personaStages(
        "Neither, yet — we don't actually know why it's slow. A full rewrite is months of risk against a guess, and patching blind just treats symptoms. I'd want real profiling and a UX researcher's read on what 'slow' means to users before committing to either path.",
        "A rewrite is the most expensive option we have, both in time and in the opportunity cost of not shipping anything else for months. Before I'd sign off on that, I need evidence it's actually necessary — not just that the platform 'feels' slow.",
        "All I know is pages take too long to load and I click away. I don't care if it's a rewrite or a patch — I care about it being fast, and about not losing more features while you two figure it out.",
      ),
      synthesis: {
        status: 'done',
        content:
          "Converged conclusion: investigate before committing to either extreme. Bring in research to find the actual bottleneck rather than assuming a rewrite is needed, because the cost of a wrong-sized fix — under-patching a real architectural problem or over-rewriting a fixable one — is higher than the cost of a short research phase.",
      },
      'loop-critique': {
        status: 'done',
        content:
          "The synthesis is sound but vague on what 'investigate' actually means in practice — it should specify who does the research and roughly how long that phase should run, or it risks becoming an open-ended delay that never resolves into a decision.",
      },
      'loop-revise': {
        status: 'done',
        content:
          "Converged conclusion: investigate before committing to either extreme — the cost of a wrong-sized fix outweighs a short research phase. Concretely: bring in a UX researcher for a time-boxed 1-2 week diagnosis of where users actually feel the slowness, then decide between a targeted migration (like the JS-to-HTMX move that followed) and a full rewrite based on what that research actually shows, not on assumption.",
      },
      ...reactionStages(
        "A time-boxed diagnosis is exactly what let us find the real bottleneck without guessing — that's what led to the HTMX migration instead of a rewrite.",
        "Two weeks of research is a much easier sell than 'let's rewrite it' — and it paid for itself the moment we found we could avoid the rewrite entirely.",
        "As long as I see load times actually drop, I don't care what the research was called.",
      ),
    },
  },
]
