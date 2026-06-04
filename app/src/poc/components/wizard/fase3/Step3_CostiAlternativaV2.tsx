import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { getCER } from '../../../data/cer'
import { CER_VOUCHER_EDU_0_3, calcOpexVoucher } from '../../../data/cerVoucher'
import { useWizard } from '../../../hooks/useWizard'
import type { AlternativaData, AlternativaId } from '../../../types/docfap'
import { formatEuroFull } from '../../../utils/format'
import {
  computeCostScenario,
  shouldShowCostEstimateSection,
} from './step3CostiAlternativa.logic'
import { InputField } from '../../ui/InputField'
import {
  getInitialDurataInputValue,
  normalizeDurataOnBlur,
} from './step3DurataStimata.logic'

const DEFAULT_VITA_UTILE_PROGRAM = 5
const OPEX_RATIO = 0.03

type CardAlternativaId = 'A1' | 'A2' | 'A3'

interface Step3_CostiAlternativaProps {
  alternativaId: CardAlternativaId
}

function getAlternativaOrdinalLabel(alternativaId: CardAlternativaId): string {
  return `Alternativa ${alternativaId.slice(1)}`
}

function parsePositiveNumber(raw: string): number {
  const n = Number(raw.replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0
}

function formatItInt(n: number): string {
  return Math.round(n).toLocaleString('it-IT')
}

function parseItInt(raw: string): number {
  const n = Number(raw.replace(/\./g, '').replace(',', '.').trim())
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0
}

function sumTargetValues(values: Record<string, number>): number {
  return Object.values(values).reduce((sum, value) => sum + (value > 0 ? value : 0), 0)
}

function buildTargetPrompt(label: string, totalTargets: number): string {
  if (totalTargets === 1) {
    return `Quantita di fabbisogno target soddisfatta da questa alternativa - ${label}`
  }

  return `Quantita di fabbisogno target soddisfatta da questa alternativa - ${label}`
}

function defaultAlternative(): AlternativaData {
  return {
    categoria: '',
    tipologia: '',
    quantita: 0,
    obiettivoCer: 0,
    scenarioCostoScelto: 'massimo',
    capex: 0,
    opex: 0,
    nome: '',
    clusterId: null,
    durataStimata: null,
    targetValues: {},
  }
}

export function Step3_CostiAlternativaV2({
  alternativaId,
}: Step3_CostiAlternativaProps) {
  const { state, addAlternativa } = useWizard()
  const alternativaLabel = getAlternativaOrdinalLabel(alternativaId)

  const [durataOverride, setDurataOverride] = useState('')
  const [durataTooltipOpen, setDurataTooltipOpen] = useState(false)
  const durataTooltipId = useId()
  const durataTriggerRef = useRef<HTMLButtonElement>(null)

  const current = state.alternative[alternativaId] ?? defaultAlternative()
  const isVoucher = current.naturaCup === 'voucher'
  const cer = isVoucher ? null : getCER(current.categoria, current.tipologia)
  const durataStimataAutomatica = Math.round(cer?.durataMediaMesi ?? 0)
  const unitaMisura = cer?.unitaMisura ?? current.unitaMisura ?? 'unita'
  const isAsiloNido = cer?.categoria === 'ASILI NIDO'

  const nBeneficiari = current.nBeneficiari ?? 0
  const vitaUtileProgram = current.vitaUtileProgram ?? DEFAULT_VITA_UTILE_PROGRAM
  const opexVoucher = calcOpexVoucher(nBeneficiari, CER_VOUCHER_EDU_0_3.cerUnitario)

  const selectedTargetLabels: string[] = []
  const derivedTargetValues: Record<string, number> = {}

  const totalTargetValue = sumTargetValues(derivedTargetValues)

  const costScenario = computeCostScenario({
    cer: cer ?? null,
    obiettivo: totalTargetValue,
    selectedScenario: 'massimo',
    currentCapex: current.capex,
    opexRatio: OPEX_RATIO,
  })

  const updateAlternative = (patch: Partial<AlternativaData>) => {
    addAlternativa(alternativaId as AlternativaId, { ...current, ...patch })
  }

  useEffect(() => {
    setDurataOverride(getInitialDurataInputValue(current.durataStimata, cer?.durataMediaMesi))
  }, [alternativaId, current.categoria, current.tipologia, current.durataStimata, cer?.durataMediaMesi])

  useEffect(() => {
    const normalizedTargetValues = selectedTargetLabels.reduce<Record<string, number>>((acc, label) => {
      acc[label] = current.targetValues?.[label] ?? 0
      return acc
    }, {})

    const nextTotal = sumTargetValues(normalizedTargetValues)

    if (isVoucher) {
      if (current.nBeneficiari !== nextTotal || JSON.stringify(current.targetValues ?? {}) !== JSON.stringify(normalizedTargetValues)) {
        const opex = calcOpexVoucher(nextTotal, CER_VOUCHER_EDU_0_3.cerUnitario)
        updateAlternative({
          targetValues: normalizedTargetValues,
          nBeneficiari: nextTotal,
          quantita: nextTotal,
          obiettivoCer: nextTotal,
          capex: 0,
          opex,
        })
      }
      return
    }

    const nextCapexAuto = Math.round(cer ? nextTotal * cer.valoreMax : current.capex)
    const nextCapex = current.capex > 0 ? current.capex : nextCapexAuto
    const nextOpex = Math.round(nextCapex * OPEX_RATIO)

    const mustSyncTargets = JSON.stringify(current.targetValues ?? {}) !== JSON.stringify(normalizedTargetValues)
    const mustSyncQuantita = (current.obiettivoCer ?? current.quantita ?? 0) !== nextTotal
    const mustSyncCapex = current.capex === 0 && nextCapex !== 0
    const mustSyncOpex = current.opex !== nextOpex
    const mustSyncDurata = current.durataStimata == null && durataStimataAutomatica > 0

    if (mustSyncTargets || mustSyncQuantita || mustSyncCapex || mustSyncOpex || mustSyncDurata) {
      updateAlternative({
        targetValues: normalizedTargetValues,
        quantita: nextTotal,
        obiettivoCer: nextTotal,
        capex: nextCapex,
        opex: nextOpex,
        durataStimata: current.durataStimata ?? (durataStimataAutomatica > 0 ? durataStimataAutomatica : null),
      })
    }
  }, [
    alternativaId,
    cer,
    current.capex,
    current.durataStimata,
    current.nBeneficiari,
    current.opex,
    current.quantita,
    current.obiettivoCer,
    current.targetValues,
    durataStimataAutomatica,
    isVoucher,
    selectedTargetLabels,
  ])

  const handleTargetValueChange = (targetLabel: string, raw: string) => {
    const nextValue = parsePositiveNumber(raw)
    const nextTargetValues = {
      ...derivedTargetValues,
      [targetLabel]: nextValue,
    }
    const nextTotal = sumTargetValues(nextTargetValues)

    if (isVoucher) {
      const nextOpex = calcOpexVoucher(nextTotal, CER_VOUCHER_EDU_0_3.cerUnitario)
      updateAlternative({
        targetValues: nextTargetValues,
        nBeneficiari: nextTotal,
        quantita: nextTotal,
        obiettivoCer: nextTotal,
        capex: 0,
        opex: nextOpex,
      })
      return
    }

    const nextCostScenario = computeCostScenario({
      cer: cer ?? null,
      obiettivo: nextTotal,
      selectedScenario: 'massimo',
      currentCapex: 0,
      opexRatio: OPEX_RATIO,
    })
    const nextCapex = Math.round(nextCostScenario.capexAttivo)
    const nextOpex = Math.round(nextCapex * OPEX_RATIO)

    updateAlternative({
      targetValues: nextTargetValues,
      quantita: nextTotal,
      obiettivoCer: nextTotal,
      capex: nextCapex,
      opex: nextOpex,
    })
  }

  const handleCapexChange = (raw: string) => {
    const capex = parseItInt(raw)
    updateAlternative({
      capex,
      opex: Math.round(capex * OPEX_RATIO),
    })
  }

  const handleVitaUtileProgramChange = (raw: string) => {
    const value = Math.max(1, Math.min(30, Math.round(Number(raw) || DEFAULT_VITA_UTILE_PROGRAM)))
    updateAlternative({ vitaUtileProgram: value })
  }

  const handleDurataChange = (raw: string) => {
    setDurataOverride(raw)
    const parsed = Number(raw.trim())
    updateAlternative({
      durataStimata: Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null,
    })
  }

  const handleDurataBlur = () => {
    const normalized = normalizeDurataOnBlur(durataOverride, cer?.durataMediaMesi)
    setDurataOverride(normalized.inputValue)
    updateAlternative({ durataStimata: normalized.durataStimata })
  }

  const capexDisplayValue = current.capex > 0 ? formatItInt(current.capex) : ''
  const opexDisplayValue = current.opex > 0 ? formatItInt(current.opex) : ''

  if (isVoucher) {
    return (
      <div style={rootStyle}>
        <section style={cardStyle} aria-label={`${alternativaLabel} - target voucher`}>
          <header style={cardHeaderStyle}>
            <span style={cardLabelStyle}>{alternativaLabel}</span>
          </header>
          <div style={cardBodyStyle}>
            <div style={targetRequestListStyle}>
              {selectedTargetLabels.map((targetLabel) => (
                <div key={targetLabel} style={targetRequestCardStyle}>
                  <InputField
                    label={buildTargetPrompt(targetLabel, selectedTargetLabels.length)}
                    type="number"
                    value={String(derivedTargetValues[targetLabel] ?? '')}
                    onChange={(raw) => handleTargetValueChange(targetLabel, raw)}
                    placeholder="Es. 50"
                    helperText="Valore iniziale precaricato dallo step Target - modificabile"
                    className="step3-obiettivo-input"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={cardStyle} aria-label={`${alternativaLabel} - costi voucher`}>
          <header style={cardHeaderStyle}>
            <h3 style={sectionHeadingStyle}>Costo annuo della soluzione voucher</h3>
          </header>
          <div style={cardBodyStyle}>
            <div style={costGridStyle}>
              <div style={estimateBoxStyle}>
                <p style={estimateBoxLabelStyle}>CAPEX</p>
                <InputField
                  label="CAPEX confermato (€)"
                  type="text"
                  value="0"
                  onChange={() => undefined}
                  readOnly
                  helperText="Nessun investimento fisico previsto per questa alternativa"
                  className="estimate-input"
                />
              </div>

              <div style={estimateBoxStyle}>
                <p style={estimateBoxLabelStyle}>OPEX annuo</p>
                <InputField
                  label="OPEX annuo (€)"
                  type="text"
                  value={opexVoucher > 0 ? formatItInt(opexVoucher) : ''}
                  onChange={() => undefined}
                  readOnly
                  helperText={`${formatItInt(totalTargetValue)} beneficiari x € ${CER_VOUCHER_EDU_0_3.cerUnitario.toLocaleString('it-IT')}/anno`}
                  className="estimate-input"
                />
              </div>

              <div style={estimateBoxStyle}>
                <div style={estimateBoxHeaderStyle}>
                  <p style={estimateBoxLabelStyle}>Durata programma</p>
                </div>
                <InputField
                  label="Durata (anni)"
                  type="number"
                  value={String(vitaUtileProgram)}
                  onChange={handleVitaUtileProgramChange}
                  helperText="Default 5 anni - modificabile"
                  className="estimate-input"
                />
              </div>
            </div>
          </div>
        </section>

        <style>{inputStyles}</style>
      </div>
    )
  }

  return (
    <div style={rootStyle}>
      <section style={cardStyle} aria-label={`${alternativaLabel} - contributo target`}>
        <header style={cardHeaderStyle}>
          <span style={cardLabelStyle}>{alternativaLabel}</span>
        </header>
        <div style={cardBodyStyle}>
          <div style={targetRequestListStyle}>
            {selectedTargetLabels.map((targetLabel) => (
              <div key={targetLabel} style={targetRequestCardStyle}>
                <InputField
                  label={buildTargetPrompt(targetLabel, selectedTargetLabels.length)}
                  type="number"
                  value={String(derivedTargetValues[targetLabel] ?? '')}
                  onChange={(raw) => handleTargetValueChange(targetLabel, raw)}
                  placeholder={`Es. 60 ${unitaMisura}`}
                  helperText="Valore iniziale precaricato dallo step Target - modificabile"
                  className="step3-obiettivo-input"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {shouldShowCostEstimateSection(totalTargetValue) && (
        <section style={cardStyle} aria-label={`${alternativaLabel} - costi e durata`}>
          <header style={cardHeaderStyle}>
            <h3 style={sectionHeadingStyle}>Stima parametrica dei costi</h3>
          </header>
          <div style={cardBodyStyle}>
            <div style={costGridStyle}>
              <div style={{ ...estimateBoxStyle, ...capexBoxStyle }}>
                <p style={estimateBoxLabelStyle}>CAPEX</p>

                <InputField
                  label="CAPEX confermato (€)"
                  type="text"
                  value={capexDisplayValue}
                  onChange={handleCapexChange}
                  placeholder="Inserisci importo"
                  required
                  helperText={costScenario.hasCerData ? 'Valore iniziale calcolato dal CP - modificabile' : 'Inserisci il CAPEX estimativo confermato'}
                  className="estimate-input"
                />

                {costScenario.hasCerData ? (
                  <>
                <p style={formulaStyle}>
                  {formatItInt(totalTargetValue)} {isAsiloNido ? 'alunni' : unitaMisura}
                  {' x '}
                  € {Math.round(cer?.valoreUnitario ?? 0).toLocaleString('it-IT')}
                  /
                      {isAsiloNido ? 'alunno' : unitaMisura}
                      {' = '}
                      {formatEuroFull(Math.round(costScenario.capexMax))}
                    </p>
                  </>
                ) : (
                  <p style={mutedTextStyle}>
                    CP non disponibile per questa categoria e tipologia. Inserisci direttamente il CAPEX confermato.
                  </p>
                )}
              </div>

              <div style={estimateBoxStyle}>
                <p style={estimateBoxLabelStyle}>OPEX annuo</p>
                <InputField
                  label="OPEX annuo (€)"
                  type="text"
                  value={opexDisplayValue}
                  onChange={() => undefined}
                  readOnly
                  required
                  helperText="3% del CAPEX confermato"
                  className="estimate-input"
                />
                <p style={infoBoxStyle}>
                  Fonte MIT. Stima parametrica: OPEX = 3% del CAPEX confermato.
                </p>
              </div>

              <div style={estimateBoxStyle}>
                <div style={estimateBoxHeaderStyle}>
                  <p style={estimateBoxLabelStyle}>Durata media stimata</p>
                  <span style={tooltipWrapStyle}>
                    <button
                      ref={durataTriggerRef}
                      type="button"
                      aria-label="Approfondisci il significato della durata stimata"
                      aria-expanded={durataTooltipOpen}
                      aria-controls={durataTooltipId}
                      onClick={() => setDurataTooltipOpen((open) => !open)}
                      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
                        if (event.key === 'Escape') setDurataTooltipOpen(false)
                      }}
                      style={tooltipTriggerStyle}
                    >
                      i
                    </button>
                    <span
                      id={durataTooltipId}
                      role="tooltip"
                      hidden={!durataTooltipOpen}
                      style={tooltipStyle}
                    >
                      <p style={{ margin: 0 }}>
                        Con durata si intende il tempo stimato per realizzare l'intervento.
                      </p>
                    </span>
                  </span>
                </div>
                <div
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node)) handleDurataBlur()
                  }}
                >
                  <InputField
                    label="Durata (mesi)"
                    type="text"
                    value={durataOverride}
                    onChange={handleDurataChange}
                    placeholder=""
                    required
                    helperText="Valore iniziale precaricato - modificabile"
                    className="estimate-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <style>{inputStyles}</style>
    </div>
  )
}

const inputStyles = `
  .estimate-input .input-oe__input {
    text-align: right;
    font-family: var(--font-family-0, "Atkinson Hyperlegible Mono", monospace);
    font-size: var(--type-body-s-size, 16px);
    font-weight: 700;
    color: var(--color-text-primary);
  }
  .step3-obiettivo-input .input-oe__wrapper {
    height: 56px;
  }
  .step3-obiettivo-input .input-oe__input {
    font-size: var(--type-body-s-size, 16px);
    line-height: 1.2;
    text-align: left;
    padding-left: 16px;
    font-family: var(--font-family-0, "Atkinson Hyperlegible Mono", monospace);
  }
  .step3-obiettivo-input .input-oe__input::placeholder {
    font-size: var(--type-body-s-size, 16px);
    text-align: left;
    color: var(--color-text-disable);
  }
`

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
}

const cardStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
}

const cardHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
}

