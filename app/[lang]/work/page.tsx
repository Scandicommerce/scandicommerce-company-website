import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import CaseStudies from '@/components/sections/work/CaseStudies'
import CTA from '@/components/sections/work/CTA'
import Hero from '@/components/layout/Hero'
import { client } from '@/sanity/lib/client'
import { workPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { getAlternateLanguagesForMetadata } from '@/lib/hreflang'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface WorkPageData {
  _id: string
  pageTitle?: string
  slug?: string
  hero?: { heroTitle?: { text?: string; highlight?: string }; heroDescription?: string }
  caseStudies?: {
    studies?: {
      title?: string
      category?: string
      tags?: string[]
      challenge?: string
      solution?: string
      results?: { value?: string; label?: string }[]
      imageUrl?: string
      imageAlt?: string
      link?: string
    }[]
  }
  cta?: { title?: string; description?: string; buttonText?: string; buttonLink?: string }
  seo?: { metaTitle?: string; metaDescription?: string }
}

export async function generateMetadata() {
  const alternates = getAlternateLanguagesForMetadata('work')
  return { alternates: Object.keys(alternates).length ? { languages: alternates } : undefined }
}

export default async function Work({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData: WorkPageData = await client.fetch(
    workPageQuery,
    getQueryParams({}, language),
    { next: { revalidate: 0 } }
  )

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero hero={pageData?.hero} />
        <CaseStudies caseStudies={pageData?.caseStudies} />
        <CTA cta={pageData?.cta} />
        <FooterWrapper />
      </main>
    </div>
  )
}
