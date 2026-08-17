'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { type CaseStudy } from '@/content/caseStudies'

// A hand-drawn "noisy" reading — jagged, uneven — that resolves into a
// smooth, confident signal. Values are illustrative only, not data-driven.
const NOISY_PATH =
  'M2 38 L19 16 L36 44 L53 12 L70 40 L87 20 L104 42 L121 14 L138 36 L155 22 L172 40 L189 16 L206 38 L223 24 L240 40 L257 18 L275 32 L298 26'
const CLEAN_PATH = 'M2 32 C 78 10, 150 12, 224 24 S 276 30, 298 26'

function ArrowUpRightIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.5 11.5 11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SignalLine() {
  let shouldReduceMotion = useReducedMotion()

  return (
    <svg
      viewBox="0 0 300 48"
      preserveAspectRatio="none"
      className="h-12 w-full text-signal-teal"
      aria-hidden="true"
    >
      <motion.path
        d={NOISY_PATH}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={shouldReduceMotion ? false : { opacity: 1 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 0 }}
        animate={shouldReduceMotion ? { opacity: 0 } : undefined}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, delay: 0.45, ease: 'easeInOut' }}
      />
      <motion.path
        d={CLEAN_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={shouldReduceMotion ? false : { pathLength: 0 }}
        whileInView={shouldReduceMotion ? undefined : { pathLength: 1 }}
        animate={shouldReduceMotion ? { pathLength: 1 } : undefined}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  let shouldReduceMotion = useReducedMotion()
  let { client, problem, approach, outcome, stack, href, linkLabel } = caseStudy

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      animate={shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex h-full flex-col gap-5 rounded-2xl bg-signal-navy p-6 shadow-lg shadow-black/30 ring-1 ring-white/10 sm:p-8"
    >
      <p className="font-mono text-xs uppercase tracking-wide text-signal-rose">
        {problem}
      </p>

      <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
        {client}
      </h3>

      <SignalLine />

      <p className="text-sm leading-relaxed text-zinc-300">{approach}</p>

      <p className="font-mono text-sm font-semibold text-signal-amber">
        {outcome}
      </p>

      <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
        {stack.map((item) => (
          <li
            key={item}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-wide text-zinc-400"
          >
            {item}
          </li>
        ))}
      </ul>

      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex w-fit items-center gap-1 rounded text-sm font-medium text-signal-teal underline decoration-signal-teal/40 underline-offset-4 transition hover:decoration-signal-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-teal"
        >
          {linkLabel ?? 'View case study'}
          <ArrowUpRightIcon className="h-3.5 w-3.5" />
        </a>
      )}
    </motion.article>
  )
}
