import { Component } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/* ──────────────────────────────────────────────────────────────────────────
   Grafici inline (SVG/CSS) per i tab di dettaglio DOCFAP.
   Nessuna dipendenza esterna (scelta coerente con app/src/components/ui/Icons.jsx):
   evita i crash da libreria di terze parti e mantiene il bundle leggero.
   Palette: l'alternativa raccomandata usa il verde del badge "Raccomandata",
   le altre il viola del brand.
   ────────────────────────────────────────────────────────────────────────── */

// Palette grafici: l'opzione scelta/raccomandata usa il viola scuro del brand
// (lo stesso evidenziato nelle tabelle di riepilogo), le opzioni non scelte un
// grigio neutro — così è immediato distinguere "cosa è cosa".
export const CHART_CHOSEN_COLOR = '#5B21F7'
export const CHART_UNCHOSEN_COLOR = '#9e9e9e'
export const CHART_BASELINE_COLOR = '#c4c4c8'

export const CHART_RECOMMENDED_COLOR = CHART_CHOSEN_COLOR
export const CHART_DEFAULT_COLOR = CHART_UNCHOSEN_COLOR
export const CHART_SERIES_COLORS = [CHART_CHOSEN_COLOR, CHART_UNCHOSEN_COLOR, '#b0b0b0', '#cfcfcf']

export function altBarColor(isRecommended: boolean): string {
  return isRecommended ? CHART_CHOSEN_COLOR : CHART_UNCHOSEN_COLOR
}

/** Colore di una serie/alternativa: scelta → viola scuro, baseline A0 → grigio
 *  chiaro, altre alternative → grigio neutro. */
export function altColor(altId: string, isRecommended: boolean): string {
  if (isRecommended) return CHART_CHOSEN_COLOR
  if (altId === 'A0') return CHART_BASELINE_COLOR
  return CHART_UNCHOSEN_COLOR
}

/* ── Wrapper per un tab: grafico in alto, tabella sotto ── */
export const tabStackStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
}

/* ── Card contenitore di un grafico ───────────────────────────────────────── */
const chartCardStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  padding: 'var(--spacing-inset-s)',
  background: 'var(--color-background-secondary-lightest, #f1f1f1)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
}
const chartTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}
const chartSubtitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--type-body-xs-size, 14px)',
  color: 'var(--color-text-primary-light)',
}
const chartFallbackStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

/* Error boundary: se un grafico lancia in fase di render, mostriamo un fallback
   invece di far crashare l'intera pagina di dettaglio (la tabella resta visibile). */
class ChartErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return <p style={chartFallbackStyle}>Grafico non disponibile.</p>
    }
    return this.props.children
  }
}

export function ChartCard({
  title,
  subtitle,
  height = 280,
  children,
}: {
  title: string
  subtitle?: string
  height?: number
  children: ReactNode
}) {
  return (
    <figure style={{ ...chartCardStyle, margin: 0 }}>
      <figcaption style={{ display: 'grid', gap: '2px' }}>
        <span style={chartTitleStyle}>{title}</span>
        {subtitle ? <span style={chartSubtitleStyle}>{subtitle}</span> : null}
      </figcaption>
      <div style={{ width: '100%', height }}>
        <ChartErrorBoundary>{children}</ChartErrorBoundary>
      </div>
    </figure>
  )
}

