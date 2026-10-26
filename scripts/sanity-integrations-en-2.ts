// TARGET_DATASET=production npx sanity exec scripts/sanity-integrations-en-2.ts --with-user-token
// Creates English versions (-en) of 12 Norwegian integrationPage documents plus
// translation.metadata for each pair. Fetches the -no document in full, swaps the
// text fields for English, remaps references to the -en counterparts and keeps
// everything else (logo, systems, capabilities, author, order, ...) as is.
// Idempotent: createOrReplace on fixed ids.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

// Norwegian page/document ids that are not -no/-en suffixed → English counterpart.
const ID_MAP: Record<string, string> = {
  '1368ee2e-b89e-44e4-ac40-36fd19f2c879': 'e9ee91de-b1b2-47a6-9ded-7672b1f6911c', // allPackagesPage
  '46bf58c8-302e-4fb2-bebe-5c6f505a97b3': 'c749a129-ccca-44ab-a01b-0247652026fe', // partnersPage
  'b6bda7fa-b329-48d0-8aed-e73335edf5ec': '755346ec-b0a7-4b77-9bb9-e0adca1031e8', // migratePage (per translation.metadata)
  '893a0019-404e-4c88-ae34-ae35fc49cce8': 'e7c53aa6-0987-4f9b-bfbb-fbd8a5858771', // vippsHurtigkassePage (per translation.metadata)
}
const toEn = (id: string) => ID_MAP[id] ?? (id.endsWith('-no') ? id.slice(0, -3) + '-en' : id)
const weak = (id: string, key?: string) => ({ _type: 'reference', _ref: id, _weak: true, ...(key ? { _key: key } : {}) })

const FREQ: Record<string, string> = {
  'sanntid': 'real time', 'løpende': 'continuous', 'etter levering': 'after delivery', 'periodisk': 'periodic',
  'ved pakking': 'at packing', 'ved ordre': 'per order', 'ved endring': 'on change', 'daglig': 'daily',
  'månedlig': 'monthly', 'ukentlig': 'weekly', 'ukentlig eller månedlig': 'weekly or monthly', 'samme kjøring': 'same run',
}

// Shared English copy for the standard FAQ / steps / CTA that most pages use.
const stdSteps = (name: string): [string, string][] => [
  ['Mapping', `What should flow between Shopify and ${name}, which system is the source of truth for what, and what happens on errors. One working session.`],
  ['Setup', 'Connection in your own account, field mapping, and test data through the whole flow.'],
  ['Test on real data', 'The first orders or products are followed manually before we switch everything on.'],
  ['Go-live and monitoring', 'We follow the first weeks. Errors are flagged with a reference to the order.'],
]
const stdFaq = (name: string, startWith: string): [string, string][] => [
  [`Do we own the ${name} integration ourselves?`, 'Yes. Make.com scenarios live in your account, and code is delivered with source. We run it for you if you want, but you are not locked in to us.'],
  ['What happens when a run fails?', 'Every run is in the history with input and output data. Errors are flagged with a reference, and we clean up together. There is no automatic rollback, and we say so plainly.'],
  [`Can we start with ${startWith} and expand later?`, 'Yes. Most start with one flow, such as orders, and add inventory or customers afterwards.'],
  ['How long does setup take?', 'Make.com flows are delivered in days once mapping is done. Custom code takes longer, and we give a timeline after the first call.'],
]
const stdCta = (name: string) => ({ heading: `Running ${name} today?`, text: 'Tell us which systems you have, and you get method, data flow and timeline within two working days.', buttonLabel: 'Book a call', buttonHref: '/contact' })

type Tr = {
  pageTitle: string; definition: string; shortDescription: string
  whatItIs: string; whyItMatters: string
  steps: [string, string][]; faq: [string, string][]; cta: Doc
  prerequisites: string[]; notIncluded: string[]
  dataFlow: string[] // payload per dataFlowSteps index
}

