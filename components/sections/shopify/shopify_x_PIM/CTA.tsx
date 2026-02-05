'use client'

import Link from 'next/link'

interface CTAData {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

interface CTAProps {
  cta?: CTAData
}

export default function CTA({ cta }: CTAProps) {
  const title = cta?.title
  const description = cta?.description
  const buttonText = cta?.buttonText
  const buttonLink = cta?.buttonLink || '/contact'

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="text-center max-w-5xl mx-auto">
          {title && (
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] mb-6">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] mb-8">
              {description}
            </p>
          )}
          {buttonText && (
            <Link
              href={buttonLink}
              className="inline-block bg-[#03C1CA] text-white px-8 py-4 font-medium hover:bg-[#03C1CA]/90 transition-colors"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
