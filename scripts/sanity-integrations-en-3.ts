// TARGET_DATASET=production npx sanity exec scripts/sanity-integrations-en-3.ts --with-user-token
// Creates English versions (-en) of 11 Norwegian integrationPage documents (batch 3:
// profrakt, quickship, shopify-pos, sparklayer, tracklution, trimit, tripletex, unimicro,
// vipps-hurtigkasse, visma-net, vuuh) plus translation.metadata for each pair.
// Idempotent: fetches each -no document, translates every text field through the T table
// below (the script fails loudly on any string it has no translation for), rewrites
// references to the -en counterparts (weak), and createOrReplace-s on fixed ids.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const DRY = process.env.DRY_RUN === '1' // DRY_RUN=1 builds and validates everything but writes nothing
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

const SLUGS = ['profrakt', 'quickship', 'shopify-pos', 'sparklayer', 'tracklution', 'trimit', 'tripletex', 'unimicro', 'vipps-hurtigkasse', 'visma-net', 'vuuh']

// Known Norwegian → English ids for related pages that are not -no/-en pairs.
// Anything else is resolved through translation.metadata at run time.
const RELATED_MAP: Record<string, string> = {
  '1368ee2e-b89e-44e4-ac40-36fd19f2c879': 'e9ee91de-b1b2-47a6-9ded-7672b1f6911c', // allPackagesPage
  '46bf58c8-302e-4fb2-bebe-5c6f505a97b3': 'c749a129-ccca-44ab-a01b-0247652026fe', // partnersPage
}

