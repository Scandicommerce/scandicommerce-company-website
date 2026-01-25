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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {title && (
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
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
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#03C1CA] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 lg:mb-6">
                  <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                {step.title && (
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
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
