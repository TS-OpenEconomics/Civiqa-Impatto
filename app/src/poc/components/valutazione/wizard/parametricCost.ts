import { CER_DATA } from '../../../data/cer'
import type { ValutazioneWizardState } from '../../../contexts/ValutazioneWizardContext'
import type { CerRecord } from '../../../types/docfap'

interface TargetQuantityPrompt {
  label: string
  placeholder: string
  helperText: string
  unitLabel: string
  costUnitLabel: string
}

function normalizeText(value: string | undefined): string {
  return (value ?? '')
    .toLocaleLowerCase('it-IT')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function normalizeUnit(value: string | undefined): string {
  return normalizeText(value)
}

function getDisplayUnit(cer: CerRecord | null): string {
  const unit = cer?.unitaMisura?.trim()
  if (!unit) return 'unità'

  const normalizedUnit = normalizeUnit(unit)
  if (normalizedUnit === 'alunno' || normalizedUnit === 'alunni') return 'alunni'

  return unit
}

export function getValutazioneCerReference(
  state: Pick<ValutazioneWizardState, 'category_label' | 'intervention_type_label'>,
): CerRecord | null {
  const categoryKey = normalizeText(state.category_label)
  const tipologiaKey = normalizeText(state.intervention_type_label)

  if (!categoryKey || !tipologiaKey) return null

  const matchingRecords = CER_DATA.filter((record) => {
    const sameCategory = normalizeText(record.categoria) === categoryKey
    const sameTipologia = normalizeText(record.tipologia) === tipologiaKey
    return sameCategory && sameTipologia
  })

  if (matchingRecords.length === 0) return null

  matchingRecords.sort((left, right) => {
    if (right.robustezza !== left.robustezza) return right.robustezza - left.robustezza
    if (right.nProgetti !== left.nProgetti) return right.nProgetti - left.nProgetti
    return left.valoreUnitario - right.valoreUnitario
  })

  return matchingRecords[0]
}

export function getSuggestedCapexAmount(targetQuantity: number | null, cer: CerRecord | null): number | null {
  if (!cer || !targetQuantity || targetQuantity <= 0) return null
  return Math.round(targetQuantity * cer.valoreUnitario)
}

export function getTargetQuantityPrompt(cer: CerRecord | null): TargetQuantityPrompt {
  const unitLabel = getDisplayUnit(cer)

  if (normalizeUnit(unitLabel) === 'alunni') {
    return {
      label: 'Numero di alunni target',
      placeholder: 'Es. 150 alunni',
      helperText: "Indica per quanti alunni dimensionare l'intervento.",
      unitLabel,
      costUnitLabel: '€/alunno',
    }
  }

  if (cer) {
    return {
      label: 'Quantità target',
      placeholder: `Es. 60 ${unitLabel}`,
      helperText: `Indica quante ${unitLabel} vuoi realizzare.`,
      unitLabel,
      costUnitLabel: `€/${unitLabel}`,
    }
  }

  return {
    label: 'Quantità target',
    placeholder: 'Inserisci il valore',
    helperText: "Indica la quantità obiettivo necessaria a dimensionare l'intervento.",
    unitLabel: 'unità',
    costUnitLabel: '€/unità',
  }
}

export function getTargetQuantityLabel(cer: CerRecord | null): string {
  return getTargetQuantityPrompt(cer).label
}

export function getTargetQuantityHelperText(cer: CerRecord | null): string {
  return getTargetQuantityPrompt(cer).helperText
}

export function getCapexCostUnitLabel(cer: CerRecord | null): string {
  return getTargetQuantityPrompt(cer).costUnitLabel
}
