/**
 * Seed the integrations pillar into a Sanity dataset (default: development).
 *
 *   npx sanity exec scripts/seed-integrations.ts --with-user-token
 *   SEED_DATASET=development npx sanity exec scripts/seed-integrations.ts --with-user-token
 *
 * Creates (createOrReplace, deterministic _ids, Norwegian only):
 *   - pillarPage        integrasjoner            (the hub)
 *   - integrationCategory × 8
 *   - integrationPage   × ~19, with vendor logos uploaded from public/images/integrations/logos
 *
 * Content comes from the Brain integration docs and the active Make.com scenarios
 * (docs/hackathon/integrations-design-brief.md §7). Copy is a first draft for
 * local preview; edit in Studio before publishing. Named clients must be
 * confirmed with each client.
 */
import { createReadStream, existsSync } from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'

const dataset = process.env.SEED_DATASET ?? 'development'
const client = getCliClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'fk1tt27l', dataset, apiVersion: '2024-01-01' })
const LANG = 'no'
const AUTHOR_ID = 'author-chris-jensen'
const LOGO_DIR = path.join(process.cwd(), 'public/images/integrations/logos')

type Block = { _type: 'block'; _key: string; style: 'normal'; markDefs: []; children: { _type: 'span'; _key: string; text: string; marks: [] }[] }
let k = 0
const key = () => `k${(k++).toString(36)}${Date.now().toString(36).slice(-3)}`
const block = (text: string): Block => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] })
const blocks = (...texts: string[]) => texts.map(block)
const ref = (_ref: string) => ({ _type: 'reference', _ref, _key: key() })
const faq = (items: [string, string][]) => items.map(([question, answer]) => ({ _type: 'faqItem', _key: key(), question, answer }))
const steps = (items: [string, string][]) => items.map(([name, text]) => ({ _type: 'object', _key: key(), name, text }))
const flow = (from: string, to: string, payload: string, trigger: 'webhook' | 'schedule' | 'manual', frequency: string) => ({ _key: key(), from, to, payload, trigger, frequency })
const sys = (name: string, role: 'source' | 'middleware' | 'target') => ({ _key: key(), name, role })

const CATEGORIES = [
  { key: 'erp', title: 'ERP og økonomi', order: 10, definition: 'En regnskapsintegrasjon flytter betalte ordre fra Shopify til regnskapssystemet som faktura, salgsbilag eller bilagsjournal, med kunde, mva og frakt på riktig konto. Refusjoner blir kreditnota. Vi kjører dette i dag mot Tripletex, 24SevenOffice, PowerOffice Go og Fiken, som Make.com-scenarioer i din egen konto. Fakturaer sendes ikke før regnskapsfører har sett dem.' },
  { key: 'oms', title: 'OMS, lager og EDI', order: 20, definition: 'Et ordrehåndteringssystem samler ordre fra nettbutikk, butikk og EDI på ett sted, og styrer lager og plukk. Vi kobler Shopify til Omnium, Holio og Ongoing, slik at ordre går inn og lager kommer tilbake, og EDI-ordre fra kjedene flyter videre til regnskap uten manuell punching.' },
  { key: 'pim', title: 'PIM og produktdata', order: 30, definition: 'Produktdata som eies i PIM eller leverandørfeed og publiseres til Shopify med varianter, bilder og attributter. Vi setter opp Vuuh, DatafeedWatch og Google Merchant Center slik at produktdata har én fasit og nettbutikk, markedsplasser og annonser får samme innhold.' },
  { key: 'logistikk', title: 'Logistikk og frakt', order: 40, definition: 'Fraktintegrasjoner gir riktige fraktvalg i kassen, etiketter fra ordren og sporing tilbake til kunden. Vi jobber med Bring, Profrakt, nShift, Logistra og Quickship, som offisielle apper eller Make.com-flyter når etiketten skal utløses fra et annet system enn Shopify.' },
  { key: 'betaling', title: 'Betaling', order: 50, definition: 'Betalingsintegrasjoner dekker kassen og oppgjøret. Vipps Hurtigkasse, Klarna, Dintero og Shopify Payments settes opp og testes, og utbetalingene føres mot riktig betalingsmåte i regnskapet slik at bank og bokføring stemmer uten manuell avstemming.' },
  { key: 'pos', title: 'POS og butikk', order: 60, definition: 'Butikk og nettbutikk på samme varelager og kundebase. Vi setter opp Shopify POS, kobler Front Systems til Shopify Plus, og flytter kunder fra PCKasse med gavekort og kundedata intakt.' },
  { key: 'markedsforing', title: 'Markedsføring og sporing', order: 70, definition: 'Kundedata og hendelser fra Shopify til verktøyene som driver salget: Klaviyo og MarketingPlatform for e-post og SMS, Tracklution for server-side sporing til Meta, Google og affiliate, og Judge.me eller Lipscore for anmeldelser.' },
  { key: 'booking', title: 'Booking og annet', order: 80, definition: 'Når salget starter et annet sted enn i kassen. Bookinger fra Podio og IZY blir Shopify-ordre, brukere opprettes i Moodle når et kurs er kjøpt, og skjemaer havner i Google Sheets. Make.com-flyter som er lette å lese og endre.' },
] as const

type Cat = (typeof CATEGORIES)[number]['key']
type Integration = {
  slug: string
  name: string
  title: string
  cat: Cat
  method: 'make' | 'code' | 'app' | 'connector'
  status?: 'live' | 'pilot'
  direction: 'one-way' | 'two-way'
  capabilities: string[]
  short: string
  logo?: string
  vendorUrl?: string
  featured?: boolean
  definition: string
  whatItIs: string
  why: string
  steps: [string, string][]
  prereq: string[]
  notIncluded?: string[]
  clients: string[]
  systems: ReturnType<typeof sys>[]
  flows: ReturnType<typeof flow>[]
  faq: [string, string][]
  siblings: string[]
}

const CTA = (name: string) => ({ heading: `Kjører dere ${name} i dag?`, text: 'Fortell oss hvilke systemer du har, så får du metode, dataflyt og tidsplan innen to virkedager.', buttonLabel: 'Book en samtale', buttonHref: '/kontakt' })

const generic = (name: string, cat: string): Pick<Integration, 'steps' | 'faq'> => ({
  steps: [
    ['Kartlegging', `Hva som skal flyte mellom Shopify og ${name}, hvem som er fasit for hva, og hva som skjer ved feil. Én arbeidsøkt.`],
    ['Oppsett', `Tilkobling i din egen konto, mapping av felt, og testdata gjennom hele flyten.`],
    ['Test på reelle data', 'De første ordrene eller produktene følges manuelt før vi slår på alt.'],
    ['Go-live og overvåking', 'Vi følger de første ukene. Feil varsles med referanse til ordren.'],
  ],
  faq: [
    [`Eier vi integrasjonen mot ${name} selv?`, 'Ja. Make.com-scenarioer ligger i din konto, og kode leveres med kildekode. Vi drifter om du vil, men du er ikke låst til oss.'],
    ['Hva skjer når en kjøring feiler?', 'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen. Det finnes ingen automatisk tilbakerulling, og det sier vi rett ut.'],
    [`Kan vi starte med ${cat} og utvide senere?`, 'Ja. De fleste starter med én flyt, for eksempel ordre, og legger til lager eller kunder etterpå.'],
    ['Hvor lang tid tar oppsettet?', 'Make.com-flyter leveres på dager når kartleggingen er gjort. Egen kode tar lenger, og vi gir tidsplan etter første samtale.'],
  ],
})

