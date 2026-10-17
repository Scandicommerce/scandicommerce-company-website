// Dry run:  TARGET_DATASET=production npx sanity exec scripts/sanity-unset-legacy-roots.ts --with-user-token
// Apply:    TARGET_DATASET=production APPLY=1 npx sanity exec scripts/sanity-unset-legacy-roots.ts --with-user-token
//
// Page documents still carry the pre-2026 root objects (hero, cta, faq …)
// that the site only reads when `sections[]` is empty. They are no longer in
// the schema but they count against the dataset's attribute limit. This
// script unsets them on every document (published and draft) that already
// has sections, and refuses to touch documents that still depend on them.
import { getCliClient } from 'sanity/cli'
import { LEGACY_OBJECT_PAIRS } from '../lib/sanity/pageBuilderLegacy'

const dataset = process.env.TARGET_DATASET || 'production'
const apply = process.env.APPLY === '1'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })

const KEYS: Record<string, string[]> = Object.fromEntries(Object.entries(LEGACY_OBJECT_PAIRS).map(([type, pairs]) => [type, pairs.map(([k]) => k)]))
KEYS.landingPage = ['hero', 'trustedBy', 'painPoints', 'servicesShowcase', 'results', 'process', 'partners', 'cta']
KEYS.contactPage = ['hero', 'contactCards', 'bookingSection', 'messageSection', 'benefits', 'mapSection', 'faq']
KEYS.packageDetailPage = ['packageInfo', 'heroButtons', 'bestFor', 'idealFor', 'highlights', 'moreDeliverablesCount', 'included', 'includedCategories', 'processSteps', 'faq', 'reviews', 'tabLabels', 'addOns', 'caseStudiesBanner']

interface Row { _id: string; language?: string; sectionCount: number; present: string[] }

async function main() {
  let safe: { id: string; keys: string[] }[] = []
  const blocked: string[] = []
  for (const [type, keys] of Object.entries(KEYS)) {
    const presentExpr = keys.map((k) => `defined(${k}) => "${k}"`).join(', ')
    const rows: Row[] = await client.fetch(
      `*[_type == $type && (${keys.map((k) => `defined(${k})`).join(' || ')})]{ _id, language, "sectionCount": count(sections), "present": [${keys.map((k) => `select(defined(${k}) => "${k}")`).join(', ')}] }`,
      { type }
    )
    void presentExpr
    for (const r of rows) {
      const present = (r.present ?? []).filter(Boolean)
      if (!present.length) continue
      if ((r.sectionCount ?? 0) > 0) safe.push({ id: r._id, keys: present })
      else blocked.push(`${type} ${r._id} (${r.language ?? '-'}) has no sections but still carries: ${present.join(', ')}`)
    }
    const n = rows.filter((r) => (r.present ?? []).filter(Boolean).length).length
    if (n) console.log(`${type}: ${n} document(s) with legacy roots, ${rows.filter((r) => (r.sectionCount ?? 0) === 0 && (r.present ?? []).filter(Boolean).length).length} without sections`)
  }
  console.log(`\n${dataset}: ${safe.length} documents safe to unset, ${blocked.length} blocked`)
  for (const b of blocked) console.log('  BLOCKED', b)
  if (!apply) return console.log('Dry run only. Set APPLY=1 to unset.')
  for (let i = 0; i < safe.length; i += 50) {
    let tx = client.transaction()
    for (const { id, keys } of safe.slice(i, i + 50)) tx = tx.patch(id, (p) => p.unset(keys))
    const res = await tx.commit({ visibility: 'sync' })
    console.log(`committed ${res.results?.length ?? 0} patches (${res.transactionId})`)
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
