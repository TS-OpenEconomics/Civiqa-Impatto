/* HoldingHands — "Spiegamelo semplice"
 * Percorso narrato a tappe sopra l'Analisi di Impatto Economico (SAM).
 * È un wrapper di sola presentazione: non ricalcola nulla, legge gli stessi
 * dati che la sezione tecnica mostra (mocks/eiaResults.json) e li racconta
 * in linguaggio semplice, una schermata per volta.
 *
 * Vincoli metodologici rispettati nel copy (cfr. nota metodologica):
 *  - valori LORDI, ceteris paribus → mai "guadagno netto" / "rende il X%"
 *  - occupazione in ETP (persone a tempo pieno per un anno)
 *  - gettito solo a livello nazionale
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getEiaDataset } from "../mocks/eiaDatasets";
import { ImpactIcon } from "./ui/ImpactIcon";

/* ─── Palette (allineata a tailwind.config.js) ─────────────────────────────── */
const C = {
  violet: "#5B21F7",
  violetDark: "#2E0B86",
  // superfici/testi/bordi passano da variabili CSS → adattano al tema (dark)
  violetLight: "var(--hh-border, #E8DEFC)",
  violetSoft: "var(--hh-tint, #F3EEFE)",
  lime: "#C7F03A",
  limeText: "#3A4D00",
  ink900: "var(--hh-text, #0E0E10)",
  ink700: "var(--hh-text-700, #2B2B2E)",
  ink500: "var(--hh-text-500, #5A5A60)",
  ink400: "var(--hh-text-400, #7B7B82)",
  ink200: "var(--hh-border-200, #D1D1D6)",
  ink100: "var(--hh-border-100, #E5E5E8)",
  direct: "#5B21F7",
  indirect: "#9E7BFA",
  induced: "#D4C5FB",
  white: "var(--hh-surface, #FFFFFF)",
};

/* ─── Formattazione numeri (sempre arrotondati, unità in chiaro) ───────────── */
function nf(n, dec = 0) {
  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(n);
}

// € → numero di milioni (intero sopra 10M, 1 decimale sotto)
function milioni(euro) {
  const m = euro / 1_000_000;
  return nf(m, m >= 10 ? 0 : 1);
}

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

