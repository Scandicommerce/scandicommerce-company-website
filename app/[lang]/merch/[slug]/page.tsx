import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import ProductHero from '@/components/sections/merch/ProductHero'
import ProductFeatures from '@/components/sections/merch/ProductFeatures'
import ProductDetails from '@/components/sections/merch/ProductDetails'
import SizeGuide from '@/components/sections/merch/SizeGuide'
import RelatedProducts from '@/components/sections/merch/RelatedProducts'
import { getShopifyProductByHandle, getShopifyRelatedProducts, getShopifyProducts } from '@/lib/shopify'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { merchProductSettingsQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { getAlternateLanguagesForMetadata } from '@/lib/hreflang'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface MerchProductSettingsData {
  _id: string
  settingsTitle?: string
  productFeatures?: { features?: { title?: string; description?: string }[] }
  productDetails?: { title?: string; description?: string; bulletPoints?: string[]; imageUrl?: string }
  sizeGuide?: {
    title?: string
    description?: string
    contactButtonText?: string
    sizes?: { size?: string; chest?: string; length?: string; sleeve?: string }[]
  }
  relatedProducts?: {
    title?: string
    products?: { handle?: string; name?: string }[]
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const language = getLanguageFromParams({ lang })

  const shopifyProduct = await getShopifyProductByHandle(slug)
  if (!shopifyProduct) notFound()

  const settings: MerchProductSettingsData = await client.fetch(
    merchProductSettingsQuery,
    getQueryParams({}, language),
    { next: { revalidate: 0 } }
  )

  let relatedProducts = await getShopifyRelatedProducts(shopifyProduct.id)
  const sanityRelatedHandles = settings?.relatedProducts?.products
  if (sanityRelatedHandles && sanityRelatedHandles.length > 0) {
    const allProducts = await getShopifyProducts()
    const sanityRelated = sanityRelatedHandles
      .map((sanityProduct) => {
        const found = allProducts.find((p) => p.handle === sanityProduct.handle)
        if (found) return { ...found, title: sanityProduct.name || found.title }
        return null
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)
    if (sanityRelated.length > 0) relatedProducts = sanityRelated
  }

  const product = {
    name: shopifyProduct.title,
    subtitle:
      shopifyProduct.tags.find((tag) => tag.includes('®')) ||
      shopifyProduct.collections[0]?.title ||
      '',
    price: Math.round(shopifyProduct.price),
    currency: shopifyProduct.currencyCode,
    description: shopifyProduct.description || '',
    images:
      shopifyProduct.images && shopifyProduct.images.length > 0
        ? shopifyProduct.images
        : [shopifyProduct.image].filter(Boolean),
    rating: shopifyProduct.rating || 0,
    reviewCount: shopifyProduct.reviewCount || 0,
    isNewArrival: shopifyProduct.tags.some(
      (tag) =>
        tag.toLowerCase().includes('new') || tag.toLowerCase().includes('arrival')
    ),
    variants: shopifyProduct.variants || [],
    productId: shopifyProduct.id,
  }

  const formattedRelatedProducts = relatedProducts.map((relatedProduct) => ({
    id: relatedProduct.id,
    name: relatedProduct.title,
    price: relatedProduct.price,
    currency: relatedProduct.currencyCode,
    image: relatedProduct.image,
    slug: relatedProduct.handle,
  }))

  return (
    <>
      <HeaderWrapper />
      <main>
        <ProductHero product={product} />
        <ProductFeatures productFeatures={settings?.productFeatures} />
        <ProductDetails productDetails={settings?.productDetails} />
        <SizeGuide sizeGuide={settings?.sizeGuide} />
        <RelatedProducts
          products={formattedRelatedProducts}
          relatedProductsSettings={settings?.relatedProducts}
        />
      </main>
      <FooterWrapper />
    </>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug } = await params
  const shopifyProduct = await getShopifyProductByHandle(slug)
  if (!shopifyProduct) {
    return {
      title: 'Product Not Found | ScandiCommerce Merch',
      description: 'The product you are looking for could not be found.',
    }
  }
  const alternates = getAlternateLanguagesForMetadata(`merch/${slug}`)
  return {
    title: `${shopifyProduct.title} | ScandiCommerce Merch`,
    description: shopifyProduct.description || `${shopifyProduct.title} from ScandiCommerce`,
    alternates: Object.keys(alternates).length ? { languages: alternates } : undefined,
  }
}
