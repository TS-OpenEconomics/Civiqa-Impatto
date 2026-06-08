import initialProject from "../mocks/project.json";
import { computeEia } from "./eiaEngine";
import { computeEcba } from "./ecbaEngine";

const DEFAULT_ECBA_INPUTS = {
  horizon: 25,
  discountRate: 3.5,
  residualValue: 12000000,
  benefitsMode: "Da impatti EIA e benefici idrici stimati",
};

// v3: i progetti seed ora nascono con EIA ed ECBA già completate e con risultati
// precalcolati. Il bump invalida lo stato v2 in cache (analisi "da avviare").
export const PROJECT_STORAGE_KEY = "civiqa.projects.v3";
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

  return [
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
