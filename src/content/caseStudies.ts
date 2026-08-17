export interface CaseStudy {
  slug: string
  client: string
  problem: string
  approach: string
  outcome: string
  stack: string[]
  href?: string
  linkLabel?: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'dubclub',
    client: 'DubClub',
    problem:
      'Founding team needed to know if their subscriber funnel could survive without paid acquisition — the churn signal was hidden in the data, not the docs.',
    approach:
      'Audited the app, led UX interviews directly with both co-founders, then built a full-stack proof of concept to surface subscriber signal in real time.',
    outcome:
      "Live prototype validated a durable signal the founders hadn't named yet — presented directly to both co-founders.",
    stack: ['Full-stack PoC', 'UX research', 'Stakeholder presentation'],
    href: 'https://subscriber-signal-experiment.vercel.app',
    linkLabel: 'View live prototype',
  },
  {
    slug: 'superstar-agency',
    client: 'Superstar Agency',
    problem:
      'A white-label voice-AI agency needed to turn a manual, one-off demo-recording process into something repeatable across clients.',
    approach:
      'Built an agentic OS on Hermes, wiring ElevenLabs voice AI and GPT-based video generation into an automated proof-of-concept and demo pipeline for an email-marketing product.',
    outcome:
      'Cut manual production time by roughly 20%, turning bespoke demos into a repeatable pipeline.',
    stack: [
      'Agentic workflows',
      'ElevenLabs',
      'GPT video generation',
      'Python',
    ],
  },
  {
    slug: 'sapphire-studios',
    client: 'Sapphire Studios',
    problem:
      'Two platforms serving 5,500 combined users were slow, and nobody had asked the people using them why.',
    approach:
      'Interviewed and hired a UX researcher to audit the platform firsthand, then led the JS-to-HTMX frontend migration the research pointed to.',
    outcome: 'Cut page load times 10% across both platforms.',
    stack: ['HTMX', 'Python', 'Redis', 'Twilio', 'Slack API'],
  },
]
