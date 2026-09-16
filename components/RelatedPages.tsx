import Link from 'next/link'
import { headers } from 'next/headers'
import { groq } from 'next-sanity'
import { sanityPageFetch } from '@/sanity/lib/fetch'
import { resolvePageByPath } from '@/lib/resolvePageByPath'
import { toSanityLanguageId } from '@/lib/language'
import { getPathWithoutLang } from '@/sanity/lib/languages'
import { hrefFor, trimSlashes } from '@/lib/routes'
import { BLOG_INDEX_SLUG, WORK_INDEX_SLUG } from '@/lib/routes'
import type { Language } from '@/lib/site-config'

/**
 * "Read next" block rendered above the footer on every content page
 * (SITE-SEO-ARCHITECTURE §8). Uses the editor-curated `relatedPages`
 * references; when a document has fewer than three, fills up with the most
 * recent articles in the same language and the packages page so no indexable
 * page is left with fewer than three outbound internal links.
 *
 * Skipped on the homepage, on merch and on the template pages (which render
 * their own cluster blocks).
 */

const SKIP_TYPES = new Set(['pillarPage', 'integrationPage', 'migrationPage', 'merchPage', 'merchProduct'])

interface LinkDoc {
  _id: string
  _type: string
  language?: string | null
  slug?: string | null
  title?: string | null
  excerpt?: string | null
}

const relatedQuery = groq`
  *[_type == $type && lower(slug.current) in $slugs && (language == $language || !defined(language))][0]{
    _id,
    "related": relatedPages[]->{ _id, _type, language, "slug": slug.current, "title": coalesce(pageTitle, title, name), "excerpt": coalesce(seoExtended.metaDescription, excerpt, description) }
  }
`
const fallbackQuery = groq`
  *[_type in ["post", "blogPost"] && language == $language && defined(slug.current) && !(_id in $exclude)]
    | order(coalesce(publishedAt, _createdAt) desc)[0...4]{ _id, _type, language, "slug": slug.current, "title": title, "excerpt": coalesce(seoExtended.metaDescription, excerpt, description) }
`
const packagesQuery = groq`
  *[_type == "allPackagesPage" && language == $language][0]{ _id, _type, language, "slug": slug.current, "title": pageTitle, "excerpt": seoExtended.metaDescription }
`

const T: Record<string, string> = { no: 'Les også', en: 'Read next', sv: 'Läs också', da: 'Læs også', de: 'Weiterlesen' }

export default async function RelatedPages() {
  const h = await headers()
  const language = toSanityLanguageId(h.get('x-locale') ?? 'en') as Language
  const pathWithoutLang = trimSlashes(getPathWithoutLang(h.get('x-pathname') ?? '/'))
  if (!pathWithoutLang) return null
  if (pathWithoutLang.startsWith('merch') || pathWithoutLang === 'sitemap' || pathWithoutLang.startsWith('team/')) return null

  let resolved: Awaited<ReturnType<typeof resolvePageByPath>> = null
  try {
    resolved = await resolvePageByPath(pathWithoutLang, language)
  } catch {
    return null
  }
  if (!resolved || SKIP_TYPES.has(resolved.type)) return null

  const leaf = pathWithoutLang.split('/').pop() ?? pathWithoutLang
  const slugs = [...new Set([pathWithoutLang, `${language}/${pathWithoutLang}`, resolved.slug ?? '', leaf].filter(Boolean).map((s) => s.toLowerCase()))]

  let items: LinkDoc[] = []
  let selfId = ''
  try {
    const doc = await sanityPageFetch<{ _id: string; related?: (LinkDoc | null)[] | null } | null>(
      relatedQuery,
      { type: resolved.type, slugs, language },
      { next: { revalidate: 300 } }
    )
    selfId = doc?._id ?? ''
    items = (doc?.related ?? []).filter((r): r is LinkDoc => Boolean(r && r.slug && r.title && r.language === language))
    if (items.length < 3) {
      const exclude = [selfId, ...items.map((i) => i._id)].filter(Boolean)
      const [posts, packages] = await Promise.all([
        sanityPageFetch<LinkDoc[]>(fallbackQuery, { language, exclude }, { next: { revalidate: 300 } }),
        sanityPageFetch<LinkDoc | null>(packagesQuery, { language }, { next: { revalidate: 300 } }),
      ])
      const seen = new Set(items.map((i) => i._id))
      for (const candidate of [packages, ...(posts ?? [])]) {
        if (!candidate || !candidate.slug || seen.has(candidate._id) || candidate._id === selfId) continue
        items.push(candidate)
        seen.add(candidate._id)
        if (items.length >= 4) break
      }
    }
  } catch {
    return null
  }
  if (!items.length) return null

  const isArticle = (t: string) => t === 'post' || t === 'blogPost'
  const sectionLabel = (t: string) =>
    isArticle(t) ? (BLOG_INDEX_SLUG[language] === 'blogg' ? 'Artikkel' : 'Article') : t === 'caseStudy' ? (WORK_INDEX_SLUG[language] === 'kundecaser' ? 'Kundecase' : 'Case study') : null

  return (
    <aside aria-label={T[language] ?? T.en} className="border-t border-sc-ink-100 bg-white">
      <div className="section_container mx-auto page-padding-x py-12 lg:py-16">
        <h2 className="text-xl lg:text-2xl font-bold tracking-[-0.02em] text-sc-ink-900 mb-6">{T[language] ?? T.en}</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, 4).map((item) => (
            <li key={item._id}>
              <Link
                href={hrefFor({ _type: item._type, slug: item.slug!, language: item.language ?? language }, language)}
                className="block h-full rounded-[10px] border border-sc-ink-100 p-5 hover:border-sc-cyan-500 transition-colors"
              >
                {sectionLabel(item._type) && (
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-sc-cyan-500 mb-2">{sectionLabel(item._type)}</span>
                )}
                <span className="block font-semibold text-sc-ink-900 leading-snug">{item.title}</span>
                {item.excerpt && <span className="block mt-2 text-sm text-sc-ink-600 line-clamp-3">{item.excerpt}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
