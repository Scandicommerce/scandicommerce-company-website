import Image from 'next/image'
import Link from 'next/link'
import { articleHref } from '@/lib/routes'
import { RelatedArticle } from '@/lib/articles'
import { ui } from '@/components/integrations/labels'

interface RelatedArticlesProps {
  articles: RelatedArticle[]
  /** Current locale (e.g. "en", "no") so links work on /blogg/... and /en/blog/... */
  lang?: string
}

const T: Record<string, { eyebrow: string; heading: string; read: string }> = {
  no: { eyebrow: 'Les videre', heading: 'Relaterte artikler', read: 'lesing' },
  en: { eyebrow: 'Read next', heading: 'Related articles', read: 'read' },
}

/** Related posts on the ink-50 band, the same cards as the blog deck. */
export default function RelatedArticles({ articles, lang = 'no' }: RelatedArticlesProps) {
  const items = (articles ?? []).filter((a) => a.slug && a.title)
  if (items.length === 0) return null
  const t = T[lang] ?? T.en

  return (
    <section className="border-t border-sc-ink-100 bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <div className="mb-8 flex flex-col gap-2.5">
          <div className={ui.eyebrow}>{t.eyebrow}</div>
          <h2 className="m-0 text-[28px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 md:text-[32px]">{t.heading}</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => {
            const readTime = article.readTime ? (article.readTime.includes(t.read) ? article.readTime : `${article.readTime} ${t.read}`) : ''
            return (
              <Link key={article.slug} href={articleHref(article.slug, lang)} className="group flex flex-col overflow-hidden rounded-lg border border-sc-ink-100 bg-white no-underline transition-transform hover:-translate-y-1">
                <div className="relative aspect-[4/3] w-full bg-sc-ink-100">
                  {article.image && (
                    <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  {article.category && (
                    <div>
                      <span className={ui.tag}>{article.category}</span>
                    </div>
                  )}
                  <h3 className="m-0 text-[18px] font-bold leading-[1.3] tracking-[-0.01em] text-sc-ink-900 transition-colors group-hover:text-sc-cyan-600">{article.title}</h3>
                  {readTime && <div className={`${ui.mono} mt-auto`}>{readTime}</div>}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
