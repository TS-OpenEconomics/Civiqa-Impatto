import type { McaCriterio } from "../../types/incroci"

export const DOMANDE_KO: McaCriterio[] = [
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
]
