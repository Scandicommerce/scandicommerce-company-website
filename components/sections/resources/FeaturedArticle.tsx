'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
  imageUrl?: string
  tags?: TagData[]
  title?: string
  description?: string
  date?: string
  readTime?: string
  link?: string
  buttonText?: string
  author?: AuthorData
}

interface FeaturedArticleProps {
  featuredArticle?: FeaturedArticleData
  lang?: string
}

function formatDate(d: string | undefined): string {
  if (!d) return ''
  try {
    const parsed = new Date(d)
    if (isNaN(parsed.getTime())) return d
    return parsed.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

export default function FeaturedArticle({ featuredArticle, lang }: FeaturedArticleProps) {
  const imageUrl = featuredArticle?.imageUrl || '/images/resources/featured_article/banner.png'
  const title = featuredArticle?.title || ''
  const date = formatDate(featuredArticle?.date)
  const readTime = featuredArticle?.readTime || ''
  const tags = featuredArticle?.tags || []
  const primaryTag = tags.find((t) => t.isPrimary) ?? tags[0]
  const category = primaryTag?.label?.toUpperCase() || ''
  const description = featuredArticle?.description || ''
  const author = featuredArticle?.author
  const buttonText = featuredArticle?.buttonText || 'READ THE POST'

  const locale = lang || 'en'
  const articleSlug = featuredArticle?.articleSlug?.trim()
  const link = featuredArticle?.link || (articleSlug ? `/${locale}/resources/${articleSlug}` : '#')

  return (
    <>
    {/* Page header — Variant A */}
    <section className="border-b border-neutral-200">
      <div className="section_container mx-auto page-padding-x pt-20 pb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#11848C] mb-5">
            Notes from the studio
          </div>
          <h1
            className="font-bold text-[#1F1D1D]"
            style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.025em' }}
          >
            What we<br />shipped &amp; learned.
          </h1>
        </div>
        <div className="flex items-center gap-5 text-sm text-neutral-500 font-mono pb-1 flex-shrink-0">
          <span>updated weekly</span>
          <span className="w-px h-4 bg-neutral-300" />
          <a href="#" className="text-teal font-semibold inline-flex items-center gap-1.5 font-sans text-sm">
            RSS
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" />
            </svg>
          </a>
        </div>
      </div>
    </section>

    <section className="border-b border-neutral-200">
      <div className="section_container mx-auto page-padding-x py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-12 items-start">

          {/* Left: text content */}
          <div className="md:col-span-7 pt-2 order-2 md:order-1 mt-8 md:mt-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal mb-6">
              <span className="inline-flex items-center gap-2">
                <span className="w-6 h-px bg-teal inline-block" />
                FEATURED{category ? ` · ${category}` : ''}
              </span>
            </div>
            <h2
              className="font-bold tracking-tight mb-7 text-[#1F1D1D]"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
            >
              {title}
            </h2>
            {description && (
              <p className="text-neutral-600 leading-relaxed max-w-xl mb-10" style={{ fontSize: 18, lineHeight: 1.6 }}>
                {description}
              </p>
            )}
            <div className="flex items-center gap-4 mb-9">
              {author?.imageUrl ? (
                <Image
                  src={author.imageUrl}
                  alt={author.name || ''}
                  width={36}
                  height={36}
                  className="rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #03C1CA, #11848C)' }}
                />
              )}
              <div>
                {author?.name && (
                  <div className="text-sm font-semibold text-[#1F1D1D]">{author.name}</div>
                )}
                <div className="text-xs text-neutral-500 font-mono">
                  {[date, readTime ? `${readTime} read` : ''].filter(Boolean).join(' · ')}
                </div>
              </div>
            </div>
            <Link
              href={link}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 font-bold uppercase tracking-[0.10em] text-[13px] text-[#1F1D1D] bg-[#1EEFFA] shadow-button hover:bg-teal transition-colors duration-200"
            >
              {buttonText}
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>

          {/* Right: image */}
          <div className="md:col-span-5 order-1 md:order-2">
            <Link href={link} className="block relative overflow-hidden group" style={{ aspectRatio: '4 / 5' }}>
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 42vw"
                priority
              />
              <div className="absolute top-5 left-5 text-white/70 text-[11px] font-mono tracking-widest uppercase select-none">
                01
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
    </>
  )
}
