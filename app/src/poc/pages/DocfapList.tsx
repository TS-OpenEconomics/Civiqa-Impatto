import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { DocfapWizard } from '../components/wizard/DocfapWizard'
import { loadDocfapDemo } from '../data/docfapDemo'
import { wizardStore } from '../store/wizardStore'

type DocfapStatus = 'Bozza' | 'Completato' | 'In corso'
type AnalysisTag = 'EIA' | 'ECBA' | 'RISK' | 'MCA'
type TabKey = 'ente' | 'territorio'

const ALL_ANALYSES: AnalysisTag[] = ['EIA', 'ECBA', 'RISK', 'MCA']

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
    name: "Ristrutturazione e ampliamento dell'asilo nido comunale",
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
    analisiDisponibili: [],
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
    analisiDisponibili: ['EIA', 'ECBA', 'RISK', 'MCA'],
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
    analisiDisponibili: [],
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

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconDots() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <circle cx="10" cy="4" r="1.6" />
      <circle cx="10" cy="10" r="1.6" />
      <circle cx="10" cy="16" r="1.6" />
    </svg>
  )
}

function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 5V3.5A1.5 1.5 0 009.5 2H4a1.5 1.5 0 00-1.5 1.5V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconShare() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="12" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12.5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.7 7l4.6-2.6M5.7 9l4.6 2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function DocfapCardMenu({
  onDuplicate,
  onShare,
  onDelete,
}: {
  onDuplicate: () => void
  onShare: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [open])

  const items: { label: string; icon: JSX.Element; onClick: () => void; danger?: boolean }[] = [
    { label: 'Duplica', icon: <IconCopy />, onClick: onDuplicate },
    { label: 'Condividi', icon: <IconShare />, onClick: onShare },
    { label: 'Elimina', icon: <IconTrash />, onClick: onDelete, danger: true },
  ]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Opzioni progetto"
        aria-haspopup="menu"
        aria-expanded={open}
        style={menuTriggerStyle}
      >
        <IconDots />
      </button>
      {open && (
        <div role="menu" style={menuDropdownStyle}>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => { setOpen(false); item.onClick() }}
              style={{ ...menuItemStyle, ...(item.danger ? menuItemDangerStyle : null) }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function statusStyle(status: DocfapStatus): CSSProperties {
  if (status === 'Completato') {
    return { background: 'var(--color-background-success-lighter)', color: 'var(--color-text-success)' }
  }
  if (status === 'In corso') {
    return { background: 'var(--color-background-warning-lighter)', color: 'var(--color-text-warning)' }
  }
  // Bozza: stesso stile del badge "Bozza" di Valutazione (contorno viola, sfondo trasparente)
  return {
    background: 'transparent',
    color: 'var(--color-background-primary)',
    border: '1px solid var(--color-background-primary)',
  }
}

// Colori ripresi dai badge analisi di Valutazione (tailwind: badge.eia/ecba/esg,
// testo ink-900). RISK riusa la tinta ESG (teal), MCA una pastello ambra coerente.
const ANALYSIS_ENABLED_STYLE: Record<AnalysisTag, CSSProperties> = {
  EIA:  { background: '#F8A8E2', color: '#0E0E10', border: 'none' },
  ECBA: { background: '#A8D8F8', color: '#0E0E10', border: 'none' },
  RISK: { background: '#86E8DC', color: '#0E0E10', border: 'none' },
  MCA:  { background: '#FBD9A8', color: '#0E0E10', border: 'none' },
}

function analysisStyle(tag: AnalysisTag, enabled: boolean): CSSProperties {
  if (!enabled) {
    return { background: '#E5E5E8', color: '#A3A3AA', border: 'none' }
  }
  return ANALYSIS_ENABLED_STYLE[tag]
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

function FeaturedDocfapCard({ item, onOpen }: { item: DocfapRecord; onOpen: () => void }) {
  return (
    <article style={featuredCardStyle}>
      <div style={featuredCardTopStyle}>
        <div style={docIconBadgeStyle} aria-hidden="true">
          <IconDoc />
        </div>
        <span style={{ ...statusBadgeStyle, ...statusStyle(item.stato) }}>{item.stato}</span>
      </div>

      <div style={featuredBodyStyle}>
        <strong style={featuredTitleStyle}>{item.nomeIntervento}</strong>
        <p style={featuredMetaStyle}>{item.cup ? `CUP ${item.cup}` : 'CUP non disponibile'}</p>
        <p style={featuredMetaStyle}>{`${item.settore} - ${item.tipoIntervento}`}</p>
      </div>

      <div style={featuredFactsStyle}>
        <span style={featuredFactStyle}>
          <span style={featuredFactLabelStyle}>Comune</span>
          <strong style={featuredFactValueStyle}>{item.comune}</strong>
        </span>
        <span style={featuredFactStyle}>
          <span style={featuredFactLabelStyle}>Avvio</span>
          <strong style={featuredFactValueStyle}>{item.inizioLavori}</strong>
        </span>
      </div>

      <div style={analysisWrapStyle}>
        {ALL_ANALYSES.map((tag) => (
          <span key={tag} style={{ ...analysisBadgeStyle, ...analysisStyle(tag, item.analisiDisponibili.includes(tag)) }}>
            {tag}
          </span>
        ))}
      </div>
      {item.stato === 'Completato' ? (
        <span style={analysisDoneStyle}>
          <IconCheck /> Completate
        </span>
      ) : (
        <span style={analysisPendingStyle}>In lavorazione</span>
      )}

      <button type="button" style={detailButtonStyle} onClick={onOpen}>
        {item.stato === 'Completato' ? 'Vai al dettaglio' : 'Concludi Docfap'} <IconArrowRight />
      </button>
    </article>
  )
}

function DocfapInfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={infoBlockLabelStyle}>{label}</p>
      <p style={infoBlockValueStyle}>{value}</p>
    </div>
  )
}

function DocfapProjectCard({
  row,
  onOpen,
  onDuplicate,
  onShare,
  onDelete,
}: {
  row: DocfapRecord
  onOpen: () => void
  onDuplicate: () => void
  onShare: () => void
  onDelete: () => void
}) {
  const completato = row.stato === 'Completato'
  return (
    <article style={listCardStyle}>
      <div style={listCardHeaderStyle}>
        <div style={listCardTitleColStyle}>
          <div style={listCardTitleRowStyle}>
            <h3 style={listCardTitleStyle}>{row.nomeIntervento}</h3>
            <span style={{ ...statusBadgeStyle, ...statusStyle(row.stato) }}>{row.stato}</span>
          </div>
          <p style={listCardCupStyle}>
            {row.cup ? `CUP ${row.cup}` : 'CUP non disponibile'}
            <span style={{ margin: '0 8px' }}>-</span>
            {`Creato il ${row.dataCreazione}`}
          </p>
        </div>

        <div style={listCardAnalysisColStyle}>
          <span style={listCardAnalysisLabelStyle}>Analisi</span>
          <div style={analysisWrapStyle}>
            {ALL_ANALYSES.map((tag) => (
              <span key={tag} style={{ ...analysisBadgeStyle, ...analysisStyle(tag, row.analisiDisponibili.includes(tag)) }}>
                {tag}
              </span>
            ))}
          </div>
          {completato ? (
            <span style={analysisDoneStyle}>
              <IconCheck /> Completate
            </span>
          ) : (
            <span style={analysisPendingStyle}>In lavorazione</span>
          )}
        </div>

        <div style={listCardMenuColStyle}>
          <DocfapCardMenu onDuplicate={onDuplicate} onShare={onShare} onDelete={onDelete} />
        </div>
      </div>

      <div style={listCardInfoGridStyle}>
        <DocfapInfoBlock label="Proprietario" value={row.proprietario} />
        <DocfapInfoBlock label="Settore" value={row.settore} />
        <DocfapInfoBlock label="Tipo intervento" value={row.tipoIntervento} />
        <DocfapInfoBlock label="Localizzazione" value={`${row.comune} (${row.provincia})`} />
        <DocfapInfoBlock label="Inizio / durata lavori" value={`${row.inizioLavori} · ${row.durata}`} />
        <DocfapInfoBlock label="Stato del progetto" value={row.statoProgetto} />
      </div>

      <div style={listCardFooterStyle}>
        <button
          type="button"
          onClick={onOpen}
          style={listCardExploreStyle}
          aria-label={completato ? `Esplora il progetto ${row.nomeIntervento}` : `Concludi il Docfap ${row.nomeIntervento}`}
        >
          <span>{completato ? 'Esplora' : 'Concludi'}</span>
          <IconArrowRight />
        </button>
      </div>
    </article>
  )
}

export function DocfapList() {
  const navigate = useNavigate()
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
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const [extras, setExtras] = useState<Record<TabKey, DocfapRecord[]>>({ ente: [], territorio: [] })
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 2600)
    return () => window.clearTimeout(timer)
  }, [notice])

  const dataset = useMemo(() => {
    const base = activeTab === 'ente' ? DOCFAP_ENTE : DOCFAP_TERRITORIO
    return [...extras[activeTab], ...base].filter((row) => !removedIds.includes(row.id))
  }, [activeTab, extras, removedIds])

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
  // Progetto COMPLETATO → apri il dettaglio con i dati demo (CBA/Impatto/MCA/
  // Rischio popolati, A1+A2). Progetto NON completato → riprendi dal wizard.
  const handleOpenProject = (row: DocfapRecord) => {
    wizardStore.actions.reset()
    if (row.stato === 'Completato') {
      void loadDocfapDemo({
        denominazione: row.nomeIntervento,
        comune: row.comune,
        provincia: row.provincia,
        proprietario: row.proprietario,
      })
      navigate('/impatti/docfap/detail')
    } else {
      setShowWizard(true)
    }
  }

  const handleDuplicate = (row: DocfapRecord) => {
    const copy: DocfapRecord = {
      ...row,
      id: `${row.id}-copy-${extras[activeTab].length + 1}`,
      nomeIntervento: `${row.nomeIntervento} (copia)`,
      stato: 'Bozza',
      analisiDisponibili: [],
      hasScore: false,
    }
    setExtras((prev) => ({ ...prev, [activeTab]: [copy, ...prev[activeTab]] }))
    setNotice('Progetto duplicato come bozza')
  }

  const handleShare = (row: DocfapRecord) => {
    try {
      void navigator.clipboard?.writeText(`${window.location.origin}/impatti/docfap/detail`)
    } catch {
      /* clipboard non disponibile: ignora */
    }
    setNotice(`Link di "${row.nomeIntervento}" copiato negli appunti`)
  }

  const handleDelete = (row: DocfapRecord) => {
    setRemovedIds((prev) => [...prev, row.id])
    setNotice('Progetto eliminato')
  }

  return (
    <>
      {showWizard ? (
        <DocfapWizard onClose={() => setShowWizard(false)} />
      ) : null}
      <main aria-label="Lista Docfap" className="docfap-home" style={mainStyle}>
        {notice && <div role="status" style={noticeStyle}>{notice}</div>}
        <header style={headerStyle}>
          <div>
            <div style={titleRowStyle}>
              <span style={titleIconStyle} aria-hidden="true"><IconDoc /></span>
              <h1 style={h1Style}>Analisi Alternativa</h1>
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

        <section aria-labelledby="docfap-evidenza" style={featuredSectionStyle}>
          <div style={sectionHeaderStyle}>
            <h2 id="docfap-evidenza" style={h2Style}>Progetti in evidenza</h2>
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
              <FeaturedDocfapCard key={item.id} item={item} onOpen={() => handleOpenProject(item)} />
            ))}
          </div>
        </section>

        <h2 style={h2Style}>Esplora i progetti</h2>

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

        </section>

        <div style={cardsListStyle}>
          {paginated.length === 0 ? (
            <div style={emptyStateStyle}>Nessun Docfap trovato con i filtri selezionati.</div>
          ) : (
            paginated.map((row) => (
              <DocfapProjectCard
                key={row.id}
                row={row}
                onOpen={() => handleOpenProject(row)}
                onDuplicate={() => handleDuplicate(row)}
                onShare={() => handleShare(row)}
                onDelete={() => handleDelete(row)}
              />
            ))
          )}
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

const featuredSectionStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
  padding: 0,
  margin: 0,
  background: 'transparent',
  border: 'none',
  borderRadius: 0,
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 'var(--spacing-inline-s)',
}

const featuredCardStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: '18px',
  display: 'grid',
  gap: '14px',
  background: 'var(--color-background-inverse)',
  minHeight: '238px',
  alignContent: 'start',
  boxShadow: '0 1px 0 rgba(14, 14, 16, 0.03)',
}

const featuredCardTopStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-xs)',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const docIconBadgeStyle: CSSProperties = {
  width: '38px',
  height: '38px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text-secondary)',
  background: 'var(--color-background-primary-lighter)',
  border: '1px solid var(--color-border-primary-light)',
  borderRadius: 'var(--radius-smooth)',
}

const featuredBodyStyle: CSSProperties = {
  display: 'grid',
  gap: '6px',
}

const featuredTitleStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-body-m-size, 16px)',
  lineHeight: 1.25,
}

const featuredMetaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  lineHeight: 1.35,
}

const featuredFactsStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '8px',
}

const featuredFactStyle: CSSProperties = {
  minWidth: 0,
  padding: '10px 12px',
  background: 'var(--color-background-secondary-lightest)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  display: 'grid',
  gap: '3px',
}

const featuredFactLabelStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

