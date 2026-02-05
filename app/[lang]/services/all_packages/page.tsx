import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import PricingPackages from '@/components/sections/services/all_packages/PricingPackages'
import FAQ from '@/components/sections/services/all_packages/FAQ'
import { client } from '@/sanity/lib/client'
import { allPackagesPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import Hero from '@/components/layout/Hero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface AllPackagesPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: { heroTitle?: { text?: string; highlight?: string }; heroDescription?: string }
  packages?: {
    packagesItems?: Array<{
      title: string
      subtitle: string
      price: string
      priceType: string
      timeline: string
      rating: number
      ratingValue: string
      bestFor: string[]
      included: string[]
      description: string
      href: string
    }>
  }
  faq?: { faqTitle?: string; faqItems?: Array<{ question: string; answer: string }> }
}

export default async function ServicesAllPackages({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client.fetch<AllPackagesPageData>(
    allPackagesPageQuery,
    getQueryParams({}, language),
    { next: { revalidate: 0 } }
  )

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={{ ...pageData?.hero }} />
        <PricingPackages packages={pageData?.packages} />
        <FAQ faq={pageData?.faq} />
        <FooterWrapper />
      </main>
    </div>
  )
}
