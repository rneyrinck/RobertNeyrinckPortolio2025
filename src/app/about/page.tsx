import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-signal-paper transition hover:text-signal-amber"
      >
        <Icon className="h-6 w-6 flex-none fill-signal-paper-dim transition group-hover:fill-signal-amber" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

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

export const metadata: Metadata = {
  title: 'About',
  description:
    'Robert Neyrinck — a B2B consultant turned software engineer who finds and builds solutions through UX research, business acumen, and stakeholder relations.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-signal-navy-2 object-cover"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="font-display text-4xl font-bold tracking-tight text-signal-paper sm:text-5xl">
            I spent three years selling technical solutions before I ever wrote
            a line of code.
          </h1>
          <div className="mt-6 space-y-7 text-base text-signal-paper-dim">
            <p>
              I started my career as a B2B account executive, closing complex
              technical deals for operational teams — nearly $2.9M in
              managed-service contracts in my first year, and Salesman of the
              Year to show for it. What that job actually taught me had less to
              do with selling and more to do with listening: stakeholders rarely
              describe the problem accurately on the first pass, and the
              difference between a deal that sticks and one that doesn’t usually
              comes down to whether you found the real need underneath the ask.
            </p>
            <p>
              A layoff during the pandemic gave me a hard stop to sit with that.
              I went back to school, picked up software engineering at General
              Assembly, and started applying the same instinct — find the real
              problem, then build the thing that solves it — to code instead of
              contracts. At AudioEye, that meant remediating accessibility
              issues on production sites for the actual people who hit them. At
              Sapphire Studios, it meant not trusting my own assumptions about
              why two platforms serving 5,500 users felt slow: I interviewed and
              hired a UX researcher to find out, then led the JS-to-HTMX
              migration her findings pointed to.
            </p>
            <p>
              When I founded Frontpage, I was the only engineer, which meant
              there was no layer between me and the people using what I built. I
              stayed close to our first 50 early users — not through a single
              big stakeholder meeting, but through the slow, ongoing work of
              watching what they actually did with the product and shipping
              toward that instead of a roadmap I’d written in advance.
            </p>
            <p>
              These days I move between consulting engagements — auditing a
              sports-betting app’s subscriber funnel for DubClub, building an
              agentic demo-generation pipeline for Superstar Agency — but the
              loop is the same one I learned selling and relearned building:
              understand the business problem, get close to the people living
              with it, and ship something that actually holds up.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink
              href="https://github.com/rneyrinck"
              icon={GitHubIcon}
              className="mt-4"
            >
              Follow on GitHub
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/robert-neyrinck/"
              icon={LinkedInIcon}
              className="mt-4"
            >
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:robert.a.neyrinck@gmail.com"
              icon={MailIcon}
              className="mt-8 border-t border-signal-navy-2 pt-8"
            >
              robert.a.neyrinck@gmail.com
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
