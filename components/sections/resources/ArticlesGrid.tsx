'use client'

import ArticleCard from './ArticleCard'
import { articles as allArticles } from '@/lib/articles'

interface ArticleData {
  title?: string
  description?: string
  category?: string
  date?: string
  readTime?: string | null
  imageUrl?: string | null
  slug?: string | null
}

interface ArticlesGridData {
  articles?: ArticleData[]
  loadMoreButtonText?: string
}

const CARD_IMAGE_PLACEHOLDER = '/images/resources/featured_article/banner.png'

interface ArticlesGridProps {
  articlesGrid?: ArticlesGridData
  /** When non-empty, replaces manual grid refs — lists every published post for the locale */
  articlesListing?: ArticleData[]
  /** Omit this slug from the grid when it is already shown as the featured article */
  featuredArticleSlug?: string
  /** Current locale (e.g. "en", "no") so article links work on /no/resources/blog etc. */
  lang?: string
}

// Transform static articles from lib format to ArticleCard format
const defaultArticles = allArticles.map((article, index) => ({
  id: article.id || index + 1,
  title: article.title,
  description: article.description,
  category: article.category,
  date: article.date,
  readTime: article.readTime.replace(' read', ''),
  image: article.image,
  slug: article.slug,
}))

export default function ArticlesGrid({
  articlesGrid,
  articlesListing,
  featuredArticleSlug,
  lang,
}: ArticlesGridProps) {
  const loadMoreButtonText = articlesGrid?.loadMoreButtonText || 'Load More Articles'

  // Format ISO date (e.g. from post publishedAt) for display
  const formatDate = (d: string | undefined) => {
    if (!d) return ''
    if (d.includes('T')) {
      try {
        return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      } catch {
        return d
      }
    }
    return d
  }

  const mapSanityToCards = (raw: ArticleData[], startId: number) =>
    raw.map((article, index) => ({
      id: startId + index,
      title: article.title || '',
      description: article.description || '',
      category: article.category || '',
      date: formatDate(article.date) || '',
      readTime:
        article.readTime != null && article.readTime !== ''
          ? String(article.readTime).replace(' read', '')
          : '',
      image: article.imageUrl || CARD_IMAGE_PLACEHOLDER,
      slug: article.slug || '',
    }))

  const featuredSlug = featuredArticleSlug?.trim()
  const rawListing = articlesListing ?? []
  const listingFiltered = rawListing.filter(
    (a) => !featuredSlug || (a.slug && a.slug !== featuredSlug)
  )

  // Prefer full locale listing from GROQ so the index is not limited to manual grid references
  const hasCmsListing = rawListing.length > 0
  const articles = hasCmsListing
    ? mapSanityToCards(listingFiltered, 0)
    : articlesGrid?.articles && articlesGrid.articles.length > 0
      ? mapSanityToCards(articlesGrid.articles, 0)
      : defaultArticles

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-0">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id || index}
            article={article}
            lang={lang}
          />
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <button className="bg-[#03C1CA] text-white px-8 py-3 lg:px-10 lg:py-4 font-semibold hover:bg-[#03a8b0] transition-colors">
          {loadMoreButtonText}
        </button>
      </div>
    </section>
  )
}
