// TARGET_DATASET=production npx sanity exec scripts/sanity-integrations-en-1.ts --with-user-token
// Creates the English versions of the integrations pillar, the 8 integration
// categories and 12 integration pages (batch 1 of 3) from their Norwegian
// sources, plus translation.metadata for each. Idempotent: createOrReplace on
// fixed ids. References are weak so the three batches can run in any order.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

const CATEGORY_KEYS = ['betaling', 'booking', 'erp', 'logistikk', 'markedsforing', 'oms', 'pim', 'pos']
const INTEGRATIONS = ['24sevenoffice', 'bring', 'business-central', 'datafeedwatch', 'dintero', 'emfas', 'feed', 'fiken', 'front-systems', 'google-sheets', 'holio', 'izy']
const SOURCE_IDS = ['pillar-integrasjoner-no', ...CATEGORY_KEYS.map((k) => `integration-cat-${k}-no`), ...INTEGRATIONS.map((x) => `integration-${x}-no`)]

// Norwegian page ids (non-template documents) → their English counterparts.
const PAGE_ID_MAP: Record<string, string> = {
  '1368ee2e-b89e-44e4-ac40-36fd19f2c879': 'e9ee91de-b1b2-47a6-9ded-7672b1f6911c', // allPackagesPage
  '46bf58c8-302e-4fb2-bebe-5c6f505a97b3': 'c749a129-ccca-44ab-a01b-0247652026fe', // partnersPage
  'b6bda7fa-b329-48d0-8aed-e73335edf5ec': '755346ec-b0a7-4b77-9bb9-e0adca1031e8', // migratePage
  '893a0019-404e-4c88-ae34-ae35fc49cce8': 'e7c53aa6-0987-4f9b-bfbb-fbd8a5858771', // vippsHurtigkassePage
  'f7ff26d7-2ad7-4761-a4bd-eab870dfbda9': '534120ce-8e65-4844-8bf5-0e066e78e510', // shopifyXPimPage
  '63c2d5f4-7e53-4d86-9fea-e1069542a939': 'cf38c0f0-dac9-4c83-ad92-a4b679f20387', // shopifyPosPage
}

