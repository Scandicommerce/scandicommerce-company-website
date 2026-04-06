import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { VippsHurtigkassePageSectionRenderer } from '@/components/pageSectionRenderers/VippsHurtigkassePageSectionRenderer'
import { client } from '@/sanity/lib/client'
import { vippsHurtigkassePageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface VippsHurtigkassePageData {
  _id: string
  pageTitle: string
  slug: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
  features?: Record<string, unknown>
  howToGetStarted?: Record<string, unknown>
  pricing?: Record<string, unknown>
  orderForm?: Record<string, unknown>
  support?: Record<string, unknown>
}

export default async function VippsHurtigkassePage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = await client
    .fetch<VippsHurtigkassePageData | null>(vippsHurtigkassePageQuery, getQueryParams({}, language), { next: { revalidate: 0 } })
    .catch(() => null)

  const sections = normalizePageSections('vippsHurtigkassePage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <VippsHurtigkassePageSectionRenderer sections={sections} />
      </main>
      <FooterWrapper />
    </div>
  )
}
