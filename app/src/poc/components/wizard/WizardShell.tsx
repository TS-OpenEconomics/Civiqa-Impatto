import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { getMatrixQuestions } from '../../data/poc_docfap/evaluation_matrix'
import { useWizard } from '../../hooks/useWizard'

/** Exposes wizard navigation actions to deep child components (e.g. Step3_AggiuntaAlternativa). */
export interface WizardNavigationContextValue {
  goToNextPhase: () => void
  goToNextSubStep: () => void
}

export const WizardNavigationContext = createContext<WizardNavigationContextValue>({
  goToNextPhase: () => {},
  goToNextSubStep: () => {},
})

export function useWizardNavigation(): WizardNavigationContextValue {
  return useContext(WizardNavigationContext)
}

const SIDEBAR_WIDTH = 280
const WIZARD_STORAGE_KEY = 'civiqa.wizard.store.v1'

export interface WizardQuestionDefinition {
  title: string
  subtitle: string
  content: ReactNode
  normRef?: string
  /** Quando true il contenuto non è racchiuso nel box bianco centrale. */
  bare?: boolean
}

export interface WizardSubStepDefinition {
  id: string
  title: string
  questions: WizardQuestionDefinition[]
}

export interface WizardPhaseDefinition {
  id: string
  title: string
  substeps: WizardSubStepDefinition[]
}

export interface WizardClosePayload {
  save: boolean
}

interface WizardShellProps {
  phases: WizardPhaseDefinition[]
  onClose?: (payload: WizardClosePayload) => void
  /** Demo prefill for the CURRENT page only (one per page). */
  onAutofill?: (ctx: { phaseIndex: number; subStepId: string }) => void
  /** Indici di fase su cui mostrare il bottone Autoriempi. */
  autofillPhaseIndexes?: number[]
}

interface WizardPosition {
  phaseIndex: number
  subStepIndex: number
  questionIndex: number
}

interface SidebarSubStepGroup {
  firstSubStepIndex: number
  title: string
  count: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function getPhaseSafe(phases: WizardPhaseDefinition[], phaseIndex: number): WizardPhaseDefinition {
  return phases[clamp(phaseIndex, 0, Math.max(0, phases.length - 1))] ?? {
    id: 'fallback-phase',
    title: 'Fase',
    substeps: [],
  }
}

function getSubStepSafe(phase: WizardPhaseDefinition, subStepIndex: number): WizardSubStepDefinition {
  return phase.substeps[clamp(subStepIndex, 0, Math.max(0, phase.substeps.length - 1))] ?? {
    id: 'fallback-substep',
    title: 'Sotto-step',
    questions: [],
  }
}

function getQuestionSafe(subStep: WizardSubStepDefinition, questionIndex: number): WizardQuestionDefinition {
  return subStep.questions[clamp(questionIndex, 0, Math.max(0, subStep.questions.length - 1))] ?? {
    title: 'Domanda',
    subtitle: '',
    content: null,
  }
}

function buildSidebarSubStepGroups(substeps: WizardSubStepDefinition[]): SidebarSubStepGroup[] {
  return substeps.reduce<SidebarSubStepGroup[]>((groups, subStep, subStepIndex) => {
    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.title === subStep.title) {
      lastGroup.count += 1
      return groups
    }

    groups.push({
      firstSubStepIndex: subStepIndex,
      title: subStep.title,
      count: 1,
    })
    return groups
  }, [])
}

function getFocusableElements(root: HTMLElement): HTMLElement[] {
  const nodes = root.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )

  return Array.from(nodes).filter((node) => {
    if (node.getAttribute('aria-hidden') === 'true') return false
    if (node.getAttribute('aria-disabled') === 'true') return false
    return !node.hasAttribute('disabled')
  })
}

