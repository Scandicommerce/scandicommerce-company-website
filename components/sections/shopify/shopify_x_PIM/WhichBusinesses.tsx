'use client'

interface BusinessCard {
  title?: string
  description?: string
}

interface WhichBusinessesData {
  title?: string
  description?: string
  businessCards?: BusinessCard[]
  bottomNote?: string
}

interface WhichBusinessesProps {
  whichBusinesses?: WhichBusinessesData
}

export default function WhichBusinesses({ whichBusinesses }: WhichBusinessesProps) {
  const title = whichBusinesses?.title
  const description = whichBusinesses?.description
  const businessCards = whichBusinesses?.businessCards || []
  const bottomNote = whichBusinesses?.bottomNote

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
          {description && (
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] max-w-5xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Cards Grid */}
        {businessCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {businessCards.map((card, index) => {
              const isLastInRow = (index + 1) % 3 === 0
              return (
                <div
                  key={index}
                  className={`border-l border-[#E5E5E5] p-6 lg:p-8 ${isLastInRow ? 'lg:border-r' : ''}`}
                >
                  {card.title && (
                    <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-semibold text-[#03C1CA] mb-3 text-center">
                      {card.title}
                    </h3>
                  )}
                  {card.description && (
                    <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] text-center">
                      {card.description}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Bottom Note */}
        {bottomNote && (
          <p className="text-center text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] mt-12 max-w-5xl mx-auto">
            {bottomNote}
          </p>
        )}
      </div>
    </section>
  )
}
