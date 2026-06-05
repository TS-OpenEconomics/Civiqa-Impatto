# `project_holding_hands_IA` — Spec di implementazione

> Modalità guidata "a prova di idiota" per la sezione **Impatti socioeconomici** (analisi SAM) di CIVIQA.
> Obiettivo: prendere per mano chiunque apra la sezione impatti — sindaco, assessore, cittadino — e spiegargli **cosa**, **come**, **dove** e **in che modo** una spesa pubblica genera valore, senza usare una sola parola tecnica nella UI.

---

## 0. In una frase

C'è già una sezione impatti completa e tecnica. Sopra di essa mettiamo un bottone che apre un **percorso narrato a tappe**: una card per volta, numeri grandi, frasi corte, una piccola animazione che fa scorrere i concetti. Alla fine l'utente ha capito il risultato dell'analisi e può (se vuole) entrare nel dettaglio tecnico.

Non è un nuovo calcolo. **È un wrapper di presentazione sopra dati che l'analisi SAM ha già prodotto.**

---

## 1. Entry point

- Posizione: **sopra** la sezione impatti esistente, sempre visibile (sticky o in cima alla sezione).
- Bottone primario, label: **"Spiegamelo semplice"** (alternativa: *"Cosa significa questo?"*). Niente gergo.
- Sotto-label opzionale: *"60 secondi per capire il risultato di questa analisi"*.
- Stato: il bottone è disponibile **solo se l'analisi impatti è stata calcolata** (altrimenti disabilitato con tooltip "Disponibile dopo il calcolo degli impatti").

### Apertura
- Apre un **overlay fullscreen** (desktop e mobile). Non un modale piccolo: questo è un'esperienza, non un popup.
- Chiusura sempre disponibile in alto a destra (X) + "Salta" testuale. Alla chiusura si torna alla sezione impatti tecnica.

---

## 2. Architettura del percorso

Il percorso è una sequenza lineare di **5 atti**, ognuno una domanda in linguaggio naturale. L'utente avanza con "Avanti" (o swipe su mobile). Indietro sempre possibile. Progress indicator in alto (pallini o barra: 5 step).

```
[ATTO 0]  Il tuo progetto      →  riepilogo: cosa e quanto
[ATTO 1]  Cosa succede?        →  le 5 grandezze, una card per volta
[ATTO 2]  Come?                →  diretto / indiretto / indotto
[ATTO 3]  Dove?                →  mappa territoriale
[ATTO 4]  In che modo?         →  i settori coinvolti
[FINE]    Vuoi i dettagli?     →  CTA verso la sezione tecnica
```

Regola d'oro per tutta la UI: **mai più di ~25 parole per schermata di testo.** Se serve dire di più, c'è un link "Approfondisci" che porta al tecnico.

---

## 3. Gli atti, nel dettaglio

### ATTO 0 — Il tuo progetto

Schermata di apertura. Imposta il tono e ancora tutto a un esempio concreto e personale.

**Contenuto:**
- Nome progetto + luogo + importo, in grande.
- Una frase di contesto.

**Esempio di copy:**
> **Stai rifacendo l'asilo nido di Palermo.**
> Costo previsto: **41 milioni di euro.**
> Vediamo cosa succede quando questi soldi entrano nell'economia.

**Data binding:**
- `progetto.nome`
- `progetto.localita`
- `progetto.spesa` (l'input dell'analisi — la spesa attribuibile, non il QE lordo se differiscono)

**Note:** se manca il nome leggibile, fallback su tipologia intervento ("Stai realizzando un asilo nido…").

---

### ATTO 1 — Cosa succede? (le 5 grandezze, card per card)

Cuore dell'esperienza. Prima una micro-spiegazione, poi le card che scorrono **una alla volta**.

**Intro (una schermata, poi auto-procede o "Avanti"):**
> Quei 41 milioni non restano fermi. Si muovono, passano di mano in mano e mettono in moto l'economia. Ecco le **5 cose** che generano.

