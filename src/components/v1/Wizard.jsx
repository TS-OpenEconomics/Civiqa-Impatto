import { useEffect, useMemo, useRef, useState } from "react";
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
    "Il progetto è allo stadio iniziale: si raccolgono dati, si definiscono obiettivi e si impostano i primi elementi tecnici ed economici.",
  "In approvazione":
    "Il progetto è stato predisposto e presentato agli organi competenti ed è in attesa di autorizzazione o parere.",
  Approvato: "Il progetto ha ottenuto l'approvazione formale necessaria e può procedere verso le fasi attuative ed esecutive.",
};
const SETTORI = Object.keys(SETTORI_DATA);
const TIPI = ["Nuova realizzazione", "Ristrutturazione", "Recupero", "Manutenzione", "Efficientamento"];
const ANNI = ["2025", "2026", "2027", "2028", "2029", "2030", "2031"];
const TASSO_DEFAULT = "3";
const STEP_AUTOFILL_LABEL = "Autoriempi questa pagina";
const DEMO_AUTOFILL = {
  nome: "Nuovo asilo nido comunale",
  cup: "I17C24000120005",
  descrizione:
    "Realizzazione di un nuovo asilo nido comunale per 100 bambini, con l'obiettivo di aumentare l'offerta di servizi educativi per la prima infanzia, ridurre il divario territoriale nell'accesso ai servizi e favorire la conciliazione lavoro-famiglia.",
  stato: "In progettazione",
  settore: "Infrastrutture sociali",
  sotto_settore: "Istruzione e formazione",
  categoria_intervento: "Scuole e asili",
  tipo_intervento: "Nuova realizzazione",
  data_inizio: "2025-09-01",
  data_fine: "2027-09-01",
  localizzazione: "Via della Repubblica 15 - 80131, Napoli NA",
  location_lat: 40.8518,
  location_lon: 14.2681,
  nuts_code: "ITF33",
  nuts_label: "Napoli",
  nace_code: "F41.20",
  anno_attualizzazione: "2025",
  tasso_attualizzazione: "3",
  capex: "3200000",
  vita_utile: 30,
  opex_tasso: "2,5",
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

const CAPEX_DEFAULTS = {
  "Infrastrutture sociali":                         5_000_000,
  "Infrastrutture di trasporto":                   20_000_000,
  "Infrastrutture ambientali e risorse idriche":   15_000_000,
  "Attivita produttive, ricerca e impresa sociale": 3_000_000,
  "Telecomunicazioni e tecnologie informatiche":    8_000_000,
};
const CAPEX_DEFAULT_FALLBACK = 10_000_000;

function profiloNum(val, fallback = 0) {
  return parseFloat(String(val ?? "").replace(",", ".")) || fallback;
}

function buildProfiloFormula(template, profiloDati) {
  if (!template || !profiloDati) return null;
  const parts = template.campi.map((campo) => {
    const val = profiloNum(profiloDati[campo.id], campo.default ?? 0);
    return val ? `${new Intl.NumberFormat("it-IT").format(val)} ${campo.unit}` : null;
  }).filter(Boolean);
  return parts.length > 1 ? parts.join(" × ") : null;
}

function getProfiloInputValue(profiloKey, template, profiloDati) {
  if (!profiloKey || !profiloDati) return null;
  if (profiloKey === "_primary") {
    const primaryField = template?.campi?.find((c) => c.default == null);
    if (!primaryField) return null;
    return profiloDati[primaryField.id] ?? null;
  }
  return profiloDati[profiloKey] ?? null;
}

const PROFILO_TEMPLATES = {
  // ── Istruzione e formazione ──────────────────────────────────────────────────
  "Scuole e asili": {
    titolo: "Struttura scolastica / nido",
    campi: [
      { id: "num_alunni",  label: "Numero di alunni",        unit: "alunni",    placeholder: "es. 300" },
      { id: "mq_alunno",   label: "Superficie per alunno",   unit: "m²/alunno", default: 20,      hint: "Standard ministeriale: 20 m²/alunno" },
      { id: "costo_mq",    label: "Costo di costruzione",    unit: "€/m²",      default: 1600,    hint: "Tipico: €1.600/m² per edifici scolastici" },
    ],
    stimaCapex: (p) => profiloNum(p.num_alunni) * profiloNum(p.mq_alunno, 20) * profiloNum(p.costo_mq, 1600),
  },
  "Universita e ricerca": {
    titolo: "Università e ricerca",
    campi: [
      { id: "num_studenti", label: "Numero di studenti",      unit: "studenti",  placeholder: "es. 2.000" },
      { id: "mq_studente",  label: "Superficie per studente", unit: "m²/stud.",  default: 25,      hint: "Standard: 25 m²/studente" },
      { id: "costo_mq",     label: "Costo di costruzione",    unit: "€/m²",      default: 2000,    hint: "Tipico: €2.000/m² per atenei" },
    ],
    stimaCapex: (p) => profiloNum(p.num_studenti) * profiloNum(p.mq_studente, 25) * profiloNum(p.costo_mq, 2000),
  },
  "Formazione professionale": {
    titolo: "Centro di formazione professionale",
    campi: [
      { id: "num_aule",    label: "Numero di aule",           unit: "aule",      placeholder: "es. 20" },
      { id: "mq_aula",     label: "Superficie per aula",      unit: "m²/aula",   default: 60,      hint: "Standard: 60 m²/aula" },
      { id: "costo_mq",    label: "Costo di costruzione",     unit: "€/m²",      default: 1400,    hint: "Tipico: €1.400/m² per centri formativi" },
    ],
    stimaCapex: (p) => profiloNum(p.num_aule) * profiloNum(p.mq_aula, 60) * profiloNum(p.costo_mq, 1400),
  },
  // ── Sanità e assistenza ──────────────────────────────────────────────────────
  "Ospedali e cliniche": {
    titolo: "Struttura ospedaliera",
    campi: [
      { id: "num_letti",   label: "Posti letto",              unit: "letti",     placeholder: "es. 200" },
      { id: "mq_letto",    label: "Superficie per posto letto", unit: "m²/letto", default: 80,     hint: "Standard: 80 m²/posto letto" },
      { id: "costo_mq",    label: "Costo di costruzione",     unit: "€/m²",      default: 3500,    hint: "Tipico: €3.500/m² per ospedali" },
    ],
    stimaCapex: (p) => profiloNum(p.num_letti) * profiloNum(p.mq_letto, 80) * profiloNum(p.costo_mq, 3500),
  },
  "Strutture per anziani": {
    titolo: "Struttura per anziani (RSA)",
    campi: [
      { id: "num_posti",   label: "Posti residenziali",       unit: "posti",     placeholder: "es. 80" },
      { id: "mq_posto",    label: "Superficie per posto",     unit: "m²/posto",  default: 45,      hint: "Standard: 45 m²/posto" },
      { id: "costo_mq",    label: "Costo di costruzione",     unit: "€/m²",      default: 2200,    hint: "Tipico: €2.200/m² per RSA" },
    ],
    stimaCapex: (p) => profiloNum(p.num_posti) * profiloNum(p.mq_posto, 45) * profiloNum(p.costo_mq, 2200),
  },
  "Centri di salute": {
    titolo: "Centro di salute / poliambulatorio",
    campi: [
      { id: "superficie_mq", label: "Superficie totale",      unit: "m²",        placeholder: "es. 1.500" },
      { id: "costo_mq",      label: "Costo di costruzione",   unit: "€/m²",      default: 2500,    hint: "Tipico: €2.500/m² per strutture sanitarie" },
    ],
    stimaCapex: (p) => profiloNum(p.superficie_mq) * profiloNum(p.costo_mq, 2500),
  },
  // ── Cultura e sport ──────────────────────────────────────────────────────────
  "Biblioteche e musei": {
    titolo: "Biblioteca / museo",
    campi: [
      { id: "superficie_mq", label: "Superficie totale",      unit: "m²",        placeholder: "es. 2.000" },
      { id: "costo_mq",      label: "Costo di costruzione",   unit: "€/m²",      default: 1800,    hint: "Tipico: €1.800/m² per biblioteche e musei" },
    ],
    stimaCapex: (p) => profiloNum(p.superficie_mq) * profiloNum(p.costo_mq, 1800),
  },
  "Impianti sportivi": {
    titolo: "Impianto sportivo",
    campi: [
      { id: "superficie_mq", label: "Superficie coperta",     unit: "m²",        placeholder: "es. 5.000" },
      { id: "costo_mq",      label: "Costo di costruzione",   unit: "€/m²",      default: 1200,    hint: "Tipico: €1.200/m² per impianti sportivi coperti" },
    ],
    stimaCapex: (p) => profiloNum(p.superficie_mq) * profiloNum(p.costo_mq, 1200),
  },
  "Spazi culturali": {
    titolo: "Spazio culturale / centro civico",
    campi: [
      { id: "superficie_mq", label: "Superficie totale",      unit: "m²",        placeholder: "es. 1.200" },
      { id: "costo_mq",      label: "Costo di costruzione",   unit: "€/m²",      default: 1800,    hint: "Tipico: €1.800/m² per spazi culturali" },
    ],
    stimaCapex: (p) => profiloNum(p.superficie_mq) * profiloNum(p.costo_mq, 1800),
  },
  "Teatri e auditorium": {
    titolo: "Teatro / auditorium",
    campi: [
      { id: "num_posti",     label: "Posti in sala",          unit: "posti",     placeholder: "es. 600" },
      { id: "mq_posto",      label: "Superficie per posto",   unit: "m²/posto",  default: 2.5,     hint: "Standard: 2,5 m²/posto (inclusi spazi di servizio)" },
      { id: "costo_mq",      label: "Costo di costruzione",   unit: "€/m²",      default: 3000,    hint: "Tipico: €3.000/m² per teatri" },
    ],
    stimaCapex: (p) => profiloNum(p.num_posti) * profiloNum(p.mq_posto, 2.5) * profiloNum(p.costo_mq, 3000),
  },
  // ── Edilizia residenziale pubblica ───────────────────────────────────────────
  "Riqualificazione alloggi": {
    titolo: "Riqualificazione alloggi ERP",
    campi: [
      { id: "num_alloggi",   label: "Numero di alloggi",      unit: "alloggi",   placeholder: "es. 60" },
      { id: "mq_alloggio",   label: "Superficie media",       unit: "m²/alloggio", default: 75,   hint: "Tipico: 75 m²/alloggio per ERP" },
      { id: "costo_mq",      label: "Costo di ristrutturazione", unit: "€/m²",  default: 900,     hint: "Tipico: €900/m² per riqualificazione" },
    ],
    stimaCapex: (p) => profiloNum(p.num_alloggi) * profiloNum(p.mq_alloggio, 75) * profiloNum(p.costo_mq, 900),
  },
  "Nuova costruzione ERP": {
    titolo: "Nuova costruzione ERP",
    campi: [
      { id: "num_alloggi",   label: "Numero di alloggi",      unit: "alloggi",   placeholder: "es. 50" },
      { id: "mq_alloggio",   label: "Superficie media",       unit: "m²/alloggio", default: 80,   hint: "Tipico: 80 m²/alloggio" },
      { id: "costo_mq",      label: "Costo di costruzione",   unit: "€/m²",      default: 1400,    hint: "Tipico: €1.400/m² per nuova costruzione ERP" },
    ],
    stimaCapex: (p) => profiloNum(p.num_alloggi) * profiloNum(p.mq_alloggio, 80) * profiloNum(p.costo_mq, 1400),
  },
  // ── Strade e trasporto ───────────────────────────────────────────────────────
  "Nuova viabilita": {
    titolo: "Nuova viabilità stradale",
    campi: [
      { id: "km",            label: "Lunghezza strada",       unit: "km",        placeholder: "es. 10" },
      { id: "costo_km",      label: "Costo per km",           unit: "€/km",      default: 2500000, hint: "Tipico: €2.500.000/km per viabilità extraurbana" },
    ],
    stimaCapex: (p) => profiloNum(p.km) * profiloNum(p.costo_km, 2500000),
  },
  "Adeguamento e manutenzione": {
    titolo: "Adeguamento / manutenzione stradale",
    campi: [
      { id: "km",            label: "Lunghezza interessata",  unit: "km",        placeholder: "es. 25" },
      { id: "costo_km",      label: "Costo per km",           unit: "€/km",      default: 800000,  hint: "Tipico: €800.000/km per adeguamento" },
    ],
    stimaCapex: (p) => profiloNum(p.km) * profiloNum(p.costo_km, 800000),
  },
  "Gallerie e ponti": {
    titolo: "Galleria / ponte",
    campi: [
      { id: "lunghezza_m",   label: "Lunghezza opera",        unit: "m",         placeholder: "es. 500" },
      { id: "larghezza_m",   label: "Larghezza",              unit: "m",         default: 12,      hint: "Standard: 12 m per doppio senso di marcia" },
      { id: "costo_mq",      label: "Costo per m²",           unit: "€/m²",      default: 15000,   hint: "Tipico: €15.000/m² per opere d'arte stradali" },
    ],
    stimaCapex: (p) => profiloNum(p.lunghezza_m) * profiloNum(p.larghezza_m, 12) * profiloNum(p.costo_mq, 15000),
  },
  "Piste ciclabili": {
    titolo: "Pista ciclabile",
    campi: [
      { id: "km",            label: "Lunghezza percorso",     unit: "km",        placeholder: "es. 8" },
      { id: "costo_km",      label: "Costo per km",           unit: "€/km",      default: 300000,  hint: "Tipico: €300.000/km per piste ciclabili urbane" },
    ],
    stimaCapex: (p) => profiloNum(p.km) * profiloNum(p.costo_km, 300000),
  },
  "Linee ferroviarie": {
    titolo: "Linea ferroviaria",
    campi: [
      { id: "km",            label: "Lunghezza linea",        unit: "km",        placeholder: "es. 40" },
      { id: "costo_km",      label: "Costo per km",           unit: "€/km",      default: 10000000, hint: "Tipico: €10.000.000/km per linee regionali" },
    ],
    stimaCapex: (p) => profiloNum(p.km) * profiloNum(p.costo_km, 10000000),
  },
  "Metropolitane e tram": {
    titolo: "Metropolitana / tranvia",
    campi: [
      { id: "km",            label: "Lunghezza linea",        unit: "km",        placeholder: "es. 15" },
      { id: "num_fermate",   label: "Numero di fermate",      unit: "fermate",   placeholder: "es. 20" },
      { id: "costo_km",      label: "Costo per km",           unit: "€/km",      default: 50000000, hint: "Tipico: €50.000.000/km per metro urbana" },
    ],
    stimaCapex: (p) => profiloNum(p.km) * profiloNum(p.costo_km, 50000000),
  },
  // ── Infrastrutture idriche / ambientali ──────────────────────────────────────
  "Reti idriche urbane": {
    titolo: "Rete idrica urbana",
    campi: [
      { id: "km_rete",       label: "Lunghezza rete",         unit: "km",        placeholder: "es. 80" },
      { id: "costo_km",      label: "Costo per km",           unit: "€/km",      default: 800000,  hint: "Tipico: €800.000/km per rete idrica urbana" },
    ],
    stimaCapex: (p) => profiloNum(p.km_rete) * profiloNum(p.costo_km, 800000),
  },
  "Reti fognarie": {
    titolo: "Rete fognaria",
    campi: [
      { id: "km_rete",       label: "Lunghezza rete",         unit: "km",        placeholder: "es. 60" },
      { id: "costo_km",      label: "Costo per km",           unit: "€/km",      default: 600000,  hint: "Tipico: €600.000/km per fognatura" },
    ],
    stimaCapex: (p) => profiloNum(p.km_rete) * profiloNum(p.costo_km, 600000),
  },
  "Impianti depurazione acque": {
    titolo: "Impianto di depurazione",
    campi: [
      { id: "ae",            label: "Abitanti equivalenti",   unit: "AE",        placeholder: "es. 50.000" },
      { id: "costo_ae",      label: "Costo per AE",           unit: "€/AE",      default: 350,     hint: "Tipico: €350/AE per depuratore biologico" },
    ],
    stimaCapex: (p) => profiloNum(p.ae) * profiloNum(p.costo_ae, 350),
  },
  "Corpi idrici: Miglioramento della qualita": {
    titolo: "Intervento su corpi idrici",
    campi: [
      { id: "km_rete",       label: "Km di rete/canali interessati", unit: "km", placeholder: "es. 120" },
      { id: "costo_km",      label: "Costo per km",           unit: "€/km",      default: 1000000, hint: "Tipico: €1.000.000/km per interventi su corpi idrici" },
    ],
    stimaCapex: (p) => profiloNum(p.km_rete) * profiloNum(p.costo_km, 1000000),
  },
  // ── Telecomunicazioni ────────────────────────────────────────────────────────
  "Fibra ottica FTTH": {
    titolo: "Fibra ottica FTTH",
    campi: [
      { id: "km_fibra",      label: "Km di fibra da posare",  unit: "km",        placeholder: "es. 200" },
      { id: "unita_conn",    label: "Unità immobiliari",      unit: "UI",        placeholder: "es. 5.000" },
      { id: "costo_km",      label: "Costo per km",           unit: "€/km",      default: 30000,   hint: "Tipico: €30.000/km per fibra FTTH" },
    ],
    stimaCapex: (p) => profiloNum(p.km_fibra) * profiloNum(p.costo_km, 30000),
  },
  "Fibra ottica FTTC": {
    titolo: "Fibra ottica FTTC",
    campi: [
      { id: "km_fibra",      label: "Km di fibra da posare",  unit: "km",        placeholder: "es. 100" },
      { id: "costo_km",      label: "Costo per km",           unit: "€/km",      default: 15000,   hint: "Tipico: €15.000/km per fibra FTTC" },
    ],
    stimaCapex: (p) => profiloNum(p.km_fibra) * profiloNum(p.costo_km, 15000),
  },
  // ── Attività produttive e ricerca ────────────────────────────────────────────
  "Laboratori e centri di ricerca": {
    titolo: "Laboratorio / centro ricerca",
    campi: [
      { id: "superficie_mq", label: "Superficie laboratori",  unit: "m²",        placeholder: "es. 3.000" },
      { id: "costo_mq",      label: "Costo per m²",           unit: "€/m²",      default: 2500,    hint: "Tipico: €2.500/m² per laboratori attrezzati" },
    ],
    stimaCapex: (p) => profiloNum(p.superficie_mq) * profiloNum(p.costo_mq, 2500),
  },
  "Incubatori di imprese": {
    titolo: "Incubatore / hub di innovazione",
    campi: [
      { id: "superficie_mq", label: "Superficie totale",      unit: "m²",        placeholder: "es. 2.000" },
      { id: "num_startup",   label: "Imprese ospitate (stima)", unit: "n.",      placeholder: "es. 30" },
      { id: "costo_mq",      label: "Costo per m²",           unit: "€/m²",      default: 2000,    hint: "Tipico: €2.000/m² per hub innovazione" },
    ],
    stimaCapex: (p) => profiloNum(p.superficie_mq) * profiloNum(p.costo_mq, 2000),
  },
  "Aree industriali": {
    titolo: "Area industriale / polo produttivo",
    campi: [
      { id: "superficie_mq", label: "Superficie totale",      unit: "m²",        placeholder: "es. 50.000" },
      { id: "costo_mq",      label: "Costo per m²",           unit: "€/m²",      default: 500,     hint: "Tipico: €500/m² per aree industriali" },
    ],
    stimaCapex: (p) => profiloNum(p.superficie_mq) * profiloNum(p.costo_mq, 500),
  },
};

const STEPS = [
  { id: "nome",            group: 0, sublabel: "Anagrafica" },
  { id: "descrizione",     group: 0, sublabel: "Anagrafica" },
  { id: "stato",           group: 0, sublabel: "Stato" },
  { id: "classificazione", group: 0, sublabel: "Classificazione intervento" },
  { id: "profilo",         group: 1, sublabel: "Caratteristiche fisiche" },
  { id: "durata",          group: 2, sublabel: "Durata del progetto" },
  { id: "localizzazione",  group: 2, sublabel: "Localizzazione" },
  { id: "anno",            group: 3, sublabel: "Anno di attualizzazione" },
  { id: "capex",           group: 3, sublabel: "Capex" },
  { id: "opex",            group: 3, sublabel: "Opex" },
  { id: "benefici",        group: 3, sublabel: "Benefici ECBA" },
];

const GROUPS = [
  { label: "Profilazione",        sublabels: ["Anagrafica", "Stato", "Classificazione intervento"] },
  { label: "Profilo progetto",    sublabels: ["Caratteristiche fisiche"] },
  { label: "Contesto operativo",  sublabels: ["Durata del progetto", "Localizzazione"] },
  { label: "Parametri economici", sublabels: ["Anno di attualizzazione", "Capex", "Opex", "Benefici ECBA"] },
];

// POC: template fisso per asilo nido (indipendente dal settore selezionato)
const POC_KPI_TEMPLATE = [
  {
    group: "Risparmio del tempo per le famiglie",
    esternalita: "positiva",
    kpis: [
      { id: "famiglie",            label: "Famiglie beneficiarie",                  unit: "n.",                tipo: "input",          profiloKey: "_primary",  estimateFn: (c) => Math.round(c.capex / 32000) },
      { id: "ore_risparmio_annue", label: "Risparmio di tempo per famiglia",        unit: "ore/famiglia/anno", tipo: "tecnico",                                 estimateFn: () => 250 },
      { id: "valore_tempo",        label: "Valore del tempo (ISTAT)",               unit: "€/ora",             tipo: "monetizzazione",                          estimateFn: () => 12.5 },
    ],
  },
  {
    group: "Beneficio educativo e sociale",
    esternalita: "positiva",
    kpis: [
      { id: "bambini_iscritti",    label: "Bambini iscritti",                       unit: "n.",                tipo: "input",          profiloKey: "_primary",  estimateFn: (c) => Math.round(c.capex / 32000) },
      { id: "mq_per_bambino",      label: "Superficie per bambino",                 unit: "m²/bambino",        tipo: "input",          profiloKey: "mq_alunno", estimateFn: () => 20 },
      { id: "valore_benessere",    label: "Valore sociale del servizio educativo",  unit: "€/bambino/anno",    tipo: "monetizzazione",                          estimateFn: () => 3500 },
    ],
  },
  {
    group: "Emissioni da cantiere e costruzione",
    esternalita: "negativa",
    yearSource: "cantiere",
    kpis: [
      { id: "co2_cantiere",        label: "Emissioni CO₂ stimate da cantiere",      unit: "ton CO₂/anno",      tipo: "tecnico",                                 estimateFn: (c) => Math.round(c.capex * 0.00011) },
      { id: "valore_co2_cantiere", label: "Costo sociale della CO₂",               unit: "€/ton",             tipo: "monetizzazione",                          estimateFn: () => 120 },
    ],
  },
];

function buildDefaultKpi(capex, opexYears, cantiereYears) {
  const kpi = {};
  POC_KPI_TEMPLATE.forEach(({ yearSource, kpis }) => {
    const years = yearSource === "cantiere" ? cantiereYears : opexYears;
    kpis.forEach(({ id, estimateFn }) => {
      const stima = String(estimateFn({ capex }));
      kpi[id] = { stima, anni: years.reduce((acc, y) => { acc[y] = stima; return acc; }, {}) };
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

function parseLocaleNumber(value) {
  const raw = String(value ?? "").trim().replace(/\s/g, "");
  if (!raw) return null;
  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw.replace(/\.(?=\d{3}(\D|$))/g, "");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : null;
}

function valuesEquivalent(a, b) {
  const left = String(a ?? "").trim();
  const right = String(b ?? "").trim();
  if (left === right) return true;
  const leftNumber = parseLocaleNumber(left);
  const rightNumber = parseLocaleNumber(right);
  if (leftNumber == null || rightNumber == null) return false;
  return Math.abs(leftNumber - rightNumber) < 0.000001;
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
  const evenShare = parseFloat((100 / years.length).toFixed(1));
  const result = {};
  years.forEach((year) => {
    result[year] = existing[year] ?? String(evenShare).replace(".0", "");
  });
  // Last auto-generated year absorbs rounding remainder so total = exactly 100%
  const lastNew = [...years].reverse().find((y) => existing[y] == null);
  if (lastNew) {
    const othersTotal = years
      .filter((y) => y !== lastNew)
      .reduce((sum, y) => sum + (parseFloat(String(result[y]).replace(",", ".")) || 0), 0);
    const remainder = parseFloat((100 - othersTotal).toFixed(1));
    result[lastNew] = String(remainder).replace(".0", "");
  }
  return result;
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
    tasso_attualizzazione: conf.tasso_attualizzazione != null ? String(conf.tasso_attualizzazione) : TASSO_DEFAULT,
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
    profilo_dati: conf.profilo_dati ?? {},
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
      profilo_dati: draft.profilo_dati,
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

function DatePickerField({ label, hint, value, onChange, minDate = null }) {
  const parsed = value ? new Date(value + "T00:00:00") : null;
  const min = minDate ? new Date(minDate + "T00:00:00") : null;

  const [viewYear, setViewYear] = useState(() => parsed?.getFullYear() ?? min?.getFullYear() ?? 2025);
  const [viewMonth, setViewMonth] = useState(() => parsed?.getMonth() ?? min?.getMonth() ?? 8);

  // When value is set externally (e.g. autofill), jump calendar view to that date
  useEffect(() => {
    if (!value) return;
    const d = new Date(value + "T00:00:00");
    if (!Number.isNaN(d.getTime())) {
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // When minDate advances past the current view, jump to it
  useEffect(() => {
    if (!min) return;
    if (viewYear < min.getFullYear() || (viewYear === min.getFullYear() && viewMonth < min.getMonth())) {
      setViewYear(min.getFullYear());
      setViewMonth(min.getMonth());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate]);

  const grid = buildCalendarGrid(viewYear, viewMonth);

  function isSame(date) {
    return parsed &&
      date.getFullYear() === parsed.getFullYear() &&
      date.getMonth() === parsed.getMonth() &&
      date.getDate() === parsed.getDate();
  }

  function isDisabled(date) {
    if (!min) return false;
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const m = new Date(min.getFullYear(), min.getMonth(), min.getDate());
    return d <= m;
  }

  function handleDayClick(date) {
    if (isDisabled(date)) return;
    const y = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    onChange(`${y}-${mo}-${d}`);
    setViewMonth(date.getMonth());
    setViewYear(date.getFullYear());
  }

  const displayValue = parsed
    ? `${String(parsed.getDate()).padStart(2, "0")} / ${String(parsed.getMonth() + 1).padStart(2, "0")} / ${parsed.getFullYear()}`
    : "";

  const allowedYears = min
    ? PICKER_YEARS.filter((y) => y >= min.getFullYear())
    : PICKER_YEARS;

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
          {allowedYears.map((y) => <option key={y} value={y}>{y}</option>)}
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
          const disabled = isDisabled(date);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(date)}
              className={`flex h-9 w-full items-center justify-center text-[13px] transition-colors ${
                disabled
                  ? "cursor-not-allowed text-ink-200"
                  : selected
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

function LockIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 10V8a5 5 0 0110 0v2" />
      <rect width="14" height="10" x="5" y="10" rx="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14v2" />
    </svg>
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
    (initialProject?.configurazione?.anno_attualizzazione != null && initialProject?.configurazione?.tasso_attualizzazione != null) ? 2 : 0
  );
  const [opexRevealLevel, setOpexRevealLevel] = useState(0);
  const [beneficiRevealLevel, setBeneficiRevealLevel] = useState(0);
  const [kpiDetailOpen, setKpiDetailOpen] = useState({});
  const [kpiPeriods, setKpiPeriods] = useState({});
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

  function updateProfiloDati(fieldId, value) {
    setDraft((prev) => ({ ...prev, profilo_dati: { ...prev.profilo_dati, [fieldId]: value } }));
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

  function updateBeneficiKpiYear(id, year, value) {
    setDraft((prev) => ({
      ...prev,
      benefici_kpi: {
        ...prev.benefici_kpi,
        [id]: {
          ...(prev.benefici_kpi?.[id] ?? {}),
          anni: { ...(prev.benefici_kpi?.[id]?.anni ?? {}), [year]: value },
        },
      },
    }));
  }

  function toggleKpiDetail(kpiId, activeYears) {
    setKpiDetailOpen((prev) => ({ ...prev, [kpiId]: !prev[kpiId] }));
    setKpiPeriods((prev) => {
      if (prev[kpiId]) return prev;
      const total = activeYears.length || Number(draft.vita_utile) || 20;
      const p1 = Math.min(5, total);
      const rest = total - p1;
      const periods = rest > 0
        ? [{ dur: String(p1), val: "" }, { dur: "auto", val: "" }]
        : [{ dur: "auto", val: "" }];
      return { ...prev, [kpiId]: periods };
    });
  }

  function updateKpiPeriod(kpiId, idx, field, value) {
    setKpiPeriods((prev) => {
      const periods = [...(prev[kpiId] ?? [])];
      periods[idx] = { ...periods[idx], [field]: value };
      return { ...prev, [kpiId]: periods };
    });
  }

  function addKpiPeriod(kpiId) {
    setKpiPeriods((prev) => {
      const periods = [...(prev[kpiId] ?? [])];
      const last = periods.pop();
      return { ...prev, [kpiId]: [...periods, { dur: "5", val: "" }, last] };
    });
  }

  function removeKpiPeriod(kpiId) {
    setKpiPeriods((prev) => {
      const periods = [...(prev[kpiId] ?? [])];
      if (periods.length <= 1) return prev;
      const last = periods.pop();
      periods.pop();
      return { ...prev, [kpiId]: [...periods, last] };
    });
  }

  function applyKpiPeriods(kpiId, activeYears) {
    const periods = kpiPeriods[kpiId] ?? [];
    if (!periods.length || !activeYears.length) return;
    const usedDur = periods.slice(0, -1).reduce((acc, p) => acc + Math.max(0, Number(p.dur) || 0), 0);
    const lastDur = Math.max(0, activeYears.length - usedDur);
    const yearMap = {};
    let idx = 0;
    periods.forEach((p, i) => {
      const dur = i === periods.length - 1 ? lastDur : Math.max(0, Number(p.dur) || 0);
      for (let j = 0; j < dur && idx < activeYears.length; j++, idx++) {
        yearMap[activeYears[idx]] = p.val;
      }
    });
    setDraft((prev) => ({
      ...prev,
      benefici_kpi: {
        ...prev.benefici_kpi,
        [kpiId]: {
          ...(prev.benefici_kpi?.[kpiId] ?? {}),
          anni: { ...(prev.benefici_kpi?.[kpiId]?.anni ?? {}), ...yearMap },
          stima: periods[0]?.val ?? prev.benefici_kpi?.[kpiId]?.stima ?? "",
        },
      },
    }));
  }

  function autoFillBenefici() {
    const capex = Number(draft.capex) || 0;
    setDraft((prev) => {
      const tmpl = PROFILO_TEMPLATES[prev.categoria_intervento];
      const endYear = prev.data_fine ? new Date(prev.data_fine + "T00:00:00").getFullYear() + 1 : null;
      const years = endYear ? Array.from({ length: Number(prev.vita_utile) || 20 }, (_, i) => String(endYear + i)) : [];
      const cantiereYrs = yearRangeFromDates(prev.data_inizio, prev.data_fine);
      const kpi = buildDefaultKpi(capex, years, cantiereYrs);
      POC_KPI_TEMPLATE.forEach(({ yearSource, kpis }) => {
        const activeYrs = yearSource === "cantiere" ? cantiereYrs : years;
        kpis.filter((k) => k.tipo === "input").forEach((k) => {
          const profiloVal = getProfiloInputValue(k.profiloKey, tmpl, prev.profilo_dati);
          if (profiloVal != null) {
            const val = String(profiloVal);
            kpi[k.id] = { stima: val, anni: activeYrs.reduce((acc, y) => { acc[y] = val; return acc; }, {}) };
          }
        });
      });
      return { ...prev, benefici_kpi: kpi };
    });
  }

  function clearBenefici() {
    setBeneficiRevealLevel(0);
    setDraft((prev) => {
      const cleared = {};
      POC_KPI_TEMPLATE.forEach(({ kpis }) => kpis.forEach(({ id }) => { cleared[id] = { stima: "", anni: {} }; }));
      return { ...prev, benefici_kpi: cleared };
    });
  }

  function getActiveYearsForKpi(kpiId) {
    const group = POC_KPI_TEMPLATE.find(({ kpis }) => kpis.some((k) => k.id === kpiId));
    return group?.yearSource === "cantiere" ? projectYears : opexYears;
  }

  function isBeneficiKpiFilled(id) {
    const kpiData = draft.benefici_kpi?.[id];
    if (!kpiData) return false;
    const activeYears = getActiveYearsForKpi(id);
    if (activeYears.length > 0) return activeYears.some((year) => String(kpiData.anni?.[year] ?? "").trim() !== "");
    return String(kpiData.stima ?? "").trim() !== "";
  }

  function isBeneficiGroupReady(kpis) {
    const editableKpis = kpis.filter((kpi) => kpi.tipo !== "monetizzazione");
    return editableKpis.length > 0 && editableKpis.every((kpi) => isBeneficiKpiFilled(kpi.id));
  }

  function confirmBeneficiGroup(groupIndex) {
    setBeneficiRevealLevel((current) => Math.max(current, groupIndex + 1));
  }


  function setKpiAllYears(id, value, activeYears) {
    setDraft((prev) => ({
      ...prev,
      benefici_kpi: {
        ...prev.benefici_kpi,
        [id]: {
          ...(prev.benefici_kpi?.[id] ?? {}),
          stima: value,
          anni: activeYears.reduce((acc, y) => { acc[y] = value; return acc; }, {}),
        },
      },
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
      case "profilo":
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
        setAnnoRevealLevel(2);
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
        const cantiereYrs = yearRangeFromDates(prev.data_inizio, prev.data_fine);
        return { ...prev, benefici_kpi: buildDefaultKpi(capex, years, cantiereYrs) };
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
  const opexStartYear = useMemo(() => {
    if (!draft.data_fine) return null;
    return new Date(draft.data_fine + "T00:00:00").getFullYear() + 1;
  }, [draft.data_fine]);
  const opexEndYear = useMemo(() => {
    if (!opexStartYear || !draft.vita_utile) return null;
    return opexStartYear + Number(draft.vita_utile) - 1;
  }, [opexStartYear, draft.vita_utile]);
  const opexYears = useMemo(() => {
    if (!opexStartYear || !opexEndYear) return [];
    return Array.from({ length: opexEndYear - opexStartYear + 1 }, (_, i) => String(opexStartYear + i));
  }, [opexStartYear, opexEndYear]);

  const capexDistribution = buildCapexDistribution(projectYears, draft.capex_distribuzione);
  const opexDistribution = opexYears.reduce((acc, year) => { acc[year] = draft.opex_distribuzione[year] ?? draft.opex_tasso ?? ""; return acc; }, {});
  const capexDistributionTotal = sumPercentageValues(capexDistribution, projectYears);
  const capexYearlyAmounts = projectYears.reduce((acc, year) => { acc[year] = percentageToAmount(draft.capex, capexDistribution[year]); return acc; }, {});
  const opexYearlyAmounts = opexYears.reduce((acc, year) => {
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
  const profiloTemplate = useMemo(
    () => PROFILO_TEMPLATES[draft.categoria_intervento] ?? PROFILO_TEMPLATES[draft.sotto_settore] ?? null,
    [draft.categoria_intervento, draft.sotto_settore],
  );
  const profiloCapexStima = useMemo(
    () => profiloTemplate?.stimaCapex?.(draft.profilo_dati) ?? 0,
    [profiloTemplate, draft.profilo_dati],
  );

  // Pre-fill anno from data_inizio
  useEffect(() => {
    if (step.id !== "anno") return;
    if (!draft.anno_attualizzazione && draft.data_inizio) {
      const year = String(new Date(draft.data_inizio + "T00:00:00").getFullYear());
      if (ANNI.includes(year)) update("anno_attualizzazione", year);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  // Pre-fill profilo field defaults when entering the step
  useEffect(() => {
    if (step.id !== "profilo") return;
    setDraft((prev) => {
      const tpl = PROFILO_TEMPLATES[prev.categoria_intervento] ?? PROFILO_TEMPLATES[prev.sotto_settore];
      if (!tpl) return prev;
      const dati = { ...prev.profilo_dati };
      let changed = false;
      tpl.campi.forEach((c) => {
        if (c.default != null && (dati[c.id] == null || dati[c.id] === "")) {
          dati[c.id] = String(c.default).replace(".", ",");
          changed = true;
        }
      });
      return changed ? { ...prev, profilo_dati: dati } : prev;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  // Pre-fill capex: prefer profilo estimate, fall back to sector default
  useEffect(() => {
    if (step.id !== "capex") return;
    setDraft((prev) => {
      if (prev.capex) return prev;
      const tpl = PROFILO_TEMPLATES[prev.categoria_intervento] ?? PROFILO_TEMPLATES[prev.sotto_settore];
      const stima = tpl?.stimaCapex?.(prev.profilo_dati);
      const capex = stima && stima > 0
        ? String(Math.round(stima))
        : String(CAPEX_DEFAULTS[prev.settore] ?? CAPEX_DEFAULT_FALLBACK);
      return { ...prev, capex };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  useEffect(() => {
    if (step.id === "opex" && (draft.vita_utile === "" || draft.vita_utile == null)) {
      update("vita_utile", vitaUtileBenchmark.avg);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  useEffect(() => {
    if (opexRevealLevel >= 1 && !draft.opex_tasso) {
      update("opex_tasso", String(opexBenchmark.avg).replace(".", ","));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opexRevealLevel]);
  const opexTotale = useMemo(() => opexAnnualAmount * Number(draft.vita_utile), [opexAnnualAmount, draft.vita_utile]);

  const beneficiTemplates = POC_KPI_TEMPLATE;
  const beneficiFactorTotal = beneficiTemplates.length;
  const beneficiConfiguredCount = Math.min(beneficiRevealLevel, beneficiFactorTotal);
  const beneficiGroupStats = useMemo(() => {
    return POC_KPI_TEMPLATE.map(({ group, esternalita, kpis, yearSource }) => {
      const activeYears = yearSource === "cantiere" ? projectYears : opexYears;
      const filled = kpis.filter(({ id }) => {
        const kpiData = draft.benefici_kpi?.[id];
        if (!kpiData) return false;
        if (activeYears.length > 0) return activeYears.some((y) => (kpiData.anni?.[y] ?? "") !== "");
        return (kpiData.stima ?? "") !== "";
      }).length;
      return { group, esternalita, filled, total: kpis.length };
    });
  }, [draft.benefici_kpi, opexYears, projectYears]);

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
      case "profilo": {
        if (!profiloTemplate) return true;
        const requiredFields = profiloTemplate.campi.filter((c) => c.default == null);
        return requiredFields.every((f) => {
          const v = draft.profilo_dati?.[f.id];
          return v != null && String(v).trim() !== "";
        });
      }
      case "durata":
        return !!draft.data_inizio && !!draft.data_fine;
      case "localizzazione":
        return draft.localizzazione.trim().length > 2;
      case "anno":
        return annoRevealLevel >= 2 && !!draft.anno_attualizzazione && !!draft.tasso_attualizzazione.trim();
      case "capex":
        return draft.capex.trim().length > 0 && (!draft.capex_distribuzione_attiva || Math.abs(capexDistributionTotal - 100) < 0.001);
      case "opex":
        return !!draft.vita_utile && draft.opex_tasso.trim().length > 0;
      case "benefici":
        return draft.benefici_kpi !== null && beneficiFactorTotal > 0 && beneficiRevealLevel >= beneficiFactorTotal;
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
            {["nome", "descrizione", "classificazione", "durata"].includes(step.id) && (
              <div className="mb-5 flex justify-end">
                <button
                  type="button"
                  onClick={autoFillCurrentStep}
                  className="border border-brand-violet bg-white px-4 py-2 text-[13px] font-semibold text-brand-violet transition-colors hover:bg-brand-violet-soft"
                >
                  {STEP_AUTOFILL_LABEL}
                </button>
              </div>
            )}
            {step.id === "nome" ? (
              <>
                <QuestionHeader
                  title="Per prima cosa: che NOME vorresti dare al tuo progetto?"
                  description="Ti consigliamo di dare al tuo progetto un nome semplice, riconoscibile, che sia di facile identificazione anche per i tuoi collaboratori. Se ne sei già in possesso, ma non è obbligatorio integrarlo, indica il CUP."
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
                  description="Inserisci in poche righe le finalità, gli ambiti di intervento e gli obiettivi del progetto. Queste informazioni sono utili per contestualizzare la proposta e attivare i percorsi di valutazione più appropriati."
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
                <QuestionHeader title="Qual è lo STATO del progetto?" description="Indica la fase in cui si trova il tuo progetto." type="Risposta singola" />
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

            {step.id === "profilo" ? (
              <>
                <QuestionHeader
                  title="Caratteristiche fisiche del progetto"
                  description="Indica le dimensioni principali del progetto. Questi dati saranno usati per stimare il CAPEX e alimentare i benefici attesi."
                />
                {profiloTemplate ? (
                  <div className="max-w-3xl overflow-hidden border border-ink-100 bg-white">
                    <div className="flex items-center gap-3 border-b border-ink-100 bg-[#f7f7fa] px-5 py-3">
                      <p className="text-[14px] font-semibold text-ink-900">{profiloTemplate.titolo}</p>
                      <span className="ml-auto text-[11px] font-medium text-ink-400">{draft.categoria_intervento}</span>
                    </div>
                    <div className="divide-y divide-[#ececf1]">
                      {profiloTemplate.campi.filter((c) => c.default == null).map((campo) => (
                        <div key={campo.id} className="flex flex-col gap-1.5 px-6 py-5 sm:flex-row sm:items-center sm:gap-6">
                          <label className="w-[240px] shrink-0 text-[14px] font-semibold text-ink-900">
                            {campo.label}
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              value={draft.profilo_dati[campo.id] ?? ""}
                              onChange={(e) => updateProfiloDati(campo.id, e.target.value.replace(/[^\d.,]/g, ""))}
                              placeholder={campo.placeholder ?? ""}
                              className="h-10 w-[160px] border border-ink-200 bg-white px-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                            />
                            <span className="text-[14px] font-semibold text-ink-500">{campo.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl border border-ink-100 bg-white p-6">
                    <p className="text-[14px] text-ink-600">
                      Nessun parametro specifico disponibile per{" "}
                      <strong>{draft.categoria_intervento || "questa categoria"}</strong>.
                      Potrai inserire il CAPEX direttamente nel passo successivo.
                    </p>
                  </div>
                )}
              </>
            ) : null}

            {step.id === "durata" ? (
              <>
                <QuestionHeader
                  title="Perfetto, quale sarà la DURATA del progetto?"
                  description="Indica il periodo previsto dalla fase di avvio lavori alla piena operatività. Questa informazione è importante per programmare correttamente le attività, stimare i costi e valutare la sostenibilità nel tempo e i benefici nel progetto."
                />
                <div className="grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-2">
                  <DatePickerField
                    label="Data di inizio"
                    hint="Formato data gg/mm/aaaa"
                    value={draft.data_inizio}
                    onChange={(value) => {
                      setDraft((prev) => ({
                        ...prev,
                        data_inizio: value,
                        ...(prev.data_fine && value >= prev.data_fine ? { data_fine: "" } : {}),
                      }));
                    }}
                  />
                  <DatePickerField
                    label="Data di fine"
                    hint="Formato data gg/mm/aaaa"
                    value={draft.data_fine}
                    minDate={draft.data_inizio || null}
                    onChange={(value) => update("data_fine", value)}
                  />
                </div>
              </>
            ) : null}

            {step.id === "localizzazione" ? (
              <>
                <QuestionHeader
                  title="Dove avrà LUOGO il tuo progetto?"
                  description="Inserisci l'area geografica in cui sarà realizzato il progetto. Questa informazione consente di collegare il progetto al territorio, attivare dati socio-territoriali rilevanti e fornire analisi contestualizzate su impatti ambientali, sociali ed economici."
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
                  title="Anno di attualizzazione e tasso di sconto sociale"
                  description="Seleziona l'anno di attualizzazione: rappresenta il punto di riferimento temporale dell'analisi. Successivamente potrai confermare o modificare il tasso di sconto sociale."
                  type="Risposta singola"
                />
                <div className="max-w-4xl space-y-3">

                  {/* ── Section 1: Anno di attualizzazione ── */}
                  <ClassAccordion
                    number="1"
                    title="Anno di attualizzazione"
                    selectedLabel={annoRevealLevel > 0 ? `${draft.anno_attualizzazione}` : null}
                    isCompleted={annoRevealLevel > 0}
                    onEdit={() => setAnnoRevealLevel(0)}
                  >
                    <p className="mb-4 text-[13px] leading-[1.5] text-ink-600">
                      L'anno di attualizzazione è il punto di partenza dell'analisi economica. Da questo momento costi e benefici futuri vengono riportati a un riferimento temporale coerente e confrontabile.
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
                      Conferma anno di attualizzazione
                      <span className="text-[16px] leading-none">→</span>
                    </button>
                  </ClassAccordion>

                  {/* ── Section 2: Tasso di sconto sociale ── */}
                  {annoRevealLevel >= 1 ? (
                    <ClassAccordion
                      number="2"
                      title="Tasso di sconto sociale"
                      selectedLabel={annoRevealLevel >= 2 ? `${draft.tasso_attualizzazione}%` : null}
                      isCompleted={annoRevealLevel >= 2}
                      onEdit={() => setAnnoRevealLevel(1)}
                    >
                      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                        <div>
                          <p className="mb-3 text-[13px] leading-[1.5] text-ink-600">
                            Il tasso di sconto sociale misura quanto la collettività preferisce i benefici presenti rispetto a quelli futuri. Valori più bassi danno maggiore peso alle generazioni future.
                          </p>
                          <p className="mb-2 text-[13px] font-semibold text-ink-900">Tasso di sconto (%)</p>
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
                            <p><strong>3,0%</strong> — valore di riferimento standard UE (raccomandato)</p>
                            <p><strong>5,0%</strong> — ipotesi prudente, condizioni finanziarie restrittive</p>
                          </div>
                          <div className="mt-4 rounded-sm bg-white px-3 py-2.5 text-[11px] leading-[1.55] text-ink-600">
                            Un tasso più alto riduce il peso dei benefici lontani nel tempo. Usa il 3% come punto di partenza per analisi standard in linea con le linee guida della Commissione Europea.
                          </div>
                        </aside>
                      </div>
                      <button
                        type="button"
                        disabled={!draft.tasso_attualizzazione.trim()}
                        onClick={() => setAnnoRevealLevel(2)}
                        className={`mt-5 flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold transition-colors ${draft.tasso_attualizzazione.trim() ? "bg-brand-violet text-white hover:bg-brand-violet-dark" : "cursor-not-allowed bg-ink-100 text-ink-300"}`}
                      >
                        Conferma tasso di sconto
                        <span className="text-[16px] leading-none">→</span>
                      </button>
                    </ClassAccordion>
                  ) : null}
                </div>
              </>
            ) : null}

            {step.id === "capex" ? (
              <>
                <QuestionHeader title="Qual è il CAPEX?" description="Inserisci l'importo complessivo degli investimenti previsti, spese in conto capitale, per la realizzazione del progetto." />
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
                      {profiloTemplate && profiloCapexStima > 0 ? (
                        <div className="flex items-start gap-2 rounded border border-brand-violet/25 bg-brand-violet-soft px-4 py-3 sm:max-w-[340px]">
                          <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                          </svg>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-violet">Calcolo dal profilo progetto</p>
                            <p className="mt-1 font-mono text-[12px] leading-[1.7] text-ink-800">
                              {buildProfiloFormula(profiloTemplate, draft.profilo_dati)}
                            </p>
                            <p className="mt-1.5 text-[11px] text-ink-500">Puoi modificare il valore liberamente.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 rounded border border-[#e8e8ed] bg-[#f7f7fa] px-4 py-2.5 sm:max-w-[280px]">
                          <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                          </svg>
                          <p className="text-[11px] leading-[1.5] text-ink-600">
                            Il valore suggerito è basato sulla <strong>categoria di intervento</strong> selezionata e sulla dimensione tipica degli interventi di questo tipo. Puoi modificarlo liberamente.
                          </p>
                        </div>
                      )}
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
                        Se non personalizzi la distribuzione, il CAPEX verrà suddiviso <strong>equamente</strong> tra gli anni di intervento.
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

                      {/* Input */}
                      <p className="mb-2 text-[13px] font-semibold text-ink-900">Anni di vita utile</p>
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
                        <div className="flex items-center gap-3 border-b border-[#ececf1] px-5 py-4">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-violet text-[12px] font-bold text-white">2</span>
                          <p className="text-[14px] font-semibold text-ink-900">Tasso OPEX annuale</p>
                        </div>
                        <div className="p-5">
                          {/* Input */}
                          <p className="mb-2 text-[13px] font-semibold text-ink-900">Tasso OPEX (% del CAPEX / anno)</p>
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
                                      opex_distribuzione: opexYears.reduce((acc, y) => {
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
                                  {opexYears.map((year) => (
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
                  title="Benefici attesi del progetto"
                  description="Verifica il modello ECBA proposto, completa i KPI principali e, quando serve, differenzia i valori lungo la vita utile del progetto."
                />

                <div className="grid max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="space-y-4">
                    <div className="border border-ink-100 bg-white p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-[14px] font-semibold text-ink-900">Modello ECBA per fattori di monetizzazione</p>
                          <p className="mt-1 text-[12px] leading-[1.5] text-ink-500">
                            Procedi un KPI alla volta: verifica i parametri, conferma il blocco e passa al successivo.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={autoFillBenefici}
                            className="border border-brand-violet bg-white px-4 py-2 text-[12px] font-semibold text-brand-violet hover:bg-brand-violet-soft"
                          >
                            Aggiorna valori suggeriti
                          </button>
                          <button
                            type="button"
                            onClick={clearBenefici}
                            className="border border-ink-200 bg-white px-4 py-2 text-[12px] font-semibold text-ink-600 hover:border-ink-400 hover:bg-[#fafafa]"
                          >
                            Svuota valori
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="border border-[#ececf1] bg-[#f7f7fa] px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">KPI confermati</p>
                          <p className="mt-1 text-[20px] font-bold text-ink-900">{beneficiConfiguredCount}/{beneficiFactorTotal}</p>
                        </div>
                        <div className="border border-[#ececf1] bg-[#f7f7fa] px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Periodo benefici</p>
                          <p className="mt-1 text-[14px] font-semibold text-ink-900">
                            {opexYears.length > 0 ? `${opexYears[0]}-${opexYears[opexYears.length - 1]}` : "Non definito"}
                          </p>
                        </div>
                        <div className="border border-[#ececf1] bg-[#f7f7fa] px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Vita utile</p>
                          <p className="mt-1 text-[14px] font-semibold text-ink-900">{draft.vita_utile || "-"} anni</p>
                        </div>
                      </div>
                    </div>
                  {beneficiTemplates.length === 0 ? (
                    <div className="border border-ink-100 bg-white px-5 py-6 text-[14px] text-ink-500">
                      Nessun modello disponibile per il settore selezionato.
                    </div>
                  ) : null}

                  {beneficiTemplates.map(({ group, esternalita, kpis, yearSource }, groupIndex) => {
                    const activeYears  = yearSource === "cantiere" ? projectYears : opexYears;
                    const editableKpis = kpis.filter((k) => k.tipo !== "monetizzazione");
                    const monetKpis    = kpis.filter((k) => k.tipo === "monetizzazione");
                    const capexNum     = Number(draft.capex) || 0;
                    const isPositiva   = esternalita !== "negativa";
                    const groupStat = beneficiGroupStats.find((item) => item.group === group);
                    const groupReady = isBeneficiGroupReady(kpis);
                    const isCompleted = groupIndex < beneficiRevealLevel;

                    if (groupIndex > beneficiRevealLevel) return null;

                    return (
                      <ClassAccordion
                        key={group}
                        number={String(groupIndex + 1)}
                        title={group}
                        selectedLabel={`${groupStat?.filled ?? 0}/${kpis.length} parametri verificati`}
                        isCompleted={isCompleted}
                        onEdit={() => setBeneficiRevealLevel(groupIndex)}
                      >
                        <div className="overflow-hidden border border-ink-100 bg-white">
                        {/* ── Header ── */}
                        <div className="flex flex-col gap-3 border-b border-[#ececf1] bg-[#f7f7fa] px-5 py-4 md:flex-row md:items-center">
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${isPositiva ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>
                            {isPositiva ? "+" : "−"}
                          </span>
                          <p className="min-w-0 flex-1 text-[14px] font-semibold text-ink-900">{group}</p>
                          <span className="shrink-0 text-[12px] font-semibold text-ink-500">
                            {beneficiGroupStats.find((item) => item.group === group)?.filled ?? 0}/{kpis.length} KPI
                          </span>
                          <span className={`text-[12px] font-medium ${isPositiva ? "text-emerald-600" : "text-red-500"}`}>
                            {isPositiva ? "Esternalità positiva" : "Esternalità negativa"}
                          </span>
                        </div>

                        {/* ── KPI rows ── */}
                        {editableKpis.map((kpi) => {
                          const profiloVal = kpi.tipo === "input"
                            ? getProfiloInputValue(kpi.profiloKey, profiloTemplate, draft.profilo_dati)
                            : null;
                          const refVal = profiloVal != null
                            ? String(profiloVal)
                            : String(kpi.estimateFn({ settore: draft.settore, capex: capexNum }));
                          const kpiData = draft.benefici_kpi?.[kpi.id];
                          const annualValues = activeYears.map((year) => String(kpiData?.anni?.[year] ?? "").trim());
                          const nonEmptyAnnualValues = annualValues.filter(Boolean);
                          const uniqueAnnualValues = [...new Set(nonEmptyAnnualValues)];
                          const hasMixedYearValues = uniqueAnnualValues.length > 1;
                          const currentVal = hasMixedYearValues
                            ? ""
                            : nonEmptyAnnualValues[0] ?? kpiData?.stima ?? "";
                          const hasValueDifferentFromRef = hasMixedYearValues
                            ? uniqueAnnualValues.some((value) => !valuesEquivalent(value, refVal))
                            : currentVal !== "" && !valuesEquivalent(currentVal, refVal);
                          const warningType = hasValueDifferentFromRef
                            ? (profiloVal != null ? "red" : "gray")
                            : null;
                          const inputBorderCls = warningType === "red"
                            ? "border-red-400 bg-red-50"
                            : warningType === "gray"
                              ? "border-ink-300 bg-[#f7f7fa]"
                              : "border-ink-200 bg-white";
                          const isOpen = !!kpiDetailOpen[kpi.id];
                          const periods = kpiPeriods[kpi.id] ?? [];
                          const usedDurTotal = periods.slice(0, -1).reduce((acc, p) => acc + Math.max(0, Number(p.dur) || 0), 0);
                          const lastPeriodDur = Math.max(0, activeYears.length - usedDurTotal);

                          return (
                            <div key={kpi.id} className="border-t border-[#f0f0f3]">
                              {/* Main row */}
                              <div className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1fr)_260px] md:items-center">
                                <div className="min-w-0">
                                  <div className="flex items-start gap-3">
                                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${kpi.tipo === "input" ? "bg-brand-violet" : "bg-ink-300"}`} />
                                    <div className="min-w-0">
                                      <p className="text-[13px] font-semibold leading-[1.35] text-ink-900">{kpi.label}</p>
                                  {kpi.tipo === "input" && profiloVal == null ? (
                                        <p className="mt-1 text-[11px] leading-[1.4] text-ink-400">Suggerito: {refVal} {kpi.unit}</p>
                                  ) : kpi.tipo === "input" && profiloVal != null ? (
                                        <p className="mt-1 text-[11px] leading-[1.4] text-ink-400">Dal profilo progetto: {refVal} {kpi.unit}</p>
                                  ) : kpi.tipo === "tecnico" ? (
                                        <p className="mt-1 text-[11px] leading-[1.4] text-ink-400">Stima tecnica: {refVal} {kpi.unit}</p>
                                  ) : null}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-start gap-2 md:justify-end">
                                  <input
                                    value={currentVal}
                                    onChange={(e) => setKpiAllYears(kpi.id, e.target.value, activeYears)}
                                    placeholder={hasMixedYearValues ? "Valori misti" : refVal}
                                    className={`h-10 w-[132px] border ${inputBorderCls} px-3 text-right text-[13px] font-semibold text-ink-900 focus:border-brand-violet focus:outline-none`}
                                  />
                                  <span className="w-[120px] shrink-0 whitespace-nowrap text-[12px] text-ink-400">{kpi.unit}</span>
                                  <button
                                    type="button"
                                    onClick={() => toggleKpiDetail(kpi.id, activeYears)}
                                    title="Configura valori per anno"
                                    aria-label="Configura valori per anno"
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${isOpen ? "border-brand-violet bg-brand-violet text-white" : "border-ink-200 bg-white text-ink-400 hover:border-brand-violet hover:text-brand-violet"}`}
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              {/* Warning */}
                              {warningType === "red" ? (
                                <p className="px-5 pb-2 text-[11px] text-red-600">
                                  ⚠ Valore modificato rispetto al profilo — suggerito: {refVal} {kpi.unit}
                                </p>
                              ) : warningType === "gray" ? (
                                <p className="px-5 pb-2 text-[11px] text-ink-400">
                                  Valore diverso dal suggerito ({refVal} {kpi.unit})
                                </p>
                              ) : null}
                              {hasMixedYearValues ? (
                                <p className="px-5 pb-2 text-[11px] text-brand-violet">
                                  Valori differenziati per anno. Inserisci un valore qui per applicarlo a tutto il periodo.
                                </p>
                              ) : null}
                              {/* Per-year detail panel */}
                              {isOpen ? (
                                <div className="border-t border-[#f0f0f3] bg-[#f7f7fa] px-5 pb-4 pt-3">
                                  <div className="mb-3">
                                    <div className="mb-2 flex items-center gap-2">
                                      <p className="text-[12px] font-semibold text-ink-600">Per periodi</p>
                                      {periods.length > 1 ? (
                                        <button type="button" onClick={() => removeKpiPeriod(kpi.id)} className="border border-ink-200 bg-white px-2 py-0.5 text-[11px] font-medium text-ink-500 hover:border-ink-400">
                                          − periodo
                                        </button>
                                      ) : null}
                                      <button type="button" onClick={() => addKpiPeriod(kpi.id)} className="border border-ink-200 bg-white px-2 py-0.5 text-[11px] font-medium text-ink-500 hover:border-ink-400">
                                        + periodo
                                      </button>
                                    </div>
                                    <div className="space-y-1.5">
                                      {periods.map((period, periodIdx) => {
                                        const isLast = periodIdx === periods.length - 1;
                                        const effectiveDur = isLast ? lastPeriodDur : Math.max(0, Number(period.dur) || 0);
                                        return (
                                          <div key={periodIdx} className="flex items-center gap-2">
                                            <span className="w-[70px] shrink-0 text-[12px] text-ink-500">{isLast ? "Rimanenti" : "Anni"}</span>
                                            {isLast ? (
                                              <span className="w-[44px] py-1 text-center text-[12px] font-bold text-ink-400">{effectiveDur}</span>
                                            ) : (
                                              <input
                                                type="number"
                                                min={1}
                                                value={period.dur}
                                                onChange={(e) => updateKpiPeriod(kpi.id, periodIdx, "dur", e.target.value)}
                                                className="w-[44px] border border-ink-200 bg-white px-1 py-1 text-center text-[12px] font-semibold text-ink-900 focus:border-brand-violet focus:outline-none"
                                              />
                                            )}
                                            <span className="text-[12px] text-ink-400">anni →</span>
                                            <input
                                              type="text"
                                              value={period.val}
                                              onChange={(e) => updateKpiPeriod(kpi.id, periodIdx, "val", e.target.value)}
                                              placeholder="valore"
                                              className="w-[72px] border border-ink-200 bg-white px-2 py-1 text-right text-[12px] font-semibold text-ink-900 focus:border-brand-violet focus:outline-none"
                                            />
                                            <span className="shrink-0 whitespace-nowrap text-[11px] text-ink-400">{kpi.unit}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => applyKpiPeriods(kpi.id, activeYears)}
                                      className="mt-2.5 bg-brand-violet px-3 py-1.5 text-[12px] font-semibold text-white hover:opacity-90"
                                    >
                                      Applica periodi →
                                    </button>
                                  </div>
                                  {activeYears.length > 0 ? (
                                    <div className="border-t border-[#e8e8ec] pt-3">
                                      <p className="mb-2 text-[12px] font-medium text-ink-500">Valori per anno</p>
                                      <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))" }}>
                                        {activeYears.map((y) => {
                                          const val = draft.benefici_kpi?.[kpi.id]?.anni?.[y] ?? "";
                                          return (
                                            <div key={y} className="flex flex-col gap-0.5">
                                              <span className="text-center text-[10px] text-ink-400">{y}</span>
                                              <input
                                                value={val}
                                                onChange={(e) => updateBeneficiKpiYear(kpi.id, y, e.target.value)}
                                                className="h-7 w-full border border-ink-200 bg-white px-1 text-center text-[12px] font-semibold text-ink-900 focus:border-brand-violet focus:outline-none"
                                              />
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}

                        {/* ── Fattore di monetizzazione ── */}
                        {monetKpis.map((kpi) => (
                          <div key={kpi.id} className="border-t border-[#f0f0f3] bg-[#fcfcfd]">
                            <div className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1fr)_260px] md:items-center">
                              <div className="min-w-0">
                                <div className="flex items-start gap-3">
                                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center text-ink-400">
                                    <LockIcon />
                                  </span>
                                  <div className="min-w-0">
                                    <p className="text-[13px] font-semibold leading-[1.35] text-ink-900">{kpi.label}</p>
                                    <p className="mt-1 text-[11px] leading-[1.4] text-ink-400">Valore monetario fissato</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-start gap-2 md:justify-end">
                                <div className="flex h-10 w-[132px] items-center justify-end gap-2 border border-ink-200 bg-[#f7f7fa] px-3 text-right text-[13px] font-semibold text-ink-900">
                                  <LockIcon className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                                  <span className="font-mono">
                                  {draft.benefici_kpi?.[kpi.id]?.stima ?? "—"}
                                  </span>
                                </div>
                                <span className="w-[120px] shrink-0 whitespace-nowrap text-[12px] text-ink-400">{kpi.unit}</span>
                                <span className="h-9 w-9 shrink-0" />
                              </div>
                            </div>
                          </div>
                        ))}

                        {activeYears.length > 0 ? (
                          <div className="border-t border-[#f0f0f3] px-5 py-2.5">
                            <p className="text-[11px] text-ink-400">
                              Il valore inserito verrà applicato a tutti i {activeYears.length} anni ({activeYears[0]}–{activeYears[activeYears.length - 1]}). Usa l'icona calendario per configurare valori differenziati per periodo.
                            </p>
                          </div>
                        ) : null}
                          <div className="border-t border-[#ececf1] bg-white px-5 py-4">
                            <button
                              type="button"
                              disabled={!groupReady}
                              onClick={() => confirmBeneficiGroup(groupIndex)}
                              className={`flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold transition-colors ${
                                groupReady
                                  ? "bg-brand-violet text-white hover:bg-brand-violet-dark"
                                  : "cursor-not-allowed bg-ink-100 text-ink-300"
                              }`}
                            >
                              {groupIndex === beneficiFactorTotal - 1 ? "Conferma KPI ECBA" : "Conferma e passa al KPI successivo"}
                              <span className="text-[16px] leading-none">&rarr;</span>
                            </button>
                          </div>
                        </div>
                      </ClassAccordion>
                    );
                  })}
                  </div>

                  <aside className="h-fit border border-[#e8e8ed] bg-white p-5">
                    <p className="text-[14px] font-semibold text-ink-900">Stato ECBA</p>
                    <p className="mt-1 text-[12px] leading-[1.5] text-ink-600">
                      Controlla completezza, segno delle esternalità e periodo usato per la valutazione.
                    </p>
                    <div className="mt-5 border-t border-[#ececf1] pt-4">
                      <div className="flex items-end justify-between">
                        <span className="text-[12px] text-ink-500">KPI confermati</span>
                        <span className="text-[22px] font-bold text-brand-violet">{beneficiConfiguredCount}/{beneficiFactorTotal}</span>
                      </div>
                      <div className="mt-2 h-[6px] overflow-hidden bg-[#e7e7ea]">
                        <div
                          className="h-full bg-brand-violet transition-[width] duration-300"
                          style={{ width: `${beneficiFactorTotal ? (beneficiConfiguredCount / beneficiFactorTotal) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-5 space-y-3 border-t border-[#ececf1] pt-4">
                      {beneficiGroupStats.map((stat, statIndex) => {
                        const isPositiva = stat.esternalita !== "negativa";
                        const statusLabel = statIndex < beneficiRevealLevel
                          ? "Confermato"
                          : statIndex === beneficiRevealLevel
                            ? "In corso"
                            : "Da verificare";
                        return (
                          <div key={stat.group} className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-[12px] font-semibold text-ink-800">{stat.group}</p>
                              <p className={`mt-0.5 text-[11px] ${isPositiva ? "text-emerald-600" : "text-red-500"}`}>
                                {isPositiva ? "Positiva" : "Negativa"}
                              </p>
                            </div>
                            <span className={`shrink-0 text-[11px] font-bold ${statIndex < beneficiRevealLevel ? "text-brand-violet" : "text-ink-400"}`}>
                              {statusLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-5 space-y-3 border-t border-[#ececf1] pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-ink-500">CAPEX</span>
                        <span className="text-[13px] font-semibold text-ink-900">{draft.capex ? `${fmt(draft.capex)} EUR` : "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-ink-500">Tasso sconto</span>
                        <span className="text-[13px] font-semibold text-ink-900">{draft.tasso_attualizzazione || "-"}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-ink-500">Periodo</span>
                        <span className="text-[13px] font-semibold text-ink-900">
                          {opexYears.length > 0 ? `${opexYears[0]}-${opexYears[opexYears.length - 1]}` : "-"}
                        </span>
                      </div>
                    </div>
                  </aside>
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
