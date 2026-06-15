// MCARadarChart — Spider/radar chart for multicriteria analysis
// One polygon per alternative, one axis per qualitative criterion.
// Value on each axis = how well the criterion is satisfied (0/20/60/100),
// independent of weight — so all axes share a 0–100 domain.
// The weighted contribution is shown in the table; here we show the "profile".
import type { CSSProperties } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip,
} from 'recharts'
import type { ScoreComposito, AlternativaId } from '../../../types/docfap'
import { getAlternativeDisplayLabel, getRecommendedAlternativeId } from '../tableHelpers'
import { makeAltColorByRank } from '../chartHelpers'
import type { AlternativaData } from '../../../types/docfap'

const LEVEL_TO_VALUE: Record<string, number> = {
  alto:  100,
  medio: 60,
  basso: 20,
  nullo: 0,
}

function truncate(str: string, max = 28): string {
  return str.length > max ? `${str.slice(0, max - 1)}…` : str
}

function parsePercent(value: string | number): number {
  if (typeof value === 'number') return value
  const n = Number.parseFloat(value.replace('%', '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

interface Criterio {
  id: string
  criterio: string
  pesoDefault: string | number
}

interface Props {
  scores: ScoreComposito[]
  alternative: Partial<Record<AlternativaId, AlternativaData>>
  /** cluster?.criteriiQualitativi */
  criteri: Criterio[]
  /** state.mcaScores */
  mcaScores: Record<string, Record<string, string>>
}

type RadarRow = Record<string, string | number>

export function MCARadarChart({ scores, alternative, criteri, mcaScores }: Props) {
  if (scores.length === 0 || criteri.length === 0) return null

  const recommendedId = getRecommendedAlternativeId(scores)
  const colorFor = makeAltColorByRank(scores)

  const chartData: RadarRow[] = criteri.map(c => {
    const peso = parsePercent(c.pesoDefault)
    const row: RadarRow = {
      criterio: truncate(c.criterio),
      peso,
    }
    for (const s of scores) {
      const livello = (mcaScores[s.alternativaId]?.[c.id] ?? '').toLowerCase()
      row[s.alternativaId] = LEVEL_TO_VALUE[livello] ?? 0
    }
    return row
  })

  // Custom tooltip showing criterion label + values per alternative
  const CustomTooltip = ({
    active, payload,
  }: {
    active?: boolean
    payload?: Array<{ dataKey: string; value: number; payload: RadarRow }>
  }) => {
    if (!active || !payload?.length) return null
    const row = payload[0].payload
    return (
      <div style={tooltipStyle}>
        <p style={tooltipTitleStyle}>{row.criterio} <span style={tooltipPesoStyle}>(peso {row.peso}%)</span></p>
        {payload.map(p => {
          const altData = alternative[p.dataKey as AlternativaId]
          const label = getAlternativeDisplayLabel(p.dataKey as AlternativaId, altData)
          const livello = p.value === 100 ? 'Alto' : p.value === 60 ? 'Medio' : p.value === 20 ? 'Basso' : 'Nullo'
          return (
            <p key={p.dataKey} style={{ ...tooltipRowStyle, color: colorFor(p.dataKey) }}>
              {label}: <strong>{livello}</strong> ({p.value}/100)
            </p>
          )
        })}
      </div>
    )
  }

  // Custom angle axis tick — wraps long labels
  const CustomTick = ({ x, y, payload, cx, cy }: {
    x?: number; y?: number; payload?: { value: string }; cx?: number; cy?: number
  }) => {
    if (x === undefined || y === undefined || !payload) return null
    const dx = (x ?? 0) - (cx ?? 0)
    const dy = (y ?? 0) - (cy ?? 0)
    const textAnchor = dx > 5 ? 'start' : dx < -5 ? 'end' : 'middle'
    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill="var(--color-text-primary-light, #555)"
        fontSize={12}
        dominantBaseline="central"
      >
        {payload.value}
      </text>
    )
  }

  const chartHeight = Math.max(criteri.length * 28 + 180, 380)

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Profilo multicriteria — confronto tra alternative</h3>
      <p style={subtitleStyle}>
        Asse 0–100: quanto ciascun criterio è soddisfatto (Alto=100, Medio=60, Basso=20, Nullo=0).
        Il peso di ogni criterio incide sul punteggio finale nella tabella sopra.
      </p>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <RadarChart data={chartData} outerRadius="68%" margin={{ top: 16, right: 40, bottom: 16, left: 40 }}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="criterio" tick={<CustomTick />} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tickCount={6}
            tick={{ fontSize: 11, fill: '#aaa' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ fontSize: 13 }}
            formatter={(value: string) =>
              getAlternativeDisplayLabel(value as AlternativaId, alternative[value as AlternativaId])
            }
          />
          {scores.map(s => (
            <Radar
              key={s.alternativaId}
              name={s.alternativaId}
              dataKey={s.alternativaId}
              stroke={colorFor(s.alternativaId)}
              fill={colorFor(s.alternativaId)}
              fillOpacity={0.12}
              strokeWidth={2}
              dot={{ r: 3, fill: colorFor(s.alternativaId) }}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────
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
  margin: '0 0 8px',
  fontSize: 'var(--type-body-xs-size, 13px)',
  color: 'var(--color-text-primary-light)',
}

const tooltipStyle: CSSProperties = {
  background: 'var(--color-background-inverse)',
  border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)',
  padding: '8px 12px',
  fontSize: 13,
  maxWidth: 280,
}

const tooltipTitleStyle: CSSProperties = {
  margin: '0 0 6px',
  fontWeight: 700,
  fontSize: 13,
  color: 'var(--color-text-primary)',
}

const tooltipPesoStyle: CSSProperties = {
  fontWeight: 400,
  color: 'var(--color-text-primary-light)',
  fontSize: 12,
}

const tooltipRowStyle: CSSProperties = {
  margin: '2px 0',
  fontSize: 13,
}
