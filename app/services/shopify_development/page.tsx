import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import WhyShopifyWins from '@/components/sections/services/shopify_development/WhyShopifyWins'
import CommonScenarios from '@/components/sections/services/shopify_development/CommonScenarios'
import HowWeWork from '@/components/sections/services/shopify_development/HowWeWork'
import Testimonial from '@/components/sections/services/shopify_development/Testimonial'
import ReadyToBuild from '@/components/sections/services/shopify_development/ReadyToBuild'
import { client } from '@/sanity/lib/client'
import { shopifyDevelopmentPageQuery } from '@/sanity/lib/queries'
import Hero from '@/components/layout/Hero'
import { Button } from '@/components/ui'

// Disable caching - always fetch fresh data from Sanity
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ShopifyDevPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: {
    heroTitle?: {
      text?: string
      highlight?: string
    }
    heroDescription?: string
    heroButtons?: Array<{
      text: string
      link: string
      variant?: string
    }>
  }
  whyShopify?: {
    whyShopifyTitle?: string
    whyShopifySubtitle?: string
    whyShopifyFeatures?: Array<{
      title: string
      description: string
      icon?: string
    }>
  }
  scenarios?: {
    scenariosTitle?: string
    scenariosItems?: Array<{
      title: string
      description: string
      link?: string
    }>
  }
  howWeWork?: {
    howWeWorkTitle?: string
    howWeWorkSteps?: Array<{
      number: number
      title: string
      description: string
    }>
  }
  testimonial?: {
    testimonialRating?: number
    testimonialQuote?: string
    testimonialAuthorName?: string
    testimonialAuthorTitle?: string
    testimonialButtonText?: string
    testimonialButtonLink?: string
  }
  cta?: {
    ctaTitle?: string
    ctaDescription?: string
    ctaButtonText?: string
    ctaButtonLink?: string
  }
}

async function getPageData(): Promise<ShopifyDevPageData | null> {
  try {
    const data = await client.fetch<ShopifyDevPageData>(
      shopifyDevelopmentPageQuery,
      {},
      { next: { revalidate: 0 } }
    )
    return data
  } catch (error) {
    console.error('Error fetching Shopify Development page:', error)
    return null
  }
}

export default async function ServicesShopifyDevelopment() {
  const pageData = await getPageData()

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero
          hero={{
            ...pageData?.hero,
          }}
        >
          <div className="grid sm:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
            {pageData?.hero?.heroButtons?.map((button, index) => (
              <Button key={index} type={button.variant === 'primary' ? 'primary' : 'default'} href={button.link}>
                {button.text}
              </Button>
            ))}
          </div>
        </Hero>
        <WhyShopifyWins whyShopify={pageData?.whyShopify} />
        <CommonScenarios scenarios={pageData?.scenarios} />
        <HowWeWork howWeWork={pageData?.howWeWork} />
        <Testimonial testimonial={pageData?.testimonial} />
        <ReadyToBuild cta={pageData?.cta} />
        <FooterWrapper />
      </main>
    </div>
  )
}
