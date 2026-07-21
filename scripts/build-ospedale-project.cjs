// Genera app/src/mocks/ospedaleProject.js dagli export reali del progetto
// "Analisi Ospedale Infantile" (Genova) — cartella "progetto ospedale pediatrico":
// IA scenario 841 (EIA) + ACB scenario 841 (ECBA/SROI).
//
//   node scripts/build-ospedale-project.cjs
//
// Emette CINQUE export (stessa forma di mubaProject.js):
//  - OSPEDALE_PROJECT / *_EIA_RESULTS / *_ECBA_RESULTS / *_EIA_DATASET / *_ECBA_DATASET
//
// NOTE:
//  - Valori xlsx in k€ → €. FTE non scalati.
//  - Gettito fiscale NON è nell'export IA → stimato come proxy 22% del PIL (GVA). Sostituibile.
//  - Etichette benefici KPI262-266/KPI340: placeholder = codice, finché OpenEconomics non
//    fornisce i nomi leggibili (come per il MUBA con KPI469-480). "Miglioramento
//    dell'accessibilità" è già etichettato nell'export.
//  - Sezioni di rischio/sensitività NON presenti nell'export → illustrative, riscalate sul VANE.

const fs = require("fs");
const path = require("path");
const XLSX = require("../app/node_modules/xlsx");

const ROOT = path.join(__dirname, "..");
const DIRP = path.join(ROOT, "progetto ospedale pediatrico");
const IA = path.join(DIRP, "IA scenario 841.xlsx");
const ACB = path.join(DIRP, "ACB scenario 841.xlsx");
const OUT = path.join(ROOT, "app", "src", "mocks", "ospedaleProject.js");
const K = 1000; // valori negli xlsx in k€ → €

// Anagrafica progetto (fornita dall'utente).
const CAPEX = 156600000;       // CAPEX totale (€)
const ANNO_ATT = 2025;         // anno di attualizzazione
const ANNO_START = 2023;       // inizio periodo di investimento
const ANNO_END = 2045;         // fine esercizio / vita utile
const VITA_UTILE = ANNO_END - ANNO_START; // 22 → arco 23 anni (2023..2045 inclusi)
const TASSO = 3.0;             // tasso di sconto sociale (%)

// ── Anagrafica province (ordine ISTAT) → sigla, regione, codici, popolazione ───
const REGIONS = {
  "Piemonte":            { code: "01", nuts2: "ITC1", pop: 4256350 },
  "Valle d'Aosta":       { code: "02", nuts2: "ITC2", pop: 123337 },
  "Liguria":             { code: "07", nuts2: "ITC3", pop: 1502624 },
  "Lombardia":           { code: "03", nuts2: "ITC4", pop: 9943004 },
  "Trentino-Alto Adige": { code: "04", nuts2: "ITH1", pop: 1078069 },
  "Veneto":              { code: "05", nuts2: "ITH3", pop: 4851973 },
  "Friuli-Venezia Giulia":{ code: "06", nuts2: "ITH4", pop: 1196785 },
  "Emilia-Romagna":      { code: "08", nuts2: "ITH5", pop: 4438937 },
  "Toscana":             { code: "09", nuts2: "ITI1", pop: 3668333 },
  "Umbria":              { code: "10", nuts2: "ITI2", pop: 854137 },
  "Marche":              { code: "11", nuts2: "ITI3", pop: 1480839 },
  "Lazio":               { code: "12", nuts2: "ITI4", pop: 5714882 },
  "Abruzzo":             { code: "13", nuts2: "ITF1", pop: 1269963 },
  "Molise":              { code: "14", nuts2: "ITF2", pop: 289840 },
  "Campania":            { code: "15", nuts2: "ITF3", pop: 5592175 },
  "Puglia":              { code: "16", nuts2: "ITF4", pop: 3900852 },
  "Basilicata":          { code: "17", nuts2: "ITF5", pop: 537577 },
  "Calabria":            { code: "18", nuts2: "ITF6", pop: 1841300 },
  "Sicilia":             { code: "19", nuts2: "ITG1", pop: 4801468 },
  "Sardegna":            { code: "20", nuts2: "ITG2", pop: 1575028 },
};
const NATIONAL_POP = 58997000;

