import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { NEEDS_DOCFAP } from '../../../data/poc_docfap/fabbisogni_v2'
import { DEFAULT_DIMENSION_WEIGHTS } from '../../../engine/scoreComposito'
import { useWizard } from '../../../hooks/useWizard'
import type { WizardStoreState } from '../../../store/wizardStore'
import type { AlternativaId } from '../../../types/docfap'
import { getAlternativeDisplayLabel } from '../../docfap/tableHelpers'
import { Button } from '../../ui/Button'
import { Textarea } from '../../ui/Textarea'

const DOCFAP_MAX = 20000

const TEMA_LABELS: Record<string, string> = {
  TC01: 'Cultura e turismo',
  TC02: 'Economia e lavoro',
  TC03: 'Istruzione e formazione',
  TC04: 'Welfare e inclusione',
  TC05: 'Salute e sanità',
  TC06: 'Ambiente e territorio',
  TC07: 'Mobilità e trasporti',
  TC08: 'Patrimonio pubblico',
  TC09: 'Energia e clima',
  TC10: 'Sport e tempo libero',
  TC11: 'Ricerca e innovazione',
  TC12: 'PA e innovazione',
}

const URGENZA_LABELS: Record<string, string> = {
  critica: 'Critica',
  alta: 'Alta',
  media: 'Media',
  bassa: 'Bassa',
}

function isDecisioneCompleta(decisione: {
  alternativaScelta: string
  motivazione: string
} | null): boolean {
  if (!decisione) return false
  return decisione.alternativaScelta.trim().length > 0 && decisione.motivazione.trim().length > 0
}

function formatEuro(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/D'
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

function fmtPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

function fmt1(value: number): string {
  return value.toFixed(1)
}

function fmt2(value: number): string {
  return value.toFixed(2)
}

function today(): string {
  return new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
}

function sep(char = '─', len = 53): string {
  return char.repeat(len)
}

// ── Template builder ────────────────────────────────────────────────────────

function buildDocfapNarrative(state: WizardStoreState): string {
  const need = state.fabId ? NEEDS_DOCFAP.find((n) => n.code === state.fabId) : null
  const loc = state.localizzazione
  const rup = state.rup

  const defined = new Set(state.alternativeDefinite)
  const ranking = [...(state.scoreFinale ?? [])]
    .filter((s) => defined.has(s.alternativaId))
    .sort((a, b) => b.scoreFinale - a.scoreFinale)
  const recommended = ranking[0] ?? null
  const decisione = state.decisioneRUP
  const selectedId = decisione?.alternativaScelta ?? ''

  const selectedLabel = selectedId
    ? getAlternativeDisplayLabel(
        selectedId as AlternativaId,
        state.alternative[selectedId as AlternativaId],
      )
    : 'N/D'
  const recommendedLabel = recommended
    ? getAlternativeDisplayLabel(
        recommended.alternativaId,
        state.alternative[recommended.alternativaId],
      )
    : 'N/D'

  const temaLabel = state.temaId ? (TEMA_LABELS[state.temaId] ?? state.temaId) : 'N/D'
  const urgenzaLabel = state.urgenza
    ? (URGENZA_LABELS[state.urgenza.toLowerCase()] ?? state.urgenza)
    : 'non definito'

  const tassoSconto = recommended ? recommended.tassoSconto * 100 : 3
  const orizzonte = recommended ? recommended.orizzonte : 25

  const szAttivo = (state.scenarioZeroNarrative ?? '').trim().length > 0

  // ── Header ──────────────────────────────────────────────────────────────

  const header = [
    `DOCUMENTO DI FATTIBILITÀ DELLE ALTERNATIVE PROGETTUALI`,
    `ai sensi dell'Art. 2, Allegato I.7, D.Lgs. 36/2023`,
    '',
    sep(),
    '',
    `Stazione appaltante:   ${state.intervento.denominazione || 'N/D'}`,
    `Comune:                ${loc.comune || 'N/D'}, Provincia di ${loc.provincia || 'N/D'}, Regione ${loc.regione || 'N/D'}`,
    `Classificazione area:  ${loc.classificazioneArea || 'N/D'}`,
    `Zona sismica:          ${loc.zonaSismica || 'N/D'}`,
    '',
    `Responsabile Unico del Progetto (RUP): ${rup.nome || 'N/D'}`,
    rup.email ? `Email: ${rup.email}` : null,
    `Data di compilazione: ${today()}`,
    '',
    sep(),
  ].filter((l): l is string => l !== null).join('\n')

  // ── Sezione 1 ───────────────────────────────────────────────────────────

  const sec1 = [
    `1. PREMESSA E QUADRO ESIGENZIALE`,
    `   [Art. 2, c.1 – Allegato I.7]`,
    `   ${sep('─', 33)}`,
    '',
    `Il presente Documento di Fattibilità delle Alternative Progettuali (DOCFAP) è redatto ai sensi dell'art. 41 del D.Lgs. 36/2023 e dell'Allegato I.7, nel rispetto dei contenuti del quadro esigenziale approvato da ${state.intervento.denominazione || "l'ente committente"}.`,
    '',
    `Il fabbisogno di riferimento è classificato come:`,
    need ? `  Codice:        ${need.code}` : null,
    need ? `  Denominazione: ${need.label}` : null,
    `  Tema Civiqa:   ${temaLabel}`,
    need?.sose_function ? `  Funzione SOSE: ${need.sose_function}` : null,
    need?.missions && need.missions.length > 0
      ? `  Missioni DUP:  ${need.missions.map((m) => `${m.code} – ${m.label}`).join('; ')}`
      : null,
    need?.rso && need.rso.length > 0
      ? `  Obiettivi UE:  ${need.rso.map((r) => `${r.code} – ${r.label}`).join('; ')}`
      : null,
    '',
    state.problema.descrizione
      ? `Il problema pubblico individuato dal RUP è il seguente:\n${state.problema.descrizione}`
      : null,
    '',
    `Il livello di urgenza dichiarato è: ${urgenzaLabel}.`,
    state.problema.documentato
      ? `\nL'evidenza documentale a supporto è sintetizzabile come segue:\n${state.problema.documentato}`
      : null,
  ].filter((l): l is string => l !== null).join('\n')

  // ── Sezione 2 ───────────────────────────────────────────────────────────

  const sec2Lines = [
    `2. ANALISI DELLO STATO DI FATTO`,
    `   [Art. 2, c.4, lett. a) – Allegato I.7]`,
    `   ${sep('─', 42)}`,
    '',
  ]

  if (szAttivo) {
    sec2Lines.push(
      `Rispetto al fabbisogno individuato, l'intervento è finalizzato al miglioramento di una copertura già esistente. Si riporta di seguito l'analisi dello stato di fatto dell'area di intervento.`,
      '',
      state.scenarioZeroNarrative,
      '',
      `In considerazione di quanto sopra esposto, il mantenimento dello stato attuale (opzione di non realizzazione, ai sensi dell'art. 2, comma 2 dell'Allegato I.7) non appare idoneo a rispondere al fabbisogno individuato nel tempo. Le alternative progettuali vengono pertanto confrontate quantitativamente nelle sezioni successive per individuare la soluzione ottimale.`,
    )
  } else {
    sec2Lines.push(
      `L'intervento è finalizzato a colmare un fabbisogno attualmente non coperto. Non sussistono servizi o infrastrutture preesistenti per la componente oggetto di intervento. L'opzione di non realizzazione, ai sensi dell'art. 2, comma 2 dell'Allegato I.7, non è pertinente in quanto equivarrebbe al permanere della condizione di assenza del servizio.`,
    )
  }

  const sec2 = sec2Lines.join('\n')

  // ── Sezione 3 ───────────────────────────────────────────────────────────

  const sec3 = [
    `3. INQUADRAMENTO TERRITORIALE`,
    `   [Art. 2, c.4, lett. b) – Allegato I.7]`,
    `   ${sep('─', 42)}`,
    '',
    `L'intervento si colloca nel territorio del ${loc.comune || 'comune'}, ${loc.provincia || 'N/D'} (${loc.regione || 'N/D'})${loc.classificazioneArea ? `, classificato come ${loc.classificazioneArea}` : ''}${loc.zonaSismica ? ` e ricadente in ${loc.zonaSismica}` : ''}.`,
    '',
    `La verifica di compatibilità con gli strumenti urbanistici vigenti e con i vincoli di settore pertinenti è a cura del RUP in sede di approfondimento progettuale.`,
  ].join('\n')

  // ── Sezione 4 ───────────────────────────────────────────────────────────

  const altLines4 = state.alternativeDefinite.map((id) => {
    const alt = state.alternative[id]
    const label = getAlternativeDisplayLabel(id, alt)
    return [
      `Alternativa ${id} – ${label}`,
      alt?.categoria ? `  Categoria MOP: ${alt.categoria}` : null,
      alt?.tipologia ? `  Tipologia di intervento: ${alt.tipologia}` : null,
      alt?.nome ? `  Nome: ${alt.nome}` : null,
    ].filter(Boolean).join('\n')
  })

  const sec4 = [
    `4. INDIVIDUAZIONE DELLE ALTERNATIVE PROGETTUALI`,
    `   [Art. 2, c.4, lett. c) – Allegato I.7]`,
    `   ${sep('─', 42)}`,
    '',
    `Sulla base del fabbisogno individuato e delle categorie MOP ammissibili (D.Lgs. 36/2023), sono state identificate le seguenti alternative progettuali:`,
    '',
    ...altLines4,
    '',
    `Le alternative sono state sviluppate in coerenza con il principio di proporzionalità (art. 2, comma 3 dell'Allegato I.7) e confrontate sulle dimensioni funzionale, tecnica, economico-finanziaria e di manutenibilità.`,
  ].join('\n')

  // ── Sezione 5 ───────────────────────────────────────────────────────────

  const altLines5 = state.alternativeDefinite.map((id) => {
    const alt = state.alternative[id]
    const label = getAlternativeDisplayLabel(id, alt)
    const durata = alt?.durataStimata ? `${alt.durataStimata} mesi` : 'N/D'
    return `  ${id}. ${label}:\n  durata cantiere stimata ${durata}, vita utile di riferimento ${orizzonte} anni.`
  })

  const sec5 = [
    `5. TEMPI DI ATTUAZIONE`,
    `   [Art. 2, c.4, lett. e) – Allegato I.7]`,
    `   ${sep('─', 42)}`,
    '',
    `I tempi previsti per l'attuazione delle alternative sono i seguenti:`,
    '',
    ...altLines5,
    '',
    `Le stime si basano sui tempi medi di realizzazione delle opere pubbliche in Italia (fonte: Agenzia per la Coesione Territoriale; Banca d'Italia QEF 538/2019) e sulla EC Guide to Cost-Benefit Analysis 2014 per i periodi di riferimento.`,
  ].join('\n')

  // ── Sezione 6 ───────────────────────────────────────────────────────────

  const altLines6 = state.alternativeDefinite.map((id) => {
    const alt = state.alternative[id]
    const label = getAlternativeDisplayLabel(id, alt)
    return [
      `Alternativa ${id} – ${label}`,
      `  CAPEX stimato:      ${formatEuro(alt?.capex)}`,
      `  OPEX annuo:         ${formatEuro(alt?.opex)}`,
      `  Tasso di sconto:    ${tassoSconto.toFixed(1)}%`,
      `  Periodo di analisi: ${orizzonte} anni`,
    ].join('\n')
  })

  const sec6 = [
    `6. STIMA SOMMARIA DEI COSTI`,
    `   [Art. 2, c.4, lett. f) – Allegato I.7]`,
    `   ${sep('─', 42)}`,
    '',
    `La stima dei costi è stata effettuata mediante l'adozione di prezzi parametrici, come previsto dall'art. 2, comma 4, lett. f) dell'Allegato I.7.`,
    '',
    ...altLines6,
    '',
    `I costi parametrici sono derivati dalla base dati OpenCoesione e dal database CER (Costi Elementari di Riferimento) di OpenEconomics, calibrati per area geografica${loc.areaGeograficaCer ? ` ${loc.areaGeograficaCer}` : ''} e tipologia di intervento.`,
  ].join('\n')

  // ── Sezione 7 ───────────────────────────────────────────────────────────

  const altLines7 = ranking.map((row) => {
    const label = getAlternativeDisplayLabel(row.alternativaId, state.alternative[row.alternativaId])
    return [
      `Alternativa ${row.alternativaId} – ${label}`,
      `  VANE (Valore Attuale Netto Economico):  ${formatEuro(row.van)}`,
      `  BCR (Rapporto Benefici/Costi):          ${fmt2(row.bcr)}`,
      `  TIRE (Tasso Interno di Rendimento Ec.): ${fmtPct(row.tir)}`,
    ].join('\n')
  })

  const sec7 = [
    `7. ANALISI DEI BENEFICI SOCIALI`,
    `   ${sep('─', 33)}`,
    '',
    `Per ciascuna alternativa è stata condotta un'analisi costi-benefici (CBA) secondo la metodologia della Commissione Europea (EC Guide to CBA 2014), con tasso di sconto sociale del ${tassoSconto.toFixed(1)}% per l'Italia (EC Guide §2.8.3).`,
    '',
    `Gli indicatori principali di ciascuna alternativa sono:`,
    '',
    ...altLines7,
  ].join('\n')

  // ── Sezione 8 ───────────────────────────────────────────────────────────

  const W = DEFAULT_DIMENSION_WEIGHTS
  const altLines8 = ranking.map((row) => {
    const label = getAlternativeDisplayLabel(row.alternativaId, state.alternative[row.alternativaId])
    return [
      `Alternativa ${row.alternativaId} – ${label}`,
      `  ┌─────────────────────────────────────────┐`,
      `  │ Score CBA:          ${fmt1(row.cbaScore).padStart(6)}/100          │`,
      `  │ Score MCA:          ${fmt1(row.mcaScore).padStart(6)}/100          │`,
      `  │ Score Sensitività:  ${fmt1(row.sensitivityScore).padStart(6)}/100          │`,
      `  │ Score Impatto:      ${fmt1(row.impattoScore).padStart(6)}/100          │`,
      `  ├─────────────────────────────────────────┤`,
      `  │ SCORE FINALE:       ${fmt1(row.scoreFinale).padStart(6)}/100          │`,
      `  └─────────────────────────────────────────┘`,
    ].join('\n')
  })

  const mitigazioniText = Object.entries(state.rischiMitigazioni)
    .filter(([, v]) => v.trim().length > 0)
    .map(([id, v]) => `  – ${id}: ${v}`)
    .join('\n')

  const sec8 = [
    `8. ANALISI COMPARATIVA MULTI-CRITERIO`,
    `   [Art. 2, c.4, lett. g) – Allegato I.7]`,
    `   ${sep('─', 42)}`,
    '',
    `Il confronto comparato delle alternative è stato effettuato mediante un sistema integrato di valutazione articolato su quattro dimensioni:`,
    '',
    `  I.   Analisi Costi-Benefici (Score CBA)         → peso ${W.wCBA}%`,
    `  II.  Analisi Multi-Criterio (Score MCA)          → peso ${W.wMCA}%`,
    `  III. Analisi di Sensitività (Score Sensitività)  → peso ${W.wSENS}%`,
    `  IV.  Analisi d'Impatto (Score Impatto)           → peso ${W.wIMP}%`,
    '',
    `I pesi sono stati configurati dal RUP in coerenza con la natura e la dimensione dell'intervento.`,
    '',
    `I risultati della valutazione comparata sono i seguenti:`,
    '',
    ...altLines8,
    '',
    mitigazioniText
      ? `Per quanto concerne l'analisi dei rischi, le principali misure di mitigazione individuate sono le seguenti:\n${mitigazioniText}\n`
      : null,
    `L'alternativa che presenta il miglior rapporto complessivo tra costi e benefici, ai sensi dell'art. 2, comma 7 dell'Allegato I.7, è: ${recommendedLabel}, con uno Score Finale pari a ${recommended ? fmt1(recommended.scoreFinale) : 'N/D'}/100.`,
  ].filter((l): l is string => l !== null).join('\n')

  // ── Sezione 9 ───────────────────────────────────────────────────────────

  const sec9 = [
    `9. SCELTA DEL RUP E MOTIVAZIONE`,
    `   [Art. 2, c.7 e c.9 – Allegato I.7]`,
    `   ${sep('─', 38)}`,
    '',
    `Sulla base dell'istruttoria condotta e del confronto comparato di cui alla sezione precedente, il RUP ${rup.nome || 'N/D'} ha individuato quale soluzione preferita:`,
    '',
    `  → ${selectedLabel}`,
    '',
    decisione?.coerente
      ? `La scelta è coerente con la raccomandazione emergente dall'analisi comparativa multi-criterio.`
      : `La scelta si discosta dalla raccomandazione emergente dall'analisi comparativa. Il RUP motiva la scelta come segue:`,
    '',
    `Motivazione:`,
    decisione?.motivazione || 'Motivazione non disponibile.',
  ].join('\n')

  // ── Sezione 10 ──────────────────────────────────────────────────────────

  const sec10 = [
    `10. DISPOSIZIONI FINALI`,
    `    ${sep('─', 22)}`,
    '',
    `Il presente DOCFAP, redatto ai sensi dell'art. 2 dell'Allegato I.7 al D.Lgs. 36/2023, costituisce documento prodromico alla redazione del Documento di Indirizzo alla Progettazione (DIP) di cui all'art. 3 del medesimo Allegato.`,
    '',
    `Il committente approva il presente DOCFAP con propria determinazione, ai sensi dell'art. 2, comma 9 dell'Allegato I.7.`,
    '',
    `Gli schemi grafici descrittivi delle alternative (art. 2, c.4, lett. d) e la documentazione di inquadramento territoriale (corografia, stralcio urbanistico, eventuale carta del rischio archeologico – art. 2, c.4, lett. b) sono allegati al presente documento ove pertinenti e disponibili.`,
  ].join('\n')

  // ── Footer ──────────────────────────────────────────────────────────────

  const footer = [
    sep('─', 57),
    `Documento generato con Civiqa · OpenEconomics`,
    `Analisi condotta il ${today()}`,
    `La presente bozza può essere integrata o modificata dal RUP`,
    `prima della generazione finale e dell'approvazione formale.`,
    sep('─', 57),
  ].join('\n')

  return [header, sec1, sec2, sec3, sec4, sec5, sec6, sec7, sec8, sec9, sec10, footer]
    .join('\n\n\n')
}

// ── Component ───────────────────────────────────────────────────────────────

export function Step7_GeneraDocfap() {
  const { state } = useWizard()
  const [docfapDraft, setDocfapDraft] = useState('')

  const canGenerate = isDecisioneCompleta(
    state.decisioneRUP
      ? {
          alternativaScelta: state.decisioneRUP.alternativaScelta,
          motivazione: state.decisioneRUP.motivazione,
        }
      : null,
  )

  const generatedNarrative = useMemo(() => buildDocfapNarrative(state), [state])

  useEffect(() => {
    setDocfapDraft((current) => {
      if (!current.trim()) return generatedNarrative
      return current
    })
  }, [generatedNarrative])

  const handleSaveDraft = () => {
    window.sessionStorage.setItem('civiqa.wizard.store.v2', JSON.stringify(state))
  }

  const handleResetNarrative = () => {
    setDocfapDraft(generatedNarrative)
  }

  return (
    <div style={rootStyle}>
      <section style={editorSectionStyle}>
        <div style={headerStyle}>
          <div>
            <h3 style={sectionTitleStyle}>Bozza DOCFAP modificabile</h3>
            <p style={introStyle}>
              Il testo è precompilato secondo la struttura dell'Art. 2, Allegato I.7 con i dati dell'analisi. Puoi modificarlo prima dell'export finale.
            </p>
          </div>
          <div style={actionsWrapStyle}>
            <Button variant="secondary" onClick={handleResetNarrative} ariaDisabled={!canGenerate}>
              Ripristina testo proposto
            </Button>
            <Button variant="secondary" onClick={handleSaveDraft}>
              Salva bozza
            </Button>
          </div>
        </div>

        {!canGenerate && (
          <span style={warningStyle}>
            Completa la decisione RUP per ottenere una bozza narrativa coerente con la scelta finale.
          </span>
        )}

        <Textarea
          label="Testo DOCFAP"
          description="Struttura redazionale generata automaticamente — Art. 2, Allegato I.7, D.Lgs. 36/2023."
          helperText="Puoi modificare direttamente il testo, integrando o riscrivendo i passaggi che ritieni opportuni."
          rows={32}
          maxLength={DOCFAP_MAX}
          value={docfapDraft}
          onChange={setDocfapDraft}
        />
      </section>
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────

const rootStyle: CSSProperties = { display: 'grid', gap: 'var(--spacing-stack-m)' }
const editorSectionStyle: CSSProperties = { display: 'grid', gap: 'var(--spacing-stack-s)' }
const headerStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-inline-s)', flexWrap: 'wrap' }
const sectionTitleStyle: CSSProperties = { margin: 0, color: 'var(--color-text-primary)' }
const introStyle: CSSProperties = { margin: '4px 0 0', color: 'var(--color-text-primary-light)' }
const actionsWrapStyle: CSSProperties = { display: 'flex', gap: 'var(--spacing-inline-s)', alignItems: 'center', flexWrap: 'wrap' }
const warningStyle: CSSProperties = { color: 'var(--color-text-warning)', fontSize: 'var(--type-body-xs-size, 14px)' }
