import { Coins, Package, TrendingUp, type LucideIcon } from 'lucide-react'
import { ui } from '@/components/integrations/labels'

interface Feature {
  icon?: string
  title?: string
  description?: string
}

interface WhyDifferentData {
  title?: string
  subtitle?: string
  features?: Feature[]
}

const ICONS: Record<string, LucideIcon> = { pricing: Coins, product: Package, results: TrendingUp }

/** Three reasons on the integrations card: cyan disc, Lucide icon, hairline card. */
export default function WhyDifferent({ whyDifferent }: { whyDifferent?: WhyDifferentData }) {
  const features = (whyDifferent?.features ?? []).filter((f) => f?.title)
  if (!whyDifferent?.title && features.length === 0) return null
  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2.5">
            <div className={ui.eyebrow}>Hvorfor oss</div>
            {whyDifferent?.title && <h2 className={ui.h2}>{whyDifferent.title}</h2>}
          </div>
          {whyDifferent?.subtitle && <p className="m-0 max-w-[520px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{whyDifferent.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon ?? ''] ?? Coins
            return (
              <div key={i} className={ui.card}>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sc-cyan-500 text-white">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="m-0 text-[20px] font-bold leading-snug tracking-[-0.01em] text-sc-ink-900">{f.title}</h3>
                {f.description && <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{f.description}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