// [nome xlsx, sigla, regione, popolazione]
const PROV = [
  ["Torino","TO","Piemonte",2208000],["Vercelli","VC","Piemonte",167000],["Novara","NO","Piemonte",364000],["Cuneo","CN","Piemonte",585000],["Asti","AT","Piemonte",213000],["Alessandria","AL","Piemonte",410000],["Biella","BI","Piemonte",170000],["Verbania","VB","Piemonte",156000],
  ["Aosta","AO","Valle d'Aosta",123000],
  ["Imperia","IM","Liguria",210000],["Savona","SV","Liguria",269000],["Genova","GE","Liguria",814000],["La Spezia","SP","Liguria",215000],
  ["Varese","VA","Lombardia",884000],["Como","CO","Lombardia",596000],["Sondrio","SO","Lombardia",178000],["Milano","MI","Lombardia",3214000],["Bergamo","BG","Lombardia",1108000],["Brescia","BS","Lombardia",1255000],["Pavia","PV","Lombardia",535000],["Cremona","CR","Lombardia",354000],["Mantova","MN","Lombardia",403000],["Lecco","LC","Lombardia",331000],["Lodi","LO","Lombardia",226000],["Monza Brianza","MB","Lombardia",871000],
  ["Bolzano","BZ","Trentino-Alto Adige",533000],["Trento","TN","Trentino-Alto Adige",545000],
  ["Verona","VR","Veneto",926000],["Vicenza","VI","Veneto",855000],["Belluno","BL","Veneto",198000],["Treviso","TV","Veneto",887000],["Venezia","VE","Veneto",836000],["Padova","PD","Veneto",933000],["Rovigo","RO","Veneto",226000],
  ["Udine","UD","Friuli-Venezia Giulia",519000],["Gorizia","GO","Friuli-Venezia Giulia",137000],["Trieste","TS","Friuli-Venezia Giulia",230000],["Pordenone","PN","Friuli-Venezia Giulia",311000],
  ["Piacenza","PC","Emilia-Romagna",285000],["Parma","PR","Emilia-Romagna",451000],["Reggio Emilia","RE","Emilia-Romagna",524000],["Modena","MO","Emilia-Romagna",705000],["Bologna","BO","Emilia-Romagna",1017000],["Ferrara","FE","Emilia-Romagna",343000],["Ravenna","RA","Emilia-Romagna",386000],["Forli","FC","Emilia-Romagna",393000],["Rimini","RN","Emilia-Romagna",336000],
  ["Massa Carrara","MS","Toscana",191000],["Lucca","LU","Toscana",383000],["Pistoia","PT","Toscana",290000],["Firenze","FI","Toscana",987000],["Livorno","LI","Toscana",330000],["Pisa","PI","Toscana",421000],["Arezzo","AR","Toscana",336000],["Siena","SI","Toscana",261000],["Grosseto","GR","Toscana",217000],["Prato","PO","Toscana",261000],
  ["Perugia","PG","Umbria",648000],["Terni","TR","Umbria",217000],
  ["Pesaro Urbino","PU","Marche",355000],["Ancona","AN","Marche",462000],["Macerata","MC","Marche",301000],["Ascoli Piceno","AP","Marche",200000],["Fermo","FM","Marche",168000],
  ["Viterbo","VT","Lazio",311000],["Rieti","RI","Lazio",152000],["Roma","RM","Lazio",4216000],["Latina","LT","Lazio",567000],["Frosinone","FR","Lazio",470000],
  ["Aquila","AQ","Abruzzo",286000],["Teramo","TE","Abruzzo",296000],["Pescara","PE","Abruzzo",312000],["Chieti","CH","Abruzzo",376000],
  ["Campobasso","CB","Molise",211000],["Isernia","IS","Molise",79000],
  ["Caserta","CE","Campania",906000],["Benevento","BN","Campania",264000],["Napoli","NA","Campania",2946000],["Avellino","AV","Campania",399000],["Salerno","SA","Campania",1061000],
  ["Foggia","FG","Puglia",583000],["Bari","BA","Puglia",1209000],["Taranto","TA","Puglia",547000],["Brindisi","BR","Puglia",372000],["Lecce","LE","Puglia",759000],["Barletta Andria Trani","BT","Puglia",369000],
  ["Potenza","PZ","Basilicata",348000],["Matera","MT","Basilicata",189000],
  ["Cosenza","CS","Calabria",681000],["Catanzaro","CZ","Calabria",343000],["Reggio di Calabria","RC","Calabria",517000],["Crotone","KR","Calabria",161000],["Vibo Valentia","VV","Calabria",148000],
  ["Trapani","TP","Sicilia",419000],["Palermo","PA","Sicilia",1194000],["Messina","ME","Sicilia",591000],["Agrigento","AG","Sicilia",415000],["Caltanissetta","CL","Sicilia",251000],["Enna","EN","Sicilia",156000],["Catania","CT","Sicilia",1059000],["Ragusa","RG","Sicilia",311000],["Siracusa","SR","Sicilia",380000],
  ["Sassari","SS","Sardegna",477000],["Nuoro","NU","Sardegna",199000],["Cagliari","CA","Sardegna",415000],["Oristano","OR","Sardegna",142000],["Sud Sardegna","SU","Sardegna",333000],
];
const PROV_META = {};
for (const [nome, sigla, regione, pop] of PROV) PROV_META[nome] = { sigla, regione, pop };

const ORIGIN_PROV = "Genova";
const ORIGIN_REGION = "Liguria";

function sheet(file, name) {
  const rows = XLSX.utils.sheet_to_json(XLSX.readFile(file).Sheets[name], { header: 1, defval: null });
  const hdr = rows[0];
  return rows.slice(1).map((r) => Object.fromEntries(hdr.map((h, i) => [h, r[i]])));
}

