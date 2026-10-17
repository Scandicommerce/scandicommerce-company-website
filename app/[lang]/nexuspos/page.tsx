import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { CtaBand, Faq } from '@/components/integrations/LinkBlocks'
import NexusHero from '@/components/sections/nexuspos/NexusHero'
import Equipment from '@/components/sections/nexuspos/Equipment'
import { BeforeAfter, CaseFlewe, FirstYear, Kits, Pricing, Requirements, Steps } from '@/components/sections/nexuspos/NexusSections'
import { getLanguageFromParams } from '@/lib/language'
import { NEXUS_COLLECTION_HANDLE, mergeNexusItems, nexusFaq, nexusItems } from '@/lib/nexuspos'
import { CONTACT_SLUG, WORK_INDEX_SLUG } from '@/lib/routes'
import { coalescePageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import { getShopifyCollectionProducts } from '@/lib/shopify'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ROUTE_PATH = 'nexuspos'
const META_TITLE = 'Nexus POS: kasse, nettbutikk, lager og regnskap i ett system'
const META_DESCRIPTION =
  'Nexus POS gjør Shopify POS klar for norsk kasselov med Nets-terminal, kvittering, journal, X/Z-rapporter og SAF-T. Faste priser, ingen binding.'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const settings = await getSiteSettings(language)
  const seo = coalescePageSeo(null, settings)
  seo.metaTitle = META_TITLE
  seo.metaDescription = META_DESCRIPTION
  seo.ogTitle = META_TITLE
  seo.ogDescription = META_DESCRIPTION
  return buildMetadata({ seo, settings, language, pathWithoutLang: ROUTE_PATH })
}

/**
 * Nexus POS landing page (/nexuspos). Norwegian IA only. Prices, images and
 * cart buttons for the equipment come from the "nexus-pos" collection in the
 * Shopify store when the products exist there; the catalog in lib/nexuspos.ts
 * is the fallback and the source of the copy.
 */
export default async function NexusPosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  if (language !== 'no') notFound()

  const products = await getShopifyCollectionProducts(NEXUS_COLLECTION_HANDLE)
  const items = mergeNexusItems(nexusItems, products)
  const contactHref = `/${CONTACT_SLUG.no}`
  const casesHref = `/${WORK_INDEX_SLUG.no}`

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-white text-sc-ink-900">
        <NexusHero contactHref={contactHref} />
        <BeforeAfter />
        <CaseFlewe casesHref={casesHref} />
        <Steps />
        <Pricing items={items} contactHref={contactHref} />
        <Kits items={items} contactHref={contactHref} />
        <FirstYear items={items} />
        <Equipment items={items} contactHref={contactHref} fromShopify={products.length > 0} />
        <Requirements />
        <Faq heading="Spørsmål vi får hver uke" items={nexusFaq} />
        <CtaBand heading="Én Shopify for butikk og nett. Start i dag." text="15 minutter på telefon, så vet du hva du trenger og hva det koster." buttonLabel="Bestill en uforpliktende samtale" buttonHref={contactHref} />
      </main>
      <FooterWrapper />
    </div>
  )
}
