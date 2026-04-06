import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { ShopifyDevelopmentPageSectionRenderer } from '@/components/pageSectionRenderers/ShopifyDevelopmentPageSectionRenderer'
import { client } from '@/sanity/lib/client'
import { shopifyDevelopmentPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface ShopifyDevPageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
  whyShopify?: Record<string, unknown>
  scenarios?: Record<string, unknown>
  howWeWork?: Record<string, unknown>
  testimonial?: Record<string, unknown>
  cta?: Record<string, unknown>
}

export default async function ShopifyDevelopmentPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client
    .fetch<ShopifyDevPageData | null>(shopifyDevelopmentPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)

  const sections = normalizePageSections('shopifyDevelopmentPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ShopifyDevelopmentPageSectionRenderer sections={sections} />
        <FooterWrapper />
      </main>
    </div>
  )
}
