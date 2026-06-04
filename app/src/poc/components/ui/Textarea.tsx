import { useId, useState, useRef, type ChangeEvent } from 'react'

/* ── Types ──────────────────────────────────────────────────────────────────
   Spec: ds-components-inputs.md §6 — Input Text Area
   Same ARIA pattern as InputField; counter announces every 100 chars.
   ────────────────────────────────────────────────────────────────────────── */

export interface TextareaProps {
  label:        string
  description?: string
  helperText?:  string
  errorText?:   string
  required?:    boolean
  disabled?:    boolean
  maxLength?:   number
  /** Number of visible text rows (default 5) */
  rows?:        number
  value:        string
  onChange:     (value: string) => void
  placeholder?: string
  className?:   string
}

/* ── Scoped styles ─────────────────────────────────────────────────────── */
const TEXTAREA_STYLES = `
  .ta-oe {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-stack-xs, 8px);
    width: 100%;
  }
  .ta-oe__label {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: var(--type-weight-bold, 700);
    color: var(--color-text-primary);
  }
  .ta-oe--disabled .ta-oe__label {
    color: var(--color-text-disable);
  }
  .ta-oe__description {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-primary-light);
  }
  .ta-oe--disabled .ta-oe__description {
    color: var(--color-text-disable);
  }
  /* Wrapper — resizable vertically, matches textarea container */
  .ta-oe__wrapper {
    min-height: 120px;
    padding: var(--spacing-inset-s, 16px);
    background-color: var(--color-background-inverse);
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--radius-smooth, 2px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    resize: vertical;
    overflow: hidden;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .ta-oe:not(.ta-oe--disabled):hover .ta-oe__wrapper {
    border-color: var(--color-border-secondary-hover);
  }
  .ta-oe:not(.ta-oe--disabled):hover .ta-oe__label {
    color: var(--color-text-primary-hover);
  }
  .ta-oe__wrapper:focus-within {
    border-color: var(--color-border-secondary);
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
    outline: none;
  }
  .ta-oe--error .ta-oe__wrapper {
    border-color: var(--color-border-error);
  }
  .ta-oe--error:not(.ta-oe--disabled):hover .ta-oe__wrapper {
    border-color: var(--color-border-error-hover);
  }
  .ta-oe--error .ta-oe__wrapper:focus-within {
    border-color: var(--color-border-error);
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
  }
  .ta-oe--disabled .ta-oe__wrapper {
    background-color: var(--color-background-disable);
    border-color: var(--color-border-disabled);
    pointer-events: none;
    resize: none;
  }
  /* Textarea element */
  .ta-oe__textarea {
    flex: 1;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    resize: none;
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: var(--type-weight-regular, 400);
    line-height: 1.5;
    color: var(--color-text-primary-lighter);
  }
  .ta-oe__textarea:not(:placeholder-shown) {
    color: var(--color-text-primary);
  }
  .ta-oe--disabled .ta-oe__textarea {
    color: var(--color-text-disable);
  }
  /* Character counter — Atkinson Mono for numeric data */
  .ta-oe__counter {
    font-family: var(--font-family-0, 'Atkinson Hyperlegible Mono', monospace);
    font-size: var(--type-body-xs-size, 14px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-primary-light);
    text-align: right;
    align-self: flex-end;
    margin-top: var(--spacing-stack-xs, 8px);
    flex-shrink: 0;
  }
  .ta-oe--disabled .ta-oe__counter {
    color: var(--color-text-disable);
  }
  /* Approaching limit: last 10% remaining */
  .ta-oe__counter--warning {
    color: var(--color-text-warning);
  }
  .ta-oe__helper {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    color: var(--color-text-primary-light);
  }
  .ta-oe__error {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    color: var(--color-text-error);
  }
  /* Visually-hidden live region for 100-char milestone announcements */
  .ta-oe__live {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
`

/* ── Component ──────────────────────────────────────────────────────────── */
export function Textarea({
  label,
  description,
  helperText,
  errorText,
  required   = false,
  disabled   = false,
  maxLength,
  rows       = 5,
  value,
  onChange,
  placeholder,
  className  = '',
}: TextareaProps) {
  const baseId      = useId()
  const taId        = `${baseId}-ta`
  const helperId    = `${baseId}-helper`
  const errorId     = `${baseId}-error`
  const counterId   = `${baseId}-counter`
  const liveId      = `${baseId}-live`

  // Track last announced 100-char milestone
  const lastMilestoneRef = useRef(0)
  const [announcement, setAnnouncement] = useState('')

  const hasError    = Boolean(errorText)
  const isNearLimit = maxLength !== undefined && value.length >= maxLength * 0.9

  const describedBy = [
    helperText ? helperId  : null,
    hasError   ? errorId   : null,
    maxLength  ? counterId : null,
    liveId,
  ].filter(Boolean).join(' ')

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newVal  = e.target.value
    onChange(newVal)

    if (maxLength === undefined) return
    const len = newVal.length
    const currentMilestone = Math.floor(len / 100) * 100

    // Announce when crossing a new 100-char boundary upward or downward
    if (currentMilestone !== lastMilestoneRef.current && currentMilestone > 0) {
      lastMilestoneRef.current = currentMilestone
      const remaining = maxLength - len
      setAnnouncement(
        `${len} caratteri inseriti su ${maxLength}. Rimangono ${remaining} caratteri.`
      )
    } else if (len === 0) {
      lastMilestoneRef.current = 0
      setAnnouncement('')
    }
  }

  const rootClass = [
    'ta-oe',
    hasError  ? 'ta-oe--error'    : '',
    disabled  ? 'ta-oe--disabled' : '',
    className,
  ].filter(Boolean).join(' ')

  const counterClass = [
    'ta-oe__counter',
    isNearLimit ? 'ta-oe__counter--warning' : '',
  ].filter(Boolean).join(' ')

  return (
    <>
      <style>{TEXTAREA_STYLES}</style>

      {/* Hidden live region — announces only at 100-char milestones */}
      <span id={liveId} className="ta-oe__live" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>

      <div className={rootClass}>
        <label htmlFor={taId} className="ta-oe__label">
          {label}
          {required && (
            <span aria-hidden="true" style={{ color: 'var(--color-text-error)', marginLeft: 4 }}>*</span>
          )}
        </label>

        {description && (
          <span className="ta-oe__description">{description}</span>
        )}

        <div className="ta-oe__wrapper">
          <textarea
            id={taId}
            rows={rows}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            aria-required={required || undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className="ta-oe__textarea"
            onChange={handleChange}
          />
          {maxLength !== undefined && (
            /* Counter inside the wrapper, bottom-right — Atkinson Mono */
            <span
              id={counterId}
              className={counterClass}
              aria-hidden="true"  /* value announced by live region; this is decorative */
            >
              {value.length}/{maxLength}
            </span>
          )}
        </div>

        {hasError ? (
          <span id={errorId} className="ta-oe__error" role="alert">
            {errorText}
          </span>
        ) : helperText ? (
          <span id={helperId} className="ta-oe__helper">
            {helperText}
          </span>
        ) : null}
      </div>
    </>
  )
}