// ---------------------------------------------------------------------------
// Translations. Exact Norwegian string → English. Anything not found here (or
// in the patterns below) makes the script fail, so nothing Norwegian leaks.
// ---------------------------------------------------------------------------
const D: Record<string, string> = {
  // Shared
  'Book en samtale': 'Book a call',
  'Vi svarer med metode, dataflyt og tidsplan innen to virkedager.': 'We reply with method, data flow and timeline within two working days.',
  'Fortell oss hvilke systemer du har, så får du metode, dataflyt og tidsplan innen to virkedager.': 'Tell us which systems you have and you get method, data flow and timeline within two working days.',
  'Hvem eier integrasjonen etterpå?': 'Who owns the integration afterwards?',
  'Du. Make.com-scenarioer ligger i din konto, kode leveres med kildekode.': 'You do. Make.com scenarios live in your account, and code is delivered with source.',
  'Hva skjer når en kjøring feiler?': 'What happens when a run fails?',
  'Hver kjøring ligger i historikken. Feil varsles med referanse, og vi rydder opp sammen.': 'Every run sits in the history. Errors are flagged with a reference, and we clean up together.',
  'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen.': 'Every run sits in the history with input and output. Errors are flagged with a reference, and we clean up together.',
  'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen. Det finnes ingen automatisk tilbakerulling, og det sier vi rett ut.': 'Every run sits in the history with input and output. Errors are flagged with a reference, and we clean up together. There is no automatic rollback, and we say that plainly.',
  'Make.com eller egen kode?': 'Make.com or custom code?',
  'Make.com når flyten er greiner og oppslag og du vil kunne åpne en kjøring selv. Egen kode når det er mye transformasjon, høyt volum eller behov for testmiljø.': 'Make.com when the flow is branches and lookups and you want to be able to open a run yourself. Custom code when there is a lot of transformation, high volume or a need for a test environment.',
  'De som står på denne siden kjører vi i dag. Står ikke ditt system her, kan vi som regel koble det likevel, enten via API i Make.com eller som egen kode.': 'The ones on this page are the ones we run today. If your system is not here, we can usually connect it anyway, either through its API in Make.com or as custom code.',
  'Ja. Make.com-scenarioer ligger i din konto, og kode leveres med kildekode. Vi drifter om du vil, men du er ikke låst til oss.': 'Yes. Make.com scenarios live in your account, and code is delivered with source. We run it for you if you want, but you are not locked in to us.',
  'Ja. De fleste starter med én flyt, for eksempel ordre, og legger til lager eller kunder etterpå.': 'Yes. Most start with one flow, such as orders, and add stock or customers afterwards.',
  'Hvor lang tid tar oppsettet?': 'How long does setup take?',
  'Make.com-flyter leveres på dager når kartleggingen er gjort. Egen kode tar lenger, og vi gir tidsplan etter første samtale.': 'Make.com flows are delivered in days once the mapping is done. Custom code takes longer, and we give a timeline after the first call.',
  'Kartlegging': 'Mapping',
  'Oppsett': 'Setup',
  'Tilkobling i din egen konto, mapping av felt, og testdata gjennom hele flyten.': 'Connection in your own account, field mapping, and test data through the whole flow.',
  'Test på reelle data': 'Test on real data',
  'De første ordrene eller produktene følges manuelt før vi slår på alt.': 'The first orders or products are followed manually before we switch everything on.',
  'Go-live og overvåking': 'Go-live and monitoring',
  'Vi følger de første ukene. Feil varsles med referanse til ordren.': 'We follow the first weeks. Errors are flagged with a reference to the order.',
  'Shopify': 'Shopify',
  'Shopify eller Shopify Plus': 'Shopify or Shopify Plus',
  'Shopify Plus': 'Shopify Plus',
  'Make.com-konto': 'Make.com account',
  'Make.com-konto i ditt navn': 'Make.com account in your name',
  'Lager': 'Stock',
  'Attributtmodell avklart': 'Attribute model agreed',
  // data-flow frequencies and payloads
  'sanntid': 'real time',
  'løpende': 'continuous',
  'daglig': 'daily',
  'ved pakking': 'at packing',
  'ved publisering': 'on publish',
  'ordre + kunde → faktura': 'order + customer → invoice',
  'betaling registrert': 'payment registered',
  'refusjon → kreditnota': 'refund → credit note',
  'fraktvalg i kassen': 'delivery options at checkout',
  'etikett': 'label',
  'sporing': 'tracking',
  'varer + priser + lager': 'items + prices + stock',
  'ordre + kunder': 'orders + customers',
  'fakturastatus': 'invoice status',
  'produkter': 'products',
  'feed per kanal': 'feed per channel',
  'betalt ordre': 'paid order',
  'produkter + attributter + bilder': 'products + attributes + images',
  'produkter + varianter + bilder': 'products + variants + images',
  'ordre + kunde → salg': 'order + customer → sale',
  'varer + lager': 'items + stock',
  'ordre → ordreark': 'order → order sheet',
  'ordre': 'orders',
  'lager + sporing': 'stock + tracking',
  'booking → ordre': 'booking → order',
  'kansellering': 'cancellation',
  // system names that are phrases, not product names
  'Google og Meta': 'Google and Meta',
  'De fleste butikkene vi har migrert': 'Most of the stores we have migrated',

  // Pillar
  'Shopify koblet til systemene du allerede bruker': 'Shopify connected to the systems you already use',
  'En Shopify-integrasjon kobler nettbutikken til systemene som driver resten av selskapet: regnskap, ordrehåndtering, lager, frakt, betaling og markedsføring. Vi bygger dem i Make.com når flyten skal være synlig og enkel å endre, og som egen kode når volum eller logikk krever det. Dokumentert dataflyt, og du eier scenarioet i din egen konto.':
    'A Shopify integration connects the store to the systems that run the rest of the company: accounting, order management, warehouse, shipping, payments and marketing. We build them in Make.com when the flow should be visible and easy to change, and in code when volume or logic requires it. Documented data flow, and the scenario lives in your own account.',
  'Hvem eier integrasjonen': 'Who owns the integration',
  'Make.com-scenarioer settes opp i din egen Make-konto med dine tilkoblinger. Kode leveres med kildekode i ditt repo. Vi drifter om du vil, men du er aldri låst til oss.': 'Make.com scenarios are set up in your own Make account with your connections. Code is delivered with source in your repo. We run it for you if you want, but you are never locked in to us.',
  'Hva skjer når noe feiler': 'What happens when something fails',
  'Hver kjøring ligger i historikken med inn- og utdata per modul. Feil varsles med referanse til ordren. Det finnes ingen automatisk tilbakerulling, og vi rydder opp sammen når det trengs.': 'Every run sits in the history with input and output per module. Errors are flagged with a reference to the order. There is no automatic rollback, and we clean up together when it is needed.',
  'Shopify eller systemet som fasit': 'Shopify or the system as the source of truth',
  'For regnskap er Shopify fasit og regnskapet mottaker. For OMS og enkelte ERP, som Omnium, UniMicro og TRIMIT, er systemet fasit for lager og Shopify viser det. Vi avklarer dette først, fordi det styrer alt annet.': 'For accounting, Shopify is the source of truth and the accounting system is the receiver. For OMS and some ERPs, such as Omnium, UniMicro and TRIMIT, the system is the source of truth for stock and Shopify displays it. We settle this first, because it drives everything else.',
  'Systemet ditt står ikke på listen': 'Your system is not on the list',
  'Har systemet et API, kan vi som regel koble det. Send oss hva du har, så svarer vi med metode og tidsplan.': 'If the system has an API, we can usually connect it. Send us what you have and we reply with method and timeline.',
  'Make.com eller egen kode, hvordan velger dere?': 'Make.com or custom code, how do you choose?',
  'Make.com når flyten er greiner og oppslag, og når du vil kunne åpne en kjøring selv. Egen kode når det er mye transformasjon, høyt volum, eller behov for versjonskontroll og testmiljø. De fleste regnskaps- og OMS-integrasjoner er Make.com.': 'Make.com when the flow is branches and lookups, and when you want to be able to open a run yourself. Custom code when there is a lot of transformation, high volume, or a need for version control and a test environment. Most accounting and OMS integrations are Make.com.',
  'Systemet mitt står ikke på listen. Kan dere likevel?': 'My system is not on the list. Can you still do it?',
  'Som regel ja, hvis systemet har et API. Send oss hva du har.': 'Usually yes, if the system has an API. Send us what you have.',
  'Fortell oss hvilke systemer du har': 'Tell us which systems you have',

  // Categories
  'Betaling': 'Payments',
  'Betalingsintegrasjoner dekker kassen og oppgjøret. Vipps Hurtigkasse, Klarna, Dintero og Shopify Payments settes opp og testes, og utbetalingene føres mot riktig betalingsmåte i regnskapet slik at bank og bokføring stemmer uten manuell avstemming.':
    'Payment integrations cover checkout and settlement. Vipps Hurtigkasse, Klarna, Dintero and Shopify Payments are set up and tested on mobile and at checkout, and payouts are posted against the right payment method in the accounts so bank and bookkeeping reconcile without manual matching.',
  'Booking og annet': 'Booking and other',
  'Når salget starter et annet sted enn i kassen. Bookinger fra Podio og IZY blir Shopify-ordre, brukere opprettes i Moodle når et kurs er kjøpt, og skjemaer havner i Google Sheets. Make.com-flyter som er lette å lese og endre.':
    'For when the sale starts somewhere other than checkout. Bookings from Podio and IZY become Shopify orders, users are created in Moodle when a course is bought, and form submissions land in Google Sheets. Make.com flows that are easy to read and change.',
  'ERP og økonomi': 'ERP and finance',
  'En regnskapsintegrasjon flytter betalte ordre fra Shopify til regnskapssystemet som faktura, salgsbilag eller bilagsjournal, med kunde, mva og frakt på riktig konto. Refusjoner blir kreditnota. Vi kjører dette i dag mot Tripletex, 24SevenOffice, PowerOffice Go og Fiken, som Make.com-scenarioer i din egen konto. Fakturaer sendes ikke før regnskapsfører har sett dem.':
    'An accounting integration moves paid orders from Shopify to the accounting system as an invoice, sales voucher or journal, with customer, VAT and shipping on the right account. Refunds become credit notes. We run this against Tripletex, 24SevenOffice, PowerOffice Go and Fiken, as Make.com scenarios in your own account. Invoices are not sent before your accountant has seen them.',
  'Logistikk og frakt': 'Logistics and shipping',
  'Fraktintegrasjoner gir riktige fraktvalg i kassen, etiketter fra ordren og sporing tilbake til kunden. Vi jobber med Bring, Profrakt, nShift, Logistra og Quickship, som offisielle apper eller Make.com-flyter når etiketten skal utløses fra et annet system enn Shopify.':
    'Shipping integrations give the right delivery options at checkout, labels from the order and tracking back to the customer. We work with Bring, Profrakt, nShift, Logistra and Quickship, as official apps or as Make.com flows when the label has to be triggered from a system other than Shopify.',
  'Markedsføring og sporing': 'Marketing and tracking',
  'Kundedata og hendelser fra Shopify til verktøyene som driver salget: Klaviyo og MarketingPlatform for e-post og SMS, Tracklution for server-side sporing til Meta, Google og affiliate, og Judge.me eller Lipscore for anmeldelser.':
    'Customer data and events from Shopify to the tools that drive sales: Klaviyo and MarketingPlatform for email and SMS, Tracklution for server-side tracking to Meta, Google and affiliate networks, and Judge.me or Lipscore for reviews. Set up so every channel sees the same orders and customers.',
  'OMS, lager og EDI': 'OMS, warehouse and EDI',
  'Et ordrehåndteringssystem samler ordre fra nettbutikk, butikk og EDI på ett sted, og styrer lager og plukk. Vi kobler Shopify til Omnium, Holio og Ongoing, slik at ordre går inn og lager kommer tilbake, og EDI-ordre fra kjedene flyter videre til regnskap uten manuell punching.':
    'An order management system gathers orders from the online store, physical stores and EDI in one place, and runs stock and picking. We connect Shopify to Omnium, Holio and Ongoing, so orders go in and stock comes back, and EDI orders from retail chains flow on to accounting without manual keying.',
  'PIM og produktdata': 'PIM and product data',
  'Produktdata som eies i PIM eller leverandørfeed og publiseres til Shopify med varianter, bilder og attributter. Vi setter opp Vuuh, DatafeedWatch og Google Merchant Center slik at produktdata har én fasit og nettbutikk, markedsplasser og annonser får samme innhold.':
    'Product data owned in a PIM or supplier feed and published to Shopify with variants, images and attributes. We set up Vuuh, DataFeedWatch and Google Merchant Center so product data has one source of truth and the online store, marketplaces and ads get the same content.',
  'POS og butikk': 'POS and retail',
  'Butikk og nettbutikk på samme varelager og kundebase. Vi setter opp Shopify POS, kobler Front Systems til Shopify Plus, og flytter kunder fra PCKasse med gavekort og kundedata intakt.':
    'Physical store and online store on the same stock and customer base. We set up Shopify POS, connect Front Systems to Shopify Plus, and move customers from PCKasse with gift cards and customer data intact, so the till and the website sell from one inventory.',

  // 24SevenOffice
  '24SevenOffice og Finago-integrasjon for Shopify': '24SevenOffice and Finago integration for Shopify',
  'Finago og 24SevenOffice er samme system. Faktura per ordre med betaling registrert, refusjoner som kreditnota.': 'Finago and 24SevenOffice are the same system. One invoice per order with the payment registered, refunds as credit notes.',
  '24SevenOffice-integrasjonen oppretter en faktura i 24SevenOffice for hver betalte Shopify-ordre, med kunde, linjer, frakt og riktig salgstype, og registrerer betalingen mot betalingsmåten ordren ble betalt med. Refusjoner i Shopify blir kreditnota. Flyten går én vei fra Shopify og kjører som Make.com-scenario i din egen konto, med REST for faktura og SOAP for betalingsregistrering.':
    'The 24SevenOffice integration creates an invoice in 24SevenOffice for every paid Shopify order, with customer, lines, shipping and sales type, and registers the payment against the method the order was paid with. Refunds in Shopify become credit notes. The flow runs one way from Shopify as a Make.com scenario in your account, with REST for invoices and SOAP for payments.',
  '24SevenOffice, tidligere Finago, er et norsk regnskapssystem med både moderne REST-API og eldre SOAP-tjenester. Integrasjonen bruker begge: faktura og kunde opprettes via REST, betalingen registreres via SOAP fordi det bare finnes der. Salgstype og dimensjoner settes per ordre, slik at B2C og utland havner på riktig konto.':
    '24SevenOffice, formerly Finago, is a Norwegian accounting system with both a modern REST API and older SOAP services. The integration uses both: invoice and customer are created via REST, the payment is registered via SOAP because that is the only place it exists. Sales type and dimensions are set per order, so B2C and export land on the right account.',
  'Uten betalingsregistrering må regnskapsfører avstemme hver Shopify-faktura manuelt mot utbetalingene. Med integrasjonen er fakturaen både opprettet og betalt i regnskapet når ordren er betalt i Shopify, og kreditnotaen kommer av seg selv ved refusjon.':
    'Without payment registration, the accountant has to reconcile every Shopify invoice manually against the payouts. With the integration, the invoice is both created and paid in the accounts the moment the order is paid in Shopify, and the credit note appears by itself on refund.',
  'Salgstyper, betalingsmåter per gateway, dimensjoner for avdeling og land, og mva på frakt.': 'Sales types, payment methods per gateway, dimensions for department and country, and VAT on shipping.',
  'Oppsett i Make.com': 'Setup in Make.com',
  'REST- og SOAP-tilganger fra 24SevenOffice, scenario for ordre og for refusjoner i din konto.': 'REST and SOAP access from 24SevenOffice, one scenario for orders and one for refunds in your account.',
  'Test på reelle ordre': 'Test on real orders',
  'Første ordre, første refusjon og en ordre med flere betalingsmåter følges manuelt.': 'The first order, the first refund and an order with several payment methods are followed manually.',
  'Nattlig sveip fanger refusjoner som webhook-kallet ikke rakk.': 'A nightly sweep catches refunds the webhook call missed.',
  '24SevenOffice med REST- og SOAP-tilgang': '24SevenOffice with REST and SOAP access',
  'Betalingsmåter satt opp i 24SevenOffice per gateway': 'Payment methods set up in 24SevenOffice per gateway',
  'Lager. Shopify er fasit': 'Stock. Shopify is the source of truth',
  'Produktsynk fra 24SevenOffice. Produkter opprettes ved første salg': 'Product sync from 24SevenOffice. Products are created on first sale',
  'Hvorfor både REST og SOAP?': 'Why both REST and SOAP?',
  'Betalingsregistrering finnes bare i SOAP-tjenesten til 24SevenOffice. Faktura og kunde går via REST. Vi håndterer sesjonen mellom dem.': "Payment registration only exists in 24SevenOffice's SOAP service. Invoice and customer go via REST. We handle the session between them.",
  'Er det Finago eller 24SevenOffice?': 'Is it Finago or 24SevenOffice?',
  'Samme produkt. Finago var navnet i enkelte markeder. Integrasjonen er den samme.': 'Same product. Finago was the name in some markets. The integration is the same.',
  'Hva med gavekort og delbetaling?': 'What about gift cards and split payments?',
  'Betalingen registreres per betalingsmåte. Gavekortdelen føres ikke mot bank. Vi avklarer oppsettet med regnskapsfører.': 'The payment is registered per payment method. The gift card part is not posted against the bank. We agree the setup with your accountant.',
  'Eier vi scenarioet?': 'Do we own the scenario?',
  'Ja, det ligger i din Make-konto med dine tilganger.': 'Yes, it lives in your Make account with your access.',

  // Bring
  'Bring-integrasjon for Shopify': 'Bring integration for Shopify',
  'Fraktvalg i kassen, etiketter og sporing tilbake på ordren. Standard i hver migrering.': 'Delivery options at checkout, labels and tracking back on the order. Standard in every migration.',
  'Bring-integrasjonen gir riktige fraktvalg og hentesteder i Shopify-kassen, etiketter fra ordren og sporing tilbake til kunden. Vi setter opp Bring sin offisielle app med avtalenummer og fraktregler, og tester kassen på mobil før go-live. Det er en fast del av hver Shopify-migrering vi gjør.':
    "The Bring integration gives the right delivery options and pickup points in the Shopify checkout, labels from the order and tracking back to the customer. We set up Bring's official app with your agreement number and shipping rules, and test the checkout on mobile before go-live. It is a fixed part of every Shopify migration we do.",
  'Bring er Posten sin bedriftsdel. Appen kobler avtalen din til Shopify og håndterer pakke i postkassen, hentested og hjemlevering.': 'Bring is the business arm of Posten, the Norwegian postal service. The app connects your agreement to Shopify and handles mailbox parcels, pickup points and home delivery.',
  'Fraktvalg er det første kunden ser i kassen. Feil priser eller manglende hentested koster konvertering.': 'Delivery options are the first thing the customer sees at checkout. Wrong prices or a missing pickup point cost conversion.',
  'Bring-avtale med API-nøkkel': 'Bring agreement with API key',
  'Shopify med Carrier Service, Plus eller tillegg': 'Shopify with Carrier Service, Plus or the add-on',
  'Fraktregler per sone': 'Shipping rules per zone',

  // Business Central
  'Business Central-integrasjon for Shopify': 'Business Central integration for Shopify',
  'Microsoft sin Shopify-konnektor satt opp riktig: varer og lager fra ERP, ordre og kunder tilbake.': "Microsoft's Shopify connector set up right: items and stock from the ERP, orders and customers back.",
  'Business Central-integrasjonen kobler Microsoft Dynamics 365 Business Central til Shopify med Microsoft sin egen Shopify-konnektor. Varer, priser og lager kommer fra ERP, ordre og kunder går tilbake, og faktura opprettes i Business Central. Vi gjør kartlegging av varegrupper, lokasjoner og betalingsmåter, setter opp konnektoren og tester hele flyten før go-live.':
    "The Business Central integration connects Microsoft Dynamics 365 Business Central to Shopify with Microsoft's own Shopify connector. Items, prices and stock come from the ERP, orders and customers go back, and invoices are created in Business Central. We map item groups, locations and payment methods, set up the connector and test the whole flow before go-live.",
  'Business Central er Microsoft sitt ERP for mellomstore selskaper. Shopify-konnektoren er innebygd i Business Central, men krever at varer, lokasjoner, kunder og betalingsmåter er satt opp slik Shopify forventer dem.': "Business Central is Microsoft's ERP for mid-sized companies. The Shopify connector is built into Business Central, but requires items, locations, customers and payment methods to be set up the way Shopify expects them.",
  'Selskaper på Business Central har ERP som fasit. Nettbutikken må følge ERP, ellers selger den varer som ikke finnes.': 'Companies on Business Central have the ERP as the source of truth. The online store has to follow the ERP, or it sells items that do not exist.',
  'Business Central med Shopify-konnektor aktivert': 'Business Central with the Shopify connector enabled',
  'Varegrupper, lokasjoner og betalingsmåter avklart med regnskap': 'Item groups, locations and payment methods agreed with finance',

  // DataFeedWatch
  'DataFeedWatch for Shopify': 'DataFeedWatch for Shopify',
  'Produktfeed fra Shopify til Google Shopping, Meta og prissammenligning, med regler per kanal.': 'Product feed from Shopify to Google Shopping, Meta and price comparison, with rules per channel.',
  'DataFeedWatch-integrasjonen tar produktene fra Shopify og lager optimaliserte feeder til Google Merchant Center, Meta og prissammenligningstjenester, med regler for titler, kategorier og ekskluderinger per kanal. Vi setter opp feedene og regelsettet, og følger feilmeldingene fra Merchant Center.':
    'The DataFeedWatch integration takes the products from Shopify and builds optimised feeds for Google Merchant Center, Meta and price comparison services, with rules for titles, categories and exclusions per channel. We set up the feeds and the rule set, and follow up the error reports from Merchant Center so products stay approved.',
  'DataFeedWatch er et feed-verktøy. Shopify er kilden, kanalene får hver sin tilpassede feed.': 'DataFeedWatch is a feed tool. Shopify is the source, and each channel gets its own tailored feed.',
  'Google avviser produkter med dårlige titler og manglende attributter. Et feed-verktøy fikser det uten å endre butikken.': 'Google rejects products with poor titles and missing attributes. A feed tool fixes that without changing the store.',
  'DataFeedWatch-konto': 'DataFeedWatch account',
  'Merchant Center og Meta Commerce': 'Merchant Center and Meta Commerce',

  // Dintero
  'Dintero for Shopify': 'Dintero for Shopify',
  'Norsk betalingsløsning med Vipps, kort og faktura i én avtale.': 'Norwegian payment provider with Vipps, cards and invoice under one agreement.',
  'Dintero-integrasjonen gir Vipps, kort og faktura i Shopify-kassen gjennom én avtale og én utbetaling, i stedet for tre leverandører og tre oppgjør. Vi setter opp Dintero sin Shopify-app, tester hver betalingsmetode på mobil og i kassen, og kobler oppgjøret til riktig betalingsmåte i regnskapet slik at bank og bokføring stemmer uten manuell avstemming.':
    "The Dintero integration gives Vipps, cards and invoice in the Shopify checkout through one agreement and one payout, instead of three providers and three settlements. We set up Dintero's Shopify app, test each payment method on mobile and at checkout, and connect the settlement to the right payment method in the accounts so bank and books reconcile automatically.",
  'Dintero er en norsk betalingsleverandør som samler flere betalingsmetoder bak én avtale.': 'Dintero is a Norwegian payment provider that gathers several payment methods behind one agreement.',
  'Én avtale og ett oppgjør er enklere å avstemme enn tre.': 'One agreement and one settlement is easier to reconcile than three.',
  'Dintero-avtale': 'Dintero agreement',

  // Emfas
  'Emfas PIM for Shopify': 'Emfas PIM for Shopify',
  'Produktdata fra Emfas til Shopify, med attributter som metafelt og bilder fra DAM.': 'Product data from Emfas to Shopify, with attributes as metafields and images from the DAM.',
  'Emfas-integrasjonen publiserer produkter, varianter, attributter og bilder fra Emfas til Shopify, med attributter som metafelt og bilder fra Emfas sin DAM. Vi kartlegger datamodellen, setter opp mapping og kanaler, og tester publisering før produktdata flyttes over.':
    "The Emfas integration publishes products, variants, attributes and images from Emfas to Shopify, with attributes as metafields and images served from Emfas's DAM. We map the data model, set up the field mapping and channels, and test publishing on a small set of products before the full catalogue is moved across.",
  'Emfas er et norsk PIM- og DAM-system. Shopify-koblingen setter Emfas som fasit for produktinformasjon.': 'Emfas is a Norwegian PIM and DAM system. The Shopify connection makes Emfas the source of truth for product information.',
  'Når produktdata lever i Emfas, må nettbutikken følge med uten manuell kopiering.': 'When product data lives in Emfas, the online store has to keep up without manual copying.',
  'Emfas med Shopify-kanal': 'Emfas with a Shopify channel',

  // Feed
  'Feed PIM for Shopify': 'Feed PIM for Shopify',
  'Produktdata eid i Feed og publisert til Shopify med varianter, bilder og attributter.': 'Product data owned in Feed and published to Shopify with variants, images and attributes.',
  'Feed-integrasjonen gjør Feed til fasit for produktdata og publiserer produkter, varianter, bilder og attributter til Shopify. Vi setter opp mapping av attributter til Shopify-metafelt, kanaler per marked og regler for hva som skal publiseres, slik at produktdata vedlikeholdes ett sted.':
    'The Feed integration makes Feed the source of truth for product data and publishes products, variants, images and attributes to Shopify. We set up the mapping of attributes to Shopify metafields, channels per market and rules for what gets published, so product data is maintained in one place and every storefront shows the same content.',
  'Feed er et norsk PIM-system. Shopify-koblingen er Feed sin egen, og jobben ligger i datamodell og mapping.': "Feed is a Norwegian PIM system. The Shopify connection is Feed's own, and the work lies in the data model and the mapping.",
  'Med mange varianter og flere kanaler blir produktdata i Shopify alene uhåndterlig. PIM gir én fasit.': 'With many variants and several channels, product data in Shopify alone becomes unmanageable. A PIM gives one source of truth.',
  'Feed med Shopify-kanal': 'Feed with a Shopify channel',

  // Fiken
  'Fiken-integrasjon for Shopify': 'Fiken integration for Shopify',
  'Shopify-salg til Fiken for små selskaper. Under utprøving med første kunde.': 'Shopify sales to Fiken for small companies. In pilot with the first customer.',
  'Fiken-integrasjonen sender betalte Shopify-ordre til Fiken som salg med kunde og linjer, for små selskaper som fører regnskapet selv. Den er under utprøving med første kunde og bygges som Make.com-scenario etter samme mønster som Tripletex, med kundeoppslag og produktoppslag før hver ordre.':
    'The Fiken integration sends paid Shopify orders to Fiken as sales with customer and lines, for small companies that do their own bookkeeping. It is in pilot with the first customer and is built as a Make.com scenario following the same pattern as Tripletex, with a customer lookup and a product lookup before every order is posted.',
  'Fiken er et norsk regnskapsprogram for små bedrifter. Integrasjonen oppretter salg i Fiken fra Shopify-ordre, og vi prøver den ut med en butikk som flyttet fra PrestaShop.': 'Fiken is a Norwegian accounting program for small businesses. The integration creates sales in Fiken from Shopify orders, and we are piloting it with a store that moved from PrestaShop.',
  'Små butikker punsher ofte ordre selv. Med integrasjonen går salget rett inn, og mva-meldingen bygger på det som faktisk ble solgt.': 'Small stores often key in orders by hand. With the integration the sale goes straight in, and the VAT return is built on what was actually sold.',
  'Fiken med API-tilgang': 'Fiken with API access',
  'Kreditnota, kommer etter piloten': 'Credit notes, coming after the pilot',

  // Front Systems
  'Front Systems-integrasjon for Shopify': 'Front Systems integration for Shopify',
  'Butikk-POS og nettbutikk på samme varelager. Ordre og kunder mellom Shopify Plus og Front.': 'Store POS and online store on the same stock. Orders and customers between Shopify Plus and Front.',
  'Front Systems-integrasjonen kobler butikk-POS i Front til nettbutikken i Shopify Plus, slik at varer, lager og kunder er de samme i butikk og på nett, og nettordre kan hentes eller returneres i butikk. Vi bygger flyten mot Front sitt API i Make.com og tester den i én butikk før resten.':
    "The Front Systems integration connects the store POS in Front to the online store in Shopify Plus, so items, stock and customers are the same in store and online, and web orders can be collected or returned in store. We build the flow against Front's API in Make.com and test it in one store before the rest.",
  'Front Systems er et norsk kassesystem for kjeder og mote. API-et gir tilgang til varer, lager, kunder og salg, og integrasjonen bruker det i begge retninger.': 'Front Systems is a Norwegian POS system for retail chains and fashion. The API gives access to items, stock, customers and sales, and the integration uses it in both directions.',
  'Kjeder med både butikk og nett vil ikke ha to varelagre og to kundebaser. Da må POS og nettbutikk snakke sammen.': 'Chains with both physical stores and online do not want two inventories and two customer bases. Then the POS and the online store have to talk to each other.',
  'Front Systems med API-nøkkel': 'Front Systems with API key',

  // Google Sheets
  'Google Sheets-integrasjon for Shopify': 'Google Sheets integration for Shopify',
  'Skjemaer og ordre inn i regneark når det er der jobben gjøres. Ordreark for plukk og samlefaktura.': 'Forms and orders into a spreadsheet when that is where the work gets done. Order sheets for picking and consolidated invoicing.',
  'Google Sheets-integrasjonen sender ordre, skjemasvar eller oppsigelser fra Shopify og nettsiden inn i regneark som teamet allerede jobber i, for plukklister, samlefakturering eller oppfølging. Den kjører som Make.com-flyt og er den enkleste måten å få data ut av Shopify på.':
    'The Google Sheets integration sends orders, form submissions or cancellations from Shopify and the website into the spreadsheets the team already works in, for pick lists, consolidated invoicing or follow-up. It runs as a Make.com flow in your own account and is the simplest way to get data out of Shopify and in front of people.',
  'Google Sheets er regnearket alle har. Som integrasjon er det et arbeidsbord, ikke et system, og det er ofte nok.': 'Google Sheets is the spreadsheet everyone has. As an integration it is a workbench, not a system, and that is often enough.',
  'Noen ganger er svaret et ark. Et ordreark for plukk eller en liste over oppsigelser slår et nytt system.': 'Sometimes the answer is a sheet. An order sheet for picking or a list of cancellations beats a new system.',
  'Google Workspace': 'Google Workspace',
  'Shopify eller skjema': 'Shopify or a form',

  // Holio
  'Holio-integrasjon for Shopify': 'Holio integration for Shopify',
  'Ordre- og lagersystem for mindre grossister. Ordre inn, lager og forsendelser tilbake.': 'Order and warehouse system for smaller wholesalers. Orders in, stock and shipments back.',
  'Holio-integrasjonen kobler Shopify til Holio sitt ordre- og lagersystem, slik at ordre går inn i Holio for plukk og pakk, og lager og sporing kommer tilbake til Shopify. Vi setter opp Holio sin Shopify-kobling og tester plukk, pakk, retur og lagerjustering før go-live.':
    "The Holio integration connects Shopify to Holio's order and warehouse system, so orders go into Holio for pick and pack, and stock levels and tracking come back to Shopify. We set up Holio's Shopify connection, map locations and shipping methods, and test picking, packing, returns and stock adjustments before go-live.",
  'Holio er et norsk OMS og WMS for mindre grossister og nettbutikker med eget lager. Et lettere alternativ til Omnium.': 'Holio is a Norwegian OMS and WMS for smaller wholesalers and online stores with their own warehouse. A lighter alternative to Omnium.',
  'Med eget lager og flere kanaler trenger du ett sted for plukk og lager, uten å betale for mer enn du bruker.': 'With your own warehouse and several channels you need one place for picking and stock, without paying for more than you use.',
  'Holio-konto med Shopify-kobling': 'Holio account with Shopify connection',
  'Lagerlokasjoner avklart': 'Warehouse locations agreed',

  // IZY
  'IZY Rental for Shopify': 'IZY Rental for Shopify',
  'Utleie med datoperiode, tilgjengelighet og tilbehør, rett i Shopify-kassen.': 'Rental with date range, availability and accessories, straight in the Shopify checkout.',
  'IZY-integrasjonen gir utleiebooking i Shopify: kunden velger periode, ser tilgjengelighet, legger til tilbehør og betaler i kassen som en vanlig ordre. Vi setter opp IZY sin app, leveringsvalg etter postnummer med post, budbil eller henting, og kobler bookingen videre til fakturering i regnskapet og fraktetikett når leien skal sendes.':
    "The IZY integration brings rental booking into Shopify: the customer picks a period, sees availability, adds accessories and pays at checkout like any other order. We set up IZY's app, delivery options by postcode with post, courier or pickup, and connect the booking onward to invoicing in the accounts and a shipping label when the rental is sent.",
  'IZY Rental er en bookingapp for utleie på Shopify. Bookingen blir en ordre, resten av flyten er som for andre ordre.': 'IZY Rental is a booking app for rentals on Shopify. The booking becomes an order, and the rest of the flow is the same as for any other order.',
  'Utleie krever periode og tilgjengelighet. Standard Shopify har ingen av delene.': 'Rental needs a period and availability. Standard Shopify has neither.',
  'IZY-konto': 'IZY account',
  'Regler for levering og henting': 'Rules for delivery and pickup',
}

