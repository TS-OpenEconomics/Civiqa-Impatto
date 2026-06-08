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

/** Groups items into chunks of `size` (used to render questions two-by-two). */
function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
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
    let active = true
    loadPocData().then(() => {
      if (!active) return
      setQuestions(getMatrixQuestions(clusterIds))
      setLoaded(true)
    })
    return () => {
      active = false
    }
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

  // Questions grouped two-by-two into visual blocks.
  const questionPairs = useMemo(() => chunk(questions, 2), [questions])

  function getAltLabel(altId: SupportedAlternativaId): string {
    const alt = state.alternative[altId]
    if (alt?.nome) return alt.nome
    if (alt?.categoria) {
      const catRecord = INTERVENTION_CATEGORIES.find((c) => c.code === alt.categoria)
      const catLabel = catRecord?.label ?? alt.categoria
      const tipLabel = TIPOLOGIA_LABELS[alt.tipologia] ?? alt.tipologia
      if (catLabel && tipLabel) return `${toTitleCase(catLabel)} — ${toTitleCase(tipLabel)}`
    }
    return `Alternativa ${altId.slice(1)}`
  }

  if (!loaded) {
    return (
      <div role="status" aria-busy="true" style={{ padding: 'var(--spacing-inset-m)' }}>
        <span style={srOnly}>Caricamento criteri di valutazione</span>
      </div>
    )
  }

  if (alternativeIds.length === 0) {
    return (
      <div style={emptyStyle}>
        Definisci almeno un'alternativa progettuale per poterla valutare sui criteri qualitativi.
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div style={emptyStyle}>
        Nessun criterio di valutazione disponibile per il cluster selezionato.
      </div>
    )
  }

  return (
    <div style={rootStyle}>
      <style>{interactiveStyles}</style>

      <p style={progressStyle}>
        <strong style={{ color: 'var(--color-text-primary)' }}>{filledCells}</strong> / {totalCells} valutazioni
      </p>

      {alternativeIds.map((altId) => {
        const scores = state.mcaScores[altId] ?? {}
        let rowNum = 0

        return (
          <section key={altId} style={altSectionStyle} aria-label={`Valutazione ${getAltLabel(altId)}`}>
            <h3 style={altTitleStyle} title={getAltLabel(altId)}>
              {getAltLabel(altId)}
            </h3>

            <table style={tableStyle}>
              <colgroup>
                <col />
                <col style={{ width: '76px' }} />
                <col style={{ width: '76px' }} />
                <col style={{ width: '76px' }} />
                <col style={{ width: '76px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" style={thCriterionStyle}>
                    Criterio
                  </th>
                  {SCALE_OPTIONS.map((opt) => (
                    <th key={opt.value} scope="col" style={thScaleStyle}>
                      {opt.label}
                    </th>
                  ))}
                </tr>
              </thead>

              {questionPairs.map((pair, pairIndex) => {
                // Alternate the background per pair so the two linked questions read as one block.
                const blockBg =
                  pairIndex % 2 === 0 ? 'var(--color-background-inverse)' : 'var(--color-background-secondary-lightest)'
                return (
                  <tbody key={pairIndex}>
                    {pair.map((q) => {
                      rowNum += 1
                      const current = scores[q.qCode] as EvalScale | undefined
                      return (
                        <tr key={q.qCode} role="radiogroup" aria-label={`${q.label || q.text} — ${getAltLabel(altId)}`}>
                          <th scope="row" style={{ ...rowHeaderStyle, background: blockBg }}>
                            <div style={rowHeaderInnerStyle}>
                              <span style={rowNumStyle}>{rowNum}</span>
                              <span style={rowLabelWrapStyle}>
                                <span style={rowLabelStyle}>{q.label || q.text}</span>
                                {q.label && q.text ? <span style={rowTextStyle}>{q.text}</span> : null}
                              </span>
                            </div>
                          </th>
                          {SCALE_OPTIONS.map((opt, optIndex) => {
                            const selected = current === opt.value
                            const isLast = optIndex === SCALE_OPTIONS.length - 1
                            return (
                              <td
                                key={opt.value}
                                style={{ ...dotCellStyle, ...(isLast ? dotCellLastStyle : null), background: blockBg }}
                              >
                                <button
                                  type="button"
                                  role="radio"
                                  aria-checked={selected}
                                  aria-label={opt.label}
                                  className="mca-dot"
                                  onClick={() => setMcaScores(altId, q.qCode, opt.value)}
                                  style={{ ...dotStyle, ...(selected ? dotSelectedStyle : null) }}
                                >
                                  <span style={selected ? dotInnerSelectedStyle : dotInnerStyle} />
                                </button>
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                )
              })}
            </table>
          </section>
        )
      })}

      {!allFilled && (
        <p style={hintStyle}>
          Completa tutte le valutazioni per continuare — {totalCells - filledCells} mancanti
        </p>
      )}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const interactiveStyles = `
  .mca-dot:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-border-focus);
  }
  .mca-dot:hover { border-color: var(--color-background-primary); }
`

const srOnly: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
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
  border: '1px solid var(--color-border-secondary-light)',
  background: 'var(--color-background-secondary-lightest)',
  color: 'var(--color-text-primary-light)',
  borderRadius: 'var(--radius-smooth)',
  fontSize: 'var(--type-body-s-size, 14px)',
}

const altSectionStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
}

const altTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-m-size, 16px)',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0 6px',
  fontSize: 'var(--type-body-s-size, 14px)',
}

const thCriterionStyle: CSSProperties = {
  textAlign: 'left',
  padding: '0 var(--spacing-inset-s) 4px',
  color: 'var(--color-text-primary-lighter)',
  fontWeight: 600,
  fontSize: 'var(--type-body-xs-size, 12px)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

const thScaleStyle: CSSProperties = {
  textAlign: 'center',
  padding: '0 4px 4px',
  color: 'var(--color-text-primary-lighter)',
  fontWeight: 600,
  fontSize: 'var(--type-body-xs-size, 12px)',
}

const rowHeaderStyle: CSSProperties = {
  textAlign: 'left',
  verticalAlign: 'middle',
  padding: 'var(--spacing-inset-xs) var(--spacing-inset-s)',
  borderTop: '1px solid var(--color-border-secondary-light)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
  borderLeft: '1px solid var(--color-border-secondary-light)',
  borderTopLeftRadius: 'var(--radius-smooth)',
  borderBottomLeftRadius: 'var(--radius-smooth)',
}

const rowHeaderInnerStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-s)',
  alignItems: 'flex-start',
}

const rowNumStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 22,
  height: 22,
  flexShrink: 0,
  borderRadius: 'var(--radius-circle, 80px)',
  background: 'var(--color-background-secondary-lightest)',
  border: '1px solid var(--color-border-secondary)',
  color: 'var(--color-text-primary-light)',
  fontWeight: 700,
  fontSize: '12px',
}

const rowLabelWrapStyle: CSSProperties = {
  display: 'grid',
  gap: '2px',
  minWidth: 0,
}

const rowLabelStyle: CSSProperties = {
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  lineHeight: 1.3,
}

const rowTextStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 12px)',
  lineHeight: 1.4,
}

const dotCellStyle: CSSProperties = {
  textAlign: 'center',
  verticalAlign: 'middle',
  padding: 'var(--spacing-inset-xs) 4px',
  borderTop: '1px solid var(--color-border-secondary-light)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
}

const dotCellLastStyle: CSSProperties = {
  borderRight: '1px solid var(--color-border-secondary-light)',
  borderTopRightRadius: 'var(--radius-smooth)',
  borderBottomRightRadius: 'var(--radius-smooth)',
}

const dotStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 22,
  height: 22,
  borderRadius: 'var(--radius-circle, 80px)',
  border: '2px solid var(--color-border-secondary)',
  background: 'var(--color-background-inverse)',
  cursor: 'pointer',
  padding: 0,
}

const dotSelectedStyle: CSSProperties = {
  borderColor: 'var(--color-background-primary)',
}

const dotInnerStyle: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 'var(--radius-circle, 80px)',
  background: 'transparent',
}

const dotInnerSelectedStyle: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 'var(--radius-circle, 80px)',
  background: 'var(--color-background-primary)',
}

const hintStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}
