// Sostituisce i KPI benefici dell'asilo nido (NID-01..04) con il set ad-hoc
// ripulito (NID-00 valore servizio + NID-01..04 additivi, senza doppi conteggi).
// Idempotente: se NID-00 esiste già, non fa nulla.
//   node scripts/patch-nido-kpi.cjs
const fs = require("fs");
const path = require("path");
const P = path.join(__dirname, "..", "app", "src", "poc", "data", "poc_docfap", "kpi_benefits_layer2.ts");
let s = fs.readFileSync(P, "utf8");

if (s.includes("id: 'NID-00'")) {
  console.log("NID-00 già presente: nessuna modifica.");
  process.exit(0);
}

const eol = s.includes("\r\n") ? "\r\n" : "\n";
const nidIdx = s.indexOf("id: 'NID-01'");
const ediIdx = s.indexOf("id: 'EDI-01'");
if (nidIdx < 0 || ediIdx < 0) {
  console.error("Marker id non trovato:", { nidIdx, ediIdx });
  process.exit(1);
}
// Inizio = inizio della riga che contiene il '{' dell'oggetto NID-01.
const nidBrace = s.lastIndexOf("{", nidIdx);
const start = s.lastIndexOf("\n", nidBrace) + 1;
// Fine = inizio della riga che contiene il '{' dell'oggetto EDI-01.
const ediBrace = s.lastIndexOf("{", ediIdx);
const end = s.lastIndexOf("\n", ediBrace) + 1;

