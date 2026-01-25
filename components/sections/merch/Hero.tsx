'use client'

import LiquidBlob from '@/components/ui/LiquidBlob'

interface HeroData {
  heroTitle?: {
    text?: string
    highlight?: string
  }
  heroDescription?: string
}

interface HeroProps {
  hero?: HeroData
}

export default function Hero({ hero }: HeroProps) {
  const titleText = hero?.heroTitle?.text || 'ScandiCommerce'
  const titleHighlight = hero?.heroTitle?.highlight || 'Merch'
  const description = hero?.heroDescription || 'Wear the brand behind high-performance Shopify builds. Premium quality, minimal design, maximum comfort.'

  return (
    <section className="relative bg-[#F8F8F8] py-16 lg:py-24 overflow-hidden min-h-[calc(100vh-80px)] flex items-center justify-center">
      <LiquidBlob
        page="homepage"
        rotation={0}
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] md:w-[100%] lg:w-[95%] xl:w-[90%] h-[110%] hidden lg:block"
      />

      <div className="absolute top-[35%] left-[25%] xl:block hidden w-40 h-40 rounded-full bg-[#1DEFFA33]"></div>
      <div className="absolute bottom-[44%] right-[32%] xl:block hidden w-[60px] h-[60px] rounded-full bg-[#1DEFFA33]"></div>

      <div className="container flex flex-col justify-center items-center mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-[960px]">
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-4 sm:mb-6">
          <span className="xl:text-[#FFFFFF] text-[#222222] leading-[130%]">
            {titleText}
          </span>{' '}
          <span className="text-[#1DEFFA] leading-[130%]">{titleHighlight}</span>
        </h1>
        <p className="text-base lg:text-lg xl:text-xl xl:text-[#FFFFFF] text-[#222222] text-center leading-relaxed px-4">
          {description}
        </p>
      </div>
    </section>
  )
}
