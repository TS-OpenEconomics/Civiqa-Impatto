import { useEffect, useState, useSyncExternalStore } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { wizardStore } from '../store/wizardStore'
import { loadDocfapDemo } from '../data/docfapDemo'
import { getMatrixQuestions, loadPocData } from '../data/poc_docfap/evaluation_matrix'
import type { McaQuestion } from '../data/poc_docfap/evaluation_matrix'
import type { AlternativaId } from '../types/docfap'
import {
  getAlternativeDisplayLabel,
  getRecommendedAlternativeId,
  getDefinedScores,
  hasRenderableDocfapScores,
  safeNumber,
} from '../components/docfap/tableHelpers'

const SCALE_LABELS: Record<string, string> = { A: 'Alto', M: 'Medio', B: 'Basso', N: 'Nullo' }
const SCALE_CLS: Record<string, string> = {
  A: 'bg-green-100 text-green-800',
  M: 'bg-amber-100 text-amber-700',
  B: 'bg-orange-100 text-orange-700',
  N: 'bg-ink-100 text-ink-500',
}

/**
 * Analisi MCA completa di UNA singola opzione (interna al DOCFAP).
 * Raggiunta da DocfapDetail via /impatti/docfap/mca/:option. Layout Tailwind.
 */
export function DocfapMcaDetail() {
  const navigate = useNavigate()
  const params = useParams<{ option: string }>()
  const optionId = (params.option ?? 'A1') as AlternativaId

  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)

  useEffect(() => {
    if (!hasRenderableDocfapScores(state.scoreFinale)) {
      wizardStore.actions.reset()
      void loadDocfapDemo()
    }
  }, [state.scoreFinale])

  const [questions, setQuestions] = useState<McaQuestion[]>([])
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const clusterIds = state.clusterId ? [state.clusterId] : []
    let active = true
    loadPocData().then(() => {
      if (!active) return
      setQuestions(getMatrixQuestions(clusterIds))
      setLoaded(true)
    })
    return () => {
      active = false
    }
  }, [state.clusterId])

  const scores = getDefinedScores(state.scoreFinale, state.alternativeDefinite)
  const recommendedId = getRecommendedAlternativeId(scores)
  const score = scores.find((s) => s.alternativaId === optionId) ?? null
  const label = getAlternativeDisplayLabel(optionId, state.alternative[optionId])
  const isRecommended = optionId === recommendedId
  const answers = state.mcaScores[optionId] ?? {}

  const valued = questions.filter((q) => answers[q.qCode])

  return (
    <div className="px-4 py-8 md:px-10">
      {/* Breadcrumb */}
      <nav className="mb-3 flex items-center gap-1.5 text-[12px] text-ink-500">
        <button type="button" onClick={() => navigate('/impatti/docfap')} className="transition-colors hover:text-brand-violet">
          DOCFAP
        </button>
        <span>›</span>
        <button type="button" onClick={() => navigate('/impatti/docfap/detail')} className="transition-colors hover:text-brand-violet">
          Sintesi della valutazione
        </button>
        <span>›</span>
        <span className="text-ink-900">Analisi Multicriteria</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[22px] font-bold leading-snug text-ink-900">Analisi Multicriteria</h1>
            <span className="inline-flex items-center bg-brand-violet/15 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-brand-violet">
              MCA
            </span>
            {isRecommended && (
              <span className="inline-flex items-center bg-green-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Raccomandata
              </span>
            )}
          </div>
          <p className="mt-2 text-[14px] text-ink-700">
            Opzione <span className="font-semibold">{label}</span> — valutazione qualitativa secondo i criteri del cluster di intervento.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/impatti/docfap/detail')}
          className="shrink-0 rounded border border-ink-100 px-4 py-2 text-[13px] font-semibold text-ink-700 transition-colors hover:border-brand-violet hover:text-brand-violet"
        >
          ← Torna alla sintesi
        </button>
      </div>

      {/* Punteggio */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded border border-ink-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-700">Punteggio MCA</p>
          <p className="mt-2 text-[24px] font-bold leading-none text-ink-900">{score ? `${safeNumber(score.mcaScore).toFixed(1)}` : '—'}<span className="text-[14px] text-ink-400"> / 100</span></p>
        </div>
        <div className="rounded border border-ink-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-700">Criteri valutati</p>
          <p className="mt-2 text-[24px] font-bold leading-none text-ink-900">{valued.length}<span className="text-[14px] text-ink-400"> / {questions.length || '—'}</span></p>
        </div>
      </div>

      {/* Tabella criteri */}
      <div className="mt-8 overflow-hidden rounded border border-ink-100 bg-white">
        <div className="border-b border-ink-100 px-5 py-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Criteri qualitativi</p>
        </div>
        {!loaded ? (
          <p className="px-5 py-10 text-center text-[13px] text-ink-400">Caricamento criteri MCA…</p>
        ) : questions.length === 0 ? (
          <p className="px-5 py-10 text-center text-[13px] text-ink-400">
            Nessun criterio qualitativo disponibile per il cluster selezionato.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-100/30">
                <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-500">Criterio</th>
                <th className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-ink-500">Valutazione</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => {
                const livello = answers[q.qCode]
                return (
                  <tr key={q.qCode} className="border-b border-ink-100 last:border-0">
                    <td className="px-5 py-3 text-[13px] text-ink-800">{q.text}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 text-[12px] font-semibold ${livello ? SCALE_CLS[livello] ?? 'bg-ink-100 text-ink-700' : 'bg-ink-100 text-ink-400'}`}>
                        {livello ? SCALE_LABELS[livello] ?? livello : '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
