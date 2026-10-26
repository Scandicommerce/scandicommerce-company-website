'use client'

import { ui } from '@/components/integrations/labels'
import HubSpotFormEmbed, { HUBSPOT_PORTAL_ID } from '@/components/sections/shopify/shared/HubSpotFormEmbed'
import { SHOPIFY_T, shopifyLang } from '@/components/sections/shopify/shared/labels'

interface CalculatorFormProps {
  selectedPlatform: string
  formTitle?: string
  hubspotPortalId?: string
  hubspotFormId?: string
  lang?: string
}

const DEFAULT_FORM_ID = '10642b03-8cb9-4e6b-8fee-b000f8ccd434'

/** The ROI / TCO HubSpot form in a hairline card, with the chosen platform as a mono label. */
export default function CalculatorForm({
  selectedPlatform,
  formTitle = '3-Year ROI Calculator',
  hubspotPortalId = HUBSPOT_PORTAL_ID,
  hubspotFormId = DEFAULT_FORM_ID,
  lang,
}: CalculatorFormProps) {
  const t = SHOPIFY_T[shopifyLang(lang)]
  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <div className="mx-auto flex max-w-[720px] flex-col gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>{t.calculatorEyebrow}</div>
            <h2 className={ui.h2}>{formTitle}</h2>
            {selectedPlatform && (
              <div className={ui.mono}>
                {t.selectedPlatform}: <span className="text-sc-ink-900">{selectedPlatform}</span>
              </div>
            )}
          </div>
          <div className="rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-8">
            <HubSpotFormEmbed formId={hubspotFormId || DEFAULT_FORM_ID} portalId={hubspotPortalId || HUBSPOT_PORTAL_ID} />
          </div>
        </div>
      </div>
    </section>
  )
}
