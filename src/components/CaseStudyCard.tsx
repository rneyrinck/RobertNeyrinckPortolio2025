'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { type CaseStudy } from '@/content/caseStudies'

// Three hand-drawn "noisy → clean" signal readouts, each with a different
// jagged starting pattern, resolved shape, and timing — so the three
// case-study cards don't all play the identical animation. Values are
// illustrative only, not data-driven.
const SIGNAL_VARIANTS = [
  {
    // Rising, resolving into a confident upward curve — a signal getting
    // clearer as the real problem comes into focus.
    noisy: 'M2 38 L19 16 L36 44 L53 12 L70 40 L87 20 L104 42 L121 14 L138 36 L155 22 L172 40 L189 16 L206 38 L223 24 L240 40 L257 18 L275 32 L298 26',
    clean: 'M2 32 C 78 10, 150 12, 224 24 S 276 30, 298 26',
    duration: 1.2,
    delay: 0.45,
    ease: 'easeInOut' as const,
  },
  {
    // Erratic, then a sharp drop that flattens out — a bottleneck getting
    // cut down and staying down.
    noisy: 'M2 14 L18 30 L34 10 L50 34 L66 16 L82 38 L98 12 L114 32 L130 18 L146 36 L162 14 L178 30 L194 20 L210 34 L226 16 L242 30 L266 22 L298 30',
    clean: 'M2 12 C 60 10, 100 16, 140 34 C 175 46, 230 40, 298 40',
    duration: 0.9,
    delay: 0.3,
    ease: 'easeOut' as const,
  },
  {
    // Choppy and uneven, then settles quickly into a flat, steady line —
    // friction resolved, holding steady.
    noisy: 'M2 20 L16 36 L30 14 L44 32 L58 18 L72 40 L86 12 L100 34 L114 22 L128 38 L142 16 L156 30 L172 24 L188 30 L206 26 L232 28 L264 27 L298 28',
    clean: 'M2 16 C 50 34, 90 40, 130 41 C 190 42, 240 41, 298 41',
    duration: 1.4,
    delay: 0.55,
    ease: 'easeInOut' as const,
  },
]

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

function SignalLine({ variant }: { variant: number }) {
  let shouldReduceMotion = useReducedMotion()
  let { noisy, clean, duration, delay, ease } =
    SIGNAL_VARIANTS[variant % SIGNAL_VARIANTS.length]

  return (
    <svg
      viewBox="0 0 300 48"
      preserveAspectRatio="none"
      className="h-12 w-full text-signal-teal"
      aria-hidden="true"
    >
      <motion.path
        d={noisy}
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
        transition={{ duration: duration * 0.65, delay, ease }}
      />
      <motion.path
        d={clean}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={shouldReduceMotion ? false : { pathLength: 0 }}
        whileInView={shouldReduceMotion ? undefined : { pathLength: 1 }}
        animate={shouldReduceMotion ? { pathLength: 1 } : undefined}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration, ease }}
      />
    </svg>
  )
}

export function CaseStudyCard({
  caseStudy,
  index = 0,
}: {
  caseStudy: CaseStudy
  index?: number
}) {
  let shouldReduceMotion = useReducedMotion()
  let {
    client,
    tagline,
    problem,
    approach,
    metric,
    metricLabel,
    stack,
    href,
    linkLabel,
  } = caseStudy

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      animate={shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex h-full flex-col gap-5 rounded-2xl bg-signal-navy-2 p-6 shadow-lg shadow-black/30 ring-1 ring-white/10 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-signal-paper sm:text-2xl">
            {client}
          </h3>
          <p className="mt-1 font-display text-sm font-medium text-signal-paper-dim">
            {tagline}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold text-signal-amber">
            {metric}
          </p>
          <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-signal-paper-dim">
            {metricLabel}
          </p>
        </div>
      </div>

      <SignalLine variant={index} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-signal-rose">
            Problem
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-signal-paper-dim">
            {problem}
          </p>
        </div>
        <div>
          <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-signal-teal">
            Approach
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-signal-paper-dim">
            {approach}
          </p>
        </div>
      </div>

      <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
        {stack.map((item) => (
          <li
            key={item}
            className="rounded-full border border-white/10 bg-signal-navy px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-wide text-signal-paper-dim"
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
