import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { ShopifyTcoCalculatorPageSectionRenderer } from '@/components/pageSectionRenderers/ShopifyTcoCalculatorPageSectionRenderer'
import { client } from '@/sanity/lib/client'
import { shopifyTcoCalculatorPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface ShopifyTcoCalculatorPageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
}

export default async function ShopifyTcoCalculatorPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client
    .fetch<ShopifyTcoCalculatorPageData | null>(shopifyTcoCalculatorPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)

  const sections = normalizePageSections('shopifyTcoCalculatorPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ShopifyTcoCalculatorPageSectionRenderer sections={sections} />
      </main>
      <FooterWrapper />
    </div>
  )
}