// ---------------------------------------------------------------------------
// Translation table: every Norwegian string that appears in a text field of the
// 11 documents, mapped to idiomatic English. Facts are kept as they are in Norwegian:
// Tripletex is one-way Shopify → Tripletex and invoices are created but not sent
// automatically; Omnium is in; no prices.
// ---------------------------------------------------------------------------
const T: Record<string, string> = {
  // --- shared: CTA ---
  'Book en samtale': 'Book a call',
  'Fortell oss hvilke systemer du har, så får du metode, dataflyt og tidsplan innen to virkedager.':
    'Tell us which systems you have, and you get method, data flow and timeline within two working days.',
  'Kjører dere Profrakt i dag?': 'Running Profrakt today?',
  'Kjører dere Quickship i dag?': 'Running Quickship today?',
  'Kjører dere Shopify POS i dag?': 'Running Shopify POS today?',
  'Kjører dere SparkLayer i dag?': 'Running SparkLayer today?',
  'Kjører dere Tracklution i dag?': 'Running Tracklution today?',
  'Kjører dere TRIMIT i dag?': 'Running TRIMIT today?',
  'Kjører dere Tripletex i dag?': 'Running Tripletex today?',
  'Kjører dere UniMicro i dag?': 'Running UniMicro today?',
  'Kjører dere Vipps i dag?': 'Running Vipps today?',
  'Kjører dere Visma.net i dag?': 'Running Visma.net today?',
  'Kjører dere Vuuh i dag?': 'Running Vuuh today?',

  // --- shared: FAQ ---
  'Ja. Make.com-scenarioer ligger i din konto, og kode leveres med kildekode. Vi drifter om du vil, men du er ikke låst til oss.':
    'Yes. Make.com scenarios live in your own account, and code is delivered with source. We run it if you want, but you are not locked in to us.',
  'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen. Det finnes ingen automatisk tilbakerulling, og det sier vi rett ut.':
    'Every run is kept in the history with input and output. Errors are flagged with a reference, and we clean up together. There is no automatic rollback, and we say so plainly.',
  'Ja. De fleste starter med én flyt, for eksempel ordre, og legger til lager eller kunder etterpå.':
    'Yes. Most start with one flow, such as orders, and add inventory or customers later.',
  'Make.com-flyter leveres på dager når kartleggingen er gjort. Egen kode tar lenger, og vi gir tidsplan etter første samtale.':
    'Make.com flows are delivered in days once the mapping session is done. Custom code takes longer, and we give you a timeline after the first call.',
  'Hva skjer når en kjøring feiler?': 'What happens when a run fails?',
  'Hvor lang tid tar oppsettet?': 'How long does setup take?',
  'Eier vi integrasjonen mot Profrakt selv?': 'Do we own the Profrakt integration ourselves?',
  'Eier vi integrasjonen mot Quickship selv?': 'Do we own the Quickship integration ourselves?',
  'Eier vi integrasjonen mot Shopify POS selv?': 'Do we own the Shopify POS integration ourselves?',
  'Eier vi integrasjonen mot SparkLayer selv?': 'Do we own the SparkLayer integration ourselves?',
  'Eier vi integrasjonen mot Tracklution selv?': 'Do we own the Tracklution integration ourselves?',
  'Eier vi integrasjonen mot TRIMIT selv?': 'Do we own the TRIMIT integration ourselves?',
  'Eier vi integrasjonen mot UniMicro selv?': 'Do we own the UniMicro integration ourselves?',
  'Eier vi integrasjonen mot Vipps selv?': 'Do we own the Vipps integration ourselves?',
  'Eier vi integrasjonen mot Visma.net selv?': 'Do we own the Visma.net integration ourselves?',
  'Eier vi integrasjonen mot Vuuh selv?': 'Do we own the Vuuh integration ourselves?',
  'Kan vi starte med frakt og utvide senere?': 'Can we start with shipping and expand later?',
  'Kan vi starte med kasse og utvide senere?': 'Can we start with the POS and expand later?',
  'Kan vi starte med B2B og utvide senere?': 'Can we start with B2B and expand later?',
  'Kan vi starte med sporing og utvide senere?': 'Can we start with tracking and expand later?',
  'Kan vi starte med lagersynk og utvide senere?': 'Can we start with inventory sync and expand later?',
  'Kan vi starte med vareflyt og utvide senere?': 'Can we start with the product flow and expand later?',
  'Kan vi starte med betaling og utvide senere?': 'Can we start with payments and expand later?',
  'Kan vi starte med ERP og utvide senere?': 'Can we start with the ERP and expand later?',
  'Kan vi starte med produktdata og utvide senere?': 'Can we start with product data and expand later?',

  // --- shared: implementation steps ---
  'Kartlegging': 'Mapping',
  'Oppsett': 'Setup',
  'Test på reelle data': 'Test on real data',
  'Go-live og overvåking': 'Go-live and monitoring',
  'Tilkobling i din egen konto, mapping av felt, og testdata gjennom hele flyten.':
    'Connection in your own account, field mapping, and test data through the whole flow.',
  'De første ordrene eller produktene følges manuelt før vi slår på alt.':
    'The first orders or products are followed manually before we switch everything on.',
  'Vi følger de første ukene. Feil varsles med referanse til ordren.':
    'We follow the first weeks. Errors are flagged with a reference to the order.',
  'Hva som skal flyte mellom Shopify og Profrakt, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'What should flow between Shopify and Profrakt, which system is the source of truth for what, and what happens on errors. One working session.',
  'Hva som skal flyte mellom Shopify og Quickship, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'What should flow between Shopify and Quickship, which system is the source of truth for what, and what happens on errors. One working session.',
  'Hva som skal flyte mellom Shopify og SparkLayer, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'What should flow between Shopify and SparkLayer, which system is the source of truth for what, and what happens on errors. One working session.',
  'Hva som skal flyte mellom Shopify og Tracklution, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'What should flow between Shopify and Tracklution, which system is the source of truth for what, and what happens on errors. One working session.',
  'Hva som skal flyte mellom Shopify og TRIMIT, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'What should flow between Shopify and TRIMIT, which system is the source of truth for what, and what happens on errors. One working session.',
  'Hva som skal flyte mellom Shopify og UniMicro, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'What should flow between Shopify and UniMicro, which system is the source of truth for what, and what happens on errors. One working session.',
  'Hva som skal flyte mellom Shopify og Vipps, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'What should flow between Shopify and Vipps, which system is the source of truth for what, and what happens on errors. One working session.',
  'Hva som skal flyte mellom Shopify og Visma.net, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'What should flow between Shopify and Visma.net, which system is the source of truth for what, and what happens on errors. One working session.',
  'Hva som skal flyte mellom Shopify og Vuuh, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'What should flow between Shopify and Vuuh, which system is the source of truth for what, and what happens on errors. One working session.',

  // --- shared: data flow frequencies and payloads ---
  'sanntid': 'real time',
  'daglig': 'daily',
  'løpende': 'continuous',
  'hvert 15. min': 'every 15 min',
  'ved knapp': 'on button press',
  'ved pakking': 'at packing',
  'månedlig, valgfritt': 'monthly, optional',
  'mottaker + kolli → etikett': 'recipient + parcels → label',
  'sporingsnummer': 'tracking number',
  'fraktvalg': 'shipping options',
  'etikett': 'label',
  'sporing': 'tracking',
  'salg + kunder + lager': 'sales + customers + inventory',
  'dagsoppgjør': 'daily settlement',
  'B2B-ordre': 'B2B orders',
  'ordre': 'orders',
  'kjøp + hendelser': 'purchases + events',
  'konverteringer': 'conversions',
  'lagerbeholdning per variant': 'stock per variant',
  'ordre + kunde': 'order + customer',
  'faktura opprettes, sendes ikke': 'invoice created, not sent',
  'refusjon → kreditnota': 'refund → credit note',
  'samlebilag': 'consolidated voucher',
  'varer + lager': 'products + inventory',
  'ordre + kunder': 'orders + customers',
  'betalt ordre + kunde': 'paid order + customer',
  'oppgjør': 'settlement',
  'produkter + bilder + lager': 'products + images + inventory',

  // --- Profrakt ---
  'Profrakt-integrasjon for Shopify': 'Profrakt integration for Shopify',
  'Profrakt-integrasjonen bestiller fraktetikett fra Profrakt når en ordre eller booking er klar, og legger sporingsnummeret tilbake på forsendelsen. Den kjører som Make.com-flyt og kan utløses fra Shopify, eller fra et annet system som Podio når leien skal sendes, ikke når den bestilles.':
    'The Profrakt integration orders a shipping label from Profrakt when an order or booking is ready, and writes the tracking number back to the shipment. It runs as a Make.com flow and can be triggered from Shopify, or from another system such as Podio when a rental is due to ship, not when it is booked.',
  'Fraktetiketter bestilt fra ordren eller fra bookingsystemet, sporing tilbake på forsendelsen.':
    'Shipping labels ordered from the order or from the booking system, tracking written back to the shipment.',
  'Profrakt er en norsk fraktportal med avtaler hos flere transportører. Integrasjonen kaller Profrakt sitt API med mottaker og kolli, og får etikett og sporing tilbake.':
    'Profrakt is a Norwegian freight portal with agreements across several carriers. The integration calls the Profrakt API with recipient and parcel details, and gets the label and tracking back.',
  'Utleie og bestillinger med leveringsdato passer ikke i standard fraktapper, som sender med en gang ordren er betalt.':
    'Rentals and orders with a delivery date do not fit standard shipping apps, which ship as soon as the order is paid.',
  'Profrakt-konto med API': 'Profrakt account with API access',
  'Shopify eller bookingsystem': 'Shopify or a booking system',
  'Make.com-konto': 'Make.com account',

  // --- Quickship ---
  'Quickship for Shopify': 'Quickship for Shopify',
  'Quickship-integrasjonen gir fraktvalg og etiketter for B2B-sendinger fra Shopify, inkludert pall og stykkgods som vanlige fraktapper ikke dekker. Vi setter opp appen, fraktregler per kundegruppe og vekt, etikettflyten fra ordren til pakking, og kobler sporing tilbake til ordren så forhandleren ser når pallen er på vei.':
    'The Quickship integration provides shipping options and labels for B2B shipments from Shopify, including pallets and general cargo that standard shipping apps miss. We set up the app, shipping rules per customer group and weight, the label flow from order to packing, and connect tracking back to the order so the retailer sees when the pallet ships.',
  'Fraktvalg og etiketter for B2B-sendinger med pall og stykkgods.':
    'Shipping options and labels for B2B shipments with pallets and general cargo.',
  'Quickship er en norsk fraktløsning rettet mot bedrifter. Shopify-appen gir priser i kassen og etiketter fra ordren.':
    'Quickship is a Norwegian shipping solution aimed at businesses. The Shopify app gives rates in checkout and labels from the order.',
  'B2B-ordre er tyngre og går på pall. Fraktvalg må reflektere det.':
    'B2B orders are heavier and go on pallets. The shipping options have to reflect that.',
  'Quickship-konto': 'Quickship account',
  'Shopify': 'Shopify',
  'Fraktregler per kundegruppe': 'Shipping rules per customer group',

  // --- Shopify POS ---
  'Shopify POS, fra PCKasse til én kasse': 'Shopify POS, from PCKasse to one point of sale',
  'Shopify POS gir butikken samme varelager, kunder og gavekort som nettbutikken. Vi setter opp kassen, maskinvare og betalingsterminal, flytter kunder og gavekortsaldo fra PCKasse eller Front, og lærer opp butikkteamet før lansering. Regnskapet får ett salg per dag per butikk.':
    'Shopify POS gives the physical store the same inventory, customers and gift cards as the online store. We set up the POS, hardware and payment terminal, move customers and gift card balances from PCKasse or Front, and train the store team before launch. Accounting gets one sale per day per store.',
  'Butikk og nett i samme system. Vi flytter kunder, gavekort og varer fra PCKasse og setter opp kassen.':
    'Store and web in one system. We move customers, gift cards and products from PCKasse and set up the POS.',
  'Shopify POS er Shopify sitt eget kassesystem. Det erstatter PCKasse for butikker som vil ha én plattform, og oppfyller kassasystemlova når det er satt opp riktig.':
    "Shopify POS is Shopify's own point-of-sale system. It replaces PCKasse for stores that want one platform, and complies with the Norwegian Cash Register Systems Act when set up correctly.",
  'To systemer for butikk og nett betyr dobbelt lager, dobbelt kunderegister og gavekort som ikke virker på tvers.':
    'Two systems for store and web mean double inventory, a double customer register and gift cards that do not work across channels.',
  'Gammelt kassesystem, Z-rapport-vaner, gavekortsaldo og kundedata som skal med.':
    'The old POS system, Z-report habits, gift card balances and customer data that need to come along.',
  'Lokasjoner, maskinvare, betalingsterminal og kvitteringsoppsett.': 'Locations, hardware, payment terminal and receipt setup.',
  'Flytting': 'Migration',
  'Kunder og gavekort fra PCKasse, varer med strekkoder.': 'Customers and gift cards from PCKasse, products with barcodes.',
  'Opplæring og go-live': 'Training and go-live',
  'Butikkteamet lærer kassen, vi er til stede første dag.': 'The store team learns the POS, and we are on site on the first day.',
  'Shopify-plan med POS Pro der det trengs': 'Shopify plan with POS Pro where needed',
  'Betalingsterminal som støttes i Norge': 'Payment terminal supported in Norway',
  'Eksport fra gammelt kassesystem': 'Export from the old POS system',

  // --- SparkLayer ---
  'SparkLayer B2B for Shopify': 'SparkLayer B2B for Shopify',
  'SparkLayer legger en B2B-bestillingsflate oppå Shopify med kundespesifikke priser, minimumsantall, hurtigbestilling og bestillingslister for forhandlere. Vi setter opp prislister og kundegrupper, tilpasser visningen i temaet, og kobler B2B-ordrene videre til Omnium eller regnskapssystemet slik at de behandles likt med alle andre ordre.':
    'SparkLayer adds a B2B ordering layer on top of Shopify with customer-specific prices, minimum quantities, quick ordering and order lists for retailers. We set up price lists and customer groups, adapt the display in the theme, and pass B2B orders on to Omnium or the accounting system so they are handled like every other order.',
  'B2B-portal på Shopify med kundepriser, bestillingslister og ordre som flyter videre til OMS.':
    'B2B portal on Shopify with customer prices, order lists and orders that flow on to the OMS.',
  'SparkLayer er en Shopify-app for B2B. Den erstatter ikke OMS, men gir forhandlerne en bestillingsportal på samme butikk som B2C.':
    'SparkLayer is a Shopify app for B2B. It does not replace an OMS, but gives retailers an ordering portal on the same store as B2C.',
  'Forhandlere som bestiller på e-post koster tid. En portal med riktige priser gir ordre rett inn i flyten.':
    'Retailers who order by email cost time. A portal with the right prices puts orders straight into the flow.',
  'Shopify Plus anbefalt': 'Shopify Plus recommended',
  'Prislister per kundegruppe': 'Price lists per customer group',
  'OMS eller regnskap for ordrene videre': 'OMS or accounting for the orders downstream',

  // --- Tracklution ---
  'Tracklution server-side sporing for Shopify': 'Tracklution server-side tracking for Shopify',
  'Tracklution-integrasjonen sender kjøp og hendelser fra Shopify server-side til Meta, Google Ads og affiliate-nettverk, uavhengig av nettleserblokkering og samtykkevalg som stopper vanlige piksler. Vi skriver custom pixel i Shopify-kassen, kobler hendelsene til Tracklution med riktig samtykkehåndtering, og verifiserer at konverteringene i annonseplattformene stemmer mot ordrene i Shopify.':
    'The Tracklution integration sends purchases and events from Shopify server-side to Meta, Google Ads and affiliate networks, independent of browser blocking and consent choices that stop ordinary pixels. We write a custom pixel in Shopify checkout, connect the events to Tracklution with correct consent handling, and verify that conversions in the ad platforms match the orders in Shopify.',
  'Server-side sporing til Meta, Google og affiliate, med custom pixel i Shopify-kassen.':
    'Server-side tracking to Meta, Google and affiliates, with a custom pixel in Shopify checkout.',
  'Tracklution er en server-side sporingstjeneste. Shopify-kassen tillater bare custom pixels, så koblingen er kode vi skriver og vedlikeholder.':
    'Tracklution is a server-side tracking service. Shopify checkout only allows custom pixels, so the connection is code we write and maintain.',
  'Annonseplattformene ser ikke lenger alle kjøp fra nettleseren. Uten server-side sporing optimaliserer de på feil tall.':
    'The ad platforms no longer see every purchase from the browser. Without server-side tracking they optimise on the wrong numbers.',
  'Tracklution-konto': 'Tracklution account',
  'Shopify med custom pixel-tilgang': 'Shopify with custom pixel access',
  'Samtykkebanner': 'Consent banner',

  // --- TRIMIT ---
  'TRIMIT-lagersynk for Shopify': 'TRIMIT inventory sync for Shopify',
  'TRIMIT-integrasjonen synker lagerbeholdning fra TRIMIT, ERP for mote og tekstil, til Shopify per variant og lokasjon. Den kjører som Make.com-scenario på fast intervall, slik at nettbutikken aldri selger varer som er utsolgt i ERP. Ordre går ikke tilbake i denne flyten.':
    'The TRIMIT integration syncs stock levels from TRIMIT, the ERP for fashion and textiles, to Shopify per variant and location. It runs as a Make.com scenario on a fixed interval, so the online store never sells items that are sold out in the ERP. Orders do not flow back in this integration.',
  'Lagersynk fra TRIMIT til Shopify for mote og tekstil med mange varianter.':
    'Inventory sync from TRIMIT to Shopify for fashion and textiles with many variants.',
  'TRIMIT er et ERP bygget på Microsoft Dynamics for mote, møbler og tekstil, med størrelse og farge som dimensjoner. Integrasjonen leser beholdning per variant og oppdaterer Shopify.':
    'TRIMIT is an ERP built on Microsoft Dynamics for fashion, furniture and textiles, with size and colour as dimensions. The integration reads stock per variant and updates Shopify.',
  'Mote har mange varianter og raske utsalg. Feil lager i nettbutikken gir kanselleringer og dårlige anmeldelser.':
    'Fashion has many variants and fast sell-outs. Wrong stock in the online store means cancellations and bad reviews.',
  'Ordre til TRIMIT. Kan legges til som egen flyt': 'Orders to TRIMIT. Can be added as a separate flow',
  'TRIMIT med API-tilgang': 'TRIMIT with API access',
  'Shopify med SKU per variant': 'Shopify with a SKU per variant',

  // --- Tripletex ---
  'Tripletex-integrasjon for Shopify': 'Tripletex integration for Shopify',
  'Tripletex-integrasjonen sender betalte Shopify-ordre til Tripletex som ordre og faktura med kunde, frakt og mva, enten per ordre eller som samlebilag per måned. Refusjoner i Shopify blir kreditnota. Flyten går én vei: Shopify er salgskanal, Tripletex er regnskap, og lager styres i Shopify. Den kjører som Make.com-scenario i din egen konto, og fakturaer sendes ikke før regnskapsfører har sett dem.':
    'The Tripletex integration sends paid Shopify orders to Tripletex as orders and invoices, per order or as a monthly consolidated voucher. Refunds become credit notes. The flow is one-way: Shopify sells, Tripletex does the accounting, inventory stays in Shopify. It runs as a Make.com scenario in your account, and invoices are created but not sent until your accountant reviews them.',
  'Ordre og kunder til Tripletex som faktura per ordre eller samlebilag per måned. Refusjoner blir kreditnota.':
    'Orders and customers to Tripletex as an invoice per order or a consolidated monthly voucher. Refunds become credit notes.',
  'Tripletex er et norsk skybasert regnskapssystem for små og mellomstore selskaper. Integrasjonen gjør Shopify til salgskanal og Tripletex til regnskap, slik at ingen punsher ordre. Kunder og produkter opprettes i Tripletex første gang de dukker opp, og brukes igjen etterpå. Kundeoppslag skjer på e-post for B2C og organisasjonsnummer for B2B.':
    'Tripletex is a Norwegian cloud accounting system for small and mid-sized companies. The integration makes Shopify the sales channel and Tripletex the accounting system, so nobody keys in orders. Customers and products are created in Tripletex the first time they appear, and reused after that. Customers are looked up by email for B2C and by organisation number for B2B.',
  'Manuell bokføring av nettbutikkordre er den vanligste kilden til avvik i mva-meldingen. Med integrasjonen får regnskapsfører riktig grunnlag hver dag, med Shopify-ordrenummer som referanse på hver faktura og kreditnota. Fakturaen opprettes, men sendes ikke automatisk, så regnskapsfører beholder kontrollen.':
    'Manual bookkeeping of online orders is the most common source of discrepancies in the VAT return. With the integration, the accountant gets correct records every day, with the Shopify order number as the reference on every invoice and credit note. The invoice is created but not sent automatically, so the accountant stays in control.',
  'Kontoplan, mva-koder, kundegrupper, og om dere vil ha faktura per ordre eller samlebilag per måned. Én arbeidsøkt med regnskapsfører.':
    'Chart of accounts, VAT codes, customer groups, and whether you want an invoice per order or a consolidated voucher per month. One working session with your accountant.',
  'Oppsett i Make.com': 'Setup in Make.com',
  'API-token fra Tripletex, tilkobling i din Make-konto, scenario fra vår mal med kunde- og produktoppslag.':
    'API token from Tripletex, connection in your Make account, scenario from our template with customer and product lookup.',
  'Test på reelle ordre': 'Test on real orders',
  'De første ordrene gjennom hele flyten. Regnskapsfører godkjenner fakturaene før de sendes.':
    'The first orders through the whole flow. The accountant approves the invoices before they are sent.',
  'Vi følger de første ukene. Feilede kjøringer ligger synlig i Make-historikken og varsles med ordrenummer.':
    'We follow the first weeks. Failed runs are visible in the Make history and flagged with the order number.',
  'Tripletex med API-tilgang (ansatt-token)': 'Tripletex with API access (employee token)',
  'Shopify eller Shopify Plus': 'Shopify or Shopify Plus',
  'Make.com-konto i ditt navn, vi setter opp om du ikke har': 'Make.com account in your name, we set one up if you do not have one',
  'Kontoplan, mva-koder og forfall avklart med regnskapsfører': 'Chart of accounts, VAT codes and due dates agreed with your accountant',
  'SKU eller EAN på alle varianter, så produktoppslag treffer': 'SKU or EAN on all variants, so product lookup matches',
  'Lager. Shopify er fasit, eller Omnium om du trenger OMS': 'Inventory. Shopify is the source of truth, or Omnium if you need an OMS',
  'Betalingsstatus tilbake. Shopify-ordre er allerede betalt når de sendes': 'Payment status back. Shopify orders are already paid when they are sent',
  'Kan vi bruke Tripletex sin egen Shopify-app i stedet?': "Can we use Tripletex's own Shopify app instead?",
  'Ja, for enkle B2C-butikker. Vår integrasjon er for deg som trenger samlebilag, B2B-faktura med org.nr, EDI via Omnium, egen mapping av mva og konto, eller fakturering som utløses av noe annet enn kassen.':
    'Yes, for simple B2C stores. Our integration is for those who need consolidated vouchers, B2B invoices with organisation numbers, EDI via Omnium, custom VAT and account mapping, or invoicing triggered by something other than checkout.',
  'Synker dere lager fra Tripletex til Shopify?': 'Do you sync inventory from Tripletex to Shopify?',
  'Nei. Shopify er fasit for lager i denne integrasjonen. Trenger du lagerstyring på tvers av kanaler, er Omnium eller Holio riktig verktøy, og de kobler vi til.':
    'No. Shopify is the source of truth for inventory in this integration. If you need inventory management across channels, Omnium or Holio is the right tool, and we connect those.',
  'Sendes fakturaene automatisk til kunden?': 'Are invoices sent to the customer automatically?',
  'Nei. Fakturaen opprettes i Tripletex, og regnskapsfører sender den, eller setter opp Tripletex sin egen utsending. Det er et bevisst valg.':
    "No. The invoice is created in Tripletex, and the accountant sends it or sets up Tripletex's own sending. That is a deliberate choice.",
  'Eier vi Make.com-scenarioet?': 'Do we own the Make.com scenario?',
  'Ja. Scenarioet og tilkoblingene ligger i din Make-konto. Vi drifter om du vil, men du er ikke låst.':
    'Yes. The scenario and the connections live in your Make account. We run it if you want, but you are not locked in.',

  // --- UniMicro ---
  'UniMicro-integrasjon for Shopify': 'UniMicro integration for Shopify',
  'UniMicro-integrasjonen kobler Shopify til UniMicro slik at varer og lager kommer fra ERP til nettbutikken, og ordre og kunder går tilbake. Den settes opp med UniMicro sin Shopify-kobling, og vi gjør kartlegging, mapping, test og go-live som del av en migrering eller nybygg.':
    "The UniMicro integration connects Shopify to UniMicro so that products and inventory come from the ERP to the online store, and orders and customers go back. It is set up with UniMicro's own Shopify connector, and we do the mapping session, field mapping, testing and go-live as part of a migration or a new build.",
  'Varer, lager, ordre og kunder mellom Shopify og UniMicro, med ERP som fasit for lager.':
    'Products, inventory, orders and customers between Shopify and UniMicro, with the ERP as the source of truth for inventory.',
  'UniMicro er et norsk økonomisystem med egen Shopify-kobling. Her er ERP fasit for varer og lager, i motsetning til Tripletex-oppsettet der Shopify er fasit.':
    'UniMicro is a Norwegian business system with its own Shopify connector. Here the ERP is the source of truth for products and inventory, unlike the Tripletex setup where Shopify is.',
  'Butikker med fysisk lager og eget varesystem vil ikke vedlikeholde produkter to steder. Da må nettbutikken følge ERP.':
    'Stores with a physical warehouse and their own product system do not want to maintain products in two places. Then the online store has to follow the ERP.',
  'UniMicro med Shopify-kobling': 'UniMicro with the Shopify connector',
  'Varenummer som stemmer begge steder': 'Product numbers that match on both sides',

  // --- Vipps ---
  'Vipps Hurtigkasse for Shopify': 'Vipps Quick Checkout for Shopify',
  'Vipps Hurtigkasse lar kunden betale med ett trykk fra produktsiden, uten å fylle inn adresse. Vi setter opp Vipps sin Shopify-app, plasserer knappen riktig i tema og kasse, tester på mobil, og fører Vipps-oppgjøret mot egen betalingsmåte i regnskapet slik at bank og bokføring stemmer.':
    'Vipps Quick Checkout lets the customer pay with one tap from the product page, without filling in an address. We set up the Vipps Shopify app, place the button correctly in theme and checkout, test on mobile, and post the Vipps settlement against its own payment method in accounting so bank and books match.',
  'Ett trykk fra produktside til betalt ordre. Oppsett, test og go-live, og Vipps-oppgjør mot regnskapet.':
    'One tap from product page to paid order. Setup, testing and go-live, plus the Vipps settlement against accounting.',
  'Vipps Hurtigkasse er en betalings- og kassemetode fra Vipps MobilePay. Kunden identifiseres med telefonnummer, og adresse og betaling hentes fra Vipps.':
    'Vipps Quick Checkout (Hurtigkasse) is a payment and checkout method from Vipps MobilePay. The customer is identified by phone number, and address and payment are fetched from Vipps.',
  'Norske kunder forventer Vipps. Hurtigkasse fjerner skjemaet, og det er skjemaet som dreper konvertering på mobil.':
    'Norwegian customers expect Vipps. Quick Checkout removes the form, and the form is what kills conversion on mobile.',
  'Vipps-avtale for nettbutikk': 'Vipps agreement for online stores',
  'Regnskap med egen betalingsmåte for Vipps': 'Accounting with a separate payment method for Vipps',

  // --- Visma.net ---
  'Visma.net-integrasjon for Shopify': 'Visma.net integration for Shopify',
  'Visma.net-integrasjonen kobler Visma.net ERP til Shopify slik at varer, priser og lager kommer fra ERP, og ordre og kunder går tilbake som salgsordre. Vi bygger flyten mot Visma.net sitt API, med kø og retry, fordi volumet og feilhåndteringen i ERP-prosjekter krever det. Faktura og levering styres i Visma.net.':
    'The Visma.net integration connects Visma.net ERP to Shopify so that products, prices and inventory come from the ERP, and orders and customers go back as sales orders. We build the flow against the Visma.net API, with queue and retry, because the volume and error handling in ERP projects demand it. Invoicing and delivery are managed in Visma.net.',
  'Visma.net som ERP og fasit for varer og lager, Shopify som salgskanal. Ordre og kunder tilbake via API.':
    'Visma.net as the ERP and source of truth for products and inventory, Shopify as the sales channel. Orders and customers back via API.',
  'Visma.net er Visma sitt skybaserte ERP for mellomstore selskaper, med eget API for varer, lager, kunder og salgsordre.':
    "Visma.net is Visma's cloud ERP for mid-sized companies, with its own API for products, inventory, customers and sales orders.",
  'Med ERP som fasit må nettbutikken oppdateres når lageret endres, og ordrene må inn i ERP uten at noen punsher dem.':
    'With the ERP as the source of truth, the online store has to update when stock changes, and orders have to reach the ERP without anyone keying them in.',
  'Visma.net med API-tilgang': 'Visma.net with API access',
  'Varenummer og lokasjoner avklart': 'Product numbers and locations agreed',

  // --- Vuuh ---
  'Vuuh for Shopify': 'Vuuh for Shopify',
  'Vuuh-integrasjonen henter produktdata, bilder og lager fra merkevarene dine via Vuuh sin offisielle Shopify-app, så butikken slipper å legge inn leverandørenes produkter manuelt. Vi setter opp appen, mapping av merkenes kategorier til dine kolleksjoner, regler for hva som publiseres, og sjekker at varianter og strekkoder stemmer før første import.':
    "The Vuuh integration pulls product data, images and inventory from your brands through Vuuh's official Shopify app, so the store does not have to enter suppliers' products by hand. We set up the app, map the brands' categories to your collections, set rules for what gets published, and check that variants and barcodes match before the first import.",
  'Produktdata og lager fra leverandørene via Vuuh, rett inn i Shopify.':
    'Product data and inventory from your suppliers via Vuuh, straight into Shopify.',
  'Vuuh er en nordisk plattform der merkevarer deler produktdata med forhandlere. Shopify-appen er offisiell og plug-and-play.':
    'Vuuh is a Nordic platform where brands share product data with retailers. The Shopify app is official and plug-and-play.',
  'Forhandlere med mange merker bruker dager på produktdata. Vuuh leverer dem ferdig.':
    'Retailers with many brands spend days on product data. Vuuh delivers it ready-made.',
  'Vuuh-konto': 'Vuuh account',
  'Merker som er på Vuuh': 'Brands that are on Vuuh',
}

