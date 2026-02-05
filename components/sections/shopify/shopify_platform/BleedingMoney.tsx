'use client'

import React from 'react'
import Image from 'next/image'
import { HiXMark } from 'react-icons/hi2'

interface BleedingMoneyData {
  title?: string
  leftPoints?: string[]
  rightPoints?: string[]
  bottomPoint?: string
}

interface BleedingMoneyProps {
  bleedingMoney?: BleedingMoneyData
}

export default function BleedingMoney({ bleedingMoney }: BleedingMoneyProps) {
  const title = bleedingMoney?.title
  const leftPoints = bleedingMoney?.leftPoints || []
  const rightPoints = bleedingMoney?.rightPoints || []
  const bottomPoint = bleedingMoney?.bottomPoint

  const rotations = [0, 1, -2]
  const leftTranslateX = [0, 20, 10]
  const rightTranslateX = [0, -20, -10]

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden min-h-[700px] lg:min-h-[800px]">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/shopify/shopify_platform/R (1).jpg"
          alt="Background"
          fill
          className="object-cover"
          style={{ filter: 'grayscale(100%)' }}
          priority
        />
        <div className="absolute inset-0"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 py-12 lg:py-20">
        <div className="section_container mx-auto page-padding-x">
          {/* Title */}
          {title && (
            <div className="text-center mb-16 lg:mb-20">
              <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white leading-tight">
                {title}
              </h2>
            </div>
          )}

          {/* Cards Layout */}
          <div className="max-w-6xl mx-auto relative">
            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-6">
              {/* Left Column */}
              <div className="space-y-6 lg:space-y-8">
                {leftPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 px-4 py-4 lg:px-6 lg:py-5 backdrop-blur-sm"
                    style={{
                      background: 'rgba(80, 80, 80, 0.5)',
                      transform: `rotate(${rotations[index % 3]}deg) translateX(${leftTranslateX[index % 3]}px)`,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-teal rounded-full flex-shrink-0">
                      <HiXMark className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <p className="text-white font-semibold text-sm sm:text-base">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-6 lg:space-y-8">
                {rightPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 px-4 py-4 lg:px-6 lg:py-5 backdrop-blur-sm"
                    style={{
                      background: 'rgba(80, 80, 80, 0.5)',
                      transform: `rotate(${rotations[index % 3]}deg) translateX(${rightTranslateX[index % 3]}px)`,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-teal rounded-full flex-shrink-0">
                      <HiXMark className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <p className="text-white font-semibold text-sm sm:text-base">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Full width card at bottom - centered */}
            {bottomPoint && (
              <div className="mt-10 lg:mt-14 flex justify-center">
                <div
                  className="flex items-center gap-4 px-4 py-4 lg:px-6 lg:py-5 backdrop-blur-sm max-w-2xl"
                  style={{
                    background: 'rgba(80, 80, 80, 0.5)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-teal rounded-full flex-shrink-0">
                    <HiXMark className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm sm:text-base">
                    {bottomPoint}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
