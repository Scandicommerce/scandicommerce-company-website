import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import { PortableText } from '@/sanity'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { legalPageBySlugQuery } from '@/sanity/lib/queries'
import { getLanguageFromParams } from '@/lib/language'
import { coalescePageSeo, getSiteSettings } from '@/lib/sanity/pageSeo'
import { buildMetadata } from '@/lib/seo/buildMetadata'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface LegalPageData {
  pageTitle: string
  language?: string
  lastUpdated?: string
  content?: unknown[]
  seo?: { metaTitle?: string; metaDescription?: string }
}

async function getLegalPage(lang: string, slug: string): Promise<LegalPageData | null> {
  const language = getLanguageFromParams({ lang })
  return sanityPageFetch(
    legalPageBySlugQuery,
    { slug, language },
    { next: { revalidate: 0 } }
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const language = getLanguageFromParams({ lang })
  const [page, settings] = await Promise.all([getLegalPage(lang, slug), getSiteSettings(language)])
  if (!page) return {}
  const seo = coalescePageSeo(null, settings)
  seo.metaTitle = page.seo?.metaTitle ?? page.pageTitle
  seo.metaDescription = page.seo?.metaDescription ?? seo.metaDescription
  // Legal pages are served in the requested language but only exist in English:
  // canonical stays self-referencing on this origin; no hreflang cluster.
  return buildMetadata({ seo, settings, language, pathWithoutLang: `legal/${slug}` })
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const page = await getLegalPage(lang, slug)
  if (!page) notFound()

  const lastUpdated = page.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString(
        page.language === 'no' ? 'nb-NO' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : null

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <article className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="mb-2 text-3xl lg:text-4xl font-bold text-[#1F1D1D]">
            {page.pageTitle}
          </h1>
          {lastUpdated && (
            <p className="mb-8 text-sm text-[#565454]">Last updated: {lastUpdated}</p>
          )}
          {Array.isArray(page.content) && page.content.length > 0 && (
            <PortableText value={page.content} className="text-[#1F1D1D]" />
          )}
        </article>
      </main>
      <FooterWrapper />
    </div>
  )
}
