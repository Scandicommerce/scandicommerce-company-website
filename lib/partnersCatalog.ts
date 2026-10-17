/**
 * Partner catalog for /partnere: who we work with, why they are on the list
 * and what the customer gets from the pairing. Logos live under
 * /public/images/partners. Text entries in the Sanity partnersPage document
 * (partnersGrid.partners) override these by name, so editors can adjust copy
 * without touching code; this file is the seed and the fallback.
 *
 * The main text fields are Norwegian; `badgeEn`, `whyEn` and `togetherEn`
 * carry the English, and `partnerTranslations` holds Swedish, Danish and
 * German per slug. `localizePartners` swaps them in for non-Norwegian pages,
 * after `mergePartners` has laid Sanity data on the Norwegian fields.
 */

export type PartnerCategoryKey = 'plattform' | 'betaling' | 'erp' | 'logistikk' | 'crm' | 'kundeservice' | 'reviews' | 'vekst'

/** The copy languages the partner pages are written in. Unknown locales fall back to English. */
export type PartnerLang = 'no' | 'en' | 'sv' | 'da' | 'de'
export const PARTNER_LANGS: PartnerLang[] = ['no', 'en', 'sv', 'da', 'de']
export const partnerLang = (language: string): PartnerLang => (PARTNER_LANGS.includes(language as PartnerLang) ? (language as PartnerLang) : 'en')

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

