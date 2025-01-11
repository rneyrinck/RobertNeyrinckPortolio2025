import {type Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import {Container} from '@/components/Container'
import {GitHubIcon, InstagramIcon, LinkedInIcon, XIcon,} from '@/components/SocialIcons'
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
                className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
            >
                <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500"/>
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
        'I’m Robert Neyrinck. I live in Chicago, where I make things that make peoples lives easier.',
}

export default function About() {
    return (
        <Container className="mt-16 sm:mt-32">
            <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
                <div className="lg:pl-20">
                    <div className="max-w-xs px-2.5 lg:max-w-none">
                        <Image
                            src={portraitImage}
                            alt=""
                            sizes="(min-width: 1024px) 32rem, 20rem"
                            className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
                        />
                    </div>
                </div>
                <div className="lg:order-first lg:row-span-2">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
                        I’m Robert Neyrinck. I live in Chicago, where I make tools that make peoples lives easier.
                    </h1>
                    <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
                        <p>
                            I’ve always gravitated toward scrappy, do-it-yourself problem-solving. Growing up on a horse
                            farm near Toledo, I learned that almost any challenge could be tackled if you approached it
                            with enough creativity—whether it was devising a better way to haul hay or training horses
                            to sell for profit. Later, when I was juggling sales gigs, touring with a band, or even
                            living out of my hatchback, that same resourceful spirit kept me moving forward.
                        </p>
                        <p>
                            In time, I discovered software engineering—the perfect outlet for my need to build practical
                            solutions. After honing my coding skills and cutting my teeth in tech roles, I co-founded
                            Frontpage, a platform aimed at leveling up personal branding. But I didn’t stop there.
                            Lately,
                            I’ve been channeling my love for solving human problems into a bunch of new projects:
                        </p>
                        <ul>
                            <li>
                                <b>Auto Resume and Cover Letter Creator</b> – Tools to help job-seekers present
                                themselves
                                powerfully
                                and confidently.
                            </li>
                            <li>
                                <b>Allowance-Based Banking App</b> – A way to break the paycheck-to-paycheck cycle and
                                promote
                                healthier money habits.
                            </li>
                            <li>
                                <b>Anti-Bot Middleware</b> – A solution to keep social media real by cutting down on
                                automated
                                accounts
                                and fostering genuine human connection.
                            </li>
                        </ul>
                        <p>
                            All of these projects connect back to the same driving force I felt on the farm: if you can
                            spot
                            the need, you can invent a way to meet it. Today, whether I’m coding, designing workflows,
                            or
                            dreaming up AI-powered features, I’m still that kid who knows there’s almost always a clever
                            way
                            to make life easier—and I’m determined to find it.
                        </p>
                    </div>
                </div>
                <div className="lg:pl-20">
                    <ul role="list">
                        <SocialLink href="https://www.instagram.com/mac_and_bees/" icon={InstagramIcon} className="mt-4">
                            Follow on Instagram
                        </SocialLink>
                        <SocialLink href="https://github.com/rneyrinck" icon={GitHubIcon} className="mt-4">
                            Follow on GitHub
                        </SocialLink>
                        <SocialLink href="https://www.linkedin.com/in/robert-neyrinck/" icon={LinkedInIcon} className="mt-4">
                            Follow on LinkedIn
                        </SocialLink>
                        <SocialLink
                            href="mailto:robert.neyrinck@frontpage.bio"
                            icon={MailIcon}
                            className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
                        >
                            robert.neyrinck@frontpage.bio
                        </SocialLink>
                        <SocialLink
                            href="mailto:robert.a.neyrinck@gmail.com"
                            icon={MailIcon}
                            className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
                        >
                            robert.a.neyrinck@gmail.com
                        </SocialLink>
                    </ul>
                </div>
            </div>
        </Container>
    )
}
