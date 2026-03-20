'use client'

import ArticleCard from './ArticleCard'
import { articles as allArticles } from '@/lib/articles'

interface ArticleData {
  title?: string
  description?: string
  category?: string
  date?: string
  readTime?: string
  imageUrl?: string
  slug?: string
}

interface ArticlesGridData {
  articles?: ArticleData[]
  loadMoreButtonText?: string
}

interface ArticlesGridProps {
  articlesGrid?: ArticlesGridData
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

export default function ArticlesGrid({ articlesGrid, lang }: ArticlesGridProps) {
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

  // Use Sanity articles if available, otherwise use default articles
  const articles = articlesGrid?.articles && articlesGrid.articles.length > 0
    ? articlesGrid.articles.map((article, index) => ({
        id: index + 1,
        title: article.title || '',
        description: article.description || '',
        category: article.category || '',
        date: formatDate(article.date) || '',
        readTime: article.readTime?.replace(' read', '') || '',
        image: article.imageUrl || '',
        slug: article.slug || '',
      }))
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
