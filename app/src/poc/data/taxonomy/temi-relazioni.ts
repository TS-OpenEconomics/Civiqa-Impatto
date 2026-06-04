import type { TemaRelazione } from "../../types/incroci"

export const TEMI_RELAZIONI: TemaRelazione[] = [
  {
    "id": "TEMA-01",
    "label": "Istruzione e formazione",
    "descrizione": "Istruzione e formazione",
    "nomeOpenCoesione": "Istruzione e formazione",
    "missioniDup": [
      {
        "id": "MIS-04",
        "codice": "04",
        "label": "Istruzione e diritto allo studio"
      }
    ],
    "policyObjectivesUe": [],
    "rsoPrimari": [],
    "besDomains": [
      "Istruzione e formazione"
    ],
    "indicatori": [
      {
        "id": "IND-001",
        "code": "com_avg_indice_raggiungibilita_scuole_y",
        "label": "indice accessibilità scuola a livello comunale",
        "note": "Accessibilità fisica alle scuole a livello comunale. Basso indice = barriera geografica all'istruzione."
      },
      {
        "id": "IND-002",
        "code": "laureate_f_su_totale_popolazione_laureata",
        "label": "% laureate (F) su totale popolazione laureata",
        "note": "% laureate donne sul totale laureati. Misura la parità di genere negli outcome formativi superiori."
      },
      {
        "id": "IND-003",
        "code": "com_ratio_obsalue_15under_y",
        "label": "% popolazione under 15",
        "note": "% popolazione under 15. Variabile demografica che quantifica la domanda potenziale di servizi scolastici."
      },
      {
        "id": "IND-004",
        "code": "com_ratio_importocumulato_spesa_istruzione_procapite_y",
        "label": "Spesa pubblica pro-capite per l’istruzione",
        "note": "Spesa pro-capite per istruzione. Proxy dell'impegno finanziario dell'ente nell'istruzione."
      },
      {
        "id": "IND-005",
        "code": "studentesse_universitarie_su_totale_popolazione_studenti_universitari",
        "label": "% studentesse universitarie su totale popolazione studenti universitari",
        "note": "% studentesse universitarie. Misura la parità di genere nell'accesso all'istruzione universitaria."
      },
      {
        "id": "IND-006",
        "code": "com_ratio_popolazione_altaformazione_y",
        "label": "% studenti universitari rispetto popolazione + % laureati o con formazione post laurea (incl. dottorato)",
        "note": "Stock di laureati e alta formazione sulla popolazione. Indicatore primario del capitale umano locale."
      },
      {
        "id": "IND-007",
        "code": "com_sum_obsvalue_neet_index_15_24_y",
        "label": "Tasso stimato di NEET su pop. 15-24",
        "note": "Tasso NEET 15-24. Giovani né in istruzione né al lavoro. Indicatore primario di dispersione formativa giovanile."
      },
      {
        "id": "IND-008",
        "code": "com_ratio_edifici_kmq_y",
        "label": "# edifici scolastici (per km2)",
        "note": "# edifici scolastici per km2. Misura direttamente la dotazione fisica dell'offerta scolastica."
      }
    ],
    "noteRaccordo": "Coincidenza quasi perfetta tra label OC, DUP e BES. Unico tema dove i quattro sistemi convergono con lo stesso nome."
  },
  {
    "id": "TEMA-02",
    "label": "Inclusione sociale",
    "descrizione": "Inclusione sociale",
    "nomeOpenCoesione": "Inclusione sociale e salute (parziale)",
    "missioniDup": [
      {
        "id": "MIS-12",
        "codice": "12",
        "label": "Diritti sociali, politiche sociali e famiglia"
      }
    ],
    "policyObjectivesUe": [],
    "rsoPrimari": [],
    "besDomains": [
      "Relazioni sociali",
      "Qualità dei servizi"
    ],
    "indicatori": [
      {
        "id": "IND-009",
        "code": "com_ratio_obsvalue_immregolari_y",
        "label": "% immigrati regolari risp. popolazione totale",
        "note": "% immigrati regolari: variabile di contesto per politiche di inclusione. Quantifica domanda potenziale di servizi."
      },
      {
        "id": "IND-010",
        "code": "com_src_index_acces_essent_services_y",
        "label": "Indice di accessibilità ai servizi essenziali",
        "note": "Accessibilità ai servizi essenziali (salute, scuola, trasporti). Misura direttamente l'inclusione territoriale."
      },
      {
        "id": "IND-011",
        "code": "com_ratio_indice_vecchiaia_y",
        "label": "indice_vecchiaia",
        "note": "Indice di vecchiaia: variabile demografica che quantifica la pressione sulla domanda di servizi sociali e sanitari."
      },
      {
        "id": "IND-012",
        "code": "com_ratio_importocumulato_spesa_famiglie_procapite_y",
        "label": "Spesa pubblica pro-capite per le famiglie",
        "note": "Spesa pro-capite per famiglie. Proxy delle politiche sociali per il sostegno alla famiglia."
      },
      {
        "id": "IND-013",
        "code": "com_ratio_indice_dipendenza_y",
        "label": "indice di dipendenza",
        "note": "Indice di dipendenza demografica. Variabile di contesto che quantifica la pressione sui servizi di welfare."
      },
      {
        "id": "IND-014",
        "code": "com_ratio_obsvalue_fertilityrate_y",
        "label": "Tasso di fertilità",
        "note": "Tasso di fertilità. Contesto demografico per pianificazione servizi infanzia e politiche familiari."
      },
      {
        "id": "IND-015",
        "code": "com_index_proxservices_y",
        "label": "Indice di prossimità dei servizi",
        "note": "Indice di prossimità dei servizi. Proxy dell'inclusione territoriale."
      }
    ],
    "noteRaccordo": "Estratto dal tema OC 'Inclusione sociale e salute'. Perimetro comunale: servizi sociali, strutture per anziani/disabili, edilizia residenziale pubblica, asili nido."
  },
  {
    "id": "TEMA-03",
    "label": "Salute e sanità",
    "descrizione": "Salute e sanità",
    "nomeOpenCoesione": "Inclusione sociale e salute (parziale)",
    "missioniDup": [
      {
        "id": "MIS-13",
        "codice": "13",
        "label": "Tutela della salute"
      }
    ],
    "policyObjectivesUe": [],
    "rsoPrimari": [],
    "besDomains": [
      "Salute",
      "Qualità dei servizi"
    ],
    "indicatori": [
      {
        "id": "IND-016",
        "code": "com_ratio_obsvalue_deaths_y",
        "label": "% morti rispetto popolazione",
        "note": "% morti su popolazione: variabile demografica di sfondo. Richiede contestualizzazione per struttura per età."
      },
      {
        "id": "IND-017",
        "code": "com_ratio_farmacieepara_kmq_y (com_ratio_parafarmacie_kmq_y + com_ratio_farmacie_kmq_y)",
        "label": "Numero di farmacie e parafarmacie (per km2)",
        "note": "Dotazione farmaceutica per km2. Riclassificato da Governance a Salute: misura prossimità ai servizi sanitari di primo livello."
      },
      {
        "id": "IND-018",
        "code": "com_ratio_istituti_cura_kmq_y",
        "label": "Numero di istituti di cura per km2",
        "note": "Dotazione istituti di cura per km2. Riclassificato da Governance a Salute: misura prossimità all'offerta sanitaria."
      },
      {
        "id": "IND-019",
        "code": "com_ratio_posti_letto_percapita_y",
        "label": "Numero di posti letto per abitante",
        "note": "Posti letto ospedalieri per abitante. Riclassificato da Governance a Salute: indicatore primario capacità ospedaliera."
      }
    ],
    "noteRaccordo": "Separato da Inclusione sociale per rilevanza di budget. Perimetro varia molto: marginale per comuni piccoli (delegato ad ASL), centrale per Regioni."
  },
  {
    "id": "TEMA-04",
    "label": "Ambiente e territorio",
    "descrizione": "Ambiente e territorio",
    "nomeOpenCoesione": "Ambiente",
    "missioniDup": [
      {
        "id": "MIS-09",
        "codice": "09",
        "label": "Sviluppo sostenibile e tutela del territorio e dell'ambiente"
      }
    ],
    "policyObjectivesUe": [],
    "rsoPrimari": [],
    "besDomains": [
      "Ambiente",
      "Paesaggio e patrimonio culturale"
    ],
    "indicatori": [
      {
        "id": "IND-020",
        "code": "com_src_consumosuolo_percentuale_y",
        "label": "% di suolo consumato",
        "note": "Indicatore primario di pressione antropica. Alto consumo di suolo = criticità ambientale diretta."
      },
      {
        "id": "IND-021",
        "code": "com_src_superficiealterata_consumosuolo_percentuale_y",
        "label": "% di superfice alterata",
        "note": "Superficie irreversibilmente alterata. Complementare al consumo di suolo, misura perdita di capacità ecologica."
      },
      {
        "id": "IND-022",
        "code": "com_src_percentuale_rd_y",
        "label": "Raccolta differenziata per ab.",
        "note": "Raccolta differenziata per abitante. Misura direttamente la performance ambientale nella gestione rifiuti."
      },
      {
        "id": "IND-023",
        "code": "com_ratio_ru_t_procapite_y",
        "label": "Rifiuti prodotti (ton. per ab.)",
        "note": "Rifiuti prodotti per abitante. Indicatore di pressione ambientale nella gestione dei rifiuti urbani."
      },
      {
        "id": "IND-024",
        "code": "com_src_isolacaloreurbano_y",
        "label": "Isola di calore urbano",
        "note": "Isola di calore urbano. Misura direttamente l'impatto del cambiamento climatico sul tessuto urbano."
      },
      {
        "id": "IND-025",
        "code": "com_procapite_landuse_areakmq_brownfield_y",
        "label": "Area brown field",
        "note": "Area brown field pro-capite. Proxy presenza aree industriali dismesse. Alta = criticità ambientale e urbanistica."
      },
      {
        "id": "IND-026",
        "code": "com_procapite_landuse_areakmq_green_area_y",
        "label": "Nature and Green Area",
        "note": "Verde urbano pro-capite. Indicatore primario della qualità ambientale urbana."
      }
    ],
    "noteRaccordo": "Label utente aggiunge 'territorio' rispetto a OC. Si distribuisce su più RSO del PO2. Separato da Energia perché genera categorie di intervento fisicamente diverse."
  },
  {
    "id": "TEMA-05",
    "label": "Energia e transizione energetica",
    "descrizione": "Energia e transizione energetica",
    "nomeOpenCoesione": "Energia",
    "missioniDup": [
      {
        "id": "MIS-09",
        "codice": "09",
        "label": "Sviluppo sostenibile e tutela del territorio e dell'ambiente"
      }
    ],
    "policyObjectivesUe": [],
    "rsoPrimari": [],
    "besDomains": [
      "Ambiente"
    ],
    "indicatori": [
      {
        "id": "IND-027",
        "code": "com_src_obsvalue_highemissmotorrate_per100inha_y",
        "label": "Numero di veicoli ad alta emissioni per 100 ab.",
        "note": "% veicoli ad alta emissione. Assegnato a TEMA-05: misura pressione inquinante legata a decarbonizzazione trasporti."
      }
    ],
    "noteRaccordo": "Stesso PO2 e stessa Missione DUP di Ambiente, ma categorie di intervento diverse (FER, cappotti, LED). Separazione giustificata operativamente."
  },
  {
    "id": "TEMA-06",
    "label": "Mobilità e infrastrutture",
    "descrizione": "Mobilità e infrastrutture",
    "nomeOpenCoesione": "Trasporti e mobilità",
    "missioniDup": [
      {
        "id": "MIS-08",
        "codice": "08",
        "label": "Assetto del territorio ed edilizia abitativa"
      },
      {
        "id": "MIS-10",
        "codice": "10",
        "label": "Trasporti e diritto alla mobilità"
      }
    ],
    "policyObjectivesUe": [],
    "rsoPrimari": [],
    "besDomains": [
      "Qualità dei servizi",
      "Sicurezza"
    ],
    "indicatori": [
      {
        "id": "IND-028",
        "code": "com_ratio_veicoli_kmq_y",
        "label": "Numero auto per area (km2)",
        "note": "Densità veicoli per km2. Proxy della dipendenza dal mezzo privato e della congestione urbana."
      },
      {
        "id": "IND-029",
        "code": "com_ratio_incidentiferiti_percapita_y",
        "label": "Numero di incidenti con feriti per ab.",
        "note": "Incidentalità stradale per abitante. Misura direttamente la sicurezza della rete di mobilità."
      },
      {
        "id": "IND-030",
        "code": "com_ratio_mezzipubbliciperutente_y",
        "label": "Numero di mezzi pubblici per ab.",
        "note": "Offerta di mezzi pubblici per abitante. Misura direttamente la qualità del trasporto pubblico locale."
      },
      {
        "id": "IND-031",
        "code": "com_ratio_mortiferiti_incidenti_y",
        "label": "rapporto tra feriti e morti e numero di incidenti (indice gravita incidenti)",
        "note": "Indice di gravità incidenti stradali. Complementare al tasso incidentalità, misura la severità degli eventi."
      },
      {
        "id": "IND-032",
        "code": "com_ratio_importocumulato_spesa_trasporti_procapite_y",
        "label": "Spesa pubblica pro-capite per i trasporti",
        "note": "Spesa pubblica pro-capite trasporti. Proxy impegno finanziario del comune sulla mobilità."
      }
    ],
    "noteRaccordo": "M08 è infrastruttura fisica (strade, ponti, piste ciclabili), M10 è il servizio (TPL, mobilità condivisa). Entrambi pertinenti per province e comuni medi."
  },
  {
    "id": "TEMA-07",
    "label": "Cultura e turismo",
    "descrizione": "Cultura e turismo",
    "nomeOpenCoesione": "Cultura e turismo",
    "missioniDup": [
      {
        "id": "MIS-05",
        "codice": "05",
        "label": "Tutela e valorizzazione dei beni e delle attività culturali i"
      },
      {
        "id": "MIS-07",
        "codice": "07",
        "label": "Turismo"
      }
    ],
    "policyObjectivesUe": [],
    "rsoPrimari": [],
    "besDomains": [
      "Paesaggio e patrimonio culturale"
    ],
    "indicatori": [
      {
        "id": "IND-033",
        "code": "com_ratio_biblioteche_kmq_y",
        "label": "Numero di biblioteche (per km2)",
        "note": "Dotazione di biblioteche per km2. Misura direttamente l'offerta di servizi culturali di prossimità."
      },
      {
        "id": "IND-034",
        "code": "com_ratio_musei_kmq_y",
        "label": "Numero di musei (per km2)",
        "note": "Dotazione museale per km2. Misura direttamente l'offerta culturale del territorio."
      },
      {
        "id": "IND-035",
        "code": "com_ratio_presenzeturistiche_percapita_y",
        "label": "Numero di presenze turistiche per ab.",
        "note": "Presenze turistiche per abitante. Misura direttamente l'attrattività turistica del territorio."
      },
      {
        "id": "IND-036",
        "code": "com_src_visitatorimusei_y",
        "label": "Numero di visitatori musei",
        "note": "Visitatori ai musei. Indicatore di fruizione culturale effettiva, non solo dotazione fisica."
      },
      {
        "id": "IND-037",
        "code": "com_ratio_importocumulato_spesa_cultura_procapite_y",
        "label": "Spesa pubblica pro-capite per la cultura",
        "note": "Spesa pro-capite per cultura. Proxy dell'impegno finanziario del comune sull'offerta culturale."
      },
      {
        "id": "IND-038",
        "code": "com_index_vitality_y",
        "label": "Indice di vitalità del settore ospitalità e tempo libero",
        "note": "Indice vitalità settore ospitalità e tempo libero. Proxy dell'attrattività turistica e vivacità ricettiva locale."
      }
    ],
    "noteRaccordo": "Due Missioni DUP distinte ma stesso RSO UE. Per i comuni il perimetro reale è patrimonio culturale locale (chiese, musei, centri storici)."
  },
  {
    "id": "TEMA-08",
    "label": "Sport e tempo libero",
    "descrizione": "Sport e tempo libero",
    "nomeOpenCoesione": "Inclusione sociale e salute (parziale)",
    "missioniDup": [
      {
        "id": "MIS-06",
        "codice": "06",
        "label": "Politiche giovanili, sport e tempo libero"
      }
    ],
    "policyObjectivesUe": [],
    "rsoPrimari": [],
    "besDomains": [
      "Relazioni sociali"
    ],
    "indicatori": [
      {
        "id": "IND-039",
        "code": "com_procapite_landuse_areakmq_open_spaces_y",
        "label": "Spazi aperti destinati allo svago",
        "note": "Spazi aperti allo svago pro-capite. Misura direttamente la disponibilità di aree per attività ricreative."
      }
    ],
    "noteRaccordo": "Non ha tema OC dedicato — distribuito tra Inclusione e Cultura. Ha Missione DUP propria (M06) e categorie di intervento specifiche (impianti sportivi, parchi). Tema autonomo giustificato."
  },
  {
    "id": "TEMA-09",
    "label": "Ricerca e innovazione",
    "descrizione": "Ricerca e innovazione",
    "nomeOpenCoesione": "Ricerca e innovazione",
    "missioniDup": [
      {
        "id": "MIS-14",
        "codice": "14",
        "label": "Sviluppo economico e competitività"
      }
    ],
    "policyObjectivesUe": [],
    "rsoPrimari": [],
    "besDomains": [
      "Innovazione, ricerca e creatività"
    ],
    "indicatori": [],
    "noteRaccordo": "Perimetro principalmente regionale e nazionale. Per comuni: distretti tecnologici, poli universitari, laboratori pubblici."
  },
  {
    "id": "TEMA-10",
    "label": "Competitività e occupazione",
    "descrizione": "Competitività e occupazione",
    "nomeOpenCoesione": "Competitività delle imprese · Occupazione e lavoro",
    "missioniDup": [
      {
        "id": "MIS-14",
        "codice": "14",
        "label": "Sviluppo economico e competitività"
      },
      {
        "id": "MIS-15",
        "codice": "15",
        "label": "Politiche per il lavoro e la formazione professionale"
      }
    ],
    "policyObjectivesUe": [],
    "rsoPrimari": [],
    "besDomains": [
      "Benessere economico",
      "Lavoro e conciliazione dei tempi di vita"
    ],
    "indicatori": [
      {
        "id": "IND-040",
        "code": "com_sum_ratio_unitaimprese_procapite_y",
        "label": "Densità delle unità locali dell’industria e dei servizi",
        "note": "Misura direttamente la dotazione imprenditoriale locale, indicatore di vitalità economica."
      },
      {
        "id": "IND-041",
        "code": "com_varperc_gapoccupazione_y",
        "label": "gender gap - occupazione nella pubblica amministrazione locale",
        "note": "Gender gap occupazionale nella PA locale. Proxy della disparità di genere nel mercato del lavoro pubblico."
      },
      {
        "id": "IND-042",
        "code": "com_ratio_giniindex_y",
        "label": "Gini Index (stimato)",
        "note": "Indice di disuguaglianza economica. Alto Gini = elevata concentrazione del reddito = criticità per coesione sociale."
      },
      {
        "id": "IND-043",
        "code": "com_ratio_pensioni_lavoratore_y",
        "label": "pensionati per lavoratore",
        "note": "Pensionati per lavoratore attivo. Proxy della sostenibilità del mercato del lavoro e invecchiamento della forza lavoro."
      },
      {
        "id": "IND-044",
        "code": "com_ratio_unemploymentrate_15_64_y",
        "label": "Tasso di disoccupazione (fascia 15 - 64)",
        "note": "Tasso di disoccupazione 15-64. Indicatore primario del mercato del lavoro locale."
      },
      {
        "id": "IND-045",
        "code": "com_ratio_inactiverate_15_64_y",
        "label": "Tasso di inattività (fascia 15 - 64)",
        "note": "Tasso di inattività 15-64. Quota popolazione fuori dal mercato del lavoro. Alto = criticità strutturale."
      },
      {
        "id": "IND-046",
        "code": "com_ratio_employmentrate_15_64_y",
        "label": "Tasso di occupazione (fascia 15 - 64)",
        "note": "Tasso di occupazione 15-64. Indicatore primario del mercato del lavoro locale."
      },
      {
        "id": "IND-047",
        "code": "com_ratio_obsvalueyoy_15_64_age_y",
        "label": "Variazione YoY popolazione nella fascia di età 15-64",
        "note": "Variazione YoY popolazione 15-64. Contesto demografico per l'analisi del mercato del lavoro."
      },
      {
        "id": "IND-048",
        "code": "com_avg_reddito_pensione_y",
        "label": "Reddito medio da pensione",
        "note": "Reddito medio da pensione. Proxy del benessere economico della popolazione anziana."
      },
      {
        "id": "IND-049",
        "code": "com_avg_reddito_y",
        "label": "Reddito medio",
        "note": "Reddito medio. Indicatore primario del benessere economico della popolazione locale."
      },
      {
        "id": "IND-050",
        "code": "com_index_diversityscore_y",
        "label": "Indice di diversità settoriale (job diversity score)",
        "note": "Indice di diversità settoriale. Misura la resilienza economica locale. Bassa diversità = vulnerabilità a shock."
      },
      {
        "id": "IND-051",
        "code": "com_index_modernization_y",
        "label": "Indice di modernizzazione economica",
        "note": "Indice di modernizzazione economica. Misura composizione produttiva verso settori ad alto valore aggiunto."
      },
      {
        "id": "IND-052",
        "code": "com_avg_ula_procapite_y",
        "label": "# ULA per abitante",
        "note": "ULA per abitante. Misura direttamente l'intensità lavorativa del territorio."
      }
    ],
    "noteRaccordo": "Unifica due temi OC (FESR vs FSE+) perché per i comuni generano strumenti simili. La distinzione FESR/FSE+ emerge a livello di singolo intervento e fondo."
  },
  {
    "id": "TEMA-11",
    "label": "Agenda digitale e servizi pubblici",
    "descrizione": "Agenda digitale e servizi pubblici",
    "nomeOpenCoesione": "Reti e servizi digitali",
    "missioniDup": [
      {
        "id": "MIS-01",
        "codice": "01",
        "label": "Servizi istituzionali, generali e di gestione"
      },
      {
        "id": "MIS-17",
        "codice": "17",
        "label": "Energia e diversificazione delle fonti energetiche"
      }
    ],
    "policyObjectivesUe": [],
    "rsoPrimari": [],
    "besDomains": [
      "Innovazione, ricerca e creatività",
      "Qualità dei servizi"
    ],
    "indicatori": [],
    "noteRaccordo": "Label più riconoscibile rispetto a OC. Include infrastrutture banda larga, e-government, sportelli digitali."
  },
  {
    "id": "TEMA-12",
    "label": "Capacità amministrativa e governance",
    "descrizione": "Capacità amministrativa e governance",
    "nomeOpenCoesione": "Capacità amministrativa",
    "missioniDup": [
      {
        "id": "MIS-01",
        "codice": "01",
        "label": "Servizi istituzionali, generali e di gestione"
      }
    ],
    "policyObjectivesUe": [],
    "rsoPrimari": [],
    "besDomains": [
      "Politica e istituzioni"
    ],
    "indicatori": [
      {
        "id": "IND-053",
        "code": "com_ratio_area_poptotale_y",
        "label": "Densità abitativa (ab. / km2)",
        "note": "Densità abitativa: variabile di sfondo per dimensionare il territorio del comune."
      },
      {
        "id": "IND-054",
        "code": "dipendenti_laureati",
        "label": "% dipendenti laureati",
        "note": "Quota dipendenti laureati nell'ente. Misura direttamente il livello di qualificazione del personale amministrativo."
      },
      {
        "id": "IND-055",
        "code": "com_ratio_dipendenticomunali_under40_y",
        "label": "% dipendenti under40 rispetto totale dipendenti",
        "note": "Ricambio generazionale della PA. Bassa quota under40 segnala invecchiamento e rischio perdita know-how."
      },
      {
        "id": "IND-056",
        "code": "com_varperc_gapformazione_y",
        "label": "gender gap - formazione nella pubblica amministrazione locale",
        "note": "Gender gap formazione interna PA. Misura la parità di accesso alla crescita professionale nell'ente."
      },
      {
        "id": "IND-057",
        "code": "com_ratio_giorniformazione_y",
        "label": "Numero di formazione per dipendente",
        "note": "Giorni di formazione per dipendente comunale. Misura l'investimento in capitale umano dell'ente."
      },
      {
        "id": "IND-058",
        "code": "com_ratio_importocumulato_entrata_incidenzatassazione_procapite_y",
        "label": "Tassazione pro-capite",
        "note": "Pressione fiscale locale pro-capite. Misura la capacità impositiva del comune."
      },
      {
        "id": "IND-059",
        "code": "com_avg_obsvalue_age_y",
        "label": "Età media",
        "note": "Età media della popolazione. Variabile demografica per dimensionare la domanda di servizi pubblici."
      },
      {
        "id": "IND-060",
        "code": "com_perc_importocumulato_rigiditaspesa_y",
        "label": "Rapporto tra (costo lavoro + rimborso prestiti - chiusura anticipazioni) e totale entrate correnti",
        "note": "Rigidità della spesa corrente. Indicatore primario della sostenibilità finanziaria dell'ente."
      },
      {
        "id": "IND-061",
        "code": "com_ratio_importocumulato_entrata_autonomiafinanziaria_y",
        "label": "Rapporto tra (entrate tributarie + entrate extratributarie) e totale entrate correnti",
        "note": "Autonomia finanziaria (entrate proprie / entrate correnti). Misura la capacità di autofinanziamento."
      },
      {
        "id": "IND-062",
        "code": "com_ratio_importocumulato_entrata_dipendenzatrasferimenticorrenti_y",
        "label": "Rapporto tra entrate da trasferimenti correnti e totale entrate correnti",
        "note": "Dipendenza da trasferimenti correnti. Alta quota = vulnerabilità finanziaria rispetto a fonti esterne."
      },
      {
        "id": "IND-063",
        "code": "com_ratio_importocumulato_entrata_dipendenzacentro_y",
        "label": "Rapporto tra entrate da trasferimenti nazionali e entrate totali",
        "note": "Dipendenza da trasferimenti nazionali. Proxy della dipendenza finanziaria dal governo centrale."
      },
      {
        "id": "IND-064",
        "code": "com_ratio_importocumulato_entrata_dipendenzalocali_y",
        "label": "Rapporto tra risorse ricevute dalle amministrazioni locali e entrate totali",
        "note": "Dipendenza da risorse di amministrazioni locali. Quota entrate da enti locali sovraordinati."
      },
      {
        "id": "IND-065",
        "code": "com_ratio_importocumulato_entrata_autonomiaimpositiva_y",
        "label": "Rapporto tra entrate da tassazione locale e entrate tributarie",
        "note": "Autonomia impositiva (tassazione locale / entrate tributarie totali). Misura la capacità di autofinanziamento fiscale."
      }
    ],
    "noteRaccordo": "Tema trasversale. Non genera quasi mai opere fisiche ma servizi, formazione, sistemi informativi. Per Regioni/province è il tema che finanzia la progettazione stessa."
  }
]
