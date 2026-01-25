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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {title && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] text-center mb-6 lg:mb-8">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-base lg:text-lg text-[#565454] text-center mb-12 lg:mb-16 max-w-3xl mx-auto">
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
                    <h3 className="text-xl lg:text-2xl font-bold text-[#03C1CA] mb-4">
                      {specialization.title}
                    </h3>
                  )}
                  {specialization.description && (
                    <p className="text-base lg:text-lg text-[#565454] leading-relaxed">
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
