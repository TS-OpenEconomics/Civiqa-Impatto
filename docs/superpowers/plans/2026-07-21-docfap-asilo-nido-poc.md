# DOCFAP Asilo Nido POC — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendere coerenti col DOCFAP le viste di dettaglio Ricadute delle 3 alternative asilo nido (EIA/ECBA), alimentando le pagine esistenti con dataset costruiti a runtime dai numeri del motore, più correzioni di coerenza (card lista, label OPEX) e un capitolo di strategia sul wizard.

**Architecture:** I progetti `PROJ-NIDO-A1/A2/A3` sono già calcolati dal motore in `buildComputedWorkspace` (`projectState.js`). Le pagine `EiaResults`/`EcbaResults` leggono un "dataset ricco" da un registro per-progetto e oggi cadono sul mock generico. Aggiungiamo builder a runtime che mappano l'output di `computeEia`/`computeEcba` sulla forma dataset ricca e li registriamo per gli id nido, più un banner ponte. Nessuna modifica ai motori di calcolo né alle pagine (solo dataset + un banner React).

**Tech Stack:** React 19 + Vite, JavaScript ESM (modulo Ricadute in `app/src/lib` + `app/src/components`), TypeScript nel modulo DOCFAP (`app/src/poc`). Build via Vite.

## Global Constraints

- **Nessun test runner nel repo** (niente vitest/jest installato; i `.test.ts` presenti sono orfani). Il ciclo di verifica di ogni task è: `npm run build` (dalla root) verde + verifica **manuale a schermo** con i valori attesi indicati. NON introdurre un framework di test.
- Comando build (dalla root del repo): `npm run build` → esegue `npm --prefix app run build` (`vite build`). Deve terminare **senza errori**.
- Comando lint (opzionale): `npm --prefix app run lint`.
- **Non modificare** i motori di calcolo: `app/src/lib/eiaEngine.js`, `app/src/lib/ecbaEngine.js`, `app/src/lib/cba/kpiBenefits.js`, `app/src/poc/engine/pocAnalysis.ts`.
- **Non riscrivere** le pagine `EiaResults.jsx`/`EcbaResults.jsx`: sono ammesse solo l'aggiunta della registrazione dataset (nei file registro) e l'inserimento del banner React.
- Valori monetari nella forma dataset ECBA in **M€** (helper `M(v) = Math.round(v/1e6*100)/100`).
- I 3 id nido e le loro etichette alternative (mappa canonica, usata da builder e banner):
  `PROJ-NIDO-A1` → A1 "Nuova costruzione"; `PROJ-NIDO-A2` → A2 "Ristrutturazione"; `PROJ-NIDO-A3` → A3 "Voucher alle famiglie".
- Numeri attesi (dal motore, coerenti col box DOCFAP) da usare nelle verifiche manuali:
  - A1: CAPEX 2,64 M€ · benefici annui €919.800 · VANE ≈ 5,16 M€ · B/C 1,58 · EIA produzione 4,88 M€ / PIL 1,64 M€ / occupati ~33 / redditi 0,90 M€.
  - A2: CAPEX 1,44 M€ · benefici annui €858.480 · VANE ≈ 7,08 M€ · B/C 2,20.
  - A3: CAPEX 0 · benefici annui €231.840 · VANE ≈ −5,47 M€ · B/C 0,39 · donut senza la voce "valore servizio educativo".

---

### Task 1: Esporre il workspace nido calcolato

Fornisce ai builder dataset l'accesso ai risultati EIA/ECBA già calcolati dal motore per ciascun id nido, senza duplicare i parametri (posti/residuo/override) che vivono in `NIDO_PROJECTS`.

**Files:**
- Modify: `app/src/lib/projectState.js` (aggiungere export dopo la definizione di `NIDO_PROJECTS` e `buildComputedWorkspace`, ~riga 255)

**Interfaces:**
- Consumes: `NIDO_PROJECTS` (array esistente), `buildComputedWorkspace(project, opts)` (funzione esistente).
- Produces: `getNidoComputedWorkspace(id: string) => Workspace | null`, dove `Workspace` ha almeno `{ id, project, eiaResults, ecbaResults }`. Memoizzato (costruisce i 3 workspace una sola volta).

- [ ] **Step 1: Aggiungere la funzione esportata memoizzata**

