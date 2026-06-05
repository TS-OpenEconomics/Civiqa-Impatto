import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { DocfapWizard } from '../components/wizard/DocfapWizard'
import { loadDocfapDemo } from '../data/docfapDemo'
import { wizardStore } from '../store/wizardStore'

type DocfapStatus = 'Bozza' | 'Completato' | 'In corso'
type AnalysisTag = 'CBA' | 'RISK'
type TabKey = 'ente' | 'territorio'

interface DocfapRecord {
  id: string
  nomeIntervento: string
  cup?: string
  stato: DocfapStatus
  settore: string
  proprietario: string
  tipoIntervento: string
  comune: string
  provincia: string
  dataCreazione: string
  inizioLavori: string
  durata: string
  statoProgetto: string
  analisiDisponibili: AnalysisTag[]
  hasScore: boolean
}

const MOCK_PROJECTS = [
  {
    id: 'ALT_A',
    name: 'Ristrutturazione completa edificio scolastico',
    cup: 'I63C22000050127',
    capex: 1500000,
    opex_annuo: 120000,
    vane: 227737,
    tire: 6.0,
    bc: 1.15,
    payback: 13,
    pil: 57975,
    occupazione: 846,
    produzione: 104060,
    redditi: 56540,
  },
  {
    id: 'ALT_B',
    name: 'Riqualificazione parziale con efficientamento energetico',
    cup: 'I63C22000050333',
    capex: 950000,
    opex_annuo: 95000,
    vane: 185000,
    tire: 5.2,
    bc: 1.12,
    payback: 15,
    pil: 42000,
    occupazione: 620,
    produzione: 78000,
    redditi: 41000,
  },
  {
    id: 'ALT_C',
    name: 'Nuova costruzione su area adiacente',
    cup: 'I63C22000050007',
    capex: 2100000,
    opex_annuo: 80000,
    vane: 142000,
    tire: 4.8,
    bc: 1.09,
    payback: 17,
    pil: 78000,
    occupazione: 1100,
    produzione: 145000,
    redditi: 72000,
  },
] as const

const DOCFAP_ENTE: DocfapRecord[] = [
  {
    id: 'docfap-001',
    nomeIntervento: MOCK_PROJECTS[0].name,
    cup: MOCK_PROJECTS[0].cup,
    stato: 'In corso',
    settore: 'Edilizia scolastica',
    proprietario: 'Riccardo Scialla',
    tipoIntervento: 'Ristrutturazione',
    comune: 'Colleferro',
    provincia: 'Roma',
    dataCreazione: '10/03/2026',
    inizioLavori: '09/2026',
    durata: '24 mesi',
    statoProgetto: 'Progettazione definitiva',
    analisiDisponibili: ['RISK'],
    hasScore: false,
  },
  {
    id: 'docfap-002',
    nomeIntervento: MOCK_PROJECTS[1].name,
    cup: MOCK_PROJECTS[1].cup,
    stato: 'Bozza',
    settore: 'Efficienza energetica',
    proprietario: 'Laura Conti',
    tipoIntervento: 'Riqualificazione',
    comune: 'Guidonia',
    provincia: 'Roma',
    dataCreazione: '01/03/2026',
    inizioLavori: '02/2027',
    durata: '18 mesi',
    statoProgetto: 'Studio di prefattibilita',
    analisiDisponibili: [],
    hasScore: false,
  },
  {
    id: 'docfap-003',
    nomeIntervento: MOCK_PROJECTS[2].name,
    cup: MOCK_PROJECTS[2].cup,
    stato: 'Completato',
    settore: 'Edilizia pubblica',
    proprietario: 'Marco Bianchi',
    tipoIntervento: 'Nuova costruzione',
    comune: 'Monterotondo',
    provincia: 'Roma',
    dataCreazione: '20/02/2026',
    inizioLavori: '11/2026',
    durata: '30 mesi',
    statoProgetto: 'Approvato',
    analisiDisponibili: ['CBA', 'RISK'],
    hasScore: true,
  },
]

