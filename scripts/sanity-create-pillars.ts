// TARGET_DATASET=production npx sanity exec scripts/sanity-create-pillars.ts --with-user-token
// Creates the "Agentisk handel" and "Bli partner" pillar pages (no, en, sv, da, de) with
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
  // sv / da / de: relatedPages are resolved per language from the dataset (relatedTypes), not hardcoded ids.
  {
    id: 'pillar-agentisk-handel-sv', language: 'sv', slug: 'agentisk-handel', pageTitle: 'Agentisk handel: gör din Shopify-butik redo för AI-agenter',
    definition: 'Agentisk handel är köp som sker via AI-agenter: ChatGPT, Perplexity, Google och Shopifys egna agentytor hittar, jämför och beställer produkter för kundens räkning. Butiken måste vara läsbar för agenter, produktdatan måste vara komplett och strukturerad, och kassan måste kunna slutföras utan en människa vid skärmen. Vi gör din Shopify-butik redo för det.',
    sections: [
      section('Vad som händer nu', 'nu', ['AI-assistenter har gått från att svara på frågor till att handla. ChatGPT, Perplexity och Google visar produkter, jämför pris och tillgänglighet och skickar kunden direkt till kassan, eller slutför köpet själva. Shopify kopplar din katalog till dessa agenter genom Shopify Catalog och det öppna protokollet för agentisk handel.', 'Det innebär att en växande andel av trafiken aldrig ser din startsida. Agenten läser produktdata, policyer och lagerstatus och väljer för kundens räkning. Butiker med ordnad data blir rekommenderade. Butiker med luckor hoppas över.']),
      section('Så hittas butiken av agenter', 'hittas', ['Agenter läser strukturerad data, inte banners. Kompletta produktattribut, tydliga varianter, rätt kategorier, GTIN, mått och vikt, lagerstatus och leveranstid avgör om produkten dyker upp. Shopify skickar detta vidare genom Shopify Catalog, förutsatt att datan finns och är korrekt.', 'Policyer väger lika tungt. Frakt, retur och garanti måste vara skrivna så att en maskin förstår dem. Ett "kontakta oss för frakt" är ett nej från agenten.']),
      section('Produktdata är det nya SEO', 'produktdata', ['Där SEO handlade om text och länkar handlar agentisk synlighet om data. Vi går igenom katalogen, hittar luckorna och sätter upp en datamodell som håller: vad som ska ligga i Shopify, vad som ska styras från PIM och hur nya produkter får rätt attribut från dag ett.', 'För butiker med många varianter eller flera kanaler sätter vi upp PIM, till exempel Feed eller Vuuh, så att Shopify, Google och agenterna får samma sanning.']),
      section('Kassa utan en människa vid skärmen', 'kassa', ['Agentisk kassa innebär att köpet kan slutföras av agenten med kundens godkännande. Shopify Checkout och Shop Pay stöder detta, och betalning via Klarna, Swish eller kort fungerar som tidigare. Vi ser till att rabattregler, fraktregler och leveransval är entydiga, så att köpet inte stannar på ett val agenten inte kan göra.']),
      section('Vad vi levererar', 'leverans', ['En agentredo-kontroll av butiken: produktdata, policyer, Shopify Catalog-status och kassa, med en prioriterad lista över vad som måste åtgärdas. Därefter genomförandet: datamodell, PIM-uppsättning där det behövs, strukturerade policyer och mätning av agentdrivna ordrar.', 'Löpande optimering för agentisk AI ingår i Enterprise-paketet. För övriga levereras det som ett eget projekt till fast pris.']),
      section('Så mäter vi det', 'matning', ['Agentdrivna ordrar märks i Shopify med källa och agent, så att du ser vad ChatGPT, Perplexity och Google faktiskt skickar. Vi använder Tracklution och Shopifys egna rapporter och sätter upp en enkel rapport du kan följa månadsvis.']),
    ],
    faq: [
      faq('Måste vi ha Shopify Plus?', 'Nej. Shopify Catalog och agentisk kassa finns för vanliga Shopify-butiker. Plus ger mer kontroll över kassan och fler marknader, men är inget krav för att hittas av agenter.'),
      faq('Kan agenterna köpa utan att kunden godkänner?', 'Nej. Kunden godkänner köpet i agenten innan ordern läggs. Du ser ordern i Shopify som vanligt, märkt med var den kom ifrån.'),
      faq('Hur är det med B2B?', 'Agentisk handel börjar i B2C, men B2B-inköpare använder samma assistenter. En ordnad katalog med rätt priser per kund gör att även Shopify B2B kan läsas av agenter.'),
      faq('Vad kostar det?', 'Kontrollen och genomförandet prissätts som ett eget projekt efter omfattning. Löpande optimering ingår i Enterprise-paketet.'),
    ],
    cta: { heading: 'Vill du veta om din butik är redo för agenter?', text: 'Vi går igenom katalog, policyer och kassa och skickar dig en prioriterad lista inom två arbetsdagar.', buttonLabel: 'Boka ett samtal', buttonHref: '/contact' },
    relatedTypes: ['allPackagesPage', 'partnersPage'],
    seo: { metaTitle: 'Agentisk handel: gör Shopify redo för AI-agenter | Scandicommerce', metaDescription: 'AI-agenter hittar, jämför och köper för kundernas räkning. Vi gör produktdata, policyer och kassa i din Shopify-butik redo för ChatGPT, Perplexity och Google.' },
  },
  {
    id: 'pillar-agentisk-handel-da', language: 'da', slug: 'agentisk-handel', pageTitle: 'Agentisk handel: gør din Shopify-butik klar til AI-agenter',
    definition: 'Agentisk handel er køb, der sker via AI-agenter: ChatGPT, Perplexity, Google og Shopifys egne agentflader finder, sammenligner og bestiller produkter på kundens vegne. Butikken skal være læsbar for agenter, produktdataene skal være komplette og strukturerede, og kassen skal kunne gennemføres uden et menneske ved skærmen. Vi gør din Shopify-butik klar til det.',
    sections: [
      section('Hvad der sker nu', 'nu', ['AI-assistenter er gået fra at svare på spørgsmål til at handle. ChatGPT, Perplexity og Google viser produkter, sammenligner pris og tilgængelighed og sender kunden direkte til kassen, eller gennemfører købet selv. Shopify kobler dit katalog til disse agenter gennem Shopify Catalog og den åbne protokol for agentisk handel.', 'Det betyder, at en voksende andel af trafikken aldrig ser din forside. Agenten læser produktdata, politikker og lagerstatus og vælger på kundens vegne. Butikker med ryddelige data bliver anbefalet. Butikker med huller bliver sprunget over.']),
      section('Sådan bliver butikken fundet af agenter', 'fundet', ['Agenter læser strukturerede data, ikke bannere. Komplette produktattributter, tydelige varianter, korrekte kategorier, GTIN, mål og vægt, lagerstatus og leveringstid afgør, om produktet dukker op. Shopify sender det videre gennem Shopify Catalog, forudsat at dataene findes og er korrekte.', 'Politikker tæller lige så meget. Fragt, returnering og garanti skal være skrevet, så en maskine forstår dem. Et "kontakt os for fragt" er et nej fra agenten.']),
      section('Produktdata er det nye SEO', 'produktdata', ['Hvor SEO handlede om tekst og links, handler agentisk synlighed om data. Vi gennemgår kataloget, finder hullerne og sætter en datamodel op, der holder: hvad der skal ligge i Shopify, hvad der skal styres fra PIM, og hvordan nye produkter får de rigtige attributter fra dag ét.', 'For butikker med mange varianter eller flere kanaler sætter vi PIM op, for eksempel Feed eller Vuuh, så Shopify, Google og agenterne får samme sandhed.']),
      section('Kasse uden et menneske ved skærmen', 'kasse', ['Agentisk kasse betyder, at købet kan gennemføres af agenten med kundens godkendelse. Shopify Checkout og Shop Pay understøtter det, og betaling via MobilePay, Klarna eller kort fungerer som før. Vi sørger for, at rabatregler, fragtregler og leveringsvalg er entydige, så købet ikke stopper ved et valg, agenten ikke kan træffe.']),
      section('Det leverer vi', 'leverance', ['Et agentklar-tjek af butikken: produktdata, politikker, Shopify Catalog-status og kasse, med en prioriteret liste over det, der skal rettes. Derefter gennemførelsen: datamodel, PIM-opsætning hvor det er nødvendigt, strukturerede politikker og måling af agentdrevne ordrer.', 'Løbende optimering til agentisk AI indgår i Enterprise-pakken. For andre leveres det som et selvstændigt projekt til fast pris.']),
      section('Sådan måler vi det', 'maaling', ['Agentdrevne ordrer markeres i Shopify med kilde og agent, så du ser, hvad ChatGPT, Perplexity og Google faktisk sender. Vi bruger Tracklution og Shopifys egne rapporter og sætter en enkel rapport op, som du kan følge månedligt.']),
    ],
    faq: [
      faq('Skal vi have Shopify Plus?', 'Nej. Shopify Catalog og agentisk kasse er tilgængelige for almindelige Shopify-butikker. Plus giver mere kontrol over kassen og flere markeder, men er ikke et krav for at blive fundet af agenter.'),
      faq('Kan agenterne købe, uden at kunden godkender?', 'Nej. Kunden godkender købet i agenten, før ordren afgives. Du ser ordren i Shopify som sædvanligt, markeret med hvor den kom fra.'),
      faq('Hvad med B2B?', 'Agentisk handel starter i B2C, men B2B-indkøbere bruger de samme assistenter. Et ryddeligt katalog med korrekte priser pr. kunde gør, at Shopify B2B også kan læses af agenter.'),
      faq('Hvad koster det?', 'Tjekket og gennemførelsen prissættes som et selvstændigt projekt efter omfang. Løbende optimering indgår i Enterprise-pakken.'),
    ],
    cta: { heading: 'Vil du vide, om din butik er klar til agenter?', text: 'Vi gennemgår katalog, politikker og kasse og sender dig en prioriteret liste inden for to hverdage.', buttonLabel: 'Book en samtale', buttonHref: '/contact' },
    relatedTypes: ['allPackagesPage', 'partnersPage'],
    seo: { metaTitle: 'Agentisk handel: gør Shopify klar til AI-agenter | Scandicommerce', metaDescription: 'AI-agenter finder, sammenligner og køber på kundernes vegne. Vi gør produktdata, politikker og kasse i din Shopify-butik klar til ChatGPT, Perplexity og Google.' },
  },
  {
    id: 'pillar-agentisk-handel-de', language: 'de', slug: 'agentic-commerce', pageTitle: 'Agentic Commerce: Machen Sie Ihren Shopify-Shop bereit für KI-Agenten',
    definition: 'Agentic Commerce bezeichnet Käufe über KI-Agenten: ChatGPT, Perplexity, Google und Shopifys eigene Agentenoberflächen finden, vergleichen und bestellen Produkte im Auftrag des Kunden. Der Shop muss für Agenten lesbar sein, die Produktdaten müssen vollständig und strukturiert sein, und der Checkout muss ohne einen Menschen am Bildschirm abgeschlossen werden können. Wir machen Ihren Shopify-Shop dafür bereit.',
    sections: [
      section('Was gerade passiert', 'jetzt', ['KI-Assistenten beantworten nicht mehr nur Fragen, sie kaufen ein. ChatGPT, Perplexity und Google zeigen Produkte, vergleichen Preis und Verfügbarkeit und schicken den Kunden direkt zum Checkout, oder schließen den Kauf selbst ab. Shopify verbindet Ihren Katalog über Shopify Catalog und das offene Protokoll für Agentic Commerce mit diesen Agenten.', 'Ein wachsender Teil des Traffics sieht Ihre Startseite also nie. Der Agent liest Produktdaten, Richtlinien und Lagerbestand und wählt im Auftrag des Kunden. Shops mit sauberen Daten werden empfohlen. Shops mit Lücken werden übersprungen.']),
      section('So wird Ihr Shop von Agenten gefunden', 'gefunden', ['Agenten lesen strukturierte Daten, keine Banner. Vollständige Produktattribute, klare Varianten, richtige Kategorien, GTIN, Maße und Gewicht, Lagerbestand und Lieferzeit entscheiden, ob ein Produkt erscheint. Shopify gibt diese Daten über Shopify Catalog weiter, vorausgesetzt, sie sind vorhanden und korrekt.', 'Richtlinien zählen genauso. Versand, Rückgabe und Garantie müssen so formuliert sein, dass eine Maschine sie versteht. Ein "Versandkosten auf Anfrage" ist für den Agenten ein Nein.']),
      section('Produktdaten sind das neue SEO', 'produktdaten', ['Wo es bei SEO um Text und Links ging, geht es bei agentischer Sichtbarkeit um Daten. Wir gehen den Katalog durch, finden die Lücken und bauen ein Datenmodell, das trägt: was in Shopify liegt, was aus einem PIM gesteuert wird und wie neue Produkte vom ersten Tag an die richtigen Attribute bekommen.', 'Für Shops mit vielen Varianten oder mehreren Kanälen richten wir ein PIM ein, zum Beispiel Feed oder Vuuh, damit Shopify, Google und die Agenten dieselbe Wahrheit sehen.']),
      section('Checkout ohne einen Menschen am Bildschirm', 'checkout', ['Agentischer Checkout bedeutet, dass der Agent den Kauf mit Zustimmung des Kunden abschließen kann. Shopify Checkout und Shop Pay unterstützen das, und die Zahlung per Klarna, PayPal oder Karte funktioniert wie bisher. Wir sorgen dafür, dass Rabattregeln, Versandregeln und Lieferoptionen eindeutig sind, damit der Kauf nicht an einer Entscheidung scheitert, die der Agent nicht treffen kann.']),
      section('Was wir liefern', 'leistung', ['Einen Agenten-Readiness-Check Ihres Shops: Produktdaten, Richtlinien, Shopify-Catalog-Status und Checkout, mit einer priorisierten Liste dessen, was behoben werden muss. Danach die Umsetzung: Datenmodell, PIM-Einrichtung wo nötig, strukturierte Richtlinien und Messung agentengetriebener Bestellungen.', 'Die laufende Optimierung für agentische KI ist Teil des Enterprise-Pakets. Für alle anderen liefern wir sie als eigenes Projekt zum Festpreis.']),
      section('So messen wir es', 'messung', ['Agentengetriebene Bestellungen werden in Shopify mit Quelle und Agent markiert, damit Sie sehen, was ChatGPT, Perplexity und Google tatsächlich liefern. Wir nutzen Tracklution und Shopifys eigene Berichte und richten einen einfachen Monatsbericht ein, den Sie verfolgen können.']),
    ],
    faq: [
      faq('Brauchen wir Shopify Plus?', 'Nein. Shopify Catalog und agentischer Checkout sind für normale Shopify-Shops verfügbar. Plus bietet mehr Kontrolle über den Checkout und mehr Märkte, ist aber keine Voraussetzung, um von Agenten gefunden zu werden.'),
      faq('Können Agenten ohne Zustimmung des Kunden kaufen?', 'Nein. Der Kunde bestätigt den Kauf im Agenten, bevor die Bestellung aufgegeben wird. Sie sehen die Bestellung wie gewohnt in Shopify, markiert mit ihrer Herkunft.'),
      faq('Was ist mit B2B?', 'Agentic Commerce beginnt im B2C, aber B2B-Einkäufer nutzen dieselben Assistenten. Ein sauberer Katalog mit korrekten Preisen pro Kunde macht auch Shopify B2B für Agenten lesbar.'),
      faq('Was kostet das?', 'Check und Umsetzung werden als eigenes Projekt nach Umfang bepreist. Die laufende Optimierung ist im Enterprise-Paket enthalten.'),
    ],
    cta: { heading: 'Möchten Sie wissen, ob Ihr Shop bereit für Agenten ist?', text: 'Wir prüfen Katalog, Richtlinien und Checkout und senden Ihnen innerhalb von zwei Werktagen eine priorisierte Liste.', buttonLabel: 'Gespräch buchen', buttonHref: '/contact' },
    relatedTypes: ['allPackagesPage', 'partnersPage'],
    seo: { metaTitle: 'Agentic Commerce: Shopify bereit für KI-Agenten machen | Scandicommerce', metaDescription: 'KI-Agenten finden, vergleichen und kaufen im Auftrag der Kunden. Wir machen Produktdaten, Richtlinien und Checkout Ihres Shopify-Shops bereit für ChatGPT, Perplexity und Google.' },
  },
  {
    id: 'pillar-bli-partner-sv', language: 'sv', slug: 'partners/bli-partner', pageTitle: 'Bli partner med Scandicommerce',
    definition: 'Scandicommerce samarbetar med teknikleverantörer, byråer och frilansare som vill leverera bättre Shopify-lösningar till svenska och nordiska butiker. Som partner får du en fast kontaktperson, gemensamma projekt, en plats på vår partnersida och ett avtal som säger vem som äger vad. Vi väljer få partner och jobbar nära dem, i stället för att samla logotyper.',
    sections: [
      section('Vilka vi söker', 'vilka', ['Teknikpartner: appar och system med ett API som löser något konkret för nordiska butiker, till exempel betalning, logistik, lojalitet, kundservice eller produktdata. Vi bygger integrationen och du får kunder som är rätt uppsatta.', 'Byråer: design-, innehålls- och marknadsföringsbyråer som behöver ett Shopify-team utan att bygga det själva. Vi tar plattform, integrationer och drift, ni behåller kunden.', 'Frilansare och utvecklare: Shopify-utvecklare som vill jobba på fasta projekt med tydlig omfattning och fast pris.']),
      section('Så fungerar samarbetet', 'sa', ['Hänvisningar går åt båda hållen och registreras, så att båda vet var kunden kom ifrån. Gemensamma leveranser prissätts som ett projekt med en tidsplan, och avtalet säger vem som äger data, kod och kundrelation. Partner som vill får en plats på vår partnersida med en beskrivning av vad vi levererar tillsammans.']),
      section('Det vi förväntar oss', 'forvantar', ['Öppna priser och tydliga leveranser, så att fast pris är möjligt. Svar inom en arbetsdag på ärenden som gäller gemensamma kunder. Dokumentation av det du levererar. Och svensk eller nordisk kundservice där kunderna behöver det.']),
      section('Det du får', 'far', ['En fast kontaktperson hos oss. Tidig tillgång till nya leveranser, som Nexus POS och våra appar. Gemensamma kundcase och innehåll. Och en partner som säger nej till projekt som inte passar, även när de är våra egna.']),
      section('Så ansöker du', 'ansok', ['Skicka ett mejl till post@scandicommerce.no med vad ni levererar, vilka kunder ni jobbar med och vad ni ser framför er att vi gör tillsammans. Vi svarar inom två arbetsdagar och bokar ett samtal med dem det passar för.']),
    ],
    faq: [
      faq('Kostar det något att vara partner?', 'Nej. Vi tar inte betalt för partnerskap, och vi betalar inte för logotypplacering. Värdet ligger i gemensamma kunder och leveranser.'),
      faq('Måste vi vara exklusiva?', 'Nej. Vi förväntar oss ärlighet om vilka ni annars jobbar med, inte exklusivitet.'),
      faq('Får vi hänvisningsprovision?', 'Det avtalar vi per partner och skriver ner. Som regel är det ömsesidiga hänvisningar utan provision, och provision där en part gör merparten av försäljningen.'),
      faq('Hur snabbt får vi svar?', 'Inom två arbetsdagar på förfrågan, och ett avstämningssamtal inom två veckor för dem vi går vidare med.'),
    ],
    cta: { heading: 'Vill du jobba med oss?', text: 'Berätta vad ni levererar och vilka ni jobbar med, så tar vi ett samtal.', buttonLabel: 'Kontakta oss', buttonHref: '/contact' },
    relatedTypes: ['partnersPage', 'allPackagesPage'],
    seo: { metaTitle: 'Bli partner med Scandicommerce', metaDescription: 'Teknikleverantörer, byråer och frilansare som vill leverera bättre Shopify-lösningar till nordiska butiker. Så fungerar partnerskap med Scandicommerce.' },
  },
  {
    id: 'pillar-bli-partner-da', language: 'da', slug: 'partnere/bliv-partner', pageTitle: 'Bliv partner med Scandicommerce',
    definition: 'Scandicommerce samarbejder med teknologileverandører, bureauer og freelancere, der vil levere bedre Shopify-løsninger til danske og nordiske butikker. Som partner får du en fast kontaktperson, fælles projekter, en plads på vores partnerside og en aftale, der siger, hvem der ejer hvad. Vi vælger få partnere og arbejder tæt sammen med dem, i stedet for at samle logoer.',
    sections: [
      section('Hvem vi leder efter', 'hvem', ['Teknologipartnere: apps og systemer med et API, der løser noget konkret for nordiske butikker, for eksempel betaling, logistik, loyalitet, kundeservice eller produktdata. Vi bygger integrationen, og du får kunder, der er sat rigtigt op.', 'Bureauer: design-, indholds- og marketingbureauer, der har brug for et Shopify-team uden selv at bygge det. Vi tager platform, integrationer og drift, I beholder kunden.', 'Freelancere og udviklere: Shopify-udviklere, der vil arbejde på faste projekter med tydeligt omfang og fast pris.']),
      section('Sådan fungerer samarbejdet', 'saadan', ['Henvisninger går begge veje og registreres, så begge ved, hvor kunden kom fra. Fælles leverancer prissættes som ét projekt med én tidsplan, og aftalen siger, hvem der ejer data, kode og kunderelation. Partnere, der ønsker det, får en plads på vores partnerside med en beskrivelse af, hvad vi leverer sammen.']),
      section('Det vi forventer', 'forventer', ['Åbne priser og tydelige leverancer, så fast pris er muligt. Svar inden for én hverdag på sager, der gælder fælles kunder. Dokumentation af det, du leverer. Og dansk eller nordisk kundeservice, hvor kunderne har brug for det.']),
      section('Det du får', 'faar', ['Én fast kontaktperson hos os. Tidlig adgang til nye leverancer, som Nexus POS og vores apps. Fælles kundecases og indhold. Og en partner, der siger nej til projekter, der ikke passer, også når det er vores egne.']),
      section('Sådan ansøger du', 'ansoeg', ['Send en e-mail til post@scandicommerce.no med, hvad I leverer, hvilke kunder I arbejder med, og hvad I forestiller jer, at vi gør sammen. Vi svarer inden for to hverdage og tager en samtale med dem, det passer til.']),
    ],
    faq: [
      faq('Koster det noget at være partner?', 'Nej. Vi tager ikke betaling for partnerskaber, og vi betaler ikke for logoplacering. Værdien ligger i fælles kunder og leverancer.'),
      faq('Skal vi være eksklusive?', 'Nej. Vi forventer ærlighed om, hvem I ellers arbejder med, ikke eksklusivitet.'),
      faq('Får vi henvisningsprovision?', 'Det aftaler vi pr. partner og skriver ned. Som regel er det gensidige henvisninger uden provision, og provision hvor den ene part står for størstedelen af salget.'),
      faq('Hvor hurtigt får vi svar?', 'Inden for to hverdage på henvendelsen, og en afklaringssamtale inden for to uger for dem, vi går videre med.'),
    ],
    cta: { heading: 'Vil du arbejde sammen med os?', text: 'Fortæl os, hvad I leverer, og hvem I arbejder med, så tager vi en samtale.', buttonLabel: 'Kontakt os', buttonHref: '/contact' },
    relatedTypes: ['partnersPage', 'allPackagesPage'],
    seo: { metaTitle: 'Bliv partner med Scandicommerce', metaDescription: 'Teknologileverandører, bureauer og freelancere, der vil levere bedre Shopify-løsninger til nordiske butikker. Sådan fungerer partnerskab med Scandicommerce.' },
  },
  {
    id: 'pillar-bli-partner-de', language: 'de', slug: 'partner/partner-werden', pageTitle: 'Partner von Scandicommerce werden',
    definition: 'Scandicommerce arbeitet mit Technologieanbietern, Agenturen und Freelancern zusammen, die bessere Shopify-Lösungen für nordische Shops liefern wollen. Als Partner erhalten Sie einen festen Ansprechpartner, gemeinsame Projekte, einen Platz auf unserer Partnerseite und eine Vereinbarung, die festlegt, wem was gehört. Wir wählen wenige Partner und arbeiten eng mit ihnen, statt Logos zu sammeln.',
    sections: [
      section('Wen wir suchen', 'wen', ['Technologiepartner: Apps und Systeme mit einer API, die etwas Konkretes für nordische Shops lösen, etwa Zahlung, Logistik, Loyalty, Kundenservice oder Produktdaten. Wir bauen die Integration, und Sie bekommen Kunden, die richtig eingerichtet sind.', 'Agenturen: Design-, Content- und Marketingagenturen, die ein Shopify-Team brauchen, ohne selbst eines aufzubauen. Wir übernehmen Plattform, Integrationen und Betrieb, Sie behalten den Kunden.', 'Freelancer und Entwickler: Shopify-Entwickler, die an klar umrissenen Projekten mit festem Umfang und Festpreis arbeiten möchten.']),
      section('So funktioniert die Zusammenarbeit', 'so', ['Empfehlungen laufen in beide Richtungen und werden erfasst, damit beide Seiten wissen, woher ein Kunde kam. Gemeinsame Lieferungen werden als ein Projekt mit einem Zeitplan bepreist, und die Vereinbarung legt fest, wem Daten, Code und Kundenbeziehung gehören. Partner, die es möchten, erhalten einen Platz auf unserer Partnerseite mit einer Beschreibung dessen, was wir gemeinsam liefern.']),
      section('Was wir erwarten', 'erwarten', ['Offene Preise und klare Leistungen, damit Festpreise möglich sind. Eine Antwort innerhalb eines Werktags bei Anliegen gemeinsamer Kunden. Dokumentation dessen, was Sie liefern. Und norwegischen oder nordischen Kundenservice dort, wo die Kunden ihn brauchen.']),
      section('Was Sie bekommen', 'bekommen', ['Einen festen Ansprechpartner bei uns. Frühen Zugang zu neuen Angeboten wie Nexus POS und unseren Apps. Gemeinsame Kundencases und Inhalte. Und einen Partner, der Nein zu Projekten sagt, die nicht passen, auch wenn es unsere eigenen sind.']),
      section('So bewerben Sie sich', 'bewerben', ['Schreiben Sie an post@scandicommerce.no, was Sie liefern, mit welchen Kunden Sie arbeiten und was Sie sich für unsere Zusammenarbeit vorstellen. Wir antworten innerhalb von zwei Werktagen und vereinbaren ein Gespräch, wo es passt.']),
    ],
    faq: [
      faq('Kostet die Partnerschaft etwas?', 'Nein. Wir berechnen nichts für Partnerschaften, und wir bezahlen nicht für Logoplatzierungen. Der Wert liegt in gemeinsamen Kunden und Projekten.'),
      faq('Müssen wir exklusiv sein?', 'Nein. Wir erwarten Offenheit darüber, mit wem Sie sonst arbeiten, keine Exklusivität.'),
      faq('Bekommen wir eine Empfehlungsprovision?', 'Das vereinbaren wir pro Partner und halten es schriftlich fest. In der Regel sind es gegenseitige Empfehlungen ohne Provision, und Provision dort, wo eine Seite den Großteil des Verkaufs übernimmt.'),
      faq('Wie schnell bekommen wir eine Antwort?', 'Innerhalb von zwei Werktagen auf die Anfrage, und ein Abstimmungsgespräch innerhalb von zwei Wochen für diejenigen, mit denen wir weitergehen.'),
    ],
    cta: { heading: 'Möchten Sie mit uns arbeiten?', text: 'Erzählen Sie uns, was Sie liefern und mit wem Sie arbeiten, dann vereinbaren wir ein Gespräch.', buttonLabel: 'Kontakt aufnehmen', buttonHref: '/contact' },
    relatedTypes: ['partnersPage', 'allPackagesPage'],
    seo: { metaTitle: 'Partner von Scandicommerce werden', metaDescription: 'Technologieanbieter, Agenturen und Freelancer, die bessere Shopify-Lösungen für nordische Shops liefern wollen. So funktioniert eine Partnerschaft mit Scandicommerce.' },
  },
]

