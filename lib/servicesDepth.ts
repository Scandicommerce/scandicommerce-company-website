/**
 * Depth content for the Tjenester / Services pages: the facts, deliverables,
 * prerequisites, related integrations, FAQ and onward links that give a service
 * page the same weight as an integration page. Hero and process copy stay in
 * the page components under components/pages/services (and in Sanity for
 * migrering/utvikling); this file only adds to them.
 *
 * `servicesDepth` / `servicesOverview` are the Norwegian originals;
 * `servicesDepthEn` / `servicesOverviewEn` the English ones, and the Sv / Da /
 * De variants the Swedish, Danish and German copy for scandicommerce.com.
 * Every other language renders English, see `serviceLang`.
 */

export type ServiceKey = 'shopify' | 'migrering' | 'b2b' | 'utvikling'

/** Languages that have their own service copy. Everything else falls back to English. */
export type ServiceLang = 'no' | 'en' | 'sv' | 'da' | 'de'

const SERVICE_LANGS: readonly ServiceLang[] = ['no', 'en', 'sv', 'da', 'de']

export function serviceLang(language: string): ServiceLang {
  return (SERVICE_LANGS as readonly string[]).includes(language) ? (language as ServiceLang) : 'en'
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

export const servicesDepthSv: Record<ServiceKey, ServiceDepth> = {
  shopify: {
    key: 'shopify',
    headings: {
      facts: 'Kort sagt',
      deliverables: 'Det här ingår i en ny butik',
      deliverablesLead: 'Allt nedan ingår i det fasta priset. Står det inte här kommer vi överens om det innan vi börjar.',
      prerequisites: 'Innan vi börjar',
      integrations: 'Integrationer vi sätter upp samtidigt',
      integrationsLead: 'De flesta nya butiker behöver bokföring, frakt och betalning på plats från dag ett. Det här är kopplingarna vi oftast lägger till under bygget.',
      faq: 'Vanliga frågor om ny butik',
      links: 'Läs vidare',
    },
    facts: [
      { label: 'Tidsram', value: '6–10 veckor', note: 'från kartläggning till lansering' },
      { label: 'Prismodell', value: 'Fast pris', note: 'avtalat efter kartläggning' },
      { label: 'Plattform', value: 'Shopify / Plus', note: 'vi rekommenderar rätt nivå' },
      { label: 'Efter lansering', value: 'Growth eller Premium', note: 'drift och vidareutveckling' },
    ],
    deliverables: [
      { name: 'Tema och design', text: 'Ett Shopify-tema anpassat till ert varumärke, byggt mobilt först och för att konvertera.', scope: 'Anpassning av tema. Ett helt egendesignat tema är ett separat projekt.' },
      { name: 'Produkter och kollektioner', text: 'En struktur för produkter, varianter, kollektioner och navigation som håller när sortimentet växer.' },
      { name: 'Betalning', text: 'Shopify Payments, Vipps och vid behov Klarna eller Qliro, uppsatta med rätt moms och valutor.' },
      { name: 'Frakt och leverans', text: 'Fraktregler, utlämningsställen och koppling till Bring, PostNord eller Helthjem.' },
      { name: 'Bokföring', text: 'Ordrar och betalningar förs över till ert ekonomisystem utan manuella verifikationer.', scope: 'Standardintegration. Särskilda bokföringsregler avtalas separat.' },
      { name: 'Innehåll och SEO-grund', text: 'Sidstruktur, metatitlar, URL-struktur och spårning (GA4, Meta) rätt från start.' },
      { name: 'Apparna ni behöver', text: 'Recensioner, sök och filtrering, samtycke och e-post uppsatta med appar vi känner väl.', scope: 'Färdiga appar. Egenutvecklade funktioner hör hemma under Utveckling.' },
      { name: 'Lansering och utbildning', text: 'Testning, domän och go-live, plus utbildning så att ert team driver butiken själva.' },
    ],
    youBring: ['Logotyp, färger och bilder ni äger', 'Produktdata (namn, priser, varianter, bilder) i ett kalkylblad eller ert nuvarande system', 'Åtkomst till domän, ekonomisystem och fraktavtal', 'En person hos er som kan fatta beslut längs vägen'],
    weHandle: ['Shopify-konto, val av plan och uppsättning', 'Moms, valutor och Markets', 'Kopplingar till bokföring, frakt och betalning', 'Samtycke och integritet (Consentmo)', 'Testning på mobil och desktop före lansering'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/vipps-hurtigkasse', 'integrasjoner/bring', 'integrasjoner/klaviyo', 'integrasjoner/poweroffice-go', 'integrasjoner/klarna'],
    faq: [
      { question: 'Behöver vi Shopify Plus?', answer: 'Sällan från start. Shopify Plus lönar sig när ni har höga volymer, B2B i samma butik, flera marknader eller behöver en anpassad kassa. Vi rekommenderar nivå utifrån era siffror, inte tvärtom.' },
      { question: 'Vad kostar en ny butik?', answer: 'Vi ger ett fast pris efter en kort kartläggning, med omfattningen nedskriven. Priset beror på tema, antal integrationer och hur mycket innehåll som ska på plats. Löpande drift efteråt täcks av paketen.' },
      { question: 'Kan vi använda vår egen design?', answer: 'Ja. Har ni en färdig design eller ett designsystem bygger vi temat efter det. Annars anpassar vi ett väl beprövat tema till ert varumärke.' },
      { question: 'Vem äger butiken efteråt?', answer: 'Ni. Shopify-kontot, temat, domänen och all data står i ert namn från dag ett. Vi behåller partneråtkomst så länge ni vill.' },
      { question: 'Vad händer efter lansering?', answer: 'Vi håller ett öga på butiken de första veckorna. Därefter väljer ni ett paket för drift och vidareutveckling, eller driver den själva med utbildningen ni fått.' },
    ],
    links: [
      { eyebrow: 'Paket', title: 'Drift och vidareutveckling efter lansering', text: 'Growth, Premium och Enterprise: fast månadspris, med allt i paketet inkluderat.', href: PACKAGES_EN, linkText: 'Se paketen' },
      { eyebrow: 'Kundcase', title: 'Butiker vi har byggt', text: 'Resultat från nordiska varumärken som gått live med oss.', href: CASES_EN, linkText: 'Se kundcase' },
      { eyebrow: 'Partner', title: 'Allt butiken kan kopplas till', text: 'ERP, betalning, logistik, PIM och marknadsföring, med partnerna vi arbetar med inom varje område.', href: INTEGRATIONS_EN, linkText: 'Se våra partner' },
    ],
  },
  migrering: {
    key: 'migrering',
    headings: {
      facts: 'Kort sagt',
      deliverables: 'Det här flyttar vi',
      deliverablesLead: 'En migrering är mer än produkter. Allt nedan ingår, och vi stämmer av det mot den gamla butiken innan vi byter.',
      prerequisites: 'Innan vi börjar',
      integrations: 'Integrationer vi kopplar om samtidigt',
      integrationsLead: 'Bokföring, frakt och e-post måste fungera på Shopify den dag ni byter. Det här är kopplingarna vi oftast sätter upp som en del av migreringen.',
      faq: 'Vanliga frågor om migrering',
      links: 'Läs vidare',
    },
    facts: [
      { label: 'Tidsram', value: '4–8 veckor', note: 'beroende på datamängd' },
      { label: 'Driftstopp', value: '0 timmar', note: 'den nya butiken byggs vid sidan av' },
      { label: 'SEO', value: 'Bevarad', note: 'varje URL vidarebefordras' },
      { label: 'Prismodell', value: 'Fast pris', note: 'efter kartläggning' },
    ],
    deliverables: [
      { name: 'Produkter och varianter', text: 'Alla produkter, varianter, bilder, priser och lagersaldon, rensade och strukturerade för Shopify.' },
      { name: 'Kunder och orderhistorik', text: 'Kundkonton och ordrar följer med, så att ni behåller historik och lojalitetsdata.', scope: 'Lösenord kan inte flyttas; kunderna sätter ett nytt vid första inloggningen.' },
      { name: 'URL:er och omdirigeringar', text: 'Varje gammal URL får en 301 till rätt ny sida. Rankingen följer med.' },
      { name: 'Innehåll', text: 'Sidor, blogginlägg och landningssidor flyttas in i Shopify med metadata intakt.' },
      { name: 'Integrationer', text: 'Bokföring, frakt, betalning och e-post omkopplade till Shopify före bytet.' },
      { name: 'Design', text: 'Ett tema anpassat till ert varumärke, eller er nuvarande design återskapad när det är vad ni vill ha.' },
      { name: 'Testning och byte', text: 'Parallelldrift, testordrar och ett kontrollerat domänbyte vid en tidpunkt ni väljer.' },
      { name: 'Uppföljning', text: 'Vi övervakar sök, felsidor och orderflöde de första veckorna efter bytet.' },
    ],
    youBring: ['Admin-åtkomst till er nuvarande plattform', 'En export av produkter, kunder och ordrar (vi hjälper till med uttaget)', 'En översikt över era nuvarande integrationer och appar', 'Datumet ni helst vill byta på'],
    weHandle: ['Datatvätt och mappning till Shopify-strukturen', 'URL-kartläggning och 301-regler', 'Omkoppling av bokföring, frakt och betalning', 'Testordrar genom hela flödet', 'Övervakning efter bytet'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/24sevenoffice', 'integrasjoner/visma-net', 'integrasjoner/nshift', 'integrasjoner/klaviyo', 'integrasjoner/vipps-hurtigkasse'],
    faq: [
      { question: 'Tappar vi våra SEO-rankingar?', answer: 'Inte när det görs rätt. Vi kartlägger varje URL, sätter upp 301-omdirigeringar och flyttar metadata. Vi följer Search Console de första veckorna och rättar avvikelser.' },
      { question: 'Måste butiken vara nere under bytet?', answer: 'Nej. Den nya butiken byggs vid sidan av den gamla. Bytet är en domänändring som tar några minuter, och vi gör det vid en tidpunkt med låg trafik.' },
      { question: 'Vad händer med kundernas lösenord?', answer: 'Lösenord kan inte flyttas mellan plattformar. Kunderna ombeds sätta ett nytt lösenord vid första inloggningen, med ett meddelande vi skriver tillsammans med er.' },
      { question: 'Vilka plattformar migrerar ni från?', answer: 'WooCommerce, Magento, 24Nettbutikk, Mystore, Quickbutik, Wix och egenutvecklade lösningar. Har ni något annat löser vi uttaget tillsammans.' },
      { question: 'Kan vi behålla vår nuvarande design?', answer: 'Ja, om ni vill. Ofta är migreringen ett bra tillfälle att städa i design och struktur, och vi rekommenderar det när det förbättrar konverteringen.' },
    ],
    links: [
      { eyebrow: 'Paket', title: 'Drift efter migreringen', text: 'Growth, Premium och Enterprise håller butiken i form efter flytten.', href: PACKAGES_EN, linkText: 'Se paketen' },
      { eyebrow: 'Kundcase', title: 'Butiker som flyttat till Shopify', text: 'Vad som hände med försäljning och drift efter migreringen.', href: CASES_EN, linkText: 'Se kundcase' },
      { eyebrow: 'Partner', title: 'Kopplingarna ni behöver på Shopify', text: 'ERP, logistik och betalning, med partnerna vi arbetar med inom varje område.', href: INTEGRATIONS_EN, linkText: 'Se våra partner' },
    ],
  },
  b2b: {
    key: 'b2b',
    headings: {
      facts: 'Kort sagt',
      deliverables: 'Det här ingår i en orderportal',
      deliverablesLead: 'Allt era företagskunder behöver för att beställa själva, och allt ni behöver för att slippa hantera ordrar manuellt.',
      prerequisites: 'Innan vi börjar',
      integrations: 'Systemen portalen pratar med',
      integrationsLead: 'En orderportal är aldrig bättre än datan bakom den. Priser, lager och kunder kommer från ERP-systemet, och ordrarna går tillbaka dit.',
      faq: 'Vanliga frågor om B2B på Shopify',
      links: 'Läs vidare',
    },
    facts: [
      { label: 'Tidsram', value: '4–8 veckor', note: 'beroende på ERP-koppling' },
      { label: 'Plattform', value: 'Shopify Plus', note: 'B2B är en Plus-funktion' },
      { label: 'Samma butik', value: 'B2B + B2C', note: 'en katalog, kundspecifika priser' },
      { label: 'Prismodell', value: 'Fast pris', note: 'efter kartläggning' },
    ],
    deliverables: [
      { name: 'Företag och platser', text: 'Företag med flera platser, kontaktpersoner och roller, importerade från ERP eller ett kalkylblad.' },
      { name: 'Prislistor och kataloger', text: 'Kundspecifika priser, rabatter och volymtrappor per kund eller kundgrupp, och ett sortiment per avtal.' },
      { name: 'Betalningsvillkor', text: 'Köp mot faktura med 14/30 dagar netto, kreditgränser, och kort eller Vipps som alternativ.' },
      { name: 'Självbetjänad beställning', text: 'Inloggning, snabborder, ombeställning från historik och orderutkast som skickas för godkännande.' },
      { name: 'ERP-integration', text: 'Kunder, priser och lager in från ERP, ordrar och fakturaunderlag ut.', scope: 'Standardkoppling till Tripletex, 24SevenOffice, Visma.net eller Business Central. Andra system på förfrågan.' },
      { name: 'Innehåll bara för återförsäljare', text: 'Produktblad, kampanjer och nyheter som bara företagskunder ser.' },
      { name: 'Onboarding av återförsäljare', text: 'Inbjudningar, vägledning och en plan för att flytta kunderna från e-post och telefon.' },
    ],
    youBring: ['En kundlista med prisavtal och villkor', 'Ett ERP-system med API-åtkomst', 'Ett beslut om vem som godkänner ordrar internt', 'Sortimentet som ska säljas B2B'],
    weHandle: ['Shopify Plus-uppsättning och B2B-konfiguration', 'Mappning av priser och kundgrupper', 'ERP-koppling i båda riktningarna', 'Testordrar med riktiga kunder', 'Utbildning av ert säljteam'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/24sevenoffice', 'integrasjoner/business-central', 'integrasjoner/visma-net', 'integrasjoner/sparklayer', 'integrasjoner/omnium'],
    faq: [
      { question: 'Behöver vi Shopify Plus för B2B?', answer: 'För riktig B2B med företagskonton, prislistor och fakturavillkor: ja. För enkla behov, som en enda rabattgrupp, finns det appar på vanliga Shopify. Vi rekommenderar det som passar er volym.' },
      { question: 'Kan B2B och B2C finnas i samma butik?', answer: 'Ja, och det är ofta det bästa alternativet. En katalog, ett lager och ett orderflöde, medan företagskunder ser sina egna priser efter inloggning. Vill ni hålla dem helt åtskilda sätter vi upp en separat butik.' },
      { question: 'Hur kommer priserna från ERP-systemet?', answer: 'Prislistor i ERP-systemet mappas till kataloger i Shopify och synkas enligt schema eller vid ändring. Kunden ser alltid samma pris i portalen som på fakturan.' },
      { question: 'Hur blir det med kunder som beställer via e-post i dag?', answer: 'De flesta går över när portalen är enklare än e-post. Vi sätter upp en onboarding med inbjudningar och hjälp, och ert säljteam kan lägga ordrar åt kunderna under övergången.' },
      { question: 'Stöds faktura och kreditgränser?', answer: 'Ja. Betalningsvillkor sätts per företag, och fakturan skapas i ERP-systemet via integrationen, inte i Shopify.' },
    ],
    links: [
      { eyebrow: 'Paket', title: 'B2B-funktioner från Premium och uppåt', text: 'Kundspecifika priser, kataloger och villkor som en del av den löpande driften.', href: PACKAGES_EN, linkText: 'Se paketen' },
      { eyebrow: 'Kundcase', title: 'B2B-butiker på Shopify', text: 'Hur nordiska grossister och varumärken flyttade ordrar från e-post till portal.', href: CASES_EN, linkText: 'Se kundcase' },
      { eyebrow: 'Partner', title: 'ERP och bokföring', text: 'Tripletex, 24SevenOffice, Visma.net och Business Central, och partnerna bakom dem.', href: INTEGRATIONS_EN, linkText: 'Se våra partner' },
    ],
  },
  utvikling: {
    key: 'utvikling',
    headings: {
      facts: 'Kort sagt',
      deliverables: 'Det här bygger vi',
      deliverablesLead: 'När en app inte finns, eller inte är tillräckligt bra, bygger vi den själva. Det här är vad vi levererar oftast.',
      prerequisites: 'Innan vi börjar',
      integrations: 'Integrationer vi utvecklar själva',
      integrationsLead: 'Skräddarsytt handlar ofta om data. Det här är kopplingarna vi har byggt med egen kod eller Make, och som vi kan bygga ut för er.',
      faq: 'Vanliga frågor om utveckling',
      links: 'Läs vidare',
    },
    facts: [
      { label: 'Tidsram', value: '2–12 veckor', note: 'beroende på omfattning' },
      { label: 'Prismodell', value: 'Fast pris', note: 'per leverans' },
      { label: 'Teknik', value: 'Liquid, React, Node', note: 'Shopify Functions och appar' },
      { label: 'Ägande', value: 'Ni äger koden', note: 'allt i ert repo' },
    ],
    deliverables: [
      { name: 'Produktkonfiguratorer', text: 'Kunden sätter ihop produkten själv: mått, material, tillval och pris i realtid.' },
      { name: 'Egna Shopify-appar', text: 'Funktionalitet som inte finns i App Store, byggd som en privat app för er butik.' },
      { name: 'Integrationer', text: 'Kopplingar till ERP, PIM, WMS och era egna API:er, med egen kod eller Make.', scope: 'Standardkopplingar täcks på annat håll. Det här är det som måste byggas.' },
      { name: 'Kassa och Shopify Functions', text: 'Anpassad kassa, rabattlogik, leveransregler och betalmetoder på Shopify Plus.' },
      { name: 'Agenter och AI', text: 'Automatisering av kundservice, produkttexter och dataflöden med AI-agenter som körs i era system.' },
      { name: 'Temautveckling', text: 'Egna sektioner, block och prestandaarbete utöver vad ett standardtema ger.' },
      { name: 'Headless och storefront', text: 'En Hydrogen- eller Next.js-butik med Shopify som backend när det faktiskt lönar sig.', scope: 'Vi rekommenderar headless bara när ett tema inte kan lösa behovet.' },
    ],
    youBring: ['En beskrivning av problemet, inte nödvändigtvis lösningen', 'Åtkomst till systemen som ska prata med varandra', 'Exempeldata vi kan testa mot', 'En person som kan godkänna längs vägen'],
    weHandle: ['En specifikation med omfattning och fast pris', 'Utveckling i ett repo ni äger', 'En testmiljö före produktion', 'Dokumentation och överlämning', 'Drift och vidareutveckling via paketen'],
    integrationSlugs: ['integrasjoner/visma-net', 'integrasjoner/tracklution', 'integrasjoner/tripletex', 'integrasjoner/front-systems', 'integrasjoner/omnium', 'integrasjoner/feed'],
    faq: [
      { question: 'När bör vi bygga själva i stället för att använda en app?', answer: 'När appen inte täcker behovet, kostar mer än den ger, eller gör butiken långsam. Vi kollar alltid App Store först, och säger till när en app räcker.' },
      { question: 'Vem äger koden?', answer: 'Ni. Allt vi bygger ligger i ett repo ni äger, med dokumentation. Byter ni byrå tar ni koden med er.' },
      { question: 'Hur prissätts utveckling?', answer: 'Fast pris per leverans, baserat på en kort specifikation vi skriver tillsammans. Ändringar längs vägen prissätts innan de görs. Löpande vidareutveckling täcks av Premium eller Enterprise.' },
      { question: 'Bygger ni headless?', answer: 'Ja, när det lönar sig. För de flesta butiker ger ett bra tema bättre resultat per krona. Vi rekommenderar headless när ni behöver något ett tema inte kan ge.' },
      { question: 'Hur blir det med underhåll?', answer: 'Shopify ändrar sina API:er regelbundet. Allt vi bygger följs upp via paketen, så att det fortsätter fungera när plattformen förändras.' },
    ],
    links: [
      { eyebrow: 'Paket', title: 'Skräddarsydd utveckling från Premium och uppåt', text: 'Små och medelstora funktioner som en del av den löpande driften, större lyft som projekt.', href: PACKAGES_EN, linkText: 'Se paketen' },
      { eyebrow: 'Kundcase', title: 'Det vi har byggt åt andra', text: 'Konfiguratorer, integrationer och appar hos nordiska varumärken.', href: CASES_EN, linkText: 'Se kundcase' },
      { eyebrow: 'Partner', title: 'Egen kod vs. Make vs. app', text: 'Hur vi väljer metod för varje koppling, och vad det betyder för er.', href: INTEGRATIONS_EN, linkText: 'Se våra partner' },
    ],
  },
}

export const servicesOverviewSv: ServicesOverview = {
  chooser: [
    { situation: 'Vi har ingen webbutik, eller börjar om från början', service: 'En ny butik på Shopify', href: '/services/shopify' },
    { situation: 'Vi driver en butik på WooCommerce, Magento eller 24Nettbutikk', service: 'Migrering till Shopify', href: '/services/migrate' },
    { situation: 'Våra återförsäljare beställer via e-post och telefon', service: 'B2B och orderportal', href: '/services/b2b' },
    { situation: 'Vi behöver något som inte finns som app', service: 'Utveckling och skräddarsytt', href: '/services/shopify-development' },
    { situation: 'Butiken är live, vi behöver någon som driver och förbättrar den', service: 'Paketen: Growth, Premium, Enterprise', href: PACKAGES_EN },
    { situation: 'Vi ska öppna fysisk butik eller vill ha ett system för kassa och webb', service: 'Nexus POS', href: '/nexuspos' },
  ],
  process: [
    { title: 'Kartläggning', text: 'En timme där vi går igenom mål, system och vad som måste vara på plats. Ni får en skriftlig rekommendation.' },
    { title: 'Fast pris', text: 'Omfattning och pris nedskrivna innan vi börjar. Inga löpande timmar.' },
    { title: 'Leverans', text: 'Veckovisa avstämningar, en testmiljö ni kan titta in i, och en kontaktperson hos oss.' },
    { title: 'Drift', text: 'Efter lansering väljer ni ett paket, eller driver den själva med utbildningen ni fått.' },
  ],
  faq: [
    { question: 'Vad är skillnaden mellan en tjänst och ett paket?', answer: 'Tjänsterna är projekt med start och slut: en ny butik, en migrering, en orderportal eller utveckling. Paketen är löpande drift och vidareutveckling efteråt, till fast månadspris.' },
    { question: 'Arbetar ni bara med Shopify?', answer: 'Ja. Vi är Shopify Plus-partner och bygger allt på Shopify. Det gör oss bra på det, och ärliga när Shopify inte passar.' },
    { question: 'Hur snabbt kan ni börja?', answer: 'Kartläggningen kan vi ta den här veckan. Projektstart sker vanligtvis inom två till fyra veckor, beroende på vad som är klart hos er.' },
    { question: 'Kan vi kombinera flera tjänster?', answer: 'Ja, och det är vanligt. En migrering med ny orderportal, eller en ny butik med en konfigurator, prissätts som ett projekt med en tidsplan.' },
  ],
}

export const servicesDepthDa: Record<ServiceKey, ServiceDepth> = {
  shopify: {
    key: 'shopify',
    headings: {
      facts: 'Kort fortalt',
      deliverables: 'Det indgår i en ny webshop',
      deliverablesLead: 'Alt herunder er med i den faste pris. Står det ikke her, aftaler vi det, før vi går i gang.',
      prerequisites: 'Før vi går i gang',
      integrations: 'Integrationer vi sætter op samtidig',
      integrationsLead: 'De fleste nye webshops skal have regnskab, fragt og betaling på plads fra dag ét. Det er de koblinger, vi oftest sætter op undervejs i bygningen.',
      faq: 'Ofte stillede spørgsmål om ny webshop',
      links: 'Læs videre',
    },
    facts: [
      { label: 'Tidsramme', value: '6–10 uger', note: 'fra afklaring til lancering' },
      { label: 'Prismodel', value: 'Fast pris', note: 'aftalt efter afklaring' },
      { label: 'Platform', value: 'Shopify / Plus', note: 'vi anbefaler det rigtige niveau' },
      { label: 'Efter lancering', value: 'Growth eller Premium', note: 'drift og videreudvikling' },
    ],
    deliverables: [
      { name: 'Tema og design', text: 'Et Shopify-tema tilpasset jeres brand, sat op mobile first og bygget til at konvertere.', scope: 'Tilpasning af tema. Et helt specialdesignet tema er et selvstændigt projekt.' },
      { name: 'Produkter og kollektioner', text: 'En struktur for produkter, varianter, kollektioner og navigation, der holder, når sortimentet vokser.' },
      { name: 'Betaling', text: 'Shopify Payments, Vipps og eventuelt Klarna eller Qliro sat op med korrekte afgifter og valutaer.' },
      { name: 'Fragt og levering', text: 'Fragtregler, afhentningssteder og kobling til Bring, PostNord eller Helthjem.' },
      { name: 'Regnskab', text: 'Ordrer og betalinger flyder ind i jeres regnskabssystem uden manuelle bilag.', scope: 'Standardintegration. Særlige bogføringsregler aftales separat.' },
      { name: 'Indhold og SEO-fundament', text: 'Sideopsætning, metatitler, URL-struktur og tracking (GA4, Meta) rigtigt fra start.' },
      { name: 'De apps, I har brug for', text: 'Anmeldelser, søgning og filtrering, samtykke og e-mail sat op med apps, vi kender godt.', scope: 'Færdige apps. Specialudviklede funktioner hører under Udvikling.' },
      { name: 'Lancering og oplæring', text: 'Test, domæne og go-live, plus oplæring, så jeres team selv kan drive shoppen.' },
    ],
    youBring: ['Logo, farver og billeder, I ejer', 'Produktdata (navne, priser, varianter, billeder) i et regneark eller jeres nuværende system', 'Adgang til domæne, regnskabssystem og fragtaftaler', 'Én person hos jer, der kan træffe beslutninger undervejs'],
    weHandle: ['Shopify-konto, valg af plan og opsætning', 'Afgifter, valutaer og Markets', 'Koblinger til regnskab, fragt og betaling', 'Samtykke og privatliv (Consentmo)', 'Test på mobil og desktop før lancering'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/vipps-hurtigkasse', 'integrasjoner/bring', 'integrasjoner/klaviyo', 'integrasjoner/poweroffice-go', 'integrasjoner/klarna'],
    faq: [
      { question: 'Har vi brug for Shopify Plus?', answer: 'Sjældent fra start. Shopify Plus betaler sig, når I har høj volumen, B2B i samme shop, flere markeder eller brug for en tilpasset checkout. Vi anbefaler niveauet ud fra jeres tal, ikke omvendt.' },
      { question: 'Hvad koster en ny webshop?', answer: 'Vi giver en fast pris efter en kort afklaring, hvor omfanget er skrevet ned. Prisen afhænger af tema, antal integrationer og hvor meget indhold, der skal på plads. Den løbende drift bagefter dækkes af pakkerne.' },
      { question: 'Kan vi bruge vores eget design?', answer: 'Ja. Har I et færdigt design eller designsystem, bygger vi temaet efter det. Hvis ikke, tilpasser vi et gennemtestet tema til jeres brand.' },
      { question: 'Hvem ejer shoppen bagefter?', answer: 'Det gør I. Shopify-kontoen, temaet, domænet og alle data står i jeres navn fra dag ét. Vi beholder samarbejdsadgang, så længe I ønsker det.' },
      { question: 'Hvad sker der efter lancering?', answer: 'Vi holder øje med shoppen de første uger. Derefter vælger I en pakke til drift og videreudvikling, eller driver den selv med den oplæring, I har fået.' },
    ],
    links: [
      { eyebrow: 'Pakker', title: 'Drift og videreudvikling efter lancering', text: 'Growth, Premium og Enterprise: fast månedspris, hvor alt i pakken er med.', href: PACKAGES_EN, linkText: 'Se pakkerne' },
      { eyebrow: 'Kundecases', title: 'Webshops vi har bygget', text: 'Resultater fra nordiske brands, der gik live med os.', href: CASES_EN, linkText: 'Se kundecases' },
      { eyebrow: 'Partnere', title: 'Alt, shoppen kan kobles til', text: 'ERP, betaling, logistik, PIM og marketing, med de partnere vi arbejder med på hvert område.', href: INTEGRATIONS_EN, linkText: 'Se vores partnere' },
    ],
  },
  migrering: {
    key: 'migrering',
    headings: {
      facts: 'Kort fortalt',
      deliverables: 'Det flytter vi',
      deliverablesLead: 'En migrering er mere end produkter. Alt herunder er med, og vi tjekker det mod den gamle shop, før vi skifter.',
      prerequisites: 'Før vi går i gang',
      integrations: 'Integrationer vi kobler om samtidig',
      integrationsLead: 'Regnskab, fragt og e-mail skal virke på Shopify den dag, I skifter. Det er de koblinger, vi oftest sætter op som en del af migreringen.',
      faq: 'Ofte stillede spørgsmål om migrering',
      links: 'Læs videre',
    },
    facts: [
      { label: 'Tidsramme', value: '4–8 uger', note: 'afhængigt af datamængde' },
      { label: 'Nedetid', value: '0 timer', note: 'den nye shop bygges ved siden af' },
      { label: 'SEO', value: 'Bevaret', note: 'alle URL\'er viderestilles' },
      { label: 'Prismodel', value: 'Fast pris', note: 'efter afklaring' },
    ],
    deliverables: [
      { name: 'Produkter og varianter', text: 'Alle produkter, varianter, billeder, priser og lagerbeholdninger, ryddet op og struktureret til Shopify.' },
      { name: 'Kunder og ordrehistorik', text: 'Kundekonti og ordrer flytter med, så I beholder historik og loyalitetsdata.', scope: 'Adgangskoder kan ikke flyttes; kunderne opretter en ny ved første login.' },
      { name: 'URL\'er og viderestillinger', text: 'Hver gammel URL får en 301 til den rigtige nye side. Placeringerne følger med.' },
      { name: 'Indhold', text: 'Sider, blogindlæg og landingssider flyttet ind i Shopify med metadata intakt.' },
      { name: 'Integrationer', text: 'Regnskab, fragt, betaling og e-mail koblet om til Shopify før skiftet.' },
      { name: 'Design', text: 'Et tema tilpasset jeres brand, eller jeres nuværende design genskabt, når det er det, I ønsker.' },
      { name: 'Test og skift', text: 'Parallel drift, testordrer og et kontrolleret domæneskift på et tidspunkt, I vælger.' },
      { name: 'Opfølgning', text: 'Vi overvåger søgning, fejlsider og ordreflow de første uger efter skiftet.' },
    ],
    youBring: ['Admin-adgang til jeres nuværende platform', 'En eksport af produkter, kunder og ordrer (vi hjælper med udtrækket)', 'Et overblik over jeres nuværende integrationer og apps', 'Den dato, I helst vil skifte på'],
    weHandle: ['Datavask og mapping til Shopify-strukturen', 'URL-kortlægning og 301-regler', 'Omkobling af regnskab, fragt og betaling', 'Testordrer gennem hele flowet', 'Overvågning efter skiftet'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/24sevenoffice', 'integrasjoner/visma-net', 'integrasjoner/nshift', 'integrasjoner/klaviyo', 'integrasjoner/vipps-hurtigkasse'],
    faq: [
      { question: 'Mister vi vores SEO-placeringer?', answer: 'Ikke når det gøres rigtigt. Vi kortlægger hver URL, sætter 301-viderestillinger op og flytter metadata. Vi følger Search Console de første uger og retter afvigelser.' },
      { question: 'Skal shoppen være nede under skiftet?', answer: 'Nej. Den nye shop bygges ved siden af den gamle. Skiftet er en domæneændring, der tager få minutter, og vi gør det på et tidspunkt med lav trafik.' },
      { question: 'Hvad med kundernes adgangskoder?', answer: 'Adgangskoder kan ikke flyttes mellem platforme. Kunderne bliver bedt om at oprette en ny adgangskode ved første login, med en besked vi skriver sammen med jer.' },
      { question: 'Hvilke platforme migrerer I fra?', answer: 'WooCommerce, Magento, 24Nettbutikk, Mystore, Quickbutik, Wix og specialudviklede løsninger. Bruger I noget andet, finder vi ud af udtrækket sammen.' },
      { question: 'Kan vi beholde vores nuværende design?', answer: 'Ja, hvis I vil. Migreringen er ofte en god anledning til at rydde op i design og struktur, og vi anbefaler det, når det giver bedre konvertering.' },
    ],
    links: [
      { eyebrow: 'Pakker', title: 'Drift efter migreringen', text: 'Growth, Premium og Enterprise holder shoppen i form efter flytningen.', href: PACKAGES_EN, linkText: 'Se pakkerne' },
      { eyebrow: 'Kundecases', title: 'Webshops der er flyttet til Shopify', text: 'Hvad der skete med salg og drift efter migreringen.', href: CASES_EN, linkText: 'Se kundecases' },
      { eyebrow: 'Partnere', title: 'De koblinger, I har brug for på Shopify', text: 'ERP, logistik og betaling, med de partnere vi arbejder med på hvert område.', href: INTEGRATIONS_EN, linkText: 'Se vores partnere' },
    ],
  },
  b2b: {
    key: 'b2b',
    headings: {
      facts: 'Kort fortalt',
      deliverables: 'Det indgår i en ordreportal',
      deliverablesLead: 'Alt jeres erhvervskunder skal bruge for at bestille selv, og alt I skal bruge for at slippe for manuelle ordrer.',
      prerequisites: 'Før vi går i gang',
      integrations: 'De systemer, portalen taler med',
      integrationsLead: 'En ordreportal er kun så god som dataene bag den. Priser, lager og kunder kommer fra ERP-systemet, og ordrerne går tilbage dertil.',
      faq: 'Ofte stillede spørgsmål om B2B på Shopify',
      links: 'Læs videre',
    },
    facts: [
      { label: 'Tidsramme', value: '4–8 uger', note: 'afhængigt af ERP-kobling' },
      { label: 'Platform', value: 'Shopify Plus', note: 'B2B er en Plus-funktion' },
      { label: 'Samme shop', value: 'B2B + B2C', note: 'ét katalog, kundespecifikke priser' },
      { label: 'Prismodel', value: 'Fast pris', note: 'efter afklaring' },
    ],
    deliverables: [
      { name: 'Virksomheder og lokationer', text: 'Virksomheder med flere lokationer, kontaktpersoner og roller, importeret fra ERP eller et regneark.' },
      { name: 'Prislister og kataloger', text: 'Kundespecifikke priser, rabatter og mængderabatter per kunde eller kundegruppe, og et sortiment per aftale.' },
      { name: 'Betalingsbetingelser', text: 'Køb på faktura med netto 14/30 dage, kreditgrænser, og kort eller Vipps som alternativ.' },
      { name: 'Selvbetjent bestilling', text: 'Login, hurtigbestilling, genbestilling fra historik og ordrekladder, der sendes til godkendelse.' },
      { name: 'ERP-integration', text: 'Kunder, priser og lager ind fra ERP, ordrer og fakturagrundlag ud.', scope: 'Standardkobling til Tripletex, 24SevenOffice, Visma.net eller Business Central. Andre systemer efter aftale.' },
      { name: 'Indhold kun for forhandlere', text: 'Produktark, kampagner og nyheder, som kun erhvervskunder ser.' },
      { name: 'Onboarding af forhandlere', text: 'Invitationer, vejledning og en plan for at flytte kunderne over fra e-mail og telefon.' },
    ],
    youBring: ['En kundeliste med prisaftaler og betingelser', 'Et ERP-system med API-adgang', 'En beslutning om, hvem der godkender ordrer internt', 'Det sortiment, der skal sælges B2B'],
    weHandle: ['Shopify Plus-opsætning og B2B-konfiguration', 'Mapping af priser og kundegrupper', 'ERP-kobling begge veje', 'Testordrer med rigtige kunder', 'Oplæring af jeres sælgere'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/24sevenoffice', 'integrasjoner/business-central', 'integrasjoner/visma-net', 'integrasjoner/sparklayer', 'integrasjoner/omnium'],
    faq: [
      { question: 'Skal vi have Shopify Plus til B2B?', answer: 'Til rigtig B2B med virksomhedskonti, prislister og fakturabetingelser: ja. Til enkle behov, som én rabatgruppe, findes der apps på almindelig Shopify. Vi anbefaler det, der passer til jeres volumen.' },
      { question: 'Kan B2B og B2C være i samme shop?', answer: 'Ja, og det er ofte den bedste løsning. Ét katalog, ét lager og ét ordreflow, mens erhvervskunder ser deres egne priser efter login. Vil I holde dem helt adskilt, sætter vi en separat shop op.' },
      { question: 'Hvordan kommer priserne fra ERP-systemet?', answer: 'Prislister i ERP-systemet mappes til kataloger i Shopify og synkroniseres efter plan eller ved ændring. Kunden ser altid samme pris i portalen som på fakturaen.' },
      { question: 'Hvad med kunder, der bestiller på e-mail i dag?', answer: 'De fleste skifter, når portalen er nemmere end e-mail. Vi sætter en onboarding op med invitationer og hjælp, og jeres sælgere kan lægge ordrer på vegne af kunderne i overgangen.' },
      { question: 'Understøttes faktura og kreditgrænser?', answer: 'Ja. Betalingsbetingelser sættes per virksomhed, og fakturaen genereres i ERP-systemet via integrationen, ikke i Shopify.' },
    ],
    links: [
      { eyebrow: 'Pakker', title: 'B2B-funktioner fra Premium og op', text: 'Kundespecifikke priser, kataloger og betingelser som en del af den løbende drift.', href: PACKAGES_EN, linkText: 'Se pakkerne' },
      { eyebrow: 'Kundecases', title: 'B2B-shops på Shopify', text: 'Hvordan nordiske grossister og brands flyttede ordrer fra e-mail til portal.', href: CASES_EN, linkText: 'Se kundecases' },
      { eyebrow: 'Partnere', title: 'ERP og regnskab', text: 'Tripletex, 24SevenOffice, Visma.net og Business Central, og partnerne bag dem.', href: INTEGRATIONS_EN, linkText: 'Se vores partnere' },
    ],
  },
  utvikling: {
    key: 'utvikling',
    headings: {
      facts: 'Kort fortalt',
      deliverables: 'Det bygger vi',
      deliverablesLead: 'Når en app ikke findes, eller ikke er god nok, bygger vi den selv. Det her er det, vi oftest leverer.',
      prerequisites: 'Før vi går i gang',
      integrations: 'Integrationer vi selv udvikler',
      integrationsLead: 'Skræddersyet arbejde handler ofte om data. Det er de koblinger, vi har bygget med egen kode eller Make, og som vi kan udvide for jer.',
      faq: 'Ofte stillede spørgsmål om udvikling',
      links: 'Læs videre',
    },
    facts: [
      { label: 'Tidsramme', value: '2–12 uger', note: 'afhængigt af omfang' },
      { label: 'Prismodel', value: 'Fast pris', note: 'per leverance' },
      { label: 'Teknologi', value: 'Liquid, React, Node', note: 'Shopify Functions og apps' },
      { label: 'Ejerskab', value: 'I ejer koden', note: 'alt i jeres repo' },
    ],
    deliverables: [
      { name: 'Produktkonfiguratorer', text: 'Kunden sammensætter selv produktet: mål, materiale, tilvalg og pris i realtid.' },
      { name: 'Egne Shopify-apps', text: 'Funktionalitet, der ikke findes i App Store, bygget som en privat app til jeres shop.' },
      { name: 'Integrationer', text: 'Koblinger til ERP, PIM, WMS og jeres egne API\'er, med egen kode eller Make.', scope: 'Standardkoblinger er dækket andetsteds. Det her er det, der skal bygges.' },
      { name: 'Checkout og Shopify Functions', text: 'Tilpasset checkout, rabatlogik, leveringsregler og betalingsmetoder på Shopify Plus.' },
      { name: 'Agenter og AI', text: 'Automatisering af kundeservice, produkttekster og dataflows med AI-agenter, der kører i jeres systemer.' },
      { name: 'Temaudvikling', text: 'Egne sektioner, blokke og performancearbejde ud over det, et standardtema giver.' },
      { name: 'Headless og storefront', text: 'En Hydrogen- eller Next.js-shop med Shopify som backend, når det faktisk betaler sig.', scope: 'Vi anbefaler kun headless, når et tema ikke kan løse behovet.' },
    ],
    youBring: ['En beskrivelse af problemet, ikke nødvendigvis løsningen', 'Adgang til de systemer, der skal tale sammen', 'Eksempeldata vi kan teste mod', 'Én person, der kan godkende undervejs'],
    weHandle: ['En specifikation med omfang og fast pris', 'Udvikling i et repo, I ejer', 'Et testmiljø før produktion', 'Dokumentation og overlevering', 'Drift og videreudvikling gennem pakkerne'],
    integrationSlugs: ['integrasjoner/visma-net', 'integrasjoner/tracklution', 'integrasjoner/tripletex', 'integrasjoner/front-systems', 'integrasjoner/omnium', 'integrasjoner/feed'],
    faq: [
      { question: 'Hvornår bør vi bygge selv i stedet for at bruge en app?', answer: 'Når appen ikke dækker behovet, koster mere, end den giver, eller gør shoppen langsom. Vi tjekker altid App Store først og siger til, når en app er god nok.' },
      { question: 'Hvem ejer koden?', answer: 'Det gør I. Alt, vi bygger, ligger i et repo, I ejer, med dokumentation. Skifter I bureau, tager I koden med.' },
      { question: 'Hvordan prissættes udvikling?', answer: 'Fast pris per leverance, baseret på en kort specifikation, vi skriver sammen. Ændringer undervejs prissættes, før de laves. Løbende videreudvikling dækkes af Premium eller Enterprise.' },
      { question: 'Bygger I headless?', answer: 'Ja, når det betaler sig. For de fleste shops giver et godt tema bedre resultat per krone. Vi anbefaler headless, når I har brug for noget, et tema ikke kan give.' },
      { question: 'Hvad med vedligeholdelse?', answer: 'Shopify ændrer sine API\'er jævnligt. Alt, vi bygger, følges op gennem pakkerne, så det bliver ved med at virke, når platformen ændrer sig.' },
    ],
    links: [
      { eyebrow: 'Pakker', title: 'Skræddersyet udvikling fra Premium og op', text: 'Små og mellemstore funktioner som en del af den løbende drift, større løft som projekter.', href: PACKAGES_EN, linkText: 'Se pakkerne' },
      { eyebrow: 'Kundecases', title: 'Det vi har bygget for andre', text: 'Konfiguratorer, integrationer og apps hos nordiske brands.', href: CASES_EN, linkText: 'Se kundecases' },
      { eyebrow: 'Partnere', title: 'Egen kode vs. Make vs. app', text: 'Hvordan vi vælger metode til hver kobling, og hvad det betyder for jer.', href: INTEGRATIONS_EN, linkText: 'Se vores partnere' },
    ],
  },
}

export const servicesOverviewDa: ServicesOverview = {
  chooser: [
    { situation: 'Vi har ingen webshop, eller starter forfra', service: 'En ny webshop på Shopify', href: '/services/shopify' },
    { situation: 'Vi har en shop på WooCommerce, Magento eller 24Nettbutikk', service: 'Migrering til Shopify', href: '/services/migrate' },
    { situation: 'Vores forhandlere bestiller på e-mail og telefon', service: 'B2B og ordreportal', href: '/services/b2b' },
    { situation: 'Vi har brug for noget, der ikke findes som app', service: 'Udvikling og skræddersyet arbejde', href: '/services/shopify-development' },
    { situation: 'Shoppen er live, vi har brug for nogen til at drive og forbedre den', service: 'Pakkerne: Growth, Premium, Enterprise', href: PACKAGES_EN },
    { situation: 'Vi åbner fysisk butik eller vil samle kasse og webshop i ét system', service: 'Nexus POS', href: '/nexuspos' },
  ],
  process: [
    { title: 'Afklaring', text: 'En time, hvor vi gennemgår mål, systemer og hvad der skal være på plads. I får en skriftlig anbefaling.' },
    { title: 'Fast pris', text: 'Omfang og pris skrevet ned, før vi går i gang. Ingen løbende timer.' },
    { title: 'Levering', text: 'Ugentlige afstemninger, et testmiljø I kan kigge ind i, og én kontaktperson hos os.' },
    { title: 'Drift', text: 'Efter lancering vælger I en pakke, eller driver den selv med den oplæring, I har fået.' },
  ],
  faq: [
    { question: 'Hvad er forskellen på en ydelse og en pakke?', answer: 'Ydelserne er projekter med start og slut: en ny webshop, en migrering, en ordreportal eller udvikling. Pakkerne er løbende drift og videreudvikling bagefter, til fast månedspris.' },
    { question: 'Arbejder I kun med Shopify?', answer: 'Ja. Vi er Shopify Plus-partner og bygger alt på Shopify. Det gør os gode til det, og ærlige når Shopify ikke passer.' },
    { question: 'Hvor hurtigt kan I starte?', answer: 'Afklaringen kan vi tage i denne uge. Projektstart er typisk inden for to til fire uger, afhængigt af hvad der er klar hos jer.' },
    { question: 'Kan vi kombinere flere ydelser?', answer: 'Ja, og det er almindeligt. En migrering med ny ordreportal, eller en ny webshop med en konfigurator, prissættes som ét projekt med én tidsplan.' },
  ],
}

export const servicesDepthDe: Record<ServiceKey, ServiceDepth> = {
  shopify: {
    key: 'shopify',
    headings: {
      facts: 'Kurz gesagt',
      deliverables: 'Das gehört zu einem neuen Shop',
      deliverablesLead: 'Alles Folgende ist im Festpreis enthalten. Steht es hier nicht, stimmen wir es vor dem Start ab.',
      prerequisites: 'Bevor wir starten',
      integrations: 'Integrationen, die wir gleich mit einrichten',
      integrationsLead: 'Die meisten neuen Shops brauchen Buchhaltung, Versand und Zahlung ab Tag eins. Das sind die Anbindungen, die wir beim Aufbau am häufigsten ergänzen.',
      faq: 'Häufige Fragen zum neuen Shop',
      links: 'Weiterlesen',
    },
    facts: [
      { label: 'Zeitrahmen', value: '6–10 Wochen', note: 'von der Analyse bis zum Launch' },
      { label: 'Preismodell', value: 'Festpreis', note: 'nach der Analyse vereinbart' },
      { label: 'Plattform', value: 'Shopify / Plus', note: 'wir empfehlen die passende Stufe' },
      { label: 'Nach dem Launch', value: 'Growth oder Premium', note: 'Betrieb und Weiterentwicklung' },
    ],
    deliverables: [
      { name: 'Theme und Design', text: 'Ein Shopify-Theme, angepasst an Ihre Marke, mobile first aufgesetzt und auf Conversion ausgelegt.', scope: 'Anpassung eines Themes. Ein vollständig individuell gestaltetes Theme ist ein eigenes Projekt.' },
      { name: 'Produkte und Kollektionen', text: 'Eine Struktur für Produkte, Varianten, Kollektionen und Navigation, die auch mit wachsendem Sortiment trägt.' },
      { name: 'Zahlung', text: 'Shopify Payments, Vipps und bei Bedarf Klarna oder Qliro, eingerichtet mit den richtigen Steuern und Währungen.' },
      { name: 'Versand und Lieferung', text: 'Versandregeln, Abholstationen und Anbindung an Bring, PostNord oder Helthjem.' },
      { name: 'Buchhaltung', text: 'Bestellungen und Zahlungen fließen ohne manuelle Belege in Ihr Buchhaltungssystem.', scope: 'Standardintegration. Besondere Buchungsregeln werden separat vereinbart.' },
      { name: 'Inhalte und SEO-Grundlage', text: 'Seitenaufbau, Meta-Titel, URL-Struktur und Tracking (GA4, Meta) von Anfang an richtig.' },
      { name: 'Die Apps, die Sie brauchen', text: 'Bewertungen, Suche und Filter, Consent und E-Mail, eingerichtet mit Apps, die wir gut kennen.', scope: 'Fertige Apps. Individuell entwickelte Funktionen gehören zur Entwicklung.' },
      { name: 'Launch und Schulung', text: 'Tests, Domain und Go-live, plus Schulung, damit Ihr Team den Shop selbst betreibt.' },
    ],
    youBring: ['Logo, Farben und Bilder, die Ihnen gehören', 'Produktdaten (Namen, Preise, Varianten, Bilder) in einer Tabelle oder Ihrem bisherigen System', 'Zugang zu Domain, Buchhaltungssystem und Versandverträgen', 'Eine Person auf Ihrer Seite, die unterwegs Entscheidungen treffen kann'],
    weHandle: ['Shopify-Konto, Planwahl und Einrichtung', 'Steuern, Währungen und Markets', 'Anbindung an Buchhaltung, Versand und Zahlung', 'Consent und Datenschutz (Consentmo)', 'Tests auf Mobilgerät und Desktop vor dem Launch'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/vipps-hurtigkasse', 'integrasjoner/bring', 'integrasjoner/klaviyo', 'integrasjoner/poweroffice-go', 'integrasjoner/klarna'],
    faq: [
      { question: 'Brauchen wir Shopify Plus?', answer: 'Selten von Anfang an. Shopify Plus lohnt sich bei hohem Volumen, B2B im selben Shop, mehreren Märkten oder wenn Sie einen angepassten Checkout brauchen. Wir empfehlen die Stufe anhand Ihrer Zahlen, nicht umgekehrt.' },
      { question: 'Was kostet ein neuer Shop?', answer: 'Wir nennen nach einer kurzen Analyse einen Festpreis, mit schriftlich festgehaltenem Umfang. Der Preis hängt vom Theme, der Anzahl der Integrationen und der Menge an Inhalten ab. Der laufende Betrieb danach wird über die Pakete abgedeckt.' },
      { question: 'Können wir unser eigenes Design verwenden?', answer: 'Ja. Wenn Sie ein fertiges Design oder Designsystem haben, bauen wir das Theme danach. Wenn nicht, passen wir ein bewährtes Theme an Ihre Marke an.' },
      { question: 'Wem gehört der Shop danach?', answer: 'Ihnen. Shopify-Konto, Theme, Domain und alle Daten laufen ab Tag eins auf Ihren Namen. Wir behalten den Partnerzugang, solange Sie es wünschen.' },
      { question: 'Was passiert nach dem Launch?', answer: 'Wir behalten den Shop in den ersten Wochen im Blick. Danach wählen Sie ein Paket für Betrieb und Weiterentwicklung, oder Sie übernehmen selbst mit der Schulung, die Sie erhalten haben.' },
    ],
    links: [
      { eyebrow: 'Pakete', title: 'Betrieb und Weiterentwicklung nach dem Launch', text: 'Growth, Premium und Enterprise: fester Monatspreis, alles im Paket inklusive.', href: PACKAGES_EN, linkText: 'Pakete ansehen' },
      { eyebrow: 'Kundenprojekte', title: 'Shops, die wir gebaut haben', text: 'Ergebnisse nordischer Marken, die mit uns live gegangen sind.', href: CASES_EN, linkText: 'Kundenprojekte ansehen' },
      { eyebrow: 'Partner', title: 'Alles, womit sich der Shop verbinden lässt', text: 'ERP, Zahlung, Logistik, PIM und Marketing, mit den Partnern, mit denen wir jeweils arbeiten.', href: INTEGRATIONS_EN, linkText: 'Unsere Partner ansehen' },
    ],
  },
  migrering: {
    key: 'migrering',
    headings: {
      facts: 'Kurz gesagt',
      deliverables: 'Das ziehen wir um',
      deliverablesLead: 'Eine Migration ist mehr als Produkte. Alles Folgende ist enthalten, und wir gleichen es vor dem Wechsel mit dem alten Shop ab.',
      prerequisites: 'Bevor wir starten',
      integrations: 'Integrationen, die wir gleich mit umstellen',
      integrationsLead: 'Buchhaltung, Versand und E-Mail müssen am Tag des Wechsels auf Shopify funktionieren. Das sind die Anbindungen, die wir am häufigsten als Teil der Migration einrichten.',
      faq: 'Häufige Fragen zur Migration',
      links: 'Weiterlesen',
    },
    facts: [
      { label: 'Zeitrahmen', value: '4–8 Wochen', note: 'je nach Datenmenge' },
      { label: 'Ausfallzeit', value: '0 Stunden', note: 'der neue Shop entsteht parallel' },
      { label: 'SEO', value: 'Erhalten', note: 'jede URL wird weitergeleitet' },
      { label: 'Preismodell', value: 'Festpreis', note: 'nach der Analyse' },
    ],
    deliverables: [
      { name: 'Produkte und Varianten', text: 'Alle Produkte, Varianten, Bilder, Preise und Lagerbestände, bereinigt und für Shopify strukturiert.' },
      { name: 'Kunden und Bestellhistorie', text: 'Kundenkonten und Bestellungen ziehen mit um, sodass Historie und Treuedaten erhalten bleiben.', scope: 'Passwörter lassen sich nicht übertragen; Kunden vergeben beim ersten Login ein neues.' },
      { name: 'URLs und Weiterleitungen', text: 'Jede alte URL bekommt eine 301-Weiterleitung auf die richtige neue Seite. Die Rankings ziehen mit.' },
      { name: 'Inhalte', text: 'Seiten, Blogbeiträge und Landingpages werden mit intakten Metadaten nach Shopify übernommen.' },
      { name: 'Integrationen', text: 'Buchhaltung, Versand, Zahlung und E-Mail vor dem Wechsel auf Shopify umgestellt.' },
      { name: 'Design', text: 'Ein Theme, angepasst an Ihre Marke, oder Ihr bisheriges Design nachgebaut, wenn Sie das wünschen.' },
      { name: 'Test und Umstellung', text: 'Parallelbetrieb, Testbestellungen und ein kontrollierter Domainwechsel zu einem Zeitpunkt Ihrer Wahl.' },
      { name: 'Nachbetreuung', text: 'Wir überwachen Suche, Fehlerseiten und Bestellfluss in den ersten Wochen nach dem Wechsel.' },
    ],
    youBring: ['Admin-Zugang zu Ihrer bisherigen Plattform', 'Einen Export von Produkten, Kunden und Bestellungen (wir helfen beim Auslesen)', 'Eine Übersicht Ihrer bisherigen Integrationen und Apps', 'Das Datum, an dem Sie am liebsten wechseln möchten'],
    weHandle: ['Datenbereinigung und Mapping auf die Shopify-Struktur', 'URL-Mapping und 301-Regeln', 'Umstellung von Buchhaltung, Versand und Zahlung', 'Testbestellungen durch den gesamten Ablauf', 'Überwachung nach dem Wechsel'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/24sevenoffice', 'integrasjoner/visma-net', 'integrasjoner/nshift', 'integrasjoner/klaviyo', 'integrasjoner/vipps-hurtigkasse'],
    faq: [
      { question: 'Verlieren wir unsere SEO-Rankings?', answer: 'Nicht, wenn es richtig gemacht wird. Wir erfassen jede URL, richten 301-Weiterleitungen ein und übernehmen die Metadaten. In den ersten Wochen beobachten wir die Search Console und beheben Abweichungen.' },
      { question: 'Muss der Shop während des Wechsels offline sein?', answer: 'Nein. Der neue Shop entsteht parallel zum alten. Der Wechsel ist eine Domainänderung, die Minuten dauert, und wir legen ihn in eine Zeit mit wenig Traffic.' },
      { question: 'Was passiert mit den Kundenpasswörtern?', answer: 'Passwörter lassen sich nicht zwischen Plattformen übertragen. Kunden werden beim ersten Login gebeten, ein neues Passwort zu vergeben, mit einem Text, den wir gemeinsam mit Ihnen formulieren.' },
      { question: 'Von welchen Plattformen migrieren Sie?', answer: 'WooCommerce, Magento, 24Nettbutikk, Mystore, Quickbutik, Wix und Eigenentwicklungen. Nutzen Sie etwas anderes, klären wir das Auslesen gemeinsam.' },
      { question: 'Können wir unser bisheriges Design behalten?', answer: 'Ja, wenn Sie möchten. Oft ist die Migration eine gute Gelegenheit, Design und Struktur aufzuräumen, und wir empfehlen es, wenn es die Conversion verbessert.' },
    ],
    links: [
      { eyebrow: 'Pakete', title: 'Betrieb nach der Migration', text: 'Growth, Premium und Enterprise halten den Shop nach dem Umzug in Form.', href: PACKAGES_EN, linkText: 'Pakete ansehen' },
      { eyebrow: 'Kundenprojekte', title: 'Shops, die zu Shopify gewechselt sind', text: 'Was nach der Migration mit Umsatz und Betrieb passiert ist.', href: CASES_EN, linkText: 'Kundenprojekte ansehen' },
      { eyebrow: 'Partner', title: 'Die Anbindungen, die Sie auf Shopify brauchen', text: 'ERP, Logistik und Zahlung, mit den Partnern, mit denen wir jeweils arbeiten.', href: INTEGRATIONS_EN, linkText: 'Unsere Partner ansehen' },
    ],
  },
  b2b: {
    key: 'b2b',
    headings: {
      facts: 'Kurz gesagt',
      deliverables: 'Das gehört zu einem Bestellportal',
      deliverablesLead: 'Alles, was Ihre Geschäftskunden brauchen, um selbst zu bestellen, und alles, was Sie brauchen, um Bestellungen nicht mehr manuell zu bearbeiten.',
      prerequisites: 'Bevor wir starten',
      integrations: 'Die Systeme, mit denen das Portal spricht',
      integrationsLead: 'Ein Bestellportal ist nur so gut wie die Daten dahinter. Preise, Bestände und Kunden kommen aus dem ERP, und die Bestellungen gehen dorthin zurück.',
      faq: 'Häufige Fragen zu B2B auf Shopify',
      links: 'Weiterlesen',
    },
    facts: [
      { label: 'Zeitrahmen', value: '4–8 Wochen', note: 'je nach ERP-Anbindung' },
      { label: 'Plattform', value: 'Shopify Plus', note: 'B2B ist eine Plus-Funktion' },
      { label: 'Ein Shop', value: 'B2B + B2C', note: 'ein Katalog, kundenspezifische Preise' },
      { label: 'Preismodell', value: 'Festpreis', note: 'nach der Analyse' },
    ],
    deliverables: [
      { name: 'Unternehmen und Standorte', text: 'Unternehmen mit mehreren Standorten, Ansprechpartnern und Rollen, importiert aus dem ERP oder einer Tabelle.' },
      { name: 'Preislisten und Kataloge', text: 'Kundenspezifische Preise, Rabatte und Staffelpreise pro Kunde oder Kundengruppe, und ein Sortiment pro Vereinbarung.' },
      { name: 'Zahlungsbedingungen', text: 'Kauf auf Rechnung mit 14/30 Tagen netto, Kreditlimits, und Karte oder Vipps als Alternative.' },
      { name: 'Self-Service-Bestellung', text: 'Login, Schnellbestellung, Nachbestellung aus der Historie und Bestellentwürfe, die zur Freigabe gesendet werden.' },
      { name: 'ERP-Integration', text: 'Kunden, Preise und Bestände aus dem ERP herein, Bestellungen und Rechnungsdaten hinaus.', scope: 'Standardanbindung an Tripletex, 24SevenOffice, Visma.net oder Business Central. Andere Systeme auf Anfrage.' },
      { name: 'Inhalte nur für Händler', text: 'Produktdatenblätter, Kampagnen und Neuigkeiten, die nur Geschäftskunden sehen.' },
      { name: 'Händler-Onboarding', text: 'Einladungen, Anleitung und ein Plan, um Kunden von E-Mail und Telefon ins Portal zu holen.' },
    ],
    youBring: ['Eine Kundenliste mit Preisvereinbarungen und Konditionen', 'Ein ERP-System mit API-Zugang', 'Eine Entscheidung, wer Bestellungen intern freigibt', 'Das Sortiment, das im B2B verkauft werden soll'],
    weHandle: ['Shopify-Plus-Einrichtung und B2B-Konfiguration', 'Mapping von Preisen und Kundengruppen', 'ERP-Anbindung in beide Richtungen', 'Testbestellungen mit echten Kunden', 'Schulung Ihres Vertriebsteams'],
    integrationSlugs: ['integrasjoner/tripletex', 'integrasjoner/24sevenoffice', 'integrasjoner/business-central', 'integrasjoner/visma-net', 'integrasjoner/sparklayer', 'integrasjoner/omnium'],
    faq: [
      { question: 'Brauchen wir Shopify Plus für B2B?', answer: 'Für echtes B2B mit Firmenkonten, Preislisten und Rechnungskonditionen: ja. Für einfache Anforderungen, etwa eine einzelne Rabattgruppe, gibt es Apps für Standard-Shopify. Wir empfehlen, was zu Ihrem Volumen passt.' },
      { question: 'Können B2B und B2C im selben Shop laufen?', answer: 'Ja, und das ist oft die beste Lösung. Ein Katalog, ein Lager und ein Bestellfluss, während Geschäftskunden nach dem Login ihre eigenen Preise sehen. Wenn Sie beides vollständig trennen möchten, richten wir einen eigenen Shop ein.' },
      { question: 'Wie kommen die Preise aus dem ERP?', answer: 'Preislisten im ERP werden auf Kataloge in Shopify gemappt und nach Zeitplan oder bei Änderung synchronisiert. Der Kunde sieht im Portal immer denselben Preis wie auf der Rechnung.' },
      { question: 'Was ist mit Kunden, die heute per E-Mail bestellen?', answer: 'Die meisten wechseln, sobald das Portal einfacher ist als E-Mail. Wir richten ein Onboarding mit Einladungen und Hilfestellung ein, und Ihr Vertriebsteam kann während der Umstellung Bestellungen im Namen der Kunden anlegen.' },
      { question: 'Werden Rechnung und Kreditlimits unterstützt?', answer: 'Ja. Zahlungsbedingungen werden pro Unternehmen festgelegt, und die Rechnung wird über die Integration im ERP erzeugt, nicht in Shopify.' },
    ],
    links: [
      { eyebrow: 'Pakete', title: 'B2B-Funktionen ab Premium', text: 'Kundenspezifische Preise, Kataloge und Konditionen als Teil des laufenden Betriebs.', href: PACKAGES_EN, linkText: 'Pakete ansehen' },
      { eyebrow: 'Kundenprojekte', title: 'B2B-Shops auf Shopify', text: 'Wie nordische Großhändler und Marken Bestellungen von E-Mail ins Portal verlagert haben.', href: CASES_EN, linkText: 'Kundenprojekte ansehen' },
      { eyebrow: 'Partner', title: 'ERP und Buchhaltung', text: 'Tripletex, 24SevenOffice, Visma.net und Business Central, und die Partner dahinter.', href: INTEGRATIONS_EN, linkText: 'Unsere Partner ansehen' },
    ],
  },
  utvikling: {
    key: 'utvikling',
    headings: {
      facts: 'Kurz gesagt',
      deliverables: 'Das bauen wir',
      deliverablesLead: 'Wenn es eine App nicht gibt oder sie nicht gut genug ist, bauen wir sie selbst. Das liefern wir am häufigsten.',
      prerequisites: 'Bevor wir starten',
      integrations: 'Integrationen, die wir selbst entwickeln',
      integrationsLead: 'Individuelle Entwicklung dreht sich oft um Daten. Das sind die Anbindungen, die wir mit eigenem Code oder Make gebaut haben und für Sie erweitern können.',
      faq: 'Häufige Fragen zur Entwicklung',
      links: 'Weiterlesen',
    },
    facts: [
      { label: 'Zeitrahmen', value: '2–12 Wochen', note: 'je nach Umfang' },
      { label: 'Preismodell', value: 'Festpreis', note: 'pro Lieferung' },
      { label: 'Technologie', value: 'Liquid, React, Node', note: 'Shopify Functions und Apps' },
      { label: 'Eigentum', value: 'Der Code gehört Ihnen', note: 'alles in Ihrem Repo' },
    ],
    deliverables: [
      { name: 'Produktkonfiguratoren', text: 'Der Kunde stellt das Produkt selbst zusammen: Maße, Material, Optionen und Preis in Echtzeit.' },
      { name: 'Eigene Shopify-Apps', text: 'Funktionen, die es im App Store nicht gibt, gebaut als private App für Ihren Shop.' },
      { name: 'Integrationen', text: 'Anbindungen an ERP, PIM, WMS und Ihre eigenen APIs, mit eigenem Code oder Make.', scope: 'Standardanbindungen sind an anderer Stelle abgedeckt. Hier geht es um das, was gebaut werden muss.' },
      { name: 'Checkout und Shopify Functions', text: 'Angepasster Checkout, Rabattlogik, Lieferregeln und Zahlungsmethoden auf Shopify Plus.' },
      { name: 'Agenten und KI', text: 'Automatisierung von Kundenservice, Produkttexten und Datenflüssen mit KI-Agenten, die in Ihren Systemen laufen.' },
      { name: 'Theme-Entwicklung', text: 'Eigene Sections, Blocks und Performance-Arbeit über das hinaus, was ein Standard-Theme bietet.' },
      { name: 'Headless und Storefront', text: 'Ein Hydrogen- oder Next.js-Shop mit Shopify als Backend, wenn es sich wirklich lohnt.', scope: 'Wir empfehlen Headless nur, wenn ein Theme den Bedarf nicht abdecken kann.' },
    ],
    youBring: ['Eine Beschreibung des Problems, nicht unbedingt der Lösung', 'Zugang zu den Systemen, die miteinander sprechen sollen', 'Beispieldaten, gegen die wir testen können', 'Eine Person, die unterwegs freigeben kann'],
    weHandle: ['Eine Spezifikation mit Umfang und Festpreis', 'Entwicklung in einem Repo, das Ihnen gehört', 'Eine Testumgebung vor der Produktion', 'Dokumentation und Übergabe', 'Betrieb und Weiterentwicklung über die Pakete'],
    integrationSlugs: ['integrasjoner/visma-net', 'integrasjoner/tracklution', 'integrasjoner/tripletex', 'integrasjoner/front-systems', 'integrasjoner/omnium', 'integrasjoner/feed'],
    faq: [
      { question: 'Wann sollten wir selbst bauen, statt eine App zu nutzen?', answer: 'Wenn die App den Bedarf nicht abdeckt, mehr kostet, als sie bringt, oder den Shop verlangsamt. Wir prüfen immer zuerst den App Store und sagen Ihnen, wenn eine App ausreicht.' },
      { question: 'Wem gehört der Code?', answer: 'Ihnen. Alles, was wir bauen, liegt in einem Repo, das Ihnen gehört, mit Dokumentation. Wenn Sie die Agentur wechseln, nehmen Sie den Code mit.' },
      { question: 'Wie wird Entwicklung bepreist?', answer: 'Festpreis pro Lieferung, auf Basis einer kurzen Spezifikation, die wir gemeinsam schreiben. Änderungen unterwegs werden bepreist, bevor sie umgesetzt werden. Laufende Weiterentwicklung wird über Premium oder Enterprise abgedeckt.' },
      { question: 'Bauen Sie Headless?', answer: 'Ja, wenn es sich lohnt. Für die meisten Shops liefert ein gutes Theme mehr Ergebnis für das Geld. Wir empfehlen Headless, wenn Sie etwas brauchen, das ein Theme nicht bieten kann.' },
      { question: 'Was ist mit der Wartung?', answer: 'Shopify ändert seine APIs regelmäßig. Alles, was wir bauen, wird über die Pakete betreut, damit es weiter funktioniert, wenn sich die Plattform ändert.' },
    ],
    links: [
      { eyebrow: 'Pakete', title: 'Individuelle Entwicklung ab Premium', text: 'Kleine und mittlere Funktionen als Teil des laufenden Betriebs, größere Vorhaben als Projekt.', href: PACKAGES_EN, linkText: 'Pakete ansehen' },
      { eyebrow: 'Kundenprojekte', title: 'Was wir für andere gebaut haben', text: 'Konfiguratoren, Integrationen und Apps für nordische Marken.', href: CASES_EN, linkText: 'Kundenprojekte ansehen' },
      { eyebrow: 'Partner', title: 'Eigener Code vs. Make vs. App', text: 'Wie wir für jede Anbindung die Methode wählen, und was das für Sie bedeutet.', href: INTEGRATIONS_EN, linkText: 'Unsere Partner ansehen' },
    ],
  },
}

export const servicesOverviewDe: ServicesOverview = {
  chooser: [
    { situation: 'Wir haben keinen Onlineshop oder fangen neu an', service: 'Ein neuer Shop auf Shopify', href: '/services/shopify' },
    { situation: 'Wir betreiben einen Shop auf WooCommerce, Magento oder 24Nettbutikk', service: 'Migration zu Shopify', href: '/services/migrate' },
    { situation: 'Unsere Händler bestellen per E-Mail und Telefon', service: 'B2B und Bestellportal', href: '/services/b2b' },
    { situation: 'Wir brauchen etwas, das es als App nicht gibt', service: 'Entwicklung und Individualisierung', href: '/services/shopify-development' },
    { situation: 'Der Shop ist live, wir brauchen jemanden, der ihn betreibt und verbessert', service: 'Die Pakete: Growth, Premium, Enterprise', href: PACKAGES_EN },
    { situation: 'Wir eröffnen ein Ladengeschäft oder wollen ein System für Kasse und Online', service: 'Nexus POS', href: '/nexuspos' },
  ],
  process: [
    { title: 'Analyse', text: 'Eine Stunde, in der wir Ziele, Systeme und alles Nötige durchgehen. Sie erhalten eine schriftliche Empfehlung.' },
    { title: 'Festpreis', text: 'Umfang und Preis stehen schriftlich fest, bevor wir starten. Keine laufenden Stunden.' },
    { title: 'Lieferung', text: 'Wöchentliche Abstimmungen, eine Testumgebung, in die Sie hineinschauen können, und ein fester Ansprechpartner bei uns.' },
    { title: 'Betrieb', text: 'Nach dem Launch wählen Sie ein Paket, oder Sie übernehmen selbst mit der Schulung, die Sie erhalten haben.' },
  ],
  faq: [
    { question: 'Was ist der Unterschied zwischen einer Leistung und einem Paket?', answer: 'Die Leistungen sind Projekte mit Anfang und Ende: ein neuer Shop, eine Migration, ein Bestellportal oder Entwicklung. Die Pakete sind der laufende Betrieb und die Weiterentwicklung danach, zum festen Monatspreis.' },
    { question: 'Arbeiten Sie nur mit Shopify?', answer: 'Ja. Wir sind Shopify-Plus-Partner und bauen alles auf Shopify. Das macht uns gut darin, und ehrlich, wenn Shopify nicht passt.' },
    { question: 'Wie schnell können Sie starten?', answer: 'Die Analyse können wir noch diese Woche machen. Der Projektstart liegt in der Regel innerhalb von zwei bis vier Wochen, je nachdem, was auf Ihrer Seite bereit ist.' },
    { question: 'Können wir mehrere Leistungen kombinieren?', answer: 'Ja, und das ist üblich. Eine Migration mit neuem Bestellportal, oder ein neuer Shop mit Konfigurator, wird als ein Projekt mit einem Zeitplan bepreist.' },
  ],
}

const DEPTH_BY_LANG: Record<ServiceLang, Record<ServiceKey, ServiceDepth>> = { no: servicesDepth, en: servicesDepthEn, sv: servicesDepthSv, da: servicesDepthDa, de: servicesDepthDe }
const OVERVIEW_BY_LANG: Record<ServiceLang, ServicesOverview> = { no: servicesOverview, en: servicesOverviewEn, sv: servicesOverviewSv, da: servicesOverviewDa, de: servicesOverviewDe }

/** Depth content for one service in the page language (English for languages without their own copy). */
export function getServicesDepth(key: ServiceKey, language: string): ServiceDepth {
  return DEPTH_BY_LANG[serviceLang(language)][key]
}

export function getServicesOverview(language: string): ServicesOverview {
  return OVERVIEW_BY_LANG[serviceLang(language)]
}
