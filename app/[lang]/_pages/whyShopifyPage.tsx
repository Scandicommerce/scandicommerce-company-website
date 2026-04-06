import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { WhyShopifyPageSectionRenderer } from '@/components/pageSectionRenderers/WhyShopifyPageSectionRenderer'
import { client } from '@/sanity/lib/client'
import { whyShopifyPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface WhyShopifyPageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
  whatIsShopify?: Record<string, unknown>
  shopifyFacts?: Record<string, unknown>
  whyBusinessesChoose?: Record<string, unknown>
  whyScandicommerceSpecializes?: Record<string, unknown>
  shopifyAi?: Record<string, unknown>
  cta?: Record<string, unknown>
}

export default async function WhyShopifyPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client
    .fetch<WhyShopifyPageData | null>(whyShopifyPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)

  const sections = normalizePageSections('whyShopifyPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <WhyShopifyPageSectionRenderer sections={sections} />
      </main>
      <FooterWrapper />
    </div>
  )
}
