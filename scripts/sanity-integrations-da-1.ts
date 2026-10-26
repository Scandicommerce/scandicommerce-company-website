// TARGET_DATASET=production npx sanity exec scripts/sanity-integrations-da-1.ts --with-user-token
// Creates the Danish versions (-da) of the integrations pillar, the 8 integration
// categories and 12 integration pages (batch 1 of 3) from their Norwegian
// sources, and adds the da entry to the existing translation.metadata documents.
// Idempotent: createOrReplace on fixed ids; metadata is only patched when no 'da'
// key exists. References are weak so the three batches can run in any order.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

const CATEGORY_KEYS = ['betaling', 'booking', 'erp', 'logistikk', 'markedsforing', 'oms', 'pim', 'pos']
const INTEGRATIONS = ['24sevenoffice', 'bring', 'business-central', 'datafeedwatch', 'dintero', 'emfas', 'feed', 'fiken', 'front-systems', 'google-sheets', 'holio', 'izy']
const SOURCE_IDS = ['pillar-integrasjoner-no', ...CATEGORY_KEYS.map((k) => `integration-cat-${k}-no`), ...INTEGRATIONS.map((x) => `integration-${x}-no`)]

// ---------------------------------------------------------------------------
// Translations. Exact Norwegian string → Danish. Anything not found here (or
// in the patterns below) makes the script fail, so nothing Norwegian leaks.
// ---------------------------------------------------------------------------
const D: Record<string, string> = {
  // Shared
  'Book en samtale': 'Book en samtale',
  'Vi svarer med metode, dataflyt og tidsplan innen to virkedager.': 'Vi svarer med metode, dataflow og tidsplan inden for to hverdage.',
  'Fortell oss hvilke systemer du har, så får du metode, dataflyt og tidsplan innen to virkedager.': 'Fortæl os, hvilke systemer I har, så får I metode, dataflow og tidsplan inden for to hverdage.',
  'Hvem eier integrasjonen etterpå?': 'Hvem ejer integrationen bagefter?',
  'Du. Make.com-scenarioer ligger i din konto, kode leveres med kildekode.': 'Det gør I. Make.com-scenarier ligger i jeres konto, og kode leveres med kildekode.',
  'Hva skjer når en kjøring feiler?': 'Hvad sker der, når en kørsel fejler?',
  'Hver kjøring ligger i historikken. Feil varsles med referanse, og vi rydder opp sammen.': 'Hver kørsel ligger i historikken. Fejl varsles med reference, og vi rydder op sammen.',
  'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen.': 'Hver kørsel ligger i historikken med ind- og uddata. Fejl varsles med reference, og vi rydder op sammen.',
  'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen. Det finnes ingen automatisk tilbakerulling, og det sier vi rett ut.': 'Hver kørsel ligger i historikken med ind- og uddata. Fejl varsles med reference, og vi rydder op sammen. Der findes ingen automatisk tilbagerulning, og det siger vi ligeud.',
  'Make.com eller egen kode?': 'Make.com eller egen kode?',
  'Make.com når flyten er greiner og oppslag og du vil kunne åpne en kjøring selv. Egen kode når det er mye transformasjon, høyt volum eller behov for testmiljø.': 'Make.com, når flowet er forgreninger og opslag, og I selv vil kunne åbne en kørsel. Egen kode, når der er meget transformation, højt volumen eller behov for testmiljø.',
  'De som står på denne siden kjører vi i dag. Står ikke ditt system her, kan vi som regel koble det likevel, enten via API i Make.com eller som egen kode.': 'Dem, der står på denne side, kører vi i dag. Står jeres system her ikke, kan vi som regel koble det på alligevel, enten via API i Make.com eller som egen kode.',
  'Ja. Make.com-scenarioer ligger i din konto, og kode leveres med kildekode. Vi drifter om du vil, men du er ikke låst til oss.': 'Ja. Make.com-scenarier ligger i jeres konto, og kode leveres med kildekode. Vi drifter den, hvis I vil, men I er ikke låst til os.',
  'Ja. De fleste starter med én flyt, for eksempel ordre, og legger til lager eller kunder etterpå.': 'Ja. De fleste starter med ét flow, for eksempel ordrer, og tilføjer lager eller kunder bagefter.',
  'Hvor lang tid tar oppsettet?': 'Hvor lang tid tager opsætningen?',
  'Make.com-flyter leveres på dager når kartleggingen er gjort. Egen kode tar lenger, og vi gir tidsplan etter første samtale.': 'Make.com-flows leveres på dage, når kortlægningen er gjort. Egen kode tager længere, og vi giver en tidsplan efter den første samtale.',
  'Kartlegging': 'Kortlægning',
  'Oppsett': 'Opsætning',
  'Tilkobling i din egen konto, mapping av felt, og testdata gjennom hele flyten.': 'Tilslutning i jeres egen konto, mapping af felter og testdata gennem hele flowet.',
  'Test på reelle data': 'Test på rigtige data',
  'De første ordrene eller produktene følges manuelt før vi slår på alt.': 'De første ordrer eller produkter følges manuelt, før vi slår alt til.',
  'Go-live og overvåking': 'Go-live og overvågning',
  'Vi følger de første ukene. Feil varsles med referanse til ordren.': 'Vi følger med de første uger. Fejl varsles med reference til ordren.',
  'Shopify': 'Shopify',
  'Shopify eller Shopify Plus': 'Shopify eller Shopify Plus',
  'Shopify Plus': 'Shopify Plus',
  'Make.com-konto': 'Make.com-konto',
  'Make.com-konto i ditt navn': 'Make.com-konto i jeres navn',
  'Lager': 'Lager',
  'Google og Meta': 'Google og Meta',
  // Frequencies
  'sanntid': 'realtid',
  'løpende': 'løbende',
  'ved pakking': 'ved pakning',
  'daglig': 'dagligt',
  'ved publisering': 'ved publicering',

  // Pillar
  'Shopify koblet til systemene du allerede bruker': 'Shopify koblet til de systemer, I allerede bruger',
  'En Shopify-integrasjon kobler nettbutikken til systemene som driver resten av selskapet: regnskap, ordrehåndtering, lager, frakt, betaling og markedsføring. Vi bygger dem i Make.com når flyten skal være synlig og enkel å endre, og som egen kode når volum eller logikk krever det. Dokumentert dataflyt, og du eier scenarioet i din egen konto.':
    'En Shopify-integration forbinder webshoppen med de systemer, der driver resten af virksomheden: regnskab, ordrehåndtering, lager, fragt, betaling og markedsføring. Vi bygger dem i Make.com, når flowet skal være synligt og nemt at ændre, og som egen kode, når volumen eller logik kræver det. Dokumenteret dataflow, og I ejer scenariet i jeres egen konto.',
  'Hvem eier integrasjonen': 'Hvem ejer integrationen',
  'Make.com-scenarioer settes opp i din egen Make-konto med dine tilkoblinger. Kode leveres med kildekode i ditt repo. Vi drifter om du vil, men du er aldri låst til oss.': 'Make.com-scenarier sættes op i jeres egen Make-konto med jeres tilslutninger. Kode leveres med kildekode i jeres repo. Vi drifter den, hvis I vil, men I er aldrig låst til os.',
  'Hva skjer når noe feiler': 'Hvad sker der, når noget fejler',
  'Hver kjøring ligger i historikken med inn- og utdata per modul. Feil varsles med referanse til ordren. Det finnes ingen automatisk tilbakerulling, og vi rydder opp sammen når det trengs.': 'Hver kørsel ligger i historikken med ind- og uddata pr. modul. Fejl varsles med reference til ordren. Der findes ingen automatisk tilbagerulning, og vi rydder op sammen, når der er brug for det.',
  'Shopify eller systemet som fasit': 'Shopify eller systemet som facit',
  'For regnskap er Shopify fasit og regnskapet mottaker. For OMS og enkelte ERP, som Omnium, UniMicro og TRIMIT, er systemet fasit for lager og Shopify viser det. Vi avklarer dette først, fordi det styrer alt annet.': 'For regnskab er Shopify facit, og regnskabet er modtager. For OMS og visse ERP-systemer, som Omnium, UniMicro og TRIMIT, er systemet facit for lager, og Shopify viser det. Vi afklarer det først, fordi det styrer alt andet.',
  'Systemet ditt står ikke på listen': 'Jeres system står ikke på listen',
  'Har systemet et API, kan vi som regel koble det. Send oss hva du har, så svarer vi med metode og tidsplan.': 'Har systemet et API, kan vi som regel koble det på. Send os, hvad I har, så svarer vi med metode og tidsplan.',
  'Make.com eller egen kode, hvordan velger dere?': 'Make.com eller egen kode, hvordan vælger I?',
  'Make.com når flyten er greiner og oppslag, og når du vil kunne åpne en kjøring selv. Egen kode når det er mye transformasjon, høyt volum, eller behov for versjonskontroll og testmiljø. De fleste regnskaps- og OMS-integrasjoner er Make.com.': 'Make.com, når flowet er forgreninger og opslag, og når I selv vil kunne åbne en kørsel. Egen kode, når der er meget transformation, højt volumen eller behov for versionsstyring og testmiljø. De fleste regnskabs- og OMS-integrationer er Make.com.',
  'Systemet mitt står ikke på listen. Kan dere likevel?': 'Vores system står ikke på listen. Kan I alligevel?',
  'Som regel ja, hvis systemet har et API. Send oss hva du har.': 'Som regel ja, hvis systemet har et API. Send os, hvad I har.',
  'Fortell oss hvilke systemer du har': 'Fortæl os, hvilke systemer I har',

  // Categories
  'Betaling': 'Betaling',
  'Betalingsintegrasjoner dekker kassen og oppgjøret. Vipps Hurtigkasse, Klarna, Dintero og Shopify Payments settes opp og testes, og utbetalingene føres mot riktig betalingsmåte i regnskapet slik at bank og bokføring stemmer uten manuell avstemming.':
    'Betalingsintegrationer dækker kassen og afregningen. Klarna, Dintero, Shopify Payments og Vipps Hurtigkasse sættes op og testes på mobil og i kassen, og hver udbetaling bogføres mod den rigtige betalingsmåde i regnskabet, så bank og bogføring stemmer uden manuel afstemning, uanset hvor mange betalingsmetoder kassen har.',
  'Booking og annet': 'Booking og andet',
  'Når salget starter et annet sted enn i kassen. Bookinger fra Podio og IZY blir Shopify-ordre, brukere opprettes i Moodle når et kurs er kjøpt, og skjemaer havner i Google Sheets. Make.com-flyter som er lette å lese og endre.':
    'Når salget starter et andet sted end i kassen. Bookinger fra Podio og IZY bliver til Shopify-ordrer, brugere oprettes i Moodle, når et kursus er købt, og formularer havner i Google Sheets. Make.com-flows, der er nemme at læse og ændre.',
  'ERP og økonomi': 'ERP og økonomi',
  'En regnskapsintegrasjon flytter betalte ordre fra Shopify til regnskapssystemet som faktura, salgsbilag eller bilagsjournal, med kunde, mva og frakt på riktig konto. Refusjoner blir kreditnota. Vi kjører dette i dag mot Tripletex, 24SevenOffice, PowerOffice Go og Fiken, som Make.com-scenarioer i din egen konto. Fakturaer sendes ikke før regnskapsfører har sett dem.':
    'En regnskabsintegration flytter betalte ordrer fra Shopify til regnskabssystemet som faktura, salgsbilag eller bilagskladde, med kunde, moms og fragt på den rigtige konto. Refusioner bliver til kreditnotaer. Vi kører det i dag mod Tripletex, 24SevenOffice, PowerOffice Go og Fiken, som Make.com-scenarier i jeres egen konto. Fakturaer sendes ikke, før bogholderen har set dem.',
  'Logistikk og frakt': 'Logistik og fragt',
  'Fraktintegrasjoner gir riktige fraktvalg i kassen, etiketter fra ordren og sporing tilbake til kunden. Vi jobber med Bring, Profrakt, nShift, Logistra og Quickship, som offisielle apper eller Make.com-flyter når etiketten skal utløses fra et annet system enn Shopify.':
    'Fragtintegrationer giver de rigtige fragtvalg i kassen, labels fra ordren og tracking tilbage til kunden. Vi arbejder med Bring, Profrakt, nShift, Logistra og Quickship, som officielle apps eller som Make.com-flows, når labelen skal udløses fra et andet system end Shopify, og tester fragtvalgene på mobil før go-live.',
  'Markedsføring og sporing': 'Markedsføring og tracking',
  'Kundedata og hendelser fra Shopify til verktøyene som driver salget: Klaviyo og MarketingPlatform for e-post og SMS, Tracklution for server-side sporing til Meta, Google og affiliate, og Judge.me eller Lipscore for anmeldelser.':
    'Kundedata og hændelser fra Shopify til de værktøjer, der driver salget: Klaviyo og MarketingPlatform til e-mail og SMS, Tracklution til server-side tracking til Meta, Google og affiliate, og Judge.me eller Lipscore til anmeldelser. Sat op, så alle kanaler ser de samme ordrer og kunder.',
  'OMS, lager og EDI': 'OMS, lager og EDI',
  'Et ordrehåndteringssystem samler ordre fra nettbutikk, butikk og EDI på ett sted, og styrer lager og plukk. Vi kobler Shopify til Omnium, Holio og Ongoing, slik at ordre går inn og lager kommer tilbake, og EDI-ordre fra kjedene flyter videre til regnskap uten manuell punching.':
    'Et ordrehåndteringssystem samler ordrer fra webshop, butik og EDI ét sted og styrer lager og pluk. Vi kobler Shopify til Omnium, Holio og Ongoing, så ordrer går ind og lager kommer tilbage, og EDI-ordrer fra kæderne flyder videre til regnskabet uden manuel indtastning.',
  'PIM og produktdata': 'PIM og produktdata',
  'Produktdata som eies i PIM eller leverandørfeed og publiseres til Shopify med varianter, bilder og attributter. Vi setter opp Vuuh, DatafeedWatch og Google Merchant Center slik at produktdata har én fasit og nettbutikk, markedsplasser og annonser får samme innhold.':
    'Produktdata, der ejes i PIM eller leverandørfeed og publiceres til Shopify med varianter, billeder og attributter. Vi sætter Vuuh, DatafeedWatch og Google Merchant Center op, så produktdata har ét facit, og webshop, markedspladser og annoncer får samme indhold, uden at det samme produkt vedligeholdes to steder.',
  'POS og butikk': 'POS og butik',
  'Butikk og nettbutikk på samme varelager og kundebase. Vi setter opp Shopify POS, kobler Front Systems til Shopify Plus, og flytter kunder fra PCKasse med gavekort og kundedata intakt.':
    'Butik og webshop på samme varelager og kundebase. Vi sætter Shopify POS op, kobler Front Systems til Shopify Plus og flytter kunder fra PCKasse med gavekort og kundedata intakt, så kassen og webshoppen sælger fra ét lager og kender den samme kunde.',

  // 24SevenOffice
  '24SevenOffice og Finago-integrasjon for Shopify': '24SevenOffice- og Finago-integration til Shopify',
  '24SevenOffice-integrasjonen oppretter en faktura i 24SevenOffice for hver betalte Shopify-ordre, med kunde, linjer, frakt og riktig salgstype, og registrerer betalingen mot betalingsmåten ordren ble betalt med. Refusjoner i Shopify blir kreditnota. Flyten går én vei fra Shopify og kjører som Make.com-scenario i din egen konto, med REST for faktura og SOAP for betalingsregistrering.':
    '24SevenOffice-integrationen opretter en faktura i 24SevenOffice for hver betalt Shopify-ordre, med kunde, linjer, fragt og den rigtige salgstype, og registrerer betalingen mod den betalingsmåde, ordren blev betalt med. Refusioner i Shopify bliver til kreditnotaer. Flowet går én vej fra Shopify og kører som Make.com-scenarie i jeres egen konto, med REST til faktura og SOAP til betalingsregistrering.',
  'Finago og 24SevenOffice er samme system. Faktura per ordre med betaling registrert, refusjoner som kreditnota.': 'Finago og 24SevenOffice er samme system. Faktura pr. ordre med betaling registreret, refusioner som kreditnota.',
  '24SevenOffice, tidligere Finago, er et norsk regnskapssystem med både moderne REST-API og eldre SOAP-tjenester. Integrasjonen bruker begge: faktura og kunde opprettes via REST, betalingen registreres via SOAP fordi det bare finnes der. Salgstype og dimensjoner settes per ordre, slik at B2C og utland havner på riktig konto.':
    '24SevenOffice, tidligere Finago, er et norsk regnskabssystem med både et moderne REST-API og ældre SOAP-tjenester. Integrationen bruger begge: faktura og kunde oprettes via REST, betalingen registreres via SOAP, fordi den kun findes der. Salgstype og dimensioner sættes pr. ordre, så B2C og udland havner på den rigtige konto.',
  'Uten betalingsregistrering må regnskapsfører avstemme hver Shopify-faktura manuelt mot utbetalingene. Med integrasjonen er fakturaen både opprettet og betalt i regnskapet når ordren er betalt i Shopify, og kreditnotaen kommer av seg selv ved refusjon.':
    'Uden betalingsregistrering skal bogholderen afstemme hver Shopify-faktura manuelt mod udbetalingerne. Med integrationen er fakturaen både oprettet og betalt i regnskabet, når ordren er betalt i Shopify, og kreditnotaen kommer af sig selv ved refusion.',
  'Salgstyper, betalingsmåter per gateway, dimensjoner for avdeling og land, og mva på frakt.': 'Salgstyper, betalingsmåder pr. gateway, dimensioner for afdeling og land, og moms på fragt.',
  'Oppsett i Make.com': 'Opsætning i Make.com',
  'REST- og SOAP-tilganger fra 24SevenOffice, scenario for ordre og for refusjoner i din konto.': 'REST- og SOAP-adgange fra 24SevenOffice, scenarie for ordrer og for refusioner i jeres konto.',
  'Test på reelle ordre': 'Test på rigtige ordrer',
  'Første ordre, første refusjon og en ordre med flere betalingsmåter følges manuelt.': 'Første ordre, første refusion og en ordre med flere betalingsmåder følges manuelt.',
  'Nattlig sveip fanger refusjoner som webhook-kallet ikke rakk.': 'Et natligt sweep fanger de refusioner, som webhook-kaldet ikke nåede.',
  '24SevenOffice med REST- og SOAP-tilgang': '24SevenOffice med REST- og SOAP-adgang',
  'Betalingsmåter satt opp i 24SevenOffice per gateway': 'Betalingsmåder sat op i 24SevenOffice pr. gateway',
  'Lager. Shopify er fasit': 'Lager. Shopify er facit',
  'Produktsynk fra 24SevenOffice. Produkter opprettes ved første salg': 'Produktsynk fra 24SevenOffice. Produkter oprettes ved første salg',
  'Hvorfor både REST og SOAP?': 'Hvorfor både REST og SOAP?',
  'Betalingsregistrering finnes bare i SOAP-tjenesten til 24SevenOffice. Faktura og kunde går via REST. Vi håndterer sesjonen mellom dem.': 'Betalingsregistrering findes kun i 24SevenOffices SOAP-tjeneste. Faktura og kunde går via REST. Vi håndterer sessionen mellem dem.',
  'Er det Finago eller 24SevenOffice?': 'Er det Finago eller 24SevenOffice?',
  'Samme produkt. Finago var navnet i enkelte markeder. Integrasjonen er den samme.': 'Samme produkt. Finago var navnet på visse markeder. Integrationen er den samme.',
  'Hva med gavekort og delbetaling?': 'Hvad med gavekort og delbetaling?',
  'Betalingen registreres per betalingsmåte. Gavekortdelen føres ikke mot bank. Vi avklarer oppsettet med regnskapsfører.': 'Betalingen registreres pr. betalingsmåde. Gavekortdelen bogføres ikke mod bank. Vi afklarer opsætningen med bogholderen.',
  'Eier vi scenarioet?': 'Ejer vi scenariet?',
  'Ja, det ligger i din Make-konto med dine tilganger.': 'Ja, det ligger i jeres Make-konto med jeres adgange.',
  'ordre + kunde → faktura': 'ordre + kunde → faktura',
  'betaling registrert': 'betaling registreret',
  'refusjon → kreditnota': 'refusion → kreditnota',

  // Bring
  'Bring-integrasjon for Shopify': 'Bring-integration til Shopify',
  'Bring-integrasjonen gir riktige fraktvalg og hentesteder i Shopify-kassen, etiketter fra ordren og sporing tilbake til kunden. Vi setter opp Bring sin offisielle app med avtalenummer og fraktregler, og tester kassen på mobil før go-live. Det er en fast del av hver Shopify-migrering vi gjør.':
    'Bring-integrationen giver de rigtige fragtvalg og afhentningssteder i Shopify-kassen, labels fra ordren og tracking tilbage til kunden. Vi sætter Brings officielle app op med aftalenummer og fragtregler og tester kassen på mobil før go-live. Det er en fast del af hver Shopify-migrering, vi laver.',
  'Fraktvalg i kassen, etiketter og sporing tilbake på ordren. Standard i hver migrering.': 'Fragtvalg i kassen, labels og tracking tilbage på ordren. Standard i hver migrering.',
  'Bring er Posten sin bedriftsdel. Appen kobler avtalen din til Shopify og håndterer pakke i postkassen, hentested og hjemlevering.': 'Bring er erhvervsdelen af Posten Norge. Appen kobler jeres aftale til Shopify og håndterer pakke i postkassen, afhentningssted og hjemmelevering.',
  'Fraktvalg er det første kunden ser i kassen. Feil priser eller manglende hentested koster konvertering.': 'Fragtvalg er det første, kunden ser i kassen. Forkerte priser eller manglende afhentningssted koster konvertering.',
  'Bring-avtale med API-nøkkel': 'Bring-aftale med API-nøgle',
  'Shopify med Carrier Service, Plus eller tillegg': 'Shopify med Carrier Service, Plus eller tillæg',
  'Fraktregler per sone': 'Fragtregler pr. zone',
  'fraktvalg i kassen': 'fragtvalg i kassen',
  'etikett': 'label',
  'sporing': 'tracking',

  // Business Central
  'Business Central-integrasjon for Shopify': 'Business Central-integration til Shopify',
  'Business Central-integrasjonen kobler Microsoft Dynamics 365 Business Central til Shopify med Microsoft sin egen Shopify-konnektor. Varer, priser og lager kommer fra ERP, ordre og kunder går tilbake, og faktura opprettes i Business Central. Vi gjør kartlegging av varegrupper, lokasjoner og betalingsmåter, setter opp konnektoren og tester hele flyten før go-live.':
    'Business Central-integrationen kobler Microsoft Dynamics 365 Business Central til Shopify med Microsofts egen Shopify-connector. Varer, priser og lager kommer fra ERP, ordrer og kunder går tilbage, og fakturaen oprettes i Business Central. Vi kortlægger varegrupper, lokationer og betalingsmåder, sætter connectoren op og tester hele flowet før go-live.',
  'Microsoft sin Shopify-konnektor satt opp riktig: varer og lager fra ERP, ordre og kunder tilbake.': 'Microsofts Shopify-connector sat rigtigt op: varer og lager fra ERP, ordrer og kunder tilbage.',
  'Business Central er Microsoft sitt ERP for mellomstore selskaper. Shopify-konnektoren er innebygd i Business Central, men krever at varer, lokasjoner, kunder og betalingsmåter er satt opp slik Shopify forventer dem.': 'Business Central er Microsofts ERP til mellemstore virksomheder. Shopify-connectoren er indbygget i Business Central, men kræver, at varer, lokationer, kunder og betalingsmåder er sat op, som Shopify forventer dem.',
  'Selskaper på Business Central har ERP som fasit. Nettbutikken må følge ERP, ellers selger den varer som ikke finnes.': 'Virksomheder på Business Central har ERP som facit. Webshoppen skal følge ERP, ellers sælger den varer, der ikke findes.',
  'Business Central med Shopify-konnektor aktivert': 'Business Central med Shopify-connector aktiveret',
  'Varegrupper, lokasjoner og betalingsmåter avklart med regnskap': 'Varegrupper, lokationer og betalingsmåder afklaret med regnskab',
  'varer + priser + lager': 'varer + priser + lager',
  'ordre + kunder': 'ordrer + kunder',
  'fakturastatus': 'fakturastatus',

  // DataFeedWatch
  'DataFeedWatch for Shopify': 'DataFeedWatch til Shopify',
  'DataFeedWatch-integrasjonen tar produktene fra Shopify og lager optimaliserte feeder til Google Merchant Center, Meta og prissammenligningstjenester, med regler for titler, kategorier og ekskluderinger per kanal. Vi setter opp feedene og regelsettet, og følger feilmeldingene fra Merchant Center.':
    'DataFeedWatch-integrationen tager produkterne fra Shopify og laver optimerede feeds til Google Merchant Center, Meta og prissammenligningstjenester, med regler for titler, kategorier og ekskluderinger pr. kanal. Vi sætter feeds og regelsæt op i jeres konto og følger fejlmeldingerne fra Merchant Center, så produkterne forbliver godkendte.',
  'Produktfeed fra Shopify til Google Shopping, Meta og prissammenligning, med regler per kanal.': 'Produktfeed fra Shopify til Google Shopping, Meta og prissammenligning, med regler pr. kanal.',
  'DataFeedWatch er et feed-verktøy. Shopify er kilden, kanalene får hver sin tilpassede feed.': 'DataFeedWatch er et feed-værktøj. Shopify er kilden, og kanalerne får hver deres tilpassede feed.',
  'Google avviser produkter med dårlige titler og manglende attributter. Et feed-verktøy fikser det uten å endre butikken.': 'Google afviser produkter med dårlige titler og manglende attributter. Et feed-værktøj retter det uden at ændre butikken.',
  'DataFeedWatch-konto': 'DataFeedWatch-konto',
  'Merchant Center og Meta Commerce': 'Merchant Center og Meta Commerce',
  'produkter': 'produkter',
  'feed per kanal': 'feed pr. kanal',

  // Dintero
  'Dintero for Shopify': 'Dintero til Shopify',
  'Dintero-integrasjonen gir Vipps, kort og faktura i Shopify-kassen gjennom én avtale og én utbetaling, i stedet for tre leverandører og tre oppgjør. Vi setter opp Dintero sin Shopify-app, tester hver betalingsmetode på mobil og i kassen, og kobler oppgjøret til riktig betalingsmåte i regnskapet slik at bank og bokføring stemmer uten manuell avstemming.':
    'Dintero-integrationen giver Vipps, kort og faktura i Shopify-kassen gennem én aftale og én udbetaling i stedet for tre leverandører og tre afregninger. Vi sætter Dinteros Shopify-app op, tester hver betalingsmetode på mobil og i kassen og kobler afregningen til den rigtige betalingsmåde i regnskabet, så bank og bogføring stemmer uden manuel afstemning.',
  'Norsk betalingsløsning med Vipps, kort og faktura i én avtale.': 'Norsk betalingsløsning med Vipps, kort og faktura i én aftale.',
  'Dintero er en norsk betalingsleverandør som samler flere betalingsmetoder bak én avtale.': 'Dintero er en norsk betalingsudbyder, der samler flere betalingsmetoder bag én aftale.',
  'Én avtale og ett oppgjør er enklere å avstemme enn tre.': 'Én aftale og én afregning er nemmere at afstemme end tre.',
  'Dintero-avtale': 'Dintero-aftale',
  'betalt ordre': 'betalt ordre',

  // Emfas
  'Emfas PIM for Shopify': 'Emfas PIM til Shopify',
  'Emfas-integrasjonen publiserer produkter, varianter, attributter og bilder fra Emfas til Shopify, med attributter som metafelt og bilder fra Emfas sin DAM. Vi kartlegger datamodellen, setter opp mapping og kanaler, og tester publisering før produktdata flyttes over.':
    "Emfas-integrationen publicerer produkter, varianter, attributter og billeder fra Emfas til Shopify, med attributter som metafelter og billeder fra Emfas' DAM. Vi kortlægger datamodellen, sætter mapping og kanaler op og tester publiceringen på et lille udvalg af produkter, før hele kataloget flyttes over.",
  'Produktdata fra Emfas til Shopify, med attributter som metafelt og bilder fra DAM.': 'Produktdata fra Emfas til Shopify, med attributter som metafelter og billeder fra DAM.',
  'Emfas er et norsk PIM- og DAM-system. Shopify-koblingen setter Emfas som fasit for produktinformasjon.': 'Emfas er et norsk PIM- og DAM-system. Shopify-koblingen gør Emfas til facit for produktinformation.',
  'Når produktdata lever i Emfas, må nettbutikken følge med uten manuell kopiering.': 'Når produktdata lever i Emfas, skal webshoppen følge med uden manuel kopiering.',
  'Emfas med Shopify-kanal': 'Emfas med Shopify-kanal',
  'Attributtmodell avklart': 'Attributmodel afklaret',
  'produkter + attributter + bilder': 'produkter + attributter + billeder',

  // Feed
  'Feed PIM for Shopify': 'Feed PIM til Shopify',
  'Feed-integrasjonen gjør Feed til fasit for produktdata og publiserer produkter, varianter, bilder og attributter til Shopify. Vi setter opp mapping av attributter til Shopify-metafelt, kanaler per marked og regler for hva som skal publiseres, slik at produktdata vedlikeholdes ett sted.':
    'Feed-integrationen gør Feed til facit for produktdata og publicerer produkter, varianter, billeder og attributter til Shopify. Vi sætter mapping af attributter til Shopify-metafelter op, kanaler pr. marked og regler for, hvad der skal publiceres, så produktdata vedligeholdes ét sted, og alle kanaler viser det samme indhold.',
  'Produktdata eid i Feed og publisert til Shopify med varianter, bilder og attributter.': 'Produktdata ejet i Feed og publiceret til Shopify med varianter, billeder og attributter.',
  'Feed er et norsk PIM-system. Shopify-koblingen er Feed sin egen, og jobben ligger i datamodell og mapping.': 'Feed er et norsk PIM-system. Shopify-koblingen er Feeds egen, og arbejdet ligger i datamodel og mapping.',
  'Med mange varianter og flere kanaler blir produktdata i Shopify alene uhåndterlig. PIM gir én fasit.': 'Med mange varianter og flere kanaler bliver produktdata i Shopify alene uoverskuelige. PIM giver ét facit.',
  'Feed med Shopify-kanal': 'Feed med Shopify-kanal',
  'produkter + varianter + bilder': 'produkter + varianter + billeder',

  // Fiken
  'Fiken-integrasjon for Shopify': 'Fiken-integration til Shopify',
  'Fiken-integrasjonen sender betalte Shopify-ordre til Fiken som salg med kunde og linjer, for små selskaper som fører regnskapet selv. Den er under utprøving med første kunde og bygges som Make.com-scenario etter samme mønster som Tripletex, med kundeoppslag og produktoppslag før hver ordre.':
    'Fiken-integrationen sender betalte Shopify-ordrer til Fiken som salg med kunde og linjer, til små virksomheder, der selv fører regnskabet. Den er under afprøvning med den første kunde og bygges som Make.com-scenarie efter samme mønster som Tripletex, med kundeopslag og produktopslag før hver ordre.',
  'Shopify-salg til Fiken for små selskaper. Under utprøving med første kunde.': 'Shopify-salg til Fiken for små virksomheder. Under afprøvning med den første kunde.',
  'Fiken er et norsk regnskapsprogram for små bedrifter. Integrasjonen oppretter salg i Fiken fra Shopify-ordre, og vi prøver den ut med en butikk som flyttet fra PrestaShop.': 'Fiken er et norsk regnskabsprogram til små virksomheder. Integrationen opretter salg i Fiken fra Shopify-ordrer, og vi afprøver den med en butik, der flyttede fra PrestaShop.',
  'Små butikker punsher ofte ordre selv. Med integrasjonen går salget rett inn, og mva-meldingen bygger på det som faktisk ble solgt.': 'Små butikker taster ofte ordrer ind selv. Med integrationen går salget direkte ind, og momsangivelsen bygger på det, der faktisk blev solgt.',
  'Fiken med API-tilgang': 'Fiken med API-adgang',
  'Kreditnota, kommer etter piloten': 'Kreditnota, kommer efter piloten',
  'ordre + kunde → salg': 'ordre + kunde → salg',

  // Front Systems
  'Front Systems-integrasjon for Shopify': 'Front Systems-integration til Shopify',
  'Front Systems-integrasjonen kobler butikk-POS i Front til nettbutikken i Shopify Plus, slik at varer, lager og kunder er de samme i butikk og på nett, og nettordre kan hentes eller returneres i butikk. Vi bygger flyten mot Front sitt API i Make.com og tester den i én butikk før resten.':
    'Front Systems-integrationen kobler butiks-POS i Front til webshoppen i Shopify Plus, så varer, lager og kunder er de samme i butikken og på nettet, og netordrer kan afhentes eller returneres i butikken. Vi bygger flowet mod Fronts API i Make.com og tester det i én butik før resten.',
  'Butikk-POS og nettbutikk på samme varelager. Ordre og kunder mellom Shopify Plus og Front.': 'Butiks-POS og webshop på samme varelager. Ordrer og kunder mellem Shopify Plus og Front.',
  'Front Systems er et norsk kassesystem for kjeder og mote. API-et gir tilgang til varer, lager, kunder og salg, og integrasjonen bruker det i begge retninger.': "Front Systems er et norsk kassesystem til kæder og mode. API'et giver adgang til varer, lager, kunder og salg, og integrationen bruger det i begge retninger.",
  'Kjeder med både butikk og nett vil ikke ha to varelagre og to kundebaser. Da må POS og nettbutikk snakke sammen.': 'Kæder med både butik og net vil ikke have to varelagre og to kundebaser. Så skal POS og webshop tale sammen.',
  'Front Systems med API-nøkkel': 'Front Systems med API-nøgle',
  'varer + lager': 'varer + lager',

  // Google Sheets
  'Google Sheets-integrasjon for Shopify': 'Google Sheets-integration til Shopify',
  'Google Sheets-integrasjonen sender ordre, skjemasvar eller oppsigelser fra Shopify og nettsiden inn i regneark som teamet allerede jobber i, for plukklister, samlefakturering eller oppfølging. Den kjører som Make.com-flyt og er den enkleste måten å få data ut av Shopify på.':
    'Google Sheets-integrationen sender ordrer, formularsvar eller opsigelser fra Shopify og hjemmesiden ind i de regneark, teamet allerede arbejder i, til pluklister, samlefakturering eller opfølgning. Den kører som Make.com-flow i jeres egen konto og er den enkleste måde at få data ud af Shopify på.',
  'Skjemaer og ordre inn i regneark når det er der jobben gjøres. Ordreark for plukk og samlefaktura.': 'Formularer og ordrer ind i regneark, når det er der, arbejdet gøres. Ordreark til pluk og samlefaktura.',
  'Google Sheets er regnearket alle har. Som integrasjon er det et arbeidsbord, ikke et system, og det er ofte nok.': 'Google Sheets er det regneark, alle har. Som integration er det et arbejdsbord, ikke et system, og det er ofte nok.',
  'Noen ganger er svaret et ark. Et ordreark for plukk eller en liste over oppsigelser slår et nytt system.': 'Nogle gange er svaret et ark. Et ordreark til pluk eller en liste over opsigelser slår et nyt system.',
  'Google Workspace': 'Google Workspace',
  'Shopify eller skjema': 'Shopify eller formular',
  'ordre → ordreark': 'ordre → ordreark',

  // Holio
  'Holio-integrasjon for Shopify': 'Holio-integration til Shopify',
  'Holio-integrasjonen kobler Shopify til Holio sitt ordre- og lagersystem, slik at ordre går inn i Holio for plukk og pakk, og lager og sporing kommer tilbake til Shopify. Vi setter opp Holio sin Shopify-kobling og tester plukk, pakk, retur og lagerjustering før go-live.':
    'Holio-integrationen kobler Shopify til Holios ordre- og lagersystem, så ordrer går ind i Holio til pluk og pak, og lager og tracking kommer tilbage til Shopify. Vi sætter Holios Shopify-kobling op og tester pluk, pak, retur og lagerjustering før go-live.',
  'Ordre- og lagersystem for mindre grossister. Ordre inn, lager og forsendelser tilbake.': 'Ordre- og lagersystem til mindre grossister. Ordrer ind, lager og forsendelser tilbage.',
  'Holio er et norsk OMS og WMS for mindre grossister og nettbutikker med eget lager. Et lettere alternativ til Omnium.': 'Holio er et norsk OMS og WMS til mindre grossister og webshops med eget lager. Et lettere alternativ til Omnium.',
  'Med eget lager og flere kanaler trenger du ett sted for plukk og lager, uten å betale for mer enn du bruker.': 'Med eget lager og flere kanaler har I brug for ét sted til pluk og lager, uden at betale for mere, end I bruger.',
  'Holio-konto med Shopify-kobling': 'Holio-konto med Shopify-kobling',
  'Lagerlokasjoner avklart': 'Lagerlokationer afklaret',
  'ordre': 'ordrer',
  'lager + sporing': 'lager + tracking',

  // IZY
  'IZY Rental for Shopify': 'IZY Rental til Shopify',
  'IZY-integrasjonen gir utleiebooking i Shopify: kunden velger periode, ser tilgjengelighet, legger til tilbehør og betaler i kassen som en vanlig ordre. Vi setter opp IZY sin app, leveringsvalg etter postnummer med post, budbil eller henting, og kobler bookingen videre til fakturering i regnskapet og fraktetikett når leien skal sendes.':
    'IZY-integrationen giver udlejningsbooking i Shopify: kunden vælger periode, ser tilgængelighed, tilføjer tilbehør og betaler i kassen som en almindelig ordre. Vi sætter IZYs app op, leveringsvalg efter postnummer med post, kurér eller afhentning, og kobler bookingen videre til fakturering i regnskabet og fragtlabel, når lejen skal sendes.',
  'Utleie med datoperiode, tilgjengelighet og tilbehør, rett i Shopify-kassen.': 'Udlejning med datoperiode, tilgængelighed og tilbehør, direkte i Shopify-kassen.',
  'IZY Rental er en bookingapp for utleie på Shopify. Bookingen blir en ordre, resten av flyten er som for andre ordre.': 'IZY Rental er en bookingapp til udlejning på Shopify. Bookingen bliver en ordre, og resten af flowet er som for andre ordrer.',
  'Utleie krever periode og tilgjengelighet. Standard Shopify har ingen av delene.': 'Udlejning kræver periode og tilgængelighed. Standard Shopify har ingen af delene.',
  'IZY-konto': 'IZY-konto',
  'Regler for levering og henting': 'Regler for levering og afhentning',
  'booking → ordre': 'booking → ordre',
  'kansellering': 'annullering',
}