const block = `  {
    id: 'NID-00',
    beneficio_label: 'B4e — Valore del servizio educativo (custodia e cura 0-3)',
    label_utente: 'Valore del servizio educativo (custodia e cura 0-3)',
    categoria_beneficio: 'Servizio educativo — valore uso corrente',
    metodo_valorizzazione: 'Costo evitato / WTP',
    variables: [
      { var_name: 'A', description: 'Posti nido serviti', table: 'input_params', code: 'com_src_utentiserviziinfanzia_y', val_check: null, label_utente: 'Posti nido serviti (0-3 anni)', valore_tipo: 350 },
      { var_name: 'B', description: 'Valore annuo del servizio per posto', table: 'monetization_factors', code: 'MF-IST-NIDO', val_check: 7000, label_utente: 'Valore annuo del servizio educativo per posto' },
    ],
    formula: 'A * B',
    fonti: [
      { tipo: 'bibliografia', label: 'LG MEF-NUVAP 2017', riferimento: 'LG MEF-NUVAP 2017', codice_origine: null },
      { tipo: 'dato', label: 'ISTAT costo servizi prima infanzia', riferimento: 'ISTAT costo servizi prima infanzia', codice_origine: null },
    ],
    note: 'Valore uso corrente del servizio (custodia/educazione). Esclude gli effetti di lungo periodo, contabilizzati in NID-01..04: nessun doppio conteggio.',
    attivo: true,
    annual_growth_rate: 0,
  },
  {
    id: 'NID-01',
    beneficio_label: 'B4a — Maggior reddito da sviluppo cognitivo precoce (capitale umano)',
    label_utente: 'Maggior reddito da sviluppo cognitivo precoce',
    categoria_beneficio: 'Capitale umano — sviluppo',
    metodo_valorizzazione: 'HC',
    variables: [
      { var_name: 'A', description: 'Posti nido serviti', table: 'input_params', code: 'com_src_utentiserviziinfanzia_y', val_check: null, label_utente: 'Posti nido serviti (0-3 anni)', valore_tipo: 350 },
      { var_name: 'B', description: 'com_avg_reddito_lavoro_y', table: 'statistics', code: 'com_avg_reddito_lavoro_y', val_check: null, label_utente: 'Reddito medio da lavoro', valore_tipo: 23000 },
      { var_name: 'C', description: 'uplift reddito lifetime da nido', table: 'fixed_params', code: 'FP-IST-017', val_check: 0.05, label_utente: 'Uplift reddito attribuibile al nido (quota annua)' },
    ],
    formula: 'A * B * C',
    fonti: [
      { tipo: 'bibliografia', label: 'Heckman (2006) Science', riferimento: 'Heckman (2006) Science', codice_origine: null },
      { tipo: 'bibliografia', label: 'LG MEF-NUVAP 2017', riferimento: 'LG MEF-NUVAP 2017', codice_origine: null },
    ],
    note: 'Sola componente reddito da capitale umano (no composito Perry): additiva con NID-02..04.',
    attivo: true,
    annual_growth_rate: 0,
  },
  {
    id: 'NID-02',
    beneficio_label: 'B4b — Occupazione femminile attivata (conciliazione)',
    label_utente: 'Occupazione femminile attivata (conciliazione)',
    categoria_beneficio: 'Occupazione — Genere',
    metodo_valorizzazione: 'CBA-Mkt',
    variables: [
      { var_name: 'A', description: 'Posti nido serviti', table: 'input_params', code: 'com_src_utentiserviziinfanzia_y', val_check: null, label_utente: 'Posti nido serviti (0-3 anni)', valore_tipo: 350 },
      { var_name: 'B', description: 'com_avg_reddito_lavoro_y', table: 'statistics', code: 'com_avg_reddito_lavoro_y', val_check: null, label_utente: 'Reddito medio da lavoro', valore_tipo: 23000 },
      { var_name: 'C', description: 'elasticita occupazione femminile', table: 'fixed_params', code: 'FP-IST-022', val_check: 0.012, label_utente: 'Elasticita occupazione femminile da nido 0-3' },
    ],
    formula: 'A * B * C',
    fonti: [
      { tipo: 'bibliografia', label: 'De Paola et al. (2018) IZA', riferimento: 'De Paola et al. (2018) IZA', codice_origine: null },
      { tipo: 'bibliografia', label: 'LG MEF-NUVAP 2017', riferimento: 'LG MEF-NUVAP 2017', codice_origine: null },
    ],
    note: 'Reddito attivato per genitori (soprattutto madri) che possono lavorare grazie al nido.',
    attivo: true,
    annual_growth_rate: 0,
  },
  {
    id: 'NID-03',
    beneficio_label: 'B4c — Risparmio sanitario da minori ospedalizzazioni 0-3',
    label_utente: 'Risparmio sanitario da minori ospedalizzazioni 0-3',
    categoria_beneficio: 'Salute materno-infantile',
    metodo_valorizzazione: 'DRG/SSN',
    variables: [
      { var_name: 'A', description: 'Posti nido serviti', table: 'input_params', code: 'com_src_utentiserviziinfanzia_y', val_check: null, label_utente: 'Posti nido serviti (0-3 anni)', valore_tipo: 350 },
      { var_name: 'B', description: 'tasso ospedalizzazioni evitate 0-3', table: 'fixed_params', code: 'FP-IST-031', val_check: 0.06, label_utente: 'Tasso di ospedalizzazioni evitate (0-3)' },
      { var_name: 'C', description: 'Costo medio di un ricovero ospedaliero', table: 'monetization_factors', code: 'MF-CIV-DRG', val_check: 3500, label_utente: 'Costo medio di un ricovero ospedaliero' },
    ],
    formula: 'A * B * C',
    fonti: [
      { tipo: 'bibliografia', label: 'WHO (2022) Early Childhood', riferimento: 'WHO (2022) Early Childhood', codice_origine: null },
      { tipo: 'bibliografia', label: 'Min. Salute DRG 2022', riferimento: 'Min. Salute DRG 2022', codice_origine: null },
    ],
    note: 'Minori ricoveri pediatrici da continuita assistenziale e prevenzione nel nido.',
    attivo: true,
    annual_growth_rate: 0,
  },
  {
    id: 'NID-04',
    beneficio_label: 'B4d — Recupero poverta educativa bambini svantaggiati (equita)',
    label_utente: 'Recupero poverta educativa bambini svantaggiati',
    categoria_beneficio: 'Sociale — Equita',
    metodo_valorizzazione: 'QALY/WTP',
    variables: [
      { var_name: 'A', description: 'Posti nido serviti', table: 'input_params', code: 'com_src_utentiserviziinfanzia_y', val_check: null, label_utente: 'Posti nido serviti (0-3 anni)', valore_tipo: 350 },
      { var_name: 'B', description: 'com_ratio_giniindex_y', table: 'statistics', code: 'com_ratio_giniindex_y', val_check: null, label_utente: 'Indice di Gini', valore_tipo: 0.33 },
      { var_name: 'C', description: 'quota QALY cognitivo per bambino svantaggiato', table: 'fixed_params', code: 'FP-IST-024', val_check: 0.08, label_utente: 'Quota QALY cognitivo per bambino svantaggiato' },
      { var_name: 'D', description: 'Valore di un QALY', table: 'monetization_factors', code: 'MF-SAL-006', val_check: 60000, label_utente: 'Valore di un QALY (standard IT)' },
    ],
    formula: 'A * B * C * D',
    fonti: [
      { tipo: 'bibliografia', label: 'OCSE PISA', riferimento: 'OCSE PISA', codice_origine: null },
      { tipo: 'bibliografia', label: 'Heckman (2013)', riferimento: 'Heckman (2013)', codice_origine: null },
    ],
    note: 'Rilevante nei contesti ad alta disuguaglianza (Gini alto). Bambini svantaggiati stimati via quota Gini.',
    attivo: true,
    annual_growth_rate: 0,
  },
`;

const blockEol = eol === "\r\n" ? block.replace(/\n/g, "\r\n") : block;
s = s.slice(0, start) + blockEol + s.slice(end);
fs.writeFileSync(P, s);
console.log("Sostituzione OK: NID-00..04 aggiornati (EOL " + JSON.stringify(eol) + ").");
