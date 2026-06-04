import { useEffect, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { useWizard } from '../../../hooks/useWizard'
import type { AlternativaId } from '../../../types/docfap'
import { getAlternativeDisplayLabel } from '../../docfap/tableHelpers'
import { RadioGroup } from '../../ui/RadioGroup'
import { SelectField } from '../../ui/SelectField'
import { Textarea } from '../../ui/Textarea'

const MOTIVAZIONE_MAX = 800

function isDecisioneCoerente(
  alternativaScelta: AlternativaId | '',
  recommendedId: AlternativaId | null,
): boolean | null {
  if (!alternativaScelta || !recommendedId) return null
  return alternativaScelta === recommendedId
}

export function Step7_DecisioneRUP() {
  const { state, setDecisione } = useWizard()

  const ranking = useMemo(() => {
    const defined = new Set(state.alternativeDefinite)
    const scores = (state.scoreFinale ?? []).filter((s) => defined.has(s.alternativaId))
    return [...scores].sort((a, b) => b.scoreFinale - a.scoreFinale)
  }, [state.scoreFinale, state.alternativeDefinite])

  const recommendedId = useMemo(() => {
    if (ranking.length === 0) return null
    return ranking[0]?.alternativaId ?? null
  }, [ranking])

  const selectableAlternativeIds = useMemo(
    () => ranking.map((item) => item.alternativaId),
    [ranking],
  )

  const options = useMemo(() => {
    return selectableAlternativeIds.map((id) => {
      const alt = state.alternative[id]
      const label = getAlternativeDisplayLabel(id, alt)
      return { value: id, label }
    })
  }, [selectableAlternativeIds, state.alternative])

  const recommendedLabel = useMemo(() => {
    if (!recommendedId) return null
    return getAlternativeDisplayLabel(recommendedId, state.alternative[recommendedId])
  }, [recommendedId, state.alternative])

  const selectedAlt = state.decisioneRUP?.alternativaScelta ?? ''
  const coerenzaValue = state.decisioneRUP
    ? state.decisioneRUP.coerente
      ? 'si'
      : 'no'
    : ''
  const motivazione = state.decisioneRUP?.motivazione ?? ''
  const hasDivergenza = coerenzaValue === 'no'

  useEffect(() => {
    if (state.decisioneRUP) return

    const timeoutId = window.setTimeout(() => {
      setDecisione({
        alternativaScelta: (selectableAlternativeIds[0] ?? 'A1') as AlternativaId,
        coerente: true,
        motivazione: '',
        passiSuccessivi: '',
      })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [selectableAlternativeIds, setDecisione, state.decisioneRUP])

  const selectError = selectedAlt ? undefined : 'Seleziona un\'alternativa.'
  const coerenzaError = coerenzaValue ? undefined : 'Indica se la scelta è coerente con la raccomandazione.'
  const motivazioneError = motivazione.trim().length > 0 ? undefined : 'La motivazione della scelta è obbligatoria.'

  return (
    <div style={rootStyle}>
      <SelectField
        label="Alternativa selezionata dal RUP"
        required
        value={selectedAlt}
        onChange={(value) => {
          const nextAlt = value as AlternativaId
          const coerenteAuto = isDecisioneCoerente(nextAlt, recommendedId)

          setDecisione({
            alternativaScelta: nextAlt,
            coerente: coerenteAuto ?? true,
            motivazione,
            passiSuccessivi: '',
          })
        }}
        options={options}
        placeholder="— Seleziona alternativa —"
        helperText={
          recommendedLabel
            ? `Raccomandazione sistema: ${recommendedLabel}`
            : 'La raccomandazione sarà disponibile dopo il calcolo dello score finale.'
        }
        errorText={selectError}
      />

      <RadioGroup
        legend="La scelta è coerente con la raccomandazione del sistema?"
        required
        value={coerenzaValue}
        onChange={(value) => {
          setDecisione({
            alternativaScelta: (selectedAlt || (selectableAlternativeIds[0] ?? 'A1')) as AlternativaId,
            coerente: value === 'si',
            motivazione,
            passiSuccessivi: '',
          })
        }}
        options={[
          { value: 'si', label: 'Sì — coerente' },
          { value: 'no', label: 'No — scelta divergente' },
        ]}
        errorText={coerenzaError}
      />

      <div
        aria-hidden={!hasDivergenza}
        style={{
          ...promptDivergenteStyle,
          ...(hasDivergenza ? promptDivergenteVisibleStyle : promptDivergenteHiddenStyle),
        }}
      >
        Specificare i fattori che hanno determinato la scelta diversa dalla raccomandazione.
      </div>

      <Textarea
        label="Motivazione della scelta"
        required
        maxLength={MOTIVAZIONE_MAX}
        value={motivazione}
        onChange={(value) => {
          setDecisione({
            alternativaScelta: (selectedAlt || (selectableAlternativeIds[0] ?? 'A1')) as AlternativaId,
            coerente: coerenzaValue !== 'no',
            motivazione: value,
            passiSuccessivi: '',
          })
        }}
        errorText={motivazioneError}
        helperText="Motivazione obbligatoria (max 800 caratteri)."
      />
    </div>
  )
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
}

const promptDivergenteStyle: CSSProperties = {
  border: '1px solid var(--color-border-warning)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-warning-lighter)',
  color: 'var(--color-text-warning)',
  padding: 'var(--spacing-inset-s)',
}

const promptDivergenteVisibleStyle: CSSProperties = {
  display: 'block',
}

const promptDivergenteHiddenStyle: CSSProperties = {
  display: 'none',
}
