/* HoldingHandsCba — "In parole semplici" per l'Analisi Economica Costi-Benefici
 * Percorso narrato a tappe, a prova di idiota, sopra la sezione ECBA.
 * È un wrapper di sola presentazione: non ricalcola nulla, legge gli stessi
 * numeri della vista tecnica (ecbaData.js) e li racconta una schermata per volta.
 *
 * Vincoli metodologici rispettati nel copy (cfr. nota metodologica ECBA):
 *  - prezzi economici / "prezzi ombra": valuta il benessere sociale, NON il
 *    profitto finanziario dell'operatore.
 *  - tutti i flussi sono attualizzati al tasso di sconto sociale (3%).
 *  - i benefici includono esternalità monetizzate; tra i costi rientrano anche
 *    le esternalità negative.
 *  - l'esito è una stima a parità di altre condizioni, non un rendimento garantito.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ECBA_DATA } from "./ecbaData";

/* ─── Palette (allineata a EcbaResults / tailwind DS) ───────────────────────── */
const C = {
  violet: "#5B21F7",
  violetDark: "#2E0B86",
  violetLight: "#E8DEFC",
  violetSoft: "#F3EEFE",
  green: "#1F8C4A",
  greenSoft: "#E4F7EC",
  red: "#CC0000",
  redSoft: "#FCEBEB",
  lime: "#C7F03A",
  limeText: "#3A4D00",
  ink900: "#0E0E10",
  ink700: "#2B2B2E",
  ink500: "#5A5A60",
  ink400: "#7B7B82",
  ink200: "#D1D1D6",
  ink100: "#E5E5E8",
  white: "#FFFFFF",
};

/* ─── Numeri (sempre arrotondati, unità in chiaro) ─────────────────────────── */
function nf(n, dec = 0) {
  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(n);
}
// valore già in M€ → "12,4"
const mln = (v, dec = 1) => nf(v, dec);

/* ─── Motion helpers ───────────────────────────────────────────────────────── */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

function useCountUp(target, { duration = 950 } = {}) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);
  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    let raf;
    let start = null;
    const tick = (t) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);
  return value;
}

/* ─── Adattatore dati: ecbaData → payload narrativo ────────────────────────── */
function buildPayload(project) {
  const d = ECBA_DATA;
  const k = d.kpi;
  return {
    progetto: {
      nome: project?.nome || k.progetto,
      luogo: k.luogo,
      categoria: k.categoria,
      investimento: k.investimento,
      orizzonte: k.orizzonte,
      tasso: k.tasso,
    },
    benefici: d.waterfall.benefici,
    costiEconomici: d.waterfall.costi,
    esternalitaNeg: d.waterfall.esternalitaNeg,
    costiTotali: d.waterfall.costi + d.waterfall.esternalitaNeg,
    vane: d.waterfall.vane,
    tire: k.tire,
    bcr: k.bcr,
    paybackAnno: k.paybackAnno,
    composizione: d.donut,
    rischio: { ...d.riskSummary, simulations: d.simulationCount },
  };
}

/* ─── Le 5 fonti di beneficio (Atto 2) — copy distillato dalla nota metodologica ─ */
const BENEFIT_WHY = {
  "Partecipazione al lavoro e redditi":
    "Il servizio libera tempo (es. genitori che possono lavorare) e attiva redditi che prima non c'erano.",
  "Capitale umano / valore educativo":
    "Più istruzione e competenze oggi valgono di più domani: è un investimento sulle persone.",
  "Costi privati di cura evitati":
    "Spese che le famiglie non devono più sostenere privatamente: diventano un risparmio per la collettività.",
  "Valorizzazione immobiliare":
    "L'opera rende più attraente la zona: gli immobili e gli spazi attorno acquistano valore.",
  "Efficienza energetica / emissioni":
    "Meno consumi e meno emissioni: un risparmio ambientale che ha un valore economico.",
};

/* ─── Atti / progress ──────────────────────────────────────────────────────── */
const ACTS = [
  { key: "domanda", label: "La domanda" },
  { key: "benefici", label: "I benefici" },
  { key: "costi", label: "I costi" },
  { key: "verdetto", label: "Il verdetto" },
  { key: "tempo", label: "Nel tempo" },
  { key: "rischio", label: "Sicurezza" },
  { key: "fine", label: "Fine" },
];

