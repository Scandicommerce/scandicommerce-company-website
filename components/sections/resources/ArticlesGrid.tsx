'use client'

import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
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
  lang?: string
}

interface NormalizedArticle {
  id: number
  title: string
  description: string
  category: string
  date: string
  readTime: string
  image: string
  slug: string
  parsedDate: Date | null
}

// Default articles from lib
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

function parseArticleDate(d: string | undefined): Date | null {
  if (!d) return null
  try {
    const parsed = new Date(d)
    if (!isNaN(parsed.getTime())) return parsed
  } catch {}
  return null
}

function formatDisplayDate(d: Date | null, raw: string): string {
  if (!d) return raw
  try {
    return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })
  } catch {
    return raw
  }
}

function getBayLabel(date: Date, locale: string): string {
  try {
    return date.toLocaleDateString(locale === 'no' || locale === 'nb-NO' ? 'nb-NO' : 'en-US', {
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function ArticlesGrid({ articlesGrid, lang }: ArticlesGridProps) {
  const locale = lang || 'en'

  const articles: NormalizedArticle[] = useMemo(() => {
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

    const raw =
      articlesGrid?.articles && articlesGrid.articles.length > 0
        ? articlesGrid.articles.map((article, index) => ({
            id: index + 1,
            title: article.title || '',
            description: article.description || '',
            category: article.category || '',
            date: formatDate(article.date) || '',
            readTime: article.readTime?.replace(' read', '') || '',
            image: article.imageUrl || '',
            slug: article.slug || '',
            _rawDate: article.date,
          }))
        : defaultArticles.map((a) => ({ ...a, _rawDate: a.date }))

    return raw.map((a) => ({
      ...a,
      parsedDate: parseArticleDate(a._rawDate),
    }))
  }, [articlesGrid])

  const { thisMonth, lastMonth, older } = useMemo(() => {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const thisMonth: NormalizedArticle[] = []
    const lastMonth: NormalizedArticle[] = []
    const older: NormalizedArticle[] = []

    for (const a of articles) {
      const d = a.parsedDate
      if (!d) {
        older.push(a)
      } else if (d >= thisMonthStart) {
        thisMonth.push(a)
      } else if (d >= lastMonthStart) {
        lastMonth.push(a)
      } else {
        older.push(a)
      }
    }

    return { thisMonth, lastMonth, older }
  }, [articles])

  // Running index counter across all groups (1-based)
  let counter = 0

  const thisMonthLabel =
    thisMonth[0]?.parsedDate ? getBayLabel(thisMonth[0].parsedDate, locale) : ''
  const lastMonthLabel =
    lastMonth[0]?.parsedDate ? getBayLabel(lastMonth[0].parsedDate, locale) : ''

  const olderRange = useMemo(() => {
    const dates = older.map((a) => a.parsedDate).filter(Boolean) as Date[]
    if (!dates.length) return ''
    const newest = dates.reduce((a, b) => (a > b ? a : b))
    const oldest = dates.reduce((a, b) => (a < b ? a : b))
    if (newest.getFullYear() === oldest.getFullYear()) return String(newest.getFullYear())
    return `${oldest.getFullYear()} – ${newest.getFullYear()}`
  }, [older])

  const isNorwegian = locale === 'no' || locale === 'nb-NO' || locale.startsWith('nb')

  return (
    <section className="bg-white pb-20">
      <div className="section_container mx-auto page-padding-x space-y-20">

        {/* Bay 1: This month */}
        {thisMonth.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8">
            {/* Sticky left label */}
            <div className="md:col-span-3 md:sticky md:top-20 md:self-start pt-2 pb-4 md:pb-0 border-b md:border-b-0 border-neutral-200 md:border-transparent">
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1F1D1D]">
                {isNorwegian ? 'Denne måneden' : 'This month'}
              </div>
              <div className="font-mono text-xs text-neutral-400 mt-1">
                {thisMonthLabel} · {thisMonth.length} {isNorwegian ? 'noter' : 'notes'}
              </div>
            </div>
            {/* Rows */}
            <div className="md:col-span-9">
              {thisMonth.map((article) => {
                counter++
                return (
                  <ArticleCard
                    key={article.slug || counter}
                    article={{
                      ...article,
                      date: formatDisplayDate(article.parsedDate, article.date),
                    }}
                    idx={counter}
                    variant="large"
                    lang={locale}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Bay 2: Last month */}
        {lastMonth.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-3 md:sticky md:top-20 md:self-start pt-2 pb-4 md:pb-0 border-b md:border-b-0 border-neutral-200 md:border-transparent">
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1F1D1D]">
                {isNorwegian ? 'Forrige måned' : 'Last month'}
              </div>
              <div className="font-mono text-xs text-neutral-400 mt-1">
                {lastMonthLabel} · {lastMonth.length} {isNorwegian ? 'noter' : 'notes'}
              </div>
            </div>
            <div className="md:col-span-9">
              {lastMonth.map((article) => {
                counter++
                return (
                  <ArticleCard
                    key={article.slug || counter}
                    article={{
                      ...article,
                      date: formatDisplayDate(article.parsedDate, article.date),
                    }}
                    idx={counter}
                    variant="default"
                    lang={locale}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Bay 3: Older */}
        {older.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-3 md:sticky md:top-20 md:self-start pt-2 pb-4 md:pb-0 border-b md:border-b-0 border-neutral-200 md:border-transparent">
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1F1D1D]">
                {isNorwegian ? 'Eldre' : 'Older'}
              </div>
              {olderRange && (
                <div className="font-mono text-xs text-neutral-400 mt-1">{olderRange}</div>
              )}
            </div>
            <div className="md:col-span-9">
              {older.map((article) => {
                counter++
                return (
                  <ArticleCard
                    key={article.slug || counter}
                    article={{
                      ...article,
                      date: formatDisplayDate(article.parsedDate, article.date),
                    }}
                    idx={counter}
                    variant="compact"
                    lang={locale}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* If all articles fall in "older" (e.g. no recent posts), show them ungrouped */}
        {thisMonth.length === 0 && lastMonth.length === 0 && older.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-3 pt-2 pb-4 md:pb-0">
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1F1D1D]">
                {isNorwegian ? 'Alle' : 'All'}
              </div>
            </div>
            <div className="md:col-span-9">
              {articles.map((article, i) => (
                <ArticleCard
                  key={article.slug || i}
                  article={{
                    ...article,
                    date: formatDisplayDate(article.parsedDate, article.date),
                  }}
                  idx={i + 1}
                  variant="default"
                  lang={locale}
                />
              ))}
            </div>
          </div>
        )}

        {/* Archive link */}
        {older.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8 pt-4 border-t border-neutral-200">
            <div className="md:col-span-3" />
            <div className="md:col-span-9 pt-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-dark transition-colors duration-200 cursor-pointer">
                {isNorwegian ? 'Eldre arkiv' : 'Older archive'}
                {olderRange ? ` (${olderRange})` : ''} — {older.length}{' '}
                {isNorwegian ? 'noter' : 'notes'}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
