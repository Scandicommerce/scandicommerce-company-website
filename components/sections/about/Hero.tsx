'use client'

import LiquidBlob from '@/components/ui/LiquidBlob'

interface Stat {
  value?: string
  label?: string
}

interface HeroData {
  heroTitle?: {
    text?: string
    highlight?: string
  }
  heroDescription?: string
  stats?: Stat[]
}

interface HeroProps {
  hero?: HeroData
}

// Default stats
const defaultStats: Stat[] = [
  { value: '50+', label: 'Norwegian brands served' },
  { value: '6', label: 'Years Shopify-only' },
  { value: '€12M+', label: 'Revenue generated for clients' },
]

export default function Hero({ hero }: HeroProps) {
  const titleText = hero?.heroTitle?.text || 'We make Shopify feel like it was built for you'
  const titleHighlight = hero?.heroTitle?.highlight || 'built for you'
  const description = hero?.heroDescription || 'A Norwegian Shopify agency that treats clients like customers, not just projects. We build e-commerce solutions for brands ready to grow.'
  const stats = hero?.stats && hero.stats.length > 0 ? hero.stats : defaultStats

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

      <div className="absolute top-[35%] left-[25%] xl:block hidden w-40 h-40 rounded-full bg-[#1DEFFA33]"></div>
      <div className="absolute bottom-[44%] right-[32%] xl:block hidden w-[60px] h-[60px] rounded-full bg-[#1DEFFA33]"></div>

      <div className="section_container flex flex-col justify-center items-center mx-auto page-padding-x relative z-10 gap-[42px]">
        <div className="flex flex-col justify-start items-center gap-[53px] sm:w-3/4 2xl:w-1/2 w-full">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-4 sm:mb-6">
            {renderTitle()}
          </h1>

          <p className="text-base lg:text-lg xl:text-xl xl:text-[#FFFFFF] text-[#222222] text-center leading-relaxed px-4">
            {description}
          </p>
        </div>

        <div className="flex flex-row gap-3 sm:gap-12 lg:gap-16 items-start justify-center bg-white sm:px-8 px-3 py-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-[#03C1CA] mb-2 font-mono tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm md:text-base xl:text-lg text-[#565454] font-sans">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
