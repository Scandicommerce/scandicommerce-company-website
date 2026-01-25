'use client'

import LiquidBlob from '@/components/ui/LiquidBlob'

interface HeroData {
  heroTitle?: {
    highlight?: string
    text?: string
  }
  heroDescription?: string
  searchPlaceholder?: string
}

interface HeroProps {
  hero?: HeroData
}

export default function Hero({ hero }: HeroProps) {
  const titleHighlight = hero?.heroTitle?.highlight || 'Resources,'
  const titleText = hero?.heroTitle?.text || 'Insights & Shopify Expertise'
  const description = hero?.heroDescription || 'Deep dives, case studies, and actionable guides to help you master e-commerce on Shopify.'
  const searchPlaceholder = hero?.searchPlaceholder || 'Search articles...'

  return (
    <section className="relative bg-[#F8F8F8] py-16 lg:py-24 overflow-hidden min-h-[calc(100vh-80px)] flex items-center justify-center">
      <LiquidBlob
        page="homepage"
        rotation={0}
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] md:w-[100%] lg:w-[95%] xl:w-[90%] h-[110%] hidden lg:block"
      />

      <div className="absolute top-[35%] left-[25%] xl:block hidden w-40 h-40 rounded-full bg-[#1DEFFA33]"></div>
      <div className="absolute bottom-[44%] right-[32%] xl:block hidden w-[60px] h-[60px] rounded-full bg-[#1DEFFA33]"></div>

      <div className="container flex flex-col justify-center items-center mx-auto px-4 sm:px-6 lg:px-8 relative z-10 gap-[42px]">
        <div className="flex flex-col justify-start items-center gap-[53px] sm:w-3/4 2xl:w-1/2 w-full">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-4 sm:mb-6">
            <span className="text-[#1DEFFA]">{titleHighlight} </span>
            <span className="xl:text-[#FFFFFF] text-[#222222]">
              {titleText}
            </span>
          </h1>

          <p className="text-base lg:text-lg xl:text-xl xl:text-[#FFFFFF] text-[#222222] text-center leading-relaxed px-4">
            {description}
          </p>
        </div>

        <div className="w-full max-w-4xl">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full bg-white border border-gray-300 pl-12 pr-4 py-3 lg:py-4 text-base lg:text-lg text-gray-900 placeholder-gray-400 focus:outline-none shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
