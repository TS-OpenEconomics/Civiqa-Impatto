// Tab "Analisi Multicriteria" — criteri qualitativi MCA per cluster
import type { CSSProperties } from 'react'
import { useSyncExternalStore } from 'react'
import { CLUSTER_MCA } from '../../data/mca/clusters'
import { wizardStore } from '../../store/wizardStore'
import {
  getAlternativeDisplayLabel,
  getRecommendedAlternativeId,
  getDefinedScores,
  getDetailFinalRecommendedCellStyle,
  labelColumnStyle,
  alternativeColumnStyle,
  detailHeaderCellBaseStyle,
  detailRecommendedHeaderStyle,
  detailHeaderLabelWrapStyle,
  detailHeaderLabelStyle,
  detailRecommendedBadgeStyle,
  detailRowHeaderStyle,
  detailBodyCellStyle,
  detailRecommendedColumnStyle,
  detailFinalRowHeaderStyle,
  detailEmptyStyle,
  detailTableWrapStyle,
} from './tableHelpers'
import { MCARadarChart } from './charts/MCARadarChart'

// ── Badge livello ────────────────────────────────────────────────────────
type LivelloMCA = 'alto' | 'medio' | 'basso' | 'nullo'

const LIVELLO_LABEL: Record<LivelloMCA, string> = {
  alto:  'Alto',
  medio: 'Medio',
  basso: 'Basso',
  nullo: 'Nullo',
}

const LIVELLO_STYLE: Record<LivelloMCA, CSSProperties> = {
  alto:  { background: '#e8f5e9', color: '#1b5e20', border: '1px solid #a5d6a7' },
  medio: { background: '#fff8e1', color: '#e65100', border: '1px solid #ffe082' },
  basso: { background: '#ffebee', color: '#b71c1c', border: '1px solid #ef9a9a' },
  nullo: { background: '#f5f5f5', color: '#757575', border: '1px solid #e0e0e0' },
}

function LivelloBadge({ livello }: { livello: LivelloMCA | undefined }) {
  if (!livello) return <span style={emptyBadgeStyle}>—</span>
  return (
    <span style={{ ...badgeBaseStyle, ...LIVELLO_STYLE[livello] }}>
      {LIVELLO_LABEL[livello]}
    </span>
  )
}

function parsePercent(value: string | number): number {
  if (typeof value === 'number') return value
  const n = Number.parseFloat(value.replace('%', '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

export function TabRisk() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = getDefinedScores(state.scoreFinale, state.alternativeDefinite)
  const recommendedId = getRecommendedAlternativeId(scores)
  const cluster = state.clusterId ? CLUSTER_MCA[state.clusterId] : null

  // ← fix: use criteriiQualitativi (MCA) not fattoriRischio (rischio)
  const criteri = cluster?.criteriiQualitativi ?? []

  if (scores.length === 0 || criteri.length === 0) {
    return <p style={emptyStyle}>Nessun dettaglio Analisi Multicriteria disponibile.</p>
  }

  return (
    <div style={wrapStyle}>
      {/* ── Tabella criteri ───────────────────────────────────────────── */}
      <div style={detailTableWrapStyle}>
        <table style={tableStyle}>
          <colgroup>
            <col style={labelColumnStyle} />
            <col style={pesoColumnStyle} />
            {scores.map(s => <col key={s.alternativaId} style={alternativeColumnStyle(scores.length)} />)}
          </colgroup>
          <thead>
            <tr>
              <th style={headerCellStyle}>Criterio</th>
              <th style={{ ...headerCellStyle, textAlign: 'center' }}>Peso</th>
              {scores.map(s => {
                const isRec = s.alternativaId === recommendedId
                return (
                  <th key={s.alternativaId} style={{ ...headerCellStyle, ...(isRec ? recommendedHeaderStyle : null) }}>
                    <div style={headerLabelWrapStyle}>
                      <span style={headerLabelStyle}>
                        {getAlternativeDisplayLabel(s.alternativaId, state.alternative[s.alternativaId])}
                      </span>
                      {isRec && <span style={recommendedBadgeStyle}>Raccomandata</span>}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {criteri.map((criterio, rowIdx) => {
              const peso = parsePercent(criterio.pesoDefault)
              return (
                <tr key={criterio.id} style={rowIdx % 2 === 1 ? rowAlternateStyle : undefined}>
                  <th scope="row" style={rowHeaderStyle} title={criterio.domanda}>
                    {criterio.criterio}
                  </th>
                  <td style={{ ...bodyCellStyle, textAlign: 'center', color: 'var(--color-text-primary-light)' }}>
                    {peso}%
                  </td>
                  {scores.map(s => {
                    const isRec = s.alternativaId === recommendedId
                    const rawLivello = (state.mcaScores[s.alternativaId]?.[criterio.id] ?? '').toLowerCase() as LivelloMCA | ''
                    const livello: LivelloMCA | undefined = rawLivello in LIVELLO_LABEL
                      ? rawLivello as LivelloMCA
                      : undefined
                    return (
                      <td
                        key={`${criterio.id}-${s.alternativaId}`}
                        style={{ ...bodyCellStyle, textAlign: 'center', ...(isRec ? recommendedColumnStyle : null) }}
                      >
                        <LivelloBadge livello={livello} />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            <tr>
              <th scope="row" style={finalRowHeaderStyle} colSpan={2}>
                Punteggio Analisi Multicriteria
              </th>
              {scores.map(s => (
                <td key={`mca-${s.alternativaId}`} style={getDetailFinalRecommendedCellStyle(s.alternativaId === recommendedId)}>
                  {s.mcaScore.toFixed(1)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Radar chart ──────────────────────────────────────────────── */}
      <MCARadarChart
        scores={scores}
        alternative={state.alternative}
        criteri={criteri}
        mcaScores={state.mcaScores}
      />
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────
const wrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-stack-m, 24px)',
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  background: 'var(--color-background-inverse)',
}

const pesoColumnStyle: CSSProperties = { width: '64px' }

const headerCellStyle: CSSProperties = detailHeaderCellBaseStyle
const recommendedHeaderStyle: CSSProperties = detailRecommendedHeaderStyle
const headerLabelWrapStyle: CSSProperties = detailHeaderLabelWrapStyle
const headerLabelStyle: CSSProperties = detailHeaderLabelStyle
const recommendedBadgeStyle: CSSProperties = detailRecommendedBadgeStyle
const rowHeaderStyle: CSSProperties = detailRowHeaderStyle
const bodyCellStyle: CSSProperties = detailBodyCellStyle
const recommendedColumnStyle: CSSProperties = detailRecommendedColumnStyle
const finalRowHeaderStyle: CSSProperties = detailFinalRowHeaderStyle
const emptyStyle: CSSProperties = detailEmptyStyle
const rowAlternateStyle: CSSProperties = { background: 'rgba(127,127,140,0.06)' }

const badgeBaseStyle: CSSProperties = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 'var(--radius-rounded, 40px)',
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.6,
  letterSpacing: '0.01em',
  whiteSpace: 'nowrap',
}

const emptyBadgeStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontSize: 14,
}
