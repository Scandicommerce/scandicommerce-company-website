// TARGET_DATASET=production npx sanity exec scripts/sanity-mirror-com.ts --with-user-token
//
// Brings scandicommerce.com in line with the Norwegian site:
//  - Main Menu on the en/sv/da/de header documents (same structure as the NO one)
//  - hero video + NOK prices + the current brand logos on the English homepage
//  - sv/da homepages rebuilt onto the NO section order with real copy
//  - a German homepage (none existed)
// Writes published documents directly; idempotent.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
type Doc = Record<string, any>

const VIDEO = {
  heroVideoFile: { _type: 'file', asset: { _type: 'reference', _ref: 'file-bfc2205ced0241f5080d881fbbb8d85d4800274f-mp4' } },
  heroVideoFileMobile: { _type: 'file', asset: { _type: 'reference', _ref: 'file-28b06fb5a84c2d4a146b3546b580df9d02724a71-mp4' } },
}

const menu = (t: Record<string, string>) => [
  { _type: 'menuItem', _key: 'services', label: t.services, columns: [
    { _type: 'menuColumn', _key: 'deliveries', title: t.services, items: [
      { _type: 'menuLink', _key: 'sv-dev', label: t.dev, href: '/services/shopify-development' },
      { _type: 'menuLink', _key: 'sv-migrate', label: t.migrate, href: '/services/migrate' },
      { _type: 'menuLink', _key: 'sv-pos', label: 'Shopify POS', href: '/services/shopify-pos' },
    ] },
    { _type: 'menuColumn', _key: 'packages', title: t.packages, items: [
      { _type: 'menuLink', _key: 'pk-all', label: t.allPackages, href: '/services/all-packages' },
      { _type: 'menuLink', _key: 'pk-growth', label: 'Growth', href: '/services/all-packages/growth', indent: true },
      { _type: 'menuLink', _key: 'pk-premium', label: 'Premium', href: '/services/all-packages/premium', indent: true },
      { _type: 'menuLink', _key: 'pk-enterprise', label: 'Enterprise', href: '/services/all-packages/enterprise', indent: true },
    ] },
  ] },
  { _type: 'menuItem', _key: 'partners', label: t.partners, href: '/partners' },
  { _type: 'menuItem', _key: 'work', label: t.work, href: '/work' },
  { _type: 'menuItem', _key: 'about', label: t.about, href: '/about' },
  { _type: 'menuItem', _key: 'contact', label: t.contact, href: '/contact' },
]
const MENUS: Record<string, Record<string, string>> = {
  en: { services: 'Services', dev: 'Shopify development', migrate: 'Migration to Shopify', packages: 'Packages', allPackages: 'All packages', partners: 'Partners', work: 'Case studies', about: 'About', contact: 'Contact' },
  sv: { services: 'Tjänster', dev: 'Shopify-utveckling', migrate: 'Migrering till Shopify', packages: 'Paket', allPackages: 'Alla paket', partners: 'Partners', work: 'Kundcase', about: 'Om oss', contact: 'Kontakt' },
  da: { services: 'Tjenester', dev: 'Shopify-udvikling', migrate: 'Migrering til Shopify', packages: 'Pakker', allPackages: 'Alle pakker', partners: 'Partnere', work: 'Kundecases', about: 'Om os', contact: 'Kontakt' },
  de: { services: 'Leistungen', dev: 'Shopify-Entwicklung', migrate: 'Migration zu Shopify', packages: 'Pakete', allPackages: 'Alle Pakete', partners: 'Partner', work: 'Kundenprojekte', about: 'Über uns', contact: 'Kontakt' },
}