In `app/src/lib/projectState.js`, subito dopo l'array `NIDO_PROJECTS` (chiude a ~riga 255, prima di `function nowDate()`), inserire:

```js
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
```

- [ ] **Step 2: Verificare la build**

Run: `npm run build`
Expected: build completata senza errori (nessun errore di import/sintassi).

- [ ] **Step 3: Commit**

```bash
git add app/src/lib/projectState.js
git commit -m "feat(ricadute): esponi workspace nido calcolato per i builder dataset"
```

---

### Task 2: Builder dataset ECBA nido + registrazione

Mappa l'output di `computeEcba` (in `workspace.ecbaResults`) sulla forma dataset ricca letta da `EcbaResults`, e lo registra per gli id nido. È la vista "star" della demo (spaccato benefici sociali + VANE/BCR coerenti).

**Files:**
- Modify: `app/src/mocks/ecbaDatasets.js`

**Interfaces:**
- Consumes: `getNidoComputedWorkspace(id)` (Task 1); `computeEcba` output in `ws.ecbaResults` con campi `{ van, bc, tir, payback, benefici_totali, costi_totali, benefici_categorie:[{id,nome,valore_pv,quota}], costi_categorie, flussi:[{anno,benefici,costi}], meta:{orizzonte,tasso,capex,annual_opex} }`; forma ECBA target `ecbaData.js` (campi `kpi, waterfall, cashflow, donut, sensitivity, montecarlo, riskSummary, elasticities, variances, simulationCount, heatmap`).
- Produces: `buildNidoEcbaDataset(ws) => EcbaDataset`; `getEcbaDataset(project)` esteso per restituire il dataset nido.

- [ ] **Step 1: Scrivere il builder e integrarlo nel registro**

Sostituire l'intero contenuto di `app/src/mocks/ecbaDatasets.js` con:

