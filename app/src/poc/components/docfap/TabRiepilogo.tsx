import type { CSSProperties } from 'react'
import { useSyncExternalStore } from 'react'
import { wizardStore } from '../../store/wizardStore'
import type { ScoreComposito } from '../../types/docfap'
import {
  getAlternativeDisplayLabel,
  getRecommendedAlternativeId,
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
  detailFinalCellStyle,
  detailEmptyStyle,
  formatScore,
  safeNumber,
} from './tableHelpers'
import { BarsChart, ChartCard, altBarColor, tabStackStyle } from './chartHelpers'

const VIOLET = '#5b21f7'
const VIOLET_DARK = '#2e0b86'
const GREEN = '#108a43'

const SUBSCORES = [
  { key: 'cbaScore', label: 'Costi-Benefici', hint: 'Convenienza economica' },
  { key: 'impattoScore', label: 'Impatto', hint: 'Effetti socio-economici' },
  { key: 'rischioScore', label: 'Rischio', hint: 'Robustezza e rischio di perdita' },
] as const satisfies ReadonlyArray<{ key: keyof ScoreComposito; label: string; hint: string }>

const ROWS = [
  { key: 'cbaScore', label: 'Punteggio Analisi Costi Benefici' },
  { key: 'impattoScore', label: "Punteggio Analisi d'impatto" },
  { key: 'rischioScore', label: 'Punteggio Analisi del Rischio' },
] as const

function fmt(value: unknown): string {
  return formatScore(value)
}

function barWidth(value: unknown): string {
  return `${Math.max(2, Math.min(100, safeNumber(value)))}%`
}

