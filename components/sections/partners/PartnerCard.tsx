import Image from 'next/image'
import { ReactNode } from 'react'

export interface Partner {
  id: number
  name: string
  category: string
  description: string
  benefits: string[]
  image: string
  logo?: string | ReactNode
}

interface PartnerCardProps {
  partner: Partner
  imageSizes?: string
}

export default function PartnerCard({
  partner,
  imageSizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: PartnerCardProps) {
  return (
    <div className="bg-white overflow-hidden flex flex-col">
      {/* Partner Image */}
      <div className="relative w-full h-[300px] sm:h-[350px] lg:h-[400px]">
        <Image
          src={partner.image}
          alt={partner.name}
          fill
          className="object-cover"
          sizes={imageSizes}
        />

        {partner.logo && (
          <div className="z-5 absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-3/4 aspect-[9/2] flex items-center justify-center px-4">
            {typeof partner.logo === 'string' ? (
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                fill
                className="object-contain"
              />
            ) : (
              partner.logo
            )}
          </div>
        )}
      </div>

      <div className="p-6 border border-[#565454] flex-grow flex flex-col justify-center h-[300px]">
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap w-full">
          <h3 className="text-xl lg:text-2xl font-bold text-[#03C1CA]">
            {partner.name}
          </h3>
          <span className="px-5 py-1 bg-[#1F1D1D33] text-[#565454] text-xs sm:text-sm">
            {partner.category}
          </span>
        </div>

        <p className="text-xs lg:text-sm text-[#565454] mb-6 leading-relaxed">
          {partner.description}
        </p>

        <div>
          <h4 className="text-sm lg:text-base font-semibold text-[#1F1D1D] mb-3">
            Key benefits:
          </h4>
          <ul>
            {partner.benefits.map((benefit, index) => (
              <li
                key={index}
                className="text-xs lg:text-sm text-[#565454] flex items-center leading-[100%]"
              >
                <span className="mr-2 text-[#565454] text-xl leading-[100%]">
                  •
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
