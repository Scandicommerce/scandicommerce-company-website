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
}

interface CaseStudyProps {
  item: CaseItem
  /** Image on the right instead of the left (desktop). */
  reverse?: boolean
  ctaText: string
  lang: string
}

const PACKAGE_TAGS = new Set(['foundation', 'growth', 'premium', 'enterprise'])

function Summary({ value }: { value?: string | unknown[] }) {
  if (!value) return null
  const className =
    'text-[15px] leading-relaxed text-sc-ink-600 [&_p]:m-0 [&_p+p]:mt-2 [&_ul]:list-disc [&_ul]:ml-4 [&_a]:underline [&_a]:decoration-sc-cyan-300'
  if (Array.isArray(value)) {
    return (
      <div className={className}>
        <PortableText value={value} />
      </div>
    )
  }
  return <p className={className}>{value}</p>
}

/**
 * One case as a full-width card on the integrations card pattern: hairline,
 * radius 8, image panel on one side, results as mono figures, tags as chips.
 * Package tags link to the package page.
 */
export default function CaseStudy({ item, reverse = false, ctaText, lang }: CaseStudyProps) {
  const { id, client, title, category, tags, summary, results, imageUrl, imageAlt, href } = item

  return (
    <article
      id={id}
      className={`flex scroll-mt-24 flex-col overflow-hidden rounded-lg border border-sc-ink-100 bg-white ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      {/* Image panel */}
      <div className="relative h-[200px] shrink-0 bg-sc-ink-50 md:h-auto md:min-h-[260px] md:w-[320px] lg:w-[380px]">
        {imageUrl && (
          <Image
            src={sanityImg(imageUrl, 900) as string}
            alt={imageAlt || client || title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 380px"
          />
        )}
        {client && (
          <span className="absolute bottom-4 left-4 inline-flex items-center rounded-md bg-white px-2.5 py-1 text-sm font-semibold tracking-[-0.01em] text-sc-ink-900">
            {client}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 md:p-7 lg:p-8">
        {(category || tags.length > 0) && (
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
        )}

        <h2 className="m-0 text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-sc-ink-900 md:text-[26px]">{title}</h2>

        {results.length > 0 && (
          <dl className="m-0 grid grid-cols-3 gap-4 border-y border-sc-ink-100 py-4">
            {results.map((r, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <dd className="m-0 font-mono text-[22px] font-medium leading-none tracking-tight text-sc-ink-900 md:text-[26px]">{r.value}</dd>
                <dt className="text-xs leading-snug text-sc-ink-500 md:text-[13px]">{r.label}</dt>
              </div>
            ))}
          </dl>
        )}

        <Summary value={summary} />

        {href && (
          <div className="mt-auto pt-1">
            <Link href={ensureInternalHref(href)} className={`${ui.btnPrimary} w-full no-underline sm:w-auto`}>
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}