/** Copy per language for the homepage sections that sv/da/de get rebuilt or created from. */
const COPY: Record<string, Doc> = {
  sv: {
    hero: { heroBadge: 'Vi förstår vad som gör en stack fantastisk', heroTitle: { text: 'Shopify Plus-byrå i Norge med fastprispaket', highlight: 'fastpris' }, heroDescription: 'Den enda norska Shopify Plus-partnern där du köper tjänster som produkter. Transparenta priser. Inget offertpingis. Lansera på veckor, inte månader.', heroTagline: 'Transparenta priser · Paketerade tjänster · Inget byrådrama', buttons: ['Se våra tjänster', 'Våra kunder'] },
    trustedBy: 'Stolt samarbetspartner till över 30 norska varumärken',
    results: { title: 'Resultat, inte löften', subtitle: 'Välj det du behöver. Vet vad du betalar', cta: 'Läs caset', items: [['Omsättningstillväxt år över år', '+35%', 'En temauppdatering som gav ökad omsättning, högre konverteringsgrad, högre snittorder och starkare kundlojalitet.'], ['Migrering till Shopify', '12 000+ artiklar', 'Komplett migrering från WooCommerce'], ['Ökad konverteringsgrad', '+100%', 'Komplett omdesign och CRO-optimering']] },
    testimonial: 'Jag har jobbat med Scandicommerce-teamet med allt som rör Shopify, och upplevelsen har varit enastående. De "fixar" inte bara saker – de tänker lönsamhet, användarupplevelse och långsiktig tillväxt. Kommunikationen är tydlig och de tar ägarskap för resultaten. En riktig partner för tillväxt.',
    process: { title: 'Så arbetar vi', subtitle: 'Enkelt, transparent och effektivt', steps: [['Se tjänsterna', 'Titta på våra paket med tydliga priser'], ['Välj ditt paket', 'Välj det som passar dina behov'], ['Boka ett förutsättningslöst samtal', '15 minuter för att stämma av detaljerna'], ['Bygg och lansera', 'Vi genomför, du godkänner, vi lanserar']] },
    showcase: { title: { text: 'Shopify-tjänster, paketerade som produkter', highlight: 'Shopify-tjänster' }, subtitle: 'Välj det du behöver. Vet vad du betalar. Sätt igång.', contact: 'Kontakta oss', categories: [['Bygg', 'Nya butiker, migreringar, specialutveckling', 'Från 49 000 NOK'], ['Optimera', 'CRO, hastighet, AI, analysuppsättning', 'Från 15 000 NOK'], ['Support', 'Retainer, utbildning, löpande stöd', 'Från 3 500 NOK/månad']], details: 'Visa detaljer', monthly: 'månadsvis', packages: [['Growth', 'Skala din befintliga butik', '8 000 NOK', ['Medelstora varumärken som vill skala', 'Behov av egen kod', 'Fler konverteringar']], ['Premium', 'Komplexa e-handelslösningar', '15 000 NOK', ['Etablerade varumärken med komplexa flöden, B2B och B2C', 'A/B-testning']], ['Enterprise', 'För drift i stor skala', '30 000 NOK, anpassat', ['Drift av flera butiker', 'Internationell expansion för företag med hög volym']]], viewAll: 'Se alla tjänster' },
    blog: { eyebrow: 'Blogg', title: 'Nyheter och guider', link: 'Till bloggen' },
    cta: { title: 'Redo att sluta leta efter byråer och börja leta efter tjänster?', subtitle: 'Bläddra bland våra paket eller prata med oss om ditt projekt', buttons: ['Se paketen', 'Boka ett förutsättningslöst samtal'] },
    seo: { metaTitle: 'Shopify Plus-byrå i Norge | scandicommerce', metaDescription: 'scandicommerce är en Shopify Plus-partnerbyrå i Oslo: nya butiker, plattformsmigreringar och nordiska integrationer till fast pris.' },
    pageTitle: 'Startsida',
  },
  da: {
    hero: { heroBadge: 'Vi forstår, hvad der gør en stack fantastisk', heroTitle: { text: 'Shopify Plus-bureau i Norge med fastprispakker', highlight: 'fastpris' }, heroDescription: 'Den eneste norske Shopify Plus-partner, hvor du køber ydelser som produkter. Gennemsigtige priser. Ingen tilbuds-pingpong. Lancér på uger, ikke måneder.', heroTagline: 'Gennemsigtige priser · Produktiserede pakker · Intet bureaudrama', buttons: ['Se vores ydelser', 'Vores kunder'] },
    trustedBy: 'Stolt samarbejdspartner for over 30 norske brands',
    results: { title: 'Resultater, ikke løfter', subtitle: 'Vælg det, du har brug for. Vid, hvad du betaler', cta: 'Læs casen', items: [['Omsætningsvækst år over år', '+35%', 'En temaopdatering, der gav øget omsætning, højere konverteringsrate, højere gennemsnitsordre og stærkere kundeloyalitet.'], ['Migrering til Shopify', '12.000+ varenumre', 'Komplet migrering fra WooCommerce'], ['Øget konverteringsrate', '+100%', 'Komplet redesign og CRO-optimering']] },
    testimonial: 'Jeg har arbejdet med Scandicommerce-teamet på alt, der har med Shopify at gøre, og oplevelsen har været enestående. De "fikser" ikke bare ting – de tænker lønsomhed, brugeroplevelse og langsigtet vækst. Kommunikationen er tydelig, og de tager ejerskab for resultaterne. En ægte partner for vækst.',
    process: { title: 'Sådan arbejder vi', subtitle: 'Enkelt, gennemsigtigt og effektivt', steps: [['Se ydelserne', 'Se vores pakker med gennemsigtige priser'], ['Vælg din pakke', 'Vælg det, der passer til dine behov'], ['Book en uforpligtende samtale', '15 minutter til at afstemme detaljerne'], ['Byg og lancér', 'Vi udfører, du godkender, vi lancerer']] },
    showcase: { title: { text: 'Shopify-ydelser, pakket som produkter', highlight: 'Shopify-ydelser' }, subtitle: 'Vælg det, du har brug for. Vid, hvad du betaler. Kom i gang.', contact: 'Kontakt os', categories: [['Byg', 'Nye butikker, migreringer, specialudvikling', 'Fra 49.000 NOK'], ['Optimér', 'CRO, hastighed, AI, opsætning af analyser', 'Fra 15.000 NOK'], ['Support', 'Retainer, træning, løbende hjælp', 'Fra 3.500 NOK/md.']], details: 'Se detaljer', monthly: 'månedligt', packages: [['Growth', 'Skalér din eksisterende butik', '8.000 NOK', ['Mellemstore brands, der skal skalere', 'Behov for egen kode', 'Flere konverteringer']], ['Premium', 'Komplekse e-handelsløsninger', '15.000 NOK', ['Etablerede brands med komplekse flows, B2B og B2C', 'A/B-test']], ['Enterprise', 'Til drift i stor skala', '30.000 NOK, tilpasset', ['Drift af flere butikker', 'International ekspansion for virksomheder med høj volumen']]], viewAll: 'Se alle ydelser' },
    blog: { eyebrow: 'Blog', title: 'Nyheder og guides', link: 'Til bloggen' },
    cta: { title: 'Klar til at holde op med at lede efter bureauer og begynde at lede efter ydelser?', subtitle: 'Se vores pakker, eller tal med os om dit projekt', buttons: ['Se pakkerne', 'Book en uforpligtende samtale'] },
    seo: { metaTitle: 'Shopify Plus-bureau i Norge | scandicommerce', metaDescription: 'scandicommerce er et Shopify Plus-partnerbureau i Oslo: nye butikker, platformmigreringer og nordiske integrationer til fast pris.' },
    pageTitle: 'Forside',
  },
  de: {
    hero: { heroBadge: 'Wir wissen, was einen großartigen Stack ausmacht', heroTitle: { text: 'Shopify Plus-Agentur in Norwegen mit Festpreispaketen', highlight: 'Festpreis' }, heroDescription: 'Der einzige norwegische Shopify Plus-Partner, bei dem Sie Leistungen wie Produkte kaufen. Transparente Preise. Kein Hin und Her mit Angeboten. Launch in Wochen, nicht Monaten.', heroTagline: 'Transparente Preise · Paketierte Leistungen · Kein Agentur-Drama', buttons: ['Leistungen ansehen', 'Unsere Kunden'] },
    trustedBy: 'Stolzer Partner von über 30 norwegischen Marken',
    results: { title: 'Ergebnisse statt Versprechen', subtitle: 'Wählen Sie, was Sie brauchen. Wissen Sie, was Sie zahlen', cta: 'Zur Case Study', items: [['Umsatzwachstum im Jahresvergleich', '+35%', 'Ein Theme-Update, das mehr Umsatz, eine höhere Conversion-Rate, einen höheren Warenkorbwert und stärkere Kundenbindung brachte.'], ['Migration zu Shopify', '12.000+ Artikel', 'Komplette Migration von WooCommerce'], ['Höhere Conversion-Rate', '+100%', 'Komplettes Redesign und CRO-Optimierung']] },
    testimonial: 'Ich habe mit dem Scandicommerce-Team an allem rund um Shopify gearbeitet, und die Erfahrung war herausragend. Sie "reparieren" nicht nur – sie denken an Rentabilität, Nutzererlebnis und langfristiges Wachstum. Die Kommunikation ist klar, und sie übernehmen Verantwortung für die Ergebnisse. Ein echter Wachstumspartner.',
    process: { title: 'So arbeiten wir', subtitle: 'Einfach, transparent und effektiv', steps: [['Leistungen ansehen', 'Unsere Pakete mit klaren Preisen'], ['Paket wählen', 'Wählen Sie, was zu Ihren Anforderungen passt'], ['Unverbindliches Gespräch buchen', '15 Minuten, um die Details zu klären'], ['Bauen und launchen', 'Wir setzen um, Sie geben frei, wir gehen live']] },
    showcase: { title: { text: 'Shopify-Leistungen, paketiert wie Produkte', highlight: 'Shopify-Leistungen' }, subtitle: 'Wählen Sie, was Sie brauchen. Wissen Sie, was Sie zahlen. Legen Sie los.', contact: 'Kontakt aufnehmen', categories: [['Aufbau', 'Neue Shops, Migrationen, individuelle Entwicklung', 'Ab 49.000 NOK'], ['Optimieren', 'CRO, Speed, KI, Analytics-Setup', 'Ab 15.000 NOK'], ['Support', 'Retainer, Schulung, laufende Betreuung', 'Ab 3.500 NOK/Monat']], details: 'Details ansehen', monthly: 'monatlich', packages: [['Growth', 'Skalieren Sie Ihren bestehenden Shop', '8.000 NOK', ['Mittelgroße Marken, die skalieren wollen', 'Bedarf an individuellem Code', 'Mehr Conversions']], ['Premium', 'Komplexe E-Commerce-Lösungen', '15.000 NOK', ['Etablierte Marken mit komplexen Workflows, B2B und B2C', 'A/B-Testing']], ['Enterprise', 'Für Betrieb in großem Maßstab', '30.000 NOK, individuell', ['Multi-Store-Betrieb', 'Internationale Expansion für Unternehmen mit hohem Volumen']]], viewAll: 'Alle Leistungen ansehen' },
    blog: { eyebrow: 'Blog', title: 'News und Leitfäden', link: 'Zum Blog' },
    cta: { title: 'Bereit, nicht mehr nach Agenturen, sondern nach Leistungen zu suchen?', subtitle: 'Sehen Sie sich unsere Pakete an oder sprechen Sie mit uns über Ihr Projekt', buttons: ['Pakete ansehen', 'Unverbindliches Gespräch buchen'] },
    seo: { metaTitle: 'Shopify Plus-Agentur in Norwegen | scandicommerce', metaDescription: 'scandicommerce ist eine Shopify Plus-Partneragentur in Oslo: Shop-Aufbau, Plattformmigrationen und nordische Integrationen zu Festpreisen.' },
    pageTitle: 'Startseite',
  },
}

