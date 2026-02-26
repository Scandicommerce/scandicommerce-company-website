import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import WhatIsPIM from '@/components/sections/shopify/shopify_x_PIM/WhatIsPIM'
import IntegratingPIM from '@/components/sections/shopify/shopify_x_PIM/IntegratingPIM'
import WhichBusinesses from '@/components/sections/shopify/shopify_x_PIM/WhichBusinesses'
import TimeSavings from '@/components/sections/shopify/shopify_x_PIM/TimeSavings'
import WhyGoodInvestment from '@/components/sections/shopify/shopify_x_PIM/WhyGoodInvestment'
import CombinedSection from '@/components/sections/shopify/shopify_x_PIM/CombinedSection'
import CTA from '@/components/sections/shopify/shopify_x_PIM/CTA'
import { client } from '@/sanity/lib/client'
import { shopifyXPimPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import Hero from '@/components/layout/Hero'

interface ShopifyXPimPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: { heroTitle?: { text?: string; highlight?: string }; heroDescription?: string }
  whatIsPim?: { title?: string; paragraph1?: string; paragraph2?: string; quote?: { text?: string; author?: string } }
  integratingPim?: { title?: string; description?: string; leftColumnTitle?: string; leftColumnDescription?: string; integrationPoints?: string[]; impactTitle?: string; impactParagraph1?: string; impactParagraph2?: string; linkText?: string }
  whichBusinesses?: { title?: string; description?: string; businessCards?: Array<{ title?: string; description?: string }>; bottomNote?: string }
  timeSavings?: { title?: string; description?: string; savingsCards?: Array<{ title?: string; description?: string; hours?: string }>; summaryTitle?: string; summaryDescription?: string }
  whyGoodInvestment?: { title?: string; description?: string; benefits?: Array<{ title?: string; description?: string }>; bottomNote?: string }
  combinedSection?: { choosingPim?: { title?: string; description?: string; leftColumnTitle?: string; leftColumnDescription?: string; selectionCriteria?: string[]; impactParagraph1?: string; impactParagraph2?: string; linkText?: string }; gettingStarted?: { title?: string; description?: string; steps?: Array<{ title?: string; description?: string }>; bottomNote?: string }; faq?: { title?: string; items?: Array<{ question?: string; answer?: string }> }; transformExperience?: { title?: string; paragraph1?: string; paragraph2?: string; quoteText?: string } }
  cta?: { title?: string; description?: string; buttonText?: string; buttonLink?: string }
}

export default async function ShopifyXPimPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client.fetch<ShopifyXPimPageData | null>(shopifyXPimPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } }).catch(() => null)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData?.hero} />
        <WhatIsPIM whatIsPim={pageData?.whatIsPim} />
        <IntegratingPIM integratingPim={pageData?.integratingPim} />
        <WhichBusinesses whichBusinesses={pageData?.whichBusinesses} />
        <TimeSavings timeSavings={pageData?.timeSavings} />
        <WhyGoodInvestment whyGoodInvestment={pageData?.whyGoodInvestment} />
        <CombinedSection combinedSection={pageData?.combinedSection} />
        <CTA cta={pageData?.cta} />
      </main>
      <FooterWrapper />
    </div>
  )
}
