// ── Sector detection ───────────────────────────────────────────────────────

export function detectSectorType(settore) {
  if (!settore) return "generic";
  const s = settore.toLowerCase();
  if (s.includes("idri") || s.includes("ambientali")) return "idrico";
  if (s.includes("trasport")) return "trasporti";
  if (s.includes("sociali")) return "sociale";
  if (s.includes("energia") || s.includes("telec") || s.includes("inform")) return "energia";
  return "generic";
}

// ── Sector weights ─────────────────────────────────────────────────────────

const SECTOR_WEIGHTS = {
  idrico:    { E: 0.45, S: 0.30, G: 0.25 },
  trasporti: { E: 0.30, S: 0.45, G: 0.25 },
  sociale:   { E: 0.20, S: 0.55, G: 0.25 },
  energia:   { E: 0.40, S: 0.30, G: 0.30 },
  generic:   { E: 0.35, S: 0.35, G: 0.30 },
};

// ── Benchmark mock per sector ──────────────────────────────────────────────

const BENCHMARK = {
  idrico:    { score: 71, label: "media progetti idrici Italia" },
  trasporti: { score: 65, label: "media progetti trasporti Italia" },
  sociale:   { score: 73, label: "media infrastrutture sociali Italia" },
  energia:   { score: 68, label: "media progetti energia/ICT Italia" },
  generic:   { score: 67, label: "media progetti infrastrutturali Italia" },
};

// ── Individual question scorers (0–100) ────────────────────────────────────

function sc_soil_pct(v) {
  const n = Number(v ?? 50);
  return n < 10 ? 100 : n < 25 ? 75 : n < 50 ? 45 : 15;
}
function sc_impact(v) {
  const arr = v || [];
  if (arr.includes("Nessuno degli impatti indicati")) return 5;
  return Math.min(100, arr.length * 28);
}
function sc_yesno_pos(v) { return v === "Si" ? 100 : 20; } // positive: Si is good
function sc_yesno_neg(v) { return v === "No" ? 100 : 50; } // negative: No is good
function sc_water_loss(v) {
  const n = Number(v ?? 20);
  return n < 5 ? 100 : n < 15 ? 70 : n < 25 ? 40 : 15;
}
function sc_renewable_share(v) {
  const n = Number(v ?? 0);
  return n >= 75 ? 100 : n >= 50 ? 80 : n >= 25 ? 60 : n > 0 ? 35 : 10;
}
function sc_users(v) {
  const n = Number(v ?? 0);
  return n >= 100_000 ? 100 : n >= 50_000 ? 90 : n >= 10_000 ? 78 : n >= 1_000 ? 60 : 30;
}
function sc_fte(v) {
  const n = Number(v ?? 0);
  return n >= 1000 ? 100 : n >= 500 ? 88 : n >= 100 ? 72 : n >= 10 ? 55 : 30;
}
function sc_water_access(v) {
  const n = Number(v ?? 0);
  return n >= 80 ? 100 : n >= 60 ? 80 : n >= 40 ? 60 : n >= 20 ? 40 : 20;
}

// ── Section scorers ────────────────────────────────────────────────────────

function scoreEnvironmental(answers, sectorType) {
  const scores = [
    sc_soil_pct(answers.soil_pct),
    sc_impact(answers.impact),
    sc_yesno_pos(answers.energy_efficiency),
    sc_yesno_pos(answers.carbon_reduction),
    sc_yesno_pos(answers.lifecycle_assessment),
  ];
  if (sectorType === "idrico") scores.push(sc_water_loss(answers.water_loss));
  if (sectorType === "energia") scores.push(sc_renewable_share(answers.renewable_share));
  if (sectorType === "trasporti") scores.push(sc_yesno_pos(answers.emission_reduction));
  return Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
}

function scoreSocial(answers, sectorType, ftaEia) {
  const fteVal = answers.fte_generated !== undefined ? answers.fte_generated : (ftaEia ?? 0);
  const scores = [
    sc_users(answers.users),
    sc_yesno_pos(answers.services),
    sc_yesno_pos(answers.employment),
    sc_fte(fteVal),
    sc_yesno_pos(answers.gender_equity),
  ];
  if (sectorType === "idrico") scores.push(sc_water_access(answers.water_access));
  if (sectorType === "trasporti") scores.push(sc_yesno_pos(answers.accidents_reduction));
  if (sectorType === "sociale") scores.push(sc_yesno_pos(answers.vulnerable_groups));
  return Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
}

