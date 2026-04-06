import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { MigratePageSectionRenderer } from '@/components/pageSectionRenderers/MigratePageSectionRenderer'
import { client } from '@/sanity/lib/client'
import { migratePageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface MigratePageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
  platforms?: Record<string, unknown>
  risksProtection?: Record<string, unknown>
  process?: Record<string, unknown>
  results?: Record<string, unknown>
  cta?: Record<string, unknown>
}

export default async function MigratePage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client
    .fetch<MigratePageData | null>(migratePageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)

  const sections = normalizePageSections('migratePage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <MigratePageSectionRenderer sections={sections} />
        <FooterWrapper />
      </main>
    </div>
  )
}
