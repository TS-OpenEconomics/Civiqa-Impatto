import { useMemo, useState } from "react";
import { Badge } from "../ui/Badge";
import { useToast } from "../../hooks/useToast";

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

function ScoreBar({ value, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color = pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-lime-400" : pct >= 25 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="h-3 bg-ink-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
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
                <Badge type="esg" />
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
            <p className="text-ink-900 font-medium">{p.configurazione?.settore || "Infrastrutture ambientali e risorse idriche"}</p>
          </div>
          <div>
            <p className="text-ink-400 mb-0.5">Dataset</p>
            <p className="text-ink-900 font-medium">Matrice contabilità sociale</p>
          </div>
          <div>
            <p className="text-ink-400 mb-0.5">Metodologia</p>
            <p className="text-ink-900 font-medium">SAM EU-ITA 2019</p>
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

                {/* Compliance bar */}
                <div>
                  <p className="text-xs font-semibold text-ink-700 mb-2">Compliance ESG</p>
                  <ComplianceBar
                    aligned={r.aligned_count}
                    partial={r.partial_count}
                    nonAligned={r.non_aligned_count}
                  />
                </div>

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

          <div>
            <p className="text-xs font-semibold text-ink-700 mb-2">Progressione score</p>
            <ScoreBar value={r.pillars?.[tab]?.score ?? 0} />
          </div>

          <p className="mt-6 text-sm text-ink-700 leading-relaxed">
            {tab === "environmental" && "La valutazione ambientale analizza l'uso delle risorse naturali, le emissioni, l'economia circolare e la mitigazione dei rischi ambientali legati al progetto."}
            {tab === "social" && "La valutazione sociale esamina la qualità del lavoro, l'inclusione e la parità di genere, le relazioni con la comunità e con gli stakeholder coinvolti nel progetto."}
            {tab === "governance" && "La valutazione di governance analizza la trasparenza, la gestione responsabile delle risorse pubbliche e l'integrità dei processi decisionali del progetto."}
          </p>
        </div>
      )}
    </div>
  );
}
