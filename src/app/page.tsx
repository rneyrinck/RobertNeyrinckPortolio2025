import Link from 'next/link'

import { Container } from '@/components/Container'
import { QuorumLoopWidget } from '@/components/quorum/QuorumLoopWidget'
import { SkillsChannels } from '@/components/SkillsChannels'
import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'
import { WorkSection } from '@/components/WorkSection'

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group -m-1 rounded-full p-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-teal"
    >
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

export default function Home() {
  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Software engineer. Recovering salesperson. I ship things people can
            actually use.
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            I&rsquo;m Robert — a full-stack engineer in Chicago building
            backends in Python/FastAPI, frontends in React and Vue, and
            AI-agentic systems that hold up outside a demo. I find the problem
            worth solving, then build the thing that solves it.
          </p>
          <div className="mt-6 flex gap-6">
            <SocialLink
              href="https://github.com/rneyrinck"
              label="GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://www.linkedin.com/in/robert-neyrinck/"
              label="LinkedIn"
              icon={LinkedInIcon}
            />
            <SocialLink
              href="mailto:robert.a.neyrinck@gmail.com"
              label="Email"
              icon={MailIcon}
            />
          </div>
        </div>
      </Container>

      <WorkSection />

      <Container className="mt-24 sm:mt-32">
        <QuorumLoopWidget />
      </Container>

      <SkillsChannels />
    </>
  )
}
