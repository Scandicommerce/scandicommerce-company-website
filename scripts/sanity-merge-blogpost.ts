// Dry run:  TARGET_DATASET=production npx sanity exec scripts/sanity-merge-blogpost.ts --with-user-token
// Apply:    TARGET_DATASET=production APPLY=1 npx sanity exec scripts/sanity-merge-blogpost.ts --with-user-token
// Add DUMP=<slug> to print the converted post document for one slug.
//
// Merges the legacy `blogPost` type into `post` (page builder). Every blogPost
// document (published and draft) becomes a `post` with the id `post-<old id>`
// (drafts: `drafts.post-<old id>`), keeping slug, language, publishedAt,
// author, image, tags, excerpt, relatedCaseStudies, relatedPages and SEO.
// introduction + articleSection content map to richTextBlock portable text,
// proTip to a calloutBlock, apps[] to a bullet list. Every document that
// references a blogPost (translation.metadata, blogPage, caseStudy, workPage,
// post relatedPages …) has its references rewritten to the new id, and the
// blogPost documents are deleted — all in one transaction.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const apply = process.env.APPLY === '1'
const dump = process.env.DUMP
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset, perspective: 'raw' })

type Obj = Record<string, unknown>
interface Section { _key?: string; id?: string; title?: string; content?: string; proTip?: { title?: string; content?: string }; apps?: { name?: string; category?: string; description?: string; features?: string[] }[] }
interface BlogPost extends Obj {
  _id: string; _createdAt: string; language?: string; title?: string; slug?: { current?: string }; description?: string; category?: string; tags?: string[]
  publishedAt?: string; image?: Obj; featuredImage?: Obj; author?: Obj; introduction?: string; sections?: Section[]
  relatedCaseStudies?: Obj[]; relatedPages?: Obj[]; seoExtended?: Obj
}

const baseId = (id: string) => id.replace(/^drafts\./, '')
const newId = (id: string) => (id.startsWith('drafts.') ? `drafts.post-${baseId(id)}` : `post-${id}`)
const key = () => Math.random().toString(36).slice(2, 14)
const span = (text: string, marks: string[] = []) => ({ _type: 'span', _key: key(), text, marks })
const block = (children: ReturnType<typeof span>[], style = 'normal', listItem?: string) => ({ _type: 'block', _key: key(), style, markDefs: [], children, ...(listItem ? { listItem, level: 1 } : {}) })
const richText = (body: ReturnType<typeof block>[]) => ({ _type: 'richTextBlock', _key: key(), body })

