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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {title && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] mb-6">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-base lg:text-lg text-[#565454] mb-8">
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
