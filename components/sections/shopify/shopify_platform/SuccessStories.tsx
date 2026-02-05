'use client'

import React from 'react'
import Image from 'next/image'

interface CaseStudy {
  clientName?: string
  heading?: string
  description?: string
  imageUrl?: string
}

interface SuccessStoriesData {
  title?: string
  subtitle?: string
  caseStudies?: CaseStudy[]
}

interface SuccessStoriesProps {
  successStories?: SuccessStoriesData
}

export default function SuccessStories({ successStories }: SuccessStoriesProps) {
  const title = successStories?.title
  const subtitle = successStories?.subtitle
  const caseStudies = successStories?.caseStudies || []

  return (
    <section className="relative bg-[#F5F5F5] overflow-hidden">
      {/* Teal banner at top */}
      <div className="h-3 bg-[#00BFC8] w-full"></div>

      {/* Main content */}
      <div className="py-20 lg:py-28">
        <div className="section_container mx-auto page-padding-x">
          {/* Title */}
          <div className="text-center mb-12 lg:mb-16">
            {title && (
              <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Case Studies Grid - full width */}
          {caseStudies.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 -mx-4 sm:-mx-6 lg:-mx-8">
              {caseStudies.map((study, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    index !== 0 ? 'md:border-l border-gray-300' : ''
                  }`}
                >
                  {/* Image with overlay */}
                  <div className="relative w-full h-64 lg:h-72">
                    {study.imageUrl && (
                      <Image
                        src={study.imageUrl}
                        alt={study.clientName || 'Case study'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                    {/* Dark overlay with client name at bottom */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/90 to-transparent pt-16 pb-4 px-4">
                      {study.clientName && (
                        <h3 className="text-white font-bold text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] text-center">
                          {study.clientName}
                        </h3>
                      )}
                    </div>
                  </div>

                  {/* Content - white background */}
                  <div className="bg-white p-6 lg:p-8 flex-1 border-b border-gray-200">
                    {study.heading && (
                      <h4 className="text-[#00BFC8] font-semibold text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] mb-3">
                        {study.heading}
                      </h4>
                    )}
                    {study.description && (
                      <p className="text-gray-600 text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] leading-relaxed">
                        {study.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