function useCountUp(target, { duration = 900 } = {}) {
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

/* ─── Adattatore dati: dataset EIA del progetto → payload narrativo ────────────
 * Legge lo STESSO dataset che la vista tecnica mostra (`getEiaDataset(project)`):
 * il mock storico (Palermo) per i progetti demo, il dataset dedicato per quelli
 * registrati in `EIA_DATASETS` (es. MUBA Bologna). Aggiungere un progetto al
 * registro lo fa narrare automaticamente con i suoi numeri reali. */
function buildPayload(project) {
  const d = getEiaDataset(project);
  const input = d.input ?? {};
  const nat = d.synthesis?.by_perimeter?.national ?? {};
  const kpi = d.synthesis?.synthetic_kpis ?? {};
  const prov = input.origin_provinces?.[0] ?? {};

  const settori = (d.sectors?.items ?? [])
    .map((s) => ({
      nome: s.ateco_name,
      valore:
        (s.values?.production?.intra ?? 0) + (s.values?.production?.extra ?? 0),
    }))
    .sort((a, b) => b.valore - a.valore);

  const regioniAltro = (d.geography?.regions ?? [])
    .filter((r) => !r.is_origin)
    .map((r) => ({ nome: r.nome ?? r.name, valore: r.values?.production?.absolute ?? 0 }))
    .sort((a, b) => b.valore - a.valore);

  return {
    progetto: {
      nome: project?.nome || `l'intervento a ${prov.name ?? "tuo"}`,
      hasNome: Boolean(project?.nome),
      localita: prov.name ?? input.origin_region?.name ?? "Italia",
      regione: input.origin_region?.name ?? "Italia",
      spesa: input.total_spend ?? 0,
      settore: d.metadata?.settore ?? "",
    },
    grandezze: {
      produzione: nat.production ?? 0,
      pil: nat.gdp ?? 0,
      occupazione: nat.employment ?? 0,
      redditi: nat.income ?? 0,
      gettito: nat.fiscal ?? d.synthesis?.fiscal_national ?? 0,
    },
    moltiplicatorePil: kpi.gdp_multiplier ?? 0,
    moltiplicatoreProduzione: kpi.production_multiplier ?? 0,
    // scomposizione sulla produzione (il "giro d'affari" della card 1)
    propagazione: d.components?.production ?? { direct: 0, indirect: 0, induced: 0 },
    territorio: {
      macro: d.geography?.macro_split ?? {},
      regioniAltro: regioniAltro.slice(0, 4),
    },
    settori: settori.slice(0, 6),
  };
}

/* ─── Le 5 grandezze (Atto 1) ──────────────────────────────────────────────────
 * Definizioni distillate dalla nota metodologica e dal glossario della sezione
 * tecnica (modello SAM): semplici nella UI, fedeli nella sostanza. */
function buildCards(g) {
  return [
    {
      icon: "produzione",
      titolo: "Giro d'affari attivato",
      tecnico: "Valore della produzione",
      recap: "Giro d'affari",
      euro: g.produzione,
      frase: "Il valore di tutto ciò che imprese e fornitori producono lungo la filiera per realizzare e far funzionare il progetto.",
      extra: "È la cifra più grande perché conta l'intera catena: lo stesso lavoro passa di mano più volte.",
    },
    {
      icon: "pil",
      titolo: "Ricchezza nuova per l'Italia",
      tecnico: "PIL — valore aggiunto",
      recap: "Ricchezza nuova",
      euro: g.pil,
      frase: "La ricchezza davvero nuova che resta nel Paese: stipendi, profitti e imposte, contati una sola volta.",
      extra: "È la misura corretta del valore creato, senza contare due volte lo stesso bene.",
    },
    {
      icon: "occupazione",
      titolo: "Persone al lavoro",
      tecnico: "Occupazione (ETP)",
      recap: "Occupazione",
      persone: g.occupazione,
      frase: "Il lavoro che serve per sostenere tutta questa attività, misurato in persone a tempo pieno per un anno.",
      extra: "Non sono per forza posti fissi nuovi: è lavoro attivato, dal cantiere fino ai fornitori.",
    },
    {
      icon: "redditi",
      titolo: "Redditi per famiglie e imprese",
      tecnico: "Redditi distribuiti",
      recap: "Redditi",
      euro: g.redditi,
      frase: "I redditi distribuiti grazie al progetto: stipendi per chi lavora, profitti per le imprese e rendite da capitale.",
      extra: "Sono redditi che poi vengono spesi, e così rimettono in moto altra attività economica.",
    },
    {
      icon: "gettito",
      titolo: "Tasse che tornano allo Stato",
      tecnico: "Gettito fiscale",
      recap: "Gettito",
      euro: g.gettito,
      frase: "Le imposte e i contributi attivati lungo tutta la filiera: IVA, IRPEF, IRES e contributi sociali. È riferito all'intera Italia.",
      extra: "Vuol dire che una quota della spesa iniziale torna nelle casse dello Stato sotto forma di imposte e contributi.",
    },
  ];
}

/* ─── Atti / progress ──────────────────────────────────────────────────────── */
const ACTS = [
  { key: "progetto", label: "Il progetto" },
  { key: "cosa", label: "Cosa succede" },
  { key: "come", label: "Come" },
  { key: "dove", label: "Dove" },
  { key: "settori", label: "I settori" },
  { key: "fine", label: "Fine" },
];

/* ─── Componenti di scena ──────────────────────────────────────────────────── */
function BigEuro({ euro }) {
  const m = useCountUp(euro / 1_000_000, { duration: 1000 });
  const dec = euro / 1_000_000 >= 10 ? 0 : 1;
  return (
    <span style={S.bigNumber}>
      {nf(m, dec)}
      <span style={S.bigUnit}> milioni di €</span>
    </span>
  );
}

function BigPersone({ persone }) {
  const v = useCountUp(persone, { duration: 1000 });
  return (
    <span style={S.bigNumber}>
      {nf(Math.round(v))}
      <span style={S.bigUnit}> persone</span>
    </span>
  );
}

function SceneProgetto({ p }) {
  return (
    <div style={S.sceneCenter}>
      <p style={S.kicker}>Il tuo progetto</p>
      <h2 style={S.h2}>
        Stai realizzando <span style={{ color: C.violet }}>{p.progetto.nome}</span>.
      </h2>
      <div style={S.spesaBox}>
        <span style={S.spesaLabel}>Spesa che entra nell'economia</span>
        <span style={S.spesaValue}>circa {milioni(p.progetto.spesa)} milioni di euro</span>
      </div>
      <p style={S.lead}>
        Non è solo un costo: quando questi soldi entrano nell'economia di {p.progetto.regione} e
        dell'Italia, generano valore. Vediamo quanto, e dove va a finire.
      </p>
      <p style={S.note}>Un viaggio di un minuto, senza una sola parola difficile.</p>
    </div>
  );
}

function SceneIntro({ p }) {
  return (
    <div style={S.sceneCenter}>
      <div style={S.coinPulse} aria-hidden="true">€</div>
      <h2 style={S.h2}>
        Quei {milioni(p.progetto.spesa)} milioni non si fermano al progetto.
      </h2>
      <p style={S.lead}>
        Si muovono, passano di mano in mano lungo le imprese e le famiglie e mettono in moto
        l'economia. Il modello misura <strong>5 effetti</strong>: vediamoli uno per uno.
      </p>
    </div>
  );
}

/* Riepilogo: i 5 impatti tutti insieme, dopo averli visti uno per uno */
function RecapTile({ card }) {
  const valore = card.persone != null ? nf(Math.round(card.persone)) : `${milioni(card.euro)} M€`;
  return (
    <div style={S.recapTile}>
      <span style={S.recapIcon} aria-hidden="true">
        <ImpactIcon type={card.icon} className="h-7 w-7" wrapperClassName="flex items-center justify-center" />
      </span>
      <span style={S.recapValue}>{valore}</span>
      <span style={S.recapLabel}>{card.recap}</span>
    </div>
  );
}

function SceneRiepilogo({ p, cards }) {
  return (
    <div style={S.sceneCenter}>
      <p style={S.kicker}>Il quadro completo</p>
      <h2 style={S.h2}>
        Ecco cosa mettono in moto {milioni(p.progetto.spesa)} milioni di spesa.
      </h2>
      <div style={S.recapGrid}>
        {cards.map((c) => (
          <RecapTile key={c.tecnico} card={c} />
        ))}
      </div>
      <p style={S.note}>Cinque effetti diversi, generati dalla stessa spesa. Ora vediamo quanto vale.</p>
    </div>
  );
}

function SceneMetric({ card, index }) {
  return (
    <div style={S.sceneCenter}>
      <div style={S.metricIconWrap}>
        <ImpactIcon
          type={card.icon}
          className="h-12 w-12"
          wrapperClassName="flex items-center justify-center"
        />
      </div>
      <p style={S.cardCounter}>{index + 1} di 5</p>
      <div style={S.bigNumberWrap}>
        {card.persone != null ? <BigPersone persone={card.persone} /> : <BigEuro euro={card.euro} />}
      </div>
      <h2 style={S.h2}>{card.titolo}</h2>
      <p style={S.tecnico}>{card.tecnico}</p>
      <p style={S.lead}>{card.frase}</p>
      {card.extra && (
        <p style={S.note}>
          <span style={S.noteBadge}>perché</span> {card.extra}
        </p>
      )}
    </div>
  );
}

function SceneHero({ p }) {
  const m = useCountUp(p.moltiplicatorePil, { duration: 1100 });
  return (
    <div style={S.sceneCenter}>
      <p style={S.kicker}>L'effetto moltiplicatore</p>
      <div style={S.coinRow} aria-hidden="true">
        <span style={S.coinIn}>1 €</span>
        <span style={S.coinArrow}>→</span>
        <span style={S.coinOut}>{nf(m, 1)} €</span>
      </div>
      <h2 style={S.h2}>
        Ogni euro speso genera{" "}
        <span style={{ color: C.violet }}>{nf(p.moltiplicatorePil, 1)} €</span> di ricchezza nuova
        per l'Italia.
      </h2>
      {p.moltiplicatoreProduzione > 0 && (
        <p style={S.lead}>
          E mette in circolo <strong>{nf(p.moltiplicatoreProduzione, 1)} €</strong> di giro d'affari
          lungo tutta la filiera.
        </p>
      )}
      <p style={S.note}>
        <span style={S.noteBadge}>nota</span> È un effetto lordo, a parità di ogni altra condizione:
        misura ciò che la spesa <em>mette in moto</em>, non un guadagno o un rendimento garantito.
      </p>
    </div>
  );
}

function Ring({ size, color, z }) {
  return (
    <span
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        zIndex: z,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        animation: "hh-ring 600ms ease both",
        animationDelay: `${(3 - z) * 220}ms`,
      }}
      aria-hidden="true"
    />
  );
}

