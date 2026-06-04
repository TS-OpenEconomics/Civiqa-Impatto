/* ══════════════════════════════════════════════════════════════
   mockValutazione.ts — Valutazione projects mock data
   Colleferro (dipartimento tab) + Lazio province/comuni (provincia tab)
   ══════════════════════════════════════════════════════════════ */

export type AnalysisType = 'EIA' | 'ECBA' | 'ESG'

export type ProjectStatus =
  | 'approvato'
  | 'in_partenza'
  | 'in_preparazione'
  | 'in_approvazione'
  | 'bozza'

export interface ValutazioneProject {
  id: string
  nome: string
  cup: string
  createdAt: string
  descrizione: string
  settore: string
  tipoIntervento: string
  proprietario: string
  inizioLavori: string
  durataLavori: string
  stato: ProjectStatus
  analisi: AnalysisType[]
  isDraft: boolean
}

/* ─── Comune di Colleferro ─── */
export const COLLEFERRO_PROJECTS: ValutazioneProject[] = [
  {
    id: 'cf-001',
    nome: 'Riqualificazione area industriale ex-BPD — Parco urbano',
    cup: 'I63C23000010058',
    createdAt: '10/01/2025',
    descrizione:
      'Bonifica e riconversione del sito ex-BPD (dismesso dal 2005): realizzazione di un parco urbano attrezzato, percorsi ciclopedonali, spazi per artigianato innovativo e orti sociali. Intervento strategico per la rigenerazione del tessuto urbano.',
    settore: 'Riqualificazione urbana',
    tipoIntervento: 'Riqualificazione',
    proprietario: 'Laura Conti',
    inizioLavori: '01/06/2025',
    durataLavori: '3 anni',
    stato: 'approvato',
    analisi: ['EIA', 'ECBA', 'ESG'],
    isDraft: false,
  },
  {
    id: 'cf-002',
    nome: 'Riqualificazione Piazza Italia e centro storico',
    cup: 'I63C23000020058',
    createdAt: '15/02/2025',
    descrizione:
      "Riqualificazione dello spazio pubblico centrale con nuova pavimentazione, arredo urbano, illuminazione LED e sistemazione del verde. L'intervento mira al miglioramento dell'accessibilità e della qualità urbana del centro storico.",
    settore: 'Spazi pubblici e arredo urbano',
    tipoIntervento: 'Riqualificazione',
    proprietario: 'Marco Bianchi',
    inizioLavori: '-',
    durataLavori: '1 anno, 4 mesi',
    stato: 'in_preparazione',
    analisi: ['EIA', 'ECBA'],
    isDraft: false,
  },
  {
    id: 'cf-003',
    nome: 'Polo Scolastico Colleferro Nord — nuova costruzione',
    cup: 'I63C23000030058',
    createdAt: '20/03/2025',
    descrizione:
      'Realizzazione di un nuovo polo scolastico comprensivo (infanzia, primaria e secondaria di primo grado) nella zona nord del territorio comunale, con impianti fotovoltaici e spazi sportivi integrati.',
    settore: 'Istruzione',
    tipoIntervento: 'Nuova costruzione',
    proprietario: 'Giovanni Esposito',
    inizioLavori: '15/09/2025',
    durataLavori: '3 anni, 2 mesi',
    stato: 'in_partenza',
    analisi: ['EIA', 'ECBA', 'ESG'],
    isDraft: false,
  },
  {
    id: 'cf-004',
    nome: 'Pista ciclabile stazione FS — centro storico',
    cup: 'I63C23000040058',
    createdAt: '05/04/2025',
    descrizione:
      'Realizzazione di un percorso ciclopedonale protetto che collega la stazione ferroviaria al centro storico lungo via Consolare Latina, con rastrelliere, segnaletica dedicata e messa in sicurezza degli incroci.',
    settore: 'Mobilità sostenibile',
    tipoIntervento: 'Nuova costruzione',
    proprietario: 'Laura Conti',
    inizioLavori: '10/06/2025',
    durataLavori: '8 mesi',
    stato: 'approvato',
    analisi: ['ESG'],
    isDraft: false,
  },
  {
    id: 'cf-005',
    nome: 'Efficientamento energetico edifici comunali',
    cup: 'I63C23000050058',
    createdAt: '12/04/2025',
    descrizione:
      'Piano di riqualificazione energetica degli edifici di proprietà comunale: sostituzione impianti di riscaldamento, isolamento termico delle superfici opache, installazione di pannelli fotovoltaici.',
    settore: 'Efficienza energetica',
    tipoIntervento: 'Efficientamento',
    proprietario: 'Marco Bianchi',
    inizioLavori: '01/04/2025',
    durataLavori: '1 anno, 6 mesi',
    stato: 'approvato',
    analisi: ['ECBA', 'ESG'],
    isDraft: false,
  },
  {
    id: 'cf-006',
    nome: 'Nuovo impianto sportivo polivalente',
    cup: 'I63C23000060058',
    createdAt: '01/05/2025',
    descrizione:
      "Costruzione di un impianto sportivo coperto con palestra, piscina semiolimpionica e campi all'aperto. Destinato prevalentemente alle scuole e alle associazioni sportive locali.",
    settore: 'Sport e tempo libero',
    tipoIntervento: 'Nuova costruzione',
    proprietario: 'Giovanni Esposito',
    inizioLavori: '-',
    durataLavori: '4 anni',
    stato: 'bozza',
    analisi: ['EIA', 'ECBA'],
    isDraft: true,
  },
  {
    id: 'cf-007',
    nome: 'Riqualificazione area produttiva dismessa — via Consolare',
    cup: 'I63C23000070058',
    createdAt: '18/05/2025',
    descrizione:
      'Bonifica e riconversione di aree produttive in disuso lungo via Consolare Latina. Il progetto prevede la creazione di hub per PMI innovative, spazi coworking e verde pubblico attrezzato.',
    settore: 'Riqualificazione urbana',
    tipoIntervento: 'Riqualificazione',
    proprietario: 'Laura Conti',
    inizioLavori: '-',
    durataLavori: '2 anni, 10 mesi',
    stato: 'in_preparazione',
    analisi: ['EIA', 'ESG'],
    isDraft: false,
  },
  {
    id: 'cf-008',
    nome: 'Potenziamento rete idrica zona nord',
    cup: 'I63C23000080058',
    createdAt: '02/06/2025',
    descrizione:
      "Ammodernamento e potenziamento della rete di distribuzione idrica nel quadrante nord del comune. Riduzione delle perdite idriche e miglioramento della pressione d'esercizio.",
    settore: 'Servizi pubblici',
    tipoIntervento: 'Ristrutturazione',
    proprietario: 'Marco Bianchi',
    inizioLavori: '-',
    durataLavori: '2 anni',
    stato: 'in_approvazione',
    analisi: ['ECBA'],
    isDraft: false,
  },
]

