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
      <style>{selectStyles}</style>
      <p style={progressStyle}>
        {filledCells} / {totalCells} celle compilate
      </p>
      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '320px', minWidth: '220px' }} />
            {alternativeIds.map((id) => (
              <col key={id} style={{ minWidth: '180px' }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" style={thLabelStyle}>Domanda</th>
              {alternativeIds.map((altId) => (
                <th key={altId} scope="col" style={thAltStyle}>
                  {getAltLabel(altId)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((q, rowIndex) => (
              <tr key={q.qCode} style={rowIndex % 2 === 1 ? trAltStyle : undefined}>
                <th scope="row" style={rowHeaderStyle}>
                  <span style={qLabelStyle}>{q.text}</span>
                </th>
                {alternativeIds.map((altId) => {
                  const current = (state.mcaScores[altId] ?? {})[q.qCode] as EvalScale | undefined
                  const cellId = `mca-${altId}-${q.qCode}`
                  return (
                    <td key={altId} style={tdStyle}>
                      <select
                        id={cellId}
                        className="mca-select"
                        value={current ?? ''}
                        onChange={(e) => {
                          const val = e.target.value as EvalScale
                          if (val) setMcaScores(altId, q.qCode, val)
                        }}
                        aria-label={`${q.text} — ${getAltLabel(altId)}`}
                        style={selectStyle(!!current)}
                      >
                        <option value="" disabled>—</option>
                        {SCALE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!allFilled && (
        <p style={hintStyle}>
          Compila tutte le celle per continuare — {totalCells - filledCells} risposte mancanti
        </p>
      )}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const selectStyles = `
  .mca-select:focus {
    outline: none;
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
  }
  .mca-select:hover {
    border-color: var(--color-border-secondary);
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

const tableWrapStyle: CSSProperties = {
  overflowX: 'auto',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 'var(--type-body-s-size, 14px)',
}

const thLabelStyle: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--spacing-inset-s)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  fontWeight: 700,
  borderBottom: '1px solid var(--color-background-primary)',
  fontSize: 'var(--type-body-xs-size, 13px)',
  letterSpacing: '0.02em',
}

const thAltStyle: CSSProperties = {
  textAlign: 'center',
  padding: 'var(--spacing-inset-s)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  fontWeight: 700,
  borderBottom: '1px solid var(--color-background-primary)',
  borderLeft: '1px solid rgba(255,255,255,0.25)',
  fontSize: 'var(--type-body-xs-size, 13px)',
  letterSpacing: '0.01em',
}

const rowHeaderStyle: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
  verticalAlign: 'middle',
}

const qLabelStyle: CSSProperties = {
  display: 'block',
  color: 'var(--color-text-primary)',
  fontWeight: 400,
  lineHeight: 1.45,
}

const tdStyle: CSSProperties = {
  padding: 'var(--spacing-inset-xs) var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
  borderLeft: '1px solid var(--color-border-secondary-light)',
  textAlign: 'center',
  verticalAlign: 'middle',
}

const trAltStyle: CSSProperties = {
  background: 'var(--color-background-secondary-lightest)',
}

function selectStyle(hasValue: boolean): CSSProperties {
  return {
    width: '100%',
    maxWidth: '140px',
    padding: '6px var(--spacing-inset-xs)',
    border: `1px solid ${hasValue ? 'var(--color-border-primary)' : 'var(--color-border-secondary-light)'}`,
    borderRadius: 'var(--radius-smooth)',
    fontSize: 'var(--type-body-s-size, 14px)',
    fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
    fontWeight: hasValue ? 600 : 400,
    color: hasValue ? 'var(--color-text-primary)' : 'var(--color-text-primary-light)',
    background: hasValue ? 'var(--color-background-inverse)' : 'var(--color-background-secondary-lightest)',
    cursor: 'pointer',
    appearance: 'auto',
    outline: 'none',
  }
}

const hintStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}
