import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import WhatIsShopify from '@/components/sections/shopify/why_shopify/WhatIsShopify'
import ShopifyFacts from '@/components/sections/shopify/why_shopify/ShopifyFacts'
import WhyBusinessesChooseShopify from '@/components/sections/shopify/why_shopify/WhyBusinessesChooseShopify'
import WhyScandicommerceSpecializes from '@/components/sections/shopify/why_shopify/WhyScandicommerceSpecializes'
import ShopifyAI from '@/components/sections/shopify/why_shopify/ShopifyAI'
import CTA from '@/components/sections/shopify/why_shopify/CTA'
import { client } from '@/sanity/lib/client'
import { whyShopifyPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import Hero from '@/components/layout/Hero'

// Disable caching - always fetch fresh data from Sanity
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface WhyShopifyPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: {
    heroTitle?: { text?: string; highlight?: string }
    heroDescription?: string
  }
  whatIsShopify?: {
    title?: string
    paragraph1?: string
    paragraph2?: string
  }
  shopifyFacts?: {
    title?: string
    facts?: Array<{ statistic?: string; description?: string; source?: string }>
  }
  whyBusinessesChoose?: {
    title?: string
    reasons?: Array<{
      title?: string
      description?: string
      bulletPoints?: string[]
      concludingParagraph?: string
    }>
  }
  whyScandicommerceSpecializes?: {
    title?: string
    description?: string
    specializations?: Array<{ title?: string; description?: string }>
  }
  shopifyAi?: {
    title?: string
    description?: string
    aiSolutions?: Array<{ title?: string; description?: string }>
  }
  cta?: {
    title?: string
    description?: string
    buttonText?: string
    buttonLink?: string
  }
}

async function getPageData(): Promise<WhyShopifyPageData | null> {
  try {
    const data = await client.fetch<WhyShopifyPageData>(
      whyShopifyPageQuery,
      getQueryParams({}),
      { next: { revalidate: 0 } }
    )
    return data
  } catch (error) {
    console.error('Error fetching Why Shopify page:', error)
    return null
  }
}

export default async function WhyShopifyPage() {
  const pageData = await getPageData()

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData?.hero} />
        <WhatIsShopify whatIsShopify={pageData?.whatIsShopify} />
        <ShopifyFacts shopifyFacts={pageData?.shopifyFacts} />
        <WhyBusinessesChooseShopify whyBusinessesChoose={pageData?.whyBusinessesChoose} />
        <WhyScandicommerceSpecializes whyScandicommerceSpecializes={pageData?.whyScandicommerceSpecializes} />
        <ShopifyAI shopifyAi={pageData?.shopifyAi} />
        <CTA cta={pageData?.cta} />
      </main>
      <FooterWrapper />
    </div>
  )
}
