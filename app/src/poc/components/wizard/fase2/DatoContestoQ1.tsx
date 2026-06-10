import { useEffect, useState } from 'react'
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

  // Sync from store (es. Autoriempi imposta q1Value esternamente)
  useEffect(() => {
    setRaw((prev) => {
      const next = state.q1Value !== null ? String(state.q1Value) : ''
      return prev === next ? prev : next
    })
  }, [state.q1Value])

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
    <div className="max-w-md">
      <label htmlFor={inputId} className="text-[14px] font-semibold text-ink-900">
        {label}
      </label>
      <p id={helperId} className="mb-2 mt-1 text-xs leading-[1.5] text-ink-400">
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
        className={`h-11 w-full border bg-white px-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:outline-none ${
          error !== null ? 'border-red-500 focus:border-red-500' : 'border-ink-200 focus:border-brand-violet'
        }`}
      />
      {error !== null && (
        <p id={errorId} role="alert" className="mt-2 text-[13px] text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
