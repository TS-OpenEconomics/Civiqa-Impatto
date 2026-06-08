import type { CSSProperties, ReactNode } from 'react'
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

const CBA_PURPLE = '#5512d6'
const CBA_PURPLE_DARK = '#270065'
const CBA_PURPLE_SOFT = '#f6f1ff'
const CBA_LIME = '#b9ff69'
const CBA_GREEN = '#108a43'
const CBA_RED = '#c0392b'
const CBA_LINE = 'var(--color-border-secondary-light, #e2e2de)'

interface EconomicTotals {
  benefits: number
  costs: number
  vane: number
}

function fmtCurrency(value: unknown): string {
  return `${(safeNumber(value) / 1_000_000).toLocaleString('it-IT', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} M€`
}

function fmtSignedCurrency(value: unknown): string {
  const n = safeNumber(value)
  const sign = n >= 0 ? '+' : '-'
  return `${sign}${fmtCurrency(Math.abs(n))}`
}

function fmtPercent(value: unknown): string {
  return `${(safeNumber(value) * 100).toLocaleString('it-IT', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`
}

function fmtRatio(value: unknown): string {
  return safeNumber(value).toLocaleString('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function deriveTotals(score: ScoreComposito): EconomicTotals {
  const vane = safeNumber(score.van)
  const bcr = safeNumber(score.bcr)

  if (bcr > 0 && Math.abs(bcr - 1) > 0.0001 && Number.isFinite(vane / (bcr - 1))) {
    const costs = Math.max(0, vane / (bcr - 1))
    return { benefits: costs * bcr, costs, vane }
  }

  const anchor = Math.max(Math.abs(vane), 1)
  return {
    benefits: vane >= 0 ? anchor : Math.max(anchor + vane, 0),
    costs: vane >= 0 ? Math.max(anchor - vane, 0) : anchor,
    vane,
  }
}

export function TabCBA() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = state.scoreFinale ?? []
  const recommendedId = getRecommendedAlternativeId(scores)

  if (scores.length === 0) return <p style={emptyStyle}>Nessun dettaglio Analisi Costi Benefici disponibile.</p>

  const recommended = scores.find((score) => score.alternativaId === recommendedId) ?? scores[0]
  const recommendedLabel = getAlternativeDisplayLabel(
    recommended.alternativaId,
    state.alternative[recommended.alternativaId],
  )
  const totals = deriveTotals(recommended)
  const economicallySound = safeNumber(recommended.van) > 0 && safeNumber(recommended.bcr) > 1
  const horizon = safeNumber(recommended.orizzonte)
  const discountRate = safeNumber(recommended.tassoSconto)

  return (
    <div style={pageStyle}>
      <section style={headCardStyle}>
        <div style={headTopStyle}>
          <div style={headLeftStyle}>
            <div style={headIconStyle}>
              <ScaleIcon />
            </div>
            <div>
              <div style={headTitleRowStyle}>
                <h2 style={headTitleStyle}>Analisi Costi-Benefici</h2>
                <span style={badgeStyle}>ACB</span>
                <span style={verdictPillStyle(economicallySound)}>
                  {economicallySound ? 'Conveniente' : 'Da verificare'}
                </span>
              </div>
              <p style={headSubtitleStyle}>
                Alternativa raccomandata: <strong>{recommendedLabel}</strong>
              </p>
            </div>
          </div>
        </div>
        <div style={metaGridStyle}>
          <MetaCell label="Orizzonte temporale" value={horizon > 0 ? `${horizon} anni` : 'n.d.'} />
          <MetaCell label="Tasso di sconto sociale" value={discountRate > 0 ? fmtPercent(discountRate) : 'n.d.'} />
          <MetaCell label="Alternative confrontate" value={String(scores.length)} />
        </div>
      </section>

      <section style={simpleBannerStyle}>
        <div style={bannerIconStyle}>
          <SparkIcon />
        </div>
        <div>
          <h3 style={bannerTitleStyle}>La convenienza in parole semplici</h3>
          <p style={bannerTextStyle}>
            La ACB confronta benefici e costi economici attualizzati. Se il VANE e positivo e il rapporto B/C supera 1,
            l'alternativa crea valore netto per la collettivita.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <SectionHeading
          label="Sintesi"
          title="I numeri che guidano la scelta"
          subtitle="Gli indicatori standard misurano la convenienza economico-sociale dell'alternativa raccomandata."
        />
        <div style={kpiGridStyle}>
          <KpiCard
            label="VANE"
            value={fmtSignedCurrency(recommended.van)}
            rule="Conviene se > 0"
            good={safeNumber(recommended.van) > 0}
            text="Beneficio netto per la collettivita, espresso a valori attuali."
          />
          <KpiCard
            label="TIRE"
            value={fmtPercent(recommended.tir)}
            rule={discountRate > 0 ? `Conviene se > ${fmtPercent(discountRate)}` : 'Rendimento sociale'}
            good={discountRate <= 0 || safeNumber(recommended.tir) > discountRate}
            text="Tasso di rendimento economico-sociale dell'alternativa."
          />
          <KpiCard
            label="Rapporto B/C"
            value={fmtRatio(recommended.bcr)}
            rule="Conviene se > 1"
            good={safeNumber(recommended.bcr) > 1}
            text="Euro di benefici economici generati per ogni euro di costo."
          />
        </div>
        <VerdictBanner ok={economicallySound} score={recommended} />
      </section>

      <section style={sectionStyle}>
        <SectionHeading
          label="Costi e benefici"
          title="Da dove nasce il valore netto"
          subtitle="Il ponte mostra come i benefici economici, al netto dei costi, determinano il VANE."
        />
        <div style={chartCardStyle}>
          <div>
            <h4 style={chartTitleStyle}>Ponte costi-benefici</h4>
            <p style={chartSubtitleStyle}>
              Valori attuali in milioni di euro per l'alternativa raccomandata.
            </p>
          </div>
          <WaterfallChart totals={totals} />
          <ReadBox>
            La barra lime rappresenta i benefici economici totali. La barra grigia sottrae i costi attualizzati.
            Il saldo finale viola e il VANE: il valore che resta alla collettivita dopo aver coperto i costi sociali.
          </ReadBox>
        </div>
      </section>

      <section style={sectionStyle}>
        <SectionHeading
          label="Confronto"
          title="Come si posizionano le alternative"
          subtitle="Il confronto mette in evidenza valore netto, efficienza relativa e punteggio finale."
        />
        <AlternativeCards scores={scores} recommendedId={recommendedId} />
        <ComparisonTable scores={scores} recommendedId={recommendedId} alternatives={state.alternative} />
      </section>
    </div>
  )
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={metaCellStyle}>
      <div style={metaLabelStyle}>{label}</div>
      <div style={metaValueStyle}>{value}</div>
    </div>
  )
}