function IconSave() {
  return (
    <svg width="24" height="24" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 3h10l2 2v10H3V3zm3 0v4h6V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconList() {
  return (
    <svg width="24" height="24" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 5h10M4 9h10M4 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconHelp() {
  return (
    <svg width="24" height="24" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.8 7.2a1.6 1.6 0 113 1c-.8.7-1.3 1.1-1.3 1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="13" r="0.7" fill="currentColor" />
    </svg>
  )
}

function IconArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M16 10H4M9 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCheckSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7.2l2.3 2.3L11 4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function WizardShell({ phases, onClose, onAutofill, autofillPhaseIndexes }: WizardShellProps) {
  const { state, setStep, completeStep, isStepValid, reset } = useWizard()

  const initialPhaseIndex = clamp(state.currentStep, 0, Math.max(0, phases.length - 1))

  const [position, setPosition] = useState<WizardPosition>({
    phaseIndex: initialPhaseIndex,
    subStepIndex: 0,
    questionIndex: 0,
  })
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false)

  const [openPhaseId, setOpenPhaseId] = useState<string>(() => getPhaseSafe(phases, initialPhaseIndex).id)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const saveAndCloseRef = useRef<HTMLButtonElement>(null)

  const currentPhase = getPhaseSafe(phases, position.phaseIndex)
  const currentSubStep = getSubStepSafe(currentPhase, position.subStepIndex)
  const currentQuestion = getQuestionSafe(currentSubStep, position.questionIndex)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [position.phaseIndex, position.questionIndex, position.subStepIndex])

  useEffect(() => {
    if (!closeConfirmOpen) return
    saveAndCloseRef.current?.focus()
  }, [closeConfirmOpen])

  const handleTrapTab = (event: KeyboardEvent<HTMLElement>) => {
    const container = closeConfirmOpen ? dialogRef.current : rootRef.current
    if (!container) return

    const focusable = getFocusableElements(container)
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement as HTMLElement | null

    if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
      return
    }

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    }
  }

  const handleRootKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      handleTrapTab(event)
      return
    }

    if (event.key === 'Escape' && closeConfirmOpen) {
      event.preventDefault()
      setCloseConfirmOpen(false)
    }
  }

  const requestClose = () => {
    setCloseConfirmOpen(true)
  }

  const finalizeClose = (save: boolean) => {
    if (!save) {
      window.sessionStorage.removeItem(WIZARD_STORAGE_KEY)
      reset()
    }

    setCloseConfirmOpen(false)

    if (onClose) {
      onClose({ save })
      return
    }

    window.location.assign(`${import.meta.env.BASE_URL}impatti/docfap`.replace(/\/\/+/g, '/'))
  }

  const hasPrevious = useMemo(() => {
    if (position.questionIndex > 0) return true
    if (position.subStepIndex > 0) return true
    return position.phaseIndex > 0
  }, [position.phaseIndex, position.questionIndex, position.subStepIndex])

  const hasNext = useMemo(() => {
    const hasMoreQuestions = position.questionIndex < Math.max(0, currentSubStep.questions.length - 1)
    if (hasMoreQuestions) return true

    const hasMoreSubSteps = position.subStepIndex < Math.max(0, currentPhase.substeps.length - 1)
    if (hasMoreSubSteps) return true

    return position.phaseIndex < phases.length - 1
  }, [
    currentPhase.substeps.length,
    currentSubStep.questions.length,
    phases.length,
    position.phaseIndex,
    position.questionIndex,
    position.subStepIndex,
  ])

  const isAtPhaseBoundary =
    position.questionIndex === Math.max(0, currentSubStep.questions.length - 1) &&
    position.subStepIndex === Math.max(0, currentPhase.substeps.length - 1)

  const isPhase1ThemeStep = currentPhase.id === 'fase-1' && currentSubStep.id === 'fase1-tema'
  const isPhase1FabbisognoStep = currentPhase.id === 'fase-1' && currentSubStep.id === 'fase1-fabbisogno'
  const isPhase1CurrentSubStepValid =
    (!isPhase1ThemeStep || (state.temaId ?? '').trim().length > 0) &&
    (!isPhase1FabbisognoStep || (state.fabId ?? '').trim().length > 0)

  const isPhase5MatrixQuestion =
    currentSubStep.id === 'fase5-matrice' &&
    position.questionIndex === 0
  const isPhase5MatrixQuestionValid =
    !isPhase5MatrixQuestion || isStepValid(position.phaseIndex)

  const isCurrentSubStepValid = useMemo(() => {
    if (!isPhase1CurrentSubStepValid) return false
    if (!isPhase5MatrixQuestionValid) return false

    // Sotto-step dinamici di Fase 3 (uno per alternativa): configurazione, costi e nome.
    const altMatch = currentSubStep.id.match(/^fase3-(a[123])-(setup|params|nome)$/)
    if (altMatch) {
      const altId = altMatch[1].toUpperCase() as 'A1' | 'A2' | 'A3'
      const alt = state.alternative[altId]
      if (!alt) return false
      if (altMatch[2] === 'setup') {
        // Lo step setup ora contiene anche il nome (box 2).
        return (
          (alt.categoria ?? '').trim().length > 0 &&
          (alt.tipologia ?? '').trim().length > 0 &&
          (alt.nome ?? '').trim().length > 0
        )
      }
      if (altMatch[2] === 'params') {
        return (alt.capex ?? 0) > 0
      }
      // nome
      return (alt.nome ?? '').trim().length > 0
    }

    switch (currentSubStep.id) {
      case 'fase1-ente':
        return (state.rup.nome ?? '').trim().length > 0
      case 'fase2-problema':
        return (
          (state.problema.descrizione ?? '').trim().length > 0 &&
          (state.urgenza ?? '').trim().length > 0
        )
      case 'fase2-target':
        return true
      case 'fase2-sz-questions':
        return (state.scenarioZeroNarrative ?? '').trim().length > 0
      case 'fase2-q1':
        return true
      case 'fase4-mca': {
        const clusterIds = state.clusterId ? [state.clusterId] : []
        const mcaQuestions = getMatrixQuestions(clusterIds)
        const altIds = state.alternativeDefinite.filter(
          (id): id is 'A1' | 'A2' | 'A3' => id === 'A1' || id === 'A2' || id === 'A3',
        )
        if (mcaQuestions.length === 0 || altIds.length === 0) return true
        return altIds.every((altId) => {
          const scores = state.mcaScores[altId] ?? {}
          return mcaQuestions.every((q) => !!scores[q.qCode])
        })
      }
      case 'fase5-intervento':
        return (state.intervento.denominazione ?? '').trim().length > 0
      case 'fase5-decisione':
        return (state.decisioneRUP?.motivazione ?? '').trim().length > 0
      default:
        return true
    }
  }, [
    currentSubStep.id,
    isPhase1CurrentSubStepValid,
    isPhase5MatrixQuestionValid,
    state.clusterId,
    state.alternative,
    state.alternativeDefinite,
    state.mcaScores,
    state.problema.descrizione,
    state.scenarioZeroNarrative,
    state.urgenza,
    state.rup.nome,
    state.q1Value,
    state.intervento.denominazione,
    state.decisioneRUP,
  ])

  const isCurrentPhaseValid = isStepValid(position.phaseIndex)
  const isNextEnabled = hasNext &&
    isCurrentSubStepValid &&
    (currentPhase.id === 'fase-1' ? true : (!isAtPhaseBoundary || isCurrentPhaseValid))

  const goTo = (nextPosition: WizardPosition) => {
    const safePhase = clamp(nextPosition.phaseIndex, 0, Math.max(0, phases.length - 1))
    const phase = getPhaseSafe(phases, safePhase)
    const safeSubStep = clamp(nextPosition.subStepIndex, 0, Math.max(0, phase.substeps.length - 1))
    const subStep = getSubStepSafe(phase, safeSubStep)
    const safeQuestion = clamp(nextPosition.questionIndex, 0, Math.max(0, subStep.questions.length - 1))

    setPosition({
      phaseIndex: safePhase,
      subStepIndex: safeSubStep,
      questionIndex: safeQuestion,
    })
    setStep(safePhase)
    setOpenPhaseId(phase.id)
  }

  const handlePrevious = () => {
    if (!hasPrevious) return

    if (position.questionIndex > 0) {
      goTo({ ...position, questionIndex: position.questionIndex - 1 })
      return
    }

    if (position.subStepIndex > 0) {
      const previousSubStep = getSubStepSafe(currentPhase, position.subStepIndex - 1)
      goTo({
        ...position,
        subStepIndex: position.subStepIndex - 1,
        questionIndex: Math.max(0, previousSubStep.questions.length - 1),
      })
      return
    }

    const previousPhase = getPhaseSafe(phases, position.phaseIndex - 1)
    const previousPhaseLastSubStepIndex = Math.max(0, previousPhase.substeps.length - 1)
    const previousSubStep = getSubStepSafe(previousPhase, previousPhaseLastSubStepIndex)

    goTo({
      phaseIndex: position.phaseIndex - 1,
      subStepIndex: previousPhaseLastSubStepIndex,
      questionIndex: Math.max(0, previousSubStep.questions.length - 1),
    })
  }

  const handleNext = () => {
    if (!isNextEnabled) return

    if (position.questionIndex < Math.max(0, currentSubStep.questions.length - 1)) {
      goTo({ ...position, questionIndex: position.questionIndex + 1 })
      return
    }

    if (position.subStepIndex < Math.max(0, currentPhase.substeps.length - 1)) {
      goTo({
        ...position,
        subStepIndex: position.subStepIndex + 1,
        questionIndex: 0,
      })
      return
    }

    completeStep(position.phaseIndex)
    goTo({ phaseIndex: position.phaseIndex + 1, subStepIndex: 0, questionIndex: 0 })
  }

  const togglePhase = (phaseId: string) => {
    setOpenPhaseId(phaseId)
  }

  const getCompletedQuestionsCount = (
    phaseIndex: number,
    subStepIndex: number,
    totalQuestions: number,
  ): number => {
    if (phaseIndex < position.phaseIndex) return totalQuestions
    if (phaseIndex > position.phaseIndex) return 0

    if (subStepIndex < position.subStepIndex) return totalQuestions
    if (subStepIndex > position.subStepIndex) return 0

    return position.questionIndex
  }

  const liveMessage = `Step ${position.phaseIndex} di ${Math.max(0, phases.length - 1)}, ${currentSubStep.title}. Domanda ${position.questionIndex + 1} di ${Math.max(1, currentSubStep.questions.length)}.`

  // -- Announce dynamically-added substeps to screen readers --
  const currentPhaseSubstepCount = currentPhase.substeps.length
  const [lastSubstepCount, setLastSubstepCount] = useState(currentPhaseSubstepCount)
  const [substepAnnouncement, setSubstepAnnouncement] = useState('')

  useEffect(() => {
    if (currentPhaseSubstepCount > lastSubstepCount) {
      setSubstepAnnouncement(
        `Nuovi step aggiunti: la navigazione della fase corrente si è aggiornata.`,
      )
      setLastSubstepCount(currentPhaseSubstepCount)
    }
  }, [currentPhaseSubstepCount, lastSubstepCount])

  // -- Navigation context for child steps --
  const goToNextPhase = () => {
    completeStep(position.phaseIndex)
    goTo({ phaseIndex: position.phaseIndex + 1, subStepIndex: 0, questionIndex: 0 })
  }

  const goToNextSubStep = () => {
    if (position.questionIndex < Math.max(0, currentSubStep.questions.length - 1)) {
      goTo({ ...position, questionIndex: position.questionIndex + 1 })
      return
    }

    if (position.subStepIndex < Math.max(0, currentPhase.substeps.length - 1)) {
      goTo({
        ...position,
        subStepIndex: position.subStepIndex + 1,
        questionIndex: 0,
      })
      return
    }

    goToNextPhase()
  }

  const isIntroPhase = currentPhase.id === 'fase-0'
  const isCompletionStep = currentSubStep.id === 'fase5-completamento'
  const nextButtonLabel = isIntroPhase ? 'Inizia la configurazione' : 'Vai allo step successivo'
  const shellPhaseStyle = isIntroPhase ? introShellStyle : shellStyle
  const showAutofill = !!onAutofill && !isIntroPhase && (autofillPhaseIndexes ?? []).includes(position.phaseIndex)
  const visibleSidebarPhases = useMemo(() => phases.filter((phase) => phase.id !== 'fase-0'), [phases])

  // Completion is shown full screen (no sidebar/header/footer chrome), like the
  // Valutazione CompletionScreen — the step renders its own centered layout.
  if (isCompletionStep) {
    return <div style={fullScreenStepStyle}>{currentQuestion.content}</div>
  }

  return (
    <WizardNavigationContext.Provider value={{ goToNextPhase, goToNextSubStep }}>
    <div
      ref={rootRef}
      style={shellPhaseStyle}
      role="dialog"
      aria-modal="true"
      aria-label="Wizard DOCFAP"
      onKeyDown={handleRootKeyDown}
    >
      <style>{`
        .wizard-shell-interactive:focus-visible {
          outline: none;
          box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
        }
      `}</style>

      {!isIntroPhase && (
        <aside style={sidebarStyle} aria-label="Struttura wizard DOCFAP">
          <nav style={sidebarNavStyle}>
            <div role="list" style={phaseListStyle}>
              <div aria-hidden="true" style={phaseRailTrackStyle} />
              {visibleSidebarPhases.map((phase) => {
                const phaseIndex = phases.findIndex((candidate) => candidate.id === phase.id)
                const isCurrentPhase = phaseIndex === position.phaseIndex
                const isCompletedPhase = phaseIndex < position.phaseIndex
                const isFuturePhase = phaseIndex > position.phaseIndex
                const isPhaseOpen = !isFuturePhase
                const isLastPhase = phaseIndex === phases.length - 1
                // Avanzamento della barra dentro la fase corrente: parte ~a metà e
                // avanza con i sotto-step; le fasi completate hanno la barra piena.
                const currentRailFraction = Math.min(
                  0.95,
                  (position.subStepIndex + 0.5) / Math.max(1, phase.substeps.length),
                )

                return (
                  <section key={phase.id} role="listitem" style={phaseSectionStyle}>
                    {isCompletedPhase || (isCurrentPhase && !isLastPhase) ? (
                      <div
                        aria-hidden="true"
                        style={{
                          ...phaseRailConnectorStyle,
                          transformOrigin: 'top center',
                          transform: `scaleY(${isCompletedPhase ? 1 : currentRailFraction})`,
                        }}
                      />
                    ) : null}
                    <div style={phaseHeaderStyle}>
                      <div style={phaseTimelineColStyle} aria-hidden="true">
                        <span
                          className="wz-phase-dot"
                          style={{
                            ...phaseDotStyle,
                            ...(isCurrentPhase ? phaseDotCurrentStyle : null),
                            ...(isCompletedPhase ? phaseDotCompletedStyle : null),
                            ...(isFuturePhase ? phaseDotFutureStyle : null),
                          }}
                        >
                          {isCompletedPhase ? <IconCheckSmall /> : null}
                        </span>
                      </div>

                      <div
                        style={{
                          ...phaseToggleStyle,
                          ...(isCurrentPhase ? phaseToggleCurrentStyle : null),
                          ...(isFuturePhase ? phaseToggleFutureStyle : null),
                        }}
                      >
                        <span style={phaseTitleRowStyle}>
                          <span>{phase.title}</span>
                        </span>
                      </div>
                    </div>

                    {isPhaseOpen ? (
                      <ul style={subStepListStyle}>
                        {buildSidebarSubStepGroups(phase.substeps).map((group) => {
                          const lastSubStepIndex = group.firstSubStepIndex + group.count - 1
                          const isCurrentSubStep =
                            isCurrentPhase &&
                            position.subStepIndex >= group.firstSubStepIndex &&
                            position.subStepIndex <= lastSubStepIndex
                          const completedSteps = isCompletedPhase
                            ? group.count
                            : isFuturePhase
                              ? 0
                              : Array.from({ length: group.count }, (_, offset) => group.firstSubStepIndex + offset)
                                  .filter((idx) => idx < position.subStepIndex).length
                          const isCompletedSubStep = completedSteps >= group.count
                          const canNavigate =
                            isCompletedPhase ||
                            (isCurrentPhase && group.firstSubStepIndex <= position.subStepIndex)

                          return (
                            <li key={`${phase.id}-${group.firstSubStepIndex}-${group.title}`} style={subStepItemStyle}>
                              <button
                                type="button"
                                className="wizard-shell-interactive"
                                onClick={() => goTo({ phaseIndex, subStepIndex: group.firstSubStepIndex, questionIndex: 0 })}
                                disabled={!canNavigate}
                                aria-current={isCurrentSubStep ? 'step' : undefined}
                                style={{
                                  ...subStepButtonStyle,
                                  ...(isCurrentSubStep ? subStepButtonCurrentStyle : null),
                                  ...(isCompletedSubStep ? subStepButtonCompletedStyle : null),
                                  ...(!canNavigate ? subStepButtonDisabledStyle : null),
                                }}
                              >
                                <span style={subStepTitleStyle}>{group.title}</span>
                                <span
                                  role="progressbar"
                                  aria-valuemin={0}
                                  aria-valuemax={group.count}
                                  aria-valuenow={Math.min(completedSteps, group.count)}
                                  style={subStepSegmentedTrackStyle}
                                >
                                  {Array.from({ length: group.count }, (_, offset) => {
                                    const idx = group.firstSubStepIndex + offset
                                    const filled = isCompletedPhase || (isCurrentPhase && idx < position.subStepIndex)
                                    const isCurrentSeg = isCurrentPhase && idx === position.subStepIndex
                                    return (
                                      <span
                                        key={offset}
                                        style={{
                                          ...subStepSegmentStyle,
                                          background: filled
                                            ? 'var(--color-background-primary)'
                                            : isCurrentSeg
                                              ? 'linear-gradient(to right, var(--color-background-primary) 50%, var(--color-border-secondary-light) 50%)'
                                              : 'var(--color-border-secondary-light)',
                                        }}
                                      />
                                    )
                                  })}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    ) : null}
                  </section>
                )
              })}
            </div>
          </nav>
        </aside>
      )}

      <section style={isIntroPhase ? contentColumnIntroStyle : contentColumnRegularStyle}>
        <header style={headerBarStyle}>
          <div style={headerActionsStyle}>
            <button
              type="button"
              onClick={() => finalizeClose(true)}
              className="flex items-center gap-2 border border-ink-200 px-4 py-2 text-[13px] font-semibold text-ink-700 transition-colors hover:border-brand-violet hover:text-brand-violet"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 4h11l3 3v13a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 4v5h7M8 21v-6h8v6" />
              </svg>
              Salva bozza
            </button>
            <button
              type="button"
              onClick={requestClose}
              className="flex items-center gap-2 text-[14px] font-semibold text-brand-violet"
            >
              Chiudi e torna al Docfap
              <span aria-hidden="true" className="text-[20px] leading-none">&times;</span>
            </button>
          </div>
        </header>

        <main
          id="wizard-main-content"
          style={isIntroPhase ? mainAreaIntroStyle : mainAreaStyle}
        >
          <div aria-live="polite" style={srOnlyStyle}>
            {liveMessage}
          </div>
          {substepAnnouncement && (
            <div aria-live="polite" aria-atomic="true" style={srOnlyStyle}>
              {substepAnnouncement}
            </div>
          )}

          <div style={isIntroPhase ? introMainContentStyle : mainAreaContentStyle}>
            {showAutofill && (
              <div style={autofillRowStyle}>
                <button
                  type="button"
                  className="wizard-shell-interactive"
                  onClick={() => onAutofill?.({ phaseIndex: position.phaseIndex, subStepId: currentSubStep.id })}
                  style={autofillButtonStyle}
                >
                  Autoriempi questa pagina
                </button>
              </div>
            )}
            <article
              style={{
                ...questionCardStyle,
                ...(isIntroPhase ? questionCardIntroStyle : questionCardRegularStyle),
              }}
            >
              <div style={questionHeaderRowStyle}>
                <div
                  style={{
                    ...questionHeaderBlockStyle,
                    ...(isIntroPhase ? questionHeaderIntroStyle : questionHeaderStickyStyle),
                  }}
                >
                  <h2
                    ref={headingRef}
                    tabIndex={-1}
                    style={{
                      ...questionHeadingStyle,
                      ...(isIntroPhase ? questionHeadingIntroStyle : null),
                    }}
                  >
                    {currentQuestion.title}
                  </h2>
                  <p
                    style={{
                      ...questionSubtitleStyle,
                      ...(isIntroPhase ? questionSubtitleIntroStyle : null),
                    }}
                  >
                    {currentQuestion.subtitle}
                  </p>
                  {currentQuestion.normRef && !isIntroPhase && (
                    <span style={normRefBadgeStyle} aria-label={`Riferimento normativo: D.Lgs. 36/2023 Allegato I.7 — ${currentQuestion.normRef}`}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                        <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M3.5 4h5M3.5 6h5M3.5 8h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                      <span>D.Lgs. 36/2023 · All. I.7 · {currentQuestion.normRef}</span>
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  ...questionBodyStyle,
                  ...(isIntroPhase ? questionBodyIntroStyle : null),
                  ...(isCompletionStep ? questionBodyCompletionStyle : null),
                  ...(currentQuestion.bare ? questionBodyBareStyle : null),
                }}
              >
                {currentQuestion.content}
              </div>
            </article>
          </div>
        </main>

        <footer role="navigation" aria-label="Navigazione wizard" style={footerStyle}>
          <button
            type="button"
            className="wizard-shell-interactive"
            onClick={handlePrevious}
            aria-disabled={!hasPrevious}
            style={{
              ...backButtonStyle,
              visibility: hasPrevious ? 'visible' : 'hidden',
              ...(!hasPrevious ? navButtonDisabledStyle : null),
            }}
          >
            <span>Torna allo step precedente</span>
            <IconArrowLeft />
          </button>

          <button
            type="button"
            className="wizard-shell-interactive"
            onClick={handleNext}
            disabled={!isNextEnabled}
            aria-disabled={!isNextEnabled}
            style={{
              ...nextButtonStyle,
              ...(isIntroPhase ? nextButtonIntroStyle : null),
              ...(isNextEnabled ? navButtonPrimaryStyle : navButtonDisabledStyle),
            }}
          >
            <span>{nextButtonLabel}</span>
            <IconArrowRight />
          </button>
        </footer>
      </section>

      {closeConfirmOpen && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/40 px-4">
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="wizard-close-title"
            aria-describedby="wizard-close-desc"
            className="w-full max-w-md border border-ink-100 bg-white p-6 shadow-xl"
          >
            <h3 id="wizard-close-title" className="text-[18px] font-bold text-ink-900">
              Vuoi salvare i progressi prima di uscire?
            </h3>
            <p id="wizard-close-desc" className="mt-2 text-[14px] leading-[1.5] text-ink-600">
              Puoi salvare la bozza corrente tra i tuoi Docfap, uscire senza salvare oppure annullare e continuare la compilazione.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                ref={saveAndCloseRef}
                type="button"
                onClick={() => finalizeClose(true)}
                className="flex items-center justify-center gap-2 bg-brand-violet px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-violet-dark"
              >
                Salva bozza ed esci
              </button>
              <button
                type="button"
                onClick={() => finalizeClose(false)}
                className="px-5 py-2.5 text-[14px] font-semibold text-ink-700 transition-colors hover:text-brand-violet"
              >
                Esci senza salvare
              </button>
              <button
                type="button"
                onClick={() => setCloseConfirmOpen(false)}
                className="px-5 py-2.5 text-[14px] font-medium text-ink-500 transition-colors hover:text-ink-900"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </WizardNavigationContext.Provider>
  )
}

const shellStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 200,
  display: 'grid',
  gridTemplateColumns: `${SIDEBAR_WIDTH}px minmax(0, 1fr)`,
  height: '100vh',
  boxSizing: 'border-box',
  paddingTop: '64px',
  paddingBottom: '56px',
  background: 'var(--color-background-secondary-light)',
  overflow: 'hidden',
}

const introShellStyle: CSSProperties = {
  ...shellStyle,
  gridTemplateColumns: 'minmax(0, 1fr)',
}

const sidebarStyle: CSSProperties = {
  borderRight: '2px solid var(--color-border-secondary-light)',
  background: 'var(--color-background-inverse)',
  overflowY: 'auto',
  minHeight: 0,
}

const sidebarNavStyle: CSSProperties = {
  padding: 'var(--spacing-inset-s) var(--spacing-inset-s) 120px 22px',
}

const phaseListStyle: CSSProperties = {
  position: 'relative',
  display: 'grid',
  gap: 0,
}

const phaseSectionStyle: CSSProperties = {
  position: 'relative',
  display: 'grid',
  gap: 'var(--spacing-stack-xxs, 4px)',
}

const phaseHeaderStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '24px minmax(0, 1fr)',
  columnGap: '12px',
  alignItems: 'start',
  padding: '12px 0',
}

const phaseTimelineColStyle: CSSProperties = {
  display: 'grid',
  justifyItems: 'center',
  alignSelf: 'stretch',
  zIndex: 1,
}

const phaseDotStyle: CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: '2px solid var(--color-background-primary)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-primary-light)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const phaseDotFutureStyle: CSSProperties = {
  borderColor: 'var(--color-border-secondary-light)',
  background: 'var(--color-background-inverse)',
}

const phaseDotCurrentStyle: CSSProperties = {
  borderColor: 'var(--color-background-primary)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
}

const phaseDotCompletedStyle: CSSProperties = {
  borderColor: 'var(--color-background-primary)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
}

const phaseToggleStyle: CSSProperties = {
  width: '100%',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  padding: 0,
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xxs-size, 12px)',
  lineHeight: 1.2,
  fontWeight: 'var(--type-weight-medium, 500)',
}

const phaseToggleCurrentStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
  fontWeight: 'var(--type-weight-bold, 700)',
}

const phaseToggleFutureStyle: CSSProperties = {
  color: 'var(--color-text-disable)',
}

const phaseTitleRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '8px',
  whiteSpace: 'nowrap',
}

const subStepListStyle: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: 0,
}

const subStepItemStyle: CSSProperties = {
  marginLeft: '32px',
}

const subStepButtonStyle: CSSProperties = {
  width: '100%',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  padding: '6px 0 10px',
  color: 'var(--color-text-primary-light)',
  display: 'grid',
  gap: '8px',
}

const subStepButtonCurrentStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
}

const subStepButtonCompletedStyle: CSSProperties = {
  color: 'var(--color-text-secondary)',
}

const subStepButtonDisabledStyle: CSSProperties = {
  cursor: 'default',
  pointerEvents: 'none',
  color: 'var(--color-text-disable)',
}

const subStepTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xxs-size, 12px)',
  lineHeight: 1.2,
  fontWeight: 'var(--type-weight-regular, 400)',
  whiteSpace: 'nowrap',
}

const subStepSegmentedTrackStyle: CSSProperties = {
  display: 'flex',
  gap: '2px',
  width: '100%',
}

const subStepSegmentStyle: CSSProperties = {
  height: '3px',
  flex: '1',
  borderRadius: 0,
}

