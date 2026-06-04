/* ══════════════════════════════════════════════════════════════
   mockDUP.ts — Dati simulati estratti dal DUP del Comune di Colleferro
   Documento Unico di Programmazione 2026-2028
   ══════════════════════════════════════════════════════════════ */

export interface LineaStrategicaDUP {
  id: string
  titolo: string
  descrizione: string
  budgetAllocato: number
  categorieCollegate: string[] // IDs da mockTaxonomy
}

export interface OperaPrevistaDUP {
  id: string
  titolo: string
  importo: number
  lineaStrategicaId: string
  stato: 'prevista' | 'in_corso' | 'completata'
  categoriaInterventoKeywords: string[] // keywords per matching con MOP
}

export interface DUPData {
  anno: string
  triennio: string
  budgetTotaleInvestimenti: number
  budgetDisponibileNuoveOpere: number
  orizzonteAnni: number
  lineeStrategiche: LineaStrategicaDUP[]
  operePreviste: OperaPrevistaDUP[]
}

export const MOCK_DUP: DUPData = {
  anno: '2026',
  triennio: '2026-2028',
  budgetTotaleInvestimenti: 8_500_000,
  budgetDisponibileNuoveOpere: 4_200_000,
  orizzonteAnni: 3,
  lineeStrategiche: [
    {
      id: 'ls-01',
      titolo: 'Rigenerazione urbana e sicurezza edifici pubblici',
      descrizione: 'Adeguamento sismico, efficientamento energetico e riqualificazione degli edifici comunali.',
      budgetAllocato: 1_800_000,
      categorieCollegate: ['istruzione', 'ambiente'],
    },
    {
      id: 'ls-02',
      titolo: 'Mobilità sostenibile e sicurezza stradale',
      descrizione: 'Potenziamento piste ciclabili, messa in sicurezza intersezioni e miglioramento TPL.',
      budgetAllocato: 1_200_000,
      categorieCollegate: ['mobilita'],
    },
    {
      id: 'ls-03',
      titolo: 'Servizi educativi e contrasto alla dispersione',
      descrizione: 'Ampliamento offerta servizi prima infanzia e interventi contro l\'abbandono scolastico.',
      budgetAllocato: 600_000,
      categorieCollegate: ['istruzione'],
    },
    {
      id: 'ls-04',
      titolo: 'Valorizzazione patrimonio culturale e turistico',
      descrizione: 'Restauro beni culturali, promozione turistica e valorizzazione siti UNESCO.',
      budgetAllocato: 400_000,
      categorieCollegate: ['cultura'],
    },
    {
      id: 'ls-05',
      titolo: 'Digitalizzazione e innovazione dei servizi',
      descrizione: 'Transizione digitale dei servizi comunali e miglioramento efficienza amministrativa.',
      budgetAllocato: 200_000,
      categorieCollegate: ['governance'],
    },
  ],
  operePreviste: [
    {
      id: 'op-dup-01',
      titolo: 'Adeguamento sismico scuola elementare "G. Garibaldi"',
      importo: 950_000,
      lineaStrategicaId: 'ls-01',
      stato: 'prevista',
      categoriaInterventoKeywords: ['ristrutturazione', 'scolastico', 'edificio'],
    },
    {
      id: 'op-dup-02',
      titolo: 'Pista ciclabile stazione FS - via Consolare Latina',
      importo: 420_000,
      lineaStrategicaId: 'ls-02',
      stato: 'prevista',
      categoriaInterventoKeywords: ['ciclabile', 'pista', 'nuova'],
    },
    {
      id: 'op-dup-03',
      titolo: 'Voucher servizi educativi prima infanzia 2026',
      importo: 180_000,
      lineaStrategicaId: 'ls-03',
      stato: 'prevista',
      categoriaInterventoKeywords: ['voucher', 'educativi', 'infanzia'],
    },
    {
      id: 'op-dup-04',
      titolo: 'Efficientamento energetico Palazzo Comunale',
      importo: 380_000,
      lineaStrategicaId: 'ls-01',
      stato: 'in_corso',
      categoriaInterventoKeywords: ['energetica', 'riqualificazione', 'edifici'],
    },
    {
      id: 'op-dup-05',
      titolo: 'Messa in sicurezza incrocio Via Tiburtina/Via Empolitana',
      importo: 210_000,
      lineaStrategicaId: 'ls-02',
      stato: 'prevista',
      categoriaInterventoKeywords: ['sicurezza', 'intersezioni', 'stradali'],
    },
  ],
}

/* ── Helper: calcola match score tra un intervento MOP e il DUP ── */

export type DUPMatchLevel = 'pieno' | 'parziale' | 'non_previsto'

export interface DUPMatch {
  level: DUPMatchLevel
  label: string
  lineaStrategica?: LineaStrategicaDUP
  operaCorrispondente?: OperaPrevistaDUP
}

export function matchInterventoConDUP(
  categoriaIntervento: string,
  categoriaId: string,
): DUPMatch {
  const keywords = categoriaIntervento.toLowerCase()

  // Cerca match diretto con opera prevista
  const operaMatch = MOCK_DUP.operePreviste.find(op =>
    op.categoriaInterventoKeywords.some(kw => keywords.includes(kw))
  )

  if (operaMatch) {
    const linea = MOCK_DUP.lineeStrategiche.find(l => l.id === operaMatch.lineaStrategicaId)
    return {
      level: 'pieno',
      label: `Allineata con DUP — ${operaMatch.titolo}`,
      lineaStrategica: linea,
      operaCorrispondente: operaMatch,
    }
  }

  // Cerca match con linea strategica (per categoria)
  const lineaMatch = MOCK_DUP.lineeStrategiche.find(l =>
    l.categorieCollegate.includes(categoriaId)
  )

  if (lineaMatch) {
    return {
      level: 'parziale',
      label: `Coerente con linea strategica: ${lineaMatch.titolo}`,
      lineaStrategica: lineaMatch,
    }
  }

  return {
    level: 'non_previsto',
    label: 'Non prevista nel DUP — nuova proposta',
  }
}