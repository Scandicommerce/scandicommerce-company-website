'use client'

import React from 'react'

interface Feature {
  title?: string
  description?: string
  highlight?: string
}

interface OmnichannelFeaturesData {
  title?: string
  features?: Feature[]
}

interface OmnichannelFeaturesProps {
  omnichannelFeatures?: OmnichannelFeaturesData
}

// Badge icon component matching the design - teal circle with white verified badge
function BadgeIcon() {
  return (
    <svg className='w-10 h-10 sm:w-14 sm:h-14' viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="28" fill="#03C1CA" />
      <path
        d="M28 13C28 13 30.5 16 33 16C35.5 16 38 13.5 40 15.5C42 17.5 40 20 40 22.5C40 25 43 27.5 43 28C43 28.5 40 31 40 33.5C40 36 42 38.5 40 40.5C38 42.5 35.5 40 33 40C30.5 40 28 43 28 43C28 43 25.5 40 23 40C20.5 40 18 42.5 16 40.5C14 38.5 16 36 16 33.5C16 31 13 28.5 13 28C13 27.5 16 25 16 22.5C16 20 14 17.5 16 15.5C18 13.5 20.5 16 23 16C25.5 16 28 13 28 13Z"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 28L26 32L34 24"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default function OmnichannelFeatures({ omnichannelFeatures }: OmnichannelFeaturesProps) {
  const title = omnichannelFeatures?.title
  const features = omnichannelFeatures?.features || []

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Main content */}
      <div className="section_container mx-auto page-padding-x py-16 lg:py-24">
        {/* Title */}
        {title && (
          <div className="text-center mb-6 sm:mb-12 lg:mb-16">
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-gray-900 leading-tight">
              {title}
            </h2>
          </div>
        )}

        {/* Features Grid */}
        {features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:gap-y-8 gap-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="px-6 lg:px-10 py-4 sm:py-8 lg:py-10 flex flex-col items-center text-center border-l border-r border-gray-200"
              >
                {/* Icon Badge */}
                <div className="mb-5">
                  <BadgeIcon />
                </div>

                {/* Title */}
                {feature.title && (
                  <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                )}

                {/* Description */}
                {feature.description && (
                  <p className="text-gray-500 text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] leading-relaxed mb-4 max-w-xs">
                    {feature.description}
                  </p>
                )}

                {/* Highlight */}
                {feature.highlight && (
                  <p className="text-teal font-semibold text-sm">
                    {feature.highlight}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom teal bar */}
      <div className="h-2 bg-teal w-full"></div>
    </section>
  )
}
