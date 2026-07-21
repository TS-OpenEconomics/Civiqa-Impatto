import initialProject from "../mocks/project.json";
import { MUBA_PROJECT, MUBA_EIA_RESULTS, MUBA_ECBA_RESULTS } from "../mocks/mubaProject";
import { OSPEDALE_PROJECT, OSPEDALE_EIA_RESULTS, OSPEDALE_ECBA_RESULTS } from "../mocks/ospedaleProject";
import { computeEia } from "./eiaEngine";
import { computeEcba } from "./ecbaEngine";

const DEFAULT_ECBA_INPUTS = {
  horizon: 25,
  discountRate: 3.5,
  residualValue: 12000000,
  benefitsMode: "Da impatti EIA e benefici idrici stimati",
};

// v5: MUBA ora include il gettito fiscale (€8.456.460) e i dataset di dettaglio
// EIA/ECBA reali. Il bump invalida lo stato v4 in cache (MUBA senza gettito).
// v7: aggiunto il progetto reale Ospedale Infantile (scenario 841, Genova) con
// EIA/ECBA reali. Il bump invalida lo stato v6 in cache.
// v8: ospedale con OPEX in scheda, categoria/sotto-settore corretti (Strutture
// ospedaliere / Sanitarie) e i 3 progetti asilo nido. Invalida il seed v7 vecchio.
export const PROJECT_STORAGE_KEY = "civiqa.projects.v8";
export const UI_STORAGE_KEY = "civiqa.ui.v1";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

// ── Risultati seed FISSI ──────────────────────────────────────────────────────
// Regola di prodotto: un progetto presente in elenco implica wizard completato,
// quindi EIA ed ECBA sono già state svolte. Per coerenza usiamo gli STESSI numeri
// su tutti i progetti (volutamente identici, anche se concettualmente arbitrari):
// niente schermate di "avvio analisi" per le analisi accese.
function buildSeedScenario(project) {
  const c = project.configurazione ?? {};
  const vitaUtile = c.vita_utile ?? 20;
  const annoInizio = c.anno_attualizzazione ?? 2025;
  return {
    settore: c.settore || "",
    nuts_code: c.nuts_code || "",
    nuts_label: c.nuts_label || c.localizzazione || "",
    capex: c.capex ?? 0,
    opex_annuo: c.opex ?? 0,
    vita_utile: vitaUtile,
    anno_inizio: annoInizio,
    anno_fine: annoInizio + vitaUtile - 1,
    capex_distribuzione: c.capex_distribuzione ?? null,
    spese_aggiuntive: [],
    granularita: "regionale",
    tipo: "completa",
  };
}

const SEED_EIA_SCENARIO = buildSeedScenario(initialProject);
const SEED_EIA_RESULTS = computeEia(initialProject, SEED_EIA_SCENARIO);
const SEED_ECBA_RESULTS = computeEcba(initialProject, SEED_EIA_RESULTS, DEFAULT_ECBA_INPUTS);

// Promuove un workspace a "EIA + ECBA completate" con i risultati seed fissi.
// Lo stato ESG resta invariato (l'ESG richiede un questionario dedicato).
function withCompletedAnalyses(workspace) {
  const updatedAt = workspace.project.ultima_modifica ?? nowLabel();
  return {
    ...workspace,
    eiaInputs: clone(SEED_EIA_SCENARIO),
    eiaResults: clone(SEED_EIA_RESULTS),
    ecbaResults: clone(SEED_ECBA_RESULTS),
    results: {
      ...workspace.results,
      eia: clone(SEED_EIA_RESULTS),
      ecba: clone(SEED_ECBA_RESULTS),
    },
    analyses: {
      ...workspace.analyses,
      eia: { status: "completed", updatedAt },
      ecba: { status: "completed", updatedAt },
    },
  };
}

// Workspace per il progetto reale MUBA: EIA ed ECBA già completate, ma con i
// risultati REALI importati dagli export (non i numeri seed fissi). Stessa forma
// di withCompletedAnalyses così i consumer (ProjectDetail, ValutazioniList) non
// distinguono questo progetto dagli altri.
function buildMubaWorkspace() {
  const project = clone(MUBA_PROJECT);
  const updatedAt = project.ultima_modifica;
  const base = createWorkspace(project);
  return {
    ...base,
    eiaInputs: clone(MUBA_EIA_RESULTS.scenario),
    eiaResults: clone(MUBA_EIA_RESULTS),
    ecbaResults: clone(MUBA_ECBA_RESULTS),
    results: {
      ...base.results,
      eia: clone(MUBA_EIA_RESULTS),
      ecba: clone(MUBA_ECBA_RESULTS),
    },
    analyses: {
      ...base.analyses,
      eia: { status: "completed", updatedAt },
      ecba: { status: "completed", updatedAt },
    },
  };
}

