import type { CSSProperties, ReactNode } from 'react'
import { useMemo } from 'react'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import { getValutazioneStepMeta, getValutazioneWizardPhases } from './structure'

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

interface Props {
  children: ReactNode
  onNext: () => void
  onBack: () => void
  onClose: () => void
  nextDisabled?: boolean
  nextLabel?: string
  backLabel?: string
  hideBack?: boolean
  onGoToStep?: (step: number) => void
}

export function ValutazioneWizardLayout({
  children,
  onNext,
  onBack,
  onClose,
  nextDisabled = false,
  nextLabel = 'Vai allo step successivo',
  backLabel = 'Torna allo step precedente',
  hideBack = false,
  onGoToStep,
}: Props) {
  const { currentStep } = useValutazioneWizard()
  const phases = useMemo(() => getValutazioneWizardPhases(), [])
  const currentMeta = getValutazioneStepMeta(currentStep)
  const isIntroStep = currentStep === 1
  const currentPhaseIndex = phases.findIndex((phase) => phase.id === currentMeta.phaseId)
  const railProgress =
    phases.length <= 1
      ? 1
      : Math.max(0, Math.min(1, currentPhaseIndex / (phases.length - 1)))

  const accessibleStepCount = phases.flatMap((phase) => phase.substeps.flatMap((substep) => substep.steps)).length
  const stepAriaLabel = `Step ${currentStep} di ${accessibleStepCount}, ${currentMeta.substepTitle}`

  return (
    <div
      style={isIntroStep ? shellIntroStyle : shellStyle}
      role="dialog"
      aria-modal="true"
      aria-label="Wizard valutazione"
    >
      <style>{INTERACTIVE_STYLES}</style>

      {!isIntroStep && (
        <aside style={sidebarStyle} aria-label="Struttura wizard valutazione">
          <nav style={sidebarNavStyle}>
            <div role="list" style={phaseListStyle}>
              <div aria-hidden="true" style={sidebarRailStyle} />
              <div
                aria-hidden="true"
                style={{
                  ...sidebarRailActiveStyle,
                  transform: `scaleY(${railProgress})`,
                }}
              />
              {phases.map((phase) => {
                const phaseFirstStep = phase.substeps[0]?.steps[0]?.step ?? 1
                const phaseLastStep = phase.substeps.at(-1)?.steps.at(-1)?.step ?? phaseFirstStep
                const isCurrentPhase = phase.id === currentMeta.phaseId
                const isCompletedPhase = currentStep > phaseLastStep
                const isFuturePhase = currentStep < phaseFirstStep
                const isPhaseOpen = !isFuturePhase

                return (
                  <section key={phase.id} role="listitem" style={phaseSectionStyle}>
                    <div style={phaseHeaderStyle}>
                      <div style={phaseTimelineColStyle} aria-hidden="true">
                        <span
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
                        <span style={phaseTitleRowStyle}>{phase.title}</span>
                      </div>
                    </div>

                    {isPhaseOpen ? (
                      <ul style={subStepListStyle}>
                        {phase.substeps.map((substep) => {
                          const firstStep = substep.steps[0]?.step ?? phaseFirstStep
                          const lastStep = substep.steps.at(-1)?.step ?? firstStep
                          const isCurrentSubstep = currentMeta.substepId === substep.id
                          const completedSteps =
                            currentStep > lastStep
                              ? substep.steps.length
                              : currentStep < firstStep
                                ? 0
                                : substep.steps.filter((step) => step.step < currentStep).length
                          const isCompletedSubstep = completedSteps >= substep.steps.length

                          const canNavigate = Boolean(onGoToStep) && firstStep <= currentStep

                          return (
                            <li key={substep.id} style={subStepItemStyle}>
                              <button
                                type="button"
                                className="wizard-shell-interactive"
                                onClick={() => onGoToStep?.(firstStep)}
                                disabled={!canNavigate}
                                aria-current={isCurrentSubstep ? 'step' : undefined}
                                style={{
                                  ...subStepButtonStyle,
                                  ...(isCurrentSubstep ? subStepButtonCurrentStyle : null),
                                  ...(isCompletedSubstep ? subStepButtonCompletedStyle : null),
                                  ...(!canNavigate ? subStepButtonDisabledStyle : null),
                                }}
                              >
                                <span style={subStepTitleStyle}>{substep.title}</span>
                                <span
                                  role="progressbar"
                                  aria-valuemin={0}
                                  aria-valuemax={substep.steps.length}
                                  aria-valuenow={Math.min(completedSteps, substep.steps.length)}
                                  style={subStepSegmentedTrackStyle}
                                >
                                  {substep.steps.map((step) => (
                                    <span
                                      key={step.step}
                                      style={{
                                        ...subStepSegmentStyle,
                                        background:
                                          step.step < currentStep
                                            ? 'var(--color-background-primary)'
                                            : 'var(--color-border-secondary-light)',
                                      }}
                                    />
                                  ))}
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

      <section style={isIntroStep ? contentColumnIntroStyle : contentColumnRegularStyle}>
        <header style={headerBarStyle}>
          <div style={headerActionsStyle}>
            {!isIntroStep && (
              <>
                <button type="button" className="wizard-shell-interactive" style={utilityButtonStyle} aria-label="Salva bozza">
                  <IconSave />
                </button>
                <button type="button" className="wizard-shell-interactive" style={utilityButtonStyle} aria-label="Indice step">
                  <IconList />
                </button>
                <button type="button" className="wizard-shell-interactive" style={utilityButtonStyle} aria-label="Supporto">
                  <IconHelp />
                </button>
              </>
            )}
            <button
              type="button"
              className="wizard-shell-interactive"
              onClick={onClose}
              style={closeButtonStyle}
            >
              Torna a valutazione
            </button>
          </div>
        </header>

        <main style={isIntroStep ? mainAreaIntroStyle : mainAreaStyle} id="valutazione-wizard-main">
          <div aria-live="polite" style={srOnlyStyle}>
            {stepAriaLabel}
          </div>
          <div style={isIntroStep ? introMainContentStyle : mainAreaContentStyle}>{children}</div>
        </main>

        <footer role="navigation" aria-label="Navigazione wizard" style={isIntroStep ? footerIntroStyle : footerStyle}>
          {!isIntroStep ? (
            <button
              type="button"
              className="wizard-shell-interactive"
              onClick={onBack}
              aria-disabled={hideBack}
              style={{
                ...backButtonStyle,
                visibility: hideBack ? 'hidden' : 'visible',
                ...(hideBack ? navButtonDisabledStyle : null),
              }}
            >
              <span>{backLabel}</span>
              <IconArrowLeft />
            </button>
          ) : (
            <div aria-hidden="true" />
          )}

          <button
            type="button"
            className="wizard-shell-interactive"
            onClick={onNext}
            aria-disabled={nextDisabled}
            style={{
              ...nextButtonStyle,
              ...(isIntroStep ? nextButtonIntroStyle : null),
              ...(nextDisabled ? navButtonDisabledStyle : navButtonPrimaryStyle),
            }}
          >
            <span>{isIntroStep ? 'Inizia la configurazione' : nextLabel}</span>
            <IconArrowRight />
          </button>
        </footer>
      </section>
    </div>
  )
}

const INTERACTIVE_STYLES = `
  .wizard-shell-interactive:focus-visible {
    outline: none;
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
  }
`

const SIDEBAR_WIDTH = 280

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

const shellIntroStyle: CSSProperties = {
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

const sidebarRailStyle: CSSProperties = {
  position: 'absolute',
  top: '24px',
  bottom: '24px',
  left: '12px',
  width: '2px',
  background: 'var(--color-border-secondary-light)',
  transformOrigin: 'top center',
}

const sidebarRailActiveStyle: CSSProperties = {
  ...sidebarRailStyle,
  background: 'var(--color-background-primary)',
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
  borderRadius: 'var(--radius-circle)',
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

const contentColumnStyle: CSSProperties = {
  width: '100%',
  maxWidth: '1120px',
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  minHeight: 0,
}

const contentColumnRegularStyle: CSSProperties = {
  ...contentColumnStyle,
  maxWidth: 'min(1280px, calc(100vw - 64px))',
  justifySelf: 'stretch',
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

const utilityButtonStyle: CSSProperties = {
  width: '40px',
  height: '40px',
  border: '1px solid var(--color-border-secondary-light)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary-light)',
  borderRadius: 'var(--radius-smooth)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

const closeButtonStyle: CSSProperties = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: 'var(--color-text-secondary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 'var(--type-weight-medium, 500)',
  padding: 0,
}

const mainAreaStyle: CSSProperties = {
  overflow: 'hidden',
  minHeight: 'calc(100vh - 64px - 56px)',
  padding: '48px clamp(36px, 4vw, 64px) 24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
}

const mainAreaIntroStyle: CSSProperties = {
  ...mainAreaStyle,
  overflow: 'hidden',
  minHeight: 'calc(100vh - 64px - 56px)',
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
  height: '100%',
  margin: '0 auto',
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  justifyItems: 'stretch',
  alignContent: 'start',
  overflowY: 'auto',
  paddingBottom: '24px',
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

const footerIntroStyle: CSSProperties = {
  ...footerStyle,
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
