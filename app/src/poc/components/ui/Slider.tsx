import { useId, type ChangeEvent } from 'react'

/* ── Types ──────────────────────────────────────────────────────────────────
   Spec: CLAUDE.md §6 — aria-valuemin/max/now/valuetext obbligatori.
   Native <input type="range"> for maximum accessibility:
   - arrow keys (±step), Page Up/Down (±10%), Home/End (min/max)
   - aria-valuemin/max/now provided automatically by the browser
   - aria-valuetext added manually for descriptive labels
   ────────────────────────────────────────────────────────────────────────── */

export interface SliderProps {
  label:        string
  min:          number
  max:          number
  step?:        number
  value:        number
  onChange:     (value: number) => void
  /**
   * Descriptive labels for each discrete step (length must equal number of steps + 1).
   * Shown visually under the slider AND used for aria-valuetext.
   * Example for 0–3 step=1: ['Basso', 'Medio-basso', 'Medio-alto', 'Alto']
   */
  valueLabels?: string[]
  /** Show the numeric value next to the label */
  showValue?:   boolean
  disabled?:    boolean
  helperText?:  string
  className?:   string
}

/* ── Scoped styles ──────────────────────────────────────────────────────── */
const SLIDER_STYLES = `
  .slider-oe {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-stack-xs, 8px);
    width: 100%;
  }
  /* Header row: label left, numeric value right */
  .slider-oe__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-inline-xs, 8px);
  }
  .slider-oe__label {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: var(--type-weight-bold, 700);
    color: var(--color-text-primary);
  }
  .slider-oe--disabled .slider-oe__label {
    color: var(--color-text-disable);
  }
  /* Numeric value badge */
  .slider-oe__value {
    font-family: var(--font-family-0, 'Atkinson Hyperlegible Mono', monospace);
    font-size: var(--type-body-s-size, 16px);
    font-weight: var(--type-weight-bold, 700);
    color: var(--color-text-secondary);
    min-width: 2.5ch;
    text-align: right;
    flex-shrink: 0;
  }
  .slider-oe--disabled .slider-oe__value {
    color: var(--color-text-disable);
  }
  /* Track wrapper */
  .slider-oe__track-wrapper {
    position: relative;
    height: 24px;
    display: flex;
    align-items: center;
  }
  /* Native range input — reset and style */
  .slider-oe__input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: var(--radius-smooth, 2px);
    cursor: pointer;
    outline: none;
    background: transparent; /* fill applied via background on wrapper */
    position: relative;
    z-index: 1;
  }
  /* Track */
  .slider-oe__input::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: var(--radius-smooth, 2px);
    background: var(--slider-track-bg, var(--color-background-secondary-light));
  }
  .slider-oe__input::-moz-range-track {
    height: 6px;
    border-radius: var(--radius-smooth, 2px);
    background: var(--slider-track-bg, var(--color-background-secondary-light));
  }
  /* Filled portion — webkit only (moz uses range-progress) */
  .slider-oe__input::-webkit-slider-runnable-track {
    background: linear-gradient(
      to right,
      var(--color-background-primary) 0%,
      var(--color-background-primary) var(--slider-fill, 0%),
      var(--color-background-secondary-light) var(--slider-fill, 0%),
      var(--color-background-secondary-light) 100%
    );
  }
  .slider-oe__input::-moz-range-progress {
    height: 6px;
    border-radius: var(--radius-smooth, 2px);
    background-color: var(--color-background-primary);
  }
  /* Thumb — square with border-radius smooth */
  .slider-oe__input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: var(--radius-smooth, 2px);
    background-color: var(--color-background-primary);
    border: 2px solid var(--color-background-inverse);
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
    cursor: pointer;
    transition: background-color 0.1s ease;
  }
  .slider-oe__input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: var(--radius-smooth, 2px);
    background-color: var(--color-background-primary);
    border: 2px solid var(--color-background-inverse);
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
    cursor: pointer;
    transition: background-color 0.1s ease;
  }
  /* Hover thumb */
  .slider-oe__input:not(:disabled):hover::-webkit-slider-thumb {
    background-color: var(--color-background-primary-hover);
  }
  .slider-oe__input:not(:disabled):hover::-moz-range-thumb {
    background-color: var(--color-background-primary-hover);
  }
  /* Focus ring on thumb — WCAG 2.4.7 */
  .slider-oe__input:focus-visible::-webkit-slider-thumb {
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
    outline: none;
  }
  .slider-oe__input:focus-visible::-moz-range-thumb {
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
    outline: none;
  }
  /* Disabled state */
  .slider-oe__input:disabled {
    cursor: default;
  }
  .slider-oe__input:disabled::-webkit-slider-runnable-track {
    background: var(--color-background-disable);
  }
  .slider-oe__input:disabled::-moz-range-track {
    background: var(--color-background-disable);
  }
  .slider-oe__input:disabled::-webkit-slider-thumb {
    background-color: var(--color-icon-disable);
    box-shadow: none;
  }
  .slider-oe__input:disabled::-moz-range-thumb {
    background-color: var(--color-icon-disable);
    box-shadow: none;
  }
  /* Value label (current step description) */
  .slider-oe__value-label {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    font-weight: var(--type-weight-medium, 500);
    color: var(--color-text-secondary);
    background-color: var(--color-background-primary-lighter);
    padding: 2px 8px;
    border-radius: var(--radius-smooth, 2px);
    display: inline-block;
    align-self: flex-start;
  }
  .slider-oe--disabled .slider-oe__value-label {
    color: var(--color-text-disable);
    background-color: var(--color-background-disable);
  }
  /* Min/max range labels */
  .slider-oe__range {
    display: flex;
    justify-content: space-between;
    margin-top: 2px;
  }
  .slider-oe__range-label {
    font-family: var(--font-family-0, 'Atkinson Hyperlegible Mono', monospace);
    font-size: var(--type-body-xs-size, 14px);
    color: var(--color-text-primary-lighter);
  }
  .slider-oe--disabled .slider-oe__range-label {
    color: var(--color-text-disable);
  }
  /* Helper text */
  .slider-oe__helper {
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    color: var(--color-text-primary-light);
  }
`

