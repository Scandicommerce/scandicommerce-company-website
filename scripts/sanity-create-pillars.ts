// TARGET_DATASET=production npx sanity exec scripts/sanity-create-pillars.ts --with-user-token
// Creates the "Agentisk handel" and "Bli partner" pillar pages (no + en) with
// translation metadata. Idempotent: createOrReplace on fixed ids.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

let n = 0
const k = () => `p${(n++).toString(36)}${Date.now().toString(36).slice(-3)}`
const block = (text: string) => ({ _type: 'block', _key: k(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: k(), marks: [], text }] })
const section = (heading: string, anchor: string, paragraphs: string[]) => ({ _type: 'templateSection', _key: k(), heading, anchor, body: paragraphs.map(block) })
const faq = (question: string, answer: string) => ({ _type: 'faqItem', _key: k(), question, answer })
const ref = (id: string) => ({ _type: 'reference', _key: k(), _ref: id })

const PAGES: Doc[] = [
  {
    id: 'pillar-agentisk-handel-no', language: 'no', slug: 'agentisk-handel', pageTitle: 'Agentisk handel: gjør Shopify-butikken klar for AI-agenter',
    definition: 'Agentisk handel er kjøp som skjer via AI-agenter: ChatGPT, Perplexity, Google og Shopifys egne agentflater finner, sammenligner og bestiller produkter på vegne av kunden. Butikken må være lesbar for agenter, produktdataene må være komplette og strukturerte, og kassen må kunne fullføres uten et menneske på skjermen. Vi gjør Shopify-butikken din klar for det.',
    sections: [
      section('Hva som skjer nå', 'na', ['AI-assistenter har gått fra å svare på spørsmål til å handle. ChatGPT, Perplexity og Google viser produkter, sammenligner pris og tilgjengelighet og sender kunden rett til kassen, eller fullfører kjøpet selv. Shopify kobler katalogen din til disse agentene gjennom Shopify Catalog og den åpne protokollen for agentisk handel.', 'Det betyr at en økende andel av trafikken aldri ser forsiden din. Agenten leser produktdataene, policyene og lagerstatusen, og velger på vegne av kunden. Butikker med ryddige data blir anbefalt. Butikker med hull blir hoppet over.']),
      section('Slik blir butikken funnet av agenter', 'funnet', ['Agenter leser strukturerte data, ikke bannere. Komplette produktattributter, tydelige varianter, riktige kategorier, GTIN, mål og vekt, lagerstatus og leveringstid er det som avgjør om produktet dukker opp. Shopify sender dette videre gjennom Shopify Catalog, forutsatt at dataene finnes og er riktige.', 'Policyer teller like mye. Frakt, retur og garanti må være skrevet så en maskin forstår dem. Et "ta kontakt for frakt" er et nei fra agenten.']),
      section('Produktdata er det nye SEO', 'produktdata', ['Der SEO handlet om tekst og lenker, handler agentisk synlighet om data. Vi går gjennom katalogen, finner hullene og setter opp en datamodell som holder: hva som skal ligge i Shopify, hva som skal styres fra PIM, og hvordan nye produkter får riktige attributter fra dag én.', 'For butikker med mange varianter eller flere kanaler setter vi opp PIM, for eksempel Feed eller Vuuh, slik at Shopify, Google og agentene får samme sannhet.']),
      section('Kasse uten et menneske på skjermen', 'kasse', ['Agentisk kasse betyr at kjøpet kan fullføres av agenten med kundens godkjenning. Shopify Checkout og Shop Pay støtter dette, og betaling via Vipps, Klarna eller kort fungerer som før. Vi sørger for at rabattregler, fraktregler og leveringsvalg er entydige, slik at kjøpet ikke stopper på et valg agenten ikke kan ta.']),
      section('Hva vi leverer', 'leveranse', ['En agentisk-klar-sjekk av butikken: produktdata, policyer, Shopify Catalog-status og kasse, med en prioritert liste over det som må rettes. Deretter gjennomføringen: datamodell, PIM-oppsett der det trengs, strukturerte policyer og måling av agentdrevne ordre.', 'Løpende optimalisering til agentisk AI inngår i Enterprise-pakken. For andre leveres det som eget prosjekt til fast pris.']),
      section('Slik måler vi det', 'maling', ['Agentdrevne ordre merkes i Shopify med kilde og agent, slik at du ser hva ChatGPT, Perplexity og Google faktisk sender. Vi bruker Tracklution og Shopifys egne rapporter, og setter opp en enkel rapport du kan følge månedlig.']),
    ],
    faq: [
      faq('Må vi ha Shopify Plus?', 'Nei. Shopify Catalog og agentisk kasse er tilgjengelig for vanlige Shopify-butikker. Plus gir mer kontroll over kassen og flere markeder, men er ikke et krav for å bli funnet av agenter.'),
      faq('Kan agentene kjøpe uten at kunden godkjenner?', 'Nei. Kunden godkjenner kjøpet i agenten før ordren legges. Du ser ordren i Shopify som vanlig, merket med hvor den kom fra.'),
      faq('Hva med B2B?', 'Agentisk handel starter i B2C, men B2B-innkjøpere bruker de samme assistentene. En ryddig katalog med riktige priser per kunde gjør at Shopify B2B også kan leses av agenter.'),
      faq('Hva koster det?', 'Sjekken og gjennomføringen prises som eget prosjekt etter omfang. Løpende optimalisering inngår i Enterprise-pakken.'),
    ],
    cta: { heading: 'Vil du vite om butikken din er klar for agenter?', text: 'Vi går gjennom katalog, policyer og kasse og sender deg en prioritert liste innen to virkedager.', buttonLabel: 'Book en samtale', buttonHref: '/kontakt' },
    related: ['1368ee2e-b89e-44e4-ac40-36fd19f2c879', '46bf58c8-302e-4fb2-bebe-5c6f505a97b3'],
    seo: { metaTitle: 'Agentisk handel: gjør Shopify klar for AI-agenter | Scandicommerce', metaDescription: 'AI-agenter finner, sammenligner og kjøper på vegne av kundene. Vi gjør produktdata, policyer og kasse i Shopify-butikken klare for ChatGPT, Perplexity og Google.' },
  },
  {
    id: 'pillar-agentisk-handel-en', language: 'en', slug: 'agentic-commerce', pageTitle: 'Agentic commerce: get your Shopify store ready for AI agents',
    definition: 'Agentic commerce is buying done through AI agents: ChatGPT, Perplexity, Google and Shopify\'s own agent surfaces find, compare and order products on the customer\'s behalf. The store has to be readable by agents, product data has to be complete and structured, and checkout has to complete without a person on the screen. We get your Shopify store ready for it.',
    sections: [
      section('What is happening now', 'now', ['AI assistants have moved from answering questions to shopping. ChatGPT, Perplexity and Google show products, compare price and availability and send the customer straight to checkout, or complete the purchase themselves. Shopify connects your catalog to these agents through Shopify Catalog and the open protocol for agentic commerce.', 'A growing share of traffic never sees your homepage. The agent reads product data, policies and stock, and chooses on the customer\'s behalf. Stores with clean data get recommended. Stores with gaps get skipped.']),
      section('How agents find your store', 'found', ['Agents read structured data, not banners. Complete attributes, clear variants, correct categories, GTIN, dimensions and weight, stock and delivery time decide whether a product shows up. Shopify passes this on through Shopify Catalog, provided the data exists and is right.', 'Policies count as much. Shipping, returns and warranty have to be written so a machine understands them. "Contact us for shipping" is a no from the agent.']),
      section('Product data is the new SEO', 'product-data', ['Where SEO was about text and links, agentic visibility is about data. We go through the catalog, find the gaps and set up a data model that holds: what lives in Shopify, what is managed from a PIM, and how new products get the right attributes from day one.', 'For stores with many variants or several channels we set up a PIM, such as Feed or Vuuh, so Shopify, Google and the agents share one truth.']),
      section('Checkout without a person on the screen', 'checkout', ['Agentic checkout means the agent can complete the purchase with the customer\'s approval. Shopify Checkout and Shop Pay support it, and payment through Vipps, Klarna or card works as before. We make sure discount rules, shipping rules and delivery options are unambiguous, so the purchase does not stall on a choice the agent cannot make.']),
      section('What we deliver', 'delivery', ['An agent-readiness check of the store: product data, policies, Shopify Catalog status and checkout, with a prioritised list of what to fix. Then the implementation: data model, PIM setup where needed, structured policies and measurement of agent-driven orders.', 'Ongoing optimisation for agentic AI is part of the Enterprise package. For everyone else it is delivered as a fixed-price project.']),
      section('How we measure it', 'measure', ['Agent-driven orders are tagged in Shopify with source and agent, so you see what ChatGPT, Perplexity and Google actually send. We use Tracklution and Shopify\'s own reports, and set up a simple monthly report you can follow.']),
    ],
    faq: [
      faq('Do we need Shopify Plus?', 'No. Shopify Catalog and agentic checkout are available on standard Shopify plans. Plus gives more control over checkout and more markets, but is not required to be found by agents.'),
      faq('Can agents buy without the customer approving?', 'No. The customer approves the purchase in the agent before the order is placed. You see the order in Shopify as usual, tagged with where it came from.'),
      faq('What about B2B?', 'Agentic commerce starts in B2C, but B2B buyers use the same assistants. A clean catalog with correct per-customer prices lets Shopify B2B be read by agents too.'),
      faq('What does it cost?', 'The check and the implementation are priced as a project by scope. Ongoing optimisation is included in the Enterprise package.'),
    ],
    cta: { heading: 'Want to know if your store is ready for agents?', text: 'We review catalog, policies and checkout and send you a prioritised list within two working days.', buttonLabel: 'Book a call', buttonHref: '/contact' },
    related: ['e9ee91de-b1b2-47a6-9ded-7672b1f6911c', 'c749a129-ccca-44ab-a01b-0247652026fe'],
    seo: { metaTitle: 'Agentic commerce: get Shopify ready for AI agents | Scandicommerce', metaDescription: 'AI agents find, compare and buy on behalf of customers. We get product data, policies and checkout in your Shopify store ready for ChatGPT, Perplexity and Google.' },
  },
  {
    id: 'pillar-bli-partner-no', language: 'no', slug: 'partnere/bli-partner', pageTitle: 'Bli partner med Scandicommerce',
    definition: 'Scandicommerce samarbeider med teknologileverandører, byråer og frilansere som vil levere bedre Shopify-løsninger til norske og nordiske butikker. Som partner får du en fast kontaktperson, felles prosjekter, plass på partnersiden vår og en avtale som sier hvem som eier hva. Vi velger få partnere og jobber tett med dem, i stedet for å samle logoer.',
    sections: [
      section('Hvem vi ser etter', 'hvem', ['Teknologipartnere: apper og systemer med et API som løser noe konkret for norske butikker, for eksempel betaling, logistikk, lojalitet, kundeservice eller produktdata. Vi bygger integrasjonen og du får kunder som er satt opp riktig.', 'Byråer: design-, innholds- og markedsføringsbyråer som trenger et Shopify-team uten å bygge det selv. Vi tar plattform, integrasjoner og drift, dere beholder kunden.', 'Frilansere og utviklere: Shopify-utviklere som vil jobbe på faste prosjekter med tydelig omfang og fast pris.']),
      section('Slik fungerer samarbeidet', 'slik', ['Henvisninger går begge veier og registreres, så begge vet hvor kunden kom fra. Felles leveranser prises som ett prosjekt med én tidsplan, og avtalen sier hvem som eier data, kode og kundeforhold. Partnere som vil, får en plass på partnersiden vår med beskrivelse av hva vi leverer sammen.']),
      section('Det vi forventer', 'forventer', ['Åpne priser og tydelige leveranser, slik at fastpris er mulig. Svar innen én virkedag på saker som gjelder felles kunder. Dokumentasjon på det du leverer. Og norsk eller nordisk kundeservice der kundene trenger det.']),
      section('Det du får', 'far', ['Én fast kontaktperson hos oss. Tidlig tilgang til nye leveranser, som Nexus POS og appene våre. Felles kundecaser og innhold. Og en partner som sier nei til prosjekter som ikke passer, også når det er våre egne.']),
      section('Slik søker du', 'sok', ['Send en e-post til post@scandicommerce.no med hva dere leverer, hvilke kunder dere jobber med og hva dere ser for dere at vi gjør sammen. Vi svarer innen to virkedager, og tar en samtale med dem det passer for.']),
    ],
    faq: [
      faq('Koster det noe å være partner?', 'Nei. Vi tar ikke betalt for partnerskap, og vi betaler ikke for logoplassering. Verdien ligger i felles kunder og leveranser.'),
      faq('Må vi være eksklusive?', 'Nei. Vi forventer ærlighet om hvem dere ellers jobber med, ikke eksklusivitet.'),
      faq('Får vi henvisningsprovisjon?', 'Det avtaler vi per partner og skriver ned. Som regel er det gjensidige henvisninger uten provisjon, og provisjon der én part gjør mesteparten av salget.'),
      faq('Hvor fort får vi svar?', 'Innen to virkedager på henvendelsen, og en avklaringssamtale innen to uker for dem vi går videre med.'),
    ],
    cta: { heading: 'Vil du jobbe med oss?', text: 'Fortell oss hva dere leverer og hvem dere jobber med, så tar vi en samtale.', buttonLabel: 'Ta kontakt', buttonHref: '/kontakt' },
    related: ['46bf58c8-302e-4fb2-bebe-5c6f505a97b3', '1368ee2e-b89e-44e4-ac40-36fd19f2c879'],
    seo: { metaTitle: 'Bli partner med Scandicommerce', metaDescription: 'Teknologileverandører, byråer og frilansere som vil levere bedre Shopify-løsninger til nordiske butikker. Slik fungerer partnerskap med Scandicommerce.' },
  },
  {
    id: 'pillar-bli-partner-en', language: 'en', slug: 'partners/become-a-partner', pageTitle: 'Become a Scandicommerce partner',
    definition: 'Scandicommerce works with technology vendors, agencies and freelancers who want to deliver better Shopify solutions to Norwegian and Nordic stores. As a partner you get a named contact, joint projects, a place on our partners page and an agreement that says who owns what. We choose few partners and work closely with them, instead of collecting logos.',
    sections: [
      section('Who we look for', 'who', ['Technology partners: apps and systems with an API that solve something concrete for Nordic stores, such as payments, logistics, loyalty, customer service or product data. We build the integration and you get customers that are set up right.', 'Agencies: design, content and marketing agencies that need a Shopify team without building one. We take platform, integrations and operations, you keep the client.', 'Freelancers and developers: Shopify developers who want fixed-scope, fixed-price projects.']),
      section('How the partnership works', 'how', ['Referrals go both ways and are logged, so both sides know where a customer came from. Joint deliveries are priced as one project with one timeline, and the agreement says who owns data, code and the customer relationship. Partners who want it get a place on our partners page describing what we deliver together.']),
      section('What we expect', 'expect', ['Open pricing and clear deliverables, so fixed prices are possible. A reply within one working day on matters concerning shared customers. Documentation for what you deliver. And Norwegian or Nordic customer support where customers need it.']),
      section('What you get', 'get', ['One named contact at Scandicommerce. Early access to new offerings, such as Nexus POS and our apps. Joint case studies and content. And a partner that says no to projects that do not fit, including our own.']),
      section('How to apply', 'apply', ['Email post@scandicommerce.no with what you deliver, which customers you work with and what you imagine us doing together. We reply within two working days and set up a call where it fits.']),
    ],
    faq: [
      faq('Does it cost anything to be a partner?', 'No. We do not charge for partnerships, and we do not pay for logo placement. The value is in shared customers and deliveries.'),
      faq('Do we have to be exclusive?', 'No. We expect honesty about who else you work with, not exclusivity.'),
      faq('Do we get a referral commission?', 'That is agreed per partner and written down. Usually it is mutual referrals without commission, and commission where one side does most of the selling.'),
      faq('How fast do we hear back?', 'Within two working days on the enquiry, and a call within two weeks for those we take forward.'),
    ],
    cta: { heading: 'Want to work with us?', text: 'Tell us what you deliver and who you work with, and we will set up a call.', buttonLabel: 'Get in touch', buttonHref: '/contact' },
    related: ['c749a129-ccca-44ab-a01b-0247652026fe', 'e9ee91de-b1b2-47a6-9ded-7672b1f6911c'],
    seo: { metaTitle: 'Become a Scandicommerce partner', metaDescription: 'Technology vendors, agencies and freelancers who want to deliver better Shopify solutions to Nordic stores. How partnering with Scandicommerce works.' },
  },
]

