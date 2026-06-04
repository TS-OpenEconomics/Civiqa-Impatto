/**
 * mockMOPTaxonomy.ts
 *
 * Struttura gerarchica del MOP (Monitoraggio Opere Pubbliche) Italia.
 * Gerarchia: Settore → Sotto-settore → Categoria → Tipo intervento
 *
 * Fonte: MOP Italia — Lista semplice (Marzo 2026)
 *
 * NOTE:
 * - Il 4° livello (Tipo intervento) è trasversale: 5 tipi fissi applicabili
 *   a tutte le categorie, con profili di pertinenza per sotto-settore.
 * - Gli ID sono slug per leggibilità. In produzione verranno sostituiti
 *   da ID del backend/OpenCore.
 */

// ── Intervention Types (4° livello) ──────────────────

export type InterventionTypeId =
  | "nuova-costruzione"
  | "ristrutturazione"
  | "restauro"
  | "recupero"
  | "efficientamento";

export interface InterventionType {
  id: InterventionTypeId;
  label: string;
  description: string;
}

export const interventionTypes: InterventionType[] = [
  {
    id: "nuova-costruzione",
    label: "Nuova Costruzione",
    description: "Realizzazione ex novo di un'opera, un impianto o una struttura.",
  },
  {
    id: "ristrutturazione",
    label: "Ristrutturazione",
    description: "Intervento strutturale su un'opera esistente per adeguarla a nuovi requisiti funzionali o normativi.",
  },
  {
    id: "restauro",
    label: "Restauro",
    description: "Intervento conservativo volto a preservare e ripristinare il valore storico, artistico o architettonico.",
  },
  {
    id: "recupero",
    label: "Recupero",
    description: "Intervento di riqualificazione e riuso di strutture degradate, dismesse o sottoutilizzate.",
  },
  {
    id: "efficientamento",
    label: "Efficientamento",
    description: "Intervento migliorativo su prestazioni energetiche, funzionali o operative di strutture esistenti.",
  },
];

/**
 * Profili di pertinenza per tipo d'intervento.
 *
 * Tutti e 5 i tipi sono SEMPRE selezionabili dall'utente.
 * I tipi "suggested" vengono evidenziati come più pertinenti.
 * I tipi non suggeriti appaiono comunque, ma in secondo piano.
 */
export type InterventionProfile =
  | "beni-culturali"
  | "edifici-pubblici"
  | "infrastrutture"
  | "verde-ambiente"
  | "default";

export const interventionProfiles: Record<InterventionProfile, InterventionTypeId[]> = {
  "beni-culturali": ["restauro", "recupero"],
  "edifici-pubblici": ["nuova-costruzione", "ristrutturazione", "recupero", "efficientamento"],
  "infrastrutture": ["nuova-costruzione", "ristrutturazione", "efficientamento"],
  "verde-ambiente": ["nuova-costruzione", "recupero", "efficientamento"],
  "default": ["nuova-costruzione", "ristrutturazione", "restauro", "recupero", "efficientamento"],
};

// ── Core Types ───────────────────────────────────────

export interface MOPCategory {
  id: string;
  label: string;
}

export interface MOPSubSector {
  id: string;
  label: string;
  interventionProfile: InterventionProfile;
  categories: MOPCategory[];
}

export interface MOPSector {
  id: string;
  label: string;
  subSectors: MOPSubSector[];
}

// ── Data ─────────────────────────────────────────────

