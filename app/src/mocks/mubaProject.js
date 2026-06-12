// AUTO-GENERATO da "progetto muba" (IA scenario 976 + ACB scenario 976).
// Dati reali aggregati dagli export EIA/ECBA. NON modificare a mano: rigenerare
// con `node scripts/build-muba-project.cjs` se gli xlsx cambiano.
//
// - MUBA_*_RESULTS : forma engine (computeEia/computeEcba) → card riepilogo ProjectDetail.
// - MUBA_*_DATASET : forma ricca (eiaResults.json / ecbaData.js) → viste di dettaglio.
//   Il gettito fiscale (€8.456.460) è fornito da OpenEconomics (non è nell'export IA).
//   Le sezioni di rischio ECBA non sono nell'export e sono illustrative (_riskIllustrative).

export const MUBA_PROJECT = {
  "id": "PROJ-MUBA-976",
  "cup": "I69J21000000976",
  "nome": "MUBA — Polo culturale di Bologna",
  "descrizione": "Intervento di valorizzazione culturale a Bologna: recupero degli spazi, allestimenti museali e attività artistiche. Scenario di analisi n. 976 (EIA + ACB).",
  "stato": "Approvato",
  "creato_il": "12/06/2026",
  "ultima_modifica": "12/06/2026",
  "creato_da": "OpenEconomics S.r.l, Riccardo Scialla",
  "proprietario": "Riccardo Scialla",
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
  "gettito": {
    "diretto": 2521508,
    "indiretto": 2337475,
    "indotto": 3597477,
    "totale": 8456460
  },
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
  "benefici_categorie": [
    {
      "id": "KPI469",
      "nome": "Riduzione dispersione scolastica",
      "valore_pv": 17215795,
      "quota": 0.428
    },
    {
      "id": "KPI471",
      "nome": "Accesso equalizzato a servizi culturali",
      "valore_pv": 8816023,
      "quota": 0.219
    },
    {
      "id": "KPI475",
      "nome": "Valorizzazione immobiliare dell'area",
      "valore_pv": 8024343,
      "quota": 0.2
    },
    {
      "id": "KPI472",
      "nome": "Supporto genitorialità e qualità tempo familiare",
      "valore_pv": 2456147,
      "quota": 0.061
    },
    {
      "id": "KPI473",
      "nome": "Rigenerazione urbana",
      "valore_pv": 2163571,
      "quota": 0.054
    },
    {
      "id": "KPI470",
      "nome": "Valore visite scolastiche programmate",
      "valore_pv": 1441790,
      "quota": 0.036
    },
    {
      "id": "KPI477",
      "nome": "Integrazione linguistica",
      "valore_pv": 39127,
      "quota": 0.001
    },
    {
      "id": "KPI476",
      "nome": "Sviluppo cognitivo",
      "valore_pv": 19187,
      "quota": 0
    },
    {
      "id": "KPI474",
      "nome": "Emissioni CO2e evitate",
      "valore_pv": 5917,
      "quota": 0
    },
    {
      "id": "KPI478",
      "nome": "Inquinamento atmosferico PM10 da cantiere",
      "valore_pv": -3990,
      "quota": 0
    },
    {
      "id": "KPI480",
      "nome": "Aumento traffico veicolare",
      "valore_pv": -83732,
      "quota": -0.002
    },
    {
      "id": "KPI479",
      "nome": "Rumore da cantiere",
      "valore_pv": -350000,
      "quota": -0.009
    }
  ],
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

export const MUBA_EIA_DATASET = {
  "metadata": {
    "creato_il": "12/06/2026",
    "creato_da": "OpenEconomics S.r.l, Riccardo Scialla",
    "ultima_modifica": "12/06/2026",
    "settore": "Infrastrutture sociali",
    "dataset": "SAM multiprovinciale Italia",
    "metodologia": "SAM Italia 63 settori (scenario 976)",
    "categoria_intervento": "Valorizzazione e fruizione del patrimonio culturale",
    "localizzazione": "Bologna",
    "anno_attualizzazione": 2025
  },
  "previews": {
    "sintesi": "29.6 M€ PIL",
    "componenti": "diretto + filiere",
    "geografia": "45% a Bologna",
    "settori": "Attività artistiche leader",
    "esplora": "Approfondimento dati"
  },
  "input": {
    "total_spend": 19804223,
    "currency": "EUR",
    "origin_provinces": [
      {
        "code": "BO",
        "name": "Bologna",
        "region_code": "08",
        "region_name": "Emilia-Romagna",
        "spend_share": 1
      }
    ],
    "origin_region": {
      "code": "08",
      "name": "Emilia-Romagna",
      "nuts2_code": "ITH5"
    },
    "years_of_realization": 2,
    "spend_breakdown": [
      {
        "ateco_code": "358",
        "ateco_name": "Attività artistiche",
        "amount": 10956074,
        "share": 0.553
      },
      {
        "ateco_code": "327",
        "ateco_name": "Costruzioni",
        "amount": 3238107,
        "share": 0.164
      },
      {
        "ateco_code": "353",
        "ateco_name": "Servizi di vigilanza",
        "amount": 3075871,
        "share": 0.155
      },
      {
        "ateco_code": "322",
        "ateco_name": "Mobili e manifattura",
        "amount": 844724,
        "share": 0.043
      },
      {
        "ateco_code": "346",
        "ateco_name": "Ingegneria e architettura",
        "amount": 703936,
        "share": 0.036
      },
      {
        "ateco_code": "365",
        "ateco_name": "Tasse",
        "amount": 492755,
        "share": 0.025
      },
      {
        "ateco_code": "348",
        "ateco_name": "Pubblicità e marketing",
        "amount": 422362,
        "share": 0.021
      },
      {
        "ateco_code": "344",
        "ateco_name": "Attività immobiliari",
        "amount": 70394,
        "share": 0.004
      }
    ]
  },
  "synthesis": {
    "by_perimeter": {
      "origin_province": {
        "production": 29197580,
        "gdp": 14066419,
        "employment": 6.8,
        "income": 13786870,
        "fiscal": null
      },
      "region": {
        "production": 39296864,
        "gdp": 17911110,
        "employment": 8.7,
        "income": 17538421,
        "fiscal": null
      },
      "national": {
        "production": 64954822,
        "gdp": 29641019,
        "employment": 14,
        "income": 28937026,
        "fiscal": 8456460
      }
    },
    "fiscal_national": 8456460,
    "three_segments": {
      "production": {
        "origin": 29197580,
        "rest_region": 10099284,
        "extra": 25657958
      },
      "gdp": {
        "origin": 14066419,
        "rest_region": 3844691,
        "extra": 11729909
      },
      "employment": {
        "origin": 6.8,
        "rest_region": 1.9,
        "extra": 5.3
      },
      "income": {
        "origin": 13786870,
        "rest_region": 3751551,
        "extra": 11398605
      }
    },
    "per_capita": {
      "origin_province": {
        "population": 1017000,
        "production_pc": 28.71,
        "gdp_pc": 13.83,
        "employment_pc_per_10k": 0.07,
        "income_pc": 13.56
      },
      "region": {
        "population": 4438937,
        "production_pc": 8.85,
        "gdp_pc": 4.03,
        "employment_pc_per_10k": 0.02,
        "income_pc": 3.95
      },
      "national": {
        "population": 58997000,
        "production_pc": 1.1,
        "gdp_pc": 0.5,
        "employment_pc_per_10k": 0,
        "income_pc": 0.49
      }
    },
    "synthetic_kpis": {
      "gdp_multiplier": 1.5,
      "production_multiplier": 3.28,
      "employment_intensity_per_meur": 0.7,
      "fiscal_autofinanc_pct": 0.427
    }
  },
  "components": {
    "production": {
      "direct": 19311468,
      "indirect": 20645499,
      "induced": 24997856,
      "top_sectors": {
        "direct": [
          {
            "name": "Attività artistiche",
            "value": 10956074
          },
          {
            "name": "Costruzioni",
            "value": 3238107
          },
          {
            "name": "Servizi di vigilanza",
            "value": 3075871
          }
        ],
        "indirect": [
          {
            "name": "Attività artistiche",
            "value": 1898176
          },
          {
            "name": "Costruzioni",
            "value": 1286730
          },
          {
            "name": "Attività legali",
            "value": 1139487
          }
        ],
        "induced": [
          {
            "name": "Attività immobiliari",
            "value": 3900565
          },
          {
            "name": "Alloggio e ristorazione",
            "value": 1818886
          },
          {
            "name": "Industrie alimentari",
            "value": 1771107
          }
        ]
      }
    },
    "gdp": {
      "direct": 8838221,
      "indirect": 8193161,
      "induced": 12609637,
      "top_sectors": {
        "direct": [
          {
            "name": "Attività artistiche",
            "value": 5532468
          },
          {
            "name": "Servizi di vigilanza",
            "value": 1468122
          },
          {
            "name": "Costruzioni",
            "value": 1015663
          }
        ],
        "indirect": [
          {
            "name": "Attività immobiliari",
            "value": 649577
          },
          {
            "name": "Attività artistiche",
            "value": 635385
          },
          {
            "name": "Attività legali",
            "value": 607871
          }
        ],
        "induced": [
          {
            "name": "Attività immobiliari",
            "value": 3440722
          },
          {
            "name": "Commercio all'ingrosso",
            "value": 968338
          },
          {
            "name": "Commercio al dettaglio",
            "value": 926588
          }
        ]
      }
    },
    "employment": {
      "direct": 4.6,
      "indirect": 4.3,
      "induced": 5.1,
      "top_sectors": {
        "direct": [
          {
            "name": "Attività artistiche",
            "value": 2.6
          },
          {
            "name": "Servizi di vigilanza",
            "value": 1.1
          },
          {
            "name": "Costruzioni",
            "value": 0.6
          }
        ],
        "indirect": [
          {
            "name": "Servizi finanziari",
            "value": 0.3
          },
          {
            "name": "Amministrazione pubblica",
            "value": 0.3
          },
          {
            "name": "Attività artistiche",
            "value": 0.3
          }
        ],
        "induced": [
          {
            "name": "Alloggio e ristorazione",
            "value": 0.5
          },
          {
            "name": "Commercio all'ingrosso",
            "value": 0.4
          },
          {
            "name": "Commercio al dettaglio",
            "value": 0.4
          }
        ]
      }
    }
  },
  "geography": {
    "regions": [
      {
        "code": "08",
        "name": "Emilia-Romagna",
        "nuts2_code": "ITH5",
        "population": 4438937,
        "is_origin": true,
        "values": {
          "production": {
            "absolute": 39296864,
            "per_capita": 8.85
          },
          "gdp": {
            "absolute": 17911110,
            "per_capita": 4.03
          },
          "employment": {
            "absolute": 8.7,
            "per_capita_per_10k": 0.02
          },
          "income": {
            "absolute": 17538421,
            "per_capita": 3.95
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
            "absolute": 6422814,
            "per_capita": 1.75
          },
          "gdp": {
            "absolute": 2741335,
            "per_capita": 0.75
          },
          "employment": {
            "absolute": 1.3,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 2669754,
            "per_capita": 0.73
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
            "absolute": 6050558,
            "per_capita": 0.61
          },
          "gdp": {
            "absolute": 2887662,
            "per_capita": 0.29
          },
          "employment": {
            "absolute": 1.3,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 2796318,
            "per_capita": 0.28
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
            "absolute": 5897353,
            "per_capita": 1.22
          },
          "gdp": {
            "absolute": 2636979,
            "per_capita": 0.54
          },
          "employment": {
            "absolute": 1.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 2568704,
            "per_capita": 0.53
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
            "absolute": 1418180,
            "per_capita": 0.33
          },
          "gdp": {
            "absolute": 663149,
            "per_capita": 0.16
          },
          "employment": {
            "absolute": 0.3,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 641757,
            "per_capita": 0.15
          }
        }
      },
      {
        "code": "07",
        "name": "Liguria",
        "nuts2_code": "ITC3",
        "population": 1502624,
        "values": {
          "production": {
            "absolute": 1278321,
            "per_capita": 0.85
          },
          "gdp": {
            "absolute": 464691,
            "per_capita": 0.31
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 452588,
            "per_capita": 0.3
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
            "absolute": 1102746,
            "per_capita": 0.74
          },
          "gdp": {
            "absolute": 490458,
            "per_capita": 0.33
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 476829,
            "per_capita": 0.32
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
            "absolute": 878830,
            "per_capita": 0.15
          },
          "gdp": {
            "absolute": 548641,
            "per_capita": 0.1
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 531049,
            "per_capita": 0.09
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
            "absolute": 701474,
            "per_capita": 0.65
          },
          "gdp": {
            "absolute": 360214,
            "per_capita": 0.33
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 349455,
            "per_capita": 0.32
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
            "absolute": 696102,
            "per_capita": 0.58
          },
          "gdp": {
            "absolute": 316019,
            "per_capita": 0.26
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 306731,
            "per_capita": 0.26
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
            "absolute": 458445,
            "per_capita": 0.54
          },
          "gdp": {
            "absolute": 226139,
            "per_capita": 0.26
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 219631,
            "per_capita": 0.26
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
            "absolute": 272511,
            "per_capita": 0.21
          },
          "gdp": {
            "absolute": 124431,
            "per_capita": 0.1
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 121166,
            "per_capita": 0.1
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
            "absolute": 178723,
            "per_capita": 0.03
          },
          "gdp": {
            "absolute": 102849,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 100586,
            "per_capita": 0.02
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
            "absolute": 84884,
            "per_capita": 0.05
          },
          "gdp": {
            "absolute": 52599,
            "per_capita": 0.03
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 51696,
            "per_capita": 0.03
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
            "absolute": 77354,
            "per_capita": 0.02
          },
          "gdp": {
            "absolute": 46477,
            "per_capita": 0.01
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 45852,
            "per_capita": 0.01
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
            "absolute": 55345,
            "per_capita": 0.45
          },
          "gdp": {
            "absolute": 26776,
            "per_capita": 0.22
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 25631,
            "per_capita": 0.21
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
            "absolute": 36303,
            "per_capita": 0.13
          },
          "gdp": {
            "absolute": 14341,
            "per_capita": 0.05
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 14107,
            "per_capita": 0.05
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
            "absolute": 19187,
            "per_capita": 0
          },
          "gdp": {
            "absolute": 11656,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 11412,
            "per_capita": 0
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
            "absolute": 15314,
            "per_capita": 0.03
          },
          "gdp": {
            "absolute": 7469,
            "per_capita": 0.01
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 7355,
            "per_capita": 0.01
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
            "absolute": 13512,
            "per_capita": 0.01
          },
          "gdp": {
            "absolute": 8026,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 7983,
            "per_capita": 0
          }
        }
      }
    ],
    "provinces": [
      {
        "code": "BO",
        "name": "Bologna",
        "region_code": "08",
        "region_name": "Emilia-Romagna",
        "population": 1017000,
        "is_origin": true,
        "values": {
          "production": {
            "absolute": 29197580,
            "per_capita": 28.71
          },
          "gdp": {
            "absolute": 14066419,
            "per_capita": 13.83
          },
          "employment": {
            "absolute": 6.8,
            "per_capita_per_10k": 0.07
          },
          "income": {
            "absolute": 13786870,
            "per_capita": 13.56
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
            "absolute": 3368716,
            "per_capita": 4.78
          },
          "gdp": {
            "absolute": 1252732,
            "per_capita": 1.78
          },
          "employment": {
            "absolute": 0.7,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 1222913,
            "per_capita": 1.73
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
            "absolute": 1836828,
            "per_capita": 0.57
          },
          "gdp": {
            "absolute": 1160766,
            "per_capita": 0.36
          },
          "employment": {
            "absolute": 0.5,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 1120065,
            "per_capita": 0.35
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
            "absolute": 1682043,
            "per_capita": 1.7
          },
          "gdp": {
            "absolute": 887115,
            "per_capita": 0.9
          },
          "employment": {
            "absolute": 0.4,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 864004,
            "per_capita": 0.88
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
            "absolute": 1459900,
            "per_capita": 2.79
          },
          "gdp": {
            "absolute": 535473,
            "per_capita": 1.02
          },
          "employment": {
            "absolute": 0.3,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 523146,
            "per_capita": 1
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
            "absolute": 1342143,
            "per_capita": 1.45
          },
          "gdp": {
            "absolute": 606036,
            "per_capita": 0.65
          },
          "employment": {
            "absolute": 0.3,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 591408,
            "per_capita": 0.64
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
            "absolute": 1210536,
            "per_capita": 1.45
          },
          "gdp": {
            "absolute": 539072,
            "per_capita": 0.64
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 524885,
            "per_capita": 0.63
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
            "absolute": 1202575,
            "per_capita": 3.12
          },
          "gdp": {
            "absolute": 461314,
            "per_capita": 1.2
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 450757,
            "per_capita": 1.17
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
            "absolute": 1163351,
            "per_capita": 1.25
          },
          "gdp": {
            "absolute": 562751,
            "per_capita": 0.6
          },
          "employment": {
            "absolute": 0.3,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 547427,
            "per_capita": 0.59
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
            "absolute": 1052317,
            "per_capita": 2.68
          },
          "gdp": {
            "absolute": 447850,
            "per_capita": 1.14
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 436812,
            "per_capita": 1.11
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
            "absolute": 988283,
            "per_capita": 2.88
          },
          "gdp": {
            "absolute": 310740,
            "per_capita": 0.91
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 304438,
            "per_capita": 0.89
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
            "absolute": 986245,
            "per_capita": 2.19
          },
          "gdp": {
            "absolute": 350215,
            "per_capita": 0.78
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 341905,
            "per_capita": 0.76
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
            "absolute": 880427,
            "per_capita": 2.3
          },
          "gdp": {
            "absolute": 384408,
            "per_capita": 1
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 374376,
            "per_capita": 0.98
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
            "absolute": 851540,
            "per_capita": 1
          },
          "gdp": {
            "absolute": 371992,
            "per_capita": 0.44
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 362309,
            "per_capita": 0.42
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
            "absolute": 780040,
            "per_capita": 0.62
          },
          "gdp": {
            "absolute": 381592,
            "per_capita": 0.3
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 370715,
            "per_capita": 0.3
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
            "absolute": 767687,
            "per_capita": 2.94
          },
          "gdp": {
            "absolute": 255435,
            "per_capita": 0.98
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 248216,
            "per_capita": 0.95
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
            "absolute": 737128,
            "per_capita": 1.75
          },
          "gdp": {
            "absolute": 315906,
            "per_capita": 0.75
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 307616,
            "per_capita": 0.73
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
            "absolute": 701598,
            "per_capita": 1.74
          },
          "gdp": {
            "absolute": 248881,
            "per_capita": 0.62
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 243486,
            "per_capita": 0.6
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
            "absolute": 690484,
            "per_capita": 0.78
          },
          "gdp": {
            "absolute": 338438,
            "per_capita": 0.38
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 329331,
            "per_capita": 0.37
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
            "absolute": 681457,
            "per_capita": 2.35
          },
          "gdp": {
            "absolute": 234283,
            "per_capita": 0.81
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 228261,
            "per_capita": 0.79
          }
        }
      },
      {
        "code": "GE",
        "name": "Genova",
        "region_code": "07",
        "region_name": "Liguria",
        "population": 814000,
        "values": {
          "production": {
            "absolute": 675905,
            "per_capita": 0.83
          },
          "gdp": {
            "absolute": 237260,
            "per_capita": 0.29
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 231883,
            "per_capita": 0.28
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
            "absolute": 662703,
            "per_capita": 1.97
          },
          "gdp": {
            "absolute": 348687,
            "per_capita": 1.04
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 337387,
            "per_capita": 1
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
            "absolute": 597276,
            "per_capita": 0.14
          },
          "gdp": {
            "absolute": 418698,
            "per_capita": 0.1
          },
          "employment": {
            "absolute": 0.2,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 403049,
            "per_capita": 0.1
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
            "absolute": 535361,
            "per_capita": 0.48
          },
          "gdp": {
            "absolute": 243371,
            "per_capita": 0.22
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 236103,
            "per_capita": 0.21
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
            "absolute": 507206,
            "per_capita": 2.24
          },
          "gdp": {
            "absolute": 167569,
            "per_capita": 0.74
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 163759,
            "per_capita": 0.72
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
            "absolute": 480425,
            "per_capita": 1.43
          },
          "gdp": {
            "absolute": 185490,
            "per_capita": 0.55
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 181269,
            "per_capita": 0.54
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
            "absolute": 472255,
            "per_capita": 1.33
          },
          "gdp": {
            "absolute": 210703,
            "per_capita": 0.59
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 204870,
            "per_capita": 0.58
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
            "absolute": 454012,
            "per_capita": 0.21
          },
          "gdp": {
            "absolute": 276722,
            "per_capita": 0.13
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 266200,
            "per_capita": 0.12
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
            "absolute": 438809,
            "per_capita": 0.81
          },
          "gdp": {
            "absolute": 206601,
            "per_capita": 0.38
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 200569,
            "per_capita": 0.37
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
            "absolute": 425582,
            "per_capita": 2.23
          },
          "gdp": {
            "absolute": 139882,
            "per_capita": 0.73
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0.01
          },
          "income": {
            "absolute": 136106,
            "per_capita": 0.71
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
            "absolute": 402979,
            "per_capita": 1.14
          },
          "gdp": {
            "absolute": 136029,
            "per_capita": 0.38
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 132750,
            "per_capita": 0.38
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
            "absolute": 393722,
            "per_capita": 0.45
          },
          "gdp": {
            "absolute": 175518,
            "per_capita": 0.2
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 169346,
            "per_capita": 0.19
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
            "absolute": 378547,
            "per_capita": 1.33
          },
          "gdp": {
            "absolute": 137679,
            "per_capita": 0.48
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 134194,
            "per_capita": 0.47
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
            "absolute": 370048,
            "per_capita": 1.72
          },
          "gdp": {
            "absolute": 124482,
            "per_capita": 0.58
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 120989,
            "per_capita": 0.56
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
            "absolute": 353061,
            "per_capita": 0.54
          },
          "gdp": {
            "absolute": 183968,
            "per_capita": 0.28
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 178813,
            "per_capita": 0.28
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
            "absolute": 330477,
            "per_capita": 1.27
          },
          "gdp": {
            "absolute": 147022,
            "per_capita": 0.56
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 142937,
            "per_capita": 0.55
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
            "absolute": 320554,
            "per_capita": 0.36
          },
          "gdp": {
            "absolute": 136562,
            "per_capita": 0.15
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 131601,
            "per_capita": 0.15
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
            "absolute": 305205,
            "per_capita": 0.57
          },
          "gdp": {
            "absolute": 117403,
            "per_capita": 0.22
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 114535,
            "per_capita": 0.21
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
            "absolute": 296635,
            "per_capita": 0.64
          },
          "gdp": {
            "absolute": 140253,
            "per_capita": 0.3
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 136431,
            "per_capita": 0.3
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
            "absolute": 268027,
            "per_capita": 0.81
          },
          "gdp": {
            "absolute": 113251,
            "per_capita": 0.34
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 109873,
            "per_capita": 0.33
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
            "absolute": 262665,
            "per_capita": 0.49
          },
          "gdp": {
            "absolute": 153613,
            "per_capita": 0.29
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 148886,
            "per_capita": 0.28
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
            "absolute": 243651,
            "per_capita": 0.41
          },
          "gdp": {
            "absolute": 104604,
            "per_capita": 0.18
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 100838,
            "per_capita": 0.17
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
            "absolute": 233708,
            "per_capita": 0.45
          },
          "gdp": {
            "absolute": 124463,
            "per_capita": 0.24
          },
          "employment": {
            "absolute": 0.1,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 120723,
            "per_capita": 0.23
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
            "absolute": 218775,
            "per_capita": 0.97
          },
          "gdp": {
            "absolute": 66308,
            "per_capita": 0.29
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 64463,
            "per_capita": 0.29
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
            "absolute": 210526,
            "per_capita": 0.51
          },
          "gdp": {
            "absolute": 82738,
            "per_capita": 0.2
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 80374,
            "per_capita": 0.2
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
            "absolute": 203720,
            "per_capita": 0.66
          },
          "gdp": {
            "absolute": 82523,
            "per_capita": 0.27
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 80457,
            "per_capita": 0.26
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
            "absolute": 189319,
            "per_capita": 0.32
          },
          "gdp": {
            "absolute": 107289,
            "per_capita": 0.18
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 105374,
            "per_capita": 0.18
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
            "absolute": 179525,
            "per_capita": 0.54
          },
          "gdp": {
            "absolute": 64341,
            "per_capita": 0.19
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 62064,
            "per_capita": 0.19
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
            "absolute": 169562,
            "per_capita": 0.78
          },
          "gdp": {
            "absolute": 78542,
            "per_capita": 0.36
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 77095,
            "per_capita": 0.36
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
            "absolute": 169329,
            "per_capita": 0.47
          },
          "gdp": {
            "absolute": 61686,
            "per_capita": 0.17
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 59488,
            "per_capita": 0.16
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
            "absolute": 166388,
            "per_capita": 0.55
          },
          "gdp": {
            "absolute": 72543,
            "per_capita": 0.24
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 70421,
            "per_capita": 0.23
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
            "absolute": 165877,
            "per_capita": 0.72
          },
          "gdp": {
            "absolute": 76426,
            "per_capita": 0.33
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 73838,
            "per_capita": 0.32
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
            "absolute": 149793,
            "per_capita": 0.56
          },
          "gdp": {
            "absolute": 60979,
            "per_capita": 0.23
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 58781,
            "per_capita": 0.22
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
            "absolute": 132320,
            "per_capita": 0.74
          },
          "gdp": {
            "absolute": 52286,
            "per_capita": 0.29
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 50352,
            "per_capita": 0.28
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
            "absolute": 132093,
            "per_capita": 0.67
          },
          "gdp": {
            "absolute": 51121,
            "per_capita": 0.26
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 49585,
            "per_capita": 0.25
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
            "absolute": 124369,
            "per_capita": 0.58
          },
          "gdp": {
            "absolute": 44931,
            "per_capita": 0.21
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 43940,
            "per_capita": 0.21
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
            "absolute": 106787,
            "per_capita": 0.34
          },
          "gdp": {
            "absolute": 50169,
            "per_capita": 0.16
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 49232,
            "per_capita": 0.16
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
            "absolute": 105385,
            "per_capita": 0.49
          },
          "gdp": {
            "absolute": 42172,
            "per_capita": 0.19
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 40818,
            "per_capita": 0.19
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
            "absolute": 92860,
            "per_capita": 0.6
          },
          "gdp": {
            "absolute": 30267,
            "per_capita": 0.19
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 29009,
            "per_capita": 0.19
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
            "absolute": 92797,
            "per_capita": 0.68
          },
          "gdp": {
            "absolute": 32607,
            "per_capita": 0.24
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 31713,
            "per_capita": 0.23
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
            "absolute": 91980,
            "per_capita": 0.54
          },
          "gdp": {
            "absolute": 33644,
            "per_capita": 0.2
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 32145,
            "per_capita": 0.19
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
            "absolute": 91299,
            "per_capita": 0.46
          },
          "gdp": {
            "absolute": 39195,
            "per_capita": 0.2
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 38195,
            "per_capita": 0.19
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
            "absolute": 85786,
            "per_capita": 0.51
          },
          "gdp": {
            "absolute": 25873,
            "per_capita": 0.15
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 25227,
            "per_capita": 0.15
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
            "absolute": 83261,
            "per_capita": 0.28
          },
          "gdp": {
            "absolute": 36950,
            "per_capita": 0.12
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 36037,
            "per_capita": 0.12
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
            "absolute": 82575,
            "per_capita": 0.39
          },
          "gdp": {
            "absolute": 41970,
            "per_capita": 0.2
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 40936,
            "per_capita": 0.19
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
            "absolute": 81707,
            "per_capita": 0.14
          },
          "gdp": {
            "absolute": 41787,
            "per_capita": 0.07
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 42043,
            "per_capita": 0.07
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
            "absolute": 76170,
            "per_capita": 0.45
          },
          "gdp": {
            "absolute": 27763,
            "per_capita": 0.17
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 26911,
            "per_capita": 0.16
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
            "absolute": 75922,
            "per_capita": 0.03
          },
          "gdp": {
            "absolute": 48691,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 47084,
            "per_capita": 0.02
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
            "absolute": 70248,
            "per_capita": 0.25
          },
          "gdp": {
            "absolute": 29568,
            "per_capita": 0.1
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 28874,
            "per_capita": 0.1
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
            "absolute": 65844,
            "per_capita": 0.21
          },
          "gdp": {
            "absolute": 32146,
            "per_capita": 0.1
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 30975,
            "per_capita": 0.1
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
            "absolute": 55345,
            "per_capita": 0.45
          },
          "gdp": {
            "absolute": 26776,
            "per_capita": 0.22
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 25631,
            "per_capita": 0.21
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
            "absolute": 53159,
            "per_capita": 0.14
          },
          "gdp": {
            "absolute": 25767,
            "per_capita": 0.07
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 25279,
            "per_capita": 0.07
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
            "absolute": 49576,
            "per_capita": 0.11
          },
          "gdp": {
            "absolute": 22803,
            "per_capita": 0.05
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 21962,
            "per_capita": 0.05
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
            "absolute": 43485,
            "per_capita": 0.29
          },
          "gdp": {
            "absolute": 15184,
            "per_capita": 0.1
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 14763,
            "per_capita": 0.1
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
            "absolute": 41566,
            "per_capita": 0.05
          },
          "gdp": {
            "absolute": 22496,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 22245,
            "per_capita": 0.02
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
            "absolute": 31574,
            "per_capita": 0.07
          },
          "gdp": {
            "absolute": 21479,
            "per_capita": 0.05
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 20881,
            "per_capita": 0.04
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
            "absolute": 25408,
            "per_capita": 0.04
          },
          "gdp": {
            "absolute": 14618,
            "per_capita": 0.03
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 14467,
            "per_capita": 0.02
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
            "absolute": 23007,
            "per_capita": 0.02
          },
          "gdp": {
            "absolute": 13664,
            "per_capita": 0.01
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 13338,
            "per_capita": 0.01
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
            "absolute": 21813,
            "per_capita": 0.1
          },
          "gdp": {
            "absolute": 10009,
            "per_capita": 0.05
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 9890,
            "per_capita": 0.05
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
            "absolute": 21485,
            "per_capita": 0.02
          },
          "gdp": {
            "absolute": 14333,
            "per_capita": 0.01
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 13955,
            "per_capita": 0.01
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
            "absolute": 20760,
            "per_capita": 0.08
          },
          "gdp": {
            "absolute": 9545,
            "per_capita": 0.04
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 9610,
            "per_capita": 0.04
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
            "absolute": 20338,
            "per_capita": 0.06
          },
          "gdp": {
            "absolute": 10980,
            "per_capita": 0.03
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 10981,
            "per_capita": 0.03
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
            "absolute": 17468,
            "per_capita": 0.04
          },
          "gdp": {
            "absolute": 8453,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 8309,
            "per_capita": 0.02
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
            "absolute": 14490,
            "per_capita": 0.18
          },
          "gdp": {
            "absolute": 4331,
            "per_capita": 0.05
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 4217,
            "per_capita": 0.05
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
            "absolute": 13045,
            "per_capita": 0.04
          },
          "gdp": {
            "absolute": 7309,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 7330,
            "per_capita": 0.02
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
            "absolute": 12909,
            "per_capita": 0.03
          },
          "gdp": {
            "absolute": 8870,
            "per_capita": 0.02
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 8497,
            "per_capita": 0.02
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
            "absolute": 12807,
            "per_capita": 0.06
          },
          "gdp": {
            "absolute": 7224,
            "per_capita": 0.04
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 7302,
            "per_capita": 0.04
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
            "absolute": 10491,
            "per_capita": 0.03
          },
          "gdp": {
            "absolute": 5118,
            "per_capita": 0.01
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 5019,
            "per_capita": 0.01
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
            "absolute": 7554,
            "per_capita": 0.01
          },
          "gdp": {
            "absolute": 4181,
            "per_capita": 0.01
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 4170,
            "per_capita": 0.01
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
            "absolute": 7255,
            "per_capita": 0.05
          },
          "gdp": {
            "absolute": 4045,
            "per_capita": 0.03
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 4036,
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
            "absolute": 5720,
            "per_capita": 0.01
          },
          "gdp": {
            "absolute": 3657,
            "per_capita": 0.01
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 3609,
            "per_capita": 0.01
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
            "absolute": 5246,
            "per_capita": 0
          },
          "gdp": {
            "absolute": 3524,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 3394,
            "per_capita": 0
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
            "absolute": 5104,
            "per_capita": 0.01
          },
          "gdp": {
            "absolute": 2949,
            "per_capita": 0.01
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 2925,
            "per_capita": 0.01
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
            "absolute": 4822,
            "per_capita": 0.03
          },
          "gdp": {
            "absolute": 2351,
            "per_capita": 0.01
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 2337,
            "per_capita": 0.01
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
            "absolute": 4758,
            "per_capita": 0.01
          },
          "gdp": {
            "absolute": 3088,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 3005,
            "per_capita": 0
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
            "absolute": 2828,
            "per_capita": 0
          },
          "gdp": {
            "absolute": 1547,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 1509,
            "per_capita": 0
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
            "absolute": 2707,
            "per_capita": 0.01
          },
          "gdp": {
            "absolute": 1616,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 1613,
            "per_capita": 0
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
            "absolute": 2670,
            "per_capita": 0
          },
          "gdp": {
            "absolute": 1739,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 1698,
            "per_capita": 0
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
            "absolute": 2534,
            "per_capita": 0.01
          },
          "gdp": {
            "absolute": 1515,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 1483,
            "per_capita": 0
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
            "absolute": 2281,
            "per_capita": 0
          },
          "gdp": {
            "absolute": 1377,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 1391,
            "per_capita": 0
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
            "absolute": 1650,
            "per_capita": 0.01
          },
          "gdp": {
            "absolute": 829,
            "per_capita": 0.01
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 820,
            "per_capita": 0.01
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
            "absolute": 1439,
            "per_capita": 0
          },
          "gdp": {
            "absolute": 675,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 662,
            "per_capita": 0
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
            "absolute": 1363,
            "per_capita": 0
          },
          "gdp": {
            "absolute": 859,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 861,
            "per_capita": 0
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
            "absolute": 1169,
            "per_capita": 0
          },
          "gdp": {
            "absolute": 653,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 650,
            "per_capita": 0
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
            "absolute": 1158,
            "per_capita": 0
          },
          "gdp": {
            "absolute": 759,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 772,
            "per_capita": 0
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
            "absolute": 1155,
            "per_capita": 0.01
          },
          "gdp": {
            "absolute": 548,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 551,
            "per_capita": 0
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
            "absolute": 782,
            "per_capita": 0.01
          },
          "gdp": {
            "absolute": 386,
            "per_capita": 0
          },
          "employment": {
            "absolute": 0,
            "per_capita_per_10k": 0
          },
          "income": {
            "absolute": 384,
            "per_capita": 0
          }
        }
      }
    ],
    "macro_split": {
      "origin": {
        "value": 29197580,
        "pct": 0.45
      },
      "rest_of_region": {
        "value": 10099284,
        "pct": 0.16
      },
      "extra_region": {
        "value": 25657958,
        "pct": 0.4
      }
    }
  },
  "sectors": {
    "items": [
      {
        "ateco_code": "358",
        "ateco_name": "Attività artistiche",
        "values": {
          "gdp": {
            "intra": 5770185,
            "extra": 504130
          },
          "production": {
            "intra": 11638165,
            "extra": 1481603
          },
          "employment": {
            "intra": 2.7,
            "extra": 0.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 5770185,
                "production": 11638165,
                "employment": 2.7
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 189331,
                "production": 543127,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 90308,
                "production": 277242,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 142274,
                "production": 402532,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 6760,
                "production": 27060,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 15874,
                "production": 58878,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 17732,
                "production": 58470,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 9993,
                "production": 17727,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 9351,
                "production": 34345,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 7460,
                "production": 23679,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 11521,
                "production": 29175,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1430,
                "production": 4931,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 852,
                "production": 1544,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 245,
                "production": 469,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 235,
                "production": 483,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 564,
                "production": 1273,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 72,
                "production": 382,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 70,
                "production": 114,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 33,
                "production": 106,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 27,
                "production": 67,
                "employment": 0
              }
            }
          ]
        }
      },
      {
        "ateco_code": "327",
        "ateco_name": "Costruzioni",
        "values": {
          "gdp": {
            "intra": 1266231,
            "extra": 291637
          },
          "production": {
            "intra": 4103782,
            "extra": 958538
          },
          "employment": {
            "intra": 0.7,
            "extra": 0.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 1266231,
                "production": 4103782,
                "employment": 0.7
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 122920,
                "production": 408586,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 50214,
                "production": 171811,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 68454,
                "production": 221105,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 9100,
                "production": 32473,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 8202,
                "production": 28862,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 9032,
                "production": 29476,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 4249,
                "production": 10510,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 5859,
                "production": 15365,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 4296,
                "production": 14899,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3845,
                "production": 11396,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2400,
                "production": 6690,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1311,
                "production": 2955,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 387,
                "production": 736,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 460,
                "production": 1015,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 385,
                "production": 1184,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 259,
                "production": 890,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 77,
                "production": 151,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 134,
                "production": 321,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 55,
                "production": 116,
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
            "intra": 2028149,
            "extra": 2124403
          },
          "production": {
            "intra": 2299452,
            "extra": 2416816
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 2028149,
                "production": 2299452,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 430298,
                "production": 486067,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 529784,
                "production": 607730,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 450904,
                "production": 505582,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 168001,
                "production": 194668,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 97121,
                "production": 110797,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 102142,
                "production": 116895,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 97205,
                "production": 106654,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 71187,
                "production": 80212,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 63539,
                "production": 75819,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 45480,
                "production": 51695,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 24668,
                "production": 29513,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 13378,
                "production": 15244,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 10812,
                "production": 12311,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 5989,
                "production": 6834,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 8337,
                "production": 9745,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 2635,
                "production": 3595,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1475,
                "production": 1645,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 695,
                "production": 940,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 752,
                "production": 872,
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
            "intra": 1607509,
            "extra": 368939
          },
          "production": {
            "intra": 3437711,
            "extra": 909392
          },
          "employment": {
            "intra": 1.2,
            "extra": 0.3
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 1607509,
                "production": 3437711,
                "employment": 1.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 96723,
                "production": 251570,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 97459,
                "production": 219118,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 83719,
                "production": 217401,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 13836,
                "production": 36023,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 15257,
                "production": 39673,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 12668,
                "production": 37759,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 18369,
                "production": 28912,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 8332,
                "production": 22838,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 9889,
                "production": 24379,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 5915,
                "production": 16755,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2434,
                "production": 6329,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 2091,
                "production": 3758,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 667,
                "production": 1141,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 668,
                "production": 1189,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 324,
                "production": 1140,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 209,
                "production": 685,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 143,
                "production": 243,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 117,
                "production": 269,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 121,
                "production": 211,
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
            "intra": 647563,
            "extra": 576285
          },
          "production": {
            "intra": 1074901,
            "extra": 1406699
          },
          "employment": {
            "intra": 0.3,
            "extra": 0.3
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 647563,
                "production": 1074901,
                "employment": 0.3
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 126064,
                "production": 224037,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 152912,
                "production": 238855,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 162640,
                "production": 391199,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 20011,
                "production": 41610,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 24851,
                "production": 321069,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 26604,
                "production": 77605,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 15972,
                "production": 25398,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 15679,
                "production": 20791,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 9788,
                "production": 32050,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 7663,
                "production": 10023,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 3445,
                "production": 4119,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 5827,
                "production": 10722,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1257,
                "production": 3422,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1968,
                "production": 2832,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 361,
                "production": 405,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 361,
                "production": 743,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 439,
                "production": 1177,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 195,
                "production": 218,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 247,
                "production": 424,
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
            "intra": 498382,
            "extra": 527684
          },
          "production": {
            "intra": 1144270,
            "extra": 1128454
          },
          "employment": {
            "intra": 0.3,
            "extra": 0.3
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 498382,
                "production": 1144270,
                "employment": 0.3
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 143072,
                "production": 341165,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 95503,
                "production": 219727,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 133272,
                "production": 279014,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 20912,
                "production": 46574,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 25777,
                "production": 44945,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 21325,
                "production": 47659,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 21093,
                "production": 32034,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 26042,
                "production": 41526,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 13924,
                "production": 27221,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 9619,
                "production": 19615,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 5279,
                "production": 10361,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 3764,
                "production": 6131,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 2943,
                "production": 3795,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1916,
                "production": 2782,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1674,
                "production": 3188,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 508,
                "production": 1093,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 439,
                "production": 602,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 274,
                "production": 526,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 347,
                "production": 497,
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
            "intra": 245048,
            "extra": 147232
          },
          "production": {
            "intra": 1002340,
            "extra": 1072381
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 245048,
                "production": 1002340,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 29492,
                "production": 438889,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 35166,
                "production": 192095,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 42154,
                "production": 239924,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 9165,
                "production": 47346,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 3675,
                "production": 12968,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 6353,
                "production": 55424,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 2894,
                "production": 10164,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 5284,
                "production": 17939,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 3208,
                "production": 12762,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3634,
                "production": 18983,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2454,
                "production": 12734,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1599,
                "production": 6251,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 558,
                "production": 1349,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 760,
                "production": 2774,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 229,
                "production": 759,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 271,
                "production": 1045,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 130,
                "production": 337,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 129,
                "production": 410,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 80,
                "production": 228,
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
            "intra": 239827,
            "extra": 662174
          },
          "production": {
            "intra": 446849,
            "extra": 1225671
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 239827,
                "production": 446849,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 184819,
                "production": 350641,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 146871,
                "production": 264069,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 168652,
                "production": 317514,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 23325,
                "production": 42920,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 24441,
                "production": 45324,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 31302,
                "production": 53928,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 24240,
                "production": 36210,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 14567,
                "production": 35594,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 15586,
                "production": 29559,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 15301,
                "production": 27486,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 4591,
                "production": 9053,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 4474,
                "production": 6261,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 933,
                "production": 1446,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1365,
                "production": 1896,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 573,
                "production": 1679,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 399,
                "production": 1012,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 293,
                "production": 402,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 199,
                "production": 351,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 244,
                "production": 328,
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
            "intra": 530025,
            "extra": 468934
          },
          "production": {
            "intra": 730735,
            "extra": 847218
          },
          "employment": {
            "intra": 0.3,
            "extra": 0.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 530025,
                "production": 730735,
                "employment": 0.3
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 110615,
                "production": 136880,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 100576,
                "production": 213935,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 117257,
                "production": 270131,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 25728,
                "production": 49847,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 19415,
                "production": 25361,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 18887,
                "production": 21577,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 22409,
                "production": 50026,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 12987,
                "production": 22290,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 11608,
                "production": 18092,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 10667,
                "production": 14376,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 5643,
                "production": 7599,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 5393,
                "production": 6532,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 2425,
                "production": 3138,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 2395,
                "production": 3210,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 939,
                "production": 2073,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 646,
                "production": 668,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 565,
                "production": 640,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 335,
                "production": 347,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 445,
                "production": 499,
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
            "intra": 229520,
            "extra": 387792
          },
          "production": {
            "intra": 560485,
            "extra": 896634
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 229520,
                "production": 560485,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 79037,
                "production": 194882,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 88650,
                "production": 222863,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 105512,
                "production": 231551,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 20512,
                "production": 51040,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 15408,
                "production": 48936,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 13892,
                "production": 27472,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 19117,
                "production": 32201,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 12315,
                "production": 21919,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 10872,
                "production": 26205,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 9956,
                "production": 18150,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 3353,
                "production": 6798,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 4685,
                "production": 7013,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1223,
                "production": 1906,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 1483,
                "production": 2221,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 580,
                "production": 1363,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 424,
                "production": 896,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 252,
                "production": 400,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 284,
                "production": 474,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 238,
                "production": 345,
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
            "intra": 182306,
            "extra": 728869
          },
          "production": {
            "intra": 285899,
            "extra": 1118729
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.5
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 182306,
                "production": 285899,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 80839,
                "production": 132286,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 257533,
                "production": 363328,
                "employment": 0.2
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 87728,
                "production": 142888,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 70721,
                "production": 113190,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 22750,
                "production": 43456,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 25936,
                "production": 45459,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 78044,
                "production": 101987,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 26601,
                "production": 40498,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 23219,
                "production": 39269,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 10473,
                "production": 19480,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 12118,
                "production": 23084,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 11829,
                "production": 18223,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 7187,
                "production": 11558,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 6775,
                "production": 9724,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1698,
                "production": 4208,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 1370,
                "production": 3765,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1985,
                "production": 2791,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 1023,
                "production": 1906,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 1041,
                "production": 1628,
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
            "intra": 97162,
            "extra": 325413
          },
          "production": {
            "intra": 317420,
            "extra": 1081061
          },
          "employment": {
            "intra": 0,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 97162,
                "production": 317420,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 34490,
                "production": 151006,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 92227,
                "production": 273808,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 36991,
                "production": 144759,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 32755,
                "production": 110705,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 14337,
                "production": 58454,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 9952,
                "production": 49176,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 31168,
                "production": 72510,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 25695,
                "production": 52832,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 12340,
                "production": 46476,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 8210,
                "production": 28228,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 5917,
                "production": 29586,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 6110,
                "production": 20261,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 4329,
                "production": 11732,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 3306,
                "production": 10049,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 3938,
                "production": 8422,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 976,
                "production": 4729,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1082,
                "production": 3032,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 764,
                "production": 2659,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 824,
                "production": 2638,
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
            "intra": 356673,
            "extra": 53157
          },
          "production": {
            "intra": 1173379,
            "extra": 166539
          },
          "employment": {
            "intra": 0.2,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 356673,
                "production": 1173379,
                "employment": 0.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 13708,
                "production": 48219,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 8514,
                "production": 32789,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 18389,
                "production": 48660,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1709,
                "production": 6077,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 559,
                "production": 4979,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 5342,
                "production": 11235,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 419,
                "production": 1544,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 693,
                "production": 2228,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2652,
                "production": 6801,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 587,
                "production": 1964,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 301,
                "production": 997,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 110,
                "production": 444,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 25,
                "production": 101,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 88,
                "production": 226,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 17,
                "production": 87,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 15,
                "production": 86,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 8,
                "production": 29,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 17,
                "production": 57,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 6,
                "production": 17,
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
            "intra": 463644,
            "extra": 212253
          },
          "production": {
            "intra": 875651,
            "extra": 433484
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 463644,
                "production": 875651,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 52199,
                "production": 100139,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 58659,
                "production": 119033,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 51552,
                "production": 115199,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 8435,
                "production": 18591,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 7370,
                "production": 13605,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 10842,
                "production": 22189,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 6648,
                "production": 9697,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 4969,
                "production": 9366,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 4530,
                "production": 11916,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 4293,
                "production": 8355,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1285,
                "production": 2968,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 681,
                "production": 1035,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 162,
                "production": 233,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 212,
                "production": 326,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 179,
                "production": 435,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 106,
                "production": 195,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 38,
                "production": 53,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 60,
                "production": 104,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 32,
                "production": 46,
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
            "intra": 240315,
            "extra": 106700
          },
          "production": {
            "intra": 838074,
            "extra": 311395
          },
          "employment": {
            "intra": 0.2,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 240315,
                "production": 838074,
                "employment": 0.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 20661,
                "production": 67615,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 31491,
                "production": 96587,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 32704,
                "production": 85228,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 4947,
                "production": 12956,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 2459,
                "production": 9352,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 5453,
                "production": 13878,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 820,
                "production": 2509,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 1496,
                "production": 3999,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 3972,
                "production": 12117,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1311,
                "production": 3026,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 836,
                "production": 2893,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 315,
                "production": 657,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 44,
                "production": 83,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 78,
                "production": 138,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 28,
                "production": 106,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 39,
                "production": 156,
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
                "gdp": 24,
                "production": 45,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 8,
                "production": 13,
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
            "intra": 256496,
            "extra": 53610
          },
          "production": {
            "intra": 844740,
            "extra": 181438
          },
          "employment": {
            "intra": 0.2,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 256496,
                "production": 844740,
                "employment": 0.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 6606,
                "production": 25017,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 17772,
                "production": 61245,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 18041,
                "production": 47875,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 4847,
                "production": 23146,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 516,
                "production": 2403,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 2325,
                "production": 6154,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 124,
                "production": 1008,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 841,
                "production": 3637,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1702,
                "production": 4722,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 418,
                "production": 1534,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 270,
                "production": 2781,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 82,
                "production": 710,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1,
                "production": 4,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 30,
                "production": 164,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 4,
                "production": 133,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 17,
                "production": 596,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1,
                "production": 5,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 14,
                "production": 303,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 0,
                "production": 1,
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
            "intra": 150345,
            "extra": 274700
          },
          "production": {
            "intra": 339198,
            "extra": 644649
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 150345,
                "production": 339198,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 55177,
                "production": 145894,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 84035,
                "production": 186107,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 64496,
                "production": 138610,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 13051,
                "production": 31865,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 18408,
                "production": 34779,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 5066,
                "production": 20304,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 14055,
                "production": 30378,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 3759,
                "production": 14536,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 8699,
                "production": 19947,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3782,
                "production": 11064,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1106,
                "production": 4312,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1655,
                "production": 2997,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 446,
                "production": 759,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 470,
                "production": 967,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 180,
                "production": 960,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 99,
                "production": 640,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 94,
                "production": 185,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 71,
                "production": 222,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 53,
                "production": 122,
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
            "intra": 131390,
            "extra": 278513
          },
          "production": {
            "intra": 277861,
            "extra": 602520
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 131390,
                "production": 277861,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 72547,
                "production": 174421,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 73371,
                "production": 142417,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 74028,
                "production": 156395,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 10966,
                "production": 24200,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 7736,
                "production": 20761,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 10201,
                "production": 24383,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 9092,
                "production": 14450,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 7276,
                "production": 14077,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 5381,
                "production": 12515,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3980,
                "production": 9567,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1431,
                "production": 3991,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1155,
                "production": 2243,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 183,
                "production": 362,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 326,
                "production": 708,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 488,
                "production": 1087,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 127,
                "production": 485,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 54,
                "production": 109,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 117,
                "production": 240,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 55,
                "production": 109,
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
            "intra": 118623,
            "extra": 205626
          },
          "production": {
            "intra": 277991,
            "extra": 523510
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 118623,
                "production": 277991,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 79866,
                "production": 188468,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 28287,
                "production": 82664,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 50136,
                "production": 132597,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 4123,
                "production": 12702,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 12463,
                "production": 28821,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 12034,
                "production": 27507,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 3620,
                "production": 7569,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 4873,
                "production": 15884,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 3718,
                "production": 11189,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3668,
                "production": 9870,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1344,
                "production": 3152,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 561,
                "production": 1004,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 193,
                "production": 389,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 197,
                "production": 385,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 360,
                "production": 857,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 66,
                "production": 227,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 44,
                "production": 78,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 27,
                "production": 72,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 43,
                "production": 75,
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
            "intra": 158623,
            "extra": 345200
          },
          "production": {
            "intra": 239885,
            "extra": 531926
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.3
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 158623,
                "production": 239885,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 121911,
                "production": 193690,
                "employment": 0.1
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 68387,
                "production": 104590,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 71739,
                "production": 107692,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 9946,
                "production": 16596,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 16087,
                "production": 25254,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 14809,
                "production": 23264,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 9431,
                "production": 12263,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 11143,
                "production": 15770,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 7327,
                "production": 11465,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 7847,
                "production": 11770,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 3001,
                "production": 4593,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1562,
                "production": 1998,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 390,
                "production": 478,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 383,
                "production": 499,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 645,
                "production": 1133,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 314,
                "production": 513,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 100,
                "production": 122,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 108,
                "production": 151,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 69,
                "production": 87,
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
            "intra": 112815,
            "extra": 55755
          },
          "production": {
            "intra": 501754,
            "extra": 245449
          },
          "employment": {
            "intra": 0.1,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 112815,
                "production": 501754,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 7293,
                "production": 55969,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 28831,
                "production": 77577,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 10420,
                "production": 56171,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1927,
                "production": 10904,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 746,
                "production": 9515,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 1481,
                "production": 9112,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1893,
                "production": 5875,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 915,
                "production": 5801,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 778,
                "production": 6725,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 766,
                "production": 4078,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 192,
                "production": 1564,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 269,
                "production": 901,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 45,
                "production": 220,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 137,
                "production": 357,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 15,
                "production": 321,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 12,
                "production": 177,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 15,
                "production": 60,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 8,
                "production": 73,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 11,
                "production": 49,
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
            "intra": 93439,
            "extra": 242389
          },
          "production": {
            "intra": 197488,
            "extra": 494397
          },
          "employment": {
            "intra": 0,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 93439,
                "production": 197488,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 29617,
                "production": 66938,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 36915,
                "production": 93632,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 35159,
                "production": 75615,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 30770,
                "production": 60473,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 8218,
                "production": 17409,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 11873,
                "production": 27525,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 21141,
                "production": 33883,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 15305,
                "production": 25399,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 9616,
                "production": 19317,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 5319,
                "production": 10919,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 8465,
                "production": 17016,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 8249,
                "production": 13241,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 8094,
                "production": 11458,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 6942,
                "production": 9968,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 812,
                "production": 1822,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 1923,
                "production": 3835,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1365,
                "production": 2039,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 1028,
                "production": 1676,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 1578,
                "production": 2232,
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
            "intra": 100613,
            "extra": 59086
          },
          "production": {
            "intra": 454827,
            "extra": 217125
          },
          "employment": {
            "intra": 0.1,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 100613,
                "production": 454827,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 9434,
                "production": 47226,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 17358,
                "production": 56497,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 19556,
                "production": 68430,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 3637,
                "production": 11546,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 494,
                "production": 3406,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 4160,
                "production": 11596,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 334,
                "production": 2217,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 1049,
                "production": 4164,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1766,
                "production": 6309,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 419,
                "production": 2409,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 575,
                "production": 2098,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 165,
                "production": 531,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 18,
                "production": 108,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 57,
                "production": 203,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 13,
                "production": 81,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 23,
                "production": 185,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 8,
                "production": 33,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 16,
                "production": 66,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 5,
                "production": 21,
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
            "intra": 111900,
            "extra": 139721
          },
          "production": {
            "intra": 298539,
            "extra": 366726
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 111900,
                "production": 298539,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 37505,
                "production": 97936,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 29661,
                "production": 78781,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 36997,
                "production": 95812,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 6458,
                "production": 19386,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 3979,
                "production": 14901,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 6662,
                "production": 15702,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 4681,
                "production": 9059,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 3623,
                "production": 9396,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2974,
                "production": 9437,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3525,
                "production": 7812,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1179,
                "production": 3139,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1033,
                "production": 2271,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 415,
                "production": 692,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 466,
                "production": 878,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 162,
                "production": 569,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 122,
                "production": 446,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 111,
                "production": 166,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 79,
                "production": 202,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 89,
                "production": 141,
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
            "intra": 186708,
            "extra": 97020
          },
          "production": {
            "intra": 358679,
            "extra": 279418
          },
          "employment": {
            "intra": 0.1,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 186708,
                "production": 358679,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 4990,
                "production": 42667,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 37870,
                "production": 80626,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 19771,
                "production": 49036,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 7022,
                "production": 23892,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 1699,
                "production": 8395,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 994,
                "production": 8256,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 8119,
                "production": 16649,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 2633,
                "production": 9924,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 11876,
                "production": 22015,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 420,
                "production": 4901,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 454,
                "production": 4670,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 560,
                "production": 2764,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 222,
                "production": 1756,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 179,
                "production": 935,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 27,
                "production": 1472,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 62,
                "production": 857,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 56,
                "production": 198,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 25,
                "production": 224,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 42,
                "production": 181,
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
            "intra": 195955,
            "extra": 43650
          },
          "production": {
            "intra": 469904,
            "extra": 156947
          },
          "employment": {
            "intra": 0.1,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 195955,
                "production": 469904,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 11644,
                "production": 34018,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 7445,
                "production": 42845,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 15513,
                "production": 49006,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1648,
                "production": 6850,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 738,
                "production": 3334,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 1743,
                "production": 5583,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 638,
                "production": 1342,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 899,
                "production": 2418,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1455,
                "production": 5896,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 977,
                "production": 3072,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 565,
                "production": 1251,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 150,
                "production": 368,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 59,
                "production": 145,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 67,
                "production": 209,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 23,
                "production": 391,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 42,
                "production": 117,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 13,
                "production": 23,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 25,
                "production": 64,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 8,
                "production": 15,
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
            "intra": 106768,
            "extra": 131924
          },
          "production": {
            "intra": 237697,
            "extra": 346429
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 106768,
                "production": 237697,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 35387,
                "production": 99587,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 34994,
                "production": 83433,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 28084,
                "production": 78056,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 5754,
                "production": 16496,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 3630,
                "production": 14114,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 3541,
                "production": 11900,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 12073,
                "production": 17407,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 2274,
                "production": 6760,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1936,
                "production": 7188,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1311,
                "production": 5032,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 931,
                "production": 2530,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1128,
                "production": 1837,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 249,
                "production": 456,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 299,
                "production": 552,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 86,
                "production": 451,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 66,
                "production": 279,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 95,
                "production": 155,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 36,
                "production": 97,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 52,
                "production": 98,
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
            "intra": 58693,
            "extra": 98339
          },
          "production": {
            "intra": 240064,
            "extra": 298082
          },
          "employment": {
            "intra": 0,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 58693,
                "production": 240064,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 53965,
                "production": 126112,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 13386,
                "production": 53700,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 20149,
                "production": 67885,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1958,
                "production": 9189,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 175,
                "production": 2325,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 4902,
                "production": 16065,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 297,
                "production": 1633,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 529,
                "production": 6889,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 391,
                "production": 6020,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1310,
                "production": 4071,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 667,
                "production": 2086,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 405,
                "production": 997,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 15,
                "production": 191,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 148,
                "production": 370,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 5,
                "production": 261,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 20,
                "production": 163,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 5,
                "production": 31,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 8,
                "production": 63,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 4,
                "production": 32,
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
            "intra": 85742,
            "extra": 38793
          },
          "production": {
            "intra": 387992,
            "extra": 144496
          },
          "employment": {
            "intra": 0.1,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 85742,
                "production": 387992,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 4761,
                "production": 21024,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 10721,
                "production": 42703,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 16222,
                "production": 54606,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1198,
                "production": 6442,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 604,
                "production": 2123,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 2728,
                "production": 8156,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 117,
                "production": 419,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 376,
                "production": 1664,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1659,
                "production": 5868,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 221,
                "production": 846,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 96,
                "production": 376,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 61,
                "production": 160,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1,
                "production": 4,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 13,
                "production": 40,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 3,
                "production": 15,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 8,
                "production": 33,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1,
                "production": 4,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 2,
                "production": 11,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 1,
                "production": 2,
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
            "intra": 86434,
            "extra": 188765
          },
          "production": {
            "intra": 158068,
            "extra": 351790
          },
          "employment": {
            "intra": 0,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 86434,
                "production": 158068,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 48191,
                "production": 90970,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 50595,
                "production": 90479,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 45770,
                "production": 87113,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 7815,
                "production": 14914,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 5958,
                "production": 12402,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 9202,
                "production": 16924,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 5459,
                "production": 8798,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 4426,
                "production": 8343,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 5135,
                "production": 9698,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3723,
                "production": 6789,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 955,
                "production": 2303,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 706,
                "production": 1322,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 225,
                "production": 364,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 239,
                "production": 455,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 150,
                "production": 394,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 81,
                "production": 268,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 54,
                "production": 92,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 44,
                "production": 90,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 36,
                "production": 69,
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
            "intra": 30474,
            "extra": 25594
          },
          "production": {
            "intra": 303966,
            "extra": 201903
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 30474,
                "production": 303966,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 3211,
                "production": 32296,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 10419,
                "production": 72985,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 7340,
                "production": 58381,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 990,
                "production": 9067,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 418,
                "production": 4382,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 885,
                "production": 7849,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 77,
                "production": 781,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 211,
                "production": 2342,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1279,
                "production": 8827,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 493,
                "production": 2895,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 97,
                "production": 1049,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 42,
                "production": 333,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 12,
                "production": 70,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 47,
                "production": 222,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 61,
                "production": 279,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 6,
                "production": 87,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1,
                "production": 11,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 5,
                "production": 39,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 1,
                "production": 8,
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
            "intra": 40322,
            "extra": 260553
          },
          "production": {
            "intra": 71798,
            "extra": 422168
          },
          "employment": {
            "intra": 0,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 40322,
                "production": 71798,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 23833,
                "production": 39405,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 85002,
                "production": 144058,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 35168,
                "production": 57618,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 28170,
                "production": 45666,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 11552,
                "production": 18470,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 8376,
                "production": 14034,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 26982,
                "production": 36839,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 5927,
                "production": 10358,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 7611,
                "production": 13095,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 4926,
                "production": 8045,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 4881,
                "production": 7921,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 7575,
                "production": 10941,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 2897,
                "production": 4246,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 3564,
                "production": 5298,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 677,
                "production": 1216,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 884,
                "production": 1453,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1361,
                "production": 1860,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 460,
                "production": 692,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 706,
                "production": 953,
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
            "intra": 168230,
            "extra": 159640
          },
          "production": {
            "intra": 251289,
            "extra": 235935
          },
          "employment": {
            "intra": 0.1,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 168230,
                "production": 251289,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 41691,
                "production": 63031,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 35329,
                "production": 54059,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 36141,
                "production": 52154,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 7898,
                "production": 11788,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 6503,
                "production": 9297,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 7304,
                "production": 10190,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 7245,
                "production": 8994,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 3834,
                "production": 7004,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 4172,
                "production": 6442,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3970,
                "production": 5392,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2051,
                "production": 2782,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1367,
                "production": 1829,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 668,
                "production": 821,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 650,
                "production": 793,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 284,
                "production": 630,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 200,
                "production": 306,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 137,
                "production": 170,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 86,
                "production": 114,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 111,
                "production": 139,
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
            "intra": 51153,
            "extra": 62590
          },
          "production": {
            "intra": 247803,
            "extra": 237380
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 51153,
                "production": 247803,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 25404,
                "production": 84753,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 10689,
                "production": 46669,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 16351,
                "production": 63548,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1507,
                "production": 7353,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 242,
                "production": 2276,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 2999,
                "production": 10803,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 465,
                "production": 2368,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 1566,
                "production": 6657,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1297,
                "production": 5269,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1151,
                "production": 4315,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 597,
                "production": 2052,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 229,
                "production": 730,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 12,
                "production": 77,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 49,
                "production": 209,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 0,
                "production": 105,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 19,
                "production": 109,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 5,
                "production": 28,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 6,
                "production": 41,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 2,
                "production": 18,
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
            "intra": 3184,
            "extra": 6766
          },
          "production": {
            "intra": 226125,
            "extra": 234413
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 3184,
                "production": 226125,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 1197,
                "production": 43753,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1773,
                "production": 77606,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 1238,
                "production": 45589,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 690,
                "production": 21595,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 763,
                "production": 15542,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 380,
                "production": 9904,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 311,
                "production": 6073,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 81,
                "production": 3832,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 17,
                "production": 2380,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 82,
                "production": 2847,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 55,
                "production": 1739,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 70,
                "production": 1333,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 35,
                "production": 608,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 27,
                "production": 502,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 9,
                "production": 195,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 4,
                "production": 331,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 26,
                "production": 426,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 3,
                "production": 71,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 5,
                "production": 90,
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
            "intra": 67744,
            "extra": 37580
          },
          "production": {
            "intra": 267974,
            "extra": 187662
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 67744,
                "production": 267974,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 6389,
                "production": 41257,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 16635,
                "production": 74579,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 8634,
                "production": 41624,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 2652,
                "production": 12125,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 288,
                "production": 1660,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 775,
                "production": 3930,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 470,
                "production": 4250,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 686,
                "production": 2850,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 410,
                "production": 1952,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 247,
                "production": 951,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 207,
                "production": 1569,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 69,
                "production": 365,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 10,
                "production": 29,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 19,
                "production": 77,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 0,
                "production": 1,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 82,
                "production": 407,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 5,
                "production": 23,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 1,
                "production": 12,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 1,
                "production": 3,
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
            "intra": 20975,
            "extra": 115176
          },
          "production": {
            "intra": 89964,
            "extra": 362957
          },
          "employment": {
            "intra": 0,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 20975,
                "production": 89964,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 15737,
                "production": 49648,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 30060,
                "production": 104999,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 17275,
                "production": 59151,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 10365,
                "production": 36038,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 6135,
                "production": 18133,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 5339,
                "production": 17326,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 10219,
                "production": 21255,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 3232,
                "production": 12515,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 4190,
                "production": 13671,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 2974,
                "production": 8614,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 3670,
                "production": 9030,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 2871,
                "production": 5658,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1097,
                "production": 1998,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 933,
                "production": 1950,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 264,
                "production": 996,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 295,
                "production": 990,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 197,
                "production": 351,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 167,
                "production": 355,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 155,
                "production": 281,
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
            "intra": 66394,
            "extra": 21033
          },
          "production": {
            "intra": 295602,
            "extra": 157198
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 66394,
                "production": 295602,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 3614,
                "production": 48095,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 4855,
                "production": 29379,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 3195,
                "production": 27814,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 5206,
                "production": 18020,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 445,
                "production": 10393,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 683,
                "production": 7077,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 393,
                "production": 2122,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 570,
                "production": 2316,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 290,
                "production": 5765,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 266,
                "production": 1443,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 825,
                "production": 2452,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 330,
                "production": 1250,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 1,
                "production": 22,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 92,
                "production": 340,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 26,
                "production": 64,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 105,
                "production": 290,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 3,
                "production": 16,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 132,
                "production": 334,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 0,
                "production": 7,
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
            "intra": 98327,
            "extra": 145458
          },
          "production": {
            "intra": 163938,
            "extra": 279159
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 98327,
                "production": 163938,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 48460,
                "production": 94024,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 29942,
                "production": 59315,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 28152,
                "production": 54566,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 5173,
                "production": 9545,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 6870,
                "production": 14158,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 6854,
                "production": 11487,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 3151,
                "production": 5169,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 6860,
                "production": 13041,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 4512,
                "production": 7399,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3360,
                "production": 6343,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 835,
                "production": 1688,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 371,
                "production": 645,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 273,
                "production": 377,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 184,
                "production": 290,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 197,
                "production": 652,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 145,
                "production": 269,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 46,
                "production": 65,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 49,
                "production": 84,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 24,
                "production": 42,
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
            "intra": 116979,
            "extra": 107336
          },
          "production": {
            "intra": 196059,
            "extra": 223051
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 116979,
                "production": 196059,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 26691,
                "production": 69098,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 27292,
                "production": 54628,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 17850,
                "production": 29608,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 4991,
                "production": 12447,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 3811,
                "production": 7321,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 4513,
                "production": 8228,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 8297,
                "production": 12935,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 3158,
                "production": 8139,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2531,
                "production": 4804,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 2241,
                "production": 4666,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2094,
                "production": 4861,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1835,
                "production": 2549,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 462,
                "production": 784,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 628,
                "production": 948,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 276,
                "production": 652,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 302,
                "production": 724,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 173,
                "production": 249,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 91,
                "production": 268,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 99,
                "production": 141,
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
            "intra": 106989,
            "extra": 27840
          },
          "production": {
            "intra": 269083,
            "extra": 87675
          },
          "employment": {
            "intra": 0.1,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 106989,
                "production": 269083,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 6530,
                "production": 17416,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 8902,
                "production": 26985,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 7237,
                "production": 27003,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 794,
                "production": 2746,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 1155,
                "production": 2813,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 1342,
                "production": 4725,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 229,
                "production": 510,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 247,
                "production": 870,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 816,
                "production": 3171,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 187,
                "production": 511,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 312,
                "production": 667,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 59,
                "production": 156,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 3,
                "production": 5,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 7,
                "production": 24,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 5,
                "production": 19,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 9,
                "production": 39,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 5,
                "production": 9,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 1,
                "production": 5,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 0,
                "production": 1,
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
            "intra": 35443,
            "extra": 111701
          },
          "production": {
            "intra": 94884,
            "extra": 246116
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 35443,
                "production": 94884,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 33193,
                "production": 72182,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 22695,
                "production": 52278,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 29235,
                "production": 59911,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 3098,
                "production": 9638,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 3006,
                "production": 9216,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 3518,
                "production": 10196,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 4663,
                "production": 7043,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 5209,
                "production": 9469,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2611,
                "production": 7107,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 2443,
                "production": 5146,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 777,
                "production": 1644,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 542,
                "production": 852,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 216,
                "production": 356,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 141,
                "production": 262,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 165,
                "production": 399,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 93,
                "production": 241,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 43,
                "production": 67,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 30,
                "production": 70,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 23,
                "production": 39,
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
            "intra": 85105,
            "extra": 182567
          },
          "production": {
            "intra": 94979,
            "extra": 207053
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.2
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 85105,
                "production": 94979,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 34253,
                "production": 41792,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 52872,
                "production": 58148,
                "employment": 0.1
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 55597,
                "production": 61482,
                "employment": 0.1
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 8822,
                "production": 9747,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 3367,
                "production": 4408,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 9533,
                "production": 10620,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 3509,
                "production": 4025,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 2642,
                "production": 3250,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 6476,
                "production": 7129,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 3393,
                "production": 3943,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1294,
                "production": 1460,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 357,
                "production": 442,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 109,
                "production": 132,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 125,
                "production": 150,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 116,
                "production": 191,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 31,
                "production": 49,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 22,
                "production": 27,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 33,
                "production": 40,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 14,
                "production": 17,
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
            "intra": 78034,
            "extra": 45935
          },
          "production": {
            "intra": 173311,
            "extra": 119385
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 78034,
                "production": 173311,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 8504,
                "production": 24023,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 11846,
                "production": 30982,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 15135,
                "production": 34161,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1802,
                "production": 6472,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 697,
                "production": 5208,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 2028,
                "production": 5494,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1373,
                "production": 3137,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 1876,
                "production": 3751,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 572,
                "production": 1041,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1314,
                "production": 2817,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 317,
                "production": 886,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 226,
                "production": 610,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 53,
                "production": 185,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 91,
                "production": 221,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 37,
                "production": 174,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 17,
                "production": 75,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 20,
                "production": 69,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 14,
                "production": 43,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 13,
                "production": 37,
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
            "intra": 175726,
            "extra": 113988
          },
          "production": {
            "intra": 175726,
            "extra": 113988
          },
          "employment": {
            "intra": 0.2,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 175726,
                "production": 175726,
                "employment": 0.2
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 26968,
                "production": 26968,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 26441,
                "production": 26441,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 23301,
                "production": 23301,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 6465,
                "production": 6465,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 5413,
                "production": 5413,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 4605,
                "production": 4605,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 7065,
                "production": 7065,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 3509,
                "production": 3509,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 3316,
                "production": 3316,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 2448,
                "production": 2448,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1380,
                "production": 1380,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 1096,
                "production": 1096,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 735,
                "production": 735,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 472,
                "production": 472,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 279,
                "production": 279,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 170,
                "production": 170,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 140,
                "production": 140,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 87,
                "production": 87,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 98,
                "production": 98,
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
            "intra": 100858,
            "extra": 121474
          },
          "production": {
            "intra": 121868,
            "extra": 153111
          },
          "employment": {
            "intra": 0.1,
            "extra": 0.1
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 100858,
                "production": 121868,
                "employment": 0.1
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 35340,
                "production": 45003,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 29007,
                "production": 36338,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 21118,
                "production": 26893,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 4224,
                "production": 5917,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 3106,
                "production": 4529,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 3576,
                "production": 4950,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 5720,
                "production": 6659,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 8150,
                "production": 9058,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 2971,
                "production": 3725,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 2574,
                "production": 3310,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1350,
                "production": 1838,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 2303,
                "production": 2499,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 258,
                "production": 303,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 329,
                "production": 386,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 1085,
                "production": 1231,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 141,
                "production": 216,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 113,
                "production": 123,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 45,
                "production": 61,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 65,
                "production": 73,
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
            "intra": 19160,
            "extra": 39283
          },
          "production": {
            "intra": 101423,
            "extra": 158415
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 19160,
                "production": 101423,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 6775,
                "production": 31274,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 16337,
                "production": 41602,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 5580,
                "production": 44552,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1080,
                "production": 5940,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 772,
                "production": 5088,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 1068,
                "production": 4444,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 5004,
                "production": 8248,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 999,
                "production": 6256,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 725,
                "production": 7624,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 482,
                "production": 1790,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 170,
                "production": 731,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 125,
                "production": 354,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 28,
                "production": 83,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 51,
                "production": 126,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 26,
                "production": 120,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 32,
                "production": 105,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 11,
                "production": 27,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 9,
                "production": 30,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 7,
                "production": 22,
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
            "intra": 44335,
            "extra": 23426
          },
          "production": {
            "intra": 156676,
            "extra": 87071
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 44335,
                "production": 156676,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 5821,
                "production": 29441,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 5108,
                "production": 17699,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 6284,
                "production": 22245,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 876,
                "production": 2879,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 214,
                "production": 719,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 1572,
                "production": 4579,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 223,
                "production": 640,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 1453,
                "production": 3513,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1061,
                "production": 2907,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 414,
                "production": 1218,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 163,
                "production": 668,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 86,
                "production": 240,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 50,
                "production": 89,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 33,
                "production": 79,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 36,
                "production": 64,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 13,
                "production": 50,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 6,
                "production": 12,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 9,
                "production": 20,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 6,
                "production": 11,
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
            "intra": 64219,
            "extra": 34446
          },
          "production": {
            "intra": 158506,
            "extra": 85216
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 64219,
                "production": 158506,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 10471,
                "production": 27238,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 6766,
                "production": 16090,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 8247,
                "production": 19974,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1511,
                "production": 4475,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 2468,
                "production": 5685,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 1575,
                "production": 3802,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 609,
                "production": 1385,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 315,
                "production": 716,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1164,
                "production": 2678,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 589,
                "production": 1424,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 263,
                "production": 798,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 234,
                "production": 454,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 75,
                "production": 157,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 89,
                "production": 174,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 14,
                "production": 42,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 13,
                "production": 30,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 16,
                "production": 30,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 21,
                "production": 51,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 6,
                "production": 12,
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
            "intra": 11503,
            "extra": 18543
          },
          "production": {
            "intra": 90059,
            "extra": 137457
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 11503,
                "production": 90059,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 4664,
                "production": 39704,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 4130,
                "production": 27791,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 4151,
                "production": 29310,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 851,
                "production": 6879,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 935,
                "production": 9424,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 1104,
                "production": 7653,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1053,
                "production": 3793,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 605,
                "production": 3757,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 316,
                "production": 3204,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 311,
                "production": 2526,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 108,
                "production": 1407,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 146,
                "production": 715,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 58,
                "production": 254,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 48,
                "production": 257,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 20,
                "production": 451,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 11,
                "production": 158,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 16,
                "production": 65,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 8,
                "production": 57,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 8,
                "production": 52,
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
            "intra": 28794,
            "extra": 51394
          },
          "production": {
            "intra": 65345,
            "extra": 121362
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 28794,
                "production": 65345,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 10550,
                "production": 22448,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 8870,
                "production": 26829,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 9487,
                "production": 21154,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 5480,
                "production": 13014,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 3345,
                "production": 6626,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 3030,
                "production": 6950,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 3157,
                "production": 6147,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 380,
                "production": 2695,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1918,
                "production": 4709,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 1789,
                "production": 3819,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 1389,
                "production": 3097,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 817,
                "production": 1395,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 594,
                "production": 896,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 342,
                "production": 585,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 39,
                "production": 354,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 25,
                "production": 309,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 82,
                "production": 127,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 74,
                "production": 138,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 26,
                "production": 69,
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
            "intra": 29877,
            "extra": 37323
          },
          "production": {
            "intra": 74547,
            "extra": 99327
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 29877,
                "production": 74547,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 10322,
                "production": 30160,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 8008,
                "production": 20406,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 8264,
                "production": 22693,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1572,
                "production": 4311,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 1703,
                "production": 4484,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 1697,
                "production": 4875,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1699,
                "production": 2824,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 1141,
                "production": 2814,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1008,
                "production": 2544,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 852,
                "production": 2101,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 353,
                "production": 835,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 280,
                "production": 447,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 143,
                "production": 221,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 106,
                "production": 176,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 62,
                "production": 223,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 41,
                "production": 101,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 30,
                "production": 43,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 21,
                "production": 35,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 22,
                "production": 32,
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
            "intra": 18172,
            "extra": 17965
          },
          "production": {
            "intra": 79402,
            "extra": 79719
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 18172,
                "production": 79402,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 6860,
                "production": 26216,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 2055,
                "production": 11508,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 3304,
                "production": 19645,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 660,
                "production": 3207,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 1565,
                "production": 4575,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 1699,
                "production": 7093,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 195,
                "production": 602,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 143,
                "production": 761,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 1201,
                "production": 4920,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 116,
                "production": 540,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 41,
                "production": 267,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 93,
                "production": 257,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 2,
                "production": 9,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 25,
                "production": 75,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 0,
                "production": 11,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 1,
                "production": 15,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 2,
                "production": 5,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 2,
                "production": 10,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 1,
                "production": 3,
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
            "intra": 23471,
            "extra": 22885
          },
          "production": {
            "intra": 69494,
            "extra": 82203
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 23471,
                "production": 69494,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 5315,
                "production": 23460,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 9245,
                "production": 24479,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 3792,
                "production": 16853,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1121,
                "production": 3931,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 364,
                "production": 2588,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 615,
                "production": 2938,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 846,
                "production": 1950,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 732,
                "production": 2272,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 329,
                "production": 1609,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 264,
                "production": 1063,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 110,
                "production": 493,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 73,
                "production": 210,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 20,
                "production": 67,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 25,
                "production": 85,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 15,
                "production": 107,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 9,
                "production": 53,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 6,
                "production": 16,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 2,
                "production": 17,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 3,
                "production": 11,
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
            "intra": 2355,
            "extra": 23971
          },
          "production": {
            "intra": 48802,
            "extra": 86321
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 2355,
                "production": 48802,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 1420,
                "production": 17080,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 438,
                "production": 12433,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 4489,
                "production": 17756,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 99,
                "production": 3103,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 16293,
                "production": 26929,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 502,
                "production": 2814,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 125,
                "production": 1153,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 7,
                "production": 929,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 315,
                "production": 1699,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 2,
                "production": 866,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 0,
                "production": 527,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 169,
                "production": 482,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 55,
                "production": 145,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 9,
                "production": 97,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 0,
                "production": 88,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 2,
                "production": 90,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 44,
                "production": 83,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 0,
                "production": 25,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 2,
                "production": 20,
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
            "intra": 17166,
            "extra": 23009
          },
          "production": {
            "intra": 60067,
            "extra": 64182
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 17166,
                "production": 60067,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 7340,
                "production": 17235,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 7927,
                "production": 21488,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 4239,
                "production": 13728,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 776,
                "production": 3168,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 112,
                "production": 580,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 543,
                "production": 2401,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1267,
                "production": 2418,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 189,
                "production": 809,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 174,
                "production": 944,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 70,
                "production": 331,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 252,
                "production": 709,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 66,
                "production": 188,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 0,
                "production": 10,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 11,
                "production": 43,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 0,
                "production": 21,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 35,
                "production": 83,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 4,
                "production": 10,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 2,
                "production": 13,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 0,
                "production": 2,
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
            "intra": 7996,
            "extra": 37707
          },
          "production": {
            "intra": 27050,
            "extra": 89823
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 7996,
                "production": 27050,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 6045,
                "production": 12673,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 13434,
                "production": 28488,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 2874,
                "production": 11603,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 3300,
                "production": 9466,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 768,
                "production": 3117,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 1097,
                "production": 3743,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 2576,
                "production": 4447,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 2372,
                "production": 4575,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 971,
                "production": 2981,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 974,
                "production": 2462,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 2054,
                "production": 3693,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 191,
                "production": 617,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 425,
                "production": 636,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 198,
                "production": 365,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 75,
                "production": 303,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 160,
                "production": 379,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 38,
                "production": 59,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 132,
                "production": 178,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 21,
                "production": 37,
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
            "intra": 11976,
            "extra": 32692
          },
          "production": {
            "intra": 33911,
            "extra": 82641
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 11976,
                "production": 33911,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 10321,
                "production": 26122,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 6687,
                "production": 17564,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 7223,
                "production": 19125,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1458,
                "production": 3676,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 1314,
                "production": 3339,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 1369,
                "production": 3041,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1457,
                "production": 3238,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 577,
                "production": 1609,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 709,
                "production": 1647,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 637,
                "production": 1355,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 329,
                "production": 797,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 310,
                "production": 550,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 68,
                "production": 112,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 93,
                "production": 157,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 40,
                "production": 122,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 39,
                "production": 84,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 23,
                "production": 37,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 17,
                "production": 34,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 22,
                "production": 33,
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
            "intra": 316,
            "extra": 15740
          },
          "production": {
            "intra": 25453,
            "extra": 71597
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 316,
                "production": 25453,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 178,
                "production": 11483,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 6730,
                "production": 23986,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 4249,
                "production": 16857,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 302,
                "production": 3299,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 49,
                "production": 1526,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 9,
                "production": 1683,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 3927,
                "production": 8198,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 94,
                "production": 1725,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 93,
                "production": 1228,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 28,
                "production": 761,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 15,
                "production": 386,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 34,
                "production": 194,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 11,
                "production": 48,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 11,
                "production": 59,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 5,
                "production": 90,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 0,
                "production": 46,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 1,
                "production": 10,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 0,
                "production": 8,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 1,
                "production": 7,
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
            "intra": 11859,
            "extra": 34335
          },
          "production": {
            "intra": 15997,
            "extra": 46450
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 11859,
                "production": 15997,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 13904,
                "production": 17857,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 6588,
                "production": 8914,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 7538,
                "production": 10366,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1342,
                "production": 1823,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 802,
                "production": 1522,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 908,
                "production": 1635,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 618,
                "production": 760,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 1033,
                "production": 1413,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 490,
                "production": 707,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 618,
                "production": 824,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 235,
                "production": 302,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 127,
                "production": 148,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 13,
                "production": 17,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 26,
                "production": 33,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 63,
                "production": 86,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 16,
                "production": 25,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 3,
                "production": 4,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 7,
                "production": 10,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 3,
                "production": 3,
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
            "intra": 11178,
            "extra": 16243
          },
          "production": {
            "intra": 21304,
            "extra": 30494
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 11178,
                "production": 21304,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 4852,
                "production": 8826,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 3415,
                "production": 6761,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 3803,
                "production": 7294,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 638,
                "production": 1275,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 632,
                "production": 1262,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 835,
                "production": 1483,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 489,
                "production": 729,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 374,
                "production": 752,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 497,
                "production": 913,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 383,
                "production": 646,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 128,
                "production": 238,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 82,
                "production": 124,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 29,
                "production": 44,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 35,
                "production": 50,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 20,
                "production": 42,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 9,
                "production": 23,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 8,
                "production": 11,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 6,
                "production": 10,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 6,
                "production": 8,
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
            "intra": 3195,
            "extra": 5672
          },
          "production": {
            "intra": 7476,
            "extra": 12686
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 3195,
                "production": 7476,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 778,
                "production": 1829,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 898,
                "production": 2432,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 870,
                "production": 2140,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 695,
                "production": 1536,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 198,
                "production": 460,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 286,
                "production": 701,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 474,
                "production": 794,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 362,
                "production": 685,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 211,
                "production": 536,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 129,
                "production": 271,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 195,
                "production": 388,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 157,
                "production": 259,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 160,
                "production": 233,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 128,
                "production": 190,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 20,
                "production": 44,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 46,
                "production": 89,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 21,
                "production": 31,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 19,
                "production": 31,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 26,
                "production": 36,
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
            "intra": 2518,
            "extra": 11351
          },
          "production": {
            "intra": 3183,
            "extra": 14323
          },
          "employment": {
            "intra": 0,
            "extra": 0
          }
        },
        "by_territory": {
          "regions": [
            {
              "code": "08",
              "name": "Emilia-Romagna",
              "values": {
                "gdp": 2518,
                "production": 3183,
                "employment": 0
              }
            },
            {
              "code": "09",
              "name": "Toscana",
              "values": {
                "gdp": 1544,
                "production": 1981,
                "employment": 0
              }
            },
            {
              "code": "03",
              "name": "Lombardia",
              "values": {
                "gdp": 1770,
                "production": 2353,
                "employment": 0
              }
            },
            {
              "code": "05",
              "name": "Veneto",
              "values": {
                "gdp": 1334,
                "production": 1667,
                "employment": 0
              }
            },
            {
              "code": "01",
              "name": "Piemonte",
              "values": {
                "gdp": 1503,
                "production": 1887,
                "employment": 0
              }
            },
            {
              "code": "07",
              "name": "Liguria",
              "values": {
                "gdp": 437,
                "production": 576,
                "employment": 0
              }
            },
            {
              "code": "11",
              "name": "Marche",
              "values": {
                "gdp": 658,
                "production": 861,
                "employment": 0
              }
            },
            {
              "code": "12",
              "name": "Lazio",
              "values": {
                "gdp": 1042,
                "production": 1245,
                "employment": 0
              }
            },
            {
              "code": "04",
              "name": "Trentino-Alto Adige",
              "values": {
                "gdp": 704,
                "production": 827,
                "employment": 0
              }
            },
            {
              "code": "06",
              "name": "Friuli-Venezia Giulia",
              "values": {
                "gdp": 470,
                "production": 603,
                "employment": 0
              }
            },
            {
              "code": "10",
              "name": "Umbria",
              "values": {
                "gdp": 248,
                "production": 322,
                "employment": 0
              }
            },
            {
              "code": "13",
              "name": "Abruzzo",
              "values": {
                "gdp": 500,
                "production": 642,
                "employment": 0
              }
            },
            {
              "code": "15",
              "name": "Campania",
              "values": {
                "gdp": 360,
                "production": 426,
                "employment": 0
              }
            },
            {
              "code": "20",
              "name": "Sardegna",
              "values": {
                "gdp": 272,
                "production": 312,
                "employment": 0
              }
            },
            {
              "code": "16",
              "name": "Puglia",
              "values": {
                "gdp": 238,
                "production": 271,
                "employment": 0
              }
            },
            {
              "code": "02",
              "name": "Valle d'Aosta",
              "values": {
                "gdp": 56,
                "production": 79,
                "employment": 0
              }
            },
            {
              "code": "14",
              "name": "Molise",
              "values": {
                "gdp": 113,
                "production": 149,
                "employment": 0
              }
            },
            {
              "code": "19",
              "name": "Sicilia",
              "values": {
                "gdp": 26,
                "production": 30,
                "employment": 0
              }
            },
            {
              "code": "17",
              "name": "Basilicata",
              "values": {
                "gdp": 40,
                "production": 49,
                "employment": 0
              }
            },
            {
              "code": "18",
              "name": "Calabria",
              "values": {
                "gdp": 37,
                "production": 43,
                "employment": 0
              }
            }
          ]
        }
      }
    ]
  }
};

