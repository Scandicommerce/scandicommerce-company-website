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
  const title = cta?.title || 'Ready for results like these?'
  const description = cta?.description || "Let's discuss your project and how we can help you grow"
  const buttonText = cta?.buttonText || 'Book Discovery Call'
  const buttonLink = cta?.buttonLink || '/book-call'

  return (
    <section className="bg-[#03C1CA] py-16 lg:py-[170px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col items-center justify-start lg:gap-[91px] gap-16">
          <div className="flex flex-col items-center justify-start lg:gap-7 gap-4">
            <h2 className="lg:text-[48px] sm:text-4xl text-3xl font-bold text-white mb-4 lg:mb-6">
              {title}
            </h2>

            <p className="lg:text-[24px] sm:text-lg text-base text-white">
              {description}
            </p>
          </div>

          <Link
            href={buttonLink}
            className="inline-block bg-white text-gray-900 px-[50px] py-3 lg:px-[30px] lg:py-[18px] font-semibold md:text-base text-sm hover:bg-gray-100 transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  )
}