const missing = new Set<string>()
const tr = (s: string | undefined | null): string | undefined | null => {
  if (s == null || s === '') return s
  if (T[s] !== undefined) return T[s]
  missing.add(s)
  return s
}
const trBlocks = (blocks: Doc[] | undefined | null) =>
  Array.isArray(blocks)
    ? blocks.map((b) => (b._type === 'block' && Array.isArray(b.children)
      ? { ...b, children: b.children.map((c: Doc) => (c._type === 'span' ? { ...c, text: tr(c.text) } : c)) }
      : b))
    : blocks

const weak = (id: string, key?: string) => ({ _type: 'reference', _ref: id, _weak: true, ...(key ? { _key: key } : {}) })
const enId = (noId: string) => noId.replace(/-no$/, '-en')

async function resolveRelated(noRef: string): Promise<string | null> {
  if (/-no$/.test(noRef)) return enId(noRef)
  if (RELATED_MAP[noRef]) return RELATED_MAP[noRef]
  const en = await client.fetch<string | null>(
    '*[_type == "translation.metadata" && references($id)][0].translations[_key == "en"][0].value._ref', { id: noRef })
  return en || null
}

function buildEn(no: Doc, related: Doc[]): Doc {
  const { _rev, _createdAt, _updatedAt, ...rest } = no
  const catKey = (no.category?._ref as string | undefined)?.match(/^integration-cat-(.+)-no$/)?.[1]
  if (!catKey) throw new Error(`${no._id}: cannot derive category key from ${no.category?._ref}`)
  return {
    ...rest,
    _id: enId(no._id),
    language: 'en',
    slug: { _type: 'slug', current: (no.slug?.current as string).replace(/^integrasjoner\//, 'integrations/') },
    pageTitle: tr(no.pageTitle),
    definition: tr(no.definition),
    shortDescription: tr(no.shortDescription),
    intro: trBlocks(no.intro) ?? [],
    whatItIs: trBlocks(no.whatItIs),
    whyItMatters: trBlocks(no.whyItMatters),
    sections: (no.sections ?? []).map((s: Doc) => ({ ...s, heading: tr(s.heading), anchor: tr(s.anchor), body: trBlocks(s.body) })),
    implementationSteps: (no.implementationSteps ?? []).map((s: Doc) => ({ ...s, name: tr(s.name), text: tr(s.text) })),
    prerequisites: (no.prerequisites ?? []).map((p: string) => tr(p)),
    notIncluded: (no.notIncluded ?? []).map((p: string) => tr(p)),
    faq: (no.faq ?? []).map((f: Doc) => ({ ...f, question: tr(f.question), answer: tr(f.answer) })),
    cta: no.cta ? { ...no.cta, heading: tr(no.cta.heading), text: tr(no.cta.text), buttonLabel: tr(no.cta.buttonLabel), buttonHref: '/contact' } : undefined,
    dataFlowSteps: (no.dataFlowSteps ?? []).map((d: Doc) => ({ ...d, payload: tr(d.payload), frequency: tr(d.frequency) })),
    ...(no.seoExtended ? { seoExtended: { ...no.seoExtended, metaTitle: tr(no.seoExtended.metaTitle), metaDescription: tr(no.seoExtended.metaDescription) } } : {}),
    category: weak(`integration-cat-${catKey}-en`),
    pillar: weak('pillar-integrasjoner-en'),
    clusterLinks: (no.clusterLinks ?? []).map((r: Doc) => weak(enId(r._ref), r._key)),
    relatedPages: related,
    relatedCaseStudies: no.relatedCaseStudies ?? [],
  }
}

async function main() {
  const noIds = SLUGS.map((s) => `integration-${s}-no`)
  const noDocs = await client.fetch<Doc[]>('*[_id in $ids]', { ids: noIds })
  const found = new Set(noDocs.map((d) => d._id))
  for (const id of noIds) if (!found.has(id)) throw new Error(`missing Norwegian source ${id} in ${dataset}`)

  for (const slug of SLUGS) {
    const no = noDocs.find((d) => d._id === `integration-${slug}-no`)!
    const related: Doc[] = []
    for (const r of no.relatedPages ?? []) {
      const en = await resolveRelated(r._ref)
      if (en) related.push(weak(en, r._key))
      else console.warn(dataset, no._id, 'dropping unresolved related ref', r._ref)
    }
    const en = buildEn(no, related)
    if (missing.size) {
      console.error('Untranslated strings:\n' + [...missing].map((s) => `  ${JSON.stringify(s)}`).join('\n'))
      throw new Error(`${missing.size} untranslated string(s) in ${no._id}`)
    }
    if (!DRY) await client.createOrReplace(en as any)
    console.log(dataset, DRY ? 'would write' : 'wrote', en._id, `(${String(en.definition).trim().split(/\s+/).length} words in definition)`, en.slug.current)

    const metaId = `integration-${slug}-meta`
    if (!DRY) await client.createOrReplace({
      _id: metaId, _type: 'translation.metadata', schemaTypes: ['integrationPage'], translations: [
        { _key: 'no', value: { _type: 'reference', _ref: no._id, _weak: true, _strengthenOnPublish: { type: 'integrationPage' } } },
        { _key: 'en', value: { _type: 'reference', _ref: en._id, _weak: true, _strengthenOnPublish: { type: 'integrationPage' } } },
      ],
    })
    console.log(dataset, DRY ? 'would write' : 'wrote', metaId)
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
