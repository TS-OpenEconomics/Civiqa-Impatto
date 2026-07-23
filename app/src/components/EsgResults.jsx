import { useMemo, useState } from "react";
import { Badge } from "./ui/Badge";
import { useToast } from "../hooks/useToast";

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

function RatingBadge({ rating, size = "md" }) {
  const cls = getRatingColor(rating);
  const sizeMap = { sm: "w-8 h-8 text-sm", md: "w-12 h-12 text-base", lg: "w-16 h-16 text-xl" };
  return (
    <span className={`${sizeMap[size]} ${cls} rounded text-white font-bold flex items-center justify-center`}>
      {rating || "—"}
    </span>
  );
}

function ComplianceBar({ aligned, partial, nonAligned }) {
  const total = aligned + partial + nonAligned;
  if (!total) return null;
  const a = (aligned / total) * 100;
  const p = (partial / total) * 100;
  const n = (nonAligned / total) * 100;
  return (
    <div>
      <div className="flex h-5 rounded overflow-hidden">
        <div className="bg-green-500" style={{ width: `${a}%` }} />
        <div className="bg-amber-400" style={{ width: `${p}%` }} />
        <div className="bg-red-400" style={{ width: `${n}%` }} />
      </div>
      <div className="flex gap-4 mt-2 text-xs text-ink-700">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{Math.round(a)}% Allineato</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{Math.round(p)}% Parzialmente allineato</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />{Math.round(n)}% Non allineato</span>
      </div>
    </div>
  );
}

function buildResults(esgResults) {
  if (esgResults) return esgResults;
  return {
    score: 53.6,
    rating: "A",
    environmental_score: 51,
    environmental_rating: "A+",
    social_score: 62,
    social_rating: "A+",
    governance_score: 46,
    governance_rating: "BBB",
    aligned_count: 35,
    partial_count: 39,
    non_aligned_count: 34,
    pillars: {
      environmental: { score: 51, rating: "A+", aligned: 12, partial: 14, non_aligned: 11 },
      social: { score: 62, rating: "A+", aligned: 14, partial: 15, non_aligned: 9 },
      governance: { score: 46, rating: "BBB", aligned: 9, partial: 10, non_aligned: 14 },
    },
  };
}

const TABS = [
  { id: "riepilogo", label: "Riepilogo" },
  { id: "environmental", label: "Environmental" },
  { id: "social", label: "Social" },
  { id: "governance", label: "Governance" },
];

const PILLAR_LETTERS = { environmental: "E", social: "S", governance: "G" };

// Nomi brevi dei 17 Obiettivi di Sviluppo Sostenibile (Agenda 2030).
const SDG_LABELS = {
  1: "Sconfiggere la povertà",
  2: "Sconfiggere la fame",
  3: "Salute e benessere",
  4: "Istruzione di qualità",
  5: "Parità di genere",
  6: "Acqua pulita e servizi igienico-sanitari",
  7: "Energia pulita e accessibile",
  8: "Lavoro dignitoso e crescita economica",
  9: "Imprese, innovazione e infrastrutture",
  10: "Ridurre le disuguaglianze",
  11: "Città e comunità sostenibili",
  12: "Consumo e produzione responsabili",
  13: "Lotta contro il cambiamento climatico",
  14: "Vita sott'acqua",
  15: "Vita sulla terra",
  16: "Pace, giustizia e istituzioni solide",
  17: "Partnership per gli obiettivi",
};

