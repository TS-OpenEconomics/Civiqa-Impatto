import { useState, useMemo, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import {
  getCostiByCategory,
  calcolaCostoTipologia,
} from '../../../data/poc_docfap/costi_per_tipologia'
import type { TipologiaIntervento } from '../../../data/poc_docfap/costi_per_tipologia'
import { INTERVENTION_CATEGORIES } from '../../../data/poc_docfap/intervention_categories_layer3'
import { useWizard } from '../../../hooks/useWizard'
import type { AlternativaId } from '../../../types/docfap'

interface Props {
  alternativaId: 'A1' | 'A2' | 'A3'
}

const LAYER3_TO_COSTI: Record<string, TipologiaIntervento> = {
  nuova_realizzazione: 'NUOVA_REALIZZAZIONE',
  ristrutturazione: 'RISTRUTTURAZIONE',
  ristrutturazione_efficientamento: 'RISTRUTTURAZIONE_CON_EE',
  manutenzione_straordinaria_ee: 'MANUTENZIONE_STRAORD_EE',
  manutenzione_ordinaria: 'MANUTENZIONE_ORDINARIA',
  restauro: 'RESTAURO',
  recupero: 'RECUPERO',
  ampliamento_potenziamento: 'AMPLIAMENTO_POTENZIAMENTO',
  ammodernamento_tecnologico: 'AMMODERNAMENTO_TECNOLOGICO',
  demolizione: 'DEMOLIZIONE',
  lavori_socialmente_utili: 'LAVORI_SOCIALMENTE_UTILI',
  altro: 'ALTRO',
}

function extractPhysicalUnit(udm: string): string {
  return udm.replace(/^€\//, '').trim()
}

function formatEur(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return (
      (value / 1_000_000).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' M€'
    )
  }
  if (Math.abs(value) >= 1_000) {
    return (
      (value / 1_000).toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' k€'
    )
  }
  return value.toLocaleString('it-IT') + ' €'
}

function displayInt(raw: string, focused: boolean): string {
  if (focused || raw === '') return raw
  const n = Math.round(parseFloat(raw.replace(/\./g, '')))
  if (isNaN(n)) return raw
  return n.toLocaleString('it-IT')
}

function stripDots(val: string): string {
  return val.replace(/\./g, '')
}

export function InputParamsStep({ alternativaId }: Props) {
  const { state, addAlternativa } = useWizard()
  const alt = state.alternative[alternativaId]
  const categoria = alt?.categoria ?? ''
  const tipologia = alt?.tipologia ?? ''

  const altRef = useRef(alt)
  altRef.current = alt

  const [focusedField, setFocusedField] = useState<string | null>(null)

  // ── Parametric data ──────────────────────────────────────────────────────

  const costoData = useMemo(() => {
    if (!categoria || !tipologia) return null
    const costiCode = LAYER3_TO_COSTI[tipologia]
    if (!costiCode) return null
    const records = getCostiByCategory(categoria)
    if (records.length === 0) return null
    return calcolaCostoTipologia(records[0], costiCode)
  }, [categoria, tipologia])

  const categoryData = useMemo(
    () => INTERVENTION_CATEGORIES.find(c => c.code === categoria),
    [categoria],
  )

  const durationMonths = useMemo(() => {
    if (!categoryData || !tipologia) return null
    return categoryData.construction_durations.find(d => d.tipologia_code === tipologia)?.duration_months ?? null
  }, [categoryData, tipologia])

  // ── State ────────────────────────────────────────────────────────────────

  const [qty, setQty] = useState('')
  const [cpStr, setCpStr] = useState('')          // user-selected CP (slider or manual)
  const [capexStr, setCapexStr] = useState('')
  const [capexIsCustom, setCapexIsCustom] = useState(false)
  const [opexPctStr, setOpexPctStr] = useState('')
  const [opexValStr, setOpexValStr] = useState('')
  const [durationStr, setDurationStr] = useState('')

  // Refs for use inside effects without adding to deps
  const capexIsCustomRef = useRef(false)
  const opexPctStrRef = useRef(opexPctStr)
  opexPctStrRef.current = opexPctStr

  // Reset everything when category changes
  useEffect(() => {
    setQty('')
    setCpStr('')
    setCapexStr('')
    setCapexIsCustom(false)
    capexIsCustomRef.current = false
    setOpexPctStr('')
    setOpexValStr('')
    setDurationStr('')
  }, [categoria])

  // Seed CP from parametric data when tipologia changes
  useEffect(() => {
    if (costoData) {
      setCpStr(String(costoData.val_med))
      setCapexIsCustom(false)
      capexIsCustomRef.current = false
    }
  }, [costoData])

  // Seed duration
  useEffect(() => {
    if (durationMonths != null) setDurationStr(String(durationMonths))
  }, [durationMonths])

  // ── Derived values ───────────────────────────────────────────────────────

  const totalQty = useMemo(() => {
    const v = parseFloat(qty)
    return isNaN(v) || v < 0 ? 0 : v
  }, [qty])

  const cpValue = useMemo(() => {
    const v = parseFloat(cpStr)
    return isNaN(v) || v <= 0 ? (costoData?.val_med ?? 0) : v
  }, [cpStr, costoData])

  const computed = useMemo(() => {
    if (!costoData || totalQty <= 0 || cpValue <= 0) return null
    const capexFromCp = Math.round(cpValue * totalQty)
    const capexRefMin = Math.round(costoData.val_min * totalQty)
    const capexRefMax = Math.round(costoData.val_max * totalQty)
    const opex = categoryData?.opex ?? { pct_min: 0.02, pct_med: 0.03, pct_max: 0.05 }
    return {
      capexFromCp,
      capexRefMin,
      capexRefMax,
      opexPctMin: parseFloat((opex.pct_min * 100).toFixed(1)),
      opexPctMed: parseFloat((opex.pct_med * 100).toFixed(1)),
      opexPctMax: parseFloat((opex.pct_max * 100).toFixed(1)),
    }
  }, [costoData, totalQty, cpValue, categoryData])

  // Seed capexStr and opexValStr whenever computed changes (skip if capex is manually overridden)
  useEffect(() => {
    if (!computed || capexIsCustomRef.current) return
    const newCapex = computed.capexFromCp
    setCapexStr(String(newCapex))
    const currentPct = parseFloat(opexPctStrRef.current)
    const pct = isNaN(currentPct) ? computed.opexPctMed : currentPct
    if (isNaN(currentPct)) setOpexPctStr(String(computed.opexPctMed))
    setOpexValStr(String(Math.round(newCapex * pct / 100)))
  }, [computed])

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleCpChange(val: string) {
    setCpStr(val)
    // CP change always clears the custom CAPEX flag — re-derive from CP × qty
    capexIsCustomRef.current = false
    setCapexIsCustom(false)
  }

  function handleQtyChange(val: string) {
    setQty(val)
    capexIsCustomRef.current = false
    setCapexIsCustom(false)
  }

  function handleCapexChange(val: string) {
    setCapexStr(val)
    capexIsCustomRef.current = true
    setCapexIsCustom(true)
    const capex = parseFloat(val)
    const pct = parseFloat(opexPctStr)
    if (!isNaN(capex) && capex > 0 && !isNaN(pct)) {
      setOpexValStr(String(Math.round(capex * pct / 100)))
    }
  }

  function handleOpexPctChange(val: string) {
    setOpexPctStr(val)
    const capex = parseFloat(capexStr)
    const pct = parseFloat(val)
    if (!isNaN(capex) && capex > 0 && !isNaN(pct) && pct >= 0) {
      setOpexValStr(String(Math.round(capex * pct / 100)))
    }
  }

  function handleOpexValChange(val: string) {
    setOpexValStr(val)
    const capex = parseFloat(capexStr)
    const opex = parseFloat(val)
    if (!isNaN(capex) && capex > 0 && !isNaN(opex) && opex >= 0) {
      setOpexPctStr(((opex / capex) * 100).toFixed(1))
    }
  }

  // ── Auto-save to wizard store ─────────────────────────────────────────────

  useEffect(() => {
    if (!altRef.current) return
    const capex = parseFloat(capexStr)
    const opex = parseFloat(opexValStr)
    const duration = parseInt(durationStr)
    if (isNaN(capex) || capex <= 0) return
    addAlternativa(alternativaId as AlternativaId, {
      ...altRef.current,
      quantita: totalQty,
      capex,
      opex: isNaN(opex) ? 0 : opex,
      durataStimata: isNaN(duration) ? undefined : duration,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capexStr, opexValStr, durationStr, totalQty, alternativaId, addAlternativa])

  // ── Render ────────────────────────────────────────────────────────────────

  if (!categoria || !tipologia) {
    return (
      <div style={emptyStyle}>
        <p>Completa prima la selezione di categoria e tipologia nell'alternativa.</p>
      </div>
    )
  }

  const physUnit = costoData ? extractPhysicalUnit(costoData.udm) : ''
  const sliderStep = costoData
    ? Math.max(1, Math.round((costoData.val_max - costoData.val_min) / 200))
    : 1
  const showResults = capexStr !== ''

  return (
    <div style={rootStyle}>
      {/* ── CP selector ── */}
      {costoData && (
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Costo parametrico (CP)</legend>
          <style>{`
            .cp-slider-${alternativaId}:focus-visible {
              outline: none;
              box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
            }
            .cp-slider-${alternativaId} {
              -webkit-appearance: none;
              appearance: none;
              width: 100%;
              height: 6px;
              border-radius: 3px;
              background: linear-gradient(
                to right,
                var(--color-background-primary) 0%,
                var(--color-background-primary)
                  ${(((cpValue - costoData.val_min) / (costoData.val_max - costoData.val_min)) * 100).toFixed(1)}%,
                var(--color-border-secondary-light)
                  ${(((cpValue - costoData.val_min) / (costoData.val_max - costoData.val_min)) * 100).toFixed(1)}%,
                var(--color-border-secondary-light) 100%
              );
              cursor: pointer;
            }
            .cp-slider-${alternativaId}::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: var(--color-background-primary);
              border: 2px solid var(--color-background-inverse);
              box-shadow: 0 0 0 1px var(--color-border-primary);
              cursor: pointer;
            }
            .cp-slider-${alternativaId}::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: var(--color-background-primary);
              border: 2px solid var(--color-background-inverse);
              box-shadow: 0 0 0 1px var(--color-border-primary);
              cursor: pointer;
            }
          `}</style>

          {/* Current CP value + unit */}
          <div style={cpValueRowStyle}>
            <div style={inputWithSuffixStyle}>
              <input
                id={`cp-val-${alternativaId}`}
                type="number"
                min={costoData.val_min}
                max={costoData.val_max * 2}
                step={sliderStep}
                value={cpStr}
                onChange={(e) => handleCpChange(e.target.value)}
                style={cpNumberInputStyle}
                aria-label={`Costo parametrico in ${costoData.udm}`}
              />
              <span style={udmBadgeStyle}>{costoData.udm}</span>
            </div>
          </div>

          {/* Slider */}
          <div style={sliderWrapStyle}>
            <input
              type="range"
              className={`cp-slider-${alternativaId}`}
              min={costoData.val_min}
              max={costoData.val_max}
              step={sliderStep}
              value={Math.min(Math.max(cpValue, costoData.val_min), costoData.val_max)}
              onChange={(e) => handleCpChange(e.target.value)}
              aria-label="Costo parametrico — slider"
              aria-valuemin={costoData.val_min}
              aria-valuemax={costoData.val_max}
              aria-valuenow={cpValue}
              aria-valuetext={`${cpValue.toLocaleString('it-IT')} ${costoData.udm}`}
            />
            <div style={sliderLabelsStyle}>
              <span>min {costoData.val_min.toLocaleString('it-IT')}</span>
              <span>max {costoData.val_max.toLocaleString('it-IT')}</span>
            </div>
          </div>
        </fieldset>
      )}

      {/* ── Quantity input ── */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>Quantità fisica dell'intervento</legend>
        <div style={fieldRowStyle}>
          <label htmlFor={`ip-qty-${alternativaId}`} style={labelStyle}>
            Quantità totale
            {physUnit && <span style={udmTagStyle}>{physUnit}</span>}
          </label>
          <p style={questionStyle}>
            Inserisci la dimensione fisica dell'intervento{physUnit ? ` in ${physUnit}` : ''}.
          </p>
          <input
            id={`ip-qty-${alternativaId}`}
            type="text"
            inputMode="numeric"
            value={displayInt(qty, focusedField === `qty-${alternativaId}`)}
            onChange={(e) => handleQtyChange(stripDots(e.target.value))}
            onFocus={() => setFocusedField(`qty-${alternativaId}`)}
            onBlur={() => setFocusedField(null)}
            style={inputStyle}
            aria-label={`Quantità totale${physUnit ? ` in ${physUnit}` : ''}`}
          />
        </div>
      </fieldset>

      {/* ── Editable results ── */}
      {showResults ? (
        <div style={resultsStyle} role="region" aria-label="Valori stimati — conferma o modifica">
          <h3 style={resultsTitleStyle}>Valori stimati — conferma o modifica</h3>

          <div style={resultsRowStyle}>
            {/* CAPEX */}
            <div style={resultPanelStyle}>
              <div style={resultFieldHeaderStyle}>
                <span style={resultFieldLabelStyle}>CAPEX stimato</span>
                {capexIsCustom && (
                  <span style={customBadgeStyle} aria-label="Valore inserito manualmente">
                    personalizzato
                  </span>
                )}
              </div>
              {computed && (
                <div style={minMaxRowStyle}>
                  <span style={minMaxItemStyle}>Min <strong>{formatEur(computed.capexRefMin)}</strong></span>
                  <span style={minMaxSepStyle}>·</span>
                  <span style={minMaxItemStyle}>Max <strong>{formatEur(computed.capexRefMax)}</strong></span>
                </div>
              )}
              <div style={panelInputRowStyle}>
                <input
                  id={`capex-${alternativaId}`}
                  type="text"
                  inputMode="numeric"
                  value={displayInt(capexStr, focusedField === `capex-${alternativaId}`)}
                  onChange={(e) => handleCapexChange(stripDots(e.target.value))}
                  onFocus={() => setFocusedField(`capex-${alternativaId}`)}
                  onBlur={() => setFocusedField(null)}
                  style={panelInputStyle}
                  aria-label="CAPEX in euro"
                />
                <span style={udmBadgeStyle}>€</span>
              </div>
            </div>

            {/* OPEX */}
            <div style={resultPanelStyle}>
              <span style={resultFieldLabelStyle}>OPEX annuo stimato</span>
              {computed && (
                <div style={minMaxRowStyle}>
                  <span style={minMaxItemStyle}>Min <strong>{computed.opexPctMin}%</strong></span>
                  <span style={minMaxSepStyle}>·</span>
                  <span style={minMaxItemStyle}>Max <strong>{computed.opexPctMax}%</strong></span>
                </div>
              )}
              <div style={opexInputsRowStyle}>
                <input
                  id={`opex-val-${alternativaId}`}
                  type="text"
                  inputMode="numeric"
                  value={displayInt(opexValStr, focusedField === `opex-val-${alternativaId}`)}
                  onChange={(e) => handleOpexValChange(stripDots(e.target.value))}
                  onFocus={() => setFocusedField(`opex-val-${alternativaId}`)}
                  onBlur={() => setFocusedField(null)}
                  style={panelInputStyle}
                  aria-label="OPEX annuo in euro"
                />
                <span style={udmBadgeStyle}>€/anno</span>
                <div style={opexPctBlockStyle}>
                  <input
                    id={`opex-pct-${alternativaId}`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={opexPctStr}
                    onChange={(e) => handleOpexPctChange(e.target.value)}
                    style={pctInputStyle}
                    aria-label="OPEX come percentuale del CAPEX"
                  />
                  <span style={udmBadgeStyle}>%</span>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div style={{ ...resultPanelStyle, borderRight: 'none' }}>
              <span style={resultFieldLabelStyle}>Durata stimata</span>
              <div style={minMaxRowStyle} aria-hidden="true" />
              <div style={panelInputRowStyle}>
                <input
                  id={`dur-${alternativaId}`}
                  type="text"
                  inputMode="numeric"
                  value={displayInt(durationStr, focusedField === `dur-${alternativaId}`)}
                  onChange={(e) => setDurationStr(stripDots(e.target.value))}
                  onFocus={() => setFocusedField(`dur-${alternativaId}`)}
                  onBlur={() => setFocusedField(null)}
                  style={panelInputStyle}
                  aria-label="Durata cantiere in mesi"
                />
                <span style={udmBadgeStyle}>mesi</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p style={hintStyle} aria-live="polite">
          Inserisci la quantità per calcolare e confermare CAPEX, OPEX e durata.
        </p>
      )}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
}

const emptyStyle: CSSProperties = {
  padding: 'var(--spacing-inset-m)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  color: 'var(--color-text-primary-light)',
}

const fieldsetStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: 'var(--spacing-inset-m)',
  margin: 0,
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const legendStyle: CSSProperties = {
  padding: '0 var(--spacing-inline-xs)',
  fontSize: 'var(--type-body-s-size, 14px)',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
}

// CP selector
const cpValueRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-s)',
}

const cpNumberInputStyle: CSSProperties = {
  width: '10rem',
  padding: 'var(--spacing-inset-xs) var(--spacing-inset-s)',
  border: '1px solid var(--color-border-secondary)',
  borderRadius: 'var(--radius-smooth)',
  fontSize: 'var(--type-body-m-size, 16px)',
  fontFamily: 'var(--font-family-0)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  background: 'var(--color-background-default)',
  outline: 'none',
  boxSizing: 'border-box',
}

const sliderWrapStyle: CSSProperties = {
  display: 'grid',
  gap: '4px',
}

const sliderLabelsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '11px',
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-0)',
}

// Quantity input
const fieldRowStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
}

const labelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-xs)',
  fontSize: 'var(--type-body-s-size, 14px)',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
}

