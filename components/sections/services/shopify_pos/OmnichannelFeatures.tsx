import { CalendarDays, PackageCheck, Store, Users, type LucideIcon } from 'lucide-react'
import { ui } from '@/components/integrations/labels'

interface FeaturesData {
  featuresTitle?: string
  featuresItems?: Array<{
    title: string
    description: string
    icon?: string
  }>
}

interface OmnichannelFeaturesProps {
  features?: FeaturesData
}

/** Sanity icon keys ('inventory', 'collect', 'calendar', 'staff') mapped to Lucide. */
const ICONS: Record<string, LucideIcon> = {
  inventory: PackageCheck,
  collect: Store,
  calendar: CalendarDays,
  staff: Users,
}

/** POS feature grid on the integrations category-card pattern: cyan disc, Lucide icon, hairline card. */
export default function OmnichannelFeatures({ features }: OmnichannelFeaturesProps) {
  const title = features?.featuresTitle
  const items = features?.featuresItems
  if (!title && !items?.length) return null

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} flex flex-col gap-10`}>
        {title && (
          <div className="flex max-w-[680px] flex-col gap-2.5">
            <div className={ui.eyebrow}>Omnichannel</div>
            <h2 className={ui.h2}>{title}</h2>
          </div>
        )}

        {items && items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {items.map((feature, index) => {
              const Icon = ICONS[feature.icon || 'inventory'] ?? PackageCheck
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
