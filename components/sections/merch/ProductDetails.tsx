import Image from 'next/image'
import { ui } from '@/components/integrations/labels'

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

/** Details as readable copy beside the lifestyle photo in a hairline frame, like the about story. */
export default function ProductDetails({ productDetails }: ProductDetailsProps) {
  const title = productDetails?.title || 'Product Details'
  const description = productDetails?.description || 'Our Classic Crewneck Sweatshirt is built for comfort and designed to last. Made from a premium cotton-polyester blend, it offers the perfect balance of softness and durability.'
  const bulletPoints = productDetails?.bulletPoints && productDetails.bulletPoints.length > 0
    ? productDetails.bulletPoints
    : defaultBulletPoints
  const image = productDetails?.imageUrl || '/images/merch/product-lifestyle.png'

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className={`${ui.container} grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-sc-ink-100 bg-sc-ink-50">
          <Image src={image} alt="Product lifestyle" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 540px" />
        </div>

        <div>
          <div className={`${ui.eyebrow} mb-4`}>Details</div>
          <h2 className={`${ui.h2} mb-6`}>{title}</h2>
          <p className="m-0 text-base leading-relaxed text-sc-ink-600 lg:text-[17px]">{description}</p>

          <ul className="m-0 mt-6 flex list-none flex-col gap-2.5 p-0">
            {bulletPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-[15px] leading-relaxed text-sc-ink-600">
                <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sc-cyan-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
