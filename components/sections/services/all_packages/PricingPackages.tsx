'use client'

import Link from 'next/link'
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
  href: string
  shopifyVariantId?: string
  shopifyProductTitle?: string
}

interface PackagesData {
  packagesItems?: Package[]
}

interface PricingPackagesProps {
  packages?: PackagesData
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function PackageCard({ pkg }: { pkg: Package }) {
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
              Timeline: {pkg.timeline}
            </p>
          )}
        </div>

        {/* Rating Box */}
        <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 flex items-center justify-center gap-2 sm:gap-3">
          <StarRating rating={pkg.rating || 5} />
          {pkg.ratingValue && (
            <span className="text-base sm:text-lg font-medium text-gray-700">
              {pkg.ratingValue}
            </span>
          )}
        </div>
      </div>

      {/* Row 2: Best For Box + What's Included Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6 flex-grow">
        {/* Best For Box */}
        {pkg.bestFor && pkg.bestFor.length > 0 && (
          <div className="bg-gray-50 p-3 sm:p-4 lg:p-5">
            <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
              Best for:
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
              What&apos;s included:
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
        {pkg.href && (
          <Link
            href={pkg.href}
            className="bg-[#03C1CA] hover:bg-[#02a9b1] text-white text-sm lg:text-base font-semibold py-3 sm:py-3.5 px-4 text-center transition-colors duration-200"
          >
            View Details
          </Link>
        )}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="/contact"
            className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 text-sm lg:text-base font-semibold py-3 sm:py-3.5 px-4 text-center transition-colors duration-200 bg-white flex-1"
          >
            Book Call
          </Link>
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

export default function PricingPackages({ packages }: PricingPackagesProps) {
  const items = packages?.packagesItems

  return (
    <section className="bg-[#F8F8F8] pb-8 xs:pb-12 sm:pb-16 lg:pt-24 lg:pb-24">
      <div className="section_container mx-auto page-padding-x">
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {items.map((pkg, index) => (
              <PackageCard key={index} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