/* ── Legenda ──────────────────────────────────────────────────────────────── */
function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div style={legendRowStyle}>
      {items.map((it) => (
        <span key={it.label} style={legendItemStyle}>
          <span style={{ ...legendSwatchStyle, background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  )
}

/* ── Grafico a barre (singola o raggruppata) ──────────────────────────────── */
export interface BarGroup {
  id: string
  label: string
  bars: { value: number; color: string; name?: string }[]
}

export function BarsChart({
  groups,
  formatValue,
  legend,
}: {
  groups: BarGroup[]
  formatValue: (v: number) => string
  legend?: { label: string; color: string }[]
}) {
  const all = groups.flatMap((g) => g.bars.map((b) => b.value))
  const top = Math.max(0, ...all)
  const bottom = Math.min(0, ...all)
  const range = top - bottom || 1
  const zeroFrac = (0 - bottom) / range // posizione dello zero dal basso (0..1)
  const single = groups.every((g) => g.bars.length === 1)

  return (
    <div style={chartLayoutStyle}>
      <div style={plotStyle}>
        {bottom < 0 && <div style={{ ...zeroLineStyle, bottom: `${zeroFrac * 100}%` }} />}
        {groups.map((g) => (
          <div key={g.id} style={groupStyle} title={g.label}>
            {g.bars.map((b, i) => {
              const h = (Math.abs(b.value) / range) * 100
              const positive = b.value >= 0
              return (
                <div key={i} style={barWrapStyle}>
                  <div
                    title={`${b.name ? `${b.name}: ` : ''}${formatValue(b.value)}`}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: `${h}%`,
                      bottom: positive ? `${zeroFrac * 100}%` : undefined,
                      top: positive ? undefined : `${(1 - zeroFrac) * 100}%`,
                      background: b.color,
                      borderRadius: positive ? '3px 3px 0 0' : '0 0 3px 3px',
                    }}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div style={axisRowStyle}>
        {groups.map((g) => (
          <span key={g.id} style={axisCellStyle}>
            <span style={axisIdStyle}>{g.id}</span>
            {single && <span style={axisValueStyle}>{formatValue(g.bars[0].value)}</span>}
          </span>
        ))}
      </div>
      {legend && <ChartLegend items={legend} />}
    </div>
  )
}

/* ── Grafico a linee (SVG) ────────────────────────────────────────────────── */
export function LineChartSimple({
  categories,
  lines,
}: {
  categories: string[]
  lines: { id: string; label: string; color: string; width?: number; points: (number | null)[] }[]
}) {
  const all = lines.flatMap((l) => l.points.filter((p): p is number => p != null))
  const top = all.length ? Math.max(...all) : 100
  const bottom = all.length ? Math.min(...all, 0) : 0
  const range = top - bottom || 1
  const n = categories.length
  const xFor = (i: number) => (n <= 1 ? 50 : (i / (n - 1)) * 100)
  const yFor = (v: number) => 100 - ((v - bottom) / range) * 100

  return (
    <div style={chartLayoutStyle}>
      <div style={{ ...plotStyle, alignItems: 'stretch' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          {lines.map((l) => {
            const pts = l.points
              .map((p, i) => (p == null ? null : `${xFor(i)},${yFor(p)}`))
              .filter(Boolean)
              .join(' ')
            return (
              <polyline
                key={l.id}
                points={pts}
                fill="none"
                stroke={l.color}
                strokeWidth={l.width ?? 2}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )
          })}
        </svg>
      </div>
      <div style={axisRowStyle}>
        {categories.map((c, i) => (
          <span key={i} style={{ ...axisCellStyle }}>
            <span style={{ ...axisIdStyle, fontSize: 11, fontWeight: 400 }}>{c}</span>
          </span>
        ))}
      </div>
      <ChartLegend items={lines.map((l) => ({ label: l.label, color: l.color }))} />
    </div>
  )
}

/* ── Styles ───────────────────────────────────────────────────────────────── */
const chartLayoutStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  gap: 'var(--spacing-stack-xs)',
}
const plotStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  alignItems: 'stretch',
  gap: 'var(--spacing-inline-s)',
  position: 'relative',
  padding: '8px 0',
}
const zeroLineStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  borderTop: '1px solid var(--color-border-secondary)',
}
const groupStyle: CSSProperties = {
  flex: 1,
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'stretch',
  gap: 4,
}
const barWrapStyle: CSSProperties = {
  position: 'relative',
  flex: 1,
  maxWidth: 56,
}
const axisRowStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-s)',
}
const axisCellStyle: CSSProperties = {
  flex: 1,
  display: 'grid',
  gap: 2,
  justifyItems: 'center',
  textAlign: 'center',
}
const axisIdStyle: CSSProperties = {
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}
const axisValueStyle: CSSProperties = {
  fontFamily: 'var(--font-family-0, monospace)',
  fontSize: 12,
  color: 'var(--color-text-primary-light)',
}
const legendRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--spacing-inline-m)',
  justifyContent: 'center',
}
const legendItemStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 12,
  color: 'var(--color-text-primary-light)',
}
const legendSwatchStyle: CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: 2,
  flexShrink: 0,
}