const key = (s: string) => s
const btn = (k: string, text: string, link: string, variant: 'primary' | 'secondary') => ({ _type: 'button', _key: k, text, link, variant })

/** Build the full section list for a language on the NO/EN structure, reusing EN images and NO brand logos. */
function buildSections(lang: string, en: Doc, noBrands: Doc[]): Doc[] {
  const c = COPY[lang]
  const enResults = en.sections.find((s: Doc) => s._type === 'resultsSection')
  const enShowcase = en.sections.find((s: Doc) => s._type === 'servicesShowcaseSection')
  const icons = ['shopping cart', 'diagram', 'chat']
  const slugs = ['growth', 'premium', 'enterprise']
  return [
    { _type: 'heroSection', _key: key('hero'), ...c.hero, heroButtons: [btn('b1', c.hero.buttons[0], '/services/all-packages', 'primary'), btn('b2', c.hero.buttons[1], '/work', 'secondary')], ...VIDEO, buttons: undefined },
    { _type: 'trustedBySection', _key: key('trusted'), title: c.trustedBy, brands: noBrands },
    { _type: 'resultsSection', _key: key('results'), title: c.results.title, subtitle: c.results.subtitle, theme: 'dark', items: enResults.items.map((it: Doc, i: number) => ({ ...it, metricName: c.results.items[i][0], stat: c.results.items[i][1], description: c.results.items[i][2], ctaText: c.results.cta })) },
    { _type: 'homepageTestimonialSection', _key: key('testimonial'), testimonialQuote: c.testimonial, testimonialAuthorName: 'Frank', testimonialAuthorTitle: 'CTO, Lanullva', testimonialRating: 5 },
    { _type: 'processSection', _key: key('process'), processTitle: c.process.title, processSubtitle: c.process.subtitle, processSteps: c.process.steps.map((s: string[], i: number) => ({ _type: 'step', _key: `step${i + 1}`, number: i + 1, title: s[0], description: s[1] })) },
    { _type: 'servicesShowcaseSection', _key: key('showcase'), title: c.showcase.title, subtitle: c.showcase.subtitle, viewAllLink: '/services/all-packages', viewAllText: c.showcase.viewAll,
      categories: c.showcase.categories.map((cat: string[], i: number) => ({ _type: 'category', _key: `cat${i + 1}`, title: cat[0], description: cat[1], price: cat[2], icon: icons[i], link: '/contact', linkText: c.showcase.contact })),
      packages: c.showcase.packages.map((p: any, i: number) => ({ _type: 'package', _key: `pkg-${slugs[i]}`, title: p[0], subtitle: p[1], price: p[2], priceType: c.showcase.monthly, bestFor: p[3], buttonText: c.showcase.details, buttonLink: `/services/all-packages/${slugs[i]}`, rating: 5, ratingValue: '5' })) },
    { _type: 'blogTeaserSection', _key: key('blog'), eyebrow: c.blog.eyebrow, title: c.blog.title, linkText: c.blog.link, linkHref: '/blog', count: 3 },
    { _type: 'ctaSection', _key: key('cta'), backgroundColor: 'dark', title: c.cta.title, subtitle: c.cta.subtitle, buttons: [btn('c1', c.cta.buttons[0], '/services/all-packages', 'primary'), btn('c2', c.cta.buttons[1], '/contact', 'secondary')] },
  ].map((s) => { const { buttons: _b, ...rest } = s as Doc; return s._type === 'heroSection' ? rest : s })
  void enShowcase
}

