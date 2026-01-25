'use client'

interface ApplicationArea {
  title?: string
  description?: string
  features?: string[]
  benefit?: string
}

interface HowWeApplyAiData {
  title?: string
  applicationAreas?: ApplicationArea[]
}

interface HowWeApplyAIProps {
  howWeApplyAi?: HowWeApplyAiData
}

export default function HowWeApplyAI({ howWeApplyAi }: HowWeApplyAIProps) {
  const title = howWeApplyAi?.title
  const applicationAreas = howWeApplyAi?.applicationAreas || []

  return (
    <section className="bg-[#1F1D1D] py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          {title && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              {title}
            </h2>
          )}
        </div>

        {/* Cards Grid */}
        {applicationAreas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {applicationAreas.map((area, index) => (
              <div
                key={index}
                className="bg-[#2A2828] p-6 lg:p-8"
              >
                {area.title && (
                  <h3 className="text-lg lg:text-xl font-bold text-white mb-3">
                    {area.title}
                  </h3>
                )}
                {area.description && (
                  <p className="text-sm lg:text-base text-white/80 mb-6">
                    {area.description}
                  </p>
                )}
                {area.features && area.features.length > 0 && (
                  <ul className="space-y-4 mb-6">
                    {area.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-white">
                        <span className="mr-3 text-white">•</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {area.benefit && (
                  <p className="text-[#1DEFFA] text-sm font-medium mt-auto">
                    {area.benefit}
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