// Barra percentuale a 5 fasce (0-10 / 10-30 / 30-50 / 50-60 / 60-100), coerente con
// la legenda di materialità dei mockup.
function PctBar({ pct }) {
  const v = Math.min(100, Math.max(0, pct));
  const color = v >= 60 ? "bg-green-500" : v >= 50 ? "bg-lime-400" : v >= 30 ? "bg-amber-400" : v >= 10 ? "bg-orange-400" : "bg-red-400";
  return (
    <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${v}%` }} />
    </div>
  );
}

// ESG_2 — Compliance ESG: barra complessiva + selettore dimensione E/S/G.
function ComplianceSection({ compliance }) {
  const [dim, setDim] = useState("overall");
  const dims = [
    { id: "overall", label: "Complessiva" },
    { id: "E", label: "Environmental" },
    { id: "S", label: "Social" },
    { id: "G", label: "Governance" },
  ];
  const c = compliance[dim] ?? compliance.overall;
  return (
    <div>
      <h3 className="text-sm font-bold text-ink-900 mb-3">Compliance ESG</h3>
      <div className="flex flex-wrap gap-1 mb-4">
        {dims.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDim(d.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              dim === d.id ? "bg-brand-violet text-white" : "text-ink-500 hover:bg-ink-100"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <ComplianceBar aligned={c.aligned} partial={c.partial} nonAligned={c.non} />
      <p className="mt-4 text-xs text-ink-600 leading-relaxed max-w-3xl">
        Il grafico mostra il livello di conformità del progetto agli standard ESG, come distribuzione
        percentuale tra aspetti <strong>allineati</strong>, <strong>parzialmente allineati</strong> e{" "}
        <strong>non allineati</strong>. La fascia colorata indica quanto ciascuna categoria incide sul totale.
      </p>
    </div>
  );
}

// ESG_3 — Contributo alla materialità: 3 colonne E/S/G con % per sotto-tema.
function MaterialitySection({ materiality }) {
  const cols = [
    { key: "E", label: "Environmental" },
    { key: "S", label: "Social" },
    { key: "G", label: "Governance" },
  ];
  return (
    <div>
      <h3 className="text-sm font-bold text-ink-900 mb-1">Contributo alla materialità</h3>
      <p className="text-xs text-ink-600 leading-relaxed max-w-3xl mb-4">
        Quanto il progetto incide sui temi ESG più rilevanti (&laquo;materiali&raquo;). I punteggi sono in
        % e indicano la rilevanza rispetto a ciascun sotto-tema: da impatto nullo (0-10%) a impatto molto
        elevato (60-100%).
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {cols.map((col) => (
          <div key={col.key}>
            <p className="text-xs font-bold text-ink-900 mb-3">{col.label}</p>
            <div className="space-y-3">
              {(materiality[col.key] ?? []).map((it) => (
                <div key={it.label}>
                  <div className="flex justify-between items-baseline gap-2 mb-1">
                    <span className="text-[11px] text-ink-700 leading-tight">{it.label}</span>
                    <span className="text-xs font-bold text-ink-900">{it.pct}%</span>
                  </div>
                  <PctBar pct={it.pct} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Colori ufficiali dei 17 SDG.
const SDG_COLORS = {
  1: "#E5243B", 2: "#DDA63A", 3: "#4C9F38", 4: "#C5192D", 5: "#FF3A21", 6: "#26BDE2",
  7: "#FCC30B", 8: "#A21942", 9: "#FD6925", 10: "#DD1367", 11: "#FD9D24", 12: "#BF8B2E",
  13: "#3F7E44", 14: "#0A97D9", 15: "#56C02B", 16: "#00689D", 17: "#19486A",
};
const two = (g) => String(g).padStart(2, "0");

function sdgPolar(cx, cy, r, a) {
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
// Path di un settore anulare (r0..r1, a0..a1).
function sdgSector(cx, cy, r0, r1, a0, a1) {
  const [x0, y0] = sdgPolar(cx, cy, r1, a0);
  const [x1, y1] = sdgPolar(cx, cy, r1, a1);
  const [x2, y2] = sdgPolar(cx, cy, r0, a1);
  const [x3, y3] = sdgPolar(cx, cy, r0, a0);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x0.toFixed(2)},${y0.toFixed(2)} A${r1},${r1} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} L${x2.toFixed(2)},${y2.toFixed(2)} A${r0},${r0} 0 ${large} 0 ${x3.toFixed(2)},${y3.toFixed(2)} Z`;
}

// Ruota SDG: 17 spicchi colorati (raggio ∝ punteggio), selezione con centro attivo.
function SdgWheel({ sdg, selected, onSelect }) {
  const items = [...(sdg ?? [])].sort((a, b) => a.goal - b.goal);
  const n = 17;
  const S = 460, cx = S / 2, cy = S / 2, r0 = 72, rMax = 196;
  const step = (Math.PI * 2) / n;
  const gap = 0.014;
  const sel = items.find((x) => x.goal === selected);
  const [nm1, nm2] = twoLines(SDG_LABELS[selected] || "");
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full max-w-[460px]" role="img" aria-label="Ruota degli Obiettivi di Sviluppo Sostenibile">
      <text x={cx} y={16} textAnchor="middle" style={{ fontSize: "12px", fontWeight: 700, fill: "#5A5A60" }}>Società</text>
      <text x={S - 4} y={cy} textAnchor="end" style={{ fontSize: "12px", fontWeight: 700, fill: "#5A5A60" }}>Persone</text>
      <text x={cx} y={S - 6} textAnchor="middle" style={{ fontSize: "12px", fontWeight: 700, fill: "#5A5A60" }}>Economia</text>
      <text x={4} y={cy} textAnchor="start" style={{ fontSize: "12px", fontWeight: 700, fill: "#5A5A60" }}>Ambiente</text>
      {items.map((it, i) => {
        const a0 = -Math.PI / 2 + i * step + gap;
        const a1 = -Math.PI / 2 + (i + 1) * step - gap;
        const r1 = r0 + Math.max(6, ((it.score ?? 0) / 100) * (rMax - r0));
        const dim = selected != null && selected !== it.goal;
        const isSel = selected === it.goal;
        const [lx, ly] = sdgPolar(cx, cy, rMax + 12, (a0 + a1) / 2);
        return (
          <g key={it.goal} onClick={() => onSelect(isSel ? null : it.goal)} style={{ cursor: "pointer" }}>
            <path
              d={sdgSector(cx, cy, r0, r1, a0, a1)}
              fill={SDG_COLORS[it.goal] ?? "#999"}
              opacity={dim ? 0.22 : 1}
              stroke={isSel ? "#2E0B86" : "#fff"}
              strokeWidth={isSel ? 3 : 1}
            />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fontWeight: 700, fill: dim ? "#c8c8cc" : "#5A5A60" }}>{two(it.goal)}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={r0 - 8} fill="#fff" stroke="#e5e5e8" />
      {sel ? (
        <text x={cx} y={cy} textAnchor="middle" style={{ fontSize: "10px", fill: "#0E0E10" }}>
          <tspan x={cx} dy="-16" style={{ fontWeight: 700 }}>{nm1}</tspan>
          {nm2 && <tspan x={cx} dy="12" style={{ fontWeight: 700 }}>{nm2}</tspan>}
          <tspan x={cx} dy="16" style={{ fill: "#7B7B82", fontSize: "9px" }}>Punteggio</tspan>
          <tspan x={cx} dy="15" style={{ fontWeight: 800, fontSize: "16px", fill: "#2E0B86" }}>{sel.score}</tspan>
        </text>
      ) : (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "11px", fill: "#7B7B82" }}>Seleziona un obiettivo</text>
      )}
    </svg>
  );
}

