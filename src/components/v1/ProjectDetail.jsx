import { useState, useEffect } from "react";
import { Skeleton, SkeletonText } from "../ui/Skeleton";
import { Badge } from "../ui/Badge";
import { ImpactIcon } from "../ui/ImpactIcon";

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
    Approvato: { label: "Approvato", cls: "bg-green-50 text-green-700 border border-green-200" },
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

function EiaKpiCards({ eia }) {
  const r = eia ?? {};
  const kpis = [
    { label: "Spese attivate",          icon: "spese",       value: fmtM(r.shock_totale),       sub: "valore attuale" },
    { label: "Valore della produzione", icon: "produzione",  value: fmtM(r.produzione?.totale), sub: "valore attuale" },
    { label: "PIL",                     icon: "pil",         value: fmtM(r.gva?.totale),        sub: "valore attuale" },
    { label: "Occupazione",             icon: "occupazione", value: r.fte?.totale ? `${fmtIT(r.fte.totale, 0)} ETP` : "—", sub: "valore attuale" },
    { label: "Redditi",                 icon: "redditi",     value: fmtM(r.redditi?.totale),    sub: "valore attuale" },
    { label: "Gettito fiscale",         icon: "gettito",     value: fmtM(r.gettito?.totale),    sub: "valore attuale" },
  ];

  const topSettore = r.per_settore?.[0]?.settore ?? null;
  const topRegione = r.per_territorio?.[0]?.regione ?? null;
  const molt = r.moltiplicatore != null ? `${fmtIT(r.moltiplicatore, 2)}×` : null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.label} className="rounded border border-ink-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start gap-2">
              <ImpactIcon type={k.icon} label={k.label} className="h-6 w-6" wrapperClassName="flex h-6 w-6 shrink-0 items-center justify-center text-brand-violet" />
              <p className="min-w-0 text-[11px] font-bold uppercase leading-tight tracking-wide text-ink-700">{k.label}</p>
            </div>
            <p className="text-[22px] font-bold leading-tight text-ink-900">{k.value}</p>
            <p className="mt-1 text-[11px] text-ink-400">{k.sub}</p>
          </div>
        ))}
      </div>
      {(molt || topSettore || topRegione) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {molt && (
            <span className="flex items-center gap-1.5 rounded-full border border-ink-100 bg-white px-3 py-1 text-[12px]">
              <span className="font-bold text-brand-violet">{molt}</span>
              <span className="text-ink-400">moltiplicatore PIL</span>
            </span>
          )}
          {topSettore && (
            <span className="flex items-center gap-1.5 rounded-full border border-ink-100 bg-white px-3 py-1 text-[12px]">
              <span className="text-ink-400">Settore principale:</span>
              <span className="font-semibold text-ink-800">{topSettore}</span>
            </span>
          )}
          {topRegione && (
            <span className="flex items-center gap-1.5 rounded-full border border-ink-100 bg-white px-3 py-1 text-[12px]">
              <span className="text-ink-400">Regione maggiormente impattata:</span>
              <span className="font-semibold text-ink-800">{topRegione}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── ECBA indicator grid ───────────────────────────────────────────────────────

function EcbaRows({ ecba }) {
  const r = ecba ?? {};
  const bcr = r.bcr ?? (r.benefici_totali && r.costi_totali ? r.benefici_totali / r.costi_totali : null);
  const rows = [
    { label: "Benefici economici", value: r.benefici_totali ? `€ ${fmtIT(r.benefici_totali)}` : "—", tone: "green" },
    { label: "Costi economici",    value: r.costi_totali    ? `€ ${fmtIT(r.costi_totali)}`    : "—", tone: "red" },
    { label: "VANE",               value: r.van != null     ? `€ ${fmtIT(r.van)}`             : "—", tone: r.van != null ? (r.van >= 0 ? "green" : "red") : null },
    { label: "Payback period",     value: r.payback_period  ? `${r.payback_period} anni`       : "—", tone: null },
    { label: "Rapporto B/C",       value: bcr               ? fmtIT(bcr, 2)                   : "—", tone: bcr != null ? (bcr >= 1 ? "green" : "red") : null },
    { label: "TIRE",               value: r.irr != null     ? `${fmtIT(r.irr, 2)}%`           : "—", tone: null },
  ];
  return (
    <div className="ml-auto w-full max-w-sm space-y-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3">
          <span className="text-[13px] text-ink-700">{row.label}</span>
          <span className={`shrink-0 rounded px-3 py-1 font-mono text-[12px] font-bold ${
            row.tone === "green" ? "bg-green-100 text-green-800" :
            row.tone === "red"   ? "bg-red-100 text-red-700" :
                                   "bg-accent-lime text-ink-900"
          }`}>{row.value}</span>
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

function AnalysisCard({ id, analysis, results, onOpen }) {
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
              <button type="button" className="text-[12px] font-medium text-brand-violet hover:underline">
                Scarica Report, Metodologia e Fonti
              </button>
              <svg className="h-3.5 w-3.5 text-brand-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {id === "eia"  && <EiaKpiCards     eia={results.eia} />}
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
  { id: 1, nome: "Piano di Fattibilità Tecnica.pdf",       data: "12/03/2025", proprietario: "Mario Rossi",   ext: "pdf"  },
  { id: 2, nome: "Progetto Definitivo.pdf",                data: "15/03/2025", proprietario: "Luigi Bianchi", ext: "pdf"  },
  { id: 3, nome: "Analisi Ambientale Preliminare.docx",    data: "18/03/2025", proprietario: "Sara Verdi",    ext: "docx" },
  { id: 4, nome: "Relazione Tecnica Descrittiva.pdf",      data: "20/03/2025", proprietario: "Mario Rossi",   ext: "pdf"  },
  { id: 5, nome: "Computo Metrico Estimativo.xlsx",        data: "22/03/2025", proprietario: "Anna Neri",     ext: "xlsx" },
];

const EXT_CLS = {
  pdf:  "bg-red-100 text-red-700",
  docx: "bg-blue-100 text-blue-700",
  xlsx: "bg-green-100 text-green-700",
};

function DocRow({ doc }) {
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
        <button type="button" className="text-brand-violet transition-colors hover:text-brand-violet-dark">
          <IconDownload className="h-4 w-4" />
        </button>
      </td>
      <td className="px-4 py-3 text-center">
        <button type="button" className="text-ink-300 transition-colors hover:text-red-500">
          <IconTrash className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

function DocumentationSection() {
  const [docTab, setDocTab] = useState("caricati");
  const [view, setView] = useState("lista");

  return (
    <div className="mt-10 pb-10">
      <h2 className="text-[14px] font-bold text-ink-900">Documentazione di progetto</h2>

      {/* Tabs */}
      <div className="mt-4 flex border-b border-ink-100">
        {[
          { id: "caricati", label: "Documenti caricati" },
          { id: "prodotti", label: "Documenti prodotti da OpenEconomics" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setDocTab(t.id)}
            className={`-mb-px border-b-2 px-5 py-2.5 text-[13px] font-medium transition-colors ${
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
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select className="rounded border border-ink-100 px-3 py-1.5 text-[12px] text-ink-700 focus:outline-none">
            <option>Ordina per: Data</option>
            <option>Ordina per: Nome</option>
            <option>Ordina per: Proprietario</option>
          </select>
          <div className="flex overflow-hidden rounded border border-ink-100">
            {["lista", "griglia"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`px-3 py-1.5 capitalize text-[12px] transition-colors ${
                  view === v ? "bg-ink-900 text-white" : "bg-white text-ink-500 hover:bg-ink-100/50"
                }`}
              >
                {v === "lista" ? "Lista" : "Griglia"}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded bg-brand-violet px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-brand-violet-dark"
        >
          + Carica documento
        </button>
      </div>

      {/* Document list / grid */}
      <div className="mt-4">
        {docTab !== "caricati" ? (
          <div className="overflow-hidden rounded border border-ink-100 bg-white px-4 py-10 text-center text-[13px] text-ink-300">
            Nessun documento prodotto da OpenEconomics disponibile.
          </div>
        ) : view === "griglia" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {MOCK_DOCS.map((doc) => (
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
                  <button type="button" className="text-brand-violet transition-colors hover:text-brand-violet-dark">
                    <IconDownload className="h-4 w-4" />
                  </button>
                  <button type="button" className="text-ink-300 transition-colors hover:text-red-500">
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded border border-ink-100 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-100/40">
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-500">Nome</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-500">Data</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-500">Proprietario</th>
                  <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-ink-500">Scarica</th>
                  <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-ink-500">Elimina</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DOCS.map((doc) => <DocRow key={doc.id} doc={doc} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {docTab === "caricati" && (
        <div className="mt-4 flex items-center justify-between text-[12px] text-ink-500">
          <span>Visualizzazione 1–5 di 5 documenti</span>
          <div className="flex items-center gap-1">
            <button type="button" className="rounded px-2 py-1 hover:bg-ink-100">‹</button>
            <button type="button" className="rounded bg-brand-violet px-2.5 py-1 font-semibold text-white">1</button>
            <button type="button" className="rounded px-2 py-1 hover:bg-ink-100">2</button>
            <button type="button" className="rounded px-2 py-1 hover:bg-ink-100">3</button>
            <button type="button" className="rounded px-2 py-1 hover:bg-ink-100">›</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProjectDetail({ project, analyses, results, onBack, onOpenEia, onOpenEcba, onOpenEsg }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const p   = project || {};
  const cfg = p.configurazione || {};

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

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

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <h1 className="text-[22px] font-bold leading-snug text-ink-900">
            {p.nome || "Progetto senza nome"}
          </h1>
          {p.cup && (
            <p className="mt-1 font-mono text-[13px] text-ink-500">{p.cup}</p>
          )}
          {p.descrizione && (
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink-700">{p.descrizione}</p>
          )}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[13px] text-ink-500">Stato del progetto:</span>
            <span className={`px-3 py-1 text-[12px] font-semibold ${stato.cls}`}>{stato.label}</span>
          </div>
        </div>

        {/* Options */}
        <div className="relative shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOptions((o) => !o)}
              className="flex items-center gap-2 rounded border border-ink-100 px-4 py-2 text-[13px] font-medium text-ink-700 transition-colors hover:bg-ink-100/50"
            >
              Opzioni
              <IconChevronDown className="h-3.5 w-3.5 text-ink-300" />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded border border-ink-100 text-[18px] text-ink-500 transition-colors hover:bg-ink-100/50"
            >
              ···
            </button>
          </div>
          {showOptions && (
            <div className="absolute right-0 top-full z-10 mt-1 w-48 overflow-hidden rounded border border-ink-100 bg-white shadow-lg">
              <button type="button" className="w-full px-4 py-2.5 text-left text-[13px] text-ink-700 hover:bg-ink-100/50">Modifica progetto</button>
              <button type="button" className="w-full px-4 py-2.5 text-left text-[13px] text-ink-700 hover:bg-ink-100/50">Duplica progetto</button>
              <button type="button" className="w-full border-t border-ink-100 px-4 py-2.5 text-left text-[13px] text-red-600 hover:bg-red-50">Elimina progetto</button>
            </div>
          )}
        </div>
      </div>

      {/* Config block */}
      <div className="mt-8 overflow-hidden rounded border border-ink-100">
        <div className="flex items-center justify-between bg-[#2f2f2f] px-5 py-3">
          <h2 className="text-[13px] font-bold text-white">Dati della configurazione</h2>
          <button type="button" className="text-[12px] text-white/60 transition-colors hover:text-white">
            Vedi maggiori dettagli →
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
                <div key={label} className="px-5 py-3">
                  <p className="text-[11px] font-medium text-ink-300">{label}</p>
                  <p className="mt-0.5 text-[13px] font-semibold text-ink-900">{value || "—"}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
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
          <AnalysisCard id="eia"  analysis={analyses?.eia}  results={results} onOpen={onOpenEia}  />
          <AnalysisCard id="ecba" analysis={analyses?.ecba} results={results} onOpen={onOpenEcba} />
          <AnalysisCard id="esg"  analysis={analyses?.esg}  results={results} onOpen={onOpenEsg}  />
        </div>
      </div>

      {/* Documentation */}
      <DocumentationSection />
    </div>
  );
}
