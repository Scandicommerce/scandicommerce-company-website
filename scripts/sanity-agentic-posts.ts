// TARGET_DATASET=production npx sanity exec scripts/sanity-agentic-posts.ts --with-user-token
// Creates two educational posts in the agentic commerce cluster ("Hva er agentisk handel?" and
// "UCP og Google Universal Cart forklart") in no, en, sv, da, de, linked with translation.metadata.
// Each post points to the pillar (/agentisk-handel on .no, /agentic-commerce on .com).
// Idempotent: createOrReplace on fixed ids, deterministic _keys. Does not touch the pillar docs.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })

type SanityDoc = { _id: string; _type: string } & Record<string, unknown>
type Lang = 'no' | 'en' | 'sv' | 'da' | 'de'
const LANGS: Lang[] = ['no', 'en', 'sv', 'da', 'de']

const AUTHOR_ID = 'a4ed64a7-0072-4840-987f-eb2a7560c5f2' // Øyvind Haagensen

// Source URLs (verified 2026-10-17)
const SRC = {
  googleCart: 'https://blog.google/products-and-platforms/products/shopping/google-shopping-cart/',
  dc360: 'https://www.digitalcommerce360.com/2026/10/16/google-universal-cart-launch-features/amp/',
  ucpDev: 'https://developers.googleblog.com/en/under-the-hood-universal-commerce-protocol-ucp/',
  shopifyNews: 'https://www.shopify.com/news/winter-26-edition-agentic-storefronts',
  shopifyDev: 'https://shopify.dev/docs/agents',
}

const SLUGS = {
  what: { no: 'hva-er-agentisk-handel', other: 'what-is-agentic-commerce' },
  ucp: { no: 'ucp-og-google-universal-cart-forklart', other: 'ucp-and-google-universal-cart-explained' },
}
const slugFor = (post: 'what' | 'ucp', lang: Lang) => (lang === 'no' ? SLUGS[post].no : SLUGS[post].other)
const prefix = (lang: Lang) => (lang === 'no' || lang === 'en' ? '' : `/${lang}`)
const pillarHref = (lang: Lang) => (lang === 'no' ? '/agentisk-handel' : `${prefix(lang)}/agentic-commerce`)
const postHref = (post: 'what' | 'ucp', lang: Lang) =>
  lang === 'no' ? `/blogg/${slugFor(post, lang)}` : `${prefix(lang)}/blog/${slugFor(post, lang)}`

// ---------------------------------------------------------------------------
// Tiny markup → Portable Text. Lines: "## h2", "### h3", "- bullet", "1. numbered",
// "> quote", else paragraph. Inline: [text](url), **bold**, `code`.
// ---------------------------------------------------------------------------
function makeBuilder(docId: string) {
  let n = 0
  const k = () => `${docId.replace(/[^a-z0-9]/gi, '').slice(-10)}${(n++).toString(36)}`

  function inline(text: string) {
    const children: Record<string, unknown>[] = []
    const markDefs: Record<string, unknown>[] = []
    const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g
    let last = 0
    let m: RegExpExecArray | null
    const push = (t: string, marks: string[] = []) => {
      if (t) children.push({ _type: 'span', _key: k(), text: t, marks })
    }
    while ((m = re.exec(text))) {
      push(text.slice(last, m.index))
      if (m[1]) {
        const key = k()
        const href = m[2]
        markDefs.push({ _type: 'link', _key: key, href, blank: !href.startsWith('/') })
        push(m[1], [key])
      } else if (m[3]) push(m[3], ['strong'])
      else if (m[4]) push(m[4], ['code'])
      last = re.lastIndex
    }
    push(text.slice(last))
    return { children, markDefs }
  }

  function blocks(md: string) {
    return md
      .trim()
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        let style = 'normal'
        let listItem: string | undefined
        let text = line
        if (line.startsWith('## ')) [style, text] = ['h2', line.slice(3)]
        else if (line.startsWith('### ')) [style, text] = ['h3', line.slice(4)]
        else if (line.startsWith('> ')) [style, text] = ['blockquote', line.slice(2)]
        else if (line.startsWith('- ')) [listItem, text] = ['bullet', line.slice(2)]
        else if (/^\d+\. /.test(line)) [listItem, text] = ['number', line.replace(/^\d+\. /, '')]
        const { children, markDefs } = inline(text)
        return { _type: 'block', _key: k(), style, markDefs, children, ...(listItem ? { listItem, level: 1 } : {}) }
      })
  }

  return {
    md: (s: string) => ({ _type: 'richTextBlock', _key: k(), body: blocks(s) }),
    tldr: (title: string, content: string) => ({ _type: 'calloutBlock', _key: k(), variant: 'tldr', title, content }),
    stats: (items: [string, string][]) => ({
      _type: 'statsRowBlock',
      _key: k(),
      stats: items.map(([value, label]) => ({ _key: k(), value, label })),
    }),
    faq: (title: string, items: [string, string][]) => ({
      _type: 'faqBlock',
      _key: k(),
      title,
      items: items.map(([question, answer]) => ({ _type: 'faqItem', _key: k(), question, answer })),
    }),
    cta: (heading: string, body: string, label: string, url: string) => ({
      _type: 'ctaBlock',
      _key: k(),
      heading,
      body: blocks(body),
      buttons: [{ _key: k(), label, url, variant: 'primary' }],
    }),
    tag: (label: string, isPrimary = false) => ({ _key: k(), label, isPrimary }),
  }
}
type B = ReturnType<typeof makeBuilder>

interface PostSpec {
  title: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  tags: [string, ...string[]]
  content: (b: B, lang: Lang) => Record<string, unknown>[]
}

