'use client'

interface Reason {
  title?: string
  description?: string
  bulletPoints?: string[]
  concludingParagraph?: string
}

interface WhyBusinessesChooseData {
  title?: string
  reasons?: Reason[]
}

interface WhyBusinessesChooseShopifyProps {
  whyBusinessesChoose?: WhyBusinessesChooseData
}

export default function WhyBusinessesChooseShopify({ whyBusinessesChoose }: WhyBusinessesChooseShopifyProps) {
  const title = whyBusinessesChoose?.title
  const reasons = whyBusinessesChoose?.reasons || []

  return (
    <section className="bg-[#222222] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="max-w-5xl mx-auto">
          {title && (
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white text-center mb-12 lg:mb-16">
              {title}
            </h2>
          )}

          {reasons.length > 0 && (
            <div className="space-y-6 lg:space-y-8">
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className="bg-[#2A2A2A] rounded-lg p-6 lg:p-8"
                >
                  <div className="space-y-4">
                    {reason.title && (
                      <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-[#03C1CA]">
                        {index + 1}. {reason.title}
                      </h3>
                    )}
                    {reason.description && (
                      <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white leading-relaxed">
                        {reason.description}
                      </p>
                    )}
                    {reason.bulletPoints && reason.bulletPoints.length > 0 && (
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        {reason.bulletPoints.map((point, pointIndex) => {
                          // Check if the point has a bold category (format: "Category: description")
                          const parts = point.split(':')
                          if (parts.length === 2) {
                            return (
                              <li
                                key={pointIndex}
                                className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white leading-relaxed"
                              >
                                <strong className="font-bold">{parts[0]}:</strong>
                                {parts[1]}
                              </li>
                            )
                          }
                          return (
                            <li
                              key={pointIndex}
                              className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white leading-relaxed"
                            >
                              {point}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {reason.concludingParagraph && (
                      <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white leading-relaxed mt-4">
                        {reason.concludingParagraph}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
