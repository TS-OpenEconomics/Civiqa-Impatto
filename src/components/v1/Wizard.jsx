import { useMemo, useRef, useState } from "react";
import { LeafletMap } from "../map/LeafletMap";
import { findNearest, geocodeAddress } from "../../lib/geocoding";

const SETTORI_DATA = {
  "Infrastrutture sociali": {
    nace: "F41.20",
    sottosettori: {
      "Istruzione e formazione": ["Scuole e asili", "Universita e ricerca", "Formazione professionale", "Servizi integrativi"],
      "Sanita e assistenza": ["Ospedali e cliniche", "Strutture per anziani", "Centri di salute", "Assistenza domiciliare"],
      "Cultura e sport": ["Biblioteche e musei", "Impianti sportivi", "Spazi culturali", "Teatri e auditorium"],
      "Edilizia residenziale pubblica": ["Riqualificazione alloggi", "Nuova costruzione ERP", "Manutenzione straordinaria"],
    },
  },
  "Infrastrutture di trasporto": {
    nace: "F42.11",
    sottosettori: {
      "Strade e autostrade": ["Nuova viabilita", "Adeguamento e manutenzione", "Sicurezza stradale", "Gallerie e ponti"],
      "Ferrovie e metropolitane": ["Linee ferroviarie", "Metropolitane e tram", "Stazioni e interscambi", "Alta velocita"],
      "Porti e aeroporti": ["Infrastrutture portuali", "Piste e terminal aeroportuali", "Logistica e magazzini"],
      "Mobilita urbana": ["Piste ciclabili", "ZTL e aree pedonali", "Parcheggi e nodi di scambio", "Bus rapid transit"],
    },
  },
  "Infrastrutture ambientali e risorse idriche": {
    nace: "E36.00",
    sottosettori: {
      "Risorse idriche e acque reflue": ["Reti fognarie", "Reti idriche urbane", "Corpi idrici: Miglioramento della qualita", "Impianti depurazione acque", "Reti idriche rurali"],
      "Difesa del suolo e prevenzione": ["Protezione idrogeologica", "Bonifica siti inquinati", "Gestione alluvioni", "Stabilizzazione versanti"],
      "Valorizzazione dell'ambiente": ["Parchi e aree naturali", "Biodiversita e ecosistemi", "Paesaggio rurale"],
      "Smaltimento rifiuti": ["Raccolta differenziata", "Compostaggio e digestione anaerobica", "Termovalorizzatori"],
    },
  },
  "Attivita produttive, ricerca e impresa sociale": {
    nace: "M72.19",
    sottosettori: {
      "Ricerca e sviluppo": ["Laboratori e centri di ricerca", "Incubatori di imprese", "Trasferimento tecnologico"],
      "Impresa sociale e terzo settore": ["Cooperative sociali", "Fondazioni e ONG", "Inserimento lavorativo"],
      "Zone economiche speciali": ["Aree industriali", "Poli produttivi integrati", "Distretti tecnologici"],
    },
  },
  "Telecomunicazioni e tecnologie informatiche": {
    nace: "J61.10",
    sottosettori: {
      "Reti a banda larga": ["Fibra ottica FTTH", "Fibra ottica FTTC", "Connettivita rurale e montana"],
      "Infrastrutture digitali pubbliche": ["Cloud PA", "Cybersecurity pubblica", "Servizi digitali ai cittadini"],
      "Smart city": ["Sensori e IoT urbano", "Mobilita connessa", "Illuminazione intelligente"],
    },
  },
};

const STATI = ["In preparazione", "In approvazione", "Approvato"];
const STATO_DESCRIPTIONS = {
  "In preparazione":
    "Il progetto e allo stadio iniziale: si raccolgono dati, si definiscono obiettivi e si impostano i primi elementi tecnici ed economici.",
  "In approvazione":
    "Il progetto e stato predisposto e presentato agli organi competenti ed e in attesa di autorizzazione o parere.",
  Approvato: "Il progetto ha ottenuto l'approvazione formale necessaria e puo procedere verso le fasi attuative ed esecutive.",
};
const SETTORI = Object.keys(SETTORI_DATA);
const TIPI = ["Nuova realizzazione", "Ristrutturazione", "Recupero", "Manutenzione", "Efficientamento"];
const ANNI = ["2025", "2026", "2027", "2028", "2029", "2030", "2031"];
const TASSO_DEFAULT = "3,5";
const STEP_AUTOFILL_LABEL = "Autoriempi questa pagina";
const DEMO_AUTOFILL = {
  nome: "Intervento efficientamento servizio idrico",
  cup: "I63C22000050127",
  descrizione:
    "L'obiettivo e valutare i benefici economici, sociali e ambientali derivanti dal rafforzamento del servizio idrico regionale, in particolare nella riduzione delle perdite, nella resilienza infrastrutturale e nella qualita delle acque.",
  stato: "Approvato",
  settore: "Infrastrutture ambientali e risorse idriche",
  sotto_settore: "Risorse idriche e acque reflue",
  categoria_intervento: "Corpi idrici: Miglioramento della qualita",
  tipo_intervento: "Efficientamento",
  data_inizio: "2025-09-15",
  data_fine: "2032-09-15",
  localizzazione: "Via Messina Marine 592 - 90121, Palermo PA",
  location_lat: 38.1157,
  location_lon: 13.3615,
  nuts_code: "ITG12",
  nuts_label: "Palermo",
  nace_code: "E36.00",
  anno_attualizzazione: "2025",
  tasso_attualizzazione: "3,5",
  capex: "334000000",
  vita_utile: 20,
  opex_tasso: "2,8",
};

const OPEX_BENCHMARKS = {
  "Infrastrutture sociali":                         { min: 1.5, avg: 2.5, max: 3.5 },
  "Infrastrutture di trasporto":                    { min: 0.5, avg: 1.2, max: 2.0 },
  "Infrastrutture ambientali e risorse idriche":    { min: 1.5, avg: 2.8, max: 4.0 },
  "Attivita produttive, ricerca e impresa sociale": { min: 1.0, avg: 2.0, max: 3.0 },
  "Telecomunicazioni e tecnologie informatiche":    { min: 2.0, avg: 3.5, max: 5.0 },
};
const OPEX_BENCHMARK_DEFAULT = { min: 1.0, avg: 2.0, max: 4.0 };

const VITA_UTILE_BENCHMARKS = {
  "Infrastrutture sociali":                         { min: 20, avg: 35, max: 50 },
  "Infrastrutture di trasporto":                    { min: 30, avg: 50, max: 80 },
  "Infrastrutture ambientali e risorse idriche":    { min: 25, avg: 40, max: 60 },
  "Attivita produttive, ricerca e impresa sociale": { min: 10, avg: 20, max: 30 },
  "Telecomunicazioni e tecnologie informatiche":    { min:  5, avg: 10, max: 20 },
};
const VITA_UTILE_DEFAULT = { min: 15, avg: 25, max: 40 };

const STEPS = [
  { id: "nome", group: 0, sublabel: "Anagrafica" },
  { id: "descrizione", group: 0, sublabel: "Anagrafica" },
  { id: "stato", group: 0, sublabel: "Stato" },
  { id: "classificazione", group: 0, sublabel: "Classificazione intervento" },
  { id: "durata", group: 1, sublabel: "Durata del progetto" },
  { id: "localizzazione", group: 1, sublabel: "Localizzazione" },
  { id: "anno", group: 2, sublabel: "Anno di attualizzazione" },
  { id: "capex", group: 2, sublabel: "Capex" },
  { id: "opex", group: 2, sublabel: "Opex" },
  { id: "benefici", group: 2, sublabel: "Benefici ECBA" },
];

const GROUPS = [
  { label: "Profilazione", sublabels: ["Anagrafica", "Stato", "Classificazione intervento"] },
  { label: "Contesto operativo", sublabels: ["Durata del progetto", "Localizzazione"] },
  { label: "Parametri economici", sublabels: ["Anno di attualizzazione", "Capex", "Opex", "Benefici ECBA"] },
];

