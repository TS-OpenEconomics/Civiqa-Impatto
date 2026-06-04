# Input Params Registry — Guida Integrazione DOCFAP

## Cos'è questo file

`input_params_registry.ts` è il **dizionario di traduzione** tra i codici tecnici Databricks (es. `com_pct_unemploymentrate_15_64_y`) e le etichette leggibili dal funzionario comunale (es. "Tasso di disoccupazione 15–64 anni"). Contiene 66 record, uno per ogni variabile territoriale usata nelle formule di costo parametrico (CP) e beneficio (KPI) del motore CBA.

Ogni record ha quattro campi utili al frontend:

| Campo | Scopo | Esempio |
|---|---|---|
| `code` | Chiave tecnica per join con Databricks e formule L2 | `com_pct_unemploymentrate_15_64_y` |
| `label` | Etichetta breve da mostrare in UI | Tasso di disoccupazione 15–64 anni |
| `question` | Domanda in linguaggio naturale per tooltip/helper | Qual è il tasso di disoccupazione nel tuo comune nella fascia 15–64 anni? |
| `udm` | Unità di misura | % |

Il campo `auto: true` è costante su tutti i 66 record: nessun parametro richiede digitazione manuale. Il Data Room precompila tutto alla selezione del comune.

## Principio architetturale

Le formule CBA classificano le loro variabili in quattro tabelle: `input_params`, `statistics`, `fixed_params`, `cost_factors` (o `monetization_factors`). L'etichetta "input_params" è una convenzione del team Evaluation, non un'indicazione di UX. In realtà queste variabili sono **dati territoriali già disponibili in Databricks**, identici alle `statistics` — cambia solo il ruolo nella formula (driver di dimensionamento vs. contesto statistico).

La conseguenza per il prodotto è che il DOCFAP non ha bisogno di un form di inserimento dati: tutto si risolve con una query al Data Room filtrata sul codice ISTAT del comune selezionato.

## Dove si colloca nel flusso DOCFAP

```
Passo 0: Selezione comune
         ↓
         Sistema carica tutti i 66 input_params da Databricks
         per il codice ISTAT selezionato
         ↓
Passo 1: Selezione categoria di intervento (C###)
         ↓
         input_params_by_category.ts filtra i parametri rilevanti
         ↓
         input_params_registry.ts traduce i codici in label/domande
         ↓
Passo 2: Selezione tipologia (nuova realizzazione, ristrutturazione, ecc.)
         ↓
         costi_per_tipologia.ts calcola min/max/med
         ↓
         Le formule CP e KPI si risolvono automaticamente
         ↓
         Frontend mostra: costo stimato + benefici attesi + note + fonti
```

## Come usarlo nel codice

### 1. Caricare i dati territoriali al Passo 0

Quando il funzionario seleziona il comune, il sistema esegue una query Databricks che restituisce un oggetto chiave-valore con i valori correnti di tutti i 66 parametri:

```typescript
// Pseudocodice — il servizio Databricks restituisce questo
const datiComune: Record<string, number> = {
  "com_pct_unemploymentrate_15_64_y": 8.3,
  "com_sum_obsvalue_poptotale_y": 56533,
  "com_ratio_alunniperclasse_y": 22.1,
  // ... altri 63 parametri
};
```

### 2. Filtrare i parametri rilevanti al Passo 1

Quando il funzionario sceglie una categoria (es. C108 — Scuole), il sistema usa `input_params_by_category.ts` per sapere quali parametri servono:

```typescript
import { CATEGORY_INPUT_PARAMS } from './input_params_by_category';
import { getParamLabels } from './input_params_registry';

const cat = CATEGORY_INPUT_PARAMS.find(c => c.cat === 'C108');
// cat.cp_input_params = ["com_cnt_edificiscolastici_y", "com_ratio_alunniperclasse_y"]
// cat.kpi_input_params = ["com_ratio_alunniperclasse_y"]
// cat.shared = ["com_ratio_alunniperclasse_y"]

// Tutti i parametri unici per questa categoria
const allCodes = [...new Set([
  ...cat.cp_input_params,
  ...cat.kpi_input_params,
])];

// Tradurre in label leggibili
const labels = getParamLabels(allCodes);
// → [
//   { code: "com_cnt_edificiscolastici_y",
//     label: "N. edifici scolastici",
//     question: "Quanti edifici scolastici ha il tuo comune?",
//     udm: "n." },
//   { code: "com_ratio_alunniperclasse_y",
//     label: "Alunni per classe",
//     question: "Quanti alunni ci sono in media per classe...?",
//     udm: "alunni/classe" },
// ]
```

