// CbaWaterfallChart — Grouped bar chart: CBA components across all alternatives
// Categories: Benefici totali (PV), Spesa totale (PV), VANE
import type { CSSProperties } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'
import type { ScoreComposito, AlternativaData, AlternativaId } from '../../../types/docfap'
import { getAlternativeDisplayLabel } from '../tableHelpers'

// DS colours — primary purple + tints/shades for 2nd, 3rd alternative
const ALT_COLORS: Record<string, string> = {
  A0: '#888888',
  A1: '#5B21F7',
  A2: '#7c4dff',
  A3: '#9945ff',
  A4: '#c77dff',
  A5: '#e6ccff',
}

function annuityFactor(r: number, n: number): number {
  if (r === 0) return n
  return (1 - Math.pow(1 + r, -n)) / r
}

interface Props {
  scores: ScoreComposito[]
  alternative: Partial<Record<AlternativaId, AlternativaData>>
}

type ChartRow = Record<string, string | number>

export function CbaWaterfallChart({ scores, alternative }: Props) {
  if (scores.length === 0) return null

  const altLabels: Record<string, string> = {}
  for (const s of scores) {
    altLabels[s.alternativaId] = getAlternativeDisplayLabel(s.alternativaId, alternative[s.alternativaId])
  }

  const categories = [
    { key: 'pvBenefici', label: 'Benefici totali (PV)' },
    { key: 'pvCosti',    label: 'Spesa totale (PV)' },
    { key: 'vane',       label: 'VANE' },
  ]

  const chartData: ChartRow[] = categories.map(({ key, label }) => {
    const row: ChartRow = { categoria: label }
    for (const s of scores) {
      const capex = alternative[s.alternativaId]?.capex ?? 0
      const opex  = alternative[s.alternativaId]?.opex  ?? 0
      const AF = annuityFactor(s.tassoSconto, s.orizzonte)
      const pvC = capex + opex * AF
      const pvB = s.bcr * pvC
      const id = s.alternativaId
      if (key === 'pvBenefici') row[id] = Math.round(pvB / 1000)
      else if (key === 'pvCosti') row[id] = -Math.round(pvC / 1000)
      else row[id] = Math.round(s.van / 1000)
    }
    return row
  })

  // Custom tooltip
  const CustomTooltip = ({
    active, payload, label,
  }: { active?: boolean; payload?: Array<{ name: string; value: number; fill: string }>; label?: string }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={tooltipStyle}>
        <p style={tooltipTitleStyle}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ ...tooltipRowStyle, color: p.fill }}>
            {p.name}: <strong>{p.value.toLocaleString('it-IT')} k€</strong>
          </p>
        ))}
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Componenti CBA — tutte le alternative</h3>
      <p style={subtitleStyle}>Valori in k€ (Valore Attuale Netto). Spesa totale mostrata come valore negativo.</p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} barCategoryGap="28%" barGap={4} margin={{ top: 16, right: 24, bottom: 8, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis
            dataKey="categoria"
            tick={{ fontSize: 13, fill: 'var(--color-text-primary-light, #555)' }}
            axisLine={{ stroke: '#d0d0d0' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={v => `${v.toLocaleString('it-IT')} k€`}
            tick={{ fontSize: 12, fill: 'var(--color-text-primary-light, #555)' }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine y={0} stroke="#888" strokeWidth={1} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Legend
            formatter={(value: string) => altLabels[value] ?? value}
            iconType="square"
            iconSize={12}
            wrapperStyle={{ fontSize: 13 }}
          />
          {scores.map(s => (
            <Bar
              key={s.alternativaId}
              dataKey={s.alternativaId}
              name={s.alternativaId}
              fill={ALT_COLORS[s.alternativaId] ?? '#5B21F7'}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────
const cardStyle: CSSProperties = {
  background: 'var(--color-background-inverse)',
  border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)',
  padding: 'var(--spacing-inset-m)',
}

const titleStyle: CSSProperties = {
  margin: '0 0 4px',
  fontSize: 'var(--type-body-m-size, 16px)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}

const subtitleStyle: CSSProperties = {
  margin: '0 0 16px',
  fontSize: 'var(--type-body-xs-size, 13px)',
  color: 'var(--color-text-primary-light)',
}

const tooltipStyle: CSSProperties = {
  background: 'var(--color-background-inverse)',
  border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)',
  padding: '8px 12px',
  fontSize: 13,
}

const tooltipTitleStyle: CSSProperties = {
  margin: '0 0 6px',
  fontWeight: 700,
  fontSize: 13,
  color: 'var(--color-text-primary)',
}

const tooltipRowStyle: CSSProperties = {
  margin: '2px 0',
  fontSize: 13,
}
