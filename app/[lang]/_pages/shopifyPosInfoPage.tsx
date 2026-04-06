import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { ShopifyPosInfoPageSectionRenderer } from '@/components/pageSectionRenderers/ShopifyPosInfoPageSectionRenderer'
import { client } from '@/sanity/lib/client'
import { shopifyPosInfoPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface ShopifyPosInfoPageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
  bleedingMoney?: Record<string, unknown>
  omnichannelFeatures?: Record<string, unknown>
  revenueForm?: Record<string, unknown>
}

export default async function ShopifyPosInfoPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client
    .fetch<ShopifyPosInfoPageData | null>(shopifyPosInfoPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)

  const sections = normalizePageSections('shopifyPosInfoPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ShopifyPosInfoPageSectionRenderer sections={sections} />
      </main>
      <FooterWrapper />
    </div>
  )
}
