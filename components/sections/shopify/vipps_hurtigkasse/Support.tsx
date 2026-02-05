'use client'

import Link from 'next/link'

interface SupportData {
  title?: string
  buttonText?: string
  buttonLink?: string
}

interface SupportProps {
  support?: SupportData
}

export default function Support({ support }: SupportProps) {
  const title = support?.title || 'Do you have a problem with your Quick Checkout for Shopify?'
  const buttonText = support?.buttonText || 'Contact us here'
  const buttonLink = support?.buttonLink || '/contact'

  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] mb-8">
            {title}
          </h2>
          <Link
            href={buttonLink}
            className="inline-block bg-[#03C1CA] text-white px-8 py-4 font-medium hover:bg-[#02a8b0] transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  )
}
