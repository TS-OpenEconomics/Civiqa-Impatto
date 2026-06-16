import { useSyncExternalStore, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { wizardStore } from '../store/wizardStore'
import { loadDocfapDemo } from '../data/docfapDemo'
import { NEEDS } from '../data/poc_docfap/fabbisogni_v2'
import { formatEuro } from '../utils/format'
import type { AlternativaId, ScoreComposito } from '../types/docfap'
import { TabImpatto } from '../components/docfap/TabImpatto'
import { TabCBA } from '../components/docfap/TabCBA'
import { TabMCA } from '../components/docfap/TabMCA'
import { TabSensitivita } from '../components/docfap/TabSensitivita'
import { ConfrontoOverlay } from '../components/docfap/ConfrontoOverlay'
import { ResultBox } from '../components/docfap/ResultBox'
import { buildDimensionMetrics, buildResultBoxOptions } from '../components/docfap/resultBoxData'
import type { DimensionKey } from '../components/docfap/resultBoxData'
import { rankColor, buildRankIndexMap } from '../components/docfap/rankColors'
import {
  getDefinedScores,
  getRecommendedAlternativeId,
  getAlternativeDisplayLabel,
  hasRenderableDocfapScores,
  safeNumber,
} from '../components/docfap/tableHelpers'

// ── Mappatura demo opzione → progetto /valutazioni (EIA+ECBA completi) ──────────
// Non lega numeri reali: serve solo a far funzionare la logica di navigazione (POC).
// Fino a 5 alternative: A1→PROJ-001, A2→PROJ-002, A3→PROJ-003, poi cicla.
const OPTION_PROJECTS = ['PROJ-001', 'PROJ-002', 'PROJ-003'] as const
function projectForOption(optionId: AlternativaId): string {
  const idx = Math.max(0, (parseInt(optionId.slice(1), 10) || 1) - 1)
  return OPTION_PROJECTS[idx % OPTION_PROJECTS.length]
}


function assetUrl(path: string): string {
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'
  return `${base}${path.replace(/^\/+/, '')}`
}
const LOGO_EIA = assetUrl('icons/analysis-eia.png')
const LOGO_ECBA = assetUrl('icons/analysis-ecba.png')

// Etichette dei macro-temi (TC01–TC12) usati da NEEDS (fabbisogni_v2).
const THEME_LABELS: Record<string, string> = {
  TC01: 'Cultura e turismo',
  TC02: 'Economia e lavoro',
  TC03: 'Istruzione e formazione',
  TC04: 'Welfare e inclusione',
  TC05: 'Salute e sanità',
  TC06: 'Ambiente e territorio',
  TC07: 'Mobilità e trasporti',
  TC08: 'Patrimonio pubblico',
  TC09: 'Energia e clima',
  TC11: 'Ricerca e innovazione',
}

// ── Formatters ──────────────────────────────────────────────────────────────────
function nf(value: number, decimals = 1): string {
  return safeNumber(value).toLocaleString('it-IT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}
const fmtScore = (v: number) => `${nf(v, 1)} / 100`

// ── Icone box (MCA/Rischio non hanno un logo PNG dedicato) ──────────────────────
function IconMca() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h10" /><path d="M4 12h7" /><path d="M4 18h12" /><path d="M16 6l2 2 4-4" />
    </svg>
  )
}
function IconRischio() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /><path d="M12 8v4" /><path d="M12 16h.01" />
    </svg>
  )
}
function IconDoc() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" />
    </svg>
  )
}
function IconDownload() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

