'use client'

import LiquidBlob from '@/components/ui/LiquidBlob'
import { Article } from '@/lib/articles'
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi'

interface ArticleHeroProps {
  article: Article
}

export default function ArticleHero({ article }: ArticleHeroProps) {
  // Split title to highlight specific part
  const highlightTitle = () => {
    const parts = article.title.split(article.titleHighlight)
    if (parts.length === 2) {
      return (
        <>
          <span className="text-[#1DEFFA]">{article.titleHighlight}</span>
          <span className="lg:text-[#565454] text-[#222]">{parts[1]}</span>
        </>
      )
    }
    return <span className="lg:text-[#565454] text-[#222222]">{article.title}</span>
  }

  return (
    <section className="relative bg-[#F8F8F8] py-16 lg:py-24 overflow-hidden min-h-[calc(90vh-90px)] md:min-h-[calc(100vh-80px)] flex items-center justify-center lg:justify-start">
      {/* Mobile Blob - Centered animation like layout/Hero.tsx (< 1024px) */}
      <LiquidBlob
        page="homepage"
        rotation={0}
        className="top-[25%] xs:top-[33%] sm:top-[35%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] md:w-[80%] md:h-[80%] block lg:hidden"
        enableMouseFollow={true}
      />

      {/* Desktop Blob - Original position (>= 1024px) */}
      <LiquidBlob
        page="homepage"
        rotation={10}
        className="top-[-5%] right-[-10%] w-[75%] h-[110%] hidden lg:block"
      />

      {/* Decorative circles for mobile (like layout/Hero.tsx) */}
      <div className="absolute top-[35%] left-[25%] lg:hidden w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#1DEFFA33]"></div>
      <div className="absolute bottom-[44%] right-[32%] lg:hidden w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full bg-[#1DEFFA33]"></div>

      <div className="md:static absolute top-[20%] xs:top-[27%] sm:top-[23%] xs:w-full sm:container mx-auto px-4 sm:px-6 lg:px-8 z-10 flex justify-center items-center lg:justify-start">
        <div className="w-[90%] xs:w-[90%] sm:w-4/5 lg:w-3/5 xl:w-2/5 flex flex-col items-center lg:items-start">
          {/* Title */}
          <h1 className="text-[5.8vw] xs:text-[4.5vw] sm:text-[32px] md:text-[4vw] lg:text-[40px] xl:text-[48px] !leading-[130%] font-bold mb-[26vw] xs:mb-6 sm:mb-8 lg:mb-12 text-center lg:text-left">
            {highlightTitle()}
          </h1>

          {/* Meta Information - horizontal row like design */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 md:gap-10 lg:text-[#565454] text-[#222222]">
            {/* Author */}
            <div className="flex items-center gap-2">
              <FiUser className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm md:text-base">{article.author.name}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm md:text-base">{article.date}</span>
            </div>

            {/* Read Time */}
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm md:text-base">{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
