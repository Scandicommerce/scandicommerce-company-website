import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { AboutPageSectionRenderer } from '@/components/pageSectionRenderers/AboutPageSectionRenderer'
import { getAboutPageDocumentCached } from '@/lib/sanity/cachedDocuments'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface AboutPageData {
  _id: string
  pageTitle?: string
  slug?: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  seo?: { metaTitle?: string; metaDescription?: string }
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData = (await getAboutPageDocumentCached(language)) as AboutPageData | null

  const sections = normalizePageSections('aboutPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <AboutPageSectionRenderer sections={sections} lang={language} />
        <FooterWrapper />
      </main>
    </div>
  )
}
