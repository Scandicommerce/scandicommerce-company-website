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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {title && (
            <h2 className="text-[5.8vw] xs:text-[4.3vw] sm:text-[4.2vw] md:text-[4vw] lg:text-4xl xl:text-[42px] font-bold text-white text-center mb-12 lg:mb-16">
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
                      <h3 className="text-xl lg:text-2xl font-bold text-[#03C1CA]">
                        {index + 1}. {reason.title}
                      </h3>
                    )}
                    {reason.description && (
                      <p className="text-base lg:text-lg text-white leading-relaxed">
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
                                className="text-base lg:text-lg text-white leading-relaxed"
                              >
                                <strong className="font-bold">{parts[0]}:</strong>
                                {parts[1]}
                              </li>
                            )
                          }
                          return (
                            <li
                              key={pointIndex}
                              className="text-base lg:text-lg text-white leading-relaxed"
                            >
                              {point}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {reason.concludingParagraph && (
                      <p className="text-base lg:text-lg text-white leading-relaxed mt-4">
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