function scoreGovernance(answers) {
  const scores = [
    sc_yesno_neg(answers.sensitive_area),
    sc_yesno_pos(answers.monitoring),
    sc_yesno_pos(answers.documents),
    sc_yesno_pos(answers.stakeholder_consult),
    sc_yesno_pos(answers.transparency),
  ];
  return Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
}

// ── Label from score ────────────────────────────────────────────────────────

export function scoreLabel(score) {
  if (score >= 85) return "Eccellente";
  if (score >= 70) return "Buono";
  if (score >= 55) return "Sufficiente";
  if (score >= 40) return "Parziale";
  return "Insufficiente";
}

function levelFromScore(score) {
  if (score >= 70) return "allineato";
  if (score >= 45) return "parziale";
  return "non";
}

// ── Criteria items ──────────────────────────────────────────────────────────

function buildEItems(answers, sectorType) {
  const items = [
    { criterio: "Consumo di suolo", risposta: `${answers.soil_pct ?? "—"}%`, score: sc_soil_pct(answers.soil_pct) },
    { criterio: "Riduzione impatti ambientali", risposta: (answers.impact || []).filter(x => !x.startsWith("Nessuno")).join(", ") || "Nessuno dichiarato", score: sc_impact(answers.impact) },
    { criterio: "Efficienza energetica", risposta: answers.energy_efficiency ?? "—", score: sc_yesno_pos(answers.energy_efficiency) },
    { criterio: "Riduzione emissioni CO₂", risposta: answers.carbon_reduction ?? "—", score: sc_yesno_pos(answers.carbon_reduction) },
    { criterio: "Valutazione ciclo di vita (LCA)", risposta: answers.lifecycle_assessment ?? "—", score: sc_yesno_pos(answers.lifecycle_assessment) },
  ];
  if (sectorType === "idrico") items.push({ criterio: "Perdite rete idrica", risposta: `${answers.water_loss ?? "—"}%`, score: sc_water_loss(answers.water_loss) });
  if (sectorType === "energia") items.push({ criterio: "Quota energia rinnovabile", risposta: `${answers.renewable_share ?? "—"}%`, score: sc_renewable_share(answers.renewable_share) });
  if (sectorType === "trasporti") items.push({ criterio: "Riduzione emissioni veicoli", risposta: answers.emission_reduction ?? "—", score: sc_yesno_pos(answers.emission_reduction) });
  const weight = Math.round(100 / items.length);
  return items.map(it => ({ ...it, section: "E", peso: weight, livello: levelFromScore(it.score) }));
}

function buildSItems(answers, sectorType, fteEia) {
  const fteVal = answers.fte_generated !== undefined ? answers.fte_generated : (fteEia ?? 0);
  const items = [
    { criterio: "Beneficiari attesi", risposta: `${new Intl.NumberFormat("it-IT").format(Number(answers.users ?? 0))} persone`, score: sc_users(answers.users) },
    { criterio: "Miglioramento servizi comunità", risposta: answers.services ?? "—", score: sc_yesno_pos(answers.services) },
    { criterio: "Effetti sull'occupazione locale", risposta: answers.employment ?? "—", score: sc_yesno_pos(answers.employment) },
    { criterio: "FTE generati", risposta: `${Math.round(Number(fteVal))} FTE`, score: sc_fte(fteVal) },
    { criterio: "Equità di genere e inclusione", risposta: answers.gender_equity ?? "—", score: sc_yesno_pos(answers.gender_equity) },
  ];
  if (sectorType === "idrico") items.push({ criterio: "Accesso migliorato al servizio", risposta: `${answers.water_access ?? "—"}%`, score: sc_water_access(answers.water_access) });
  if (sectorType === "trasporti") items.push({ criterio: "Riduzione incidenti stradali", risposta: answers.accidents_reduction ?? "—", score: sc_yesno_pos(answers.accidents_reduction) });
  if (sectorType === "sociale") items.push({ criterio: "Raggiungimento gruppi vulnerabili", risposta: answers.vulnerable_groups ?? "—", score: sc_yesno_pos(answers.vulnerable_groups) });
  const weight = Math.round(100 / items.length);
  return items.map(it => ({ ...it, section: "S", peso: weight, livello: levelFromScore(it.score) }));
}