const I: Integration[] = [
  {
    slug: 'integrasjoner/tripletex', name: 'Tripletex', title: 'Tripletex-integrasjon for Shopify', cat: 'erp', method: 'make', direction: 'one-way', featured: true,
    capabilities: ['ordre', 'kunder', 'faktura', 'kreditnota'], logo: 'tripletex.svg', vendorUrl: 'https://tripletex.no/',
    short: 'Ordre og kunder til Tripletex som faktura per ordre eller samlebilag per måned. Refusjoner blir kreditnota.',
    definition: 'Tripletex-integrasjonen sender betalte Shopify-ordre til Tripletex som ordre og faktura med kunde, frakt og mva, enten per ordre eller som samlebilag per måned. Refusjoner i Shopify blir kreditnota. Flyten går én vei: Shopify er salgskanal, Tripletex er regnskap, og lager styres i Shopify. Den kjører som Make.com-scenario i din egen konto, og fakturaer sendes ikke før regnskapsfører har sett dem.',
    whatItIs: 'Tripletex er et norsk skybasert regnskapssystem for små og mellomstore selskaper. Integrasjonen gjør Shopify til salgskanal og Tripletex til regnskap, slik at ingen punsher ordre. Kunder og produkter opprettes i Tripletex første gang de dukker opp, og brukes igjen etterpå. Kundeoppslag skjer på e-post for B2C og organisasjonsnummer for B2B.',
    why: 'Manuell bokføring av nettbutikkordre er den vanligste kilden til avvik i mva-meldingen. Med integrasjonen får regnskapsfører riktig grunnlag hver dag, med Shopify-ordrenummer som referanse på hver faktura og kreditnota. Fakturaen opprettes, men sendes ikke automatisk, så regnskapsfører beholder kontrollen.',
    steps: [
      ['Kartlegging', 'Kontoplan, mva-koder, kundegrupper, og om dere vil ha faktura per ordre eller samlebilag per måned. Én arbeidsøkt med regnskapsfører.'],
      ['Oppsett i Make.com', 'API-token fra Tripletex, tilkobling i din Make-konto, scenario fra vår mal med kunde- og produktoppslag.'],
      ['Test på reelle ordre', 'De første ordrene gjennom hele flyten. Regnskapsfører godkjenner fakturaene før de sendes.'],
      ['Go-live og overvåking', 'Vi følger de første ukene. Feilede kjøringer ligger synlig i Make-historikken og varsles med ordrenummer.'],
    ],
    prereq: ['Tripletex med API-tilgang (ansatt-token)', 'Shopify eller Shopify Plus', 'Make.com-konto i ditt navn, vi setter opp om du ikke har', 'Kontoplan, mva-koder og forfall avklart med regnskapsfører', 'SKU eller EAN på alle varianter, så produktoppslag treffer'],
    notIncluded: ['Lager. Shopify er fasit, eller Omnium om du trenger OMS', 'Betalingsstatus tilbake. Shopify-ordre er allerede betalt når de sendes'],
    clients: ['Fotobaren', 'Hanske-Hallen', 'Makeup Mekka', 'Clubassist'],
    systems: [sys('Shopify', 'source'), sys('Make.com', 'middleware'), sys('Tripletex', 'target')],
    flows: [flow('Shopify', 'Tripletex', 'ordre + kunde', 'webhook', 'sanntid'), flow('Shopify', 'Tripletex', 'faktura opprettes, sendes ikke', 'webhook', 'sanntid'), flow('Shopify', 'Tripletex', 'refusjon → kreditnota', 'webhook', 'sanntid'), flow('Shopify', 'Tripletex', 'samlebilag', 'schedule', 'månedlig, valgfritt')],
    faq: [
      ['Kan vi bruke Tripletex sin egen Shopify-app i stedet?', 'Ja, for enkle B2C-butikker. Vår integrasjon er for deg som trenger samlebilag, B2B-faktura med org.nr, EDI via Omnium, egen mapping av mva og konto, eller fakturering som utløses av noe annet enn kassen.'],
      ['Synker dere lager fra Tripletex til Shopify?', 'Nei. Shopify er fasit for lager i denne integrasjonen. Trenger du lagerstyring på tvers av kanaler, er Omnium eller Holio riktig verktøy, og de kobler vi til.'],
      ['Sendes fakturaene automatisk til kunden?', 'Nei. Fakturaen opprettes i Tripletex, og regnskapsfører sender den, eller setter opp Tripletex sin egen utsending. Det er et bevisst valg.'],
      ['Eier vi Make.com-scenarioet?', 'Ja. Scenarioet og tilkoblingene ligger i din Make-konto. Vi drifter om du vil, men du er ikke låst.'],
    ],
    siblings: ['integrasjoner/24sevenoffice', 'integrasjoner/poweroffice-go', 'integrasjoner/omnium'],
  },
  {
    slug: 'integrasjoner/24sevenoffice', name: '24SevenOffice / Finago', title: '24SevenOffice og Finago-integrasjon for Shopify', cat: 'erp', method: 'make', direction: 'one-way', featured: true,
    capabilities: ['ordre', 'faktura', 'betaling', 'kreditnota'], logo: '24sevenoffice.svg', vendorUrl: 'https://24sevenoffice.com/',
    short: 'Finago og 24SevenOffice er samme system. Faktura per ordre med betaling registrert, refusjoner som kreditnota.',
    definition: '24SevenOffice-integrasjonen oppretter en faktura i 24SevenOffice for hver betalte Shopify-ordre, med kunde, linjer, frakt og riktig salgstype, og registrerer betalingen mot betalingsmåten ordren ble betalt med. Refusjoner i Shopify blir kreditnota. Flyten går én vei fra Shopify og kjører som Make.com-scenario i din egen konto, med REST for faktura og SOAP for betalingsregistrering.',
    whatItIs: '24SevenOffice, tidligere Finago, er et norsk regnskapssystem med både moderne REST-API og eldre SOAP-tjenester. Integrasjonen bruker begge: faktura og kunde opprettes via REST, betalingen registreres via SOAP fordi det bare finnes der. Salgstype og dimensjoner settes per ordre, slik at B2C og utland havner på riktig konto.',
    why: 'Uten betalingsregistrering må regnskapsfører avstemme hver Shopify-faktura manuelt mot utbetalingene. Med integrasjonen er fakturaen både opprettet og betalt i regnskapet når ordren er betalt i Shopify, og kreditnotaen kommer av seg selv ved refusjon.',
    steps: [
      ['Kartlegging', 'Salgstyper, betalingsmåter per gateway, dimensjoner for avdeling og land, og mva på frakt.'],
      ['Oppsett i Make.com', 'REST- og SOAP-tilganger fra 24SevenOffice, scenario for ordre og for refusjoner i din konto.'],
      ['Test på reelle ordre', 'Første ordre, første refusjon og en ordre med flere betalingsmåter følges manuelt.'],
      ['Go-live og overvåking', 'Nattlig sveip fanger refusjoner som webhook-kallet ikke rakk.'],
    ],
    prereq: ['24SevenOffice med REST- og SOAP-tilgang', 'Betalingsmåter satt opp i 24SevenOffice per gateway', 'Shopify eller Shopify Plus', 'Make.com-konto i ditt navn'],
    notIncluded: ['Lager. Shopify er fasit', 'Produktsynk fra 24SevenOffice. Produkter opprettes ved første salg'],
    clients: ['Julie Josephine'],
    systems: [sys('Shopify', 'source'), sys('Make.com', 'middleware'), sys('24SevenOffice', 'target')],
    flows: [flow('Shopify', '24SevenOffice', 'ordre + kunde → faktura', 'webhook', 'sanntid'), flow('Shopify', '24SevenOffice', 'betaling registrert', 'webhook', 'sanntid'), flow('Shopify', '24SevenOffice', 'refusjon → kreditnota', 'webhook', 'sanntid')],
    faq: [
      ['Hvorfor både REST og SOAP?', 'Betalingsregistrering finnes bare i SOAP-tjenesten til 24SevenOffice. Faktura og kunde går via REST. Vi håndterer sesjonen mellom dem.'],
      ['Er det Finago eller 24SevenOffice?', 'Samme produkt. Finago var navnet i enkelte markeder. Integrasjonen er den samme.'],
      ['Hva med gavekort og delbetaling?', 'Betalingen registreres per betalingsmåte. Gavekortdelen føres ikke mot bank. Vi avklarer oppsettet med regnskapsfører.'],
      ['Eier vi scenarioet?', 'Ja, det ligger i din Make-konto med dine tilganger.'],
    ],
    siblings: ['integrasjoner/tripletex', 'integrasjoner/poweroffice-go', 'integrasjoner/fiken'],
  },
  {
    slug: 'integrasjoner/poweroffice-go', name: 'PowerOffice Go', title: 'PowerOffice Go-integrasjon for Shopify', cat: 'erp', method: 'make', direction: 'one-way',
    capabilities: ['bilagsjournal', 'kreditnota'], logo: 'poweroffice.png', vendorUrl: 'https://poweroffice.no/',
    short: 'Shopify-salg som bilagsjournal, fordelt på inntektskonto og betalingsmåte. Refusjoner føres tilbake.',
    definition: 'PowerOffice Go-integrasjonen poster Shopify-salg som bilagsjournal i PowerOffice Go, fordelt på inntektskonto per land og mellomkonto per betalingsmåte, i stedet for faktura per kunde. Refusjoner føres som motposteringer. Den passer B2C-butikker der regnskapsfører vil ha rene, samlede bilag, og kjører som Make.com-scenario i din konto, per uke eller per måned.',
    whatItIs: 'PowerOffice Go er et norsk skybasert regnskapssystem. Vår integrasjon bruker importendepunktet for bilagsjournal: hver ordre blir debet- og kreditlinjer for varer og frakt, og hele perioden lastes opp som ett bilag med unik referanse, så den aldri postes dobbelt.',
    why: 'For B2C med mange små ordre er faktura per kunde støy. Bilagsjournalen gir regnskapsfører færre linjer å avstemme, og utbetalingene fra Vipps, Klarna og kort treffer hver sin mellomkonto.',
    steps: generic('PowerOffice Go', 'bilagsjournal').steps,
    prereq: ['PowerOffice Go med API-nøkkel og abonnementsnøkkel', 'Kontoplan og mva-koder avklart med regnskapsfører', 'Shopify eller Shopify Plus', 'Make.com-konto i ditt navn'],
    notIncluded: ['Kundeoppføringer. Bilagsjournalen er anonym per design', 'Lager. Shopify er fasit'],
    clients: ['BeautyHeaven', 'Babysensor', 'Universal Biology'],
    systems: [sys('Shopify', 'source'), sys('Make.com', 'middleware'), sys('PowerOffice Go', 'target')],
    flows: [flow('Shopify', 'PowerOffice Go', 'salg → bilagsjournal', 'schedule', 'ukentlig eller månedlig'), flow('Shopify', 'PowerOffice Go', 'refusjon → motpostering', 'schedule', 'samme kjøring')],
    faq: generic('PowerOffice Go', 'bilagsjournal').faq,
    siblings: ['integrasjoner/tripletex', 'integrasjoner/24sevenoffice', 'integrasjoner/fiken'],
  },
  {
    slug: 'integrasjoner/fiken', name: 'Fiken', title: 'Fiken-integrasjon for Shopify', cat: 'erp', method: 'make', status: 'pilot', direction: 'one-way',
    capabilities: ['ordre', 'faktura'], logo: 'fiken.svg', vendorUrl: 'https://fiken.no/',
    short: 'Shopify-salg til Fiken for små selskaper. Under utprøving med første kunde.',
    definition: 'Fiken-integrasjonen sender betalte Shopify-ordre til Fiken som salg med kunde og linjer, for små selskaper som fører regnskapet selv. Den er under utprøving med første kunde og bygges som Make.com-scenario etter samme mønster som Tripletex, med kundeoppslag og produktoppslag før hver ordre.',
    whatItIs: 'Fiken er et norsk regnskapsprogram for små bedrifter. Integrasjonen oppretter salg i Fiken fra Shopify-ordre, og vi prøver den ut med en butikk som flyttet fra PrestaShop.',
    why: 'Små butikker punsher ofte ordre selv. Med integrasjonen går salget rett inn, og mva-meldingen bygger på det som faktisk ble solgt.',
    steps: generic('Fiken', 'salg').steps, prereq: ['Fiken med API-tilgang', 'Shopify', 'Make.com-konto'], notIncluded: ['Lager', 'Kreditnota, kommer etter piloten'],
    clients: ['Drømmefesten'], systems: [sys('Shopify', 'source'), sys('Make.com', 'middleware'), sys('Fiken', 'target')],
    flows: [flow('Shopify', 'Fiken', 'ordre + kunde → salg', 'webhook', 'sanntid')], faq: generic('Fiken', 'salg').faq,
    siblings: ['integrasjoner/tripletex', 'integrasjoner/poweroffice-go'],
  },
  {
    slug: 'integrasjoner/unimicro', name: 'UniMicro', title: 'UniMicro-integrasjon for Shopify', cat: 'erp', method: 'app', direction: 'two-way',
    capabilities: ['produkter', 'lager', 'ordre', 'kunder'], logo: 'unimicro.svg', vendorUrl: 'https://unimicro.no/',
    short: 'Varer, lager, ordre og kunder mellom Shopify og UniMicro, med ERP som fasit for lager.',
    definition: 'UniMicro-integrasjonen kobler Shopify til UniMicro slik at varer og lager kommer fra ERP til nettbutikken, og ordre og kunder går tilbake. Den settes opp med UniMicro sin Shopify-kobling, og vi gjør kartlegging, mapping, test og go-live som del av en migrering eller nybygg.',
    whatItIs: 'UniMicro er et norsk økonomisystem med egen Shopify-kobling. Her er ERP fasit for varer og lager, i motsetning til Tripletex-oppsettet der Shopify er fasit.',
    why: 'Butikker med fysisk lager og eget varesystem vil ikke vedlikeholde produkter to steder. Da må nettbutikken følge ERP.',
    steps: generic('UniMicro', 'vare- og ordreflyt').steps, prereq: ['UniMicro med Shopify-kobling', 'Shopify', 'Varenummer som stemmer begge steder'],
    clients: ['Døskeland Marine'], systems: [sys('UniMicro', 'source'), sys('Shopify', 'target')],
    flows: [flow('UniMicro', 'Shopify', 'varer + lager', 'schedule', 'løpende'), flow('Shopify', 'UniMicro', 'ordre + kunder', 'webhook', 'sanntid')], faq: generic('UniMicro', 'vareflyt').faq,
    siblings: ['integrasjoner/trimit', 'integrasjoner/tripletex'],
  },
  {
    slug: 'integrasjoner/trimit', name: 'TRIMIT', title: 'TRIMIT-lagersynk for Shopify', cat: 'erp', method: 'make', direction: 'one-way',
    capabilities: ['lager'], logo: 'trimit.svg', vendorUrl: 'https://trimit.com/',
    short: 'Lagersynk fra TRIMIT til Shopify for mote og tekstil med mange varianter.',
    definition: 'TRIMIT-integrasjonen synker lagerbeholdning fra TRIMIT, ERP for mote og tekstil, til Shopify per variant og lokasjon. Den kjører som Make.com-scenario på fast intervall, slik at nettbutikken aldri selger varer som er utsolgt i ERP. Ordre går ikke tilbake i denne flyten.',
    whatItIs: 'TRIMIT er et ERP bygget på Microsoft Dynamics for mote, møbler og tekstil, med størrelse og farge som dimensjoner. Integrasjonen leser beholdning per variant og oppdaterer Shopify.',
    why: 'Mote har mange varianter og raske utsalg. Feil lager i nettbutikken gir kanselleringer og dårlige anmeldelser.',
    steps: generic('TRIMIT', 'lagersynk').steps, prereq: ['TRIMIT med API-tilgang', 'Shopify med SKU per variant', 'Make.com-konto'],
    notIncluded: ['Ordre til TRIMIT. Kan legges til som egen flyt'], clients: ['[Kunde, bekreft]'], systems: [sys('TRIMIT', 'source'), sys('Make.com', 'middleware'), sys('Shopify', 'target')],
    flows: [flow('TRIMIT', 'Shopify', 'lagerbeholdning per variant', 'schedule', 'hvert 15. min')], faq: generic('TRIMIT', 'lagersynk').faq,
    siblings: ['integrasjoner/unimicro', 'integrasjoner/omnium'],
  },
  {
    slug: 'integrasjoner/omnium', name: 'Omnium', title: 'Omnium-integrasjon for Shopify', cat: 'oms', method: 'connector', direction: 'two-way', featured: true,
    capabilities: ['ordre', 'lager', 'produkter', 'edi'], logo: 'omnium.svg', vendorUrl: 'https://omnium.no/',
    short: 'Ordre fra Shopify inn i Omnium, lager tilbake til Shopify. EDI-ordre fra Coop, XXL og Sport Holding videre til regnskap.',
    definition: 'Omnium-integrasjonen gjør Omnium til ordre- og lagersystem for Shopify: ordre går inn i Omnium, lager per lokasjon kommer tilbake til Shopify, og produkter kan publiseres fra Omnium. EDI-ordre fra Coop, XXL og Sport Holding tas imot i Omnium og sendes videre til Tripletex med GLN og kontantrabatt. Vi setter opp Omnium sin Shopify-konnektor og bygger EDI-flyten i Make.com.',
    whatItIs: 'Omnium er et norsk ordrehåndteringssystem for grossister og kjeder med flere kanaler. Shopify-connectoren er Omnium sin egen, og krever riktig oppsett av marked, lager og lokasjons-ID for å kjøre. EDI-delen er vår Make.com-flyt som beriker ordren med kundedata og oppretter ordre, faktura og leveringsadresse i Tripletex.',
    why: 'Grossister som selger både til kjeder og i egen nettbutikk trenger ett sted for ordre og lager. Uten OMS lever lageret tre steder, og EDI-ordre punsjes manuelt.',
    steps: [
      ['Kartlegging', 'Markeder, lager og lokasjoner i Omnium, hvilke kanaler som skal inn, og hvilke kjeder som sender EDI.'],
      ['Connector-oppsett', 'Global og markedsspesifikk Shopify-connector, lokasjons-ID på lager, og første synk av produkter.'],
      ['EDI-flyt i Make.com', 'Webhook fra Omnium, kundeoppslag, GLN og kontantrabatt, ordre og faktura i Tripletex.'],
      ['Test og go-live', 'Testmiljøet til Omnium først, så produksjon. Vi følger de første EDI-ordrene manuelt.'],
    ],
    prereq: ['Omnium-tenant med Shopify-konnektor', 'Shopify eller Shopify Plus med lokasjoner', 'Tripletex eller annet regnskap for EDI-flyten', 'Make.com-konto for EDI'],
    notIncluded: ['FEFO og batchsporing. Leveres som tillegg fra Omnium-teamet'],
    clients: ['Nsport', 'Eagle Products'],
    systems: [sys('Shopify', 'source'), sys('Omnium', 'middleware'), sys('Tripletex', 'target')],
    flows: [flow('Shopify', 'Omnium', 'ordre', 'webhook', 'sanntid'), flow('Omnium', 'Shopify', 'lagerbeholdning', 'schedule', 'løpende'), flow('Omnium', 'Tripletex', 'EDI-ordre → ordre + faktura', 'webhook', 'sanntid'), flow('Omnium', 'Shopify', 'produkter', 'schedule', 'ved endring')],
    faq: [
      ['Hvorfor stopper produkter i kø i Omnium?', 'Som regel mangler lokasjons-ID på lageret, store-ID har feil bokstaver, eller den globale konnektoren som vekker synkjobben finnes ikke. Vi har sjekklisten.'],
      ['Kan Omnium erstatte Shopify sitt lager?', 'Ja. Omnium blir fasit for lager, og Shopify viser det Omnium sier. Det er poenget.'],
      ['Hva med EDI til andre kjeder enn Coop, XXL og Sport Holding?', 'Hver ny kjede trenger kunde i regnskapet, org.nr i mappingen, GLN og kontantrabatt. Det er en kjent jobb.'],
      ['Er dette Make.com eller konnektor?', 'Begge. Shopify-koblingen er Omnium sin konnektor. EDI-flyten til regnskap er Make.com i din konto.'],
    ],
    siblings: ['integrasjoner/tripletex', 'integrasjoner/ongoing', 'integrasjoner/sparklayer'],
  },
  {
    slug: 'integrasjoner/ongoing', name: 'Ongoing WMS', title: 'Ongoing WMS-integrasjon for Shopify', cat: 'oms', method: 'app', direction: 'two-way',
    capabilities: ['ordre', 'lager', 'forsendelser'], logo: 'ongoing.svg', vendorUrl: 'https://ongoingwarehouse.com/',
    short: 'Ordre til 3PL-lageret, lager og sporing tilbake. Satt opp for Shopify Plus med flere markeder.',
    definition: 'Ongoing WMS-integrasjonen sender Shopify-ordre til tredjepartslageret som kjører Ongoing, og får lagerbeholdning og sporingsnummer tilbake til Shopify og kunden. Vi setter opp Ongoing sin Shopify-app per marked, kartlegger fraktmetoder sammen med lageret, og tester plukk, pakk, retur og lagerjustering før go-live.',
    whatItIs: 'Ongoing WMS er lagersystemet mange nordiske 3PL-er bruker. Butikken får ikke selv tilgang til lageret, men til appen som kobler det til Shopify.',
    why: 'Når lageret er outsourcet må ordre ut og lager inn uten at noen rører dem. Feil i fraktmetoder er den vanligste årsaken til stopp.',
    steps: generic('Ongoing', 'ordre- og lagerflyt').steps, prereq: ['3PL som kjører Ongoing', 'Shopify Plus eller Shopify', 'Fraktmetoder avklart med lageret'],
    clients: ['Makeup Mekka', 'Guttelus'], systems: [sys('Shopify', 'source'), sys('Ongoing WMS', 'target')],
    flows: [flow('Shopify', 'Ongoing WMS', 'ordre', 'webhook', 'sanntid'), flow('Ongoing WMS', 'Shopify', 'lager + sporing', 'schedule', 'løpende')], faq: generic('Ongoing', 'lager').faq,
    siblings: ['integrasjoner/omnium', 'integrasjoner/nshift'],
  },
  {
    slug: 'integrasjoner/sparklayer', name: 'SparkLayer', title: 'SparkLayer B2B for Shopify', cat: 'oms', method: 'app', direction: 'one-way',
    capabilities: ['ordre', 'kunder'], logo: 'sparklayer-mark.png', vendorUrl: 'https://www.sparklayer.io/',
    short: 'B2B-portal på Shopify med kundepriser, bestillingslister og ordre som flyter videre til OMS.',
    definition: 'SparkLayer legger en B2B-bestillingsflate oppå Shopify med kundespesifikke priser, minimumsantall, hurtigbestilling og bestillingslister for forhandlere. Vi setter opp prislister og kundegrupper, tilpasser visningen i temaet, og kobler B2B-ordrene videre til Omnium eller regnskapssystemet slik at de behandles likt med alle andre ordre.',
    whatItIs: 'SparkLayer er en Shopify-app for B2B. Den erstatter ikke OMS, men gir forhandlerne en bestillingsportal på samme butikk som B2C.',
    why: 'Forhandlere som bestiller på e-post koster tid. En portal med riktige priser gir ordre rett inn i flyten.',
    steps: generic('SparkLayer', 'B2B').steps, prereq: ['Shopify Plus anbefalt', 'Prislister per kundegruppe', 'OMS eller regnskap for ordrene videre'],
    clients: ['Nsport', 'The Social Gaming Group'], systems: [sys('SparkLayer', 'source'), sys('Shopify', 'middleware'), sys('Omnium', 'target')],
    flows: [flow('SparkLayer', 'Shopify', 'B2B-ordre', 'webhook', 'sanntid'), flow('Shopify', 'Omnium', 'ordre', 'webhook', 'sanntid')], faq: generic('SparkLayer', 'B2B').faq,
    siblings: ['integrasjoner/omnium', 'integrasjoner/tripletex'],
  },
  {
    slug: 'integrasjoner/profrakt', name: 'Profrakt', title: 'Profrakt-integrasjon for Shopify', cat: 'logistikk', method: 'make', direction: 'one-way',
    capabilities: ['forsendelser', 'sporing'], logo: 'profrakt.svg', vendorUrl: 'https://profrakt.no/',
    short: 'Fraktetiketter bestilt fra ordren eller fra bookingsystemet, sporing tilbake på forsendelsen.',
    definition: 'Profrakt-integrasjonen bestiller fraktetikett fra Profrakt når en ordre eller booking er klar, og legger sporingsnummeret tilbake på forsendelsen. Den kjører som Make.com-flyt og kan utløses fra Shopify, eller fra et annet system som Podio når leien skal sendes, ikke når den bestilles.',
    whatItIs: 'Profrakt er en norsk fraktportal med avtaler hos flere transportører. Integrasjonen kaller Profrakt sitt API med mottaker og kolli, og får etikett og sporing tilbake.',
    why: 'Utleie og bestillinger med leveringsdato passer ikke i standard fraktapper, som sender med en gang ordren er betalt.',
    steps: generic('Profrakt', 'frakt').steps, prereq: ['Profrakt-konto med API', 'Shopify eller bookingsystem', 'Make.com-konto'],
    clients: ['Fotobaren'], systems: [sys('Podio', 'source'), sys('Make.com', 'middleware'), sys('Profrakt', 'target')],
    flows: [flow('Podio', 'Profrakt', 'mottaker + kolli → etikett', 'manual', 'ved knapp'), flow('Profrakt', 'Shopify', 'sporingsnummer', 'webhook', 'sanntid')], faq: generic('Profrakt', 'frakt').faq,
    siblings: ['integrasjoner/bring', 'integrasjoner/podio'],
  },
  {
    slug: 'integrasjoner/bring', name: 'Bring', title: 'Bring-integrasjon for Shopify', cat: 'logistikk', method: 'app', direction: 'two-way',
    capabilities: ['forsendelser', 'sporing'], logo: 'bring-mark.png', vendorUrl: 'https://www.bring.no/',
    short: 'Fraktvalg i kassen, etiketter og sporing tilbake på ordren. Standard i hver migrering.',
    definition: 'Bring-integrasjonen gir riktige fraktvalg og hentesteder i Shopify-kassen, etiketter fra ordren og sporing tilbake til kunden. Vi setter opp Bring sin offisielle app med avtalenummer og fraktregler, og tester kassen på mobil før go-live. Det er en fast del av hver Shopify-migrering vi gjør.',
    whatItIs: 'Bring er Posten sin bedriftsdel. Appen kobler avtalen din til Shopify og håndterer pakke i postkassen, hentested og hjemlevering.',
    why: 'Fraktvalg er det første kunden ser i kassen. Feil priser eller manglende hentested koster konvertering.',
    steps: generic('Bring', 'frakt').steps, prereq: ['Bring-avtale med API-nøkkel', 'Shopify med Carrier Service, Plus eller tillegg', 'Fraktregler per sone'],
    clients: ['De fleste butikkene vi har migrert'], systems: [sys('Shopify', 'source'), sys('Bring', 'target')],
    flows: [flow('Bring', 'Shopify', 'fraktvalg i kassen', 'webhook', 'sanntid'), flow('Shopify', 'Bring', 'etikett', 'manual', 'ved pakking'), flow('Bring', 'Shopify', 'sporing', 'webhook', 'sanntid')], faq: generic('Bring', 'frakt').faq,
    siblings: ['integrasjoner/profrakt', 'integrasjoner/nshift'],
  },
  {
    slug: 'integrasjoner/nshift', name: 'nShift', title: 'nShift-integrasjon for Shopify', cat: 'logistikk', method: 'app', direction: 'two-way',
    capabilities: ['forsendelser', 'sporing'], logo: 'nshift-mark.png', vendorUrl: 'https://nshift.com/',
    short: 'Flere transportører i én kasse og ett etikettsystem, for butikker som sender til flere land.',
    definition: 'nShift-integrasjonen samler transportørene i én fraktkasse og ett etikettsystem, for butikker som selger til flere land fra Shopify Plus. Vi setter opp kassen, fraktregler per marked og etikettflyten, og kobler den til lageret der varene faktisk pakkes.',
    whatItIs: 'nShift, tidligere Unifaun og Consignor, er en nordisk fraktplattform. Appen gir fraktvalg i kassen og etiketter for alle transportører på én avtale.',
    why: 'Flere markeder betyr flere transportører. Én plattform holder kassen enkel og etikettene like.',
    steps: generic('nShift', 'frakt').steps, prereq: ['nShift-konto med transportøravtaler', 'Shopify Plus med Markets', 'Lager eller 3PL som pakker'],
    clients: ['Makeup Mekka'], systems: [sys('Shopify', 'source'), sys('nShift', 'target')],
    flows: [flow('nShift', 'Shopify', 'fraktvalg per marked', 'webhook', 'sanntid'), flow('Shopify', 'nShift', 'etikett', 'webhook', 'ved ordre'), flow('nShift', 'Shopify', 'sporing', 'webhook', 'sanntid')], faq: generic('nShift', 'frakt').faq,
    siblings: ['integrasjoner/bring', 'integrasjoner/ongoing'],
  },
  {
    slug: 'integrasjoner/vipps-hurtigkasse', name: 'Vipps', title: 'Vipps Hurtigkasse for Shopify', cat: 'betaling', method: 'app', direction: 'one-way', featured: true,
    capabilities: ['betaling', 'kunder'], logo: 'vipps.svg', vendorUrl: 'https://vipps.no/',
    short: 'Ett trykk fra produktside til betalt ordre. Oppsett, test og go-live, og Vipps-oppgjør mot regnskapet.',
    definition: 'Vipps Hurtigkasse lar kunden betale med ett trykk fra produktsiden, uten å fylle inn adresse. Vi setter opp Vipps sin Shopify-app, plasserer knappen riktig i tema og kasse, tester på mobil, og fører Vipps-oppgjøret mot egen betalingsmåte i regnskapet slik at bank og bokføring stemmer.',
    whatItIs: 'Vipps Hurtigkasse er en betalings- og kassemetode fra Vipps MobilePay. Kunden identifiseres med telefonnummer, og adresse og betaling hentes fra Vipps.',
    why: 'Norske kunder forventer Vipps. Hurtigkasse fjerner skjemaet, og det er skjemaet som dreper konvertering på mobil.',
    steps: generic('Vipps', 'betaling').steps, prereq: ['Vipps-avtale for nettbutikk', 'Shopify', 'Regnskap med egen betalingsmåte for Vipps'],
    clients: ['Fotobaren', 'Tønnesen 1937'], systems: [sys('Vipps', 'source'), sys('Shopify', 'target')],
    flows: [flow('Vipps', 'Shopify', 'betalt ordre + kunde', 'webhook', 'sanntid'), flow('Vipps', 'Tripletex', 'oppgjør', 'schedule', 'daglig')], faq: generic('Vipps', 'betaling').faq,
    siblings: ['integrasjoner/klarna', 'integrasjoner/dintero', 'integrasjoner/tripletex'],
  },
  {
    slug: 'integrasjoner/klarna', name: 'Klarna', title: 'Klarna for Shopify', cat: 'betaling', method: 'app', direction: 'one-way',
    capabilities: ['betaling'], logo: 'klarna.svg', vendorUrl: 'https://www.klarna.com/',
    short: 'Faktura og delbetaling i Shopify-kassen, med oppgjør mot egen mellomkonto i regnskapet.',
    definition: 'Klarna-integrasjonen gir faktura og delbetaling i Shopify-kassen gjennom Klarna sin betalingsapp, og fører Klarna-utbetalingene mot egen mellomkonto i regnskapet, så gebyrer og utbetalinger kan avstemmes per periode. Vi setter opp appen, tester kassen på mobil og desktop, og avklarer kontoer og mva på gebyrene med regnskapsfører før go-live.',
    whatItIs: 'Klarna er betalingstjenesten for kjøp nå og betal senere. I Shopify er den en betalingsmetode, ikke en egen kasse.',
    why: 'Delbetaling øker snittordre i mote og interiør. Oppgjøret må likevel stemme i regnskapet.',
    steps: generic('Klarna', 'betaling').steps, prereq: ['Klarna-avtale', 'Shopify', 'Mellomkonto for Klarna i regnskapet'],
    clients: ['Døskeland Marine'], systems: [sys('Klarna', 'source'), sys('Shopify', 'target')],
    flows: [flow('Klarna', 'Shopify', 'betalt ordre', 'webhook', 'sanntid'), flow('Klarna', 'PowerOffice Go', 'oppgjør → mellomkonto', 'schedule', 'periodisk')], faq: generic('Klarna', 'betaling').faq,
    siblings: ['integrasjoner/vipps-hurtigkasse', 'integrasjoner/dintero'],
  },
  {
    slug: 'integrasjoner/dintero', name: 'Dintero', title: 'Dintero for Shopify', cat: 'betaling', method: 'app', direction: 'one-way',
    capabilities: ['betaling'], logo: 'dintero.svg', vendorUrl: 'https://www.dintero.com/',
    short: 'Norsk betalingsløsning med Vipps, kort og faktura i én avtale.',
    definition: 'Dintero-integrasjonen gir Vipps, kort og faktura i Shopify-kassen gjennom én avtale og én utbetaling, i stedet for tre leverandører og tre oppgjør. Vi setter opp Dintero sin Shopify-app, tester hver betalingsmetode på mobil og i kassen, og kobler oppgjøret til riktig betalingsmåte i regnskapet slik at bank og bokføring stemmer uten manuell avstemming.',
    whatItIs: 'Dintero er en norsk betalingsleverandør som samler flere betalingsmetoder bak én avtale.',
    why: 'Én avtale og ett oppgjør er enklere å avstemme enn tre.',
    steps: generic('Dintero', 'betaling').steps, prereq: ['Dintero-avtale', 'Shopify'], clients: ['Fotobaren'], systems: [sys('Dintero', 'source'), sys('Shopify', 'target')],
    flows: [flow('Dintero', 'Shopify', 'betalt ordre', 'webhook', 'sanntid')], faq: generic('Dintero', 'betaling').faq,
    siblings: ['integrasjoner/vipps-hurtigkasse', 'integrasjoner/klarna'],
  },
  {
    slug: 'integrasjoner/front-systems', name: 'Front Systems', title: 'Front Systems-integrasjon for Shopify', cat: 'pos', method: 'make', direction: 'two-way',
    capabilities: ['ordre', 'kunder', 'lager'], logo: 'frontsystems.svg', vendorUrl: 'https://frontsystems.no/',
    short: 'Butikk-POS og nettbutikk på samme varelager. Ordre og kunder mellom Shopify Plus og Front.',
    definition: 'Front Systems-integrasjonen kobler butikk-POS i Front til nettbutikken i Shopify Plus, slik at varer, lager og kunder er de samme i butikk og på nett, og nettordre kan hentes eller returneres i butikk. Vi bygger flyten mot Front sitt API i Make.com og tester den i én butikk før resten.',
    whatItIs: 'Front Systems er et norsk kassesystem for kjeder og mote. API-et gir tilgang til varer, lager, kunder og salg, og integrasjonen bruker det i begge retninger.',
    why: 'Kjeder med både butikk og nett vil ikke ha to varelagre og to kundebaser. Da må POS og nettbutikk snakke sammen.',
    steps: generic('Front Systems', 'POS').steps, prereq: ['Front Systems med API-nøkkel', 'Shopify Plus', 'Make.com-konto'],
    clients: ['Tønnesen 1937'], systems: [sys('Front Systems', 'source'), sys('Make.com', 'middleware'), sys('Shopify', 'target')],
    flows: [flow('Front Systems', 'Shopify', 'varer + lager', 'schedule', 'løpende'), flow('Shopify', 'Front Systems', 'ordre + kunder', 'webhook', 'sanntid')], faq: generic('Front Systems', 'POS').faq,
    siblings: ['integrasjoner/shopify-pos', 'integrasjoner/omnium'],
  },
  {
    slug: 'integrasjoner/shopify-pos', name: 'Shopify POS', title: 'Shopify POS, fra PCKasse til én kasse', cat: 'pos', method: 'app', direction: 'two-way',
    capabilities: ['ordre', 'kunder', 'lager', 'betaling'], logo: 'shopify.svg', vendorUrl: 'https://www.shopify.com/pos',
    short: 'Butikk og nett i samme system. Vi flytter kunder, gavekort og varer fra PCKasse og setter opp kassen.',
    definition: 'Shopify POS gir butikken samme varelager, kunder og gavekort som nettbutikken. Vi setter opp kassen, maskinvare og betalingsterminal, flytter kunder og gavekortsaldo fra PCKasse eller Front, og lærer opp butikkteamet før lansering. Regnskapet får ett salg per dag per butikk.',
    whatItIs: 'Shopify POS er Shopify sitt eget kassesystem. Det erstatter PCKasse for butikker som vil ha én plattform, og oppfyller kassasystemlova når det er satt opp riktig.',
    why: 'To systemer for butikk og nett betyr dobbelt lager, dobbelt kunderegister og gavekort som ikke virker på tvers.',
    steps: [
      ['Kartlegging', 'Gammelt kassesystem, Z-rapport-vaner, gavekortsaldo og kundedata som skal med.'],
      ['Oppsett', 'Lokasjoner, maskinvare, betalingsterminal og kvitteringsoppsett.'],
      ['Flytting', 'Kunder og gavekort fra PCKasse, varer med strekkoder.'],
      ['Opplæring og go-live', 'Butikkteamet lærer kassen, vi er til stede første dag.'],
    ],
    prereq: ['Shopify-plan med POS Pro der det trengs', 'Betalingsterminal som støttes i Norge', 'Eksport fra gammelt kassesystem'],
    clients: ['Hanske-Hallen'], systems: [sys('Shopify POS', 'source'), sys('Shopify', 'middleware'), sys('Tripletex', 'target')],
    flows: [flow('Shopify POS', 'Shopify', 'salg + kunder + lager', 'webhook', 'sanntid'), flow('Shopify', 'Tripletex', 'dagsoppgjør', 'schedule', 'daglig')], faq: generic('Shopify POS', 'kasse').faq,
    siblings: ['integrasjoner/front-systems', 'integrasjoner/tripletex'],
  },
  {
    slug: 'integrasjoner/klaviyo', name: 'Klaviyo', title: 'Klaviyo for Shopify', cat: 'markedsforing', method: 'app', direction: 'one-way',
    capabilities: ['kunder', 'sporing'], logo: 'klaviyo.svg', vendorUrl: 'https://www.klaviyo.com/',
    short: 'E-post og SMS på kundedata fra Shopify. Flyter for forlatt kurv, velkomst og etter kjøp.',
    definition: 'Klaviyo-integrasjonen sender kunder, ordre og hendelser fra Shopify til Klaviyo, og vi bygger flytene som faktisk selger: forlatt kurv, velkomst, etter kjøp og vinn tilbake. Vi setter opp appen, segmentene og samtykke, og flytter flytene med i hver migrering.',
    whatItIs: 'Klaviyo er e-post- og SMS-plattformen med dypest Shopify-kobling. Appen er offisiell, jobben ligger i segmenter, flyter og samtykke.',
    why: 'E-post er den billigste kanalen du eier. Forlatt kurv alene betaler seg i de fleste butikker.',
    steps: generic('Klaviyo', 'e-post').steps, prereq: ['Klaviyo-konto', 'Shopify', 'Samtykkebanner som respekterer valg'],
    clients: ['Julie Josephine', 'BeautyHeaven', 'LNDA'], systems: [sys('Shopify', 'source'), sys('Klaviyo', 'target')],
    flows: [flow('Shopify', 'Klaviyo', 'kunder + ordre + hendelser', 'webhook', 'sanntid')], faq: generic('Klaviyo', 'e-post').faq,
    siblings: ['integrasjoner/marketingplatform', 'integrasjoner/tracklution'],
  },
  {
    slug: 'integrasjoner/marketingplatform', name: 'MarketingPlatform', title: 'MarketingPlatform-integrasjon for Shopify', cat: 'markedsforing', method: 'make', direction: 'one-way',
    capabilities: ['kunder'], logo: 'marketingplatform.png', vendorUrl: 'https://marketingplatform.com/',
    short: 'Nyhetsbrevpåmeldinger fra Shopify til MarketingPlatform per marked, med dublettsjekk.',
    definition: 'MarketingPlatform-integrasjonen sender nye nyhetsbrevpåmeldinger fra Shopify til riktig liste i MarketingPlatform per marked, og sjekker om profilen allerede finnes før den legges til, slik at ingen får dobbelt opp. Den kjører som Make.com-flyt i din egen konto, bygget for butikker som selger til flere land fra samme Shopify med Shopify Markets.',
    whatItIs: 'MarketingPlatform er en nordisk e-postplattform. Shopify har ingen offisiell kobling, så flyten er vår.',
    why: 'Tre markeder betyr tre lister. Påmeldinger må havne riktig uten at noen flytter dem for hånd.',
    steps: generic('MarketingPlatform', 'påmeldinger').steps, prereq: ['MarketingPlatform med API', 'Shopify Markets', 'Make.com-konto'],
    clients: ['Makeup Mekka'], systems: [sys('Shopify', 'source'), sys('Make.com', 'middleware'), sys('MarketingPlatform', 'target')],
    flows: [flow('Shopify', 'MarketingPlatform', 'påmelding → liste per marked', 'webhook', 'sanntid')], faq: generic('MarketingPlatform', 'e-post').faq,
    siblings: ['integrasjoner/klaviyo'],
  },
  {
    slug: 'integrasjoner/tracklution', name: 'Tracklution', title: 'Tracklution server-side sporing for Shopify', cat: 'markedsforing', method: 'code', direction: 'one-way',
    capabilities: ['sporing'], logo: 'tracklution-mark.png', vendorUrl: 'https://www.tracklution.com/',
    short: 'Server-side sporing til Meta, Google og affiliate, med custom pixel i Shopify-kassen.',
    definition: 'Tracklution-integrasjonen sender kjøp og hendelser fra Shopify server-side til Meta, Google Ads og affiliate-nettverk, uavhengig av nettleserblokkering og samtykkevalg som stopper vanlige piksler. Vi skriver custom pixel i Shopify-kassen, kobler hendelsene til Tracklution med riktig samtykkehåndtering, og verifiserer at konverteringene i annonseplattformene stemmer mot ordrene i Shopify.',
    whatItIs: 'Tracklution er en server-side sporingstjeneste. Shopify-kassen tillater bare custom pixels, så koblingen er kode vi skriver og vedlikeholder.',
    why: 'Annonseplattformene ser ikke lenger alle kjøp fra nettleseren. Uten server-side sporing optimaliserer de på feil tall.',
    steps: generic('Tracklution', 'sporing').steps, prereq: ['Tracklution-konto', 'Shopify med custom pixel-tilgang', 'Samtykkebanner'],
    clients: ['BeautyHeaven', 'Guttelus', 'Pergosol'], systems: [sys('Shopify', 'source'), sys('Tracklution', 'middleware'), sys('Meta og Google', 'target')],
    flows: [flow('Shopify', 'Tracklution', 'kjøp + hendelser', 'webhook', 'sanntid'), flow('Tracklution', 'Meta og Google', 'konverteringer', 'webhook', 'sanntid')], faq: generic('Tracklution', 'sporing').faq,
    siblings: ['integrasjoner/klaviyo'],
  },
  {
    slug: 'integrasjoner/podio', name: 'Podio', title: 'Podio booking til Shopify', cat: 'booking', method: 'make', direction: 'two-way',
    capabilities: ['booking', 'ordre', 'faktura'], logo: 'podio-mark.png', vendorUrl: 'https://podio.com/',
    short: 'Bookinger blir Shopify-ordre, kanselleringer går tilbake, og fakturering utløses når leien er levert.',
    definition: 'Podio-integrasjonen gjør bookinger i Podio til ordre i Shopify, sender kanselleringer tilbake til Podio, og utløser faktura i Tripletex når leien er levert, ikke når den er bestilt. Den kjører som Make.com-flyter med betalingslenke, fraktetikett via Profrakt og oppslag på e-post.',
    whatItIs: 'Podio er et fleksibelt arbeidsverktøy som brukes som bookingsystem. Shopify er betaling og regnskapets inngang. Flyten holder dem i takt.',
    why: 'Utleie følger ikke kassens rytme. Betaling, levering og fakturering skjer på forskjellige dager, og hvert steg må treffe riktig system.',
    steps: generic('Podio', 'booking').steps, prereq: ['Podio-arbeidsområde', 'Shopify', 'Make.com-konto', 'Tripletex for fakturering'],
    clients: ['Fotobaren'], systems: [sys('Podio', 'source'), sys('Make.com', 'middleware'), sys('Shopify', 'target')],
    flows: [flow('Podio', 'Shopify', 'booking → draft order + betalingslenke', 'webhook', 'sanntid'), flow('Shopify', 'Podio', 'kansellering', 'webhook', 'sanntid'), flow('Podio', 'Tripletex', 'faktura 72 t etter levering', 'schedule', 'daglig')], faq: generic('Podio', 'booking').faq,
    siblings: ['integrasjoner/profrakt', 'integrasjoner/tripletex'],
  },

  {
    slug: 'integrasjoner/business-central', name: 'Business Central', title: 'Business Central-integrasjon for Shopify', cat: 'erp', method: 'connector', direction: 'two-way',
    capabilities: ['produkter', 'lager', 'ordre', 'kunder', 'faktura'], logo: 'businesscentral.svg', vendorUrl: 'https://www.microsoft.com/dynamics-365/products/business-central',
    short: 'Microsoft sin Shopify-konnektor satt opp riktig: varer og lager fra ERP, ordre og kunder tilbake.',
    definition: 'Business Central-integrasjonen kobler Microsoft Dynamics 365 Business Central til Shopify med Microsoft sin egen Shopify-konnektor. Varer, priser og lager kommer fra ERP, ordre og kunder går tilbake, og faktura opprettes i Business Central. Vi gjør kartlegging av varegrupper, lokasjoner og betalingsmåter, setter opp konnektoren og tester hele flyten før go-live.',
    whatItIs: 'Business Central er Microsoft sitt ERP for mellomstore selskaper. Shopify-konnektoren er innebygd i Business Central, men krever at varer, lokasjoner, kunder og betalingsmåter er satt opp slik Shopify forventer dem.',
    why: 'Selskaper på Business Central har ERP som fasit. Nettbutikken må følge ERP, ellers selger den varer som ikke finnes.',
    steps: generic('Business Central', 'ERP').steps, prereq: ['Business Central med Shopify-konnektor aktivert', 'Shopify eller Shopify Plus', 'Varegrupper, lokasjoner og betalingsmåter avklart med regnskap'],
    clients: ['[Kunde, bekreft]'], systems: [sys('Business Central', 'source'), sys('Shopify', 'target')],
    flows: [flow('Business Central', 'Shopify', 'varer + priser + lager', 'schedule', 'løpende'), flow('Shopify', 'Business Central', 'ordre + kunder', 'schedule', 'løpende'), flow('Business Central', 'Shopify', 'fakturastatus', 'schedule', 'løpende')], faq: generic('Business Central', 'ERP').faq,
    siblings: ['integrasjoner/visma-net', 'integrasjoner/unimicro'],
  },
  {
    slug: 'integrasjoner/visma-net', name: 'Visma.net', title: 'Visma.net-integrasjon for Shopify', cat: 'erp', method: 'code', direction: 'two-way',
    capabilities: ['produkter', 'lager', 'ordre', 'kunder', 'faktura'], logo: 'visma-mark.png', vendorUrl: 'https://www.vismasoftware.no/erp/visma-net',
    short: 'Visma.net som ERP og fasit for varer og lager, Shopify som salgskanal. Ordre og kunder tilbake via API.',
    definition: 'Visma.net-integrasjonen kobler Visma.net ERP til Shopify slik at varer, priser og lager kommer fra ERP, og ordre og kunder går tilbake som salgsordre. Vi bygger flyten mot Visma.net sitt API, med kø og retry, fordi volumet og feilhåndteringen i ERP-prosjekter krever det. Faktura og levering styres i Visma.net.',
    whatItIs: 'Visma.net er Visma sitt skybaserte ERP for mellomstore selskaper, med eget API for varer, lager, kunder og salgsordre.',
    why: 'Med ERP som fasit må nettbutikken oppdateres når lageret endres, og ordrene må inn i ERP uten at noen punsher dem.',
    steps: generic('Visma.net', 'ERP').steps, prereq: ['Visma.net med API-tilgang', 'Shopify eller Shopify Plus', 'Varenummer og lokasjoner avklart'],
    clients: ['[Kunde, bekreft]'], systems: [sys('Visma.net', 'source'), sys('scandicommerce', 'middleware'), sys('Shopify', 'target')],
    flows: [flow('Visma.net', 'Shopify', 'varer + lager', 'schedule', 'hvert 15. min'), flow('Shopify', 'Visma.net', 'ordre + kunder', 'webhook', 'sanntid')], faq: generic('Visma.net', 'ERP').faq,
    siblings: ['integrasjoner/business-central', 'integrasjoner/tripletex'],
  },
  {
    slug: 'integrasjoner/feed', name: 'Feed', title: 'Feed PIM for Shopify', cat: 'pim', method: 'connector', direction: 'one-way',
    capabilities: ['produkter'], logo: 'feed.webp', vendorUrl: 'https://www.feed-pim.com/',
    short: 'Produktdata eid i Feed og publisert til Shopify med varianter, bilder og attributter.',
    definition: 'Feed-integrasjonen gjør Feed til fasit for produktdata og publiserer produkter, varianter, bilder og attributter til Shopify. Vi setter opp mapping av attributter til Shopify-metafelt, kanaler per marked og regler for hva som skal publiseres, slik at produktdata vedlikeholdes ett sted.',
    whatItIs: 'Feed er et norsk PIM-system. Shopify-koblingen er Feed sin egen, og jobben ligger i datamodell og mapping.',
    why: 'Med mange varianter og flere kanaler blir produktdata i Shopify alene uhåndterlig. PIM gir én fasit.',
    steps: generic('Feed', 'produktdata').steps, prereq: ['Feed med Shopify-kanal', 'Shopify', 'Attributtmodell avklart'],
    clients: ['[Kunde, bekreft]'], systems: [sys('Feed', 'source'), sys('Shopify', 'target')],
    flows: [flow('Feed', 'Shopify', 'produkter + varianter + bilder', 'schedule', 'ved publisering')], faq: generic('Feed', 'produktdata').faq,
    siblings: ['integrasjoner/emfas', 'integrasjoner/vuuh'],
  },
  {
    slug: 'integrasjoner/emfas', name: 'Emfas', title: 'Emfas PIM for Shopify', cat: 'pim', method: 'connector', direction: 'one-way',
    capabilities: ['produkter'], logo: 'emfas.svg', vendorUrl: 'https://www.emfas.ai/',
    short: 'Produktdata fra Emfas til Shopify, med attributter som metafelt og bilder fra DAM.',
    definition: 'Emfas-integrasjonen publiserer produkter, varianter, attributter og bilder fra Emfas til Shopify, med attributter som metafelt og bilder fra Emfas sin DAM. Vi kartlegger datamodellen, setter opp mapping og kanaler, og tester publisering før produktdata flyttes over.',
    whatItIs: 'Emfas er et norsk PIM- og DAM-system. Shopify-koblingen setter Emfas som fasit for produktinformasjon.',
    why: 'Når produktdata lever i Emfas, må nettbutikken følge med uten manuell kopiering.',
    steps: generic('Emfas', 'produktdata').steps, prereq: ['Emfas med Shopify-kanal', 'Shopify', 'Attributtmodell avklart'],
    clients: ['[Kunde, bekreft]'], systems: [sys('Emfas', 'source'), sys('Shopify', 'target')],
    flows: [flow('Emfas', 'Shopify', 'produkter + attributter + bilder', 'schedule', 'ved publisering')], faq: generic('Emfas', 'produktdata').faq,
    siblings: ['integrasjoner/feed', 'integrasjoner/datafeedwatch'],
  },
  {
    slug: 'integrasjoner/vuuh', name: 'Vuuh', title: 'Vuuh for Shopify', cat: 'pim', method: 'app', direction: 'one-way',
    capabilities: ['produkter', 'lager'], logo: 'vuuh-mark.png', vendorUrl: 'https://vuuh.com/',
    short: 'Produktdata og lager fra leverandørene via Vuuh, rett inn i Shopify.',
    definition: 'Vuuh-integrasjonen henter produktdata, bilder og lager fra merkevarene dine via Vuuh sin offisielle Shopify-app, så butikken slipper å legge inn leverandørenes produkter manuelt. Vi setter opp appen, mapping av merkenes kategorier til dine kolleksjoner, regler for hva som publiseres, og sjekker at varianter og strekkoder stemmer før første import.',
    whatItIs: 'Vuuh er en nordisk plattform der merkevarer deler produktdata med forhandlere. Shopify-appen er offisiell og plug-and-play.',
    why: 'Forhandlere med mange merker bruker dager på produktdata. Vuuh leverer dem ferdig.',
    steps: generic('Vuuh', 'produktdata').steps, prereq: ['Vuuh-konto', 'Shopify', 'Merker som er på Vuuh'],
    clients: ['Guttelus'], systems: [sys('Vuuh', 'source'), sys('Shopify', 'target')],
    flows: [flow('Vuuh', 'Shopify', 'produkter + bilder + lager', 'schedule', 'løpende')], faq: generic('Vuuh', 'produktdata').faq,
    siblings: ['integrasjoner/feed', 'integrasjoner/datafeedwatch'],
  },
  {
    slug: 'integrasjoner/datafeedwatch', name: 'DataFeedWatch', title: 'DataFeedWatch for Shopify', cat: 'pim', method: 'app', direction: 'one-way',
    capabilities: ['produkter'], vendorUrl: 'https://www.datafeedwatch.com/',
    short: 'Produktfeed fra Shopify til Google Shopping, Meta og prissammenligning, med regler per kanal.',
    definition: 'DataFeedWatch-integrasjonen tar produktene fra Shopify og lager optimaliserte feeder til Google Merchant Center, Meta og prissammenligningstjenester, med regler for titler, kategorier og ekskluderinger per kanal. Vi setter opp feedene og regelsettet, og følger feilmeldingene fra Merchant Center.',
    whatItIs: 'DataFeedWatch er et feed-verktøy. Shopify er kilden, kanalene får hver sin tilpassede feed.',
    why: 'Google avviser produkter med dårlige titler og manglende attributter. Et feed-verktøy fikser det uten å endre butikken.',
    steps: generic('DataFeedWatch', 'feed').steps, prereq: ['DataFeedWatch-konto', 'Shopify', 'Merchant Center og Meta Commerce'],
    clients: ['Guttelus'], systems: [sys('Shopify', 'source'), sys('DataFeedWatch', 'middleware'), sys('Google og Meta', 'target')],
    flows: [flow('Shopify', 'DataFeedWatch', 'produkter', 'schedule', 'daglig'), flow('DataFeedWatch', 'Google og Meta', 'feed per kanal', 'schedule', 'daglig')], faq: generic('DataFeedWatch', 'feed').faq,
    siblings: ['integrasjoner/vuuh', 'integrasjoner/tracklution'],
  },
  {
    slug: 'integrasjoner/holio', name: 'Holio', title: 'Holio-integrasjon for Shopify', cat: 'oms', method: 'connector', direction: 'two-way',
    capabilities: ['ordre', 'lager', 'forsendelser'], logo: 'holio.svg', vendorUrl: 'https://holio.ai/',
    short: 'Ordre- og lagersystem for mindre grossister. Ordre inn, lager og forsendelser tilbake.',
    definition: 'Holio-integrasjonen kobler Shopify til Holio sitt ordre- og lagersystem, slik at ordre går inn i Holio for plukk og pakk, og lager og sporing kommer tilbake til Shopify. Vi setter opp Holio sin Shopify-kobling og tester plukk, pakk, retur og lagerjustering før go-live.',
    whatItIs: 'Holio er et norsk OMS og WMS for mindre grossister og nettbutikker med eget lager. Et lettere alternativ til Omnium.',
    why: 'Med eget lager og flere kanaler trenger du ett sted for plukk og lager, uten å betale for mer enn du bruker.',
    steps: generic('Holio', 'ordre- og lagerflyt').steps, prereq: ['Holio-konto med Shopify-kobling', 'Shopify', 'Lagerlokasjoner avklart'],
    clients: ['Revira'], systems: [sys('Shopify', 'source'), sys('Holio', 'target')],
    flows: [flow('Shopify', 'Holio', 'ordre', 'webhook', 'sanntid'), flow('Holio', 'Shopify', 'lager + sporing', 'schedule', 'løpende')], faq: generic('Holio', 'lager').faq,
    siblings: ['integrasjoner/omnium', 'integrasjoner/ongoing'],
  },
  {
    slug: 'integrasjoner/quickship', name: 'Quickship', title: 'Quickship for Shopify', cat: 'logistikk', method: 'app', direction: 'two-way',
    capabilities: ['forsendelser', 'sporing'], logo: 'quickship.png', vendorUrl: 'https://quickship.no/',
    short: 'Fraktvalg og etiketter for B2B-sendinger med pall og stykkgods.',
    definition: 'Quickship-integrasjonen gir fraktvalg og etiketter for B2B-sendinger fra Shopify, inkludert pall og stykkgods som vanlige fraktapper ikke dekker. Vi setter opp appen, fraktregler per kundegruppe og vekt, etikettflyten fra ordren til pakking, og kobler sporing tilbake til ordren så forhandleren ser når pallen er på vei.',
    whatItIs: 'Quickship er en norsk fraktløsning rettet mot bedrifter. Shopify-appen gir priser i kassen og etiketter fra ordren.',
    why: 'B2B-ordre er tyngre og går på pall. Fraktvalg må reflektere det.',
    steps: generic('Quickship', 'frakt').steps, prereq: ['Quickship-konto', 'Shopify', 'Fraktregler per kundegruppe'],
    clients: ['The Social Gaming Group'], systems: [sys('Shopify', 'source'), sys('Quickship', 'target')],
    flows: [flow('Quickship', 'Shopify', 'fraktvalg', 'webhook', 'sanntid'), flow('Shopify', 'Quickship', 'etikett', 'manual', 'ved pakking'), flow('Quickship', 'Shopify', 'sporing', 'webhook', 'sanntid')], faq: generic('Quickship', 'frakt').faq,
    siblings: ['integrasjoner/bring', 'integrasjoner/nshift'],
  },
  {
    slug: 'integrasjoner/logistra', name: 'Logistra', title: 'Logistra for Shopify', cat: 'logistikk', method: 'app', direction: 'two-way',
    capabilities: ['forsendelser', 'sporing'], logo: 'logistra.png', vendorUrl: 'https://logistra.no/',
    short: 'Fraktvalg og etiketter for flere transportører, satt opp for B2B med minimumsordre.',
    definition: 'Logistra-integrasjonen gir fraktvalg i kassen og etiketter for flere transportører fra én Shopify-app, med sporing tilbake til ordren og kunden. Vi setter opp fraktregler per sone og vekt, kobler etikettflyten til lageret som pakker, og tilpasser oppsettet for B2B-butikker med minimumsordre og faste leveringsdager.',
    whatItIs: 'Logistra er en norsk fraktportal med Shopify-app. Flere transportører på én avtale.',
    why: 'Én fraktapp for alle transportører holder kassen enkel og etikettene like.',
    steps: generic('Logistra', 'frakt').steps, prereq: ['Logistra-konto', 'Shopify', 'Transportøravtaler'],
    clients: ['Revira'], systems: [sys('Shopify', 'source'), sys('Logistra', 'target')],
    flows: [flow('Logistra', 'Shopify', 'fraktvalg', 'webhook', 'sanntid'), flow('Shopify', 'Logistra', 'etikett', 'manual', 'ved pakking'), flow('Logistra', 'Shopify', 'sporing', 'webhook', 'sanntid')], faq: generic('Logistra', 'frakt').faq,
    siblings: ['integrasjoner/bring', 'integrasjoner/quickship'],
  },
  {
    slug: 'integrasjoner/judge-me', name: 'Judge.me', title: 'Judge.me for Shopify', cat: 'markedsforing', method: 'app', direction: 'one-way',
    capabilities: ['kunder'], logo: 'judgeme-mark.png', vendorUrl: 'https://judge.me/',
    short: 'Produktanmeldelser samlet inn etter kjøp og vist i butikk og Google.',
    definition: 'Judge.me-integrasjonen ber kunden om anmeldelse etter levering, viser anmeldelsene på produktsidene og sender dem til Google som strukturerte data. Vi setter opp appen, tidspunkt for forespørsel, visning i tema og import av gamle anmeldelser ved migrering.',
    whatItIs: 'Judge.me er en anmeldelsesapp for Shopify. Offisiell app, jobben ligger i tema og i import fra forrige plattform.',
    why: 'Anmeldelser øker konvertering og gir stjerner i Google. Mister du dem i en migrering, mister du begge deler.',
    steps: generic('Judge.me', 'anmeldelser').steps, prereq: ['Judge.me-konto', 'Shopify', 'Eksport av gamle anmeldelser'],
    clients: ['BeautyHeaven', 'Guttelus', 'Slikkepott'], systems: [sys('Shopify', 'source'), sys('Judge.me', 'target')],
    flows: [flow('Shopify', 'Judge.me', 'ordre → forespørsel om anmeldelse', 'webhook', 'etter levering'), flow('Judge.me', 'Shopify', 'anmeldelser i tema', 'schedule', 'løpende')], faq: generic('Judge.me', 'anmeldelser').faq,
    siblings: ['integrasjoner/lipscore', 'integrasjoner/klaviyo'],
  },
  {
    slug: 'integrasjoner/lipscore', name: 'Lipscore', title: 'Lipscore for Shopify', cat: 'markedsforing', method: 'app', direction: 'one-way',
    capabilities: ['kunder'], logo: 'lipscore.svg', vendorUrl: 'https://lipscore.com/',
    short: 'Nordisk anmeldelsesplattform med verifiserte kjøp, for butikker som vil ha anmeldelser på norsk.',
    definition: 'Lipscore-integrasjonen samler inn verifiserte anmeldelser etter kjøp og viser dem på produktsidene og som stjerner i Google. Vi setter opp Lipscore sin Shopify-app, tidspunktet for forespørselen etter levering, visningen i temaet, og flytter eksisterende anmeldelser med fra forrige plattform slik at ingenting går tapt i migreringen.',
    whatItIs: 'Lipscore er en nordisk anmeldelsesplattform med norsk support. Alternativ til Judge.me for butikker som vil ha nordisk leverandør.',
    why: 'Verifiserte anmeldelser på norsk veier tungt for norske kunder.',
    steps: generic('Lipscore', 'anmeldelser').steps, prereq: ['Lipscore-avtale', 'Shopify'],
    clients: ['Hekta på tur'], systems: [sys('Shopify', 'source'), sys('Lipscore', 'target')],
    flows: [flow('Shopify', 'Lipscore', 'ordre → forespørsel', 'webhook', 'etter levering'), flow('Lipscore', 'Shopify', 'anmeldelser i tema', 'schedule', 'løpende')], faq: generic('Lipscore', 'anmeldelser').faq,
    siblings: ['integrasjoner/judge-me'],
  },
  {
    slug: 'integrasjoner/moodle', name: 'Moodle', title: 'Moodle-integrasjon for Shopify', cat: 'booking', method: 'make', direction: 'one-way',
    capabilities: ['kunder', 'booking'], logo: 'moodle.svg', vendorUrl: 'https://moodle.org/',
    short: 'Kjøp av kurs i Shopify gir automatisk tilgang til riktig kurs i Moodle.',
    definition: 'Moodle-integrasjonen gir kunden tilgang til riktig kurs i Moodle når kurset er kjøpt i Shopify: bruker opprettes om den mangler, og kunden meldes på kurset som tilsvarer produktet. Den kjører som Make.com-scenario i din egen konto og kan utvides med tilgangsperioder, kursnivåer og e-postflyter.',
    whatItIs: 'Moodle er en åpen læringsplattform. Shopify selger kurset, Moodle leverer det, og flyten mellom dem er vår.',
    why: 'Kursleverandører som meldte på elever manuelt, mister tid og får misfornøyde kunder som venter på tilgang.',
    steps: [
      ['Kartlegging', 'Hvilke produkter som tilsvarer hvilke kurs, tilgangsperiode og hva som skjer ved refusjon.'],
      ['Oppsett i Make.com', 'Webhook ved betalt ordre, oppslag på e-post i Moodle, opprettelse av bruker og påmelding via Moodle sitt API.'],
      ['Test på reelle kjøp', 'Første kjøp følges fra kasse til kurs.'],
      ['Go-live og overvåking', 'Feil varsles med ordrenummer og kurs.'],
    ],
    prereq: ['Moodle med API-tilgang (web services)', 'Shopify', 'Make.com-konto, vi setter opp om du ikke har'],
    clients: ['Note.no'], systems: [sys('Shopify', 'source'), sys('Make.com', 'middleware'), sys('Moodle', 'target')],
    flows: [flow('Shopify', 'Moodle', 'betalt ordre → bruker + påmelding', 'webhook', 'sanntid')], faq: generic('Moodle', 'kurs').faq,
    siblings: ['integrasjoner/podio', 'integrasjoner/google-sheets'],
  },
  {
    slug: 'integrasjoner/izy', name: 'IZY', title: 'IZY Rental for Shopify', cat: 'booking', method: 'app', direction: 'two-way',
    capabilities: ['booking', 'ordre'], logo: 'izyrent.svg', vendorUrl: 'https://izy.no/',
    short: 'Utleie med datoperiode, tilgjengelighet og tilbehør, rett i Shopify-kassen.',
    definition: 'IZY-integrasjonen gir utleiebooking i Shopify: kunden velger periode, ser tilgjengelighet, legger til tilbehør og betaler i kassen som en vanlig ordre. Vi setter opp IZY sin app, leveringsvalg etter postnummer med post, budbil eller henting, og kobler bookingen videre til fakturering i regnskapet og fraktetikett når leien skal sendes.',
    whatItIs: 'IZY Rental er en bookingapp for utleie på Shopify. Bookingen blir en ordre, resten av flyten er som for andre ordre.',
    why: 'Utleie krever periode og tilgjengelighet. Standard Shopify har ingen av delene.',
    steps: generic('IZY', 'booking').steps, prereq: ['IZY-konto', 'Shopify', 'Regler for levering og henting'],
    clients: ['Fotobaren'], systems: [sys('IZY', 'source'), sys('Shopify', 'target')],
    flows: [flow('IZY', 'Shopify', 'booking → ordre', 'webhook', 'sanntid'), flow('Shopify', 'IZY', 'kansellering', 'webhook', 'sanntid')], faq: generic('IZY', 'booking').faq,
    siblings: ['integrasjoner/podio', 'integrasjoner/profrakt'],
  },
  {
    slug: 'integrasjoner/google-sheets', name: 'Google Sheets', title: 'Google Sheets-integrasjon for Shopify', cat: 'booking', method: 'make', direction: 'one-way',
    capabilities: ['ordre', 'kunder'], logo: 'googlesheets.svg', vendorUrl: 'https://workspace.google.com/products/sheets/',
    short: 'Skjemaer og ordre inn i regneark når det er der jobben gjøres. Ordreark for plukk og samlefaktura.',
    definition: 'Google Sheets-integrasjonen sender ordre, skjemasvar eller oppsigelser fra Shopify og nettsiden inn i regneark som teamet allerede jobber i, for plukklister, samlefakturering eller oppfølging. Den kjører som Make.com-flyt og er den enkleste måten å få data ut av Shopify på.',
    whatItIs: 'Google Sheets er regnearket alle har. Som integrasjon er det et arbeidsbord, ikke et system, og det er ofte nok.',
    why: 'Noen ganger er svaret et ark. Et ordreark for plukk eller en liste over oppsigelser slår et nytt system.',
    steps: generic('Google Sheets', 'ordreark').steps, prereq: ['Google Workspace', 'Shopify eller skjema', 'Make.com-konto'],
    clients: ['Clubassist', 'Aurora Nordic'], systems: [sys('Shopify', 'source'), sys('Make.com', 'middleware'), sys('Google Sheets', 'target')],
    flows: [flow('Shopify', 'Google Sheets', 'ordre → ordreark', 'webhook', 'sanntid')], faq: generic('Google Sheets', 'ordreark').faq,
    siblings: ['integrasjoner/moodle', 'integrasjoner/podio'],
  },
]