const featuredFactValueStyle: CSSProperties = {
  minWidth: 0,
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const detailButtonStyle: CSSProperties = {
  marginTop: 'auto',
  minHeight: '44px',
  border: '1px solid var(--color-background-primary)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--spacing-inline-xxs, 4px)',
  cursor: 'pointer',
  padding: '0 16px',
  textDecoration: 'none',
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

const cardsListStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const emptyStateStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  padding: '48px 20px',
  textAlign: 'center',
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-s-size, 15px)',
}

const noticeStyle: CSSProperties = {
  border: '1px solid var(--color-border-primary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-primary-lighter)',
  color: 'var(--color-text-secondary)',
  padding: '10px 16px',
  fontSize: 'var(--type-body-s-size, 14px)',
  fontWeight: 600,
}

const listCardStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  overflow: 'hidden',
}

const listCardHeaderStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'stretch',
  borderBottom: '1px solid var(--color-border-secondary-light)',
}

const listCardTitleColStyle: CSSProperties = {
  flex: '1 1 320px',
  minWidth: 0,
  padding: '20px',
}

const listCardTitleRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
}

const listCardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: '19px',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}

const listCardCupStyle: CSSProperties = {
  margin: '12px 0 0',
  fontSize: 'var(--type-body-m-size, 15px)',
  color: 'var(--color-text-primary-light)',
}

const listCardAnalysisColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '8px',
  padding: '20px',
  borderLeft: '1px solid var(--color-border-secondary-light)',
}

const analysisDoneStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: 'var(--type-body-xs-size, 13px)',
  fontWeight: 600,
  color: 'var(--color-text-success)',
}

const analysisPendingStyle: CSSProperties = {
  fontSize: 'var(--type-body-xs-size, 13px)',
  color: 'var(--color-text-primary-light)',
}

const listCardAnalysisLabelStyle: CSSProperties = {
  fontSize: 'var(--type-body-s-size, 14px)',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
}

const listCardMenuColStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '14px',
  borderLeft: '1px solid var(--color-border-secondary-light)',
}

const menuTriggerStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '32px',
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: 'var(--color-background-primary)',
  cursor: 'pointer',
}

const menuDropdownStyle: CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  right: 0,
  zIndex: 10,
  minWidth: '180px',
  background: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  boxShadow: '0 6px 20px rgba(14, 14, 16, 0.12)',
  overflow: 'hidden',
}

const menuItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '10px 14px',
  border: 'none',
  background: 'transparent',
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-body-s-size, 14px)',
  textAlign: 'left',
  cursor: 'pointer',
}

const menuItemDangerStyle: CSSProperties = {
  color: 'var(--color-text-error)',
  borderTop: '1px solid var(--color-border-secondary-light)',
}

const listCardFooterStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '0 20px 18px',
}

const listCardExploreStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  minHeight: '44px',
  padding: '0 20px',
  border: '1px solid var(--color-background-primary)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  fontWeight: 600,
  fontSize: 'var(--type-body-s-size, 15px)',
  cursor: 'pointer',
}

const listCardInfoGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '24px 32px',
  padding: '16px 20px',
}

const infoBlockLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--type-body-s-size, 14px)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}

const infoBlockValueStyle: CSSProperties = {
  margin: '8px 0 0',
  fontSize: 'var(--type-body-m-size, 15px)',
  color: 'var(--color-text-primary)',
  lineHeight: 1.35,
}

const analysisWrapStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-inline-xxs, 4px)',
  flexWrap: 'wrap',
}

const analysisBadgeStyle: CSSProperties = {
  borderRadius: 'var(--radius-rounded)',
  padding: '2px var(--spacing-inset-xs)',
  fontSize: 'var(--type-body-xs-size, 13px)',
  fontWeight: 700,
  // Stesso font dei badge di Valutazione (Tailwind font-mono → JetBrains Mono)
  fontFamily: 'var(--font-family-0, "JetBrains Mono", ui-monospace, monospace)',
  letterSpacing: '0.025em',
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