function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <div>
      <div style={sectionLabelStyle}>{label}</div>
      <h3 style={sectionTitleStyle}>{title}</h3>
      <p style={sectionSubtitleStyle}>{subtitle}</p>
    </div>
  )
}

function KpiCard({
  label,
  value,
  rule,
  text,
  good,
}: {
  label: string
  value: string
  rule: string
  text: string
  good: boolean
}) {
  return (
    <div style={kpiCardStyle(good)}>
      <div style={kpiTopStyle}>
        <span style={kpiLabelStyle}>{label}</span>
        <span style={kpiRuleStyle(good)}>{rule}</span>
      </div>
      <div style={kpiValueStyle(good)}>{value}</div>
      <p style={kpiTextStyle}>{text}</p>
    </div>
  )
}

function VerdictBanner({ ok, score }: { ok: boolean; score: ScoreComposito }) {
  return (
    <div style={verdictBannerStyle(ok)}>
      <div style={verdictIconStyle(ok)}>{ok ? '✓' : '!'}</div>
      <p style={verdictTextStyle}>
        <strong>
          {ok
            ? "L'alternativa raccomandata risulta conveniente per la collettivita."
            : "Gli indicatori non sono pienamente concordi sulla convenienza."}
        </strong>{' '}
        VANE {fmtSignedCurrency(score.van)}, rapporto B/C {fmtRatio(score.bcr)} e TIRE {fmtPercent(score.tir)}.
        <span style={verdictMutedStyle}>
          I valori sono stimati a prezzi economici e vanno letti come supporto alla decisione, non come rendimento finanziario garantito.
        </span>
      </p>
    </div>
  )
}

