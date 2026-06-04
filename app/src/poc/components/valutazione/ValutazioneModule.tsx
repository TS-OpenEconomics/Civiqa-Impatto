import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { COLLEFERRO_PROJECTS, LAZIO_PROJECTS, type AnalysisType, type ProjectStatus, type ValutazioneProject } from '../../data/mockValutazione'
import { ValutazioneWizardProvider, useValutazioneWizard } from '../../contexts/ValutazioneWizardContext'
import { ValutazioneWizard } from './wizard/ValutazioneWizard'

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function statusStyle(status: ProjectStatus): CSSProperties {
  switch (status) {
    case 'approvato':
      return { background: 'var(--color-background-success-lighter)', color: 'var(--color-text-success)' }
    case 'in_partenza':
      return { background: 'var(--color-background-warning-lighter)', color: 'var(--color-text-warning)' }
    case 'in_preparazione':
      return { background: 'var(--color-background-secondary-lightest)', color: 'var(--color-text-primary-light)' }
    case 'in_approvazione':
      return { background: 'var(--color-background-primary-lighter)', color: 'var(--color-text-secondary)' }
    case 'bozza':
    default:
      return { background: 'var(--color-background-secondary-lightest)', color: 'var(--color-text-primary-light)' }
  }
}

function analysisStyle(tag: AnalysisType): CSSProperties {
  if (tag === 'EIA') {
    return { background: 'var(--color-background-primary-lighter)', color: 'var(--color-text-secondary)' }
  }
  if (tag === 'ECBA') {
    return { background: 'var(--color-background-warning-lighter)', color: 'var(--color-text-warning)' }
  }
  return { background: 'var(--color-background-success-lighter)', color: 'var(--color-text-success)' }
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label style={toggleWrapStyle}>
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        style={{ ...switchStyle, ...(checked ? switchOnStyle : switchOffStyle) }}
      >
        <span style={{ ...switchThumbStyle, ...(checked ? switchThumbOnStyle : null) }} />
      </button>
    </label>
  )
}

function ProjectCard({ project }: { project: ValutazioneProject }) {
  return (
    <article style={cardStyle}>
      <div style={cardHeaderStyle}>
        <strong style={cardTitleStyle}>{project.nome}</strong>
        <span style={{ ...pillStyle, ...statusStyle(project.stato) }}>{project.isDraft ? 'Bozza' : project.stato}</span>
      </div>
      <p style={cardMetaStyle}>CUP {project.cup}</p>
      <p style={cardMetaStyle}>{project.settore}</p>
      <div style={analysisWrapStyle}>
        {(['EIA', 'ECBA', 'ESG'] as const).map((tag) => (
          <span key={tag} style={{ ...analysisPillStyle, ...analysisStyle(tag), opacity: project.analisi.includes(tag) ? 1 : 0.35 }}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}

function ValutazioneModuleInner() {
  const { reset } = useValutazioneWizard()
  const [showWizard, setShowWizard] = useState(false)
  const [activeTab, setActiveTab] = useState<'dipartimento' | 'provincia'>('dipartimento')
  const [showDraft, setShowDraft] = useState(false)
  const [showNoAnalisi, setShowNoAnalisi] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const dataset = activeTab === 'dipartimento' ? COLLEFERRO_PROJECTS : LAZIO_PROJECTS

  const filtered = useMemo(() => {
    return dataset.filter((project) => {
      if (showDraft && !project.isDraft) return false
      if (showNoAnalisi && project.analisi.length > 0) return false
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLocaleLowerCase('it-IT')
        return [project.nome, project.cup, project.settore, project.tipoIntervento]
          .join(' ')
          .toLocaleLowerCase('it-IT')
          .includes(q)
      }
      return true
    })
  }, [dataset, searchQuery, showDraft, showNoAnalisi])

  const featured = filtered.slice(0, 3)
  const handleOpenWizard = () => {
    reset()
    setShowWizard(true)
  }

  return (
    <>
      {showWizard ? (
        <div style={wizardOverlayStyle}>
          <ValutazioneWizard
            onClose={() => setShowWizard(false)}
            onComplete={() => setShowWizard(false)}
          />
        </div>
      ) : null}

      <main style={pageStyle} aria-label="Valutazione">
        <header style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Valutazione</h1>
            <p style={subtitleStyle}>
              Configura un nuovo progetto e raccogli le informazioni necessarie per le analisi di impatto,
              costi-benefici ed ESG.
            </p>
          </div>

          <button type="button" onClick={handleOpenWizard} style={ctaStyle}>
            <span>Nuova valutazione</span>
            <IconPlus />
          </button>
        </header>

        <section aria-labelledby="valutazione-evidenza" style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <h2 id="valutazione-evidenza" style={sectionTitleStyle}>In evidenza</h2>
            <div style={carouselControlsStyle}>
              <button type="button" style={iconButtonStyle} aria-label="Precedente">
                <IconChevronLeft />
              </button>
              <button type="button" style={iconButtonStyle} aria-label="Successivo">
                <IconChevronRight />
              </button>
            </div>
          </div>

          <div style={cardsGridStyle}>
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={tabsStyle} role="tablist" aria-label="Selezione valutazioni">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'dipartimento'}
              onClick={() => setActiveTab('dipartimento')}
              style={{ ...tabStyle, ...(activeTab === 'dipartimento' ? tabActiveStyle : null) }}
            >
              Valutazioni del tuo dipartimento
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'provincia'}
              onClick={() => setActiveTab('provincia')}
              style={{ ...tabStyle, ...(activeTab === 'provincia' ? tabActiveStyle : null) }}
            >
              Valutazioni delle province e dei comuni
            </button>
          </div>

          <div style={filtersRowStyle}>
            <ToggleSwitch checked={showDraft} onChange={() => setShowDraft((value) => !value)} label="Visualizza solo bozza" />
            <ToggleSwitch checked={showNoAnalisi} onChange={() => setShowNoAnalisi((value) => !value)} label="Senza analisi" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cerca tra le valutazioni"
              aria-label="Cerca tra le valutazioni"
              style={searchStyle}
            />
          </div>

          <div style={listStyle}>
            {filtered.map((project) => (
              <div key={project.id} style={rowStyle}>
                <div style={rowMainStyle}>
                  <strong style={rowTitleStyle}>{project.nome}</strong>
                  <span style={{ ...pillStyle, ...statusStyle(project.stato) }}>{project.isDraft ? 'Bozza' : project.stato}</span>
                </div>
                <div style={rowMetaStyle}>
                  <span>{project.cup}</span>
                  <span>{project.tipoIntervento}</span>
                  <span>{project.createdAt}</span>
                </div>
                <div style={analysisWrapStyle}>
                  {(['EIA', 'ECBA', 'ESG'] as const).map((tag) => (
                    <span key={tag} style={{ ...analysisPillStyle, ...analysisStyle(tag), opacity: project.analisi.includes(tag) ? 1 : 0.35 }}>
                      {tag}
                    </span>
                  ))}
                </div>
                {project.isDraft ? (
                  <button type="button" style={trashButtonStyle} aria-label={`Elimina ${project.nome}`}>
                    <IconTrash />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export function ValutazioneModule() {
  return (
    <ValutazioneWizardProvider>
      <ValutazioneModuleInner />
    </ValutazioneWizardProvider>
  )
}

const pageStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  padding: 'var(--spacing-inset-m)',
  minHeight: '100%',
  background: 'var(--color-background-secondary-light)',
}

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 'var(--spacing-inline-s)',
}

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-heading-m-size, 32px)',
  lineHeight: 1.1,
}

const subtitleStyle: CSSProperties = {
  margin: 'var(--spacing-stack-xs) 0 0',
  color: 'var(--color-text-primary-light)',
  maxWidth: '820px',
  lineHeight: 1.5,
}

const ctaStyle: CSSProperties = {
  minHeight: '44px',
  padding: '0 var(--spacing-inset-s)',
  border: '1px solid var(--color-background-primary)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: 700,
}

const sectionStyle: CSSProperties = {
  background: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: 'var(--spacing-inset-s)',
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const sectionHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-body-m-size, 18px)',
}

const carouselControlsStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-xs)',
}

const iconButtonStyle: CSSProperties = {
  width: '36px',
  height: '36px',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

const cardsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 'var(--spacing-inline-s)',
}

const cardStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: 'var(--spacing-inset-s)',
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  background: 'var(--color-background-inverse)',
}

const cardHeaderStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-xs)',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
}

const cardTitleStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
}

const cardMetaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

const pillStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 'var(--radius-rounded)',
  padding: '2px var(--spacing-inset-xs)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 700,
  width: 'fit-content',
}

const analysisWrapStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-xxs, 4px)',
  flexWrap: 'wrap',
}

const analysisPillStyle: CSSProperties = {
  borderRadius: 'var(--radius-rounded)',
  padding: '2px var(--spacing-inset-xs)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 700,
}

const tabsStyle: CSSProperties = {
  display: 'flex',
  borderBottom: '1px solid var(--color-border-secondary-light)',
  gap: 0,
}

const tabStyle: CSSProperties = {
  border: 'none',
  borderBottom: '1px solid transparent',
  background: 'transparent',
  color: 'var(--color-text-primary-light)',
  padding: 'var(--spacing-inset-xs) var(--spacing-inset-s)',
  cursor: 'pointer',
  fontWeight: 500,
}

const tabActiveStyle: CSSProperties = {
  borderBottomColor: 'var(--color-border-primary-light)',
  color: 'var(--color-text-secondary)',
  fontWeight: 700,
}

const filtersRowStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-m)',
  flexWrap: 'wrap',
  alignItems: 'center',
}

const toggleWrapStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-xs)',
  color: 'var(--color-text-primary)',
}

const switchStyle: CSSProperties = {
  width: '40px',
  height: '22px',
  borderRadius: 'var(--radius-rounded)',
  border: '1px solid var(--color-border-secondary-light)',
  position: 'relative',
  cursor: 'pointer',
}

const switchOnStyle: CSSProperties = {
  background: 'var(--color-background-primary)',
}

const switchOffStyle: CSSProperties = {
  background: 'var(--color-background-disable)',
}

const switchThumbStyle: CSSProperties = {
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '16px',
  height: '16px',
  borderRadius: 'var(--radius-circle)',
  background: 'var(--color-background-inverse)',
  transition: 'transform 0.15s ease',
}

const switchThumbOnStyle: CSSProperties = {
  transform: 'translateX(18px)',
}

const searchStyle: CSSProperties = {
  minHeight: '40px',
  border: '1px solid var(--color-border-secondary)',
  borderRadius: 'var(--radius-smooth)',
  padding: '0 var(--spacing-inset-xs)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary)',
  flex: '1 1 260px',
}

const listStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
}

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 0.8fr) auto auto',
  gap: 'var(--spacing-inline-s)',
  alignItems: 'center',
  padding: 'var(--spacing-inset-s)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
}

const rowMainStyle: CSSProperties = {
  display: 'grid',
  gap: '4px',
}

const rowTitleStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
}

const rowMetaStyle: CSSProperties = {
  display: 'grid',
  gap: '4px',
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

const trashButtonStyle: CSSProperties = {
  width: '36px',
  height: '36px',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-error)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

const wizardOverlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 220,
}
