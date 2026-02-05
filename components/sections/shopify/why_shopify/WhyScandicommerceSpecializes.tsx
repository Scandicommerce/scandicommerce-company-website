'use client'

interface SpecializationCard {
  title?: string
  description?: string
}

interface WhyScandicommerceSpecializesData {
  title?: string
  description?: string
  specializations?: SpecializationCard[]
}

interface WhyScandicommerceSpecializesProps {
  whyScandicommerceSpecializes?: WhyScandicommerceSpecializesData
}

export default function WhyScandicommerceSpecializes({ whyScandicommerceSpecializes }: WhyScandicommerceSpecializesProps) {
  const title = whyScandicommerceSpecializes?.title
  const description = whyScandicommerceSpecializes?.description
  const specializations = whyScandicommerceSpecializes?.specializations || []

  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="max-w-5xl mx-auto">
          {title && (
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] text-center mb-6 lg:mb-8">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] text-center mb-12 lg:mb-16 max-w-3xl mx-auto">
              {description}
            </p>
          )}

          {specializations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {specializations.map((specialization, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow"
                >
                  {specialization.title && (
                    <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-[#03C1CA] mb-4">
                      {specialization.title}
                    </h3>
                  )}
                  {specialization.description && (
                    <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] leading-relaxed">
                      {specialization.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