// ── Carica le 4 sheet KPI ─────────────────────────────────────────────────────
const KPIS = ["production", "gdp", "employment", "incomes"];
const DIM = { production: "production", gdp: "gdp", employment: "employment", incomes: "income" };
const raw = {};
for (const k of KPIS) raw[k] = sheet(IA, k);

const isFte = (k) => k === "employment";

function totals(kpi) {
  let total = 0, direct = 0, indirect = 0, induced = 0;
  for (const r of raw[kpi]) { total += r.total_value || 0; direct += r.direct_value || 0; indirect += r.indirect_value || 0; induced += r.induced_value || 0; }
  return { total, direct, indirect, induced };
}
function byGeo(kpi) { const m = {}; for (const r of raw[kpi]) m[r.geo_des] = (m[r.geo_des] || 0) + (r.total_value || 0); return m; }
function bySec(kpi) {
  const m = {};
  for (const r of raw[kpi]) {
    const s = (m[r.sec_des] = m[r.sec_des] || { code: r.sec_cod, total: 0, direct: 0, indirect: 0, induced: 0 });
    s.total += r.total_value || 0; s.direct += r.direct_value || 0; s.indirect += r.indirect_value || 0; s.induced += r.induced_value || 0;
  }
  return m;
}
function byRegionSector(kpi) {
  const m = {};
  for (const r of raw[kpi]) {
    const reg = PROV_META[r.geo_des]?.regione; if (!reg) continue;
    (m[reg] = m[reg] || {}); m[reg][r.sec_des] = (m[reg][r.sec_des] || 0) + (r.total_value || 0);
  }
  return m;
}

const TOT = {}, GEO = {}, SEC = {}, REGSEC = {};
for (const k of KPIS) { TOT[k] = totals(k); GEO[k] = byGeo(k); SEC[k] = bySec(k); REGSEC[k] = byRegionSector(k); }

const shockEUR = Math.round(sheet(IA, "shock").reduce((s, r) => s + (r.total_value || 0), 0) * K);
const round = Math.round;

// OPEX annuo stimato: shock EIA (spesa totale) − CAPEX, ripartito sulla vita utile.
// (L'export ACB non separa OPEX da CAPEX: qui lo si esplicita per la scheda progetto.)
const OPEX_ANNUAL = Math.max(0, round((shockEUR - CAPEX) / VITA_UTILE));

// Gettito: NON nell'export → proxy 22% del PIL nazionale (coerente con eiaEngine).
const GETTITO_TOTAL = round(0.22 * TOT.gdp.total * K);

// ════════════════════════════════════════════════════════════════════════════
// 1) FORMA ENGINE (computeEia) — card riepilogo ProjectDetail
// ════════════════════════════════════════════════════════════════════════════
function moneyBreak(kpi) {
  const t = TOT[kpi];
  return { diretto: round(t.direct * K), indiretto: round(t.indirect * K), indotto: round(t.induced * K), totale: round(t.total * K) };
}
const r1 = (x) => round(x * 10) / 10;
const empBreak = { diretto: r1(TOT.employment.direct), indiretto: r1(TOT.employment.indirect), indotto: r1(TOT.employment.induced), totale: r1(TOT.employment.total) };

const gdpT = TOT.gdp.total || 1;
const gettitoBreak = {
  diretto: round(GETTITO_TOTAL * TOT.gdp.direct / gdpT),
  indiretto: round(GETTITO_TOTAL * TOT.gdp.indirect / gdpT),
  indotto: round(GETTITO_TOTAL * TOT.gdp.induced / gdpT),
  totale: GETTITO_TOTAL,
};

const prodTotEUR = round(TOT.production.total * K);
const regAggProd = {};
for (const [g, v] of Object.entries(GEO.production)) { const reg = PROV_META[g]?.regione || "Altre"; regAggProd[reg] = (regAggProd[reg] || 0) + v; }
const maxReg = Math.max(...Object.values(regAggProd));
const per_territorio = Object.entries(regAggProd)
  .map(([regione, v]) => ({ regione, valore: round(v * K), intensita: round((v / maxReg) * 100) / 100 }))
  .sort((a, b) => b.valore - a.valore);
const per_settore = Object.entries(SEC.production)
  .map(([settore, o]) => ({ settore, share: round((o.total / TOT.production.total) * 1000) / 1000, valore: round(o.total * K) }))
  .sort((a, b) => b.valore - a.valore);

const OSPEDALE_EIA_RESULTS = {
  shock_totale: shockEUR,
  moltiplicatore: round((prodTotEUR / shockEUR) * 100) / 100,
  produzione: moneyBreak("production"),
  gva: moneyBreak("gdp"),
  fte: empBreak,
  redditi: moneyBreak("incomes"),
  gettito: gettitoBreak,
  per_territorio, per_settore, per_anno: [],
  scenario: { settore: "Infrastrutture sociali", nuts_code: "ITC33", nuts_label: "Genova", capex: CAPEX, opex_annuo: 0, vita_utile: VITA_UTILE, anno_inizio: ANNO_START, anno_fine: ANNO_END, granularita: "provinciale", tipo: "completa" },
};

