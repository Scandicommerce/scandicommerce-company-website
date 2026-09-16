'use client'

import { useMemo, useState } from 'react'
import { sanityImg } from '@/lib/sanityImage'
import Image from 'next/image'
import Link from 'next/link'
import { IoMdArrowForward } from 'react-icons/io'
import { hrefFor } from '@/lib/routes'

export interface CaseCard {
  _id: string
  language?: string
  title?: string
  slug?: string
  excerpt?: string
  industry?: string
  tags?: string[]
  pakke?: string
  heroImageUrl?: string
  clientLogoUrl?: string
}

interface CaseStudiesGridProps {
  cases?: CaseCard[]
  /** Language of the page rendering the grid, for same-vs-cross-language hrefs. */
  lang?: string
  heading?: string
  intro?: string
  seeAllText?: string
  ctaText?: string
  /** How many cards to show before "see all". */
  initialCount?: number
}

const ALL = 'Alle'

/** Case-study href via the shared route helper: same language → relative
 * `/kundecaser|/work/<slug>`; other language → absolute URL on its own origin
 * (no redirect hop). Cross-locale anchors are flagged with data-cross-locale. */
function caseHref(slug?: string, language?: string, pageLang?: string): string {
  if (!slug) return '#'
  return hrefFor({ _type: 'caseStudy', slug, language: language ?? pageLang ?? 'en' }, pageLang ?? language ?? 'en')
}
function isCrossLocale(language?: string, pageLang?: string): boolean {
  return Boolean(language && pageLang && language !== pageLang)
}

export default function CaseStudiesGrid({
  cases = [],
  lang,
  heading = 'Flere kundecaser',
  intro,
  seeAllText = 'Vis alle',
  ctaText = 'Les casestudie',
  initialCount = 6,
}: CaseStudiesGridProps) {
  // Dedupe by slug (real data has a few duplicate case documents).
  const unique = useMemo(() => {
    const seen = new Set<string>()
    return cases.filter((c) => {
      const key = c.slug || c._id
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [cases])

  const industries = useMemo(
    () => [ALL, ...Array.from(new Set(unique.map((c) => c.industry).filter(Boolean) as string[]))],
    [unique]
  )
  const tags = useMemo(
    () => [ALL, ...Array.from(new Set(unique.flatMap((c) => c.tags || []).filter(Boolean)))],
    [unique]
  )

  const [industry, setIndustry] = useState(ALL)
  const [tag, setTag] = useState(ALL)
  const [expanded, setExpanded] = useState(false)

  const filtered = useMemo(
    () =>
      unique.filter((c) => {
        const matchIndustry = industry === ALL || c.industry === industry
        const matchTag = tag === ALL || (c.tags || []).includes(tag)
        return matchIndustry && matchTag
      }),
    [unique, industry, tag]
  )

  if (unique.length === 0) return null

  const visible = expanded ? filtered : filtered.slice(0, initialCount)
  const hasMore = filtered.length > initialCount

  const pill = (active: boolean) =>
    `px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
      active
        ? 'bg-[#03C1CA] text-white border-[#03C1CA]'
        : 'bg-white text-[#565454] border-gray-300 hover:border-[#03C1CA]'
    }`

  return (
    <section className="bg-white pb-16 lg:pb-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1F1D1D] mb-2">{heading}</h2>
          {intro && <p className="text-[#565454] max-w-2xl">{intro}</p>}
        </div>

        {/* Filters */}
        {(industries.length > 1 || tags.length > 1) && (
          <div className="space-y-3 mb-10">
            {industries.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#8a8888] mr-1">
                  Bransje
                </span>
                {industries.map((i) => (
                  <button key={i} onClick={() => setIndustry(i)} className={pill(industry === i)}>
                    {i}
                  </button>
                ))}
              </div>
            )}
            {tags.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#8a8888] mr-1">
                  Utfordring
                </span>
                {tags.map((t) => (
                  <button key={t} onClick={() => setTag(t)} className={pill(tag === t)}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grid */}
        {visible.length === 0 ? (
          <p className="text-[#565454]">Ingen kundecaser matcher filteret.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((c) => (
              <Link
                key={c._id}
                href={caseHref(c.slug, c.language, lang)} data-cross-locale={isCrossLocale(c.language,  lang) || undefined}
                className="group flex flex-col rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative w-full h-48 bg-gray-100">
                  {c.heroImageUrl && (
                    <Image
                      src={sanityImg(c.heroImageUrl, 800) as string}
                      alt={c.title || 'Kundecase'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  {c.industry && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#03C1CA] mb-2">
                      {c.industry}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-[#1F1D1D] mb-2 line-clamp-2">{c.title}</h3>
                  {c.excerpt && (
                    <p className="text-sm text-[#565454] mb-4 line-clamp-3 flex-grow">{c.excerpt}</p>
                  )}
                  <span className="inline-flex items-center text-[#03C1CA] font-semibold text-sm mt-auto">
                    {ctaText}
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">
                      <IoMdArrowForward />
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {hasMore && !expanded && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setExpanded(true)}
              className="px-6 py-3 text-sm font-bold tracking-wide uppercase text-[#1F1D1D] bg-[#1EEFFA] hover:bg-teal transition-colors shadow-button"
            >
              {seeAllText} ({filtered.length})
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
