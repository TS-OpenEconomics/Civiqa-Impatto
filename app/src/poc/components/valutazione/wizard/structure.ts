export const TOTAL_VALUTAZIONE_STEPS = 13

export interface ValutazioneStepMeta {
  step: number
  phaseId: string
  phaseTitle: string
  substepId: string
  substepTitle: string
}

export interface ValutazioneWizardSubstep {
  id: string
  title: string
  steps: ValutazioneStepMeta[]
}

export interface ValutazioneWizardPhase {
  id: string
  title: string
  substeps: ValutazioneWizardSubstep[]
}

const STEP_DEFINITIONS: Array<Omit<ValutazioneStepMeta, 'phaseTitle' | 'substepTitle'> & {
  phaseTitle: string
  substepTitle: string
}> = [
  { step: 1, phaseId: 'profilazione', phaseTitle: 'Profilazione', substepId: 'intro-identita', substepTitle: 'Introduzione e identita' },
  { step: 2, phaseId: 'profilazione', phaseTitle: 'Profilazione', substepId: 'intro-identita', substepTitle: 'Introduzione e identita' },
  { step: 3, phaseId: 'profilazione', phaseTitle: 'Profilazione', substepId: 'intro-identita', substepTitle: 'Introduzione e identita' },
  { step: 4, phaseId: 'profilazione', phaseTitle: 'Profilazione', substepId: 'classificazione', substepTitle: 'Classificazione del progetto' },
  { step: 5, phaseId: 'profilazione', phaseTitle: 'Profilazione', substepId: 'classificazione', substepTitle: 'Classificazione del progetto' },
  { step: 6, phaseId: 'profilazione', phaseTitle: 'Profilazione', substepId: 'classificazione', substepTitle: 'Classificazione del progetto' },
  { step: 7, phaseId: 'profilazione', phaseTitle: 'Profilazione', substepId: 'classificazione', substepTitle: 'Classificazione del progetto' },
  { step: 8, phaseId: 'contesto-operativo', phaseTitle: 'Contesto operativo', substepId: 'durata', substepTitle: 'Durata del progetto' },
  { step: 9, phaseId: 'contesto-operativo', phaseTitle: 'Contesto operativo', substepId: 'localizzazione', substepTitle: 'Localizzazione' },
  { step: 10, phaseId: 'contesto-operativo', phaseTitle: 'Contesto operativo', substepId: 'quantita-target', substepTitle: 'Quantità target' },
  { step: 11, phaseId: 'parametri-economici', phaseTitle: 'Parametri economici', substepId: 'attualizzazione', substepTitle: 'Anno di attualizzazione' },
  { step: 12, phaseId: 'parametri-economici', phaseTitle: 'Parametri economici', substepId: 'capex', substepTitle: 'CAPEX' },
  { step: 13, phaseId: 'parametri-economici', phaseTitle: 'Parametri economici', substepId: 'opex', substepTitle: 'OPEX' },
]

const STEP_META = new Map<number, ValutazioneStepMeta>(
  STEP_DEFINITIONS.map((entry) => [entry.step, entry]),
)

const PHASES: ValutazioneWizardPhase[] = STEP_DEFINITIONS.reduce<ValutazioneWizardPhase[]>((acc, entry) => {
  let phase = acc.find((item) => item.id === entry.phaseId)
  if (!phase) {
    phase = { id: entry.phaseId, title: entry.phaseTitle, substeps: [] }
    acc.push(phase)
  }

  let substep = phase.substeps.find((item) => item.id === entry.substepId)
  if (!substep) {
    substep = { id: entry.substepId, title: entry.substepTitle, steps: [] }
    phase.substeps.push(substep)
  }

  substep.steps.push({
    step: entry.step,
    phaseId: entry.phaseId,
    phaseTitle: entry.phaseTitle,
    substepId: entry.substepId,
    substepTitle: entry.substepTitle,
  })

  return acc
}, [])

export function getValutazioneWizardPhases(): ValutazioneWizardPhase[] {
  return PHASES
}

export function getValutazioneStepMeta(step: number): ValutazioneStepMeta {
  const meta = STEP_META.get(step)
  if (!meta) {
    throw new Error(`Unknown Valutazione step: ${step}`)
  }

  return meta
}
