'use client'

interface HowWeWorkData {
  howWeWorkTitle?: string
  howWeWorkSteps?: Array<{
    number: number
    title: string
    description: string
  }>
}

interface HowWeWorkProps {
  howWeWork?: HowWeWorkData
}

export default function HowWeWork({ howWeWork }: HowWeWorkProps) {
  // Content variables from Sanity
  const title = howWeWork?.howWeWorkTitle
  const steps = howWeWork?.howWeWorkSteps

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {/* Header */}
        {title && (
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-gray-900">
              {title}
            </h2>
          </div>
        )}

        {/* Steps */}
        {steps && steps.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                {/* Number Circle */}
                <div className="w-9 h-9 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#03C1CA] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 lg:mb-6">
                  <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                {step.title && (
                  <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-gray-900 mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                )}

                {/* Description */}
                {step.description && (
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