export const mopData: MOPSector[] = [
  // ━━━ 1. INFRASTRUTTURE AMBIENTALI E RISORSE IDRICHE ━━━
  {
    id: "infrastrutture-ambientali",
    label: "Infrastrutture ambientali e risorse idriche",
    subSectors: [
      {
        id: "difesa-suolo",
        label: "Difesa del suolo",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "abitati", label: "Abitati" },
          { id: "altre-infrastrutture-difesa-suolo", label: "Altre infrastrutture/strutture di difesa del suolo" },
          { id: "bonifica-siti", label: "Bonifica di siti" },
          { id: "corsi-acqua", label: "Corsi d'acqua" },
          { id: "foreste", label: "Foreste" },
          { id: "regimazione-acque", label: "Regimazione acque" },
          { id: "spiagge", label: "Spiagge" },
          { id: "strutture-rischio-sismico", label: "Strutture/infrastrutture a rischio sismico" },
        ],
      },
      {
        id: "protezione-valorizzazione-ambiente",
        label: "Protezione, valorizzazione e fruizione dell'ambiente",
        interventionProfile: "verde-ambiente",
        categories: [
          { id: "altre-strutture-protezione-ambiente", label: "Altre strutture/infrastrutture per la protezione, valorizzazione e fruizione ambientale" },
          { id: "infrastrutture-verdi", label: "Infrastrutture verdi" },
          { id: "parchi-riserve-aree-protette", label: "Parchi e riserve aree protette" },
          { id: "sistemi-monitoraggio-ambientale", label: "Sistemi di monitoraggio ambientale e telecontrollo dell'inquinamento" },
          { id: "siti-naturali-rurali", label: "Siti naturali e rurali" },
          { id: "strutture-fruizione-patrimonio", label: "Strutture per la fruizione del patrimonio ambientale" },
          { id: "strutture-qualita-aria", label: "Strutture per la qualità dell'aria" },
          { id: "strutture-protezione-rumore", label: "Strutture per protezione dal rumore" },
        ],
      },
      {
        id: "riassetto-recupero-siti",
        label: "Riassetto e recupero di siti urbani e produttivi",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altre-siti-produttivi", label: "Altre siti produttivi" },
          { id: "aree-dismesse", label: "Aree dismesse" },
          { id: "impianti-trattamento-rifiuti-speciali", label: "Impianti per il trattamento di rifiuti speciali" },
          { id: "siti-contaminati-degradati", label: "Siti contaminati e/o degradati" },
        ],
      },
      {
        id: "risorse-idriche-acque-reflue",
        label: "Risorse idriche e acque reflue",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altre-strutture-risorse-idriche", label: "Altre strutture/infrastrutture per l'utilizzo delle risorse idriche" },
          { id: "bacini-irrigui-traverse", label: "Bacini irrigui, traverse e strutture minori di accumulo" },
          { id: "corpi-idrici-qualita", label: "Corpi idrici: miglioramento della qualità" },
          { id: "dighe", label: "Dighe" },
          { id: "dissalatori-potabilizzazione", label: "Dissalatori e strutture/infrastrutture per la potabilizzazione" },
          { id: "impianti-depurazione-acque", label: "Impianti depurazione acque" },
          { id: "impianti-pretrattamento-riutilizzo", label: "Impianti di pre-trattamento, stoccaggio, sollevamento e riutilizzo acque reflue" },
          { id: "impianti-reti-irrigue-interaziendali", label: "Impianti e reti irrigue interaziendali" },
          { id: "reti-fognarie", label: "Reti fognarie" },
          { id: "reti-idriche-industriali", label: "Reti idriche industriali" },
          { id: "reti-idriche-rurali", label: "Reti idriche rurali" },
          { id: "reti-idriche-urbane", label: "Reti idriche urbane" },
          { id: "reti-collettamento-acque-pluviali", label: "Reti per il collettamento delle acque pluviali" },
          { id: "serbatoi-impianti-sollevamento", label: "Serbatoi ed impianti di sollevamento" },
          { id: "captazione-adduzione-uso-agricolo", label: "Strutture/infrastrutture per la captazione e adduzione dell'acqua per esclusivo uso agricolo" },
          { id: "captazione-adduzione-usi-non-agricoli", label: "Strutture/infrastrutture per la captazione e adduzione dell'acqua per usi non agricoli o ad uso plurimo" },
        ],
      },
      {
        id: "smaltimento-rifiuti",
        label: "Smaltimento rifiuti",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altre-strutture-smaltimento-rifiuti", label: "Altre strutture/infrastrutture di smaltimento rifiuti" },
          { id: "impianti-depurazione-acque-smaltimento", label: "Impianti depurazione acque" },
          { id: "impianti-stoccaggio-sollevamento-reflue", label: "Impianti di stoccaggio e sollevamento acque reflue" },
          { id: "impianti-trattamento-rifiuti-speciali-smalt", label: "Impianti di trattamento rifiuti speciali" },
          { id: "impianti-trattamento-rifiuti-urbani", label: "Impianti di trattamento rifiuti urbani" },
          { id: "impianti-gestione-raccolta-differenziata", label: "Impianti per la gestione della raccolta differenziata" },
          { id: "reti-fognarie-smaltimento", label: "Reti fognarie" },
          { id: "sistemi-raccolta-differenziata-urbani", label: "Sistemi di raccolta differenziata dei rifiuti urbani" },
        ],
      },
    ],
  },

  // ━━━ 2. INFRASTRUTTURE DEL SETTORE ENERGETICO ━━━
  {
    id: "infrastrutture-energetico",
    label: "Infrastrutture del settore energetico",
    subSectors: [
      {
        id: "distribuzione-energia",
        label: "Distribuzione di energia",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altri-impianti-distribuzione-energia", label: "Altri impianti di distribuzione energia" },
          { id: "elettrificazioni-rurali", label: "Elettrificazioni rurali" },
          { id: "impianti-trasmissione-energia-elettrica", label: "Impianti di trasmissione di energia elettrica" },
          { id: "impianti-distribuzione-energia-elettrica-termica", label: "Impianti di distribuzione di energia elettrica e termica, civile e industriale" },
          { id: "impianti-efficienza-reti-risparmio", label: "Impianti per l'efficienza delle reti e risparmio energetico" },
          { id: "metanodotti-gasdotti", label: "Metanodotti gasdotti e simili" },
          { id: "reti-distribuzione-gas", label: "Reti distribuzione gas" },
        ],
      },
      {
        id: "produzione-energia",
        label: "Produzione di energia",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altri-impianti-produzione-estrazione", label: "Altri impianti per la produzione e l'estrazione di energia" },
          { id: "altri-impianti-fonti-rinnovabili", label: "Altri impianti produzione energie da fonti rinnovabili" },
          { id: "impianti-cogenerazione", label: "Impianti di cogenerazione" },
          { id: "impianti-produzione-gas", label: "Impianti produzione gas" },
          { id: "impianti-produzione-idroelettrica", label: "Impianti produzione idroelettrica" },
          { id: "impianti-produzione-termoelettrica", label: "Impianti produzione termoelettrica" },
        ],
      },
    ],
  },

  // ━━━ 3. INFRASTRUTTURE DI TRASPORTO ━━━
  {
    id: "infrastrutture-trasporto",
    label: "Infrastrutture di trasporto",
    subSectors: [
      {
        id: "aeroportuali",
        label: "Aeroportuali",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "aerostazioni", label: "Aerostazioni" },
          { id: "altre-strutture-aeroportuali", label: "Altre strutture/infrastrutture aeroportuali" },
          { id: "piste", label: "Piste" },
        ],
      },
      {
        id: "ferrovie",
        label: "Ferrovie",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altre-strutture-ferroviarie", label: "Altre strutture/infrastrutture ferroviarie" },
          { id: "linee-ferroviarie", label: "Linee ferroviarie" },
          { id: "stazioni-terminali", label: "Stazione e terminali" },
        ],
      },
      {
        id: "marittime-lacuali-fluviali",
        label: "Marittime lacuali e fluviali",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altre-strutture-marittime-fluviali", label: "Altre strutture/infrastrutture marittime e fluviali" },
          { id: "idrovie-strutture-fluviali", label: "Idrovie e strutture/infrastrutture fluviali" },
          { id: "porti-commerciali", label: "Porti commerciali" },
          { id: "porti-pesca", label: "Porti per la pesca" },
          { id: "porti-turistici", label: "Porti turistici" },
        ],
      },
      {
        id: "stradali",
        label: "Stradali",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altre-strutture-stradali", label: "Altre strutture/infrastrutture stradali" },
          { id: "autostrade", label: "Autostrade" },
          { id: "piste-ciclabili", label: "Piste ciclabili" },
          { id: "strade-regionali-provinciali-comunali", label: "Strade regionali, provinciali e comunali" },
          { id: "strade-rurali", label: "Strade rurali" },
          { id: "strade-statali", label: "Strade statali" },
        ],
      },
      {
        id: "trasporti-multimodali",
        label: "Trasporti multimodali e altre modalità di trasporto",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altre-modalita-trasporto", label: "Altre modalità di trasporto" },
          { id: "funivie-seggiovie-funicolari", label: "Funivie, seggiovie, funicolari" },
          { id: "sistemi-trasporto-intelligenti", label: "Sistemi di trasporto intelligenti" },
          { id: "trasporti-multimodali-interporti", label: "Trasporti multimodali ed interporti" },
        ],
      },
      {
        id: "trasporto-urbano",
        label: "Trasporto urbano",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altre-strutture-trasporto-urbane", label: "Altre strutture/infrastrutture di trasporto urbane" },
          { id: "linee-metropolitane-tramviarie", label: "Linee metropolitane e tramviarie" },
          { id: "sistemi-parcheggio-interscambio", label: "Sistemi di parcheggio e interscambio" },
          { id: "sistemi-integrati-mobilita-sostenibile", label: "Sistemi integrati e di trasporto intelligenti per la mobilità sostenibile" },
        ],
      },
    ],
  },

  // ━━━ 4. INFRASTRUTTURE PER AREE PRODUTTIVE ━━━
  {
    id: "infrastrutture-aree-produttive",
    label: "Infrastrutture per l'attrezzatura di aree produttive",
    subSectors: [
      {
        id: "infrastrutture-attrezzatura-aree-produttive",
        label: "Infrastrutture per l'attrezzatura di aree produttive",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altre-infrastrutture-aree-produttive", label: "Altre infrastrutture per attrezzature di aree produttive" },
          { id: "infrastrutture-civili-aree-industriali", label: "Infrastrutture civili per aree industriali" },
          { id: "sistemazione-terreni-riconversione", label: "Sistemazione dei terreni e riconversione aree industriali" },
        ],
      },
    ],
  },

  // ━━━ 5. TELECOMUNICAZIONI E IT ━━━
  {
    id: "infrastrutture-telecomunicazioni-it",
    label: "Infrastrutture per telecomunicazioni e tecnologie informatiche",
    subSectors: [
      {
        id: "infrastrutture-telecomunicazioni",
        label: "Infrastrutture per telecomunicazioni",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altre-opere-telecomunicazione", label: "Altre opere ed impianti per telecomunicazione" },
          { id: "cablaggio-interno-edifici-reti-locali", label: "Cablaggio interno ad edifici e di reti locali" },
          { id: "cavidotti-opere-cablaggio-centraline", label: "Cavidotti, altre opere civili di cablaggio e centraline" },
          { id: "impianti-radioelettrici", label: "Impianti radioelettrici (antenne e trasmettitori)" },
          { id: "impianti-wireless", label: "Impianti wireless" },
          { id: "posa-cavi-dotti-esistenti", label: "Posa cavi in dotti già esistenti" },
          { id: "sistemi-controllo-videosorveglianza", label: "Sistemi ed impianti di controllo e videosorveglianza" },
        ],
      },
      {
        id: "tecnologie-informatiche",
        label: "Tecnologie informatiche",
        interventionProfile: "infrastrutture",
        categories: [
          { id: "altre-opere-tecnologie-informatiche", label: "Altre opere ed impianti per tecnologie informatiche" },
          { id: "impianti-hw-sw-centri-servizio", label: "Impianti ed infrastrutture hardware e software per centri di servizio informatici" },
          { id: "locali-centri-servizio-informatici", label: "Locali attrezzati per centri di servizio informatici" },
        ],
      },
    ],
  },

  // ━━━ 6. INFRASTRUTTURE SOCIALI ━━━
  {
    id: "infrastrutture-sociali",
    label: "Infrastrutture sociali",
    subSectors: [
      {
        id: "abitative",
        label: "Abitative",
        interventionProfile: "edifici-pubblici",
        categories: [
          { id: "abitazioni-rurali-borghi", label: "Abitazioni rurali e borghi rurali" },
          { id: "altri-edifici-abitativi", label: "Altri edifici abitativi" },
          { id: "edifici-danneggiati-calamita", label: "Edifici danneggiati da calamità naturali" },
          { id: "fabbricati-residenziali-urbani", label: "Fabbricati residenziali urbani" },
          { id: "infrastrutture-civili-residenziali", label: "Infrastrutture civili per complessi residenziali" },
          { id: "residenze-comunita", label: "Residenze per comunità" },
        ],
      },
      {
        id: "altre-infrastrutture-sociali",
        label: "Altre infrastrutture sociali",
        interventionProfile: "verde-ambiente",
        categories: [
          { id: "altre-infrastrutture", label: "Altre infrastrutture" },
          { id: "arredo-urbano", label: "Arredo urbano" },
          { id: "cimiteri", label: "Cimiteri" },
          { id: "illuminazione-pubblica", label: "Illuminazione pubblica" },
          { id: "verde-pubblico", label: "Verde pubblico" },
        ],
      },
      {
        id: "beni-culturali",
        label: "Beni culturali",
        interventionProfile: "beni-culturali",
        categories: [
          { id: "altri-beni-culturali", label: "Altri beni culturali" },
          { id: "aree-archeologiche", label: "Aree archeologiche" },
          { id: "beni-culturali-mobili", label: "Beni culturali mobili" },
          { id: "monumenti", label: "Monumenti" },
          { id: "musei-archivi-biblioteche", label: "Musei archivi e biblioteche" },
          { id: "patrimonio-rurale", label: "Patrimonio rurale" },
          { id: "restauro-riqualificazione-beni-culturali", label: "Restauro e riqualificazione di beni culturali" },
        ],
      },
      {
        id: "culto",
        label: "Culto",
        interventionProfile: "beni-culturali",
        categories: [
          { id: "altri-edifici-culto", label: "Altri edifici per il culto" },
          { id: "chiese", label: "Chiese" },
          { id: "conventi", label: "Conventi" },
          { id: "edifici-servizi-religiosi", label: "Edifici per servizi religiosi" },
        ],
      },
      {
        id: "difesa",
        label: "Difesa",
        interventionProfile: "edifici-pubblici",
        categories: [
          { id: "altre-strutture-militari", label: "Altre strutture/infrastrutture militari" },
          { id: "caserme", label: "Caserme" },
        ],
      },
      {
        id: "direzionali-amministrative",
        label: "Direzionali e amministrative",
        interventionProfile: "edifici-pubblici",
        categories: [
          { id: "altre-strutture-direzionali", label: "Altre strutture/infrastrutture direzionali e amministrative" },
          { id: "edifici-infrastrutture-uffici", label: "Edifici e infrastrutture per uffici" },
          { id: "strutture-sedi-pa", label: "Strutture/infrastrutture per sedi della Pubblica Amministrazione" },
          { id: "strutture-sedi-organi-istituzionali", label: "Strutture/infrastrutture per sedi di organi istituzionali" },
        ],
      },
      {
        id: "giudiziarie-penitenziarie",
        label: "Giudiziarie e penitenziarie",
        interventionProfile: "edifici-pubblici",
        categories: [
          { id: "altre-strutture-giudiziarie", label: "Altre strutture/infrastrutture giudiziarie" },
          { id: "preture-tribunali", label: "Preture e tribunali" },
          { id: "strutture-penitenziarie", label: "Strutture/infrastrutture penitenziarie" },
        ],
      },
      {
        id: "pubblica-sicurezza",
        label: "Pubblica sicurezza",
        interventionProfile: "edifici-pubblici",
        categories: [
          { id: "altre-strutture-pubblica-sicurezza", label: "Altre strutture/infrastrutture per la pubblica sicurezza" },
          { id: "commissariati", label: "Commissariati" },
          { id: "edifici-protezione-civile", label: "Edifici ed infrastrutture per la protezione civile" },
        ],
      },
      {
        id: "sanitarie",
        label: "Sanitarie",
        interventionProfile: "edifici-pubblici",
        categories: [
          { id: "strutture-igiene-profilassi-salute", label: "Altre strutture per l'igiene la profilassi e la tutela della salute" },
          { id: "altre-strutture-sanitarie", label: "Altre strutture sanitarie" },
          { id: "altri-presidi-sanitari-territoriali", label: "Altri presidi sanitari territoriali" },
          { id: "residenze-sanitarie-assistenziali", label: "Residenze sanitarie assistenziali" },
          { id: "strutture-ospedaliere", label: "Strutture ospedaliere" },
        ],
      },
      {
        id: "sociali-scolastiche",
        label: "Sociali e scolastiche",
        interventionProfile: "edifici-pubblici",
        categories: [
          { id: "altre-strutture-sociali", label: "Altre strutture sociali" },
          { id: "altri-edifici-scolastici", label: "Altri edifici scolastici" },
          { id: "asili-nido", label: "Asili nido" },
          { id: "edifici-sociali-culturali-assistenziali", label: "Edifici sociali, culturali e assistenziali" },
          { id: "scuole-elementari-medie-superiori", label: "Scuole elementari, medie e superiori" },
          { id: "scuole-materne", label: "Scuole materne" },
          { id: "universita", label: "Università" },
        ],
      },
      {
        id: "sport-spettacolo-tempo-libero",
        label: "Sport, spettacolo e tempo libero",
        interventionProfile: "edifici-pubblici",
        categories: [
          { id: "altre-strutture-ricreative", label: "Altre strutture ricreative" },
          { id: "impianti-sportivi", label: "Impianti sportivi" },
          { id: "strutture-fieristiche-congressuali", label: "Strutture fieristiche e congressuali" },
          { id: "teatri-strutture-spettacolo", label: "Teatri ed altre strutture per lo spettacolo" },
        ],
      },
    ],
  },

  // ━━━ 7. ISTRUZIONE, FORMAZIONE E LAVORO ━━━
  {
    id: "istruzione-formazione-lavoro",
    label: "Istruzione, formazione e sostegni per il mercato del lavoro",
    subSectors: [
      {
        id: "altri-sostegni-mercato-lavoro",
        label: "Altri sostegni per il mercato del lavoro",
        interventionProfile: "default",
        categories: [
          { id: "altri-sostegni-lavoro", label: "Altri sostegni per il mercato del lavoro" },
          { id: "orientamento-consulenza-informazione", label: "Orientamento e consulenza e informazione" },
          { id: "osservatori-mercato-lavoro", label: "Osservatori del mercato del lavoro" },
          { id: "sostegni-uscita-mercato-lavoro", label: "Sostegni all'uscita dal mercato del lavoro" },
        ],
      },
      {
        id: "strumenti-formativi-work-experience",
        label: "Altri strumenti formativi e di work-experience",
        interventionProfile: "default",
        categories: [
          { id: "lavori-pubblica-utilita", label: "Lavori di pubblica utilità / Lavori socialmente utili" },
          { id: "percorsi-formativi-creazione-impresa", label: "Percorsi formativi integrati per la creazione di impresa" },
          { id: "percorsi-formativi-inserimento-lavorativo", label: "Percorsi formativi integrati per l'inserimento lavorativo" },
        ],
      },
      {
        id: "contributi-incentivi-lavoro",
        label: "Contributi ed incentivi al lavoro",
        interventionProfile: "default",
        categories: [
          { id: "altri-contributi-occupazione", label: "Altri contributi all'occupazione" },
          { id: "incentivi-lavoro-autonomo", label: "Incentivi alle persone per il lavoro autonomo" },
          { id: "incentivi-formazione", label: "Incentivi alle persone per la formazione" },
        ],
      },
      {
        id: "formazione-lavoro",
        label: "Formazione per il lavoro",
        interventionProfile: "default",
        categories: [
          { id: "alta-formazione-its", label: "Alta formazione ITS" },
          { id: "altra-formazione-obbligo-formativo", label: "Altra formazione all'interno dell'obbligo formativo" },
          { id: "formazione-reinserimento-lavorativo", label: "Formazione finalizzata al reinserimento lavorativo" },
          { id: "formazione-contratti-formazione-lavoro", label: "Formazione nell'ambito dei contratti di formazione lavoro" },
          { id: "formazione-apprendistato-obbligo", label: "Formazione nell'ambito dell'apprendistato all'interno dell'obbligo formativo" },
          { id: "formazione-apprendistato-professionalizzante", label: "Formazione nell'ambito dell'apprendistato post obbligo formativo (professionalizzante)" },
          { id: "formazione-creazione-impresa", label: "Formazione per la creazione d'impresa" },
          { id: "formazione-occupati-continua", label: "Formazione per occupati (o formazione continua)" },
          { id: "formazione-permanente-culturale", label: "Formazione permanente aggiornamento culturale" },
          { id: "formazione-permanente-professionale", label: "Formazione permanente aggiornamento professionale e tecnico" },
        ],
      },
      {
        id: "scuola-istruzione",
        label: "Scuola e istruzione",
        interventionProfile: "default",
        categories: [
          { id: "formazione-istruzione-obbligo-scolastico", label: "Formazione e istruzione all'interno dell'obbligo scolastico" },
          { id: "formazione-adulti", label: "Formazione per adulti" },
          { id: "orientamento-scolastico-formativo", label: "Orientamento scolastico e formativo" },
          { id: "progetti-mobilita-internazionali", label: "Progetti e mobilità internazionali" },
          { id: "servizi-infanzia", label: "Servizi per l'infanzia" },
          { id: "stage-tirocini-alternanza", label: "Stage, tirocini e percorsi di alternanza scuola lavoro" },
        ],
      },
    ],
  },

  // ━━━ 8. OPERE PER ATTIVITÀ PRODUTTIVE E RICERCA ━━━
  {
    id: "opere-attivita-produttive-ricerca",
    label: "Opere, impianti ed attrezzature per attività produttive, e la ricerca e l'impresa sociale",
    subSectors: [
      {
        id: "pesca-acquacoltura",
        label: "Impianti ed attrezzature per la pesca e l'acquacoltura",
        interventionProfile: "default",
        categories: [
          { id: "altre-attrezzature-pesca", label: "Altre attrezzature per la pesca" },
          { id: "impianti-acquacoltura", label: "Impianti di acquacoltura" },
          { id: "mezzi-opere-attivita-pesca", label: "Mezzi, opere ed attrezzature per attività di pesca" },
          { id: "strutture-trasformazione-commercializzazione-pesca", label: "Strutture per la trasformazione e commercializzazione dei prodotti della pesca ed acquacoltura" },
        ],
      },
      {
        id: "opere-infrastrutture-ricerca",
        label: "Opere e infrastrutture per la ricerca",
        interventionProfile: "edifici-pubblici",
        categories: [
          { id: "altre-opere-ricerca", label: "Altre opere ed infrastrutture per la ricerca" },
          { id: "centri-ricerca", label: "Centri di ricerca" },
          { id: "laboratori-ricerca", label: "Laboratori attrezzati per la ricerca" },
        ],
      },
      {
        id: "opere-impresa-sociale",
        label: "Opere e infrastrutture per l'impresa sociale",
        interventionProfile: "edifici-pubblici",
        categories: [
          { id: "spazi-strutture-impresa-sociale", label: "Spazi e strutture per le attività di impresa sociale" },
        ],
      },
      {
        id: "opere-strutture-turismo",
        label: "Opere e strutture per il turismo",
        interventionProfile: "edifici-pubblici",
        categories: [
          { id: "alberghi", label: "Alberghi" },
          { id: "altre-strutture-ricettivita-turistica", label: "Altre strutture di ricettività turistica" },
          { id: "altre-strutture-impianti-turismo", label: "Altre strutture e impianti per il turismo" },
          { id: "centri-informazione-accoglienza", label: "Centri di informazione / accoglienza" },
          { id: "strutture-agriturismo-turismo-rurale", label: "Strutture ricettive per agriturismo e turismo rurale" },
        ],
      },
      {
        id: "agricoltura-zootecnia-agroalimentare",
        label: "Opere, impianti ed attrezzature per l'agricoltura, la zootecnia e l'agroalimentare",
        interventionProfile: "default",
        categories: [
          { id: "altre-opere-agricoltura", label: "Altre opere e strutture per l'agricoltura" },
          { id: "benessere-animali", label: "Benessere animali" },
          { id: "compensazioni-settore-agricolo-forestale", label: "Compensazioni settore agricolo e forestale e della pesca ed acquacoltura" },
          { id: "creazione-cooperazione-produttiva", label: "Creazione nuove forme di cooperazione produttiva e commerciale" },
          { id: "fabbricati-agroindustriali", label: "Fabbricati agroindustriali" },
          { id: "fabbricati-rurali", label: "Fabbricati rurali" },
          { id: "impianti-tutela-qualita-associative", label: "Impianti collettivi per la tutela della qualità e per lo sviluppo di forme associative dei produttori" },
          { id: "impianti-reti-irrigue-aziendali", label: "Impianti e reti irrigue aziendali" },
          { id: "impianti-diversificazione-attivita", label: "Impianti ed attrezzature per la diversificazione delle attività o pluriattività in aziende agricole" },
          { id: "impianti-macchinari-aziende-agricole", label: "Impianti, macchinari mezzi tecnici e investimenti immateriali per le aziende agricole e agroalimentari" },
          { id: "infrastrutture-servizio-aziende-agricole", label: "Infrastrutture a servizio delle aziende agricole" },
          { id: "interventi-ricomposizione-fondiaria", label: "Interventi per la ricomposizione fondiaria" },
          { id: "investimenti-non-produttivi-agro-climatico", label: "Investimenti non produttivi a finalità agro-climatico-ambientale" },
          { id: "mezzi-impianti-ripristino-calamitosi", label: "Mezzi e impianti per il ripristino e la prevenzione da eventi calamitosi" },
          { id: "miglioramenti-fondiari-aziendali", label: "Miglioramenti fondiari aziendali" },
          { id: "opere-impianti-produttivi-agricoli", label: "Opere su impianti produttivi (coltivazioni) agricoli" },
          { id: "sostegno-agro-silvo-ambientale", label: "Sostegno in ambito agro-silvo ambientale" },
          { id: "strutture-coltivazioni-protette-serre", label: "Strutture per coltivazioni agricole protette (serre; ecc.)" },
          { id: "strutture-zootecnia", label: "Strutture per la zootecnia" },
        ],
      },
      {
        id: "attivita-industriali-artigianato",
        label: "Opere, impianti ed attrezzature per attività industriali e l'artigianato",
        interventionProfile: "default",
        categories: [
          { id: "altre-opere-attivita-industriali", label: "Altre opere ed impianti per attività industriali" },
          { id: "attrezzature-dotazioni-informatiche", label: "Attrezzature o dotazioni informatiche" },
          { id: "centri-laboratori-artigiani", label: "Centri e laboratori artigiani" },
          { id: "impianti-macchinari-opere-murarie", label: "Impianti, macchinari ed annesse opere murarie" },
          { id: "iniziative-attrazione-investimenti", label: "Iniziative di attrazione investimenti e sviluppo produttivo territoriale" },
          { id: "iniziative-riconversione-industriale", label: "Iniziative di riconversione industriale" },
          { id: "tecnologie-rispettose-ambiente", label: "Introduzione tecnologie rispettose dell'ambiente e della riduzione dei consumi" },
          { id: "strutture-industriali-comuni", label: "Strutture industriali comuni ed altri edifici attrezzati" },
          { id: "strutture-logistica", label: "Strutture per la logistica" },
        ],
      },
      {
        id: "settore-silvo-forestale",
        label: "Opere, impianti ed attrezzature per il settore silvo-forestale",
        interventionProfile: "verde-ambiente",
        categories: [
          { id: "altre-opere-silvo-pastorale", label: "Altre opere per il settore silvo-pastorale" },
          { id: "attrezzature-macchinari-lavoro-forestale", label: "Attrezzature, macchinari e mezzi tecnici per il lavoro forestale" },
          { id: "forestazione-produttiva", label: "Forestazione produttiva" },
          { id: "impianti-raccolta-trasformazione-forestali", label: "Impianti per la raccolta, la trasformazione e la commercializzazione di prodotti forestali" },
          { id: "infrastrutture-servizio-aziende-forestali", label: "Infrastrutture a servizio delle aziende forestali" },
          { id: "mezzi-impianti-prevenzione-calamita-forestali", label: "Mezzi ed impianti per la prevenzione e il ripristino da calamità naturali" },
          { id: "opere-resilienza-ecosistemi-forestali", label: "Opere per l'accrescimento della resilienza e del pregio ambientale degli ecosistemi forestali" },
          { id: "strutture-coltivazioni-forestali-vivai", label: "Strutture per coltivazioni forestali (vivai, ecc)" },
        ],
      },
      {
        id: "commercio-servizi",
        label: "Strutture ed attrezzature per il commercio e i servizi",
        interventionProfile: "default",
        categories: [
          { id: "altre-strutture-commercio-servizi", label: "Altre strutture per il commercio ed i servizi" },
          { id: "centri-commerciali", label: "Centri commerciali" },
          { id: "impianti-macchinari-commercio-servizi", label: "Impianti e macchinari per il commercio ed i servizi" },
          { id: "magazzini", label: "Magazzini" },
          { id: "strutture-servizi-annona", label: "Strutture per servizi di annona" },
        ],
      },
    ],
  },

  // ━━━ 9. RICERCA, SVILUPPO E INNOVAZIONE ━━━
  {
    id: "ricerca-sviluppo-innovazione",
    label: "Ricerca sviluppo tecnologico ed innovazione",
    subSectors: [
      {
        id: "diffusione-cooperazione-pubblico-privata",
        label: "Progetti di diffusione e cooperazione pubblico-privata",
        interventionProfile: "default",
        categories: [
          { id: "altre-ricerche-diffusione", label: "Altre ricerche" },
          { id: "controllo-tutela-ambiente-terrestre-marino", label: "Controllo e tutela dell'ambiente terrestre e marino" },
          { id: "esplorazione-utilizzazione-ambiente", label: "Esplorazione e utilizzazione dell'ambiente terrestre e marino" },
          { id: "infrastrutture-pianificazione-territorio", label: "Infrastrutture e pianificazione del territorio" },
          { id: "produzione-trasferimento-agricole", label: "Produzione e trasferimento nuovi prodotti, pratiche, processi e tecnologie agricole, forestali, della pesca e dell'acquacoltura" },
          { id: "produzione-distribuzione-uso-energia", label: "Produzione, distribuzione e uso razionale dell'energia" },
          { id: "progetti-agro-climatico-ambientale", label: "Progetti a finalità agro-climatico-ambientale" },
          { id: "protezione-promozione-salute", label: "Protezione e promozione della salute umana" },
          { id: "strutture-relazioni-sociali", label: "Strutture e relazioni sociali" },
        ],
      },
      {
        id: "ricerca-innovazione-imprese",
        label: "Progetti di ricerca e di innovazione presso imprese",
        interventionProfile: "default",
        categories: [
          { id: "sperimentazione-soluzioni-innovative", label: "Sperimentazione soluzioni innovative e validazione prodotti" },
          { id: "tecnologie-energetiche", label: "Tecnologie energetiche" },
        ],
      },
      {
        id: "ricerca-universita-istituti",
        label: "Progetti di ricerca presso università e istituti di ricerca",
        interventionProfile: "default",
        categories: [
          { id: "altre-ricerche-universita", label: "Altre ricerche" },
          { id: "infrastrutture-pianificazione-territorio-univ", label: "Infrastrutture e pianificazione del territorio" },
        ],
      },
    ],
  },

  // ━━━ 10. SERVIZI PER LA PA E COLLETTIVITÀ ━━━
  {
    id: "servizi-pa-collettivita",
    label: "Servizi per la P.A. e per la collettività",
    subSectors: [
      {
        id: "altri-servizi-collettivita",
        label: "Altri servizi per la collettività",
        interventionProfile: "default",
        categories: [
          { id: "altri-servizi-collettivita-gen", label: "Altri servizi per la collettività" },
          { id: "assistenza-sociale-servizi-persona", label: "Assistenza sociale ed altri servizi alla persona" },
        ],
      },
      {
        id: "servizi-assistenza-tecnica-pa",
        label: "Servizi di assistenza tecnica alla P.A.",
        interventionProfile: "default",
        categories: [
          { id: "altre-attivita-consulenza-assistenza-tecnica", label: "Altre attività di consulenza e assistenza tecnica" },
        ],
      },
    ],
  },
];

