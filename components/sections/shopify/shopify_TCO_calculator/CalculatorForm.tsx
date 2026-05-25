'use client'

import React from 'react'
import Script from 'next/script'

interface CalculatorFormProps {
  selectedPlatform: string
  formTitle?: string
  hubspotPortalId?: string
  hubspotFormId?: string
}

const DEFAULT_PORTAL_ID = '49119369'
const DEFAULT_FORM_ID = '10642b03-8cb9-4e6b-8fee-b000f8ccd434'

export default function CalculatorForm({
  formTitle = '3-Year ROI Calculator',
  hubspotPortalId = DEFAULT_PORTAL_ID,
  hubspotFormId = DEFAULT_FORM_ID,
}: CalculatorFormProps) {
  return (
    <section className="relative overflow-hidden bg-[#00BFC8] min-h-screen flex items-start justify-center py-12 lg:py-16">
      <div className="section_container mx-auto page-padding-x w-full">
        <div className="w-full max-w-xl mx-auto">
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white mb-6">
            {formTitle}
          </h2>

          <div className="bg-white shadow-lg px-8 py-8 lg:px-10 lg:py-10">
            <Script
              src={`https://js.hsforms.net/forms/embed/${hubspotPortalId}.js`}
              strategy="afterInteractive"
            />
            <div
              className="hs-form-frame"
              data-region="na1"
              data-form-id={hubspotFormId}
              data-portal-id={hubspotPortalId}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