// ════════════════════════════════════════════════════════════════════════════
// 2) FORMA RICCA (eiaResults.json) — vista di dettaglio EIA
// ════════════════════════════════════════════════════════════════════════════
function perimeterSum(kpi, predicate) {
  let s = 0; for (const r of raw[kpi]) if (predicate(r)) s += r.total_value || 0; return s;
}
const isOriginProv = (r) => r.geo_des === ORIGIN_PROV;
const isOriginReg = (r) => PROV_META[r.geo_des]?.regione === ORIGIN_REGION;

function perimeterValues(kpi) {
  const sc = (v) => (isFte(kpi) ? r1(v) : round(v * K));
  return {
    origin: sc(perimeterSum(kpi, isOriginProv)),
    region: sc(perimeterSum(kpi, isOriginReg)),
    national: sc(TOT[kpi].total),
  };
}
const PV = { production: perimeterValues("production"), gdp: perimeterValues("gdp"), employment: perimeterValues("employment"), income: perimeterValues("incomes") };

const by_perimeter = {
  origin_province: { production: PV.production.origin, gdp: PV.gdp.origin, employment: PV.employment.origin, income: PV.income.origin, fiscal: null },
  region:          { production: PV.production.region, gdp: PV.gdp.region, employment: PV.employment.region, income: PV.income.region, fiscal: null },
  national:        { production: PV.production.national, gdp: PV.gdp.national, employment: PV.employment.national, income: PV.income.national, fiscal: GETTITO_TOTAL },
};
const three_segments = {};
for (const dim of ["production", "gdp", "employment", "income"]) {
  const p = by_perimeter; three_segments[dim] = { origin: p.origin_province[dim], rest_region: round((p.region[dim] - p.origin_province[dim]) * 10) / 10, extra: round((p.national[dim] - p.region[dim]) * 10) / 10 };
}
const per_capita = {
  origin_province: { population: PROV_META[ORIGIN_PROV].pop, production_pc: round(by_perimeter.origin_province.production / PROV_META[ORIGIN_PROV].pop * 100) / 100, gdp_pc: round(by_perimeter.origin_province.gdp / PROV_META[ORIGIN_PROV].pop * 100) / 100, employment_pc_per_10k: round(by_perimeter.origin_province.employment / PROV_META[ORIGIN_PROV].pop * 10000 * 100) / 100, income_pc: round(by_perimeter.origin_province.income / PROV_META[ORIGIN_PROV].pop * 100) / 100 },
  region:          { population: REGIONS[ORIGIN_REGION].pop, production_pc: round(by_perimeter.region.production / REGIONS[ORIGIN_REGION].pop * 100) / 100, gdp_pc: round(by_perimeter.region.gdp / REGIONS[ORIGIN_REGION].pop * 100) / 100, employment_pc_per_10k: round(by_perimeter.region.employment / REGIONS[ORIGIN_REGION].pop * 10000 * 100) / 100, income_pc: round(by_perimeter.region.income / REGIONS[ORIGIN_REGION].pop * 100) / 100 },
  national:        { population: NATIONAL_POP, production_pc: round(by_perimeter.national.production / NATIONAL_POP * 100) / 100, gdp_pc: round(by_perimeter.national.gdp / NATIONAL_POP * 100) / 100, employment_pc_per_10k: round(by_perimeter.national.employment / NATIONAL_POP * 10000 * 100) / 100, income_pc: round(by_perimeter.national.income / NATIONAL_POP * 100) / 100 },
};
const synthetic_kpis = {
  gdp_multiplier: round(by_perimeter.national.gdp / shockEUR * 100) / 100,
  production_multiplier: round(by_perimeter.national.production / shockEUR * 100) / 100,
  employment_intensity_per_meur: round(by_perimeter.national.employment / (shockEUR / 1e6) * 10) / 10,
  fiscal_autofinanc_pct: round(GETTITO_TOTAL / shockEUR * 1000) / 1000,
};

function components(kpi) {
  const t = TOT[kpi]; const sc = (v) => (isFte(kpi) ? r1(v) : round(v * K));
  const secs = SEC[kpi];
  const topBy = (eff) => Object.entries(secs).map(([name, o]) => ({ name, value: sc(o[eff]) })).sort((a, b) => b.value - a.value).slice(0, 3);
  return { direct: sc(t.direct), indirect: sc(t.indirect), induced: sc(t.induced), top_sectors: { direct: topBy("direct"), indirect: topBy("indirect"), induced: topBy("induced") } };
}
const componentsObj = { production: components("production"), gdp: components("gdp"), employment: components("employment") };

