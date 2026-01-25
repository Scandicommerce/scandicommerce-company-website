'use client'

import Image from 'next/image'

interface ProductDetailsData {
  title?: string
  description?: string
  bulletPoints?: string[]
  imageUrl?: string
}

interface ProductDetailsProps {
  productDetails?: ProductDetailsData
}

const defaultBulletPoints = [
  '80% ringspun cotton, 20% recycled polyester fleece',
  'Medium-heavy fabric (8.0 oz/yd²)',
  'Classic fit with ribbed collar, cuffs, and hem',
  'Double-needle stitching throughout',
  'Subtle embroidered ScandiCommerce logo',
]

export default function ProductDetails({ productDetails }: ProductDetailsProps) {
  const title = productDetails?.title || 'Product Details'
  const description = productDetails?.description || 'Our Classic Crewneck Sweatshirt is built for comfort and designed to last. Made from a premium cotton-polyester blend, it offers the perfect balance of softness and durability.'
  const bulletPoints = productDetails?.bulletPoints && productDetails.bulletPoints.length > 0 
    ? productDetails.bulletPoints 
    : defaultBulletPoints
  const image = productDetails?.imageUrl || '/images/merch/product-lifestyle.png'

  return (
    <section className="bg-white py-0">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[800px] relative">
          <Image
            src={image}
            alt="Product lifestyle"
            fill
            className="object-cover w-full h-full"
          />
        </div>

        <div className="w-full lg:w-1/2 bg-[#F5F5F5] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-20 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-[#222222] mb-4 sm:mb-6">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-[#666666] leading-relaxed mb-6 sm:mb-8">
            {description}
          </p>

          <ul className="space-y-2 sm:space-y-3 list-none">
            {bulletPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 sm:gap-3">
                <span className="text-[#666666] flex-shrink-0">•</span>
                <span className="text-sm sm:text-base text-[#666666]">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
