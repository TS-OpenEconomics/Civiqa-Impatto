import type { ClusterMCA } from "../../types/incroci"

export const CLUSTER_MCA: Record<string, ClusterMCA> = {
  "C01": {
    "id": "C01",
    "label": "Viabilità e mobilità stradale/urbana",
    "categorieIncluse": [
      "STRADE REGIONALI, PROVINCIALI E COMUNALI • PISTE CICLABILI • STRADE STATALI • STRADE RURALI • AUTOSTRADE • ALTRE STRUTTURE/INFRASTRUTTURE STRADALI • ALTRI STRUTTURE/INFRASTRUTTURE DI TRASPORTO URBANE • LINEE METROPOLITANE E TRAMVIARIE • SISTEMI DI PARCHEGGIO E INTERSCAMBIO • SISTEMI INTEGRATI E DI TRASPORTO INTELLIGENTI PER LA MOBILITA' SOSTENIBILE • FUNIVIE, SEGGIOVIE, FUNICOLARI • ALTRE MODALITA' DI TRASPORTO • TRASPORTI MULTIMODALI ED INTERPORTI"
    ],
    "criteriiKO": [
      {
        "id": "C01_KO_01",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "criterio": "Disponibilità area/sedime",
        "domanda": "L'area di sedime dell'intervento è nella piena disponibilità dell'ente o acquisibile entro i tempi del progetto",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Visura catastale, delibera consiliare"
      },
      {
        "id": "C01_KO_02",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "criterio": "Conformità PRG/PGT",
        "domanda": "L'intervento è compatibile con le previsioni dello strumento urbanistico vigente o non richiede variante sostanziale",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica PRG/PGT comunale"
      },
      {
        "id": "C01_KO_03",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "criterio": "Assenza vincoli ostativi",
        "domanda": "L'area non è soggetta a vincoli che impediscano l'intervento (PAI, vincolo idrogeologico assoluto, beni demaniali non cedibili)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Piano stralcio PAI, catasto vincoli"
      },
      {
        "id": "C01_KO_04",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "criterio": "Capienza bilancio pluriennale",
        "domanda": "Il CAPEX stimato è coperto da fonti finanziarie identificate nel bilancio pluriennale o in programmi di finanziamento attivi",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio pluriennale, avviso finanziamento"
      },
      {
        "id": "C01_KO_05",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "criterio": "Coerenza Piano Triennale OO.PP.",
        "domanda": "L'intervento è inserito o inseribile nel Piano Triennale delle Opere Pubbliche dell'ente",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Piano Triennale OO.PP. vigente"
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C01_Q_06",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "criterio": "Riduzione incidentalità e sicurezza utenti",
        "domanda": "Impatto atteso sulla riduzione di incidenti e sull'aumento della sicurezza di pedoni, ciclisti e automobilisti",
        "pesoDefault": "25%",
        "logicaPunteggio": "Alto=riduzione stimata >30%; Medio=10-30%; Basso=<10%",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C01_Q_07",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "criterio": "Continuità e accessibilità della rete",
        "domanda": "Grado di miglioramento della connettività della rete viaria/ciclabile e riduzione di discontinuità strutturali",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=chiude un gap strategico di rete; Medio=migliora tratto esistente; Basso=intervento puntuale",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C01_Q_08",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "criterio": "Impatto sulla mobilità sostenibile",
        "domanda": "Capacità dell'intervento di favorire modal shift verso mobilità attiva e trasporto pubblico",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=incentiva fortemente TPL/bici; Medio=neutro; Basso=incentiva uso auto privata",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C01_Q_09",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "criterio": "Tempi di realizzazione",
        "domanda": "Realizzabilità entro i vincoli temporali di eventuali finanziamenti e della programmazione comunale",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=<18 mesi; Medio=18-36 mesi; Basso=>36 mesi",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C01_Q_10",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "criterio": "Coerenza con strumenti di pianificazione",
        "domanda": "Allineamento con PUMS, PGTU, DUP e altri strumenti di programmazione della mobilità",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=previsto esplicitamente da più strumenti; Medio=coerente; Basso=non citato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C01_Q_11",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "criterio": "Sinergie con altri interventi in portafoglio",
        "domanda": "Complementarietà con altri interventi già finanziati o in programma che ne amplificano l'efficacia",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=sblocca o completa un sistema di interventi; Medio=connesso ad altri; Basso=stand-alone",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C01_R_01",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "categoriaRischio": "Rischio tecnico-progettuale",
        "fattore": "Interferenze con sottoservizi (gas, acqua, TLC, elettricità)",
        "pesoDefault": 20,
        "descrizione": "Presenza di reti interrate non mappate che causano varianti in corso d'opera%",
        "mitigazioneSuggerita": "Catasto reti, sopralluogo con gestori"
      },
      {
        "id": "C01_R_02",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "categoriaRischio": "Rischio tecnico-progettuale",
        "fattore": "Inadeguatezza del progetto definitivo/esecutivo",
        "pesoDefault": 15,
        "descrizione": "Carenze progettuali che richiedono revisioni e allungamento dei tempi%",
        "mitigazioneSuggerita": "Qualità documentazione progettuale"
      },
      {
        "id": "C01_R_03",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "categoriaRischio": "Rischio autorizzativo",
        "fattore": "Ritardi nell'acquisizione di pareri e autorizzazioni",
        "pesoDefault": 20,
        "descrizione": "Ritardi da parte di Soprintendenza, ANAS, Ferrovie, gestori reti%",
        "mitigazioneSuggerita": "Stato iter autorizzativo al momento della gara"
      },
      {
        "id": "C01_R_04",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "categoriaRischio": "Rischio di cantiere",
        "fattore": "Rinvenimento di ordigni bellici o reperti archeologici",
        "pesoDefault": 10,
        "descrizione": "Presenza di aree storicamente sensibili lungo il tracciato%",
        "mitigazioneSuggerita": "Verifica Soprintendenza, mappatura storica"
      },
      {
        "id": "C01_R_05",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Variazione dei costi delle materie prime (bitume, acciaio, cls)",
        "pesoDefault": 20,
        "descrizione": "Fluttuazione dei prezzi che supera il CAM e i prezzari regionali%",
        "mitigazioneSuggerita": "Monitoraggio prezzi DEI, clausole contrattuali revisione prezzi"
      },
      {
        "id": "C01_R_06",
        "clusterId": "C01",
        "clusterLabel": "Viabilità e mobilità stradale/urbana",
        "categoriaRischio": "Rischio di accettabilità sociale",
        "fattore": "Opposizione dei residenti o commercianti durante i lavori",
        "pesoDefault": 15,
        "descrizione": "Impatto dei cantieri sulla viabilità e sulle attività economiche limitrofe%",
        "mitigazioneSuggerita": "Consultazione preventiva, piano gestione cantiere"
      }
    ]
  },
  "C02": {
    "id": "C02",
    "label": "Trasporto maggiore (ferro, porto, aeroporto)",
    "categorieIncluse": [
      "LINEE FERROVIARIE • ALTRE STRUTTURE/INFRASTRUTTURE FERROVIARIE • STAZIONE E TERMINALI • PORTI COMMERCIALI • PORTI TURISTICI • ALTRE STRUTTURE/INFRASTRUTTURE MARITTIME E FLUVIALI • PORTI PER LA PESCA • IDROVIE E STRUTTURE/INFRASTRUTTURE FLUVIALI • ALTRE STRUTTURE/INFRASTRUTTURE AEROPORTUALI • PISTE • AEROSTAZIONI"
    ],
    "criteriiKO": [
      {
        "id": "C02_KO_01",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "criterio": "Competenza e titolarità dell'ente",
        "domanda": "L'ente ha competenza diretta sull'infrastruttura (o delega formale da ente competente)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Decreto di concessione, accordo istituzionale"
      },
      {
        "id": "C02_KO_02",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "criterio": "Conformità pianificazione settoriale nazionale",
        "domanda": "L'intervento è coerente con i piani nazionali di settore (PNI ferroviario, Piano portuale, Piano aeroporti ENAC)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "PNI, Piano portuale regionale, Piano aeroporti ENAC"
      },
      {
        "id": "C02_KO_03",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "criterio": "Disponibilità area/sedime o concessione demaniale",
        "domanda": "Presenza di titolo formale sull'area o procedura avanzata per acquisizione/concessione demaniale",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Concessione demaniale, visura catastale"
      },
      {
        "id": "C02_KO_04",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "criterio": "Capienza bilancio e copertura finanziaria",
        "domanda": "Il CAPEX è coperto da fonti identificate (fondi UE, PNRR, fondi nazionali settoriali)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio pluriennale, avviso finanziamento"
      },
      {
        "id": "C02_KO_05",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "criterio": "Conformità normativa tecnica di settore",
        "domanda": "L'intervento rispetta le norme tecniche specifiche (RFI per ferrovie, ICAO/ENAC per aeroporti, Codice della Navigazione per porti)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica normativa RFI/ENAC/ENAV/AdSP"
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C02_Q_06",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "criterio": "Impatto su volumi di traffico/passeggeri",
        "domanda": "Incremento atteso di passeggeri, merci o movimenti gestibili dall'infrastruttura",
        "pesoDefault": "25%",
        "logicaPunteggio": "Alto=>20% incremento capacità; Medio=5-20%; Basso=<5%",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C02_Q_07",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "criterio": "Riduzione tempi e costi di trasporto",
        "domanda": "Risparmio stimato in termini di tempo di percorrenza e costi operativi per utenti e operatori",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=riduzione >15% tempi/costi; Medio=5-15%; Basso=<5%",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C02_Q_08",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "criterio": "Integrazione intermodale",
        "domanda": "Capacità di connettere e integrare diversi modi di trasporto (ferro-gomma, porto-ferrovia, etc.)",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=crea nuovo nodo intermodale; Medio=migliora connessione esistente; Basso=solo potenziamento modale",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C02_Q_09",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "criterio": "Tempi di realizzazione e complessità",
        "domanda": "Stima realistica dei tempi tenuto conto della complessità autorizzativa e cantieristica",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=<24 mesi; Medio=24-48 mesi; Basso=>48 mesi",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C02_Q_10",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "criterio": "Impatto ambientale e accettabilità sociale",
        "domanda": "Entità degli impatti ambientali e livello di consenso/opposizione atteso sul territorio",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=impatto trascurabile, largo consenso; Medio=impatti limitati e gestibili; Basso=impatti rilevanti o opposizione attesa",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C02_Q_11",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "criterio": "Coerenza con obiettivi di mandato e DUP",
        "domanda": "Allineamento esplicito con gli obiettivi strategici del mandato amministrativo e con il DUP",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=citato esplicitamente nel DUP con priorità alta; Medio=coerente; Basso=non citato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C02_R_01",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "categoriaRischio": "Rischio autorizzativo-regolatorio",
        "fattore": "Mancato ottenimento o ritardo delle autorizzazioni ministeriali/demaniali",
        "pesoDefault": 25,
        "descrizione": "Procedimenti complessi con MIT, ENAC, AdSP, RFI che bloccano l'avanzamento%",
        "mitigazioneSuggerita": "Stato iter autorizzativo, precedenti analoghi"
      },
      {
        "id": "C02_R_02",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "categoriaRischio": "Rischio tecnico-progettuale",
        "fattore": "Complessità tecnica e interfacce con sistemi esistenti",
        "pesoDefault": 20,
        "descrizione": "Interfacce con reti segnalamento ferroviario, sistemi ATM portuale, ILS aeroportuale%",
        "mitigazioneSuggerita": "Audit tecnico, compatibilità normativa"
      },
      {
        "id": "C02_R_03",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Superamento del quadro economico per varianti tecniche",
        "pesoDefault": 20,
        "descrizione": "Complessità costruttiva non prevista in fase progettuale%",
        "mitigazioneSuggerita": "Qualità analisi geotecnica e strutturale"
      },
      {
        "id": "C02_R_04",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "categoriaRischio": "Rischio ambientale",
        "fattore": "Impatti ambientali non previsti (dragaggi, rumore, scarichi)",
        "pesoDefault": 15,
        "descrizione": "Rinvenimento di sedimenti contaminati o impatti acustici superiori ai limiti%",
        "mitigazioneSuggerita": "VIA, caratterizzazione ambientale preventiva"
      },
      {
        "id": "C02_R_05",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "categoriaRischio": "Rischio di mercato",
        "fattore": "Numero insufficiente di offerte in gara o offerte anomale",
        "pesoDefault": 10,
        "descrizione": "Mercato poco concorrenziale per lavorazioni specialistiche%",
        "mitigazioneSuggerita": "Analisi di mercato, suddivisione lotti"
      },
      {
        "id": "C02_R_06",
        "clusterId": "C02",
        "clusterLabel": "Trasporto maggiore (ferro, porto, aeroporto)",
        "categoriaRischio": "Rischio operativo post-cantiere",
        "fattore": "Difficoltà nella gestione della fase di collaudo e messa in esercizio",
        "pesoDefault": 10,
        "descrizione": "Complessità dei test di sistema e delle interfacce operative%",
        "mitigazioneSuggerita": "Piano di commissioning, gestione RFI/ENAC"
      }
    ]
  },
  "C03": {
    "id": "C03",
    "label": "Edilizia scolastica e strutture sociali",
    "categorieIncluse": [
      "EDIFICI SOCIALI, CULTURALI E ASSISTENZIALI • SCUOLE ELEMENTARI, MEDIE E SUPERIORI • UNIVERSITA' • SCUOLE MATERNE • ASILI NIDO • SERVIZI PER L'INFANZIA • ALTRI SOSTEGNI PER IL MERCATO DEL LAVORO"
    ],
    "criteriiKO": [
      {
        "id": "C03_KO_01",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "criterio": "Proprietà/disponibilità dell'edificio",
        "domanda": "L'edificio è di proprietà dell'ente o in uso esclusivo con titolo formale (comodato, concessione) per almeno 20 anni",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Visura catastale, atto notarile, contratto uso"
      },
      {
        "id": "C03_KO_02",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "criterio": "Conformità PRG e destinazione d'uso",
        "domanda": "L'intervento è compatibile con la destinazione urbanistica e non richiede cambio d'uso sostanziale",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica PRG/PGT, parere urbanistico"
      },
      {
        "id": "C03_KO_03",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "criterio": "Normativa antisismica e sicurezza strutturale",
        "domanda": "L'intervento prevede adeguamento ai requisiti antisismici vigenti (NTC 2018) o verifica documentata di conformità",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Relazione tecnica sismica, certificato collaudo statico"
      },
      {
        "id": "C03_KO_04",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "criterio": "Capienza bilancio e fonte finanziaria",
        "domanda": "Copertura finanziaria del CAPEX identificata e compatibile con la capacità dell'ente",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio pluriennale, decreto finanziamento"
      },
      {
        "id": "C03_KO_05",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "criterio": "Coerenza con Piano Triennale OO.PP.",
        "domanda": "L'intervento è inserito o inseribile nel Piano Triennale",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Piano Triennale OO.PP."
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C03_Q_07",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "criterio": "Qualità degli standard edilizi e normativi",
        "domanda": "Miglioramento verso standard edilizi, igienico-sanitari e di accessibilità più elevati rispetto allo stato attuale",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=raggiunge piena conformità a tutti gli standard; Medio=conformità parziale; Basso=conformità ai soli standard minimi",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C03_Q_08",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "criterio": "Efficienza energetica Edifici",
        "domanda": "Classe energetica attesa e riduzione dei consumi operativi rispetto allo stato attuale",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=almeno classe B o miglioramento di 2+ classi; Medio=miglioramento 1 classe; Basso=nessun miglioramento significativo",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C03_Q_09",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "criterio": "Tempi di realizzazione",
        "domanda": "Compatibilità con i tempi di eventuali finanziamenti e con la continuità del servizio educativo/sociale",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=<18 mesi senza interruzione servizio; Medio=18-36 mesi con interruzione gestita; Basso=>36 mesi o interruzione critica",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C03_Q_10",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "criterio": "Coerenza con obiettivi di mandato e DUP",
        "domanda": "Allineamento con la programmazione demografica, scolastica e sociale del comune",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=risponde a fabbisogno documentato e prioritario nel DUP; Medio=coerente; Basso=non citato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C03_Q_11",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "criterio": "Sinergie con servizi socio-educativi del territorio",
        "domanda": "Complementarietà con altri servizi educativi, sociali e culturali presenti nel territorio che ne amplificano l'impatto",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=consolida polo di servizi; Medio=integra offerta esistente; Basso=stand-alone",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C03_Q_12",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "criterio": "Dipendenze da servizi erogati da privati",
        "domanda": "Grado di dipendenza dell'intervento da soggetti privati per l'erogazione continuativa del servizio",
        "pesoDefault": "25%",
        "logicaPunteggio": "Alto=nessuna dipendenza, servizio interamente pubblico; Medio=dipendenza parziale con contratto pluriennale; Basso=dipendenza strutturale da privati senza garanzie di continuità",
        "fonteVerifica": "Analisi contrattuale e valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C03_R_01",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "categoriaRischio": "Rischio strutturale e sismico",
        "fattore": "Scoperta di criticità strutturali non rilevate in fase progettuale",
        "pesoDefault": 25,
        "descrizione": "Presenza di materiali pericolosi (amianto, CCA) o di vulnerabilità strutturali non emerse dal quadro conoscitivo%",
        "mitigazioneSuggerita": "Indagini diagnostiche preventive approfondite"
      },
      {
        "id": "C03_R_02",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "categoriaRischio": "Rischio autorizzativo",
        "fattore": "Ritardi nell'ottenimento del parere della Soprintendenza o dell'USCA",
        "pesoDefault": 15,
        "descrizione": "Edifici vincolati o in aree soggette a tutela paesaggistica%",
        "mitigazioneSuggerita": "Verifica vincoli, avvio preventivo procedimento"
      },
      {
        "id": "C03_R_03",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "categoriaRischio": "Rischio di interruzione del servizio educativo",
        "fattore": "Difficoltà nella gestione della continuità didattica durante i lavori",
        "pesoDefault": 20,
        "descrizione": "Mancanza di spazi alternativi adeguati per le classi durante la ristrutturazione%",
        "mitigazioneSuggerita": "Piano gestione continuità servizio, accordi con Provveditorato"
      },
      {
        "id": "C03_R_04",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Variazione dei costi per materiali e manodopera specializzata",
        "pesoDefault": 15,
        "descrizione": "Incremento prezzi in mercato edilizio scolastico (antisismico, impiantistica)%",
        "mitigazioneSuggerita": "Clausole revisione prezzi, prezzario regionale aggiornato"
      },
      {
        "id": "C03_R_05",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "categoriaRischio": "Rischio di ritardo cantiere",
        "fattore": "Ritardi nell'avvio lavori per difficoltà di accesso al cantiere",
        "pesoDefault": 15,
        "descrizione": "Necessità di coordinare con orario scolastico e con gli utenti dell'edificio%",
        "mitigazioneSuggerita": "Cronoprogramma dettagliato, fasi estive di cantiere"
      },
      {
        "id": "C03_R_06",
        "clusterId": "C03",
        "clusterLabel": "Edilizia scolastica e strutture sociali",
        "categoriaRischio": "Rischio progettuale",
        "fattore": "Carenze nel quadro conoscitivo dell'edificio (rilievi, stratigrafie)",
        "pesoDefault": 10,
        "descrizione": "Edifici datati con scarsa documentazione tecnica esistente%",
        "mitigazioneSuggerita": "Rilievo diagnostico preventivo completo"
      }
    ]
  },
  "C04": {
    "id": "C04",
    "label": "Sanitario",
    "categorieIncluse": [
      "ALTRE STRUTTURE SANITARIE • STRUTTURE OSPEDALIERE • ALTRI PRESIDI SANITARI TERRITORIALI • RESIDENZE SANITARIE ASSISTENZIALI • ALTRE STRUTTURE PER L'IGIENE LA PROFILASSI E LA TUTELA DELLA SALUTE"
    ],
    "criteriiKO": [
      {
        "id": "C04_KO_01",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "criterio": "Proprietà/disponibilità dell'edificio",
        "domanda": "L'edificio è di proprietà pubblica o dell'ente gestore del SSN/SSR con titolo formale",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Visura catastale, atto di proprietà ASL/AO"
      },
      {
        "id": "C04_KO_02",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "criterio": "Conformità requisiti accreditamento regionale",
        "domanda": "L'intervento mantiene o migliora i requisiti strutturali e tecnologici per l'accreditamento regionale (DM 70/2015 e normativa regionale)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica requisiti accreditamento, parere regionale"
      },
      {
        "id": "C04_KO_03",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "criterio": "Normativa antisismica",
        "domanda": "L'intervento prevede adeguamento NTC 2018 o verifica documentata",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Relazione sismica, certificato collaudo"
      },
      {
        "id": "C04_KO_04",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "criterio": "Capienza bilancio e fonte finanziaria",
        "domanda": "Copertura CAPEX identificata (fondi nazionali, PNRR, fondi regionali sanità)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio, decreto riparto fondi sanità"
      },
      {
        "id": "C04_KO_05",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "criterio": "Conformità normativa igienico-sanitaria",
        "domanda": "L'intervento rispetta il DPR 14/01/1997 e le linee guida regionali per le strutture sanitarie",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Parere ASL/ATS, verifica normativa"
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C04_Q_06",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "criterio": "Adeguatezza funzionale alla domanda sanitaria",
        "domanda": "Grado di risposta al fabbisogno sanitario del bacino di utenza (posti letto, ambulatori, prestazioni)",
        "pesoDefault": "30%",
        "logicaPunteggio": "Alto=copre fabbisogno documentato non soddisfatto; Medio=migliora offerta esistente; Basso=potenziamento marginale",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C04_Q_07",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "criterio": "Sicurezza strutturale e rischio sismico",
        "domanda": "Livello di miglioramento della classe di rischio sismico dell'edificio",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=da classe D/E a B o superiore; Medio=miglioramento di 1 classe; Basso=nessun miglioramento strutturale",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C04_Q_08",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "criterio": "Efficienza energetica e sostenibilità",
        "domanda": "Riduzione dei consumi energetici dell'edificio sanitario",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=riduzione >30% consumi; Medio=10-30%; Basso=<10%",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C04_Q_09",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "criterio": "Tempi di realizzazione con continuità del servizio",
        "domanda": "Realizzabilità minimizzando l'interruzione dei servizi sanitari erogati",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=nessuna interruzione; Medio=interruzione parziale e gestita; Basso=interruzione significativa",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C04_Q_10",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "criterio": "Coerenza con programmazione regionale sanitaria",
        "domanda": "Allineamento con il Piano sanitario regionale e gli atti di programmazione ASL/AO",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=previsto esplicitamente nel piano regionale; Medio=coerente; Basso=non citato o in conflitto",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C04_R_01",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "categoriaRischio": "Rischio strutturale e impiantistico",
        "fattore": "Scoperta di criticità strutturali o impiantistiche non note in struttura sanitaria attiva",
        "pesoDefault": 25,
        "descrizione": "Amianto, vulnerabilità sismiche, impianti non conformi alle norme sanitarie%",
        "mitigazioneSuggerita": "Indagini diagnostiche approfondite, audit impiantistico"
      },
      {
        "id": "C04_R_02",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "categoriaRischio": "Rischio di continuità del servizio sanitario",
        "fattore": "Difficoltà nella gestione della continuità delle cure durante i lavori",
        "pesoDefault": 30,
        "descrizione": "Impossibilità di interrompere servizi critici (PS, terapie intensive, sale operatorie)%",
        "mitigazioneSuggerita": "Piano di fasing con ASL/AO, spazi sostitutivi, accordi con strutture vicine"
      },
      {
        "id": "C04_R_03",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "categoriaRischio": "Rischio autorizzativo-sanitario",
        "fattore": "Ritardi nell'ottenimento dei pareri ASL, ATS e autorizzazioni sanitarie regionali",
        "pesoDefault": 20,
        "descrizione": "Procedure di accreditamento che richiedono collaudi specifici e tempi lunghi%",
        "mitigazioneSuggerita": "Avvio preventivo iter autorizzativo con ASL/Regione"
      },
      {
        "id": "C04_R_04",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Variazione dei costi per tecnologie medicali e impiantistica specializzata",
        "pesoDefault": 15,
        "descrizione": "Fluttuazione prezzi attrezzature biomediche e impianti gas medicali%",
        "mitigazioneSuggerita": "Analisi di mercato, contratti quadro"
      },
      {
        "id": "C04_R_05",
        "clusterId": "C04",
        "clusterLabel": "Sanitario",
        "categoriaRischio": "Rischio reputazionale",
        "fattore": "Impatto della comunicazione dei lavori sugli utenti e sulla percezione del servizio",
        "pesoDefault": 10,
        "descrizione": "Percezione di riduzione della qualità del servizio durante i lavori%",
        "mitigazioneSuggerita": "Piano di comunicazione, gestione URP"
      }
    ]
  },
  "C05": {
    "id": "C05",
    "label": "Edilizia residenziale pubblica",
    "categorieIncluse": [
      "FABBRICATI RESIDENZIALI URBANI • ABITAZIONI RURALI E BORGHI RURALI • RESIDENZE PER COMUNITA' • ALTRI EDIFICI ABITATIVI • EDIFICI DANNEGGIATI DA CALAMITA' NATURALI • INFRASTRUTTURE CIVILI PER COMPLESSI RESIDENZIALI"
    ],
    "criteriiKO": [
      {
        "id": "C05_KO_01",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "criterio": "Proprietà/disponibilità dell'area o edificio",
        "domanda": "L'ente ha titolo formale sull'area o sull'edificio oggetto dell'intervento",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Visura catastale, delibera assegnazione ALER/ERPS"
      },
      {
        "id": "C05_KO_02",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "criterio": "Conformità PRG e destinazione residenziale",
        "domanda": "L'intervento è compatibile con la zonizzazione residenziale dello strumento urbanistico",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica PRG/PGT"
      },
      {
        "id": "C05_KO_03",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "criterio": "Normativa antisismica",
        "domanda": "L'intervento prevede adeguamento NTC 2018 per edifici esistenti o progettazione adeguata per il nuovo",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Relazione sismica"
      },
      {
        "id": "C05_KO_04",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "criterio": "Capienza bilancio e fonte finanziaria",
        "domanda": "Copertura CAPEX identificata (Fondo Nazionale per l'Abitare, fondi regionali ERP, PNRR M5C2)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio, decreti MIMS/Regione"
      },
      {
        "id": "C05_KO_05",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "criterio": "Coerenza con Piano Casa o programma ERP",
        "domanda": "L'intervento è previsto o coerente con il Piano Casa regionale o il programma ERP dell'ente",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Piano Casa regionale, delibera ERP"
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C05_Q_06",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "criterio": "Risposta al fabbisogno abitativo documentato",
        "domanda": "Grado di riduzione della lista di attesa ERP o del disagio abitativo nel comune",
        "pesoDefault": "25%",
        "logicaPunteggio": "Alto=riduce lista d'attesa di >20%; Medio=5-20%; Basso=<5%",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C05_Q_07",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "criterio": "Qualità abitativa e standard normativi",
        "domanda": "Miglioramento verso standard abitativi, igienico-sanitari e di accessibilità più elevati",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=raggiunge tutti gli standard DM 5/7/1975 e accessibilità; Medio=conformità parziale; Basso=solo minimi",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C05_Q_08",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "criterio": "Efficienza energetica",
        "domanda": "Classe energetica attesa post-intervento",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=classe A o A+; Medio=classe B o C; Basso=classe D o inferiore",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C05_Q_09",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "criterio": "Tempi di realizzazione",
        "domanda": "Compatibilità con i tempi di finanziamento e con le esigenze degli assegnatari/inquilini",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=<24 mesi; Medio=24-42 mesi; Basso=>42 mesi",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C05_Q_10",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "criterio": "Inclusione sociale e mix abitativo",
        "domanda": "Capacità dell'intervento di favorire mix sociale e integrazione di categorie fragili",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=prevede quote per fragili+mix sociale; Medio=prevede quote fragili; Basso=nessuna quota specifica",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C05_Q_11",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "criterio": "Coerenza con obiettivi DUP e mandato",
        "domanda": "Allineamento con le politiche abitative del mandato comunale",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=obiettivo esplicito del mandato; Medio=coerente; Basso=non citato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C05_R_01",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "categoriaRischio": "Rischio strutturale e sismico",
        "fattore": "Scoperta di criticità strutturali o di materiali pericolosi in edifici esistenti",
        "pesoDefault": 25,
        "descrizione": "Amianto, PCB, vulnerabilità sismiche non emerse dal quadro conoscitivo%",
        "mitigazioneSuggerita": "Indagini diagnostiche preventive, rilievo amianto"
      },
      {
        "id": "C05_R_02",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "categoriaRischio": "Rischio di gestione degli occupanti",
        "fattore": "Difficoltà nel garantire sistemazione alternativa agli assegnatari durante i lavori",
        "pesoDefault": 20,
        "descrizione": "Mancanza di alloggi sostitutivi adeguati nel patrimonio ERP dell'ente%",
        "mitigazioneSuggerita": "Piano di rilascio e reinsediamento, accordi con ALER/ERPS"
      },
      {
        "id": "C05_R_03",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Variazione dei costi di costruzione/ristrutturazione",
        "pesoDefault": 15,
        "descrizione": "Incremento prezzi mercato edilizio residenziale%",
        "mitigazioneSuggerita": "Revisione prezzi contrattuale, prezzario aggiornato"
      },
      {
        "id": "C05_R_04",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "categoriaRischio": "Rischio autorizzativo-urbanistico",
        "fattore": "Ritardi nell'iter di approvazione per varianti o permessi di costruire",
        "pesoDefault": 15,
        "descrizione": "Complessità delle procedure per interventi su patrimonio esistente in aree vincolate%",
        "mitigazioneSuggerita": "Avvio preventivo iter, verifica vincoli"
      },
      {
        "id": "C05_R_05",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "categoriaRischio": "Rischio di mercato",
        "fattore": "Numero insufficiente di imprese qualificate per le specifiche tecniche richieste",
        "pesoDefault": 15,
        "descrizione": "Mercato locale non sufficientemente competitivo per interventi specializzati%",
        "mitigazioneSuggerita": "Analisi di mercato, suddivisione lotti"
      },
      {
        "id": "C05_R_06",
        "clusterId": "C05",
        "clusterLabel": "Edilizia residenziale pubblica",
        "categoriaRischio": "Rischio sociale post-intervento",
        "fattore": "Difficoltà di gestione del reinsediamento e del mix sociale atteso",
        "pesoDefault": 10,
        "descrizione": "Conflittualità tra assegnatari storici e nuovi assegnatari%",
        "mitigazioneSuggerita": "Piano di accompagnamento sociale, servizi di mediazione"
      }
    ]
  },
  "C06": {
    "id": "C06",
    "label": "Sport, cultura e tempo libero",
    "categorieIncluse": [
      "IMPIANTI SPORTIVI • ALTRE STRUTTURE RICREATIVE • STRUTTURE FIERISTICHE E CONGRESSUALI • TEATRI ED ALTRE STRUTTURE PER LO SPETTACOLO • AREE ARCHEOLOGICHE • MONUMENTI • RESTAURO E RIQUALIFICAZIONE DI BENI CULTURALI • MUSEI ARCHIVI E BIBLIOTECHE • PATRIMONIO RURALE"
    ],
    "criteriiKO": [
      {
        "id": "C06_KO_01",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "criterio": "Proprietà/disponibilità dell'area o edificio",
        "domanda": "L'ente ha titolo formale sull'immobile o sull'area",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Visura catastale, atto di proprietà/concessione"
      },
      {
        "id": "C06_KO_02",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "criterio": "Conformità PRG e destinazione d'uso",
        "domanda": "Compatibilità urbanistica dell'intervento con la destinazione d'uso (sport, cultura, spettacolo)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica PRG/PGT, NTA"
      },
      {
        "id": "C06_KO_03",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "criterio": "Rispetto normativa vincoli culturali (se applicabile)",
        "domanda": "Per beni culturali: presenza di nulla osta della Soprintendenza o avvio formale del procedimento",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Parere/autorizzazione Soprintendenza"
      },
      {
        "id": "C06_KO_04",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "criterio": "Capienza bilancio e fonte finanziaria",
        "domanda": "Copertura CAPEX identificata (fondi Ministero Cultura, Sport e Salute, fondi regionali, PNRR)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio, decreti ministeriali"
      },
      {
        "id": "C06_KO_05",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "criterio": "Coerenza Piano Triennale OO.PP.",
        "domanda": "L'intervento è inserito o inseribile nel Piano Triennale",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Piano Triennale OO.PP."
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C06_Q_06",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "criterio": "Domanda e utilizzo potenziale dell'infrastruttura",
        "domanda": "Stima del numero di utenti/fruitori attesi e del tasso di utilizzo dell'infrastruttura",
        "pesoDefault": "25%",
        "logicaPunteggio": "Alto=>500 utenti/settimana o >80% capienza; Medio=200-500 o 50-80%; Basso=<200 o <50%",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C06_Q_07",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "criterio": "Stato di conservazione e sicurezza attuale",
        "domanda": "Livello di degrado dell'infrastruttura esistente e urgenza dell'intervento per la sicurezza",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=struttura inagibile o a rischio imminente; Medio=degrado significativo; Basso=degrado lieve",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C06_Q_08",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "criterio": "Efficienza energetica",
        "domanda": "Riduzione attesa dei consumi energetici post-intervento",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=riduzione >30%; Medio=10-30%; Basso=<10%",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C06_Q_09",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "criterio": "Valore identitario e culturale per la comunità",
        "domanda": "Rilevanza dell'infrastruttura per l'identità culturale e la coesione sociale del territorio",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=riferimento identitario riconosciuto dalla comunità; Medio=rilevante per fasce specifiche; Basso=interesse limitato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C06_Q_10",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "criterio": "Tempi di realizzazione",
        "domanda": "Compatibilità con i tempi di finanziamento e con la continuità delle attività",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=<18 mesi; Medio=18-36 mesi; Basso=>36 mesi",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C06_Q_11",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "criterio": "Coerenza con DUP e obiettivi di mandato",
        "domanda": "Allineamento con la programmazione culturale, sportiva e turistica dell'ente",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=previsto nel DUP con priorità alta; Medio=coerente; Basso=non citato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C06_R_01",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "categoriaRischio": "Rischio autorizzativo-culturale",
        "fattore": "Ritardi o dinieghi da parte della Soprintendenza per beni vincolati",
        "pesoDefault": 25,
        "descrizione": "Procedimento complesso per interventi su beni monumentali, aree archeologiche, edifici storici%",
        "mitigazioneSuggerita": "Avvio preventivo procedimento Soprintendenza, progetto preliminare condiviso"
      },
      {
        "id": "C06_R_02",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "categoriaRischio": "Rischio di scoperta di reperti archeologici",
        "fattore": "Rinvenimento di reperti in fase di cantiere che blocca i lavori",
        "pesoDefault": 20,
        "descrizione": "Aree con elevata densità storica o precedenti rinvenimenti documentati%",
        "mitigazioneSuggerita": "Indagine preventiva, accordo con Soprintendenza su gestione rinvenimenti"
      },
      {
        "id": "C06_R_03",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "categoriaRischio": "Rischio strutturale",
        "fattore": "Scoperta di criticità strutturali non note in edifici storici",
        "pesoDefault": 20,
        "descrizione": "Edifici datati con scarsa documentazione tecnica e materiali di costruzione tradizionali%",
        "mitigazioneSuggerita": "Indagini diagnostiche approfondite, sondaggi murari"
      },
      {
        "id": "C06_R_04",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Variazione dei costi per materiali tradizionali e manodopera specializzata (restauro)",
        "pesoDefault": 15,
        "descrizione": "Mercato limitato per lavoratori specializzati nel restauro conservativo%",
        "mitigazioneSuggerita": "Analisi di mercato, riserva contingency >15%"
      },
      {
        "id": "C06_R_05",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "categoriaRischio": "Rischio di domanda post-intervento",
        "fattore": "Utilizzo effettivo dell'infrastruttura inferiore alle previsioni",
        "pesoDefault": 10,
        "descrizione": "Sovrastima della domanda di utilizzo post-intervento%",
        "mitigazioneSuggerita": "Analisi di domanda, piano di gestione e animazione"
      },
      {
        "id": "C06_R_06",
        "clusterId": "C06",
        "clusterLabel": "Sport, cultura e tempo libero",
        "categoriaRischio": "Rischio di cantiere",
        "fattore": "Difficoltà logistiche in area urbana storica",
        "pesoDefault": 10,
        "descrizione": "Limitazioni di accesso, orari di cantiere, impatto sul traffico e sul turismo%",
        "mitigazioneSuggerita": "Piano di gestione cantiere urbano"
      }
    ]
  },
  "C07": {
    "id": "C07",
    "label": "Difesa del suolo e delle acque",
    "categorieIncluse": [
      "ALTRE INFRASTRUTTURE/STRUTTURE DI DIFESA DEL SUOLO • FORESTE • REGIMAZIONE ACQUE • SPIAGGE • CORSI D'ACQUA • ABITATI • BONIFICA DI SITI • STRUTTURE/INFRASTRUTTURE A RISCHIO SISMICO"
    ],
    "criteriiKO": [
      {
        "id": "C07_KO_01",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "criterio": "Compatibilità con PAI e pianificazione di bacino",
        "domanda": "L'intervento è compatibile con il Piano di Assetto Idrogeologico dell'Autorità di Bacino o è specificamente previsto da esso",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica PAI, parere Autorità di Bacino"
      },
      {
        "id": "C07_KO_02",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "criterio": "Nulla osta idraulico e autorizzazione regionale",
        "domanda": "Presenza di nulla osta idraulico o avvio formale del procedimento autorizzativo presso Regione/Genio Civile",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Nulla osta idraulico, parere Genio Civile"
      },
      {
        "id": "C07_KO_03",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "criterio": "Capienza bilancio e fonte finanziaria",
        "domanda": "Copertura CAPEX identificata (fondi nazionali dissesto, fondi regionali, PNRR M2C4)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio, decreti MIMS/Regione dissesto"
      },
      {
        "id": "C07_KO_04",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "criterio": "Assenza interferenze con vincoli demaniali insuperabili",
        "domanda": "L'intervento non è bloccato da vincoli demaniali marittimi, fluviali o lacuali non risolvibili",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica demanio, catasto vincoli"
      },
      {
        "id": "C07_KO_05",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "criterio": "Coerenza con pianificazione regionale/bacino",
        "domanda": "L'intervento è coerente con il Piano di Gestione del Rischio Alluvioni (PGRA) e il Piano di Gestione Siccità",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "PGRA, Piano Gestione Siccità"
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C07_Q_06",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "criterio": "Riduzione del rischio idrogeologico",
        "domanda": "Livello di riduzione attesa del rischio per abitati, infrastrutture e persone",
        "pesoDefault": "35%",
        "logicaPunteggio": "Alto=elimina o riduce drasticamente il rischio in area classificata R3/R4; Medio=riduce rischio in area R2/R3; Basso=riduzione marginale",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C07_Q_07",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "criterio": "Popolazione e beni protetti",
        "domanda": "Numero di abitanti e valore dei beni (edifici, infrastrutture) tutelati dall'intervento",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=>500 ab. o >10M€ beni protetti; Medio=100-500 ab. o 2-10M€; Basso=<100 ab.",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C07_Q_08",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "criterio": "Urgenza e imminenza del rischio",
        "domanda": "Presenza di eventi recenti o segnali di instabilità che rendono urgente l'intervento",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=evento recente o allerta attiva; Medio=criticità documentata senza eventi recenti; Basso=rischio latente",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C07_Q_09",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "criterio": "Tempi di realizzazione",
        "domanda": "Compatibilità con la stagionalità degli interventi idraulici e i tempi di finanziamento",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=<18 mesi; Medio=18-36 mesi; Basso=>36 mesi",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C07_Q_10",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "criterio": "Coerenza con programmazione di bacino e DUP",
        "domanda": "Allineamento con la pianificazione del bacino idrografico e le priorità dell'ente",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=previsto esplicitamente nel piano di bacino; Medio=coerente; Basso=non citato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C07_R_01",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "categoriaRischio": "Rischio idrologico-idraulico",
        "fattore": "Sopravvenienza di eventi alluvionali o di piena durante la fase di cantiere",
        "pesoDefault": 30,
        "descrizione": "Interventi in alveo o in area golenale soggetti a piene anche durante i lavori%",
        "mitigazioneSuggerita": "Analisi idrologica, finestre temporali di cantiere, piani di emergenza"
      },
      {
        "id": "C07_R_02",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "categoriaRischio": "Rischio geotecnico",
        "fattore": "Instabilità del terreno o cedimenti differenziali non previsti",
        "pesoDefault": 25,
        "descrizione": "Variabilità geotecnica dell'area non completamente investigata in fase progettuale%",
        "mitigazioneSuggerita": "Indagini geotecniche approfondite, monitoraggio strumentale"
      },
      {
        "id": "C07_R_03",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "categoriaRischio": "Rischio ambientale",
        "fattore": "Presenza di materiali contaminati in aree di bonifica o in siti industriali dismessi",
        "pesoDefault": 15,
        "descrizione": "Rinvenimento di contaminanti (metalli pesanti, idrocarburi) in aree oggetto di bonifica%",
        "mitigazioneSuggerita": "Caratterizzazione ambientale preventiva, piano di gestione terre"
      },
      {
        "id": "C07_R_04",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "categoriaRischio": "Rischio autorizzativo",
        "fattore": "Ritardi nell'ottenimento dei nulla osta idraulici e delle autorizzazioni regionali/di bacino",
        "pesoDefault": 20,
        "descrizione": "Procedure complesse con Autorità di Bacino, Genio Civile, Regione%",
        "mitigazioneSuggerita": "Avvio preventivo iter, pre-istruttoria con enti"
      },
      {
        "id": "C07_R_05",
        "clusterId": "C07",
        "clusterLabel": "Difesa del suolo e delle acque",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Variazione dei costi per movimenti terra e opere idrauliche specializzate",
        "pesoDefault": 10,
        "descrizione": "Fluttuazione prezzi per opere in alveo e palancole%",
        "mitigazioneSuggerita": "Analisi di mercato, clausole revisione prezzi"
      }
    ]
  },
  "C08": {
    "id": "C08",
    "label": "Reti idriche, fognarie e gestione rifiuti",
    "categorieIncluse": [
      "RETI IDRICHE URBANE • ALTRE STRUTTURE/INFRASTRUTTURE PER L'UTILIZZO DELLE RISORSE IDRICHE • RETI PER IL COLLETTAMENTO DELLE ACQUE PLUVIALI • STRUTTURE/INFRASTRUTTURE PER LA CAPTAZIONE E ADDUZIONE DELL'ACQUA PER ESCLUSIVO USO AGRICOLO • RETI FOGNARIE • IMPIANTI DEPURAZIONE ACQUE • SERBATOI ED IMPIANTI DI SOLLEVAMENTO • CORPI IDRICI: MIGLIORAMENTO DELLA QUALITA' • RETI IDRICHE RURALI • DISSALATORI E STRUTTURE/INFRASTRUTTURE PER LA POTABILIZZAZIONE • RETI IDRICHE INDUSTRIALI • STRUTTURE/INFRASTRUTTURE PER LA CAPTAZIONE E ADDUZIONE DELL'ACQUA PER USI NON AGRICOLI O AD USO PLURIMO • IMPIANTI DI TRATTAMENTO RIFIUTI URBANI • RETI FOGNARIE • IMPIANTI DEPURAZIONE ACQUE • SISTEMI DI RACCOLTA DIFFERENZIATA DEI RIFIUTI URBANI • IMPIANTI PER LA GESTIONE DELLA RACCOLTA DIFFERENZIATA • IMPIANTI DI STOCCAGGIO E SOLLEVAMENTO ACQUE REFLUE • AREE DISMESSE • ALTRE SITI PRODUTTIVI • SITI CONTAMINATI E/O DEGRADATI"
    ],
    "criteriiKO": [
      {
        "id": "C08_KO_01",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "criterio": "Titolarità del servizio idrico/rifiuti",
        "domanda": "L'ente ha competenza diretta o convenzione formale con il gestore del SII/servizio rifiuti per l'intervento",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Convenzione con gestore SII, ATEM, Autorità d'Ambito"
      },
      {
        "id": "C08_KO_02",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "criterio": "Conformità Piano d'Ambito o PPGR",
        "domanda": "L'intervento è previsto o coerente con il Piano d'Ambito dell'ATO idrico o con il Piano Provinciale/Regionale Gestione Rifiuti",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Piano d'Ambito ATO, PPGR"
      },
      {
        "id": "C08_KO_03",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "criterio": "Autorizzazioni ambientali",
        "domanda": "Presenza di VIA, AIA o autorizzazione allo scarico/trattamento rifiuti o avvio procedimento",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Decreto VIA, AIA, autorizzazione scarico"
      },
      {
        "id": "C08_KO_04",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "criterio": "Capienza bilancio e fonte finanziaria",
        "domanda": "Copertura CAPEX identificata (fondi PNRR M2C4, fondi Invitalia, fondi regionali, tariffa SII)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio, piani economici ATO, decreti"
      },
      {
        "id": "C08_KO_05",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "criterio": "Coerenza Piano Triennale OO.PP.",
        "domanda": "L'intervento è inserito nel Piano Triennale",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Piano Triennale OO.PP."
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C08_Q_06",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "criterio": "Riduzione perdite idriche o potenziamento del servizio",
        "domanda": "Grado di riduzione delle perdite nella rete idrica o di aumento delle utenze servite/della qualità del servizio",
        "pesoDefault": "25%",
        "logicaPunteggio": "Alto=riduzione perdite >15% o +1000 utenze; Medio=5-15% o 200-1000 utenze; Basso=<5% o <200 utenze",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C08_Q_07",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "criterio": "Conformità normativa ambientale (WFD, AcS)",
        "domanda": "Contributo al raggiungimento degli obiettivi della Direttiva Acque e delle autorizzazioni allo scarico",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=risolve non conformità accertata; Medio=migliora significativamente il rispetto; Basso=nessuna non conformità da risolvere",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C08_Q_08",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "criterio": "Impatto sulla qualità dell'acqua potabile/ambiente",
        "domanda": "Miglioramento della qualità dell'acqua distribuita o riduzione del carico inquinante immesso nei corpi idrici",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=risolve criticità qualitativa documentata; Medio=migliora parametri; Basso=impatto marginale",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C08_Q_09",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "criterio": "Tempi di realizzazione",
        "domanda": "Compatibilità con i tempi di finanziamento e con la continuità del servizio",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=<24 mesi senza interruzione; Medio=24-42 mesi con interruzione gestita; Basso=>42 mesi o interruzione critica",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C08_Q_10",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "criterio": "Coerenza con DUP e obiettivi di mandato",
        "domanda": "Allineamento con la programmazione dell'ente per i servizi ambientali",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=previsto esplicitamente nel DUP; Medio=coerente; Basso=non citato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C08_Q_11",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "criterio": "Sinergie con altri interventi del SII o del sistema rifiuti",
        "domanda": "Complementarietà con altri interventi nel piano d'ambito o nel gestore",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=completa un sistema; Medio=si integra; Basso=stand-alone",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C08_R_01",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "categoriaRischio": "Rischio tecnico-impiantistico",
        "fattore": "Interferenze con reti esistenti e complessità delle connessioni alla rete idrica/fognaria attiva",
        "pesoDefault": 25,
        "descrizione": "Modifiche alla rete attiva con rischio di interruzione del servizio idropotabile o fognario%",
        "mitigazioneSuggerita": "Mappatura reti, piano gestione interruzioni, accordi con gestore SII"
      },
      {
        "id": "C08_R_02",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "categoriaRischio": "Rischio ambientale",
        "fattore": "Presenza di terreni contaminati in aree di scavo per reti o impianti",
        "pesoDefault": 20,
        "descrizione": "Aree industriali o dismesse con contaminazione del sottosuolo%",
        "mitigazioneSuggerita": "Caratterizzazione ambientale preventiva"
      },
      {
        "id": "C08_R_03",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "categoriaRischio": "Rischio autorizzativo",
        "fattore": "Ritardi nell'ottenimento di VIA, AIA o autorizzazioni allo scarico/trattamento",
        "pesoDefault": 20,
        "descrizione": "Procedimenti ambientali complessi con tempi non prevedibili%",
        "mitigazioneSuggerita": "Avvio preventivo iter, pre-istruttoria con ARPA/Regione"
      },
      {
        "id": "C08_R_04",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Variazione dei costi per tubazioni, impianti elettromeccanici e materiali specializzati",
        "pesoDefault": 15,
        "descrizione": "Fluttuazione prezzi HDPE, acciaio inox, pompe, quadri elettrici%",
        "mitigazioneSuggerita": "Analisi di mercato, clausole revisione prezzi"
      },
      {
        "id": "C08_R_05",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "categoriaRischio": "Rischio di continuità del servizio",
        "fattore": "Interruzione non programmata del servizio idrico o fognario durante i lavori",
        "pesoDefault": 15,
        "descrizione": "Difficoltà tecniche nell'esecuzione di allacciamenti e bypass sulla rete attiva%",
        "mitigazioneSuggerita": "Piano di by-pass, accordi con gestore, comunicazione agli utenti"
      },
      {
        "id": "C08_R_06",
        "clusterId": "C08",
        "clusterLabel": "Reti idriche, fognarie e gestione rifiuti",
        "categoriaRischio": "Rischio di mercato",
        "fattore": "Numero insufficiente di imprese qualificate per lavorazioni specialistiche",
        "pesoDefault": 5,
        "descrizione": "Mercato limitato per impianti di depurazione e per tecnologie specifiche%",
        "mitigazioneSuggerita": "Analisi di mercato, suddivisione lotti"
      }
    ]
  },
  "C09": {
    "id": "C09",
    "label": "Verde urbano, ambiente e qualità dell'aria",
    "categorieIncluse": [
      "STRUTTURE PER LA FRUIZIONE DEL PATRIMONIO AMBIENTALE • PARCHI E RISERVE AREE PROTETTE • SITI NATURALI E RURALI • SISTEMI DI MONITORAGGIO AMBIENTALE E TELECONTROLLO DELL'INQUINAMENTO • VERDE PUBBLICO • ARREDO URBANO • ILLUMINAZIONE PUBBLICA • STRUTTURE PER LA FRUIZIONE DEL PATRIMONIO AMBIENTALE • ALTRI SERVIZI PER LA COLLETTIVITA'"
    ],
    "criteriiKO": [
      {
        "id": "C09_KO_01",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "criterio": "Disponibilità area",
        "domanda": "L'area è di proprietà pubblica o in uso esclusivo all'ente con titolo formale",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Visura catastale, delibera acquisizione"
      },
      {
        "id": "C09_KO_02",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "criterio": "Conformità PRG e destinazione a verde/servizi",
        "domanda": "L'area ha destinazione urbanistica compatibile (verde pubblico, attrezzature collettive, servizi)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica PRG/PGT"
      },
      {
        "id": "C09_KO_03",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "criterio": "Assenza vincoli naturalistici ostativi",
        "domanda": "L'intervento non è incompatibile con i vincoli di protezione naturalistica (SIC, ZPS, Parchi Nazionali)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica SIC/ZPS, parere Ente Parco"
      },
      {
        "id": "C09_KO_04",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "criterio": "Capienza bilancio e fonte finanziaria",
        "domanda": "Copertura CAPEX identificata (fondi regionali, FSC, PNRR M2C4)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio, decreti fondi"
      },
      {
        "id": "C09_KO_05",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "criterio": "Coerenza Piano Triennale OO.PP.",
        "domanda": "Inserimento nel Piano Triennale",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Piano Triennale OO.PP."
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C09_Q_06",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "criterio": "Incremento della dotazione di verde e servizi ecosistemici",
        "domanda": "Aumento dei mq di verde fruibile pro-capite e dei servizi ecosistemici (depurazione aria, regolazione termica)",
        "pesoDefault": "25%",
        "logicaPunteggio": "Alto=>10 mq/ab aggiuntivi o servizi ecosistemici rilevanti; Medio=3-10 mq/ab; Basso=<3 mq/ab",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C09_Q_07",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "criterio": "Accessibilità e fruibilità per la comunità",
        "domanda": "Grado di accessibilità dell'area da parte della popolazione (prossimità, percorsi, eliminazione barriere)",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=area a <300m per >80% popolazione del bacino; Medio=300-600m; Basso=>600m",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C09_Q_08",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "criterio": "Riduzione dell'isola di calore urbana",
        "domanda": "Contributo alla mitigazione del calore urbano tramite copertura arborea, superfici permeabili e masse d'acqua",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=riduzione temperatura percepita stimata >2°C; Medio=1-2°C; Basso=<1°C",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C09_Q_09",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "criterio": "Tempi di realizzazione",
        "domanda": "Compatibilità con i tempi di finanziamento",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=<12 mesi; Medio=12-24 mesi; Basso=>24 mesi",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C09_Q_10",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "criterio": "Coerenza con DUP e obiettivi di mandato",
        "domanda": "Allineamento con la strategia verde e ambientale dell'ente",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=previsto nel DUP con priorità; Medio=coerente; Basso=non citato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C09_Q_11",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "criterio": "Sinergie con Agenda Urbana e PAES/PAESC",
        "domanda": "Integrazione con il Piano d'Azione Energia Sostenibile e Clima e con strategie urbane",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=contribuisce esplicitamente a target PAESC; Medio=coerente; Basso=nessun collegamento",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C09_R_01",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "categoriaRischio": "Rischio autorizzativo-naturalistico",
        "fattore": "Ritardi o dinieghi da parte di Ente Parco, Soprintendenza o Regione per aree protette",
        "pesoDefault": 25,
        "descrizione": "Interventi in SIC, ZPS o nelle fasce di rispetto che richiedono Valutazione di Incidenza%",
        "mitigazioneSuggerita": "Avvio preventivo VINCA, pre-istruttoria con Ente Parco"
      },
      {
        "id": "C09_R_02",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "categoriaRischio": "Rischio fitopatologico",
        "fattore": "Insorgenza di malattie o parassiti sulle specie arboree piantumate",
        "pesoDefault": 20,
        "descrizione": "Rischio di attecchimento scarso o di patologie su nuove piantagioni in contesti urbani stressati%",
        "mitigazioneSuggerita": "Scelta specie autoctone resistenti, piano di manutenzione post-intervento"
      },
      {
        "id": "C09_R_03",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "categoriaRischio": "Rischio di manutenzione insufficiente",
        "fattore": "Degrado progressivo dell'area a causa di risorse per la gestione ordinaria insufficienti",
        "pesoDefault": 20,
        "descrizione": "Sottostima dei costi OPEX per irrigazione, potature, manutenzione impianti%",
        "mitigazioneSuggerita": "Analisi dettagliata costi OPEX, piano di gestione con operatori"
      },
      {
        "id": "C09_R_04",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Variazione dei costi per materiale vegetale, arredo urbano e impiantistica verde",
        "pesoDefault": 15,
        "descrizione": "Fluttuazione prezzi piante, arredi, impianti di irrigazione%",
        "mitigazioneSuggerita": "Analisi di mercato, clausole revisione prezzi"
      },
      {
        "id": "C09_R_05",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "categoriaRischio": "Rischio di vandalismo e sicurezza",
        "fattore": "Danni vandalici alle nuove infrastrutture verdi e di arredo urbano",
        "pesoDefault": 10,
        "descrizione": "Aree frequentate da gruppi a rischio o con storia di vandalismo%",
        "mitigazioneSuggerita": "Piano di videosorveglianza, scelta materiali vandal-resistant"
      },
      {
        "id": "C09_R_06",
        "clusterId": "C09",
        "clusterLabel": "Verde urbano, ambiente e qualità dell'aria",
        "categoriaRischio": "Rischio di interferenza con reti",
        "fattore": "Interferenze con reti sotterranee in fase di scavo per piantumazioni e impianti irrigui",
        "pesoDefault": 10,
        "descrizione": "Reti non mappate in aree urbane consolidate%",
        "mitigazioneSuggerita": "Indagini preventive, coordinamento con gestori"
      }
    ]
  },
  "C10": {
    "id": "C10",
    "label": "Energia (produzione e distribuzione)",
    "categorieIncluse": [
      "IMPIANTI PER L'EFFICIENZA DELLE RETI E RISPARMIO ENERGETICO • IMPIANTI DI DISTRIBUZIONE DI ENERGIA ELETTRICA E TERMICA, CIVILE E INDUSTRIALE • IMPIANTI DI TRASMISSIONE DI ENERGIA ELETTRICA • RETI DISTRIBUZIONE GAS • ALTRI IMPIANTI PRODUZIONE ENERGIE DA FONTI RINNOVABILI • ALTRI IMPIANTI PER LA PRODUZIONE E L'ESTRAZIONE DI ENERGIA • IMPIANTI PRODUZIONE TERMOELETTRICA • IMPIANTI DI COGENERAZIONE • IMPIANTI PRODUZIONE IDROELETTRICA"
    ],
    "criteriiKO": [
      {
        "id": "C10_KO_01",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "criterio": "Autorizzazioni energetiche e di settore",
        "domanda": "L'intervento ha ottenuto o ha avviato il procedimento per le autorizzazioni di settore (AU unica, PAUR, autorizzazione GSE, concessione idrica)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Decreto AU, parere GSE, concessione idrica"
      },
      {
        "id": "C10_KO_02",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "criterio": "Conformità alla pianificazione energetica regionale",
        "domanda": "L'intervento è coerente con il Piano Energetico Regionale (PER) e con il PNIEC",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica PER, PNIEC"
      },
      {
        "id": "C10_KO_03",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "criterio": "Connessione alla rete accettata da gestore",
        "domanda": "Presenza di preventivo accettato dal gestore di rete (Terna/e-distribuzione) o piano di connessione",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Preventivo connessione Terna/e-distribuzione"
      },
      {
        "id": "C10_KO_04",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "criterio": "Capienza bilancio e fonte finanziaria",
        "domanda": "Copertura CAPEX identificata (incentivi GSE, Transizione 5.0, PNRR M2C2, fondi regionali)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio, decreti MiTE/MASE"
      },
      {
        "id": "C10_KO_05",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "criterio": "Rispetto normativa ambientale",
        "domanda": "L'intervento ha effettuato le valutazioni ambientali richieste (VIA, screening) o è escluso",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Decreto VIA, screening ambientale"
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C10_Q_06",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "criterio": "Capacità produttiva/distributiva installata",
        "domanda": "Potenza installata (MW) o capacità di distribuzione aggiuntiva rispetto al fabbisogno del territorio",
        "pesoDefault": "25%",
        "logicaPunteggio": "Alto=copre >20% fabbisogno locale; Medio=5-20%; Basso=<5%",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C10_Q_07",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "criterio": "Riduzione delle emissioni di CO2",
        "domanda": "Tonnellate di CO2eq evitate annualmente rispetto allo scenario di riferimento",
        "pesoDefault": "25%",
        "logicaPunteggio": "Alto=>5000 tCO2eq/anno; Medio=500-5000; Basso=<500",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C10_Q_08",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "criterio": "Sicurezza e continuità dell'approvvigionamento",
        "domanda": "Miglioramento della resilienza della rete energetica locale e riduzione del rischio di interruzioni",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=elimina criticità strutturale della rete; Medio=migliora significativamente; Basso=impatto limitato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C10_Q_09",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "criterio": "Tempi di realizzazione",
        "domanda": "Compatibilità con i tempi di incentivazione e di connessione alla rete",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=<18 mesi; Medio=18-36 mesi; Basso=>36 mesi",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C10_Q_10",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "criterio": "Coerenza con PAESC e obiettivi climate",
        "domanda": "Allineamento con il Piano d'Azione Energia Sostenibile e Clima e con gli obiettivi EU 2030/2050",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=contribuisce esplicitamente a target PAESC; Medio=coerente; Basso=nessun collegamento",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C10_R_01",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "categoriaRischio": "Rischio autorizzativo-regolatorio",
        "fattore": "Mancato ottenimento o ritardo dell'Autorizzazione Unica (DLgs 387/2003) o PAUR",
        "pesoDefault": 30,
        "descrizione": "Procedimento complesso con VIA, autorizzazioni paesaggistiche e demaniali%",
        "mitigazioneSuggerita": "Avvio preventivo iter AU, pre-istruttoria con Regione"
      },
      {
        "id": "C10_R_02",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "categoriaRischio": "Rischio di connessione alla rete",
        "fattore": "Ritardi o modifiche al preventivo di connessione da parte del gestore di rete",
        "pesoDefault": 20,
        "descrizione": "Saturazione della rete di distribuzione in alcune aree o costi di connessione superiori alle stime%",
        "mitigazioneSuggerita": "Verifica preventiva con Terna/e-distribuzione, riserva contingency"
      },
      {
        "id": "C10_R_03",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "categoriaRischio": "Rischio tecnologico",
        "fattore": "Obsolescenza delle tecnologie scelte o variazione delle prestazioni rispetto alle attese",
        "pesoDefault": 15,
        "descrizione": "Mercato delle rinnovabili in rapida evoluzione con nuove tecnologie più efficienti%",
        "mitigazioneSuggerita": "Specifiche tecniche aggiornate, garanzie prestazionali contrattualizzate"
      },
      {
        "id": "C10_R_04",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Variazione dei prezzi delle componenti tecnologiche (pannelli, turbine, batterie)",
        "pesoDefault": 20,
        "descrizione": "Fluttuazione prezzi sui mercati globali delle commodity energetiche e dei semiconduttori%",
        "mitigazioneSuggerita": "Clausole revisione prezzi, contratti quadro fornitori"
      },
      {
        "id": "C10_R_05",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "categoriaRischio": "Rischio ambientale e paesaggistico",
        "fattore": "Impatto visivo, acustico o sulle specie protette superiore alle previsioni",
        "pesoDefault": 10,
        "descrizione": "Vincoli paesaggistici o ZPS/SIC in prossimità dell'impianto%",
        "mitigazioneSuggerita": "Screening ambientale preventivo, VINCA"
      },
      {
        "id": "C10_R_06",
        "clusterId": "C10",
        "clusterLabel": "Energia (produzione e distribuzione)",
        "categoriaRischio": "Rischio di mercato",
        "fattore": "Numero insufficiente di imprese qualificate per l'installazione e la manutenzione",
        "pesoDefault": 5,
        "descrizione": "Mercato regionale poco sviluppato per alcune tecnologie specifiche%",
        "mitigazioneSuggerita": "Analisi di mercato, suddivisione lotti"
      }
    ]
  },
  "C11": {
    "id": "C11",
    "label": "Telecomunicazioni e tecnologie digitali",
    "categorieIncluse": [
      "CAVIDOTTI, ALTRE OPERE CIVILI DI CABLAGGIO E CENTRALINE • POSA CAVI IN DOTTI GIA ESISTENTI • ALTRE OPERE ED IMPIANTI PER TELECOMUNICAZIONE • SISTEMI ED IMPIANTI DI CONTROLLO E VIDEOSORVEGLIANZA • IMPIANTI WIRELESS • LOCALI ATTREZZATI PER CENTRI DI SERVIZIO INFORMATICI"
    ],
    "criteriiKO": [
      {
        "id": "C11_KO_01",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "criterio": "Autorizzazione posa e concessioni",
        "domanda": "Presenza di autorizzazioni per la posa di cavi/infrastrutture in aree pubbliche o private (decreto MIMIT, autorizzazione Comune)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Decreto MIMIT, autorizzazione posa"
      },
      {
        "id": "C11_KO_02",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "criterio": "Conformità Piano Nazionale Banda Ultra Larga",
        "domanda": "L'intervento è coerente o complementare con il Piano BUL nazionale e con le aree di intervento pubblico",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica piano BUL, mappatura whitespots"
      },
      {
        "id": "C11_KO_03",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "criterio": "Disponibilità di infrastruttura passiva riutilizzabile",
        "domanda": "Esistenza di cavidotti o infrastruttura civile già disponibile che riduca i costi di scavo",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Censimento infrastrutture passive, catasto reti"
      },
      {
        "id": "C11_KO_04",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "criterio": "Capienza bilancio e fonte finanziaria",
        "domanda": "Copertura CAPEX identificata (fondi PNRR M1C2, fondi MIMIT, risorse regionali)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio, decreti PNRR TLC"
      },
      {
        "id": "C11_KO_05",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "criterio": "Rispetto normativa GDPR e sicurezza dati",
        "domanda": "L'intervento è progettato nel rispetto del GDPR e delle linee guida ACN per la cybersicurezza",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "GDPR assessment, linee guida ACN"
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C11_Q_06",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "criterio": "Copertura di aree scoperte (whitespots)",
        "domanda": "Numero di unità immobiliari o utenti che accedono per la prima volta alla banda ultra larga (>1 Gbps)",
        "pesoDefault": "30%",
        "logicaPunteggio": "Alto=>500 UI o >1000 utenti; Medio=100-500 UI; Basso=<100 UI",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C11_Q_07",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "criterio": "Velocità e prestazioni abilitate",
        "domanda": "Livello di prestazione raggiunto (VHCN, FTTB/H, >100 Mbps, >1 Gbps)",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=FTTX con >1Gbps; Medio=>100Mbps; Basso=<100Mbps",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C11_Q_08",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "criterio": "Servizi pubblici digitali abilitati",
        "domanda": "Numero e rilevanza dei servizi PA (sanità digitale, scuola digitale, telemedicina) resi possibili dall'infrastruttura",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=abilita >3 servizi PA critici; Medio=1-2 servizi; Basso=solo connettività generica",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C11_Q_09",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "criterio": "Tempi di realizzazione",
        "domanda": "Compatibilità con i tempi di finanziamento e con le esigenze dei fruitori",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=<12 mesi; Medio=12-24 mesi; Basso=>24 mesi",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C11_Q_10",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "criterio": "Coerenza con Agenda Digitale e DUP",
        "domanda": "Allineamento con la strategia digitale dell'ente e le priorità del DUP",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=previsto nel piano digitale comunale; Medio=coerente; Basso=non citato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C11_R_01",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "categoriaRischio": "Rischio tecnico di posa",
        "fattore": "Difficoltà di posa in opera per interferenze con infrastrutture esistenti o per tipologia di suolo",
        "pesoDefault": 25,
        "descrizione": "Presenza di reti non mappate, attraversamenti ferroviari/autostradali, aree urbane storiche%",
        "mitigazioneSuggerita": "Indagini preventive reti, accordi con gestori"
      },
      {
        "id": "C11_R_02",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "categoriaRischio": "Rischio autorizzativo",
        "fattore": "Ritardi nell'ottenimento delle autorizzazioni comunali, regionali o ministeriali per la posa",
        "pesoDefault": 20,
        "descrizione": "Molteplicità di enti coinvolti nell'autorizzazione degli scavi e dei percorsi%",
        "mitigazioneSuggerita": "Coordinamento preventivo con tutti gli enti, procedimento unico"
      },
      {
        "id": "C11_R_03",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "categoriaRischio": "Rischio tecnologico",
        "fattore": "Obsolescenza delle specifiche tecniche durante la fase di realizzazione",
        "pesoDefault": 15,
        "descrizione": "Evoluzione rapida degli standard (es. passaggio da GPON a XGS-PON) che richiede adeguamento%",
        "mitigazioneSuggerita": "Specifiche aperte e flessibili, standard europei"
      },
      {
        "id": "C11_R_04",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "categoriaRischio": "Rischio di cybersicurezza",
        "fattore": "Vulnerabilità dell'infrastruttura digitale a attacchi informatici",
        "pesoDefault": 20,
        "descrizione": "Progettazione insufficiente dei livelli di sicurezza logica e fisica dell'infrastruttura%",
        "mitigazioneSuggerita": "Conformità ACN, penetration test, audit sicurezza"
      },
      {
        "id": "C11_R_05",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Variazione dei costi per cavi, apparati attivi e lavori civili",
        "pesoDefault": 10,
        "descrizione": "Fluttuazione prezzi fibre ottiche, Switch, OLT e costi di scavo%",
        "mitigazioneSuggerita": "Analisi di mercato, clausole revisione prezzi"
      },
      {
        "id": "C11_R_06",
        "clusterId": "C11",
        "clusterLabel": "Telecomunicazioni e tecnologie digitali",
        "categoriaRischio": "Rischio di adozione",
        "fattore": "Numero di utenti che effettivamente attivano il servizio inferiore alle previsioni",
        "pesoDefault": 10,
        "descrizione": "Scarsa propensione all'adozione nelle aree target (anziani, imprese tradizionali)%",
        "mitigazioneSuggerita": "Piano di comunicazione e accompagnamento all'adozione"
      }
    ]
  },
  "C12": {
    "id": "C12",
    "label": "Aree produttive, ricerca e attività economiche",
    "categorieIncluse": [
      "ALTRE INFRASTRUTTURE PER ATTREZZATURE DI AREE PRODUTTIVE • INFRASTRUTTURE CIVILI PER AREE INDUSTRIALI • SISTEMAZIONE DEI TERRENI E RICONVERSIONE AREE INDUSTRIALI • ALTRE ATTREZZATURE PER LA PESCA • ALTRE OPERE ED INFRASTRUTTURE PER LA RICERCA • LABORATORI ATTREZZATI PER LA RICERCA • CENTRI DI RICERCA • SPAZI E STRUTTURE PER LE ATTIVITA' DI IMPRESA SOCIALE • CENTRI DI INFORMAZIONE / ACCOGLIENZA • ALTRE STRUTTURE DI RICETTIVITA' TURISTICA • FABBRICATI RURALI • INTRODUZIONE DI SISTEMI PER IL CONTROLLO DELLA QUALITA' DEI PRODOTTI • IMPIANTI COLLETTIVI PER LA TUTELA DELLA QUALITA' E PER LO SVILUPPO DI FORME ASSOCIATIVE DEI PRODUTTORI • IMPIANTI E RETI IRRIGUE AZIENDALI • STRUTTURE INDUSTRIALI COMUNI ED ALTRI EDIFICI ATTREZZATI • CENTRI E LABORATORI ARTIGIANI • STRUTTURE PER COLTIVAZIONI FORESTALI (VIVAI, ECC)"
    ],
    "criteriiKO": [
      {
        "id": "C12_KO_01",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "criterio": "Disponibilità area e titolo di proprietà/uso",
        "domanda": "L'ente o il soggetto beneficiario ha titolo formale sull'area o sull'immobile",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Visura catastale, atto di proprietà/concessione"
      },
      {
        "id": "C12_KO_02",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "criterio": "Conformità PRG e destinazione produttiva/mista",
        "domanda": "L'area ha destinazione urbanistica compatibile con l'uso produttivo, artigianale, agricolo o ricettivo previsto",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Verifica PRG/PGT, NTA di zona"
      },
      {
        "id": "C12_KO_03",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "criterio": "Autorizzazioni settoriali specifiche",
        "domanda": "Presenza delle autorizzazioni di settore richieste (VIA, AUA, autorizzazioni agricole, sanitarie per agro-alimentare)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Decreto VIA, AUA, autorizzazioni di settore"
      },
      {
        "id": "C12_KO_04",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "criterio": "Capienza bilancio e fonte finanziaria",
        "domanda": "Copertura CAPEX identificata (fondi FESR, FEASR, fondi nazionali sviluppo locale, PNRR)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio, decreti fondi strutturali"
      },
      {
        "id": "C12_KO_05",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "criterio": "Coerenza con programmazione dello sviluppo locale",
        "domanda": "L'intervento è coerente con SUAP, PIC, Strategia Aree Interne o altri strumenti di sviluppo locale",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "SUAP, PIC, Strategia Aree Interne"
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C12_Q_06",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "criterio": "Creazione di occupazione diretta e indiretta",
        "domanda": "Numero di nuovi posti di lavoro attivati direttamente e indirettamente dall'intervento",
        "pesoDefault": "25%",
        "logicaPunteggio": "Alto=>50 ETP; Medio=10-50 ETP; Basso=<10 ETP",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C12_Q_07",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "criterio": "Attrazione di investimenti privati",
        "domanda": "Capacità dell'intervento pubblico di catalizzare investimenti privati nel territorio (effetto leva)",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=leva >3x CAPEX pubblico; Medio=leva 1-3x; Basso=leva <1x o nessuna",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C12_Q_08",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "criterio": "Rafforzamento della filiera locale",
        "domanda": "Grado di integrazione con la filiera produttiva locale e con i soggetti economici del territorio",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=coinvolge >5 imprese locali o crea filiera; Medio=coinvolge alcune imprese locali; Basso=nessuna sinergia",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C12_Q_09",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "criterio": "Tempi di realizzazione",
        "domanda": "Compatibilità con i tempi di finanziamento e con le esigenze degli operatori economici",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=<18 mesi; Medio=18-36 mesi; Basso=>36 mesi",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C12_Q_10",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "criterio": "Coerenza con strategia di sviluppo locale e DUP",
        "domanda": "Allineamento con gli obiettivi di sviluppo economico del mandato",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=obiettivo esplicito del mandato e del DUP; Medio=coerente; Basso=non citato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C12_Q_11",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "criterio": "Sostenibilità ambientale dell'attività produttiva",
        "domanda": "Rispetto delle normative ambientali e adozione di pratiche di economia circolare o a basse emissioni",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=economia circolare certificata o emissioni nette zero; Medio=rispetto normativa con misure aggiuntive; Basso=solo normativa minima",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C12_R_01",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "categoriaRischio": "Rischio ambientale",
        "fattore": "Presenza di contaminazione del suolo o di vincoli ambientali in aree produttive/agricole",
        "pesoDefault": 20,
        "descrizione": "Terreni precedentemente industriali con contaminazione da metalli pesanti o idrocarburi%",
        "mitigazioneSuggerita": "Caratterizzazione ambientale preventiva, piano bonifica"
      },
      {
        "id": "C12_R_02",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "categoriaRischio": "Rischio autorizzativo-settoriale",
        "fattore": "Ritardi nell'ottenimento di autorizzazioni specifiche di settore (AUA, VIA, autorizzazioni fitosanitarie)",
        "pesoDefault": 25,
        "descrizione": "Procedimenti complessi con più enti (ARPA, ASL, Regione, MIPAAF)%",
        "mitigazioneSuggerita": "Avvio preventivo iter, pre-istruttoria con enti"
      },
      {
        "id": "C12_R_03",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "categoriaRischio": "Rischio di mercato e di domanda",
        "fattore": "Domanda di spazi produttivi o ricettivi inferiore alle previsioni post-intervento",
        "pesoDefault": 20,
        "descrizione": "Condizioni di mercato locali non favorevoli o sovrastima della domanda%",
        "mitigazioneSuggerita": "Analisi di mercato, coinvolgimento preventivo di imprenditori"
      },
      {
        "id": "C12_R_04",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Variazione dei costi per strutture industriali, impianti specializzati e attrezzature",
        "pesoDefault": 15,
        "descrizione": "Fluttuazione prezzi acciaio strutturale, impianti tecnici specializzati%",
        "mitigazioneSuggerita": "Analisi di mercato, clausole revisione prezzi"
      },
      {
        "id": "C12_R_05",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "categoriaRischio": "Rischio occupazionale",
        "fattore": "Mancato raggiungimento degli obiettivi occupazionali previsti",
        "pesoDefault": 10,
        "descrizione": "Difficoltà di attrazione di imprese o di creazione di posti di lavoro nel territorio%",
        "mitigazioneSuggerita": "Accordi con imprese beneficiarie, monitoraggio KPI occupazionali"
      },
      {
        "id": "C12_R_06",
        "clusterId": "C12",
        "clusterLabel": "Aree produttive, ricerca e attività economiche",
        "categoriaRischio": "Rischio di cantiere",
        "fattore": "Difficoltà logistiche in aree rurali o periferiche (viabilità, servizi)",
        "pesoDefault": 10,
        "descrizione": "Scarsa infrastrutturazione logistica nelle aree target",
        "mitigazioneSuggerita": "Piano logistico di cantiere, accordi con Comuni per accesso"
      }
    ]
  },
  "C13": {
    "id": "C13",
    "label": "Sicurezza pubblica, giustizia, culto e difesa",
    "categorieIncluse": [
      "EDIFICI ED INFRASTRUTTURE PER LA PROTEZIONE CIVILE • ALTRE STRUTTURE/INFRASTRUTTURE PER LA PUBBLICA SICUREZZA • ALTRE STRUTTURE/INFRASTRUTTURE GIUDIZIARIE • CASERME • CHIESE • CONVENTI • STRUTTURE/INFRASTRUTTURE PER SEDI DELLA PUBBLICA AMMINISTRAZIONE • EDIFICI E INFRASTRUTTURE PER UFFICI • STRUTTURE/INFRASTRUTTURE PER SEDI DI ORGANI ISTITUZIONALI • ALTRE INFRASTRUTTURE • CIMITERI"
    ],
    "criteriiKO": [
      {
        "id": "C13_KO_01",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "criterio": "Proprietà/disponibilità e competenza istituzionale",
        "domanda": "L'ente ha titolo formale sull'immobile e competenza istituzionale sull'intervento (o accordo formale con ente competente)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Visura catastale, accordo istituzionale, decreto"
      },
      {
        "id": "C13_KO_02",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "criterio": "Normativa antisismica",
        "domanda": "L'intervento prevede adeguamento NTC 2018 o verifica documentata di conformità",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Relazione sismica, certificato collaudo"
      },
      {
        "id": "C13_KO_03",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "criterio": "Autorizzazioni specifiche (Soprintendenza per beni tutelati)",
        "domanda": "Per beni storici/religiosi: presenza di nulla osta della Soprintendenza",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Parere Soprintendenza ABAP"
      },
      {
        "id": "C13_KO_04",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "criterio": "Capienza bilancio e fonte finanziaria",
        "domanda": "Copertura CAPEX identificata (fondi Ministero Interno, 8x1000, fondi regionali, fondi UE)",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Bilancio, decreti ministeriali"
      },
      {
        "id": "C13_KO_05",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "criterio": "Coerenza Piano Triennale OO.PP.",
        "domanda": "Inserimento nel Piano Triennale",
        "pesoDefault": "—",
        "logicaPunteggio": "Sì = ammissibile | No = ESCLUSO (non ponderato)",
        "fonteVerifica": "Piano Triennale OO.PP."
      }
    ],
    "criteriiQualitativi": [
      {
        "id": "C13_Q_06",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "criterio": "Sicurezza strutturale e adeguamento normativo",
        "domanda": "Livello di miglioramento della sicurezza strutturale, sismica e impiantistica dell'edificio",
        "pesoDefault": "30%",
        "logicaPunteggio": "Alto=da classe di rischio D/E a B o migliore; Medio=miglioramento 1 classe; Basso=solo adeguamento normativo minimo",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C13_Q_07",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "criterio": "Continuità del servizio istituzionale",
        "domanda": "Impatto sulla continuità dei servizi pubblici erogati nell'edificio (protezione civile, giustizia, sicurezza, culto)",
        "pesoDefault": "25%",
        "logicaPunteggio": "Alto=ripristina servizio interrotto o previene interruzione imminente; Medio=migliora condizioni; Basso=intervento di manutenzione",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C13_Q_08",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "criterio": "Efficienza energetica",
        "domanda": "Riduzione attesa dei consumi energetici post-intervento",
        "pesoDefault": "15%",
        "logicaPunteggio": "Alto=riduzione >30%; Medio=10-30%; Basso=<10%",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C13_Q_09",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "criterio": "Tempi di realizzazione",
        "domanda": "Compatibilità con i tempi di finanziamento e con la continuità del servizio",
        "pesoDefault": "20%",
        "logicaPunteggio": "Alto=<18 mesi senza interruzione; Medio=18-36 con interruzione gestita; Basso=>36 mesi",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      },
      {
        "id": "C13_Q_10",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "criterio": "Coerenza con obiettivi DUP e mandato",
        "domanda": "Allineamento con le priorità di salvaguardia del patrimonio pubblico e della sicurezza istituzionale",
        "pesoDefault": "10%",
        "logicaPunteggio": "Alto=previsto esplicitamente nel DUP; Medio=coerente; Basso=non citato",
        "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
      }
    ],
    "fattoriRischio": [
      {
        "id": "C13_R_01",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "categoriaRischio": "Rischio strutturale e sismico",
        "fattore": "Scoperta di criticità strutturali gravi in edifici istituzionali storici",
        "pesoDefault": 30,
        "descrizione": "Edifici datati con vulnerabilità sismiche non emerse o materiali pericolosi (amianto)%",
        "mitigazioneSuggerita": "Indagini diagnostiche approfondite, rilievo amianto"
      },
      {
        "id": "C13_R_02",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "categoriaRischio": "Rischio autorizzativo-culturale",
        "fattore": "Ritardi o dinieghi da parte della Soprintendenza per beni vincolati",
        "pesoDefault": 25,
        "descrizione": "Edifici storici della PA (tribunali, caserme storiche, chiese) soggetti a tutela Mibac%",
        "mitigazioneSuggerita": "Avvio preventivo procedimento Soprintendenza"
      },
      {
        "id": "C13_R_03",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "categoriaRischio": "Rischio di continuità del servizio istituzionale",
        "fattore": "Difficoltà nel garantire la continuità dei servizi pubblici durante i lavori",
        "pesoDefault": 20,
        "descrizione": "Servizi critici (protezione civile, forze dell'ordine, giustizia) che non possono essere interrotti%",
        "mitigazioneSuggerita": "Piano di fasing, spazi alternativi, accordi con Ministeri"
      },
      {
        "id": "C13_R_04",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "categoriaRischio": "Rischio finanziario",
        "fattore": "Variazione dei costi per restauro conservativo e materiali tradizionali",
        "pesoDefault": 15,
        "descrizione": "Mercato limitato per lavoratori specializzati e per materiali storici%",
        "mitigazioneSuggerita": "Analisi di mercato, riserva contingency >15%"
      },
      {
        "id": "C13_R_05",
        "clusterId": "C13",
        "clusterLabel": "Sicurezza pubblica, giustizia, culto e difesa",
        "categoriaRischio": "Rischio di coordinamento istituzionale",
        "fattore": "Difficoltà di coordinamento tra più enti (Comune, Ministero, Diocesi, Regione)",
        "pesoDefault": 10,
        "descrizione": "Molteplicità di soggetti con interessi diversi sull'immobile%",
        "mitigazioneSuggerita": "Accordo di programma formale, governance chiara"
      }
    ]
  }
}
