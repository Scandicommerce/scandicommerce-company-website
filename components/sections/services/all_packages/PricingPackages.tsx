'use client'

import LocalizedLink from '@/components/ui/LocalizedLink'
import PackageAddToCart from './PackageAddToCart'

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
  /** Resolved from page->slug.current (preferred) */
  slug?: string | null
  /** Fallback custom link set in Sanity */
  href?: string | null
  /** Resolved slug from bookCallPage reference (preferred). */
  bookCallSlug?: string | null
  /** Custom link for Book Call when no page is selected (path or URL). */
  bookCallHref?: string | null
  shopifyVariantId?: string
  shopifyProductTitle?: string
}

interface PackagesData {
  packagesItems?: Package[]
}

interface PricingPackagesProps {
  packages?: PackagesData
  lang?: string
}

/** Resolves Book Call URL: page slug (preferred), then custom href, then /contact. */
function resolveBookCallHref(pkg: Package): string {
  if (pkg.bookCallSlug) return `/${pkg.bookCallSlug}`
  if (pkg.bookCallHref) return pkg.bookCallHref
  return '/contact'
}

interface Labels {
  viewDetails: string
  bookCall: string
  bestFor: string
  whatsIncluded: string
  timeline: string
}

function PackageCard({ pkg, labels }: { pkg: Package; labels: Labels }) {
  return (
    <div className="flex flex-col rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-8">
      {/* Header - Title & Subtitle */}
      <div className="mb-5 sm:mb-6">
        {pkg.title && (
          <h3 className="text-[28px] lg:text-[32px] leading-[1.15] font-bold tracking-[-0.02em] text-sc-ink-900 mb-1.5 sm:mb-2">
            {pkg.title}
          </h3>
        )}
        {pkg.subtitle && (
          <p className="text-xs sm:text-sm lg:text-base text-sc-ink-500">
            {pkg.subtitle}
          </p>
        )}
      </div>

      {/* Description */}
      {pkg.description && (
        <div className="mb-4 sm:mb-5">
          <p className="text-xs sm:text-sm text-sc-ink-600 leading-relaxed">
            {pkg.description}
          </p>
        </div>
      )}

      {/* Row 1: Price/Timeline Box + Rating Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        {/* Price & Timeline Box */}
        <div className="rounded-lg bg-sc-ink-50 p-4 lg:p-5">
          <div className="flex items-baseline gap-1 mb-1 flex-wrap">
            {pkg.price && (
              <span className="font-mono text-[26px] lg:text-[30px] font-medium tracking-tight text-sc-ink-900">
                {pkg.price}
              </span>
            )}
            {pkg.priceType && (
              <span className="text-xs text-sc-ink-500 font-sans">{pkg.priceType}</span>
            )}
          </div>
          {pkg.timeline && (
            <p className="text-xs sm:text-sm text-sc-ink-600">
              {labels.timeline}: {pkg.timeline}
            </p>
          )}
        </div>

      </div>

      {/* Row 2: Best For Box + What's Included Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6 flex-grow">
        {/* Best For Box */}
        {pkg.bestFor && pkg.bestFor.length > 0 && (
          <div className="rounded-lg bg-sc-ink-50 p-4 lg:p-5">
            <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-sc-ink-900 mb-2 sm:mb-3">
              {labels.bestFor}
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {pkg.bestFor.map((item, index) => (
                <li key={index} className="text-xs lg:text-sm text-sc-ink-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What's Included Box */}
        {pkg.included && pkg.included.length > 0 && (
          <div className="rounded-lg bg-sc-ink-50 p-4 lg:p-5">
            <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-sc-ink-900 mb-2 sm:mb-3">
              {labels.whatsIncluded}
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {pkg.included.map((item, index) => (
                <li key={index} className="text-xs lg:text-sm text-sc-ink-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-auto">
        {(pkg.slug || pkg.href) && (
          <LocalizedLink
            href={pkg.slug ? `/${pkg.slug}` : pkg.href!}
            className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-sc-ink-900 px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-white transition-colors hover:bg-sc-ink-700"
          >
            {labels.viewDetails}
          </LocalizedLink>
        )}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {resolveBookCallHref(pkg)?.startsWith('http') ? (
            <a
              href={resolveBookCallHref(pkg)!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[46px] flex-1 items-center justify-center rounded-lg border border-sc-ink-200 bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-sc-ink-50"
            >
              {labels.bookCall}
            </a>
          ) : (
            <LocalizedLink
              href={resolveBookCallHref(pkg) || '/contact'}
              className="inline-flex min-h-[46px] flex-1 items-center justify-center rounded-lg border border-sc-ink-200 bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-sc-ink-50"
            >
              {labels.bookCall}
            </LocalizedLink>
          )}
          {pkg.shopifyVariantId && pkg.shopifyProductTitle && (
            <PackageAddToCart
              variantId={pkg.shopifyVariantId}
              productTitle={pkg.shopifyProductTitle}
              className="flex-1 min-w-0"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default function PricingPackages({ packages, lang }: PricingPackagesProps) {
  const items = packages?.packagesItems
  const isNo = lang === 'no' || lang === 'nb-NO' || (lang ?? '').startsWith('nb')

  const labels: Labels = {
    viewDetails: isNo ? 'Se detaljer' : 'View Details',
    bookCall: isNo ? 'Book et møte' : 'Book Call',
    bestFor: isNo ? 'Passer for:' : 'Best for:',
    whatsIncluded: isNo ? 'Hva som er inkludert:' : "What's included:",
    timeline: isNo ? 'Tidsramme' : 'Timeline',
  }

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="section_container mx-auto page-padding-x">
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {items.map((pkg, index) => (
              <PackageCard key={index} pkg={pkg} labels={labels} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
