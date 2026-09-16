'use client'

import React from 'react'
import Link from 'next/link'
import { packagesHref } from '@/lib/routes'

interface ServicesShowcaseData {
  title?: {
    text?: string
    highlight?: string
  }
  subtitle?: string
  viewAllText?: string
  viewAllLink?: string
  categories?: Array<{
    title: string
    icon?: string
    description?: string
    price?: string
    link?: string
    linkText?: string
  }>
}

interface Package {
  title: string
  subtitle: string
  price: string
  priceType: string
  timeline: string
  rating: number
  ratingValue: string
  bestFor: string[]
  included: string[]
  description: string
  href: string
  buttonText?: string
}

interface PackagesData {
  packagesItems?: Package[]
}

interface ServicesPackagedProps {
  lang?: string
  data?: ServicesShowcaseData
  packages?: PackagesData
}

interface ServiceRow {
  name: string
  description?: string
  href?: string
}

/** CMS-entered internal paths must be root-relative, or they resolve against the current URL and 404. */
function normalizeHref(href: string): string {
  if (!href || /^(https?:|mailto:|tel:|#|\/)/.test(href)) return href
  return `/${href}`
}

export default function ServicesPackaged({ data, packages: packagesData, lang = 'no' }: ServicesPackagedProps) {
  // Content variables from Sanity (section title/subtitle from Homepage)
  const titleText = data?.title?.text || 'Fast pris. Ingen pingpong.'
  const titleHighlight = data?.title?.highlight
  const subtitle = data?.subtitle || 'Alle pakker har offentlig pris. Velg, bestill, kom i gang.'
  const viewAllText = data?.viewAllText || 'Se alle tjenester'
  const viewAllLink = normalizeHref(data?.viewAllLink || packagesHref(lang))
  const categories = data?.categories

  // Use packages from All Packages page
  const displayPackages = packagesData?.packagesItems

  // Rows for the service list: prefer packages (tier list), fall back to categories
  const rows: ServiceRow[] =
    displayPackages && displayPackages.length > 0
      ? displayPackages.map((pkg) => ({
          name: pkg.title,
          description: pkg.subtitle,
          href: pkg.href ? normalizeHref(pkg.href) : pkg.href,
        }))
      : (categories || []).map((category) => ({
          name: category.title,
          description: category.description,
          href: category.link ? normalizeHref(category.link) : category.link,
        }))

  // Helper to render title with highlight
  const renderTitle = () => {
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
    <section id="packages" className="relative bg-sc-ink-50 overflow-hidden">
      <div className="section_container max-w-[1320px] mx-auto page-padding-x py-10 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-16 items-start">
          <div>
            <div className="text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500 mb-2.5">
              Tjenester
            </div>
            <h2 className="text-[26px] lg:text-[40px] font-bold text-sc-ink-900 tracking-[-0.02em] leading-snug mb-2 lg:mb-3.5">
              {renderTitle()}
            </h2>
            <p className="text-sm lg:text-[15px] leading-relaxed text-sc-ink-600 mb-4 lg:mb-[22px] m-0">
              {subtitle}
            </p>
            <Link
              href={viewAllLink}
              className="inline-flex items-center justify-center rounded-lg bg-sc-cyan-500 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white shadow-[0_10px_30px_rgba(22,167,179,0.25)] transition-colors hover:bg-sc-cyan-600"
            >
              {viewAllText}
            </Link>
          </div>

          {rows.length > 0 && (
            <div className="flex flex-col">
              {rows.map((row, index) => {
                const rowInner = (
                  <>
                    <span className="font-bold text-[19px] lg:text-[26px] text-sc-ink-900 flex-none lg:w-[240px]">
                      {row.name}
                    </span>
                    {row.description && (
                      <span className="hidden sm:block flex-1 text-sm text-sc-ink-600">
                        {row.description}
                      </span>
                    )}
                    <span className="ml-auto sm:ml-0 text-base lg:text-lg text-sc-ink-900">→</span>
                  </>
                )
                const rowClass = `flex items-center gap-4 lg:gap-6 px-1 lg:px-3 py-[18px] lg:py-7 border-t border-sc-ink-200 ${
                  index === rows.length - 1 ? 'border-b' : ''
                } transition-colors duration-200 hover:bg-white/70`

                return row.href ? (
                  <Link key={index} href={row.href} className={rowClass}>
                    {rowInner}
                  </Link>
                ) : (
                  <div key={index} className={rowClass}>
                    {rowInner}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