// ── Helper Functions ─────────────────────────────────

/** Get all sectors (top level) */
export const getSectors = (): MOPSector[] => mopData;

/** Get sub-sectors for a given sector ID */
export const getSubSectors = (sectorId: string): MOPSubSector[] => {
  const sector = mopData.find((s) => s.id === sectorId);
  return sector?.subSectors ?? [];
};

/** Get categories for a given sub-sector ID within a sector */
export const getCategories = (sectorId: string, subSectorId: string): MOPCategory[] => {
  const sector = mopData.find((s) => s.id === sectorId);
  const subSector = sector?.subSectors.find((ss) => ss.id === subSectorId);
  return subSector?.categories ?? [];
};

/**
 * Get intervention types for a given sub-sector.
 * All 5 types are always returned. The `suggested` flag indicates
 * which ones are most pertinent for the selected context.
 * Results are sorted: suggested first, then others.
 */
export const getInterventionTypes = (
  sectorId: string,
  subSectorId: string
): { type: InterventionType; suggested: boolean }[] => {
  const sector = mopData.find((s) => s.id === sectorId);
  const subSector = sector?.subSectors.find((ss) => ss.id === subSectorId);
  const profile = subSector?.interventionProfile ?? "default";
  const suggested = interventionProfiles[profile];

  return interventionTypes
    .map((t) => ({
      type: t,
      suggested: suggested.includes(t.id),
    }))
    .sort((a, b) => (a.suggested === b.suggested ? 0 : a.suggested ? -1 : 1));
};

/** Flat list of all categories (useful for search) */
export const getAllCategories = (): (MOPCategory & { sectorId: string; subSectorId: string })[] => {
  const result: (MOPCategory & { sectorId: string; subSectorId: string })[] = [];
  for (const sector of mopData) {
    for (const subSector of sector.subSectors) {
      for (const category of subSector.categories) {
        result.push({ ...category, sectorId: sector.id, subSectorId: subSector.id });
      }
    }
  }
  return result;
};
