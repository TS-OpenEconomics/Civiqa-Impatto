import { useSyncExternalStore, useState, useRef, useId, useEffect } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { wizardStore } from '../store/wizardStore'
import { loadDocfapDemo } from '../data/docfapDemo'
import { FABBISOGNI } from '../data/taxonomy/fabbisogni'
import { TEMI_RELAZIONI } from '../data/taxonomy/temi-relazioni'
import { formatEuro } from '../utils/format'
import { TabRiepilogo } from '../components/docfap/TabRiepilogo'
import { TabCBA } from '../components/docfap/TabCBA'
import { TabMCA } from '../components/docfap/TabMCA'
import { TabImpatto } from '../components/docfap/TabImpatto'
import { TabSensitivita } from '../components/docfap/TabSensitivita'
import {
  formatScore,
  getAlternativeDisplayLabel,
  getRecommendedAlternativeId,
  hasRenderableDocfapScores,
  safeNumber,
} from '../components/docfap/tableHelpers'

type TabId = 'riepilogo' | 'cba' | 'mca' | 'risk' | 'impatto'

const TABS: { id: TabId; label: string }[] = [
  { id: 'riepilogo', label: 'Riepilogo' },
  { id: 'cba', label: 'Analisi Costi Benefici' },
  { id: 'mca', label: 'Analisi MCA' },
  { id: 'risk', label: 'Analisi del Rischio' },
  { id: 'impatto', label: "Analisi d'impatto" },
]

const SCOPED_CSS = `
  .dd-tab {
    border: none;
    border-bottom: 3px solid transparent;
    background: transparent;
    color: var(--color-text-primary-light);
    padding: var(--spacing-inset-xs) var(--spacing-inset-s);
    cursor: pointer;
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: 600;
    white-space: nowrap;
    transition: color 0.15s ease, border-color 0.15s ease;
    margin-bottom: -1px;
  }
  .dd-tab:hover {
    color: var(--color-text-secondary);
  }
  .dd-tab[aria-selected="true"] {
    border-bottom-color: var(--color-background-primary);
    color: var(--color-text-secondary);
    font-weight: 700;
  }
  .dd-tab:focus-visible,
  .dd-action-link:focus-visible {
    outline: none;
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
  }
`

function IconDoc() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  )
}

function statusBadgeColors(stato: string): CSSProperties {
  if (stato === 'Completato') {
    return { background: 'var(--color-background-success-lighter)', color: 'var(--color-text-success)' }
  }
  return { background: 'var(--color-background-secondary-lightest)', color: 'var(--color-text-primary-light)' }
}

function formatCurrency(value?: number | null): string {
  if (value === undefined || value === null) return 'Non disponibile'
  return `EUR ${formatEuro(value)}`
}

function formatMonths(value?: number | null): string {
  if (value === undefined || value === null || value <= 0) return 'Non disponibile'
  return `${Math.round(value)} mesi`
}

function getRobustezzaLabel(level?: number | null): string {
  if (level === 0) return 'Livello 0'
  if (level === 1) return 'Livello 1'
  if (level === 2) return 'Livello 2'
  if (level === 3) return 'Livello 2+'
  return 'Non disponibile'
}

