'use client'

import Script from 'next/script'

export const HUBSPOT_PORTAL_ID = '49119369'
export const HUBSPOT_REGION = 'na1'

interface HubSpotFormEmbedProps {
  formId: string
  portalId?: string
  region?: string
  className?: string
}

/**
 * One HubSpot form embed for every Shopify page. The loader script is keyed
 * by portal so next/script loads it once even when a page embeds two forms.
 */
export default function HubSpotFormEmbed({ formId, portalId = HUBSPOT_PORTAL_ID, region = HUBSPOT_REGION, className }: HubSpotFormEmbedProps) {
  const portal = portalId || HUBSPOT_PORTAL_ID
  return (
    <div className={className ?? '[&_.hs-form-frame]:min-h-[400px]'}>
      <Script id={`hs-forms-${portal}`} src={`https://js.hsforms.net/forms/embed/${portal}.js`} strategy="afterInteractive" />
      <div className="hs-form-frame" data-region={region} data-form-id={formId} data-portal-id={portal} />
    </div>
  )
}
