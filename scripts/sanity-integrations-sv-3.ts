// TARGET_DATASET=production npx sanity exec scripts/sanity-integrations-sv-3.ts --with-user-token
// Creates Swedish versions (-sv) of 11 Norwegian integrationPage documents (batch 3:
// profrakt, quickship, shopify-pos, sparklayer, tracklution, trimit, tripletex, unimicro,
// vipps-hurtigkasse, visma-net, vuuh) and adds the sv entry to each translation.metadata.
// Idempotent: fetches each -no document, translates every text field through the T table
// below (the script fails loudly on any string it has no translation for), rewrites
// references to the -sv counterparts (weak), and createOrReplace-s on fixed ids.
// The translation.metadata (integration-<x>-meta) already holds no + en; the sv entry is
// inserted with a PATCH after translations[-1] only when no 'sv' key exists yet.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const DRY = process.env.DRY_RUN === '1' // DRY_RUN=1 builds and validates everything but writes nothing
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

const SLUGS = ['profrakt', 'quickship', 'shopify-pos', 'sparklayer', 'tracklution', 'trimit', 'tripletex', 'unimicro', 'vipps-hurtigkasse', 'visma-net', 'vuuh']

// ---------------------------------------------------------------------------
// Translation table: every Norwegian string that appears in a text field of the
// 11 documents, mapped to idiomatic Swedish. Facts are kept as they are in Norwegian:
// Tripletex is one-way Shopify → Tripletex and invoices are created but not sent
// automatically; Omnium is in; no prices; Vipps stays Norwegian (no Swedish
// availability claims).
// ---------------------------------------------------------------------------
const T: Record<string, string> = {
  // --- shared: CTA ---
  'Book en samtale': 'Boka ett samtal',
  'Fortell oss hvilke systemer du har, så får du metode, dataflyt og tidsplan innen to virkedager.':
    'Berätta vilka system ni har, så får ni metod, dataflöde och tidsplan inom två arbetsdagar.',
  'Kjører dere Profrakt i dag?': 'Kör ni Profrakt idag?',
  'Kjører dere Quickship i dag?': 'Kör ni Quickship idag?',
  'Kjører dere Shopify POS i dag?': 'Kör ni Shopify POS idag?',
  'Kjører dere SparkLayer i dag?': 'Kör ni SparkLayer idag?',
  'Kjører dere Tracklution i dag?': 'Kör ni Tracklution idag?',
  'Kjører dere TRIMIT i dag?': 'Kör ni TRIMIT idag?',
  'Kjører dere Tripletex i dag?': 'Kör ni Tripletex idag?',
  'Kjører dere UniMicro i dag?': 'Kör ni UniMicro idag?',
  'Kjører dere Vipps i dag?': 'Kör ni Vipps idag?',
  'Kjører dere Visma.net i dag?': 'Kör ni Visma.net idag?',
  'Kjører dere Vuuh i dag?': 'Kör ni Vuuh idag?',

  // --- shared: FAQ ---
  'Ja. Make.com-scenarioer ligger i din konto, og kode leveres med kildekode. Vi drifter om du vil, men du er ikke låst til oss.':
    'Ja. Make.com-scenarierna ligger i ert konto, och kod levereras med källkod. Vi driftar om ni vill, men ni är inte låsta till oss.',
  'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen. Det finnes ingen automatisk tilbakerulling, og det sier vi rett ut.':
    'Varje körning ligger i historiken med in- och utdata. Fel flaggas med referens, och vi städar upp tillsammans. Det finns ingen automatisk återställning, och det säger vi rakt ut.',
  'Ja. De fleste starter med én flyt, for eksempel ordre, og legger til lager eller kunder etterpå.':
    'Ja. De flesta börjar med ett flöde, till exempel order, och lägger till lager eller kunder efteråt.',
  'Make.com-flyter leveres på dager når kartleggingen er gjort. Egen kode tar lenger, og vi gir tidsplan etter første samtale.':
    'Make.com-flöden levereras på några dagar när kartläggningen är gjord. Egen kod tar längre tid, och vi ger en tidsplan efter första samtalet.',
  'Hva skjer når en kjøring feiler?': 'Vad händer när en körning misslyckas?',
  'Hvor lang tid tar oppsettet?': 'Hur lång tid tar uppsättningen?',
  'Eier vi integrasjonen mot Profrakt selv?': 'Äger vi integrationen mot Profrakt själva?',
  'Eier vi integrasjonen mot Quickship selv?': 'Äger vi integrationen mot Quickship själva?',
  'Eier vi integrasjonen mot Shopify POS selv?': 'Äger vi integrationen mot Shopify POS själva?',
  'Eier vi integrasjonen mot SparkLayer selv?': 'Äger vi integrationen mot SparkLayer själva?',
  'Eier vi integrasjonen mot Tracklution selv?': 'Äger vi integrationen mot Tracklution själva?',
  'Eier vi integrasjonen mot TRIMIT selv?': 'Äger vi integrationen mot TRIMIT själva?',
  'Eier vi integrasjonen mot UniMicro selv?': 'Äger vi integrationen mot UniMicro själva?',
  'Eier vi integrasjonen mot Vipps selv?': 'Äger vi integrationen mot Vipps själva?',
  'Eier vi integrasjonen mot Visma.net selv?': 'Äger vi integrationen mot Visma.net själva?',
  'Eier vi integrasjonen mot Vuuh selv?': 'Äger vi integrationen mot Vuuh själva?',
  'Kan vi starte med frakt og utvide senere?': 'Kan vi börja med frakt och utöka senare?',
  'Kan vi starte med kasse og utvide senere?': 'Kan vi börja med kassan och utöka senare?',
  'Kan vi starte med B2B og utvide senere?': 'Kan vi börja med B2B och utöka senare?',
  'Kan vi starte med sporing og utvide senere?': 'Kan vi börja med spårning och utöka senare?',
  'Kan vi starte med lagersynk og utvide senere?': 'Kan vi börja med lagersynk och utöka senare?',
  'Kan vi starte med vareflyt og utvide senere?': 'Kan vi börja med produktflödet och utöka senare?',
  'Kan vi starte med betaling og utvide senere?': 'Kan vi börja med betalning och utöka senare?',
  'Kan vi starte med ERP og utvide senere?': 'Kan vi börja med ERP och utöka senare?',
  'Kan vi starte med produktdata og utvide senere?': 'Kan vi börja med produktdata och utöka senare?',

  // --- shared: implementation steps ---
  'Kartlegging': 'Kartläggning',
  'Oppsett': 'Uppsättning',
  'Test på reelle data': 'Test på riktiga data',
  'Go-live og overvåking': 'Go-live och övervakning',
  'Tilkobling i din egen konto, mapping av felt, og testdata gjennom hele flyten.':
    'Anslutning i ert eget konto, mappning av fält och testdata genom hela flödet.',
  'De første ordrene eller produktene følges manuelt før vi slår på alt.':
    'De första orderna eller produkterna följs manuellt innan vi slår på allt.',
  'Vi følger de første ukene. Feil varsles med referanse til ordren.':
    'Vi följer de första veckorna. Fel flaggas med referens till ordern.',
  'Hva som skal flyte mellom Shopify og Profrakt, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Vad som ska flöda mellan Shopify och Profrakt, vilket system som är master för vad, och vad som händer vid fel. Ett arbetspass.',
  'Hva som skal flyte mellom Shopify og Quickship, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Vad som ska flöda mellan Shopify och Quickship, vilket system som är master för vad, och vad som händer vid fel. Ett arbetspass.',
  'Hva som skal flyte mellom Shopify og SparkLayer, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Vad som ska flöda mellan Shopify och SparkLayer, vilket system som är master för vad, och vad som händer vid fel. Ett arbetspass.',
  'Hva som skal flyte mellom Shopify og Tracklution, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Vad som ska flöda mellan Shopify och Tracklution, vilket system som är master för vad, och vad som händer vid fel. Ett arbetspass.',
  'Hva som skal flyte mellom Shopify og TRIMIT, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Vad som ska flöda mellan Shopify och TRIMIT, vilket system som är master för vad, och vad som händer vid fel. Ett arbetspass.',
  'Hva som skal flyte mellom Shopify og UniMicro, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Vad som ska flöda mellan Shopify och UniMicro, vilket system som är master för vad, och vad som händer vid fel. Ett arbetspass.',
  'Hva som skal flyte mellom Shopify og Vipps, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Vad som ska flöda mellan Shopify och Vipps, vilket system som är master för vad, och vad som händer vid fel. Ett arbetspass.',
  'Hva som skal flyte mellom Shopify og Visma.net, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Vad som ska flöda mellan Shopify och Visma.net, vilket system som är master för vad, och vad som händer vid fel. Ett arbetspass.',
  'Hva som skal flyte mellom Shopify og Vuuh, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.':
    'Vad som ska flöda mellan Shopify och Vuuh, vilket system som är master för vad, och vad som händer vid fel. Ett arbetspass.',

  // --- shared: data flow frequencies and payloads ---
  'sanntid': 'realtid',
  'daglig': 'dagligen',
  'løpende': 'löpande',
  'hvert 15. min': 'var 15:e min',
  'ved knapp': 'vid knapptryck',
  'ved pakking': 'vid packning',
  'månedlig, valgfritt': 'månadsvis, valfritt',
  'mottaker + kolli → etikett': 'mottagare + kolli → etikett',
  'sporingsnummer': 'spårningsnummer',
  'fraktvalg': 'fraktalternativ',
  'etikett': 'etikett',
  'sporing': 'spårning',
  'salg + kunder + lager': 'försäljning + kunder + lager',
  'dagsoppgjør': 'dagsavslut',
  'B2B-ordre': 'B2B-order',
  'ordre': 'order',
  'kjøp + hendelser': 'köp + händelser',
  'konverteringer': 'konverteringar',
  'lagerbeholdning per variant': 'lagersaldo per variant',
  'ordre + kunde': 'order + kund',
  'faktura opprettes, sendes ikke': 'faktura skapas, skickas inte',
  'refusjon → kreditnota': 'återbetalning → kreditnota',
  'samlebilag': 'samlingsverifikat',
  'varer + lager': 'artiklar + lager',
  'ordre + kunder': 'order + kunder',
  'betalt ordre + kunde': 'betald order + kund',
  'oppgjør': 'avräkning',
  'produkter + bilder + lager': 'produkter + bilder + lager',

  // --- Profrakt ---
  'Profrakt-integrasjon for Shopify': 'Profrakt-integration för Shopify',
  'Profrakt-integrasjonen bestiller fraktetikett fra Profrakt når en ordre eller booking er klar, og legger sporingsnummeret tilbake på forsendelsen. Den kjører som Make.com-flyt og kan utløses fra Shopify, eller fra et annet system som Podio når leien skal sendes, ikke når den bestilles.':
    'Profrakt-integrationen beställer fraktetikett från Profrakt när en order eller bokning är klar, och lägger tillbaka spårningsnumret på försändelsen. Den körs som Make.com-flöde och kan utlösas från Shopify, eller från ett annat system som Podio när hyran ska skickas, inte när den bokas.',
  'Fraktetiketter bestilt fra ordren eller fra bookingsystemet, sporing tilbake på forsendelsen.':
    'Fraktetiketter beställda från ordern eller från bokningssystemet, spårning tillbaka på försändelsen.',
  'Profrakt er en norsk fraktportal med avtaler hos flere transportører. Integrasjonen kaller Profrakt sitt API med mottaker og kolli, og får etikett og sporing tilbake.':
    'Profrakt är en norsk fraktportal med avtal hos flera transportörer. Integrationen anropar Profrakts API med mottagare och kolli, och får etikett och spårning tillbaka.',
  'Utleie og bestillinger med leveringsdato passer ikke i standard fraktapper, som sender med en gang ordren er betalt.':
    'Uthyrning och beställningar med leveransdatum passar inte i vanliga fraktappar, som skickar så fort ordern är betald.',
  'Profrakt-konto med API': 'Profrakt-konto med API',
  'Shopify eller bookingsystem': 'Shopify eller bokningssystem',
  'Make.com-konto': 'Make.com-konto',

  // --- Quickship ---
  'Quickship for Shopify': 'Quickship för Shopify',
  'Quickship-integrasjonen gir fraktvalg og etiketter for B2B-sendinger fra Shopify, inkludert pall og stykkgods som vanlige fraktapper ikke dekker. Vi setter opp appen, fraktregler per kundegruppe og vekt, etikettflyten fra ordren til pakking, og kobler sporing tilbake til ordren så forhandleren ser når pallen er på vei.':
    'Quickship-integrationen ger fraktalternativ och etiketter för B2B-försändelser från Shopify, inklusive pall och styckegods som vanliga fraktappar inte täcker. Vi sätter upp appen, fraktregler per kundgrupp och vikt, etikettflödet från order till packning, och kopplar spårning tillbaka till ordern så att återförsäljaren ser när pallen är på väg.',
  'Fraktvalg og etiketter for B2B-sendinger med pall og stykkgods.':
    'Fraktalternativ och etiketter för B2B-försändelser med pall och styckegods.',
  'Quickship er en norsk fraktløsning rettet mot bedrifter. Shopify-appen gir priser i kassen og etiketter fra ordren.':
    'Quickship är en norsk fraktlösning riktad mot företag. Shopify-appen ger priser i kassan och etiketter från ordern.',
  'B2B-ordre er tyngre og går på pall. Fraktvalg må reflektere det.':
    'B2B-order är tyngre och går på pall. Fraktalternativen måste spegla det.',
  'Quickship-konto': 'Quickship-konto',
  'Shopify': 'Shopify',
  'Fraktregler per kundegruppe': 'Fraktregler per kundgrupp',

  // --- Shopify POS ---
  'Shopify POS, fra PCKasse til én kasse': 'Shopify POS, från PCKasse till en enda kassa',
  'Shopify POS gir butikken samme varelager, kunder og gavekort som nettbutikken. Vi setter opp kassen, maskinvare og betalingsterminal, flytter kunder og gavekortsaldo fra PCKasse eller Front, og lærer opp butikkteamet før lansering. Regnskapet får ett salg per dag per butikk.':
    'Shopify POS ger den fysiska butiken samma lager, kunder och presentkort som webbutiken. Vi sätter upp kassan, hårdvara och betalterminal, flyttar över kunder och presentkortssaldo från PCKasse eller Front, och utbildar butiksteamet före lansering. Bokföringen får en försäljning per dag per butik.',
  'Butikk og nett i samme system. Vi flytter kunder, gavekort og varer fra PCKasse og setter opp kassen.':
    'Butik och webb i samma system. Vi flyttar kunder, presentkort och artiklar från PCKasse och sätter upp kassan.',
  'Shopify POS er Shopify sitt eget kassesystem. Det erstatter PCKasse for butikker som vil ha én plattform, og oppfyller kassasystemlova når det er satt opp riktig.':
    'Shopify POS är Shopifys eget kassasystem. Det ersätter PCKasse för butiker som vill ha en enda plattform, och uppfyller den norska kassasystemlagen när det är rätt uppsatt.',
  'To systemer for butikk og nett betyr dobbelt lager, dobbelt kunderegister og gavekort som ikke virker på tvers.':
    'Två system för butik och webb betyder dubbelt lager, dubbelt kundregister och presentkort som inte fungerar över kanalerna.',
  'Gammelt kassesystem, Z-rapport-vaner, gavekortsaldo og kundedata som skal med.':
    'Gammalt kassasystem, Z-rapportvanor, presentkortssaldo och kunddata som ska följa med.',
  'Lokasjoner, maskinvare, betalingsterminal og kvitteringsoppsett.': 'Platser, hårdvara, betalterminal och kvittoinställningar.',
  'Flytting': 'Flytt',
  'Kunder og gavekort fra PCKasse, varer med strekkoder.': 'Kunder och presentkort från PCKasse, artiklar med streckkoder.',
  'Opplæring og go-live': 'Utbildning och go-live',
  'Butikkteamet lærer kassen, vi er til stede første dag.': 'Butiksteamet lär sig kassan, vi är på plats första dagen.',
  'Shopify-plan med POS Pro der det trengs': 'Shopify-plan med POS Pro där det behövs',
  'Betalingsterminal som støttes i Norge': 'Betalterminal som stöds i Norge',
  'Eksport fra gammelt kassesystem': 'Export från gammalt kassasystem',

  // --- SparkLayer ---
  'SparkLayer B2B for Shopify': 'SparkLayer B2B för Shopify',
  'SparkLayer legger en B2B-bestillingsflate oppå Shopify med kundespesifikke priser, minimumsantall, hurtigbestilling og bestillingslister for forhandlere. Vi setter opp prislister og kundegrupper, tilpasser visningen i temaet, og kobler B2B-ordrene videre til Omnium eller regnskapssystemet slik at de behandles likt med alle andre ordre.':
    'SparkLayer lägger ett B2B-beställningslager ovanpå Shopify med kundspecifika priser, minimiantal, snabbeställning och beställningslistor för återförsäljare. Vi sätter upp prislistor och kundgrupper, anpassar visningen i temat, och kopplar B2B-orderna vidare till Omnium eller ekonomisystemet så att de hanteras på samma sätt som alla andra order.',
  'B2B-portal på Shopify med kundepriser, bestillingslister og ordre som flyter videre til OMS.':
    'B2B-portal på Shopify med kundpriser, beställningslistor och order som flödar vidare till OMS.',
  'SparkLayer er en Shopify-app for B2B. Den erstatter ikke OMS, men gir forhandlerne en bestillingsportal på samme butikk som B2C.':
    'SparkLayer är en Shopify-app för B2B. Den ersätter inte ett OMS, men ger återförsäljarna en beställningsportal i samma butik som B2C.',
  'Forhandlere som bestiller på e-post koster tid. En portal med riktige priser gir ordre rett inn i flyten.':
    'Återförsäljare som beställer via e-post kostar tid. En portal med rätt priser ger order rakt in i flödet.',
  'Shopify Plus anbefalt': 'Shopify Plus rekommenderas',
  'Prislister per kundegruppe': 'Prislistor per kundgrupp',
  'OMS eller regnskap for ordrene videre': 'OMS eller ekonomisystem för orderna vidare',

  // --- Tracklution ---
  'Tracklution server-side sporing for Shopify': 'Tracklution server-side-spårning för Shopify',
  'Tracklution-integrasjonen sender kjøp og hendelser fra Shopify server-side til Meta, Google Ads og affiliate-nettverk, uavhengig av nettleserblokkering og samtykkevalg som stopper vanlige piksler. Vi skriver custom pixel i Shopify-kassen, kobler hendelsene til Tracklution med riktig samtykkehåndtering, og verifiserer at konverteringene i annonseplattformene stemmer mot ordrene i Shopify.':
    'Tracklution-integrationen skickar köp och händelser från Shopify server-side till Meta, Google Ads och affiliatenätverk, oberoende av webbläsarblockering och samtyckesval som stoppar vanliga pixlar. Vi skriver en custom pixel i Shopify-kassan, kopplar händelserna till Tracklution med korrekt samtyckeshantering, och verifierar att konverteringarna i annonsplattformarna stämmer mot orderna i Shopify.',
  'Server-side sporing til Meta, Google og affiliate, med custom pixel i Shopify-kassen.':
    'Server-side-spårning till Meta, Google och affiliate, med custom pixel i Shopify-kassan.',
  'Tracklution er en server-side sporingstjeneste. Shopify-kassen tillater bare custom pixels, så koblingen er kode vi skriver og vedlikeholder.':
    'Tracklution är en server-side-spårningstjänst. Shopify-kassan tillåter bara custom pixels, så kopplingen är kod som vi skriver och underhåller.',
  'Annonseplattformene ser ikke lenger alle kjøp fra nettleseren. Uten server-side sporing optimaliserer de på feil tall.':
    'Annonsplattformarna ser inte längre alla köp från webbläsaren. Utan server-side-spårning optimerar de på fel siffror.',
  'Tracklution-konto': 'Tracklution-konto',
  'Shopify med custom pixel-tilgang': 'Shopify med tillgång till custom pixel',
  'Samtykkebanner': 'Samtyckesbanner',

  // --- TRIMIT ---
  'TRIMIT-lagersynk for Shopify': 'TRIMIT-lagersynk för Shopify',
  'TRIMIT-integrasjonen synker lagerbeholdning fra TRIMIT, ERP for mote og tekstil, til Shopify per variant og lokasjon. Den kjører som Make.com-scenario på fast intervall, slik at nettbutikken aldri selger varer som er utsolgt i ERP. Ordre går ikke tilbake i denne flyten.':
    'TRIMIT-integrationen synkar lagersaldo från TRIMIT, ERP för mode och textil, till Shopify per variant och plats. Den körs som Make.com-scenario med fast intervall, så att webbutiken aldrig säljer varor som är slutsålda i ERP. Order går inte tillbaka i det här flödet.',
  'Lagersynk fra TRIMIT til Shopify for mote og tekstil med mange varianter.':
    'Lagersynk från TRIMIT till Shopify för mode och textil med många varianter.',
  'TRIMIT er et ERP bygget på Microsoft Dynamics for mote, møbler og tekstil, med størrelse og farge som dimensjoner. Integrasjonen leser beholdning per variant og oppdaterer Shopify.':
    'TRIMIT är ett ERP byggt på Microsoft Dynamics för mode, möbler och textil, med storlek och färg som dimensioner. Integrationen läser saldo per variant och uppdaterar Shopify.',
  'Mote har mange varianter og raske utsalg. Feil lager i nettbutikken gir kanselleringer og dårlige anmeldelser.':
    'Mode har många varianter och snabba slutförsäljningar. Fel lager i webbutiken ger annulleringar och dåliga omdömen.',
  'Ordre til TRIMIT. Kan legges til som egen flyt': 'Order till TRIMIT. Kan läggas till som eget flöde',
  'TRIMIT med API-tilgang': 'TRIMIT med API-åtkomst',
  'Shopify med SKU per variant': 'Shopify med SKU per variant',

  // --- Tripletex ---
  'Tripletex-integrasjon for Shopify': 'Tripletex-integration för Shopify',
  'Tripletex-integrasjonen sender betalte Shopify-ordre til Tripletex som ordre og faktura med kunde, frakt og mva, enten per ordre eller som samlebilag per måned. Refusjoner i Shopify blir kreditnota. Flyten går én vei: Shopify er salgskanal, Tripletex er regnskap, og lager styres i Shopify. Den kjører som Make.com-scenario i din egen konto, og fakturaer sendes ikke før regnskapsfører har sett dem.':
    'Tripletex-integrationen skickar betalda Shopify-order till Tripletex som order och faktura med kund, frakt och moms, antingen per order eller som samlingsverifikat per månad. Återbetalningar i Shopify blir kreditnota. Flödet är enkelriktat: Shopify är säljkanal, Tripletex är bokföring, och lagret styrs i Shopify. Den körs som Make.com-scenario i ert eget konto, och fakturor skickas inte förrän redovisningskonsulten har sett dem.',
  'Ordre og kunder til Tripletex som faktura per ordre eller samlebilag per måned. Refusjoner blir kreditnota.':
    'Order och kunder till Tripletex som faktura per order eller samlingsverifikat per månad. Återbetalningar blir kreditnota.',
  'Tripletex er et norsk skybasert regnskapssystem for små og mellomstore selskaper. Integrasjonen gjør Shopify til salgskanal og Tripletex til regnskap, slik at ingen punsher ordre. Kunder og produkter opprettes i Tripletex første gang de dukker opp, og brukes igjen etterpå. Kundeoppslag skjer på e-post for B2C og organisasjonsnummer for B2B.':
    'Tripletex är ett norskt molnbaserat bokföringssystem för små och medelstora företag. Integrationen gör Shopify till säljkanal och Tripletex till bokföring, så att ingen knappar in order manuellt. Kunder och produkter skapas i Tripletex första gången de dyker upp, och återanvänds därefter. Kunduppslag sker på e-post för B2C och organisationsnummer för B2B.',
  'Manuell bokføring av nettbutikkordre er den vanligste kilden til avvik i mva-meldingen. Med integrasjonen får regnskapsfører riktig grunnlag hver dag, med Shopify-ordrenummer som referanse på hver faktura og kreditnota. Fakturaen opprettes, men sendes ikke automatisk, så regnskapsfører beholder kontrollen.':
    'Manuell bokföring av webbutiksorder är den vanligaste källan till avvikelser i momsdeklarationen. Med integrationen får redovisningskonsulten rätt underlag varje dag, med Shopify-ordernummer som referens på varje faktura och kreditnota. Fakturan skapas, men skickas inte automatiskt, så redovisningskonsulten behåller kontrollen.',
  'Kontoplan, mva-koder, kundegrupper, og om dere vil ha faktura per ordre eller samlebilag per måned. Én arbeidsøkt med regnskapsfører.':
    'Kontoplan, momskoder, kundgrupper, och om ni vill ha faktura per order eller samlingsverifikat per månad. Ett arbetspass med redovisningskonsulten.',
  'Oppsett i Make.com': 'Uppsättning i Make.com',
  'API-token fra Tripletex, tilkobling i din Make-konto, scenario fra vår mal med kunde- og produktoppslag.':
    'API-token från Tripletex, anslutning i ert Make-konto, scenario från vår mall med kund- och produktuppslag.',
  'Test på reelle ordre': 'Test på riktiga order',
  'De første ordrene gjennom hele flyten. Regnskapsfører godkjenner fakturaene før de sendes.':
    'De första orderna genom hela flödet. Redovisningskonsulten godkänner fakturorna innan de skickas.',
  'Vi følger de første ukene. Feilede kjøringer ligger synlig i Make-historikken og varsles med ordrenummer.':
    'Vi följer de första veckorna. Misslyckade körningar syns i Make-historiken och flaggas med ordernummer.',
  'Tripletex med API-tilgang (ansatt-token)': 'Tripletex med API-åtkomst (anställd-token)',
  'Shopify eller Shopify Plus': 'Shopify eller Shopify Plus',
  'Make.com-konto i ditt navn, vi setter opp om du ikke har': 'Make.com-konto i ert namn, vi sätter upp ett om ni inte har',
  'Kontoplan, mva-koder og forfall avklart med regnskapsfører': 'Kontoplan, momskoder och förfallodatum avstämda med redovisningskonsulten',
  'SKU eller EAN på alle varianter, så produktoppslag treffer': 'SKU eller EAN på alla varianter, så att produktuppslaget träffar rätt',
  'Lager. Shopify er fasit, eller Omnium om du trenger OMS': 'Lager. Shopify är master, eller Omnium om ni behöver ett OMS',
  'Betalingsstatus tilbake. Shopify-ordre er allerede betalt når de sendes': 'Betalstatus tillbaka. Shopify-order är redan betalda när de skickas',
  'Kan vi bruke Tripletex sin egen Shopify-app i stedet?': 'Kan vi använda Tripletex egen Shopify-app istället?',
  'Ja, for enkle B2C-butikker. Vår integrasjon er for deg som trenger samlebilag, B2B-faktura med org.nr, EDI via Omnium, egen mapping av mva og konto, eller fakturering som utløses av noe annet enn kassen.':
    'Ja, för enkla B2C-butiker. Vår integration är för er som behöver samlingsverifikat, B2B-faktura med org.nr, EDI via Omnium, egen mappning av moms och konto, eller fakturering som utlöses av något annat än kassan.',
  'Synker dere lager fra Tripletex til Shopify?': 'Synkar ni lager från Tripletex till Shopify?',
  'Nei. Shopify er fasit for lager i denne integrasjonen. Trenger du lagerstyring på tvers av kanaler, er Omnium eller Holio riktig verktøy, og de kobler vi til.':
    'Nej. Shopify är master för lager i den här integrationen. Behöver ni lagerstyrning över flera kanaler är Omnium eller Holio rätt verktyg, och dem kopplar vi in.',
  'Sendes fakturaene automatisk til kunden?': 'Skickas fakturorna automatiskt till kunden?',
  'Nei. Fakturaen opprettes i Tripletex, og regnskapsfører sender den, eller setter opp Tripletex sin egen utsending. Det er et bevisst valg.':
    'Nej. Fakturan skapas i Tripletex, och redovisningskonsulten skickar den, eller sätter upp Tripletex eget utskick. Det är ett medvetet val.',
  'Eier vi Make.com-scenarioet?': 'Äger vi Make.com-scenariot?',
  'Ja. Scenarioet og tilkoblingene ligger i din Make-konto. Vi drifter om du vil, men du er ikke låst.':
    'Ja. Scenariot och anslutningarna ligger i ert Make-konto. Vi driftar om ni vill, men ni är inte låsta.',

  // --- UniMicro ---
  'UniMicro-integrasjon for Shopify': 'UniMicro-integration för Shopify',
  'UniMicro-integrasjonen kobler Shopify til UniMicro slik at varer og lager kommer fra ERP til nettbutikken, og ordre og kunder går tilbake. Den settes opp med UniMicro sin Shopify-kobling, og vi gjør kartlegging, mapping, test og go-live som del av en migrering eller nybygg.':
    'UniMicro-integrationen kopplar Shopify till UniMicro så att artiklar och lager kommer från ERP till webbutiken, och order och kunder går tillbaka. Den sätts upp med UniMicros egen Shopify-koppling, och vi gör kartläggning, mappning, test och go-live som en del av en migrering eller ett nybygge.',
  'Varer, lager, ordre og kunder mellom Shopify og UniMicro, med ERP som fasit for lager.':
    'Artiklar, lager, order och kunder mellan Shopify och UniMicro, med ERP som master för lager.',
  'UniMicro er et norsk økonomisystem med egen Shopify-kobling. Her er ERP fasit for varer og lager, i motsetning til Tripletex-oppsettet der Shopify er fasit.':
    'UniMicro är ett norskt ekonomisystem med egen Shopify-koppling. Här är ERP master för artiklar och lager, till skillnad från Tripletex-uppsättningen där Shopify är master.',
  'Butikker med fysisk lager og eget varesystem vil ikke vedlikeholde produkter to steder. Da må nettbutikken følge ERP.':
    'Butiker med fysiskt lager och eget artikelsystem vill inte underhålla produkter på två ställen. Då måste webbutiken följa ERP.',
  'UniMicro med Shopify-kobling': 'UniMicro med Shopify-koppling',
  'Varenummer som stemmer begge steder': 'Artikelnummer som stämmer på båda ställen',

  // --- Vipps ---
  'Vipps Hurtigkasse for Shopify': 'Vipps Hurtigkasse för Shopify',
  'Vipps Hurtigkasse lar kunden betale med ett trykk fra produktsiden, uten å fylle inn adresse. Vi setter opp Vipps sin Shopify-app, plasserer knappen riktig i tema og kasse, tester på mobil, og fører Vipps-oppgjøret mot egen betalingsmåte i regnskapet slik at bank og bokføring stemmer.':
    'Vipps Hurtigkasse låter kunden betala med ett tryck från produktsidan, utan att fylla i adress. Vi sätter upp Vipps Shopify-app, placerar knappen rätt i tema och kassa, testar på mobil, och bokför Vipps-avräkningen mot ett eget betalsätt i bokföringen så att bank och bokföring stämmer.',
  'Ett trykk fra produktside til betalt ordre. Oppsett, test og go-live, og Vipps-oppgjør mot regnskapet.':
    'Ett tryck från produktsida till betald order. Uppsättning, test och go-live, samt Vipps-avräkning mot bokföringen.',
  'Vipps Hurtigkasse er en betalings- og kassemetode fra Vipps MobilePay. Kunden identifiseres med telefonnummer, og adresse og betaling hentes fra Vipps.':
    'Vipps Hurtigkasse är en betal- och kassametod från Vipps MobilePay. Kunden identifieras med telefonnummer, och adress och betalning hämtas från Vipps.',
  'Norske kunder forventer Vipps. Hurtigkasse fjerner skjemaet, og det er skjemaet som dreper konvertering på mobil.':
    'Norska kunder förväntar sig Vipps. Hurtigkasse tar bort formuläret, och det är formuläret som dödar konverteringen på mobil.',
  'Vipps-avtale for nettbutikk': 'Vipps-avtal för webbutik',
  'Regnskap med egen betalingsmåte for Vipps': 'Bokföring med eget betalsätt för Vipps',

  // --- Visma.net ---
  'Visma.net-integrasjon for Shopify': 'Visma.net-integration för Shopify',
  'Visma.net-integrasjonen kobler Visma.net ERP til Shopify slik at varer, priser og lager kommer fra ERP, og ordre og kunder går tilbake som salgsordre. Vi bygger flyten mot Visma.net sitt API, med kø og retry, fordi volumet og feilhåndteringen i ERP-prosjekter krever det. Faktura og levering styres i Visma.net.':
    'Visma.net-integrationen kopplar Visma.net ERP till Shopify så att artiklar, priser och lager kommer från ERP, och order och kunder går tillbaka som säljorder. Vi bygger flödet mot Visma.nets API, med kö och retry, eftersom volymen och felhanteringen i ERP-projekt kräver det. Faktura och leverans styrs i Visma.net.',
  'Visma.net som ERP og fasit for varer og lager, Shopify som salgskanal. Ordre og kunder tilbake via API.':
    'Visma.net som ERP och master för artiklar och lager, Shopify som säljkanal. Order och kunder tillbaka via API.',
  'Visma.net er Visma sitt skybaserte ERP for mellomstore selskaper, med eget API for varer, lager, kunder og salgsordre.':
    'Visma.net är Vismas molnbaserade ERP för medelstora företag, med eget API för artiklar, lager, kunder och säljorder.',
  'Med ERP som fasit må nettbutikken oppdateres når lageret endres, og ordrene må inn i ERP uten at noen punsher dem.':
    'Med ERP som master måste webbutiken uppdateras när lagret ändras, och orderna måste in i ERP utan att någon knappar in dem.',
  'Visma.net med API-tilgang': 'Visma.net med API-åtkomst',
  'Varenummer og lokasjoner avklart': 'Artikelnummer och platser avstämda',

  // --- Vuuh ---
  'Vuuh for Shopify': 'Vuuh för Shopify',
  'Vuuh-integrasjonen henter produktdata, bilder og lager fra merkevarene dine via Vuuh sin offisielle Shopify-app, så butikken slipper å legge inn leverandørenes produkter manuelt. Vi setter opp appen, mapping av merkenes kategorier til dine kolleksjoner, regler for hva som publiseres, og sjekker at varianter og strekkoder stemmer før første import.':
    'Vuuh-integrationen hämtar produktdata, bilder och lager från era varumärken via Vuuhs officiella Shopify-app, så att butiken slipper lägga in leverantörernas produkter manuellt. Vi sätter upp appen, mappning av varumärkenas kategorier till era kollektioner, regler för vad som publiceras, och kontrollerar att varianter och streckkoder stämmer före första importen.',
  'Produktdata og lager fra leverandørene via Vuuh, rett inn i Shopify.':
    'Produktdata och lager från leverantörerna via Vuuh, rakt in i Shopify.',
  'Vuuh er en nordisk plattform der merkevarer deler produktdata med forhandlere. Shopify-appen er offisiell og plug-and-play.':
    'Vuuh är en nordisk plattform där varumärken delar produktdata med återförsäljare. Shopify-appen är officiell och plug-and-play.',
  'Forhandlere med mange merker bruker dager på produktdata. Vuuh leverer dem ferdig.':
    'Återförsäljare med många varumärken lägger dagar på produktdata. Vuuh levererar dem färdiga.',
  'Vuuh-konto': 'Vuuh-konto',
  'Merker som er på Vuuh': 'Varumärken som finns på Vuuh',
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
const svId = (noId: string) => noId.replace(/-no$/, '-sv')

// -no/-sv pairs are mapped by id. Anything else (allPackagesPage, partnersPage, migratePage,
// shopifyPosPage, vippsHurtigkassePage, shopifyXPimPage, ...) is resolved by looking up the
// Swedish document of the same type; dropped with a warning when none exists.
async function resolveRelated(noRef: string): Promise<string | null> {
  if (/-no$/.test(noRef)) return svId(noRef)
  const type = await client.fetch<string | null>('*[_id == $id][0]._type', { id: noRef })
  if (!type) return null
  const sv = await client.fetch<string | null>('*[_type == $type && language == "sv"][0]._id', { type })
  return sv || null
}

function buildSv(no: Doc, related: Doc[]): Doc {
  const { _rev, _createdAt, _updatedAt, ...rest } = no
  const catKey = (no.category?._ref as string | undefined)?.match(/^integration-cat-(.+)-no$/)?.[1]
  if (!catKey) throw new Error(`${no._id}: cannot derive category key from ${no.category?._ref}`)
  return {
    ...rest,
    _id: svId(no._id),
    language: 'sv',
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
    category: weak(`integration-cat-${catKey}-sv`),
    pillar: weak('pillar-integrasjoner-sv'),
    clusterLinks: (no.clusterLinks ?? []).map((r: Doc) => weak(svId(r._ref), r._key)),
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
      const sv = await resolveRelated(r._ref)
      if (sv) related.push(weak(sv, r._key))
      else console.warn(dataset, no._id, 'dropping unresolved related ref', r._ref)
    }
    const sv = buildSv(no, related)
    if (missing.size) {
      console.error('Untranslated strings:\n' + [...missing].map((s) => `  ${JSON.stringify(s)}`).join('\n'))
      throw new Error(`${missing.size} untranslated string(s) in ${no._id}`)
    }
    if (!DRY) await client.createOrReplace(sv as any)
    console.log(dataset, DRY ? 'would write' : 'wrote', sv._id, `(${String(sv.definition).trim().split(/\s+/).length} words in definition)`, sv.slug.current)

    const metaId = `integration-${slug}-meta`
    const svEntry = { _key: 'sv', value: { _type: 'reference', _ref: sv._id, _weak: true, _strengthenOnPublish: { type: 'integrationPage' } } }
    const meta = await client.fetch<{ keys: string[] } | null>('*[_id == $id][0]{ "keys": translations[]._key }', { id: metaId })
    if (!meta) {
      // Should not happen (meta exists with no + en); create it with no + sv rather than fail.
      if (!DRY) await client.createOrReplace({
        _id: metaId, _type: 'translation.metadata', schemaTypes: ['integrationPage'], translations: [
          { _key: 'no', value: { _type: 'reference', _ref: no._id, _weak: true, _strengthenOnPublish: { type: 'integrationPage' } } },
          svEntry,
        ],
      })
      console.log(dataset, DRY ? 'would create' : 'created', metaId, '(no + sv)')
    } else if ((meta.keys ?? []).includes('sv')) {
      console.log(dataset, 'skip', metaId, 'already has sv')
    } else {
      if (!DRY) await client.patch(metaId).insert('after', 'translations[-1]', [svEntry]).commit()
      console.log(dataset, DRY ? 'would patch' : 'patched', metaId, '+sv')
    }
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
