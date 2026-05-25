'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { articles as allArticles } from '@/lib/articles'

interface AuthorData {
  name?: string
  imageUrl?: string
}

interface ArticleData {
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
  imageUrl: string
  slug: string
  parsedDate: Date | null
  author?: AuthorData
}

const defaultArticles = allArticles.map((article, index) => ({
  id: article.id || index + 1,
  title: article.title,
  description: article.description,
  category: article.category,
  date: article.date,
  readTime: article.readTime.replace(' read', ''),
  imageUrl: article.image,
  slug: article.slug,
  author: undefined,
}))

function parseDate(d: string | undefined): Date | null {
  if (!d) return null
  try {
    const parsed = new Date(d)
    return isNaN(parsed.getTime()) ? null : parsed
  } catch {
    return null
  }
}

function formatDisplayDate(d: Date | null, raw: string): string {
  if (!d) return raw
  try {
    return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })
  } catch {
    return raw
  }
}

function getMonthLabel(d: Date, locale: string): string {
  try {
    return d.toLocaleDateString(locale.startsWith('nb') || locale === 'no' ? 'nb-NO' : 'en-US', {
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function ArticlesGrid({ articlesGrid, lang }: ArticlesGridProps) {
  const locale = lang || 'en'
  const isNorwegian = locale === 'no' || locale === 'nb-NO' || locale.startsWith('nb')
  const [activeCategory, setActiveCategory] = useState('All')

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
            author: a.author,
          }))
        : defaultArticles

    return raw.map((a) => ({
      ...a,
      parsedDate: parseDate(a.date),
    }))
  }, [articlesGrid])

  const { deck, archive } = useMemo(() => {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonth = articles.filter((a) => a.parsedDate && a.parsedDate >= thisMonthStart)
    const older = articles.filter((a) => !a.parsedDate || a.parsedDate < thisMonthStart)
    return {
      deck: thisMonth.slice(0, 3),
      archive: [...thisMonth.slice(3), ...older],
    }
  }, [articles])

  const deckMonthLabel = useMemo(() => {
    const d = deck[0]?.parsedDate
    return d ? getMonthLabel(d, locale) : ''
  }, [deck, locale])

  const categories = useMemo(() => {
    const cats = new Set(archive.map((a) => a.category).filter(Boolean))
    return ['All', ...Array.from(cats)]
  }, [archive])

  const filteredArchive = useMemo(() => {
    if (activeCategory === 'All') return archive
    return archive.filter((a) => a.category === activeCategory)
  }, [archive, activeCategory])

  const totalCount = articles.length
  const allLabel = isNorwegian ? 'Alle' : 'All'

  return (
    <section className="bg-white pb-24">

      {/* More this month */}
      {deck.length > 0 && (
        <div className="border-b border-neutral-200">
          <div className="section_container mx-auto page-padding-x pt-16 pb-20">
            <div className="flex items-baseline justify-between mb-10">
              <div className="flex items-baseline gap-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#11848C]">
                  {isNorwegian ? 'Mer denne måneden' : 'More this month'}
                </span>
                {deckMonthLabel && (
                  <span className="text-xs text-neutral-400 font-mono">/ {deckMonthLabel}</span>
                )}
              </div>
              {totalCount > 0 && (
                <span className="text-sm font-semibold text-teal font-mono">
                  {totalCount} {isNorwegian ? 'poster' : 'posts'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {deck.map((article, i) => {
                const href = article.slug ? `/${locale}/resources/${article.slug}` : '#'
                const displayDate = formatDisplayDate(article.parsedDate, article.date)
                return (
                  <Link key={article.slug || i} href={href} className="group cursor-pointer">
                    <div className="relative mb-5 overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
                      {article.imageUrl ? (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(135deg, #0F4A4F 0%, #16686E 60%, #1EEFFA 110%)' }}
                        />
                      )}
                      <div className="absolute top-3 left-3 text-white/70 text-[10px] font-mono tracking-widest uppercase select-none">
                        {String(i + 2).padStart(2, '0')}
                      </div>
                    </div>
                    {article.category && (
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#11848C] mb-2.5">
                        {article.category}
                      </div>
                    )}
                    <h3
                      className="font-bold leading-snug mb-3 text-[#1F1D1D] group-hover:text-teal transition-colors duration-200"
                      style={{ fontSize: 20, lineHeight: 1.3, letterSpacing: '-0.005em' }}
                    >
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-2">
                        {article.description}
                      </p>
                    )}
                    <div className="text-xs text-neutral-500 font-mono">
                      {[displayDate, article.readTime].filter(Boolean).join(' · ')}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Archive */}
      {archive.length > 0 && (
        <div className="section_container mx-auto page-padding-x pt-16">
          {/* Header + category tabs */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#11848C]">
              {isNorwegian ? 'Arkiv' : 'Archive'}
            </span>
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs font-semibold px-3 py-1.5 transition-colors duration-150 ${
                      activeCategory === cat
                        ? 'bg-neutral-900 text-white'
                        : 'border border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900'
                    }`}
                  >
                    {cat === 'All' ? allLabel : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Archive rows — desktop */}
          <div className="border-t border-neutral-200">
            {filteredArchive.map((article, i) => {
              const href = article.slug ? `/${locale}/resources/${article.slug}` : '#'
              const displayDate = formatDisplayDate(article.parsedDate, article.date)
              const globalIdx = deck.length + i + 2

              return (
                <Link
                  key={article.slug || i}
                  href={href}
                  className="group grid grid-cols-12 gap-6 items-baseline py-8 border-b border-neutral-200 hover:bg-neutral-50/60 transition-colors duration-150 px-2 -mx-2"
                >
                  {/* Index */}
                  <div className="col-span-1 text-[11px] font-mono text-neutral-400 pt-1 select-none">
                    {String(globalIdx).padStart(2, '0')}
                  </div>

                  {/* Category */}
                  <div className="hidden md:block col-span-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#11848C] pt-1">
                    {article.category}
                  </div>

                  {/* Title + description */}
                  <div className="col-span-9 md:col-span-6">
                    {article.category && (
                      <div className="block md:hidden text-[10px] font-bold uppercase tracking-[0.12em] text-[#11848C] mb-1">
                        {article.category}
                      </div>
                    )}
                    <h3
                      className="font-bold mb-1.5 text-[#1F1D1D] group-hover:text-teal transition-colors duration-200"
                      style={{ fontSize: 20, lineHeight: 1.3, letterSpacing: '-0.005em' }}
                    >
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-sm text-neutral-600 leading-relaxed line-clamp-1">
                        {article.description}
                      </p>
                    )}
                  </div>

                  {/* Date + readTime */}
                  <div className="hidden md:block col-span-2 text-xs text-neutral-500 font-mono pt-1.5 leading-relaxed">
                    {displayDate && <div>{displayDate}</div>}
                    {article.readTime && <div className="text-neutral-400">{article.readTime}</div>}
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:block col-span-1 pt-1 text-right">
                    <ArrowRight
                      className="inline w-[18px] h-[18px] opacity-30 group-hover:opacity-100 transition-opacity duration-200 text-teal"
                      strokeWidth={1.8}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Fallback: all articles if no date grouping */}
      {deck.length === 0 && archive.length === 0 && articles.length > 0 && (
        <div className="section_container mx-auto page-padding-x pt-16">
          <div className="border-t border-neutral-200">
            {articles.map((article, i) => {
              const href = article.slug ? `/${locale}/resources/${article.slug}` : '#'
              const displayDate = formatDisplayDate(article.parsedDate, article.date)
              return (
                <Link
                  key={article.slug || i}
                  href={href}
                  className="group grid grid-cols-12 gap-6 items-baseline py-8 border-b border-neutral-200 hover:bg-neutral-50/60 transition-colors duration-150 px-2 -mx-2"
                >
                  <div className="col-span-1 text-[11px] font-mono text-neutral-400 pt-1 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="hidden md:block col-span-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#11848C] pt-1">
                    {article.category}
                  </div>
                  <div className="col-span-9 md:col-span-6">
                    <h3
                      className="font-bold mb-1.5 text-[#1F1D1D] group-hover:text-teal transition-colors duration-200"
                      style={{ fontSize: 20, lineHeight: 1.3, letterSpacing: '-0.005em' }}
                    >
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-sm text-neutral-600 leading-relaxed line-clamp-1">{article.description}</p>
                    )}
                  </div>
                  <div className="hidden md:block col-span-2 text-xs text-neutral-500 font-mono pt-1.5 leading-relaxed">
                    {displayDate && <div>{displayDate}</div>}
                    {article.readTime && <div className="text-neutral-400">{article.readTime}</div>}
                  </div>
                  <div className="hidden md:block col-span-1 pt-1 text-right">
                    <ArrowRight
                      className="inline w-[18px] h-[18px] opacity-30 group-hover:opacity-100 transition-opacity duration-200 text-teal"
                      strokeWidth={1.8}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

    </section>
  )
}
