/** Shared labels for the Shopify platform / POS / TCO pages (no + en). */

export type ShopifyLang = 'no' | 'en'

export const shopifyLang = (language?: string | null): ShopifyLang => (language === 'no' ? 'no' : 'en')

export const SHOPIFY_T = {
  no: {
    platformEyebrow: 'Shopify-plattformen',
    posEyebrow: 'Shopify POS',
    tcoEyebrow: 'TCO-kalkulator',
    bookCall: 'Book en samtale',
    seeCases: 'Se kundecaser',
    painEyebrow: 'Skjulte kostnader',
    featuresEyebrow: 'Hva du får',
    formEyebrow: 'Ta kontakt',
    casesEyebrow: 'Kundecaser',
    calculatorEyebrow: 'Kalkulator',
    pickPlatform: 'Velg plattformen du bruker i dag',
    selectedPlatform: 'Valgt plattform',
  },
  en: {
    platformEyebrow: 'The Shopify platform',
    posEyebrow: 'Shopify POS',
    tcoEyebrow: 'TCO calculator',
    bookCall: 'Book a call',
    seeCases: 'See case studies',
    painEyebrow: 'Hidden costs',
    featuresEyebrow: 'What you get',
    formEyebrow: 'Get in touch',
    casesEyebrow: 'Case studies',
    calculatorEyebrow: 'Calculator',
    pickPlatform: 'Pick the platform you use today',
    selectedPlatform: 'Selected platform',
  },
} as const