function WaterfallChart({ totals }: { totals: EconomicTotals }) {
  const benefitsM = totals.benefits / 1_000_000
  const costsM = totals.costs / 1_000_000
  const vaneM = totals.vane / 1_000_000
  const max = Math.max(benefitsM, costsM, Math.abs(vaneM), 1)
  const barHeight = (value: number) => `${Math.max(6, (Math.abs(value) / max) * 180)}px`
  const vanePositive = vaneM >= 0

  return (
    <div style={waterfallWrapStyle}>
      <WaterfallBar
        label="Benefici"
        value={fmtCurrency(totals.benefits)}
        height={barHeight(benefitsM)}
        color={CBA_LIME}
      />
      <WaterfallBar
        label="Costi"
        value={`-${fmtCurrency(totals.costs)}`}
        height={barHeight(costsM)}
        color="#e6e6e2"
      />
      <WaterfallBar
        label="VANE"
        value={fmtSignedCurrency(totals.vane)}
        height={barHeight(vaneM)}
        color={vanePositive ? CBA_PURPLE : CBA_RED}
      />
    </div>
  )
}

function WaterfallBar({
  label,
  value,
  height,
  color,
}: {
  label: string
  value: string
  height: string
  color: string
}) {
  return (
    <div style={waterfallBarSlotStyle}>
      <div style={waterfallValueStyle}>{value}</div>
      <div style={{ ...waterfallBarStyle, height, background: color }} />
      <div style={waterfallLabelStyle}>{label}</div>
    </div>
  )
}

function ReadBox({ children }: { children: ReactNode }) {
  return (
    <div style={readBoxStyle}>
      <div style={readLabelStyle}>Come si legge</div>
      <p style={readTextStyle}>{children}</p>
    </div>
  )
}

