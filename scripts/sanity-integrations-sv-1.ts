// TARGET_DATASET=production npx sanity exec scripts/sanity-integrations-sv-1.ts --with-user-token
// Creates the Swedish (sv) versions of the integrations pillar, the 8 integration
// categories and 12 integration pages (batch 1 of 3) from their Norwegian
// sources, and adds the sv entry to each translation.metadata. Idempotent:
// createOrReplace on fixed ids, and the metadata patch only runs when no 'sv'
// key exists. References are weak so the three batches can run in any order.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

const CATEGORY_KEYS = ['betaling', 'booking', 'erp', 'logistikk', 'markedsforing', 'oms', 'pim', 'pos']
const INTEGRATIONS = ['24sevenoffice', 'bring', 'business-central', 'datafeedwatch', 'dintero', 'emfas', 'feed', 'fiken', 'front-systems', 'google-sheets', 'holio', 'izy']
const SOURCE_IDS = ['pillar-integrasjoner-no', ...CATEGORY_KEYS.map((k) => `integration-cat-${k}-no`), ...INTEGRATIONS.map((x) => `integration-${x}-no`)]

// Norwegian page ids (non-template documents) → their document type. The
// Swedish counterpart is looked up at runtime by type + language == "sv".
const PAGE_TYPE: Record<string, string> = {
  '1368ee2e-b89e-44e4-ac40-36fd19f2c879': 'allPackagesPage',
  '46bf58c8-302e-4fb2-bebe-5c6f505a97b3': 'partnersPage',
  'b6bda7fa-b329-48d0-8aed-e73335edf5ec': 'migratePage',
  '893a0019-404e-4c88-ae34-ae35fc49cce8': 'vippsHurtigkassePage',
  'f7ff26d7-2ad7-4761-a4bd-eab870dfbda9': 'shopifyXPimPage',
  '63c2d5f4-7e53-4d86-9fea-e1069542a939': 'shopifyPosPage',
}
const PAGE_ID_MAP: Record<string, string> = {}

