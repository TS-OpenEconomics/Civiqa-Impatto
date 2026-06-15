import { useState, useEffect, useMemo, useRef } from "react";
import { Skeleton, SkeletonText } from "./ui/Skeleton";
import { Badge } from "./ui/Badge";
import { ImpactIcon } from "./ui/ImpactIcon";
import { Modal } from "./ui/Modal";
import { useToast } from "../hooks/useToast";

function assetUrl(path) {
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}${String(path ?? "").replace(/^\/+/, "")}`;
}

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtCurrency(n) {
  if (!n) return "—";
  return `${new Intl.NumberFormat("it-IT").format(n)} €`;
}


function fmtIT(n, dec = 0) {
  return new Intl.NumberFormat("it-IT", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
}

function fmtM(n) {
  if (n == null || n === 0) return "—";
  return `${new Intl.NumberFormat("it-IT", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n / 1_000_000)} M€`;
}

// ── Status helpers ────────────────────────────────────────────────────────────

function statusLabel(stato) {
  const map = {
    "In preparazione": { label: "In preparazione", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
    "In approvazione": { label: "In approvazione", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
    Approvato: { label: "Eseguito", cls: "bg-green-50 text-green-700 border border-green-200" },
    Eseguito: { label: "Eseguito", cls: "bg-green-50 text-green-700 border border-green-200" },
  };
  return map[stato] || { label: stato || "—", cls: "bg-ink-100 text-ink-500" };
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconChevronDown({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function IconDownload({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function IconTrash({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

// Icona testata della Valutazione — la stessa "freccia" (trend in salita) usata
// accanto alla voce Valutazione nella navigazione (SideNav.IconValutazione).
function IconValutazione({ className = "h-8 w-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 17l5-5 3 3 8-8" />
      <path d="M17 7h3v3" />
    </svg>
  );
}

// ── ESG helpers ───────────────────────────────────────────────────────────────

const RATING_SCALE = ["D", "CC", "C", "BB", "B", "BBB", "A", "A+", "AA", "AA+", "AAA"];

function getRatingColor(r) {
  const idx = RATING_SCALE.indexOf(r);
  if (idx >= 9) return "bg-green-600";
  if (idx >= 7) return "bg-green-500";
  if (idx >= 5) return "bg-lime-500";
  if (idx >= 3) return "bg-amber-400";
  if (idx >= 1) return "bg-orange-500";
  return "bg-red-500";
}

function RatingBadge({ rating }) {
  const cls = getRatingColor(rating);
  return (
    <span className={`flex h-10 w-10 items-center justify-center rounded text-[13px] font-bold text-white ${cls}`}>
      {rating || "—"}
    </span>
  );
}

// ── Analysis meta config ──────────────────────────────────────────────────────

const ANALYSIS_META = {
  eia: {
    iconSrc: assetUrl("icons/analysis-eia.png"),
    title: "Analisi di Impatto Economico",
    tag: "EIA",
    tagCls: "bg-[#F8A8E2] text-[#7B1F5E]",
    desc: "Stima gli effetti del progetto su economia locale, occupazione e sviluppo del territorio.",
    expandDesc: "Effetti economici stimati sul sistema locale durante la fase di investimento e gestione.",
  },
  ecba: {
    iconSrc: assetUrl("icons/analysis-ecba.png"),
    title: "Analisi Costi-Benefici",
    tag: "ECBA",
    tagCls: "bg-[#A8D8F8] text-[#1A4F7A]",
    desc: "Valuta il rapporto tra costi e benefici del progetto, misurandone la convenienza complessiva.",
    expandDesc: "Indicatori chiave di convenienza economica e sostenibilità finanziaria del progetto.",
  },
  esg: {
    iconSrc: assetUrl("icons/analysis-esg.png"),
    title: "Analisi ESG",
    tag: "ESG",
    tagCls: "bg-[#86E8DC] text-[#0D5C54]",
    desc: "Valuta la sostenibilità del progetto secondo i criteri ambientali, sociali e di governance.",
    expandDesc: "Valutazione integrata della sostenibilità ambientale, sociale e di governance.",
  },
};

// ── EIA KPI cards with icons ──────────────────────────────────────────────────

// Stessa icona "i" usata nei box di Impatto (EiaResults · IconInfoCircle).
function IconInfoCircle({ className = "h-3.5 w-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

// Pulsante "i" interattivo coerente con InfoButton di Impatto: icona info-circle
// (senza bordo), colore ink-300 → brand-violet, popover con bordo sinistro viola.
function EiaInfoDot({ title, text }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  if (!text) return null;
  return (
    <span ref={ref} className="relative ml-auto inline-flex shrink-0 align-middle" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Spiegazione"
        aria-expanded={open}
        className={`inline-flex items-center justify-center transition-colors ${
          open ? "text-brand-violet" : "text-ink-300 hover:text-brand-violet"
        }`}
      >
        <IconInfoCircle className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-[300px] border-l-2 border-brand-violet bg-white p-4 text-left shadow-xl normal-case tracking-normal">
          {title && <p className="text-[13px] font-semibold leading-tight text-ink-900">{title}</p>}
          <p className="mt-1 text-[13px] font-normal leading-relaxed text-ink-700">{text}</p>
        </div>
      )}
    </span>
  );
}

function EiaKpiCards({ eia, settoreSpesa }) {
  const r = eia ?? {};
  const kpis = [
    { label: "Spese effettuate",  icon: "spese",       value: fmtM(r.shock_totale),       sub: "valore attuale", info: "Spesa complessiva del progetto a valore attuale: è lo shock iniziale da cui parte l'analisi di impatto." },
    { label: "Valore produzione", icon: "produzione",  value: fmtM(r.produzione?.totale), sub: "valore attuale", info: "Volume d'affari complessivo attivato lungo la filiera (beni intermedi + finali)." },
    { label: "PIL",               icon: "pil",         value: fmtM(r.gva?.totale),        sub: "valore attuale", info: "Valore aggiunto generato: redditi da lavoro e capitale più imposte indirette nette." },
    { label: "Occupazione",       icon: "occupazione", value: r.fte?.totale ? fmtIT(r.fte.totale, 0) : "—", unit: "ETP", sub: "occupati equivalenti a tempo pieno (ETP)", info: "Occupati equivalenti a tempo pieno (ETP) attivati dal progetto." },
    { label: "Redditi",           icon: "redditi",     value: fmtM(r.redditi?.totale),    sub: "valore attuale", info: "Redditi da lavoro e capitale distribuiti a famiglie e imprese." },
    { label: "Gettito fiscale",   icon: "gettito",     value: fmtM(r.gettito?.totale),    sub: "valore attuale", info: "Entrate fiscali generate per la finanza pubblica dal progetto." },
  ];

  const shock = r.shock_totale ?? 0;
  const shockM = shock / 1_000_000;
  const moltProd = r.moltiplicatore != null
    ? r.moltiplicatore
    : (shock > 0 && r.produzione?.totale ? r.produzione.totale / shock : null);
  const moltPil = shock > 0 && r.gva?.totale ? r.gva.totale / shock : null;
  const occPerM = shockM > 0 && r.fte?.totale ? r.fte.totale / shockM : null;

  const settoreImpatto = r.per_settore?.[0]?.settore ?? null;
  const topRegione = r.per_territorio?.[0]?.regione ?? null;

  const moltChips = [
    moltProd != null && { label: "Moltiplicatore di produzione", formula: "Prod / spesa", value: `${fmtIT(moltProd, 2)}×` },
    moltPil != null && { label: "Moltiplicatore PIL", formula: "PIL / spesa", value: `${fmtIT(moltPil, 2)}×` },
    occPerM != null && { label: "Occupati per milione di euro speso", formula: "occ / mln € speso", value: fmtIT(occPerM, 1) },
  ].filter(Boolean);

  const territorialChips = [
    settoreSpesa && { label: "Settore principale di spesa", value: settoreSpesa },
    settoreImpatto && { label: "Settore principalmente attivato", value: settoreImpatto },
    topRegione && { label: "Regione principalmente attivata", value: topRegione },
  ].filter(Boolean);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.label} className="flex h-full flex-col rounded border border-ink-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex min-h-[2.25rem] items-start gap-2">
              <ImpactIcon type={k.icon} label={k.label} className="h-6 w-6" wrapperClassName="flex h-6 w-6 shrink-0 items-center justify-center text-brand-violet" />
              <p className="min-w-0 text-[11px] font-bold uppercase leading-tight tracking-wide text-ink-700">{k.label}</p>
              <EiaInfoDot title={k.label} text={k.info} />
            </div>
            <p className="text-[22px] font-bold leading-tight text-ink-900">
              {k.value}
              {k.unit && <span className="ml-1 text-[14px] font-semibold text-ink-400">{k.unit}</span>}
            </p>
            <p className="mt-auto pt-1 text-[11px] text-ink-400">{k.sub}</p>
          </div>
        ))}
      </div>
      {(moltChips.length > 0 || territorialChips.length > 0) && (
        <div className="grid grid-cols-1 gap-3 pt-1 md:grid-cols-2">
          <EiaChipColumn chips={moltChips} />
          <EiaChipColumn chips={territorialChips} />
        </div>
      )}
    </div>
  );
}

function EiaChipColumn({ chips }) {
  if (!chips.length) return null;
  return (
    <div className="flex flex-col gap-2">
      {chips.map((chip) => (
        <span key={chip.label} className="flex items-center justify-between gap-3 rounded-full border border-ink-100 bg-white px-3 py-1.5 text-[12px]">
          <span className="flex min-w-0 flex-1 items-baseline gap-2">
            <span className="text-ink-400">{chip.label}</span>
            {chip.formula && (
              <span className="whitespace-nowrap font-mono text-[10px] text-ink-400 underline decoration-ink-300 underline-offset-2">({chip.formula})</span>
            )}
          </span>
          <span className="shrink-0 text-right font-semibold text-ink-800">{chip.value}</span>
        </span>
      ))}
    </div>
  );
}

// ── ECBA indicator grid ───────────────────────────────────────────────────────

function EcbaRows({ ecba }) {
  const r = ecba ?? {};
  const bcr = r.bcr ?? (r.benefici_totali && r.costi_totali ? r.benefici_totali / r.costi_totali : null);
  const cards = [
    { label: "Benefici economici", icon: "benefici",   value: r.benefici_totali ? `€ ${fmtIT(r.benefici_totali)}` : "—", sub: "valore attuale",              tone: "green", info: "Somma attualizzata dei benefici economici e sociali monetizzati del progetto." },
    { label: "Costi economici",    icon: "costi",      value: r.costi_totali    ? `€ ${fmtIT(r.costi_totali)}`    : "—", sub: "valore attuale",              tone: "red",   info: "Somma attualizzata dei costi del progetto (CAPEX + OPEX)." },
    { label: "VANE",               icon: "vane",       value: r.van != null     ? `€ ${fmtIT(r.van)}`             : "—", sub: "valore attuale netto",        tone: r.van != null ? (r.van >= 0 ? "green" : "red") : null, info: "Valore Attuale Netto Economico: benefici meno costi attualizzati. Maggiore di zero = conveniente per la collettività." },
    { label: "Payback period",     icon: "payback",    value: r.payback_period  ? `${r.payback_period}`           : "—", sub: "anni al rientro",             tone: null,    info: "Anni necessari perché i benefici cumulati superino i costi (payback sociale)." },
    { label: "Rapporto B/C",       icon: "bcr",        value: bcr               ? fmtIT(bcr, 2)                   : "—", sub: "benefici su costi",           tone: bcr != null ? (bcr >= 1 ? "green" : "red") : null, info: "Rapporto benefici/costi: maggiore di 1 significa benefici superiori ai costi." },
    { label: "TIRE",               icon: "tire",       value: r.irr != null     ? `${fmtIT(r.irr, 2)}%`           : "—", sub: "tasso interno di rendimento", tone: null,    info: "Tasso Interno di Rendimento Economico: il tasso di sconto che azzera il VANE." },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="flex h-full flex-col rounded border border-ink-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex min-h-[2.25rem] items-start gap-2">
            <ImpactIcon type={c.icon} label={c.label} className="h-6 w-6" wrapperClassName="flex h-6 w-6 shrink-0 items-center justify-center text-brand-violet" />
            <p className="min-w-0 text-[11px] font-bold uppercase leading-tight tracking-wide text-ink-700">{c.label}</p>
            <EiaInfoDot title={c.label} text={c.info} />
          </div>
          <p className={`text-[22px] font-bold leading-tight ${
            c.tone === "green" ? "text-green-700" :
            c.tone === "red"   ? "text-red-600" :
                                 "text-ink-900"
          }`}>{c.value}</p>
          <p className="mt-auto pt-1 text-[11px] text-ink-400">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ── ESG summary panel ─────────────────────────────────────────────────────────

function EsgSummaryPanel({ esg }) {
  const r = esg ?? {};
  const rating = r.rating ?? "A";
  const score  = r.score  ?? 53.6;
  const total  = (r.aligned_count ?? 35) + (r.partial_count ?? 39) + (r.non_aligned_count ?? 34);
  const aligned    = r.aligned_count     ?? 35;
  const partial    = r.partial_count     ?? 39;
  const nonAligned = r.non_aligned_count ?? 34;

  return (
    <div className="space-y-5">
      {/* Rating + score */}
      <div className="flex items-center gap-3">
        <RatingBadge rating={rating} />
        <div>
          <p className="text-[11px] text-ink-500">Rating ESG complessivo</p>
          <p className="text-[15px] font-bold text-ink-900">{rating} — {fmtIT(score, 1)} / 100</p>
        </div>
      </div>

      {/* E / S / G sub-scores */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Environmental", score: r.environmental_score ?? 51, rating: r.environmental_rating ?? "A+" },
          { label: "Social",        score: r.social_score        ?? 62, rating: r.social_rating        ?? "A+" },
          { label: "Governance",    score: r.governance_score    ?? 46, rating: r.governance_rating    ?? "BBB" },
        ].map(({ label, score: s, rating: rat }) => (
          <div key={label} className="rounded border border-ink-100 p-3">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-semibold text-ink-500">{label}</span>
              <span className={`rounded px-1 py-0.5 text-[9px] font-bold text-white ${getRatingColor(rat)}`}>{rat}</span>
            </div>
            <p className="mt-1 font-mono text-[18px] font-bold text-ink-900">{fmtIT(s, 0)}</p>
          </div>
        ))}
      </div>

      {/* Grade bar */}
      <div>
        <p className="mb-2 text-[11px] text-ink-500">Scala di valutazione</p>
        <div className="flex items-end gap-0.5">
          {RATING_SCALE.map((grade) => {
            const active = grade === rating;
            return (
              <div key={grade} className="flex flex-col items-center gap-1">
                <div className={`w-7 rounded-sm ${active ? "h-8 bg-brand-violet" : "h-4 bg-ink-100"}`} />
                <span className={`text-[9px] ${active ? "font-bold text-brand-violet" : "text-ink-300"}`}>{grade}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance bar */}
      {total > 0 && (
        <div>
          <p className="mb-2 text-[11px] text-ink-500">Compliance ESG</p>
          <div className="flex h-4 overflow-hidden rounded">
            <div className="bg-green-500" style={{ width: `${(aligned / total) * 100}%` }} />
            <div className="bg-amber-400" style={{ width: `${(partial / total) * 100}%` }} />
            <div className="bg-red-400"   style={{ width: `${(nonAligned / total) * 100}%` }} />
          </div>
          <div className="mt-1.5 flex flex-wrap gap-3 text-[10px] text-ink-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              {Math.round((aligned / total) * 100)}% Allineato
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
              {Math.round((partial / total) * 100)}% Parziale
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
              {Math.round((nonAligned / total) * 100)}% Non allineato
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Analysis card ─────────────────────────────────────────────────────────────

function AnalysisCard({ id, analysis, results, onOpen, onDownloadReport, settoreSpesa }) {
  const meta       = ANALYSIS_META[id];
  const hasResults = analysis?.status === "completed";

  return (
    <div className="overflow-hidden rounded border border-ink-100 bg-white">
      <div className="flex items-center justify-between gap-6 px-5 py-5">
        {/* Left: icon + title + download link */}
        <div className="flex items-center gap-4">
          <img src={meta.iconSrc} alt={meta.title} className="h-20 w-20 shrink-0 object-contain" />
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[20px] font-bold text-ink-900">{meta.title}</span>
              <Badge type={meta.tag} />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onDownloadReport?.(id)}
                disabled={!hasResults}
                className="text-[12px] font-medium text-brand-violet hover:underline disabled:cursor-not-allowed disabled:text-ink-300 disabled:no-underline"
              >
                Scarica Report, Metodologia e Fonti
              </button>
              <svg className={`h-3.5 w-3.5 ${hasResults ? "text-brand-violet" : "text-ink-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>
        {/* Right: action button */}
        <button
          type="button"
          onClick={onOpen}
          className="shrink-0 rounded bg-brand-violet px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-violet-dark"
        >
          {hasResults ? "Vai al dettaglio dell'analisi →" : "Avvia analisi →"}
        </button>
      </div>
      {hasResults && (
        <div className="border-t border-ink-100 bg-ink-100/30 px-5 py-5">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="shrink-0 lg:w-44">
              <p className="text-[12px] leading-relaxed text-ink-600">{meta.expandDesc}</p>
              <button
                type="button"
                onClick={onOpen}
                className="mt-3 text-[12px] font-semibold text-brand-violet hover:underline"
              >
                Vedi analisi completa →
              </button>
            </div>
            <div className="flex-1">
              {id === "eia"  && <EiaKpiCards     eia={results.eia} settoreSpesa={settoreSpesa} />}
              {id === "ecba" && <EcbaRows        ecba={results.ecba} />}
              {id === "esg"  && <EsgSummaryPanel esg={results.esg} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Documentation section ─────────────────────────────────────────────────────

const MOCK_DOCS = [
  { id: 1, nome: "Piano di Fattibilità Tecnica.pdf",       data: "12/03/2025", proprietario: "Mario Rossi",   ext: "pdf",  source: "precaricato" },
  { id: 2, nome: "Progetto Definitivo.pdf",                data: "15/03/2025", proprietario: "Luigi Bianchi", ext: "pdf",  source: "precaricato" },
  { id: 3, nome: "Analisi Ambientale Preliminare.docx",    data: "18/03/2025", proprietario: "Sara Verdi",    ext: "docx", source: "precaricato" },
  { id: 4, nome: "Relazione Tecnica Descrittiva.pdf",      data: "20/03/2025", proprietario: "Mario Rossi",   ext: "pdf",  source: "precaricato" },
  { id: 5, nome: "Computo Metrico Estimativo.xlsx",        data: "22/03/2025", proprietario: "Anna Neri",     ext: "xlsx", source: "precaricato" },
];

const DOC_TABS = [
  { id: "fascicolo",   label: "Fascicolo Completo" },
  { id: "precaricati", label: "Documenti precaricati" },
  { id: "aggiunti",    label: "Documenti Aggiunti" },
];

const EXT_CLS = {
  pdf:  "bg-red-100 text-red-700",
  docx: "bg-blue-100 text-blue-700",
  xlsx: "bg-green-100 text-green-700",
};

function DocRow({ doc, onDownload, onDelete }) {
  return (
    <tr className="border-b border-ink-100 last:border-0 hover:bg-ink-100/30">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${EXT_CLS[doc.ext] ?? "bg-ink-100 text-ink-500"}`}>{doc.ext}</span>
          <span className="text-[13px] text-ink-900">{doc.nome}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-[12px] text-ink-500">{doc.data}</td>
      <td className="px-4 py-3 text-[12px] text-ink-700">{doc.proprietario}</td>
      <td className="px-4 py-3 text-center">
        <button
          type="button"
          onClick={() => onDownload(doc)}
          aria-label={`Scarica ${doc.nome}`}
          className="text-brand-violet transition-colors hover:text-brand-violet-dark"
        >
          <IconDownload className="h-4 w-4" />
        </button>
      </td>
      <td className="px-4 py-3 text-center">
        <button
          type="button"
          onClick={() => onDelete(doc)}
          aria-label={`Elimina ${doc.nome}`}
          className="text-ink-300 transition-colors hover:text-red-500"
        >
          <IconTrash className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

const PAGE_SIZE = 5;

function todayLabel() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function extOf(name) {
  const m = /\.([a-z0-9]+)$/i.exec(name ?? "");
  return m ? m[1].toLowerCase() : "file";
}

function DocumentationSection({ ownerName }) {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [docs, setDocs] = useState(MOCK_DOCS);
  const [docTab, setDocTab] = useState("fascicolo");
  const [view, setView] = useState("lista");
  const [sortBy, setSortBy] = useState("data");
  const [page, setPage] = useState(1);
  const [confirmDel, setConfirmDel] = useState(null);

  function parseItalianDate(s) {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s ?? "");
    return m ? new Date(`${m[3]}-${m[2]}-${m[1]}`).getTime() : 0;
  }

  const sortedDocs = useMemo(() => {
    const list = docs.filter((doc) => {
      if (docTab === "precaricati") return doc.source === "precaricato";
      if (docTab === "aggiunti")    return doc.source === "aggiunto";
      return true; // fascicolo completo
    });
    if (sortBy === "nome") list.sort((a, b) => a.nome.localeCompare(b.nome, "it"));
    else if (sortBy === "proprietario") list.sort((a, b) => a.proprietario.localeCompare(b.proprietario, "it"));
    else list.sort((a, b) => parseItalianDate(b.data) - parseItalianDate(a.data));
    return list;
  }, [docs, sortBy, docTab]);

  const totalPages = Math.max(1, Math.ceil(sortedDocs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visibleDocs = sortedDocs.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [docs, page, totalPages]);

  useEffect(() => { setPage(1); }, [docTab]);

  function handleDownload(doc) {
    toast({
      title: "Download non disponibile nella demo",
      description: `Il documento "${doc.nome}" sarà scaricabile nella versione completa.`,
    });
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFiles(event) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const newDocs = files.map((file, idx) => ({
      id: `local-${Date.now()}-${idx}`,
      nome: file.name,
      data: todayLabel(),
      proprietario: ownerName || "Utente",
      ext: extOf(file.name),
      source: "aggiunto",
    }));
    setDocs((prev) => [...newDocs, ...prev]);
    setDocTab("aggiunti");
    toast({
      title: files.length === 1 ? "Documento caricato" : `${files.length} documenti caricati`,
      tone: "success",
    });
    event.target.value = "";
  }

  function confirmDelete() {
    if (!confirmDel) return;
    setDocs((prev) => prev.filter((d) => d.id !== confirmDel.id));
    toast({ title: "Documento eliminato", tone: "success" });
    setConfirmDel(null);
  }

  return (
    <div className="mt-10 pb-10">
      <h2 className="mb-4 text-[14px] font-bold text-ink-900">Documentazione di progetto</h2>

      <div className="overflow-hidden rounded border border-ink-100 bg-white">
        {/* Tabs */}
        <div className="flex border-b border-ink-100 px-5">
          {DOC_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setDocTab(t.id)}
              className={`-mb-px border-b-2 px-4 py-3 text-[13px] font-medium transition-colors ${
                docTab === t.id
                  ? "border-brand-violet text-brand-violet"
                  : "border-transparent text-ink-500 hover:text-ink-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 border-b border-ink-100 bg-white px-5 py-3">
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border border-ink-200 bg-white px-3 py-1.5 text-[12px] text-ink-700 focus:outline-none"
            >
              <option value="data">Ordina per: Data</option>
              <option value="nome">Ordina per: Nome</option>
              <option value="proprietario">Ordina per: Proprietario</option>
            </select>
            <div className="flex overflow-hidden rounded border border-ink-200">
              {["lista", "griglia"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 capitalize text-[12px] transition-colors ${
                    view === v ? "bg-brand-violet text-white" : "bg-white text-ink-500 hover:bg-ink-100/50"
                  }`}
                >
                  {v === "lista" ? "Lista" : "Griglia"}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex items-center gap-2 rounded bg-brand-violet px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-brand-violet-dark"
          >
            + Carica documento
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
        </div>

        {/* Document list / grid */}
        <div className="px-5 py-4">
        {sortedDocs.length === 0 ? (
          <div className="rounded border border-dashed border-ink-200 px-4 py-10 text-center text-[13px] text-ink-500">
            {docTab === "precaricati"
              ? "Nessun documento precaricato disponibile."
              : docTab === "aggiunti"
                ? <>Nessun documento aggiunto. Usa <span className="font-semibold">+ Carica documento</span> per aggiungerne.</>
                : "Il fascicolo è vuoto. Usa + Carica documento per aggiungere documenti."}
          </div>
        ) : view === "griglia" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visibleDocs.map((doc) => (
              <div key={doc.id} className="group flex flex-col gap-3 rounded-xl border border-ink-100 bg-white p-4 transition-shadow hover:shadow-md">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-[11px] font-bold uppercase ${EXT_CLS[doc.ext] ?? "bg-ink-100 text-ink-500"}`}>
                  {doc.ext}
                </div>
                <div className="flex-1">
                  <p className="line-clamp-2 text-[12px] font-semibold leading-snug text-ink-900">{doc.nome}</p>
                  <p className="mt-1 text-[11px] text-ink-400">{doc.data}</p>
                  <p className="text-[11px] text-ink-400">{doc.proprietario}</p>
                </div>
                <div className="flex items-center justify-between border-t border-ink-100 pt-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(doc)}
                    aria-label={`Scarica ${doc.nome}`}
                    className="text-brand-violet transition-colors hover:text-brand-violet-dark"
                  >
                    <IconDownload className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDel(doc)}
                    aria-label={`Elimina ${doc.nome}`}
                    className="text-ink-300 transition-colors hover:text-red-500"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="-mx-5 -my-4 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 bg-white">
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-500">Nome</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-500">Data</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-500">Proprietario</th>
                  <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-ink-500">Scarica</th>
                  <th className="px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-ink-500">Elimina</th>
                </tr>
              </thead>
              <tbody>
                {visibleDocs.map((doc) => (
                  <DocRow
                    key={doc.id}
                    doc={doc}
                    onDownload={handleDownload}
                    onDelete={(d) => setConfirmDel(d)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>

        {/* Pagination — inside card */}
        {sortedDocs.length > 0 && (
          <div className="flex items-center justify-between border-t border-ink-100 bg-white px-5 py-3 text-[12px] text-ink-500">
            <span>
              Visualizzazione {start + 1}–{Math.min(start + PAGE_SIZE, sortedDocs.length)} di {sortedDocs.length}{" "}
              {sortedDocs.length === 1 ? "documento" : "documenti"}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  aria-label="Pagina precedente"
                  className="rounded px-2 py-1 transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`rounded px-2.5 py-1 transition-colors ${
                      n === safePage
                        ? "bg-brand-violet font-semibold text-white"
                        : "hover:bg-ink-100"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  aria-label="Pagina successiva"
                  className="rounded px-2 py-1 transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {confirmDel && (
        <Modal
          title="Elimina documento"
          onClose={() => setConfirmDel(null)}
          onConfirm={confirmDelete}
          confirmLabel="Elimina"
        >
          <p className="text-sm text-ink-700">
            Vuoi eliminare <span className="font-semibold">{confirmDel.nome}</span>? L'operazione non è reversibile.
          </p>
        </Modal>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProjectDetail({
  project,
  analyses,
  results,
  onBack,
  onOpenEia,
  onOpenEcba,
  onOpenEsg,
  onEdit,
  onDuplicate,
  onDelete,
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showConfigAll, setShowConfigAll] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const p   = project || {};
  const cfg = p.configurazione || {};

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showOptions) return undefined;
    const onDocClick = () => setShowOptions(false);
    window.addEventListener("click", onDocClick);
    return () => window.removeEventListener("click", onDocClick);
  }, [showOptions]);

  function handleDownloadReport(analysisId) {
    toast({
      title: "Report non disponibile nella demo",
      description: `Il report dell'analisi ${analysisId.toUpperCase()} sarà esportabile (PDF + XLSX) nella versione completa.`,
    });
  }

  const stato = statusLabel(p.stato);

  if (isLoading) {
    return (
      <div className="px-4 py-8 md:px-10">
        <Skeleton className="h-3 w-56" />
        <Skeleton className="mt-4 h-8 w-72" />
        <SkeletonText lines={2} className="mt-3 max-w-3xl" />
        <div className="mt-6"><Skeleton className="h-32" /></div>
        <div className="mt-6 space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-10">
      {/* Breadcrumb */}
      <nav className="mb-3 flex items-center gap-1.5 text-[12px] text-ink-500">
        <button type="button" onClick={onBack} className="transition-colors hover:text-brand-violet">
          Valutazione
        </button>
        <span>›</span>
        <span className="text-ink-900">Dettaglio del progetto</span>
      </nav>

      {/* Meta line */}
      <p className="mb-5 text-[11px] text-ink-300">
        Creato il <span className="font-medium">12/05/2025</span> da OpenEconomics S.r.l — Ultima modifica il <span className="font-medium">15/05/2025</span>
      </p>

      {/* Header card — testata in stile Dettaglio DOCFAP: card bordata + meta-strip */}
      <div className="border border-ink-100 bg-white">
        <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start md:justify-between md:px-8">
          <div className="flex flex-1 items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-brand-violet/10 text-brand-violet">
              <IconValutazione className="h-8 w-8" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[22px] font-bold leading-snug text-ink-900">
                  {p.nome || "Progetto senza nome"}
                </h1>
                <span className="inline-flex items-center bg-brand-violet/15 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-brand-violet">
                  VALUTAZIONE
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 text-[12px] font-semibold ${stato.cls}`}>{stato.label}</span>
              </div>
              {p.cup && (
                <p className="mt-1.5 font-mono text-[13px] text-ink-500">{p.cup}</p>
              )}
              {p.descrizione && (
                <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink-700">{p.descrizione}</p>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowOptions((o) => !o)}
              className="flex items-center gap-2 border border-ink-100 px-4 py-2 text-[13px] font-medium text-ink-700 transition-colors hover:bg-ink-100/50"
            >
              Opzioni
              <IconChevronDown className="h-3.5 w-3.5 text-ink-300" />
            </button>
            {showOptions && (
              <div className="absolute right-0 top-full z-10 mt-1 w-48 overflow-hidden rounded border border-ink-100 bg-white shadow-lg">
              <button
                type="button"
                onClick={() => { setShowOptions(false); onEdit?.(); }}
                disabled={!onEdit}
                className="w-full px-4 py-2.5 text-left text-[13px] text-ink-700 transition-colors hover:bg-ink-100/50 disabled:cursor-not-allowed disabled:text-ink-300"
              >
                Modifica progetto
              </button>
              <button
                type="button"
                onClick={() => { setShowOptions(false); onDuplicate?.(); }}
                disabled={!onDuplicate}
                className="w-full px-4 py-2.5 text-left text-[13px] text-ink-700 transition-colors hover:bg-ink-100/50 disabled:cursor-not-allowed disabled:text-ink-300"
              >
                Duplica progetto
              </button>
              <button
                type="button"
                onClick={() => { setShowOptions(false); setConfirmDelete(true); }}
                disabled={!onDelete}
                className="w-full border-t border-ink-100 px-4 py-2.5 text-left text-[13px] text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:text-ink-300"
              >
                Elimina progetto
              </button>
            </div>
          )}
          </div>
        </div>

        {/* Meta-strip — sintesi in stile Dettaglio DOCFAP */}
        <div className="grid grid-cols-1 divide-y divide-ink-100 border-t border-ink-100 bg-white text-sm sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {[
            ["Settore", cfg.settore, false],
            ["Categoria di intervento", cfg.categoria_intervento, false],
            ["CAPEX", fmtCurrency(cfg.capex), true],
            ["OPEX annuo", fmtCurrency(cfg.opex), true],
          ].map(([label, value, highlight]) => (
            <div key={label} className="px-6 py-4">
              <p className="text-[11px] font-medium text-ink-400">{label}</p>
              <p className={`mt-0.5 text-[13px] font-semibold ${highlight ? "text-brand-violet" : "text-ink-900"}`}>
                {value || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Config block */}
      <div className="mt-8 overflow-hidden border border-ink-100 bg-white">
        <div className="flex items-center justify-between border-b border-ink-100 bg-white px-6 py-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Dati della configurazione</p>
          <button
            type="button"
            onClick={() => setShowConfigAll((v) => !v)}
            className="text-[12px] font-medium text-brand-violet transition-colors hover:text-brand-violet-dark"
          >
            {showConfigAll ? "Mostra essenziali ↑" : "Vedi maggiori dettagli →"}
          </button>
        </div>
        <div className="grid grid-cols-1 divide-y divide-ink-100 bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
          {[
            [
              ["Settore",                cfg.settore],
              ["Sotto-settore",          cfg.sotto_settore],
              ["Categoria di intervento", cfg.categoria_intervento],
            ],
            [
              ["Tipo di intervento", cfg.tipo_intervento],
              ["Durata del progetto", cfg.durata_progetto || (cfg.vita_utile ? `${cfg.vita_utile} anni` : null)],
              ["Localizzazione",      cfg.nuts_label || cfg.localizzazione],
            ],
            [
              ["Anno di attualizzazione", cfg.anno_attualizzazione],
              ["CAPEX",                   fmtCurrency(cfg.capex)],
              ["OPEX annuo",              fmtCurrency(cfg.opex)],
            ],
          ].map((col, ci) => (
            <div key={ci} className="divide-y divide-ink-100">
              {col.map(([label, value]) => (
                <div key={label} className="px-6 py-4">
                  <p className="text-[11px] font-medium text-ink-400">{label}</p>
                  <p className="mt-0.5 text-[13px] font-semibold text-ink-900">{value || "—"}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        {showConfigAll && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-ink-100 bg-white px-6 py-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["NACE", cfg.nace_code],
              ["Tasso attualizzazione", cfg.tasso_attualizzazione != null ? `${cfg.tasso_attualizzazione}%` : null],
              ["NUTS", cfg.nuts_code],
              ["Latitudine", cfg.lat != null ? Number(cfg.lat).toFixed(4) : null],
              ["Longitudine", cfg.lon != null ? Number(cfg.lon).toFixed(4) : null],
              ["Data inizio", cfg.data_inizio],
              ["Data fine", cfg.data_fine],
              ["Vita utile", cfg.vita_utile ? `${cfg.vita_utile} anni` : null],
              ["Tasso OPEX su CAPEX", cfg.opex_tasso != null ? `${cfg.opex_tasso}%` : null],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[11px] font-medium text-ink-500">{label}</p>
                <p className="mt-0.5 text-[12px] font-mono text-ink-700">{value || "—"}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analysis cards */}
      <div className="mt-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-ink-900">Le analisi del progetto</h2>
            <p className="mt-0.5 text-[12px] text-ink-500">Espandi una card per visualizzare il riepilogo dei risultati.</p>
          </div>
        </div>
        <div className="space-y-4">
          <AnalysisCard id="eia"  analysis={analyses?.eia}  results={results} onOpen={onOpenEia}  onDownloadReport={handleDownloadReport} settoreSpesa={cfg.settore} />
          <AnalysisCard id="ecba" analysis={analyses?.ecba} results={results} onOpen={onOpenEcba} onDownloadReport={handleDownloadReport} />
          <AnalysisCard id="esg"  analysis={analyses?.esg}  results={results} onOpen={onOpenEsg}  onDownloadReport={handleDownloadReport} />
        </div>
      </div>

      {/* Documentation */}
      <DocumentationSection ownerName={p.proprietario || "Mario Rossi"} />

      {confirmDelete && (
        <Modal
          title="Elimina progetto"
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => { setConfirmDelete(false); onDelete?.(); }}
          confirmLabel="Elimina"
        >
          <p className="text-sm text-ink-700">
            Vuoi eliminare il progetto <span className="font-semibold">{p.nome || "senza nome"}</span> e tutte le sue analisi? L'operazione non è reversibile.
          </p>
        </Modal>
      )}
    </div>
  );
}
