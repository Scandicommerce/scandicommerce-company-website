'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { hrefFor } from '@/lib/routes'
import { ui } from '@/components/integrations/labels'
import { formatArticleDate } from './FeaturedArticle'

interface AuthorData {
  name?: string
  imageUrl?: string
}

interface ArticleData {
  _type?: string
  title?: string
  description?: string
  category?: string
  date?: string
  readTime?: string
  imageUrl?: string
  slug?: string
  author?: AuthorData
}

interface ArticlesGridData {
  articles?: ArticleData[]
  loadMoreButtonText?: string
  latestPostsLabel?: string
  archiveLabel?: string
  searchPlaceholder?: string
}

interface ArticlesGridProps {
  articlesGrid?: ArticlesGridData
  lang?: string
}

interface NormalizedArticle {
  _type: string
  id: number
  title: string
  description: string
  category: string
  date: string
  readTime: string
  imageUrl: string
  slug: string
  parsedDate: Date | null
  author?: AuthorData
}

const ALL = '__all__'

function parseDate(d: string | undefined): Date | null {
  if (!d) return null
  try {
    const parsed = new Date(d)
    return isNaN(parsed.getTime()) ? null : parsed
  } catch {
    return null
  }
}

function getMonthLabel(d: Date, locale: string): string {
  try {
    return d.toLocaleDateString(locale.startsWith('nb') || locale === 'no' ? 'nb-NO' : 'en-GB', { month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

function SectionLabel({ label, right }: { label: string; right?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
      <span className={ui.eyebrow}>{label}</span>
      {right && <span className="font-mono text-[13px] text-sc-ink-400">{right}</span>}
    </div>
  )
}

/** Three cards: image, category, title, excerpt, date and reading time. */
function DeckCard({ article, index, locale, meta }: { article: NormalizedArticle; index: number; locale: string; meta: string }) {
  const href = article.slug ? hrefFor({ _type: article._type, slug: article.slug, language: locale }, locale) : '#'
  return (
    <Link href={href} className="group flex flex-col gap-5 no-underline">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50">
        {article.imageUrl && (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <span aria-hidden="true" className="absolute left-3 top-3 select-none font-mono text-[10px] uppercase tracking-widest text-white/80">
          {String(index).padStart(2, '0')}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {article.category && (
          <div>
            <span className={ui.tag}>{article.category}</span>
          </div>
        )}
        <h3 className="m-0 text-[20px] font-bold leading-[1.3] tracking-[-0.01em] text-sc-ink-900 transition-colors group-hover:text-sc-cyan-600">{article.title}</h3>
        {article.description && <p className="m-0 line-clamp-2 text-[15px] leading-relaxed text-sc-ink-600">{article.description}</p>}
        {meta && <div className={ui.mono}>{meta}</div>}
      </div>
    </Link>
  )
}

/** The rest as compact rows. */
function ArchiveRow({ article, index, locale, displayDate }: { article: NormalizedArticle; index: number; locale: string; displayDate: string }) {
  const href = article.slug ? hrefFor({ _type: article._type, slug: article.slug, language: locale }, locale) : '#'
  return (
    <Link href={href} className="group -mx-2 grid grid-cols-12 items-baseline gap-x-4 gap-y-2 border-b border-sc-ink-100 px-2 py-7 no-underline transition-colors hover:bg-sc-ink-50/60">
      <div className="col-span-1 select-none pt-1 font-mono text-[11px] text-sc-ink-400">{String(index).padStart(2, '0')}</div>
      <div className="col-span-11 md:col-span-3 md:pt-0.5">
        {article.category && <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500">{article.category}</span>}
      </div>
      <div className="col-span-11 col-start-2 flex flex-col gap-1.5 md:col-span-5 md:col-start-auto">
        <h3 className="m-0 text-[20px] font-bold leading-[1.3] tracking-[-0.01em] text-sc-ink-900 transition-colors group-hover:text-sc-cyan-600">{article.title}</h3>
        {article.description && <p className="m-0 line-clamp-1 text-[14px] leading-relaxed text-sc-ink-600">{article.description}</p>}
      </div>
      <div className="col-span-11 col-start-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[13px] text-sc-ink-500 md:col-span-3 md:col-start-auto md:flex-col md:items-end md:gap-0.5">
        {displayDate && <span>{displayDate}</span>}
        {article.readTime && <span className="text-sc-ink-400">{article.readTime}</span>}
      </div>
    </Link>
  )
}

/**
 * The blog archive: three latest posts as cards, then every other post as a
 * row with search and category filters. Same rhythm as the work page.
 */
export default function ArticlesGrid({ articlesGrid, lang }: ArticlesGridProps) {
  const locale = lang || 'en'
  const isNorwegian = locale === 'no' || locale === 'nb-NO' || locale.startsWith('nb')
  const latestLabel = articlesGrid?.latestPostsLabel || (isNorwegian ? 'Siste innlegg' : 'Latest posts')
  const archiveLabel = articlesGrid?.archiveLabel || (isNorwegian ? 'Arkiv' : 'Archive')
  const searchPlaceholderText = articlesGrid?.searchPlaceholder || (isNorwegian ? 'Søk i arkivet…' : 'Search archive…')
  const allLabel = isNorwegian ? 'Alle' : 'All'
  const emptyLabel = isNorwegian ? 'Ingen innlegg matcher søket.' : 'No posts match your search.'
  const [activeCategory, setActiveCategory] = useState(ALL)
  const [searchQuery, setSearchQuery] = useState('')

  const articles: NormalizedArticle[] = useMemo(() => {
    const raw =
      articlesGrid?.articles && articlesGrid.articles.length > 0
        ? articlesGrid.articles.map((a, i) => ({
            id: i + 1,
            title: a.title || '',
            description: a.description || '',
            category: a.category || '',
            date: a.date || '',
            readTime: a.readTime?.replace(' read', '') || '',
            imageUrl: a.imageUrl || '',
            slug: a.slug || '',
            _type: a._type ?? 'post',
            author: a.author,
          }))
        : []

    return raw.map((a) => ({ ...a, parsedDate: parseDate(a.date) }))
  }, [articlesGrid])

  // The first three are the deck regardless of date; the rest is the archive.
  const deck = useMemo(() => articles.slice(0, 3), [articles])
  const archive = useMemo(() => articles.slice(3), [articles])

  const deckMonthLabel = useMemo(() => {
    const d = deck[0]?.parsedDate
    return d ? getMonthLabel(d, locale) : ''
  }, [deck, locale])

  const categories = useMemo(() => {
    const cats = new Set(archive.map((a) => a.category).filter(Boolean))
    return [ALL, ...Array.from(cats)]
  }, [archive])

  const filteredArchive = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return archive.filter((a) => {
      const matchesCategory = activeCategory === ALL || a.category === activeCategory
      const matchesSearch = !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [archive, activeCategory, searchQuery])

  const totalCount = articles.length
  const countLabel = `${totalCount} ${isNorwegian ? 'innlegg' : 'posts'}`
  const dateOf = (a: NormalizedArticle) => formatArticleDate(a.date, locale, false) || a.date
  const metaOf = (a: NormalizedArticle) => [dateOf(a), a.readTime].filter(Boolean).join(' · ')

  const chip = (active: boolean) =>
    `inline-flex items-center rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
      active ? 'border-sc-ink-900 bg-sc-ink-900 text-white' : 'border-sc-ink-200 bg-white text-sc-ink-600 hover:border-sc-ink-900 hover:text-sc-ink-900'
    }`

  return (
    <section className="bg-white">
      {deck.length > 0 && (
        <div className={`border-b border-sc-ink-100 ${archive.length === 0 ? 'border-b-0' : ''}`}>
          <div className={`${ui.container} py-16 lg:py-20`}>
            <SectionLabel
              label={latestLabel}
              right={
                <>
                  {deckMonthLabel && <span>{deckMonthLabel}</span>}
                  {deckMonthLabel && totalCount > 0 && <span aria-hidden="true"> · </span>}
                  {totalCount > 0 && <span>{countLabel}</span>}
                </>
              }
            />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {deck.map((article, i) => (
                <DeckCard key={article.slug || i} article={article} index={i + 2} locale={locale} meta={metaOf(article)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {archive.length > 0 && (
        <div className={`${ui.container} py-16 lg:py-20`}>
          <div className="mb-8 flex flex-col gap-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <span className={ui.eyebrow}>{archiveLabel}</span>
              <label className="relative block w-full sm:w-72">
                <span className="sr-only">{searchPlaceholderText}</span>
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sc-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholderText}
                  className="w-full rounded-lg border border-sc-ink-200 bg-white py-2.5 pl-9 pr-4 text-sm text-sc-ink-900 placeholder:text-sc-ink-400 focus:border-sc-ink-900 focus:outline-none"
                />
              </label>
            </div>
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={chip(activeCategory === cat)} aria-pressed={activeCategory === cat}>
                    {cat === ALL ? allLabel : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-sc-ink-100">
            {filteredArchive.map((article, i) => (
              <ArchiveRow key={article.slug || i} article={article} index={deck.length + i + 2} locale={locale} displayDate={dateOf(article)} />
            ))}
            {filteredArchive.length === 0 && <p className="m-0 py-10 text-sm text-sc-ink-500">{emptyLabel}</p>}
          </div>
        </div>
      )}
    </section>
  )
}
