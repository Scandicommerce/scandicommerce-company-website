import type { Metadata } from 'next'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { CtaBand, Faq } from '@/components/integrations/LinkBlocks'
import NexusHero from '@/components/sections/nexuspos/NexusHero'
import Equipment from '@/components/sections/nexuspos/Equipment'
import { BeforeAfter, CaseFlewe, FirstYear, Kits, Pricing, Requirements, Steps } from '@/components/sections/nexuspos/NexusSections'
import { getLanguageFromParams } from '@/lib/language'
import { NEXUS_COLLECTION_HANDLE, localizeNexusItems, mergeNexusItems, nexusCopy, nexusItems, nexusLang } from '@/lib/nexuspos'
import { CONTACT_SLUG, WORK_INDEX_SLUG } from '@/lib/routes'
import { coalescePageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import { getShopifyCollectionProducts } from '@/lib/shopify'
import type { Language } from '@/lib/site-config'

const ROUTE_PATH = 'nexuspos'

const META = {
  no: {
    title: 'Nexus POS: kasse, nettbutikk, lager og regnskap i ett system',
    description: 'Nexus POS gjør Shopify POS klar for norsk kasselov med Nets-terminal, kvittering, journal, X/Z-rapporter og SAF-T. Faste priser, ingen binding.',
  },
  en: {
    title: 'Nexus POS: till, online store, inventory and accounting in one system',
    description: 'Nexus POS makes Shopify POS compliant with the Norwegian Cash Register Act, with a Nets terminal, receipts, journal, X/Z reports and SAF-T. Fixed prices, no lock-in.',
  },
  sv: {
    title: 'Nexus POS: kassa, webbutik, lager och bokföring i ett system',
    description: 'Nexus POS gör Shopify POS redo för den norska kassalagen med Nets-terminal, kvitto, journal, X/Z-rapporter och SAF-T. Fasta priser, ingen bindningstid.',
  },
  da: {
    title: 'Nexus POS: kasse, webshop, lager og regnskab i ét system',
    description: 'Nexus POS gør Shopify POS klar til den norske kasselov med Nets-terminal, kvittering, journal, X/Z-rapporter og SAF-T. Faste priser, ingen binding.',
  },
  de: {
    title: 'Nexus POS: Kasse, Onlineshop, Lager und Buchhaltung in einem System',
    description: 'Nexus POS macht Shopify POS fit für das norwegische Kassengesetz, mit Nets-Terminal, Beleg, Journal, X/Z-Berichten und SAF-T. Festpreise, keine Mindestlaufzeit.',
  },
}

const PAGE = {
  no: { faq: 'Spørsmål vi får hver uke', ctaHeading: 'Én Shopify for butikk og nett. Start i dag.', ctaText: '15 minutter på telefon, så vet du hva du trenger og hva det koster.', ctaButton: 'Bestill en uforpliktende samtale' },
  en: { faq: 'Questions we get every week', ctaHeading: 'One Shopify for store and web. Start today.', ctaText: '15 minutes on the phone and you will know what you need and what it costs.', ctaButton: 'Book a no-obligation call' },
  sv: { faq: 'Frågor vi får varje vecka', ctaHeading: 'En Shopify för butik och webb. Börja i dag.', ctaText: '15 minuter på telefon, så vet du vad du behöver och vad det kostar.', ctaButton: 'Boka ett förutsättningslöst samtal' },
  da: { faq: 'Spørgsmål vi får hver uge', ctaHeading: 'Én Shopify til butik og web. Start i dag.', ctaText: '15 minutter på telefonen, så ved du, hvad du skal bruge, og hvad det koster.', ctaButton: 'Book en uforpligtende samtale' },
  de: { faq: 'Fragen, die wir jede Woche bekommen', ctaHeading: 'Ein Shopify für Geschäft und Web. Starten Sie heute.', ctaText: '15 Minuten am Telefon, und Sie wissen, was Sie brauchen und was es kostet.', ctaButton: 'Unverbindliches Gespräch vereinbaren' },
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const meta = META[nexusLang(language)]
  const settings = await getSiteSettings(language)
  const seo = coalescePageSeo(null, settings)
  seo.metaTitle = meta.title
  seo.metaDescription = meta.description
  seo.ogTitle = meta.title
  seo.ogDescription = meta.description
  return buildMetadata({ seo, settings, language, pathWithoutLang: ROUTE_PATH })
}

/**
 * Nexus POS landing page (/nexuspos). Norwegian copy on scandicommerce.no;
 * English, Swedish, Danish and German on the .com locales (unknown → English).
 * Prices, images and cart buttons for the equipment come from the "nexus-pos"
 * collection in the Shopify store when the products exist there; the catalog
 * in lib/nexuspos.ts is the fallback and the source of the copy.
 */
export default async function NexusPosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const l = nexusLang(language)
  const t = PAGE[l]

  const products = await getShopifyCollectionProducts(NEXUS_COLLECTION_HANDLE)
  const items = localizeNexusItems(mergeNexusItems(nexusItems, products), l)
  const copy = nexusCopy(l)
  const contactHref = `/${CONTACT_SLUG[language as Language] ?? CONTACT_SLUG.en}`
  const casesHref = `/${WORK_INDEX_SLUG[language as Language] ?? WORK_INDEX_SLUG.en}`

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-white text-sc-ink-900">
        <NexusHero contactHref={contactHref} lang={l} />
        <BeforeAfter lang={l} />
        <CaseFlewe casesHref={casesHref} lang={l} />
        <Steps lang={l} />
        <Pricing items={items} contactHref={contactHref} lang={l} />
        <Kits items={items} contactHref={contactHref} lang={l} />
        <FirstYear items={items} lang={l} />
        <Equipment items={items} contactHref={contactHref} fromShopify={products.length > 0} lang={l} />
        <Requirements lang={l} />
        <Faq heading={t.faq} items={copy.faq} />
        <CtaBand heading={t.ctaHeading} text={t.ctaText} buttonLabel={t.ctaButton} buttonHref={contactHref} />
      </main>
      <FooterWrapper />
    </div>
  )
}