/* ─── Icone (inline, leggere) ──────────────────────────────────────────────── */
function Icon({ name, size = 30 }) {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round",
  };
  switch (name) {
    case "domanda":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9.2 9.3a2.8 2.8 0 1 1 3.6 2.7c-.7.3-1 .8-1 1.5v.5" /><path d="M12 17h.01" /></svg>;
    case "benefici":
      return <svg {...common}><path d="M20 12v9H4v-9" /><path d="M2 7h20v5H2zM12 22V7" /><path d="M12 7S10 2 7.5 3.5 12 7 12 7zM12 7s2-5 4.5-3.5S12 7 12 7z" /></svg>;
    case "costi":
      return <svg {...common}><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" /><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>;
    case "verdetto":
      return <svg {...common}><path d="M12 3v18" /><path d="M5 21h14M6 7h12" /><path d="M6 7 3.5 12h5L6 7zM18 7l-2.5 5h5L18 7z" /></svg>;
    case "tempo":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case "rischio":
      return <svg {...common}><path d="M12 3l8 3v6c0 4.5-3.2 7.5-8 9-4.8-1.5-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></svg>;
    case "check":
      return <svg {...common} strokeWidth={2.4}><path d="M20 6 9 17l-5-5" /></svg>;
    default:
      return null;
  }
}

/* ─── Componenti di scena ──────────────────────────────────────────────────── */
function BigMln({ value, color = C.violet, sign = false }) {
  const v = useCountUp(value, { duration: 1000 });
  const s = sign && value > 0 ? "+" : "";
  return (
    <span style={{ ...S.bigNumber, color }}>
      {s}{mln(v)}
      <span style={S.bigUnit}> milioni di €</span>
    </span>
  );
}

function SceneDomanda({ p }) {
  return (
    <div style={S.sceneCenter}>
      <p style={S.kicker}>La domanda di fondo</p>
      <h2 style={S.h2}>
        Quest'opera <span style={{ color: C.violet }}>conviene alla collettività?</span>
      </h2>
      <div style={S.spesaBox}>
        <span style={S.spesaLabel}>Investimento di partenza</span>
        <span style={S.spesaValue}>circa {mln(p.progetto.investimento)} milioni di euro</span>
      </div>
      <p style={S.lead}>
        Stiamo valutando <strong>{p.progetto.nome}</strong> nella {p.progetto.luogo}. La domanda non è
        "rende soldi a chi lo gestisce?", ma <strong>"fa stare meglio la collettività?"</strong>
      </p>
      <p style={S.note}>
        <span style={S.noteBadge}>come</span> Mettiamo a confronto, tutto in euro, i <b>vantaggi</b> e i
        <b> costi</b> per la società lungo <b>{p.progetto.orizzonte} anni</b>, riportandoli a valore di
        oggi. Un viaggio di un minuto, senza una parola difficile.
      </p>
    </div>
  );
}

function SceneBeneficiBig({ p }) {
  return (
    <div style={S.sceneCenter}>
      <div style={{ ...S.metricIconWrap, background: C.greenSoft, color: C.green }}>
        <Icon name="benefici" size={40} />
      </div>
      <p style={S.kicker}>Prima i vantaggi</p>
      <div style={S.bigNumberWrap}><BigMln value={p.benefici} color={C.green} /></div>
      <h2 style={S.h2}>Tutto il bene che l'opera porta, tradotto in euro.</h2>
      <p style={S.lead}>
        Non solo i ricavi: anche i vantaggi che di solito non hanno un prezzo — tempo guadagnato,
        salute, ambiente, valore educativo — vengono <strong>stimati in euro</strong> per poterli
        confrontare con i costi.
      </p>
      <p style={S.note}>
        <span style={S.noteBadge}>prezzi ombra</span> Quando il mercato non dà un prezzo, lo si stima con
        metodi riconosciuti: così anche i benefici "invisibili" entrano nel conto.
      </p>
    </div>
  );
}