async function main() {
  // 1. Header menus
  const headers: Doc[] = await client.fetch('*[_type == "headerSettings" && language in ["en","sv","da","de"] && !(_id in path("drafts.**"))]{ _id, language }')
  for (const h of headers) {
    await client.patch(h._id).set({ menu: menu(MENUS[h.language]) }).commit({ visibility: 'sync' })
    console.log(`${dataset}: header menu set for ${h.language}`)
  }

  // 2. Homepages
  const pages: Doc[] = await client.fetch('*[_type == "landingPage" && isHomepage == true && !(_id in path("drafts.**"))]{ _id, language, sections }')
  const no = pages.find((p) => p.language === 'no')
  const en = pages.find((p) => p.language === 'en')
  if (!no || !en) throw new Error('need published no + en homepages')
  const noBrands = no.sections.find((s: Doc) => s._type === 'trustedBySection').brands
  const heroKey = en.sections.find((s: Doc) => s._type === 'heroSection')._key
  const showcaseKey = en.sections.find((s: Doc) => s._type === 'servicesShowcaseSection')._key
  const trustedKey = en.sections.find((s: Doc) => s._type === 'trustedBySection')._key
  await client.patch(en._id).set({
    [`sections[_key=="${heroKey}"].heroVideoFile`]: VIDEO.heroVideoFile,
    [`sections[_key=="${heroKey}"].heroVideoFileMobile`]: VIDEO.heroVideoFileMobile,
    [`sections[_key=="${trustedKey}"].brands`]: noBrands,
    [`sections[_key=="${showcaseKey}"].packages[_key=="9e96b4978730"].price`]: '8,000 NOK',
    [`sections[_key=="${showcaseKey}"].packages[_key=="fa73d2db844a"].price`]: '15,000 NOK',
    [`sections[_key=="${showcaseKey}"].packages[_key=="3ac9c3206e4c"].price`]: '30,000 NOK, customised',
  }).commit({ visibility: 'sync' })
  console.log(`${dataset}: en homepage video, logos and NOK prices set`)

  for (const lang of ['sv', 'da', 'de']) {
    const sections = buildSections(lang, en, noBrands)
    const existing = pages.find((p) => p.language === lang)
    if (existing) {
      await client.patch(existing._id).set({ sections, seoExtended: COPY[lang].seo, pageTitle: COPY[lang].pageTitle }).commit({ visibility: 'sync' })
      console.log(`${dataset}: ${lang} homepage rebuilt (${existing._id})`)
    } else {
      const created = await client.create({ _type: 'landingPage', language: lang, isHomepage: true, pageTitle: COPY[lang].pageTitle, slug: { _type: 'slug', current: '/' }, sections, seoExtended: COPY[lang].seo })
      console.log(`${dataset}: ${lang} homepage created (${created._id})`)
    }
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