function buildGItems(answers) {
  const items = [
    { criterio: "Aree naturali sensibili", risposta: answers.sensitive_area ?? "—", score: sc_yesno_neg(answers.sensitive_area) },
    { criterio: "Sistema di monitoraggio", risposta: answers.monitoring ?? "—", score: sc_yesno_pos(answers.monitoring) },
    { criterio: "Documentazione ESG disponibile", risposta: answers.documents ?? "—", score: sc_yesno_pos(answers.documents) },
    { criterio: "Consultazione stakeholder", risposta: answers.stakeholder_consult ?? "—", score: sc_yesno_pos(answers.stakeholder_consult) },
    { criterio: "Report periodici pubblici", risposta: answers.transparency ?? "—", score: sc_yesno_pos(answers.transparency) },
  ];
  const weight = 20;
  return items.map(it => ({ ...it, section: "G", peso: weight, livello: levelFromScore(it.score) }));
}

// ── SDG alignment ───────────────────────────────────────────────────────────

function computeSDGAlignment(answers, sectorType) {
  const aligned = new Set();
  if (Number(answers.users ?? 0) > 1000) aligned.add(3);
  if (answers.services === "Si") { aligned.add(3); aligned.add(11); }
  if (answers.employment === "Si") aligned.add(8);
  if (Number(answers.fte_generated ?? 0) > 10) { aligned.add(8); aligned.add(1); }
  if (answers.gender_equity === "Si") aligned.add(5);
  if ((answers.impact || []).filter(x => !x.startsWith("Nessuno")).length > 0) aligned.add(13);
  if (answers.energy_efficiency === "Si") { aligned.add(7); aligned.add(13); }
  if (answers.carbon_reduction === "Si") aligned.add(13);
  if (answers.lifecycle_assessment === "Si") { aligned.add(12); aligned.add(13); }
  if (answers.monitoring === "Si") aligned.add(16);
  if (answers.stakeholder_consult === "Si") aligned.add(17);
  if (answers.transparency === "Si") { aligned.add(16); aligned.add(17); }
  if (answers.documents === "Si") aligned.add(16);
  if (sectorType === "idrico") {
    aligned.add(6); aligned.add(3);
    if (sc_water_loss(answers.water_loss) > 60) { aligned.add(14); aligned.add(15); }
  }
  if (sectorType === "energia") {
    aligned.add(7); aligned.add(13);
    if (answers.renewable_share > 25) aligned.add(9);
  }
  if (sectorType === "trasporti") {
    aligned.add(9); aligned.add(11);
    if (answers.accidents_reduction === "Si") aligned.add(3);
  }
  if (sectorType === "sociale") {
    aligned.add(4); aligned.add(3); aligned.add(10);
    if (answers.vulnerable_groups === "Si") { aligned.add(1); aligned.add(10); }
  }
  if (Number(answers.soil_pct ?? 100) < 20) { aligned.add(15); }
  return Array.from(aligned).sort((a, b) => a - b);
}

// ── Main export ─────────────────────────────────────────────────────────────

export function computeEsg(answers, settore, eiaResults) {
  const sectorType = detectSectorType(settore);
  const weights = SECTOR_WEIGHTS[sectorType] ?? SECTOR_WEIGHTS.generic;
  const fteEia = eiaResults?.fte?.totale ?? 0;

  const scoreE = scoreEnvironmental(answers, sectorType);
  const scoreS = scoreSocial(answers, sectorType, fteEia);
  const scoreG = scoreGovernance(answers);

  const globale = Math.round(scoreE * weights.E + scoreS * weights.S + scoreG * weights.G);
  const benchmark = BENCHMARK[sectorType] ?? BENCHMARK.generic;
  const sdgAligned = computeSDGAlignment(answers, sectorType);

  return {
    globale,
    E: { score: scoreE, label: scoreLabel(scoreE) },
    S: { score: scoreS, label: scoreLabel(scoreS) },
    G: { score: scoreG, label: scoreLabel(scoreG) },
    weights,
    sdgAligned,
    benchmark,
    itemsE: buildEItems(answers, sectorType),
    itemsS: buildSItems(answers, sectorType, fteEia),
    itemsG: buildGItems(answers),
    meta: { settore, sectorType },
  };
}
