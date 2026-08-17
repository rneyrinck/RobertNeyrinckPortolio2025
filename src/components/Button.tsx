import Link from 'next/link'
import clsx from 'clsx'

const variantStyles = {
  primary:
    'bg-signal-amber font-semibold text-signal-navy hover:bg-signal-amber/90 active:bg-signal-amber active:text-signal-navy/70',
  secondary:
    'bg-signal-navy-2 font-medium text-signal-paper ring-1 ring-white/10 hover:bg-signal-navy-2/70 hover:text-white active:bg-signal-navy-2 active:text-signal-paper/70',
}

type ButtonProps = {
  variant?: keyof typeof variantStyles
} & (
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
  | React.ComponentPropsWithoutRef<typeof Link>
)

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  className = clsx(
    'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none',
    variantStyles[variant],
    className,
  )

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}
