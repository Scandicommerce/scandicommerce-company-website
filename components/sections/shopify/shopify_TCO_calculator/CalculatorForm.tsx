'use client'

import React, { useEffect } from 'react'
import Script from 'next/script'

interface CalculatorFormProps {
  selectedPlatform: string
}

// Static form configuration
const formTitle = '3-Year ROI Calculator'

export default function CalculatorForm({ selectedPlatform }: CalculatorFormProps) {
  // Log selectedPlatform for potential future use
  useEffect(() => {
    console.log('Selected platform:', selectedPlatform)
  }, [selectedPlatform])

  return (
    <section className="relative overflow-hidden bg-[#00BFC8] min-h-screen flex items-start justify-center py-12 lg:py-16">
      <div className="section_container mx-auto page-padding-x w-full">
        <div className="w-full max-w-xl mx-auto">
          {/* Title above the card */}
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white mb-6">
            {formTitle}
          </h2>

          {/* White Card with HubSpot Form */}
          <div className="bg-white shadow-lg px-8 py-8 lg:px-10 lg:py-10">
            {/* HubSpot Form Embed */}
            <Script
              src="https://js.hsforms.net/forms/embed/49119369.js"
              strategy="afterInteractive"
            />
            <div
              className="hs-form-frame"
              data-region="na1"
              data-form-id="10642b03-8cb9-4e6b-8fee-b000f8ccd434"
              data-portal-id="49119369"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
