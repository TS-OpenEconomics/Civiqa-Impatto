import { Fragment, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { CLUSTER_MCA } from '../../../data/mca/clusters'
import { useWizard } from '../../../hooks/useWizard'
import type { AlternativaData, AlternativaId } from '../../../types/docfap'
import { SelectField } from '../../ui/SelectField'
import { Textarea } from '../../ui/Textarea'
import {
  getComparisonAlternativeLabel,
  getComparisonColumnWidth,
  hasComparisonAlternativeData,
} from '../comparisonTable'

type RiskLevel = 'alto' | 'medio' | 'basso' | 'nullo'

type RiskOption = {
  value: RiskLevel
  label: string
}

const RISK_LEVELS: RiskOption[] = [
  { value: 'alto', label: 'Alto' },
  { value: 'medio', label: 'Medio' },
  { value: 'basso', label: 'Basso' },
  { value: 'nullo', label: 'Nullo' },
]

const DISPLAYED_ALTERNATIVE_IDS = ['A1', 'A2', 'A3'] as const satisfies readonly AlternativaId[]

type AlternativeMap = Record<AlternativaId, AlternativaData | null>

function getVisibleAlternativeIds(
  definedIds: AlternativaId[],
  alternatives: AlternativeMap,
): AlternativaId[] {
  return DISPLAYED_ALTERNATIVE_IDS.filter((id) => {
    if (!definedIds.includes(id)) return false
    if (id === 'A3' && !hasComparisonAlternativeData(alternatives.A3)) return false
    return true
  })
}

export function Step5_1_RischiMatrice() {
  const { state, setRischi, setRischioNota } = useWizard()

  const factorList = useMemo(() => {
    if (!state.clusterId) return []
    return CLUSTER_MCA[state.clusterId]?.fattoriRischio ?? []
  }, [state.clusterId])

  const alternativeIds = useMemo(() => {
    const visible: AlternativaId[] = [...state.alternativeDefinite]
    return getVisibleAlternativeIds(visible, state.alternative)
  }, [state.alternative, state.alternativeDefinite])

  const totalColumns = 1 + alternativeIds.length
  const columnWidth = getComparisonColumnWidth(totalColumns)

  if (!state.clusterId || factorList.length === 0) {
    return (
      <div role="status" aria-live="polite" style={emptyStyle}>
        Nessun fattore rischio disponibile: completa prima la selezione cluster in Fase 3.
      </div>
    )
  }

  return (
    <div style={rootStyle}>
      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <colgroup>
            {Array.from({ length: totalColumns }).map((_, index) => (
              <col key={`risk-col-${index}`} style={{ width: columnWidth }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" style={headerCellStyle}>Tipologia Rischio</th>
              {alternativeIds.map((alternativaId) => (
                <th key={alternativaId} scope="col" style={headerCellStyle}>
                  {getComparisonAlternativeLabel(alternativaId, state.alternative[alternativaId])}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {factorList.map((fattore) => {
              const nulloNotes = alternativeIds.filter(
                (alternativaId) => state.rischiScores[alternativaId]?.[fattore.id] === 'nullo',
              )

              return (
                <Fragment key={fattore.id}>
                  <tr>
                    <th scope="row" style={rowHeaderStyle}>
                      <span style={rowCategoryStyle}>{fattore.categoriaRischio}</span>
                      <strong style={rowFactorStyle}>{fattore.fattore}</strong>
                    </th>
                    {alternativeIds.map((alternativaId) => {
                      const selectedLevel = state.rischiScores[alternativaId]?.[fattore.id] ?? ''
                      const altLabel = getComparisonAlternativeLabel(alternativaId, state.alternative[alternativaId])

                      return (
                        <td key={`${fattore.id}-${alternativaId}`} style={bodyCellStyle}>
                          <div style={selectCellStyle}>
                            <SelectField
                              label={`Livello rischio - ${altLabel}`}
                              visuallyHiddenLabel
                              value={selectedLevel}
                              onChange={(value) => {
                                setRischi(alternativaId, {
                                  ...state.rischiScores[alternativaId],
                                  [fattore.id]: value as RiskLevel,
                                })
                              }}
                              options={RISK_LEVELS.map((option) => ({
                                value: option.value,
                                label: option.label,
                              }))}
                              required
                              className="risk-matrix-select"
                            />
                          </div>
                        </td>
                      )
                    })}
                  </tr>

                  {nulloNotes.length > 0 && (
                    <tr>
                      <td colSpan={1 + alternativeIds.length} style={noteRowCellStyle}>
                        <div style={noteGridStyle}>
                          {nulloNotes.map((alternativaId) => {
                            const altLabel = getComparisonAlternativeLabel(alternativaId, state.alternative[alternativaId])
                            const noteValue = state.rischiNote[alternativaId]?.[fattore.id] ?? ''

                            return (
                              <div key={`${fattore.id}-${alternativaId}-note`} style={noteItemStyle}>
                                <Textarea
                                  label={`Motiva la scelta Nullo - ${altLabel}`}
                                  value={noteValue}
                                  onChange={(value) => setRischioNota(alternativaId, fattore.id, value)}
                                  rows={3}
                                  required
                                  helperText="Obbligatoria per il livello Nullo."
                                />
                              </div>
                            )
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
}

const tableWrapStyle: CSSProperties = {
  overflowX: 'auto',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  background: 'var(--color-background-inverse)',
}

const headerCellStyle: CSSProperties = {
  textAlign: 'left',
  verticalAlign: 'top',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  fontWeight: 'var(--type-weight-bold, 700)',
}

const rowHeaderStyle: CSSProperties = {
  textAlign: 'left',
  verticalAlign: 'top',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
  color: 'var(--color-text-primary)',
}

const rowCategoryStyle: CSSProperties = {
  display: 'block',
  marginBottom: '4px',
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 700,
}

const rowFactorStyle: CSSProperties = {
  display: 'block',
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 400,
  lineHeight: '1.35',
}

const bodyCellStyle: CSSProperties = {
  verticalAlign: 'top',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
}

const selectCellStyle: CSSProperties = {
  minWidth: 0,
}

const noteRowCellStyle: CSSProperties = {
  padding: '0 var(--spacing-inset-s) var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
  background: 'var(--color-background-inverse)',
}

const noteGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 'var(--spacing-stack-s)',
  paddingTop: 'var(--spacing-stack-s)',
}

const noteItemStyle: CSSProperties = {
  minWidth: 0,
}

const emptyStyle: CSSProperties = {
  padding: 'var(--spacing-inset-s)',
  borderRadius: 'var(--radius-smooth)',
  border: '1px solid var(--color-border-warning)',
  background: 'var(--color-background-warning-lighter)',
  color: 'var(--color-text-warning)',
}
