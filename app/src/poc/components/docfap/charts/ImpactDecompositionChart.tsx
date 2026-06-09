// ImpactDecompositionChart — horizontal stacked bar per alternative
// Shows absolute macro-impact split into Diretto / Indiretto / Indotto
// using fixed IO-model proportions (46.4 / 29.1 / 24.5 %).
// Dimension switcher at top: PIL | Produzione | Redditi | Occupati.
import type { CSSProperties } from 'react'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, LabelList,
} from 'recharts'
import type { ScoreComposito, AlternativaId, AlternativaData } from '../../../types/docfap'
import { getAlternativeDisplayLabel } from '../tableHelpers'

// IO-model shares (Italy — infrastructure investment, source: Banca d'Italia)
const SHARE_DIRETTO   = 0.464
const SHARE_INDIRETTO = 0.291
const SHARE_INDOTTO   = 0.245   // = 1 - DIRETTO - INDIRETTO

const COLOR_DIRETTO   = '#5B21F7'
const COLOR_INDIRETTO = '#c026d3'
const COLOR_INDOTTO   = '#0891b2'

type DimKey = 'pil' | 'produzione' | 'redditi' | 'occupati'

const DIMS: { key: DimKey; label: string; unit: string }[] = [
  { key: 'pil',       label: 'PIL',        unit: 'k€' },
  { key: 'produzione', label: 'Produzione', unit: 'k€' },
  { key: 'redditi',   label: 'Redditi',    unit: 'k€' },
  { key: 'occupati',  label: 'Occupati',   unit: 'ETP' },
]

interface Props {
  scores: ScoreComposito[]
  alternative: Partial<Record<AlternativaId, AlternativaData>>
}

function getTotal(s: ScoreComposito, dim: DimKey): number {
  switch (dim) {
    case 'pil':       return s.pil
    case 'produzione': return s.produzione
    case 'redditi':   return s.redditi
    case 'occupati':  return s.occupati
  }
}

function fmt(v: number, unit: string): string {
  if (unit === 'ETP') return v.toLocaleString('it-IT', { maximumFractionDigits: 0 })
  return `${Math.round(v).toLocaleString('it-IT')} ${unit}`
}

function truncateLabel(s: string, max = 34): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s
}

const CustomTooltip = ({
  active, payload, unit,
}: { active?: boolean; payload?: Array<{ name: string; value: number; fill: string }>; unit: string }) => {
  if (!active || !payload?.length) return null
  const total = payload.reduce((acc, p) => acc + p.value, 0)
  const nameMap: Record<string, string> = {
    diretto: 'Impatto Diretto',
    indiretto: 'Impatto Indiretto',
    indotto: 'Impatto Indotto',
  }
  return (
    <div style={tooltipStyle}>
      <p style={tooltipTitleStyle}>Totale: {fmt(total, unit)}</p>
      {payload.map(p => (
        <p key={p.name} style={{ margin: '2px 0', fontSize: 13, color: p.fill }}>
          {nameMap[p.name] ?? p.name}: {fmt(p.value, unit)} ({((p.value / total) * 100).toFixed(1)}%)
        </p>
      ))}
    </div>
  )
}

