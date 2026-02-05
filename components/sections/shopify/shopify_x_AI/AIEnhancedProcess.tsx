'use client'

interface ProcessStep {
  title?: string
  description?: string
}

interface AiEnhancedProcessData {
  title?: string
  processSteps?: ProcessStep[]
}

interface AIEnhancedProcessProps {
  aiEnhancedProcess?: AiEnhancedProcessData
}

export default function AIEnhancedProcess({ aiEnhancedProcess }: AIEnhancedProcessProps) {
  const title = aiEnhancedProcess?.title
  const processSteps = aiEnhancedProcess?.processSteps || []

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          {title && (
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] mb-4">
              {title}
            </h2>
          )}
        </div>

        {/* Process Steps */}
        {processSteps.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-8">
            {processSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-6">
                {/* Step Number */}
                <div className="flex-shrink-0 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#03C1CA] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-2">
                  {step.title && (
                    <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-semibold text-[#222222] mb-2">
                      {step.title}
                    </h3>
                  )}
                  {step.description && (
                    <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
