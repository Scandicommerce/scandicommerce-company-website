/**
 * Seeds the "AI agent shopping" article as a `post` (page builder) in EN + NO,
 * using the rich content blocks, a video hero, Chris as author, and an i18n link.
 * Run: NEXT_PUBLIC_SANITY_PROJECT_ID=fk1tt27l NEXT_PUBLIC_SANITY_DATASET=<ds> \
 *      npx sanity exec scripts/seed-agent-post.mjs --with-user-token
 */
import sanityCli from "sanity/cli";
const getCliClient = sanityCli.getCliClient ?? sanityCli.default?.getCliClient;
import { createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DATASET = process.env.SEED_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "development";
const client = getCliClient({ apiVersion: "2024-01-01", dataset: DATASET });
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let n = 0;
const key = () => `k${(n++).toString(36)}${Date.now().toString(36).slice(-2)}`;
const span = (text) => ({ _type: "span", _key: key(), text, marks: [] });
const block = (text, style = "normal") => ({ _type: "block", _key: key(), style, markDefs: [], children: [span(text)] });
const bullet = (text) => ({ _type: "block", _key: key(), style: "normal", listItem: "bullet", level: 1, markDefs: [], children: [span(text)] });
const paras = (t) => t.trim().split(/\n+/).map((p) => block(p));
const rich = (blocks) => ({ _type: "richTextBlock", _key: key(), body: blocks });
const text = (t) => rich(paras(t));
const gtitle = (title, highlightPrefix) => ({ _type: "gradientTitleBlock", _key: key(), title, highlightPrefix });
const divider = () => ({ _type: "dividerBlock", _key: key(), spacing: "medium" });
const stats = (items) => ({ _type: "statsRowBlock", _key: key(), stats: items.map(([value, label]) => ({ _key: key(), value, label })) });
const compare = (lt, lb, rt, rb) => ({ _type: "comparisonCardsBlock", _key: key(), leftCard: { title: lt, body: paras(lb) }, rightCard: { title: rt, body: paras(rb) } });
const callout = (variant, title, content) => ({ _type: "calloutBlock", _key: key(), variant, title, content });
const takeaways = (blocks) => ({ _type: "keyTakeawaysBlock", _key: key(), content: blocks });
const faq = (title, items) => ({ _type: "faqBlock", _key: key(), title, items: items.map(([question, answer]) => ({ _key: key(), question, answer })) });
const cta = (heading, body, label, url) => ({ _type: "ctaBlock", _key: key(), heading, body: paras(body), buttons: [{ _key: key(), label, url, variant: "primary" }] });
const prosCons = (prosTitle, pros, consTitle, cons) => ({ _type: "prosConsBlock", _key: key(), prosTitle, pros, consTitle, cons });

async function main() {
  let posterRef = null;
  try {
    const asset = await client.assets.upload("image", createReadStream(join(ROOT, "public/videos/ucp-agent-demo-poster.jpg")), { filename: "ucp-agent-demo-poster.jpg" });
    posterRef = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    console.log("poster uploaded:", asset._id);
  } catch (e) { console.log("poster skipped:", e.message); }

  // Upload the compressed hero video as a Sanity file asset → served from CDN
  // (keeps the repo lean; same URL works in every dataset/environment).
  let videoUrl = "/videos/ucp-agent-demo-web.mp4";
  try {
    const v = await client.assets.upload("file", createReadStream(join(ROOT, "public/videos/ucp-agent-demo-web.mp4")), { filename: "ucp-agent-demo-web.mp4", contentType: "video/mp4" });
    videoUrl = v.url;
    console.log("video uploaded:", v.url);
  } catch (e) { console.log("video upload failed, falling back to /public:", e.message); }

  await client.createOrReplace({ _id: "author-chris-jensen", _type: "author", name: "Chris Jensen", role: "Scandicommerce", slug: { _type: "slug", current: "chris-jensen" } });
  const authorRef = { _type: "reference", _ref: "author-chris-jensen" };
  const video = (caption) => ({ _type: "videoBlock", _key: key(), url: videoUrl, autoplay: true, caption, ...(posterRef ? { poster: posterRef } : {}) });

  const en = {
    _id: "post-agent-demo-en", _type: "post", language: "en", author: authorRef,
    title: "We watched an AI agent shop across hundreds of thousands of stores — here's what it actually reads",
    slug: { _type: "slug", current: "ai-agent-shopping-what-it-reads" },
    excerpt: "We pointed a real AI shopping agent at Shopify's Global Catalog with a vague, human request. It searched the whole market at once, ranked on relevance, and built a checkout — reading only a narrow slice of each product. Here's what that slice is, and what it means for your store.",
    publishedAt: "2026-07-27T09:00:00Z",
    tags: [{ _key: key(), label: "Agentic commerce", isPrimary: true }, { _key: key(), label: "UCP" }, { _key: key(), label: "Shopify" }],
    content: [
      video("A real agent shopping the Global Catalog — captured as data, then rendered."),
      text("We gave an AI agent a deliberately vague request — “find me something warm to wear indoors, real wool, not synthetic, Norwegian if you can” — and watched it shop.\nIt didn't open a browser. It didn't visit a store. In a few seconds it queried Shopify's Global Catalog, weighed hundreds of results from merchants it had never been told about, applied a constraint we only implied — Norwegian-made — and returned a 100% traceable merino half-zip from a Norwegian brand, priced better and matched more precisely than the same search typed into Google. Then it built a cart and generated a checkout link, ready to pay.\nThe surprising part wasn't that it worked. It was how little of each product the agent actually looked at to get there — and what that means for every merchant whose products it will read next."),
      divider(),
      gtitle("It isn't a search engine. It's a catalog it queries directly.", "It isn't a search engine."),
      text("The instinct is to picture a smarter Google: the agent “searches the web,” lands on product pages, and reads them like a person would. That's not what happens. Shopify exposes a Global Catalog at a single endpoint. One query reaches across every merchant that participates and comes back ranked by relevance. The agent never crawls store to store — it asks once, and the catalog does the matching on its side. What comes back isn't a page of blue links; it's structured product data the agent reasons over directly."),
      compare("A shopper", "Visits a handful of stores they already know, one tab at a time. Who ranks is decided by ads, SEO and brand recognition.", "An agent", "Queries the entire network in one call and lets relevance decide. A small Norwegian brand and a global giant are judged on the same fields, in the same pass."),
      stats([["1", "query reaches the whole network"], ["100M+", "listings ranked by relevance"], ["5", "product fields actually read"], ["0", "pages crawled"]]),
      callout("info", "Two catalogs, two jobs", "The Global Catalog is cross-merchant and built for discovery. The Storefront Catalog is the same protocol scoped to one store, used for cart and checkout. Discovery happens across everyone; the purchase happens at one merchant. Understanding which is which is the difference between being found and being bought."),
      divider(),
      gtitle("The four stages, plainly", "The four stages"),
      text("Every agent interaction over the Universal Commerce Protocol moves through four clean, permissioned stages. Read top to bottom, it's roughly what a careful human shopper does — the difference is a machine doing it at the scale of the whole catalog, reading structured data instead of rendered pages."),
      takeaways([
        block("The flow, in four steps", "h3"),
        bullet("Authenticate — the agent presents a profile and is granted a trust tier: what it's allowed to do on your store."),
        bullet("Discover — it queries the Global Catalog and evaluates ranked candidates. This is where relevance matching happens."),
        bullet("Cart & checkout — it scopes to the chosen store, builds a cart and creates a checkout. Payment stays with the human."),
        bullet("Monitor orders — it can track confirmation, fulfilment and delivery, so the relationship continues past checkout."),
      ]),
      callout("tldr", "Trust tiers are your control", "Before an agent does anything, it's granted a trust tier — you decide whether it may only discover, or also build a cart and create a checkout on a customer's behalf. Decide that posture deliberately, now, before the traffic arrives."),
      divider(),
      gtitle("What this means for your product data", "What this means"),
      text("Watching the agent discover and choose, it read a narrow, consistent slice of each product. Those few fields carried the entire decision. Everything else in the payload — and there is a lot of it — sat unread while the match was made."),
      takeaways([
        block("The slice the agent actually read", "h3"),
        bullet("title — what the thing is"),
        bullet("tags — structured signals to match against the request"),
        bullet("description — material, origin, weight, use case"),
        bullet("images — confirm the category"),
        bullet("variants — whether the size and colour the shopper needed even exist"),
      ]),
      text("The fields you may treat as an afterthought are the ones the agent leans on hardest. A title padded for a human skimming a collection page (“NEW ✨ Bestseller — Cozy Winter Knit”) reads as noise to an agent matching “warm wool, made in Norway.” A description that leads with brand story instead of material and origin gives it less to match on. Tags that are internal shorthand leave you invisible to the query that should have found you. There's a specific opportunity for fashion and apparel here: aggregating your product data — consistent material and origin fields, structured variants, tags that describe fit and use — is what makes an agent confident enough to surface you over a bigger competitor whose data is messier. Clean, complete, honest product data isn't hygiene; it's distribution."),
      callout("warning", "One honest caveat about metafields", "We observed which fields drove the match in this session — we did not get a guarantee of exactly what every agent reads, and the protocol will evolve. In particular, don't assume metafields and custom attributes are read for matching today; they may not be. Put the truth about your product in the core fields the agent is definitely looking at, not in custom fields it may never see."),
      divider(),
      gtitle("What's coming: the Universal Cart", "What's coming"),
      text("Today an agent that finds products across many merchants still checks out at each one separately — one cart, one merchant, one payment. That boundary is moving. Shopify's Universal Cart — cross-merchant baskets that let an agent assemble items from different stores and check out once — is in early access now. This isn't a prediction; it's a capability being rolled out. When one basket can span merchants, the friction that keeps an agent loyal to one store disappears, and discovery-by-relevance extends all the way through to payment. When the cart no longer belongs to one store, being the best-matched product for your slice of the request is the whole game."),
      divider(),
      gtitle("What to do in the next 90 days", "What to do"),
      prosCons(
        "Do this",
        ["Audit your top 20 products reading only title, tags, description, images and variants", "Write descriptions as plain facts: material, origin, weight, use case", "Make every size and colour a real variant, not text", "Rewrite tags to the words a shopper would actually say", "Decide your trust-tier posture before the traffic arrives"],
        "Avoid this",
        ["Titles padded with campaign noise and emojis", "Descriptions that lead with brand story instead of facts", "Burying sizes and colours in body copy", "Relying on metafields an agent may never read"]
      ),
      faq("Questions merchants ask us", [
        ["Is my store already discoverable by agents?", "If you sell on Shopify, you're very likely in the Global Catalog by default. The question isn't whether an agent can find you — it's whether your product data gives it a reason to choose you."],
        ["Does an agent read my metafields?", "Don't count on it. We saw the core fields — title, tags, description, images, variants — drive the match. Put the information a buyer needs in those, not in custom fields an agent may never see."],
        ["What's the difference between the Global and Storefront Catalog?", "The Global Catalog is cross-merchant and used for discovery across the whole network. The Storefront Catalog is scoped to a single store and used for cart and checkout once the agent has chosen where to buy."],
        ["What should I fix first?", "Your best sellers and highest-margin lines. Clean titles, honest descriptions, complete variants and shopper-language tags — in that order."],
      ]),
      cta("Want your catalog ready for agent-led shopping?", "We help Nordic Shopify merchants get their product data clean, complete and discoverable — the work that decides whether an agent surfaces you or a competitor. Let's look at your catalog together.", "Talk to Scandicommerce", "https://www.scandicommerce.no/en/contact"),
    ],
  };

  const no = {
    _id: "post-agent-demo-no", _type: "post", language: "no", author: authorRef,
    title: "Vi lot en AI-agent handle på tvers av hundretusenvis av butikker — her er hva den faktisk leser",
    slug: { _type: "slug", current: "ai-agent-handel-hva-den-leser" },
    excerpt: "Vi ga en ekte AI-handleagent en vag, menneskelig forespørsel og pekte den mot Shopifys globale katalog. Den søkte i hele markedet på én gang, rangerte etter relevans og bygde en kasse — men leste bare et smalt utsnitt av hvert produkt. Her er hva det utsnittet er, og hva det betyr for butikken din.",
    publishedAt: "2026-07-27T09:00:00Z",
    tags: [{ _key: key(), label: "Agentisk handel", isPrimary: true }, { _key: key(), label: "UCP" }, { _key: key(), label: "Shopify" }],
    content: [
      video("En ekte agent som handler i den globale katalogen — fanget som data, deretter rendret."),
      text("Vi ga en AI-agent en bevisst vag forespørsel — «finn noe varmt å ha på inne, ekte ull, ikke syntetisk, norsk hvis du kan» — og så på mens den handlet.\nDen åpnet ingen nettleser. Den besøkte ingen butikk. På noen få sekunder søkte den i Shopifys globale katalog, veide hundrevis av resultater fra forhandlere den aldri hadde fått vite om, brukte et krav vi bare antydet — norskprodusert — og returnerte en 100 % sporbar merino half-zip fra et norsk merke, bedre priset og mer presist matchet enn det samme søket i Google. Deretter bygde den en handlekurv og genererte en kasselenke, klar til å betale.\nDet overraskende var ikke at det fungerte. Det var hvor lite av hvert produkt agenten faktisk så på — og hva det betyr for enhver forhandler hvis produkter den leser neste gang."),
      divider(),
      gtitle("Det er ikke en søkemotor. Det er en katalog den spør direkte.", "Det er ikke en søkemotor."),
      text("Instinktet er å se for seg et smartere Google: agenten «søker på nettet», havner på produktsider og leser dem slik et menneske ville. Det er ikke det som skjer. Shopify eksponerer en global katalog på ett enkelt endepunkt. Ett søk når ut til alle forhandlere som deltar, og kommer tilbake rangert etter relevans. Agenten kryper aldri fra butikk til butikk — den spør én gang, og katalogen gjør matchingen på sin side. Det som kommer tilbake er ikke en side med blå lenker; det er strukturerte produktdata agenten resonnerer over direkte."),
      compare("En kunde", "Besøker en håndfull butikker de allerede kjenner, én fane om gangen. Hvem som rangerer avgjøres av annonser, SEO og merkevarekjennskap.", "En agent", "Søker i hele nettverket i ett kall og lar relevans avgjøre. Et lite norsk merke og en global gigant vurderes på de samme feltene, i samme runde."),
      stats([["1", "søk når hele nettverket"], ["100M+", "oppføringer rangert etter relevans"], ["5", "produktfelter som faktisk leses"], ["0", "sider crawlet"]]),
      callout("info", "To kataloger, to jobber", "Den globale katalogen er på tvers av forhandlere og bygget for oppdagelse. Storefront-katalogen er samme protokoll avgrenset til én butikk, brukt for handlekurv og kasse. Oppdagelse skjer på tvers av alle; kjøpet skjer hos én forhandler. Å forstå forskjellen er forskjellen på å bli funnet og å bli kjøpt."),
      divider(),
      gtitle("De fire stadiene, enkelt forklart", "De fire stadiene"),
      text("Enhver agentinteraksjon over Universal Commerce Protocol beveger seg gjennom fire rene, tillatelsesstyrte stadier. Lest ovenfra og ned er det omtrent det en påpasselig kunde gjør — forskjellen er at en maskin gjør det i hele katalogens skala, og leser strukturerte data i stedet for gjengitte sider."),
      takeaways([
        block("Flyten, i fire steg", "h3"),
        bullet("Autentisering — agenten presenterer en profil og får tildelt et tillitsnivå: hva den får lov til å gjøre i butikken din."),
        bullet("Oppdagelse — den søker i den globale katalogen og vurderer rangerte kandidater. Her skjer relevansmatchingen."),
        bullet("Handlekurv og kasse — den avgrenser til valgt butikk, bygger en handlekurv og oppretter en kasse. Betaling forblir hos mennesket."),
        bullet("Ordreoppfølging — den kan følge bekreftelse, plukk og levering, slik at forholdet fortsetter forbi kassen."),
      ]),
      callout("tldr", "Tillitsnivåer er din kontroll", "Før en agent gjør noe, får den tildelt et tillitsnivå — du bestemmer om den kun får oppdage, eller også bygge handlekurv og opprette kasse på vegne av en kunde. Bestem den holdningen bevisst nå, før trafikken kommer."),
      divider(),
      gtitle("Hva dette betyr for produktdataene dine", "Hva dette betyr"),
      text("Mens vi så agenten oppdage og velge, leste den et smalt, konsekvent utsnitt av hvert produkt. Disse få feltene bar hele beslutningen. Alt annet i datapakken — og det er mye — lå ulest mens matchen ble gjort."),
      takeaways([
        block("Utsnittet agenten faktisk leste", "h3"),
        bullet("tittel — hva tingen er"),
        bullet("tagger — strukturerte signaler å matche mot forespørselen"),
        bullet("beskrivelse — materiale, opprinnelse, vekt, bruksområde"),
        bullet("bilder — bekrefter kategorien"),
        bullet("varianter — om størrelsen og fargen kunden trengte i det hele tatt finnes"),
      ]),
      text("Feltene du kanskje behandler som en ettertanke, er de agenten lener seg tyngst på. En tittel polstret for et menneske («NY ✨ Bestselger — Koselig vintergenser») leses som støy av en agent som matcher «varm ull, laget i Norge». En beskrivelse som starter med merkevarehistorie i stedet for materiale og opprinnelse gir mindre å matche på. Tagger som er intern sjargong gjør deg usynlig for spørringen som burde ha funnet deg. Her er en spesifikk mulighet for mote og klær: å samle og standardisere produktdataene dine — konsekvente felt for materiale og opprinnelse, strukturerte varianter, tagger som beskriver passform og bruk — er det som gjør en agent trygg nok til å løfte deg frem foran en større konkurrent med rotete data. Rene, komplette og ærlige produktdata er ikke hygiene; det er distribusjon."),
      callout("warning", "Ett ærlig forbehold om metafelter", "Vi observerte hvilke felter som drev matchen i denne økten — vi fikk ingen garanti for nøyaktig hva enhver agent leser, og protokollen vil utvikle seg. Spesielt: ikke anta at metafelter og egendefinerte attributter leses for matching i dag; det gjør de kanskje ikke. Legg sannheten om produktet ditt i kjernefeltene agenten helt sikkert ser på, ikke i egendefinerte felter den kanskje aldri ser."),
      divider(),
      gtitle("Det som kommer: Universal Cart", "Det som kommer"),
      text("I dag må en agent som finner produkter hos mange forhandlere fortsatt gå til kassen hos hver av dem separat — én handlekurv, én forhandler, én betaling. Den grensen er i ferd med å flytte seg. Shopifys Universal Cart — handlekurver på tvers av forhandlere som lar en agent sette sammen varer fra ulike butikker og betale én gang — er i tidlig tilgang nå. Dette er ikke en spådom; det er en funksjon som rulles ut. Når én handlekurv kan strekke seg over flere forhandlere, forsvinner friksjonen som holder en agent lojal til én butikk, og relevansbasert oppdagelse strekker seg helt frem til betaling. Når handlekurven ikke lenger tilhører én butikk, er det å være det best matchede produktet for din del av forespørselen hele spillet."),
      divider(),
      gtitle("Hva du bør gjøre de neste 90 dagene", "Hva du bør gjøre"),
      prosCons(
        "Gjør dette",
        ["Revider de 20 øverste produktene dine, les bare tittel, tagger, beskrivelse, bilder og varianter", "Skriv beskrivelser som rene fakta: materiale, opprinnelse, vekt, bruksområde", "Gjør hver størrelse og farge til en ekte variant, ikke tekst", "Skriv om tagger til ordene en kunde faktisk ville sagt", "Bestem tillitsnivå-holdningen din før trafikken kommer"],
        "Unngå dette",
        ["Titler polstret med kampanjestøy og emojier", "Beskrivelser som starter med merkevarehistorie i stedet for fakta", "Å gjemme størrelser og farger i brødteksten", "Å stole på metafelter en agent kanskje aldri leser"]
      ),
      faq("Spørsmål forhandlere stiller oss", [
        ["Er butikken min allerede synlig for agenter?", "Selger du på Shopify, er du sannsynligvis i den globale katalogen som standard. Spørsmålet er ikke om en agent kan finne deg — men om produktdataene dine gir den en grunn til å velge deg."],
        ["Leser en agent metafeltene mine?", "Ikke regn med det. Vi så kjernefeltene — tittel, tagger, beskrivelse, bilder, varianter — drive matchen. Legg informasjonen en kjøper trenger i disse, ikke i egendefinerte felter en agent kanskje aldri ser."],
        ["Hva er forskjellen på den globale katalogen og Storefront-katalogen?", "Den globale katalogen er på tvers av forhandlere og brukes til oppdagelse i hele nettverket. Storefront-katalogen er avgrenset til én butikk og brukes til handlekurv og kasse når agenten har valgt hvor den skal kjøpe."],
        ["Hva bør jeg fikse først?", "Bestselgerne og linjene med høyest margin. Rene titler, ærlige beskrivelser, komplette varianter og tagger på kundens språk — i den rekkefølgen."],
      ]),
      cta("Vil du gjøre katalogen din klar for agentdrevet handel?", "Vi hjelper nordiske Shopify-forhandlere med å få produktdataene rene, komplette og synlige — arbeidet som avgjør om en agent løfter deg frem eller en konkurrent. La oss se på katalogen din sammen.", "Snakk med Scandicommerce", "https://www.scandicommerce.no/no/kontakt"),
    ],
  };

  await client.createOrReplace(en);
  await client.createOrReplace(no);
  await client.createOrReplace({
    _id: "transmeta-agent-demo", _type: "translation.metadata", schemaTypes: ["post"],
    translations: [{ _key: "en", value: { _type: "reference", _ref: en._id } }, { _key: "no", value: { _type: "reference", _ref: no._id } }],
  });
  console.log(`DONE (${DATASET}). /en/resources/${en.slug.current}  |  /no/resources/${no.slug.current}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