async function main() {
  const author = await client.fetch<string | null>('coalesce(*[_type == "author" && _id == "author-chris-jensen"][0]._id, *[_type == "author"][0]._id)')
  if (!author) throw new Error('no author document')
  for (const p of PAGES) {
    const existing = await client.fetch<string[]>('*[_id in $ids]._id', { ids: p.related })
    await client.createOrReplace({
      _id: p.id, _type: 'pillarPage', language: p.language, pageTitle: p.pageTitle, slug: { _type: 'slug', current: p.slug }, schemaType: 'Service',
      definition: p.definition, intro: [], author: { _type: 'reference', _ref: author }, sections: p.sections, faq: p.faq, cta: p.cta,
      relatedPages: p.related.filter((id: string) => existing.includes(id)).map(ref), seoExtended: p.seo,
    })
    console.log(dataset, 'wrote', p.id, `(${p.definition.split(/\s+/).length} words in definition)`)
  }
  for (const [metaId, no, en] of [['pillar-agentisk-handel-meta', 'pillar-agentisk-handel-no', 'pillar-agentisk-handel-en'], ['pillar-bli-partner-meta', 'pillar-bli-partner-no', 'pillar-bli-partner-en']]) {
    await client.createOrReplace({ _id: metaId, _type: 'translation.metadata', schemaTypes: ['pillarPage'], translations: [
      { _key: 'no', value: { _type: 'reference', _ref: no, _weak: true, _strengthenOnPublish: { type: 'pillarPage' } } },
      { _key: 'en', value: { _type: 'reference', _ref: en, _weak: true, _strengthenOnPublish: { type: 'pillarPage' } } },
    ] })
    console.log(dataset, 'wrote', metaId)
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
