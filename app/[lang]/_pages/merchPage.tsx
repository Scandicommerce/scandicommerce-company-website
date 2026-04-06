import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { MerchPageSectionRenderer } from '@/components/pageSectionRenderers/MerchPageSectionRenderer'
import { getShopifyProducts } from '@/lib/shopify'
import { Product } from '@/components/sections/merch/ProductCard'
import { client } from '@/sanity/lib/client'
import { merchPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface MerchPageData {
  _id: string
  pageTitle?: string
  slug?: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
  qualityShowcase?: Record<string, unknown>
  newsletter?: Record<string, unknown>
}

export default async function MerchPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  let shopifyProducts: Product[] = []

  const pageData: MerchPageData | null = await client.fetch(
    merchPageQuery,
    getQueryParams({}, language),
    { next: { revalidate: 0 } }
  )

  try {
    const products = await getShopifyProducts()
    shopifyProducts = products
      .map((p) => ({
        id: p.id,
        name: p.title,
        description: p.description || '',
        price: p.price,
        currency: p.currencyCode,
        image: p.image,
        collections: p.collections || [],
        slug: p.handle,
        availableForSale: p.availableForSale,
        tags: p.tags || [],
      }))
      .filter((p) => p.collections.length > 0)
  } catch (error) {
    console.error('Error fetching Shopify products:', error)
  }

  const sections = normalizePageSections('merchPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <MerchPageSectionRenderer sections={sections} shopifyProducts={shopifyProducts} />
        <FooterWrapper />
      </main>
    </div>
  )
}
