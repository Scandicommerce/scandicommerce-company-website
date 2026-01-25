import ArticlesGrid from '@/components/sections/resources/ArticlesGrid'
import FooterWrapper from '@/components/layout/FooterWrapper'
import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FeaturedArticle from '@/components/sections/resources/FeaturedArticle'
import GetShopifyInsitesDelivered from '@/components/sections/resources/GetShopifyInsitesDelivered'
import { client } from '@/sanity/lib/client'
import { blogPageQuery } from '@/sanity/lib/queries'
import Hero from '@/components/layout/Hero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface BlogPageData {
  _id: string
  pageTitle?: string
  slug?: string
  hero?: {
    heroTitle?: {
      highlight?: string
      text?: string
    }
    heroDescription?: string
    searchPlaceholder?: string
  }
  featuredArticle?: {
    imageUrl?: string
    tags?: {
      label?: string
      isPrimary?: boolean
    }[]
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
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export default async function Resources() {
  const pageData: BlogPageData = await client.fetch(
    blogPageQuery,
    {},
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
        <FeaturedArticle featuredArticle={pageData?.featuredArticle} />
        <ArticlesGrid articlesGrid={pageData?.articlesGrid} />
        <GetShopifyInsitesDelivered newsletterCta={pageData?.newsletterCta} />
        <FooterWrapper />
      </main>
    </div>
  )
}
