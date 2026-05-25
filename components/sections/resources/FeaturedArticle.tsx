'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
}

interface FeaturedArticleProps {
  featuredArticle?: FeaturedArticleData
  lang?: string
}

function formatCoverDate(d: string | undefined): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

export default function FeaturedArticle({ featuredArticle, lang }: FeaturedArticleProps) {
  const imageUrl = featuredArticle?.imageUrl || '/images/resources/featured_article/banner.png'
  const title = featuredArticle?.title || ''
  const date = formatCoverDate(featuredArticle?.date)
  const readTime = featuredArticle?.readTime || ''
  const tags = featuredArticle?.tags || []
  const primaryTag = tags.find((t) => t.isPrimary) ?? tags[0]
  const category = primaryTag?.label?.toUpperCase() || ''

  const locale = lang || 'en'
  const articleSlug = featuredArticle?.articleSlug?.trim()
  const link =
    featuredArticle?.link ||
    (articleSlug ? `/${locale}/resources/${articleSlug}` : '#')

  return (
    <div className="section_container mx-auto page-padding-x pb-16 lg:pb-20">
      <Link
        href={link}
        className="block relative overflow-hidden group"
        style={{ aspectRatio: '21 / 9' }}
      >
        {/* Image */}
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 1536px) 100vw, 1536px"
          priority
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)' }}
        />

        {/* Top-left: FEATURED · date */}
        <div className="absolute top-6 left-7 text-white/80 text-[10px] font-mono tracking-[0.18em] uppercase select-none">
          FEATURED{date ? ` · ${date}` : ''}
        </div>

        {/* Top-right: readTime · category */}
        {(readTime || category) && (
          <div className="absolute top-6 right-7 text-white/80 text-[10px] font-mono tracking-[0.18em] uppercase select-none">
            {[readTime, category].filter(Boolean).join(' · ')}
          </div>
        )}

        {/* Bottom: title + CTA */}
        <div className="absolute bottom-7 left-8 right-8 flex items-end justify-between gap-8">
          <h2
            className="text-white font-bold max-w-3xl"
            style={{ fontSize: 'clamp(24px, 3vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            {title}
          </h2>
          <span className="inline-flex items-center gap-2.5 px-5 py-3 font-bold uppercase tracking-[0.10em] text-xs text-[#1F1D1D] flex-shrink-0 bg-[#1EEFFA] shadow-button">
            READ
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </span>
        </div>
      </Link>
    </div>
  )
}