// Workspace per il progetto reale Ospedale Infantile (scenario 841, Genova):
// stessa logica di buildMubaWorkspace, con i risultati REALI importati.
function buildOspedaleWorkspace() {
  const project = clone(OSPEDALE_PROJECT);
  const updatedAt = project.ultima_modifica;
  const base = createWorkspace(project);
  return {
    ...base,
    eiaInputs: clone(OSPEDALE_EIA_RESULTS.scenario),
    eiaResults: clone(OSPEDALE_EIA_RESULTS),
    ecbaResults: clone(OSPEDALE_ECBA_RESULTS),
    results: {
      ...base.results,
      eia: clone(OSPEDALE_EIA_RESULTS),
      ecba: clone(OSPEDALE_ECBA_RESULTS),
    },
    analyses: {
      ...base.analyses,
      eia: { status: "completed", updatedAt },
      ecba: { status: "completed", updatedAt },
    },
  };
}

// Workspace "calcolato" per i progetti asilo nido: EIA ed ECBA sono calcolate
// realmente dal motore, con i benefici KPI scalati sui POSTI del progetto
// (override della variabile territoriale com_src_utentiserviziinfanzia_y).
function buildComputedWorkspace(project, { posti, horizon, discountRate, residualValue = 0, extraOverrides }) {
  const updatedAt = project.ultima_modifica ?? nowLabel();
  const base = createWorkspace(clone(project));
  // EIA: shock = solo CAPEX (l'OPEX non è uno shock d'investimento).
  const scenario = { ...buildSeedScenario(project), opex_annuo: 0 };
  const eiaResults = computeEia(project, scenario);
  const ecbaResults = computeEcba(project, eiaResults, {
    horizon,
    discountRate,
    residualValue,
    // Il driver dei benefici (posti/beneficiari) scala sul progetto; extraOverrides
    // permette trattamenti specifici (es. voucher: MF-IST-NIDO=0 → niente valore servizio).
    kpiOverrides: { com_src_utentiserviziinfanzia_y: posti, ...(extraOverrides || {}) },
  });
  return {
    ...base,
    eiaInputs: clone(scenario),
    eiaResults: clone(eiaResults),
    ecbaResults: clone(ecbaResults),
    results: { ...base.results, eia: clone(eiaResults), ecba: clone(ecbaResults) },
    analyses: {
      ...base.analyses,
      eia: { status: "completed", updatedAt },
      ecba: { status: "completed", updatedAt },
    },
  };
}

