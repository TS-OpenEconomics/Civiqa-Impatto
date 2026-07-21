// Registro dei dataset EIA (forma eiaResults.json) per la vista di dettaglio.
// MUBA/Ospedale: dataset statici dagli Excel. Asilo nido (alternative DOCFAP):
// costruiti a runtime da computeEia (coerenza col DOCFAP), con geografia minimale
// realistica per un intervento comunale (Lazio/Roma).
import staticResults from "./eiaResults.json";
import { MUBA_EIA_DATASET } from "./mubaProject";
import { OSPEDALE_EIA_DATASET } from "./ospedaleProject";
import { getNidoComputedWorkspace } from "../lib/projectState";

export const EIA_DATASETS = {
  "PROJ-MUBA-976": MUBA_EIA_DATASET,
  "PROJ-OSP-841": OSPEDALE_EIA_DATASET,
};

const NIDO_IDS = new Set(["PROJ-NIDO-A1", "PROJ-NIDO-A2", "PROJ-NIDO-A3"]);
const round = (v) => Math.round(v);
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;

// Popolazioni di riferimento (ISTAT ~2024): provincia di Roma, regione Lazio, Italia.
const POP_ORIGIN = 4200000;
const POP_REGION = 5700000;
const POP_NATIONAL = 59000000;
// Ripartizione territoriale dell'impatto per un intervento comunale:
// 60% origine (comune/provincia), 25% resto regione, 15% extra-regione.
const SH_ORIGIN = 0.6;
const SH_REGION = 0.85; // origine + resto regione (cumulato)

function pc(value, pop) { return r1((value / pop)); }
function pc10k(emp, pop) { return r1((emp / pop) * 10000); }

// Mapping settori → codici ATECO per React keys (distinti, come negli static datasets)
const SECTOR_ATECO = {
  "Costruzioni": "F",
  "Servizi professionali": "M",
  "Materiali da costruzione": "C",
  "Trasporti e logistica": "H",
  "Energia e utilities": "D",
  "Commercio": "G",
  "ICT e digitale": "J",
  "Finanza e assicurazioni": "K",
  "Sanità e assistenza": "Q",
  "Altri servizi": "S",
};

