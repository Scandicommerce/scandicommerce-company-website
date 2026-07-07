'use client'

/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import Marquee from 'react-fast-marquee'

interface Brand {
  name: string
  logo?: {
    asset?: {
      url?: string
    }
    alt?: string
  }
  alt?: string
  link?: string
}

interface TrustedByData {
  title?: string
  brands?: Brand[]
}

interface TrustedByProps {
  trustedBy?: TrustedByData
}

// Default brands fallback
const defaultBrands: Brand[] = [
  { name: 'Shopify Plus' },
  { name: 'Klaviyo' },
  { name: 'Vipps' },
  { name: 'Visma' },
  { name: 'Judge.me' },
  { name: 'Make.com' },
]

export default function TrustedBy({ trustedBy }: TrustedByProps) {
  const title = trustedBy?.title || 'Offisiell Shopify-partner siden 2024'
  const brands = trustedBy?.brands && trustedBy.brands.length > 0
    ? trustedBy.brands
    : defaultBrands

  const renderBrand = (brand: Brand, index: number) => {
    const logoUrl = brand.logo?.asset?.url
    const altText = brand.alt || brand.logo?.alt || brand.name || 'Brand logo'

    const content = logoUrl ? (
      <img
        src={logoUrl}
        alt={altText}
        className="h-7 lg:h-8 w-auto object-contain grayscale opacity-60 transition-opacity hover:opacity-100 hover:grayscale-0"
      />
    ) : (
      <span className="whitespace-nowrap text-sm font-semibold text-sc-ink-400">
        {brand.name}
      </span>
    )

    if (brand.link) {
      return (
        <Link
          key={`brand-${index}`}
          href={brand.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center mx-6 lg:mx-8"
        >
          {content}
        </Link>
      )
    }

    return (
      <div key={`brand-${index}`} className="flex items-center mx-6 lg:mx-8">
        {content}
      </div>
    )
  }

  return (
    // Partner strip (2026 design, upgraded to the scrolling logo list):
    // clear air above (separates it from the hero/tier strip) and a large gap
    // (112px desktop / 44px mobile) before the next section.
    <section className="bg-white mt-10 lg:mt-16 mb-11 lg:mb-[112px]">
      <p className="text-xs lg:text-[13px] text-sc-ink-400 text-center mb-5 lg:mb-7 page-padding-x">
        {title}
      </p>
      <div className="relative">
        {/* Edge fades so logos glide in/out instead of clipping */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 lg:w-32 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 lg:w-32 z-10 bg-gradient-to-l from-white to-transparent" />
        <Marquee speed={40} gradient={false} pauseOnHover autoFill>
          {brands.map((brand, index) => renderBrand(brand, index))}
        </Marquee>
      </div>
    </section>
  )
}
