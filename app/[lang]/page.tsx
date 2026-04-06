import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { client } from '@/sanity/lib/client'
import { homepageQuery, allPackagesPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { getAlternateLanguagesForMetadata } from '@/lib/hreflang'
import { HomepageSectionRenderer } from '@/components/HomepageSectionRenderer'
import type { HomepageFromSanity, HomepageSectionBlock } from '@/lib/homepageSections'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface HomepageData extends HomepageFromSanity {
  _id: string
  pageTitle: string
  slug: string
}

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

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const homepage = await getHomepage(language)
  const allPackages = await getAllPackages(language)
  const sections = normalizePageSections('landingPage', homepage)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <HomepageSectionRenderer sections={sections as HomepageSectionBlock[]} allPackages={allPackages} />
      </main>
      <FooterWrapper />
    </div>
  )
}
