// AUTO-GENERATO da "progetto ospedale pediatrico" (IA scenario 841 + ACB scenario 841).
// Dati reali aggregati dagli export EIA/ECBA. NON modificare a mano: rigenerare
// con `node scripts/build-ospedale-project.cjs` se gli xlsx cambiano.
//
// - OSPEDALE_*_RESULTS : forma engine (computeEia/computeEcba) → card riepilogo ProjectDetail.
// - OSPEDALE_*_DATASET : forma ricca (eiaResults.json / ecbaData.js) → viste di dettaglio.
//   Gettito fiscale = proxy 22% del PIL (non nell'export IA).
//   Etichette benefici KPI262-266/KPI340 = placeholder (da fornire OpenEconomics).
//   Le sezioni di rischio ECBA non sono nell'export e sono illustrative (_riskIllustrative).

export const OSPEDALE_PROJECT = {
  "id": "PROJ-OSP-841",
  "cup": "—",
  "nome": "Analisi Ospedale Infantile — Genova",
  "descrizione": "Potenziamento infrastrutturale di un ospedale pediatrico a Genova: demolizione e ricostruzione di padiglioni, rifunzionalizzazione di edifici storici, realizzazione di impianti energetici e nuova organizzazione per piattaforme assistenziali. Efficientamento energetico, ammodernamento del patrimonio sanitario e promozione della ricerca medica. Scenario di analisi n. 841 (EIA + ACB).",
  "stato": "Approvato",
  "creato_il": "21/07/2026",
  "ultima_modifica": "21/07/2026",
  "creato_da": "OpenEconomics S.r.l",
  "proprietario": "OpenEconomics S.r.l",
  "configurazione": {
    "settore": "Infrastrutture sociali",
    "sotto_settore": "Sanitarie",
    "categoria_intervento": "Strutture ospedaliere",
    "tipo_intervento": "Ristrutturazione",
    "durata_progetto": "22 anni",
    "localizzazione": "Genova GE",
    "nuts_code": "ITC33",
    "nuts_label": "Genova",
    "anno_attualizzazione": 2025,
    "tasso_attualizzazione": 3,
    "capex": 156600000,
    "opex": 9596327,
    "vita_utile": 22
  }
};

export const OSPEDALE_EIA_RESULTS = {
  "shock_totale": 367719202,
  "moltiplicatore": 3.44,
  "produzione": {
    "diretto": 367719202,
    "indiretto": 479701716,
    "indotto": 419086464,
    "totale": 1266507383
  },
  "gva": {
    "diretto": 137140650,
    "indiretto": 174846286,
    "indotto": 209294004,
    "totale": 521280939
  },
  "fte": {
    "diretto": 87,
    "indiretto": 102.8,
    "indotto": 96.4,
    "totale": 286.2
  },
  "redditi": {
    "diretto": 134577747,
    "indiretto": 170792740,
    "indotto": 203270181,
    "totale": 508640668
  },
  "gettito": {
    "diretto": 30170943,
    "indiretto": 38466183,
    "indotto": 46044681,
    "totale": 114681807
  },
  "per_territorio": [
    {
      "regione": "Liguria",
      "valore": 630719603,
      "intensita": 1
    },
    {
      "regione": "Lombardia",
      "valore": 245494019,
      "intensita": 0.39
    },
    {
      "regione": "Piemonte",
      "valore": 164018571,
      "intensita": 0.26
    },
    {
      "regione": "Emilia-Romagna",
      "valore": 84431742,
      "intensita": 0.13
    },
    {
      "regione": "Toscana",
      "valore": 61854687,
      "intensita": 0.1
    },
    {
      "regione": "Veneto",
      "valore": 37619945,
      "intensita": 0.06
    },
    {
      "regione": "Trentino-Alto Adige",
      "valore": 8719142,
      "intensita": 0.01
    },
    {
      "regione": "Lazio",
      "valore": 8536250,
      "intensita": 0.01
    },
    {
      "regione": "Marche",
      "valore": 6104796,
      "intensita": 0.01
    },
    {
      "regione": "Friuli-Venezia Giulia",
      "valore": 5659006,
      "intensita": 0.01
    },
    {
      "regione": "Valle d'Aosta",
      "valore": 3282444,
      "intensita": 0.01
    },
    {
      "regione": "Umbria",
      "valore": 3248093,
      "intensita": 0.01
    },
    {
      "regione": "Abruzzo",
      "valore": 2155345,
      "intensita": 0
    },
    {
      "regione": "Sardegna",
      "valore": 1832052,
      "intensita": 0
    },
    {
      "regione": "Campania",
      "valore": 1504604,
      "intensita": 0
    },
    {
      "regione": "Puglia",
      "valore": 608111,
      "intensita": 0
    },
    {
      "regione": "Molise",
      "valore": 286033,
      "intensita": 0
    },
    {
      "regione": "Sicilia",
      "valore": 192761,
      "intensita": 0
    },
    {
      "regione": "Basilicata",
      "valore": 125062,
      "intensita": 0
    },
    {
      "regione": "Calabria",
      "valore": 115119,
      "intensita": 0
    }
  ],
  "per_settore": [
    {
      "settore": "Costruzioni",
      "share": 0.367,
      "valore": 465172341
    },
    {
      "settore": "Attività immobiliari",
      "share": 0.063,
      "valore": 79386509
    },
    {
      "settore": "Commercio all'ingrosso",
      "share": 0.051,
      "valore": 64471264
    },
    {
      "settore": "Alloggio e ristorazione",
      "share": 0.034,
      "valore": 42947725
    },
    {
      "settore": "Attività legali",
      "share": 0.028,
      "valore": 35177595
    },
    {
      "settore": "Commercio al dettaglio",
      "share": 0.027,
      "valore": 33587768
    },
    {
      "settore": "Trasporto terrestre",
      "share": 0.026,
      "valore": 33039879
    },
    {
      "settore": "Servizi di vigilanza",
      "share": 0.026,
      "valore": 32703324
    },
    {
      "settore": "Magazzinaggio",
      "share": 0.021,
      "valore": 27143314
    },
    {
      "settore": "Servizi finanziari",
      "share": 0.02,
      "valore": 25725437
    },
    {
      "settore": "Industrie alimentari",
      "share": 0.02,
      "valore": 25397808
    },
    {
      "settore": "Energia elettrica e gas",
      "share": 0.02,
      "valore": 24819653
    },
    {
      "settore": "Prodotti in metallo",
      "share": 0.018,
      "valore": 22515113
    },
    {
      "settore": "Minerali non metalliferi",
      "share": 0.015,
      "valore": 19139461
    },
    {
      "settore": "Fabbricazione coke e raffinazione",
      "share": 0.014,
      "valore": 17929269
    },
    {
      "settore": "Ingegneria e architettura",
      "share": 0.012,
      "valore": 15016291
    },
    {
      "settore": "Consulenza informatica",
      "share": 0.011,
      "valore": 14544438
    },
    {
      "settore": "Commercio veicoli",
      "share": 0.01,
      "valore": 13256611
    },
    {
      "settore": "Trasporto marittimo",
      "share": 0.01,
      "valore": 12903081
    },
    {
      "settore": "Autoveicoli e rimorchi",
      "share": 0.01,
      "valore": 12041570
    },
    {
      "settore": "Articoli gomma o plastica",
      "share": 0.009,
      "valore": 11687210
    },
    {
      "settore": "Macchinari vari",
      "share": 0.009,
      "valore": 11383733
    },
    {
      "settore": "Gestione rifiuti",
      "share": 0.009,
      "valore": 11302306
    },
    {
      "settore": "Servizi professionali",
      "share": 0.009,
      "valore": 11163108
    },
    {
      "settore": "Assicurazioni",
      "share": 0.009,
      "valore": 10933444
    },
    {
      "settore": "Attività  metallurgiche",
      "share": 0.008,
      "valore": 10462931
    },
    {
      "settore": "Telecomunicazioni",
      "share": 0.007,
      "valore": 9166786
    },
    {
      "settore": "Produzioni agricole",
      "share": 0.007,
      "valore": 8987917
    },
    {
      "settore": "Servizi finanziari ausiliari",
      "share": 0.007,
      "valore": 8952773
    },
    {
      "settore": "Prodotti chimici",
      "share": 0.007,
      "valore": 8820349
    },
    {
      "settore": "Noleggio e leasing",
      "share": 0.006,
      "valore": 8205910
    },
    {
      "settore": "Servizi personali",
      "share": 0.006,
      "valore": 8159082
    },
    {
      "settore": "Pubblicità e marketing",
      "share": 0.006,
      "valore": 7750710
    },
    {
      "settore": "Amministrazione pubblica",
      "share": 0.006,
      "valore": 7572497
    },
    {
      "settore": "Ricerca e selezione personale",
      "share": 0.006,
      "valore": 7522024
    },
    {
      "settore": "Servizi sanitari",
      "share": 0.005,
      "valore": 6814003
    },
    {
      "settore": "Mobili e manifattura",
      "share": 0.005,
      "valore": 6530867
    },
    {
      "settore": "Attività artistiche",
      "share": 0.005,
      "valore": 6295818
    },
    {
      "settore": "Sport e intrattenimento",
      "share": 0.005,
      "valore": 6244048
    },
    {
      "settore": "Apparecchiature elettriche",
      "share": 0.005,
      "valore": 6115715
    },
    {
      "settore": "Industrie tessili",
      "share": 0.004,
      "valore": 5658896
    },
    {
      "settore": "Fabbricazione carta",
      "share": 0.004,
      "valore": 5430641
    },
    {
      "settore": "Attività  domestiche",
      "share": 0.004,
      "valore": 5389366
    },
    {
      "settore": "Riparazione macchinari",
      "share": 0.004,
      "valore": 5184924
    },
    {
      "settore": "Agenzie di viaggio",
      "share": 0.004,
      "valore": 4751823
    },
    {
      "settore": "Istruzione",
      "share": 0.003,
      "valore": 4424077
    },
    {
      "settore": "Computer ed elettronica",
      "share": 0.003,
      "valore": 4102571
    },
    {
      "settore": "Stampa e supporti registrati",
      "share": 0.003,
      "valore": 3912725
    },
    {
      "settore": "Attività  estrattiva",
      "share": 0.003,
      "valore": 3902752
    },
    {
      "settore": "Produzione audiovisiva",
      "share": 0.003,
      "valore": 3734370
    },
    {
      "settore": "Industria del legno",
      "share": 0.003,
      "valore": 3495043
    },
    {
      "settore": "Altri mezzi di trasporto",
      "share": 0.003,
      "valore": 3409166
    },
    {
      "settore": "Organizzazioni associative",
      "share": 0.003,
      "valore": 3324967
    },
    {
      "settore": "Trattamento acqua",
      "share": 0.003,
      "valore": 3267812
    },
    {
      "settore": "Assistenza sociale",
      "share": 0.002,
      "valore": 3052575
    },
    {
      "settore": "Trasporto aereo",
      "share": 0.002,
      "valore": 2752168
    },
    {
      "settore": "Attività  editoriali",
      "share": 0.002,
      "valore": 2454997
    },
    {
      "settore": "Prodotti farmaceutici",
      "share": 0.002,
      "valore": 2230201
    },
    {
      "settore": "Servizi postali",
      "share": 0.002,
      "valore": 2143394
    },
    {
      "settore": "Ricerca scientifica",
      "share": 0.001,
      "valore": 1631556
    },
    {
      "settore": "Riparazione beni",
      "share": 0.001,
      "valore": 743900
    },
    {
      "settore": "Pesca e acquicoltura",
      "share": 0,
      "valore": 310864
    },
    {
      "settore": "Silvicoltura",
      "share": 0,
      "valore": 208916
    }
  ],
  "per_anno": [],
  "scenario": {
    "settore": "Infrastrutture sociali",
    "nuts_code": "ITC33",
    "nuts_label": "Genova",
    "capex": 156600000,
    "opex_annuo": 0,
    "vita_utile": 22,
    "anno_inizio": 2023,
    "anno_fine": 2045,
    "granularita": "provinciale",
    "tipo": "completa"
  }
};

export const OSPEDALE_ECBA_RESULTS = {
  "van": 265300265,
  "bc": 1.77,
  "tir": 12,
  "payback": 11,
  "bcr": 1.77,
  "irr": 12,
  "payback_period": 11,
  "benefici_totali": 609870238,
  "costi_totali": 344569973,
  "benefici_categorie": [
    {
      "id": "Miglioramento dell'accessibilità",
      "nome": "Miglioramento dell'accessibilità",
      "valore_pv": 417836243,
      "quota": 0.685
    },
    {
      "id": "KPI264",
      "nome": "Riduzione della mobilità passiva",
      "valore_pv": 132954952,
      "quota": 0.218
    },
    {
      "id": "KPI263",
      "nome": "Tempo di degenza evitato",
      "valore_pv": 57769848,
      "quota": 0.095
    },
    {
      "id": "KPI340",
      "nome": "Riduzione emissioni di CO2 per veicoli pesanti",
      "valore_pv": 743955,
      "quota": 0.001
    },
    {
      "id": "KPI265",
      "nome": "Riduzione della mortalità infantile",
      "valore_pv": 491233,
      "quota": 0.001
    },
    {
      "id": "KPI266",
      "nome": "Inabilità evitata",
      "valore_pv": 74006,
      "quota": 0
    }
  ],
  "costi_categorie": [
    {
      "id": "capex",
      "label": "Investimento (CAPEX)",
      "valore_pv": 156600000
    },
    {
      "id": "opex",
      "label": "Gestione e manutenzione (OPEX)",
      "valore_pv": 187969973
    }
  ],
  "pv_capex": 156600000,
  "pv_opex": 187969973,
  "flussi": [],
  "meta": {
    "orizzonte": 22,
    "tasso": 3,
    "residual": 0,
    "capex": 156600000,
    "annual_opex": 9596327
  }
};

