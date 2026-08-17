import Link from 'next/link'

import { ContainerInner, ContainerOuter } from '@/components/Container'
import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'

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

function FooterSocialLink({
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
      className="group -m-1 rounded-full p-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-amber"
    >
      <Icon className="h-5 w-5 fill-signal-paper-dim transition group-hover:fill-signal-amber" />
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-signal-navy-2 pb-10 pt-10">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <p className="font-display text-sm font-medium text-signal-paper">
                Robert Neyrinck
              </p>
              <div className="flex items-center gap-5">
                <FooterSocialLink
                  href="https://github.com/rneyrinck"
                  label="GitHub"
                  icon={GitHubIcon}
                />
                <FooterSocialLink
                  href="https://www.linkedin.com/in/robert-neyrinck/"
                  label="LinkedIn"
                  icon={LinkedInIcon}
                />
                <FooterSocialLink
                  href="mailto:robert.a.neyrinck@gmail.com"
                  label="Email"
                  icon={MailIcon}
                />
              </div>
              <p className="text-sm text-signal-paper-dim">
                &copy; {new Date().getFullYear()} Robert Neyrinck.
              </p>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
