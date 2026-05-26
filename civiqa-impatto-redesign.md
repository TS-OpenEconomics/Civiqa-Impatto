# Civiqa — Sezione "Analisi di Impatto" · Redesign

> **Scopo del documento.** Specifica completa per la riprogettazione della sezione di dettaglio dell'Analisi di Impatto Economico (EIA) di Civiqa. Sostituisce l'attuale layout a 6 tab-fotocopia (Riepilogo · Spese · PIL · Occupazione · Valore della Produzione · Redditi · Gettito) con un'architettura a **4 viste eterogenee** progettate per essere comprensibili a un'utenza non specialistica.
>
> Audience del documento: designer e sviluppatore frontend. Le sezioni "Layout & contenuti" sono prevalentemente per il designer; le sezioni "Componenti & stati" e "Note implementative" per lo sviluppatore.

---

## 1. Principi guida

Prima di scendere nel dettaglio, fissiamo le regole che hanno governato ogni scelta. Quando in dubbio durante l'implementazione, torna qui.

### 1.1 Piattaforma, non report

L'utente entra in questa sezione **per cercare un dato o capire un risultato**, non per leggere un saggio. La prima schermata risponde già alla domanda di chi ha solo bisogno del numero. Le altre tre tab approfondiscono per chi vuole capire *perché*, *dove* e *in quali settori*.

Conseguenze concrete:

- Niente narrative lunghe in linea. Le frasi descrittive sono brevi (max 2-3 righe), parametrizzate sui dati del singolo progetto.
- Niente catene visive sequenziali (frecce, step numerati). Spesa → PIL → Occupazione **non è una catena**: sono letture parallele dello stesso fenomeno.
- Niente "scroll lungo a sezioni". Tab orizzontali a 4 voci, ciascuna autoconsistente.

### 1.2 Accessibilità del linguaggio

Il bersaglio è un funzionario di un piccolo Comune, non un econometrico. Vale ovunque:

- I termini tecnici (moltiplicatore, indotto, spillover) **si usano**, ma sempre accompagnati da una formulazione equivalente in linguaggio piano. Esempio: invece di "Moltiplicatore PIL: 1,32" → "**Per ogni euro speso, l'economia locale ne restituisce 1,32 di valore aggiunto** *(moltiplicatore: 1,32)*".
- Ogni grafico è accompagnato da un blocco "Come si legge" di 1-2 frasi.
- Esiste un glossario sempre accessibile da un'icona "?" nell'header della sezione.

### 1.3 Adattività ai casi reali

Non tutti i progetti hanno dati ricchi. Tre scenari tipo:

- **Caso "ricco"**: shock multi-provincia, decine di settori, dispersione articolata (es. Sardegna PST).
- **Caso "medio"**: shock su 1-2 province, 5-10 settori coinvolti.
- **Caso "povero"**: shock su una sola provincia, pochi settori (es. scuola in piccolo comune).

Ogni vista deve avere **regole di rendering condizionali** che adattano la rappresentazione al caso. Le mappe quasi vuote, gli scatter con 3 punti, le liste con un elemento solo sono peggio del nulla.

### 1.4 Coerenza visiva con Civiqa

La nuova sezione riusa i pattern già in produzione nel resto di Civiqa, in modo che sembri parte della stessa famiglia. Riferimenti:

