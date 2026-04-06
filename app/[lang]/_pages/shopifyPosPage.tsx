import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { ShopifyPosPageSectionRenderer } from '@/components/pageSectionRenderers/ShopifyPosPageSectionRenderer'
import { client } from '@/sanity/lib/client'
import { shopifyPosPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface ShopifyPosPageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
  features?: Record<string, unknown>
  perfectFor?: Record<string, unknown>
  cta?: Record<string, unknown>
}

export default async function ShopifyPosPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client
    .fetch<ShopifyPosPageData | null>(shopifyPosPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)

  const sections = normalizePageSections('shopifyPosPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ShopifyPosPageSectionRenderer sections={sections} />
        <FooterWrapper />
      </main>
    </div>
  )
}