function geoValues(name, totals) {
  const pop = name === "national" ? NATIONAL_POP : (REGIONS[name]?.pop ?? PROV_META[name]?.pop ?? 1);
  return {
    production: { absolute: totals.production, per_capita: round(totals.production / pop * 100) / 100 },
    gdp: { absolute: totals.gdp, per_capita: round(totals.gdp / pop * 100) / 100 },
    employment: { absolute: totals.employment, per_capita_per_10k: round(totals.employment / pop * 10000 * 100) / 100 },
    income: { absolute: totals.income, per_capita: round(totals.income / pop * 100) / 100 },
  };
}
function aggregate(level) {
  const acc = {};
  for (const kpi of KPIS) {
    for (const r of raw[kpi]) {
      const meta = PROV_META[r.geo_des]; if (!meta) continue;
      const key = level === "region" ? meta.regione : r.geo_des;
      (acc[key] = acc[key] || { production: 0, gdp: 0, employment: 0, income: 0 });
      acc[key][DIM[kpi]] += (isFte(kpi) ? (r.total_value || 0) : (r.total_value || 0) * K);
    }
  }
  return acc;
}
const regionAgg = aggregate("region");
const provinceAgg = aggregate("province");

const regions = Object.entries(regionAgg).map(([name, t]) => ({
  code: REGIONS[name]?.code ?? "", name, nuts2_code: REGIONS[name]?.nuts2 ?? "", population: REGIONS[name]?.pop ?? 0,
  ...(name === ORIGIN_REGION ? { is_origin: true } : {}),
  values: geoValues(name, { production: round(t.production), gdp: round(t.gdp), employment: r1(t.employment), income: round(t.income) }),
})).sort((a, b) => b.values.production.absolute - a.values.production.absolute);

const provinces = Object.entries(provinceAgg).map(([name, t]) => {
  const meta = PROV_META[name] || {};
  return {
    code: meta.sigla ?? "", name, region_code: REGIONS[meta.regione]?.code ?? "", region_name: meta.regione ?? "", population: meta.pop ?? 0,
    ...(name === ORIGIN_PROV ? { is_origin: true } : {}),
    values: geoValues(name, { production: round(t.production), gdp: round(t.gdp), employment: r1(t.employment), income: round(t.income) }),
  };
}).sort((a, b) => b.values.production.absolute - a.values.production.absolute);

const originProd = by_perimeter.origin_province.production;
const regionProd = by_perimeter.region.production;
const nationalProd = by_perimeter.national.production;
const macro_split = {
  origin: { value: originProd, pct: round(originProd / nationalProd * 100) / 100 },
  rest_of_region: { value: round(regionProd - originProd), pct: round((regionProd - originProd) / nationalProd * 100) / 100 },
  extra_region: { value: round(nationalProd - regionProd), pct: round((nationalProd - regionProd) / nationalProd * 100) / 100 },
};

const sectorNames = Object.keys(SEC.production);
const sectors = {
  items: sectorNames.map((name) => {
    const o = SEC.production[name];
    const mk = (kpi) => {
      const sc = (v) => (isFte(kpi) ? r1(v) : round(v * K));
      const intra = (REGSEC[kpi][ORIGIN_REGION]?.[name]) ?? 0;
      const tot = SEC[kpi][name]?.total ?? 0;
      return { intra: sc(intra), extra: sc(Math.max(0, tot - intra)) };
    };
    const by_territory = { regions: regions.map((reg) => ({
      code: reg.code, name: reg.name,
      values: { gdp: round((REGSEC.gdp[reg.name]?.[name] ?? 0) * K), production: round((REGSEC.production[reg.name]?.[name] ?? 0) * K), employment: r1(REGSEC.employment[reg.name]?.[name] ?? 0) },
    })) };
    return { ateco_code: o.code, ateco_name: name, values: { gdp: mk("gdp"), production: mk("production"), employment: mk("employment") }, by_territory };
  }).sort((a, b) => (b.values.production.intra + b.values.production.extra) - (a.values.production.intra + a.values.production.extra)),
};

const shockRows = sheet(IA, "shock");
const shockTotK = shockRows.reduce((s, r) => s + (r.total_value || 0), 0);
const spend_breakdown = shockRows.map((r) => ({ ateco_code: r.sec_cod, ateco_name: r.sec_des, amount: round(r.total_value * K), share: round((r.total_value / shockTotK) * 1000) / 1000 }))
  .sort((a, b) => b.amount - a.amount);

const OSPEDALE_EIA_DATASET = {
  metadata: { creato_il: "21/07/2026", creato_da: "OpenEconomics S.r.l", ultima_modifica: "21/07/2026", settore: "Infrastrutture sociali", dataset: "SAM multiprovinciale Italia", metodologia: "SAM Italia 63 settori (scenario 841)", categoria_intervento: "Strutture ospedaliere", localizzazione: "Genova", anno_attualizzazione: ANNO_ATT },
  previews: { sintesi: `${(by_perimeter.national.gdp / 1e6).toFixed(1)} M€ PIL`, componenti: "diretto + filiere", geografia: `${Math.round(macro_split.origin.pct * 100)}% a Genova`, settori: "Costruzioni leader", esplora: "Approfondimento dati" },
  input: {
    total_spend: shockEUR, currency: "EUR",
    origin_provinces: [{ code: "GE", name: "Genova", region_code: "07", region_name: "Liguria", spend_share: 1.0 }],
    origin_region: { code: "07", name: "Liguria", nuts2_code: "ITC3" },
    years_of_realization: 8,
    spend_breakdown,
  },
  synthesis: { by_perimeter, fiscal_national: GETTITO_TOTAL, three_segments, per_capita, synthetic_kpis },
  components: componentsObj,
  geography: { regions, provinces, macro_split },
  sectors,
};

