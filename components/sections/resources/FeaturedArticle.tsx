import Image from 'next/image'
import Link from 'next/link'
import { HiCalendar, HiClock } from 'react-icons/hi2'

interface TagData {
  label?: string
  isPrimary?: boolean
}

interface FeaturedArticleData {
  articleSlug?: string
  imageUrl?: string
  tags?: TagData[]
  title?: string
  description?: string
  date?: string
  readTime?: string
  link?: string
  buttonText?: string
}

interface FeaturedArticleProps {
  featuredArticle?: FeaturedArticleData
  /** Current locale (e.g. "en", "no") so links work on /no/resources/blog etc. */
  lang?: string
}

function formatArticleDate(d: string | undefined): string {
  if (!d) return 'Jan 15, 2025'
  if (d.includes('T')) {
    try {
      return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return d
    }
  }
  return d
}

export default function FeaturedArticle({ featuredArticle, lang }: FeaturedArticleProps) {
  const imageUrl = featuredArticle?.imageUrl || '/images/resources/featured_article/banner.png'
  const tags = (featuredArticle?.tags || []).filter((tag) => Boolean(tag?.label))
  const title = featuredArticle?.title || '10 Essential Shopify Apps for Norwegian E-commerce in 2025'
  const description = featuredArticle?.description || 'Discover the must-have apps that will transform your Norwegian Shopify store and boost conversions.'
  const date = formatArticleDate(featuredArticle?.date) || 'Jan 15, 2025'
  const readTime = featuredArticle?.readTime || '8 min read'
  const articleSlug = featuredArticle?.articleSlug?.trim()
  const locale = lang || 'en'
  const slugFromLink = (raw: string) => {
    try {
      if (raw.startsWith('http://') || raw.startsWith('https://')) {
        const path = new URL(raw).pathname
        const match = path.match(/\/resources\/([^/]+)/) || path.match(/\/([^/]+)$/)
        return match ? match[1] : null
      }
      const path = raw.startsWith('/') ? raw : `/${raw}`
      const match = path.match(/\/resources\/([^/]+)/) || path.match(/\/([^/]+)$/)
      return match ? match[1] : null
    } catch {
      return null
    }
  }
  const slug = articleSlug || (featuredArticle?.link ? slugFromLink(featuredArticle.link) : null) || '10-essential-shopify-apps-norwegian-ecommerce-2025'
  const link = `/${locale}/resources/${slug}`
  const buttonText = featuredArticle?.buttonText || 'Read Article'

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center shadow-lg">
          {/* Left Column - Laptop Image */}
          <div className="relative w-full h-[400px] lg:h-[450px] xl:h-[560px]">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right Column - Blog Post Card */}
          <div className="bg-white p-6 lg:p-8 border border-[#5654544D] h-full w-full flex flex-col justify-center items-start gap-10">
            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm font-medium ${
                      tag.isPrimary
                        ? 'bg-[#03C1CA] text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col justify-start items-start gap-7 sm:gap-[42px]">
              <div className="flex flex-col justify-start items-start gap-5 sm:gap-[30px]">
                {/* Headline */}
                <h2 className="text-lg sm:text-xl xl:text-2xl 2xl:text-[32px] font-bold text-[#1F1D1D]">
                  {title}
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-sm xl:text-sm 2xl:text-base text-[#565454] leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="flex flex-col justify-start items-start gap-4 sm:gap-[33px]">
                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-[#565454]">
                  <div className="flex items-center gap-2">
                    <HiCalendar className="w-4 h-4" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiClock className="w-4 h-4" />
                    <span>{readTime}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={link}
                  className="inline-block bg-black text-base text-white px-6 py-3 lg:px-8 lg:py-4 font-semibold hover:bg-gray-800 transition-colors"
                >
                  {buttonText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