// ---------------------------------------------------------------------------
// Translations. Exact Norwegian string → Swedish. Anything not found here (or
// in the patterns below) makes the script fail, so nothing Norwegian leaks.
// ---------------------------------------------------------------------------
const D: Record<string, string> = {
  // Shared
  'Book en samtale': 'Boka ett samtal',
  'Vi svarer med metode, dataflyt og tidsplan innen to virkedager.': 'Vi svarar med metod, dataflöde och tidsplan inom två arbetsdagar.',
  'Fortell oss hvilke systemer du har, så får du metode, dataflyt og tidsplan innen to virkedager.': 'Berätta vilka system du har, så får du metod, dataflöde och tidsplan inom två arbetsdagar.',
  'Hvem eier integrasjonen etterpå?': 'Vem äger integrationen efteråt?',
  'Du. Make.com-scenarioer ligger i din konto, kode leveres med kildekode.': 'Du. Make.com-scenarier ligger i ditt konto, och kod levereras med källkod.',
  'Hva skjer når en kjøring feiler?': 'Vad händer när en körning misslyckas?',
  'Hver kjøring ligger i historikken. Feil varsles med referanse, og vi rydder opp sammen.': 'Varje körning ligger i historiken. Fel flaggas med referens, och vi städar upp tillsammans.',
  'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen.': 'Varje körning ligger i historiken med in- och utdata. Fel flaggas med referens, och vi städar upp tillsammans.',
  'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen. Det finnes ingen automatisk tilbakerulling, og det sier vi rett ut.': 'Varje körning ligger i historiken med in- och utdata. Fel flaggas med referens, och vi städar upp tillsammans. Det finns ingen automatisk återställning, och det säger vi rakt ut.',
  'Make.com eller egen kode?': 'Make.com eller egen kod?',
  'Make.com når flyten er greiner og oppslag og du vil kunne åpne en kjøring selv. Egen kode når det er mye transformasjon, høyt volum eller behov for testmiljø.': 'Make.com när flödet består av grenar och uppslag och du vill kunna öppna en körning själv. Egen kod när det är mycket transformation, hög volym eller behov av testmiljö.',
  'De som står på denne siden kjører vi i dag. Står ikke ditt system her, kan vi som regel koble det likevel, enten via API i Make.com eller som egen kode.': 'De som står på den här sidan kör vi i dag. Står inte ditt system här kan vi som regel koppla det ändå, antingen via API i Make.com eller som egen kod.',
  'Ja. Make.com-scenarioer ligger i din konto, og kode leveres med kildekode. Vi drifter om du vil, men du er ikke låst til oss.': 'Ja. Make.com-scenarier ligger i ditt konto, och kod levereras med källkod. Vi driftar om du vill, men du är inte låst till oss.',
  'Ja. De fleste starter med én flyt, for eksempel ordre, og legger til lager eller kunder etterpå.': 'Ja. De flesta börjar med ett flöde, till exempel order, och lägger till lager eller kunder efteråt.',
  'Hvor lang tid tar oppsettet?': 'Hur lång tid tar uppsättningen?',
  'Make.com-flyter leveres på dager når kartleggingen er gjort. Egen kode tar lenger, og vi gir tidsplan etter første samtale.': 'Make.com-flöden levereras på dagar när kartläggningen är gjord. Egen kod tar längre tid, och vi ger en tidsplan efter första samtalet.',
  'Kartlegging': 'Kartläggning',
  'Oppsett': 'Uppsättning',
  'Tilkobling i din egen konto, mapping av felt, og testdata gjennom hele flyten.': 'Anslutning i ditt eget konto, mappning av fält och testdata genom hela flödet.',
  'Test på reelle data': 'Test på verkliga data',
  'De første ordrene eller produktene følges manuelt før vi slår på alt.': 'De första ordrarna eller produkterna följs manuellt innan vi slår på allt.',
  'Go-live og overvåking': 'Go-live och övervakning',
  'Vi følger de første ukene. Feil varsles med referanse til ordren.': 'Vi följer de första veckorna. Fel flaggas med referens till ordern.',
  'Shopify': 'Shopify',
  'Shopify eller Shopify Plus': 'Shopify eller Shopify Plus',
  'Shopify Plus': 'Shopify Plus',
  'Make.com-konto': 'Make.com-konto',
  'Make.com-konto i ditt navn': 'Make.com-konto i ditt namn',
  'Lager': 'Lager',
  'Attributtmodell avklart': 'Attributmodell fastställd',
  // data-flow frequencies and payloads
  'sanntid': 'realtid',
  'løpende': 'löpande',
  'daglig': 'dagligen',
  'ved pakking': 'vid packning',
  'ved publisering': 'vid publicering',
  'ordre + kunde → faktura': 'order + kund → faktura',
  'betaling registrert': 'betalning registrerad',
  'refusjon → kreditnota': 'återbetalning → kreditnota',
  'fraktvalg i kassen': 'fraktval i kassan',
  'etikett': 'etikett',
  'sporing': 'spårning',
  'varer + priser + lager': 'artiklar + priser + lager',
  'ordre + kunder': 'order + kunder',
  'fakturastatus': 'fakturastatus',
  'produkter': 'produkter',
  'feed per kanal': 'feed per kanal',
  'betalt ordre': 'betald order',
  'produkter + attributter + bilder': 'produkter + attribut + bilder',
  'produkter + varianter + bilder': 'produkter + varianter + bilder',
  'ordre + kunde → salg': 'order + kund → försäljning',
  'varer + lager': 'artiklar + lager',
  'ordre → ordreark': 'order → orderark',
  'ordre': 'order',
  'lager + sporing': 'lager + spårning',
  'booking → ordre': 'bokning → order',
  'kansellering': 'avbokning',
  // system names that are phrases, not product names
  'Google og Meta': 'Google och Meta',
  'De fleste butikkene vi har migrert': 'De flesta butiker vi har migrerat',

  // Pillar
  'Shopify koblet til systemene du allerede bruker': 'Shopify kopplat till systemen du redan använder',
  'En Shopify-integrasjon kobler nettbutikken til systemene som driver resten av selskapet: regnskap, ordrehåndtering, lager, frakt, betaling og markedsføring. Vi bygger dem i Make.com når flyten skal være synlig og enkel å endre, og som egen kode når volum eller logikk krever det. Dokumentert dataflyt, og du eier scenarioet i din egen konto.':
    'En Shopify-integration kopplar webbutiken till systemen som driver resten av företaget: ekonomi, orderhantering, lager, frakt, betalning och marknadsföring. Vi bygger dem i Make.com när flödet ska vara synligt och enkelt att ändra, och som egen kod när volym eller logik kräver det. Dokumenterat dataflöde, och du äger scenariot i ditt eget konto.',
  'Hvem eier integrasjonen': 'Vem äger integrationen',
  'Make.com-scenarioer settes opp i din egen Make-konto med dine tilkoblinger. Kode leveres med kildekode i ditt repo. Vi drifter om du vil, men du er aldri låst til oss.': 'Make.com-scenarier sätts upp i ditt eget Make-konto med dina anslutningar. Kod levereras med källkod i ditt repo. Vi driftar om du vill, men du är aldrig låst till oss.',
  'Hva skjer når noe feiler': 'Vad händer när något går fel',
  'Hver kjøring ligger i historikken med inn- og utdata per modul. Feil varsles med referanse til ordren. Det finnes ingen automatisk tilbakerulling, og vi rydder opp sammen når det trengs.': 'Varje körning ligger i historiken med in- och utdata per modul. Fel flaggas med referens till ordern. Det finns ingen automatisk återställning, och vi städar upp tillsammans när det behövs.',
  'Shopify eller systemet som fasit': 'Shopify eller systemet som facit',
  'For regnskap er Shopify fasit og regnskapet mottaker. For OMS og enkelte ERP, som Omnium, UniMicro og TRIMIT, er systemet fasit for lager og Shopify viser det. Vi avklarer dette først, fordi det styrer alt annet.': 'För ekonomi är Shopify facit och ekonomisystemet mottagare. För OMS och vissa ERP, som Omnium, UniMicro och TRIMIT, är systemet facit för lager och Shopify visar det. Vi reder ut detta först, eftersom det styr allt annat.',
  'Systemet ditt står ikke på listen': 'Ditt system står inte på listan',
  'Har systemet et API, kan vi som regel koble det. Send oss hva du har, så svarer vi med metode og tidsplan.': 'Har systemet ett API kan vi som regel koppla det. Skicka oss vad du har, så svarar vi med metod och tidsplan.',
  'Make.com eller egen kode, hvordan velger dere?': 'Make.com eller egen kod, hur väljer ni?',
  'Make.com når flyten er greiner og oppslag, og når du vil kunne åpne en kjøring selv. Egen kode når det er mye transformasjon, høyt volum, eller behov for versjonskontroll og testmiljø. De fleste regnskaps- og OMS-integrasjoner er Make.com.': 'Make.com när flödet består av grenar och uppslag, och när du vill kunna öppna en körning själv. Egen kod när det är mycket transformation, hög volym eller behov av versionshantering och testmiljö. De flesta ekonomi- och OMS-integrationer är Make.com.',
  'Systemet mitt står ikke på listen. Kan dere likevel?': 'Mitt system står inte på listan. Kan ni ändå?',
  'Som regel ja, hvis systemet har et API. Send oss hva du har.': 'Som regel ja, om systemet har ett API. Skicka oss vad du har.',
  'Fortell oss hvilke systemer du har': 'Berätta vilka system du har',

  // Categories
  'Betaling': 'Betalning',
  'Betalingsintegrasjoner dekker kassen og oppgjøret. Vipps Hurtigkasse, Klarna, Dintero og Shopify Payments settes opp og testes, og utbetalingene føres mot riktig betalingsmåte i regnskapet slik at bank og bokføring stemmer uten manuell avstemming.':
    'Betalningsintegrationer täcker kassan och avräkningen. Klarna, Dintero och Shopify Payments, samt Vipps Hurtigkasse för butiker som säljer i Norge, sätts upp och testas på mobil och i kassan, och utbetalningarna bokförs mot rätt betalsätt i ekonomisystemet så att bank och bokföring stämmer utan manuell avstämning.',
  'Booking og annet': 'Bokning och annat',
  'Når salget starter et annet sted enn i kassen. Bookinger fra Podio og IZY blir Shopify-ordre, brukere opprettes i Moodle når et kurs er kjøpt, og skjemaer havner i Google Sheets. Make.com-flyter som er lette å lese og endre.':
    'När försäljningen börjar någon annanstans än i kassan. Bokningar från Podio och IZY blir Shopify-order, användare skapas i Moodle när en kurs är köpt, och formulär hamnar i Google Sheets. Make.com-flöden som är lätta att läsa och ändra, i ditt eget konto.',
  'ERP og økonomi': 'ERP och ekonomi',
  'En regnskapsintegrasjon flytter betalte ordre fra Shopify til regnskapssystemet som faktura, salgsbilag eller bilagsjournal, med kunde, mva og frakt på riktig konto. Refusjoner blir kreditnota. Vi kjører dette i dag mot Tripletex, 24SevenOffice, PowerOffice Go og Fiken, som Make.com-scenarioer i din egen konto. Fakturaer sendes ikke før regnskapsfører har sett dem.':
    'En ekonomiintegration flyttar betalda order från Shopify till ekonomisystemet som faktura, försäljningsverifikat eller verifikationsjournal, med kund, moms och frakt på rätt konto. Återbetalningar blir kreditnotor. Vi kör detta i dag mot Tripletex, 24SevenOffice, PowerOffice Go och Fiken, som Make.com-scenarier i ditt eget konto. Fakturor skickas inte förrän redovisningskonsulten har sett dem.',
  'Logistikk og frakt': 'Logistik och frakt',
  'Fraktintegrasjoner gir riktige fraktvalg i kassen, etiketter fra ordren og sporing tilbake til kunden. Vi jobber med Bring, Profrakt, nShift, Logistra og Quickship, som offisielle apper eller Make.com-flyter når etiketten skal utløses fra et annet system enn Shopify.':
    'Fraktintegrationer ger rätt fraktval i kassan, etiketter från ordern och spårning tillbaka till kunden. Vi arbetar med Bring, Profrakt, nShift, Logistra och Quickship, som officiella appar eller som Make.com-flöden när etiketten ska utlösas från ett annat system än Shopify, till exempel ett OMS.',
  'Markedsføring og sporing': 'Marknadsföring och spårning',
  'Kundedata og hendelser fra Shopify til verktøyene som driver salget: Klaviyo og MarketingPlatform for e-post og SMS, Tracklution for server-side sporing til Meta, Google og affiliate, og Judge.me eller Lipscore for anmeldelser.':
    'Kunddata och händelser från Shopify till verktygen som driver försäljningen: Klaviyo och MarketingPlatform för e-post och sms, Tracklution för server-side-spårning till Meta, Google och affiliate, och Judge.me eller Lipscore för omdömen. Uppsatt så att varje kanal ser samma order och kunder.',
  'OMS, lager og EDI': 'OMS, lager och EDI',
  'Et ordrehåndteringssystem samler ordre fra nettbutikk, butikk og EDI på ett sted, og styrer lager og plukk. Vi kobler Shopify til Omnium, Holio og Ongoing, slik at ordre går inn og lager kommer tilbake, og EDI-ordre fra kjedene flyter videre til regnskap uten manuell punching.':
    'Ett orderhanteringssystem samlar order från webbutik, butik och EDI på ett ställe, och styr lager och plock. Vi kopplar Shopify till Omnium, Holio och Ongoing, så att order går in och lager kommer tillbaka, och EDI-order från kedjorna flödar vidare till ekonomisystemet utan manuell inmatning.',
  'PIM og produktdata': 'PIM och produktdata',
  'Produktdata som eies i PIM eller leverandørfeed og publiseres til Shopify med varianter, bilder og attributter. Vi setter opp Vuuh, DatafeedWatch og Google Merchant Center slik at produktdata har én fasit og nettbutikk, markedsplasser og annonser får samme innhold.':
    'Produktdata som ägs i PIM eller leverantörsfeed och publiceras till Shopify med varianter, bilder och attribut. Vi sätter upp Vuuh, DataFeedWatch och Google Merchant Center så att produktdata har ett facit och webbutik, marknadsplatser och annonser får samma innehåll, utan manuell kopiering mellan kanalerna.',
  'POS og butikk': 'POS och butik',
  'Butikk og nettbutikk på samme varelager og kundebase. Vi setter opp Shopify POS, kobler Front Systems til Shopify Plus, og flytter kunder fra PCKasse med gavekort og kundedata intakt.':
    'Butik och webbutik på samma lager och kundbas. Vi sätter upp Shopify POS, kopplar Front Systems till Shopify Plus, och flyttar kunder från PCKasse med presentkort och kunddata intakta, så att kassan och webbplatsen säljer från ett och samma lager.',

  // 24SevenOffice
  '24SevenOffice og Finago-integrasjon for Shopify': '24SevenOffice- och Finago-integration för Shopify',
  'Finago og 24SevenOffice er samme system. Faktura per ordre med betaling registrert, refusjoner som kreditnota.': 'Finago och 24SevenOffice är samma system. Faktura per order med betalning registrerad, återbetalningar som kreditnota.',
  '24SevenOffice-integrasjonen oppretter en faktura i 24SevenOffice for hver betalte Shopify-ordre, med kunde, linjer, frakt og riktig salgstype, og registrerer betalingen mot betalingsmåten ordren ble betalt med. Refusjoner i Shopify blir kreditnota. Flyten går én vei fra Shopify og kjører som Make.com-scenario i din egen konto, med REST for faktura og SOAP for betalingsregistrering.':
    '24SevenOffice-integrationen skapar en faktura i 24SevenOffice för varje betald Shopify-order, med kund, rader, frakt och rätt försäljningstyp, och registrerar betalningen mot det betalsätt ordern betalades med. Återbetalningar i Shopify blir kreditnotor. Flödet går en väg från Shopify och körs som Make.com-scenario i ditt eget konto, med REST för faktura och SOAP för betalningsregistrering.',
  '24SevenOffice, tidligere Finago, er et norsk regnskapssystem med både moderne REST-API og eldre SOAP-tjenester. Integrasjonen bruker begge: faktura og kunde opprettes via REST, betalingen registreres via SOAP fordi det bare finnes der. Salgstype og dimensjoner settes per ordre, slik at B2C og utland havner på riktig konto.':
    '24SevenOffice, tidigare Finago, är ett norskt ekonomisystem med både ett modernt REST-API och äldre SOAP-tjänster. Integrationen använder båda: faktura och kund skapas via REST, betalningen registreras via SOAP eftersom den bara finns där. Försäljningstyp och dimensioner sätts per order, så att B2C och export hamnar på rätt konto.',
  'Uten betalingsregistrering må regnskapsfører avstemme hver Shopify-faktura manuelt mot utbetalingene. Med integrasjonen er fakturaen både opprettet og betalt i regnskapet når ordren er betalt i Shopify, og kreditnotaen kommer av seg selv ved refusjon.':
    'Utan betalningsregistrering måste redovisningskonsulten stämma av varje Shopify-faktura manuellt mot utbetalningarna. Med integrationen är fakturan både skapad och betald i ekonomisystemet när ordern är betald i Shopify, och kreditnotan kommer av sig själv vid återbetalning.',
  'Salgstyper, betalingsmåter per gateway, dimensjoner for avdeling og land, og mva på frakt.': 'Försäljningstyper, betalsätt per gateway, dimensioner för avdelning och land, och moms på frakt.',
  'Oppsett i Make.com': 'Uppsättning i Make.com',
  'REST- og SOAP-tilganger fra 24SevenOffice, scenario for ordre og for refusjoner i din konto.': 'REST- och SOAP-åtkomst från 24SevenOffice, ett scenario för order och ett för återbetalningar i ditt konto.',
  'Test på reelle ordre': 'Test på verkliga order',
  'Første ordre, første refusjon og en ordre med flere betalingsmåter følges manuelt.': 'Första ordern, första återbetalningen och en order med flera betalsätt följs manuellt.',
  'Nattlig sveip fanger refusjoner som webhook-kallet ikke rakk.': 'En nattlig svepning fångar återbetalningar som webhook-anropet missade.',
  '24SevenOffice med REST- og SOAP-tilgang': '24SevenOffice med REST- och SOAP-åtkomst',
  'Betalingsmåter satt opp i 24SevenOffice per gateway': 'Betalsätt uppsatta i 24SevenOffice per gateway',
  'Lager. Shopify er fasit': 'Lager. Shopify är facit',
  'Produktsynk fra 24SevenOffice. Produkter opprettes ved første salg': 'Produktsynk från 24SevenOffice. Produkter skapas vid första försäljningen',
  'Hvorfor både REST og SOAP?': 'Varför både REST och SOAP?',
  'Betalingsregistrering finnes bare i SOAP-tjenesten til 24SevenOffice. Faktura og kunde går via REST. Vi håndterer sesjonen mellom dem.': 'Betalningsregistrering finns bara i 24SevenOffices SOAP-tjänst. Faktura och kund går via REST. Vi hanterar sessionen mellan dem.',
  'Er det Finago eller 24SevenOffice?': 'Är det Finago eller 24SevenOffice?',
  'Samme produkt. Finago var navnet i enkelte markeder. Integrasjonen er den samme.': 'Samma produkt. Finago var namnet på vissa marknader. Integrationen är densamma.',
  'Hva med gavekort og delbetaling?': 'Hur blir det med presentkort och delbetalning?',
  'Betalingen registreres per betalingsmåte. Gavekortdelen føres ikke mot bank. Vi avklarer oppsettet med regnskapsfører.': 'Betalningen registreras per betalsätt. Presentkortsdelen bokförs inte mot bank. Vi reder ut uppsättningen med redovisningskonsulten.',
  'Eier vi scenarioet?': 'Äger vi scenariot?',
  'Ja, det ligger i din Make-konto med dine tilganger.': 'Ja, det ligger i ditt Make-konto med dina behörigheter.',

  // Bring
  'Bring-integrasjon for Shopify': 'Bring-integration för Shopify',
  'Fraktvalg i kassen, etiketter og sporing tilbake på ordren. Standard i hver migrering.': 'Fraktval i kassan, etiketter och spårning tillbaka på ordern. Standard i varje migrering.',
  'Bring-integrasjonen gir riktige fraktvalg og hentesteder i Shopify-kassen, etiketter fra ordren og sporing tilbake til kunden. Vi setter opp Bring sin offisielle app med avtalenummer og fraktregler, og tester kassen på mobil før go-live. Det er en fast del av hver Shopify-migrering vi gjør.':
    'Bring-integrationen ger rätt fraktval och utlämningsställen i Shopify-kassan, etiketter från ordern och spårning tillbaka till kunden. Vi sätter upp Brings officiella app med avtalsnummer och fraktregler, och testar kassan på mobil före go-live. Det är en fast del av varje Shopify-migrering vi gör.',
  'Bring er Posten sin bedriftsdel. Appen kobler avtalen din til Shopify og håndterer pakke i postkassen, hentested og hjemlevering.': 'Bring är företagsdelen av norska Posten. Appen kopplar ditt avtal till Shopify och hanterar paket i brevlådan, utlämningsställe och hemleverans.',
  'Fraktvalg er det første kunden ser i kassen. Feil priser eller manglende hentested koster konvertering.': 'Fraktval är det första kunden ser i kassan. Fel priser eller ett saknat utlämningsställe kostar konvertering.',
  'Bring-avtale med API-nøkkel': 'Bring-avtal med API-nyckel',
  'Shopify med Carrier Service, Plus eller tillegg': 'Shopify med Carrier Service, Plus eller tillägget',
  'Fraktregler per sone': 'Fraktregler per zon',

  // Business Central
  'Business Central-integrasjon for Shopify': 'Business Central-integration för Shopify',
  'Microsoft sin Shopify-konnektor satt opp riktig: varer og lager fra ERP, ordre og kunder tilbake.': 'Microsofts Shopify-koppling rätt uppsatt: artiklar och lager från ERP, order och kunder tillbaka.',
  'Business Central-integrasjonen kobler Microsoft Dynamics 365 Business Central til Shopify med Microsoft sin egen Shopify-konnektor. Varer, priser og lager kommer fra ERP, ordre og kunder går tilbake, og faktura opprettes i Business Central. Vi gjør kartlegging av varegrupper, lokasjoner og betalingsmåter, setter opp konnektoren og tester hele flyten før go-live.':
    'Business Central-integrationen kopplar Microsoft Dynamics 365 Business Central till Shopify med Microsofts egen Shopify-koppling. Artiklar, priser och lager kommer från ERP, order och kunder går tillbaka, och faktura skapas i Business Central. Vi kartlägger artikelgrupper, lagerställen och betalsätt, sätter upp kopplingen och testar hela flödet före go-live.',
  'Business Central er Microsoft sitt ERP for mellomstore selskaper. Shopify-konnektoren er innebygd i Business Central, men krever at varer, lokasjoner, kunder og betalingsmåter er satt opp slik Shopify forventer dem.': 'Business Central är Microsofts ERP för medelstora företag. Shopify-kopplingen är inbyggd i Business Central, men kräver att artiklar, lagerställen, kunder och betalsätt är uppsatta så som Shopify förväntar sig dem.',
  'Selskaper på Business Central har ERP som fasit. Nettbutikken må følge ERP, ellers selger den varer som ikke finnes.': 'Företag på Business Central har ERP som facit. Webbutiken måste följa ERP, annars säljer den artiklar som inte finns.',
  'Business Central med Shopify-konnektor aktivert': 'Business Central med Shopify-kopplingen aktiverad',
  'Varegrupper, lokasjoner og betalingsmåter avklart med regnskap': 'Artikelgrupper, lagerställen och betalsätt fastställda med ekonomi',

  // DataFeedWatch
  'DataFeedWatch for Shopify': 'DataFeedWatch för Shopify',
  'Produktfeed fra Shopify til Google Shopping, Meta og prissammenligning, med regler per kanal.': 'Produktfeed från Shopify till Google Shopping, Meta och prisjämförelse, med regler per kanal.',
  'DataFeedWatch-integrasjonen tar produktene fra Shopify og lager optimaliserte feeder til Google Merchant Center, Meta og prissammenligningstjenester, med regler for titler, kategorier og ekskluderinger per kanal. Vi setter opp feedene og regelsettet, og følger feilmeldingene fra Merchant Center.':
    'DataFeedWatch-integrationen tar produkterna från Shopify och bygger optimerade feeder till Google Merchant Center, Meta och prisjämförelsetjänster, med regler för titlar, kategorier och exkluderingar per kanal. Vi sätter upp feederna och regelverket, och följer upp felmeddelandena från Merchant Center så att produkterna förblir godkända.',
  'DataFeedWatch er et feed-verktøy. Shopify er kilden, kanalene får hver sin tilpassede feed.': 'DataFeedWatch är ett feedverktyg. Shopify är källan, och varje kanal får sin egen anpassade feed.',
  'Google avviser produkter med dårlige titler og manglende attributter. Et feed-verktøy fikser det uten å endre butikken.': 'Google avvisar produkter med dåliga titlar och saknade attribut. Ett feedverktyg löser det utan att ändra butiken.',
  'DataFeedWatch-konto': 'DataFeedWatch-konto',
  'Merchant Center og Meta Commerce': 'Merchant Center och Meta Commerce',

  // Dintero. Vipps is a Norwegian payment method; the Swedish copy says so
  // instead of implying it is available for Swedish customers.
  'Dintero for Shopify': 'Dintero för Shopify',
  'Norsk betalingsløsning med Vipps, kort og faktura i én avtale.': 'Norsk betallösning med kort, faktura och Vipps i ett avtal.',
  'Dintero-integrasjonen gir Vipps, kort og faktura i Shopify-kassen gjennom én avtale og én utbetaling, i stedet for tre leverandører og tre oppgjør. Vi setter opp Dintero sin Shopify-app, tester hver betalingsmetode på mobil og i kassen, og kobler oppgjøret til riktig betalingsmåte i regnskapet slik at bank og bokføring stemmer uten manuell avstemming.':
    'Dintero-integrationen ger kort, faktura och Vipps för norska kunder i Shopify-kassan genom ett avtal och en utbetalning, i stället för tre leverantörer och tre avräkningar. Vi sätter upp Dinteros Shopify-app, testar varje betalsätt på mobil och i kassan, och kopplar avräkningen till rätt betalsätt i ekonomisystemet så att bank och bokföring stämmer utan manuell avstämning.',
  'Dintero er en norsk betalingsleverandør som samler flere betalingsmetoder bak én avtale.': 'Dintero är en norsk betalleverantör som samlar flera betalsätt bakom ett avtal.',
  'Én avtale og ett oppgjør er enklere å avstemme enn tre.': 'Ett avtal och en avräkning är enklare att stämma av än tre.',
  'Dintero-avtale': 'Dintero-avtal',

  // Emfas
  'Emfas PIM for Shopify': 'Emfas PIM för Shopify',
  'Produktdata fra Emfas til Shopify, med attributter som metafelt og bilder fra DAM.': 'Produktdata från Emfas till Shopify, med attribut som metafält och bilder från DAM.',
  'Emfas-integrasjonen publiserer produkter, varianter, attributter og bilder fra Emfas til Shopify, med attributter som metafelt og bilder fra Emfas sin DAM. Vi kartlegger datamodellen, setter opp mapping og kanaler, og tester publisering før produktdata flyttes over.':
    'Emfas-integrationen publicerar produkter, varianter, attribut och bilder från Emfas till Shopify, med attribut som metafält och bilder från Emfas DAM. Vi kartlägger datamodellen, sätter upp mappning och kanaler, och testar publicering på ett mindre urval produkter innan hela katalogen flyttas över.',
  'Emfas er et norsk PIM- og DAM-system. Shopify-koblingen setter Emfas som fasit for produktinformasjon.': 'Emfas är ett norskt PIM- och DAM-system. Shopify-kopplingen gör Emfas till facit för produktinformation.',
  'Når produktdata lever i Emfas, må nettbutikken følge med uten manuell kopiering.': 'När produktdata lever i Emfas måste webbutiken hänga med utan manuell kopiering.',
  'Emfas med Shopify-kanal': 'Emfas med Shopify-kanal',

  // Feed
  'Feed PIM for Shopify': 'Feed PIM för Shopify',
  'Produktdata eid i Feed og publisert til Shopify med varianter, bilder og attributter.': 'Produktdata som ägs i Feed och publiceras till Shopify med varianter, bilder och attribut.',
  'Feed-integrasjonen gjør Feed til fasit for produktdata og publiserer produkter, varianter, bilder og attributter til Shopify. Vi setter opp mapping av attributter til Shopify-metafelt, kanaler per marked og regler for hva som skal publiseres, slik at produktdata vedlikeholdes ett sted.':
    'Feed-integrationen gör Feed till facit för produktdata och publicerar produkter, varianter, bilder och attribut till Shopify. Vi sätter upp mappning av attribut till Shopify-metafält, kanaler per marknad och regler för vad som ska publiceras, så att produktdata underhålls på ett ställe och varje butik visar samma innehåll.',
  'Feed er et norsk PIM-system. Shopify-koblingen er Feed sin egen, og jobben ligger i datamodell og mapping.': 'Feed är ett norskt PIM-system. Shopify-kopplingen är Feeds egen, och jobbet ligger i datamodell och mappning.',
  'Med mange varianter og flere kanaler blir produktdata i Shopify alene uhåndterlig. PIM gir én fasit.': 'Med många varianter och flera kanaler blir produktdata i enbart Shopify ohanterligt. Ett PIM ger ett facit.',
  'Feed med Shopify-kanal': 'Feed med Shopify-kanal',

  // Fiken
  'Fiken-integrasjon for Shopify': 'Fiken-integration för Shopify',
  'Shopify-salg til Fiken for små selskaper. Under utprøving med første kunde.': 'Shopify-försäljning till Fiken för små företag. Under utprovning med första kunden.',
  'Fiken-integrasjonen sender betalte Shopify-ordre til Fiken som salg med kunde og linjer, for små selskaper som fører regnskapet selv. Den er under utprøving med første kunde og bygges som Make.com-scenario etter samme mønster som Tripletex, med kundeoppslag og produktoppslag før hver ordre.':
    'Fiken-integrationen skickar betalda Shopify-order till Fiken som försäljning med kund och rader, för små företag som sköter bokföringen själva. Den är under utprovning med första kunden och byggs som Make.com-scenario efter samma mönster som Tripletex, med kunduppslag och produktuppslag innan varje order bokförs.',
  'Fiken er et norsk regnskapsprogram for små bedrifter. Integrasjonen oppretter salg i Fiken fra Shopify-ordre, og vi prøver den ut med en butikk som flyttet fra PrestaShop.': 'Fiken är ett norskt bokföringsprogram för små företag. Integrationen skapar försäljning i Fiken från Shopify-order, och vi provar den med en butik som flyttade från PrestaShop.',
  'Små butikker punsher ofte ordre selv. Med integrasjonen går salget rett inn, og mva-meldingen bygger på det som faktisk ble solgt.': 'Små butiker matar ofta in order för hand. Med integrationen går försäljningen rakt in, och momsdeklarationen bygger på det som faktiskt såldes.',
  'Fiken med API-tilgang': 'Fiken med API-åtkomst',
  'Kreditnota, kommer etter piloten': 'Kreditnota, kommer efter piloten',

  // Front Systems
  'Front Systems-integrasjon for Shopify': 'Front Systems-integration för Shopify',
  'Butikk-POS og nettbutikk på samme varelager. Ordre og kunder mellom Shopify Plus og Front.': 'Butikskassa och webbutik på samma lager. Order och kunder mellan Shopify Plus och Front.',
  'Front Systems-integrasjonen kobler butikk-POS i Front til nettbutikken i Shopify Plus, slik at varer, lager og kunder er de samme i butikk og på nett, og nettordre kan hentes eller returneres i butikk. Vi bygger flyten mot Front sitt API i Make.com og tester den i én butikk før resten.':
    'Front Systems-integrationen kopplar butikskassan i Front till webbutiken i Shopify Plus, så att artiklar, lager och kunder är desamma i butik och på nätet, och webborder kan hämtas eller returneras i butik. Vi bygger flödet mot Fronts API i Make.com och testar det i en butik innan resten.',
  'Front Systems er et norsk kassesystem for kjeder og mote. API-et gir tilgang til varer, lager, kunder og salg, og integrasjonen bruker det i begge retninger.': 'Front Systems är ett norskt kassasystem för kedjor och mode. API:et ger åtkomst till artiklar, lager, kunder och försäljning, och integrationen använder det i båda riktningarna.',
  'Kjeder med både butikk og nett vil ikke ha to varelagre og to kundebaser. Da må POS og nettbutikk snakke sammen.': 'Kedjor med både butik och webb vill inte ha två lager och två kundbaser. Då måste POS och webbutik prata med varandra.',
  'Front Systems med API-nøkkel': 'Front Systems med API-nyckel',

  // Google Sheets
  'Google Sheets-integrasjon for Shopify': 'Google Sheets-integration för Shopify',
  'Skjemaer og ordre inn i regneark når det er der jobben gjøres. Ordreark for plukk og samlefaktura.': 'Formulär och order in i kalkylark när det är där jobbet görs. Orderark för plock och samlingsfaktura.',
  'Google Sheets-integrasjonen sender ordre, skjemasvar eller oppsigelser fra Shopify og nettsiden inn i regneark som teamet allerede jobber i, for plukklister, samlefakturering eller oppfølging. Den kjører som Make.com-flyt og er den enkleste måten å få data ut av Shopify på.':
    'Google Sheets-integrationen skickar order, formulärsvar eller uppsägningar från Shopify och webbplatsen in i kalkylark som teamet redan arbetar i, för plocklistor, samlingsfakturering eller uppföljning. Den körs som Make.com-flöde i ditt eget konto och är det enklaste sättet att få data ut ur Shopify och fram till de som behöver den.',
  'Google Sheets er regnearket alle har. Som integrasjon er det et arbeidsbord, ikke et system, og det er ofte nok.': 'Google Sheets är kalkylarket alla har. Som integration är det en arbetsbänk, inte ett system, och det räcker ofta.',
  'Noen ganger er svaret et ark. Et ordreark for plukk eller en liste over oppsigelser slår et nytt system.': 'Ibland är svaret ett ark. Ett orderark för plock eller en lista över uppsägningar slår ett nytt system.',
  'Google Workspace': 'Google Workspace',
  'Shopify eller skjema': 'Shopify eller formulär',

  // Holio
  'Holio-integrasjon for Shopify': 'Holio-integration för Shopify',
  'Ordre- og lagersystem for mindre grossister. Ordre inn, lager og forsendelser tilbake.': 'Order- och lagersystem för mindre grossister. Order in, lager och försändelser tillbaka.',
  'Holio-integrasjonen kobler Shopify til Holio sitt ordre- og lagersystem, slik at ordre går inn i Holio for plukk og pakk, og lager og sporing kommer tilbake til Shopify. Vi setter opp Holio sin Shopify-kobling og tester plukk, pakk, retur og lagerjustering før go-live.':
    'Holio-integrationen kopplar Shopify till Holios order- och lagersystem, så att order går in i Holio för plock och pack, och lagersaldo och spårning kommer tillbaka till Shopify. Vi sätter upp Holios Shopify-koppling, mappar lagerställen och fraktsätt, och testar plock, pack, retur och lagerjustering före go-live.',
  'Holio er et norsk OMS og WMS for mindre grossister og nettbutikker med eget lager. Et lettere alternativ til Omnium.': 'Holio är ett norskt OMS och WMS för mindre grossister och webbutiker med eget lager. Ett lättare alternativ till Omnium.',
  'Med eget lager og flere kanaler trenger du ett sted for plukk og lager, uten å betale for mer enn du bruker.': 'Med eget lager och flera kanaler behöver du ett ställe för plock och lager, utan att betala för mer än du använder.',
  'Holio-konto med Shopify-kobling': 'Holio-konto med Shopify-koppling',
  'Lagerlokasjoner avklart': 'Lagerställen fastställda',

  // IZY
  'IZY Rental for Shopify': 'IZY Rental för Shopify',
  'Utleie med datoperiode, tilgjengelighet og tilbehør, rett i Shopify-kassen.': 'Uthyrning med datumperiod, tillgänglighet och tillbehör, direkt i Shopify-kassan.',
  'IZY-integrasjonen gir utleiebooking i Shopify: kunden velger periode, ser tilgjengelighet, legger til tilbehør og betaler i kassen som en vanlig ordre. Vi setter opp IZY sin app, leveringsvalg etter postnummer med post, budbil eller henting, og kobler bookingen videre til fakturering i regnskapet og fraktetikett når leien skal sendes.':
    'IZY-integrationen ger uthyrningsbokning i Shopify: kunden väljer period, ser tillgänglighet, lägger till tillbehör och betalar i kassan som en vanlig order. Vi sätter upp IZYs app, leveransval efter postnummer med post, bud eller hämtning, och kopplar bokningen vidare till fakturering i ekonomisystemet och fraktetikett när hyran ska skickas.',
  'IZY Rental er en bookingapp for utleie på Shopify. Bookingen blir en ordre, resten av flyten er som for andre ordre.': 'IZY Rental är en bokningsapp för uthyrning på Shopify. Bokningen blir en order, och resten av flödet är som för andra order.',
  'Utleie krever periode og tilgjengelighet. Standard Shopify har ingen av delene.': 'Uthyrning kräver period och tillgänglighet. Standard-Shopify har inget av det.',
  'IZY-konto': 'IZY-konto',
  'Regler for levering og henting': 'Regler för leverans och hämtning',
}