// ════════════════════════════════════════════════════════════════════════════
// 3) ECBA — forma engine (riepilogo) + forma ricca (dettaglio)
// ════════════════════════════════════════════════════════════════════════════
const sroi = sheet(ACB, "sroi");
// Riga aggregata nazionale = TOT senza region_code specifico (può essere "" o null).
const tot = Object.fromEntries(sroi.filter((d) => d.dimension === "TOT" && !d.region_code).map((d) => [d.datatypevalue || d.datatype, d.value]));
const csh = sroi.filter((d) => d.dimension === "CSH").sort((a, b) => a.datatypevalue - b.datatypevalue);
let cum = 0, paybackYear = null; const startYear = +csh[0].datatypevalue;
for (const c of csh) { cum += c.value; if (paybackYear === null && cum >= 0) paybackYear = +c.datatypevalue; }
const payback = paybackYear ? paybackYear - startYear : null;
const costi = round(tot["costi"]);
const vane = round(tot["vane"] ?? tot["b_c"]);
const bcr = round(tot["sroi"] * 100) / 100;
const tire = round(tot["tire"] * 1000) / 10;

// Etichette delle voci di beneficio. "Miglioramento dell'accessibilità" è già
// un'etichetta nell'export; i codici KPI262-266/KPI340 restano placeholder finché
// OpenEconomics non fornisce i nomi leggibili (poi si aggiornano qui).
const KPI_LABELS = {
  // KPI262 ha lo stesso concetto della voce già etichettata "Miglioramento
  // dell'accessibilità": si fondono in un'unica voce (vedi merge-by-label sotto).
  KPI262: "Miglioramento dell'accessibilità",
  KPI263: "Tempo di degenza evitato",
  KPI264: "Riduzione della mobilità passiva",
  KPI265: "Riduzione della mortalità infantile",
  KPI266: "Inabilità evitata",
  KPI340: "Riduzione emissioni di CO2 per veicoli pesanti",
};

const kpiYear = {}; const kpiPv = {};
for (const d of sroi) {
  if (d.dimension !== "KPI") continue;
  if (d.category === "year") { (kpiYear[d.datatype] = kpiYear[d.datatype] || {}); kpiYear[d.datatype][+d.datatypevalue] = d.value; }
  if (d.category === "pv") kpiPv[d.datatype] = d.value;
}
const M = (v) => round(v / 1e6 * 100) / 100;

const categorieRaw = Object.entries(kpiPv)
  .map(([code, v]) => ({ code, label: KPI_LABELS[code] ?? code, valore_pv: round(v) }));
// Merge-by-label: voci con la stessa etichetta si sommano (es. KPI262 confluisce
// in "Miglioramento dell'accessibilità"). Mantiene il totale in euro invariato.
const _mergeMap = new Map();
for (const c of categorieRaw) {
  if (_mergeMap.has(c.label)) _mergeMap.get(c.label).valore_pv += c.valore_pv;
  else _mergeMap.set(c.label, { ...c });
}
const categorie = [..._mergeMap.values()].sort((a, b) => b.valore_pv - a.valore_pv);
const beneficiLordi = round(categorie.filter((c) => c.valore_pv > 0).reduce((s, c) => s + c.valore_pv, 0));
const esternalitaNeg = round(-categorie.filter((c) => c.valore_pv < 0).reduce((s, c) => s + c.valore_pv, 0));
const benefici = round(tot["benefici"]);

const OSPEDALE_ECBA_RESULTS = {
  van: vane, bc: bcr, tir: tire, payback, bcr, irr: tire, payback_period: payback,
  benefici_totali: benefici, costi_totali: costi,
  benefici_categorie: categorie.map((c) => ({ id: c.code, nome: c.label, valore_pv: c.valore_pv, quota: round(c.valore_pv / beneficiLordi * 1000) / 1000 })),
  // Costi splittati in Investimento (CAPEX) e Gestione (OPEX): l'export ACB dà il
  // totale, qui lo si separa usando il CAPEX noto (156,6 M€) e il resto come OPEX.
  costi_categorie: [
    { id: "capex", label: "Investimento (CAPEX)", valore_pv: Math.min(CAPEX, costi) },
    { id: "opex", label: "Gestione e manutenzione (OPEX)", valore_pv: Math.max(0, costi - CAPEX) },
  ],
  pv_capex: Math.min(CAPEX, costi), pv_opex: Math.max(0, costi - CAPEX), flussi: [], meta: { orizzonte: VITA_UTILE, tasso: TASSO, residual: 0, capex: CAPEX, annual_opex: OPEX_ANNUAL },
};