/* ── Component ──────────────────────────────────────────────────────────── */
export function Slider({
  label,
  min,
  max,
  step       = 1,
  value,
  onChange,
  valueLabels,
  showValue  = true,
  disabled   = false,
  helperText,
  className  = '',
}: SliderProps) {
  const inputId = useId()

  // Percentage fill for the CSS custom property (0–100)
  const fillPct = max === min ? 0 : ((value - min) / (max - min)) * 100

  // aria-valuetext: prefer descriptive label, fall back to numeric value
  const currentLabel = valueLabels
    ? valueLabels[Math.round((value - min) / step)] ?? String(value)
    : String(value)

  const rootClass = [
    'slider-oe',
    disabled ? 'slider-oe--disabled' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <>
      <style>{SLIDER_STYLES}</style>

      <div className={rootClass}>
        {/* Label + numeric value */}
        <div className="slider-oe__header">
          <label htmlFor={inputId} className="slider-oe__label">
            {label}
          </label>
          {showValue && (
            /*
              aria-live="polite" so screen readers announce the changing value
              without interrupting current speech.
            */
            <span
              className="slider-oe__value"
              aria-live="polite"
              aria-atomic="true"
            >
              {value}
            </span>
          )}
        </div>

        {/* Track */}
        <div className="slider-oe__track-wrapper">
          <input
            id={inputId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            className="slider-oe__input"
            /*
              WCAG 4.1.2: aria-valuemin/max/now are provided automatically by
              the browser for type="range". We add aria-valuetext for the
              descriptive string (required by CLAUDE.md §6).
            */
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={currentLabel}
            style={
              {
                '--slider-fill': `${fillPct}%`,
              } as React.CSSProperties
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(Number(e.target.value))
            }
          />
        </div>

        {/* Min / max endpoint labels */}
        <div className="slider-oe__range" aria-hidden="true">
          <span className="slider-oe__range-label">{min}</span>
          <span className="slider-oe__range-label">{max}</span>
        </div>

        {/* Current step description (shown when valueLabels provided) */}
        {valueLabels && (
          /*
            aria-live="polite" so screen readers announce the new label when
            the user moves the thumb. aria-hidden would suppress that, so we
            keep it visible to AT as well (provides richer context than the
            numeric value alone).
          */
          <span
            className="slider-oe__value-label"
            aria-live="polite"
            aria-atomic="true"
          >
            {currentLabel}
          </span>
        )}

        {/* Optional helper text */}
        {helperText && (
          <span className="slider-oe__helper">{helperText}</span>
        )}
      </div>
    </>
  )
}
