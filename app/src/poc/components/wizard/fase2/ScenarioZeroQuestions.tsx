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
      {questions.map((q) => (
        <fieldset key={q.questionId} style={fieldsetStyle}>
          <legend style={legendStyle}>{q.text}</legend>
          {q.tipo === 'radio' ? (
            <div style={optionsGridStyle}>
              {q.opzioni.map((o) => (
                <label key={o.id} style={radioLabelStyle}>
                  <input
                    type="radio"
                    name={q.questionId}
                    value={o.id}
                    checked={(answers[q.questionId] as string | undefined) === o.id}
                    onChange={() => handleSingleChange(q.questionId, o.id)}
                    style={inputStyle}
                  />
                  {o.label}
                </label>
              ))}
            </div>
          ) : (
            <div style={optionsGridStyle}>
              {q.opzioni.map((o) => {
                const selected = (answers[q.questionId] as string[] | undefined) ?? []
                return (
                  <label key={o.id} style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      value={o.id}
                      checked={selected.includes(o.id)}
                      onChange={(e) => handleMultiChange(q.questionId, o.id, e.target.checked)}
                      style={inputStyle}
                    />
                    {o.label}
                  </label>
                )
              })}
            </div>
          )}
        </fieldset>
      ))}
    </div>
  )
}

const srOnly: CSSProperties = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }
const rootStyle: CSSProperties = { display: 'grid', gap: 'var(--spacing-stack-m)' }
const fieldsetStyle: CSSProperties = { border: '1px solid var(--color-border-secondary-light)', borderRadius: 'var(--radius-smooth)', padding: 'var(--spacing-inset-m)', margin: 0 }
const legendStyle: CSSProperties = { padding: '0 var(--spacing-inline-s)', fontWeight: 600, color: 'var(--color-text-primary)' }
const optionsGridStyle: CSSProperties = { display: 'grid', gap: 'var(--spacing-stack-xs)', marginTop: 'var(--spacing-stack-s)' }
const radioLabelStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-inline-s)', cursor: 'pointer', color: 'var(--color-text-primary)' }
const checkboxLabelStyle: CSSProperties = { ...radioLabelStyle }
const inputStyle: CSSProperties = { accentColor: 'var(--color-background-primary)', width: 16, height: 16 }
const labelStyle: CSSProperties = { display: 'block', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-stack-xs)' }
const textareaStyle: CSSProperties = { width: '100%', padding: 'var(--spacing-inset-s)', border: '1px solid var(--color-border-secondary)', borderRadius: 'var(--radius-smooth)', fontFamily: 'inherit', fontSize: 'inherit', color: 'var(--color-text-primary)', background: 'var(--color-background-inverse)', resize: 'vertical' }
const freeTextContainerStyle: CSSProperties = { display: 'grid' }
