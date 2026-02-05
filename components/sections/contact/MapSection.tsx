'use client'

import React from 'react'

interface MapSectionData {
  title?: string
  description?: string
}

interface MapSectionProps {
  mapSection?: MapSectionData
}

// Static map URL - not editable via Sanity
const MAP_URL = 'https://www.openstreetmap.org/export/embed.html?bbox=10.7202%2C59.9063%2C10.7702%2C59.9263&layer=mapnik&marker=59.9163%2C10.7452'

export default function MapSection({ mapSection }: MapSectionProps) {
  const title = mapSection?.title || 'Interactive map placeholder'
  const description = mapSection?.description || "Choose a time that works for you. We'll discuss your goals and create a custom plan."

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="section_container mx-auto page-padding-x">
        <div className="text-center mb-8">
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-gray-500">
            {description}
          </p>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-lg">
          <iframe
            title="ScandiCommerce Office Location"
            src={MAP_URL}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>
      </div>
    </section>
  )
}
