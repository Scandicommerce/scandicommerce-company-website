import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { ShopifyXPimPageSectionRenderer } from '@/components/pageSectionRenderers/ShopifyXPimPageSectionRenderer'
import { client } from '@/sanity/lib/client'
import { shopifyXPimPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface ShopifyXPimPageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
  whatIsPim?: Record<string, unknown>
  integratingPim?: Record<string, unknown>
  whichBusinesses?: Record<string, unknown>
  timeSavings?: Record<string, unknown>
  whyGoodInvestment?: Record<string, unknown>
  combinedSection?: Record<string, unknown>
  cta?: Record<string, unknown>
}

export default async function ShopifyXPimPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client
    .fetch<ShopifyXPimPageData | null>(shopifyXPimPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)

  const sections = normalizePageSections('shopifyXPimPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ShopifyXPimPageSectionRenderer sections={sections} />
      </main>
      <FooterWrapper />
    </div>
  )
}
