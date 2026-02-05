'use client'

interface Feature {
  icon?: string
  title?: string
  description?: string
}

interface WhyDifferentData {
  title?: string
  subtitle?: string
  features?: Feature[]
}

interface WhyDifferentProps {
  whyDifferent?: WhyDifferentData
}

// Default features
const defaultFeatures: Feature[] = [
  {
    icon: 'pricing',
    title: 'Transparent Pricing',
    description: "No proposal ping-pong. Browse packages with clear pricing like you'd shop for products.",
  },
  {
    icon: 'product',
    title: 'Product-Style Services',
    description: 'Productized packages you can browse, compare, and select without endless meetings.',
  },
  {
    icon: 'results',
    title: 'Results First',
    description: 'We measure success in conversions, revenue, and growth—not just deliverables.',
  },
]

// Icon components
const PricingIcon = () => (
  <svg className="w-5 h-5 xs:w-7 xs:h-7 sm:w-10 sm:h-10" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40.625 27.375C40.625 20.1562 34.7188 19.3438 29.9688 18.6875C24.7969 17.9688 21.875 17.3438 21.875 12.8906C21.875 9.15625 25.7969 7.82813 29.1406 7.82813C32.7656 7.82813 35.6094 9.17188 37.8438 11.9375L40.2812 9.96875C37.9062 7.03125 34.875 5.32812 31.25 4.84375V0H28.125V4.71875C22.4688 5.0625 18.75 8.25 18.75 12.875C18.75 20.2656 24.7344 21.0938 29.5469 21.7656C34.625 22.4688 37.5 23.0781 37.5 27.3594C37.5 32.0938 32.6094 32.7969 29.6875 32.7969C24.3281 32.7969 22.0625 31.2969 19.9688 28.6875L17.5312 30.6563C20.2969 34.0781 23.3594 35.6094 28.125 35.875V40.625H31.25V35.875C37.0781 35.4062 40.625 32.2344 40.625 27.375ZM0 12.5H12.5V15.625H0V12.5ZM0 25H12.5V28.125H0V25ZM3.125 18.75H15.625V21.875H3.125V18.75Z" fill="white" />
  </svg>
)

const ProductIcon = () => (
  <svg className="w-5 h-5 xs:w-7 xs:h-7 sm:w-10 sm:h-10" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.875 0L35.75 9.14062V31.9922L17.875 41.1108L0 31.9922V9.14062L17.875 0ZM31.3027 10.0195L17.875 3.16406L12.6973 5.80078L26.0391 12.7002L31.3027 10.0195ZM17.875 16.875L22.9883 14.2822L9.625 7.38281L4.44727 10.0195L17.875 16.875ZM2.75 12.3047V30.2344L16.5 37.2656V19.3359L2.75 12.3047ZM19.25 37.2656L33 30.2344V12.3047L19.25 19.3359V37.2656Z" fill="white" />
  </svg>
)

