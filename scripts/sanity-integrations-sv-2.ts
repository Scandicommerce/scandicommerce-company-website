// TARGET_DATASET=production npx sanity exec scripts/sanity-integrations-sv-2.ts --with-user-token
// Creates Swedish versions (-sv) of 12 Norwegian integrationPage documents and adds the
// sv entry to the existing translation.metadata (integration-<x>-meta). Fetches the -no
// document in full, swaps the text fields for Swedish, remaps references to the -sv
// counterparts and keeps everything else (logo, systems, capabilities, author, order, ...) as is.
// Idempotent: createOrReplace on fixed ids; metadata is only patched when no 'sv' key exists.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

const toSv = (id: string, extMap: Record<string, string | null>): string | null =>
  id.endsWith('-no') ? id.slice(0, -3) + '-sv' : id in extMap ? extMap[id] : id
const weak = (id: string, key?: string) => ({ _type: 'reference', _ref: id, _weak: true, ...(key ? { _key: key } : {}) })

const FREQ: Record<string, string> = {
  'sanntid': 'realtid', 'løpende': 'löpande', 'etter levering': 'efter leverans', 'periodisk': 'periodiskt',
  'ved pakking': 'vid packning', 'ved ordre': 'per order', 'ved endring': 'vid ändring', 'daglig': 'dagligen',
  'månedlig': 'månadsvis', 'ukentlig': 'veckovis', 'ukentlig eller månedlig': 'veckovis eller månadsvis', 'samme kjøring': 'samma körning',
}

// Shared Swedish copy for the standard FAQ / steps / CTA that most pages use.
const stdSteps = (name: string): [string, string][] => [
  ['Kartläggning', `Vad som ska flöda mellan Shopify och ${name}, vilket system som är facit för vad, och vad som händer vid fel. Ett arbetspass.`],
  ['Uppsättning', 'Anslutning i ert eget konto, mappning av fält och testdata genom hela flödet.'],
  ['Test på riktiga data', 'De första ordrarna eller produkterna följs manuellt innan vi slår på allt.'],
  ['Go-live och övervakning', 'Vi följer de första veckorna. Fel flaggas med referens till ordern.'],
]
const stdFaq = (name: string, startWith: string): [string, string][] => [
  [`Äger vi integrationen mot ${name} själva?`, 'Ja. Make.com-scenarier ligger i ert konto, och kod levereras med källkod. Vi driftar om ni vill, men ni är inte låsta till oss.'],
  ['Vad händer när en körning misslyckas?', 'Varje körning finns i historiken med in- och utdata. Fel flaggas med referens, och vi städar upp tillsammans. Det finns ingen automatisk återställning, och det säger vi rakt ut.'],
  [`Kan vi börja med ${startWith} och utöka senare?`, 'Ja. De flesta börjar med ett flöde, till exempel order, och lägger till lager eller kunder efteråt.'],
  ['Hur lång tid tar uppsättningen?', 'Make.com-flöden levereras på dagar när kartläggningen är gjord. Egen kod tar längre tid, och vi ger en tidsplan efter första samtalet.'],
]
const stdCta = (name: string) => ({ heading: `Kör ni ${name} i dag?`, text: 'Berätta vilka system ni har, så får ni metod, dataflöde och tidsplan inom två arbetsdagar.', buttonLabel: 'Boka ett samtal', buttonHref: '/contact' })

type Tr = {
  pageTitle: string; definition: string; shortDescription: string
  whatItIs: string; whyItMatters: string
  steps: [string, string][]; faq: [string, string][]; cta: Doc
  prerequisites: string[]; notIncluded: string[]
  dataFlow: string[] // payload per dataFlowSteps index
}

