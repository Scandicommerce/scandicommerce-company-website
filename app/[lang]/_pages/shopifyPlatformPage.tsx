import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { ShopifyPlatformPageSectionRenderer } from '@/components/pageSectionRenderers/ShopifyPlatformPageSectionRenderer'
import { client } from '@/sanity/lib/client'
import { shopifyPlatformPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface ShopifyPlatformPageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
  bleedingMoney?: Record<string, unknown>
  shopifyEmpires?: Record<string, unknown>
  revenueForm?: Record<string, unknown>
  successStories?: Record<string, unknown>
}

export default async function ShopifyPlatformPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client.fetch<ShopifyPlatformPageData>(
    shopifyPlatformPageQuery,
    getQueryParams({}, language),
    { next: { revalidate: 0 } }
  )

  const sections = normalizePageSections('shopifyPlatformPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ShopifyPlatformPageSectionRenderer sections={sections} />
      </main>
      <FooterWrapper />
    </div>
  )
}