function SceneBeneficiBreak({ p }) {
  const max = Math.max(...p.composizione.map((c) => c.pct), 1);
  return (
    <div style={S.sceneWide}>
      <p style={{ ...S.kicker, textAlign: "center" }}>Da dove nascono</p>
      <h2 style={{ ...S.h2, textAlign: "center", marginInline: "auto" }}>
        Da cosa sono fatti i {mln(p.benefici)} milioni di benefici.
      </h2>
      <ul style={S.settoriList}>
        {p.composizione.map((c) => {
          const val = (p.benefici * c.pct) / 100;
          return (
            <li key={c.label} style={S.benefRow}>
              <div style={S.benefHead}>
                <span style={S.benefNome}>{c.label}</span>
                <span style={S.benefVal}>{mln(val)} M€</span>
              </div>
              <div style={S.settoreTrack}>
                <div style={{ ...S.settoreFill, width: `${Math.max(5, (c.pct / max) * 100)}%`, background: C.green }} />
              </div>
              <p style={S.benefWhy}>{BENEFIT_WHY[c.label] ?? ""}</p>
            </li>
          );
        })}
      </ul>
      <p style={{ ...S.note, textAlign: "center", marginInline: "auto" }}>
        Sono effetti <b>lordi</b>, stimati a parità di altre condizioni.
      </p>
    </div>
  );
}

function SceneCosti({ p }) {
  return (
    <div style={S.sceneCenter}>
      <div style={{ ...S.metricIconWrap, background: C.redSoft, color: C.red }}>
        <Icon name="costi" size={40} />
      </div>
      <p style={S.kicker}>Ora il conto dei costi</p>
      <div style={S.bigNumberWrap}><BigMln value={p.costiTotali} color={C.red} /></div>
      <h2 style={S.h2}>Quanto costa davvero alla collettività.</h2>
      <div style={S.costSplit}>
        <div style={S.costItem}>
          <span style={S.costItemVal}>{mln(p.costiEconomici)} M€</span>
          <span style={S.costItemLab}>Costruzione e gestione</span>
          <span style={S.costItemSub}>CAPEX dell'opera + spese di funzionamento (OPEX) lungo gli anni.</span>
        </div>
        <span style={S.costPlus}>+</span>
        <div style={S.costItem}>
          <span style={{ ...S.costItemVal, color: C.red }}>{mln(p.esternalitaNeg)} M€</span>
          <span style={S.costItemLab}>Esternalità negative</span>
          <span style={S.costItemSub}>Gli effetti indesiderati (disagi, emissioni di cantiere): contati anch'essi, in euro.</span>
        </div>
      </div>
      <p style={S.note}>
        <span style={S.noteBadge}>onesto</span> Un'analisi seria non nasconde i lati negativi: li mette
        sul piatto insieme ai benefici.
      </p>
    </div>
  );
}

function SceneVerdetto({ p }) {
  return (
    <div style={S.sceneCenter}>
      <p style={S.kicker}>Il verdetto</p>
      <div style={S.bridgeRow} aria-hidden="true">
        <span style={{ ...S.bridgeChip, background: C.greenSoft, color: C.green, borderColor: "#bfe6cd" }}>
          {mln(p.benefici)} <small>benefici</small>
        </span>
        <span style={S.bridgeOp}>−</span>
        <span style={{ ...S.bridgeChip, background: C.redSoft, color: C.red, borderColor: "#f1c9c9" }}>
          {mln(p.costiTotali)} <small>costi</small>
        </span>
        <span style={S.bridgeOp}>=</span>
        <span style={{ ...S.bridgeChip, background: C.violet, color: C.white, borderColor: C.violet }}>
          +{mln(p.vane)} <small style={{ color: "rgba(255,255,255,.85)" }}>netto</small>
        </span>
      </div>
      <div style={S.bigNumberWrap}><BigMln value={p.vane} color={C.green} sign /></div>
      <h2 style={S.h2}>
        Il saldo è <span style={{ color: C.green }}>positivo</span>: l'opera conviene alla collettività.
      </h2>
      <p style={S.lead}>
        Sull'intero orizzonte i benefici stimati <strong>superano</strong> i costi di{" "}
        <strong>{mln(p.vane)} milioni di euro</strong>. Questo saldo si chiama{" "}
        <strong>Valore Attuale Netto Economico</strong>.
      </p>
      <p style={S.note}>
        <span style={S.noteBadge}>nota</span> È una stima a parità di altre condizioni, a valore di oggi:
        non un rendimento finanziario garantito.
      </p>
    </div>
  );
}

