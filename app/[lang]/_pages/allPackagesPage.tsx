import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { AllPackagesPageSectionRenderer } from '@/components/pageSectionRenderers/AllPackagesPageSectionRenderer'
import { client } from '@/sanity/lib/client'
import { allPackagesPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface AllPackagesPageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
  packages?: Record<string, unknown>
  faq?: Record<string, unknown>
}

export default async function AllPackagesPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const language = getLanguageFromParams(await params)
  const pageData = await client.fetch<AllPackagesPageData>(
    allPackagesPageQuery,
    getQueryParams({}, language),
    { next: { revalidate: 0 } }
  )

  const sections = normalizePageSections('allPackagesPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <AllPackagesPageSectionRenderer sections={sections} />
        <FooterWrapper />
      </main>
    </div>
  )
}