export function TabRiepilogo() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = state.scoreFinale ?? []
  const recommendedId = getRecommendedAlternativeId(scores)

  if (scores.length === 0) return <p style={emptyStyle}>Nessun risultato disponibile.</p>

  const recommended = scores.find((score) => score.alternativaId === recommendedId) ?? scores[0]
  const recommendedLabel = getAlternativeDisplayLabel(recommended.alternativaId, state.alternative[recommended.alternativaId])
  const maxFinal = Math.max(...scores.map((score) => safeNumber(score.scoreFinale)), 1)

  const groups = scores.map((score) => ({
    id: score.alternativaId,
    label: getAlternativeDisplayLabel(score.alternativaId, state.alternative[score.alternativaId]),
    bars: [{ value: Number(safeNumber(score.scoreFinale).toFixed(1)), color: altBarColor(score.alternativaId === recommendedId) }],
  }))

  return (
    <div style={tabStackStyle}>
      {/* ── Esito: alternativa raccomandata ─────────────────────────────── */}
      <section style={heroCardStyle}>
        <div style={heroTextWrapStyle}>
          <span style={heroEyebrowStyle}>Esito della valutazione</span>
          <h3 style={heroTitleStyle}>Alternativa raccomandata: {recommendedLabel}</h3>
          <p style={heroSubStyle}>
            Sintesi integrata delle analisi (Costi-Benefici, Impatto, Rischio): è l'alternativa
            con il punteggio composito più alto fra le {scores.length} valutate.
          </p>
        </div>
        <div style={heroScoreStyle}>
          <div>
            <span style={heroScoreNumStyle}>{fmt(recommended.scoreFinale)}</span>
            <span style={heroScoreUnitStyle}> / 100</span>
          </div>
          <span style={heroScoreLabelStyle}>Punteggio finale</span>
        </div>
      </section>

      {/* ── Scomposizione del punteggio raccomandato ────────────────────── */}
      <div style={tileGridStyle}>
        {SUBSCORES.map((sub) => {
          const value = recommended[sub.key]
          return (
            <div key={sub.key} style={tileStyle}>
              <div style={tileLabelStyle}>{sub.label}</div>
              <div style={tileValueRowStyle}>
                <span style={tileValueStyle}>{fmt(value)}</span>
                <span style={tileUnitStyle}>/ 100</span>
              </div>
              <div style={tileTrackStyle}>
                <div style={{ ...tileFillStyle, width: barWidth(value) }} />
              </div>
              <div style={tileHintStyle}>{sub.hint}</div>
            </div>
          )
        })}
      </div>

      {/* ── Confronto grafico ───────────────────────────────────────────── */}
      <ChartCard title="Punteggio finale per alternativa" subtitle="Punteggio composito 0–100 — in verde l'alternativa raccomandata">
        <BarsChart groups={groups} formatValue={(v) => v.toFixed(1)} />
      </ChartCard>

      {/* ── Schede per alternativa ──────────────────────────────────────── */}
      <div style={altGridStyle}>
        {scores.map((score) => {
          const isRecommended = score.alternativaId === recommendedId
          const label = getAlternativeDisplayLabel(score.alternativaId, state.alternative[score.alternativaId])
          return (
            <div key={score.alternativaId} style={altCardStyle(isRecommended)}>
              <div style={altHeadStyle}>
                <span style={altIdStyle}>{score.alternativaId}</span>
                {isRecommended ? <span style={altBadgeStyle}>Raccomandata</span> : null}
              </div>
              <div style={altNameStyle}>{label}</div>
              <div style={altScoreRowStyle}>
                <span style={altScoreStyle(isRecommended)}>{fmt(score.scoreFinale)}</span>
                <span style={altScoreUnitStyle}>/ 100</span>
              </div>
              <div style={altTrackStyle}>
                <div
                  style={{
                    ...altFillStyle,
                    width: `${Math.max(4, (safeNumber(score.scoreFinale) / maxFinal) * 100)}%`,
                    background: isRecommended ? GREEN : VIOLET,
                  }}
                />
              </div>
              <div style={altSubGridStyle}>
                {SUBSCORES.map((sub) => (
                  <div key={sub.key} style={altSubItemStyle}>
                    <span style={altSubLabelStyle}>{sub.label}</span>
                    <span style={altSubValueStyle}>{fmt(score[sub.key])}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Tabella di dettaglio ────────────────────────────────────────── */}
      <ChartCard title="Confronto dettagliato per indicatore" subtitle="Punteggi 0–100 di ciascuna analisi e punteggio composito finale">
        <div style={wrapStyle}>
          <table style={tableStyle}>
            <colgroup>
              <col style={labelColumnStyle} />
              {scores.map((score) => <col key={score.alternativaId} style={alternativeColumnStyle(scores.length)} />)}
            </colgroup>
            <thead>
              <tr>
                <th style={headerCellStyle}>Indicatore</th>
                {scores.map((score) => {
                  const isRecommended = score.alternativaId === recommendedId
                  return (
                    <th key={score.alternativaId} style={{ ...headerCellStyle, ...(isRecommended ? recommendedHeaderStyle : null) }}>
                      <div style={headerLabelWrapStyle}>
                        <span style={headerLabelStyle}>{getAlternativeDisplayLabel(score.alternativaId, state.alternative[score.alternativaId])}</span>
                        {isRecommended ? <span style={recommendedBadgeStyle}>Raccomandata</span> : null}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.key}>
                  <th scope="row" style={rowHeaderStyle}>{row.label}</th>
                  {scores.map((score) => {
                    const isRecommended = score.alternativaId === recommendedId
                    return (
                      <td key={`${row.key}-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>
                        {fmt(score[row.key])}
                      </td>
                    )
                  })}
                </tr>
              ))}
              <tr>
                <th scope="row" style={finalRowHeaderStyle}>Punteggio Finale</th>
                {scores.map((score) => {
                  const isRecommended = score.alternativaId === recommendedId
                  return (
                    <td key={`final-${score.alternativaId}`} style={{ ...finalCellStyle, ...(isRecommended ? recommendedHeaderStyle : null) }}>
                      {fmt(score.scoreFinale)}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────
const heroCardStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
  flexWrap: 'wrap',
  padding: '26px 30px',
  background: `linear-gradient(120deg, ${VIOLET_DARK} 0%, ${VIOLET} 100%)`,
  color: '#fff',
}
const heroTextWrapStyle: CSSProperties = { display: 'grid', gap: 6, maxWidth: 640 }
const heroEyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.7)',
}
const heroTitleStyle: CSSProperties = { margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2 }
const heroSubStyle: CSSProperties = { margin: 0, fontSize: 13.5, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5 }
const heroScoreStyle: CSSProperties = {
  display: 'grid',
  gap: 2,
  justifyItems: 'end',
  textAlign: 'right',
  paddingLeft: 24,
  borderLeft: '1px solid rgba(255,255,255,0.22)',
}
const heroScoreNumStyle: CSSProperties = { fontSize: 52, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }
const heroScoreUnitStyle: CSSProperties = { fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }
const heroScoreLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.7)',
}

// ── Tiles ──────────────────────────────────────────────────────────────────
const tileGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 'var(--spacing-inline-s, 12px)',
}
const tileStyle: CSSProperties = {
  display: 'grid',
  gap: 8,
  padding: '18px 20px',
  background: 'var(--color-background-inverse, #fff)',
  border: '1px solid var(--color-border-secondary-light, #e5e5e8)',
}
const tileLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-text-primary-light, #5a5a60)',
}
const tileValueRowStyle: CSSProperties = { display: 'flex', alignItems: 'baseline', gap: 6 }
const tileValueStyle: CSSProperties = { fontSize: 30, fontWeight: 800, lineHeight: 1, color: 'var(--color-text-primary, #0e0e10)', letterSpacing: '-0.02em' }
const tileUnitStyle: CSSProperties = { fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary-light, #7b7b82)' }
const tileTrackStyle: CSSProperties = { height: 6, background: 'var(--color-background-secondary-lightest, #f1f1f1)' }
const tileFillStyle: CSSProperties = { height: '100%', background: VIOLET }
const tileHintStyle: CSSProperties = { fontSize: 12, color: 'var(--color-text-primary-light, #7b7b82)' }

// ── Alternative cards ────────────────────────────────────────────────────────
const altGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 'var(--spacing-inline-s, 12px)',
}
const altCardStyle = (recommended: boolean): CSSProperties => ({
  display: 'grid',
  gap: 10,
  padding: '18px 20px',
  background: 'var(--color-background-inverse, #fff)',
  border: `1px solid ${recommended ? GREEN : 'var(--color-border-secondary-light, #e5e5e8)'}`,
  borderTop: `3px solid ${recommended ? GREEN : VIOLET}`,
})
const altHeadStyle: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }
const altIdStyle: CSSProperties = { fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', color: VIOLET_DARK }
const altBadgeStyle: CSSProperties = { padding: '3px 8px', background: GREEN, color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: '0.04em' }
const altNameStyle: CSSProperties = { fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary, #0e0e10)', lineHeight: 1.3 }
const altScoreRowStyle: CSSProperties = { display: 'flex', alignItems: 'baseline', gap: 6 }
const altScoreStyle = (recommended: boolean): CSSProperties => ({ fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em', color: recommended ? GREEN : 'var(--color-text-primary, #0e0e10)' })
const altScoreUnitStyle: CSSProperties = { fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary-light, #7b7b82)' }
const altTrackStyle: CSSProperties = { height: 8, background: 'var(--color-background-secondary-lightest, #f1f1f1)' }
const altFillStyle: CSSProperties = { height: '100%' }
const altSubGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 14px', marginTop: 4 }
const altSubItemStyle: CSSProperties = { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }
const altSubLabelStyle: CSSProperties = { fontSize: 11.5, color: 'var(--color-text-primary-light, #7b7b82)' }
const altSubValueStyle: CSSProperties = { fontSize: 12.5, fontWeight: 700, color: 'var(--color-text-primary, #0e0e10)' }

// ── Tabella ──────────────────────────────────────────────────────────────────
const wrapStyle: CSSProperties = { overflowX: 'auto' }
const tableStyle: CSSProperties = { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }
const headerCellStyle: CSSProperties = detailHeaderCellBaseStyle
const recommendedHeaderStyle: CSSProperties = detailRecommendedHeaderStyle
const headerLabelWrapStyle: CSSProperties = detailHeaderLabelWrapStyle
const headerLabelStyle: CSSProperties = detailHeaderLabelStyle
const recommendedBadgeStyle: CSSProperties = detailRecommendedBadgeStyle
const rowHeaderStyle: CSSProperties = detailRowHeaderStyle
const bodyCellStyle: CSSProperties = detailBodyCellStyle
const recommendedColumnStyle: CSSProperties = detailRecommendedColumnStyle
const finalRowHeaderStyle: CSSProperties = detailFinalRowHeaderStyle
const finalCellStyle: CSSProperties = detailFinalCellStyle
const emptyStyle: CSSProperties = detailEmptyStyle