// Subjects used in "Kan vi starte med X og utvide senere?" and category names.
const SUBJECT: Record<string, string> = {
  frakt: 'fragt', ERP: 'ERP', feed: 'feedet', betaling: 'betaling', produktdata: 'produktdata', salg: 'salg', POS: 'POS', ordreark: 'ordrearket', lager: 'lager', booking: 'booking',
}
const CAT_NAME: Record<string, string> = {
  betaling: 'betaling', 'booking og annet': 'booking og andet', 'erp og økonomi': 'ERP og økonomi', 'logistikk og frakt': 'logistik og fragt',
  'markedsføring og sporing': 'markedsføring og tracking', 'oms, lager og edi': 'OMS, lager og EDI', 'pim og produktdata': 'PIM og produktdata', 'pos og butikk': 'POS og butik',
}
const ANCHOR: Record<string, string> = { eierskap: 'ejerskab', feil: 'fejl', fasit: 'facit', andre: 'andre-systemer' }

const PATTERNS: [RegExp, (m: RegExpMatchArray) => string | undefined][] = [
  [/^Kjører dere (.+) i dag\?$/, (m) => `Kører I ${m[1]} i dag?`],
  [/^Eier vi integrasjonen mot (.+) selv\?$/, (m) => `Ejer vi selv integrationen mod ${m[1]}?`],
  [/^Kan vi starte med (.+) og utvide senere\?$/, (m) => SUBJECT[m[1]] && `Kan vi starte med ${SUBJECT[m[1]]} og udvide senere?`],
  [/^Hva som skal flyte mellom Shopify og (.+), hvem som er fasit for hva, og hva som skjer ved feil\. Én arbeidsøkt\.$/, (m) => `Hvad der skal flyde mellem Shopify og ${m[1]}, hvilket system der er facit for hvad, og hvad der sker ved fejl. Én arbejdssession.`],
  [/^Hvilke (.+)-systemer støtter dere\?$/, (m) => CAT_NAME[m[1]] && `Hvilke systemer til ${CAT_NAME[m[1]]} understøtter I?`],
  [/^Hvilket system bruker dere til (.+)\?$/, (m) => CAT_NAME[m[1]] && `Hvilket system bruger I til ${CAT_NAME[m[1]]}?`],
]

