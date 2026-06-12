import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { INTERVENTION_CATEGORIES } from '../../../data/poc_docfap/intervention_categories_layer3'
import { getMatrixQuestions, loadPocData } from '../../../data/poc_docfap/evaluation_matrix'
import type { McaQuestion } from '../../../data/poc_docfap/evaluation_matrix'
import { DEFAULT_DIMENSION_WEIGHTS, calcScoreComposito, runFullAnalysis } from '../../../engine/scoreComposito'
import { MC_MOCK_DATA } from '../../../engine/riskMonteCarlo'
import { useWizard } from '../../../hooks/useWizard'
import type { AlternativaId, ScoreComposito } from '../../../types/docfap'
import { Badge } from '../../ui/Badge'
import { Button } from '../../ui/Button'

// ── Types ──────────────────────────────────────────────────────────────────

type CardKey = 'cba' | 'impatto' | 'mca' | 'sensitivita'

// ── Constants ──────────────────────────────────────────────────────────────

const MCA_CODE_TO_LABEL: Record<string, string> = {
  A: 'Alto',
  M: 'Medio',
  B: 'Basso',
  N: 'Nullo',
}

const TIPOLOGIA_LABELS: Record<string, string> = {
  nuova_realizzazione: 'Nuova realizzazione',
  ristrutturazione: 'Ristrutturazione',
  ristrutturazione_efficientamento: 'Ristrutturazione con EE',
  manutenzione_straordinaria_ee: 'Manutenzione straordinaria EE',
  manutenzione_ordinaria: 'Manutenzione ordinaria',
  restauro: 'Restauro',
  recupero: 'Recupero',
  ampliamento_potenziamento: 'Ampliamento / potenziamento',
  ammodernamento_tecnologico: 'Ammodernamento tecnologico',
  demolizione: 'Demolizione',
  lavori_socialmente_utili: 'Lavori socialmente utili',
  altro: 'Altro',
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getRankedColumns(scoreFinale: ScoreComposito[] | null): ScoreComposito[] {
  if (!scoreFinale || scoreFinale.length === 0) return []
  return [...scoreFinale].sort((a, b) => b.scoreFinale - a.scoreFinale)
}

function fmt1(value: number): string {
  return value.toFixed(1)
}

function fmt2(value: number): string {
  return value.toFixed(2)
}

function fmtEur(value: number): string {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

function fmtPct(value: number): string {
  return `${value.toFixed(1)}%`
}

// k€ → stringa in M€ (italiano)
function fmtMfromK(value: number): string {
  return (value / 1000).toLocaleString('it-IT', { maximumFractionDigits: 1 })
}

function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// ── Main component ─────────────────────────────────────────────────────────

export function Step7_ScoreFinale() {
  const { state, setScore } = useWizard()
  const [isLoading, setIsLoading] = useState(true)
  const [openCards, setOpenCards] = useState<Record<CardKey, boolean>>({
    cba: true,
    impatto: false,
    mca: false,
    sensitivita: false,
  })
  const [mcaQuestions, setMcaQuestions] = useState<McaQuestion[]>([])
  const [weights, setWeights] = useState({
    wCBA: DEFAULT_DIMENSION_WEIGHTS.wCBA,
    wIMP: DEFAULT_DIMENSION_WEIGHTS.wIMP,
    wMCA: DEFAULT_DIMENSION_WEIGHTS.wMCA,
    wSENS: DEFAULT_DIMENSION_WEIGHTS.wSENS,
  })

  useEffect(() => {
    let isActive = true
    const timeoutId = window.setTimeout(() => {
      const next = runFullAnalysis()
      if (!isActive) return
      setScore(next)
      setIsLoading(false)
    }, 0)
    return () => {
      isActive = false
      window.clearTimeout(timeoutId)
    }
  }, [setScore])

  // Load MCA questions for the current cluster
  useEffect(() => {
    if (!state.clusterId) return
    const clusterId = state.clusterId
    loadPocData().then(() => {
      const questions = getMatrixQuestions([clusterId])
      setMcaQuestions(questions)
    }).catch(() => {
      // silently fail — MCA detail will show empty
    })
  }, [state.clusterId])

  const ranking = useMemo(() => {
    const defined = new Set(state.alternativeDefinite)
    const filtered = (state.scoreFinale ?? []).filter((s) => defined.has(s.alternativaId))
    return getRankedColumns(filtered)
  }, [state.scoreFinale, state.alternativeDefinite])
  // Build category label lookup from INTERVENTION_CATEGORIES
  const catLabelMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const cat of INTERVENTION_CATEGORIES) {
      map[cat.code] = cat.label
    }
    return map
  }, [])

  function getAltLabel(altId: AlternativaId): string {
    const alt = state.alternative[altId]
    if (!alt) return `Alternativa ${altId}`

    const rawCat = alt.categoria?.trim() ?? ''
    const rawTip = alt.tipologia?.trim() ?? ''

    if (rawCat || rawTip) {
      // Try to find a human-readable label for the category code
      const catLabel = catLabelMap[rawCat]
        ? toTitleCase(catLabelMap[rawCat])
        : rawCat
          ? toTitleCase(rawCat)
          : ''
      const tipLabel = TIPOLOGIA_LABELS[rawTip]
        ?? (rawTip ? toTitleCase(rawTip) : '')

      if (catLabel && tipLabel) return `${catLabel} — ${tipLabel}`
      if (catLabel) return catLabel
      if (tipLabel) return tipLabel
    }

    const nome = alt.nome?.trim() ?? ''
    if (nome) return nome

    if (altId === 'A0') return 'Opzione zero / Scenario di inerzia'
    return `Alternativa ${altId}`
  }

  // ── Local score recalculation using user-edited weights ──────────────────

  const totalWeights = weights.wCBA + weights.wIMP + weights.wMCA + weights.wSENS

  const localScores = useMemo<ScoreComposito[]>(() => {
    if (ranking.length === 0) return []
    return ranking.map((item) => {
      const newScore = calcScoreComposito(
        {
          cba: item.cbaScore,
          impatto: item.impattoScore,
          mca: item.mcaScore,
          sensitivita: item.sensitivityScore,
        },
        weights,
        // Reconstruct kRob from existing scoreFinale / scoreComposito ratio
        item.scoreComposito > 0 ? item.scoreFinale / item.scoreComposito : 1,
      )
      return { ...item, scoreFinale: newScore }
    })
  }, [ranking, weights])

  const localRanking = useMemo(
    () => [...localScores].sort((a, b) => b.scoreFinale - a.scoreFinale),
    [localScores],
  )
  const localRecommendedId = useMemo(() => localRanking[0]?.alternativaId ?? null, [localRanking])

  function handleWeightChange(key: keyof typeof weights, value: string) {
    const parsed = parseInt(value, 10)
    if (!isNaN(parsed)) {
      setWeights((prev) => ({ ...prev, [key]: Math.max(0, Math.min(100, parsed)) }))
    }
  }

  if (isLoading) {
    return (
      <div role="status" aria-busy="true" aria-live="polite" style={loadingStyle}>
        <span style={srOnlyStyle}>Calcolo in corso</span>
      </div>
    )
  }

  if (ranking.length === 0) {
    return (
      <div role="status" aria-live="polite" style={emptyStyle}>
        Nessun punteggio disponibile: completa le fasi precedenti e riesegui l'analisi.
      </div>
    )
  }

  const toggleCard = (key: CardKey) => setOpenCards((prev) => ({ ...prev, [key]: !prev[key] }))
  const altColCount = localRanking.length

  function AltHeaderContent(item: ScoreComposito, isRecommended: boolean) {
    return (
      <div style={wizardAltHeaderWrapStyle}>
        <span style={isRecommended ? wizardAltBadgeRecommendedStyle : wizardAltBadgeStyle}>{item.alternativaId}</span>
        <span style={altHeaderLabelStyle}>{getAltLabel(item.alternativaId)}</span>
      </div>
    )
  }

  function rankMetricValue(key: string, item: ScoreComposito): number {
    if (key === 'cba') return item.cbaScore
    if (key === 'mca') return item.mcaScore
    if (key === 'sensitivita') return item.sensitivityScore
    if (key === 'impatto') return item.impattoScore
    return 0
  }

  // ── Inner header row (shared across accordion tables) ───────────────────

  function AltHeaderRow() {
    return (
      <tr>
        <th scope="col" style={innerLabelHeaderCellStyle}>Indicatore</th>
        {localRanking.map((item) => {
          const isRecommended = item.alternativaId === localRecommendedId
          return (
            <th
              key={item.alternativaId}
              scope="col"
              style={{
                ...innerAltHeaderCellStyle,
                ...(isRecommended ? innerAltHeaderRecommendedStyle : null),
              }}
            >
              {AltHeaderContent(item, isRecommended)}
              {isRecommended && <Badge label="Raccomandata" variant="success" size="s" />}
            </th>
          )
        })}
      </tr>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={rootStyle}>

      {/* ── Ranking finale ── */}
      <section aria-label="Ranking finale" style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Ranking finale alternative</h3>
        <div style={tableWrapStyle}>
          <table style={{ ...tableStyle, minWidth: `${80 + 240 + altColCount * 140}px` }}>
            <colgroup>
              <col style={{ width: '240px', minWidth: '240px' }} />
              <col style={{ width: '80px', minWidth: '80px' }} />
              {localRanking.map((item) => (
                <col key={item.alternativaId} style={{ minWidth: '140px' }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col" style={rankHeaderLabelCellStyle}>Indicatore</th>
                <th scope="col" style={rankHeaderWeightCellStyle}>Peso %</th>
                {localRanking.map((item) => {
                  const isRecommended = item.alternativaId === localRecommendedId
                  return (
                    <th
                      key={item.alternativaId}
                      scope="col"
                      style={{
                        ...rankHeaderAltCellStyle,
                        ...(isRecommended ? recommendedHeaderStyle : null),
                      }}
                    >
                      {AltHeaderContent(item, isRecommended)}
                      {isRecommended && <Badge label="Raccomandata" variant="success" size="s" />}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  key: 'cba',
                  label: 'Analisi Costi Benefici',
                  weightKey: 'wCBA' as keyof typeof weights,
                  get: (i: ScoreComposito) => fmt1(i.cbaScore),
                },
                {
                  key: 'mca',
                  label: 'Analisi Multicriteria',
                  weightKey: 'wMCA' as keyof typeof weights,
                  get: (i: ScoreComposito) => fmt1(i.mcaScore),
                },
                {
                  key: 'sensitivita',
                  label: 'Analisi del Rischio',
                  weightKey: 'wSENS' as keyof typeof weights,
                  get: (i: ScoreComposito) => fmt1(i.sensitivityScore),
                },
                {
                  key: 'impatto',
                  label: "Analisi d'Impatto",
                  weightKey: 'wIMP' as keyof typeof weights,
                  get: (i: ScoreComposito) => fmt1(i.impattoScore),
                },
              ].map(({ key, label, weightKey, get }, rowIdx) => {
                const best = Math.max(...localRanking.map((item) => rankMetricValue(key, item)))
                return (
                  <tr key={key} style={rowIdx % 2 === 1 ? rankRowAlternateStyle : undefined}>
                    <th scope="row" style={rankRowHeaderStyle}>{label}</th>
                    <td style={rankWeightCellStyle}>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={weights[weightKey]}
                        onChange={(e) => handleWeightChange(weightKey, e.target.value)}
                        aria-label={`Peso ${label}`}
                        style={weightInputStyle}
                      />
                    </td>
                    {localRanking.map((item) => {
                      const isBest = rankMetricValue(key, item) === best
                      return (
                        <td
                          key={`${key}-${item.alternativaId}`}
                          style={getRankBodyCellStyle(item, localRecommendedId, isBest)}
                        >
                          <span style={monoStyle}>{get(item)}</span>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}

              {/* Weight total indicator */}
              <tr>
                <td
                  colSpan={2 + altColCount}
                  style={{
                    padding: '6px var(--spacing-inset-s)',
                    fontSize: 'var(--type-body-xs-size, 13px)',
                    color: totalWeights !== 100 ? 'var(--color-text-danger, #c0392b)' : 'var(--color-text-primary-light)',
                    fontWeight: totalWeights !== 100 ? 700 : 400,
                    borderBottom: '1px solid #d0d0d0',
                    background: totalWeights !== 100 ? '#fff0f0' : 'transparent',
                  }}
                >
                  Totale pesi: {totalWeights}% (deve essere 100%)
                </td>
              </tr>

              {/* Final score row */}
              <tr>
                <th scope="row" style={rankTotalHeaderStyle}>PUNTEGGIO FINALE</th>
                <td style={rankTotalWeightCellStyle}></td>
                {localRanking.map((item) => (
                  <td
                    key={`finale-${item.alternativaId}`}
                    style={getRankTotalCellStyle(item, localRecommendedId)}
                  >
                    <strong style={monoStyle}>{fmt1(item.scoreFinale)}</strong>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Dettaglio calcolo ── */}
      <section aria-label="Dettaglio calcolo" style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Dettaglio calcolo</h3>

        {/* CBA accordion */}
        <article style={cardStyle}>
          <Button
            variant="ghost"
            className="step7-card-toggle"
            onClick={() => toggleCard('cba')}
            aria-expanded={openCards.cba}
            aria-controls="step7-card-cba"
          >
            Analisi Costi Benefici
          </Button>
          <div id="step7-card-cba" hidden={!openCards.cba} style={cardContentStyle}>
            <p style={metaTextStyle}>
              Orizzonte: {localRanking[0].orizzonte} anni · Tasso sconto:{' '}
              {fmtPct(localRanking[0].tassoSconto * 100)}
            </p>
            <div style={innerTableWrapStyle}>
              <table style={innerTableStyle}>
                <colgroup>
                  <col style={{ width: '200px' }} />
                  {localRanking.map((item) => (
                    <col key={item.alternativaId} />
                  ))}
                </colgroup>
                <thead>
                  <AltHeaderRow />
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" style={innerRowHeaderStyle}>VANE</th>
                    {localRanking.map((item) => (
                      <td
                        key={`van-${item.alternativaId}`}
                        style={getInnerBodyCellStyle(item, localRecommendedId)}
                      >
                        <span style={monoStyle}>{fmtEur(item.van)}</span>
                      </td>
                    ))}
                  </tr>
                  <tr style={innerRowAlternateStyle}>
                    <th scope="row" style={innerRowHeaderStyle}>TIRE</th>
                    {localRanking.map((item) => (
                      <td
                        key={`tir-${item.alternativaId}`}
                        style={getInnerBodyCellStyle(item, localRecommendedId)}
                      >
                        <span style={monoStyle}>{fmtPct(item.tir * 100)}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" style={innerRowHeaderStyle}>BCR</th>
                    {localRanking.map((item) => (
                      <td
                        key={`bcr-${item.alternativaId}`}
                        style={getInnerBodyCellStyle(item, localRecommendedId)}
                      >
                        <span style={monoStyle}>{fmt2(item.bcr)}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" style={innerTotalRowHeaderStyle}>
                      Punteggio Analisi Costi Benefici
                    </th>
                    {localRanking.map((item) => (
                      <td
                        key={`cbascore-${item.alternativaId}`}
                        style={getInnerTotalCellStyle(item, localRecommendedId)}
                      >
                        <span style={monoStyle}>{fmt1(item.cbaScore)}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </article>

        {/* MCA accordion */}
        <article style={cardStyle}>
          <Button
            variant="ghost"
            className="step7-card-toggle"
            onClick={() => toggleCard('mca')}
            aria-expanded={openCards.mca}
            aria-controls="step7-card-mca"
          >
            Analisi Multicriteria
          </Button>
          <div id="step7-card-mca" hidden={!openCards.mca} style={cardContentStyle}>
            {mcaQuestions.length === 0 ? (
              <p style={metaTextStyle}>
                {state.clusterId
                  ? 'Dati MCA non ancora caricati o non disponibili per questo cluster.'
                  : 'Cluster non disponibile.'}
              </p>
            ) : (
              <div style={innerTableWrapStyle}>
                <table style={innerTableStyle}>
                  <colgroup>
                    <col style={{ width: '200px' }} />
                    {localRanking.map((item) => (
                      <col key={item.alternativaId} />
                    ))}
                  </colgroup>
                  <thead>
                    <AltHeaderRow />
                  </thead>
                  <tbody>
                    {mcaQuestions.map((question, rowIdx) => (
                      <tr
                        key={question.qCode}
                        style={rowIdx % 2 === 1 ? innerRowAlternateStyle : undefined}
                      >
                        <th scope="row" style={innerRowHeaderStyle}>
                          <span style={{ fontWeight: 600 }}>{question.label}</span>
                          <span style={hintTextStyle}>{question.text}</span>
                        </th>
                        {localRanking.map((item) => {
                          const rawAnswer =
                            state.mcaScores[item.alternativaId]?.[question.qCode] ?? ''
                          const label =
                            MCA_CODE_TO_LABEL[rawAnswer.toUpperCase()] ?? (rawAnswer || '—')
                          return (
                            <td
                              key={`${question.qCode}-${item.alternativaId}`}
                              style={getInnerBodyCellStyle(item, localRecommendedId)}
                            >
                              <span style={monoStyle}>{label}</span>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                    <tr>
                      <th scope="row" style={innerTotalRowHeaderStyle}>
                        Punteggio Analisi Multicriteria
                      </th>
                      {localRanking.map((item) => (
                        <td
                          key={`mcascore-${item.alternativaId}`}
                          style={getInnerTotalCellStyle(item, localRecommendedId)}
                        >
                          <span style={monoStyle}>{fmt1(item.mcaScore)}</span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </article>

        {/* Analisi del Rischio — Monte Carlo accordion */}
        <article style={cardStyle}>
          <Button
            variant="ghost"
            className="step7-card-toggle"
            onClick={() => toggleCard('sensitivita')}
            aria-expanded={openCards.sensitivita}
            aria-controls="step7-card-sensitivita"
          >
            Analisi del Rischio
          </Button>
          <div id="step7-card-sensitivita" hidden={!openCards.sensitivita} style={cardContentStyle}>
            <p style={metaTextStyle}>
              1.000 simulazioni Monte Carlo · CAPEX e OPEX log-normali (σ=20%) · Benefici normali (σ=25%) ·{' '}
              <strong>P(Migliore)</strong> = % simulazioni in cui l'alternativa ha il punteggio composito più alto
            </p>
            <div style={innerTableWrapStyle}>
              <table style={innerTableStyle}>
                <colgroup>
                  <col style={{ width: '220px' }} />
                  {localRanking.map((item) => (
                    <col key={item.alternativaId} />
                  ))}
                </colgroup>
                <thead>
                  <AltHeaderRow />
                </thead>
                <tbody>
                  {/* Row 1: P(Migliore) — headline metric */}
                  <tr>
                    <th scope="row" style={innerRowHeaderStyle}>P(Migliore)</th>
                    {localRanking.map((item) => {
                      const mc = MC_MOCK_DATA[item.alternativaId]
                      const pct = mc ? mc.summary.probBest * 100 : null
                      const color = pct === null ? undefined
                        : pct >= 60 ? '#1b5e20'
                        : pct >= 20 ? '#e65100'
                        : '#c62828'
                      return (
                        <td key={`probBest-${item.alternativaId}`}
                          style={getInnerBodyCellStyle(item, localRecommendedId)}>
                          <span style={{ ...monoStyle, color, fontWeight: 700 }}>
                            {pct !== null ? `${pct.toFixed(0)}%` : '—'}
                          </span>
                        </td>
                      )
                    })}
                  </tr>

                  {/* Row 2: Media NPV (P50) */}
                  <tr style={innerRowAlternateStyle}>
                    <th scope="row" style={innerRowHeaderStyle}>Media NPV (P50)</th>
                    {localRanking.map((item) => {
                      const mc = MC_MOCK_DATA[item.alternativaId]
                      return (
                        <td key={`p50-${item.alternativaId}`}
                          style={getInnerBodyCellStyle(item, localRecommendedId)}>
                          <span style={monoStyle}>
                            {mc ? `${fmtMfromK(mc.summary.p50)} M€` : '—'}
                          </span>
                        </td>
                      )
                    })}
                  </tr>

                  {/* Row 3: Intervallo P5–P95 */}
                  <tr>
                    <th scope="row" style={innerRowHeaderStyle}>Intervallo P5–P95</th>
                    {localRanking.map((item) => {
                      const mc = MC_MOCK_DATA[item.alternativaId]
                      return (
                        <td key={`p5p95-${item.alternativaId}`}
                          style={getInnerBodyCellStyle(item, localRecommendedId)}>
                          <span style={monoStyle}>
                            {mc
                              ? `${fmtMfromK(mc.summary.p5)} – ${fmtMfromK(mc.summary.p95)} M€`
                              : '—'}
                          </span>
                        </td>
                      )
                    })}
                  </tr>

                  {/* Row 4: P(NPV < 0) */}
                  <tr style={innerRowAlternateStyle}>
                    <th scope="row" style={innerRowHeaderStyle}>P(NPV &lt; 0)</th>
                    {localRanking.map((item) => {
                      const mc = MC_MOCK_DATA[item.alternativaId]
                      const prob = mc?.summary.probNegative ?? null
                      const color = prob === null ? undefined
                        : prob > 0.2 ? '#c62828'
                        : prob > 0.05 ? '#e65100'
                        : '#2e7d32'
                      return (
                        <td key={`probNeg-${item.alternativaId}`}
                          style={getInnerBodyCellStyle(item, localRecommendedId)}>
                          <span style={{ ...monoStyle, color, fontWeight: prob !== null && prob > 0.05 ? 700 : undefined }}>
                            {prob !== null ? `${(prob * 100).toFixed(1)}%` : '—'}
                          </span>
                        </td>
                      )
                    })}
                  </tr>

                  {/* Row 5: Parametro critico */}
                  <tr>
                    <th scope="row" style={innerRowHeaderStyle}>Parametro critico</th>
                    {localRanking.map((item) => {
                      const mc = MC_MOCK_DATA[item.alternativaId]
                      const topParam = mc
                        ? [...mc.elasticities].sort((a, b) => b.value - a.value)[0]?.param
                        : null
                      return (
                        <td key={`param-${item.alternativaId}`}
                          style={getInnerBodyCellStyle(item, localRecommendedId)}>
                          <span style={monoStyle}>{topParam ?? '—'}</span>
                        </td>
                      )
                    })}
                  </tr>

                  {/* Total row: Punteggio */}
                  <tr>
                    <th scope="row" style={innerTotalRowHeaderStyle}>
                      Punteggio Analisi del Rischio
                    </th>
                    {localRanking.map((item) => (
                      <td
                        key={`riskscore-${item.alternativaId}`}
                        style={getInnerTotalCellStyle(item, localRecommendedId)}
                      >
                        <span style={monoStyle}>{fmt1(item.sensitivityScore)}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </article>

        {/* Impatto accordion */}
        <article style={cardStyle}>
          <Button
            variant="ghost"
            className="step7-card-toggle"
            onClick={() => toggleCard('impatto')}
            aria-expanded={openCards.impatto}
            aria-controls="step7-card-impatto"
          >
            Analisi d'impatto
          </Button>
          <div id="step7-card-impatto" hidden={!openCards.impatto} style={cardContentStyle}>
            <div style={innerTableWrapStyle}>
              <table style={innerTableStyle}>
                <colgroup>
                  <col style={{ width: '200px' }} />
                  {localRanking.map((item) => (
                    <col key={item.alternativaId} />
                  ))}
                </colgroup>
                <thead>
                  <AltHeaderRow />
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" style={innerRowHeaderStyle}>PIL (€M)</th>
                    {localRanking.map((item) => (
                      <td
                        key={`pil-${item.alternativaId}`}
                        style={getInnerBodyCellStyle(item, localRecommendedId)}
                      >
                        <span style={monoStyle}>{fmt1(item.pil)}</span>
                      </td>
                    ))}
                  </tr>
                  <tr style={innerRowAlternateStyle}>
                    <th scope="row" style={innerRowHeaderStyle}>Occupati</th>
                    {localRanking.map((item) => (
                      <td
                        key={`occ-${item.alternativaId}`}
                        style={getInnerBodyCellStyle(item, localRecommendedId)}
                      >
                        <span style={monoStyle}>{item.occupati.toLocaleString('it-IT')}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" style={innerRowHeaderStyle}>Produzione (€M)</th>
                    {localRanking.map((item) => (
                      <td
                        key={`prod-${item.alternativaId}`}
                        style={getInnerBodyCellStyle(item, localRecommendedId)}
                      >
                        <span style={monoStyle}>{fmt1(item.produzione)}</span>
                      </td>
                    ))}
                  </tr>
                  <tr style={innerRowAlternateStyle}>
                    <th scope="row" style={innerRowHeaderStyle}>Redditi (€M)</th>
                    {localRanking.map((item) => (
                      <td
                        key={`red-${item.alternativaId}`}
                        style={getInnerBodyCellStyle(item, localRecommendedId)}
                      >
                        <span style={monoStyle}>{fmt1(item.redditi)}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" style={innerTotalRowHeaderStyle}>
                      Punteggio Analisi d'impatto
                    </th>
                    {localRanking.map((item) => (
                      <td
                        key={`impscore-${item.alternativaId}`}
                        style={getInnerTotalCellStyle(item, localRecommendedId)}
                      >
                        <span style={monoStyle}>{fmt1(item.impattoScore)}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </section>

      <style>{`
        .step7-card-toggle {
          width: 100%;
          justify-content: flex-start;
          padding-left: 0;
          padding-right: 0;
          text-align: left;
          font-weight: 700;
          color: var(--color-text-primary);
        }
        .step7-weight-input:focus {
          box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
          outline: none;
        }
      `}</style>
    </div>
  )
}

// ── Styles ─────────────────────────────────────────────────────────────────

const rootStyle: CSSProperties = { display: 'grid', gap: 'var(--spacing-stack-m)' }
const sectionStyle: CSSProperties = { display: 'grid', gap: 'var(--spacing-stack-s)' }
const sectionTitleStyle: CSSProperties = { margin: 0, color: 'var(--color-text-primary)' }

const tableWrapStyle: CSSProperties = {
  overflowX: 'auto',
  border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)',
}

const tableStyle: CSSProperties = {
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
  background: 'var(--color-background-inverse)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

// ── Ranking table header ─────────────────────────────────────────────────

const rankHeaderLabelCellStyle: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid #d0d0d0',
  background: '#f0f0f0',
  color: 'var(--color-text-primary)',
  verticalAlign: 'bottom',
  fontWeight: 700,
}

const rankHeaderWeightCellStyle: CSSProperties = {
  textAlign: 'center',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid #d0d0d0',
  borderLeft: '1px solid #d0d0d0',
  background: '#f0f0f0',
  color: 'var(--color-text-primary)',
  verticalAlign: 'bottom',
  fontWeight: 700,
}

const rankHeaderAltCellStyle: CSSProperties = {
  textAlign: 'right',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid #d0d0d0',
  borderLeft: '1px solid #d0d0d0',
  background: '#f0f0f0',
  color: 'var(--color-text-primary)',
  verticalAlign: 'top',
  wordBreak: 'break-word',
}

const recommendedHeaderStyle: CSSProperties = {
  background: '#e8e8e8',
  boxShadow: 'inset 0 0 0 2px #888',
  color: 'var(--color-text-primary)',
}

const altHeaderLabelStyle: CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
  wordBreak: 'break-word',
  marginBottom: 0,
  lineHeight: 1.25,
}

const wizardAltHeaderWrapStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minWidth: 0,
}

const wizardAltBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  flex: '0 0 24px',
  background: 'var(--color-background-secondary-lightest)',
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-0, monospace)',
  fontSize: 10,
  fontWeight: 800,
  lineHeight: 1,
}

const wizardAltBadgeRecommendedStyle: CSSProperties = {
  ...wizardAltBadgeStyle,
  background: '#5b21f7',
  color: '#fff',
}

const rankRowHeaderStyle: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid #d0d0d0',
  color: 'var(--color-text-primary)',
  fontWeight: 400,
}

const rankRowAlternateStyle: CSSProperties = {
  background: '#fafafa',
}

const rankWeightCellStyle: CSSProperties = {
  padding: '4px var(--spacing-inset-s)',
  borderBottom: '1px solid #d0d0d0',
  borderLeft: '1px solid #d0d0d0',
  textAlign: 'center',
  verticalAlign: 'middle',
}

const weightInputStyle: CSSProperties = {
  width: '52px',
  padding: '4px 6px',
  border: '1px solid #c0c0c0',
  borderRadius: 'var(--radius-smooth)',
  fontFamily: 'var(--font-family-0, monospace)',
  fontSize: 'var(--type-body-xs-size, 13px)',
  textAlign: 'right',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary)',
}

const rankTotalHeaderStyle: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid #d0d0d0',
  background: '#e8e8e8',
  color: 'var(--color-text-primary)',
  fontWeight: 700,
}

const rankTotalWeightCellStyle: CSSProperties = {
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid #d0d0d0',
  borderLeft: '1px solid #d0d0d0',
  background: '#e8e8e8',
}

const recommendedColumnTint = '#f2f2f2'

function getRankBodyCellStyle(item: ScoreComposito, localRecommendedId: AlternativaId | null, isBest = false): CSSProperties {
  return {
    padding: 'var(--spacing-inset-s)',
    borderBottom: '1px solid #d0d0d0',
    borderLeft: '1px solid #d0d0d0',
    color: 'var(--color-text-primary)',
    background: isBest ? 'rgba(16,138,67,0.10)' : item.alternativaId === localRecommendedId ? recommendedColumnTint : 'var(--color-background-inverse)',
    fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
    textAlign: 'right',
    fontWeight: isBest ? 800 : undefined,
    ...(isBest ? { boxShadow: 'inset 3px 0 0 #108a43' } : {}),
  }
}

function getRankTotalCellStyle(item: ScoreComposito, localRecommendedId: AlternativaId | null): CSSProperties {
  return {
    padding: 'var(--spacing-inset-s)',
    borderBottom: '1px solid #d0d0d0',
    borderLeft: '1px solid #d0d0d0',
    background: item.alternativaId === localRecommendedId ? '#e0e0e0' : '#e8e8e8',
    color: 'var(--color-text-primary)',
    textAlign: 'right',
    fontWeight: 700,
    ...(item.alternativaId === localRecommendedId ? { boxShadow: 'inset 0 0 0 2px #888' } : {}),
  }
}

// ── Card / accordion styles ───────────────────────────────────────────────

const cardStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  padding: 'var(--spacing-inset-s)',
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
}

const cardContentStyle: CSSProperties = { display: 'grid', gap: 'var(--spacing-stack-xs)' }
const metaTextStyle: CSSProperties = { margin: 0, color: 'var(--color-text-primary-light)', fontSize: 'var(--type-body-xs-size, 14px)' }
const hintTextStyle: CSSProperties = { display: 'block', marginTop: 'var(--spacing-stack-xxs, 4px)', fontWeight: 400, fontSize: 12, color: 'var(--color-text-primary-light)' }

// ── Inner detail table styles ─────────────────────────────────────────────

const innerTableWrapStyle: CSSProperties = { overflowX: 'auto' }
const innerTableStyle: CSSProperties = {
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

const innerLabelHeaderCellStyle: CSSProperties = {
  width: '200px',
  minWidth: '200px',
  padding: 'var(--spacing-inset-s)',
  textAlign: 'left',
  verticalAlign: 'top',
  borderBottom: '1px solid #d0d0d0',
  background: '#f0f0f0',
  color: 'var(--color-text-primary)',
  fontWeight: 700,
}

const innerAltHeaderCellStyle: CSSProperties = {
  padding: 'var(--spacing-inset-s)',
  textAlign: 'right',
  verticalAlign: 'top',
  borderBottom: '1px solid #d0d0d0',
  borderLeft: '1px solid #d0d0d0',
  background: '#f0f0f0',
  color: 'var(--color-text-primary)',
  wordBreak: 'break-word',
  fontWeight: 700,
}

const innerAltHeaderRecommendedStyle: CSSProperties = {
  background: '#e8e8e8',
  boxShadow: 'inset 0 0 0 2px #888',
}

const innerRowHeaderStyle: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--spacing-inset-xs) var(--spacing-inset-s)',
  borderBottom: '1px solid #d0d0d0',
  color: 'var(--color-text-primary)',
  fontWeight: 400,
}

const innerRowAlternateStyle: CSSProperties = { background: '#fafafa' }

const innerBodyCellBaseStyle: CSSProperties = {
  padding: 'var(--spacing-inset-xs) var(--spacing-inset-s)',
  borderBottom: '1px solid #d0d0d0',
  borderLeft: '1px solid #d0d0d0',
  color: 'var(--color-text-primary)',
  textAlign: 'right',
}

const innerTotalRowHeaderStyle: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--spacing-inset-xs) var(--spacing-inset-s)',
  borderBottom: '1px solid #d0d0d0',
  background: '#f0f0f0',
  color: 'var(--color-text-primary)',
  fontWeight: 700,
}

const innerTotalCellBaseStyle: CSSProperties = {
  padding: 'var(--spacing-inset-xs) var(--spacing-inset-s)',
  borderBottom: '1px solid #d0d0d0',
  borderLeft: '1px solid #d0d0d0',
  background: '#f0f0f0',
  color: 'var(--color-text-primary)',
  fontWeight: 700,
  textAlign: 'right',
  fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
}

function getInnerBodyCellStyle(item: ScoreComposito, localRecommendedId: AlternativaId | null): CSSProperties {
  return {
    ...innerBodyCellBaseStyle,
    background: item.alternativaId === localRecommendedId ? recommendedColumnTint : 'var(--color-background-inverse)',
  }
}

function getInnerTotalCellStyle(item: ScoreComposito, localRecommendedId: AlternativaId | null): CSSProperties {
  return {
    ...innerTotalCellBaseStyle,
    background: item.alternativaId === localRecommendedId ? '#e8e8e8' : '#f0f0f0',
    ...(item.alternativaId === localRecommendedId ? { boxShadow: 'inset 0 0 0 2px #888' } : {}),
  }
}

const monoStyle: CSSProperties = { fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)' }
const loadingStyle: CSSProperties = { minHeight: '72px', border: '1px solid var(--color-border-secondary-light)', borderRadius: 'var(--radius-smooth)', background: 'var(--color-background-secondary-lightest)' }
const srOnlyStyle: CSSProperties = { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }
const emptyStyle: CSSProperties = { padding: 'var(--spacing-inset-s)', borderRadius: 'var(--radius-smooth)', border: '1px solid var(--color-border-warning)', background: 'var(--color-background-warning-lighter)', color: 'var(--color-text-warning)' }
