import { type Metadata } from 'next'
import Image, { type ImageProps } from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import logoAudioEye from '@/images/logos/audioeye_inc_logo.jpg'
import logoFrontpage from '@/images/logos/frontpage.png'
import logoGeneralAssembly from '@/images/logos/generalassembly_logo.jpg'
import logoSapphireStudios from '@/images/logos/sapphirestudioscontent_logo.jpg'

export const metadata: Metadata = {
  title: 'Resume',
  description: "Robert Neyrinck's work history and CV.",
}

function ArrowDownIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface Role {
  company: string
  title: string
  logo: ImageProps['src']
  start: string | { label: string; dateTime: string }
  end: string | { label: string; dateTime: string }
  summary?: string
}

function RoleItem({ role }: { role: Role }) {
  let startLabel =
    typeof role.start === 'string' ? role.start : role.start.label
  let startDate =
    typeof role.start === 'string' ? role.start : role.start.dateTime

  let endLabel = typeof role.end === 'string' ? role.end : role.end.label
  let endDate = typeof role.end === 'string' ? role.end : role.end.dateTime

  return (
    <li className="flex gap-4">
      <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-signal-navy-2 bg-signal-navy-2 shadow-md shadow-black/20 ring-0">
        <Image
          src={role.logo}
          alt=""
          className="h-7 w-7 rounded-full"
          unoptimized
        />
      </div>
      <dl className="flex flex-auto flex-wrap gap-x-2">
        <dt className="sr-only">Company</dt>
        <dd className="w-full flex-none font-display text-sm font-medium text-signal-paper">
          {role.company}
        </dd>
        <dt className="sr-only">Role</dt>
        <dd className="text-xs text-signal-paper-dim">
          {role.title}
        </dd>
        <dt className="sr-only">Date</dt>
        <dd
          className="ml-auto font-mono text-xs text-signal-paper-dim"
          aria-label={`${startLabel} until ${endLabel}`}
        >
          <time dateTime={startDate}>{startLabel}</time>{' '}
          <span aria-hidden="true">—</span>{' '}
          <time dateTime={endDate}>{endLabel}</time>
        </dd>
        {role.summary && (
          <dd className="mt-1 w-full text-sm text-signal-paper-dim">
            {role.summary}
          </dd>
        )}
      </dl>
    </li>
  )
}

const resume: Array<Role> = [
  {
    company: 'Independent Consulting',
    title: 'Full-Stack & AI Systems Consultant',
    logo: logoFrontpage,
    start: { label: '2024', dateTime: '2024-09' },
    end: { label: 'Present', dateTime: new Date().getFullYear().toString() },
    summary:
      'Concurrent engagements including DubClub, Superstar Agency, and AudioEye — see case studies above.',
  },
  {
    company: 'AudioEye',
    title: 'Software Engineer, Web Accessibility (Contract)',
    logo: logoAudioEye,
    start: { label: '2025', dateTime: '2025-02' },
    end: { label: '2026', dateTime: '2026-06' },
  },
  {
    company: 'Frontpage',
    title: 'Full Stack Engineer / Technical Co-Founder',
    logo: logoFrontpage,
    start: { label: '2024', dateTime: '2024-09' },
    end: { label: '2025', dateTime: '2025-02' },
    summary: 'Built and launched the MVP solo in ~2 months; ~50 early signups.',
  },
  {
    company: 'Sapphire Studios',
    title: 'Full-Stack Developer / Interim Lead Full Stack Engineer',
    logo: logoSapphireStudios,
    start: { label: '2022', dateTime: '2022-11' },
    end: { label: '2024', dateTime: '2024-09' },
  },
  {
    company: 'AudioEye',
    title: 'JavaScript Developer (Contract)',
    logo: logoAudioEye,
    start: { label: '2022', dateTime: '2022-04' },
    end: { label: '2023', dateTime: '2023-05' },
  },
  {
    company: 'General Assembly',
    title: 'Software Engineering Immersive (Certificate)',
    logo: logoGeneralAssembly,
    start: '2021',
    end: '2022',
  },
]

export default function ResumePage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-signal-paper sm:text-5xl">
          Resume
        </h1>
        <p className="mt-6 text-base text-signal-paper-dim">
          Full-stack software engineer (Python/FastAPI/Django, Vue/React,
          AWS/GCP) with web accessibility and AI-agentic integration experience
          — based in Chicago.
        </p>
      </header>
      <div className="mt-16 max-w-2xl sm:mt-20">
        <ol className="space-y-6">
          {resume.map((role, roleIndex) => (
            <RoleItem key={roleIndex} role={role} />
          ))}
        </ol>
        <Button
          href="https://docs.google.com/document/d/e/2PACX-1vTwa-RHyde3DBlPqpXVIP-ziKG2C4rpy5Aon6le06CC7DhHiYq6oYl-17EdkiauZfA4xP2tmkjFTiUf/pub"
          variant="secondary"
          className="group mt-10"
        >
          Download CV
          <ArrowDownIcon className="h-4 w-4 stroke-signal-paper-dim transition group-hover:stroke-signal-paper group-active:stroke-signal-paper" />
        </Button>
      </div>
    </Container>
  )
}
