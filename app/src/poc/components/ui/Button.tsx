import type { ReactNode, MouseEvent } from 'react'

/* ── Types ─────────────────────────────────────────────────────────────────
   Spec: ds-components-buttons.md
   ────────────────────────────────────────────────────────────────────────── */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize    = 'xs' | 's' | 'm' | 'l' | 'xl'

export interface ButtonProps {
  variant?:      ButtonVariant
  size?:         ButtonSize
  /** Functionally disables: pointer-events none + disable tokens */
  disabled?:     boolean
  /**
   * Accessible disabled: renders aria-disabled="true" without removing focus.
   * Use when the button must remain reachable (e.g. submit locked until form valid).
   * Mutually exclusive with `disabled` — ariaDisabled takes precedence.
   */
  ariaDisabled?: boolean
  /** Shows an inline spinner; also sets aria-busy="true" */
  loading?:      boolean
  onClick?:      (e: MouseEvent<HTMLButtonElement>) => void
  children:      ReactNode
  /** Forwarded to the <button> element */
  type?:         'button' | 'submit' | 'reset'
  className?:    string
}

/* ── Size tokens ────────────────────────────────────────────────────────────
   Heights from DS spec; padding H = 16px (--spacing-inset-s) for all sizes.
   ────────────────────────────────────────────────────────────────────────── */
const SIZE_HEIGHT: Record<ButtonSize, number> = {
  xs: 24,
  s:  32,
  m:  40,
  l:  48,
  xl: 64,
}

/* ── Variant style maps ─────────────────────────────────────────────────────
   Static (non-interactive) CSS via inline style.
   Hover / active are handled via injected <style> using class names.
   ────────────────────────────────────────────────────────────────────────── */
interface VariantTokens {
  bg:          string
  color:       string
  border:      string
  bgHover:     string
  bgActive:    string
  colorHover:  string
  colorActive: string
  borderHover: string
}

const VARIANT_TOKENS: Record<ButtonVariant, VariantTokens> = {
  primary: {
    bg:          'var(--color-background-primary)',
    color:       'var(--color-text-inverse)',
    border:      'transparent',
    bgHover:     'var(--color-background-primary-hover)',
    bgActive:    'var(--color-background-primary-active)',
    colorHover:  'var(--color-text-inverse)',
    colorActive: 'var(--color-text-inverse)',
    borderHover: 'transparent',
  },
  secondary: {
    bg:          'var(--color-background-secondary)',
    color:       'var(--color-text-inverse)',
    border:      'transparent',
    bgHover:     'var(--color-background-secondary-hover)',
    bgActive:    'var(--color-background-secondary-active)',
    colorHover:  'var(--color-text-inverse)',
    colorActive: 'var(--color-text-inverse)',
    borderHover: 'transparent',
  },
  ghost: {
    bg:          'transparent',
    color:       'var(--color-text-secondary)',
    border:      'transparent',
    bgHover:     'transparent',
    bgActive:    'transparent',
    colorHover:  'var(--color-text-secondary-hover)',
    colorActive: 'var(--color-text-secondary-active)',
    borderHover: 'transparent',
  },
}

/* ── Spinner ────────────────────────────────────────────────────────────── */
function Spinner({ size }: { size: number }) {
  const dim = Math.max(12, Math.floor(size * 0.4))
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ animation: 'btn-spin 0.8s linear infinite', flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/* ── Component ──────────────────────────────────────────────────────────── */
export function Button({
  variant     = 'primary',
  size        = 'm',
  disabled    = false,
  ariaDisabled = false,
  loading     = false,
  onClick,
  children,
  type        = 'button',
  className   = '',
}: ButtonProps) {
  const tokens   = VARIANT_TOKENS[variant]
  const height   = SIZE_HEIGHT[size]
  const isInert  = disabled || (ariaDisabled && !loading)

  // aria-disabled mode: keep element focusable, suppress click
  const handleClick = ariaDisabled && !disabled
    ? (e: MouseEvent<HTMLButtonElement>) => e.preventDefault()
    : onClick

  const disabledStyle: React.CSSProperties = isInert ? {
    backgroundColor: 'var(--color-background-disable)',
    color:           'var(--color-text-disable)',
    borderColor:     'transparent',
    pointerEvents:   'none',
  } : {}

  return (
    <>
      {/* Scoped animation keyframe — injected once, idempotent via class name */}
      <style>{`
        @keyframes btn-spin { to { transform: rotate(360deg); } }
        .btn-oe {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 2px solid transparent;
          border-radius: var(--radius-smooth);
          font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
          font-size: var(--type-body-s-size, 16px);
          font-weight: var(--type-weight-medium, 500);
          line-height: 1;
          cursor: pointer;
          white-space: nowrap;
          transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
          padding: 0 var(--spacing-inset-s, 16px);
        }
        .btn-oe:focus-visible {
          outline: none;
          box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
        }
        .btn-oe:not([disabled]):not([aria-disabled="true"]).btn-primary:hover  { background-color: var(--color-background-primary-hover); }
        .btn-oe:not([disabled]):not([aria-disabled="true"]).btn-primary:active { background-color: var(--color-background-primary-active); }
        .btn-oe:not([disabled]):not([aria-disabled="true"]).btn-secondary:hover  { background-color: var(--color-background-secondary-hover); }
        .btn-oe:not([disabled]):not([aria-disabled="true"]).btn-secondary:active { background-color: var(--color-background-secondary-active); }
        .btn-oe:not([disabled]):not([aria-disabled="true"]).btn-ghost:hover  { color: var(--color-text-secondary-hover); }
        .btn-oe:not([disabled]):not([aria-disabled="true"]).btn-ghost:active { color: var(--color-text-secondary-active); }
      `}</style>

      <button
        // eslint-disable-next-line react/button-has-type
        type={type}
        disabled={disabled}
        aria-disabled={ariaDisabled || disabled || undefined}
        aria-busy={loading || undefined}
        onClick={handleClick}
        className={`btn-oe btn-${variant} ${className}`}
        style={{
          height,
          backgroundColor: isInert ? 'var(--color-background-disable)' : tokens.bg,
          color:           isInert ? 'var(--color-text-disable)'        : tokens.color,
          borderColor:     isInert ? 'transparent'                      : tokens.border,
          ...disabledStyle,
        }}
      >
        {loading && <Spinner size={height} />}
        {children}
      </button>
    </>
  )
}
