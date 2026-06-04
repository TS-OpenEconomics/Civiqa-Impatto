# Needs — OpenCore Schema v2

> **Civiqa OpenCore v2 · Maggio 2026**  
> Riferimento canonico per il tipo `Need` e il catalogo completo
> dei 63 bisogni territoriali municipali.
>
> **Novità v2:** MOP tree esteso da 190 a 285 categorie. Tutte le 95 nuove
> categorie mappate a fabbisogni esistenti — nessun nuovo fabbisogno aggiunto.
> 29 fabbisogni aggiornati. Nuovo campo `description` per la UI del wizard.

---

## Indice

1. [Panoramica](#1-panoramica)
2. [Interfaccia TypeScript](#2-interfaccia-typescript)
3. [Field Reference](#3-field-reference)
4. [Catalogo per tema](#4-catalogo-per-tema)
   - [TC01 — Cultura e turismo](#tc01----cultura--e--turismo)
   - [TC02 — Economia e lavoro](#tc02----economia--e--lavoro)
   - [TC03 — Istruzione e formazione](#tc03----istruzione--e--formazione)
   - [TC04 — Welfare e inclusione](#tc04----welfare--e--inclusione)
   - [TC05 — Salute e sanità](#tc05----salute--e--sanita)
   - [TC06 — Ambiente e territorio](#tc06----ambiente--e--territorio)
   - [TC07 — Mobilità e trasporti](#tc07----mobilita--e--trasporti)
   - [TC08 — Patrimonio pubblico](#tc08----patrimonio--pubblico)
   - [TC09 — Energia e clima](#tc09----energia--e--clima)
   - [TC10 — Sport e tempo libero](#tc10----sport--e--tempo--libero)
   - [TC11 — Ricerca e innovazione](#tc11----ricerca--e--innovazione)
   - [TC12 — PA e innovazione](#tc12----pa--e--innovazione)
5. [Derived Views e Helpers](#5-derived-views-e-helpers)
6. [Statistiche di sintesi](#6-statistiche-di-sintesi)

---

## 1. Panoramica

Un **fabbisogno** è l'unità di domanda che guida il wizard DOCFAP.
Risponde alla domanda concreta del funzionario comunale:
*«Quale problema territoriale sto cercando di risolvere?»*

```
Tema TC  →  Need  →  Categorie MOP suggerite  →  Alternative DOCFAP
```

La categoria MOP è un **output** del fabbisogno scelto — non un input dell'utente.
Una categoria può comparire in più fabbisogni perché la stessa tipologia di
infrastruttura può rispondere a bisogni diversi in base all'obiettivo dell'investimento.
In v2 questo vale per 89 delle 285 categorie (v1: 70 delle 190).

**Metodo di derivazione.** I 63 fabbisogni sono stati derivati bottom-up dall'intero
set di categorie MOP. Per ogni categoria sono state poste tre domande:
(1) Cosa produce fisicamente? (2) Quale bisogno territoriale soddisfa?
(3) La stessa categoria risponde a bisogni *distinti* a seconda dell'uso finale?

**Ancoraggio normativo triplo obbligatorio** per ogni fabbisogno:

| Fonte | Ruolo |
|---|---|
| SOSE / D.Lgs. 216/2010 | Mappa il bisogno alla funzione comunale standard |
| Missioni DUP / D.Lgs. 118/2011 | Collega alla struttura del bilancio comunale |
| Codici RSO — AP 2021-2027 | Identifica i fondi strutturali UE eleggibili |

---

## 2. Interfaccia TypeScript

```typescript
export interface Need {
  code: string;                   // FAB-01…FAB-63. Permanente — non rinumerare mai.
  label: string;                  // Label breve per la selezione nel wizard
  tema_code: string;              // FK → Theme.code (TC01–TC12)
  visible_docfap: boolean;        // Sempre true in v2
  visible_dataroom: boolean;      // true se il tema ha indicatori DataRoom al lancio
  sose_function: string;          // Funzione SOSE / D.Lgs. 216/2010
  mission_codes: string[];         // FK[] → DupMission.code
  rso_codes: string[];            // Codici RSO dall'AP 2021-2027
  funds: string[];                // Fondi eleggibili (FESR, FSE+, FC, FEASR…)
  funding_gap: boolean;           // true = copertura AP 2021-2027 assente/marginale
  q1_label: string;               // Wizard Q1: stato attuale del servizio/asset
  q2_label: string | null;        // Wizard Q2: vita utile residua. null = greenfield
  q3_label: string;               // Wizard Q3: OPEX annuo + CAPEX ricorrente
  cluster_mca: string;            // FK → ClusterMCA.code (C01–C13) | "NONE"
  description: string;            // Testo UI: problema + interventi principali [v2]
  category_codes: string[]; // FK[] → ProjectCategory.code
}
```

---

## 3. Field Reference

**`code`** — Identificatore stabile `FAB-NN`. Mai rinumerato né riutilizzato.

**`label`** — Label breve in italiano dalla prospettiva del funzionario:
*«Qual è il mio problema?»* Max ~60 caratteri.

**`tema_code`** — FK verso `Theme.code`. Ogni fabbisogno appartiene a
esattamente un tema. Il tema è il punto di ingresso per la navigazione;
il fabbisogno è l'unità di selezione.

**`visible_dataroom`** — `true` per TC01–TC07 e TC12 (indicatori DataRoom attivi
al lancio). `false` per TC08–TC11. Un fabbisogno con `false` è pienamente
usabile nel wizard — non ha semplicemente dati territoriali contestuali.

**`funding_gap`** — `true` quando la copertura RSO AP 2021-2027 è assente o
marginale. Il wizard mostra un avviso prominente e suggerisce fonti alternative.
Attualmente `true` per 8 fabbisogni.

**`q2_label`** — `null` per fabbisogni greenfield (non esiste un asset preesistente
con vita utile misurabile). Attualmente `null` per 8 fabbisogni.

**`cluster_mca`** — Determina quale griglia di criteri qualitativi si attiva nel
wizard. `"NONE"` per servizi immateriali (formazione, contributi) senza asset fisico.
Attualmente `"NONE"` per 3 fabbisogni: FAB-47, FAB-48, FAB-57.

**`description`** *(nuovo in v2)* — Testo mostrato nella scheda fabbisogno nel wizard.
Due frasi: (1) il problema territoriale che si affronta; (2) i principali interventi
finanziabili in linguaggio accessibile al funzionario. Max ~320 caratteri.
Scritto dagli analisti — manutenibile direttamente in `fabbisogni.ts`.

**`category_codes`** — Array di codici C### che possono rispondere a questo
bisogno. Diventa il pool di tipologie eleggibili per le alternative DOCFAP.
Aggiornato in v2 per 29 fabbisogni con le 95 nuove categorie MOP.

---

## 4. Catalogo per tema

### TC01 — Cultura e turismo

_✅ DataRoom attiva · 3 fabbisogni_

| Codice | Label | Cluster | Categorie | Gap |
|---|---|---|---|---|
| `FAB-31` | Conservazione e valorizzazione del patrimonio culturale | `C06` | 11 (+4) |  |
| `FAB-32` | Accesso alla cultura e all'offerta culturale per la comunità | `C06` | 5 (+2) |  |
| `FAB-33` | Sviluppo dell'offerta e dell'attrattività turistica | `C06` | 21 (+3) |  |

*✧ Need greenfield (q2\_label = null)*

#### `FAB-31` — Conservazione e valorizzazione del patrimonio culturale

> Patrimonio culturale (monumenti, aree archeologiche, beni mobili) in stato di degrado o a rischio. Finanzia restauro e riqualificazione di beni culturali, musei, archivi, biblioteche, aree archeologiche e patrimonio rurale.

| Campo | Valore |
|---|---|
| Tema | `TC01` — Cultura e turismo |
| DataRoom | ✅ |
| Funzione SOSE | Tutela del patrimonio culturale e paesaggistico |
| Missioni DUP | `M05` |
| Codici RSO | `RSO5.1` · `RSO5.2` |
| Fondi | `FESR` · `FC` · `MIBACT` |
| Funding gap | No |
| Cluster MCA | `C06` |
| Categorie MOP (11) | `C087` · `C088` · `C089` · `C090` · `C091` · `C092` · `C093` · `C211` · `C212` · `C213` · `C214` *(4 nuove in v2)* |
| Q1 | Stato di conservazione del bene (classe conservazione MiC) |
| Q2 | Vita utile residua del bene ante-intervento |
| Q3 | Costo annuo manutenzione ordinaria e sorveglianza |

#### `FAB-32` — Accesso alla cultura e all'offerta culturale per la comunità

> Offerta culturale per la comunità locale insufficiente o concentrata in pochi centri. Finanzia musei, biblioteche, archivi, centri culturali e sociali per ampliare l'accesso alla cultura sul territorio.

| Campo | Valore |
|---|---|
| Tema | `TC01` — Cultura e turismo |
| DataRoom | ✅ |
| Funzione SOSE | Servizi culturali per la comunità locale |
| Missioni DUP | `M05` |
| Codici RSO | `RSO5.1` |
| Fondi | `FESR` · `MUN` |
| Funding gap | No |
| Cluster MCA | `C06` |
| Categorie MOP (5) | `C089` · `C107` · `C114` · `C211` · `C212` *(2 nuove in v2)* |
| Q1 | Offerta culturale pro capite (eventi, strutture per 1000 ab) |
| Q2 | Vita utile residua delle strutture culturali |
| Q3 | Costo annuo erogazione servizi culturali |

#### `FAB-33` — Sviluppo dell'offerta e dell'attrattività turistica

> Attrattività turistica del territorio bassa per carenza di infrastrutture ricettive e di valorizzazione. Finanzia alberghi, strutture agrituristiche, centri di accoglienza, recupero del patrimonio culturale a fini turistici e strutture per eventi.

| Campo | Valore |
|---|---|
| Tema | `TC01` — Cultura e turismo |
| DataRoom | ✅ |
| Funzione SOSE | Sviluppo economico del turismo locale |
| Missioni DUP | `M07` |
| Codici RSO | `RSO5.1` · `RSO1.3` |
| Fondi | `FESR` · `FC` |
| Funding gap | No |
| Cluster MCA | `C06` |
| Categorie MOP (21) | `C053` · `C056` · `C061` · `C076` · `C083` · `C087` · `C088` · `C089` · `C090` · `C093` · `C112` · `C113` · `C114` · `C128` · `C129` · `C130` · `C131` · `C132` · `C213` · `C214` · `C243` *(3 nuove in v2)* |
| Q1 | Arrivi e presenze turistiche (trend ultimi 5 anni) |
| Q2 | Vita utile residua delle strutture turistiche |
| Q3 | Costo annuo gestione strutture e promozione |

### TC02 — Economia e lavoro

_✅ DataRoom attiva · 11 fabbisogni_

| Codice | Label | Cluster | Categorie | Gap |
|---|---|---|---|---|
| `FAB-08` | Reti idriche per usi produttivi industriali | `C08` | 2 | ⚠ |
| `FAB-09` | Reti e infrastrutture idriche per usi agricoli | `C08` | 4 (+1) |  |
| `FAB-19` | Riconversione e reindustrializzazione di aree produttive dismesse | `C12` | 4 |  |
| `FAB-29` | Logistica e infrastrutture per le merci | `C02` | 3 | ⚠ |
| `FAB-34` | Sviluppo e infrastrutturazione di aree produttive | `C12` | 12 |  |
| `FAB-35` | Sviluppo e modernizzazione delle filiere agricole e agroalimentari | `C12` | 14 (+2) |  |
| `FAB-36` | Qualità, benessere e sostenibilità delle produzioni zootecniche | `C12` | 2 |  |
| `FAB-37` | Diversificazione economica e multifunzionalità delle imprese agricole ✧ | `C12` | 2 |  |
| `FAB-39` | Infrastrutture e filiera della pesca professionale e acquacoltura | `C12` | 6 (+1) |  |
| `FAB-40` | Vitalità commerciale, servizi di prossimità e accesso al cibo | `C12` | 4 (+1) | ⚠ |
| `FAB-57` | Sostegno all'occupazione e al reinserimento lavorativo ✧ | `NONE` | 34 (+30) |  |

*✧ Need greenfield (q2\_label = null)*

#### `FAB-08` — Reti idriche per usi produttivi industriali

> Aree produttive e industriali prive di reti idriche adeguate per usi produttivi. Finanzia reti idriche industriali e infrastrutture per la captazione e distribuzione di acqua a uso non agricolo.

| Campo | Valore |
|---|---|
| Tema | `TC02` — Economia e lavoro |
| DataRoom | ✅ |
| Funzione SOSE | Infrastrutture per aree produttive — servizi idrici |
| Missioni DUP | `M14` |
| Codici RSO | `RSO1.3` |
| Fondi | `FESR` |
| Funding gap | ⚠ Sì — copertura AP assente o marginale |
| Cluster MCA | `C08` |
| Categorie MOP (2) | `C024` · `C032` |
| Q1 | Disponibilità attuale di acqua industriale nelle aree produttive |
| Q2 | Vita utile residua delle reti idriche industriali |
| Q3 | Costo annuo gestione rete idrica industriale |

#### `FAB-09` — Reti e infrastrutture idriche per usi agricoli

> Territorio agricolo con scarsa o assente infrastrutturazione irrigua, con perdite produttive significative. Finanzia reti idriche rurali, impianti irrigui interaziendali, infrastrutture di captazione per uso agricolo e laghetti collinari.

| Campo | Valore |
|---|---|
| Tema | `TC02` — Economia e lavoro |
| DataRoom | ✅ |
| Funzione SOSE | Sviluppo rurale — infrastrutture irrigue |
| Missioni DUP | `M14` · `M16` |
| Codici RSO | `RSO3.1` |
| Fondi | `FEASR` |
| Funding gap | No |
| Cluster MCA | `C08` |
| Categorie MOP (4) | `C025` · `C031` · `C140` · `C203` *(1 nuove in v2)* |
| Q1 | Disponibilità e copertura irrigua (% SAU irrigata) |
| Q2 | Vita utile residua degli impianti irrigui |
| Q3 | Costo annuo gestione consorzi irrigui e reti |

#### `FAB-19` — Riconversione e reindustrializzazione di aree produttive dismesse

> Aree produttive dismesse o sottoutilizzate che compromettono l'attrattività economica del territorio. Finanzia riconversione industriale, sistemazione dei terreni, trattamento di rifiuti speciali derivanti dalla bonifica e recupero funzionale.

| Campo | Valore |
|---|---|
| Tema | `TC02` — Economia e lavoro |
| DataRoom | ✅ |
| Funzione SOSE | Sviluppo economico — riconversione produttiva |
| Missioni DUP | `M14` |
| Codici RSO | `RSO1.4` |
| Fondi | `FESR` |
| Funding gap | No |
| Cluster MCA | `C12` |
| Categorie MOP (4) | `C014` · `C015` · `C069` · `C158` |
| Q1 | Superficie di aree produttive dismesse disponibili (ha) |
| Q2 | Vita utile residua degli impianti ante-conversione |
| Q3 | Costo annuo custodia e manutenzione aree dismesse |

#### `FAB-29` — Logistica e infrastrutture per le merci

> Carenza di infrastrutture logistiche e di connessione per il trasporto delle merci. Finanzia interporti, strutture portuali di servizio, strade vicinali interpoderali e sistemi di trasporto multimodale.

| Campo | Valore |
|---|---|
| Tema | `TC02` — Economia e lavoro |
| DataRoom | ✅ |
| Funzione SOSE | Logistica e supply chain territoriale |
| Missioni DUP | `M14` |
| Codici RSO | `RSO3.1` |
| Fondi | `FESR` |
| Funding gap | ⚠ Sì — copertura AP assente o marginale |
| Cluster MCA | `C02` |
| Categorie MOP (3) | `C062` · `C161` · `C173` |
| Q1 | Efficienza logistica del territorio (costi di distribuzione) |
| Q2 | Vita utile residua delle infrastrutture logistiche |
| Q3 | Costo annuo gestione magazzini e piattaforme |

#### `FAB-34` — Sviluppo e infrastrutturazione di aree produttive

> Aree produttive prive di infrastrutturazione adeguata (strade, reti, servizi) per insediare o ampliare attività industriali e artigianali. Finanzia zone industriali, strutture per la logistica, capannoni comuni e infrastrutture civili per aree produttive.

| Campo | Valore |
|---|---|
| Tema | `TC02` — Economia e lavoro |
| DataRoom | ✅ |
| Funzione SOSE | Sviluppo economico locale — aree produttive |
| Missioni DUP | `M14` |
| Codici RSO | `RSO1.3` · `RSO1.4` |
| Fondi | `FESR` |
| Funding gap | No |
| Cluster MCA | `C12` |
| Categorie MOP (12) | `C067` · `C068` · `C113` · `C153` · `C154` · `C155` · `C156` · `C157` · `C159` · `C160` · `C161` · `C171` |
| Q1 | Tasso di occupazione aree produttive (% lotti disponibili) |
| Q2 | Vita utile residua delle infrastrutture produttive |
| Q3 | Costo annuo manutenzione infrastrutture produttive |

#### `FAB-35` — Sviluppo e modernizzazione delle filiere agricole e agroalimentari

> Filiere agricole e agroalimentari con bassa competitività per insufficienza di infrastrutture, tecnologie e strutture di trasformazione. Finanzia fabbricati agroindustriali, impianti produttivi agricoli, reti irrigue, strutture zootecniche e miglioramenti fondiari.

| Campo | Valore |
|---|---|
| Tema | `TC02` — Economia e lavoro |
| DataRoom | ✅ |
| Funzione SOSE | Sviluppo rurale — filiere agroalimentari |
| Missioni DUP | `M14` · `M16` |
| Codici RSO | `RSO3.1` · `RSO3.2` |
| Fondi | `FEASR` |
| Funding gap | No |
| Cluster MCA | `C12` |
| Categorie MOP (14) | `C133` · `C136` · `C137` · `C138` · `C139` · `C142` · `C143` · `C144` · `C145` · `C148` · `C149` · `C151` · `C221` · `C223` *(2 nuove in v2)* |
| Q1 | Valore della produzione agricola locale (€/ha SAU) |
| Q2 | Vita utile residua degli impianti produttivi agricoli |
| Q3 | Costo annuo gestione impianti e manutenzione fondi |

#### `FAB-36` — Qualità, benessere e sostenibilità delle produzioni zootecniche

> Allevamenti con standard di benessere animale insufficienti rispetto alle normative europee. Finanzia adeguamento strutturale delle stalle e degli impianti zootecnici per il benessere animale.

| Campo | Valore |
|---|---|
| Tema | `TC02` — Economia e lavoro |
| DataRoom | ✅ |
| Funzione SOSE | Sviluppo rurale — filiera zootecnica |
| Missioni DUP | `M14` · `M16` |
| Codici RSO | `RSO3.2` |
| Fondi | `FEASR` |
| Funding gap | No |
| Cluster MCA | `C12` |
| Categorie MOP (2) | `C134` · `C152` |
| Q1 | Standard di benessere animale e qualità produzioni zootecniche |
| Q2 | Vita utile residua degli impianti zootecnici |
| Q3 | Costo annuo gestione allevamenti e controlli qualità |

#### `FAB-37` — Diversificazione economica e multifunzionalità delle imprese agricole *(greenfield)*

> Aziende agricole monoproduttive con scarsa diversificazione e vulnerabilità economica. Finanzia impianti per la diversificazione delle attività aziendali, investimenti agro-climatico-ambientali e nuove filiere.

| Campo | Valore |
|---|---|
| Tema | `TC02` — Economia e lavoro |
| DataRoom | ✅ |
| Funzione SOSE | Sviluppo rurale — diversificazione |
| Missioni DUP | `M14` · `M16` |
| Codici RSO | `RSO3.2` |
| Fondi | `FEASR` |
| Funding gap | No |
| Cluster MCA | `C12` |
| Categorie MOP (2) | `C132` · `C141` |
| Q1 | Quota di reddito agricolo da attività non tradizionali (%) |
| Q2 | *null — fabbisogno greenfield, nessun asset preesistente* |
| Q3 | Costo annuo gestione attività diversificate |

#### `FAB-39` — Infrastrutture e filiera della pesca professionale e acquacoltura

> Settore della pesca e dell'acquacoltura con infrastrutture produttive inadeguate. Finanzia impianti di acquacoltura, strutture per la trasformazione e commercializzazione del pescato e attrezzature per la pesca professionale.

| Campo | Valore |
|---|---|
| Tema | `TC02` — Economia e lavoro |
| DataRoom | ✅ |
| Funzione SOSE | Sviluppo della pesca e dell'acquacoltura |
| Missioni DUP | `M14` · `M16` |
| Codici RSO | `RSO3.1` |
| Fondi | `FEAMPA` · `FEASR` |
| Funding gap | No |
| Cluster MCA | `C12` |
| Categorie MOP (6) | `C052` · `C120` · `C121` · `C122` · `C123` · `C224` *(1 nuove in v2)* |
| Q1 | Valore sbarcato e produzione acquacoltura (€/anno) |
| Q2 | Vita utile residua delle infrastrutture ittiche |
| Q3 | Costo annuo gestione porti pesca e impianti |

#### `FAB-40` — Vitalità commerciale, servizi di prossimità e accesso al cibo

> Tessuto commerciale locale in declino con desertificazione dei servizi di prossimità e accesso al cibo. Finanzia centri commerciali di prossimità, mercati, strutture per l'annona e servizi commerciali di vicinato.

| Campo | Valore |
|---|---|
| Tema | `TC02` — Economia e lavoro |
| DataRoom | ✅ |
| Funzione SOSE | Commercio locale e servizi di prossimità |
| Missioni DUP | `M14` |
| Codici RSO | `RSO1.3` |
| Fondi | `FESR` · `MUN` |
| Funding gap | ⚠ Sì — copertura AP assente o marginale |
| Cluster MCA | `C12` |
| Categorie MOP (4) | `C170` · `C172` · `C174` · `C244` *(1 nuove in v2)* |
| Q1 | Dotazione di servizi commerciali di prossimità (esercizi per 1000 ab) |
| Q2 | Vita utile residua delle strutture commerciali |
| Q3 | Costo annuo gestione mercati e strutture commerciali |

#### `FAB-57` — Sostegno all'occupazione e al reinserimento lavorativo *(greenfield)*

> Disoccupazione, inattività e difficoltà di reinserimento lavorativo che riducono la partecipazione al mercato del lavoro. Finanzia incentivi all'occupazione, borse lavoro, percorsi formativi per il reinserimento, contributi per il lavoro autonomo e sostegni all'uscita dal mercato.

| Campo | Valore |
|---|---|
| Tema | `TC02` — Economia e lavoro |
| DataRoom | ✅ |
| Funzione SOSE | Politiche attive del lavoro |
| Missioni DUP | `M15` |
| Codici RSO | `RSO4.1` |
| Fondi | `FSE+` |
| Funding gap | No |
| Cluster MCA | `NONE` |
| Categorie MOP (34) | `C115` · `C116` · `C117` · `C118` · `C256` · `C257` · `C258` · `C259` · `C260` · `C261` · `C262` · `C263` · `C264` · `C265` · `C266` · `C267` · `C268` · `C269` · `C270` · `C271` · `C272` · `C273` · `C274` · `C275` · `C276` · `C277` · `C278` · `C279` · `C280` · `C281` · `C282` · `C283` · `C284` · `C285` *(30 nuove in v2)* |
| Q1 | Tasso di disoccupazione locale (%, focus NEET 15-29) |
| Q2 | *null — fabbisogno greenfield, nessun asset preesistente* |
| Q3 | Costo annuo programmi di attivazione e incentivi al lavoro |

### TC03 — Istruzione e formazione

_✅ DataRoom attiva · 6 fabbisogni_

| Codice | Label | Cluster | Categorie | Gap |
|---|---|---|---|---|
| `FAB-51` | Offerta insufficiente di posti nido per la prima infanzia (0-3 anni) | `C03` | 4 |  |
| `FAB-52` | Offerta insufficiente di posti scuola dell'infanzia (3-6 anni) | `C03` | 2 |  |
| `FAB-53` | Capacità insufficiente dell'offerta scolastica: mancano posti (6-18 anni) ✧ | `C03` | 1 |  |
| `FAB-54` | Qualità, sicurezza e conformità degli edifici scolastici esistenti | `C03` | 3 (+1) |  |
| `FAB-55` | Offerta formativa universitaria e terziaria | `C03` | 2 (+1) | ⚠ |
| `FAB-56` | Formazione professionale e aggiornamento delle competenze | `C03` | 24 (+22) |  |

*✧ Need greenfield (q2\_label = null)*

#### `FAB-51` — Offerta insufficiente di posti nido per la prima infanzia (0-3 anni)

> Offerta di posti nido pubblica insufficiente rispetto alla domanda delle famiglie con bambini 0-3 anni. Finanzia nuovi asili nido, ristrutturazione di strutture esistenti e servizi per l'infanzia complementari.

| Campo | Valore |
|---|---|
| Tema | `TC03` — Istruzione e formazione |
| DataRoom | ✅ |
| Funzione SOSE | Servizi educativi prima infanzia |
| Missioni DUP | `M04` |
| Codici RSO | `RSO4.3` |
| Fondi | `FSE+` · `FESR` · `PNRR` · `FNA` |
| Funding gap | No |
| Cluster MCA | `C03` |
| Categorie MOP (4) | `C106` · `C119` · `CM01` · `CM02` |
| Q1 | Tasso di copertura posti nido (% bambini 0-3 su posti disponibili) |
| Q2 | Vita utile residua della struttura nido |
| Q3 | Costo annuo gestione per posto nido (costo/bambino/anno) |

#### `FAB-52` — Offerta insufficiente di posti scuola dell'infanzia (3-6 anni)

> Carenza di posti nella scuola dell'infanzia (3-6 anni) che non copre il fabbisogno territoriale. Finanzia scuole materne, ampliamenti e servizi integrativi per la prima infanzia.

| Campo | Valore |
|---|---|
| Tema | `TC03` — Istruzione e formazione |
| DataRoom | ✅ |
| Funzione SOSE | Servizi educativi scuola dell'infanzia |
| Missioni DUP | `M04` |
| Codici RSO | `RSO4.3` |
| Fondi | `FSE+` · `FESR` |
| Funding gap | No |
| Cluster MCA | `C03` |
| Categorie MOP (2) | `C109` · `C119` |
| Q1 | Tasso di copertura scuola infanzia (% bambini 3-6 su posti) |
| Q2 | Vita utile residua dell'edificio scolastico |
| Q3 | Costo annuo gestione per posto scuola infanzia |

#### `FAB-53` — Capacità insufficiente dell'offerta scolastica: mancano posti (6-18 anni) *(greenfield)*

> Capacità scolastica (6-18 anni) insufficiente rispetto alla popolazione scolastica del territorio. Finanzia nuovi edifici scolastici per la scuola primaria e secondaria, con priorità alle aree in crescita demografica.

| Campo | Valore |
|---|---|
| Tema | `TC03` — Istruzione e formazione |
| DataRoom | ✅ |
| Funzione SOSE | Edilizia scolastica — capienza |
| Missioni DUP | `M04` |
| Codici RSO | `RSO4.3` |
| Fondi | `FESR` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C03` |
| Categorie MOP (1) | `C108` |
| Q1 | Tasso di sovraffollamento scolastico (alunni/aula vs standard) |
| Q2 | *null — fabbisogno greenfield, nessun asset preesistente* |
| Q3 | Costo annuo gestione nuovi spazi scolastici |

#### `FAB-54` — Qualità, sicurezza e conformità degli edifici scolastici esistenti

> Edifici scolastici esistenti non conformi agli standard di sicurezza, accessibilità o qualità ambientale. Finanzia messa in sicurezza, adeguamento sismico, riqualificazione energetica e adeguamento normativo degli edifici scolastici.

| Campo | Valore |
|---|---|
| Tema | `TC03` — Istruzione e formazione |
| DataRoom | ✅ |
| Funzione SOSE | Edilizia scolastica — qualità e messa a norma |
| Missioni DUP | `M04` |
| Codici RSO | `RSO4.3` |
| Fondi | `FESR` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C03` |
| Categorie MOP (3) | `C108` · `C109` · `C209` *(1 nuove in v2)* |
| Q1 | Percentuale di edifici scolastici non conformi agli standard (%) |
| Q2 | Vita utile residua dell'edificio scolastico esistente |
| Q3 | Costo annuo manutenzione ordinaria e straordinaria scuole |

#### `FAB-55` — Offerta formativa universitaria e terziaria

> Offerta universitaria e di formazione terziaria assente o insufficiente nel territorio. Finanzia università, istituti di istruzione superiore e progetti di mobilità internazionale per studenti.

| Campo | Valore |
|---|---|
| Tema | `TC03` — Istruzione e formazione |
| DataRoom | ✅ |
| Funzione SOSE | Formazione universitaria e alta formazione |
| Missioni DUP | `M04` · `M15` |
| Codici RSO | `RSO4.3` |
| Fondi | `FESR` · `MUR` |
| Funding gap | ⚠ Sì — copertura AP assente o marginale |
| Cluster MCA | `C03` |
| Categorie MOP (2) | `C110` · `C255` *(1 nuove in v2)* |
| Q1 | Tasso di accesso all'istruzione terziaria nella fascia 18-24 anni |
| Q2 | Vita utile residua delle strutture universitarie |
| Q3 | Costo annuo gestione strutture accademiche |

#### `FAB-56` — Formazione professionale e aggiornamento delle competenze

> Competenze professionali della popolazione attiva non allineate alle esigenze del mercato del lavoro. Finanzia formazione professionale, aggiornamento delle competenze, IFTS, apprendistato, orientamento e percorsi integrati scuola-lavoro.

| Campo | Valore |
|---|---|
| Tema | `TC03` — Istruzione e formazione |
| DataRoom | ✅ |
| Funzione SOSE | Formazione per il lavoro e long-life learning |
| Missioni DUP | `M04` · `M15` |
| Codici RSO | `RSO4.1` · `RSO4.3` |
| Fondi | `FSE+` |
| Funding gap | No |
| Cluster MCA | `C03` |
| Categorie MOP (24) | `C116` · `C118` · `C250` · `C251` · `C252` · `C253` · `C254` · `C256` · `C257` · `C258` · `C259` · `C260` · `C261` · `C262` · `C263` · `C264` · `C265` · `C266` · `C267` · `C268` · `C269` · `C270` · `C271` · `C272` *(22 nuove in v2)* |
| Q1 | Tasso di partecipazione ad attività formative (adulti 25-64 %) |
| Q2 | Vita utile residua delle strutture formative |
| Q3 | Costo annuo erogazione corsi e voucher formativi |

### TC04 — Welfare e inclusione

_✅ DataRoom attiva · 6 fabbisogni_

| Codice | Label | Cluster | Categorie | Gap |
|---|---|---|---|---|
| `FAB-42` | Ecosistema per l'impresa sociale e l'economia civile | `C04` | 1 |  |
| `FAB-43` | Disagio abitativo e carenza di edilizia residenziale pubblica | `C05` | 6 |  |
| `FAB-44` | Inclusione sociale e servizi per persone in situazione di vulnerabilità | `C04` | 8 (+3) |  |
| `FAB-45` | Aggregazione sociale, coesione e servizi di prossimità per la comunità | `C04` | 4 (+1) |  |
| `FAB-47` | Autonomia e vita indipendente per persone con disabilità ✧ | `NONE` | 2 |  |
| `FAB-48` | Protezione, tutela e supporto ai minori e alle famiglie ✧ | `NONE` | 1 |  |

*✧ Need greenfield (q2\_label = null)*

#### `FAB-42` — Ecosistema per l'impresa sociale e l'economia civile

> Scarso sviluppo dell'economia civile e dell'impresa sociale nel territorio. Finanzia spazi e strutture per le attività di impresa sociale e per l'economia solidale.

| Campo | Valore |
|---|---|
| Tema | `TC04` — Welfare e inclusione |
| DataRoom | ✅ |
| Funzione SOSE | Terzo settore e imprenditorialità sociale |
| Missioni DUP | `M12` |
| Codici RSO | `RSO4.4` |
| Fondi | `FESR` · `FSE+` |
| Funding gap | No |
| Cluster MCA | `C04` |
| Categorie MOP (1) | `C127` |
| Q1 | Presenza e capacità del terzo settore locale (organizzazioni per 1000 ab) |
| Q2 | Vita utile residua degli spazi per impresa sociale |
| Q3 | Costo annuo gestione spazi e programmi |

#### `FAB-43` — Disagio abitativo e carenza di edilizia residenziale pubblica

> Famiglie in situazione di disagio abitativo o carenza di edilizia residenziale pubblica adeguata. Finanzia edilizia residenziale pubblica (ERP), recupero di fabbricati residenziali, housing sociale e alloggi di emergenza.

| Campo | Valore |
|---|---|
| Tema | `TC04` — Welfare e inclusione |
| DataRoom | ✅ |
| Funzione SOSE | Edilizia residenziale pubblica |
| Missioni DUP | `M08` · `M12` |
| Codici RSO | `RSO5.1` |
| Fondi | `FESR` · `FC` |
| Funding gap | No |
| Cluster MCA | `C05` |
| Categorie MOP (6) | `C076` · `C077` · `C078` · `C079` · `C080` · `C090` |
| Q1 | Lista d'attesa ERP / famiglie in disagio abitativo (n) |
| Q2 | Vita utile residua del patrimonio ERP esistente |
| Q3 | Costo annuo gestione patrimonio ERP |

#### `FAB-44` — Inclusione sociale e servizi per persone in situazione di vulnerabilità

> Persone in situazione di vulnerabilità (disabilità, povertà, fragilità) prive di servizi sociali adeguati. Finanzia strutture sociali, centri diurni, servizi di assistenza alla persona, strutture per la disabilità e l'inclusione.

| Campo | Valore |
|---|---|
| Tema | `TC04` — Welfare e inclusione |
| DataRoom | ✅ |
| Funzione SOSE | Inclusione sociale e contrasto alla povertà |
| Missioni DUP | `M12` |
| Codici RSO | `RSO4.4` |
| Fondi | `FESR` · `FSE+` |
| Funding gap | No |
| Cluster MCA | `C04` |
| Categorie MOP (8) | `C081` · `C093` · `C107` · `C127` · `C189` · `C210` · `C248` · `C249` *(3 nuove in v2)* |
| Q1 | Tasso di povertà relativa e assoluta nel territorio (%) |
| Q2 | Vita utile residua delle strutture per l'inclusione |
| Q3 | Costo annuo erogazione servizi e gestione strutture |

#### `FAB-45` — Aggregazione sociale, coesione e servizi di prossimità per la comunità

> Deficit di spazi e servizi per l'aggregazione sociale, la coesione comunitaria e i servizi di prossimità. Finanzia centri culturali e sociali, impianti sportivi di prossimità, centri civici e servizi alla comunità.

| Campo | Valore |
|---|---|
| Tema | `TC04` — Welfare e inclusione |
| DataRoom | ✅ |
| Funzione SOSE | Coesione sociale e welfare di comunità |
| Missioni DUP | `M12` |
| Codici RSO | `RSO4.4` |
| Fondi | `FESR` · `MUN` |
| Funding gap | No |
| Cluster MCA | `C04` |
| Categorie MOP (4) | `C107` · `C111` · `C188` · `C248` *(1 nuove in v2)* |
| Q1 | Dotazione di spazi di aggregazione (strutture per 1000 ab) |
| Q2 | Vita utile residua delle strutture di aggregazione |
| Q3 | Costo annuo gestione centri di comunità |

#### `FAB-47` — Autonomia e vita indipendente per persone con disabilità *(greenfield)*

> Persone con disabilità che non dispongono di supporti adeguati per la vita indipendente. Nessuna categoria MOP diretta — intervento realizzato prevalentemente attraverso servizi mediati e contributi diretti alle persone.

| Campo | Valore |
|---|---|
| Tema | `TC04` — Welfare e inclusione |
| DataRoom | ✅ |
| Funzione SOSE | Inclusione e autonomia delle persone con disabilità |
| Missioni DUP | `M12` |
| Codici RSO | `RSO4.4` |
| Fondi | `FSE+` · `MUN` |
| Funding gap | No |
| Cluster MCA | `NONE` |
| Categorie MOP (2) | `CM05` · `CM08` |
| Q1 | Percentuale di persone con disabilità con piano di vita indipendente |
| Q2 | *null — fabbisogno greenfield, nessun asset preesistente* |
| Q3 | Costo annuo programmi di vita indipendente e ausili |

#### `FAB-48` — Protezione, tutela e supporto ai minori e alle famiglie *(greenfield)*

> Minori e famiglie in condizione di fragilità che necessitano di protezione e supporto istituzionale. Finanzia servizi di assistenza sociale alla persona e strutture per l'accoglienza e il supporto ai minori.

| Campo | Valore |
|---|---|
| Tema | `TC04` — Welfare e inclusione |
| DataRoom | ✅ |
| Funzione SOSE | Tutela dei minori e politiche familiari |
| Missioni DUP | `M12` |
| Codici RSO | `RSO4.4` |
| Fondi | `FSE+` |
| Funding gap | No |
| Cluster MCA | `NONE` |
| Categorie MOP (1) | `C189` |
| Q1 | Numero di minori in carico ai servizi sociali e in condizione di rischio |
| Q2 | *null — fabbisogno greenfield, nessun asset preesistente* |
| Q3 | Costo annuo erogazione servizi tutela minori e supporto famiglie |

### TC05 — Salute e sanità

_✅ DataRoom attiva · 3 fabbisogni_

| Codice | Label | Cluster | Categorie | Gap |
|---|---|---|---|---|
| `FAB-46` | Assistenza alla non autosufficienza e cura degli anziani | `C04` | 3 (+1) |  |
| `FAB-49` | Accessibilità ai servizi sanitari di prossimità | `C04` | 4 |  |
| `FAB-50` | Prevenzione collettiva, igiene e salute pubblica | `C04` | 1 |  |

*✧ Need greenfield (q2\_label = null)*

#### `FAB-46` — Assistenza alla non autosufficienza e cura degli anziani

> Crescente domanda di assistenza per anziani non autosufficienti non soddisfatta dall'offerta pubblica. Finanzia residenze sanitarie assistenziali, strutture di assistenza domiciliare e servizi integrati per la non autosufficienza.

| Campo | Valore |
|---|---|
| Tema | `TC05` — Salute e sanità |
| DataRoom | ✅ |
| Funzione SOSE | Servizi sociosanitari per anziani non autosufficienti |
| Missioni DUP | `M12` · `M13` |
| Codici RSO | `RSO4.4` · `RSO4.5` |
| Fondi | `FESR` · `FSE+` · `FNA` |
| Funding gap | No |
| Cluster MCA | `C04` |
| Categorie MOP (3) | `C104` · `C189` · `C249` *(1 nuove in v2)* |
| Q1 | Indice di non autosufficienza e lista attesa RSA |
| Q2 | Vita utile residua delle strutture residenziali |
| Q3 | Costo annuo gestione RSA e SAD (costo per assistito) |

#### `FAB-49` — Accessibilità ai servizi sanitari di prossimità

> Scarsa accessibilità ai servizi sanitari di base, con presidio territoriale insufficiente. Finanzia strutture ospedaliere, presidi sanitari territoriali, poliambulatori e strutture per l'igiene e la profilassi.

| Campo | Valore |
|---|---|
| Tema | `TC05` — Salute e sanità |
| DataRoom | ✅ |
| Funzione SOSE | Medicina territoriale e presidi sanitari locali |
| Missioni DUP | `M13` |
| Codici RSO | `RSO4.5` |
| Fondi | `FESR` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C04` |
| Categorie MOP (4) | `C101` · `C102` · `C103` · `C105` |
| Q1 | Distanza media dal presidio sanitario più vicino (minuti) |
| Q2 | Vita utile residua delle strutture sanitarie |
| Q3 | Costo annuo gestione presidi e attrezzature |

#### `FAB-50` — Prevenzione collettiva, igiene e salute pubblica

> Prevenzione collettiva e igiene pubblica inadeguate rispetto ai rischi sanitari del territorio. Finanzia strutture per l'igiene pubblica, la profilassi e la tutela della salute collettiva.

| Campo | Valore |
|---|---|
| Tema | `TC05` — Salute e sanità |
| DataRoom | ✅ |
| Funzione SOSE | Prevenzione e sanità pubblica |
| Missioni DUP | `M13` |
| Codici RSO | `RSO4.5` |
| Fondi | `FESR` · `FSE+` |
| Funding gap | No |
| Cluster MCA | `C04` |
| Categorie MOP (1) | `C102` |
| Q1 | Tasso di copertura vaccinale e adesione programmi screening |
| Q2 | Vita utile residua delle strutture di prevenzione |
| Q3 | Costo annuo programmi di prevenzione e screening |

### TC06 — Ambiente e territorio

_✅ DataRoom attiva · 12 fabbisogni_

| Codice | Label | Cluster | Categorie | Gap |
|---|---|---|---|---|
| `FAB-01` | Sicurezza idrogeologica e difesa del suolo | `C07` | 9 |  |
| `FAB-02` | Adeguamento sismico di edifici pubblici che erogano servizi | `C07` | 9 |  |
| `FAB-03` | Ricostruzione post-calamità e resilienza del territorio | `C07` | 3 |  |
| `FAB-04` | Bonifica e decontaminazione di siti inquinati | `C08` | 5 (+1) |  |
| `FAB-05` | Qualità ecologica, fruizione e monitoraggio dei corpi idrici | `C08` | 6 |  |
| `FAB-06` | Approvvigionamento e distribuzione idrica potabile | `C08` | 9 (+4) |  |
| `FAB-07` | Depurazione acque reflue e ciclo fognario | `C08` | 4 |  |
| `FAB-10` | Gestione, trattamento e smaltimento dei rifiuti urbani | `C08` | 6 (+2) |  |
| `FAB-11` | Tutela della biodiversità, aree protette e fruizione del patrimonio naturale | `C09` | 8 (+3) |  |
| `FAB-12` | Verde urbano e infrastrutture verdi | `C09` | 2 (+1) |  |
| `FAB-13` | Gestione e presidio del patrimonio forestale | `C12` | 8 (+1) |  |
| `FAB-38` | Presidio e gestione sostenibile del territorio agro-forestale ✧ | `C12` | 7 (+2) |  |

*✧ Need greenfield (q2\_label = null)*

#### `FAB-01` — Sicurezza idrogeologica e difesa del suolo

> Rischio idrogeologico e sismico che minaccia la sicurezza di persone, edifici e infrastrutture. Finanzia consolidamento di abitati a rischio frana, sistemazione di corsi d'acqua e regimazione idraulica, opere di difesa del suolo e rimboschimenti protettivi.

| Campo | Valore |
|---|---|
| Tema | `TC06` — Ambiente e territorio |
| DataRoom | ✅ |
| Funzione SOSE | Difesa del suolo e protezione civile |
| Missioni DUP | `M09` · `M11` |
| Codici RSO | `RSO2.4` · `RSO2.5` |
| Fondi | `FESR` · `FC` · `FNDC` |
| Funding gap | No |
| Cluster MCA | `C07` |
| Categorie MOP (9) | `C001` · `C002` · `C004` · `C005` · `C006` · `C007` · `C008` · `C011` · `C027` |
| Q1 | Livello di rischio idrogeologico/sismico nel territorio |
| Q2 | Vita utile residua delle opere di difesa esistenti |
| Q3 | Costo annuo manutenzione opere di difesa e monitoraggio |

#### `FAB-02` — Adeguamento sismico di edifici pubblici che erogano servizi

> Edifici pubblici che erogano servizi essenziali (scuole, ospedali, uffici) privi di adeguamento sismico secondo le normative vigenti. Finanzia interventi strutturali antisismici su edifici scolastici, sanitari, amministrativi e impianti sportivi.

| Campo | Valore |
|---|---|
| Tema | `TC06` — Ambiente e territorio |
| DataRoom | ✅ |
| Funzione SOSE | Difesa del suolo e protezione civile |
| Missioni DUP | `M09` · `M11` |
| Codici RSO | `RSO2.5` |
| Fondi | `FESR` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C07` |
| Categorie MOP (9) | `C008` · `C095` · `C096` · `C105` · `C106` · `C108` · `C109` · `C110` · `C112` |
| Q1 | Classe di rischio sismico dell'edificio (NTC2018) |
| Q2 | Vita utile residua ante-adeguamento (anni stimati) |
| Q3 | Costo annuo gestione e manutenzione dell'edificio |

#### `FAB-03` — Ricostruzione post-calamità e resilienza del territorio

> Danni a edifici, infrastrutture e territorio causati da eventi calamitosi (sisma, alluvione, frana). Finanzia ripristino di fabbricati danneggiati, ricostruzione di beni culturali colpiti e potenziamento delle infrastrutture di protezione civile.

| Campo | Valore |
|---|---|
| Tema | `TC06` — Ambiente e territorio |
| DataRoom | ✅ |
| Funzione SOSE | Protezione civile post-emergenza |
| Missioni DUP | `M09` · `M11` |
| Codici RSO | `RSO2.5` |
| Fondi | `FESR` · `FC` · `FSC` |
| Funding gap | No |
| Cluster MCA | `C07` |
| Categorie MOP (3) | `C078` · `C092` · `C100` |
| Q1 | Entità del danno subito dalla calamità (% patrimonio) |
| Q2 | Vita utile residua delle strutture danneggiate |
| Q3 | Costo annuo gestione strutture provvisorie o danneggiate |

#### `FAB-04` — Bonifica e decontaminazione di siti inquinati

> Presenza di suoli, acque sotterranee o aree industriali dismesse contaminate da sostanze inquinanti. Finanzia bonifica di siti contaminati, decontaminazione di aree dismesse, sistemazione di terreni e impianti per il trattamento di rifiuti speciali.

| Campo | Valore |
|---|---|
| Tema | `TC06` — Ambiente e territorio |
| DataRoom | ✅ |
| Funzione SOSE | Tutela dell'ambiente e gestione siti contaminati |
| Missioni DUP | `M09` |
| Codici RSO | `RSO2.6` |
| Fondi | `FESR` · `FC` |
| Funding gap | No |
| Cluster MCA | `C08` |
| Categorie MOP (5) | `C003` · `C014` · `C016` · `C069` · `C199` *(1 nuove in v2)* |
| Q1 | Livello e natura della contaminazione (classe APAT) |
| Q2 | Vita utile residua del sito ante-bonifica |
| Q3 | Costo annuo monitoraggio e gestione del sito inquinato |

#### `FAB-05` — Qualità ecologica, fruizione e monitoraggio dei corpi idrici

> Corpi idrici (fiumi, laghi, bacini) in cattivo stato ecologico o non monitorati adeguatamente. Finanzia miglioramento della qualità dei corpi idrici, sistemi di monitoraggio ambientale, infrastrutture fluviali e impianti idroelettrici integrati.

| Campo | Valore |
|---|---|
| Tema | `TC06` — Ambiente e territorio |
| DataRoom | ✅ |
| Funzione SOSE | Tutela delle acque e gestione del rischio idrico |
| Missioni DUP | `M09` |
| Codici RSO | `RSO2.3` · `RSO2.7` |
| Fondi | `FESR` · `FC` |
| Funding gap | No |
| Cluster MCA | `C08` |
| Categorie MOP (6) | `C004` · `C011` · `C017` · `C041` · `C050` · `C176` |
| Q1 | Stato ecologico del corpo idrico (classe WFD 2000/60) |
| Q2 | Vita utile residua delle opere idrauliche esistenti |
| Q3 | Costo annuo monitoraggio e manutenzione del corpo idrico |

#### `FAB-06` — Approvvigionamento e distribuzione idrica potabile

> Carenza o inadeguatezza delle infrastrutture per l'approvvigionamento e la distribuzione di acqua potabile. Finanzia acquedotti, reti idriche urbane, dissalatori, serbatoi, impianti di sollevamento, dighe e bacini di accumulo.

| Campo | Valore |
|---|---|
| Tema | `TC06` — Ambiente e territorio |
| DataRoom | ✅ |
| Funzione SOSE | Ciclo integrato delle acque — approvvigionamento |
| Missioni DUP | `M09` |
| Codici RSO | `RSO2.3` |
| Fondi | `FESR` · `FC` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C08` |
| Categorie MOP (9) | `C017` · `C018` · `C026` · `C028` · `C032` · `C200` · `C201` · `C202` · `C204` *(4 nuove in v2)* |
| Q1 | Copertura attuale del servizio idrico (% popolazione) |
| Q2 | Vita utile residua della rete idrica |
| Q3 | Costo annuo gestione rete idrica e perdite |

#### `FAB-07` — Depurazione acque reflue e ciclo fognario

> Reti fognarie obsolete o impianti di depurazione insufficienti rispetto ai carichi civili e industriali. Finanzia reti fognarie, impianti di depurazione acque reflue, sistemi di stoccaggio e pre-trattamento acque, reti di collettamento pluviale.

| Campo | Valore |
|---|---|
| Tema | `TC06` — Ambiente e territorio |
| DataRoom | ✅ |
| Funzione SOSE | Ciclo integrato delle acque — depurazione |
| Missioni DUP | `M09` |
| Codici RSO | `RSO2.3` |
| Fondi | `FESR` · `FC` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C08` |
| Categorie MOP (4) | `C019` · `C020` · `C023` · `C027` |
| Q1 | Copertura rete fognaria e capacità depurativa (AE) |
| Q2 | Vita utile residua degli impianti di depurazione |
| Q3 | Costo annuo gestione depuratori e rete fognaria |

#### `FAB-10` — Gestione, trattamento e smaltimento dei rifiuti urbani

> Gestione insufficiente o non conforme dei rifiuti urbani, con bassa percentuale di raccolta differenziata. Finanzia impianti per il trattamento dei rifiuti urbani e speciali, sistemi di raccolta differenziata, impianti di compostaggio e smaltimento.

| Campo | Valore |
|---|---|
| Tema | `TC06` — Ambiente e territorio |
| DataRoom | ✅ |
| Funzione SOSE | Ciclo dei rifiuti urbani |
| Missioni DUP | `M09` |
| Codici RSO | `RSO2.2` |
| Fondi | `FESR` · `FC` |
| Funding gap | No |
| Cluster MCA | `C08` |
| Categorie MOP (6) | `C021` · `C022` · `C029` · `C030` · `C193` · `C194` *(2 nuove in v2)* |
| Q1 | Percentuale raccolta differenziata attuale (%) |
| Q2 | Vita utile residua degli impianti di trattamento |
| Q3 | Costo annuo gestione raccolta e smaltimento rifiuti |

#### `FAB-11` — Tutela della biodiversità, aree protette e fruizione del patrimonio naturale

> Perdita di biodiversità, degrado di ecosistemi naturali e scarsa accessibilità al patrimonio ambientale. Finanzia parchi e riserve naturali, infrastrutture verdi, siti naturali e rurali, sistemi di monitoraggio dell'inquinamento e strutture per la fruizione ambientale.

| Campo | Valore |
|---|---|
| Tema | `TC06` — Ambiente e territorio |
| DataRoom | ✅ |
| Funzione SOSE | Tutela della natura e fruizione ambientale |
| Missioni DUP | `M09` |
| Codici RSO | `RSO2.7` · `RSO2.8` |
| Fondi | `FESR` · `FC` |
| Funding gap | No |
| Cluster MCA | `C09` |
| Categorie MOP (8) | `C009` · `C010` · `C012` · `C013` · `C168` · `C195` · `C197` · `C198` *(3 nuove in v2)* |
| Q1 | Stato di conservazione delle aree naturali e dei siti |
| Q2 | Vita utile residua delle infrastrutture di fruizione |
| Q3 | Costo annuo gestione aree protette e sentieristica |

#### `FAB-12` — Verde urbano e infrastrutture verdi

> Carenza di verde urbano, aree verdi di qualità insufficiente o infrastrutture verdi assenti nel tessuto urbano. Finanzia parchi urbani, infrastrutture verdi, verde pubblico attrezzato e interventi per la riduzione dell'isola di calore.

| Campo | Valore |
|---|---|
| Tema | `TC06` — Ambiente e territorio |
| DataRoom | ✅ |
| Funzione SOSE | Verde pubblico urbano e periurbano |
| Missioni DUP | `M09` |
| Codici RSO | `RSO2.8` |
| Fondi | `FESR` · `MUN` |
| Funding gap | No |
| Cluster MCA | `C09` |
| Categorie MOP (2) | `C086` · `C196` *(1 nuove in v2)* |
| Q1 | Dotazione pro capite di verde urbano (mq/ab) |
| Q2 | Vita utile residua delle infrastrutture verdi |
| Q3 | Costo annuo manutenzione verde pubblico |

#### `FAB-13` — Gestione e presidio del patrimonio forestale

> Patrimonio forestale degradato, a rischio incendio o non gestito secondo criteri di sostenibilità. Finanzia forestazione produttiva, opere per la resilienza degli ecosistemi forestali, infrastrutture a servizio delle aziende forestali e vivai.

| Campo | Valore |
|---|---|
| Tema | `TC06` — Ambiente e territorio |
| DataRoom | ✅ |
| Funzione SOSE | Gestione forestale e silvicoltura |
| Missioni DUP | `M09` · `M16` |
| Codici RSO | `RSO2.9` · `RSO3.2` |
| Fondi | `FEASR` · `FESR` |
| Funding gap | No |
| Cluster MCA | `C12` |
| Categorie MOP (8) | `C005` · `C163` · `C164` · `C165` · `C166` · `C167` · `C169` · `C220` *(1 nuove in v2)* |
| Q1 | Stato del patrimonio forestale (ha, indice di gestione) |
| Q2 | Vita utile residua delle infrastrutture forestali |
| Q3 | Costo annuo gestione e presidio forestale |

#### `FAB-38` — Presidio e gestione sostenibile del territorio agro-forestale *(greenfield)*

> Territorio agro-forestale vulnerabile al dissesto, agli incendi e ai cambiamenti climatici per assenza di presidio. Finanzia investimenti per la resilienza forestale, compensazioni agro-climatico-ambientali e gestione sostenibile del territorio.

| Campo | Valore |
|---|---|
| Tema | `TC06` — Ambiente e territorio |
| DataRoom | ✅ |
| Funzione SOSE | Paesaggio rurale e gestione agro-ambientale |
| Missioni DUP | `M09` · `M16` |
| Codici RSO | `RSO2.9` · `RSO3.2` |
| Fondi | `FEASR` · `FESR` |
| Funding gap | No |
| Cluster MCA | `C12` |
| Categorie MOP (7) | `C135` · `C146` · `C147` · `C150` · `C162` · `C220` · `C222` *(2 nuove in v2)* |
| Q1 | Quota di SAU con gestione agro-ambientale (%) |
| Q2 | *null — fabbisogno greenfield, nessun asset preesistente* |
| Q3 | Costo annuo gestione accordi agro-ambientali |

### TC07 — Mobilità e trasporti

_✅ DataRoom attiva · 10 fabbisogni_

| Codice | Label | Cluster | Categorie | Gap |
|---|---|---|---|---|
| `FAB-20` | Sicurezza e qualità della rete stradale locale | `C01` | 5 |  |
| `FAB-21` | Accessibilità stradale in aree rurali e montane | `C01` | 2 |  |
| `FAB-22` | Accessibilità stradale sovralocale | `C01` | 2 | ⚠ |
| `FAB-23` | Mobilità ciclabile, pedonale e micro-mobilità sostenibile | `C01` | 2 |  |
| `FAB-24` | Accessibilità e mobilità in contesti specifici | `C01` | 2 |  |
| `FAB-25` | Trasporto pubblico locale e accessibilità urbana | `C01` | 6 (+1) |  |
| `FAB-26` | Infrastrutture di trasporto aereo | `C02` | 3 | ⚠ |
| `FAB-27` | Accessibilità ferroviaria e intermodalità | `C02` | 5 (+1) |  |
| `FAB-28` | Infrastrutture portuali, marittime e fluviali | `C02` | 3 |  |
| `FAB-30` | Accessibilità e fruizione del demanio marittimo e lacustre | `C02` | 2 |  |

*✧ Need greenfield (q2\_label = null)*

#### `FAB-20` — Sicurezza e qualità della rete stradale locale

> Rete stradale locale con deficit di sicurezza, manutenzione insufficiente o inadeguata agli standard. Finanzia strade comunali, piste ciclabili, interventi di messa in sicurezza e sistemi integrati di trasporto intelligente.

| Campo | Valore |
|---|---|
| Tema | `TC07` — Mobilità e trasporti |
| DataRoom | ✅ |
| Funzione SOSE | Viabilità locale e sicurezza stradale |
| Missioni DUP | `M10` |
| Codici RSO | `RSO3.3` |
| Fondi | `FESR` · `FC` · `MUN` |
| Funding gap | No |
| Cluster MCA | `C01` |
| Categorie MOP (5) | `C054` · `C057` · `C058` · `C065` · `C085` |
| Q1 | Stato di conservazione della rete stradale (IRI medio) |
| Q2 | Vita utile residua dell'infrastruttura stradale |
| Q3 | Costo annuo manutenzione ordinaria e straordinaria strade |

#### `FAB-21` — Accessibilità stradale in aree rurali e montane

> Aree rurali e montane con accessibilità stradale limitata che penalizza la mobilità e i servizi. Finanzia strade comunali e rurali con priorità alle aree a bassa accessibilità e ai centri isolati.

| Campo | Valore |
|---|---|
| Tema | `TC07` — Mobilità e trasporti |
| DataRoom | ✅ |
| Funzione SOSE | Viabilità rurale e montana |
| Missioni DUP | `M10` |
| Codici RSO | `RSO3.3` |
| Fondi | `FESR` · `FC` |
| Funding gap | No |
| Cluster MCA | `C01` |
| Categorie MOP (2) | `C057` · `C058` |
| Q1 | Grado di isolamento delle aree rurali/montane (min distanza servizi) |
| Q2 | Vita utile residua delle strade rurali |
| Q3 | Costo annuo manutenzione strade rurali e montane |

#### `FAB-22` — Accessibilità stradale sovralocale

> Connessione stradale con la rete sovralocale (provinciale, statale, autostradale) insufficiente. Finanzia strade regionali, provinciali e statali in accordo con enti sovraordinati, e strade vicinali interpoderali.

| Campo | Valore |
|---|---|
| Tema | `TC07` — Mobilità e trasporti |
| DataRoom | ✅ |
| Funzione SOSE | Infrastrutture stradali sovralocali |
| Missioni DUP | `M10` |
| Codici RSO | `RSO3.1` |
| Fondi | `FESR` · `FC` |
| Funding gap | ⚠ Sì — copertura AP assente o marginale |
| Cluster MCA | `C01` |
| Categorie MOP (2) | `C055` · `C059` |
| Q1 | Accessibilità sovralocale del territorio (minuti dai principali nodi) |
| Q2 | Vita utile residua dell'infrastruttura |
| Q3 | Costo annuo manutenzione e gestione |

#### `FAB-23` — Mobilità ciclabile, pedonale e micro-mobilità sostenibile

> Assenza o inadeguatezza di infrastrutture per la mobilità attiva (ciclabile, pedonale) nel territorio. Finanzia piste ciclabili, percorsi pedonali protetti e infrastrutture per la micro-mobilità sostenibile.

| Campo | Valore |
|---|---|
| Tema | `TC07` — Mobilità e trasporti |
| DataRoom | ✅ |
| Funzione SOSE | Mobilità attiva e sostenibile |
| Missioni DUP | `M10` |
| Codici RSO | `RSO2.8` · `RSO3.2` |
| Fondi | `FESR` · `FC` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C01` |
| Categorie MOP (2) | `C056` · `C066` |
| Q1 | Estensione rete ciclopedonale esistente (km per 1000 ab) |
| Q2 | Vita utile residua delle infrastrutture ciclopedonali |
| Q3 | Costo annuo manutenzione percorsi e sistemi sharing |

#### `FAB-24` — Accessibilità e mobilità in contesti specifici

> Difficoltà di accesso e mobilità in contesti specifici: aree montane, isole, siti turistici o produttivi non raggiunti dal trasporto ordinario. Finanzia funivie, seggiovie, funicolari e sistemi di trasporto intelligente per contesti specifici.

| Campo | Valore |
|---|---|
| Tema | `TC07` — Mobilità e trasporti |
| DataRoom | ✅ |
| Funzione SOSE | Mobilità in contesti montani, insulari e urbani complessi |
| Missioni DUP | `M10` |
| Codici RSO | `RSO3.2` |
| Fondi | `FESR` · `FC` |
| Funding gap | No |
| Cluster MCA | `C01` |
| Categorie MOP (2) | `C060` · `C061` |
| Q1 | Grado di accessibilità delle aree servite |
| Q2 | Vita utile residua degli impianti di risalita o mobilità |
| Q3 | Costo annuo gestione impianti e servizi di mobilità speciale |

#### `FAB-25` — Trasporto pubblico locale e accessibilità urbana

> Offerta di trasporto pubblico locale insufficiente, con bassa frequenza o copertura territoriale inadeguata. Finanzia infrastrutture per il TPL urbano, sistemi di parcheggio e interscambio modale, mobilità sostenibile integrata.

| Campo | Valore |
|---|---|
| Tema | `TC07` — Mobilità e trasporti |
| DataRoom | ✅ |
| Funzione SOSE | TPL e mobilità collettiva |
| Missioni DUP | `M10` |
| Codici RSO | `RSO3.2` |
| Fondi | `FESR` · `FC` |
| Funding gap | No |
| Cluster MCA | `C01` |
| Categorie MOP (6) | `C063` · `C064` · `C065` · `C066` · `C074` · `C192` *(1 nuove in v2)* |
| Q1 | Livello di copertura e frequenza del TPL (abitanti serviti %) |
| Q2 | Vita utile residua delle infrastrutture TPL |
| Q3 | Costo annuo gestione infrastrutture e contributo al servizio |

#### `FAB-26` — Infrastrutture di trasporto aereo

> Infrastrutture aeroportuali (aeroporti minori, aviosuperfici) inadeguate o sottodotate rispetto alla domanda. Finanzia piste, aerostazioni e strutture ausiliarie aeroportuali.

| Campo | Valore |
|---|---|
| Tema | `TC07` — Mobilità e trasporti |
| DataRoom | ✅ |
| Funzione SOSE | Accessibilità aerea del territorio |
| Missioni DUP | `M10` |
| Codici RSO | `RSO3.1` |
| Fondi | `FESR` · `FC` |
| Funding gap | ⚠ Sì — copertura AP assente o marginale |
| Cluster MCA | `C02` |
| Categorie MOP (3) | `C043` · `C044` · `C045` |
| Q1 | Accessibilità aerea del territorio (frequenze e destinazioni) |
| Q2 | Vita utile residua delle infrastrutture aeroportuali |
| Q3 | Costo annuo manutenzione e gestione aeroporto |

#### `FAB-27` — Accessibilità ferroviaria e intermodalità

> Accessibilità ferroviaria del territorio limitata, con stazioni degradate o connessioni intermodali assenti. Finanzia stazioni ferroviarie, linee ferroviarie, infrastrutture per l'intermodalità e veicoli ferroviari.

| Campo | Valore |
|---|---|
| Tema | `TC07` — Mobilità e trasporti |
| DataRoom | ✅ |
| Funzione SOSE | Infrastrutture ferroviarie e nodi intermodali |
| Missioni DUP | `M10` |
| Codici RSO | `RSO3.1` · `RSO3.2` |
| Fondi | `FESR` · `FC` |
| Funding gap | No |
| Cluster MCA | `C02` |
| Categorie MOP (5) | `C046` · `C047` · `C048` · `C062` · `C191` *(1 nuove in v2)* |
| Q1 | Connettività ferroviaria del territorio (treni/giorno su linee principali) |
| Q2 | Vita utile residua delle infrastrutture |
| Q3 | Costo annuo manutenzione e gestione stazione |

#### `FAB-28` — Infrastrutture portuali, marittime e fluviali

> Infrastrutture portuali, marittime o fluviali insufficienti rispetto alle esigenze di mobilità e logistica. Finanzia porti commerciali, turistici e per la pesca, idrovie e strutture fluviali.

| Campo | Valore |
|---|---|
| Tema | `TC07` — Mobilità e trasporti |
| DataRoom | ✅ |
| Funzione SOSE | Infrastrutture portuali e vie d'acqua |
| Missioni DUP | `M10` |
| Codici RSO | `RSO3.1` |
| Fondi | `FESR` · `FC` |
| Funding gap | No |
| Cluster MCA | `C02` |
| Categorie MOP (3) | `C049` · `C050` · `C051` |
| Q1 | Capacità portuale e stato delle infrastrutture |
| Q2 | Vita utile residua delle infrastrutture portuali |
| Q3 | Costo annuo manutenzione e dragaggio |

#### `FAB-30` — Accessibilità e fruizione del demanio marittimo e lacustre

> Demanio marittimo e lacustre con accesso limitato o infrastrutture di fruizione inadeguate. Finanzia strutture portuali per il turismo e la pesca e infrastrutture per la difesa e valorizzazione costiera.

| Campo | Valore |
|---|---|
| Tema | `TC07` — Mobilità e trasporti |
| DataRoom | ✅ |
| Funzione SOSE | Demanio marittimo e turismo costiero |
| Missioni DUP | `M10` |
| Codici RSO | `RSO5.1` |
| Fondi | `FESR` · `FC` |
| Funding gap | No |
| Cluster MCA | `C02` |
| Categorie MOP (2) | `C007` · `C053` |
| Q1 | Qualità e accessibilità delle spiagge e del waterfront |
| Q2 | Vita utile residua delle strutture costiere |
| Q3 | Costo annuo manutenzione arenili e strutture balneari |

### TC08 — Patrimonio pubblico

_⏳ DataRoom differita · 3 fabbisogni_

| Codice | Label | Cluster | Categorie | Gap |
|---|---|---|---|---|
| `FAB-18` | Rigenerazione urbana e riqualificazione di aree degradate | `C09` | 4 |  |
| `FAB-59` | Qualità degli spazi pubblici urbani, arredo e servizi civici | `C09` | 4 |  |
| `FAB-60` | Sicurezza urbana, ordine pubblico e controllo del territorio | `C13` | 9 (+4) | ⚠ |

*✧ Need greenfield (q2\_label = null)*

#### `FAB-18` — Rigenerazione urbana e riqualificazione di aree degradate

> Aree urbane degradate con tessuto edilizio obsoleto, spazi pubblici deteriorati e bassa qualità dell'abitare. Finanzia rigenerazione urbana, recupero di aree dismesse, riqualificazione del patrimonio residenziale e rivitalizzazione dei centri storici.

| Campo | Valore |
|---|---|
| Tema | `TC08` — Patrimonio pubblico |
| DataRoom | ⏳ |
| Funzione SOSE | Rigenerazione urbana e coesione territoriale |
| Missioni DUP | `M09` |
| Codici RSO | `RSO5.1` |
| Fondi | `FESR` · `FC` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C09` |
| Categorie MOP (4) | `C014` · `C048` · `C076` · `C158` |
| Q1 | Grado di degrado e abbandono dell'area (% superficie) |
| Q2 | Vita utile residua delle strutture esistenti nell'area |
| Q3 | Costo annuo gestione e vigilanza dell'area degradata |

#### `FAB-59` — Qualità degli spazi pubblici urbani, arredo e servizi civici

> Spazi pubblici urbani degradati, con arredo insufficiente o assenza di servizi civici di base. Finanzia arredo urbano, verde pubblico, cimiteri, illuminazione pubblica e recupero di piazze e spazi collettivi.

| Campo | Valore |
|---|---|
| Tema | `TC08` — Patrimonio pubblico |
| DataRoom | ⏳ |
| Funzione SOSE | Patrimonio civico e spazi pubblici |
| Missioni DUP | `M09` |
| Codici RSO | `RSO5.1` |
| Fondi | `FESR` · `MUN` |
| Funding gap | No |
| Cluster MCA | `C09` |
| Categorie MOP (4) | `C082` · `C083` · `C084` · `C086` |
| Q1 | Percentuale di spazio pubblico in buono stato di manutenzione |
| Q2 | Vita utile residua delle infrastrutture civiche |
| Q3 | Costo annuo manutenzione spazi pubblici, cimiteri e arredo |

#### `FAB-60` — Sicurezza urbana, ordine pubblico e controllo del territorio

> Carenza di infrastrutture per la sicurezza urbana, il controllo del territorio e la protezione civile. Finanzia sistemi di videosorveglianza, commissariati, presidi delle forze dell'ordine, strutture per la protezione civile e dei vigili del fuoco.

| Campo | Valore |
|---|---|
| Tema | `TC08` — Patrimonio pubblico |
| DataRoom | ⏳ |
| Funzione SOSE | Sicurezza pubblica e protezione civile |
| Missioni DUP | `M03` · `M11` |
| Codici RSO | — |
| Fondi | `MUN` |
| Funding gap | ⚠ Sì — copertura AP assente o marginale |
| Cluster MCA | `C13` |
| Categorie MOP (9) | `C074` · `C094` · `C098` · `C099` · `C100` · `C215` · `C217` · `C218` · `C219` *(4 nuove in v2)* |
| Q1 | Indice di criminalità e incidentalità urbana (eventi per 1000 ab) |
| Q2 | Vita utile residua degli edifici di sicurezza |
| Q3 | Costo annuo gestione strutture sicurezza e sistemi di controllo |

### TC09 — Energia e clima

_⏳ DataRoom differita · 4 fabbisogni_

| Codice | Label | Cluster | Categorie | Gap |
|---|---|---|---|---|
| `FAB-14` | Modernizzazione e resilienza delle reti energetiche locali | `C10` | 10 (+4) |  |
| `FAB-15` | Efficienza energetica di edifici e impianti pubblici | `C10` | 11 |  |
| `FAB-16` | Transizione energetica e riduzione delle emissioni climalteranti ✧ | `C10` | 3 |  |
| `FAB-17` | Produzione locale di energia da fonti rinnovabili ✧ | `C10` | 3 |  |

*✧ Need greenfield (q2\_label = null)*

#### `FAB-14` — Modernizzazione e resilienza delle reti energetiche locali

> Reti energetiche locali obsolete, inefficienti o non integrate con le fonti rinnovabili. Finanzia reti di distribuzione di energia elettrica e termica, metanodotti, impianti per l'efficienza delle reti, elettrificazioni rurali.

| Campo | Valore |
|---|---|
| Tema | `TC09` — Energia e clima |
| DataRoom | ⏳ |
| Funzione SOSE | Infrastrutture energetiche locali |
| Missioni DUP | `M17` |
| Codici RSO | `RSO2.1` |
| Fondi | `FESR` |
| Funding gap | No |
| Cluster MCA | `C10` |
| Categorie MOP (10) | `C033` · `C034` · `C035` · `C036` · `C037` · `C042` · `C205` · `C206` · `C207` · `C208` *(4 nuove in v2)* |
| Q1 | Stato e vetustà della rete di distribuzione energetica |
| Q2 | Vita utile residua delle infrastrutture di rete |
| Q3 | Costo annuo gestione reti e perdite energetiche |

#### `FAB-15` — Efficienza energetica di edifici e impianti pubblici

> Edifici e impianti pubblici con elevati consumi energetici e classe energetica bassa. Finanzia riqualificazione energetica di edifici scolastici, sanitari e amministrativi, installazione di impianti FER su edifici pubblici, cappotti termici e sistemi BACS.

| Campo | Valore |
|---|---|
| Tema | `TC09` — Energia e clima |
| DataRoom | ⏳ |
| Funzione SOSE | Efficienza energetica della PA |
| Missioni DUP | `M17` |
| Codici RSO | `RSO2.1` |
| Fondi | `FESR` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C10` |
| Categorie MOP (11) | `C034` · `C036` · `C039` · `C040` · `C085` · `C096` · `C105` · `C106` · `C108` · `C109` · `C112` |
| Q1 | Classe energetica attuale dell'edificio/impianto (A4-G) |
| Q2 | Vita utile residua ante-efficientamento (anni stimati) |
| Q3 | Costo annuo energia, manutenzione impianti termici e raffreddamento |

#### `FAB-16` — Transizione energetica e riduzione delle emissioni climalteranti *(greenfield)*

> Emissioni climalteranti elevate nel territorio per dipendenza da fonti fossili e bassa efficienza del parco edilizio e produttivo. Finanzia impianti FER, investimenti agro-climatico-ambientali e interventi integrati per la transizione energetica.

| Campo | Valore |
|---|---|
| Tema | `TC09` — Energia e clima |
| DataRoom | ⏳ |
| Funzione SOSE | Decarbonizzazione e clima |
| Missioni DUP | `M17` |
| Codici RSO | `RSO2.1` |
| Fondi | `FESR` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C10` |
| Categorie MOP (3) | `C037` · `C159` · `C164` |
| Q1 | Emissioni climalteranti del territorio (tCO2eq/anno) |
| Q2 | *null — fabbisogno greenfield, nessun asset preesistente* |
| Q3 | Costo annuo gestione impianti e monitoraggio emissioni |

#### `FAB-17` — Produzione locale di energia da fonti rinnovabili *(greenfield)*

> Assenza o insufficienza di impianti per la produzione locale di energia da fonti rinnovabili. Finanzia impianti idroelettrici, fotovoltaici, eolici e di cogenerazione, anche in configurazione di comunità energetica.

| Campo | Valore |
|---|---|
| Tema | `TC09` — Energia e clima |
| DataRoom | ⏳ |
| Funzione SOSE | Produzione FER e comunità energetiche |
| Missioni DUP | `M17` |
| Codici RSO | `RSO2.1` |
| Fondi | `FESR` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C10` |
| Categorie MOP (3) | `C038` · `C039` · `C041` |
| Q1 | Quota attuale di fabbisogno coperta da FER locali (%) |
| Q2 | *null — fabbisogno greenfield, nessun asset preesistente* |
| Q3 | Costo annuo gestione e manutenzione impianti FER |

### TC10 — Sport e tempo libero

_⏳ DataRoom differita · 1 fabbisogni_

| Codice | Label | Cluster | Categorie | Gap |
|---|---|---|---|---|
| `FAB-58` | Sport, attività fisica e promozione della salute attraverso il movimento | `C06` | 3 | ⚠ |

*✧ Need greenfield (q2\_label = null)*

#### `FAB-58` — Sport, attività fisica e promozione della salute attraverso il movimento

> Scarsa disponibilità di impianti e spazi per la pratica sportiva e l'attività fisica nel territorio. Finanzia impianti sportivi, palestre, piscine, campi sportivi e strutture per lo spettacolo e il tempo libero.

| Campo | Valore |
|---|---|
| Tema | `TC10` — Sport e tempo libero |
| DataRoom | ⏳ |
| Funzione SOSE | Impianti sportivi e promozione dello sport |
| Missioni DUP | `M06` |
| Codici RSO | — |
| Fondi | `MUN` · `PNRR` |
| Funding gap | ⚠ Sì — copertura AP assente o marginale |
| Cluster MCA | `C06` |
| Categorie MOP (3) | `C111` · `C112` · `CM07` |
| Q1 | Dotazione di impianti sportivi (mq per 1000 ab) |
| Q2 | Vita utile residua degli impianti sportivi |
| Q3 | Costo annuo gestione impianti e programmi sportivi |

### TC11 — Ricerca e innovazione

_⏳ DataRoom differita · 1 fabbisogni_

| Codice | Label | Cluster | Categorie | Gap |
|---|---|---|---|---|
| `FAB-41` | Infrastrutture fisiche per la ricerca e l'innovazione applicata | `C12` | 28 (+13) |  |

*✧ Need greenfield (q2\_label = null)*

#### `FAB-41` — Infrastrutture fisiche per la ricerca e l'innovazione applicata

> Assenza o insufficienza di infrastrutture fisiche per la ricerca, l'innovazione e il trasferimento tecnologico. Finanzia centri di ricerca, laboratori attrezzati, spazi per l'impresa sociale innovativa e progetti di cooperazione pubblico-privata per R&S.

| Campo | Valore |
|---|---|
| Tema | `TC11` — Ricerca e innovazione |
| DataRoom | ⏳ |
| Funzione SOSE | Ricerca, sviluppo e innovazione |
| Missioni DUP | `M14` |
| Codici RSO | `RSO1.1` · `RSO1.2` |
| Fondi | `FESR` |
| Funding gap | No |
| Cluster MCA | `C12` |
| Categorie MOP (28) | `C124` · `C125` · `C126` · `C175` · `C177` · `C178` · `C179` · `C180` · `C181` · `C182` · `C183` · `C184` · `C185` · `C186` · `C187` · `C230` · `C231` · `C232` · `C233` · `C234` · `C235` · `C236` · `C237` · `C238` · `C239` · `C240` · `C241` · `C242` *(13 nuove in v2)* |
| Q1 | Presenza e capacità delle infrastrutture di ricerca locali |
| Q2 | Vita utile residua delle strutture di ricerca |
| Q3 | Costo annuo gestione laboratori e centri ricerca |

### TC12 — PA e innovazione

_✅ DataRoom attiva · 3 fabbisogni_

| Codice | Label | Cluster | Categorie | Gap |
|---|---|---|---|---|
| `FAB-61` | Connettività digitale del territorio (banda larga e ultra-larga) | `C11` | 7 (+3) |  |
| `FAB-62` | Digitalizzazione dei servizi pubblici e smart city | `C11` | 7 (+3) |  |
| `FAB-63` | Capacità organizzativa, modernizzazione e rafforzamento della PA locale | `C13` | 9 (+3) |  |

*✧ Need greenfield (q2\_label = null)*

#### `FAB-61` — Connettività digitale del territorio (banda larga e ultra-larga)

> Territorio con copertura di banda larga e ultra-larga insufficiente per cittadini e imprese. Finanzia cavidotti, posa cavi, impianti radioelettrici, reti wireless e infrastrutture di telecomunicazione per la connettività.

| Campo | Valore |
|---|---|
| Tema | `TC12` — PA e innovazione |
| DataRoom | ✅ |
| Funzione SOSE | Infrastrutture digitali — connettività |
| Missioni DUP | `M01` |
| Codici RSO | `RSO1.1` |
| Fondi | `FESR` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C11` |
| Categorie MOP (7) | `C070` · `C071` · `C072` · `C073` · `C225` · `C226` · `C227` *(3 nuove in v2)* |
| Q1 | Copertura NGA e VHCN nel territorio (% unità immobiliari) |
| Q2 | Vita utile residua delle infrastrutture di rete |
| Q3 | Costo annuo manutenzione infrastruttura passiva |

#### `FAB-62` — Digitalizzazione dei servizi pubblici e smart city

> Servizi pubblici digitali assenti o non integrati, con scarsa interoperabilità tra sistemi della PA. Finanzia piattaforme ICT, hardware e software per centri di servizio, applicazioni per il pubblico e sistemi di controllo smart city.

| Campo | Valore |
|---|---|
| Tema | `TC12` — PA e innovazione |
| DataRoom | ✅ |
| Funzione SOSE | Transizione digitale della PA |
| Missioni DUP | `M01` |
| Codici RSO | `RSO1.1` |
| Fondi | `FESR` · `PNRR` |
| Funding gap | No |
| Cluster MCA | `C11` |
| Categorie MOP (7) | `C072` · `C074` · `C075` · `C154` · `C228` · `C229` · `C245` *(3 nuove in v2)* |
| Q1 | Livello di digitalizzazione dei servizi al cittadino (% servizi online) |
| Q2 | Vita utile residua delle infrastrutture ICT della PA |
| Q3 | Costo annuo gestione sistemi informativi e licenze |

#### `FAB-63` — Capacità organizzativa, modernizzazione e rafforzamento della PA locale

> Capacità organizzativa e tecnica della PA locale insufficiente per gestire investimenti e servizi complessi. Finanzia sedi della PA, uffici direzionali, riqualificazione energetica degli edifici pubblici, digitalizzazione interna e assistenza tecnica alla preparazione e sorveglianza dei programmi.

| Campo | Valore |
|---|---|
| Tema | `TC12` — PA e innovazione |
| DataRoom | ✅ |
| Funzione SOSE | Capacità amministrativa e good governance |
| Missioni DUP | `M01` |
| Codici RSO | `RSO1.1` |
| Fondi | `FESR` · `FSE+` |
| Funding gap | No |
| Cluster MCA | `C13` |
| Categorie MOP (9) | `C075` · `C095` · `C096` · `C097` · `C188` · `C190` · `C216` · `C246` · `C247` *(3 nuove in v2)* |
| Q1 | Indice di capacità amministrativa (indicatori ISTAT PA locali) |
| Q2 | Vita utile residua delle sedi istituzionali |
| Q3 | Costo annuo gestione sedi, formazione personale e assistenza tecnica |

---

## 5. Derived Views e Helpers

```typescript
// Needs per tema
export const NEEDS_BY_THEME: Record<string, Need[]>

// Solo fabbisogni con DataRoom attiva
export const getNeedsDataRoom = (): Need[] =>
  NEEDS.filter(f => f.visible_dataroom)

// Needs con funding gap
export const getNeedsFundingGap = (): Need[] =>
  NEEDS.filter(f => f.funding_gap)

// Needs greenfield
export const getNeedsGreenfield = (): Need[] =>
  NEEDS.filter(f => f.q2_label === null)

// Needs per cluster MCA
export const getNeedsByCluster = (cluster_id: string): Need[] =>
  NEEDS.filter(f => f.cluster_mca === cluster_id)

// Tutti i fabbisogni che includono una categoria MOP
export const getNeedsByCategoryCode = (cat_code: string): Need[] =>
  NEEDS.filter(f => f.category_codes.includes(cat_code))

// Lookup per codice
export const getNeedByCode = (code: string): Need | undefined =>
  NEEDS.find(f => f.code === code)
```

---

## 6. Statistiche di sintesi

### Confronto v1 / v2

| Metrica | v1 | v2 |
|---|---|---|
| Needs totali | 63 | 63 |
| Categorie MOP coperte | 190 | 285 |
| Nuove categorie (v2) | — | 95 (C191–C285) |
| Needs aggiornati | — | 29 |
| Categorie in più fabbisogni | 70 | 89 |
| — in 2 fabbisogni | — | 75 |
| — in 3 fabbisogni | — | 11 |
| — in 4 fabbisogni | — | 3 |
| Campo `description` | ✗ | ✅ 63/63 |

### Distribuzione per tema

| Tema | FAB | Cat v1 | Cat v2 | Δ | Aggiornati v2 |
|---|---|---|---|---|---|
| TC01 — Cultura e turismo | 3 | 12 | 17 | +5 | `FAB-31`, `FAB-32`, `FAB-33` |
| TC02 — Economia e lavoro | 11 | 45 | 63 | +18 | `FAB-09`, `FAB-35`, `FAB-39`, `FAB-40`, `FAB-57` |
| TC03 — Istruzione e formazione | 6 | 7 | 32 | +25 | `FAB-54`, `FAB-55`, `FAB-56` |
| TC04 — Welfare e inclusione | 6 | 8 | 10 | +2 | `FAB-44`, `FAB-45` |
| TC05 — Salute e sanità | 3 | 5 | 5 | 0 | `FAB-46` |
| TC06 — Ambiente e territorio | 12 | 40 | 53 | +13 | `FAB-04`, `FAB-06`, `FAB-10`, `FAB-11`, `FAB-12`, `FAB-13`, `FAB-38` |
| TC07 — Mobilità e trasporti | 10 | 24 | 26 | +2 | `FAB-25`, `FAB-27` |
| TC08 — Patrimonio pubblico | 3 | 12 | 17 | +5 | `FAB-60` |
| TC09 — Energia e clima | 4 | 10 | 14 | +4 | `FAB-14` |
| TC10 — Sport e tempo libero | 1 | 4 | 4 | 0 | — |
| TC11 — Ricerca e innovazione | 1 | 16 | 29 | +13 | `FAB-41` |
| TC12 — PA e innovazione | 3 | 7 | 15 | +8 | `FAB-61`, `FAB-62`, `FAB-63` |
| **Totale** | **63** | **190** | **285** | **+95** | **29** |

### Needs con più categorie (top 8, v2)

| Need | Totale | Nuove v2 |
|---|---|---|
| `FAB-57` — Sostegno all'occupazione e al reinserimento lavorativo | 34 | +30 |
| `FAB-41` — Infrastrutture fisiche per la ricerca e l'innovazione a | 28 | +13 |
| `FAB-56` — Formazione professionale e aggiornamento delle competen | 24 | +22 |
| `FAB-33` — Sviluppo dell'offerta e dell'attrattività turistica | 21 | +3 |
| `FAB-35` — Sviluppo e modernizzazione delle filiere agricole e agr | 14 | +2 |
| `FAB-34` — Sviluppo e infrastrutturazione di aree produttive | 12 | +0 |
| `FAB-15` — Efficienza energetica di edifici e impianti pubblici | 11 | +0 |
| `FAB-31` — Conservazione e valorizzazione del patrimonio culturale | 11 | +4 |

### Casi speciali

| Tipo | N | Needs |
|---|---|---|
| Greenfield (`q2_label = null`) | 8 | `FAB-16`, `FAB-17`, `FAB-37`, `FAB-38`, `FAB-47`, `FAB-48`, `FAB-53`, `FAB-57` |
| Funding gap | 8 | `FAB-08`, `FAB-22`, `FAB-26`, `FAB-29`, `FAB-40`, `FAB-55`, `FAB-58`, `FAB-60` |
| `cluster_mca = NONE` | 3 | `FAB-47`, `FAB-48`, `FAB-57` |
| Senza categorie MOP | 0 |  |

---

*Needs — OpenCore Schema v2 · Civiqa · Maggio 2026*