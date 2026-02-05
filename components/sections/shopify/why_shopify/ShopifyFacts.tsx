'use client'

interface FactCard {
  statistic?: string
  description?: string
  source?: string
}

interface ShopifyFactsData {
  title?: string
  facts?: FactCard[]
}

interface ShopifyFactsProps {
  shopifyFacts?: ShopifyFactsData
}

export default function ShopifyFacts({ shopifyFacts }: ShopifyFactsProps) {
  const title = shopifyFacts?.title
  const facts = shopifyFacts?.facts || []

  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {title && (
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] text-center mb-12 lg:mb-16">
            {title}
          </h2>
        )}

        {facts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {facts.map((fact, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 lg:p-8 shadow-sm"
              >
                {fact.statistic && (
                  <div className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#03C1CA] mb-3 font-mono tracking-tight">
                    {fact.statistic}
                  </div>
                )}
                {fact.description && (
                  <p className="text-sm lg:text-base text-[#565454] mb-4 leading-relaxed">
                    {fact.description}
                  </p>
                )}
                {fact.source && (
                  <p className="text-xs lg:text-sm text-[#888888]">
                    {fact.source}
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
