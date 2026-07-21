// Sostituisce i KPI benefici della categoria "Strutture Ospedaliere" (C105:
// OSP-01..05) con le 6 voci dell'ACB reale dell'ospedale (scenario 841), così i
// KPI mostrati nel wizard coincidono con quelli del dettaglio.
// Idempotente: se OSP-06 esiste già, non fa nulla.
//   node scripts/patch-osp-kpi.cjs
const fs = require("fs");
const path = require("path");
const P = path.join(__dirname, "..", "app", "src", "poc", "data", "poc_docfap", "kpi_benefits_layer2.ts");
let s = fs.readFileSync(P, "utf8");

if (s.includes("id: 'OSP-06'")) {
  console.log("OSP-06 già presente: nessuna modifica.");
  process.exit(0);
}

const eol = s.includes("\r\n") ? "\r\n" : "\n";
const startId = s.indexOf("id: 'OSP-01'");
const endId = s.indexOf("id: 'RIC-01'");
if (startId < 0 || endId < 0) {
  console.error("Marker non trovato:", { startId, endId });
  process.exit(1);
}
const start = s.lastIndexOf("\n", s.lastIndexOf("{", startId)) + 1;
const end = s.lastIndexOf("\n", s.lastIndexOf("{", endId)) + 1;

const block = `  {
    id: 'OSP-01',
    beneficio_label: 'Miglioramento dell accessibilita',
    label_utente: 'Miglioramento dell accessibilita',
    categoria_beneficio: 'Accessibilita ai servizi',
    metodo_valorizzazione: 'Accessibilita',
    variables: [
      { var_name: 'A', description: 'Ricoveri annuali stimati', table: 'input_params', code: 'com_mult_ricoveri_y', val_check: null, label_utente: 'Ricoveri ospedalieri annui stimati', valore_tipo: 4500 },
      { var_name: 'B', description: 'Tempi di raggiungibilita media servizi sanitari', table: 'statistics', code: 'com_avg_tempi_raggiungibilita_y', val_check: null, label_utente: 'Tempi di raggiungibilita media (min)', valore_tipo: 15 },
      { var_name: 'C', description: 'Valore accesso per paziente e minuto', table: 'monetization_factors', code: 'MF-SAL-ACC', val_check: 120, label_utente: 'Valore accesso (EUR per paziente e minuto)' },
    ],
    formula: 'A × B × C',
    fonti: [
      { tipo: 'bibliografia', label: 'EC Guide CBA 2021', riferimento: 'EC Guide CBA 2021', codice_origine: null },
      { tipo: 'bibliografia', label: 'LG MEF-NUVAP 2017', riferimento: 'LG MEF-NUVAP 2017', codice_origine: null },
    ],
    note: 'Beneficio di accesso ai servizi sanitari (voce ACB scenario 841).',
    attivo: true,
    annual_growth_rate: 0,
  },
  {
    id: 'OSP-02',
    beneficio_label: 'Tempo di degenza evitato',
    label_utente: 'Tempo di degenza evitato',
    categoria_beneficio: 'SSN - degenza',
    metodo_valorizzazione: 'DRG/SSN',
    variables: [
      { var_name: 'A', description: 'Ricoveri annuali stimati', table: 'input_params', code: 'com_mult_ricoveri_y', val_check: null, label_utente: 'Ricoveri ospedalieri annui stimati', valore_tipo: 4500 },
      { var_name: 'B', description: 'Giornate di degenza evitate per ricovero', table: 'fixed_params', code: 'FP-SAL-DEG', val_check: 1.2, label_utente: 'Giornate di degenza evitate per ricovero' },
      { var_name: 'C', description: 'Costo giornata di degenza', table: 'monetization_factors', code: 'MF-SAL-DEG', val_check: 700, label_utente: 'Costo di una giornata di degenza (EUR)' },
    ],
    formula: 'A × B × C',
    fonti: [
      { tipo: 'bibliografia', label: 'Min. Salute DRG 2022', riferimento: 'Min. Salute DRG 2022', codice_origine: null },
    ],
    note: 'Risparmio da minori giornate di degenza (voce ACB scenario 841).',
    attivo: true,
    annual_growth_rate: 0,
  },
  {
    id: 'OSP-03',
    beneficio_label: 'Riduzione della mobilita passiva',
    label_utente: 'Riduzione della mobilita passiva',
    categoria_beneficio: 'Sanitario - mobilita passiva',
    metodo_valorizzazione: 'Sostituzione',
    variables: [
      { var_name: 'A', description: 'Ricoveri annuali stimati', table: 'input_params', code: 'com_mult_ricoveri_y', val_check: null, label_utente: 'Ricoveri ospedalieri annui stimati', valore_tipo: 4500 },
      { var_name: 'B', description: 'Quota di pazienti che non emigrano', table: 'fixed_params', code: 'FP-SAL-MOB', val_check: 0.15, label_utente: 'Quota pazienti che non ricorrono a mobilita passiva' },
      { var_name: 'C', description: 'Costo medio per episodio di mobilita passiva', table: 'monetization_factors', code: 'MF-SAL-MOB', val_check: 2500, label_utente: 'Costo per episodio di mobilita passiva (EUR)' },
    ],
    formula: 'A × B × C',
    fonti: [
      { tipo: 'bibliografia', label: 'AGENAS mobilita sanitaria', riferimento: 'AGENAS mobilita sanitaria', codice_origine: null },
    ],
    note: 'Minore emigrazione sanitaria verso altre regioni (voce ACB scenario 841).',
    attivo: true,
    annual_growth_rate: 0,
  },
  {
    id: 'OSP-04',
    beneficio_label: 'Riduzione della mortalita infantile',
    label_utente: 'Riduzione della mortalita infantile',
    categoria_beneficio: 'Salute - mortalita evitabile',
    metodo_valorizzazione: 'VSL',
    variables: [
      { var_name: 'A', description: 'Ricoveri annuali stimati', table: 'input_params', code: 'com_mult_ricoveri_y', val_check: null, label_utente: 'Ricoveri ospedalieri annui stimati', valore_tipo: 4500 },
      { var_name: 'B', description: 'Tasso di mortalita infantile evitabile', table: 'fixed_params', code: 'FP-SAL-MOR', val_check: 0.0018, label_utente: 'Quota di decessi infantili evitabili' },
      { var_name: 'C', description: 'Valore statistico della vita umana (VSL)', table: 'monetization_factors', code: 'MF-CIV-VSL', val_check: 3000000, label_utente: 'Valore statistico della vita umana (VSL)' },
    ],
    formula: 'A × B × C',
    fonti: [
      { tipo: 'bibliografia', label: 'Avdic (2016) RES', riferimento: 'Avdic (2016) RES', codice_origine: null },
      { tipo: 'bibliografia', label: 'EC Guide CBA 2021', riferimento: 'EC Guide CBA 2021', codice_origine: null },
    ],
    note: 'Decessi infantili evitati grazie al potenziamento (voce ACB scenario 841).',
    attivo: true,
    annual_growth_rate: 0,
  },
  {
    id: 'OSP-05',
    beneficio_label: 'Inabilita evitata',
    label_utente: 'Inabilita evitata',
    categoria_beneficio: 'Salute - QALY',
    metodo_valorizzazione: 'QALY',
    variables: [
      { var_name: 'A', description: 'Ricoveri annuali stimati', table: 'input_params', code: 'com_mult_ricoveri_y', val_check: null, label_utente: 'Ricoveri ospedalieri annui stimati', valore_tipo: 4500 },
      { var_name: 'B', description: 'Quota di casi di inabilita evitata', table: 'fixed_params', code: 'FP-SAL-INA', val_check: 0.02, label_utente: 'Quota di casi di inabilita evitata' },
      { var_name: 'C', description: 'Valore di un QALY', table: 'monetization_factors', code: 'MF-SAL-006', val_check: 60000, label_utente: 'Valore di un QALY (standard IT)' },
    ],
    formula: 'A × B × C',
    fonti: [
      { tipo: 'bibliografia', label: 'UK NICE (2013)', riferimento: 'UK NICE (2013)', codice_origine: null },
    ],
    note: 'Anni di vita in salute recuperati da minore inabilita (voce ACB scenario 841).',
    attivo: true,
    annual_growth_rate: 0,
  },
  {
    id: 'OSP-06',
    beneficio_label: 'Riduzione emissioni CO2 per veicoli pesanti',
    label_utente: 'Riduzione emissioni CO2 per veicoli pesanti',
    categoria_beneficio: 'Ambientale - emissioni',
    metodo_valorizzazione: 'Costo carbonio',
    variables: [
      { var_name: 'A', description: 'Tonnellate di CO2 evitate all anno', table: 'fixed_params', code: 'FP-AMB-CO2', val_check: 1500, label_utente: 'Tonnellate di CO2 evitate per anno' },
      { var_name: 'B', description: 'Costo sociale del carbonio', table: 'monetization_factors', code: 'MF-AMB-CO2', val_check: 100, label_utente: 'Costo sociale del carbonio (EUR per tCO2)' },
    ],
    formula: 'A × B',
    fonti: [
      { tipo: 'bibliografia', label: 'EU ETS / Handbook 2019', riferimento: 'EU ETS / Handbook 2019', codice_origine: null },
    ],
    note: 'Minori emissioni da ridotta mobilita di veicoli pesanti (voce ACB scenario 841).',
    attivo: true,
    annual_growth_rate: 0,
  },
`;

const blockEol = eol === "\r\n" ? block.replace(/\n/g, "\r\n") : block;
s = s.slice(0, start) + blockEol + s.slice(end);
fs.writeFileSync(P, s);
console.log("Sostituzione OK: OSP-01..06 aggiornati (EOL " + JSON.stringify(eol) + ").");
