# DOCFAP — strategia wizard «a ritroso» (desiderata 3)

> Data: 2026-07-21 · Autore: Riccardo Scialla + Claude
> Contesto: espande la §5 di `2026-07-21-docfap-asilo-nido-poc-design.md` in un capitolo di
> strategia completo. **Solo ragionamento, nessun codice.** Le correzioni di prodotto
> (desiderata 1 e 2) restano fuori scopo qui: sono trattate nello spec di design collegato.

---

## 1. Problema

Il wizard DOCFAP (`app/src/poc/components/wizard/DocfapWizard.tsx`) raccoglie, fase per
fase, un insieme ricco di input: ente e RUP, fabbisogno, problema e scenario zero, N
alternative con categoria/tipologia/quantità/CAPEX/OPEX/durata/vita utile, matrice MCA
qualitativa, rischi. Alla fine (`fase-5`, sostep `fase5-score`) il componente
`Step7_ScoreFinale.tsx:88` chiama:

```
runFullAnalysis()  →  scoreComposito.ts:41  →  return runPOCAnalysis()
```

`runPOCAnalysis()` (`app/src/poc/engine/pocAnalysis.ts:103`) **non accetta parametri**.
La sua firma è `export function runPOCAnalysis(): ScoreComposito[]`. Al suo interno usa
una costante di modulo cablata:

```ts
const ALT = {
  A1: { capex: 2_640_000, opex: 420_000, ben: 920_000, residual: 660_000 },
  A2: { capex: 1_440_000, opex: 300_000, ben: 858_000, residual: 400_000 },
  A3: { capex: 0,         opex: 600_000, ben: 232_000, residual: 0 },
}
```

più punteggi MCA/rischio/sensitività altrettanto cablati (`CBA_SCORE`, `IMP_SCORE`,
`RSK_SCORE`, `MCA_SCORE`, `SENS`). Qualunque cosa l'utente digiti nelle fasi 1-4 — un
altro numero di posti, un CAPEX diverso, un'altra categoria di intervento — **il risultato
finale è sempre lo stesso scenario asilo nido A1/A2/A3 di Colleferro**. L'unico punto in
cui l'input dell'utente tocca l'output è `docfapDemo.ts:123`, che filtra l'array fisso di
`runPOCAnalysis()` sugli id delle alternative effettivamente definite — un filtro, non un
calcolo.

Due conseguenze pratiche:

- **Invarianza**: il DOCFAP non è uno strumento di analisi, è un generatore di un unico
  report pre-scritto con un'interfaccia di raccolta dati che non alimenta nulla a valle.
- **Divergenza silenziosa strutturale**: esiste già, scollegato, un motore che calcola
  davvero dagli input — quello di Analisi Ricadute (`computeEcba`/`computeEia`/
  `buildBeneficiKpi` in `app/src/lib`). Il fatto che i numeri di `ALT` coincidano oggi con
  l'output di quel motore (vedi §2.1 dello spec di design) è un artefatto di come sono stati
  scritti a mano, non una garanzia strutturale: la prima volta che qualcuno cambia un input
  del wizard aspettandosi un impatto sul risultato, la rottura è evidente.

Il motore "reale" del DOCFAP menzionato nello spec di design (`cba.ts`, `impatto.ts`,
`sensitivita.ts`) non è quello effettivamente cablato in `pocAnalysis.ts`: quei moduli
esistono nel repository ma `Step7_ScoreFinale`/`Step7_Completamento` chiamano
`runFullAnalysis` → `runPOCAnalysis`, che li ignora. Qualunque strategia di collegamento
deve quindi decidere consapevolmente *quale* motore diventa la fonte di verità (si veda §4).

---

## 2. Output noto-buono da riprodurre

Il "contratto" che qualunque nuovo motore deve rispettare, alternativa per alternativa, è
quello già verificato nello spec di design (§2.1, §3.1):

