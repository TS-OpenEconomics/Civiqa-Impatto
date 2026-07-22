# Pagine di dettaglio ESG — Ospedale Pediatrico (dati curati)

> Data: 2026-07-22 · Autore: Riccardo Scialla + Claude
> Estende `2026-07-22-*` (ESG ospedale) e la POC asilo nido.

---

## 1. Obiettivo

Arricchire la pagina di dettaglio ESG (`/valutazioni/PROJ-OSP-841/esg/results`) per avvicinarla ai
mockup del prodotto Externalytics: un **Riepilogo a 3 sezioni** (Compliance, Materialità, SDG) e
**sotto-pagine E/S/G** con sotto-temi, metodologia/raccomandazioni e radar. Solo per l'ospedale, con
**dati curati** (non un motore ESG generale).

## 2. Approccio (confermato con l'utente)

- **Dati curati + build incrementale.** Un blocco `esgDetail` curato viene **agganciato all'`esgResults`
  dell'ospedale** (unica fonte che `EsgResults` già consuma). Le pagine renderizzano `esgDetail` quando
  presente; per gli altri progetti la pagina resta com'è (fallback sui campi base di `computeEsg`).
- **Coerenza col rating calcolato.** L'ESG dell'ospedale è già calcolato dal motore: globale 92,
  **E 76 / S 94 / G 100**. I dati curati (compliance per dimensione, materialità, punteggi SDG,
  sotto-temi) devono essere **coerenti** con questi punteggi (E medio-alto con qualche criticità;
  S/G alti).
- **SDG:** nel primo incremento versione **semplice** (lista/barre con punteggio per obiettivo); la
  ruota radiale a 17 spicchi è rimandata a un incremento successivo.
- Tassonomia sotto-temi S/G = proposta di questo spec (E dai mockup).

## 3. Modello dati `esgDetail`

Aggiunto all'oggetto `esgResults` dell'ospedale (in `buildOspedaleWorkspace`, `projectState.js`).
Forma:

```js
esgDetail: {
  // % compliance (0-100) per dimensione + complessiva. Derivabili dai livelli dei criteri
  // (computeEsg li produce già), oppure curati per dimensione. Coerenti con E76/S94/G100.
  compliance: {
    overall: { aligned, partial, non },   // in %
    E: { aligned, partial, non },
    S: { aligned, partial, non },
    G: { aligned, partial, non },
  },
  // Contributo alla materialità: % (0-100) per sotto-tema, per colonna E/S/G.
  materiality: {
    E: [ { label, pct } … ],
    S: [ … ], G: [ … ],
  },
  // Punteggio 0-100 per obiettivo SDG (1..17). Alti per gli SDG allineati (già in sdgAligned).
  sdg: [ { goal, score } … ],
  // Sotto-temi per dimensione con compliance, criticità e raccomandazioni.
  subThemes: {
    E: [ {
      label,
      compliance: { aligned, partial, non },   // %
      criticalCount,                           // n. criteri critici
      criteria: [ { label, valuePct, livello, critical, recommendation } … ],
    } … ],
    S: [ … ], G: [ … ],
  },
}
```

Regole di coerenza:
- La compliance per dimensione riflette il punteggio: **E** ~ misto (allineato prevalente, qualche
  parziale/critico), **S** ~ quasi tutto allineato, **G** ~ tutto allineato.
- I `valuePct`/`livello` dei criteri e i `criticalCount` dei sotto-temi aggregano verso la compliance
  della dimensione (nessuna contraddizione visibile a schermo).
- I punteggi SDG alti solo per gli SDG in `sdgAligned` (1,3,4,5,7,8,10,11,13,15,16,17 per l'ospedale).

## 4. Tassonomia sotto-temi

- **E** (dai mockup): Uso delle risorse del territorio e del capitale naturale · Emissioni e innovazione ·
  Economia circolare e rifiuti · Mitigazione dei rischi ambientali.
- **S** (proposta): Qualità del lavoro e occupazione · Inclusione e parità di genere · Relazioni con la
  comunità e beneficiari · Salute e sicurezza.
- **G** (proposta): Trasparenza e rendicontazione · Integrità e gestione responsabile · Coinvolgimento
  stakeholder · Monitoraggio e controllo.

I criteri di `computeEsg` (itemsE/S/G) vengono distribuiti su questi sotto-temi; ogni criterio riceve
una `recommendation` curata e un flag `critical` coerente col suo `livello`.

## 5. Struttura pagine e incrementi

### Incremento 1 — Riepilogo a 3 sezioni (tab "Riepilogo")
Sotto la card rating già esistente, tre sezioni:
1. **Compliance ESG** (ESG_2): barra compliance **complessiva** + barre per **Environmental/Social/
   Governance** (con selettore dimensione), toggle **Grafico / Dati in tabella**, testo "Contenuto del
   grafico". Dati da `esgDetail.compliance`.
2. **Contributo alla materialità** (ESG_3): tre colonne E/S/G, ogni sotto-tema con **% + barra**;
   legenda a 5 fasce (0-10 / 10-30 / 30-50 / 50-60 / 60-100); toggle visiva/tabella. Dati da
   `esgDetail.materiality`.
3. **Obiettivi di sviluppo sostenibile (SDG)** (ESG_4, versione semplice): **lista/barre** degli SDG
   con numero, etichetta e **punteggio**; ordinati per punteggio. Dati da `esgDetail.sdg`. (Ruota
   radiale rimandata.)

### Incremento 2 — Sotto-pagine E/S/G (tab Environmental/Social/Governance)
Per ciascuna dimensione (img 5/6/7):
- **Performance sul tema e i sotto-temi** (ESG_6): barra compliance per ciascun **sotto-tema**.
- **Metodologia, risultati e raccomandazioni** (ESG_5): per ogni sotto-tema un pannello espandibile con
  badge "Sotto-temi critici X/Y"; dentro, card per criterio con **Valore % + livello** e
  **Raccomandazione** (badge "Critico" se `critical`).
- **Radar** dei sotto-temi (ESG_7): riuso di un componente radar esistente (`McaProfileRadar`/
  `MCARadarChart`/`drawSpider`) alimentato dai punteggi dei sotto-temi.
Dati da `esgDetail.subThemes[dimensione]`.

## 6. Componenti / file
- `app/src/lib/projectState.js` — `esgDetail` curato nell'`esgResults` dell'ospedale (+ bump cache se
  cambia forma seed).
- `app/src/components/EsgResults.jsx` — rendering delle 3 sezioni Riepilogo (inc. 1) e delle sotto-pagine
  E/S/G (inc. 2); nuovi sotto-componenti (ComplianceSection, MaterialitySection, SdgList, SubThemePanel).
  Fallback invariato quando `esgDetail` è assente.
- Radar: riuso di un componente esistente (da valutare in fase di plan: `McaProfileRadar` è TSX del
  modulo DOCFAP; se non riusabile fuori contesto, un piccolo radar SVG dedicato).

## 7. Non-obiettivi
- Nessun motore ESG generale (sotto-temi/materialità/SDG-score curati solo per l'ospedale).
- Ruota SDG radiale a 17 spicchi: fuori dal primo incremento.
- Altri progetti: pagina ESG invariata (fallback).
- Export PDF/Excel: restano placeholder.

## 8. Rischi
- `EsgResults.jsx` cresce: isolare i nuovi blocchi in sotto-componenti; non rompere il fallback per i
  progetti senza `esgDetail`.
- Riuso radar cross-modulo (TSX DOCFAP in una pagina JSX Ricadute): se problematico, radar SVG dedicato.
- Coerenza dati curati ↔ punteggi calcolati: rivedere a schermo che non ci siano contraddizioni.
- Bump cache `localStorage` se `esgResults` cambia forma.

## 9. Verifica (build + a schermo)
- `npm run build` verde.
- Riepilogo ospedale: 3 sezioni popolate e coerenti (compliance E media, S/G alte; materialità alta su
  S salute/beneficiari; SDG salute/istruzione/genere alti).
- Sotto-pagine E/S/G: sotto-temi con compliance, raccomandazioni e criticità coerenti; radar leggibile.
- Altri progetti (nido, MUBA): pagina ESG invariata (nessun `esgDetail` → fallback).
