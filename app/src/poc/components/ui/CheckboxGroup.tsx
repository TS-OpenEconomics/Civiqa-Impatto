import { useId, useState, type FocusEvent } from 'react'

/* ── Types ──────────────────────────────────────────────────────────────────
   Spec: ds-components-misc.md (checkbox) + WCAG 1.3.1 / 4.1.2
   Checkbox groups MUST use <fieldset> + <legend>. Never div + span.
   ────────────────────────────────────────────────────────────────────────── */

export interface CheckboxOption {
  value:     string
  label:     string
  disabled?: boolean
}

export interface CheckboxGroupProps {
  legend:       string
  options:      CheckboxOption[]
  /** Currently selected values */
  values:       string[]
  onChange:     (values: string[]) => void
  required?:    boolean
  /** External error text (overrides internal minSelected error when provided) */
  errorText?:   string
  disabled?:    boolean
  /**
   * Minimum number of required selections.
   * An inline error is shown when the group is blurred with fewer selections.
   */
  minSelected?: number
  className?:   string
}

/* ── Checkmark SVG ──────────────────────────────────────────────────────── */
function Checkmark() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2 6.5l3.5 3.5L11 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Scoped styles ──────────────────────────────────────────────────────── */
const CHECKBOX_STYLES = `
  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  .checkbox-group__legend {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: var(--type-weight-bold, 700);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-stack-xs, 8px);
    float: left;
    width: 100%;
  }
  .checkbox-group__legend + * { clear: left; }
  .checkbox-group--disabled .checkbox-group__legend {
    color: var(--color-text-disable);
  }
  .checkbox-group__options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-stack-xs, 8px);
  }
  /* Single checkbox row */
  .cb-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-inline-xs, 8px);
    cursor: pointer;
  }
  .cb-item--disabled {
    cursor: default;
    pointer-events: none;
  }
  /* Hidden native input */
  .cb-item__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    pointer-events: none;
  }
  /* Focus ring projected from hidden input onto the visual box */
  .cb-item__input:focus-visible ~ .cb-item__box {
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
    outline: none;
  }
  /* Visual checkbox box — 20×20px, border-radius 4px per DS spec */
  .cb-item__box {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid var(--color-border-secondary);
    background-color: var(--color-background-inverse);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: background-color 0.1s ease, border-color 0.1s ease;
  }
  .cb-item:not(.cb-item--disabled):hover .cb-item__box {
    border-color: var(--color-border-secondary-hover);
  }
  .cb-item--checked .cb-item__box {
    background-color: var(--color-border-primary);
    border-color: var(--color-border-primary);
  }
  /* Disabled states */
  .cb-item--disabled .cb-item__box {
    background-color: var(--color-background-disable);
    border-color: var(--color-border-disabled);
  }
  .cb-item--disabled.cb-item--checked .cb-item__box {
    background-color: var(--color-border-disabled);
    border-color: var(--color-border-disabled);
  }
  /* Label */
  .cb-item__label {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: var(--type-weight-regular, 400);
    color: var(--color-text-primary);
    line-height: 1.3;
    user-select: none;
  }
  .cb-item--disabled .cb-item__label {
    color: var(--color-text-disable);
  }
  /* Error text */
  .checkbox-group__error {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    color: var(--color-text-error);
    margin-top: var(--spacing-stack-xs, 8px);
  }
  /* Helper hint (minSelected) */
  .checkbox-group__hint {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    color: var(--color-text-primary-light);
    margin-bottom: var(--spacing-stack-xs, 8px);
  }
`

/* ── Component ──────────────────────────────────────────────────────────── */
export function CheckboxGroup({
  legend,
  options,
  values,
  onChange,
  required    = false,
  errorText,
  disabled    = false,
  minSelected,
  className   = '',
}: CheckboxGroupProps) {
  const baseId  = useId()
  const errorId = `${baseId}-error`

  // Track whether the group has been interacted with (for minSelected validation)
  const [touched, setTouched] = useState(false)

  const minError =
    touched && minSelected !== undefined && values.length < minSelected
      ? `Seleziona almeno ${minSelected} opzion${minSelected === 1 ? 'e' : 'i'}.`
      : undefined

  // External errorText takes priority over internal minSelected error
  const activeError = errorText ?? minError

  const toggle = (optValue: string) => {
    if (values.includes(optValue)) {
      onChange(values.filter((v) => v !== optValue))
    } else {
      onChange([...values, optValue])
    }
  }

  // Mark group as touched when focus leaves the entire fieldset
  const handleBlur = (e: FocusEvent<HTMLFieldSetElement>) => {
    // relatedTarget is null or outside the fieldset → truly leaving the group
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setTouched(true)
    }
  }

  const fieldsetClass = [
    'checkbox-group',
    disabled ? 'checkbox-group--disabled' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <>
      <style>{CHECKBOX_STYLES}</style>

      <fieldset
        className={fieldsetClass}
        aria-required={required || undefined}
        aria-describedby={activeError ? errorId : undefined}
        aria-invalid={activeError ? true : undefined}
        disabled={disabled || undefined}
        onBlur={handleBlur}
      >
        <legend className="checkbox-group__legend">
          {legend}
          {required && (
            <span aria-hidden="true" style={{ color: 'var(--color-text-error)', marginLeft: 4 }}>*</span>
          )}
        </legend>

        {minSelected !== undefined && !activeError && (
          <p className="checkbox-group__hint" aria-hidden="true">
            Seleziona almeno {minSelected} opzion{minSelected === 1 ? 'e' : 'i'}
          </p>
        )}

        <div className="checkbox-group__options">
          {options.map((opt, idx) => {
            const isChecked  = values.includes(opt.value)
            const isDisabled = disabled || opt.disabled
            const inputId    = `${baseId}-cb-${idx}`

            const itemClass = [
              'cb-item',
              isChecked  ? 'cb-item--checked'  : '',
              isDisabled ? 'cb-item--disabled' : '',
            ].filter(Boolean).join(' ')

            return (
              <label key={opt.value} htmlFor={inputId} className={itemClass}>
                {/*
                  Hidden native input provides:
                  - role="checkbox" + aria-checked (implicit from type)
                  - Space key toggles
                  - focus ring target
                  Each checkbox is independently focusable (tabIndex not manipulated).
                */}
                <input
                  id={inputId}
                  type="checkbox"
                  value={opt.value}
                  checked={isChecked}
                  disabled={isDisabled}
                  className="cb-item__input"
                  onChange={() => toggle(opt.value)}
                />
                {/* Visual box (focus ring from hidden input via sibling selector) */}
                <div className="cb-item__box" aria-hidden="true">
                  {isChecked && <Checkmark />}
                </div>
                <span className="cb-item__label">{opt.label}</span>
              </label>
            )
          })}
        </div>

        {activeError && (
          <p id={errorId} className="checkbox-group__error" role="alert">
            {activeError}
          </p>
        )}
      </fieldset>
    </>
  )
}
