import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/lib/articles'
import { authorHref, blogIndexHref } from '@/lib/routes'
import { ui } from '@/components/integrations/labels'

interface ArticleHeroProps {
  article: Article
  /** Free-form tags from Sanity (the article type itself carries only the category). */
  tags?: string[]
  lang?: string
}

const T: Record<string, { index: string; read: string; by: string }> = {
  no: { index: 'Blogg', read: 'lesing', by: 'Av' },
  en: { index: 'Blog', read: 'read', by: 'By' },
}

function renderTitle(title: string, highlight?: string) {
  if (!highlight || !title.includes(highlight)) return title
  const [before, ...rest] = title.split(highlight)
  return (
    <>
      {before}
      <span className="text-sc-cyan-500">{highlight}</span>
      {rest.join(highlight)}
    </>
  )
}

/**
 * Article header on the case-study hero: breadcrumb, category and tags,
 * title with the highlighted phrase in cyan, lead, then author, date and
 * reading time in one row.
 */
export default function ArticleHero({ article, tags = [], lang = 'no' }: ArticleHeroProps) {
  const t = T[lang] ?? T.en
  const extraTags = tags.filter((tag) => tag && tag !== article.category)
  const readTime = article.readTime ? (article.readTime.includes(t.read) ? article.readTime : `${article.readTime} ${t.read}`) : ''
  const authorLink = article.author.slug ? authorHref(article.author.slug, lang) : undefined

  return (
    <section className="bg-white">
      <div className={`${ui.container} pt-8`}>
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[13px] text-sc-ink-400">
          <Link href={blogIndexHref(lang)} className="text-sc-ink-600 transition-colors hover:text-sc-ink-900">
            {t.index}
          </Link>
          {article.category && (
            <>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-sc-ink-900">{article.category}</span>
            </>
          )}
        </nav>
      </div>

      <div className={`${ui.container} pb-10 pt-8 lg:pb-12 lg:pt-10`}>
        <div className="flex max-w-[820px] flex-col gap-5">
          {(article.category || extraTags.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {article.category && <span className={ui.tag}>{article.category}</span>}
              {extraTags.map((tag) => (
                <span key={tag} className={ui.tagOutline}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="m-0 text-balance text-[32px] font-bold leading-[1.06] tracking-[-0.025em] text-sc-ink-900 md:text-[52px]">{renderTitle(article.title, article.titleHighlight)}</h1>

          {article.description && <p className="m-0 max-w-[640px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{article.description}</p>}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-sc-ink-100 pt-5">
            {article.author.name && (
              <div className="flex items-center gap-3">
                {article.author.image ? (
                  <Image src={article.author.image} alt={article.author.name} width={40} height={40} className="h-10 w-10 flex-shrink-0 rounded-full border border-sc-ink-100 object-cover" />
                ) : (
                  <span aria-hidden="true" className="h-10 w-10 flex-shrink-0 rounded-full border border-sc-ink-100 bg-sc-ink-50" />
                )}
                <div className="flex flex-col gap-0.5">
                  {authorLink ? (
                    <Link href={authorLink} className="text-sm font-semibold text-sc-ink-900 no-underline transition-colors hover:text-sc-cyan-600">
                      {article.author.name}
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-sc-ink-900">{article.author.name}</span>
                  )}
                  {article.author.role && <span className="text-[13px] text-sc-ink-500">{article.author.role}</span>}
                </div>
              </div>
            )}
            {(article.date || readTime) && (
              <div className={`${ui.mono} flex flex-wrap gap-x-2`}>
                {article.date && <span>{article.date}</span>}
                {article.date && readTime && <span aria-hidden="true">·</span>}
                {readTime && <span>{readTime}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
