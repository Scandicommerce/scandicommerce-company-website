import Image from 'next/image'
import Link from 'next/link'
import FeaturedCase, { CaseResults, CaseTags, Summary, type CaseItem } from './CaseStudy'
import type { CaseCard } from './CaseStudiesGrid'
import { ensureInternalHref, hrefFor } from '@/lib/routes'
import { sanityImg } from '@/lib/sanityImage'
import { ui } from '@/components/integrations/labels'

interface Study {
  title?: string
  client?: string
  category?: string
  tags?: string[]
  challenge?: string | unknown[]
  solution?: string | unknown[]
  results?: { value?: string; label?: string }[]
  imageUrl?: string
  imageAlt?: string
  link?: string
}

/** A blog post that tells a customer story (tagged "Case study" / "Case-studie"). */
export interface CasePost {
  _id: string
  _type: string
  language?: string
  title?: string
  slug?: string
  excerpt?: string
  imageUrl?: string
  publishedAt?: string
}

export interface CaseStudiesData {
  eyebrow?: string
  heading?: string
  intro?: string
  featuredLabel?: string
  deckLabel?: string
  archiveLabel?: string
  ctaText?: string
  includeDocuments?: boolean
  studies?: Study[]
}

interface CaseStudiesProps {
  caseStudies?: CaseStudiesData
  items: CaseItem[]
  lang: string
}

const T: Record<string, { readMore: string; featured: string; deck: string; archive: string; count: (n: number) => string }> = {
  no: { readMore: 'Les hele casen', featured: 'Utvalgt kundecase', deck: 'Flere kundecaser', archive: 'Alle kundecaser', count: (n) => `${n} caser` },
  en: { readMore: 'Read the full case', featured: 'Featured case', deck: 'More case studies', archive: 'All case studies', count: (n) => `${n} cases` },
  sv: { readMore: 'Läs hela caset', featured: 'Utvalt kundcase', deck: 'Fler kundcase', archive: 'Alla kundcase', count: (n) => `${n} case` },
  da: { readMore: 'Læs hele casen', featured: 'Udvalgt kundecase', deck: 'Flere kundecases', archive: 'Alle kundecases', count: (n) => `${n} cases` },
  de: { readMore: 'Ganzes Projekt lesen', featured: 'Ausgewähltes Projekt', deck: 'Weitere Projekte', archive: 'Alle Projekte', count: (n) => `${n} Projekte` },
}

function hasContent(value: string | unknown[] | undefined): value is string | unknown[] {
  return Array.isArray(value) ? value.length > 0 : Boolean(value && value.trim())
}

/** Plain text of a string or Portable Text value, for matching only. */
function plainText(value: string | unknown[] | undefined): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value
    .flatMap((block) => ((block as { children?: { text?: string }[] }).children ?? []).map((c) => c.text ?? ''))
    .join(' ')
}

