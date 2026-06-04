import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

/* ── Types ──────────────────────────────────────────────────────────────────
   Spec: ds-components-misc.md (checkbox pattern) + WCAG 1.3.1 / 4.1.2
   Radio groups MUST use <fieldset> + <legend>. Never div + span.
   ────────────────────────────────────────────────────────────────────────── */

export interface RadioOption {
  value:        string
  label:        string
  /** Optional sub-text rendered below the label */
  description?: string
  /** Optional explanatory content exposed through an inline info tooltip */
  infoContent?: ReactNode
  disabled?:    boolean
}

export interface RadioGroupProps {
  legend:     ReactNode
  options:    RadioOption[]
  value:      string
  onChange:   (value: string) => void
  required?:  boolean
  errorText?: string
  disabled?:  boolean
  className?: string
}

/* ── Scoped styles ──────────────────────────────────────────────────────── */
const RADIO_STYLES = `
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  .radio-group__legend {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: var(--type-weight-bold, 700);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-stack-xs, 8px);
    float: left;   /* resets fieldset legend layout to flow with content */
    width: 100%;
  }
  .radio-group__legend + * { clear: left; }

  .radio-group--disabled .radio-group__legend {
    color: var(--color-text-disable);
  }
  .radio-group__options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-stack-xs, 8px);
  }
  /* Individual option row */
  .radio-option {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-inline-xs, 8px);
    cursor: pointer;
  }
  .radio-option--disabled {
    cursor: default;
    pointer-events: none;
  }
  /* The visual radio circle */
  .radio-option__control {
    position: relative;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 2px;   /* optical align with 16px label text */
    border: 1px solid var(--color-border-secondary);
    border-radius: 50%;
    background-color: var(--color-background-inverse);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.1s ease, background-color 0.1s ease;
  }
  .radio-option:not(.radio-option--disabled):hover .radio-option__control {
    border-color: var(--color-border-secondary-hover);
  }
  .radio-option--checked .radio-option__control {
    border-color: var(--color-border-primary);
    background-color: var(--color-background-inverse);
  }
  /* Inner dot */
  .radio-option__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--color-background-primary);
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.1s ease, transform 0.1s ease;
  }
  .radio-option--checked .radio-option__dot {
    opacity: 1;
    transform: scale(1);
  }
  /* Disabled states */
  .radio-option--disabled .radio-option__control {
    background-color: var(--color-background-disable);
    border-color: var(--color-border-disabled);
  }
  .radio-option--disabled.radio-option--checked .radio-option__control {
    border-color: var(--color-border-disabled);
  }
  .radio-option--disabled .radio-option__dot {
    background-color: var(--color-icon-disable);
  }
  /* Labels */
  .radio-option__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .radio-option__label-row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .radio-option__label {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-primary);
    line-height: 1.3;
  }
  .radio-option--disabled .radio-option__label {
    color: var(--color-text-disable);
  }
  .radio-option__description {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-primary-light);
    line-height: 1.4;
  }
  .radio-option--disabled .radio-option__description {
    color: var(--color-text-disable);
  }
  .radio-option__info-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  .radio-option__info-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 1px solid var(--color-border-secondary);
    border-radius: 999px;
    background: var(--color-background-inverse);
    color: var(--color-text-primary);
    font-family: var(--font-family-0, 'Atkinson Hyperlegible Mono', monospace);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
  }
  .radio-option__info-trigger:focus-visible {
    outline: none;
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
  }
  .radio-option__info-tooltip {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 10;
    width: min(420px, calc(100vw - 48px));
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--color-background-primary);
    color: var(--color-text-inverse);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
  }
  /* Focus ring — on the hidden <input>, projected onto the visual control */
  .radio-option__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    pointer-events: none;
  }
  .radio-option__input:focus-visible ~ .radio-option__control {
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
    outline: none;
  }
  /* Error text */
  .radio-group__error {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    color: var(--color-text-error);
    margin-top: var(--spacing-stack-xs, 8px);
  }
`

