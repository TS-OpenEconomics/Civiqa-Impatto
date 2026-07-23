// ─────────────────────────────────────────────────────────────────────────────
// Motore dei BENEFICI CBA guidato dai KPI (Civiqa OpenCore).
//
// Pipeline reale:
//   categoria d'intervento (Layer 3, intervention_categories_layer3.ts)
//     → kpi_links[]  (i pochi KPI specifici della categoria, tipici 2–6)
//       → KPI_BENEFITS (Layer 2, kpi_benefits_layer2.ts): formula + variabili
//         → risoluzione variabili → valutazione formula → beneficio annuo
//           → una VOCE di beneficio per KPI (niente rollup: i KPI sono già pochi)
//
// Risoluzione dei valori delle variabili (POC / Colleferro):
//   - input_params / statistics  → `valore_tipo`  (dato territoriale, EDITABILE)
//   - fixed_params / monetization_factors → `val_check` (costante, BLOCCATO)
// Un override esterno (per code o per var_name) ha sempre la precedenza.
//
// Il risultato ha la STESSA forma di buildBeneficiCategorie (ecbaBenefits.js),
// così computeEcba e tutti i consumer a valle restano invariati. Se la categoria
// non è risolvibile, l'engine ricade sul placeholder esistente (nessuna rottura).
// ─────────────────────────────────────────────────────────────────────────────

import { KPI_BENEFITS } from "../../poc/data/poc_docfap/kpi_benefits_layer2";
import { INTERVENTION_CATEGORIES } from "../../poc/data/poc_docfap/intervention_categories_layer3";
import { INPUT_PARAMS_REGISTRY } from "../../poc/data/poc_docfap/input_params_registry";

// Tabelle (var.table) i cui valori sono costanti e NON modificabili dall'utente:
// i fattori di monetizzazione e i parametri fissi. Le IP/STAT sono invece dati
// territoriali che l'utente conferma o corregge.
const LOCKED_TABLES = new Set(["fixed_params", "monetization_factors"]);

// Categoria del parametro (per la UI del wizard) in funzione della tabella:
// input_params = Input da inserire · statistics = Statistica nazionale (entrambi
// editabili) · fixed_params = Input calcolato · monetization_factors = Monetizzazione
// (entrambi bloccati).
const TIPO_BY_TABLE = {
  input_params: "input",
  statistics: "statistica",
  fixed_params: "calcolato",
  monetization_factors: "monetizzazione",
};

// Palette ciclica per le voci di beneficio (coerente con ecbaBenefits.js).
const BENEFIT_PALETTE = [
  "#65A30D", "#7C3AED", "#0EA5E9", "#A78BFA", "#F59E0B",
  "#0D9488", "#DB2777", "#2563EB", "#84CC16", "#9333EA",
];
const COLORE_DISBENEFICIO = "#DC2626"; // esternalità negative

// ── Indici lazy (costruiti una sola volta) ──────────────────────────────────
let _kpiById = null;
let _catByCode = null;
let _codeByLabel = null;
let _udmByCode = null;

function buildIndexes() {
  if (_kpiById) return;
  _kpiById = new Map();
  for (const k of KPI_BENEFITS) _kpiById.set(k.id, k);

  _catByCode = new Map();
  _codeByLabel = new Map();
  for (const c of INTERVENTION_CATEGORIES) {
    _catByCode.set(c.code, c);
    const key = normalizeLabel(c.label);
    if (key && !_codeByLabel.has(key)) _codeByLabel.set(key, c.code);
  }

  _udmByCode = new Map();
  for (const p of INPUT_PARAMS_REGISTRY) _udmByCode.set(p.code, p.udm);
}

/** Unità di misura di una variabile (dal registry IP, altrimenti vuota). */
function udmForVariable(v) {
  return (v.code && _udmByCode.get(v.code)) || "";
}