### 3. Mostrare il pannello "Dati del territorio" nel frontend

Con i labels e i valori dal Data Room, il frontend costruisce una card informativa:

```typescript
// Per ogni parametro rilevante alla categoria selezionata
for (const param of labels) {
  const valore = datiComune[param.code];
  // Render:
  //   Label:    "Alunni per classe"
  //   Valore:   22.1 alunni/classe      ← precompilato, editabile
  //   Tooltip:  "Quanti alunni ci sono in media per classe...?"
}
```

Il funzionario vede i dati già compilati e può modificarli se ha informazioni più aggiornate. L'interfaccia non chiede di "inserire" nulla — chiede di "confermare o correggere".

### 4. Alimentare il calcolo CBA

I valori confermati (o modificati) entrano nelle formule CP e KPI come variabili `A`, `B`, `C` ecc. Il motore CBA li combina con `fixed_params` e `cost_factors`/`monetization_factors` per produrre i risultati.

## Relazione con gli altri file

| File | Ruolo | Join key |
|---|---|---|
| `input_params_registry.ts` | Traduce code → label/question/udm | `code` |
| `input_params_by_category.ts` | Per ogni C###, lista i codici IP necessari | `cat` → `code[]` |
| `statistics.ts` | Mappa code → tabella Databricks + topic | `source_column` = `code` |
| `cost_params_layer2.ts` | Formule CP che usano questi IP come variabili | `variables[].code` |
| `kpi_benefits_layer2.ts` | Formule KPI che usano questi IP come variabili | `variables[].code` |
| `costi_per_tipologia.ts` | Costi min/max/med per categoria × tipologia | `cat_code` |

Il flusso dati completo è:

```
Databricks gold tables
    ↓ query per codice ISTAT
input_params_registry.ts (traduce code → label)
    ↓ filtra per categoria
input_params_by_category.ts (code[] per C###)
    ↓ alimenta formule
cost_params_layer2.ts + kpi_benefits_layer2.ts
    ↓ applica tipologia
costi_per_tipologia.ts (% min/max/med)
    ↓ output
Frontend: costo stimato + benefici + fonti + note
```

## Pattern UX: "Conferma o modifica"

La scelta di rendere tutti i 66 parametri `auto: true` ha un'implicazione UX precisa. Il funzionario non compila un form vuoto. Vede una scheda pre-popolata con i dati del suo comune e può intervenire solo dove sa di avere informazioni più aggiornate.

Il componente React dovrebbe seguire questo pattern:

- Lo **stato di default** è "confermato" (testo grigio, icona check). Il valore viene usato così com'è.
- Un **click** sul valore lo rende editabile (input field con il valore corrente).
- Se l'utente modifica il valore, lo stato diventa "modificato" (testo blu, icona matita) con possibilità di ripristino.
- Il campo `question` appare come tooltip al passaggio del mouse o come helper text sotto l'input in stato editabile.

Questo pattern elimina l'attrito cognitivo del "devo trovare questo dato" e sposta l'interazione su "questo dato mi sembra corretto?".

## Copertura e gap

I 66 parametri coprono il **100% delle variabili input_params** usate in 907 KPI e 268 CP. Il file è completo: non ci sono formule CBA che richiedano un input_param non presente nel registry.

La copertura rispetto a `statistics.ts` (cioè la disponibilità effettiva del dato in Databricks) è del 73% per codice esatto, ma sale al ~95% considerando i near-match (varianti di naming). I gap residui riguardano 7 colonne landuse disaggregate e 2 colonne ULA imprese che il team Data Science deve aggiungere alle tabelle gold.

## Note per ICT

- Il file non ha dipendenze esterne ed è importabile direttamente nel progetto React.
- Le helper functions `getParamLabel()` e `getParamLabels()` fanno lookup lineare su 66 record — nessun bisogno di indicizzazione, la lista è piccola.
- Il campo `auto` è tipizzato come `true` literal (non `boolean`) per rendere evidente a livello di tipo che non esistono parametri manuali.
- Se in futuro un parametro dovesse richiedere input manuale (scenario improbabile), si estenderebbe il tipo a `boolean` e si aggiungerebbe un campo `default_value` per il fallback.
