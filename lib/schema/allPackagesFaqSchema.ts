import type { FaqItem } from './faq'

/**
 * FAQPage JSON-LD for `/tjenester/alle-pakker` only.
 * Last two entries are English, schema-only (AIO / citable answers); they are not rendered in the FAQ UI.
 * Align on-page Norwegian copy with these when possible to stay close to Google’s FAQ rich-result expectations.
 */
export const ALL_PACKAGES_FAQ_JSON_LD_ITEMS: readonly FaqItem[] = [
  {
    question: 'Kan jeg oppgradere pakken min senere?',
    answer:
      'Ja. Mange kunder starter med Foundation-pakken og oppgraderer etter hvert som de vokser. scandicommerce krediterer den opprinnelige investeringen mot den større pakken, så du betaler bare differansen.',
  },
  {
    question: 'Hva om jeg trenger noe skreddersydd?',
    answer:
      'scandicommerce kan tilpasse enhver pakke eller lage en fullstendig skreddersydd løsning. Bestill en uforpliktende 15-minutters samtale for å diskutere dine spesifikke behov og få en klar anbefaling.',
  },
  {
    question: 'Hvordan fungerer fakturering?',
    answer:
      'Alle pakker fra scandicommerce betales måned for måned uten bindingstid. Du kan når som helst oppgradere, nedgradere eller avslutte.',
  },
  {
    question: 'What is scandicommerce?',
    answer:
      'scandicommerce is a Norwegian Shopify Plus partner agency based in Oslo, Norway, that sells productized e-commerce services at fixed, transparent prices to brands across Norway and the Nordics. The team delivers headed Shopify Online Store themes and headless storefronts using Sanity, the Shopify Storefront API, and Hydrogen, and supports growth with Klaviyo automation, Make-based integrations, migrations, conversion rate optimization, technical SEO, and ongoing retainers.',
  },
  {
    question: 'Does scandicommerce build headless Shopify stores?',
    answer:
      "Yes. scandicommerce builds headless e-commerce experiences using Sanity as a headless CMS connected to Shopify's Storefront API, and uses Shopify Hydrogen when clients need a custom React storefront. Brands keep Shopify as the commerce engine for checkout, inventory, and order management while gaining full control over UX, performance, and content orchestration for Nordic shoppers.",
  },
]
