'use client'

import Link from 'next/link'

interface CTAData {
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  ctaButtonLink?: string
}

interface ReadyToBuildProps {
  cta?: CTAData
}

export default function ReadyToBuild({ cta }: ReadyToBuildProps) {
  // Content variables from Sanity
  const title = cta?.ctaTitle
  const description = cta?.ctaDescription
  const buttonText = cta?.ctaButtonText
  const buttonLink = cta?.ctaButtonLink

  return (
    <section className="bg-sc-cyan-500 py-12 sm:py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="rounded-lg py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto">
            {/* Title */}
            {title && (
              <h2 className="text-[28px] lg:text-[36px] leading-[1.15] font-bold tracking-[-0.02em] text-white mb-4 sm:mb-5">
                {title}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p className="text-white/90 mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-lg lg:text-xl leading-relaxed">
                {description}
              </p>
            )}

            {/* Button */}
            {buttonText && buttonLink && (
              <Link
                href={buttonLink}
                className="inline-block w-full sm:w-auto bg-white hover:bg-sc-ink-50 text-sc-ink-900 font-semibold py-3 sm:py-4 px-8 sm:px-10 transition-colors duration-200"
              >
                {buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