// Subjects used in "Kan vi starte med X og utvide senere?" and category names.
const SUBJECT: Record<string, string> = {
  frakt: 'shipping', ERP: 'ERP', feed: 'the feed', betaling: 'payments', produktdata: 'product data', salg: 'sales', POS: 'POS', ordreark: 'the order sheet', lager: 'stock', booking: 'booking',
}
const CAT_NAME: Record<string, string> = {
  betaling: 'payments', 'booking og annet': 'booking and other flows', 'erp og økonomi': 'ERP and finance', 'logistikk og frakt': 'logistics and shipping',
  'markedsføring og sporing': 'marketing and tracking', 'oms, lager og edi': 'OMS, warehouse and EDI', 'pim og produktdata': 'PIM and product data', 'pos og butikk': 'POS and retail',
}
const ANCHOR: Record<string, string> = { eierskap: 'ownership', feil: 'failures', fasit: 'source-of-truth', andre: 'other-systems' }

const PATTERNS: [RegExp, (m: RegExpMatchArray) => string | undefined][] = [
  [/^Kjører dere (.+) i dag\?$/, (m) => `Do you use ${m[1]} today?`],
  [/^Eier vi integrasjonen mot (.+) selv\?$/, (m) => `Do we own the ${m[1]} integration ourselves?`],
  [/^Kan vi starte med (.+) og utvide senere\?$/, (m) => SUBJECT[m[1]] && `Can we start with ${SUBJECT[m[1]]} and extend later?`],
  [/^Hva som skal flyte mellom Shopify og (.+), hvem som er fasit for hva, og hva som skjer ved feil\. Én arbeidsøkt\.$/, (m) => `What should flow between Shopify and ${m[1]}, which system is the source of truth for what, and what happens on errors. One working session.`],
  [/^Hvilke (.+)-systemer støtter dere\?$/, (m) => CAT_NAME[m[1]] && `Which ${CAT_NAME[m[1]]} systems do you support?`],
  [/^Hvilket system bruker dere til (.+)\?$/, (m) => CAT_NAME[m[1]] && `Which system do you use for ${CAT_NAME[m[1]]}?`],
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
const enId = (id: string) => (id.endsWith('-no') ? id.replace(/-no$/, '-en') : PAGE_ID_MAP[id] ?? id)
const weak = (r: Doc) => ({ ...r, _type: 'reference', _ref: enId(r._ref), _weak: true })
const words = (s: string) => s.trim().split(/\s+/).length

function buildEn(no: Doc): Doc {
  const { _rev, _createdAt, _updatedAt, ...rest } = no
  const en: Doc = { ...rest, _id: enId(no._id), language: 'en' }
  en.slug = { _type: 'slug', current: String(no.slug.current).replace(/^integrasjoner/, 'integrations') }
  for (const f of ['pageTitle', 'title', 'definition', 'shortDescription']) if (typeof no[f] === 'string') en[f] = tr(no[f])
  for (const f of ['intro', 'whatItIs', 'whyItMatters']) if (Array.isArray(no[f])) en[f] = pt(no[f])
  if (Array.isArray(no.sections)) en.sections = no.sections.map((s: Doc) => ({ ...s, heading: tr(s.heading), anchor: s.anchor ? ANCHOR[s.anchor] ?? tr(s.anchor) : s.anchor, body: pt(s.body) }))
  if (Array.isArray(no.implementationSteps)) en.implementationSteps = no.implementationSteps.map((s: Doc) => ({ ...s, name: tr(s.name), text: tr(s.text) }))
  for (const f of ['prerequisites', 'notIncluded', 'namedClients']) if (Array.isArray(no[f])) en[f] = no[f].map((x: string) => (f === 'namedClients' ? sysName(x) : tr(x)))
  if (Array.isArray(no.faq)) en.faq = no.faq.map((q: Doc) => ({ ...q, question: tr(q.question), answer: tr(q.answer) }))
  if (no.cta) en.cta = { ...no.cta, heading: tr(no.cta.heading), text: tr(no.cta.text), buttonLabel: tr(no.cta.buttonLabel), buttonHref: '/contact' }
  if (Array.isArray(no.dataFlowSteps)) en.dataFlowSteps = no.dataFlowSteps.map((s: Doc) => ({ ...s, payload: tr(s.payload), frequency: tr(s.frequency), from: sysName(s.from), to: sysName(s.to) }))
  if (Array.isArray(no.systems)) en.systems = no.systems.map((s: Doc) => ({ ...s, name: sysName(s.name) }))
  if (no.seoExtended) en.seoExtended = { ...no.seoExtended, metaTitle: tr(no.seoExtended.metaTitle), metaDescription: tr(no.seoExtended.metaDescription) }
  if (no.category?._ref) en.category = weak(no.category)
  if (no.pillar?._ref) en.pillar = weak(no.pillar)
  if (Array.isArray(no.clusterLinks)) en.clusterLinks = no.clusterLinks.map(weak)
  if (Array.isArray(no.relatedPages)) en.relatedPages = no.relatedPages.map(weak)
  return en
}

async function main() {
  const sources = await client.fetch<Doc[]>('*[_id in $ids]', { ids: SOURCE_IDS })
  const found = new Set(sources.map((d) => d._id))
  const absent = SOURCE_IDS.filter((id) => !found.has(id))
  if (absent.length) throw new Error(`missing Norwegian sources in ${dataset}: ${absent.join(', ')}`)

  const docs = sources.map(buildEn)
  if (missing.length) throw new Error(`untranslated strings:\n${[...new Set(missing)].map((s) => `  - ${s}`).join('\n')}`)
  if (process.env.DRY_RUN) {
    for (const d of docs) console.log('DRY', d._id, d.slug.current, d.definition ? `${words(d.definition)} words` : '')
    return
  }

  for (const d of docs) {
    await client.createOrReplace(d)
    console.log(dataset, 'wrote', d._id, d.definition ? `(${words(d.definition)} words in definition)` : '')
  }
  for (const no of sources) {
    const type = no._type
    const metaId = no._id.replace(/-no$/, '-meta')
    await client.createOrReplace({
      _id: metaId, _type: 'translation.metadata', schemaTypes: [type], translations: [
        { _key: 'no', value: { _type: 'reference', _ref: no._id, _weak: true, _strengthenOnPublish: { type } } },
        { _key: 'en', value: { _type: 'reference', _ref: enId(no._id), _weak: true, _strengthenOnPublish: { type } } },
      ],
    })
    console.log(dataset, 'wrote', metaId)
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
