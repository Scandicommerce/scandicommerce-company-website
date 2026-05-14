import type { Metadata } from 'next'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import Hero from '@/components/layout/Hero'
import MigrationCalculator from '@/components/sections/shopify/shopify_migration/MigrationCalculator'
import { getLanguageFromParams } from '@/lib/language'
import { coalescePageSeo, getPageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildMetadata } from '@/lib/seo/buildMetadata'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const heroData = {
  heroTitle: {
    text: 'Not on Shopify yet? Migrate with 99.9% accuracy',
    highlight: 'Shopify',
  },
  heroDescription:
    'Move your products, customers, orders, blogs, and pages to Shopify with 99.9% data accuracy and zero downtime. At ScandiCommerce, we handle the entire migration process so you can focus on what matters most: growing your business.',
}

const ROUTE_PATH = 'shopify/shopify_migration'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // This route renders a custom hero + calculator on top of the migratePage
  // content; reuse the migratePage SEO doc for metadata so editors have a
  // single source of truth.
  const [doc, settings] = await Promise.all([
    getPageSeo({ type: 'migratePage', slug: ROUTE_PATH, language }),
    getSiteSettings(language),
  ])
  const seo = coalescePageSeo(doc, settings)
  if (!seo.metaTitle) seo.metaTitle = 'Migrate to Shopify with 99.9% accuracy'
  if (!seo.metaDescription) {
    seo.metaDescription = heroData.heroDescription
  }
  return buildMetadata({
    seo,
    settings,
    language,
    pathWithoutLang: ROUTE_PATH,
    docType: 'migratePage',
  })
}

export default async function ShopifyMigrationPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  getLanguageFromParams({ lang })

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={heroData} />
        <MigrationCalculator />
      </main>
      <FooterWrapper />
    </div>
  )
}
