'use client'

interface PlatformsData {
  platformsTitle?: string
  platformsItems?: Array<{
    name: string
    duration: string
  }>
}

interface PlatformsProps {
  platforms?: PlatformsData
}

export default function Platforms({ platforms }: PlatformsProps) {
  const title = platforms?.platformsTitle
  const items = platforms?.platformsItems

  return (
    <section className="bg-white py-16 lg:py-[170px]">
      <div className="section_container mx-auto page-padding-x">
        {/* Heading */}
        {title && (
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#1F1D1D] text-center mb-12 lg:mb-16">
            {title}
          </h2>
        )}

        {/* Platform Cards */}
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {items.map((platform, index) => (
              <div
                key={index}
                className="bg-[#F8F8F8] p-6 lg:p-8 text-center shadow-md"
              >
                {platform.name && (
                  <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-[#565454] mb-3">
                    {platform.name}
                  </h3>
                )}
                {platform.duration && (
                  <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454]">
                    {platform.duration}
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
