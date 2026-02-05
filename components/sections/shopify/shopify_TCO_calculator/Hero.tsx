'use client'

import React from 'react'
import LiquidBlob from '@/components/ui/LiquidBlob'

interface HeroData {
  heroTitle?: {
    text?: string
    highlight?: string
  }
  heroDescription?: string
  platforms?: string[]
}

interface HeroProps {
  hero?: HeroData
  onPlatformSelect: (platform: string) => void
}

export default function Hero({ hero, onPlatformSelect }: HeroProps) {
  const titleText = hero?.heroTitle?.text
  const titleHighlight = hero?.heroTitle?.highlight
  const description = hero?.heroDescription
  const platforms = hero?.platforms || []

  const renderTitle = () => {
    if (!titleText) return null
    if (!titleHighlight || !titleText.includes(titleHighlight)) {
      return <span className="xl:text-white text-[#222222]">{titleText}</span>
    }
    const parts = titleText.split(titleHighlight)
    return (
      <>
        <span className="xl:text-white text-[#222222]">{parts[0]}</span>
        <span className="text-[#1DEFFA]">{titleHighlight}</span>
        <span className="xl:text-white text-[#222222]">{parts[1]}</span>
      </>
    )
  }

  return (
    <section className="relative bg-[#F8F8F8] overflow-hidden min-h-[calc(100vh-80px)] flex flex-col">
      {/* Main content area */}
      <div className="flex-1 relative flex items-center justify-center py-16 lg:py-24">
        <LiquidBlob
          page="homepage"
          rotation={0}
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] md:w-[120%] lg:w-[115%] xl:w-[110%] h-[130%] hidden lg:block"
          enableMouseFollow={true}
        />

        <div className="section_container flex flex-col justify-center items-center mx-auto page-padding-x relative z-10">
          {/* Hero Content */}
          <div className="flex flex-col justify-start items-center gap-6 sm:w-3/4 2xl:w-1/2 w-full text-center">
            {titleText && (
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold">
                {renderTitle()}
              </h1>
            )}

            {description && (
              <p className="text-base lg:text-lg xl:text-xl xl:text-white text-[#222222] leading-relaxed px-4 max-w-3xl">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section with buttons and teal bar */}
      <div className="relative z-20">
        {/* Platform Selection Buttons */}
        {platforms.length > 0 && (
          <div className="section_container mx-auto page-padding-x pb-12 lg:pb-16">
            <div className="w-full max-w-5xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => onPlatformSelect(platform)}
                    className="bg-white py-4 lg:py-5 px-6 text-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-base lg:text-lg font-medium text-gray-900">
                      {platform}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Teal bar at bottom */}
        <div className="h-3 bg-[#00BFC8] w-full"></div>
      </div>
    </section>
  )
}
