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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-12 lg:mb-16">
            {title && (
              <h2 className="text-3xl lg:text-4xl xl:text-[42px] font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
                        <h3 className="text-white font-bold text-lg lg:text-xl text-center">
                          {study.clientName}
                        </h3>
                      )}
                    </div>
                  </div>

                  {/* Content - white background */}
                  <div className="bg-white p-6 lg:p-8 flex-1 border-b border-gray-200">
                    {study.heading && (
                      <h4 className="text-[#00BFC8] font-semibold text-lg lg:text-xl mb-3">
                        {study.heading}
                      </h4>
                    )}
                    {study.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
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
