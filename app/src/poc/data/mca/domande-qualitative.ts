import type { McaCriterio } from "../../types/incroci"

export const DOMANDE_QUALITATIVE: McaCriterio[] = [
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
  },
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
  },
  {
    "id": "C03_Q_06",
    "clusterId": "C03",
    "clusterLabel": "Edilizia scolastica e strutture sociali",
    "criterio": "Riduzione del sovraffollamento/sottoutilizzo",
    "domanda": "Grado di risoluzione dello squilibrio tra domanda di servizio educativo/sociale e offerta strutturale disponibile",
    "pesoDefault": "25%",
    "logicaPunteggio": "Alto=elimina criticità strutturale; Medio=riduce significativamente; Basso=miglioramento marginale",
    "fonteVerifica": "Valutazione tecnico-funzionale del progettista"
  },
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
    "criterio": "Efficienza energetica post-intervento",
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
]
