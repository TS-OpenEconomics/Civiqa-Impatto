// RiskHeatmap — NPV heatmap across cost × benefit multiplier grid
// Color: dark red (NPV << 0) → light yellow (NPV ≈ 0) → dark green (NPV >> 0)
// Per-alternative with switcher (capex/opex differ per alternative).
import type { CSSProperties } from 'react'
import { useState } from 'react'
import type { ScoreComposito, AlternativaId, AlternativaData } from '../../../types/docfap'
import { getAlternativeDisplayLabel } from '../tableHelpers'
import {
  computeHeatmapCells,
  HEATMAP_COST_MULTS,
  HEATMAP_BENEFIT_MULTS,
} from '../../../engine/riskMonteCarlo'

// ── Color scale ─────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

function npvToColor(npv: number, maxAbsNpv: number): string {
  const norm = Math.max(-1, Math.min(1, npv / Math.max(maxAbsNpv, 1)))
  if (norm >= 0) {
    // 0 → #f9fbe7 (very light), 1 → #1b5e20 (dark green)
    const t = norm
    return `rgb(${lerp(249, 27, t)},${lerp(251, 94, t)},${lerp(231, 32, t)})`
  } else {
    // 0 → #f9fbe7, -1 → #b71c1c (dark red)
    const t = -norm
    return `rgb(${lerp(249, 183, t)},${lerp(251, 28, t)},${lerp(231, 28, t)})`
  }
}

function textColor(norm: number): string {
  return Math.abs(norm) > 0.45 ? '#fff' : '#333'
}

interface Props {
  scores: ScoreComposito[]
  alternative: Partial<Record<AlternativaId, AlternativaData>>
}

export function RiskHeatmap({ scores, alternative }: Props) {
  const [selectedId, setSelectedId] = useState<AlternativaId>(scores[0]?.alternativaId)
  if (scores.length === 0) return null

  const score = scores.find(s => s.alternativaId === selectedId) ?? scores[0]
  const altData = alternative[score.alternativaId]
  const capex = altData?.capex ?? 0
  const opex  = altData?.opex  ?? 0

  const cells = computeHeatmapCells(capex, opex)
  const maxAbsNpv = Math.max(...cells.map(c => Math.abs(c.npv)))

  // Build grid: rows = cost mults (top to bottom), cols = benefit mults (left to right)
  const costMults    = [...HEATMAP_COST_MULTS].reverse()   // high cost at top
  const benefitMults = [...HEATMAP_BENEFIT_MULTS]

  const CELL_W = 72
  const CELL_H = 40
  const ROW_HEADER_W = 56
  const COL_HEADER_H = 32

  return (
    <div style={cardStyle}>
      <div style={headerRowStyle}>
        <div>
          <h3 style={titleStyle}>Heatmap NPV — sensitività combinata Costi × Benefici</h3>
          <p style={subtitleStyle}>
            VANE in k€ al variare dei moltiplicatori di costo (righe) e beneficio (colonne).
            Verde = NPV positivo, Rosso = NPV negativo.
          </p>
        </div>
        {scores.length > 1 && (
          <div style={switcherStyle} role="group" aria-label="Seleziona alternativa">
            {scores.map(s => {
              const label = getAlternativeDisplayLabel(s.alternativaId, alternative[s.alternativaId])
              const isActive = s.alternativaId === selectedId
              return (
                <button key={s.alternativaId} type="button" style={btnStyle(isActive)}
                  onClick={() => setSelectedId(s.alternativaId)} aria-pressed={isActive}>
                  {label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'inline-block', minWidth: ROW_HEADER_W + benefitMults.length * CELL_W + 2 }}>

          {/* Column header row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', marginLeft: ROW_HEADER_W }}>
            {benefitMults.map(bm => (
              <div key={bm} style={{ width: CELL_W, textAlign: 'center', fontSize: 11,
                color: 'var(--color-text-primary-light)', fontWeight: 600, paddingBottom: 4 }}>
                {bm.toFixed(1)}×
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-primary-light)', marginLeft: ROW_HEADER_W,
            marginBottom: 4, textAlign: 'center', fontStyle: 'italic' }}>
            Benefici ×
          </div>

          {/* Data rows */}
          {costMults.map(cm => (
            <div key={cm} style={{ display: 'flex', alignItems: 'center' }}>
              {/* Row header */}
              <div style={{ width: ROW_HEADER_W, fontSize: 11, fontWeight: 600,
                color: 'var(--color-text-primary-light)', textAlign: 'right', paddingRight: 8,
                flexShrink: 0 }}>
                {cm.toFixed(1)}×
              </div>
              {/* Cells */}
              {benefitMults.map(bm => {
                const cell = cells.find(c => c.costMult === cm && c.benefitMult === bm)
                const npv = cell?.npv ?? 0
                const norm = Math.max(-1, Math.min(1, npv / Math.max(maxAbsNpv, 1)))
                const bg = npvToColor(npv, maxAbsNpv)
                const fg = textColor(norm)
                return (
                  <div key={bm} style={{
                    width: CELL_W, height: CELL_H, background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600, color: fg,
                    border: '1px solid rgba(255,255,255,0.2)',
                    userSelect: 'none',
                  }}
                    title={`Costi ×${cm}, Benefici ×${bm} → NPV: ${npv.toLocaleString('it-IT')} k€`}
                  >
                    {npv.toLocaleString('it-IT')}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Row axis label */}
          <div style={{ fontSize: 11, color: 'var(--color-text-primary-light)', marginTop: 6,
            fontStyle: 'italic', marginLeft: ROW_HEADER_W }}>
            ↑ Costi × (righe)
          </div>
        </div>
      </div>

      {/* Color legend */}
      <div style={legendWrapStyle}>
        <span style={legendLabelStyle}>Negativo</span>
        <div style={legendBarStyle} />
        <span style={legendLabelStyle}>Positivo</span>
      </div>
    </div>
  )
}

const cardStyle: CSSProperties = {
  background: 'var(--color-background-inverse)', border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)', padding: 'var(--spacing-inset-m)',
}
const headerRowStyle: CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  flexWrap: 'wrap', gap: '12px', marginBottom: '16px',
}
const titleStyle: CSSProperties = { margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }
const subtitleStyle: CSSProperties = { margin: 0, fontSize: 13, color: 'var(--color-text-primary-light)' }
const switcherStyle: CSSProperties = { display: 'flex', gap: '6px', flexWrap: 'wrap' }
function btnStyle(isActive: boolean): CSSProperties {
  return {
    padding: '4px 12px', border: isActive ? '2px solid #5B21F7' : '1px solid #d0d0d0',
    borderRadius: 'var(--radius-smooth)',
    background: isActive ? '#5B21F7' : 'var(--color-background-inverse)',
    color: isActive ? '#fff' : 'var(--color-text-primary)',
    fontSize: 13, fontWeight: isActive ? 700 : 400, cursor: 'pointer',
    fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
    transition: 'background 0.15s, color 0.15s',
  }
}
const legendWrapStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, marginTop: 16,
}
const legendBarStyle: CSSProperties = {
  flex: 1, height: 12, borderRadius: 2,
  background: 'linear-gradient(to right, #b71c1c, #f9fbe7, #1b5e20)',
  border: '1px solid #e0e0e0',
}
const legendLabelStyle: CSSProperties = {
  fontSize: 11, color: 'var(--color-text-primary-light)', whiteSpace: 'nowrap',
}