export const MUBA_ECBA_DATASET = {
  "kpi": {
    "investimento": 19.8,
    "orizzonte": 25,
    "tasso": 3.5,
    "vane": 23.71,
    "tire": 25.6,
    "bcr": 2.48,
    "paybackAnno": 5,
    "progetto": "MUBA — Polo culturale di Bologna",
    "luogo": "provincia di Bologna",
    "categoria": "Cultura e valorizzazione del territorio"
  },
  "waterfall": {
    "benefici": 40.18,
    "costi": 16.04,
    "esternalitaNeg": 0.44,
    "vane": 23.71
  },
  "cashflow": {
    "cost": [
      3.29,
      2.94,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63,
      0.63
    ],
    "ben": [
      0,
      0,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44,
      2.44
    ]
  },
  "donut": [
    {
      "label": "Riduzione dispersione scolastica",
      "pct": 43,
      "color": "#4400B3",
      "code": "KPI469"
    },
    {
      "label": "Accesso equalizzato a servizi culturali",
      "pct": 22,
      "color": "#6E1AFF",
      "code": "KPI471"
    },
    {
      "label": "Valorizzazione immobiliare dell'area",
      "pct": 20,
      "color": "#ae81fd",
      "code": "KPI475"
    },
    {
      "label": "Supporto genitorialità e qualità tempo familiare",
      "pct": 6,
      "color": "#B9FF69",
      "code": "KPI472"
    },
    {
      "label": "Rigenerazione urbana",
      "pct": 5,
      "color": "#270065",
      "code": "KPI473"
    },
    {
      "label": "Valore visite scolastiche programmate",
      "pct": 4,
      "color": "#9E7BFA",
      "code": "KPI470"
    },
    {
      "label": "Integrazione linguistica",
      "pct": 0,
      "color": "#3A148F",
      "code": "KPI477"
    },
    {
      "label": "Sviluppo cognitivo",
      "pct": 0,
      "color": "#C7F03A",
      "code": "KPI476"
    },
    {
      "label": "Emissioni CO2e evitate",
      "pct": 0,
      "color": "#5B21F7",
      "code": "KPI474"
    }
  ],
  "_riskIllustrative": true,
  "sensitivity": [
    {
      "name": "Costi di investimento",
      "sub": "±10%",
      "low": 17.1,
      "high": 30.3
    },
    {
      "name": "Parametri delle esternalità",
      "sub": "±10%",
      "low": 18.7,
      "high": 28.7
    },
    {
      "name": "Tasso di crescita della domanda",
      "sub": "±1 p.p.",
      "low": 19.4,
      "high": 28
    },
    {
      "name": "Costi di gestione (OPEX)",
      "sub": "±10%",
      "low": 20.9,
      "high": 26.6
    },
    {
      "name": "Tasso di sconto sociale",
      "sub": "±0,5 p.p.",
      "low": 21.3,
      "high": 26.1
    }
  ],
  "montecarlo": {
    "start": 6,
    "w": 4,
    "freq": [
      1,
      2,
      5,
      11,
      18,
      22,
      18,
      12,
      7,
      3,
      1
    ],
    "base": 23.71
  },
  "riskSummary": {
    "probPositive": 0.95,
    "median": 23.71,
    "mean": 23.2,
    "std": 8.3,
    "p5": 10.7,
    "p95": 36.8,
    "criticalVar": "Costi di investimento"
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
    "benefici": 39.74,
    "costiTotali": 16.04,
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
