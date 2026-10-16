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
    <div className="bg-white p-5 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Header - Title & Subtitle */}
      <div className="text-center mb-5 sm:mb-6">
        {pkg.title && (
          <h3 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-gray-900 mb-1.5 sm:mb-2">
            {pkg.title}
          </h3>
        )}
        {pkg.subtitle && (
          <p className="text-xs sm:text-sm lg:text-base text-gray-500">
            {pkg.subtitle}
          </p>
        )}
      </div>

      {/* Description */}
      {pkg.description && (
        <div className="mb-4 sm:mb-5">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {pkg.description}
          </p>
        </div>
      )}

      {/* Row 1: Price/Timeline Box + Rating Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        {/* Price & Timeline Box */}
        <div className="bg-gray-50 p-3 sm:p-4 lg:p-5">
          <div className="flex items-baseline gap-1 mb-1 flex-wrap">
            {pkg.price && (
              <span className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#03C1CA] font-mono tracking-tight">
                {pkg.price}
              </span>
            )}
            {pkg.priceType && (
              <span className="text-xs text-gray-500 font-sans">{pkg.priceType}</span>
            )}
          </div>
          {pkg.timeline && (
            <p className="text-xs sm:text-sm text-gray-600">
              {labels.timeline}: {pkg.timeline}
            </p>
          )}
        </div>

      </div>

      {/* Row 2: Best For Box + What's Included Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6 flex-grow">
        {/* Best For Box */}
        {pkg.bestFor && pkg.bestFor.length > 0 && (
          <div className="bg-gray-50 p-3 sm:p-4 lg:p-5">
            <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
              {labels.bestFor}
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {pkg.bestFor.map((item, index) => (
                <li key={index} className="text-xs lg:text-sm text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What's Included Box */}
        {pkg.included && pkg.included.length > 0 && (
          <div className="bg-gray-50 p-3 sm:p-4 lg:p-5">
            <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
              {labels.whatsIncluded}
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {pkg.included.map((item, index) => (
                <li key={index} className="text-xs lg:text-sm text-gray-600">
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
            className="bg-[#03C1CA] hover:bg-[#02a9b1] text-white text-sm lg:text-base font-semibold py-3 sm:py-3.5 px-4 text-center transition-colors duration-200"
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
              className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 text-sm lg:text-base font-semibold py-3 sm:py-3.5 px-4 text-center transition-colors duration-200 bg-white flex-1"
            >
              {labels.bookCall}
            </a>
          ) : (
            <LocalizedLink
              href={resolveBookCallHref(pkg) || '/contact'}
              className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 text-sm lg:text-base font-semibold py-3 sm:py-3.5 px-4 text-center transition-colors duration-200 bg-white flex-1"
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
    <section className="bg-[#F8F8F8] pb-8 xs:pb-12 sm:pb-16 lg:pt-24 lg:pb-24">
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
