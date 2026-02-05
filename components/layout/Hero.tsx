'use client'

import LiquidBlob from '@/components/ui/LiquidBlob'

import './Hero.css'

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
  searchPlaceholder?: string
  stats?: Stat[]
}

interface HeroProps {
  hero?: HeroData
  searchable?: boolean
  isStats?: boolean
  children?: React.ReactNode
}

const defaultStats: Stat[] = [
  { value: '50+', label: 'Norwegian brands served' },
  { value: '6', label: 'Years Shopify-only' },
  { value: '€12M+', label: 'Revenue generated for clients' },
]

export default function Hero({
  hero,
  searchable = false,
  isStats = false,
  children,
}: HeroProps) {
  const titleText = hero?.heroTitle?.text
  const titleHighlight = hero?.heroTitle?.highlight
  const description = hero?.heroDescription
  const searchPlaceholder = hero?.searchPlaceholder || 'Search for a package...'
  const stats = hero?.stats && hero.stats.length > 0 ? hero.stats : defaultStats

  console.log(description?.length)

  const renderTitle = () => {
    if (!titleText) return null
    if (!titleHighlight || !titleText.includes(titleHighlight)) {
      return (
        <span className="xl:text-[#FFFFFF] text-[#222222]">{titleText}</span>
      )
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

  // ${children ? 'h-[calc(95vh-80px)]' : 'h-[calc(90vh-80px)]'}

  // ${(titleText?.length || 0) < 30
  //   ? `${(description?.length || 0) > 150
  //     ? 'pt-12 xs:pt-20 1'
  //     : 'pt-12 xs:pt-20 2'
  //   } `
  //   : (titleText?.length || 0) >= 50
  //     ? `${(description?.length || 0) > 150
  //       ? 'pt-12 xs:pt-20 3'
  //       : 'pt-12 xs:pt-20 4'
  //     }`
  //     : `${(description?.length || 0) > 150
  //       ? 'pt-12 xs:pt-20 5'
  //       : 'pt-12 xs:pt-20 6'
  //     }`
  // }

  return (
    <section
      className={`hero-section-responsive relative bg-[#F8F8F8] py-20 lg:py-24 overflow-hidden md:min-h-[760px] md:h-[calc(100vh-80px)] flex md:items-center items-start justify-center`}
    >
      <LiquidBlob
        page="homepage"
        rotation={0}
        className="top-[190px] xs:top-[190px] animation-style sm:top-[37vw] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[72vw] xs:h-[65vw] sm:h-[70vw] md:w-[80%] md:h-[72vw] lg:w-[95%] lg:h-[95%] xl:w-[90%] xl:h-[90%] 2xl:w-[95%] 2xl:h-[95%]"
        enableMouseFollow={true}
      />

      <div className="absolute top-[35%] left-[25%] xl:block hidden w-40 h-40 rounded-full bg-[#1DEFFA33]"></div>
      <div className="absolute bottom-[44%] right-[32%] xl:block hidden w-[60px] h-[60px] rounded-full bg-[#1DEFFA33]"></div>


      <div
        className={`static flex flex-col justify-center items-center mx-auto page-padding-x z-10 gap-6 xs:gap-8 sm:gap-[3vw] md:gap-[42px]`}
      >
        <div className={`sm:min-h-[53vw] md:min-h-[auto] max-w-5xl
          ${(titleText?.length || 0) < 30
            ? 'pt-[31vw] xs:pt-[22vw] gap-[25vw] hero-content-padding-top-1'
            : (titleText?.length || 0) >= 56
              ? 'pt-[21vw] xs:pt-[17vw] gap-[14vw] hero-content-padding-top-2'
              : 'pt-[27vw] xs:pt-[20vw] gap-[18.5vw] hero-content-padding-top-3'
          }
          sm:pt-5 px-0 xs:page-padding-x flex flex-col justify-start sm:justify-center items-center sm:gap-[25px] lg:gap-[35px] sm:w-3/4 xs:w-[80%] w-[94%]`}>
          {titleText && (
            <h1 className="text-[6vw] xs:text-[4.5vw] sm:text-[4.2vw] md:text-[4vw] lg:text-4xl xl:text-[42px] font-bold text-center mb-1 sm:mb-3 lg:mb-6">
              {renderTitle()}
            </h1>
          )}

          {description && (
            <p className="text-sm sm:text-[2vw] md:text-base lg:text-lg xl:text-[#FFFFFF] text-[#222222] text-center leading-relaxed xs:px-4">
              {description}
            </p>
          )}
        </div>

        {searchable && (
          <div className="sm:w-3/4 xs:w-[90%] w-full">
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
        )}

        {isStats && (
          <div className="w-full xs:w-auto min-w-[94%] xs:min-w-[70%] flex flex-row gap-3 sm:gap-12 lg:gap-16 items-start justify-evenly bg-white/80 backdrop-blur-xl sm:px-8 px-3 py-2.5 border border-1 border-[#E5E5E5] xl:border-white">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl sm:text-[26px] md:text-[29px] lg:text-3xl font-bold text-[#03C1CA] mb-2 font-mono tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-[12px] md:text-[13px] xl:text-sm text-[#565454] font-sans">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {
          children && (
            <div className="w-full flex justify-center items-center">
              {children}
            </div>
          )
        }
        {/* <div className="w-full grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-4 gap-2"> */}
        {/* </div> */}
      </div>
    </section>
  )
}
