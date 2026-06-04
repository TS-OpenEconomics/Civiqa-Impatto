import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { INTERVENTION_CATEGORIES } from '../../../data/poc_docfap/intervention_categories_layer3'
import { getMatrixQuestions, loadPocData } from '../../../data/poc_docfap/evaluation_matrix'
import type { McaQuestion } from '../../../data/poc_docfap/evaluation_matrix'
import { useWizard } from '../../../hooks/useWizard'

const TIPOLOGIA_LABELS: Record<string, string> = {
  nuova_realizzazione: 'Nuova realizzazione',
  ristrutturazione: 'Ristrutturazione',
  ristrutturazione_efficientamento: 'Ristrutturazione con EE',
  manutenzione_straordinaria_ee: 'Manutenzione straordinaria EE',
  manutenzione_ordinaria: 'Manutenzione ordinaria',
  restauro: 'Restauro',
  recupero: 'Recupero',
  ampliamento_potenziamento: 'Ampliamento / potenziamento',
  ammodernamento_tecnologico: 'Ammodernamento tecnologico',
  demolizione: 'Demolizione',
  lavori_socialmente_utili: 'Lavori socialmente utili',
  altro: 'Altro',
}

type EvalScale = 'A' | 'M' | 'B' | 'N'
const SCALE_OPTIONS: Array<{ value: EvalScale; label: string }> = [
  { value: 'A', label: 'Alto' },
  { value: 'M', label: 'Medio' },
  { value: 'B', label: 'Basso' },
  { value: 'N', label: 'Nullo' },
]

type SupportedAlternativaId = 'A1' | 'A2' | 'A3'

function isSupportedId(id: string): id is SupportedAlternativaId {
  return id === 'A1' || id === 'A2' || id === 'A3'
}

function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function McaQualitativa() {
  const { state, setMcaScores } = useWizard()
  const [questions, setQuestions] = useState<McaQuestion[]>([])
  const [loaded, setLoaded] = useState(false)

  const alternativeIds = useMemo(
    () => state.alternativeDefinite.filter(isSupportedId),
    [state.alternativeDefinite],
  )

  useEffect(() => {
    const clusterIds = state.clusterId ? [state.clusterId] : []
    loadPocData().then(() => {
      setQuestions(getMatrixQuestions(clusterIds))
      setLoaded(true)
    })
  }, [state.clusterId])

  const totalCells = questions.length * alternativeIds.length

  const filledCells = useMemo(() => {
    let count = 0
    for (const altId of alternativeIds) {
      const scores = state.mcaScores[altId] ?? {}
      for (const q of questions) {
        if (scores[q.qCode]) count++
      }
    }
    return count
  }, [state.mcaScores, alternativeIds, questions])

  const allFilled = totalCells > 0 && filledCells === totalCells

  function getAltLabel(altId: SupportedAlternativaId): string {
    const alt = state.alternative[altId]
    if (!alt) return `Alternativa ${altId.slice(1)}`
    const catRecord = INTERVENTION_CATEGORIES.find(c => c.code === alt.categoria)
    const catLabel = catRecord?.label ?? alt.categoria
    const tipLabel = TIPOLOGIA_LABELS[alt.tipologia] ?? alt.tipologia
    if (catLabel && tipLabel) return `${toTitleCase(catLabel)} — ${toTitleCase(tipLabel)}`
    return `Alternativa ${altId.slice(1)}`
  }

  if (!loaded) {
    return (
      <div role="status" aria-busy="true" style={{ padding: 'var(--spacing-inset-m)' }}>
        <span style={srOnly}>Caricamento domande MCA</span>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div style={emptyStyle}>
        Nessuna domanda MCA disponibile per il cluster selezionato.
      </div>
    )
  }

  return (
    <div style={rootStyle}>
      <style>{segStyles}</style>
      <p style={progressStyle}>
        {filledCells} / {totalCells} valutazioni compilate
      </p>

      <div style={criteriaListStyle}>
        {questions.map((q, qi) => (
          <fieldset key={q.qCode} style={criterionCardStyle}>
            <legend style={criterionLegendStyle}>
              <span style={criterionNumStyle}>{qi + 1}</span>
              <span style={criterionTextStyle}>{q.text}</span>
            </legend>
            <div style={altListStyle}>
              {alternativeIds.map((altId) => {
                const current = (state.mcaScores[altId] ?? {})[q.qCode] as EvalScale | undefined
                return (
                  <div key={altId} style={altRowStyle}>
                    <span style={altNameStyle}>{getAltLabel(altId)}</span>
                    <div
                      role="radiogroup"
                      aria-label={`${q.text} — ${getAltLabel(altId)}`}
                      style={segGroupStyle}
                    >
                      {SCALE_OPTIONS.map((opt) => {
                        const selected = current === opt.value
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            className="mca-seg"
                            onClick={() => setMcaScores(altId, q.qCode, opt.value)}
                            style={{ ...segBtnStyle, ...(selected ? segBtnSelectedStyle : null) }}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {!allFilled && (
        <p style={hintStyle}>
          Completa tutte le valutazioni per continuare — {totalCells - filledCells} mancanti
        </p>
      )}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const segStyles = `
  .mca-seg:hover {
    border-color: var(--color-border-primary);
    color: var(--color-text-primary);
  }
  .mca-seg[aria-checked="true"]:hover {
    color: var(--color-text-inverse);
  }
  .mca-seg:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-border-focus);
  }
`

const srOnly: CSSProperties = {
  position: 'absolute', width: 1, height: 1, overflow: 'hidden',
  clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap',
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
}

const progressStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-s-size, 14px)',
}

const emptyStyle: CSSProperties = {
  padding: 'var(--spacing-inset-m)',
  border: '1px solid var(--color-border-warning)',
  color: 'var(--color-text-warning)',
  borderRadius: 'var(--radius-smooth)',
}

const criteriaListStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const criterionCardStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  padding: 'var(--spacing-inset-s) var(--spacing-inset-m) var(--spacing-inset-m)',
  margin: 0,
}

const criterionLegendStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'var(--spacing-inline-s)',
  padding: 0,
  marginBottom: 'var(--spacing-stack-s)',
  color: 'var(--color-text-primary)',
  fontWeight: 600,
  lineHeight: 1.4,
}

const criterionNumStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  flexShrink: 0,
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  fontWeight: 700,
  fontSize: 'var(--type-body-xs-size, 13px)',
}

const criterionTextStyle: CSSProperties = {
  paddingTop: '2px',
}

const altListStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
}

const altRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--spacing-inline-m)',
  flexWrap: 'wrap',
  paddingTop: 'var(--spacing-stack-xs)',
  borderTop: '1px solid var(--color-border-secondary-light)',
}

const altNameStyle: CSSProperties = {
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-body-s-size, 14px)',
  flex: '1 1 200px',
  minWidth: '160px',
}

const segGroupStyle: CSSProperties = {
  display: 'flex',
  gap: '6px',
  flex: '1 1 320px',
  maxWidth: '420px',
}

const segBtnStyle: CSSProperties = {
  flex: 1,
  padding: '8px 6px',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 14px)',
  fontWeight: 600,
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'background 0.12s ease, border-color 0.12s ease, color 0.12s ease',
}

const segBtnSelectedStyle: CSSProperties = {
  background: 'var(--color-background-primary)',
  borderColor: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
}

const hintStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}
