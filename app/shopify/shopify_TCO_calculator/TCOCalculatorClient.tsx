'use client'

import { useState } from 'react'
import { ui } from '@/components/integrations/labels'
import ServiceHero from '@/components/sections/services/ServiceHero'
import CalculatorForm from '@/components/sections/shopify/shopify_TCO_calculator/CalculatorForm'
import { SHOPIFY_T, shopifyLang } from '@/components/sections/shopify/shared/labels'

interface TCOCalculatorClientProps {
  hero?: {
    heroTitle?: {
      text?: string
      highlight?: string
    }
    heroDescription?: string
    platforms?: string[]
  }
  calculatorConfig?: {
    formTitle?: string
    hubspotPortalId?: string
    hubspotFormId?: string
  }
  lang?: string
}

export default function TCOCalculatorClient({ hero, calculatorConfig, lang }: TCOCalculatorClientProps) {
  const t = SHOPIFY_T[shopifyLang(lang)]
  const [selectedPlatform, setSelectedPlatform] = useState<string>('WooCommerce')
  const platforms = (hero?.platforms ?? []).filter(Boolean)

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform)
    const formElement = document.getElementById('calculator-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const picker =
    platforms.length > 0 ? (
      <div className="flex flex-col gap-4">
        <div className={ui.mono}>{t.pickPlatform}</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {platforms.map((platform) => {
            const active = platform === selectedPlatform
            return (
              <button
                key={platform}
                type="button"
                onClick={() => handlePlatformSelect(platform)}
                aria-pressed={active}
                className={`${active ? ui.btnPrimary : ui.btnSecondary} w-full`}
              >
                {platform}
              </button>
            )
          })}
        </div>
      </div>
    ) : undefined

  return (
    <>
      <ServiceHero
        eyebrow={t.tcoEyebrow}
        title={hero?.heroTitle?.text ?? ''}
        highlight={hero?.heroTitle?.highlight}
        description={hero?.heroDescription}
        visual={picker}
      />
      <div id="calculator-form" className="scroll-mt-24">
        <CalculatorForm
          selectedPlatform={selectedPlatform}
          formTitle={calculatorConfig?.formTitle}
          hubspotPortalId={calculatorConfig?.hubspotPortalId}
          hubspotFormId={calculatorConfig?.hubspotFormId}
          lang={lang}
        />
      </div>
    </>
  )
}