// ── Pagina ───────────────────────────────────────────────────────────────────────
export function DocfapDetail() {
  const navigate = useNavigate()
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const [compareDimension, setCompareDimension] = useState<DimensionKey | null>(null)

  // Se lo store è vuoto o incompatibile, carica il dataset DOCFAP di esempio.
  useEffect(() => {
    if (!hasRenderableDocfapScores(state.scoreFinale)) {
      wizardStore.actions.reset()
      void loadDocfapDemo()
    }
  }, [state.scoreFinale])

  const scores = getDefinedScores(state.scoreFinale, state.alternativeDefinite)
  const recommendedId = getRecommendedAlternativeId(scores)
  const recommended = recommendedId ? scores.find((s) => s.alternativaId === recommendedId) ?? null : null

  const need = NEEDS.find((item) => item.code === state.fabId)
  const temaCode = need?.tema_code ?? state.temaId ?? ''
  const temaLabel = THEME_LABELS[temaCode] ?? (temaCode || '—')
  const fabLabel = need?.label ?? '—'
  const completato = scores.length > 0
  const nomeIntervento = state.intervento.denominazione || 'Intervento senza nome'
  const descrizioneProgetto = state.problema.descrizione || 'Descrizione del progetto non disponibile.'

  function labelOf(id: AlternativaId): string {
    return getAlternativeDisplayLabel(id, state.alternative[id])
  }

  // Navigazione "analisi completa" per dimensione e opzione.
  function openSingle(dimension: DimensionKey, optionId: AlternativaId) {
    const proj = projectForOption(optionId)
    if (dimension === 'impatto') navigate(`/valutazioni/${proj}/eia/results`)
    else if (dimension === 'cba' || dimension === 'rischio') navigate(`/valutazioni/${proj}/ecba/results`)
    else if (dimension === 'mca') navigate(`/impatti/docfap/mca/${optionId}`)
  }

  // ── Sintesi alternativa raccomandata (mostrata nella testata) ──
  const recommendedLabel = recommended ? labelOf(recommended.alternativaId) : '—'
  const finalScoreLabel = recommended ? fmtScore(recommended.scoreFinale) : '—'

  // ── Opzioni (fino a 5) ──
  // Ordine naturale A1 → A2 → … (la demo restituisce la raccomandata in testa).
  const orderedScores = [...scores].sort((a, b) => a.alternativaId.localeCompare(b.alternativaId))
  const rankMap = buildRankIndexMap(scores)
  const canRenderBoxes = orderedScores.length >= 2
  const boxOptions = buildResultBoxOptions(orderedScores, recommendedId, state.alternative)

  const BOXES: Array<{
    key: DimensionKey
    title: string
    tag: string
    tagClassName: string
    description: string
    icon?: ReactNode
    iconSrc?: string
    footnote?: string
  }> = [
    {
      key: 'impatto',
      title: "Analisi d'impatto economico",
      tag: 'EIA',
      tagClassName: 'bg-badge-eia text-ink-900',
      description: 'Effetti del progetto su PIL, occupazione e produzione del territorio.',
      iconSrc: LOGO_EIA,
    },
    {
      key: 'cba',
      title: 'Analisi Costi-Benefici',
      tag: 'ECBA',
      tagClassName: 'bg-badge-ecba text-ink-900',
      description: 'Convenienza economica del progetto: VANE, TIRE, rapporto benefici/costi.',
      iconSrc: LOGO_ECBA,
    },
    {
      key: 'mca',
      title: 'Analisi Multicriteria',
      tag: 'MCA',
      tagClassName: 'bg-brand-violet/15 text-brand-violet',
      description: 'Valutazione qualitativa secondo i criteri del cluster di intervento.',
      icon: <IconMca />,
      footnote: "L'analisi multicriteria è disponibile solo all'interno del DOCFAP.",
    },
    {
      key: 'rischio',
      title: 'Analisi del Rischio',
      tag: 'RISK',
      tagClassName: 'bg-amber-100 text-amber-700',
      description: 'Robustezza dei risultati a variazioni di costi, benefici e tasso di sconto.',
      icon: <IconRischio />,
      footnote: "Il rischio è analizzato all'interno dell'ACB completa.",
    },
  ]

  const COMPARE_META: Record<DimensionKey, { title: string; subtitle: string; node: ReactNode }> = {
    impatto: { title: "Analisi d'impatto economico", subtitle: 'Confronto degli effetti economici tra le opzioni.', node: <TabImpatto /> },
    cba: { title: 'Analisi Costi-Benefici', subtitle: 'Confronto della convenienza economica tra le opzioni.', node: <TabCBA /> },
    mca: { title: 'Analisi Multicriteria', subtitle: 'Confronto dei criteri qualitativi tra le opzioni.', node: <TabMCA /> },
    rischio: { title: 'Analisi del Rischio', subtitle: 'Confronto della robustezza dei risultati tra le opzioni.', node: <TabSensitivita /> },
  }
  const optionsLabel = orderedScores.map((s) => labelOf(s.alternativaId)).join('  ·  ')

  return (
    <div className="min-h-full bg-bg-page px-4 py-8 md:px-8">
      {/* Breadcrumb */}
      <nav className="mb-3 flex items-center gap-1.5 text-xs text-ink-500">
        <button type="button" onClick={() => navigate('/impatti/docfap')} className="transition-colors hover:text-brand-violet">
          DOCFAP
        </button>
        <span>›</span>
        <span className="font-semibold text-ink-700">Sintesi della valutazione</span>
      </nav>
      <p className="mb-5 text-[11px] text-ink-400">
        Creato il <span className="font-medium">14/04/2026</span> da{' '}
        <span className="font-medium">{state.localizzazione.comune || 'Ente non specificato'}</span>
        {state.rup.nome ? ` (RUP ${state.rup.nome})` : ''} — Ultima modifica il{' '}
        <span className="font-medium">14/04/2026</span>
      </p>

      {/* Testata — card identità + azioni + meta-griglia (stile /valutazioni) */}
      <div className="border border-ink-100 bg-white">
        <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 md:px-8">
          <div className="flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-brand-violet/10 text-brand-violet">
              <IconDoc />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[18px] font-bold leading-tight text-ink-900">{nomeIntervento}</h1>
                <span className="inline-flex items-center bg-brand-violet/15 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-brand-violet">
                  DOCFAP
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold ${completato ? 'border border-green-200 bg-green-50 text-green-700' : 'bg-ink-100 text-ink-500'}`}>
                  {completato ? 'Completato' : 'In bozza'}
                </span>
              </div>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-500">{descrizioneProgetto}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button
              type="button"
              className="flex h-9 items-center gap-2 bg-brand-violet px-4 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Scarica report <IconDownload />
            </button>
            <button
              type="button"
              className="flex h-9 items-center gap-2 bg-accent-lime px-4 font-semibold text-ink-900 transition-opacity hover:opacity-90"
            >
              Scarica Excel <IconDownload />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-ink-100 border-t border-ink-100 bg-white text-sm md:grid-cols-4 md:divide-x md:divide-y-0">
          <MetaField label="Tema del fabbisogno" value={temaLabel} />
          <MetaField label="Fabbisogno specifico" value={fabLabel} />
          <MetaField label="Alternativa raccomandata" value={recommendedLabel} highlight />
          <MetaField label="Punteggio finale" value={finalScoreLabel} highlight emphasis="score" />
        </div>
      </div>

      {/* Opzioni a confronto (fino a 5) — presentazione chiara delle alternative */}
      {orderedScores.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-baseline gap-2">
            <h2 className="text-[14px] font-bold text-ink-900">Opzioni a confronto</h2>
            <span className="text-[12px] text-ink-400">
              {orderedScores.length} {orderedScores.length === 1 ? 'alternativa' : 'alternative'}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
            {orderedScores.map((s) => {
              const alt = state.alternative[s.alternativaId]
              const rec = s.alternativaId === recommendedId
              // Colore per piazzamento: 1ª verde, 2ª arancione (3+), resto grigio.
              const c = rankColor(rankMap[s.alternativaId] ?? 0, orderedScores.length)
              return (
                <div
                  key={s.alternativaId}
                  className="flex flex-col border bg-white p-4 shadow-sm"
                  style={rec
                    ? { borderColor: c.accent, boxShadow: `0 0 0 1px ${c.tint}` }
                    : { borderColor: 'var(--color-border-secondary-light, #e7e7e7)' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="inline-flex h-6 items-center px-2 font-mono text-[11px] font-bold"
                      style={{ background: c.solid, color: c.text }}
                    >
                      {s.alternativaId}
                    </span>
                    {rec && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white"
                        style={{ background: c.solid }}
                      >
                        Raccomandata
                      </span>
                    )}
                    {!rec && (rankMap[s.alternativaId] ?? 0) === 1 && orderedScores.length >= 3 && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white"
                        style={{ background: c.solid }}
                      >
                        2a migliore
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[13px] font-semibold leading-snug text-ink-900">{labelOf(s.alternativaId)}</p>
                  <dl className="mt-3 space-y-1 text-[12px]">
                    <div className="flex justify-between gap-2">
                      <dt className="text-ink-400">CAPEX</dt>
                      <dd className="font-mono text-ink-700">{alt?.capex != null ? `€ ${formatEuro(alt.capex)}` : '—'}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-ink-400">OPEX</dt>
                      <dd className="font-mono text-ink-700">{alt?.opex != null ? `€ ${formatEuro(alt.opex)}` : '—'}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-ink-400">Durata</dt>
                      <dd className="font-mono text-ink-700">{alt?.durataStimata ? `${alt.durataStimata} mesi` : '—'}</dd>
                    </div>
                  </dl>
                  <div className="mt-3 border-t border-ink-100 pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">Punteggio finale</span>
                      <span className="font-mono text-[16px] font-bold" style={{ color: c.solid }}>{nf(s.scoreFinale, 1)}</span>
                    </div>
                    <span className="mt-1.5 block h-1.5 w-full overflow-hidden bg-ink-100">
                      <span
                        className="block h-full"
                        style={{ width: `${Math.max(0, Math.min(100, safeNumber(s.scoreFinale)))}%`, background: c.solid }}
                      />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Dettagli del progetto */}
      <div className="mt-6 overflow-hidden border border-ink-100 bg-white">
        <div className="border-b border-ink-100 bg-white px-6 py-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Dettagli del progetto</p>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 bg-white px-6 py-4 sm:grid-cols-3">
          <ConfigItem label="RUP" value={state.rup.nome || '—'} />
          <ConfigItem label="Fonte di finanziamento" value={state.intervento.fonteFinanziamento || '—'} />
          <ConfigItem label="Urgenza" value={state.urgenza || '—'} />
        </div>
        {state.scenarioZeroNarrative && (
          <div className="border-t border-ink-100 px-6 py-4">
            <p className="text-[11px] font-medium text-ink-400">Scenario di base — cosa accadrebbe senza l'intervento</p>
            <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-ink-700">{state.scenarioZeroNarrative}</p>
          </div>
        )}
      </div>

      {/* Box analisi */}
      <div className="mt-10">
        <div className="mb-5">
          <h2 className="text-[20px] font-bold text-ink-900">Le analisi del DOCFAP</h2>
          <p className="mt-0.5 text-[12px] text-ink-500">
            Per ogni analisi: apri il dettaglio completo di una singola opzione, oppure confronta tutte le opzioni a schermo intero.
          </p>
        </div>

        {canRenderBoxes ? (
          <div className="space-y-5">
            {BOXES.map((box) => (
              <ResultBox
                key={box.key}
                iconSrc={box.iconSrc}
                icon={box.icon}
                title={box.title}
                tag={box.tag}
                tagClassName={box.tagClassName}
                description={box.description}
                options={boxOptions}
                metrics={buildDimensionMetrics(box.key, orderedScores)}
                singleActionLabel="Analisi completa"
                onOpenSingle={(optionId) => openSingle(box.key, optionId)}
                onCompare={() => setCompareDimension(box.key)}
                footnote={box.footnote}
              />
            ))}
          </div>
        ) : (
          <div className="rounded border border-dashed border-ink-200 px-5 py-10 text-center text-[13px] text-ink-500">
            Servono almeno due opzioni definite per visualizzare le analisi a confronto.
          </div>
        )}
      </div>

      {/* Overlay di confronto */}
      {compareDimension && (
        <ConfrontoOverlay
          title={COMPARE_META[compareDimension].title}
          subtitle={COMPARE_META[compareDimension].subtitle}
          optionsLabel={optionsLabel}
          onClose={() => setCompareDimension(null)}
        >
          {COMPARE_META[compareDimension].node}
        </ConfrontoOverlay>
      )}
    </div>
  )
}

function MetaField({
  label,
  value,
  highlight = false,
  emphasis,
}: {
  label: string
  value: string
  highlight?: boolean
  emphasis?: 'score'
}) {
  if (emphasis === 'score') {
    const [score, scale] = value.split(' / ')
    return (
      <div className="px-6 py-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand-violet">{label}</p>
        <p className="mt-1 flex items-baseline gap-1.5 font-mono text-brand-violet" title={value}>
          <span className="text-[24px] font-extrabold leading-none">{score}</span>
          {scale && <span className="text-[12px] font-bold text-brand-violet/70">/ {scale}</span>}
        </p>
      </div>
    )
  }

  return (
    <div className="px-6 py-4">
      <p className="text-[11px] font-medium text-ink-400">{label}</p>
      <p className={`mt-1 text-[13px] font-semibold ${highlight ? 'text-brand-violet' : 'text-ink-900'}`} title={value}>
        {value}
      </p>
    </div>
  )
}

function ConfigItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-ink-400">{label}</p>
      <div className="mt-0.5 text-[13px] font-semibold text-ink-900">{value}</div>
    </div>
  )
}
