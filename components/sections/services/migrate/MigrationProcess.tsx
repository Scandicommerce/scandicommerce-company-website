'use client'

interface ProcessData {
  processTitle?: string
  processSubtitle?: string
  processPhases?: Array<{
    week: string
    title: string
    activities: string[]
  }>
}

interface MigrationProcessProps {
  process?: ProcessData
}

export default function MigrationProcess({ process }: MigrationProcessProps) {
  const title = process?.processTitle
  const subtitle = process?.processSubtitle
  const phases = process?.processPhases

  return (
    <section className="bg-white py-16 lg:py-[170px]">
      <div className="section_container mx-auto page-padding-x">
        {/* Heading */}
        {(title || subtitle) && (
          <div className="text-center mb-12 lg:mb-16">
            {title && (
              <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454]">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Process Cards */}
        {phases && phases.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {phases.map((phase, index) => (
              <div
                key={index}
                className="bg-[#F8F8F8] rounded-sm p-6 lg:p-8 shadow-md"
              >
                {phase.week && (
                  <div className="text-[#03C1CA] text-sm lg:text-base font-semibold mb-3">
                    {phase.week}
                  </div>
                )}
                {phase.title && (
                  <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-[#222222] mb-4 lg:mb-6">
                    {phase.title}
                  </h3>
                )}
                {phase.activities && phase.activities.length > 0 && (
                  <ul className="space-y-2 lg:space-y-3">
                    {phase.activities.map((activity, activityIndex) => (
                      <li
                        key={activityIndex}
                        className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] flex items-start"
                      >
                        <span className="mr-2 text-[#565454]">•</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
