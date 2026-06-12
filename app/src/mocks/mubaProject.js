// AUTO-GENERATO da "progetto muba" (IA scenario 976 + ACB scenario 976).
// Dati reali aggregati dagli export EIA/ECBA. NON modificare a mano: rigenerare
// con `node scripts/build-muba-project.cjs` se gli xlsx cambiano.
//
// Forma allineata agli output degli engine (computeEia / computeEcba) così da
// alimentare le card riepilogo in ProjectDetail (EiaKpiCards / EcbaRows).

export const MUBA_PROJECT = {
  "id": "PROJ-MUBA-976",
  "cup": "I69J21000000976",
  "nome": "MUBA — Polo culturale di Bologna",
  "descrizione": "Intervento di valorizzazione culturale a Bologna: recupero degli spazi, allestimenti museali e attività artistiche. Scenario di analisi n. 976 (EIA + ACB).",
  "stato": "Approvato",
  "creato_il": "12/06/2026",
  "ultima_modifica": "12/06/2026",
  "configurazione": {
    "settore": "Infrastrutture sociali",
    "sotto_settore": "Cultura, turismo e valorizzazione del territorio",
    "categoria_intervento": "Valorizzazione e fruizione del patrimonio culturale",
    "tipo_intervento": "Recupero",
    "durata_progetto": "25 anni",
    "localizzazione": "Bologna BO",
    "nuts_code": "ITH55",
    "nuts_label": "Bologna",
    "anno_attualizzazione": 2025,
    "tasso_attualizzazione": 3.5,
    "capex": 19804223,
    "opex": 0,
    "vita_utile": 25
  }
};

