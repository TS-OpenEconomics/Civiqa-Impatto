/**
 * input_params_registry.ts
 * Civiqa OpenCore — Registry Input Params con Label User-Friendly
 *
 * Generated: 2026-05-23
 * Source: input_params.ts (Layer 1) + KPI/CP Layer 2 formulas
 *
 * Per ogni input_param usato nelle formule CBA:
 *   - code:     codice tecnico (chiave di join con Databricks)
 *   - label:    etichetta leggibile per il frontend
 *   - question: domanda in linguaggio naturale per l'utente
 *   - udm:      unità di misura
 *   - auto:     true = dato auto-compilato da Databricks (Data Room)
 *
 * Tutti i 66 parametri sono auto-compilabili.
 * L'utente li vede in modalità "conferma o modifica il dato suggerito".
 *
 * Records: 66
 */

export interface InputParamLabel {
  /** Codice tecnico Databricks — chiave di join con statistics.ts e formule L2 */
  code: string;
  /** Etichetta leggibile per il frontend */
  label: string;
  /** Domanda in linguaggio naturale per il funzionario */
  question: string;
  /** Unità di misura */
  udm: string;
  /** Sempre true: dato auto-compilato dal Data Room territoriale */
  auto: true;
}

export const INPUT_PARAMS_REGISTRY: InputParamLabel[] = [
  { code: "com_avg_tempi_raggiungibilita_y", label: `Tempo medio di raggiungibilità dei servizi (min)`, question: `Quanti minuti impiegano in media i residenti per raggiungere i servizi essenziali nel tuo comune? Driver per interventi stradali e di accessibilità.`, udm: `min`, auto: true },
  { code: "com_cnt_edificiscolastici_y", label: `N. edifici scolastici`, question: `Quanti edifici scolastici ha il tuo comune? Usato per stimare la superficie totale da adeguare o riqualificare.`, udm: `n.`, auto: true },
  { code: "com_cnt_farmacie_y", label: `N. farmacie — proxy strutture di prossimità sanitaria`, question: `Quante farmacie ha il tuo comune? Proxy dell'accessibilità sanitaria di prossimità. Driver per infrastrutture sanitarie e di igiene pubblica.`, udm: `n.`, auto: true },
  { code: "com_mult_domandapasseggeritpl_y", label: `Domanda passeggeri TPL stimata`, question: `Quanti passeggeri usa il trasporto pubblico locale nel tuo comune ogni anno? Driver per interventi di mobilità urbana.`, udm: `passeggeri/anno`, auto: true },
  { code: "com_mult_domandapasseggeritreno_y", label: `Domanda passeggeri treno stimata`, question: `Quanti passeggeri usano il treno da/per il tuo comune ogni anno? Driver per interventi ferroviari e stazioni.`, udm: `passeggeri/anno`, auto: true },
  { code: "com_mult_perc_protectedareas_km2_y", label: `Superficie aree protette (km²)`, question: `Quanti km² di aree naturali protette ha il tuo comune? Valore assoluto per il dimensionamento degli interventi di protezione ambientale.`, udm: `km²`, auto: true },
  { code: "com_mult_ricoveri_y", label: `Ricoveri ospedalieri annui stimati`, question: `Quanti ricoveri ospedalieri si stimano per i residenti del tuo comune all'anno? Proxy del fabbisogno sanitario.`, udm: `ricoveri/anno`, auto: true },
  { code: "com_mult_sport_users_y", label: `Utenti sportivi stimati`, question: `Quanti utenti sportivi si stimano nel tuo comune? Driver per la stima del fabbisogno di impianti sportivi.`, udm: `utenti`, auto: true },
  { code: "com_pct_dipendenticomunali_under40_y", label: `% dipendenti comunali under 40`, question: `Che percentuale di dipendenti comunali ha meno di 40 anni? Indica la capacità di adozione delle tecnologie digitali.`, udm: `%`, auto: true },
  { code: "com_pct_employmentrate_15_64_y", label: `Tasso di occupazione 15–64 anni`, question: `Qual è il tasso di occupazione 15–64 anni nel tuo comune? Indicatore della base produttiva locale.`, udm: `%`, auto: true },
  { code: "com_pct_landuse_areakmq_agriculture_y", label: `% superficie agricola sul territorio comunale`, question: `Che percentuale del territorio del tuo comune è agricola? Usato per stimare la superficie oggetto di interventi rurali e agrari.`, udm: `%`, auto: true },
  { code: "com_pct_landuse_areakmq_brownfield_y", label: `% superficie brownfield (aree dismesse)`, question: `Che percentuale del territorio del tuo comune è occupato da aree dismesse o brownfield? Driver per interventi di bonifica e riassetto siti.`, udm: `%`, auto: true },
  { code: "com_pct_landuse_areakmq_green_area_y", label: `% superficie verde urbano`, question: `Che percentuale del territorio è verde urbano nel tuo comune? Driver per interventi NBS, parchi e infrastrutture verdi.`, udm: `%`, auto: true },
  { code: "com_pct_landuse_areakmq_industrial_y", label: `% superficie industriale`, question: `Che percentuale del territorio del tuo comune è classificato come area industriale? Driver per interventi di infrastrutturazione aree produttive.`, udm: `%`, auto: true },
  { code: "com_pct_landuse_areakmq_livestock_y", label: `% superficie destinata ad allevamento`, question: `Che percentuale del territorio del tuo comune è destinata all'allevamento? Driver per interventi di benessere animale e zootecnia.`, udm: `%`, auto: true },
  { code: "com_pct_landuse_areakmq_military_y", label: `% superficie a uso militare`, question: `Che percentuale del territorio del tuo comune è a uso militare? Driver per interventi di riconversione e infrastrutture di sicurezza.`, udm: `%`, auto: true },
  { code: "com_pct_landuse_areakmq_sylviculture_y", label: `% superficie forestale`, question: `Che percentuale del territorio del tuo comune è forestale? Driver per interventi di silvicoltura e gestione boschi.`, udm: `%`, auto: true },
  { code: "com_pct_landuse_areakmq_water_body_y", label: `% superficie corpi idrici`, question: `Che percentuale del territorio del tuo comune è occupato da corpi idrici? Driver per interventi di difesa idraulica e gestione risorse idriche.`, udm: `%`, auto: true },
  { code: "com_pct_macro_nature_y", label: `% superficie natura e aree seminaturali`, question: `Che percentuale del territorio del tuo comune è naturale o seminaturale? Driver per interventi di protezione ambientale e forestazione.`, udm: `%`, auto: true },
  { code: "com_pct_obsvalue_neet_index_15_24_y", label: `% giovani NEET 15–24 anni`, question: `Qual è la percentuale di giovani 15–24 anni NEET nel tuo comune? Driver per interventi di formazione professionale e sostegno al lavoro.`, udm: `%`, auto: true },
  { code: "com_pct_unemploymentrate_15_64_y", label: `Tasso di disoccupazione 15–64 anni`, question: `Qual è il tasso di disoccupazione nel tuo comune nella fascia 15–64 anni? Driver per interventi di sostegno al mercato del lavoro e sviluppo economico.`, udm: `%`, auto: true },
  { code: "com_ratio_acqimm_kkm3_y", label: `Acqua immessa in rete (000 m³/anno)`, question: `Quanta acqua (in migliaia di m³) viene immessa nella rete idrica del tuo comune ogni anno? Driver per interventi sulle reti idriche.`, udm: `000 m³/anno`, auto: true },
  { code: "com_ratio_alunniperclasse_y", label: `Alunni per classe`, question: `Quanti alunni ci sono in media per classe nelle scuole del tuo comune? Il sistema suggerisce il dato aggiornato.`, udm: `alunni/classe`, auto: true },
  { code: "com_ratio_giniindex_y", label: `Indice di Gini — disuguaglianza`, question: `Qual è l'indice di Gini nel tuo comune? Misura le disuguaglianze economiche. Influenza i KPI di inclusione e welfare.`, udm: `[0–1]`, auto: true },
  { code: "com_ratio_giorniformazione_y", label: `Giornate formazione per dipendente/anno`, question: `Quante giornate di formazione vengono erogate in media per dipendente nel tuo comune? Indica il fabbisogno di infrastrutture formative e ICT.`, udm: `gg/dip./anno`, auto: true },
  { code: "com_ratio_incidentiferiti_percapita_y", label: `Incidenti stradali con feriti per 1.000 ab.`, question: `Quanti incidenti stradali con feriti ci sono ogni 1.000 abitanti nel tuo comune? Driver per interventi stradali e di messa in sicurezza.`, udm: `n./1.000 ab.`, auto: true },
  { code: "com_ratio_indice_dipendenza_y", label: `Indice di dipendenza demografica`, question: `Qual è l'indice di dipendenza demografica del tuo comune? Indica quante persone non attive dipendono da ogni persona in età lavorativa.`, udm: `[indice]`, auto: true },
  { code: "com_ratio_indice_vecchiaia_y", label: `Indice di vecchiaia`, question: `Qual è l'indice di vecchiaia del tuo comune? Misura l'invecchiamento della popolazione. Influenza la domanda di RSA e servizi socio-sanitari.`, udm: `[indice]`, auto: true },
  { code: "com_ratio_laureati_procapite_y", label: `Laureati per 1.000 abitanti`, question: `Quanti laureati ci sono ogni 1.000 abitanti nel tuo comune? Indicatore del livello di istruzione e del potenziale di R&S del territorio.`, udm: `laureati/1.000 ab.`, auto: true },
  { code: "com_ratio_obsvalue_saldomigratoriototale_y", label: `Tasso migratorio netto totale`, question: `Qual è il tasso migratorio del tuo comune? Valori negativi indicano spopolamento e guidano gli interventi di recupero abitativo.`, udm: `‰`, auto: true },
  { code: "com_src_consumosuolo_percentuale_y", label: `% consumo di suolo`, question: `Che percentuale del suolo del tuo comune è impermeabilizzata/artificializzata? Indicatore di pressione urbanistica e rischio idrogeologico.`, udm: `%`, auto: true },
  { code: "com_src_index_acces_essent_services_y", label: `Indice di accessibilità ai servizi essenziali`, question: `Quanto è accessibile la tua comunità ai servizi essenziali? L'indice va da 0 (nessun accesso) a 100 (pieno accesso). Driver per infrastrutture sociali e di mobilità.`, udm: `[0–100]`, auto: true },
  { code: "com_src_indicestdstazioni_y", label: `Indice di accessibilità alle stazioni ferroviarie`, question: `Quanto è accessibile il trasporto ferroviario nel tuo comune? L'indice combina distanza e frequenza del servizio.`, udm: `[0–100]`, auto: true },
  { code: "com_src_obsvalue_heavyvehicles_y", label: `Veicoli pesanti nel parco circolante`, question: `Quanti veicoli pesanti circolano nel tuo comune? Driver per interventi stradali di grande viabilità e infrastrutture logistiche.`, udm: `n.`, auto: true },
  { code: "com_src_obsvalue_highemissmotorrate_per100inha_y", label: `Veicoli ad alte emissioni per 100 ab.`, question: `Quanti veicoli ad alte emissioni ci sono ogni 100 abitanti nel tuo comune? Driver per interventi di mobilità sostenibile e qualità dell'aria.`, udm: `n./100 ab.`, auto: true },
  { code: "com_src_obsvalue_killedandinjured_injured_y", label: `Feriti in incidenti stradali (n./anno)`, question: `Quante persone vengono ferite in incidenti stradali nel tuo comune ogni anno? Usato per calcolare i benefici di messa in sicurezza.`, udm: `n./anno`, auto: true },
  { code: "com_src_obsvalue_killedandinjured_killed_y", label: `Vittime di incidenti stradali (n./anno)`, question: `Quante vittime da incidenti stradali si registrano nel tuo comune ogni anno? Usato per il calcolo VSL nei KPI di sicurezza stradale.`, udm: `n./anno`, auto: true },
  { code: "com_src_obsvalue_lightvehicles_y", label: `Veicoli leggeri nel parco circolante`, question: `Quanti veicoli leggeri circolano nel tuo comune? Proxy del traffico privato e della domanda di parcheggi.`, udm: `n.`, auto: true },
  { code: "com_src_obsvalue_protectednatareas_valperc_y", label: `% territorio in aree naturali protette`, question: `Che percentuale del tuo comune ricade in aree naturali protette? Driver per interventi di protezione e valorizzazione ambientale.`, udm: `%`, auto: true },
  { code: "com_src_percentuale_rd_y", label: `% raccolta differenziata`, question: `Che percentuale di raccolta differenziata ha il tuo comune? Target di legge: 65% (D.Lgs. 152/2006). Driver per impianti di trattamento rifiuti.`, udm: `%`, auto: true },
  { code: "com_src_tempiaeroporti_y", label: `Tempo di raggiungibilità aeroporti (min)`, question: `Quanti minuti ci vogliono per raggiungere l'aeroporto più vicino dal tuo comune? Driver per interventi aeroportuali e di trasporto.`, udm: `min`, auto: true },
  { code: "com_src_tempiporti_y", label: `Tempo di raggiungibilità porti (min)`, question: `Quanti minuti ci vogliono per raggiungere il porto più vicino dal tuo comune? Driver per interventi portuali e marittimi.`, udm: `min`, auto: true },
  { code: "com_src_tempistazioni_y", label: `Tempo di raggiungibilità stazioni ferroviarie (min)`, question: `Quanti minuti ci vogliono per raggiungere la stazione ferroviaria più vicina? Driver per accessibilità ferroviaria e intermodalità.`, udm: `min`, auto: true },
  { code: "com_src_totale_ru_t_y", label: `Rifiuti urbani totali prodotti (t/anno)`, question: `Quante tonnellate di rifiuti urbani produce il tuo comune ogni anno? Driver per il dimensionamento degli impianti di smaltimento e trattamento.`, udm: `t/anno`, auto: true },
  { code: "com_src_utentiserviziinfanzia_y", label: `Utenti servizi infanzia (0–3 anni)`, question: `Quanti bambini 0–3 anni usufruiscono dei servizi per l'infanzia nel tuo comune? È il dato che calibra la domanda di nuovi posti nido.`, udm: `bambini`, auto: true },
  { code: "com_src_visitatorimusei_y", label: `Visitatori musei e patrimonio culturale`, question: `Quanti visitatori accedono ai musei e al patrimonio culturale del tuo comune ogni anno? Driver per interventi culturali e di restauro.`, udm: `visitatori/anno`, auto: true },
  { code: "com_sum_consumatoaree_rischiofrane_y", label: `Superficie in aree a rischio frane (ha)`, question: `Quanti ettari del tuo comune sono esposti a rischio frana? Driver per interventi di consolidamento e difesa del suolo.`, udm: `ha`, auto: true },
  { code: "com_sum_consumatoaree_rischioidraulico_y", label: `Superficie in aree a rischio idraulico (ha)`, question: `Quanti ettari del tuo comune ricadono in aree a rischio idraulico? Driver per interventi di difesa del suolo e gestione del rischio alluvioni.`, udm: `ha`, auto: true },
  { code: "com_sum_dipendenticomunali_y", label: `Dipendenti comunali`, question: `Quanti dipendenti ha il tuo comune? Usato per stimare il fabbisogno di spazi ufficio, formazione e infrastrutture ICT.`, udm: `n.`, auto: true },
  { code: "com_sum_importoeconomico_infrastrutturedelsettoreenergetico_5y", label: `Investimenti in infrastrutture energetiche (5 anni)`, question: `Quanto ha investito il tuo comune in infrastrutture energetiche negli ultimi 5 anni? Proxy della maturità energetica del territorio.`, udm: `€`, auto: true },
  { code: "com_sum_importoeconomico_infrastrutturedelsettoreenergetico_5y_y", label: `Investimenti nel settore energetico (ultimi 5 anni)`, question: `Quanto è stato investito nel tuo comune in infrastrutture energetiche negli ultimi 5 anni?`, udm: `€`, auto: true },
  { code: "com_sum_num_dw_av_y", label: `Abitazioni totali`, question: `Quante abitazioni ci sono nel tuo comune in totale? Usato per stimare il potenziale di riqualificazione energetica del patrimonio edilizio.`, udm: `n.`, auto: true },
  { code: "com_sum_num_occ_dw_av_y", label: `Abitazioni occupate`, question: `Quante abitazioni occupate ci sono nel tuo comune? Base per la stima della domanda residenziale e del fabbisogno di ERP.`, udm: `n.`, auto: true },
  { code: "com_sum_obsvalue_bedplaces_y", label: `Posti letto ricettivi`, question: `Quanti posti letto ha l'offerta ricettiva turistica del tuo comune? Driver per interventi di infrastruttura turistica.`, udm: `n.`, auto: true },
  { code: "com_sum_obsvalue_poptotale_y", label: `Popolazione residente totale`, question: `Qual è la popolazione residente del tuo comune? Base demografica per tutti i calcoli pro-capite.`, udm: `ab.`, auto: true },
  { code: "com_sum_obsvalue_rifiutiurbani_ton_y", label: `Rifiuti urbani prodotti (tonnellate)`, question: `Quante tonnellate di rifiuti urbani produce il tuo comune ogni anno?`, udm: `t`, auto: true },
  { code: "com_sum_obsvalue_superficiekmq_y", label: `Superficie comunale`, question: `Qual è la superficie totale del tuo comune in km²?`, udm: `km²`, auto: true },
  { code: "com_sum_obsvalue_totfam_y", label: `N. famiglie residenti`, question: `Quante famiglie risiedono nel tuo comune? Driver per la stima della domanda residenziale.`, udm: `n.`, auto: true },
  { code: "com_sum_obsvalue_unitaimprese_y", label: `Unità locali d'impresa`, question: `Quante unità locali d'impresa sono attive nel tuo comune? Usato per stimare la domanda di spazi produttivi, commerciali e di servizio.`, udm: `n.`, auto: true },
  { code: "com_sum_obsvalue_users_y", label: `Utenti servizi sociali`, question: `Quante persone accedono ai servizi sociali nel tuo comune? Driver per la stima della domanda di strutture sociali e comunitarie.`, udm: `n.`, auto: true },
  { code: "com_sum_posti_letto_y", label: `Posti letto strutture di cura`, question: `Quanti posti letto ci sono nelle strutture di cura nel tuo comune? Proxy della dotazione socio-sanitaria esistente.`, udm: `n.`, auto: true },
  { code: "com_sum_ratio_presenzeturismo_y", label: `Presenze turistiche annue`, question: `Quante presenze turistiche ha il tuo comune all'anno? Driver per la stima di interventi turistici, culturali e infrastrutturali.`, udm: `presenze/anno`, auto: true },
  { code: "com_sum_totareapericolosit", label: `Superficie a pericolosità sismica (ha)`, question: `Quanti ettari del tuo comune ricadono in aree a pericolosità sismica?`, udm: `ha`, auto: true },
  { code: "com_sum_totareapericolosit_y", label: `Superficie a pericolosità sismica (ha)`, question: `Quanti ettari del tuo comune ricadono in aree a pericolosità sismica?`, udm: `ha`, auto: true },
  { code: "com_sum_ula_industry_w0_9_y", label: `ULA nell'industria (micro-imprese)`, question: `Quante unità di lavoro annuo ci sono nell'industria micro (0–9 addetti) nel tuo comune? Driver per CP infrastrutture industriali.`, udm: `ULA`, auto: true },
  { code: "com_sum_ula_trade_w0_9_y", label: `ULA nel commercio micro — proxy artigianato`, question: `Quante ULA nel commercio micro ci sono nel tuo comune? Indicatore della vivacità del tessuto artigianale e commerciale.`, udm: `ULA`, auto: true },
];

/** Lookup: code → { label, question, udm } */
export function getParamLabel(code: string): InputParamLabel | undefined {
  return INPUT_PARAMS_REGISTRY.find(p => p.code === code);
}

/** Lookup multiplo: array di codici → array di labels (filtra i non trovati) */
export function getParamLabels(codes: string[]): InputParamLabel[] {
  return codes.map(c => getParamLabel(c)).filter((p): p is InputParamLabel => p !== undefined);
}
