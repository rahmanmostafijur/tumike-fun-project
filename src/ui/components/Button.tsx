import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../util'
import { Icon, type IconName } from './Icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconName
  children: ReactNode
}

/** 56px accent button with dark text. One per screen. */
export function PrimaryButton({ icon, children, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'press flex h-14 w-full items-center justify-center gap-2.5 rounded-[14px] bg-accent px-5',
        'font-display text-[18px] leading-none text-on-accent disabled:opacity-60',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={20} strokeWidth={2} />}
      <span className="pt-0.5">{children}</span>
    </button>
  )
}

/** 48px transparent button with a 1px line border. */
export function SecondaryButton({ icon, children, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'press flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-line px-4',
        'text-[15px] font-semibold text-ink hover:border-muted/60 disabled:opacity-60',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  label: string
}

/** Round 44px icon button. Always labelled for screen readers. */
export function IconButton({ icon, label, className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx('press grid size-11 shrink-0 place-items-center rounded-full border border-line bg-bg/60 text-ink', className)}
      {...rest}
    >
      <Icon name={icon} size={20} />
    </button>
  )
}