const phaseRailTrackStyle: CSSProperties = {
  position: 'absolute',
  top: '24px',
  bottom: '24px',
  left: '12px',
  width: '2px',
  background: 'var(--color-border-secondary-light)',
  transformOrigin: 'top center',
  zIndex: 0,
}

// Connettore viola disegnato per-fase: parte dal pallino della fase completata e
// arriva esattamente al pallino della fase successiva (top 24px = centro pallino,
// bottom -24px = centro pallino della sezione sotto). Sostituisce la vecchia barra
// unica scalata con scaleY, che con 5 fasi di altezza diversa non raggiungeva il
// pallino corrente.
const phaseRailConnectorStyle: CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '24px',
  bottom: '-24px',
  width: '2px',
  background: 'var(--color-background-primary)',
  zIndex: 0,
}

const contentColumnStyle: CSSProperties = {
  width: '100%',
  maxWidth: '1120px',
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  minHeight: 0,
}

const contentColumnRegularStyle: CSSProperties = {
  ...contentColumnStyle,
  // Riempie l'intera colonna 1fr: l'area scrollabile (e la sua barra) arriva al
  // bordo destro della pagina, come nel wizard di valutazione. Il contenuto resta
  // centrato grazie al maxWidth interno (mainAreaContentStyle).
  maxWidth: 'none',
  justifySelf: 'stretch',
}

const autofillRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
}

const contentColumnIntroStyle: CSSProperties = {
  ...contentColumnStyle,
  maxWidth: 'min(1360px, calc(100vw - 64px))',
  justifySelf: 'center',
}

const headerBarStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '64px',
  zIndex: 210,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '0 var(--spacing-inset-m)',
  background: 'var(--color-background-inverse)',
  borderBottom: '2px solid var(--color-background-accent)',
}

const headerActionsStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-xs)',
}

const saveDraftButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  border: '1px solid var(--color-border-secondary-light)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: '8px 16px',
  fontFamily: 'var(--font-family-1, sans-serif)',
  fontSize: 'var(--type-body-xs-size, 13px)',
  fontWeight: 'var(--type-weight-bold, 700)',
  cursor: 'pointer',
}

const closeButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: 'var(--color-text-secondary)',
  fontFamily: 'var(--font-family-1, sans-serif)',
  fontSize: 'var(--type-body-s-size, 14px)',
  fontWeight: 'var(--type-weight-bold, 700)',
  padding: 0,
}

const mainAreaStyle: CSSProperties = {
  overflowY: 'auto',
  // height (non minHeight): vincola l'area di scroll così scrolla INTERNAMENTE e
  // il paddingBottom resta visibile sopra il footer fisso. Con minHeight l'area
  // cresceva col contenuto e il footer ne copriva il fondo (gap "mangiato").
  height: 'calc(100vh - 64px - 56px)',
  padding: '32px clamp(36px, 4vw, 64px) 24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
}