function AlternativeCards({
  scores,
  recommendedId,
}: {
  scores: ScoreComposito[]
  recommendedId: string | null
}) {
  const maxVane = Math.max(...scores.map((score) => Math.abs(safeNumber(score.van))), 1)

  return (
    <div style={altGridStyle}>
      {scores.map((score) => {
        const isRecommended = score.alternativaId === recommendedId
        const vane = safeNumber(score.van)
        const width = `${Math.max(4, (Math.abs(vane) / maxVane) * 100)}%`
        return (
          <div key={score.alternativaId} style={altCardStyle(isRecommended)}>
            <div style={altCardHeadStyle}>
              <span style={altIdStyle}>{score.alternativaId}</span>
              {isRecommended ? <span style={altBadgeStyle}>Raccomandata</span> : null}
            </div>
            <div style={altValueStyle}>{fmtSignedCurrency(vane)}</div>
            <div style={barTrackStyle}>
              <div style={{ ...barFillStyle(vane >= 0, isRecommended), width }} />
            </div>
            <div style={altMetaStyle}>
              <span>B/C {fmtRatio(score.bcr)}</span>
              <span>TIRE {fmtPercent(score.tir)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ComparisonTable({
  scores,
  recommendedId,
  alternatives,
}: {
  scores: ScoreComposito[]
  recommendedId: string | null
  alternatives: ReturnType<typeof wizardStore.getState>['alternative']
}) {
  return (
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
                    <span style={headerLabelStyle}>{getAlternativeDisplayLabel(score.alternativaId, alternatives[score.alternativaId])}</span>
                    {isRecommended ? <span style={recommendedBadgeStyle}>Raccomandata</span> : null}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" style={rowHeaderStyle}>VANE (M€)</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`van-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>{fmtCurrency(score.van)}</td>
            })}
          </tr>
          <tr>
            <th scope="row" style={rowHeaderStyle}>TIRE (%)</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`tir-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>{fmtPercent(score.tir)}</td>
            })}
          </tr>
          <tr>
            <th scope="row" style={rowHeaderStyle}>BCR (rapporto benefici/costi)</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`bcr-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>{fmtRatio(score.bcr)}</td>
            })}
          </tr>
          <tr>
            <th scope="row" style={finalRowHeaderStyle}>Punteggio Finale</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`final-${score.alternativaId}`} style={{ ...finalCellStyle, ...(isRecommended ? recommendedHeaderStyle : null) }}>{formatScore(score.scoreFinale)}</td>
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function ScaleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={CBA_PURPLE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v18M5 21h14M6 7h12" />
      <path d="M6 7 3 13h6L6 7zM18 7l-3 6h6l-3-6z" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  )
}

const pageStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m, 24px)',
}
const headCardStyle: CSSProperties = {
  background: '#fff',
  border: `1px solid ${CBA_LINE}`,
}
const headTopStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 20,
  padding: '22px 26px',
}
const headLeftStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
}
const headIconStyle: CSSProperties = {
  width: 52,
  height: 52,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 52px',
  background: CBA_PURPLE_SOFT,
}
const headTitleRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 10,
}
const headTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary, #1a1a2e)',
  fontSize: 21,
  fontWeight: 800,
  letterSpacing: 0,
}
const badgeStyle: CSSProperties = {
  padding: '3px 8px',
  background: '#f6c8f0',
  color: '#9c2a8e',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
}
const verdictPillStyle = (ok: boolean): CSSProperties => ({
  padding: '3px 8px',
  background: ok ? '#e4f7ea' : '#fbe9e7',
  color: ok ? CBA_GREEN : CBA_RED,
  fontSize: 11,
  fontWeight: 800,
})
const headSubtitleStyle: CSSProperties = {
  margin: '2px 0 0',
  color: 'var(--color-text-primary-light, #6b7280)',
  fontSize: 14,
}
const metaGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  borderTop: `1px solid ${CBA_LINE}`,
}
const metaCellStyle: CSSProperties = {
  padding: '18px 26px',
  borderRight: `1px solid ${CBA_LINE}`,
}
const metaLabelStyle: CSSProperties = {
  marginBottom: 6,
  color: 'var(--color-text-primary-light, #6b7280)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
}
const metaValueStyle: CSSProperties = {
  color: 'var(--color-text-primary, #1a1a2e)',
  fontSize: 16,
  fontWeight: 700,
}
const simpleBannerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '16px 24px',
  background: `linear-gradient(95deg, ${CBA_PURPLE_SOFT}, #fbf8ff 70%, #fff)`,
  border: `1px solid ${CBA_LINE}`,
}
const bannerIconStyle: CSSProperties = {
  width: 42,
  height: 42,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 42px',
  background: CBA_PURPLE,
}
const bannerTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary, #1a1a2e)',
  fontSize: 16,
  fontWeight: 800,
}
const bannerTextStyle: CSSProperties = {
  margin: '2px 0 0',
  color: 'var(--color-text-primary-light, #6b7280)',
  fontSize: 13,
}
const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: 16,
}
const sectionLabelStyle: CSSProperties = {
  marginBottom: 6,
  color: 'var(--color-text-primary-light, #6b7280)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
}
const sectionTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary, #1a1a2e)',
  fontSize: 27,
  fontWeight: 800,
  letterSpacing: 0,
}
const sectionSubtitleStyle: CSSProperties = {
  maxWidth: 760,
  margin: '6px 0 0',
  color: 'var(--color-text-primary-light, #6b7280)',
  fontSize: 14,
}
const kpiGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
  gap: 14,
}
const kpiCardStyle = (good: boolean): CSSProperties => ({
  position: 'relative',
  overflow: 'hidden',
  padding: '20px 22px',
  background: '#fff',
  border: `1px solid ${CBA_LINE}`,
  borderLeft: `4px solid ${good ? CBA_GREEN : CBA_RED}`,
})
const kpiTopStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  marginBottom: 10,
}
const kpiLabelStyle: CSSProperties = {
  color: 'var(--color-text-primary-light, #6b7280)',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
}
const kpiRuleStyle = (good: boolean): CSSProperties => ({
  padding: '3px 8px',
  background: good ? '#e4f7ea' : '#fbe9e7',
  color: good ? CBA_GREEN : CBA_RED,
  fontSize: 10,
  fontWeight: 800,
})
const kpiValueStyle = (good: boolean): CSSProperties => ({
  color: good ? CBA_GREEN : CBA_RED,
  fontSize: 34,
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: 0,
})
const kpiTextStyle: CSSProperties = {
  margin: '10px 0 0',
  color: 'var(--color-text-primary-light, #6b7280)',
  fontSize: 13,
}
const verdictBannerStyle = (ok: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 14,
  padding: '18px 22px',
  background: ok ? '#e4f7ea' : CBA_PURPLE_SOFT,
  border: `1px solid ${ok ? '#cde7d6' : CBA_LINE}`,
})
const verdictIconStyle = (ok: boolean): CSSProperties => ({
  width: 30,
  height: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 30px',
  background: ok ? CBA_GREEN : CBA_PURPLE,
  color: '#fff',
  fontWeight: 900,
})
const verdictTextStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary, #1a1a2e)',
  fontSize: 14,
  lineHeight: 1.55,
}
const verdictMutedStyle: CSSProperties = {
  display: 'block',
  marginTop: 6,
  color: 'var(--color-text-primary-light, #6b7280)',
  fontSize: 12,
}
const chartCardStyle: CSSProperties = {
  display: 'grid',
  gap: 18,
  padding: '24px 26px',
  background: '#fff',
  border: `1px solid ${CBA_LINE}`,
}
const chartTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary, #1a1a2e)',
  fontSize: 18,
  fontWeight: 800,
}
const chartSubtitleStyle: CSSProperties = {
  margin: '3px 0 0',
  color: 'var(--color-text-primary-light, #6b7280)',
  fontSize: 13,
}
const waterfallWrapStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(90px, 1fr))',
  gap: 24,
  alignItems: 'end',
  minHeight: 260,
  padding: '20px 8px 0',
  borderBottom: `1px solid ${CBA_LINE}`,
}
const waterfallBarSlotStyle: CSSProperties = {
  display: 'grid',
  justifyItems: 'center',
  alignItems: 'end',
  gap: 10,
}
const waterfallValueStyle: CSSProperties = {
  color: 'var(--color-text-primary, #1a1a2e)',
  fontSize: 14,
  fontWeight: 800,
}
const waterfallBarStyle: CSSProperties = {
  width: '72%',
  minWidth: 44,
}
const waterfallLabelStyle: CSSProperties = {
  paddingBottom: 10,
  color: 'var(--color-text-primary, #1a1a2e)',
  fontSize: 13,
  fontWeight: 800,
}
const readBoxStyle: CSSProperties = {
  padding: '16px 20px',
  background: 'var(--color-background-secondary-lightest, #f1f1f1)',
  border: `1px solid ${CBA_LINE}`,
}
const readLabelStyle: CSSProperties = {
  marginBottom: 8,
  color: CBA_PURPLE,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
}
const readTextStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary, #33343f)',
  fontSize: 13,
  lineHeight: 1.55,
}
const altGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
  gap: 12,
}
const altCardStyle = (recommended: boolean): CSSProperties => ({
  display: 'grid',
  gap: 10,
  padding: 16,
  background: recommended ? CBA_PURPLE_SOFT : '#fff',
  border: `1px solid ${recommended ? CBA_PURPLE : CBA_LINE}`,
})
const altCardHeadStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
}
const altIdStyle: CSSProperties = {
  color: CBA_PURPLE_DARK,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: '0.08em',
}
const altBadgeStyle: CSSProperties = {
  padding: '3px 8px',
  background: CBA_GREEN,
  color: '#fff',
  fontSize: 11,
  fontWeight: 800,
}
const altValueStyle: CSSProperties = {
  color: 'var(--color-text-primary, #1a1a2e)',
  fontSize: 22,
  fontWeight: 800,
}
const barTrackStyle: CSSProperties = {
  height: 10,
  background: '#e6e6e2',
}
const barFillStyle = (positive: boolean, recommended: boolean): CSSProperties => ({
  height: '100%',
  background: positive ? (recommended ? CBA_GREEN : CBA_PURPLE) : CBA_RED,
})
const altMetaStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  color: 'var(--color-text-primary-light, #6b7280)',
  fontSize: 12,
  fontWeight: 700,
}
const wrapStyle: CSSProperties = { overflowX: 'auto' }
const tableStyle: CSSProperties = { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', background: '#fff' }
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
