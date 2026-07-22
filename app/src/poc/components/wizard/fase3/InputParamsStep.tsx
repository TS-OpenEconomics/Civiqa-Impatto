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

// Garantisce tre valori di riferimento sempre distinti (min < media < max) per i
// box laterali: la media di settore a volte coincide col minimo o col massimo, e
// alcune categorie hanno min/med/max uguali. `decimals` controlla la precisione
// (0 per gli anni di vita utile, 1 per le percentuali OPEX).
function spreadThree(min: number, media: number, max: number, decimals = 0): { min: number; media: number; max: number } {
  const step = decimals > 0 ? Math.pow(10, -decimals) : 1
  const round = (n: number) => Number(n.toFixed(decimals))
  let lo = round(Math.min(min, max))
  let hi = round(Math.max(min, max))
  if (lo === hi) {
    // Tutti i valori coincidono: apri una forbice ±20% attorno al valore.
    lo = round(Math.max(step, hi * 0.8))
    hi = round(hi * 1.2)
  }
  let mid = round(media)
  if (mid <= lo) mid = round(lo + step)
  if (mid >= hi) hi = round(mid + step)
  return { min: lo, media: mid, max: hi }
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

  // Vita utile consigliata (media di settore per la tipologia) — mostrata nel box laterale.
  const recommendedVitaUtile = useMemo(() => {
    if (!categoryData || !tipologia) return null
    return categoryData.useful_life?.find(u => u.tipologia_code === tipologia)?.years ?? null
  }, [categoryData, tipologia])

  // Riferimenti di vita utile (min / media di settore / max) ricavati dall'intera
  // categoria. La media è la media aritmetica delle tipologie (non il valore
  // consigliato della singola tipologia, che poteva coincidere col min o col max):
  // così i tre riferimenti sono sempre tre valori distinti.
  const vitaUtileRef = useMemo(() => {
    const arr = categoryData?.useful_life
    if (!arr || arr.length === 0) return null
    const years = arr.map((u) => u.years)
    const avg = years.reduce((a, b) => a + b, 0) / years.length
    return spreadThree(Math.min(...years), avg, Math.max(...years), 0)
  }, [categoryData])

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
    // Quota OPEX come % del CAPEX: tre riferimenti sempre distinti (min < media < max).
    const opexPct = spreadThree(opex.pct_min * 100, opex.pct_med * 100, opex.pct_max * 100, 1)
    return {
      capexFromCp,
      capexRefMin,
      capexRefMax,
      opexPctMin: opexPct.min,
      opexPctMed: opexPct.media,
      opexPctMax: opexPct.max,
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
    const base = vitaUtile || recommendedVitaUtile || DEFAULT_VITA_UTILE
    const next = Math.max(1, Math.min(100, base + delta))
    setVitaUtileStr(String(next))
  }

  // Stepper della durata cantiere (mesi) — stessa interazione della vita utile.
  function stepDuration(delta: number) {
    const base = parseInt(durationStr, 10) || durationMonths || 12
    const next = Math.max(1, Math.min(600, base + delta))
    setDurationStr(String(next))
  }

  // ── Auto-save to wizard store ─────────────────────────────────────────────

  useEffect(() => {
    if (!altRef.current) return
    const capex = parseFloat(capexStr)
    const opex = parseFloat(opexValStr)
    const duration = parseInt(durationStr)
    const capexOk = !isNaN(capex) && capex > 0
    // Modalità "solo OPEX" (voucher): CAPEX 0 ma OPEX valido → si salva comunque.
    const opexOnly = (isNaN(capex) || capex === 0) && !isNaN(opex) && opex > 0
    if (!capexOk && !opexOnly) return
    addAlternativa(alternativaId as AlternativaId, {
      ...altRef.current,
      quantita: totalQty,
      capex: capexOk ? capex : 0,
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
  // CAPEX confermato esplicitamente a 0 (es. voucher: nessun investimento fisico).
  // Distinto dal campo vuoto (non ancora compilato): abilita la modalità "solo OPEX".
  const capexIsZeroConfirmed = capexStr.trim() !== '' && !isNaN(capexNum) && capexNum === 0
  const capexBlockComplete = hasCapex || capexIsZeroConfirmed
  const opexNum = parseFloat(opexValStr)
  const hasOpex = !isNaN(opexNum) && opexNum > 0
  const categoryLabel = categoryData?.label ?? ''

  // Periodo operativo OPEX: parte l'anno dopo la fine del cantiere (anno corrente +
  // durata cantiere in anni) e dura quanto la vita utile.
  const currentYear = new Date().getFullYear()
  const constructionYears = durationStr ? Math.ceil((parseInt(durationStr, 10) || 0) / 12) : 0
  const opexStartYear = currentYear + constructionYears
  const opexEndYear = vitaUtile > 0 ? opexStartYear + vitaUtile - 1 : null

  // ── Block 1: Vita utile del progetto ─────────────────────────────────────
  const durationNum = parseInt(durationStr, 10)
  const hasDuration = !isNaN(durationNum) && durationNum > 0

  const durationBlock: ReactNode = (
    <div style={blockBodyStyle}>
      <p style={questionStyle}>Indica la durata prevista del cantiere.</p>
      <div>
        <p style={fieldHeadingStyle}>Durata cantiere</p>
        <Stepper
          value={durationStr}
          onInput={setDurationStr}
          onStep={stepDuration}
          step={1}
          suffix="mesi"
          ariaLabel="durata cantiere"
          placeholder={durationMonths != null ? `es. ${durationMonths}` : ''}
        />
      </div>
    </div>
  )

  const vitaUtileBlock: ReactNode = (
    <div style={blockBodyStyle}>
      <p style={questionStyle}>
        Per quanti anni il progetto sarà operativo dopo la fine dei lavori. L'OPEX annuo è sostenuto
        lungo tutta la vita utile del progetto.
      </p>

      {/* Vita utile: stepper + box di riferimento (stile wizard Valutazione) */}
      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink-900">Anni di vita utile</p>
          <Stepper
            value={vitaUtileStr}
            onInput={setVitaUtileStr}
            onStep={stepVitaUtile}
            step={5}
            suffix="anni"
            ariaLabel="vita utile"
            placeholder={`es. ${recommendedVitaUtile ?? DEFAULT_VITA_UTILE}`}
          />
          {opexEndYear && (
            <div className="mt-4 flex items-center gap-3 border border-ink-100 bg-[#f7f7fa] px-4 py-3">
              <div className="h-3 w-3 shrink-0 rounded-full bg-brand-violet" />
              <p className="text-[13px] text-ink-700">
                OPEX attivo dal <strong>{opexStartYear}</strong> al <strong>{opexEndYear}</strong>
              </p>
            </div>
          )}
          {vitaUtileRef && (
            <button
              type="button"
              onClick={() => setVitaUtileStr(String(vitaUtileRef.media))}
              className="mt-4 w-fit text-[12px] font-semibold text-brand-violet hover:underline"
            >
              Usa media di settore
            </button>
          )}
        </div>

        {vitaUtileRef && (
          <aside className="h-fit border border-[#e8e8ed] bg-white p-5">
            <p className="text-[14px] font-semibold text-ink-900">Vita utile tipica</p>
            <p className="mt-1 text-[12px] leading-[1.5] text-ink-600">
              Riferimenti per <strong>{categoryLabel || 'questa tipologia'}</strong>.
            </p>
            <div className="mt-5 space-y-3 border-t border-[#ececf1] pt-4">
              {[
                { label: 'Minima', val: vitaUtileRef.min },
                { label: 'Media di settore', val: vitaUtileRef.media },
                { label: 'Massima', val: vitaUtileRef.max },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[13px] text-ink-600">{label}</span>
                  <span className="text-[15px] font-bold text-ink-900">{val} anni</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="relative h-[6px] w-full overflow-hidden bg-[#e7e7ea]">
                <div
                  className="absolute h-full bg-brand-violet/30"
                  style={{
                    left: `${(vitaUtileRef.min / vitaUtileRef.max) * 100}%`,
                    width: `${((vitaUtileRef.max - vitaUtileRef.min) / vitaUtileRef.max) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-ink-400">
                <span>{vitaUtileRef.min} anni</span>
                <span>{vitaUtileRef.max} anni</span>
              </div>
            </div>
            {vitaUtile > 0 && (
              <div className="mt-5 border-t border-[#ececf1] pt-4 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Valore impostato</p>
                <p className="mt-1 text-[26px] font-bold text-brand-violet">{vitaUtile}</p>
                <p className="text-[12px] text-ink-500">anni</p>
              </div>
            )}
          </aside>
        )}
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

      {/* Il costo parametrico e il CAPEX stimato si sbloccano solo dopo aver
          inserito la quantità fisica: il CAPEX è CP × quantità, quindi senza
          quantità non c'è una stima sensata. */}
      {totalQty <= 0 ? (
        <p style={hintStyle} aria-live="polite">
          Inserisci prima la quantità fisica dell'intervento: il CAPEX viene stimato come costo
          parametrico × quantità.
        </p>
      ) : (
        <>
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
              <span>medio {costoData.val_med.toLocaleString('it-IT')}</span>
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
        </>
      )}
    </div>
  )

  // Block 4: OPEX
  const opexBlock: ReactNode = (
    <div style={blockBodyStyle}>
      {!hasCapex ? (
        capexIsZeroConfirmed ? (
          <div style={blockBodyStyle}>
            <p style={questionStyle}>
              Questa alternativa non prevede un investimento (CAPEX 0): inserisci direttamente il
              costo operativo annuo (es. trasferimenti/voucher alle famiglie).
            </p>
            <div>
              <p style={fieldHeadingStyle}>OPEX annuo</p>
              <div style={panelInputRowStyle}>
                <input
                  id={`opex-abs-${alternativaId}`}
                  type="text"
                  inputMode="numeric"
                  value={displayInt(opexValStr, focusedField === `opex-abs-${alternativaId}`)}
                  onChange={(e) => handleOpexValChange(stripDots(e.target.value))}
                  onFocus={() => setFocusedField(`opex-abs-${alternativaId}`)}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Inserisci importo"
                  style={panelInputStyle}
                  aria-label="OPEX annuo in euro"
                />
                <span style={udmBadgeStyle}>€/anno</span>
              </div>
            </div>
          </div>
        ) : (
          <p style={hintStyle} aria-live="polite">
            Conferma prima il CAPEX per stimare l'OPEX annuo.
          </p>
        )
      ) : (
        <>
          <p style={questionStyle}>
            Costo operativo annuale del progetto. Lo esprimiamo prima in valore (€/anno) e poi come
            quota percentuale sul CAPEX, in linea con le prassi di settore.
          </p>
          <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
            <div style={blockBodyStyle}>
              {/* OPEX annuale stimato — box primario (derivato dalla quota %) */}
              <div className="border-l-[3px] border-brand-violet bg-brand-violet-soft px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">OPEX annuale stimato</p>
                <p className="mt-1 text-[28px] font-bold leading-none text-ink-900">
                  {hasOpex ? `${Math.round(opexNum).toLocaleString('it-IT')} €` : '—'}
                </p>
                <p className="mt-1.5 text-[12px] text-ink-500">
                  Costo operativo medio sostenuto ogni anno della vita utile del progetto.
                </p>
              </div>

              {/* Quota annua sul CAPEX — controllo secondario */}
              <div>
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-500">Quota annua sul CAPEX</p>
                <p className="mb-2 text-[12px] leading-[1.5] text-ink-500">
                  Esprime l'OPEX annuale come percentuale del CAPEX. Usa i pulsanti per regolarla; il valore in € si aggiorna automaticamente.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => stepOpexPct(-0.1)}
                    aria-label="Diminuisci quota OPEX"
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink-200 bg-white text-[20px] font-bold text-ink-600 hover:border-ink-400 hover:bg-[#fafafa]"
                  >
                    −
                  </button>
                  <div className="relative w-[120px]">
                    <input
                      id={`opex-pct-${alternativaId}`}
                      value={opexPctStr}
                      inputMode="decimal"
                      onChange={(e) => handleOpexPctChange(e.target.value)}
                      className="h-10 w-full border border-brand-violet px-3 pr-8 text-center text-[16px] font-bold text-ink-900 focus:outline-none"
                      aria-label="OPEX come percentuale del CAPEX"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-ink-500">%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => stepOpexPct(0.1)}
                    aria-label="Aumenta quota OPEX"
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-violet bg-white text-[20px] font-bold text-brand-violet hover:bg-brand-violet-soft"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {computed && (
              <aside className="h-fit border border-[#e8e8ed] bg-white p-5">
                <p className="text-[14px] font-semibold text-ink-900">Tasso OPEX di riferimento</p>
                <p className="mt-1 text-[12px] leading-[1.5] text-ink-600">
                  Valori tipici per <strong>{categoryLabel || 'questa tipologia'}</strong>, come % annua del CAPEX.
                </p>
                <div className="mt-5 space-y-3 border-t border-[#ececf1] pt-4">
                  {[
                    { label: 'Minimo', val: computed.opexPctMin },
                    { label: 'Media di settore', val: computed.opexPctMed },
                    { label: 'Massimo', val: computed.opexPctMax },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[13px] text-ink-600">{label}</span>
                      <span className="text-[15px] font-bold text-ink-900">{val}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="relative h-[6px] w-full overflow-hidden bg-[#e7e7ea]">
                    <div
                      className="absolute h-full bg-brand-violet/30"
                      style={{
                        left: `${(computed.opexPctMin / computed.opexPctMax) * 100}%`,
                        width: `${((computed.opexPctMax - computed.opexPctMin) / computed.opexPctMax) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-ink-400">
                    <span>{computed.opexPctMin}%</span>
                    <span>{computed.opexPctMax}%</span>
                  </div>
                </div>
                <div className="mt-5 space-y-3 border-t border-[#ececf1] pt-4">
                  {vitaUtile > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-ink-500">Vita utile</span>
                      <span className="text-[13px] font-semibold text-ink-900">{vitaUtile} anni</span>
                    </div>
                  )}
                  {opexEndYear && (
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-ink-500">Periodo OPEX</span>
                      <span className="text-[13px] font-semibold text-ink-900">{opexStartYear}–{opexEndYear}</span>
                    </div>
                  )}
                  {opexPctStr && (
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-ink-500">Tasso selezionato</span>
                      <span className="text-[15px] font-bold text-brand-violet">{opexPctStr}%</span>
                    </div>
                  )}
                </div>
                {vitaUtile > 0 && hasOpex && (
                  <div className="mt-4 border-t border-[#ececf1] pt-4 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">OPEX totale stimato</p>
                    <p className="mt-1 text-[20px] font-bold text-ink-900">
                      {Math.round(opexNum * vitaUtile).toLocaleString('it-IT')} €
                    </p>
                    <p className="text-[12px] text-ink-500">su {vitaUtile} anni</p>
                  </div>
                )}
              </aside>
            )}
          </div>
        </>
      )}
    </div>
  )

  const blocks: ProgressiveBlockDef[] = [
    {
      id: 'durata-cantiere',
      title: 'Durata cantiere',
      complete: hasDuration,
      summary: hasDuration ? `${displayInt(durationStr, false)} mesi` : undefined,
      children: durationBlock,
    },
    {
      id: 'vita-utile',
      title: 'Vita utile del progetto',
      complete: vitaUtile > 0,
      summary: vitaUtile > 0 ? `${vitaUtile} anni` : undefined,
      children: vitaUtileBlock,
    },
    {
      id: 'capex',
      title: 'CAPEX',
      complete: capexBlockComplete,
      summary: hasCapex
        ? formatEur(Math.round(capexNum))
        : capexIsZeroConfirmed
          ? 'Nessun investimento (CAPEX 0)'
          : undefined,
      children: capexBlock,
    },
    {
      id: 'opex',
      title: 'OPEX annuo',
      complete: hasOpex,
      summary: hasOpex
        ? `${formatEur(Math.round(opexNum))}/anno${hasCapex && opexPctStr ? ` - ${opexPctStr}% del CAPEX` : ''}`
        : undefined,
      children: opexBlock,
    },
  ]
  return (
    <div style={rootStyle}>
      <ProgressiveBlocks blocks={blocks} sequential lockAllSignal={state.autofillTick} />
    </div>
  )
}

// ── UI atoms ────────────────────────────────────────────────────────────────

// Stepper numerico con pulsanti −/+ (vita utile, durata cantiere). Gli input
// accettano solo cifre; lo step è applicato dal chiamante via onStep(delta).
function Stepper({
  value,
  onInput,
  onStep,
  step,
  suffix,
  ariaLabel,
  placeholder,
}: {
  value: string
  onInput: (v: string) => void
  onStep: (delta: number) => void
  step: number
  suffix: string
  ariaLabel: string
  placeholder?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onStep(-step)}
        aria-label={`Diminuisci ${ariaLabel}`}
        className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink-200 bg-white text-[20px] font-bold text-ink-600 hover:border-ink-400 hover:bg-[#fafafa]"
      >
        −
      </button>
      <div className="relative w-[130px]">
        <input
          value={value}
          onChange={(e) => onInput(e.target.value.replace(/\D/g, ''))}
          placeholder={placeholder}
          inputMode="numeric"
          className="h-10 w-full border border-brand-violet px-3 pr-14 text-center text-[16px] font-bold text-ink-900 focus:outline-none"
          aria-label={ariaLabel}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-ink-500">{suffix}</span>
      </div>
      <button
        type="button"
        onClick={() => onStep(step)}
        aria-label={`Aumenta ${ariaLabel}`}
        className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-violet bg-white text-[20px] font-bold text-brand-violet hover:bg-brand-violet-soft"
      >
        +
      </button>
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
