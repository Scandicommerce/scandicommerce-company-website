'use client'

import React from 'react'
import { sanityImg } from '@/lib/sanityImage'
import Link from 'next/link'

interface HeroData {
  heroBadge?: string
  heroTitle?: {
    text?: string
    highlight?: string
  }
  heroDescription?: string
  heroButtons?: Array<{
    text: string
    link: string
    variant?: 'primary' | 'secondary'
  }>
  heroTagline?: string
  heroImageUrl?: string
  heroVideo?: string
  heroVideoFileUrl?: string
  heroPackages?: Array<{
    title: string
    price?: string
  }>
}

/** Turn a YouTube/Vimeo page URL into an embeddable, autoplaying, muted URL.
 * Returns null for direct video files (rendered with <video> instead). */
function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&rel=0&playsinline=1`
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&loop=1&background=1`
  return null
}

interface HeroProps {
  hero?: HeroData
}

export default function Hero({ hero }: HeroProps) {
  // Content variables from Sanity
  const badge = hero?.heroBadge
  const titleText = hero?.heroTitle?.text
  const titleHighlight = hero?.heroTitle?.highlight
  const description = hero?.heroDescription
  const buttons = hero?.heroButtons
  const tagline = hero?.heroTagline
  const imageUrl = hero?.heroImageUrl
  // Uploaded file wins over the URL field; both fall back to the hero image.
  const videoUrl = hero?.heroVideoFileUrl || hero?.heroVideo
  const packages = hero?.heroPackages

  // Helper to render title with highlight
  const renderTitle = () => {
    if (!titleText) return null
    if (!titleHighlight || !titleText.includes(titleHighlight)) {
      return titleText
    }
    const parts = titleText.split(titleHighlight)
    return (
      <>
        {parts[0]}
        <span className="text-sc-cyan-500">{titleHighlight}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <section className="relative bg-white pt-8 lg:pt-[72px] overflow-hidden">
      <div className="section_container max-w-[1320px] mx-auto page-padding-x">
        {badge && (
          <div className="text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500 mb-3.5 lg:mb-[18px]">
            {badge}
          </div>
        )}

        {titleText && (
          <h1 className="text-[40px] lg:text-[76px] font-bold text-sc-ink-900 leading-[1.04] lg:leading-[1.02] tracking-[-0.025em] lg:tracking-[-0.028em] max-w-[1080px] mb-4 lg:mb-7 text-balance">
            {renderTitle()}
          </h1>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 lg:gap-12 mb-6 lg:mb-11">
          {description && (
            <p className="text-base lg:text-lg leading-[1.65] text-sc-ink-600 max-w-[520px] m-0">
              {description}
            </p>
          )}

          {buttons && buttons.length > 0 && (
            <div className="flex gap-2.5 lg:gap-3 flex-none">
              {buttons.map((button, index) => (
                <Link
                  key={index}
                  href={button.link || '#'}
                  className={`inline-flex flex-1 lg:flex-initial items-center justify-center rounded-lg px-[22px] py-3 text-sm font-semibold tracking-[0.02em] transition-colors ${
                    button.variant === 'primary' || index === 0
                      ? 'bg-sc-ink-900 text-white hover:bg-sc-ink-700'
                      : 'bg-transparent text-sc-ink-900 border border-sc-ink-200 hover:bg-sc-ink-50'
                  }`}
                >
                  {button.text}
                </Link>
              ))}
            </div>
          )}
        </div>

        {(videoUrl || imageUrl) && (
          <div className="h-[280px] lg:h-[560px] rounded-[10px] overflow-hidden bg-sc-ink-100">
            {videoUrl ? (
              getEmbedUrl(videoUrl) ? (
                <iframe
                  src={getEmbedUrl(videoUrl) as string}
                  title={titleText || 'Scandicommerce'}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl}
                  poster={imageUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={sanityImg(imageUrl, 2000)}
                alt={titleText || 'Scandicommerce'}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {tagline && (
          <p className="text-xs lg:text-[13px] text-sc-ink-400 text-center lg:text-left pt-4 lg:pt-6 m-0">
            {tagline}
          </p>
        )}

        {packages && packages.length > 0 && (
          <div className="mt-12 lg:mt-[72px] grid grid-cols-2 lg:grid-cols-4 gap-y-8 border-t border-sc-ink-100 pt-7">
            {packages.map((pkg, index) => (
              <div key={index} className="pr-6">
                <div className="font-bold text-lg lg:text-xl text-sc-ink-900 mb-1">
                  {pkg.title}
                </div>
                {pkg.price && (
                  <div className="text-[13px] text-sc-ink-600">{pkg.price}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