| Grandezza | Formula | Fonte |
|---|---|---|
| CAPEX | costo parametrico (CP, €/posto per tipologia/categoria) × quantità (posti) | `costi_per_tipologia.ts` via `calcolaCostoTipologia` |
| OPEX/anno | quota % del CAPEX (min/media/max di settore) o valore assoluto | `intervention_categories_layer3.ts` (`opex.pct_med`) |
| Posti/beneficiari | input diretto (quantità fisica dell'alternativa) | wizard, fase 3 |
| Valore residuo | quota non ammortizzata del CAPEX a fine orizzonte, attualizzata | oggi cablato in `ALT.residual` per la POC; in Ricadute è `setup.residualValue` |
| **Beneficio annuo** | `posti × Σ KPI(categoria)` | `buildBeneficiKpi` — una voce per ciascun KPI Layer 2 collegato alla categoria Layer 3 |
| **Impatto EIA** | `CAPEX × moltiplicatori(settore)` (produzione 1,85 · GVA 0,62 · FTE 12,4/M€ · redditi = GVA×0,55) | `computeEia`/`calcEconPOC`, tabella `SECTOR_MULTIPLIERS["Infrastrutture sociali"]` |
| **VANE/BCR/TIRE** | funzione di CAPEX, OPEX, beneficio annuo, orizzonte, tasso di sconto, valore residuo | `computeEcba`/`calcVAN`/`calcBCR`/`calcTIR` |

Per l'asilo nido (categoria C106), il beneficio annuo per posto è la somma di 5 KPI:

| KPI | Voce | Formula | €/posto/anno |
|---|---|---|---|
| NID-00 | Valore servizio educativo | A×B (B=MF-IST-NIDO=7.000) | 7.000 |
| NID-01 | Sviluppo cognitivo | A×B×C (23.000×0,05) | 1.150 |
| NID-02 | Occupazione femminile | A×B×C (23.000×0,012) | 276 |
| NID-03 | Risparmio sanitario | A×B×C (0,06×3.500) | 210 |
| NID-04 | Recupero povertà educativa | A×B×C×D (0,33×0,08×60.000) | 1.584 |
| | **Totale** | | **10.220** |

Un dettaglio strutturale importante, verificato leggendo `kpi_benefits_layer2.ts` (righe
357-425): **la variabile `A` di tutti e 5 i KPI è la stessa** — `Posti nido serviti`,
codice `com_src_utentiserviziinfanzia_y`, tabella `input_params`, con un valore di default
(`valore_tipo`) di 350. Non è "il motore moltiplica il totale KPI per i posti dopo"; è che
ogni singolo KPI ha già `A` (posti) come primo fattore della propria formula. Questo
significa che **il campo "quantità" che il wizard già raccoglie in `InputParamsStep` è,
letteralmente, la variabile `A` di cui il motore KPI ha bisogno** — non serve inventare un
nuovo input, serve instradare quello che già esiste (si veda §4).

L'orizzonte e il tasso di sconto cablati in `pocAnalysis.ts` sono 20 anni e 3%
(`annuityFactor(0.03, 20)` ≈ 14,877); `computeEcba` in Ricadute ha di default 25 anni e
3,5% (`horizon = 25`, `discountRate = 3.5` in `ecbaEngine.js:23-29`), ma li accetta come
parametro (`setup`) — quindi sono già "input-driven" nel motore Ricadute, cablati solo nel
motore POC.

---

## 3. Mappa inversa: step → input → grandezza di output

Il wizard reale ha più sostep di quanto sintetizzato nel brief. Mappa completa, con la
distinzione fra dato **bloccato** (fattore di monetizzazione o moltiplicatore, non
esposto/non modificabile dall'utente), dato **confermabile** (dato territoriale con un
default, sovrascrivibile) e dato **libero** (l'utente lo decide, nessun default di settore
vincolante):

| Fase / sostep | Cosa chiede oggi | Alimenta quale grandezza | Natura del dato |
|---|---|---|---|
| `fase0-intro` | Nessun dato | — | — |
| `fase1-ente` | RUP, ente | Metadati documento (non entra nel calcolo) | libero |
| `fase1-fabbisogno` | Fabbisogno (`fabId`) + cluster | **Determina la categoria d'intervento** (Layer 3, es. C106) e quindi *quale set di KPI* (Σ KPI) e *quale settore* (moltiplicatori EIA) si applicano | confermabile (il fabbisogno è cercato in un catalogo, ma la categoria risultante è deterministica) |
| `fase2-problema` | Descrizione del bisogno, urgenza | Narrativa DOCFAP (non entra nel calcolo numerico) | libero |
| `fase2-sz-questions` | Scenario zero (domande qualitative) | Narrativa scenario zero (non entra nel calcolo) | libero |
| `fase2-q1` | Dato quantitativo di contesto (es. "178" = gap posti) | Oggi **non alimenta il beneficio** (il beneficio usa la quantità della singola alternativa, non il gap complessivo). Potenziale uso futuro: dimensionare l'addizionalità/deadweight o validare che le alternative coprano il gap | confermabile |
| `fase3-{alt}-setup` | Categoria, tipologia, nome alternativa | Determina il **costo parametrico** (CP, €/unità, per tipologia+categoria) usato per il CAPEX, e implicitamente il settore EIA | confermabile (CP ha min/media/max di settore) |
| `fase3-{alt}-params` (`InputParamsStep`) | Durata cantiere, vita utile, **quantità fisica (posti)**, CAPEX (CP×quantità o custom), OPEX (%CAPEX o assoluto) | **Quantità = variabile `A` del motore KPI** (beneficio) · **CAPEX = base EIA e base CBA** · **OPEX = costo ricorrente CBA** · **vita utile = orizzonte CBA** (oggi non usato: l'orizzonte CBA è cablato a 20 anni in `pocAnalysis`, ma nel motore Ricadute `horizon` è parametro) | libero, con riferimenti min/media/max di settore mostrati come guida |
| `fase3-aggiunta` | Aggiunta/conferma delle alternative (min 2, max 5: `A1..A5`) | Determina **quante e quali alternative** vengono scored | libero |
| `fase4-mca` | Punteggi qualitativi (A/M/B/N) per criterio, per alternativa | Alimenta `MCA_SCORE` nello score composito | libero (oggi nel prefill demo sono pattern fissi) |
| `fase5-score` | (nessun nuovo input: trigger di calcolo) | Chiama `runFullAnalysis()` → **qui avviene la sostituzione cablata** | — |
| `fase5-decisione` | Scelta motivata del RUP fra le alternative | Decisione finale (a valle dello score) | libero |
| `fase5-intervento` | Denominazione, CUP/CUI, fonte di finanziamento | Metadati DOCFAP | libero |
| `fase5-allegati` | Documenti normativi (D.Lgs. 36/2023 All. I.7) | Compliance documentale | libero |
| `fase5-genera` / `fase5-completamento` | Riepilogo, generazione documento | Output finale (oggi mostra i numeri cablati) | — |

**Cosa manca perché la mappa sia completa e chiusa:**

1. Il tasso di sconto e l'orizzonte di analisi non sono mai chiesti esplicitamente
   all'utente nel wizard DOCFAP (sono cablati in `pocAnalysis.ts`); la "vita utile"
   raccolta in `fase3-{alt}-params` esiste ma oggi non è il driver dell'orizzonte CBA.
2. Il valore residuo non è raccolto come input: è cablato per alternativa (`ALT.*.residual`).
   Nel motore Ricadute è `setup.residualValue`, quindi già parametrico — andrebbe derivato
   (es. da CAPEX/vita utile/anno di analisi) o esposto come campo.
3. Nessun sostep chiede esplicitamente "settore" in modo indipendente dalla categoria:
   oggi il settore EIA è implicito nella categoria d'intervento (C106 → "Infrastrutture
   sociali"), il che è corretto per la coerenza ma va reso esplicito nel mapping se si
   introducono categorie con settori ambigui.

---

## 4. Dove il motore Ricadute può sostituire il cablato

Il motore di Analisi Ricadute è già, oggi, la fonte di verità aritmetica dietro i numeri
cablati (verificato nello spec di design). Tre funzioni sono i candidati diretti:

- **`buildBeneficiKpi({ catCode, categoriaInterventoLabel, overrides })`**
  (`app/src/lib/cba/kpiBenefits.js:203`) — dato un codice categoria (es. `C106`) restituisce
  una voce di beneficio per KPI, con `valore_annuo` già calcolato dalla formula. Il
  parametro `overrides` accetta valori per `code` o `var_name`: per instradare la quantità
  del wizard basta passare `overrides: { com_src_utentiserviziinfanzia_y: quantita }`
  (o l'equivalente per ciascuna categoria — ogni categoria userà il proprio codice IP per
  "unità servite"). Non serve toccare il motore: serve solo che l'adattatore lato DOCFAP
  sappia *quale* codice IP rappresenta "la quantità dell'alternativa" per la categoria
  scelta (informazione già presente nel Layer 3/Layer 2, recuperabile senza hardcoding
  per-categoria).

- **`computeEcba(project, eiaResults, setup)`** (`app/src/lib/ecbaEngine.js:23`) — si
  aspetta un oggetto `project.configurazione` con `capex`, `opex` (o `setup.annualOpex`),
  `cat_code`/`categoria_intervento`, e un `setup` con `horizon`, `discountRate`,
  `residualValue`, `kpiOverrides`. Chiama internamente `buildBeneficiKpi` (con fallback su
  un placeholder parametrico se la categoria non è risolvibile) e restituisce VANE/BCR/TIR
  e il dettaglio benefici per categoria (utile anche per il donut/waterfall, non solo per lo
  score).

- **`computeEia(project, scenario)`** (`app/src/lib/eiaEngine.js:140`) — si aspetta
  `scenario.settore` (o `project.configurazione.settore`), `scenario.capex`,
  `scenario.opex_annuo`, `scenario.vita_utile`, e restituisce produzione/GVA/FTE/redditi/
  gettito, oltre alla distribuzione territoriale/temporale/settoriale.

**L'adattamento necessario, alternativa per alternativa, è quindi:**

```
WizardState.alternative[altId]   (categoria, tipologia, quantita, capex, opex,
                                   vitaUtileProgram, durataStimata, clusterId)
        │
        ▼  adapter (da scrivere; nessuna modifica ai motori)
project-shape:
  configurazione = { capex, opex, cat_code: categoria, categoria_intervento: label,
                      settore: <derivato dalla categoria>, ... }
  setup = { horizon: vitaUtileProgram (o costante finché non esposto),
            discountRate: <costante finché non esposto>,
            residualValue: <derivato o costante>,
            kpiOverrides: { <codice IP "unità">: quantita } }
        │
        ▼
computeEia(project, scenario)  →  produzione/GVA/FTE/redditi
computeEcba(project, eiaResults, setup)  →  VANE/BCR/TIR/benefici per KPI
        │
        ▼
per ogni alternativa → assemblare ScoreComposito (aggiungendo MCA/rischio/sensitività,
che restano fuori dal perimetro di questo motore condiviso — vedi §6)
```

Questo è, in sostanza, lo **stesso adattatore** già proposto nello spec di design (§4.1,
B.1/B.2: `buildNidoEcbaDataset`/`buildNidoEiaDataset`) ma percorso nella direzione opposta:
lì l'adattatore prende l'output del motore e lo traveste da "dataset ricco" per le pagine
Ricadute esistenti; qui l'adattatore prende gli **input del wizard** e li traveste da
`project`/`scenario` per alimentare gli stessi tre motori. Le due direzioni condividono lo
stesso oggetto intermedio (il workspace calcolato), il che rafforza l'idea di un **motore
di calcolo unico e condiviso** (`app/src/lib`) con due "facciate": una verso il wizard
DOCFAP (che produce `ScoreComposito[]`), una verso le pagine Ricadute (che produce i
dataset `ecbaData`/`eiaResults`).

**Cosa il motore condiviso NON copre** (resta specifico del DOCFAP): score composito
pesato (`W = {cba, imp, mca, rsk, sens}`), punteggio MCA qualitativo, punteggio di rischio,
scenari di sensitività testuali. Questi restano logica DOCFAP a valle del motore
condiviso — non c'è un equivalente "Ricadute" da riusare 1:1, andrebbero mantenuti o
semplificati (si veda §6, non-obiettivi).

---

## 5. Percorso di migrazione

### Approccio 1 — Prefill curato (demo-safe, rischio nullo)

Allineare i valori di prefill/default del wizard (l'oggetto `ALT_PRESET` e la logica
`autoFillPage` in `DocfapWizard.tsx`) in modo che il percorso scriptato "Autoriempi"
produca *esattamente* gli input che, se venissero effettivamente calcolati, darebbero
A1/A2/A3. Concretamente: già oggi `ALT_PRESET` fissa `quantita` (1500/1100/900 — unità di
costo parametrico, non posti diretti) e `costiCode` per ottenere un CAPEX coerente via
`capexFor()`. Questo approccio consiste nel **congelare la corrispondenza** fra ciò che
l'autoriempi scrive nello stato del wizard e ciò che `runPOCAnalysis()` restituisce,
documentandola, così che non si rompa per manutenzione futura scollegata.

- Rischio: **nullo** per la demo (nessuna nuova logica di calcolo, nessun rischio di
  regressione). Costo: quasi zero (è già lo stato attuale, serve solo disciplina/commenti).
- Limite: coerente *solo* sul percorso scriptato. Se un utente in demo modifica un valore
  a mano (es. cambia la quantità di A1), l'output resta invariato — il problema di fondo
  (§1) non è risolto, solo nascosto dietro un percorso guidato.
- Adatto a: POC di vendita a breve termine dove il presenter segue lo script.

### Approccio 2 — Motore ricollegato (target)

Sostituire la chiamata `runFullAnalysis() → runPOCAnalysis()` in `Step7_ScoreFinale.tsx`
(e l'equivalente in `Step7_Completamento.tsx`) con una funzione che, per ogni alternativa
definita nello stato del wizard, applica l'adattatore di §4 e chiama
`computeEia`/`computeEcba`/`buildBeneficiKpi`, per poi assemblare `ScoreComposito[]`
combinando l'esito con MCA/rischio/sensitività (che restano calcolati con la logica DOCFAP
esistente o una versione semplificata).

**Punti di decisione da chiudere prima di implementare:**

1. **Dove vive il calcolo condiviso.** `app/src/lib/cba/kpiBenefits.js` importa già file
   statici da `app/src/poc/data/...` (Layer 2/Layer 3, `input_params_registry`) — quindi
   l'accoppiamento `lib → poc/data` esiste già ed è a senso unico. Nessun modulo in
   `poc/engine` importa oggi da `app/src/lib`. Collegare `poc/engine` (o un nuovo
   `poc/engine/pocAnalysisV2.ts`) a `app/src/lib/ecbaEngine.js`/`eiaEngine.js` è quindi
   `poc → lib`, la stessa direzione già in uso, e **non introduce un ciclo**
   (`lib` non dipende da `poc/engine`, solo da `poc/data`). Va comunque isolato in un
   modulo di adattamento dedicato (non sparso in più componenti wizard) per restare
   testabile e per non far dipendere i componenti React del wizard direttamente dai motori
   di `lib`.
2. **Gestione di N alternative.** Il modello dati del wizard supporta già `A0..A5`
   (`AlternativaId` in `types/docfap.ts`) e fino a 5 alternative (`Step3_AggiuntaAlternativa`,
   `MAX_ALTERNATIVES`). `runPOCAnalysis()` oggi restituisce **sempre e solo** 3 voci fisse
   (A1/A2/A3) indipendentemente da quante alternative l'utente ha effettivamente definito;
   `docfapDemo.ts` se ne accorge e filtra a valle. Il motore sostitutivo deve iterare
   `state.alternativeDefinite` (qualunque sottoinsieme di A1..A5) e non assumere
   esattamente 3 elementi — altrimenti con 2 o 4 alternative l'app romperebbe silenziosamente
   o mostrerebbe dati disallineati.
3. **Forma dati condivisa.** Il motore Ricadute si aspetta un `project.configurazione`
   (capex, opex, cat_code, settore) e un `setup` (horizon, discountRate, residualValue,
   kpiOverrides), forma diversa da `WizardState.alternative[altId]`. Serve un adattatore
   esplicito e stabile (non conversioni ad-hoc ripetute in più punti), idealmente la stessa
   funzione di mapping riusata anche dal bridge Ricadute→DOCFAP di cui allo spec di design
   (§4), per avere un'unica definizione di "come un'alternativa DOCFAP diventa un progetto
   Ricadute".
4. **Parametri oggi cablati e mai chiesti**: orizzonte/tasso di sconto/valore residuo
   (§3, punto 1-2). Vanno o (a) esposti come nuovi campi del wizard (impatto UI, più
   coerenza), o (b) derivati da ciò che già esiste (vita utile → orizzonte; residuo =
   funzione di CAPEX e vita utile), o (c) lasciati costanti di sistema esplicite e
   documentate (meno coerenza ma zero nuova UI). Raccomandazione: (b) per l'orizzonte
   (la "vita utile" è già raccolta ed è semanticamente l'orizzonte), (c) per tasso di
   sconto e valore residuo nella prima iterazione.

**Rischi di Approccio 2:**

- **Categoria non risolvibile**: `resolveCategoryCode` restituisce `null` per categorie
  Layer 3 senza `kpi_links` definiti in Layer 2. `computeEcba` ha già un fallback
  (`buildBeneficiCategorie` parametrico sul CAPEX) che mantiene la stessa forma di output,
  ma il beneficio smette di essere "trainato dai posti" e diventa un placeholder — va
  segnalato in UI quando questo fallback scatta, altrimenti l'utente crede di vedere un
  calcolo KPI-specifico quando in realtà è un placeholder generico.
- **Disallineamento orizzonte/tasso** fra ciò che il DOCFAP mostrava finora (20 anni, 3%)
  e i default di Ricadute (25 anni, 3,5%): cambiare motore senza fissare questi parametri
  esplicitamente altera silenziosamente VANE/BCR anche a parità di CAPEX/OPEX/benefici,
  rompendo la continuità con la demo attuale.
- **Rendering di VANE negativo** e casi limite (alternativa "voucher"-like con CAPEX 0):
  già annotato come rischio nello spec di design per la vista ponte (§4.4); si applica
  identicamente qui se il motore sostituisce il cablato anche per alternative con benefici
  bassi rispetto ai costi.
- **Bump cache `localStorage`**: se l'adattatore cambia la forma con cui i progetti DOCFAP
  vengono persistiti/letti (`civiqa.projects.v8`), serve un bump di versione della chiave;
  se cambia solo il calcolo a runtime (nessuna nuova forma persistita) non serve.
- **Sincronizzazione MCA/rischio/sensitività**: questi punteggi restano fuori dal motore
  condiviso (non hanno un equivalente in Ricadute) e continueranno a essere o cablati o
  calcolati con una logica DOCFAP separata — quindi lo score composito finale resterà
  "parzialmente a ritroso" finché anche quella parte non viene ripensata (esplicitamente
  fuori scopo qui, si veda §6).

---

## 6. Non-obiettivi e stima

**Non-obiettivi (di questo capitolo e, per estensione, di un primo Approccio 2):**

- Nessuna riscrittura dei motori `ecbaEngine`/`eiaEngine`/`kpiBenefits` (si riusano
  com'è, in sola lettura).
- Nessuna modifica alle pagine Ricadute (`EcbaResults`/`EiaResults`) né ai loro dataset:
  questo capitolo riguarda solo la direzione wizard → motore, non la vista ponte
  (desiderata 2, già trattata a parte).
- Nessun ripensamento della logica MCA qualitativa, del punteggio di rischio o degli
  scenari di sensitività testuali: restano calcolati con l'approccio DOCFAP esistente
  (cablato o euristico) finché non si decide separatamente di derivarli da dati reali.
- Nessuna esposizione in UI di tasso di sconto/orizzonte/valore residuo come nuovi campi
  in questa iterazione (si adotta l'opzione (b)/(c) di §5, non la (a)).
- Nessuna migrazione strutturale dei due alberi di codice (`app/src/poc/` e
  `app/src/lib/`+`app/src/components/`) in un modulo unico: l'obiettivo è un **motore di
  calcolo condiviso**, non un'unificazione dei due prodotti/UI.
- Nessuna implementazione in questa iterazione: quanto sopra è un piano, non un branch.

**Stima di massima per Approccio 2** (ordine di grandezza, da validare in fase di plan):

| Blocco di lavoro | Stima |
|---|---|
| Adattatore `WizardState.alternative[altId] → project/scenario/setup` (incl. risoluzione codice IP "quantità" per categoria) | 1-1,5 giorni |
| Sostituzione `runPOCAnalysis()` con iterazione su N alternative reali + fallback categoria non risolvibile | 1 giorno |
| Allineamento orizzonte/tasso/residuo (decisione + implementazione opzione scelta) | 0,5 giorno |
| Riassemblaggio `ScoreComposito` (VANE/BCR/TIR/EIA dal motore condiviso + MCA/rischio/sensitività esistenti) | 0,5-1 giorno |
| Test di regressione sullo scenario noto-buono (A1/A2/A3 Colleferro devono continuare a tornare uguali entro arrotondamento) + casi con 2/4/5 alternative e categorie diverse da C106 | 1 giorno |
| **Totale indicativo** | **4-5 giorni-persona** |

Questa stima non include l'eventuale esposizione UI di tasso/orizzonte/residuo (opzione
(a) di §5), che aggiungerebbe sviluppo wizard vero e proprio (nuovi sostep/campi) fuori
dal solo motore di calcolo.
