'use client'

interface SavingsCard {
  title?: string
  description?: string
  hours?: string
}

interface TimeSavingsData {
  title?: string
  description?: string
  savingsCards?: SavingsCard[]
  summaryTitle?: string
  summaryDescription?: string
}

interface TimeSavingsProps {
  timeSavings?: TimeSavingsData
}

export default function TimeSavings({ timeSavings }: TimeSavingsProps) {
  const title = timeSavings?.title
  const description = timeSavings?.description
  const savingsCards = timeSavings?.savingsCards || []
  const summaryTitle = timeSavings?.summaryTitle
  const summaryDescription = timeSavings?.summaryDescription

  return (
    <section className="bg-[#1F1D1D] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          {title && (
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white/80 max-w-5xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Cards Grid */}
        {savingsCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
            {savingsCards.map((card, index) => (
              <div
                key={index}
                className="bg-[#2A2828] p-6 lg:p-8"
              >
                {card.title && (
                  <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-semibold text-white mb-3 text-center">
                    {card.title}
                  </h3>
                )}
                {card.description && (
                  <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white/70 text-center mb-4">
                    {card.description}
                  </p>
                )}
                {card.hours && (
                  <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#03C1CA] font-semibold text-center">
                    Hours saved per week: {card.hours}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Banner */}
        {(summaryTitle || summaryDescription) && (
          <div className="bg-[#2A2828] p-6 lg:p-8 max-w-5xl mx-auto text-center">
            {summaryTitle && (
              <h3 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white mb-4">
                {summaryTitle}
              </h3>
            )}
            {summaryDescription && (
              <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white/70">
                {summaryDescription}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
