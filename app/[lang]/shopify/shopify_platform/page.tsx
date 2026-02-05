import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import BleedingMoney from '@/components/sections/shopify/shopify_platform/BleedingMoney'
import ShopifyEmpires from '@/components/sections/shopify/shopify_platform/ShopifyEmpires'
import RevenueForm from '@/components/sections/shopify/shopify_platform/RevenueForm'
import SuccessStories from '@/components/sections/shopify/shopify_platform/SuccessStories'
import { client } from '@/sanity/lib/client'
import { shopifyPlatformPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import Hero from '@/components/layout/Hero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ShopifyPlatformPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: { heroTitle?: { text?: string; highlight?: string }; heroDescription?: string }
  bleedingMoney?: { title?: string; leftPoints?: string[]; rightPoints?: string[]; bottomPoint?: string }
  shopifyEmpires?: {
    title?: string
    features?: Array<{ title?: string; description?: string; highlight?: string }>
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
    caseStudies?: Array<{ clientName?: string; heading?: string; description?: string; imageUrl?: string }>
  }
}

export default async function ShopifyPlatformPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client.fetch<ShopifyPlatformPageData>(
    shopifyPlatformPageQuery,
    getQueryParams({}, language),
    { next: { revalidate: 0 } }
  )

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
