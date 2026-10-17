/**
 * Partner catalog for /partnere: who we work with, why they are on the list
 * and what the customer gets from the pairing. Logos live under
 * /public/images/partners. Text entries in the Sanity partnersPage document
 * (partnersGrid.partners) override these by name, so editors can adjust copy
 * without touching code; this file is the seed and the fallback.
 */

export type PartnerCategoryKey = 'plattform' | 'betaling' | 'erp' | 'logistikk' | 'crm' | 'kundeservice' | 'reviews' | 'vekst'

export interface PartnerEntry {
  slug: string
  name: string
  category: PartnerCategoryKey
  /** Formal relationship, shown as a tag: "Shopify Plus Partner", "Formell avtale" … */
  badge: string
  /** Core partners are the ones we build nearly everything with. */
  core: boolean
  /** Why the partner is on the list. */
  why: string
  /** What the customer gets from us working together. */
  together: string
  logo: string | null
  /** Monogram when there is no logo file. */
  mono?: string
  monoBg?: string
  monoFg?: string
}

export const partnerCategories: { key: PartnerCategoryKey; title: string }[] = [
  { key: "plattform", title: "Plattform og integrasjon" },
  { key: "betaling", title: "Betaling og BNPL" },
  { key: "erp", title: "ERP og regnskap" },
  { key: "logistikk", title: "OMS, logistikk og lager" },
  { key: "crm", title: "Lojalitet, CRM og e-post" },
  { key: "kundeservice", title: "Kundeservice" },
  { key: "reviews", title: "Anmeldelser, søk og merchandising" },
  { key: "vekst", title: "Markedsføring og vekst" },
]