// ===========================================================================
// POST 1: Hva er agentisk handel?
// ===========================================================================
const WHAT: Record<Lang, PostSpec> = {
  no: {
    title: 'Hva er agentisk handel?',
    excerpt:
      'AI-assistenter som ChatGPT, Gemini, Copilot og Perplexity finner, sammenligner og kjøper i økende grad på vegne av kunden. Her er hva agentisk handel betyr, hva agentene faktisk leser, og hva en norsk nettbutikk bør gjøre først.',
    metaTitle: 'Hva er agentisk handel? Enkel forklaring for nettbutikker',
    metaDescription:
      'Agentisk handel: AI-assistenter finner, sammenligner og kjøper for kunden. Se hva agentene leser, hvor det er live og hva Shopify-butikken bør gjøre først.',
    tags: ['Agentisk handel', 'AI', 'Produktdata', 'Shopify'],
    content: (b, l) => [
      b.tldr(
        'Kort fortalt',
        'Agentisk handel betyr at en AI-assistent gjør deler av handlejobben for kunden: finner produktet, sammenligner og i økende grad fullfører kjøpet. Agentene leser produktdata, policyer, lager og pris, ikke bannere. Start med titler som sier hva produktet er, komplette attributter med GTIN, maskinlesbare frakt- og returvilkår og en sjekk av Shopify Catalog.',
      ),
      b.md(`
## Hva er agentisk handel?
Agentisk handel er netthandel der en AI-assistent gjør jobben kunden tidligere gjorde selv. Kunden skriver hva hun trenger, for eksempel «en varm ullgenser som tåler maskinvask og kommer før helgen». Assistenten søker, sammenligner produkter fra flere butikker, sjekker lager og levering, og foreslår et kjøp.
Stadig oftere kan assistenten også legge varen i handlekurven og ta kunden helt fram til betaling. Ordet «agentisk» kommer fra engelske «agentic»: assistenten handler på vegne av noen, innenfor rammene kunden har satt. Kunden godkjenner fortsatt selve kjøpet.
## Hva endrer seg for nettbutikken?
Før gikk kunden via Google, klikket seg inn på nettsiden, så på bilder, leste og kjøpte. Butikken kunne påvirke underveis med design, bannere og kampanjer.
Nå skjer en del av den reisen før kunden ser nettsiden din. Agenten har allerede valgt ut de tre produktene som er verdt å vise. Svarer ikke dataene dine på spørsmålet kunden stilte, er du ikke med i utvalget, uansett hvor fin forsiden er.
> «Agentene leser ikke nettsiden din slik kunden gjør. De leser dataene.» Øyvind Haagensen, kommersiell leder i Scandicommerce, på Handelskonferansen 2026.
## Hvor skjer agentisk handel i dag?
Det er fire flater det er verdt å kjenne til:
- **ChatGPT.** Den klart største kilden til AI-trafikk i butikkene vi drifter.
- **Google AI Mode og Gemini-appen.** Google har lansert [Universal Cart](${SRC.googleCart}), en handlekurv på tvers av butikker i Google Søk og Gemini-appen. Foreløpig bare i USA.
- **Microsoft Copilot.** Nevnt av Shopify som en av AI-kanalene butikker kan skru på.
- **Perplexity.** Også nevnt av Shopify som AI-kanal.
For Shopify-butikker går koblingen via [Shopify Catalog](${SRC.shopifyDev}), som sender kvalifiserte produkter videre til AI-plattformer uten at du trenger en egen integrasjon per plattform. Med [Agentic Storefronts](${SRC.shopifyNews}), som kom i Shopifys Winter '26 Edition i desember 2025, kan du skru AI-kanalene av og på i admin. Kassen er fortsatt Shopify Checkout, og du er fortsatt selger (merchant of record). Ordre fra AI-kanaler vises med kanalattribusjon i Shopify-admin.
## Hvor mye trafikk kommer fra AI-assistenter?
Foreløpig lite, men den konverterer. Vi har sett på fem Shopify-butikker vi drifter, de siste 90 dagene fram til 17. oktober 2026 (anonymisert, tall fra Salespulse):
`),
      b.stats([
        ['ca. 3 400', 'besøk merket fra ChatGPT'],
        ['ca. 2,2 %', 'konvertering på ChatGPT-trafikken'],
        ['3 av 5', 'butikker der ChatGPT konverterte bedre enn snittet'],
        ['under 0,2 %', 'av alle økter'],
      ]),
      b.md(`
Perplexity, Gemini og Copilot sendte til sammen færre enn 30 besøk i samme periode. Volumet er altså lite, men kundene som kommer fra ChatGPT, har ofte bestemt seg. Det er nå grunnlaget legges, mens konkurrentene fortsatt venter.
## Hva leser AI-agenter i en nettbutikk?
Agenter leser strukturert informasjon. Det betyr i praksis:
- Produkttittel og beskrivelse som sier hva produktet er
- Attributter som materiale, størrelse, farge, mål, vekt og GTIN (EAN)
- Pris og lagerstatus per variant
- Frakt-, retur- og garantivilkår
- Svar på vanlige spørsmål om produktet og butikken
Det agenten ikke leser, er kampanjebanneret på forsiden, stemningsbildet eller en setning som «ta kontakt for fraktpris». Øyvind Haagensen bruker et eksempel fra en ekte katalog: et produkt som bare heter «Historica». For et menneske som kjenner merket, kan det gi mening. For en agent sier det nesten ingenting. Er det et pledd, en bok eller en lampe?
## Hva bør en norsk nettbutikk gjøre først?
Du trenger ikke vente på nye lanseringer. Dette er arbeid som virker uansett hvilken agent kunden bruker:
1. **Skriv titler som sier hva produktet er.** Produkttype, materiale og viktigste egenskap hører hjemme i tittelen, ikke bare kolleksjonsnavnet.
2. **Fyll ut attributter og GTIN.** I Shopify legges produktdata i standard produktattributter og metafelt. Hull i disse feltene er hull i det agenten kan svare på.
3. **Gjør frakt- og returvilkår maskinlesbare.** Skriv dem tydelig og entydig. Shopify lar deg legge inn policyer og FAQ for agenter via Knowledge Base-appen.
4. **Sjekk Shopify Catalog og Agentic Storefronts.** Se hvilke produkter som er med, og hvilke AI-kanaler som er skrudd på.
5. **Mål det.** Følg med på ordre med AI-kanalattribusjon i admin, slik at du ser hva som faktisk kommer inn.
## Hva er live hvor?
- **Shopify Catalog og Agentic Storefronts:** Shopify har ikke publisert en landsliste. Sjekk hva som er tilgjengelig i din egen admin.
- **Google Universal Cart:** lansert i USA 15. oktober 2026 i Google Søk og Gemini-appen, med YouTube og Gmail som neste steg ([Digital Commerce 360](${SRC.dc360})).
- **UCP-drevet kasse hos Google:** utvides til Canada og Australia de kommende månedene, senere Storbritannia, ifølge [Google](${SRC.googleCart}).
- **Norge og Norden:** ingenting er annonsert per 17. oktober 2026.
Vil du forstå protokollen som ligger under, har vi skrevet en egen gjennomgang: [UCP og Google Universal Cart forklart](${postHref('ucp', l)}).
`),
      b.faq('Ofte stilte spørsmål', [
        [
          'Er agentisk handel det samme som AI-søk?',
          'Nei. AI-søk svarer på spørsmål og viser produkter. Agentisk handel går et steg videre: assistenten sammenligner, legger i handlekurv og kan ta kunden helt til betaling. Begge deler bygger på de samme produktdataene.',
        ],
        [
          'Kan en AI-agent kjøpe uten at kunden godkjenner?',
          'Nei. I Universal Commerce Protocol, som Google og Shopify står bak, er hver betalingsautorisasjon knyttet til et kryptografisk bevis på at kunden har samtykket.',
        ],
        [
          'Er Google Universal Cart tilgjengelig i Norge?',
          'Nei. Universal Cart ble lansert i USA 15. oktober 2026. Google har varslet utvidelse av UCP-drevet kasse til Canada, Australia og senere Storbritannia. Ingenting er annonsert for Norge eller Norden.',
        ],
        [
          'Hva bør jeg gjøre først?',
          'Gå gjennom produkttitlene, fyll ut attributter og GTIN, gjør frakt- og returvilkår tydelige og sjekk hvilke produkter som er med i Shopify Catalog. Det virker uansett hvilken agent kunden bruker.',
        ],
      ]),
      b.md(`
## Slik hjelper vi butikker med dette
Vi går gjennom produktdata, policyer og kasse i Shopify-butikken og lager en prioritert liste over hva som må rettes for at agentene skal forstå og anbefale produktene dine. Les mer om [hvordan vi jobber med agentisk handel](${pillarHref(l)}).
`),
      b.cta(
        'Er butikken din klar for AI-agenter?',
        'Se hva vi sjekker, og hvordan vi gjør katalogen lesbar for ChatGPT, Google, Copilot og Perplexity.',
        'Slik hjelper vi butikker med dette',
        pillarHref(l),
      ),
    ],
  },

  en: {
    title: 'What is agentic commerce?',
    excerpt:
      'AI assistants like ChatGPT, Gemini, Copilot and Perplexity increasingly find, compare and buy on the shopper’s behalf. Here is what agentic commerce means, what agents actually read, and what a Nordic online store should do first.',
    metaTitle: 'What is agentic commerce? A plain guide for online stores',
    metaDescription:
      'Agentic commerce: AI assistants find, compare and buy for the shopper. See what agents read, where it is live and what your Shopify store should do first.',
    tags: ['Agentic commerce', 'AI', 'Product data', 'Shopify'],
    content: (b, l) => [
      b.tldr(
        'In short',
        'Agentic commerce means an AI assistant does part of the shopping for the customer: finds the product, compares options and increasingly completes the purchase. Agents read product data, policies, stock and price, not banners. Start with titles that say what the product is, complete attributes with GTINs, machine-readable shipping and returns policies, and a check of Shopify Catalog.',
      ),
      b.md(`
## What is agentic commerce?
Agentic commerce is online shopping where an AI assistant does the work the customer used to do. The shopper describes what they need, say “a warm wool sweater that survives the washing machine and arrives before the weekend”. The assistant searches, compares products from several stores, checks stock and delivery, and suggests a purchase.
More and more often the assistant can also add the item to a cart and take the shopper all the way to payment. “Agentic” means the assistant acts on someone’s behalf, within the limits the customer has set. The customer still approves the purchase itself.
## What changes for an online store?
The old journey: the shopper searched on Google, clicked through to your site, looked at images, read and bought. You could influence every step with design, banners and campaigns.
Now part of that journey happens before the shopper ever sees your site. The agent has already picked the three products worth showing. If your data does not answer the question the shopper asked, you are not in that shortlist, however good your homepage looks.
> “Agents don’t read your website the way a customer does. They read the data.” Øyvind Haagensen, commercial lead at Scandicommerce, on stage at Handelskonferansen 2026.
## Where does agentic commerce happen today?
There are four surfaces worth knowing:
- **ChatGPT.** By far the largest source of AI traffic in the stores we run.
- **Google AI Mode and the Gemini app.** Google has launched [Universal Cart](${SRC.googleCart}), a cart that works across merchants in Google Search and the Gemini app. U.S. only for now.
- **Microsoft Copilot.** Named by Shopify as one of the AI channels merchants can switch on.
- **Perplexity.** Also named by Shopify as an AI channel.
For Shopify stores the connection runs through [Shopify Catalog](${SRC.shopifyDev}), which syndicates eligible products to AI platforms without a separate integration per platform. With [Agentic Storefronts](${SRC.shopifyNews}), part of Shopify’s Winter ’26 Edition in December 2025, you switch AI channels on and off in the admin. Checkout is still Shopify Checkout, and you remain the merchant of record. Orders from AI channels show channel attribution in the Shopify admin.
## How much traffic comes from AI assistants?
Not much yet, but it converts. We looked at five Shopify stores we run, over the 90 days to 17 October 2026 (anonymised, data from Salespulse):
`),
      b.stats([
        ['about 3,400', 'visits tagged from ChatGPT'],
        ['about 2.2%', 'conversion rate on ChatGPT traffic'],
        ['3 of 5', 'stores where ChatGPT beat the store average'],
        ['under 0.2%', 'of all sessions'],
      ]),
      b.md(`
Perplexity, Gemini and Copilot together sent fewer than 30 visits in the same period. So the volume is small, but shoppers arriving from ChatGPT have often already made up their minds. This is the moment to lay the groundwork, while competitors are still waiting.
## What do AI agents read in an online store?
Agents read structured information. In practice that means:
- A product title and description that say what the product is
- Attributes such as material, size, colour, dimensions, weight and GTIN (EAN)
- Price and stock per variant
- Shipping, returns and warranty terms
- Answers to common questions about the product and the store
What the agent does not read is the campaign banner on your homepage, the mood photo or a line like “contact us for shipping costs”. Øyvind Haagensen uses an example from a real catalogue: a product titled only “Historica”. To someone who knows the brand, that may mean something. To an agent it says almost nothing. Is it a throw, a book or a lamp?
## What should a Nordic store do first?
You don’t need to wait for new launches. This work pays off whichever agent the shopper uses:
1. **Write titles that say what the product is.** Product type, material and the key feature belong in the title, not just the collection name.
2. **Complete attributes and GTINs.** In Shopify, product data lives in standard product attributes and metafields. Gaps in those fields are gaps in what an agent can answer.
3. **Make shipping and returns machine-readable.** Write them clearly and unambiguously. Shopify lets you give agents your policies and FAQs through the Knowledge Base app.
4. **Check Shopify Catalog and Agentic Storefronts.** See which products are included and which AI channels are switched on.
5. **Measure it.** Watch orders with AI channel attribution in the admin so you can see what actually comes in.
## What is live where?
- **Shopify Catalog and Agentic Storefronts:** Shopify has not published a country list. Check what is available in your own admin.
- **Google Universal Cart:** launched in the U.S. on 15 October 2026 in Google Search and the Gemini app, with YouTube and Gmail next ([Digital Commerce 360](${SRC.dc360})).
- **UCP-powered checkout at Google:** expanding to Canada and Australia in the coming months, later the U.K., according to [Google](${SRC.googleCart}).
- **Norway and the Nordics:** nothing announced as of 17 October 2026.
If you want to understand the protocol underneath, we have written a separate walkthrough: [UCP and Google Universal Cart explained](${postHref('ucp', l)}).
`),
      b.faq('Frequently asked questions', [
        [
          'Is agentic commerce the same as AI search?',
          'No. AI search answers questions and shows products. Agentic commerce goes a step further: the assistant compares, adds to cart and can take the shopper all the way to payment. Both rely on the same product data.',
        ],
        [
          'Can an AI agent buy without the customer approving?',
          'No. In the Universal Commerce Protocol, backed by Google and Shopify, every payment authorization is tied to cryptographic proof that the customer consented.',
        ],
        [
          'Is Google Universal Cart available in Norway?',
          'No. Universal Cart launched in the U.S. on 15 October 2026. Google has said UCP-powered checkout will expand to Canada, Australia and later the U.K. Nothing has been announced for Norway or the Nordics.',
        ],
        [
          'What should I do first?',
          'Review your product titles, complete attributes and GTINs, make shipping and returns clear, and check which products are included in Shopify Catalog. It pays off whichever agent the shopper uses.',
        ],
      ]),
      b.md(`
## How we help stores with this
We review product data, policies and checkout in your Shopify store and give you a prioritised list of what to fix so agents understand and recommend your products. Read more about [how we work with agentic commerce](${pillarHref(l)}).
`),
      b.cta(
        'Is your store ready for AI agents?',
        'See what we check, and how we make your catalogue readable for ChatGPT, Google, Copilot and Perplexity.',
        'How we help stores with this',
        pillarHref(l),
      ),
    ],
  },

  sv: {
    title: 'Vad är agentisk handel?',
    excerpt:
      'AI-assistenter som ChatGPT, Gemini, Copilot och Perplexity hittar, jämför och köper allt oftare åt kunden. Här är vad agentisk handel betyder, vad agenterna faktiskt läser och vad en nordisk e-handlare bör göra först.',
    metaTitle: 'Vad är agentisk handel? En enkel guide för e-handlare',
    metaDescription:
      'Agentisk handel: AI-assistenter hittar, jämför och köper åt kunden. Se vad agenterna läser, var det är live och vad Shopify-butiken bör göra först.',
    tags: ['Agentisk handel', 'AI', 'Produktdata', 'Shopify'],
    content: (b, l) => [
      b.tldr(
        'Kort sagt',
        'Agentisk handel betyder att en AI-assistent gör en del av handlandet åt kunden: hittar produkten, jämför och slutför allt oftare köpet. Agenterna läser produktdata, villkor, lager och pris, inte banners. Börja med titlar som säger vad produkten är, kompletta attribut med GTIN, maskinläsbara frakt- och returvillkor och en kontroll av Shopify Catalog.',
      ),
      b.md(`
## Vad är agentisk handel?
Agentisk handel är e-handel där en AI-assistent gör jobbet som kunden tidigare gjorde själv. Kunden skriver vad hon behöver, till exempel ”en varm ulltröja som tål maskintvätt och kommer före helgen”. Assistenten söker, jämför produkter från flera butiker, kontrollerar lager och leverans och föreslår ett köp.
Allt oftare kan assistenten också lägga varan i varukorgen och ta kunden ända fram till betalningen. ”Agentisk” betyder att assistenten agerar för någons räkning, inom de ramar kunden har satt. Kunden godkänner fortfarande själva köpet.
## Vad förändras för e-handlaren?
Förr gick kunden via Google, klickade sig in på sajten, tittade på bilder, läste och köpte. Butiken kunde påverka varje steg med design, banners och kampanjer.
Nu sker en del av den resan innan kunden ens ser din sajt. Agenten har redan valt ut de tre produkter som är värda att visa. Svarar inte dina data på kundens fråga är du inte med i urvalet, hur snygg startsidan än är.
> ”Agenterna läser inte din sajt som kunden gör. De läser datan.” Øyvind Haagensen, kommersiell chef på Scandicommerce, på Handelskonferansen 2026.
## Var sker agentisk handel i dag?
Det finns fyra ytor som är värda att känna till:
- **ChatGPT.** Den överlägset största källan till AI-trafik i butikerna vi driver.
- **Google AI Mode och Gemini-appen.** Google har lanserat [Universal Cart](${SRC.googleCart}), en varukorg som fungerar över flera butiker i Google Sök och Gemini-appen. Än så länge bara i USA.
- **Microsoft Copilot.** Nämns av Shopify som en av AI-kanalerna handlare kan slå på.
- **Perplexity.** Nämns också av Shopify som AI-kanal.
För Shopify-butiker går kopplingen via [Shopify Catalog](${SRC.shopifyDev}), som skickar kvalificerade produkter vidare till AI-plattformar utan en separat integration per plattform. Med [Agentic Storefronts](${SRC.shopifyNews}), som kom i Shopifys Winter ’26 Edition i december 2025, slår du på och av AI-kanaler i admin. Kassan är fortfarande Shopify Checkout och du är fortfarande säljare (merchant of record). Ordrar från AI-kanaler visas med kanalattribution i Shopify-admin.
## Hur mycket trafik kommer från AI-assistenter?
Lite än så länge, men den konverterar. Vi har tittat på fem Shopify-butiker vi driver, de senaste 90 dagarna fram till 17 oktober 2026 (anonymiserat, data från Salespulse):
`),
      b.stats([
        ['cirka 3 400', 'besök taggade från ChatGPT'],
        ['cirka 2,2 %', 'konvertering på ChatGPT-trafiken'],
        ['3 av 5', 'butiker där ChatGPT konverterade bättre än snittet'],
        ['under 0,2 %', 'av alla sessioner'],
      ]),
      b.md(`
Perplexity, Gemini och Copilot skickade tillsammans färre än 30 besök under samma period. Volymen är alltså liten, men kunder som kommer från ChatGPT har ofta redan bestämt sig. Det är nu grunden läggs, medan konkurrenterna fortfarande väntar.
## Vad läser AI-agenter i en webbutik?
Agenter läser strukturerad information. I praktiken betyder det:
- Produkttitel och beskrivning som säger vad produkten är
- Attribut som material, storlek, färg, mått, vikt och GTIN (EAN)
- Pris och lagerstatus per variant
- Frakt-, retur- och garantivillkor
- Svar på vanliga frågor om produkten och butiken
Det agenten inte läser är kampanjbannern på startsidan, stämningsbilden eller en mening som ”kontakta oss för fraktpris”. Øyvind Haagensen använder ett exempel ur en riktig katalog: en produkt som bara heter ”Historica”. För någon som känner varumärket kan det betyda något. För en agent säger det nästan ingenting. Är det en filt, en bok eller en lampa?
## Vad bör en nordisk e-handlare göra först?
Du behöver inte vänta på nya lanseringar. Det här arbetet lönar sig oavsett vilken agent kunden använder:
1. **Skriv titlar som säger vad produkten är.** Produkttyp, material och viktigaste egenskap hör hemma i titeln, inte bara kollektionsnamnet.
2. **Fyll i attribut och GTIN.** I Shopify ligger produktdata i standardattribut och metafält. Luckor i de fälten är luckor i vad en agent kan svara på.
3. **Gör frakt- och returvillkor maskinläsbara.** Skriv dem tydligt och entydigt. Shopify låter dig ge agenter dina villkor och vanliga frågor via Knowledge Base-appen.
4. **Kontrollera Shopify Catalog och Agentic Storefronts.** Se vilka produkter som är med och vilka AI-kanaler som är påslagna.
5. **Mät det.** Följ ordrar med AI-kanalattribution i admin så att du ser vad som faktiskt kommer in.
## Vad är live var?
- **Shopify Catalog och Agentic Storefronts:** Shopify har inte publicerat någon landslista. Kontrollera vad som finns i din egen admin.
- **Google Universal Cart:** lanserad i USA den 15 oktober 2026 i Google Sök och Gemini-appen, med YouTube och Gmail som nästa steg ([Digital Commerce 360](${SRC.dc360})).
- **UCP-driven kassa hos Google:** utökas till Kanada och Australien de kommande månaderna, senare Storbritannien, enligt [Google](${SRC.googleCart}).
- **Norge och Norden:** inget annonserat per 17 oktober 2026.
Vill du förstå protokollet som ligger under har vi skrivit en egen genomgång: [UCP och Google Universal Cart förklarat](${postHref('ucp', l)}).
`),
      b.faq('Vanliga frågor', [
        [
          'Är agentisk handel samma sak som AI-sök?',
          'Nej. AI-sök svarar på frågor och visar produkter. Agentisk handel går ett steg längre: assistenten jämför, lägger i varukorgen och kan ta kunden hela vägen till betalning. Båda bygger på samma produktdata.',
        ],
        [
          'Kan en AI-agent köpa utan att kunden godkänner?',
          'Nej. I Universal Commerce Protocol, som Google och Shopify står bakom, är varje betalningsauktorisering kopplad till ett kryptografiskt bevis på att kunden har samtyckt.',
        ],
        [
          'Finns Google Universal Cart i Sverige eller Norden?',
          'Nej. Universal Cart lanserades i USA den 15 oktober 2026. Google har aviserat att UCP-driven kassa utökas till Kanada, Australien och senare Storbritannien. Inget har annonserats för Norden.',
        ],
        [
          'Vad bör jag göra först?',
          'Gå igenom produkttitlarna, fyll i attribut och GTIN, gör frakt- och returvillkor tydliga och kontrollera vilka produkter som är med i Shopify Catalog. Det lönar sig oavsett vilken agent kunden använder.',
        ],
      ]),
      b.md(`
## Så hjälper vi butiker med detta
Vi går igenom produktdata, villkor och kassa i din Shopify-butik och tar fram en prioriterad lista över vad som behöver åtgärdas för att agenterna ska förstå och rekommendera dina produkter. Läs mer om [hur vi arbetar med agentisk handel](${pillarHref(l)}).
`),
      b.cta(
        'Är din butik redo för AI-agenter?',
        'Se vad vi kontrollerar och hur vi gör katalogen läsbar för ChatGPT, Google, Copilot och Perplexity.',
        'Så hjälper vi butiker med detta',
        pillarHref(l),
      ),
    ],
  },

  da: {
    title: 'Hvad er agentisk handel?',
    excerpt:
      'AI-assistenter som ChatGPT, Gemini, Copilot og Perplexity finder, sammenligner og køber i stigende grad på kundens vegne. Her er hvad agentisk handel betyder, hvad agenterne faktisk læser, og hvad en nordisk webshop bør gøre først.',
    metaTitle: 'Hvad er agentisk handel? En enkel guide til webshops',
    metaDescription:
      'Agentisk handel: AI-assistenter finder, sammenligner og køber for kunden. Se hvad agenterne læser, hvor det er live, og hvad Shopify-butikken bør gøre.',
    tags: ['Agentisk handel', 'AI', 'Produktdata', 'Shopify'],
    content: (b, l) => [
      b.tldr(
        'Kort fortalt',
        'Agentisk handel betyder, at en AI-assistent klarer en del af indkøbet for kunden: finder produktet, sammenligner og i stigende grad gennemfører købet. Agenterne læser produktdata, politikker, lager og pris, ikke bannere. Start med titler, der siger, hvad produktet er, komplette attributter med GTIN, maskinlæsbare fragt- og returvilkår og et tjek af Shopify Catalog.',
      ),
      b.md(`
## Hvad er agentisk handel?
Agentisk handel er e-handel, hvor en AI-assistent gør det arbejde, kunden før gjorde selv. Kunden skriver, hvad hun har brug for, for eksempel ”en varm uldtrøje, der kan tåle maskinvask og kommer inden weekenden”. Assistenten søger, sammenligner produkter fra flere butikker, tjekker lager og levering og foreslår et køb.
Oftere og oftere kan assistenten også lægge varen i kurven og føre kunden helt frem til betalingen. ”Agentisk” betyder, at assistenten handler på nogens vegne inden for de rammer, kunden har sat. Kunden godkender stadig selve købet.
## Hvad ændrer sig for webshoppen?
Før gik kunden via Google, klikkede ind på sitet, så billeder, læste og købte. Butikken kunne påvirke hvert skridt med design, bannere og kampagner.
Nu sker en del af den rejse, før kunden overhovedet ser dit site. Agenten har allerede udvalgt de tre produkter, der er værd at vise. Svarer dine data ikke på kundens spørgsmål, er du ikke med i udvalget, uanset hvor flot forsiden er.
> ”Agenterne læser ikke dit website, som kunden gør. De læser dataene.” Øyvind Haagensen, kommerciel chef i Scandicommerce, på Handelskonferansen 2026.
## Hvor foregår agentisk handel i dag?
Der er fire flader, det er værd at kende:
- **ChatGPT.** Klart den største kilde til AI-trafik i de butikker, vi driver.
- **Google AI Mode og Gemini-appen.** Google har lanceret [Universal Cart](${SRC.googleCart}), en kurv på tværs af butikker i Google Søgning og Gemini-appen. Indtil videre kun i USA.
- **Microsoft Copilot.** Nævnt af Shopify som en af de AI-kanaler, butikker kan slå til.
- **Perplexity.** Også nævnt af Shopify som AI-kanal.
For Shopify-butikker går forbindelsen gennem [Shopify Catalog](${SRC.shopifyDev}), der sender kvalificerede produkter videre til AI-platforme uden en separat integration pr. platform. Med [Agentic Storefronts](${SRC.shopifyNews}), som kom i Shopifys Winter ’26 Edition i december 2025, slår du AI-kanaler til og fra i admin. Kassen er stadig Shopify Checkout, og du er stadig sælger (merchant of record). Ordrer fra AI-kanaler vises med kanalattribution i Shopify-admin.
## Hvor meget trafik kommer fra AI-assistenter?
Ikke meget endnu, men den konverterer. Vi har set på fem Shopify-butikker, vi driver, de seneste 90 dage frem til 17. oktober 2026 (anonymiseret, data fra Salespulse):
`),
      b.stats([
        ['ca. 3.400', 'besøg tagget fra ChatGPT'],
        ['ca. 2,2 %', 'konvertering på ChatGPT-trafikken'],
        ['3 af 5', 'butikker, hvor ChatGPT konverterede bedre end gennemsnittet'],
        ['under 0,2 %', 'af alle sessioner'],
      ]),
      b.md(`
Perplexity, Gemini og Copilot sendte tilsammen færre end 30 besøg i samme periode. Volumen er altså lille, men kunder fra ChatGPT har ofte allerede besluttet sig. Det er nu, fundamentet bliver lagt, mens konkurrenterne stadig venter.
## Hvad læser AI-agenter i en webshop?
Agenter læser struktureret information. I praksis betyder det:
- Produkttitel og beskrivelse, der siger, hvad produktet er
- Attributter som materiale, størrelse, farve, mål, vægt og GTIN (EAN)
- Pris og lagerstatus pr. variant
- Fragt-, retur- og garantivilkår
- Svar på almindelige spørgsmål om produktet og butikken
Det, agenten ikke læser, er kampagnebanneret på forsiden, stemningsbilledet eller en sætning som ”kontakt os for fragtpris”. Øyvind Haagensen bruger et eksempel fra et rigtigt katalog: et produkt, der kun hedder ”Historica”. For en, der kender brandet, kan det give mening. For en agent siger det næsten ingenting. Er det et plaid, en bog eller en lampe?
## Hvad bør en nordisk webshop gøre først?
Du behøver ikke vente på nye lanceringer. Dette arbejde betaler sig, uanset hvilken agent kunden bruger:
1. **Skriv titler, der siger, hvad produktet er.** Produkttype, materiale og vigtigste egenskab hører hjemme i titlen, ikke kun kollektionsnavnet.
2. **Udfyld attributter og GTIN.** I Shopify ligger produktdata i standardattributter og metafelter. Huller i de felter er huller i det, en agent kan svare på.
3. **Gør fragt- og returvilkår maskinlæsbare.** Skriv dem klart og entydigt. Shopify lader dig give agenter dine politikker og FAQ via Knowledge Base-appen.
4. **Tjek Shopify Catalog og Agentic Storefronts.** Se, hvilke produkter der er med, og hvilke AI-kanaler der er slået til.
5. **Mål det.** Følg ordrer med AI-kanalattribution i admin, så du kan se, hvad der faktisk kommer ind.
## Hvad er live hvor?
- **Shopify Catalog og Agentic Storefronts:** Shopify har ikke offentliggjort en landeliste. Tjek, hvad der er tilgængeligt i din egen admin.
- **Google Universal Cart:** lanceret i USA den 15. oktober 2026 i Google Søgning og Gemini-appen, med YouTube og Gmail som næste skridt ([Digital Commerce 360](${SRC.dc360})).
- **UCP-drevet checkout hos Google:** udvides til Canada og Australien i de kommende måneder, senere Storbritannien, ifølge [Google](${SRC.googleCart}).
- **Norge og Norden:** intet annonceret pr. 17. oktober 2026.
Vil du forstå protokollen nedenunder, har vi skrevet en særskilt gennemgang: [UCP og Google Universal Cart forklaret](${postHref('ucp', l)}).
`),
      b.faq('Ofte stillede spørgsmål', [
        [
          'Er agentisk handel det samme som AI-søgning?',
          'Nej. AI-søgning svarer på spørgsmål og viser produkter. Agentisk handel går et skridt videre: assistenten sammenligner, lægger i kurven og kan føre kunden helt til betaling. Begge dele bygger på de samme produktdata.',
        ],
        [
          'Kan en AI-agent købe, uden at kunden godkender?',
          'Nej. I Universal Commerce Protocol, som Google og Shopify står bag, er hver betalingsautorisation knyttet til et kryptografisk bevis på, at kunden har givet samtykke.',
        ],
        [
          'Er Google Universal Cart tilgængelig i Danmark eller Norden?',
          'Nej. Universal Cart blev lanceret i USA den 15. oktober 2026. Google har varslet, at UCP-drevet checkout udvides til Canada, Australien og senere Storbritannien. Intet er annonceret for Norden.',
        ],
        [
          'Hvad bør jeg gøre først?',
          'Gennemgå produkttitlerne, udfyld attributter og GTIN, gør fragt- og returvilkår tydelige, og tjek hvilke produkter der er med i Shopify Catalog. Det betaler sig, uanset hvilken agent kunden bruger.',
        ],
      ]),
      b.md(`
## Sådan hjælper vi butikker med det
Vi gennemgår produktdata, politikker og checkout i din Shopify-butik og laver en prioriteret liste over, hvad der skal rettes, for at agenterne forstår og anbefaler dine produkter. Læs mere om [hvordan vi arbejder med agentisk handel](${pillarHref(l)}).
`),
      b.cta(
        'Er din butik klar til AI-agenter?',
        'Se hvad vi tjekker, og hvordan vi gør kataloget læsbart for ChatGPT, Google, Copilot og Perplexity.',
        'Sådan hjælper vi butikker med det',
        pillarHref(l),
      ),
    ],
  },

  de: {
    title: 'Was ist Agentic Commerce?',
    excerpt:
      'KI-Assistenten wie ChatGPT, Gemini, Copilot und Perplexity finden, vergleichen und kaufen zunehmend im Auftrag der Kundschaft. Was Agentic Commerce bedeutet, was Agenten tatsächlich lesen und was ein Onlineshop zuerst tun sollte.',
    metaTitle: 'Was ist Agentic Commerce? Einfach erklärt für Onlineshops',
    metaDescription:
      'Agentic Commerce: KI-Assistenten finden, vergleichen und kaufen für Kunden. Was Agenten lesen, wo es live ist und was Ihr Shopify-Shop zuerst tun sollte.',
    tags: ['Agentic Commerce', 'KI', 'Produktdaten', 'Shopify'],
    content: (b, l) => [
      b.tldr(
        'Kurz gesagt',
        'Agentic Commerce bedeutet, dass ein KI-Assistent einen Teil des Einkaufs für die Kundschaft übernimmt: Er findet das Produkt, vergleicht und schließt den Kauf zunehmend selbst ab. Agenten lesen Produktdaten, Richtlinien, Bestand und Preis, keine Banner. Beginnen Sie mit Titeln, die sagen, was das Produkt ist, vollständigen Attributen mit GTIN, maschinenlesbaren Versand- und Rückgaberichtlinien und einem Check von Shopify Catalog.',
      ),
      b.md(`
## Was ist Agentic Commerce?
Agentic Commerce ist Onlinehandel, bei dem ein KI-Assistent die Arbeit übernimmt, die Kundinnen und Kunden früher selbst erledigt haben. Die Kundin beschreibt, was sie braucht, etwa „einen warmen Wollpullover, der in die Waschmaschine darf und vor dem Wochenende ankommt“. Der Assistent sucht, vergleicht Produkte aus mehreren Shops, prüft Bestand und Lieferung und schlägt einen Kauf vor.
Immer häufiger kann der Assistent den Artikel auch in den Warenkorb legen und die Kundin bis zur Zahlung führen. „Agentisch“ heißt, dass der Assistent im Auftrag von jemandem handelt, innerhalb der Grenzen, die die Kundschaft gesetzt hat. Den Kauf selbst bestätigt weiterhin der Mensch.
## Was ändert sich für Onlineshops?
Früher lief es so: Die Kundin suchte bei Google, klickte auf Ihre Website, sah sich Bilder an, las und kaufte. Mit Design, Bannern und Kampagnen konnten Sie jeden Schritt beeinflussen.
Heute passiert ein Teil dieser Reise, bevor die Kundin Ihre Website überhaupt sieht. Der Agent hat die drei Produkte, die sich zu zeigen lohnen, bereits ausgewählt. Beantworten Ihre Daten die Frage der Kundin nicht, sind Sie nicht in dieser Auswahl, ganz gleich, wie gut Ihre Startseite aussieht.
> „Agenten lesen Ihre Website nicht so, wie Kunden es tun. Sie lesen die Daten.“ Øyvind Haagensen, kaufmännischer Leiter bei Scandicommerce, auf der Handelskonferansen 2026.
## Wo findet Agentic Commerce heute statt?
Vier Oberflächen sollten Sie kennen:
- **ChatGPT.** Mit Abstand die größte Quelle für KI-Traffic in den Shops, die wir betreuen.
- **Google AI Mode und die Gemini-App.** Google hat [Universal Cart](${SRC.googleCart}) gestartet, einen händlerübergreifenden Warenkorb in der Google-Suche und der Gemini-App. Vorerst nur in den USA.
- **Microsoft Copilot.** Von Shopify als einer der KI-Kanäle genannt, die Händler aktivieren können.
- **Perplexity.** Ebenfalls von Shopify als KI-Kanal genannt.
Für Shopify-Shops läuft die Verbindung über [Shopify Catalog](${SRC.shopifyDev}). Der Dienst gibt geeignete Produkte an KI-Plattformen weiter, ohne dass Sie pro Plattform eine eigene Integration brauchen. Mit [Agentic Storefronts](${SRC.shopifyNews}), Teil der Winter ’26 Edition von Shopify im Dezember 2025, schalten Sie KI-Kanäle im Admin ein und aus. Der Checkout bleibt Shopify Checkout, und Sie bleiben Verkäufer (Merchant of Record). Bestellungen aus KI-Kanälen erscheinen im Shopify-Admin mit Kanalzuordnung.
## Wie viel Traffic kommt von KI-Assistenten?
Noch wenig, aber er konvertiert. Wir haben fünf Shopify-Shops ausgewertet, die wir betreuen, über die 90 Tage bis zum 17. Oktober 2026 (anonymisiert, Daten aus Salespulse):
`),
      b.stats([
        ['ca. 3.400', 'Besuche mit ChatGPT als Quelle'],
        ['ca. 2,2 %', 'Conversion-Rate des ChatGPT-Traffics'],
        ['3 von 5', 'Shops, in denen ChatGPT besser konvertierte als der Schnitt'],
        ['unter 0,2 %', 'aller Sitzungen'],
      ]),
      b.md(`
Perplexity, Gemini und Copilot schickten im selben Zeitraum zusammen weniger als 30 Besuche. Das Volumen ist also klein, aber wer über ChatGPT kommt, hat sich oft schon entschieden. Jetzt ist der Moment, die Grundlage zu legen, während die Konkurrenz noch abwartet.
## Was lesen KI-Agenten in einem Onlineshop?
Agenten lesen strukturierte Informationen. In der Praxis heißt das:
- Produkttitel und Beschreibung, die sagen, was das Produkt ist
- Attribute wie Material, Größe, Farbe, Maße, Gewicht und GTIN (EAN)
- Preis und Bestand pro Variante
- Versand-, Rückgabe- und Garantiebedingungen
- Antworten auf häufige Fragen zu Produkt und Shop
Was der Agent nicht liest: das Kampagnenbanner auf der Startseite, das Stimmungsbild oder einen Satz wie „Versandkosten auf Anfrage“. Øyvind Haagensen nennt ein Beispiel aus einem echten Katalog: ein Produkt, das nur „Historica“ heißt. Wer die Marke kennt, kann damit etwas anfangen. Einem Agenten sagt es fast nichts. Ist es eine Decke, ein Buch oder eine Lampe?
## Was sollte ein Onlineshop zuerst tun?
Sie müssen nicht auf neue Markteinführungen warten. Diese Arbeit zahlt sich aus, egal welchen Agenten die Kundschaft nutzt:
1. **Titel schreiben, die sagen, was das Produkt ist.** Produktart, Material und wichtigste Eigenschaft gehören in den Titel, nicht nur der Kollektionsname.
2. **Attribute und GTIN vervollständigen.** In Shopify liegen Produktdaten in Standard-Produktattributen und Metafeldern. Lücken dort sind Lücken in dem, was ein Agent beantworten kann.
3. **Versand und Rückgabe maschinenlesbar machen.** Formulieren Sie die Bedingungen klar und eindeutig. Über die Knowledge-Base-App von Shopify stellen Sie Agenten Ihre Richtlinien und FAQs bereit.
4. **Shopify Catalog und Agentic Storefronts prüfen.** Sehen Sie nach, welche Produkte enthalten und welche KI-Kanäle aktiviert sind.
5. **Messen.** Verfolgen Sie Bestellungen mit KI-Kanalzuordnung im Admin, damit Sie sehen, was tatsächlich hereinkommt.
## Was ist wo live?
- **Shopify Catalog und Agentic Storefronts:** Shopify hat keine Länderliste veröffentlicht. Prüfen Sie, was in Ihrem eigenen Admin verfügbar ist.
- **Google Universal Cart:** in den USA am 15. Oktober 2026 in der Google-Suche und der Gemini-App gestartet, YouTube und Gmail sollen folgen ([Digital Commerce 360](${SRC.dc360})).
- **UCP-basierter Checkout bei Google:** wird laut [Google](${SRC.googleCart}) in den kommenden Monaten auf Kanada und Australien ausgeweitet, später auf Großbritannien.
- **Norwegen und Nordeuropa:** Stand 17. Oktober 2026 nichts angekündigt.
Wenn Sie das Protokoll dahinter verstehen wollen, finden Sie hier eine eigene Erklärung: [UCP und Google Universal Cart erklärt](${postHref('ucp', l)}).
`),
      b.faq('Häufige Fragen', [
        [
          'Ist Agentic Commerce dasselbe wie KI-Suche?',
          'Nein. KI-Suche beantwortet Fragen und zeigt Produkte. Agentic Commerce geht einen Schritt weiter: Der Assistent vergleicht, legt in den Warenkorb und kann bis zur Zahlung führen. Beides beruht auf denselben Produktdaten.',
        ],
        [
          'Kann ein KI-Agent ohne Zustimmung der Kundschaft kaufen?',
          'Nein. Im Universal Commerce Protocol, hinter dem Google und Shopify stehen, ist jede Zahlungsautorisierung an einen kryptografischen Nachweis der Zustimmung gebunden.',
        ],
        [
          'Ist Google Universal Cart in Europa verfügbar?',
          'Nein. Universal Cart startete am 15. Oktober 2026 in den USA. Google hat angekündigt, den UCP-basierten Checkout auf Kanada, Australien und später Großbritannien auszuweiten. Für Norwegen oder Nordeuropa ist nichts angekündigt.',
        ],
        [
          'Was sollte ich zuerst tun?',
          'Produkttitel überarbeiten, Attribute und GTIN vervollständigen, Versand- und Rückgabebedingungen klar formulieren und prüfen, welche Produkte in Shopify Catalog enthalten sind. Das zahlt sich bei jedem Agenten aus.',
        ],
      ]),
      b.md(`
## So helfen wir Shops dabei
Wir prüfen Produktdaten, Richtlinien und Checkout Ihres Shopify-Shops und liefern eine priorisierte Liste, was zu beheben ist, damit Agenten Ihre Produkte verstehen und empfehlen. Mehr dazu, [wie wir mit Agentic Commerce arbeiten](${pillarHref(l)}).
`),
      b.cta(
        'Ist Ihr Shop bereit für KI-Agenten?',
        'Sehen Sie, was wir prüfen und wie wir Ihren Katalog für ChatGPT, Google, Copilot und Perplexity lesbar machen.',
        'So helfen wir Shops dabei',
        pillarHref(l),
      ),
    ],
  },
}