export const OSPEDALE_EIA_DATASET = {
  "metadata": {
    "creato_il": "21/07/2026",
    "creato_da": "OpenEconomics S.r.l",
    "ultima_modifica": "21/07/2026",
    "settore": "Infrastrutture sociali",
    "dataset": "SAM multiprovinciale Italia",
    "metodologia": "SAM Italia 63 settori (scenario 841)",
    "categoria_intervento": "Strutture ospedaliere",
    "localizzazione": "Genova",
    "anno_attualizzazione": 2025
  },
  "previews": {
    "sintesi": "521.3 M€ PIL",
    "componenti": "diretto + filiere",
    "geografia": "44% a Genova",
    "settori": "Costruzioni leader",
    "esplora": "Approfondimento dati"
  },
  "input": {
    "total_spend": 367719202,
    "currency": "EUR",
    "origin_provinces": [
      {
        "code": "GE",
        "name": "Genova",
        "region_code": "07",
        "region_name": "Liguria",
        "spend_share": 1
      }
    ],
    "origin_region": {
      "code": "07",
      "name": "Liguria",
      "nuts2_code": "ITC3"
    },
    "years_of_realization": 8,
    "spend_breakdown": [
      {
        "ateco_code": "327",
        "ateco_name": "Costruzioni",
        "amount": 367719202,
        "share": 1
      }
    ]
  },
  "synthesis": {
    "by_perimeter": {
      "origin_province": {
        "production": 563014519,
        "gdp": 215468257,
        "employment": 125.8,
        "income": 211398152,
        "fiscal": null
      },
      "region": {
        "production": 630719603,
        "gdp": 237504092,
        "employment": 138.1,
        "income": 232904474,
        "fiscal": null
      },
      "national": {
        "production": 1266507383,
        "gdp": 521280939,
        "employment": 286.2,
        "income": 508640668,
        "fiscal": 114681807
      }
    },
    "fiscal_national": 114681807,
    "three_segments": {
      "production": {
        "origin": 563014519,
        "rest_region": 67705084,
        "extra": 635787780
      },
      "gdp": {
        "origin": 215468257,
        "rest_region": 22035835,
        "extra": 283776847
      },
      "employment": {
        "origin": 125.8,
        "rest_region": 12.3,
        "extra": 148.1
      },
      "income": {
        "origin": 211398152,
        "rest_region": 21506322,
        "extra": 275736194
      }
    },
    "per_capita": {
      "origin_province": {
        "population": 814000,
        "production_pc": 691.66,
        "gdp_pc": 264.7,
        "employment_pc_per_10k": 1.55,
        "income_pc": 259.7
      },
      "region": {
        "population": 1502624,
        "production_pc": 419.75,
        "gdp_pc": 158.06,
        "employment_pc_per_10k": 0.92,
        "income_pc": 155
      },
      "national": {
        "population": 58997000,
        "production_pc": 21.47,
        "gdp_pc": 8.84,
        "employment_pc_per_10k": 0.05,
        "income_pc": 8.62
      }
    },
    "synthetic_kpis": {
      "gdp_multiplier": 1.42,
      "production_multiplier": 3.44,
      "employment_intensity_per_meur": 0.8,
      "fiscal_autofinanc_pct": 0.312
    }
  },
  "components": {
    "production": {
      "direct": 367719202,
      "indirect": 479701716,
      "induced": 419086464,
      "top_sectors": {
        "direct": [
          {
            "name": "Costruzioni",
            "value": 367719202
          },
          {
            "name": "Produzioni agricole",
            "value": 0
          },
          {
            "name": "Silvicoltura",
            "value": 0
          }
        ],
        "indirect": [
          {
            "name": "Costruzioni",
            "value": 88776115
          },
          {
            "name": "Commercio all'ingrosso",
            "value": 33603088
          },
          {
            "name": "Attività legali",
            "value": 26049073
          }
        ],
        "induced": [
          {
            "name": "Attività immobiliari",
            "value": 65527199
          },
          {
            "name": "Commercio all'ingrosso",
            "value": 30868176
          },
          {
            "name": "Alloggio e ristorazione",
            "value": 29668678
          }
        ]
      }
    },
    "gdp": {
      "direct": 137140650,
      "indirect": 174846286,
      "induced": 209294004,
      "top_sectors": {
        "direct": [
          {
            "name": "Costruzioni",
            "value": 137140650
          },
          {
            "name": "Produzioni agricole",
            "value": 0
          },
          {
            "name": "Silvicoltura",
            "value": 0
          }
        ],
        "indirect": [
          {
            "name": "Costruzioni",
            "value": 25827279
          },
          {
            "name": "Attività legali",
            "value": 14587675
          },
          {
            "name": "Attività immobiliari",
            "value": 12079019
          }
        ],
        "induced": [
          {
            "name": "Attività immobiliari",
            "value": 57906140
          },
          {
            "name": "Commercio al dettaglio",
            "value": 16300892
          },
          {
            "name": "Alloggio e ristorazione",
            "value": 14837665
          }
        ]
      }
    },
    "employment": {
      "direct": 87,
      "indirect": 102.8,
      "induced": 96.4,
      "top_sectors": {
        "direct": [
          {
            "name": "Costruzioni",
            "value": 87
          },
          {
            "name": "Produzioni agricole",
            "value": 0
          },
          {
            "name": "Silvicoltura",
            "value": 0
          }
        ],
        "indirect": [
          {
            "name": "Costruzioni",
            "value": 16.4
          },
          {
            "name": "Servizi di vigilanza",
            "value": 8.9
          },
          {
            "name": "Ricerca e selezione personale",
            "value": 6.4
          }
        ],
        "induced": [
          {
            "name": "Alloggio e ristorazione",
            "value": 9.8
          },
          {
            "name": "Commercio al dettaglio",
            "value": 8.8
          },
          {
            "name": "Attività  domestiche",
            "value": 7.1
          }
        ]
      }
    }
  },
  "geography": {
    "regions": [
      {
        "code": "07",
        "name": "Liguria",
        "nuts2_code": "ITC3",
        "population": 1502624,
        "is_origin": true,
        "values": {
          "production": {
            "absolute": 630719603,
            "per_capita": 419.75
          },
          "gdp": {
            "absolute": 237504092,
            "per_capita": 158.06
          },
          "employment": {
            "absolute": 138.1,
            "per_capita_per_10k": 0.92
          },
          "income": {
            "absolute": 232904474,
            "per_capita": 155
          }
        }
      },
      {
        "code": "03",
        "name": "Lombardia",
        "nuts2_code": "ITC4",
        "population": 9943004,
        "values": {
          "production": {
            "absolute": 245494019,
            "per_capita": 24.69
          },
          "gdp": {
            "absolute": 116550273,
            "per_capita": 11.72
          },
          "employment": {
            "absolute": 62,
            "per_capita_per_10k": 0.06
          },
          "income": {
            "absolute": 113276445,
            "per_capita": 11.39
          }
        }
      },
      {
        "code": "01",
        "name": "Piemonte",
        "nuts2_code": "ITC1",
        "population": 4256350,
        "values": {
          "production": {
            "absolute": 164018571,
            "per_capita": 38.54
          },
          "gdp": {
            "absolute": 65951892,
            "per_capita": 15.49
          },
          "employment": {
            "absolute": 36.7,
            "per_capita_per_10k": 0.09
          },
          "income": {
            "absolute": 64342374,
            "per_capita": 15.12
          }
        }
      },
      {
        "code": "08",
        "name": "Emilia-Romagna",
        "nuts2_code": "ITH5",
        "population": 4438937,
        "values": {
          "production": {
            "absolute": 84431742,
            "per_capita": 19.02
          },
          "gdp": {
            "absolute": 34710465,
            "per_capita": 7.82
          },
          "employment": {
            "absolute": 18.2,
            "per_capita_per_10k": 0.04
          },
          "income": {
            "absolute": 33727229,
            "per_capita": 7.6
          }
        }
      },
      {
        "code": "09",
        "name": "Toscana",
        "nuts2_code": "ITI1",
        "population": 3668333,
        "values": {
          "production": {
            "absolute": 61854687,
            "per_capita": 16.86
          },
          "gdp": {
            "absolute": 25950739,
            "per_capita": 7.07
          },
          "employment": {
            "absolute": 12.8,
            "per_capita_per_10k": 0.03
          },
          "income": {
            "absolute": 25156798,
            "per_capita": 6.86
          }
        }
      },
      {
        "code": "05",
        "name": "Veneto",
        "nuts2_code": "ITH3",
        "population": 4851973,
        "values": {
          "production": {
            "absolute": 37619945,
            "per_capita": 7.75
          },
          "gdp": {
            "absolute": 17986136,
            "per_capita": 3.71
          },
          "employment": {
            "absolute": 8.2,
            "per_capita_per_10k": 0.02
          },
          "income": {
            "absolute": 17384472,
            "per_capita": 3.58
          }
        }
      },
      {
        "code": "04",
        "name": "Trentino-Alto Adige",
        "nuts2_code": "ITH1",
        "population": 1078069,
        "values": {
          "production": {
            "absolute": 8719142,
            "per_capita": 8.09
          },
          "gdp": {
            "absolute": 4707388,
            "per_capita": 4.37
          },
          "employment": {
            "absolute": 2.1,
            "per_capita_per_10k": 0.02
          },
          "income": {
            "absolute": 4541731,
            "per_capita": 4.21
          }
        }
      },
      {
        "code": "12",
        "name": "Lazio",
        "nuts2_code": "ITI4",
        "population": 5714882,
        "values": {
          "production": {
            "absolute": 8536250,
            "per_capita": 1.49
          },
          "gdp": {
            "absolute": 5456615,
            "per_capita": 0.95
          },
          "employment": {
            "absolute": 2.6,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 5257023,
            "per_capita": 0.92
          }
        }
      },
      {
        "code": "11",
        "name": "Marche",
        "nuts2_code": "ITI3",
        "population": 1480839,
        "values": {
          "production": {
            "absolute": 6104796,
            "per_capita": 4.12
          },
          "gdp": {
            "absolute": 2914218,
            "per_capita": 1.97
          },
          "employment": {
            "absolute": 1.2,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 2805009,
            "per_capita": 1.89
          }
        }
      },
      {
        "code": "06",
        "name": "Friuli-Venezia Giulia",
        "nuts2_code": "ITH4",
        "population": 1196785,
        "values": {
          "production": {
            "absolute": 5659006,
            "per_capita": 4.73
          },
          "gdp": {
            "absolute": 2753129,
            "per_capita": 2.3
          },
          "employment": {
            "absolute": 1.2,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 2655739,
            "per_capita": 2.22
          }
        }
      },
      {
        "code": "02",
        "name": "Valle d'Aosta",
        "nuts2_code": "ITC2",
        "population": 123337,
        "values": {
          "production": {
            "absolute": 3282444,
            "per_capita": 26.61
          },
          "gdp": {
            "absolute": 1443571,
            "per_capita": 11.7
          },
          "employment": {
            "absolute": 0.7,
            "per_capita_per_10k": 0.06
          },
          "income": {
            "absolute": 1392872,
            "per_capita": 11.29
          }
        }
      },
      {
        "code": "10",
        "name": "Umbria",
        "nuts2_code": "ITI2",
        "population": 854137,
        "values": {
          "production": {
            "absolute": 3248093,
            "per_capita": 3.8
          },
          "gdp": {
            "absolute": 1646103,
            "per_capita": 1.93
          },
          "employment": {
            "absolute": 0.7,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 1584666,
            "per_capita": 1.86
          }
        }
      },
      {
        "code": "13",
        "name": "Abruzzo",
        "nuts2_code": "ITF1",
        "population": 1269963,
        "values": {
          "production": {
            "absolute": 2155345,
            "per_capita": 1.7
          },
          "gdp": {
            "absolute": 994316,
            "per_capita": 0.78
          },
          "employment": {
            "absolute": 0.5,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 963348,
            "per_capita": 0.76
          }
        }
      },
      {
        "code": "20",
        "name": "Sardegna",
        "nuts2_code": "ITG2",
        "population": 1575028,
        "values": {
          "production": {
            "absolute": 1832052,
            "per_capita": 1.16
          },
          "gdp": {
            "absolute": 1127825,
            "per_capita": 0.72
          },
          "employment": {
            "absolute": 0.5,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 1099800,
            "per_capita": 0.7
          }
        }
      },
      {
        "code": "15",
        "name": "Campania",
        "nuts2_code": "ITF3",
        "population": 5592175,
        "values": {
          "production": {
            "absolute": 1504604,
            "per_capita": 0.27
          },
          "gdp": {
            "absolute": 864810,
            "per_capita": 0.15
          },
          "employment": {
            "absolute": 0.4,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 842798,
            "per_capita": 0.15
          }
        }
      },
      {
        "code": "16",
        "name": "Puglia",
        "nuts2_code": "ITF4",
        "population": 3900852,
        "values": {
          "production": {
            "absolute": 608111,
            "per_capita": 0.16
          },
          "gdp": {
            "absolute": 362119,
            "per_capita": 0.09
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 355721,
            "per_capita": 0.09
          }
        }
      },
      {
        "code": "14",
        "name": "Molise",
        "nuts2_code": "ITF2",
        "population": 289840,
        "values": {
          "production": {
            "absolute": 286033,
            "per_capita": 0.99
          },
          "gdp": {
            "absolute": 110800,
            "per_capita": 0.38
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 108332,
            "per_capita": 0.37
          }
        }
      },
      {
        "code": "19",
        "name": "Sicilia",
        "nuts2_code": "ITG1",
        "population": 4801468,
        "values": {
          "production": {
            "absolute": 192761,
            "per_capita": 0.04
          },
          "gdp": {
            "absolute": 118022,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 115200,
            "per_capita": 0.02
          }
        }
      },
      {
        "code": "17",
        "name": "Basilicata",
        "nuts2_code": "ITF5",
        "population": 537577,
        "values": {
          "production": {
            "absolute": 125062,
            "per_capita": 0.23
          },
          "gdp": {
            "absolute": 60347,
            "per_capita": 0.11
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 59205,
            "per_capita": 0.11
          }
        }
      },
      {
        "code": "18",
        "name": "Calabria",
        "nuts2_code": "ITF6",
        "population": 1841300,
        "values": {
          "production": {
            "absolute": 115119,
            "per_capita": 0.06
          },
          "gdp": {
            "absolute": 68080,
            "per_capita": 0.04
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 67430,
            "per_capita": 0.04
          }
        }
      }
    ],
    "provinces": [
      {
        "code": "GE",
        "name": "Genova",
        "region_code": "07",
        "region_name": "Liguria",
        "population": 814000,
        "is_origin": true,
        "values": {
          "production": {
            "absolute": 563014519,
            "per_capita": 691.66
          },
          "gdp": {
            "absolute": 215468257,
            "per_capita": 264.7
          },
          "employment": {
            "absolute": 125.8,
            "per_capita_per_10k": 1.55
          },
          "income": {
            "absolute": 211398152,
            "per_capita": 259.7
          }
        }
      },
      {
        "code": "MI",
        "name": "Milano",
        "region_code": "03",
        "region_name": "Lombardia",
        "population": 3214000,
        "values": {
          "production": {
            "absolute": 102624085,
            "per_capita": 31.93
          },
          "gdp": {
            "absolute": 62488460,
            "per_capita": 19.44
          },
          "employment": {
            "absolute": 32.7,
            "per_capita_per_10k": 0.1
          },
          "income": {
            "absolute": 60697945,
            "per_capita": 18.89
          }
        }
      },
      {
        "code": "AL",
        "name": "Alessandria",
        "region_code": "01",
        "region_name": "Piemonte",
        "population": 410000,
        "values": {
          "production": {
            "absolute": 47496681,
            "per_capita": 115.85
          },
          "gdp": {
            "absolute": 14667899,
            "per_capita": 35.78
          },
          "employment": {
            "absolute": 9,
            "per_capita_per_10k": 0.22
          },
          "income": {
            "absolute": 14340087,
            "per_capita": 34.98
          }
        }
      },
      {
        "code": "TO",
        "name": "Torino",
        "region_code": "01",
        "region_name": "Piemonte",
        "population": 2208000,
        "values": {
          "production": {
            "absolute": 46419405,
            "per_capita": 21.02
          },
          "gdp": {
            "absolute": 26396853,
            "per_capita": 11.96
          },
          "employment": {
            "absolute": 14,
            "per_capita_per_10k": 0.06
          },
          "income": {
            "absolute": 25698652,
            "per_capita": 11.64
          }
        }
      },
      {
        "code": "SV",
        "name": "Savona",
        "region_code": "07",
        "region_name": "Liguria",
        "population": 269000,
        "values": {
          "production": {
            "absolute": 32042393,
            "per_capita": 119.12
          },
          "gdp": {
            "absolute": 10129816,
            "per_capita": 37.66
          },
          "employment": {
            "absolute": 5.6,
            "per_capita_per_10k": 0.21
          },
          "income": {
            "absolute": 9883969,
            "per_capita": 36.74
          }
        }
      },
      {
        "code": "PV",
        "name": "Pavia",
        "region_code": "03",
        "region_name": "Lombardia",
        "population": 535000,
        "values": {
          "production": {
            "absolute": 26742304,
            "per_capita": 49.99
          },
          "gdp": {
            "absolute": 8526058,
            "per_capita": 15.94
          },
          "employment": {
            "absolute": 5.1,
            "per_capita_per_10k": 0.1
          },
          "income": {
            "absolute": 8329293,
            "per_capita": 15.57
          }
        }
      },
      {
        "code": "SP",
        "name": "La Spezia",
        "region_code": "07",
        "region_name": "Liguria",
        "population": 215000,
        "values": {
          "production": {
            "absolute": 23573287,
            "per_capita": 109.64
          },
          "gdp": {
            "absolute": 6833726,
            "per_capita": 31.78
          },
          "employment": {
            "absolute": 4,
            "per_capita_per_10k": 0.19
          },
          "income": {
            "absolute": 6668359,
            "per_capita": 31.02
          }
        }
      },
      {
        "code": "CN",
        "name": "Cuneo",
        "region_code": "01",
        "region_name": "Piemonte",
        "population": 585000,
        "values": {
          "production": {
            "absolute": 22305979,
            "per_capita": 38.13
          },
          "gdp": {
            "absolute": 10999307,
            "per_capita": 18.8
          },
          "employment": {
            "absolute": 6,
            "per_capita_per_10k": 0.1
          },
          "income": {
            "absolute": 10774538,
            "per_capita": 18.42
          }
        }
      },
      {
        "code": "PC",
        "name": "Piacenza",
        "region_code": "08",
        "region_name": "Emilia-Romagna",
        "population": 285000,
        "values": {
          "production": {
            "absolute": 20462074,
            "per_capita": 71.8
          },
          "gdp": {
            "absolute": 6546267,
            "per_capita": 22.97
          },
          "employment": {
            "absolute": 3.9,
            "per_capita_per_10k": 0.14
          },
          "income": {
            "absolute": 6388382,
            "per_capita": 22.42
          }
        }
      },
      {
        "code": "AT",
        "name": "Asti",
        "region_code": "01",
        "region_name": "Piemonte",
        "population": 213000,
        "values": {
          "production": {
            "absolute": 19753705,
            "per_capita": 92.74
          },
          "gdp": {
            "absolute": 5264113,
            "per_capita": 24.71
          },
          "employment": {
            "absolute": 3,
            "per_capita_per_10k": 0.14
          },
          "income": {
            "absolute": 5148820,
            "per_capita": 24.17
          }
        }
      },
      {
        "code": "MB",
        "name": "Monza Brianza",
        "region_code": "03",
        "region_name": "Lombardia",
        "population": 871000,
        "values": {
          "production": {
            "absolute": 19149908,
            "per_capita": 21.99
          },
          "gdp": {
            "absolute": 7946619,
            "per_capita": 9.12
          },
          "employment": {
            "absolute": 4.1,
            "per_capita_per_10k": 0.05
          },
          "income": {
            "absolute": 7722418,
            "per_capita": 8.87
          }
        }
      },
      {
        "code": "VA",
        "name": "Varese",
        "region_code": "03",
        "region_name": "Lombardia",
        "population": 884000,
        "values": {
          "production": {
            "absolute": 17811555,
            "per_capita": 20.15
          },
          "gdp": {
            "absolute": 7008523,
            "per_capita": 7.93
          },
          "employment": {
            "absolute": 3.7,
            "per_capita_per_10k": 0.04
          },
          "income": {
            "absolute": 6807115,
            "per_capita": 7.7
          }
        }
      },
      {
        "code": "BG",
        "name": "Bergamo",
        "region_code": "03",
        "region_name": "Lombardia",
        "population": 1108000,
        "values": {
          "production": {
            "absolute": 17384796,
            "per_capita": 15.69
          },
          "gdp": {
            "absolute": 7712497,
            "per_capita": 6.96
          },
          "employment": {
            "absolute": 4.2,
            "per_capita_per_10k": 0.04
          },
          "income": {
            "absolute": 7499466,
            "per_capita": 6.77
          }
        }
      },
      {
        "code": "PR",
        "name": "Parma",
        "region_code": "08",
        "region_name": "Emilia-Romagna",
        "population": 451000,
        "values": {
          "production": {
            "absolute": 15930634,
            "per_capita": 35.32
          },
          "gdp": {
            "absolute": 5823605,
            "per_capita": 12.91
          },
          "employment": {
            "absolute": 3.3,
            "per_capita_per_10k": 0.07
          },
          "income": {
            "absolute": 5679621,
            "per_capita": 12.59
          }
        }
      },
      {
        "code": "BS",
        "name": "Brescia",
        "region_code": "03",
        "region_name": "Lombardia",
        "population": 1255000,
        "values": {
          "production": {
            "absolute": 12824664,
            "per_capita": 10.22
          },
          "gdp": {
            "absolute": 6330640,
            "per_capita": 5.04
          },
          "employment": {
            "absolute": 3.2,
            "per_capita_per_10k": 0.03
          },
          "income": {
            "absolute": 6135842,
            "per_capita": 4.89
          }
        }
      },
      {
        "code": "RE",
        "name": "Reggio Emilia",
        "region_code": "08",
        "region_name": "Emilia-Romagna",
        "population": 524000,
        "values": {
          "production": {
            "absolute": 12175483,
            "per_capita": 23.24
          },
          "gdp": {
            "absolute": 4974528,
            "per_capita": 9.49
          },
          "employment": {
            "absolute": 2.7,
            "per_capita_per_10k": 0.05
          },
          "income": {
            "absolute": 4844248,
            "per_capita": 9.24
          }
        }
      },
      {
        "code": "IM",
        "name": "Imperia",
        "region_code": "07",
        "region_name": "Liguria",
        "population": 210000,
        "values": {
          "production": {
            "absolute": 12089403,
            "per_capita": 57.57
          },
          "gdp": {
            "absolute": 5072294,
            "per_capita": 24.15
          },
          "employment": {
            "absolute": 2.7,
            "per_capita_per_10k": 0.13
          },
          "income": {
            "absolute": 4953994,
            "per_capita": 23.59
          }
        }
      },
      {
        "code": "MS",
        "name": "Massa Carrara",
        "region_code": "09",
        "region_name": "Toscana",
        "population": 191000,
        "values": {
          "production": {
            "absolute": 12083401,
            "per_capita": 63.26
          },
          "gdp": {
            "absolute": 3715527,
            "per_capita": 19.45
          },
          "employment": {
            "absolute": 2.1,
            "per_capita_per_10k": 0.11
          },
          "income": {
            "absolute": 3618451,
            "per_capita": 18.94
          }
        }
      },
      {
        "code": "MO",
        "name": "Modena",
        "region_code": "08",
        "region_name": "Emilia-Romagna",
        "population": 705000,
        "values": {
          "production": {
            "absolute": 11649136,
            "per_capita": 16.52
          },
          "gdp": {
            "absolute": 5302791,
            "per_capita": 7.52
          },
          "employment": {
            "absolute": 2.8,
            "per_capita_per_10k": 0.04
          },
          "income": {
            "absolute": 5142431,
            "per_capita": 7.29
          }
        }
      },
      {
        "code": "NO",
        "name": "Novara",
        "region_code": "01",
        "region_name": "Piemonte",
        "population": 364000,
        "values": {
          "production": {
            "absolute": 11351824,
            "per_capita": 31.19
          },
          "gdp": {
            "absolute": 3857091,
            "per_capita": 10.6
          },
          "employment": {
            "absolute": 2.2,
            "per_capita_per_10k": 0.06
          },
          "income": {
            "absolute": 3751411,
            "per_capita": 10.31
          }
        }
      },
      {
        "code": "BO",
        "name": "Bologna",
        "region_code": "08",
        "region_name": "Emilia-Romagna",
        "population": 1017000,
        "values": {
          "production": {
            "absolute": 11258527,
            "per_capita": 11.07
          },
          "gdp": {
            "absolute": 5853225,
            "per_capita": 5.76
          },
          "employment": {
            "absolute": 2.9,
            "per_capita_per_10k": 0.03
          },
          "income": {
            "absolute": 5677131,
            "per_capita": 5.58
          }
        }
      },
      {
        "code": "LO",
        "name": "Lodi",
        "region_code": "03",
        "region_name": "Lombardia",
        "population": 226000,
        "values": {
          "production": {
            "absolute": 11227643,
            "per_capita": 49.68
          },
          "gdp": {
            "absolute": 2893250,
            "per_capita": 12.8
          },
          "employment": {
            "absolute": 1.7,
            "per_capita_per_10k": 0.08
          },
          "income": {
            "absolute": 2820250,
            "per_capita": 12.48
          }
        }
      },
      {
        "code": "VR",
        "name": "Verona",
        "region_code": "05",
        "region_name": "Veneto",
        "population": 926000,
        "values": {
          "production": {
            "absolute": 11132370,
            "per_capita": 12.02
          },
          "gdp": {
            "absolute": 5222925,
            "per_capita": 5.64
          },
          "employment": {
            "absolute": 2.6,
            "per_capita_per_10k": 0.03
          },
          "income": {
            "absolute": 5075125,
            "per_capita": 5.48
          }
        }
      },
      {
        "code": "LU",
        "name": "Lucca",
        "region_code": "09",
        "region_name": "Toscana",
        "population": 383000,
        "values": {
          "production": {
            "absolute": 11002814,
            "per_capita": 28.73
          },
          "gdp": {
            "absolute": 4666301,
            "per_capita": 12.18
          },
          "employment": {
            "absolute": 2.4,
            "per_capita_per_10k": 0.06
          },
          "income": {
            "absolute": 4531605,
            "per_capita": 11.83
          }
        }
      },
      {
        "code": "CO",
        "name": "Como",
        "region_code": "03",
        "region_name": "Lombardia",
        "population": 596000,
        "values": {
          "production": {
            "absolute": 10598171,
            "per_capita": 17.78
          },
          "gdp": {
            "absolute": 4293306,
            "per_capita": 7.2
          },
          "employment": {
            "absolute": 2.2,
            "per_capita_per_10k": 0.04
          },
          "income": {
            "absolute": 4166270,
            "per_capita": 6.99
          }
        }
      },
      {
        "code": "CR",
        "name": "Cremona",
        "region_code": "03",
        "region_name": "Lombardia",
        "population": 354000,
        "values": {
          "production": {
            "absolute": 9984163,
            "per_capita": 28.2
          },
          "gdp": {
            "absolute": 3197712,
            "per_capita": 9.03
          },
          "employment": {
            "absolute": 1.8,
            "per_capita_per_10k": 0.05
          },
          "income": {
            "absolute": 3120198,
            "per_capita": 8.81
          }
        }
      },
      {
        "code": "PI",
        "name": "Pisa",
        "region_code": "09",
        "region_name": "Toscana",
        "population": 421000,
        "values": {
          "production": {
            "absolute": 9754208,
            "per_capita": 23.17
          },
          "gdp": {
            "absolute": 4240978,
            "per_capita": 10.07
          },
          "employment": {
            "absolute": 2.2,
            "per_capita_per_10k": 0.05
          },
          "income": {
            "absolute": 4120703,
            "per_capita": 9.79
          }
        }
      },
      {
        "code": "FI",
        "name": "Firenze",
        "region_code": "09",
        "region_name": "Toscana",
        "population": 987000,
        "values": {
          "production": {
            "absolute": 9531559,
            "per_capita": 9.66
          },
          "gdp": {
            "absolute": 5143866,
            "per_capita": 5.21
          },
          "employment": {
            "absolute": 2.5,
            "per_capita_per_10k": 0.03
          },
          "income": {
            "absolute": 4970764,
            "per_capita": 5.04
          }
        }
      },
      {
        "code": "MN",
        "name": "Mantova",
        "region_code": "03",
        "region_name": "Lombardia",
        "population": 403000,
        "values": {
          "production": {
            "absolute": 7466433,
            "per_capita": 18.53
          },
          "gdp": {
            "absolute": 2749882,
            "per_capita": 6.82
          },
          "employment": {
            "absolute": 1.5,
            "per_capita_per_10k": 0.04
          },
          "income": {
            "absolute": 2683554,
            "per_capita": 6.66
          }
        }
      },
      {
        "code": "LC",
        "name": "Lecco",
        "region_code": "03",
        "region_name": "Lombardia",
        "population": 331000,
        "values": {
          "production": {
            "absolute": 7005450,
            "per_capita": 21.16
          },
          "gdp": {
            "absolute": 2330534,
            "per_capita": 7.04
          },
          "employment": {
            "absolute": 1.2,
            "per_capita_per_10k": 0.04
          },
          "income": {
            "absolute": 2262234,
            "per_capita": 6.83
          }
        }
      },
      {
        "code": "VI",
        "name": "Vicenza",
        "region_code": "05",
        "region_name": "Veneto",
        "population": 855000,
        "values": {
          "production": {
            "absolute": 6332029,
            "per_capita": 7.41
          },
          "gdp": {
            "absolute": 2904890,
            "per_capita": 3.4
          },
          "employment": {
            "absolute": 1.4,
            "per_capita_per_10k": 0.02
          },
          "income": {
            "absolute": 2808211,
            "per_capita": 3.28
          }
        }
      },
      {
        "code": "PD",
        "name": "Padova",
        "region_code": "05",
        "region_name": "Veneto",
        "population": 933000,
        "values": {
          "production": {
            "absolute": 6191846,
            "per_capita": 6.64
          },
          "gdp": {
            "absolute": 3176621,
            "per_capita": 3.4
          },
          "employment": {
            "absolute": 1.4,
            "per_capita_per_10k": 0.02
          },
          "income": {
            "absolute": 3058531,
            "per_capita": 3.28
          }
        }
      },
      {
        "code": "BI",
        "name": "Biella",
        "region_code": "01",
        "region_name": "Piemonte",
        "population": 170000,
        "values": {
          "production": {
            "absolute": 6116693,
            "per_capita": 35.98
          },
          "gdp": {
            "absolute": 1841342,
            "per_capita": 10.83
          },
          "employment": {
            "absolute": 1,
            "per_capita_per_10k": 0.06
          },
          "income": {
            "absolute": 1783513,
            "per_capita": 10.49
          }
        }
      },
      {
        "code": "RM",
        "name": "Roma",
        "region_code": "12",
        "region_name": "Lazio",
        "population": 4216000,
        "values": {
          "production": {
            "absolute": 6010909,
            "per_capita": 1.43
          },
          "gdp": {
            "absolute": 4264423,
            "per_capita": 1.01
          },
          "employment": {
            "absolute": 2.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 4090546,
            "per_capita": 0.97
          }
        }
      },
      {
        "code": "VE",
        "name": "Venezia",
        "region_code": "05",
        "region_name": "Veneto",
        "population": 836000,
        "values": {
          "production": {
            "absolute": 5763432,
            "per_capita": 6.89
          },
          "gdp": {
            "absolute": 2742871,
            "per_capita": 3.28
          },
          "employment": {
            "absolute": 1.1,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 2636810,
            "per_capita": 3.15
          }
        }
      },
      {
        "code": "VC",
        "name": "Vercelli",
        "region_code": "01",
        "region_name": "Piemonte",
        "population": 167000,
        "values": {
          "production": {
            "absolute": 5761790,
            "per_capita": 34.5
          },
          "gdp": {
            "absolute": 1563301,
            "per_capita": 9.36
          },
          "employment": {
            "absolute": 0.9,
            "per_capita_per_10k": 0.05
          },
          "income": {
            "absolute": 1527797,
            "per_capita": 9.15
          }
        }
      },
      {
        "code": "TV",
        "name": "Treviso",
        "region_code": "05",
        "region_name": "Veneto",
        "population": 887000,
        "values": {
          "production": {
            "absolute": 5086364,
            "per_capita": 5.73
          },
          "gdp": {
            "absolute": 2726294,
            "per_capita": 3.07
          },
          "employment": {
            "absolute": 1.2,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 2633921,
            "per_capita": 2.97
          }
        }
      },
      {
        "code": "TN",
        "name": "Trento",
        "region_code": "04",
        "region_name": "Trentino-Alto Adige",
        "population": 545000,
        "values": {
          "production": {
            "absolute": 4949729,
            "per_capita": 9.08
          },
          "gdp": {
            "absolute": 2458058,
            "per_capita": 4.51
          },
          "employment": {
            "absolute": 1.2,
            "per_capita_per_10k": 0.02
          },
          "income": {
            "absolute": 2372661,
            "per_capita": 4.35
          }
        }
      },
      {
        "code": "PT",
        "name": "Pistoia",
        "region_code": "09",
        "region_name": "Toscana",
        "population": 290000,
        "values": {
          "production": {
            "absolute": 4933264,
            "per_capita": 17.01
          },
          "gdp": {
            "absolute": 1862192,
            "per_capita": 6.42
          },
          "employment": {
            "absolute": 0.9,
            "per_capita_per_10k": 0.03
          },
          "income": {
            "absolute": 1804883,
            "per_capita": 6.22
          }
        }
      },
      {
        "code": "VB",
        "name": "Verbania",
        "region_code": "01",
        "region_name": "Piemonte",
        "population": 156000,
        "values": {
          "production": {
            "absolute": 4812495,
            "per_capita": 30.85
          },
          "gdp": {
            "absolute": 1361986,
            "per_capita": 8.73
          },
          "employment": {
            "absolute": 0.7,
            "per_capita_per_10k": 0.04
          },
          "income": {
            "absolute": 1317556,
            "per_capita": 8.45
          }
        }
      },
      {
        "code": "PO",
        "name": "Prato",
        "region_code": "09",
        "region_name": "Toscana",
        "population": 261000,
        "values": {
          "production": {
            "absolute": 4544457,
            "per_capita": 17.41
          },
          "gdp": {
            "absolute": 1704603,
            "per_capita": 6.53
          },
          "employment": {
            "absolute": 0.7,
            "per_capita_per_10k": 0.03
          },
          "income": {
            "absolute": 1641816,
            "per_capita": 6.29
          }
        }
      },
      {
        "code": "BZ",
        "name": "Bolzano",
        "region_code": "04",
        "region_name": "Trentino-Alto Adige",
        "population": 533000,
        "values": {
          "production": {
            "absolute": 3769413,
            "per_capita": 7.07
          },
          "gdp": {
            "absolute": 2249330,
            "per_capita": 4.22
          },
          "employment": {
            "absolute": 0.9,
            "per_capita_per_10k": 0.02
          },
          "income": {
            "absolute": 2169070,
            "per_capita": 4.07
          }
        }
      },
      {
        "code": "RA",
        "name": "Ravenna",
        "region_code": "08",
        "region_name": "Emilia-Romagna",
        "population": 386000,
        "values": {
          "production": {
            "absolute": 3730112,
            "per_capita": 9.66
          },
          "gdp": {
            "absolute": 1674602,
            "per_capita": 4.34
          },
          "employment": {
            "absolute": 0.8,
            "per_capita_per_10k": 0.02
          },
          "income": {
            "absolute": 1622987,
            "per_capita": 4.2
          }
        }
      },
      {
        "code": "FC",
        "name": "Forli",
        "region_code": "08",
        "region_name": "Emilia-Romagna",
        "population": 393000,
        "values": {
          "production": {
            "absolute": 3690434,
            "per_capita": 9.39
          },
          "gdp": {
            "absolute": 1819087,
            "per_capita": 4.63
          },
          "employment": {
            "absolute": 0.7,
            "per_capita_per_10k": 0.02
          },
          "income": {
            "absolute": 1759302,
            "per_capita": 4.48
          }
        }
      },
      {
        "code": "LI",
        "name": "Livorno",
        "region_code": "09",
        "region_name": "Toscana",
        "population": 330000,
        "values": {
          "production": {
            "absolute": 3535353,
            "per_capita": 10.71
          },
          "gdp": {
            "absolute": 1564034,
            "per_capita": 4.74
          },
          "employment": {
            "absolute": 0.7,
            "per_capita_per_10k": 0.02
          },
          "income": {
            "absolute": 1510745,
            "per_capita": 4.58
          }
        }
      },
      {
        "code": "AO",
        "name": "Aosta",
        "region_code": "02",
        "region_name": "Valle d'Aosta",
        "population": 123000,
        "values": {
          "production": {
            "absolute": 3282444,
            "per_capita": 26.69
          },
          "gdp": {
            "absolute": 1443571,
            "per_capita": 11.74
          },
          "employment": {
            "absolute": 0.7,
            "per_capita_per_10k": 0.06
          },
          "income": {
            "absolute": 1392872,
            "per_capita": 11.32
          }
        }
      },
      {
        "code": "FE",
        "name": "Ferrara",
        "region_code": "08",
        "region_name": "Emilia-Romagna",
        "population": 343000,
        "values": {
          "production": {
            "absolute": 2902213,
            "per_capita": 8.46
          },
          "gdp": {
            "absolute": 1173424,
            "per_capita": 3.42
          },
          "employment": {
            "absolute": 0.5,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 1143136,
            "per_capita": 3.33
          }
        }
      },
      {
        "code": "SO",
        "name": "Sondrio",
        "region_code": "03",
        "region_name": "Lombardia",
        "population": 178000,
        "values": {
          "production": {
            "absolute": 2674847,
            "per_capita": 15.03
          },
          "gdp": {
            "absolute": 1072792,
            "per_capita": 6.03
          },
          "employment": {
            "absolute": 0.5,
            "per_capita_per_10k": 0.03
          },
          "income": {
            "absolute": 1031862,
            "per_capita": 5.8
          }
        }
      },
      {
        "code": "RN",
        "name": "Rimini",
        "region_code": "08",
        "region_name": "Emilia-Romagna",
        "population": 336000,
        "values": {
          "production": {
            "absolute": 2633129,
            "per_capita": 7.84
          },
          "gdp": {
            "absolute": 1542937,
            "per_capita": 4.59
          },
          "employment": {
            "absolute": 0.5,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 1469992,
            "per_capita": 4.37
          }
        }
      },
      {
        "code": "SI",
        "name": "Siena",
        "region_code": "09",
        "region_name": "Toscana",
        "population": 261000,
        "values": {
          "production": {
            "absolute": 2455268,
            "per_capita": 9.41
          },
          "gdp": {
            "absolute": 1227397,
            "per_capita": 4.7
          },
          "employment": {
            "absolute": 0.6,
            "per_capita_per_10k": 0.02
          },
          "income": {
            "absolute": 1182315,
            "per_capita": 4.53
          }
        }
      },
      {
        "code": "AR",
        "name": "Arezzo",
        "region_code": "09",
        "region_name": "Toscana",
        "population": 336000,
        "values": {
          "production": {
            "absolute": 2411270,
            "per_capita": 7.18
          },
          "gdp": {
            "absolute": 1014056,
            "per_capita": 3.02
          },
          "employment": {
            "absolute": 0.5,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 982644,
            "per_capita": 2.92
          }
        }
      },
      {
        "code": "PG",
        "name": "Perugia",
        "region_code": "10",
        "region_name": "Umbria",
        "population": 648000,
        "values": {
          "production": {
            "absolute": 2358657,
            "per_capita": 3.64
          },
          "gdp": {
            "absolute": 1277678,
            "per_capita": 1.97
          },
          "employment": {
            "absolute": 0.5,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 1230693,
            "per_capita": 1.9
          }
        }
      },
      {
        "code": "PU",
        "name": "Pesaro Urbino",
        "region_code": "11",
        "region_name": "Marche",
        "population": 355000,
        "values": {
          "production": {
            "absolute": 2036004,
            "per_capita": 5.74
          },
          "gdp": {
            "absolute": 1023718,
            "per_capita": 2.88
          },
          "employment": {
            "absolute": 0.4,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 982466,
            "per_capita": 2.77
          }
        }
      },
      {
        "code": "UD",
        "name": "Udine",
        "region_code": "06",
        "region_name": "Friuli-Venezia Giulia",
        "population": 519000,
        "values": {
          "production": {
            "absolute": 1933070,
            "per_capita": 3.72
          },
          "gdp": {
            "absolute": 1068780,
            "per_capita": 2.06
          },
          "employment": {
            "absolute": 0.5,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 1029675,
            "per_capita": 1.98
          }
        }
      },
      {
        "code": "RO",
        "name": "Rovigo",
        "region_code": "05",
        "region_name": "Veneto",
        "population": 226000,
        "values": {
          "production": {
            "absolute": 1882735,
            "per_capita": 8.33
          },
          "gdp": {
            "absolute": 695159,
            "per_capita": 3.08
          },
          "employment": {
            "absolute": 0.3,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 673943,
            "per_capita": 2.98
          }
        }
      },
      {
        "code": "AN",
        "name": "Ancona",
        "region_code": "11",
        "region_name": "Marche",
        "population": 462000,
        "values": {
          "production": {
            "absolute": 1691305,
            "per_capita": 3.66
          },
          "gdp": {
            "absolute": 840394,
            "per_capita": 1.82
          },
          "employment": {
            "absolute": 0.4,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 810119,
            "per_capita": 1.75
          }
        }
      },
      {
        "code": "PN",
        "name": "Pordenone",
        "region_code": "06",
        "region_name": "Friuli-Venezia Giulia",
        "population": 311000,
        "values": {
          "production": {
            "absolute": 1630597,
            "per_capita": 5.24
          },
          "gdp": {
            "absolute": 709878,
            "per_capita": 2.28
          },
          "employment": {
            "absolute": 0.3,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 687031,
            "per_capita": 2.21
          }
        }
      },
      {
        "code": "GR",
        "name": "Grosseto",
        "region_code": "09",
        "region_name": "Toscana",
        "population": 217000,
        "values": {
          "production": {
            "absolute": 1603092,
            "per_capita": 7.39
          },
          "gdp": {
            "absolute": 811786,
            "per_capita": 3.74
          },
          "employment": {
            "absolute": 0.3,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 792874,
            "per_capita": 3.65
          }
        }
      },
      {
        "code": "TS",
        "name": "Trieste",
        "region_code": "06",
        "region_name": "Friuli-Venezia Giulia",
        "population": 230000,
        "values": {
          "production": {
            "absolute": 1394603,
            "per_capita": 6.06
          },
          "gdp": {
            "absolute": 718069,
            "per_capita": 3.12
          },
          "employment": {
            "absolute": 0.3,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 691369,
            "per_capita": 3.01
          }
        }
      },
      {
        "code": "BL",
        "name": "Belluno",
        "region_code": "05",
        "region_name": "Veneto",
        "population": 198000,
        "values": {
          "production": {
            "absolute": 1231170,
            "per_capita": 6.22
          },
          "gdp": {
            "absolute": 517375,
            "per_capita": 2.61
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 497931,
            "per_capita": 2.51
          }
        }
      },
      {
        "code": "MC",
        "name": "Macerata",
        "region_code": "11",
        "region_name": "Marche",
        "population": 301000,
        "values": {
          "production": {
            "absolute": 1144488,
            "per_capita": 3.8
          },
          "gdp": {
            "absolute": 533354,
            "per_capita": 1.77
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 513448,
            "per_capita": 1.71
          }
        }
      },
      {
        "code": "VT",
        "name": "Viterbo",
        "region_code": "12",
        "region_name": "Lazio",
        "population": 311000,
        "values": {
          "production": {
            "absolute": 1027899,
            "per_capita": 3.31
          },
          "gdp": {
            "absolute": 503382,
            "per_capita": 1.62
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 490777,
            "per_capita": 1.58
          }
        }
      },
      {
        "code": "TR",
        "name": "Terni",
        "region_code": "10",
        "region_name": "Umbria",
        "population": 217000,
        "values": {
          "production": {
            "absolute": 889436,
            "per_capita": 4.1
          },
          "gdp": {
            "absolute": 368424,
            "per_capita": 1.7
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 353973,
            "per_capita": 1.63
          }
        }
      },
      {
        "code": "SS",
        "name": "Sassari",
        "region_code": "20",
        "region_name": "Sardegna",
        "population": 477000,
        "values": {
          "production": {
            "absolute": 764681,
            "per_capita": 1.6
          },
          "gdp": {
            "absolute": 518375,
            "per_capita": 1.09
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 501400,
            "per_capita": 1.05
          }
        }
      },
      {
        "code": "LT",
        "name": "Latina",
        "region_code": "12",
        "region_name": "Lazio",
        "population": 567000,
        "values": {
          "production": {
            "absolute": 703717,
            "per_capita": 1.24
          },
          "gdp": {
            "absolute": 357020,
            "per_capita": 0.63
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 355965,
            "per_capita": 0.63
          }
        }
      },
      {
        "code": "GO",
        "name": "Gorizia",
        "region_code": "06",
        "region_name": "Friuli-Venezia Giulia",
        "population": 137000,
        "values": {
          "production": {
            "absolute": 700735,
            "per_capita": 5.11
          },
          "gdp": {
            "absolute": 256402,
            "per_capita": 1.87
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 247664,
            "per_capita": 1.81
          }
        }
      },
      {
        "code": "AP",
        "name": "Ascoli Piceno",
        "region_code": "11",
        "region_name": "Marche",
        "population": 200000,
        "values": {
          "production": {
            "absolute": 683131,
            "per_capita": 3.42
          },
          "gdp": {
            "absolute": 304461,
            "per_capita": 1.52
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 294682,
            "per_capita": 1.47
          }
        }
      },
      {
        "code": "NA",
        "name": "Napoli",
        "region_code": "15",
        "region_name": "Campania",
        "population": 2946000,
        "values": {
          "production": {
            "absolute": 665660,
            "per_capita": 0.23
          },
          "gdp": {
            "absolute": 427558,
            "per_capita": 0.15
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 413090,
            "per_capita": 0.14
          }
        }
      },
      {
        "code": "TE",
        "name": "Teramo",
        "region_code": "13",
        "region_name": "Abruzzo",
        "population": 296000,
        "values": {
          "production": {
            "absolute": 634279,
            "per_capita": 2.14
          },
          "gdp": {
            "absolute": 291085,
            "per_capita": 0.98
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 282252,
            "per_capita": 0.95
          }
        }
      },
      {
        "code": "AQ",
        "name": "Aquila",
        "region_code": "13",
        "region_name": "Abruzzo",
        "population": 286000,
        "values": {
          "production": {
            "absolute": 579349,
            "per_capita": 2.03
          },
          "gdp": {
            "absolute": 240244,
            "per_capita": 0.84
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 233420,
            "per_capita": 0.82
          }
        }
      },
      {
        "code": "FM",
        "name": "Fermo",
        "region_code": "11",
        "region_name": "Marche",
        "population": 168000,
        "values": {
          "production": {
            "absolute": 549868,
            "per_capita": 3.27
          },
          "gdp": {
            "absolute": 212290,
            "per_capita": 1.26
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 204294,
            "per_capita": 1.22
          }
        }
      },
      {
        "code": "PE",
        "name": "Pescara",
        "region_code": "13",
        "region_name": "Abruzzo",
        "population": 312000,
        "values": {
          "production": {
            "absolute": 531516,
            "per_capita": 1.7
          },
          "gdp": {
            "absolute": 264046,
            "per_capita": 0.85
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 253624,
            "per_capita": 0.81
          }
        }
      },
      {
        "code": "FR",
        "name": "Frosinone",
        "region_code": "12",
        "region_name": "Lazio",
        "population": 470000,
        "values": {
          "production": {
            "absolute": 434443,
            "per_capita": 0.92
          },
          "gdp": {
            "absolute": 202689,
            "per_capita": 0.43
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 194927,
            "per_capita": 0.41
          }
        }
      },
      {
        "code": "CH",
        "name": "Chieti",
        "region_code": "13",
        "region_name": "Abruzzo",
        "population": 376000,
        "values": {
          "production": {
            "absolute": 410201,
            "per_capita": 1.09
          },
          "gdp": {
            "absolute": 198941,
            "per_capita": 0.53
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 194052,
            "per_capita": 0.52
          }
        }
      },
      {
        "code": "SU",
        "name": "Sud Sardegna",
        "region_code": "20",
        "region_name": "Sardegna",
        "population": 333000,
        "values": {
          "production": {
            "absolute": 396068,
            "per_capita": 1.19
          },
          "gdp": {
            "absolute": 206366,
            "per_capita": 0.62
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 204068,
            "per_capita": 0.61
          }
        }
      },
      {
        "code": "RI",
        "name": "Rieti",
        "region_code": "12",
        "region_name": "Lazio",
        "population": 152000,
        "values": {
          "production": {
            "absolute": 359283,
            "per_capita": 2.36
          },
          "gdp": {
            "absolute": 129101,
            "per_capita": 0.85
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 124808,
            "per_capita": 0.82
          }
        }
      },
      {
        "code": "CE",
        "name": "Caserta",
        "region_code": "15",
        "region_name": "Campania",
        "population": 906000,
        "values": {
          "production": {
            "absolute": 344201,
            "per_capita": 0.38
          },
          "gdp": {
            "absolute": 184242,
            "per_capita": 0.2
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 181142,
            "per_capita": 0.2
          }
        }
      },
      {
        "code": "CA",
        "name": "Cagliari",
        "region_code": "20",
        "region_name": "Sardegna",
        "population": 415000,
        "values": {
          "production": {
            "absolute": 259533,
            "per_capita": 0.63
          },
          "gdp": {
            "absolute": 178043,
            "per_capita": 0.43
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 170544,
            "per_capita": 0.41
          }
        }
      },
      {
        "code": "NU",
        "name": "Nuoro",
        "region_code": "20",
        "region_name": "Sardegna",
        "population": 199000,
        "values": {
          "production": {
            "absolute": 255855,
            "per_capita": 1.29
          },
          "gdp": {
            "absolute": 139641,
            "per_capita": 0.7
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 139398,
            "per_capita": 0.7
          }
        }
      },
      {
        "code": "FG",
        "name": "Foggia",
        "region_code": "16",
        "region_name": "Puglia",
        "population": 583000,
        "values": {
          "production": {
            "absolute": 195558,
            "per_capita": 0.34
          },
          "gdp": {
            "absolute": 110908,
            "per_capita": 0.19
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 109076,
            "per_capita": 0.19
          }
        }
      },
      {
        "code": "SA",
        "name": "Salerno",
        "region_code": "15",
        "region_name": "Campania",
        "population": 1061000,
        "values": {
          "production": {
            "absolute": 193485,
            "per_capita": 0.18
          },
          "gdp": {
            "absolute": 114254,
            "per_capita": 0.11
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 111312,
            "per_capita": 0.1
          }
        }
      },
      {
        "code": "BA",
        "name": "Bari",
        "region_code": "16",
        "region_name": "Puglia",
        "population": 1209000,
        "values": {
          "production": {
            "absolute": 173822,
            "per_capita": 0.14
          },
          "gdp": {
            "absolute": 115240,
            "per_capita": 0.1
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 112032,
            "per_capita": 0.09
          }
        }
      },
      {
        "code": "CB",
        "name": "Campobasso",
        "region_code": "14",
        "region_name": "Molise",
        "population": 211000,
        "values": {
          "production": {
            "absolute": 167252,
            "per_capita": 0.79
          },
          "gdp": {
            "absolute": 75916,
            "per_capita": 0.36
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 74506,
            "per_capita": 0.35
          }
        }
      },
      {
        "code": "BN",
        "name": "Benevento",
        "region_code": "15",
        "region_name": "Campania",
        "population": 264000,
        "values": {
          "production": {
            "absolute": 160676,
            "per_capita": 0.61
          },
          "gdp": {
            "absolute": 71716,
            "per_capita": 0.27
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 71633,
            "per_capita": 0.27
          }
        }
      },
      {
        "code": "OR",
        "name": "Oristano",
        "region_code": "20",
        "region_name": "Sardegna",
        "population": 142000,
        "values": {
          "production": {
            "absolute": 155914,
            "per_capita": 1.1
          },
          "gdp": {
            "absolute": 85400,
            "per_capita": 0.6
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 84390,
            "per_capita": 0.59
          }
        }
      },
      {
        "code": "AV",
        "name": "Avellino",
        "region_code": "15",
        "region_name": "Campania",
        "population": 399000,
        "values": {
          "production": {
            "absolute": 140582,
            "per_capita": 0.35
          },
          "gdp": {
            "absolute": 67040,
            "per_capita": 0.17
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 65621,
            "per_capita": 0.16
          }
        }
      },
      {
        "code": "IS",
        "name": "Isernia",
        "region_code": "14",
        "region_name": "Molise",
        "population": 79000,
        "values": {
          "production": {
            "absolute": 118781,
            "per_capita": 1.5
          },
          "gdp": {
            "absolute": 34884,
            "per_capita": 0.44
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 33826,
            "per_capita": 0.43
          }
        }
      },
      {
        "code": "BT",
        "name": "Barletta Andria Trani",
        "region_code": "16",
        "region_name": "Puglia",
        "population": 369000,
        "values": {
          "production": {
            "absolute": 97805,
            "per_capita": 0.27
          },
          "gdp": {
            "absolute": 53730,
            "per_capita": 0.15
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 53589,
            "per_capita": 0.15
          }
        }
      },
      {
        "code": "PZ",
        "name": "Potenza",
        "region_code": "17",
        "region_name": "Basilicata",
        "population": 348000,
        "values": {
          "production": {
            "absolute": 86266,
            "per_capita": 0.25
          },
          "gdp": {
            "absolute": 41681,
            "per_capita": 0.12
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 40744,
            "per_capita": 0.12
          }
        }
      },
      {
        "code": "TA",
        "name": "Taranto",
        "region_code": "16",
        "region_name": "Puglia",
        "population": 547000,
        "values": {
          "production": {
            "absolute": 60491,
            "per_capita": 0.11
          },
          "gdp": {
            "absolute": 33215,
            "per_capita": 0.06
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 32991,
            "per_capita": 0.06
          }
        }
      },
      {
        "code": "PA",
        "name": "Palermo",
        "region_code": "19",
        "region_name": "Sicilia",
        "population": 1194000,
        "values": {
          "production": {
            "absolute": 56319,
            "per_capita": 0.05
          },
          "gdp": {
            "absolute": 37966,
            "per_capita": 0.03
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 36546,
            "per_capita": 0.03
          }
        }
      },
      {
        "code": "CS",
        "name": "Cosenza",
        "region_code": "18",
        "region_name": "Calabria",
        "population": 681000,
        "values": {
          "production": {
            "absolute": 48332,
            "per_capita": 0.07
          },
          "gdp": {
            "absolute": 30766,
            "per_capita": 0.05
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 30254,
            "per_capita": 0.04
          }
        }
      },
      {
        "code": "BR",
        "name": "Brindisi",
        "region_code": "16",
        "region_name": "Puglia",
        "population": 372000,
        "values": {
          "production": {
            "absolute": 40760,
            "per_capita": 0.11
          },
          "gdp": {
            "absolute": 23311,
            "per_capita": 0.06
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 23040,
            "per_capita": 0.06
          }
        }
      },
      {
        "code": "LE",
        "name": "Lecce",
        "region_code": "16",
        "region_name": "Puglia",
        "population": 759000,
        "values": {
          "production": {
            "absolute": 39676,
            "per_capita": 0.05
          },
          "gdp": {
            "absolute": 25716,
            "per_capita": 0.03
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 24993,
            "per_capita": 0.03
          }
        }
      },
      {
        "code": "MT",
        "name": "Matera",
        "region_code": "17",
        "region_name": "Basilicata",
        "population": 189000,
        "values": {
          "production": {
            "absolute": 38796,
            "per_capita": 0.21
          },
          "gdp": {
            "absolute": 18666,
            "per_capita": 0.1
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 18461,
            "per_capita": 0.1
          }
        }
      },
      {
        "code": "TP",
        "name": "Trapani",
        "region_code": "19",
        "region_name": "Sicilia",
        "population": 419000,
        "values": {
          "production": {
            "absolute": 29144,
            "per_capita": 0.07
          },
          "gdp": {
            "absolute": 17415,
            "per_capita": 0.04
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 16996,
            "per_capita": 0.04
          }
        }
      },
      {
        "code": "ME",
        "name": "Messina",
        "region_code": "19",
        "region_name": "Sicilia",
        "population": 591000,
        "values": {
          "production": {
            "absolute": 25606,
            "per_capita": 0.04
          },
          "gdp": {
            "absolute": 14091,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 13717,
            "per_capita": 0.02
          }
        }
      },
      {
        "code": "CT",
        "name": "Catania",
        "region_code": "19",
        "region_name": "Sicilia",
        "population": 1059000,
        "values": {
          "production": {
            "absolute": 25296,
            "per_capita": 0.02
          },
          "gdp": {
            "absolute": 16589,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 16175,
            "per_capita": 0.02
          }
        }
      },
      {
        "code": "CZ",
        "name": "Catanzaro",
        "region_code": "18",
        "region_name": "Calabria",
        "population": 343000,
        "values": {
          "production": {
            "absolute": 22957,
            "per_capita": 0.07
          },
          "gdp": {
            "absolute": 13638,
            "per_capita": 0.04
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 13551,
            "per_capita": 0.04
          }
        }
      },
      {
        "code": "RC",
        "name": "Reggio di Calabria",
        "region_code": "18",
        "region_name": "Calabria",
        "population": 517000,
        "values": {
          "production": {
            "absolute": 20082,
            "per_capita": 0.04
          },
          "gdp": {
            "absolute": 12111,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 12163,
            "per_capita": 0.02
          }
        }
      },
      {
        "code": "KR",
        "name": "Crotone",
        "region_code": "18",
        "region_name": "Calabria",
        "population": 161000,
        "values": {
          "production": {
            "absolute": 13882,
            "per_capita": 0.09
          },
          "gdp": {
            "absolute": 6934,
            "per_capita": 0.04
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 6826,
            "per_capita": 0.04
          }
        }
      },
      {
        "code": "AG",
        "name": "Agrigento",
        "region_code": "19",
        "region_name": "Sicilia",
        "population": 415000,
        "values": {
          "production": {
            "absolute": 13727,
            "per_capita": 0.03
          },
          "gdp": {
            "absolute": 8680,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 8648,
            "per_capita": 0.02
          }
        }
      },
      {
        "code": "SR",
        "name": "Siracusa",
        "region_code": "19",
        "region_name": "Sicilia",
        "population": 380000,
        "values": {
          "production": {
            "absolute": 13178,
            "per_capita": 0.03
          },
          "gdp": {
            "absolute": 6242,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 6105,
            "per_capita": 0.02
          }
        }
      },
      {
        "code": "CL",
        "name": "Caltanissetta",
        "region_code": "19",
        "region_name": "Sicilia",
        "population": 251000,
        "values": {
          "production": {
            "absolute": 11393,
            "per_capita": 0.05
          },
          "gdp": {
            "absolute": 6389,
            "per_capita": 0.03
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 6325,
            "per_capita": 0.03
          }
        }
      },
      {
        "code": "RG",
        "name": "Ragusa",
        "region_code": "19",
        "region_name": "Sicilia",
        "population": 311000,
        "values": {
          "production": {
            "absolute": 10654,
            "per_capita": 0.03
          },
          "gdp": {
            "absolute": 6980,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 7062,
            "per_capita": 0.02
          }
        }
      },
      {
        "code": "VV",
        "name": "Vibo Valentia",
        "region_code": "18",
        "region_name": "Calabria",
        "population": 148000,
        "values": {
          "production": {
            "absolute": 9866,
            "per_capita": 0.07
          },
          "gdp": {
            "absolute": 4631,
            "per_capita": 0.03
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 4636,
            "per_capita": 0.03
          }
        }
      },
      {
        "code": "EN",
        "name": "Enna",
        "region_code": "19",
        "region_name": "Sicilia",
        "population": 156000,
        "values": {
          "production": {
            "absolute": 7445,
            "per_capita": 0.05
          },
          "gdp": {
            "absolute": 3670,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 3627,
            "per_capita": 0.02
          }
        }
      }
    ],
    "macro_split": {
      "origin": {
        "value": 563014519,
        "pct": 0.44
      },
      "rest_of_region": {
        "value": 67705084,
        "pct": 0.05
      },
      "extra_region": {
        "value": 635787780,
        "pct": 0.5
      }
    }
  },
  "sectors": {
    "items": [
      {
        "ateco_code": "327",
        "ateco_name": "Costruzioni",
        "values": {
          "gdp": {
            "intra": 148363392,
            "extra": 17334970
          },
          "production": {
            "intra": 403189283,
            "extra": 61983059
          },
          "employment": {
            "intra": 94.1,
            "extra": 11
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 148363392,
                "production": 403189283,
                "employment": 94.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 5260318,
                "production": 18209075,
                "employment": 3.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 7391490,
                "production": 25686447,
                "employment": 4.7
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 2381123,
                "production": 9839530,
                "employment": 1.5
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 1743036,
                "production": 6577445,
                "employment": 1.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 281147,
                "production": 885405,
                "employment": 0.2
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 64560,
                "production": 166695,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 36733,
                "production": 88741,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 35264,
                "production": 114627,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 27988,
                "production": 96029,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 47745,
                "production": 146810,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 20964,
                "production": 63186,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 17669,
                "production": 49331,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 8331,
                "production": 15790,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 10709,
                "production": 24075,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 3590,
                "production": 7899,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 2020,
                "production": 6964,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 753,
                "production": 1474,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 1067,
                "production": 2561,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 465,
                "production": 973,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "344",
        "ateco_name": "Attività immobiliari",
        "values": {
          "gdp": {
            "intra": 22658578,
            "extra": 47326582
          },
          "production": {
            "intra": 25433401,
            "extra": 53953108
          },
          "employment": {
            "intra": 0.3,
            "extra": 0.7
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 22658578,
                "production": 25433401,
                "employment": 0.3
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 16872971,
                "production": 19135069,
                "employment": 0.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 8803772,
                "production": 10099263,
                "employment": 0.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 6282349,
                "production": 7289575,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 5331605,
                "production": 6059329,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 4676688,
                "production": 5251016,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 1139765,
                "production": 1283191,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1076148,
                "production": 1181964,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 950417,
                "production": 1090138,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 731836,
                "production": 873771,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 301066,
                "production": 351906,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 494928,
                "production": 563732,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 221409,
                "production": 264967,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 247531,
                "production": 280447,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 107942,
                "production": 122683,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 42444,
                "production": 48426,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 20336,
                "production": 27880,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 14338,
                "production": 15982,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 5069,
                "production": 6846,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 5967,
                "production": 6920,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "329",
        "ateco_name": "Commercio all'ingrosso",
        "values": {
          "gdp": {
            "intra": 2963999,
            "extra": 14015354
          },
          "production": {
            "intra": 39926707,
            "extra": 24544557
          },
          "employment": {
            "intra": 1.5,
            "extra": 7.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 2963999,
                "production": 39926707,
                "employment": 1.5
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 7176469,
                "production": 10496967,
                "employment": 3.6
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 2328663,
                "production": 4959145,
                "employment": 1.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 1744017,
                "production": 3753414,
                "employment": 0.9
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 1141875,
                "production": 2196331,
                "employment": 0.6
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 895181,
                "production": 1819796,
                "employment": 0.5
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 194734,
                "production": 256054,
                "employment": 0.1
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 149256,
                "production": 236790,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 113592,
                "production": 280830,
                "employment": 0.1
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 71305,
                "production": 214183,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 19637,
                "production": 22021,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 51103,
                "production": 67532,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 27280,
                "production": 32632,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 26697,
                "production": 72547,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 49022,
                "production": 90550,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 15537,
                "production": 22393,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 2840,
                "production": 5829,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 4463,
                "production": 12141,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 1571,
                "production": 1748,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 2114,
                "production": 3654,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "336",
        "ateco_name": "Alloggio e ristorazione",
        "values": {
          "gdp": {
            "intra": 8338089,
            "extra": 12581587
          },
          "production": {
            "intra": 14790449,
            "extra": 28157275
          },
          "employment": {
            "intra": 5.5,
            "extra": 8.3
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 8338089,
                "production": 14790449,
                "employment": 5.5
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 4789742,
                "production": 11027175,
                "employment": 3.2
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 3039456,
                "production": 6598937,
                "employment": 2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 1501301,
                "production": 3764720,
                "employment": 1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 1463917,
                "production": 3403203,
                "employment": 1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 715304,
                "production": 1507745,
                "employment": 0.5
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 314273,
                "production": 491953,
                "employment": 0.2
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 198984,
                "production": 299920,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 102119,
                "production": 235852,
                "employment": 0.1
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 105897,
                "production": 206042,
                "employment": 0.1
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 127949,
                "production": 243641,
                "employment": 0.1
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 59077,
                "production": 122117,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 40361,
                "production": 79164,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 63249,
                "production": 81160,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 31572,
                "production": 51075,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 14917,
                "production": 21655,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 3909,
                "production": 8430,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 4432,
                "production": 6066,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 2202,
                "production": 4233,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 2926,
                "production": 4188,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "345",
        "ateco_name": "Attività legali",
        "values": {
          "gdp": {
            "intra": 2665824,
            "extra": 17078170
          },
          "production": {
            "intra": 4697974,
            "extra": 30479621
          },
          "employment": {
            "intra": 1,
            "extra": 6.5
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 2665824,
                "production": 4697974,
                "employment": 1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 7797102,
                "production": 13020348,
                "employment": 3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 4119463,
                "production": 7301977,
                "employment": 1.6
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 1889717,
                "production": 3753104,
                "employment": 0.7
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 1735330,
                "production": 3470104,
                "employment": 0.7
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 819860,
                "production": 1548863,
                "employment": 0.3
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 141340,
                "production": 341906,
                "employment": 0.1
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 172368,
                "production": 254848,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 93410,
                "production": 163022,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 74233,
                "production": 140913,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 69621,
                "production": 203888,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 59312,
                "production": 108545,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 28755,
                "production": 56705,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 19940,
                "production": 30890,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 36941,
                "production": 51645,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 11027,
                "production": 15315,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 3096,
                "production": 7851,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 2930,
                "production": 4019,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 1638,
                "production": 2878,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 2086,
                "production": 2798,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "33",
        "ateco_name": "Commercio al dettaglio",
        "values": {
          "gdp": {
            "intra": 7486544,
            "extra": 10992581
          },
          "production": {
            "intra": 11379288,
            "extra": 22208480
          },
          "employment": {
            "intra": 4,
            "extra": 5.9
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 7486544,
                "production": 11379288,
                "employment": 4
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 4417990,
                "production": 10900724,
                "employment": 2.4
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 2822317,
                "production": 5601094,
                "employment": 1.5
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 1165395,
                "production": 1458598,
                "employment": 0.6
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 1033806,
                "production": 1239577,
                "employment": 0.6
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 674344,
                "production": 1560098,
                "employment": 0.4
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 156463,
                "production": 266875,
                "employment": 0.1
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 207879,
                "production": 464472,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 109926,
                "production": 126116,
                "employment": 0.1
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 97033,
                "production": 139533,
                "employment": 0.1
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 59143,
                "production": 130629,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 71573,
                "production": 95069,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 44538,
                "production": 59891,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 51388,
                "production": 67491,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 45032,
                "production": 54818,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 18636,
                "production": 24906,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 4964,
                "production": 5130,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 5692,
                "production": 6442,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 2699,
                "production": 2790,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 3763,
                "production": 4227,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "331",
        "ateco_name": "Trasporto terrestre",
        "values": {
          "gdp": {
            "intra": 2273188,
            "extra": 10570692
          },
          "production": {
            "intra": 6564899,
            "extra": 26474980
          },
          "employment": {
            "intra": 1.3,
            "extra": 6.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 2273188,
                "production": 6564899,
                "employment": 1.3
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 4503326,
                "production": 11221727,
                "employment": 2.7
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 2639151,
                "production": 6242740,
                "employment": 1.6
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 1346779,
                "production": 4296608,
                "employment": 0.8
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 763057,
                "production": 2039855,
                "employment": 0.4
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 647675,
                "production": 1427612,
                "employment": 0.4
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 146266,
                "production": 257935,
                "employment": 0.1
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 170709,
                "production": 284154,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 65144,
                "production": 130787,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 69689,
                "production": 167608,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 48071,
                "production": 113044,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 58311,
                "production": 106724,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 25414,
                "production": 51596,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 25974,
                "production": 40536,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 39116,
                "production": 58471,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 11824,
                "production": 17703,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 3366,
                "production": 7150,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 2481,
                "production": 3923,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 2318,
                "production": 3871,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 2019,
                "production": 2935,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "353",
        "ateco_name": "Servizi di vigilanza",
        "values": {
          "gdp": {
            "intra": 1645957,
            "extra": 12377662
          },
          "production": {
            "intra": 4487252,
            "extra": 28216071
          },
          "employment": {
            "intra": 1.4,
            "extra": 10.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 1645957,
                "production": 4487252,
                "employment": 1.4
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 6303220,
                "production": 12653711,
                "employment": 5.2
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 3099046,
                "production": 7288131,
                "employment": 2.5
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 1171620,
                "production": 3408002,
                "employment": 1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 979393,
                "production": 2839639,
                "employment": 0.8
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 395522,
                "production": 1028445,
                "employment": 0.3
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 80883,
                "production": 220254,
                "employment": 0.1
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 137063,
                "production": 211132,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 37119,
                "production": 111254,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 49508,
                "production": 120491,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 42958,
                "production": 151245,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 23271,
                "production": 65993,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 15912,
                "production": 40922,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 14893,
                "production": 25398,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 16996,
                "production": 30456,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 5291,
                "production": 9400,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 1602,
                "production": 5257,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1418,
                "production": 2408,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 938,
                "production": 2161,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 1009,
                "production": 1771,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "334",
        "ateco_name": "Magazzinaggio",
        "values": {
          "gdp": {
            "intra": 2359790,
            "extra": 10370969
          },
          "production": {
            "intra": 4392055,
            "extra": 22751258
          },
          "employment": {
            "intra": 1.5,
            "extra": 6.4
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 2359790,
                "production": 4392055,
                "employment": 1.5
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 5628970,
                "production": 11758580,
                "employment": 3.5
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1792082,
                "production": 4321228,
                "employment": 1.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 1667186,
                "production": 3415074,
                "employment": 1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 560506,
                "production": 1536618,
                "employment": 0.3
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 415863,
                "production": 858922,
                "employment": 0.3
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 42200,
                "production": 163644,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 116957,
                "production": 252182,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 21556,
                "production": 85936,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 49806,
                "production": 114447,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 17705,
                "production": 94566,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 19747,
                "production": 59702,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 8131,
                "production": 31112,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 9895,
                "production": 16722,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 13818,
                "production": 24937,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 3779,
                "production": 7765,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 793,
                "production": 5126,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 938,
                "production": 1837,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 580,
                "production": 1815,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 458,
                "production": 1045,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "341",
        "ateco_name": "Servizi finanziari",
        "values": {
          "gdp": {
            "intra": 1263366,
            "extra": 15469233
          },
          "production": {
            "intra": 2245966,
            "extra": 23479472
          },
          "employment": {
            "intra": 0.9,
            "extra": 10.9
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 1263366,
                "production": 2245966,
                "employment": 0.9
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 6006997,
                "production": 8385918,
                "employment": 4.2
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1937540,
                "production": 3070563,
                "employment": 1.4
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 1805819,
                "production": 2898360,
                "employment": 1.3
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 1399113,
                "production": 2310336,
                "employment": 1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 1457040,
                "production": 2369349,
                "employment": 1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 488029,
                "production": 743293,
                "employment": 0.3
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1002151,
                "production": 1307744,
                "employment": 0.7
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 338931,
                "production": 593236,
                "employment": 0.2
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 319070,
                "production": 540478,
                "employment": 0.2
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 48301,
                "production": 119705,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 153016,
                "production": 283986,
                "employment": 0.1
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 127149,
                "production": 243343,
                "employment": 0.1
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 164083,
                "production": 261926,
                "employment": 0.1
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 111655,
                "production": 171537,
                "employment": 0.1
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 57261,
                "production": 82237,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 12526,
                "production": 34827,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 21878,
                "production": 30730,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 8983,
                "production": 16737,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 9691,
                "production": 15167,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "305",
        "ateco_name": "Industrie alimentari",
        "values": {
          "gdp": {
            "intra": 1570283,
            "extra": 3790514
          },
          "production": {
            "intra": 5136517,
            "extra": 20261291
          },
          "employment": {
            "intra": 1.1,
            "extra": 2.6
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 1570283,
                "production": 5136517,
                "employment": 1.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1220248,
                "production": 6912466,
                "employment": 0.8
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1020668,
                "production": 4567968,
                "employment": 0.7
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 764479,
                "production": 2974282,
                "employment": 0.5
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 244109,
                "production": 3086027,
                "employment": 0.2
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 292068,
                "production": 1584079,
                "employment": 0.2
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 66900,
                "production": 221446,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 27421,
                "production": 95419,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 36377,
                "production": 328638,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 26585,
                "production": 105135,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 12804,
                "production": 42450,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 25469,
                "production": 133801,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 18370,
                "production": 94997,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 11524,
                "production": 27860,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 12772,
                "production": 49758,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 5730,
                "production": 20755,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 2000,
                "production": 7716,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1296,
                "production": 3339,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 1025,
                "production": 3245,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 669,
                "production": 1908,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "324",
        "ateco_name": "Energia elettrica e gas",
        "values": {
          "gdp": {
            "intra": 891278,
            "extra": 6615185
          },
          "production": {
            "intra": 3296539,
            "extra": 21523114
          },
          "employment": {
            "intra": 0.2,
            "extra": 1.6
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 891278,
                "production": 3296539,
                "employment": 0.2
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 2328727,
                "production": 6608249,
                "employment": 0.6
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1049254,
                "production": 3375341,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 612877,
                "production": 2611677,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 574860,
                "production": 2542260,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 564972,
                "production": 2203784,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 452506,
                "production": 933206,
                "employment": 0.1
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 312381,
                "production": 731208,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 100533,
                "production": 503439,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 138257,
                "production": 534934,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 134022,
                "production": 286601,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 96380,
                "production": 330899,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 49717,
                "production": 250203,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 86707,
                "production": 234291,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 53790,
                "production": 177742,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 28043,
                "production": 85258,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 8166,
                "production": 39654,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 10291,
                "production": 28663,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 6601,
                "production": 22962,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 7100,
                "production": 22743,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "316",
        "ateco_name": "Prodotti in metallo",
        "values": {
          "gdp": {
            "intra": 2088390,
            "extra": 3779568
          },
          "production": {
            "intra": 11325336,
            "extra": 11189777
          },
          "employment": {
            "intra": 1.6,
            "extra": 2.9
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 2088390,
                "production": 11325336,
                "employment": 1.6
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1491632,
                "production": 4961229,
                "employment": 1.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1265027,
                "production": 3140133,
                "employment": 1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 537831,
                "production": 1668165,
                "employment": 0.4
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 182384,
                "production": 605388,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 202561,
                "production": 533544,
                "employment": 0.2
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 17585,
                "production": 46034,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 7387,
                "production": 22109,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 25403,
                "production": 67664,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 28140,
                "production": 86172,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 2089,
                "production": 7831,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 8553,
                "production": 19829,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 6163,
                "production": 21444,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 936,
                "production": 1741,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 2579,
                "production": 5367,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 613,
                "production": 1084,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 301,
                "production": 1211,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 126,
                "production": 355,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 192,
                "production": 370,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 63,
                "production": 107,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "314",
        "ateco_name": "Minerali non metalliferi",
        "values": {
          "gdp": {
            "intra": 1444333,
            "extra": 2433088
          },
          "production": {
            "intra": 8207946,
            "extra": 10931515
          },
          "employment": {
            "intra": 1.1,
            "extra": 1.8
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 1444333,
                "production": 8207946,
                "employment": 1.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 456252,
                "production": 2433250,
                "employment": 0.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1182425,
                "production": 6200133,
                "employment": 0.9
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 443570,
                "production": 1348199,
                "employment": 0.3
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 197916,
                "production": 465415,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 101553,
                "production": 303734,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 10631,
                "production": 28572,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 5747,
                "production": 11931,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 7685,
                "production": 24663,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 10858,
                "production": 44521,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1796,
                "production": 30135,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 6820,
                "production": 22414,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 4240,
                "production": 9402,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1176,
                "production": 2850,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1200,
                "production": 2937,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 510,
                "production": 1614,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 317,
                "production": 894,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 127,
                "production": 218,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 197,
                "production": 509,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 66,
                "production": 122,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "31",
        "ateco_name": "Fabbricazione coke e raffinazione",
        "values": {
          "gdp": {
            "intra": 462788,
            "extra": 243203
          },
          "production": {
            "intra": 9141881,
            "extra": 8787388
          },
          "employment": {
            "intra": 0.3,
            "extra": 0.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 462788,
                "production": 9141881,
                "employment": 0.3
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 117297,
                "production": 4042846,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 80968,
                "production": 2954988,
                "employment": 0.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 8107,
                "production": 641060,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 17690,
                "production": 549079,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 9168,
                "production": 331353,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 1104,
                "production": 49507,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 2998,
                "production": 57797,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 2347,
                "production": 60464,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 138,
                "production": 19784,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 521,
                "production": 10721,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 603,
                "production": 21712,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 413,
                "production": 13168,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 737,
                "production": 12673,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 573,
                "production": 10791,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 207,
                "production": 3874,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 30,
                "production": 2419,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 233,
                "production": 3839,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 27,
                "production": 564,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 42,
                "production": 749,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "346",
        "ateco_name": "Ingegneria e architettura",
        "values": {
          "gdp": {
            "intra": 803938,
            "extra": 6898848
          },
          "production": {
            "intra": 1449363,
            "extra": 13566928
          },
          "employment": {
            "intra": 0.3,
            "extra": 2.4
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 803938,
                "production": 1449363,
                "employment": 0.3
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 3631421,
                "production": 6390051,
                "employment": 1.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1649158,
                "production": 3408094,
                "employment": 0.6
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 654634,
                "production": 1782523,
                "employment": 0.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 513238,
                "production": 1030829,
                "employment": 0.2
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 244997,
                "production": 555720,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 48006,
                "production": 89462,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 46684,
                "production": 67099,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 29754,
                "production": 62780,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 20768,
                "production": 54435,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 23406,
                "production": 56744,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 16273,
                "production": 32017,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 7811,
                "production": 17864,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 3474,
                "production": 4977,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 5560,
                "production": 8442,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1713,
                "production": 2630,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 805,
                "production": 1485,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 377,
                "production": 533,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 493,
                "production": 852,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 276,
                "production": 391,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "34",
        "ateco_name": "Consulenza informatica",
        "values": {
          "gdp": {
            "intra": 661089,
            "extra": 6616258
          },
          "production": {
            "intra": 1688475,
            "extra": 12855963
          },
          "employment": {
            "intra": 0.5,
            "extra": 4.7
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 661089,
                "production": 1688475,
                "employment": 0.5
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 3453935,
                "production": 5906429,
                "employment": 2.5
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1339010,
                "production": 2767326,
                "employment": 1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 730129,
                "production": 1682273,
                "employment": 0.5
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 466482,
                "production": 1192224,
                "employment": 0.3
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 320012,
                "production": 679459,
                "employment": 0.2
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 70590,
                "production": 136548,
                "employment": 0.1
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 77438,
                "production": 121451,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 36910,
                "production": 89014,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 31361,
                "production": 72885,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 39694,
                "production": 88397,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 19779,
                "production": 47810,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 10848,
                "production": 30159,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 4044,
                "production": 8006,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 10165,
                "production": 19708,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 2741,
                "production": 5973,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 1088,
                "production": 4171,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 550,
                "production": 1121,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 1002,
                "production": 2049,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 479,
                "production": 960,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "328",
        "ateco_name": "Commercio veicoli",
        "values": {
          "gdp": {
            "intra": 1019965,
            "extra": 3607297
          },
          "production": {
            "intra": 3338867,
            "extra": 9917744
          },
          "employment": {
            "intra": 0.6,
            "extra": 2.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 1019965,
                "production": 3338867,
                "employment": 0.6
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1358726,
                "production": 3568853,
                "employment": 0.8
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 974270,
                "production": 2844923,
                "employment": 0.6
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 510131,
                "production": 1479702,
                "employment": 0.3
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 362224,
                "production": 1034113,
                "employment": 0.2
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 201096,
                "production": 504046,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 40457,
                "production": 104706,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 43250,
                "production": 82607,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 29791,
                "production": 69942,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 20256,
                "production": 64137,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 13291,
                "production": 46751,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 19842,
                "production": 44649,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 8984,
                "production": 24021,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 8990,
                "production": 14968,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 8746,
                "production": 19151,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 3728,
                "production": 7017,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 986,
                "production": 3614,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1120,
                "production": 1676,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 650,
                "production": 1664,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 760,
                "production": 1206,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "332",
        "ateco_name": "Trasporto marittimo",
        "values": {
          "gdp": {
            "intra": 7134661,
            "extra": 97214
          },
          "production": {
            "intra": 11306916,
            "extra": 1596165
          },
          "employment": {
            "intra": 4.6,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 7134661,
                "production": 11306916,
                "employment": 4.6
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 23318,
                "production": 606755,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 13358,
                "production": 416935,
                "employment": 0
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 14709,
                "production": 216451,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 18045,
                "production": 192817,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 19074,
                "production": 91160,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 83,
                "production": 10776,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1186,
                "production": 10292,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 1927,
                "production": 12931,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2292,
                "production": 11928,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 0,
                "production": 7081,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 14,
                "production": 5257,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 3,
                "production": 3946,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1197,
                "production": 3124,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1445,
                "production": 4022,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 68,
                "production": 757,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 13,
                "production": 701,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 465,
                "production": 861,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 0,
                "production": 198,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 20,
                "production": 172,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "32",
        "ateco_name": "Autoveicoli e rimorchi",
        "values": {
          "gdp": {
            "intra": 417434,
            "extra": 1236585
          },
          "production": {
            "intra": 6158552,
            "extra": 5883018
          },
          "employment": {
            "intra": 0.3,
            "extra": 0.9
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 417434,
                "production": 6158552,
                "employment": 0.3
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 179207,
                "production": 1297503,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 832836,
                "production": 2912213,
                "employment": 0.6
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 133263,
                "production": 591085,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 37749,
                "production": 732232,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 21944,
                "production": 171165,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 7601,
                "production": 31191,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 3448,
                "production": 19252,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 3353,
                "production": 33977,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2279,
                "production": 43664,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1400,
                "production": 3503,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1849,
                "production": 9931,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 6296,
                "production": 18757,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 23,
                "production": 485,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 2706,
                "production": 10238,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 720,
                "production": 2657,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 799,
                "production": 2218,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 29,
                "production": 163,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 1079,
                "production": 2725,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 3,
                "production": 59,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "313",
        "ateco_name": "Articoli gomma o plastica",
        "values": {
          "gdp": {
            "intra": 582223,
            "extra": 2675207
          },
          "production": {
            "intra": 2678615,
            "extra": 9008595
          },
          "employment": {
            "intra": 0.4,
            "extra": 2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 582223,
                "production": 2678615,
                "employment": 0.4
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 820153,
                "production": 2675005,
                "employment": 0.6
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1371391,
                "production": 4004176,
                "employment": 1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 235195,
                "production": 1143421,
                "employment": 0.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 81463,
                "production": 579497,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 111713,
                "production": 402695,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 11109,
                "production": 44046,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 2943,
                "production": 18769,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 19361,
                "production": 52938,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 11555,
                "production": 41315,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 942,
                "production": 5960,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 2588,
                "production": 14784,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 4187,
                "production": 15349,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 386,
                "production": 2243,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1354,
                "production": 4342,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 450,
                "production": 1587,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 177,
                "production": 1436,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 73,
                "production": 326,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 129,
                "production": 532,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 38,
                "production": 175,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "319",
        "ateco_name": "Macchinari vari",
        "values": {
          "gdp": {
            "intra": 452497,
            "extra": 2439061
          },
          "production": {
            "intra": 1947875,
            "extra": 9435857
          },
          "employment": {
            "intra": 0.4,
            "extra": 2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 452497,
                "production": 1947875,
                "employment": 0.4
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 702415,
                "production": 2371880,
                "employment": 0.6
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 936988,
                "production": 4551859,
                "employment": 0.8
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 583317,
                "production": 1813004,
                "employment": 0.5
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 58314,
                "production": 217312,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 119319,
                "production": 316730,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 9722,
                "production": 41673,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1087,
                "production": 8618,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 9812,
                "production": 26917,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 11918,
                "production": 32891,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 340,
                "production": 10095,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 2630,
                "production": 9938,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2011,
                "production": 20671,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 23,
                "production": 78,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 666,
                "production": 5762,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 239,
                "production": 1286,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 132,
                "production": 4593,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 12,
                "production": 51,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 112,
                "production": 2487,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 4,
                "production": 11,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "326",
        "ateco_name": "Gestione rifiuti",
        "values": {
          "gdp": {
            "intra": 381818,
            "extra": 3000382
          },
          "production": {
            "intra": 1089799,
            "extra": 10212507
          },
          "employment": {
            "intra": 0.3,
            "extra": 2.5
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 381818,
                "production": 1089799,
                "employment": 0.3
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 971505,
                "production": 3371938,
                "employment": 0.8
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 456204,
                "production": 1542684,
                "employment": 0.4
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 342423,
                "production": 1451651,
                "employment": 0.3
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 393055,
                "production": 1245167,
                "employment": 0.3
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 365646,
                "production": 1283556,
                "employment": 0.3
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 78212,
                "production": 300240,
                "employment": 0.1
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 113156,
                "production": 237702,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 64464,
                "production": 204494,
                "employment": 0.1
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 53184,
                "production": 174510,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 15430,
                "production": 58147,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 45491,
                "production": 131527,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 28793,
                "production": 70014,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 37658,
                "production": 68504,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 21886,
                "production": 42968,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 6886,
                "production": 14341,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 2020,
                "production": 6790,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1825,
                "production": 3267,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 1300,
                "production": 2758,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 1244,
                "production": 2249,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "349",
        "ateco_name": "Servizi professionali",
        "values": {
          "gdp": {
            "intra": 627998,
            "extra": 5526842
          },
          "production": {
            "intra": 1314693,
            "extra": 9848415
          },
          "employment": {
            "intra": 0.2,
            "extra": 1.7
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 627998,
                "production": 1314693,
                "employment": 0.2
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 2697362,
                "production": 4525452,
                "employment": 0.8
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1304993,
                "production": 2360726,
                "employment": 0.4
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 657554,
                "production": 1269489,
                "employment": 0.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 449681,
                "production": 898601,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 225706,
                "production": 431097,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 43732,
                "production": 81750,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 40428,
                "production": 64215,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 28582,
                "production": 53618,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 25621,
                "production": 48123,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 17403,
                "production": 45733,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 15167,
                "production": 28025,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 6196,
                "production": 14887,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 4796,
                "production": 7735,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 5855,
                "production": 10939,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1932,
                "production": 3672,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 632,
                "production": 2101,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 537,
                "production": 921,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 358,
                "production": 738,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 307,
                "production": 592,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "342",
        "ateco_name": "Assicurazioni",
        "values": {
          "gdp": {
            "intra": 560805,
            "extra": 3274787
          },
          "production": {
            "intra": 2058242,
            "extra": 8875201
          },
          "employment": {
            "intra": 0.3,
            "extra": 1.6
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 560805,
                "production": 2058242,
                "employment": 0.3
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1708505,
                "production": 3413174,
                "employment": 0.8
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 421280,
                "production": 1388327,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 290808,
                "production": 1070578,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 87417,
                "production": 840225,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 321189,
                "production": 794646,
                "employment": 0.2
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 62781,
                "production": 242763,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 136307,
                "production": 282938,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 14409,
                "production": 120034,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 198777,
                "production": 369187,
                "employment": 0.1
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1338,
                "production": 74309,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 7729,
                "production": 91114,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 6158,
                "production": 68062,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 8012,
                "production": 63201,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 6419,
                "production": 31568,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1603,
                "production": 8422,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 755,
                "production": 10474,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 660,
                "production": 2353,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 235,
                "production": 2116,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 404,
                "production": 1712,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "315",
        "ateco_name": "Attività  metallurgiche",
        "values": {
          "gdp": {
            "intra": 404221,
            "extra": 947675
          },
          "production": {
            "intra": 2949695,
            "extra": 7513236
          },
          "employment": {
            "intra": 0.4,
            "extra": 0.9
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 404221,
                "production": 2949695,
                "employment": 0.4
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 363012,
                "production": 2866639,
                "employment": 0.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 396850,
                "production": 2837939,
                "employment": 0.4
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 85844,
                "production": 917806,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 28222,
                "production": 324317,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 47441,
                "production": 375181,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 2591,
                "production": 28141,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 673,
                "production": 6860,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 3786,
                "production": 36108,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 9277,
                "production": 63663,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 4496,
                "production": 20624,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3692,
                "production": 21126,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 712,
                "production": 7715,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 268,
                "production": 1538,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 342,
                "production": 2683,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 370,
                "production": 1744,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 43,
                "production": 666,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 9,
                "production": 103,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 44,
                "production": 318,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 5,
                "production": 64,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "339",
        "ateco_name": "Telecomunicazioni",
        "values": {
          "gdp": {
            "intra": 632824,
            "extra": 3023878
          },
          "production": {
            "intra": 1993291,
            "extra": 7173495
          },
          "employment": {
            "intra": 0.2,
            "extra": 1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 632824,
                "production": 1993291,
                "employment": 0.2
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1654504,
                "production": 3305683,
                "employment": 0.6
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 659219,
                "production": 1754110,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 209449,
                "production": 752901,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 201410,
                "production": 626674,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 111119,
                "production": 329388,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 21865,
                "production": 64133,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 103633,
                "production": 146353,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 13448,
                "production": 43736,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 11064,
                "production": 40527,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 6777,
                "production": 35416,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 5898,
                "production": 23160,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 6315,
                "production": 16981,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 5220,
                "production": 9637,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 9406,
                "production": 15177,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 2370,
                "production": 4339,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 494,
                "production": 2108,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 968,
                "production": 1569,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 285,
                "production": 781,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 434,
                "production": 822,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "301",
        "ateco_name": "Produzioni agricole",
        "values": {
          "gdp": {
            "intra": 441208,
            "extra": 3811497
          },
          "production": {
            "intra": 1029590,
            "extra": 7958326
          },
          "employment": {
            "intra": 0.2,
            "extra": 1.4
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 441208,
                "production": 1029590,
                "employment": 0.2
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 658580,
                "production": 1717918,
                "employment": 0.2
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 793267,
                "production": 1512755,
                "employment": 0.3
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 595821,
                "production": 1278141,
                "employment": 0.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 362125,
                "production": 826916,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 424135,
                "production": 905433,
                "employment": 0.2
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 216131,
                "production": 358762,
                "employment": 0.1
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 171552,
                "production": 275657,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 98656,
                "production": 227377,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 96848,
                "production": 194414,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 20371,
                "production": 45688,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 51528,
                "production": 105416,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 55447,
                "production": 112018,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 126848,
                "production": 179333,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 53273,
                "production": 85486,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 45076,
                "production": 64710,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 11442,
                "production": 22881,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 11594,
                "production": 17301,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 7068,
                "production": 11522,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 11736,
                "production": 16600,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "343",
        "ateco_name": "Servizi finanziari ausiliari",
        "values": {
          "gdp": {
            "intra": 488863,
            "extra": 4961410
          },
          "production": {
            "intra": 748251,
            "extra": 8204522
          },
          "employment": {
            "intra": 0.2,
            "extra": 2.3
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 488863,
                "production": 748251,
                "employment": 0.2
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1749427,
                "production": 2957480,
                "employment": 0.8
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 674998,
                "production": 1089330,
                "employment": 0.3
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 500516,
                "production": 921042,
                "employment": 0.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 415422,
                "production": 688449,
                "employment": 0.2
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 591293,
                "production": 969634,
                "employment": 0.3
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 106122,
                "production": 185385,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 350490,
                "production": 478136,
                "employment": 0.2
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 111371,
                "production": 186325,
                "employment": 0.1
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 106875,
                "production": 184059,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 17455,
                "production": 31357,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 72046,
                "production": 117456,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 54391,
                "production": 88403,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 60555,
                "production": 88617,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 79326,
                "production": 114437,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 34330,
                "production": 51036,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 8960,
                "production": 14761,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 16010,
                "production": 21940,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 4579,
                "production": 6897,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 7244,
                "production": 9777,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "311",
        "ateco_name": "Prodotti chimici",
        "values": {
          "gdp": {
            "intra": 226902,
            "extra": 1615514
          },
          "production": {
            "intra": 1163920,
            "extra": 7656429
          },
          "employment": {
            "intra": 0.2,
            "extra": 1.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 226902,
                "production": 1163920,
                "employment": 0.2
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 849495,
                "production": 4004374,
                "employment": 0.6
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 504777,
                "production": 2183667,
                "employment": 0.3
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 122398,
                "production": 678185,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 54838,
                "production": 372226,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 59734,
                "production": 287524,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 7804,
                "production": 32292,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 4007,
                "production": 34853,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 4458,
                "production": 22731,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 3224,
                "production": 15358,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 27,
                "production": 76,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1754,
                "production": 6719,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1495,
                "production": 11371,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 219,
                "production": 620,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 523,
                "production": 2752,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 141,
                "production": 564,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 560,
                "production": 2797,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 43,
                "production": 203,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 8,
                "production": 90,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 9,
                "production": 27,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "35",
        "ateco_name": "Noleggio e leasing",
        "values": {
          "gdp": {
            "intra": 358570,
            "extra": 3037825
          },
          "production": {
            "intra": 1088552,
            "extra": 7117359
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.7
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 358570,
                "production": 1088552,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1385411,
                "production": 2864411,
                "employment": 0.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 688024,
                "production": 1911819,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 312984,
                "production": 923838,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 351811,
                "production": 816782,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 145884,
                "production": 296172,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 49241,
                "production": 88818,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 33766,
                "production": 49963,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 10277,
                "production": 28952,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 12286,
                "production": 32956,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 22009,
                "production": 53190,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 9306,
                "production": 19884,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 4909,
                "production": 10295,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 4768,
                "production": 7809,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 4439,
                "production": 6952,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1134,
                "production": 2098,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 714,
                "production": 1855,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 428,
                "production": 672,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 242,
                "production": 569,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 191,
                "production": 326,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "362",
        "ateco_name": "Servizi personali",
        "values": {
          "gdp": {
            "intra": 2355894,
            "extra": 3267116
          },
          "production": {
            "intra": 3231615,
            "extra": 4927467
          },
          "employment": {
            "intra": 0.8,
            "extra": 1.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 2355894,
                "production": 3231615,
                "employment": 0.8
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1265696,
                "production": 1920631,
                "employment": 0.4
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 770808,
                "production": 1132260,
                "employment": 0.3
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 392165,
                "production": 631334,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 344857,
                "production": 520175,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 216791,
                "production": 314528,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 44447,
                "production": 80354,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 68022,
                "production": 83803,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 37993,
                "production": 53050,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 31521,
                "production": 48559,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 19685,
                "production": 43583,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 24434,
                "production": 33269,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 15463,
                "production": 21000,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 14382,
                "production": 17600,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 11292,
                "production": 15055,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 5046,
                "production": 6145,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 1524,
                "production": 2324,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1369,
                "production": 1706,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 687,
                "production": 914,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 936,
                "production": 1174,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "348",
        "ateco_name": "Pubblicità e marketing",
        "values": {
          "gdp": {
            "intra": 56011,
            "extra": 2200019
          },
          "production": {
            "intra": 684613,
            "extra": 7066097
          },
          "employment": {
            "intra": 0,
            "extra": 1.4
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 56011,
                "production": 684613,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1652320,
                "production": 3826546,
                "employment": 1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 281746,
                "production": 1453718,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 111864,
                "production": 740791,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 61324,
                "production": 544365,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 50542,
                "production": 264137,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 8581,
                "production": 52870,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 14587,
                "production": 44229,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 4576,
                "production": 28166,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 3656,
                "production": 31597,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1593,
                "production": 33566,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3093,
                "production": 17084,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1318,
                "production": 10584,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 961,
                "production": 4673,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 2309,
                "production": 7717,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1131,
                "production": 2951,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 98,
                "production": 1459,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 159,
                "production": 609,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 66,
                "production": 608,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 95,
                "production": 427,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "354",
        "ateco_name": "Amministrazione pubblica",
        "values": {
          "gdp": {
            "intra": 998891,
            "extra": 3979047
          },
          "production": {
            "intra": 1465078,
            "extra": 6107419
          },
          "employment": {
            "intra": 0.9,
            "extra": 3.6
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 998891,
                "production": 1465078,
                "employment": 0.9
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1587876,
                "production": 2323547,
                "employment": 1.4
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 833162,
                "production": 1350056,
                "employment": 0.7
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 515467,
                "production": 824282,
                "employment": 0.5
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 533559,
                "production": 855463,
                "employment": 0.5
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 191058,
                "production": 285596,
                "employment": 0.2
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 68557,
                "production": 96955,
                "employment": 0.1
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 65792,
                "production": 83465,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 32820,
                "production": 52172,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 30649,
                "production": 47552,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 50346,
                "production": 88366,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 22397,
                "production": 34337,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 18450,
                "production": 28221,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 8734,
                "production": 10716,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 12457,
                "production": 15892,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 2963,
                "production": 3858,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 2323,
                "production": 3795,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 998,
                "production": 1219,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 861,
                "production": 1199,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 580,
                "production": 729,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "351",
        "ateco_name": "Ricerca e selezione personale",
        "values": {
          "gdp": {
            "intra": 400829,
            "extra": 6306012
          },
          "production": {
            "intra": 526345,
            "extra": 6995680
          },
          "employment": {
            "intra": 0.5,
            "extra": 7.8
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 400829,
                "production": 526345,
                "employment": 0.5
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 2712987,
                "production": 2987094,
                "employment": 3.4
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1888237,
                "production": 2064382,
                "employment": 2.3
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 975450,
                "production": 1072480,
                "employment": 1.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 341233,
                "production": 428783,
                "employment": 0.4
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 243326,
                "production": 268528,
                "employment": 0.3
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 22673,
                "production": 28039,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 25338,
                "production": 28930,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 25177,
                "production": 28082,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 28530,
                "production": 31409,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 15826,
                "production": 25988,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 11647,
                "production": 13636,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 8288,
                "production": 9343,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 2329,
                "production": 2798,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 3043,
                "production": 3765,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1045,
                "production": 1257,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 253,
                "production": 396,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 228,
                "production": 280,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 281,
                "production": 335,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 124,
                "production": 153,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "356",
        "ateco_name": "Servizi sanitari",
        "values": {
          "gdp": {
            "intra": 1127566,
            "extra": 2318693
          },
          "production": {
            "intra": 1838193,
            "extra": 4975810
          },
          "employment": {
            "intra": 0.9,
            "extra": 1.9
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 1127566,
                "production": 1838193,
                "employment": 0.9
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1013483,
                "production": 1911655,
                "employment": 0.8
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 450297,
                "production": 1052477,
                "employment": 0.4
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 278373,
                "production": 616626,
                "employment": 0.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 236791,
                "production": 773617,
                "employment": 0.2
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 111638,
                "production": 190684,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 33152,
                "production": 84704,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 73867,
                "production": 111967,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 21842,
                "production": 39805,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 17876,
                "production": 33283,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 18785,
                "production": 44375,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 12514,
                "production": 26539,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 14624,
                "production": 33867,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 9933,
                "production": 16799,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 15065,
                "production": 20803,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 4869,
                "production": 7328,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 2254,
                "production": 5402,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1768,
                "production": 2542,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 730,
                "production": 2151,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 833,
                "production": 1187,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "322",
        "ateco_name": "Mobili e manifattura",
        "values": {
          "gdp": {
            "intra": 364597,
            "extra": 1271435
          },
          "production": {
            "intra": 2347029,
            "extra": 4183838
          },
          "employment": {
            "intra": 0.3,
            "extra": 0.9
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 364597,
                "production": 2347029,
                "employment": 0.3
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 341789,
                "production": 1306224,
                "employment": 0.2
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 587028,
                "production": 1540561,
                "employment": 0.4
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 83567,
                "production": 481116,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 86916,
                "production": 403372,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 110227,
                "production": 283501,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 8057,
                "production": 25120,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 3919,
                "production": 14102,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 22373,
                "production": 48581,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 18150,
                "production": 46970,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1019,
                "production": 5250,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3663,
                "production": 12532,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2219,
                "production": 7418,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 535,
                "production": 2139,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 908,
                "production": 3645,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 697,
                "production": 1771,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 112,
                "production": 653,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 76,
                "production": 284,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 133,
                "production": 455,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 48,
                "production": 146,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "358",
        "ateco_name": "Attività artistiche",
        "values": {
          "gdp": {
            "intra": 545254,
            "extra": 1720040
          },
          "production": {
            "intra": 1559936,
            "extra": 4735882
          },
          "employment": {
            "intra": 0.3,
            "extra": 0.9
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 545254,
                "production": 1559936,
                "employment": 0.3
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 786320,
                "production": 1852269,
                "employment": 0.4
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 320249,
                "production": 1076189,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 188005,
                "production": 625966,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 181063,
                "production": 550137,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 94370,
                "production": 274970,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 20534,
                "production": 72906,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 47466,
                "production": 71905,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 11325,
                "production": 37939,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 11627,
                "production": 35479,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 30020,
                "production": 67788,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 9571,
                "production": 25236,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 4601,
                "production": 15612,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 5040,
                "production": 9610,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 6435,
                "production": 11491,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1798,
                "production": 3660,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 419,
                "production": 2176,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 712,
                "production": 1150,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 261,
                "production": 836,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 226,
                "production": 561,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "359",
        "ateco_name": "Sport e intrattenimento",
        "values": {
          "gdp": {
            "intra": 893839,
            "extra": 1715104
          },
          "production": {
            "intra": 1836067,
            "extra": 4407982
          },
          "employment": {
            "intra": 0.6,
            "extra": 1.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 893839,
                "production": 1836067,
                "employment": 0.6
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 583077,
                "production": 1498065,
                "employment": 0.4
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 346592,
                "production": 999875,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 235408,
                "production": 639449,
                "employment": 0.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 322572,
                "production": 697802,
                "employment": 0.2
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 101426,
                "production": 261220,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 23404,
                "production": 74992,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 21226,
                "production": 40529,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 17814,
                "production": 41012,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 11091,
                "production": 32556,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 28059,
                "production": 66719,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 7051,
                "production": 19519,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 5835,
                "production": 13758,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 4163,
                "production": 8240,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 4408,
                "production": 7831,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1518,
                "production": 2951,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 436,
                "production": 1483,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 441,
                "production": 777,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 216,
                "production": 572,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 365,
                "production": 632,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "318",
        "ateco_name": "Apparecchiature elettriche",
        "values": {
          "gdp": {
            "intra": 468055,
            "extra": 1079914
          },
          "production": {
            "intra": 1513301,
            "extra": 4602414
          },
          "employment": {
            "intra": 0.4,
            "extra": 0.9
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 468055,
                "production": 1513301,
                "employment": 0.4
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 475802,
                "production": 1820373,
                "employment": 0.4
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 285305,
                "production": 1343960,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 153357,
                "production": 815401,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 35728,
                "production": 186916,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 98155,
                "production": 328508,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 4205,
                "production": 17919,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1031,
                "production": 3628,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 12683,
                "production": 36464,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 10705,
                "production": 38340,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 215,
                "production": 1011,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1297,
                "production": 5007,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 706,
                "production": 2773,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 18,
                "production": 84,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 507,
                "production": 1312,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 103,
                "production": 316,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 64,
                "production": 257,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 13,
                "production": 38,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 15,
                "production": 88,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 5,
                "production": 18,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "306",
        "ateco_name": "Industrie tessili",
        "values": {
          "gdp": {
            "intra": 76639,
            "extra": 1245631
          },
          "production": {
            "intra": 731771,
            "extra": 4927125
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.9
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 76639,
                "production": 731771,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 462779,
                "production": 1760802,
                "employment": 0.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 170467,
                "production": 1047004,
                "employment": 0.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 111388,
                "production": 566988,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 319664,
                "production": 839169,
                "employment": 0.2
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 123687,
                "production": 417693,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 5841,
                "production": 78121,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 2802,
                "production": 14905,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 27159,
                "production": 83504,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2865,
                "production": 43089,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 275,
                "production": 15652,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 8587,
                "production": 26945,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 4992,
                "production": 15722,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 316,
                "production": 4148,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 3376,
                "production": 8215,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1135,
                "production": 2834,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 151,
                "production": 1248,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 47,
                "production": 311,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 67,
                "production": 509,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 35,
                "production": 267,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "308",
        "ateco_name": "Fabbricazione carta",
        "values": {
          "gdp": {
            "intra": 91915,
            "extra": 1123887
          },
          "production": {
            "intra": 681651,
            "extra": 4748990
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.8
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 91915,
                "production": 681651,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 428125,
                "production": 1892140,
                "employment": 0.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 188010,
                "production": 939163,
                "employment": 0.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 99459,
                "production": 535568,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 254568,
                "production": 773149,
                "employment": 0.2
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 98733,
                "production": 381310,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 15197,
                "production": 66047,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 4167,
                "production": 20745,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 13540,
                "production": 48706,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 8570,
                "production": 34283,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 21,
                "production": 8022,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 6243,
                "production": 23734,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 4393,
                "production": 15022,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 256,
                "production": 1638,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1936,
                "production": 6154,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 396,
                "production": 1671,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 153,
                "production": 867,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 52,
                "production": 280,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 49,
                "production": 339,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 19,
                "production": 154,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "363",
        "ateco_name": "Attività  domestiche",
        "values": {
          "gdp": {
            "intra": 2674771,
            "extra": 2714594
          },
          "production": {
            "intra": 2674771,
            "extra": 2714594
          },
          "employment": {
            "intra": 3.5,
            "extra": 3.6
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 2674771,
                "production": 2674771,
                "employment": 3.5
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1086058,
                "production": 1086058,
                "employment": 1.4
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 647283,
                "production": 647283,
                "employment": 0.9
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 311868,
                "production": 311868,
                "employment": 0.4
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 265998,
                "production": 265998,
                "employment": 0.4
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 155428,
                "production": 155428,
                "employment": 0.2
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 45563,
                "production": 45563,
                "employment": 0.1
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 70103,
                "production": 70103,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 27106,
                "production": 27106,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 28851,
                "production": 28851,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 15173,
                "production": 15173,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 17685,
                "production": 17685,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 11013,
                "production": 11013,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 15374,
                "production": 15374,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 9161,
                "production": 9161,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 3673,
                "production": 3673,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 1309,
                "production": 1309,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1421,
                "production": 1421,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 698,
                "production": 698,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 831,
                "production": 831,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "323",
        "ateco_name": "Riparazione macchinari",
        "values": {
          "gdp": {
            "intra": 1128888,
            "extra": 989253
          },
          "production": {
            "intra": 2552107,
            "extra": 2632817
          },
          "employment": {
            "intra": 0.8,
            "extra": 0.7
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 1128888,
                "production": 2552107,
                "employment": 0.8
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 287827,
                "production": 694068,
                "employment": 0.2
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 340691,
                "production": 1029388,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 149704,
                "production": 378901,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 124459,
                "production": 322656,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 50886,
                "production": 123723,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 3614,
                "production": 8094,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 5336,
                "production": 11928,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 7182,
                "production": 18026,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 8164,
                "production": 18719,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 987,
                "production": 2982,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3927,
                "production": 9411,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1876,
                "production": 5699,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1600,
                "production": 3301,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1861,
                "production": 3601,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 677,
                "production": 1315,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 92,
                "production": 219,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 151,
                "production": 287,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 170,
                "production": 402,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 48,
                "production": 96,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "352",
        "ateco_name": "Agenzie di viaggio",
        "values": {
          "gdp": {
            "intra": 178631,
            "extra": 435449
          },
          "production": {
            "intra": 1509276,
            "extra": 3242548
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.3
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 178631,
                "production": 1509276,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 197149,
                "production": 1161261,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 99765,
                "production": 741811,
                "employment": 0.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 37441,
                "production": 456898,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 44159,
                "production": 471071,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 25885,
                "production": 195876,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 7364,
                "production": 45877,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 9443,
                "production": 32627,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 4601,
                "production": 33716,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2070,
                "production": 20839,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1843,
                "production": 42533,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1702,
                "production": 14038,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 767,
                "production": 9748,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1262,
                "production": 5518,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1236,
                "production": 5932,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 379,
                "production": 2021,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 86,
                "production": 1229,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 165,
                "production": 647,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 65,
                "production": 464,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 70,
                "production": 443,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "355",
        "ateco_name": "Istruzione",
        "values": {
          "gdp": {
            "intra": 739419,
            "extra": 2733028
          },
          "production": {
            "intra": 971956,
            "extra": 3452121
          },
          "employment": {
            "intra": 0.9,
            "extra": 3.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 739419,
                "production": 971956,
                "employment": 0.9
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1180566,
                "production": 1435498,
                "employment": 1.4
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 469977,
                "production": 646161,
                "employment": 0.5
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 355946,
                "production": 460040,
                "employment": 0.4
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 289677,
                "production": 391437,
                "employment": 0.3
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 125476,
                "production": 157007,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 84072,
                "production": 93452,
                "employment": 0.1
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 50251,
                "production": 57681,
                "employment": 0.1
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 15306,
                "production": 21252,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 18581,
                "production": 23203,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 90477,
                "production": 102607,
                "employment": 0.1
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 12847,
                "production": 16706,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 9516,
                "production": 12900,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 5500,
                "production": 6440,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 19118,
                "production": 20710,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 2573,
                "production": 3016,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 1078,
                "production": 1648,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1148,
                "production": 1247,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 367,
                "production": 495,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 552,
                "production": 622,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "317",
        "ateco_name": "Computer ed elettronica",
        "values": {
          "gdp": {
            "intra": 785991,
            "extra": 734242
          },
          "production": {
            "intra": 1755069,
            "extra": 2347503
          },
          "employment": {
            "intra": 0.6,
            "extra": 0.6
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 785991,
                "production": 1755069,
                "employment": 0.6
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 407090,
                "production": 1169664,
                "employment": 0.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 111182,
                "production": 494064,
                "employment": 0.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 117456,
                "production": 359527,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 37943,
                "production": 109699,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 40334,
                "production": 149625,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 2543,
                "production": 8857,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 2019,
                "production": 4451,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 6055,
                "production": 20964,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 5244,
                "production": 19628,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 340,
                "production": 1328,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1032,
                "production": 2810,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2270,
                "production": 4843,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 54,
                "production": 114,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 489,
                "production": 1297,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 54,
                "production": 187,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 75,
                "production": 306,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 47,
                "production": 87,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 11,
                "production": 41,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 3,
                "production": 10,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "309",
        "ateco_name": "Stampa e supporti registrati",
        "values": {
          "gdp": {
            "intra": 153111,
            "extra": 1026710
          },
          "production": {
            "intra": 1082421,
            "extra": 2830304
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.7
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 153111,
                "production": 1082421,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 478728,
                "production": 1259929,
                "employment": 0.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 230357,
                "production": 756882,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 115485,
                "production": 270157,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 58710,
                "production": 210668,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 84488,
                "production": 190496,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 18091,
                "production": 36430,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 12332,
                "production": 27923,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 8280,
                "production": 22730,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 3999,
                "production": 7136,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 3079,
                "production": 14392,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 6464,
                "production": 13972,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2287,
                "production": 6493,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1152,
                "production": 4057,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1944,
                "production": 5245,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 738,
                "production": 1802,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 140,
                "production": 611,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 206,
                "production": 693,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 116,
                "production": 359,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 116,
                "production": 328,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "304",
        "ateco_name": "Attività  estrattiva",
        "values": {
          "gdp": {
            "intra": 66022,
            "extra": 1492280
          },
          "production": {
            "intra": 261539,
            "extra": 3641213
          },
          "employment": {
            "intra": 0,
            "extra": 0.6
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 66022,
                "production": 261539,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 605596,
                "production": 1256569,
                "employment": 0.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 196529,
                "production": 561966,
                "employment": 0.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 172931,
                "production": 587281,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 216711,
                "production": 436359,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 86633,
                "production": 341452,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 77365,
                "production": 148622,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 36279,
                "production": 62706,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 16011,
                "production": 52631,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 15952,
                "production": 46054,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 6608,
                "production": 26523,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 18958,
                "production": 48496,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 16046,
                "production": 29408,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 21564,
                "production": 32003,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1310,
                "production": 4230,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1302,
                "production": 2399,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 991,
                "production": 2343,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 365,
                "production": 570,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 962,
                "production": 1300,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 168,
                "production": 300,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "338",
        "ateco_name": "Produzione audiovisiva",
        "values": {
          "gdp": {
            "intra": 84823,
            "extra": 1036674
          },
          "production": {
            "intra": 517506,
            "extra": 3216865
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.7
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 84823,
                "production": 517506,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 746196,
                "production": 1749735,
                "employment": 0.5
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 110990,
                "production": 571907,
                "employment": 0.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 65440,
                "production": 363376,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 32106,
                "production": 155089,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 22360,
                "production": 192042,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 8135,
                "production": 49051,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 37119,
                "production": 60566,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 3428,
                "production": 13969,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 3288,
                "production": 32587,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 2073,
                "production": 9431,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1967,
                "production": 7462,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1048,
                "production": 4516,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 595,
                "production": 1765,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1034,
                "production": 2894,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 408,
                "production": 998,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 240,
                "production": 785,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 111,
                "production": 267,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 77,
                "production": 241,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 58,
                "production": 184,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "307",
        "ateco_name": "Industria del legno",
        "values": {
          "gdp": {
            "intra": 235924,
            "extra": 744332
          },
          "production": {
            "intra": 934841,
            "extra": 2560202
          },
          "employment": {
            "intra": 0.2,
            "extra": 0.5
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 235924,
                "production": 934841,
                "employment": 0.2
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 203605,
                "production": 785926,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 342060,
                "production": 1023156,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 71106,
                "production": 250742,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 51858,
                "production": 270081,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 35181,
                "production": 124347,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 16489,
                "production": 38674,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 2026,
                "production": 5766,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 6549,
                "production": 20195,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 7283,
                "production": 20011,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 2097,
                "production": 3664,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 2542,
                "production": 7437,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1200,
                "production": 4916,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1102,
                "production": 1962,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 701,
                "production": 1957,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 259,
                "production": 609,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 100,
                "production": 385,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 59,
                "production": 121,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 69,
                "production": 161,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 48,
                "production": 92,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "321",
        "ateco_name": "Altri mezzi di trasporto",
        "values": {
          "gdp": {
            "intra": 522248,
            "extra": 356065
          },
          "production": {
            "intra": 1547491,
            "extra": 1861675
          },
          "employment": {
            "intra": 0.4,
            "extra": 0.3
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 522248,
                "production": 1547491,
                "employment": 0.4
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 109163,
                "production": 550226,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 105225,
                "production": 725672,
                "employment": 0.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 21314,
                "production": 119671,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 85473,
                "production": 285823,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 15674,
                "production": 100825,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 1739,
                "production": 8601,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1770,
                "production": 5401,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 5849,
                "production": 25112,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 7854,
                "production": 31369,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 0,
                "production": 818,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 644,
                "production": 3067,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 302,
                "production": 1910,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 42,
                "production": 193,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 774,
                "production": 2128,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 197,
                "production": 592,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 11,
                "production": 117,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 16,
                "production": 49,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 13,
                "production": 79,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 6,
                "production": 22,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "36",
        "ateco_name": "Organizzazioni associative",
        "values": {
          "gdp": {
            "intra": 387813,
            "extra": 924061
          },
          "production": {
            "intra": 924887,
            "extra": 2400080
          },
          "employment": {
            "intra": 0.4,
            "extra": 1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 387813,
                "production": 924887,
                "employment": 0.4
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 378122,
                "production": 891267,
                "employment": 0.4
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 224135,
                "production": 599087,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 112213,
                "production": 333433,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 106360,
                "production": 319801,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 43503,
                "production": 118949,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 12024,
                "production": 29573,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 15098,
                "production": 24433,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 6554,
                "production": 18630,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 6397,
                "production": 15963,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 5924,
                "production": 21173,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 4194,
                "production": 10487,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2537,
                "production": 5981,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 2937,
                "production": 4562,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 2287,
                "production": 3636,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 820,
                "production": 1360,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 310,
                "production": 761,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 300,
                "production": 431,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 163,
                "production": 281,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 182,
                "production": 271,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "325",
        "ateco_name": "Trattamento acqua",
        "values": {
          "gdp": {
            "intra": 449099,
            "extra": 1008468
          },
          "production": {
            "intra": 803130,
            "extra": 2464682
          },
          "employment": {
            "intra": 0.3,
            "extra": 0.6
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 449099,
                "production": 803130,
                "employment": 0.3
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 237130,
                "production": 679192,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 209693,
                "production": 483772,
                "employment": 0.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 153124,
                "production": 383690,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 162995,
                "production": 343069,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 120364,
                "production": 270669,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 6166,
                "production": 43665,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 26449,
                "production": 52079,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 23383,
                "production": 54415,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 17286,
                "production": 43206,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1630,
                "production": 14642,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 17936,
                "production": 37992,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 8670,
                "production": 19190,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 13555,
                "production": 20285,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 5969,
                "production": 10037,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 2423,
                "production": 4132,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 150,
                "production": 1863,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 774,
                "production": 1191,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 561,
                "production": 1041,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 210,
                "production": 550,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "357",
        "ateco_name": "Assistenza sociale",
        "values": {
          "gdp": {
            "intra": 525885,
            "extra": 1177393
          },
          "production": {
            "intra": 866578,
            "extra": 2185998
          },
          "employment": {
            "intra": 0.6,
            "extra": 1.3
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 525885,
                "production": 866578,
                "employment": 0.6
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 408210,
                "production": 765221,
                "employment": 0.5
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 302563,
                "production": 535222,
                "employment": 0.3
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 170546,
                "production": 306800,
                "employment": 0.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 124803,
                "production": 247679,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 59000,
                "production": 112256,
                "employment": 0.1
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 29595,
                "production": 58617,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 19125,
                "production": 30175,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 12021,
                "production": 21168,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 14352,
                "production": 23337,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 13155,
                "production": 43631,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 7759,
                "production": 14830,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 4171,
                "production": 8425,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 5761,
                "production": 7926,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 2898,
                "production": 5023,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1418,
                "production": 2228,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 960,
                "production": 1780,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 468,
                "production": 659,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 390,
                "production": 670,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 199,
                "production": 352,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "333",
        "ateco_name": "Trasporto aereo",
        "values": {
          "gdp": {
            "intra": 7876,
            "extra": 605082
          },
          "production": {
            "intra": 203625,
            "extra": 2548543
          },
          "employment": {
            "intra": 0,
            "extra": 0.3
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 7876,
                "production": 203625,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 493073,
                "production": 1543864,
                "employment": 0.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 39442,
                "production": 420322,
                "employment": 0
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 1584,
                "production": 227124,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 1160,
                "production": 116679,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 31421,
                "production": 113218,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 1077,
                "production": 19633,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 35370,
                "production": 73608,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 42,
                "production": 7425,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 573,
                "production": 7597,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 416,
                "production": 7999,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 152,
                "production": 4251,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 121,
                "production": 2985,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 244,
                "production": 1061,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 300,
                "production": 1666,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 94,
                "production": 485,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 0,
                "production": 391,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 9,
                "production": 103,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 0,
                "production": 69,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 5,
                "production": 63,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "337",
        "ateco_name": "Attività  editoriali",
        "values": {
          "gdp": {
            "intra": 93609,
            "extra": 727153
          },
          "production": {
            "intra": 442724,
            "extra": 2012273
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.6
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 93609,
                "production": 442724,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 467041,
                "production": 1032972,
                "employment": 0.4
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 122930,
                "production": 420165,
                "employment": 0.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 63044,
                "production": 245207,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 29617,
                "production": 144972,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 18529,
                "production": 79731,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 8364,
                "production": 25620,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 7877,
                "production": 17654,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 2632,
                "production": 12256,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2251,
                "production": 10876,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1226,
                "production": 8504,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1409,
                "production": 5908,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 811,
                "production": 3647,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 457,
                "production": 1568,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 606,
                "production": 1729,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 196,
                "production": 663,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 71,
                "production": 406,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 55,
                "production": 163,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 14,
                "production": 137,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 24,
                "production": 94,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "312",
        "ateco_name": "Prodotti farmaceutici",
        "values": {
          "gdp": {
            "intra": 69363,
            "extra": 669246
          },
          "production": {
            "intra": 302097,
            "extra": 1928104
          },
          "employment": {
            "intra": 0,
            "extra": 0.4
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 69363,
                "production": 302097,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 407060,
                "production": 1010821,
                "employment": 0.2
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 87697,
                "production": 409091,
                "employment": 0.1
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 60293,
                "production": 200183,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 63301,
                "production": 150556,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 29728,
                "production": 93725,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 2125,
                "production": 9339,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 11107,
                "production": 21220,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 3149,
                "production": 13834,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1461,
                "production": 7594,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 0,
                "production": 1191,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 479,
                "production": 2362,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1903,
                "production": 5317,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 9,
                "production": 212,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 538,
                "production": 1508,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 88,
                "production": 326,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 255,
                "production": 608,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 36,
                "production": 94,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 18,
                "production": 103,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 1,
                "production": 21,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "335",
        "ateco_name": "Servizi postali",
        "values": {
          "gdp": {
            "intra": 138683,
            "extra": 712084
          },
          "production": {
            "intra": 337539,
            "extra": 1805856
          },
          "employment": {
            "intra": 0.2,
            "extra": 1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 138683,
                "production": 337539,
                "employment": 0.2
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 316811,
                "production": 789249,
                "employment": 0.5
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 188267,
                "production": 461276,
                "employment": 0.3
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 64967,
                "production": 196537,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 67257,
                "production": 177258,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 31554,
                "production": 81721,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 6135,
                "production": 16964,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 12191,
                "production": 26928,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 5586,
                "production": 12595,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 4729,
                "production": 10933,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 3057,
                "production": 9299,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3294,
                "production": 7126,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2462,
                "production": 5982,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1611,
                "production": 2619,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 2549,
                "production": 4524,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 746,
                "production": 1256,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 307,
                "production": 667,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 231,
                "production": 366,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 141,
                "production": 278,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 188,
                "production": 277,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "347",
        "ateco_name": "Ricerca scientifica",
        "values": {
          "gdp": {
            "intra": 82898,
            "extra": 1153040
          },
          "production": {
            "intra": 147742,
            "extra": 1483814
          },
          "employment": {
            "intra": 0,
            "extra": 0.6
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 82898,
                "production": 147742,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 482145,
                "production": 601093,
                "employment": 0.3
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 289786,
                "production": 372297,
                "employment": 0.2
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 142157,
                "production": 189495,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 158300,
                "production": 212857,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 46111,
                "production": 60758,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 10274,
                "production": 13968,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 4603,
                "production": 5613,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 2922,
                "production": 5157,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2450,
                "production": 3534,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 8249,
                "production": 11211,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 2704,
                "production": 3611,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1555,
                "production": 2005,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 283,
                "production": 371,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1049,
                "production": 1226,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 212,
                "production": 266,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 125,
                "production": 195,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 30,
                "production": 40,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 61,
                "production": 86,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 23,
                "production": 30,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "361",
        "ateco_name": "Riparazione beni",
        "values": {
          "gdp": {
            "intra": 101665,
            "extra": 290730
          },
          "production": {
            "intra": 190208,
            "extra": 553692
          },
          "employment": {
            "intra": 0,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 101665,
                "production": 190208,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 122738,
                "production": 227207,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 67850,
                "production": 130790,
                "employment": 0
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 33312,
                "production": 71169,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 31652,
                "production": 60357,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 16629,
                "production": 31728,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 3394,
                "production": 6679,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 3982,
                "production": 5749,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 2705,
                "production": 4850,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2672,
                "production": 4840,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1584,
                "production": 3341,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1546,
                "production": 2631,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 832,
                "production": 1544,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 644,
                "production": 960,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 672,
                "production": 1020,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 275,
                "production": 392,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 69,
                "production": 175,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 83,
                "production": 112,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 45,
                "production": 79,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 48,
                "production": 68,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "303",
        "ateco_name": "Pesca e acquicoltura",
        "values": {
          "gdp": {
            "intra": 16998,
            "extra": 115941
          },
          "production": {
            "intra": 44816,
            "extra": 266048
          },
          "employment": {
            "intra": 0,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 16998,
                "production": 44816,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 21025,
                "production": 58712,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 27069,
                "production": 58105,
                "employment": 0
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 18910,
                "production": 44428,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 11392,
                "production": 26817,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 11603,
                "production": 28229,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 6370,
                "production": 12057,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 4610,
                "production": 7759,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 2702,
                "production": 6639,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2521,
                "production": 6423,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 700,
                "production": 1585,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1472,
                "production": 3098,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1419,
                "production": 2848,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 3479,
                "production": 5088,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1036,
                "production": 1704,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 826,
                "production": 1223,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 273,
                "production": 534,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 194,
                "production": 291,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 136,
                "production": 219,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 205,
                "production": 289,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "302",
        "ateco_name": "Silvicoltura",
        "values": {
          "gdp": {
            "intra": 10068,
            "extra": 154484
          },
          "production": {
            "intra": 13495,
            "extra": 195421
          },
          "employment": {
            "intra": 0,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 10068,
                "production": 13495,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 26454,
                "production": 35261,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 28554,
                "production": 35539,
                "employment": 0
              }
            },
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 25776,
                "production": 32757,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 18443,
                "production": 23827,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 16147,
                "production": 20114,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 8953,
                "production": 10525,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 7075,
                "production": 8495,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 4670,
                "production": 6105,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 3983,
                "production": 5091,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1304,
                "production": 1834,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 2183,
                "production": 2819,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2541,
                "production": 3266,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 4397,
                "production": 5032,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1711,
                "production": 2024,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1152,
                "production": 1313,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 486,
                "production": 647,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 199,
                "production": 231,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 216,
                "production": 263,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 240,
                "production": 277,
                "employment": 0
              }
            }
          ]
        }
      }
    ]
  }
};

export const OSPEDALE_ECBA_DATASET = {
  "kpi": {
    "investimento": 156.6,
    "orizzonte": 22,
    "tasso": 3,
    "vane": 265.3,
    "tire": 12,
    "bcr": 1.77,
    "paybackAnno": 11,
    "progetto": "Analisi Ospedale Infantile — Genova",
    "luogo": "provincia di Genova",
    "categoria": "Strutture ospedaliere"
  },
  "waterfall": {
    "benefici": 609.87,
    "costi": 344.57,
    "esternalitaNeg": 0,
    "vane": 265.3
  },
  "pv_capex": 156600000,
  "pv_opex": 187969973,
  "cashflow": {
    "cost": [
      31.5,
      31.5,
      31.5,
      31.5,
      31.5,
      31.5,
      31.5,
      31.5,
      12.04,
      12.04,
      12.04,
      12.04,
      12.04,
      12.04,
      12.04,
      12.04,
      12.04,
      12.04,
      12.04,
      12.04,
      12.04,
      12.04,
      12.04
    ],
    "ben": [
      7.28,
      7.28,
      7.28,
      7.28,
      7.28,
      7.28,
      7.28,
      55.08,
      52.31,
      49.7,
      47.22,
      44.88,
      42.66,
      40.56,
      38.58,
      36.69,
      34.91,
      33.22,
      31.62,
      92.65,
      93.46,
      94.04,
      94.39
    ]
  },
  "donut": [
    {
      "label": "Miglioramento dell'accessibilità",
      "pct": 68.51,
      "color": "#4400B3",
      "code": "Miglioramento dell'accessibilità"
    },
    {
      "label": "Riduzione della mobilità passiva",
      "pct": 21.8,
      "color": "#6E1AFF",
      "code": "KPI264"
    },
    {
      "label": "Tempo di degenza evitato",
      "pct": 9.47,
      "color": "#ae81fd",
      "code": "KPI263"
    },
    {
      "label": "Riduzione emissioni di CO2 per veicoli pesanti",
      "pct": 0.12,
      "color": "#B9FF69",
      "code": "KPI340"
    },
    {
      "label": "Riduzione della mortalità infantile",
      "pct": 0.08,
      "color": "#270065",
      "code": "KPI265"
    },
    {
      "label": "Inabilità evitata",
      "pct": 0.01,
      "color": "#9E7BFA",
      "code": "KPI266"
    }
  ],
  "_riskIllustrative": true,
  "sensitivity": [
    {
      "name": "Costi di investimento",
      "sub": "±10%",
      "low": 191,
      "high": 339.6
    },
    {
      "name": "Parametri delle esternalità",
      "sub": "±10%",
      "low": 209.6,
      "high": 321
    },
    {
      "name": "Tasso di crescita della domanda",
      "sub": "±1 p.p.",
      "low": 217.5,
      "high": 313.1
    },
    {
      "name": "Costi di gestione (OPEX)",
      "sub": "±10%",
      "low": 233.5,
      "high": 297.1
    },
    {
      "name": "Tasso di sconto sociale",
      "sub": "±0,5 p.p.",
      "low": 238.8,
      "high": 291.8
    }
  ],
  "montecarlo": {
    "start": 79.9,
    "w": 14.7,
    "freq": [
      0.7,
      1.2,
      1.1,
      4.2,
      3.6,
      4.4,
      3.9,
      4.8,
      6.6,
      4.8,
      6.4,
      7.7,
      6.1,
      5.6,
      5.4,
      5.4,
      5,
      5.8,
      4.9,
      3,
      3.3,
      2.7,
      2,
      0.8,
      0.6
    ],
    "base": 265.3
  },
  "riskSummary": {
    "probPositive": 1,
    "median": 265.3,
    "mean": 265.3,
    "std": 80.7,
    "p5": 131.1,
    "p95": 395.3,
    "criticalVar": "Benefici economici"
  },
  "elasticities": [
    {
      "param": "Costi investimento",
      "value": 2.8
    },
    {
      "param": "Esternalità",
      "value": 2.1
    },
    {
      "param": "Crescita domanda",
      "value": 1.8
    },
    {
      "param": "OPEX",
      "value": 1.2
    },
    {
      "param": "Tasso sconto",
      "value": 0.9
    }
  ],
  "variances": [
    {
      "param": "Costi investimento",
      "value": 0.85
    },
    {
      "param": "Esternalità",
      "value": 0.7
    },
    {
      "param": "Crescita domanda",
      "value": 0.55
    },
    {
      "param": "OPEX",
      "value": 0.4
    },
    {
      "param": "Tasso sconto",
      "value": 0.3
    }
  ],
  "simulationCount": 1000,
  "heatmap": {
    "benefici": 609.87,
    "costiTotali": 344.57,
    "costMults": [
      0.8,
      0.9,
      1,
      1.1,
      1.2,
      1.3
    ],
    "benefitMults": [
      0.8,
      0.9,
      1,
      1.1,
      1.2,
      1.3
    ]
  }
};