const ResultsIcon = () => (
  <svg className="w-5 h-5 xs:w-7 xs:h-7 sm:w-10 sm:h-10" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M2.0625 0C1.51549 8.15107e-09 0.990886 0.217299 0.604092 0.604092C0.217299 0.990886 0 1.51549 0 2.0625C0 2.60951 0.217299 3.13411 0.604092 3.52091C0.990886 3.9077 1.51549 4.125 2.0625 4.125H25.4375C25.9845 4.125 26.5091 3.9077 26.8959 3.52091C27.2827 3.13411 27.5 2.60951 27.5 2.0625C27.5 1.51549 27.2827 0.990886 26.8959 0.604092C26.5091 0.217299 25.9845 8.15107e-09 25.4375 0H2.0625ZM0 10.3125C0 9.76549 0.217299 9.24088 0.604092 8.85409C0.990886 8.4673 1.51549 8.25 2.0625 8.25H16.5C17.047 8.25 17.5716 8.4673 17.9584 8.85409C18.3452 9.24088 18.5625 9.76549 18.5625 10.3125C18.5625 10.8595 18.3452 11.3841 17.9584 11.7709C17.5716 12.1577 17.047 12.375 16.5 12.375H2.0625C1.51549 12.375 0.990886 12.1577 0.604092 11.7709C0.217299 11.3841 0 10.8595 0 10.3125ZM24.75 31.625C26.5734 31.625 28.322 30.9007 29.6114 29.6114C30.9007 28.322 31.625 26.5734 31.625 24.75C31.625 22.9266 30.9007 21.178 29.6114 19.8886C28.322 18.5993 26.5734 17.875 24.75 17.875C22.9266 17.875 21.178 18.5993 19.8886 19.8886C18.5993 21.178 17.875 22.9266 17.875 24.75C17.875 26.5734 18.5993 28.322 19.8886 29.6114C21.178 30.9007 22.9266 31.625 24.75 31.625ZM24.75 35.75C27.0435 35.75 29.1692 35.0487 30.932 33.8497L34.98 37.895C35.1688 38.0976 35.3965 38.2602 35.6495 38.3729C35.9025 38.4856 36.1756 38.5462 36.4526 38.5511C36.7295 38.556 37.0046 38.5051 37.2614 38.4013C37.5182 38.2976 37.7515 38.1432 37.9473 37.9473C38.1432 37.7515 38.2976 37.5182 38.4013 37.2614C38.5051 37.0046 38.556 36.7295 38.5511 36.4526C38.5462 36.1756 38.4856 35.9025 38.3729 35.6495C38.2602 35.3965 38.0976 35.1688 37.895 34.98L33.8497 30.932C35.23 28.9006 35.8907 26.4658 35.7267 24.0154C35.5627 21.565 34.5833 19.2399 32.9447 17.4106C31.3061 15.5813 29.1024 14.353 26.6848 13.9213C24.2671 13.4896 21.7745 13.8794 19.6041 15.0285C17.4336 16.1777 15.7102 18.0202 14.7083 20.2624C13.7063 22.5047 13.4836 25.0177 14.0755 27.4012C14.6674 29.7847 16.0399 31.9016 17.9744 33.4146C19.9089 34.9276 22.2941 35.7497 24.75 35.75ZM2.0625 16.5C1.51549 16.5 0.990886 16.7173 0.604092 17.1041C0.217299 17.4909 0 18.0155 0 18.5625C0 19.1095 0.217299 19.6341 0.604092 20.0209C0.990886 20.4077 1.51549 20.625 2.0625 20.625H8.25C8.79701 20.625 9.32161 20.4077 9.70841 20.0209C10.0952 19.6341 10.3125 19.1095 10.3125 18.5625C10.3125 18.0155 10.0952 17.4909 9.70841 17.1041C9.32161 16.7173 8.79701 16.5 8.25 16.5H2.0625Z" fill="white" />
  </svg>
)

const getIcon = (iconName?: string) => {
  switch (iconName) {
    case 'pricing':
      return <PricingIcon />
    case 'product':
      return <ProductIcon />
    case 'results':
      return <ResultsIcon />
    default:
      return <PricingIcon />
  }
}

export default function WhyDifferent({ whyDifferent }: WhyDifferentProps) {
  const title = whyDifferent?.title || "Why we're different"
  const subtitle = whyDifferent?.subtitle || 'We built ScandiCommerce because we were tired of the traditional agency model'
  const features = whyDifferent?.features && whyDifferent.features.length > 0 ? whyDifferent.features : defaultFeatures

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] mb-4">
            {title}
          </h2>
          <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#555555] max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 relative">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex md:flex-row flex-col items-center justify-start gap-4 lg:gap-6"
            >
              <div className="flex-1 h-full w-full border" />
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-[#03C1CA] flex items-center justify-center mb-6">
                  {getIcon(feature.icon)}
                </div>

                <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-[#222222] mb-4">
                  {feature.title}
                </h3>

                <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#555555] leading-relaxed">
                  {feature.description}
                </p>
              </div>
              {index === features.length - 1 && (
                <div className="flex-1 h-full w-full border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