// Subjects used in "Kan vi starte med X og utvide senere?" and category names.
const SUBJECT: Record<string, string> = {
  frakt: 'frakt', ERP: 'ERP', feed: 'feeden', betaling: 'betalning', produktdata: 'produktdata', salg: 'försäljning', POS: 'POS', ordreark: 'orderarket', lager: 'lager', booking: 'bokning',
}
// "Hvilke <cat>-systemer støtter dere?" → "Vilka <CAT_SYS> stöder ni?"
const CAT_SYS: Record<string, string> = {
  betaling: 'betalsystem', 'booking og annet': 'system för bokning och annat', 'erp og økonomi': 'ERP- och ekonomisystem', 'logistikk og frakt': 'logistik- och fraktsystem',
  'markedsføring og sporing': 'system för marknadsföring och spårning', 'oms, lager og edi': 'OMS-, lager- och EDI-system', 'pim og produktdata': 'PIM- och produktdatasystem', 'pos og butikk': 'POS- och butikssystem',
}
// "Hvilket system bruker dere til <cat>?" → "Vilket system använder ni för <CAT_FOR>?"
const CAT_FOR: Record<string, string> = {
  betaling: 'betalning', 'booking og annet': 'bokning och annat', 'erp og økonomi': 'ERP och ekonomi', 'logistikk og frakt': 'logistik och frakt',
  'markedsføring og sporing': 'marknadsföring och spårning', 'oms, lager og edi': 'OMS, lager och EDI', 'pim og produktdata': 'PIM och produktdata', 'pos og butikk': 'POS och butik',
}
const ANCHOR: Record<string, string> = { eierskap: 'agande', feil: 'fel', fasit: 'facit', andre: 'andra-system' }

