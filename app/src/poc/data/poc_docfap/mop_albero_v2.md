# OpenCore — Albero MOP
> Settori · Sotto-settori · Categorie di Intervento  
> Fonte: MOP Italia (Monitoraggio Opere Pubbliche) — gerarchia CUP ufficiale  
> Civiqa OpenCore v2 — Maggio 2026

---

## Indice

1. [Panoramica](#panoramica)
2. [Struttura dati](#struttura-dati)
3. [Decisioni architetturali](#decisioni-architetturali)
4. [Changelog v1 → v2](#changelog-v1--v2)
5. [Albero completo](#albero-completo)
6. [Cluster MCA — reference](#cluster-mca--reference)
7. [Lookup helpers](#lookup-helpers)
8. [Note di utilizzo](#note-di-utilizzo)

---

## Panoramica

L'albero MOP è la tassonomia ufficiale delle opere pubbliche italiane, derivata
dalla codifica CUP (Codice Unico di Progetto) del Dipartimento per la Programmazione
e il Coordinamento della Politica Economica (DIPE). È la fonte primaria per la
classificazione degli interventi nel modulo DOCFAP di Civiqa.

Nella versione v2 l'albero è stato riconciliato con il dataset sorgente
`gerarchia_codici_mop.xlsx` che contiene l'intera gerarchia CUP come osservata
nei progetti MOP italiani dal 2013 al 2023. Tutte le categorie presenti nel
dataset empirico sono incluse — senza filtri di scope — perché il MOP è un
dataset osservazionale: se una categoria compare, significa che almeno un ente
pubblico italiano l'ha finanziata in quel periodo. La copertura si estende quindi
a PA di qualsiasi livello (comuni, province, regioni, PA centrali).

| Dimensione | v1 | v2 |
|---|---|---|
| Settori | 10 + 1 SM | 10 |
| Sotto-settori | 44 + 5 SSM | 44 |
| Categorie | 190 C + 8 CM | 285 C |
| Fonte categorie | Costruzione parziale top-down | Riconciliazione completa CUP sorgente |
| Copertura | ~67% del CUP sorgente | 100% del CUP sorgente |

---

## Struttura dati

### `ProjectSector`

```typescript
interface ProjectSector {
  code: string;    // 'S01'…'S10' — codici MOP ufficiali
  label: string;   // Label ufficiale MOP/CUP
  source: 'MOP';   // Sempre 'MOP' — il settore SM proprietario Civiqa è stato rimosso in v2
}
```

### `ProjectSubsector`

```typescript
interface ProjectSubsector {
  code: string;           // 'SS01'…'SS44'
  label: string;          // Label ufficiale MOP/CUP
  sector_code: string;   // FK → ProjectSector.code
}
```

### `ProjectCategory`

```typescript
interface ProjectCategory {
  code: string;                // 'C001'…'C285' — stabile, non rinumerare mai
  label: string;               // Label ufficiale CUP
  subsector_code: string;  // FK → ProjectSubsector.code
  sector_code: string;        // FK → ProjectSector.code (denormalizzato per lookup rapido)
  cluster_id: string;          // FK → ClusterMCA.code | 'NONE' per servizi immateriali
}
```

Il campo `cluster_id` collega ogni categoria al cluster MCA di appartenenza,
che governa l'attivazione dei criteri qualitativi e dei fattori di rischio nel
wizard DOCFAP. Il valore `'NONE'` indica categorie — tipicamente servizi
immateriali di formazione, lavoro e assistenza — per cui non esiste un profilo
di rischio fisico-costruttivo.

---

## Decisioni architetturali

**[D1] Label duplicate tra sotto-settori diversi → codici distinti.**  
Categorie con la stessa label in sotto-settori diversi ricevono codici C### separati.
Esempio: `C019` e `C088` hanno entrambe label 'Impianti Depurazione Acque' ma
appartengono rispettivamente a SS04 (Risorse Idriche) e SS04 (Smaltimento Rifiuti).
I codici sono permanenti e non vengono mai rinumerati.

**[D2] Il sotto-settore è solo un livello di classificazione/navigazione.**  
Non ha peso analitico nei calcoli DOCFAP. I calcoli operano sempre a livello
di categoria (C###).

**[D3] Copertura completa del CUP sorgente.**  
Tutte le 281 categorie del dataset `gerarchia_codici_mop.xlsx` sono incluse.
Nessuna esclusione per scope, livello di PA o frequenza d'uso. Alcune categorie
(indicate con `scope_pa` nel file Excel di riconciliazione) sono storicamente
associate a PA statale o regionale ma rimangono nell'albero perché il MOP
è una fonte empirica, non normativa.

**[D4] ~~Settore SM rimosso in v2.~~**  
La versione v1 introduceva un settore proprietario Civiqa 'SM — Servizi e
Interventi Mediati' con 5 sotto-settori (SSM01–SSM05) e 8 categorie (CM01–CM08)
per voucher, convenzioni e trasferimenti diretti all'utente. In v2 questo settore
è stato rimosso per due ragioni: (a) il settore S07 del MOP copre già le
categorie di formazione, lavoro e servizi alla persona con granularità sufficiente;
(b) la distinzione tra 'intervento fisico' e 'servizio mediato' è già gestita
dalla tipologia di intervento nel wizard DOCFAP, non richiede un settore separato.
Il namespace SM/SSM/CM non è più presente nel data contract.

**[D5] `cluster_id = 'NONE'` per categorie di servizio immateriale.**  
Le categorie S07 (formazione, lavoro) e parte di S10 (servizi PA) non hanno
un profilo di rischio fisico-costruttivo. Vengono valutate nel wizard DOCFAP
con la matrice universale a 6 domande. Le domande adattive di cluster (D5/D6)
non si attivano e restano N/A.

**[D6] `scope_pa` è un tag informativo, non un criterio di esclusione.**  
Dieci categorie nella v2 (C191, C200, C205, C215, C217, C218, C224, C232,
C235, C239) sono storicamente associate a PA statale o a settori specialistici
(difesa, giustizia, spazio, pesca). Il tag `scope_pa` nel file di riconciliazione
segnala questa caratteristica ma non esclude la categoria dall'albero né
dalla selezione nel wizard.

---

## Changelog v1 → v2

### Rimozioni

| Elemento rimosso | Motivazione |
|---|---|
| Settore `SM` — Servizi e Interventi Mediati | Copertura già presente in S07 MOP; distinzione fisico/mediato gestita dalla tipologia intervento, non dal settore |
| Sotto-settori `SSM01`–`SSM05` | Rimossi con il settore SM |
| Categorie `CM01`–`CM08` | Sostituite da categorie CUP granulari in S07 (C191+) e da categorie già esistenti in S06/S10 |
| `source: 'CIVIQA'` nel type union | Il type `source` è ora sempre `'MOP'` |
| Campi `included_types` e `indicative_cp` | Erano specifici delle categorie SM; rimossi con esse |

### Aggiunte

| Elemento aggiunto | Dettaglio |
|---|---|
| 95 nuove categorie C191–C285 | Riconciliazione completa con `gerarchia_codici_mop.xlsx` |
| Copertura S07 granulare | Da 5 categorie aggregate a 41 categorie CUP ufficiali |
| Copertura S09 completa | 13 nuove categorie R&S (C221–C230, C233–C235) |
| Copertura S01 completa | 12 nuove categorie ambiente/risorse idriche |

### Dettaglio nuove categorie per settore

| Settore | Cat. v1 | Cat. v2 | Nuove |
|---|---|---|---|
| S01 — Infrastrutture Ambientali E Risorse Idriche | 32 | 44 | +12 ⬆ |
| S02 — Infrastrutture Del Settore Energetico | 10 | 14 | +4 ⬆ |
| S03 — Infrastrutture Di Trasporto | 24 | 26 | +2 ⬆ |
| S04 — Infrastrutture Per L'Attrezzatura Di Aree Produttive | 3 | 3 | +0 |
| S05 — Infrastrutture Per Telecomunicazioni E Tecnologie Informatiche | 6 | 12 | +6 ⬆ |
| S06 — Infrastrutture Sociali | 39 | 50 | +11 ⬆ |
| S07 — Istruzione, Formazione E Sostegni Per Il Mercato Del Lavoro | 5 | 41 | +36 ⬆ |
| S08 — Opere, Impianti Ed Attrezzature Per Attivita' Produttive, E La Ricerca E L'Impresa Sociale | 55 | 62 | +7 ⬆ |
| S09 — Ricerca Sviluppo Tecnologico Ed Innovazione | 13 | 26 | +13 ⬆ |
| S10 — Servizi Per La P.A. E Per La Collettivita' | 3 | 7 | +4 ⬆ |
| **Totale** | **190** | **285** | **+95** |

---

## Albero completo

> Le categorie aggiunte in v2 (C191–C285) sono marcate con `✦`.
> Il cluster MCA è indicato tra parentesi quadre.

### S01 — Infrastrutture Ambientali E Risorse Idriche

_4 sotto-settori · 44 categorie · 12 aggiunte in v2_

**SS01 — Difesa Del Suolo** (8)

- `C001` Abitati [Difesa del suolo e rischio naturale]
- `C002` Altre Infrastrutture/Strutture Di Difesa Del Suolo [Difesa del suolo e rischio naturale]
- `C003` Bonifica Di Siti [Difesa del suolo e rischio naturale]
- `C004` Corsi D'Acqua [Difesa del suolo e rischio naturale]
- `C005` Foreste [Difesa del suolo e rischio naturale]
- `C006` Regimazione Acque [Difesa del suolo e rischio naturale]
- `C007` Spiagge [Difesa del suolo e rischio naturale]
- `C008` Strutture/Infrastrutture A Rischio Sismico [Difesa del suolo e rischio naturale]

**SS02 — Protezione, Valorizzazione E Fruizione Dell'Ambiente** (9)

- `C009` Altre Strutture/Infrastrutture Per La Fruizione Dell'Ambiente [Verde, rigenerazione urbana e spazi pubblici]
- `C010` Parchi E Riserve Aree Protette [Verde, rigenerazione urbana e spazi pubblici]
- `C011` Sistemi Di Monitoraggio Ambientale E Telecontrollo Dell'Inquinamento [Verde, rigenerazione urbana e spazi pubblici]
- `C012` Siti Naturali E Rurali [Verde, rigenerazione urbana e spazi pubblici]
- `C013` Strutture Per La Fruizione Del Patrimonio Ambientale [Verde, rigenerazione urbana e spazi pubblici]
- `C195` Strutture Per La Qualita' Dell'aria `✦` [Verde, rigenerazione urbana e spazi pubblici]
- `C196` Infrastrutture Verdi `✦` [Verde, rigenerazione urbana e spazi pubblici]
- `C197` Strutture Per Protezione Dal Rumore `✦` [Verde, rigenerazione urbana e spazi pubblici]
- `C198` Altre Strutture/infrastrutture Per La Protezione, Valorizzazione E Fruizione Ambientale `✦` [Verde, rigenerazione urbana e spazi pubblici]

**SS03 — Riassetto E Recupero Di Siti Urbani E Produttivi** (4)

- `C014` Aree Dismesse [Ciclo idrico, rifiuti e bonifica]
- `C015` Altre Siti Produttivi [Ciclo idrico, rifiuti e bonifica]
- `C016` Siti Contaminati E/O Degradati [Ciclo idrico, rifiuti e bonifica]
- `C199` Impianti Per Il Trattamento Di Rifiuti Speciali `✦` [Verde, rigenerazione urbana e spazi pubblici]

**SS04 — Risorse Idriche E Acque Reflue** (23)

- `C017` Corpi Idrici: Miglioramento Della Qualita' [Ciclo idrico, rifiuti e bonifica]
- `C018` Dissalatori E Strutture/Infrastrutture Per La Potabilizzazione [Ciclo idrico, rifiuti e bonifica]
- `C019` Impianti Depurazione Acque [Ciclo idrico, rifiuti e bonifica]
- `C020` Impianti Di Stoccaggio E Sollevamento Acque Reflue [Ciclo idrico, rifiuti e bonifica]
- `C021` Impianti Di Trattamento Rifiuti Urbani [Ciclo idrico, rifiuti e bonifica]
- `C022` Impianti Per La Gestione Della Raccolta Differenziata [Ciclo idrico, rifiuti e bonifica]
- `C023` Reti Fognarie [Ciclo idrico, rifiuti e bonifica]
- `C024` Reti Idriche Industriali [Ciclo idrico, rifiuti e bonifica]
- `C025` Reti Idriche Rurali [Ciclo idrico, rifiuti e bonifica]
- `C026` Reti Idriche Urbane [Ciclo idrico, rifiuti e bonifica]
- `C027` Reti Per Il Collettamento Delle Acque Pluviali [Ciclo idrico, rifiuti e bonifica]
- `C028` Serbatoi Ed Impianti Di Sollevamento [Ciclo idrico, rifiuti e bonifica]
- `C029` Sistemi Di Raccolta Differenziata Dei Rifiuti Urbani [Ciclo idrico, rifiuti e bonifica]
- `C030` Smaltimento Rifiuti - Altre Strutture/Infrastrutture [Ciclo idrico, rifiuti e bonifica]
- `C031` Strutture/Infrastrutture Per La Captazione E Adduzione Dell'Acqua Per Esclusivo Uso Agricolo [Ciclo idrico, rifiuti e bonifica]
- `C032` Strutture/Infrastrutture Per La Captazione E Adduzione Dell'Acqua Per Usi Non Agricoli O Ad Uso Plurimo [Ciclo idrico, rifiuti e bonifica]
- `C193` Impianti Di Trattamento Rifiuti Speciali `✦` [Ciclo idrico, rifiuti e bonifica]
- `C194` Altre Strutture/infrastrutture Di Smaltimento Rifiuti `✦` [Ciclo idrico, rifiuti e bonifica]
- `C200` Dighe `✦` [Ciclo idrico, rifiuti e bonifica] — *Concessioni regionali/statali*
- `C201` Bacini Irrigui, Traverse E Strutture Minori Di Accumulo `✦` [Ciclo idrico, rifiuti e bonifica]
- `C202` Impianti Di Pre-trattamento, Stoccaggio, Sollevamento E Riutilizzo Acque Reflue `✦` [Ciclo idrico, rifiuti e bonifica]
- `C203` Impianti E Reti Irrigue Interaziendali `✦` [Ciclo idrico, rifiuti e bonifica]
- `C204` Altre Strutture/infrastrutture Per L'utilizzo Delle Risorse Idriche `✦` [Ciclo idrico, rifiuti e bonifica]

### S02 — Infrastrutture Del Settore Energetico

_2 sotto-settori · 14 categorie · 4 aggiunte in v2_

**SS05 — Distribuzione Di Energia** (8)

- `C033` Altre Strutture/Infrastrutture Di Distribuzione Energia [Reti e impianti energetici]
- `C034` Impianti Di Distribuzione Di Energia Elettrica E Termica, Civile E Industriale [Reti e impianti energetici]
- `C035` Impianti Di Trasmissione Di Energia Elettrica [Reti e impianti energetici]
- `C036` Impianti Per L'Efficienza Delle Reti E Risparmio Energetico [Reti e impianti energetici]
- `C037` Reti Distribuzione Gas [Reti e impianti energetici]
- `C206` Elettrificazioni Rurali `✦` [Reti e impianti energetici]
- `C207` Metanodotti Gasdotti E Simili `✦` [Reti e impianti energetici]
- `C208` Altri Impianti Di Distribuzione Energia `✦` [Reti e impianti energetici]

**SS06 — Produzione  Di Energia** (6)

- `C038` Altri Impianti Per La Produzione E L'Estrazione Di Energia [Reti e impianti energetici]
- `C039` Altri Impianti Produzione Energie Da Fonti Rinnovabili [Reti e impianti energetici]
- `C040` Impianti Di Cogenerazione [Reti e impianti energetici]
- `C041` Impianti Produzione Idroelettrica [Reti e impianti energetici]
- `C042` Impianti Produzione Termoelettrica [Reti e impianti energetici]
- `C205` Impianti Produzione Gas `✦` [Reti e impianti energetici] — *Operatori nazionali (ENI, Snam)*

### S03 — Infrastrutture Di Trasporto

_6 sotto-settori · 26 categorie · 2 aggiunte in v2_

**SS07 — Aeroportuali** (3)

- `C043` Altre Strutture/Infrastrutture Aeroportuali [Infrastrutture di trasporto specializzate]
- `C044` Aerostazioni [Infrastrutture di trasporto specializzate]
- `C045` Piste [Infrastrutture di trasporto specializzate]

**SS08 — Ferrovie** (4)

- `C046` Altre Strutture/Infrastrutture Ferroviarie [Infrastrutture di trasporto specializzate]
- `C047` Linee Ferroviarie [Infrastrutture di trasporto specializzate]
- `C048` Stazione E Terminali [Infrastrutture di trasporto specializzate]
- `C191` Veicoli Ferroviari `✦` [Infrastrutture di trasporto specializzate] — *Bene mobile RFI — tipicamente PA centrale*

**SS09 — Marittime Lacuali E Fluviali** (5)

- `C049` Altre Strutture/Infrastrutture Marittime E Fluviali [Infrastrutture di trasporto specializzate]
- `C050` Idrovie E Strutture/Infrastrutture Fluviali [Infrastrutture di trasporto specializzate]
- `C051` Porti Commerciali [Infrastrutture di trasporto specializzate]
- `C052` Porti Per La Pesca [Infrastrutture di trasporto specializzate]
- `C053` Porti Turistici [Infrastrutture di trasporto specializzate]

**SS10 — Stradali** (6)

- `C054` Altre Strutture/Infrastrutture Stradali [Infrastrutture stradali e mobilità]
- `C055` Autostrade [Infrastrutture stradali e mobilità]
- `C056` Piste Ciclabili [Infrastrutture stradali e mobilità]
- `C057` Strade Regionali, Provinciali E Comunali [Infrastrutture stradali e mobilità]
- `C058` Strade Rurali [Infrastrutture stradali e mobilità]
- `C059` Strade Statali [Infrastrutture stradali e mobilità]

**SS11 — Trasporti Multimodali E Altre Modalita' Di Trasporto** (4)

- `C060` Altre Modalita' Di Trasporto [Infrastrutture stradali e mobilità]
- `C061` Funivie, Seggiovie, Funicolari [Infrastrutture stradali e mobilità]
- `C062` Trasporti Multimodali Ed Interporti [Infrastrutture stradali e mobilità]
- `C192` Sistemi Di Trasporto Intelligenti `✦` [Infrastrutture stradali e mobilità]

**SS12 — Trasporto Urbano** (4)

- `C063` Altri Strutture/Infrastrutture Di Trasporto Urbane [Infrastrutture stradali e mobilità]
- `C064` Linee Metropolitane E Tramviarie [Infrastrutture stradali e mobilità]
- `C065` Sistemi Di Parcheggio E Interscambio [Infrastrutture stradali e mobilità]
- `C066` Sistemi Integrati E Di Trasporto Intelligenti Per La Mobilita' Sostenibile [Infrastrutture stradali e mobilità]

### S04 — Infrastrutture Per L'Attrezzatura Di Aree Produttive

_1 sotto-settori · 3 categorie_

**SS13 — Infrastrutture Per L'Attrezzatura Di Aree Produttive** (3)

- `C067` Altre Infrastrutture Per Attrezzature Di Aree Produttive [Attività produttive, agricoltura e ricerca]
- `C068` Infrastrutture Civili Per Aree Industriali [Attività produttive, agricoltura e ricerca]
- `C069` Sistemazione Dei Terreni E Riconversione Aree Industriali [Attività produttive, agricoltura e ricerca]

### S05 — Infrastrutture Per Telecomunicazioni E Tecnologie Informatiche

_2 sotto-settori · 12 categorie · 6 aggiunte in v2_

**SS14 — Infrastrutture Per Telecomunicazioni** (8)

- `C070` Altre Opere Ed Impianti Per Telecomunicazione [Infrastrutture digitali e ICT]
- `C071` Cavidotti, Altre Opere Civili Di Cablaggio E Centraline [Infrastrutture digitali e ICT]
- `C072` Impianti Wireless [Infrastrutture digitali e ICT]
- `C073` Posa Cavi In Dotti Gia Esistenti [Infrastrutture digitali e ICT]
- `C074` Sistemi Ed Impianti Di Controllo E Videosorveglianza [Infrastrutture digitali e ICT]
- `C225` Impianti Radioelettrici (antenne E Trasmettitori) `✦` [Infrastrutture digitali e ICT]
- `C226` Posa Cavi In Dotti Già Esistenti `✦` [Infrastrutture digitali e ICT]
- `C227` Cablaggio Interno Ad Edifici E Di Reti Locali `✦` [Infrastrutture digitali e ICT]

**SS15 — Tecnologie Informatiche** (4)

- `C075` Locali Attrezzati Per Centri Di Servizio Informatici [Infrastrutture digitali e ICT]
- `C228` Impianti Ed Infrastrutture Hardware E Software Per Centri Di Servizio Informatici `✦` [Infrastrutture digitali e ICT]
- `C229` Altre Opere Ed Impianti Per Tecnologie Informatiche `✦` [Infrastrutture digitali e ICT]
- `C245` Servizi Ed Applicazioni Per Il Pubblico `✦` [Infrastrutture digitali e ICT]

### S06 — Infrastrutture Sociali

_11 sotto-settori · 50 categorie · 11 aggiunte in v2_

**SS16 — Abitative** (6)

- `C076` Abitazioni Rurali E Borghi Rurali [Edilizia residenziale pubblica]
- `C077` Altri Edifici Abitativi [Edilizia residenziale pubblica]
- `C078` Edifici Danneggiati Da Calamita' Naturali [Edilizia residenziale pubblica]
- `C079` Fabbricati Residenziali Urbani [Edilizia residenziale pubblica]
- `C080` Infrastrutture Civili Per Complessi Residenziali [Edilizia residenziale pubblica]
- `C081` Residenze Per Comunita' [Edilizia residenziale pubblica]

**SS17 — Altre Infrastrutture Sociali** (5)

- `C082` Altre Infrastrutture [Verde, rigenerazione urbana e spazi pubblici]
- `C083` Arredo Urbano [Verde, rigenerazione urbana e spazi pubblici]
- `C084` Cimiteri [Verde, rigenerazione urbana e spazi pubblici]
- `C085` Illuminazione Pubblica [Verde, rigenerazione urbana e spazi pubblici]
- `C086` Verde Pubblico [Verde, rigenerazione urbana e spazi pubblici]

**SS18 — Beni Culturali** (7)

- `C087` Aree Archeologiche [Patrimonio culturale, sport e turismo]
- `C088` Monumenti [Patrimonio culturale, sport e turismo]
- `C089` Musei Archivi E Biblioteche [Patrimonio culturale, sport e turismo]
- `C090` Patrimonio Rurale [Patrimonio culturale, sport e turismo]
- `C091` Restauro E Riqualificazione Di Beni Culturali [Patrimonio culturale, sport e turismo]
- `C211` Beni Culturali Mobili `✦` [Patrimonio culturale, sport e turismo]
- `C212` Altri Beni Culturali `✦` [Patrimonio culturale, sport e turismo]

**SS19 — Culto** (4)

- `C092` Chiese [Sicurezza, PA e sedi istituzionali]
- `C093` Conventi [Sicurezza, PA e sedi istituzionali]
- `C213` Edifici Per Servizi Religiosi `✦` [Patrimonio culturale, sport e turismo]
- `C214` Altri Edifici Per Il Culto `✦` [Patrimonio culturale, sport e turismo]

**SS20 — Difesa** (2)

- `C094` Caserme [Sicurezza, PA e sedi istituzionali]
- `C215` Altre Strutture/infrastrutture Militari `✦` [Sicurezza, PA e sedi istituzionali] — *Competenza Ministero Difesa*

**SS21 — Direzionali E Amministrative** (4)

- `C095` Edifici E Infrastrutture Per Uffici [Sicurezza, PA e sedi istituzionali]
- `C096` Strutture/Infrastrutture Per Sedi Della Pubblica Amministrazione [Sicurezza, PA e sedi istituzionali]
- `C097` Strutture/Infrastrutture Per Sedi Di Organi Istituzionali [Sicurezza, PA e sedi istituzionali]
- `C216` Altre Strutture/infrastrutture Direzionali E Amministrative `✦` [Sicurezza, PA e sedi istituzionali]

**SS22 — Giudiziarie E Penitenziarie** (3)

- `C098` Altre Strutture/Infrastrutture Giudiziarie [Sicurezza, PA e sedi istituzionali]
- `C217` Strutture/infrastrutture Penitenziarie `✦` [— (servizi immateriali, nessun cluster fisico)] — *Competenza DAP/Ministero Giustizia*
- `C218` Preture E Tribunali `✦` [— (servizi immateriali, nessun cluster fisico)] — *Competenza Ministero Giustizia*

**SS23 — Pubblica Sicurezza** (3)

- `C099` Altre Strutture/Infrastrutture Per La Pubblica Sicurezza [Sicurezza, PA e sedi istituzionali]
- `C100` Edifici Ed Infrastrutture Per La Protezione Civile [Sicurezza, PA e sedi istituzionali]
- `C219` Commissariati `✦` [Sicurezza, PA e sedi istituzionali]

**SS24 — Sanitarie** (5)

- `C101` Altre Strutture Sanitarie [Strutture sociosanitarie e residenziali]
- `C102` Altre Strutture Per L'Igiene La Profilassi E La Tutela Della Salute [Strutture sociosanitarie e residenziali]
- `C103` Altri Presidi Sanitari Territoriali [Strutture sociosanitarie e residenziali]
- `C104` Residenze Sanitarie Assistenziali [Strutture sociosanitarie e residenziali]
- `C105` Strutture Ospedaliere [Strutture sociosanitarie e residenziali]

**SS25 — Sociali E Scolastiche** (7)

- `C106` Asili Nido [Edifici scolastici e formativi]
- `C107` Edifici Sociali, Culturali E Assistenziali [Edifici scolastici e formativi]
- `C108` Scuole Elementari, Medie E Superiori [Edifici scolastici e formativi]
- `C109` Scuole Materne [Edifici scolastici e formativi]
- `C110` Universita' [Edifici scolastici e formativi]
- `C209` Altri Edifici Scolastici `✦` [Edifici scolastici e formativi]
- `C210` Altre Strutture Sociali `✦` [Edifici scolastici e formativi]

**SS26 — Sport, Spettacolo E Tempo Libero** (4)

- `C111` Altre Strutture Ricreative [Patrimonio culturale, sport e turismo]
- `C112` Impianti Sportivi [Patrimonio culturale, sport e turismo]
- `C113` Strutture Fieristiche E Congressuali [Patrimonio culturale, sport e turismo]
- `C114` Teatri Ed Altre Strutture Per Lo Spettacolo [Patrimonio culturale, sport e turismo]

### S07 — Istruzione, Formazione E Sostegni Per Il Mercato Del Lavoro

_5 sotto-settori · 41 categorie · 36 aggiunte in v2_

**SS27 — Altri Sostegni Per Il Mercato Del Lavoro** (6)

- `C115` Altri Sostegni Per Il Mercato Del Lavoro [Edifici scolastici e formativi]
- `C281` Orientamento E Consulenza E Informazione `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C282` Osservatori Del Mercato Del Lavoro `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C283` Sostegni All'uscita Dal Mercato Del Lavoro `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C284` Creazione Di Associazione Di Operatori Forestali `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C285` Azioni Di Tutoraggio Per Aziende Agricole E Forestali `✦` [— (servizi immateriali, nessun cluster fisico)]

**SS28 — Altri Strumenti Formativi E Di Work-Experience** (6)

- `C116` Altri Strumenti Formativi E Di Work-Experience [Edifici scolastici e formativi]
- `C273` Borse Di Lavoro `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C274` Lavori Di Pubblica Utilita' / Lavori Socialmente Utili `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C275` Altre Forme `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C276` Percorsi Formativi Integrati Per L'inserimento Lavorativo `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C277` Percorsi Formativi Integrati Per La Creazione Di Impresa `✦` [— (servizi immateriali, nessun cluster fisico)]

**SS29 — Contributi Ed Incentivi Al Lavoro** (4)

- `C117` Contributi Ed Incentivi Al Lavoro [Attività produttive, agricoltura e ricerca]
- `C278` Incentivi Alle Persone Per La Formazione `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C279` Incentivi Alle Persone Per Il Lavoro Autonomo `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C280` Altri Contributi All'occupazione `✦` [— (servizi immateriali, nessun cluster fisico)]

**SS30 — Formazione Per Il Lavoro** (18)

- `C118` Formazione Per Il Lavoro [Edifici scolastici e formativi]
- `C256` Formazione All'interno Dell'obbligo Scolastico `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C257` Formazione Post Qualifica E Post Diploma `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C258` Ifts (istruzione E Formazione Tecnica Superiore) `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C259` Formazione Nell'ambito Dei Contratti Di Formazione Lavoro `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C260` Formazione Nell'ambito Dell'apprendistato Post Obbligo Formativo (professionalizzante) `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C261` Formazione Per La Creazione D'impresa `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C262` Formazione Per Occupati (o Formazione Continua) `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C263` Formazione Nell'ambito Dell'apprendistato All'interno Dell'obbligo Formativo (per Qualifica E Diploma Professionale) `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C264` Percorsi Scolastici Formativi All'interno Dell'obbligo Formativo `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C265` Altra Formazione All'interno Dell'obbligo Formativo `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C266` Formazione Finalizzata Al Reinserimento Lavorativo `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C267` Alta Formazione Nell'ambito Dei Cicli Universitari `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C268` Formazione Permanente Aggiornamento Culturale `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C269` Formazione Permanente Aggiornamento Professionale E Tecnico `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C270` Formazione Congiunta Di Formatori, Docenti, Tutor Aziendali E Personale Università `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C271` Formazione Professionale In Agricoltura E Nel Settore Forestale `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C272` Formazione Professionale Nel Settore Della Pesca E Dell'acquacoltura `✦` [— (servizi immateriali, nessun cluster fisico)]

**SS31 — Scuola E Istruzione** (7)

- `C119` Servizi Per L'Infanzia [Edifici scolastici e formativi]
- `C250` Formazione E Istruzione All'interno Dell'obbligo Scolastico `✦` [Edifici scolastici e formativi]
- `C251` Formazione Per Adulti `✦` [Edifici scolastici e formativi]
- `C252` Orientamento Scolastico E Formativo `✦` [Edifici scolastici e formativi]
- `C253` Borse Di Studio `✦` [Edifici scolastici e formativi]
- `C254` Stage, Tirocini E Percorsi Di Alternanza Scuola Lavoro `✦` [Edifici scolastici e formativi]
- `C255` Progetti E Mobilita' Internazionali `✦` [Edifici scolastici e formativi]

### S08 — Opere, Impianti Ed Attrezzature Per Attivita' Produttive, E La Ricerca E L'Impresa Sociale

_8 sotto-settori · 62 categorie · 7 aggiunte in v2_

**SS32 — Impianti  Ed Attrezzature Per La Pesca E L'Acquacoltura** (5)

- `C120` Altre Attrezzature Per La Pesca [Attività produttive, agricoltura e ricerca]
- `C121` Impianti Di Acquacoltura [Attività produttive, agricoltura e ricerca]
- `C122` Mezzi, Opere Ed Attrezzature Per Attivita' Di Pesca [Attività produttive, agricoltura e ricerca]
- `C123` Strutture Per La Trasformazione E Commercializzazione Dei Prodotti Della Pesca Ed Acquacoltura [Attività produttive, agricoltura e ricerca]
- `C224` Attrezzature E Mezzi Per Attivita' Di Controllo Della Pesca `✦` [Attività produttive, agricoltura e ricerca] — *Competenza Guardia Costiera/MIPAAF*

**SS33 — Opere E Infrastrutture Per La Ricerca** (3)

- `C124` Altre Opere Ed Infrastrutture Per La Ricerca [Attività produttive, agricoltura e ricerca]
- `C125` Centri Di Ricerca [Attività produttive, agricoltura e ricerca]
- `C126` Laboratori Attrezzati Per La Ricerca [Attività produttive, agricoltura e ricerca]

**SS34 — Opere E Infrastrutture Per L'Impresa Sociale** (1)

- `C127` Spazi E Strutture Per Le Attivita' Di Impresa Sociale [Attività produttive, agricoltura e ricerca]

**SS35 — Opere E Strutture Per Il Turismo** (6)

- `C128` Alberghi [Attività produttive, agricoltura e ricerca]
- `C129` Altre Strutture Di Ricettivita' Turistica [Attività produttive, agricoltura e ricerca]
- `C130` Altre Strutture E Impianti Per Il Turismo [Attività produttive, agricoltura e ricerca]
- `C131` Centri Di Informazione / Accoglienza [Attività produttive, agricoltura e ricerca]
- `C132` Strutture Ricettive Per Agriturismo E Turismo Rurale [Attività produttive, agricoltura e ricerca]
- `C243` Servizi Comuni Di Promozione Dell'offerta Turistica `✦` [Patrimonio culturale, sport e turismo]

**SS36 — Opere,  Impianti Ed Attrezzature Per L'Agricoltura, La Zootecnia E L'Agroalimentare** (23)

- `C133` Altre Opere E Strutture Per L'Agricoltura [Attività produttive, agricoltura e ricerca]
- `C134` Benessere Animali [Attività produttive, agricoltura e ricerca]
- `C135` Compensazioni Settore Agricolo E Forestale E Della Pesca Ed Acquacoltura [Attività produttive, agricoltura e ricerca]
- `C136` Creazione Nuove Forme Di Cooperazione Produttiva E Commerciale [Attività produttive, agricoltura e ricerca]
- `C137` Fabbricati Agroindustriali [Attività produttive, agricoltura e ricerca]
- `C138` Fabbricati Rurali [Attività produttive, agricoltura e ricerca]
- `C139` Impianti Collettivi Per La Tutela Della Qualita' E Per Lo Sviluppo Di Forme Associative Dei Produttori [Attività produttive, agricoltura e ricerca]
- `C140` Impianti E Reti Irrigue Aziendali [Attività produttive, agricoltura e ricerca]
- `C141` Impianti Ed Attrezzature Per La Diversificazione Delle Attivita' O Pluriattivita' In Aziende Agricole [Attività produttive, agricoltura e ricerca]
- `C142` Impianti, Macchinari Mezzi Tecnici E Investimenti Immateriali Per Le Aziende Agricole E Agroalimentari [Attività produttive, agricoltura e ricerca]
- `C143` Infrastrutture A Servizio Delle Aziende Agricole [Attività produttive, agricoltura e ricerca]
- `C144` Introduzione Di Sistemi Per Il Controllo Della Qualita' Dei Prodotti [Attività produttive, agricoltura e ricerca]
- `C145` Interventi Per La Ricomposizione Fondiaria [Attività produttive, agricoltura e ricerca]
- `C146` Investimenti Non Produttivi A Finalita' Agro-Climatico-Ambientale [Attività produttive, agricoltura e ricerca]
- `C147` Mezzi E Impianti Per Il Ripristino E La Prevenzione Da Eventi Calamitosi [Attività produttive, agricoltura e ricerca]
- `C148` Miglioramenti Fondiari Aziendali [Attività produttive, agricoltura e ricerca]
- `C149` Opere Su Impianti Produttivi (Coltivazioni) Agricoli [Attività produttive, agricoltura e ricerca]
- `C150` Sostegno In Ambito Agro - Silvo Ambientale [Attività produttive, agricoltura e ricerca]
- `C151` Strutture Per Coltivazioni Agricole Protette [Attività produttive, agricoltura e ricerca]
- `C152` Strutture Per La Zootecnia [Attività produttive, agricoltura e ricerca]
- `C221` Impianti Ed Attrezzature Per La Diversificazione Delle Attivita' O Pluriattivita' In Aziende Agricole (incl. Inv. Per La Produzione Energetica Da Fonti Rinnovabili) `✦` [Attività produttive, agricoltura e ricerca]
- `C222` Investimenti Non Produttivi A Finalita' Agro-climatico-ambientale (inclusi Investimenti Per La Produzione Energetica Da Fonti Rinnovabili) `✦` [Attività produttive, agricoltura e ricerca]
- `C223` Strutture Per Coltivazioni Agricole Protette (serre; Ecc.) `✦` [Attività produttive, agricoltura e ricerca]

**SS37 — Opere, Impianti Ed Attrezzature Per Attivita' Industriali E L'Artigianato** (9)

- `C153` Altre Opere Ed Impianti Per Attivita' Industriali [Attività produttive, agricoltura e ricerca]
- `C154` Attrezzature O Dotazioni Informatiche [Attività produttive, agricoltura e ricerca]
- `C155` Centri E Laboratori Artigiani [Attività produttive, agricoltura e ricerca]
- `C156` Impianti, Macchinari Ed Annesse Opere Murarie [Attività produttive, agricoltura e ricerca]
- `C157` Iniziative Di Attrazione Investimenti E Sviluppo Produttivo Territoriale [Attività produttive, agricoltura e ricerca]
- `C158` Iniziative Di Riconversione Industriale [Attività produttive, agricoltura e ricerca]
- `C159` Introduzione Tecnologie Rispettose Dell'Ambiente E Della Riduzione Dei Consumi [Attività produttive, agricoltura e ricerca]
- `C160` Strutture Industriali Comuni Ed Altri Edifici Attrezzati [Attività produttive, agricoltura e ricerca]
- `C161` Strutture Per La Logistica [Attività produttive, agricoltura e ricerca]

**SS38 — Opere, Impianti Ed Attrezzature Per Il Settore Silvo-Forestale** (9)

- `C162` Altre Opere Per Il Settore Silvo-Pastorale [Attività produttive, agricoltura e ricerca]
- `C163` Attrezzature, Macchinari E Mezzi Tecnici Per Il Lavoro Forestale [Attività produttive, agricoltura e ricerca]
- `C164` Forestazione Produttiva [Attività produttive, agricoltura e ricerca]
- `C165` Impianti Per La Raccolta, La Trasformazione E La Commercializzazione Di Prodotti Forestali [Attività produttive, agricoltura e ricerca]
- `C166` Infrastrutture A Servizio Delle Aziende Forestali [Attività produttive, agricoltura e ricerca]
- `C167` Mezzi Ed Impianti Per La Prevenzione E Il Ripristino Da Calamita' Naturali [Attività produttive, agricoltura e ricerca]
- `C168` Opere Per L'Accrescimento Della Resilienza E Del Pregio Ambientale Degli Ecosistemi Forestali [Attività produttive, agricoltura e ricerca]
- `C169` Strutture Per Coltivazioni Forestali (Vivai) [Attività produttive, agricoltura e ricerca]
- `C220` Strutture Per Coltivazioni Forestali (vivai, Ecc) `✦` [Attività produttive, agricoltura e ricerca]

**SS39 — Strutture Ed Attrezzature Per Il Commercio E I Servizi** (6)

- `C170` Altre Strutture Per Il Commercio Ed I Servizi [Attività produttive, agricoltura e ricerca]
- `C171` Centri Commerciali [Attività produttive, agricoltura e ricerca]
- `C172` Impianti E Macchinari Per Il Commercio Ed I Servizi [Attività produttive, agricoltura e ricerca]
- `C173` Magazzini [Attività produttive, agricoltura e ricerca]
- `C174` Strutture Per Servizi Di Annona [Attività produttive, agricoltura e ricerca]
- `C244` Altri Servizi Alle Imprese Commerciali `✦` [Attività produttive, agricoltura e ricerca]

### S09 — Ricerca Sviluppo Tecnologico Ed Innovazione

_3 sotto-settori · 26 categorie · 13 aggiunte in v2_

**SS40 — Progetti Di Diffusione E Cooperazione Pubblico-Privata** (12)

- `C175` Altre Ricerche [Attività produttive, agricoltura e ricerca]
- `C176` Controllo E Tutela Dell'Ambiente Terrestre E Marino [Attività produttive, agricoltura e ricerca]
- `C177` Esplorazione E Utilizzazione Dell'Ambiente Terrestre E Marino [Attività produttive, agricoltura e ricerca]
- `C178` Infrastrutture E Pianificazione Del Territorio [Attività produttive, agricoltura e ricerca]
- `C179` Produzione E Trasferimento Nuovi Prodotti, Pratiche, Processi E Tecnologie Agricole E Forestali [Attività produttive, agricoltura e ricerca]
- `C180` Produzione, Distribuzione E Uso Razionale Dell'Energia [Attività produttive, agricoltura e ricerca]
- `C181` Progetti A Finalita' Agro-Climatico-Ambientale [Attività produttive, agricoltura e ricerca]
- `C182` Protezione E Promozione Della Salute Umana [Attività produttive, agricoltura e ricerca]
- `C183` Strutture E Relazioni Sociali [Attività produttive, agricoltura e ricerca]
- `C230` Produzione E Trasferimento Nuovi Prodotti, Pratiche, Processi E Tecnologie Agricole, Forestali, Della Pesca E Dell'acquacoltura `✦` [Attività produttive, agricoltura e ricerca]
- `C231` Produzione E Tecnologie Industriali `✦` [Attività produttive, agricoltura e ricerca]
- `C232` Esplorazione E Utilizzazione Dello Spazio `✦` [Attività produttive, agricoltura e ricerca] — *Ricerca spaziale — ASI/ESA*

**SS41 — Progetti Di Ricerca E  Di Innovazione Presso Imprese** (9)

- `C184` Sperimentazione Soluzioni Innovative E Validazione Prodotti [Attività produttive, agricoltura e ricerca]
- `C185` Tecnologie Energetiche [Attività produttive, agricoltura e ricerca]
- `C236` Tecnologie Dei Nuovi Materiali `✦` [Attività produttive, agricoltura e ricerca]
- `C237` Tecnologie Delle Telecomunicazioni `✦` [Attività produttive, agricoltura e ricerca]
- `C238` Tecnologie Per La Salvaguardia Dell'ambiente `✦` [Attività produttive, agricoltura e ricerca]
- `C239` Tecnologie Aerospaziali `✦` [Attività produttive, agricoltura e ricerca] — *Tecnologie aerospaziali — fuori scope tipico comune*
- `C240` Innovazione Processi E Prodotti `✦` [Attività produttive, agricoltura e ricerca]
- `C241` Industrializzazione Risultati Della Ricerca `✦` [Attività produttive, agricoltura e ricerca]
- `C242` Altre Aree Tecnologiche `✦` [Attività produttive, agricoltura e ricerca]

**SS42 — Progetti Di Ricerca Presso Universita' E Istituti Di Ricerca** (5)

- `C186` Altre Ricerche [Attività produttive, agricoltura e ricerca]
- `C187` Infrastrutture E Pianificazione Del Territorio [Attività produttive, agricoltura e ricerca]
- `C233` Produzione E Tecnologie Agricole E Della Pesca E Acquacoltura `✦` [Attività produttive, agricoltura e ricerca]
- `C234` Produzione E Tecnologie Industriali `✦` [Attività produttive, agricoltura e ricerca]
- `C235` Esplorazione E Utilizzazione Dello Spazio `✦` [Attività produttive, agricoltura e ricerca] — *Ricerca spaziale universitaria*

### S10 — Servizi Per La P.A. E Per La Collettivita'

_2 sotto-settori · 7 categorie · 4 aggiunte in v2_

**SS43 — Altri Servizi Per La Collettivita'** (4)

- `C188` Altri Servizi Per La Collettivita' [Sicurezza, PA e sedi istituzionali]
- `C189` Assistenza Sociale Ed Altri Servizi Alla Persona [Sicurezza, PA e sedi istituzionali]
- `C248` Altri Servizi `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C249` Servizi Sanitari `✦` [— (servizi immateriali, nessun cluster fisico)]

**SS44 — Servizi Di Assistenza Tecnica Alla P.A.** (3)

- `C190` Altre Attivita' Di Consulenza E Assistenza Tecnica [Sicurezza, PA e sedi istituzionali]
- `C246` Potenziamento Dei Servizi All'impiego - Acquisizione Di Risorse `✦` [— (servizi immateriali, nessun cluster fisico)]
- `C247` Assistenza Tecnica Alla Preparazione, Realizzazione, E Sorveglianza E Valutazione (inclusa L'assistenza Per La Redazione Di Piani E Programmi) `✦` [— (servizi immateriali, nessun cluster fisico)]

---

## Cluster MCA — reference

Ogni categoria porta un `cluster_id` che la collega al cluster MCA di
appartenenza in OpenCore. I 13 cluster sono ottimizzati per omogeneità
del profilo di rischio fisico-costruttivo, non per affinità tematica.

| Cluster | Label | Settori prevalenti |
|---|---|---|
| `C01` | Infrastrutture stradali e mobilità | S03 |
| `C02` | Infrastrutture di trasporto specializzate | S03 |
| `C03` | Edifici scolastici e formativi | S06, S07 |
| `C04` | Strutture sociosanitarie e residenziali | S06 |
| `C05` | Edilizia residenziale pubblica | S06 |
| `C06` | Patrimonio culturale, sport e turismo | S06, S08 |
| `C07` | Difesa del suolo e rischio naturale | S01 |
| `C08` | Ciclo idrico, rifiuti e bonifica | S01 |
| `C09` | Verde, rigenerazione urbana e spazi pubblici | S01, S06 |
| `C10` | Reti e impianti energetici | S02 |
| `C11` | Infrastrutture digitali e ICT | S05 |
| `C12` | Attività produttive, agricoltura e ricerca | S04, S07, S08, S09 |
| `C13` | Sicurezza, PA e sedi istituzionali | S06, S10 |
| `NONE` | — (servizi immateriali, nessun cluster fisico) | S07, S09 (parziale), S10 (parziale) |

---

## Lookup helpers

```typescript
// Tutte le categorie di un settore
getCategoriesBySector(sector_code: string): ProjectCategory[]

// Tutte le categorie di un sotto-settore
getCategoriesBySubsector(subsector_code: string): ProjectCategory[]

// Tutte le categorie di un cluster MCA
getCategoriesByCluster(cluster_id: string): ProjectCategory[]

// Lookup per codice
getCategoryByCode(code: string): ProjectCategory | undefined
```

---

## Note di utilizzo

**Codici stabili.** I codici C### sono permanenti. Non rinumerare mai —
ogni codice è un foreign key in `fabbisogni.ts`, nei fattori di costo e
nel modulo DOCFAP. Aggiungere nuove categorie in coda (C286 in poi).

**Label in Title Case.** Le label sono in Title Case per coerenza con il
dataset CUP sorgente. La normalizzazione è applicata in fase di import,
non nelle query — usare confronti case-insensitive nei lookup.

**Categorie doppione per sotto-settore.** Alcune label compaiono in due
sotto-settori distinti (es. 'Impianti Depurazione Acque' in SS04 e SS04,
'Produzione E Tecnologie Industriali' in SS40 e SS42). Disambiguate con
un suffisso descrittivo nel campo label. Il codice C### è sempre univoco.

**`cluster_id = 'NONE'`.** Le categorie con cluster NONE non attivano
domande adattive nel wizard DOCFAP. Vengono valutate con la matrice
universale a 6 domande. Questo è by design, non un dato mancante.

**File di riconciliazione.** `MOP_Civiqa_Albero_Completo.xlsx` documenta
il mapping tra ogni codice CUP sorgente e il codice Civiqa C### corrispondente.
È il documento di riferimento per la verifica del mapping e per le future
aggiunte al dataset.

---

*OpenCore MOP Tree · schema v2 · Civiqa · Maggio 2026*