const T: Record<string, Tr> = {
  'judge-me': {
    pageTitle: 'Judge.me for Shopify',
    definition: 'The Judge.me integration asks the customer for a review after delivery, shows the reviews on product pages and sends them to Google as structured data. We set up the app, the timing of the request, the display in the theme and the import of existing reviews when you migrate.',
    shortDescription: 'Product reviews collected after purchase and shown in the store and in Google.',
    whatItIs: 'Judge.me is a review app for Shopify. Official app, the work is in the theme and in importing from the previous platform.',
    whyItMatters: 'Reviews lift conversion and give you stars in Google. Lose them in a migration and you lose both.',
    steps: stdSteps('Judge.me'), faq: stdFaq('Judge.me', 'reviews'), cta: stdCta('Judge.me'),
    prerequisites: ['Judge.me account', 'Shopify', 'Export of existing reviews'], notIncluded: [],
    dataFlow: ['order → review request', 'reviews in theme'],
  },
  'klarna': {
    pageTitle: 'Klarna for Shopify',
    definition: "The Klarna integration adds invoice and instalment payments to the Shopify checkout through Klarna's payment app, and posts Klarna payouts to a separate clearing account so fees and payouts can be reconciled per period. We set up the app, test checkout on mobile and desktop, and agree accounts and VAT on fees with your accountant before go-live.",
    shortDescription: 'Invoice and instalment payments in the Shopify checkout, with payouts settled against a separate clearing account in the accounts.',
    whatItIs: 'Klarna is the buy now, pay later payment service. In Shopify it is a payment method, not a separate checkout.',
    whyItMatters: 'Instalments raise average order value in fashion and interiors. The settlement still has to add up in the accounts.',
    steps: stdSteps('Klarna'), faq: stdFaq('Klarna', 'payments'), cta: stdCta('Klarna'),
    prerequisites: ['Klarna agreement', 'Shopify', 'Clearing account for Klarna in the accounts'], notIncluded: [],
    dataFlow: ['paid order', 'settlement → clearing account'],
  },
  'klaviyo': {
    pageTitle: 'Klaviyo for Shopify',
    definition: 'The Klaviyo integration sends customers, orders and events from Shopify to Klaviyo, and we build the flows that actually sell: abandoned cart, welcome, post-purchase and win-back. We set up the app, the segments and consent, and move the flows with you in every migration.',
    shortDescription: 'Email and SMS on customer data from Shopify. Flows for abandoned cart, welcome and post-purchase.',
    whatItIs: 'Klaviyo is the email and SMS platform with the deepest Shopify connection. The app is official, the work is in segments, flows and consent.',
    whyItMatters: 'Email is the cheapest channel you own. Abandoned cart alone pays for itself in most stores.',
    steps: stdSteps('Klaviyo'), faq: stdFaq('Klaviyo', 'email'), cta: stdCta('Klaviyo'),
    prerequisites: ['Klaviyo account', 'Shopify', 'Consent banner that respects the choice made'], notIncluded: [],
    dataFlow: ['customers + orders + events'],
  },
  'lipscore': {
    pageTitle: 'Lipscore for Shopify',
    definition: "The Lipscore integration collects verified reviews after purchase and shows them on product pages and as stars in Google. We set up Lipscore's Shopify app, the timing of the request after delivery and the display in the theme, and bring existing reviews over from your previous platform so nothing is lost in the migration.",
    shortDescription: 'Nordic review platform with verified purchases, for stores that want reviews in Norwegian.',
    whatItIs: 'Lipscore is a Nordic review platform with Norwegian support. An alternative to Judge.me for stores that want a Nordic vendor.',
    whyItMatters: 'Verified reviews in Norwegian carry real weight with Norwegian customers.',
    steps: stdSteps('Lipscore'), faq: stdFaq('Lipscore', 'reviews'), cta: stdCta('Lipscore'),
    prerequisites: ['Lipscore agreement', 'Shopify'], notIncluded: [],
    dataFlow: ['order → request', 'reviews in theme'],
  },
  'logistra': {
    pageTitle: 'Logistra for Shopify',
    definition: 'The Logistra integration gives you shipping options at checkout and labels for several carriers from one Shopify app, with tracking back to the order and the customer. We set up shipping rules per zone and weight, connect the label flow to the warehouse that packs, and adapt the setup for B2B stores with minimum orders and fixed delivery days.',
    shortDescription: 'Shipping options and labels for several carriers, set up for B2B with minimum orders.',
    whatItIs: 'Logistra is a Norwegian shipping portal with a Shopify app. Several carriers on one agreement.',
    whyItMatters: 'One shipping app for all carriers keeps the checkout simple and the labels consistent.',
    steps: stdSteps('Logistra'), faq: stdFaq('Logistra', 'shipping'), cta: stdCta('Logistra'),
    prerequisites: ['Logistra account', 'Shopify', 'Carrier agreements'], notIncluded: [],
    dataFlow: ['shipping options', 'label', 'tracking'],
  },
  'marketingplatform': {
    pageTitle: 'MarketingPlatform integration for Shopify',
    definition: 'The MarketingPlatform integration sends new newsletter sign-ups from Shopify to the right list in MarketingPlatform per market, and checks whether the profile already exists before adding it, so nobody is added twice. It runs as a Make.com flow in your own account, built for stores selling to several countries from one Shopify with Shopify Markets.',
    shortDescription: 'Newsletter sign-ups from Shopify to MarketingPlatform per market, with duplicate check.',
    whatItIs: 'MarketingPlatform is a Nordic email platform. Shopify has no official connection, so the flow is ours.',
    whyItMatters: 'Three markets means three lists. Sign-ups have to land in the right one without anyone moving them by hand.',
    steps: stdSteps('MarketingPlatform'), faq: stdFaq('MarketingPlatform', 'email'), cta: stdCta('MarketingPlatform'),
    prerequisites: ['MarketingPlatform with API', 'Shopify Markets', 'Make.com account'], notIncluded: [],
    dataFlow: ['sign-up → list per market'],
  },
  'moodle': {
    pageTitle: 'Moodle integration for Shopify',
    definition: 'The Moodle integration gives the customer access to the right course in Moodle when the course is bought in Shopify: a user is created if missing, and the customer is enrolled in the course that matches the product. It runs as a Make.com scenario in your account and can be extended with access periods, course levels and email flows.',
    shortDescription: 'Buying a course in Shopify automatically gives access to the right course in Moodle.',
    whatItIs: 'Moodle is an open-source learning platform. Shopify sells the course, Moodle delivers it, and the flow between them is ours.',
    whyItMatters: 'Course providers who enrol students by hand lose time and get unhappy customers waiting for access.',
    steps: [
      ['Mapping', 'Which products correspond to which courses, the access period, and what happens on refunds.'],
      ['Setup in Make.com', "Webhook on paid order, lookup by email in Moodle, user creation and enrolment through Moodle's API."],
      ['Test on real purchases', 'The first purchases are followed from checkout to course.'],
      ['Go-live and monitoring', 'Errors are flagged with order number and course.'],
    ],
    faq: stdFaq('Moodle', 'courses'), cta: stdCta('Moodle'),
    prerequisites: ['Moodle with API access (web services)', 'Shopify', "Make.com account, we set one up if you don't have one"], notIncluded: [],
    dataFlow: ['paid order → user + enrolment'],
  },
  'nshift': {
    pageTitle: 'nShift integration for Shopify',
    definition: 'The nShift integration brings all carriers into one shipping checkout and one label system, for stores selling to several countries from Shopify Plus. We set up the checkout, shipping rules per market and the label flow, and connect it to the warehouse where the goods are actually packed.',
    shortDescription: 'Several carriers in one checkout and one label system, for stores shipping to several countries.',
    whatItIs: 'nShift, formerly Unifaun and Consignor, is a Nordic shipping platform. The app gives shipping options at checkout and labels for all carriers on one agreement.',
    whyItMatters: 'More markets means more carriers. One platform keeps the checkout simple and the labels consistent.',
    steps: stdSteps('nShift'), faq: stdFaq('nShift', 'shipping'), cta: stdCta('nShift'),
    prerequisites: ['nShift account with carrier agreements', 'Shopify Plus with Markets', 'Warehouse or 3PL that packs'], notIncluded: [],
    dataFlow: ['shipping options per market', 'label', 'tracking'],
  },
  'omnium': {
    pageTitle: 'Omnium integration for Shopify',
    definition: "The Omnium integration makes Omnium the order and inventory system for Shopify: orders go in, stock per location comes back, and products can be published from Omnium. EDI orders from Coop, XXL and Sport Holding land in Omnium and flow to Tripletex with GLN and cash discount. We set up Omnium's Shopify connector and build the EDI flow in Make.com.",
    shortDescription: 'Orders from Shopify into Omnium, stock back to Shopify. EDI orders from Coop, XXL and Sport Holding on to the accounts.',
    whatItIs: "Omnium is a Norwegian order management system for wholesalers and chains with several channels. The Shopify connector is Omnium's own, and needs market, warehouse and location ID set up correctly to run. The EDI part is our Make.com flow, which enriches the order with customer data and creates the order, invoice and delivery address in Tripletex.",
    whyItMatters: 'Wholesalers selling both to chains and in their own web store need one place for orders and stock. Without an OMS, stock lives in three places and EDI orders are keyed in by hand.',
    steps: [
      ['Mapping', 'Markets, warehouses and locations in Omnium, which channels come in, and which chains send EDI.'],
      ['Connector setup', 'Global and market-specific Shopify connector, location ID on the warehouse, and the first product sync.'],
      ['EDI flow in Make.com', 'Webhook from Omnium, customer lookup, GLN and cash discount, order and invoice in Tripletex.'],
      ['Test and go-live', "Omnium's test environment first, then production. We follow the first EDI orders manually."],
    ],
    faq: [
      ['Why do products get stuck in the queue in Omnium?', 'Usually the warehouse is missing a location ID, the store ID has the wrong casing, or the global connector that wakes the sync job does not exist. We have the checklist.'],
      ["Can Omnium replace Shopify's inventory?", 'Yes. Omnium becomes the source of truth for stock, and Shopify shows what Omnium says. That is the point.'],
      ['What about EDI from chains other than Coop, XXL and Sport Holding?', 'Each new chain needs a customer in the accounts, an organisation number in the mapping, GLN and cash discount. It is a known job.'],
      ['Is this Make.com or a connector?', "Both. The Shopify link is Omnium's connector. The EDI flow to the accounts is Make.com in your account."],
    ],
    cta: stdCta('Omnium'),
    prerequisites: ['Omnium tenant with Shopify connector', 'Shopify or Shopify Plus with locations', 'Tripletex or another accounting system for the EDI flow', 'Make.com account for EDI'],
    notIncluded: ['FEFO and batch tracking. Delivered as an add-on by the Omnium team'],
    dataFlow: ['orders', 'stock levels', 'EDI order → order + invoice', 'products'],
  },
  'ongoing': {
    pageTitle: 'Ongoing WMS integration for Shopify',
    definition: "The Ongoing WMS integration sends Shopify orders to the third-party warehouse running Ongoing, and gets stock levels and tracking numbers back to Shopify and the customer. We set up Ongoing's Shopify app per market, map shipping methods together with the warehouse, and test pick, pack, returns and stock adjustments before go-live.",
    shortDescription: 'Orders to the 3PL warehouse, stock and tracking back. Set up for Shopify Plus with several markets.',
    whatItIs: 'Ongoing WMS is the warehouse system many Nordic 3PLs use. The store does not get access to the warehouse itself, but to the app that connects it to Shopify.',
    whyItMatters: 'When the warehouse is outsourced, orders have to go out and stock come in without anyone touching them. Wrong shipping methods are the most common cause of stops.',
    steps: stdSteps('Ongoing'), faq: stdFaq('Ongoing', 'inventory'), cta: stdCta('Ongoing WMS'),
    prerequisites: ['3PL running Ongoing', 'Shopify Plus or Shopify', 'Shipping methods agreed with the warehouse'], notIncluded: [],
    dataFlow: ['orders', 'stock + tracking'],
  },
  'podio': {
    pageTitle: 'Podio bookings to Shopify',
    definition: 'The Podio integration turns bookings in Podio into orders in Shopify, sends cancellations back to Podio, and triggers an invoice in Tripletex when the rental has been delivered, not when it was booked. It runs as Make.com flows with a payment link, shipping labels via Profrakt and lookups by email.',
    shortDescription: 'Bookings become Shopify orders, cancellations go back, and invoicing is triggered when the rental is delivered.',
    whatItIs: "Podio is a flexible work tool used as a booking system. Shopify is the payment and the entry point to the accounts. The flow keeps them in step.",
    whyItMatters: "Rentals do not follow the checkout's rhythm. Payment, delivery and invoicing happen on different days, and each step has to hit the right system.",
    steps: stdSteps('Podio'), faq: stdFaq('Podio', 'bookings'), cta: stdCta('Podio'),
    prerequisites: ['Podio workspace', 'Shopify', 'Make.com account', 'Tripletex for invoicing'], notIncluded: [],
    dataFlow: ['booking → draft order + payment link', 'cancellation', 'invoice 72 h after delivery'],
  },
  'poweroffice-go': {
    pageTitle: 'PowerOffice Go integration for Shopify',
    definition: 'The PowerOffice Go integration posts Shopify sales as a journal voucher in PowerOffice Go, split by revenue account per country and clearing account per payment method, instead of an invoice per customer. Refunds are posted as reversals. It suits B2C stores whose accountant wants clean, consolidated vouchers, and runs as a Make.com scenario in your account, weekly or monthly.',
    shortDescription: 'Shopify sales as a journal voucher, split by revenue account and payment method. Refunds are posted back.',
    whatItIs: 'PowerOffice Go is a Norwegian cloud accounting system. Our integration uses the journal voucher import endpoint: each order becomes debit and credit lines for goods and shipping, and the whole period is uploaded as one voucher with a unique reference, so it is never posted twice.',
    whyItMatters: 'For B2C with many small orders, an invoice per customer is noise. The journal voucher gives the accountant fewer lines to reconcile, and the payouts from Vipps, Klarna and card each hit their own clearing account.',
    steps: stdSteps('PowerOffice Go'), faq: stdFaq('PowerOffice Go', 'the journal voucher'), cta: stdCta('PowerOffice Go'),
    prerequisites: ['PowerOffice Go with API key and subscription key', 'Chart of accounts and VAT codes agreed with your accountant', 'Shopify or Shopify Plus', 'Make.com account in your name'],
    notIncluded: ['Customer records. The journal voucher is anonymous by design', 'Inventory. Shopify is the source of truth'],
    dataFlow: ['sales → journal voucher', 'refund → reversal'],
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

function buildEn(no: Doc, key: string): Doc {
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

  const { _id, _rev, _createdAt, _updatedAt, ...rest } = no
  return {
    ...rest,
    _id: `integration-${key}-en`,
    language: 'en',
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
    category: weak(`integration-cat-${catKey}-en`),
    pillar: weak('pillar-integrasjoner-en'),
    clusterLinks: (no.clusterLinks ?? []).map((r: Doc) => weak(toEn(r._ref), r._key)),
    relatedPages: (no.relatedPages ?? []).map((r: Doc) => weak(toEn(r._ref), r._key)),
    relatedCaseStudies: no.relatedCaseStudies ?? [],
  }
}

async function main() {
  const ids = KEYS.map((k) => `integration-${k}-no`)
  const docs = await client.fetch<Doc[]>('*[_id in $ids]', { ids })
  const byId = new Map(docs.map((d) => [d._id, d]))
  const missing = ids.filter((id) => !byId.has(id))
  if (missing.length) throw new Error(`missing Norwegian documents: ${missing.join(', ')}`)

  for (const key of KEYS) {
    const no = byId.get(`integration-${key}-no`)!
    const en = buildEn(no, key)
    await client.createOrReplace(en as { _id: string; _type: string } & Doc)
    console.log(dataset, 'wrote', en._id, `(${en.definition.split(/\s+/).length} words in definition)`)
    const metaId = `integration-${key}-meta`
    await client.createOrReplace({ _id: metaId, _type: 'translation.metadata', schemaTypes: ['integrationPage'], translations: [
      { _key: 'no', value: { _type: 'reference', _ref: no._id, _weak: true, _strengthenOnPublish: { type: 'integrationPage' } } },
      { _key: 'en', value: { _type: 'reference', _ref: en._id, _weak: true, _strengthenOnPublish: { type: 'integrationPage' } } },
    ] })
    console.log(dataset, 'wrote', metaId)
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
