import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import BleedingMoney from '@/components/sections/shopify/shopify_POS/BleedingMoney'
import OmnichannelFeatures from '@/components/sections/shopify/shopify_POS/OmnichannelFeatures'
import RevenueForm from '@/components/sections/shopify/shopify_POS/RevenueForm'
import { client } from '@/sanity/lib/client'
import { shopifyPosInfoPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import Hero from '@/components/layout/Hero'

// Disable caching - always fetch fresh data from Sanity
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ShopifyPosInfoPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: {
    heroTitle?: {
      text?: string
      highlight?: string
    }
    heroDescription?: string
    stats?: Array<{
      value?: string
      label?: string
    }>
  }
  bleedingMoney?: {
    title?: string
    leftPoints?: string[]
    rightPoints?: string[]
  }
  omnichannelFeatures?: {
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
}

async function getPageData(): Promise<ShopifyPosInfoPageData | null> {
  try {
    const data = await client.fetch<ShopifyPosInfoPageData>(
      shopifyPosInfoPageQuery,
      getQueryParams({}),
      { next: { revalidate: 0 } }
    )
    return data
  } catch (error) {
    console.error('Error fetching Shopify POS Info page:', error)
    return null
  }
}

export default async function ShopifyPOSPage() {
  const pageData = await getPageData()

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData?.hero} isStats={true} />
        <BleedingMoney bleedingMoney={pageData?.bleedingMoney} />
        <OmnichannelFeatures
          omnichannelFeatures={pageData?.omnichannelFeatures}
        />
        <RevenueForm revenueForm={pageData?.revenueForm} />
      </main>
      <FooterWrapper />
    </div>
  )
}
