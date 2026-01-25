'use client'

interface InvestmentBenefit {
  title?: string
  description?: string
}

interface WhyGoodInvestmentData {
  title?: string
  description?: string
  benefits?: InvestmentBenefit[]
  bottomNote?: string
}

interface WhyGoodInvestmentProps {
  whyGoodInvestment?: WhyGoodInvestmentData
}

export default function WhyGoodInvestment({ whyGoodInvestment }: WhyGoodInvestmentProps) {
  const title = whyGoodInvestment?.title
  const description = whyGoodInvestment?.description
  const benefits = whyGoodInvestment?.benefits || []
  const bottomNote = whyGoodInvestment?.bottomNote

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 max-w-xl mx-auto">
          {title && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm lg:text-base text-[#565454]">
              {description}
            </p>
          )}
        </div>

        {/* Numbered Benefits List */}
        {benefits.length > 0 && (
          <div className="max-w-xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 py-5">
                {/* Number Circle */}
                <div className="flex-shrink-0 w-10 h-10 bg-[#03C1CA] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-base">{index + 1}</span>
                </div>
                
                {/* Content */}
                <div className="pt-1">
                  {benefit.title && (
                    <h3 className="text-base lg:text-lg font-semibold text-[#222222] mb-1">
                      {benefit.title}
                    </h3>
                  )}
                  {benefit.description && (
                    <p className="text-xs lg:text-sm text-[#565454] leading-relaxed">
                      {benefit.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Note - Light cyan box */}
        {bottomNote && (
          <div className="bg-[#1DEFFA15] p-6 lg:p-8 max-w-5xl mx-auto mt-12">
            <p className="text-sm lg:text-base text-[#565454] leading-relaxed">
              {bottomNote}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