// ===========================================================================
// POST 2: UCP og Google Universal Cart forklart
// ===========================================================================
const UCP: Record<Lang, PostSpec> = {
  no: {
    title: 'UCP og Google Universal Cart forklart',
    excerpt:
      'Universal Commerce Protocol er standarden Google og Shopify har laget for at AI-agenter skal kunne handle i nettbutikker. Universal Cart er Googles handlekurv på tvers av butikker, bygget på UCP. Slik fungerer det, steg for steg, og dette betyr det for en Shopify-butikk i Norge i dag.',
    metaTitle: 'UCP og Google Universal Cart forklart steg for steg',
    metaDescription:
      'Slik fungerer Universal Commerce Protocol (UCP) steg for steg, hva Google Universal Cart er, og hva det betyr for en norsk Shopify-butikk i dag.',
    tags: ['UCP', 'Agentisk handel', 'Google', 'Shopify'],
    content: (b, l) => [
      b.tldr(
        'Kort fortalt',
        'UCP er en åpen standard fra Google og Shopify som lar AI-agenter oppdage hva en butikk tilbyr, opprette en kasse og betale med kundens samtykke, mens butikken forblir selger. Google Universal Cart er en handlekurv på tvers av butikker i Google Søk og Gemini-appen, med kasse drevet av UCP. Den er lansert i USA. Ingenting er annonsert for Norge, men for Shopify-butikker er UCP allerede en del av plattformen.',
      ),
      b.md(`
## Hva er UCP (Universal Commerce Protocol)?
UCP er en åpen standard for hvordan AI-agenter og nettbutikker snakker sammen når en kunde skal kjøpe noe. Den er utviklet av Google og Shopify, ble lansert på NRF i januar 2026 og er åpen kildekode på GitHub under Apache 2.0-lisensen. Ifølge Shopify støttes den også av blant andre Amazon, Meta, Microsoft, Stripe, Target, Walmart og Visa.
Tenk på UCP som et felles språk. I stedet for at hver AI-plattform må bygge sin egen integrasjon mot hver butikk, beskriver butikken seg selv én gang på en standard måte. Alle agenter som forstår UCP, kan da lese hva butikken tilbyr, og handle der.
## Hvorfor trengs en felles protokoll for agentisk handel?
Uten en standard måtte hver butikk koble seg til ChatGPT, Gemini, Copilot og Perplexity hver for seg, og hver kobling ville oppført seg litt ulikt. Det skalerer ikke, verken for butikkene eller for plattformene.
UCP løser dette ved å standardisere de stegene som alltid går igjen: hva butikken kan, hvordan en kasse opprettes og endres, og hvordan betalingen godkjennes. Butikken beholder samtidig kontrollen over egne regler for pris, rabatt og frakt.
## Hvordan fungerer UCP, steg for steg?
Google har publisert en teknisk gjennomgang, [Under the Hood: Universal Commerce Protocol](${SRC.ucpDev}). Forenklet ser flyten slik ut:
1. **Butikken publiserer et manifest.** En JSON-fil på adressen \`/.well-known/ucp\` beskriver hvilke tjenester og funksjoner butikken støtter, hvilke endepunkter som gjelder, og hvilke betalingsløsninger den tar imot.
2. **Agenten leser manifestet.** Der finner den blant annet tjenesten \`dev.ucp.shopping\` og funksjonen \`dev.ucp.shopping.checkout\`, med utvidelser som \`discount\` (rabatter) og \`fulfillment\` (levering).
3. **Agenten oppretter en kasseøkt.** Med \`POST /checkout-sessions\` sender agenten varelinjer, kjøper, valuta og hvilke betalingsløsninger den selv støtter. Butikken svarer med en status, for eksempel \`ready_for_complete\` når alt er klart.
4. **Økten oppdateres underveis.** Endringer som leveringsvalg eller rabattkode sendes med \`PUT /checkout-sessions/{id}\`. Butikken regner ut på nytt etter sine egne regler.
5. **Betalingen godkjennes.** UCP skiller mellom betalingsløsningen (handler, for eksempel \`shop_pay\` eller \`google_pay\`) og selve betalingsmiddelet. Hver autorisasjon er knyttet til et kryptografisk bevis på at kunden har samtykket. Protokollen er kompatibel med AP2, Googles protokoll for agentbetalinger.
6. **Butikken fullfører ordren.** Ordren havner i butikkens egne systemer. Butikken er selger (merchant of record) og eier sin egen forretningslogikk.
Agenten kan snakke med butikken over vanlig REST, over MCP (Model Context Protocol) eller over A2A (Agent2Agent). Det betyr at samme oppsett fungerer for ulike typer agenter.
## Hva er Google Universal Cart?
[Universal Cart](${SRC.googleCart}) er Googles handlekurv på tvers av butikker. Den ble vist fram på Google I/O 19. mai 2026 og rullet ut i USA 15. oktober 2026, i Google Søk og Gemini-appen. YouTube og Gmail kommer etter.
Kunden kan legge varer fra flere butikker i samme kurv. Google følger med på prisfall og prishistorikk, varsler når en vare er tilbake på lager, flagger varer som ikke passer sammen, og trekker inn fordeler og lojalitetsprogrammer fra Google Wallet. Kunden kan betale med Google Pay på noen få trykk, eller flytte varene over til butikkens egen nettside. Ifølge Google forblir merkevaren selger i begge tilfeller.
Blant butikkene Google nevner, er Nike, Sephora, Target, Ulta Beauty, Walmart og Wayfair, i tillegg til Shopify-butikker som Fenty og Steve Madden ([Digital Commerce 360](${SRC.dc360})).
## Hvordan henger UCP og Universal Cart sammen?
Universal Cart er det kunden ser. UCP er røret som kassen går gjennom. Når en kunde betaler i Universal Cart, er det UCP som oppretter kasseøkten hos butikken, henter riktig pris, frakt og rabatt, og sender en godkjent betaling tilbake.
Google sier at UCP-drevet kasse skal utvides til Canada og Australia de kommende månedene, og senere Storbritannia.
## Hva betyr UCP og Universal Cart for en Shopify-butikk i Norge?
Det korte svaret: Universal Cart er ikke her ennå, men UCP er allerede en del av Shopify.
- **Universal Cart:** lansert i USA. Ingenting er annonsert for Norge eller Norden per 17. oktober 2026.
- **UCP i Shopify:** Shopifys MCP-verktøy implementerer UCP for oppdagelse, handlekurv, kasse og ordreoppfølging ([Shopify](${SRC.shopifyDev})). Shopify Catalog sender kvalifiserte produkter til AI-plattformer, og i [Agentic Storefronts](${SRC.shopifyNews}) skrur du AI-kanalene av og på. Kassen er Shopify Checkout, og du er selger.
- **Trafikken i dag:** I fem Shopify-butikker vi drifter, kom det rundt 3 400 besøk fra ChatGPT de siste 90 dagene, med en konvertering på rundt 2,2 %. Perplexity, Gemini og Copilot sendte til sammen færre enn 30 besøk. Googles agentflater har altså ikke slått inn i Norge ennå.
For en Shopify-butikk handler jobben derfor mindre om selve protokollen og mer om det protokollen frakter: produktdata, pris og lager per variant, fraktregler og rabatter som er entydige nok til at en agent kan regne ut riktig sum uten å spørre et menneske.
> «Agenter søker ikke – de leser. Sørg for at dere har noe som er verdt å lese.» Øyvind Haagensen, kommersiell leder i Scandicommerce, på Handelskonferansen 2026.
Er du ny i temaet, start med [Hva er agentisk handel?](${postHref('what', l)})
`),
      b.faq('Ofte stilte spørsmål', [
        [
          'Må jeg bygge UCP selv for Shopify-butikken min?',
          'Shopify implementerer UCP i sine MCP-verktøy for oppdagelse, handlekurv, kasse og ordreoppfølging. For de fleste Shopify-butikker handler jobben om datakvalitet og entydige kasseregler, ikke om å bygge protokollen selv.',
        ],
        [
          'Er Google Universal Cart tilgjengelig i Norge?',
          'Nei. Universal Cart rullet ut i USA 15. oktober 2026. Google har varslet at UCP-drevet kasse utvides til Canada og Australia, senere Storbritannia. Ingenting er annonsert for Norge eller Norden.',
        ],
        [
          'Hvem er selger når kunden kjøper via Universal Cart?',
          'Butikken. Ifølge Google forblir merkevaren selger (merchant of record) både når kunden betaler med Google Pay og når varene flyttes over til butikkens egen nettside.',
        ],
        [
          'Er UCP bare for Google?',
          'Nei. UCP er en åpen standard under Apache 2.0, utviklet av Google og Shopify og støttet av blant andre Amazon, Meta, Microsoft, Stripe og Visa. Den fungerer over REST, MCP og A2A.',
        ],
      ]),
      b.md(`
## Slik hjelper vi butikker med dette
Vi sørger for at Shopify-butikken har produktdata, policyer og kasseregler som agentene kan lese og regne på, slik at du er klar når flere flater åpner i Norden. Les mer om [hvordan vi jobber med agentisk handel](${pillarHref(l)}).
`),
      b.cta(
        'Klar for agentisk kasse?',
        'Se hvordan vi gjør katalog, frakt og rabatter i Shopify lesbare for AI-agenter.',
        'Slik hjelper vi butikker med dette',
        pillarHref(l),
      ),
    ],
  },

  en: {
    title: 'UCP and Google Universal Cart explained',
    excerpt:
      'The Universal Commerce Protocol is the standard Google and Shopify built so AI agents can shop in online stores. Universal Cart is Google’s cross-merchant cart, built on UCP. Here is how it works step by step, and what it means for a Shopify store in Norway today.',
    metaTitle: 'UCP and Google Universal Cart explained, step by step',
    metaDescription:
      'How the Universal Commerce Protocol (UCP) works step by step, what Google Universal Cart is, and what it means for a Shopify store in the Nordics today.',
    tags: ['UCP', 'Agentic commerce', 'Google', 'Shopify'],
    content: (b, l) => [
      b.tldr(
        'In short',
        'UCP is an open standard from Google and Shopify that lets AI agents discover what a store offers, create a checkout and pay with the customer’s consent, while the store stays merchant of record. Google Universal Cart is a cross-merchant cart in Google Search and the Gemini app, with checkout powered by UCP. It has launched in the U.S. Nothing is announced for Norway, but for Shopify stores UCP is already part of the platform.',
      ),
      b.md(`
## What is UCP (Universal Commerce Protocol)?
UCP is an open standard for how AI agents and online stores talk to each other when a customer wants to buy something. It was co-developed by Google and Shopify, announced at NRF in January 2026, and is open source on GitHub under the Apache 2.0 licence. According to Shopify it is also backed by Amazon, Meta, Microsoft, Stripe, Target, Walmart and Visa, among others.
Think of UCP as a shared language. Instead of every AI platform building its own integration with every store, the store describes itself once in a standard way. Any agent that understands UCP can then read what the store offers, and buy from it.
## Why does agentic commerce need a shared protocol?
Without a standard, every store would have to connect to ChatGPT, Gemini, Copilot and Perplexity separately, and each connection would behave slightly differently. That doesn’t scale, for stores or for platforms.
UCP standardises the steps that always repeat: what the store can do, how a checkout is created and updated, and how payment is authorised. The store keeps control of its own rules for price, discounts and shipping.
## How does UCP work, step by step?
Google has published a technical walkthrough, [Under the Hood: Universal Commerce Protocol](${SRC.ucpDev}). Simplified, the flow looks like this:
1. **The store publishes a manifest.** A JSON file at \`/.well-known/ucp\` describes the services and capabilities the store supports, its endpoints, and the payment handlers it accepts.
2. **The agent reads the manifest.** There it finds, for example, the service \`dev.ucp.shopping\` and the capability \`dev.ucp.shopping.checkout\`, with extensions such as \`discount\` and \`fulfillment\`.
3. **The agent creates a checkout session.** With \`POST /checkout-sessions\` it sends line items, buyer, currency and the payment handlers it supports. The store replies with a status, for example \`ready_for_complete\` when everything is in place.
4. **The session is updated along the way.** Changes such as a delivery option or a discount code go through \`PUT /checkout-sessions/{id}\`. The store recalculates using its own rules.
5. **Payment is authorised.** UCP separates payment handlers (for example \`shop_pay\` or \`google_pay\`) from the payment instrument itself. Every authorisation is backed by cryptographic proof that the customer consented. The protocol is compatible with AP2, Google’s agent payments protocol.
6. **The store completes the order.** The order lands in the store’s own systems. The store is the merchant of record and owns its business logic.
Agents can talk to the store over plain REST, over MCP (Model Context Protocol) or over A2A (Agent2Agent), so the same setup works for different kinds of agents.
## What is Google Universal Cart?
[Universal Cart](${SRC.googleCart}) is Google’s cross-merchant shopping cart. It was previewed at Google I/O on 19 May 2026 and rolled out in the U.S. on 15 October 2026, across Google Search and the Gemini app. YouTube and Gmail are to follow.
Shoppers can add items from several stores to one cart. Google tracks price drops and price history, sends back-in-stock alerts, flags items that are incompatible, and applies Google Wallet perks and loyalty programmes. The shopper can check out with Google Pay in a few taps, or move the items to the merchant’s own site. Google says the brand stays the merchant of record either way.
Merchants Google names include Nike, Sephora, Target, Ulta Beauty, Walmart and Wayfair, plus Shopify merchants such as Fenty and Steve Madden ([Digital Commerce 360](${SRC.dc360})).
## How do UCP and Universal Cart fit together?
Universal Cart is what the shopper sees. UCP is the pipe the checkout runs through. When a shopper pays in Universal Cart, UCP creates the checkout session with the store, fetches the right price, shipping and discount, and returns an authorised payment.
Google says UCP-powered checkout will expand to Canada and Australia in the coming months, and later to the U.K.
## What do UCP and Universal Cart mean for a Shopify store in Norway?
The short answer: Universal Cart is not here yet, but UCP is already part of Shopify.
- **Universal Cart:** live in the U.S. Nothing announced for Norway or the Nordics as of 17 October 2026.
- **UCP in Shopify:** Shopify’s MCP tools implement UCP across discovery, carts, checkout and order monitoring ([Shopify](${SRC.shopifyDev})). Shopify Catalog syndicates eligible products to AI platforms, and in [Agentic Storefronts](${SRC.shopifyNews}) you switch AI channels on and off. Checkout is Shopify Checkout, and you are the merchant of record.
- **Traffic today:** Across five Shopify stores we run, ChatGPT sent about 3,400 visits in the last 90 days, converting at about 2.2%. Perplexity, Gemini and Copilot together sent fewer than 30. Google’s agent surfaces have not reached Norway yet.
For a Shopify store, the work is therefore less about the protocol itself and more about what the protocol carries: product data, price and stock per variant, and shipping and discount rules clear enough for an agent to calculate the right total without asking a human.
> “Agents don’t search, they read. Make sure you have something worth reading.” Øyvind Haagensen, commercial lead at Scandicommerce, on stage at Handelskonferansen 2026.
New to the topic? Start with [What is agentic commerce?](${postHref('what', l)})
`),
      b.faq('Frequently asked questions', [
        [
          'Do I have to build UCP myself for my Shopify store?',
          'Shopify implements UCP in its MCP tools across discovery, carts, checkout and order monitoring. For most Shopify stores the work is about data quality and unambiguous checkout rules, not about building the protocol.',
        ],
        [
          'Is Google Universal Cart available in Norway?',
          'No. Universal Cart rolled out in the U.S. on 15 October 2026. Google has said UCP-powered checkout will expand to Canada and Australia, later the U.K. Nothing has been announced for Norway or the Nordics.',
        ],
        [
          'Who is the seller when a shopper buys through Universal Cart?',
          'The store. Google says the brand stays the merchant of record whether the shopper pays with Google Pay or moves the items to the merchant’s own site.',
        ],
        [
          'Is UCP only for Google?',
          'No. UCP is an open standard under Apache 2.0, co-developed by Google and Shopify and backed by Amazon, Meta, Microsoft, Stripe and Visa, among others. It works over REST, MCP and A2A.',
        ],
      ]),
      b.md(`
## How we help stores with this
We make sure your Shopify store has product data, policies and checkout rules that agents can read and calculate with, so you are ready when more surfaces open in the Nordics. Read more about [how we work with agentic commerce](${pillarHref(l)}).
`),
      b.cta(
        'Ready for agentic checkout?',
        'See how we make your Shopify catalogue, shipping and discounts readable for AI agents.',
        'How we help stores with this',
        pillarHref(l),
      ),
    ],
  },

  sv: {
    title: 'UCP och Google Universal Cart förklarat',
    excerpt:
      'Universal Commerce Protocol är standarden Google och Shopify har tagit fram så att AI-agenter kan handla i webbutiker. Universal Cart är Googles varukorg över flera butiker, byggd på UCP. Så fungerar det steg för steg, och det här betyder det för en nordisk Shopify-butik i dag.',
    metaTitle: 'UCP och Google Universal Cart förklarat steg för steg',
    metaDescription:
      'Så fungerar Universal Commerce Protocol (UCP) steg för steg, vad Google Universal Cart är och vad det betyder för en Shopify-butik i Norden i dag.',
    tags: ['UCP', 'Agentisk handel', 'Google', 'Shopify'],
    content: (b, l) => [
      b.tldr(
        'Kort sagt',
        'UCP är en öppen standard från Google och Shopify som låter AI-agenter se vad en butik erbjuder, skapa en kassa och betala med kundens samtycke, medan butiken förblir säljare. Google Universal Cart är en varukorg över flera butiker i Google Sök och Gemini-appen, med kassa driven av UCP. Den har lanserats i USA. Inget är annonserat för Norden, men för Shopify-butiker är UCP redan en del av plattformen.',
      ),
      b.md(`
## Vad är UCP (Universal Commerce Protocol)?
UCP är en öppen standard för hur AI-agenter och webbutiker pratar med varandra när en kund vill köpa något. Den har tagits fram av Google och Shopify, lanserades på NRF i januari 2026 och är öppen källkod på GitHub under Apache 2.0-licensen. Enligt Shopify stöds den också av bland andra Amazon, Meta, Microsoft, Stripe, Target, Walmart och Visa.
Se UCP som ett gemensamt språk. I stället för att varje AI-plattform bygger en egen integration mot varje butik beskriver butiken sig själv en gång på ett standardiserat sätt. Alla agenter som förstår UCP kan sedan läsa vad butiken erbjuder och handla där.
## Varför behöver agentisk handel ett gemensamt protokoll?
Utan en standard skulle varje butik behöva koppla upp sig mot ChatGPT, Gemini, Copilot och Perplexity var för sig, och varje koppling skulle bete sig lite olika. Det skalar inte, varken för butikerna eller plattformarna.
UCP standardiserar de steg som alltid återkommer: vad butiken kan, hur en kassa skapas och ändras och hur betalningen godkänns. Butiken behåller samtidigt kontrollen över sina egna regler för pris, rabatter och frakt.
## Hur fungerar UCP, steg för steg?
Google har publicerat en teknisk genomgång, [Under the Hood: Universal Commerce Protocol](${SRC.ucpDev}). Förenklat ser flödet ut så här:
1. **Butiken publicerar ett manifest.** En JSON-fil på adressen \`/.well-known/ucp\` beskriver vilka tjänster och funktioner butiken stöder, vilka endpoints som gäller och vilka betallösningar den tar emot.
2. **Agenten läser manifestet.** Där hittar den bland annat tjänsten \`dev.ucp.shopping\` och funktionen \`dev.ucp.shopping.checkout\`, med tillägg som \`discount\` (rabatter) och \`fulfillment\` (leverans).
3. **Agenten skapar en kassasession.** Med \`POST /checkout-sessions\` skickar agenten orderrader, köpare, valuta och de betallösningar den själv stöder. Butiken svarar med en status, till exempel \`ready_for_complete\` när allt är klart.
4. **Sessionen uppdateras under tiden.** Ändringar som leveranssätt eller rabattkod skickas med \`PUT /checkout-sessions/{id}\`. Butiken räknar om enligt sina egna regler.
5. **Betalningen godkänns.** UCP skiljer mellan betallösningen (handler, till exempel \`shop_pay\` eller \`google_pay\`) och själva betalmedlet. Varje auktorisering är kopplad till ett kryptografiskt bevis på att kunden har samtyckt. Protokollet är kompatibelt med AP2, Googles protokoll för agentbetalningar.
6. **Butiken slutför ordern.** Ordern hamnar i butikens egna system. Butiken är säljare (merchant of record) och äger sin egen affärslogik.
Agenten kan prata med butiken via vanlig REST, via MCP (Model Context Protocol) eller via A2A (Agent2Agent). Samma upplägg fungerar alltså för olika typer av agenter.
## Vad är Google Universal Cart?
[Universal Cart](${SRC.googleCart}) är Googles varukorg över flera butiker. Den visades på Google I/O den 19 maj 2026 och rullades ut i USA den 15 oktober 2026, i Google Sök och Gemini-appen. YouTube och Gmail följer efter.
Kunden kan lägga varor från flera butiker i samma korg. Google bevakar prissänkningar och prishistorik, meddelar när en vara är tillbaka i lager, flaggar varor som inte passar ihop och använder förmåner och lojalitetsprogram från Google Wallet. Kunden kan betala med Google Pay på några tryck eller flytta varorna till butikens egen sajt. Enligt Google förblir varumärket säljare i båda fallen.
Bland butikerna Google nämner finns Nike, Sephora, Target, Ulta Beauty, Walmart och Wayfair, samt Shopify-handlare som Fenty och Steve Madden ([Digital Commerce 360](${SRC.dc360})).
## Hur hänger UCP och Universal Cart ihop?
Universal Cart är det kunden ser. UCP är röret som kassan går genom. När en kund betalar i Universal Cart är det UCP som skapar kassasessionen hos butiken, hämtar rätt pris, frakt och rabatt och skickar tillbaka en godkänd betalning.
Google säger att UCP-driven kassa ska utökas till Kanada och Australien de kommande månaderna, och senare till Storbritannien.
## Vad betyder UCP och Universal Cart för en Shopify-butik i Norden?
Det korta svaret: Universal Cart är inte här än, men UCP är redan en del av Shopify.
- **Universal Cart:** lanserad i USA. Inget annonserat för Norden per 17 oktober 2026.
- **UCP i Shopify:** Shopifys MCP-verktyg implementerar UCP för upptäckt, varukorg, kassa och orderuppföljning ([Shopify](${SRC.shopifyDev})). Shopify Catalog skickar kvalificerade produkter till AI-plattformar, och i [Agentic Storefronts](${SRC.shopifyNews}) slår du på och av AI-kanaler. Kassan är Shopify Checkout och du är säljare.
- **Trafiken i dag:** I fem Shopify-butiker vi driver kom cirka 3 400 besök från ChatGPT de senaste 90 dagarna, med en konvertering på cirka 2,2 %. Perplexity, Gemini och Copilot skickade tillsammans färre än 30 besök. Googles agentytor har alltså inte nått Norden än.
För en Shopify-butik handlar jobbet därför mindre om själva protokollet och mer om det protokollet bär: produktdata, pris och lager per variant samt frakt- och rabattregler som är tydliga nog för att en agent ska kunna räkna ut rätt summa utan att fråga en människa.
> ”Agenter söker inte, de läser. Se till att ni har något som är värt att läsa.” Øyvind Haagensen, kommersiell chef på Scandicommerce, på Handelskonferansen 2026.
Ny i ämnet? Börja med [Vad är agentisk handel?](${postHref('what', l)})
`),
      b.faq('Vanliga frågor', [
        [
          'Måste jag bygga UCP själv för min Shopify-butik?',
          'Shopify implementerar UCP i sina MCP-verktyg för upptäckt, varukorg, kassa och orderuppföljning. För de flesta Shopify-butiker handlar jobbet om datakvalitet och entydiga kassaregler, inte om att bygga protokollet.',
        ],
        [
          'Finns Google Universal Cart i Sverige eller Norden?',
          'Nej. Universal Cart rullades ut i USA den 15 oktober 2026. Google har aviserat att UCP-driven kassa utökas till Kanada och Australien, senare Storbritannien. Inget har annonserats för Norden.',
        ],
        [
          'Vem är säljare när kunden köper via Universal Cart?',
          'Butiken. Enligt Google förblir varumärket säljare (merchant of record) både när kunden betalar med Google Pay och när varorna flyttas till butikens egen sajt.',
        ],
        [
          'Är UCP bara för Google?',
          'Nej. UCP är en öppen standard under Apache 2.0, framtagen av Google och Shopify och med stöd av bland andra Amazon, Meta, Microsoft, Stripe och Visa. Den fungerar över REST, MCP och A2A.',
        ],
      ]),
      b.md(`
## Så hjälper vi butiker med detta
Vi ser till att din Shopify-butik har produktdata, villkor och kassaregler som agenterna kan läsa och räkna på, så att du är redo när fler ytor öppnar i Norden. Läs mer om [hur vi arbetar med agentisk handel](${pillarHref(l)}).
`),
      b.cta(
        'Redo för agentisk kassa?',
        'Se hur vi gör katalog, frakt och rabatter i Shopify läsbara för AI-agenter.',
        'Så hjälper vi butiker med detta',
        pillarHref(l),
      ),
    ],
  },

  da: {
    title: 'UCP og Google Universal Cart forklaret',
    excerpt:
      'Universal Commerce Protocol er standarden, Google og Shopify har lavet, så AI-agenter kan handle i webshops. Universal Cart er Googles kurv på tværs af butikker, bygget på UCP. Sådan fungerer det trin for trin, og det betyder det for en nordisk Shopify-butik i dag.',
    metaTitle: 'UCP og Google Universal Cart forklaret trin for trin',
    metaDescription:
      'Sådan fungerer Universal Commerce Protocol (UCP) trin for trin, hvad Google Universal Cart er, og hvad det betyder for en Shopify-butik i Norden i dag.',
    tags: ['UCP', 'Agentisk handel', 'Google', 'Shopify'],
    content: (b, l) => [
      b.tldr(
        'Kort fortalt',
        'UCP er en åben standard fra Google og Shopify, der lader AI-agenter se, hvad en butik tilbyder, oprette en checkout og betale med kundens samtykke, mens butikken forbliver sælger. Google Universal Cart er en kurv på tværs af butikker i Google Søgning og Gemini-appen, med checkout drevet af UCP. Den er lanceret i USA. Intet er annonceret for Norden, men for Shopify-butikker er UCP allerede en del af platformen.',
      ),
      b.md(`
## Hvad er UCP (Universal Commerce Protocol)?
UCP er en åben standard for, hvordan AI-agenter og webshops taler sammen, når en kunde vil købe noget. Den er udviklet af Google og Shopify, blev lanceret på NRF i januar 2026 og er open source på GitHub under Apache 2.0-licensen. Ifølge Shopify bakkes den også op af blandt andre Amazon, Meta, Microsoft, Stripe, Target, Walmart og Visa.
Tænk på UCP som et fælles sprog. I stedet for at hver AI-platform bygger sin egen integration til hver butik, beskriver butikken sig selv én gang på en standardiseret måde. Alle agenter, der forstår UCP, kan derefter læse, hvad butikken tilbyder, og handle der.
## Hvorfor har agentisk handel brug for en fælles protokol?
Uden en standard skulle hver butik forbinde sig til ChatGPT, Gemini, Copilot og Perplexity hver for sig, og hver forbindelse ville opføre sig lidt forskelligt. Det skalerer ikke, hverken for butikkerne eller platformene.
UCP standardiserer de trin, der altid går igen: hvad butikken kan, hvordan en checkout oprettes og ændres, og hvordan betalingen godkendes. Butikken bevarer samtidig kontrollen over sine egne regler for pris, rabatter og fragt.
## Hvordan fungerer UCP, trin for trin?
Google har udgivet en teknisk gennemgang, [Under the Hood: Universal Commerce Protocol](${SRC.ucpDev}). Forenklet ser flowet sådan ud:
1. **Butikken udgiver et manifest.** En JSON-fil på adressen \`/.well-known/ucp\` beskriver, hvilke tjenester og funktioner butikken understøtter, hvilke endpoints der gælder, og hvilke betalingsløsninger den tager imod.
2. **Agenten læser manifestet.** Her finder den blandt andet tjenesten \`dev.ucp.shopping\` og funktionen \`dev.ucp.shopping.checkout\`, med udvidelser som \`discount\` (rabatter) og \`fulfillment\` (levering).
3. **Agenten opretter en checkout-session.** Med \`POST /checkout-sessions\` sender agenten ordrelinjer, køber, valuta og de betalingsløsninger, den selv understøtter. Butikken svarer med en status, for eksempel \`ready_for_complete\`, når alt er på plads.
4. **Sessionen opdateres undervejs.** Ændringer som leveringsmetode eller rabatkode sendes med \`PUT /checkout-sessions/{id}\`. Butikken regner om efter sine egne regler.
5. **Betalingen godkendes.** UCP skelner mellem betalingsløsningen (handler, for eksempel \`shop_pay\` eller \`google_pay\`) og selve betalingsmidlet. Hver autorisation er knyttet til et kryptografisk bevis på, at kunden har givet samtykke. Protokollen er kompatibel med AP2, Googles protokol for agentbetalinger.
6. **Butikken gennemfører ordren.** Ordren lander i butikkens egne systemer. Butikken er sælger (merchant of record) og ejer sin egen forretningslogik.
Agenten kan tale med butikken via almindelig REST, via MCP (Model Context Protocol) eller via A2A (Agent2Agent). Samme opsætning fungerer altså for forskellige typer agenter.
## Hvad er Google Universal Cart?
[Universal Cart](${SRC.googleCart}) er Googles indkøbskurv på tværs af butikker. Den blev vist på Google I/O den 19. maj 2026 og rullet ud i USA den 15. oktober 2026 i Google Søgning og Gemini-appen. YouTube og Gmail følger efter.
Kunden kan lægge varer fra flere butikker i samme kurv. Google holder øje med prisfald og prishistorik, giver besked, når en vare er tilbage på lager, markerer varer, der ikke passer sammen, og bruger fordele og loyalitetsprogrammer fra Google Wallet. Kunden kan betale med Google Pay med få tryk eller flytte varerne over til butikkens eget site. Ifølge Google forbliver brandet sælger i begge tilfælde.
Blandt de butikker, Google nævner, er Nike, Sephora, Target, Ulta Beauty, Walmart og Wayfair samt Shopify-butikker som Fenty og Steve Madden ([Digital Commerce 360](${SRC.dc360})).
## Hvordan hænger UCP og Universal Cart sammen?
Universal Cart er det, kunden ser. UCP er røret, checkouten går igennem. Når en kunde betaler i Universal Cart, er det UCP, der opretter checkout-sessionen hos butikken, henter den rigtige pris, fragt og rabat og sender en godkendt betaling tilbage.
Google siger, at UCP-drevet checkout udvides til Canada og Australien i de kommende måneder og senere til Storbritannien.
## Hvad betyder UCP og Universal Cart for en Shopify-butik i Norden?
Det korte svar: Universal Cart er her ikke endnu, men UCP er allerede en del af Shopify.
- **Universal Cart:** lanceret i USA. Intet annonceret for Norden pr. 17. oktober 2026.
- **UCP i Shopify:** Shopifys MCP-værktøjer implementerer UCP til opdagelse, kurv, checkout og ordreopfølgning ([Shopify](${SRC.shopifyDev})). Shopify Catalog sender kvalificerede produkter til AI-platforme, og i [Agentic Storefronts](${SRC.shopifyNews}) slår du AI-kanaler til og fra. Checkout er Shopify Checkout, og du er sælger.
- **Trafikken i dag:** I fem Shopify-butikker, vi driver, kom der omkring 3.400 besøg fra ChatGPT de seneste 90 dage med en konvertering på omkring 2,2 %. Perplexity, Gemini og Copilot sendte tilsammen færre end 30 besøg. Googles agentflader har altså ikke ramt Norden endnu.
For en Shopify-butik handler arbejdet derfor mindre om selve protokollen og mere om det, protokollen bærer: produktdata, pris og lager pr. variant og fragt- og rabatregler, der er klare nok til, at en agent kan regne den rigtige total ud uden at spørge et menneske.
> ”Agenter søger ikke, de læser. Sørg for, at I har noget, der er værd at læse.” Øyvind Haagensen, kommerciel chef i Scandicommerce, på Handelskonferansen 2026.
Ny i emnet? Start med [Hvad er agentisk handel?](${postHref('what', l)})
`),
      b.faq('Ofte stillede spørgsmål', [
        [
          'Skal jeg selv bygge UCP til min Shopify-butik?',
          'Shopify implementerer UCP i sine MCP-værktøjer til opdagelse, kurv, checkout og ordreopfølgning. For de fleste Shopify-butikker handler arbejdet om datakvalitet og entydige checkout-regler, ikke om at bygge protokollen.',
        ],
        [
          'Er Google Universal Cart tilgængelig i Danmark eller Norden?',
          'Nej. Universal Cart blev rullet ud i USA den 15. oktober 2026. Google har varslet, at UCP-drevet checkout udvides til Canada og Australien, senere Storbritannien. Intet er annonceret for Norden.',
        ],
        [
          'Hvem er sælger, når kunden køber via Universal Cart?',
          'Butikken. Ifølge Google forbliver brandet sælger (merchant of record), både når kunden betaler med Google Pay, og når varerne flyttes til butikkens eget site.',
        ],
        [
          'Er UCP kun for Google?',
          'Nej. UCP er en åben standard under Apache 2.0, udviklet af Google og Shopify og bakket op af blandt andre Amazon, Meta, Microsoft, Stripe og Visa. Den fungerer over REST, MCP og A2A.',
        ],
      ]),
      b.md(`
## Sådan hjælper vi butikker med det
Vi sørger for, at din Shopify-butik har produktdata, politikker og checkout-regler, som agenterne kan læse og regne på, så du er klar, når flere flader åbner i Norden. Læs mere om [hvordan vi arbejder med agentisk handel](${pillarHref(l)}).
`),
      b.cta(
        'Klar til agentisk checkout?',
        'Se hvordan vi gør katalog, fragt og rabatter i Shopify læsbare for AI-agenter.',
        'Sådan hjælper vi butikker med det',
        pillarHref(l),
      ),
    ],
  },

  de: {
    title: 'UCP und Google Universal Cart erklärt',
    excerpt:
      'Das Universal Commerce Protocol ist der Standard, den Google und Shopify entwickelt haben, damit KI-Agenten in Onlineshops einkaufen können. Universal Cart ist Googles händlerübergreifender Warenkorb auf Basis von UCP. So funktioniert es Schritt für Schritt, und das bedeutet es heute für Shopify-Shops in Nordeuropa.',
    metaTitle: 'UCP und Google Universal Cart Schritt für Schritt erklärt',
    metaDescription:
      'So funktioniert das Universal Commerce Protocol (UCP) Schritt für Schritt, was Google Universal Cart ist und was es für Shopify-Shops im Norden bedeutet.',
    tags: ['UCP', 'Agentic Commerce', 'Google', 'Shopify'],
    content: (b, l) => [
      b.tldr(
        'Kurz gesagt',
        'UCP ist ein offener Standard von Google und Shopify, mit dem KI-Agenten erkennen, was ein Shop anbietet, einen Checkout anlegen und mit Zustimmung der Kundschaft bezahlen, während der Shop Verkäufer bleibt. Google Universal Cart ist ein händlerübergreifender Warenkorb in der Google-Suche und der Gemini-App, dessen Checkout auf UCP läuft. Er ist in den USA gestartet. Für Nordeuropa ist nichts angekündigt, für Shopify-Shops ist UCP aber bereits Teil der Plattform.',
      ),
      b.md(`
## Was ist UCP (Universal Commerce Protocol)?
UCP ist ein offener Standard dafür, wie KI-Agenten und Onlineshops miteinander sprechen, wenn jemand etwas kaufen will. Google und Shopify haben ihn gemeinsam entwickelt, auf der NRF im Januar 2026 vorgestellt und als Open Source unter der Apache-2.0-Lizenz auf GitHub veröffentlicht. Laut Shopify unterstützen ihn unter anderem auch Amazon, Meta, Microsoft, Stripe, Target, Walmart und Visa.
Stellen Sie sich UCP als gemeinsame Sprache vor. Statt dass jede KI-Plattform eine eigene Integration mit jedem Shop baut, beschreibt sich der Shop einmal auf standardisierte Weise. Jeder Agent, der UCP versteht, kann dann lesen, was der Shop anbietet, und dort einkaufen.
## Warum braucht Agentic Commerce ein gemeinsames Protokoll?
Ohne Standard müsste jeder Shop ChatGPT, Gemini, Copilot und Perplexity einzeln anbinden, und jede Anbindung würde sich etwas anders verhalten. Das skaliert weder für Shops noch für Plattformen.
UCP standardisiert die Schritte, die sich immer wiederholen: was der Shop kann, wie ein Checkout angelegt und geändert wird und wie die Zahlung autorisiert wird. Die Regeln für Preise, Rabatte und Versand bleiben dabei in der Hand des Shops.
## Wie funktioniert UCP Schritt für Schritt?
Google hat eine technische Erklärung veröffentlicht: [Under the Hood: Universal Commerce Protocol](${SRC.ucpDev}). Vereinfacht sieht der Ablauf so aus:
1. **Der Shop veröffentlicht ein Manifest.** Eine JSON-Datei unter \`/.well-known/ucp\` beschreibt, welche Dienste und Funktionen der Shop unterstützt, welche Endpunkte gelten und welche Zahlungsabwickler er akzeptiert.
2. **Der Agent liest das Manifest.** Dort findet er etwa den Dienst \`dev.ucp.shopping\` und die Funktion \`dev.ucp.shopping.checkout\` mit Erweiterungen wie \`discount\` (Rabatte) und \`fulfillment\` (Lieferung).
3. **Der Agent legt eine Checkout-Session an.** Per \`POST /checkout-sessions\` übermittelt er Positionen, Käufer, Währung und die Zahlungsabwickler, die er selbst unterstützt. Der Shop antwortet mit einem Status, zum Beispiel \`ready_for_complete\`, wenn alles bereit ist.
4. **Die Session wird laufend aktualisiert.** Änderungen wie Versandart oder Rabattcode gehen über \`PUT /checkout-sessions/{id}\`. Der Shop rechnet nach seinen eigenen Regeln neu.
5. **Die Zahlung wird autorisiert.** UCP trennt Zahlungsabwickler (Handler, etwa \`shop_pay\` oder \`google_pay\`) vom eigentlichen Zahlungsmittel. Jede Autorisierung ist durch einen kryptografischen Nachweis der Zustimmung abgesichert. Das Protokoll ist mit AP2 kompatibel, Googles Protokoll für Agentenzahlungen.
6. **Der Shop schließt die Bestellung ab.** Die Bestellung landet in den eigenen Systemen des Shops. Der Shop ist Verkäufer (Merchant of Record) und behält seine Geschäftslogik.
Agenten können über klassisches REST, über MCP (Model Context Protocol) oder über A2A (Agent2Agent) mit dem Shop kommunizieren. Dasselbe Setup funktioniert also für unterschiedliche Arten von Agenten.
## Was ist Google Universal Cart?
[Universal Cart](${SRC.googleCart}) ist Googles händlerübergreifender Warenkorb. Er wurde am 19. Mai 2026 auf der Google I/O vorgestellt und am 15. Oktober 2026 in den USA in der Google-Suche und der Gemini-App eingeführt. YouTube und Gmail sollen folgen.
Kundinnen und Kunden können Artikel aus mehreren Shops in einen Warenkorb legen. Google verfolgt Preissenkungen und Preisverlauf, meldet, wenn ein Artikel wieder verfügbar ist, weist auf inkompatible Artikel hin und berücksichtigt Vorteile und Treueprogramme aus Google Wallet. Bezahlt wird mit wenigen Klicks über Google Pay, oder die Artikel wandern in den Shop des Händlers. Laut Google bleibt die Marke in beiden Fällen Verkäufer.
Zu den von Google genannten Händlern gehören Nike, Sephora, Target, Ulta Beauty, Walmart und Wayfair sowie Shopify-Händler wie Fenty und Steve Madden ([Digital Commerce 360](${SRC.dc360})).
## Wie hängen UCP und Universal Cart zusammen?
Universal Cart ist das, was die Kundschaft sieht. UCP ist die Leitung, durch die der Checkout läuft. Bezahlt jemand in Universal Cart, legt UCP die Checkout-Session beim Shop an, holt den richtigen Preis, Versand und Rabatt und liefert eine autorisierte Zahlung zurück.
Google zufolge wird der UCP-basierte Checkout in den kommenden Monaten auf Kanada und Australien ausgeweitet, später auf Großbritannien.
## Was bedeuten UCP und Universal Cart für Shopify-Shops in Nordeuropa?
Die kurze Antwort: Universal Cart ist noch nicht da, UCP ist aber bereits Teil von Shopify.
- **Universal Cart:** in den USA live. Für Norwegen und Nordeuropa ist Stand 17. Oktober 2026 nichts angekündigt.
- **UCP in Shopify:** Die MCP-Tools von Shopify implementieren UCP für Suche, Warenkorb, Checkout und Bestellverfolgung ([Shopify](${SRC.shopifyDev})). Shopify Catalog gibt geeignete Produkte an KI-Plattformen weiter, und in [Agentic Storefronts](${SRC.shopifyNews}) schalten Sie KI-Kanäle ein und aus. Der Checkout ist Shopify Checkout, und Sie sind Verkäufer.
- **Traffic heute:** In fünf Shopify-Shops, die wir betreuen, kamen in den letzten 90 Tagen rund 3.400 Besuche von ChatGPT, mit einer Conversion-Rate von rund 2,2 %. Perplexity, Gemini und Copilot schickten zusammen weniger als 30 Besuche. Googles Agenten-Oberflächen sind in Norwegen also noch nicht angekommen.
Für einen Shopify-Shop geht es deshalb weniger um das Protokoll selbst als um das, was es transportiert: Produktdaten, Preis und Bestand pro Variante sowie Versand- und Rabattregeln, die so eindeutig sind, dass ein Agent die richtige Summe berechnen kann, ohne einen Menschen zu fragen.
> „Agenten suchen nicht, sie lesen. Sorgen Sie dafür, dass Sie etwas haben, das sich zu lesen lohnt.“ Øyvind Haagensen, kaufmännischer Leiter bei Scandicommerce, auf der Handelskonferansen 2026.
Neu im Thema? Beginnen Sie mit [Was ist Agentic Commerce?](${postHref('what', l)})
`),
      b.faq('Häufige Fragen', [
        [
          'Muss ich UCP für meinen Shopify-Shop selbst bauen?',
          'Shopify implementiert UCP in seinen MCP-Tools für Suche, Warenkorb, Checkout und Bestellverfolgung. Für die meisten Shopify-Shops geht es um Datenqualität und eindeutige Checkout-Regeln, nicht um den Bau des Protokolls.',
        ],
        [
          'Ist Google Universal Cart in Europa verfügbar?',
          'Nein. Universal Cart wurde am 15. Oktober 2026 in den USA eingeführt. Google hat angekündigt, den UCP-basierten Checkout auf Kanada und Australien, später Großbritannien auszuweiten. Für Norwegen oder Nordeuropa ist nichts angekündigt.',
        ],
        [
          'Wer ist Verkäufer, wenn über Universal Cart gekauft wird?',
          'Der Shop. Laut Google bleibt die Marke Verkäufer (Merchant of Record), egal ob mit Google Pay bezahlt wird oder die Artikel in den Shop des Händlers wandern.',
        ],
        [
          'Ist UCP nur für Google?',
          'Nein. UCP ist ein offener Standard unter Apache 2.0, gemeinsam von Google und Shopify entwickelt und unter anderem von Amazon, Meta, Microsoft, Stripe und Visa unterstützt. Er funktioniert über REST, MCP und A2A.',
        ],
      ]),
      b.md(`
## So helfen wir Shops dabei
Wir sorgen dafür, dass Ihr Shopify-Shop Produktdaten, Richtlinien und Checkout-Regeln hat, die Agenten lesen und berechnen können, damit Sie bereit sind, wenn weitere Oberflächen in Nordeuropa starten. Mehr dazu, [wie wir mit Agentic Commerce arbeiten](${pillarHref(l)}).
`),
      b.cta(
        'Bereit für den agentischen Checkout?',
        'Sehen Sie, wie wir Katalog, Versand und Rabatte in Shopify für KI-Agenten lesbar machen.',
        'So helfen wir Shops dabei',
        pillarHref(l),
      ),
    ],
  },
}

