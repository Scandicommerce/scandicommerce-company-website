import CaseStudy, { type CaseItem } from './CaseStudy'
import type { CaseCard } from './CaseStudiesGrid'
import { hrefFor } from '@/lib/routes'
import { ui } from '@/components/integrations/labels'

const READ_MORE: Record<string, string> = {
  no: 'Les hele casen',
  en: 'Read the full case',
  sv: 'Läs hela caset',
  da: 'Læs hele casen',
  de: 'Ganzes Projekt lesen',
}

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

export interface CaseStudiesData {
  eyebrow?: string
  heading?: string
  intro?: string
  ctaText?: string
  studies?: Study[]
}

interface CaseStudiesProps {
  caseStudies?: CaseStudiesData
  items: CaseItem[]
  lang: string
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
  'case study studies shopify scandicommerce how helped achieve achieved modernizing modernising their foundation sales growth percent went from full ecommerce control conversion grew unified brands delivered with and the store nettbutikk kundecase'.split(' ')
)

/** Client-identifying words of a case-study slug, e.g. "lanullva" or "groupe", "marcelle". */
function clientWords(slug: string): string[] {
  return slug
    .toLowerCase()
    .split(/[^a-z0-9æøå]+/)
    .filter((w) => w.length >= 5 && !GENERIC_SLUG_WORDS.has(w) && !/^\d+$/.test(w))
}

/**
 * Every case shown as a full card: the curated studies on the work page first,
 * then each case-study document nothing shown so far already covers. A document
 * counts as covered when one of its client words appears in a shown case's
 * client, title, link or text (the curated studies hold no reference to the
 * documents, and the same case exists once per language with its own slug).
 * Documents in the page language win over other languages.
 */
export function buildCaseItems(caseStudies: CaseStudiesData | undefined, allCases: CaseCard[] = [], lang = 'no'): CaseItem[] {
  const used = new Set<string>()
  const studies = caseStudies?.studies ?? []

  const items: CaseItem[] = studies.map((s) => ({
    id: anchorId(s.client || s.title || '', used),
    client: s.client,
    title: s.title ?? '',
    category: s.category,
    tags: s.tags ?? [],
    summary: hasContent(s.solution) ? s.solution : hasContent(s.challenge) ? s.challenge : undefined,
    results: (s.results ?? []).filter((r) => r.value).map((r) => ({ value: r.value ?? '', label: r.label ?? '' })),
    imageUrl: s.imageUrl,
    imageAlt: s.imageAlt,
    href: s.link || undefined,
  }))

  let covered = studies
    .map((s) => [s.client, s.title, s.link, plainText(s.solution), plainText(s.challenge)].join(' '))
    .join(' ')
    .toLowerCase()
  const byLanguage = [...allCases].sort((a, b) => Number(b.language === lang) - Number(a.language === lang))
  for (const c of byLanguage) {
    if (!c.slug) continue
    const words = clientWords(c.slug)
    const isCovered = words.length > 0 ? words.some((w) => covered.includes(w)) : covered.includes(c.slug.toLowerCase())
    if (isCovered) continue
    covered += ` ${c.slug.toLowerCase()} ${(c.title ?? '').toLowerCase()}`
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
  return items
}

export default function CaseStudies({ caseStudies, items, lang }: CaseStudiesProps) {
  if (items.length === 0) return null
  const ctaText = caseStudies?.ctaText || READ_MORE[lang] || READ_MORE.en
  const hasIntro = Boolean(caseStudies?.heading || caseStudies?.intro)

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-6`}>
        {hasIntro && (
          <div className="mb-4 flex max-w-[680px] flex-col gap-2.5">
            {caseStudies?.eyebrow && <div className={ui.eyebrow}>{caseStudies.eyebrow}</div>}
            {caseStudies?.heading && <h2 className={ui.h2}>{caseStudies.heading}</h2>}
            {caseStudies?.intro && <p className="m-0 text-lg leading-relaxed text-sc-ink-600">{caseStudies.intro}</p>}
          </div>
        )}
        {items.map((item, index) => (
          <CaseStudy key={item.id} item={item} reverse={index % 2 === 1} ctaText={ctaText} lang={lang} />
        ))}
      </div>
    </section>
  )
}