**Poi 5 card in sequenza.** Una card è visibile e centrale; quando si avanza, esce di scena (slide/fade verso sinistra) e arriva la successiva. Ogni card ha: **icona · numero grande · titolo semplice · 1 frase di spiegazione**.

Ordine consigliato (dal più intuitivo al più astratto):

| # | Titolo UI (semplice) | Sotto, il termine tecnico (piccolo, opzionale) | Frase di spiegazione |
|---|---|---|---|
| 1 | **Giro d'affari attivato** | *Produzione* | Tutto ciò che fornitori e imprese producono per realizzare e far funzionare il progetto. |
| 2 | **Ricchezza nuova per l'Italia** | *PIL* | La ricchezza vera che resta nel Paese: stipendi, profitti e tasse, contati una volta sola. |
| 3 | **Persone al lavoro** | *Occupazione* | Quante persone lavorano a tempo pieno per un anno grazie a questa spesa. |
| 4 | **Soldi a famiglie e aziende** | *Redditi* | Quanto finisce in tasca a lavoratori e imprese, tra stipendi, profitti e affitti. |
| 5 | **Tasse che tornano allo Stato** | *Gettito fiscale* | Le imposte che lo Stato incassa grazie a tutta questa attività. |

**Data binding (output dell'analisi SAM):**
- card 1 → `impatti.produzione`
- card 2 → `impatti.pil`
- card 3 → `impatti.occupazione` (in ETP / occupati medi annui — etichettare "persone a tempo pieno per 1 anno")
- card 4 → `impatti.redditi`
- card 5 → `impatti.gettito`

**Formattazione numeri:** sempre arrotondati e leggibili (es. "circa 100 milioni di euro", non "98.742.331 €"). L'occupazione in numero intero di persone. Mostrare l'unità in chiaro, mai sigle (no "ETP" nel numero grande).

**Card finale dell'atto — il moltiplicatore (hero):**
Dopo le 5 card, una card di sintesi che è il "wow":
> Per ogni euro speso, l'economia italiana ne genera **1,3** di ricchezza nuova.
- Data binding: `moltiplicatore = impatti.pil / progetto.spesa` (arrotondato a 1 decimale).
- Visivamente: 1 moneta che entra → 1,3 escono. Animazione semplice.

> ⚠️ **Caveat metodologico da rispettare nel copy:** il moltiplicatore è un valore **lordo** (l'analisi tratta la domanda come esogena, ceteris paribus, senza controfattuale). Non scrivere mai "guadagno netto" o "rende il 30%". Usare sempre "genera / mette in moto". Vedi §7.

---

### ATTO 2 — Come? (diretto, indiretto, indotto)

Spiega la **propagazione**. Metafora portante: **il sasso nello stagno → i cerchi che si allargano** (coerente con la Figura 2 dell'analisi: cerchi concentrici Diretto ⊂ Indiretto ⊂ Indotto).

**Visual:** tre cerchi concentrici che si accendono in sequenza (dal centro verso l'esterno), uno per "Avanti".

| Livello | Titolo UI | Frase | Esempio concreto (asilo) |
|---|---|---|---|
| Centro | **Chi ci lavora direttamente** | L'impresa che costruisce e chi ci lavora sopra. | La ditta che tira su l'asilo. |
| Anello medio | **I fornitori dei fornitori** | Tutte le aziende lungo la catena che riforniscono il cantiere. | Cemento, trasporti, infissi, consulenze tecniche. |
| Anello esterno | **Quando tutti spendono lo stipendio** | Quei lavoratori spendono il loro reddito e riaccendono altra economia. | La spesa al supermercato, il bar, l'affitto. |

**Copy di chiusura atto:**
> Più i cerchi si allargano, più l'economia si muove. È così che 41 milioni diventano molto di più.

**Data binding (se disponibile — vedi Open Questions):**
- `scomposizione.diretto`, `scomposizione.indiretto`, `scomposizione.indotto` (almeno per PIL/valore aggiunto).
- Se la scomposizione non è disponibile per grandezza, l'atto resta **puramente esplicativo** (solo metafora, niente numeri). Non inventare ripartizioni.

---

### ATTO 3 — Dove? (mappa)

Mostra che l'impatto **non resta tutto sul territorio del progetto**: si sparge in tutta Italia.

**Visual:** mappa Italia con intensità per provincia (heatmap / coropleta). Pin/evidenza sulla provincia del progetto.

**Copy:**
> L'effetto non si ferma a Palermo. Fornitori, materiali e servizi arrivano da tutta Italia: ecco dove si sente l'impatto.

**Interazione:** tap/hover su una provincia → tooltip con il dato locale, in linguaggio semplice ("Qui: circa X di ricchezza generata").

**Data binding:**
- `distribuzione_territoriale[provincia]` → valore per provincia (dettaglio provinciale già previsto dall'analisi).
- Scegliere **una** grandezza per la mappa (consigliato: PIL) per non confondere. Eventuale selettore secondario per utenti avanzati, ma di default una sola.

---

### ATTO 4 — In che modo? (settori)

Spiega che il valore tocca **tanti settori diversi**, non solo l'edilizia.

**Visual:** barre orizzontali (o treemap) dei **top 5–7 settori** coinvolti, con nomi in italiano semplice (mappati dai 63 settori ISTAT, ma riscritti in chiaro).

**Copy:**
> L'asilo non dà lavoro solo agli edili. Si muovono anche trasporti, mobili, energia, servizi professionali e tanto altro.

**Data binding:**
- `distribuzione_settoriale[]` (63 settori ISTAT) → ordinati per impatto, mostrare i primi N.
- **Mapping etichette obbligatorio:** i codici tipo `VF`, `V49`, `V62_63` non vanno mai mostrati. Tabella di traduzione codice → nome amichevole gestita lato frontend (es. `VF` → "Costruzioni", `V49` → "Trasporti su strada", `V71` → "Studi tecnici e ingegneria"). La descrizione ISTAT completa va al massimo in tooltip.

---

### FINE — Vuoi i dettagli?

Schermata di chiusura con due uscite:
- **CTA primaria:** "Vedi l'analisi completa" → chiude l'overlay e scrolla alla sezione impatti tecnica.
- **CTA secondaria:** "Ho capito, grazie" → chiude.
- Opzionale: "Rivedi da capo" → torna all'Atto 0.

**Micro-copy:**
> Questo era il riassunto. Se vuoi numeri per settore, mappe dettagliate e la metodologia, l'analisi completa è qui sotto.

---

## 4. Modello dati (riepilogo per il binding)

Tutto già prodotto a monte; questo componente è read-only.

```ts
type HoldingHandsPayload = {
  progetto: {
    nome: string;
    localita: string;          // es. "Palermo"
    spesa: number;             // input dell'analisi, € 
    tipologia?: string;        // fallback per il nome
  };
  impatti: {
    produzione: number;        // €
    pil: number;               // €
    occupazione: number;       // ETP / occupati medi annui
    redditi: number;           // €
    gettito: number;           // €
  };
  scomposizione?: {            // opzionale → Atto 2 mostra numeri solo se presente
    diretto: number;
    indiretto: number;
    indotto: number;
    grandezza: "pil" | "produzione" | "va";
  };
  distribuzione_territoriale: {
    provincia: string;         // codice o nome
    valore: number;
  }[];
  distribuzione_settoriale: {
    codice_istat: string;      // es. "VF" — NON mostrare grezzo
    valore: number;
  }[];
};
```

Il moltiplicatore si calcola lato client: `pil / spesa`.

---

## 5. Interazione & animazione

- **Una card per volta.** La card attiva è centrale e a fuoco; le altre non sono visibili (no stack affollato).
- **Transizione:** la card esce in slide+fade verso sinistra, la nuova entra da destra. Durata ~300–400 ms, easing morbido. Niente effetti aggressivi.
- **Avanzamento:**
  - Desktop: bottone "Avanti" + frecce tastiera (← →) + click sul progress.
  - Mobile: swipe orizzontale + bottone.
- **Auto-advance:** evitarlo come default (l'utente deve avere il controllo). Eventuale "auto-play" come opzione.
- **Numeri:** count-up animation sul numero grande quando la card entra (da 0 al valore, ~800 ms). Effetto "wow" controllato.
- **Progress indicator** sempre visibile: 5 step, step corrente evidenziato, step già visti cliccabili per tornare indietro.
- **Persistenza:** se l'utente chiude a metà e riapre, ripartire dall'Atto 0 (esperienza breve, non serve salvare lo stato).

---

## 6. Tono, lingua, design

- **Seconda persona singolare** ("Stai rifacendo…", "Vediamo…"). Caldo, diretto, mai paternalistico.
- **Zero gergo nella UI principale.** I termini tecnici (PIL, produzione, indotto…) compaiono solo in piccolo come "sottotitolo" o in tooltip, mai come protagonisti.
- **Numeri sempre arrotondati e con unità in chiaro.**
- **Una idea per schermata.** Se una schermata ha bisogno di due concetti, è due schermate.
- Stile visivo coerente con il design system CIVIQA; tono illustrato/amichevole ammesso (icone, piccole animazioni), ma sobrio — è pur sempre un ente pubblico.

---

## 7. Vincoli metodologici da NON violare nel copy

L'analisi è una valutazione **ex post, lorda, in ceteris paribus** (vedi nota metodologica §2.1). Il copy semplificato non deve tradire questo. Regole:

1. **Mai** "guadagno netto", "ritorno sull'investimento", "rende il X%". → Usare "genera", "mette in moto", "attiva".
2. **Mai** promettere effetti di lungo periodo (il modello cattura breve/medio termine).
3. Il moltiplicatore è **lordo di controfattuale**: non confrontarlo con altri investimenti né dire "conviene più di…".
4. L'occupazione è in **ETP** (persone a tempo pieno per un anno), non "nuovi posti di lavoro permanenti". Etichettare con cura.
5. Niente effetti su prezzi/inflazione (il modello non li considera).

Suggerimento: un piccolo link "Come funziona questo calcolo?" in chiusura, che porta alla nota metodologica, copre la trasparenza senza appesantire.

---

## 8. Accessibilità

- Tutto il percorso navigabile da tastiera; focus management a ogni cambio di atto.
- Animazioni rispettano `prefers-reduced-motion` (count-up e slide si disattivano → comparsa istantanea).
- Contrasto AA sui numeri grandi; non affidare significato al solo colore (mappa e settori).
- Ogni numero ha label testuale leggibile da screen reader con unità per esteso.

---

## 9. Open questions (input richiesto da Thomas)

1. **Scomposizione diretto/indiretto/indotto:** è disponibile come dato numerico per grandezza (almeno PIL/VA) o l'Atto 2 resta solo esplicativo/qualitativo?
2. **Mappa territoriale:** confermi granularità provinciale già pronta in OpenCore per il singolo progetto? E quale grandezza usare di default (PIL)?
3. **Settori:** quanti mostrarne nell'Atto 4 (top 5? 7?) e chi mantiene la tabella di mapping codice ISTAT → nome amichevole (frontend statica o servita da OpenCore)?
4. **Soglia di attivazione:** la modalità guidata è sempre disponibile o solo sopra una certa soglia di costo (coerente con la proporzionalità UI per soglia già prevista)?
5. **Spesa di riferimento:** nell'Atto 0 mostriamo la spesa attribuibile usata come input SAM o l'importo del QE? Vanno chiariti i casi in cui differiscono.