const PATTERNS: [RegExp, (m: RegExpMatchArray) => string | undefined][] = [
  [/^Kjører dere (.+) i dag\?$/, (m) => `Kör ni ${m[1]} i dag?`],
  [/^Eier vi integrasjonen mot (.+) selv\?$/, (m) => `Äger vi integrationen mot ${m[1]} själva?`],
  [/^Kan vi starte med (.+) og utvide senere\?$/, (m) => SUBJECT[m[1]] && `Kan vi börja med ${SUBJECT[m[1]]} och utöka senare?`],
  [/^Hva som skal flyte mellom Shopify og (.+), hvem som er fasit for hva, og hva som skjer ved feil\. Én arbeidsøkt\.$/, (m) => `Vad som ska flöda mellan Shopify och ${m[1]}, vilket system som är facit för vad, och vad som händer vid fel. Ett arbetspass.`],
  [/^Hvilke (.+)-systemer støtter dere\?$/, (m) => CAT_SYS[m[1]] && `Vilka ${CAT_SYS[m[1]]} stöder ni?`],
  [/^Hvilket system bruker dere til (.+)\?$/, (m) => CAT_FOR[m[1]] && `Vilket system använder ni för ${CAT_FOR[m[1]]}?`],
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
const unmappedRefs: string[] = []
const svId = (id: string) => {
  if (id.endsWith('-no')) return id.replace(/-no$/, '-sv')
  if (PAGE_ID_MAP[id]) return PAGE_ID_MAP[id]
  unmappedRefs.push(id)
  return undefined
}
const weak = (r: Doc) => { const ref = svId(r._ref); return ref ? { ...r, _type: 'reference', _ref: ref, _weak: true } : undefined }
const weakAll = (rs: Doc[]) => rs.map(weak).filter((r): r is Doc => Boolean(r))
const words = (s: string) => s.trim().split(/\s+/).length

function buildSv(no: Doc): Doc {
  const { _rev, _createdAt, _updatedAt, ...rest } = no
  const sv: Doc = { ...rest, _id: svId(no._id), language: 'sv' }
  sv.slug = { _type: 'slug', current: String(no.slug.current).replace(/^integrasjoner/, 'integrations') }
  for (const f of ['pageTitle', 'title', 'definition', 'shortDescription']) if (typeof no[f] === 'string') sv[f] = tr(no[f])
  for (const f of ['intro', 'whatItIs', 'whyItMatters']) if (Array.isArray(no[f])) sv[f] = pt(no[f])
  if (Array.isArray(no.sections)) sv.sections = no.sections.map((s: Doc) => ({ ...s, heading: tr(s.heading), anchor: s.anchor ? ANCHOR[s.anchor] ?? tr(s.anchor) : s.anchor, body: pt(s.body) }))
  if (Array.isArray(no.implementationSteps)) sv.implementationSteps = no.implementationSteps.map((s: Doc) => ({ ...s, name: tr(s.name), text: tr(s.text) }))
  for (const f of ['prerequisites', 'notIncluded', 'namedClients']) if (Array.isArray(no[f])) sv[f] = no[f].map((x: string) => (f === 'namedClients' ? sysName(x) : tr(x)))
  if (Array.isArray(no.faq)) sv.faq = no.faq.map((q: Doc) => ({ ...q, question: tr(q.question), answer: tr(q.answer) }))
  if (no.cta) sv.cta = { ...no.cta, heading: tr(no.cta.heading), text: tr(no.cta.text), buttonLabel: tr(no.cta.buttonLabel), buttonHref: '/contact' }
  if (Array.isArray(no.dataFlowSteps)) sv.dataFlowSteps = no.dataFlowSteps.map((s: Doc) => ({ ...s, payload: tr(s.payload), frequency: tr(s.frequency), from: sysName(s.from), to: sysName(s.to) }))
  if (Array.isArray(no.systems)) sv.systems = no.systems.map((s: Doc) => ({ ...s, name: sysName(s.name) }))
  if (no.seoExtended) sv.seoExtended = { ...no.seoExtended, metaTitle: tr(no.seoExtended.metaTitle), metaDescription: tr(no.seoExtended.metaDescription) }
  if (no.category?._ref) sv.category = weak(no.category)
  if (no.pillar?._ref) sv.pillar = weak(no.pillar)
  if (Array.isArray(no.clusterLinks)) sv.clusterLinks = weakAll(no.clusterLinks)
  if (Array.isArray(no.relatedPages)) sv.relatedPages = weakAll(no.relatedPages)
  return sv
}

async function main() {
  // Resolve the Swedish counterparts of the non-template pages the Norwegian docs link to.
  for (const [noId, type] of Object.entries(PAGE_TYPE)) {
    const id = await client.fetch<string | null>('*[_type == $type && language == "sv"][0]._id', { type })
    if (id) PAGE_ID_MAP[noId] = id
    else console.warn(dataset, 'no Swedish', type, '- link skipped')
  }

  const sources = await client.fetch<Doc[]>('*[_id in $ids]', { ids: SOURCE_IDS })
  const found = new Set(sources.map((d) => d._id))
  const absent = SOURCE_IDS.filter((id) => !found.has(id))
  if (absent.length) throw new Error(`missing Norwegian sources in ${dataset}: ${absent.join(', ')}`)

  const docs = sources.map(buildSv)
  if (missing.length) throw new Error(`untranslated strings:\n${[...new Set(missing)].map((s) => `  - ${s}`).join('\n')}`)
  if (unmappedRefs.length) console.warn(dataset, 'skipped references without a Swedish target:', [...new Set(unmappedRefs)].join(', '))
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
    const entry = { _key: 'sv', value: { _type: 'reference', _ref: svId(no._id), _weak: true, _strengthenOnPublish: { type } } }
    const meta = await client.fetch<{ keys: string[] | null } | null>('*[_id == $id][0]{ "keys": translations[]._key }', { id: metaId })
    if (!meta) {
      await client.createOrReplace({
        _id: metaId, _type: 'translation.metadata', schemaTypes: [type], translations: [
          { _key: 'no', value: { _type: 'reference', _ref: no._id, _weak: true, _strengthenOnPublish: { type } } },
          entry,
        ],
      })
      console.log(dataset, 'created', metaId, '(no + sv)')
    } else if (meta.keys?.includes('sv')) {
      console.log(dataset, 'kept', metaId, '(sv already present)')
    } else if (!meta.keys?.length) {
      await client.patch(metaId).set({ translations: [entry] }).commit()
      console.log(dataset, 'set sv on', metaId)
    } else {
      await client.patch(metaId).insert('after', 'translations[-1]', [entry]).commit()
      console.log(dataset, 'added sv to', metaId)
    }
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
