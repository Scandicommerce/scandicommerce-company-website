import Image from 'next/image'
import Link from 'next/link'
import { IoMdArrowForward } from 'react-icons/io'

interface CaseStudyProps {
  title: string
  category: string
  tags: string[]
  challenge: string
  solution: string
  results: {
    value: string
    label: string
  }[]
  image: string
  imageAlt: string
  imagePosition: 'left' | 'right'
  link?: string
}

export default function CaseStudy({
  title,
  category,
  tags,
  challenge,
  solution,
  results,
  image,
  imageAlt,
  imagePosition,
  link = '#',
}: CaseStudyProps) {
  const isImageLeft = imagePosition === 'left'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8 lg:mb-12">
      <div
        className={`flex flex-col ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
          }`}
      >
        {/* Image Section */}
        <div className="w-full lg:w-1/2 relative h-[300px] lg:h-[560px]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 p-3 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="space-y-[18px]">
            {/* Title, Category and Tags */}
            <div className="flex sm:flex-row flex-col justify-between sm:items-center items-start sm:gap-0 gap-4">
              <div className="sm:order-1 order-2">
                <h3 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#1F1D1D] mb-1">
                  {title}
                </h3>
                <p className="2xl:text-base xl:text-sm text-xs text-[#565454]">
                  {category}
                </p>
              </div>

              {/* Tags positioned top right */}
            </div>
            <div className="flex flex-wrap gap-2 justify-start sm:order-2 order-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="2xl:px-[21px] xl:px-4 px-2 py-0.5 bg-[#F5F5F5] text-[#565454] 2xl:text-sm xl:text-xs text-[10px] font-medium whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Challenge */}
            <div>
              <h4 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-semibold text-[#1F1D1D] uppercase tracking-wide mb-1">
                {category}
              </h4>
              <p className="2xl:text-base xl:text-sm text-xs text-[#565454]">
                {challenge}
              </p>
            </div>

            {/* Solution */}
            <div>
              <h4 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-semibold text-[#1F1D1D] uppercase tracking-wide mb-1">
                Solution
              </h4>
              <p className="2xl:text-base xl:text-sm text-xs text-[#565454]">
                {solution}
              </p>
            </div>

            <div className="border border-[#56545480]"></div>

            {/* Results */}
            <div>
              <h4 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-semibold text-[#1F1D1D] uppercase tracking-wide mb-[18px]">
                Results
              </h4>
              <div className="flex justify-between items-center">
                {results.map((result, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold !leading-[166%] text-[#03C1CA] font-mono tracking-tight">
                      {result.value}
                    </div>
                    <div className="2xl:text-base xl:text-sm sm:text-xs text-[9px] text-[#565454] leading-tight font-sans">
                      {result.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Link */}
            <div className="pt-2">
              <Link
                href={link}
                className="inline-flex items-center text-[#03C1CA] font-semibold 2xl:text-xl xl:text-lg sm:text-base text-sm"
              >
                Read full case study
                <span className="ml-2">
                  <IoMdArrowForward />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
