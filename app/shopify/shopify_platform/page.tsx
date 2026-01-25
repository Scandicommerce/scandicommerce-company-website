import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import BleedingMoney from '@/components/sections/shopify/shopify_platform/BleedingMoney'
import ShopifyEmpires from '@/components/sections/shopify/shopify_platform/ShopifyEmpires'
import RevenueForm from '@/components/sections/shopify/shopify_platform/RevenueForm'
import SuccessStories from '@/components/sections/shopify/shopify_platform/SuccessStories'
import { client } from '@/sanity/lib/client'
import { shopifyPlatformPageQuery } from '@/sanity/lib/queries'
import Hero from '@/components/layout/Hero'

// Disable caching - always fetch fresh data from Sanity
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ShopifyPlatformPageData {
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
  bleedingMoney?: {
    title?: string
    leftPoints?: string[]
    rightPoints?: string[]
    bottomPoint?: string
  }
  shopifyEmpires?: {
    title?: string
    features?: Array<{
      title?: string
      description?: string
      highlight?: string
    }>
  }
  revenueForm?: {
    title?: string
    subtitle?: string
    testimonial?: {
      quote?: string
      authorName?: string
      authorRole?: string
      authorCompany?: string
      authorImageUrl?: string
    }
    form?: {
      formTitle?: string
      formSubtitle?: string
      formDescription?: string
      submitButtonText?: string
    }
  }
  successStories?: {
    title?: string
    subtitle?: string
    caseStudies?: Array<{
      clientName?: string
      heading?: string
      description?: string
      imageUrl?: string
    }>
  }
}

async function getPageData(): Promise<ShopifyPlatformPageData | null> {
  try {
    const data = await client.fetch<ShopifyPlatformPageData>(
      shopifyPlatformPageQuery,
      {},
      { next: { revalidate: 0 } }
    )
    return data
  } catch (error) {
    console.error('Error fetching Shopify Platform page:', error)
    return null
  }
}

export default async function ShopifyPlatformPage() {
  const pageData = await getPageData()

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData?.hero} />
        <BleedingMoney bleedingMoney={pageData?.bleedingMoney} />
        <ShopifyEmpires shopifyEmpires={pageData?.shopifyEmpires} />
        <RevenueForm revenueForm={pageData?.revenueForm} />
        <SuccessStories successStories={pageData?.successStories} />
      </main>
      <FooterWrapper />
    </div>
  )
}