export const partnerCatalog: PartnerEntry[] = [
  { slug: "shopify", name: "Shopify", category: "plattform", badge: "Shopify Plus Partner", core: true, why: "Hele selskapet er bygget rundt plattformen. Plus Partner siden 2024, med direkte partnerkontakter og prioritert support.", together: "Vi legger til det Shopify ikke dekker selv i Norge: ERP-integrasjoner og kasselov-compliance med Nexus POS.", logo: "/images/partners/shopify.png" },
  { slug: "make", name: "Make", category: "plattform", badge: "Sertifisert partner", core: true, why: "Integrasjonslaget mellom Shopify og Tripletex, PowerOffice og Business Central.", together: "Integrasjoner til fastpris, levert raskt – uten skreddersydd kode du må vedlikeholde selv.", logo: "/images/partners/make.png" },
  { slug: "anthropic", name: "Anthropic", category: "plattform", badge: "Partner · Startup-programmet", core: false, why: "Anthropic-partner og med i deres startup-program.", together: "Vi bruker Claude i hele leveransen og bygger AI inn i løsningene til kundene våre – for raskere levering og smartere drift.", logo: "/images/partners/anthropic.webp" },
  { slug: "sanity", name: "Sanity", category: "plattform", badge: "Teknologipartner", core: false, why: "Headless CMS i Hydrogen-prosjekter, med et innholdslag redaktørene faktisk klarer å bruke.", together: "Vi anbefaler headless bare når det gir mening for butikken din.", logo: "/images/partners/sanity.png" },
  { slug: "consentmo", name: "Consentmo", category: "plattform", badge: "Listet partner", core: false, why: "Samtykke- og compliance-app bygget for Shopify.", together: "GDPR og Google Consent Mode riktig satt opp i hver eneste lansering.", logo: "/images/partners/consentmo.png" },
  { slug: "norce", name: "Norce", category: "plattform", badge: "Plattformpartner", core: false, why: "Composable-plattform vi kjenner fra innsiden.", together: "Vi leverer på Norce når caset passer: komplekse løsninger og tung B2B, der plattformen virkelig kommer til sin rett.", logo: null, mono: "N" },
  { slug: "vipps-mobilepay", name: "Vipps MobilePay", category: "betaling", badge: "Formell avtale", core: true, why: "Direkte dialog med produktteamet, ikke bare en supportkø.", together: "Vi utvikler løsninger sammen – som Vipps Hurtigkasse og Nexus POS – og tester dem tidlig hos ekte butikker.", logo: "/images/partners/vipps-mobilepay.png" },
  { slug: "nets-nexi", name: "Nets / Nexi", category: "betaling", badge: "PSP-partner og POS-forhandler", core: true, why: "Terminaler og oppgjør for Nexus POS.", together: "Kortbetaling i butikken som snakker med Shopify – med én leverandør å forholde seg til.", logo: "/images/partners/nets-nexi.png" },
  { slug: "shopify-payments", name: "Shopify Payments", category: "betaling", badge: "Standardvalget", core: false, why: "Null ekstra transaksjonsgebyr, Shop Pay og enklest mulig drift.", together: "Vi anbefaler det ærlig når det passer – ikke en tredjepart for tredjepartens skyld.", logo: "/images/partners/shopify-payments.png" },
  { slug: "dintero", name: "Dintero", category: "betaling", badge: "Implementeringspartner", core: false, why: "Norsk samlet checkout: Vipps, kort, faktura og finansiering i én integrasjon.", together: "Vi er åpne for å levere rene B2B-prosjekter sammen.", logo: "/images/partners/dintero.png" },
  { slug: "qliro", name: "Qliro", category: "betaling", badge: "Premium Partner", core: true, why: "En reell Klarna-utfordrer – nordisk BNPL som er villig til å tenke nytt.", together: "Qliro kommer med moderne løsninger for økt konvertering og kundelojalitet, og vi setter dem opp riktig i checkouten fra start.", logo: "/images/partners/qliro.png" },
  { slug: "avarda", name: "Avarda", category: "betaling", badge: "Preferred Shopify Partner", core: false, why: "White label-checkout og betaling der det er din merkevare kunden ser – ikke betalingsleverandørens.", together: "Perfekt for merkevarebygging: faktura, delbetaling og kundeforholdet i ditt navn, med raskt oppgjør og lokal støtte.", logo: "/images/partners/avarda.png" },
  { slug: "klarna", name: "Klarna", category: "betaling", badge: "Betalingspartner", core: false, why: "Global BNPL som kundene kjenner igjen.", together: "Når merkevare og rekkevidde veier tyngst, setter vi opp Klarna riktig i Shopify-checkouten.", logo: null, mono: "K.", monoBg: "#FFB3C7", monoFg: "#0B051D" },
  { slug: "svea", name: "Svea", category: "betaling", badge: "Fintechpartner", core: false, why: "Nordisk fintech for både B2B og B2C.", together: "Når B2B-faktura og delbetaling for forbrukere skal samles hos én aktør.", logo: "/images/partners/svea.png" },
  { slug: "confect", name: "Confect", category: "erp", badge: "Offisielt samarbeid", core: true, why: "Visma.net-eksperter med samme fastprismodell som oss. Vi deler til og med kontor.", together: "Confect bygget Visma.net-koblingen til Nexus POS. Visma.net og Shopify levert i samme tempo og til fast pris.", logo: "/images/partners/confect.png" },
  { slug: "totall-digitall", name: "toTALL / digiTALL", category: "erp", badge: "Foretrukket Finago-partner", core: false, why: "Når kasse, butikkdata og regnskap skal samles.", together: "toTALL tar økonomien, vi tar e-handelen. Ingen av oss later som vi kan det andre.", logo: "/images/partners/totall-digitall.png" },
  { slug: "digitall", name: "Digitall", category: "erp", badge: "Offisielt samarbeid", core: true, why: "Offisielt samarbeid på Finago, Omnium og Shopify.", together: "Vi leverer sammen når prosjektet spenner over økonomi, OMS og nettbutikk.", logo: "/images/partners/digitall.png" },
  { slug: "microsoft-business-central", name: "Microsoft Business Central", category: "erp", badge: "Nativ kobling", core: false, why: "Shopify-kobling som vedlikeholdes av Microsoft.", together: "Vi jobber med sertifiserte BC-eksperter og konfigurerer koblingen riktig.", logo: "/images/partners/microsoft-business-central.png" },
  { slug: "sage", name: "Sage", category: "erp", badge: "Brightpearl · Inventory Planner", core: false, why: "Prognoser og lagerplanlegging for merkevarer i vekst.", together: "Vi tar integrasjonen, Sage tar driftssystemet.", logo: "/images/partners/sage.png" },
  { slug: "tripletex", name: "Tripletex", category: "erp", badge: "Egen standardintegrasjon", core: false, why: "Dokumentert standardintegrasjon vi har bygget og vedlikeholder selv.", together: "Ordre, betalinger og bilag rett inn i regnskapet. Norsk ERP-integrasjon er kjernen i det vi gjør.", logo: "/images/partners/tripletex.png" },
  { slug: "poweroffice-go", name: "PowerOffice Go", category: "erp", badge: "Egen standardintegrasjon", core: false, why: "Dokumentert standardintegrasjon vi har bygget og vedlikeholder selv.", together: "Regnskapet oppdatert uten manuelle bilag – noe utenlandske byråer sjelden kan levere.", logo: "/images/partners/poweroffice-go.png" },
  { slug: "24sevenoffice-finago", name: "24SevenOffice / Finago", category: "erp", badge: "Egen standardintegrasjon", core: false, why: "Dokumentert standardintegrasjon vi har bygget og vedlikeholder selv.", together: "Shopify og økonomisystemet snakker sammen fra dag én.", logo: "/images/partners/24sevenoffice-finago.png" },
  { slug: "omnium", name: "Omnium", category: "logistikk", badge: "Sertifisert OMS-partner", core: true, why: "Motoren for omnikanal, klikk og hent og ship from store.", together: "Et av få byråer som leverer Omnium og Shopify i samme team.", logo: "/images/partners/omnium.png" },
  { slug: "isys", name: "iSYS", category: "logistikk", badge: "PIM- og WMS-partner", core: false, why: "Feed PIM og InStock WMS for store kataloger.", together: "iSYS eier produktdata og lager, vi eier salgsflaten.", logo: "/images/partners/isys.png" },
  { slug: "holio", name: "Holio", category: "logistikk", badge: "Offisiell partner", core: false, why: "Én integrasjon mot hele transportørnettverket – og nå også plukk og WMS.", together: "Logistikk løst av folk som kan logistikk, i stedet for noe vi må bygge selv.", logo: "/images/partners/holio.png" },
  { slug: "quickship", name: "Quickship", category: "logistikk", badge: "Formell avtale", core: false, why: "Fraktløsning for små og mellomstore butikker.", together: "Etiketter og sporing raskt i gang.", logo: "/images/partners/quickship.png" },
  { slug: "helthjem", name: "Helthjem", category: "logistikk", badge: "Leveringspartner", core: false, why: "Hjemlevering som mange av kundene våre bruker.", together: "Riktig satt opp i checkouten fra første dag.", logo: "/images/partners/helthjem.webp" },
  { slug: "bring", name: "Bring", category: "logistikk", badge: "Partner", core: false, why: "Pakke- og hjemlevering med Shopify-integrasjon.", together: "Standardtransportøren i de fleste norske oppsett.", logo: "/images/partners/bring.png" },
  { slug: "postnord", name: "PostNord", category: "logistikk", badge: "Partner", core: false, why: "Nordisk transportør med hentesteder og pakkebokser.", together: "Viktig når du selger til Sverige og Danmark.", logo: "/images/partners/postnord.webp" },
  { slug: "klaviyo", name: "Klaviyo", category: "crm", badge: "Partner", core: true, why: "Den dypeste Shopify-integrasjonen på markedet for e-post og SMS.", together: "Flyter og kampanjer som gir målbar omsetning – ikke bare nyhetsbrev.", logo: "/images/partners/klaviyo.png" },
  { slug: "voyado", name: "Voyado", category: "crm", badge: "Sertifisert partner", core: false, why: "CRM og lojalitet for større merkevarer.", together: "Voyado tar kundedata og segmentering, vi tar e-handel og integrasjon.", logo: "/images/partners/voyado.png" },
  { slug: "diller", name: "Diller", category: "crm", badge: "Lojalitetspartner", core: false, why: "Norsk kundeklubb.", together: "En ansvarsdeling vi har definert sammen: Diller eier medlemskap og poeng, Shopify nettkontoen, OMS ordren.", logo: "/images/partners/diller.png" },
  { slug: "modish", name: "Modish", category: "crm", badge: "Lojalitetspartner", core: false, why: "Tar strategi og drift av lojalitetsprogrammet.", together: "Vi tar teknisk implementering. Sammen leverer vi hele programmet, ikke bare appen.", logo: "/images/partners/modish.png" },
  { slug: "brevo", name: "Brevo", category: "crm", badge: "E-postpartner", core: false, why: "E-post og CRM for mindre butikker.", together: "Et godt alternativ når Klaviyo er mer enn butikken trenger.", logo: "/images/partners/brevo.png" },
  { slug: "mimir", name: "Mimir", category: "kundeservice", badge: "Partner", core: false, why: "Norsk AI-kundeservice for netthandel.", together: "Avlaster butikker som drukner i henvendelser – så du får tid til å drive butikk.", logo: "/images/partners/mimir.webp" },
  { slug: "supportify", name: "Supportify", category: "kundeservice", badge: "Partner", core: false, why: "Outsourcet kundeservice med ekte mennesker.", together: "Når kundene dine vil snakke med folk, ikke bare en bot.", logo: "/images/partners/supportify.png" },
  { slug: "trustpilot", name: "Trustpilot", category: "reviews", badge: "Partner", core: false, why: "Kjent for norske forbrukere, og teller i SEO og AI-søk.", together: "Stjernene plassert der de konverterer – ikke bare i footeren.", logo: "/images/partners/trustpilot.png" },
  { slug: "lipscore", name: "Lipscore", category: "reviews", badge: "Partner", core: false, why: "Nordiske, verifiserte anmeldelser.", together: "Anmeldelser fra ekte kjøp, tilpasset nordiske butikker.", logo: "/images/partners/lipscore.png" },
  { slug: "judge-me", name: "Judge.me", category: "reviews", badge: "Partner", core: false, why: "Rimelig og godt for mindre butikker.", together: "Anmeldelser på plass uten en stor månedskostnad.", logo: null, mono: "J" },
  { slug: "boost", name: "Boost", category: "reviews", badge: "Implementeringspartner", core: false, why: "Søk og merchandising for Shopify.", together: "Vi velger søkeløsning etter katalogstørrelse og behov – ikke etter vane.", logo: null, mono: "B" },
  { slug: "depict", name: "Depict", category: "reviews", badge: "Implementeringspartner", core: false, why: "Søk og merchandising for Shopify.", together: "Vi velger søkeløsning etter katalogstørrelse og behov – ikke etter vane.", logo: "/images/partners/depict.png" },
  { slug: "tracklution", name: "Tracklution", category: "vekst", badge: "Inkludert i alle lanseringer", core: true, why: "Server-side tracking som faktisk fanger opp salgene.", together: "Korrekte data til Meta og Google – alltid inkludert i standardprisen vår.", logo: "/images/partners/tracklution.png" },
  { slug: "inevo", name: "Inevo", category: "vekst", badge: "Markedsføringspartner", core: false, why: "Performance og vekst.", together: "Vi har eget markedsføringsteam – Inevo er partneren vi henter inn på caser vi ikke tar selv. De tar markedsføringen, vi tar plattform og konvertering.", logo: "/images/partners/inevo.png" },
  { slug: "marketer-com", name: "Marketer.com", category: "vekst", badge: "Byråpartner", core: false, why: "Betalt markedsføring og Manta-plattformen.", together: "Vi tester Manta-plattformen til Marketer.com hos utvalgte kunder. De kjører annonsene, vi bygger og optimaliserer butikken.", logo: null, mono: "M" },
  { slug: "moen-co", name: "Moen & Co", category: "vekst", badge: "Partner", core: false, why: "Community og merkevare.", together: "Vi er store fans av det Moen & Co gjør og ser mange synergier – vi bidrar til hverandres vekst.", logo: "/images/partners/moen-co.webp" },
  { slug: "profitmetrics-reprice-og-circklewise", name: "ProfitMetrics, Reprice og Circklewise", category: "vekst", badge: "Ved behov", core: false, why: "Analyse, prisintelligens og affiliate.", together: "Spesialister vi henter inn når butikken din trenger det.", logo: "/images/partners/profitmetrics-reprice-og-circklewise.png" },
]

export const categoryTitle = (key: string) => partnerCategories.find((c) => c.key === key)?.title ?? key

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
