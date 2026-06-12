// Rigenera app/src/mocks/mubaProject.js dagli export reali del progetto MUBA
// (cartella "progetto muba"): IA scenario 976 (EIA) + ACB scenario 976 (ECBA/SROI).
//
//   node scripts/build-muba-project.cjs
//
// Aggrega i dati grezzi nella STESSA forma prodotta dagli engine (computeEia /
// computeEcba) così da alimentare le card riepilogo di ProjectDetail senza
// toccare i componenti. Eseguire di nuovo se gli xlsx cambiano.

const fs = require("fs");
const path = require("path");
const XLSX = require("../app/node_modules/xlsx");

const ROOT = path.join(__dirname, "..");
const IA = path.join(ROOT, "progetto muba", "IA scenario 976.xlsx");
const ACB = path.join(ROOT, "progetto muba", "ACB scenario 976.xlsx");
const OUT = path.join(ROOT, "app", "src", "mocks", "mubaProject.js");
const K = 1000; // valori negli xlsx in k€ → €

function sheet(file, name) {
  const rows = XLSX.utils.sheet_to_json(XLSX.readFile(file).Sheets[name], { header: 1, defval: null });
  const hdr = rows[0];
  return rows.slice(1).map((r) => Object.fromEntries(hdr.map((h, i) => [h, r[i]])));
}

// ── Province italiane in ordine ISTAT regionale (somma = 107) ──────────────────
const REGION_BLOCKS = [
  ["Piemonte", 8], ["Valle d'Aosta", 1], ["Liguria", 4], ["Lombardia", 12],
  ["Trentino-Alto Adige", 2], ["Veneto", 7], ["Friuli-Venezia Giulia", 4],
  ["Emilia-Romagna", 9], ["Toscana", 10], ["Umbria", 2], ["Marche", 5], ["Lazio", 5],
  ["Abruzzo", 4], ["Molise", 2], ["Campania", 5], ["Puglia", 6], ["Basilicata", 2],
  ["Calabria", 5], ["Sicilia", 9], ["Sardegna", 5],
];
const ORDER = ["Torino","Vercelli","Novara","Cuneo","Asti","Alessandria","Biella","Verbania","Aosta","Imperia","Savona","Genova","La Spezia","Varese","Como","Sondrio","Milano","Bergamo","Brescia","Pavia","Cremona","Mantova","Lecco","Lodi","Monza Brianza","Bolzano","Trento","Verona","Vicenza","Belluno","Treviso","Venezia","Padova","Rovigo","Udine","Gorizia","Trieste","Pordenone","Piacenza","Parma","Reggio Emilia","Modena","Bologna","Ferrara","Ravenna","Forli","Rimini","Massa Carrara","Lucca","Pistoia","Firenze","Livorno","Pisa","Arezzo","Siena","Grosseto","Prato","Perugia","Terni","Pesaro Urbino","Ancona","Macerata","Ascoli Piceno","Fermo","Viterbo","Rieti","Roma","Latina","Frosinone","Aquila","Teramo","Pescara","Chieti","Campobasso","Isernia","Caserta","Benevento","Napoli","Avellino","Salerno","Foggia","Bari","Taranto","Brindisi","Lecce","Barletta Andria Trani","Potenza","Matera","Cosenza","Catanzaro","Reggio di Calabria","Crotone","Vibo Valentia","Trapani","Palermo","Messina","Agrigento","Caltanissetta","Enna","Catania","Ragusa","Siracusa","Sassari","Nuoro","Cagliari","Oristano","Sud Sardegna"];
const PROV_TO_REGION = {};
{ let i = 0; for (const [reg, n] of REGION_BLOCKS) for (let j = 0; j < n; j++) PROV_TO_REGION[ORDER[i++]] = reg; }

// ── EIA: aggrega le sheet per KPI ──────────────────────────────────────────────
function aggKpi(name) {
  const data = sheet(IA, name);
  const a = { total: 0, direct: 0, indirect: 0, induced: 0, byGeo: {}, bySec: {} };
  for (const r of data) {
    a.total += r.total_value || 0; a.direct += r.direct_value || 0;
    a.indirect += r.indirect_value || 0; a.induced += r.induced_value || 0;
    a.byGeo[r.geo_des] = (a.byGeo[r.geo_des] || 0) + (r.total_value || 0);
    a.bySec[r.sec_des] = (a.bySec[r.sec_des] || 0) + (r.total_value || 0);
  }
  return a;
}
const prod = aggKpi("production");
const gdp = aggKpi("gdp");
const emp = aggKpi("employment");
const inc = aggKpi("incomes");
const shockEUR = Math.round(sheet(IA, "shock").reduce((s, r) => s + (r.total_value || 0), 0) * K);

const money = (a) => ({
  diretto: Math.round(a.direct * K), indiretto: Math.round(a.indirect * K),
  indotto: Math.round(a.induced * K), totale: Math.round(a.total * K),
});
const r1 = (x) => Math.round(x * 10) / 10;
const fte = { diretto: r1(emp.direct), indiretto: r1(emp.indirect), indotto: r1(emp.induced), totale: r1(emp.total) };

