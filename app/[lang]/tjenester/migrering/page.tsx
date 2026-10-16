import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import ServiceHero from '@/components/sections/services/ServiceHero'
import MigrationMockup from '@/components/sections/services/visuals/MigrationMockup'
import { MigratePageSectionRenderer } from '@/components/pageSectionRenderers/MigratePageSectionRenderer'
import { getLanguageFromParams } from '@/lib/language'
import { coalescePageSeo, getPageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import { client } from '@/sanity/lib/client'
import { migratePageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ROUTE_PATH = 'tjenester/migrering'
/**
 * The content lives in the Norwegian `migratePage` document, whose Sanity slug
 * is still the old URL. Changing that slug to `tjenester/migrering` in Studio
 * is the last step of the move; this page loads the document by type, so it
 * keeps working before and after.
 */
const SANITY_SLUG = 'tjenester/shopify-migrering'

interface MigratePageData {
  _id: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
}

interface HeroSection {
  heroTitle?: { text?: string; highlight?: string }
  heroDescription?: string
  heroButtons?: Array<{ text: string; link: string }>
}

interface PlatformsSection {
  platformsItems?: Array<{ name?: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const [doc, settings] = await Promise.all([
    getPageSeo({ type: 'migratePage', slug: SANITY_SLUG, language }),
    getSiteSettings(language),
  ])
  const seo = coalescePageSeo(doc, settings)
  // Canonical is the new URL, not the document's (old) slug.
  seo.docSlug = undefined
  seo.canonical = undefined
  return buildMetadata({ seo, settings, language, pathWithoutLang: ROUTE_PATH })
}

export default async function MigreringPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // Norwegian IA only; the English page stays at /services/migrate.
  if (language !== 'no') notFound()

  const pageData = await client
    .fetch<MigratePageData | null>(migratePageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)
  const sections = normalizePageSections('migratePage', pageData)

  const heroSection = sections.find((s) => s._type === 'migratePageHeroSection') as HeroSection | undefined
  const platforms = sections.find((s) => s._type === 'migratePagePlatformsSection') as PlatformsSection | undefined
  const fromPlatforms = platforms?.platformsItems?.map((p) => p.name).filter((n): n is string => Boolean(n))

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ServiceHero
          eyebrow="Migrering til Shopify"
          title={heroSection?.heroTitle?.text || 'Bytt til Shopify uten risiko'}
          highlight={heroSection?.heroTitle?.highlight || 'Shopify'}
          description={heroSection?.heroDescription}
          buttons={heroSection?.heroButtons?.map((b, i) => ({
            text: b.text,
            link: b.link,
            variant: i === 0 ? ('primary' as const) : ('secondary' as const),
          }))}
          highlights={['SEO-rangeringer bevart', 'Null nedetid', 'Over 50 migreringer']}
          visual={<MigrationMockup fromPlatforms={fromPlatforms} />}
        />
        <MigratePageSectionRenderer sections={sections.filter((s) => s._type !== 'migratePageHeroSection')} />
      </main>
      <FooterWrapper />
    </div>
  )
}
