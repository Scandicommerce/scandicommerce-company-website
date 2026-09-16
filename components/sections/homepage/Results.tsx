'use client'

/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { sanityImg } from '@/lib/sanityImage'
import Link from 'next/link'
import { workIndexHref } from '@/lib/routes'

interface ResultsItem {
  clientImage?: {
    asset?: {
      url?: string
    }
  }
  clientName: string
  category?: string
  stat: string
  metricName?: string
  description?: string
  ctaText?: string
  ctaLink?: string
}

interface ResultsData {
  title?: string
  subtitle?: string
  items?: ResultsItem[]
}

interface ResultsProps {
  lang?: string
  data?: ResultsData
}

function CaseImage({ item, className, width = 800 }: { item: ResultsItem; className: string; width?: number }) {
  const url = item.clientImage?.asset?.url
  if (!url) {
    return <div className={`${className} bg-sc-ink-50`} />
  }
  return (
    <div className={`${className} overflow-hidden`}>
      <img
        src={sanityImg(url, width)}
        alt={item.clientName}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

function CategoryChip({ category }: { category?: string }) {
  if (!category) return null
  return (
    <span className="inline-flex items-center self-start rounded-[6px] bg-sc-cyan-50 px-3 py-1.5 text-xs font-medium text-sc-cyan-700">
      {category}
    </span>
  )
}

export default function Results({ data , lang = 'no' }: ResultsProps) {
  // Content variables from Sanity
  const title = data?.title
  const subtitle = data?.subtitle
  const items = data?.items

  const featured = items?.[0]
  const rest = items && items.length > 1 ? items.slice(1) : []

  return (
    <section className="relative bg-white py-16 lg:py-28 overflow-hidden">
      <div className="section_container max-w-[1320px] mx-auto page-padding-x">
        <div className="flex items-end justify-between gap-6 mb-6 lg:mb-10">
          <div>
            <div className="text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500 mb-2.5">
              Kundecaser
            </div>
            {title && (
              <h2 className="text-[26px] lg:text-[44px] font-bold text-sc-ink-900 tracking-[-0.02em] leading-tight m-0">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm lg:text-base text-sc-ink-600 mt-2 m-0">
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href={workIndexHref(lang)}
            className="flex-none text-[13px] lg:text-sm font-semibold text-sc-ink-900 hover:text-sc-cyan-600 transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">{lang === 'no' ? 'Alle kundecaser →' : 'All case studies →'}</span>
            <span className="sm:hidden">{lang === 'no' ? 'Alle →' : 'All →'}</span>
          </Link>
        </div>

        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] border border-sc-ink-100 rounded-[10px] overflow-hidden bg-white transition-shadow duration-200 hover:shadow-md mb-3.5 lg:mb-6">
            <CaseImage item={featured} className="h-[210px] lg:h-[460px]" width={1400} />
            <div className="p-5 lg:py-11 lg:pr-11 lg:pl-6 flex flex-col justify-center">
              <CategoryChip category={featured.category} />
              <div className="text-[38px] lg:text-[64px] font-extrabold text-sc-ink-900 tracking-[-0.03em] leading-none mt-3 lg:mt-5 mb-1.5">
                {featured.stat}
              </div>
              {featured.metricName && (
                <div className="text-[13px] lg:text-sm font-semibold text-sc-ink-600 mb-2.5 lg:mb-4">
                  {featured.metricName}
                </div>
              )}
              {featured.description && (
                <p className="hidden lg:block text-[15px] leading-relaxed text-sc-ink-600 m-0 mb-[22px]">
                  {featured.description}
                </p>
              )}
              {featured.ctaLink && (
                <Link
                  href={featured.ctaLink}
                  className="text-[13px] lg:text-sm font-semibold text-sc-ink-900 hover:text-sc-cyan-600 transition-colors"
                >
                  {featured.ctaText || 'Se caset'} →
                </Link>
              )}
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 lg:gap-6">
            {rest.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[110px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)] border border-sc-ink-100 rounded-lg overflow-hidden bg-white transition-shadow duration-200 hover:shadow-md"
              >
                <CaseImage item={item} className="min-h-[110px] lg:min-h-[210px] h-full" width={600} />
                <div className="px-[18px] py-4 lg:p-[30px] flex flex-col justify-center">
                  <div className="hidden lg:block">
                    <CategoryChip category={item.category} />
                  </div>
                  <div className="text-[26px] lg:text-[38px] font-extrabold text-sc-ink-900 tracking-[-0.03em] leading-tight lg:mt-3 lg:mb-0.5">
                    {item.stat}
                  </div>
                  {item.metricName && (
                    <div className="text-xs lg:text-[13px] text-sc-ink-600 lg:mb-3">
                      {item.metricName}
                      {item.category && (
                        <span className="lg:hidden"> · {item.category}</span>
                      )}
                    </div>
                  )}
                  {item.ctaLink && (
                    <Link
                      href={item.ctaLink}
                      className="hidden lg:inline text-[13px] font-semibold text-sc-ink-900 hover:text-sc-cyan-600 transition-colors"
                    >
                      {item.ctaText || 'Se caset'} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
