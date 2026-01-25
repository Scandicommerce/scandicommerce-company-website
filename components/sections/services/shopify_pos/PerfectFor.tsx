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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#222222] mb-4">
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
                  <h3 className="text-xl sm:text-2xl xl:text-[32px] font-bold text-[#03C1CA] mb-4 lg:mb-7">
                    {useCase.title}
                  </h3>
                )}
                {useCase.description && (
                  <p className="text-sm sm:text-base lg:text-lg text-[#565454]">
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
