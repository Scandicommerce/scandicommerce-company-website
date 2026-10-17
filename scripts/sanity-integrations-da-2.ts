// TARGET_DATASET=production npx sanity exec scripts/sanity-integrations-da-2.ts --with-user-token
// Creates Danish versions (-da) of 12 Norwegian integrationPage documents and adds the
// da entry to the existing translation.metadata (integration-<x>-meta). Fetches the -no
// document in full, swaps the text fields for Danish, remaps references to the -da
// counterparts and keeps everything else (logo, systems, capabilities, author, order, ...) as is.
// Idempotent: createOrReplace on fixed ids; metadata is only patched when no 'da' key exists.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

const toDa = (id: string, extMap: Record<string, string | null>): string | null =>
  id.endsWith('-no') ? id.slice(0, -3) + '-da' : id in extMap ? extMap[id] : id
const weak = (id: string, key?: string) => ({ _type: 'reference', _ref: id, _weak: true, ...(key ? { _key: key } : {}) })

const FREQ: Record<string, string> = {
  'sanntid': 'realtid', 'løpende': 'løbende', 'etter levering': 'efter levering', 'periodisk': 'periodisk',
  'ved pakking': 'ved pakning', 'ved ordre': 'pr. ordre', 'ved endring': 'ved ændring', 'daglig': 'dagligt',
  'månedlig': 'månedligt', 'ukentlig': 'ugentligt', 'ukentlig eller månedlig': 'ugentligt eller månedligt', 'samme kjøring': 'samme kørsel',
}

// Shared Danish copy for the standard FAQ / steps / CTA that most pages use.
const stdSteps = (name: string): [string, string][] => [
  ['Kortlægning', `Hvad der skal flyde mellem Shopify og ${name}, hvilket system der er facit for hvad, og hvad der sker ved fejl. Én arbejdssession.`],
  ['Opsætning', 'Forbindelse i jeres egen konto, mapping af felter og testdata gennem hele flowet.'],
  ['Test på rigtige data', 'De første ordrer eller produkter følges manuelt, før vi slår alt til.'],
  ['Go-live og overvågning', 'Vi følger de første uger. Fejl flages med reference til ordren.'],
]
const stdFaq = (name: string, startWith: string): [string, string][] => [
  [`Ejer vi integrationen til ${name} selv?`, 'Ja. Make.com-scenarier ligger i jeres konto, og kode leveres med kildekode. Vi drifter den, hvis I vil, men I er ikke låst til os.'],
  ['Hvad sker der, når en kørsel fejler?', 'Hver kørsel ligger i historikken med ind- og uddata. Fejl flages med reference, og vi rydder op sammen. Der findes ingen automatisk tilbagerulning, og det siger vi ligeud.'],
  [`Kan vi starte med ${startWith} og udvide senere?`, 'Ja. De fleste starter med ét flow, for eksempel ordrer, og tilføjer lager eller kunder bagefter.'],
  ['Hvor lang tid tager opsætningen?', 'Make.com-flows leveres på dage, når kortlægningen er gjort. Egen kode tager længere tid, og vi giver en tidsplan efter den første samtale.'],
]
const stdCta = (name: string) => ({ heading: `Kører I ${name} i dag?`, text: 'Fortæl os, hvilke systemer I har, så får I metode, dataflow og tidsplan inden for to arbejdsdage.', buttonLabel: 'Book en samtale', buttonHref: '/contact' })

type Tr = {
  pageTitle: string; definition: string; shortDescription: string
  whatItIs: string; whyItMatters: string
  steps: [string, string][]; faq: [string, string][]; cta: Doc
  prerequisites: string[]; notIncluded: string[]
  dataFlow: string[] // payload per dataFlowSteps index
}

