import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import OmnichannelFeatures from '@/components/sections/services/shopify_pos/OmnichannelFeatures'
import PerfectFor from '@/components/sections/services/shopify_pos/PerfectFor'
import ReadyForOmnichannel from '@/components/sections/services/shopify_pos/ReadyForOmnichannel'
import { client } from '@/sanity/lib/client'
import { shopifyPosPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import Hero from '@/components/layout/Hero'
import { Button } from '@/components/ui'

// Disable caching - always fetch fresh data from Sanity
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ShopifyPosPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: {
    heroTitle?: {
      text?: string
      highlight?: string
    }
    heroDescription?: string
    heroButtonText?: string
    heroButtonLink?: string
  }
  features?: {
    featuresTitle?: string
    featuresItems?: Array<{
      title: string
      description: string
      icon?: string
    }>
  }
  perfectFor?: {
    perfectForTitle?: string
    perfectForItems?: Array<{
      title: string
      description: string
    }>
  }
  cta?: {
    ctaTitle?: string
    ctaDescription?: string
    ctaButtonText?: string
    ctaButtonLink?: string
  }
}

async function getPageData(): Promise<ShopifyPosPageData | null> {
  try {
    const data = await client.fetch<ShopifyPosPageData>(
      shopifyPosPageQuery,
      getQueryParams({}),
      { next: { revalidate: 0 } }
    )
    return data
  } catch (error) {
    console.error('Error fetching Shopify POS page:', error)
    return null
  }
}

export default async function ShopifyPOSPage() {
  const pageData = await getPageData()

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData?.hero}>
          <div className="grid grid-cols-1 lg:gap-4 gap-2">
            <Button href={pageData?.hero?.heroButtonLink}>
              {pageData?.hero?.heroButtonText}
            </Button>
          </div>
        </Hero>
        <OmnichannelFeatures features={pageData?.features} />
        <PerfectFor perfectFor={pageData?.perfectFor} />
        <ReadyForOmnichannel cta={pageData?.cta} />
        <FooterWrapper />
      </main>
    </div>
  )
}