function normalizeLabel(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accenti
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Risolve il codice categoria Layer 3 (C0xx) da un codice esplicito o da una
 * label (configurazione.categoria_intervento). Ritorna null se non risolvibile.
 */
export function resolveCategoryCode({ catCode, categoriaInterventoLabel } = {}) {
  buildIndexes();
  if (catCode && _catByCode.has(catCode)) return catCode;
  if (categoriaInterventoLabel) {
    const code = _codeByLabel.get(normalizeLabel(categoriaInterventoLabel));
    if (code) return code;
  }
  return null;
}

export function getCategory(code) {
  buildIndexes();
  return _catByCode.get(code) ?? null;
}

export function getKpi(id) {
  buildIndexes();
  return _kpiById.get(id) ?? null;
}

// ── Risoluzione valore variabile + valutazione formula ──────────────────────

/** Valore di una variabile, con eventuale override (per code o per var_name). */
function resolveVarValue(v, overrides) {
  if (overrides) {
    if (v.code != null && overrides[v.code] != null) return Number(overrides[v.code]);
    if (overrides[v.var_name] != null) return Number(overrides[v.var_name]);
  }
  if (v.table === "input_params" || v.table === "statistics") {
    return v.valore_tipo ?? 0;
  }
  // fixed_params / monetization_factors
  return v.val_check ?? 0;
}

/** È un valore bloccato (fattore di monetizzazione / parametro fisso)? */
export function isLockedVariable(v) {
  return LOCKED_TABLES.has(v.table);
}

/**
 * Valuta una formula KPI (es. "A × B × C × (D + E)") risolvendo le lettere
 * A..G con i valori dell'ambiente. Parser ricorsivo discendente, sicuro
 * (nessun eval). Tollerante ai dati malformati: ritorna un numero finito.
 *
 * @param {string} formula
 * @param {Record<string,number>} env  mappa var_name → valore
 */
export function evaluateFormula(formula, env) {
  const src = String(formula || "").replace(/×/g, "*");
  let i = 0;

  const skip = () => { while (i < src.length && src[i] === " ") i++; };
  const peek = () => { skip(); return src[i]; };

  function parseExpr() {
    let v = parseTerm();
    for (;;) {
      const c = peek();
      if (c === "+") { i++; v += parseTerm(); }
      else if (c === "-") { i++; v -= parseTerm(); }
      else break;
    }
    return v;
  }
  function parseTerm() {
    let v = parseFactor();
    for (;;) {
      const c = peek();
      if (c === "*") { i++; v *= parseFactor(); }
      else if (c === "/") { i++; const d = parseFactor(); v = d !== 0 ? v / d : 0; }
      else break;
    }
    return v;
  }
  function parseFactor() {
    const c = peek();
    if (c === "-") { i++; return -parseFactor(); }
    if (c === "+") { i++; return parseFactor(); }
    if (c === "(") {
      i++;
      const v = parseExpr();
      if (peek() === ")") i++;
      return v;
    }
    return parseAtom();
  }
  function parseAtom() {
    const c = peek();
    if (c >= "A" && c <= "Z") { i++; return Number(env[c] ?? 0); }
    let num = "";
    while (i < src.length && /[0-9.]/.test(src[i])) num += src[i++];
    return num ? parseFloat(num) : 0;
  }

  const result = parseExpr();
  return Number.isFinite(result) ? result : 0;
}

/** Ambiente var_name → valore per un KPI. */
function buildEnv(variables, overrides) {
  const env = {};
  for (const v of variables) env[v.var_name] = resolveVarValue(v, overrides);
  return env;
}

/** Beneficio annuo (con segno) di un singolo KPI per uno specifico link L3. */
function evaluateKpiAnnual(kpi, link, overrides) {
  let annual = evaluateFormula(kpi.formula, buildEnv(kpi.variables, overrides));
  if (link && link.benefit_pct_override != null) annual *= link.benefit_pct_override;
  const sign = link && link.is_negative_externality ? -1 : 1;
  return sign * annual;
}

// ── API principali ──────────────────────────────────────────────────────────

/**
 * Voci di beneficio (una per KPI) per una categoria d'intervento.
 * Forma allineata a buildBeneficiCategorie: {id,nome,descrizione,comeMisura,
 * colore,valore_annuo,sottocomponenti}. Le esternalità negative compaiono come
 * voci con valore_annuo negativo (così la somma è già il beneficio netto).
 *
 * @returns {Array|null} null se la categoria non ha KPI risolvibili.
 */
export function buildBeneficiKpi({ catCode, categoriaInterventoLabel, overrides } = {}) {
  const code = resolveCategoryCode({ catCode, categoriaInterventoLabel });
  if (!code) return null;
  const cat = getCategory(code);
  if (!cat || !Array.isArray(cat.kpi_links) || cat.kpi_links.length === 0) return null;

  const voci = [];
  let colorIdx = 0;
  for (const link of cat.kpi_links) {
    const kpi = getKpi(link.kpi_id);
    if (!kpi || kpi.attivo === false) continue;

    const valoreAnnuo = Math.round(evaluateKpiAnnual(kpi, link, overrides));
    const negativa = !!link.is_negative_externality;
    voci.push({
      id: kpi.id,
      nome: kpi.label_utente || kpi.beneficio_label || kpi.id,
      descrizione: kpi.note || kpi.beneficio_label || "",
      comeMisura: buildComeMisura(kpi),
      colore: negativa ? COLORE_DISBENEFICIO : BENEFIT_PALETTE[colorIdx++ % BENEFIT_PALETTE.length],
      valore_annuo: valoreAnnuo,
      is_negative_externality: negativa,
      metodo: kpi.metodo_valorizzazione,
      categoria_beneficio: kpi.categoria_beneficio,
      sottocomponenti: [],
    });
  }

  return voci.length ? voci : null;
}

function buildComeMisura(kpi) {
  const metodo = kpi.metodo_valorizzazione ? `Metodo: ${kpi.metodo_valorizzazione}.` : "";
  const fonti = Array.isArray(kpi.fonti) && kpi.fonti.length
    ? ` Fonti: ${kpi.fonti.map((f) => f.label).join("; ")}.`
    : "";
  return `${metodo}${fonti}`.trim();
}

/**
 * Criteri KPI di una categoria, pensati per il WIZARD: ogni KPI con le sue
 * variabili separate in EDITABILI (dati territoriali IP/STAT) e BLOCCATE
 * (fattori di monetizzazione / parametri fissi). Include il beneficio annuo
 * ricalcolato con gli eventuali override correnti.
 */
export function getKpiCriteria({ catCode, categoriaInterventoLabel, overrides } = {}) {
  const code = resolveCategoryCode({ catCode, categoriaInterventoLabel });
  if (!code) return null;
  const cat = getCategory(code);
  if (!cat || !Array.isArray(cat.kpi_links) || cat.kpi_links.length === 0) return null;

  const criteri = [];
  for (const link of cat.kpi_links) {
    const kpi = getKpi(link.kpi_id);
    if (!kpi || kpi.attivo === false) continue;

    const variables = kpi.variables.map((v) => ({
      var_name: v.var_name,
      code: v.code,
      label: v.label_utente || v.description,
      table: v.table,
      udm: v.udm ?? null,
      value: resolveVarValue(v, overrides),
      locked: isLockedVariable(v),
    }));

    criteri.push({
      kpi_id: kpi.id,
      label: kpi.label_utente || kpi.beneficio_label || kpi.id,
      categoria_beneficio: kpi.categoria_beneficio,
      metodo: kpi.metodo_valorizzazione,
      formula: kpi.formula,
      fonti: kpi.fonti ?? [],
      note: kpi.note ?? "",
      is_negative_externality: !!link.is_negative_externality,
      valore_annuo: Math.round(evaluateKpiAnnual(kpi, link, overrides)),
      variables,
    });
  }

  return criteri.length ? criteri : null;
}

/**
 * Template KPI nella forma attesa dal wizard di valutazione (POC_KPI_TEMPLATE):
 * un gruppo per KPI della categoria, con le sue variabili come righe.
 *   - IP/STAT  → tipo "tecnico"        (dato territoriale, EDITABILE per anno/periodo)
 *   - FP/MF    → tipo "monetizzazione" (fattore BLOCCATO, sola lettura)
 * Gli `id` riga sono univoci ("<kpiId>__<var_name>"); i titoli sono testuali
 * (label_utente), MAI i codici. Ritorna null se la categoria non è risolvibile,
 * così il wizard può ricadere sul template mock.
 *
 * @returns {Array<{group,esternalita,kpis:Array<{id,label,unit,tipo,estimateFn}>}>|null}
 */
export function buildKpiTemplate({ catCode, categoriaInterventoLabel } = {}) {
  const code = resolveCategoryCode({ catCode, categoriaInterventoLabel });
  if (!code) return null;
  const cat = getCategory(code);
  if (!cat || !Array.isArray(cat.kpi_links) || cat.kpi_links.length === 0) return null;

  const groups = [];
  for (const link of cat.kpi_links) {
    const kpi = getKpi(link.kpi_id);
    if (!kpi || kpi.attivo === false) continue;

    const kpis = kpi.variables.map((v) => {
      const value = resolveVarValue(v, null);
      return {
        id: `${kpi.id}__${v.var_name}`,
        kpiId: kpi.id,
        varName: v.var_name,
        code: v.code,
        label: v.label_utente || v.description || v.var_name,
        unit: udmForVariable(v),
        // 4 categorie fedeli al file (deriva dalla tabella del parametro):
        //  input_params → Input da inserire (editabile) · statistics → Statistica
        //  nazionale (editabile) · fixed_params → Input calcolato (bloccato) ·
        //  monetization_factors → Monetizzazione (bloccato).
        tipo: TIPO_BY_TABLE[v.table] ?? (isLockedVariable(v) ? "monetizzazione" : "tecnico"),
        estimateFn: () => value,
      };
    });

    groups.push({
      group: kpi.label_utente || kpi.beneficio_label || kpi.id,
      kpiId: kpi.id,
      esternalita: link.is_negative_externality ? "negativa" : "positiva",
      formula: kpi.formula,
      metodo: kpi.metodo_valorizzazione,
      fonti: kpi.fonti ?? [],
      kpis,
    });
  }

  return groups.length ? groups : null;
}
