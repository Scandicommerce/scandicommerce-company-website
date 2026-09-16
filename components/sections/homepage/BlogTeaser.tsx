import Link from 'next/link'
import { hrefFor, blogIndexHref } from '@/lib/routes'

export interface TeaserPost {
  _id: string
  _type: 'blogPost' | 'post'
  language?: string
  title?: string
  slug?: string
  category?: string
  tag?: string
  publishedAt?: string
  _createdAt?: string
}

interface BlogTeaserData {
  eyebrow?: string
  title?: string
  linkText?: string
  linkHref?: string
  count?: number
}

interface BlogTeaserProps {
  data?: BlogTeaserData
  posts?: TeaserPost[]
  lang?: string
}

const MONTHS_NO = [
  'januar', 'februar', 'mars', 'april', 'mai', 'juni',
  'juli', 'august', 'september', 'oktober', 'november', 'desember',
]

function formatDate(post: TeaserPost, lang?: string): string {
  const raw = post.publishedAt || post._createdAt
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return ''
  if (lang === 'no') return `${d.getDate()}. ${MONTHS_NO[d.getMonth()]} ${d.getFullYear()}`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Article href via the shared route helper (`/blogg|/blog/<slug>`). */
function postHref(post: TeaserPost, lang?: string): string {
  if (!post.slug) return '#'
  return hrefFor({ _type: post._type ?? 'post', slug: post.slug, language: post.language ?? lang ?? 'en' }, lang ?? post.language ?? 'en')
}

/** Homepage "Nyheter og guider" section (2026 design). Posts are fetched
 * automatically (latest for the page language) — editors only manage copy. */
export default function BlogTeaser({ data, posts = [], lang }: BlogTeaserProps) {
  const eyebrow = data?.eyebrow || 'Blogg'
  const title = data?.title || 'Nyheter og guider'
  const linkText = data?.linkText || 'Til bloggen'
  const linkHref = data?.linkHref || blogIndexHref(lang ?? 'no')
  const count = data?.count && data.count > 0 ? data.count : 3
  const visible = posts.slice(0, count)

  if (visible.length === 0) return null

  return (
    <section className="max-w-[1320px] mx-auto px-5 lg:px-8 my-16 lg:my-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-10 lg:gap-16">
        {/* Left: intro */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-500 mb-3">
            {eyebrow}
          </div>
          <h2 className="font-bold text-[26px] lg:text-[40px] leading-tight tracking-tight text-sc-ink-900 mb-4">
            {title}
          </h2>
          <Link
            href={linkHref}
            className="text-sm font-semibold text-sc-ink-900 hover:text-sc-cyan-600 transition-colors"
          >
            {linkText} →
          </Link>
        </div>

        {/* Right: post rows */}
        <div>
          {visible.map((post) => (
            <Link
              key={post._id}
              href={postHref(post, lang)}
              className="group flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 border-t border-sc-ink-100 py-5 px-2 -mx-2 hover:bg-sc-ink-50 transition-colors"
            >
              <span className="text-[13px] text-sc-ink-400 sm:w-[110px] flex-shrink-0">
                {post.tag ? `${post.tag} · ` : ''}
                {formatDate(post, lang)}
              </span>
              <span className="text-[17px] lg:text-[19px] font-semibold text-sc-ink-900 group-hover:text-sc-cyan-600 transition-colors">
                {post.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
