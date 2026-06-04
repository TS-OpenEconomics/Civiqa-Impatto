// ================================================================
// OpenCore — Needs (Municipal Territorial Needs)
// Civiqa OpenCore v2 · May 2026
//
// Derivation: bottom-up analysis of all 198 MOP categories +
// 8 SM (mediated services) categories. Each fabbisogno represents
// a distinct territorial need that a municipality can address
// through public investment.
//
// User flow: Tema TC → Need → MOP categories → DOCFAP wizard
// The MOP category is an OUTPUT of the chosen fabbisogno, not an
// input from the user.
//
// Normative anchorage (three mandatory sources per fabbisogno):
//   1. SOSE / D.Lgs. 216/2010  — standard municipal functions
//   2. DUP Missions (D.Lgs. 118/2011 Allegato 4/1)
//   3. RSO — Obiettivi Specifici AP 2021-2027
//
// Fund corrections v2:
//   [FC1] FC (Fondo di Coesione) removed — Italy is not a beneficiary
//   [FC2] FC replaced by FSC where it was the only non-FESR fund
//   [FC3] PNRR retained with closure note (30/06/2026)
//   [FC4] MIBACT/MUR (ministry names) → FSC
//   [FC5] FNDC (unverified) → FSC
//   [FC6] FNA → FNNA (corrected abbreviation)
//
// Architectural invariants:
//   [F1] Needs ≠ MCA clusters. Clusters key to physical
//        intervention risk profile; fabbisogni key to territorial
//        demand. Orthogonal dimensions.
//   [F2] Every fabbisogno has ≥1 category in category_codes.
//   [F3] natura_cup belongs to alternatives, not to fabbisogni.
//   [F4] visible_dataroom: false for TC08-TC11 at launch.
//   [F5] funding_gap: true when AP 2021-2027 RSO coverage is
//        absent or marginal for this need.
//   [F6] Codes FAB-01…FAB-63 are stable — never renumber.
//   [F7] q2_label = null for greenfield-only fabbisogni (no
//        pre-existing asset with measurable residual life).
//   [F8] cluster_mca = "NONE" for SM-category-only fabbisogni
//        (vouchers, grants — no physical asset, no MCA cluster).
// ================================================================

/** Code + extended label pair for normative cross-references */
export interface CodeLabel {
  code: string;
  label: string;
}

export interface Need {
  /** Stable identifier. Never renumber. [F6] */
  code: string;
  /** Short label shown in the wizard need-selection step */
  label: string;
  /** FK → Theme.code (TC01-TC12) */
  tema_code: string;
  /** true = shown in DOCFAP wizard need selector (always true) */
  visible_docfap: boolean;
  /** true = DataRoom indicators available for this tema at launch [F4] */
  visible_dataroom: boolean;
  /** SOSE / D.Lgs. 216/2010 standard municipal function reference */
  sose_function: string;
  /** DUP Missions — D.Lgs. 118/2011 Allegato 4/1 */
  missions: CodeLabel[];
  /** RSO — Obiettivi Specifici Accordo di Partenariato 2021-2027 */
  rso: CodeLabel[];
  /** Fondi eleggibili (EU, nazionali, locali) */
  funds: CodeLabel[];
  /** true = limited AP 2021-2027 RSO coverage; wizard warns user [F5] */
  funding_gap: boolean;
  /** Wizard Q1: current status of the service or asset */
  q1_label: string;
  /** Wizard Q2: residual life of existing asset. null = greenfield [F7] */
  q2_label: string | null;
  /** Wizard Q3: annual OPEX + recurring CAPEX */
  q3_label: string;
  /** FK → MCA cluster (C01-C13) or "NONE" for non-physical [F8] */
  cluster_mca: string;
  /** Human-readable description of the need for wizard UI */
  description: string;
  /** FK[] → ProjectCategory.code. MOP categories for this need [F2] */
  category_codes: string[];
}