function SceneIndicatori({ p }) {
  const tiles = [
    {
      val: `+${mln(p.vane)} M€`,
      lab: "Valore Attuale Netto Economico",
      sub: "Il beneficio netto per la collettività. Conviene se è sopra zero.",
      ok: p.vane > 0,
    },
    {
      val: `${nf(p.tire, 1)} %`,
      lab: "Rendimento sociale dell'opera",
      sub: `Il "tasso di interesse" sociale del progetto. Conviene se supera il ${nf(p.progetto.tasso, 0)}%.`,
      ok: p.tire > p.progetto.tasso,
    },
    {
      val: `${nf(p.bcr, 2)} €`,
      lab: "Beneficio per ogni euro speso",
      sub: "Quanti euro di beneficio genera ogni euro di costo. Conviene se è sopra 1.",
      ok: p.bcr > 1,
    },
  ];
  return (
    <div style={S.sceneCenter}>
      <p style={S.kicker}>Tre modi di dirlo, stessa risposta</p>
      <h2 style={S.h2}>I tre indicatori sono concordi.</h2>
      <div style={S.indGrid}>
        {tiles.map((t) => (
          <div key={t.lab} style={S.indTile}>
            <span style={{ ...S.indVal, color: t.ok ? C.green : C.red }}>{t.val}</span>
            <span style={S.indLab}>{t.lab}</span>
            <span style={S.indSub}>{t.sub}</span>
            <span style={{ ...S.indBadge, color: t.ok ? C.green : C.red, background: t.ok ? C.greenSoft : C.redSoft }}>
              {t.ok ? "✓ favorevole" : "✗ sfavorevole"}
            </span>
          </div>
        ))}
      </div>
      <p style={S.note}>
        Quando tutti e tre puntano nella stessa direzione, il giudizio è <b>solido</b>.
      </p>
    </div>
  );
}

function ScenePayback({ p }) {
  const pct = Math.round((p.paybackAnno / p.progetto.orizzonte) * 100);
  return (
    <div style={S.sceneCenter}>
      <div style={{ ...S.metricIconWrap, background: C.violetSoft, color: C.violet }}>
        <Icon name="tempo" size={40} />
      </div>
      <p style={S.kicker}>Nel tempo</p>
      <h2 style={S.h2}>
        L'opera si ripaga intorno all'<span style={{ color: C.violet }}>anno {p.paybackAnno}</span>.
      </h2>
      <p style={S.lead}>
        All'inizio si <strong>spende</strong> (cantiere e avvio): il bilancio è in rosso. Poi i benefici
        annuali superano i costi e il saldo cumulato risale, fino a tornare <strong>positivo</strong>.
      </p>
      <div style={S.timeline} aria-hidden="true">
        <div style={S.timelineTrack}>
          <div style={{ ...S.timelineRed, width: `${pct}%` }} />
          <div style={{ ...S.timelineGreen, left: `${pct}%`, width: `${100 - pct}%` }} />
          <div style={{ ...S.timelineMarker, left: `${pct}%` }} />
        </div>
        <div style={S.timelineLabels}>
          <span>Anno 0 · investimento</span>
          <span style={{ color: C.violet, fontWeight: 800 }}>payback · anno {p.paybackAnno}</span>
          <span>Anno {p.progetto.orizzonte}</span>
        </div>
      </div>
      <p style={S.note}>
        È il <b>payback sociale</b>: il momento in cui l'opera ha restituito alla collettività quanto è
        costata. Da lì in poi è tutto guadagno di benessere.
      </p>
    </div>
  );
}

