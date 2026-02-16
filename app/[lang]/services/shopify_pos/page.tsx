import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import OmnichannelFeatures from '@/components/sections/services/shopify_pos/OmnichannelFeatures'
import PerfectFor from '@/components/sections/services/shopify_pos/PerfectFor'
import ReadyForOmnichannel from '@/components/sections/services/shopify_pos/ReadyForOmnichannel'
import { client } from '@/sanity/lib/client'
import { shopifyPosPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { getAlternateLanguagesForMetadata } from '@/lib/hreflang'
import Hero from '@/components/layout/Hero'
import { Button } from '@/components/ui'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ShopifyPosPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: {
    heroTitle?: { text?: string; highlight?: string }
    heroDescription?: string
    heroButtonText?: string
    heroButtonLink?: string
  }
  features?: {
    featuresTitle?: string
    featuresItems?: Array<{ title: string; description: string; icon?: string }>
  }
  perfectFor?: {
    perfectForTitle?: string
    perfectForItems?: Array<{ title: string; description: string }>
  }
  cta?: {
    ctaTitle?: string
    ctaDescription?: string
    ctaButtonText?: string
    ctaButtonLink?: string
  }
}

export async function generateMetadata() {
  const alternates = getAlternateLanguagesForMetadata('services/shopify_pos')
  return { alternates: Object.keys(alternates).length ? { languages: alternates } : undefined }
}

export default async function ShopifyPOSPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })

  const pageData = await client
    .fetch<ShopifyPosPageData | null>(shopifyPosPageQuery, getQueryParams({}, language), {
      next: { revalidate: 0 },
    })
    .catch(() => null)

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
