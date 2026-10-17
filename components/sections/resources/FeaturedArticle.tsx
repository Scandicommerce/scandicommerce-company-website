import Image from 'next/image'
import Link from 'next/link'
import { hrefFor } from '@/lib/routes'
import { ui } from '@/components/integrations/labels'

interface AuthorData {
  name?: string
  imageUrl?: string
}

interface TagData {
  label?: string
  isPrimary?: boolean
}

interface FeaturedArticleData {
  articleSlug?: string
  articleType?: string
  articleLanguage?: string
  imageUrl?: string
  tags?: TagData[]
  title?: string
  description?: string
  date?: string
  readTime?: string
  link?: string
  buttonText?: string
  pageHeaderEyebrow?: string
  pageHeaderTitle?: string
  author?: AuthorData
}

interface FeaturedArticleProps {
  featuredArticle?: FeaturedArticleData
  lang?: string
}

function isNorwegianLocale(locale: string): boolean {
  return locale === 'no' || locale === 'nb-NO' || locale.startsWith('nb')
}

export function formatArticleDate(d: string | undefined, locale: string, withYear = true): string {
  if (!d) return ''
  try {
    const parsed = new Date(d)
    if (isNaN(parsed.getTime())) return d
    return parsed.toLocaleDateString(isNorwegianLocale(locale) ? 'nb-NO' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      ...(withYear ? { year: 'numeric' } : {}),
    })
  } catch {
    return d
  }
}

/**
 * Blog index header and the featured article, the same shape as the featured
 * case on the work page: copy left (eyebrow, title, lead, author, button),
 * tall image right in a hairline frame.
 */
export default function FeaturedArticle({ featuredArticle, lang }: FeaturedArticleProps) {
  const imageUrl = featuredArticle?.imageUrl || '/images/resources/featured_article/banner.png'
  const title = featuredArticle?.title || ''
  const locale = lang || 'en'
  const isNorwegian = isNorwegianLocale(locale)
  const date = formatArticleDate(featuredArticle?.date, locale)
  const readTime = featuredArticle?.readTime || ''
  const tags = (featuredArticle?.tags || []).filter((t) => t.label)
  const primaryTag = tags.find((t) => t.isPrimary) ?? tags[0]
  const description = featuredArticle?.description || ''
  const author = featuredArticle?.author

  const buttonText = featuredArticle?.buttonText || (isNorwegian ? 'Les artikkelen' : 'Read the post')
  const eyebrow = featuredArticle?.pageHeaderEyebrow || (isNorwegian ? 'Notater fra studioet' : 'Notes from the studio')
  const pageTitle = featuredArticle?.pageHeaderTitle || (isNorwegian ? 'Hva vi sendte\nog lærte.' : 'What we\nshipped & learned.')
  const featuredLabel = isNorwegian ? 'Utvalgt' : 'Featured'
  const articleSlug = featuredArticle?.articleSlug?.trim()
  const link =
    featuredArticle?.link ||
    (articleSlug
      ? hrefFor({ _type: featuredArticle?.articleType ?? 'post', slug: articleSlug, language: featuredArticle?.articleLanguage ?? locale }, locale)
      : '#')
  const meta = [date, readTime ? `${readTime} ${isNorwegian ? 'lesing' : 'read'}` : ''].filter(Boolean).join(' · ')

  return (
    <>
      {/* Page header */}
      <section className="border-b border-sc-ink-100 bg-white">
        <div className={`${ui.container} pb-12 pt-14 lg:pb-16 lg:pt-20`}>
          <div className="flex max-w-[820px] flex-col gap-4">
            <div className={ui.eyebrow}>{eyebrow}</div>
            <h1 className="m-0 whitespace-pre-line text-[36px] font-bold leading-[1.02] tracking-[-0.028em] text-sc-ink-900 sm:text-[44px] lg:text-[60px]">{pageTitle}</h1>
          </div>
        </div>
      </section>

      {/* Featured article */}
      <article className="border-b border-sc-ink-100 bg-white">
        <div className={`${ui.container} grid grid-cols-1 items-start gap-10 py-16 md:grid-cols-12 md:gap-12 lg:py-20`}>
          <div className="order-2 flex flex-col gap-6 md:order-1 md:col-span-7">
            <div className={`${ui.eyebrow} inline-flex items-center gap-2`}>
              <span aria-hidden="true" className="inline-block h-px w-6 bg-sc-cyan-500" />
              {featuredLabel}
              {primaryTag?.label ? ` · ${primaryTag.label}` : ''}
            </div>
            <h2 className="m-0 text-[30px] font-bold leading-[1.08] tracking-[-0.02em] text-sc-ink-900 md:text-[40px] lg:text-[48px]">
              <Link href={link} className="no-underline transition-colors hover:text-sc-cyan-600">
                {title}
              </Link>
            </h2>
            {description && <p className="m-0 max-w-[560px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{description}</p>}

            {(author?.name || meta) && (
              <div className="flex items-center gap-3">
                {author?.imageUrl ? (
                  <Image src={author.imageUrl} alt={author.name || ''} width={40} height={40} className="h-10 w-10 flex-shrink-0 rounded-full border border-sc-ink-100 object-cover" />
                ) : (
                  <span aria-hidden="true" className="h-10 w-10 flex-shrink-0 rounded-full border border-sc-ink-100 bg-sc-ink-50" />
                )}
                <div className="flex flex-col gap-0.5">
                  {author?.name && <div className="text-sm font-semibold text-sc-ink-900">{author.name}</div>}
                  {meta && <div className={ui.mono}>{meta}</div>}
                </div>
              </div>
            )}

            {tags.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t, i) => (
                  <span key={`${t.label}-${i}`} className={t.isPrimary ? ui.tag : ui.tagOutline}>
                    {t.label}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Link href={link} className={`${ui.btnPrimary} w-full no-underline sm:w-auto`}>
                {buttonText}
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 md:col-span-5">
            <Link href={link} className="group relative block aspect-[4/3] overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50 md:aspect-[4/5]" aria-label={title}>
              <Image
                src={imageUrl}
                alt={title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
              <span aria-hidden="true" className="absolute left-4 top-4 select-none font-mono text-[11px] uppercase tracking-widest text-white/80">
                01
              </span>
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