const regAgg = {};
for (const [prov, v] of Object.entries(prod.byGeo)) {
  const reg = PROV_TO_REGION[prov] || "Altre regioni";
  regAgg[reg] = (regAgg[reg] || 0) + v;
}
const maxReg = Math.max(...Object.values(regAgg));
const per_territorio = Object.entries(regAgg)
  .map(([regione, v]) => ({ regione, valore: Math.round(v * K), intensita: Math.round((v / maxReg) * 100) / 100 }))
  .sort((a, b) => b.valore - a.valore);
const per_settore = Object.entries(prod.bySec)
  .map(([settore, v]) => ({ settore, share: Math.round((v / prod.total) * 1000) / 1000, valore: Math.round(v * K) }))
  .sort((a, b) => b.valore - a.valore);

const eiaResults = {
  shock_totale: shockEUR,
  moltiplicatore: Math.round((prod.total * K / shockEUR) * 100) / 100,
  produzione: money(prod), gva: money(gdp), fte, redditi: money(inc),
  gettito: null, // nessun dato fiscale nell'output IA dello scenario
  per_territorio, per_settore, per_anno: [],
  scenario: {
    settore: "Infrastrutture sociali", nuts_code: "ITH55", nuts_label: "Bologna",
    capex: shockEUR, opex_annuo: 0, vita_utile: 25, anno_inizio: 2025, anno_fine: 2050,
    granularita: "provinciale", tipo: "completa",
  },
};

// ── ECBA: indicatori sintetici dalla sheet SROI (righe TOT globali) ────────────
const sroi = sheet(ACB, "sroi");
const tot = Object.fromEntries(
  sroi.filter((d) => d.dimension === "TOT" && d.region_code === "").map((d) => [d.datatypevalue || d.datatype, d.value]),
);
const csh = sroi.filter((d) => d.dimension === "CSH").sort((a, b) => a.datatypevalue - b.datatypevalue);
let cum = 0, paybackYear = null;
const startYear = +csh[0].datatypevalue;
for (const c of csh) { cum += c.value; if (paybackYear === null && cum >= 0) paybackYear = +c.datatypevalue; }
const payback = paybackYear ? paybackYear - startYear : null;

const benefici = Math.round(tot["benefici"]);
const costi = Math.round(tot["costi"]);
const vane = Math.round(tot["vane"] ?? tot["b_c"]);
const bcr = Math.round(tot["sroi"] * 100) / 100;        // B/C
const tire = Math.round(tot["tire"] * 1000) / 10;       // frazione → %

const ecbaResults = {
  van: vane, bc: bcr, tir: tire, payback,
  bcr, irr: tire, payback_period: payback,
  benefici_totali: benefici, costi_totali: costi,
  benefici_categorie: [],
  costi_categorie: [{ id: "capex", label: "Investimento e costi (valore attuale)", valore_pv: costi }],
  pv_capex: costi, pv_opex: 0, flussi: [],
  meta: { orizzonte: 25, tasso: 3.5, residual: 0, capex: shockEUR, annual_opex: 0 },
};

const project = {
  id: "PROJ-MUBA-976",
  cup: "I69J21000000976",
  nome: "MUBA — Polo culturale di Bologna",
  descrizione:
    "Intervento di valorizzazione culturale a Bologna: recupero degli spazi, allestimenti museali e attività artistiche. Scenario di analisi n. 976 (EIA + ACB).",
  stato: "Approvato",
  creato_il: "12/06/2026",
  ultima_modifica: "12/06/2026",
  configurazione: {
    settore: "Infrastrutture sociali",
    sotto_settore: "Cultura, turismo e valorizzazione del territorio",
    categoria_intervento: "Valorizzazione e fruizione del patrimonio culturale",
    tipo_intervento: "Recupero",
    durata_progetto: "25 anni",
    localizzazione: "Bologna BO",
    nuts_code: "ITH55",
    nuts_label: "Bologna",
    anno_attualizzazione: 2025,
    tasso_attualizzazione: 3.5,
    capex: shockEUR,
    opex: 0,
    vita_utile: 25,
  },
};

const body = `// AUTO-GENERATO da "progetto muba" (IA scenario 976 + ACB scenario 976).
// Dati reali aggregati dagli export EIA/ECBA. NON modificare a mano: rigenerare
// con \`node scripts/build-muba-project.cjs\` se gli xlsx cambiano.
//
// Forma allineata agli output degli engine (computeEia / computeEcba) così da
// alimentare le card riepilogo in ProjectDetail (EiaKpiCards / EcbaRows).

export const MUBA_PROJECT = ${JSON.stringify(project, null, 2)};

export const MUBA_EIA_RESULTS = ${JSON.stringify(eiaResults, null, 2)};

export const MUBA_ECBA_RESULTS = ${JSON.stringify(ecbaResults, null, 2)};
`;

fs.writeFileSync(OUT, body);
console.log("✓ scritto", path.relative(ROOT, OUT));
console.log(`  EIA  shock €${shockEUR.toLocaleString("it-IT")} · molt ${eiaResults.moltiplicatore} · PIL €${eiaResults.gva.totale.toLocaleString("it-IT")} · ${fte.totale} ETP`);
console.log(`  ECBA benefici €${benefici.toLocaleString("it-IT")} · costi €${costi.toLocaleString("it-IT")} · VANE €${vane.toLocaleString("it-IT")} · B/C ${bcr} · TIRE ${tire}% · payback ${payback} anni`);
