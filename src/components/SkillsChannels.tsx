import { Container } from '@/components/Container'

interface SkillsColumn {
  heading: string
  accentBorder: string
  accentText: string
  items: string[]
}

const columns: SkillsColumn[] = [
  {
    heading: 'Builds with',
    accentBorder: 'border-signal-amber',
    accentText: 'text-signal-amber',
    items: [
      'Python',
      'FastAPI',
      'Django',
      'Node.js / Express',
      'REST APIs',
      'Vue.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'AWS',
      'GCP',
      'Docker',
      'GitHub Actions / CircleCI',
      'CI/CD',
      'Playwright',
      'pytest',
      'Jest',
    ],
  },
  {
    heading: 'Runs on',
    accentBorder: 'border-signal-teal',
    accentText: 'text-signal-teal',
    items: [
      'LLM API integration',
      'Prompt design',
      'Structured outputs',
      'Agentic workflows',
      'Claude Code',
    ],
  },
  {
    heading: 'Gets there through',
    accentBorder: 'border-signal-rose',
    accentText: 'text-signal-rose',
    items: [
      'Stakeholder-facing scoping',
      'UX research partnership',
      'RFP / proposal response',
      'Presales',
      'Business acumen',
    ],
  },
]

export function SkillsChannels() {
  return (
    <section id="skills" className="mt-16 sm:mt-32">
      <Container>
        <h2 className="text-3xl font-bold tracking-tight text-signal-paper sm:text-4xl">
          How I work
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {columns.map((column) => (
            <div
              key={column.heading}
              className={`border-t-2 pt-6 ${column.accentBorder}`}
            >
              <h3
                className={`font-display text-lg font-semibold ${column.accentText}`}
              >
                {column.heading}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className="font-mono text-sm text-signal-paper-dim"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
