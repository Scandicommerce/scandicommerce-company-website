import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { AllPackagesPageSectionRenderer } from '@/components/pageSectionRenderers/AllPackagesPageSectionRenderer'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { allPackagesPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'
import { getShopifyCollectionProducts } from '@/lib/shopify'

interface AllPackagesPageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
}

export default async function AllPackagesPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const resolvedParams = await params
  const language = getLanguageFromParams(resolvedParams)
  const [pageData, products] = await Promise.all([
    sanityPageFetch<AllPackagesPageData>(allPackagesPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } }),
    getShopifyCollectionProducts('packages'),
  ])

  const sections = normalizePageSections('allPackagesPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <AllPackagesPageSectionRenderer sections={sections} lang={resolvedParams.lang} products={products} />
        <FooterWrapper />
      </main>
    </div>
  )
}
