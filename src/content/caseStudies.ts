export interface CaseStudy {
  slug: string
  client: string
  tagline: string
  problem: string
  approach: string
  metric: string
  metricLabel: string
  stack: string[]
  href?: string
  linkLabel?: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'dubclub',
    client: 'DubClub',
    tagline: 'Finding the real gap before building',
    problem:
      'The team had a working app but no signal on where analysis effort was actually paying off for users — feature calls were being made on instinct.',
    approach:
      'Audited the app and ran UX interviews with the founding team before writing code. Built a full-stack PoC targeting the real gap, then presented it for a go/no-go.',
    metric: 'Live PoC',
    metricLabel: 'Shipped to both founders',
    stack: ['Python', 'FastAPI', 'React', 'UX interviews'],
    href: 'https://subscriber-signal-experiment.vercel.app',
    linkLabel: 'View live prototype',
  },
  {
    slug: 'superstar-agency',
    client: 'Superstar Agency',
    tagline: 'Automating the demo bottleneck',
    problem:
      'A white-label email-marketing pipeline needed PoC demos built fast enough to keep sales moving — manual production was the bottleneck.',
    approach:
      'Built an agentic system on Hermes OS, combining ElevenLabs voice AI and GPT-based video generation to automate PoC creation, prototyping, and demo recording end to end.',
    metric: '-20%',
    metricLabel: 'Manual production time',
    stack: ['Hermes OS', 'ElevenLabs', 'GPT video generation', 'Agentic workflows'],
  },
  {
    slug: 'sapphire-studios',
    client: 'Sapphire Studios',
    tagline: 'Research before the rewrite',
    problem:
      'Two platforms serving 5,500 combined users were carrying slow page loads — nobody had validated what was actually driving the friction.',
    approach:
      'Interviewed and hired a UX researcher to audit the platform first. Her findings shaped the case for and scope of a JS-to-HTMX migration across both platforms.',
    metric: '-10%',
    metricLabel: 'Page load time',
    stack: ['JavaScript', 'HTMX', 'UX research', 'Migration strategy'],
  },
]