async function uploadLogo(file?: string) {
  if (!file) return undefined
  const p = path.join(LOGO_DIR, file)
  if (!existsSync(p)) {
    console.warn(`  logo missing: ${file}`)
    return undefined
  }
  const asset = await client.assets.upload('image', createReadStream(p), { filename: file })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function findId(type: string, extra = ''): Promise<string | null> {
  const r = await client.fetch<{ _id: string } | null>(`*[_type == $type && language == $lang ${extra}][0]{_id}`, { type, lang: LANG })
  return r?._id ?? null
}

async function main() {
  console.log(`Seeding integrations into dataset "${dataset}" …`)
  const author = (await client.fetch<{ _id: string } | null>(`*[_type=="author" && _id==$id][0]{_id}`, { id: AUTHOR_ID })) ?? (await client.fetch<{ _id: string } | null>(`*[_type=="author"][0]{_id}`))
  if (!author) throw new Error('No author document found. Create one in Studio first.')
  const packagesId = await findId('allPackagesPage')
  const migrateId = await findId('migratePage')
  const partnersId = await findId('partnersPage')
  const posId = await findId('shopifyPosPage')
  const vippsId = await findId('vippsHurtigkassePage')
  const pimId = await findId('shopifyXPimPage')
  const serviceByCat: Record<string, string | null> = { erp: packagesId, oms: partnersId, pim: pimId, logistikk: migrateId, betaling: vippsId, pos: posId, markedsforing: partnersId, booking: migrateId }

  const pillarId = `pillar-integrasjoner-${LANG}`
  const catId = (c: string) => `integration-cat-${c}-${LANG}`
  const intId = (slug: string) => `integration-${slug.split('/').pop()}-${LANG}`

  const tx = client.transaction()

  // Categories
  for (const c of CATEGORIES) {
    tx.createOrReplace({
      _id: catId(c.key), _type: 'integrationCategory', language: LANG, title: c.title, key: c.key, order: c.order,
      slug: { _type: 'slug', current: `integrasjoner/${c.key}` }, definition: c.definition,
      cta: { heading: `Hvilket system bruker dere til ${c.title.toLowerCase()}?`, text: 'Vi svarer med metode, dataflyt og tidsplan innen to virkedager.', buttonLabel: 'Book en samtale', buttonHref: '/kontakt' },
      faq: faq([
        [`Hvilke ${c.title.toLowerCase()}-systemer støtter dere?`, `De som står på denne siden kjører vi i dag. Står ikke ditt system her, kan vi som regel koble det likevel, enten via API i Make.com eller som egen kode.`],
        ['Make.com eller egen kode?', 'Make.com når flyten er greiner og oppslag og du vil kunne åpne en kjøring selv. Egen kode når det er mye transformasjon, høyt volum eller behov for testmiljø.'],
        ['Hvem eier integrasjonen etterpå?', 'Du. Make.com-scenarioer ligger i din konto, kode leveres med kildekode.'],
        ['Hva skjer når en kjøring feiler?', 'Hver kjøring ligger i historikken. Feil varsles med referanse, og vi rydder opp sammen.'],
      ]),
      relatedPages: [ref(pillarId), ...(serviceByCat[c.key] ? [ref(serviceByCat[c.key]!)] : [])],
    })
  }

  // Integration pages
  const integrationIds = new Map(I.map((i) => [i.slug, intId(i.slug)]))
  for (const i of I) {
    console.log(`  ${i.name}`)
    const logo = await uploadLogo(i.logo)
    tx.createOrReplace({
      _id: intId(i.slug), _type: 'integrationPage', language: LANG,
      pageTitle: i.title, slug: { _type: 'slug', current: i.slug }, definition: i.definition, intro: [],
      author: { _type: 'reference', _ref: author._id },
      integrationName: i.name, vendorUrl: i.vendorUrl,
      whatItIs: blocks(i.whatItIs), whyItMatters: blocks(i.why), implementationSteps: steps(i.steps),
      prerequisites: i.prereq, namedClients: i.clients,
      logo, category: { _type: 'reference', _ref: catId(i.cat) }, shortDescription: i.short,
      integrationMethod: i.method, status: i.status ?? 'live', syncDirection: i.direction, capabilities: i.capabilities,
      notIncluded: i.notIncluded ?? [], systems: i.systems, dataFlowSteps: i.flows, featured: !!i.featured,
      sections: [], faq: faq(i.faq), cta: CTA(i.name),
      pillar: { _type: 'reference', _ref: pillarId },
      clusterLinks: i.siblings.filter((s) => integrationIds.has(s)).map((s) => ref(integrationIds.get(s)!)),
      relatedPages: [ref(catId(i.cat)), ref(pillarId), ...(serviceByCat[i.cat] ? [ref(serviceByCat[i.cat]!)] : [])],
      relatedCaseStudies: [],
    })
  }

  // Hub pillar
  tx.createOrReplace({
    _id: pillarId, _type: 'pillarPage', language: LANG, pageTitle: 'Shopify koblet til systemene du allerede bruker',
    slug: { _type: 'slug', current: 'integrasjoner' },
    definition: 'En Shopify-integrasjon kobler nettbutikken til systemene som driver resten av selskapet: regnskap, ordrehåndtering, lager, frakt, betaling og markedsføring. Vi bygger dem i Make.com når flyten skal være synlig og enkel å endre, og som egen kode når volum eller logikk krever det. Dokumentert dataflyt, og du eier scenarioet i din egen konto.',
    intro: [], author: { _type: 'reference', _ref: author._id }, schemaType: 'Service',
    sections: [
      { _type: 'templateSection', _key: key(), heading: 'Hvem eier integrasjonen', anchor: 'eierskap', body: blocks('Make.com-scenarioer settes opp i din egen Make-konto med dine tilkoblinger. Kode leveres med kildekode i ditt repo. Vi drifter om du vil, men du er aldri låst til oss.') },
      { _type: 'templateSection', _key: key(), heading: 'Hva skjer når noe feiler', anchor: 'feil', body: blocks('Hver kjøring ligger i historikken med inn- og utdata per modul. Feil varsles med referanse til ordren. Det finnes ingen automatisk tilbakerulling, og vi rydder opp sammen når det trengs.') },
      { _type: 'templateSection', _key: key(), heading: 'Shopify eller systemet som fasit', anchor: 'fasit', body: blocks('For regnskap er Shopify fasit og regnskapet mottaker. For OMS og enkelte ERP, som Omnium, UniMicro og TRIMIT, er systemet fasit for lager og Shopify viser det. Vi avklarer dette først, fordi det styrer alt annet.') },
      { _type: 'templateSection', _key: key(), heading: 'Systemet ditt står ikke på listen', anchor: 'andre', body: blocks('Har systemet et API, kan vi som regel koble det. Send oss hva du har, så svarer vi med metode og tidsplan.') },
    ],
    faq: faq([
      ['Make.com eller egen kode, hvordan velger dere?', 'Make.com når flyten er greiner og oppslag, og når du vil kunne åpne en kjøring selv. Egen kode når det er mye transformasjon, høyt volum, eller behov for versjonskontroll og testmiljø. De fleste regnskaps- og OMS-integrasjoner er Make.com.'],
      ['Hvem eier integrasjonen etterpå?', 'Du. Make.com-scenarioer ligger i din konto, kode leveres med kildekode.'],
      ['Hva skjer når en kjøring feiler?', 'Hver kjøring ligger i historikken med inn- og utdata. Feil varsles med referanse, og vi rydder opp sammen.'],
      ['Systemet mitt står ikke på listen. Kan dere likevel?', 'Som regel ja, hvis systemet har et API. Send oss hva du har.'],
    ]),
    cta: { heading: 'Fortell oss hvilke systemer du har', text: 'Vi svarer med metode, dataflyt og tidsplan innen to virkedager.', buttonLabel: 'Book en samtale', buttonHref: '/kontakt' },
    clusterLinks: I.map((i) => ref(intId(i.slug))),
    relatedPages: [packagesId, migrateId, partnersId].filter(Boolean).map((id) => ref(id!)),
    relatedCaseStudies: [],
  })

  const res = await tx.commit()
  console.log(`Done: ${res.results.length} documents written to "${dataset}".`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