const T: Record<string, Tr> = {
  'judge-me': {
    pageTitle: 'Judge.me til Shopify',
    definition: 'Judge.me-integrationen beder kunden om en anmeldelse efter levering, viser anmeldelserne på produktsiderne og sender dem til Google som strukturerede data. Vi sætter appen op, tidspunktet for forespørgslen, visningen i temaet og importen af eksisterende anmeldelser, når I migrerer fra jeres tidligere platform.',
    shortDescription: 'Produktanmeldelser indsamlet efter køb og vist i butikken og i Google.',
    whatItIs: 'Judge.me er en anmeldelsesapp til Shopify. Officiel app, arbejdet ligger i temaet og i importen fra den tidligere platform.',
    whyItMatters: 'Anmeldelser øger konverteringen og giver stjerner i Google. Mister I dem i en migrering, mister I begge dele.',
    steps: stdSteps('Judge.me'), faq: stdFaq('Judge.me', 'anmeldelser'), cta: stdCta('Judge.me'),
    prerequisites: ['Judge.me-konto', 'Shopify', 'Eksport af eksisterende anmeldelser'], notIncluded: [],
    dataFlow: ['ordre → anmodning om anmeldelse', 'anmeldelser i temaet'],
  },
  'klarna': {
    pageTitle: 'Klarna til Shopify',
    definition: 'Klarna-integrationen giver faktura og delbetaling i Shopify-checkoutet gennem Klarnas betalingsapp og bogfører Klarna-udbetalingerne på en separat mellemregningskonto i regnskabet, så gebyrer og udbetalinger kan afstemmes pr. periode. Vi sætter appen op, tester checkoutet på mobil og desktop og afklarer konti og moms på gebyrerne med jeres bogholder før go-live.',
    shortDescription: 'Faktura og delbetaling i Shopify-checkoutet, med afregning mod en separat mellemregningskonto i regnskabet.',
    whatItIs: 'Klarna er betalingstjenesten for køb nu, betal senere. I Shopify er den en betalingsmetode, ikke et separat checkout.',
    whyItMatters: 'Delbetaling øger den gennemsnitlige ordreværdi inden for mode og bolig. Afregningen skal stadig stemme i regnskabet.',
    steps: stdSteps('Klarna'), faq: stdFaq('Klarna', 'betaling'), cta: stdCta('Klarna'),
    prerequisites: ['Klarna-aftale', 'Shopify', 'Mellemregningskonto for Klarna i regnskabet'], notIncluded: [],
    dataFlow: ['betalt ordre', 'afregning → mellemregningskonto'],
  },
  'klaviyo': {
    pageTitle: 'Klaviyo til Shopify',
    definition: 'Klaviyo-integrationen sender kunder, ordrer og hændelser fra Shopify til Klaviyo, og vi bygger de flows, der faktisk sælger: forladt kurv, velkomst, efter køb og vind tilbage. Vi sætter appen, segmenterne og samtykket op og flytter flowene med i hver migrering, så intet går tabt.',
    shortDescription: 'E-mail og SMS på kundedata fra Shopify. Flows til forladt kurv, velkomst og efter køb.',
    whatItIs: 'Klaviyo er e-mail- og SMS-platformen med den dybeste Shopify-kobling. Appen er officiel, arbejdet ligger i segmenter, flows og samtykke.',
    whyItMatters: 'E-mail er den billigste kanal, I selv ejer. Forladt kurv alene betaler sig i de fleste butikker.',
    steps: stdSteps('Klaviyo'), faq: stdFaq('Klaviyo', 'e-mail'), cta: stdCta('Klaviyo'),
    prerequisites: ['Klaviyo-konto', 'Shopify', 'Samtykkebanner, der respekterer kundens valg'], notIncluded: [],
    dataFlow: ['kunder + ordrer + hændelser'],
  },
  'lipscore': {
    pageTitle: 'Lipscore til Shopify',
    definition: 'Lipscore-integrationen indsamler verificerede anmeldelser efter køb og viser dem på produktsiderne og som stjerner i Google. Vi sætter Lipscores Shopify-app op, tidspunktet for forespørgslen efter levering og visningen i temaet, og flytter eksisterende anmeldelser med fra den tidligere platform, så intet går tabt i migreringen.',
    shortDescription: 'Nordisk anmeldelsesplatform med verificerede køb, for butikker der vil have anmeldelser på nordiske sprog.',
    whatItIs: 'Lipscore er en nordisk anmeldelsesplatform med nordisk support. Et alternativ til Judge.me for butikker, der vil have en nordisk leverandør.',
    whyItMatters: 'Verificerede anmeldelser på kundens eget sprog vejer tungt hos nordiske kunder.',
    steps: stdSteps('Lipscore'), faq: stdFaq('Lipscore', 'anmeldelser'), cta: stdCta('Lipscore'),
    prerequisites: ['Lipscore-aftale', 'Shopify'], notIncluded: [],
    dataFlow: ['ordre → forespørgsel', 'anmeldelser i temaet'],
  },
  'logistra': {
    pageTitle: 'Logistra til Shopify',
    definition: 'Logistra-integrationen giver fragtvalg i checkoutet og labels til flere transportører fra én Shopify-app, med tracking tilbage til ordren og kunden. Vi sætter fragtregler op pr. zone og vægt, kobler labelflowet til det lager, der pakker, og tilpasser opsætningen til B2B-butikker med minimumsordre og faste leveringsdage.',
    shortDescription: 'Fragtvalg og labels til flere transportører, sat op til B2B med minimumsordre.',
    whatItIs: 'Logistra er en norsk fragtportal med Shopify-app. Flere transportører på én aftale.',
    whyItMatters: 'Én fragtapp til alle transportører holder checkoutet enkelt og labels ensartede.',
    steps: stdSteps('Logistra'), faq: stdFaq('Logistra', 'fragt'), cta: stdCta('Logistra'),
    prerequisites: ['Logistra-konto', 'Shopify', 'Transportøraftaler'], notIncluded: [],
    dataFlow: ['fragtvalg', 'label', 'tracking'],
  },
  'marketingplatform': {
    pageTitle: 'MarketingPlatform-integration til Shopify',
    definition: 'MarketingPlatform-integrationen sender nye nyhedsbrevstilmeldinger fra Shopify til den rigtige liste i MarketingPlatform pr. marked og tjekker, om profilen allerede findes, før den tilføjes, så ingen bliver tilmeldt to gange. Den kører som Make.com-flow i jeres egen konto, bygget til butikker, der sælger til flere lande fra samme Shopify med Shopify Markets.',
    shortDescription: 'Nyhedsbrevstilmeldinger fra Shopify til MarketingPlatform pr. marked, med dublettjek.',
    whatItIs: 'MarketingPlatform er en nordisk e-mailplatform. Shopify har ingen officiel kobling, så flowet er vores.',
    whyItMatters: 'Tre markeder betyder tre lister. Tilmeldinger skal lande det rigtige sted, uden at nogen flytter dem i hånden.',
    steps: stdSteps('MarketingPlatform'), faq: stdFaq('MarketingPlatform', 'e-mail'), cta: stdCta('MarketingPlatform'),
    prerequisites: ['MarketingPlatform med API', 'Shopify Markets', 'Make.com-konto'], notIncluded: [],
    dataFlow: ['tilmelding → liste pr. marked'],
  },
  'moodle': {
    pageTitle: 'Moodle-integration til Shopify',
    definition: 'Moodle-integrationen giver kunden adgang til det rigtige kursus i Moodle, når kurset er købt i Shopify: brugeren oprettes, hvis den mangler, og kunden tilmeldes det kursus, der svarer til produktet. Den kører som Make.com-scenarie i jeres egen konto og kan udvides med adgangsperioder, kursusniveauer og e-mailflows.',
    shortDescription: 'Køb af et kursus i Shopify giver automatisk adgang til det rigtige kursus i Moodle.',
    whatItIs: 'Moodle er en open source-læringsplatform. Shopify sælger kurset, Moodle leverer det, og flowet mellem dem er vores.',
    whyItMatters: 'Kursusudbydere, der tilmelder deltagere manuelt, mister tid og får utilfredse kunder, der venter på adgang.',
    steps: [
      ['Kortlægning', 'Hvilke produkter der svarer til hvilke kurser, adgangsperiode, og hvad der sker ved refusion.'],
      ['Opsætning i Make.com', 'Webhook ved betalt ordre, opslag på e-mail i Moodle, oprettelse af bruger og tilmelding via Moodles API.'],
      ['Test på rigtige køb', 'De første køb følges fra checkout til kursus.'],
      ['Go-live og overvågning', 'Fejl flages med ordrenummer og kursus.'],
    ],
    faq: stdFaq('Moodle', 'kurser'), cta: stdCta('Moodle'),
    prerequisites: ['Moodle med API-adgang (web services)', 'Shopify', 'Make.com-konto, vi sætter en op, hvis I ikke har en'], notIncluded: [],
    dataFlow: ['betalt ordre → bruger + tilmelding'],
  },
  'nshift': {
    pageTitle: 'nShift-integration til Shopify',
    definition: 'nShift-integrationen samler transportørerne i ét fragtcheckout og ét labelsystem, for butikker der sælger til flere lande fra Shopify Plus. Vi sætter checkoutet op, fragtregler pr. marked og labelflowet, og kobler det til det lager, hvor varerne faktisk pakkes, så labels og tracking følger ordren.',
    shortDescription: 'Flere transportører i ét checkout og ét labelsystem, for butikker der sender til flere lande.',
    whatItIs: 'nShift, tidligere Unifaun og Consignor, er en nordisk fragtplatform. Appen giver fragtvalg i checkoutet og labels til alle transportører på én aftale.',
    whyItMatters: 'Flere markeder betyder flere transportører. Én platform holder checkoutet enkelt og labels ensartede.',
    steps: stdSteps('nShift'), faq: stdFaq('nShift', 'fragt'), cta: stdCta('nShift'),
    prerequisites: ['nShift-konto med transportøraftaler', 'Shopify Plus med Markets', 'Lager eller 3PL, der pakker'], notIncluded: [],
    dataFlow: ['fragtvalg pr. marked', 'label', 'tracking'],
  },
  'omnium': {
    pageTitle: 'Omnium-integration til Shopify',
    definition: 'Omnium-integrationen gør Omnium til ordre- og lagersystem for Shopify: ordrer går ind i Omnium, lager pr. lokation kommer tilbage til Shopify, og produkter kan publiceres fra Omnium. EDI-ordrer fra Coop, XXL og Sport Holding modtages i Omnium og sendes videre til Tripletex med GLN og kontantrabat. Vi sætter Omniums Shopify-connector op og bygger EDI-flowet i Make.com.',
    shortDescription: 'Ordrer fra Shopify ind i Omnium, lager tilbage til Shopify. EDI-ordrer fra Coop, XXL og Sport Holding videre til regnskabet.',
    whatItIs: 'Omnium er et norsk ordrehåndteringssystem for grossister og kæder med flere kanaler. Shopify-connectoren er Omniums egen og kræver korrekt opsætning af marked, lager og lokations-ID for at køre. EDI-delen er vores Make.com-flow, som beriger ordren med kundedata og opretter ordre, faktura og leveringsadresse i Tripletex.',
    whyItMatters: 'Grossister, der sælger både til kæder og i egen webshop, har brug for ét sted til ordrer og lager. Uden OMS lever lageret tre steder, og EDI-ordrer tastes ind manuelt.',
    steps: [
      ['Kortlægning', 'Markeder, lagre og lokationer i Omnium, hvilke kanaler der skal ind, og hvilke kæder der sender EDI.'],
      ['Connector-opsætning', 'Global og markedsspecifik Shopify-connector, lokations-ID på lageret og første synk af produkter.'],
      ['EDI-flow i Make.com', 'Webhook fra Omnium, kundeopslag, GLN og kontantrabat, ordre og faktura i Tripletex.'],
      ['Test og go-live', 'Omniums testmiljø først, derefter produktion. Vi følger de første EDI-ordrer manuelt.'],
    ],
    faq: [
      ['Hvorfor sidder produkter fast i køen i Omnium?', 'Som regel mangler lokations-ID på lageret, store-ID har forkerte bogstaver, eller den globale connector, der vækker synkjobbet, findes ikke. Vi har tjeklisten.'],
      ['Kan Omnium erstatte Shopifys lager?', 'Ja. Omnium bliver facit for lager, og Shopify viser det, Omnium siger. Det er hele pointen.'],
      ['Hvad med EDI fra andre kæder end Coop, XXL og Sport Holding?', 'Hver ny kæde kræver en kunde i regnskabet, organisationsnummer i mappingen, GLN og kontantrabat. Det er en kendt opgave.'],
      ['Er det Make.com eller connector?', 'Begge dele. Shopify-koblingen er Omniums connector. EDI-flowet til regnskabet er Make.com i jeres konto.'],
    ],
    cta: stdCta('Omnium'),
    prerequisites: ['Omnium-tenant med Shopify-connector', 'Shopify eller Shopify Plus med lokationer', 'Tripletex eller et andet regnskabssystem til EDI-flowet', 'Make.com-konto til EDI'],
    notIncluded: ['FEFO og batchsporing. Leveres som tillæg fra Omnium-teamet'],
    dataFlow: ['ordrer', 'lagerbeholdning', 'EDI-ordre → ordre + faktura', 'produkter'],
  },
  'ongoing': {
    pageTitle: 'Ongoing WMS-integration til Shopify',
    definition: 'Ongoing WMS-integrationen sender Shopify-ordrer til det tredjepartslager, der kører Ongoing, og får lagerbeholdning og trackingnumre tilbage til Shopify og kunden. Vi sætter Ongoings Shopify-app op pr. marked, kortlægger fragtmetoder sammen med lageret og tester pluk, pak, retur og lagerjustering, før vi går live.',
    shortDescription: 'Ordrer til 3PL-lageret, lager og tracking tilbage. Sat op til Shopify Plus med flere markeder.',
    whatItIs: "Ongoing WMS er det lagersystem, mange nordiske 3PL'er bruger. Butikken får ikke selv adgang til lageret, men til den app, der kobler det til Shopify.",
    whyItMatters: 'Når lageret er outsourcet, skal ordrer ud og lager ind, uden at nogen rører dem. Fejl i fragtmetoder er den mest almindelige årsag til stop.',
    steps: stdSteps('Ongoing'), faq: stdFaq('Ongoing', 'lager'), cta: stdCta('Ongoing WMS'),
    prerequisites: ['3PL, der kører Ongoing', 'Shopify Plus eller Shopify', 'Fragtmetoder afklaret med lageret'], notIncluded: [],
    dataFlow: ['ordrer', 'lager + tracking'],
  },
  'podio': {
    pageTitle: 'Podio-bookinger til Shopify',
    definition: 'Podio-integrationen gør bookinger i Podio til ordrer i Shopify, sender annulleringer tilbage til Podio og udløser faktura i Tripletex, når lejen er leveret, ikke når den er bestilt. Den kører som Make.com-flows med betalingslink, fragtlabel via Profrakt og opslag på e-mail, så kunden genkendes på tværs af systemerne.',
    shortDescription: 'Bookinger bliver til Shopify-ordrer, annulleringer går tilbage, og fakturering udløses, når lejen er leveret.',
    whatItIs: 'Podio er et fleksibelt arbejdsværktøj, der bruges som bookingsystem. Shopify er betalingen og indgangen til regnskabet. Flowet holder dem i takt.',
    whyItMatters: 'Udlejning følger ikke checkoutets rytme. Betaling, levering og fakturering sker på forskellige dage, og hvert trin skal ramme det rigtige system.',
    steps: stdSteps('Podio'), faq: stdFaq('Podio', 'booking'), cta: stdCta('Podio'),
    prerequisites: ['Podio-arbejdsområde', 'Shopify', 'Make.com-konto', 'Tripletex til fakturering'], notIncluded: [],
    dataFlow: ['booking → draft order + betalingslink', 'annullering', 'faktura 72 timer efter levering'],
  },
  'poweroffice-go': {
    pageTitle: 'PowerOffice Go-integration til Shopify',
    definition: 'PowerOffice Go-integrationen bogfører Shopify-salg som bilagsjournal i PowerOffice Go, fordelt på indtægtskonto pr. land og mellemregningskonto pr. betalingsmetode, i stedet for en faktura pr. kunde. Refusioner bogføres som modposteringer. Den passer til B2C-butikker, hvor bogholderen vil have rene, samlede bilag, og kører som Make.com-scenarie i jeres konto, pr. uge eller pr. måned.',
    shortDescription: 'Shopify-salg som bilagsjournal, fordelt på indtægtskonto og betalingsmetode. Refusioner bogføres tilbage.',
    whatItIs: 'PowerOffice Go er et norsk cloudbaseret regnskabssystem. Vores integration bruger importendpointet til bilagsjournal: hver ordre bliver til debet- og kreditlinjer for varer og fragt, og hele perioden uploades som ét bilag med unik reference, så det aldrig bogføres dobbelt.',
    whyItMatters: 'For B2C med mange små ordrer er en faktura pr. kunde støj. Bilagsjournalen giver bogholderen færre linjer at afstemme, og udbetalingerne fra Vipps, Klarna og kort rammer hver sin mellemregningskonto.',
    steps: stdSteps('PowerOffice Go'), faq: stdFaq('PowerOffice Go', 'bilagsjournal'), cta: stdCta('PowerOffice Go'),
    prerequisites: ['PowerOffice Go med API-nøgle og abonnementsnøgle', 'Kontoplan og momskoder afklaret med bogholderen', 'Shopify eller Shopify Plus', 'Make.com-konto i jeres navn'],
    notIncluded: ['Kundekartotek. Bilagsjournalen er anonym by design', 'Lager. Shopify er facit'],
    dataFlow: ['salg → bilagsjournal', 'refusion → modpostering'],
  },
}