const mainAreaIntroStyle: CSSProperties = {
  ...mainAreaStyle,
  padding: '24px clamp(28px, 3vw, 48px) 24px',
  alignItems: 'center',
}

const introMainContentStyle: CSSProperties = {
  width: '100%',
  maxWidth: 'min(1280px, calc(100vw - 96px))',
  margin: '0 auto',
  display: 'grid',
  justifyItems: 'center',
  gap: 'clamp(20px, 2.4vh, 32px)',
}

const mainAreaContentStyle: CSSProperties = {
  width: '100%',
  maxWidth: '880px',
  // minHeight (non height): col contenuto che trabocca, height:100% lasciava il
  // paddingBottom a metà scroll → l'ultima card finiva incollata al footer.
  minHeight: '100%',
  margin: '0 auto',
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  justifyItems: 'stretch',
  alignContent: 'start',
  // Spazio extra in fondo: scrollando, l'ultima sezione non resta incollata
  // alla barra dei bottoni fissa in basso.
  paddingBottom: '64px',
}

const questionCardStyle: CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
  alignContent: 'start',
}

const questionCardIntroStyle: CSSProperties = {
  gap: 'var(--spacing-stack-m)',
}

const questionCardRegularStyle: CSSProperties = {
  paddingTop: '16px',
}

const questionHeaderRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 'var(--spacing-inline-m)',
  width: '100%',
  flexWrap: 'wrap',
}

const autofillButtonStyle: CSSProperties = {
  border: '1px solid var(--color-border-primary)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-secondary)',
  borderRadius: 'var(--radius-smooth)',
  padding: '8px 16px',
  fontFamily: 'var(--font-family-1, sans-serif)',
  fontSize: 'var(--type-body-xs-size, 13px)',
  fontWeight: 'var(--type-weight-bold, 700)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  alignSelf: 'flex-start',
}

const questionHeaderBlockStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xxs, 4px)',
  flex: 1,
  minWidth: 0,
}

const questionHeaderStickyStyle: CSSProperties = {
  position: 'static',
  background: 'transparent',
  padding: '12px 0 var(--spacing-stack-xs)',
}

const questionHeaderIntroStyle: CSSProperties = {
  gap: 'var(--spacing-stack-xs)',
}

const questionHeadingStyle: CSSProperties = {
  margin: 0,
  outline: 'none', // h2 riceve focus programmatico (a11y) → niente riquadro nero
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  // Allineato al QuestionHeader di Valutazione (22px bold), non più 32px.
  fontSize: '22px',
  fontWeight: 'var(--type-weight-bold, 700)',
  lineHeight: 1.2,
}