function renderMultilineValue(lines: string[]): ReactNode {
  const filtered = lines.filter((line) => line.trim().length > 0)
  if (filtered.length === 0) return 'Non disponibile'
  return (
    <div style={valueStackStyle}>
      {filtered.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  )
}

export function DocfapDetail() {
  const state = useSyncExternalStore(
    wizardStore.subscribe,
    wizardStore.getState,
    wizardStore.getState,
  )

  const [activeTab, setActiveTab] = useState<TabId>('riepilogo')
  const tabsRef = useRef<HTMLDivElement>(null)
  const baseId = useId()

  // Se lo store è vuoto o contiene vecchi risultati non compatibili con i tab
  // attuali, carica il dataset DOCFAP di esempio così la pagina resta navigabile.
  useEffect(() => {
    if (!hasRenderableDocfapScores(state.scoreFinale)) {
      wizardStore.actions.reset()
      void loadDocfapDemo()
    }
  }, [state.scoreFinale])

  const fab = FABBISOGNI.find((item) => item.id === state.fabId)
  const tema = TEMI_RELAZIONI.find((item) => item.id === state.temaId)
  const stato = state.scoreFinale && state.scoreFinale.length > 0 ? 'Completato' : 'In bozza'

  const scores = state.scoreFinale ?? []
  const recommendedId = getRecommendedAlternativeId(scores)
  const recommended = recommendedId ? scores.find((item) => item.alternativaId === recommendedId) ?? null : null
  const kpiItems = recommended
    ? [
        {
          label: 'Alternativa raccomandata',
          value: getAlternativeDisplayLabel(recommended.alternativaId, state.alternative[recommended.alternativaId]),
        },
        { label: 'Punteggio finale', value: `${formatScore(recommended.scoreFinale)} / 100` },
        { label: 'VANE', value: `${(safeNumber(recommended.van) / 1_000_000).toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M€` },
        { label: 'Occupati attivati (ETP)', value: safeNumber(recommended.occupati).toLocaleString('it-IT') },
      ]
    : []
  const nomeIntervento = state.intervento.denominazione || 'Intervento senza nome'
  const dataCreazione = '14/04/2026'
  const ultimaModifica = '14/04/2026'
  const descrizioneProgetto = state.problema.descrizione || 'Descrizione del progetto non disponibile.'
  const otherAlternativeIds = state.alternativeDefinite.filter((id) => id !== 'A1' && id !== 'A2')

  const a1 = state.alternative.A1
  const a2 = state.alternative.A2
  const otherAlternatives = otherAlternativeIds
    .map((id) => ({ id, alt: state.alternative[id] }))
    .filter((entry): entry is { id: typeof otherAlternativeIds[number]; alt: NonNullable<typeof state.alternative[typeof entry.id]> } => Boolean(entry.alt))

  const metaText = `Creato il ${dataCreazione} da ${state.localizzazione.comune || 'Ente non specificato'} (${state.rup.nome || 'RUP non specificato'}) - Ultima modifica il ${ultimaModifica}`

  const a1Lines = a1
    ? [
        getAlternativeDisplayLabel('A1', a1),
        `CAPEX: ${formatCurrency(a1.capex)}`,
        `OPEX: ${formatCurrency(a1.opex)}`,
        `Durata: ${formatMonths(a1.durataStimata)}`,
        `Livello: ${getRobustezzaLabel(a1.robustezza)}`,
      ]
    : []

  const a2Lines = a2
    ? [
        getAlternativeDisplayLabel('A2', a2),
        `CAPEX: ${formatCurrency(a2.capex)}`,
        `OPEX: ${formatCurrency(a2.opex)}`,
        `Durata: ${formatMonths(a2.durataStimata)}`,
        `Livello: ${getRobustezzaLabel(a2.robustezza)}`,
      ]
    : []

  const otherAlternativeItems = otherAlternatives.map(({ id, alt }) => ({
    id,
    label: id,
    value: [
      getAlternativeDisplayLabel(id, alt),
      `CAPEX: ${formatCurrency(alt.capex)}`,
      `OPEX: ${formatCurrency(alt.opex)}`,
      `Durata: ${formatMonths(alt.durataStimata)}`,
      `Livello: ${getRobustezzaLabel(alt.robustezza)}`,
    ],
  }))

  const scenarioZeroLines = [
    state.scenarioZeroNarrative || 'Non disponibile',
  ]

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    const count = TABS.length
    let next = currentIndex

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next = (currentIndex + 1) % count
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      next = (currentIndex - 1 + count) % count
    } else if (event.key === 'Home') {
      event.preventDefault()
      next = 0
    } else if (event.key === 'End') {
      event.preventDefault()
      next = count - 1
    } else {
      return
    }

    setActiveTab(TABS[next].id)
    const buttons = tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    buttons?.[next]?.focus()
  }

  return (
    <div style={pageStyle}>
      <style>{SCOPED_CSS}</style>

      <section style={heroStyle} aria-labelledby="dd-detail-title">
        <div style={heroTopRowStyle}>
          <div style={heroTitleWrapStyle}>
            <div style={titleRowStyle}>
              <span style={titleIconStyle} aria-hidden="true"><IconDoc /></span>
              <h1 id="dd-detail-title" style={heroTitleStyle}>{nomeIntervento}</h1>
              <span style={{ ...statusBadgeStyle, ...statusBadgeColors(stato) }}>{stato}</span>
            </div>
            <p style={heroMetaStyle}>{metaText}</p>
          </div>
          <div style={heroActionsStyle}>
            <a href="#" style={actionLinkStyle} className="dd-action-link">Scarica Report PDF</a>
            <a href="#" style={actionLinkStyle} className="dd-action-link">Scarica Excel</a>
          </div>
        </div>

        <p style={descriptionTextStyle}>{descrizioneProgetto}</p>
      </section>

      {kpiItems.length > 0 && (
        <section style={kpiSectionStyle} aria-label="Quadro di sintesi">
          {kpiItems.map((item) => (
            <div key={item.label} style={kpiTileStyle}>
              <span style={kpiLabelStyle}>{item.label}</span>
              <span style={kpiValueStyle}>{item.value}</span>
            </div>
          ))}
        </section>
      )}

      <section style={configCardStyle} aria-labelledby="dd-config-heading">
        <div style={configHeaderStyle}>
          <h2 id="dd-config-heading" style={configHeaderTitleStyle}>Dati della configurazione</h2>
        </div>
        <div style={configGridStyle}>
          <ConfigItem label="Tema del fabbisogno" value={tema?.label ?? 'Non disponibile'} />
          <ConfigItem label="Fabbisogno specifico" value={fab?.label ?? 'Non disponibile'} />
          <ConfigItem label="Nominativo RUP" value={state.rup.nome || 'Non disponibile'} />
          <ConfigItem label="Fonte finanziamento" value={state.intervento.fonteFinanziamento || 'Non disponibile'} />
          <ConfigItem label="Urgenza" value={state.urgenza || 'Non disponibile'} />
          <ConfigItem label="A1" value={renderMultilineValue(a1Lines)} />
          <ConfigItem label="A2" value={renderMultilineValue(a2Lines)} />
          {otherAlternativeItems.map((item) => (
            <ConfigItem key={item.id} label={item.label} value={renderMultilineValue(item.value)} />
          ))}
          <ConfigItem label="Scenario zero" value={renderMultilineValue(scenarioZeroLines)} />
        </div>
      </section>

      <section style={analysisSectionStyle} aria-label="Analisi del DOCFAP">
        <div style={tablistScrollStyle}>
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Sezioni analisi DOCFAP"
            style={tablistStyle}
          >
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                className="dd-tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${baseId}-panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={analysisContentStyle}>
          {TABS.map((tab) => (
            <div
              key={tab.id}
              role="tabpanel"
              id={`${baseId}-panel-${tab.id}`}
              aria-labelledby={`${baseId}-tab-${tab.id}`}
              hidden={activeTab !== tab.id}
              tabIndex={0}
              style={tabpanelStyle}
            >
              {/* Renderizza il contenuto solo quando il tab è attivo: i grafici
                  recharts richiedono un contenitore visibile per dimensionarsi. */}
              {activeTab === tab.id && tab.id === 'riepilogo' ? <TabRiepilogo /> : null}
              {activeTab === tab.id && tab.id === 'cba' ? <TabCBA /> : null}
              {activeTab === tab.id && tab.id === 'mca' ? <TabMCA /> : null}
              {activeTab === tab.id && tab.id === 'risk' ? <TabSensitivita /> : null}
              {activeTab === tab.id && tab.id === 'impatto' ? <TabImpatto /> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ConfigItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={configItemStyle}>
      <dt style={configLabelStyle}>{label}</dt>
      <dd style={configValueStyle}>{value}</dd>
    </div>
  )
}

const pageStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  padding: 'var(--spacing-inset-m)',
  background: 'var(--color-background-secondary-light)',
  minHeight: '100%',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
}

const heroStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  background: 'var(--color-background-secondary-light)',
  padding: 0,
}

const heroTopRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 'var(--spacing-inline-m)',
  flexWrap: 'wrap',
}

const heroTitleWrapStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  maxWidth: '880px',
}

const titleRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
}

const titleIconStyle: CSSProperties = {
  display: 'inline-flex',
  color: 'var(--color-icon-primary)',
}

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--type-heading-m-size, 22px)',
  fontWeight: 700,
  lineHeight: 1.2,
  color: 'var(--color-text-primary)',
}

const statusBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 'var(--radius-rounded)',
  padding: '2px var(--spacing-inset-xs)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 700,
  width: 'fit-content',
}

const heroMetaStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--type-body-s-size, 16px)',
  color: 'var(--color-text-primary-light)',
}

const heroActionsStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-s)',
  flexWrap: 'wrap',
}

const actionLinkStyle: CSSProperties = {
  color: 'var(--color-text-secondary)',
  fontWeight: 700,
  textDecoration: 'underline',
}

const descriptionTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--type-body-s-size, 16px)',
  lineHeight: 'var(--type-body-s-line-height, 1.5)',
  color: 'var(--color-text-primary)',
  maxWidth: '100ch',
}

const kpiSectionStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 'var(--spacing-inline-s)',
}

const kpiTileStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  alignContent: 'start',
  background: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: 'var(--spacing-inset-s)',
}

const kpiLabelStyle: CSSProperties = {
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--color-text-primary-light)',
}

