'use client'

import React from 'react'
import Link from 'next/link'

interface PainPointsData {
  painPointsTitle?: {
    text?: string
    highlight?: string
  }
  painPointsItems?: Array<{
    text: string
  }>
  painPointsBottomText?: string
  painPointsCta?: {
    text?: string
    url?: string
  }
}

interface PainPointsProps {
  painPoints?: PainPointsData
}

export default function PainPoints({ painPoints }: PainPointsProps) {
  // Content variables from Sanity
  const titleText = painPoints?.painPointsTitle?.text
  const titleHighlight = painPoints?.painPointsTitle?.highlight
  const items = painPoints?.painPointsItems
  const bottomText = painPoints?.painPointsBottomText
  const ctaText = painPoints?.painPointsCta?.text
  const ctaUrl = painPoints?.painPointsCta?.url

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
        <span className="text-sc-cyan-400">{titleHighlight}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <section className="relative bg-sc-ink-900 overflow-hidden">
      <div className="section_container max-w-[1320px] mx-auto page-padding-x py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-[60px] items-center">
        <div>
          {titleText && (
            <h2 className="text-[26px] lg:text-[40px] font-bold text-white tracking-[-0.02em] leading-snug m-0">
              {renderTitle()}
            </h2>
          )}
          {bottomText && (
            <p className="text-sm lg:text-base leading-relaxed text-sc-ink-300 mt-3 lg:mt-4 m-0">
              {bottomText}
            </p>
          )}
          {ctaText && ctaUrl && (
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 mt-5 lg:mt-6 text-sm font-semibold text-sc-cyan-400 hover:text-sc-cyan-300 transition-colors"
            >
              {ctaText} →
            </Link>
          )}
        </div>

        {items && items.length > 0 && (
          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            {items.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-3.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-[18px] py-4 text-[15px] lg:text-base text-sc-ink-200"
              >
                <span className="font-bold text-[#e04a4a] leading-6" aria-hidden="true">
                  ✕
                </span>
                <span>{point.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
