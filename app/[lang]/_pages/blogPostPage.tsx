import HeaderWrapper from '@/components/layout/HeaderWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import ArticleHero from '@/components/sections/resources/article/ArticleHero'
import ArticleContent from '@/components/sections/resources/article/ArticleContent'
import AuthorBio from '@/components/sections/resources/article/AuthorBio'
import ArticleCTA from '@/components/sections/resources/article/ArticleCTA'
import RelatedArticles from '@/components/sections/resources/article/RelatedArticles'
import { client } from '@/sanity/lib/client'
import { blogPostBySlugQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import type { Article } from '@/lib/articles'
import { getLanguageFromParams } from '@/lib/language'
import { notFound } from 'next/navigation'

interface SanityBlogPost {
  slug?: string | null
  title?: string | null
  titleHighlight?: string | null
  description?: string | null
  category?: string | null
  date?: string | null
  readTime?: string | null
  image?: string | null
  featuredImage?: string | null
  author?: { name?: string | null; role?: string | null; image?: string | null; slug?: string | null } | null
  tableOfContents?: Array<{ id?: string | null; title?: string | null; number?: number | null }> | null
  introduction?: string | null
  sections?: Array<{
    id?: string | null
    title?: string | null
    content?: string | null
    proTip?: { title?: string | null; content?: string | null } | null
    apps?: Array<{ name?: string | null; category?: string | null; description?: string | null; features?: (string | null)[] | null }> | null
  }> | null
  relatedArticles?: Array<{ slug?: string | null; title?: string | null; category?: string | null; readTime?: string | null; image?: string | null }> | null
}

function mapSanityPostToArticle(post: SanityBlogPost | null): Article | null {
  if (!post) return null
  return {
    id: 0,
    slug: post.slug ?? '',
    title: post.title ?? '',
    titleHighlight: post.titleHighlight ?? '',
    description: post.description ?? '',
    category: post.category ?? '',
    date: post.date ?? '',
    readTime: post.readTime ?? '',
    image: post.image ?? '',
    featuredImage: post.featuredImage ?? post.image ?? '',
    author: {
      name: post.author?.name ?? '',
      role: post.author?.role ?? '',
      image: post.author?.image ?? '',
      slug: post.author?.slug ?? '',
    },
    tableOfContents: (post.tableOfContents ?? []).map((item) => ({
      id: item.id ?? '',
      title: item.title ?? '',
      number: item.number ?? 0,
    })),
    introduction: post.introduction ?? '',
    sections: (post.sections ?? []).map((s) => ({
      id: s.id ?? '',
      title: s.title ?? '',
      content: s.content ?? '',
      proTip: s.proTip ? { title: s.proTip.title ?? 'Pro Tip', content: s.proTip.content ?? '' } : undefined,
      apps: s.apps?.map((a) => ({
        name: a.name ?? '',
        category: a.category ?? '',
        description: a.description ?? '',
        features: (a.features ?? []).filter(Boolean) as string[],
      })),
    })),
    relatedArticles: (post.relatedArticles ?? []).map((r) => ({
      slug: r.slug ?? '',
      title: r.title ?? '',
      category: r.category ?? '',
      readTime: r.readTime ?? '',
      image: r.image ?? '',
    })),
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string; slug?: string }> }) {
  const { lang, slug } = await params
  if (!slug) notFound()
  getLanguageFromParams({ lang })

  const post = await client.fetch<SanityBlogPost | null>(
    blogPostBySlugQuery,
    getQueryParams({ slug }, lang),
    { next: { revalidate: 0 } }
  )
  const article = mapSanityPostToArticle(post)
  if (!article) notFound()

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow">
        <ArticleHero article={article} />
        <ArticleContent article={article} />
        <AuthorBio author={article.author} />
        <ArticleCTA />
        <RelatedArticles articles={article.relatedArticles} lang={lang} />
      </main>
      <FooterWrapper />
    </div>
  )
}
