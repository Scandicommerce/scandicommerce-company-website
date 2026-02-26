'use client'

import LocalizedLink from '@/components/ui/LocalizedLink'

interface AICapability {
  title?: string
  description?: string
  features?: string[]
  bgColor?: string
  impactTitle?: string
  impactParagraph1?: string
  impactParagraph2?: string
  linkText?: string
}

interface HowWeLeverageAiData {
  title?: string
  capabilities?: AICapability[]
}

interface HowWeLeverageAIProps {
  howWeLeverageAi?: HowWeLeverageAiData
}

// Default capabilities data
const defaultCapabilities: AICapability[] = [
  {
    title: 'Enhanced Development Efficiency',
    description: 'We use AI-powered development tools to streamline the Shopify implementation process:',
    features: [
      'AI-assisted code generation for custom theme features',
      'Automated testing and quality assurance',
      'Rapid content creation for store pages',
      'Streamlined problem-solving and debugging',
    ],
    bgColor: 'bg-[#03C1CA]',
    impactTitle: 'The Impact:',
    impactParagraph1: 'By incorporating AI-powered tools into our development workflow, we can complete projects more efficiently while maintaining high quality standards.',
    impactParagraph2: 'For you, this means getting your Shopify store up and running faster, implementing new features more quickly, and staying ahead of market trends.',
    linkText: 'Significantly reduced development timelines',
  },
  {
    title: 'Improved Customer Experiences',
    description: 'We integrate best-in-class AI tools to enhance how customers interact with your store:',
    features: [
      'Smart product recommendation apps',
      'Intelligent search functionality that understands customer intent',
      'Targeted content display based on user behavior',
      'Automated email marketing tools that adapt to customer actions',
    ],
    bgColor: 'bg-[#1F1D1D]',
    impactTitle: 'The Impact:',
    impactParagraph1: 'These tools help create more relevant shopping experiences that respond to customer preferences and behaviors, potentially increasing engagement and conversion rates.',
    impactParagraph2: 'By strategically implementing these proven solutions, we help you offer the kind of personalized experience customers have come to expect from leading e-commerce brands.',
    linkText: 'Enhanced customer engagement through personalization',
  },
  {
    title: 'Efficient Store Management',
    description: 'We implement AI-powered tools that simplify running your Shopify store:',
    features: [
      'Content generation assistants for product descriptions',
      'Inventory management tools with predictive features',
      'Customer support automation through chatbots',
      'Data analysis tools for business insights',
    ],
    bgColor: 'bg-[#03C1CA]',
    impactTitle: 'The Impact:',
    impactParagraph1: 'These tools help reduce the time spent on routine tasks, allowing you to focus more on business strategy and growth opportunities.',
    impactParagraph2: 'By automating repetitive aspects of store management, you can operate more efficiently while still providing excellent customer service.',
    linkText: 'More efficient operations and resource allocation',
  },
]

export default function HowWeLeverageAI({ howWeLeverageAi }: HowWeLeverageAIProps) {
  const title = howWeLeverageAi?.title || 'How We Leverage AI-Powered Tools in Shopify'
  const capabilities = howWeLeverageAi?.capabilities && howWeLeverageAi.capabilities.length > 0 
    ? howWeLeverageAi.capabilities 
    : defaultCapabilities

  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] mb-4">
            {title}
          </h2>
        </div>

        {/* Capability Cards */}
        <div className="max-w-5xl mx-auto space-y-8">
          {capabilities.map((capability, index) => (
            <div key={index} className="bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Column - Dynamic Background Color */}
                <div className={`${capability.bgColor || 'bg-[#03C1CA]'} p-8 lg:p-10`}>
                  {capability.title && (
                    <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-white mb-4">
                      {capability.title}
                    </h3>
                  )}
                  {capability.description && (
                    <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white/90 mb-6">
                      {capability.description}
                    </p>
                  )}
                  {capability.features && capability.features.length > 0 && (
                    <ul className="space-y-3">
                      {capability.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-white">
                          <span className="mr-3 text-white">•</span>
                          <span className="text-sm lg:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Right Column - White Background */}
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  {capability.impactParagraph1 && (
                    <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] mb-4">
                      {capability.impactTitle && (
                        <span className="font-bold text-[#222222]">{capability.impactTitle}</span>
                      )}{' '}
                      {capability.impactParagraph1}
                    </p>
                  )}
                  {capability.impactParagraph2 && (
                    <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] mb-6">
                      {capability.impactParagraph2}
                    </p>
                  )}
                  {capability.linkText && (
                    <LocalizedLink href="/contact" className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#03C1CA] hover:underline font-medium">
                      {capability.linkText}
                    </LocalizedLink>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
