import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { partnersPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { PartnersPageSectionRenderer } from '@/components/pageSectionRenderers/PartnersPageSectionRenderer'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'
import type { PartnerCategoryItem } from '@/lib/partnersCategories'

interface PartnersPageData {
  _id: string
  pageTitle?: string
  slug?: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  seo?: { metaTitle?: string; metaDescription?: string }
}

export default async function PartnersPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await sanityPageFetch<PartnersPageData>(partnersPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })

  const sections = normalizePageSections('partnersPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <PartnersPageSectionRenderer sections={sections} lang={language} />
        <FooterWrapper />
      </main>
    </div>
  )
}
