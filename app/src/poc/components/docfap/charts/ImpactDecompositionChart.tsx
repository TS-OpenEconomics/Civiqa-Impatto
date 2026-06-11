// ImpactDecompositionChart — confronto d'impatto tra gli interventi
// Mostra le principali dimensioni macroeconomiche (PIL, Produzione, Occupati, Redditi)
// con colonne affiancate per intervento e, in verde, il vantaggio (+X M€)
// dell'intervento con impatto maggiore su ciascuna dimensione.
import type { CSSProperties } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, LabelList,
} from 'recharts'
import type { ScoreComposito, AlternativaId, AlternativaData } from '../../../types/docfap'
import { getAlternativeDisplayLabel, getRecommendedAlternativeId } from '../tableHelpers'
import { altColor } from '../chartHelpers'

const GREEN = '#1f8c4a'

type DimKey = 'pil' | 'produzione' | 'occupati' | 'redditi'
const DIMS: { key: DimKey; label: string }[] = [
  { key: 'pil',        label: 'PIL' },
  { key: 'produzione', label: 'Produzione' },
  { key: 'occupati',   label: 'Occupati' },
  { key: 'redditi',    label: 'Redditi' },
]

interface Props {
  scores: ScoreComposito[]
  alternative: Partial<Record<AlternativaId, AlternativaData>>
}

function fmtM(v: number): string {
  return `${v.toLocaleString('it-IT', { maximumFractionDigits: 1 })} M€`
}

function fmtValue(dim: string | undefined, v: number): string {
  if (dim === 'Occupati') return v.toLocaleString('it-IT', { maximumFractionDigits: 0 })
  return fmtM(v)
}

function fallbackImpactValue(
  score: ScoreComposito,
  dim: DimKey,
  alternative: Partial<Record<AlternativaId, AlternativaData>>,
): number {
  const direct = Number(score[dim])
  if (direct > 0) return direct

  const alt = alternative[score.alternativaId]
  const activationBase = (alt?.capex ?? 0) > 0 ? (alt?.capex ?? 0) : (alt?.opex ?? 0)
  if (activationBase <= 0) return direct

  const m = activationBase / 1_000_000
  if (dim === 'pil') return Math.round(m * 1.42 * 10) / 10
  if (dim === 'produzione') return Math.round(m * 3.44 * 10) / 10
  if (dim === 'occupati') return Math.round((activationBase / 100_000) * 0.78)
  return Math.round(m * 1.38 * 10) / 10
}

type Row = { dim: string; leaderId: string | null; delta: number } & Record<string, string | number | null>

export function ImpactDecompositionChart({ scores, alternative }: Props) {
  if (scores.length === 0) return null

  const recommendedId = getRecommendedAlternativeId(scores)

  const chartData: Row[] = DIMS.map(({ key, label }) => {
    const row: Row = { dim: label, leaderId: null, delta: 0 }
    const vals = scores.map(s => ({ id: s.alternativaId, v: fallbackImpactValue(s, key, alternative) }))
    for (const { id, v } of vals) row[id] = Math.round(v * 10) / 10
    const sorted = [...vals].sort((a, b) => b.v - a.v)
    row.leaderId = sorted[0]?.id ?? null
    row.delta = sorted.length >= 2 ? Math.round((sorted[0].v - sorted[1].v) * 10) / 10 : 0
    return row
  })

  const CustomTooltip = ({
    active, payload, label,
  }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; fill: string }>; label?: string }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={tooltipStyle}>
        <p style={tooltipTitleStyle}>{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ margin: '2px 0', fontSize: 13, color: p.fill }}>
            {getAlternativeDisplayLabel(p.dataKey as AlternativaId, alternative[p.dataKey as AlternativaId])}:{' '}
            <strong>{fmtValue(label, p.value)}</strong>
          </p>
        ))}
      </div>
    )
  }

  // Etichetta verde "+X M€" sopra la colonna dell'intervento vincente per dimensione
  function makeDelta(altId: string) {
    return (props: { x?: number; y?: number; width?: number; index?: number }) => {
      const { x = 0, y = 0, width = 0, index = 0 } = props
      const row = chartData[index]
      if (!row || row.leaderId !== altId || row.delta <= 0) return null
      return (
        <text
          x={x + width / 2}
          y={y - 22}
          textAnchor="middle"
          style={{ fontSize: 13, fontWeight: 800, fill: GREEN }}
        >
          +{fmtValue(row.dim, row.delta)}
        </text>
      )
    }
  }

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Confronto d'impatto economico tra gli interventi</h3>
      <p style={subtitleStyle}>
        Principali dimensioni macroeconomiche attivate. In{' '}
        <span style={{ color: GREEN, fontWeight: 700 }}>verde</span> il vantaggio dell'intervento con impatto
        maggiore su ciascuna dimensione.
      </p>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={chartData} margin={{ top: 40, right: 16, bottom: 8, left: 8 }} barGap={4} barCategoryGap={28}>
          <CartesianGrid vertical={false} stroke="#e8e8e8" strokeDasharray="3 3" />
          <XAxis
            dataKey="dim"
            tick={{ fontSize: 13, fill: 'var(--color-text-primary, #222)', fontWeight: 600 }}
            axisLine={{ stroke: '#d0d0d0' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={v => v.toLocaleString('it-IT')}
            tick={{ fontSize: 11, fill: 'var(--color-text-primary-light, #555)' }}
            axisLine={false}
            tickLine={false}
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
              maxBarSize={44}
              radius={[3, 3, 0, 0]}
            >
              <LabelList
                dataKey={s.alternativaId}
                position="top"
                formatter={(v: number, entry: unknown) => {
                  const payload = (entry as { payload?: Row })?.payload
                  return fmtValue(payload?.dim, v)
                }}
                style={{ fontSize: 10, fill: 'var(--color-text-primary-light, #777)', fontWeight: 600 }}
              />
              <LabelList content={makeDelta(s.alternativaId)} />
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
const subtitleStyle: CSSProperties = { margin: '0 0 8px', fontSize: 13, color: 'var(--color-text-primary-light)', lineHeight: 1.5, maxWidth: 620 }
const tooltipStyle: CSSProperties = {
  background: 'var(--color-background-inverse)', border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)', padding: '8px 12px', fontSize: 13,
}
const tooltipTitleStyle: CSSProperties = { margin: '0 0 6px', fontWeight: 700, color: 'var(--color-text-primary)' }
