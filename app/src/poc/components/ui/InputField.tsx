import { useId, type ChangeEvent, type ReactNode } from 'react'

/* ── Types ─────────────────────────────────────────────────────────────────
   Spec: ds-components-inputs.md — Input Text Field (Standard + Error states)
   ────────────────────────────────────────────────────────────────────────── */

export interface InputFieldProps {
  /** Visible label above the field */
  label:        string
  /** Optional content shown inline next to the label, e.g. an info button */
  labelAdornment?: ReactNode
  /** Optional sub-label below the main label */
  description?: string
  /** Neutral helper text shown below the field */
  helperText?:  string
  /** Error message — when present the field enters error state */
  errorText?:   string
  required?:    boolean
  disabled?:    boolean
  readOnly?:    boolean
  value:        string
  onChange:     (value: string) => void
  placeholder?: string
  /** Enables character counter below the field (aria-live="polite") */
  maxLength?:   number
  /** Optional icon rendered on the right side of the input (32×32px slot) */
  icon?:        ReactNode
  /** input type — defaults to "text" */
  type?:        string
  ariaLabel?:   string
  className?:   string
}

/* ── Shared injected styles (idempotent class name, inserted once) ─────────
   Handles hover / focus-within pseudo-classes that inline style cannot cover.
   ────────────────────────────────────────────────────────────────────────── */
const FIELD_STYLES = `
  .input-oe {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-stack-xs, 8px);
    width: 100%;
  }
  .input-oe__label {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: var(--type-weight-bold, 700);
    color: var(--color-text-primary);
  }
  .input-oe__label-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-inline-xs, 8px);
  }
  .input-oe__label-adornment {
    display: inline-flex;
    align-items: center;
  }
  .input-oe__description {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-primary-light);
  }
  .input-oe__wrapper {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 var(--spacing-inset-xs, 8px);
    background-color: var(--color-background-inverse);
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--radius-smooth, 2px);
    gap: var(--spacing-inline-xs, 8px);
    box-sizing: border-box;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    overflow: hidden;
  }
  .input-oe:not(.input-oe--disabled):hover .input-oe__wrapper {
    border-color: var(--color-border-secondary-hover);
  }
  .input-oe:not(.input-oe--disabled):hover .input-oe__label {
    color: var(--color-text-primary-hover);
  }
  .input-oe__wrapper:focus-within {
    border-color: var(--color-border-secondary);
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
    outline: none;
  }
  .input-oe--error .input-oe__wrapper {
    border-color: var(--color-border-error);
  }
  .input-oe--error:not(.input-oe--disabled):hover .input-oe__wrapper {
    border-color: var(--color-border-error-hover);
  }
  .input-oe--error .input-oe__wrapper:focus-within {
    border-color: var(--color-border-error);
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
  }
  .input-oe--disabled .input-oe__wrapper {
    background-color: var(--color-background-disable);
    border-color: var(--color-border-disabled);
    pointer-events: none;
  }
  .input-oe--disabled .input-oe__label,
  .input-oe--disabled .input-oe__description,
  .input-oe--disabled .input-oe__helper {
    color: var(--color-text-disable);
  }
  .input-oe__input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-primary-lighter);
    min-width: 0;
  }
  .input-oe__input:not(:placeholder-shown) {
    color: var(--color-text-primary);
  }
  .input-oe--disabled .input-oe__input {
    color: var(--color-text-disable);
  }
  .input-oe__icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-icon-primary-lighter);
  }
  .input-oe--disabled .input-oe__icon {
    color: var(--color-icon-disable);
  }
  .input-oe__helper {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-primary-light);
  }
  .input-oe__error {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-error);
  }
  .input-oe__counter {
    font-family: var(--font-family-0, 'Atkinson Hyperlegible Mono', monospace);
    font-size: var(--type-body-xs-size, 14px);
    color: var(--color-text-primary-light);
    text-align: right;
    align-self: flex-end;
  }
  .input-oe--disabled .input-oe__counter {
    color: var(--color-text-disable);
  }
`

/* ── Component ──────────────────────────────────────────────────────────── */
export function InputField({
  label,
  labelAdornment,
  description,
  helperText,
  errorText,
  required   = false,
  disabled   = false,
  readOnly   = false,
  value,
  onChange,
  placeholder,
  maxLength,
  icon,
  type       = 'text',
  ariaLabel,
  className  = '',
}: InputFieldProps) {
  // Stable IDs for ARIA wiring (no hydration mismatch risk)
  const baseId      = useId()
  const inputId     = `${baseId}-input`
  const helperId    = `${baseId}-helper`
  const errorId     = `${baseId}-error`
  const counterId   = `${baseId}-counter`

  const hasError    = Boolean(errorText)
  const describedBy = [
    helperText ? helperId  : null,
    hasError   ? errorId   : null,
    maxLength  ? counterId : null,
  ].filter(Boolean).join(' ') || undefined

  const rootClass = [
    'input-oe',
    hasError  ? 'input-oe--error'    : '',
    disabled  ? 'input-oe--disabled' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <>
      <style>{FIELD_STYLES}</style>

      <div className={rootClass}>
        {/* Label */}
        <div className="input-oe__label-row">
          <label htmlFor={inputId} className="input-oe__label">
            {label}
            {required && (
              <span aria-hidden="true" style={{ color: 'var(--color-text-error)', marginLeft: 4 }}>*</span>
            )}
          </label>
          {labelAdornment && <span className="input-oe__label-adornment">{labelAdornment}</span>}
        </div>

        {/* Description */}
        {description && (
          <span className="input-oe__description">{description}</span>
        )}

        {/* Input wrapper */}
        <div className="input-oe__wrapper">
          <input
            id={inputId}
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            // WCAG attributes
            aria-required={required || undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            aria-label={ariaLabel}
            aria-readonly={readOnly || undefined}
            tabIndex={readOnly ? -1 : undefined}
            className="input-oe__input"
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          />
          {icon && <span className="input-oe__icon" aria-hidden="true">{icon}</span>}
        </div>

        {/* Helper / error text */}
        {hasError ? (
          <span id={errorId} className="input-oe__error" role="alert">
            {errorText}
          </span>
        ) : helperText ? (
          <span id={helperId} className="input-oe__helper">
            {helperText}
          </span>
        ) : null}

        {/* Character counter (aria-live so screen readers announce changes) */}
        {maxLength !== undefined && (
          <span
            id={counterId}
            className="input-oe__counter"
            aria-live="polite"
            aria-atomic="true"
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </>
  )
}
