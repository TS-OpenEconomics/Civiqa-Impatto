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
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-ink-400">Riepilogo della configurazione</p>
        <h1 className="mt-1.5 text-[28px] font-bold tracking-tight text-ink-900">Controlla i dati prima di procedere</h1>
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink-500">
          Puoi ancora modificare nome, CUP, descrizione e stato. Gli altri campi sono il riepilogo della configurazione su cui verranno eseguite le analisi.
        </p>

        <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr]">
          {/* Left — editable fields */}
          <section className="border border-ink-100 bg-white p-6">
            <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-wide text-ink-400">Campi modificabili</h2>
            <div className="space-y-4">
              <EditableField label="Nome progetto" value={editable.nome} onChange={(value) => setEditable((prev) => ({ ...prev, nome: value }))} />
              <EditableField label="CUP" value={editable.cup} onChange={(value) => setEditable((prev) => ({ ...prev, cup: value }))} />
              <EditableField label="Stato del progetto" value={editable.stato} onChange={(value) => setEditable((prev) => ({ ...prev, stato: value }))} />
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-ink-900">Descrizione</span>
                <textarea
                  rows={6}
                  value={editable.descrizione}
                  onChange={(e) => setEditable((prev) => ({ ...prev, descrizione: e.target.value }))}
                  className="w-full border border-ink-200 px-3 py-2.5 text-[13px] text-ink-900 focus:border-brand-violet focus:outline-none"
                />
              </label>
            </div>
          </section>

          {/* Right — config data */}
          <section className="overflow-hidden border border-ink-100 bg-white">
            <div className="border-b border-ink-100 px-6 py-4">
              <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-400">Dati della configurazione</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-6 text-[13px]">
              <ConfigField label="Settore" value={project.configurazione.settore} />
              <div>
                <p className="mb-0.5 text-[12px] font-semibold uppercase tracking-wide text-ink-400">Sotto-settore</p>
                <p className="text-ink-700">{project.configurazione.sotto_settore}</p>
                {project.configurazione.nace_code && (
                  <span className="mt-1 inline-block border border-ink-200 bg-ink-50 px-2 py-0.5 font-mono text-[11px] text-ink-600">
                    NACE {project.configurazione.nace_code}
                  </span>
                )}
              </div>
              <ConfigField label="Categoria" value={project.configurazione.categoria_intervento} />
              <ConfigField label="Tipo intervento" value={project.configurazione.tipo_intervento} />
              <ConfigField label="Durata" value={project.configurazione.durata_progetto} />
              <div>
                <p className="mb-0.5 text-[12px] font-semibold uppercase tracking-wide text-ink-400">Localizzazione</p>
                <p className="text-ink-700">{project.configurazione.localizzazione}</p>
                {project.configurazione.nuts_code && (
                  <span className="mt-1 inline-block border border-brand-violet/20 bg-brand-violet-soft px-2 py-0.5 font-mono text-[11px] text-brand-violet">
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

            {project.configurazione.lat != null && project.configurazione.lon != null && (
              <div className="border-t border-ink-100 px-6 pb-6 pt-4">
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-ink-400">Localizzazione sulla mappa</p>
                <div className="h-48 overflow-hidden">
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

      <div className="grid h-16 shrink-0 grid-cols-2">
        <button onClick={onBack} className="flex items-center justify-between bg-[#5a5a5a] px-8 text-[14px] font-medium text-white">
          <span>Torna alla configurazione</span>
          <IconArrowLeft className="h-5 w-5" />
        </button>
        <button onClick={() => onConfirm(mergedProject)} className="flex items-center justify-between bg-brand-violet px-8 text-[14px] font-medium text-white">
          <span>Completa la configurazione</span>
          <IconArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function EditableField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-900">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full border border-ink-200 px-3 text-[13px] text-ink-900 focus:border-brand-violet focus:outline-none" />
    </label>
  );
}

function ConfigField({ label, value }) {
  return (
    <div>
      <p className="mb-0.5 text-[12px] font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className="text-[13px] text-ink-700">{value}</p>
    </div>
  );
}

function formatCurrency(value) {
  return `${new Intl.NumberFormat("it-IT").format(value)} €`;
}