const DOCFAP_TERRITORIO: DocfapRecord[] = [
  {
    id: 'docfap-011',
    nomeIntervento: 'Messa in sicurezza polo infanzia via Dante',
    cup: 'J11C24000011234',
    stato: 'In corso',
    settore: 'Istruzione',
    proprietario: 'Comune di Rieti',
    tipoIntervento: 'Adeguamento sismico',
    comune: 'Rieti',
    provincia: 'Rieti',
    dataCreazione: '14/03/2026',
    inizioLavori: '01/2027',
    durata: '16 mesi',
    statoProgetto: 'Valutazione alternativa',
    analisiDisponibili: ['RISK'],
    hasScore: false,
  },
  {
    id: 'docfap-012',
    nomeIntervento: 'Nuovo centro servizi sociali quartiere nord',
    cup: 'L22B24000078321',
    stato: 'Bozza',
    settore: 'Servizi sociali',
    proprietario: 'Provincia di Viterbo',
    tipoIntervento: 'Nuova costruzione',
    comune: 'Viterbo',
    provincia: 'Viterbo',
    dataCreazione: '06/03/2026',
    inizioLavori: '09/2027',
    durata: '22 mesi',
    statoProgetto: 'Istruttoria tecnica',
    analisiDisponibili: [],
    hasScore: false,
  },
]

const PAGE_SIZE_OPTIONS = [5, 10, 20] as const

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconDoc() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
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

function statusStyle(status: DocfapStatus): CSSProperties {
  if (status === 'Completato') {
    return { background: 'var(--color-background-success-lighter)', color: 'var(--color-text-success)' }
  }
  if (status === 'In corso') {
    return { background: 'var(--color-background-warning-lighter)', color: 'var(--color-text-warning)' }
  }
  return { background: 'var(--color-background-secondary-lightest)', color: 'var(--color-text-primary-light)' }
}