function textToBlocks(text: string | undefined) {
  const out: ReturnType<typeof block>[] = []
  let prevQuote = false
  for (const raw of (text ?? '').split('\n')) {
    const line = raw.trim()
    if (!line) { prevQuote = false; continue }
    const isQuote: boolean = /^["«“]/.test(line) || (prevQuote && /^[—–-]\s/.test(line))
    out.push(block([span(line)], isQuote ? 'blockquote' : 'normal'))
    prevQuote = isQuote
  }
  return out
}

function convert(doc: BlogPost, tagSample: Obj | null) {
  const content: Obj[] = []
  if (doc.introduction?.trim()) content.push(richText(textToBlocks(doc.introduction)))
  for (const s of doc.sections ?? []) {
    const blocks: ReturnType<typeof block>[] = []
    if (s.title?.trim()) blocks.push(block([span(s.title.trim())], 'h2'))
    blocks.push(...textToBlocks(s.content))
    if (blocks.length) content.push(richText(blocks))
    if (s.proTip?.content?.trim()) content.push({ _type: 'calloutBlock', _key: key(), variant: 'info', title: s.proTip.title?.trim() || 'Pro Tip', content: s.proTip.content.trim() })
    const apps = (s.apps ?? []).filter((a) => a.name?.trim())
    if (apps.length) {
      content.push(richText(apps.map((a) => {
        const parts = [span(a.name!.trim(), ['strong'])]
        const rest = [a.category?.trim() ? ` (${a.category.trim()})` : '', a.description?.trim() ? ` – ${a.description.trim()}` : '', a.features?.length ? ` Features: ${a.features.filter(Boolean).join(', ')}.` : ''].join('')
        if (rest) parts.push(span(rest))
        return block(parts, 'normal', 'bullet')
      })))
    }
  }
  // A few legacy docs carry the whole article in `description`; keep the first
  // paragraph as the excerpt and move the full text into the body.
  let excerpt = doc.description?.trim() || undefined
  if (excerpt && excerpt.length > 320 && !content.length) {
    content.push(richText(textToBlocks(excerpt)))
    excerpt = excerpt.split('\n').map((l) => l.trim()).filter(Boolean)[0]
  }
  const labels: string[] = []
  for (const l of [...(doc.category ?? '').split(/\s{2,}/), ...(doc.tags ?? [])]) {
    const t = (l ?? '').trim()
    if (t && !labels.some((x) => x.toLowerCase() === t.toLowerCase())) labels.push(t)
  }
  const tagType = typeof tagSample?._type === 'string' ? { _type: tagSample._type } : {}
  const tags = labels.map((label, i) => ({ ...tagType, _key: key(), label, isPrimary: i === 0 }))
  const post: Obj = {
    _id: newId(doc._id), _type: 'post', language: doc.language, title: doc.title, slug: doc.slug,
    excerpt,
    publishedAt: doc.publishedAt ?? doc._createdAt,
    image: doc.image ?? doc.featuredImage, author: doc.author,
    tags: tags.length ? tags : undefined,
    relatedCaseStudies: doc.relatedCaseStudies?.length ? doc.relatedCaseStudies : undefined,
    relatedPages: doc.relatedPages?.length ? doc.relatedPages : undefined,
    content: content.length ? content : undefined,
    seoExtended: doc.seoExtended ?? undefined,
  }
  for (const k of Object.keys(post)) if (post[k] === undefined || post[k] === null) delete post[k]
  return post
}

/** Sanity patch paths (key-based for arrays) of every `_ref` that points at an old blogPost id. */
function refPaths(v: unknown, ids: Map<string, string>, p = '', out: { path: string; from: string; to: string }[] = []) {
  if (Array.isArray(v)) v.forEach((x, i) => refPaths(x, ids, `${p}[${x && typeof x === 'object' && (x as Obj)._key ? `_key=="${(x as Obj)._key}"` : i}]`, out))
  else if (v && typeof v === 'object') {
    const o = v as Obj
    if (typeof o._ref === 'string' && ids.has(o._ref)) out.push({ path: p ? `${p}._ref` : '_ref', from: o._ref, to: ids.get(o._ref)! })
    for (const k of Object.keys(o)) if (k !== '_ref') refPaths(o[k], ids, p ? `${p}.${k}` : k, out)
  }
  return out
}

async function main() {
  const docs: BlogPost[] = await client.fetch(`*[_type == "blogPost"] | order(_id)`)
  console.log(`${dataset}: ${docs.length} blogPost document(s)`)
  if (!docs.length) return console.log('Nothing to do.')
  const tagSample: Obj | null = await client.fetch(`*[_type == "post" && count(tags) > 0][0].tags[0]`)
  const ids = new Map<string, string>()
  for (const d of docs) { ids.set(d._id, newId(d._id)); ids.set(baseId(d._id), `post-${baseId(d._id)}`) }
  // Also map ids that only exist in translation.metadata as a published ref of a draft-only doc.
  const posts = docs.map((d) => convert(d, tagSample))
  for (const [d, p] of docs.map((d, i) => [d, posts[i]] as const)) {
    const blocks = ((p.content as Obj[] | undefined) ?? []).map((b) => String(b._type).replace('Block', '')).join(',')
    console.log(`  ${d._id} (${d.language ?? '-'}) /${d.slug?.current} -> ${p._id} | blocks: ${blocks || 'none'} | tags: ${((p.tags as Obj[] | undefined) ?? []).map((t) => t.label).join(', ') || '-'}`)
    if (dump && d.slug?.current === dump) console.log(JSON.stringify(p, null, 2))
  }
  const collisions: Obj[] = await client.fetch(`*[_type == "post" && !(_id in $newIds)]{ _id, language, "slug": slug.current }[ (slug + "|" + coalesce(language, "")) in $keys ]`, {
    newIds: posts.map((p) => p._id), keys: docs.map((d) => `${d.slug?.current}|${d.language ?? ''}`),
  })
  if (collisions.length) { console.error('Refusing: a post with the same slug+language already exists:', JSON.stringify(collisions)); process.exit(1) }

  const referencing: Obj[] = await client.fetch(`*[references($ids) && _type != "blogPost"]`, { ids: [...ids.keys()] })
  const patches: { id: string; set: Record<string, unknown> }[] = []
  for (const r of referencing) {
    const set: Record<string, unknown> = {}
    for (const { path, to } of refPaths(r, ids)) set[path] = to
    if (r._type === 'translation.metadata' && Array.isArray(r.schemaTypes)) set.schemaTypes = (r.schemaTypes as string[]).map((t) => (t === 'blogPost' ? 'post' : t))
    patches.push({ id: r._id as string, set })
    console.log(`  rewrite ${r._type} ${r._id}: ${Object.keys(set).join(', ')}`)
  }
  console.log(`\n${posts.length} post(s) to create, ${patches.length} referencing document(s) to patch, ${docs.length} blogPost(s) to delete`)
  if (!apply) return console.log('Dry run only. Set APPLY=1 to migrate.')

  let tx = client.transaction()
  for (const p of posts) tx = tx.createOrReplace(p as Obj & { _id: string; _type: string })
  for (const { id, set } of patches) tx = tx.patch(id, (q) => q.set(set))
  for (const d of docs) tx = tx.delete(d._id)
  const res = await tx.commit({ visibility: 'sync' })
  console.log(`committed ${res.results?.length ?? 0} mutations (${res.transactionId})`)
  const left: number = await client.fetch(`count(*[_type == "blogPost"])`)
  const created: number = await client.fetch(`count(*[_type == "post" && _id in $ids])`, { ids: posts.map((p) => p._id) })
  const dangling: number = await client.fetch(`count(*[references($ids)])`, { ids: [...ids.keys()] })
  console.log(`remaining blogPost: ${left}; posts created: ${created}; documents still referencing old ids: ${dangling}`)
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
