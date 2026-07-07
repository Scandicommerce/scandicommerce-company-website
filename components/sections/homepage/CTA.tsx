'use client'

import React from 'react'
import Link from 'next/link'

interface CTAData {
  title?: string
  subtitle?: string
  buttons?: Array<{
    text: string
    link: string
    variant?: 'primary' | 'secondary'
  }>
}

interface CTAProps {
  data?: CTAData
}

export default function CTA({ data }: CTAProps) {
  // Content variables from Sanity
  const title = data?.title
  const subtitle = data?.subtitle
  const buttons = data?.buttons

  return (
    <section className="relative bg-sc-ink-900 overflow-hidden">
      {/* Decorative logo mark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/logo-mark.png"
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute -right-20 -top-20 h-[420px] w-auto opacity-[0.08] pointer-events-none select-none"
      />

      <div className="section_container max-w-[1320px] mx-auto page-padding-x py-11 lg:py-[88px] relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
        <div>
          {title && (
            <h2 className="text-[26px] lg:text-[44px] font-bold text-white tracking-[-0.02em] leading-tight mb-2 lg:mb-2.5">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm lg:text-base text-sc-ink-300 m-0">
              {subtitle}
            </p>
          )}
        </div>

        {buttons && buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2.5 lg:gap-3 flex-none">
            {buttons.map((button, index) => (
              <Link
                key={index}
                href={button.link || '#'}
                className={`inline-flex items-center justify-center rounded-lg px-[22px] py-3.5 lg:py-3 text-sm font-semibold tracking-[0.02em] text-center transition-colors ${
                  button.variant === 'primary' || index === 0
                    ? 'bg-sc-cyan-500 text-white hover:bg-sc-cyan-600 shadow-[0_10px_30px_rgba(22,167,179,0.25)]'
                    : 'bg-white text-sc-ink-900 hover:bg-sc-ink-100'
                }`}
              >
                {button.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