const years = csh.map((c) => +c.datatypevalue);
const benByYear = years.map((y) => Object.entries(kpiYear).reduce((s, [code, ys]) => s + ((kpiPv[code] ?? 0) > 0 ? (ys[y] || 0) : 0), 0));
const cshByYear = Object.fromEntries(csh.map((c) => [+c.datatypevalue, c.value]));
const costByYear = years.map((y, i) => Math.max(0, benByYear[i] - (cshByYear[y] || 0)));
const DONUT_COLORS = ["#4400B3", "#6E1AFF", "#ae81fd", "#B9FF69", "#270065", "#9E7BFA", "#3A148F", "#C7F03A", "#5B21F7"];
const posCats = categorie.filter((c) => c.valore_pv > 0);
// pct a 2 decimali: le voci minuscole (es. inabilità ~0,01%) restano > 0 e visibili.
const donut = posCats.map((c, i) => ({ label: c.label, pct: Math.round(c.valore_pv / beneficiLordi * 10000) / 100, color: DONUT_COLORS[i % DONUT_COLORS.length], code: c.code }));

// ── Monte Carlo REALE (25 bin) ────────────────────────────────────────────────
// Ogni simulazione varia benefici e costi entro ±20% (uniforme, indipendenti) e
// ricalcola il VANE = benefici − costi. Seed fisso → istogramma riproducibile.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const MC_N = 1000;
const MC_BINS = 25;
const mcRng = mulberry32(841);
const benM = beneficiLordi / 1e6;
const costM = costi / 1e6;
const sims = [];
for (let i = 0; i < MC_N; i++) {
  const eb = mcRng() * 0.4 - 0.2; // U(-0.2, +0.2)
  const ec = mcRng() * 0.4 - 0.2;
  sims.push(benM * (1 + eb) - costM * (1 + ec));
}
sims.sort((a, b) => a - b);
const mcMin = sims[0];
const mcMax = sims[sims.length - 1];
const mcW = (mcMax - mcMin) / MC_BINS;
const mcFreqCount = new Array(MC_BINS).fill(0);
for (const v of sims) {
  let bi = Math.floor((v - mcMin) / mcW);
  if (bi >= MC_BINS) bi = MC_BINS - 1;
  if (bi < 0) bi = 0;
  mcFreqCount[bi]++;
}
const mcFreq = mcFreqCount.map((c) => Math.round((c / MC_N) * 1000) / 10); // %
const pctile = (p) => sims[Math.min(sims.length - 1, Math.max(0, Math.floor(p * sims.length)))];
const mcMedian = r1(pctile(0.5));
const mcMean = r1(sims.reduce((s, v) => s + v, 0) / sims.length);
const mcStd = r1(Math.sqrt(sims.reduce((s, v) => s + (v - mcMean) ** 2, 0) / sims.length));
const mcProbPos = Math.round((sims.filter((v) => v > 0).length / sims.length) * 100) / 100;
console.log(`  MonteCarlo: ${MC_N} sim, ${MC_BINS} bin · VANE min ${r1(mcMin)} / med ${mcMedian} / max ${r1(mcMax)} M€ · P(>0) ${Math.round(mcProbPos * 100)}% · std ${mcStd}`);

const OSPEDALE_ECBA_DATASET = {
  kpi: { investimento: M(CAPEX), orizzonte: VITA_UTILE, tasso: TASSO, vane: M(vane), tire, bcr, paybackAnno: payback, progetto: "Analisi Ospedale Infantile — Genova", luogo: "provincia di Genova", categoria: "Strutture ospedaliere" },
  waterfall: { benefici: M(beneficiLordi), costi: M(costi), esternalitaNeg: M(esternalitaNeg), vane: M(vane) },
  // Split costi CAPEX/OPEX per il waterfall (in €: il grafico li divide per 1e6).
  pv_capex: Math.min(CAPEX, costi), pv_opex: Math.max(0, costi - CAPEX),
  cashflow: { cost: costByYear.map(M), ben: benByYear.map(M) },
  donut,
  _riskIllustrative: true,
  sensitivity: [
    { name: "Costi di investimento", sub: "±10%", low: M(vane) * 0.72, high: M(vane) * 1.28 },
    { name: "Parametri delle esternalità", sub: "±10%", low: M(vane) * 0.79, high: M(vane) * 1.21 },
    { name: "Tasso di crescita della domanda", sub: "±1 p.p.", low: M(vane) * 0.82, high: M(vane) * 1.18 },
    { name: "Costi di gestione (OPEX)", sub: "±10%", low: M(vane) * 0.88, high: M(vane) * 1.12 },
    { name: "Tasso di sconto sociale", sub: "±0,5 p.p.", low: M(vane) * 0.90, high: M(vane) * 1.10 },
  ].map((s) => ({ ...s, low: round(s.low * 10) / 10, high: round(s.high * 10) / 10 })),
  // base/median ancorati al VANE puntuale (mediana teorica della distribuzione
  // simmetrica); freq/std/p5/p95/P(>0) vengono dalla simulazione a 1000 estrazioni.
  montecarlo: { start: r1(mcMin), w: r1(mcW), freq: mcFreq, base: M(vane) },
  riskSummary: { probPositive: mcProbPos, median: M(vane), mean: M(vane), std: mcStd, p5: r1(pctile(0.05)), p95: r1(pctile(0.95)), criticalVar: "Benefici economici" },
  elasticities: [
    { param: "Costi investimento", value: 2.8 }, { param: "Esternalità", value: 2.1 }, { param: "Crescita domanda", value: 1.8 }, { param: "OPEX", value: 1.2 }, { param: "Tasso sconto", value: 0.9 },
  ],
  variances: [
    { param: "Costi investimento", value: 0.85 }, { param: "Esternalità", value: 0.70 }, { param: "Crescita domanda", value: 0.55 }, { param: "OPEX", value: 0.40 }, { param: "Tasso sconto", value: 0.30 },
  ],
  simulationCount: MC_N,
  heatmap: { benefici: M(benefici), costiTotali: M(costi), costMults: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3], benefitMults: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3] },
};

