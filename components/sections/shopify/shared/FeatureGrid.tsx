import { BadgeCheck } from 'lucide-react'
import { ui } from '@/components/integrations/labels'
import { SHOPIFY_T, shopifyLang } from './labels'

interface Feature {
  title?: string
  description?: string
  highlight?: string
}

export interface FeatureGridData {
  title?: string
  features?: Feature[]
}

interface FeatureGridProps {
  data?: FeatureGridData
  lang?: string
  eyebrow?: string
  id?: string
}

/**
 * "Shopify empires" / "Omnichannel features": the WhyShopifyWins card grid,
 * three to a row, with the Sanity highlight as a cyan tag.
 */
export default function FeatureGrid({ data, lang, eyebrow, id }: FeatureGridProps) {
  const t = SHOPIFY_T[shopifyLang(lang)]
  const features = (data?.features ?? []).filter((f) => f?.title || f?.description)
  if (!data?.title && features.length === 0) return null

  return (
    <section id={id} className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <div className={ui.eyebrow}>{eyebrow ?? t.featuresEyebrow}</div>
          {data?.title && <h2 className={ui.h2}>{data.title}</h2>}
        </div>

        {features.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {features.map((feature, index) => (
              <div key={index} className={ui.card}>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sc-cyan-500 text-white">
                  <BadgeCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                {feature.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{feature.title}</h3>}
                {feature.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{feature.description}</p>}
                {feature.highlight && (
                  <div className="mt-auto pt-1">
                    <span className={ui.tag}>{feature.highlight}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
