import CTA from '@/components/sections/shopify/shopify_x_PIM/CTA'

interface SupportData {
  title?: string
  buttonText?: string
  buttonLink?: string
}

/** Support as the shared CtaBand. */
export default function Support({ support, lang = 'no' }: { support?: SupportData; lang?: string }) {
  const isNo = lang === 'no'
  return (
    <CTA
      cta={{
        title: support?.title || (isNo ? 'Har du problemer med Hurtigkasse for Shopify?' : 'Do you have a problem with your Quick Checkout for Shopify?'),
        buttonText: support?.buttonText || (isNo ? 'Kontakt oss her' : 'Contact us here'),
        buttonLink: support?.buttonLink || '/contact',
      }}
    />
  )
}
