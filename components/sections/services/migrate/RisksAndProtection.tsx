'use client'

import { HiXMark } from 'react-icons/hi2'
import { IoCheckmarkSharp } from 'react-icons/io5'

interface RisksProtectionData {
  risksTitle?: string
  risksItems?: Array<{
    text: string
  }>
  protectionTitle?: string
  protectionItems?: Array<{
    title: string
    description: string
  }>
}

interface RisksAndProtectionProps {
  risksProtection?: RisksProtectionData
}

export default function RisksAndProtection({ risksProtection }: RisksAndProtectionProps) {
  const risksTitle = risksProtection?.risksTitle
  const risks = risksProtection?.risksItems
  const protectionTitle = risksProtection?.protectionTitle
  const protections = risksProtection?.protectionItems

  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-[170px]">
      <div className="section_container mx-auto page-padding-x">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Migration risks we eliminate */}
          <div>
            {risksTitle && (
              <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] text-center font-bold text-[#1F1D1D] mb-8 lg:mb-12">
                {risksTitle}
              </h2>
            )}
            {risks && risks.length > 0 && (
              <div className="space-y-4 lg:space-y-6">
                {risks.map((risk, index) => (
                  <div
                    key={index}
                    className="bg-white h-[98px] p-6 flex items-center gap-4 backdrop-blur-[10px]"
                  >
                    <HiXMark className="w-6 h-6 text-[#000000] flex-shrink-0" />
                    <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454]">
                      {risk.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: How we protect your business */}
          <div>
            {protectionTitle && (
              <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] text-center font-bold text-[#1F1D1D] mb-8 lg:mb-12">
                {protectionTitle}
              </h2>
            )}
            {protections && protections.length > 0 && (
              <div className="space-y-4 lg:space-y-6">
                {protections.map((protection, index) => (
                  <div
                    key={index}
                    className="bg-white h-[98px] p-6 flex items-center gap-4 backdrop-blur-[10px]"
                  >
                    <IoCheckmarkSharp className="w-6 h-6 text-[#03C1CA] flex-shrink-0" />
                    <div>
                      {protection.title && (
                        <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-[#565454] mb-1">
                          {protection.title}
                        </h3>
                      )}
                      {protection.description && (
                        <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454]">
                          {protection.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