const KEYS = Object.keys(T)

// Translate a single-span portable text block list, keeping keys/types/style/markDefs.
function translateBlocks(blocks: Doc[] | undefined, text: string, field: string, id: string): Doc[] {
  if (!blocks || blocks.length === 0) return []
  if (blocks.length !== 1 || (blocks[0].children?.length ?? 0) !== 1) throw new Error(`${id}: ${field} has ${blocks.length} blocks; update the script`)
  const b = blocks[0]
  return [{ ...b, children: [{ ...b.children[0], text }] }]
}

function buildDa(no: Doc, key: string, extMap: Record<string, string | null>): Doc {
  const t = T[key]
  const steps = no.implementationSteps ?? []
  const faq = no.faq ?? []
  const flows = no.dataFlowSteps ?? []
  if (steps.length !== t.steps.length) throw new Error(`${no._id}: ${steps.length} steps vs ${t.steps.length} translations`)
  if (faq.length !== t.faq.length) throw new Error(`${no._id}: ${faq.length} faq vs ${t.faq.length} translations`)
  if (flows.length !== t.dataFlow.length) throw new Error(`${no._id}: ${flows.length} dataFlowSteps vs ${t.dataFlow.length} translations`)
  if ((no.prerequisites ?? []).length !== t.prerequisites.length) throw new Error(`${no._id}: prerequisites count mismatch`)
  if ((no.notIncluded ?? []).length !== t.notIncluded.length) throw new Error(`${no._id}: notIncluded count mismatch`)
  if ((no.sections ?? []).length || (no.intro ?? []).length || no.seoExtended) throw new Error(`${no._id}: has sections/intro/seoExtended; add translations to the script`)
  const catKey = (no.category?._ref as string | undefined)?.match(/^integration-cat-(.+)-no$/)?.[1]
  if (!catKey) throw new Error(`${no._id}: unexpected category ref ${no.category?._ref}`)
  const words = t.definition.trim().split(/\s+/).length
  if (words < 40 || words > 60) throw new Error(`${no._id}: definition has ${words} words`)

  // Remap references; external pages without a Danish counterpart are dropped.
  const remap = (refs: Doc[] | undefined) => (refs ?? []).flatMap((r: Doc) => {
    const id = toDa(r._ref, extMap)
    if (!id) { console.log(dataset, no._id, 'skipping ref without da counterpart', r._ref); return [] }
    return [weak(id, r._key)]
  })

  const { _id, _rev, _createdAt, _updatedAt, ...rest } = no
  return {
    ...rest,
    _id: `integration-${key}-da`,
    language: 'da',
    slug: { _type: 'slug', current: `integrations/${key}` },
    pageTitle: t.pageTitle,
    definition: t.definition,
    shortDescription: t.shortDescription,
    intro: [],
    sections: [],
    whatItIs: translateBlocks(no.whatItIs, t.whatItIs, 'whatItIs', no._id),
    whyItMatters: translateBlocks(no.whyItMatters, t.whyItMatters, 'whyItMatters', no._id),
    implementationSteps: steps.map((s: Doc, i: number) => ({ ...s, name: t.steps[i][0], text: t.steps[i][1] })),
    prerequisites: t.prerequisites,
    notIncluded: t.notIncluded,
    faq: faq.map((f: Doc, i: number) => ({ ...f, question: t.faq[i][0], answer: t.faq[i][1] })),
    cta: { ...(no.cta ?? {}), ...t.cta },
    dataFlowSteps: flows.map((f: Doc, i: number) => {
      const frequency = FREQ[f.frequency]
      if (f.frequency && !frequency) throw new Error(`${no._id}: unknown frequency "${f.frequency}"`)
      return { ...f, payload: t.dataFlow[i], ...(f.frequency ? { frequency } : {}) }
    }),
    category: weak(`integration-cat-${catKey}-da`),
    pillar: weak('pillar-integrasjoner-da'),
    clusterLinks: remap(no.clusterLinks),
    relatedPages: remap(no.relatedPages),
    relatedCaseStudies: no.relatedCaseStudies ?? [],
  }
}