```js
// Registro dei dataset ECBA (forma ecbaData.js) per la vista di dettaglio.
// I progetti reali (MUBA/Ospedale) hanno un dataset statico importato dagli Excel.
// I progetti asilo nido (alternative DOCFAP) NON hanno un file statico: sono
// ricalcolabili dal motore, quindi il loro dataset è costruito a runtime dai
// risultati calcolati (unica fonte di verità → coerenza col DOCFAP garantita).
import { ECBA_DATA } from "../components/ecbaData";
import { MUBA_ECBA_DATASET } from "./mubaProject";
import { OSPEDALE_ECBA_DATASET } from "./ospedaleProject";
import { getNidoComputedWorkspace } from "../lib/projectState";

export const ECBA_DATASETS = {
  "PROJ-MUBA-976": MUBA_ECBA_DATASET,
  "PROJ-OSP-841": OSPEDALE_ECBA_DATASET,
};

const NIDO_IDS = new Set(["PROJ-NIDO-A1", "PROJ-NIDO-A2", "PROJ-NIDO-A3"]);
const M = (v) => Math.round((v / 1e6) * 100) / 100; // € → M€ (2 decimali)
const r1 = (v) => Math.round(v * 10) / 10;
const DONUT_COLORS = ["#4400B3", "#6E1AFF", "#ae81fd", "#B9FF69", "#270065", "#9E7BFA"];

function luogoFromConfig(conf) {
  const loc = conf?.localizzazione ?? "";
  const comune = loc.replace(/\s+[A-Z]{2}$/, "").trim();
  return comune ? `comune di ${comune}` : (conf?.nuts_label ?? "territorio di riferimento");
}

// Mappa i risultati di computeEcba (workspace.ecbaResults) sulla forma ecbaData.js.
// I campi KPI/waterfall/donut/cashflow vengono dai numeri reali; i campi di
// rischio/sensitività sono sintetizzati dal VANE (illustrativi), come per MUBA.
export function buildNidoEcbaDataset(ws) {
  const e = ws?.ecbaResults;
  if (!e) return ECBA_DATA;
  const conf = ws.project?.configurazione ?? {};
  const van = e.van;
  const vaneM = M(van);
  const positive = (e.benefici_categorie ?? []).filter((c) => c.id !== "residuo" && (c.valore_pv ?? 0) > 0);
  const beneficiLordiPos = positive.reduce((s, c) => s + c.valore_pv, 0) || 1;
  const donut = positive.map((c, i) => ({
    label: c.nome,
    pct: Math.round((c.valore_pv / beneficiLordiPos) * 100),
    color: DONUT_COLORS[i % DONUT_COLORS.length],
    code: c.id,
  }));

  // cashflow: anno 0 = investimento (costo=capex, benefici=0); anni 1..H dai flussi.
  const flussi = e.flussi ?? [];
  const cost = flussi.map((f) => M(f.costi ?? 0));
  const ben = flussi.map((f) => M(f.benefici ?? 0));

  // Segno-consapevole per VANE negativo (A3 voucher).
  const positiveVane = van >= 0;
  const absVaneM = Math.abs(vaneM);

  return {
    kpi: {
      investimento: M(e.meta?.capex ?? conf.capex ?? 0),
      orizzonte: e.meta?.orizzonte ?? 20,
      tasso: e.meta?.tasso ?? 3,
      vane: vaneM,
      tire: e.tir ?? 0,
      bcr: e.bc ?? 0,
      paybackAnno: e.payback ?? null,
      progetto: ws.project?.nome ?? "Asilo nido comunale",
      luogo: luogoFromConfig(conf),
      categoria: conf.categoria_intervento ?? "Asili Nido",
    },
    waterfall: {
      benefici: M(e.benefici_totali ?? 0),
      costi: M(e.costi_totali ?? 0),
      esternalitaNeg: 0,
      vane: vaneM,
    },
    cashflow: { cost, ben },
    donut,
    _riskIllustrative: true,
    sensitivity: [
      { name: "Costi di investimento", sub: "±10%", low: r1(vaneM * (positiveVane ? 0.72 : 1.28)), high: r1(vaneM * (positiveVane ? 1.28 : 0.72)) },
      { name: "Beneficio annuo per posto", sub: "±10%", low: r1(vaneM * (positiveVane ? 0.68 : 1.32)), high: r1(vaneM * (positiveVane ? 1.32 : 0.68)) },
      { name: "Numero di posti serviti", sub: "±10%", low: r1(vaneM * (positiveVane ? 0.70 : 1.30)), high: r1(vaneM * (positiveVane ? 1.30 : 0.70)) },
      { name: "Costi di gestione (OPEX)", sub: "±10%", low: r1(vaneM * (positiveVane ? 0.88 : 1.12)), high: r1(vaneM * (positiveVane ? 1.12 : 0.88)) },
      { name: "Tasso di sconto sociale", sub: "±0,5 p.p.", low: r1(vaneM * (positiveVane ? 0.90 : 1.10)), high: r1(vaneM * (positiveVane ? 1.10 : 0.90)) },
    ],
    montecarlo: { start: r1(vaneM - absVaneM * 1.5), w: r1(absVaneM * 0.3) || 1, freq: [1, 2, 5, 11, 18, 22, 18, 12, 7, 3, 1], base: vaneM },
    riskSummary: {
      probPositive: positiveVane ? 0.9 : 0.12,
      median: vaneM,
      mean: r1(vaneM * 0.98),
      std: r1(absVaneM * 0.35),
      p5: r1(vaneM - absVaneM * 0.55),
      p95: r1(vaneM + absVaneM * 0.55),
      criticalVar: "Beneficio annuo per posto",
    },
    elasticities: [
      { param: "Beneficio per posto", value: 2.6 },
      { param: "Numero posti", value: 2.4 },
      { param: "Costi investimento", value: 1.5 },
      { param: "OPEX", value: 1.1 },
      { param: "Tasso sconto", value: 0.9 },
    ],
    variances: [
      { param: "Beneficio per posto", value: 0.8 },
      { param: "Numero posti", value: 0.72 },
      { param: "Costi investimento", value: 0.5 },
      { param: "OPEX", value: 0.38 },
      { param: "Tasso sconto", value: 0.3 },
    ],
    simulationCount: 1000,
    heatmap: { benefici: M(e.benefici_totali ?? 0), costiTotali: M(e.costi_totali ?? 0), costMults: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3], benefitMults: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3] },
  };
}

export function getEcbaDataset(project) {
  const id = typeof project === "string" ? project : project?.id;
  if (id && ECBA_DATASETS[id]) return ECBA_DATASETS[id];
  if (id && NIDO_IDS.has(id)) {
    const ws = getNidoComputedWorkspace(id);
    if (ws) return buildNidoEcbaDataset(ws);
  }
  return ECBA_DATA;
}
```