const ECBA_KPI_TEMPLATES = {
  "Infrastrutture sociali": [
    {
      group: "Accesso ai servizi",
      kpis: [
        { id: "utenti_diretti",   label: "Utenti diretti",                        unit: "n.",      estimateFn: (c) => Math.round(c.capex / 5000) },
        { id: "utenti_indiretti", label: "Utenti indiretti",                      unit: "n.",      estimateFn: (c) => Math.round(c.capex / 2000) },
        { id: "superficie",       label: "Superficie destinata ai servizi",       unit: "mq",      estimateFn: (c) => Math.round(c.capex / 1500) },
        { id: "posti",            label: "Posti disponibili",                     unit: "n.",      estimateFn: (c) => Math.round(c.capex / 8000) },
      ],
    },
    {
      group: "Impatto occupazionale",
      kpis: [
        { id: "fte_costruzione",  label: "FTE in fase di costruzione",            unit: "FTE",     estimateFn: (c) => Math.round(c.capex / 120000) },
        { id: "fte_operativi",    label: "FTE operativi (fase esercizio)",        unit: "FTE",     estimateFn: (c) => Math.round(c.capex / 400000) },
      ],
    },
    {
      group: "Valore sociale",
      kpis: [
        { id: "risp_costo",       label: "Riduzione costo servizi per utente",   unit: "€/anno",  estimateFn: () => 120 },
        { id: "ore_risparmio",    label: "Ore risparmiate per utente",           unit: "ore/anno", estimateFn: () => 24 },
      ],
    },
  ],
  "Infrastrutture di trasporto": [
    {
      group: "Mobilità e traffico",
      kpis: [
        { id: "veicoli_giorno",   label: "Veicoli/giorno stimati",               unit: "n.",      estimateFn: (c) => Math.round(c.capex / 30000) },
        { id: "riduzione_tempi",  label: "Riduzione tempi di percorrenza",       unit: "min",     estimateFn: () => 12 },
        { id: "km_migliorata",    label: "Km di viabilità migliorata",           unit: "km",      estimateFn: (c) => Math.round(c.capex / 1500000) },
      ],
    },
    {
      group: "Sicurezza e ambiente",
      kpis: [
        { id: "incidenti",        label: "Incidenti annui evitati",              unit: "n.",      estimateFn: (c) => Math.round(c.capex / 5000000) },
        { id: "co2_trasporto",    label: "Riduzione emissioni CO2",              unit: "ton/anno", estimateFn: (c) => Math.round(c.capex / 200000) },
      ],
    },
    {
      group: "Impatto economico",
      kpis: [
        { id: "risp_carburante",  label: "Risparmio carburante per veicolo",    unit: "€/km",    estimateFn: () => 0.08 },
        { id: "valore_tempo",     label: "Valore del tempo risparmiato",        unit: "€/ora",   estimateFn: () => 12.5 },
      ],
    },
  ],
  "Infrastrutture ambientali e risorse idriche": [
    {
      group: "Riduzione perdite idriche",
      kpis: [
        { id: "vol_acqua",        label: "Volume dell'acqua immessa",            unit: "mq3",     estimateFn: (c) => Math.round(c.capex * 1.97) },
        { id: "pct_perdite",      label: "Percentuale target perdite idriche",  unit: "%",       estimateFn: () => 34 },
        { id: "energia_acqua",    label: "Consumo energia elettrica per acqua sollevata", unit: "kw", estimateFn: () => 0.8015 },
        { id: "costo_energia",    label: "Costo energia elettrica",             unit: "€",       estimateFn: () => 0.16 },
      ],
    },
    {
      group: "Riduzione delle interruzioni del servizio idrico",
      kpis: [
        { id: "ore_interruzioni", label: "Ore di interruzione evitate",         unit: "ore",     estimateFn: () => 204.7 },
        { id: "ore_anno",         label: "Ore anno servizio idrico",            unit: "ore",     estimateFn: () => 8760 },
        { id: "pct_riduzione",    label: "Percentuale riduzione interruzioni",  unit: "%",       estimateFn: () => 35 },
      ],
    },
    {
      group: "Qualità ambientale",
      kpis: [
        { id: "co2_idrico",       label: "Riduzione emissioni CO2 per efficienza", unit: "ton/anno", estimateFn: (c) => Math.round(c.capex / 1000000) },
        { id: "risp_idrico",      label: "Risparmio idrico annuo",              unit: "mc/anno", estimateFn: (c) => Math.round(c.capex / 500) },
      ],
    },
  ],
  "Attivita produttive, ricerca e impresa sociale": [
    {
      group: "Impatto economico locale",
      kpis: [
        { id: "imprese",          label: "Imprese insediate",                   unit: "n.",      estimateFn: (c) => Math.round(c.capex / 500000) },
        { id: "nuovi_occupati",   label: "Nuovi occupati",                     unit: "FTE",     estimateFn: (c) => Math.round(c.capex / 80000) },
        { id: "valore_aggiunto",  label: "Valore aggiunto generato",           unit: "€/anno",  estimateFn: (c) => Math.round(c.capex * 0.12) },
      ],
    },
    {
      group: "Innovazione e ricerca",
      kpis: [
        { id: "brevetti",         label: "Brevetti depositati (stima)",        unit: "n./anno", estimateFn: (c) => Math.round(c.capex / 2000000) },
        { id: "spinoff",          label: "Spin-off e start-up attivate",       unit: "n.",      estimateFn: (c) => Math.round(c.capex / 1500000) },
      ],
    },
  ],
  "Telecomunicazioni e tecnologie informatiche": [
    {
      group: "Connettività",
      kpis: [
        { id: "unita_connesse",   label: "Abitazioni/unità connesse",          unit: "n.",      estimateFn: (c) => Math.round(c.capex / 1500) },
        { id: "speed_dl",         label: "Download speed media",               unit: "Mbps",    estimateFn: () => 1000 },
        { id: "speed_ul",         label: "Upload speed media",                 unit: "Mbps",    estimateFn: () => 300 },
      ],
    },
    {
      group: "Impatto digitale",
      kpis: [
        { id: "digital_divide",   label: "Riduzione digital divide",           unit: "%",       estimateFn: (c) => Math.min(80, Math.round(c.capex / 3000000)) },
        { id: "servizi_digitali", label: "Nuovi servizi digitali abilitati",   unit: "n.",      estimateFn: (c) => Math.round(c.capex / 1000000) },
        { id: "risp_utente",      label: "Risparmio annuo per utente connesso", unit: "€/anno", estimateFn: () => 180 },
      ],
    },
  ],
};

function buildDefaultKpi(settore, capex, projectYears) {
  const templates = ECBA_KPI_TEMPLATES[settore] ?? [];
  const kpi = {};
  templates.forEach(({ kpis }) => {
    kpis.forEach(({ id, estimateFn }) => {
      const stima = String(estimateFn({ settore, capex }));
      kpi[id] = { stima, anni: projectYears.reduce((acc, y) => { acc[y] = stima; return acc; }, {}) };
    });
  });
  return kpi;
}

function getSottosettori(settore) {
  return Object.keys(SETTORI_DATA[settore]?.sottosettori ?? {});
}

function getCategorie(settore, sotto) {
  return SETTORI_DATA[settore]?.sottosettori[sotto] ?? [];
}

function getAllCategorie() {
  return Object.entries(SETTORI_DATA).flatMap(([settore, settoreData]) =>
    Object.entries(settoreData.sottosettori).flatMap(([sotto_settore, categorie]) =>
      categorie.map((categoria) => ({
        settore,
        sotto_settore,
        categoria,
        nace_code: settoreData.nace,
      })),
    ),
  );
}


function digitsOnly(value) {
  return value.replace(/[^\d]/g, "");
}

function fmt(value) {
  const n = Number(value);
  return !value || Number.isNaN(n) ? value ?? "" : new Intl.NumberFormat("it-IT").format(n);
}

function normalizeRateInput(value) {
  const cleaned = value.replace(/[^\d.,]/g, "").replace(".", ",");
  const parts = cleaned.split(",");
  if (parts.length <= 1) return cleaned;
  return `${parts[0]},${parts.slice(1).join("")}`;
}

function normalizePercentInput(value) {
  const cleaned = value.replace(/[^\d.,]/g, "").replace(".", ",");
  const parts = cleaned.split(",");
  const normalized = parts.length <= 1 ? cleaned : `${parts[0]},${parts.slice(1).join("")}`;
  const numeric = Number(normalized.replace(",", "."));
  if (Number.isNaN(numeric)) return normalized;
  return numeric > 100 ? "100" : normalized;
}

function yearRangeFromDates(startDate, endDate) {
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  if (Number.isNaN(startYear) || Number.isNaN(endYear)) return [];
  const from = Math.min(startYear, endYear);
  const to = Math.max(startYear, endYear);
  return Array.from({ length: to - from + 1 }, (_, index) => String(from + index));
}

function buildCapexDistribution(years, existing = {}) {
  if (!years.length) return {};
  const evenShare = (100 / years.length).toFixed(1).replace(".0", "");
  return years.reduce((acc, year) => {
    acc[year] = existing[year] ?? evenShare;
    return acc;
  }, {});
}

function sumPercentageValues(distribution, years) {
  return years.reduce((total, year) => total + (Number(String(distribution?.[year] ?? "").replace(",", ".")) || 0), 0);
}

function percentageToAmount(baseAmount, percentValue) {
  const base = Number(String(baseAmount ?? "").replace(/\./g, "").replace(",", ".")) || 0;
  const percent = Number(String(percentValue ?? "").replace(",", ".")) || 0;
  return (base * percent) / 100;
}

function isDirty(a, b) {
  return JSON.stringify(a) !== JSON.stringify(b);
}

function buildDraft(project) {
  const conf = project.configurazione ?? {};
  const settore = conf.settore || "";
  const sottosettori = getSottosettori(settore);
  const sotto = settore && sottosettori.includes(conf.sotto_settore) ? conf.sotto_settore : "";
  const categorie = getCategorie(settore, sotto);
  const categoria = sotto && categorie.includes(conf.categoria_intervento) ? conf.categoria_intervento : "";

  return {
    nome: project.nome ?? "",
    cup: project.cup ?? "",
    descrizione: project.descrizione ?? "",
    stato: project.stato || "",
    settore,
    nace_code: conf.nace_code || SETTORI_DATA[settore]?.nace || "",
    sotto_settore: sotto,
    categoria_intervento: categoria,
    tipo_intervento: TIPI.includes(conf.tipo_intervento) ? conf.tipo_intervento : "",
    data_inizio: conf.data_inizio || "",
    data_fine: conf.data_fine || "",
    localizzazione: conf.localizzazione ?? "",
    location_lat: conf.lat ?? null,
    location_lon: conf.lon ?? null,
    nuts_code: conf.nuts_code ?? "",
    nuts_label: conf.nuts_label ?? "",
    anno_attualizzazione: conf.anno_attualizzazione != null ? String(conf.anno_attualizzazione) : "",
    tasso_attualizzazione: conf.tasso_attualizzazione != null ? String(conf.tasso_attualizzazione) : "",
    capex_distribuzione_attiva: Boolean(conf.capex_distribuzione_attiva),
    capex_distribuzione: conf.capex_distribuzione ?? {},
    opex_tasso: conf.opex_tasso
      ? String(conf.opex_tasso).replace(".", ",")
      : "",
    opex_distribuzione_attiva: Boolean(conf.opex_distribuzione_attiva),
    opex_distribuzione: conf.opex_distribuzione ?? {},
    capex: String(conf.capex ?? ""),
    opex: String(conf.opex ?? ""),
    vita_utile: conf.vita_utile ?? "",
    benefici_kpi: conf.benefici_kpi ?? null,
    benefici_extra: conf.benefici_extra ?? [],
  };
}

function toProject(draft, base) {
  const start = new Date(draft.data_inizio);
  const end = new Date(draft.data_fine);
  const years = Math.max(1, end.getFullYear() - start.getFullYear());

  return {
    ...base,
    nome: draft.nome,
    cup: draft.cup,
    descrizione: draft.descrizione,
    stato: draft.stato,
    configurazione: {
      ...base.configurazione,
      settore: draft.settore,
      nace_code: draft.nace_code,
      sotto_settore: draft.sotto_settore,
      categoria_intervento: draft.categoria_intervento,
      tipo_intervento: draft.tipo_intervento,
      durata_progetto: `${years} anni`,
      localizzazione: draft.localizzazione,
      lat: draft.location_lat,
      lon: draft.location_lon,
      nuts_code: draft.nuts_code,
      nuts_label: draft.nuts_label,
      anno_attualizzazione: Number(draft.anno_attualizzazione),
      tasso_attualizzazione: Number(String(draft.tasso_attualizzazione).replace(",", ".")),
      capex_distribuzione_attiva: draft.capex_distribuzione_attiva,
      capex_distribuzione: draft.capex_distribuzione,
      opex_tasso: Number(String(draft.opex_tasso).replace(",", ".")),
      opex_distribuzione_attiva: draft.opex_distribuzione_attiva,
      opex_distribuzione: draft.opex_distribuzione,
      capex: Number(draft.capex),
      opex: Math.round((Number(draft.capex) * Number(String(draft.opex_tasso ?? "0").replace(",", "."))) / 100),
      vita_utile: Number(draft.vita_utile),
      benefici_kpi: draft.benefici_kpi,
      benefici_extra: draft.benefici_extra ?? [],
    },
  };
}

