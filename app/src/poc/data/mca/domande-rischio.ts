import type { RiskFactor } from "../../types/incroci"

export const DOMANDE_RISCHIO: RiskFactor[] = [
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
