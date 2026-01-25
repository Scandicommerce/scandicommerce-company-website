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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {title && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] text-center mb-4 lg:mb-6">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-base lg:text-lg text-[#565454] text-center mb-12 lg:mb-16 max-w-3xl mx-auto">
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
                  <div className="flex-shrink-0 w-16 h-16 bg-[#03C1CA] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl lg:text-3xl">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    {solution.title && (
                      <h3 className="text-xl lg:text-2xl font-bold text-[#222222] mb-3">
                        {solution.title}
                      </h3>
                    )}
                    {solution.description && (
                      <p className="text-base lg:text-lg text-[#565454] leading-relaxed">
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
