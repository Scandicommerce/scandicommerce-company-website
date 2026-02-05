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
      <div className="section_container mx-auto page-padding-x">
        <div className="text-center flex flex-col items-center justify-start lg:gap-[91px] gap-16">
          <div className="flex flex-col items-center justify-start lg:gap-7 gap-4">
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white mb-4 lg:mb-6">
              {title}
            </h2>

            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white">
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
