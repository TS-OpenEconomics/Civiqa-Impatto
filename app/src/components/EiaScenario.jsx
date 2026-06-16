import { IconArrowRight } from "./ui/Icons";

function fmt(value) {
  const n = Number(value);
  return !value || Number.isNaN(n) ? "—" : new Intl.NumberFormat("it-IT").format(n);
}

function fmtDate(isoDate) {
  if (!isoDate) return "—";
  const d = new Date(isoDate + "T00:00:00");
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function buildScenario(project) {
  const c = project.configurazione ?? {};
  const anno_inizio = c.data_fine
    ? new Date(c.data_fine + "T00:00:00").getFullYear() + 1
    : (c.anno_attualizzazione ?? 2025);
  const vita_utile = c.vita_utile ?? 20;

  return {
    settore:             c.settore || "",
    nuts_code:           c.nuts_code || "",
    nuts_label:          c.nuts_label || c.localizzazione || "",
    capex:               c.capex ?? 0,
    opex_annuo:          c.opex ?? 0,
    vita_utile,
    anno_inizio,
    anno_fine:           anno_inizio + vita_utile - 1,
    capex_distribuzione: c.capex_distribuzione ?? null,
    spese_aggiuntive:    [],
    granularita:         "regionale",
    tipo:                "completa",
  };
}

export function EiaScenario({ project, initialScenario, onClose, onRun }) {
  const scenario = initialScenario ?? buildScenario(project);
  const conf = project?.configurazione ?? {};

  const opexTotale = (conf.opex ?? 0) * (conf.vita_utile ?? 20);
  const durataAnni = conf.data_inizio && conf.data_fine
    ? new Date(conf.data_fine + "T00:00:00").getFullYear() - new Date(conf.data_inizio + "T00:00:00").getFullYear()
    : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg-page">
      <div className="h-[3px] flex-shrink-0 bg-accent-lime" />
      <div className="flex h-16 flex-shrink-0 items-center justify-end border-b border-ink-100 bg-white px-8">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-[14px] font-semibold text-brand-violet"
        >
          Chiudi e torna al progetto
          <span className="text-[20px] leading-none">&times;</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Page header */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Analisi di Impatto Economico</p>
        <h1 className="mt-2 text-[26px] font-bold leading-tight text-ink-900">{project?.nome || "Progetto"}</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-[1.55] text-ink-600">
          Verifica i dati del progetto prima di avviare l'analisi. I parametri vengono ricavati automaticamente dalla configurazione.
        </p>

        <div className="mt-8 max-w-4xl space-y-4">

          {/* Categoria e luogo */}
          <SummaryBlock title="Categoria e luogo di intervento">
            <div className="grid grid-cols-2 divide-x divide-[#ececec] md:grid-cols-4">
              <SummaryField label="Settore" value={conf.settore} />
              <SummaryField label="Categoria" value={conf.categoria_intervento} />
              <SummaryField label="Tipo intervento" value={conf.tipo_intervento} />
              <SummaryField
                label="Localizzazione"
                value={conf.nuts_label || conf.localizzazione}
                tag={conf.nuts_code}
              />
            </div>
          </SummaryBlock>

          {/* Durata lavori */}
          <SummaryBlock title="Durata lavori">
            <div className="grid grid-cols-2 divide-x divide-[#ececec] md:grid-cols-4">
              <SummaryField label="Inizio lavori" value={fmtDate(conf.data_inizio)} />
              <SummaryField label="Fine lavori" value={fmtDate(conf.data_fine)} />
              <SummaryField
                label="Durata cantiere"
                value={durataAnni != null ? `${durataAnni} ${durataAnni === 1 ? "anno" : "anni"}` : "—"}
              />
              <SummaryField label="OPEX attivo dal" value={scenario.anno_inizio ? `${scenario.anno_inizio}` : "—"} />
            </div>
          </SummaryBlock>

          {/* OPEX */}
          <SummaryBlock title="OPEX considerato">
            <div className="grid grid-cols-2 divide-x divide-[#ececec] md:grid-cols-4">
              <SummaryField label="Tasso OPEX" value={conf.opex_tasso != null ? `${conf.opex_tasso}%` : "—"} />
              <SummaryField label="OPEX" value={conf.opex ? `${fmt(conf.opex)} €` : "—"} />
              <SummaryField label="Vita utile" value={conf.vita_utile ? `${conf.vita_utile} anni` : "—"} />
              <SummaryField
                label="OPEX totale stimato"
                value={opexTotale > 0 ? `${fmt(String(Math.round(opexTotale)))} €` : "—"}
              />
            </div>
          </SummaryBlock>

          {/* Parametri economici */}
          <SummaryBlock title="Parametri economici">
            <div className="grid grid-cols-2 divide-x divide-[#ececec] md:grid-cols-4">
              <SummaryField label="CAPEX totale" value={conf.capex ? `${fmt(conf.capex)} €` : "—"} />
              <SummaryField
                label="Anno attualizzazione"
                value={conf.anno_attualizzazione ? String(conf.anno_attualizzazione) : "—"}
              />
              <SummaryField
                label="Tasso attualizzazione"
                value={conf.tasso_attualizzazione != null ? `${conf.tasso_attualizzazione}%` : "—"}
              />
              <SummaryField label="Stato progetto" value={project?.stato} />
            </div>
          </SummaryBlock>

          {/* CAPEX per anno, se presente */}
          {conf.capex_distribuzione_attiva && conf.capex_distribuzione && Object.keys(conf.capex_distribuzione).length > 0 ? (
            <SummaryBlock title="Distribuzione CAPEX per anno">
              <div className="divide-y divide-[#ececec]">
                {Object.entries(conf.capex_distribuzione).map(([year, pct]) => {
                  const euros = Math.round((conf.capex ?? 0) * Number(String(pct).replace(",", ".")) / 100);
                  const pctNum = Number(String(pct).replace(",", "."));
                  return (
                    <div key={year} className="grid items-center px-5 py-3 md:grid-cols-[60px_1fr_60px_120px]">
                      <span className="text-[14px] font-semibold text-ink-900">{year}</span>
                      <div className="mx-4 h-[6px] overflow-hidden bg-[#e7e7ea]">
                        <div className="h-full bg-brand-violet" style={{ width: `${pctNum}%` }} />
                      </div>
                      <span className="text-right text-[13px] font-semibold text-ink-700">{pct}%</span>
                      <span className="text-right text-[12px] text-ink-500">{fmt(String(euros))} €</span>
                    </div>
                  );
                })}
              </div>
            </SummaryBlock>
          ) : null}

        </div>

        <div className="h-12" />
      </div>

      {/* Footer */}
      <div className="grid h-16 flex-shrink-0 grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-between bg-[#5a5a5a] px-6 text-[14px] font-medium text-white"
        >
          <span>Torna al progetto</span>
          <span className="text-[22px] leading-none">&larr;</span>
        </button>
        <button
          type="button"
          onClick={() => onRun(scenario)}
          className="flex items-center justify-between bg-brand-violet px-6 text-[14px] font-medium text-white hover:bg-brand-violet-dark"
        >
          <span>Esegui l'Analisi di Impatto</span>
          <IconArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function SummaryBlock({ title, children }) {
  return (
    <div className="overflow-hidden border border-ink-100 bg-white">
      <div className="border-b border-ink-100 bg-white px-5 py-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">{title}</p>
      </div>
      {children}
    </div>
  );
}

function SummaryField({ label, value, tag }) {
  return (
    <div className="px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1 text-[14px] font-semibold leading-snug text-ink-900">{value || "—"}</p>
      {tag ? (
        <span className="mt-1.5 inline-block border border-brand-violet/20 bg-brand-violet-soft px-2 py-0.5 text-[11px] font-mono text-brand-violet">
          {tag}
        </span>
      ) : null}
    </div>
  );
}
