# OpenCore — Scenario Zero: Domande di Contesto
> Catalogue of context questions for DOCFAP Scenario Zero narrative generation  
> Civiqa OpenCore v1 — May 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Analyst creation flow](#analyst-creation-flow)
3. [Data contract](#data-contract)
4. [Text assembly logic](#text-assembly-logic)
5. [Architectural decisions](#architectural-decisions)
6. [Question catalogue](#question-catalogue)
7. [Usage notes](#usage-notes)

---

## Overview

`SZContextQuestion` is the catalogue of Scenario Zero questions shown to the officer in the DOCFAP wizard. Unlike `ContextQuestion` in `domande_contesto.ts` (which activates KPIs via `is_activating`), these questions capture the **as-is situation of an unsatisfied fabbisogno** — why this specific municipality, for this specific territorial need, is deciding to invest.

Each answer carries a `text_fragment`: a sentence fragment that is substituted into the fabbisogno's `narrative_template` to assemble a readable justification paragraph. The output is not a boolean activation signal — it is a piece of Italian prose that becomes part of the formal CBA report.

### What this table is not

The Scenario Zero is deliberately **not** a quantitative analysis tool. It does not:
- Activate or exclude KPIs
- Contribute to VANE, BCR, or TIRE calculations
- Produce a ranking score
- Require the officer to look up data or numbers

Its sole function is to generate the **"Analisi dello Scenario di Riferimento"** section required by Allegato I.7, Art. 2, c.4a of D.Lgs. 228/2011 — the description of the baseline state and the projected consequences of non-intervention that precedes the quantitative comparison of alternatives.

### Design rationale: why qualitative

The DOCFAP user is a PA official, typically a technician or a responsible of service delivery, not an economist or a domain expert. Asking for quantitative as-is indicators would require data that most small/medium municipalities do not have at hand. The qualitative approach trades precision for completion: the officer can always answer, because the questions describe recognizable situations rather than requiring measurements.

The **Data Room** is the quantitative layer. The Scenario Zero is the narrative layer. They are complementary, not redundant.

### How this table relates to domande_contesto.ts

| Dimension | `domande_contesto.ts` | `sz_domande_contesto.ts` |
|---|---|---|
| Purpose | KPI activation | Narrative text generation |
| Key payload field | `is_activating: boolean` | `text_fragment: string` |
| Scope | KPI engine (`kpi_activation`) | DOCFAP wizard (`scenario_zero`) |
| Reusability | Reusable across categories | 1:1 with fabbisogno |
| Output | Boolean activation of KPIs | Assembled Italian prose paragraph |
| CBA contribution | Activates social benefit KPIs | None — purely narrative |

### Metrics

| Metric | Value |
|---|---|
| Records | 151 questions across 63 fabbisogni |
| Radio questions | 108 |
| Checkbox questions | 43 |
| Answer options total | 541 |
| Fabbisogni covered | 63/63 |
| Questions per fabbisogno | 1–5 (median 2–3) |

---

## Analyst creation flow

To add or modify Scenario Zero questions, the analyst follows these steps in the Civiqa backoffice:

**Step 1 — Identifica il fabbisogno**  
Identify the `FAB-NN` code to work on. Each fabbisogno has its own independent set of questions. Questions are never shared across fabbisogni.

**Step 2 — Individua i nodi narrativi**  
Map the 3–5 narrative nodes that build the AS-IS case for this specific fabbisogno:
- What is the specific problem? (trigger)
- What makes it urgent in this territory? (context/evidence)
- What has been done so far and why is it insufficient? (residual gap)
- What happens if nothing is done? (consequence of inaction)

Not all fabbisogni require all four nodes. Complex fabbisogni (e.g. FAB-01 Sicurezza idrogeologica) need 5 questions to establish risk type, regulatory classification, event history, exposed elements, and existing defences. Simple fabbisogni (e.g. FAB-36 Zootecnia, FAB-39 Pesca) can be captured in a single well-structured question.

**Step 3 — Crea la domanda**  
Assign the next sequential ID following the pattern `DC-SZ-NNN-NN`:
- `NNN` = zero-padded fabbisogno number (001–063)
- `NN` = zero-padded sequence within the fabbisogno (01, 02, …)

Write the `question` field in Italian, addressed to a PA official. The question should name the specific domain context, not a generic concept. Compare:

| Too generic ❌ | Domain-specific ✅ |
|---|---|
| "Com'è lo stato dell'infrastruttura?" | "Esistono opere di difesa idrogeologica a protezione dell'area e qual è la loro condizione?" |
| "Quali sono le criticità?" | "Quali non conformità presenta l'edificio scolastico che motivano l'intervento?" |
| "L'ente ha già fatto qualcosa?" | "L'ente ha già realizzato interventi parziali di efficientamento su questo edificio?" |

**Step 4 — Scegli il tipo di risposta**  
- `radio` — when the answer is mutually exclusive: the territory falls in exactly one seismic zone; the main cause of energy inefficiency can be named as the single dominant one.
- `checkbox` — when multiple answers can legitimately apply simultaneously: a territory can be exposed to both frane and alluvioni; a school building can have multiple non-conformities at once.

**Step 5 — Inserisci le risposte** *(repeated for each answer)*  
For each answer option:
- `code` — a stable slug in snake_case. Never changed after first deployment.
- `label` — Italian UI text. Can be updated.
- `text_fragment` — the sentence fragment inserted into the narrative template. Write in third person, as if the report is describing the municipality's situation. The fragment must connect grammatically with the surrounding template text.

**Step 6 — Aggiorna il narrative_template**  
Add the placeholder `{DC-SZ-NNN-NN}` at the appropriate position in the fabbisogno's `narrative_template` (in `ZeroScenarioCategory`). The template engine will replace it with the assembled fragment at report generation time.

---

## Data contract

```typescript
export interface SZAnswer {
  code: string;          // stable slug — never rename after creation
  label: string;         // Italian UI label shown to the officer
  text_fragment: string; // narrative sentence fragment for template assembly
}

export interface SZContextQuestion {
  id: string;                  // "DC-SZ-NNN-NN" — stable, never renumber
  fabbisogno_code: string;     // FK → FAB-NN (1:1 — not reused across fabbisogni)
  question: string;            // question text shown in the wizard (Italian)
  type: 'radio' | 'checkbox'; // radio = single answer, checkbox = multi-answer
  answers: SZAnswer[];         // ordered list of all available answers
  order: number;               // display sequence within the fabbisogno (1-based)
  notes: string | null;        // guidance for analyst (not shown to officer)
}
```

### Lookup and assembly helpers

```typescript
// Get all questions for a given fabbisogno, sorted by order
getQuestionsForFabbisogno(fabCode: string): SZContextQuestion[]

// Get a single question by ID
SZ_QUESTION_MAP.get(id: string): SZContextQuestion | undefined

// Get all fabbisogno codes that have at least one question
getCoveredFabbisogni(): string[]

// Assemble the text fragment from a user's answer to a single question
// radio:    returns the text_fragment of the single selected answer
// checkbox: returns text_fragments joined with ", "
assembleFragment(
  question: SZContextQuestion,
  userAnswer: string | string[]
): string

// Replace all {DC-SZ-NNN-NN} placeholders in a template with assembled fragments
assembleNarrative(
  template: string,
  answers: Map<string, string | string[]>
): string
```

---

## Text assembly logic

### Single question — radio

The officer selects one answer. The engine retrieves the `text_fragment` of that answer and inserts it at the `{id}` placeholder in the template.

```
Officer selects 'r3' for DC-SZ-001-02
  → SZAnswer { code: 'r3', text_fragment: "L'area è classificata a rischio elevato (R3)..." }
  → template placeholder {DC-SZ-001-02} replaced with that sentence
```

### Single question — checkbox

The officer selects one or more answers. The engine retrieves the `text_fragment` of each selected answer and joins them with `", "`. The result replaces the `{id}` placeholder.

```
Officer selects ['frane', 'alluvioni'] for DC-SZ-001-01
  → frane:     text_fragment = "rischio di frane e dissesto di versante"
  → alluvioni: text_fragment = "rischio alluvionale con episodi di esondazione e allagamento"
  → joined = "rischio di frane e dissesto di versante, rischio alluvionale..."
  → template: "...è esposto a {DC-SZ-001-01}." → "...è esposto a rischio di frane..."
```

### Full narrative assembly

The `narrative_template` in `ZeroScenarioCategory` contains multiple `{DC-SZ-NNN-NN}` placeholders — one per question configured for that fabbisogno. The assembly engine processes each placeholder in order of appearance, substituting the assembled fragment for each question.

**Example — FAB-01, scenario grave:**

```
Answers:
  DC-SZ-001-01 → ['frane', 'alluvioni']
  DC-SZ-001-02 → 'r3'
  DC-SZ-001-03 → 'eventi_recenti'
  DC-SZ-001-04 → ['abitazioni', 'infrastrutture']
  DC-SZ-001-05 → 'insufficienti'

Template:
  "Il territorio interessato dall'intervento è esposto a {DC-SZ-001-01}.
  {DC-SZ-001-02}. {DC-SZ-001-03}.
  Tra gli elementi esposti al rischio si rilevano: {DC-SZ-001-04}.
  {DC-SZ-001-05}. Senza un intervento..."

Output:
  "Il territorio interessato dall'intervento è esposto a rischio di frane
  e dissesto di versante, rischio alluvionale con episodi di esondazione
  e allagamento. L'area è classificata a rischio elevato (R3), con la
  presenza di elementi esposti per i quali è possibile un danno
  significativo. Il territorio ha subito eventi idrogeologici
  significativi negli ultimi dieci anni, con danni documentati a
  persone, edifici o infrastrutture. Tra gli elementi esposti al rischio
  si rilevano: abitazioni e nuclei familiari residenti nell'area a
  rischio, infrastrutture viarie e reti di servizio la cui interruzione
  isolerebbe parti del territorio. Sono presenti opere di difesa
  realizzate in passato, ma risultano insufficienti rispetto al livello
  di rischio attuale. Senza un intervento di messa in sicurezza..."
```

### Frase ponte normativa

Every narrative template closes with a fixed paragraph (not assembled from fragments):

> *"L'analisi dello stato di fatto e la proiezione dello scenario di non intervento evidenziano la necessità di procedere con l'investimento. Le alternative progettuali vengono di seguito confrontate quantitativamente per individuare la soluzione ottimale."*

This sentence is the structural bridge between the qualitative Scenario Zero section and the quantitative comparison of alternatives. It is hardcoded in the template engine and not configurable per fabbisogno.

---

## Architectural decisions

**[D-SZ-01] Lo SZ non produce attivazione KPI — produce testo.**  
La differenza fondamentale rispetto a `domande_contesto.ts` è la natura dell'output. Le DC producono un segnale booleano (`is_activating`) che filtra i KPI inclusi nel calcolo CBA. Le SZ producono un paragrafo in prosa italiana che va nella relazione. Sono due sistemi paralleli con scopi completamente diversi, che condividono il contenitore del wizard DOCFAP ma non la logica.

**[D-SZ-02] Le domande sono 1:1 con i fabbisogni — non sono riusabili.**  
Le DC sono progettate per essere riusabili: DC-001 (localizzazione) si applica a decine di categorie di intervento diverse. Le SZ non funzionano così: la domanda "Quali non conformità presenta l'edificio scolastico?" è specifica di FAB-54 e non ha senso su FAB-01. La scelta di non riusabilità semplifica la manutenzione (ogni fabbisogno è autonomo) e garantisce che ogni domanda sia effettivamente calibrata sul contesto specifico.

**[D-SZ-03] Il `text_fragment` deve essere grammaticalmente connettibile.**  
A differenza di `is_activating` (booleano), il `text_fragment` deve essere scritto dall'analista in modo che si inserisca correttamente nella frase del template. L'analista deve leggere il template mentre scrive i frammenti. Il test è: sostituendo il frammento nel template, la frase risultante è italiana corretta, fluente e non ridondante?

**[D-SZ-04] Il tipo `checkbox` giustappone i frammenti — non li somma.**  
Per una domanda checkbox, l'engine unisce i frammenti delle risposte selezionate con `", "`. Questo significa che i frammenti devono essere scritti come **enumerazioni nominali** (non come frasi complete), perché verranno elencati uno dopo l'altro. Il template deve prevedere la struttura "si rilevano: {placeholder}." per gestire questa giustapposizione.

Contrariamente alla logica DC (dove checkbox usa AND-all-true), la logica SZ per checkbox è inclusiva: ogni risposta selezionata contribuisce al testo. Non c'è un concetto di risposta "escludente" — tutte le risposte contribuiscono al racconto.

**[D-SZ-05] Lo SZ non partecipa al ranking delle alternative.**  
È stato esplicitamente deciso (D-SZ-02 e D-SZ-03 delle decisioni di sessione) che lo SZ non produce un VANE_A0 né una componente numerica comparabile con le alternative. L'Opzione Zero nel ranking è un'alternativa qualitativa (non intervenire = fabbisogno rimane insoddisfatto), non un'opzione con VANE negativo da minimizzare. Questo è coerente con la norma: l'Art. 2, c.4a chiede la descrizione dello scenario di riferimento, non la sua quantificazione.

**[D-SZ-06] Il numero di domande per fabbisogno riflette la complessità narrativa.**  
I fabbisogni infrastrutturali complessi (FAB-01, FAB-02, FAB-15, FAB-54) hanno 5 domande perché il caso narrativo richiede più dimensioni per essere convincente: tipo di rischio, classificazione, eventi storici, elementi esposti, risposta istituzionale. I fabbisogni più circoscritti (FAB-36, FAB-39, FAB-41, FAB-57) possono essere catturati in 1 domanda ben costruita. Non esiste un numero fisso — l'analista aggiunge domande finché il testo generato racconta una storia completa e specifica.

**[D-SZ-07] Le domande devono essere rispondibili senza dati.**  
Il funzionario comunale è il target user, non un tecnico di settore. Le domande sono progettate per essere rispondibili a scelta multipla, basandosi sulla conoscenza operativa del territorio. Non si chiede "qual è il tasso di dispersione scolastica?" ma "l'abbandono scolastico è superiore alla media?". Non si chiede "qual è la classe energetica dell'edificio?" ma "quali sono le cause principali dell'inefficienza?". Questo vincolo è non negoziabile: il sistema deve funzionare in comuni senza ufficio statistico.

**[D-SZ-08] Il `code` delle risposte è permanente — la `label` no.**  
Stessa regola di `domande_contesto.ts`: il `code` viene referenziato dall'engine di assemblaggio a runtime (per recuperare il `text_fragment` corrispondente). Deve rimanere invariato dopo il primo deployment. La `label` è display-only. Il `text_fragment` può essere aggiornato per migliorare la qualità del testo, ma deve mantenere la stessa struttura grammaticale per non rompere i template esistenti.

**[D-SZ-09] La frase ponte normativa è fissa — non è un frammento assemblato.**  
Il paragrafo conclusivo che collega lo SZ alla comparazione quantitativa delle alternative è hardcoded nell'engine e non configurabile per fabbisogno. La motivazione è doppia: (a) è una formula normativa con un significato preciso che non deve variare, e (b) la sua presenza garantisce strutturalmente la continuità logica tra la sezione narrativa e quella analitica del documento.

---

## Question catalogue

Le 151 domande sono distribuite su tutti i 63 fabbisogni. La tabella riporta per ogni fabbisogno il numero di domande e i temi narrativi coperti.

| FAB | Label | Q | Temi narrativi delle domande |
|---|---|---|---|
| FAB-01 | Sicurezza idrogeologica | 5 | Tipo rischio · Classificazione PAI/PGRA · Storico eventi · Elementi esposti · Opere di difesa esistenti |
| FAB-02 | Adeguamento sismico edifici | 5 | Funzione edificio · Zona sismica · Verifica vulnerabilità · Caratteristiche costruttive · Stato di esercizio |
| FAB-03 | Ricostruzione post-calamità | 4 | Tipo evento · Dichiarazione emergenza · Stato ricostruzione · Funzioni compromesse |
| FAB-04 | Bonifica siti inquinati | 4 | Origine contaminazione · Caratterizzazione ambientale · Matrici interessate · Effetti su salute/ambiente |
| FAB-05 | Qualità ecologica corpi idrici | 3 | Tipo corpo idrico e problema · Fonti di pressione · Piano di gestione |
| FAB-06 | Approvvigionamento idrico | 4 | Problema principale · Interruzioni servizio · Stato rete e impianti · Inserimento programmatico |
| FAB-07 | Depurazione acque reflue | 3 | Criticità principale · Procedimenti infrazione/diffida · Effetti sull'ambiente |
| FAB-08 | Reti idriche industriali | 3 | Situazione approvvigionamento · Impatto su sviluppo produttivo · Sistema reflui |
| FAB-09 | Reti idriche agricole | 3 | Situazione irrigazione · Effetti su produzione · Inserimento programmatico |
| FAB-10 | Gestione rifiuti urbani | 3 | Criticità principale · Conseguenze · Iniziative avviate |
| FAB-11 | Tutela biodiversità | 3 | Criticità principale · Forme di protezione · Strumenti di gestione |
| FAB-12 | Verde urbano | 3 | Carenza principale · Effetti sulla vita urbana · Pianificazione e aree |
| FAB-13 | Patrimonio forestale | 2 | Criticità principale · Storico eventi dannosi |
| FAB-14 | Modernizzazione reti energetiche | 3 | Criticità principale · Conseguenze · Inserimento programmatico |
| FAB-15 | Efficienza energetica edifici | 5 | Funzione edificio · Cause inefficienza · Obblighi normativi · Conseguenze concrete · Interventi parziali |
| FAB-16 | Transizione energetica | 3 | Fonti emissioni · Impegni assunti · Azioni già intraprese |
| FAB-17 | Produzione FER locale | 3 | Stato attuale FER · Fonte da sviluppare · Ostacoli finora |
| FAB-18 | Rigenerazione urbana | 3 | Tipo area degradata · Manifestazioni del degrado · Percorso di rigenerazione |
| FAB-19 | Riconversione aree dismesse | 3 | Stato area dismessa · Effetti negativi · Domanda/progetto riutilizzo |
| FAB-20 | Sicurezza rete stradale | 3 | Criticità principali · Incidenti/reclami · Piano manutenzione |
| FAB-21 | Accessibilità aree rurali | 2 | Tipo problema accessibilità · Effetti su spopolamento e servizi |
| FAB-22 | Accessibilità sovralocale | 2 | Problema di collegamento · Effetti economici |
| FAB-23 | Mobilità ciclabile | 2 | Situazione attuale · Domanda insoddisfatta |
| FAB-24 | Accessibilità contesti specifici | 2 | Tipo contesto specifico · Disagi prodotti |
| FAB-25 | TPL e accessibilità urbana | 2 | Criticità TPL · Conseguenze sulla mobilità |
| FAB-26 | Trasporto aereo | 2 | Situazione infrastruttura · Rilevanza economica |
| FAB-27 | Accessibilità ferroviaria | 2 | Criticità infrastruttura ferroviaria · Domanda insoddisfatta |
| FAB-28 | Infrastrutture portuali | 2 | Criticità portuale/idrovie · Attività economiche dipendenti |
| FAB-29 | Logistica merci | 2 | Problema logistico principale · Effetti economici/ambientali |
| FAB-30 | Demanio marittimo/lacustre | 2 | Problema di fruizione · Rilevanza economica |
| FAB-31 | Conservazione patrimonio culturale | 3 | Tipo di bene · Stato di conservazione · Vincoli Soprintendenza |
| FAB-32 | Accesso alla cultura | 2 | Carenza principale · Categorie penalizzate |
| FAB-33 | Sviluppo turistico | 2 | Ostacolo principale · Tipo di turismo da sviluppare |
| FAB-34 | Sviluppo aree produttive | 2 | Criticità dell'area · Effetti sull'economia |
| FAB-35 | Filiere agroalimentari | 2 | Criticità della filiera · Struttura della domanda |
| FAB-36 | Produzioni zootecniche | 1 | Standard benessere animale e obblighi normativi |
| FAB-37 | Diversificazione agricola | 1 | Esigenza di diversificazione e potenziale inespresso |
| FAB-38 | Presidio agro-forestale | 2 | Criticità principale · Strumenti di gestione collettiva |
| FAB-39 | Pesca e acquacoltura | 1 | Criticità principale del settore (infrastrutture, trasformazione) |
| FAB-40 | Vitalità commerciale | 2 | Criticità del tessuto commerciale · Effetti sulla comunità |
| FAB-41 | Infrastrutture ricerca | 1 | Carenza strutturale nel territorio |
| FAB-42 | Impresa sociale | 1 | Situazione terzo settore e spazi disponibili |
| FAB-43 | Disagio abitativo | 2 | Manifestazione del disagio · Effetti sociali documentati |
| FAB-44 | Inclusione sociale | 2 | Condizioni di vulnerabilità presenti · Servizi carenti |
| FAB-45 | Aggregazione sociale | 2 | Carenza principale · Attività da ospitare |
| FAB-46 | Non autosufficienza anziani | 2 | Criticità assistenziale · Fattori aggravanti nel territorio |
| FAB-47 | Autonomia disabilità | 2 | Criticità principale · Strutture/servizi esistenti |
| FAB-48 | Protezione minori e famiglie | 2 | Criticità principale · Fattori di rischio presenti |
| FAB-49 | Accessibilità servizi sanitari | 2 | Criticità principale · Effetti sulla popolazione |
| FAB-50 | Prevenzione collettiva | 2 | Criticità principale · Rischi specifici presenti |
| FAB-51 | Posti nido 0-3 | 2 | Situazione servizi 0-3 · Effetti sulla partecipazione lavorativa |
| FAB-52 | Posti scuola infanzia 3-6 | 2 | Situazione scuola infanzia · Causa della carenza |
| FAB-53 | Capacità scolastica 6-18 | 2 | Criticità di capacità · Trend (stabile/peggioramento/riorg.) |
| FAB-54 | Qualità edifici scolastici | 5 | Non conformità specifiche · Zona sismica · Indagini diagnostiche · Impatto sull'attività · Interventi parziali |
| FAB-55 | Offerta universitaria | 1 | Carenza/inadeguatezza dell'offerta universitaria locale |
| FAB-56 | Formazione professionale | 2 | Criticità della formazione · Effetti sull'occupazione |
| FAB-57 | Sostegno occupazione | 1 | Criticità occupazionale principale (disoccupazione, NEET, crisi) |
| FAB-58 | Sport e attività fisica | 2 | Carenza strutture sportive · Effetti sulla comunità |
| FAB-59 | Spazi pubblici urbani | 2 | Criticità spazi pubblici · Inserimento in progetto più ampio |
| FAB-60 | Sicurezza urbana | 2 | Criticità di sicurezza · Misure già adottate |
| FAB-61 | Connettività digitale | 2 | Situazione connettività · Effetti del digital divide |
| FAB-62 | Digitalizzazione servizi | 2 | Stato digitalizzazione · Obblighi normativi non soddisfatti |
| FAB-63 | Modernizzazione PA | 2 | Criticità macchina amministrativa · Effetti sul servizio al cittadino |

---

## Usage notes

**ID permanenza.** Gli `id` delle domande (`DC-SZ-NNN-NN`) e i `code` delle risposte sono permanenti dal primo deployment. Il `text_fragment` può essere migliorato redazionalmente, ma deve mantenere la stessa struttura grammaticale rispetto al `narrative_template` che lo referenzia. Modificare la struttura di un frammento senza aggiornare il template produce testi malformati.

**Domande con 1 sola risposta per fabbisogno.** I fabbisogni con 1 domanda (FAB-36, FAB-37, FAB-39, FAB-41, FAB-42, FAB-55, FAB-57) non sono incompleti — per questi domini il caso narrativo AS-IS si esaurisce in una singola dimensione. Non aggiungere domande artificiali solo per uniformare il numero. Il wizard non impone un numero minimo.

**Checkbox: i frammenti devono essere enumerabili.** Per le domande di tipo checkbox, i frammenti vengono giustapposti con `", "`. Scrivere frammenti come sintagmi nominali o gerundivi (non frasi complete con soggetto), in modo che la lista risultante sia grammaticalmente corretta. Il template deve anticipare la struttura con un'introduzione del tipo "si rilevano:" o "tra gli elementi esposti:".

**Radio: il frammento può essere una frase completa.** Per le domande di tipo radio, il frammento sostituisce integralmente il placeholder. Può essere una frase con soggetto e predicato (es. "L'area è classificata a rischio elevato (R3)..."), perché non verrà affiancata ad altri frammenti.

**Frase ponte normativa.** La frase conclusiva è fissa e hardcoded: non è nel catalogo domande e non ha un `DC-SZ` ID. Non va inserita come frammento di una domanda.

**Domande vs. Data Room.** Le SZ non devono duplicare ciò che è già mostrato nella Data Room. Il Data Room mostra indicatori quantitativi sul territorio — la SZ cattura la percezione qualitativa del funzionario sulla situazione specifica che motiva l'intervento. Se un territorio ha un alto indice di vecchiaia misurato nel Data Room, la SZ non lo chiede di nuovo: chiede qual è la criticità assistenziale concreta che ne deriva.

**Manutenzione futura.** Quando viene aggiunto un nuovo fabbisogno alla tassonomia, l'analista deve aggiungere il corrispondente set di domande SZ prima di rendere il fabbisogno disponibile nel wizard DOCFAP. Il check `getCoveredFabbisogni()` permette di verificare che tutti i fabbisogni attivi abbiano almeno una domanda SZ configurata.

---

*OpenCore Scenario Zero Domande di Contesto · schema v1 · Civiqa · May 2026*
