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
  const titleText = hero?.heroTitle?.text
  const titleHighlight = hero?.heroTitle?.highlight
  const description = hero?.heroDescription

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

  return (
    <section className="hero-section-responsive relative bg-[#F8F8F8] py-16 lg:py-24 overflow-hidden min-h-[calc(100vh-80px)] flex items-center justify-center">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-height: 425px) {
          .liquid-blob-small-height {
            width: 60% !important;
            height: 60% !important;
          }
        }
        @media (min-width: 375px) and (max-width: 425px) {
          .liquid-blob-medium-width {
            top: 28% !important;
          }
        }
        @media (min-width: 425px) and (max-width: 640px) {
          .liquid-blob-425-640-width {
            top: 32% !important;
          }
        }
        @media (min-width: 641px) and (max-width: 767px) {
          .liquid-blob-large-width {
            top: 52% !important;
            width: 78% !important;
            height: 78% !important;
          }
        }
        @media (max-width: 767px) {
          .liquid-blob-max-767 {
            top: 45% !important;
          }
        }
        @media (min-width: 768px) and (max-width: 768px) {
          .liquid-blob-768-width {
            top: 50% !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .liquid-blob-768-1023 {
            width: 90% !important;
            height: 90% !important;
          }
        }
        @media (min-width: 1280px) and (max-width: 1629px) {
          .liquid-blob-xl-width {
            width: 100% !important;
            height: 100% !important;
          }
        }
        @media (min-width: 640px) and (max-width: 767px) {
          .hero-buttons-gap {
            margin-top: 80px !important;
          }
          .hero-content-640-767 {
            gap: 20px !important;
          }
        }
        @media (min-width: 640px) and (max-width: 640px) {
          .liquid-blob-640-width {
            top: 35% !important;
          }
        }
        @media (min-width: 536px) and (max-width: 639px) {
          .hero-content-536-639 {
            width: 85% !important;
            gap: 30px !important;
          }
          .hero-buttons-gap-536-639 {
            margin-top: 60px !important;
          }
          .liquid-blob-536-639 {
            top: 34% !important;
          }
        }
        @media (min-width: 461px) and (max-width: 535px) {
          .hero-content-461-535 {
            width: 85% !important;
            gap: 24px !important;
          }
          .hero-buttons-gap-461-535 {
            margin-top: 50px !important;
          }
          .liquid-blob-461-535 {
            width: 78% !important;
            height: 78% !important;
          }
        }
        @media (min-width: 474px) and (max-width: 640px) {
          .liquid-blob-474-640 {
            top: 50% !important;
          }
          .hero-content-474-640 {
            margin-top: 20px !important;
            width: 78% !important;
          }
        }
        @media (min-width: 460px) and (max-width: 483px) {
          .hero-content-460-483 {
            width: 74% !important;
          }
          .liquid-blob-460-483 {
            width: 82% !important;
            height: 82% !important;
          }
        }
        @media (min-width: 478px) and (max-width: 508px) {
          .hero-content-478-508 {
            width: 68% !important;
          }
        }
        @media (min-width: 550px) and (max-width: 558px) {
          .hero-content-550-558 {
            width: 72% !important;
          }
        }
        @media (min-width: 474px) and (max-width: 535px) {
          .liquid-blob-474-535 {
            top: 49% !important;
          }
        }
        @media (min-width: 474px) and (max-width: 508px) {
          .hero-content-474-508 {
            width: 88% !important;
          }
        }
        @media (min-width: 474px) and (max-width: 492px) {
          .hero-content-474-492 {
            width: 91% !important;
          }
        }
        @media (min-width: 411px) and (max-width: 470px) {
          .liquid-blob-411-470 {
            top: 52% !important;
          }
        }
        @media (min-width: 471px) and (max-width: 473px) {
          .liquid-blob-471-473 {
            top: 46% !important;
          }
        }
        @media (min-width: 474px) and (max-width: 477px) {
          .hero-content-474-477 {
            width: 94% !important;
          }
          .liquid-blob-474-477 {
            top: 50% !important;
          }
        }
        @media (min-width: 461px) and (max-width: 470px) {
          .hero-content-461-470 {
            width: 90% !important;
            gap: 20px !important;
          }
          .liquid-blob-461-470 {
            top: 50% !important;
            width: 82% !important;
            height: 82% !important;
          }
        }
        @media (min-width: 460px) and (max-width: 460px) {
          .liquid-blob-460 {
            width: 75% !important;
            height: 75% !important;
          }
        }
        @media (min-width: 406px) and (max-width: 460px) {
          .hero-content-406-460 {
            margin-top: 110px !important;
          }
        }
        @media (min-width: 320px) and (max-width: 374px) {
          .hero-content-320-374 {
            width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-top: 100px !important;
          }
          .liquid-blob-320-374 {
            top: 42% !important;
          }
        }
        @media (min-width: 375px) and (max-width: 460px) {
          .liquid-blob-375-460 {
            top: 43% !important;
          }
          .hero-content-375-405 {
            margin-top: 100px !important;
          }
          
        }
        @media (min-width: 406px) and (max-width: 460px) {
          .hero-content-406-460 {
            margin-top: 130px !important;
          }
        }
        @media (min-width: 375px) and (max-width: 405px) {
          .hero-content-375-405 {
            width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .liquid-blob-375-405 {
            top: 43% !important;
          }
        }
        @media (max-width: 1023px) {
          .hero-section-responsive {
            min-height: calc(80vh - 80px) !important;
          }
        }
      `,
        }}
      />
      <LiquidBlob
        page="homepage"
        rotation={0}
        className="liquid-blob-small-height liquid-blob-medium-width liquid-blob-320-374 liquid-blob-375-405 liquid-blob-375-460 liquid-blob-406-460 liquid-blob-411-470 liquid-blob-425-640-width liquid-blob-640-width liquid-blob-460 liquid-blob-460-483 liquid-blob-461-470 liquid-blob-461-535 liquid-blob-471-473 liquid-blob-474-477 liquid-blob-474-535 liquid-blob-474-640 liquid-blob-536-639 liquid-blob-large-width liquid-blob-max-767 liquid-blob-768-width liquid-blob-768-1023 liquid-blob-xl-width top-[25%] sm:top-[35%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] md:w-[80%] md:h-[80%] lg:w-[95%] lg:h-[95%] xl:w-[90%] xl:h-[90%] 2xl:w-[85%] 2xl:h-[85%]"
        enableMouseFollow={true}
      />

      <div className="absolute top-[35%] left-[25%] xl:block hidden w-40 h-40 rounded-full bg-[#1DEFFA33]"></div>
      <div className="absolute bottom-[44%] right-[32%] xl:block hidden w-[60px] h-[60px] rounded-full bg-[#1DEFFA33]"></div>

      <div className="section_container flex flex-col justify-center items-center mx-auto page-padding-x relative z-10 gap-[42px]">
        <div className="hero-content-320-374 hero-content-375-405 hero-content-375-460 hero-content-406-460 hero-content-460-483 hero-content-461-470 hero-content-461-535 hero-content-474-477 hero-content-474-492 hero-content-474-508 hero-content-474-640 hero-content-478-508 hero-content-536-639 hero-content-550-558 hero-content-640-767 flex flex-col justify-start items-center gap-[53px] sm:w-3/4 2xl:w-1/2 w-[75%]">
          {titleText && (
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-4 sm:mb-6">
              {renderTitle()}
            </h1>
          )}

          {description && (
            <p className="text-base lg:text-lg xl:text-xl xl:text-[#FFFFFF] text-[#222222] text-center leading-relaxed px-4">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
