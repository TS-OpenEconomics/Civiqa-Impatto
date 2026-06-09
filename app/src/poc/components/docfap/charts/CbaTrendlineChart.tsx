// CbaTrendlineChart — Year-by-year benefit breakdown for one alternative at a time
// Includes an alternative switcher because all alternatives cannot coexist in the same chart
import type { CSSProperties } from 'react'
import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { ScoreComposito, AlternativaData, AlternativaId } from '../../../types/docfap'
import { getAlternativeDisplayLabel } from '../tableHelpers'

// Benefit split (POC proxy proportions — no granular monetised breakdown in wizard data)
const SPLIT_CITTADINI  = 0.50
const SPLIT_TARI       = 0.15
const SPLIT_AMBIENTE   = 0.35

const LINE_COLORS = {
  beneficiTotali:     '#5B21F7',
  beneficiCittadini:  '#7c4dff',
  introitoTARI:       '#00897b',
  risparmiAmbiente:   '#2e7d32',
  flussoNetto:        '#c62828',
  vanCumulativo:      '#e65100',
} as const

function annuityFactor(r: number, n: number): number {
  if (r === 0) return n
  return (1 - Math.pow(1 + r, -n)) / r
}

// € → M€ con 2 decimali (i flussi annui sono sotto il milione)
const toM2 = (eur: number) => Math.round(eur / 10_000) / 100

interface YearPoint {
  year: number
  beneficiTotali: number
  beneficiCittadini: number
  introitoTARI: number
  risparmiAmbiente: number
  flussoNetto: number
  vanCumulativo: number
}

function buildTrendData(
  s: ScoreComposito,
  altData: AlternativaData | undefined,
): YearPoint[] {
  const capex = altData?.capex ?? 0
  const opex  = altData?.opex  ?? 0
  const r     = s.tassoSconto
  const n     = s.orizzonte

  const AF = annuityFactor(r, n)
  const pvC = capex + opex * AF
  const pvB = s.bcr * pvC
  const annualBenefit = AF > 0 ? pvB / AF : 0

  const points: YearPoint[] = []
  let cumVan = -capex

  for (let y = 0; y <= n; y++) {
    if (y === 0) {
      points.push({
        year: 0,
        beneficiTotali:    0,
        beneficiCittadini: 0,
        introitoTARI:      0,
        risparmiAmbiente:  0,
        flussoNetto:       toM2(-capex),
        vanCumulativo:     toM2(cumVan),
      })
    } else {
      const annNet = annualBenefit - opex
      cumVan += annNet

      points.push({
        year:              y,
        beneficiTotali:    toM2(annualBenefit),
        beneficiCittadini: toM2(annualBenefit * SPLIT_CITTADINI),
        introitoTARI:      toM2(annualBenefit * SPLIT_TARI),
        risparmiAmbiente:  toM2(annualBenefit * SPLIT_AMBIENTE),
        flussoNetto:       toM2(annNet),
        vanCumulativo:     toM2(cumVan),
      })
    }
  }
  return points
}

interface Props {
  scores: ScoreComposito[]
  alternative: Partial<Record<AlternativaId, AlternativaData>>
}

export function CbaTrendlineChart({ scores, alternative }: Props) {
  const [selectedId, setSelectedId] = useState<AlternativaId>(scores[0]?.alternativaId)

  if (scores.length === 0) return null

  const score = scores.find(s => s.alternativaId === selectedId) ?? scores[0]
  const trendData = buildTrendData(score, alternative[score.alternativaId])

  const CustomTooltip = ({
    active, payload, label,
  }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: number }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={tooltipStyle}>
        <p style={tooltipTitleStyle}>Anno {label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ ...tooltipRowStyle, color: p.color }}>
            {p.name}: <strong>{p.value.toLocaleString('it-IT')} M€</strong>
          </p>
        ))}
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <div style={headerRowStyle}>
        <div>
          <h3 style={titleStyle}>Flussi monetizzati — vita utile del progetto</h3>
          <p style={subtitleStyle}>Valori in M€ · Anno 0 = investimento iniziale · Flusso netto = Benefici − OPEX</p>
        </div>
        {scores.length > 1 && (
          <div style={switcherStyle} role="group" aria-label="Seleziona alternativa">
            {scores.map(s => {
              const label = getAlternativeDisplayLabel(s.alternativaId, alternative[s.alternativaId])
              const isActive = s.alternativaId === selectedId
              return (
                <button
                  key={s.alternativaId}
                  type="button"
                  style={switcherBtnStyle(isActive)}
                  onClick={() => setSelectedId(s.alternativaId)}
                  aria-pressed={isActive}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={trendData} margin={{ top: 16, right: 24, bottom: 8, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis
            dataKey="year"
            tickFormatter={v => `Anno ${v}`}
            tick={{ fontSize: 12, fill: 'var(--color-text-primary-light, #555)' }}
            axisLine={{ stroke: '#d0d0d0' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={v => `${v.toLocaleString('it-IT')} M€`}
            tick={{ fontSize: 12, fill: 'var(--color-text-primary-light, #555)' }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine y={0} stroke="#aaa" strokeWidth={1} strokeDasharray="4 2" />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="plainline" iconSize={16} wrapperStyle={{ fontSize: 13 }} />

          <Line
            type="monotone"
            dataKey="beneficiTotali"
            name="Benefici totali"
            stroke={LINE_COLORS.beneficiTotali}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="beneficiCittadini"
            name="Risparmio per i cittadini"
            stroke={LINE_COLORS.beneficiCittadini}
            strokeWidth={1.5}
            strokeDasharray="6 3"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="introitoTARI"
            name="Maggiore introito da TARI"
            stroke={LINE_COLORS.introitoTARI}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="risparmiAmbiente"
            name="Risparmio ambientale"
            stroke={LINE_COLORS.risparmiAmbiente}
            strokeWidth={1.5}
            strokeDasharray="2 3"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="flussoNetto"
            name="Flusso di cassa netto"
            stroke={LINE_COLORS.flussoNetto}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="vanCumulativo"
            name="VAN cumulativo"
            stroke={LINE_COLORS.vanCumulativo}
            strokeWidth={2}
            strokeDasharray="8 3"
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
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

const headerRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '12px',
  marginBottom: '8px',
}

const titleStyle: CSSProperties = {
  margin: '0 0 4px',
  fontSize: 'var(--type-body-m-size, 16px)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}

const subtitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--type-body-xs-size, 13px)',
  color: 'var(--color-text-primary-light)',
}

const switcherStyle: CSSProperties = {
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
}

function switcherBtnStyle(isActive: boolean): CSSProperties {
  return {
    padding: '4px 12px',
    border: isActive ? '2px solid #5B21F7' : '1px solid #d0d0d0',
    borderRadius: 'var(--radius-smooth)',
    background: isActive ? '#5B21F7' : 'var(--color-background-inverse)',
    color: isActive ? '#fff' : 'var(--color-text-primary)',
    fontSize: 13,
    fontWeight: isActive ? 700 : 400,
    cursor: 'pointer',
    fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  }
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
