/**
 * Depth content for the Tjenester / Services pages: the facts, deliverables,
 * prerequisites, related integrations, FAQ and onward links that give a service
 * page the same weight as an integration page. Hero and process copy stay in
 * the page components under components/pages/services (and in Sanity for
 * migrering/utvikling); this file only adds to them.
 *
 * `servicesDepth` / `servicesOverview` are the Norwegian originals;
 * `servicesDepthEn` / `servicesOverviewEn` the English ones. Every language
 * other than Norwegian renders English until it has its own copy, see
 * `serviceLang`.
 */

export type ServiceKey = 'shopify' | 'migrering' | 'b2b' | 'utvikling'

/** Languages that have their own service copy. Everything else falls back to English. */
export type ServiceLang = 'no' | 'en'

export function serviceLang(language: string): ServiceLang {
  return language === 'no' ? 'no' : 'en'
}

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

export interface ServicesOverview {
  chooser: { situation: string; service: string; href: string }[]
  process: { title: string; text: string }[]
  faq: { question: string; answer: string }[]
}

/** Overview page: which service fits which situation, and the common FAQ. */
export const servicesOverview: ServicesOverview = {
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

const PACKAGES_EN = '/services/all-packages'
const CASES_EN = '/work'
/** No English integrations hub yet; the partner page is the closest thing. */
const INTEGRATIONS_EN = '/partners'

export const servicesDepthEn: Record<ServiceKey, ServiceDepth> = {
  shopify: {
    key: 'shopify',
    headings: {
      facts: 'In short',
      deliverables: 'What a new store includes',
      deliverablesLead: 'Everything below is part of the fixed price. If it is not listed here, we agree on it before we start.',
      prerequisites: 'Before we start',
      integrations: 'Integrations we set up at the same time',
      integrationsLead: 'Most new stores need accounting, shipping and payments in place from day one. These are the connections we most often add during the build.',
      faq: 'Common questions about a new store',
      links: 'Read on',
    },
    facts: [
      { label: 'Timeline', value: '6–10 weeks', note: 'from discovery to launch' },
      { label: 'Pricing', value: 'Fixed price', note: 'agreed after discovery' },
      { label: 'Platform', value: 'Shopify / Plus', note: 'we recommend the right tier' },
      { label: 'After launch', value: 'Growth or Premium', note: 'operations and development' },
    ],
    deliverables: [
      { name: 'Theme and design', text: 'A Shopify theme adapted to your brand, set up mobile first and built to convert.', scope: 'Theme customisation. A fully custom-designed theme is a separate project.' },
      { name: 'Products and collections', text: 'A structure for products, variants, collections and navigation that holds up as the catalogue grows.' },
      { name: 'Payments', text: 'Shopify Payments, Vipps and, where relevant, Klarna or Qliro set up with the right taxes and currencies.' },
      { name: 'Shipping and delivery', text: 'Shipping rules, pickup points and connections to Bring, PostNord or Helthjem.' },
      { name: 'Accounting', text: 'Orders and payments flow into your accounting system without manual vouchers.', scope: 'Standard integration. Special bookkeeping rules are agreed separately.' },
      { name: 'Content and SEO foundation', text: 'Page setup, meta titles, URL structure and tracking (GA4, Meta) done right from the start.' },
      { name: 'The apps you need', text: 'Reviews, search and filtering, consent and email set up with apps we know well.', scope: 'Off-the-shelf apps. Custom-built features belong under Development.' },
      { name: 'Launch and training', text: 'Testing, domain and go-live, plus training so your team runs the store themselves.' },
    ],
    youBring: ['Logo, colours and images you own', 'Product data (names, prices, variants, images) in a spreadsheet or your current system', 'Access to your domain, accounting system and shipping agreements', 'One person on your side who can make decisions along the way'],
    weHandle: ['Shopify account, plan choice and setup', 'Taxes, currencies and Markets', 'Connections to accounting, shipping and payments', 'Consent and privacy (Consentmo)', 'Testing on mobile and desktop before launch'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/vipps-hurtigkasse', 'integrasjoner/bring', 'integrasjoner/klaviyo', 'integrasjoner/poweroffice-go', 'integrasjoner/klarna'],
    faq: [
      { question: 'Do we need Shopify Plus?', answer: 'Rarely from the start. Shopify Plus pays off when you have high volume, B2B in the same store, several markets or need a customised checkout. We recommend the tier based on your numbers, not the other way round.' },
      { question: 'What does a new store cost?', answer: 'We give a fixed price after a short discovery session, with the scope written down. The price depends on the theme, the number of integrations and how much content needs to be in place. Ongoing operations afterwards are covered by the packages.' },
      { question: 'Can we use our own design?', answer: 'Yes. If you have a finished design or design system, we build the theme to it. If not, we adapt a well-tested theme to your brand.' },
      { question: 'Who owns the store afterwards?', answer: 'You do. The Shopify account, the theme, the domain and all data are in your name from day one. We keep collaborator access for as long as you want us to.' },
      { question: 'What happens after launch?', answer: 'We keep an eye on the store for the first weeks. After that you choose a package for operations and further development, or run it yourselves with the training you have had.' },
    ],
    links: [
      { eyebrow: 'Packages', title: 'Operations and development after launch', text: 'Growth, Premium and Enterprise: a fixed monthly price, with everything in the package included.', href: PACKAGES_EN, linkText: 'See the packages' },
      { eyebrow: 'Case studies', title: 'Stores we have built', text: 'Results from Nordic brands that went live with us.', href: CASES_EN, linkText: 'See case studies' },
      { eyebrow: 'Partners', title: 'Everything the store can connect to', text: 'ERP, payments, logistics, PIM and marketing, with the partners we work with for each.', href: INTEGRATIONS_EN, linkText: 'See our partners' },
    ],
  },
  migrering: {
    key: 'migrering',
    headings: {
      facts: 'In short',
      deliverables: 'What we move',
      deliverablesLead: 'A migration is more than products. Everything below is included, and we check it against the old store before we switch.',
      prerequisites: 'Before we start',
      integrations: 'Integrations we reconnect at the same time',
      integrationsLead: 'Accounting, shipping and email have to work on Shopify the day you switch. These are the connections we most often set up as part of the migration.',
      faq: 'Common questions about migration',
      links: 'Read on',
    },
    facts: [
      { label: 'Timeline', value: '4–8 weeks', note: 'depending on data volume' },
      { label: 'Downtime', value: '0 hours', note: 'the new store is built alongside' },
      { label: 'SEO', value: 'Preserved', note: 'every URL redirected' },
      { label: 'Pricing', value: 'Fixed price', note: 'after discovery' },
    ],
    deliverables: [
      { name: 'Products and variants', text: 'All products, variants, images, prices and stock levels, cleaned up and structured for Shopify.' },
      { name: 'Customers and order history', text: 'Customer accounts and orders move with you, so you keep history and loyalty data.', scope: 'Passwords cannot be moved; customers set a new one at first login.' },
      { name: 'URLs and redirects', text: 'Every old URL gets a 301 to the right new page. The rankings come along.' },
      { name: 'Content', text: 'Pages, blog posts and landing pages moved into Shopify with metadata intact.' },
      { name: 'Integrations', text: 'Accounting, shipping, payments and email reconnected to Shopify before the switch.' },
      { name: 'Design', text: 'A theme adapted to your brand, or your current design recreated when that is what you want.' },
      { name: 'Testing and switch-over', text: 'Parallel running, test orders and a controlled domain switch at a time you choose.' },
      { name: 'Follow-up', text: 'We monitor search, error pages and order flow for the first weeks after the switch.' },
    ],
    youBring: ['Admin access to your current platform', 'An export of products, customers and orders (we help with the extraction)', 'An overview of your current integrations and apps', 'The date you would prefer to switch on'],
    weHandle: ['Data cleaning and mapping to the Shopify structure', 'URL mapping and 301 rules', 'Reconnecting accounting, shipping and payments', 'Test orders through the whole flow', 'Monitoring after the switch'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/24sevenoffice', 'integrasjoner/visma-net', 'integrasjoner/nshift', 'integrasjoner/klaviyo', 'integrasjoner/vipps-hurtigkasse'],
    faq: [
      { question: 'Will we lose our SEO rankings?', answer: 'Not when it is done right. We map every URL, set up 301 redirects and move the metadata. We follow Search Console for the first weeks and fix any deviations.' },
      { question: 'Does the store have to be down during the switch?', answer: 'No. The new store is built alongside the old one. The switch is a domain change that takes minutes, and we do it at a time with low traffic.' },
      { question: 'What about customer passwords?', answer: 'Passwords cannot be moved between platforms. Customers are asked to set a new password at first login, with a message we write together with you.' },
      { question: 'Which platforms do you migrate from?', answer: 'WooCommerce, Magento, 24Nettbutikk, Mystore, Quickbutik, Wix and custom-built solutions. If you are on something else, we work out the extraction together.' },
      { question: 'Can we keep our current design?', answer: 'Yes, if you want to. Often the migration is a good opportunity to tidy up design and structure, and we recommend it when it improves conversion.' },
    ],
    links: [
      { eyebrow: 'Packages', title: 'Operations after migration', text: 'Growth, Premium and Enterprise keep the store in shape after the move.', href: PACKAGES_EN, linkText: 'See the packages' },
      { eyebrow: 'Case studies', title: 'Stores that moved to Shopify', text: 'What happened to sales and operations after the migration.', href: CASES_EN, linkText: 'See case studies' },
      { eyebrow: 'Partners', title: 'The connections you need on Shopify', text: 'ERP, logistics and payments, with the partners we work with for each.', href: INTEGRATIONS_EN, linkText: 'See our partners' },
    ],
  },
  b2b: {
    key: 'b2b',
    headings: {
      facts: 'In short',
      deliverables: 'What an order portal includes',
      deliverablesLead: 'Everything your business customers need to order on their own, and everything you need to stop handling orders manually.',
      prerequisites: 'Before we start',
      integrations: 'The systems the portal talks to',
      integrationsLead: 'An order portal is only as good as the data behind it. Prices, stock and customers come from the ERP, and the orders go back there.',
      faq: 'Common questions about B2B on Shopify',
      links: 'Read on',
    },
    facts: [
      { label: 'Timeline', value: '4–8 weeks', note: 'depending on the ERP connection' },
      { label: 'Platform', value: 'Shopify Plus', note: 'B2B is a Plus feature' },
      { label: 'Same store', value: 'B2B + B2C', note: 'one catalogue, customer-specific prices' },
      { label: 'Pricing', value: 'Fixed price', note: 'after discovery' },
    ],
    deliverables: [
      { name: 'Companies and locations', text: 'Companies with several locations, contacts and roles, imported from the ERP or a spreadsheet.' },
      { name: 'Price lists and catalogues', text: 'Customer-specific prices, discounts and volume tiers per customer or customer group, and an assortment per agreement.' },
      { name: 'Payment terms', text: 'Buy on invoice with net 14/30 days, credit limits, and card or Vipps as an alternative.' },
      { name: 'Self-service ordering', text: 'Login, quick order, reorder from history and draft orders sent for approval.' },
      { name: 'ERP integration', text: 'Customers, prices and stock in from the ERP, orders and invoice data out.', scope: 'Standard connection to Tripletex, 24SevenOffice, Visma.net or Business Central. Other systems on request.' },
      { name: 'Trade-only content', text: 'Product sheets, campaigns and news that only business customers see.' },
      { name: 'Reseller onboarding', text: 'Invitations, guidance and a plan to move customers over from email and phone.' },
    ],
    youBring: ['A customer list with price agreements and terms', 'An ERP system with API access', 'A decision on who approves orders internally', 'The assortment to be sold B2B'],
    weHandle: ['Shopify Plus setup and B2B configuration', 'Mapping of prices and customer groups', 'ERP connection in both directions', 'Test orders with real customers', 'Training for your sales team'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/24sevenoffice', 'integrasjoner/business-central', 'integrasjoner/visma-net', 'integrasjoner/sparklayer', 'integrasjoner/omnium'],
    faq: [
      { question: 'Do we need Shopify Plus for B2B?', answer: 'For real B2B with company accounts, price lists and invoice terms: yes. For simple needs, such as a single discount group, there are apps on standard Shopify. We recommend what fits your volume.' },
      { question: 'Can B2B and B2C live in the same store?', answer: 'Yes, and that is often the best option. One catalogue, one inventory and one order flow, while business customers see their own prices after logging in. If you want to keep them fully separate, we set up a dedicated store.' },
      { question: 'How do prices come from the ERP?', answer: 'Price lists in the ERP are mapped to catalogues in Shopify and synced on a schedule or on change. The customer always sees the same price in the portal as on the invoice.' },
      { question: 'What about customers who order by email today?', answer: 'Most switch once the portal is easier than email. We set up an onboarding with invitations and help, and your sales team can place orders on behalf of customers during the transition.' },
      { question: 'Are invoices and credit limits supported?', answer: 'Yes. Payment terms are set per company, and the invoice is generated in the ERP through the integration, not in Shopify.' },
    ],
    links: [
      { eyebrow: 'Packages', title: 'B2B features from Premium and up', text: 'Customer-specific prices, catalogues and terms as part of ongoing operations.', href: PACKAGES_EN, linkText: 'See the packages' },
      { eyebrow: 'Case studies', title: 'B2B stores on Shopify', text: 'How Nordic wholesalers and brands moved orders from email to a portal.', href: CASES_EN, linkText: 'See case studies' },
      { eyebrow: 'Partners', title: 'ERP and accounting', text: 'Tripletex, 24SevenOffice, Visma.net and Business Central, and the partners behind them.', href: INTEGRATIONS_EN, linkText: 'See our partners' },
    ],
  },
  utvikling: {
    key: 'utvikling',
    headings: {
      facts: 'In short',
      deliverables: 'What we build',
      deliverablesLead: 'When an app does not exist, or is not good enough, we build it ourselves. This is what we deliver most often.',
      prerequisites: 'Before we start',
      integrations: 'Integrations we develop ourselves',
      integrationsLead: 'Custom work is often about data. These are the connections we have built with our own code or Make, and can extend for you.',
      faq: 'Common questions about development',
      links: 'Read on',
    },
    facts: [
      { label: 'Timeline', value: '2–12 weeks', note: 'depending on scope' },
      { label: 'Pricing', value: 'Fixed price', note: 'per deliverable' },
      { label: 'Technology', value: 'Liquid, React, Node', note: 'Shopify Functions and apps' },
      { label: 'Ownership', value: 'You own the code', note: 'everything in your repo' },
    ],
    deliverables: [
      { name: 'Product configurators', text: 'The customer builds the product themselves: dimensions, material, options and price in real time.' },
      { name: 'Custom Shopify apps', text: 'Functionality that is not in the App Store, built as a private app for your store.' },
      { name: 'Integrations', text: 'Connections to ERP, PIM, WMS and your own APIs, with custom code or Make.', scope: 'Standard connections are covered elsewhere. This is what has to be built.' },
      { name: 'Checkout and Shopify Functions', text: 'Customised checkout, discount logic, delivery rules and payment methods on Shopify Plus.' },
      { name: 'Agents and AI', text: 'Automation of customer service, product copy and data flows with AI agents that run in your systems.' },
      { name: 'Theme development', text: 'Custom sections, blocks and performance work beyond what a standard theme gives you.' },
      { name: 'Headless and storefront', text: 'A Hydrogen or Next.js store with Shopify as the backend when it actually pays off.', scope: 'We recommend headless only when a theme cannot solve the need.' },
    ],
    youBring: ['A description of the problem, not necessarily the solution', 'Access to the systems that need to talk to each other', 'Sample data we can test against', 'One person who can approve along the way'],
    weHandle: ['A specification with scope and fixed price', 'Development in a repo you own', 'A test environment before production', 'Documentation and handover', 'Operations and further development through the packages'],
    integrationSlugs: ['integrasjoner/visma-net', 'integrasjoner/tracklution', 'integrasjoner/tripletex', 'integrasjoner/front-systems', 'integrasjoner/omnium', 'integrasjoner/feed'],
    faq: [
      { question: 'When should we build instead of using an app?', answer: 'When the app does not cover the need, costs more than it gives, or slows the store down. We always check the App Store first, and tell you when an app is good enough.' },
      { question: 'Who owns the code?', answer: 'You do. Everything we build lives in a repo you own, with documentation. If you change agency, you take the code with you.' },
      { question: 'How is development priced?', answer: 'A fixed price per deliverable, based on a short specification we write together. Changes along the way are priced before they are made. Ongoing development is covered by Premium or Enterprise.' },
      { question: 'Do you build headless?', answer: 'Yes, when it pays off. For most stores a good theme gives a better result per krone. We recommend headless when you need something a theme cannot give you.' },
      { question: 'What about maintenance?', answer: 'Shopify changes its APIs regularly. Everything we build is followed up through the packages, so it keeps working as the platform changes.' },
    ],
    links: [
      { eyebrow: 'Packages', title: 'Custom development from Premium and up', text: 'Small and medium features as part of ongoing operations, bigger lifts as projects.', href: PACKAGES_EN, linkText: 'See the packages' },
      { eyebrow: 'Case studies', title: 'What we have built for others', text: 'Configurators, integrations and apps for Nordic brands.', href: CASES_EN, linkText: 'See case studies' },
      { eyebrow: 'Partners', title: 'Custom code vs. Make vs. app', text: 'How we choose the method for each connection, and what it means for you.', href: INTEGRATIONS_EN, linkText: 'See our partners' },
    ],
  },
}

export const servicesOverviewEn: ServicesOverview = {
  chooser: [
    { situation: 'We have no online store, or are starting over', service: 'A new store on Shopify', href: '/services/shopify' },
    { situation: 'We run a store on WooCommerce, Magento or 24Nettbutikk', service: 'Migration to Shopify', href: '/services/migrate' },
    { situation: 'Our resellers order by email and phone', service: 'B2B and order portal', href: '/services/b2b' },
    { situation: 'We need something that does not exist as an app', service: 'Development and custom work', href: '/services/shopify-development' },
    { situation: 'The store is live, we need someone to run and improve it', service: 'The packages: Growth, Premium, Enterprise', href: PACKAGES_EN },
    { situation: 'We are opening a physical store or want one system for POS and online', service: 'Nexus POS', href: '/nexuspos' },
  ],
  process: [
    { title: 'Discovery', text: 'An hour where we go through goals, systems and what needs to be in place. You get a written recommendation.' },
    { title: 'Fixed price', text: 'Scope and price written down before we start. No running hours.' },
    { title: 'Delivery', text: 'Weekly check-ins, a test environment you can look into, and one point of contact with us.' },
    { title: 'Operations', text: 'After launch you choose a package, or run it yourselves with the training you have had.' },
  ],
  faq: [
    { question: 'What is the difference between a service and a package?', answer: 'The services are projects with a start and an end: a new store, a migration, an order portal or development. The packages are ongoing operations and development afterwards, at a fixed monthly price.' },
    { question: 'Do you only work with Shopify?', answer: 'Yes. We are a Shopify Plus partner and build everything on Shopify. It makes us good at it, and honest when Shopify is not the right fit.' },
    { question: 'How soon can you start?', answer: 'We can do the discovery session this week. Project kick-off is usually within two to four weeks, depending on what is ready on your side.' },
    { question: 'Can we combine several services?', answer: 'Yes, and it is common. A migration with a new order portal, or a new store with a configurator, is priced as one project with one timeline.' },
  ],
}

const DEPTH_BY_LANG: Record<ServiceLang, Record<ServiceKey, ServiceDepth>> = { no: servicesDepth, en: servicesDepthEn }
const OVERVIEW_BY_LANG: Record<ServiceLang, ServicesOverview> = { no: servicesOverview, en: servicesOverviewEn }

/** Depth content for one service in the page language (English for everything but Norwegian). */
export function getServicesDepth(key: ServiceKey, language: string): ServiceDepth {
  return DEPTH_BY_LANG[serviceLang(language)][key]
}

export function getServicesOverview(language: string): ServicesOverview {
  return OVERVIEW_BY_LANG[serviceLang(language)]
}
