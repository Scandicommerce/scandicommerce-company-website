'use client'

import Link from 'next/link'

interface CaseStudiesBannerData {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

interface CaseStudiesBannerProps {
  packageName: string
  caseStudiesBanner?: CaseStudiesBannerData
}

export default function CaseStudiesBanner({ packageName, caseStudiesBanner }: CaseStudiesBannerProps) {
  const title = caseStudiesBanner?.title || 'See how others succeeded with this package'
  const description = caseStudiesBanner?.description || `Read real case studies from brands that chose the ${packageName} package`
  const buttonText = caseStudiesBanner?.buttonText || 'View Case Studies'
  const buttonLink = caseStudiesBanner?.buttonLink || '/work'

  return (
    <section className="bg-[#F8F8F8] py-12 lg:py-16">
      <div className="section_container mx-auto page-padding-x">
        <div className="max-w-5xl mx-auto">
          {/* Teal banner with rounded corners */}
          <div className="bg-[#03C1CA] rounded-lg py-16 lg:py-20 px-8 text-center">
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-base lg:text-lg text-white/90 mb-8">
              {description}
            </p>
            <Link
              href={buttonLink}
              className="inline-block bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-8 border border-gray-200 transition-colors duration-200"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
