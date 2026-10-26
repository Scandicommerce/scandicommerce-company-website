// TARGET_DATASET=production npx sanity exec scripts/sanity-integrations-da-3.ts --with-user-token
// Creates Danish versions (-da) of 11 Norwegian integrationPage documents (batch 3:
// profrakt, quickship, shopify-pos, sparklayer, tracklution, trimit, tripletex, unimicro,
// vipps-hurtigkasse, visma-net, vuuh) and adds the da entry to the existing
// translation.metadata (integration-<x>-meta).
// Idempotent: fetches each -no document, translates every text field through the T table
// below (the script fails loudly on any string it has no translation for), rewrites
// references to the -da counterparts (weak), and createOrReplace-s on fixed ids.
// Metadata is only patched when no 'da' key exists. DRY_RUN=1 builds and validates
// everything but writes nothing.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const DRY = process.env.DRY_RUN === '1' // DRY_RUN=1 builds and validates everything but writes nothing
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

const SLUGS = ['profrakt', 'quickship', 'shopify-pos', 'sparklayer', 'tracklution', 'trimit', 'tripletex', 'unimicro', 'vipps-hurtigkasse', 'visma-net', 'vuuh']

// ---------------------------------------------------------------------------
// Translation table: every Norwegian string that appears in a text field of the
// 11 documents, mapped to idiomatic Danish. Facts are kept as they are in Norwegian:
// Tripletex is one-way Shopify → Tripletex and invoices are created but not sent
// automatically; Omnium is in; no prices; Vipps stays Norwegian (no Danish availability claims).
// ---------------------------------------------------------------------------
const T: Record<string, string> = {
  // --- shared: CTA ---
  'Book en samtale': 'Book en samtale',
  'Fortell oss hvilke systemer du har, så får du metode, dataflyt og tidsplan innen to virkedager.':
    'Fortæl os, hvilke systemer I har, så får I metode, dataflow og tidsplan inden for to hverdage.',
  'Kjører dere Profrakt i dag?': 'Kører I Profrakt i dag?',
  'Kjører dere Quickship i dag?': 'Kører I Quickship i dag?',
  'Kjører dere Shopify POS i dag?': 'Kører I Shopify POS i dag?',
  'Kjører dere SparkLayer i dag?': 'Kører I SparkLayer i dag?',
  'Kjører dere Tracklution i dag?': 'Kører I Tracklution i dag?',
  'Kjører dere TRIMIT i dag?': 'Kører I TRIMIT i dag?',
  'Kjører dere Tripletex i dag?': 'Kører I Tripletex i dag?',
  'Kjører dere UniMicro i dag?': 'Kører I UniMicro i dag?',
  'Kjører dere Vipps i dag?': 'Kører I Vipps i dag?',
  'Kjører dere Visma.net i dag?': 'Kører I Visma.net i dag?',
  'Kjører dere Vuuh i dag?': 'Kører I Vuuh i dag?',

  // --- shared: FAQ ---
  'Ja. Make.com-scenarioer ligger i din konto, og kode leveres med kildekode. Vi drifter om du vil, men du er ikke låst til oss.':
    'Ja. Make.com-scenarier ligger i jeres egen konto, og kode leveres med kildekode. Vi drifter det, hvis I ønsker, men I er ikke låst til os.',
  'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen. Det finnes ingen automatisk tilbakerulling, og det sier vi rett ut.':
    'Hver kørsel ligger i historikken med ind- og uddata. Fejl meldes med reference, og vi rydder op sammen. Der findes ingen automatisk tilbagerulning, og det siger vi ligeud.',
  'Ja. De fleste starter med én flyt, for eksempel ordre, og legger til lager eller kunder etterpå.':
    'Ja. De fleste starter med ét flow, for eksempel ordrer, og tilføjer lager eller kunder bagefter.',
  'Make.com-flyter leveres på dager når kartleggingen er gjort. Egen kode tar lenger, og vi gir tidsplan etter første samtale.':
    'Make.com-flows leveres på få dage, når kortlægningen er på plads. Egen kode tager længere tid, og vi giver en tidsplan efter den første samtale.',
  'Hva skjer når en kjøring feiler?': 'Hvad sker der, når en kørsel fejler?',
  'Hvor lang tid tar oppsettet?': 'Hvor lang tid tager opsætningen?',
  'Eier vi integrasjonen mot Profrakt selv?': 'Ejer vi selv integrationen til Profrakt?',
  'Eier vi integrasjonen mot Quickship selv?': 'Ejer vi selv integrationen til Quickship?',
  'Eier vi integrasjonen mot Shopify POS selv?': 'Ejer vi selv integrationen til Shopify POS?',
  'Eier vi integrasjonen mot SparkLayer selv?': 'Ejer vi selv integrationen til SparkLayer?',
  'Eier vi integrasjonen mot Tracklution selv?': 'Ejer vi selv integrationen til Tracklution?',
  'Eier vi integrasjonen mot TRIMIT selv?': 'Ejer vi selv integrationen til TRIMIT?',
  'Eier vi integrasjonen mot UniMicro selv?': 'Ejer vi selv integrationen til UniMicro?',
  'Eier vi integrasjonen mot Vipps selv?': 'Ejer vi selv integrationen til Vipps?',
  'Eier vi integrasjonen mot Visma.net selv?': 'Ejer vi selv integrationen til Visma.net?',
  'Eier vi integrasjonen mot Vuuh selv?': 'Ejer vi selv integrationen til Vuuh?',
  'Kan vi starte med frakt og utvide senere?': 'Kan vi starte med fragt og udvide senere?',
  'Kan vi starte med kasse og utvide senere?': 'Kan vi starte med kassen og udvide senere?',
  'Kan vi starte med B2B og utvide senere?': 'Kan vi starte med B2B og udvide senere?',
  'Kan vi starte med sporing og utvide senere?': 'Kan vi starte med tracking og udvide senere?',
  'Kan vi starte med lagersynk og utvide senere?': 'Kan vi starte med lagersynkronisering og udvide senere?',
  'Kan vi starte med vareflyt og utvide senere?': 'Kan vi starte med vareflowet og udvide senere?',
  'Kan vi starte med betaling og utvide senere?': 'Kan vi starte med betaling og udvide senere?',
  'Kan vi starte med ERP og utvide senere?': 'Kan vi starte med ERP og udvide senere?',
  'Kan vi starte med produktdata og utvide senere?': 'Kan vi starte med produktdata og udvide senere?',

  // --- shared: implementation steps ---
  'Kartlegging': 'Kortlægning',
  'Oppsett': 'Opsætning',
  'Test på reelle data': 'Test på rigtige data',
  'Go-live og overvåking': 'Go-live og overvågning',
  'Tilkobling i din egen konto, mapping av felt, og testdata gjennom hele flyten.':
    'Tilslutning i jeres egen konto, mapping af felter og testdata gennem hele flowet.',
  'De første ordrene eller produktene følges manuelt før vi slår på alt.':
    'De første ordrer eller produkter følges manuelt, før vi slår alt til.',
  'Vi følger de første ukene. Feil varsles med referanse til ordren.':
    'Vi følger med de første uger. Fejl meldes med reference til ordren.',
  'Hva som skal flyte mellom Shopify og Profrakt, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Hvad der skal flyde mellem Shopify og Profrakt, hvilket system der er master for hvad, og hvad der sker ved fejl. Én arbejdssession.',
  'Hva som skal flyte mellom Shopify og Quickship, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Hvad der skal flyde mellem Shopify og Quickship, hvilket system der er master for hvad, og hvad der sker ved fejl. Én arbejdssession.',
  'Hva som skal flyte mellom Shopify og SparkLayer, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Hvad der skal flyde mellem Shopify og SparkLayer, hvilket system der er master for hvad, og hvad der sker ved fejl. Én arbejdssession.',
  'Hva som skal flyte mellom Shopify og Tracklution, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Hvad der skal flyde mellem Shopify og Tracklution, hvilket system der er master for hvad, og hvad der sker ved fejl. Én arbejdssession.',
  'Hva som skal flyte mellom Shopify og TRIMIT, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Hvad der skal flyde mellem Shopify og TRIMIT, hvilket system der er master for hvad, og hvad der sker ved fejl. Én arbejdssession.',
  'Hva som skal flyte mellom Shopify og UniMicro, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Hvad der skal flyde mellem Shopify og UniMicro, hvilket system der er master for hvad, og hvad der sker ved fejl. Én arbejdssession.',
  'Hva som skal flyte mellom Shopify og Vipps, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Hvad der skal flyde mellem Shopify og Vipps, hvilket system der er master for hvad, og hvad der sker ved fejl. Én arbejdssession.',
  'Hva som skal flyte mellom Shopify og Visma.net, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Hvad der skal flyde mellem Shopify og Visma.net, hvilket system der er master for hvad, og hvad der sker ved fejl. Én arbejdssession.',
  'Hva som skal flyte mellom Shopify og Vuuh, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Hvad der skal flyde mellem Shopify og Vuuh, hvilket system der er master for hvad, og hvad der sker ved fejl. Én arbejdssession.',

  // --- shared: data flow frequencies and payloads ---
  'sanntid': 'realtid',
  'daglig': 'dagligt',
  'løpende': 'løbende',
  'hvert 15. min': 'hvert 15. minut',
  'ved knapp': 'ved tryk på knap',
  'ved pakking': 'ved pakning',
  'månedlig, valgfritt': 'månedligt, valgfrit',
  'mottaker + kolli → etikett': 'modtager + kolli → label',
  'sporingsnummer': 'trackingnummer',
  'fraktvalg': 'fragtvalg',
  'etikett': 'label',
  'sporing': 'tracking',
  'salg + kunder + lager': 'salg + kunder + lager',
  'dagsoppgjør': 'dagsafregning',
  'B2B-ordre': 'B2B-ordrer',
  'ordre': 'ordrer',
  'kjøp + hendelser': 'køb + hændelser',
  'konverteringer': 'konverteringer',
  'lagerbeholdning per variant': 'lagerbeholdning pr. variant',
  'ordre + kunde': 'ordre + kunde',
  'faktura opprettes, sendes ikke': 'faktura oprettes, sendes ikke',
  'refusjon → kreditnota': 'refusion → kreditnota',
  'samlebilag': 'samlebilag',
  'varer + lager': 'varer + lager',
  'ordre + kunder': 'ordrer + kunder',
  'betalt ordre + kunde': 'betalt ordre + kunde',
  'oppgjør': 'afregning',
  'produkter + bilder + lager': 'produkter + billeder + lager',

  // --- Profrakt ---
  'Profrakt-integrasjon for Shopify': 'Profrakt-integration til Shopify',
  'Profrakt-integrasjonen bestiller fraktetikett fra Profrakt når en ordre eller booking er klar, og legger sporingsnummeret tilbake på forsendelsen. Den kjører som Make.com-flyt og kan utløses fra Shopify, eller fra et annet system som Podio når leien skal sendes, ikke når den bestilles.':
    'Profrakt-integrationen bestiller fragtlabel fra Profrakt, når en ordre eller booking er klar, og lægger trackingnummeret tilbage på forsendelsen. Den kører som Make.com-flow og kan udløses fra Shopify eller fra et andet system som Podio, når lejen skal sendes, ikke når den bestilles.',
  'Fraktetiketter bestilt fra ordren eller fra bookingsystemet, sporing tilbake på forsendelsen.':
    'Fragtlabels bestilt fra ordren eller fra bookingsystemet, tracking tilbage på forsendelsen.',
  'Profrakt er en norsk fraktportal med avtaler hos flere transportører. Integrasjonen kaller Profrakt sitt API med mottaker og kolli, og får etikett og sporing tilbake.':
    'Profrakt er en norsk fragtportal med aftaler hos flere transportører. Integrationen kalder Profrakts API med modtager og kolli og får label og tracking retur.',
  'Utleie og bestillinger med leveringsdato passer ikke i standard fraktapper, som sender med en gang ordren er betalt.':
    'Udlejning og bestillinger med leveringsdato passer ikke i standard-fragtapps, som sender, så snart ordren er betalt.',
  'Profrakt-konto med API': 'Profrakt-konto med API',
  'Shopify eller bookingsystem': 'Shopify eller bookingsystem',
  'Make.com-konto': 'Make.com-konto',

  // --- Quickship ---
  'Quickship for Shopify': 'Quickship til Shopify',
  'Quickship-integrasjonen gir fraktvalg og etiketter for B2B-sendinger fra Shopify, inkludert pall og stykkgods som vanlige fraktapper ikke dekker. Vi setter opp appen, fraktregler per kundegruppe og vekt, etikettflyten fra ordren til pakking, og kobler sporing tilbake til ordren så forhandleren ser når pallen er på vei.':
    'Quickship-integrationen giver fragtvalg og labels til B2B-forsendelser fra Shopify, inklusive paller og stykgods, som almindelige fragtapps ikke dækker. Vi sætter appen op, fragtregler pr. kundegruppe og vægt, labelflowet fra ordre til pakning, og kobler tracking tilbage til ordren, så forhandleren kan se, når pallen er på vej.',
  'Fraktvalg og etiketter for B2B-sendinger med pall og stykkgods.':
    'Fragtvalg og labels til B2B-forsendelser med paller og stykgods.',
  'Quickship er en norsk fraktløsning rettet mot bedrifter. Shopify-appen gir priser i kassen og etiketter fra ordren.':
    'Quickship er en norsk fragtløsning rettet mod virksomheder. Shopify-appen giver priser i kassen og labels fra ordren.',
  'B2B-ordre er tyngre og går på pall. Fraktvalg må reflektere det.':
    'B2B-ordrer er tungere og går på paller. Fragtvalgene skal afspejle det.',
  'Quickship-konto': 'Quickship-konto',
  'Shopify': 'Shopify',
  'Fraktregler per kundegruppe': 'Fragtregler pr. kundegruppe',

  // --- Shopify POS ---
  'Shopify POS, fra PCKasse til én kasse': 'Shopify POS, fra PCKasse til ét kassesystem',
  'Shopify POS gir butikken samme varelager, kunder og gavekort som nettbutikken. Vi setter opp kassen, maskinvare og betalingsterminal, flytter kunder og gavekortsaldo fra PCKasse eller Front, og lærer opp butikkteamet før lansering. Regnskapet får ett salg per dag per butikk.':
    'Shopify POS giver den fysiske butik samme varelager, kunder og gavekort som webshoppen. Vi sætter kassen op sammen med hardware og betalingsterminal, flytter kunder og gavekortsaldi fra PCKasse eller Front og oplærer butiksteamet inden lanceringen. Regnskabet får ét salg pr. dag pr. butik.',
  'Butikk og nett i samme system. Vi flytter kunder, gavekort og varer fra PCKasse og setter opp kassen.':
    'Butik og web i samme system. Vi flytter kunder, gavekort og varer fra PCKasse og sætter kassen op.',
  'Shopify POS er Shopify sitt eget kassesystem. Det erstatter PCKasse for butikker som vil ha én plattform, og oppfyller kassasystemlova når det er satt opp riktig.':
    'Shopify POS er Shopifys eget kassesystem. Det erstatter PCKasse for butikker, der vil have én platform, og opfylder den norske kassesystemlov (kassasystemlova), når det er sat rigtigt op.',
  'To systemer for butikk og nett betyr dobbelt lager, dobbelt kunderegister og gavekort som ikke virker på tvers.':
    'To systemer til butik og web betyder dobbelt lager, dobbelt kunderegister og gavekort, der ikke virker på tværs.',
  'Gammelt kassesystem, Z-rapport-vaner, gavekortsaldo og kundedata som skal med.':
    'Gammelt kassesystem, Z-rapport-vaner, gavekortsaldi og kundedata, der skal med.',
  'Lokasjoner, maskinvare, betalingsterminal og kvitteringsoppsett.': 'Lokationer, hardware, betalingsterminal og kvitteringsopsætning.',
  'Flytting': 'Flytning',
  'Kunder og gavekort fra PCKasse, varer med strekkoder.': 'Kunder og gavekort fra PCKasse, varer med stregkoder.',
  'Opplæring og go-live': 'Oplæring og go-live',
  'Butikkteamet lærer kassen, vi er til stede første dag.': 'Butiksteamet lærer kassen at kende, og vi er til stede den første dag.',
  'Shopify-plan med POS Pro der det trengs': 'Shopify-plan med POS Pro, hvor det er nødvendigt',
  'Betalingsterminal som støttes i Norge': 'Betalingsterminal, der understøttes i Norge',
  'Eksport fra gammelt kassesystem': 'Eksport fra det gamle kassesystem',

  // --- SparkLayer ---
  'SparkLayer B2B for Shopify': 'SparkLayer B2B til Shopify',
  'SparkLayer legger en B2B-bestillingsflate oppå Shopify med kundespesifikke priser, minimumsantall, hurtigbestilling og bestillingslister for forhandlere. Vi setter opp prislister og kundegrupper, tilpasser visningen i temaet, og kobler B2B-ordrene videre til Omnium eller regnskapssystemet slik at de behandles likt med alle andre ordre.':
    'SparkLayer lægger en B2B-bestillingsflade oven på Shopify med kundespecifikke priser, minimumsantal, hurtigbestilling og bestillingslister til forhandlere. Vi sætter prislister og kundegrupper op, tilpasser visningen i temaet og kobler B2B-ordrerne videre til Omnium eller regnskabssystemet, så de behandles ligesom alle andre ordrer.',
  'B2B-portal på Shopify med kundepriser, bestillingslister og ordre som flyter videre til OMS.':
    'B2B-portal på Shopify med kundepriser, bestillingslister og ordrer, der flyder videre til OMS.',
  'SparkLayer er en Shopify-app for B2B. Den erstatter ikke OMS, men gir forhandlerne en bestillingsportal på samme butikk som B2C.':
    'SparkLayer er en Shopify-app til B2B. Den erstatter ikke et OMS, men giver forhandlerne en bestillingsportal i samme butik som B2C.',
  'Forhandlere som bestiller på e-post koster tid. En portal med riktige priser gir ordre rett inn i flyten.':
    'Forhandlere, der bestiller på e-mail, koster tid. En portal med de rigtige priser sender ordrer direkte ind i flowet.',
  'Shopify Plus anbefalt': 'Shopify Plus anbefales',
  'Prislister per kundegruppe': 'Prislister pr. kundegruppe',
  'OMS eller regnskap for ordrene videre': 'OMS eller regnskab til ordrerne videre i flowet',

  // --- Tracklution ---
  'Tracklution server-side sporing for Shopify': 'Tracklution server-side tracking til Shopify',
  'Tracklution-integrasjonen sender kjøp og hendelser fra Shopify server-side til Meta, Google Ads og affiliate-nettverk, uavhengig av nettleserblokkering og samtykkevalg som stopper vanlige piksler. Vi skriver custom pixel i Shopify-kassen, kobler hendelsene til Tracklution med riktig samtykkehåndtering, og verifiserer at konverteringene i annonseplattformene stemmer mot ordrene i Shopify.':
    'Tracklution-integrationen sender køb og hændelser fra Shopify server-side til Meta, Google Ads og affiliate-netværk, uafhængigt af browserblokering og samtykkevalg, som stopper almindelige pixels. Vi skriver en custom pixel i Shopify-kassen, kobler hændelserne til Tracklution med korrekt samtykkehåndtering og verificerer, at konverteringerne i annonceplatformene stemmer med ordrerne i Shopify.',
  'Server-side sporing til Meta, Google og affiliate, med custom pixel i Shopify-kassen.':
    'Server-side tracking til Meta, Google og affiliate, med custom pixel i Shopify-kassen.',
  'Tracklution er en server-side sporingstjeneste. Shopify-kassen tillater bare custom pixels, så koblingen er kode vi skriver og vedlikeholder.':
    'Tracklution er en server-side trackingtjeneste. Shopify-kassen tillader kun custom pixels, så koblingen er kode, vi skriver og vedligeholder.',
  'Annonseplattformene ser ikke lenger alle kjøp fra nettleseren. Uten server-side sporing optimaliserer de på feil tall.':
    'Annonceplatformene ser ikke længere alle køb fra browseren. Uden server-side tracking optimerer de på forkerte tal.',
  'Tracklution-konto': 'Tracklution-konto',
  'Shopify med custom pixel-tilgang': 'Shopify med adgang til custom pixels',
  'Samtykkebanner': 'Samtykkebanner',

  // --- TRIMIT ---
  'TRIMIT-lagersynk for Shopify': 'TRIMIT-lagersynkronisering til Shopify',
  'TRIMIT-integrasjonen synker lagerbeholdning fra TRIMIT, ERP for mote og tekstil, til Shopify per variant og lokasjon. Den kjører som Make.com-scenario på fast intervall, slik at nettbutikken aldri selger varer som er utsolgt i ERP. Ordre går ikke tilbake i denne flyten.':
    'TRIMIT-integrationen synkroniserer lagerbeholdning fra TRIMIT, ERP til mode og tekstil, til Shopify pr. variant og lokation. Den kører som Make.com-scenarie med fast interval, så webshoppen aldrig sælger varer, der er udsolgt i ERP. Ordrer går ikke tilbage i dette flow.',
  'Lagersynk fra TRIMIT til Shopify for mote og tekstil med mange varianter.':
    'Lagersynkronisering fra TRIMIT til Shopify til mode og tekstil med mange varianter.',
  'TRIMIT er et ERP bygget på Microsoft Dynamics for mote, møbler og tekstil, med størrelse og farge som dimensjoner. Integrasjonen leser beholdning per variant og oppdaterer Shopify.':
    'TRIMIT er et ERP bygget på Microsoft Dynamics til mode, møbler og tekstil, med størrelse og farve som dimensioner. Integrationen læser beholdning pr. variant og opdaterer Shopify.',
  'Mote har mange varianter og raske utsalg. Feil lager i nettbutikken gir kanselleringer og dårlige anmeldelser.':
    'Mode har mange varianter og hurtige udsalg. Forkert lager i webshoppen giver annulleringer og dårlige anmeldelser.',
  'Ordre til TRIMIT. Kan legges til som egen flyt': 'Ordrer til TRIMIT. Kan tilføjes som separat flow',
  'TRIMIT med API-tilgang': 'TRIMIT med API-adgang',
  'Shopify med SKU per variant': 'Shopify med SKU pr. variant',

  // --- Tripletex ---
  'Tripletex-integrasjon for Shopify': 'Tripletex-integration til Shopify',
  'Tripletex-integrasjonen sender betalte Shopify-ordre til Tripletex som ordre og faktura med kunde, frakt og mva, enten per ordre eller som samlebilag per måned. Refusjoner i Shopify blir kreditnota. Flyten går én vei: Shopify er salgskanal, Tripletex er regnskap, og lager styres i Shopify. Den kjører som Make.com-scenario i din egen konto, og fakturaer sendes ikke før regnskapsfører har sett dem.':
    'Tripletex-integrationen sender betalte Shopify-ordrer til Tripletex som ordre og faktura med kunde, fragt og moms, enten pr. ordre eller som samlebilag pr. måned. Refusioner i Shopify bliver kreditnotaer. Flowet går én vej: Shopify er salgskanal, Tripletex er regnskab, og lageret styres i Shopify. Den kører som Make.com-scenarie i jeres konto, og fakturaer sendes ikke, før bogholderen har set dem.',
  'Ordre og kunder til Tripletex som faktura per ordre eller samlebilag per måned. Refusjoner blir kreditnota.':
    'Ordrer og kunder til Tripletex som faktura pr. ordre eller samlebilag pr. måned. Refusioner bliver til kreditnotaer.',
  'Tripletex er et norsk skybasert regnskapssystem for små og mellomstore selskaper. Integrasjonen gjør Shopify til salgskanal og Tripletex til regnskap, slik at ingen punsher ordre. Kunder og produkter opprettes i Tripletex første gang de dukker opp, og brukes igjen etterpå. Kundeoppslag skjer på e-post for B2C og organisasjonsnummer for B2B.':
    'Tripletex er et norsk cloudbaseret regnskabssystem til små og mellemstore virksomheder. Integrationen gør Shopify til salgskanal og Tripletex til regnskab, så ingen taster ordrer ind. Kunder og produkter oprettes i Tripletex, første gang de dukker op, og genbruges derefter. Kundeopslag sker på e-mail for B2C og organisationsnummer for B2B.',
  'Manuell bokføring av nettbutikkordre er den vanligste kilden til avvik i mva-meldingen. Med integrasjonen får regnskapsfører riktig grunnlag hver dag, med Shopify-ordrenummer som referanse på hver faktura og kreditnota. Fakturaen opprettes, men sendes ikke automatisk, så regnskapsfører beholder kontrollen.':
    'Manuel bogføring af webshopordrer er den mest almindelige kilde til afvigelser i momsangivelsen. Med integrationen får bogholderen korrekt grundlag hver dag, med Shopify-ordrenummer som reference på hver faktura og kreditnota. Fakturaen oprettes, men sendes ikke automatisk, så bogholderen beholder kontrollen.',
  'Kontoplan, mva-koder, kundegrupper, og om dere vil ha faktura per ordre eller samlebilag per måned. Én arbeidsøkt med regnskapsfører.':
    'Kontoplan, momskoder, kundegrupper, og om I vil have faktura pr. ordre eller samlebilag pr. måned. Én arbejdssession med bogholderen.',
  'Oppsett i Make.com': 'Opsætning i Make.com',
  'API-token fra Tripletex, tilkobling i din Make-konto, scenario fra vår mal med kunde- og produktoppslag.':
    'API-token fra Tripletex, tilslutning i jeres Make-konto, scenarie fra vores skabelon med kunde- og produktopslag.',
  'Test på reelle ordre': 'Test på rigtige ordrer',
  'De første ordrene gjennom hele flyten. Regnskapsfører godkjenner fakturaene før de sendes.':
    'De første ordrer gennem hele flowet. Bogholderen godkender fakturaerne, før de sendes.',
  'Vi følger de første ukene. Feilede kjøringer ligger synlig i Make-historikken og varsles med ordrenummer.':
    'Vi følger med de første uger. Fejlede kørsler ligger synligt i Make-historikken og meldes med ordrenummer.',
  'Tripletex med API-tilgang (ansatt-token)': 'Tripletex med API-adgang (medarbejder-token)',
  'Shopify eller Shopify Plus': 'Shopify eller Shopify Plus',
  'Make.com-konto i ditt navn, vi setter opp om du ikke har': 'Make.com-konto i jeres navn, vi sætter den op, hvis I ikke har en',
  'Kontoplan, mva-koder og forfall avklart med regnskapsfører': 'Kontoplan, momskoder og forfald afklaret med bogholderen',
  'SKU eller EAN på alle varianter, så produktoppslag treffer': 'SKU eller EAN på alle varianter, så produktopslag rammer rigtigt',
  'Lager. Shopify er fasit, eller Omnium om du trenger OMS': 'Lager. Shopify er master, eller Omnium hvis I har brug for et OMS',
  'Betalingsstatus tilbake. Shopify-ordre er allerede betalt når de sendes': 'Betalingsstatus retur. Shopify-ordrer er allerede betalt, når de sendes',
  'Kan vi bruke Tripletex sin egen Shopify-app i stedet?': "Kan vi bruge Tripletex' egen Shopify-app i stedet?",
  'Ja, for enkle B2C-butikker. Vår integrasjon er for deg som trenger samlebilag, B2B-faktura med org.nr, EDI via Omnium, egen mapping av mva og konto, eller fakturering som utløses av noe annet enn kassen.':
    'Ja, til simple B2C-butikker. Vores integration er til jer, der har brug for samlebilag, B2B-faktura med organisationsnummer, EDI via Omnium, egen mapping af moms og konto, eller fakturering, der udløses af noget andet end kassen.',
  'Synker dere lager fra Tripletex til Shopify?': 'Synkroniserer I lager fra Tripletex til Shopify?',
  'Nei. Shopify er fasit for lager i denne integrasjonen. Trenger du lagerstyring på tvers av kanaler, er Omnium eller Holio riktig verktøy, og de kobler vi til.':
    'Nej. Shopify er master for lager i denne integration. Har I brug for lagerstyring på tværs af kanaler, er Omnium eller Holio det rigtige værktøj, og dem kobler vi til.',
  'Sendes fakturaene automatisk til kunden?': 'Sendes fakturaerne automatisk til kunden?',
  'Nei. Fakturaen opprettes i Tripletex, og regnskapsfører sender den, eller setter opp Tripletex sin egen utsending. Det er et bevisst valg.':
    "Nej. Fakturaen oprettes i Tripletex, og bogholderen sender den eller sætter Tripletex' egen udsendelse op. Det er et bevidst valg.",
  'Eier vi Make.com-scenarioet?': 'Ejer vi Make.com-scenariet?',
  'Ja. Scenarioet og tilkoblingene ligger i din Make-konto. Vi drifter om du vil, men du er ikke låst.':
    'Ja. Scenariet og tilslutningerne ligger i jeres Make-konto. Vi drifter det, hvis I ønsker, men I er ikke låst.',

  // --- UniMicro ---
  'UniMicro-integrasjon for Shopify': 'UniMicro-integration til Shopify',
  'UniMicro-integrasjonen kobler Shopify til UniMicro slik at varer og lager kommer fra ERP til nettbutikken, og ordre og kunder går tilbake. Den settes opp med UniMicro sin Shopify-kobling, og vi gjør kartlegging, mapping, test og go-live som del av en migrering eller nybygg.':
    'UniMicro-integrationen kobler Shopify til UniMicro, så varer og lager kommer fra ERP til webshoppen, og ordrer og kunder går tilbage. Den sættes op med UniMicros egen Shopify-kobling, og vi står for kortlægning, mapping, test og go-live som en del af en migrering eller et nybyg.',
  'Varer, lager, ordre og kunder mellom Shopify og UniMicro, med ERP som fasit for lager.':
    'Varer, lager, ordrer og kunder mellem Shopify og UniMicro, med ERP som master for lager.',
  'UniMicro er et norsk økonomisystem med egen Shopify-kobling. Her er ERP fasit for varer og lager, i motsetning til Tripletex-oppsettet der Shopify er fasit.':
    'UniMicro er et norsk økonomisystem med egen Shopify-kobling. Her er ERP master for varer og lager, i modsætning til Tripletex-opsætningen, hvor Shopify er master.',
  'Butikker med fysisk lager og eget varesystem vil ikke vedlikeholde produkter to steder. Da må nettbutikken følge ERP.':
    'Butikker med fysisk lager og eget varesystem vil ikke vedligeholde produkter to steder. Så må webshoppen følge ERP.',
  'UniMicro med Shopify-kobling': 'UniMicro med Shopify-kobling',
  'Varenummer som stemmer begge steder': 'Varenumre, der stemmer begge steder',

  // --- Vipps ---
  'Vipps Hurtigkasse for Shopify': 'Vipps Hurtigkasse til Shopify',
  'Vipps Hurtigkasse lar kunden betale med ett trykk fra produktsiden, uten å fylle inn adresse. Vi setter opp Vipps sin Shopify-app, plasserer knappen riktig i tema og kasse, tester på mobil, og fører Vipps-oppgjøret mot egen betalingsmåte i regnskapet slik at bank og bokføring stemmer.':
    "Vipps Hurtigkasse lader kunden betale med ét tryk fra produktsiden uden at udfylde adresse. Vi sætter Vipps' Shopify-app op, placerer knappen rigtigt i tema og kasse, tester på mobil og fører Vipps-afregningen mod en egen betalingsmetode i regnskabet, så bank og bogføring stemmer.",
  'Ett trykk fra produktside til betalt ordre. Oppsett, test og go-live, og Vipps-oppgjør mot regnskapet.':
    'Ét tryk fra produktside til betalt ordre. Opsætning, test og go-live, og Vipps-afregning mod regnskabet.',
  'Vipps Hurtigkasse er en betalings- og kassemetode fra Vipps MobilePay. Kunden identifiseres med telefonnummer, og adresse og betaling hentes fra Vipps.':
    'Vipps Hurtigkasse er en betalings- og kassemetode fra Vipps MobilePay. Kunden identificeres med telefonnummer, og adresse og betaling hentes fra Vipps.',
  'Norske kunder forventer Vipps. Hurtigkasse fjerner skjemaet, og det er skjemaet som dreper konvertering på mobil.':
    'Norske kunder forventer Vipps. Hurtigkasse fjerner formularen, og det er formularen, der dræber konverteringen på mobil.',
  'Vipps-avtale for nettbutikk': 'Vipps-aftale til webshop',
  'Regnskap med egen betalingsmåte for Vipps': 'Regnskab med egen betalingsmetode til Vipps',

  // --- Visma.net ---
  'Visma.net-integrasjon for Shopify': 'Visma.net-integration til Shopify',
  'Visma.net-integrasjonen kobler Visma.net ERP til Shopify slik at varer, priser og lager kommer fra ERP, og ordre og kunder går tilbake som salgsordre. Vi bygger flyten mot Visma.net sitt API, med kø og retry, fordi volumet og feilhåndteringen i ERP-prosjekter krever det. Faktura og levering styres i Visma.net.':
    'Visma.net-integrationen kobler Visma.net ERP til Shopify, så varer, priser og lager kommer fra ERP, og ordrer og kunder går tilbage som salgsordrer. Vi bygger flowet mod Visma.nets API, med kø og retry, fordi volumen og fejlhåndteringen i ERP-projekter kræver det. Faktura og levering styres i Visma.net.',
  'Visma.net som ERP og fasit for varer og lager, Shopify som salgskanal. Ordre og kunder tilbake via API.':
    'Visma.net som ERP og master for varer og lager, Shopify som salgskanal. Ordrer og kunder retur via API.',
  'Visma.net er Visma sitt skybaserte ERP for mellomstore selskaper, med eget API for varer, lager, kunder og salgsordre.':
    'Visma.net er Vismas cloudbaserede ERP til mellemstore virksomheder, med eget API til varer, lager, kunder og salgsordrer.',
  'Med ERP som fasit må nettbutikken oppdateres når lageret endres, og ordrene må inn i ERP uten at noen punsher dem.':
    'Med ERP som master skal webshoppen opdateres, når lageret ændrer sig, og ordrerne skal ind i ERP, uden at nogen taster dem.',
  'Visma.net med API-tilgang': 'Visma.net med API-adgang',
  'Varenummer og lokasjoner avklart': 'Varenumre og lokationer afklaret',

  // --- Vuuh ---
  'Vuuh for Shopify': 'Vuuh til Shopify',
  'Vuuh-integrasjonen henter produktdata, bilder og lager fra merkevarene dine via Vuuh sin offisielle Shopify-app, så butikken slipper å legge inn leverandørenes produkter manuelt. Vi setter opp appen, mapping av merkenes kategorier til dine kolleksjoner, regler for hva som publiseres, og sjekker at varianter og strekkoder stemmer før første import.':
    'Vuuh-integrationen henter produktdata, billeder og lager fra jeres brands via Vuuhs officielle Shopify-app, så butikken slipper for at lægge leverandørernes produkter ind manuelt. Vi sætter appen op, mapper brandenes kategorier til jeres kollektioner, laver regler for, hvad der publiceres, og tjekker, at varianter og stregkoder stemmer før første import.',
  'Produktdata og lager fra leverandørene via Vuuh, rett inn i Shopify.':
    'Produktdata og lager fra leverandørerne via Vuuh, direkte ind i Shopify.',
  'Vuuh er en nordisk plattform der merkevarer deler produktdata med forhandlere. Shopify-appen er offisiell og plug-and-play.':
    'Vuuh er en nordisk platform, hvor brands deler produktdata med forhandlere. Shopify-appen er officiel og plug-and-play.',
  'Forhandlere med mange merker bruker dager på produktdata. Vuuh leverer dem ferdig.':
    'Forhandlere med mange brands bruger dage på produktdata. Vuuh leverer dem færdige.',
  'Vuuh-konto': 'Vuuh-konto',
  'Merker som er på Vuuh': 'Brands, der er på Vuuh',
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
const daId = (noId: string) => noId.replace(/-no$/, '-da')

// External (non -no suffixed) references → the Danish document of the same type, if any.
const extCache = new Map<string, string | null>()
async function resolveRelated(noRef: string): Promise<string | null> {
  if (/-no$/.test(noRef)) return daId(noRef)
  if (extCache.has(noRef)) return extCache.get(noRef)!
  const type = await client.fetch<string | null>('*[_id == $id][0]._type', { id: noRef })
  const da = type
    ? await client.fetch<string | null>('*[_type == $type && language == "da"][0]._id', { type })
    : null
  console.log(dataset, 'external', type ?? '(not found)', noRef, '→', da ?? '(none, skipped)')
  extCache.set(noRef, da)
  return da
}

function buildDa(no: Doc, related: Doc[]): Doc {
  const { _rev, _createdAt, _updatedAt, ...rest } = no
  const catKey = (no.category?._ref as string | undefined)?.match(/^integration-cat-(.+)-no$/)?.[1]
  if (!catKey) throw new Error(`${no._id}: cannot derive category key from ${no.category?._ref}`)
  return {
    ...rest,
    _id: daId(no._id),
    language: 'da',
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
    category: weak(`integration-cat-${catKey}-da`),
    pillar: weak('pillar-integrasjoner-da'),
    clusterLinks: (no.clusterLinks ?? []).map((r: Doc) => weak(daId(r._ref), r._key)),
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
      const da = await resolveRelated(r._ref)
      if (da) related.push(weak(da, r._key))
      else console.warn(dataset, no._id, 'dropping unresolved related ref', r._ref)
    }
    const da = buildDa(no, related)
    if (missing.size) {
      console.error('Untranslated strings:\n' + [...missing].map((s) => `  ${JSON.stringify(s)}`).join('\n'))
      throw new Error(`${missing.size} untranslated string(s) in ${no._id}`)
    }
    if (!DRY) await client.createOrReplace(da as { _id: string; _type: string } & Doc)
    console.log(dataset, DRY ? 'would write' : 'wrote', da._id, `(${String(da.definition).trim().split(/\s+/).length} words in definition)`, da.slug.current)

    const metaId = `integration-${slug}-meta`
    const meta = await client.fetch<Doc | null>('*[_id == $id][0]', { id: metaId })
    if (!meta) throw new Error(`${metaId} is missing; run the en script first`)
    if ((meta.translations ?? []).some((t: Doc) => t._key === 'da')) {
      console.log(dataset, metaId, 'already has da')
      continue
    }
    if (!DRY) await client.patch(metaId).insert('after', 'translations[-1]', [
      { _key: 'da', value: { _type: 'reference', _ref: da._id, _weak: true, _strengthenOnPublish: { type: 'integrationPage' } } },
    ]).commit()
    console.log(dataset, DRY ? 'would patch' : 'patched', metaId, 'with da')
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