function analysisStyle(tag: AnalysisTag, enabled: boolean): CSSProperties {
  if (!enabled) {
    return {
      background: 'var(--color-background-disable)',
      color: 'var(--color-text-disable)',
      border: '1px solid var(--color-border-secondary-light)',
    }
  }

  if (tag === 'CBA') {
    return {
      background: 'var(--color-background-warning-lighter)',
      color: 'var(--color-text-warning)',
      border: '1px solid var(--color-border-warning)',
    }
  }

  return {
    background: 'var(--color-background-success-lighter)',
    color: 'var(--color-text-success)',
    border: '1px solid var(--color-border-success)',
  }
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

export function DocfapList() {
  const [showWizard, setShowWizard] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('ente')
  const [onlyDraft, setOnlyDraft] = useState(false)
  const [withoutScore, setWithoutScore] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [geoFilter, setGeoFilter] = useState('')
  const [sortBy, setSortBy] = useState<'recenti' | 'nome'>('recenti')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(5)

  const dataset = activeTab === 'ente' ? DOCFAP_ENTE : DOCFAP_TERRITORIO

  const featured = useMemo(() => dataset.filter((item) => item.stato !== 'Completato'), [dataset])
  const featuredVisible = featured.slice(carouselIndex, carouselIndex + 3)
  const canPrevFeatured = carouselIndex > 0
  const canNextFeatured = carouselIndex + 3 < featured.length

  const filtered = useMemo(() => {
    let rows = [...dataset]

    if (onlyDraft) rows = rows.filter((row) => row.stato === 'Bozza')
    if (withoutScore) rows = rows.filter((row) => !row.hasScore)

    if (geoFilter.trim()) {
      const q = geoFilter.trim().toLocaleLowerCase('it-IT')
      rows = rows.filter((row) => row.comune.toLocaleLowerCase('it-IT').includes(q) || row.provincia.toLocaleLowerCase('it-IT').includes(q))
    }

    if (searchText.trim()) {
      const q = searchText.trim().toLocaleLowerCase('it-IT')
      rows = rows.filter((row) =>
        [row.nomeIntervento, row.cup ?? '', row.proprietario, row.settore, row.tipoIntervento]
          .join(' ')
          .toLocaleLowerCase('it-IT')
          .includes(q),
      )
    }

    if (sortBy === 'nome') {
      rows.sort((a, b) => a.nomeIntervento.localeCompare(b.nomeIntervento, 'it-IT'))
    } else {
      rows.sort((a, b) => b.dataCreazione.localeCompare(a.dataCreazione, 'it-IT'))
    }

    return rows
  }, [dataset, geoFilter, onlyDraft, searchText, sortBy, withoutScore])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize)

  const resetPaging = () => setCurrentPage(1)
  const handleOpenWizard = () => {
    wizardStore.actions.reset()
    setShowWizard(true)
  }
  const handleOpenDemoDetail = () => {
    wizardStore.actions.reset()
    void loadDocfapDemo()
  }

  return (
    <>
      {showWizard ? (
        <DocfapWizard onClose={() => setShowWizard(false)} />
      ) : null}
      <main aria-label="Lista Docfap" className="docfap-home" style={mainStyle}>
        <header style={headerStyle}>
          <div>
            <div style={titleRowStyle}>
              <span style={titleIconStyle} aria-hidden="true"><IconDoc /></span>
              <h1 style={h1Style}>Docfap</h1>
            </div>
            <p style={subtitleStyle}>
              Compila il Docfap per confrontare alternative progettuali secondo la normativa prevista dall'Allegato I.7 del D.Lgs. 36/2023, con analisi costi-benefici, impatto, rischio, sensitività e supporto alla decisione del RUP.
            </p>
          </div>
          <div style={headerActionsStyle}>
            <button type="button" onClick={handleOpenWizard} style={ctaStyle}>
              <span>Nuovo Docfap</span>
              <span style={ctaPlusStyle} aria-hidden="true">+</span>
            </button>
          </div>
        </header>

        <section aria-labelledby="docfap-evidenza" style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <h2 id="docfap-evidenza" style={h2Style}>In evidenza</h2>
            <div style={carouselControlsStyle}>
              <button
                type="button"
                onClick={() => setCarouselIndex((value) => Math.max(0, value - 1))}
                aria-disabled={!canPrevFeatured}
                style={{ ...carouselButtonStyle, ...(!canPrevFeatured ? disabledButtonStyle : null) }}
              >
                <IconChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => setCarouselIndex((value) => Math.min(Math.max(0, featured.length - 3), value + 1))}
                aria-disabled={!canNextFeatured}
                style={{ ...carouselButtonStyle, ...(!canNextFeatured ? disabledButtonStyle : null) }}
              >
                <IconChevronRight />
              </button>
            </div>
          </div>

          <div style={carouselGridStyle}>
            {featuredVisible.map((item) => (
              <article key={item.id} style={featuredCardStyle}>
                <div style={featuredTitleRowStyle}>
                  <strong style={featuredTitleStyle}>{item.nomeIntervento}</strong>
                  <span style={{ ...statusBadgeStyle, ...statusStyle(item.stato) }}>{item.stato}</span>
                </div>
                <p style={featuredMetaStyle}>{item.cup ? `CUP ${item.cup}` : 'CUP non disponibile'}</p>
                <p style={featuredMetaStyle}>{`${item.settore} - ${item.dataCreazione}`}</p>
                <Link to="/impatti/docfap/detail" style={detailButtonStyle} onClick={handleOpenDemoDetail}>
                  Vai al dettaglio <IconArrowRight />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <div role="tablist" aria-label="Selezione lista Docfap" style={tabsWrapStyle}>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'ente'}
              onClick={() => {
                setActiveTab('ente')
                resetPaging()
              }}
              style={{ ...tabStyle, ...(activeTab === 'ente' ? tabActiveStyle : null) }}
            >
              Docfap del tuo ente
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'territorio'}
              onClick={() => {
                setActiveTab('territorio')
                resetPaging()
              }}
              style={{ ...tabStyle, ...(activeTab === 'territorio' ? tabActiveStyle : null) }}
            >
              Docfap delle province e comuni
            </button>
          </div>

          <div style={filtersRowStyle}>
            <ToggleSwitch checked={onlyDraft} onChange={() => { setOnlyDraft((v) => !v); resetPaging() }} label="Visualizza solo: In bozza" />
            <ToggleSwitch checked={withoutScore} onChange={() => { setWithoutScore((v) => !v); resetPaging() }} label="Senza score" />
          </div>

          <div style={searchBarStyle}>
            <input
              type="search"
              value={geoFilter}
              onChange={(event) => { setGeoFilter(event.target.value); resetPaging() }}
              placeholder="Cerca per comune/provincia"
              aria-label="Cerca per comune o provincia"
              style={inputStyle}
            />
            <select
              value={sortBy}
              onChange={(event) => { setSortBy(event.target.value as 'recenti' | 'nome'); resetPaging() }}
              style={inputStyle}
              aria-label="Ordina per"
            >
              <option value="recenti">Ordina per: piu recenti</option>
              <option value="nome">Ordina per: nome intervento</option>
            </select>
            <input
              type="search"
              value={searchText}
              onChange={(event) => { setSearchText(event.target.value); resetPaging() }}
              placeholder="Ricerca testo libero"
              aria-label="Ricerca testo libero"
              style={inputStyle}
            />
          </div>

          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th scope="col" style={thStyle}>Intervento</th>
                  <th scope="col" style={thStyle}>Analisi</th>
                  <th scope="col" style={thStyle}>Dettagli</th>
                  <th scope="col" style={thStyle}>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((row) => (
                  <tr key={row.id}>
                    <th scope="row" style={tdHeaderStyle}>
                      <div style={cellMainStyle}>
                        <strong>{row.nomeIntervento}</strong>
                        <span style={{ ...statusBadgeStyle, ...statusStyle(row.stato) }}>{row.stato}</span>
                      </div>
                      <div style={cellSubStyle}>{row.cup ? `CUP ${row.cup}` : 'CUP non disponibile'}</div>
                      <div style={cellSubStyle}>{`Creato il ${row.dataCreazione}`}</div>
                    </th>
                    <td style={tdStyle}>
                      <div style={analysisWrapStyle}>
                        {(['CBA', 'RISK'] as const).map((tag) => (
                          <span key={tag} style={{ ...analysisBadgeStyle, ...analysisStyle(tag, row.analisiDisponibili.includes(tag)) }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={detailsGridStyle}>
                        <span>{`${row.proprietario} - ${row.settore}`}</span>
                        <span>{row.tipoIntervento}</span>
                        <span>{`Inizio: ${row.inizioLavori} - Durata: ${row.durata}`}</span>
                        <span>{`Stato progetto: ${row.statoProgetto}`}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={actionsWrapStyle}>
                        <Link
                          to="/impatti/docfap/detail"
                          style={actionButtonStyle}
                          onClick={handleOpenDemoDetail}
                          aria-label={`Apri dettaglio ${row.nomeIntervento}`}
                        >
                          <IconArrowRight />
                        </Link>
                        {row.stato === 'Bozza' && (
                          <button type="button" style={dangerButtonStyle} aria-label={`Elimina bozza ${row.nomeIntervento}`}>
                            <IconTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav role="navigation" aria-label="Paginazione risultati" style={paginationStyle}>
            <div style={paginationMetaStyle}>
              <label htmlFor="docfap-page-size">Record per pagina</label>
              <select
                id="docfap-page-size"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value))
                  setCurrentPage(1)
                }}
                style={smallInputStyle}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span>{`${filtered.length} totali`}</span>
            </div>

            <div style={paginationControlsStyle}>
              <button
                type="button"
                onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
                aria-disabled={safeCurrentPage === 1}
                style={{ ...paginationButtonStyle, ...(safeCurrentPage === 1 ? disabledButtonStyle : null) }}
              >
                <IconChevronLeft />
              </button>
              <span style={pageInfoStyle}>{`${safeCurrentPage}/${totalPages}`}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
                aria-disabled={safeCurrentPage === totalPages}
                style={{ ...paginationButtonStyle, ...(safeCurrentPage === totalPages ? disabledButtonStyle : null) }}
              >
                <IconChevronRight />
              </button>
            </div>
          </nav>
        </section>
      </main>
    </>
  )
}

const mainStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  /* padding handled by .docfap-home so it can match app/'s responsive
     px-6 / xl:px-8 (media queries aren't possible in inline styles). */
  background: 'var(--color-background-app-page, #f5f5f5)',
  minHeight: '100vh',
}

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 'var(--spacing-inline-s)',
  padding: 0,
}

const headerActionsStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexShrink: 0,
}

const ctaStyle: CSSProperties = {
  width: '358px',
  maxWidth: '100%',
  height: '61px',
  /* allineato verticalmente al bottone "Nuova valutazione" (xl:mt-8 = 32px),
     così la CTA non "salta" passando tra le due home */
  marginTop: '32px',
  padding: '0 20px',
  border: '1px solid var(--color-background-primary)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 'var(--type-body-m-size, 15px)',
  fontWeight: 500,
}

const ctaPlusStyle: CSSProperties = {
  fontSize: '28px',
  lineHeight: 1,
}

const titleRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}