const missing: string[] = []
function tr(s: string | undefined | null): string | undefined {
  if (s == null || s === '') return s ?? undefined
  if (D[s] !== undefined) return D[s]
  for (const [re, fn] of PATTERNS) {
    const m = s.match(re)
    if (m) { const out = fn(m); if (out) return out }
  }
  missing.push(s)
  return s
}
/** Known product/system names stay as they are; phrases are translated. */
function sysName(s: string): string { return D[s] ?? s }
function pt(blocks: any[] | undefined): any[] | undefined {
  if (!Array.isArray(blocks)) return blocks
  return blocks.map((b) => b?._type === 'block' && Array.isArray(b.children)
    ? { ...b, children: b.children.map((c: any) => (c?._type === 'span' && typeof c.text === 'string' ? { ...c, text: tr(c.text) } : c)) }
    : b)
}
// External (non -no suffixed) page ids → the Danish document of the same type, filled in main().
const extMap: Record<string, string | null> = {}
const daId = (id: string): string | null => (id.endsWith('-no') ? id.replace(/-no$/, '-da') : id in extMap ? extMap[id] : id)
const weak = (r: Doc): Doc | null => { const ref = daId(r._ref); return ref ? { ...r, _type: 'reference', _ref: ref, _weak: true } : null }
const weakList = (refs: Doc[]): Doc[] => refs.map(weak).filter((r): r is Doc => r !== null)
const words = (s: string) => s.trim().split(/\s+/).length

