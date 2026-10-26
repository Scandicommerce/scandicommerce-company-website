import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import { PostHero, PostBody, PostAuthorBio, RelatedPosts, prepareContent, firstParagraphText, postLabels, readingMinutes } from '@/components/sections/blog'
import type { RelatedPost } from '@/components/sections/blog/RelatedPosts'
import { CtaBand } from '@/components/integrations/LinkBlocks'
import { getPostBySlugCached } from '@/lib/sanity/cachedDocuments'
import { estimateWordCountFromPostContent, type Post } from '@/lib/blogBuilder'
import { getLanguageFromParams } from '@/lib/language'
import { contactHref } from '@/lib/routes'
import { normalizePageSections } from '@/lib/sanity/pageBuilderLegacy'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { blogPageQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { notFound } from 'next/navigation'

interface GridArticle {
  _type?: string
  title?: string
  category?: string
  date?: string
  imageUrl?: string
  slug?: string
}

/**
 * Three posts to read next, from the blog index's article list: the same
 * language, the same primary tag first, newest first within that.
 */
async function relatedPosts(post: Post, language: string): Promise<RelatedPost[]> {
  const page = await sanityPageFetch(blogPageQuery, getQueryParams({}, language), { next: { revalidate: 0 } }).catch(() => null)
  const grid = normalizePageSections('blogPage', page).find((s) => s._type === 'blogPageArticlesGridSection') as { articles?: GridArticle[] } | undefined
  const tags = (post.tags ?? []).filter((t) => t?.label)
  const primary = (tags.find((t) => t?.isPrimary) ?? tags[0])?.label ?? null

  const seen = new Set<string>([post.slug])
  const candidates: RelatedPost[] = []
  for (const a of grid?.articles ?? []) {
    if (a._type !== 'post' || !a.slug || !a.title || seen.has(a.slug)) continue
    seen.add(a.slug)
    candidates.push({ slug: a.slug, title: a.title, category: a.category, date: a.date, imageUrl: a.imageUrl })
  }
  const sameTag = primary ? candidates.filter((c) => c.category === primary) : []
  const rest = candidates.filter((c) => !sameTag.includes(c))
  return [...sameTag, ...rest].slice(0, 3)
}

export default async function PostPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang, slug } = await params
  if (!slug) notFound()
  const language = getLanguageFromParams({ lang })

  const post = (await getPostBySlugCached(slug, language)) as Post | null
  if (!post) notFound()

  const t = postLabels(language)
  const { blocks, outline } = prepareContent(post.content)
  const minutes = readingMinutes(estimateWordCountFromPostContent(post))
  const excerpt = post.excerpt?.trim() ?? ''
  const lead = excerpt && excerpt !== firstParagraphText(blocks) ? excerpt : null
  const related = await relatedPosts(post, language)

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-white">
        <PostHero post={post} language={language} minutes={minutes} lead={lead} />
        <PostBody blocks={blocks} outline={outline} language={language} image={post.image} imageAlt={post.title} />
        <PostAuthorBio author={post.author} language={language} />
        <RelatedPosts posts={related} language={language} />
        <CtaBand heading={t.ctaHeading} text={t.ctaText} buttonLabel={t.ctaButton} buttonHref={contactHref(language)} />
      </main>
      <FooterWrapper />
    </div>
  )
}
