import ArticlesGrid from '@/components/sections/resources/ArticlesGrid'
import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FeaturedArticle from '@/components/sections/resources/FeaturedArticle'
import GetShopifyInsitesDelivered from '@/components/sections/resources/GetShopifyInsitesDelivered'
import { client } from '@/sanity/lib/client'
import { blogPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getLanguageFromParams } from '@/lib/language'
import { getAlternateLanguagesForMetadata } from '@/lib/hreflang'
import Hero from '@/components/layout/Hero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface BlogPageData {
  _id: string
  pageTitle?: string
  slug?: string
  hero?: {
    heroTitle?: { highlight?: string; text?: string }
    heroDescription?: string
    searchPlaceholder?: string
  }
  featuredArticle?: {
    imageUrl?: string
    tags?: { label?: string; isPrimary?: boolean }[]
    title?: string
    description?: string
    date?: string
    readTime?: string
    link?: string
    buttonText?: string
  }
  articlesGrid?: {
    articles?: {
      title?: string
      description?: string
      category?: string
      date?: string
      readTime?: string
      imageUrl?: string
      slug?: string
    }[]
    loadMoreButtonText?: string
  }
  newsletterCta?: {
    title?: string
    description?: string
    emailPlaceholder?: string
    buttonText?: string
  }
  seo?: { metaTitle?: string; metaDescription?: string }
}

export async function generateMetadata() {
  const alternates = getAlternateLanguagesForMetadata('resources/blog')
  return { alternates: Object.keys(alternates).length ? { languages: alternates } : undefined }
}

export default async function Resources({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  const pageData: BlogPageData = await client.fetch(
    blogPageQuery,
    getQueryParams({}, language),
    { next: { revalidate: 0 } }
  )

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <Hero
          hero={{
            ...pageData?.hero,
            searchPlaceholder: 'Search for a package',
          }}
          searchable={true}
        />
        <FeaturedArticle featuredArticle={pageData?.featuredArticle} lang={lang} />
        <ArticlesGrid articlesGrid={pageData?.articlesGrid} lang={lang} />
        <GetShopifyInsitesDelivered newsletterCta={pageData?.newsletterCta} />
        <FooterWrapper />
      </main>
    </div>
  )
}
