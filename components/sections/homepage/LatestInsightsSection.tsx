import Image from 'next/image'
import Link from 'next/link'
import { GoCalendar } from 'react-icons/go'
import { LuClock4 } from 'react-icons/lu'
import type { LatestInsightPost } from '@/lib/homepageLatestInsights'

const CARD_IMAGE_PLACEHOLDER = '/images/resources/featured_article/banner.png'

function localizedPath(href: string, lang: string): string {
  const t = href.trim()
  if (!t) return `/${lang}`
  if (t.startsWith('http://') || t.startsWith('https://')) return t
  const path = t.startsWith('/') ? t : `/${t}`
  if (/^\/(en|no|sv|da|de)(\/|$)/.test(path)) return path
  return `/${lang}${path}`
}

function formatDate(d: string | null | undefined): string {
  if (!d) return ''
  if (d.includes('T')) {
    try {
      return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return d
    }
  }
  return d
}

export interface LatestInsightsSectionProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  posts: LatestInsightPost[]
  lang: string
}

export default function LatestInsightsSection({
  title = 'Innsikt & ekspertise',
  subtitle,
  ctaText = 'Se alle artikler',
  ctaLink = '/blogg',
  posts,
  lang,
}: LatestInsightsSectionProps) {
  const rows = posts.filter((p) => (p.slug || '').trim().length > 0)
  if (!rows.length) return null

  const locale = lang || 'en'
  const ctaHref = localizedPath(ctaLink, locale)

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1D1D] mb-3">{title}</h2>
          {subtitle ? <p className="text-sm sm:text-base text-[#565454] max-w-2xl mx-auto">{subtitle}</p> : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-0">
          {rows.map((post, index) => {
            const slug = post.slug!.trim()
            const href = `/${locale}/resources/${slug}`
            const image = post.imageUrl || CARD_IMAGE_PLACEHOLDER
            const tag = (post.tagLabel || '').trim()
            const read =
              post.readTime != null && post.readTime !== ''
                ? String(post.readTime).replace(/\s*read\s*$/i, '').trim()
                : ''
            const excerpt = (post.excerpt || '').trim()
            const dateStr = formatDate(post.publishedAt ?? undefined)
            const hasCategory = Boolean(tag)
            const hasReadTime = Boolean(read)

            return (
              <Link key={`${slug}-${index}`} href={href} className="bg-white overflow-hidden">
                <div className="relative w-full h-[350px] sm:h-[400px] lg:h-[500px] xl:h-[650px]">
                  <Image
                    src={image}
                    alt={post.title || 'Article'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6 border border-[#565454] h-[300px] flex flex-col justify-center items-start">
                  {(hasCategory || hasReadTime) && (
                    <div className="flex items-center justify-start gap-9 mb-5">
                      {hasCategory ? (
                        <span className="px-5 py-1 bg-[#1F1D1D33] text-[#565454] text-xs sm:text-sm font-medium">
                          {tag}
                        </span>
                      ) : null}
                      {hasReadTime ? (
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#565454]">
                          <LuClock4 className="w-5 h-5" />
                          <span>{read}</span>
                        </div>
                      ) : null}
                    </div>
                  )}
                  <h3 className="text-sm sm:text-lg lg:text-[15px] xl:text-xl font-bold text-[#1F1D1D] mb-5 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-[#565454] mb-3 line-clamp-2">{excerpt}</p>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-[#565454] mt-auto">
                    <GoCalendar className="w-4 h-4" />
                    <span>{dateStr}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href={ctaHref}
            className="inline-block bg-black text-base text-white px-8 py-3 lg:px-10 lg:py-4 font-semibold hover:bg-gray-800 transition-colors"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  )
}
