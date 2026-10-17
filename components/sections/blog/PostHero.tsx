import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/lib/blogBuilder'
import { authorHref, blogIndexHref } from '@/lib/routes'
import { sanityImg } from '@/lib/sanityImage'
import { ui } from '@/components/integrations/labels'
import { formatPostDate, postLabels } from './labels'

interface PostHeroProps {
  post: Post
  language: string
  minutes: number
  /** Lead under the title; omitted when it only repeats the first paragraph. */
  lead?: string | null
}

/**
 * Post header on the case-study hero: breadcrumb to the blog and the primary
 * tag, tags, 32/52px title, lead, then author with date and reading time in mono.
 */
export default function PostHero({ post, language, minutes, lead }: PostHeroProps) {
  const t = postLabels(language)
  const tags = (post.tags ?? []).filter((tag): tag is { label: string; isPrimary?: boolean | null } => !!tag?.label)
  const primary = tags.find((tag) => tag.isPrimary) ?? tags[0]
  const others = tags.filter((tag) => tag !== primary)
  const author = post.author
  const authorLink = author?.slug ? authorHref(author.slug, language) : null
  const date = formatPostDate(post.publishedAt, language)

  return (
    <section className="bg-white">
      <div className={`${ui.container} pt-8`}>
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[13px] text-sc-ink-400">
          <Link href={blogIndexHref(language)} className="text-sc-ink-600 transition-colors hover:text-sc-ink-900">
            {t.index}
          </Link>
          {primary && (
            <>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-sc-ink-900">{primary.label}</span>
            </>
          )}
        </nav>
      </div>

      <div className={`${ui.container} pb-10 pt-8 lg:pb-12 lg:pt-10`}>
        <div className="flex max-w-[820px] flex-col gap-5">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {primary && <span className={ui.tag}>{primary.label}</span>}
              {others.map((tag) => (
                <span key={tag.label} className={ui.tagOutline}>
                  {tag.label}
                </span>
              ))}
            </div>
          )}

          <h1 className="m-0 text-balance text-[32px] font-bold leading-[1.06] tracking-[-0.025em] text-sc-ink-900 md:text-[52px]">{post.title}</h1>

          {lead && <p className="m-0 max-w-[640px] text-base leading-relaxed text-sc-ink-600 lg:text-lg">{lead}</p>}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-sc-ink-100 pt-5">
            {author?.name && (
              <div className="flex items-center gap-3">
                {author.image ? (
                  <Image src={sanityImg(author.image, 96) as string} alt={author.name} width={40} height={40} className="h-10 w-10 flex-shrink-0 rounded-full border border-sc-ink-100 object-cover" />
                ) : (
                  <span aria-hidden="true" className="h-10 w-10 flex-shrink-0 rounded-full border border-sc-ink-100 bg-sc-ink-50" />
                )}
                <div className="flex flex-col gap-0.5">
                  {authorLink ? (
                    <Link href={authorLink} className="text-sm font-semibold text-sc-ink-900 no-underline transition-colors hover:text-sc-cyan-600">
                      {author.name}
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-sc-ink-900">{author.name}</span>
                  )}
                  {author.role && <span className="text-[13px] text-sc-ink-500">{author.role}</span>}
                </div>
              </div>
            )}
            <div className={`${ui.mono} flex flex-wrap gap-x-2`}>
              {date && <span>{date}</span>}
              {date && <span aria-hidden="true">·</span>}
              <span>{t.readTime(minutes)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