const kpiValueStyle: CSSProperties = {
  fontSize: 'var(--type-heading-s-size, 24px)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  lineHeight: 1.2,
}

const configCardStyle: CSSProperties = {
  background: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  overflow: 'hidden',
}

const configHeaderStyle: CSSProperties = {
  background: 'var(--color-background-inverse)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
  padding: 'var(--spacing-inset-s) var(--spacing-inset-m)',
}

const configHeaderTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-heading-s-size, 18px)',
  fontWeight: 700,
}

const configGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 'var(--spacing-inline-l)',
  padding: 'var(--spacing-inset-m)',
}

const configItemStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  alignContent: 'start',
  minHeight: '120px',
}

const configLabelStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontWeight: 700,
  fontSize: 'var(--type-body-s-size, 16px)',
}

const configValueStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-body-s-size, 16px)',
  lineHeight: 'var(--type-body-s-line-height, 1.5)',
}

const valueStackStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xxs)',
}

const cardStyle: CSSProperties = {
  background: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: 'var(--spacing-inset-m)',
}

const analysisSectionStyle: CSSProperties = {
  ...cardStyle,
  padding: 0,
  overflow: 'hidden',
  display: 'grid',
  gap: 0,
  width: '100%',
}

const tablistScrollStyle: CSSProperties = {
  borderBottom: '1px solid var(--color-border-secondary-light)',
  padding: '0 var(--spacing-inset-m)',
  overflowX: 'auto',
}

const analysisContentStyle: CSSProperties = {
  width: '100%',
  padding: 'var(--spacing-inset-m)',
}

const tablistStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 'var(--spacing-inline-s)',
  borderBottom: 'none',
  marginBottom: 0,
  paddingBottom: 0,
  overflowX: 'visible',
}

const tabpanelStyle: CSSProperties = {
  outline: 'none',
  paddingTop: 'var(--spacing-stack-s)',
}