function anchorId(label: string, used: Set<string>): string {
  const base =
    'case-' +
    (label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'item')
  let id = base
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`
  used.add(id)
  return id
}

// Slug words that say nothing about which client a case is about.
const GENERIC_SLUG_WORDS = new Set(
  'case study studies shopify scandicommerce how helped achieve achieved modernizing modernising their foundation sales growth percent went from full ecommerce control conversion grew unified brands delivered with and the store nettbutikk kundecase kundecaser salgsvekst modernisere deres plattform hvordan hjalp oppnå resources blogg blog work plus development costs reclaim focus'.split(' ')
)

/** Client-identifying words of a slug, e.g. "lanullva", "lnda" or "groupe", "marcelle". */
function clientWords(slug: string): string[] {
  return slug
    .toLowerCase()
    .split(/[^a-z0-9æøå]+/)
    .filter((w) => w.length >= 4 && !GENERIC_SLUG_WORDS.has(w) && !/^\d+$/.test(w))
}

/**
 * Every case the page shows, in order: the curated studies from the work page
 * first, then each case-study document and case-tagged blog post that nothing
 * shown so far already covers (matched on client words, since the curated
 * studies hold no reference to the documents and the same case exists once per
 * language). A curated study without an image borrows the image of the blog
 * post it links to. Documents in the page language win over other languages.
 */
export function buildCaseItems(caseStudies: CaseStudiesData | undefined, allCases: CaseCard[] = [], posts: CasePost[] = [], lang = 'no'): CaseItem[] {
  const used = new Set<string>()
  const studies = caseStudies?.studies ?? []
  const postBySlug = new Map(posts.filter((p) => p.slug).map((p) => [p.slug!.toLowerCase(), p]))

  const linkedPost = (link?: string) => {
    if (!link) return undefined
    const last = link.toLowerCase().replace(/[?#].*$/, '').replace(/\/+$/, '').split('/').pop() ?? ''
    return postBySlug.get(last)
  }

  const items: CaseItem[] = studies.map((s) => {
    const post = linkedPost(s.link)
    return {
      id: anchorId(s.client || s.title || '', used),
      client: s.client,
      title: s.title ?? '',
      category: s.category,
      tags: s.tags ?? [],
      summary: hasContent(s.solution) ? s.solution : hasContent(s.challenge) ? s.challenge : post?.excerpt,
      results: (s.results ?? []).filter((r) => r.value).map((r) => ({ value: r.value ?? '', label: r.label ?? '' })),
      imageUrl: s.imageUrl || post?.imageUrl,
      imageAlt: s.imageAlt,
      href: s.link || undefined,
      date: post?.publishedAt,
    }
  })

  if (caseStudies?.includeDocuments === false) return items

  let covered = studies
    .map((s) => [s.client, s.title, s.link, plainText(s.solution), plainText(s.challenge)].join(' '))
    .join(' ')
    .toLowerCase()
  const isCovered = (slug: string, title = '') => {
    const words = clientWords(slug)
    return words.length > 0 ? words.some((w) => covered.includes(w)) : covered.includes(slug.toLowerCase())
  }
  const cover = (slug: string, title = '') => {
    covered += ` ${slug.toLowerCase()} ${title.toLowerCase()}`
  }

  const byLanguage = <T extends { language?: string }>(list: T[]) => [...list].sort((a, b) => Number(b.language === lang) - Number(a.language === lang))

  for (const c of byLanguage(allCases)) {
    if (!c.slug || isCovered(c.slug, c.title)) continue
    cover(c.slug, c.title)
    items.push({
      id: anchorId(c.title || c.slug, used),
      title: c.title ?? '',
      category: c.industry,
      tags: c.tags ?? [],
      summary: c.excerpt,
      results: [],
      imageUrl: c.heroImageUrl,
      imageAlt: c.title,
      href: hrefFor({ _type: 'caseStudy', slug: c.slug, language: c.language ?? lang }, lang),
    })
  }

  for (const p of byLanguage(posts)) {
    if (!p.slug || isCovered(p.slug, p.title)) continue
    cover(p.slug, p.title)
    items.push({
      id: anchorId(p.title || p.slug, used),
      title: (p.title ?? '').trim(),
      tags: [],
      summary: p.excerpt,
      results: [],
      imageUrl: p.imageUrl,
      imageAlt: p.title,
      href: hrefFor({ _type: p._type, slug: p.slug, language: p.language ?? lang }, lang),
      date: p.publishedAt,
    })
  }
  return items
}

function SectionLabel({ label, right }: { label: string; right?: string }) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-4">
      <span className={ui.eyebrow}>{label}</span>
      {right && <span className="font-mono text-[13px] text-sc-ink-400">{right}</span>}
    </div>
  )
}

/** Three small cards: image, category, title, excerpt, results. The image and
 * title link; package tags are links of their own, so the card is not one. */
function DeckCard({ item, index, lang }: { item: CaseItem; index: number; lang: string }) {
  const link = item.href ? ensureInternalHref(item.href) : undefined
  const image = (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50">
      {item.imageUrl && (
        <Image
          src={sanityImg(item.imageUrl, 800) as string}
          alt={item.imageAlt || item.client || item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}
      <span aria-hidden="true" className="absolute left-3 top-3 select-none font-mono text-[10px] uppercase tracking-widest text-white/80">
        {String(index).padStart(2, '0')}
      </span>
    </div>
  )
  const title = <h3 className="m-0 text-[20px] font-bold leading-[1.3] tracking-[-0.01em] text-sc-ink-900 transition-colors group-hover:text-sc-cyan-600">{item.title}</h3>
  return (
    <div id={item.id} className="group flex scroll-mt-24 flex-col gap-5">
      {link ? (
        <Link href={link} className="block no-underline" aria-label={item.title}>
          {image}
        </Link>
      ) : (
        image
      )}
      <div className="flex flex-col gap-3">
        <CaseTags category={item.category} tags={item.tags.slice(0, 2)} lang={lang} />
        {link ? (
          <Link href={link} className="no-underline">
            {title}
          </Link>
        ) : (
          title
        )}
        <Summary value={item.summary} className="line-clamp-2 text-[15px] leading-relaxed" />
        <CaseResults results={item.results.slice(0, 3)} compact />
      </div>
    </div>
  )
}

/** The rest as compact rows, like the blog archive. */
function ArchiveRow({ item, index, readMore }: { item: CaseItem; index: number; readMore: string }) {
  const link = item.href ? ensureInternalHref(item.href) : undefined
  const inner = (
    <>
      <div className="col-span-1 select-none pt-1 font-mono text-[11px] text-sc-ink-400">{String(index).padStart(2, '0')}</div>
      <div className="col-span-11 flex flex-col gap-2 md:col-span-3 md:pt-0.5">
        {(item.client || item.category) && <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500">{item.client || item.category}</span>}
        {item.client && item.category && <span className="text-[13px] text-sc-ink-500">{item.category}</span>}
      </div>
      <div className="col-span-11 col-start-2 flex flex-col gap-1.5 md:col-span-5 md:col-start-auto">
        <h3 className="m-0 text-[20px] font-bold leading-[1.3] tracking-[-0.01em] text-sc-ink-900 transition-colors group-hover:text-sc-cyan-600">{item.title}</h3>
        <Summary value={item.summary} className="line-clamp-1 text-[14px] leading-relaxed" />
      </div>
      <div className="col-span-11 col-start-2 flex flex-wrap items-start justify-between gap-3 md:col-span-3 md:col-start-auto md:justify-end">
        {item.results.length > 0 ? <CaseResults results={item.results.slice(0, 2)} compact /> : <span className="text-[13px] font-semibold text-sc-ink-900">{readMore} →</span>}
      </div>
    </>
  )
  const cls = 'group grid grid-cols-12 items-baseline gap-x-4 gap-y-2 border-b border-sc-ink-100 py-7 no-underline scroll-mt-24 transition-colors hover:bg-sc-ink-50/60 -mx-2 px-2'
  return link ? (
    <Link id={item.id} href={link} className={cls}>
      {inner}
    </Link>
  ) : (
    <div id={item.id} className={cls}>
      {inner}
    </div>
  )
}

export default function CaseStudies({ caseStudies, items, lang }: CaseStudiesProps) {
  if (items.length === 0) return null
  const t = T[lang] ?? T.en
  const ctaText = caseStudies?.ctaText || t.readMore
  const [featured, ...rest] = items
  const deck = rest.slice(0, 3)
  const archive = rest.slice(3)
  const hasIntro = Boolean(caseStudies?.heading || caseStudies?.intro)

  return (
    <section className="bg-white">
      {hasIntro && (
        <div className={`${ui.container} flex max-w-[680px] flex-col gap-2.5 pt-16`}>
          {caseStudies?.eyebrow && <div className={ui.eyebrow}>{caseStudies.eyebrow}</div>}
          {caseStudies?.heading && <h2 className={ui.h2}>{caseStudies.heading}</h2>}
          {caseStudies?.intro && <p className="m-0 text-lg leading-relaxed text-sc-ink-600">{caseStudies.intro}</p>}
        </div>
      )}

      <FeaturedCase item={featured} label={caseStudies?.featuredLabel || t.featured} ctaText={ctaText} lang={lang} />

      {deck.length > 0 && (
        <div className={`border-b border-sc-ink-100 ${archive.length === 0 ? 'border-b-0' : ''}`}>
          <div className={`${ui.container} py-16 lg:py-20`}>
            <SectionLabel label={caseStudies?.deckLabel || t.deck} right={t.count(items.length)} />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {deck.map((item, i) => (
                <DeckCard key={item.id} item={item} index={i + 2} lang={lang} />
              ))}
            </div>
          </div>
        </div>
      )}

      {archive.length > 0 && (
        <div className={`${ui.container} py-16 lg:py-20`}>
          <SectionLabel label={caseStudies?.archiveLabel || t.archive} />
          <div className="border-t border-sc-ink-100">
            {archive.map((item, i) => (
              <ArchiveRow key={item.id} item={item} index={i + 2 + deck.length} readMore={ctaText} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
