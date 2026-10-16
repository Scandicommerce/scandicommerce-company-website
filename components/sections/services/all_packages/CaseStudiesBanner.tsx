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
    <section className="bg-sc-ink-50 py-12 lg:py-16">
      <div className="section_container mx-auto page-padding-x">
        <div className="max-w-5xl mx-auto">
          {/* Teal banner with rounded corners */}
          <div className="bg-sc-cyan-500 rounded-lg py-16 lg:py-20 px-8 text-center">
            <h2 className="text-[28px] lg:text-[36px] leading-[1.15] font-bold tracking-[-0.02em] text-white mb-4">
              {title}
            </h2>
            <p className="text-base lg:text-lg text-white/90 mb-8">
              {description}
            </p>
            <Link
              href={buttonLink}
              className="inline-block bg-white hover:bg-sc-ink-50 text-sc-ink-600 font-medium py-3 px-8 border border-sc-ink-100 transition-colors duration-200"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
