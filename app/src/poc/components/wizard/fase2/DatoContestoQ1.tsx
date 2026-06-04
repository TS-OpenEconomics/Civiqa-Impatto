import { useState } from 'react'
import type { CSSProperties } from 'react'
import { getNeedByCode } from '../../../data/fabbisogni_v2'
import { useWizard } from '../../../hooks/useWizard'

export function DatoContestoQ1() {
  const { state, setQ1Value } = useWizard()
  const need = getNeedByCode(state.fabId ?? '')
  const label = need?.q1_label ?? 'Dato quantitativo di contesto'

  const [raw, setRaw] = useState<string>(
    state.q1Value !== null ? String(state.q1Value) : '',
  )
  const [error, setError] = useState<string | null>(null)

  function handleChange(value: string) {
    setRaw(value)
    if (value === '') {
      setError(null)
      setQ1Value(null)
      return
    }
    const n = Number(value)
    if (isNaN(n) || n <= 0) {
      setError('Se inserito, il valore deve essere un numero maggiore di zero')
      setQ1Value(null)
    } else {
      setError(null)
      setQ1Value(n)
    }
  }

  const inputId = 'q1-value-input'
  const helperId = 'q1-value-helper'
  const errorId = 'q1-value-error'

  return (
    <div style={rootStyle}>
      <label htmlFor={inputId} style={labelStyle}>
        {label}
      </label>
      <p id={helperId} style={helperStyle}>
        Dato facoltativo — inserisci il valore numerico dell'indicatore. Puoi procedere anche senza compilare questo campo.
      </p>
      <input
        id={inputId}
        type="number"
        min={1}
        step={1}
        value={raw}
        onChange={(e) => handleChange(e.target.value)}
        aria-required="false"
        aria-invalid={error !== null ? 'true' : undefined}
        aria-describedby={`${helperId}${error !== null ? ` ${errorId}` : ''}`}
        style={inputStyle(error !== null)}
      />
      {error !== null && (
        <p id={errorId} role="alert" style={errorStyle}>
          {error}
        </p>
      )}
    </div>
  )
}

const rootStyle: CSSProperties = { display: 'grid', gap: 'var(--spacing-stack-xs)', maxWidth: '360px' }
const labelStyle: CSSProperties = { fontWeight: 600, color: 'var(--color-text-primary)' }
const helperStyle: CSSProperties = { margin: 0, fontSize: 'var(--type-body-xs-size, 14px)', color: 'var(--color-text-primary-light)', lineHeight: 1.5 }
function inputStyle(invalid: boolean): CSSProperties {
  return {
    padding: 'var(--spacing-inset-s)',
    border: `1px solid ${invalid ? 'var(--color-border-danger)' : 'var(--color-border-secondary)'}`,
    borderRadius: 'var(--radius-smooth)',
    fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
    fontSize: 'var(--type-body-m-size, 16px)',
    color: 'var(--color-text-primary)',
    background: 'var(--color-background-inverse)',
  }
}
const errorStyle: CSSProperties = { margin: 0, color: 'var(--color-text-danger)', fontSize: 'var(--type-body-s-size, 14px)' }
