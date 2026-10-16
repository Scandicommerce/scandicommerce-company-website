import { Activity, BarChart3, ShieldCheck, ShoppingCart, type LucideIcon } from 'lucide-react'
import { ui } from '@/components/integrations/labels'

interface WhyShopifyData {
  whyShopifyEyebrow?: string
  whyShopifyTitle?: string
  whyShopifySubtitle?: string
  whyShopifyFeatures?: Array<{
    title: string
    description: string
    icon?: string
  }>
}

interface WhyShopifyWinsProps {
  whyShopify?: WhyShopifyData
}

const ICONS: Record<string, LucideIcon> = {
  cart: ShoppingCart,
  chart: BarChart3,
  uptime: Activity,
  shield: ShieldCheck,
}

/** Feature grid on the integrations category-card pattern: cyan disc, Lucide icon, hairline card. */
export default function WhyShopifyWins({ whyShopify }: WhyShopifyWinsProps) {
  const title = whyShopify?.whyShopifyTitle
  const subtitle = whyShopify?.whyShopifySubtitle
  const features = whyShopify?.whyShopifyFeatures

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        {(title || subtitle) && (
          <div className="flex max-w-[680px] flex-col gap-2.5">
            <div className={ui.eyebrow}>{whyShopify?.whyShopifyEyebrow || 'Hva du får'}</div>
            {title && <h2 className={ui.h2}>{title}</h2>}
            {subtitle && <p className="m-0 text-lg leading-relaxed text-sc-ink-600">{subtitle}</p>}
          </div>
        )}

        {features && features.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {features.map((feature, index) => {
              const Icon = ICONS[feature.icon || 'cart'] ?? ShoppingCart
              return (
                <div key={index} className={ui.card}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sc-cyan-500 text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  {feature.title && <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{feature.title}</h3>}
                  {feature.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{feature.description}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