// ════════════════════════════════════════════════════════════════════════════
const DESCRIZIONE = "Potenziamento infrastrutturale di un ospedale pediatrico a Genova: demolizione e ricostruzione di padiglioni, rifunzionalizzazione di edifici storici, realizzazione di impianti energetici e nuova organizzazione per piattaforme assistenziali. Efficientamento energetico, ammodernamento del patrimonio sanitario e promozione della ricerca medica. Scenario di analisi n. 841 (EIA + ACB).";

const OSPEDALE_PROJECT = {
  id: "PROJ-OSP-841", cup: "—", nome: "Analisi Ospedale Infantile — Genova",
  descrizione: DESCRIZIONE,
  stato: "Approvato", creato_il: "21/07/2026", ultima_modifica: "21/07/2026",
  creato_da: "OpenEconomics S.r.l", proprietario: "OpenEconomics S.r.l",
  configurazione: {
    settore: "Infrastrutture sociali", sotto_settore: "Sanitarie",
    categoria_intervento: "Strutture ospedaliere", tipo_intervento: "Ristrutturazione",
    durata_progetto: `${VITA_UTILE} anni`, localizzazione: "Genova GE", nuts_code: "ITC33", nuts_label: "Genova",
    anno_attualizzazione: ANNO_ATT, tasso_attualizzazione: TASSO, capex: CAPEX, opex: OPEX_ANNUAL, vita_utile: VITA_UTILE,
  },
};

const body = `// AUTO-GENERATO da "progetto ospedale pediatrico" (IA scenario 841 + ACB scenario 841).
// Dati reali aggregati dagli export EIA/ECBA. NON modificare a mano: rigenerare
// con \`node scripts/build-ospedale-project.cjs\` se gli xlsx cambiano.
//
// - OSPEDALE_*_RESULTS : forma engine (computeEia/computeEcba) → card riepilogo ProjectDetail.
// - OSPEDALE_*_DATASET : forma ricca (eiaResults.json / ecbaData.js) → viste di dettaglio.
//   Gettito fiscale = proxy 22% del PIL (non nell'export IA).
//   Etichette benefici KPI262-266/KPI340 = placeholder (da fornire OpenEconomics).
//   Le sezioni di rischio ECBA non sono nell'export e sono illustrative (_riskIllustrative).

export const OSPEDALE_PROJECT = ${JSON.stringify(OSPEDALE_PROJECT, null, 2)};

export const OSPEDALE_EIA_RESULTS = ${JSON.stringify(OSPEDALE_EIA_RESULTS, null, 2)};

export const OSPEDALE_ECBA_RESULTS = ${JSON.stringify(OSPEDALE_ECBA_RESULTS, null, 2)};

export const OSPEDALE_EIA_DATASET = ${JSON.stringify(OSPEDALE_EIA_DATASET, null, 2)};

export const OSPEDALE_ECBA_DATASET = ${JSON.stringify(OSPEDALE_ECBA_DATASET, null, 2)};
`;

fs.writeFileSync(OUT, body);
console.log("✓ scritto", path.relative(ROOT, OUT));
console.log(`  EIA  shock €${shockEUR.toLocaleString("it-IT")} · molt ${OSPEDALE_EIA_RESULTS.moltiplicatore} · PIL €${OSPEDALE_EIA_RESULTS.gva.totale.toLocaleString("it-IT")} · gettito(proxy) €${GETTITO_TOTAL.toLocaleString("it-IT")} · ${empBreak.totale} ETP`);
console.log(`  perimetri PIL: Genova €${by_perimeter.origin_province.gdp.toLocaleString("it-IT")} · Liguria €${by_perimeter.region.gdp.toLocaleString("it-IT")} · Italia €${by_perimeter.national.gdp.toLocaleString("it-IT")}`);
console.log(`  geografia: ${regions.length} regioni · ${provinces.length} province · ${sectors.items.length} settori`);
console.log(`  ECBA benefici €${benefici.toLocaleString("it-IT")} · costi €${costi.toLocaleString("it-IT")} · VANE €${vane.toLocaleString("it-IT")} · B/C ${bcr} · TIRE ${tire}% · payback ${payback} anni · donut ${donut.length} voci`);
console.log(`  benefici annui somma (M€): ${benByYear.reduce((s,v)=>s+v,0).toFixed(0)} · cashflow anni: ${years.length}`);
