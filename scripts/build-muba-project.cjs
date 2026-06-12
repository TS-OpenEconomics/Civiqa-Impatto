// Rigenera app/src/mocks/mubaProject.js dagli export reali del progetto MUBA
// (cartella "progetto muba"): IA scenario 976 (EIA) + ACB scenario 976 (ECBA/SROI).
//
//   node scripts/build-muba-project.cjs
//
// Emette CINQUE export:
//  - MUBA_PROJECT        config progetto (forma project.json)
//  - MUBA_EIA_RESULTS    risultati EIA forma engine (computeEia) → card riepilogo
//  - MUBA_ECBA_RESULTS   risultati ECBA forma engine (computeEcba) → card riepilogo
//  - MUBA_EIA_DATASET    dataset ricco forma eiaResults.json → vista di dettaglio EIA
//  - MUBA_ECBA_DATASET   dataset ricco forma ecbaData.js → vista di dettaglio ECBA
//
// Eseguire di nuovo se gli xlsx cambiano.

const fs = require("fs");
const path = require("path");
const XLSX = require("../app/node_modules/xlsx");

const ROOT = path.join(__dirname, "..");
const IA = path.join(ROOT, "progetto muba", "IA scenario 976.xlsx");
const ACB = path.join(ROOT, "progetto muba", "ACB scenario 976.xlsx");
const OUT = path.join(ROOT, "app", "src", "mocks", "mubaProject.js");
const K = 1000; // valori negli xlsx in k€ → €

// Gettito fiscale complessivo (fornito da OpenEconomics: non è nell'export IA).
const GETTITO_TOTAL = 8456460;

function sheet(file, name) {
  const rows = XLSX.utils.sheet_to_json(XLSX.readFile(file).Sheets[name], { header: 1, defval: null });
  const hdr = rows[0];
  return rows.slice(1).map((r) => Object.fromEntries(hdr.map((h, i) => [h, r[i]])));
}

// ── Anagrafica province (ordine ISTAT) → sigla, regione, codici, popolazione ───
// Popolazione ISTAT ~2023 (approssimata; serve solo ai valori pro capite).
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

const ORIGIN_PROV = "Bologna";
const ORIGIN_REGION = "Emilia-Romagna";

// ── Carica le 4 sheet KPI in mappe (geo,sec) → {total,direct,indirect,induced} ─
const KPIS = ["production", "gdp", "employment", "incomes"];
const DIM = { production: "production", gdp: "gdp", employment: "employment", incomes: "income" };
const raw = {}; // raw[kpi] = array di righe
for (const k of KPIS) raw[k] = sheet(IA, k);

const isFte = (k) => k === "employment";
const scale = (k, v) => (isFte(k) ? v : v * K); // FTE non si scala

// somma helper
function totals(kpi) {
  let total = 0, direct = 0, indirect = 0, induced = 0;
  for (const r of raw[kpi]) { total += r.total_value || 0; direct += r.direct_value || 0; indirect += r.indirect_value || 0; induced += r.induced_value || 0; }
  return { total, direct, indirect, induced };
}
// per geografia: byGeo[kpi][geo] = total
function byGeo(kpi) { const m = {}; for (const r of raw[kpi]) m[r.geo_des] = (m[r.geo_des] || 0) + (r.total_value || 0); return m; }
// per settore: bySec[kpi][sec] = {total,direct,indirect,induced}
function bySec(kpi) {
  const m = {};
  for (const r of raw[kpi]) {
    const s = (m[r.sec_des] = m[r.sec_des] || { code: r.sec_cod, total: 0, direct: 0, indirect: 0, induced: 0 });
    s.total += r.total_value || 0; s.direct += r.direct_value || 0; s.indirect += r.indirect_value || 0; s.induced += r.induced_value || 0;
  }
  return m;
}
// per (regione, settore): regSec[kpi][regione][sec] = total
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

// ════════════════════════════════════════════════════════════════════════════
// 1) FORMA ENGINE (computeEia) — card riepilogo ProjectDetail
// ════════════════════════════════════════════════════════════════════════════
function moneyBreak(kpi) {
  const t = TOT[kpi];
  return { diretto: round(t.direct * K), indiretto: round(t.indirect * K), indotto: round(t.induced * K), totale: round(t.total * K) };
}
const r1 = (x) => round(x * 10) / 10;
const empBreak = { diretto: r1(TOT.employment.direct), indiretto: r1(TOT.employment.indirect), indotto: r1(TOT.employment.induced), totale: r1(TOT.employment.total) };

