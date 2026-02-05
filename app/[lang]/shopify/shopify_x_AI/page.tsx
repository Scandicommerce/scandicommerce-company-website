import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import EnhancingWithAI from '@/components/sections/shopify/shopify_x_AI/EnhancingWithAI'
import HowWeLeverageAI from '@/components/sections/shopify/shopify_x_AI/HowWeLeverageAI'
import AIToolsToolkit from '@/components/sections/shopify/shopify_x_AI/AIToolsToolkit'
import HowWeApplyAI from '@/components/sections/shopify/shopify_x_AI/HowWeApplyAI'
import AIEnhancedProcess from '@/components/sections/shopify/shopify_x_AI/AIEnhancedProcess'
import FAQ from '@/components/sections/shopify/shopify_x_AI/FAQ'
import CTA from '@/components/sections/shopify/shopify_x_AI/CTA'
import { client } from '@/sanity/lib/client'
import { shopifyXAiPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import Hero from '@/components/layout/Hero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ShopifyXAiPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: {
    heroTitle?: { text?: string; highlight?: string }
    heroDescription?: string
  }
  enhancingWithAi?: {
    title?: string
    paragraph1?: string
    paragraph2?: string
    quote?: { text?: string; author?: string }
  }
  howWeLeverageAi?: {
    title?: string
    capabilities?: Array<{
      title?: string
      description?: string
      bgColor?: string
      features?: string[]
      impactTitle?: string
      impactParagraph1?: string
      impactParagraph2?: string
      linkText?: string
    }>
  }
  aiToolsToolkit?: {
    title?: string
    toolCategories?: Array<{ title?: string; description?: string }>
    bottomText?: string
  }
  howWeApplyAi?: {
    title?: string
    applicationAreas?: Array<{
      title?: string
      description?: string
      features?: string[]
      benefit?: string
    }>
  }
  aiEnhancedProcess?: {
    title?: string
    processSteps?: Array<{ title?: string; description?: string }>
  }
  faq?: {
    title?: string
    items?: Array<{ question?: string; answer?: string }>
  }
  cta?: {
    title?: string
    description?: string
    buttonText?: string
    buttonLink?: string
  }
}

export default async function ShopifyXAIPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })

  const pageData = await client
    .fetch<ShopifyXAiPageData | null>(shopifyXAiPageQuery, getQueryParams({}, language), {
      next: { revalidate: 0 },
    })
    .catch(() => null)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData?.hero} />
        <EnhancingWithAI enhancingWithAi={pageData?.enhancingWithAi} />
        <HowWeLeverageAI howWeLeverageAi={pageData?.howWeLeverageAi} />
        <AIToolsToolkit aiToolsToolkit={pageData?.aiToolsToolkit} />
        <HowWeApplyAI howWeApplyAi={pageData?.howWeApplyAi} />
        <AIEnhancedProcess aiEnhancedProcess={pageData?.aiEnhancedProcess} />
        <FAQ faq={pageData?.faq} />
        <CTA cta={pageData?.cta} />
      </main>
      <FooterWrapper />
    </div>
  )
}
