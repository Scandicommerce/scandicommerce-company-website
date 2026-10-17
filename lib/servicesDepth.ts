/**
 * Depth content for the Tjenester pages: the facts, deliverables, prerequisites,
 * related integrations, FAQ and onward links that give a service page the same
 * weight as an integration page. Hero and process copy stay in the page files
 * (and in Sanity for migrering/utvikling); this file only adds to them.
 */

export type ServiceKey = 'shopify' | 'migrering' | 'b2b' | 'utvikling'

export interface ServiceFact {
  label: string
  value: string
  note?: string
}

export interface Deliverable {
  name: string
  text: string
  /** What it does not cover, when that is worth saying up front. */
  scope?: string
}

export interface ServiceLink {
  eyebrow: string
  title: string
  text: string
  href: string
  linkText?: string
}

export interface ServiceDepth {
  key: ServiceKey
  /** Section headings, so each page can phrase them in its own voice. */
  headings: { facts: string; deliverables: string; deliverablesLead: string; prerequisites: string; integrations: string; integrationsLead: string; faq: string; links: string }
  facts: ServiceFact[]
  deliverables: Deliverable[]
  /** What the customer has ready before start. */
  youBring: string[]
  /** What we take care of without being asked. */
  weHandle: string[]
  /** integrationPage slugs (integrasjoner/<x>) worth showing. */
  integrationSlugs: string[]
  faq: { question: string; answer: string }[]
  links: ServiceLink[]
}

const PACKAGES = '/tjenester/alle-pakker'
const CASES = '/kundecaser'
const INTEGRATIONS = '/integrasjoner'

