import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import Features from '@/components/sections/shopify/vipps_hurtigkasse/Features'
import HowToGetStarted from '@/components/sections/shopify/vipps_hurtigkasse/HowToGetStarted'
import Pricing from '@/components/sections/shopify/vipps_hurtigkasse/Pricing'
import OrderForm from '@/components/sections/shopify/vipps_hurtigkasse/OrderForm'
import Support from '@/components/sections/shopify/vipps_hurtigkasse/Support'
import { client } from '@/sanity/lib/client'
import { vippsHurtigkassePageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import Hero from '@/components/layout/Hero'

interface VippsHurtigkassePageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: { heroTitle?: { text?: string; highlight?: string }; heroDescription?: string; heroButtons?: Array<{ text: string; link: string; variant?: string }> }
  features?: { title?: string; paragraphs?: string[]; demoStore?: { text?: string; url?: string; password?: string }; productImage?: { src?: string; alt?: string } }
  howToGetStarted?: { title?: string; steps?: Array<{ title?: string; description?: string; subSteps?: string[] }> }
  pricing?: { sectionTitle?: string; priceItems?: { priceText?: string }[]; priceNote?: string; supportText?: string }
  orderForm?: { title?: string; description?: string }
  support?: { title?: string; buttonText?: string; buttonLink?: string }
  seo?: { metaTitle?: string; metaDescription?: string }
}

export default async function VippsHurtigkassePage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client.fetch<VippsHurtigkassePageData | null>(vippsHurtigkassePageQuery, getQueryParams({}, language), { next: { revalidate: 0 } }).catch(() => null)

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