// gettito ripartito sulle componenti del PIL
const gdpT = TOT.gdp.total || 1;
const gettitoBreak = {
  diretto: round(GETTITO_TOTAL * TOT.gdp.direct / gdpT),
  indiretto: round(GETTITO_TOTAL * TOT.gdp.indirect / gdpT),
  indotto: round(GETTITO_TOTAL * TOT.gdp.induced / gdpT),
  totale: GETTITO_TOTAL,
};

const prodTotEUR = round(TOT.production.total * K);
const regAggProd = {}; // produzione per regione
for (const [g, v] of Object.entries(GEO.production)) { const reg = PROV_META[g]?.regione || "Altre"; regAggProd[reg] = (regAggProd[reg] || 0) + v; }
const maxReg = Math.max(...Object.values(regAggProd));
const per_territorio = Object.entries(regAggProd)
  .map(([regione, v]) => ({ regione, valore: round(v * K), intensita: round((v / maxReg) * 100) / 100 }))
  .sort((a, b) => b.valore - a.valore);
const per_settore = Object.entries(SEC.production)
  .map(([settore, o]) => ({ settore, share: round((o.total / TOT.production.total) * 1000) / 1000, valore: round(o.total * K) }))
  .sort((a, b) => b.valore - a.valore);

const MUBA_EIA_RESULTS = {
  shock_totale: shockEUR,
  moltiplicatore: round((prodTotEUR / shockEUR) * 100) / 100,
  produzione: moneyBreak("production"),
  gva: moneyBreak("gdp"),
  fte: empBreak,
  redditi: moneyBreak("incomes"),
  gettito: gettitoBreak,
  per_territorio, per_settore, per_anno: [],
  scenario: { settore: "Infrastrutture sociali", nuts_code: "ITH55", nuts_label: "Bologna", capex: shockEUR, opex_annuo: 0, vita_utile: 25, anno_inizio: 2025, anno_fine: 2050, granularita: "provinciale", tipo: "completa" },
};

// ════════════════════════════════════════════════════════════════════════════
// 2) FORMA RICCA (eiaResults.json) — vista di dettaglio EIA
// ════════════════════════════════════════════════════════════════════════════
// perimetri: provincia origine (Bologna), regione (Emilia-Romagna), nazionale
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

// components: direct/indirect/induced + top_sectors per effetto
function components(kpi) {
  const t = TOT[kpi]; const sc = (v) => (isFte(kpi) ? r1(v) : round(v * K));
  const secs = SEC[kpi];
  const topBy = (eff) => Object.entries(secs).map(([name, o]) => ({ name, value: sc(o[eff]) })).sort((a, b) => b.value - a.value).slice(0, 3);
  return { direct: sc(t.direct), indirect: sc(t.indirect), induced: sc(t.induced), top_sectors: { direct: topBy("direct"), indirect: topBy("indirect"), induced: topBy("induced") } };
}
const componentsObj = { production: components("production"), gdp: components("gdp"), employment: components("employment") };