// Mappa i risultati di computeEia (workspace.eiaResults) sulla forma eiaResults.json.
export function buildNidoEiaDataset(ws) {
  const e = ws?.eiaResults;
  if (!e) return staticResults;
  const conf = ws.project?.configurazione ?? {};
  const shock = e.shock_totale ?? conf.capex ?? 0;
  const prod = e.produzione?.totale ?? 0;
  const gdp = e.gva?.totale ?? 0;
  const emp = e.fte?.totale ?? 0;
  const inc = e.redditi?.totale ?? 0;
  const fisc = e.gettito?.totale ?? 0;

  const national = { production: round(prod), gdp: round(gdp), employment: r1(emp), income: round(inc), fiscal: round(fisc) };
  const region = { production: round(prod * SH_REGION), gdp: round(gdp * SH_REGION), employment: r1(emp * SH_REGION), income: round(inc * SH_REGION), fiscal: null };
  const origin = { production: round(prod * SH_ORIGIN), gdp: round(gdp * SH_ORIGIN), employment: r1(emp * SH_ORIGIN), income: round(inc * SH_ORIGIN), fiscal: null };

  const three_segments = {
    production: { origin: origin.production, rest_region: region.production - origin.production, extra: national.production - region.production },
    gdp: { origin: origin.gdp, rest_region: region.gdp - origin.gdp, extra: national.gdp - region.gdp },
    employment: { origin: origin.employment, rest_region: r1(region.employment - origin.employment), extra: r1(national.employment - region.employment) },
    income: { origin: origin.income, rest_region: region.income - origin.income, extra: national.income - region.income },
  };

  // componenti dirette/indirette/indotte dal buildBreakdown del motore.
  const topSectors = (phaseTotal) => (e.per_settore ?? []).slice(0, 3).map((s) => ({ name: s.settore, value: round(phaseTotal * s.share) }));
  const comp = (br) => ({
    direct: br?.diretto ?? 0,
    indirect: br?.indiretto ?? 0,
    induced: br?.indotto ?? 0,
    top_sectors: { direct: topSectors(br?.diretto ?? 0), indirect: topSectors(br?.indiretto ?? 0), induced: topSectors(br?.indotto ?? 0) },
  });

  const regionValues = {
    production: { absolute: region.production, per_capita: pc(region.production, POP_REGION) },
    gdp: { absolute: region.gdp, per_capita: pc(region.gdp, POP_REGION) },
    employment: { absolute: region.employment, per_capita_per_10k: pc10k(region.employment, POP_REGION) },
    income: { absolute: region.income, per_capita: pc(region.income, POP_REGION) },
  };
  const originValues = {
    production: { absolute: origin.production, per_capita: pc(origin.production, POP_ORIGIN) },
    gdp: { absolute: origin.gdp, per_capita: pc(origin.gdp, POP_ORIGIN) },
    employment: { absolute: origin.employment, per_capita_per_10k: pc10k(origin.employment, POP_ORIGIN) },
    income: { absolute: origin.income, per_capita: pc(origin.income, POP_ORIGIN) },
  };

  const sectorsItems = (e.per_settore ?? []).map((s) => {
    const p = round(prod * s.share);
    const g = round(gdp * s.share);
    const f = r1(emp * s.share);
    return {
      ateco_code: SECTOR_ATECO[s.settore] ?? "", ateco_name: s.settore,
      values: { gdp: { intra: g, extra: 0 }, production: { intra: p, extra: 0 }, employment: { intra: f, extra: 0 } },
      by_territory: { regions: [{ code: "12", name: "Lazio", values: { gdp: g, production: p, employment: f } }] },
    };
  });

  return {
    metadata: {
      creato_il: ws.project?.creato_il ?? "15/07/2026",
      creato_da: "OpenEconomics S.r.l",
      ultima_modifica: ws.project?.ultima_modifica ?? "15/07/2026",
      settore: conf.settore ?? "Infrastrutture sociali",
      dataset: "SAM Italia (settori)",
      metodologia: "Moltiplicatori settoriali SAM Italia",
      categoria_intervento: conf.categoria_intervento ?? "Asili Nido",
      localizzazione: conf.nuts_label ?? conf.localizzazione ?? "Roma",
      anno_attualizzazione: conf.anno_attualizzazione ?? 2026,
    },
    previews: {
      sintesi: `${r1(national.gdp / 1e6)} M€ PIL`,
      componenti: "diretto + filiere",
      geografia: `${Math.round(SH_ORIGIN * 100)}% sul territorio`,
      settori: "Costruzioni in testa",
      esplora: "Approfondimento dati",
    },
    input: {
      total_spend: round(shock), currency: "EUR",
      origin_provinces: [{ code: "RM", name: "Roma", region_code: "12", region_name: "Lazio", spend_share: 1.0 }],
      origin_region: { code: "12", name: "Lazio", nuts2_code: "ITI4" },
      years_of_realization: 2,
      spend_breakdown: (e.per_settore ?? []).slice(0, 6).map((s) => ({ ateco_code: SECTOR_ATECO[s.settore] ?? "", ateco_name: s.settore, amount: round(shock * s.share), share: r2(s.share) })),
    },
    synthesis: {
      by_perimeter: { origin_province: origin, region, national },
      fiscal_national: national.fiscal,
      three_segments,
      per_capita: {
        origin_province: { population: POP_ORIGIN, production_pc: pc(origin.production, POP_ORIGIN), gdp_pc: pc(origin.gdp, POP_ORIGIN), employment_pc_per_10k: pc10k(origin.employment, POP_ORIGIN), income_pc: pc(origin.income, POP_ORIGIN) },
        region: { population: POP_REGION, production_pc: pc(region.production, POP_REGION), gdp_pc: pc(region.gdp, POP_REGION), employment_pc_per_10k: pc10k(region.employment, POP_REGION), income_pc: pc(region.income, POP_REGION) },
        national: { population: POP_NATIONAL, production_pc: pc(national.production, POP_NATIONAL), gdp_pc: pc(national.gdp, POP_NATIONAL), employment_pc_per_10k: pc10k(national.employment, POP_NATIONAL), income_pc: pc(national.income, POP_NATIONAL) },
      },
      synthetic_kpis: {
        gdp_multiplier: shock > 0 ? r2(gdp / shock) : 0,
        production_multiplier: shock > 0 ? r2(prod / shock) : 0,
        employment_intensity_per_meur: shock > 0 ? r1(emp / (shock / 1e6)) : 0,
        fiscal_autofinanc_pct: shock > 0 ? r2(fisc / shock) : 0,
      },
    },
    components: { production: comp(e.produzione), gdp: comp(e.gva), employment: comp(e.fte) },
    geography: {
      regions: [{ code: "12", name: "Lazio", nuts2_code: "ITI4", population: POP_REGION, is_origin: true, values: regionValues }],
      provinces: [{ code: "RM", name: "Roma", region_code: "12", region_name: "Lazio", is_origin: true, population: POP_ORIGIN, values: originValues }],
      macro_split: {
        origin: { value: origin.gdp, pct: r2(SH_ORIGIN) },
        rest_of_region: { value: region.gdp - origin.gdp, pct: r2(SH_REGION - SH_ORIGIN) },
        extra_region: { value: national.gdp - region.gdp, pct: r2(1 - SH_REGION) },
      },
    },
    sectors: { items: sectorsItems },
  };
}

export function getEiaDataset(project) {
  const id = typeof project === "string" ? project : project?.id;
  if (id && EIA_DATASETS[id]) return EIA_DATASETS[id];
  if (id && NIDO_IDS.has(id)) {
    const ws = getNidoComputedWorkspace(id);
    if (ws) return buildNidoEiaDataset(ws);
  }
  return staticResults;
}
