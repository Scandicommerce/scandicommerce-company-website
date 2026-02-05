'use client'

const selectionCriteria = [
  'Shopify Integration Depth: Look for native, certified integrations',
  'Scalability: Choose a solution that can grow with your business',
  'User-Friendliness: Ensure the interface is intuitive for your team',
  'Data Governance: Evaluate data validation and quality control capabilities',
  'Digital Asset Management: Consider how the system handles product images',
  'Implementation Timeline: Understand the setup process and time to value',
  'Support and Training: Assess available resources for your team\'s success',
]

export default function ChoosingRightPIM() {
  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] mb-4">
            Choosing the Right PIM for Your Shopify Store
          </h2>
          <p className="text-base lg:text-lg text-[#565454] max-w-2xl mx-auto">
            With numerous PIM solutions available, selecting the right one requires careful consideration of your specific business needs:
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left Column - Cyan Background */}
          <div className="bg-[#03C1CA] p-6 lg:p-8">
            <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-white mb-4">
              Key Selection Criteria
            </h3>
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white/90 mb-6">
              When choosing a PIM for your Shopify store, consider these factors:
            </p>
            <ul className="space-y-4">
              {selectionCriteria.map((criterion, index) => (
                <li key={index} className="flex items-start text-white">
                  <span className="mr-3 text-white">•</span>
                  <span className="text-sm lg:text-base">{criterion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Light Background */}
          <div className="bg-[#1DEFFA15] p-6 lg:p-8 flex flex-col justify-center">
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] mb-6">
              <span className="font-bold text-[#222222]">The Impact:</span> Choosing the right PIM solution can dramatically improve your team&apos;s efficiency, accelerate your time-to-market, and enhance your overall customer experience.
            </p>
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] mb-6">
              We can help you evaluate your specific requirements and recommend a PIM solution that aligns perfectly with your business goals, technical environment, and budget constraints.
            </p>
            <a href="/contact" className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#03C1CA] hover:underline font-medium">
              Find the perfect solution for your unique needs
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

