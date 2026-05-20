import { useMemo, useState } from "react";
import { IconArrowLeft, IconArrowRight, IconClose } from "./ui/Icons";
import { LeafletMap } from "./map/LeafletMap";

export function ConfigurationSummary({ project, onBack, onConfirm, onClose }) {
  const [editable, setEditable] = useState({
    nome: project.nome,
    cup: project.cup,
    descrizione: project.descrizione,
    stato: project.stato,
  });

  const mergedProject = useMemo(
    () => ({ ...project, ...editable }),
    [project, editable]
  );

  return (
    <div className="fixed inset-0 bg-bg-page z-50 flex flex-col">
      <div className="h-14 bg-white flex items-center justify-end px-6 shrink-0 border-b border-ink-100">
        <button onClick={onClose} className="flex items-center gap-2 text-brand-violet text-sm font-semibold">
          Chiudi e torna alle valutazioni
          <IconClose />
        </button>
      </div>
      <div className="h-[3px] bg-accent-lime" />

      <div className="flex-1 overflow-y-auto px-10 py-8">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-ink-500">Riepilogo della configurazione</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Controlla i dati prima di procedere</h1>
        <p className="mt-4 text-sm text-ink-700 max-w-4xl leading-relaxed">
          In questa fase puoi modificare senza perdere dati nome progetto, CUP, descrizione e stato. Gli altri campi sono mostrati come riepilogo della configurazione su cui verranno eseguite le analisi.
        </p>

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6">
          <section className="bg-white p-6">
            <h2 className="text-lg font-bold">Campi modificabili</h2>
            <div className="mt-5 space-y-5">
              <EditableField label="Nome progetto" value={editable.nome} onChange={(value) => setEditable((prev) => ({ ...prev, nome: value }))} />
              <EditableField label="CUP" value={editable.cup} onChange={(value) => setEditable((prev) => ({ ...prev, cup: value }))} />
              <EditableField label="Stato del progetto" value={editable.stato} onChange={(value) => setEditable((prev) => ({ ...prev, stato: value }))} />
              <label className="block">
                <span className="block text-sm font-semibold mb-2">Descrizione</span>
                <textarea
                  rows={7}
                  value={editable.descrizione}
                  onChange={(e) => setEditable((prev) => ({ ...prev, descrizione: e.target.value }))}
                  className="w-full border border-ink-300 px-3 py-3 text-sm focus:outline-none focus:border-brand-violet"
                />
              </label>
            </div>
          </section>

          <section className="bg-white">
            <div className="bg-ink-900 text-white px-5 py-3 text-sm font-bold">Dati della configurazione</div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-sm">
              <ConfigField label="Settore" value={project.configurazione.settore} />
              <div>
                <p className="font-bold text-ink-900">Sotto-settore</p>
                <p className="mt-1 text-ink-700">{project.configurazione.sotto_settore}</p>
                {project.configurazione.nace_code && (
                  <span className="mt-1 inline-block text-xs font-mono bg-ink-50 border border-ink-200 px-2 py-0.5 text-ink-600">
                    NACE {project.configurazione.nace_code}
                  </span>
                )}
              </div>
              <ConfigField label="Categoria" value={project.configurazione.categoria_intervento} />
              <ConfigField label="Tipo intervento" value={project.configurazione.tipo_intervento} />
              <ConfigField label="Durata" value={project.configurazione.durata_progetto} />
              <div>
                <p className="font-bold text-ink-900">Localizzazione</p>
                <p className="mt-1 text-ink-700">{project.configurazione.localizzazione}</p>
                {project.configurazione.nuts_code && (
                  <span className="mt-1 inline-block text-xs font-mono bg-brand-violet-soft text-brand-violet border border-brand-violet/20 px-2 py-0.5">
                    {project.configurazione.nuts_code} — {project.configurazione.nuts_label}
                  </span>
                )}
              </div>
              <ConfigField label="Anno di attualizzazione" value={String(project.configurazione.anno_attualizzazione)} />
              <ConfigField label="CAPEX" value={formatCurrency(project.configurazione.capex)} />
              <ConfigField label="OPEX annuo" value={formatCurrency(project.configurazione.opex)} />
              {project.configurazione.vita_utile && (
                <ConfigField label="Vita utile" value={`${project.configurazione.vita_utile} anni`} />
              )}
            </div>

            {/* P3.4 — Mappa read-only con marker */}
            {project.configurazione.lat != null && project.configurazione.lon != null && (
              <div className="px-6 pb-6">
                <div className="border-t border-ink-100 pt-5 mb-3 flex items-center gap-2">
                  <p className="text-sm font-bold text-ink-900">Mappa localizzazione</p>
                </div>
                <div className="h-52">
                  <LeafletMap
                    position={{ lat: project.configurazione.lat, lon: project.configurazione.lon }}
                    readOnly
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="h-16 shrink-0 grid grid-cols-2">
        <button onClick={onBack} className="bg-ink-900 text-white text-sm font-semibold flex items-center justify-between px-8">
          <span>Torna alla configurazione</span>
          <IconArrowLeft className="w-5 h-5" />
        </button>
        <button onClick={() => onConfirm(mergedProject)} className="bg-brand-violet text-white text-sm font-semibold flex items-center justify-between px-8">
          <span>Completa la configurazione</span>
          <IconArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function EditableField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-2">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-11 px-3 border border-ink-300 text-sm focus:outline-none focus:border-brand-violet" />
    </label>
  );
}

function ConfigField({ label, value }) {
  return (
    <div>
      <p className="font-bold text-ink-900">{label}</p>
      <p className="mt-1 text-ink-700">{value}</p>
    </div>
  );
}

function formatCurrency(value) {
  return `${new Intl.NumberFormat("it-IT").format(value)} €`;
}
