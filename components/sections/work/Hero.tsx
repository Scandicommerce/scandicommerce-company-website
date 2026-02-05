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
  const titleText = hero?.heroTitle?.text || 'Our work speaks for itself'
  const titleHighlight = hero?.heroTitle?.highlight || 'for itself'
  const description = hero?.heroDescription || 'Transparent pricing, clear deliverables, and no surprises. Select the package that fits your needs.'

  const renderTitle = () => {
    if (!titleHighlight || !titleText.includes(titleHighlight)) {
      return <span className="xl:text-[#FFFFFF] text-[#222222]">{titleText}</span>
    }
    const parts = titleText.split(titleHighlight)
    return (
      <>
        <span className="xl:text-[#FFFFFF] text-[#222222]">{parts[0]}</span>
        <span className="text-[#1DEFFA]">{titleHighlight}</span>
        <span className="xl:text-[#FFFFFF] text-[#222222]">{parts[1]}</span>
      </>
    )
  }

  return (
    <section className="relative bg-[#F8F8F8] py-16 lg:py-24 overflow-hidden min-h-[calc(100vh-80px)] flex items-center justify-center">
      <LiquidBlob
        page="homepage"
        rotation={0}
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] md:w-[100%] lg:w-[95%] xl:w-[90%] h-[110%] hidden lg:block"
        enableMouseFollow={true}
      />

      <div className="absolute top-[35%] left-[32%] xl:block hidden w-40 h-40 rounded-full bg-[#1DEFFA33]"></div>
      <div className="absolute bottom-[44%] right-[32%] xl:block hidden w-[60px] h-[60px] rounded-full bg-[#1DEFFA33]"></div>

      <div className="section_container flex flex-col justify-center items-center mx-auto page-padding-x relative z-10">
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-4 sm:mb-6">
          {renderTitle()}
        </h1>
        <p className="text-base lg:text-lg xl:text-xl xl:text-[#FFFFFF] text-[#222222] text-center leading-relaxed px-4">
          {description}
        </p>
      </div>
    </section>
  )
}