- **Banner scuro di intestazione** con titolo + tag colorato + bottoni download (come oggi nella pagina EIA).
- **Tabella "Settore / Dataset / Metodologia"** sotto il banner (identica all'attuale).
- **KPI-pill arrotondati** ("1,85× moltiplicatore PIL") come nella pagina "Le analisi del progetto".
- **Card-banner espandibili** con macronumeri inline come pattern di display dati.
- **CTA viola** (`brand-violet`) per azioni primarie, **bottone nero** per scarico documenti.
- **Riga `accent-lime` 3px** come separatore di forte gerarchia.
- **Tag pastello colorati** (rosa EIA, azzurro ECBA, teal ESG) come pattern di categorizzazione visiva. Lo applichiamo in modo analogo per Diretto/Indiretto/Indotto.

---

## 2. Design tokens di riferimento

Estratti dal `tailwind.config.js` esistente e dai pattern osservati negli screenshot. Per chiarezza nei riferimenti del documento:

### 2.1 Colori

| Token | HEX | Uso |
|---|---|---|
| `brand-violet` | `#5B21F7` | CTA primarie, link, evidenze |
| `accent-lime` | `~#B7F500` | Riga separatore 3px, tag "in evidenza", highlight |
| `ink-900` | `#0E0E10` | Testo primario, banner scuri |
| `ink-700` | `~#3D3D45` | Testo secondario |
| `ink-500` | `~#7A7A85` | Testo tertiario, labels |
| `ink-300` | `~#B5B5BC` | Bordi forti, placeholder |
| `ink-100` | `~#ECECF0` | Bordi sottili, dividers |
| `bg-page` | `~#F6F6F8` | Sfondo principale main |
| `white` | `#FFFFFF` | Sfondo card |
| `dots-violet-bg` | radial pattern | Sfondi onboarding/loading |

**Nuovi colori semantici per la sezione impatto** (da aggiungere al config):

| Token | HEX proposto | Uso |
|---|---|---|
| `impact-direct` | `#5B21F7` (= brand-violet) | Componente "Diretto" |
| `impact-indirect` | `#9E7BFA` | Componente "Indiretto" |
| `impact-induced` | `#D4C5FB` | Componente "Indotto" |
| `impact-retain` | `#1F8C4A` | Valore trattenuto in regione |
| `impact-leak` | `#C45A2E` | Valore disperso fuori regione |

Tre toni dello stesso viola per Diretto/Indiretto/Indotto: visualmente leggibili insieme, comunicano "stessa famiglia, intensità diverse". Verde/arancio per intra/extra: contrasto semantico chiaro (verde = "buono", arancio = "leakage").

### 2.2 Tipografia

Font: **Inter**, già caricato.

| Stile | Peso | Size | Uso |
|---|---|---|---|
| `display-xl` | 700 | 36-44px | Macronumeri principali (es. "12,0 M€") |
| `display-lg` | 700 | 28-32px | Macronumeri secondari |
| `display-md` | 700 | 22-24px | Numeri inline in card |
| `heading-1` | 700 | 24px | Titoli di vista ("Sintesi", "Componenti") |
| `heading-2` | 700 | 18px | Titoli di sezione interna |
| `heading-3` | 600 | 14px | Sotto-titoli |
| `label-sm` | 600 | 11-12px uppercase | Micro-labels (es. "SPESE ATTIVATE") |
| `body` | 400 | 14px | Testo descrittivo |
| `caption` | 400 | 12px | Note, fonti, didascalie |

### 2.3 Spaziature e forme

- **Bordi**: 1px `ink-100` per dividers; 1px `ink-300` per input/bordi marcati.
- **Border-radius**: 0 (squadrato) coerente con Civiqa attuale. **Eccezione**: KPI-pill `rounded-full`.
- **Padding standard card**: 24px desktop, 16px mobile.
- **Gap tra elementi**: 16px (compatto), 24px (standard), 40px (separazione di sezione).

---

## 3. Architettura della sezione

### 3.1 Struttura della pagina

La pagina di dettaglio EIA mantiene la struttura corrente nelle sue parti alte (banner scuro, tabella Settore/Dataset/Metodologia), e sostituisce **soltanto** il blocco delle 6 tab attuali con il nuovo blocco a 4 tab.

```
┌─────────────────────────────────────────────────────────┐
│ HEADER GLOBALE Civiqa (immutato)                        │
├─────────┬───────────────────────────────────────────────┤
│ SIDEBAR │ Breadcrumb: Dettaglio progetto › Analisi…     │
│ (immut) │ Meta: "Creato il… da… — Ultima modifica…"     │
│         │                                               │
│         │ ┌─────────────────────────────────────────┐  │
│         │ │ BANNER SCURO (immutato)                 │  │
│         │ │ Analisi di Impatto [EIA] [DIR,IND,IND]  │  │
│         │ │ Del progetto: …                         │  │
│         │ │ Sottotitolo descrittivo                 │  │
│         │ │           [Scarica report][Scarica xls] │  │
│         │ └─────────────────────────────────────────┘  │
│         │                                               │
│         │ ┌─────────────────────────────────────────┐  │
│         │ │ TABELLA META (immutata)                 │  │
│         │ │ Settore | Dataset | Metodologia         │  │
│         │ └─────────────────────────────────────────┘  │
│         │                                               │
│         │ ╔═════════════════════════════════════════╗  │
│         │ ║ [Sintesi · 3,56M€]                      ║  │
│         │ ║ [Componenti · 44% diretto]              ║  │
│         │ ║ [Geografia · 84% in Sardegna]   ← TABS  ║  │
│         │ ║ [Settori · Costruzioni leader]          ║  │
│         │ ╠═════════════════════════════════════════╣  │
│         │ ║                                         ║  │
│         │ ║         CONTENUTO DELLA TAB ATTIVA      ║  │
│         │ ║                                         ║  │
│         │ ╚═════════════════════════════════════════╝  │
│         │                                               │
│         │ Footer Civiqa (immutato)                      │
└─────────┴───────────────────────────────────────────────┘
```

### 3.2 Le 4 tab

| # | Tab | Domanda a cui risponde | Output principale |
|---|---|---|---|
| 1 | **Sintesi** | "Quanto vale l'impatto?" | 5 macronumeri + 3 KPI + 1 frase di chiusura |
| 2 | **Componenti** | "Come si propaga?" | Decomposizione diretto/indiretto/indotto cross-dimensionale |
| 3 | **Geografia** | "Dove si attiva?" | Mappa provinciale + lista top province |
| 4 | **Settori** | "In quali settori?" | Barre orizzontali per settore + dispersione |

### 3.3 Comportamento della barra tab

- **Etichetta tab = nome + valore chiave anteprima**. Esempio: `Geografia · 84% in Sardegna`. Permette di scegliere dove andare senza dover cliccare a caso. Il valore in anteprima si calcola lato server come parte del payload dell'analisi.
- **Tab attiva**: sottolineatura `brand-violet` 3px sotto il testo, peso 700, colore `ink-900`.
- **Tab non attiva**: peso 500, colore `ink-700`, hover → `ink-900`.
- **Persistenza**: la tab attiva è in URL come query param (`?tab=geografia`) per permettere deep-link e refresh senza perdere posizione.
- **Default**: apertura su `?tab=sintesi`.
- **Mobile (<768px)**: le tab diventano scrollabili orizzontalmente con `overflow-x-auto` e indicatore di scroll.

### 3.4 Help contestuale

In alto a destra della barra tab, accanto al titolo della tab attiva, un'icona "?" piccola (16px) apre un **popover laterale fisso** (non modale, dismissibile con click esterno o ESC) con il blocco "**Come leggere questa sezione**" specifico per la tab. Il contenuto del popover è statico e scritto in linguaggio piano (vedere sezione 8 "Glossario").

---

## 4. Vista 1 — Sintesi

### 4.1 Cosa risponde

> "Quanto vale l'impatto economico del progetto, in sintesi?"

È la **landing tab** della sezione. Se un utente entra qui per cercare un solo dato, lo trova senza dover cliccare altrove.

### 4.2 Layout

```
┌───────────────────────────────────────────────────────────────┐
│ TITOLO TAB                                              [?]   │
│ Sintesi                                                       │
│                                                               │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ INPUT — SPESA INIZIALE                                    │ │
│ │  ┌─────────────────────────────────────────────────────┐  │ │
│ │  │  SPESA TOTALE INVESTITA                             │  │ │
│ │  │  2,69 milioni €                                     │  │ │
│ │  │  L'investimento di partenza, distribuito su 7       │  │ │
│ │  │  voci di spesa nella provincia di {provincia}.      │  │ │
│ │  └─────────────────────────────────────────────────────┘  │ │
│ └───────────────────────────────────────────────────────────┘ │
│                                                               │
│ NOTA DIDATTICA (sempre visibile, piccolo testo grigio)        │
│ "I 5 effetti qui sotto non sono in sequenza. Sono cinque      │
│  modi diversi di misurare la stessa attivazione economica."   │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ GRIGLIA 5 EFFETTI (3 colonne desktop, 2 tablet, 1 mob) │   │
│ │ ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│ │ │ PROD     │  │ PIL      │  │ OCCUP.   │              │   │
│ │ │ 5,97 M€  │  │ 3,56 M€  │  │ 47,1 ETP │              │   │
│ │ │ +1,21M€  │  │ +0,67M€  │  │ +6,5 ETP │              │   │
│ │ │ fuori    │  │ fuori    │  │ fuori    │              │   │
│ │ │ ────     │  │ ────     │  │ ────     │              │   │
│ │ │ descriz. │  │ descriz. │  │ descriz. │              │   │
│ │ └──────────┘  └──────────┘  └──────────┘              │   │
│ │ ┌──────────┐  ┌──────────┐                            │   │
│ │ │ REDDITI  │  │ GETTITO  │                            │   │
│ │ │ 3,49 M€  │  │ 1,12 M€  │                            │   │
│ │ │ in regio.│  │ naz. *   │                            │   │
│ │ │ ────     │  │ ────     │                            │   │
│ │ │ descriz. │  │ descriz. │                            │   │
│ │ └──────────┘  └──────────┘                            │   │
│ │                                                        │   │
│ │ * "Il gettito è un valore nazionale e non si distrib- │   │
│ │   uisce per territorio."                              │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ TRE INDICATORI CHIAVE (KPI-pill row)                   │   │
│ │ [1,32× moltiplicatore PIL]  [17,5 ETP/mln€]            │   │
│ │ [41,6% spesa rientra come gettito]                     │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ FRASE DI CHIUSURA (banner grigio chiaro + barra lime)  │   │
│ │ "L'84% del valore aggiunto attivato resta in Sardegna. │   │
│ │  La spesa è fortemente ancorata al territorio."        │   │
│ └─────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

### 4.3 Componenti — dettaglio

#### 4.3.1 Card "Spesa iniziale" (input)

Posizionata in cima, **larghezza piena**, sfondo `bg-ink-900` (banner scuro), testo bianco. Si distingue dalle 5 card sotto perché è l'unico valore "input" — la spesa pubblica iniziale — non un effetto.

Contenuto:
- Micro-label uppercase: `SPESA TOTALE INVESTITA`
- Numero grande (display-xl): `{valore} milioni €`
- Descrizione (body, opacity 80%): *"L'investimento di partenza, distribuito su {N} voci di spesa nella provincia di {nome_provincia}."*

#### 4.3.2 Nota didattica anti-sequenza

Subito sotto la card spesa, prima della griglia. Testo body color `ink-700`, righe 1-2 max, con un'icona piccola (lampadina o info) a sinistra:

> 💡 *"I cinque effetti qui sotto non sono passaggi in sequenza. Sono cinque modi diversi di misurare la stessa attivazione economica generata dalla spesa: PIL, valore della produzione, occupazione, redditi e gettito si attivano insieme, non uno dopo l'altro."*

Questa nota è **statica** (testo didattico). Importante: è il punto in cui si previene il malinteso "Spesa diventa PIL diventa Occupazione".

#### 4.3.3 Griglia dei 5 effetti

5 card disposte in griglia 3-2 su desktop (3 in prima riga, 2 in seconda), 2-2-1 su tablet, 1×5 su mobile. Tutte le card hanno lo stesso layout — non vogliamo gerarchie tra dimensioni — ma colori micro-label leggermente diversi per facilitare l'identificazione.

Struttura di ogni card:

```
┌────────────────────────────┐
│ [icona piccola]            │
│ MICRO-LABEL (uppercase)    │
│                            │
│ NUMERO GRANDE              │
│ unità                      │
│                            │
│ + valore_extra unità       │   ← solo per Prod/PIL/Occup/Redditi
│ fuori regione              │
│ ────                       │
│ Descrizione breve          │
│ (2-3 righe parametriche)   │
└────────────────────────────┘
```

**Mappatura icone** (lucide-react o equivalente):

| Card | Icona | Micro-label |
|---|---|---|
| Produzione | `factory` | `VALORE DELLA PRODUZIONE` |
| PIL | `trending-up` | `PIL (valore aggiunto)` |
| Occupazione | `users` | `OCCUPAZIONE` |
| Redditi | `wallet` | `REDDITI DISTRIBUITI` |
| Gettito | `landmark` | `GETTITO FISCALE` |

**Testi descrittivi** (template parametrici). Ogni card ha 2-3 righe di testo che spiegano il significato del numero. Il testo è generato server-side da template, con sostituzione di placeholder. Esempi:

- **Produzione**: *"È il volume d'affari attivato lungo l'intera filiera dei fornitori che operano in {regione}: dai cantieri ai produttori di servizi, fino ai consumi a valle. {moltiplicatore_prod_x}× il valore della spesa iniziale."*
- **PIL**: *"È il valore aggiunto trattenuto dall'economia di {regione}: la differenza tra fatturato e costi degli input, ovvero ciò che rimane disponibile per remunerare lavoratori, imprese e fisco. Per ogni euro speso, l'economia ne restituisce {molt_pil_x}."*
- **Occupazione**: *"Sono i posti di lavoro equivalenti a tempo pieno generati in {regione} su tutta la filiera. Calcolati assumendo {anni} anno/i di realizzazione."*
- **Redditi**: *"È la quota di valore aggiunto che torna alle famiglie e alle imprese sotto forma di salari, profitti e rendite. Alimenta i consumi locali."*
- **Gettito**: *"È il rientro fiscale complessivo (IVA, IRPEF, IRES, contributi) attivato dall'intervento. Valore nazionale: il gettito erariale confluisce al bilancio dello Stato e non è attribuibile a un singolo territorio."*

Note di copy:
- Si **evita** "moltiplicatore" come termine isolato. Quando appare, sempre accompagnato dalla forma piana.
- Si **evita** "indotto/indiretto" in questa tab — sono concetti che si introducono nella tab Componenti.
- Si **evita** linguaggio drammatico ("trascina", "esplode") che semantizza eccessivamente.

#### 4.3.4 Riga dei 3 KPI-pill

Sotto la griglia, 3 KPI-pill orizzontali in riga (wrap su mobile). Stile: `rounded-full`, bordo 1px `ink-300`, padding orizzontale 16px, padding verticale 8px, font-size 14px, peso 600.

| KPI | Formato | Tooltip |
|---|---|---|
| Moltiplicatore PIL | `{x}× per ogni € speso` | "Quanti euro di valore aggiunto si generano per ogni euro investito" |
| Intensità occupazionale | `{x} posti / mln € speso` | "Posti di lavoro equivalenti a tempo pieno per milione di euro" |
| Autofinanziamento | `{x}% torna come gettito` | "Quota della spesa che rientra alle casse pubbliche come imposte" |

Su hover/focus → tooltip nero piccolo (max 200px) con la spiegazione estesa.

#### 4.3.5 Frase di chiusura — banner takeaway

Banner full-width, sfondo `bg-page` (grigio chiarissimo), bordo sinistro 3px `accent-lime` (riprende il pattern visivo Civiqa). Padding 24px, testo body bold.

**Generato dinamicamente** in base ai dati. Template di logica:

```
SE pct_intra > 70% → "Il {pct}% del valore aggiunto attivato resta in {regione}.
                       La spesa è fortemente ancorata al territorio."
SE 40% ≤ pct_intra ≤ 70% → "Il {pct}% del valore aggiunto resta in {regione},
                            il restante {1-pct}% si attiva in altre regioni
                            attraverso le filiere di subfornitura."
SE pct_intra < 40% → "Solo il {pct}% del valore aggiunto resta in {regione}:
                      la struttura della filiera porta gran parte degli effetti
                      fuori dal territorio di spesa."
```

### 4.4 Stati condizionali

#### Caso "shock multi-provincia"

Se lo shock è distribuito su più province dello stesso territorio (es. spesa su Cagliari + Sassari + Nuoro):
- La card "Spesa iniziale" sostituisce "nella provincia di X" con "distribuita su {N} province di {regione}".
- Eventualmente, sotto la spesa, una mini-lista compatta delle province coinvolte con la rispettiva quota %.

#### Caso "gettito non disponibile"

Alcuni dataset potrebbero non avere il gettito calcolato. In tal caso:
- La card Gettito mostra valore `—` e descrizione: *"Gettito fiscale non calcolato per questa analisi."*
- Il KPI "Autofinanziamento" non viene mostrato (la pill scompare, la riga si ricompone).

#### Caso "ETP non significativi (< 1)"

Per progetti molto piccoli, gli ETP possono essere frazionari (es. 0,3). Mostra "Meno di 1 posto di lavoro equivalente" con il numero esatto sotto.

### 4.5 Note implementative

- **Animazione di entrata**: le card della griglia entrano con la stessa `eia-fade-up` esistente, stagger di 80ms tra una e l'altra. Non più di 500ms totali per non rallentare l'apertura.
- **Skeleton state**: durante il caricamento, le card mostrano `skeleton-block` con le dimensioni esatte. La spesa iniziale è la prima a popolarsi; gli effetti dopo.
- **Componenti React**:
  - `<ImpactSynthesis />` (container della tab)
  - `<SpendInputCard />` (card scura in alto)
  - `<EffectCard variant="prod|gdp|empl|inc|fisc" />` (card singolo effetto)
  - `<KPIPill icon label value tooltip />`
  - `<TakeawayBanner variant accent="lime" />`


---

## 5. Vista 2 — Componenti

### 5.1 Cosa risponde

> "Come si propaga l'impatto: quanto viene dal primo impatto, quanto dalla filiera, quanto dai consumi indotti?"

Questa vista **sostituisce 5 dei 6 tab attuali** (Spese, PIL, Occupazione, Valore della Produzione, Redditi). Invece di una pagina per dimensione, una sola pagina che mostra **tutte le dimensioni insieme**, scomposte in diretto/indiretto/indotto.

### 5.2 Cosa significa diretto/indiretto/indotto (didattico, statico)

Prima di scendere nel layout: la spiegazione che ogni utente deve trovare in alto, *prima dei numeri*.

```
┌─────────────────────────────────────────────────────────────┐
│ COME SI LEGGE                                               │
│                                                             │
│ Ogni euro speso genera tre tipi di effetti che convivono:   │
│                                                             │
│ ● DIRETTO    L'effetto immediato sui settori che ricevono   │
│   (viola scuro)  la spesa (es. l'impresa edile che esegue  │
│                  i lavori, l'hotel che ospita i visitatori) │
│                                                             │
│ ● INDIRETTO  L'effetto a cascata sui fornitori di chi       │
│   (viola medio)  riceve la spesa (es. il produttore di     │
│                  cemento, il fornitore di lenzuola).        │
│                                                             │
│ ● INDOTTO    L'effetto dei consumi delle famiglie dei       │
│   (viola chiaro) lavoratori coinvolti, che spendono i loro │
│                  stipendi in negozi, affitti, servizi.      │
│                                                             │
│ I tre effetti coesistono e si autoalimentano:               │
│ l'indotto nasce dai redditi del diretto e dell'indiretto,   │
│ che a loro volta tornano in produzione. La scomposizione    │
│ è analitica, non temporale.                                 │
└─────────────────────────────────────────────────────────────┘
```

Visivamente: blocco con sfondo `bg-page`, padding 24px, occupa larghezza piena. I tre pallini colorati (●) sono i tre toni di viola definiti nei design tokens (`impact-direct`, `impact-indirect`, `impact-induced`).

L'ultimo paragrafo ("I tre effetti coesistono…") è in italico e colore `ink-700`. Importante: è esattamente il punto in cui si **demolisce l'idea di catena temporale** anche qui.

### 5.3 Layout principale

Sotto la spiegazione, il vero contenuto: **una barra impilata orizzontale per ogni dimensione**, 4 righe (Produzione, PIL, Occupazione, Redditi). Niente gettito: il gettito non si scompone in diretto/indiretto/indotto allo stesso modo (è un calcolo separato sui flussi totali).

```
┌─────────────────────────────────────────────────────────────────┐
│ DECOMPOSIZIONE PER COMPONENTE                                   │
│                                                                 │
│ Dimensione        Totale     Diretto  Indiretto  Indotto       │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Valore         │ 5,97M€                                    │ │
│ │ della          │ ████████░░░░░░░░░░░░░░░░░░░░░░░░          │ │
│ │ produzione     │  diretto       indir.  indotto            │ │
│ │                │  2,69 (45%)    0,89    2,39 (40%)          │ │
│ │                │  Quanto del fatturato totale viene dai     │ │
│ │                │  cantieri e servizi acquistati direttamente│ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ PIL            │ 3,56M€                                    │ │
│ │ (val. aggiunto)│ ███████░░░░░░░░░░░░░░░░░░░░░░░░           │ │
│ │                │  1,57 (44%)    0,63    1,36 (38%)          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Occupazione    │ 47,1 ETP                                  │ │
│ │                │ ███████████░░░░░░░░░░░░░░░░░░░            │ │
│ │                │  21,4 (45%)    7,6     18,1 (38%)          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Redditi        │ 3,49M€                                    │ │
│ │                │ ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░          │ │
│ │                │  ...                                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Click su una riga per espanderla con i dettagli del settore     │
│ che genera la componente.                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Componenti — dettaglio

#### 5.4.1 Riga "barra impilata"

Ogni riga è una card a sé, larghezza piena, bordo 1px `ink-100`, padding 20px. Layout interno a 3 sezioni in orizzontale:

```
┌─────────────────────────────────────────────────────────────┐
│ [Etichetta] │ [BARRA + numeri sotto]              │ [click▼]│
│             │                                     │         │
│  Dimensione │ Totale: 5,97 M€                     │         │
│  (heading-2)│ ┌────────────────────────────────┐  │         │
│  Unità      │ │██████████│░░░░░░░│▒▒▒▒▒▒▒▒▒▒▒│  │         │
│  (caption)  │ └────────────────────────────────┘  │         │
│             │   2,69 (45%)  0,89 (15%)  2,39 (40%)│         │
│             │   Diretto    Indiretto   Indotto    │         │
│             │                                     │         │
│             │ Descrizione 1 riga                  │         │
└─────────────────────────────────────────────────────────────┘
```

- **Colonna sinistra (160px)**: nome dimensione + unità di misura sotto (`mln €`, `ETP`, ecc.).
- **Colonna centrale (flex-1)**: titolo "Totale: {valore}" sopra la barra. La barra è altezza 32px, fondo `ink-100`, riempita con i 3 segmenti colorati (impact-direct, impact-indirect, impact-induced) proporzionalmente. Le percentuali sotto sono allineate a ciascun segmento. Sotto, **una riga di descrizione testuale** (caption color `ink-700`) che spiega cosa significa quel totale.
- **Colonna destra (40px)**: chevron `▼` cliccabile per espandere.

#### 5.4.2 Stato espanso (click sulla riga)

Click su una riga → la riga si espande in-place con un pannello che mostra:

1. **Quali settori contribuiscono di più a ciascuna delle 3 componenti** (top-3 per Diretto, top-3 per Indiretto, top-3 per Indotto). 3 mini-liste affiancate.
2. **Una micro-narrativa parametrica** per questa dimensione: *"Il PIL diretto è generato principalmente da {top_diretto}; gli effetti indiretti si propagano su {top_indiretto}; l'indotto è dominato da {top_indotto}."*

Lo stato è gestito a livello di vista (solo una riga espansa alla volta, oppure tutte indipendenti — preferibile **indipendenti** per non far perdere il confronto).

#### 5.4.3 Testi descrittivi delle barre

Una riga di testo sotto ogni barra, importantissima per l'accessibilità:

| Dimensione | Testo descrittivo (1 riga) |
|---|---|
| Produzione | "Quanto del volume d'affari complessivo viene dai cantieri/servizi acquistati direttamente (diretto), dai loro fornitori (indiretto) e dai consumi dei lavoratori coinvolti (indotto)." |
| PIL | "Quanta parte del valore aggiunto totale è generata dai settori di prima destinazione, dalla loro filiera, e dai consumi delle famiglie coinvolte." |
| Occupazione | "Quanti posti di lavoro nascono direttamente nei settori che ricevono la spesa, nei loro fornitori, e nei consumi delle famiglie." |
| Redditi | "Quanta parte dei redditi è distribuita ai lavoratori direttamente coinvolti, a quelli della filiera fornitori, e a quelli alimentati dalla spesa indotta." |

### 5.5 Blocco di chiusura — pattern interpretativo

Sotto le 4 barre, un blocco di lettura globale. Banner con bordo sinistro lime, come il takeaway della Sintesi.

Generato da template logico:

```
SE indotto_pct_pil > 35% → "Il peso elevato dell'indotto ({pct}%)
                            indica che gli stipendi distribuiti
                            si traducono in consumi locali."

SE diretto_pct_pil > 55% → "Il forte peso del diretto ({pct}%)
                            riflette il fatto che la spesa si
                            concentra in settori ad alta intensità
                            di valore aggiunto immediato."

SE indiretto_pct_pil > 30% → "Il peso significativo della filiera
                              indiretta ({pct}%) mostra che il
                              progetto attiva forti effetti a
                              cascata sui fornitori."
```

Più di una condizione può attivarsi: in tal caso si mostrano fino a 2 frasi.

### 5.6 Stati condizionali

#### Caso "componente non significativa"

Se una delle 3 componenti vale meno dell'1% del totale (es. indotto = 0,3% per progetti molto specifici): il segmento nella barra non si vede, e nella legenda sotto appare "minimo" invece del numero.

#### Caso "redditi non disponibili"

Alcuni modelli SAM possono non scomporre i redditi. La riga Redditi viene omessa. Le 3 barre rimanenti occupano lo spazio.

### 5.7 Note implementative

- **Render della barra**: 3 `div` con `width: {pct}%` e backgrounds dei 3 token viola, dentro un container relative. Niente librerie esterne: è una semplice composizione CSS.
- **Animazione di entrata**: ogni barra si "riempie" da sinistra in 600ms al primo mount (transform/transition CSS).
- **Componenti React**:
  - `<ImpactComponents />` (container)
  - `<ComponentsLegend />` (blocco didattico in alto)
  - `<DimensionRow data dimension expanded onToggle />`
  - `<StackedBar segments={[direct, indirect, induced]} />`
  - `<ExpandedDetail dimension data />` (sotto-pannello on expand)

---

## 6. Vista 3 — Geografia

### 6.1 Cosa risponde

> "Dove si attiva l'impatto: in quale provincia/regione si depositano i milioni e i posti di lavoro?"

### 6.2 Decisione di base: una mappa, non due

Il report Sardegna aveva due mappe (assoluto e pro-capite). Qui ne mostriamo **una sola**, con un **toggle** che cambia la base. Due mappe affiancate occupano troppo spazio in una piattaforma e l'utente le confronta visivamente con difficoltà.

### 6.3 Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ TITOLO TAB                                              [?]      │
│ Geografia dell'impatto                                           │
│                                                                  │
│ INTRODUZIONE (1 paragrafo, parametrica):                         │
│ "L'investimento è localizzato in {prov_origine}. Vediamo dove   │
│  si distribuiscono i {tot}M€ di {dimensione} attivati."         │
│                                                                  │
│ CONTROLLI:                                                       │
│ Dimensione:  [○ PIL] [○ Produzione] [○ Occupazione]              │
│ Base:        [● Valori assoluti] [○ Pro capite]                  │
│                                                                  │
│ ┌──────────────────────────────────┬───────────────────────────┐ │
│ │                                  │ TOP 10 PROVINCE           │ │
│ │                                  │                           │ │
│ │     MAPPA PROVINCIALE            │ 1. Sassari        2,92 M€ │ │
│ │     (coroplete)                  │ 2. Cagliari       0,21 M€ │ │
│ │                                  │ 3. Sud Sardegna   0,17 M€ │ │
│ │     Color scale: ink-100 →       │ 4. Nuoro          0,16 M€ │ │
│ │                  brand-violet    │ 5. Roma           0,11 M€ │ │
│ │                                  │ 6. Oristano       0,11 M€ │ │
│ │     Hover provincia → tooltip    │ 7. Milano         0,05 M€ │ │
│ │     con nome e valore            │ 8. Firenze        0,02 M€ │ │
│ │                                  │ 9. Torino         0,02 M€ │ │
│ │                                  │ 10. Livorno       0,02 M€ │ │
│ │                                  │                           │ │
│ │                                  │ Altre 97 province  0,42M€ │ │
│ │                                  │ ────────────────────────  │ │
│ │                                  │ Totale Italia     4,24 M€ │ │
│ └──────────────────────────────────┴───────────────────────────┘ │
│                                                                  │
│ COME SI LEGGE                                                    │
│ "Più scura la provincia, maggiore il valore attivato. La spesa  │
│  è localizzata in {prov_origine}; il colore mostra dove i suoi  │
│  effetti si diffondono lungo le filiere produttive."             │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ DISTRIBUZIONE PER MACRO-AREA (banda riassuntiva)          │   │
│ │ ┌──────────────────┬─────────────┬───────────────────┐    │   │
│ │ │ Provincia origine│ Resto regio.│ Fuori regione     │    │   │
│ │ │ 1,95 M€  (46%)   │ 1,61 M€(38%)│ 0,67 M€  (16%)   │    │   │
│ │ └──────────────────┴─────────────┴───────────────────┘    │   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ FRASE DI CHIUSURA (banner lime)                            │   │
│ │ "L'84% del valore generato resta in Sardegna…"             │   │
│ └────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### 6.4 Componenti — dettaglio

#### 6.4.1 Controlli sopra la mappa

Due gruppi di radio button orizzontali, stile pill. Il primo gruppo (Dimensione) ha 3 opzioni; il secondo (Base) ha 2.

- Default: `dimensione=PIL`, `base=assoluti`.
- Cambio dimensione → la mappa si aggiorna, la lista a destra si riordina. Animazione: fade su colori della mappa, slide su lista (200ms).
- Cambio base (assoluto / pro-capite) → ricalcolo lato client se i dati pro-capite sono presenti.

#### 6.4.2 Mappa coroplete

**Implementazione consigliata**: SVG provinciale italiano statico (file vector) + colorazione lato client, non Leaflet o altre librerie pesanti.

Motivi:
- 107 province sono un numero gestibile per SVG inline (~150KB).
- Niente dipendenze runtime.
- Nessun caricamento di tile server.
- Risponde immediatamente al cambio di dimensione/base (è solo un fill).

Color scale: lineare da `ink-100` (province senza impatto) a `brand-violet` (provincia con il massimo valore). 5 step intermedi visibili nella legenda sotto la mappa.

Interazioni:
- Hover su provincia → tooltip con nome + valore + quota %.
- Click su provincia → la riga corrispondente nella lista destra si evidenzia (bordo lime).
- Nessun zoom/pan: la mappa è sempre dell'Italia intera.

#### 6.4.3 Lista top province

A destra della mappa, colonna fissa di ~320px. Ogni riga:

```
[N°]  Nome provincia          Valore  unità  [%]
```

- **Numero progressivo** in colore `ink-300`, monospace.
- **Nome provincia** in body 14px peso 500.
- **Valore** in font tabulare (monospace), allineato a destra.
- **Percentuale** sul totale Italia, in caption color `ink-500`.

La riga 11 ("Altre N province") è in stile riassuntivo, peso 600.
La riga finale "Totale Italia" è separata da un divider e in peso 700.

**Click su una riga** → evidenzia la provincia corrispondente sulla mappa (effetto reciproco rispetto al click sulla mappa).

#### 6.4.4 Blocco "Come si legge"

Subito sotto la mappa+lista, larghezza piena. Sfondo `bg-page`, padding 16px, font-size 13px italic. Testo parametrico:

> *"Più scura la provincia, maggiore il valore di {dimensione_selezionata} attivato. La spesa è fisicamente localizzata in **{provincia_origine}**; il colore mostra dove i suoi effetti si diffondono lungo le filiere produttive e i consumi."*

Se base = pro-capite, aggiungi: *"In modalità pro-capite il valore è diviso per la popolazione di ciascuna provincia, neutralizzando l'effetto delle dimensioni demografiche."*

#### 6.4.5 Banda riassuntiva 3 aree

Una banda orizzontale a 3 colonne, sopra la frase di chiusura. Visualizza la tripartizione concettuale: provincia origine / resto regione / fuori regione.

Stile: 3 colonne larghezza uguale, sfondo bianco, bordi 1px ink-100 tra colonne. Ogni colonna:
- Micro-label uppercase sopra
- Valore in display-md
- Percentuale in pill lime sotto

I 3 valori sommati sono sempre uguali al totale Italia.

#### 6.4.6 Frase di chiusura

Banner lime, analogo a quello della Sintesi ma con copy specifico geografico. Template:

```
SE pct_intra_regio ≥ 80% → "L'{pct}% del valore generato resta in {regione}: la spesa è ancorata al territorio."

SE 60% ≤ pct_intra_regio < 80% → "L'{pct}% del valore resta in {regione}; il restante {1-pct}% si attiva in altre regioni del Paese."

SE pct_intra_regio < 60% → "Solo l'{pct}% del valore resta in {regione}: una quota rilevante si attiva altrove attraverso le filiere nazionali."
```

### 6.5 Stati condizionali — critici per questa vista

Questa è la vista che soffre di più nei casi "poveri". Regole di adattamento:

#### Caso "shock su singola provincia, dispersione minima"

Se più del 95% del valore resta in 1-2 province, la mappa coroplete è quasi tutta `ink-100` e visivamente non comunica. **Sostituisci la mappa con un layout alternativo**:

```
┌────────────────────────────────────────────────────────────┐
│ ┌──────────────────────┐  ┌──────────────────────────────┐ │
│ │ PROVINCIA PRINCIPALE │  │ TOP 5 PROVINCE                │ │
│ │                      │  │ (lista come sopra, max 5)     │ │
│ │     [SVG provincia   │  │                               │ │
│ │      ingrandita,     │  │                               │ │
│ │      come "ritratto"]│  │                               │ │
│ │                      │  │                               │ │
│ │ Cagliari             │  │                               │ │
│ │ 2,12 M€  (94%)       │  │                               │ │
│ │                      │  │                               │ │
│ └──────────────────────┘  └──────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

Trigger: `provincia_top.pct > 90% AND dispersione_extra_regione < 5%`.

#### Caso "dati pro-capite non disponibili"

Toggle "Pro capite" disabilitato o nascosto. Solo "Valori assoluti".

#### Caso "shock multi-provincia"

Se la spesa è distribuita su più province di origine (es. progetto multi-comune), la mappa marca con un bordo speciale (1px lime) le province di origine, distinguendole dalle province "destinatarie di spillover".

### 6.6 Note implementative

- **Asset mappa**: file SVG con tutti i `<path>` provinciali, ognuno con attributo `data-istat-code`. Si trova un dataset libero su GitHub (es. `simonepri/geo-maps` o equivalente). Da preprocessare per ridurre dimensioni (semplificazione poligoni).
- **Tooltip mappa**: implementare con popper.js o equivalente leggero. Posizionamento dinamico, no librerie chart pesanti.
- **Performance**: la mappa SVG viene caricata in lazy mode all'apertura della tab (`<Suspense>` + dynamic import). Le altre tab non la caricano.
- **Componenti React**:
  - `<ImpactGeography />` (container)
  - `<GeoControls dimension base onChange />`
  - `<ItalyMap data dimension highlighted onProvinceClick />`
  - `<ProvinceList items selectedCode onSelect />`
  - `<MacroAreaBand origineValue restoRegio extraRegio />`
  - `<SinglePartFallback />` (per caso "povero")


---

## 7. Vista 4 — Settori

### 7.1 Cosa risponde

> "In quali settori produttivi si attiva il valore? Quali catturano l'effetto sul territorio e quali invece lo disperdono?"

### 7.2 Decisione di base: barre divergenti, non scatter

Lo scatter plot settori × province del report Sardegna è bello ma richiede capacità di lettura tecnica. Per Civiqa scegliamo un grafico più immediato: **barre divergenti orizzontali**. Una barra per settore, divisa in due direzioni: a destra il valore attivato in regione, a sinistra (in arancione) il valore disperso fuori regione.

A colpo d'occhio si vede quale settore "tiene" il valore (barra tutta a destra, verde) e quale lo "disperde" (porzione consistente a sinistra, arancione).

### 7.3 Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ TITOLO TAB                                              [?]      │
│ Impatti settoriali                                               │
│                                                                  │
│ INTRODUZIONE (1 paragrafo, parametrica):                         │
│ "Vediamo in quali settori produttivi si concentra il valore     │
│  attivato dalla spesa, e quali catturano l'effetto sul          │
│  territorio rispetto a quelli che lo disperdono fuori regione." │
│                                                                  │
│ DIMENSIONE: [● PIL] [○ Produzione] [○ Occupazione]               │
│                                                                  │
│ COME SI LEGGE                                                    │
│ "Ogni barra è un settore. La parte verde a destra mostra il     │
│  valore che resta in {regione}; la parte arancione a sinistra   │
│  mostra il valore che si attiva fuori regione."                  │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ TOP 10 SETTORI per valore attivato                         │   │
│ │                                                            │   │
│ │           ←FUORI REGIONE      IN REGIONE→                  │   │
│ │           ─────────────┼─────────────────                   │   │
│ │ Costruz. │      ░░░░░░│████████████████   1,07 M€ (94%)   │   │
│ │ Alloggio │       ░░░░░│██████████████      0,57 M€ (92%)  │   │
│ │ Immobil. │ ██████░░░░░│████████             0,52 M€ (40%) │   │
│ │ Comm.det.│        ░░░░│██████              0,19 M€ (88%)  │   │
│ │ Serv.fin.│   █████░░░░│██████               0,14 M€ (62%) │   │
│ │ Informat.│        ░░░░│█████               0,12 M€ (89%)  │   │
│ │ ...                                                         │   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌─────────────────────┬─────────────────────────────────────┐    │
│ │ TOP 3 INTRA-REGIONE │ TOP 3 DISPERSIONE EXTRA-REGIONE     │    │
│ │ (verde)             │ (arancio)                            │    │
│ │                     │                                      │    │
│ │ Costruzioni  94%    │ Attività immobiliari   60% disp.    │    │
│ │ Alloggio     92%    │ Servizi finanziari     38% disp.    │    │
│ │ Comm.dett.   88%    │ Serv. finanz. ausil.   45% disp.    │    │
│ └─────────────────────┴─────────────────────────────────────┘    │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ FRASE DI CHIUSURA (banner lime)                            │   │
│ │ Spiegazione del pattern osservato                          │   │
│ └────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### 7.4 Componenti — dettaglio

#### 7.4.1 Selettore dimensione

Stesso pattern dei controlli in Geografia: 3 pill orizzontali. Default: PIL.

Su cambio dimensione:
- Le barre si riordinano (animazione 300ms) per nuovo valore.
- I numeri a destra cambiano formato (mln € → ETP per occupazione).

#### 7.4.2 Grafico a barre divergenti

Punto centrale visivo della vista. Implementazione: una griglia CSS con riga per settore.

Ogni riga:
- **Colonna 1 (160px)**: nome settore (body 14px, peso 500).
- **Colonna 2 (flex, allineata al centro)**: barra divergente.
- **Colonna 3 (120px)**: valore totale e %.

La barra divergente è composta da 2 metà:
- Linea verticale centrale (1px `ink-300`) come "0".
- A sinistra: barra `impact-leak` (arancione) larghezza proporzionale al valore extra-regione, allineata a destra (cresce verso sinistra).
- A destra: barra `impact-retain` (verde) larghezza proporzionale al valore intra-regione, allineata a sinistra (cresce verso destra).

Scala: globale per tutti i settori del grafico, in modo che le barre siano comparabili tra loro. La scala max è la somma intra+extra del settore con valore assoluto più grande.

Mostra: top 10 settori per valore totale (intra + extra). Sotto, un link "Mostra tutti i settori" → espande a tutti.

#### 7.4.3 Etichetta di scala

Sopra il grafico, una piccola etichetta che indica i due lati:

```
        ← FUORI REGIONE        IN REGIONE →
        ──────────────────┼───────────────
                          0
```

Stile: caption 11px uppercase color `ink-500`, allineata sulla linea dello 0.

#### 7.4.4 Doppia card "Top 3 intra / Top 3 extra"

Sotto il grafico, due card affiancate (1/2 larghezza ciascuna).

**Card sinistra: "Trattiene di più sul territorio"**
- Sfondo bianco, bordo sinistro 4px `impact-retain` (verde).
- Top 3 settori per quota intra-regione % più alta (filtrando settori con valore assoluto > soglia minima).
- Per ogni riga: nome settore, %, mini-barra orizzontale color verde.

**Card destra: "Disperde di più fuori regione"**
- Sfondo bianco, bordo sinistro 4px `impact-leak` (arancione).
- Top 3 settori per quota dispersione %.
- Per ogni riga: nome settore, %, mini-barra orizzontale color arancione.

Questa coppia è il "punto di insight" rapido della pagina. Risponde alla domanda "quali settori sono territorialmente buoni e quali no?" senza dover leggere il grafico grande.

#### 7.4.5 Frase di chiusura

Banner lime. Logica template:

```
SE settori_costruzioni_o_servizi_locali in top intra
   → "I settori che catturano più valore sul territorio sono quelli
      legati alla presenza fisica: cantieri, alloggi, servizi locali.
      Sono attività non delocalizzabili."

SE attività_immobiliari o servizi_finanziari in top extra
   → "Una parte della dispersione si concentra su immobiliare e
      servizi finanziari: è un pattern strutturale dell'economia
      italiana, dove questi settori sono concentrati in poche
      aree del Paese."
```

### 7.5 Stati condizionali

#### Caso "pochi settori coinvolti" (<5)

Per progetti molto specializzati, mostrare meno di 5 settori non giustifica un grafico a barre divergenti. **Layout alternativo**: una lista compatta con cards verticali, una per settore, con i numeri intra/extra esplicitati come testo.

#### Caso "tutti settori intra ≥ 95%"

Se il progetto è quasi interamente locale (es. piccolo cantiere comunale), tutte le barre saranno tutte a destra. La parte sinistra del grafico (zona arancione) appare quasi vuota. **Eliminare la divergente** e mostrare invece un classico bar chart orizzontale a colore singolo verde.

Trigger: `media_pct_intra_top10 > 95%`.

#### Caso "shock distribuito su pochi settori unici"

Se lo shock arriva su solo 1-2 settori (es. spesa al 100% in Costruzioni), il grafico mostra principalmente l'effetto indotto su altri settori. **Aggiungere una nota informativa** in alto: *"La spesa è concentrata su Costruzioni; i settori qui sotto includono anche quelli attivati per filiera e per consumi indotti."*

### 7.6 Note implementative

- **Render delle barre**: tutto via CSS grid + flex. Niente libreria grafica. Le barre sono semplici `<div>` con `width: {%}` e background del token corretto.
- **Sort dinamico**: lista interna ordinata per `total_value desc` su cambio dimensione. Animazione FLIP per riordinamento smooth (libreria piccola tipo `react-flip-toolkit` se necessario, o transizioni CSS native su `transform: translateY`).
- **Componenti React**:
  - `<ImpactSectors />` (container)
  - `<DimensionToggle value onChange />` (riusabile con Geografia)
  - `<DivergentBarChart sectors dimension />` (custom)
  - `<DivergentBarRow sector intra extra max />` (riga singola)
  - `<SectorInsightCard variant="intra|extra" sectors />` (doppia card insight)

---

## 8. Glossario contestuale (popover "?")

Cliccando l'icona "?" accanto al titolo della tab, si apre un **popover laterale** (320px di larghezza, fissato a destra) con il glossario specifico della tab attiva.

Il glossario non è un blocco di testo lungo: è una lista di termini con definizione breve (max 3 righe ciascuna), in linguaggio piano.

### 8.1 Glossario tab Sintesi

| Termine | Definizione semplice |
|---|---|
| **PIL (valore aggiunto)** | Il valore aggiunto è la ricchezza nuova che un'attività economica genera. È la differenza tra quanto ha venduto e quanto ha dovuto acquistare per produrre. Il PIL è la somma di tutti i valori aggiunti di un'economia. |
| **Produzione** | Il volume d'affari totale generato lungo tutta la filiera attivata dalla spesa. È un numero più grande del PIL perché include anche il costo dei beni intermedi acquistati. |
| **ETP (Equivalente a Tempo Pieno)** | Misura standard di occupazione: 1 ETP = 1 persona che lavora a tempo pieno per 1 anno. Se 2 persone lavorano metà tempo, fanno 1 ETP. |
| **Redditi** | La quota di valore aggiunto distribuita alle famiglie sotto forma di stipendi, e alle imprese sotto forma di profitti. Alimenta i consumi futuri. |
| **Gettito** | Le imposte e i contributi (IVA, IRPEF, IRES, contributi previdenziali) che lo Stato incassa dall'attività economica attivata. |
| **Moltiplicatore** | Quanti euro di effetto si generano per ogni euro speso. Un moltiplicatore di 1,32 significa che 1 € di spesa genera 1,32 € di valore aggiunto. |

### 8.2 Glossario tab Componenti

| Termine | Definizione semplice |
|---|---|
| **Impatto diretto** | L'effetto immediato della spesa sui settori che la ricevono. Es. l'impresa edile pagata per i lavori. |
| **Impatto indiretto** | L'effetto a cascata sui fornitori dei settori direttamente coinvolti. Es. il fornitore di cemento dell'impresa edile. |
| **Impatto indotto** | L'effetto dei consumi delle famiglie dei lavoratori coinvolti, che spendono i loro stipendi in beni e servizi. |
| **Filiera** | L'insieme delle attività produttive collegate tra loro per produrre un bene o un servizio. |
| **Spesa autonoma** | La spesa iniziale del progetto, prima che attivi qualsiasi effetto. |

### 8.3 Glossario tab Geografia

| Termine | Definizione semplice |
|---|---|
| **Provincia di origine** | La provincia in cui avviene fisicamente la spesa (i lavori, gli acquisti). |
| **Spillover regionale** | L'effetto che dalla provincia di origine si diffonde sulle altre province della stessa regione, tramite le filiere. |
| **Dispersione extra-regionale** | La parte del valore che si attiva in regioni diverse da quella di origine. Avviene perché alcuni fornitori si trovano altrove. |
| **Valore pro capite** | Il valore diviso per il numero di abitanti della provincia. Serve a confrontare territori di diversa dimensione. |

### 8.4 Glossario tab Settori

| Termine | Definizione semplice |
|---|---|
| **Settore ATECO** | La classificazione standard delle attività economiche in Italia. Costruzioni, alloggio, commercio, ecc. sono settori ATECO. |
| **Settore non delocalizzabile** | Un settore i cui beni/servizi devono essere prodotti dove serve il cliente: cantieri, ristoranti, parrucchieri. Tendono a trattenere il valore. |
| **Concentrazione territoriale** | La tendenza di un settore a essere localizzato in poche aree del Paese. Es. il finanziario è concentrato a Milano. |

---

## 9. Stati globali della sezione

### 9.1 Loading

Quando l'analisi è in elaborazione (status "running"):
- Le 4 tab sono visibili ma disabilitate (colore `ink-300`).
- Al centro del container, schermata simile a quella "Analisi in corso" già esistente in Civiqa (`dots-violet-bg` + spinner + testo "L'analisi è in corso").
- Polling ogni 10s sullo stato.

### 9.2 Error

Se l'analisi è in stato "error":
- Banner full-width rosso chiaro (sfondo `#FDECEC`, bordo `#C45A2E`).
- Testo: "Si è verificato un errore nell'elaborazione. Riprova o contatta il supporto."
- Bottone "Riavvia analisi" + bottone "Scarica log".

### 9.3 Empty

Se l'utente ha eseguito una valutazione che non ha generato impatti significativi (raro, ma possibile per importi molto piccoli):
- Banner informativo: "L'analisi è completata. L'impatto economico è inferiore alla soglia di significatività ({soglia} €)."
- Mostra comunque le tab con i valori reali (anche se piccoli), per trasparenza.

### 9.4 Stale (dati superati)

Se i dati di input del progetto sono cambiati dopo l'ultima analisi:
- Banner giallo `#FEF3C7` in alto: "I dati del progetto sono stati modificati il {data}. L'analisi mostrata è del {data_analisi}. [Riavvia analisi]"


---

## 10. Struttura dati (payload atteso dal frontend)

Il frontend riceve dal backend un unico payload JSON per l'analisi di impatto. Schema proposto:

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
      { "code": "SS", "name": "Sassari", "spend_share": 1.0 }
    ],
    "origin_region": { "code": "20", "name": "Sardegna" },
    "spend_breakdown": [
      { "ateco_code": "F", "ateco_name": "Costruzioni", "amount": 1561000, "share": 0.58 },
      { "ateco_code": "I55", "ateco_name": "Alloggio e ristorazione", "amount": 371000, "share": 0.138 }
    ]
  },
  "synthesis": {
    "production": { "total": 5970000, "extra_regional": 1210000 },
    "gdp":        { "total": 3560000, "extra_regional":  670000 },
    "employment": { "total":    47.1, "extra_regional":     6.5, "unit": "ETP" },
    "income":     { "total": 3490000, "extra_regional":  null },
    "fiscal":     { "total": 1120000, "geographic_split": false },
    "kpis": {
      "gdp_multiplier": 1.32,
      "employment_intensity_per_meur": 17.5,
      "fiscal_autofinanc_pct": 0.416
    }
  },
  "components": {
    "production": { "direct": 2690000, "indirect": 890000, "induced": 2390000 },
    "gdp":        { "direct": 1570000, "indirect": 630000, "induced": 1360000 },
    "employment": { "direct": 21.4,    "indirect": 7.6,    "induced": 18.1 },
    "income":     { "direct": ...,     "indirect": ...,    "induced": ... },
    "top_sectors_by_component": {
      "production": {
        "direct":   [{ "name": "Costruzioni", "value": 1561000 }, ...],
        "indirect": [...],
        "induced":  [...]
      },
      "gdp": { ... },
      "employment": { ... },
      "income": { ... }
    }
  },
  "geography": {
    "provinces": [
      {
        "code": "SS", "name": "Sassari", "lat": 40.72, "lng": 8.56,
        "population": 478000,
        "values": {
          "gdp":        { "absolute": 2924000, "per_capita": 6.12 },
          "production": { "absolute": 4786000, "per_capita": 10.01 },
          "employment": { "absolute": 27.5,    "per_capita": 5.75e-5 }
        }
      },
      ...
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
        "values": {
          "gdp":        { "intra": 1006000, "extra": 65000 },
          "production": { "intra": ..., "extra": ... },
          "employment": { "intra": ..., "extra": ... }
        }
      },
      ...
    ]
  }
}
```

Note di schema:
- Tutti i valori monetari in **unità intere** (€, non mln€). Formattazione lato frontend.
- `null` quando una metrica non è calcolabile per quella dimensione (es. `income.extra_regional` può essere null).
- `geographic_split: false` su `fiscal` segnala al frontend di non mostrare il gettito sulle mappe.

---

## 11. Telemetria / eventi da tracciare

Per misurare se la rinfrescata funziona davvero (vedi sezione 13), tracciare:

| Evento | Quando | Proprietà |
|---|---|---|
| `eia_view_opened` | Apertura sezione | `project_id`, `analysis_id` |
| `eia_tab_changed` | Click su una tab | `from_tab`, `to_tab`, `time_on_previous_tab_ms` |
| `eia_help_opened` | Click sull'icona "?" | `tab`, `tab_context` |
| `eia_dimension_switched` | Cambio dimensione (Geografia/Settori) | `tab`, `from_dim`, `to_dim` |
| `eia_base_switched` | Cambio assoluto/pro-capite (Geografia) | `from_base`, `to_base` |
| `eia_province_clicked` | Click su provincia in mappa o lista | `province_code`, `from_map_or_list` |
| `eia_component_row_expanded` | Click espandi su barra Componenti | `dimension` |
| `eia_report_downloaded` | Click "Scarica report" | `format` |

---

## 12. Roadmap di implementazione

Suggerimento per dividere il lavoro in iterazioni gestibili.

### Iterazione 1 — Sintesi standalone
- Componenti: `<SpendInputCard />`, `<EffectCard />`, `<KPIPill />`, `<TakeawayBanner />`.
- Tab Sintesi completa, prima delle altre 3 tab (placeholder "in arrivo").
- Test con dati Sardegna PST.
- Validazione con primo utente reale.

### Iterazione 2 — Componenti
- `<DimensionRow />`, `<StackedBar />`, `<ComponentsLegend />`.
- Stati di espansione.
- Test con caso "redditi non disponibili".

### Iterazione 3 — Geografia
- `<ItalyMap />` (più impegnativo: caricare SVG, gestire interazioni).
- `<ProvinceList />`, `<MacroAreaBand />`.
- Stato fallback "shock singola provincia".

### Iterazione 4 — Settori
- `<DivergentBarChart />`, `<SectorInsightCard />`.
- Sorting dinamico.

### Iterazione 5 — Glossario e accessibilità
- Popover "?" per tutte e 4 le tab.
- Test screen reader (NVDA / VoiceOver).
- Test con utente non specialista.

### Iterazione 6 — Polish e telemetria
- Animazioni, transizioni, micro-interazioni.
- Tracking eventi.
- Test responsive mobile.

---

## 13. Criteri di successo

Come capiamo se la rinfrescata funziona davvero. Da misurare 1 mese dopo il rilascio.

**Quantitativi (da telemetria):**
- Tempo medio sulla sezione: deve **diminuire** rispetto al baseline (gli utenti trovano il dato più velocemente). Target: -30%.
- % di sessioni che cambiano almeno 1 tab: deve **aumentare** (segno che la navigazione invita all'approfondimento). Target: ≥ 60%.
- % di click su "?" almeno una volta per progetto: target 15-25% (segno che il glossario serve, ma non troppi perché vorrebbe dire che il copy non basta).
- Tasso di download del report PDF: dovrebbe **diminuire** (se la sezione web è autosufficiente, meno gente scarica il PDF).

**Qualitativi (da interviste con 3-5 funzionari di Comuni):**
- Capire il significato dei 5 macronumeri senza aiuto.
- Capire la differenza diretto/indiretto/indotto senza aiuto.
- Riassumere a parole loro "cosa dice questa analisi" in meno di 2 minuti.

---

## 14. Cose esplicitamente NON in questo redesign

Per chiarezza, cose che si potrebbe pensare di fare ma che non facciamo (volontariamente):

- **Confronto tra progetti** (es. "questo PIL è alto rispetto ad altri progetti simili"). Richiede dataset di confronto e benchmark. Out of scope.
- **Scenari controfattuali** ("se avessi speso X invece di Y…"). È un'analisi diversa, non un cambio di rappresentazione.
- **Esportazione di singoli grafici** (es. PNG della mappa). Possibile in iterazione futura, non ora.
- **Drill-down a livello comunale** (sub-provincia). I dati SAM non lo supportano.
- **Stima dell'incertezza** (intervalli di confidenza sui numeri). Il modello SAM non li produce nativamente.

---

## 15. Riassunto in una pagina

Per chi salta direttamente qui, ecco il documento in 1 pagina.

**Sostituiamo** 6 tab fotocopia (Riepilogo · Spese · PIL · Occupazione · Valore Produzione · Redditi · Gettito) **con 4 tab eterogenee**:

1. **Sintesi** — landing tab. Spesa iniziale in alto, 5 effetti in griglia (NON in catena), 3 KPI pill, frase di chiusura parametrica.
2. **Componenti** — barre impilate orizzontali per Produzione, PIL, Occupazione, Redditi. Decomposizione diretto/indiretto/indotto con spiegazione didattica chiara.
3. **Geografia** — mappa coroplete italiana + lista top province + banda riassuntiva 3 aree (origine/regione/extra).
4. **Settori** — barre orizzontali divergenti intra/extra-regione + 2 card insight (chi trattiene, chi disperde).

**Principi**:
- Linguaggio piano sempre accompagnato dal termine tecnico.
- Niente catene visive (frecce, sequenze). Sono letture parallele dello stesso fenomeno.
- Testi descrittivi sotto ogni grafico ("Come si legge").
- Glossario contestuale aperto da icona "?".
- Adattamento ai casi "poveri" (singola provincia, pochi settori).
- Riuso pattern visivi Civiqa esistenti (banner scuro, KPI-pill, tabella meta, CTA viola, accent lime).

**Esclusioni**: niente confronti tra progetti, niente scenari controfattuali, niente drill-down comunale.

— Fine documento —
