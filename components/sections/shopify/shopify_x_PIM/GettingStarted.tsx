'use client'

interface Step {
  number: number
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Audit Your Current Data',
    description: 'Assess your existing catalog structure and identify improvement opportunities',
  },
  {
    number: 2,
    title: 'Define Your Data Model',
    description: 'Establish product attributes, categories, and relationships',
  },
  {
    number: 3,
    title: 'Select a PIM Solution',
    description: 'Choose a platform that aligns with your business needs',
  },
  {
    number: 4,
    title: 'Plan Implementation',
    description: 'Create a realistic timeline with defined milestones',
  },
  {
    number: 5,
    title: 'Migrate & Clean Data',
    description: 'Transfer existing product information and enhance quality',
  },
  {
    number: 6,
    title: 'Configure Connection',
    description: 'Establish and test the Shopify integration',
  },
  {
    number: 7,
    title: 'Train Your Team',
    description: 'Ensure all users understand the new workflows',
  },
  {
    number: 8,
    title: 'Launch & Optimize',
    description: 'Go live and continually refine your processes',
  },
]

export default function GettingStarted() {
  return (
    <section className="bg-[#03C1CA] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white mb-4">
            Getting Started with PIM for Shopify
          </h2>
          <p className="text-base lg:text-lg text-white/90 max-w-2xl mx-auto">
            Implementing a PIM system for your Shopify store involves several key steps:
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-5xl mx-auto mb-12">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-[#1CD8E2] p-6"
            >
              <h3 className="text-base lg:text-lg font-semibold text-white mb-2">
                {step.number}. {step.title}
              </h3>
              <p className="text-sm text-white/90">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <p className="text-center text-base lg:text-lg text-white max-w-3xl mx-auto">
          Most Shopify merchants can complete a basic PIM implementation within 1-3 months, with more complex catalogs requiring additional time for data migration and enrichment.
        </p>
      </div>
    </section>
  )
}

