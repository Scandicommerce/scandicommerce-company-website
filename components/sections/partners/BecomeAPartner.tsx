'use client'

import Link from 'next/link'

interface CTAData {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

interface BecomeAPartnerProps {
  cta?: CTAData
}

export default function BecomeAPartner({ cta }: BecomeAPartnerProps) {
  const title = cta?.title || "Need a tool we don't partner with?"
  const description = cta?.description || "We can integrate with any tool via API. Our partnerships just mean we know these platforms inside-out and can move faster."
  const buttonText = cta?.buttonText || 'Ask about custom integrations'
  const buttonLink = cta?.buttonLink || '/book-call'

  return (
    <section className="bg-[#03C1CA] py-16 lg:py-[170px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col items-center justify-start lg:gap-[91px] gap-16">
          <div className="flex flex-col items-center justify-start lg:gap-7 gap-4 max-w-5xl">
            <h2 className="lg:text-[48px] sm:text-4xl text-2xl font-bold text-white mb-4 lg:mb-6">
              {title}
            </h2>

            <p className="lg:text-[24px] sm:text-lg text-sm text-white">
              {description}
            </p>
          </div>

          <Link
            href={buttonLink}
            className="inline-block bg-white text-gray-900 px-5 sm:px-[50px] py-3 lg:px-[30px] lg:py-[18px] font-semibold md:text-base text-sm hover:bg-gray-100 transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  )
}