function buildDa(no: Doc): Doc {
  const { _rev, _createdAt, _updatedAt, ...rest } = no
  const da: Doc = { ...rest, _id: daId(no._id), language: 'da' }
  da.slug = { _type: 'slug', current: String(no.slug.current).replace(/^integrasjoner/, 'integrations') }
  for (const f of ['pageTitle', 'title', 'definition', 'shortDescription']) if (typeof no[f] === 'string') da[f] = tr(no[f])
  for (const f of ['intro', 'whatItIs', 'whyItMatters']) if (Array.isArray(no[f])) da[f] = pt(no[f])
  if (Array.isArray(no.sections)) da.sections = no.sections.map((s: Doc) => ({ ...s, heading: tr(s.heading), anchor: s.anchor ? ANCHOR[s.anchor] ?? tr(s.anchor) : s.anchor, body: pt(s.body) }))
  if (Array.isArray(no.implementationSteps)) da.implementationSteps = no.implementationSteps.map((s: Doc) => ({ ...s, name: tr(s.name), text: tr(s.text) }))
  for (const f of ['prerequisites', 'notIncluded']) if (Array.isArray(no[f])) da[f] = no[f].map((x: string) => tr(x))
  if (Array.isArray(no.faq)) da.faq = no.faq.map((q: Doc) => ({ ...q, question: tr(q.question), answer: tr(q.answer) }))
  if (no.cta) da.cta = { ...no.cta, heading: tr(no.cta.heading), text: tr(no.cta.text), buttonLabel: tr(no.cta.buttonLabel), buttonHref: '/contact' }
  if (Array.isArray(no.dataFlowSteps)) da.dataFlowSteps = no.dataFlowSteps.map((s: Doc) => ({ ...s, payload: tr(s.payload), frequency: tr(s.frequency), from: sysName(s.from), to: sysName(s.to) }))
  if (no.seoExtended) da.seoExtended = { ...no.seoExtended, metaTitle: tr(no.seoExtended.metaTitle), metaDescription: tr(no.seoExtended.metaDescription) }
  if (no.category?._ref) da.category = weak(no.category)
  if (no.pillar?._ref) da.pillar = weak(no.pillar)
  if (Array.isArray(no.clusterLinks)) da.clusterLinks = weakList(no.clusterLinks)
  if (Array.isArray(no.relatedPages)) da.relatedPages = weakList(no.relatedPages)
  return da
}

