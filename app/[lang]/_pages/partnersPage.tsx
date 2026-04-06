import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { client } from '@/sanity/lib/client'
import { partnersPageQuery, partnerCategoriesQuery } from '@/sanity/lib/queries'
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
  hero?: { heroTitle?: { text?: string; highlight?: string }; heroDescription?: string }
  whyOurPartnership?: {
    title?: string
    features?: { icon?: string; title?: string; description?: string }[]
  }
  partnersGrid?: {
    partners?: {
      name?: string
      category?: string
      categories?: PartnerCategoryItem[] | string[]
      description?: string
      benefits?: string[]
      image?: { asset?: { _id?: string; url?: string }; crop?: unknown; hotspot?: unknown }
      logo?: { asset?: { _id?: string; url?: string }; crop?: unknown; hotspot?: unknown }
    }[]
  }
  cta?: { title?: string; description?: string; buttonText?: string; buttonLink?: string }
  seo?: { metaTitle?: string; metaDescription?: string }
}

export default async function PartnersPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const [pageData, categoryList] = await Promise.all([
    client.fetch<PartnersPageData>(partnersPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } }),
    client.fetch<PartnerCategoryItem[]>(partnerCategoriesQuery, {}, { next: { revalidate: 0 } }),
  ])

  const sections = normalizePageSections('partnersPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <PartnersPageSectionRenderer sections={sections} categoryList={categoryList ?? undefined} />
        <FooterWrapper />
      </main>
    </div>
  )
}