async function main() {
  const ids = KEYS.map((k) => `integration-${k}-no`)
  const docs = await client.fetch<Doc[]>('*[_id in $ids]', { ids })
  const byId = new Map(docs.map((d) => [d._id, d]))
  const missing = ids.filter((id) => !byId.has(id))
  if (missing.length) throw new Error(`missing Norwegian documents: ${missing.join(', ')}`)

  // External (non -no suffixed) references → the Danish document of the same type, if any.
  const extIds = new Set<string>()
  for (const d of docs) for (const r of [...(d.clusterLinks ?? []), ...(d.relatedPages ?? [])]) if (!r._ref.endsWith('-no')) extIds.add(r._ref)
  const extDocs = await client.fetch<{ _id: string; _type: string }[]>('*[_id in $ids]{_id,_type}', { ids: [...extIds] })
  const extMap: Record<string, string | null> = {}
  for (const e of extDocs) {
    extMap[e._id] = await client.fetch<string | null>('*[_type == $type && language == "da"][0]._id', { type: e._type })
    console.log(dataset, 'external', e._type, e._id, '→', extMap[e._id] ?? '(none, skipped)')
  }
  for (const id of extIds) if (!(id in extMap)) { extMap[id] = null; console.log(dataset, 'external ref not found', id, '(skipped)') }

  for (const key of KEYS) {
    const no = byId.get(`integration-${key}-no`)!
    const da = buildDa(no, key, extMap)
    await client.createOrReplace(da as { _id: string; _type: string } & Doc)
    console.log(dataset, 'wrote', da._id, `(${da.definition.split(/\s+/).length} words in definition)`)
    const metaId = `integration-${key}-meta`
    const meta = await client.fetch<Doc | null>('*[_id == $id][0]', { id: metaId })
    if (!meta) throw new Error(`${metaId} is missing; run the en script first`)
    if ((meta.translations ?? []).some((tr: Doc) => tr._key === 'da')) {
      console.log(dataset, metaId, 'already has da')
      continue
    }
    await client.patch(metaId).insert('after', 'translations[-1]', [
      { _key: 'da', value: { _type: 'reference', _ref: da._id, _weak: true, _strengthenOnPublish: { type: 'integrationPage' } } },
    ]).commit()
    console.log(dataset, 'patched', metaId, 'with da')
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