function SceneRischio({ p }) {
  const pct = Math.round(p.rischio.probPositive * 100);
  const v = Math.round(useCountUp(pct, { duration: 1000 }));
  const simulationsLabel = new Intl.NumberFormat("it-IT").format(p.rischio.simulations ?? 1000);
  return (
    <div style={S.sceneCenter}>
      <div style={{ ...S.metricIconWrap, background: C.greenSoft, color: C.green }}>
        <Icon name="rischio" size={40} />
      </div>
      <p style={S.kicker}>E se le cose vanno diversamente?</p>
      <div style={S.bigNumberWrap}>
        <span style={{ ...S.bigNumber, color: C.green }}>{v}<span style={S.bigUnit}> %</span></span>
      </div>
      <h2 style={S.h2}>Resta conveniente nella larga maggioranza degli scenari.</h2>
      <p style={S.lead}>
        Abbiamo simulato <strong>{simulationsLabel} scenari</strong> cambiando le ipotesi (costi, domanda,
        parametri): nel <strong>{pct}%</strong> dei casi il risultato resta positivo.
      </p>
      <div style={S.riskBar}>
        <div style={{ ...S.riskBarFill, width: `${pct}%` }} />
      </div>
      <p style={S.note}>
        <span style={S.noteBadge}>da tenere d'occhio</span> La variabile più critica sono i{" "}
        <b>{p.rischio.criticalVar.toLowerCase()}</b>. Anche nello scenario sfavorevole il saldo difficilmente
        scende sotto <b>{mln(p.rischio.p5)} M€</b>; in quello favorevole sale fino a{" "}
        <b>+{mln(p.rischio.p95)} M€</b>.
      </p>
    </div>
  );
}