// ---------------------------------------------------------------------------
const POSTS = [
  { key: 'what' as const, idBase: 'post-agentic-what-is', tmId: 'translation-metadata-post-agentic-what-is', spec: WHAT, publishedAt: '2026-10-17T08:00:00Z' },
  { key: 'ucp' as const, idBase: 'post-agentic-ucp', tmId: 'translation-metadata-post-agentic-ucp', spec: UCP, publishedAt: '2026-10-17T09:00:00Z' },
]

function plainText(content: Record<string, unknown>[]): string {
  const out: string[] = []
  const walk = (v: unknown) => {
    if (Array.isArray(v)) v.forEach(walk)
    else if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>
      for (const [key, val] of Object.entries(o)) {
        if (key.startsWith('_') || key === 'markDefs' || key === 'url' || key === 'variant' || key === 'style' || key === 'listItem' || key === 'marks')
          continue
        if (typeof val === 'string') out.push(val)
        else walk(val)
      }
    }
  }
  walk(content)
  return out.join(' ')
}

async function main() {
  const tx = client.transaction()
  const report: string[] = []
  for (const post of POSTS) {
    const translations: Record<string, unknown>[] = []
    for (const lang of LANGS) {
      const id = `${post.idBase}-${lang}`
      const b = makeBuilder(id)
      const spec = post.spec[lang]
      const content = spec.content(b, lang)
      const sibling = POSTS.find((p) => p.key !== post.key)!
      const doc: SanityDoc = {
        _id: id,
        _type: 'post',
        language: lang,
        title: spec.title,
        slug: { _type: 'slug', current: slugFor(post.key, lang) },
        excerpt: spec.excerpt,
        publishedAt: post.publishedAt,
        tags: spec.tags.map((t, i) => b.tag(t, i === 0)),
        author: { _type: 'reference', _ref: AUTHOR_ID },
        content,
        relatedPages: [
          { _type: 'reference', _key: `rp-pillar-${lang}`, _ref: `pillar-agentisk-handel-${lang}`, _weak: true },
          { _type: 'reference', _key: `rp-sibling-${lang}`, _ref: `${sibling.idBase}-${lang}`, _weak: true },
        ],
        seoExtended: {
          _type: 'seo',
          metaTitle: spec.metaTitle,
          metaDescription: spec.metaDescription,
          structuredDataType: 'Article',
          noIndex: false,
          noFollow: false,
        },
      }
      tx.createOrReplace(doc)
      const words = plainText(content).split(/\s+/).filter(Boolean).length
      report.push(`${id}\t${lang}\t${words} words\t${spec.metaTitle.length}/${spec.metaDescription.length} chars meta`)
      translations.push({
        _key: lang,
        _type: 'internationalizedArrayReferenceValue',
        value: { _type: 'reference', _ref: id, _weak: true, _strengthenOnPublish: { type: 'post' } },
      })
    }
    const tm: SanityDoc = { _id: post.tmId, _type: 'translation.metadata', schemaTypes: ['post'], translations }
    tx.createOrReplace(tm)
  }
  if (process.env.DRY_RUN) {
    console.log(report.join('\n'))
    return
  }
  await tx.commit({ visibility: 'sync' })
  console.log(`Committed to ${dataset}:\n${report.join('\n')}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
