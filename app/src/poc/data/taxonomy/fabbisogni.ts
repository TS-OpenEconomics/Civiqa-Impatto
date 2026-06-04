import type { FabbisognoCompleto } from "../../types/incroci"

export const FABBISOGNI: FabbisognoCompleto[] = [
  {
    "id": "FAB-01",
    "label": "Servizi per la prima infanzia (0-3 anni)",
    "descrizione": "Servizi per la prima infanzia (0-3 anni)",
    "sottolabel": "Asili nido, centri prima infanzia, nidi famiglia",
    "temaId": "TEMA-01",
    "temaLabel": "Istruzione e formazione",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.II",
      "OS 4.h"
    ],
    "osAPDescrizione": "FESR – Infrastrutture istruzione e formazione / FSE+ – Inclusione attiva",
    "clusterCup": [
      {
        "codice": "C03",
        "label": "Edilizia scolastica e strutture sociali"
      }
    ],
    "scenarioZero": {
      "q1Label": "Il comune eroga servizi di asilo nido o prima infanzia? (Pienamente funzionante / Parzialmente funzionante / Non funzionante-inagibile / Servizio assente-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per la struttura, senza intervento?",
      "q3Label": "Qual è il costo annuo per mantenere in esercizio la struttura attuale? (manutenzione ordinaria + straordinaria ricorrente)"
    },
    "categorieCollegate": [
      {
        "id": "CAT-108",
        "label": "ASILI NIDO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-26",
        "sottosettore": "SOCIALI E SCOLASTICHE",
        "clusterCode": "C03"
      },
      {
        "id": "CAT-114",
        "label": "SERVIZI PER L'INFANZIA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-29",
        "sottosettore": "SCUOLA E ISTRUZIONE",
        "clusterCode": "C03"
      },
      {
        "id": "CAT-107",
        "label": "SCUOLE MATERNE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-26",
        "sottosettore": "SOCIALI E SCOLASTICHE",
        "clusterCode": "C03"
      }
    ]
  },
  {
    "id": "FAB-02",
    "label": "Istruzione prescolastica (3-6 anni)",
    "descrizione": "Istruzione prescolastica (3-6 anni)",
    "sottolabel": "Scuole materne, scuole dell'infanzia comunali e statali",
    "temaId": "TEMA-01",
    "temaLabel": "Istruzione e formazione",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.II",
      "OS 4.e"
    ],
    "osAPDescrizione": "FESR – Infrastrutture istruzione / FSE+ – Prevenzione abbandono scolastico precoce",
    "clusterCup": [
      {
        "codice": "C03",
        "label": "Edilizia scolastica e strutture sociali"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le strutture per la scuola dell'infanzia sono operative e agibili? (Pienamente funzionante / Parzialmente funzionante / Non funzionante-inagibile / Servizio assente-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per l'edificio scolastico, senza intervento strutturale?",
      "q3Label": "Qual è il costo annuo di manutenzione ordinaria e straordinaria ricorrente dell'edificio?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-107",
        "label": "SCUOLE MATERNE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-26",
        "sottosettore": "SOCIALI E SCOLASTICHE",
        "clusterCode": "C03"
      },
      {
        "id": "CAT-114",
        "label": "SERVIZI PER L'INFANZIA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-29",
        "sottosettore": "SCUOLA E ISTRUZIONE",
        "clusterCode": "C03"
      }
    ]
  },
  {
    "id": "FAB-03",
    "label": "Qualità edilizia scolastica (6-18 anni)",
    "descrizione": "Qualità edilizia scolastica (6-18 anni)",
    "sottolabel": "Scuole elementari, medie, superiori – adeguamento sismico ed energetico",
    "temaId": "TEMA-01",
    "temaLabel": "Istruzione e formazione",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.II",
      "OS 2.I"
    ],
    "osAPDescrizione": "FESR – Infrastrutture istruzione / FESR – Efficienza energetica",
    "clusterCup": [
      {
        "codice": "C03",
        "label": "Edilizia scolastica e strutture sociali"
      }
    ],
    "scenarioZero": {
      "q1Label": "Gli edifici scolastici sono agibili e conformi agli standard normativi vigenti? (Pienamente agibili e conformi / Parzialmente agibili / Edificio inagibile-interdetto / Nessun edificio scolastico-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per l'edificio scolastico senza adeguamento sismico/energetico?",
      "q3Label": "Qual è il costo annuo di manutenzione ordinaria e straordinaria per mantenere in esercizio gli spazi scolastici?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-105",
        "label": "SCUOLE ELEMENTARI, MEDIE E SUPERIORI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-26",
        "sottosettore": "SOCIALI E SCOLASTICHE",
        "clusterCode": "C03"
      },
      {
        "id": "CAT-107",
        "label": "SCUOLE MATERNE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-26",
        "sottosettore": "SOCIALI E SCOLASTICHE",
        "clusterCode": "C03"
      },
      {
        "id": "CAT-108",
        "label": "ASILI NIDO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-26",
        "sottosettore": "SOCIALI E SCOLASTICHE",
        "clusterCode": "C03"
      },
      {
        "id": "CAT-104",
        "label": "EDIFICI SOCIALI, CULTURALI E ASSISTENZIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-26",
        "sottosettore": "SOCIALI E SCOLASTICHE",
        "clusterCode": "C03"
      }
    ]
  },
  {
    "id": "FAB-04",
    "label": "Formazione terziaria e alta formazione",
    "descrizione": "Formazione terziaria e alta formazione",
    "sottolabel": "Università, ITS, laboratori formativi, campus",
    "temaId": "TEMA-01",
    "temaLabel": "Istruzione e formazione",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.II",
      "OS 1.I"
    ],
    "osAPDescrizione": "FESR – Infrastrutture istruzione / FESR – Ricerca e innovazione",
    "clusterCup": [
      {
        "codice": "C03",
        "label": "Edilizia scolastica e strutture sociali"
      },
      {
        "codice": "C12",
        "label": "Aree produttive, ricerca e attività economiche"
      }
    ],
    "scenarioZero": {
      "q1Label": "Il territorio dispone di strutture operative per la formazione terziaria o tecnica superiore? (Pienamente funzionante / Parzialmente funzionante / Non funzionante-inagibile / Struttura assente-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per l'edificio formativo, senza intervento?",
      "q3Label": "Qual è il costo annuo per mantenere operative le strutture formative?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-106",
        "label": "UNIVERSITA'",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-26",
        "sottosettore": "SOCIALI E SCOLASTICHE",
        "clusterCode": "C03"
      },
      {
        "id": "CAT-117",
        "label": "LABORATORI ATTREZZATI PER LA RICERCA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-31",
        "sottosettore": "OPERE E INFRASTRUTTURE PER LA RICERCA",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-118",
        "label": "CENTRI DI RICERCA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-31",
        "sottosettore": "OPERE E INFRASTRUTTURE PER LA RICERCA",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-113",
        "label": "ALTRI SOSTEGNI PER IL MERCATO DEL LAVORO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-28",
        "sottosettore": "ALTRI SOSTEGNI PER IL MERCATO DEL LAVORO",
        "clusterCode": "C03"
      }
    ]
  },
  {
    "id": "FAB-05",
    "label": "Accessibilità servizi sanitari territoriali",
    "descrizione": "Accessibilità servizi sanitari territoriali",
    "sottolabel": "Ambulatori, poliambulatori, presidi territoriali, consultori",
    "temaId": "TEMA-02",
    "temaLabel": "Inclusione sociale e salute",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.III",
      "OS 4.k"
    ],
    "osAPDescrizione": "FESR – Infrastrutture per l'inclusione sociale / FSE+ – Accesso a servizi socio-sanitari",
    "clusterCup": [
      {
        "codice": "C04",
        "label": "Sanitario"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le strutture sanitarie territoriali sono operative e accreditate? (Pienamente operative e accreditate / Operatività ridotta per problemi strutturali / Struttura chiusa-inagibile / Nessuna struttura sanitaria-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per la struttura sanitaria senza intervento?",
      "q3Label": "Qual è il costo annuo di manutenzione e gestione della struttura sanitaria attuale?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-100",
        "label": "STRUTTURE OSPEDALIERE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-25",
        "sottosettore": "SANITARIE",
        "clusterCode": "C04"
      },
      {
        "id": "CAT-101",
        "label": "ALTRI PRESIDI SANITARI TERRITORIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-25",
        "sottosettore": "SANITARIE",
        "clusterCode": "C04"
      },
      {
        "id": "CAT-099",
        "label": "ALTRE STRUTTURE SANITARIE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-25",
        "sottosettore": "SANITARIE",
        "clusterCode": "C04"
      },
      {
        "id": "CAT-102",
        "label": "RESIDENZE SANITARIE ASSISTENZIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-25",
        "sottosettore": "SANITARIE",
        "clusterCode": "C04"
      },
      {
        "id": "CAT-103",
        "label": "ALTRE STRUTTURE PER L'IGIENE LA PROFILASSI E LA TUTELA DELLA SALUTE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-25",
        "sottosettore": "SANITARIE",
        "clusterCode": "C04"
      }
    ]
  },
  {
    "id": "FAB-06",
    "label": "Assistenza anziani e non autosufficienza",
    "descrizione": "Assistenza anziani e non autosufficienza",
    "sottolabel": "RSA, centri diurni, housing protetto, strutture per anziani",
    "temaId": "TEMA-02",
    "temaLabel": "Inclusione sociale e salute",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.j",
      "OS 4.k"
    ],
    "osAPDescrizione": "FSE+ – Accesso a servizi long-term care / FSE+ – Servizi socio-sanitari integrati",
    "clusterCup": [
      {
        "codice": "C04",
        "label": "Sanitario"
      }
    ],
    "scenarioZero": {
      "q1Label": "I servizi di assistenza agli anziani sono erogati nelle strutture comunali? (Pienamente funzionanti / Parzialmente funzionanti / Struttura chiusa-inagibile / Servizio assente-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per la struttura di assistenza, senza intervento?",
      "q3Label": "Qual è il costo annuo per mantenere operative le strutture di assistenza anziani?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-102",
        "label": "RESIDENZE SANITARIE ASSISTENZIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-25",
        "sottosettore": "SANITARIE",
        "clusterCode": "C04"
      },
      {
        "id": "CAT-099",
        "label": "ALTRE STRUTTURE SANITARIE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-25",
        "sottosettore": "SANITARIE",
        "clusterCode": "C04"
      },
      {
        "id": "CAT-101",
        "label": "ALTRI PRESIDI SANITARI TERRITORIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-25",
        "sottosettore": "SANITARIE",
        "clusterCode": "C04"
      }
    ]
  },
  {
    "id": "FAB-07",
    "label": "Inclusione sociale e contrasto alla povertà",
    "descrizione": "Inclusione sociale e contrasto alla povertà",
    "sottolabel": "Centri sociali, strutture assistenziali, housing first, servizi per famiglie",
    "temaId": "TEMA-02",
    "temaLabel": "Inclusione sociale e salute",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.h",
      "OS 4.i"
    ],
    "osAPDescrizione": "FSE+ – Inclusione attiva / FSE+ – Integrazione comunità emarginate",
    "clusterCup": [
      {
        "codice": "C03",
        "label": "Edilizia scolastica e strutture sociali"
      },
      {
        "codice": "C13",
        "label": "Sicurezza pubblica, giustizia, culto e difesa"
      }
    ],
    "scenarioZero": {
      "q1Label": "I servizi sociali per soggetti fragili e famiglie in difficoltà sono erogati? (Pienamente funzionanti / Parzialmente funzionanti / Struttura chiusa-inagibile / Servizio assente-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per la struttura di servizio sociale, senza intervento?",
      "q3Label": "Qual è il costo annuo di manutenzione e gestione delle strutture per i servizi sociali?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-104",
        "label": "EDIFICI SOCIALI, CULTURALI E ASSISTENZIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-26",
        "sottosettore": "SOCIALI E SCOLASTICHE",
        "clusterCode": "C03"
      },
      {
        "id": "CAT-098",
        "label": "ALTRE STRUTTURE/INFRASTRUTTURE PER LA PUBBLICA SICUREZZA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-24",
        "sottosettore": "PUBBLICA SICUREZZA",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-080",
        "label": "ALTRE INFRASTRUTTURE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-18",
        "sottosettore": "ALTRE INFRASTRUTTURE SOCIALI",
        "clusterCode": "C13"
      }
    ]
  },
  {
    "id": "FAB-08",
    "label": "Disagio abitativo ed edilizia residenziale pubblica",
    "descrizione": "Disagio abitativo ed edilizia residenziale pubblica",
    "sottolabel": "ERP, housing sociale, residenze per comunità, borghi rurali",
    "temaId": "TEMA-02",
    "temaLabel": "Inclusione sociale e salute",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.V",
      "OS 4.l"
    ],
    "osAPDescrizione": "FESR – Infrastrutture per l'inclusione sociale e alloggi / FSE+ – Lotta alla povertà",
    "clusterCup": [
      {
        "codice": "C05",
        "label": "Edilizia residenziale pubblica"
      }
    ],
    "scenarioZero": {
      "q1Label": "Il patrimonio ERP disponibile è agibile e assegnato? (Pienamente agibile e occupato / Parzialmente agibile / Patrimonio inagibile-sfitto / Patrimonio assente-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per gli edifici ERP, senza intervento?",
      "q3Label": "Qual è il costo annuo di manutenzione ordinaria e straordinaria del patrimonio ERP?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-074",
        "label": "FABBRICATI RESIDENZIALI URBANI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-17",
        "sottosettore": "ABITATIVE",
        "clusterCode": "C05"
      },
      {
        "id": "CAT-075",
        "label": "ABITAZIONI RURALI E BORGHI RURALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-17",
        "sottosettore": "ABITATIVE",
        "clusterCode": "C05"
      },
      {
        "id": "CAT-076",
        "label": "RESIDENZE PER COMUNITA'",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-17",
        "sottosettore": "ABITATIVE",
        "clusterCode": "C05"
      },
      {
        "id": "CAT-077",
        "label": "ALTRI EDIFICI ABITATIVI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-17",
        "sottosettore": "ABITATIVE",
        "clusterCode": "C05"
      },
      {
        "id": "CAT-078",
        "label": "EDIFICI DANNEGGIATI DA CALAMITA' NATURALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-17",
        "sottosettore": "ABITATIVE",
        "clusterCode": "C05"
      },
      {
        "id": "CAT-079",
        "label": "INFRASTRUTTURE CIVILI PER COMPLESSI RESIDENZIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-17",
        "sottosettore": "ABITATIVE",
        "clusterCode": "C05"
      }
    ]
  },
  {
    "id": "FAB-09",
    "label": "Servizi per l'impiego e formazione professionale",
    "descrizione": "Servizi per l'impiego e formazione professionale",
    "sottolabel": "Centri per l'impiego, spazi co-working, incubatori d'impresa",
    "temaId": "TEMA-03",
    "temaLabel": "Lavoro e occupazione",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.a",
      "OS 4.b"
    ],
    "osAPDescrizione": "FSE+ – Accesso all'occupazione / FSE+ – Modernizzazione istituzioni mercato del lavoro",
    "clusterCup": [
      {
        "codice": "C03",
        "label": "Edilizia scolastica e strutture sociali"
      },
      {
        "codice": "C12",
        "label": "Aree produttive, ricerca e attività economiche"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le strutture per l'orientamento, la formazione e l'accesso al lavoro sono operative? (Pienamente funzionanti / Parzialmente funzionanti / Struttura chiusa-inagibile / Struttura assente-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per la struttura, senza intervento?",
      "q3Label": "Qual è il costo annuo di manutenzione e gestione della struttura per i servizi al lavoro?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-104",
        "label": "EDIFICI SOCIALI, CULTURALI E ASSISTENZIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-26",
        "sottosettore": "SOCIALI E SCOLASTICHE",
        "clusterCode": "C03"
      },
      {
        "id": "CAT-113",
        "label": "ALTRI SOSTEGNI PER IL MERCATO DEL LAVORO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-28",
        "sottosettore": "ALTRI SOSTEGNI PER IL MERCATO DEL LAVORO",
        "clusterCode": "C03"
      },
      {
        "id": "CAT-119",
        "label": "SPAZI E STRUTTURE PER LE ATTIVITA' DI IMPRESA SOCIALE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-32",
        "sottosettore": "OPERE E INFRASTRUTTURE PER L'IMPRESA SOCIALE",
        "clusterCode": "C12"
      }
    ]
  },
  {
    "id": "FAB-33",
    "label": "Sostegno all'occupazione giovanile e femminile e welfare di comunità",
    "descrizione": "Sostegno all'occupazione giovanile e femminile e welfare di comunità",
    "sottolabel": "Infrastrutture per politiche attive del lavoro, economia sociale, spazi di orientamento e conciliazione famiglia-lavoro",
    "temaId": "TEMA-03",
    "temaLabel": "Lavoro e occupazione",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.a",
      "OS 4.b",
      "OS 4.c",
      "OS 4.d"
    ],
    "osAPDescrizione": "FSE+ – Accesso all'occupazione per giovani e donne / FSE+ – Modernizzazione servizi mercato del lavoro / FSE+ – Partecipazione equilibrata al mercato del lavoro / FSE+ – Adattamento lavoratori e imprese",
    "clusterCup": [
      {
        "codice": "C03",
        "label": "Edilizia scolastica e strutture sociali"
      },
      {
        "codice": "C12",
        "label": "Aree produttive, ricerca e attività economiche"
      }
    ],
    "scenarioZero": {
      "q1Label": "Il territorio dispone di strutture e spazi per le politiche attive del lavoro, l'orientamento e la conciliazione famiglia-lavoro? (Servizio strutturato e attivo / Servizio parziale o discontinuo / Servizio assente ma domanda documentata / Nessuna infrastruttura né servizio – greenfield",
      "q2Label": "Quanti anni di vita utile residua stimi per le strutture dedicate alle politiche attive del lavoro, senza intervento?",
      "q3Label": "Qual è il costo annuo di gestione e manutenzione delle strutture per i servizi al lavoro e il welfare di comunità?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-104",
        "label": "EDIFICI SOCIALI, CULTURALI E ASSISTENZIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-26",
        "sottosettore": "SOCIALI E SCOLASTICHE",
        "clusterCode": "C03"
      },
      {
        "id": "CAT-119",
        "label": "SPAZI E STRUTTURE PER LE ATTIVITA' DI IMPRESA SOCIALE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-32",
        "sottosettore": "OPERE E INFRASTRUTTURE PER L'IMPRESA SOCIALE",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-113",
        "label": "ALTRI SOSTEGNI PER IL MERCATO DEL LAVORO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-28",
        "sottosettore": "ALTRI SOSTEGNI PER IL MERCATO DEL LAVORO",
        "clusterCode": "C03"
      },
      {
        "id": "CAT-126",
        "label": "STRUTTURE INDUSTRIALI COMUNI ED ALTRI EDIFICI ATTREZZATI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-35",
        "sottosettore": "OPERE, IMPIANTI ED ATTREZZATURE PER ATTIVITA' INDUSTRIALI E L'ARTIGIANATO",
        "clusterCode": "C12"
      }
    ]
  },
  {
    "id": "FAB-10",
    "label": "Sicurezza idrogeologica del territorio",
    "descrizione": "Sicurezza idrogeologica del territorio",
    "sottolabel": "Difesa del suolo, consolidamento versanti, regimazione corsi d'acqua, protezione coste",
    "temaId": "TEMA-04",
    "temaLabel": "Ambiente e risorse naturali",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 2.IV"
    ],
    "osAPDescrizione": "FESR – Adattamento ai cambiamenti climatici e gestione rischi",
    "clusterCup": [
      {
        "codice": "C07",
        "label": "Difesa del suolo e delle acque"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le opere di difesa idrogeologica sono in esercizio e garantiscono protezione adeguata? (Pienamente operative / Parzialmente efficaci / Opere assenti-deteriorate-non operative / Nessuna opera-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per le opere di difesa, senza manutenzione straordinaria?",
      "q3Label": "Qual è il costo annuo di manutenzione ordinaria delle opere idrogeologiche esistenti?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-001",
        "label": "ALTRE INFRASTRUTTURE/STRUTTURE DI DIFESA DEL SUOLO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-01",
        "sottosettore": "DIFESA DEL SUOLO",
        "clusterCode": "C07"
      },
      {
        "id": "CAT-003",
        "label": "REGIMAZIONE ACQUE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-01",
        "sottosettore": "DIFESA DEL SUOLO",
        "clusterCode": "C07"
      },
      {
        "id": "CAT-004",
        "label": "SPIAGGE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-01",
        "sottosettore": "DIFESA DEL SUOLO",
        "clusterCode": "C07"
      },
      {
        "id": "CAT-005",
        "label": "CORSI D'ACQUA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-01",
        "sottosettore": "DIFESA DEL SUOLO",
        "clusterCode": "C07"
      },
      {
        "id": "CAT-006",
        "label": "ABITATI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-01",
        "sottosettore": "DIFESA DEL SUOLO",
        "clusterCode": "C07"
      },
      {
        "id": "CAT-007",
        "label": "BONIFICA DI SITI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-01",
        "sottosettore": "DIFESA DEL SUOLO",
        "clusterCode": "C07"
      },
      {
        "id": "CAT-008",
        "label": "STRUTTURE/INFRASTRUTTURE A RISCHIO SISMICO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-01",
        "sottosettore": "DIFESA DEL SUOLO",
        "clusterCode": "C07"
      }
    ]
  },
  {
    "id": "FAB-11",
    "label": "Approvvigionamento idrico e qualità delle acque",
    "descrizione": "Approvvigionamento idrico e qualità delle acque",
    "sottolabel": "Acquedotti urbani e rurali, reti idriche, impianti di depurazione, dissalatori",
    "temaId": "TEMA-04",
    "temaLabel": "Ambiente e risorse naturali",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 2.V"
    ],
    "osAPDescrizione": "FESR – Uso sostenibile delle risorse idriche",
    "clusterCup": [
      {
        "codice": "C08",
        "label": "Reti idriche, fognarie e gestione rifiuti"
      }
    ],
    "scenarioZero": {
      "q1Label": "Il servizio idrico integrato è erogato alla popolazione servita? (Servizio continuo e conforme / Servizio intermittente o con perdite elevate / Rete fuori servizio-acqua non potabile / Rete idrica assente-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per la rete/impianto idrico, senza intervento?",
      "q3Label": "Qual è il costo annuo per mantenere in esercizio la rete idrica e gli impianti di depurazione?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-016",
        "label": "RETI IDRICHE URBANE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-04",
        "sottosettore": "RISORSE IDRICHE E ACQUE REFLUE",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-024",
        "label": "RETI IDRICHE RURALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-04",
        "sottosettore": "RISORSE IDRICHE E ACQUE REFLUE",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-026",
        "label": "RETI IDRICHE INDUSTRIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-04",
        "sottosettore": "RISORSE IDRICHE E ACQUE REFLUE",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-017",
        "label": "ALTRE STRUTTURE/INFRASTRUTTURE PER L'UTILIZZO DELLE RISORSE IDRICHE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-04",
        "sottosettore": "RISORSE IDRICHE E ACQUE REFLUE",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-018",
        "label": "RETI PER IL COLLETTAMENTO DELLE ACQUE PLUVIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-04",
        "sottosettore": "RISORSE IDRICHE E ACQUE REFLUE",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-019",
        "label": "STRUTTURE/INFRASTRUTTURE PER LA CAPTAZIONE E ADDUZIONE DELL'ACQUA PER ESCLUSIVO USO AGRICOLO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-04",
        "sottosettore": "RISORSE IDRICHE E ACQUE REFLUE",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-131",
        "label": "STRUTTURE/INFRASTRUTTURE PER LA CAPTAZIONE E ADDUZIONE DELL'ACQUA PER USI NON AGRICOLI O AD USO PLURIMO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-04",
        "sottosettore": "RISORSE IDRICHE E ACQUE REFLUE",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-029",
        "label": "IMPIANTI DEPURAZIONE ACQUE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-05",
        "sottosettore": "SMALTIMENTO RIFIUTI",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-022",
        "label": "SERBATOI ED IMPIANTI DI SOLLEVAMENTO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-04",
        "sottosettore": "RISORSE IDRICHE E ACQUE REFLUE",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-028",
        "label": "RETI FOGNARIE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-05",
        "sottosettore": "SMALTIMENTO RIFIUTI",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-025",
        "label": "DISSALATORI E STRUTTURE/INFRASTRUTTURE PER LA POTABILIZZAZIONE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-04",
        "sottosettore": "RISORSE IDRICHE E ACQUE REFLUE",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-023",
        "label": "CORPI IDRICI: MIGLIORAMENTO DELLA QUALITA'",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-04",
        "sottosettore": "RISORSE IDRICHE E ACQUE REFLUE",
        "clusterCode": "C08"
      }
    ]
  },
  {
    "id": "FAB-12",
    "label": "Gestione rifiuti ed economia circolare",
    "descrizione": "Gestione rifiuti ed economia circolare",
    "sottolabel": "Raccolta differenziata, impianti di trattamento, piattaforme ecologiche",
    "temaId": "TEMA-04",
    "temaLabel": "Ambiente e risorse naturali",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 2.VI"
    ],
    "osAPDescrizione": "FESR – Economia circolare e gestione rifiuti",
    "clusterCup": [
      {
        "codice": "C08",
        "label": "Reti idriche, fognarie e gestione rifiuti"
      }
    ],
    "scenarioZero": {
      "q1Label": "Il servizio di gestione rifiuti è operativo nel territorio comunale? (Pienamente operativo con RD adeguata / Parzialmente operativo-RD insufficiente / Servizio in grave criticità / Servizio assente-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per gli impianti di trattamento/raccolta, senza intervento?",
      "q3Label": "Qual è il costo annuo per la gestione del servizio rifiuti con le infrastrutture attuali?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-027",
        "label": "IMPIANTI DI TRATTAMENTO RIFIUTI URBANI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-05",
        "sottosettore": "SMALTIMENTO RIFIUTI",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-030",
        "label": "SISTEMI DI RACCOLTA DIFFERENZIATA DEI RIFIUTI URBANI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-05",
        "sottosettore": "SMALTIMENTO RIFIUTI",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-031",
        "label": "IMPIANTI PER LA GESTIONE DELLA RACCOLTA DIFFERENZIATA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-05",
        "sottosettore": "SMALTIMENTO RIFIUTI",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-032",
        "label": "IMPIANTI DI STOCCAGGIO E SOLLEVAMENTO ACQUE REFLUE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-05",
        "sottosettore": "SMALTIMENTO RIFIUTI",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-028",
        "label": "RETI FOGNARIE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-05",
        "sottosettore": "SMALTIMENTO RIFIUTI",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-029",
        "label": "IMPIANTI DEPURAZIONE ACQUE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-05",
        "sottosettore": "SMALTIMENTO RIFIUTI",
        "clusterCode": "C08"
      }
    ]
  },
  {
    "id": "FAB-13",
    "label": "Verde urbano, biodiversità e qualità dell'aria",
    "descrizione": "Verde urbano, biodiversità e qualità dell'aria",
    "sottolabel": "Parchi urbani, aree protette, isola di calore, monitoraggio ambientale",
    "temaId": "TEMA-04",
    "temaLabel": "Ambiente e risorse naturali",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 2.VII"
    ],
    "osAPDescrizione": "FESR – Protezione della natura e biodiversità",
    "clusterCup": [
      {
        "codice": "C09",
        "label": "Verde urbano, ambiente e qualità dell'aria"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le aree verdi pubbliche e i parchi sono fruibili e manutenuti? (Pienamente fruibili e manutenuti / Parzialmente fruibili / Aree verdi degradate-non fruibili / Aree verdi assenti-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per le infrastrutture verdi esistenti, senza manutenzione?",
      "q3Label": "Qual è il costo annuo di manutenzione ordinaria delle aree verdi e degli impianti ambientali?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-130",
        "label": "STRUTTURE PER LA FRUIZIONE DEL PATRIMONIO AMBIENTALE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-02",
        "sottosettore": "PROTEZIONE, VALORIZZAZIONE E FRUIZIONE DELL'AMBIENTE",
        "clusterCode": "C09"
      },
      {
        "id": "CAT-010",
        "label": "PARCHI E RISERVE AREE PROTETTE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-02",
        "sottosettore": "PROTEZIONE, VALORIZZAZIONE E FRUIZIONE DELL'AMBIENTE",
        "clusterCode": "C09"
      },
      {
        "id": "CAT-011",
        "label": "SITI NATURALI E RURALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-02",
        "sottosettore": "PROTEZIONE, VALORIZZAZIONE E FRUIZIONE DELL'AMBIENTE",
        "clusterCode": "C09"
      },
      {
        "id": "CAT-012",
        "label": "SISTEMI DI MONITORAGGIO AMBIENTALE E TELECONTROLLO DELL'INQUINAMENTO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-02",
        "sottosettore": "PROTEZIONE, VALORIZZAZIONE E FRUIZIONE DELL'AMBIENTE",
        "clusterCode": "C09"
      },
      {
        "id": "CAT-082",
        "label": "VERDE PUBBLICO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-18",
        "sottosettore": "ALTRE INFRASTRUTTURE SOCIALI",
        "clusterCode": "C09"
      },
      {
        "id": "CAT-083",
        "label": "ARREDO URBANO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-18",
        "sottosettore": "ALTRE INFRASTRUTTURE SOCIALI",
        "clusterCode": "C09"
      }
    ]
  },
  {
    "id": "FAB-14",
    "label": "Bonifica e rigenerazione di siti degradati",
    "descrizione": "Bonifica e rigenerazione di siti degradati",
    "sottolabel": "Aree dismesse, siti contaminati, ex aree industriali da bonificare",
    "temaId": "TEMA-04",
    "temaLabel": "Ambiente e risorse naturali",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 2.VII"
    ],
    "osAPDescrizione": "FESR – Protezione natura e biodiversità / FESR – Sviluppo locale integrato",
    "clusterCup": [
      {
        "codice": "C08",
        "label": "Reti idriche, fognarie e gestione rifiuti"
      }
    ],
    "scenarioZero": {
      "q1Label": "Il sito è attualmente utilizzato o in stato di abbandono e contaminazione? (Sito parzialmente utilizzato / Sito abbandonato-non bonificato / Sito contaminato-interdetto / Sito bonificato-pronto per riuso)",
      "q2Label": "Da quanti anni il sito è in stato di abbandono o non uso? (in sostituzione della vita utile residua)",
      "q3Label": "Qual è il costo annuo stimato per la custodia e il monitoraggio del sito degradato?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-013",
        "label": "AREE DISMESSE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-03",
        "sottosettore": "RIASSETTO E RECUPERO DI SITI URBANI E PRODUTTIVI",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-014",
        "label": "ALTRE SITI PRODUTTIVI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-03",
        "sottosettore": "RIASSETTO E RECUPERO DI SITI URBANI E PRODUTTIVI",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-015",
        "label": "SITI CONTAMINATI E/O DEGRADATI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-03",
        "sottosettore": "RIASSETTO E RECUPERO DI SITI URBANI E PRODUTTIVI",
        "clusterCode": "C08"
      }
    ]
  },
  {
    "id": "FAB-15",
    "label": "Presidio e gestione del territorio forestale",
    "descrizione": "Presidio e gestione del territorio forestale",
    "sottolabel": "Foreste, vivai forestali, coltivazioni silvo-forestali, rimboschimento",
    "temaId": "TEMA-04",
    "temaLabel": "Ambiente e risorse naturali",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 2.VII"
    ],
    "osAPDescrizione": "FESR – Protezione della natura e biodiversità",
    "clusterCup": [
      {
        "codice": "C07",
        "label": "Difesa del suolo e delle acque"
      },
      {
        "codice": "C12",
        "label": "Aree produttive, ricerca e attività economiche"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le aree forestali comunali sono presidiate e gestite attivamente? (Pienamente presidiate / Presidio parziale / Abbandono con rischio incendi-frane / Superficie forestale assente nel territorio)",
      "q2Label": "Quanti anni senza intervento di gestione forestale attiva stima per le aree in abbandono?",
      "q3Label": "Qual è il costo annuo di presidio ordinario delle aree forestali?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-002",
        "label": "FORESTE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-01",
        "sottosettore": "DIFESA DEL SUOLO",
        "clusterCode": "C07"
      },
      {
        "id": "CAT-128",
        "label": "STRUTTURE PER COLTIVAZIONI FORESTALI (VIVAI, ECC)",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-36",
        "sottosettore": "OPERE, IMPIANTI ED ATTREZZATURE PER IL SETTORE SILVO-FORESTALE",
        "clusterCode": "C12"
      }
    ]
  },
  {
    "id": "FAB-16",
    "label": "Efficienza energetica di edifici e servizi pubblici",
    "descrizione": "Efficienza energetica di edifici e servizi pubblici",
    "sottolabel": "Riqualificazione energetica edifici pubblici, illuminazione pubblica LED, domotica",
    "temaId": "TEMA-05",
    "temaLabel": "Energia e clima",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 2.I"
    ],
    "osAPDescrizione": "FESR – Efficienza energetica",
    "clusterCup": [
      {
        "codice": "C09",
        "label": "Verde urbano, ambiente e qualità dell'aria"
      },
      {
        "codice": "C10",
        "label": "Energia (produzione e distribuzione)"
      }
    ],
    "scenarioZero": {
      "q1Label": "Gli edifici/impianti pubblici oggetto dell'intervento sono in funzione? (In funzione con classe energetica E-G / Funzionamento parziale con criticità impiantistiche / Impianti fermi-edificio inutilizzato / Edificio-impianto assente-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per gli impianti termici ed elettrici esistenti, senza sostituzione?",
      "q3Label": "Qual è il costo annuo attuale delle utenze energetiche dell'edificio/impianto (riscaldamento + elettricità)?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-033",
        "label": "IMPIANTI PER L'EFFICIENZA DELLE RETI E RISPARMIO ENERGETICO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-06",
        "sottosettore": "DISTRIBUZIONE DI ENERGIA",
        "clusterCode": "C10"
      },
      {
        "id": "CAT-034",
        "label": "IMPIANTI DI DISTRIBUZIONE DI ENERGIA ELETTRICA E TERMICA, CIVILE E INDUSTRIALE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-06",
        "sottosettore": "DISTRIBUZIONE DI ENERGIA",
        "clusterCode": "C10"
      },
      {
        "id": "CAT-084",
        "label": "ILLUMINAZIONE PUBBLICA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-18",
        "sottosettore": "ALTRE INFRASTRUTTURE SOCIALI",
        "clusterCode": "C09"
      },
      {
        "id": "CAT-040",
        "label": "IMPIANTI DI COGENERAZIONE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-07",
        "sottosettore": "PRODUZIONE DI ENERGIA",
        "clusterCode": "C10"
      }
    ]
  },
  {
    "id": "FAB-17",
    "label": "Produzione di energia da fonti rinnovabili",
    "descrizione": "Produzione di energia da fonti rinnovabili",
    "sottolabel": "Impianti FER, comunità energetiche, cogenerazione, idroelettrico",
    "temaId": "TEMA-05",
    "temaLabel": "Energia e clima",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 2.II",
      "OS 2.III"
    ],
    "osAPDescrizione": "FESR – Energie rinnovabili / FESR – Sistemi energetici intelligenti",
    "clusterCup": [
      {
        "codice": "C10",
        "label": "Energia (produzione e distribuzione)"
      }
    ],
    "scenarioZero": {
      "q1Label": "Il territorio dispone di impianti FER di proprietà pubblica o in comunità energetica? (Impianti operativi / Impianti parzialmente operativi / Impianti fermi-non operativi / Nessun impianto FER-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per gli impianti FER esistenti, senza manutenzione straordinaria?",
      "q3Label": "Qual è il costo annuo di manutenzione e gestione degli impianti FER esistenti?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-037",
        "label": "ALTRI IMPIANTI PRODUZIONE ENERGIE DA FONTI RINNOVABILI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-07",
        "sottosettore": "PRODUZIONE DI ENERGIA",
        "clusterCode": "C10"
      },
      {
        "id": "CAT-041",
        "label": "IMPIANTI PRODUZIONE IDROELETTRICA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-07",
        "sottosettore": "PRODUZIONE DI ENERGIA",
        "clusterCode": "C10"
      },
      {
        "id": "CAT-038",
        "label": "ALTRI IMPIANTI PER LA PRODUZIONE E L'ESTRAZIONE DI ENERGIA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-07",
        "sottosettore": "PRODUZIONE DI ENERGIA",
        "clusterCode": "C10"
      },
      {
        "id": "CAT-039",
        "label": "IMPIANTI PRODUZIONE TERMOELETTRICA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-07",
        "sottosettore": "PRODUZIONE DI ENERGIA",
        "clusterCode": "C10"
      },
      {
        "id": "CAT-036",
        "label": "RETI DISTRIBUZIONE GAS",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-06",
        "sottosettore": "DISTRIBUZIONE DI ENERGIA",
        "clusterCode": "C10"
      },
      {
        "id": "CAT-035",
        "label": "IMPIANTI DI TRASMISSIONE DI ENERGIA ELETTRICA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-06",
        "sottosettore": "DISTRIBUZIONE DI ENERGIA",
        "clusterCode": "C10"
      }
    ]
  },
  {
    "id": "FAB-18",
    "label": "Sicurezza stradale e viabilità locale",
    "descrizione": "Sicurezza stradale e viabilità locale",
    "sottolabel": "Strade comunali, provinciali, ponti, tombini, segnaletica",
    "temaId": "TEMA-06",
    "temaLabel": "Trasporti e mobilità",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 3.II"
    ],
    "osAPDescrizione": "FESR – Mobilità di area vasta e trasporti sostenibili",
    "clusterCup": [
      {
        "codice": "C01",
        "label": "Viabilità e mobilità stradale/urbana"
      }
    ],
    "scenarioZero": {
      "q1Label": "La rete stradale comunale/provinciale è percorribile in condizioni di sicurezza? (Percorribile e sicura / Transitabile con limitazioni / Interdetta o pericolosa / Infrastruttura stradale assente-greenfield)",
      "q2Label": "Quanti anni stimati prima che la strada richieda rifacimento strutturale del manto o delle opere d'arte?",
      "q3Label": "Qual è il costo annuo di manutenzione ordinaria della tratta stradale (toppe, cunette, segnaletica)?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-053",
        "label": "STRADE REGIONALI, PROVINCIALI E COMUNALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-11",
        "sottosettore": "STRADALI",
        "clusterCode": "C01"
      },
      {
        "id": "CAT-055",
        "label": "STRADE STATALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-11",
        "sottosettore": "STRADALI",
        "clusterCode": "C01"
      },
      {
        "id": "CAT-056",
        "label": "STRADE RURALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-11",
        "sottosettore": "STRADALI",
        "clusterCode": "C01"
      },
      {
        "id": "CAT-057",
        "label": "AUTOSTRADE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-11",
        "sottosettore": "STRADALI",
        "clusterCode": "C01"
      },
      {
        "id": "CAT-132",
        "label": "ALTRE STRUTTURE/INFRASTRUTTURE STRADALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-11",
        "sottosettore": "STRADALI",
        "clusterCode": "C01"
      }
    ]
  },
  {
    "id": "FAB-19",
    "label": "Mobilità sostenibile e attiva",
    "descrizione": "Mobilità sostenibile e attiva",
    "sottolabel": "Piste ciclabili, percorsi pedonali, ITS, parcheggi di scambio, TPL",
    "temaId": "TEMA-06",
    "temaLabel": "Trasporti e mobilità",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 2.VIII"
    ],
    "osAPDescrizione": "FESR – Mobilità urbana sostenibile",
    "clusterCup": [
      {
        "codice": "C01",
        "label": "Viabilità e mobilità stradale/urbana"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le infrastrutture per la mobilità sostenibile e attiva sono disponibili e sicure? (Infrastrutture complete e sicure / Rete parziale con discontinuità / Infrastrutture degradate-pericolose / Infrastrutture assenti-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per le infrastrutture di mobilità sostenibile esistenti?",
      "q3Label": "Qual è il costo annuo di manutenzione delle piste ciclabili, percorsi pedonali e sistemi ITS?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-054",
        "label": "PISTE CICLABILI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-11",
        "sottosettore": "STRADALI",
        "clusterCode": "C01"
      },
      {
        "id": "CAT-063",
        "label": "SISTEMI DI PARCHEGGIO E INTERSCAMBIO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-13",
        "sottosettore": "TRASPORTO URBANO",
        "clusterCode": "C01"
      },
      {
        "id": "CAT-064",
        "label": "SISTEMI INTEGRATI E DI TRASPORTO INTELLIGENTI PER LA MOBILITA' SOSTENIBILE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-13",
        "sottosettore": "TRASPORTO URBANO",
        "clusterCode": "C01"
      },
      {
        "id": "CAT-061",
        "label": "ALTRI STRUTTURE/INFRASTRUTTURE DI TRASPORTO URBANE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-13",
        "sottosettore": "TRASPORTO URBANO",
        "clusterCode": "C01"
      },
      {
        "id": "CAT-062",
        "label": "LINEE METROPOLITANE E TRAMVIARIE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-13",
        "sottosettore": "TRASPORTO URBANO",
        "clusterCode": "C01"
      },
      {
        "id": "CAT-058",
        "label": "FUNIVIE, SEGGIOVIE, FUNICOLARI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-12",
        "sottosettore": "TRASPORTI MULTIMODALI E ALTRE MODALITA' DI TRASPORTO",
        "clusterCode": "C01"
      },
      {
        "id": "CAT-059",
        "label": "ALTRE MODALITA' DI TRASPORTO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-12",
        "sottosettore": "TRASPORTI MULTIMODALI E ALTRE MODALITA' DI TRASPORTO",
        "clusterCode": "C01"
      },
      {
        "id": "CAT-060",
        "label": "TRASPORTI MULTIMODALI ED INTERPORTI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-12",
        "sottosettore": "TRASPORTI MULTIMODALI E ALTRE MODALITA' DI TRASPORTO",
        "clusterCode": "C01"
      }
    ]
  },
  {
    "id": "FAB-20",
    "label": "Accessibilità reti di trasporto maggiore",
    "descrizione": "Accessibilità reti di trasporto maggiore",
    "sottolabel": "Ferrovie regionali, porti commerciali e turistici, aeroporti regionali",
    "temaId": "TEMA-06",
    "temaLabel": "Trasporti e mobilità",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 3.I",
      "OS 3.II"
    ],
    "osAPDescrizione": "FESR – Reti TEN-T / FESR – Mobilità di area vasta",
    "clusterCup": [
      {
        "codice": "C02",
        "label": "Trasporto maggiore (ferro, porto, aeroporto)"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le infrastrutture di trasporto maggiore (ferro/mare/aria) sono operative e connesse? (Pienamente operative / Operatività ridotta / Non operative-in dismissione / Infrastrutture assenti-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per le infrastrutture di trasporto maggiore, senza investimento?",
      "q3Label": "Qual è il costo annuo di manutenzione e gestione delle infrastrutture di trasporto maggiore?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-045",
        "label": "LINEE FERROVIARIE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-09",
        "sottosettore": "FERROVIE",
        "clusterCode": "C02"
      },
      {
        "id": "CAT-046",
        "label": "ALTRE STRUTTURE/INFRASTRUTTURE FERROVIARIE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-09",
        "sottosettore": "FERROVIE",
        "clusterCode": "C02"
      },
      {
        "id": "CAT-047",
        "label": "STAZIONE E TERMINALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-09",
        "sottosettore": "FERROVIE",
        "clusterCode": "C02"
      },
      {
        "id": "CAT-048",
        "label": "PORTI COMMERCIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-10",
        "sottosettore": "MARITTIME LACUALI E FLUVIALI",
        "clusterCode": "C02"
      },
      {
        "id": "CAT-049",
        "label": "PORTI TURISTICI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-10",
        "sottosettore": "MARITTIME LACUALI E FLUVIALI",
        "clusterCode": "C02"
      },
      {
        "id": "CAT-051",
        "label": "PORTI PER LA PESCA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-10",
        "sottosettore": "MARITTIME LACUALI E FLUVIALI",
        "clusterCode": "C02"
      },
      {
        "id": "CAT-052",
        "label": "IDROVIE E STRUTTURE/INFRASTRUTTURE FLUVIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-10",
        "sottosettore": "MARITTIME LACUALI E FLUVIALI",
        "clusterCode": "C02"
      },
      {
        "id": "CAT-050",
        "label": "ALTRE STRUTTURE/INFRASTRUTTURE MARITTIME E FLUVIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-10",
        "sottosettore": "MARITTIME LACUALI E FLUVIALI",
        "clusterCode": "C02"
      },
      {
        "id": "CAT-043",
        "label": "PISTE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-08",
        "sottosettore": "AEROPORTUALI",
        "clusterCode": "C02"
      },
      {
        "id": "CAT-044",
        "label": "AEROSTAZIONI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-08",
        "sottosettore": "AEROPORTUALI",
        "clusterCode": "C02"
      },
      {
        "id": "CAT-042",
        "label": "ALTRE STRUTTURE/INFRASTRUTTURE AEROPORTUALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-08",
        "sottosettore": "AEROPORTUALI",
        "clusterCode": "C02"
      }
    ]
  },
  {
    "id": "FAB-21",
    "label": "Adeguamento e messa in sicurezza degli edifici pubblici strategici",
    "descrizione": "Adeguamento e messa in sicurezza degli edifici pubblici strategici",
    "sottolabel": "Protezione civile, caserme, tribunali, uffici PA, strutture sicurezza pubblica",
    "temaId": "TEMA-07",
    "temaLabel": "Città e territorio",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 2.IV"
    ],
    "osAPDescrizione": "FESR – Adattamento ai cambiamenti climatici e gestione rischi",
    "clusterCup": [
      {
        "codice": "C13",
        "label": "Sicurezza pubblica, giustizia, culto e difesa"
      }
    ],
    "scenarioZero": {
      "q1Label": "Gli edifici istituzionali strategici sono agibili e conformi agli standard antisismici? (Pienamente agibili e conformi / Conformità parziale / Edifici a rischio-inagibili / Edifici assenti-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per gli edifici istituzionali, senza adeguamento sismico?",
      "q3Label": "Qual è il costo annuo di manutenzione degli edifici istituzionali esistenti?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-097",
        "label": "EDIFICI ED INFRASTRUTTURE PER LA PROTEZIONE CIVILE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-24",
        "sottosettore": "PUBBLICA SICUREZZA",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-098",
        "label": "ALTRE STRUTTURE/INFRASTRUTTURE PER LA PUBBLICA SICUREZZA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-24",
        "sottosettore": "PUBBLICA SICUREZZA",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-096",
        "label": "ALTRE STRUTTURE/INFRASTRUTTURE GIUDIZIARIE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-23",
        "sottosettore": "GIUDIZIARIE E PENITENZIARIE",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-092",
        "label": "CASERME",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-21",
        "sottosettore": "DIFESA",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-093",
        "label": "STRUTTURE/INFRASTRUTTURE PER SEDI DELLA PUBBLICA AMMINISTRAZIONE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-22",
        "sottosettore": "DIREZIONALI E AMMINISTRATIVE",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-094",
        "label": "EDIFICI E INFRASTRUTTURE PER UFFICI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-22",
        "sottosettore": "DIREZIONALI E AMMINISTRATIVE",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-095",
        "label": "STRUTTURE/INFRASTRUTTURE PER SEDI DI ORGANI ISTITUZIONALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-22",
        "sottosettore": "DIREZIONALI E AMMINISTRATIVE",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-093",
        "label": "STRUTTURE/INFRASTRUTTURE PER SEDI DELLA PUBBLICA AMMINISTRAZIONE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-22",
        "sottosettore": "DIREZIONALI E AMMINISTRATIVE",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-095",
        "label": "STRUTTURE/INFRASTRUTTURE PER SEDI DI ORGANI ISTITUZIONALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-22",
        "sottosettore": "DIREZIONALI E AMMINISTRATIVE",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-094",
        "label": "EDIFICI E INFRASTRUTTURE PER UFFICI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-22",
        "sottosettore": "DIREZIONALI E AMMINISTRATIVE",
        "clusterCode": "C13"
      }
    ]
  },
  {
    "id": "FAB-22",
    "label": "Qualità degli spazi pubblici e arredo urbano",
    "descrizione": "Qualità degli spazi pubblici e arredo urbano",
    "sottolabel": "Piazze, percorsi pedonali, illuminazione pubblica, arredo, cimiteri",
    "temaId": "TEMA-07",
    "temaLabel": "Città e territorio",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [],
    "osAPDescrizione": "FESR – Sviluppo urbano sostenibile integrato",
    "clusterCup": [
      {
        "codice": "C09",
        "label": "Verde urbano, ambiente e qualità dell'aria"
      },
      {
        "codice": "C13",
        "label": "Sicurezza pubblica, giustizia, culto e difesa"
      }
    ],
    "scenarioZero": {
      "q1Label": "Gli spazi pubblici urbani sono fruibili, sicuri e adeguatamente manutenuti? (Pienamente fruibili e manutenuti / Parzialmente fruibili / Spazi degradati-non fruibili / Spazi pubblici assenti-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per gli arredi urbani e le infrastrutture di spazio pubblico?",
      "q3Label": "Qual è il costo annuo di manutenzione ordinaria degli spazi pubblici e dell'arredo urbano?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-083",
        "label": "ARREDO URBANO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-18",
        "sottosettore": "ALTRE INFRASTRUTTURE SOCIALI",
        "clusterCode": "C09"
      },
      {
        "id": "CAT-084",
        "label": "ILLUMINAZIONE PUBBLICA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-18",
        "sottosettore": "ALTRE INFRASTRUTTURE SOCIALI",
        "clusterCode": "C09"
      },
      {
        "id": "CAT-129",
        "label": "ALTRI SERVIZI PER LA COLLETTIVITA'",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-37",
        "sottosettore": "ALTRI SERVIZI PER LA COLLETTIVITA'",
        "clusterCode": "C09"
      },
      {
        "id": "CAT-081",
        "label": "CIMITERI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-18",
        "sottosettore": "ALTRE INFRASTRUTTURE SOCIALI",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-080",
        "label": "ALTRE INFRASTRUTTURE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-18",
        "sottosettore": "ALTRE INFRASTRUTTURE SOCIALI",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-090",
        "label": "CHIESE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-20",
        "sottosettore": "CULTO",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-091",
        "label": "CONVENTI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-20",
        "sottosettore": "CULTO",
        "clusterCode": "C13"
      },
      {
        "id": "CAT-081",
        "label": "CIMITERI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-18",
        "sottosettore": "ALTRE INFRASTRUTTURE SOCIALI",
        "clusterCode": "C13"
      }
    ]
  },
  {
    "id": "FAB-23",
    "label": "Rigenerazione urbana e contrasto allo spopolamento",
    "descrizione": "Rigenerazione urbana e contrasto allo spopolamento",
    "sottolabel": "Recupero aree dismesse a uso urbano, borghi in abbandono, periferie degradate",
    "temaId": "TEMA-07",
    "temaLabel": "Città e territorio",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [],
    "osAPDescrizione": "FESR – Sviluppo locale integrato e strategie urbane",
    "clusterCup": [
      {
        "codice": "C05",
        "label": "Edilizia residenziale pubblica"
      },
      {
        "codice": "C08",
        "label": "Reti idriche, fognarie e gestione rifiuti"
      }
    ],
    "scenarioZero": {
      "q1Label": "L'area urbana/borghi oggetto di intervento sono abitati e vitali? (Area vitale con qualche criticità / Area in spopolamento progressivo / Area prevalentemente abbandonata / Area mai urbanizzata-greenfield)",
      "q2Label": "Da quanti anni l'area è in stato di spopolamento o degrado progressivo?",
      "q3Label": "Qual è il costo annuo di manutenzione minima del patrimonio edilizio pubblico nell'area?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-075",
        "label": "ABITAZIONI RURALI E BORGHI RURALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-17",
        "sottosettore": "ABITATIVE",
        "clusterCode": "C05"
      },
      {
        "id": "CAT-074",
        "label": "FABBRICATI RESIDENZIALI URBANI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-17",
        "sottosettore": "ABITATIVE",
        "clusterCode": "C05"
      },
      {
        "id": "CAT-077",
        "label": "ALTRI EDIFICI ABITATIVI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-17",
        "sottosettore": "ABITATIVE",
        "clusterCode": "C05"
      },
      {
        "id": "CAT-013",
        "label": "AREE DISMESSE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-03",
        "sottosettore": "RIASSETTO E RECUPERO DI SITI URBANI E PRODUTTIVI",
        "clusterCode": "C08"
      },
      {
        "id": "CAT-015",
        "label": "SITI CONTAMINATI E/O DEGRADATI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-03",
        "sottosettore": "RIASSETTO E RECUPERO DI SITI URBANI E PRODUTTIVI",
        "clusterCode": "C08"
      }
    ]
  },
  {
    "id": "FAB-24",
    "label": "Ricerca, innovazione e impresa sociale",
    "descrizione": "Ricerca, innovazione e impresa sociale",
    "sottolabel": "Laboratori di ricerca, centri innovazione, spazi co-working, incubatori startup",
    "temaId": "TEMA-08",
    "temaLabel": "Ricerca e innovazione",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 1.I",
      "OS 1.III"
    ],
    "osAPDescrizione": "FESR – Ricerca e innovazione / FESR – Crescita e competitività PMI",
    "clusterCup": [
      {
        "codice": "C12",
        "label": "Aree produttive, ricerca e attività economiche"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le strutture per la ricerca e l'innovazione locale sono operative? (Pienamente operative / Parzialmente operative / Non operative / Strutture assenti-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per i laboratori/centri di ricerca, senza investimento?",
      "q3Label": "Qual è il costo annuo di manutenzione e gestione dei laboratori e spazi innovazione?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-118",
        "label": "CENTRI DI RICERCA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-31",
        "sottosettore": "OPERE E INFRASTRUTTURE PER LA RICERCA",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-117",
        "label": "LABORATORI ATTREZZATI PER LA RICERCA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-31",
        "sottosettore": "OPERE E INFRASTRUTTURE PER LA RICERCA",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-116",
        "label": "ALTRE OPERE ED INFRASTRUTTURE PER LA RICERCA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-31",
        "sottosettore": "OPERE E INFRASTRUTTURE PER LA RICERCA",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-119",
        "label": "SPAZI E STRUTTURE PER LE ATTIVITA' DI IMPRESA SOCIALE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-32",
        "sottosettore": "OPERE E INFRASTRUTTURE PER L'IMPRESA SOCIALE",
        "clusterCode": "C12"
      }
    ]
  },
  {
    "id": "FAB-25",
    "label": "Sviluppo aree produttive e artigianali",
    "descrizione": "Sviluppo aree produttive e artigianali",
    "sottolabel": "ZI, APEA, infrastrutture industriali, riconversione aree produttive",
    "temaId": "TEMA-09",
    "temaLabel": "Sviluppo locale e impresa",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 1.III"
    ],
    "osAPDescrizione": "FESR – Sviluppo locale integrato / FESR – Crescita e competitività PMI",
    "clusterCup": [
      {
        "codice": "C12",
        "label": "Aree produttive, ricerca e attività economiche"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le aree produttive e artigianali sono infrastrutturate e occupate da imprese? (Pienamente occupate e operative / Parzialmente occupate / Aree dismesse con vacancy elevata / Aree produttive assenti-greenfield)",
      "q2Label": "Da quanti anni le infrastrutture delle aree produttive non ricevono investimenti significativi?",
      "q3Label": "Qual è il costo annuo di manutenzione delle infrastrutture delle aree produttive?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-065",
        "label": "ALTRE INFRASTRUTTURE PER ATTREZZATURE DI AREE PRODUTTIVE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-14",
        "sottosettore": "INFRASTRUTTURE PER L'ATTREZZATURA DI AREE PRODUTTIVE",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-066",
        "label": "INFRASTRUTTURE CIVILI PER AREE INDUSTRIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-14",
        "sottosettore": "INFRASTRUTTURE PER L'ATTREZZATURA DI AREE PRODUTTIVE",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-067",
        "label": "SISTEMAZIONE DEI TERRENI E RICONVERSIONE AREE INDUSTRIALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-14",
        "sottosettore": "INFRASTRUTTURE PER L'ATTREZZATURA DI AREE PRODUTTIVE",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-126",
        "label": "STRUTTURE INDUSTRIALI COMUNI ED ALTRI EDIFICI ATTREZZATI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-35",
        "sottosettore": "OPERE, IMPIANTI ED ATTREZZATURE PER ATTIVITA' INDUSTRIALI E L'ARTIGIANATO",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-127",
        "label": "CENTRI E LABORATORI ARTIGIANI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-35",
        "sottosettore": "OPERE, IMPIANTI ED ATTREZZATURE PER ATTIVITA' INDUSTRIALI E L'ARTIGIANATO",
        "clusterCode": "C12"
      }
    ]
  },
  {
    "id": "FAB-26",
    "label": "Filiere agroalimentari e sviluppo rurale",
    "descrizione": "Filiere agroalimentari e sviluppo rurale",
    "sottolabel": "Infrastrutture irrigue, impianti collettivi agroalimentari, strutture rurali",
    "temaId": "TEMA-09",
    "temaLabel": "Sviluppo locale e impresa",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [],
    "osAPDescrizione": "FESR/FEASR – Sviluppo locale integrato e aree rurali",
    "clusterCup": [
      {
        "codice": "C12",
        "label": "Aree produttive, ricerca e attività economiche"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le infrastrutture a supporto della filiera agricola e agroalimentare sono funzionanti? (Pienamente operative / Parzialmente operative / Non operative-abbandonate / Infrastrutture assenti-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per le infrastrutture agricole e irrigue, senza intervento?",
      "q3Label": "Qual è il costo annuo di manutenzione delle reti irrigue e delle infrastrutture agricole collettive?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-125",
        "label": "IMPIANTI E RETI IRRIGUE AZIENDALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-34",
        "sottosettore": "OPERE, IMPIANTI ED ATTREZZATURE PER L'AGRICOLTURA, LA ZOOTECNIA E L'AGROALIMENTARE",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-124",
        "label": "IMPIANTI COLLETTIVI PER LA TUTELA DELLA QUALITA' E PER LO SVILUPPO DI FORME ASSOCIATIVE DEI PRODUTTORI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-34",
        "sottosettore": "OPERE, IMPIANTI ED ATTREZZATURE PER L'AGRICOLTURA, LA ZOOTECNIA E L'AGROALIMENTARE",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-123",
        "label": "INTRODUZIONE DI SISTEMI PER IL CONTROLLO DELLA QUALITA' DEI PRODOTTI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-34",
        "sottosettore": "OPERE, IMPIANTI ED ATTREZZATURE PER L'AGRICOLTURA, LA ZOOTECNIA E L'AGROALIMENTARE",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-122",
        "label": "FABBRICATI RURALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-34",
        "sottosettore": "OPERE, IMPIANTI ED ATTREZZATURE PER L'AGRICOLTURA, LA ZOOTECNIA E L'AGROALIMENTARE",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-115",
        "label": "ALTRE ATTREZZATURE PER LA PESCA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-30",
        "sottosettore": "IMPIANTI ED ATTREZZATURE PER LA PESCA E L'ACQUACOLTURA",
        "clusterCode": "C12"
      }
    ]
  },
  {
    "id": "FAB-27",
    "label": "Valorizzazione del patrimonio culturale",
    "descrizione": "Valorizzazione del patrimonio culturale",
    "sottolabel": "Monumenti, musei, biblioteche, teatri, aree archeologiche, restauro conservativo",
    "temaId": "TEMA-10",
    "temaLabel": "Cultura e turismo",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.VI"
    ],
    "osAPDescrizione": "FESR – Cultura e turismo per inclusione e sviluppo",
    "clusterCup": [
      {
        "codice": "C06",
        "label": "Sport, cultura e tempo libero"
      }
    ],
    "scenarioZero": {
      "q1Label": "Il bene/patrimonio culturale è aperto al pubblico e accessibile? (Pienamente accessibile e valorizzato / Parzialmente accessibile / Chiuso al pubblico-a rischio / Bene non valorizzato-assente)",
      "q2Label": "Quanti anni di vita utile residua stimi per il bene culturale, senza intervento di conservazione?",
      "q3Label": "Qual è il costo annuo di manutenzione ordinaria e custodia del bene culturale?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-085",
        "label": "AREE ARCHEOLOGICHE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-19",
        "sottosettore": "BENI CULTURALI",
        "clusterCode": "C06"
      },
      {
        "id": "CAT-086",
        "label": "MONUMENTI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-19",
        "sottosettore": "BENI CULTURALI",
        "clusterCode": "C06"
      },
      {
        "id": "CAT-087",
        "label": "RESTAURO E RIQUALIFICAZIONE DI BENI CULTURALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-19",
        "sottosettore": "BENI CULTURALI",
        "clusterCode": "C06"
      },
      {
        "id": "CAT-088",
        "label": "MUSEI ARCHIVI E BIBLIOTECHE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-19",
        "sottosettore": "BENI CULTURALI",
        "clusterCode": "C06"
      },
      {
        "id": "CAT-089",
        "label": "PATRIMONIO RURALE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-19",
        "sottosettore": "BENI CULTURALI",
        "clusterCode": "C06"
      },
      {
        "id": "CAT-112",
        "label": "TEATRI ED ALTRE STRUTTURE PER LO SPETTACOLO",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-27",
        "sottosettore": "SPORT, SPETTACOLO E TEMPO LIBERO",
        "clusterCode": "C06"
      },
      {
        "id": "CAT-111",
        "label": "STRUTTURE FIERISTICHE E CONGRESSUALI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-27",
        "sottosettore": "SPORT, SPETTACOLO E TEMPO LIBERO",
        "clusterCode": "C06"
      }
    ]
  },
  {
    "id": "FAB-28",
    "label": "Turismo e strutture di accoglienza",
    "descrizione": "Turismo e strutture di accoglienza",
    "sottolabel": "Centri di informazione turistica, strutture ricettive pubbliche, itinerari",
    "temaId": "TEMA-10",
    "temaLabel": "Cultura e turismo",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.VI"
    ],
    "osAPDescrizione": "FESR – Cultura e turismo / FESR – Sviluppo locale integrato",
    "clusterCup": [
      {
        "codice": "C12",
        "label": "Aree produttive, ricerca e attività economiche"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le strutture di accoglienza e informazione turistica comunali sono operative? (Pienamente operative / Parzialmente operative / Strutture chiuse-inagibili / Strutture assenti-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per le strutture turistiche, senza intervento?",
      "q3Label": "Qual è il costo annuo di gestione e manutenzione delle strutture turistiche pubbliche?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-120",
        "label": "CENTRI DI INFORMAZIONE / ACCOGLIENZA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-33",
        "sottosettore": "OPERE E STRUTTURE PER IL TURISMO",
        "clusterCode": "C12"
      },
      {
        "id": "CAT-121",
        "label": "ALTRE STRUTTURE DI RICETTIVITA' TURISTICA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-33",
        "sottosettore": "OPERE E STRUTTURE PER IL TURISMO",
        "clusterCode": "C12"
      }
    ]
  },
  {
    "id": "FAB-30",
    "label": "Sport, tempo libero e benessere collettivo",
    "descrizione": "Sport, tempo libero e benessere collettivo",
    "sottolabel": "Impianti sportivi, palestre comunali, piscine, campi polivalenti, parchi attrezzati",
    "temaId": "TEMA-12",
    "temaLabel": "Sport e tempo libero",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 4.III"
    ],
    "osAPDescrizione": "FESR – Infrastrutture per inclusione e partecipazione culturale/sportiva",
    "clusterCup": [
      {
        "codice": "C06",
        "label": "Sport, cultura e tempo libero"
      }
    ],
    "scenarioZero": {
      "q1Label": "Gli impianti sportivi comunali sono aperti al pubblico e regolarmente utilizzati? (Aperti e pienamente utilizzati / Parzialmente fruibili / Chiusi-inagibili / Nessun impianto sportivo-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per gli impianti sportivi, senza ristrutturazione?",
      "q3Label": "Qual è il costo annuo di manutenzione, utenze e gestione degli impianti sportivi?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-109",
        "label": "IMPIANTI SPORTIVI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-27",
        "sottosettore": "SPORT, SPETTACOLO E TEMPO LIBERO",
        "clusterCode": "C06"
      },
      {
        "id": "CAT-110",
        "label": "ALTRE STRUTTURE RICREATIVE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-27",
        "sottosettore": "SPORT, SPETTACOLO E TEMPO LIBERO",
        "clusterCode": "C06"
      }
    ]
  },
  {
    "id": "FAB-31",
    "label": "Connettività digitale del territorio",
    "descrizione": "Connettività digitale del territorio",
    "sottolabel": "Fibra ottica, BUL, reti wireless, connessione last-mile aree rurali e montane",
    "temaId": "TEMA-13",
    "temaLabel": "Digitale e TLC",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 1.V"
    ],
    "osAPDescrizione": "FESR – Connettività digitale",
    "clusterCup": [
      {
        "codice": "C11",
        "label": "Telecomunicazioni e tecnologie digitali"
      }
    ],
    "scenarioZero": {
      "q1Label": "Il territorio è coperto da connettività a banda ultra larga (>100Mbps)? (Copertura completa VHCN / Copertura parziale / Copertura minima-obsoleta / Territorio non coperto-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per le infrastrutture TLC esistenti (rame, fibra), senza upgrade?",
      "q3Label": "Qual è il costo annuo di manutenzione delle infrastrutture passive TLC di proprietà pubblica?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-068",
        "label": "CAVIDOTTI, ALTRE OPERE CIVILI DI CABLAGGIO E CENTRALINE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-15",
        "sottosettore": "INFRASTRUTTURE PER TELECOMUNICAZIONI",
        "clusterCode": "C11"
      },
      {
        "id": "CAT-069",
        "label": "POSA CAVI IN DOTTI GIA ESISTENTI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-15",
        "sottosettore": "INFRASTRUTTURE PER TELECOMUNICAZIONI",
        "clusterCode": "C11"
      },
      {
        "id": "CAT-072",
        "label": "IMPIANTI WIRELESS",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-15",
        "sottosettore": "INFRASTRUTTURE PER TELECOMUNICAZIONI",
        "clusterCode": "C11"
      },
      {
        "id": "CAT-070",
        "label": "ALTRE OPERE ED IMPIANTI PER TELECOMUNICAZIONE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-15",
        "sottosettore": "INFRASTRUTTURE PER TELECOMUNICAZIONI",
        "clusterCode": "C11"
      }
    ]
  },
  {
    "id": "FAB-32",
    "label": "Infrastrutture digitali per la Pubblica Amministrazione",
    "descrizione": "Infrastrutture digitali per la Pubblica Amministrazione",
    "sottolabel": "Datacenter, sistemi di controllo, videosorveglianza, reti sicure PA",
    "temaId": "TEMA-13",
    "temaLabel": "Digitale e TLC",
    "missioniDup": [],
    "programmiDup": [],
    "osAP": [
      "OS 1.II"
    ],
    "osAPDescrizione": "FESR – Digitalizzazione PA e imprese",
    "clusterCup": [
      {
        "codice": "C11",
        "label": "Telecomunicazioni e tecnologie digitali"
      }
    ],
    "scenarioZero": {
      "q1Label": "Le infrastrutture digitali della PA locale (reti, datacenter, sistemi di controllo) sono operative? (Pienamente operative / Parzialmente operative / Non operative-obsolete / Assenti-greenfield)",
      "q2Label": "Quanti anni di vita utile residua stimi per i sistemi ICT e le infrastrutture digitali della PA?",
      "q3Label": "Qual è il costo annuo di manutenzione, licenze e gestione delle infrastrutture digitali PA?"
    },
    "categorieCollegate": [
      {
        "id": "CAT-071",
        "label": "SISTEMI ED IMPIANTI DI CONTROLLO E VIDEOSORVEGLIANZA",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-15",
        "sottosettore": "INFRASTRUTTURE PER TELECOMUNICAZIONI",
        "clusterCode": "C11"
      },
      {
        "id": "CAT-073",
        "label": "LOCALI ATTREZZATI PER CENTRI DI SERVIZIO INFORMATICI",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-16",
        "sottosettore": "TECNOLOGIE INFORMATICHE",
        "clusterCode": "C11"
      },
      {
        "id": "CAT-070",
        "label": "ALTRE OPERE ED IMPIANTI PER TELECOMUNICAZIONE",
        "settoreId": "",
        "settore": "",
        "sottosettoreId": "SSET-15",
        "sottosettore": "INFRASTRUTTURE PER TELECOMUNICAZIONI",
        "clusterCode": "C11"
      }
    ]
  }
]