export const servicesDepth: Record<ServiceKey, ServiceDepth> = {
  shopify: {
    key: 'shopify',
    headings: {
      facts: 'Kort fortalt',
      deliverables: 'Dette inngår i en ny nettbutikk',
      deliverablesLead: 'Alt under er med i fastprisen. Står det ikke her, avtaler vi det før vi starter.',
      prerequisites: 'Før vi starter',
      integrations: 'Integrasjoner vi setter opp samtidig',
      integrationsLead: 'De fleste nye butikker trenger regnskap, frakt og betaling på plass fra dag én. Dette er løsningene vi oftest kobler på under bygging.',
      faq: 'Vanlige spørsmål om ny nettbutikk',
      links: 'Les videre',
    },
    facts: [
      { label: 'Tidsramme', value: '6–10 uker', note: 'fra kartlegging til lansering' },
      { label: 'Prismodell', value: 'Fast pris', note: 'avtalt etter kartlegging' },
      { label: 'Plattform', value: 'Shopify / Plus', note: 'vi anbefaler riktig nivå' },
      { label: 'Etter lansering', value: 'Growth eller Premium', note: 'drift og videreutvikling' },
    ],
    deliverables: [
      { name: 'Tema og design', text: 'Et Shopify-tema tilpasset merkevaren din, satt opp for mobil først og bygget for å konvertere.', scope: 'Tilpasning av tema. Helt egendesignet tema er et eget prosjekt.' },
      { name: 'Produkter og kategorier', text: 'Struktur for produkter, varianter, kolleksjoner og navigasjon som tåler at sortimentet vokser.' },
      { name: 'Betaling', text: 'Shopify Payments, Vipps og eventuelt Klarna eller Qliro satt opp med riktige avgifter og valutaer.' },
      { name: 'Frakt og levering', text: 'Fraktregler, hentepunkter og kobling mot Bring, PostNord eller Helthjem.' },
      { name: 'Regnskap', text: 'Ordre og betalinger over til regnskapssystemet ditt uten manuelle bilag.', scope: 'Standardintegrasjon. Spesialregler for bokføring avtales særskilt.' },
      { name: 'Innhold og SEO-grunnmur', text: 'Sideoppsett, metatitler, URL-struktur og sporing (GA4, Meta) riktig fra start.' },
      { name: 'Apper som trengs', text: 'Anmeldelser, søk og filtrering, samtykke og e-post satt opp med apper vi kjenner.', scope: 'Ferdige apper. Egenutviklede funksjoner ligger under Utvikling.' },
      { name: 'Lansering og opplæring', text: 'Testing, domene og go-live, pluss opplæring så teamet ditt driver butikken selv.' },
    ],
    youBring: ['Logo, farger og bilder dere eier', 'Produktdata (navn, pris, varianter, bilder) i regneark eller eksisterende system', 'Tilgang til domene, regnskapssystem og fraktavtaler', 'Én person hos dere som kan ta beslutninger underveis'],
    weHandle: ['Shopify-konto, planvalg og oppsett', 'Avgifter, valuta og Markets', 'Kobling mot regnskap, frakt og betaling', 'Samtykke og personvern (Consentmo)', 'Testing på mobil og desktop før lansering'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/vipps-hurtigkasse', 'integrasjoner/bring', 'integrasjoner/klaviyo', 'integrasjoner/poweroffice-go', 'integrasjoner/klarna'],
    faq: [
      { question: 'Trenger vi Shopify Plus?', answer: 'Sjelden fra start. Shopify Plus lønner seg når dere har høyt volum, B2B i samme butikk, flere markeder eller behov for tilpasset kasse. Vi anbefaler nivået ut fra tallene deres, ikke omvendt.' },
      { question: 'Hva koster en ny nettbutikk?', answer: 'Vi gir fast pris etter en kort kartlegging, der omfanget er skrevet ned. Prisen avhenger av tema, antall integrasjoner og hvor mye innhold som skal på plass. Løpende drift etterpå dekkes av pakkene.' },
      { question: 'Kan vi bruke vårt eget design?', answer: 'Ja. Har dere et ferdig design eller designsystem, bygger vi temaet etter det. Har dere ikke det, tilpasser vi et gjennomtestet tema til merkevaren.' },
      { question: 'Hvem eier butikken etterpå?', answer: 'Dere. Shopify-kontoen, temaet, domenet og alle data står i deres navn fra dag én. Vi har tilgang som samarbeidspartner så lenge dere ønsker det.' },
      { question: 'Hva skjer etter lansering?', answer: 'Vi følger butikken de første ukene. Deretter velger dere en pakke for drift og videreutvikling, eller tar det selv med opplæringen dere har fått.' },
    ],
    links: [
      { eyebrow: 'Pakker', title: 'Drift og videreutvikling etter lansering', text: 'Growth, Premium og Enterprise: fast månedspris, alt i pakken under er med.', href: PACKAGES, linkText: 'Se pakkene' },
      { eyebrow: 'Kundecaser', title: 'Butikker vi har bygget', text: 'Resultater fra norske merkevarer som gikk live med oss.', href: CASES, linkText: 'Se kundecaser' },
      { eyebrow: 'Integrasjoner', title: 'Alt butikken kan kobles mot', text: 'ERP, betaling, logistikk, PIM og markedsføring, med metode og retning for hver.', href: INTEGRATIONS, linkText: 'Se integrasjonene' },
    ],
  },
  migrering: {
    key: 'migrering',
    headings: {
      facts: 'Kort fortalt',
      deliverables: 'Dette flytter vi',
      deliverablesLead: 'En migrering er mer enn produkter. Alt under er med, og vi sjekker det mot den gamle butikken før vi bytter.',
      prerequisites: 'Før vi starter',
      integrations: 'Integrasjoner vi kobler om samtidig',
      integrationsLead: 'Regnskap, frakt og e-post må virke på Shopify den dagen dere bytter. Dette er koblingene vi oftest setter opp som del av migreringen.',
      faq: 'Vanlige spørsmål om migrering',
      links: 'Les videre',
    },
    facts: [
      { label: 'Tidsramme', value: '4–8 uker', note: 'avhengig av datamengde' },
      { label: 'Nedetid', value: '0 timer', note: 'ny butikk bygges ved siden av' },
      { label: 'SEO', value: 'Bevart', note: 'alle URL-er videresendes' },
      { label: 'Prismodell', value: 'Fast pris', note: 'etter kartlegging' },
    ],
    deliverables: [
      { name: 'Produkter og varianter', text: 'Alle produkter, varianter, bilder, priser og lagerstatus, ryddet og strukturert for Shopify.' },
      { name: 'Kunder og ordrehistorikk', text: 'Kundekontoer og ordre flyttes så dere beholder historikk og kundeklubb.', scope: 'Passord kan ikke flyttes; kundene setter nytt ved første innlogging.' },
      { name: 'URL-er og videresendinger', text: 'Hver gammel URL får en 301 til riktig ny side. Rangeringene følger med.' },
      { name: 'Innhold', text: 'Sider, blogg og landingssider over i Shopify med metadata intakt.' },
      { name: 'Integrasjoner', text: 'Regnskap, frakt, betaling og e-post koblet om til Shopify før bytte.' },
      { name: 'Design', text: 'Tema tilpasset merkevaren, eller gjenskapt fra dagens design når det er ønsket.' },
      { name: 'Testing og bytte', text: 'Parallellkjøring, testordre og kontrollert bytte av domene på et tidspunkt dere velger.' },
      { name: 'Etterkontroll', text: 'Vi overvåker søk, feilsider og ordreflyt de første ukene etter bytte.' },
    ],
    youBring: ['Admin-tilgang til dagens plattform', 'Eksport av produkter, kunder og ordre (vi hjelper med uttaket)', 'Oversikt over dagens integrasjoner og apper', 'Dato dere helst vil bytte på'],
    weHandle: ['Datavask og mapping til Shopify-struktur', 'URL-kartlegging og 301-regler', 'Omkobling av regnskap, frakt og betaling', 'Testordre gjennom hele flyten', 'Overvåking etter bytte'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/24sevenoffice', 'integrasjoner/visma-net', 'integrasjoner/nshift', 'integrasjoner/klaviyo', 'integrasjoner/vipps-hurtigkasse'],
    faq: [
      { question: 'Mister vi SEO-rangeringene?', answer: 'Nei, når det gjøres riktig. Vi kartlegger alle URL-er, setter 301-videresendinger og flytter metadata. Vi følger Search Console de første ukene og retter avvik.' },
      { question: 'Må butikken være nede under byttet?', answer: 'Nei. Den nye butikken bygges ved siden av den gamle. Byttet er en domeneendring som tar minutter, og vi gjør det på et tidspunkt med lav trafikk.' },
      { question: 'Hva med kundenes passord?', answer: 'Passord kan ikke flyttes mellom plattformer. Kundene får beskjed om å sette nytt passord ved første innlogging, med en tekst vi lager sammen med dere.' },
      { question: 'Hvilke plattformer flytter dere fra?', answer: 'WooCommerce, Magento, 24Nettbutikk, Mystore, Quickbutik, Wix og egenutviklede løsninger. Har dere noe annet, finner vi ut av uttaket sammen.' },
      { question: 'Kan vi beholde dagens design?', answer: 'Ja, hvis dere vil. Ofte er migreringen en god anledning til å rydde i design og struktur, og vi anbefaler det når det gir bedre konvertering.' },
    ],
    links: [
      { eyebrow: 'Pakker', title: 'Drift etter migrering', text: 'Growth, Premium og Enterprise holder butikken i form etter flyttingen.', href: PACKAGES, linkText: 'Se pakkene' },
      { eyebrow: 'Kundecaser', title: 'Butikker som har byttet til Shopify', text: 'Hva som skjedde med salg og drift etter migreringen.', href: CASES, linkText: 'Se kundecaser' },
      { eyebrow: 'Integrasjoner', title: 'Koblingene dere trenger på Shopify', text: 'ERP, logistikk og betaling, med metode og retning for hver.', href: INTEGRATIONS, linkText: 'Se integrasjonene' },
    ],
  },
  b2b: {
    key: 'b2b',
    headings: {
      facts: 'Kort fortalt',
      deliverables: 'Dette inngår i en ordreportal',
      deliverablesLead: 'Alt bedriftskundene trenger for å bestille selv, og alt dere trenger for å slippe manuelle ordre.',
      prerequisites: 'Før vi starter',
      integrations: 'Systemene portalen snakker med',
      integrationsLead: 'En ordreportal er bare så god som dataene bak den. Priser, lager og kunder kommer fra ERP, og ordrene går tilbake dit.',
      faq: 'Vanlige spørsmål om B2B på Shopify',
      links: 'Les videre',
    },
    facts: [
      { label: 'Tidsramme', value: '4–8 uker', note: 'avhengig av ERP-kobling' },
      { label: 'Plattform', value: 'Shopify Plus', note: 'B2B er en Plus-funksjon' },
      { label: 'Samme butikk', value: 'B2B + B2C', note: 'én katalog, egne priser' },
      { label: 'Prismodell', value: 'Fast pris', note: 'etter kartlegging' },
    ],
    deliverables: [
      { name: 'Bedriftskunder og lokasjoner', text: 'Selskaper med flere lokasjoner, kontaktpersoner og roller, importert fra ERP eller regneark.' },
      { name: 'Prislister og kataloger', text: 'Egne priser, rabatter og volumtrapper per kunde eller kundegruppe, og sortiment per avtale.' },
      { name: 'Betalingsbetingelser', text: 'Kjøp på faktura med netto 14/30 dager, kredittgrenser og kort eller Vipps som alternativ.' },
      { name: 'Selvbetjent bestilling', text: 'Innlogging, hurtigbestilling, gjenbestilling fra historikk og ordreutkast som sendes til godkjenning.' },
      { name: 'ERP-integrasjon', text: 'Kunder, priser og lager inn fra ERP, ordre og fakturagrunnlag ut.', scope: 'Standardkobling mot Tripletex, 24SevenOffice, Visma.net eller Business Central. Andre systemer vurderes.' },
      { name: 'Forhandlerinnhold', text: 'Produktark, kampanjer og nyheter som bare bedriftskunder ser.' },
      { name: 'Onboarding av forhandlere', text: 'Invitasjoner, veiledning og en plan for å få kundene over fra e-post og telefon.' },
    ],
    youBring: ['Kundeliste med prisavtaler og betingelser', 'ERP-system med API-tilgang', 'Beslutning om hvem som godkjenner ordre internt', 'Sortimentet som skal selges B2B'],
    weHandle: ['Shopify Plus-oppsett og B2B-konfigurasjon', 'Mapping av priser og kundegrupper', 'ERP-kobling begge veier', 'Testbestillinger med ekte kunder', 'Opplæring av selgerne deres'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/24sevenoffice', 'integrasjoner/business-central', 'integrasjoner/visma-net', 'integrasjoner/sparklayer', 'integrasjoner/omnium'],
    faq: [
      { question: 'Må vi ha Shopify Plus for B2B?', answer: 'For ekte B2B med bedriftskunder, prislister og fakturabetingelser: ja. For enkle behov, som én rabattgruppe, finnes det apper på vanlig Shopify. Vi anbefaler det som passer volumet deres.' },
      { question: 'Kan B2B og B2C være i samme butikk?', answer: 'Ja, og det er ofte det beste. Én katalog, ett lager og én ordreflyt, mens bedriftskunder ser sine priser etter innlogging. Vil dere skille helt, setter vi opp en egen butikk.' },
      { question: 'Hvordan kommer prisene fra ERP?', answer: 'Prislister i ERP mappes til kataloger i Shopify og synkroniseres på intervall eller ved endring. Kunden ser alltid samme pris i portalen som på fakturaen.' },
      { question: 'Hva med kunder som bestiller på e-post i dag?', answer: 'De fleste går over når portalen er enklere enn e-post. Vi lager en onboarding med invitasjoner og hjelp, og selgerne deres kan legge inn ordre på vegne av kunden i overgangen.' },
      { question: 'Støttes faktura og kredittgrenser?', answer: 'Ja. Betalingsbetingelser settes per selskap, og fakturaen genereres i ERP via integrasjonen, ikke i Shopify.' },
    ],
    links: [
      { eyebrow: 'Pakker', title: 'B2B-funksjoner inngår fra Premium', text: 'Kundespesifikke priser, kataloger og betingelser som del av løpende drift.', href: PACKAGES, linkText: 'Se pakkene' },
      { eyebrow: 'Kundecaser', title: 'B2B-butikker på Shopify', text: 'Hvordan norske grossister og merkevarer flyttet ordre fra e-post til portal.', href: CASES, linkText: 'Se kundecaser' },
      { eyebrow: 'Integrasjoner', title: 'ERP og regnskap', text: 'Tripletex, 24SevenOffice, Visma.net og Business Central, med retning og metode.', href: `${INTEGRATIONS}/erp`, linkText: 'Se ERP-integrasjonene' },
    ],
  },
  utvikling: {
    key: 'utvikling',
    headings: {
      facts: 'Kort fortalt',
      deliverables: 'Dette bygger vi',
      deliverablesLead: 'Når en app ikke finnes, eller ikke er god nok, bygger vi det selv. Her er det vi oftest leverer.',
      prerequisites: 'Før vi starter',
      integrations: 'Integrasjoner vi utvikler selv',
      integrationsLead: 'Skreddersøm handler ofte om data. Dette er koblingene vi har bygget med egen kode eller Make, og som vi kan utvide for deg.',
      faq: 'Vanlige spørsmål om utvikling',
      links: 'Les videre',
    },
    facts: [
      { label: 'Tidsramme', value: '2–12 uker', note: 'etter omfang' },
      { label: 'Prismodell', value: 'Fast pris', note: 'per leveranse' },
      { label: 'Teknologi', value: 'Liquid, React, Node', note: 'Shopify Functions og apper' },
      { label: 'Eierskap', value: 'Du eier koden', note: 'alt i ditt repo' },
    ],
    deliverables: [
      { name: 'Produktkonfiguratorer', text: 'Kunden setter sammen produktet selv: mål, materiale, tilvalg og pris i sanntid.' },
      { name: 'Egne Shopify-apper', text: 'Funksjonalitet som ikke finnes i App Store, bygget som privat app for butikken din.' },
      { name: 'Integrasjoner', text: 'Koblinger mot ERP, PIM, WMS og egne API-er, med egen kode eller Make.', scope: 'Standardkoblinger ligger under Integrasjoner. Her er det som må bygges.' },
      { name: 'Kasse og Shopify Functions', text: 'Tilpasset kasse, rabattlogikk, leveringsregler og betalingsmetoder på Shopify Plus.' },
      { name: 'Agenter og AI', text: 'Automatisering av kundeservice, produkttekster og dataflyt med AI-agenter som kjører i deres systemer.' },
      { name: 'Temautvikling', text: 'Egne seksjoner, blokker og ytelsesarbeid utover det standardtema gir.' },
      { name: 'Headless og storefront', text: 'Hydrogen eller Next.js-butikk med Shopify som backend når det faktisk lønner seg.', scope: 'Vi anbefaler headless bare når tema ikke kan løse behovet.' },
    ],
    youBring: ['En beskrivelse av problemet, ikke nødvendigvis løsningen', 'Tilgang til systemene som skal snakke sammen', 'Eksempeldata vi kan teste mot', 'Én person som kan godkjenne underveis'],
    weHandle: ['Spesifikasjon med omfang og fast pris', 'Utvikling i eget repo dere eier', 'Testmiljø før produksjon', 'Dokumentasjon og overlevering', 'Drift og videreutvikling via pakkene'],
    integrationSlugs: ['integrasjoner/visma-net', 'integrasjoner/tracklution', 'integrasjoner/tripletex', 'integrasjoner/front-systems', 'integrasjoner/omnium', 'integrasjoner/feed'],
    faq: [
      { question: 'Når bør vi bygge selv i stedet for å bruke en app?', answer: 'Når appen ikke dekker behovet, koster mer enn den gir, eller gjør butikken treg. Vi sjekker alltid App Store først, og sier fra når en app holder.' },
      { question: 'Hvem eier koden?', answer: 'Dere. Alt vi bygger ligger i et repo dere eier, med dokumentasjon. Vil dere bytte byrå, tar dere koden med.' },
      { question: 'Hvordan prises utvikling?', answer: 'Fast pris per leveranse, basert på en kort spesifikasjon vi lager sammen. Endringer underveis prises før de gjøres. Løpende videreutvikling dekkes av Premium eller Enterprise.' },
      { question: 'Bygger dere headless?', answer: 'Ja, når det lønner seg. For de fleste norske butikker gir et godt tema bedre resultat per krone. Vi anbefaler headless når dere trenger noe tema ikke kan gi.' },
      { question: 'Hva med vedlikehold?', answer: 'Shopify endrer API-er jevnlig. Alt vi bygger følges opp gjennom pakkene, så det fortsetter å virke når plattformen endrer seg.' },
    ],
    links: [
      { eyebrow: 'Pakker', title: 'Skreddersydd utvikling inngår fra Premium', text: 'Små og mellomstore funksjoner som del av løpende drift, større løft som prosjekt.', href: PACKAGES, linkText: 'Se pakkene' },
      { eyebrow: 'Kundecaser', title: 'Det vi har bygget for andre', text: 'Konfiguratorer, integrasjoner og apper hos norske merkevarer.', href: CASES, linkText: 'Se kundecaser' },
      { eyebrow: 'Integrasjoner', title: 'Egen kode vs. Make vs. app', text: 'Hvordan vi velger metode for hver kobling, og hva det betyr for deg.', href: INTEGRATIONS, linkText: 'Se integrasjonene' },
    ],
  },
}

/** Overview page: which service fits which situation, and the common FAQ. */
export const servicesOverview = {
  chooser: [
    { situation: 'Vi har ingen nettbutikk, eller skal starte på nytt', service: 'Ny nettbutikk på Shopify', href: '/tjenester/shopify' },
    { situation: 'Vi har en butikk på WooCommerce, Magento eller 24Nettbutikk', service: 'Migrering til Shopify', href: '/tjenester/migrering' },
    { situation: 'Forhandlerne våre bestiller på e-post og telefon', service: 'B2B og ordreportal', href: '/tjenester/b2b' },
    { situation: 'Vi trenger noe som ikke finnes som app', service: 'Utvikling og skreddersøm', href: '/tjenester/utvikling' },
    { situation: 'Butikken er live, vi trenger noen som drifter og forbedrer den', service: 'Pakkene: Growth, Premium, Enterprise', href: PACKAGES },
    { situation: 'Vi skal åpne fysisk butikk eller samle kasse og nettbutikk', service: 'Nexus POS', href: '/nexuspos' },
  ],
  process: [
    { title: 'Kartlegging', text: 'En time der vi går gjennom mål, systemer og hva som må være på plass. Dere får en skriftlig anbefaling.' },
    { title: 'Fast pris', text: 'Omfang og pris skrevet ned før vi starter. Ingen timer som løper.' },
    { title: 'Levering', text: 'Ukentlige avsjekker, testmiljø dere kan se i, og én kontaktperson hos oss.' },
    { title: 'Drift', text: 'Etter lansering velger dere en pakke, eller tar det selv med opplæringen dere har fått.' },
  ],
  faq: [
    { question: 'Hva er forskjellen på en tjeneste og en pakke?', answer: 'Tjenestene er prosjekter med start og slutt: ny butikk, migrering, ordreportal eller utvikling. Pakkene er løpende drift og videreutvikling etterpå, til fast månedspris.' },
    { question: 'Jobber dere bare med Shopify?', answer: 'Ja. Vi er Shopify Plus-partner og bygger alt på Shopify. Det gjør oss gode på det, og ærlige når Shopify ikke passer.' },
    { question: 'Hvor fort kan dere starte?', answer: 'Kartleggingen kan vi ta denne uken. Oppstart på prosjekt er vanligvis innen to til fire uker, avhengig av hva som er klart hos dere.' },
    { question: 'Kan vi kombinere flere tjenester?', answer: 'Ja, og det er vanlig. En migrering med ny ordreportal, eller en ny butikk med en konfigurator, prises som ett prosjekt med én tidsplan.' },
  ],
}
