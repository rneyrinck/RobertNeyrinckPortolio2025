import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Robert Neyrinck.',
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z" />
      <path d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6" />
    </svg>
  )
}

export default function Contact() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Let&rsquo;s talk.
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          The fastest way to reach me is email. No form to fill out — just
          write.
        </p>
        <div className="mt-10">
          <a
            href="mailto:robert.a.neyrinck@gmail.com"
            className="group inline-flex items-center gap-3 rounded-md bg-zinc-800 px-5 py-3 text-base font-semibold text-zinc-100 outline-offset-2 transition hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-teal active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            <MailIcon className="h-5 w-5 flex-none" />
            robert.a.neyrinck@gmail.com
          </a>
        </div>
        <div className="mt-8 flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a
            href="https://www.linkedin.com/in/robert-neyrinck/"
            className="group inline-flex items-center gap-2 transition hover:text-signal-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-teal"
          >
            <LinkedInIcon className="h-5 w-5 flex-none fill-zinc-500 transition group-hover:fill-signal-teal" />
            LinkedIn
          </a>
          <a
            href="https://github.com/rneyrinck"
            className="group inline-flex items-center gap-2 transition hover:text-signal-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-teal"
          >
            <GitHubIcon className="h-5 w-5 flex-none fill-zinc-500 transition group-hover:fill-signal-teal" />
            GitHub
          </a>
        </div>
      </div>
    </Container>
  )
}
