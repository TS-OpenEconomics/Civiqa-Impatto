import { useId, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { CER_VOUCHER_EDU_0_3 } from '../../../data/cerVoucher'
import { getCostiByCategory, calcolaCostoTipologia } from '../../../data/poc_docfap/costi_per_tipologia'
import type { TipologiaIntervento } from '../../../data/poc_docfap/costi_per_tipologia'
import { INTERVENTION_CATEGORIES } from '../../../data/poc_docfap/intervention_categories_layer3'
import { useWizard } from '../../../hooks/useWizard'
import type { AlternativaData, AlternativaId, NaturaCUP } from '../../../types/docfap'
import { formatEuro } from '../../../utils/format'
import { RobustnessSemaphore } from '../../ui/RobustnessSemaphore'
import { SelectField } from '../../ui/SelectField'
import { getDurataDisplayValue } from './step3DurataStimata.logic'

const FAB_CON_VOUCHER = new Set(['FAB-01'])

const TIPOLOGIA_LABELS: Record<string, string> = {
  nuova_realizzazione: 'Nuova realizzazione',
  ristrutturazione: 'Ristrutturazione',
  ristrutturazione_efficientamento: 'Ristrutturazione con efficientamento energetico',
  manutenzione_straordinaria_ee: 'Manutenzione straordinaria con efficientamento energetico',
  manutenzione_ordinaria: 'Manutenzione ordinaria',
  restauro: 'Restauro',
  recupero: 'Recupero',
  ampliamento_potenziamento: 'Ampliamento / potenziamento',
  ammodernamento_tecnologico: 'Ammodernamento tecnologico',
  demolizione: 'Demolizione',
  lavori_socialmente_utili: 'Lavori socialmente utili',
  altro: 'Altro',
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

function formatCosto(value: number): string {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

const TIPO_ALTERNATIVA_OPTIONS = [
  { value: 'infrastruttura', label: 'Intervento infrastrutturale / servizio' },
  { value: 'voucher', label: 'Erogazione voucher / contributo diretto alle famiglie' },
]

type CardAlternativaId = 'A1' | 'A2' | 'A3'

interface Step3_2AlternativaCardProps {
  alternativaId: CardAlternativaId
  optional?: boolean
  /** Quando true non disegna la card esterna (è già dentro un blocco). */
  embedded?: boolean
}

function defaultAlternative(): AlternativaData {
  return {
    categoria: '',
    tipologia: '',
    quantita: 0,
    capex: 0,
    opex: 0,
    nome: '',
    clusterId: null,
    durataStimata: null,
  }
}

function getAlternativaOrdinalLabel(alternativaId: CardAlternativaId): string {
  return `Alternativa ${alternativaId.slice(1)}`
}

export function Step3_2_AlternativaCard({
  alternativaId,
  optional = false,
  embedded = false,
}: Step3_2AlternativaCardProps) {
  const { state, addAlternativa, setCluster } = useWizard()
  const [expanded, setExpanded] = useState(!optional)
  const [voucherTooltipOpen, setVoucherTooltipOpen] = useState(false)
  const tooltipId = useId()
  const tooltipTriggerRef = useRef<HTMLButtonElement>(null)

  const current = state.alternative[alternativaId] ?? defaultAlternative()
  const alternativaLabel = getAlternativaOrdinalLabel(alternativaId)
  const [notesOpen, setNotesOpen] = useState(false)
  const notesId = useId()

  const costoStimato = useMemo(() => {
    if (!current.categoria || !current.tipologia) return null
    const costiCode = LAYER3_TO_COSTI[current.tipologia]
    if (!costiCode) return null
    const records = getCostiByCategory(current.categoria)
    if (records.length === 0) return null
    const rec = records[0]
    const costo = calcolaCostoTipologia(rec, costiCode)
    if (!costo) return null
    const tip = rec.tipologie.find((t) => t.code === costiCode)
    return {
      ...costo,
      fonte_principale: rec.fonte_principale,
      fonti_secondarie: rec.fonti_secondarie,
      note_metodologiche: rec.note_metodologiche,
      note_intervento: rec.note_intervento,
      pct_min: tip?.pct_min ?? 0,
      pct_max: tip?.pct_max ?? 0,
      pct_med: tip?.pct_med ?? 0,
    }
  }, [current.categoria, current.tipologia])

  const categoriaOptions = useMemo(() => {
    const fabId = state.fabId
    if (!fabId) return []

    return INTERVENTION_CATEGORIES
      .filter((cat) => cat.fabbisogno_codes.includes(fabId))
      .map((cat) => ({ value: cat.code, label: `${cat.code} · ${cat.label}` }))
      .sort((a, b) => a.label.localeCompare(b.label, 'it-IT'))
  }, [state.fabId])

  const tipologiaOptions = useMemo(() => {
    if (!current.categoria) return []

    const category = INTERVENTION_CATEGORIES.find((c) => c.code === current.categoria)
    if (!category) return []

    return category.tipologie_links
      .filter((t) => t.applicable)
      .map((t) => ({
        value: t.tipologia_code,
        label: TIPOLOGIA_LABELS[t.tipologia_code] ?? t.tipologia_code,
      }))
  }, [current.categoria])

  const updateAlternative = (patch: Partial<AlternativaData>) => {
    addAlternativa(alternativaId as AlternativaId, { ...current, ...patch })
  }

  const handleCategoriaChange = (categoria: string) => {
    const category = INTERVENTION_CATEGORIES.find((c) => c.code === categoria)
    const clusterId = category?.cluster_id && category.cluster_id !== 'NONE'
      ? category.cluster_id
      : null
    updateAlternative({
      categoria,
      tipologia: '',
      nome: '',
      clusterId,
      unitaMisura: undefined,
      robustezza: undefined,
      durataStimata: null,
    })
    if (alternativaId === 'A1') {
      setCluster(clusterId)
    }
  }

  const hasVoucherOption = FAB_CON_VOUCHER.has(state.fabId ?? '')
  const tipoCorrente: NaturaCUP = current.naturaCup ?? 'infrastruttura'
  const isVoucher = tipoCorrente === 'voucher'

  const handleTipoAlternativaChange = (tipo: string) => {
    if (tipo === 'voucher') {
      updateAlternative({
        naturaCup: 'voucher',
        categoria: '__VOUCHER__',
        tipologia: CER_VOUCHER_EDU_0_3.id,
        nome: 'Erogazione voucher / contributo diretto alle famiglie',
        capex: 0,
        opex: 0,
        clusterId: null,
        unitaMisura: 'alunno',
        robustezza: undefined,
        durataStimata: null,
        nBeneficiari: 0,
        vitaUtileProgram: 5,
      })
      return
    }

    updateAlternative({
      naturaCup: 'infrastruttura',
      categoria: '',
      tipologia: '',
      nome: '',
      capex: 0,
      opex: 0,
      clusterId: null,
      unitaMisura: undefined,
      robustezza: undefined,
      durataStimata: null,
      nBeneficiari: undefined,
      vitaUtileProgram: undefined,
    })
  }

  const handleTipologiaChange = (tipologia: string) => {
    const category = INTERVENTION_CATEGORIES.find((c) => c.code === current.categoria)
    const clusterId = category?.cluster_id && category.cluster_id !== 'NONE'
      ? category.cluster_id
      : null
    const durataEntry = category?.construction_durations.find(
      (d) => d.tipologia_code === tipologia,
    )
    const costiCode = LAYER3_TO_COSTI[tipologia]
    const costiRecords = getCostiByCategory(current.categoria)
    const unitaMisura = costiCode && costiRecords.length > 0 ? costiRecords[0].udm : undefined

    updateAlternative({
      tipologia,
      clusterId,
      unitaMisura,
      robustezza: undefined,
      durataStimata: current.durataStimata ?? durataEntry?.duration_months ?? null,
    })

    if (clusterId) {
      setCluster(clusterId)
    }
  }

  const collapseId = `alternativa-panel-${alternativaId}`
  const isVisible = !optional || expanded

  return (
    <section style={embedded ? undefined : cardStyle} aria-label={alternativaLabel}>
      <style>{`
        .alt-card-collapse {
          overflow: hidden;
          transition: max-height 0.25s ease, opacity 0.25s ease;
        }
        .alt-card-collapse[data-open="true"] {
          max-height: 1200px;
          opacity: 1;
        }
        .alt-card-collapse[data-open="false"] {
          max-height: 0;
          opacity: 0;
        }
        .alt-card-toggle:focus-visible,
        .alt-card-tooltip-trigger:focus-visible {
          outline: none;
          box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
        }
      `}</style>

      {/* Header interno solo quando la card è opzionale (step "Aggiungi alternative",
          dove più card stanno insieme). Nello step di setup il titolo lo dà già il
          WizardShell ("Configura Alternativa N") → evita il doppio titolo. */}
      {optional && (
        <div style={cardHeaderStyle}>
          <span style={cardLabelStyle}>{alternativaLabel}</span>
          <button
            type="button"
            className="alt-card-toggle"
            aria-expanded={expanded}
            aria-controls={collapseId}
            onClick={() => setExpanded((prev) => !prev)}
            style={toggleButtonStyle}
          >
            {expanded ? 'Rimuovi' : 'Aggiungi alternativa'}
          </button>
        </div>
      )}

      <div
        id={collapseId}
        className="alt-card-collapse"
        data-open={String(isVisible)}
        aria-hidden={!isVisible}
      >
        <div style={embedded ? contentEmbeddedStyle : contentStyle}>
          {hasVoucherOption && (
            <SelectField
              label="Tipo alternativa"
              value={tipoCorrente}
              onChange={handleTipoAlternativaChange}
              options={TIPO_ALTERNATIVA_OPTIONS}
              required={!optional}
            />
          )}

          {isVoucher ? (
            <div style={voucherInfoBoxStyle} role="note" aria-label="Informazioni alternativa voucher">
              <p style={voucherInfoTitleStyle}>Alternativa non infrastrutturale - voucher / contributo</p>
              <dl style={cerListStyle}>
                <div style={cerRowStyle}>
                  <dt style={cerTermStyle}>Unità di misura</dt>
                  <dd style={cerValueStyle}>€ / alunno / anno</dd>
                </div>
                <div style={cerRowStyle}>
                  <dt style={cerTermStyle}>Costo unitario CER</dt>
                  <dd style={cerValueStyle}>
                    <span style={monoStyle}>€ {CER_VOUCHER_EDU_0_3.cerUnitario.toLocaleString('it-IT')} / alunno</span>
                    <span style={tooltipWrapStyle}>
                      <button
                        ref={tooltipTriggerRef}
                        type="button"
                        className="alt-card-tooltip-trigger"
                        aria-label="Fonte del valore CER voucher"
                        aria-expanded={voucherTooltipOpen}
                        aria-controls={tooltipId}
                        onClick={() => setVoucherTooltipOpen((open) => !open)}
                        onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
                          if (event.key === 'Escape') setVoucherTooltipOpen(false)
                        }}
                        style={tooltipTriggerStyle}
                      >
                        i
                      </button>
                      <span id={tooltipId} role="tooltip" hidden={!voucherTooltipOpen} style={tooltipStyle}>
                        <strong>Proxy letteratura</strong> - valore non da OpenCoesione.<br />
                        {CER_VOUCHER_EDU_0_3.fonte}.<br />
                        <em>{CER_VOUCHER_EDU_0_3.note}</em>
                      </span>
                    </span>
                  </dd>
                </div>
                <div style={cerRowStyle}>
                  <dt style={cerTermStyle}>Qualità stima</dt>
                  <dd style={cerValueStyle}>
                    <span style={proxyBadgeStyle}>proxy_letteratura</span>
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <>
              <p style={sectionTitleStyle}>Seleziona la categoria di intervento</p>

              <SelectField
                label="Categoria intervento"
                value={current.categoria}
                onChange={handleCategoriaChange}
                options={categoriaOptions}
                placeholder="Seleziona categoria"
                required={!optional}
              />

              <SelectField
                label="Tipologia intervento"
                value={current.tipologia}
                onChange={handleTipologiaChange}
                options={tipologiaOptions}
                placeholder={current.categoria ? 'Seleziona tipologia' : 'Seleziona prima una categoria'}
                disabled={!current.categoria}
                required={!optional}
                aria-disabled={!current.categoria}
              />

              <div aria-live="polite" style={costoBoxStyle}>
                <p style={costoBoxTitleStyle}>Costo parametrico stimato</p>

                {costoStimato ? (
                  <div style={costoContentStyle}>
                    <div style={costoMainRowStyle}>
                      <span style={costoValueStyle}>{formatCosto(costoStimato.val_med)}</span>
                      <span style={costoUdmStyle}>{costoStimato.udm}</span>
                    </div>
                    <p style={costoRangeStyle}>
                      Range: {formatCosto(costoStimato.val_min)} — {formatCosto(costoStimato.val_max)}
                      <span style={costoRangePctStyle}>
                        ({costoStimato.pct_min}%–{costoStimato.pct_max}% della nuova realizzazione)
                      </span>
                    </p>

                    <div style={notesWrapStyle}>
                      <button
                        type="button"
                        aria-expanded={notesOpen}
                        aria-controls={notesId}
                        onClick={() => setNotesOpen((o) => !o)}
                        style={notesToggleStyle}
                        className="alt-card-toggle"
                      >
                        {notesOpen ? '▾' : '▸'} Note metodologiche e fonti
                      </button>
                      <div id={notesId} hidden={!notesOpen} style={notesBodyStyle}>
                        {costoStimato.note_metodologiche && (
                          <p style={noteTextStyle}>{costoStimato.note_metodologiche}</p>
                        )}
                        <dl style={fontiListStyle}>
                          {costoStimato.fonte_principale && (
                            <div style={fontiRowStyle}>
                              <dt style={fontiTermStyle}>Fonte principale</dt>
                              <dd style={fontiValueStyle}>{costoStimato.fonte_principale}</dd>
                            </div>
                          )}
                          {costoStimato.fonti_secondarie && (
                            <div style={fontiRowStyle}>
                              <dt style={fontiTermStyle}>Fonti secondarie</dt>
                              <dd style={fontiValueStyle}>{costoStimato.fonti_secondarie}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>

                    <p style={disclaimerStyle}>
                      I valori indicati sono stime parametriche basate su fonti istituzionali e banche dati OpenCoesione. Il costo effettivo dipende dalle specifiche progettuali, dalla localizzazione e dalle condizioni di mercato.
                    </p>
                  </div>
                ) : (
                  <p style={costoEmptyStyle}>
                    {current.categoria
                      ? 'Seleziona una tipologia per visualizzare il costo parametrico stimato.'
                      : 'Seleziona categoria e tipologia per visualizzare il costo parametrico stimato.'}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
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

const toggleButtonStyle: CSSProperties = {
  border: '1px solid var(--color-border-primary)',
  borderRadius: 'var(--radius-smooth)',
  padding: '4px 12px',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary)',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

const contentStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  padding: 'var(--spacing-inset-s)',
}
const contentEmbeddedStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  padding: 0,
}

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
}

const costoBoxStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: 'var(--spacing-inset-s)',
  background: 'var(--color-background-secondary-lightest)',
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
}

const costoBoxTitleStyle: CSSProperties = {
  margin: 0,
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

const costoContentStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const costoMainRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
}

const costoValueStyle: CSSProperties = {
  fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
  fontSize: '22px',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}

const costoUdmStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

const costoRangeStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  alignItems: 'baseline',
}

const costoRangePctStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontSize: '12px',
}

const notesWrapStyle: CSSProperties = {
  display: 'grid',
  gap: '6px',
}

const notesToggleStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '2px 0',
  cursor: 'pointer',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 600,
  textAlign: 'left',
}

const notesBodyStyle: CSSProperties = {
  display: 'grid',
  gap: '8px',
  paddingLeft: '14px',
  borderLeft: '2px solid var(--color-border-secondary-light)',
}

const noteTextStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  lineHeight: 1.5,
}

const fontiListStyle: CSSProperties = {
  display: 'grid',
  gap: '4px',
  margin: 0,
}

const fontiRowStyle: CSSProperties = {
  display: 'grid',
  gap: '2px',
}

const fontiTermStyle: CSSProperties = {
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: '12px',
}

const fontiValueStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: '12px',
}

const disclaimerStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: '11px',
  fontStyle: 'italic',
  lineHeight: 1.4,
}

const costoEmptyStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

// Stili voucher mantenuti per la sezione separata
const cerListStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  margin: 0,
}

const cerRowStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-s)',
  alignItems: 'flex-start',
}

const cerTermStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  minWidth: '140px',
}

const cerValueStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
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
  right: 0,
  zIndex: 200,
  width: 320,
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

const voucherInfoBoxStyle: CSSProperties = {
  border: '1px solid var(--color-border-info, var(--color-border-primary))',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-info-light, var(--color-background-secondary-lightest))',
  padding: 'var(--spacing-inset-s)',
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const voucherInfoTitleStyle: CSSProperties = {
  margin: 0,
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

const monoStyle: CSSProperties = {
  fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
  fontWeight: 700,
}

const proxyBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: 'var(--radius-rounded)',
  background: 'var(--color-background-warning-lighter)',
  color: 'var(--color-text-warning)',
  border: '1px solid var(--color-border-warning)',
  fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
  fontSize: '12px',
  fontWeight: 700,
}