const T: Record<string, Tr> = {
  'judge-me': {
    pageTitle: 'Judge.me för Shopify',
    definition: 'Judge.me-integrationen ber kunden om ett omdöme efter leverans, visar omdömena på produktsidorna och skickar dem till Google som strukturerad data. Vi sätter upp appen, tidpunkten för förfrågan, visningen i temat och importen av befintliga omdömen när ni migrerar, så att inget går förlorat.',
    shortDescription: 'Produktomdömen som samlas in efter köp och visas i butiken och i Google.',
    whatItIs: 'Judge.me är en omdömesapp för Shopify. Officiell app, jobbet ligger i temat och i importen från den tidigare plattformen.',
    whyItMatters: 'Omdömen höjer konverteringen och ger stjärnor i Google. Tappar ni dem i en migrering tappar ni båda delarna.',
    steps: stdSteps('Judge.me'), faq: stdFaq('Judge.me', 'omdömen'), cta: stdCta('Judge.me'),
    prerequisites: ['Judge.me-konto', 'Shopify', 'Export av befintliga omdömen'], notIncluded: [],
    dataFlow: ['order → förfrågan om omdöme', 'omdömen i temat'],
  },
  'klarna': {
    pageTitle: 'Klarna för Shopify',
    definition: 'Klarna-integrationen ger faktura och delbetalning i Shopify-kassan via Klarnas betalapp, och bokför Klarnas utbetalningar mot ett eget avräkningskonto i bokföringen, så att avgifter och utbetalningar kan stämmas av per period. Vi sätter upp appen, testar kassan på mobil och desktop, och stämmer av konton och moms på avgifterna med er redovisningskonsult före go-live.',
    shortDescription: 'Faktura och delbetalning i Shopify-kassan, med avräkning mot ett eget avräkningskonto i bokföringen.',
    whatItIs: 'Klarna är betaltjänsten för köp nu och betala senare. I Shopify är den en betalmetod, inte en egen kassa.',
    whyItMatters: 'Delbetalning höjer snittordern inom mode och inredning. Avräkningen måste ändå stämma i bokföringen.',
    steps: stdSteps('Klarna'), faq: stdFaq('Klarna', 'betalning'), cta: stdCta('Klarna'),
    prerequisites: ['Klarna-avtal', 'Shopify', 'Avräkningskonto för Klarna i bokföringen'], notIncluded: [],
    dataFlow: ['betald order', 'avräkning → avräkningskonto'],
  },
  'klaviyo': {
    pageTitle: 'Klaviyo för Shopify',
    definition: 'Klaviyo-integrationen skickar kunder, ordrar och händelser från Shopify till Klaviyo, och vi bygger flödena som faktiskt säljer: övergiven varukorg, välkomst, efter köp och vinn tillbaka. Vi sätter upp appen, segmenten och samtycket, och flyttar med flödena i varje migrering, så att inget tappas på vägen.',
    shortDescription: 'E-post och SMS på kunddata från Shopify. Flöden för övergiven varukorg, välkomst och efter köp.',
    whatItIs: 'Klaviyo är e-post- och SMS-plattformen med djupast Shopify-koppling. Appen är officiell, jobbet ligger i segment, flöden och samtycke.',
    whyItMatters: 'E-post är den billigaste kanalen ni äger. Övergiven varukorg betalar sig ensam i de flesta butiker.',
    steps: stdSteps('Klaviyo'), faq: stdFaq('Klaviyo', 'e-post'), cta: stdCta('Klaviyo'),
    prerequisites: ['Klaviyo-konto', 'Shopify', 'Samtyckesbanner som respekterar valet'], notIncluded: [],
    dataFlow: ['kunder + ordrar + händelser'],
  },
  'lipscore': {
    pageTitle: 'Lipscore för Shopify',
    definition: 'Lipscore-integrationen samlar in verifierade omdömen efter köp och visar dem på produktsidorna och som stjärnor i Google. Vi sätter upp Lipscores Shopify-app, tidpunkten för förfrågan efter leverans och visningen i temat, och flyttar med befintliga omdömen från den tidigare plattformen så att inget går förlorat i migreringen.',
    shortDescription: 'Nordisk omdömesplattform med verifierade köp, för butiker som vill ha en nordisk leverantör.',
    whatItIs: 'Lipscore är en nordisk omdömesplattform med nordisk support. Ett alternativ till Judge.me för butiker som vill ha en nordisk leverantör.',
    whyItMatters: 'Verifierade omdömen på kundens eget språk väger tungt hos nordiska kunder.',
    steps: stdSteps('Lipscore'), faq: stdFaq('Lipscore', 'omdömen'), cta: stdCta('Lipscore'),
    prerequisites: ['Lipscore-avtal', 'Shopify'], notIncluded: [],
    dataFlow: ['order → förfrågan', 'omdömen i temat'],
  },
  'logistra': {
    pageTitle: 'Logistra för Shopify',
    definition: 'Logistra-integrationen ger fraktval i kassan och etiketter för flera transportörer från en och samma Shopify-app, med spårning tillbaka till ordern och kunden. Vi sätter upp fraktregler per zon och vikt, kopplar etikettflödet till lagret som packar, och anpassar uppsättningen för B2B-butiker med minimiorder och fasta leveransdagar.',
    shortDescription: 'Fraktval och etiketter för flera transportörer, uppsatt för B2B med minimiorder.',
    whatItIs: 'Logistra är en norsk fraktportal med Shopify-app. Flera transportörer på ett och samma avtal.',
    whyItMatters: 'En fraktapp för alla transportörer håller kassan enkel och etiketterna enhetliga.',
    steps: stdSteps('Logistra'), faq: stdFaq('Logistra', 'frakt'), cta: stdCta('Logistra'),
    prerequisites: ['Logistra-konto', 'Shopify', 'Transportörsavtal'], notIncluded: [],
    dataFlow: ['fraktval', 'etikett', 'spårning'],
  },
  'marketingplatform': {
    pageTitle: 'MarketingPlatform-integration för Shopify',
    definition: 'MarketingPlatform-integrationen skickar nya nyhetsbrevsanmälningar från Shopify till rätt lista i MarketingPlatform per marknad, och kontrollerar om profilen redan finns innan den läggs till, så att ingen hamnar dubbelt. Den körs som ett Make.com-flöde i ert eget konto, byggd för butiker som säljer till flera länder från samma Shopify med Shopify Markets.',
    shortDescription: 'Nyhetsbrevsanmälningar från Shopify till MarketingPlatform per marknad, med dubblettkontroll.',
    whatItIs: 'MarketingPlatform är en nordisk e-postplattform. Shopify har ingen officiell koppling, så flödet är vårt.',
    whyItMatters: 'Tre marknader betyder tre listor. Anmälningarna måste hamna rätt utan att någon flyttar dem för hand.',
    steps: stdSteps('MarketingPlatform'), faq: stdFaq('MarketingPlatform', 'e-post'), cta: stdCta('MarketingPlatform'),
    prerequisites: ['MarketingPlatform med API', 'Shopify Markets', 'Make.com-konto'], notIncluded: [],
    dataFlow: ['anmälan → lista per marknad'],
  },
  'moodle': {
    pageTitle: 'Moodle-integration för Shopify',
    definition: 'Moodle-integrationen ger kunden tillgång till rätt kurs i Moodle när kursen köps i Shopify: en användare skapas om den saknas, och kunden registreras på kursen som motsvarar produkten. Den körs som ett Make.com-scenario i ert eget konto och kan utökas med åtkomstperioder, kursnivåer och e-postflöden.',
    shortDescription: 'Köp av en kurs i Shopify ger automatiskt tillgång till rätt kurs i Moodle.',
    whatItIs: 'Moodle är en lärplattform med öppen källkod. Shopify säljer kursen, Moodle levererar den, och flödet mellan dem är vårt.',
    whyItMatters: 'Kursleverantörer som registrerar deltagare för hand förlorar tid och får missnöjda kunder som väntar på tillgång.',
    steps: [
      ['Kartläggning', 'Vilka produkter som motsvarar vilka kurser, åtkomstperiod och vad som händer vid återbetalning.'],
      ['Uppsättning i Make.com', 'Webhook vid betald order, uppslag på e-post i Moodle, skapande av användare och registrering via Moodles API.'],
      ['Test på riktiga köp', 'De första köpen följs från kassa till kurs.'],
      ['Go-live och övervakning', 'Fel flaggas med ordernummer och kurs.'],
    ],
    faq: stdFaq('Moodle', 'kurser'), cta: stdCta('Moodle'),
    prerequisites: ['Moodle med API-åtkomst (web services)', 'Shopify', 'Make.com-konto, vi sätter upp ett om ni saknar'], notIncluded: [],
    dataFlow: ['betald order → användare + registrering'],
  },
  'nshift': {
    pageTitle: 'nShift-integration för Shopify',
    definition: 'nShift-integrationen samlar transportörerna i en fraktkassa och ett etikettsystem, med alla transportörer på ett och samma avtal, för butiker som säljer till flera länder från Shopify Plus. Vi sätter upp kassan, fraktregler per marknad och etikettflödet, och kopplar det till lagret där varorna faktiskt packas.',
    shortDescription: 'Flera transportörer i en kassa och ett etikettsystem, för butiker som skickar till flera länder.',
    whatItIs: 'nShift, tidigare Unifaun och Consignor, är en nordisk fraktplattform. Appen ger fraktval i kassan och etiketter för alla transportörer på ett och samma avtal.',
    whyItMatters: 'Fler marknader betyder fler transportörer. En plattform håller kassan enkel och etiketterna enhetliga.',
    steps: stdSteps('nShift'), faq: stdFaq('nShift', 'frakt'), cta: stdCta('nShift'),
    prerequisites: ['nShift-konto med transportörsavtal', 'Shopify Plus med Markets', 'Lager eller 3PL som packar'], notIncluded: [],
    dataFlow: ['fraktval per marknad', 'etikett', 'spårning'],
  },
  'omnium': {
    pageTitle: 'Omnium-integration för Shopify',
    definition: 'Omnium-integrationen gör Omnium till order- och lagersystem för Shopify: ordrar går in i Omnium, lager per plats kommer tillbaka till Shopify, och produkter kan publiceras från Omnium. EDI-ordrar från Coop, XXL och Sport Holding tas emot i Omnium och skickas vidare till Tripletex med GLN och kassarabatt. Vi sätter upp Omniums Shopify-konnektor och bygger EDI-flödet i Make.com.',
    shortDescription: 'Ordrar från Shopify in i Omnium, lager tillbaka till Shopify. EDI-ordrar från Coop, XXL och Sport Holding vidare till bokföringen.',
    whatItIs: 'Omnium är ett norskt orderhanteringssystem för grossister och kedjor med flera kanaler. Shopify-konnektorn är Omniums egen, och kräver rätt uppsättning av marknad, lager och plats-ID för att köra. EDI-delen är vårt Make.com-flöde som berikar ordern med kunddata och skapar order, faktura och leveransadress i Tripletex.',
    whyItMatters: 'Grossister som säljer både till kedjor och i egen webbutik behöver ett ställe för order och lager. Utan OMS lever lagret på tre ställen, och EDI-ordrar knappas in för hand.',
    steps: [
      ['Kartläggning', 'Marknader, lager och platser i Omnium, vilka kanaler som ska in, och vilka kedjor som skickar EDI.'],
      ['Uppsättning av konnektor', 'Global och marknadsspecifik Shopify-konnektor, plats-ID på lagret, och första synken av produkter.'],
      ['EDI-flöde i Make.com', 'Webhook från Omnium, kunduppslag, GLN och kassarabatt, order och faktura i Tripletex.'],
      ['Test och go-live', 'Omniums testmiljö först, sedan produktion. Vi följer de första EDI-ordrarna manuellt.'],
    ],
    faq: [
      ['Varför fastnar produkter i kö i Omnium?', 'Oftast saknas plats-ID på lagret, store-ID har fel skiftläge, eller så finns inte den globala konnektorn som väcker synkjobbet. Vi har checklistan.'],
      ['Kan Omnium ersätta Shopifys lager?', 'Ja. Omnium blir facit för lagret, och Shopify visar det Omnium säger. Det är poängen.'],
      ['Hur blir det med EDI från andra kedjor än Coop, XXL och Sport Holding?', 'Varje ny kedja behöver en kund i bokföringen, organisationsnummer i mappningen, GLN och kassarabatt. Det är ett känt jobb.'],
      ['Är det här Make.com eller konnektor?', 'Båda. Shopify-kopplingen är Omniums konnektor. EDI-flödet till bokföringen är Make.com i ert konto.'],
    ],
    cta: stdCta('Omnium'),
    prerequisites: ['Omnium-tenant med Shopify-konnektor', 'Shopify eller Shopify Plus med platser', 'Tripletex eller annat bokföringssystem för EDI-flödet', 'Make.com-konto för EDI'],
    notIncluded: ['FEFO och batchspårning. Levereras som tillägg av Omnium-teamet'],
    dataFlow: ['ordrar', 'lagersaldo', 'EDI-order → order + faktura', 'produkter'],
  },
  'ongoing': {
    pageTitle: 'Ongoing WMS-integration för Shopify',
    definition: 'Ongoing WMS-integrationen skickar Shopify-ordrar till tredjepartslagret som kör Ongoing, och får lagersaldo och spårningsnummer tillbaka till både Shopify och kunden. Vi sätter upp Ongoings egen Shopify-app per marknad, kartlägger fraktmetoder tillsammans med lagret, och testar plock, pack, retur och lagerjustering före go-live.',
    shortDescription: 'Ordrar till 3PL-lagret, lager och spårning tillbaka. Uppsatt för Shopify Plus med flera marknader.',
    whatItIs: 'Ongoing WMS är lagersystemet som många nordiska 3PL:er använder. Butiken får inte själv tillgång till lagret, utan till appen som kopplar det till Shopify.',
    whyItMatters: 'När lagret är outsourcat måste ordrar gå ut och lagersaldo komma in utan att någon rör dem. Fel i fraktmetoder är den vanligaste orsaken till stopp.',
    steps: stdSteps('Ongoing'), faq: stdFaq('Ongoing', 'lager'), cta: stdCta('Ongoing WMS'),
    prerequisites: ['3PL som kör Ongoing', 'Shopify Plus eller Shopify', 'Fraktmetoder avstämda med lagret'], notIncluded: [],
    dataFlow: ['ordrar', 'lager + spårning'],
  },
  'podio': {
    pageTitle: 'Podio-bokningar till Shopify',
    definition: 'Podio-integrationen gör bokningar i Podio till ordrar i Shopify, skickar avbokningar tillbaka till Podio, och utlöser faktura i Tripletex när hyran är levererad, inte när den bokades. Den körs som Make.com-flöden i ert eget konto, med betalningslänk, fraktetikett via Profrakt och uppslag på e-post.',
    shortDescription: 'Bokningar blir Shopify-ordrar, avbokningar går tillbaka, och faktureringen utlöses när hyran är levererad.',
    whatItIs: 'Podio är ett flexibelt arbetsverktyg som används som bokningssystem. Shopify är betalningen och ingången till bokföringen. Flödet håller dem i takt.',
    whyItMatters: 'Uthyrning följer inte kassans rytm. Betalning, leverans och fakturering sker på olika dagar, och varje steg måste träffa rätt system.',
    steps: stdSteps('Podio'), faq: stdFaq('Podio', 'bokningar'), cta: stdCta('Podio'),
    prerequisites: ['Podio-arbetsyta', 'Shopify', 'Make.com-konto', 'Tripletex för fakturering'], notIncluded: [],
    dataFlow: ['bokning → draft order + betalningslänk', 'avbokning', 'faktura 72 h efter leverans'],
  },
  'poweroffice-go': {
    pageTitle: 'PowerOffice Go-integration för Shopify',
    definition: 'PowerOffice Go-integrationen bokför Shopify-försäljning som en verifikationsjournal i PowerOffice Go, fördelad på intäktskonto per land och avräkningskonto per betalsätt, i stället för en faktura per kund. Återbetalningar bokförs som motbokningar. Den passar B2C-butiker där redovisningskonsulten vill ha rena, samlade verifikationer, och körs som ett Make.com-scenario i ert konto, per vecka eller per månad.',
    shortDescription: 'Shopify-försäljning som verifikationsjournal, fördelad på intäktskonto och betalsätt. Återbetalningar bokförs tillbaka.',
    whatItIs: 'PowerOffice Go är ett norskt molnbaserat bokföringssystem. Vår integration använder importändpunkten för verifikationsjournal: varje order blir debet- och kreditrader för varor och frakt, och hela perioden laddas upp som en verifikation med unik referens, så att den aldrig bokförs dubbelt.',
    whyItMatters: 'För B2C med många små ordrar är en faktura per kund brus. Verifikationsjournalen ger redovisningskonsulten färre rader att stämma av, och utbetalningarna från Vipps, Klarna och kort träffar var sitt avräkningskonto.',
    steps: stdSteps('PowerOffice Go'), faq: stdFaq('PowerOffice Go', 'verifikationsjournalen'), cta: stdCta('PowerOffice Go'),
    prerequisites: ['PowerOffice Go med API-nyckel och abonnemangsnyckel', 'Kontoplan och momskoder avstämda med redovisningskonsulten', 'Shopify eller Shopify Plus', 'Make.com-konto i ert namn'],
    notIncluded: ['Kundregister. Verifikationsjournalen är anonym per design', 'Lager. Shopify är facit'],
    dataFlow: ['försäljning → verifikationsjournal', 'återbetalning → motbokning'],
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

function buildSv(no: Doc, key: string, extMap: Record<string, string | null>): Doc {
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

  // Remap references; external pages without a Swedish counterpart are dropped.
  const remap = (refs: Doc[] | undefined) => (refs ?? []).flatMap((r: Doc) => {
    const id = toSv(r._ref, extMap)
    if (!id) { console.log(dataset, no._id, 'skipping ref without sv counterpart', r._ref); return [] }
    return [weak(id, r._key)]
  })

  const { _id, _rev, _createdAt, _updatedAt, ...rest } = no
  return {
    ...rest,
    _id: `integration-${key}-sv`,
    language: 'sv',
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
    category: weak(`integration-cat-${catKey}-sv`),
    pillar: weak('pillar-integrasjoner-sv'),
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

  // External (non -no suffixed) references → the Swedish document of the same type, if any.
  const extIds = new Set<string>()
  for (const d of docs) for (const r of [...(d.clusterLinks ?? []), ...(d.relatedPages ?? [])]) if (!r._ref.endsWith('-no')) extIds.add(r._ref)
  const extDocs = await client.fetch<{ _id: string; _type: string }[]>('*[_id in $ids]{_id,_type}', { ids: [...extIds] })
  const extMap: Record<string, string | null> = {}
  for (const e of extDocs) {
    extMap[e._id] = await client.fetch<string | null>('*[_type == $type && language == "sv"][0]._id', { type: e._type })
    console.log(dataset, 'external', e._type, e._id, '→', extMap[e._id] ?? '(none, skipped)')
  }
  for (const id of extIds) if (!(id in extMap)) { extMap[id] = null; console.log(dataset, 'external ref not found', id, '(skipped)') }

  for (const key of KEYS) {
    const no = byId.get(`integration-${key}-no`)!
    const sv = buildSv(no, key, extMap)
    await client.createOrReplace(sv as { _id: string; _type: string } & Doc)
    console.log(dataset, 'wrote', sv._id, `(${sv.definition.split(/\s+/).length} words in definition)`)
    const metaId = `integration-${key}-meta`
    const meta = await client.fetch<Doc | null>('*[_id == $id][0]', { id: metaId })
    if (!meta) throw new Error(`${metaId} is missing; run the en script first`)
    if ((meta.translations ?? []).some((tr: Doc) => tr._key === 'sv')) {
      console.log(dataset, metaId, 'already has sv')
      continue
    }
    await client.patch(metaId).insert('after', 'translations[-1]', [
      { _key: 'sv', value: { _type: 'reference', _ref: sv._id, _weak: true, _strengthenOnPublish: { type: 'integrationPage' } } },
    ]).commit()
    console.log(dataset, 'patched', metaId, 'with sv')
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