- [ ] **Step 2: Verificare la build**

Run: `npm run build`
Expected: build senza errori (in particolare nessun errore di import ciclico `projectState` ↔ `ecbaDatasets`; se emergesse, spostare l'import di `getNidoComputedWorkspace` a import dinamico dentro `getEcbaDataset`).

- [ ] **Step 3: Verifica manuale a schermo**

Avviare l'app (`npm run dev`), aprire il DOCFAP asilo nido (lista → "Esplora" sul progetto asilo nido completato) → nel box "Analisi Costi-Benefici" cliccare "Analisi completa" su A1.
Expected: pagina ECBA con **Investimento 2,64 M€**, **VANE ≈ 5,2 M€**, **B/C 1,58**, e nel donut le voci dei benefici sociali (Valore servizio educativo, Maggior reddito da sviluppo cognitivo, Occupazione femminile, Risparmio sanitario, Recupero povertà educativa). Ripetere per A2 (VANE ≈ 7,1 M€, B/C 2,20) e A3 (VANE ≈ −5,5 M€, B/C 0,39, donut **senza** "Valore servizio educativo"). Verificare che MUBA e Ospedale mostrino ancora i loro numeri invariati.

- [ ] **Step 4: Commit**

```bash
git add app/src/mocks/ecbaDatasets.js
git commit -m "feat(ricadute): dataset ECBA nido a runtime dal motore (coerente col DOCFAP)"
```

---

### Task 3: Builder dataset EIA nido + registrazione

Mappa l'output di `computeEia` (in `workspace.eiaResults`) sulla forma dataset ricca letta da `EiaResults`, con geografia minimale realistica (Lazio/Roma) coerente con un intervento comunale.

**Files:**
- Modify: `app/src/mocks/eiaDatasets.js`

**Interfaces:**
- Consumes: `getNidoComputedWorkspace(id)` (Task 1); `computeEia` output in `ws.eiaResults` con `{ shock_totale, moltiplicatore, produzione:{diretto,indiretto,indotto,totale}, gva:{...}, fte:{...}, redditi:{...}, gettito:{...}, per_settore:[{settore,share,valore}] }`; forma EIA target `eiaResults.json` (`metadata, previews, input, synthesis, components, geography, sectors`).
- Produces: `buildNidoEiaDataset(ws) => EiaDataset`; `getEiaDataset(project)` esteso per gli id nido.

- [ ] **Step 1: Scrivere il builder e integrarlo nel registro**

Sostituire l'intero contenuto di `app/src/mocks/eiaDatasets.js` con:

```js
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
      ateco_code: "", ateco_name: s.settore,
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
      spend_breakdown: (e.per_settore ?? []).slice(0, 6).map((s) => ({ ateco_code: "", ateco_name: s.settore, amount: round(shock * s.share), share: r2(s.share) })),
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
```

- [ ] **Step 2: Verificare la build**

Run: `npm run build`
Expected: build senza errori.

- [ ] **Step 3: Verifica manuale a schermo**

Dal DOCFAP asilo nido, box "Analisi d'impatto economico" → "Analisi completa" su A1.
Expected: pagina EIA con **PIL ≈ 1,64 M€**, **produzione ≈ 4,88 M€**, **occupati ~33**, **redditi ≈ 0,90 M€**; provincia di riferimento Roma/Lazio; sezioni geografia/settori/componenti popolate (Costruzioni in testa) senza aree vuote o rotte. A2 (PIL ≈ 0,89 M€, produzione ≈ 2,66 M€). A3 CAPEX 0 → impatto da costruzione nullo (valori a 0): verificare che la pagina regga i valori nulli senza rompersi. MUBA/Ospedale invariati.

- [ ] **Step 4: Commit**

```bash
git add app/src/mocks/eiaDatasets.js
git commit -m "feat(ricadute): dataset EIA nido a runtime dal motore (geografia Lazio/Roma)"
```

---

### Task 4: Banner ponte DOCFAP→Ricaduta

Aggiunge un banner di contesto in cima alle pagine EIA/ECBA quando il progetto è un'alternativa nido, con ritorno al dettaglio DOCFAP. Componente React autoconsistente (stili inline) così rende correttamente sia sopra `.ecba-root` sia nel layout Tailwind dell'EIA.

**Files:**
- Create: `app/src/components/NidoBridgeBanner.jsx`
- Modify: `app/src/components/EcbaResults.jsx` (import + inserimento nel `return`, ~riga 1430)
- Modify: `app/src/components/EiaResults.jsx` (import + inserimento nel `return`, dopo il `<nav>` breadcrumb ~riga 366)

**Interfaces:**
- Consumes: nulla (usa `useNavigate` di react-router, disponibile perché le pagine sono dentro il Router).
- Produces: `export function NidoBridgeBanner({ projectId }): JSX | null` — ritorna `null` se `projectId` non è un id nido; altrimenti un banner con l'etichetta dell'alternativa e un pulsante "Torna al DOCFAP".

- [ ] **Step 1: Creare il componente banner**

Creare `app/src/components/NidoBridgeBanner.jsx`:

```jsx
import { useNavigate } from "react-router-dom";

// Mappa id progetto nido → alternativa DOCFAP. Se l'id non è un nido, il banner
// non viene mostrato (ritorna null): le pagine restano invariate per gli altri progetti.
const NIDO_ALT = {
  "PROJ-NIDO-A1": { alt: "A1", label: "Nuova costruzione" },
  "PROJ-NIDO-A2": { alt: "A2", label: "Ristrutturazione" },
  "PROJ-NIDO-A3": { alt: "A3", label: "Voucher alle famiglie" },
};

export function NidoBridgeBanner({ projectId }) {
  const navigate = useNavigate();
  const info = projectId ? NIDO_ALT[projectId] : null;
  if (!info) return null;
  return (
    <div style={wrap}>
      <div style={left}>
        <span style={chip}>{info.alt}</span>
        <span style={text}>
          Alternativa <b>{info.label}</b> · dal DOCFAP «Asilo nido comunale»
        </span>
      </div>
      <button type="button" style={btn} onClick={() => navigate("/impatti/docfap/detail")}>
        ← Torna al DOCFAP
      </button>
    </div>
  );
}

const wrap = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", margin: "0 0 16px", padding: "12px 20px", background: "linear-gradient(95deg,#F3EEFE,#fbf8ff 70%,#fff)", border: "1px solid #E5E5E8", borderRadius: "8px" };
const left = { display: "flex", alignItems: "center", gap: "12px", minWidth: 0 };
const chip = { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "28px", height: "24px", padding: "0 8px", background: "#5B21F7", color: "#fff", fontWeight: 800, fontSize: "12px", fontFamily: "monospace" };
const text = { fontSize: "13.5px", color: "#0E0E10" };
const btn = { border: "1px solid #5B21F7", background: "#fff", color: "#5B21F7", fontWeight: 700, fontSize: "13px", padding: "7px 14px", borderRadius: "6px", cursor: "pointer", whiteSpace: "nowrap" };
```

- [ ] **Step 2: Inserire il banner in EcbaResults**

In `app/src/components/EcbaResults.jsx`, aggiungere l'import in cima (dopo gli altri import, ~riga 4):

```jsx
import { NidoBridgeBanner } from "./NidoBridgeBanner";
```

Poi nel `return` (~riga 1430-1433) inserire il banner come primo figlio dentro `.ecba-root`:

```jsx
  return (
    <div className="ecba-root" ref={rootRef}>
      <style>{CSS}</style>
      <NidoBridgeBanner projectId={project?.id} />
      <EcbaStaticMarkup html={markupHtml} />
```

- [ ] **Step 3: Inserire il banner in EiaResults**

In `app/src/components/EiaResults.jsx`, aggiungere l'import in cima (dopo gli altri import, ~riga 5):

```jsx
import { NidoBridgeBanner } from "./NidoBridgeBanner";
```

Poi nel `return`, subito dopo la chiusura del `<nav>` breadcrumb (~riga 366, prima del `<p className="mb-5 ...">`) inserire:

```jsx
        <NidoBridgeBanner projectId={project?.id} />
```

- [ ] **Step 4: Verificare la build**

Run: `npm run build`
Expected: build senza errori.

- [ ] **Step 5: Verifica manuale a schermo**

Aprire la pagina ECBA e la pagina EIA di A1/A2/A3 dal DOCFAP.
Expected: banner in cima "Alternativa Aₓ · dal DOCFAP «Asilo nido comunale»" con pulsante "← Torna al DOCFAP" che riporta al dettaglio DOCFAP. Aprire MUBA/Ospedale dalla lista Ricadute: **nessun banner** (projectId non nido → null).

- [ ] **Step 6: Commit**

```bash
git add app/src/components/NidoBridgeBanner.jsx app/src/components/EcbaResults.jsx app/src/components/EiaResults.jsx
git commit -m "feat(ricadute): banner ponte DOCFAP→alternativa nella vista EIA/ECBA"
```

---

### Task 5: Coerenza card DOCFAP «asilo nido» (correzione A.1)

Allinea la card `docfap-003` in `DocfapList.tsx` allo scenario reale asilo nido (Colleferro, ristrutturazione), eliminando l'OPEX 80k irrealistico e la localizzazione/tipo incoerenti col dettaglio.

**Files:**
- Modify: `app/src/poc/pages/DocfapList.tsx:63-77` (`MOCK_PROJECTS[2]`), `:115-131` (`docfap-003`)

**Interfaces:**
- Consumes/Produces: nessuna interfaccia condivisa (solo dati statici di UI).

- [ ] **Step 1: Aggiornare `MOCK_PROJECTS[2]` (ALT_C)**

In `app/src/poc/pages/DocfapList.tsx`, sostituire l'oggetto `MOCK_PROJECTS[2]` (righe ~63-77) con valori coerenti con l'alternativa raccomandata A2 (Ristrutturazione, Colleferro):

```ts
  {
    id: 'ALT_C',
    name: "Ristrutturazione e ampliamento dell'asilo nido comunale",
    cup: 'I63C22000050007',
    capex: 1440000,
    opex_annuo: 300000,
    vane: 7082846,
    tire: 8.9,
    bc: 2.2,
    payback: 9,
    pil: 892000,
    occupazione: 18,
    produzione: 2664000,
    redditi: 490000,
  },
```

- [ ] **Step 2: Aggiornare la riga `docfap-003`**

Nella lista `DOCFAP_ENTE`, sostituire i campi incoerenti dell'oggetto `docfap-003` (righe ~115-131): `settore`, `tipoIntervento`, `comune`, `provincia`. Impostare:

```ts
    settore: 'Infrastrutture sociali',
    tipoIntervento: 'Ristrutturazione',
    comune: 'Colleferro',
    provincia: 'Roma',
```

(Lasciare invariati `id`, `nomeIntervento`, `cup`, `stato: 'Completato'`, `dataCreazione`, `inizioLavori`, `durata`, `statoProgetto`, `analisiDisponibili`, `hasScore`.)

- [ ] **Step 3: Verificare la build**

Run: `npm run build`
Expected: build senza errori TypeScript.

- [ ] **Step 4: Verifica manuale a schermo**

Aprire la lista DOCFAP (tab "Docfap del tuo ente"): la card "Ristrutturazione e ampliamento dell'asilo nido comunale" mostra **Colleferro (Roma)**, tipo **Ristrutturazione**, senza OPEX 80k. Cliccando "Esplora" la testata del dettaglio è coerente (Colleferro).

- [ ] **Step 5: Commit**

```bash
git add app/src/poc/pages/DocfapList.tsx
git commit -m "fix(docfap): allinea card asilo nido allo scenario Colleferro/ristrutturazione"
```

---

### Task 6: Label OPEX come costo pubblico netto (correzione A.2)

Esplicita, dove l'OPEX è mostrato, che si tratta del costo pubblico netto annuo (al netto di rette e contributi), per non esporre il fianco in demo.

**Files:**
- Modify: `app/src/poc/pages/DocfapDetail.tsx:311-314` (riga "OPEX" nelle card opzioni)

**Interfaces:**
- Consumes/Produces: nessuna.

- [ ] **Step 1: Aggiungere il tooltip esplicativo alla riga OPEX**

In `app/src/poc/pages/DocfapDetail.tsx`, nella card opzione, la riga OPEX (righe ~311-314) attualmente è:

```tsx
                    <div className="flex justify-between gap-2">
                      <dt className="text-ink-400">OPEX</dt>
                      <dd className="font-mono text-ink-700">{alt?.opex != null ? `€ ${formatEuro(alt.opex)}` : '—'}</dd>
                    </div>
```

Sostituirla con (aggiunge `title` esplicativo su `dt` e la dicitura "/anno netto"):

```tsx
                    <div className="flex justify-between gap-2">
                      <dt className="text-ink-400" title="Costo pubblico netto annuo, al netto di rette famiglie e contributi regionali">OPEX netto</dt>
                      <dd className="font-mono text-ink-700">{alt?.opex != null ? `€ ${formatEuro(alt.opex)}/anno` : '—'}</dd>
                    </div>
```

- [ ] **Step 2: Verificare la build**

Run: `npm run build`
Expected: build senza errori.

- [ ] **Step 3: Verifica manuale a schermo**

Nel dettaglio DOCFAP, le card opzioni mostrano "OPEX netto" con importo "/anno" e, al passaggio del mouse sull'etichetta, il tooltip "Costo pubblico netto annuo, al netto di rette famiglie e contributi regionali".

- [ ] **Step 4: Commit**

```bash
git add app/src/poc/pages/DocfapDetail.tsx
git commit -m "fix(docfap): esplicita OPEX come costo pubblico netto annuo"
```

---

### Task 7: Capitolo di strategia — wizard DOCFAP «a ritroso» (solo documento)

Espande la §5 dello spec in un capitolo di strategia completo (nessun codice), come richiesto dal desiderata 3.

**Files:**
- Create: `docs/superpowers/specs/2026-07-21-docfap-wizard-a-ritroso-strategia.md`

**Interfaces:**
- Consumes/Produces: nessuna (documento).

- [ ] **Step 1: Scrivere il documento di strategia**

Creare `docs/superpowers/specs/2026-07-21-docfap-wizard-a-ritroso-strategia.md` con i seguenti contenuti (compilare ciascuna sezione con il ragionamento; la struttura e i dati di partenza sono qui sotto):

1. **Problema.** `Step7` del wizard → `runFullAnalysis()` → `runPOCAnalysis()` non riceve input e restituisce sempre lo scenario cablato (A1/A2/A3 asilo nido). Output invariante rispetto agli input.
2. **Output noto-buono da riprodurre.** Per ogni alternativa: CAPEX, OPEX, posti/beneficiari, valore residuo; beneficio annuo = `posti × Σ KPI(categoria)` = €10.220/posto (5 KPI NID); impatto EIA = `CAPEX × moltiplicatori(settore)`; VANE/BCR/TIRE = funzione(CAPEX, OPEX, beneficio annuo, orizzonte, tasso, residuo).
3. **Mappa inversa step → input → grandezza di output.** Tabella: per ciascuna fase del wizard (`fase1` ente/intervento, `fase2` problema/target, `fase3` alternative+costi, `fase4` MCA, `fase5` rischi), indicare quale input alimenta quale grandezza e quali dati sono derivabili/costanti (fattori di monetizzazione bloccati vs dati territoriali confermabili).
4. **Dove il motore Ricadute può sostituire il cablato.** `buildBeneficiKpi` (beneficio da posti+categoria), `computeEcba`, `computeEia` sono già la fonte dei numeri: valutare un motore condiviso tra i due moduli, o un adattatore che, dagli input del wizard, chiami questi motori per alternativa.
5. **Percorso di migrazione.** Approccio 1 (prefill curato, demo-safe, rischio nullo) → Approccio 2 (input wizard ricollegati al motore KPI, qualsiasi input dà output coerenti), con punti di decisione (dove vive il calcolo condiviso, gestione di N alternative, forma dati condivisa) e rischi.
6. **Non-obiettivi e stima.** Cosa resta fuori; stima di massima per Approccio 2.

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-07-21-docfap-wizard-a-ritroso-strategia.md
git commit -m "docs(docfap): strategia wizard a ritroso (desiderata 3)"
```

---

## Note di esecuzione

- **Bump cache localStorage:** lo stato progetti è già a `civiqa.projects.v8` e i seed nido sono già presenti; questi task **non cambiano la forma dei seed**, quindi non serve un nuovo bump. Se durante la verifica un utente vede dati vecchi in cache, svuotare il localStorage (chiave `civiqa.projects.v8`) o usare una finestra pulita.
- **Import ciclico:** `projectState.js` non importa i registri dataset, quindi `ecbaDatasets`/`eiaDatasets` → `projectState` è a senso unico. Se una futura modifica introducesse un ciclo, degradare a import dinamico (`await import`) dentro i getter.
