'use client'

import Link from 'next/link'

interface CTAData {
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  ctaButtonLink?: string
}

interface MigrationCTAProps {
  cta?: CTAData
}

export default function MigrationCTA({ cta }: MigrationCTAProps) {
  const title = cta?.ctaTitle
  const description = cta?.ctaDescription
  const buttonText = cta?.ctaButtonText
  const buttonLink = cta?.ctaButtonLink

  return (
    <section className="bg-[#03C1CA] py-16 lg:py-[170px]">
      <div className="section_container mx-auto page-padding-x">
        <div className="text-center flex flex-col items-center justify-start lg:gap-[91px] gap-16">
          {(title || description) && (
            <div className="flex flex-col items-center justify-start lg:gap-7 gap-4">
              {title && (
                <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white mb-4 lg:mb-6">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] text-base text-white">
                  {description}
                </p>
              )}
            </div>
          )}

          {buttonText && buttonLink && (
            <Link
              href={buttonLink}
              className="inline-block bg-white text-[#1F1D1D] px-[30px] sm:px-[50px] py-3 lg:px-[30px] lg:py-[18px] font-semibold md:text-base text-sm hover:bg-gray-100"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
