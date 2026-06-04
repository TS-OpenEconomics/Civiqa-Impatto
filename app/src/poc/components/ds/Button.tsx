import type { ButtonHTMLAttributes, ReactNode } from 'react'

/* ─── DS Bridge: Button ───────────────────────────────────────────────────────
   Mirrors the Button API of the OE Design System 2.0.
   Variants:
     primary   — solid violet bg (#4400b3), white text
     secondary — solid dark gray bg (#545454), white text
     tertiary  — bordered violet, transparent bg (was "secondary" before alignment)
     ghost     — no border, no bg, violet text
   Sizes: XS (24px), S (32px), M (40px), L (48px), XL (64px)
   Focus ring: box-shadow 0 0 0 3px #0000ff — never outline/ring.
   Migration to @openeconomics/ds = change this import only.
   ─────────────────────────────────────────────────────────────────────────── */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost'
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL'
  trailingIcon?: ReactNode
  children: ReactNode
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  XS: 'h-6 px-2 text-xs gap-1',
  S:  'h-8 px-3 text-sm gap-1.5',
  M:  'h-10 px-4 text-sm gap-2',
  L:  'h-12 px-6 text-base gap-2',
  XL: 'h-16 px-8 text-base gap-2',
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-bluette-700 text-white hover:bg-bluette-900 ' +
    'disabled:bg-gray-200 disabled:text-gray-500',
  secondary:
    'bg-gray-700 text-white hover:bg-gray-900 ' +
    'disabled:bg-gray-200 disabled:text-gray-500',
  tertiary:
    'border-2 border-bluette-700 text-bluette-700 bg-transparent hover:bg-bluette-50 ' +
    'disabled:border-gray-200 disabled:text-gray-500',
  ghost:
    'text-bluette-700 bg-transparent hover:bg-bluette-50 ' +
    'disabled:text-gray-500',
}

export function Button({
  variant = 'primary',
  size = 'M',
  trailingIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center font-semibold transition-colors',
        'focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_#0000ff]',
        'disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
      {trailingIcon && <span aria-hidden="true">{trailingIcon}</span>}
    </button>
  )
}
