/**
 * Typed access to `url-plan.json` — the generated inventory of every published
 * Sanity document's old and new URL, plus translation clusters.
 *
 * Regenerate with `python3 scripts/seo/generate-url-plan.py <dataset.json>`
 * (see scripts/seo/README.md). The runtime uses it for:
 *   - legacy path → canonical path lookups (middleware, single-hop redirects)
 *   - cross-language path vocabulary (Norwegian path requested on .com etc.)
 *
 * It is a snapshot; anything published after the snapshot is handled by the
 * dynamic Sanity lookups in `lib/sanity/redirectTranslate.js`.
 */
import plan from './url-plan.json'
import { normalizeSlug, trimSlashes } from '@/lib/routes'
import type { Language } from '@/lib/site-config'

export interface PlanDocument {
  id: string
  type: string
  language: Language | null
  oldSlug: string
  newSlug: string
  newPath: string
  oldPublicPath: string
  newPublicPath?: string
  group: string | null
}

export const PLAN_DOCUMENTS: PlanDocument[] = plan.documents as PlanDocument[]
export const PLAN_CLUSTERS: Record<string, Partial<Record<Language, string>>> = plan.clusters as never

/** Old public path (locale prefix removed, lowercased) → doc, per language. */
const legacyIndex = new Map<string, PlanDocument>()
/** Current path (lowercased) → doc, per language. */
const currentIndex = new Map<string, PlanDocument>()

function key(language: string | null, path: string): string {
  return `${language ?? '*'}:${trimSlashes(path).toLowerCase()}`
}

for (const doc of PLAN_DOCUMENTS) {
  const langs: (Language | null)[] = doc.language ? [doc.language] : [null]
  for (const lang of langs) {
    currentIndex.set(key(lang, doc.newPath), doc)
    const oldPath = normalizeSlug(doc.oldPublicPath)
    if (oldPath !== trimSlashes(doc.newPath)) legacyIndex.set(key(lang, oldPath), doc)
  }
}

/** Document whose CURRENT path is `path` in `language` (case-insensitive). */
export function findDocByCurrentPath(language: string, path: string): PlanDocument | null {
  return currentIndex.get(key(language, path)) ?? currentIndex.get(key(null, path)) ?? null
}

/** Document whose OLD public path was `path` in `language` (case-insensitive). */
export function findDocByLegacyPath(language: string, path: string): PlanDocument | null {
  return legacyIndex.get(key(language, path)) ?? legacyIndex.get(key(null, path)) ?? null
}

/**
 * Any language in which `path` is (or was) a document path. Used by the
 * middleware to detect e.g. a Norwegian path requested on .com.
 */
export function languagesForPath(path: string): { language: Language; doc: PlanDocument; legacy: boolean }[] {
  const out: { language: Language; doc: PlanDocument; legacy: boolean }[] = []
  const p = trimSlashes(path).toLowerCase()
  for (const doc of PLAN_DOCUMENTS) {
    if (!doc.language) continue
    if (trimSlashes(doc.newPath).toLowerCase() === p) out.push({ language: doc.language, doc, legacy: false })
    else if (normalizeSlug(doc.oldPublicPath).toLowerCase() === p) out.push({ language: doc.language, doc, legacy: true })
  }
  return out
}

/** Article / case-study document whose OLD slug leaf is `leaf` (case-insensitive). */
export function findArticleByOldLeaf(language: string, leaf: string): PlanDocument | null {
  const l = leaf.toLowerCase()
  for (const doc of PLAN_DOCUMENTS) {
    if (doc.language !== language) continue
    if (!['post', 'blogPost', 'caseStudy'].includes(doc.type)) continue
    if (doc.oldSlug === doc.newSlug) continue
    const oldLeaf = trimSlashes(doc.oldSlug).split('/').pop()?.toLowerCase()
    if (oldLeaf === l) return doc
  }
  return null
}

/** Path of the translation sibling of `doc` in `targetLanguage`, if published. */
export function siblingPath(doc: PlanDocument, targetLanguage: Language): string | null {
  if (!doc.group) return null
  const cluster = PLAN_CLUSTERS[doc.group]
  const p = cluster?.[targetLanguage]
  return typeof p === 'string' ? p : null
}

/**
 * Nearest indexable parent for a path that has no translation in the target
 * language (TECHNICAL-SEO-SPEC §7.2: "never the homepage for everything").
 */
export function sectionParentPath(targetLanguage: Language, path: string): string {
  const first = trimSlashes(path).split('/')[0]?.toLowerCase() ?? ''
  const no = targetLanguage === 'no'
  switch (first) {
    case 'blogg':
    case 'blog':
    case 'resources':
      return no ? 'blogg' : 'blog'
    case 'kundecaser':
    case 'prosjekter':
    case 'work':
      return no ? 'kundecaser' : 'work'
    case 'tjenester':
    case 'services':
      return no ? 'tjenester/alle-pakker' : 'services/all-packages'
    case 'team':
      return trimSlashes(path)
    case 'legal':
      return trimSlashes(path)
    case 'merch':
      return 'merch'
    default:
      return ''
  }
}
