import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import PricingPackages from '@/components/sections/services/all_packages/PricingPackages'
import FAQ from '@/components/sections/services/all_packages/FAQ'
import { client } from '@/sanity/lib/client'
import { allPackagesPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import Hero from '@/components/layout/Hero'
import { getShopifyProductByHandle } from '@/lib/shopify'

// Disable caching - always fetch fresh data from Sanity
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface AllPackagesPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: {
    heroTitle?: {
      text?: string
      highlight?: string
    }
    heroDescription?: string
  }
  packages?: {
    packagesItems?: Array<{
      title: string
      subtitle: string
      price: string
      priceType: string
      timeline: string
      rating: number
      ratingValue: string
      bestFor: string[]
      included: string[]
      description: string
      href: string
    }>
  }
  faq?: {
    faqTitle?: string
    faqItems?: Array<{
      question: string
      answer: string
    }>
  }
}

async function getPageData(): Promise<AllPackagesPageData | null> {
  try {
    const data = await client.fetch<AllPackagesPageData>(
      allPackagesPageQuery,
      getQueryParams({}),
      { next: { revalidate: 0 } }
    )
    return data
  } catch (error) {
    console.error('Error fetching All Packages page:', error)
    return null
  }
}

/** Get package slug from href (e.g. /services/all_packages/shopify-setup -> shopify-setup) */
function slugFromHref(href: string): string | null {
  if (!href) return null
  const segments = href.split('/').filter(Boolean)
  return segments.length > 0 ? segments[segments.length - 1]! : null
}

export default async function ServicesAllPackages() {
  const pageData = await getPageData()
  const rawItems = pageData?.packages?.packagesItems ?? []

  const packagesWithShopify = await Promise.all(
    rawItems.map(async (item) => {
      const slug = slugFromHref(item.href)
      let shopifyVariantId: string | undefined
      let shopifyProductTitle: string | undefined
      if (slug) {
        try {
          const product = await getShopifyProductByHandle(slug)
          if (product?.variants?.[0]) {
            shopifyVariantId = product.variants[0].id
            shopifyProductTitle = product.title
          }
        } catch {
          // Package may not exist in Shopify
        }
      }
      return {
        ...item,
        shopifyVariantId,
        shopifyProductTitle,
      }
    })
  )

  const packages = {
    ...pageData?.packages,
    packagesItems: packagesWithShopify,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero
          hero={{
            ...pageData?.hero}}
        >
        </Hero>
        <PricingPackages packages={packages} />
        <FAQ faq={pageData?.faq} />
        <FooterWrapper />
      </main>
    </div>
  )
}
