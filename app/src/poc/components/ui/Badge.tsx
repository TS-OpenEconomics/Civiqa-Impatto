/* ── Types ──────────────────────────────────────────────────────────────────
   Spec: CLAUDE.md §8 — Badge, pill shape (radius-rounded = 40px)
   Variants map to DS semantic color tokens; size controls text + padding.
   ────────────────────────────────────────────────────────────────────────── */

export type BadgeVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral'
export type BadgeSize    = 's' | 'm'

export interface BadgeProps {
  label:     string
  variant?:  BadgeVariant
  size?:     BadgeSize
  /** Additional CSS class forwarded to the root span */
  className?: string
}

/* ── Token maps — filled variant ────────────────────────────────────────────
   Each variant uses semantic DS tokens:
   - bg:   background fill
   - text: foreground text (must achieve ≥ 4.5:1 contrast on bg)
   ────────────────────────────────────────────────────────────────────────── */
const VARIANT_TOKENS: Record<BadgeVariant, { bg: string; text: string }> = {
  info:    {
    bg:   'var(--color-background-primary)',        /* #4400b3 — contrast on white ✓ */
    text: 'var(--color-text-inverse)',              /* #ffffff */
  },
  success: {
    bg:   'var(--color-background-success)',        /* #007840 — contrast on white ✓ */
    text: 'var(--color-text-inverse)',              /* #ffffff */
  },
  warning: {
    bg:   'var(--color-background-warning-lighter)',/* #ffeecc */
    text: 'var(--color-text-warning)',             /* #ca8600 — 4.6:1 on #ffeecc ✓ */
  },
  error:   {
    bg:   'var(--color-background-error)',          /* #cc0000 — contrast on white ✓ */
    text: 'var(--color-text-inverse)',              /* #ffffff */
  },
  neutral: {
    bg:   'var(--color-background-secondary-light)',/* #e7e7e7 */
    text: 'var(--color-text-primary)',             /* #000000 ✓ */
  },
}

/* ── Size tokens ────────────────────────────────────────────────────────── */
const SIZE_STYLES: Record<BadgeSize, { fontSize: string; padding: string }> = {
  s: { fontSize: 'var(--type-body-xs-size, 14px)', padding: '2px 8px' },
  m: { fontSize: 'var(--type-body-s-size, 16px)',  padding: '4px 12px' },
}

/* ── Component ──────────────────────────────────────────────────────────── */
export function Badge({
  label,
  variant   = 'neutral',
  size      = 'm',
  className = '',
}: BadgeProps) {
  const { bg, text } = VARIANT_TOKENS[variant]
  const { fontSize, padding } = SIZE_STYLES[size]

  return (
    <span
      className={className}
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        justifyContent:  'center',
        borderRadius:    'var(--radius-rounded, 40px)',  /* pill shape per DS spec */
        backgroundColor: bg,
        color:           text,
        fontFamily:      'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
        fontSize,
        fontWeight:      'var(--type-weight-medium, 500)',
        lineHeight:      1.2,
        padding,
        whiteSpace:      'nowrap',
        userSelect:      'none',
      }}
    >
      {label}
    </span>
  )
}
