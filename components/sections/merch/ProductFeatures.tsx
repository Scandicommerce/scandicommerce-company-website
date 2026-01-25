'use client'

import { HiCheckBadge } from 'react-icons/hi2'

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

export default function ProductFeatures({ productFeatures }: ProductFeaturesProps) {
  const features = productFeatures?.features && productFeatures.features.length > 0 
    ? productFeatures.features 
    : defaultFeatures

  return (
    <section className="bg-[#FFFFFF] py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center ${
                  index < features.length - 1
                    ? 'md:border-r md:border-[#E5E5E5] md:pr-8 lg:pr-12'
                    : ''
                }`}
              >
                {/* Icon */}
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#03C1CA] flex items-center justify-center mb-4 lg:mb-6">
                  <HiCheckBadge className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg lg:text-xl font-bold text-[#222222] mb-2">
                  {feature.title || ''}
                </h3>

                {/* Description */}
                <p className="text-sm lg:text-base text-[#666666]">
                  {feature.description || ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
