'use client'

import Script from 'next/script'

const HUBSPOT_SCRIPT_URL = 'https://js.hsforms.net/forms/embed/49119369.js'
const PORTAL_ID = '49119369'
const FORM_ID = '6e11716a-1f41-4ed2-9a5f-debd82767472'
const REGION = 'na1'

export default function HubSpotFormEmbed() {
  return (
    <>
      <Script
        src={HUBSPOT_SCRIPT_URL}
        strategy="afterInteractive"
      />
      <div
        className="hs-form-frame"
        data-region={REGION}
        data-form-id={FORM_ID}
        data-portal-id={PORTAL_ID}
      />
    </>
  )
}
