import { useState } from "react";
import projectData from "../mocks/project.json";
import { Badge } from "./ui/Badge";
import { IconArrowRight, IconChevronDown } from "./ui/Icons";

function formatCurrency(num) {
  return new Intl.NumberFormat("it-IT").format(num) + " €";
}

export function ProjectDetail({ onBack, onOpenEia, onOpenEcba, onOpenEsg }) {
  const p = projectData;

  return (
    <div className="px-10 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <button onClick={onBack} className="underline text-ink-900">
          Valutazione
        </button>
        <span className="text-ink-300">›</span>
        <span className="font-semibold">Dettaglio del progetto</span>
      </nav>

      <p className="mt-4 text-xs text-ink-700">
        Creato il <span className="font-mono font-semibold">{p.creato_il}</span> da{" "}
        <strong>{p.creato_da}</strong> - Ultima modifica il{" "}
        <span className="font-mono font-semibold">{p.ultima_modifica}</span>
      </p>

      <div className="mt-4 flex items-start justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{p.nome}</h1>
          <p className="mt-2 font-mono text-sm">CUP {p.cup}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 bg-white border border-ink-100 text-sm font-semibold">
            Opzioni
          </button>
          <button className="w-10 h-10 bg-brand-violet text-white flex items-center justify-center">
            <span className="text-lg">···</span>
          </button>
        </div>
      </div>

      <p className="mt-5 text-sm text-ink-700 leading-relaxed max-w-4xl">
        {p.descrizione}
      </p>

      <p className="mt-5 text-sm">
        <strong>Stato del progetto:</strong> <span className="font-medium">{p.stato}</span>
      </p>

      {/* Box configurazione */}
      <div className="mt-8 bg-white">
        <div className="bg-ink-900 text-white px-5 py-3 font-bold text-sm">
          Dati della configurazione
        </div>
        <div className="p-6 grid grid-cols-3 gap-x-6 gap-y-5 text-sm">
          <ConfigField label="Settore" value={p.configurazione.settore} />
          <ConfigField label="Sotto-settore" value={p.configurazione.sotto_settore} />
          <ConfigField label="Categoria di intervento" value={p.configurazione.categoria_intervento} />

          <ConfigField label="Tipo intervento" value={p.configurazione.tipo_intervento} />
          <ConfigField label="Durata del progetto" value={p.configurazione.durata_progetto} />
          <ConfigField label="Localizzazione" value={p.configurazione.localizzazione} />

          <ConfigField label="Anno di attualizzazione" value={p.configurazione.anno_attualizzazione} mono />
          <ConfigField label="CAPEX" value={formatCurrency(p.configurazione.capex)} mono />
          <ConfigField label="OPEX" value={formatCurrency(p.configurazione.opex)} mono />
        </div>
        <div className="px-6 pb-5 flex justify-end">
          <button className="text-brand-violet text-sm font-semibold flex items-center gap-2">
            Vedi maggiori dettagli <IconArrowRight />
          </button>
        </div>
      </div>

      {/* Le analisi del progetto */}
      <h2 className="mt-10 text-xl font-bold">Le analisi del progetto</h2>
      <div className="mt-5 flex flex-col gap-3">
        <AnalysisCard
          tipo="EIA"
          nome="Analisi di Impatto"
          descrizione="Per stimare gli effetti del progetto su economia locale, occupazione e sviluppo del territorio."
          onOpen={onOpenEia}
        />
        <AnalysisCard
          tipo="ECBA"
          nome="Analisi Costi-Benefici"
          descrizione="Per valutare la convenienza complessiva del progetto pubblico nel medio-lungo periodo."
          onOpen={onOpenEcba}
        />
        <AnalysisCard
          tipo="ESG"
          nome="Analisi ESG"
          descrizione="Per misurare il grado di allineamento del progetto ai criteri Environmental, Social e Governance."
          onOpen={onOpenEsg}
        />
      </div>
    </div>
  );
}

function ConfigField({ label, value, mono }) {
  return (
    <div>
      <p className="font-bold text-ink-900">{label}</p>
      <p className={`mt-1 text-ink-700 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function AnalysisCard({ tipo, nome, descrizione, onOpen }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white">
      <div className="flex items-center gap-5 px-5 py-4">
        <span className="w-10 h-10 bg-brand-violet-soft rounded-full flex items-center justify-center text-brand-violet">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </span>
        <div className="flex items-center gap-3 flex-1">
          <h3 className="font-bold text-lg">{nome}</h3>
          <Badge type={tipo} />
        </div>
        {onOpen && (
          <button
            onClick={onOpen}
            className="h-10 px-4 bg-brand-violet text-white text-sm font-semibold flex items-center gap-2 hover:bg-brand-violet-dark"
          >
            Vai al dettaglio dell'analisi
            <IconArrowRight />
          </button>
        )}
        <button
          onClick={() => setOpen(!open)}
          className={`text-ink-700 transition-transform ${open ? "" : "-rotate-90"}`}
        >
          <IconChevronDown />
        </button>
      </div>
      {open && (
        <div className="px-[60px] pb-5 -mt-2">
          <p className="text-sm text-ink-700">{descrizione}</p>
        </div>
      )}
    </div>
  );
}
