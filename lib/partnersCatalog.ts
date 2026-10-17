/**
 * Partner catalog for /partnere: who we work with, why they are on the list
 * and what the customer gets from the pairing. Logos live under
 * /public/images/partners. Text entries in the Sanity partnersPage document
 * (partnersGrid.partners) override these by name, so editors can adjust copy
 * without touching code; this file is the seed and the fallback.
 *
 * The main text fields are Norwegian; `badgeEn`, `whyEn` and `togetherEn`
 * carry the English. `localizePartners` swaps them in for non-Norwegian
 * pages, after `mergePartners` has laid Sanity data on the Norwegian fields.
 */

export type PartnerCategoryKey = 'plattform' | 'betaling' | 'erp' | 'logistikk' | 'crm' | 'kundeservice' | 'reviews' | 'vekst'

export interface PartnerEntry {
  slug: string
  name: string
  category: PartnerCategoryKey
  /** Formal relationship, shown as a tag: "Shopify Plus Partner", "Formell avtale" … */
  badge: string
  badgeEn: string
  /** Core partners are the ones we build nearly everything with. */
  core: boolean
  /** Why the partner is on the list. */
  why: string
  whyEn: string
  /** What the customer gets from us working together. */
  together: string
  togetherEn: string
  logo: string | null
  /** Monogram when there is no logo file. */
  mono?: string
  monoBg?: string
  monoFg?: string
}

export const partnerCategories: { key: PartnerCategoryKey; title: string; titleEn: string }[] = [
  { key: "plattform", title: "Plattform og integrasjon", titleEn: "Platform and integration" },
  { key: "betaling", title: "Betaling og BNPL", titleEn: "Payments and BNPL" },
  { key: "erp", title: "ERP og regnskap", titleEn: "ERP and accounting" },
  { key: "logistikk", title: "OMS, logistikk og lager", titleEn: "OMS, logistics and warehousing" },
  { key: "crm", title: "Lojalitet, CRM og e-post", titleEn: "Loyalty, CRM and email" },
  { key: "kundeservice", title: "Kundeservice", titleEn: "Customer service" },
  { key: "reviews", title: "Anmeldelser, søk og merchandising", titleEn: "Reviews, search and merchandising" },
  { key: "vekst", title: "Markedsføring og vekst", titleEn: "Marketing and growth" },
]

