'use client'

import React from 'react'

interface MapSectionData {
  title?: string
  description?: string
  latitude?: number
  longitude?: number
}

interface MapSectionProps {
  mapSection?: MapSectionData
}

function buildMapUrl(lat: number, lng: number): string {
  const delta = 0.010
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`
}

export default function MapSection({ mapSection }: MapSectionProps) {
  const title = mapSection?.title || 'Our location'
  const description = mapSection?.description || ''
  const lat = mapSection?.latitude ?? 59.9242
  const lng = mapSection?.longitude ?? 10.6994
  const MAP_URL = buildMapUrl(lat, lng)

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
