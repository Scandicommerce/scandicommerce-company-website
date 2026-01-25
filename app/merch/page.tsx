import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import ProductGrid from '@/components/sections/merch/ProductGrid'
import QualityShowcase from '@/components/sections/merch/QualityShowcase'
import Newsletter from '@/components/sections/merch/Newsletter'
import { getShopifyProducts } from '@/lib/shopify'
import { Product } from '@/components/sections/merch/ProductCard'
import { client } from '@/sanity/lib/client'
import { merchPageQuery } from '@/sanity/lib/queries'
import Hero from '@/components/layout/Hero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface MerchPageData {
  _id: string
  pageTitle?: string
  slug?: string
  hero?: {
    heroTitle?: {
      text?: string
      highlight?: string
    }
    heroDescription?: string
  }
  qualityShowcase?: {
    title?: string
    description?: string
    products?: {
      handle?: string
      name?: string
    }[]
  }
  newsletter?: {
    title?: string
    description?: string
    emailPlaceholder?: string
    buttonText?: string
    successMessage?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export async function generateMetadata() {
  const data: MerchPageData = await client.fetch(
    merchPageQuery,
    {},
    { next: { revalidate: 0 } }
  )

  return {
    title: data?.seo?.metaTitle || 'Merch | ScandiCommerce',
    description: data?.seo?.metaDescription || 'Wear the brand behind high-performance Shopify builds. Premium quality, minimal design, maximum comfort.',
  }
}

export default async function Merch() {
  let shopifyProducts: Product[] = []

  // Fetch Sanity data
  const pageData: MerchPageData = await client.fetch(
    merchPageQuery,
    {},
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
      .filter(p => p.collections.length > 0)
  } catch (error) {
    console.error('Error fetching Shopify products:', error)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData.hero} />
        <ProductGrid initialProducts={shopifyProducts} />
        <QualityShowcase 
          products={shopifyProducts} 
          qualityShowcase={pageData?.qualityShowcase}
        />
        <Newsletter newsletter={pageData?.newsletter} />
        <FooterWrapper />
      </main>
    </div>
  )
}
