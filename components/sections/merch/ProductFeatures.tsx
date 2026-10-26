import { BadgeCheck } from 'lucide-react'
import { ui } from '@/components/integrations/labels'

interface Feature {
  title?: string
  description?: string
}

interface ProductFeaturesData {
  features?: Feature[]
}

interface ProductFeaturesProps {
  productFeatures?: ProductFeaturesData
}

const defaultFeatures: Feature[] = [
  {
    title: 'Premium Fabric',
    description: '80% cotton, 20% recycled polyester blend',
  },
  {
    title: 'Comfort Fit',
    description: 'Relaxed unisex sizing for all-day wear',
  },
  {
    title: 'Designed in Norway',
    description: 'Authentic Scandinavian aesthetic',
  },
]

/** Three product facts on the integrations card: cyan disc, Lucide icon, hairline card. */
export default function ProductFeatures({ productFeatures }: ProductFeaturesProps) {
  const features = productFeatures?.features && productFeatures.features.length > 0
    ? productFeatures.features
    : defaultFeatures

  return (
    <section className="bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
          {features.map((feature, index) => (
            <div key={index} className={ui.card}>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sc-cyan-500 text-white">
                <BadgeCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="m-0 text-lg font-semibold leading-snug text-sc-ink-900">{feature.title || ''}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-sc-ink-600">{feature.description || ''}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