const udmTagStyle: CSSProperties = {
  fontSize: 'var(--type-body-xs-size, 11px)',
  fontFamily: 'var(--font-family-0)',
  color: 'var(--color-text-inverse)',
  background: 'var(--color-background-primary)',
  borderRadius: 'var(--radius-rounded)',
  padding: '1px 7px',
  fontWeight: 400,
}

const questionStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--type-body-s-size, 13px)',
  color: 'var(--color-text-primary-light)',
  lineHeight: 1.4,
}

const inputStyle: CSSProperties = {
  width: '100%',
  maxWidth: '18rem',
  padding: 'var(--spacing-inset-xs) var(--spacing-inset-s)',
  border: '1px solid var(--color-border-secondary)',
  borderRadius: 'var(--radius-smooth)',
  fontSize: 'var(--type-body-m-size, 16px)',
  fontFamily: 'var(--font-family-0)',
  color: 'var(--color-text-primary)',
  background: 'var(--color-background-default)',
  outline: 'none',
  boxSizing: 'border-box',
}

// Results
const resultsStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  overflow: 'hidden',
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const resultsTitleStyle: CSSProperties = {
  margin: '0',
  padding: 'var(--spacing-inset-s) var(--spacing-inset-m) 0',
  fontSize: 'var(--type-body-s-size, 14px)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}

const resultsRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '0',
}

const resultPanelStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  padding: 'var(--spacing-inset-m)',
  borderRight: '1px solid var(--color-border-secondary-light)',
}

const resultFieldHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-s)',
}

const resultFieldLabelStyle: CSSProperties = {
  fontSize: 'var(--type-body-s-size, 14px)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  letterSpacing: '0.01em',
}

const minMaxRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  minHeight: '18px',
}

const minMaxItemStyle: CSSProperties = {
  fontSize: '12px',
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-0)',
}

const minMaxSepStyle: CSSProperties = {
  fontSize: '12px',
  color: 'var(--color-text-primary-lighter)',
}

const customBadgeStyle: CSSProperties = {
  fontSize: '11px',
  fontFamily: 'var(--font-family-0)',
  color: 'var(--color-text-primary)',
  background: 'var(--color-background-warning-lighter, #fff8e1)',
  border: '1px solid var(--color-border-warning, #f9a825)',
  borderRadius: 'var(--radius-rounded)',
  padding: '1px 7px',
}

const panelInputRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const opexInputsRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const opexPctBlockStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  borderLeft: '1px solid var(--color-border-secondary-light)',
  paddingLeft: '8px',
  marginLeft: '2px',
}

const panelInputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: 'var(--spacing-inset-xs) var(--spacing-inset-s)',
  border: '1px solid var(--color-border-secondary)',
  borderRadius: 'var(--radius-smooth)',
  fontSize: 'var(--type-body-m-size, 16px)',
  fontFamily: 'var(--font-family-0)',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  background: 'var(--color-background-default)',
  outline: 'none',
  boxSizing: 'border-box',
}

const pctInputStyle: CSSProperties = {
  width: '4.5rem',
  padding: 'var(--spacing-inset-xs) var(--spacing-inset-s)',
  border: '1px solid var(--color-border-secondary)',
  borderRadius: 'var(--radius-smooth)',
  fontSize: 'var(--type-body-m-size, 16px)',
  fontFamily: 'var(--font-family-0)',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  background: 'var(--color-background-default)',
  outline: 'none',
  boxSizing: 'border-box',
}

const udmBadgeStyle: CSSProperties = {
  fontSize: 'var(--type-body-s-size, 13px)',
  color: 'var(--color-text-primary-light)',
  whiteSpace: 'nowrap',
  flexShrink: 0,
}

const inputWithSuffixStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-xs)',
}

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--type-body-s-size, 14px)',
  color: 'var(--color-text-primary-light)',
  fontStyle: 'italic',
}
