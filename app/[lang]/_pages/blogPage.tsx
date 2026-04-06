import { BlogPageSectionRenderer } from '@/components/pageSectionRenderers/BlogPageSectionRenderer'
import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { client } from '@/sanity/lib/client'
import { blogPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'

interface BlogPageData {
  _id: string
  pageTitle?: string
  slug?: string
  sections?: Array<{ _type: string; _key: string } & Record<string, unknown>>
  hero?: Record<string, unknown>
  featuredArticle?: Record<string, unknown>
  articlesGrid?: Record<string, unknown>
  newsletterCta?: Record<string, unknown>
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData: BlogPageData | null = await client.fetch(
    blogPageQuery,
    getQueryParams({}, language),
    { next: { revalidate: 0 } }
  )

  const sections = normalizePageSections('blogPage', pageData)

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <BlogPageSectionRenderer sections={sections} lang={lang} />
        <FooterWrapper />
      </main>
    </div>
  )
}
