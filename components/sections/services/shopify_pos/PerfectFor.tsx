'use client'

interface PerfectForData {
  perfectForTitle?: string
  perfectForItems?: Array<{
    title: string
    description: string
  }>
}

interface PerfectForProps {
  perfectFor?: PerfectForData
}

export default function PerfectFor({ perfectFor }: PerfectForProps) {
  const title = perfectFor?.perfectForTitle
  const items = perfectFor?.perfectForItems

  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {title && (
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] mb-4">
              {title}
            </h2>
          </div>
        )}

        {items && items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {items.map((useCase, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center px-6 lg:px-8 lg:py-8 py-4 lg:border-r border-[#565454] ${
                  index === 0 ? 'lg:border-l border-[#565454]' : ''
                }`}
              >
                {useCase.title && (
                  <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-[#03C1CA] mb-4 lg:mb-7">
                    {useCase.title}
                  </h3>
                )}
                {useCase.description && (
                  <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454]">
                    {useCase.description}
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
