'use client'

interface Step {
  title?: string
  description?: string
  subSteps?: string[]
}

interface HowToGetStartedData {
  title?: string
  steps?: Step[]
}

interface HowToGetStartedProps {
  howToGetStarted?: HowToGetStartedData
}

const defaultSteps: Step[] = [
  {
    title: 'Get access to our quick checkout by doing the following:',
    subSteps: [
      'Log in to the Vipps Portal at portal.vipps.no',
      'Find "Order solutions" and "online payment"',
      'Submit an application for a new product "Vipps Checkout" or "Vipps integrated payment"',
      'Choose Scandicommerce as provider and price package Small'
    ]
  },
  {
    title: 'Order the quick checkout in the form below',
    description: 'You will receive an installation link for your Shopify store when the application for your new product is ready from Vipps.'
  }
]

export default function HowToGetStarted({ howToGetStarted }: HowToGetStartedProps) {
  const title = howToGetStarted?.title || 'How to get started:'
  const steps = howToGetStarted?.steps && howToGetStarted.steps.length > 0 ? howToGetStarted.steps : defaultSteps

  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] mb-8 lg:mb-12">
            {title}
          </h2>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-6 lg:p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#03C1CA] text-white font-bold flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    {step.title && (
                      <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-semibold text-[#222222] mb-3">
                        {step.title}
                      </h3>
                    )}
                    {step.description && (
                      <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] leading-relaxed">
                        {step.description}
                      </p>
                    )}
                    {step.subSteps && step.subSteps.length > 0 && (
                      <ul className="space-y-3 mt-3">
                        {step.subSteps.map((subStep, subIndex) => (
                          <li key={subIndex} className="flex items-start gap-3 text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454]">
                            <span className="text-[#03C1CA] font-bold mt-0.5">•</span>
                            <span>{subStep}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
