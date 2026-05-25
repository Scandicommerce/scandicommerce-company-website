import Link from 'next/link'

interface Article {
  id?: number
  title: string
  description: string
  category: string
  date: string
  readTime: string
  image: string
  slug: string
}

export interface LogRowProps {
  article: Article
  idx: number
  variant?: 'large' | 'default' | 'compact'
  lang?: string
}

export default function ArticleCard({ article, idx, variant = 'default', lang }: LogRowProps) {
  const locale = lang || 'en'
  const href = article.slug ? `/${locale}/resources/${article.slug}` : '#'
  const num = String(idx).padStart(2, '0')
  const category = article.category?.toUpperCase() || ''

  if (variant === 'large') {
    return (
      <>
        {/* Desktop: 12-col grid row */}
        <Link
          href={href}
          className="hidden md:grid grid-cols-12 gap-6 py-7 border-b border-neutral-200 group"
        >
          <div className="col-span-1 font-mono text-xs text-neutral-400 pt-1 select-none">{num}</div>
          <div className="col-span-2 font-mono text-xs text-neutral-500 pt-1">{article.date}</div>
          <div className="col-span-7">
            {category && (
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#11848C] mb-2">
                {category}
              </div>
            )}
            <h3
              className="font-bold mb-2 text-[#1F1D1D] group-hover:text-teal transition-colors duration-200"
              style={{ fontSize: 22, lineHeight: 1.3, letterSpacing: '-0.005em' }}
            >
              {article.title}
            </h3>
            {article.description && (
              <p className="text-sm text-neutral-600 leading-relaxed line-clamp-1">{article.description}</p>
            )}
          </div>
          <div className="col-span-2 text-right font-mono text-xs text-neutral-400 pt-1.5">{article.readTime}</div>
        </Link>

        {/* Mobile: stacked card */}
        <Link href={href} className="md:hidden flex flex-col py-5 border-b border-neutral-200 group gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-400 select-none">{num}</span>
            {article.readTime && <span className="font-mono text-[10px] text-neutral-400">{article.readTime}</span>}
          </div>
          {category && (
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#11848C]">{category}</div>
          )}
          <h3 className="font-bold text-[#1F1D1D] group-hover:text-teal transition-colors duration-200 text-lg leading-snug">
            {article.title}
          </h3>
          <span className="font-mono text-xs text-neutral-500">{article.date}</span>
        </Link>
      </>
    )
  }

  if (variant === 'compact') {
    return (
      <>
        {/* Desktop */}
        <Link
          href={href}
          className="hidden md:grid grid-cols-12 gap-6 py-4 border-b border-neutral-200 group items-baseline"
        >
          <div className="col-span-1 font-mono text-xs text-neutral-400 select-none">{num}</div>
          <div className="col-span-2 font-mono text-xs text-neutral-500">{article.date}</div>
          <div className="col-span-7 flex items-baseline gap-4">
            {category && (
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#11848C] flex-shrink-0 w-24">
                {category}
              </span>
            )}
            <h3
              className="font-semibold leading-snug text-[#1F1D1D] group-hover:text-teal transition-colors duration-200 text-base"
            >
              {article.title}
            </h3>
          </div>
          <div className="col-span-2 text-right font-mono text-xs text-neutral-400">{article.readTime}</div>
        </Link>

        {/* Mobile */}
        <Link href={href} className="md:hidden flex flex-col py-4 border-b border-neutral-200 group gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-400 select-none">{num}</span>
            {article.readTime && <span className="font-mono text-[10px] text-neutral-400">{article.readTime}</span>}
          </div>
          {category && (
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#11848C]">{category}</div>
          )}
          <h3 className="font-semibold text-[#1F1D1D] group-hover:text-teal transition-colors duration-200 text-sm leading-snug">
            {article.title}
          </h3>
          <span className="font-mono text-[10px] text-neutral-500">{article.date}</span>
        </Link>
      </>
    )
  }

  // Default
  return (
    <>
      {/* Desktop */}
      <Link
        href={href}
        className="hidden md:grid grid-cols-12 gap-6 py-6 border-b border-neutral-200 group"
      >
        <div className="col-span-1 font-mono text-xs text-neutral-400 pt-1 select-none">{num}</div>
        <div className="col-span-2 font-mono text-xs text-neutral-500 pt-1">{article.date}</div>
        <div className="col-span-7">
          {category && (
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#11848C] mb-1.5">
              {category}
            </div>
          )}
          <h3
            className="font-bold mb-1.5 text-[#1F1D1D] group-hover:text-teal transition-colors duration-200"
            style={{ fontSize: 18, lineHeight: 1.35, letterSpacing: '-0.005em' }}
          >
            {article.title}
          </h3>
          {article.description && (
            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-1">{article.description}</p>
          )}
        </div>
        <div className="col-span-2 text-right font-mono text-xs text-neutral-400 pt-1.5">{article.readTime}</div>
      </Link>

      {/* Mobile */}
      <Link href={href} className="md:hidden flex flex-col py-5 border-b border-neutral-200 group gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-neutral-400 select-none">{num}</span>
          {article.readTime && <span className="font-mono text-[10px] text-neutral-400">{article.readTime}</span>}
        </div>
        {category && (
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#11848C]">{category}</div>
        )}
        <h3 className="font-bold text-[#1F1D1D] group-hover:text-teal transition-colors duration-200 text-base leading-snug">
          {article.title}
        </h3>
        <span className="font-mono text-xs text-neutral-500">{article.date}</span>
      </Link>
    </>
  )
}
