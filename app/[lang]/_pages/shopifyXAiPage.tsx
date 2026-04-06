import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { ShopifyXAiPageSectionRenderer } from '@/components/pageSectionRenderers/ShopifyXAiPageSectionRenderer'
import { client } from '@/sanity/lib/client'
import { shopifyXAiPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface ShopifyXAiPageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
  enhancingWithAi?: Record<string, unknown>
  howWeLeverageAi?: Record<string, unknown>
  aiToolsToolkit?: Record<string, unknown>
  howWeApplyAi?: Record<string, unknown>
  aiEnhancedProcess?: Record<string, unknown>
  faq?: Record<string, unknown>
  cta?: Record<string, unknown>
}

export default async function ShopifyXAiPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client
    .fetch<ShopifyXAiPageData | null>(shopifyXAiPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)

  const sections = normalizePageSections('shopifyXAiPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ShopifyXAiPageSectionRenderer sections={sections} />
      </main>
      <FooterWrapper />
    </div>
  )
}