// I 3 progetti asilo nido (alternative del DOCFAP) come progetti Ricadute.
const NIDO_PROJECTS = [
  {
    project: buildProject({
      id: "PROJ-NIDO-A1",
      cup: "F81B24000010006",
      nome: "Asilo nido comunale — Nuova costruzione",
      descrizione:
        "Realizzazione di un nuovo asilo nido comunale (0-3 anni) da ~90 posti: nuovo edificio, spazi educativi e area esterna. Alternativa A1 del DOCFAP.",
      stato: "Approvato",
      creato_il: "15/07/2026",
      ultima_modifica: "15/07/2026",
      configurazione: {
        settore: "Infrastrutture sociali",
        sotto_settore: "Istruzione e servizi educativi",
        categoria_intervento: "Asili Nido",
        tipo_intervento: "Nuova realizzazione",
        durata_progetto: "20 anni",
        localizzazione: "Colleferro RM",
        nuts_code: "ITI43",
        nuts_label: "Roma",
        anno_attualizzazione: 2026,
        capex: 2640000,
        opex: 420000,
        vita_utile: 30,
      },
    }),
    posti: 90,
    horizon: 20,
    discountRate: 3,
    residualValue: 660000,
  },
  {
    project: buildProject({
      id: "PROJ-NIDO-A2",
      cup: "F81B24000020006",
      nome: "Asilo nido comunale — Ristrutturazione",
      descrizione:
        "Ristrutturazione e adeguamento (adaptive reuse) di un edificio pubblico esistente ad asilo nido (0-3 anni) da ~84 posti: capacità quasi equivalente alla nuova costruzione a circa metà dell'investimento. Alternativa A2 del DOCFAP.",
      stato: "Approvato",
      creato_il: "15/07/2026",
      ultima_modifica: "15/07/2026",
      configurazione: {
        settore: "Infrastrutture sociali",
        sotto_settore: "Istruzione e servizi educativi",
        categoria_intervento: "Asili Nido",
        tipo_intervento: "Ristrutturazione",
        durata_progetto: "20 anni",
        localizzazione: "Colleferro RM",
        nuts_code: "ITI43",
        nuts_label: "Roma",
        anno_attualizzazione: 2026,
        capex: 1440000,
        opex: 300000,
        vita_utile: 30,
      },
    }),
    posti: 84,
    horizon: 20,
    discountRate: 3,
    residualValue: 400000,
  },
  {
    project: buildProject({
      id: "PROJ-NIDO-A3",
      cup: "F81B24000030006",
      nome: "Asilo nido comunale — Voucher alle famiglie",
      descrizione:
        "Erogazione di voucher alle famiglie per l'accesso a servizi 0-3 accreditati (~180 beneficiari, di cui ~72 aggiuntivi al netto del deadweight), senza nuova infrastruttura. Alternativa A3 del DOCFAP.",
      stato: "Approvato",
      creato_il: "15/07/2026",
      ultima_modifica: "15/07/2026",
      configurazione: {
        settore: "Infrastrutture sociali",
        sotto_settore: "Istruzione e servizi educativi",
        categoria_intervento: "Asili Nido",
        tipo_intervento: "Altro",
        durata_progetto: "20 anni",
        localizzazione: "Colleferro RM",
        nuts_code: "ITI43",
        nuts_label: "Roma",
        anno_attualizzazione: 2026,
        capex: 0,
        opex: 600000,
        vita_utile: 5,
      },
    }),
    // Voucher: benefici solo sui bambini AGGIUNTIVI (72, addizionalità ~40%) e
    // NESSUN valore del servizio (MF-IST-NIDO=0): il trasferimento paga già il servizio
    // (evita il doppio conteggio). Il costo è il trasferimento (OPEX 600k/anno).
    posti: 72,
    horizon: 20,
    discountRate: 3,
    residualValue: 0,
    extraOverrides: { "MF-IST-NIDO": 0 },
  },
];

// Cache dei workspace nido calcolati (EIA/ECBA), esposta ai builder dei dataset
// di dettaglio (ecbaDatasets/eiaDatasets). Stessi parametri dei seed → stessi numeri.
let _nidoComputedById = null;
export function getNidoComputedWorkspace(id) {
  if (!_nidoComputedById) {
    _nidoComputedById = new Map();
    for (const n of NIDO_PROJECTS) {
      const ws = buildComputedWorkspace(n.project, {
        posti: n.posti,
        horizon: n.horizon,
        discountRate: n.discountRate,
        residualValue: n.residualValue,
        extraOverrides: n.extraOverrides,
      });
      _nidoComputedById.set(ws.id, ws);
    }
  }
  return _nidoComputedById.get(id) ?? null;
}

function nowDate() {
  return new Intl.DateTimeFormat("it-IT").format(new Date());
}

export function createEmptyDraftProject() {
  const base = clone(initialProject);
  return {
    ...base,
    nome: "",
    cup: "",
    descrizione: "",
    stato: "",
    configurazione: {
      ...base.configurazione,
      settore: "",
      sotto_settore: "",
      categoria_intervento: "",
      tipo_intervento: "",
      durata_progetto: "",
      localizzazione: "",
      lat: null,
      lon: null,
      nuts_code: "",
      nuts_label: "",
      nace_code: "",
      anno_attualizzazione: null,
      tasso_attualizzazione: null,
      capex: null,
      opex: null,
      vita_utile: null,
      capex_distribuzione_attiva: false,
      capex_distribuzione: {},
      opex_tasso: null,
      opex_distribuzione_attiva: false,
      opex_distribuzione: {},
      benefici_kpi: null,
      benefici_extra: [],
    },
  };
}

export function createWorkspace(project) {
  return {
    id: project.id,
    project,
    eiaInputs: null,
    ecbaInputs: clone(DEFAULT_ECBA_INPUTS),
    esgAnswers: null,
    results: {
      eia: null,
      ecba: null,
      esg: null,
    },
    analyses: {
      eia: { status: "needs_input", updatedAt: null },
      ecba: { status: "needs_input", updatedAt: null },
      esg: { status: "needs_input", updatedAt: null },
    },
  };
}

function buildProject(overrides) {
  const base = clone(initialProject);
  return {
    ...base,
    ...overrides,
    configurazione: {
      ...base.configurazione,
      ...(overrides.configurazione || {}),
    },
  };
}

