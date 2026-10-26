import { ui } from '@/components/integrations/labels'

const DEFAULT_PRICE_ITEMS = [{ priceText: '399 NOK' }, { priceText: '259 DKK' }, { priceText: '35 EUR' }]

interface PricingData {
  sectionTitle?: string
  price?: string
  priceItems?: { priceText?: string }[]
  priceNote?: string
  supportText?: string
}

/** Price per market as mono figures in one hairline card. */
export default function Pricing({ pricing, lang = 'no' }: { pricing?: PricingData; lang?: string }) {
  const isNo = lang === 'no'
  const sectionTitle = pricing?.sectionTitle || (isNo ? 'Hva koster Hurtigkasse for Vipps i Shopify?' : 'How much does Quick Checkout for Vipps in Shopify cost?')
  const priceNote = pricing?.priceNote || (isNo ? 'eks. mva per måned' : 'ex. VAT per month')
  const supportText = pricing?.supportText || (isNo ? 'Gratis support på e-post' : 'Free support via email')

  const fromSanity = (pricing?.priceItems ?? []).filter((p): p is { priceText: string } => !!p?.priceText?.trim())
  const priceItems = fromSanity.length > 0 ? fromSanity : pricing?.price ? [{ priceText: pricing.price }] : DEFAULT_PRICE_ITEMS

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{isNo ? 'Pris' : 'Price'}</div>
          <h2 className={ui.h2}>{sectionTitle}</h2>
        </div>
        <div className="flex flex-col gap-6 rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-8">
          <dl className="m-0 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-100 sm:grid-cols-3">
            {priceItems.map((item, i) => (
              <div key={i} className="flex flex-col gap-1.5 bg-sc-ink-50 p-5">
                <dt className="font-mono text-[28px] font-semibold leading-none tracking-[-0.02em] text-sc-ink-900 lg:text-[32px]">{item.priceText}</dt>
                <dd className="m-0 text-[13px] text-sc-ink-500">{priceNote}</dd>
              </div>
            ))}
          </dl>
          <p className="m-0 flex items-center gap-2 text-[15px] text-sc-ink-600">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sc-cyan-500" />
            {supportText}
          </p>
        </div>
      </div>
    </section>
  )
}
