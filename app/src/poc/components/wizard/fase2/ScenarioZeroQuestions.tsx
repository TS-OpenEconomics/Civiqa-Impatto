import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { getQuestionsForFabbisogno, loadPocData } from '../../../data/poc_docfap/sz_questions_all'
import type { SzQuestion } from '../../../data/poc_docfap/sz_questions_all'
import { useWizard } from '../../../hooks/useWizard'

export function ScenarioZeroQuestions() {
  const { state, setScenarioZeroAnswers, setScenarioZeroNarrative } = useWizard()
  const [questions, setQuestions] = useState<SzQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(
    state.scenarioZeroAnswers,
  )
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadPocData().then(() => {
      const qs = getQuestionsForFabbisogno(state.fabId ?? '')
      setQuestions(qs)
      setLoaded(true)
    })
  }, [state.fabId])

  // Sincronizza le selezioni quando lo store cambia dall'esterno (es. Autoriempi):
  // senza questo, lo stato locale `answers` resta fermo e l'autofill non si vede.
  useEffect(() => {
    setAnswers(state.scenarioZeroAnswers)
  }, [state.scenarioZeroAnswers])

  function buildNarrative(
    qs: SzQuestion[],
    ans: Record<string, string | string[]>,
  ): string {
    const fragments: string[] = []
    for (const q of qs) {
      const answer = ans[q.questionId]
      if (!answer) continue
      const selectedIds = Array.isArray(answer) ? answer : [answer]
      for (const id of selectedIds) {
        const opzione = q.opzioni.find((o) => o.id === id)
        if (opzione?.textFragment) fragments.push(opzione.textFragment)
      }
    }
    return fragments.join(' ')
  }

  function handleSingleChange(questionId: string, value: string) {
    const next = { ...answers, [questionId]: value }
    setAnswers(next)
    setScenarioZeroAnswers(next)
    setScenarioZeroNarrative(buildNarrative(questions, next))
  }

  function handleMultiChange(questionId: string, value: string, checked: boolean) {
    const current = (answers[questionId] as string[] | undefined) ?? []
    const next = checked ? [...current, value] : current.filter((v) => v !== value)
    const nextAnswers = { ...answers, [questionId]: next }
    setAnswers(nextAnswers)
    setScenarioZeroAnswers(nextAnswers)
    setScenarioZeroNarrative(buildNarrative(questions, nextAnswers))
  }

  if (!loaded) {
    return (
      <div role="status" aria-busy="true" aria-live="polite" style={{ padding: 'var(--spacing-inset-m)' }}>
        <span style={srOnly}>Caricamento domande in corso</span>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="grid gap-2">
        <label htmlFor="sz-narrative" className="text-[14px] font-semibold text-ink-900">
          Descrivi la situazione attuale rispetto al fabbisogno
        </label>
        <textarea
          id="sz-narrative"
          aria-required="true"
          rows={5}
          className="w-full border border-ink-200 bg-white px-3 py-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
          value={state.scenarioZeroNarrative}
          onChange={(e) => setScenarioZeroNarrative(e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="grid gap-5">
      {questions.map((q) => {
        const isMulti = q.tipo !== 'radio'
        return (
          <fieldset key={q.questionId} className="m-0 overflow-hidden border border-ink-200 bg-white p-0">
            <legend className="float-left w-full border-b border-ink-100 px-5 py-4 text-[14px] font-semibold text-ink-900">
              {q.text}
              <span className="ml-2 text-[12px] font-normal text-ink-400">
                {isMulti ? 'Selezione multipla' : 'Risposta singola'}
              </span>
            </legend>
            <div className="clear-left">
              {q.opzioni.map((o, index) => {
                const isLast = index === q.opzioni.length - 1
                const selected = isMulti
                  ? ((answers[q.questionId] as string[] | undefined) ?? []).includes(o.id)
                  : (answers[q.questionId] as string | undefined) === o.id
                const onClick = isMulti
                  ? () => handleMultiChange(q.questionId, o.id, !selected)
                  : () => handleSingleChange(q.questionId, o.id)
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={onClick}
                    aria-pressed={selected}
                    className={`flex w-full items-center gap-3 px-5 py-4 text-left transition-colors ${
                      isLast ? '' : 'border-b border-ink-100'
                    } ${selected ? 'bg-brand-violet-soft' : 'hover:bg-[#fafafa]'}`}
                  >
                    {isMulti ? (
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
                          selected ? 'border-brand-violet bg-brand-violet text-white' : 'border-ink-400 bg-white'
                        }`}
                      >
                        {selected ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 12.5l4 4L19 7" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : null}
                      </span>
                    ) : (
                      <span
                        className={`docfap-option-indicator flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
                          selected ? 'border-brand-violet' : 'border-ink-400'
                        }`}
                      >
                        {selected ? <span className="docfap-option-indicator block h-2.5 w-2.5 bg-brand-violet" /> : null}
                      </span>
                    )}
                    <span className="text-[14px] text-ink-900">{o.label}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}

const srOnly: CSSProperties = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }
