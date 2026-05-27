# Civiqa — Sezione "Analisi di Impatto Economico" · Redesign

> **Scopo del documento.** Specifica completa per la riprogettazione della sezione di dettaglio dell'Analisi di Impatto Economico (EIA) di Civiqa. Sostituisce l'attuale layout a 6 tab uniformi (Riepilogo · Spese · PIL · Occupazione · Valore della Produzione · Redditi · Gettito) con un'architettura a **5 tab eterogenee** progettate per essere comprensibili a un'utenza non specialistica e usabili come strumento di lavoro.
>
> **Audience del documento**: designer e sviluppatore frontend. Le sezioni "Layout & contenuti" sono prevalentemente per il designer; "Componenti & stati" e "Note implementative" per lo sviluppatore.

---

## 1. Principi guida

Prima di scendere nel dettaglio, fissiamo le regole che hanno governato ogni scelta. Quando in dubbio durante l'implementazione, torna qui.

### 1.1 Piattaforma, non report

L'utente entra in questa sezione **per cercare un dato o capire un risultato**, non per leggere un saggio. La prima schermata (tab Sintesi) risponde già alla domanda di chi ha solo bisogno del numero. Le altre tab approfondiscono per chi vuole capire *perché*, *dove*, *in quali settori*, oppure esplorare liberamente i dati.

Conseguenze concrete:

- Niente narrative lunghe in linea. Frasi descrittive brevi (max 2-3 righe), parametrizzate sui dati del singolo progetto.
- Niente catene visive sequenziali (frecce, step numerati tra dimensioni). Spesa → PIL → Occupazione **non è una catena**: sono letture parallele dello stesso fenomeno.
- Niente "scroll lungo a sezioni". Tab orizzontali ben visibili, ciascuna autoconsistente.

### 1.2 Accessibilità del linguaggio

Il bersaglio è un funzionario di un piccolo Comune, non un econometrico. Vale ovunque:

- I termini tecnici (moltiplicatore, indotto, spillover) **si usano**, ma sempre accompagnati da una formulazione equivalente in linguaggio piano. Esempio: invece di "Moltiplicatore PIL: 1,32" → "**Per ogni euro speso, l'economia regionale ne restituisce 1,32 di valore aggiunto** *(moltiplicatore: 1,32)*".
- Ogni grafico è accompagnato da un blocco "Come si legge" di 1-2 frasi.
- Esiste un glossario sempre accessibile da un'icona "?" nell'header di ciascuna tab.

### 1.3 Coerenza visiva con Civiqa

La nuova sezione riusa i pattern già in produzione nel resto di Civiqa, in modo che sembri parte della stessa famiglia.

Pattern riusati:
- **Banner scuro di intestazione pagina** con titolo + tag colorato + bottoni download (mantenuto identico al pattern attuale).
- **Tabella "Settore / Dataset / Metodologia"** sotto il banner (mantenuta identica).
- **KPI-pill arrotondati** ("1,32× moltiplicatore PIL") come nella pagina "Le analisi del progetto".
- **CTA viola** (`brand-violet`) per azioni primarie, **bottone nero** per scarico documenti.
- **Riga `accent-lime` 3px** come accento di forte gerarchia.
- **Tag pastello colorati** (rosa EIA, azzurro ECBA, teal ESG) come pattern di categorizzazione visiva.

Pattern **non** riusati nelle nuove viste:
- **Card "banner nero" interna a una vista** (es. l'attuale card scura "Spesa iniziale" che avevo proposto in una bozza precedente): troppo pesante, stonante in un contesto già denso. Sostituita con card bianca enfatica (vedi §4).
- **Linguaggio narrativo lungo da report**: sostituito con frasi parametriche brevi.

### 1.4 Adattività ai casi reali

Non tutti i progetti hanno dati ricchi. Tre scenari tipo:

- **Caso "ricco"**: shock multi-provincia, decine di settori, dispersione articolata (es. Sardegna PST).
- **Caso "medio"**: shock su 1-2 province, 5-10 settori coinvolti.
- **Caso "povero"**: shock su una sola provincia, pochi settori (es. piccolo cantiere comunale).

Ogni vista ha **regole di rendering condizionali** che adattano la rappresentazione al caso. Mappe quasi vuote, scatter con 3 punti, liste con un elemento solo sono peggio del nulla. Le regole sono specificate vista per vista.

### 1.5 Coerenza metodologica

Le scelte di visualizzazione rispettano la metodologia OE già documentata (vedi step 04-07 del report Sardegna):

- Il **gettito fiscale è solo nazionale**: non si scompone territorialmente.
- Il **moltiplicatore di riferimento è quello regionale**: a livello provinciale tende a sottostimare il rendimento del progetto (parte degli effetti si attiva nel resto della regione tramite spillover); a livello nazionale tende a sovrastimarlo (include valore che si sposta in regioni che non sono il committente). Implicazione concreta nel design: i KPI-pill sintetici sono ancorati al perimetro regionale (vedi §4.5).
- I **redditi** non sono scomposti per Diretto/Indiretto/Indotto in modo pulito: vengono mostrati solo nella vista geografica e nella sintesi, non nella vista Componenti.

---

## 2. Design tokens di riferimento

Estratti dal `tailwind.config.js` esistente, dall'index.css fornito e dai pattern osservati negli screenshot. Riferimento per il documento.

### 2.1 Colori

| Token | HEX | Uso |
|---|---|---|
| `brand-violet` | `#5B21F7` | CTA primarie, tab attiva, evidenze, accenti di selezione |
| `accent-lime` | `~#B7F500` | Riga separatore 3px, banner takeaway, highlights di chiusura |
| `ink-900` | `#0E0E10` | Testo primario, banner scuri di intestazione pagina |
| `ink-700` | `~#3D3D45` | Testo secondario |
| `ink-500` | `~#7A7A85` | Testo terziario, labels, placeholder |
| `ink-300` | `~#B5B5BC` | Bordi forti, divider marcati |
| `ink-100` | `~#ECECF0` | Bordi sottili, dividers |
| `bg-page` | `~#F6F6F8` | Sfondo principale main, fondo per sezioni di lettura |
| `white` | `#FFFFFF` | Sfondo card |

**Nuovi colori semantici per la sezione impatto** (da aggiungere al config):

| Token | HEX | Uso |
|---|---|---|
| `impact-direct` | `#5B21F7` (= brand-violet) | Componente "Diretto" |
| `impact-indirect` | `#9E7BFA` | Componente "Indiretto"; quota resto-regione nel selettore perimetro |
| `impact-induced` | `#D4C5FB` | Componente "Indotto"; quota extra-regionale nel selettore perimetro |
| `impact-retain` | `#1F8C4A` | Valore trattenuto in regione (Settori) |
| `impact-leak` | `#C45A2E` | Valore disperso fuori regione (Settori) |

I tre toni di viola (`impact-direct/indirect/induced`) sono riusati con **doppia semantica**:
- In Componenti: scomposizione Diretto/Indiretto/Indotto.
- In Sintesi (mini-barra perimetro): provincia origine / resto regione / extra regione.

Il riuso è coerente: in entrambi i casi i tre toni rappresentano "cerchi concentrici" di propagazione (settoriale o territoriale) dal punto di origine.

### 2.2 Tipografia

Font: **Inter**, già caricato globalmente.

| Stile | Peso | Size | Uso |
|---|---|---|---|
| `display-xl` | 700 | 36-44px | Macronumeri principali nelle card effetti |
| `display-lg` | 700 | 28-32px | Macronumeri secondari, spesa iniziale |
| `display-md` | 700 | 22-24px | Numeri inline, totali in barre |
| `heading-1` | 700 | 24px | Titoli di tab |
| `heading-2` | 700 | 18px | Titoli di sezione interna |
| `heading-3` | 600 | 14px | Sotto-titoli |
| `label-sm` | 600 | 11-12px uppercase | Micro-labels card |
| `body` | 400 | 14px | Testo descrittivo |
| `caption` | 400 | 12px | Note, fonti, didascalie |
| `mono-tabular` | 500 | 13px | Numeri in tabelle, valori in liste |

### 2.3 Spaziature e forme

- **Bordi**: 1px `ink-100` per dividers; 1px `ink-300` per controlli interattivi.
- **Border-radius**: 0 (squadrato) coerente con Civiqa attuale. **Eccezioni**: KPI-pill `rounded-full`; segmented control `rounded-md` (4px).
- **Padding standard card**: 24px desktop, 16px mobile.
- **Gap tra elementi**: 16px (compatto), 24px (standard), 40px (separazione di sezione).
- **Ombre**: nessuna; la separazione visiva si fa con bordi sottili e sfondi diversi.

---

## 3. Architettura della sezione

### 3.1 Struttura della pagina

La pagina di dettaglio EIA mantiene la struttura corrente nelle parti alte (banner scuro intestazione, tabella Settore/Dataset/Metodologia), e sostituisce **soltanto** il blocco delle 6 tab attuali con il nuovo blocco a 5 tab.

```
┌─────────────────────────────────────────────────────────┐
│ HEADER GLOBALE Civiqa (immutato)                        │
├─────────┬───────────────────────────────────────────────┤
│ SIDEBAR │ Breadcrumb: Dettaglio progetto › Analisi…     │
│ GLOBALE │ Meta: "Creato il… da… — Ultima modifica…"     │
│ (immut) │                                               │
│         │ ┌─────────────────────────────────────────┐  │
│         │ │ BANNER SCURO INTESTAZIONE (immutato)    │  │
│         │ │ Analisi di Impatto [EIA] [DIR,IND,IND]  │  │
│         │ │ Del progetto: …                         │  │
│         │ │           [Scarica report][Scarica xls] │  │
│         │ └─────────────────────────────────────────┘  │
│         │                                               │
│         │ ┌─────────────────────────────────────────┐  │
│         │ │ TABELLA META (immutata)                 │  │
│         │ │ Settore | Dataset | Metodologia         │  │
│         │ └─────────────────────────────────────────┘  │
│         │                                               │
│         │ ╔═══════════════════════════════════════════╗│
│         │ ║  TAB BAR — 5 BOX SEGMENTATI GRANDI        ║│
│         │ ╠═══════════════════════════════════════════╣│
│         │ ║                                           ║│
│         │ ║      CONTENUTO DELLA TAB ATTIVA           ║│
│         │ ║                                           ║│
│         │ ╚═══════════════════════════════════════════╝│
│         │                                               │
│         │ Footer Civiqa (immutato)                      │
└─────────┴───────────────────────────────────────────────┘
```

### 3.2 Le 5 tab

| # | Tab | Domanda a cui risponde | Output principale |
|---|---|---|---|
| 1 | **Sintesi** | "Quanto vale l'impatto?" | 5 card effetti + 4 KPI sintetici + frase di chiusura |
| 2 | **Componenti** | "Come si propaga dentro la filiera?" | Decomposizione Diretto/Indiretto/Indotto, una dimensione alla volta |
| 3 | **Geografia** | "Dove si attiva sul territorio?" | Mappa regionale + drill provinciale + lista top |
| 4 | **Settori** | "In quali settori?" | Barre divergenti intra/extra + heatmap territorio × settore |
| 5 | **Esplora** | "Voglio vedere i numeri come dico io" | Pivot configurabile (dimensione · asse · profondità) + tabella + export |

### 3.3 Tab bar — design

La tab bar è il **punto debole dell'attuale Civiqa** (underline sottile, testo poco enfatico). La riprogettiamo come **box segmentati grandi** che fungono da navigazione di primo livello forte.

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ ████████████ │              │              │              │              │
│ ████ SINTESI │  COMPONENTI  │  GEOGRAFIA   │  SETTORI     │  ESPLORA     │
│ ████ 3,56M€  │ 44% diretto  │ 84% Sardegna │ Costruzioni  │ Pivot dati   │
│ ████ PIL     │              │              │ leader       │              │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
  ↑ attiva (viola)   ↑ inattive (bianche con bordo)
```

**Specifiche stile**:
- Altezza: 64px desktop, 56px tablet.
- Larghezza: equa, distribuita su 100% (5 colonne `flex-1`).
- Layout interno della tab: due righe verticalmente centrate. Riga 1 = **nome tab** (Inter 700, 16px, uppercase no). Riga 2 = **anteprima dato** (Inter 400, 12px, color `ink-500` se inattiva, `rgba(255,255,255,0.85)` se attiva).
- Border-radius: 0 (squadrato, coerente con Civiqa).

**Stato attivo**:
- Sfondo `brand-violet` (`#5B21F7`).
- Testo bianco peso 700 (riga 1) e bianco-trasparente 85% (riga 2).
- Nessun bordo.

**Stato inattivo**:
- Sfondo bianco.
- Bordo 1px `ink-100` (tutto attorno, con bordo destro condiviso con la tab successiva).
- Testo `ink-900` peso 600 (riga 1), `ink-500` peso 400 (riga 2).
- Hover: sfondo `bg-page`, testo invariato.
- Focus: outline 2px `brand-violet` interno con offset.

**Anteprima dato (riga 2)**:
Calcolata server-side come parte del payload dell'analisi. Permette all'utente di scegliere dove andare senza dover entrare e uscire dalle tab. Esempi:

| Tab | Esempio anteprima | Logica |
|---|---|---|
| Sintesi | `3,56 M€ PIL` | Valore PIL regionale principale |
| Componenti | `44% diretto` | Quota della componente dominante per PIL |
| Geografia | `84% in Sardegna` | Quota intra-regionale del PIL |
| Settori | `Costruzioni leader` | Settore con maggior PIL attivato in regione |
| Esplora | `Pivot dati` | Etichetta statica (è uno strumento, non un risultato) |

**Persistenza**: la tab attiva è in URL come query param (`?tab=geografia`). Default `?tab=sintesi`.

**Mobile (<768px)**: la tab bar diventa scrollabile orizzontalmente con `overflow-x-auto`. Ogni tab mantiene larghezza minima 140px. Indicatore di scroll (gradient ai bordi). Su mobile le anteprime dato si nascondono per risparmiare spazio.

### 3.4 Help contestuale per tab

In alto a destra di ogni tab (a livello del titolo "Sintesi", "Componenti", ecc.), un'icona "?" 16px apre un **popover laterale** (320px, fissato a destra dello schermo, non modale, dismissibile con click esterno o ESC) con il glossario specifico per la tab. Il contenuto è statico e scritto in linguaggio piano (vedi §9).

---

## 4. Vista 1 — Sintesi

### 4.1 Cosa risponde

> "Quanto vale l'impatto economico del progetto, in sintesi? Quanto resta in regione, quanto va fuori, quanto rende per ogni euro speso?"

È la **landing tab** della sezione. Se un utente entra qui per cercare un solo dato, lo trova senza dover cliccare altrove. Tutto il resto è approfondimento.

### 4.2 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ TITOLO TAB                                              [?]     │
│ Sintesi dell'impatto                                            │
│                                                                 │
│ ┌─ Controlli di vista ────────────────────────────────────────┐│
│ │ Perimetro:  [Prov. origine] [● Regione] [Nazionale]         ││
│ │ Modalità:   [● Valori assoluti] [Pro capite]                ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Spesa iniziale ────────────────────────────────────────────┐│
│ │ ▌ SPESA TOTALE INVESTITA                                    ││
│ │ ▌ 2,69 milioni €                                            ││
│ │ ▌ L'investimento di partenza, distribuito su 7 voci di      ││
│ │ ▌ spesa nella provincia di Sassari (Sardegna).              ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Griglia 5 card effetti ────────────────────────────────────┐│
│ │ ┌──────────┐  ┌──────────┐  ┌──────────┐                    ││
│ │ │ PRODUZ.  │  │ PIL      │  │ OCCUP.   │                    ││
│ │ │ 5,97 M€  │  │ 3,56 M€  │  │ 47,1 ETP │                    ││
│ │ │ ▓▓▓▓▒░   │  │ ▓▓▓▓▒░   │  │ ▓▓▓▓▒░   │                    ││
│ │ │ Descriz. │  │ Descriz. │  │ Descriz. │                    ││
│ │ └──────────┘  └──────────┘  └──────────┘                    ││
│ │ ┌──────────┐  ┌──────────┐                                  ││
│ │ │ REDDITI  │  │ GETTITO  │                                  ││
│ │ │ 3,49 M€  │  │ 1,12 M€  │                                  ││
│ │ │ ▓▓▓▓▒░   │  │ naziona. │                                  ││
│ │ │ Descriz. │  │ Descriz. │                                  ││
│ │ └──────────┘  └──────────┘                                  ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Indicatori sintetici (KPI-pill row) ───────────────────────┐│
│ │ Riferiti al perimetro regionale.                            ││
│ │                                                             ││
│ │ [1,32× moltiplicatore PIL]                                  ││
│ │ [2,22× moltiplicatore Produzione]                           ││
│ │ [17,5 ETP per milione € speso]                              ││
│ │ [41,6% spesa rientra come gettito]                          ││
│ │                                                             ││
│ │ Nota (visibile se selettore ≠ Regione): "I moltiplicatori   ││
│ │ sono ancorati al perimetro regionale, dove sono più         ││
│ │ affidabili. A livello provinciale tendono a sottostimare    ││
│ │ il rendimento (parte degli effetti si attiva nel resto      ││
│ │ della regione); a livello nazionale a sovrastimarlo."       ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Frase di chiusura (banner lime) ───────────────────────────┐│
│ │ ▌ "L'84% del valore aggiunto attivato resta in Sardegna.    ││
│ │ ▌ La spesa è fortemente ancorata al territorio."            ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Controlli di vista (in alto)

Due segmented control orizzontali, uno sotto l'altro o affiancati a seconda dello spazio. Sfondo `bg-page`, padding 16px, border-radius 4px.

**Perimetro** (3 stati):
- `Prov. origine` · `Regione` · `Nazionale`
- Default: **Regione** (corrisponde al comportamento attuale di Civiqa, non rompe le aspettative).
- Stato attivo: sfondo `ink-900`, testo bianco peso 600.
- Stati inattivi: sfondo bianco, testo `ink-700` peso 500, bordo 1px `ink-300`.

**Modalità** (2 stati):
- `Valori assoluti` · `Pro capite`
- Default: **Valori assoluti**.
- Stesso stile del primo.

I due selettori sono **indipendenti**: si possono combinare (es. Nazionale × Pro capite = "valore aggiunto per abitante italiano attivato dal progetto").

Persistenza in URL: `?tab=sintesi&perim=regione&modal=assoluti`.

### 4.4 Card "Spesa iniziale"

Banner bianco enfatico, full-width, posizionato sopra la griglia delle 5 card effetti.

Stile:
- Sfondo bianco.
- Bordo sinistro 4px `brand-violet` (l'unica "decorazione" forte, sostituisce il banner scuro precedentemente proposto).
- Padding 24px.
- Bordo esterno 1px `ink-100`.

Contenuto:
- Micro-label uppercase: `SPESA TOTALE INVESTITA` (Inter 600, 11px, `ink-500`).
- Numero grande: `{valore} milioni €` (display-lg, `ink-900`).
- Descrizione (body, `ink-700`): *"L'investimento di partenza, distribuito su {N} voci di spesa nella provincia di {nome_provincia} ({nome_regione})."*

**Importante**: la "Spesa iniziale" **non è influenzata dai selettori di perimetro o pro-capite**. È l'input, sempre uguale, sempre in valore assoluto. È il punto di riferimento da cui tutto deriva.

### 4.5 Griglia delle 5 card effetti

Griglia 3 colonne desktop, 2 tablet, 1 mobile. Gap 16px. Tutte le card hanno lo stesso stile (no gerarchie tra dimensioni).

#### 4.5.1 Struttura di una card effetto

```
┌──────────────────────────────────────┐
│ [icona 20px]  MICRO-LABEL UPPERCASE  │
│                                      │
│ 5,97 M€                              │  ← display-xl
│ regione Sardegna                     │  ← caption del perimetro attivo
│                                      │
│ ▓▓▓▓▓▒▒▒░░░░                         │  ← mini-barra 3 segmenti
│ Prov:1,95  R.reg:1,61  Extra:0,67    │
│                                      │
│ ── divider ──                        │
│                                      │
│ Descrizione 2-3 righe (body 13px)    │
│ parametrica sul perimetro attivo     │
└──────────────────────────────────────┘
```

#### 4.5.2 Le 5 card (mappatura)

| Card | Icona | Micro-label | Valore mostrato (modalità Assoluti × Regione) |
|---|---|---|---|
| Produzione | `factory` | `VALORE DELLA PRODUZIONE` | 5,97 M€ |
| PIL | `trending-up` | `PIL (valore aggiunto)` | 3,56 M€ |
| Occupazione | `users` | `OCCUPAZIONE` | 47,1 ETP |
| Redditi | `wallet` | `REDDITI DISTRIBUITI` | 3,49 M€ |
| Gettito | `landmark` | `GETTITO FISCALE` | 1,12 M€ |

#### 4.5.3 Mini-barra a 3 segmenti

Sotto il numero principale, una **barra orizzontale a 3 segmenti** mostra sempre la decomposizione territoriale, indipendentemente dal perimetro selezionato. Cambia quale segmento è "attivo" (pieno), gli altri sono attenuati.

Tre segmenti, larghezza proporzionale ai valori:
- **Provincia origine** — colore `impact-direct` (`#5B21F7`)
- **Resto della regione** — colore `impact-indirect` (`#9E7BFA`)
- **Extra regione** — colore `impact-induced` (`#D4C5FB`)

Comportamento secondo il selettore di perimetro:
- **Perimetro = Provincia origine**: solo il primo segmento è in colore pieno; gli altri due sono a opacity 30%.
- **Perimetro = Regione**: i primi due segmenti pieni, il terzo a opacity 30%.
- **Perimetro = Nazionale**: tutti e tre i segmenti pieni.

Sotto la barra, **3 mini-numeri** allineati ai segmenti, in caption color `ink-700`. Esempio: `Prov:1,95  R.reg:1,61  Extra:0,67` (tutti in milioni €).

Click su un segmento (o sul numero sotto) → **non navigazione**, solo tooltip espanso con il valore esatto e la percentuale sul totale nazionale. Niente drill-down qui (per quello c'è la tab Geografia).

#### 4.5.4 Comportamento secondo il selettore di perimetro

Il **numero grande** (display-xl) mostra il valore che corrisponde al perimetro attivo:

| Perimetro | Numero grande (esempio PIL) | Etichetta sotto |
|---|---|---|
| Prov. origine | 1,95 M€ | `provincia di Sassari` |
| Regione | 3,56 M€ | `regione Sardegna` (default) |
| Nazionale | 4,24 M€ | `Italia` |

La mini-barra a 3 segmenti rimane sempre lì, cambiano solo i segmenti in evidenza.

#### 4.5.5 Comportamento secondo il selettore pro-capite

Quando modalità = `Pro capite`:
- Il numero grande si trasforma in valore pro-capite.
- L'unità si adatta: `€/abitante` se ≥ 1 €, `€/1.000 ab.` se < 1 €. Per ETP: `ETP/10.000 ab.`.
- L'etichetta sotto il numero aggiunge: `pro capite` (es. `regione Sardegna · pro capite`).
- La mini-barra mostra **comunque i valori assoluti** (con una micro-nota in caption: "ripartizione in valori assoluti"). Motivo: il pro-capite di una macro-area non ha senso semantico solido.

#### 4.5.6 Eccezione: card Gettito

Il **gettito è sempre nazionale**, indipendentemente dal selettore di perimetro.

Quando il selettore di perimetro è su Regione o Provincia:
- Il numero grande mostra comunque il valore nazionale.
- L'etichetta sotto: `Italia · valore non scomponibile`.
- La mini-barra a 3 segmenti **non viene mostrata**. Al suo posto, una piccola nota color `ink-500`: *"Il gettito non si attribuisce a territori specifici (vedi metodologia)."*

In modalità pro-capite: stessa eccezione. Il gettito mostra `Valore nazionale` con nota: *"Il gettito non si converte in pro-capite per natura."*

#### 4.5.7 Descrizioni parametriche (testi sotto le card)

Ogni card ha 2-3 righe di testo che spiegano il significato del numero **in funzione del perimetro attivo**.

**Card Produzione**:
- Perim. Regione: *"È il volume d'affari attivato lungo l'intera filiera dei fornitori che operano in {regione}: dai cantieri ai produttori di servizi, fino ai consumi a valle."*
- Perim. Prov. origine: *"È il volume d'affari attivato nei soli settori della provincia di {prov}, prima che gli effetti si diffondano nel resto della regione e oltre."*
- Perim. Nazionale: *"È il volume d'affari attivato sull'intera filiera italiana, dalle imprese che eseguono i lavori ai loro fornitori in tutto il Paese."*

**Card PIL**:
- Perim. Regione: *"È il valore aggiunto trattenuto dall'economia di {regione}: la differenza tra fatturato e costi degli input, ovvero ciò che rimane disponibile per remunerare lavoratori, imprese e fisco regionali."*
- Perim. Prov. origine: *"È il valore aggiunto che resta nella provincia di {prov}, prima del diffondersi degli effetti verso il resto della regione."*
- Perim. Nazionale: *"È il valore aggiunto generato dall'intervento sull'intera economia italiana, includendo la dispersione verso filiere fuori regione."*

**Card Occupazione**:
- Perim. Regione: *"Sono i posti di lavoro equivalenti a tempo pieno generati in {regione} su tutta la filiera. Calcolati su {anni} anno/i di realizzazione."*
- Perim. Prov. origine: *"Sono i posti di lavoro equivalenti generati nella sola provincia di {prov}."*
- Perim. Nazionale: *"Sono i posti di lavoro equivalenti generati su tutta la filiera italiana."*

**Card Redditi**:
- Perim. Regione: *"È la quota di valore aggiunto che torna a famiglie e imprese di {regione} sotto forma di salari, profitti e rendite. Alimenta i consumi locali."*
- (analogamente per Prov. origine e Nazionale)

**Card Gettito** (sempre nazionale):
- *"È il rientro fiscale complessivo (IVA, IRPEF, IRES, contributi) attivato dall'intervento. Valore nazionale: il gettito erariale confluisce al bilancio dello Stato e non è attribuibile a un singolo territorio."*

### 4.6 Fascia indicatori sintetici (KPI-pill row)

Sotto la griglia, una fascia su sfondo `bg-page` (grigio chiarissimo) con padding 24px. Contiene:

1. **Etichetta di contesto** in alto, body 13px peso 500 color `ink-700`:
   *"Riferiti al perimetro regionale."*

2. **4 KPI-pill** in riga (wrap su mobile), stile `rounded-full`, bordo 1px `ink-300`, padding orizzontale 16px, padding verticale 8px:

| KPI | Formato | Tooltip |
|---|---|---|
| Moltiplicatore PIL | `1,32× moltiplicatore PIL` | "Per ogni euro speso, l'economia regionale ne restituisce 1,32 di valore aggiunto." |
| Moltiplicatore Produzione | `2,22× moltiplicatore Produzione` | "Per ogni euro speso, si attivano 2,22 € di volume d'affari nella filiera regionale." |
| Intensità occupazionale | `17,5 ETP per milione € speso` | "Posti di lavoro equivalenti a tempo pieno generati ogni milione di euro investito." |
| Autofinanziamento | `41,6% spesa rientra come gettito` | "Quota della spesa pubblica che rientra alle casse pubbliche come imposte attivate dal progetto." |

3. **Nota condizionale**, visibile **solo se il selettore di perimetro NON è su Regione**. Body 12px italic color `ink-700`:
   *"I moltiplicatori sintetici sono riferiti al perimetro regionale, il livello a cui questi indicatori risultano più affidabili. A livello provinciale tendono a sottostimare il rendimento del progetto (parte degli effetti si attiva nel resto della regione tramite spillover); a livello nazionale tendono a sovrastimarlo (include valore che si sposta in regioni che non sono il committente del progetto)."*

**Regola fondamentale**: i KPI-pill **non cambiano** al variare del selettore di perimetro o pro-capite. Sono ancorati al perimetro regionale × valori assoluti, sempre. Cambia solo la visibilità della nota esplicativa.

Motivo metodologico (vedi §1.5): i moltiplicatori a perimetri diversi dal regionale sono fuorvianti per la lettura del "rendimento" del progetto, anche se matematicamente corretti. Allinearli alla metodologia OE protegge l'utente da letture errate.

### 4.7 Frase di chiusura — banner lime

In fondo alla tab, banner full-width, sfondo bianco, bordo sinistro 4px `accent-lime`. Padding 24px, testo body 14px peso 500.

**Generato dinamicamente** in base ai dati. Template di logica:

```
SE pct_intra_regio ≥ 70% → "L'{pct}% del valore aggiunto attivato resta
                            in {regione}. La spesa è fortemente ancorata
                            al territorio."

SE 40% ≤ pct_intra_regio < 70% → "L'{pct}% del valore aggiunto resta in
                                  {regione}, il restante {1-pct}% si attiva
                                  in altre regioni attraverso le filiere
                                  di subfornitura nazionali."

SE pct_intra_regio < 40% → "Solo il {pct}% del valore aggiunto resta in
                            {regione}: la struttura della filiera porta
                            gran parte degli effetti fuori dal territorio
                            di spesa."
```

In modalità pro-capite, aggiungere riga: *"In termini pro-capite, il progetto attiva {val} € di valore aggiunto per abitante della regione."*

### 4.8 Stati condizionali

#### Caso "shock multi-provincia"

Se la spesa è distribuita su più province dello stesso territorio:
- La card "Spesa iniziale" sostituisce "nella provincia di X" con "distribuita su {N} province di {regione}".
- Sotto la spesa, una mini-lista compatta delle province coinvolte con la rispettiva quota %.
- Il selettore "Prov. origine" mostra una pill aggiuntiva per scegliere quale provincia visualizzare, oppure un cumulativo "tutte le province di origine".

#### Caso "gettito non disponibile"

- Card Gettito mostra valore `—` e descrizione: *"Gettito fiscale non calcolato per questa analisi."*
- KPI-pill "Autofinanziamento" scompare (riga si ricompone con 3 pill).

#### Caso "ETP non significativi (< 1)"

- Card Occupazione mostra: *"Meno di 1 posto di lavoro equivalente"* con il numero esatto sotto in caption.

#### Caso "redditi non scomponibili"

Alcuni dataset possono non calcolare i redditi:
- Card Redditi: valore `—` e descrizione: *"Redditi non calcolati per questa analisi."*

### 4.9 Note implementative

- **Animazione di entrata**: card della griglia con `eia-fade-up` stagger 80ms. Totale max 500ms.
- **Mini-barra**: 3 `<div>` con `width: {pct}%` e backgrounds dei 3 token viola, dentro container `relative`. Composizione CSS pura, niente librerie.
- **Cambio perimetro**: animazione di transizione sul numero principale (fade-out + scale 0.95 → fade-in + scale 1.0, 200ms totali). Mini-barra: cambio opacity sui segmenti con transition 200ms.
- **Skeleton state**: card con `skeleton-block` durante caricamento. La spesa iniziale è la prima a popolarsi.
- **Componenti React**:
  - `<ImpactSynthesis />` (container della tab)
  - `<ViewControls perimeter mode onChange />` (i due segmented control)
  - `<SpendInputCard data />`
  - `<EffectCardGrid effects perimeter mode />` (griglia)
  - `<EffectCard variant="prod|gdp|empl|inc|fisc" data perimeter mode />` (card singola)
  - `<ThreeSegmentBar values activeSegments />`
  - `<SyntheticKPIBar kpis perimeter />` (fascia in basso)
  - `<TakeawayBanner variant text />`


---

## 5. Vista 2 — Componenti

### 5.1 Cosa risponde

> "Come si propaga l'impatto dentro la filiera: quanto viene dall'effetto immediato, quanto dai fornitori a cascata, quanto dai consumi indotti dei lavoratori?"

Questa vista **sostituisce 3 dei 6 tab attuali** (Spese, PIL, Occupazione, Valore della Produzione). Invece di una pagina per dimensione, una sola pagina dove l'utente sceglie la dimensione e vede la decomposizione con tutti i suoi dettagli sempre visibili.

**Niente Redditi** in questa tab: i redditi non si scompongono pulitamente in Dir/Ind/Indot (sono già una scomposizione del valore aggiunto). I redditi appaiono solo nella Sintesi e nella Geografia.

### 5.2 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ TITOLO TAB                                              [?]     │
│ Come si propaga l'impatto                                       │
│                                                                 │
│ ┌─ Blocco didattico (sempre visibile) ────────────────────────┐│
│ │ COME SI LEGGE                                               ││
│ │ Ogni euro speso genera tre tipi di effetti che convivono:   ││
│ │                                                             ││
│ │ ● DIRETTO    L'effetto immediato sui settori che ricevono   ││
│ │              la spesa (es. l'impresa edile che esegue i     ││
│ │              lavori, l'hotel che ospita i visitatori)       ││
│ │                                                             ││
│ │ ● INDIRETTO  L'effetto sui fornitori dei settori che hanno  ││
│ │              ricevuto la spesa (es. il produttore di        ││
│ │              cemento, il fornitore di lenzuola)             ││
│ │                                                             ││
│ │ ● INDOTTO    I consumi delle famiglie dei lavoratori        ││
│ │              coinvolti, che spendono i loro stipendi in     ││
│ │              negozi, affitti, servizi                       ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Selettore dimensione ──────────────────────────────────────┐│
│ │ Dimensione: [● PIL] [Produzione] [Occupazione]              ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Decomposizione della dimensione selezionata ───────────────┐│
│ │                                                             ││
│ │ PIL totale (perimetro regionale)            3,56 M€         ││
│ │                                                             ││
│ │ ┌───────────────────────────────────────────────────────┐  ││
│ │ │██████████│░░░░░░░░░░│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  ││
│ │ └───────────────────────────────────────────────────────┘  ││
│ │  Diretto         Indiretto         Indotto                  ││
│ │  1,57M€ (44%)    0,63M€ (18%)      1,36M€ (38%)             ││
│ │                                                             ││
│ │ ┌──────────────┬─────────────────┬──────────────────────┐  ││
│ │ │ ● DIRETTO    │ ● INDIRETTO     │ ● INDOTTO            │  ││
│ │ │ 1,57 M€      │ 0,63 M€         │ 1,36 M€              │  ││
│ │ │ 44% del tot. │ 18% del tot.    │ 38% del tot.         │  ││
│ │ │              │                 │                      │  ││
│ │ │ Top settori: │ Top settori:    │ Top settori:         │  ││
│ │ │ 1.Costruz.   │ 1.Comm.det.     │ 1.Att.immob.         │  ││
│ │ │   0,72 M€    │   0,11 M€       │   0,21 M€            │  ││
│ │ │ 2.Alloggio   │ 2.Trasp.merci   │ 2.Alloggio           │  ││
│ │ │   0,32 M€    │   0,08 M€       │   0,12 M€            │  ││
│ │ │ 3.Studi arch.│ 3.Serv.profess. │ 3.Comm.dett.         │  ││
│ │ │   0,15 M€    │   0,07 M€       │   0,11 M€            │  ││
│ │ │              │                 │                      │  ││
│ │ │ Descrizione  │ Descrizione     │ Descrizione          │  ││
│ │ │ 1-2 righe    │ 1-2 righe       │ 1-2 righe            │  ││
│ │ └──────────────┴─────────────────┴──────────────────────┘  ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Frase interpretativa (banner lime) ────────────────────────┐│
│ │ ▌ "Il forte peso dell'indotto (38%) indica che gli stipendi ││
│ │ ▌ distribuiti generano consumi locali importanti."          ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Blocco didattico in alto

Sfondo `bg-page`, padding 24px, larghezza piena. Titolo "COME SI LEGGE" in micro-label.

Contiene la spiegazione dei tre concetti (Diretto/Indiretto/Indotto) in linguaggio piano. I tre pallini colorati (●) sono i token `impact-direct/indirect/induced`.

Testo statico, didattico. **Non parametrico**. Visibile sempre.

Sotto la spiegazione dei tre concetti, una piccola nota in italic color `ink-700`:
*"I tre effetti coesistono e si autoalimentano: l'indotto nasce dai redditi del diretto e dell'indiretto, che a loro volta tornano in produzione. La scomposizione è analitica, non temporale."*

### 5.4 Selettore dimensione

3 pill orizzontali. Stesso stile dei selettori in Sintesi.

- `Produzione` · `PIL` (default) · `Occupazione`
- Niente Redditi (vedi §5.1).

Click su una pill → barra + colonne sotto si aggiornano. Animazione: fade su valori, slide su top settori (200ms).

### 5.5 Decomposizione — il cuore della vista

#### 5.5.1 Riga totale + barra impilata

In alto, una riga con il totale della dimensione selezionata:
- A sinistra: etichetta `{Dimensione} totale (perimetro regionale)` in body 14px peso 500.
- A destra: valore in display-md peso 700 (es. `3,56 M€`).

Sotto, la **barra impilata orizzontale** unica, full-width. Altezza 48px. Tre segmenti:
- `impact-direct` (viola scuro) — quota Diretto.
- `impact-indirect` (viola medio) — quota Indiretto.
- `impact-induced` (viola chiaro) — quota Indotto.

Sotto la barra, **3 etichette** allineate ai segmenti, in body 13px:
- Nome componente in peso 600.
- Valore + percentuale sotto in peso 400.

Esempio: `Diretto / 1,57M€ (44%)`.

#### 5.5.2 Tre colonne di dettaglio sotto la barra

3 card affiancate (1/3 ciascuna desktop, stacked su mobile), sfondo bianco, bordo 1px `ink-100`, padding 20px.

**Header di ogni colonna**:
- Pallino colorato (token corrispondente).
- Nome componente in heading-3 (Inter 600, 14px uppercase).
- Valore in display-md (Inter 700, 22-24px).
- Percentuale in caption.

**Top settori** (3 settori per colonna):
- Lista verticale, gap 8px tra righe.
- Ogni riga: `N. NomeSettore` (peso 500) a sinistra, valore (peso 600 mono-tabular) a destra.
- Click su una riga: **nessuna navigazione** (la tab Settori e Esplora coprono il drill). Solo highlight + tooltip con valore esatto.

**Descrizione** (parametrica, 1-2 righe in body 13px color `ink-700`):

| Componente | Descrizione (PIL) | Descrizione (Produzione) | Descrizione (Occupazione) |
|---|---|---|---|
| Diretto | "Il valore aggiunto generato direttamente nei settori che ricevono la spesa." | "Il fatturato generato direttamente nei settori che eseguono i lavori e i servizi." | "I posti di lavoro creati direttamente nei settori che ricevono la spesa." |
| Indiretto | "Il valore aggiunto attivato sui fornitori dei settori di prima destinazione." | "Il fatturato attivato lungo la filiera dei fornitori." | "I posti di lavoro creati nei settori fornitori." |
| Indotto | "Il valore aggiunto generato dai consumi delle famiglie coinvolte." | "Il fatturato attivato dai consumi delle famiglie dei lavoratori." | "I posti di lavoro creati per soddisfare i consumi delle famiglie coinvolte." |

### 5.6 Frase interpretativa di chiusura

Banner lime in fondo, stesso pattern della Sintesi. Logica template:

```
SE indotto_pct ≥ 35% → "Il forte peso dell'indotto ({pct}%) indica
                       che gli stipendi distribuiti generano consumi
                       locali importanti."

SE diretto_pct ≥ 55% → "Il forte peso del diretto ({pct}%) riflette
                       il fatto che la spesa si concentra in settori
                       ad alta intensità di valore aggiunto immediato."

SE indiretto_pct ≥ 30% → "Il peso significativo della filiera indiretta
                         ({pct}%) mostra che il progetto attiva forti
                         effetti a cascata sui fornitori."

DEFAULT → "La decomposizione è bilanciata tra le tre componenti."
```

Più condizioni possono attivarsi: mostra fino a 2 frasi.

### 5.7 Stati condizionali

#### Caso "una componente è trascurabile (<2%)"

- Il segmento corrispondente nella barra non si vede.
- La colonna corrispondente sotto la barra mostra: *"Componente {nome}: valore trascurabile (<2%)"* in caption e nasconde la lista dei top settori.

#### Caso "dimensione non disponibile"

Se ad esempio l'Occupazione non è calcolata:
- La pill corrispondente è disabilitata (color `ink-300`, no click).
- Tooltip: *"Dato non disponibile per questa analisi."*

### 5.8 Note implementative

- **Render della barra**: 3 `div` con `width: {pct}%` e backgrounds dei 3 token viola.
- **Animazione di entrata**: barra "si riempie" da sinistra in 600ms (transform-origin left, transition CSS).
- **Cambio dimensione**: cross-fade tra dati (200ms).
- **Componenti React**:
  - `<ImpactComponents />` (container)
  - `<ComponentsLegend />` (blocco didattico)
  - `<DimensionSelector value onChange dimensions />` (pill row, riusabile)
  - `<StackedDecomposition data dimension />` (riga totale + barra impilata + labels)
  - `<ComponentColumn variant="direct|indirect|induced" data />` (colonna di dettaglio)
  - `<InterpretationBanner conditions data />`

---

## 6. Vista 3 — Geografia

### 6.1 Cosa risponde

> "Dove si attiva l'impatto: in quale regione/provincia si depositano i milioni di valore e i posti di lavoro?"

### 6.2 Decisione di base: drill-down regione → provincia

L'attuale Civiqa mostrava una lista di regioni. Il report Sardegna mostrava mappe provinciali. Qui combiniamo i due: **mappa regionale come default** (più leggibile, 20 forme grosse, sempre informativa), con **drill-down provinciale** cliccando su una regione (zoom + sostituzione con mappa provinciale di quella regione, breadcrumb di ritorno).

Vantaggi:
- La mappa regionale è quasi sempre visivamente significativa (anche nei casi "poveri").
- Il drill-down provinciale è disponibile per chi vuole approfondire, senza occupare spazio per default.
- L'utente vede una progressione naturale: Italia → Regione → Province.

### 6.3 Layout — stato default (mappa regionale)

```
┌─────────────────────────────────────────────────────────────────┐
│ TITOLO TAB                                              [?]     │
│ Geografia dell'impatto                                          │
│                                                                 │
│ Breadcrumb: Italia                                              │
│                                                                 │
│ ┌─ Controlli ─────────────────────────────────────────────────┐│
│ │ Dimensione: [● PIL] [Produzione] [Occupazione] [Redditi]    ││
│ │ Modalità:   [● Valori assoluti] [Pro capite]                ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Mappa regionale + lista top ───────────────────────────────┐│
│ │ ┌────────────────────────┬────────────────────────────────┐ ││
│ │ │                        │ TOP 10 REGIONI                 │ ││
│ │ │                        │                                │ ││
│ │ │   MAPPA ITALIA         │ 1. Sardegna       3,56M€ (84%) │ ││
│ │ │   (20 regioni)         │ 2. Lazio          0,21M€ (5%)  │ ││
│ │ │                        │ 3. Lombardia      0,15M€ (4%)  │ ││
│ │ │   Color scale:         │ 4. Toscana        0,05M€ (1%)  │ ││
│ │ │   ink-100 →            │ ...                            │ ││
│ │ │   brand-violet         │                                │ ││
│ │ │                        │ Altre 11 regioni  0,15M€       │ ││
│ │ │   Click regione →      │ ────────────────────────────── │ ││
│ │ │   drill provinciale    │ Totale Italia     4,24 M€      │ ││
│ │ └────────────────────────┴────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Come si legge ─────────────────────────────────────────────┐│
│ │ "Più scura la regione, maggiore il valore di {dimensione}.  ││
│ │  Clicca su una regione per vedere il dettaglio provinciale."││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Banda riassuntiva 3 aree ──────────────────────────────────┐│
│ │ Provincia origine │ Resto regione  │ Fuori regione          ││
│ │ 1,95 M€  (46%)    │ 1,61 M€ (38%)  │ 0,67 M€  (16%)         ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Frase di chiusura (banner lime) ───────────────────────────┐│
│ │ ▌ "L'84% del valore generato resta in Sardegna…"            ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 6.4 Layout — stato drill-down (mappa provinciale)

Quando l'utente clicca su una regione nella mappa o nella lista:

```
┌─────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Italia › Sardegna  [← Torna alla mappa nazionale]  │
│                                                                 │
│ Controlli (stessi di sopra)                                     │
│                                                                 │
│ ┌─ Mappa provinciale di Sardegna + lista province ────────────┐│
│ │ ┌────────────────────────┬────────────────────────────────┐ ││
│ │ │                        │ PROVINCE DI SARDEGNA           │ ││
│ │ │   MAPPA SARDEGNA       │                                │ ││
│ │ │   (4-8 province)       │ 1. Sassari      2,92M€ (82%)   │ ││
│ │ │                        │ 2. Cagliari     0,21M€ (6%)    │ ││
│ │ │   Provincia origine    │ 3. Sud Sard.    0,17M€ (5%)    │ ││
│ │ │   marcata con bordo    │ 4. Nuoro        0,16M€ (4%)    │ ││
│ │ │   lime                 │ 5. Oristano     0,11M€ (3%)    │ ││
│ │ │                        │                                │ ││
│ │ │                        │ Totale regione  3,56M€         │ ││
│ │ └────────────────────────┴────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Resto della pagina invariato                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5 Componenti — dettaglio

#### 6.5.1 Breadcrumb interno

Sopra la mappa, a sinistra. Formato: `Italia` (default) oppure `Italia › Sardegna` con bottone testuale `← Torna alla mappa nazionale` allineato a destra.

Stile: body 13px, link in `brand-violet` peso 500.

#### 6.5.2 Controlli

Due segmented control, identici per stile a quelli della Sintesi.

**Dimensione** (4 stati):
- `Produzione` · `PIL` (default) · `Occupazione` · `Redditi`

**Modalità** (2 stati):
- `Valori assoluti` (default) · `Pro capite`

Persistenza URL: `?tab=geografia&dim=pil&modal=assoluti&drill=sardegna` (drill assente nello stato nazionale).

#### 6.5.3 Mappa

**Stato default (Italia)**: SVG inline delle 20 regioni italiane. ~50KB.

**Stato drill (regione)**: SVG inline delle province della regione selezionata. Asset caricato lazy via dynamic import.

Color scale: lineare da `ink-100` (zero impatto) a `brand-violet` (massimo). 5 step intermedi visibili nella legenda.

Interazioni:
- **Hover**: tooltip nero con nome territorio + valore + quota %.
- **Click su regione** (stato nazionale): drill-down provinciale.
- **Click su provincia** (stato drill): nessuna navigazione, solo evidenziazione bidirezionale con la lista (la lista evidenzia la riga corrispondente).
- **Provincia di origine** sempre marcata con bordo `accent-lime` 2px per distinguerla dalle province "destinatarie di spillover".

#### 6.5.4 Lista top a destra

Colonna fissa ~320px. Stessa logica della mappa: 10 regioni nello stato nazionale, tutte le province nello stato drill.

Ogni riga:
- Numero progressivo color `ink-300` mono-tabular.
- Nome territorio body 14px peso 500.
- Valore mono-tabular allineato a destra.
- Percentuale sul totale (Italia per stato nazionale, regione per stato drill) in caption color `ink-500`.

Riga "Altre N regioni/province" in stile riassuntivo.
Riga "Totale" finale separata da divider, peso 700.

**Click su una riga**:
- Stato nazionale: drill-down sulla regione corrispondente.
- Stato drill: evidenziazione bidirezionale con la mappa, niente navigazione.

#### 6.5.5 Blocco "Come si legge"

Sotto mappa+lista, larghezza piena, sfondo `bg-page` padding 16px. Body 13px italic.

**Stato nazionale**:
*"Più scura la regione, maggiore il valore di {dimensione} attivato. La spesa è fisicamente localizzata in {regione_origine}; il colore mostra dove gli effetti si diffondono lungo le filiere produttive nazionali. Clicca su una regione per vedere il dettaglio provinciale."*

**Stato drill**:
*"Il bordo lime evidenzia la provincia di origine della spesa. Il colore delle altre province mostra il valore di {dimensione} attivato dallo spillover regionale."*

Se modalità = pro-capite, aggiungere: *"In modalità pro-capite il valore è diviso per la popolazione di ciascun territorio, neutralizzando l'effetto delle dimensioni demografiche."*

#### 6.5.6 Banda riassuntiva 3 aree

Larghezza piena, sfondo bianco, bordo 1px `ink-100`. 3 colonne larghezza uguale, dividers verticali tra colonne.

| Colonna | Contenuto |
|---|---|
| Provincia origine | Valore + % sul totale Italia |
| Resto della regione | Valore + % |
| Fuori regione | Valore + % |

I 3 valori sommano sempre al totale Italia.

In modalità pro-capite, questa banda **mostra comunque valori assoluti** con una micro-nota: *"Valori assoluti (la ripartizione non si converte in pro-capite)."*

#### 6.5.7 Frase di chiusura

Banner lime. Template come in Sintesi ma incentrato su geografia.

### 6.6 Stati condizionali

#### Caso "shock su singola provincia, dispersione minima (>95% in 1-2 province)"

La mappa coroplete nazionale sarebbe quasi tutta `ink-100`. **Layout alternativo**:

```
┌─ Provincia principale (ritratto) ─┬─ Top 5 province ─┐
│  [SVG provincia ingrandita]       │  Lista compatta   │
│  Cagliari                         │                   │
│  2,12 M€  (94%)                   │                   │
└───────────────────────────────────┴───────────────────┘
```

Trigger: `top_province.pct > 90% AND extra_regional_pct < 5%`.

#### Caso "dati pro-capite non disponibili"

Toggle pro-capite disabilitato. Tooltip: *"Dati di popolazione non disponibili per questa analisi."*

#### Caso "shock multi-regione"

Se la spesa è distribuita su più regioni di origine (raro ma possibile):
- Tutte le regioni di origine sono marcate con bordo lime.
- La banda 3 aree usa "Regioni di origine" come prima colonna (aggregata).

### 6.7 Note implementative

- **Asset mappe**: file SVG separati per Italia regionale (~50KB) e una mappa provinciale per regione (caricate lazy quando si fa drill). Preparare un repo `civiqa-maps/` con i 21 file.
- **Tooltip**: popper.js o equivalente leggero.
- **Performance**: la mappa Italia è caricata insieme alla tab Geografia (Suspense). Le mappe provinciali sono caricate dinamicamente solo al primo drill su quella regione.
- **Componenti React**:
  - `<ImpactGeography />` (container)
  - `<GeoBreadcrumb level region onBack />`
  - `<GeoControls dimension mode onChange />`
  - `<ItalyMap data dimension highlightedRegion onRegionClick />`
  - `<RegionMap regionCode data dimension highlightedProvince originProvince onProvinceClick />`
  - `<TerritoryList items selectedCode onSelect level />` (regioni o province in base allo stato)
  - `<ThreeAreaBand origineValue restoRegio extraRegio mode />`


---

## 7. Vista 4 — Settori

### 7.1 Cosa risponde

> "In quali settori produttivi si attiva il valore? Quali trattengono l'effetto sul territorio e quali lo disperdono? Come si distribuisce per settore × territorio?"

### 7.2 Due viste in una tab

La tab Settori ha **un toggle in alto** che switcha tra due rappresentazioni complementari:

- **Vista A — Barre divergenti**: per settore, mostra quanto valore resta in regione vs quanto si disperde fuori. Risponde alla domanda "quali settori sono territorialmente buoni e quali no?".
- **Vista B — Heatmap territorio × settore**: una griglia bidimensionale. Risponde alla domanda "su quale territorio si attiva quale settore?".

Il toggle è ben visibile in alto, default su Vista A.

### 7.3 Layout — Vista A (Barre divergenti)

```
┌─────────────────────────────────────────────────────────────────┐
│ TITOLO TAB                                              [?]     │
│ Impatti settoriali                                              │
│                                                                 │
│ ┌─ Toggle rappresentazione ───────────────────────────────────┐│
│ │ Vista: [● Barre divergenti] [Mappa di calore]               ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Controlli ─────────────────────────────────────────────────┐│
│ │ Dimensione: [● PIL] [Produzione] [Occupazione]              ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Come si legge ─────────────────────────────────────────────┐│
│ │ "Ogni barra è un settore. La parte verde a destra mostra il ││
│ │  valore che resta in {regione}; la parte arancione a        ││
│ │  sinistra mostra il valore che si attiva fuori regione."    ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Top settori — barre divergenti ────────────────────────────┐│
│ │                                                             ││
│ │           ←FUORI REGIONE   ┊   IN REGIONE→                  ││
│ │           ─────────────────┼─────────────────                ││
│ │ Costruz.  │      ░░░░░░│██████████████████  1,07 M€ (94%)   ││
│ │ Alloggio  │       ░░░░░│███████████████     0,57 M€ (92%)  ││
│ │ Immobil.  │ ██████░░░░░│████████             0,52 M€ (40%) ││
│ │ Comm.det. │        ░░░░│██████              0,19 M€ (88%)  ││
│ │ Serv.fin. │   █████░░░░│██████               0,14 M€ (62%) ││
│ │ Informat. │        ░░░░│█████               0,12 M€ (89%)  ││
│ │ ...                                                         ││
│ │ [Mostra tutti i 22 settori coinvolti]                       ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─────────────────────┬─────────────────────────────────────┐  │
│ │ TRATTIENE DI PIÙ    │ DISPERDE DI PIÙ                     │  │
│ │ (bordo verde 4px)   │ (bordo arancione 4px)               │  │
│ │                     │                                     │  │
│ │ Costruzioni 94% intra│ Attività immobiliari   60% extra  │  │
│ │ Alloggio    92% intra│ Servizi finanziari     38% extra  │  │
│ │ Comm.dett.  88% intra│ Serv.finanz.ausil.     45% extra  │  │
│ └─────────────────────┴─────────────────────────────────────┘  │
│                                                                 │
│ ┌─ Frase di chiusura (banner lime) ───────────────────────────┐│
│ │ ▌ Spiegazione del pattern osservato                         ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 Layout — Vista B (Heatmap territorio × settore)

```
┌─────────────────────────────────────────────────────────────────┐
│ Toggle: [Barre divergenti] [● Mappa di calore]                  │
│                                                                 │
│ Controlli:                                                      │
│ Dimensione: [● PIL] [Produzione] [Occupazione]                  │
│ Granularità: [● Regionale] [Provinciale]                        │
│                                                                 │
│ ┌─ Come si legge ─────────────────────────────────────────────┐│
│ │ "Righe = settori, colonne = regioni. Cella più scura =      ││
│ │  maggiore valore di {dim} attivato. Permette di vedere      ││
│ │  insieme dove e in quali settori si concentra l'impatto."   ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Heatmap ───────────────────────────────────────────────────┐│
│ │         │ Sard. │ Lazio │ Lomb. │ Tosc. │ Pied. │ ...      ││
│ │ ────────┼───────┼───────┼───────┼───────┼───────┼─────     ││
│ │ Costruz.│ █████ │   ░   │   ░   │       │       │          ││
│ │ Alloggio│ ████  │       │   ░   │   ░   │       │          ││
│ │ Immobil.│ ████  │  ███  │  ███  │   ░   │   ░   │          ││
│ │ Comm.det│ ████  │   ░   │   ░   │       │       │          ││
│ │ Serv.fin│  ██   │  ██   │  ██   │   ░   │       │          ││
│ │ ...                                                         ││
│ │                                                             ││
│ │ Legenda: 0 ░░░░░ █████ max                                  ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Hover su cella → tooltip con valore esatto                      │
│ Click su cella → drill (apre tab Esplora con filtri preimpost.) │
└─────────────────────────────────────────────────────────────────┘
```

### 7.5 Componenti — dettaglio

#### 7.5.1 Toggle rappresentazione

Segmented control stile uguale agli altri, ma con **icone affiancate al testo** per chiarezza:
- `[icona barre] Barre divergenti`
- `[icona heatmap] Mappa di calore`

Persistenza URL: `?tab=settori&view=divergenti` o `?view=heatmap`.

#### 7.5.2 Selettore dimensione

3 pill (Produzione · PIL · Occupazione). No Redditi (i redditi non sono per settore in modo significativo nelle SAM standard).

#### 7.5.3 Vista A — Barre divergenti (dettaglio)

**Etichetta di scala** sopra il grafico, caption uppercase color `ink-500`:
```
        ← FUORI REGIONE        IN REGIONE →
        ──────────────────┼───────────────
                          0
```

**Riga per settore**:
- Colonna 1 (160px): nome settore body 14px peso 500.
- Colonna 2 (flex-1): barra divergente.
- Colonna 3 (120px): totale (intra + extra) e % intra.

**Barra divergente**:
- Linea verticale centrale 1px `ink-300` (lo zero).
- A sinistra: barra `impact-leak` (arancione) allineata a destra, cresce verso sinistra.
- A destra: barra `impact-retain` (verde) allineata a sinistra, cresce verso destra.
- Scala globale: la barra più lunga (intra+extra del settore con maggior valore assoluto) determina la scala max.

**Top 10 settori** mostrati per default. Sotto, link `Mostra tutti i {N} settori coinvolti` → espande la lista a tutti.

#### 7.5.4 Doppia card insight (sotto barre)

Due card affiancate (1/2 ciascuna desktop, stacked mobile).

**Card sinistra — "Trattiene di più sul territorio"**:
- Bordo sinistro 4px `impact-retain` (verde).
- Top 3 settori per quota intra-regione %.
- Filtro: settori con valore assoluto totale > 5% della spesa (evita settori marginali).
- Ogni riga: nome settore, % intra, mini-barra verde.

**Card destra — "Disperde di più fuori regione"**:
- Bordo sinistro 4px `impact-leak` (arancione).
- Top 3 settori per quota extra-regione %.
- Stesso filtro.
- Ogni riga: nome settore, % extra, mini-barra arancione.

#### 7.5.5 Vista B — Heatmap (dettaglio)

**Asse Y (righe)**: top 15 settori per valore totale Italia (configurabile, default 15).

**Asse X (colonne)**: 
- Granularità Regionale (default): top 12 regioni per valore totale.
- Granularità Provinciale: top 15 province per valore totale.

**Celle**: rettangoli di larghezza/altezza fissa (~40px), color riempito secondo scala lineare bianca → `brand-violet` in base al valore.

Soglie di intensità (5 step della scala):
- 0%-5% del max: bianco con bordo `ink-100`.
- 5%-20%: viola chiarissimo.
- 20%-40%: viola chiaro.
- 40%-70%: viola medio.
- 70%-100%: `brand-violet` pieno.

**Interazioni**:
- **Hover su cella**: tooltip con `{settore} × {territorio}: {valore} ({%} del totale)`.
- **Click su cella**: apre la tab Esplora con filtri preimpostati (dimensione, settore, territorio).
- **Hover su intestazione riga/colonna**: evidenzia tutta la riga/colonna.

**Legenda**: barra orizzontale 200px sotto la heatmap, scala da 0 al max con 5 tacche.

#### 7.5.6 Frase di chiusura

Banner lime, comune a entrambe le viste. Template:

```
SE settori_non_delocalizzabili (Costruzioni, Alloggio, Comm.det., ecc.) in top intra
   → "I settori che catturano più valore sul territorio sono quelli
      legati alla presenza fisica: cantieri, alloggi, commercio locale.
      Sono attività non delocalizzabili."

SE Attività immobiliari o Servizi finanziari in top extra
   → "Una parte della dispersione si concentra su immobiliare e
      servizi finanziari: è un pattern strutturale dell'economia
      italiana, dove questi settori sono concentrati in poche
      aree del Paese (principalmente Lombardia e Lazio)."
```

### 7.6 Stati condizionali

#### Caso "pochi settori coinvolti (<5)"

- Vista A: lista compatta con cards verticali invece di barre divergenti.
- Vista B: heatmap disabilitata (tooltip: *"Pochi settori, vista non significativa. Usa la vista a barre."*).

#### Caso "tutti settori intra > 95%"

- Vista A: barre divergenti diventano barre semplici verdi (parte sinistra arancione invisibile).
- Nota in alto: *"Il progetto è quasi interamente locale: nessun settore disperde valore significativo fuori regione."*

#### Caso "shock concentrato su 1 settore"

- Aggiungere nota informativa in alto: *"La spesa è concentrata su {settore_principale} ({%}); i settori qui sotto includono anche quelli attivati per filiera (indiretto) e per consumi indotti."*

### 7.7 Note implementative

- **Vista A**: composizione CSS pura, niente librerie chart.
- **Vista B**: griglia CSS con celle background-color dinamici. Per dataset grandi (15×15 = 225 celle), considerare CSS `contain: layout style` per performance.
- **Componenti React**:
  - `<ImpactSectors />` (container)
  - `<SectorViewToggle value onChange />` (toggle barre/heatmap)
  - `<DivergentBarChart sectors dimension limit />` (Vista A)
  - `<DivergentBarRow sector intra extra max />` (riga singola)
  - `<SectorInsightCard variant="intra|extra" sectors />` (doppia card insight)
  - `<SectorHeatmap data dimension granularity onCellClick />` (Vista B)
  - `<HeatmapLegend max />` (legenda scala)

---

## 8. Vista 5 — Esplora

### 8.1 Cosa risponde

> "Voglio vedere i dati come dico io: una dimensione, un asse di scomposizione, una profondità. Voglio una tabella sortabile e un grafico, e potermi esportare tutto."

È l'unica tab orientata all'utente analitico — chi vuole verificare numeri, esportare per uso esterno, esplorare combinazioni che le altre tab non coprono. Strutturalmente è un **piccolo pivot tool** dentro Civiqa.

### 8.2 Concetto

Tre selettori in cascata permettono di costruire la vista:

1. **Cosa misurare** (la dimensione): Produzione · PIL · Occupazione · Redditi · Gettito.
2. **Come scomporre** (l'asse): Geografica · Settoriale · Per componente · Nessuna (totale).
3. **Livello di profondità** (dipende dall'asse):
   - Se asse = Geografica: Regionale · Provinciale.
   - Se asse = Settoriale: Top 10 · Tutti.
   - Se asse = Per componente: (nessun sotto-livello).
   - Se asse = Nessuna: (nessun sotto-livello).

Le scelte determinano automaticamente la rappresentazione grafica + tabella sotto.

### 8.3 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ TITOLO TAB                                              [?]     │
│ Esplora i dati                                                  │
│                                                                 │
│ Descrizione: "Combina dimensione, asse di scomposizione e       │
│ profondità per costruire la vista che ti serve. Esporta i       │
│ risultati in CSV o Excel."                                      │
│                                                                 │
│ ┌─ Configurazione vista ──────────────────────────────────────┐│
│ │                                                             ││
│ │  Cosa misurare        ┌─ Come scomporre ─┐                 ││
│ │  [● PIL ▾]            │ [● Geografica ▾] │                 ││
│ │  (Prod/PIL/Occ/Red/G) │ (Geo/Sett/Comp/  │                 ││
│ │                       │  Nessuna)        │                 ││
│ │                       └──────────────────┘                  ││
│ │                                                             ││
│ │  Livello              Altri filtri                          ││
│ │  [● Provinciale ▾]    [Solo top 10] [☐ Include zero]       ││
│ │  (Reg/Prov)                                                 ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Stato attuale: "PIL · scomposto per provincia · 107 righe"      │
│                            [Esporta CSV] [Esporta Excel]        │
│                                                                 │
│ ┌─ Risultato: grafico + tabella ──────────────────────────────┐│
│ │ ┌──────────────────────┬───────────────────────────────────┐ ││
│ │ │                      │ TABELLA SORTABILE                 │ ││
│ │ │   GRAFICO            │ ──────────────────────────────    │ ││
│ │ │   (auto-scelto in    │ Provincia       Valore     %      │ ││
│ │ │   base alla config)  │ Sassari         2,92M€    68,9    │ ││
│ │ │                      │ Cagliari        0,21M€     5,0    │ ││
│ │ │                      │ Sud Sardegna    0,17M€     4,0    │ ││
│ │ │                      │ Nuoro           0,16M€     3,8    │ ││
│ │ │                      │ Roma            0,11M€     2,6    │ ││
│ │ │                      │ ...                               │ ││
│ │ │                      │ Click su header per sortare       │ ││
│ │ └──────────────────────┴───────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 8.4 Componenti — dettaglio

#### 8.4.1 Pannello configurazione

Sfondo `bg-page` padding 24px. 4 dropdown affiancati su desktop (2×2 su tablet, 1×4 mobile).

**Cosa misurare** — dropdown a 5 opzioni:
- Produzione · PIL · Occupazione · Redditi · Gettito
- Default: PIL.
- Se "Gettito" selezionato: il selettore "Come scomporre" perde le opzioni "Geografica" e "Settoriale" (lasciano "Per componente" e "Nessuna"). Mostrato disabilitato con tooltip *"Il gettito è solo nazionale e non si scompone per territorio o settore."*

**Come scomporre** — dropdown a 4 opzioni:
- Geografica · Settoriale · Per componente (Dir/Ind/Indot) · Nessuna (totale)
- Default: Geografica.
- Validazioni come sopra.

**Livello** — dropdown che cambia opzioni in base al precedente:
- Se asse = Geografica: Regionale · Provinciale (default Regionale).
- Se asse = Settoriale: Top 10 · Tutti (default Top 10).
- Se asse = Per componente: campo disabilitato.
- Se asse = Nessuna: campo disabilitato.

**Filtri aggiuntivi** — checkbox e toggle:
- `Solo top N` (con dropdown numerico: 10 · 25 · 50 · Tutti).
- `Include valori zero/nulli` (default off).

#### 8.4.2 Riga di stato

Sotto il pannello, una riga che mostra in linguaggio piano la configurazione attuale + i bottoni export.

Esempi di descrizione auto-generata:
- *"PIL · scomposto per provincia · 107 righe"*
- *"Occupazione · per settore (top 10) · 10 righe"*
- *"Gettito · totale · 1 valore"*

A destra:
- `[Esporta CSV]` — pulsante outlined, bordo `ink-300`, testo `ink-900`.
- `[Esporta Excel]` — pulsante outlined.

#### 8.4.3 Grafico (sinistra del risultato)

Auto-scelto in base alla configurazione:

| Configurazione | Grafico |
|---|---|
| Geografica × Regionale | Mappa Italia |
| Geografica × Provinciale | Mappa Italia con tutte le province |
| Settoriale × Top 10 | Bar chart orizzontale |
| Settoriale × Tutti | Bar chart orizzontale scrollabile |
| Per componente | Stacked bar singola |
| Nessuna (totale) | Singolo numero grande + descrizione |

Tutti i grafici riusano componenti già definiti nelle altre tab (mappa da Geografia, bar da Settori, stacked da Componenti).

Larghezza: 60% desktop, 100% mobile.

#### 8.4.4 Tabella (destra del risultato)

Larghezza 40% desktop, 100% mobile (sotto il grafico).

Stile: tabella densa, font 13px mono-tabular per i numeri.

**Header**:
- Sfondo `bg-page`.
- Testo uppercase 11px peso 600 color `ink-700`.
- Click su header → sort asc/desc (icona freccia ↕ accanto).
- Sticky in caso di scroll verticale.

**Righe**:
- Padding verticale 8px (denso).
- Bordo inferiore 1px `ink-100`.
- Hover: sfondo `bg-page`.

**Colonne** dipendono dalla configurazione:

| Configurazione | Colonne |
|---|---|
| Geografica × Regionale | Regione · Valore · % sul totale Italia · Per capita |
| Geografica × Provinciale | Provincia · Regione · Valore · % · Per capita |
| Settoriale | Settore · Codice ATECO · Valore in regione · Valore fuori regione · Totale · % intra |
| Per componente | Componente · Valore · % sul totale |
| Nessuna | (vista numero singolo, no tabella) |

**Numero righe**: paginazione client-side (50 righe per pagina default). Indicatore "Riga 1-50 di 107" + paginazione in fondo.

#### 8.4.5 Export

**CSV**:
- Formato UTF-8 con BOM.
- Separatore: virgola.
- Numeri con punto decimale (formato anglosassone, più portabile in tool internazionali).
- Header sulla prima riga.
- Filename: `civiqa_eia_{progetto}_{dim}_{asse}_{data}.csv`.

**Excel**:
- File `.xlsx` con singolo foglio.
- Numeri formattati come numeri (non testo), unità nel nome colonna.
- Header in grassetto.
- Filename: stesso schema, estensione `.xlsx`.
- Generato lato frontend con `xlsx` (SheetJS, già nel design tokens).

### 8.5 Stati condizionali

#### Caso "configurazione invalida"

Es. "Gettito × Provinciale": combinazione semanticamente errata. Comportamento:
- Selettore disabilitato a monte (prevenzione).
- Se l'URL forza una config invalida, mostra messaggio: *"Questa combinazione non è disponibile: il gettito non si scompone per territorio. Cambia uno dei selettori."*

#### Caso "risultato vuoto"

Se i filtri producono 0 righe:
- Mostra: *"Nessun risultato per questa combinazione. Prova ad ampliare i filtri."*
- Mantieni grafico vuoto con messaggio.

#### Caso "dataset molto grande" (>1000 righe)

Rendering virtualizzato (libreria `react-window` o equivalente leggero). Solo le righe visibili sono in DOM.

### 8.6 Note implementative

- **Persistenza configurazione**: URL completo con tutti i selettori (`?tab=esplora&dim=pil&asse=geografica&livello=provinciale&top=10`).
- **Deep linking**: copiare URL → riapertura mostra esattamente la stessa configurazione. Permette di condividere viste specifiche tra colleghi.
- **Performance**: tutti i dati per Esplora sono già nel payload caricato all'apertura della sezione EIA. Niente chiamate aggiuntive al backend.
- **Componenti React**:
  - `<ImpactExplore />` (container)
  - `<ExploreConfig values onChange />` (pannello configurazione)
  - `<ConfigSummary state />` (riga di stato)
  - `<ExportButtons format="csv|xlsx" data />`
  - `<ExploreChart config data />` (selettore di grafico in base alla config)
  - `<ExploreTable columns rows sortable paginated />`


---

## 9. Glossario contestuale (popover "?")

Cliccando l'icona "?" accanto al titolo di ciascuna tab, si apre un **popover laterale** (320px di larghezza, fissato a destra, non modale, dismissibile con click esterno o ESC) con il glossario specifico della tab.

Il contenuto è una **lista di termini** con definizione breve (max 3 righe ciascuna) in linguaggio piano.

### 9.1 Glossario tab Sintesi

| Termine | Definizione semplice |
|---|---|
| **PIL (valore aggiunto)** | Il valore aggiunto è la ricchezza nuova che un'attività economica genera. È la differenza tra quanto ha venduto e quanto ha dovuto acquistare per produrre. Il PIL è la somma di tutti i valori aggiunti di un'economia. |
| **Produzione** | Il volume d'affari totale generato lungo tutta la filiera attivata dalla spesa. È più grande del PIL perché include anche il costo dei beni intermedi acquistati. |
| **ETP (Equivalente a Tempo Pieno)** | Misura di occupazione: 1 ETP = 1 persona che lavora a tempo pieno per 1 anno. Se 2 persone lavorano metà tempo, fanno 1 ETP. |
| **Redditi** | La quota di valore aggiunto distribuita alle famiglie (stipendi) e alle imprese (profitti). Alimenta i consumi futuri. |
| **Gettito** | Imposte e contributi (IVA, IRPEF, IRES, contributi previdenziali) che lo Stato incassa dall'attività economica attivata. È solo nazionale. |
| **Moltiplicatore** | Quanti euro di effetto si generano per ogni euro speso. Un moltiplicatore di 1,32 significa che 1 € di spesa genera 1,32 € di valore aggiunto. |
| **Perimetro Regione** (default) | Mostra il valore che si attiva all'interno della regione di spesa. È il livello a cui i moltiplicatori sono più affidabili. |
| **Perimetro Provincia origine** | Mostra solo il valore che resta nella provincia dove avviene fisicamente la spesa. Sottostima il "rendimento" del progetto perché esclude lo spillover sulle altre province. |
| **Perimetro Nazionale** | Mostra il valore che si attiva sull'intera economia italiana, includendo la dispersione verso filiere fuori regione. |
| **Pro capite** | Il valore diviso per la popolazione di riferimento (regione, provincia, Italia). Permette di confrontare territori di dimensione diversa. |
| **Autofinanziamento** | La quota della spesa pubblica iniziale che rientra alle casse pubbliche come gettito attivato dal progetto. |

### 9.2 Glossario tab Componenti

| Termine | Definizione semplice |
|---|---|
| **Impatto diretto** | L'effetto immediato della spesa sui settori che la ricevono. Es. l'impresa edile pagata per i lavori. |
| **Impatto indiretto** | L'effetto a cascata sui fornitori dei settori direttamente coinvolti. Es. il fornitore di cemento dell'impresa edile. |
| **Impatto indotto** | L'effetto dei consumi delle famiglie dei lavoratori coinvolti, che spendono i loro stipendi in beni e servizi. |
| **Filiera (backward linkage)** | L'insieme dei fornitori e sub-fornitori coinvolti nella produzione di un bene o un servizio. |
| **Spesa autonoma** | La spesa iniziale del progetto, prima che attivi qualsiasi effetto a cascata. |

### 9.3 Glossario tab Geografia

| Termine | Definizione semplice |
|---|---|
| **Provincia di origine** | La provincia in cui avviene fisicamente la spesa (i lavori, gli acquisti). |
| **Spillover regionale** | L'effetto che dalla provincia di origine si diffonde sulle altre province della stessa regione, tramite le filiere produttive. |
| **Dispersione extra-regionale** | La parte del valore che si attiva in regioni diverse da quella di origine. Avviene perché alcuni fornitori si trovano altrove (es. servizi finanziari concentrati a Milano). |
| **Valore pro capite** | Il valore diviso per il numero di abitanti del territorio. Serve a confrontare territori di diversa dimensione demografica. |

### 9.4 Glossario tab Settori

| Termine | Definizione semplice |
|---|---|
| **Settore ATECO** | La classificazione standard delle attività economiche in Italia. Costruzioni, alloggio, commercio, ecc. sono settori ATECO. |
| **Settore non delocalizzabile** | Un settore i cui beni/servizi devono essere prodotti dove serve il cliente: cantieri, ristoranti, parrucchieri. Tendono a trattenere il valore sul territorio. |
| **Concentrazione territoriale** | La tendenza di un settore a essere localizzato in poche aree del Paese. Es. il finanziario è concentrato a Milano e Roma. |
| **Quota intra-regione** | La percentuale del valore di un settore che si attiva nella regione di spesa. Più è alta, più il settore "trattiene" l'effetto. |
| **Heatmap** | Una griglia in cui righe e colonne rappresentano due dimensioni (settori × territori), e l'intensità del colore di ogni cella rappresenta il valore corrispondente. |

### 9.5 Glossario tab Esplora

| Termine | Definizione semplice |
|---|---|
| **Dimensione** | Cosa stai misurando: PIL, Produzione, Occupazione, Redditi o Gettito. |
| **Asse di scomposizione** | Come stai dividendo il dato: per territorio, per settore, per componente (Diretto/Indiretto/Indotto), o non lo stai dividendo affatto (totale). |
| **Livello di profondità** | Quanto in dettaglio stai scendendo: per le geografie, regionale o provinciale; per i settori, top 10 o tutti. |
| **Esporta CSV** | Scarica i dati in un file di testo separato da virgole, apribile con Excel, Numbers, Google Sheets. |
| **Esporta Excel** | Scarica i dati in un file `.xlsx` con formattazione numerica già impostata. |

---

## 10. Stati globali della sezione

### 10.1 Loading

Analisi in elaborazione (status "running"):
- Le 5 tab sono visibili ma disabilitate (color `ink-300`).
- Al centro del container, schermata simile a quella "Analisi in corso" già esistente in Civiqa (`dots-violet-bg` + spinner + testo "L'analisi è in corso").
- Polling ogni 10s sullo stato.

### 10.2 Error

Analisi in stato "error":
- Banner full-width rosso chiaro (`#FDECEC` con bordo `#C45A2E`).
- Testo: "Si è verificato un errore nell'elaborazione. Riprova o contatta il supporto."
- Bottoni "Riavvia analisi" + "Scarica log".

### 10.3 Empty / valori non significativi

Analisi completata ma con impatto inferiore alla soglia di significatività:
- Banner informativo: "L'analisi è completata. L'impatto economico è inferiore alla soglia di significatività ({soglia} €)."
- Mostra comunque le tab con i valori reali per trasparenza.

### 10.4 Stale (dati superati)

Dati del progetto modificati dopo l'ultima analisi:
- Banner giallo `#FEF3C7` in alto: "I dati del progetto sono stati modificati il {data}. L'analisi mostrata è del {data_analisi}. [Riavvia analisi]"

---

## 11. Struttura dati (payload atteso dal frontend)

Il frontend riceve dal backend un unico payload JSON per l'analisi di impatto. Schema proposto (esteso rispetto alla bozza precedente per supportare le nuove viste).

```json
{
  "analysis_id": "eia_xyz123",
  "project_id": "proj_abc",
  "status": "completed",

  "metadata": {
    "created_at": "2025-05-12T10:00:00Z",
    "updated_at": "2026-05-25T10:00:00Z",
    "created_by": "Comune di Palermo, Mario Rossi",
    "sector": "Infrastrutture sociali",
    "dataset": "Matrice contabilità sociale",
    "methodology": "SAM EU-ITA 2019",
    "years_of_realization": 1
  },

  "input": {
    "total_spend": 2690000,
    "currency": "EUR",
    "origin_provinces": [
      { "code": "SS", "name": "Sassari", "region_code": "20",
        "region_name": "Sardegna", "spend_share": 1.0 }
    ],
    "origin_region": { "code": "20", "name": "Sardegna" },
    "spend_breakdown": [
      { "ateco_code": "F", "ateco_name": "Costruzioni",
        "amount": 1561000, "share": 0.58 }
    ]
  },

  "previews": {
    // valori da mostrare nell'anteprima delle tab
    "sintesi": "3,56 M€ PIL",
    "componenti": "44% diretto",
    "geografia": "84% in Sardegna",
    "settori": "Costruzioni leader",
    "esplora": "Pivot dati"
  },

  "synthesis": {
    "by_perimeter": {
      "origin_province": {
        "production": 4786000, "gdp": 2924000, "employment": 27.5,
        "income": 2870000, "fiscal": null
      },
      "region": {
        "production": 5967000, "gdp": 3564000, "employment": 47.1,
        "income": 3490000, "fiscal": null
      },
      "national": {
        "production": 7176000, "gdp": 4238000, "employment": 56.6,
        "income": 4180000, "fiscal": 1120000
      }
    },
    "fiscal_national": 1120000,
    "three_segments": {
      // per ogni dimensione, decomposizione provincia / resto regione / extra regione
      "production": { "origin": 4786000, "rest_region": 1181000, "extra": 1209000 },
      "gdp":        { "origin": 2924000, "rest_region":  640000, "extra":  674000 },
      "employment": { "origin": 27.5,    "rest_region": 19.6,    "extra":  9.5 },
      "income":     { "origin": 2870000, "rest_region":  620000, "extra":  690000 }
    },
    "per_capita": {
      // valori pro-capite per ciascun perimetro, calcolati lato backend
      "origin_province": {
        "population": 478000,
        "production_pc": 10.01,
        "gdp_pc": 6.12,
        "employment_pc_per_10k": 0.58,
        "income_pc": 6.00
      },
      "region":   { "population": 1500000, "production_pc": 3.98, ... },
      "national": { "population": 59000000, "production_pc": 0.12, ... }
    },
    "synthetic_kpis": {
      // SEMPRE riferiti al perimetro regionale (metodologia OE)
      "gdp_multiplier": 1.32,
      "production_multiplier": 2.22,
      "employment_intensity_per_meur": 17.5,
      "fiscal_autofinanc_pct": 0.416
    }
  },

  "components": {
    "production": {
      "direct": 2690000, "indirect": 890000, "induced": 2390000,
      "top_sectors": {
        "direct":   [{ "ateco_code": "F", "name": "Costruzioni", "value": 1561000 }],
        "indirect": [...],
        "induced":  [...]
      }
    },
    "gdp": { "direct": 1570000, "indirect": 630000, "induced": 1360000,
             "top_sectors": { ... } },
    "employment": { "direct": 21.4, "indirect": 7.6, "induced": 18.1,
                    "top_sectors": { ... } }
    // niente income — vedi §5.1
  },

  "geography": {
    "regions": [
      {
        "code": "20", "name": "Sardegna",
        "population": 1500000,
        "is_origin": true,
        "values": {
          "production": { "absolute": 5967000, "per_capita": 3.98 },
          "gdp":        { "absolute": 3564000, "per_capita": 2.38 },
          "employment": { "absolute": 47.1,    "per_capita_per_10k": 0.31 },
          "income":     { "absolute": 3490000, "per_capita": 2.33 }
        }
      }
    ],
    "provinces": [
      // stesso schema, con region_code di appartenenza
      { "code": "SS", "name": "Sassari", "region_code": "20",
        "is_origin": true, "population": 478000, "values": { ... } }
    ],
    "macro_split": {
      "origin": { "value": 1950000, "pct": 0.46 },
      "rest_of_region": { "value": 1610000, "pct": 0.38 },
      "extra_region": { "value": 670000, "pct": 0.16 }
    }
  },

  "sectors": {
    "items": [
      {
        "ateco_code": "F",
        "ateco_name": "Costruzioni",
        "totals_by_dim": {
          "production": { "intra": 1561000, "extra": 102000 },
          "gdp":        { "intra": 1006000,  "extra": 65000 },
          "employment": { "intra": 12.3,     "extra": 0.8 }
        },
        "by_territory": {
          // per heatmap: distribuzione per regione (e per provincia)
          "regions": [
            { "code": "20", "name": "Sardegna",
              "values": { "production": 1561000, "gdp": 1006000, "employment": 12.3 }}
          ],
          "provinces": [
            { "code": "SS", "values": { ... }}
          ]
        }
      }
    ]
  }
}
```

Note di schema:
- Valori monetari in **unità intere** (€). Formattazione lato frontend.
- `null` quando una metrica non è calcolabile.
- `fiscal_autofinanc_pct` calcolato come `fiscal_national / input.total_spend`.
- `is_origin: true` marca le regioni/province di origine della spesa (per rendering bordo lime).
- Il payload è autoconsistente: la tab Esplora non chiede nulla di addizionale al backend.

Dimensione tipica del payload completo: ~80-150 KB JSON gzippato per un progetto di media complessità.

---

## 12. Telemetria / eventi da tracciare

Per misurare se la rinfrescata funziona, tracciare:

| Evento | Quando | Proprietà |
|---|---|---|
| `eia_view_opened` | Apertura sezione | `project_id`, `analysis_id` |
| `eia_tab_changed` | Click tab | `from_tab`, `to_tab`, `time_on_previous_tab_ms` |
| `eia_help_opened` | Click "?" | `tab` |
| `eia_perimeter_changed` | Cambio perimetro (Sintesi) | `from`, `to` |
| `eia_percapita_toggled` | Toggle pro-capite | `tab`, `from`, `to` |
| `eia_dimension_changed` | Cambio dimensione | `tab`, `from`, `to` |
| `eia_geo_drill_in` | Drill su regione (Geografia) | `region_code` |
| `eia_geo_drill_out` | Ritorno alla mappa Italia | — |
| `eia_sectors_view_changed` | Toggle barre/heatmap | `from`, `to` |
| `eia_heatmap_cell_clicked` | Click cella heatmap | `sector_code`, `territory_code` |
| `eia_explore_config_changed` | Cambio configurazione Esplora | `config` (oggetto completo) |
| `eia_export_csv` / `eia_export_xlsx` | Click esporta | `tab`, `config` (se Esplora) |
| `eia_report_downloaded` | Click "Scarica report" | — |

---

## 13. Roadmap di implementazione

### Iterazione 1 — Sintesi
- Tab bar a 5 box segmentati grandi (con placeholder per le altre tab).
- Tab Sintesi completa: selettori perimetro/pro-capite, card spesa, griglia 5 effetti con mini-barra, fascia KPI ancorata.
- Test su Sardegna PST.
- **Validazione**: utente reale capisce i 5 macronumeri senza spiegazione preventiva.

### Iterazione 2 — Componenti
- Blocco didattico Dir/Ind/Indot.
- Selettore dimensione (3 pill).
- Barra impilata + 3 colonne fisse con top settori.
- Test su caso con dimensione mancante.

### Iterazione 3 — Geografia (parte 1: nazionale)
- Mappa Italia regionale + lista top regioni.
- Selettori dimensione + pro-capite.
- Banda 3 aree.

### Iterazione 4 — Geografia (parte 2: drill)
- Click su regione → mappa provinciale.
- Breadcrumb di ritorno.
- Stato fallback "shock singola provincia".

### Iterazione 5 — Settori
- Vista barre divergenti + doppia card insight.
- Frase di chiusura parametrica.
- Test su caso "tutti settori intra > 95%".

### Iterazione 6 — Settori (heatmap)
- Vista heatmap territorio × settore.
- Toggle vista.
- Click su cella → integrazione con Esplora.

### Iterazione 7 — Esplora
- Pannello configurazione (4 selettori).
- Grafico auto-scelto + tabella sortabile.
- Export CSV/Excel.

### Iterazione 8 — Glossario e accessibilità
- Popover "?" per tutte le tab.
- Test screen reader (NVDA / VoiceOver).
- Test con utente non specialista.

### Iterazione 9 — Polish e telemetria
- Animazioni, transizioni, micro-interazioni.
- Tracking eventi.
- Test responsive mobile completo.

---

## 14. Criteri di successo

Come capiamo se la rinfrescata funziona davvero. Da misurare 1 mese dopo il rilascio.

**Quantitativi (da telemetria):**
- Tempo medio sulla sezione: deve **diminuire** rispetto al baseline. Target: -30%.
- % di sessioni che cambiano almeno 1 tab: target ≥ 60% (segno di navigazione attiva).
- % di click su "?" almeno una volta per progetto: target 15-25% (il glossario serve ma non troppo: se troppo, il copy non basta).
- % di sessioni che usano Esplora: target ≥ 20% per utenti "analitici".
- Tasso di download del report PDF: dovrebbe **diminuire** (se la sezione web è autosufficiente, meno gente scarica il PDF).

**Qualitativi (da interviste con 3-5 funzionari di Comuni):**
- Capire il significato dei 5 macronumeri della Sintesi senza aiuto.
- Capire la differenza diretto/indiretto/indotto senza aiuto.
- Capire perché il moltiplicatore "non cambia" quando si switcha il perimetro (test della nota esplicativa).
- Riassumere a parole loro "cosa dice questa analisi" in meno di 2 minuti.

---

## 15. Cose esplicitamente NON in questo redesign

- **Confronto tra progetti** (es. "questo PIL è alto rispetto ad altri progetti simili"). Richiede benchmark esterno.
- **Scenari controfattuali** ("se avessi speso X invece di Y…"). È un'analisi diversa, non un cambio di rappresentazione.
- **Esportazione di singoli grafici come immagini**. Possibile in iterazione futura.
- **Drill-down sub-provinciale** (comuni). I dati SAM non lo supportano.
- **Intervalli di confidenza** sui numeri. Il modello SAM non li produce nativamente.
- **Workflow multi-utente** (commenti, share interno, approvazione). Out of scope.

---

## 16. Riassunto in una pagina

Per chi salta direttamente qui, ecco il documento in 1 pagina.

**Sostituiamo** 6 tab fotocopia (Riepilogo · Spese · PIL · Occupazione · Valore Produzione · Redditi · Gettito) **con 5 tab eterogenee**:

1. **Sintesi** — Landing tab. Card spesa iniziale (bianca enfatica), griglia 5 effetti con mini-barra a 3 segmenti (provincia/regione/extra), 2 selettori (Perimetro · Pro-capite), fascia 4 KPI sintetici ancorata al perimetro regionale, frase di chiusura.
2. **Componenti** — Blocco didattico Dir/Ind/Indot + selettore dimensione (Prod/PIL/Occ, no Redditi) + barra impilata unica + 3 colonne fisse con top settori.
3. **Geografia** — Mappa regionale Italia + drill-down provinciale via click + lista top + banda 3 aree + selettori dimensione (4 incl. Redditi) + pro-capite locale.
4. **Settori** — Toggle Barre divergenti / Heatmap territorio×settore. Barre: intra/extra-regione + doppia card insight. Heatmap: settori × regioni/province con drill su Esplora.
5. **Esplora** — Pivot tool con 4 selettori (dimensione · asse · profondità · filtri), grafico auto-scelto + tabella sortabile + export CSV/Excel.

**Principi**:
- Linguaggio piano sempre accompagnato dal termine tecnico.
- Niente catene visive (frecce, sequenze). Sono letture parallele dello stesso fenomeno.
- Testi descrittivi sotto ogni grafico ("Come si legge").
- Glossario contestuale per tab via icona "?".
- Adattamento ai casi "poveri" (singola provincia, pochi settori) con layout alternativi.
- **Tab bar ridisegnata** come box segmentati grandi (forte, navigabile, anteprima dato visibile).
- **Moltiplicatori ancorati al perimetro regionale** per coerenza metodologica OE (con nota esplicativa quando l'utente cambia perimetro).
- **Gettito sempre nazionale**, eccezione coerente con la metodologia.

**Stack visivo**: bianco/viola/lime di Civiqa, tre toni di viola per scomposizioni a 3 livelli, verde/arancione per dispersione territoriale, nessuna ombra, bordi netti.

**Esclusioni**: niente confronti tra progetti, niente scenari, niente drill comunale.

— Fine documento —
