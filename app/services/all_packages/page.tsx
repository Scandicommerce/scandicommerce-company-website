import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import PricingPackages from '@/components/sections/services/all_packages/PricingPackages'
import FAQ from '@/components/sections/services/all_packages/FAQ'
import { client } from '@/sanity/lib/client'
import { allPackagesPageQuery } from '@/sanity/lib/queries'
import Hero from '@/components/layout/Hero'
import { Button } from '@/components/ui'

// Disable caching - always fetch fresh data from Sanity
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface AllPackagesPageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: {
    heroTitle?: {
      text?: string
      highlight?: string
    }
    heroDescription?: string
  }
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
  faq?: {
    faqTitle?: string
    faqItems?: Array<{
      question: string
      answer: string
    }>
  }
}

async function getPageData(): Promise<AllPackagesPageData | null> {
  try {
    const data = await client.fetch<AllPackagesPageData>(
      allPackagesPageQuery,
      {},
      { next: { revalidate: 0 } }
    )
    return data
  } catch (error) {
    console.error('Error fetching All Packages page:', error)
    return null
  }
}

const buttonContents = [
  'Woocommerce',
  'Adobe (Magento)',
  'Bigcommerce',
  'Salesforce commerce cloud',
]

export default async function ServicesAllPackages() {
  const pageData = await getPageData()

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero
          hero={{
            ...pageData?.hero}}
        >
        </Hero>
        {/* <Hero hero={pageData?.hero} /> */}
        <PricingPackages packages={pageData?.packages} />
        <FAQ faq={pageData?.faq} />
        <FooterWrapper />
      </main>
    </div>
  )
}
