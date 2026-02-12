import Image from 'next/image'
import Link from 'next/link'
import { GoCalendar } from 'react-icons/go'
import { LuClock4 } from 'react-icons/lu'

interface Article {
  id: number
  title: string
  description: string
  category: string
  date: string
  readTime: string
  image: string
  slug: string
}

interface ArticleCardProps {
  article: Article
  /** Current locale (e.g. "en", "no") so links work on /no/resources/blog etc. */
  lang?: string
}

export default function ArticleCard({ article, lang }: ArticleCardProps) {
  const href = lang ? `/${lang}/resources/${article.slug}` : `/resources/${article.slug}`
  return (
    <Link
      href={href}
      className="bg-white overflow-hidden"
    >
      {/* Article Image */}
      <div className="relative w-full h-[350px] sm:h-[400px] lg:h-[500px] xl:h-[650px]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Article Content */}
      <div className="p-6 border border-[#565454] h-[300px] flex flex-col justify-center items-start">
        {/* Category Tag & Read Time */}
        <div className="flex items-center justify-start gap-9 mb-5">
          <span className="px-5 py-1 bg-[#1F1D1D33] text-[#565454] text-xs sm:text-sm font-medium">
            {article.category}
          </span>
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#565454]">
            <LuClock4 className="w-5 h-5" />
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-lg lg:text-[15px] xl:text-xl font-bold text-[#1F1D1D] mb-5 line-clamp-2">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-[10px] sm:text-xs lg:text-sm text-[#565454] mb-3 line-clamp-2">
          {article.description}
        </p>

        {/* Publication Date */}
        <div className="flex items-center gap-2 text-sm sm:text-base text-[#565454]">
          <GoCalendar className="w-4 h-4" />
          <span>{article.date}</span>
        </div>
      </div>
    </Link>
  )
}