export const partnerCatalog: PartnerEntry[] = [
  { slug: "shopify", name: "Shopify", category: "plattform", badge: "Shopify Plus Partner", badgeEn: "Shopify Plus Partner", core: true, why: "Hele selskapet er bygget rundt plattformen. Plus Partner siden 2024, med direkte partnerkontakter og prioritert support.", whyEn: "The whole company is built around the platform. Plus Partner since 2024, with direct partner contacts and priority support.", together: "Vi legger til det Shopify ikke dekker selv i Norge: ERP-integrasjoner og kasselov-compliance med Nexus POS.", togetherEn: "We add what Shopify does not cover itself in Norway: ERP integrations and cash register compliance with Nexus POS.", logo: "/images/partners/shopify.png" },
  { slug: "make", name: "Make", category: "plattform", badge: "Sertifisert partner", badgeEn: "Certified partner", core: true, why: "Integrasjonslaget mellom Shopify og Tripletex, PowerOffice og Business Central.", whyEn: "The integration layer between Shopify and Tripletex, PowerOffice and Business Central.", together: "Integrasjoner til fastpris, levert raskt – uten skreddersydd kode du må vedlikeholde selv.", togetherEn: "Fixed-price integrations, delivered fast – without custom code you have to maintain yourself.", logo: "/images/partners/make.png" },
  { slug: "anthropic", name: "Anthropic", category: "plattform", badge: "Partner · Startup-programmet", badgeEn: "Partner · Startup programme", core: false, why: "Anthropic-partner og med i deres startup-program.", whyEn: "Anthropic partner and a member of their startup programme.", together: "Vi bruker Claude i hele leveransen og bygger AI inn i løsningene til kundene våre – for raskere levering og smartere drift.", togetherEn: "We use Claude across the whole delivery and build AI into our customers' solutions – for faster delivery and smarter operations.", logo: "/images/partners/anthropic.webp" },
  { slug: "sanity", name: "Sanity", category: "plattform", badge: "Teknologipartner", badgeEn: "Technology partner", core: false, why: "Headless CMS i Hydrogen-prosjekter, med et innholdslag redaktørene faktisk klarer å bruke.", whyEn: "Headless CMS in Hydrogen projects, with a content layer editors can actually use.", together: "Vi anbefaler headless bare når det gir mening for butikken din.", togetherEn: "We only recommend headless when it makes sense for your store.", logo: "/images/partners/sanity.png" },
  { slug: "consentmo", name: "Consentmo", category: "plattform", badge: "Listet partner", badgeEn: "Listed partner", core: false, why: "Samtykke- og compliance-app bygget for Shopify.", whyEn: "Consent and compliance app built for Shopify.", together: "GDPR og Google Consent Mode riktig satt opp i hver eneste lansering.", togetherEn: "GDPR and Google Consent Mode set up correctly in every single launch.", logo: "/images/partners/consentmo.png" },
  { slug: "norce", name: "Norce", category: "plattform", badge: "Plattformpartner", badgeEn: "Platform partner", core: false, why: "Composable-plattform vi kjenner fra innsiden.", whyEn: "A composable platform we know from the inside.", together: "Vi leverer på Norce når caset passer: komplekse løsninger og tung B2B, der plattformen virkelig kommer til sin rett.", togetherEn: "We deliver on Norce when the case fits: complex solutions and heavy B2B, where the platform really comes into its own.", logo: null, mono: "N" },
  { slug: "vipps-mobilepay", name: "Vipps MobilePay", category: "betaling", badge: "Formell avtale", badgeEn: "Formal agreement", core: true, why: "Direkte dialog med produktteamet, ikke bare en supportkø.", whyEn: "Direct dialogue with the product team, not just a support queue.", together: "Vi utvikler løsninger sammen – som Vipps Hurtigkasse og Nexus POS – og tester dem tidlig hos ekte butikker.", togetherEn: "We develop solutions together – like Vipps Express Checkout and Nexus POS – and test them early with real stores.", logo: "/images/partners/vipps-mobilepay.png" },
  { slug: "nets-nexi", name: "Nets / Nexi", category: "betaling", badge: "PSP-partner og POS-forhandler", badgeEn: "PSP partner and POS reseller", core: true, why: "Terminaler og oppgjør for Nexus POS.", whyEn: "Terminals and settlement for Nexus POS.", together: "Kortbetaling i butikken som snakker med Shopify – med én leverandør å forholde seg til.", togetherEn: "In-store card payments that talk to Shopify – with one supplier to deal with.", logo: "/images/partners/nets-nexi.png" },
  { slug: "shopify-payments", name: "Shopify Payments", category: "betaling", badge: "Standardvalget", badgeEn: "The default choice", core: false, why: "Null ekstra transaksjonsgebyr, Shop Pay og enklest mulig drift.", whyEn: "No extra transaction fees, Shop Pay and the simplest possible operation.", together: "Vi anbefaler det ærlig når det passer – ikke en tredjepart for tredjepartens skyld.", togetherEn: "We recommend it honestly when it fits – not a third party for the third party's sake.", logo: "/images/partners/shopify-payments.png" },
  { slug: "dintero", name: "Dintero", category: "betaling", badge: "Implementeringspartner", badgeEn: "Implementation partner", core: false, why: "Norsk samlet checkout: Vipps, kort, faktura og finansiering i én integrasjon.", whyEn: "Norwegian all-in-one checkout: Vipps, cards, invoice and financing in a single integration.", together: "Vi er åpne for å levere rene B2B-prosjekter sammen.", togetherEn: "We are open to delivering pure B2B projects together.", logo: "/images/partners/dintero.png" },
  { slug: "qliro", name: "Qliro", category: "betaling", badge: "Premium Partner", badgeEn: "Premium Partner", core: true, why: "En reell Klarna-utfordrer – nordisk BNPL som er villig til å tenke nytt.", whyEn: "A real Klarna challenger – Nordic BNPL willing to think differently.", together: "Qliro kommer med moderne løsninger for økt konvertering og kundelojalitet, og vi setter dem opp riktig i checkouten fra start.", togetherEn: "Qliro brings modern solutions for higher conversion and customer loyalty, and we set them up correctly in the checkout from day one.", logo: "/images/partners/qliro.png" },
  { slug: "avarda", name: "Avarda", category: "betaling", badge: "Preferred Shopify Partner", badgeEn: "Preferred Shopify Partner", core: false, why: "White label-checkout og betaling der det er din merkevare kunden ser – ikke betalingsleverandørens.", whyEn: "White-label checkout and payments where the customer sees your brand – not the payment provider's.", together: "Perfekt for merkevarebygging: faktura, delbetaling og kundeforholdet i ditt navn, med raskt oppgjør og lokal støtte.", togetherEn: "Perfect for brand building: invoice, instalments and the customer relationship in your name, with fast settlement and local support.", logo: "/images/partners/avarda.png" },
  { slug: "klarna", name: "Klarna", category: "betaling", badge: "Betalingspartner", badgeEn: "Payment partner", core: false, why: "Global BNPL som kundene kjenner igjen.", whyEn: "Global BNPL that customers recognise.", together: "Når merkevare og rekkevidde veier tyngst, setter vi opp Klarna riktig i Shopify-checkouten.", togetherEn: "When brand and reach matter most, we set up Klarna correctly in the Shopify checkout.", logo: null, mono: "K.", monoBg: "#FFB3C7", monoFg: "#0B051D" },
  { slug: "svea", name: "Svea", category: "betaling", badge: "Fintechpartner", badgeEn: "Fintech partner", core: false, why: "Nordisk fintech for både B2B og B2C.", whyEn: "Nordic fintech for both B2B and B2C.", together: "Når B2B-faktura og delbetaling for forbrukere skal samles hos én aktør.", togetherEn: "When B2B invoicing and consumer instalments should sit with one provider.", logo: "/images/partners/svea.png" },
  { slug: "confect", name: "Confect", category: "erp", badge: "Offisielt samarbeid", badgeEn: "Official collaboration", core: true, why: "Visma.net-eksperter med samme fastprismodell som oss. Vi deler til og med kontor.", whyEn: "Visma.net experts with the same fixed-price model as us. We even share an office.", together: "Confect bygget Visma.net-koblingen til Nexus POS. Visma.net og Shopify levert i samme tempo og til fast pris.", togetherEn: "Confect built the Visma.net connector for Nexus POS. Visma.net and Shopify delivered at the same pace and at a fixed price.", logo: "/images/partners/confect.png" },
  { slug: "totall-digitall", name: "toTALL / digiTALL", category: "erp", badge: "Foretrukket Finago-partner", badgeEn: "Preferred Finago partner", core: false, why: "Når kasse, butikkdata og regnskap skal samles.", whyEn: "When the till, store data and accounting need to come together.", together: "toTALL tar økonomien, vi tar e-handelen. Ingen av oss later som vi kan det andre.", togetherEn: "toTALL handles the finances, we handle the e-commerce. Neither of us pretends to do the other.", logo: "/images/partners/totall-digitall.png" },
  { slug: "digitall", name: "Digitall", category: "erp", badge: "Offisielt samarbeid", badgeEn: "Official collaboration", core: true, why: "Offisielt samarbeid på Finago, Omnium og Shopify.", whyEn: "Official collaboration on Finago, Omnium and Shopify.", together: "Vi leverer sammen når prosjektet spenner over økonomi, OMS og nettbutikk.", togetherEn: "We deliver together when the project spans finance, OMS and the online store.", logo: "/images/partners/digitall.png" },
  { slug: "microsoft-business-central", name: "Microsoft Business Central", category: "erp", badge: "Nativ kobling", badgeEn: "Native connector", core: false, why: "Shopify-kobling som vedlikeholdes av Microsoft.", whyEn: "A Shopify connector maintained by Microsoft.", together: "Vi jobber med sertifiserte BC-eksperter og konfigurerer koblingen riktig.", togetherEn: "We work with certified BC experts and configure the connector correctly.", logo: "/images/partners/microsoft-business-central.png" },
  { slug: "sage", name: "Sage", category: "erp", badge: "Brightpearl · Inventory Planner", badgeEn: "Brightpearl · Inventory Planner", core: false, why: "Prognoser og lagerplanlegging for merkevarer i vekst.", whyEn: "Forecasting and inventory planning for growing brands.", together: "Vi tar integrasjonen, Sage tar driftssystemet.", togetherEn: "We handle the integration, Sage handles the operations system.", logo: "/images/partners/sage.png" },
  { slug: "tripletex", name: "Tripletex", category: "erp", badge: "Egen standardintegrasjon", badgeEn: "Our own standard integration", core: false, why: "Dokumentert standardintegrasjon vi har bygget og vedlikeholder selv.", whyEn: "A documented standard integration we built and maintain ourselves.", together: "Ordre, betalinger og bilag rett inn i regnskapet. Norsk ERP-integrasjon er kjernen i det vi gjør.", togetherEn: "Orders, payments and vouchers straight into the accounts. Norwegian ERP integration is the core of what we do.", logo: "/images/partners/tripletex.png" },
  { slug: "poweroffice-go", name: "PowerOffice Go", category: "erp", badge: "Egen standardintegrasjon", badgeEn: "Our own standard integration", core: false, why: "Dokumentert standardintegrasjon vi har bygget og vedlikeholder selv.", whyEn: "A documented standard integration we built and maintain ourselves.", together: "Regnskapet oppdatert uten manuelle bilag – noe utenlandske byråer sjelden kan levere.", togetherEn: "Accounts kept up to date without manual vouchers – something foreign agencies rarely deliver.", logo: "/images/partners/poweroffice-go.png" },
  { slug: "24sevenoffice-finago", name: "24SevenOffice / Finago", category: "erp", badge: "Egen standardintegrasjon", badgeEn: "Our own standard integration", core: false, why: "Dokumentert standardintegrasjon vi har bygget og vedlikeholder selv.", whyEn: "A documented standard integration we built and maintain ourselves.", together: "Shopify og økonomisystemet snakker sammen fra dag én.", togetherEn: "Shopify and the finance system talk to each other from day one.", logo: "/images/partners/24sevenoffice-finago.png" },
  { slug: "omnium", name: "Omnium", category: "logistikk", badge: "Sertifisert OMS-partner", badgeEn: "Certified OMS partner", core: true, why: "Motoren for omnikanal, klikk og hent og ship from store.", whyEn: "The engine for omnichannel, click and collect and ship from store.", together: "Et av få byråer som leverer Omnium og Shopify i samme team.", togetherEn: "One of few agencies delivering Omnium and Shopify in the same team.", logo: "/images/partners/omnium.png" },
  { slug: "isys", name: "iSYS", category: "logistikk", badge: "PIM- og WMS-partner", badgeEn: "PIM and WMS partner", core: false, why: "Feed PIM og InStock WMS for store kataloger.", whyEn: "Feed PIM and InStock WMS for large catalogues.", together: "iSYS eier produktdata og lager, vi eier salgsflaten.", togetherEn: "iSYS owns product data and the warehouse, we own the sales surface.", logo: "/images/partners/isys.png" },
  { slug: "holio", name: "Holio", category: "logistikk", badge: "Offisiell partner", badgeEn: "Official partner", core: false, why: "Én integrasjon mot hele transportørnettverket – og nå også plukk og WMS.", whyEn: "One integration to the whole carrier network – and now picking and WMS too.", together: "Logistikk løst av folk som kan logistikk, i stedet for noe vi må bygge selv.", togetherEn: "Logistics solved by people who know logistics, instead of something we have to build ourselves.", logo: "/images/partners/holio.png" },
  { slug: "quickship", name: "Quickship", category: "logistikk", badge: "Formell avtale", badgeEn: "Formal agreement", core: false, why: "Fraktløsning for små og mellomstore butikker.", whyEn: "Shipping solution for small and mid-sized stores.", together: "Etiketter og sporing raskt i gang.", togetherEn: "Labels and tracking up and running fast.", logo: "/images/partners/quickship.png" },
  { slug: "helthjem", name: "Helthjem", category: "logistikk", badge: "Leveringspartner", badgeEn: "Delivery partner", core: false, why: "Hjemlevering som mange av kundene våre bruker.", whyEn: "Home delivery that many of our customers use.", together: "Riktig satt opp i checkouten fra første dag.", togetherEn: "Set up correctly in the checkout from day one.", logo: "/images/partners/helthjem.webp" },
  { slug: "bring", name: "Bring", category: "logistikk", badge: "Partner", badgeEn: "Partner", core: false, why: "Pakke- og hjemlevering med Shopify-integrasjon.", whyEn: "Parcel and home delivery with a Shopify integration.", together: "Standardtransportøren i de fleste norske oppsett.", togetherEn: "The default carrier in most Norwegian setups.", logo: "/images/partners/bring.png" },
  { slug: "postnord", name: "PostNord", category: "logistikk", badge: "Partner", badgeEn: "Partner", core: false, why: "Nordisk transportør med hentesteder og pakkebokser.", whyEn: "Nordic carrier with pickup points and parcel lockers.", together: "Viktig når du selger til Sverige og Danmark.", togetherEn: "Important when you sell to Sweden and Denmark.", logo: "/images/partners/postnord.webp" },
  { slug: "klaviyo", name: "Klaviyo", category: "crm", badge: "Partner", badgeEn: "Partner", core: true, why: "Den dypeste Shopify-integrasjonen på markedet for e-post og SMS.", whyEn: "The deepest Shopify integration on the market for email and SMS.", together: "Flyter og kampanjer som gir målbar omsetning – ikke bare nyhetsbrev.", togetherEn: "Flows and campaigns that drive measurable revenue – not just newsletters.", logo: "/images/partners/klaviyo.png" },
  { slug: "voyado", name: "Voyado", category: "crm", badge: "Sertifisert partner", badgeEn: "Certified partner", core: false, why: "CRM og lojalitet for større merkevarer.", whyEn: "CRM and loyalty for larger brands.", together: "Voyado tar kundedata og segmentering, vi tar e-handel og integrasjon.", togetherEn: "Voyado handles customer data and segmentation, we handle e-commerce and integration.", logo: "/images/partners/voyado.png" },
  { slug: "diller", name: "Diller", category: "crm", badge: "Lojalitetspartner", badgeEn: "Loyalty partner", core: false, why: "Norsk kundeklubb.", whyEn: "Norwegian loyalty club.", together: "En ansvarsdeling vi har definert sammen: Diller eier medlemskap og poeng, Shopify nettkontoen, OMS ordren.", togetherEn: "A division of responsibility we defined together: Diller owns membership and points, Shopify the online account, the OMS the order.", logo: "/images/partners/diller.png" },
  { slug: "modish", name: "Modish", category: "crm", badge: "Lojalitetspartner", badgeEn: "Loyalty partner", core: false, why: "Tar strategi og drift av lojalitetsprogrammet.", whyEn: "Handles strategy and operation of the loyalty programme.", together: "Vi tar teknisk implementering. Sammen leverer vi hele programmet, ikke bare appen.", togetherEn: "We handle the technical implementation. Together we deliver the whole programme, not just the app.", logo: "/images/partners/modish.png" },
  { slug: "brevo", name: "Brevo", category: "crm", badge: "E-postpartner", badgeEn: "Email partner", core: false, why: "E-post og CRM for mindre butikker.", whyEn: "Email and CRM for smaller stores.", together: "Et godt alternativ når Klaviyo er mer enn butikken trenger.", togetherEn: "A good alternative when Klaviyo is more than the store needs.", logo: "/images/partners/brevo.png" },
  { slug: "mimir", name: "Mimir", category: "kundeservice", badge: "Partner", badgeEn: "Partner", core: false, why: "Norsk AI-kundeservice for netthandel.", whyEn: "Norwegian AI customer service for e-commerce.", together: "Avlaster butikker som drukner i henvendelser – så du får tid til å drive butikk.", togetherEn: "Relieves stores drowning in enquiries – so you have time to run the store.", logo: "/images/partners/mimir.webp" },
  { slug: "supportify", name: "Supportify", category: "kundeservice", badge: "Partner", badgeEn: "Partner", core: false, why: "Outsourcet kundeservice med ekte mennesker.", whyEn: "Outsourced customer service with real people.", together: "Når kundene dine vil snakke med folk, ikke bare en bot.", togetherEn: "When your customers want to talk to people, not just a bot.", logo: "/images/partners/supportify.png" },
  { slug: "trustpilot", name: "Trustpilot", category: "reviews", badge: "Partner", badgeEn: "Partner", core: false, why: "Kjent for norske forbrukere, og teller i SEO og AI-søk.", whyEn: "Familiar to Norwegian consumers, and counts in SEO and AI search.", together: "Stjernene plassert der de konverterer – ikke bare i footeren.", togetherEn: "Stars placed where they convert – not just in the footer.", logo: "/images/partners/trustpilot.png" },
  { slug: "lipscore", name: "Lipscore", category: "reviews", badge: "Partner", badgeEn: "Partner", core: false, why: "Nordiske, verifiserte anmeldelser.", whyEn: "Nordic, verified reviews.", together: "Anmeldelser fra ekte kjøp, tilpasset nordiske butikker.", togetherEn: "Reviews from real purchases, tailored to Nordic stores.", logo: "/images/partners/lipscore.png" },
  { slug: "judge-me", name: "Judge.me", category: "reviews", badge: "Partner", badgeEn: "Partner", core: false, why: "Rimelig og godt for mindre butikker.", whyEn: "Affordable and solid for smaller stores.", together: "Anmeldelser på plass uten en stor månedskostnad.", togetherEn: "Reviews in place without a big monthly cost.", logo: null, mono: "J" },
  { slug: "boost", name: "Boost", category: "reviews", badge: "Implementeringspartner", badgeEn: "Implementation partner", core: false, why: "Søk og merchandising for Shopify.", whyEn: "Search and merchandising for Shopify.", together: "Vi velger søkeløsning etter katalogstørrelse og behov – ikke etter vane.", togetherEn: "We pick the search solution by catalogue size and needs – not out of habit.", logo: null, mono: "B" },
  { slug: "depict", name: "Depict", category: "reviews", badge: "Implementeringspartner", badgeEn: "Implementation partner", core: false, why: "Søk og merchandising for Shopify.", whyEn: "Search and merchandising for Shopify.", together: "Vi velger søkeløsning etter katalogstørrelse og behov – ikke etter vane.", togetherEn: "We pick the search solution by catalogue size and needs – not out of habit.", logo: "/images/partners/depict.png" },
  { slug: "tracklution", name: "Tracklution", category: "vekst", badge: "Inkludert i alle lanseringer", badgeEn: "Included in every launch", core: true, why: "Server-side tracking som faktisk fanger opp salgene.", whyEn: "Server-side tracking that actually captures the sales.", together: "Korrekte data til Meta og Google – alltid inkludert i standardprisen vår.", togetherEn: "Accurate data to Meta and Google – always included in our standard price.", logo: "/images/partners/tracklution.png" },
  { slug: "inevo", name: "Inevo", category: "vekst", badge: "Markedsføringspartner", badgeEn: "Marketing partner", core: false, why: "Performance og vekst.", whyEn: "Performance and growth.", together: "Vi har eget markedsføringsteam – Inevo er partneren vi henter inn på caser vi ikke tar selv. De tar markedsføringen, vi tar plattform og konvertering.", togetherEn: "We have our own marketing team – Inevo is the partner we bring in on cases we do not take ourselves. They handle the marketing, we handle platform and conversion.", logo: "/images/partners/inevo.png" },
  { slug: "marketer-com", name: "Marketer.com", category: "vekst", badge: "Byråpartner", badgeEn: "Agency partner", core: false, why: "Betalt markedsføring og Manta-plattformen.", whyEn: "Paid marketing and the Manta platform.", together: "Vi tester Manta-plattformen til Marketer.com hos utvalgte kunder. De kjører annonsene, vi bygger og optimaliserer butikken.", togetherEn: "We are testing Marketer.com's Manta platform with selected customers. They run the ads, we build and optimise the store.", logo: null, mono: "M" },
  { slug: "moen-co", name: "Moen & Co", category: "vekst", badge: "Partner", badgeEn: "Partner", core: false, why: "Community og merkevare.", whyEn: "Community and brand.", together: "Vi er store fans av det Moen & Co gjør og ser mange synergier – vi bidrar til hverandres vekst.", togetherEn: "We are big fans of what Moen & Co do and see plenty of synergies – we contribute to each other's growth.", logo: "/images/partners/moen-co.webp" },
  { slug: "profitmetrics-reprice-og-circklewise", name: "ProfitMetrics, Reprice og Circklewise", category: "vekst", badge: "Ved behov", badgeEn: "When needed", core: false, why: "Analyse, prisintelligens og affiliate.", whyEn: "Analytics, pricing intelligence and affiliate.", together: "Spesialister vi henter inn når butikken din trenger det.", togetherEn: "Specialists we bring in when your store needs them.", logo: "/images/partners/profitmetrics-reprice-og-circklewise.png" },
]