export const partnerCategories: { key: PartnerCategoryKey; title: string; titleEn: string; titleSv: string; titleDa: string; titleDe: string }[] = [
  { key: "plattform", title: "Plattform og integrasjon", titleEn: "Platform and integration", titleSv: "Plattform och integration", titleDa: "Platform og integration", titleDe: "Plattform und Integration" },
  { key: "betaling", title: "Betaling og BNPL", titleEn: "Payments and BNPL", titleSv: "Betalning och BNPL", titleDa: "Betaling og BNPL", titleDe: "Zahlung und BNPL" },
  { key: "erp", title: "ERP og regnskap", titleEn: "ERP and accounting", titleSv: "ERP och bokföring", titleDa: "ERP og regnskab", titleDe: "ERP und Buchhaltung" },
  { key: "logistikk", title: "OMS, logistikk og lager", titleEn: "OMS, logistics and warehousing", titleSv: "OMS, logistik och lager", titleDa: "OMS, logistik og lager", titleDe: "OMS, Logistik und Lager" },
  { key: "crm", title: "Lojalitet, CRM og e-post", titleEn: "Loyalty, CRM and email", titleSv: "Lojalitet, CRM och e-post", titleDa: "Loyalitet, CRM og e-mail", titleDe: "Loyalität, CRM und E-Mail" },
  { key: "kundeservice", title: "Kundeservice", titleEn: "Customer service", titleSv: "Kundservice", titleDa: "Kundeservice", titleDe: "Kundenservice" },
  { key: "reviews", title: "Anmeldelser, søk og merchandising", titleEn: "Reviews, search and merchandising", titleSv: "Omdömen, sök och merchandising", titleDa: "Anmeldelser, søgning og merchandising", titleDe: "Bewertungen, Suche und Merchandising" },
  { key: "vekst", title: "Markedsføring og vekst", titleEn: "Marketing and growth", titleSv: "Marknadsföring och tillväxt", titleDa: "Markedsføring og vækst", titleDe: "Marketing und Wachstum" },
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

/** Translated badge/why/together for one partner. */
export interface PartnerCopy {
  badge: string
  why: string
  together: string
}

/**
 * Swedish, Danish and German copy per partner slug. English lives on the
 * entries themselves (`badgeEn` …). A slug missing here falls back to English.
 */
export const partnerTranslations: Record<Exclude<PartnerLang, 'no' | 'en'>, Record<string, PartnerCopy>> = {
  sv: {
    "shopify": { badge: "Shopify Plus Partner", why: "Hela företaget är byggt runt plattformen. Plus Partner sedan 2024, med direkta partnerkontakter och prioriterad support.", together: "Vi lägger till det Shopify inte täcker själva i Norge: ERP-integrationer och kassalagsefterlevnad med Nexus POS." },
    "make": { badge: "Certifierad partner", why: "Integrationslagret mellan Shopify och Tripletex, PowerOffice och Business Central.", together: "Integrationer till fast pris, levererade snabbt – utan skräddarsydd kod du måste underhålla själv." },
    "anthropic": { badge: "Partner · Startup-programmet", why: "Anthropic-partner och med i deras startup-program.", together: "Vi använder Claude i hela leveransen och bygger in AI i våra kunders lösningar – för snabbare leverans och smartare drift." },
    "sanity": { badge: "Teknikpartner", why: "Headless CMS i Hydrogen-projekt, med ett innehållslager redaktörerna faktiskt klarar av att använda.", together: "Vi rekommenderar headless bara när det är vettigt för din butik." },
    "consentmo": { badge: "Listad partner", why: "Samtyckes- och compliance-app byggd för Shopify.", together: "GDPR och Google Consent Mode korrekt uppsatt i varenda lansering." },
    "norce": { badge: "Plattformspartner", why: "Composable-plattform vi känner från insidan.", together: "Vi levererar på Norce när caset passar: komplexa lösningar och tung B2B, där plattformen verkligen kommer till sin rätt." },
    "vipps-mobilepay": { badge: "Formellt avtal", why: "Direkt dialog med produktteamet, inte bara en supportkö.", together: "Vi utvecklar lösningar tillsammans – som Vipps Hurtigkasse och Nexus POS – och testar dem tidigt hos riktiga butiker." },
    "nets-nexi": { badge: "PSP-partner och POS-återförsäljare", why: "Terminaler och avräkning för Nexus POS.", together: "Kortbetalning i butiken som pratar med Shopify – med en leverantör att förhålla sig till." },
    "shopify-payments": { badge: "Standardvalet", why: "Noll extra transaktionsavgift, Shop Pay och enklast möjliga drift.", together: "Vi rekommenderar det ärligt när det passar – inte en tredjepart för tredjepartens skull." },
    "dintero": { badge: "Implementeringspartner", why: "Norsk samlad checkout: Vipps, kort, faktura och finansiering i en integration.", together: "Vi är öppna för att leverera rena B2B-projekt tillsammans." },
    "qliro": { badge: "Premium Partner", why: "En verklig Klarna-utmanare – nordisk BNPL som vågar tänka nytt.", together: "Qliro kommer med moderna lösningar för ökad konvertering och kundlojalitet, och vi sätter upp dem rätt i checkouten från start." },
    "avarda": { badge: "Preferred Shopify Partner", why: "White label-checkout och betalning där det är ditt varumärke kunden ser – inte betalleverantörens.", together: "Perfekt för varumärkesbyggande: faktura, delbetalning och kundrelationen i ditt namn, med snabb avräkning och lokal support." },
    "klarna": { badge: "Betalpartner", why: "Global BNPL som kunderna känner igen.", together: "När varumärke och räckvidd väger tyngst sätter vi upp Klarna rätt i Shopify-checkouten." },
    "svea": { badge: "Fintechpartner", why: "Nordiskt fintechbolag för både B2B och B2C.", together: "När B2B-faktura och delbetalning för konsumenter ska samlas hos en aktör." },
    "confect": { badge: "Officiellt samarbete", why: "Visma.net-experter med samma fastprismodell som vi. Vi delar till och med kontor.", together: "Confect byggde Visma.net-kopplingen till Nexus POS. Visma.net och Shopify levererat i samma tempo och till fast pris." },
    "totall-digitall": { badge: "Föredragen Finago-partner", why: "När kassa, butiksdata och bokföring ska samlas.", together: "toTALL tar ekonomin, vi tar e-handeln. Ingen av oss låtsas kunna det andra." },
    "digitall": { badge: "Officiellt samarbete", why: "Officiellt samarbete kring Finago, Omnium och Shopify.", together: "Vi levererar tillsammans när projektet spänner över ekonomi, OMS och webbutik." },
    "microsoft-business-central": { badge: "Nativ koppling", why: "Shopify-koppling som underhålls av Microsoft.", together: "Vi jobbar med certifierade BC-experter och konfigurerar kopplingen rätt." },
    "sage": { badge: "Brightpearl · Inventory Planner", why: "Prognoser och lagerplanering för varumärken i tillväxt.", together: "Vi tar integrationen, Sage tar driftsystemet." },
    "tripletex": { badge: "Egen standardintegration", why: "Dokumenterad standardintegration vi har byggt och underhåller själva.", together: "Ordrar, betalningar och verifikat rakt in i bokföringen. Norsk ERP-integration är kärnan i det vi gör." },
    "poweroffice-go": { badge: "Egen standardintegration", why: "Dokumenterad standardintegration vi har byggt och underhåller själva.", together: "Bokföringen uppdaterad utan manuella verifikat – något utländska byråer sällan kan leverera." },
    "24sevenoffice-finago": { badge: "Egen standardintegration", why: "Dokumenterad standardintegration vi har byggt och underhåller själva.", together: "Shopify och ekonomisystemet pratar med varandra från dag ett." },
    "omnium": { badge: "Certifierad OMS-partner", why: "Motorn för omnikanal, click and collect och ship from store.", together: "En av få byråer som levererar Omnium och Shopify i samma team." },
    "isys": { badge: "PIM- och WMS-partner", why: "Feed PIM och InStock WMS för stora kataloger.", together: "iSYS äger produktdata och lager, vi äger säljytan." },
    "holio": { badge: "Officiell partner", why: "En integration mot hela transportörsnätverket – och nu även plock och WMS.", together: "Logistik löst av folk som kan logistik, i stället för något vi måste bygga själva." },
    "quickship": { badge: "Formellt avtal", why: "Fraktlösning för små och medelstora butiker.", together: "Etiketter och spårning snabbt igång." },
    "helthjem": { badge: "Leveranspartner", why: "Hemleverans som många av våra kunder använder.", together: "Rätt uppsatt i checkouten från första dagen." },
    "bring": { badge: "Partner", why: "Paket- och hemleverans med Shopify-integration.", together: "Standardtransportören i de flesta norska uppsättningar." },
    "postnord": { badge: "Partner", why: "Nordisk transportör med utlämningsställen och paketboxar.", together: "Viktigt när du säljer till Sverige och Danmark." },
    "klaviyo": { badge: "Partner", why: "Den djupaste Shopify-integrationen på marknaden för e-post och SMS.", together: "Flöden och kampanjer som ger mätbar omsättning – inte bara nyhetsbrev." },
    "voyado": { badge: "Certifierad partner", why: "CRM och lojalitet för större varumärken.", together: "Voyado tar kunddata och segmentering, vi tar e-handel och integration." },
    "diller": { badge: "Lojalitetspartner", why: "Norsk kundklubb.", together: "En ansvarsfördelning vi har definierat tillsammans: Diller äger medlemskap och poäng, Shopify webbkontot, OMS ordern." },
    "modish": { badge: "Lojalitetspartner", why: "Tar strategi och drift av lojalitetsprogrammet.", together: "Vi tar den tekniska implementeringen. Tillsammans levererar vi hela programmet, inte bara appen." },
    "brevo": { badge: "E-postpartner", why: "E-post och CRM för mindre butiker.", together: "Ett bra alternativ när Klaviyo är mer än butiken behöver." },
    "mimir": { badge: "Partner", why: "Norsk AI-kundservice för e-handel.", together: "Avlastar butiker som drunknar i ärenden – så att du får tid att driva butik." },
    "supportify": { badge: "Partner", why: "Outsourcad kundservice med riktiga människor.", together: "När dina kunder vill prata med människor, inte bara en bot." },
    "trustpilot": { badge: "Partner", why: "Välkänt för norska konsumenter, och räknas i SEO och AI-sök.", together: "Stjärnorna placerade där de konverterar – inte bara i sidfoten." },
    "lipscore": { badge: "Partner", why: "Nordiska, verifierade omdömen.", together: "Omdömen från riktiga köp, anpassade för nordiska butiker." },
    "judge-me": { badge: "Partner", why: "Prisvärt och bra för mindre butiker.", together: "Omdömen på plats utan en stor månadskostnad." },
    "boost": { badge: "Implementeringspartner", why: "Sök och merchandising för Shopify.", together: "Vi väljer söklösning efter katalogstorlek och behov – inte av vana." },
    "depict": { badge: "Implementeringspartner", why: "Sök och merchandising för Shopify.", together: "Vi väljer söklösning efter katalogstorlek och behov – inte av vana." },
    "tracklution": { badge: "Ingår i alla lanseringar", why: "Server-side tracking som faktiskt fångar upp försäljningen.", together: "Korrekta data till Meta och Google – alltid inkluderat i vårt standardpris." },
    "inevo": { badge: "Marknadsföringspartner", why: "Performance och tillväxt.", together: "Vi har ett eget marknadsföringsteam – Inevo är partnern vi tar in på case vi inte tar själva. De tar marknadsföringen, vi tar plattform och konvertering." },
    "marketer-com": { badge: "Byråpartner", why: "Betald marknadsföring och Manta-plattformen.", together: "Vi testar Marketer.coms Manta-plattform hos utvalda kunder. De kör annonserna, vi bygger och optimerar butiken." },
    "moen-co": { badge: "Partner", why: "Community och varumärke.", together: "Vi är stora fans av det Moen & Co gör och ser många synergier – vi bidrar till varandras tillväxt." },
    "profitmetrics-reprice-og-circklewise": { badge: "Vid behov", why: "Analys, prisintelligens och affiliate.", together: "Specialister vi tar in när din butik behöver det." },
  },
  da: {
    "shopify": { badge: "Shopify Plus Partner", why: "Hele virksomheden er bygget op omkring platformen. Plus Partner siden 2024, med direkte partnerkontakter og prioriteret support.", together: "Vi tilføjer det, Shopify ikke selv dækker i Norge: ERP-integrationer og kasselov-compliance med Nexus POS." },
    "make": { badge: "Certificeret partner", why: "Integrationslaget mellem Shopify og Tripletex, PowerOffice og Business Central.", together: "Integrationer til fast pris, leveret hurtigt – uden skræddersyet kode, du selv skal vedligeholde." },
    "anthropic": { badge: "Partner · Startup-programmet", why: "Anthropic-partner og med i deres startup-program.", together: "Vi bruger Claude i hele leverancen og bygger AI ind i vores kunders løsninger – for hurtigere levering og smartere drift." },
    "sanity": { badge: "Teknologipartner", why: "Headless CMS i Hydrogen-projekter, med et indholdslag redaktørerne faktisk kan finde ud af at bruge.", together: "Vi anbefaler kun headless, når det giver mening for din butik." },
    "consentmo": { badge: "Listet partner", why: "Samtykke- og compliance-app bygget til Shopify.", together: "GDPR og Google Consent Mode sat korrekt op i hver eneste lancering." },
    "norce": { badge: "Platformpartner", why: "Composable-platform vi kender indefra.", together: "Vi leverer på Norce, når casen passer: komplekse løsninger og tung B2B, hvor platformen virkelig kommer til sin ret." },
    "vipps-mobilepay": { badge: "Formel aftale", why: "Direkte dialog med produktteamet, ikke bare en supportkø.", together: "Vi udvikler løsninger sammen – som Vipps Hurtigkasse og Nexus POS – og tester dem tidligt hos rigtige butikker." },
    "nets-nexi": { badge: "PSP-partner og POS-forhandler", why: "Terminaler og afregning til Nexus POS.", together: "Kortbetaling i butikken, der taler med Shopify – med én leverandør at forholde sig til." },
    "shopify-payments": { badge: "Standardvalget", why: "Nul ekstra transaktionsgebyr, Shop Pay og enklest mulig drift.", together: "Vi anbefaler det ærligt, når det passer – ikke en tredjepart for tredjepartens skyld." },
    "dintero": { badge: "Implementeringspartner", why: "Norsk samlet checkout: Vipps, kort, faktura og finansiering i én integration.", together: "Vi er åbne for at levere rene B2B-projekter sammen." },
    "qliro": { badge: "Premium Partner", why: "En reel Klarna-udfordrer – nordisk BNPL, der tør tænke nyt.", together: "Qliro kommer med moderne løsninger til øget konvertering og kundeloyalitet, og vi sætter dem rigtigt op i checkouten fra start." },
    "avarda": { badge: "Preferred Shopify Partner", why: "White label-checkout og betaling, hvor det er dit brand, kunden ser – ikke betalingsudbyderens.", together: "Perfekt til brandbuilding: faktura, delbetaling og kunderelationen i dit navn, med hurtig afregning og lokal support." },
    "klarna": { badge: "Betalingspartner", why: "Global BNPL, som kunderne genkender.", together: "Når brand og rækkevidde vejer tungest, sætter vi Klarna rigtigt op i Shopify-checkouten." },
    "svea": { badge: "Fintechpartner", why: "Nordisk fintech til både B2B og B2C.", together: "Når B2B-faktura og delbetaling til forbrugere skal samles hos én aktør." },
    "confect": { badge: "Officielt samarbejde", why: "Visma.net-eksperter med samme fastprismodel som os. Vi deler endda kontor.", together: "Confect byggede Visma.net-koblingen til Nexus POS. Visma.net og Shopify leveret i samme tempo og til fast pris." },
    "totall-digitall": { badge: "Foretrukken Finago-partner", why: "Når kasse, butiksdata og regnskab skal samles.", together: "toTALL tager økonomien, vi tager e-handlen. Ingen af os lader, som om vi kan det andet." },
    "digitall": { badge: "Officielt samarbejde", why: "Officielt samarbejde om Finago, Omnium og Shopify.", together: "Vi leverer sammen, når projektet spænder over økonomi, OMS og webshop." },
    "microsoft-business-central": { badge: "Nativ kobling", why: "Shopify-kobling, der vedligeholdes af Microsoft.", together: "Vi arbejder med certificerede BC-eksperter og konfigurerer koblingen korrekt." },
    "sage": { badge: "Brightpearl · Inventory Planner", why: "Prognoser og lagerplanlægning for brands i vækst.", together: "Vi tager integrationen, Sage tager driftssystemet." },
    "tripletex": { badge: "Egen standardintegration", why: "Dokumenteret standardintegration, vi selv har bygget og vedligeholder.", together: "Ordrer, betalinger og bilag direkte ind i regnskabet. Norsk ERP-integration er kernen i det, vi laver." },
    "poweroffice-go": { badge: "Egen standardintegration", why: "Dokumenteret standardintegration, vi selv har bygget og vedligeholder.", together: "Regnskabet opdateret uden manuelle bilag – noget udenlandske bureauer sjældent kan levere." },
    "24sevenoffice-finago": { badge: "Egen standardintegration", why: "Dokumenteret standardintegration, vi selv har bygget og vedligeholder.", together: "Shopify og økonomisystemet taler sammen fra dag ét." },
    "omnium": { badge: "Certificeret OMS-partner", why: "Motoren for omnichannel, klik og hent og ship from store.", together: "Et af få bureauer, der leverer Omnium og Shopify i samme team." },
    "isys": { badge: "PIM- og WMS-partner", why: "Feed PIM og InStock WMS til store kataloger.", together: "iSYS ejer produktdata og lager, vi ejer salgsfladen." },
    "holio": { badge: "Officiel partner", why: "Én integration mod hele transportørnetværket – og nu også pluk og WMS.", together: "Logistik løst af folk, der kan logistik, i stedet for noget vi selv skal bygge." },
    "quickship": { badge: "Formel aftale", why: "Fragtløsning til små og mellemstore butikker.", together: "Labels og sporing hurtigt i gang." },
    "helthjem": { badge: "Leveringspartner", why: "Hjemmelevering, som mange af vores kunder bruger.", together: "Korrekt sat op i checkouten fra første dag." },
    "bring": { badge: "Partner", why: "Pakke- og hjemmelevering med Shopify-integration.", together: "Standardtransportøren i de fleste norske opsætninger." },
    "postnord": { badge: "Partner", why: "Nordisk transportør med afhentningssteder og pakkebokse.", together: "Vigtigt, når du sælger til Sverige og Danmark." },
    "klaviyo": { badge: "Partner", why: "Den dybeste Shopify-integration på markedet til e-mail og SMS.", together: "Flows og kampagner, der giver målbar omsætning – ikke bare nyhedsbreve." },
    "voyado": { badge: "Certificeret partner", why: "CRM og loyalitet til større brands.", together: "Voyado tager kundedata og segmentering, vi tager e-handel og integration." },
    "diller": { badge: "Loyalitetspartner", why: "Norsk kundeklub.", together: "En ansvarsfordeling, vi har defineret sammen: Diller ejer medlemskab og point, Shopify webkontoen, OMS ordren." },
    "modish": { badge: "Loyalitetspartner", why: "Tager strategi og drift af loyalitetsprogrammet.", together: "Vi tager den tekniske implementering. Sammen leverer vi hele programmet, ikke bare appen." },
    "brevo": { badge: "E-mailpartner", why: "E-mail og CRM til mindre butikker.", together: "Et godt alternativ, når Klaviyo er mere, end butikken har brug for." },
    "mimir": { badge: "Partner", why: "Norsk AI-kundeservice til e-handel.", together: "Aflaster butikker, der drukner i henvendelser – så du får tid til at drive butik." },
    "supportify": { badge: "Partner", why: "Outsourcet kundeservice med rigtige mennesker.", together: "Når dine kunder vil tale med mennesker, ikke bare en bot." },
    "trustpilot": { badge: "Partner", why: "Kendt af norske forbrugere, og tæller i SEO og AI-søgning.", together: "Stjernerne placeret dér, hvor de konverterer – ikke bare i footeren." },
    "lipscore": { badge: "Partner", why: "Nordiske, verificerede anmeldelser.", together: "Anmeldelser fra rigtige køb, tilpasset nordiske butikker." },
    "judge-me": { badge: "Partner", why: "Billigt og godt til mindre butikker.", together: "Anmeldelser på plads uden en stor månedlig omkostning." },
    "boost": { badge: "Implementeringspartner", why: "Søgning og merchandising til Shopify.", together: "Vi vælger søgeløsning efter katalogstørrelse og behov – ikke af vane." },
    "depict": { badge: "Implementeringspartner", why: "Søgning og merchandising til Shopify.", together: "Vi vælger søgeløsning efter katalogstørrelse og behov – ikke af vane." },
    "tracklution": { badge: "Inkluderet i alle lanceringer", why: "Server-side tracking, der faktisk fanger salgene.", together: "Korrekte data til Meta og Google – altid inkluderet i vores standardpris." },
    "inevo": { badge: "Markedsføringspartner", why: "Performance og vækst.", together: "Vi har vores eget marketingteam – Inevo er partneren, vi henter ind på cases, vi ikke selv tager. De tager markedsføringen, vi tager platform og konvertering." },
    "marketer-com": { badge: "Bureaupartner", why: "Betalt markedsføring og Manta-platformen.", together: "Vi tester Marketer.coms Manta-platform hos udvalgte kunder. De kører annoncerne, vi bygger og optimerer butikken." },
    "moen-co": { badge: "Partner", why: "Community og brand.", together: "Vi er store fans af det, Moen & Co laver, og ser mange synergier – vi bidrager til hinandens vækst." },
    "profitmetrics-reprice-og-circklewise": { badge: "Efter behov", why: "Analyse, prisintelligens og affiliate.", together: "Specialister, vi henter ind, når din butik har brug for det." },
  },
  de: {
    "shopify": { badge: "Shopify Plus Partner", why: "Das ganze Unternehmen ist um die Plattform herum aufgebaut. Plus Partner seit 2024, mit direkten Partnerkontakten und priorisiertem Support.", together: "Wir ergänzen, was Shopify in Norwegen selbst nicht abdeckt: ERP-Integrationen und Kassengesetz-Compliance mit Nexus POS." },
    "make": { badge: "Zertifizierter Partner", why: "Die Integrationsschicht zwischen Shopify und Tripletex, PowerOffice und Business Central.", together: "Integrationen zum Festpreis, schnell geliefert – ohne maßgeschneiderten Code, den Sie selbst pflegen müssen." },
    "anthropic": { badge: "Partner · Startup-Programm", why: "Anthropic-Partner und Mitglied im Startup-Programm.", together: "Wir nutzen Claude in der gesamten Lieferung und bauen KI in die Lösungen unserer Kunden ein – für schnellere Lieferung und smarteren Betrieb." },
    "sanity": { badge: "Technologiepartner", why: "Headless CMS in Hydrogen-Projekten, mit einer Inhaltsebene, die Redakteure tatsächlich bedienen können.", together: "Wir empfehlen Headless nur, wenn es für Ihren Shop sinnvoll ist." },
    "consentmo": { badge: "Gelisteter Partner", why: "Consent- und Compliance-App, gebaut für Shopify.", together: "DSGVO und Google Consent Mode bei jedem einzelnen Launch korrekt eingerichtet." },
    "norce": { badge: "Plattformpartner", why: "Eine Composable-Plattform, die wir von innen kennen.", together: "Wir liefern auf Norce, wenn der Fall passt: komplexe Lösungen und anspruchsvolles B2B, wo die Plattform ihre Stärken ausspielt." },
    "vipps-mobilepay": { badge: "Formelle Vereinbarung", why: "Direkter Dialog mit dem Produktteam, nicht nur eine Support-Warteschlange.", together: "Wir entwickeln Lösungen gemeinsam – wie Vipps Hurtigkasse und Nexus POS – und testen sie früh in echten Geschäften." },
    "nets-nexi": { badge: "PSP-Partner und POS-Händler", why: "Terminals und Abrechnung für Nexus POS.", together: "Kartenzahlung im Geschäft, die mit Shopify spricht – mit einem einzigen Ansprechpartner." },
    "shopify-payments": { badge: "Die Standardwahl", why: "Keine zusätzlichen Transaktionsgebühren, Shop Pay und der einfachste Betrieb.", together: "Wir empfehlen es ehrlich, wenn es passt – keinen Drittanbieter um des Drittanbieters willen." },
    "dintero": { badge: "Implementierungspartner", why: "Norwegischer All-in-one-Checkout: Vipps, Karte, Rechnung und Finanzierung in einer Integration.", together: "Wir sind offen dafür, reine B2B-Projekte gemeinsam umzusetzen." },
    "qliro": { badge: "Premium Partner", why: "Ein echter Klarna-Herausforderer – nordisches BNPL, das neu denkt.", together: "Qliro bringt moderne Lösungen für mehr Conversion und Kundentreue, und wir richten sie von Anfang an korrekt im Checkout ein." },
    "avarda": { badge: "Preferred Shopify Partner", why: "White-Label-Checkout und Zahlung, bei denen der Kunde Ihre Marke sieht – nicht die des Zahlungsanbieters.", together: "Perfekt für den Markenaufbau: Rechnung, Ratenzahlung und die Kundenbeziehung in Ihrem Namen, mit schneller Abrechnung und lokalem Support." },
    "klarna": { badge: "Zahlungspartner", why: "Globales BNPL, das Kunden wiedererkennen.", together: "Wenn Marke und Reichweite am meisten zählen, richten wir Klarna korrekt im Shopify-Checkout ein." },
    "svea": { badge: "Fintech-Partner", why: "Nordisches Fintech für B2B und B2C.", together: "Wenn B2B-Rechnung und Ratenzahlung für Verbraucher bei einem Anbieter liegen sollen." },
    "confect": { badge: "Offizielle Zusammenarbeit", why: "Visma.net-Experten mit demselben Festpreismodell wie wir. Wir teilen uns sogar das Büro.", together: "Confect hat die Visma.net-Anbindung für Nexus POS gebaut. Visma.net und Shopify im gleichen Tempo und zum Festpreis geliefert." },
    "totall-digitall": { badge: "Bevorzugter Finago-Partner", why: "Wenn Kasse, Filialdaten und Buchhaltung zusammenkommen sollen.", together: "toTALL übernimmt die Finanzen, wir den E-Commerce. Keiner von uns tut so, als könnte er das andere." },
    "digitall": { badge: "Offizielle Zusammenarbeit", why: "Offizielle Zusammenarbeit bei Finago, Omnium und Shopify.", together: "Wir liefern gemeinsam, wenn das Projekt Finanzen, OMS und Onlineshop umfasst." },
    "microsoft-business-central": { badge: "Native Anbindung", why: "Eine Shopify-Anbindung, die von Microsoft gepflegt wird.", together: "Wir arbeiten mit zertifizierten BC-Experten und konfigurieren die Anbindung korrekt." },
    "sage": { badge: "Brightpearl · Inventory Planner", why: "Prognosen und Bestandsplanung für wachsende Marken.", together: "Wir übernehmen die Integration, Sage das Betriebssystem." },
    "tripletex": { badge: "Eigene Standardintegration", why: "Eine dokumentierte Standardintegration, die wir selbst gebaut haben und pflegen.", together: "Bestellungen, Zahlungen und Belege direkt in die Buchhaltung. Norwegische ERP-Integration ist der Kern unserer Arbeit." },
    "poweroffice-go": { badge: "Eigene Standardintegration", why: "Eine dokumentierte Standardintegration, die wir selbst gebaut haben und pflegen.", together: "Die Buchhaltung bleibt ohne manuelle Belege aktuell – etwas, das ausländische Agenturen selten liefern." },
    "24sevenoffice-finago": { badge: "Eigene Standardintegration", why: "Eine dokumentierte Standardintegration, die wir selbst gebaut haben und pflegen.", together: "Shopify und das Finanzsystem sprechen vom ersten Tag an miteinander." },
    "omnium": { badge: "Zertifizierter OMS-Partner", why: "Der Motor für Omnichannel, Click & Collect und Ship from Store.", together: "Eine der wenigen Agenturen, die Omnium und Shopify im selben Team liefern." },
    "isys": { badge: "PIM- und WMS-Partner", why: "Feed PIM und InStock WMS für große Kataloge.", together: "iSYS verantwortet Produktdaten und Lager, wir die Verkaufsfläche." },
    "holio": { badge: "Offizieller Partner", why: "Eine Integration zum gesamten Carrier-Netzwerk – und jetzt auch Kommissionierung und WMS.", together: "Logistik, gelöst von Leuten, die Logistik können, statt etwas, das wir selbst bauen müssten." },
    "quickship": { badge: "Formelle Vereinbarung", why: "Versandlösung für kleine und mittlere Shops.", together: "Etiketten und Sendungsverfolgung schnell einsatzbereit." },
    "helthjem": { badge: "Lieferpartner", why: "Heimlieferung, die viele unserer Kunden nutzen.", together: "Vom ersten Tag an korrekt im Checkout eingerichtet." },
    "bring": { badge: "Partner", why: "Paket- und Heimlieferung mit Shopify-Integration.", together: "Der Standard-Carrier in den meisten norwegischen Setups." },
    "postnord": { badge: "Partner", why: "Nordischer Carrier mit Abholstellen und Paketboxen.", together: "Wichtig, wenn Sie nach Schweden und Dänemark verkaufen." },
    "klaviyo": { badge: "Partner", why: "Die tiefste Shopify-Integration am Markt für E-Mail und SMS.", together: "Flows und Kampagnen, die messbaren Umsatz bringen – nicht nur Newsletter." },
    "voyado": { badge: "Zertifizierter Partner", why: "CRM und Loyalität für größere Marken.", together: "Voyado übernimmt Kundendaten und Segmentierung, wir E-Commerce und Integration." },
    "diller": { badge: "Loyalitätspartner", why: "Norwegisches Kundenprogramm.", together: "Eine Aufgabenteilung, die wir gemeinsam definiert haben: Diller verantwortet Mitgliedschaft und Punkte, Shopify das Onlinekonto, das OMS die Bestellung." },
    "modish": { badge: "Loyalitätspartner", why: "Übernimmt Strategie und Betrieb des Treueprogramms.", together: "Wir übernehmen die technische Umsetzung. Gemeinsam liefern wir das ganze Programm, nicht nur die App." },
    "brevo": { badge: "E-Mail-Partner", why: "E-Mail und CRM für kleinere Shops.", together: "Eine gute Alternative, wenn Klaviyo mehr ist, als der Shop braucht." },
    "mimir": { badge: "Partner", why: "Norwegischer KI-Kundenservice für den E-Commerce.", together: "Entlastet Shops, die in Anfragen ertrinken – damit Sie Zeit haben, Ihr Geschäft zu führen." },
    "supportify": { badge: "Partner", why: "Ausgelagerter Kundenservice mit echten Menschen.", together: "Wenn Ihre Kunden mit Menschen sprechen wollen, nicht nur mit einem Bot." },
    "trustpilot": { badge: "Partner", why: "Norwegischen Verbrauchern vertraut, und zählt in SEO und KI-Suche.", together: "Die Sterne dort platziert, wo sie konvertieren – nicht nur im Footer." },
    "lipscore": { badge: "Partner", why: "Nordische, verifizierte Bewertungen.", together: "Bewertungen aus echten Käufen, zugeschnitten auf nordische Shops." },
    "judge-me": { badge: "Partner", why: "Günstig und solide für kleinere Shops.", together: "Bewertungen im Einsatz ohne hohe Monatskosten." },
    "boost": { badge: "Implementierungspartner", why: "Suche und Merchandising für Shopify.", together: "Wir wählen die Suchlösung nach Kataloggröße und Bedarf – nicht aus Gewohnheit." },
    "depict": { badge: "Implementierungspartner", why: "Suche und Merchandising für Shopify.", together: "Wir wählen die Suchlösung nach Kataloggröße und Bedarf – nicht aus Gewohnheit." },
    "tracklution": { badge: "In jedem Launch enthalten", why: "Server-side Tracking, das die Verkäufe tatsächlich erfasst.", together: "Korrekte Daten für Meta und Google – immer in unserem Standardpreis enthalten." },
    "inevo": { badge: "Marketingpartner", why: "Performance und Wachstum.", together: "Wir haben ein eigenes Marketingteam – Inevo ist der Partner, den wir für Fälle hinzuziehen, die wir nicht selbst übernehmen. Sie machen das Marketing, wir Plattform und Conversion." },
    "marketer-com": { badge: "Agenturpartner", why: "Bezahltes Marketing und die Manta-Plattform.", together: "Wir testen die Manta-Plattform von Marketer.com bei ausgewählten Kunden. Sie schalten die Anzeigen, wir bauen und optimieren den Shop." },
    "moen-co": { badge: "Partner", why: "Community und Marke.", together: "Wir sind große Fans dessen, was Moen & Co machen, und sehen viele Synergien – wir tragen zum Wachstum des anderen bei." },
    "profitmetrics-reprice-og-circklewise": { badge: "Bei Bedarf", why: "Analyse, Preisintelligenz und Affiliate.", together: "Spezialisten, die wir hinzuziehen, wenn Ihr Shop sie braucht." },
  },
}

/** Category title in the page language; Norwegian on .no, English for unknown locales. */
export const categoryTitle = (key: string, language = 'no') => {
  const c = partnerCategories.find((c) => c.key === key)
  if (!c) return key
  switch (partnerLang(language)) {
    case 'no': return c.title
    case 'sv': return c.titleSv
    case 'da': return c.titleDa
    case 'de': return c.titleDe
    default: return c.titleEn
  }
}

/**
 * Swap the Norwegian badge/why/together for the page language on
 * non-Norwegian pages. Run it after `mergePartners`, which fills gaps on the
 * Norwegian fields. Norwegian returns the same array; a slug without a
 * translation falls back to English.
 */
export function localizePartners(entries: PartnerEntry[], language: string): PartnerEntry[] {
  const lang = partnerLang(language)
  if (lang === 'no') return entries
  const table = lang === 'en' ? undefined : partnerTranslations[lang]
  return entries.map((p) => {
    const t = table?.[p.slug]
    return { ...p, badge: t?.badge || p.badgeEn || p.badge, why: t?.why || p.whyEn || p.why, together: t?.together || p.togetherEn || p.together }
  })
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
