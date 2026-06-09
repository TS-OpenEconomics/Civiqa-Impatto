// ImpactMultiplierChart — grouped vertical bar chart showing Keynesian multipliers
// per macro dimension (PIL, Produzione, Redditi, Occupati), one bar per alternative.
// Multiplier = total macro impact / initial CAPEX injection.
// Values differ per alternative: new construction (A2) > enlargement (A1) > voucher (A3).
import type { CSSProperties } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, LabelList,
} from 'recharts'
import type { ScoreComposito, AlternativaId, AlternativaData } from '../../../types/docfap'
import { getAlternativeDisplayLabel, getRecommendedAlternativeId } from '../tableHelpers'
import { altColor } from '../chartHelpers'

// Mock Keynesian multipliers per alternative — derived from POC input-output tables.
// A2 (new construction) has highest multiplier due to supply-chain activation.
// A3 (voucher) has lowest: no physical investment, mostly income transfer.
const MULTIPLIERS: Record<string, { pil: number; produzione: number; redditi: number; occupati: number }> = {
  A0: { pil: 1.0,  produzione: 1.0,  redditi: 1.0,  occupati: 1.0 },
  A1: { pil: 1.72, produzione: 3.12, redditi: 1.44, occupati: 1.68 },
  A2: { pil: 2.08, produzione: 3.44, redditi: 1.76, occupati: 2.02 },
  A3: { pil: 1.28, produzione: 2.52, redditi: 1.12, occupati: 1.34 },
  A4: { pil: 1.55, produzione: 2.90, redditi: 1.30, occupati: 1.55 },
  A5: { pil: 1.45, produzione: 2.70, redditi: 1.22, occupati: 1.48 },
}

const DIM_LABELS: { key: string; label: string }[] = [
  { key: 'pil',       label: 'PIL' },
  { key: 'produzione', label: 'Produzione' },
  { key: 'redditi',   label: 'Redditi' },
  { key: 'occupati',  label: 'Occupati' },
]

interface Props {
  scores: ScoreComposito[]
  alternative: Partial<Record<AlternativaId, AlternativaData>>
}

interface ChartRow {
  dim: string
  [altId: string]: string | number
}

const CustomTooltip = ({
  active, payload,
}: { active?: boolean; payload?: Array<{ dataKey: string; value: number; fill: string; name: string }> }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={tooltipStyle}>
      <p style={tooltipTitleStyle}>{payload[0]?.name}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ margin: '2px 0', fontSize: 13, color: p.fill }}>
          {p.dataKey}: <strong>{p.value.toFixed(2)}×</strong>
        </p>
      ))}
    </div>
  )
}

export function ImpactMultiplierChart({ scores, alternative }: Props) {
  if (scores.length === 0) return null

  const recommendedId = getRecommendedAlternativeId(scores)

  const chartData: ChartRow[] = DIM_LABELS.map(({ key, label }) => {
    const row: ChartRow = { dim: label }
    for (const s of scores) {
      const m = MULTIPLIERS[s.alternativaId]
      row[s.alternativaId] = m ? m[key as keyof typeof m] : 1.0
    }
    return row
  })

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Moltiplicatori di impatto per dimensione</h3>
      <p style={subtitleStyle}>
        Rapporto tra l'effetto macroeconomico totale e la spesa pubblica iniziale (CAPEX).
        Un moltiplicatore PIL = 2.1× significa che ogni euro investito genera 2,10 € di valore aggiunto nell'economia locale.
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 24, right: 16, bottom: 8, left: 8 }} barGap={2} barCategoryGap="24%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e8" />
          <XAxis
            dataKey="dim"
            tick={{ fontSize: 13, fill: 'var(--color-text-primary, #222)', fontWeight: 600 }}
            axisLine={{ stroke: '#d0d0d0' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 4]}
            tickFormatter={v => `${v}×`}
            tick={{ fontSize: 11, fill: 'var(--color-text-primary-light, #555)' }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine
            y={1}
            stroke="#bbb"
            strokeDasharray="4 2"
            label={{ value: 'Effetto diretto puro (1×)', position: 'insideBottomRight', fontSize: 10, fill: '#aaa' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Legend
            iconType="square"
            iconSize={10}
            wrapperStyle={{ fontSize: 13 }}
            formatter={(value: string) =>
              getAlternativeDisplayLabel(value as AlternativaId, alternative[value as AlternativaId])
            }
          />
          {scores.map(s => (
            <Bar
              key={s.alternativaId}
              dataKey={s.alternativaId}
              name={s.alternativaId}
              fill={altColor(s.alternativaId, s.alternativaId === recommendedId)}
              maxBarSize={52}
              radius={[3, 3, 0, 0]}
            >
              <LabelList
                dataKey={s.alternativaId}
                position="top"
                formatter={(v: number) => `${v.toFixed(1)}×`}
                style={{ fontSize: 11, fill: altColor(s.alternativaId, s.alternativaId === recommendedId), fontWeight: 700 }}
              />
            </Bar>
          ))}
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
const titleStyle: CSSProperties = { margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }
const subtitleStyle: CSSProperties = { margin: '0 0 8px', fontSize: 13, color: 'var(--color-text-primary-light)', lineHeight: 1.5 }
const tooltipStyle: CSSProperties = {
  background: 'var(--color-background-inverse)', border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)', padding: '8px 12px', fontSize: 13,
}
const tooltipTitleStyle: CSSProperties = { margin: '0 0 6px', fontWeight: 700, color: 'var(--color-text-primary)' }