const titleIconStyle: CSSProperties = {
  display: 'inline-flex',
  color: 'var(--color-icon-primary)',
}

const h1Style: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-heading-m-size, 22px)',
  fontWeight: 700,
  lineHeight: 1,
}

const subtitleStyle: CSSProperties = {
  margin: 'var(--spacing-stack-s, 16px) 0 0',
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-body-s-size, 14px)',
  lineHeight: 1.5,
  maxWidth: '900px',
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

const h2Style: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-heading-s-size, 18px)',
  fontWeight: 700,
}

const carouselControlsStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-xs)',
}

const carouselButtonStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary)',
  minWidth: '36px',
  minHeight: '36px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

const carouselGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 'var(--spacing-inline-s)',
}

const featuredCardStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: 'var(--spacing-inset-s)',
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  background: 'var(--color-background-inverse)',
}

const featuredTitleRowStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-xs)',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
}

const featuredTitleStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
}

const featuredMetaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

const detailButtonStyle: CSSProperties = {
  marginTop: 'var(--spacing-stack-xs)',
  border: 'none',
  background: 'transparent',
  color: 'var(--color-text-secondary)',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-xxs, 4px)',
  cursor: 'pointer',
  padding: 0,
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

const tabsWrapStyle: CSSProperties = {
  display: 'flex',
  borderBottom: '1px solid var(--color-border-secondary-light)',
}

