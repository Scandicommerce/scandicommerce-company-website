'use client'

interface AISolution {
  title?: string
  description?: string
}

interface ShopifyAiData {
  title?: string
  description?: string
  aiSolutions?: AISolution[]
}

interface ShopifyAIProps {
  shopifyAi?: ShopifyAiData
}

export default function ShopifyAI({ shopifyAi }: ShopifyAIProps) {
  const title = shopifyAi?.title
  const description = shopifyAi?.description
  const aiSolutions = shopifyAi?.aiSolutions || []

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="max-w-5xl mx-auto">
          {title && (
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] text-center mb-4 lg:mb-6">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] text-center mb-12 lg:mb-16 max-w-3xl mx-auto">
              {description}
            </p>
          )}

          {aiSolutions.length > 0 && (
            <div className="space-y-6 lg:space-y-8">
              {aiSolutions.map((solution, index) => (
                <div
                  key={index}
                  className="bg-[#F8F8F8] rounded-lg p-6 lg:p-8 flex items-start gap-6"
                >
                  <div className="flex-shrink-0 w-9 h-9 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-[#03C1CA] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg xs:text-xl sm:text-2xl lg:text-3xl">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    {solution.title && (
                      <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-[#222222] mb-3">
                        {solution.title}
                      </h3>
                    )}
                    {solution.description && (
                      <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] leading-relaxed">
                        {solution.description}
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
