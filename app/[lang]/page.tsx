import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { client } from '@/sanity/lib/client'
import { homepageQuery, allPackagesPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { getAlternateLanguagesForMetadata } from '@/lib/hreflang'
import type { HomepageData } from '@/types/homepage'

import Hero from '@/components/sections/homepage/Hero'
import TrustedBy from '@/components/sections/homepage/TrustedBy'
import PainPoints from '@/components/sections/homepage/PainPoints'
import ServicesPackaged from '@/components/sections/homepage/ServicesPackaged'
import Results from '@/components/sections/homepage/Results'
import HowWeWork from '@/components/sections/homepage/HowWeWork'
import Partners from '@/components/sections/homepage/Partners'
import CTA from '@/components/sections/homepage/CTA'
import HomepageSectionRenderer from '@/components/sections/homepage/HomepageSectionRenderer'
import { fetchLatestInsightsBySectionKey } from '@/lib/homepageLatestInsights'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getHomepage(language?: string): Promise<HomepageData | null> {
  try {
    const data = await client.fetch<HomepageData>(
      homepageQuery,
      getQueryParams({}, language),
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

async function getAllPackages(language?: string): Promise<AllPackagesData | null> {
  try {
    const data = await client.fetch<AllPackagesData>(
      allPackagesPageQuery,
      getQueryParams({}, language),
      { next: { revalidate: 0 } }
    )
    return data
  } catch (error) {
    console.error('Error fetching all packages:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const alternates = getAlternateLanguagesForMetadata('')
  return { alternates: Object.keys(alternates).length ? { languages: alternates } : undefined }
}

function LegacyHomepageSections({
  homepage,
  allPackages,
}: {
  homepage: HomepageData
  allPackages: AllPackagesData | null
}) {
  return (
    <>
      <Hero hero={homepage?.hero} />
      <TrustedBy trustedBy={homepage?.trustedBy} />
      <PainPoints painPoints={homepage?.painPoints} />
      <ServicesPackaged
        data={homepage?.servicesShowcase}
        packages={
          homepage?.servicesShowcase?.packages?.length
            ? {
                packagesItems: homepage.servicesShowcase.packages.map((pkg) => ({
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
                  buttonText: pkg.buttonText || 'View Details',
                })),
              }
            : allPackages?.packages
        }
      />
      <Results data={homepage?.results} />
      <HowWeWork process={homepage?.process} />
      <Partners partners={homepage?.partners} />
      <CTA data={homepage?.cta} />
    </>
  )
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const homepage = await getHomepage(language)
  const allPackages = await getAllPackages(language)

  const usePageBuilder =
    homepage?.sections &&
    Array.isArray(homepage.sections) &&
    homepage.sections.length > 0

  const latestInsightsByKey =
    usePageBuilder && homepage?.sections
      ? await fetchLatestInsightsBySectionKey(homepage.sections, language)
      : {}

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        {homepage && usePageBuilder ? (
          <HomepageSectionRenderer
            sections={homepage.sections!}
            packagesFallback={allPackages?.packages}
            latestInsightsByKey={latestInsightsByKey}
            lang={lang}
          />
        ) : homepage ? (
          <LegacyHomepageSections homepage={homepage} allPackages={allPackages} />
        ) : null}
      </main>
      <FooterWrapper />
    </div>
  )
}
