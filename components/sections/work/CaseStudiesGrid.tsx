'use client'

import { useMemo, useState } from 'react'
import { sanityImg } from '@/lib/sanityImage'
import Image from 'next/image'
import Link from 'next/link'
import { hrefFor } from '@/lib/routes'
import { ui } from '@/components/integrations/labels'

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

const ALL = '__all__'

const T: Record<string, { all: string; industry: string; challenge: string; empty: string }> = {
  no: { all: 'Alle', industry: 'Bransje', challenge: 'Utfordring', empty: 'Ingen kundecaser matcher filteret.' },
  en: { all: 'All', industry: 'Industry', challenge: 'Challenge', empty: 'No case studies match the filter.' },
}

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

/** Filterable grid of hairline case cards: image, industry tag, title, excerpt. */
export default function CaseStudiesGrid({
  cases = [],
  lang,
  heading = 'Flere kundecaser',
  intro,
  seeAllText = 'Vis alle',
  ctaText = 'Les casestudie',
  initialCount = 6,
}: CaseStudiesGridProps) {
  const t = T[lang ?? 'no'] ?? T.en

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

  const industries = useMemo(() => [ALL, ...Array.from(new Set(unique.map((c) => c.industry).filter(Boolean) as string[]))], [unique])
  const tags = useMemo(() => [ALL, ...Array.from(new Set(unique.flatMap((c) => c.tags || []).filter(Boolean)))], [unique])

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

  const chip = (active: boolean) =>
    `inline-flex items-center rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
      active ? 'border-sc-ink-900 bg-sc-ink-900 text-white' : 'border-sc-ink-200 bg-white text-sc-ink-600 hover:border-sc-ink-900 hover:text-sc-ink-900'
    }`

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={ui.container}>
        <div className="mb-8 flex max-w-[680px] flex-col gap-2.5">
          <h2 className="m-0 text-[28px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 md:text-[32px]">{heading}</h2>
          {intro && <p className="m-0 text-base leading-relaxed text-sc-ink-600 lg:text-lg">{intro}</p>}
        </div>

        {(industries.length > 1 || tags.length > 1) && (
          <div className="mb-10 flex flex-col gap-3">
            {industries.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-400">{t.industry}</span>
                {industries.map((i) => (
                  <button key={i} type="button" onClick={() => setIndustry(i)} className={chip(industry === i)} aria-pressed={industry === i}>
                    {i === ALL ? t.all : i}
                  </button>
                ))}
              </div>
            )}
            {tags.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-sc-ink-400">{t.challenge}</span>
                {tags.map((tg) => (
                  <button key={tg} type="button" onClick={() => setTag(tg)} className={chip(tag === tg)} aria-pressed={tag === tg}>
                    {tg === ALL ? t.all : tg}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {visible.length === 0 ? (
          <p className="m-0 text-sm text-sc-ink-500">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((c) => (
              <Link
                key={c._id}
                href={caseHref(c.slug, c.language, lang)}
                data-cross-locale={isCrossLocale(c.language, lang) || undefined}
                className="group flex flex-col overflow-hidden rounded-lg border border-sc-ink-100 bg-white no-underline transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] w-full bg-sc-ink-100">
                  {c.heroImageUrl && (
                    <Image
                      src={sanityImg(c.heroImageUrl, 800) as string}
                      alt={c.title || 'Kundecase'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  {(c.industry || c.pakke) && (
                    <div className="flex flex-wrap gap-1.5">
                      {c.industry && <span className={ui.tag}>{c.industry}</span>}
                      {c.pakke && <span className={`${ui.tagOutline} capitalize`}>{c.pakke}</span>}
                    </div>
                  )}
                  <h3 className="m-0 line-clamp-2 text-[18px] font-bold leading-[1.3] tracking-[-0.01em] text-sc-ink-900 transition-colors group-hover:text-sc-cyan-600">{c.title}</h3>
                  {c.excerpt && <p className="m-0 line-clamp-3 text-[14px] leading-relaxed text-sc-ink-600">{c.excerpt}</p>}
                  <span className="mt-auto pt-1 text-[13px] font-semibold text-sc-ink-900">{ctaText} →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {hasMore && !expanded && (
          <div className="mt-10 text-center">
            <button type="button" onClick={() => setExpanded(true)} className={ui.btnSecondary}>
              {seeAllText} ({filtered.length})
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