const tabStyle: CSSProperties = {
  border: 'none',
  borderBottom: '2px solid transparent',
  background: 'transparent',
  color: 'var(--color-text-primary-light)',
  padding: 'var(--spacing-inset-xs) var(--spacing-inset-s)',
  cursor: 'pointer',
  fontWeight: 500,
}

const tabActiveStyle: CSSProperties = {
  borderBottomColor: 'var(--color-background-primary)',
  color: 'var(--color-text-secondary)',
  fontWeight: 700,
}

const filtersRowStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-m)',
  flexWrap: 'wrap',
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

const searchBarStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 'var(--spacing-inline-xs)',
}

const inputStyle: CSSProperties = {
  minHeight: '40px',
  border: '1px solid var(--color-border-secondary)',
  borderRadius: 'var(--radius-smooth)',
  padding: '0 var(--spacing-inset-xs)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary)',
}

const tableWrapStyle: CSSProperties = {
  overflowX: 'auto',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '940px',
}

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
  background: 'var(--color-background-secondary-lightest)',
  color: 'var(--color-text-primary)',
}

const tdHeaderStyle: CSSProperties = {
  textAlign: 'left',
  verticalAlign: 'top',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
}

const tdStyle: CSSProperties = {
  verticalAlign: 'top',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
}

const cellMainStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-xs)',
  flexWrap: 'wrap',
}

const cellSubStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  marginTop: '2px',
}

const analysisWrapStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-xxs, 4px)',
  flexWrap: 'wrap',
}

const analysisBadgeStyle: CSSProperties = {
  borderRadius: 'var(--radius-rounded)',
  padding: '2px var(--spacing-inset-xs)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 700,
}

const detailsGridStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xxs, 4px)',
  color: 'var(--color-text-primary)',
}

const actionsWrapStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-xs)',
}

const actionButtonStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-secondary)',
  minWidth: '32px',
  minHeight: '32px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

const dangerButtonStyle: CSSProperties = {
  ...actionButtonStyle,
  color: 'var(--color-text-error)',
}

const paginationStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'var(--spacing-inline-s)',
  flexWrap: 'wrap',
}

const paginationMetaStyle: CSSProperties = {
  display: 'inline-flex',
  gap: 'var(--spacing-inline-xs)',
  alignItems: 'center',
  color: 'var(--color-text-primary)',
}

const smallInputStyle: CSSProperties = {
  ...inputStyle,
  minHeight: '32px',
}

const paginationControlsStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-xs)',
}

const paginationButtonStyle: CSSProperties = {
  ...carouselButtonStyle,
  minWidth: '32px',
  minHeight: '32px',
}

const pageInfoStyle: CSSProperties = {
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}

const disabledButtonStyle: CSSProperties = {
  pointerEvents: 'none',
  opacity: 0.5,
}










