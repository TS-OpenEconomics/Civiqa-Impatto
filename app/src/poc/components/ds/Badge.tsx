import type { HTMLAttributes, ReactNode } from 'react'

/* ─── DS Bridge: Badge ────────────────────────────────────────────────────────
   Mirrors the Badge API of the OE Design System 2.0.
   Migration to @openeconomics/ds = change this import only.
   ─────────────────────────────────────────────────────────────────────────── */

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'filled' | 'outline'
  color?: 'brand' | 'success' | 'warning' | 'error' | 'neutral'
  size?: 'XS' | 'XXS'
  children: ReactNode
}

const filledClasses: Record<NonNullable<BadgeProps['color']>, string> = {
  brand:   'bg-bluette-700 text-white',
  success: 'bg-status-green text-white',
  warning: 'bg-status-orange text-white',
  error:   'bg-status-red text-white',
  neutral: 'bg-gray-700 text-white',
}

const outlineClasses: Record<NonNullable<BadgeProps['color']>, string> = {
  brand:   'border border-bluette-700 text-bluette-700',
  success: 'border border-status-green text-status-green',
  warning: 'border border-status-orange text-status-orange',
  error:   'border border-status-red text-status-red',
  neutral: 'border border-gray-700 text-gray-700',
}

const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  XS:  'px-2 py-0.5 text-xs',
  XXS: 'px-1.5 py-px text-[11px]',
}

export function Badge({
  variant = 'filled',
  color = 'neutral',
  size = 'XS',
  children,
  className = '',
  ...props
}: BadgeProps) {
  const colorClass = variant === 'filled' ? filledClasses[color] : outlineClasses[color]
  return (
    <span
      className={['inline-flex items-center font-medium', sizeClasses[size], colorClass, className].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}
