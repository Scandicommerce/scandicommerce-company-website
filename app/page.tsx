import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { client } from '@/sanity/lib/client'
import { homepageQuery, allPackagesPageQuery } from '@/sanity/lib/queries'

// Original homepage sections - now connected to Sanity
import Hero from '@/components/sections/homepage/Hero'
import TrustedBy from '@/components/sections/homepage/TrustedBy'
import PainPoints from '@/components/sections/homepage/PainPoints'
import ServicesPackaged from '@/components/sections/homepage/ServicesPackaged'
import Results from '@/components/sections/homepage/Results'
import HowWeWork from '@/components/sections/homepage/HowWeWork'
import Partners from '@/components/sections/homepage/Partners'
import CTA from '@/components/sections/homepage/CTA'

// Disable caching - always fetch fresh data from Sanity
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface HomepageData {
  _id: string
  pageTitle: string
  slug: string
  hero?: {
    heroBadge?: string
    heroTitle?: {
      text?: string
      highlight?: string
    }
    heroDescription?: string
    heroButtons?: Array<{
      text: string
      link: string
      variant?: 'primary' | 'secondary'
    }>
    heroTagline?: string
    heroPackages?: Array<{
      title: string
      price?: string
    }>
  }
  trustedBy?: {
    title?: string
    brands?: Array<{
      name: string
      logo?: {
        asset?: {
          url?: string
        }
      }
      alt?: string
      link?: string
    }>
  }
  painPoints?: {
    painPointsTitle?: { text?: string; highlight?: string }
    painPointsItems?: Array<{ text: string }>
    painPointsBottomText?: string
    painPointsCta?: { text?: string; url?: string }
  }
  servicesShowcase?: {
    title?: { text?: string; highlight?: string }
    subtitle?: string
    categories?: Array<{
      title: string
      icon?: string
      description?: string
      price?: string
      link?: string
      linkText?: string
    }>
    packages?: Array<{
      title: string
      subtitle?: string
      price: string
      priceType?: string
      timeline?: string
      rating?: number
      ratingValue?: string
      bestFor?: string[]
      buttonText?: string
      buttonLink?: string
    }>
  }
  results?: {
    title?: string
    subtitle?: string
    items?: Array<{
      clientImage?: { asset?: { url?: string } }
      clientName: string
      stat: string
      metricName?: string
      description?: string
      ctaText?: string
      ctaLink?: string
    }>
  }
  process?: {
    processTitle?: string
    processSubtitle?: string
    processSteps?: Array<{
      number?: number
      title: string
      description?: string
    }>
  }
  partners?: {
    partnersBadges?: Array<{
      text: string
      link?: string
    }>
    partnersDescription?: string
  }
  cta?: {
    title?: string
    subtitle?: string
    buttons?: Array<{
      text: string
      link: string
      variant?: 'primary' | 'secondary'
    }>
  }
}

async function getHomepage(): Promise<HomepageData | null> {
  try {
    const data = await client.fetch<HomepageData>(
      homepageQuery,
      {},
      { next: { revalidate: 0 } }
    )
    return data
  } catch (error) {
    console.error('Error fetching homepage:', error)
    return null
  }
}

interface AllPackagesData {
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
}

async function getAllPackages(): Promise<AllPackagesData | null> {
  try {
    const data = await client.fetch<AllPackagesData>(
      allPackagesPageQuery,
      {},
      { next: { revalidate: 0 } }
    )
    return data
  } catch (error) {
    console.error('Error fetching all packages:', error)
    return null
  }
}

export default async function Home() {
  const homepage = await getHomepage()
  const allPackages = await getAllPackages()

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        {/* Hero Section - uses Sanity content variables */}
        <Hero hero={homepage?.hero} />
        
        {/* TrustedBy - uses Sanity content variables */}
        <TrustedBy trustedBy={homepage?.trustedBy} />
        
        {/* Pain Points - uses Sanity content variables */}
        <PainPoints painPoints={homepage?.painPoints} />
        
        {/* Services Packaged - uses packages from Landing Page, fallback to All Packages page */}
        <ServicesPackaged 
          data={homepage?.servicesShowcase} 
          packages={homepage?.servicesShowcase?.packages?.length ? { packagesItems: homepage.servicesShowcase.packages.map(pkg => ({
            title: pkg.title || '',
            subtitle: pkg.subtitle || '',
            price: pkg.price || '',
            priceType: pkg.priceType || '',
            timeline: pkg.timeline || '',
            rating: pkg.rating || 0,
            ratingValue: pkg.ratingValue || '',
            bestFor: pkg.bestFor || [],
            included: [],
            description: '',
            href: pkg.buttonLink || '',
            buttonText: pkg.buttonText || 'View Details'
          })) } : allPackages?.packages} 
        />
        
        {/* Results - uses Sanity content variables */}
        <Results data={homepage?.results} />
        
        {/* How We Work - uses Sanity content variables */}
        <HowWeWork process={homepage?.process} />
        
        {/* Partners - uses Sanity content variables */}
        <Partners partners={homepage?.partners} />
        
        {/* CTA - uses Sanity content variables */}
        <CTA data={homepage?.cta} />
      </main>
      <FooterWrapper />
    </div>
  )
}
