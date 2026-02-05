'use client'

import React from 'react'
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
  const titleText = hero?.heroTitle?.text || 'Ready to Transform Your E-commerce?'
  const titleHighlight = hero?.heroTitle?.highlight || 'E-commerce?'
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
        
      <div className="section_container mx-auto page-padding-x relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
            {renderTitle()}
          </h1>
          
          <p className="xl:text-[#FFFFFF] text-[#222222] text-sm md:text-base lg:text-lg max-w-xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
