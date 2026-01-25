import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import Features from '@/components/sections/shopify/vipps_hurtigkasse/Features'
import HowToGetStarted from '@/components/sections/shopify/vipps_hurtigkasse/HowToGetStarted'
import Pricing from '@/components/sections/shopify/vipps_hurtigkasse/Pricing'
import OrderForm from '@/components/sections/shopify/vipps_hurtigkasse/OrderForm'
import Support from '@/components/sections/shopify/vipps_hurtigkasse/Support'
import { client } from '@/sanity/lib/client'
import { vippsHurtigkassePageQuery } from '@/sanity/lib/queries'
import Hero from '@/components/layout/Hero'

// Disable caching - always fetch fresh data from Sanity
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface VippsHurtigkassePageData {
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
  features?: {
    title?: string
    paragraphs?: string[]
    demoStore?: {
      text?: string
      url?: string
      password?: string
    }
    productImage?: {
      src?: string
      alt?: string
    }
  }
  howToGetStarted?: {
    title?: string
    steps?: Array<{
      title?: string
      description?: string
      subSteps?: string[]
    }>
  }
  pricing?: {
    sectionTitle?: string
    price?: string
    priceNote?: string
    supportText?: string
  }
  orderForm?: {
    title?: string
    description?: string
  }
  support?: {
    title?: string
    buttonText?: string
    buttonLink?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

async function getPageData(): Promise<VippsHurtigkassePageData | null> {
  try {
    const data = await client.fetch(vippsHurtigkassePageQuery)
    return data
  } catch (error) {
    console.error('Error fetching Vipps Hurtigkasse page data:', error)
    return null
  }
}

export async function generateMetadata() {
  const pageData = await getPageData()
  
  return {
    title: pageData?.seo?.metaTitle || 'Vipps Quick Checkout for Shopify | Scandicommerce',
    description: pageData?.seo?.metaDescription || 'Give your customers an easier shopping experience with Vipps Quick Checkout. Full integration with Shopify, support for capture, refund, shipping and discount codes.',
  }
}

export default async function VippsHurtigkassePage() {
  const pageData = await getPageData()

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData?.hero} />
        <Features features={pageData?.features} />
        <HowToGetStarted howToGetStarted={pageData?.howToGetStarted} />
        <Pricing pricing={pageData?.pricing} />
        <OrderForm orderForm={pageData?.orderForm} />
        <Support support={pageData?.support} />
      </main>
      <FooterWrapper />
    </div>
  )
}