function SceneFine({ p, onGoToDetails, onClose, onRestart, onOpenMethodology }) {
  return (
    <div style={S.sceneCenter}>
      <div style={S.coinPulse} aria-hidden="true"><Icon name="check" size={34} /></div>
      <h2 style={S.h2}>Ora hai il quadro.</h2>
      <p style={S.lead}>
        <strong>{p.progetto.nome}</strong> genera <strong>+{mln(p.vane)} milioni di euro</strong> di
        beneficio netto per la collettività, si ripaga intorno all'anno {p.paybackAnno} e resta
        conveniente in oltre il {Math.round(p.rischio.probPositive * 100)}% degli scenari. Se vuoi i numeri
        di dettaglio, i grafici e la metodologia, l'analisi completa è qui sotto.
      </p>
      <div style={S.fineActions}>
        <button type="button" style={S.btnPrimary} onClick={onGoToDetails}>
          Vedi l'analisi completa
        </button>
        <button type="button" style={S.btnGhost} onClick={onClose}>
          Ho capito, grazie
        </button>
      </div>
      <div style={S.fineLinks}>
        <button type="button" style={S.linkBtn} onClick={onRestart}>↺ Rivedi da capo</button>
        {onOpenMethodology && (
          <button type="button" style={S.linkBtn} onClick={onOpenMethodology}>
            Come è stata costruita questa analisi?
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Overlay principale ───────────────────────────────────────────────────── */
export function HoldingHandsCba({ open, onClose, project, onGoToDetails, onOpenMethodology }) {
  const payload = useMemo(() => buildPayload(project), [project]);

  const scenes = useMemo(() => [
    { act: "domanda", render: () => <SceneDomanda p={payload} /> },
    { act: "benefici", render: () => <SceneBeneficiBig p={payload} /> },
    { act: "benefici", render: () => <SceneBeneficiBreak p={payload} /> },
    { act: "costi", render: () => <SceneCosti p={payload} /> },
    { act: "verdetto", render: () => <SceneVerdetto p={payload} /> },
    { act: "verdetto", render: () => <SceneIndicatori p={payload} /> },
    { act: "tempo", render: () => <ScenePayback p={payload} /> },
    { act: "rischio", render: () => <SceneRischio p={payload} /> },
    { act: "fine", render: (h) => <SceneFine p={payload} {...h} /> },
  ], [payload]);

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const reduced = useReducedMotion();
  const overlayRef = useRef(null);

  const sceneCount = scenes.length;
  const goTo = useCallback(
    (next, direction) => {
      setDir(direction ?? (next > index ? 1 : -1));
      setIndex(Math.max(0, Math.min(sceneCount - 1, next)));
    },
    [index, sceneCount],
  );
  const next = useCallback(() => goTo(index + 1, 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1, -1), [index, goTo]);
  const restart = useCallback(() => goTo(0, -1), [goTo]);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
    setDir(1);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlayRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, next, prev, onClose]);

  if (!open) return null;

  const currentAct = scenes[index].act;
  const currentActIdx = ACTS.findIndex((a) => a.key === currentAct);
  const isLast = index === scenes.length - 1;
  const isFirst = index === 0;

  const sceneAnim = reduced
    ? undefined
    : `${dir >= 0 ? "hhc-in-right" : "hhc-in-left"} 380ms cubic-bezier(.22,.61,.36,1) both`;

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="In parole semplici — guida all'analisi costi-benefici"
      tabIndex={-1}
      style={S.overlay}
    >
      <style>{KEYFRAMES}</style>

      <header style={S.topbar}>
        <span style={S.brand}>
          Analisi Costi-Benefici · <strong style={{ color: C.violet }}>In parole semplici</strong>
        </span>
        <div style={S.topActions}>
          <button type="button" style={S.skipBtn} onClick={onClose}>Salta</button>
          <button type="button" style={S.closeBtn} aria-label="Chiudi guida" onClick={onClose}>✕</button>
        </div>
      </header>

      <nav style={S.progress} aria-label="Avanzamento">
        {ACTS.map((a, i) => {
          const isActive = i === currentActIdx;
          const isDone = i < currentActIdx;
          const firstSceneOfAct = scenes.findIndex((s) => s.act === a.key);
          return (
            <button
              key={a.key}
              type="button"
              onClick={() => goTo(firstSceneOfAct, firstSceneOfAct > index ? 1 : -1)}
              disabled={firstSceneOfAct > index && !isDone && !isActive}
              style={S.progressItem}
              aria-current={isActive ? "step" : undefined}
            >
              <span style={{ ...S.progressDot, background: isActive || isDone ? C.violet : C.ink200, transform: isActive ? "scale(1.15)" : "scale(1)" }} />
              <span style={{ ...S.progressLabel, color: isActive ? C.violet : C.ink400, fontWeight: isActive ? 700 : 500 }}>
                {a.label}
              </span>
            </button>
          );
        })}
      </nav>

      <main style={S.stage}>
        <div key={index} style={{ ...S.sceneWrap, animation: sceneAnim }}>
          {scenes[index].render({ onGoToDetails, onClose, onRestart: restart, onOpenMethodology })}
        </div>
      </main>

      <footer style={S.footer}>
        <button type="button" style={{ ...S.navBtn, visibility: isFirst ? "hidden" : "visible" }} onClick={prev}>
          ← Indietro
        </button>
        <span style={S.stepCounter}>{index + 1} / {scenes.length}</span>
        {isLast ? (
          <button type="button" style={S.navBtnPrimary} onClick={onClose}>Chiudi</button>
        ) : (
          <button type="button" style={S.navBtnPrimary} onClick={next}>Avanti →</button>
        )}
      </footer>
    </div>,
    document.body,
  );
}

/* ─── Bottone di ingresso (banner, opzionale) ──────────────────────────────── */
export function HoldingHandsCbaEntry({ onOpen, disabled }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={disabled}
      style={{ ...S.entry, opacity: disabled ? 0.55 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
    >
      <span style={S.entryLeft}>
        <span style={S.entrySpark} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
          </svg>
        </span>
        <span>
          <span style={S.entryTitle}>La convenienza in parole semplici</span>
          <span style={S.entrySub}>60 secondi per capire se l'opera conviene alla collettività, senza termini tecnici.</span>
        </span>
      </span>
      <span style={S.entryCta}>Inizia →</span>
    </button>
  );
}

/* ─── Keyframes ────────────────────────────────────────────────────────────── */
const KEYFRAMES = `
@keyframes hhc-in-right { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: translateX(0); } }
@keyframes hhc-in-left  { from { opacity: 0; transform: translateX(-36px); } to { opacity: 1; transform: translateX(0); } }
@keyframes hhc-pulse    { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
`;

/* ─── Stili ────────────────────────────────────────────────────────────────── */
const FONT = "Inter, system-ui, sans-serif";
const S = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 2000,
    background: `radial-gradient(circle at 50% 0%, ${C.violetSoft} 0%, #FFFFFF 55%)`,
    display: "flex", flexDirection: "column", fontFamily: FONT, color: C.ink900, outline: "none",
  },
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 24px", borderBottom: `1px solid ${C.ink100}`,
  },
  brand: { fontSize: 13, color: C.ink500, letterSpacing: "0.01em" },
  topActions: { display: "flex", alignItems: "center", gap: 8 },
  skipBtn: { border: "none", background: "transparent", color: C.ink500, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "6px 10px" },
  closeBtn: { border: `1px solid ${C.ink200}`, background: C.white, color: C.ink700, width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: 14 },
  progress: { display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 4, padding: "16px 24px 4px" },
  progressItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, border: "none", background: "transparent", cursor: "pointer", padding: "4px 10px", minWidth: 64 },
  progressDot: { width: 12, height: 12, borderRadius: "50%", transition: "all .25s ease" },
  progressLabel: { fontSize: 11, transition: "all .2s ease", whiteSpace: "nowrap" },
  stage: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 24px", overflowY: "auto" },
  sceneWrap: { width: "100%", maxWidth: 720, margin: "0 auto" },
  sceneCenter: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14 },
  sceneWide: { display: "flex", flexDirection: "column", gap: 16 },
  kicker: { margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.violet },
  h2: { margin: 0, fontSize: 30, lineHeight: 1.2, fontWeight: 800, color: C.ink900, maxWidth: 640 },
  lead: { margin: 0, fontSize: 18, lineHeight: 1.5, color: C.ink700, maxWidth: 580 },
  note: { margin: 0, fontSize: 14, lineHeight: 1.5, color: C.ink500, maxWidth: 600 },
  noteBadge: { display: "inline-block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: C.violet, background: C.violetSoft, borderRadius: 6, padding: "1px 7px", marginRight: 4 },
  spesaBox: { display: "flex", flexDirection: "column", gap: 4, background: C.violetSoft, border: `1px solid ${C.violetLight}`, borderRadius: 16, padding: "16px 28px" },
  spesaLabel: { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.violet },
  spesaValue: { fontSize: 26, fontWeight: 800, color: C.ink900 },
  metricIconWrap: { display: "flex", alignItems: "center", justifyContent: "center", width: 84, height: 84, borderRadius: "50%", background: C.violetSoft, color: C.violet },
  bigNumberWrap: { margin: "4px 0" },
  bigNumber: { fontSize: 52, fontWeight: 800, lineHeight: 1, color: C.violet, letterSpacing: "-0.02em" },
  bigUnit: { fontSize: 22, fontWeight: 700, color: C.ink700 },
  coinPulse: { display: "flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: C.green, color: C.white, animation: "hhc-pulse 1.8s ease-in-out infinite" },
  settoriList: { listStyle: "none", margin: "4px auto 0", padding: 0, display: "flex", flexDirection: "column", gap: 16, maxWidth: 640, width: "100%" },
  benefRow: { display: "flex", flexDirection: "column", gap: 5 },
  benefHead: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 },
  benefNome: { fontSize: 15, fontWeight: 700, color: C.ink900 },
  benefVal: { fontSize: 15, fontWeight: 800, color: C.green, whiteSpace: "nowrap" },
  settoreTrack: { height: 14, background: C.ink100, borderRadius: 7, overflow: "hidden" },
  settoreFill: { height: "100%", borderRadius: 7, background: C.green, transition: "width .5s ease" },
  benefWhy: { margin: 0, fontSize: 13, lineHeight: 1.45, color: C.ink500 },
  costSplit: { display: "flex", alignItems: "stretch", gap: 14, flexWrap: "wrap", justifyContent: "center", margin: "4px 0" },
  costItem: { display: "flex", flexDirection: "column", gap: 4, alignItems: "center", flex: "1 1 220px", maxWidth: 280, background: C.white, border: `1px solid ${C.ink100}`, borderRadius: 14, padding: "16px 18px" },
  costItemVal: { fontSize: 26, fontWeight: 800, color: C.ink900 },
  costItemLab: { fontSize: 14, fontWeight: 700, color: C.ink700 },
  costItemSub: { fontSize: 13, lineHeight: 1.4, color: C.ink500 },
  costPlus: { display: "flex", alignItems: "center", fontSize: 26, fontWeight: 800, color: C.ink400 },
  bridgeRow: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "center", margin: "2px 0" },
  bridgeChip: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 92, padding: "10px 14px", borderRadius: 12, border: "1px solid", fontSize: 22, fontWeight: 800, lineHeight: 1.1 },
  bridgeOp: { fontSize: 24, fontWeight: 800, color: C.ink400 },
  indGrid: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, width: "100%", maxWidth: 720, margin: "4px 0" },
  indTile: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: "1 1 200px", minWidth: 200, maxWidth: 230, padding: "18px 16px", background: C.white, border: `1px solid ${C.violetLight}`, borderRadius: 14, boxShadow: "0px 4px 12px rgba(91,33,247,0.06)" },
  indVal: { fontSize: 28, fontWeight: 800, lineHeight: 1, color: C.green },
  indLab: { fontSize: 13, fontWeight: 700, color: C.ink900, textAlign: "center", lineHeight: 1.3 },
  indSub: { fontSize: 12, color: C.ink500, textAlign: "center", lineHeight: 1.4 },
  indBadge: { fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px", marginTop: 2 },
  timeline: { width: "100%", maxWidth: 620, margin: "6px auto 0" },
  timelineTrack: { position: "relative", height: 26, background: C.ink100, borderRadius: 8, overflow: "hidden" },
  timelineRed: { position: "absolute", left: 0, top: 0, height: "100%", background: C.redSoft, borderRight: `2px solid ${C.red}` },
  timelineGreen: { position: "absolute", top: 0, height: "100%", background: C.greenSoft },
  timelineMarker: { position: "absolute", top: -4, width: 2, height: 34, background: C.violet },
  timelineLabels: { display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: C.ink500 },
  riskBar: { width: "100%", maxWidth: 480, height: 18, background: C.redSoft, borderRadius: 9, overflow: "hidden", margin: "2px auto 0" },
  riskBarFill: { height: "100%", background: C.green, borderRadius: 9, transition: "width .6s ease" },
  fineActions: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 8 },
  btnPrimary: { border: "none", background: C.violet, color: C.white, fontWeight: 700, fontSize: 15, padding: "12px 22px", borderRadius: 10, cursor: "pointer" },
  btnGhost: { border: `1px solid ${C.ink200}`, background: C.white, color: C.ink700, fontWeight: 600, fontSize: 15, padding: "12px 22px", borderRadius: 10, cursor: "pointer" },
  fineLinks: { display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center", marginTop: 6 },
  linkBtn: { border: "none", background: "transparent", color: C.ink500, fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "underline" },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: `1px solid ${C.ink100}` },
  navBtn: { border: `1px solid ${C.ink200}`, background: C.white, color: C.ink700, fontWeight: 600, fontSize: 15, padding: "10px 18px", borderRadius: 10, cursor: "pointer" },
  navBtnPrimary: { border: "none", background: C.violet, color: C.white, fontWeight: 700, fontSize: 15, padding: "10px 22px", borderRadius: 10, cursor: "pointer" },
  stepCounter: { fontSize: 13, fontWeight: 600, color: C.ink400 },
  entry: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, width: "100%", textAlign: "left", border: `1px solid ${C.violetLight}`, background: `linear-gradient(90deg, ${C.violetSoft} 0%, #FFFFFF 100%)`, padding: "16px 22px", marginBottom: 16, borderRadius: 2 },
  entryLeft: { display: "flex", alignItems: "center", gap: 16 },
  entrySpark: { display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: C.violet, color: C.white, flexShrink: 0 },
  entryTitle: { display: "block", fontSize: 15, fontWeight: 800, color: C.ink900 },
  entrySub: { display: "block", fontSize: 13, color: C.ink500, marginTop: 2 },
  entryCta: { fontSize: 14, fontWeight: 700, color: C.violet, whiteSpace: "nowrap" },
};
