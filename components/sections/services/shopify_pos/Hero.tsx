'use client'

import Link from 'next/link'
import LiquidBlob from '@/components/ui/LiquidBlob'

interface HeroData {
  heroTitle?: {
    text?: string
    highlight?: string
  }
  heroDescription?: string
  heroButtonText?: string
  heroButtonLink?: string
}

interface HeroProps {
  hero?: HeroData
}

export default function Hero({ hero }: HeroProps) {
  const titleText = hero?.heroTitle?.text
  const titleHighlight = hero?.heroTitle?.highlight
  const description = hero?.heroDescription
  const buttonText = hero?.heroButtonText
  const buttonLink = hero?.heroButtonLink

  const renderTitle = () => {
    if (!titleText) return null
    if (!titleHighlight || !titleText.includes(titleHighlight)) {
      return <span className="xl:text-[#FFFFFF] text-[#222222]">{titleText}</span>
    }
    const parts = titleText.split(titleHighlight)
    return (
      <>
        <span className="text-[#1DEFFA]">{titleHighlight}</span>
        <span className="xl:text-[#FFFFFF] text-[#222222]">{parts[1]}</span>
      </>
    )
  }

  return (
    <section className="hero-section-responsive relative bg-[#F8F8F8] py-16 lg:py-24 overflow-hidden min-h-[calc(100vh-80px)] flex items-center justify-center">
      <style dangerouslySetInnerHTML={{ __html: `
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
            top: 36% !important;
            width: 72% !important;
            height: 72% !important;
          }
        }
        @media (min-width: 768px) and (max-width: 768px) {
          .liquid-blob-768-width {
            top: 50% !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .liquid-blob-768-1023 {
            top: 45% !important;
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
        @media (min-width: 574px) and (max-width: 602px) {
          .hero-content-574-602 {
            width: 80% !important;
          }
          .liquid-blob-574-602 {
            top: 36% !important;
          }
        }
        @media (min-width: 478px) and (max-width: 573px) {
          .liquid-blob-478-573 {
            top: 35% !important;
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
        @media (min-width: 474px) and (max-width: 535px) {
          .liquid-blob-474-535 {
            top: 33% !important;
          }
        }
        @media (min-width: 521px) and (max-width: 535px) {
          .hero-content-521-535 {
            width: 76% !important;
          }
          .liquid-blob-521-535 {
            top: 36% !important;
          }
        }
        @media (min-width: 509px) and (max-width: 520px) {
          .liquid-blob-509-520 {
            top: 35% !important;
          }
        }
        @media (min-width: 474px) and (max-width: 508px) {
          .hero-content-474-508 {
            width: 88% !important;
          }
        }
        @media (min-width: 504px) and (max-width: 508px) {
          .hero-content-504-508 {
            width: 85% !important;
          }
          .liquid-blob-504-508 {
            top: 35% !important;
          }
        }
        @media (min-width: 493px) and (max-width: 503px) {
          .hero-content-493-503 {
            width: 88% !important;
          }
          .liquid-blob-493-503 {
            top: 35% !important;
          }
        }
        @media (min-width: 474px) and (max-width: 492px) {
          .hero-content-474-492 {
            width: 91% !important;
          }
        }
        @media (min-width: 478px) and (max-width: 492px) {
          .hero-content-478-492 {
            width: 85% !important;
          }
          .liquid-blob-478-492 {
            top: 36% !important;
          }
        }
        @media (min-width: 474px) and (max-width: 477px) {
          .hero-content-474-477 {
            width: 87% !important;
          }
          .liquid-blob-474-477 {
            top: 37% !important;
          }
        }
        @media (min-width: 471px) and (max-width: 473px) {
          .liquid-blob-471-473 {
            top: 36% !important;
          }
        }
        @media (min-width: 461px) and (max-width: 470px) {
          .hero-content-461-470 {
            width: 95% !important;
            gap: 20px !important;
          }
          .liquid-blob-461-470 {
            top: 35% !important;
            width: 82% !important;
            height: 82% !important;
          }
        }
        @media (min-width: 470px) and (max-width: 470px) {
          .hero-content-470 {
            width: 92% !important;
          }
        }
        @media (min-width: 324px) and (max-width: 460px) {
          .liquid-blob-324-460 {
            top: 30% !important;
          }
        }
        @media (min-width: 375px) and (max-width: 460px) {
          .liquid-blob-375-460 {
            top: 42% !important;
          }
        }
        @media (min-width: 406px) and (max-width: 460px) {
          .hero-content-406-460 {
            width: 88% !important;
            gap: 80px !important;
          }
          .liquid-blob-406-460 {
            top: 22% !important;
          }
        }
        @media (min-width: 375px) and (max-width: 405px) {
          .hero-content-375-405 {
            width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .liquid-blob-375-405 {
            top: 26% !important;
          }
        }
        @media (max-width: 1023px) {
          .hero-section-responsive {
            min-height: calc(90vh - 80px) !important;
          }
        }
      `}} />
      <LiquidBlob
        page="homepage"
        rotation={0}
        className="liquid-blob-small-height liquid-blob-medium-width liquid-blob-324-460 liquid-blob-375-405 liquid-blob-375-460 liquid-blob-406-460 liquid-blob-425-640-width liquid-blob-478-492 liquid-blob-478-573 liquid-blob-493-503 liquid-blob-504-508 liquid-blob-509-520 liquid-blob-521-535 liquid-blob-574-602 liquid-blob-640-width liquid-blob-461-470 liquid-blob-461-535 liquid-blob-471-473 liquid-blob-474-477 liquid-blob-474-535 liquid-blob-536-639 liquid-blob-large-width liquid-blob-768-width liquid-blob-768-1023 liquid-blob-xl-width top-[25%] sm:top-[35%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] md:w-[80%] md:h-[80%] lg:w-[95%] lg:h-[95%] xl:w-[90%] xl:h-[90%] 2xl:w-[85%] 2xl:h-[85%]"
        enableMouseFollow={true}
      />

      <div className="absolute top-[35%] left-[25%] xl:block hidden w-40 h-40 rounded-full bg-[#1DEFFA33]"></div>
      <div className="absolute bottom-[44%] right-[32%] xl:block hidden w-[60px] h-[60px] rounded-full bg-[#1DEFFA33]"></div>

      <div className="section_container flex flex-col justify-center items-center mx-auto page-padding-x relative z-10 gap-[42px]">
        <div className="hero-content-375-405 hero-content-406-460 hero-content-461-470 hero-content-461-535 hero-content-470 hero-content-474-477 hero-content-474-492 hero-content-474-508 hero-content-478-492 hero-content-493-503 hero-content-504-508 hero-content-521-535 hero-content-536-639 hero-content-574-602 flex flex-col justify-start items-center gap-[53px] sm:w-3/4 2xl:w-1/2 w-full">
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

        {buttonText && buttonLink && (
          <div className="hero-buttons-gap hero-buttons-gap-461-535 hero-buttons-gap-536-639 flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
            <Link
              href={buttonLink}
              className="min-w-[286px] bg-black text-white md:bg-white md:text-[#1F1D1D] px-8 py-4 hover:bg-gray-800 md:hover:bg-gray-100 transition-colors text-center w-full sm:w-auto"
            >
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
