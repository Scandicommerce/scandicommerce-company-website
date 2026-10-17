'use client'

import { useEffect } from 'react'
import { ui } from '@/components/integrations/labels'

interface OrderFormData {
  title?: string
  description?: string
}

const HUBSPOT_SRC = 'https://js.hsforms.net/forms/embed/49119369.js'

/* HubSpot renders into .hs-form-frame; these arbitrary variants restyle its inputs like BookingSection's. */
const FORM =
  '[&_.hs-form-field]:mb-4 ' +
  '[&_.hs-form-field>label]:mb-1.5 [&_.hs-form-field>label]:block [&_.hs-form-field>label]:text-[13px] [&_.hs-form-field>label]:font-semibold [&_.hs-form-field>label]:text-sc-ink-700 ' +
  '[&_.hs-input]:w-full [&_.hs-input]:rounded-lg [&_.hs-input]:border [&_.hs-input]:border-sc-ink-200 [&_.hs-input]:bg-white [&_.hs-input]:px-3.5 [&_.hs-input]:py-2.5 [&_.hs-input]:text-[15px] [&_.hs-input]:text-sc-ink-900 [&_.hs-input]:outline-none [&_.hs-input]:transition-colors ' +
  '[&_.hs-input:focus]:border-sc-cyan-500 [&_.hs-input:focus]:ring-2 [&_.hs-input:focus]:ring-sc-cyan-500/20 ' +
  '[&_textarea.hs-input]:min-h-[140px] [&_textarea.hs-input]:resize-none ' +
  '[&_.hs-button]:inline-flex [&_.hs-button]:min-h-[46px] [&_.hs-button]:w-full [&_.hs-button]:cursor-pointer [&_.hs-button]:items-center [&_.hs-button]:justify-center [&_.hs-button]:rounded-lg [&_.hs-button]:border-0 [&_.hs-button]:bg-sc-ink-900 [&_.hs-button]:px-[22px] [&_.hs-button]:py-3 [&_.hs-button]:text-sm [&_.hs-button]:font-semibold [&_.hs-button]:tracking-[0.02em] [&_.hs-button]:text-white [&_.hs-button]:transition-colors [&_.hs-button:hover]:bg-sc-ink-700 ' +
  '[&_.hs-error-msgs]:mt-1.5 [&_.hs-error-msgs]:list-none [&_.hs-error-msgs]:p-0 [&_.hs-error-msgs]:text-[13px] [&_.hs-error-msgs]:text-red-700 ' +
  '[&_.submitted-message]:rounded-lg [&_.submitted-message]:border [&_.submitted-message]:border-sc-cyan-200 [&_.submitted-message]:bg-sc-cyan-50 [&_.submitted-message]:p-4 [&_.submitted-message]:text-sm [&_.submitted-message]:text-sc-cyan-700'

/** The HubSpot order form in a hairline card. The embed script and form ids are unchanged. */
export default function OrderForm({ orderForm, lang = 'no' }: { orderForm?: OrderFormData; lang?: string }) {
  const isNo = lang === 'no'
  const title = orderForm?.title || (isNo ? 'Bestill Vipps Hurtigkasse her' : 'Order Vipps Quick Checkout here')
  const description = orderForm?.description || (isNo ? 'Fyll ut bestillingsskjemaet, så svarer vi på e-post.' : 'Fill out the order form and we will respond via email.')

  useEffect(() => {
    const script = document.createElement('script')
    script.src = HUBSPOT_SRC
    script.defer = true
    document.body.appendChild(script)

    return () => {
      const existing = document.querySelector(`script[src="${HUBSPOT_SRC}"]`)
      if (existing) existing.remove()
    }
  }, [])

  return (
    <section id="order-form" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}>
        <div className="flex flex-col gap-2.5">
          <div className={ui.eyebrow}>{isNo ? 'Bestilling' : 'Order'}</div>
          <h2 className={ui.h2}>{title}</h2>
          <p className="m-0 text-lg leading-relaxed text-sc-ink-600">{description}</p>
        </div>
        <div className="rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-8">
          <div className={`hs-form-frame ${FORM}`} data-region="na1" data-form-id="10642b03-8cb9-4e6b-8fee-b000f8ccd434" data-portal-id="49119369" />
        </div>
      </div>
    </section>
  )
}