/** Category title in the page language; Norwegian on .no, English everywhere else. */
export const categoryTitle = (key: string, language = 'no') => {
  const c = partnerCategories.find((c) => c.key === key)
  if (!c) return key
  return language === 'no' ? c.title : c.titleEn
}

/**
 * Swap the Norwegian badge/why/together for English on non-Norwegian pages.
 * Run it after `mergePartners`, which fills gaps on the Norwegian fields.
 * Norwegian returns the same array.
 */
export function localizePartners(entries: PartnerEntry[], language: string): PartnerEntry[] {
  if (language === 'no') return entries
  return entries.map((p) => ({ ...p, badge: p.badgeEn || p.badge, why: p.whyEn || p.why, together: p.togetherEn || p.together }))
}

/** Shape of a partner entry in the Sanity partnersPage document. */
export interface SanityPartner {
  name?: string
  category?: string
  description?: string
  benefits?: string[]
  logoUrl?: string | null
  url?: string
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

/**
 * Catalog copy is written for these cards (two short lines), so it wins.
 * Sanity fills the gaps: a logo when the catalog has none, and a description
 * only when the catalog entry is empty.
 */
export function mergePartners(catalog: PartnerEntry[], sanity: SanityPartner[] | undefined): PartnerEntry[] {
  if (!sanity?.length) return catalog
  const byName = new Map(sanity.filter((p) => p.name).map((p) => [norm(p.name!), p]))
  return catalog.map((p) => {
    const hit = byName.get(norm(p.name))
    if (!hit) return p
    return { ...p, why: p.why || hit.description?.trim() || '', logo: p.logo || hit.logoUrl || null }
  })
}
