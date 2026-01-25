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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          {title && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] mb-4">
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
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#03C1CA] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-2">
                  {step.title && (
                    <h3 className="text-lg lg:text-xl font-semibold text-[#222222] mb-2">
                      {step.title}
                    </h3>
                  )}
                  {step.description && (
                    <p className="text-sm lg:text-base text-[#565454] leading-relaxed">
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
