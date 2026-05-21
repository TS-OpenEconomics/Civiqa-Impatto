import { useState, useEffect } from "react";
import { Badge } from "../ui/Badge";
import { Skeleton, SkeletonText } from "../ui/Skeleton";

function fmtCurrency(n) {
  if (!n) return "—";
  return `${new Intl.NumberFormat("it-IT").format(n)} €`;
}

function statusLabel(stato) {
  const map = {
    "In preparazione": { label: "In preparazione", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
    "In approvazione": { label: "In approvazione", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
    Approvato: { label: "Approvato", cls: "bg-green-50 text-green-700 border border-green-200" },
  };
  return map[stato] || { label: stato, cls: "bg-ink-100 text-ink-500" };
}

function analysisStatusLabel(status) {
  const map = {
    needs_input: { label: "Non avviata", cls: "text-ink-400" },
    running: { label: "In corso…", cls: "text-amber-600" },
    completed: { label: "Completata", cls: "text-green-600" },
  };
  return map[status] || { label: status, cls: "text-ink-500" };
}

function AnalysisCard({ id, label, analysis, results, onOpen }) {
  const [open, setOpen] = useState(false);
  const st = analysisStatusLabel(analysis?.status);

  const icons = {
    eia: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#F8A8E2" />
        <path d="M10 22l6-12 6 12" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 18h8" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    ecba: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#A8D8F8" />
        <path d="M10 22V10m6 12V14m6 8V17" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    esg: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#86E8DC" />
        <circle cx="16" cy="12" r="3" stroke="#222" strokeWidth="1.5" />
        <circle cx="10" cy="21" r="2.5" stroke="#222" strokeWidth="1.5" />
        <circle cx="22" cy="21" r="2.5" stroke="#222" strokeWidth="1.5" />
        <path d="M13.5 14.5l-2 4.5m5-5v4m2.5-4.5l2 4.5" stroke="#222" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  };

  const descriptions = {
    eia: "per stimare gli effetti del progetto su economia locale, occupazione e sviluppo del territorio.",
    ecba: "per valutare il rapporto tra costi e benefici del progetto, misurandone la convenienza complessiva per la collettività.",
    esg: "per valutare la sostenibilità del progetto secondo i criteri ambientali, sociali e di governance.",
  };

  const hasResults = analysis?.status === "completed" && results;

  return (
    <div className="bg-white border border-ink-100 rounded">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          {icons[id]}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink-900">Analisi {label === "eia" ? "di Impatto" : label === "ecba" ? "Costi-Benefici" : "ESG"}</span>
              <Badge type={id} />
            </div>
            <p className="text-xs text-ink-500 mt-0.5">{descriptions[id]}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-xs font-medium ${st.cls}`}>{st.label}</span>
          <button
            type="button"
            onClick={onOpen}
            className="text-xs font-semibold text-brand-violet border border-brand-violet rounded px-3 py-1.5 hover:bg-brand-violet-light transition-colors flex items-center gap-1"
          >
            {analysis?.status === "completed" ? "Vai al dettaglio dell'analisi" : "Avvia analisi"} →
          </button>
          {hasResults && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="text-ink-400 hover:text-ink-900 transition-colors"
            >
              <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Expanded EIA summary */}
      {open && hasResults && id === "eia" && results.eia && (
        <div className="border-t border-ink-100 px-5 py-4 bg-ink-50/30">
          <p className="text-xs text-ink-700 mb-4 max-w-2xl leading-relaxed">
            L'Analisi di Impatto Economico sintetizza gli effetti attesi del progetto sul sistema locale.
            I riquadri mostrano i principali indicatori.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Spese", icon: "💰", value: `${((results.eia.shock_totale || 41147) / 1000).toFixed(2)} K€` },
              { label: "PIL", icon: "📈", value: `${((results.eia.gva?.totale || 57975) / 1000).toFixed(2)} K€` },
              { label: "Occupati", icon: "👷", value: `${(results.eia.fte?.totale || 846).toFixed(0)} ETP` },
              { label: "Valore produzione", icon: "🏭", value: `${((results.eia.produzione?.totale || 104060) / 1000).toFixed(2)} K€` },
              { label: "Redditi famiglie", icon: "🏠", value: `${((results.eia.redditi?.totale || 56040) / 1000).toFixed(2)} K€` },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-ink-900 text-white rounded p-3 text-center">
                <p className="text-xs text-white/60 mb-1">{kpi.label}</p>
                <p className="text-sm font-bold font-mono">{kpi.value}</p>
                <p className="text-xs text-white/50 mt-0.5">KC in valore attuale</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded ECBA summary */}
      {open && hasResults && id === "ecba" && results.ecba && (
        <div className="border-t border-ink-100 px-5 py-4 bg-ink-50/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-ink-500 mb-1">Benefici economici</p>
              <p className="text-lg font-bold text-green-600">{new Intl.NumberFormat("it-IT").format(results.ecba.benefici_totali || 456726463)} €</p>
            </div>
            <div>
              <p className="text-xs text-ink-500 mb-1">Costi economici</p>
              <p className="text-lg font-bold text-ink-900">{new Intl.NumberFormat("it-IT").format(results.ecba.costi_totali || 446639229)} €</p>
            </div>
            <div>
              <p className="text-xs text-ink-500 mb-1">VANE</p>
              <p className="text-lg font-bold text-brand-violet">{new Intl.NumberFormat("it-IT").format(results.ecba.van || 10046654)} €</p>
            </div>
          </div>
        </div>
      )}

      {/* Expanded ESG summary */}
      {open && hasResults && id === "esg" && results.esg && (
        <div className="border-t border-ink-100 px-5 py-4 bg-ink-50/30">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-ink-500 mb-1">Rating ESG</p>
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold bg-green-500 text-white">
                  {results.esg.rating || "A"}
                </span>
                <span className="text-sm text-ink-700">
                  Score: <strong>{results.esg.score?.toFixed(1) || "53,6"}</strong>
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-500 mb-1">Environmental</p>
              <p className="text-sm font-semibold">{results.esg.environmental_rating || "A+"} ({results.esg.environmental_score?.toFixed(0) || 51})</p>
            </div>
            <div>
              <p className="text-xs text-ink-500 mb-1">Social</p>
              <p className="text-sm font-semibold">{results.esg.social_rating || "A+"} ({results.esg.social_score?.toFixed(0) || 62})</p>
            </div>
            <div>
              <p className="text-xs text-ink-500 mb-1">Governance</p>
              <p className="text-sm font-semibold">{results.esg.governance_rating || "BBB"} ({results.esg.governance_score?.toFixed(0) || 46})</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectDetailV1({ workspaceId, project, analyses, results, onBack, onOpenEia, onOpenEcba, onOpenEsg }) {
  const [isLoading, setIsLoading] = useState(true);
  const p = project || {};
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
        <div className="mt-6">
          <Skeleton className="h-32" />
        </div>
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
      <nav className="text-xs text-ink-400 flex items-center gap-1.5 mb-5">
        <button type="button" onClick={onBack} className="hover:text-brand-violet transition-colors">
          Valutazione
        </button>
        <span>›</span>
        <span className="text-ink-700">Dettaglio del progetto</span>
      </nav>

      {/* Project header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-ink-900">{p.nome || "Progetto senza nome"}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${stato.cls}`}>{stato.label}</span>
          </div>
          <p className="font-mono text-sm text-ink-400">{p.cup}</p>
          <p className="mt-3 text-sm text-ink-700 leading-relaxed max-w-3xl">{p.descrizione}</p>
        </div>
        <button type="button" className="shrink-0 border border-ink-200 rounded px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100 transition-colors">
          Opzioni ▾
        </button>
      </div>

      {/* Config table */}
      <div className="mt-8 bg-white border border-ink-100 rounded">
        <div className="px-5 py-3 bg-ink-900 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Dati della configurazione</h2>
          <button type="button" className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors">
            Vedi maggiori dettagli →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 divide-x divide-ink-100">
          {[
            ["Settore", cfg.settore],
            ["Sotto-settore", cfg.sottosettore],
            ["Categoria di intervento", cfg.categoria],
            ["Tipo intervento", cfg.tipoIntervento],
            ["Durata del progetto", cfg.durataLavori ? `${cfg.durataLavori} anni` : p.durataLavori],
            ["Localizzazione", cfg.localizzazione || (p.localizzazioni || []).map((l) => l.label || l).join(", ")],
            ["Anno di attualizzazione", cfg.annoAttualizzazione],
            ["CAPEX", fmtCurrency(cfg.capex)],
            ["OPEX", fmtCurrency(cfg.opex)],
          ].map(([label, value]) => (
            <div key={label} className="px-4 py-3 border-b border-ink-100">
              <p className="text-xs text-ink-400 font-medium mb-0.5">{label}</p>
              <p className="text-sm text-ink-900 font-medium">{value || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analyses */}
      <div className="mt-10">
        <h2 className="text-sm font-bold text-ink-900 mb-4">Le analisi del progetto</h2>
        <div className="space-y-3">
          <AnalysisCard id="eia" label="eia" analysis={analyses?.eia} results={results} onOpen={onOpenEia} />
          <AnalysisCard id="ecba" label="ecba" analysis={analyses?.ecba} results={results} onOpen={onOpenEcba} />
          <AnalysisCard id="esg" label="esg" analysis={analyses?.esg} results={results} onOpen={onOpenEsg} />
        </div>
      </div>
    </div>
  );
}