// Lista SDG a destra: card con punteggio, espandibile sui sotto-indicatori.
function SdgList({ sdg, selected, onSelect }) {
  const items = [...(sdg ?? [])].sort((a, b) => a.goal - b.goal);
  return (
    <div className="border border-ink-100 rounded max-h-[460px] overflow-y-auto divide-y divide-ink-100">
      {items.map((it) => {
        const isSel = selected === it.goal;
        const dim = selected != null && !isSel;
        return (
          <div key={it.goal} className={dim ? "opacity-50" : ""}>
            <button
              type="button"
              onClick={() => onSelect(isSel ? null : it.goal)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-ink-50"
              aria-expanded={isSel}
            >
              <span className="w-9 h-9 shrink-0 rounded text-white text-xs font-bold flex items-center justify-center" style={{ background: SDG_COLORS[it.goal] }}>
                {two(it.goal)}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[11px] text-ink-500 leading-tight">{two(it.goal)} {SDG_LABELS[it.goal]}</span>
                <span className="block text-sm font-bold text-ink-900">Punteggio totale: {it.score}</span>
              </span>
              <span className="shrink-0 text-xs text-ink-400">{isSel ? "▲" : "▼"}</span>
            </button>
            {isSel && (it.indicators?.length ?? 0) > 0 && (
              <div className="px-3 pb-3 border-t border-ink-100 divide-y divide-ink-100">
                {it.indicators.map((ind) => (
                  <div key={ind.label} className="flex items-center justify-between gap-3 py-2">
                    <span className="text-[11px] text-ink-700 leading-tight">{ind.label}</span>
                    <span className="shrink-0 text-xs font-bold text-ink-900">{two(ind.value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ESG_4 — SDG: ruota radiale interattiva + lista sincronizzata.
function SdgSection({ sdg }) {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <h3 className="text-sm font-bold text-ink-900 mb-1">Obiettivi di sviluppo sostenibile (SDG)</h3>
      <p className="text-xs text-ink-600 leading-relaxed max-w-3xl mb-4">
        Contributo del progetto ai 17 Obiettivi di Sviluppo Sostenibile dell'Agenda 2030. Ogni spicchio
        dell'anello mostra il punteggio dell'obiettivo (0-100); seleziona uno spicchio o una voce in elenco
        per approfondire i sotto-indicatori.
      </p>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] items-start">
        <div className="flex justify-center">
          <SdgWheel sdg={sdg} selected={selected} onSelect={setSelected} />
        </div>
        <SdgList sdg={sdg} selected={selected} onSelect={setSelected} />
      </div>
    </div>
  );
}

// Colore badge per livello di allineamento di un criterio.
function livColor(liv) {
  const s = String(liv || "");
  if (s.startsWith("Allineato")) return "bg-green-100 text-green-700";
  if (s.startsWith("Parzial")) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function truncLabel(s, n = 22) {
  const t = String(s || "");
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

// Etichette brevi per gli assi del radar (i nomi estesi dei sotto-temi non ci stanno).
const RADAR_SHORT = {
  "Uso delle risorse del territorio e del capitale naturale": "Uso risorse territorio",
  "Emissioni e innovazione": "Emissioni e innovazione",
  "Economia circolare e rifiuti": "Economia circolare",
  "Mitigazione dei rischi ambientali": "Mitigazione rischi",
  "Qualità del lavoro e occupazione": "Lavoro e occupazione",
  "Inclusione e parità di genere": "Inclusione e genere",
  "Relazioni con la comunità e beneficiari": "Comunità e beneficiari",
  "Salute e sicurezza": "Salute e sicurezza",
  "Trasparenza e rendicontazione": "Trasparenza",
  "Integrità e gestione responsabile": "Integrità",
  "Coinvolgimento stakeholder": "Stakeholder",
  "Monitoraggio e controllo": "Monitoraggio",
};

// Divide un'etichetta breve su max 2 righe bilanciate.
function twoLines(s) {
  const w = String(s || "").split(" ");
  if (w.length <= 1) return [s, ""];
  const mid = Math.ceil(w.length / 2);
  return [w.slice(0, mid).join(" "), w.slice(mid).join(" ")];
}

// Radar SVG dei sotto-temi (N assi, punteggio 0-100). Autoconsistente.
function SubThemeRadar({ items }) {
  const n = items.length;
  if (!n) return null;
  const W = 460, H = 380, cx = W / 2, cy = H / 2, R = 140;
  const ang = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, r) => [cx + Math.cos(ang(i)) * R * r, cy + Math.sin(ang(i)) * R * r];
  const rings = [0.25, 0.5, 0.75, 1];
  const shape = items.map((it, i) => pt(i, Math.min(1, Math.max(0, (it.score ?? 0) / 100))).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Radar dei sotto-temi">
      {rings.map((r) => (
        <polygon key={r} points={items.map((_, i) => pt(i, r).join(",")).join(" ")} fill="none" stroke="#e5e5e8" strokeWidth="1" />
      ))}
      {items.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e5e5e8" strokeWidth="1" />;
      })}
      <polygon points={shape} fill="rgba(91,33,247,0.15)" stroke="#5B21F7" strokeWidth="2" />
      {items.map((it, i) => {
        const [x, y] = pt(i, 1.05);
        const anchor = x < cx - 5 ? "end" : x > cx + 5 ? "start" : "middle";
        const [l1, l2] = twoLines(RADAR_SHORT[it.label] || truncLabel(it.label, 20));
        return (
          <text key={i} x={x} y={y} textAnchor={anchor} dominantBaseline="middle" style={{ fontSize: "11px", fill: "#5A5A60" }}>
            <tspan x={x} dy="-9" style={{ fontWeight: 800, fill: "#0E0E10", fontSize: "13px" }}>{it.score}</tspan>
            <tspan x={x} dy="14">{l1}</tspan>
            {l2 && <tspan x={x} dy="12">{l2}</tspan>}
          </text>
        );
      })}
    </svg>
  );
}

// Pannello espandibile di un sotto-tema: criteri con % + livello + raccomandazione.
function SubThemePanel({ st }) {
  const [open, setOpen] = useState(false);
  const critCount = (st.criteria || []).filter((c) => c.critical).length;
  return (
    <div className="border border-ink-100 rounded">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-ink-50"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-ink-900">{st.label}</span>
        <span className="flex items-center gap-3 shrink-0">
          <span className={`text-xs font-medium flex items-center gap-1 ${critCount > 0 ? "text-red-600" : "text-green-600"}`}>
            {critCount > 0 ? "⚠" : "✓"} Sotto-temi critici: {critCount}/{(st.criteria || []).length}
          </span>
          <span className="text-ink-400 text-xs">{open ? "▲" : "▼"}</span>
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-3 space-y-3 border-t border-ink-100">
          {(st.criteria || []).map((c) => (
            <div key={c.label} className="grid gap-2 md:grid-cols-[minmax(0,240px)_1fr] border border-ink-100 rounded p-3">
              <div>
                <p className="text-sm font-semibold text-ink-900 mb-1.5 leading-tight">{c.label}</p>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${livColor(c.livello)}`}>
                  {c.valuePct}% · {c.livello}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-500 mb-1 flex items-center gap-2">
                  Raccomandazione
                  {c.critical && <span className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded text-[10px] font-bold">Critico ⚠</span>}
                </p>
                <p className="text-xs text-ink-700 leading-relaxed">{c.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function EsgResults({ project, esgResults, onBack }) {
  const [tab, setTab] = useState("riepilogo");
  const [ratingView, setRatingView] = useState("grafico");
  const { toast } = useToast();
  const r = useMemo(() => buildResults(esgResults), [esgResults]);
  const p = project || {};

  function handleDownload() {
    toast({ title: "Download avviato", description: "Il report verrà scaricato a breve." });
  }

  const ratingIdx = RATING_SCALE.indexOf(r.rating);

  return (
    <div className="px-4 py-6 md:px-8">
      {/* Breadcrumbs */}
      <nav className="text-xs text-ink-400 flex flex-wrap items-center gap-1.5 mb-4">
        <span>•••</span>
        <span>›</span>
        <button type="button" onClick={onBack} className="hover:text-brand-violet transition-colors">
          Dettaglio del progetto
        </button>
        <span>›</span>
        <span className="text-ink-700 font-medium">Risultato ESG Asset</span>
      </nav>

      <p className="text-xs text-ink-400 mb-5">
        Creato il <span className="font-medium">12/05/2025</span> da Comune di (nome del comune), (Mario Rossi) – Ultima modifica il <span className="font-medium">15/05/2025</span>
      </p>

      {/* Analysis header card */}
      <div className="bg-white border border-ink-100 rounded p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-badge-esg/40 flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-700" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="7" r="2.5" />
                <circle cx="5" cy="15" r="2" />
                <circle cx="15" cy="15" r="2" />
                <path d="M8 9l-2 4m4-4v4m2-4l2 4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h1 className="text-base font-bold text-ink-900">Analisi ESG</h1>
                <Badge type="ESG" />
              </div>
              <p className="text-xs text-ink-500">Del progetto {p.nome || "—"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-brand-violet">
            <button type="button" onClick={handleDownload} className="flex items-center gap-1 hover:underline">
              Scarica Report, Metodologia e Fonti
            </button>
            <button type="button" onClick={handleDownload} className="flex items-center gap-1 hover:underline">
              Scarica Excel
            </button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-ink-100 grid grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-ink-400 mb-0.5">Settore</p>
            <p className="text-ink-900 font-medium">{p.configurazione?.settore || "—"}</p>
          </div>
          <div>
            <p className="text-ink-400 mb-0.5">Categoria</p>
            <p className="text-ink-900 font-medium">{p.configurazione?.categoria_intervento || "—"}</p>
          </div>
          <div>
            <p className="text-ink-400 mb-0.5">Localizzazione</p>
            <p className="text-ink-900 font-medium">{p.configurazione?.nuts_label || p.configurazione?.localizzazione || "—"}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-ink-100 flex gap-6 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`pb-3 text-sm font-medium transition-colors ${
              tab === t.id ? "border-b-2 border-brand-violet text-brand-violet" : "text-ink-500 hover:text-ink-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Riepilogo tab */}
      {tab === "riepilogo" && (
        <div className="bg-white border border-ink-100 rounded p-6 space-y-8">
          <div>
            <h2 className="text-base font-bold text-ink-900 mb-3">La tua performance ESG</h2>
            <p className="text-sm text-ink-700 leading-relaxed max-w-3xl mb-2">
              Questa analisi fornisce una visione d'insieme del grado di allineamento del progetto ai criteri ESG,
              evidenziando i punti di forza e le aree che richiedono interventi mirati.
            </p>
            <p className="text-sm text-ink-700 leading-relaxed max-w-3xl mb-4">
              I risultati sono espressi in percentuale e suddivisi tra tre categorie: <strong>Allineato</strong>,{" "}
              <strong>Parzialmente allineato</strong> e <strong>Non allineato</strong>.
            </p>
            <ul className="text-xs text-ink-600 space-y-1 mb-4 list-none">
              {[
                ["Allineato", "aree in cui il progetto soddisfa pienamente i requisiti normativi e le migliori pratiche ESG."],
                ["Parzialmente allineato", "aree in cui sono presenti iniziative già avviate, ma che richiedono ulteriori sviluppi."],
                ["Non allineato", "aree che necessitano di interventi significativi per migliorare le performance."],
              ].map(([term, def]) => (
                <li key={term}>
                  <span className="font-semibold">• {term}:</span> {def}
                </li>
              ))}
            </ul>
          </div>

          {/* Rating section */}
          <div>
            <h3 className="text-sm font-bold text-ink-900 mb-4">Rating ESG</h3>

            {/* View toggle */}
            <div className="flex border border-ink-200 rounded overflow-hidden w-48 mb-4">
              {["grafico", "tabella"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setRatingView(v)}
                  className={`flex-1 py-1.5 text-xs font-medium capitalize transition-colors ${
                    ratingView === v ? "bg-brand-violet text-white" : "text-ink-500 hover:bg-ink-100"
                  }`}
                >
                  {v === "grafico" ? "Grafico" : "Dati in tabella"}
                </button>
              ))}
            </div>

            {ratingView === "grafico" ? (
              <div>
                {/* Overall rating */}
                <div className="flex items-center gap-4 mb-6">
                  <RatingBadge rating={r.rating} size="lg" />
                  <div>
                    <p className="text-sm font-semibold text-ink-900">Score complessivo: {r.score?.toFixed(1)}</p>
                    <div className="flex gap-4 mt-1 text-xs text-ink-600">
                      <span>Environmental: <strong>{r.environmental_rating}</strong> ({r.environmental_score})</span>
                      <span>Social: <strong>{r.social_rating}</strong> ({r.social_score})</span>
                      <span>Governance: <strong>{r.governance_rating}</strong> ({r.governance_score})</span>
                    </div>
                  </div>
                </div>

                {/* Rating scale bar */}
                <div className="relative mb-6">
                  <div className="flex items-end gap-px mb-1">
                    {RATING_SCALE.map((rating, i) => (
                      <div key={rating} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-full transition-all ${getRatingColor(rating)} ${i === ratingIdx ? "h-7 ring-2 ring-ink-900 ring-offset-1" : "h-5 opacity-60"}`}
                        />
                        <span className={`text-xs mt-1 font-medium ${i === ratingIdx ? "text-ink-900" : "text-ink-400"}`}>{rating}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance bar — solo se sotto NON c'è la sezione Compliance ricca (esgDetail) */}
                {!r.esgDetail && (
                  <div>
                    <p className="text-xs font-semibold text-ink-700 mb-2">Compliance ESG</p>
                    <ComplianceBar
                      aligned={r.aligned_count}
                      partial={r.partial_count}
                      nonAligned={r.non_aligned_count}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-4 text-xs text-brand-violet hover:underline flex items-center gap-1"
                >
                  Scatta istantanea ↗
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-ink-100 bg-bg-page text-ink-500">
                      <th className="px-4 py-2.5 text-left font-mono font-semibold uppercase tracking-[0.1em] text-[11px]">Pilastro</th>
                      <th className="px-4 py-2.5 text-left font-mono font-semibold uppercase tracking-[0.1em] text-[11px]">Rating</th>
                      <th className="px-4 py-2.5 text-right font-mono font-semibold uppercase tracking-[0.1em] text-[11px]">Score</th>
                      <th className="px-4 py-2.5 text-right font-mono font-semibold uppercase tracking-[0.1em] text-[11px]">Allineato</th>
                      <th className="px-4 py-2.5 text-right font-mono font-semibold uppercase tracking-[0.1em] text-[11px]">Parziale</th>
                      <th className="px-4 py-2.5 text-right font-mono font-semibold uppercase tracking-[0.1em] text-[11px]">Non allineato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {Object.entries(r.pillars || {}).map(([key, pillar]) => (
                      <tr key={key} className="hover:bg-ink-50">
                        <td className="px-4 py-3 font-medium capitalize">{key}</td>
                        <td className="px-4 py-3">
                          <RatingBadge rating={pillar.rating} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-right font-mono">{pillar.score}</td>
                        <td className="px-4 py-3 text-right text-green-600 font-medium">{pillar.aligned}</td>
                        <td className="px-4 py-3 text-right text-amber-600 font-medium">{pillar.partial}</td>
                        <td className="px-4 py-3 text-right text-red-600 font-medium">{pillar.non_aligned}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {r.esgDetail && <ComplianceSection compliance={r.esgDetail.compliance} />}
          {r.esgDetail && <MaterialitySection materiality={r.esgDetail.materiality} />}
          {r.esgDetail && <SdgSection sdg={r.esgDetail.sdg} />}
        </div>
      )}

      {/* Pillar tabs */}
      {["environmental", "social", "governance"].includes(tab) && (
        <div className="bg-white border border-ink-100 rounded p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-violet-light flex items-center justify-center">
              <span className="text-xl font-bold text-brand-violet">{PILLAR_LETTERS[tab]}</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-900 capitalize">{tab}</h2>
              <div className="flex items-center gap-3 mt-0.5">
                <RatingBadge rating={r.pillars?.[tab]?.rating} size="sm" />
                <span className="text-sm text-ink-700">Score: <strong>{r.pillars?.[tab]?.score}</strong></span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-ink-700 mb-2">Compliance</p>
            <ComplianceBar
              aligned={r.pillars?.[tab]?.aligned ?? 0}
              partial={r.pillars?.[tab]?.partial ?? 0}
              nonAligned={r.pillars?.[tab]?.non_aligned ?? 0}
            />
          </div>

          <p className="mt-6 text-sm text-ink-700 leading-relaxed">
            {tab === "environmental" && "La valutazione ambientale analizza l'uso delle risorse naturali, le emissioni, l'economia circolare e la mitigazione dei rischi ambientali legati al progetto."}
            {tab === "social" && "La valutazione sociale esamina la qualità del lavoro, l'inclusione e la parità di genere, le relazioni con la comunità e con gli stakeholder coinvolti nel progetto."}
            {tab === "governance" && "La valutazione di governance analizza la trasparenza, la gestione responsabile delle risorse pubbliche e l'integrità dei processi decisionali del progetto."}
          </p>

          {(() => {
            const letter = PILLAR_LETTERS[tab];
            const sts = r.esgDetail?.subThemes?.[letter];
            if (!sts || sts.length === 0) return null;
            return (
              <div className="mt-8 space-y-8">
                {/* Performance sul tema e i sotto-temi */}
                <div>
                  <h3 className="text-sm font-bold text-ink-900 mb-4">Performance sul tema e i sotto-temi</h3>
                  <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_480px] items-center">
                    <div className="space-y-4">
                      {sts.map((st) => (
                        <div key={st.label}>
                          <div className="flex justify-between items-baseline gap-2 mb-1">
                            <span className="text-xs font-semibold text-ink-800">{st.label}</span>
                            <span className="text-xs font-bold text-ink-900">{st.score}</span>
                          </div>
                          <ComplianceBar aligned={st.compliance.aligned} partial={st.compliance.partial} nonAligned={st.compliance.non} />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <SubThemeRadar items={sts.map((st) => ({ label: st.label, score: st.score }))} />
                    </div>
                  </div>
                </div>

                {/* Metodologia, risultati e raccomandazioni */}
                <div>
                  <h3 className="text-sm font-bold text-ink-900 mb-4">Metodologia di valutazione, risultati e raccomandazioni</h3>
                  <div className="space-y-3">
                    {sts.map((st) => (
                      <SubThemePanel key={st.label} st={st} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
