'use client'

interface ResultsData {
  resultsTitle?: string
  resultsItems?: Array<{
    metric: string
    title: string
    description: string
  }>
}

interface RealMigrationResultsProps {
  results?: ResultsData
}

export default function RealMigrationResults({ results }: RealMigrationResultsProps) {
  const title = results?.resultsTitle
  const items = results?.resultsItems

  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-6 lg:mb-16">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#222222] lg:mb-4 mb-2">
              {title}
            </h2>
          </div>
        )}

        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {items.map((result, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center px-6 lg:px-8 lg:py-8 py-4 lg:border-r border-[#565454] ${
                  index === 0 ? 'lg:border-l border-[#565454]' : ''
                }`}
              >
                {result.metric && (
                  <div className="text-xl sm:text-2xl lg:text-3xl xl:text-[32px] font-bold text-[#03C1CA] mb-7 font-mono tracking-tight">
                    {result.metric}
                  </div>
                )}
                {result.title && (
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#222222] mb-2">
                    {result.title}
                  </h3>
                )}
                {result.description && (
                  <p className="text-xs sm:text-sm lg:text-base text-[#565454]">
                    {result.description}
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