async function main() {
  const sources = await client.fetch<Doc[]>('*[_id in $ids]', { ids: SOURCE_IDS })
  const found = new Set(sources.map((d) => d._id))
  const absent = SOURCE_IDS.filter((id) => !found.has(id))
  if (absent.length) throw new Error(`missing Norwegian sources in ${dataset}: ${absent.join(', ')}`)

  // External (non -no suffixed) references → the Danish document of the same type, if any.
  const extIds = new Set<string>()
  for (const d of sources) for (const r of [...(d.clusterLinks ?? []), ...(d.relatedPages ?? [])]) if (r?._ref && !r._ref.endsWith('-no')) extIds.add(r._ref)
  const extDocs = await client.fetch<{ _id: string; _type: string }[]>('*[_id in $ids]{_id,_type}', { ids: [...extIds] })
  for (const e of extDocs) {
    extMap[e._id] = await client.fetch<string | null>('*[_type == $type && language == "da"][0]._id', { type: e._type })
    console.log(dataset, 'external', e._type, e._id, '→', extMap[e._id] ?? '(none, skipped)')
  }
  for (const id of extIds) if (!(id in extMap)) { extMap[id] = null; console.log(dataset, 'external ref not found', id, '(skipped)') }

  const docs = sources.map(buildDa)
  if (missing.length) throw new Error(`untranslated strings:\n${[...new Set(missing)].map((s) => `  - ${s}`).join('\n')}`)
  if (process.env.DRY_RUN) {
    for (const d of docs) console.log('DRY', d._id, d.slug.current, d.definition ? `${words(d.definition)} words` : '')
    return
  }

  for (const d of docs) {
    await client.createOrReplace(d as { _id: string; _type: string } & Doc)
    console.log(dataset, 'wrote', d._id, d.definition ? `(${words(d.definition)} words in definition)` : '')
  }
  for (const no of sources) {
    const type = no._type
    const metaId = no._id.replace(/-no$/, '-meta')
    const meta = await client.fetch<Doc | null>('*[_id == $id][0]', { id: metaId })
    if (!meta) throw new Error(`${metaId} is missing; run the en script first`)
    if ((meta.translations ?? []).some((t: Doc) => t._key === 'da')) {
      console.log(dataset, metaId, 'already has da')
      continue
    }
    await client.patch(metaId).insert('after', 'translations[-1]', [
      { _key: 'da', value: { _type: 'reference', _ref: daId(no._id), _weak: true, _strengthenOnPublish: { type } } },
    ]).commit()
    console.log(dataset, 'patched', metaId, 'with da')
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
