'use client'

interface WhyShopifyData {
  whyShopifyTitle?: string
  whyShopifySubtitle?: string
  whyShopifyFeatures?: Array<{
    title: string
    description: string
    icon?: string
  }>
}

interface WhyShopifyWinsProps {
  whyShopify?: WhyShopifyData
}

const IconCart = () => (
  <svg width="30" height="35" viewBox="0 0 30 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28.2188 8.59375H22.5078V7.90625C22.5078 3.54063 19.0477 0 14.7812 0C10.5148 0 7.05469 3.54063 7.05469 7.90625V8.59375H1.34375C0.600488 8.59375 0 9.2082 0 9.96875V33C0 33.7605 0.600488 34.375 1.34375 34.375H28.2188C28.962 34.375 29.5625 33.7605 29.5625 33V9.96875C29.5625 9.2082 28.962 8.59375 28.2188 8.59375ZM10.0781 7.90625C10.0781 5.24648 12.1819 3.09375 14.7812 3.09375C17.3806 3.09375 19.4844 5.24648 19.4844 7.90625V8.59375H10.0781V7.90625ZM26.5391 31.2812H3.02344V11.6875H7.05469V15.4688C7.05469 15.6578 7.20586 15.8125 7.39062 15.8125H9.74219C9.92695 15.8125 10.0781 15.6578 10.0781 15.4688V11.6875H19.4844V15.4688C19.4844 15.6578 19.6355 15.8125 19.8203 15.8125H22.1719C22.3566 15.8125 22.5078 15.6578 22.5078 15.4688V11.6875H26.5391V31.2812Z" fill="white"/>
  </svg>
)

const IconChart = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 24V8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 24V14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 24V12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 24V4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconUptime = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="26" height="20" rx="2" stroke="white" strokeWidth="2.5"/>
    <path d="M8 18L12 14L16 18L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 10H24V14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconShield = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3L4 8V15C4 22.18 9.12 28.84 16 30C22.88 28.84 28 22.18 28 15V8L16 3Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16L15 19L21 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const iconMap: Record<string, React.ReactNode> = {
  cart: <IconCart />,
  chart: <IconChart />,
  uptime: <IconUptime />,
  shield: <IconShield />,
}

export default function WhyShopifyWins({ whyShopify }: WhyShopifyWinsProps) {
  // Content variables from Sanity
  const title = whyShopify?.whyShopifyTitle
  const subtitle = whyShopify?.whyShopifySubtitle
  const features = whyShopify?.whyShopifyFeatures

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            {title && (
              <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-gray-900 mb-3 sm:mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Feature Cards Grid */}
        {features && features.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#F8F8F8] rounded-lg p-4 sm:p-6 lg:p-8 text-center"
              >
                {/* Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#03C1CA] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-5">
                  <div className="scale-75 sm:scale-90 lg:scale-100">
                    {iconMap[feature.icon || 'cart'] || iconMap.cart}
                  </div>
                </div>

                {/* Title */}
                {feature.title && (
                  <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                )}

                {/* Description */}
                {feature.description && (
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 leading-relaxed">
                    {feature.description}
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
