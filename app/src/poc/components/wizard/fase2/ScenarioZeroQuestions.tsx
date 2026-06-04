import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { getQuestionsForFabbisogno, loadPocData } from '../../../data/poc_docfap/sz_questions_all'
import type { SzQuestion } from '../../../data/poc_docfap/sz_questions_all'
import { useWizard } from '../../../hooks/useWizard'

function CheckMark() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7.2l2.3 2.3L11 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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

  // Sincronizza le risposte locali quando lo store cambia dall'esterno (es. Autoriempi).
  useEffect(() => {
    setAnswers(state.scenarioZeroAnswers)
  }, [state.scenarioZeroAnswers])

  function buildNarrative(
    qs: SzQuestion[],
    ans: Record<string, string | string[]>,
  ): string {
    const fragments: string[] = []
    for (const q of qs) {
      const answer = ans[q.questionId]  // USE questionId not qCode
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
      <div style={freeTextContainerStyle}>
        <label htmlFor="sz-narrative" style={labelStyle}>
          Descrivi la situazione attuale rispetto al fabbisogno
        </label>
        <textarea
          id="sz-narrative"
          aria-required="true"
          rows={5}
          style={textareaStyle}
          value={state.scenarioZeroNarrative}
          onChange={(e) => setScenarioZeroNarrative(e.target.value)}
        />
      </div>
    )
  }

  return (
    <div style={rootStyle}>
      <style>{`.sz-option:focus-within { box-shadow: 0 0 0 2px var(--color-border-focus); }`}</style>
      {questions.map((q) => (
        <fieldset key={q.questionId} style={fieldsetStyle}>
          <legend style={legendStyle}>{q.text}</legend>
          <div style={optionsGridStyle}>
            {q.opzioni.map((o) => {
              const isRadio = q.tipo === 'radio'
              const selected = isRadio
                ? (answers[q.questionId] as string | undefined) === o.id
                : ((answers[q.questionId] as string[] | undefined) ?? []).includes(o.id)
              return (
                <label
                  key={o.id}
                  className="sz-option"
                  style={{ ...optionBoxStyle, ...(selected ? optionBoxSelectedStyle : null) }}
                >
                  <input
                    type={isRadio ? 'radio' : 'checkbox'}
                    name={q.questionId}
                    value={o.id}
                    checked={selected}
                    onChange={(e) =>
                      isRadio
                        ? handleSingleChange(q.questionId, o.id)
                        : handleMultiChange(q.questionId, o.id, e.target.checked)
                    }
                    style={srOnlyInput}
                  />
                  <span
                    aria-hidden="true"
                    style={{ ...indicatorStyle, ...(selected ? indicatorSelectedStyle : null) }}
                  >
                    {selected ? <CheckMark /> : null}
                  </span>
                  <span style={optionLabelStyle}>{o.label}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}

const srOnly: CSSProperties = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }
const srOnlyInput: CSSProperties = { position: 'absolute', opacity: 0, width: 1, height: 1, margin: 0 }
const rootStyle: CSSProperties = { display: 'grid', gap: 'var(--spacing-stack-m)' }
const fieldsetStyle: CSSProperties = { border: '1px solid var(--color-border-secondary-light)', borderRadius: 'var(--radius-smooth)', padding: 'var(--spacing-inset-m)', margin: 0 }
const legendStyle: CSSProperties = { padding: '0 var(--spacing-inline-s)', fontWeight: 600, color: 'var(--color-text-primary)' }
const optionsGridStyle: CSSProperties = { display: 'grid', gap: 'var(--spacing-stack-xs)', marginTop: 'var(--spacing-stack-s)' }
const optionBoxStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-s)',
  padding: '12px var(--spacing-inset-s)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  cursor: 'pointer',
  color: 'var(--color-text-primary)',
}
const optionBoxSelectedStyle: CSSProperties = {
  borderColor: 'var(--color-border-primary)',
  background: 'var(--color-background-primary-lighter)',
}
const indicatorStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  flexShrink: 0,
  border: '1px solid var(--color-border-secondary)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-inverse)',
}
const indicatorSelectedStyle: CSSProperties = {
  background: 'var(--color-background-primary)',
  borderColor: 'var(--color-background-primary)',
}
const optionLabelStyle: CSSProperties = { lineHeight: 1.4 }
const labelStyle: CSSProperties = { display: 'block', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-stack-xs)' }
const textareaStyle: CSSProperties = { width: '100%', padding: 'var(--spacing-inset-s)', border: '1px solid var(--color-border-secondary)', borderRadius: 'var(--radius-smooth)', fontFamily: 'inherit', fontSize: 'inherit', color: 'var(--color-text-primary)', background: 'var(--color-background-inverse)', resize: 'vertical' }
const freeTextContainerStyle: CSSProperties = { display: 'grid' }
