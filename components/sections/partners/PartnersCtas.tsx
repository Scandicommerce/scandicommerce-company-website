import LocalizedLink from '@/components/ui/LocalizedLink'
import { ui } from '@/components/integrations/labels'

interface Cta {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

/** The red thread quote, then two CTA cards: one for stores (from Sanity), one for would-be partners. */
export default function PartnersCtas({ cta, contactHref, lang }: { cta?: Cta; contactHref: string; lang: string }) {
  const isNo = lang === 'no'
  const storeTitle = cta?.title || (isNo ? 'Usikker på hvilken løsning som passer?' : 'Not sure which solution fits?')
  const storeText = cta?.description || (isNo ? '15 minutter med oss, så setter vi sammen stacken – med partnere vi stoler på og en fast pris.' : '15 minutes with us and we assemble the stack – with partners we trust and a fixed price.')
  const storeButton = cta?.buttonText || (isNo ? 'Bestill en uforpliktende samtale' : 'Book a call')
  const storeHref = cta?.buttonLink && cta.buttonLink.startsWith('/') ? cta.buttonLink : contactHref
  return (
    <>
      <section className="relative overflow-hidden bg-sc-ink-900 py-16 text-white lg:py-24">
        <div className={ui.container}>
          <div className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-300">{isNo ? 'Den røde tråden' : 'The common thread'}</div>
          <p className="m-0 max-w-[960px] text-[24px] font-semibold leading-[1.25] tracking-[-0.015em] lg:text-[40px]">
            {isNo ? 'Vi gjør Shopify-delen og norsk ERP og compliance. Partnerne gjør det de er best på. ' : 'We do the Shopify part and Norwegian ERP and compliance. Partners do what they do best. '}
            <span className="text-sc-cyan-300">{isNo ? 'Ingen av oss selger timer på det andre.' : 'Neither of us sells hours on the other.'}</span>
          </p>
        </div>
      </section>
      <section className="bg-white py-16 lg:py-20">
        <div className={`${ui.container} grid gap-5 lg:grid-cols-2`}>
          <div className="flex flex-col gap-4 rounded-lg border border-sc-ink-100 bg-sc-ink-50 p-7 lg:p-9">
            <div className={ui.eyebrow}>{isNo ? 'For butikker' : 'For stores'}</div>
            <h2 className="m-0 text-[26px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 lg:text-[30px]">{storeTitle}</h2>
            <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600 lg:text-base">{storeText}</p>
            <LocalizedLink href={storeHref} className={`${ui.btnPrimary} w-fit`}>{storeButton}</LocalizedLink>
          </div>
          <div className="flex flex-col gap-4 rounded-lg bg-sc-ink-900 p-7 text-white lg:p-9">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-300">{isNo ? 'For partnere' : 'For partners'}</div>
            <h2 className="m-0 text-[26px] font-bold leading-tight tracking-[-0.02em] lg:text-[30px]">{isNo ? 'Vil du jobbe med oss?' : 'Want to work with us?'}</h2>
            <p className="m-0 text-[15px] leading-relaxed text-sc-ink-200 lg:text-base">{isNo ? 'Vi ser etter partnere som deler verdiene våre og vil levere ordentlige løsninger til norske Shopify-butikker.' : 'We look for partners who share our values and want to deliver proper solutions to Norwegian Shopify stores.'}</p>
            <a href="mailto:post@scandicommerce.no?subject=Partnerskap" className="inline-flex min-h-[46px] w-fit items-center justify-center rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 hover:bg-sc-ink-50">
              {isNo ? 'Ta kontakt om partnerskap' : 'Get in touch about partnership'}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
