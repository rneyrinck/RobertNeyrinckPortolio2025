import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Robert Neyrinck.',
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

export default function Contact() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-signal-paper sm:text-5xl">
          Let&rsquo;s talk.
        </h1>
        <p className="mt-6 text-base text-signal-paper-dim">
          The fastest way to reach me is email. No form to fill out — just
          write.
        </p>
        <div className="mt-10">
          <a
            href="mailto:robert.a.neyrinck@gmail.com"
            className="group inline-flex items-center gap-3 rounded-md bg-signal-amber px-5 py-3 text-base font-semibold text-signal-navy outline-offset-2 transition hover:bg-signal-amber/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-amber active:bg-signal-amber active:text-signal-navy/70"
          >
            <MailIcon className="h-5 w-5 flex-none fill-signal-navy" />
            robert.a.neyrinck@gmail.com
          </a>
          <p className="mt-2 text-xs text-signal-paper-dim">
            Opens in your email app.
          </p>
        </div>
        <div className="mt-8 flex gap-6 text-sm font-medium text-signal-paper-dim">
          <a
            href="https://www.linkedin.com/in/robert-neyrinck/"
            className="group inline-flex items-center gap-2 transition hover:text-signal-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-amber"
          >
            <LinkedInIcon className="h-5 w-5 flex-none fill-signal-paper-dim transition group-hover:fill-signal-amber" />
            LinkedIn
          </a>
          <a
            href="https://github.com/rneyrinck"
            className="group inline-flex items-center gap-2 transition hover:text-signal-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-amber"
          >
            <GitHubIcon className="h-5 w-5 flex-none fill-signal-paper-dim transition group-hover:fill-signal-amber" />
            GitHub
          </a>
        </div>
      </div>
    </Container>
  )
}