export function buildSeedProjects() {
  // Ogni progetto in elenco ha il wizard completato ⇒ EIA ed ECBA già svolte.
  const proj002 = withCompletedAnalyses(
    createWorkspace(
      buildProject({
        id: "PROJ-002",
        cup: "I63C22000050128",
        nome: "Restauro Palazzo Reale",
        descrizione:
          "Intervento di recupero del complesso monumentale con rifunzionalizzazione degli spazi e piano di valorizzazione culturale.",
        stato: "In approvazione",
        creato_il: "10/05/2025",
        ultima_modifica: "18/05/2025",
        configurazione: {
          settore: "Infrastrutture sociali",
          sotto_settore: "Valorizzazione e fruizione dell'ambiente",
          categoria_intervento: "Reti idriche urbane",
          tipo_intervento: "Recupero",
          durata_progetto: "4 anni",
          localizzazione: "Piazza del Plebiscito 1 - Napoli NA",
          anno_attualizzazione: 2026,
          capex: 86000000,
          opex: 4200000,
        },
      }),
    ),
  );

  // PROJ-003 ha anche l'ESG completata.
  const proj003Base = withCompletedAnalyses(
    createWorkspace(
      buildProject({
        id: "PROJ-003",
        cup: "I63C22000050129",
        nome: "Riqualificazione Parco Urbano",
        descrizione:
          "Piano di riforestazione, drenaggio urbano sostenibile e messa in sicurezza dei percorsi ciclopedonali.",
        stato: "Bozza",
        creato_il: "08/05/2025",
        ultima_modifica: "14/05/2025",
        configurazione: {
          settore: "Infrastrutture ambientali e risorse idriche",
          sotto_settore: "Difesa del suolo e prevenzione",
          categoria_intervento: "Corpi idrici: Miglioramento della qualità",
          tipo_intervento: "Efficientamento",
          durata_progetto: "3 anni",
          localizzazione: "Via Roma 42 - Bari BA",
          anno_attualizzazione: 2025,
          capex: 24500000,
          opex: 1450000,
        },
      }),
    ),
  );
  const proj003 = {
    ...proj003Base,
    analyses: {
      ...proj003Base.analyses,
      esg: { status: "completed", updatedAt: "14/05/2025" },
    },
  };

  const nidoWorkspaces = NIDO_PROJECTS.map((n) =>
    buildComputedWorkspace(n.project, {
      posti: n.posti,
      horizon: n.horizon,
      discountRate: n.discountRate,
      residualValue: n.residualValue,
      extraOverrides: n.extraOverrides,
    }),
  );

  return [
    // Progetti reali in cima: dati EIA/ECBA importati dagli export.
    buildOspedaleWorkspace(),
    buildMubaWorkspace(),
    // Asilo nido (alternative DOCFAP): EIA/ECBA calcolate, benefici scalati sui posti.
    ...nidoWorkspaces,
    withCompletedAnalyses(createWorkspace(clone(initialProject))),
    proj002,
    proj003,
  ];
}

export function readProjectsState() {
  if (typeof window === "undefined") {
    return buildSeedProjects();
  }

  try {
    const raw = window.localStorage.getItem(PROJECT_STORAGE_KEY);
    if (!raw) {
      return buildSeedProjects();
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return buildSeedProjects();
    }
    return parsed;
  } catch {
    return buildSeedProjects();
  }
}

export function writeProjectsState(projects) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

export function getDefaultUiState() {
  return {
    searchTerm: "",
    debouncedSearchTerm: "",
    sectorFilters: [],
    sortMode: "recent",
  };
}

export function readUiState() {
  if (typeof window === "undefined") {
    return getDefaultUiState();
  }

  try {
    const raw = window.localStorage.getItem(UI_STORAGE_KEY);
    if (!raw) {
      return getDefaultUiState();
    }
    return { ...getDefaultUiState(), ...JSON.parse(raw) };
  } catch {
    return getDefaultUiState();
  }
}

export function writeUiState(uiState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(uiState));
}

export function duplicateProjectWorkspace(workspace) {
  const copy = clone(workspace);
  const id = `PROJ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  copy.id = id;
  copy.project.id = id;
  copy.project.nome = `${copy.project.nome} - Copia`;
  copy.project.cup = `${copy.project.cup}-COPY`;
  copy.project.creato_il = nowDate();
  copy.project.ultima_modifica = nowDate();
  copy.analyses = {
    eia: { status: "needs_input", updatedAt: null },
    ecba: { status: "needs_input", updatedAt: null },
    esg: { status: "needs_input", updatedAt: null },
  };
  copy.results = { eia: null, ecba: null, esg: null };
  return copy;
}

export function touchProject(project) {
  return {
    ...project,
    ultima_modifica: nowDate(),
  };
}

export function nowLabel() {
  return nowDate();
}
