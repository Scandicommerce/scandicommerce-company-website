import { ui } from '@/components/integrations/labels'
import { Bullet } from '@/components/sections/shopify/shopify_x_PIM/IntegratingPIM'

interface Step {
  title?: string
  description?: string
  subSteps?: string[]
}

interface HowToGetStartedData {
  title?: string
  steps?: Step[]
}

const DEFAULT_STEPS: Record<'no' | 'en', Step[]> = {
  en: [
    {
      title: 'Get access to our quick checkout by doing the following:',
      subSteps: ['Log in to the Vipps Portal at portal.vipps.no', 'Find "Order solutions" and "online payment"', 'Submit an application for a new product "Vipps Checkout" or "Vipps integrated payment"', 'Choose Scandicommerce as provider and price package Small'],
    },
    {
      title: 'Order the quick checkout in the form below',
      description: 'You will receive an installation link for your Shopify store when the application for your new product is ready from Vipps.',
    },
  ],
  no: [
    {
      title: 'Få tilgang til hurtigkassen slik:',
      subSteps: ['Logg inn i Vipps-portalen på portal.vipps.no', 'Finn «Bestill løsninger» og «betaling på nett»', 'Send søknad om nytt produkt «Vipps Checkout» eller «Vipps integrert betaling»', 'Velg Scandicommerce som leverandør og prispakke Small'],
    },
    {
      title: 'Bestill hurtigkassen i skjemaet under',
      description: 'Du får en installasjonslenke til Shopify-butikken din når søknaden om det nye produktet er godkjent av Vipps.',
    },
  ],
}

/** Two numbered steps over a hairline, sub-steps as cyan-dot bullets. */
export default function HowToGetStarted({ howToGetStarted, lang = 'no' }: { howToGetStarted?: HowToGetStartedData; lang?: string }) {
  const isNo = lang === 'no'
  const title = howToGetStarted?.title || (isNo ? 'Slik kommer du i gang' : 'How to get started')
  const steps = howToGetStarted?.steps && howToGetStarted.steps.length > 0 ? howToGetStarted.steps : DEFAULT_STEPS[isNo ? 'no' : 'en']
  const cols = steps.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'

  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{isNo ? 'Kom i gang' : 'Getting started'}</div>
          <h2 className={ui.h2}>{title}</h2>
        </div>
        <ol className={`m-0 grid list-none grid-cols-1 gap-6 p-0 ${cols} lg:gap-8`}>
          {steps.map((step, i) => {
            const subSteps = (step.subSteps ?? []).filter(Boolean)
            return (
              <li key={i} className="flex flex-col gap-3 border-t border-sc-ink-900 pt-5">
                <span className={ui.mono}>{String(i + 1).padStart(2, '0')}</span>
                {step.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{step.title}</h3>}
                {step.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{step.description}</p>}
                {subSteps.length > 0 && (
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {subSteps.map((s, j) => (
                      <Bullet key={j}>{s}</Bullet>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