/* ── Component ──────────────────────────────────────────────────────────── */
export function RadioGroup({
  legend,
  options,
  value,
  onChange,
  required  = false,
  errorText,
  disabled  = false,
  className = '',
}: RadioGroupProps) {
  const baseId  = useId()
  const errorId = `${baseId}-error`
  const [openInfoValue, setOpenInfoValue] = useState<string | null>(null)

  // Refs array for imperative focus management (roving tabindex)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const selectedIndex = options.findIndex((o) => o.value === value)
  // Roving tabindex: only the checked (or first) radio is in the tab order
  const rovingIndex = selectedIndex >= 0 ? selectedIndex : 0

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) return
    e.preventDefault()

    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1
    let next = (idx + dir + options.length) % options.length

    // Skip disabled options
    let guard = 0
    while (options[next]?.disabled && guard < options.length) {
      next = (next + dir + options.length) % options.length
      guard++
    }
    if (!options[next]?.disabled) {
      onChange(options[next].value)
      inputRefs.current[next]?.focus()
    }
  }

  const fieldsetClass = [
    'radio-group',
    disabled ? 'radio-group--disabled' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <>
      <style>{RADIO_STYLES}</style>

      {/*
        <fieldset> groups the controls semantically.
        aria-required on fieldset is supported by NVDA/JAWS as the group label.
        aria-describedby wires the error to the group.
      */}
      <fieldset
        className={fieldsetClass}
        aria-required={required || undefined}
        aria-describedby={errorText ? errorId : undefined}
        aria-invalid={errorText ? true : undefined}
        disabled={disabled || undefined}
      >
        <legend className="radio-group__legend">
          {legend}
          {required && (
            <span aria-hidden="true" style={{ color: 'var(--color-text-error)', marginLeft: 4 }}>*</span>
          )}
        </legend>

        <div className="radio-group__options" role="radiogroup">
          {options.map((opt, idx) => {
            const isChecked  = opt.value === value
            const isDisabled = disabled || opt.disabled
            const optId      = `${baseId}-opt-${idx}`

            const optClass = [
              'radio-option',
              isChecked  ? 'radio-option--checked'  : '',
              isDisabled ? 'radio-option--disabled' : '',
            ].filter(Boolean).join(' ')

            return (
              <label key={opt.value} htmlFor={optId} className={optClass}>
                {/*
                  Hidden native input — provides:
                  - role="radio" and aria-checked (implicit from type="radio")
                  - keyboard events (arrow keys, space)
                  - focus target for focus ring projection
                  Roving tabindex: only rovingIndex is in tab order.
                */}
                <input
                  ref={(el) => { inputRefs.current[idx] = el }}
                  id={optId}
                  type="radio"
                  name={baseId}
                  value={opt.value}
                  checked={isChecked}
                  disabled={isDisabled}
                  tabIndex={idx === rovingIndex ? 0 : -1}
                  aria-describedby={opt.description ? `${optId}-desc` : undefined}
                  className="radio-option__input"
                  onChange={() => onChange(opt.value)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                />
                {/* Visual control — styled via CSS sibling selector */}
                <div className="radio-option__control" aria-hidden="true">
                  <div className="radio-option__dot" />
                </div>
                <span className="radio-option__text">
                  <span className="radio-option__label-row">
                    <span className="radio-option__label">{opt.label}</span>
                    {opt.infoContent && !isDisabled && (
                      <span className="radio-option__info-wrap">
                        <button
                          type="button"
                          className="radio-option__info-trigger"
                          aria-label={`Approfondisci: ${opt.label}`}
                          aria-expanded={openInfoValue === opt.value}
                          aria-controls={`${optId}-info`}
                          onClick={(event) => {
                            event.preventDefault()
                            setOpenInfoValue((current) => (current === opt.value ? null : opt.value))
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                              event.preventDefault()
                              setOpenInfoValue(null)
                            }
                          }}
                        >
                          i
                        </button>
                        <span
                          id={`${optId}-info`}
                          role="tooltip"
                          hidden={openInfoValue !== opt.value}
                          className="radio-option__info-tooltip"
                        >
                          {opt.infoContent}
                        </span>
                      </span>
                    )}
                  </span>
                  {opt.description && (
                    <span
                      id={`${optId}-desc`}
                      className="radio-option__description"
                    >
                      {opt.description}
                    </span>
                  )}
                </span>
              </label>
            )
          })}
        </div>

        {errorText && (
          <p id={errorId} className="radio-group__error" role="alert">
            {errorText}
          </p>
        )}
      </fieldset>
    </>
  )
}
