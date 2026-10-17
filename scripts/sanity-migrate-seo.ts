// Dry run:  TARGET_DATASET=production npx sanity exec scripts/sanity-migrate-seo.ts --with-user-token
// Apply:    TARGET_DATASET=production APPLY=1 npx sanity exec scripts/sanity-migrate-seo.ts --with-user-token
//
// Retires the legacy inline `seo` object. For every document (published and
// draft) that still carries `seo`, copies seo.metaTitle / metaDescription /
// ogImage into `seoExtended` where seoExtended does not already have that
// key, then unsets `seo`. Documents whose seoExtended is already populated
// only get `seo` unset. Idempotent: a second run finds nothing.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const apply = process.env.APPLY === '1'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset, perspective: 'raw' })

const KEYS = ['metaTitle', 'metaDescription', 'ogImage'] as const
type Key = (typeof KEYS)[number]
interface Row { _id: string; _type: string; seo?: Partial<Record<Key, unknown>> | null; seoExtended?: Partial<Record<Key, unknown>> | null }

function isFilled(v: unknown): boolean {
  if (v == null) return false
  if (typeof v === 'string') return v.trim().length > 0
  if (typeof v === 'object') return Object.keys(v as object).some((k) => !k.startsWith('_')) || Boolean((v as { asset?: unknown }).asset)
  return true
}

async function main() {
  const rows: Row[] = await client.fetch(`*[defined(seo)]{ _id, _type, seo, seoExtended } | order(_type, _id)`)
  const byType: Record<string, number> = {}
  for (const r of rows) byType[r._type] = (byType[r._type] ?? 0) + 1
  console.log(`${dataset}: ${rows.length} document(s) with legacy seo`)
  for (const [t, n] of Object.entries(byType)) console.log(`  ${t}: ${n}`)

  const patches: { id: string; set: Record<string, unknown> }[] = []
  let copied = 0
  for (const r of rows) {
    const set: Record<string, unknown> = {}
    for (const k of KEYS) {
      if (isFilled(r.seo?.[k]) && !isFilled(r.seoExtended?.[k])) set[`seoExtended.${k}`] = r.seo![k]
    }
    if (Object.keys(set).length) {
      copied++
      console.log(`  COPY ${r._type} ${r._id}: ${Object.keys(set).map((k) => k.replace('seoExtended.', '')).join(', ')}`)
    }
    patches.push({ id: r._id, set })
  }
  console.log(`\n${copied} document(s) need values copied into seoExtended; ${rows.length} will have seo unset`)
  if (!rows.length) return
  if (!apply) return console.log('Dry run only. Set APPLY=1 to migrate.')
  for (let i = 0; i < patches.length; i += 50) {
    let tx = client.transaction()
    for (const { id, set } of patches.slice(i, i + 50)) {
      tx = tx.patch(id, (p) => {
        let q = p.unset(['seo'])
        if (Object.keys(set).length) q = q.setIfMissing({ seoExtended: {} }).set(set)
        return q
      })
    }
    const res = await tx.commit({ visibility: 'sync' })
    console.log(`committed ${res.results?.length ?? 0} patches (${res.transactionId})`)
  }
  const left: number = await client.fetch(`count(*[defined(seo)])`)
  console.log(`remaining documents with seo: ${left}`)
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
