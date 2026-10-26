import Image from 'next/image'
import { ui } from '@/components/integrations/labels'

interface FeaturesData {
  title?: string
  paragraphs?: string[]
  demoStore?: {
    text?: string
    url?: string
    password?: string
  }
  productImage?: {
    src?: string
    alt?: string
  }
}

const DEFAULT_PARAGRAPHS = {
  en: [
    'Your customers get an easier shopping experience with Quick Checkout for Vipps, both at product level and in the cart.',
    "The integration is fully integrated with Shopify's backend and supports capture, refund and cancel.",
    'Automatically integrated with your shipping options; also supports discount codes, different VAT rates and tracking of purchase events.',
    'Add quick checkout buttons to the cart and product page yourself with the visual theme editor in Shopify. There you can change colour, shape and placement.',
  ],
  no: [
    'Kundene dine får en enklere handleopplevelse med Hurtigkasse for Vipps, både på produktnivå og i handlekurven.',
    'Integrasjonen er fullt integrert med Shopify sitt backend og støtter capture, refusjon og kansellering.',
    'Kobles automatisk til fraktalternativene dine, og støtter rabattkoder, ulike MVA-satser og sporing av kjøpshendelser.',
    'Legg til hurtigkasse-knapper i handlekurv og på produktside selv med Shopify sin temaredigering. Der endrer du farge, form og plassering.',
  ],
}

/** Intro prose, product screenshot in a hairline panel, demo store as a hairline card with a mono password. */
export default function Features({ features, lang = 'no' }: { features?: FeaturesData; lang?: string }) {
  const isNo = lang === 'no'
  const title = features?.title || (isNo ? 'Ta betalt med Hurtigkasse for Vipps i nettbutikken' : 'Accept payments with Quick Checkout for Vipps in your online store')
  const paragraphs = features?.paragraphs && features.paragraphs.length > 0 ? features.paragraphs : DEFAULT_PARAGRAPHS[isNo ? 'no' : 'en']
  const demoStore = features?.demoStore || {
    text: isNo ? 'Se demobutikken vår her:' : 'Check out our demo store here:',
    url: 'https://scandicommerce-demo.myshopify.com/',
    password: 'demo123',
  }
  const productImage = features?.productImage || {
    src: '/images/shopify/vipps_hurtigkasse/product_details.png',
    alt: 'Vipps Quick Checkout on product page',
  }

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>{isNo ? 'Hva du får' : 'What you get'}</div>
            <h2 className={ui.h2}>{title}</h2>
          </div>
          <div className="flex flex-col gap-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="m-0 text-base leading-relaxed text-sc-ink-600 lg:text-lg">
                {p}
              </p>
            ))}
          </div>
        </div>

        {productImage.src && (
          <div className="overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50 p-4 sm:p-8 lg:p-12">
            <Image src={productImage.src} alt={productImage.alt || 'Vipps Hurtigkasse'} width={1200} height={800} className="h-auto w-full rounded-md border border-sc-ink-100 bg-white" />
          </div>
        )}

        {demoStore.url && (
          <div className="flex flex-col gap-3 rounded-lg border border-sc-ink-100 border-l-2 border-l-sc-cyan-500 bg-sc-ink-50 p-6">
            {demoStore.text && <p className="m-0 text-[15px] font-semibold text-sc-ink-900">{demoStore.text}</p>}
            <a href={demoStore.url} target="_blank" rel="noopener noreferrer" className="break-all text-[15px] font-semibold text-sc-cyan-600 underline-offset-4 hover:underline">
              {demoStore.url}
            </a>
            {demoStore.password && (
              <p className="m-0 flex flex-wrap items-center gap-2 text-[15px] text-sc-ink-600">
                {isNo ? 'Passord:' : 'Password:'}
                <code className="rounded-md border border-sc-ink-200 bg-white px-2 py-0.5 font-mono text-[13px] text-sc-ink-900">{demoStore.password}</code>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