async function main() {
  const author = await client.fetch<string | null>('coalesce(*[_type == "author" && _id == "author-chris-jensen"][0]._id, *[_type == "author"][0]._id)')
  if (!author) throw new Error('no author document')
  for (const p of PAGES) {
    // Either fixed ids (no/en) or per-language lookup by type (sv/da/de); missing docs are skipped.
    const wanted: string[] = p.related
      ? p.related
      : (await Promise.all((p.relatedTypes as string[]).map((type) => client.fetch<string | null>('*[_type == $type && language == $lang && !(_id in path("drafts.**"))][0]._id', { type, lang: p.language }))))
    const candidates = wanted.filter((id): id is string => Boolean(id))
    const existing = await client.fetch<string[]>('*[_id in $ids]._id', { ids: candidates })
    const related = candidates.filter((id) => existing.includes(id))
    await client.createOrReplace({
      _id: p.id, _type: 'pillarPage', language: p.language, pageTitle: p.pageTitle, slug: { _type: 'slug', current: p.slug }, schemaType: 'Service',
      definition: p.definition, intro: [], author: { _type: 'reference', _ref: author }, sections: p.sections, faq: p.faq, cta: p.cta,
      relatedPages: related.map(ref), seoExtended: p.seo,
    })
    console.log(dataset, 'wrote', p.id, `(${p.definition.split(/\s+/).length} words in definition, related: ${related.join(', ') || 'none'})`)
  }
  const LANGS = ['no', 'en', 'sv', 'da', 'de']
  for (const [metaId, base] of [['pillar-agentisk-handel-meta', 'pillar-agentisk-handel'], ['pillar-bli-partner-meta', 'pillar-bli-partner']]) {
    await client.createOrReplace({ _id: metaId, _type: 'translation.metadata', schemaTypes: ['pillarPage'], translations: LANGS.map((lang) => (
      { _key: lang, value: { _type: 'reference', _ref: `${base}-${lang}`, _weak: true, _strengthenOnPublish: { type: 'pillarPage' } } }
    )) })
    console.log(dataset, 'wrote', metaId, `(${LANGS.join(', ')})`)
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