export const NEEDS: Need[] = [

  // ════════════════════════════════════════════════════════════════
  // TC06 — AMBIENTE E TERRITORIO (12 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-01",
    label: "Sicurezza idrogeologica e difesa del suolo",
    tema_code: "TC06",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Difesa del suolo e protezione civile",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
      { code: "M11", label: "Soccorso civile" },
    ],
    rso: [
      { code: "RSO2.4", label: "Adattamento climatico e rischi" },
      { code: "RSO2.5", label: "Acqua e gestione idrica" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Livello di rischio idrogeologico/sismico nel territorio",
    q2_label: "Vita utile residua delle opere di difesa esistenti",
    q3_label: "Costo annuo manutenzione opere di difesa e monitoraggio",
    cluster_mca: "C07",
    description: "Rischio idrogeologico e sismico che minaccia la sicurezza di persone, edifici e infrastrutture. Finanzia consolidamento di abitati a rischio frana, sistemazione di corsi d'acqua e regimazione idraulica, opere di difesa del suolo e rimboschimenti protettivi.",
    category_codes: ["C001", "C002", "C004", "C005", "C006", "C007", "C008", "C011", "C027"],
  },

  {
    code: "FAB-02",
    label: "Adeguamento sismico di edifici pubblici che erogano servizi",
    tema_code: "TC06",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Difesa del suolo e protezione civile",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
      { code: "M11", label: "Soccorso civile" },
    ],
    rso: [
      { code: "RSO2.5", label: "Acqua e gestione idrica" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Classe di rischio sismico dell'edificio (NTC2018)",
    q2_label: "Vita utile residua ante-adeguamento (anni stimati)",
    q3_label: "Costo annuo gestione e manutenzione dell'edificio",
    cluster_mca: "C07",
    description: "Edifici pubblici che erogano servizi essenziali (scuole, ospedali, uffici) privi di adeguamento sismico secondo le normative vigenti. Finanzia interventi strutturali antisismici su edifici scolastici, sanitari, amministrativi e impianti sportivi.",
    category_codes: ["C008", "C095", "C096", "C105", "C106", "C108", "C109", "C110", "C112"],
  },

  {
    code: "FAB-03",
    label: "Ricostruzione post-calamità e resilienza del territorio",
    tema_code: "TC06",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Protezione civile post-emergenza",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
      { code: "M11", label: "Soccorso civile" },
    ],
    rso: [
      { code: "RSO2.5", label: "Acqua e gestione idrica" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Entità del danno subito dalla calamità (% patrimonio)",
    q2_label: "Vita utile residua delle strutture danneggiate",
    q3_label: "Costo annuo gestione strutture provvisorie o danneggiate",
    cluster_mca: "C07",
    description: "Danni a edifici, infrastrutture e territorio causati da eventi calamitosi (sisma, alluvione, frana). Finanzia ripristino di fabbricati danneggiati, ricostruzione di beni culturali colpiti e potenziamento delle infrastrutture di protezione civile.",
    category_codes: ["C078", "C092", "C100"],
  },

  {
    code: "FAB-04",
    label: "Bonifica e decontaminazione di siti inquinati",
    tema_code: "TC06",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Tutela dell'ambiente e gestione siti contaminati",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
    ],
    rso: [
      { code: "RSO2.6", label: "Economia circolare e rifiuti" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Livello e natura della contaminazione (classe APAT)",
    q2_label: "Vita utile residua del sito ante-bonifica",
    q3_label: "Costo annuo monitoraggio e gestione del sito inquinato",
    cluster_mca: "C08",
    description: "Presenza di suoli, acque sotterranee o aree industriali dismesse contaminate da sostanze inquinanti. Finanzia bonifica di siti contaminati, decontaminazione di aree dismesse, sistemazione di terreni e impianti per il trattamento di rifiuti speciali.",
    category_codes: ["C003", "C014", "C016", "C069", "C199"],
  },

  {
    code: "FAB-05",
    label: "Qualità ecologica, fruizione e monitoraggio dei corpi idrici",
    tema_code: "TC06",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Tutela delle acque e gestione del rischio idrico",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
    ],
    rso: [
      { code: "RSO2.3", label: "Sistemi energetici intelligenti" },
      { code: "RSO2.7", label: "Natura e biodiversità" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Stato ecologico del corpo idrico (classe WFD 2000/60)",
    q2_label: "Vita utile residua delle opere idrauliche esistenti",
    q3_label: "Costo annuo monitoraggio e manutenzione del corpo idrico",
    cluster_mca: "C08",
    description: "Corpi idrici (fiumi, laghi, bacini) in cattivo stato ecologico o non monitorati adeguatamente. Finanzia miglioramento della qualità dei corpi idrici, sistemi di monitoraggio ambientale, infrastrutture fluviali e impianti idroelettrici integrati.",
    category_codes: ["C004", "C011", "C017", "C041", "C050", "C176"],
  },

  {
    code: "FAB-06",
    label: "Approvvigionamento e distribuzione idrica potabile",
    tema_code: "TC06",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Ciclo integrato delle acque — approvvigionamento",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
    ],
    rso: [
      { code: "RSO2.3", label: "Sistemi energetici intelligenti" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Copertura attuale del servizio idrico (% popolazione)",
    q2_label: "Vita utile residua della rete idrica",
    q3_label: "Costo annuo gestione rete idrica e perdite",
    cluster_mca: "C08",
    description: "Carenza o inadeguatezza delle infrastrutture per l'approvvigionamento e la distribuzione di acqua potabile. Finanzia acquedotti, reti idriche urbane, dissalatori, serbatoi, impianti di sollevamento, dighe e bacini di accumulo.",
    category_codes: ["C017", "C018", "C026", "C028", "C032", "C200", "C201", "C202", "C204"],
  },

  {
    code: "FAB-07",
    label: "Depurazione acque reflue e ciclo fognario",
    tema_code: "TC06",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Ciclo integrato delle acque — depurazione",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
    ],
    rso: [
      { code: "RSO2.3", label: "Sistemi energetici intelligenti" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Copertura rete fognaria e capacità depurativa (AE)",
    q2_label: "Vita utile residua degli impianti di depurazione",
    q3_label: "Costo annuo gestione depuratori e rete fognaria",
    cluster_mca: "C08",
    description: "Reti fognarie obsolete o impianti di depurazione insufficienti rispetto ai carichi civili e industriali. Finanzia reti fognarie, impianti di depurazione acque reflue, sistemi di stoccaggio e pre-trattamento acque, reti di collettamento pluviale.",
    category_codes: ["C019", "C020", "C023", "C027"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC02 — ECONOMIA E LAVORO (11 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-08",
    label: "Reti idriche per usi produttivi industriali",
    tema_code: "TC02",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Infrastrutture per aree produttive — servizi idrici",
    missions: [
      { code: "M14", label: "Sviluppo economico e competitività" },
    ],
    rso: [
      { code: "RSO1.3", label: "Competitività PMI" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
    ],
    funding_gap: true,
    q1_label: "Disponibilità attuale di acqua industriale nelle aree produttive",
    q2_label: "Vita utile residua delle reti idriche industriali",
    q3_label: "Costo annuo gestione rete idrica industriale",
    cluster_mca: "C08",
    description: "Aree produttive e industriali prive di reti idriche adeguate per usi produttivi. Finanzia reti idriche industriali e infrastrutture per la captazione e distribuzione di acqua a uso non agricolo.",
    category_codes: ["C024", "C032"],
  },

  {
    code: "FAB-09",
    label: "Reti e infrastrutture idriche per usi agricoli",
    tema_code: "TC02",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Sviluppo rurale — infrastrutture irrigue",
    missions: [
      { code: "M14", label: "Sviluppo economico e competitività" },
      { code: "M16", label: "Agricoltura, politiche agroalimentari e pesca" },
    ],
    rso: [
      { code: "RSO3.1", label: "Rete TEN-T" },
    ],
    funds: [
      { code: "FEASR", label: "Fondo Europeo Agricolo per lo Sviluppo Rurale" },
    ],
    funding_gap: false,
    q1_label: "Disponibilità e copertura irrigua (% SAU irrigata)",
    q2_label: "Vita utile residua degli impianti irrigui",
    q3_label: "Costo annuo gestione consorzi irrigui e reti",
    cluster_mca: "C08",
    description: "Territorio agricolo con scarsa o assente infrastrutturazione irrigua, con perdite produttive significative. Finanzia reti idriche rurali, impianti irrigui interaziendali, infrastrutture di captazione per uso agricolo e laghetti collinari.",
    category_codes: ["C025", "C031", "C140", "C203"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC06 — AMBIENTE E TERRITORIO (12 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-10",
    label: "Gestione, trattamento e smaltimento dei rifiuti urbani",
    tema_code: "TC06",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Ciclo dei rifiuti urbani",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
    ],
    rso: [
      { code: "RSO2.2", label: "Energie rinnovabili" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Percentuale raccolta differenziata attuale (%)",
    q2_label: "Vita utile residua degli impianti di trattamento",
    q3_label: "Costo annuo gestione raccolta e smaltimento rifiuti",
    cluster_mca: "C08",
    description: "Gestione insufficiente o non conforme dei rifiuti urbani, con bassa percentuale di raccolta differenziata. Finanzia impianti per il trattamento dei rifiuti urbani e speciali, sistemi di raccolta differenziata, impianti di compostaggio e smaltimento.",
    category_codes: ["C021", "C022", "C029", "C030", "C193", "C194"],
  },

  {
    code: "FAB-11",
    label: "Tutela della biodiversità, aree protette e fruizione del patrimonio naturale",
    tema_code: "TC06",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Tutela della natura e fruizione ambientale",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
    ],
    rso: [
      { code: "RSO2.7", label: "Natura e biodiversità" },
      { code: "RSO2.8", label: "Mobilità urbana sostenibile" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Stato di conservazione delle aree naturali e dei siti",
    q2_label: "Vita utile residua delle infrastrutture di fruizione",
    q3_label: "Costo annuo gestione aree protette e sentieristica",
    cluster_mca: "C09",
    description: "Perdita di biodiversità, degrado di ecosistemi naturali e scarsa accessibilità al patrimonio ambientale. Finanzia parchi e riserve naturali, infrastrutture verdi, siti naturali e rurali, sistemi di monitoraggio dell'inquinamento e strutture per la fruizione ambientale.",
    category_codes: ["C009", "C010", "C012", "C013", "C168", "C195", "C197", "C198"],
  },

  {
    code: "FAB-12",
    label: "Verde urbano e infrastrutture verdi",
    tema_code: "TC06",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Verde pubblico urbano e periurbano",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
    ],
    rso: [
      { code: "RSO2.8", label: "Mobilità urbana sostenibile" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "MUN", label: "Risorse proprie del comune" },
    ],
    funding_gap: false,
    q1_label: "Dotazione pro capite di verde urbano (mq/ab)",
    q2_label: "Vita utile residua delle infrastrutture verdi",
    q3_label: "Costo annuo manutenzione verde pubblico",
    cluster_mca: "C09",
    description: "Carenza di verde urbano, aree verdi di qualità insufficiente o infrastrutture verdi assenti nel tessuto urbano. Finanzia parchi urbani, infrastrutture verdi, verde pubblico attrezzato e interventi per la riduzione dell'isola di calore.",
    category_codes: ["C086", "C196"],
  },

  {
    code: "FAB-13",
    label: "Gestione e presidio del patrimonio forestale",
    tema_code: "TC06",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Gestione forestale e silvicoltura",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
      { code: "M16", label: "Agricoltura, politiche agroalimentari e pesca" },
    ],
    rso: [
      { code: "RSO2.9", label: "Riduzione inquinamento" },
      { code: "RSO3.2", label: "Mobilità regionale e locale" },
    ],
    funds: [
      { code: "FEASR", label: "Fondo Europeo Agricolo per lo Sviluppo Rurale" },
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
    ],
    funding_gap: false,
    q1_label: "Stato del patrimonio forestale (ha, indice di gestione)",
    q2_label: "Vita utile residua delle infrastrutture forestali",
    q3_label: "Costo annuo gestione e presidio forestale",
    cluster_mca: "C12",
    description: "Patrimonio forestale degradato, a rischio incendio o non gestito secondo criteri di sostenibilità. Finanzia forestazione produttiva, opere per la resilienza degli ecosistemi forestali, infrastrutture a servizio delle aziende forestali e vivai.",
    category_codes: ["C005", "C163", "C164", "C165", "C166", "C167", "C169", "C220"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC09 — ENERGIA E CLIMA (4 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-14",
    label: "Modernizzazione e resilienza delle reti energetiche locali",
    tema_code: "TC09",
    visible_docfap: true,
    visible_dataroom: false,
    sose_function: "Infrastrutture energetiche locali",
    missions: [
      { code: "M17", label: "Energia e diversificazione delle fonti energetiche" },
    ],
    rso: [
      { code: "RSO2.1", label: "Efficienza energetica" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
    ],
    funding_gap: false,
    q1_label: "Stato e vetustà della rete di distribuzione energetica",
    q2_label: "Vita utile residua delle infrastrutture di rete",
    q3_label: "Costo annuo gestione reti e perdite energetiche",
    cluster_mca: "C10",
    description: "Reti energetiche locali obsolete, inefficienti o non integrate con le fonti rinnovabili. Finanzia reti di distribuzione di energia elettrica e termica, metanodotti, impianti per l'efficienza delle reti, elettrificazioni rurali.",
    category_codes: ["C033", "C034", "C035", "C036", "C037", "C042", "C205", "C206", "C207", "C208"],
  },

  {
    code: "FAB-15",
    label: "Efficienza energetica di edifici e impianti pubblici",
    tema_code: "TC09",
    visible_docfap: true,
    visible_dataroom: false,
    sose_function: "Efficienza energetica della PA",
    missions: [
      { code: "M17", label: "Energia e diversificazione delle fonti energetiche" },
    ],
    rso: [
      { code: "RSO2.1", label: "Efficienza energetica" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Classe energetica attuale dell'edificio/impianto (A4-G)",
    q2_label: "Vita utile residua ante-efficientamento (anni stimati)",
    q3_label: "Costo annuo energia, manutenzione impianti termici e raffreddamento",
    cluster_mca: "C10",
    description: "Edifici e impianti pubblici con elevati consumi energetici e classe energetica bassa. Finanzia riqualificazione energetica di edifici scolastici, sanitari e amministrativi, installazione di impianti FER su edifici pubblici, cappotti termici e sistemi BACS.",
    category_codes: ["C034", "C036", "C039", "C040", "C085", "C096", "C105", "C106", "C108", "C109", "C112"],
  },

  {
    code: "FAB-16",
    label: "Transizione energetica e riduzione delle emissioni climalteranti",
    tema_code: "TC09",
    visible_docfap: true,
    visible_dataroom: false,
    sose_function: "Decarbonizzazione e clima",
    missions: [
      { code: "M17", label: "Energia e diversificazione delle fonti energetiche" },
    ],
    rso: [
      { code: "RSO2.1", label: "Efficienza energetica" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Emissioni climalteranti del territorio (tCO2eq/anno)",
    q2_label: null,
    q3_label: "Costo annuo gestione impianti e monitoraggio emissioni",
    cluster_mca: "C10",
    description: "Emissioni climalteranti elevate nel territorio per dipendenza da fonti fossili e bassa efficienza del parco edilizio e produttivo. Finanzia impianti FER, investimenti agro-climatico-ambientali e interventi integrati per la transizione energetica.",
    category_codes: ["C037", "C159", "C164"],
  },

  {
    code: "FAB-17",
    label: "Produzione locale di energia da fonti rinnovabili",
    tema_code: "TC09",
    visible_docfap: true,
    visible_dataroom: false,
    sose_function: "Produzione FER e comunità energetiche",
    missions: [
      { code: "M17", label: "Energia e diversificazione delle fonti energetiche" },
    ],
    rso: [
      { code: "RSO2.1", label: "Efficienza energetica" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Quota attuale di fabbisogno coperta da FER locali (%)",
    q2_label: null,
    q3_label: "Costo annuo gestione e manutenzione impianti FER",
    cluster_mca: "C10",
    description: "Assenza o insufficienza di impianti per la produzione locale di energia da fonti rinnovabili. Finanzia impianti idroelettrici, fotovoltaici, eolici e di cogenerazione, anche in configurazione di comunità energetica.",
    category_codes: ["C038", "C039", "C041"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC08 — PATRIMONIO PUBBLICO (3 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-18",
    label: "Rigenerazione urbana e riqualificazione di aree degradate",
    tema_code: "TC08",
    visible_docfap: true,
    visible_dataroom: false,
    sose_function: "Rigenerazione urbana e coesione territoriale",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
    ],
    rso: [
      { code: "RSO5.1", label: "Sviluppo urbano integrato" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Grado di degrado e abbandono dell'area (% superficie)",
    q2_label: "Vita utile residua delle strutture esistenti nell'area",
    q3_label: "Costo annuo gestione e vigilanza dell'area degradata",
    cluster_mca: "C09",
    description: "Aree urbane degradate con tessuto edilizio obsoleto, spazi pubblici deteriorati e bassa qualità dell'abitare. Finanzia rigenerazione urbana, recupero di aree dismesse, riqualificazione del patrimonio residenziale e rivitalizzazione dei centri storici.",
    category_codes: ["C014", "C048", "C076", "C158"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC02 — ECONOMIA E LAVORO (11 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-19",
    label: "Riconversione e reindustrializzazione di aree produttive dismesse",
    tema_code: "TC02",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Sviluppo economico — riconversione produttiva",
    missions: [
      { code: "M14", label: "Sviluppo economico e competitività" },
    ],
    rso: [
      { code: "RSO1.4", label: "Competenze per specializzazione intelligente" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
    ],
    funding_gap: false,
    q1_label: "Superficie di aree produttive dismesse disponibili (ha)",
    q2_label: "Vita utile residua degli impianti ante-conversione",
    q3_label: "Costo annuo custodia e manutenzione aree dismesse",
    cluster_mca: "C12",
    description: "Aree produttive dismesse o sottoutilizzate che compromettono l'attrattività economica del territorio. Finanzia riconversione industriale, sistemazione dei terreni, trattamento di rifiuti speciali derivanti dalla bonifica e recupero funzionale.",
    category_codes: ["C014", "C015", "C069", "C158"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC07 — MOBILITÀ E TRASPORTI (10 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-20",
    label: "Sicurezza e qualità della rete stradale locale",
    tema_code: "TC07",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Viabilità locale e sicurezza stradale",
    missions: [
      { code: "M10", label: "Trasporti e diritto alla mobilità" },
    ],
    rso: [
      { code: "RSO3.3", label: "Mobilità multimodale" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
      { code: "MUN", label: "Risorse proprie del comune" },
    ],
    funding_gap: false,
    q1_label: "Stato di conservazione della rete stradale (IRI medio)",
    q2_label: "Vita utile residua dell'infrastruttura stradale",
    q3_label: "Costo annuo manutenzione ordinaria e straordinaria strade",
    cluster_mca: "C01",
    description: "Rete stradale locale con deficit di sicurezza, manutenzione insufficiente o inadeguata agli standard. Finanzia strade comunali, piste ciclabili, interventi di messa in sicurezza e sistemi integrati di trasporto intelligente.",
    category_codes: ["C054", "C057", "C058", "C065", "C085"],
  },

  {
    code: "FAB-21",
    label: "Accessibilità stradale in aree rurali e montane",
    tema_code: "TC07",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Viabilità rurale e montana",
    missions: [
      { code: "M10", label: "Trasporti e diritto alla mobilità" },
    ],
    rso: [
      { code: "RSO3.3", label: "Mobilità multimodale" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Grado di isolamento delle aree rurali/montane (min distanza servizi)",
    q2_label: "Vita utile residua delle strade rurali",
    q3_label: "Costo annuo manutenzione strade rurali e montane",
    cluster_mca: "C01",
    description: "Aree rurali e montane con accessibilità stradale limitata che penalizza la mobilità e i servizi. Finanzia strade comunali e rurali con priorità alle aree a bassa accessibilità e ai centri isolati.",
    category_codes: ["C057", "C058"],
  },

  {
    code: "FAB-22",
    label: "Accessibilità stradale sovralocale",
    tema_code: "TC07",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Infrastrutture stradali sovralocali",
    missions: [
      { code: "M10", label: "Trasporti e diritto alla mobilità" },
    ],
    rso: [
      { code: "RSO3.1", label: "Rete TEN-T" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: true,
    q1_label: "Accessibilità sovralocale del territorio (minuti dai principali nodi)",
    q2_label: "Vita utile residua dell'infrastruttura",
    q3_label: "Costo annuo manutenzione e gestione",
    cluster_mca: "C01",
    description: "Connessione stradale con la rete sovralocale (provinciale, statale, autostradale) insufficiente. Finanzia strade regionali, provinciali e statali in accordo con enti sovraordinati, e strade vicinali interpoderali.",
    category_codes: ["C055", "C059"],
  },

  {
    code: "FAB-23",
    label: "Mobilità ciclabile, pedonale e micro-mobilità sostenibile",
    tema_code: "TC07",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Mobilità attiva e sostenibile",
    missions: [
      { code: "M10", label: "Trasporti e diritto alla mobilità" },
    ],
    rso: [
      { code: "RSO2.8", label: "Mobilità urbana sostenibile" },
      { code: "RSO3.2", label: "Mobilità regionale e locale" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Estensione rete ciclopedonale esistente (km per 1000 ab)",
    q2_label: "Vita utile residua delle infrastrutture ciclopedonali",
    q3_label: "Costo annuo manutenzione percorsi e sistemi sharing",
    cluster_mca: "C01",
    description: "Assenza o inadeguatezza di infrastrutture per la mobilità attiva (ciclabile, pedonale) nel territorio. Finanzia piste ciclabili, percorsi pedonali protetti e infrastrutture per la micro-mobilità sostenibile.",
    category_codes: ["C056", "C066"],
  },

  {
    code: "FAB-24",
    label: "Accessibilità e mobilità in contesti specifici",
    tema_code: "TC07",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Mobilità in contesti montani, insulari e urbani complessi",
    missions: [
      { code: "M10", label: "Trasporti e diritto alla mobilità" },
    ],
    rso: [
      { code: "RSO3.2", label: "Mobilità regionale e locale" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Grado di accessibilità delle aree servite",
    q2_label: "Vita utile residua degli impianti di risalita o mobilità",
    q3_label: "Costo annuo gestione impianti e servizi di mobilità speciale",
    cluster_mca: "C01",
    description: "Difficoltà di accesso e mobilità in contesti specifici: aree montane, isole, siti turistici o produttivi non raggiunti dal trasporto ordinario. Finanzia funivie, seggiovie, funicolari e sistemi di trasporto intelligente per contesti specifici.",
    category_codes: ["C060", "C061"],
  },

  {
    code: "FAB-25",
    label: "Trasporto pubblico locale e accessibilità urbana",
    tema_code: "TC07",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "TPL e mobilità collettiva",
    missions: [
      { code: "M10", label: "Trasporti e diritto alla mobilità" },
    ],
    rso: [
      { code: "RSO3.2", label: "Mobilità regionale e locale" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Livello di copertura e frequenza del TPL (abitanti serviti %)",
    q2_label: "Vita utile residua delle infrastrutture TPL",
    q3_label: "Costo annuo gestione infrastrutture e contributo al servizio",
    cluster_mca: "C01",
    description: "Offerta di trasporto pubblico locale insufficiente, con bassa frequenza o copertura territoriale inadeguata. Finanzia infrastrutture per il TPL urbano, sistemi di parcheggio e interscambio modale, mobilità sostenibile integrata.",
    category_codes: ["C063", "C064", "C065", "C066", "C074", "C192"],
  },

  {
    code: "FAB-26",
    label: "Infrastrutture di trasporto aereo",
    tema_code: "TC07",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Accessibilità aerea del territorio",
    missions: [
      { code: "M10", label: "Trasporti e diritto alla mobilità" },
    ],
    rso: [
      { code: "RSO3.1", label: "Rete TEN-T" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: true,
    q1_label: "Accessibilità aerea del territorio (frequenze e destinazioni)",
    q2_label: "Vita utile residua delle infrastrutture aeroportuali",
    q3_label: "Costo annuo manutenzione e gestione aeroporto",
    cluster_mca: "C02",
    description: "Infrastrutture aeroportuali (aeroporti minori, aviosuperfici) inadeguate o sottodotate rispetto alla domanda. Finanzia piste, aerostazioni e strutture ausiliarie aeroportuali.",
    category_codes: ["C043", "C044", "C045"],
  },

  {
    code: "FAB-27",
    label: "Accessibilità ferroviaria e intermodalità",
    tema_code: "TC07",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Infrastrutture ferroviarie e nodi intermodali",
    missions: [
      { code: "M10", label: "Trasporti e diritto alla mobilità" },
    ],
    rso: [
      { code: "RSO3.1", label: "Rete TEN-T" },
      { code: "RSO3.2", label: "Mobilità regionale e locale" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Connettività ferroviaria del territorio (treni/giorno su linee principali)",
    q2_label: "Vita utile residua delle infrastrutture",
    q3_label: "Costo annuo manutenzione e gestione stazione",
    cluster_mca: "C02",
    description: "Accessibilità ferroviaria del territorio limitata, con stazioni degradate o connessioni intermodali assenti. Finanzia stazioni ferroviarie, linee ferroviarie, infrastrutture per l'intermodalità e veicoli ferroviari.",
    category_codes: ["C046", "C047", "C048", "C062", "C191"],
  },

  {
    code: "FAB-28",
    label: "Infrastrutture portuali, marittime e fluviali",
    tema_code: "TC07",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Infrastrutture portuali e vie d'acqua",
    missions: [
      { code: "M10", label: "Trasporti e diritto alla mobilità" },
    ],
    rso: [
      { code: "RSO3.1", label: "Rete TEN-T" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Capacità portuale e stato delle infrastrutture",
    q2_label: "Vita utile residua delle infrastrutture portuali",
    q3_label: "Costo annuo manutenzione e dragaggio",
    cluster_mca: "C02",
    description: "Infrastrutture portuali, marittime o fluviali insufficienti rispetto alle esigenze di mobilità e logistica. Finanzia porti commerciali, turistici e per la pesca, idrovie e strutture fluviali.",
    category_codes: ["C049", "C050", "C051"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC02 — ECONOMIA E LAVORO (11 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-29",
    label: "Logistica e infrastrutture per le merci",
    tema_code: "TC02",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Logistica e supply chain territoriale",
    missions: [
      { code: "M14", label: "Sviluppo economico e competitività" },
    ],
    rso: [
      { code: "RSO3.1", label: "Rete TEN-T" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
    ],
    funding_gap: true,
    q1_label: "Efficienza logistica del territorio (costi di distribuzione)",
    q2_label: "Vita utile residua delle infrastrutture logistiche",
    q3_label: "Costo annuo gestione magazzini e piattaforme",
    cluster_mca: "C02",
    description: "Carenza di infrastrutture logistiche e di connessione per il trasporto delle merci. Finanzia interporti, strutture portuali di servizio, strade vicinali interpoderali e sistemi di trasporto multimodale.",
    category_codes: ["C062", "C161", "C173"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC07 — MOBILITÀ E TRASPORTI (10 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-30",
    label: "Accessibilità e fruizione del demanio marittimo e lacustre",
    tema_code: "TC07",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Demanio marittimo e turismo costiero",
    missions: [
      { code: "M10", label: "Trasporti e diritto alla mobilità" },
    ],
    rso: [
      { code: "RSO5.1", label: "Sviluppo urbano integrato" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Qualità e accessibilità delle spiagge e del waterfront",
    q2_label: "Vita utile residua delle strutture costiere",
    q3_label: "Costo annuo manutenzione arenili e strutture balneari",
    cluster_mca: "C02",
    description: "Demanio marittimo e lacustre con accesso limitato o infrastrutture di fruizione inadeguate. Finanzia strutture portuali per il turismo e la pesca e infrastrutture per la difesa e valorizzazione costiera.",
    category_codes: ["C007", "C053"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC01 — CULTURA E TURISMO (3 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-31",
    label: "Conservazione e valorizzazione del patrimonio culturale",
    tema_code: "TC01",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Tutela del patrimonio culturale e paesaggistico",
    missions: [
      { code: "M05", label: "Tutela e valorizzazione dei beni e attività culturali" },
    ],
    rso: [
      { code: "RSO5.1", label: "Sviluppo urbano integrato" },
      { code: "RSO5.2", label: "Sviluppo locale non urbano" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Stato di conservazione del bene (classe conservazione MiC)",
    q2_label: "Vita utile residua del bene ante-intervento",
    q3_label: "Costo annuo manutenzione ordinaria e sorveglianza",
    cluster_mca: "C06",
    description: "Patrimonio culturale (monumenti, aree archeologiche, beni mobili) in stato di degrado o a rischio. Finanzia restauro e riqualificazione di beni culturali, musei, archivi, biblioteche, aree archeologiche e patrimonio rurale.",
    category_codes: ["C087", "C088", "C089", "C090", "C091", "C092", "C093", "C211", "C212", "C213", "C214"],
  },

  {
    code: "FAB-32",
    label: "Accesso alla cultura e all'offerta culturale per la comunità",
    tema_code: "TC01",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Servizi culturali per la comunità locale",
    missions: [
      { code: "M05", label: "Tutela e valorizzazione dei beni e attività culturali" },
    ],
    rso: [
      { code: "RSO5.1", label: "Sviluppo urbano integrato" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "MUN", label: "Risorse proprie del comune" },
    ],
    funding_gap: false,
    q1_label: "Offerta culturale pro capite (eventi, strutture per 1000 ab)",
    q2_label: "Vita utile residua delle strutture culturali",
    q3_label: "Costo annuo erogazione servizi culturali",
    cluster_mca: "C06",
    description: "Offerta culturale per la comunità locale insufficiente o concentrata in pochi centri. Finanzia musei, biblioteche, archivi, centri culturali e sociali per ampliare l'accesso alla cultura sul territorio.",
    category_codes: ["C089", "C107", "C114", "C211", "C212"],
  },

  {
    code: "FAB-33",
    label: "Sviluppo dell'offerta e dell'attrattività turistica",
    tema_code: "TC01",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Sviluppo economico del turismo locale",
    missions: [
      { code: "M07", label: "Turismo" },
    ],
    rso: [
      { code: "RSO5.1", label: "Sviluppo urbano integrato" },
      { code: "RSO1.3", label: "Competitività PMI" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Arrivi e presenze turistiche (trend ultimi 5 anni)",
    q2_label: "Vita utile residua delle strutture turistiche",
    q3_label: "Costo annuo gestione strutture e promozione",
    cluster_mca: "C06",
    description: "Attrattività turistica del territorio bassa per carenza di infrastrutture ricettive e di valorizzazione. Finanzia alberghi, strutture agrituristiche, centri di accoglienza, recupero del patrimonio culturale a fini turistici e strutture per eventi.",
    category_codes: ["C053", "C056", "C061", "C076", "C083", "C087", "C088", "C089", "C090", "C093", "C112", "C113", "C114", "C128", "C129", "C130", "C131", "C132", "C213", "C214", "C243"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC02 — ECONOMIA E LAVORO (11 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-34",
    label: "Sviluppo e infrastrutturazione di aree produttive",
    tema_code: "TC02",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Sviluppo economico locale — aree produttive",
    missions: [
      { code: "M14", label: "Sviluppo economico e competitività" },
    ],
    rso: [
      { code: "RSO1.3", label: "Competitività PMI" },
      { code: "RSO1.4", label: "Competenze per specializzazione intelligente" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
    ],
    funding_gap: false,
    q1_label: "Tasso di occupazione aree produttive (% lotti disponibili)",
    q2_label: "Vita utile residua delle infrastrutture produttive",
    q3_label: "Costo annuo manutenzione infrastrutture produttive",
    cluster_mca: "C12",
    description: "Aree produttive prive di infrastrutturazione adeguata (strade, reti, servizi) per insediare o ampliare attività industriali e artigianali. Finanzia zone industriali, strutture per la logistica, capannoni comuni e infrastrutture civili per aree produttive.",
    category_codes: ["C067", "C068", "C113", "C153", "C154", "C155", "C156", "C157", "C159", "C160", "C161", "C171"],
  },

  {
    code: "FAB-35",
    label: "Sviluppo e modernizzazione delle filiere agricole e agroalimentari",
    tema_code: "TC02",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Sviluppo rurale — filiere agroalimentari",
    missions: [
      { code: "M14", label: "Sviluppo economico e competitività" },
      { code: "M16", label: "Agricoltura, politiche agroalimentari e pesca" },
    ],
    rso: [
      { code: "RSO3.1", label: "Rete TEN-T" },
      { code: "RSO3.2", label: "Mobilità regionale e locale" },
    ],
    funds: [
      { code: "FEASR", label: "Fondo Europeo Agricolo per lo Sviluppo Rurale" },
    ],
    funding_gap: false,
    q1_label: "Valore della produzione agricola locale (€/ha SAU)",
    q2_label: "Vita utile residua degli impianti produttivi agricoli",
    q3_label: "Costo annuo gestione impianti e manutenzione fondi",
    cluster_mca: "C12",
    description: "Filiere agricole e agroalimentari con bassa competitività per insufficienza di infrastrutture, tecnologie e strutture di trasformazione. Finanzia fabbricati agroindustriali, impianti produttivi agricoli, reti irrigue, strutture zootecniche e miglioramenti fondiari.",
    category_codes: ["C133", "C136", "C137", "C138", "C139", "C142", "C143", "C144", "C145", "C148", "C149", "C151", "C221", "C223"],
  },

  {
    code: "FAB-36",
    label: "Qualità, benessere e sostenibilità delle produzioni zootecniche",
    tema_code: "TC02",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Sviluppo rurale — filiera zootecnica",
    missions: [
      { code: "M14", label: "Sviluppo economico e competitività" },
      { code: "M16", label: "Agricoltura, politiche agroalimentari e pesca" },
    ],
    rso: [
      { code: "RSO3.2", label: "Mobilità regionale e locale" },
    ],
    funds: [
      { code: "FEASR", label: "Fondo Europeo Agricolo per lo Sviluppo Rurale" },
    ],
    funding_gap: false,
    q1_label: "Standard di benessere animale e qualità produzioni zootecniche",
    q2_label: "Vita utile residua degli impianti zootecnici",
    q3_label: "Costo annuo gestione allevamenti e controlli qualità",
    cluster_mca: "C12",
    description: "Allevamenti con standard di benessere animale insufficienti rispetto alle normative europee. Finanzia adeguamento strutturale delle stalle e degli impianti zootecnici per il benessere animale.",
    category_codes: ["C134", "C152"],
  },

  {
    code: "FAB-37",
    label: "Diversificazione economica e multifunzionalità delle imprese agricole",
    tema_code: "TC02",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Sviluppo rurale — diversificazione",
    missions: [
      { code: "M14", label: "Sviluppo economico e competitività" },
      { code: "M16", label: "Agricoltura, politiche agroalimentari e pesca" },
    ],
    rso: [
      { code: "RSO3.2", label: "Mobilità regionale e locale" },
    ],
    funds: [
      { code: "FEASR", label: "Fondo Europeo Agricolo per lo Sviluppo Rurale" },
    ],
    funding_gap: false,
    q1_label: "Quota di reddito agricolo da attività non tradizionali (%)",
    q2_label: null,
    q3_label: "Costo annuo gestione attività diversificate",
    cluster_mca: "C12",
    description: "Aziende agricole monoproduttive con scarsa diversificazione e vulnerabilità economica. Finanzia impianti per la diversificazione delle attività aziendali, investimenti agro-climatico-ambientali e nuove filiere.",
    category_codes: ["C132", "C141"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC06 — AMBIENTE E TERRITORIO (12 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-38",
    label: "Presidio e gestione sostenibile del territorio agro-forestale",
    tema_code: "TC06",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Paesaggio rurale e gestione agro-ambientale",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
      { code: "M16", label: "Agricoltura, politiche agroalimentari e pesca" },
    ],
    rso: [
      { code: "RSO2.9", label: "Riduzione inquinamento" },
      { code: "RSO3.2", label: "Mobilità regionale e locale" },
    ],
    funds: [
      { code: "FEASR", label: "Fondo Europeo Agricolo per lo Sviluppo Rurale" },
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
    ],
    funding_gap: false,
    q1_label: "Quota di SAU con gestione agro-ambientale (%)",
    q2_label: null,
    q3_label: "Costo annuo gestione accordi agro-ambientali",
    cluster_mca: "C12",
    description: "Territorio agro-forestale vulnerabile al dissesto, agli incendi e ai cambiamenti climatici per assenza di presidio. Finanzia investimenti per la resilienza forestale, compensazioni agro-climatico-ambientali e gestione sostenibile del territorio.",
    category_codes: ["C135", "C146", "C147", "C150", "C162", "C220", "C222"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC02 — ECONOMIA E LAVORO (11 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-39",
    label: "Infrastrutture e filiera della pesca professionale e acquacoltura",
    tema_code: "TC02",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Sviluppo della pesca e dell'acquacoltura",
    missions: [
      { code: "M14", label: "Sviluppo economico e competitività" },
      { code: "M16", label: "Agricoltura, politiche agroalimentari e pesca" },
    ],
    rso: [
      { code: "RSO3.1", label: "Rete TEN-T" },
    ],
    funds: [
      { code: "FEAMPA", label: "Fondo Europeo Affari Marittimi, Pesca e Acquacoltura" },
      { code: "FEASR", label: "Fondo Europeo Agricolo per lo Sviluppo Rurale" },
    ],
    funding_gap: false,
    q1_label: "Valore sbarcato e produzione acquacoltura (€/anno)",
    q2_label: "Vita utile residua delle infrastrutture ittiche",
    q3_label: "Costo annuo gestione porti pesca e impianti",
    cluster_mca: "C12",
    description: "Settore della pesca e dell'acquacoltura con infrastrutture produttive inadeguate. Finanzia impianti di acquacoltura, strutture per la trasformazione e commercializzazione del pescato e attrezzature per la pesca professionale.",
    category_codes: ["C052", "C120", "C121", "C122", "C123", "C224"],
  },

  {
    code: "FAB-40",
    label: "Vitalità commerciale, servizi di prossimità e accesso al cibo",
    tema_code: "TC02",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Commercio locale e servizi di prossimità",
    missions: [
      { code: "M14", label: "Sviluppo economico e competitività" },
    ],
    rso: [
      { code: "RSO1.3", label: "Competitività PMI" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "MUN", label: "Risorse proprie del comune" },
    ],
    funding_gap: true,
    q1_label: "Dotazione di servizi commerciali di prossimità (esercizi per 1000 ab)",
    q2_label: "Vita utile residua delle strutture commerciali",
    q3_label: "Costo annuo gestione mercati e strutture commerciali",
    cluster_mca: "C12",
    description: "Tessuto commerciale locale in declino con desertificazione dei servizi di prossimità e accesso al cibo. Finanzia centri commerciali di prossimità, mercati, strutture per l'annona e servizi commerciali di vicinato.",
    category_codes: ["C170", "C172", "C174", "C244"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC11 — RICERCA E INNOVAZIONE (1 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-41",
    label: "Infrastrutture fisiche per la ricerca e l'innovazione applicata",
    tema_code: "TC11",
    visible_docfap: true,
    visible_dataroom: false,
    sose_function: "Ricerca, sviluppo e innovazione",
    missions: [
      { code: "M14", label: "Sviluppo economico e competitività" },
    ],
    rso: [
      { code: "RSO1.1", label: "Ricerca e innovazione" },
      { code: "RSO1.2", label: "Digitalizzazione" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
    ],
    funding_gap: false,
    q1_label: "Presenza e capacità delle infrastrutture di ricerca locali",
    q2_label: "Vita utile residua delle strutture di ricerca",
    q3_label: "Costo annuo gestione laboratori e centri ricerca",
    cluster_mca: "C12",
    description: "Assenza o insufficienza di infrastrutture fisiche per la ricerca, l'innovazione e il trasferimento tecnologico. Finanzia centri di ricerca, laboratori attrezzati, spazi per l'impresa sociale innovativa e progetti di cooperazione pubblico-privata per R&S.",
    category_codes: ["C124", "C125", "C126", "C175", "C177", "C178", "C179", "C180", "C181", "C182", "C183", "C184", "C185", "C186", "C187", "C230", "C231", "C232", "C233", "C234", "C235", "C236", "C237", "C238", "C239", "C240", "C241", "C242"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC04 — WELFARE E INCLUSIONE (6 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-42",
    label: "Ecosistema per l'impresa sociale e l'economia civile",
    tema_code: "TC04",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Terzo settore e imprenditorialità sociale",
    missions: [
      { code: "M12", label: "Diritti sociali, politiche sociali e famiglia" },
    ],
    rso: [
      { code: "RSO4.4", label: "Integrazione cittadini paesi terzi" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSE+", label: "Fondo Sociale Europeo Plus" },
    ],
    funding_gap: false,
    q1_label: "Presenza e capacità del terzo settore locale (organizzazioni per 1000 ab)",
    q2_label: "Vita utile residua degli spazi per impresa sociale",
    q3_label: "Costo annuo gestione spazi e programmi",
    cluster_mca: "C04",
    description: "Scarso sviluppo dell'economia civile e dell'impresa sociale nel territorio. Finanzia spazi e strutture per le attività di impresa sociale e per l'economia solidale.",
    category_codes: ["C127"],
  },

  {
    code: "FAB-43",
    label: "Disagio abitativo e carenza di edilizia residenziale pubblica",
    tema_code: "TC04",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Edilizia residenziale pubblica",
    missions: [
      { code: "M08", label: "Assetto del territorio ed edilizia abitativa" },
      { code: "M12", label: "Diritti sociali, politiche sociali e famiglia" },
    ],
    rso: [
      { code: "RSO5.1", label: "Sviluppo urbano integrato" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: false,
    q1_label: "Lista d'attesa ERP / famiglie in disagio abitativo (n)",
    q2_label: "Vita utile residua del patrimonio ERP esistente",
    q3_label: "Costo annuo gestione patrimonio ERP",
    cluster_mca: "C05",
    description: "Famiglie in situazione di disagio abitativo o carenza di edilizia residenziale pubblica adeguata. Finanzia edilizia residenziale pubblica (ERP), recupero di fabbricati residenziali, housing sociale e alloggi di emergenza.",
    category_codes: ["C076", "C077", "C078", "C079", "C080", "C090"],
  },

  {
    code: "FAB-44",
    label: "Inclusione sociale e servizi per persone in situazione di vulnerabilità",
    tema_code: "TC04",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Inclusione sociale e contrasto alla povertà",
    missions: [
      { code: "M12", label: "Diritti sociali, politiche sociali e famiglia" },
    ],
    rso: [
      { code: "RSO4.4", label: "Integrazione cittadini paesi terzi" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSE+", label: "Fondo Sociale Europeo Plus" },
    ],
    funding_gap: false,
    q1_label: "Tasso di povertà relativa e assoluta nel territorio (%)",
    q2_label: "Vita utile residua delle strutture per l'inclusione",
    q3_label: "Costo annuo erogazione servizi e gestione strutture",
    cluster_mca: "C04",
    description: "Persone in situazione di vulnerabilità (disabilità, povertà, fragilità) prive di servizi sociali adeguati. Finanzia strutture sociali, centri diurni, servizi di assistenza alla persona, strutture per la disabilità e l'inclusione.",
    category_codes: ["C081", "C093", "C107", "C127", "C189", "C210", "C248", "C249"],
  },

  {
    code: "FAB-45",
    label: "Aggregazione sociale, coesione e servizi di prossimità per la comunità",
    tema_code: "TC04",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Coesione sociale e welfare di comunità",
    missions: [
      { code: "M12", label: "Diritti sociali, politiche sociali e famiglia" },
    ],
    rso: [
      { code: "RSO4.4", label: "Integrazione cittadini paesi terzi" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "MUN", label: "Risorse proprie del comune" },
    ],
    funding_gap: false,
    q1_label: "Dotazione di spazi di aggregazione (strutture per 1000 ab)",
    q2_label: "Vita utile residua delle strutture di aggregazione",
    q3_label: "Costo annuo gestione centri di comunità",
    cluster_mca: "C04",
    description: "Deficit di spazi e servizi per l'aggregazione sociale, la coesione comunitaria e i servizi di prossimità. Finanzia centri culturali e sociali, impianti sportivi di prossimità, centri civici e servizi alla comunità.",
    category_codes: ["C107", "C111", "C188", "C248"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC05 — SALUTE E SANITÀ (3 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-46",
    label: "Assistenza alla non autosufficienza e cura degli anziani",
    tema_code: "TC05",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Servizi sociosanitari per anziani non autosufficienti",
    missions: [
      { code: "M12", label: "Diritti sociali, politiche sociali e famiglia" },
      { code: "M13", label: "Tutela della salute" },
    ],
    rso: [
      { code: "RSO4.4", label: "Integrazione cittadini paesi terzi" },
      { code: "RSO4.5", label: "Sanità e assistenza" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSE+", label: "Fondo Sociale Europeo Plus" },
      { code: "FNNA", label: "Fondo Nazionale per la Non Autosufficienza" },
    ],
    funding_gap: false,
    q1_label: "Indice di non autosufficienza e lista attesa RSA",
    q2_label: "Vita utile residua delle strutture residenziali",
    q3_label: "Costo annuo gestione RSA e SAD (costo per assistito)",
    cluster_mca: "C04",
    description: "Crescente domanda di assistenza per anziani non autosufficienti non soddisfatta dall'offerta pubblica. Finanzia residenze sanitarie assistenziali, strutture di assistenza domiciliare e servizi integrati per la non autosufficienza.",
    category_codes: ["C104", "C189", "C249"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC04 — WELFARE E INCLUSIONE (6 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-47",
    label: "Autonomia e vita indipendente per persone con disabilità",
    tema_code: "TC04",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Inclusione e autonomia delle persone con disabilità",
    missions: [
      { code: "M12", label: "Diritti sociali, politiche sociali e famiglia" },
    ],
    rso: [
      { code: "RSO4.4", label: "Integrazione cittadini paesi terzi" },
    ],
    funds: [
      { code: "FSE+", label: "Fondo Sociale Europeo Plus" },
      { code: "MUN", label: "Risorse proprie del comune" },
    ],
    funding_gap: false,
    q1_label: "Percentuale di persone con disabilità con piano di vita indipendente",
    q2_label: null,
    q3_label: "Costo annuo programmi di vita indipendente e ausili",
    cluster_mca: "NONE",
    description: "Persone con disabilità che non dispongono di supporti adeguati per la vita indipendente. Nessuna categoria MOP diretta — intervento realizzato prevalentemente attraverso servizi mediati e contributi diretti alle persone.",
    category_codes: ["CM05", "CM08"],
  },

  {
    code: "FAB-48",
    label: "Protezione, tutela e supporto ai minori e alle famiglie",
    tema_code: "TC04",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Tutela dei minori e politiche familiari",
    missions: [
      { code: "M12", label: "Diritti sociali, politiche sociali e famiglia" },
    ],
    rso: [
      { code: "RSO4.4", label: "Integrazione cittadini paesi terzi" },
    ],
    funds: [
      { code: "FSE+", label: "Fondo Sociale Europeo Plus" },
    ],
    funding_gap: false,
    q1_label: "Numero di minori in carico ai servizi sociali e in condizione di rischio",
    q2_label: null,
    q3_label: "Costo annuo erogazione servizi tutela minori e supporto famiglie",
    cluster_mca: "NONE",
    description: "Minori e famiglie in condizione di fragilità che necessitano di protezione e supporto istituzionale. Finanzia servizi di assistenza sociale alla persona e strutture per l'accoglienza e il supporto ai minori.",
    category_codes: ["C189"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC05 — SALUTE E SANITÀ (3 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-49",
    label: "Accessibilità ai servizi sanitari di prossimità",
    tema_code: "TC05",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Medicina territoriale e presidi sanitari locali",
    missions: [
      { code: "M13", label: "Tutela della salute" },
    ],
    rso: [
      { code: "RSO4.5", label: "Sanità e assistenza" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Distanza media dal presidio sanitario più vicino (minuti)",
    q2_label: "Vita utile residua delle strutture sanitarie",
    q3_label: "Costo annuo gestione presidi e attrezzature",
    cluster_mca: "C04",
    description: "Scarsa accessibilità ai servizi sanitari di base, con presidio territoriale insufficiente. Finanzia strutture ospedaliere, presidi sanitari territoriali, poliambulatori e strutture per l'igiene e la profilassi.",
    category_codes: ["C101", "C102", "C103", "C105"],
  },

  {
    code: "FAB-50",
    label: "Prevenzione collettiva, igiene e salute pubblica",
    tema_code: "TC05",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Prevenzione e sanità pubblica",
    missions: [
      { code: "M13", label: "Tutela della salute" },
    ],
    rso: [
      { code: "RSO4.5", label: "Sanità e assistenza" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSE+", label: "Fondo Sociale Europeo Plus" },
    ],
    funding_gap: false,
    q1_label: "Tasso di copertura vaccinale e adesione programmi screening",
    q2_label: "Vita utile residua delle strutture di prevenzione",
    q3_label: "Costo annuo programmi di prevenzione e screening",
    cluster_mca: "C04",
    description: "Prevenzione collettiva e igiene pubblica inadeguate rispetto ai rischi sanitari del territorio. Finanzia strutture per l'igiene pubblica, la profilassi e la tutela della salute collettiva.",
    category_codes: ["C102"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC03 — ISTRUZIONE E FORMAZIONE (6 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-51",
    label: "Offerta insufficiente di posti nido per la prima infanzia (0-3 anni)",
    tema_code: "TC03",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Servizi educativi prima infanzia",
    missions: [
      { code: "M04", label: "Istruzione e diritto allo studio" },
    ],
    rso: [
      { code: "RSO4.3", label: "Inclusione comunità marginalizzate" },
    ],
    funds: [
      { code: "FSE+", label: "Fondo Sociale Europeo Plus" },
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
      { code: "FNNA", label: "Fondo Nazionale per la Non Autosufficienza" },
    ],
    funding_gap: false,
    q1_label: "Tasso di copertura posti nido (% bambini 0-3 su posti disponibili)",
    q2_label: "Vita utile residua della struttura nido",
    q3_label: "Costo annuo gestione per posto nido (costo/bambino/anno)",
    cluster_mca: "C03",
    description: "Offerta di posti nido pubblica insufficiente rispetto alla domanda delle famiglie con bambini 0-3 anni. Finanzia nuovi asili nido, ristrutturazione di strutture esistenti e servizi per l'infanzia complementari.",
    category_codes: ["C106", "C119", "CM01", "CM02"],
  },

  {
    code: "FAB-52",
    label: "Offerta insufficiente di posti scuola dell'infanzia (3-6 anni)",
    tema_code: "TC03",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Servizi educativi scuola dell'infanzia",
    missions: [
      { code: "M04", label: "Istruzione e diritto allo studio" },
    ],
    rso: [
      { code: "RSO4.3", label: "Inclusione comunità marginalizzate" },
    ],
    funds: [
      { code: "FSE+", label: "Fondo Sociale Europeo Plus" },
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
    ],
    funding_gap: false,
    q1_label: "Tasso di copertura scuola infanzia (% bambini 3-6 su posti)",
    q2_label: "Vita utile residua dell'edificio scolastico",
    q3_label: "Costo annuo gestione per posto scuola infanzia",
    cluster_mca: "C03",
    description: "Carenza di posti nella scuola dell'infanzia (3-6 anni) che non copre il fabbisogno territoriale. Finanzia scuole materne, ampliamenti e servizi integrativi per la prima infanzia.",
    category_codes: ["C109", "C119"],
  },

  {
    code: "FAB-53",
    label: "Capacità insufficiente dell'offerta scolastica: mancano posti (6-18 anni)",
    tema_code: "TC03",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Edilizia scolastica — capienza",
    missions: [
      { code: "M04", label: "Istruzione e diritto allo studio" },
    ],
    rso: [
      { code: "RSO4.3", label: "Inclusione comunità marginalizzate" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Tasso di sovraffollamento scolastico (alunni/aula vs standard)",
    q2_label: null,
    q3_label: "Costo annuo gestione nuovi spazi scolastici",
    cluster_mca: "C03",
    description: "Capacità scolastica (6-18 anni) insufficiente rispetto alla popolazione scolastica del territorio. Finanzia nuovi edifici scolastici per la scuola primaria e secondaria, con priorità alle aree in crescita demografica.",
    category_codes: ["C108"],
  },

  {
    code: "FAB-54",
    label: "Qualità, sicurezza e conformità degli edifici scolastici esistenti",
    tema_code: "TC03",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Edilizia scolastica — qualità e messa a norma",
    missions: [
      { code: "M04", label: "Istruzione e diritto allo studio" },
    ],
    rso: [
      { code: "RSO4.3", label: "Inclusione comunità marginalizzate" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Percentuale di edifici scolastici non conformi agli standard (%)",
    q2_label: "Vita utile residua dell'edificio scolastico esistente",
    q3_label: "Costo annuo manutenzione ordinaria e straordinaria scuole",
    cluster_mca: "C03",
    description: "Edifici scolastici esistenti non conformi agli standard di sicurezza, accessibilità o qualità ambientale. Finanzia messa in sicurezza, adeguamento sismico, riqualificazione energetica e adeguamento normativo degli edifici scolastici.",
    category_codes: ["C108", "C109", "C209"],
  },

  {
    code: "FAB-55",
    label: "Offerta formativa universitaria e terziaria",
    tema_code: "TC03",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Formazione universitaria e alta formazione",
    missions: [
      { code: "M04", label: "Istruzione e diritto allo studio" },
      { code: "M15", label: "Politiche per il lavoro e la formazione professionale" },
    ],
    rso: [
      { code: "RSO4.3", label: "Inclusione comunità marginalizzate" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSC", label: "Fondo Sviluppo e Coesione" },
    ],
    funding_gap: true,
    q1_label: "Tasso di accesso all'istruzione terziaria nella fascia 18-24 anni",
    q2_label: "Vita utile residua delle strutture universitarie",
    q3_label: "Costo annuo gestione strutture accademiche",
    cluster_mca: "C03",
    description: "Offerta universitaria e di formazione terziaria assente o insufficiente nel territorio. Finanzia università, istituti di istruzione superiore e progetti di mobilità internazionale per studenti.",
    category_codes: ["C110", "C255"],
  },

  {
    code: "FAB-56",
    label: "Formazione professionale e aggiornamento delle competenze",
    tema_code: "TC03",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Formazione per il lavoro e long-life learning",
    missions: [
      { code: "M04", label: "Istruzione e diritto allo studio" },
      { code: "M15", label: "Politiche per il lavoro e la formazione professionale" },
    ],
    rso: [
      { code: "RSO4.1", label: "Mercato del lavoro e infrastrutture sociali" },
      { code: "RSO4.3", label: "Inclusione comunità marginalizzate" },
    ],
    funds: [
      { code: "FSE+", label: "Fondo Sociale Europeo Plus" },
    ],
    funding_gap: false,
    q1_label: "Tasso di partecipazione ad attività formative (adulti 25-64 %)",
    q2_label: "Vita utile residua delle strutture formative",
    q3_label: "Costo annuo erogazione corsi e voucher formativi",
    cluster_mca: "C03",
    description: "Competenze professionali della popolazione attiva non allineate alle esigenze del mercato del lavoro. Finanzia formazione professionale, aggiornamento delle competenze, IFTS, apprendistato, orientamento e percorsi integrati scuola-lavoro.",
    category_codes: ["C116", "C118", "C250", "C251", "C252", "C253", "C254", "C256", "C257", "C258", "C259", "C260", "C261", "C262", "C263", "C264", "C265", "C266", "C267", "C268", "C269", "C270", "C271", "C272"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC02 — ECONOMIA E LAVORO (11 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-57",
    label: "Sostegno all'occupazione e al reinserimento lavorativo",
    tema_code: "TC02",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Politiche attive del lavoro",
    missions: [
      { code: "M15", label: "Politiche per il lavoro e la formazione professionale" },
    ],
    rso: [
      { code: "RSO4.1", label: "Mercato del lavoro e infrastrutture sociali" },
    ],
    funds: [
      { code: "FSE+", label: "Fondo Sociale Europeo Plus" },
    ],
    funding_gap: false,
    q1_label: "Tasso di disoccupazione locale (%, focus NEET 15-29)",
    q2_label: null,
    q3_label: "Costo annuo programmi di attivazione e incentivi al lavoro",
    cluster_mca: "NONE",
    description: "Disoccupazione, inattività e difficoltà di reinserimento lavorativo che riducono la partecipazione al mercato del lavoro. Finanzia incentivi all'occupazione, borse lavoro, percorsi formativi per il reinserimento, contributi per il lavoro autonomo e sostegni all'uscita dal mercato.",
    category_codes: ["C115", "C116", "C117", "C118", "C256", "C257", "C258", "C259", "C260", "C261", "C262", "C263", "C264", "C265", "C266", "C267", "C268", "C269", "C270", "C271", "C272", "C273", "C274", "C275", "C276", "C277", "C278", "C279", "C280", "C281", "C282", "C283", "C284", "C285"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC10 — SPORT E TEMPO LIBERO (1 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-58",
    label: "Sport, attività fisica e promozione della salute attraverso il movimento",
    tema_code: "TC10",
    visible_docfap: true,
    visible_dataroom: false,
    sose_function: "Impianti sportivi e promozione dello sport",
    missions: [
      { code: "M06", label: "Politiche giovanili, sport e tempo libero" },
    ],
    rso: [],
    funds: [
      { code: "MUN", label: "Risorse proprie del comune" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: true,
    q1_label: "Dotazione di impianti sportivi (mq per 1000 ab)",
    q2_label: "Vita utile residua degli impianti sportivi",
    q3_label: "Costo annuo gestione impianti e programmi sportivi",
    cluster_mca: "C06",
    description: "Scarsa disponibilità di impianti e spazi per la pratica sportiva e l'attività fisica nel territorio. Finanzia impianti sportivi, palestre, piscine, campi sportivi e strutture per lo spettacolo e il tempo libero.",
    category_codes: ["C111", "C112", "CM07"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC08 — PATRIMONIO PUBBLICO (3 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-59",
    label: "Qualità degli spazi pubblici urbani, arredo e servizi civici",
    tema_code: "TC08",
    visible_docfap: true,
    visible_dataroom: false,
    sose_function: "Patrimonio civico e spazi pubblici",
    missions: [
      { code: "M09", label: "Sviluppo sostenibile e tutela del territorio e dell'ambiente" },
    ],
    rso: [
      { code: "RSO5.1", label: "Sviluppo urbano integrato" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "MUN", label: "Risorse proprie del comune" },
    ],
    funding_gap: false,
    q1_label: "Percentuale di spazio pubblico in buono stato di manutenzione",
    q2_label: "Vita utile residua delle infrastrutture civiche",
    q3_label: "Costo annuo manutenzione spazi pubblici, cimiteri e arredo",
    cluster_mca: "C09",
    description: "Spazi pubblici urbani degradati, con arredo insufficiente o assenza di servizi civici di base. Finanzia arredo urbano, verde pubblico, cimiteri, illuminazione pubblica e recupero di piazze e spazi collettivi.",
    category_codes: ["C082", "C083", "C084", "C086"],
  },

  {
    code: "FAB-60",
    label: "Sicurezza urbana, ordine pubblico e controllo del territorio",
    tema_code: "TC08",
    visible_docfap: true,
    visible_dataroom: false,
    sose_function: "Sicurezza pubblica e protezione civile",
    missions: [
      { code: "M03", label: "Ordine pubblico e sicurezza" },
      { code: "M11", label: "Soccorso civile" },
    ],
    rso: [],
    funds: [
      { code: "MUN", label: "Risorse proprie del comune" },
    ],
    funding_gap: true,
    q1_label: "Indice di criminalità e incidentalità urbana (eventi per 1000 ab)",
    q2_label: "Vita utile residua degli edifici di sicurezza",
    q3_label: "Costo annuo gestione strutture sicurezza e sistemi di controllo",
    cluster_mca: "C13",
    description: "Carenza di infrastrutture per la sicurezza urbana, il controllo del territorio e la protezione civile. Finanzia sistemi di videosorveglianza, commissariati, presidi delle forze dell'ordine, strutture per la protezione civile e dei vigili del fuoco.",
    category_codes: ["C074", "C094", "C098", "C099", "C100", "C215", "C217", "C218", "C219"],
  },

  // ════════════════════════════════════════════════════════════════
  // TC12 — PA E INNOVAZIONE (3 fabbisogni)
  // ════════════════════════════════════════════════════════════════

  {
    code: "FAB-61",
    label: "Connettività digitale del territorio (banda larga e ultra-larga)",
    tema_code: "TC12",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Infrastrutture digitali — connettività",
    missions: [
      { code: "M01", label: "Servizi istituzionali, generali e di gestione" },
    ],
    rso: [
      { code: "RSO1.1", label: "Ricerca e innovazione" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Copertura NGA e VHCN nel territorio (% unità immobiliari)",
    q2_label: "Vita utile residua delle infrastrutture di rete",
    q3_label: "Costo annuo manutenzione infrastruttura passiva",
    cluster_mca: "C11",
    description: "Territorio con copertura di banda larga e ultra-larga insufficiente per cittadini e imprese. Finanzia cavidotti, posa cavi, impianti radioelettrici, reti wireless e infrastrutture di telecomunicazione per la connettività.",
    category_codes: ["C070", "C071", "C072", "C073", "C225", "C226", "C227"],
  },

  {
    code: "FAB-62",
    label: "Digitalizzazione dei servizi pubblici e smart city",
    tema_code: "TC12",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Transizione digitale della PA",
    missions: [
      { code: "M01", label: "Servizi istituzionali, generali e di gestione" },
    ],
    rso: [
      { code: "RSO1.1", label: "Ricerca e innovazione" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "PNRR", label: "Piano Nazionale di Ripresa e Resilienza (chiuso 30/06/2026)" },
    ],
    funding_gap: false,
    q1_label: "Livello di digitalizzazione dei servizi al cittadino (% servizi online)",
    q2_label: "Vita utile residua delle infrastrutture ICT della PA",
    q3_label: "Costo annuo gestione sistemi informativi e licenze",
    cluster_mca: "C11",
    description: "Servizi pubblici digitali assenti o non integrati, con scarsa interoperabilità tra sistemi della PA. Finanzia piattaforme ICT, hardware e software per centri di servizio, applicazioni per il pubblico e sistemi di controllo smart city.",
    category_codes: ["C072", "C074", "C075", "C154", "C228", "C229", "C245"],
  },

  {
    code: "FAB-63",
    label: "Capacità organizzativa, modernizzazione e rafforzamento della PA locale",
    tema_code: "TC12",
    visible_docfap: true,
    visible_dataroom: true,
    sose_function: "Capacità amministrativa e good governance",
    missions: [
      { code: "M01", label: "Servizi istituzionali, generali e di gestione" },
    ],
    rso: [
      { code: "RSO1.1", label: "Ricerca e innovazione" },
    ],
    funds: [
      { code: "FESR", label: "Fondo Europeo di Sviluppo Regionale" },
      { code: "FSE+", label: "Fondo Sociale Europeo Plus" },
    ],
    funding_gap: false,
    q1_label: "Indice di capacità amministrativa (indicatori ISTAT PA locali)",
    q2_label: "Vita utile residua delle sedi istituzionali",
    q3_label: "Costo annuo gestione sedi, formazione personale e assistenza tecnica",
    cluster_mca: "C13",
    description: "Capacità organizzativa e tecnica della PA locale insufficiente per gestire investimenti e servizi complessi. Finanzia sedi della PA, uffici direzionali, riqualificazione energetica degli edifici pubblici, digitalizzazione interna e assistenza tecnica alla preparazione e sorveglianza dei programmi.",
    category_codes: ["C075", "C095", "C096", "C097", "C188", "C190", "C216", "C246", "C247"],
  },

];

// ── Derived views ──────────────────────────────────────────────────────────

/** All fabbisogni shown in the DOCFAP wizard (always all 63) */
export const NEEDS_DOCFAP = NEEDS.filter(f => f.visible_docfap);

/** Needs whose tema has DataRoom indicators at launch */
export const NEEDS_DATAROOM = NEEDS.filter(f => f.visible_dataroom);

/** Needs with limited AP 2021-2027 RSO coverage */
export const NEEDS_FUNDING_GAP = NEEDS.filter(f => f.funding_gap);

// ── Lookup helpers ──────────────────────────────────────────────────────────

export const getNeedByCode = (code: string): Need | undefined =>
  NEEDS.find(f => f.code === code);

export const getNeedsByTheme = (tema_code: string): Need[] =>
  NEEDS.filter(f => f.tema_code === tema_code);

export const getNeedsByMission = (mission_code: string): Need[] =>
  NEEDS.filter(f => f.missions.some(m => m.code === mission_code));

export const getNeedsByCategoryCode = (cat_code: string): Need[] =>
  NEEDS.filter(f => f.category_codes.includes(cat_code));

export const getNeedsByCluster = (cluster_id: string): Need[] =>
  NEEDS.filter(f => f.cluster_mca === cluster_id);