export function ImpactDecompositionChart({ scores, alternative }: Props) {
  const [dim, setDim] = useState<DimKey>('pil')
  if (scores.length === 0) return null

  const dimMeta = DIMS.find(d => d.key === dim)!
  const { unit } = dimMeta

  const chartData = scores.map(s => {
    const total = getTotal(s, dim)
    const diretto   = total * SHARE_DIRETTO
    const indiretto = total * SHARE_INDIRETTO
    const indotto   = total - diretto - indiretto
    return {
      altId: s.alternativaId,
      label: truncateLabel(getAlternativeDisplayLabel(s.alternativaId, alternative[s.alternativaId])),
      diretto:   Math.round(diretto   * 10) / 10,
      indiretto: Math.round(indiretto * 10) / 10,
      indotto:   Math.round(indotto   * 10) / 10,
    }
  })

  const barH = Math.max(scores.length * 64, 160)

  return (
    <div style={cardStyle}>
      <div style={headerRowStyle}>
        <div>
          <h3 style={titleStyle}>Impatto macroeconomico — Effetti Diretto, Indiretto e Indotto</h3>
          <p style={subtitleStyle}>
            Scomposizione dell'impatto secondo il modello input–output italiano (Banca d'Italia).
            Effetto Diretto = attività di investimento; Indiretto = filiera; Indotto = consumi da reddito.
          </p>
        </div>
        <div style={switcherStyle} role="group" aria-label="Seleziona dimensione">
          {DIMS.map(d => (
            <button
              key={d.key}
              type="button"
              style={btnStyle(d.key === dim)}
              onClick={() => setDim(d.key)}
              aria-pressed={d.key === dim}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={barH + 56}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 80, bottom: 8, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8e8e8" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: 'var(--color-text-primary-light, #555)' }}
            tickFormatter={v => unit === 'ETP' ? String(Math.round(v)) : `${Math.round(v).toLocaleString('it-IT')}`}
            axisLine={{ stroke: '#d0d0d0' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={220}
            tick={{ fontSize: 12, fill: 'var(--color-text-primary, #222)', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Legend
            iconType="square"
            iconSize={10}
            wrapperStyle={{ fontSize: 13, paddingTop: 12 }}
            formatter={(value: string) => {
              const map: Record<string, string> = {
                diretto: 'Impatto Diretto',
                indiretto: 'Impatto Indiretto',
                indotto: 'Impatto Indotto',
              }
              return map[value] ?? value
            }}
          />
          <Bar dataKey="diretto" stackId="a" fill={COLOR_DIRETTO} name="diretto" maxBarSize={32} />
          <Bar dataKey="indiretto" stackId="a" fill={COLOR_INDIRETTO} name="indiretto" maxBarSize={32} />
          <Bar dataKey="indotto" stackId="a" fill={COLOR_INDOTTO} name="indotto" maxBarSize={32} radius={[0, 3, 3, 0]}>
            <LabelList
              dataKey="indotto"
              position="right"
              formatter={(_: number, entry: { diretto?: number; indiretto?: number; indotto?: number }) => {
                const total = (entry?.diretto ?? 0) + (entry?.indiretto ?? 0) + (entry?.indotto ?? 0)
                return fmt(total, unit)
              }}
              style={{ fontSize: 11, fill: 'var(--color-text-primary-light, #666)', fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const cardStyle: CSSProperties = {
  background: 'var(--color-background-inverse)', border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)', padding: 'var(--spacing-inset-m)',
}
const headerRowStyle: CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  flexWrap: 'wrap', gap: '12px', marginBottom: '16px',
}
const titleStyle: CSSProperties = { margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }
const subtitleStyle: CSSProperties = { margin: 0, fontSize: 13, color: 'var(--color-text-primary-light)', lineHeight: 1.5, maxWidth: 560 }
const switcherStyle: CSSProperties = { display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }
function btnStyle(isActive: boolean): CSSProperties {
  return {
    padding: '4px 12px',
    border: isActive ? '2px solid #5B21F7' : '1px solid #d0d0d0',
    borderRadius: 'var(--radius-smooth)',
    background: isActive ? '#5B21F7' : 'var(--color-background-inverse)',
    color: isActive ? '#fff' : 'var(--color-text-primary)',
    fontSize: 13, fontWeight: isActive ? 700 : 400, cursor: 'pointer',
    fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
    transition: 'background 0.15s, color 0.15s',
  }
}
const tooltipStyle: CSSProperties = {
  background: 'var(--color-background-inverse)', border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)', padding: '8px 12px', fontSize: 13,
}
const tooltipTitleStyle: CSSProperties = { margin: '0 0 6px', fontWeight: 700, color: 'var(--color-text-primary)' }