const cardLabelStyle: CSSProperties = {
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
}

const sectionHeadingStyle: CSSProperties = {
  margin: 0,
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
}

const cardBodyStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  padding: 'var(--spacing-inset-s)',
}

const targetRequestListStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const targetRequestCardStyle: CSSProperties = {
  padding: '16px',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-secondary-lightest)',
}

const costGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.2fr) minmax(240px, 1fr)',
  gap: 'var(--spacing-inline-s)',
}

const estimateBoxStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
  padding: 'var(--spacing-inset-s)',
  borderRadius: 'var(--radius-smooth)',
  border: '1px solid var(--color-border-secondary-light)',
  background: 'var(--color-background-secondary-lightest)',
  alignContent: 'start',
  gridAutoRows: 'min-content',
}

const capexBoxStyle: CSSProperties = {
  gap: 'var(--spacing-stack-xs)',
}

const estimateBoxHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
}

const estimateBoxLabelStyle: CSSProperties = {
  margin: 0,
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

const formulaStyle: CSSProperties = {
  margin: 0,
  padding: '10px 12px',
  borderRadius: 'var(--radius-smooth)',
  border: '1px solid var(--color-border-secondary-light)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  lineHeight: 1.45,
  minHeight: 72,
  display: 'flex',
  alignItems: 'flex-start',
}

const infoBoxStyle: CSSProperties = {
  margin: 0,
  padding: '10px 12px',
  borderRadius: 'var(--radius-smooth)',
  border: '1px solid var(--color-border-secondary-light)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  lineHeight: 1.4,
  minHeight: 72,
  display: 'flex',
  alignItems: 'flex-start',
}

const tooltipWrapStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
}

const tooltipTriggerStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  border: '1px solid var(--color-border-secondary)',
  borderRadius: '50%',
  background: 'transparent',
  cursor: 'pointer',
  padding: 0,
  color: 'var(--color-text-primary-lighter)',
  fontSize: '11px',
  lineHeight: 1,
  flexShrink: 0,
}

const tooltipStyle: CSSProperties = {
  position: 'absolute',
  bottom: 'calc(100% + 8px)',
  left: 0,
  zIndex: 200,
  width: 280,
  padding: 'var(--spacing-inset-s, 16px)',
  backgroundColor: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth, 2px)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  color: 'var(--color-text-primary)',
  lineHeight: 1.5,
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
}

const mutedTextStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  lineHeight: 1.5,
}