const questionHeadingIntroStyle: CSSProperties = {
  textAlign: 'center',
  fontSize: 'var(--type-heading-l-size, 40px)',
}

const normRefBadgeStyle: CSSProperties = {
  // Riferimento normativo reso discreto (Valutazione non ha pill colorate):
  // testo piccolo, grigio, senza riempimento/bordo viola.
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: 0,
  background: 'transparent',
  border: 'none',
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.02em',
  userSelect: 'none',
  whiteSpace: 'nowrap',
}

const questionSubtitleStyle: CSSProperties = {
  margin: 0,
  // Allineato a Valutazione: descrizione 14px, testo primario.
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: '14px',
  lineHeight: 1.5,
}

const questionSubtitleIntroStyle: CSSProperties = {
  textAlign: 'center',
  maxWidth: '900px',
  justifySelf: 'center',
}

const questionBodyStyle: CSSProperties = {
  padding: 'var(--spacing-inset-m)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
}

const questionBodyIntroStyle: CSSProperties = {
  padding: 0,
  border: 'none',
  background: 'transparent',
}

const questionBodyCompletionStyle: CSSProperties = {
  padding: 0,
  border: 'none',
  background: 'transparent',
}

const questionBodyBareStyle: CSSProperties = {
  padding: 0,
  border: 'none',
  background: 'transparent',
}

const fullScreenStepStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 200,
  overflowY: 'auto',
  background: 'var(--color-background-secondary-light)',
}

const footerStyle: CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: '56px',
  zIndex: 210,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  alignItems: 'center',
  gap: 0,
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
  background: 'transparent',
}

const backButtonStyle: CSSProperties = {
  height: '56px',
  width: '100%',
  border: 'none',
  background: 'transparent',
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 'var(--type-weight-medium, 500)',
  cursor: 'pointer',
  padding: '0 28px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  textAlign: 'left',
}

const nextButtonStyle: CSSProperties = {
  height: '56px',
  width: '100%',
  borderRadius: 0,
  border: '1px solid transparent',
  padding: '0 28px',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 'var(--type-weight-medium, 500)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
}

const nextButtonIntroStyle: CSSProperties = {
  height: '56px',
}

const navButtonPrimaryStyle: CSSProperties = {
  color: 'var(--color-text-inverse)',
  background: 'var(--color-background-primary)',
  borderColor: 'var(--color-background-primary)',
}

const navButtonDisabledStyle: CSSProperties = {
  color: 'var(--color-text-disable)',
  background: 'linear-gradient(90deg, var(--color-background-disable) 0%, rgba(255, 255, 255, 0.92) 100%)',
  borderColor: 'var(--color-background-disable)',
  pointerEvents: 'none',
}

const confirmBackdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 220,
}

const confirmDialogStyle: CSSProperties = {
  width: 'min(560px, calc(100vw - 32px))',
  background: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: 'var(--spacing-inset-m)',
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const confirmTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
}

const confirmTextStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
}

const confirmActionsStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--spacing-inline-xs)',
}

const confirmPrimaryStyle: CSSProperties = {
  minHeight: '40px',
  border: '1px solid var(--color-background-primary)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  padding: '0 var(--spacing-inset-s)',
  cursor: 'pointer',
  fontWeight: 700,
}

const confirmDangerStyle: CSSProperties = {
  minHeight: '40px',
  border: '1px solid var(--color-border-error)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-error-lighter)',
  color: 'var(--color-text-error)',
  padding: '0 var(--spacing-inset-s)',
  cursor: 'pointer',
  fontWeight: 700,
}

const confirmNeutralStyle: CSSProperties = {
  minHeight: '40px',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary)',
  padding: '0 var(--spacing-inset-s)',
  cursor: 'pointer',
  fontWeight: 700,
}

const srOnlyStyle: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}