function Sidebar({ stepIdx }) {
  const currentGroup = STEPS[stepIdx].group;
  const lineFill = stepIdx / (STEPS.length - 1);

  return (
    <aside className="w-[320px] shrink-0 border-r border-[#ececec] bg-white px-6 py-6">
      <div className="relative">
        <div className="absolute bottom-3 left-[18px] top-7 w-[3px] bg-[#ececec]" />
        <div
          className="absolute bottom-3 left-[18px] top-7 w-[3px] origin-top bg-brand-violet transition-transform duration-500"
          style={{ transform: `scaleY(${lineFill})` }}
        />
        {GROUPS.map((group, groupIndex) => {
          const isDone = groupIndex < currentGroup;
          const isActive = groupIndex === currentGroup;

          return (
            <div key={group.label} className="relative mb-9 grid grid-cols-[38px_minmax(0,1fr)] gap-x-4">
              <div className={`relative z-[1] flex h-[38px] w-[38px] items-center justify-center rounded-full ${isActive || isDone ? "bg-brand-violet" : "bg-[#dcdce1]"}`}>
                {isDone ? <span className="text-[10px] font-bold text-white">OK</span> : isActive ? <span className="h-3 w-3 rounded-full bg-white" /> : null}
              </div>
              <div className="flex min-h-[38px] items-center overflow-visible pt-1">
                <h3 className={`min-w-0 text-[17px] font-bold leading-tight ${isActive ? "text-ink-900" : "text-ink-300"}`}>{group.label}</h3>
              </div>

              {isActive ? (
                <div className="col-start-2 mt-5 space-y-4">
                  {group.sublabels.map((sublabel) => {
                    const sublabelSteps = STEPS.filter((s) => s.sublabel === sublabel);

                    return (
                      <div key={sublabel}>
                        <p className="mb-2 text-[12px] leading-tight text-ink-900">{sublabel}</p>
                        <div className="flex gap-1">
                          {sublabelSteps.map((s) => {
                            const sIdx = STEPS.findIndex((step) => step.id === s.id);
                            const fill = sIdx < stepIdx ? 1 : sIdx === stepIdx ? 0.5 : 0;
                            return (
                              <div key={s.id} className="h-[6px] flex-1 overflow-hidden bg-[#e7e7ea]">
                                <div className="h-full bg-brand-violet transition-[width] duration-300" style={{ width: `${fill * 100}%` }} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function QuestionHeader({ title, description, type }) {
  return (
    <div className="mb-8">
      <h2 className="max-w-4xl text-[22px] font-bold leading-[1.2] text-ink-900">{title}</h2>
      {description ? <p className="mt-3 max-w-5xl text-[14px] leading-[1.5] text-ink-900">{description}</p> : null}
      {type ? <p className="mt-5 text-[14px] text-ink-900">{type}</p> : null}
    </div>
  );
}

function TextInput({ label, hint, value, onChange, placeholder, optional }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-baseline gap-2">
        <label className="text-[14px] font-semibold text-ink-900">{label}</label>
        {optional ? <span className="text-xs text-ink-400">(opzionale)</span> : null}
      </div>
      {hint ? <p className="mb-2 text-xs text-ink-400">{hint}</p> : null}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full border border-ink-200 bg-white px-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
      />
    </div>
  );
}

function RadioCards({ options, value, onChange, descriptions }) {
  return (
    <div className="max-w-3xl space-y-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex w-full items-start gap-4 bg-white px-5 py-5 text-left transition-colors ${value === option ? "border-2 border-brand-violet" : "border border-ink-200 hover:border-ink-300"}`}
        >
          <div className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 ${value === option ? "border-brand-violet" : "border-ink-400"}`}>
            {value === option ? <div className="h-3 w-3 rounded-full bg-brand-violet" /> : null}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-ink-900">{option}</p>
            {descriptions?.[option] ? <p className="mt-1 text-[13px] leading-[1.45] text-ink-700">{descriptions[option]}</p> : null}
          </div>
        </button>
      ))}
    </div>
  );
}

function RadioList({ options, value, onChange }) {
  return (
    <div className="max-w-3xl overflow-hidden border border-ink-100 bg-white">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex w-full items-center gap-3 px-5 py-4 text-left ${index < options.length - 1 ? "border-b border-ink-100" : ""} ${value === option ? "bg-brand-violet-soft" : "hover:bg-[#fafafa]"}`}
        >
          <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${value === option ? "border-brand-violet" : "border-ink-400"}`}>
            {value === option ? <div className="h-3 w-3 rounded-full bg-brand-violet" /> : null}
          </div>
          <span className="text-[14px] text-ink-900">{option}</span>
        </button>
      ))}
    </div>
  );
}

function CarouselCards({ options, value, onChange, cols = 5 }) {
  const [offset, setOffset] = useState(0);
  const pages = Math.max(1, Math.ceil(options.length / cols));
  const visible = options.slice(offset, offset + cols);
  const canPrev = offset > 0;
  const canNext = offset + cols < options.length;
  const currentPage = Math.floor(offset / cols);

  return (
    <div className="max-w-[980px]">
      <div className="mb-4 flex items-center justify-end gap-2 pr-3">
        {Array.from({ length: pages }).map((_, index) => (
          <span key={index} className={`h-1 ${index === currentPage ? "w-6 bg-brand-violet" : "w-4 bg-[#d8d8de]"}`} />
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => canPrev && setOffset((item) => item - 1)}
          className={`flex h-10 w-10 items-center justify-center text-[28px] leading-none ${canPrev ? "text-ink-300 hover:text-ink-700" : "cursor-default text-[#dddddf]"}`}
          aria-label="Scorri indietro"
        >
          &lsaquo;
        </button>
        <div className="grid flex-1 gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {visible.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`flex min-h-[160px] flex-col items-center justify-between bg-white px-4 py-5 text-center ${value === option ? "border-[4px] border-brand-violet" : "border border-white hover:border-ink-200"}`}
            >
              <span className="flex flex-1 items-center justify-center text-[14px] font-semibold leading-[1.35] text-ink-900">{option}</span>
              <div className={`mt-4 flex h-8 w-8 items-center justify-center rounded-full border-2 ${value === option ? "border-brand-violet" : "border-ink-500"}`}>
                {value === option ? <div className="h-4 w-4 rounded-full bg-brand-violet" /> : null}
              </div>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => canNext && setOffset((item) => item + 1)}
          className={`flex h-10 w-10 items-center justify-center text-[28px] leading-none ${canNext ? "text-brand-violet hover:text-brand-violet-dark" : "cursor-default text-[#dddddf]"}`}
          aria-label="Scorri avanti"
        >
          &rsaquo;
        </button>
      </div>
    </div>
  );
}

function ClassAccordion({ number, title, selectedLabel, isCompleted, onEdit, children }) {
  return (
    <div className={`overflow-hidden border bg-white ${isCompleted ? "border-ink-100" : "border-brand-violet/40"}`}>
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-violet text-[12px] font-bold text-white">
          {isCompleted ? "✓" : number}
        </span>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
          <div className="min-w-0">
            <p className={`text-[13px] ${isCompleted ? "text-ink-400" : "font-semibold text-ink-900"}`}>{title}</p>
            {isCompleted && selectedLabel ? (
              <p className="mt-0.5 truncate text-[15px] font-semibold text-ink-900">{selectedLabel}</p>
            ) : null}
          </div>
          {isCompleted ? (
            <button type="button" onClick={onEdit} className="shrink-0 text-[13px] font-medium text-brand-violet hover:underline">
              Modifica
            </button>
          ) : null}
        </div>
      </div>
      {!isCompleted ? (
        <div className="border-t border-[#ececf1] px-5 pb-5 pt-4">{children}</div>
      ) : null}
    </div>
  );
}

const MONTHS_IT = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const DAY_HEADERS_IT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const PICKER_YEARS = Array.from({ length: 21 }, (_, i) => 2020 + i);

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const days = [];
  for (let i = startOffset; i > 0; i--) {
    days.push({ date: new Date(year, month, 1 - i), current: false });
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), current: true });
  }
  let nextDay = 1;
  while (days.length < 42) {
    days.push({ date: new Date(year, month + 1, nextDay++), current: false });
  }
  return days;
}

function DatePickerField({ label, hint, value, onChange }) {
  const parsed = value ? new Date(value + "T00:00:00") : null;
  const [viewYear, setViewYear] = useState(() => parsed?.getFullYear() ?? 2025);
  const [viewMonth, setViewMonth] = useState(() => parsed?.getMonth() ?? 8);

  const grid = buildCalendarGrid(viewYear, viewMonth);

  function isSame(date) {
    return parsed &&
      date.getFullYear() === parsed.getFullYear() &&
      date.getMonth() === parsed.getMonth() &&
      date.getDate() === parsed.getDate();
  }

  function handleDayClick(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
    setViewMonth(date.getMonth());
    setViewYear(date.getFullYear());
  }

  const displayValue = parsed
    ? `${String(parsed.getDate()).padStart(2, "0")} / ${String(parsed.getMonth() + 1).padStart(2, "0")} / ${parsed.getFullYear()}`
    : "";

  return (
    <div className="border border-ink-100 bg-white p-5">
      <label className="mb-1 block text-[14px] font-semibold text-ink-900">{label}</label>
      {hint ? <p className="mb-3 text-xs text-ink-400">{hint}</p> : null}
      <div className="flex h-10 items-center border-b border-ink-300 text-[14px] text-ink-900">
        {displayValue || <span className="text-ink-300">gg / mm / aaaa</span>}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <select
          value={viewMonth}
          onChange={(e) => setViewMonth(Number(e.target.value))}
          className="flex-1 border border-ink-200 bg-white px-2 py-1.5 text-[13px] font-semibold text-ink-900 focus:border-brand-violet focus:outline-none"
        >
          {MONTHS_IT.map((name, i) => <option key={name} value={i}>{name}</option>)}
        </select>
        <select
          value={viewYear}
          onChange={(e) => setViewYear(Number(e.target.value))}
          className="w-[80px] border border-ink-200 bg-white px-2 py-1.5 text-[13px] font-semibold text-ink-900 focus:border-brand-violet focus:outline-none"
        >
          {PICKER_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div className="mt-3 grid grid-cols-7">
        {DAY_HEADERS_IT.map((h) => (
          <div key={h} className="py-2 text-center text-[11px] font-semibold text-ink-400">{h}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {grid.map(({ date, current }, i) => {
          const selected = isSame(date);
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleDayClick(date)}
              className={`flex h-9 w-full items-center justify-center text-[13px] transition-colors ${
                selected
                  ? "rounded-full bg-brand-violet font-semibold text-white"
                  : current
                  ? "text-ink-900 hover:rounded-full hover:bg-brand-violet-soft"
                  : "text-ink-300 hover:rounded-full hover:bg-[#f3f3f6]"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultCard({ item, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full px-4 py-4 text-left ${selected ? "bg-brand-violet-soft" : "hover:bg-[#fafafa]"}`}
    >
      <p className="text-[14px] font-semibold text-ink-900">{item.categoria}</p>
      <p className="mt-1 text-[12px] leading-[1.45] text-ink-500">
        {item.settore} <span className="mx-1">/</span> {item.sotto_settore}
      </p>
    </button>
  );
}

export function Wizard({ initialProject, onClose, onComplete }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [draft, setDraft] = useState(() => buildDraft(initialProject));
  const [categorySearch, setCategorySearch] = useState("");
  const [classificationMode, setClassificationMode] = useState("guided");
  const [classificationRevealLevel, setClassificationRevealLevel] = useState(() => {
    const conf = initialProject?.configurazione ?? {};
    const settore = conf.settore || "";
    if (!settore) return 1;
    if (!getSottosettori(settore).includes(conf.sotto_settore || "")) return 2;
    if (!getCategorie(settore, conf.sotto_settore).includes(conf.categoria_intervento || "")) return 3;
    return TIPI.includes(conf.tipo_intervento || "") ? 4 : 3;
  });
  const [annoRevealLevel, setAnnoRevealLevel] = useState(() =>
    (initialProject?.configurazione?.anno_attualizzazione != null) ? 1 : 0
  );
  const [opexRevealLevel, setOpexRevealLevel] = useState(0);
  const geocodeTimerRef = useRef(null);
  const initialDraft = useMemo(() => buildDraft(initialProject), [initialProject]);
  const step = STEPS[stepIdx];
  const allCategorie = useMemo(() => getAllCategorie(), []);

  function update(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function updateCapexDistribution(year, value) {
    setDraft((prev) => ({
      ...prev,
      capex_distribuzione: {
        ...prev.capex_distribuzione,
        [year]: normalizePercentInput(value),
      },
    }));
  }

  function updateOpexTasso(value) {
    const normalized = normalizeRateInput(value);
    setDraft((prev) => {
      const tasso = Number(normalized.replace(",", ".")) || 0;
      const capexNum = Number(prev.capex) || 0;
      return { ...prev, opex_tasso: normalized, opex: String(Math.round((capexNum * tasso) / 100) || "") };
    });
  }

  function adjustOpexTasso(delta) {
    const current = Number(String(draft.opex_tasso ?? "0").replace(",", "."));
    const next = Math.max(0, Math.round((current + delta) * 10) / 10);
    updateOpexTasso(String(next).replace(".", ","));
  }

  function updateOpexDistribution(year, value) {
    setDraft((prev) => ({
      ...prev,
      opex_distribuzione: { ...prev.opex_distribuzione, [year]: normalizeRateInput(value) },
    }));
  }

  function adjustOpexYear(year, delta) {
    const current = Number(String(draft.opex_distribuzione[year] ?? draft.opex_tasso ?? "0").replace(",", "."));
    const next = Math.max(0, Math.round((current + delta) * 10) / 10);
    updateOpexDistribution(year, String(next).replace(".", ","));
  }

  function adjustVitaUtile(delta) {
    const next = Math.max(5, Math.min(100, (Number(draft.vita_utile) || 20) + delta));
    update("vita_utile", next);
  }

  function updateBeneficiKpi(id, value) {
    setDraft((prev) => ({
      ...prev,
      benefici_kpi: {
        ...prev.benefici_kpi,
        [id]: { ...(prev.benefici_kpi?.[id] ?? {}), stima: value },
      },
    }));
  }

  function autoFillBenefici() {
    const capex = Number(draft.capex) || 0;
    setDraft((prev) => {
      const endYear = prev.data_fine ? new Date(prev.data_fine + "T00:00:00").getFullYear() + 1 : null;
      const years = endYear ? Array.from({ length: Number(prev.vita_utile) || 20 }, (_, i) => String(endYear + i)) : [];
      return { ...prev, benefici_kpi: buildDefaultKpi(prev.settore, capex, years) };
    });
  }

  function clearBenefici() {
    setDraft((prev) => {
      const templates = ECBA_KPI_TEMPLATES[prev.settore] ?? [];
      const cleared = {};
      templates.forEach(({ kpis }) => kpis.forEach(({ id }) => { cleared[id] = { stima: "", anni: {} }; }));
      return { ...prev, benefici_kpi: cleared };
    });
  }

  function addExtraBeneficio() {
    setDraft((prev) => ({
      ...prev,
      benefici_extra: [...(prev.benefici_extra ?? []), { id: `extra_${Date.now()}`, label: "", unit: "", stima: "" }],
    }));
  }

  function updateExtraBeneficio(id, field, value) {
    setDraft((prev) => ({
      ...prev,
      benefici_extra: (prev.benefici_extra ?? []).map((b) => b.id === id ? { ...b, [field]: value } : b),
    }));
  }

  function removeExtraBeneficio(id) {
    setDraft((prev) => ({
      ...prev,
      benefici_extra: (prev.benefici_extra ?? []).filter((b) => b.id !== id),
    }));
  }

  function adjustCapexYear(year, delta) {
    const current = Number(String(capexDistribution[year] ?? "0").replace(",", "."));
    const next = Math.max(0, Math.min(100, Math.round((current + delta) * 10) / 10));
    updateCapexDistribution(year, String(next));
  }

  function handleSettoreChange(settore) {
    const nace = SETTORI_DATA[settore]?.nace ?? "";
    setClassificationRevealLevel(2);
    setDraft((prev) => ({ ...prev, settore, nace_code: nace, sotto_settore: "", categoria_intervento: "", tipo_intervento: "" }));
  }

  function handleSottosettoreChange(sotto_settore) {
    setClassificationRevealLevel(3);
    setDraft((prev) => ({ ...prev, sotto_settore, categoria_intervento: "", tipo_intervento: "" }));
  }

  function handleCategoriaChange(categoria_intervento) {
    setClassificationRevealLevel(4);
    setDraft((prev) => ({ ...prev, categoria_intervento, tipo_intervento: "" }));
  }

  function handleCategoryDirectSelect(option) {
    setClassificationRevealLevel(4);
    setDraft((prev) => ({
      ...prev,
      settore: option.settore,
      nace_code: option.nace_code,
      sotto_settore: option.sotto_settore,
      categoria_intervento: option.categoria,
      tipo_intervento: "",
    }));
    setCategorySearch("");
  }

  function handleEditSettore() {
    setClassificationRevealLevel(1);
    setDraft((prev) => ({ ...prev, settore: "", nace_code: "", sotto_settore: "", categoria_intervento: "", tipo_intervento: "" }));
  }

  function handleEditSottosettore() {
    setClassificationRevealLevel(2);
    setDraft((prev) => ({ ...prev, sotto_settore: "", categoria_intervento: "", tipo_intervento: "" }));
  }

  function handleEditCategoria() {
    setClassificationRevealLevel(3);
    setDraft((prev) => ({ ...prev, categoria_intervento: "", tipo_intervento: "" }));
  }

  function handleAddressChange(value) {
    update("localizzazione", value);
    clearTimeout(geocodeTimerRef.current);
    geocodeTimerRef.current = setTimeout(() => {
      const result = geocodeAddress(value);
      if (result) {
        setDraft((prev) => ({
          ...prev,
          location_lat: result.lat,
          location_lon: result.lon,
          nuts_code: result.nuts_code,
          nuts_label: result.nuts_label,
        }));
      }
    }, 500);
  }

  function handleMapClick(lat, lon) {
    const geo = findNearest(lat, lon);
    setDraft((prev) => ({
      ...prev,
      location_lat: Math.round(lat * 10000) / 10000,
      location_lon: Math.round(lon * 10000) / 10000,
      nuts_code: geo.nuts_code,
      nuts_label: geo.nuts_label,
      localizzazione: geo.nuts_label,
    }));
  }

  function autoFillCurrentStep() {
    switch (step.id) {
      case "nome":
        setDraft((prev) => ({ ...prev, nome: DEMO_AUTOFILL.nome, cup: DEMO_AUTOFILL.cup }));
        break;
      case "descrizione":
        update("descrizione", DEMO_AUTOFILL.descrizione);
        break;
      case "stato":
        update("stato", DEMO_AUTOFILL.stato);
        break;
      case "classificazione":
        setClassificationMode("guided");
        setClassificationRevealLevel(4);
        setDraft((prev) => ({
          ...prev,
          settore: DEMO_AUTOFILL.settore,
          nace_code: DEMO_AUTOFILL.nace_code,
          sotto_settore: DEMO_AUTOFILL.sotto_settore,
          categoria_intervento: DEMO_AUTOFILL.categoria_intervento,
          tipo_intervento: DEMO_AUTOFILL.tipo_intervento,
        }));
        break;
      case "durata":
        setDraft((prev) => ({
          ...prev,
          data_inizio: DEMO_AUTOFILL.data_inizio,
          data_fine: DEMO_AUTOFILL.data_fine,
        }));
        break;
      case "localizzazione":
        setDraft((prev) => ({
          ...prev,
          localizzazione: DEMO_AUTOFILL.localizzazione,
          location_lat: DEMO_AUTOFILL.location_lat,
          location_lon: DEMO_AUTOFILL.location_lon,
          nuts_code: DEMO_AUTOFILL.nuts_code,
          nuts_label: DEMO_AUTOFILL.nuts_label,
        }));
        break;
      case "anno":
        setAnnoRevealLevel(1);
        setDraft((prev) => ({
          ...prev,
          anno_attualizzazione: DEMO_AUTOFILL.anno_attualizzazione,
          tasso_attualizzazione: DEMO_AUTOFILL.tasso_attualizzazione,
        }));
        break;
      case "capex":
        setDraft((prev) => ({
          ...prev,
          capex: DEMO_AUTOFILL.capex,
          capex_distribuzione_attiva: false,
          capex_distribuzione: {},
        }));
        break;
      case "opex":
        setOpexRevealLevel(1);
        setDraft((prev) => ({
          ...prev,
          vita_utile: DEMO_AUTOFILL.vita_utile,
          opex_tasso: DEMO_AUTOFILL.opex_tasso,
          opex_distribuzione_attiva: false,
          opex_distribuzione: {},
        }));
        break;
      case "benefici":
        autoFillBenefici();
        break;
      default:
        break;
    }
  }

  function handleNext() {
    if (!canProceed) return;
    if (stepIdx === STEPS.length - 1) {
      onComplete(toProject(draft, initialProject));
      return;
    }
    const nextStep = STEPS[stepIdx + 1];
    if (nextStep?.id === "benefici" && draft.benefici_kpi === null) {
      setDraft((prev) => {
        const capex = Number(prev.capex) || 0;
        const endYear = prev.data_fine ? new Date(prev.data_fine + "T00:00:00").getFullYear() + 1 : null;
        const years = endYear ? Array.from({ length: Number(prev.vita_utile) || 20 }, (_, i) => String(endYear + i)) : [];
        return { ...prev, benefici_kpi: buildDefaultKpi(prev.settore, capex, years) };
      });
    }
    setStepIdx((value) => value + 1);
  }

  function handleBack() {
    if (stepIdx === 0) {
      onClose();
      return;
    }
    setStepIdx((value) => value - 1);
  }

  const mapPosition = draft.location_lat != null ? { lat: draft.location_lat, lon: draft.location_lon } : null;
  const sottosettori = getSottosettori(draft.settore);
  const categorie = getCategorie(draft.settore, draft.sotto_settore);
  const projectYears = useMemo(() => yearRangeFromDates(draft.data_inizio, draft.data_fine), [draft.data_fine, draft.data_inizio]);
  const capexDistribution = buildCapexDistribution(projectYears, draft.capex_distribuzione);
  const opexDistribution = projectYears.reduce((acc, year) => { acc[year] = draft.opex_distribuzione[year] ?? draft.opex_tasso ?? ""; return acc; }, {});
  const capexDistributionTotal = sumPercentageValues(capexDistribution, projectYears);
  const capexYearlyAmounts = projectYears.reduce((acc, year) => { acc[year] = percentageToAmount(draft.capex, capexDistribution[year]); return acc; }, {});
  const opexYearlyAmounts = projectYears.reduce((acc, year) => {
    const rate = draft.opex_distribuzione_attiva && draft.opex_distribuzione[year]
      ? Number(String(draft.opex_distribuzione[year]).replace(",", "."))
      : Number(String(draft.opex_tasso ?? "0").replace(",", "."));
    acc[year] = percentageToAmount(draft.capex, rate);
    return acc;
  }, {});
  const opexAnnualAmount = useMemo(
    () => percentageToAmount(draft.capex, Number(String(draft.opex_tasso ?? "0").replace(",", "."))),
    [draft.capex, draft.opex_tasso],
  );
  const filteredCategorie = useMemo(() => {
    const term = categorySearch.trim().toLowerCase();
    if (term.length < 2) return [];
    return allCategorie
      .filter((item) => `${item.categoria} ${item.sotto_settore} ${item.settore}`.toLowerCase().includes(term))
      .slice(0, 8);
  }, [allCategorie, categorySearch]);
  const opexBenchmark = useMemo(() => OPEX_BENCHMARKS[draft.settore] ?? OPEX_BENCHMARK_DEFAULT, [draft.settore]);
  const vitaUtileBenchmark = useMemo(() => VITA_UTILE_BENCHMARKS[draft.settore] ?? VITA_UTILE_DEFAULT, [draft.settore]);
  const opexStartYear = useMemo(() => {
    if (!draft.data_fine) return null;
    return new Date(draft.data_fine + "T00:00:00").getFullYear() + 1;
  }, [draft.data_fine]);
  const opexEndYear = useMemo(() => {
    if (!opexStartYear || !draft.vita_utile) return null;
    return opexStartYear + Number(draft.vita_utile) - 1;
  }, [opexStartYear, draft.vita_utile]);
  const opexTotale = useMemo(() => opexAnnualAmount * Number(draft.vita_utile), [opexAnnualAmount, draft.vita_utile]);

  const beneficiTemplates = useMemo(() => ECBA_KPI_TEMPLATES[draft.settore] ?? [], [draft.settore]);
  const beneficiTotalCount = useMemo(() => beneficiTemplates.reduce((acc, { kpis }) => acc + kpis.length, 0), [beneficiTemplates]);
  const beneficiFilledCount = useMemo(() => {
    if (!draft.benefici_kpi) return 0;
    return beneficiTemplates.reduce((acc, { kpis }) => acc + kpis.filter(({ id }) => {
      const v = draft.benefici_kpi[id]?.stima;
      return v != null && v !== "";
    }).length, 0);
  }, [beneficiTemplates, draft.benefici_kpi]);

  const canProceed = (() => {
    switch (step.id) {
      case "nome":
        return draft.nome.trim().length > 0;
      case "descrizione":
        return draft.descrizione.trim().length > 10;
      case "stato":
        return !!draft.stato;
      case "classificazione":
        return classificationRevealLevel >= 4 && !!draft.settore && !!draft.sotto_settore && !!draft.categoria_intervento && !!draft.tipo_intervento;
      case "durata":
        return !!draft.data_inizio && !!draft.data_fine;
      case "localizzazione":
        return draft.localizzazione.trim().length > 2;
      case "anno":
        return annoRevealLevel >= 1 && !!draft.anno_attualizzazione && !!draft.tasso_attualizzazione.trim();
      case "capex":
        return draft.capex.trim().length > 0 && (!draft.capex_distribuzione_attiva || Math.abs(capexDistributionTotal - 100) < 0.001);
      case "opex":
        return !!draft.vita_utile && draft.opex_tasso.trim().length > 0;
      case "benefici":
        return draft.benefici_kpi !== null;
      default:
        return false;
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg-page">
      <div className="h-[3px] flex-shrink-0 bg-accent-lime" />
      <div className="flex h-16 flex-shrink-0 items-center justify-end border-b border-ink-100 bg-white px-8">
        <button type="button" onClick={() => (isDirty(initialDraft, draft) ? onClose() : onClose())} className="flex items-center gap-2 text-[14px] font-semibold text-brand-violet">
          Chiudi e torna alle valutazioni
          <span className="text-[20px] leading-none">&times;</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar stepIdx={stepIdx} />

        <div className="flex-1 overflow-y-auto bg-[#f3f3f3]">
          <div className="px-8 py-8">
            <div className="mb-5 flex justify-end">
              <button
                type="button"
                onClick={autoFillCurrentStep}
                className="border border-brand-violet bg-white px-4 py-2 text-[13px] font-semibold text-brand-violet transition-colors hover:bg-brand-violet-soft"
              >
                {STEP_AUTOFILL_LABEL}
              </button>
            </div>
            {step.id === "nome" ? (
              <>
                <QuestionHeader
                  title="Per prima cosa: che NOME vorresti dare al tuo progetto?"
                  description="Ti consigliamo di dare al tuo progetto un nome semplice, riconoscibile, che sia di facile identificazione anche per i tuoi collaboratori. Se ne sei gia in possesso, ma non e obbligatorio integrarlo, indica il CUP."
                />
                <div className="max-w-3xl border border-ink-100 bg-white p-6">
                  <TextInput label="Nome del progetto" hint="Lunghezza massima 70 caratteri" value={draft.nome} onChange={(value) => update("nome", value.slice(0, 70))} placeholder="Inserisci il nome del progetto" />
                  <TextInput label="Identificativo CUP" hint="Valore alfanumerico" value={draft.cup} onChange={(value) => update("cup", value)} placeholder="Inserisci il codice CUP" optional />
                </div>
              </>
            ) : null}

            {step.id === "descrizione" ? (
              <>
                <QuestionHeader
                  title="Fornisci ora una DESCRIZIONE del progetto"
                  description="Inserisci in poche righe le finalita, gli ambiti di intervento e gli obiettivi del progetto. Queste informazioni sono utili per contestualizzare la proposta e attivare i percorsi di valutazione piu appropriati."
                />
                <div className="max-w-3xl border border-ink-100 bg-white p-6">
                  <div className="mb-2 flex items-baseline justify-between">
                    <label className="text-[14px] font-semibold text-ink-900">Descrizione del progetto</label>
                    <span className="text-xs text-ink-400">{draft.descrizione.length}/699 caratteri</span>
                  </div>
                  <p className="mb-2 text-xs text-ink-400">Lunghezza massima 699 caratteri</p>
                  <textarea
                    value={draft.descrizione}
                    onChange={(event) => update("descrizione", event.target.value.slice(0, 699))}
                    rows={7}
                    placeholder="Inserisci la descrizione del progetto"
                    className="w-full border border-ink-200 bg-white px-3 py-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                  />
                </div>
              </>
            ) : null}

            {step.id === "stato" ? (
              <>
                <QuestionHeader title="Qual e lo STATO del progetto?" description="Indica la fase in cui si trova il tuo progetto." type="Risposta singola" />
                <RadioCards options={STATI} value={draft.stato} onChange={(value) => update("stato", value)} descriptions={STATO_DESCRIPTIONS} />
              </>
            ) : null}

            {step.id === "classificazione" ? (
              <>
                <QuestionHeader
                  title="Classifica il tipo di intervento"
                  description="Seleziona settore, sotto-settore e categoria navigando passo per passo, oppure cerca direttamente la categoria di intervento."
                />

                {/* Mode toggle */}
                <div className="mb-5 flex max-w-md overflow-hidden border border-ink-200">
                  <button
                    type="button"
                    onClick={() => setClassificationMode("guided")}
                    className={`flex-1 py-3 text-[13px] font-semibold transition-colors ${classificationMode === "guided" ? "bg-brand-violet text-white" : "bg-white text-ink-700 hover:bg-[#fafafa]"}`}
                  >
                    Percorso guidato
                  </button>
                  <div className="w-px bg-ink-200" />
                  <button
                    type="button"
                    onClick={() => setClassificationMode("search")}
                    className={`flex-1 py-3 text-[13px] font-semibold transition-colors ${classificationMode === "search" ? "bg-brand-violet text-white" : "bg-white text-ink-700 hover:bg-[#fafafa]"}`}
                  >
                    Cerca categoria
                  </button>
                </div>

                <div className="max-w-2xl space-y-3">
                  {classificationMode === "guided" ? (
                    <>
                      {/* Step 1: Settore */}
                      <ClassAccordion
                        number="1"
                        title="Settore"
                        selectedLabel={draft.settore}
                        isCompleted={classificationRevealLevel > 1}
                        onEdit={handleEditSettore}
                      >
                        <RadioList options={SETTORI} value={draft.settore} onChange={handleSettoreChange} />
                      </ClassAccordion>

                      {/* Step 2: Sotto-settore */}
                      {classificationRevealLevel >= 2 ? (
                        <ClassAccordion
                          number="2"
                          title="Sotto-settore"
                          selectedLabel={draft.sotto_settore}
                          isCompleted={classificationRevealLevel > 2}
                          onEdit={handleEditSottosettore}
                        >
                          <RadioList options={sottosettori} value={draft.sotto_settore} onChange={handleSottosettoreChange} />
                        </ClassAccordion>
                      ) : null}

                      {/* Step 3: Categoria */}
                      {classificationRevealLevel >= 3 ? (
                        <ClassAccordion
                          number="3"
                          title="Categoria di intervento"
                          selectedLabel={draft.categoria_intervento}
                          isCompleted={classificationRevealLevel > 3}
                          onEdit={handleEditCategoria}
                        >
                          <RadioList options={categorie} value={draft.categoria_intervento} onChange={handleCategoriaChange} />
                        </ClassAccordion>
                      ) : null}
                    </>
                  ) : (
                    /* Search mode */
                    <div className="border border-ink-100 bg-white p-5">
                      <input
                        value={categorySearch}
                        onChange={(event) => setCategorySearch(event.target.value)}
                        placeholder="Cerca categoria di intervento (min. 2 lettere)"
                        className="h-11 w-full border border-ink-200 bg-white px-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                      />
                      {categorySearch.trim().length >= 2 ? (
                        <div className="mt-3 max-h-[320px] overflow-y-auto border border-ink-100">
                          {filteredCategorie.length > 0 ? filteredCategorie.map((item, index) => {
                            const selected =
                              draft.settore === item.settore &&
                              draft.sotto_settore === item.sotto_settore &&
                              draft.categoria_intervento === item.categoria;
                            return (
                              <div key={`${item.settore}-${item.sotto_settore}-${item.categoria}`} className={index < filteredCategorie.length - 1 ? "border-b border-ink-100" : ""}>
                                <SearchResultCard item={item} selected={selected} onSelect={() => handleCategoryDirectSelect(item)} />
                              </div>
                            );
                          }) : (
                            <div className="px-4 py-5 text-[13px] text-ink-500">Nessuna categoria trovata.</div>
                          )}
                        </div>
                      ) : null}
                      {draft.categoria_intervento ? (
                        <div className="mt-4 flex items-start justify-between gap-3 rounded-sm border border-brand-violet/25 bg-brand-violet-soft px-4 py-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Selezionata</p>
                            <p className="mt-0.5 text-[14px] font-semibold text-ink-900">{draft.categoria_intervento}</p>
                            <p className="mt-0.5 text-[12px] text-ink-500">{draft.settore} / {draft.sotto_settore}</p>
                          </div>
                          <button type="button" onClick={() => { setDraft((p) => ({ ...p, categoria_intervento: "", tipo_intervento: "", settore: "", nace_code: "", sotto_settore: "" })); setClassificationRevealLevel(1); }} className="shrink-0 text-[13px] font-medium text-brand-violet hover:underline">
                            Rimuovi
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Tipo di intervento — shown after category is selected */}
                  {draft.categoria_intervento ? (
                    <div className="border border-ink-100 bg-white p-5">
                      <p className="mb-3 text-[14px] font-semibold text-ink-900">Tipo di intervento</p>
                      <RadioList options={TIPI} value={draft.tipo_intervento} onChange={(value) => update("tipo_intervento", value)} />
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            {step.id === "durata" ? (
              <>
                <QuestionHeader
                  title="Perfetto, quale sara la DURATA del progetto?"
                  description="Indica il periodo previsto dalla fase di avvio lavori alla piena operativita. Questa informazione e importante per programmare correttamente le attivita, stimare i costi e valutare la sostenibilita nel tempo e i benefici nel progetto."
                />
                <div className="grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-2">
                  <DatePickerField
                    label="Data di inizio"
                    hint="Formato data gg/mm/aaaa"
                    value={draft.data_inizio}
                    onChange={(value) => update("data_inizio", value)}
                  />
                  <DatePickerField
                    label="Data di fine"
                    hint="Formato data gg/mm/aaaa"
                    value={draft.data_fine}
                    onChange={(value) => update("data_fine", value)}
                  />
                </div>
              </>
            ) : null}

            {step.id === "localizzazione" ? (
              <>
                <QuestionHeader
                  title="Dove avra LUOGO il tuo progetto?"
                  description="Inserisci l'area geografica in cui sara realizzato il progetto. Questa informazione consente di collegare il progetto al territorio, attivare dati socio-territoriali rilevanti e fornire analisi contestualizzate su impatti ambientali, sociali ed economici."
                />
                <p className="mb-4 text-[14px] font-semibold text-ink-900">Inserisci un indirizzo o una localita, coerentemente col territorio di riferimento.</p>
                <div className="grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
                  <div className="border border-ink-100 bg-white p-5">
                    <label className="mb-2 block text-[14px] font-semibold text-ink-900">Indirizzo o localita</label>
                    <input
                      value={draft.localizzazione}
                      onChange={(event) => handleAddressChange(event.target.value)}
                      placeholder="Inserisci un indirizzo o localita"
                      className="h-11 w-full border border-ink-200 bg-white px-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                    />
                    {draft.nuts_code ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">NUTS rilevato</span>
                        <span className="border border-brand-violet/20 bg-brand-violet-soft px-2 py-1 text-xs font-mono text-brand-violet">
                          {draft.nuts_code} - {draft.nuts_label}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="min-h-[280px] overflow-hidden border border-ink-100 bg-white">
                    <LeafletMap position={mapPosition} onMapClick={handleMapClick} />
                  </div>
                </div>
              </>
            ) : null}

            {step.id === "anno" ? (
              <>
                <QuestionHeader
                  title="Anno di avvio e tasso di sconto sociale"
                  description="Seleziona l'anno di inizio dei lavori: rappresenta il punto di riferimento temporale dell'analisi. Successivamente potrai confermare o modificare il tasso di sconto sociale."
                  type="Risposta singola"
                />
                <div className="max-w-4xl space-y-3">

                  {/* ── Section 1: Anno di inizio lavori ── */}
                  <ClassAccordion
                    number="1"
                    title="Anno di inizio lavori"
                    selectedLabel={annoRevealLevel > 0 ? `${draft.anno_attualizzazione}` : null}
                    isCompleted={annoRevealLevel > 0}
                    onEdit={() => setAnnoRevealLevel(0)}
                  >
                    <p className="mb-4 text-[13px] leading-[1.5] text-ink-600">
                      L'anno di inizio lavori è il punto di partenza dell'analisi economica. Da questo momento costi e benefici futuri vengono riportati a un riferimento temporale coerente e confrontabile.
                    </p>
                    <CarouselCards
                      options={ANNI}
                      value={draft.anno_attualizzazione}
                      onChange={(value) => update("anno_attualizzazione", value)}
                      cols={5}
                    />
                    <button
                      type="button"
                      disabled={!draft.anno_attualizzazione}
                      onClick={() => setAnnoRevealLevel(1)}
                      className={`mt-5 flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold transition-colors ${draft.anno_attualizzazione ? "bg-brand-violet text-white hover:bg-brand-violet-dark" : "cursor-not-allowed bg-ink-100 text-ink-300"}`}
                    >
                      Conferma anno di inizio lavori
                      <span className="text-[16px] leading-none">→</span>
                    </button>
                  </ClassAccordion>

                  {/* ── Section 2: Tasso di sconto sociale ── */}
                  {annoRevealLevel >= 1 ? (
                    <div className="overflow-hidden border border-ink-100 bg-white">
                      <div className="flex items-center gap-3 bg-[#2f2f2f] px-5 py-3 text-white">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-violet text-[12px] font-bold">2</span>
                        <p className="text-[14px] font-semibold">Tasso di sconto sociale</p>
                      </div>
                      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                        <div>
                          <p className="mb-3 text-[13px] leading-[1.5] text-ink-600">
                            Il tasso di sconto sociale misura quanto la collettività preferisce i benefici presenti rispetto a quelli futuri. Valori più bassi danno maggiore peso alle generazioni future.
                          </p>
                          <div className="mb-5 flex gap-2">
                            {[
                              { label: "Prudente", value: "5,0" },
                              { label: "Standard UE", value: "3,5" },
                              { label: "Lungo periodo", value: "2,0" },
                            ].map(({ label, value }) => {
                              const isActive = draft.tasso_attualizzazione === value;
                              return (
                                <button key={label} type="button"
                                  onClick={() => update("tasso_attualizzazione", value)}
                                  className={`flex-1 border px-3 py-2.5 text-center transition-colors ${isActive ? "border-brand-violet bg-brand-violet text-white" : "border-ink-200 bg-white text-ink-700 hover:border-ink-400"}`}
                                >
                                  <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{label}</p>
                                  <p className="mt-0.5 text-[17px] font-bold">{value}%</p>
                                </button>
                              );
                            })}
                          </div>
                          <p className="mb-2 text-[13px] font-semibold text-ink-900">Oppure inserisci manualmente</p>
                          <div className="relative max-w-[200px]">
                            <input
                              value={draft.tasso_attualizzazione}
                              onChange={(event) => update("tasso_attualizzazione", normalizeRateInput(event.target.value))}
                              placeholder={TASSO_DEFAULT}
                              className="h-11 w-full border border-ink-200 bg-white px-3 pr-10 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-ink-500">%</span>
                          </div>
                        </div>
                        <aside className="h-fit border border-[#e8e8ed] bg-[#f7f7fa] p-5">
                          <p className="text-[13px] font-semibold text-ink-900">Guida al tasso</p>
                          <div className="mt-3 space-y-2 text-[13px] text-ink-800">
                            <p><strong>2,0%</strong> — scenari di lungo periodo, forte rilevanza pubblica o ambientale</p>
                            <p><strong>3,5%</strong> — valore di riferimento standard UE (raccomandato)</p>
                            <p><strong>5,0%</strong> — ipotesi prudente, condizioni finanziarie restrittive</p>
                          </div>
                          <div className="mt-4 rounded-sm bg-white px-3 py-2.5 text-[11px] leading-[1.55] text-ink-600">
                            Un tasso più alto riduce il peso dei benefici lontani nel tempo. Usa il 3,5% come punto di partenza per analisi standard in linea con le linee guida della Commissione Europea.
                          </div>
                        </aside>
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            {step.id === "capex" ? (
              <>
                <QuestionHeader title="Qual e il CAPEX?" description="Inserisci l'importo complessivo degli investimenti previsti, spese in conto capitale, per la realizzazione del progetto." />
                <div className="max-w-5xl overflow-hidden border border-ink-100 bg-white">
                  <div className="p-5">
                    <label className="mb-2 block text-[14px] font-semibold text-ink-900">CAPEX complessivo (EUR)</label>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <input
                        value={fmt(draft.capex)}
                        onChange={(event) => update("capex", digitsOnly(event.target.value))}
                        placeholder="es. 10.000.000"
                        className="h-11 flex-1 border border-ink-200 bg-white px-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                      />
                      {draft.capex ? (
                        <div className="flex items-start gap-2 rounded border border-[#e8e8ed] bg-[#f7f7fa] px-4 py-2.5 sm:max-w-[280px]">
                          <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                          </svg>
                          <p className="text-[11px] leading-[1.5] text-ink-600">
                            Il valore preimpostato è basato sulle informazioni disponibili per la <strong>categoria di intervento</strong> selezionata e la dimensione tipica degli interventi di questo tipo.
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-6 border-t border-[#ececf1] pt-5">
                      <label className="flex items-center gap-3 text-[14px] font-semibold text-ink-900">
                        <input
                          type="checkbox"
                          checked={draft.capex_distribuzione_attiva}
                          onChange={(event) => update("capex_distribuzione_attiva", event.target.checked)}
                          className="h-4 w-4 accent-[#5b19d6]"
                        />
                        Distribuisci il CAPEX per anno
                      </label>
                      <p className="mt-2 text-[12px] leading-[1.5] text-ink-500">
                        Se attivi questa opzione, puoi specificare la quota percentuale del CAPEX da imputare a ciascun anno del progetto.
                      </p>

                      {draft.capex_distribuzione_attiva ? (
                        <div className="mt-4 overflow-hidden border border-[#e8e8ed]">
                          <div className="grid bg-[#f7f7fa] px-4 py-2.5 text-[12px] font-semibold text-ink-600 md:grid-cols-[80px_minmax(0,160px)_minmax(0,1fr)]">
                            <span>Anno</span><span>Quota %</span><span>Importo</span>
                          </div>
                          <div className="divide-y divide-[#ececf1] bg-white">
                            {projectYears.map((year) => (
                              <div key={year} className="grid items-center md:grid-cols-[80px_minmax(0,160px)_minmax(0,1fr)]">
                                <span className="px-4 py-3 text-[14px] font-semibold text-ink-900">{year}</span>
                                <div className="flex items-center gap-1 px-4 py-3">
                                  <button type="button" onClick={() => adjustCapexYear(year, -0.5)} className="flex h-8 w-8 shrink-0 items-center justify-center border border-ink-200 text-[16px] font-bold text-ink-600 hover:border-ink-400 hover:bg-[#f5f5f7]">−</button>
                                  <div className="flex h-8 items-center gap-1 border border-ink-200 bg-white px-2 focus-within:border-brand-violet">
                                    <input
                                      value={capexDistribution[year] ?? ""}
                                      onChange={(event) => updateCapexDistribution(year, event.target.value)}
                                      className="w-[44px] bg-transparent text-right text-[13px] font-semibold text-ink-900 focus:outline-none"
                                    />
                                    <span className="text-[12px] text-ink-400">%</span>
                                  </div>
                                  <button type="button" onClick={() => adjustCapexYear(year, 0.5)} className="flex h-8 w-8 shrink-0 items-center justify-center border border-ink-200 text-[16px] font-bold text-brand-violet hover:border-brand-violet hover:bg-brand-violet-soft">+</button>
                                </div>
                                <div className="px-4 py-3 text-[13px] text-ink-700">
                                  {fmt(String(Math.round(capexYearlyAmounts[year] || 0)))} €
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between border-t border-[#ececf1] bg-[#fcfcfd] px-4 py-3 text-[13px]">
                            <span className="text-ink-700">Totale distribuzione</span>
                            <span className={`font-semibold ${Math.abs(capexDistributionTotal - 100) < 0.001 ? "text-ink-900" : "text-[#c4002f]"}`}>
                              {capexDistributionTotal.toFixed(1).replace(".0", "")}%
                            </span>
                          </div>
                          {Math.abs(capexDistributionTotal - 100) >= 0.001 ? (
                            <div className="border-t border-[#ececf1] bg-[#fff5f7] px-4 py-3 text-[12px] text-[#b0002a]">
                              La distribuzione annuale del CAPEX deve sommare esattamente a 100% per poter proseguire.
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {step.id === "opex" ? (
              <>
                <QuestionHeader
                  title="Qual è l'OPEX?"
                  description="Prima definisci la vita utile del progetto, poi configura il tasso di costo operativo annuale."
                />
                <div className="grid max-w-5xl gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                  {/* Main panel — two accordion sections */}
                  <div className="space-y-3">

                    {/* ── Section 1: Vita utile ── */}
                    <ClassAccordion
                      number="1"
                      title="Vita utile del progetto"
                      selectedLabel={opexRevealLevel > 0 ? `${draft.vita_utile} anni` : null}
                      isCompleted={opexRevealLevel > 0}
                      onEdit={() => setOpexRevealLevel(0)}
                    >
                      <p className="mb-4 text-[13px] leading-[1.5] text-ink-600">
                        Indica per quanti anni il progetto sarà operativo dopo la fine dei lavori.
                        I valori di riferimento sono calcolati per <strong>{draft.settore || "il settore selezionato"}</strong>.
                      </p>

                      {/* Quick-select */}
                      <div className="mb-5 flex gap-2">
                        {[
                          { label: "Minima", value: vitaUtileBenchmark.min },
                          { label: "Media", value: vitaUtileBenchmark.avg },
                          { label: "Massima", value: vitaUtileBenchmark.max },
                        ].map(({ label, value }) => {
                          const isActive = Number(draft.vita_utile) === value;
                          return (
                            <button key={label} type="button" onClick={() => update("vita_utile", value)}
                              className={`flex-1 border px-3 py-2.5 text-center transition-colors ${isActive ? "border-brand-violet bg-brand-violet text-white" : "border-ink-200 bg-white text-ink-700 hover:border-ink-400"}`}
                            >
                              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{label}</p>
                              <p className="mt-0.5 text-[17px] font-bold">{value} anni</p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Manual input */}
                      <p className="mb-2 text-[13px] font-semibold text-ink-900">Oppure inserisci manualmente</p>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => adjustVitaUtile(-5)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink-200 bg-white text-[20px] font-bold text-ink-600 hover:border-ink-400 hover:bg-[#fafafa]">−</button>
                        <div className="relative w-[130px]">
                          <input
                            value={draft.vita_utile}
                            onChange={(e) => {
                              const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                              if (!Number.isNaN(n)) update("vita_utile", Math.max(5, Math.min(100, n)));
                            }}
                            className="h-10 w-full border border-brand-violet px-3 pr-14 text-center text-[16px] font-bold text-ink-900 focus:outline-none"
                          />
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-ink-500">anni</span>
                        </div>
                        <button type="button" onClick={() => adjustVitaUtile(5)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-violet bg-white text-[20px] font-bold text-brand-violet hover:bg-brand-violet-soft">+</button>
                      </div>

                      {opexStartYear ? (
                        <div className="mt-4 flex items-center gap-3 border border-ink-100 bg-[#f7f7fa] px-4 py-3">
                          <div className="h-3 w-3 shrink-0 rounded-full bg-brand-violet" />
                          <p className="text-[13px] text-ink-700">
                            OPEX attivo dal <strong>{opexStartYear}</strong> al <strong>{opexEndYear}</strong>
                          </p>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        disabled={!draft.vita_utile}
                        onClick={() => {
                          if (!draft.vita_utile) return;
                          setOpexRevealLevel(1);
                        }}
                        className={`mt-5 flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold transition-colors ${
                          draft.vita_utile
                            ? "bg-brand-violet text-white hover:bg-brand-violet-dark"
                            : "cursor-not-allowed bg-ink-100 text-ink-300"
                        }`}
                      >
                        Conferma vita utile del progetto
                        <span className="text-[16px] leading-none">→</span>
                      </button>
                    </ClassAccordion>

                    {/* ── Section 2: Tasso OPEX (visible only after vita utile confirmed) ── */}
                    {opexRevealLevel >= 1 ? (
                      <div className="overflow-hidden border border-ink-100 bg-white">
                        <div className="flex items-center gap-3 bg-[#2f2f2f] px-5 py-3 text-white">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-violet text-[12px] font-bold">2</span>
                          <p className="text-[14px] font-semibold">Tasso OPEX annuale</p>
                        </div>
                        <div className="p-5">
                          {/* Quick-select */}
                          <p className="mb-3 text-[13px] font-semibold text-ink-900">Seleziona un valore di riferimento</p>
                          <div className="mb-5 flex gap-2">
                            {[
                              { label: "Minimo", value: opexBenchmark.min },
                              { label: "Media", value: opexBenchmark.avg },
                              { label: "Massimo", value: opexBenchmark.max },
                            ].map(({ label, value }) => {
                              const strVal = String(value).replace(".", ",");
                              const isActive = draft.opex_tasso === strVal;
                              return (
                                <button key={label} type="button" onClick={() => updateOpexTasso(strVal)}
                                  className={`flex-1 border px-3 py-2.5 text-center transition-colors ${isActive ? "border-brand-violet bg-brand-violet text-white" : "border-ink-200 bg-white text-ink-700 hover:border-ink-400"}`}
                                >
                                  <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{label}</p>
                                  <p className="mt-0.5 text-[17px] font-bold">{value}%</p>
                                </button>
                              );
                            })}
                          </div>

                          {/* Manual input */}
                          <p className="mb-2 text-[13px] font-semibold text-ink-900">Oppure inserisci manualmente</p>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => adjustOpexTasso(-0.1)}
                              className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink-200 bg-white text-[20px] font-bold text-ink-600 hover:border-ink-400 hover:bg-[#fafafa]">−</button>
                            <div className="relative w-[120px]">
                              <input
                                value={draft.opex_tasso}
                                onChange={(e) => updateOpexTasso(e.target.value)}
                                className="h-10 w-full border border-brand-violet px-3 pr-8 text-center text-[16px] font-bold text-ink-900 focus:outline-none"
                              />
                              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-ink-500">%</span>
                            </div>
                            <button type="button" onClick={() => adjustOpexTasso(0.1)}
                              className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-violet bg-white text-[20px] font-bold text-brand-violet hover:bg-brand-violet-soft">+</button>
                            <span className="text-[13px] text-ink-600">del CAPEX / anno</span>
                          </div>

                          {opexAnnualAmount > 0 ? (
                            <div className="mt-4 border-l-[3px] border-brand-violet bg-brand-violet-soft px-4 py-2.5">
                              <p className="text-[11px] uppercase tracking-wide text-ink-500">Costo operativo annuale</p>
                              <p className="mt-0.5 text-[18px] font-bold text-ink-900">{fmt(String(Math.round(opexAnnualAmount)))} €</p>
                            </div>
                          ) : null}

                          {/* Per-year override */}
                          <div className="mt-6 border-t border-[#ececf1] pt-5">
                            <label className="flex items-center gap-3 text-[14px] font-semibold text-ink-900">
                              <input
                                type="checkbox"
                                checked={draft.opex_distribuzione_attiva}
                                onChange={(event) => {
                                  const active = event.target.checked;
                                  if (active) {
                                    setDraft((prev) => ({
                                      ...prev,
                                      opex_distribuzione_attiva: true,
                                      opex_distribuzione: projectYears.reduce((acc, y) => {
                                        acc[y] = prev.opex_distribuzione[y] ?? prev.opex_tasso ?? "";
                                        return acc;
                                      }, {}),
                                    }));
                                  } else {
                                    update("opex_distribuzione_attiva", false);
                                  }
                                }}
                                className="h-4 w-4 accent-[#5b19d6]"
                              />
                              Personalizza tasso per singolo anno
                            </label>
                            <p className="mt-1 text-[12px] leading-[1.5] text-ink-500">
                              Imposta un tasso OPEX diverso per singoli anni del progetto.
                            </p>

                            {draft.opex_distribuzione_attiva ? (
                              <div className="mt-4 overflow-hidden border border-[#e8e8ed]">
                                <div className="grid bg-[#f7f7fa] px-4 py-2.5 text-[12px] font-semibold text-ink-600 md:grid-cols-[80px_minmax(0,160px)_minmax(0,1fr)]">
                                  <span>Anno</span><span>Tasso %</span><span>Costo annuale</span>
                                </div>
                                <div className="divide-y divide-[#ececf1] bg-white">
                                  {projectYears.map((year) => (
                                    <div key={year} className="grid items-center md:grid-cols-[80px_minmax(0,160px)_minmax(0,1fr)]">
                                      <span className="px-4 py-3 text-[14px] font-semibold text-ink-900">{year}</span>
                                      <div className="flex items-center gap-1 px-4 py-3">
                                        <button type="button" onClick={() => adjustOpexYear(year, -0.5)}
                                          className="flex h-8 w-8 shrink-0 items-center justify-center border border-ink-200 text-[16px] font-bold text-ink-600 hover:border-ink-400 hover:bg-[#f5f5f7]">−</button>
                                        <div className="flex h-8 items-center gap-1 border border-ink-200 bg-white px-2 focus-within:border-brand-violet">
                                          <input
                                            value={opexDistribution[year] ?? ""}
                                            onChange={(e) => updateOpexDistribution(year, e.target.value)}
                                            className="w-[44px] bg-transparent text-right text-[13px] font-semibold text-ink-900 focus:outline-none"
                                          />
                                          <span className="text-[12px] text-ink-400">%</span>
                                        </div>
                                        <button type="button" onClick={() => adjustOpexYear(year, 0.5)}
                                          className="flex h-8 w-8 shrink-0 items-center justify-center border border-ink-200 text-[16px] font-bold text-brand-violet hover:border-brand-violet hover:bg-brand-violet-soft">+</button>
                                      </div>
                                      <div className="px-4 py-3 text-[13px] text-ink-700">
                                        {fmt(String(Math.round(opexYearlyAmounts[year] || 0)))} €
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Sidebar — shows vita utile or opex benchmarks (never both) */}
                  <aside className="h-fit border border-[#e8e8ed] bg-white p-5">
                    {opexRevealLevel === 0 ? (
                      <>
                        <p className="text-[14px] font-semibold text-ink-900">Vita utile tipica</p>
                        <p className="mt-1 text-[12px] leading-[1.5] text-ink-600">
                          Riferimenti per <strong>{draft.settore || "questa tipologia"}</strong>.
                        </p>
                        <div className="mt-5 space-y-3 border-t border-[#ececf1] pt-4">
                          {[
                            { label: "Minima", val: vitaUtileBenchmark.min },
                            { label: "Media di settore", val: vitaUtileBenchmark.avg },
                            { label: "Massima", val: vitaUtileBenchmark.max },
                          ].map(({ label, val }) => (
                            <div key={label} className="flex items-center justify-between">
                              <span className="text-[13px] text-ink-600">{label}</span>
                              <span className="text-[15px] font-bold text-ink-900">{val} anni</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <div className="relative h-[6px] w-full overflow-hidden bg-[#e7e7ea]">
                            <div className="absolute h-full bg-brand-violet/30"
                              style={{
                                left: `${(vitaUtileBenchmark.min / vitaUtileBenchmark.max) * 100}%`,
                                width: `${((vitaUtileBenchmark.max - vitaUtileBenchmark.min) / vitaUtileBenchmark.max) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="mt-1 flex justify-between text-[10px] text-ink-400">
                            <span>{vitaUtileBenchmark.min} anni</span>
                            <span>{vitaUtileBenchmark.max} anni</span>
                          </div>
                        </div>
                        {draft.vita_utile ? (
                          <div className="mt-5 border-t border-[#ececf1] pt-4 text-center">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Valore impostato</p>
                            <p className="mt-1 text-[26px] font-bold text-brand-violet">{draft.vita_utile}</p>
                            <p className="text-[12px] text-ink-500">anni</p>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <p className="text-[14px] font-semibold text-ink-900">Tasso OPEX di riferimento</p>
                        <p className="mt-1 text-[12px] leading-[1.5] text-ink-600">
                          Valori tipici per <strong>{draft.settore || "questa tipologia"}</strong>, come % annua del CAPEX.
                        </p>
                        <div className="mt-5 space-y-3 border-t border-[#ececf1] pt-4">
                          {[
                            { label: "Minimo", val: opexBenchmark.min, unit: "%" },
                            { label: "Media di settore", val: opexBenchmark.avg, unit: "%" },
                            { label: "Massimo", val: opexBenchmark.max, unit: "%" },
                          ].map(({ label, val, unit }) => (
                            <div key={label} className="flex items-center justify-between">
                              <span className="text-[13px] text-ink-600">{label}</span>
                              <span className="text-[15px] font-bold text-ink-900">{val}{unit}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <div className="relative h-[6px] w-full overflow-hidden bg-[#e7e7ea]">
                            <div className="absolute h-full bg-brand-violet/30"
                              style={{
                                left: `${(opexBenchmark.min / opexBenchmark.max) * 100}%`,
                                width: `${((opexBenchmark.max - opexBenchmark.min) / opexBenchmark.max) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="mt-1 flex justify-between text-[10px] text-ink-400">
                            <span>{opexBenchmark.min}%</span>
                            <span>{opexBenchmark.max}%</span>
                          </div>
                        </div>

                        <div className="mt-5 border-t border-[#ececf1] pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-ink-500">Vita utile</span>
                            <span className="text-[13px] font-semibold text-ink-900">{draft.vita_utile} anni</span>
                          </div>
                          {opexStartYear ? (
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-ink-500">Periodo OPEX</span>
                              <span className="text-[13px] font-semibold text-ink-900">{opexStartYear}–{opexEndYear}</span>
                            </div>
                          ) : null}
                          {draft.opex_tasso ? (
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-ink-500">Tasso selezionato</span>
                              <span className="text-[15px] font-bold text-brand-violet">{draft.opex_tasso}%</span>
                            </div>
                          ) : null}
                        </div>

                        {opexTotale > 0 ? (
                          <div className="mt-4 border-t border-[#ececf1] pt-4 text-center">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">OPEX totale stimato</p>
                            <p className="mt-1 text-[20px] font-bold text-ink-900">{fmt(String(Math.round(opexTotale)))} €</p>
                            <p className="text-[12px] text-ink-500">su {draft.vita_utile} anni</p>
                          </div>
                        ) : null}
                      </>
                    )}
                  </aside>
                </div>
              </>
            ) : null}

            {step.id === "benefici" ? (
              <>
                <QuestionHeader
                  title="Definisci i benefici attesi del progetto"
                  description="Inserisci il valore annuo stimato per ciascun indicatore. I valori sono pre-compilati automaticamente sulla base del CAPEX e del settore di intervento."
                />

                <div className="mb-5 flex max-w-4xl flex-wrap items-center justify-between gap-3">
                  <p className="text-[13px] text-ink-600">
                    <span className="font-semibold text-ink-900">{beneficiFilledCount}</span> / {beneficiTotalCount} indicatori compilati
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={autoFillBenefici}
                      className="border border-brand-violet bg-white px-4 py-2 text-[13px] font-semibold text-brand-violet hover:bg-brand-violet-soft"
                    >
                      Compila automaticamente
                    </button>
                    <button
                      type="button"
                      onClick={clearBenefici}
                      className="border border-ink-200 bg-white px-4 py-2 text-[13px] text-ink-600 hover:bg-[#fafafa]"
                    >
                      Cancella tutto
                    </button>
                  </div>
                </div>

                <div className="max-w-4xl space-y-3">
                  {beneficiTemplates.map(({ group, kpis }) => (
                    <div key={group} className="overflow-hidden border border-ink-100 bg-white">
                      <div className="bg-[#2f2f2f] px-5 py-3">
                        <p className="text-[13px] font-semibold text-white">{group}</p>
                      </div>
                      <div className="grid bg-[#f7f7fa] px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500 md:grid-cols-[1fr_80px_160px]">
                        <span>Indicatore</span>
                        <span>Unità</span>
                        <span className="text-right">Valore annuo</span>
                      </div>
                      <div className="divide-y divide-[#ececec]">
                        {kpis.map(({ id, label, unit }) => (
                          <div key={id} className="grid items-center gap-2 px-5 py-3 md:grid-cols-[1fr_80px_160px]">
                            <p className="text-[14px] text-ink-900">{label}</p>
                            <span className="font-mono text-[12px] text-ink-500">{unit}</span>
                            <div className="flex justify-end">
                              <input
                                value={draft.benefici_kpi?.[id]?.stima ?? ""}
                                onChange={(e) => updateBeneficiKpi(id, e.target.value)}
                                className="h-9 w-full max-w-[150px] border border-ink-200 bg-white px-3 text-right text-[13px] font-semibold text-ink-900 focus:border-brand-violet focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {beneficiTemplates.length === 0 ? (
                    <div className="border border-ink-100 bg-white px-6 py-8 text-center">
                      <p className="text-[14px] text-ink-500">Nessun modello disponibile per il settore selezionato.</p>
                    </div>
                  ) : null}

                  {/* ── Benefici extra (inserimento manuale) ── */}
                  <div className="overflow-hidden border border-ink-100 bg-white">
                    <div className="bg-[#2f2f2f] px-5 py-3">
                      <p className="text-[13px] font-semibold text-white">Benefici aggiuntivi (inserimento manuale)</p>
                    </div>

                    {(draft.benefici_extra ?? []).length > 0 && (
                      <>
                        <div className="grid bg-[#f7f7fa] px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500 md:grid-cols-[1fr_100px_150px_36px]">
                          <span>Descrizione beneficio</span>
                          <span>Unità</span>
                          <span className="text-right">Valore annuo</span>
                          <span />
                        </div>
                        <div className="divide-y divide-[#ececec]">
                          {(draft.benefici_extra ?? []).map((b) => (
                            <div key={b.id} className="grid items-center gap-2 px-5 py-3 md:grid-cols-[1fr_100px_150px_36px]">
                              <input
                                value={b.label}
                                onChange={(e) => updateExtraBeneficio(b.id, "label", e.target.value)}
                                placeholder="es. Riduzione costi sanitari"
                                className="h-9 w-full border border-ink-200 bg-white px-3 text-[13px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                              />
                              <input
                                value={b.unit}
                                onChange={(e) => updateExtraBeneficio(b.id, "unit", e.target.value)}
                                placeholder="es. €/anno"
                                className="h-9 w-full border border-ink-200 bg-white px-3 text-[13px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                              />
                              <div className="flex justify-end">
                                <input
                                  value={b.stima}
                                  onChange={(e) => updateExtraBeneficio(b.id, "stima", e.target.value)}
                                  placeholder="0"
                                  className="h-9 w-full max-w-[140px] border border-ink-200 bg-white px-3 text-right text-[13px] font-semibold text-ink-900 focus:border-brand-violet focus:outline-none"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeExtraBeneficio(b.id)}
                                className="flex h-9 w-9 items-center justify-center text-ink-300 transition-colors hover:text-red-500"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="px-5 py-4">
                      <button
                        type="button"
                        onClick={addExtraBeneficio}
                        className="flex items-center gap-2 border border-dashed border-brand-violet px-4 py-2 text-[13px] font-semibold text-brand-violet transition-colors hover:bg-brand-violet-soft"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Aggiungi beneficio personalizzato
                      </button>
                    </div>
                  </div>

                  {opexStartYear && opexEndYear ? (
                    <p className="mt-2 text-[12px] leading-[1.5] text-ink-500">
                      Il valore annuo si applica a tutti gli anni di vita utile ({draft.vita_utile} anni, dal {opexStartYear} al {opexEndYear}).
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid h-16 flex-shrink-0 grid-cols-2">
        <button type="button" onClick={handleBack} className="flex items-center justify-between bg-[#5a5a5a] px-6 text-[14px] font-medium text-white">
          <span>{stepIdx === 0 ? "Torna alle valutazioni" : "Torna allo step precedente"}</span>
          <span className="text-[22px] leading-none">&larr;</span>
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex items-center justify-between px-6 text-[14px] font-medium ${canProceed ? "bg-brand-violet text-white" : "cursor-not-allowed bg-ink-100 text-ink-300"}`}
        >
          <span>{stepIdx === STEPS.length - 1 ? "Concludi la configurazione" : "Vai allo step successivo"}</span>
          <span className="text-[22px] leading-none">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
