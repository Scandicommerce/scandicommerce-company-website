import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@/sanity'
import { sanityImg } from '@/lib/sanityImage'
import { ensureInternalHref, packagesHref } from '@/lib/routes'

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

const tagLink =
  'text-sc-ink-900 underline decoration-sc-cyan-300 decoration-2 underline-offset-[3px] hover:decoration-sc-cyan-500'

function Summary({ value }: { value?: string | unknown[] }) {
  if (!value) return null
  const className =
    'text-sm leading-normal text-sc-ink-600 [&_p]:m-0 [&_p+p]:mt-2 [&_ul]:list-disc [&_ul]:ml-4 [&_a]:underline [&_a]:decoration-sc-cyan-300'
  if (Array.isArray(value)) {
    return (
      <div className={className}>
        <PortableText value={value} />
      </div>
    )
  }
  return <p className={className}>{value}</p>
}

export default function CaseStudy({ item, reverse = false, ctaText, lang }: CaseStudyProps) {
  const { id, client, title, category, tags, summary, results, imageUrl, imageAlt, href } = item

  return (
    <article
      id={id}
      className={`scroll-mt-24 flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white border border-sc-ink-100 rounded-[14px] md:rounded-[20px] overflow-hidden shadow-[0_2px_6px_rgba(10,13,15,0.08)]`}
    >
      {/* Image panel */}
      <div className="relative shrink-0 h-[150px] md:h-auto md:min-h-[240px] md:w-[300px] lg:w-[340px] bg-sc-cyan-50">
        {imageUrl && (
          <Image
            src={sanityImg(imageUrl, 900) as string}
            alt={imageAlt || client || title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 340px"
          />
        )}
        {category && (
          <span className="absolute top-3.5 left-4 md:top-5 md:left-5 bg-white text-sc-cyan-700 text-[11px] md:text-xs px-2.5 py-1 rounded-full">
            {category}
          </span>
        )}
        {client && (
          <span className="absolute bottom-3.5 left-4 md:bottom-5 md:left-5 bg-white text-sc-ink-900 text-lg md:text-xl font-bold tracking-[-0.02em] px-3 py-1 rounded-full">
            {client}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 p-4 md:px-7 md:py-6 flex flex-col gap-3 md:gap-3.5">
        {tags.length > 0 && (
          <div className="text-xs md:text-[13px] text-sc-ink-500">
            {tags.map((tag, i) => {
              const pkg = tag.trim().toLowerCase()
              return (
                <Fragment key={`${tag}-${i}`}>
                  {i > 0 && ' · '}
                  {PACKAGE_TAGS.has(pkg) ? (
                    <Link href={`${packagesHref(lang)}/${pkg}`} className={tagLink}>
                      {tag}
                    </Link>
                  ) : (
                    tag
                  )}
                </Fragment>
              )
            })}
          </div>
        )}

        <h2 className="m-0 text-lg md:text-[22px] leading-[1.2] font-bold tracking-[-0.02em] text-sc-ink-900">
          {title}
        </h2>

        {results.length > 0 && (
          <dl className="m-0 grid grid-cols-3 gap-2 py-3 border-y border-sc-ink-100 md:flex md:flex-wrap md:gap-x-7 md:gap-y-2 md:py-0 md:border-0">
            {results.map((r, i) => (
              <div key={i} className="md:flex md:items-baseline md:gap-1.5">
                <dt className="sr-only">{r.label}</dt>
                <dd className="m-0 text-xl md:text-2xl font-bold text-sc-cyan-600">{r.value}</dd>
                <dd className="m-0 text-xs md:text-[13px] text-sc-ink-500">{r.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <Summary value={summary} />

        {href && (
          <Link
            href={ensureInternalHref(href)}
            className="block text-center md:inline-block md:self-start mt-1 bg-sc-cyan-500 hover:bg-sc-cyan-600 text-sc-ink-900 font-bold text-[15px] md:text-sm px-5 py-3 md:py-[11px] rounded-full transition-colors"
          >
            {ctaText} →
          </Link>
        )}
      </div>
    </article>
  )
}
