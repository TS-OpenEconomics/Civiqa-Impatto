import type { HTMLAttributes, ReactNode } from 'react'

/* ─── DS Bridge: Card ─────────────────────────────────────────────────────────
   Mirrors the Card API of the OE Design System 2.0.
   Migration to @openeconomics/ds = change this import only.
   ─────────────────────────────────────────────────────────────────────────── */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  shadow?: 's' | 'm' | 'none'
  /** Adds hover:shadow-m + cursor-pointer transition */
  interactive?: boolean
  /** Optional colored header slot — rendered at full width above children */
  header?: ReactNode
  /** Tailwind classes applied to the header wrapper div */
  headerClassName?: string
}

const shadowClasses: Record<NonNullable<CardProps['shadow']>, string> = {
  none: '',
  s:    'shadow-s',
  m:    'shadow-m',
}

export function Card({
  shadow = 's',
  interactive = false,
  header,
  headerClassName = '',
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'bg-white border border-gray-200 overflow-hidden',
        shadowClasses[shadow],
        interactive ? 'hover:shadow-m transition-shadow' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {header && (
        <div className={headerClassName}>
          {header}
        </div>
      )}
      {children}
    </div>
  )
}
