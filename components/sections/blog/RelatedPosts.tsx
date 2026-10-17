import Image from 'next/image'
import Link from 'next/link'
import { hrefFor } from '@/lib/routes'
import { sanityImg } from '@/lib/sanityImage'
import { ui } from '@/components/integrations/labels'
import { formatPostDate, postLabels } from './labels'

export interface RelatedPost {
  slug: string
  title: string
  category?: string | null
  date?: string | null
  imageUrl?: string | null
  language?: string | null
}

interface RelatedPostsProps {
  posts: RelatedPost[]
  language: string
}

/** "Read next" on the ink-50 band: hairline cards with image, tag, title and mono date. */
export default function RelatedPosts({ posts, language }: RelatedPostsProps) {
  const items = posts.filter((p) => p.slug && p.title)
  if (items.length === 0) return null
  const t = postLabels(language)

  return (
    <section className="border-t border-sc-ink-100 bg-sc-ink-50 py-16 lg:py-20">
      <div className={ui.container}>
        <div className="mb-8 flex flex-col gap-2.5">
          <div className={ui.eyebrow}>{t.readNext}</div>
          <h2 className="m-0 text-[28px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 md:text-[32px]">{t.related}</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => {
            const date = formatPostDate(post.date, language)
            const cross = post.language && post.language !== language
            return (
              <Link
                key={post.slug}
                href={hrefFor({ _type: 'post', slug: post.slug, language: post.language ?? language }, language)}
                data-cross-locale={cross || undefined}
                className="group flex flex-col overflow-hidden rounded-lg border border-sc-ink-100 bg-white no-underline transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] w-full bg-sc-ink-100">
                  {post.imageUrl && (
                    <Image src={sanityImg(post.imageUrl, 800) as string} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  {post.category && (
                    <div>
                      <span className={ui.tag}>{post.category}</span>
                    </div>
                  )}
                  <h3 className="m-0 text-[18px] font-bold leading-[1.3] tracking-[-0.01em] text-sc-ink-900 transition-colors group-hover:text-sc-cyan-600">{post.title}</h3>
                  {date && <div className={`${ui.mono} mt-auto`}>{date}</div>}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
