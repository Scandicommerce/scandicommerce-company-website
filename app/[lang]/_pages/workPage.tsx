import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { WorkPageSectionRenderer } from '@/components/pageSectionRenderers/WorkPageSectionRenderer'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { workPageQuery, caseStudyCardsQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'
import type { CaseCard } from '@/components/sections/work/CaseStudiesGrid'

interface WorkPageData {
  _id: string
  pageTitle?: string
  slug?: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: { heroTitle?: { text?: string; highlight?: string }; heroDescription?: string }
  caseStudies?: {
    studies?: {
      title?: string
      category?: string
      tags?: string[]
      challenge?: string | unknown[]
      solution?: string | unknown[]
      results?: { value?: string; label?: string }[]
      imageUrl?: string
      imageAlt?: string
      link?: string
    }[]
  }
  cta?: { title?: string; description?: string; buttonText?: string; buttonLink?: string }
  seo?: { metaTitle?: string; metaDescription?: string }
}

export default async function WorkPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const [pageData, allCases]: [WorkPageData, CaseCard[]] = await Promise.all([
    sanityPageFetch(workPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } }),
    sanityPageFetch(caseStudyCardsQuery, getQueryParams({}, language), { next: { revalidate: 0 } }),
  ])

  const sections = normalizePageSections('workPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <WorkPageSectionRenderer sections={sections} allCases={allCases} lang={language} />
        <FooterWrapper />
      </main>
    </div>
  )
}