function SceneCome({ p }) {
  const livelli = [
    {
      colore: C.direct,
      etichetta: "Diretto",
      titolo: "Chi realizza il progetto",
      frase: "Le imprese che eseguono i lavori e le persone che ci lavorano sopra, dove la spesa avviene davvero.",
      euro: p.propagazione.direct,
    },
    {
      colore: C.indirect,
      etichetta: "Indiretto",
      titolo: "I fornitori dei fornitori",
      frase: "Le aziende lungo la catena che riforniscono il cantiere: materiali, trasporti, energia, consulenze tecniche.",
      euro: p.propagazione.indirect,
    },
    {
      colore: C.induced,
      etichetta: "Indotto",
      titolo: "Quando si spende lo stipendio",
      frase: "I lavoratori coinvolti spendono i loro redditi e riaccendono altra economia: negozi, servizi, casa.",
      euro: p.propagazione.induced,
    },
  ];
  return (
    <div style={S.sceneWide}>
      <p style={S.kicker}>Come si propaga</p>
      <h2 style={{ ...S.h2, textAlign: "center", marginInline: "auto" }}>
        È come un sasso nello stagno.
      </h2>
      <p style={{ ...S.lead, textAlign: "center", marginInline: "auto" }}>
        La spesa parte da un punto e si allarga in cerchi: ogni cerchio è un'ondata di economia in più.
      </p>
      <div style={S.comeLayout}>
        <div style={S.ringStage}>
          <Ring size={220} color={C.induced} z={1} />
          <Ring size={150} color={C.indirect} z={2} />
          <Ring size={84} color={C.direct} z={3} />
        </div>
        <ul style={S.livelliList}>
          {livelli.map((l) => (
            <li key={l.titolo} style={S.livelloItem}>
              <span style={{ ...S.dot, background: l.colore }} aria-hidden="true" />
              <div>
                <p style={S.livelloTitolo}>
                  {l.titolo} <span style={S.livelloTag}>{l.etichetta}</span>
                </p>
                <p style={S.livelloFrase}>{l.frase}</p>
                <p style={S.livelloValore}>circa {milioni(l.euro)} milioni di € di giro d'affari</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p style={{ ...S.note, textAlign: "center", marginInline: "auto" }}>
        Il primo cerchio resta dov'è il cantiere; gli altri due viaggiano lungo le filiere. Così{" "}
        {milioni(p.progetto.spesa)} milioni diventano molto di più.
      </p>
    </div>
  );
}

function SceneDove({ p }) {
  const macro = p.territorio.macro;
  const segmenti = [
    { label: `A ${p.progetto.localita}`, pct: macro.origin?.pct ?? 0, color: C.direct },
    { label: `Resto della ${p.progetto.regione}`, pct: macro.rest_of_region?.pct ?? 0, color: C.indirect },
    { label: "Resto d'Italia", pct: macro.extra_region?.pct ?? 0, color: C.induced },
  ];
  return (
    <div style={S.sceneWide}>
      <p style={S.kicker}>Dove arriva l'impatto</p>
      <h2 style={{ ...S.h2, textAlign: "center", marginInline: "auto" }}>
        La spesa è tutta a {p.progetto.localita}. L'impatto no.
      </h2>
      <p style={{ ...S.lead, textAlign: "center", marginInline: "auto" }}>
        Le filiere portano valore anche dove la spesa non è mai arrivata: materiali, servizi e
        consumi si distribuiscono in tutta Italia.
      </p>
      <div style={S.barStack}>
        {segmenti.map((s) => (
          <div key={s.label} style={S.barRow}>
            <span style={S.barLabel}>{s.label}</span>
            <div style={S.barTrack}>
              <div
                style={{
                  ...S.barFill,
                  width: `${Math.max(2, Math.round(s.pct * 100))}%`,
                  background: s.color,
                }}
              />
            </div>
            <span style={S.barPct}>{Math.round(s.pct * 100)}%</span>
          </div>
        ))}
      </div>
      <p style={{ ...S.note, textAlign: "center", marginInline: "auto" }}>
        <span style={S.noteBadge}>spillover</span> Fuori regione l'effetto arriva fino a{" "}
        {p.territorio.regioniAltro.map((r) => r.nome).join(", ")} e altre, lungo le catene di fornitura nazionali.
      </p>
    </div>
  );
}

function SceneSettori({ p }) {
  const max = Math.max(...p.settori.map((s) => s.valore), 1);
  return (
    <div style={S.sceneWide}>
      <p style={S.kicker}>In che modo</p>
      <h2 style={{ ...S.h2, textAlign: "center", marginInline: "auto" }}>
        Non si muovono solo gli edili.
      </h2>
      <p style={{ ...S.lead, textAlign: "center", marginInline: "auto" }}>
        Una spesa in costruzioni attiva decine di altri settori: chi fornisce materiali, chi
        trasporta, chi offre servizi e poi i consumi delle famiglie. Ecco i principali.
      </p>
      <ul style={S.settoriList}>
        {p.settori.map((s) => (
          <li key={s.nome} style={S.settoreRow}>
            <span style={S.settoreNome}>{s.nome}</span>
            <div style={S.settoreTrack}>
              <div style={{ ...S.settoreFill, width: `${Math.max(4, (s.valore / max) * 100)}%` }} />
            </div>
            <span style={S.settoreVal}>{milioni(s.valore)} M€</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SceneFine({ onGoToDetails, onClose, onRestart, onOpenMethodology }) {
  return (
    <div style={S.sceneCenter}>
      <div style={S.coinPulse} aria-hidden="true">✓</div>
      <h2 style={S.h2}>Ora hai il quadro.</h2>
      <p style={S.lead}>
        Hai visto quanto valore genera la spesa, come si propaga, dove arriva e quali settori
        coinvolge. Se vuoi i numeri di dettaglio, le mappe e la metodologia, l'analisi completa è qui
        sotto.
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
        <button type="button" style={S.linkBtn} onClick={onRestart}>
          ↺ Rivedi da capo
        </button>
        {onOpenMethodology && (
          <button type="button" style={S.linkBtn} onClick={onOpenMethodology}>
            Come funziona questo calcolo?
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Overlay principale ───────────────────────────────────────────────────── */
export function HoldingHands({ open, onClose, project, onGoToDetails, onOpenMethodology }) {
  const payload = useMemo(() => buildPayload(project), [project]);
  const cards = useMemo(() => buildCards(payload.grandezze), [payload]);

  // Sequenza di scene (ognuna appartiene a un atto). Gli handler della scena
  // finale arrivano al momento del render, così la memo resta stabile.
  const scenes = useMemo(() => {
    return [
      { act: "progetto", render: () => <SceneProgetto p={payload} /> },
      { act: "cosa", render: () => <SceneIntro p={payload} /> },
      ...cards.map((card, i) => ({
        act: "cosa",
        render: () => <SceneMetric card={card} index={i} />,
      })),
      { act: "cosa", render: () => <SceneRiepilogo p={payload} cards={cards} /> },
      { act: "cosa", render: () => <SceneHero p={payload} /> },
      { act: "come", render: () => <SceneCome p={payload} /> },
      { act: "dove", render: () => <SceneDove p={payload} /> },
      { act: "settori", render: () => <SceneSettori p={payload} /> },
      { act: "fine", render: (h) => <SceneFine {...h} /> },
    ];
  }, [payload, cards]);

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

  // reset all'apertura, scroll lock, focus
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

  // tastiera
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
    : `${dir >= 0 ? "hh-in-right" : "hh-in-left"} 380ms cubic-bezier(.22,.61,.36,1) both`;

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="In parole semplici — guida all'analisi di impatto"
      tabIndex={-1}
      style={S.overlay}
    >
      <style>{KEYFRAMES}</style>

      {/* Top bar */}
      <header style={S.topbar}>
        <span style={S.brand}>
          Analisi di Impatto · <strong style={{ color: C.violet }}>In parole semplici</strong>
        </span>
        <div style={S.topActions}>
          <button type="button" style={S.skipBtn} onClick={onClose}>
            Salta
          </button>
          <button type="button" style={S.closeBtn} aria-label="Chiudi guida" onClick={onClose}>
            ✕
          </button>
        </div>
      </header>

      {/* Progress per atto */}
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
              <span
                style={{
                  ...S.progressDot,
                  background: isActive || isDone ? C.violet : C.ink200,
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                }}
              />
              <span
                style={{
                  ...S.progressLabel,
                  color: isActive ? C.violet : C.ink400,
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {a.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Scena */}
      <main style={S.stage}>
        <div key={index} style={{ ...S.sceneWrap, animation: sceneAnim }}>
          {scenes[index].render({ onGoToDetails, onClose, onRestart: restart, onOpenMethodology })}
        </div>
      </main>

      {/* Footer nav */}
      <footer style={S.footer}>
        <button
          type="button"
          style={{ ...S.navBtn, visibility: isFirst ? "hidden" : "visible" }}
          onClick={prev}
        >
          ← Indietro
        </button>
        <span style={S.stepCounter}>
          {index + 1} / {scenes.length}
        </span>
        {isLast ? (
          <button type="button" style={S.navBtnPrimary} onClick={onClose}>
            Chiudi
          </button>
        ) : (
          <button type="button" style={S.navBtnPrimary} onClick={next}>
            Avanti →
          </button>
        )}
      </footer>
    </div>,
    document.body,
  );
}

/* ─── Bottone di ingresso (banner) ─────────────────────────────────────────── */
export function HoldingHandsEntry({ onOpen, disabled }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={disabled}
      title={disabled ? "Disponibile dopo il calcolo degli impatti" : undefined}
      style={{ ...S.entry, opacity: disabled ? 0.55 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
    >
      <span style={S.entryLeft}>
        <span style={S.entrySpark} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
          </svg>
        </span>
        <span>
          <span style={S.entryTitle}>L'impatto in parole semplici</span>
          <span style={S.entrySub}>60 secondi per capire il risultato di questa analisi, senza termini tecnici.</span>
        </span>
      </span>
      <span style={S.entryCta}>Inizia →</span>
    </button>
  );
}

/* ─── Keyframes ────────────────────────────────────────────────────────────── */
const KEYFRAMES = `
@keyframes hh-in-right { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: translateX(0); } }
@keyframes hh-in-left  { from { opacity: 0; transform: translateX(-36px); } to { opacity: 1; transform: translateX(0); } }
@keyframes hh-ring     { from { opacity: 0; transform: translate(-50%, -50%) scale(.3); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
@keyframes hh-pulse    { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
`;

/* ─── Stili ────────────────────────────────────────────────────────────────── */
const FONT = "Inter, system-ui, sans-serif";
const S = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: `radial-gradient(circle at 50% 0%, ${C.violetSoft} 0%, ${C.white} 55%)`,
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT,
    color: C.ink900,
    outline: "none",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderBottom: `1px solid ${C.ink100}`,
  },
  brand: { fontSize: 13, color: C.ink500, letterSpacing: "0.01em" },
  topActions: { display: "flex", alignItems: "center", gap: 8 },
  skipBtn: {
    border: "none",
    background: "transparent",
    color: C.ink500,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    padding: "6px 10px",
  },
  closeBtn: {
    border: `1px solid ${C.ink200}`,
    background: C.white,
    color: C.ink700,
    width: 34,
    height: 34,
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: 14,
  },
  progress: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 4,
    padding: "16px 24px 4px",
  },
  progressItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "4px 10px",
    minWidth: 64,
  },
  progressDot: { width: 12, height: 12, borderRadius: "50%", transition: "all .25s ease" },
  progressLabel: { fontSize: 11, transition: "all .2s ease", whiteSpace: "nowrap" },
  stage: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px 24px",
    overflowY: "auto",
  },
  sceneWrap: { width: "100%", maxWidth: 720, margin: "0 auto" },
  sceneCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 14,
  },
  sceneWide: { display: "flex", flexDirection: "column", gap: 16 },
  kicker: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: C.violet,
  },
  h2: { margin: 0, fontSize: 30, lineHeight: 1.2, fontWeight: 800, color: C.ink900, maxWidth: 640 },
  lead: { margin: 0, fontSize: 18, lineHeight: 1.5, color: C.ink700, maxWidth: 560 },
  note: { margin: 0, fontSize: 14, lineHeight: 1.5, color: C.ink500, maxWidth: 580 },
  noteBadge: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: C.violet,
    background: C.violetSoft,
    borderRadius: 6,
    padding: "1px 7px",
    marginRight: 4,
  },
  tecnico: { margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: C.ink400 },
  spesaBox: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    background: C.violetSoft,
    border: `1px solid ${C.violetLight}`,
    borderRadius: 16,
    padding: "16px 28px",
  },
  spesaLabel: { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.violet },
  spesaValue: { fontSize: 26, fontWeight: 800, color: C.ink900 },
  metricIconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 84,
    height: 84,
    borderRadius: "50%",
    background: C.violetSoft,
    color: C.violet,
  },
  cardCounter: { margin: 0, fontSize: 12, fontWeight: 700, color: C.ink400, letterSpacing: "0.08em" },
  bigNumberWrap: { margin: "4px 0" },
  bigNumber: { fontSize: 52, fontWeight: 800, lineHeight: 1, color: C.violet, letterSpacing: "-0.02em" },
  bigUnit: { fontSize: 22, fontWeight: 700, color: C.ink700 },
  coinPulse: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: C.violet,
    color: C.white,
    fontSize: 34,
    fontWeight: 800,
    animation: "hh-pulse 1.8s ease-in-out infinite",
  },
  recapGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    margin: "8px 0",
    width: "100%",
    maxWidth: 720,
  },
  recapTile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    flex: "1 1 120px",
    minWidth: 120,
    maxWidth: 140,
    padding: "16px 10px",
    background: C.white,
    border: `1px solid ${C.violetLight}`,
    borderRadius: 14,
    boxShadow: "0px 4px 12px rgba(91,33,247,0.06)",
  },
  recapIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: C.violetSoft,
    color: C.violet,
  },
  recapValue: { fontSize: 22, fontWeight: 800, color: C.violet, lineHeight: 1.1, textAlign: "center" },
  recapLabel: { fontSize: 12, fontWeight: 600, color: C.ink500, textAlign: "center", lineHeight: 1.3 },
  coinRow: { display: "flex", alignItems: "center", gap: 18, margin: "6px 0" },
  coinIn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 64, height: 64, borderRadius: "50%",
    background: C.ink100, color: C.ink700, fontSize: 22, fontWeight: 800,
  },
  coinArrow: { fontSize: 28, color: C.ink400 },
  coinOut: {
    display: "flex", alignItems: "center", justifyContent: "center",
    minWidth: 84, height: 84, borderRadius: "50%", padding: "0 8px",
    background: C.violet, color: C.white, fontSize: 28, fontWeight: 800,
    boxShadow: "0px 8px 16px rgba(91,33,247,0.3)",
  },
  comeLayout: {
    display: "flex",
    flexWrap: "wrap",
    gap: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  ringStage: { position: "relative", width: 240, height: 240, flexShrink: 0 },
  livelliList: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 18, flex: 1, minWidth: 280 },
  livelloItem: { display: "flex", gap: 12, alignItems: "flex-start" },
  dot: { width: 16, height: 16, borderRadius: "50%", marginTop: 4, flexShrink: 0 },
  livelloTitolo: { margin: 0, fontSize: 17, fontWeight: 700, color: C.ink900, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  livelloTag: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: C.ink500,
    background: C.ink100,
    borderRadius: 5,
    padding: "1px 6px",
  },
  livelloFrase: { margin: "2px 0 0", fontSize: 14, lineHeight: 1.45, color: C.ink500 },
  livelloValore: { margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: C.violet },
  barStack: { display: "flex", flexDirection: "column", gap: 14, maxWidth: 620, width: "100%", margin: "8px auto 0" },
  barRow: { display: "flex", alignItems: "center", gap: 12 },
  barLabel: { width: 160, fontSize: 14, fontWeight: 600, color: C.ink700, textAlign: "right", flexShrink: 0 },
  barTrack: { flex: 1, height: 26, background: C.ink100, borderRadius: 8, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 8, transition: "width .5s ease" },
  barPct: { width: 44, fontSize: 14, fontWeight: 700, color: C.ink900 },
  settoriList: { listStyle: "none", margin: "8px auto 0", padding: 0, display: "flex", flexDirection: "column", gap: 10, maxWidth: 620, width: "100%" },
  settoreRow: { display: "flex", alignItems: "center", gap: 12 },
  settoreNome: { width: 180, fontSize: 14, fontWeight: 600, color: C.ink700, flexShrink: 0 },
  settoreTrack: { flex: 1, height: 22, background: C.ink100, borderRadius: 6, overflow: "hidden" },
  settoreFill: { height: "100%", borderRadius: 6, background: C.violet, transition: "width .5s ease" },
  settoreVal: { width: 64, fontSize: 14, fontWeight: 700, color: C.ink900, textAlign: "right" },
  fineActions: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 8 },
  btnPrimary: {
    border: "none", background: C.violet, color: C.white, fontWeight: 700, fontSize: 15,
    padding: "12px 22px", borderRadius: 10, cursor: "pointer",
  },
  btnGhost: {
    border: `1px solid ${C.ink200}`, background: C.white, color: C.ink700, fontWeight: 600, fontSize: 15,
    padding: "12px 22px", borderRadius: 10, cursor: "pointer",
  },
  fineLinks: { display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center", marginTop: 6 },
  linkBtn: { border: "none", background: "transparent", color: C.ink500, fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "underline" },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderTop: `1px solid ${C.ink100}`,
  },
  navBtn: {
    border: `1px solid ${C.ink200}`, background: C.white, color: C.ink700, fontWeight: 600, fontSize: 15,
    padding: "10px 18px", borderRadius: 10, cursor: "pointer",
  },
  navBtnPrimary: {
    border: "none", background: C.violet, color: C.white, fontWeight: 700, fontSize: 15,
    padding: "10px 22px", borderRadius: 10, cursor: "pointer",
  },
  stepCounter: { fontSize: 13, fontWeight: 600, color: C.ink400 },
  // entry banner
  entry: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    width: "100%",
    textAlign: "left",
    border: `1px solid ${C.violetLight}`,
    background: `linear-gradient(90deg, ${C.violetSoft} 0%, ${C.white} 100%)`,
    padding: "16px 22px",
    marginBottom: 16,
    borderRadius: 2,
  },
  entryLeft: { display: "flex", alignItems: "center", gap: 16 },
  entrySpark: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 44, height: 44, borderRadius: "50%", background: C.violet, color: C.white, flexShrink: 0,
  },
  entryTitle: { display: "block", fontSize: 15, fontWeight: 800, color: C.ink900 },
  entrySub: { display: "block", fontSize: 13, color: C.ink500, marginTop: 2 },
  entryCta: { fontSize: 14, fontWeight: 700, color: C.violet, whiteSpace: "nowrap" },
};