export const MUBA_EIA_RESULTS = {
  "shock_totale": 19804223,
  "moltiplicatore": 3.28,
  "produzione": {
    "diretto": 19311468,
    "indiretto": 20645499,
    "indotto": 24997856,
    "totale": 64954822
  },
  "gva": {
    "diretto": 8838221,
    "indiretto": 8193161,
    "indotto": 12609637,
    "totale": 29641019
  },
  "fte": {
    "diretto": 4.6,
    "indiretto": 4.3,
    "indotto": 5.1,
    "totale": 14
  },
  "redditi": {
    "diretto": 8719970,
    "indiretto": 8002565,
    "indotto": 12214491,
    "totale": 28937026
  },
  "gettito": null,
  "per_territorio": [
    {
      "regione": "Emilia-Romagna",
      "valore": 39296864,
      "intensita": 1
    },
    {
      "regione": "Toscana",
      "valore": 6422814,
      "intensita": 0.16
    },
    {
      "regione": "Lombardia",
      "valore": 6050558,
      "intensita": 0.15
    },
    {
      "regione": "Veneto",
      "valore": 5897353,
      "intensita": 0.15
    },
    {
      "regione": "Piemonte",
      "valore": 1418180,
      "intensita": 0.04
    },
    {
      "regione": "Liguria",
      "valore": 1278321,
      "intensita": 0.03
    },
    {
      "regione": "Marche",
      "valore": 1102746,
      "intensita": 0.03
    },
    {
      "regione": "Lazio",
      "valore": 878830,
      "intensita": 0.02
    },
    {
      "regione": "Trentino-Alto Adige",
      "valore": 701474,
      "intensita": 0.02
    },
    {
      "regione": "Friuli-Venezia Giulia",
      "valore": 696102,
      "intensita": 0.02
    },
    {
      "regione": "Umbria",
      "valore": 458445,
      "intensita": 0.01
    },
    {
      "regione": "Abruzzo",
      "valore": 272511,
      "intensita": 0.01
    },
    {
      "regione": "Campania",
      "valore": 178723,
      "intensita": 0
    },
    {
      "regione": "Sardegna",
      "valore": 84884,
      "intensita": 0
    },
    {
      "regione": "Puglia",
      "valore": 77354,
      "intensita": 0
    },
    {
      "regione": "Valle d'Aosta",
      "valore": 55345,
      "intensita": 0
    },
    {
      "regione": "Molise",
      "valore": 36303,
      "intensita": 0
    },
    {
      "regione": "Sicilia",
      "valore": 19187,
      "intensita": 0
    },
    {
      "regione": "Basilicata",
      "valore": 15314,
      "intensita": 0
    },
    {
      "regione": "Calabria",
      "valore": 13512,
      "intensita": 0
    }
  ],
  "per_settore": [
    {
      "settore": "Attività artistiche",
      "share": 0.202,
      "valore": 13119768
    },
    {
      "settore": "Costruzioni",
      "share": 0.078,
      "valore": 5062320
    },
    {
      "settore": "Attività immobiliari",
      "share": 0.073,
      "valore": 4716268
    },
    {
      "settore": "Servizi di vigilanza",
      "share": 0.067,
      "valore": 4347103
    },
    {
      "settore": "Commercio all'ingrosso",
      "share": 0.038,
      "valore": 2481601
    },
    {
      "settore": "Alloggio e ristorazione",
      "share": 0.035,
      "valore": 2272724
    },
    {
      "settore": "Industrie alimentari",
      "share": 0.032,
      "valore": 2074721
    },
    {
      "settore": "Attività legali",
      "share": 0.026,
      "valore": 1672520
    },
    {
      "settore": "Commercio al dettaglio",
      "share": 0.024,
      "valore": 1577953
    },
    {
      "settore": "Trasporto terrestre",
      "share": 0.022,
      "valore": 1457119
    },
    {
      "settore": "Servizi finanziari",
      "share": 0.022,
      "valore": 1404627
    },
    {
      "settore": "Energia elettrica e gas",
      "share": 0.022,
      "valore": 1398481
    },
    {
      "settore": "Mobili e manifattura",
      "share": 0.021,
      "valore": 1339918
    },
    {
      "settore": "Ingegneria e architettura",
      "share": 0.02,
      "valore": 1309135
    },
    {
      "settore": "Prodotti in metallo",
      "share": 0.018,
      "valore": 1149469
    },
    {
      "settore": "Macchinari vari",
      "share": 0.016,
      "valore": 1026178
    },
    {
      "settore": "Magazzinaggio",
      "share": 0.015,
      "valore": 983847
    },
    {
      "settore": "Consulenza informatica",
      "share": 0.014,
      "valore": 880381
    },
    {
      "settore": "Sport e intrattenimento",
      "share": 0.012,
      "valore": 801500
    },
    {
      "settore": "Amministrazione pubblica",
      "share": 0.012,
      "valore": 771811
    },
    {
      "settore": "Pubblicità e marketing",
      "share": 0.012,
      "valore": 747203
    },
    {
      "settore": "Produzioni agricole",
      "share": 0.011,
      "valore": 691885
    },
    {
      "settore": "Articoli gomma o plastica",
      "share": 0.01,
      "valore": 671953
    },
    {
      "settore": "Commercio veicoli",
      "share": 0.01,
      "valore": 665265
    },
    {
      "settore": "Assicurazioni",
      "share": 0.01,
      "valore": 638097
    },
    {
      "settore": "Minerali non metalliferi",
      "share": 0.01,
      "valore": 626852
    },
    {
      "settore": "Telecomunicazioni",
      "share": 0.009,
      "valore": 584126
    },
    {
      "settore": "Industrie tessili",
      "share": 0.008,
      "valore": 538146
    },
    {
      "settore": "Apparecchiature elettriche",
      "share": 0.008,
      "valore": 532487
    },
    {
      "settore": "Servizi professionali",
      "share": 0.008,
      "valore": 509858
    },
    {
      "settore": "Attività  metallurgiche",
      "share": 0.008,
      "valore": 505868
    },
    {
      "settore": "Servizi finanziari ausiliari",
      "share": 0.008,
      "valore": 493966
    },
    {
      "settore": "Servizi personali",
      "share": 0.008,
      "valore": 487224
    },
    {
      "settore": "Fabbricazione carta",
      "share": 0.007,
      "valore": 485183
    },
    {
      "settore": "Fabbricazione coke e raffinazione",
      "share": 0.007,
      "valore": 460539
    },
    {
      "settore": "Prodotti chimici",
      "share": 0.007,
      "valore": 455637
    },
    {
      "settore": "Gestione rifiuti",
      "share": 0.007,
      "valore": 452921
    },
    {
      "settore": "Autoveicoli e rimorchi",
      "share": 0.007,
      "valore": 452800
    },
    {
      "settore": "Assistenza sociale",
      "share": 0.007,
      "valore": 443097
    },
    {
      "settore": "Servizi sanitari",
      "share": 0.006,
      "valore": 419109
    },
    {
      "settore": "Computer ed elettronica",
      "share": 0.005,
      "valore": 356758
    },
    {
      "settore": "Noleggio e leasing",
      "share": 0.005,
      "valore": 341000
    },
    {
      "settore": "Ricerca e selezione personale",
      "share": 0.005,
      "valore": 302032
    },
    {
      "settore": "Stampa e supporti registrati",
      "share": 0.005,
      "valore": 292696
    },
    {
      "settore": "Attività  domestiche",
      "share": 0.004,
      "valore": 289714
    },
    {
      "settore": "Istruzione",
      "share": 0.004,
      "valore": 274979
    },
    {
      "settore": "Produzione audiovisiva",
      "share": 0.004,
      "valore": 259838
    },
    {
      "settore": "Industria del legno",
      "share": 0.004,
      "valore": 243747
    },
    {
      "settore": "Riparazione macchinari",
      "share": 0.004,
      "valore": 243722
    },
    {
      "settore": "Agenzie di viaggio",
      "share": 0.004,
      "valore": 227516
    },
    {
      "settore": "Trattamento acqua",
      "share": 0.003,
      "valore": 186706
    },
    {
      "settore": "Organizzazioni associative",
      "share": 0.003,
      "valore": 173874
    },
    {
      "settore": "Altri mezzi di trasporto",
      "share": 0.002,
      "valore": 159122
    },
    {
      "settore": "Attività  editoriali",
      "share": 0.002,
      "valore": 151697
    },
    {
      "settore": "Trasporto marittimo",
      "share": 0.002,
      "valore": 135123
    },
    {
      "settore": "Prodotti farmaceutici",
      "share": 0.002,
      "valore": 124249
    },
    {
      "settore": "Attività  estrattiva",
      "share": 0.002,
      "valore": 116873
    },
    {
      "settore": "Servizi postali",
      "share": 0.002,
      "valore": 116551
    },
    {
      "settore": "Trasporto aereo",
      "share": 0.001,
      "valore": 97050
    },
    {
      "settore": "Ricerca scientifica",
      "share": 0.001,
      "valore": 62447
    },
    {
      "settore": "Riparazione beni",
      "share": 0.001,
      "valore": 51798
    },
    {
      "settore": "Pesca e acquicoltura",
      "share": 0,
      "valore": 20162
    },
    {
      "settore": "Silvicoltura",
      "share": 0,
      "valore": 17506
    }
  ],
  "per_anno": [],
  "scenario": {
    "settore": "Infrastrutture sociali",
    "nuts_code": "ITH55",
    "nuts_label": "Bologna",
    "capex": 19804223,
    "opex_annuo": 0,
    "vita_utile": 25,
    "anno_inizio": 2025,
    "anno_fine": 2050,
    "granularita": "provinciale",
    "tipo": "completa"
  }
};

export const MUBA_ECBA_RESULTS = {
  "van": 23707787,
  "bc": 2.48,
  "tir": 25.6,
  "payback": 5,
  "bcr": 2.48,
  "irr": 25.6,
  "payback_period": 5,
  "benefici_totali": 39744178,
  "costi_totali": 16036392,
  "benefici_categorie": [],
  "costi_categorie": [
    {
      "id": "capex",
      "label": "Investimento e costi (valore attuale)",
      "valore_pv": 16036392
    }
  ],
  "pv_capex": 16036392,
  "pv_opex": 0,
  "flussi": [],
  "meta": {
    "orizzonte": 25,
    "tasso": 3.5,
    "residual": 0,
    "capex": 19804223,
    "annual_opex": 0
  }
};
