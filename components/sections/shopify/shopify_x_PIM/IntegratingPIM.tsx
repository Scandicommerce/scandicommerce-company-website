'use client'

import LocalizedLink from '@/components/ui/LocalizedLink'

interface IntegratingPimData {
  title?: string
  description?: string
  leftColumnTitle?: string
  leftColumnDescription?: string
  integrationPoints?: string[]
  impactTitle?: string
  impactParagraph1?: string
  impactParagraph2?: string
  linkText?: string
}

interface IntegratingPIMProps {
  integratingPim?: IntegratingPimData
}

export default function IntegratingPIM({ integratingPim }: IntegratingPIMProps) {
  const title = integratingPim?.title
  const description = integratingPim?.description
  const leftColumnTitle = integratingPim?.leftColumnTitle
  const leftColumnDescription = integratingPim?.leftColumnDescription
  const integrationPoints = integratingPim?.integrationPoints || []
  const impactTitle = integratingPim?.impactTitle
  const impactParagraph1 = integratingPim?.impactParagraph1
  const impactParagraph2 = integratingPim?.impactParagraph2
  const linkText = integratingPim?.linkText

  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          {title && (
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] max-w-5xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Two Column Layout with white wrapper */}
        <div className="bg-white max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Cyan Background */}
            <div className="bg-[#03C1CA] p-6 lg:p-8">
              {leftColumnTitle && (
                <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-white mb-4">
                  {leftColumnTitle}
                </h3>
              )}
              {leftColumnDescription && (
                <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white/90 mb-6">
                  {leftColumnDescription}
                </p>
              )}
              {integrationPoints.length > 0 && (
                <ul className="space-y-4">
                  {integrationPoints.map((point, index) => (
                    <li key={index} className="flex items-start text-white">
                      <span className="mr-3 text-white">•</span>
                      <span className="text-sm lg:text-base">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right Column - White Background */}
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              {impactParagraph1 && (
                <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] mb-6">
                  {impactTitle && <span className="font-bold text-[#222222]">{impactTitle}</span>}{' '}
                  {impactParagraph1}
                </p>
              )}
              {impactParagraph2 && (
                <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] mb-6">
                  {impactParagraph2}
                </p>
              )}
              {linkText && (
                <LocalizedLink href="/contact" className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#03C1CA] hover:underline font-medium">
                  {linkText}
                </LocalizedLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