/* ─── Province e comuni del Lazio ─── */
export const LAZIO_PROJECTS: ValutazioneProject[] = [
  {
    id: 'lz-001',
    nome: 'Ospedale Provinciale Roma Est — ristrutturazione',
    cup: 'H63C22000010058',
    createdAt: '08/11/2024',
    descrizione:
      'Ristrutturazione e ammodernamento del presidio ospedaliero provinciale, con nuovi reparti di emergenza, diagnostica avanzata e miglioramento della resistenza sismica della struttura.',
    settore: 'Sanità',
    tipoIntervento: 'Ristrutturazione',
    proprietario: 'Francesca Mori',
    inizioLavori: '01/06/2025',
    durataLavori: '3 anni, 8 mesi',
    stato: 'approvato',
    analisi: ['EIA', 'ECBA', 'ESG'],
    isDraft: false,
  },
  {
    id: 'lz-002',
    nome: 'Potenziamento rete trasporti regionali Lazio',
    cup: 'H63C22000020058',
    createdAt: '22/01/2025',
    descrizione:
      "Estensione e ammodernamento della rete ferroviaria regionale con nuove fermate suburbane, acquisto di materiale rotabile elettrico e integrazione tariffaria con il trasporto locale.",
    settore: 'Infrastrutture di trasporto',
    tipoIntervento: 'Potenziamento',
    proprietario: 'Francesca Mori',
    inizioLavori: '-',
    durataLavori: '5 anni',
    stato: 'in_approvazione',
    analisi: ['EIA', 'ECBA'],
    isDraft: false,
  },
  {
    id: 'lz-003',
    nome: 'Piano Urbano Mobilità Sostenibile — Velletri',
    cup: 'H63C22000030058',
    createdAt: '14/03/2025',
    descrizione:
      'Redazione e attuazione del Piano Urbano per la Mobilità Sostenibile di Velletri, con interventi di moderazione del traffico, ampliamento della ZTL e nuovi percorsi ciclopedonali.',
    settore: 'Mobilità sostenibile',
    tipoIntervento: 'Piano strategico',
    proprietario: 'Roberto Ferrara',
    inizioLavori: '-',
    durataLavori: '1 anno, 6 mesi',
    stato: 'in_preparazione',
    analisi: ['ESG'],
    isDraft: false,
  },
  {
    id: 'lz-004',
    nome: 'Recupero e valorizzazione area portuale — Civitavecchia',
    cup: 'H63C22000040058',
    createdAt: '29/03/2025',
    descrizione:
      'Riqualificazione del waterfront portuale con nuovi spazi pubblici, terminal crociere moderno, hub logistico intermodale e parco costiero accessibile.',
    settore: 'Infrastrutture portuali',
    tipoIntervento: 'Riqualificazione',
    proprietario: 'Maria Conti',
    inizioLavori: '01/09/2025',
    durataLavori: '4 anni, 3 mesi',
    stato: 'approvato',
    analisi: ['EIA', 'ECBA', 'ESG'],
    isDraft: false,
  },
  {
    id: 'lz-005',
    nome: 'Centro raccolta differenziata — Frosinone',
    cup: 'H63C22000050060',
    createdAt: '10/05/2025',
    descrizione:
      "Realizzazione di un nuovo centro di raccolta e differenziazione dei rifiuti solidi urbani in linea con la normativa UE sull'economia circolare e gli obiettivi regionali al 70% di riciclo.",
    settore: 'Gestione rifiuti',
    tipoIntervento: 'Nuova costruzione',
    proprietario: 'Roberto Ferrara',
    inizioLavori: '-',
    durataLavori: '1 anno, 2 mesi',
    stato: 'bozza',
    analisi: ['ECBA', 'ESG'],
    isDraft: true,
  },
]