// geography
function geoValues(name, totals) {
  // totals: {production, gdp, employment, income} in valori scalati
  const pop = name === "national" ? NATIONAL_POP : (REGIONS[name]?.pop ?? PROV_META[name]?.pop ?? 1);
  return {
    production: { absolute: totals.production, per_capita: round(totals.production / pop * 100) / 100 },
    gdp: { absolute: totals.gdp, per_capita: round(totals.gdp / pop * 100) / 100 },
    employment: { absolute: totals.employment, per_capita_per_10k: round(totals.employment / pop * 10000 * 100) / 100 },
    income: { absolute: totals.income, per_capita: round(totals.income / pop * 100) / 100 },
  };
}
// aggrega per regione e provincia
function aggregate(level) {
  // level: 'region' | 'province'
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

// sectors.items con values {intra,extra} e by_territory per regione
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

// input / spend_breakdown dallo shock
const shockRows = sheet(IA, "shock");
const shockTotK = shockRows.reduce((s, r) => s + (r.total_value || 0), 0);
const spend_breakdown = shockRows.map((r) => ({ ateco_code: r.sec_cod, ateco_name: r.sec_des, amount: round(r.total_value * K), share: round((r.total_value / shockTotK) * 1000) / 1000 }))
  .sort((a, b) => b.amount - a.amount);

const MUBA_EIA_DATASET = {
  metadata: { creato_il: "12/06/2026", creato_da: "OpenEconomics S.r.l, Riccardo Scialla", ultima_modifica: "12/06/2026", settore: "Infrastrutture sociali", dataset: "SAM multiprovinciale Italia", metodologia: "SAM Italia 63 settori (scenario 976)", categoria_intervento: "Valorizzazione e fruizione del patrimonio culturale", localizzazione: "Bologna", anno_attualizzazione: 2025 },
  previews: { sintesi: `${(by_perimeter.national.gdp / 1e6).toFixed(1)} M€ PIL`, componenti: "diretto + filiere", geografia: `${Math.round(macro_split.origin.pct * 100)}% a Bologna`, settori: "Attività artistiche leader", esplora: "Approfondimento dati" },
  input: {
    total_spend: shockEUR, currency: "EUR",
    origin_provinces: [{ code: "BO", name: "Bologna", region_code: "08", region_name: "Emilia-Romagna", spend_share: 1.0 }],
    origin_region: { code: "08", name: "Emilia-Romagna", nuts2_code: "ITH5" },
    years_of_realization: 2,
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
const tot = Object.fromEntries(sroi.filter((d) => d.dimension === "TOT" && d.region_code === "").map((d) => [d.datatypevalue || d.datatype, d.value]));
const csh = sroi.filter((d) => d.dimension === "CSH").sort((a, b) => a.datatypevalue - b.datatypevalue);
let cum = 0, paybackYear = null; const startYear = +csh[0].datatypevalue;
for (const c of csh) { cum += c.value; if (paybackYear === null && cum >= 0) paybackYear = +c.datatypevalue; }
const payback = paybackYear ? paybackYear - startYear : null;
const costi = round(tot["costi"]);
const vane = round(tot["vane"] ?? tot["b_c"]);
const bcr = round(tot["sroi"] * 100) / 100;
const tire = round(tot["tire"] * 1000) / 10;

// Etichette delle categorie di beneficio (KPI469–480), fornite da OpenEconomics.
// Match per valore: il pv di ciascun KPI coincide col "Valore Attuale (€)" mostrato.
const KPI_LABELS = {
  KPI469: "Riduzione dispersione scolastica",
  KPI470: "Valore visite scolastiche programmate",
  KPI471: "Accesso equalizzato a servizi culturali",
  KPI472: "Supporto genitorialità e qualità tempo familiare",
  KPI473: "Rigenerazione urbana",
  KPI474: "Emissioni CO2e evitate",
  KPI475: "Valorizzazione immobiliare dell'area",
  KPI476: "Sviluppo cognitivo",
  KPI477: "Integrazione linguistica",
  KPI478: "Inquinamento atmosferico PM10 da cantiere",
  KPI479: "Rumore da cantiere",
  KPI480: "Aumento traffico veicolare",
};

// KPI: pv (Valore Attuale) e flusso annuo
const kpiYear = {}; const kpiPv = {};
for (const d of sroi) {
  if (d.dimension !== "KPI") continue;
  if (d.category === "year") { (kpiYear[d.datatype] = kpiYear[d.datatype] || {}); kpiYear[d.datatype][+d.datatypevalue] = d.value; }
  if (d.category === "pv") kpiPv[d.datatype] = d.value;
}
const M = (v) => round(v / 1e6 * 100) / 100; // € → M€

// Categorie di beneficio ordinate per valore (positive = benefici, negative = esternalità).
const categorie = Object.entries(kpiPv)
  .map(([code, v]) => ({ code, label: KPI_LABELS[code] ?? code, valore_pv: round(v) }))
  .sort((a, b) => b.valore_pv - a.valore_pv);
const beneficiLordi = round(categorie.filter((c) => c.valore_pv > 0).reduce((s, c) => s + c.valore_pv, 0));
const esternalitaNeg = round(-categorie.filter((c) => c.valore_pv < 0).reduce((s, c) => s + c.valore_pv, 0));
const benefici = round(tot["benefici"]); // netto SROI (≈ beneficiLordi − esternalitaNeg)

const MUBA_ECBA_RESULTS = {
  van: vane, bc: bcr, tir: tire, payback, bcr, irr: tire, payback_period: payback,
  benefici_totali: benefici, costi_totali: costi,
  benefici_categorie: categorie.map((c) => ({ id: c.code, nome: c.label, valore_pv: c.valore_pv, quota: round(c.valore_pv / beneficiLordi * 1000) / 1000 })),
  costi_categorie: [{ id: "capex", label: "Investimento e costi (valore attuale)", valore_pv: costi }],
  pv_capex: costi, pv_opex: 0, flussi: [], meta: { orizzonte: 25, tasso: 3.5, residual: 0, capex: shockEUR, annual_opex: 0 },
};

const years = csh.map((c) => +c.datatypevalue);
// benefici annui = somma KPI con pv>0 ; costi annui = benefici − cashflow netto
const benByYear = years.map((y) => Object.entries(kpiYear).reduce((s, [code, ys]) => s + ((kpiPv[code] ?? 0) > 0 ? (ys[y] || 0) : 0), 0));
const cshByYear = Object.fromEntries(csh.map((c) => [+c.datatypevalue, c.value]));
const costByYear = years.map((y, i) => Math.max(0, benByYear[i] - (cshByYear[y] || 0)));
// donut: categorie di beneficio positive con etichette reali
const DONUT_COLORS = ["#4400B3", "#6E1AFF", "#ae81fd", "#B9FF69", "#270065", "#9E7BFA", "#3A148F", "#C7F03A", "#5B21F7"];
const posCats = categorie.filter((c) => c.valore_pv > 0);
const donut = posCats.map((c, i) => ({ label: c.label, pct: round(c.valore_pv / beneficiLordi * 100), color: DONUT_COLORS[i % DONUT_COLORS.length], code: c.code }));

const MUBA_ECBA_DATASET = {
  kpi: { investimento: M(shockEUR), orizzonte: 25, tasso: 3.5, vane: M(vane), tire, bcr, paybackAnno: payback, progetto: "MUBA — Polo culturale di Bologna", luogo: "provincia di Bologna", categoria: "Cultura e valorizzazione del territorio" },
  waterfall: { benefici: M(beneficiLordi), costi: M(costi), esternalitaNeg: M(esternalitaNeg), vane: M(vane) },
  cashflow: { cost: costByYear.map(M), ben: benByYear.map(M) },
  donut,
  // Sezioni di rischio/sensitività: NON presenti nell'export ACB dello scenario.
  // Mantenute come illustrazione metodologica, riscalate sul VANE reale del progetto.
  _riskIllustrative: true,
  sensitivity: [
    { name: "Costi di investimento", sub: "±10%", low: M(vane) * 0.72, high: M(vane) * 1.28 },
    { name: "Parametri delle esternalità", sub: "±10%", low: M(vane) * 0.79, high: M(vane) * 1.21 },
    { name: "Tasso di crescita della domanda", sub: "±1 p.p.", low: M(vane) * 0.82, high: M(vane) * 1.18 },
    { name: "Costi di gestione (OPEX)", sub: "±10%", low: M(vane) * 0.88, high: M(vane) * 1.12 },
    { name: "Tasso di sconto sociale", sub: "±0,5 p.p.", low: M(vane) * 0.90, high: M(vane) * 1.10 },
  ].map((s) => ({ ...s, low: round(s.low * 10) / 10, high: round(s.high * 10) / 10 })),
  montecarlo: { start: round(M(vane) - 18), w: 4, freq: [1, 2, 5, 11, 18, 22, 18, 12, 7, 3, 1], base: M(vane) },
  riskSummary: { probPositive: 0.95, median: M(vane), mean: round(M(vane) * 0.98 * 10) / 10, std: round(M(vane) * 0.35 * 10) / 10, p5: round(M(vane) * 0.45 * 10) / 10, p95: round(M(vane) * 1.55 * 10) / 10, criticalVar: "Costi di investimento" },
  elasticities: [
    { param: "Costi investimento", value: 2.8 }, { param: "Esternalità", value: 2.1 }, { param: "Crescita domanda", value: 1.8 }, { param: "OPEX", value: 1.2 }, { param: "Tasso sconto", value: 0.9 },
  ],
  variances: [
    { param: "Costi investimento", value: 0.85 }, { param: "Esternalità", value: 0.70 }, { param: "Crescita domanda", value: 0.55 }, { param: "OPEX", value: 0.40 }, { param: "Tasso sconto", value: 0.30 },
  ],
  simulationCount: 1000,
  heatmap: { benefici: M(benefici), costiTotali: M(costi), costMults: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3], benefitMults: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3] },
};

// ════════════════════════════════════════════════════════════════════════════
const MUBA_PROJECT = {
  id: "PROJ-MUBA-976", cup: "I69J21000000976", nome: "MUBA — Polo culturale di Bologna",
  descrizione: "Intervento di valorizzazione culturale a Bologna: recupero degli spazi, allestimenti museali e attività artistiche. Scenario di analisi n. 976 (EIA + ACB).",
  stato: "Approvato", creato_il: "12/06/2026", ultima_modifica: "12/06/2026",
  creato_da: "OpenEconomics S.r.l, Riccardo Scialla", proprietario: "Riccardo Scialla",
  configurazione: {
    settore: "Infrastrutture sociali", sotto_settore: "Cultura, turismo e valorizzazione del territorio",
    categoria_intervento: "Valorizzazione e fruizione del patrimonio culturale", tipo_intervento: "Recupero",
    durata_progetto: "25 anni", localizzazione: "Bologna BO", nuts_code: "ITH55", nuts_label: "Bologna",
    anno_attualizzazione: 2025, tasso_attualizzazione: 3.5, capex: shockEUR, opex: 0, vita_utile: 25,
  },
};

const body = `// AUTO-GENERATO da "progetto muba" (IA scenario 976 + ACB scenario 976).
// Dati reali aggregati dagli export EIA/ECBA. NON modificare a mano: rigenerare
// con \`node scripts/build-muba-project.cjs\` se gli xlsx cambiano.
//
// - MUBA_*_RESULTS : forma engine (computeEia/computeEcba) → card riepilogo ProjectDetail.
// - MUBA_*_DATASET : forma ricca (eiaResults.json / ecbaData.js) → viste di dettaglio.
//   Il gettito fiscale (€${GETTITO_TOTAL.toLocaleString("it-IT")}) è fornito da OpenEconomics (non è nell'export IA).
//   Le sezioni di rischio ECBA non sono nell'export e sono illustrative (_riskIllustrative).

export const MUBA_PROJECT = ${JSON.stringify(MUBA_PROJECT, null, 2)};

export const MUBA_EIA_RESULTS = ${JSON.stringify(MUBA_EIA_RESULTS, null, 2)};

export const MUBA_ECBA_RESULTS = ${JSON.stringify(MUBA_ECBA_RESULTS, null, 2)};

export const MUBA_EIA_DATASET = ${JSON.stringify(MUBA_EIA_DATASET, null, 2)};

export const MUBA_ECBA_DATASET = ${JSON.stringify(MUBA_ECBA_DATASET, null, 2)};
`;

fs.writeFileSync(OUT, body);
console.log("✓ scritto", path.relative(ROOT, OUT));
console.log(`  EIA  shock €${shockEUR.toLocaleString("it-IT")} · molt ${MUBA_EIA_RESULTS.moltiplicatore} · PIL €${MUBA_EIA_RESULTS.gva.totale.toLocaleString("it-IT")} · gettito €${GETTITO_TOTAL.toLocaleString("it-IT")} · ${empBreak.totale} ETP`);
console.log(`  perimetri PIL: Bologna €${by_perimeter.origin_province.gdp.toLocaleString("it-IT")} · E-R €${by_perimeter.region.gdp.toLocaleString("it-IT")} · Italia €${by_perimeter.national.gdp.toLocaleString("it-IT")}`);
console.log(`  geografia: ${regions.length} regioni · ${provinces.length} province · ${sectors.items.length} settori`);
console.log(`  ECBA benefici €${benefici.toLocaleString("it-IT")} · costi €${costi.toLocaleString("it-IT")} · VANE €${vane.toLocaleString("it-IT")} · B/C ${bcr} · TIRE ${tire}% · payback ${payback} anni · donut ${donut.length} voci`);
