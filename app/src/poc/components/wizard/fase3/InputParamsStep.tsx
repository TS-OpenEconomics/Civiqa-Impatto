import { useState, useMemo, useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  getCostiByCategory,
  calcolaCostoTipologia,
} from '../../../data/poc_docfap/costi_per_tipologia'
import type { TipologiaIntervento } from '../../../data/poc_docfap/costi_per_tipologia'
import { INTERVENTION_CATEGORIES } from '../../../data/poc_docfap/intervention_categories_layer3'
import { useWizard } from '../../../hooks/useWizard'
import type { AlternativaId } from '../../../types/docfap'
import { ProgressiveBlocks } from '../../ui/ProgressiveBlocks'
import type { ProgressiveBlockDef } from '../../ui/ProgressiveBlocks'

interface Props {
  alternativaId: 'A1' | 'A2' | 'A3'
}

const DEFAULT_VITA_UTILE = 20

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

  const [qty, setQty] = useState(() => (alt?.quantita && alt.quantita > 0 ? String(alt.quantita) : ''))
  const [cpStr, setCpStr] = useState('')          // user-selected CP (slider or manual)
  const [capexStr, setCapexStr] = useState('')
  const [capexIsCustom, setCapexIsCustom] = useState(false)
  const [opexPctStr, setOpexPctStr] = useState('')
  const [opexValStr, setOpexValStr] = useState('')
  const [durationStr, setDurationStr] = useState('')
  const [vitaUtileStr, setVitaUtileStr] = useState(() =>
    alt?.vitaUtileProgram && alt.vitaUtileProgram > 0 ? String(alt.vitaUtileProgram) : '',
  )

  // Refs for use inside effects without adding to deps
  const capexIsCustomRef = useRef(false)
  const opexPctStrRef = useRef(opexPctStr)
  opexPctStrRef.current = opexPctStr
  // Skip the category-reset on first mount so autofilled values survive.
  const firstCategoriaRun = useRef(true)

  // Sincronizza la quantità dallo store quando cambia dall'esterno (es. Autoriempi),
  // così i valori autofillati compaiono e il CAPEX viene ricalcolato.
  const storedQty = alt?.quantita ?? 0
  useEffect(() => {
    if (storedQty > 0 && focusedField !== `qty-${alternativaId}`) {
      setQty((prev) => (prev === String(storedQty) ? prev : String(storedQty)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedQty, alternativaId])

  // Sincronizza la vita utile dallo store (es. Autoriempi).
  const storedVitaUtile = alt?.vitaUtileProgram ?? 0
  useEffect(() => {
    if (storedVitaUtile > 0) {
      setVitaUtileStr((prev) => (prev === String(storedVitaUtile) ? prev : String(storedVitaUtile)))
    }
  }, [storedVitaUtile])

  // Reset everything when category changes
  useEffect(() => {
    if (firstCategoriaRun.current) {
      firstCategoriaRun.current = false
      return
    }
    setQty('')
    setCpStr('')
    setCapexStr('')
    setCapexIsCustom(false)
    capexIsCustomRef.current = false
    setOpexPctStr('')
    setOpexValStr('')
    setDurationStr('')
    setVitaUtileStr('')
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

  const vitaUtile = useMemo(() => {
    const v = parseInt(vitaUtileStr, 10)
    return isNaN(v) || v <= 0 ? 0 : v
  }, [vitaUtileStr])

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

  // Stepper della quota OPEX (% del CAPEX): è il controllo primario, il valore in
  // €/anno si ricalcola via handleOpexPctChange (come nel wizard di Valutazione).
  function stepOpexPct(delta: number) {
    const cur = parseFloat(opexPctStr)
    const base = isNaN(cur) ? (computed?.opexPctMed ?? 3) : cur
    const next = Math.round((base + delta) * 10) / 10
    handleOpexPctChange(String(Math.max(0, Math.min(100, next))))
  }

  // Stepper della vita utile (anni).
  function stepVitaUtile(delta: number) {
    const base = vitaUtile || DEFAULT_VITA_UTILE
    const next = Math.max(1, Math.min(100, base + delta))
    setVitaUtileStr(String(next))
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
      vitaUtileProgram: vitaUtile > 0 ? vitaUtile : undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capexStr, opexValStr, durationStr, vitaUtileStr, totalQty, alternativaId, addAlternativa])

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
  const capexNum = parseFloat(capexStr)
  const hasCapex = !isNaN(capexNum) && capexNum > 0
  const opexNum = parseFloat(opexValStr)
  const hasOpex = !isNaN(opexNum) && opexNum > 0

  // ── Block 1: Vita utile del progetto ─────────────────────────────────────
  const vitaUtileBlock: ReactNode = (
    <div style={blockBodyStyle}>
      <p style={questionStyle}>
        Per quanti anni il progetto sarà operativo dopo la fine dei lavori. L'OPEX annuo è sostenuto
        lungo tutta la vita utile del progetto.
      </p>
      <div>
        <p style={fieldHeadingStyle}>Anni di vita utile</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => stepVitaUtile(-5)}
            aria-label="Diminuisci vita utile"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink-200 bg-white text-[20px] font-bold text-ink-600 hover:border-ink-400 hover:bg-[#fafafa]"
          >
            −
          </button>
          <div className="relative w-[130px]">
            <input
              value={vitaUtileStr}
              onChange={(e) => setVitaUtileStr(e.target.value.replace(/\D/g, ''))}
              placeholder={`es. ${DEFAULT_VITA_UTILE}`}
              inputMode="numeric"
              className="h-10 w-full border border-brand-violet px-3 pr-14 text-center text-[16px] font-bold text-ink-900 focus:outline-none"
              aria-label="Vita utile in anni"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-ink-500">anni</span>
          </div>
          <button
            type="button"
            onClick={() => stepVitaUtile(5)}
            aria-label="Aumenta vita utile"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-violet bg-white text-[20px] font-bold text-brand-violet hover:bg-brand-violet-soft"
          >
            +
          </button>
        </div>
      </div>

      {/* Durata del cantiere — temporale, secondario */}
      <div style={dividerBlockStyle}>
        <p style={fieldHeadingStyle}>Durata del cantiere</p>
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
  )

  // ── Block 2: CAPEX (costo parametrico) ────────────────────────────────────
  const capexBlock: ReactNode = (
    <div style={blockBodyStyle}>
      {/* Quantità fisica */}
      <div>
        <p style={fieldHeadingStyle}>
          Quantità fisica dell'intervento
          {physUnit && <span style={udmTagStyle}>{physUnit}</span>}
        </p>
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

      {/* Costo parametrico (CP) */}
      {costoData && (
        <div style={dividerBlockStyle}>
          <p style={fieldHeadingStyle}>Costo parametrico (CP)</p>
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
        </div>
      )}

      {/* CAPEX stimato (editabile) */}
      <div style={dividerBlockStyle}>
        <div style={resultFieldHeaderStyle}>
          <span style={fieldHeadingStyle}>CAPEX stimato</span>
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
            placeholder="Inserisci importo"
            style={panelInputStyle}
            aria-label="CAPEX in euro"
          />
          <span style={udmBadgeStyle}>€</span>
        </div>
        {costoData && (
          <p style={questionStyle}>
            Collegato al costo parametrico: CAPEX = CP × quantità. Se lo modifichi, il valore resta
            personalizzato.
          </p>
        )}
      </div>
    </div>
  )

  // ── Block 3: OPEX annuo (% del CAPEX) ─────────────────────────────────────
  const opexBlock: ReactNode = (
    <div style={blockBodyStyle}>
      {!hasCapex ? (
        <p style={hintStyle} aria-live="polite">
          Conferma prima il CAPEX per stimare l'OPEX annuo.
        </p>
      ) : (
        <>
          <p style={questionStyle}>
            Costo operativo annuale del progetto. Lo esprimiamo prima in valore (€/anno) e poi come
            quota percentuale sul CAPEX, in linea con le prassi di settore.
          </p>
          <div>
            <span style={fieldHeadingStyle}>OPEX annuo stimato</span>
            {computed && (
              <div style={minMaxRowStyle}>
                <span style={minMaxItemStyle}>Min <strong>{computed.opexPctMin}%</strong></span>
                <span style={minMaxSepStyle}>·</span>
                <span style={minMaxItemStyle}>Max <strong>{computed.opexPctMax}%</strong></span>
              </div>
            )}
            <div style={panelInputRowStyle}>
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
            </div>
          </div>

          {/* Quota sul CAPEX — stepper percentuale */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] text-ink-500">Quota sul CAPEX</span>
            <button
              type="button"
              onClick={() => stepOpexPct(-0.1)}
              aria-label="Diminuisci quota OPEX"
              className="flex h-8 w-8 shrink-0 items-center justify-center border border-ink-200 bg-white text-[18px] font-bold text-ink-600 hover:border-ink-400 hover:bg-[#fafafa]"
            >
              −
            </button>
            <div className="relative w-[84px]">
              <input
                id={`opex-pct-${alternativaId}`}
                value={opexPctStr}
                inputMode="decimal"
                onChange={(e) => handleOpexPctChange(e.target.value)}
                className="h-8 w-full border border-ink-200 px-2 pr-6 text-center text-[14px] font-semibold text-ink-900 focus:border-brand-violet focus:outline-none"
                aria-label="OPEX come percentuale del CAPEX"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[12px] text-ink-400">%</span>
            </div>
            <button
              type="button"
              onClick={() => stepOpexPct(0.1)}
              aria-label="Aumenta quota OPEX"
              className="flex h-8 w-8 shrink-0 items-center justify-center border border-ink-200 bg-white text-[18px] font-bold text-brand-violet hover:border-brand-violet hover:bg-brand-violet-soft"
            >
              +
            </button>
          </div>
        </>
      )}
    </div>
  )

  const blocks: ProgressiveBlockDef[] = [
    {
      id: 'vita-utile',
      title: 'Vita utile del progetto',
      complete: vitaUtile > 0,
      confirmLabel: 'Conferma vita utile',
      summary: vitaUtile > 0
        ? `${vitaUtile} anni${durationStr ? ` · cantiere ${displayInt(durationStr, false)} mesi` : ''}`
        : undefined,
      children: vitaUtileBlock,
    },
    {
      id: 'capex',
      title: 'CAPEX — costo parametrico',
      complete: hasCapex,
      confirmLabel: 'Conferma CAPEX',
      summary: hasCapex ? formatEur(Math.round(capexNum)) : undefined,
      children: capexBlock,
    },
    {
      id: 'opex',
      title: 'OPEX annuo',
      complete: hasOpex,
      confirmLabel: 'Conferma OPEX',
      summary: hasOpex
        ? `${formatEur(Math.round(opexNum))}/anno${opexPctStr ? ` · ${opexPctStr}% del CAPEX` : ''}`
        : undefined,
      children: opexBlock,
    },
  ]

  return (
    <div style={rootStyle}>
      <ProgressiveBlocks blocks={blocks} />
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
  width: '100%',
}

const blockBodyStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

// Sezione interna separata da una linea superiore (stile Valutazione).
const dividerBlockStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  borderTop: '1px solid #ececf1',
  paddingTop: 'var(--spacing-stack-s)',
}

const emptyStyle: CSSProperties = {
  padding: 'var(--spacing-inset-m)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  color: 'var(--color-text-primary-light)',
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

const fieldHeadingStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-xs)',
  margin: 0,
  fontSize: 'var(--type-body-s-size, 14px)',
  fontWeight: 700,
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

const resultFieldHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-s)',
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
  maxWidth: '18rem',
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
