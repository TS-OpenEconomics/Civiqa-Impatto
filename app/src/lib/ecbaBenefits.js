// ─────────────────────────────────────────────────────────────────────────────
// Catalogo delle categorie di BENEFICI ECONOMICI per l'Analisi Costi-Benefici.
//
// Nella CBA i "benefici" sono esternalità e outcome monetizzati (risparmio
// ambientale, gettito, benefici sociali, risparmio di tempo, valore residuo…),
// NON le componenti macro dell'analisi di impatto (GVA / gettito / redditi EIA).
//
// Il modello segue lo stile di app/src/poc/data/cba/kpiCatalog.ts:
//   categoria → sotto-componenti → valore annuo.
//
// I valori di default sono parametrizzati sul CAPEX del progetto: dato
// esemplificativo ma coerente (mai vuoto), sostituibile in futuro con input
// reali di esternalità senza toccare la UI o l'engine.
// ─────────────────────────────────────────────────────────────────────────────

// Quote dei benefici annui ricorrenti espresse in frazione del CAPEX/anno.
// La somma delle quote (≈ 0,15) definisce il flusso di benefici annuo del progetto.
const DEFAULT_TEMPLATE = [
  {
    id: "ambientale",
    nome: "Risparmio ambientale",
    descrizione:
      "Benefici ambientali monetizzati generati dall'intervento: minori emissioni, miglior gestione delle risorse e riduzione dei danni ecologici evitati.",
    comeMisura:
      "Le emissioni di CO₂ sono valorizzate al costo sociale del carbonio; gli altri benefici ambientali tramite costi evitati e disponibilità a pagare (DAP).",
    colore: "#65A30D",
    quotaCapexAnnua: 0.060,
    sottocomponenti: [
      { label: "Riduzione emissioni di CO₂", quota: 0.45 },
      { label: "Miglior qualità ambientale / risorse", quota: 0.35 },
      { label: "Danni ecologici evitati", quota: 0.20 },
    ],
  },
  {
    id: "fiscale",
    nome: "Maggior gettito e tariffe",
    descrizione:
      "Entrate pubbliche aggiuntive attivate dall'intervento: maggiore gettito tariffario, riduzione dell'evasione e nuovi contribuenti.",
    comeMisura:
      "Stimato sulle entrate incrementali nette al netto del deadweight (quota che si sarebbe comunque verificata).",
    colore: "#7C3AED",
    quotaCapexAnnua: 0.035,
    sottocomponenti: [
      { label: "Maggiori introiti tariffari", quota: 0.55 },
      { label: "Riduzione dell'evasione", quota: 0.30 },
      { label: "Nuovi contribuenti / utenti paganti", quota: 0.15 },
    ],
  },
  {
    id: "sociale",
    nome: "Benefici sociali e benessere",
    descrizione:
      "Effetti diffusi sul benessere della collettività: miglioramento della salute e della qualità della vita, coesione sociale e sicurezza percepita.",
    comeMisura:
      "Monetizzati tramite proxy riconosciute dalla letteratura (valore del benessere, costi sanitari evitati, partecipazione sociale).",
    colore: "#A78BFA",
    quotaCapexAnnua: 0.030,
    sottocomponenti: [
      { label: "Benessere e salute pubblica", quota: 0.50 },
      { label: "Coesione e partecipazione sociale", quota: 0.30 },
      { label: "Sicurezza e qualità urbana", quota: 0.20 },
    ],
  },
  {
    id: "tempo",
    nome: "Risparmio di tempo e accessibilità",
    descrizione:
      "Tempo risparmiato dagli utenti e migliore accessibilità ai servizi resi possibili dall'intervento.",
    comeMisura:
      "Valorizzato applicando il valore unitario del tempo (€/persona·h) alle ore risparmiate stimate.",
    colore: "#0EA5E9",
    quotaCapexAnnua: 0.025,
    sottocomponenti: [
      { label: "Tempo risparmiato dagli utenti", quota: 0.70 },
      { label: "Migliore accessibilità ai servizi", quota: 0.30 },
    ],
  },
];

/**
 * Costruisce le categorie di benefici economici con i relativi VALORI ANNUI.
 * @param {object} opts
 * @param {number} opts.capex   CAPEX di progetto (€)
 * @returns {Array<{id,nome,descrizione,comeMisura,colore,valore_annuo,sottocomponenti:Array<{label,valore_annuo}>}>}
 */
export function buildBeneficiCategorie({ capex = 0 } = {}) {
  // Base annua: se manca il CAPEX si usa una base nominale per non avere zeri.
  const base = capex && capex > 0 ? capex : 5_000_000;

  return DEFAULT_TEMPLATE.map((cat) => {
    const valoreAnnuo = Math.round(base * cat.quotaCapexAnnua);
    return {
      id: cat.id,
      nome: cat.nome,
      descrizione: cat.descrizione,
      comeMisura: cat.comeMisura,
      colore: cat.colore,
      valore_annuo: valoreAnnuo,
      sottocomponenti: cat.sottocomponenti.map((s) => ({
        label: s.label,
        valore_annuo: Math.round(valoreAnnuo * s.quota),
      })),
    };
  });
}

/** Colore dedicato al valore residuo (one-off a fine orizzonte). */
export const COLORE_VALORE_RESIDUO = "#F59E0B";
