import { useId, type ChangeEvent } from 'react'

/* ── Types ──────────────────────────────────────────────────────────────────
   Spec: ds-components-inputs.md — same anatomical structure as InputField.
   Uses a native <select> for maximum accessibility (screen reader support,
   keyboard navigation, mobile UX) with a custom chevron via background-image.
   ────────────────────────────────────────────────────────────────────────── */

export interface SelectOption {
  value:    string
  label:    string
  disabled?: boolean
}

export interface SelectFieldProps {
  label:        string
  visuallyHiddenLabel?: boolean
  description?: string
  helperText?:  string
  errorText?:   string
  required?:    boolean
  disabled?:    boolean
  value:        string
  onChange:     (value: string) => void
  options:      SelectOption[]
  /** Shown as first <option> when value is empty (e.g. "— Seleziona —") */
  placeholder?: string
  className?:   string
}

/* ── Chevron SVG as data URI ────────────────────────────────────────────────
   Encoded manually to avoid external tooling. Color matches
   --color-icon-primary-lighter (#6e6e6e).
   ────────────────────────────────────────────────────────────────────────── */
const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%236e6e6e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`

/* ── Scoped styles ──────────────────────────────────────────────────────── */
const SELECT_STYLES = `
  .select-oe {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-stack-xs, 8px);
    width: 100%;
  }
  .select-oe__label {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: var(--type-weight-bold, 700);
    color: var(--color-text-primary);
  }
  .select-oe__label--sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
  .select-oe__description {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-primary-light);
  }
  /* Wrapper — same 40px height as InputField */
  .select-oe__wrapper {
    position: relative;
    height: 40px;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--radius-smooth, 2px);
    background-color: var(--color-background-inverse);
    box-sizing: border-box;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    overflow: hidden;
  }
  .select-oe:not(.select-oe--disabled):hover .select-oe__wrapper {
    border-color: var(--color-border-secondary-hover);
  }
  .select-oe:not(.select-oe--disabled):hover .select-oe__label {
    color: var(--color-text-primary-hover);
  }
  .select-oe__wrapper:focus-within {
    border-color: var(--color-border-secondary);
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
    outline: none;
  }
  .select-oe--error .select-oe__wrapper {
    border-color: var(--color-border-error);
  }
  .select-oe--error:not(.select-oe--disabled):hover .select-oe__wrapper {
    border-color: var(--color-border-error-hover);
  }
  .select-oe--error .select-oe__wrapper:focus-within {
    border-color: var(--color-border-error);
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
  }
  .select-oe--disabled .select-oe__wrapper {
    background-color: var(--color-background-disable);
    border-color: var(--color-border-disabled);
    pointer-events: none;
  }
  .select-oe--disabled .select-oe__label,
  .select-oe--disabled .select-oe__description,
  .select-oe--disabled .select-oe__helper {
    color: var(--color-text-disable);
  }
  /* Native <select> — reset appearance, fill wrapper */
  .select-oe__select {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0 40px 0 var(--spacing-inset-xs, 8px);  /* right room for chevron */
    border: none;
    outline: none;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-primary);
    cursor: pointer;
  }
  /* Placeholder option color */
  .select-oe__select.select-oe__select--empty {
    color: var(--color-text-primary-lighter);
  }
  .select-oe--disabled .select-oe__select {
    color: var(--color-text-disable);
    cursor: default;
  }
  /* Custom chevron — background-image SVG, positioned right */
  .select-oe__chevron {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    pointer-events: none;
    color: var(--color-icon-primary-lighter);
  }
  .select-oe--disabled .select-oe__chevron {
    color: var(--color-icon-disable);
  }
  .select-oe__helper {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-primary-light);
  }
  .select-oe__error {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-error);
  }
  .select-oe--disabled .select-oe__helper {
    color: var(--color-text-disable);
  }
`

/* ── Chevron SVG — inline, inherits color via currentColor ──────────────── */
function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── Component ──────────────────────────────────────────────────────────── */
export function SelectField({
  label,
  visuallyHiddenLabel = false,
  description,
  helperText,
  errorText,
  required    = false,
  disabled    = false,
  value,
  onChange,
  options,
  placeholder,
  className   = '',
}: SelectFieldProps) {
  const baseId   = useId()
  const selectId = `${baseId}-select`
  const helperId = `${baseId}-helper`
  const errorId  = `${baseId}-error`

  const hasError    = Boolean(errorText)
  const describedBy = [
    helperText ? helperId : null,
    hasError   ? errorId  : null,
  ].filter(Boolean).join(' ') || undefined

  const rootClass = [
    'select-oe',
    hasError  ? 'select-oe--error'    : '',
    disabled  ? 'select-oe--disabled' : '',
    className,
  ].filter(Boolean).join(' ')

  const isEmpty = value === ''
  const labelClassName = visuallyHiddenLabel ? 'select-oe__label select-oe__label--sr-only' : 'select-oe__label'

  return (
    <>
      <style>{SELECT_STYLES}</style>

      <div className={rootClass}>
        {/* Label */}
        <label htmlFor={selectId} className={labelClassName}>
          {label}
          {required && (
            <span aria-hidden="true" style={{ color: 'var(--color-text-error)', marginLeft: 4 }}>*</span>
          )}
        </label>

        {/* Description */}
        {description && (
          <span className="select-oe__description">{description}</span>
        )}

        {/* Select wrapper */}
        <div className="select-oe__wrapper">
          <select
            id={selectId}
            value={value}
            disabled={disabled}
            // WCAG attributes
            aria-required={required || undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={`select-oe__select${isEmpty ? ' select-oe__select--empty' : ''}`}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          >
            {/* Placeholder option — not selectable after initial choice */}
            {placeholder && (
              <option value="" disabled={!isEmpty}>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom chevron — visually replaces the native arrow (pointer-events: none) */}
          <span className="select-oe__chevron" aria-hidden="true">
            <ChevronIcon />
          </span>
        </div>

        {/* Helper / error text */}
        {hasError ? (
          <span id={errorId} className="select-oe__error" role="alert">
            {errorText}
          </span>
        ) : helperText ? (
          <span id={helperId} className="select-oe__helper">
            {helperText}
          </span>
        ) : null}
      </div>
    </>
  )
}

// Keep the data URI available for consumers who need it in background-image CSS
export { CHEVRON_SVG as SELECT_CHEVRON_SVG }
