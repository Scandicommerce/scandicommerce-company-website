import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@/sanity'
import { sanityImg } from '@/lib/sanityImage'
import { ensureInternalHref, packagesHref } from '@/lib/routes'
import { ui } from '@/components/integrations/labels'

export interface CaseItem {
  /** Anchor id, also used by the hero jump links. */
  id: string
  client?: string
  title: string
  category?: string
  tags: string[]
  summary?: string | unknown[]
  results: { value: string; label: string }[]
  imageUrl?: string
  imageAlt?: string
  href?: string
  date?: string
}

const PACKAGE_TAGS = new Set(['foundation', 'growth', 'premium', 'enterprise'])

export function CaseTags({ category, tags, lang }: { category?: string; tags: string[]; lang: string }) {
  if (!category && tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {category && <span className={ui.tag}>{category}</span>}
      {tags.map((tag, i) => {
        const pkg = tag.trim().toLowerCase()
        return PACKAGE_TAGS.has(pkg) ? (
          <Link key={`${tag}-${i}`} href={`${packagesHref(lang)}/${pkg}`} className={`${ui.tagOutline} no-underline transition-colors hover:border-sc-ink-900 hover:text-sc-ink-900`}>
            {tag}
          </Link>
        ) : (
          <span key={`${tag}-${i}`} className={ui.tagOutline}>
            {tag}
          </span>
        )
      })}
    </div>
  )
}

export function CaseResults({ results, compact = false }: { results: { value: string; label: string }[]; compact?: boolean }) {
  if (results.length === 0) return null
  return (
    <dl className={`m-0 flex flex-wrap ${compact ? 'gap-x-5 gap-y-2' : 'gap-x-8 gap-y-3 border-y border-sc-ink-100 py-5'}`}>
      {results.map((r, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <dd className={`m-0 font-mono font-medium leading-none tracking-tight text-sc-ink-900 ${compact ? 'text-[18px]' : 'text-[26px] md:text-[32px]'}`}>{r.value}</dd>
          <dt className={`leading-snug text-sc-ink-500 ${compact ? 'text-[12px]' : 'text-[13px]'}`}>{r.label}</dt>
        </div>
      ))}
    </dl>
  )
}

export function Summary({ value, className = '' }: { value?: string | unknown[]; className?: string }) {
  if (!value) return null
  const cls = `text-sc-ink-600 [&_p]:m-0 [&_p+p]:mt-2 [&_ul]:list-disc [&_ul]:ml-4 [&_a]:underline [&_a]:decoration-sc-cyan-300 ${className}`
  if (Array.isArray(value)) {
    return (
      <div className={cls}>
        <PortableText value={value} />
      </div>
    )
  }
  return <p className={cls}>{value}</p>
}

interface FeaturedCaseProps {
  item: CaseItem
  label: string
  ctaText: string
  lang: string
}

/**
 * The first case as the featured block, the same shape as the featured
 * article on the blog: copy left (eyebrow, title, results, summary, button),
 * tall image right.
 */
export default function FeaturedCase({ item, label, ctaText, lang }: FeaturedCaseProps) {
  const { id, client, title, category, tags, summary, results, imageUrl, imageAlt, href } = item
  const link = href ? ensureInternalHref(href) : undefined

  return (
    <article id={id} className="scroll-mt-24 border-b border-sc-ink-100">
      <div className={`${ui.container} grid grid-cols-1 items-start gap-10 py-16 md:grid-cols-12 md:gap-12 lg:py-20`}>
        <div className="order-2 flex flex-col gap-6 md:order-1 md:col-span-7">
          <div className={`${ui.eyebrow} inline-flex items-center gap-2`}>
            <span aria-hidden="true" className="inline-block h-px w-6 bg-sc-cyan-500" />
            {label}
            {client ? ` · ${client}` : category ? ` · ${category}` : ''}
          </div>
          <h2 className="m-0 text-[30px] font-bold leading-[1.08] tracking-[-0.02em] text-sc-ink-900 md:text-[40px] lg:text-[48px]">{title}</h2>
          <CaseResults results={results} />
          <Summary value={summary} className="max-w-[560px] text-base leading-relaxed lg:text-lg" />
          <CaseTags category={category} tags={tags} lang={lang} />
          {link && (
            <div className="pt-2">
              <Link href={link} className={`${ui.btnPrimary} w-full no-underline sm:w-auto`}>
                {ctaText}
              </Link>
            </div>
          )}
        </div>
        <div className="order-1 md:order-2 md:col-span-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50 md:aspect-[4/5]">
            {imageUrl && (
              <Image
                src={sanityImg(imageUrl, 1200) as string}
                alt={imageAlt || client || title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
            )}
            <span aria-hidden="true" className="absolute left-4 top-4 select-none font-mono text-[11px] uppercase tracking-widest text-white/80">01</span>
          </div>
        </div>
      </div>
    </article>
  )
}
