/**
 * Agentisk handel pillar, v2: a sales page from Scandicommerce's side.
 * What we see in the stores we run, how we work, how a UCP purchase works (animation),
 * what is live in Norway, what you get, what it is not. Education lives in the blog.
 *
 * Numbers: Salespulse, five Shopify stores we run, 90 days to 17 Oct 2026 (anonymised).
 * UCP / Universal Cart: Google Developers Blog, Google blog, Digital Commerce 360 (16 Oct 2026).
 *
 *   TARGET_DATASET=production npx sanity exec scripts/sanity-agentic-pillar-v2.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'development'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })

let n = 0
const k = () => `ag${(n++).toString(36)}${Math.random().toString(36).slice(2, 6)}`

type Span = string | { text: string; href: string }
const p = (...parts: Span[]) => {
  const markDefs: { _key: string; _type: 'link'; href: string }[] = []
  const children = parts.map((part) => {
    if (typeof part === 'string') return { _key: k(), _type: 'span', text: part, marks: [] as string[] }
    const key = k()
    markDefs.push({ _key: key, _type: 'link', href: part.href })
    return { _key: k(), _type: 'span', text: part.text, marks: [key] }
  })
  return { _key: k(), _type: 'block', style: 'normal', markDefs, children }
}
const stats = (items: [string, string][]) => ({ _key: k(), _type: 'statsRowBlock', stats: items.map(([value, label]) => ({ _key: k(), value, label })) })
const steps = (numbered: boolean, items: [string, string, string?][]) => ({
  _key: k(), _type: 'stepsBlock', numbered,
  steps: items.map(([title, text, meta]) => ({ _key: k(), _type: 'step', title, text, ...(meta ? { meta } : {}) })),
})
const quote = (content: string, title: string) => ({ _key: k(), _type: 'calloutBlock', variant: 'tldr', title, content })
const animation = (caption: string) => ({ _key: k(), _type: 'animationBlock', animation: 'ucp-flow', caption })
const table = (columns: string[], rows: string[][]) => ({ _key: k(), _type: 'tableBlock', columns, rows: rows.map((cells) => ({ _key: k(), _type: 'tableRow', cells })) })
const section = (heading: string, anchor: string, body: unknown[]) => ({ _key: k(), _type: 'templateSection', heading, anchor, body })
const faq = (items: [string, string][]) => items.map(([question, answer]) => ({ _key: k(), _type: 'faqItem', question, answer }))

const GOOGLE_DEV = 'https://developers.googleblog.com/en/under-the-hood-universal-commerce-protocol-ucp/'
const GOOGLE_CART = 'https://blog.google/products-and-platforms/products/shopping/google-shopping-cart/'

type Content = Record<string, unknown>

const NO: Content = {
  eyebrow: 'Agentisk handel',
  pageTitle: 'Agentisk handel: slik gjør vi Shopify-butikker klare for AI-agenter',
  definition:
    'Agentisk handel er når AI-assistenter som ChatGPT, Gemini og Perplexity finner, sammenligner og kjøper produkter for kunden. Vi gjør Shopify-butikker lesbare for agentene: strukturerte produktdata, tydelige policyer og en kasse som kan fullføres. Vi gjør det i butikkene vi drifter, og vi måler hva det gir.',
  sections: [
    section('Hva vi ser i butikkene vi drifter', 'tall', [
      p('Vi måler trafikk fra AI-agenter som en egen kilde i butikkene vi drifter. Tallene er fra fem Shopify-butikker de siste 90 dagene, per 17. oktober 2026.'),
      stats([
        ['3 400', 'besøk fra ChatGPT'],
        ['2,2 %', 'konvertering på de besøkene'],
        ['3 av 5', 'butikker der ChatGPT-besøk kjøpte oftere enn snittet'],
        ['< 0,2 %', 'av alle økter i dag'],
      ]),
      p('Det er lite i dag. Men besøkene kommer fra kunder som allerede har fått produktet anbefalt, og i tre av fem butikker kjøpte de oftere enn snittet. ChatGPT står for nesten alt: Perplexity, Gemini og Copilot sendte til sammen færre enn 30 besøk.'),
      quote('«Agentene leser ikke nettsiden din slik kunden gjør. De leser dataene. Agenter søker ikke, de leser. Sørg for at dere har noe som er verdt å lese.»', 'Øyvind Haagensen, CCO i Scandicommerce, på Handelskonferansen 2026'),
    ]),
    section('Slik jobber vi', 'slik-jobber-vi', [
      p('Fire steg. Det første tar to virkedager, og du får resultatet uansett om du går videre med oss.'),
      steps(true, [
        ['Agentsjekk', 'Vi stiller ChatGPT, Gemini og Perplexity spørsmålene kundene dine faktisk stiller, og noterer hvem som blir anbefalt og hvorfor. Samtidig går vi gjennom katalogen, policyene og om butikken er koblet til Shopify Catalog.', '2 virkedager'],
        ['Datamodell', 'Vi kartlegger produkttypene og bestemmer hvilke attributter hver type trenger: mål, materiale, GTIN, bruksområde. Malene lages per produkttype, ikke per produkt, så en katalog på 13 000 varer dekkes av 15 til 30 maler.'],
        ['Gjennomføring', 'Titler, beskrivelser og attributter oppdateres i bulk, direkte i Shopify. Svarene lagres som metafelt, så nye produkter arver dem automatisk. Frakt, retur og garanti skrives så en maskin kan lese dem, og kassen får ingen valg agenten ikke kan ta.'],
        ['Måling', 'Agenttrafikk blir en egen kilde i rapporten din, med økter, konvertering og ordre per agent. Vi går gjennom tallene sammen hver måned og justerer der det gir mest.'],
      ]),
    ]),
    section('Slik fungerer et kjøp gjennom en agent', 'ucp', [
      animation('Et kjøp gjennom Universal Commerce Protocol (UCP), steg for steg.'),
      p('UCP er en åpen standard Google og Shopify har utviklet sammen. Butikken publiserer en fil som forteller agenten hva den støtter: kasse, rabatter, levering og betalingsmåter. Agenten åpner en kasse direkte mot butikken, kunden godkjenner, og ordren havner i Shopify som en vanlig ordre. Butikken er fortsatt selger. ', { text: 'Les Googles tekniske gjennomgang', href: GOOGLE_DEV }, '.'),
    ]),
    section('Hva som er live i Norge nå', 'status', [
      p('Mye av det som skrives om agentisk handel gjelder USA. Slik ser det ut for en norsk Shopify-butikk per oktober 2026:'),
      table(
        ['Flate', 'Status i Norge', 'Hva det betyr for deg'],
        [
          ['ChatGPT', 'Live', 'Anbefaler produkter og sender kunden til butikken din. Vi ser trafikken i dag.'],
          ['Shopify Catalog', 'Live', 'Gjør produktene dine tilgjengelige for agentene, hvis dataene er komplette.'],
          ['Google Universal Cart', 'Kun USA', 'Lansert 15. oktober 2026 i Søk og Gemini, med kasse via UCP.'],
          ['Kasse via UCP i Google', 'Ikke ennå', 'Google har varslet Canada og Australia først, deretter Storbritannia.'],
        ],
      ),
      p('Derfor anbefaler vi å gjøre jobben nå: produktdataene agentene trenger, er de samme som løfter Google, Shopping og søket i din egen butikk. Når kassen via agentene kommer hit, er butikken allerede klar. ', { text: 'Googles kunngjøring av Universal Cart', href: GOOGLE_CART }, '.'),
    ]),
    section('Hva du får', 'leveranse', [
      steps(false, [
        ['Agentsjekk med prioritert liste', 'Hva agentene svarer om butikken din i dag, hva som mangler og hva du bør rette først.', '2 virkedager'],
        ['Datamodell og maler', 'Produkttyper, attributter og maler dokumentert, så teamet ditt kan legge inn nye produkter riktig selv.'],
        ['Oppdaterte produktdata', 'Titler, beskrivelser, attributter og spørsmål og svar skrevet direkte inn i Shopify.'],
        ['Policyer og kasse uten blindveier', 'Frakt, retur og garanti i et format agentene forstår, og en kasse de kan fullføre.'],
        ['Månedlig agentrapport', 'Økter, konvertering og ordre fra ChatGPT og andre agenter, side om side med resten av trafikken.'],
        ['Én kontakt som kan Shopify', 'Vi er Shopify Plus-partner og drifter butikkene vi måler. Du snakker med folk som gjør jobben.'],
      ]),
      p('Sjekken og gjennomføringen prises som et eget prosjekt etter omfang. Løpende optimalisering inngår i Enterprise-pakken.'),
    ]),
    section('Hva det ikke er', 'forventninger', [
      p('Det er ikke en ny nettbutikk. Vi jobber i Shopify-butikken du har, og du trenger ikke Shopify Plus.'),
      p('Det er ingen garanti for plassering. Ingen kan love at ChatGPT anbefaler akkurat deg. Vi kan sørge for at agentene har det de trenger for å velge deg, og måle om de gjør det.'),
      p('Det er ikke stort ennå. Under 0,2 prosent av øktene i butikkene vi drifter kommer fra agenter i dag. Vi sier det rett ut, fordi det er grunnen til å starte med data som også gir effekt i Google og i din egen butikk.'),
    ]),
  ],
  faq: faq([
    ['Hvor mye trafikk kommer fra AI-agenter i dag?', 'I fem Shopify-butikker vi drifter kom rundt 3 400 besøk fra ChatGPT de siste 90 dagene, under 0,2 prosent av alle økter. De konverterte på rundt 2,2 prosent, og i tre av fem butikker bedre enn snittet.'],
    ['Må vi ha Shopify Plus?', 'Nei. Shopify Catalog og agentkanalene er tilgjengelige for vanlige Shopify-butikker. Plus gir mer kontroll over kassen og flere markeder, men er ikke et krav for å bli funnet av agenter.'],
    ['Kan agentene kjøpe uten at kunden godkjenner?', 'Nei. Kunden godkjenner kjøpet i agenten før ordren legges. Du ser ordren i Shopify som vanlig, merket med hvor den kom fra.'],
    ['Hva er UCP?', 'Universal Commerce Protocol er en åpen standard fra Google og Shopify som lar AI-agenter finne produkter og fullføre kjøp direkte mot butikken. Butikken er fortsatt selger og eier kundeforholdet.'],
    ['Hva med B2B?', 'Agentisk handel starter i B2C, men B2B-innkjøpere bruker de samme assistentene. En ryddig katalog med riktige priser per kunde gjør at Shopify B2B også kan leses av agenter.'],
  ]),
  cta: {
    heading: 'Vil du vite hva agentene sier om butikken din?',
    text: 'Vi stiller ChatGPT, Gemini og Perplexity spørsmålene kundene dine stiller, og sender deg svarene og en prioritert liste innen to virkedager.',
    buttonLabel: 'Book en agentsjekk',
    buttonHref: '/kontakt',
  },
  seoExtended: {
    metaTitle: 'Agentisk handel for Shopify-butikker | Scandicommerce',
    metaDescription: 'Slik gjør vi Shopify-butikker klare for ChatGPT, Gemini og Perplexity: agentsjekk, datamodell, produktdata og måling. Med tall fra butikkene vi drifter.',
  },
}

const EN: Content = {
  eyebrow: 'Agentic commerce',
  pageTitle: 'Agentic commerce: how we get Shopify stores ready for AI agents',
  definition:
    'Agentic commerce is when AI assistants such as ChatGPT, Gemini and Perplexity find, compare and buy products for the shopper. We make Shopify stores readable for those agents: structured product data, clear policies and a checkout they can complete. We do it in the stores we run, and we measure what it brings.',
  sections: [
    section('What we see in the stores we run', 'numbers', [
      p('We track traffic from AI agents as its own source in the stores we run. These figures cover five Shopify stores over the last 90 days, as of 17 October 2026.'),
      stats([
        ['3,400', 'visits from ChatGPT'],
        ['2.2%', 'conversion on those visits'],
        ['3 of 5', 'stores where ChatGPT visitors bought more often than average'],
        ['< 0.2%', 'of all sessions today'],
      ]),
      p('It is small today. But these visitors arrive with a product already recommended, and in three of five stores they bought more often than average. ChatGPT accounts for almost all of it: Perplexity, Gemini and Copilot together sent fewer than 30 visits.'),
      quote('“Agents don’t read your website the way a shopper does. They read the data. Agents don’t search, they read. Make sure you have something worth reading.”', 'Øyvind Haagensen, CCO at Scandicommerce, at Handelskonferansen 2026'),
    ]),
    section('How we work', 'how-we-work', [
      p('Four steps. The first takes two working days, and the result is yours whether or not you continue with us.'),
      steps(true, [
        ['Agent check', 'We ask ChatGPT, Gemini and Perplexity the questions your customers actually ask, and note who gets recommended and why. We also review your catalogue, your policies and whether the store is connected to Shopify Catalog.', '2 working days'],
        ['Data model', 'We map your product types and decide which attributes each type needs: dimensions, material, GTIN, use. Templates are built per product type, not per product, so a 13,000-item catalogue is covered by 15 to 30 templates.'],
        ['Implementation', 'Titles, descriptions and attributes are updated in bulk, directly in Shopify. Answers are stored as metafields, so new products inherit them automatically. Shipping, returns and warranty are written so a machine can read them, and checkout has no choice an agent cannot make.'],
        ['Measurement', 'Agent traffic becomes its own source in your reporting, with sessions, conversion and orders per agent. We review the numbers together every month and adjust where it pays off most.'],
      ]),
    ]),
    section('How a purchase through an agent works', 'ucp', [
      animation('A purchase through the Universal Commerce Protocol (UCP), step by step.'),
      p('UCP is an open standard developed by Google and Shopify. The store publishes a file that tells the agent what it supports: checkout, discounts, fulfilment and payment methods. The agent opens a checkout directly with the store, the shopper approves, and the order lands in Shopify as a normal order. The store stays the merchant of record. ', { text: 'Read Google’s technical walkthrough', href: GOOGLE_DEV }, '.'),
    ]),
    section('What is live in the Nordics today', 'status', [
      p('Much of what is written about agentic commerce applies to the US. This is the picture for a Nordic Shopify store as of October 2026:'),
      table(
        ['Surface', 'Status in the Nordics', 'What it means for you'],
        [
          ['ChatGPT', 'Live', 'Recommends products and sends shoppers to your store. We see this traffic today.'],
          ['Shopify Catalog', 'Live', 'Makes your products available to agents, if the data is complete.'],
          ['Google Universal Cart', 'US only', 'Launched 15 October 2026 in Search and Gemini, with checkout via UCP.'],
          ['UCP checkout in Google', 'Not yet', 'Google has announced Canada and Australia first, then the UK.'],
        ],
      ),
      p('That is why we recommend doing the work now: the product data agents need is the same data that lifts Google, Shopping and search in your own store. When agent checkout arrives here, your store is ready. ', { text: 'Google’s Universal Cart announcement', href: GOOGLE_CART }, '.'),
    ]),
    section('What you get', 'deliverables', [
      steps(false, [
        ['Agent check with a priority list', 'What agents say about your store today, what is missing and what to fix first.', '2 working days'],
        ['Data model and templates', 'Product types, attributes and templates documented, so your team can add new products correctly.'],
        ['Updated product data', 'Titles, descriptions, attributes and Q&A written directly into Shopify.'],
        ['Policies and a checkout without dead ends', 'Shipping, returns and warranty in a format agents understand, and a checkout they can complete.'],
        ['Monthly agent report', 'Sessions, conversion and orders from ChatGPT and other agents, side by side with the rest of your traffic.'],
        ['One contact who knows Shopify', 'We are a Shopify Plus partner and run the stores we measure. You talk to the people doing the work.'],
      ]),
      p('The check and the implementation are priced as a project based on scope. Ongoing optimisation is included in the Enterprise package.'),
    ]),
    section('What it is not', 'expectations', [
      p('It is not a new store. We work in the Shopify store you already have, and you do not need Shopify Plus.'),
      p('It is not a ranking guarantee. Nobody can promise that ChatGPT will recommend you. We can make sure agents have what they need to choose you, and measure whether they do.'),
      p('It is not big yet. Under 0.2 percent of sessions in the stores we run come from agents today. We say that plainly, because it is the reason to start with data that also pays off in Google and in your own store.'),
    ]),
  ],
  faq: faq([
    ['How much traffic comes from AI agents today?', 'Across five Shopify stores we run, about 3,400 visits came from ChatGPT in the last 90 days, under 0.2 percent of all sessions. They converted at about 2.2 percent, and in three of five stores better than average.'],
    ['Do we need Shopify Plus?', 'No. Shopify Catalog and the agent channels are available to standard Shopify stores. Plus gives more control over checkout and markets, but it is not required to be found by agents.'],
    ['Can agents buy without the shopper approving?', 'No. The shopper approves the purchase in the agent before the order is placed. You see the order in Shopify as usual, tagged with where it came from.'],
    ['What is UCP?', 'The Universal Commerce Protocol is an open standard from Google and Shopify that lets AI agents find products and complete purchases directly with the store. The store stays the merchant of record and owns the customer relationship.'],
    ['What about B2B?', 'Agentic commerce starts in B2C, but B2B buyers use the same assistants. A clean catalogue with the right prices per customer makes Shopify B2B readable for agents too.'],
  ]),
  cta: {
    heading: 'Want to know what agents say about your store?',
    text: 'We ask ChatGPT, Gemini and Perplexity the questions your customers ask, and send you the answers and a priority list within two working days.',
    buttonLabel: 'Book an agent check',
    buttonHref: '/contact',
  },
  seoExtended: {
    metaTitle: 'Agentic commerce for Shopify stores | Scandicommerce',
    metaDescription: 'How we get Shopify stores ready for ChatGPT, Gemini and Perplexity: agent check, data model, product data and measurement. With numbers from the stores we run.',
  },
}

const SV: Content = {
  eyebrow: 'Agentisk handel',
  pageTitle: 'Agentisk handel: så gör vi Shopify-butiker redo för AI-agenter',
  definition:
    'Agentisk handel är när AI-assistenter som ChatGPT, Gemini och Perplexity hittar, jämför och köper produkter åt kunden. Vi gör Shopify-butiker läsbara för agenterna: strukturerad produktdata, tydliga villkor och en kassa som går att slutföra. Vi gör det i butikerna vi driver, och vi mäter vad det ger.',
  sections: [
    section('Vad vi ser i butikerna vi driver', 'numbers', [
      p('Vi mäter trafik från AI-agenter som en egen källa i butikerna vi driver. Siffrorna gäller fem Shopify-butiker de senaste 90 dagarna, per den 17 oktober 2026.'),
      stats([
        ['3 400', 'besök från ChatGPT'],
        ['2,2 %', 'konvertering på de besöken'],
        ['3 av 5', 'butiker där ChatGPT-besökare köpte oftare än snittet'],
        ['< 0,2 %', 'av alla sessioner i dag'],
      ]),
      p('Det är lite i dag. Men besökarna kommer med en produkt som redan har rekommenderats, och i tre av fem butiker köpte de oftare än snittet. ChatGPT står för nästan allt: Perplexity, Gemini och Copilot skickade tillsammans färre än 30 besök.'),
      quote('”Agenterna läser inte din webbplats som kunden gör. De läser datan. Agenter söker inte, de läser. Se till att ni har något som är värt att läsa.”', 'Øyvind Haagensen, CCO på Scandicommerce, på Handelskonferansen 2026'),
    ]),
    section('Så arbetar vi', 'how-we-work', [
      p('Fyra steg. Det första tar två arbetsdagar, och resultatet är ditt oavsett om du går vidare med oss.'),
      steps(true, [
        ['Agentkontroll', 'Vi ställer de frågor dina kunder faktiskt ställer till ChatGPT, Gemini och Perplexity och noterar vem som rekommenderas och varför. Samtidigt går vi igenom katalogen, villkoren och om butiken är kopplad till Shopify Catalog.', '2 arbetsdagar'],
        ['Datamodell', 'Vi kartlägger produkttyperna och bestämmer vilka attribut varje typ behöver: mått, material, GTIN, användning. Mallarna görs per produkttyp, inte per produkt, så en katalog på 13 000 artiklar täcks av 15 till 30 mallar.'],
        ['Genomförande', 'Titlar, beskrivningar och attribut uppdateras i bulk, direkt i Shopify. Svaren sparas som metafält, så nya produkter ärver dem automatiskt. Frakt, retur och garanti skrivs så att en maskin kan läsa dem, och kassan har inga val som agenten inte kan göra.'],
        ['Mätning', 'Agenttrafik blir en egen källa i din rapport, med sessioner, konvertering och order per agent. Vi går igenom siffrorna tillsammans varje månad och justerar där det ger mest.'],
      ]),
    ]),
    section('Så fungerar ett köp via en agent', 'ucp', [
      animation('Ett köp via Universal Commerce Protocol (UCP), steg för steg.'),
      p('UCP är en öppen standard som Google och Shopify har tagit fram tillsammans. Butiken publicerar en fil som berättar för agenten vad den stöder: kassa, rabatter, leverans och betalsätt. Agenten öppnar en kassa direkt mot butiken, kunden godkänner och ordern hamnar i Shopify som en vanlig order. Butiken är fortfarande säljare. ', { text: 'Läs Googles tekniska genomgång', href: GOOGLE_DEV }, '.'),
    ]),
    section('Vad som är live i Norden nu', 'status', [
      p('Mycket av det som skrivs om agentisk handel gäller USA. Så här ser det ut för en nordisk Shopify-butik i oktober 2026:'),
      table(
        ['Yta', 'Status i Norden', 'Vad det betyder för dig'],
        [
          ['ChatGPT', 'Live', 'Rekommenderar produkter och skickar kunden till din butik. Vi ser trafiken i dag.'],
          ['Shopify Catalog', 'Live', 'Gör dina produkter tillgängliga för agenterna, om datan är komplett.'],
          ['Google Universal Cart', 'Endast USA', 'Lanserad 15 oktober 2026 i Sök och Gemini, med kassa via UCP.'],
          ['Kassa via UCP i Google', 'Inte än', 'Google har aviserat Kanada och Australien först, sedan Storbritannien.'],
        ],
      ),
      p('Därför rekommenderar vi att göra jobbet nu: produktdatan agenterna behöver är samma data som lyfter Google, Shopping och sökningen i din egen butik. När kassan via agenter kommer hit är butiken redan redo. ', { text: 'Googles lansering av Universal Cart', href: GOOGLE_CART }, '.'),
    ]),
    section('Vad du får', 'deliverables', [
      steps(false, [
        ['Agentkontroll med prioriterad lista', 'Vad agenterna säger om din butik i dag, vad som saknas och vad du bör åtgärda först.', '2 arbetsdagar'],
        ['Datamodell och mallar', 'Produkttyper, attribut och mallar dokumenterade, så att ditt team kan lägga in nya produkter rätt själva.'],
        ['Uppdaterad produktdata', 'Titlar, beskrivningar, attribut och frågor och svar skrivna direkt i Shopify.'],
        ['Villkor och kassa utan återvändsgränder', 'Frakt, retur och garanti i ett format agenterna förstår, och en kassa de kan slutföra.'],
        ['Månatlig agentrapport', 'Sessioner, konvertering och order från ChatGPT och andra agenter, sida vid sida med övrig trafik.'],
        ['En kontakt som kan Shopify', 'Vi är Shopify Plus-partner och driver butikerna vi mäter. Du pratar med dem som gör jobbet.'],
      ]),
      p('Kontrollen och genomförandet prissätts som ett eget projekt efter omfattning. Löpande optimering ingår i Enterprise-paketet.'),
    ]),
    section('Vad det inte är', 'expectations', [
      p('Det är ingen ny webbutik. Vi arbetar i den Shopify-butik du redan har, och du behöver inte Shopify Plus.'),
      p('Det är ingen garanti för placering. Ingen kan lova att ChatGPT rekommenderar just dig. Vi kan se till att agenterna har det de behöver för att välja dig, och mäta om de gör det.'),
      p('Det är inte stort än. Under 0,2 procent av sessionerna i butikerna vi driver kommer från agenter i dag. Vi säger det rakt ut, eftersom det är skälet att börja med data som också ger effekt i Google och i din egen butik.'),
    ]),
  ],
  faq: faq([
    ['Hur mycket trafik kommer från AI-agenter i dag?', 'I fem Shopify-butiker vi driver kom cirka 3 400 besök från ChatGPT de senaste 90 dagarna, under 0,2 procent av alla sessioner. De konverterade på cirka 2,2 procent, och i tre av fem butiker bättre än snittet.'],
    ['Behöver vi Shopify Plus?', 'Nej. Shopify Catalog och agentkanalerna finns för vanliga Shopify-butiker. Plus ger mer kontroll över kassan och marknader, men krävs inte för att hittas av agenter.'],
    ['Kan agenterna köpa utan att kunden godkänner?', 'Nej. Kunden godkänner köpet i agenten innan ordern läggs. Du ser ordern i Shopify som vanligt, märkt med var den kom ifrån.'],
    ['Vad är UCP?', 'Universal Commerce Protocol är en öppen standard från Google och Shopify som låter AI-agenter hitta produkter och slutföra köp direkt mot butiken. Butiken är fortfarande säljare och äger kundrelationen.'],
    ['Hur är det med B2B?', 'Agentisk handel börjar i B2C, men B2B-inköpare använder samma assistenter. En ren katalog med rätt priser per kund gör att även Shopify B2B kan läsas av agenter.'],
  ]),
  cta: {
    heading: 'Vill du veta vad agenterna säger om din butik?',
    text: 'Vi ställer dina kunders frågor till ChatGPT, Gemini och Perplexity och skickar svaren och en prioriterad lista inom två arbetsdagar.',
    buttonLabel: 'Boka en agentkontroll',
    buttonHref: '/contact',
  },
  seoExtended: {
    metaTitle: 'Agentisk handel för Shopify-butiker | Scandicommerce',
    metaDescription: 'Så gör vi Shopify-butiker redo för ChatGPT, Gemini och Perplexity: agentkontroll, datamodell, produktdata och mätning. Med siffror från butikerna vi driver.',
  },
}

const DA: Content = {
  eyebrow: 'Agentisk handel',
  pageTitle: 'Agentisk handel: sådan gør vi Shopify-butikker klar til AI-agenter',
  definition:
    'Agentisk handel er, når AI-assistenter som ChatGPT, Gemini og Perplexity finder, sammenligner og køber produkter for kunden. Vi gør Shopify-butikker læsbare for agenterne: strukturerede produktdata, tydelige vilkår og en kasse, der kan gennemføres. Vi gør det i de butikker, vi driver, og vi måler, hvad det giver.',
  sections: [
    section('Hvad vi ser i de butikker, vi driver', 'numbers', [
      p('Vi måler trafik fra AI-agenter som en selvstændig kilde i de butikker, vi driver. Tallene dækker fem Shopify-butikker de seneste 90 dage, pr. 17. oktober 2026.'),
      stats([
        ['3.400', 'besøg fra ChatGPT'],
        ['2,2 %', 'konvertering på de besøg'],
        ['3 af 5', 'butikker, hvor ChatGPT-besøgende købte oftere end gennemsnittet'],
        ['< 0,2 %', 'af alle sessioner i dag'],
      ]),
      p('Det er lidt i dag. Men de besøgende kommer med et produkt, der allerede er anbefalet, og i tre af fem butikker købte de oftere end gennemsnittet. ChatGPT står for næsten det hele: Perplexity, Gemini og Copilot sendte tilsammen færre end 30 besøg.'),
      quote('»Agenterne læser ikke dit website, som kunden gør. De læser dataene. Agenter søger ikke, de læser. Sørg for, at I har noget, der er værd at læse.«', 'Øyvind Haagensen, CCO i Scandicommerce, på Handelskonferansen 2026'),
    ]),
    section('Sådan arbejder vi', 'how-we-work', [
      p('Fire trin. Det første tager to arbejdsdage, og resultatet er dit, uanset om du fortsætter med os.'),
      steps(true, [
        ['Agenttjek', 'Vi stiller ChatGPT, Gemini og Perplexity de spørgsmål, dine kunder faktisk stiller, og noterer, hvem der bliver anbefalet og hvorfor. Samtidig gennemgår vi kataloget, vilkårene og om butikken er koblet til Shopify Catalog.', '2 arbejdsdage'],
        ['Datamodel', 'Vi kortlægger produkttyperne og beslutter, hvilke attributter hver type har brug for: mål, materiale, GTIN, anvendelse. Skabelonerne laves pr. produkttype, ikke pr. produkt, så et katalog på 13.000 varer dækkes af 15 til 30 skabeloner.'],
        ['Gennemførelse', 'Titler, beskrivelser og attributter opdateres i bulk, direkte i Shopify. Svarene gemmes som metafelter, så nye produkter arver dem automatisk. Fragt, retur og garanti skrives, så en maskine kan læse dem, og kassen har ingen valg, agenten ikke kan træffe.'],
        ['Måling', 'Agenttrafik bliver en selvstændig kilde i din rapport, med sessioner, konvertering og ordrer pr. agent. Vi gennemgår tallene sammen hver måned og justerer, hvor det giver mest.'],
      ]),
    ]),
    section('Sådan fungerer et køb gennem en agent', 'ucp', [
      animation('Et køb gennem Universal Commerce Protocol (UCP), trin for trin.'),
      p('UCP er en åben standard, som Google og Shopify har udviklet sammen. Butikken offentliggør en fil, der fortæller agenten, hvad den understøtter: kasse, rabatter, levering og betalingsmetoder. Agenten åbner en kasse direkte hos butikken, kunden godkender, og ordren lander i Shopify som en almindelig ordre. Butikken er stadig sælger. ', { text: 'Læs Googles tekniske gennemgang', href: GOOGLE_DEV }, '.'),
    ]),
    section('Hvad der er live i Norden nu', 'status', [
      p('Meget af det, der skrives om agentisk handel, gælder USA. Sådan ser det ud for en nordisk Shopify-butik i oktober 2026:'),
      table(
        ['Flade', 'Status i Norden', 'Hvad det betyder for dig'],
        [
          ['ChatGPT', 'Live', 'Anbefaler produkter og sender kunden til din butik. Vi ser trafikken i dag.'],
          ['Shopify Catalog', 'Live', 'Gør dine produkter tilgængelige for agenterne, hvis dataene er komplette.'],
          ['Google Universal Cart', 'Kun USA', 'Lanceret 15. oktober 2026 i Søgning og Gemini, med kasse via UCP.'],
          ['Kasse via UCP i Google', 'Ikke endnu', 'Google har varslet Canada og Australien først, derefter Storbritannien.'],
        ],
      ),
      p('Derfor anbefaler vi at gøre arbejdet nu: de produktdata, agenterne har brug for, er de samme, der løfter Google, Shopping og søgningen i din egen butik. Når kassen via agenter kommer hertil, er butikken allerede klar. ', { text: 'Googles lancering af Universal Cart', href: GOOGLE_CART }, '.'),
    ]),
    section('Hvad du får', 'deliverables', [
      steps(false, [
        ['Agenttjek med prioriteret liste', 'Hvad agenterne svarer om din butik i dag, hvad der mangler, og hvad du bør rette først.', '2 arbejdsdage'],
        ['Datamodel og skabeloner', 'Produkttyper, attributter og skabeloner dokumenteret, så dit team selv kan oprette nye produkter korrekt.'],
        ['Opdaterede produktdata', 'Titler, beskrivelser, attributter og spørgsmål og svar skrevet direkte ind i Shopify.'],
        ['Vilkår og kasse uden blindgyder', 'Fragt, retur og garanti i et format, agenterne forstår, og en kasse de kan gennemføre.'],
        ['Månedlig agentrapport', 'Sessioner, konvertering og ordrer fra ChatGPT og andre agenter, side om side med resten af trafikken.'],
        ['Én kontakt, der kan Shopify', 'Vi er Shopify Plus-partner og driver de butikker, vi måler. Du taler med dem, der gør arbejdet.'],
      ]),
      p('Tjekket og gennemførelsen prissættes som et selvstændigt projekt efter omfang. Løbende optimering indgår i Enterprise-pakken.'),
    ]),
    section('Hvad det ikke er', 'expectations', [
      p('Det er ikke en ny webshop. Vi arbejder i den Shopify-butik, du allerede har, og du behøver ikke Shopify Plus.'),
      p('Det er ingen garanti for placering. Ingen kan love, at ChatGPT anbefaler netop dig. Vi kan sørge for, at agenterne har det, de skal bruge for at vælge dig, og måle om de gør det.'),
      p('Det er ikke stort endnu. Under 0,2 procent af sessionerne i de butikker, vi driver, kommer fra agenter i dag. Vi siger det lige ud, fordi det er grunden til at starte med data, der også virker i Google og i din egen butik.'),
    ]),
  ],
  faq: faq([
    ['Hvor meget trafik kommer fra AI-agenter i dag?', 'I fem Shopify-butikker, vi driver, kom omkring 3.400 besøg fra ChatGPT de seneste 90 dage, under 0,2 procent af alle sessioner. De konverterede på omkring 2,2 procent, og i tre af fem butikker bedre end gennemsnittet.'],
    ['Skal vi have Shopify Plus?', 'Nej. Shopify Catalog og agentkanalerne er tilgængelige for almindelige Shopify-butikker. Plus giver mere kontrol over kassen og markeder, men er ikke et krav for at blive fundet af agenter.'],
    ['Kan agenterne købe, uden at kunden godkender?', 'Nej. Kunden godkender købet i agenten, før ordren lægges. Du ser ordren i Shopify som normalt, mærket med hvor den kom fra.'],
    ['Hvad er UCP?', 'Universal Commerce Protocol er en åben standard fra Google og Shopify, der lader AI-agenter finde produkter og gennemføre køb direkte hos butikken. Butikken er stadig sælger og ejer kunderelationen.'],
    ['Hvad med B2B?', 'Agentisk handel starter i B2C, men B2B-indkøbere bruger de samme assistenter. Et ryddeligt katalog med de rigtige priser pr. kunde gør, at også Shopify B2B kan læses af agenter.'],
  ]),
  cta: {
    heading: 'Vil du vide, hvad agenterne siger om din butik?',
    text: 'Vi stiller ChatGPT, Gemini og Perplexity de spørgsmål, dine kunder stiller, og sender dig svarene og en prioriteret liste inden for to arbejdsdage.',
    buttonLabel: 'Book et agenttjek',
    buttonHref: '/contact',
  },
  seoExtended: {
    metaTitle: 'Agentisk handel for Shopify-butikker | Scandicommerce',
    metaDescription: 'Sådan gør vi Shopify-butikker klar til ChatGPT, Gemini og Perplexity: agenttjek, datamodel, produktdata og måling. Med tal fra de butikker, vi driver.',
  },
}

const DE: Content = {
  eyebrow: 'Agentic Commerce',
  pageTitle: 'Agentic Commerce: So machen wir Shopify-Shops bereit für KI-Agenten',
  definition:
    'Agentic Commerce bedeutet, dass KI-Assistenten wie ChatGPT, Gemini und Perplexity Produkte für Kunden finden, vergleichen und kaufen. Wir machen Shopify-Shops für diese Agenten lesbar: strukturierte Produktdaten, klare Richtlinien und einen Checkout, den sie abschließen können. Wir tun das in den Shops, die wir betreuen, und messen, was es bringt.',
  sections: [
    section('Was wir in den Shops sehen, die wir betreuen', 'numbers', [
      p('Wir messen Traffic von KI-Agenten als eigene Quelle in den Shops, die wir betreuen. Die Zahlen stammen aus fünf Shopify-Shops der letzten 90 Tage, Stand 17. Oktober 2026.'),
      stats([
        ['3.400', 'Besuche von ChatGPT'],
        ['2,2 %', 'Conversion dieser Besuche'],
        ['3 von 5', 'Shops, in denen ChatGPT-Besucher häufiger kauften als der Durchschnitt'],
        ['< 0,2 %', 'aller Sitzungen heute'],
      ]),
      p('Das ist heute wenig. Aber diese Besucher kommen mit einem bereits empfohlenen Produkt, und in drei von fünf Shops kauften sie häufiger als der Durchschnitt. ChatGPT macht fast alles aus: Perplexity, Gemini und Copilot schickten zusammen weniger als 30 Besuche.'),
      quote('„Agenten lesen Ihre Website nicht so wie Kunden. Sie lesen die Daten. Agenten suchen nicht, sie lesen. Sorgen Sie dafür, dass es etwas Lesenswertes gibt.“', 'Øyvind Haagensen, CCO bei Scandicommerce, auf der Handelskonferansen 2026'),
    ]),
    section('So arbeiten wir', 'how-we-work', [
      p('Vier Schritte. Der erste dauert zwei Arbeitstage, und das Ergebnis gehört Ihnen, auch wenn Sie danach nicht mit uns weitermachen.'),
      steps(true, [
        ['Agenten-Check', 'Wir stellen ChatGPT, Gemini und Perplexity die Fragen, die Ihre Kunden tatsächlich stellen, und notieren, wer empfohlen wird und warum. Dazu prüfen wir Katalog, Richtlinien und ob der Shop mit Shopify Catalog verbunden ist.', '2 Arbeitstage'],
        ['Datenmodell', 'Wir erfassen Ihre Produkttypen und legen fest, welche Attribute jeder Typ braucht: Maße, Material, GTIN, Einsatzzweck. Vorlagen entstehen pro Produkttyp, nicht pro Produkt, sodass ein Katalog mit 13.000 Artikeln mit 15 bis 30 Vorlagen abgedeckt ist.'],
        ['Umsetzung', 'Titel, Beschreibungen und Attribute werden gesammelt direkt in Shopify aktualisiert. Antworten werden als Metafelder gespeichert, sodass neue Produkte sie automatisch übernehmen. Versand, Rückgabe und Garantie werden maschinenlesbar formuliert, und der Checkout enthält keine Entscheidung, die ein Agent nicht treffen kann.'],
        ['Messung', 'Agenten-Traffic wird eine eigene Quelle in Ihrem Reporting, mit Sitzungen, Conversion und Bestellungen pro Agent. Wir gehen die Zahlen jeden Monat gemeinsam durch und justieren dort, wo es am meisten bringt.'],
      ]),
    ]),
    section('So funktioniert ein Kauf über einen Agenten', 'ucp', [
      animation('Ein Kauf über das Universal Commerce Protocol (UCP), Schritt für Schritt.'),
      p('UCP ist ein offener Standard, den Google und Shopify gemeinsam entwickelt haben. Der Shop veröffentlicht eine Datei, die dem Agenten sagt, was er unterstützt: Checkout, Rabatte, Versand und Zahlungsarten. Der Agent eröffnet einen Checkout direkt beim Shop, die Kundin bestätigt, und die Bestellung landet als normale Bestellung in Shopify. Der Shop bleibt Verkäufer. ', { text: 'Zur technischen Erklärung von Google', href: GOOGLE_DEV }, '.'),
    ]),
    section('Was in Nordeuropa heute live ist', 'status', [
      p('Vieles, was über Agentic Commerce geschrieben wird, gilt für die USA. So sieht es für einen nordischen Shopify-Shop im Oktober 2026 aus:'),
      table(
        ['Plattform', 'Status in Nordeuropa', 'Was das für Sie bedeutet'],
        [
          ['ChatGPT', 'Live', 'Empfiehlt Produkte und schickt Kunden in Ihren Shop. Wir sehen diesen Traffic heute.'],
          ['Shopify Catalog', 'Live', 'Macht Ihre Produkte für Agenten verfügbar, wenn die Daten vollständig sind.'],
          ['Google Universal Cart', 'Nur USA', 'Am 15. Oktober 2026 in der Suche und in Gemini gestartet, mit Checkout über UCP.'],
          ['UCP-Checkout bei Google', 'Noch nicht', 'Google hat zuerst Kanada und Australien angekündigt, danach Großbritannien.'],
        ],
      ),
      p('Deshalb empfehlen wir, jetzt anzufangen: Die Produktdaten, die Agenten brauchen, sind dieselben, die Google, Shopping und die Suche im eigenen Shop verbessern. Wenn der Agenten-Checkout hier ankommt, ist Ihr Shop bereit. ', { text: 'Googles Ankündigung von Universal Cart', href: GOOGLE_CART }, '.'),
    ]),
    section('Was Sie bekommen', 'deliverables', [
      steps(false, [
        ['Agenten-Check mit Prioritätenliste', 'Was Agenten heute über Ihren Shop sagen, was fehlt und was Sie zuerst beheben sollten.', '2 Arbeitstage'],
        ['Datenmodell und Vorlagen', 'Produkttypen, Attribute und Vorlagen dokumentiert, damit Ihr Team neue Produkte selbst richtig anlegen kann.'],
        ['Aktualisierte Produktdaten', 'Titel, Beschreibungen, Attribute sowie Fragen und Antworten direkt in Shopify.'],
        ['Richtlinien und Checkout ohne Sackgassen', 'Versand, Rückgabe und Garantie in einem Format, das Agenten verstehen, und ein Checkout, den sie abschließen können.'],
        ['Monatlicher Agenten-Report', 'Sitzungen, Conversion und Bestellungen von ChatGPT und anderen Agenten, neben dem übrigen Traffic.'],
        ['Ein Ansprechpartner, der Shopify kennt', 'Wir sind Shopify Plus Partner und betreuen die Shops, die wir messen. Sie sprechen mit den Leuten, die die Arbeit machen.'],
      ]),
      p('Check und Umsetzung werden als eigenes Projekt nach Umfang bepreist. Laufende Optimierung ist im Enterprise-Paket enthalten.'),
    ]),
    section('Was es nicht ist', 'expectations', [
      p('Es ist kein neuer Shop. Wir arbeiten in Ihrem bestehenden Shopify-Shop, und Sie brauchen kein Shopify Plus.'),
      p('Es ist keine Ranking-Garantie. Niemand kann versprechen, dass ChatGPT genau Sie empfiehlt. Wir sorgen dafür, dass Agenten alles haben, um Sie zu wählen, und messen, ob sie es tun.'),
      p('Es ist noch nicht groß. Weniger als 0,2 Prozent der Sitzungen in den Shops, die wir betreuen, kommen heute von Agenten. Wir sagen das offen, weil genau das der Grund ist, mit Daten zu beginnen, die auch bei Google und im eigenen Shop wirken.'),
    ]),
  ],
  faq: faq([
    ['Wie viel Traffic kommt heute von KI-Agenten?', 'In fünf Shopify-Shops, die wir betreuen, kamen in den letzten 90 Tagen rund 3.400 Besuche von ChatGPT, weniger als 0,2 Prozent aller Sitzungen. Sie konvertierten mit rund 2,2 Prozent, in drei von fünf Shops besser als der Durchschnitt.'],
    ['Brauchen wir Shopify Plus?', 'Nein. Shopify Catalog und die Agenten-Kanäle stehen auch normalen Shopify-Shops zur Verfügung. Plus bietet mehr Kontrolle über Checkout und Märkte, ist aber keine Voraussetzung, um von Agenten gefunden zu werden.'],
    ['Können Agenten ohne Zustimmung der Kunden kaufen?', 'Nein. Die Kundin bestätigt den Kauf im Agenten, bevor die Bestellung aufgegeben wird. Sie sehen die Bestellung wie gewohnt in Shopify, mit Angabe der Herkunft.'],
    ['Was ist UCP?', 'Das Universal Commerce Protocol ist ein offener Standard von Google und Shopify, mit dem KI-Agenten Produkte finden und Käufe direkt beim Shop abschließen. Der Shop bleibt Verkäufer und behält die Kundenbeziehung.'],
    ['Was ist mit B2B?', 'Agentic Commerce beginnt im B2C, aber B2B-Einkäufer nutzen dieselben Assistenten. Ein sauberer Katalog mit den richtigen Preisen pro Kunde macht auch Shopify B2B für Agenten lesbar.'],
  ]),
  cta: {
    heading: 'Wollen Sie wissen, was Agenten über Ihren Shop sagen?',
    text: 'Wir stellen ChatGPT, Gemini und Perplexity die Fragen Ihrer Kunden und schicken Ihnen die Antworten und eine Prioritätenliste innerhalb von zwei Arbeitstagen.',
    buttonLabel: 'Agenten-Check buchen',
    buttonHref: '/contact',
  },
  seoExtended: {
    metaTitle: 'Agentic Commerce für Shopify-Shops | Scandicommerce',
    metaDescription: 'So machen wir Shopify-Shops bereit für ChatGPT, Gemini und Perplexity: Agenten-Check, Datenmodell, Produktdaten und Messung. Mit Zahlen aus den Shops, die wir betreuen.',
  },
}

const BY_LANG: Record<string, Content> = { no: NO, en: EN, sv: SV, da: DA, de: DE }
const PARTNER_EYEBROW: Record<string, string> = { no: 'Partnere', en: 'Partners', sv: 'Partner', da: 'Partnere', de: 'Partner' }

async function main() {
  for (const [lang, content] of Object.entries(BY_LANG)) {
    const id = `pillar-agentisk-handel-${lang}`
    const existing = await client.getDocument(id)
    if (!existing) throw new Error(`Missing ${id}`)
    const words = String(content.definition).split(/\s+/).length
    if (words < 35 || words > 70) throw new Error(`${id}: definition is ${words} words`)
    const { seoExtended, ...rest } = content
    await client
      .patch(id)
      .set({ ...rest, schemaType: 'Service', 'seoExtended.metaTitle': (seoExtended as Record<string, string>).metaTitle, 'seoExtended.metaDescription': (seoExtended as Record<string, string>).metaDescription })
      .unset(['intro'])
      .commit()
    console.log(`${dataset}: ${id} updated (${(content.sections as unknown[]).length} sections, definition ${words} words)`)

    const partnerId = `pillar-bli-partner-${lang}`
    if (await client.getDocument(partnerId)) {
      await client.patch(partnerId).set({ eyebrow: PARTNER_EYEBROW[lang] }).commit()
      console.log(`${dataset}: ${partnerId} eyebrow set`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
