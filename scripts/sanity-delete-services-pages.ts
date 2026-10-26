// Dry run:  TARGET_DATASET=production npx sanity exec scripts/sanity-delete-services-pages.ts --with-user-token
// Apply:    TARGET_DATASET=production APPLY=1 npx sanity exec scripts/sanity-delete-services-pages.ts --with-user-token
//
// The `servicesPage` document type was retired (never queried or routed).
// This script lists every servicesPage document (published and drafts) and,
// with APPLY=1, deletes them. It refuses to run if any other document still
// references one of them.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const apply = process.env.APPLY === '1'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset, perspective: 'raw' })

interface Row { _id: string; language?: string; pageTitle?: string; slug?: string }

async function main() {
  const rows: Row[] = await client.fetch(`*[_type == "servicesPage"]{ _id, language, pageTitle, "slug": slug.current } | order(_id)`)
  console.log(`${dataset}: ${rows.length} servicesPage document(s)`)
  let blocked = 0
  for (const r of rows) {
    const refs: { _id: string; _type: string }[] = await client.fetch(`*[references($id)]{ _id, _type }`, { id: r._id })
    const tag = refs.length ? `  BLOCKED by ${refs.map((x) => `${x._type} ${x._id}`).join(', ')}` : ''
    if (refs.length) blocked++
    console.log(`  ${r._id} (${r.language ?? '-'}) "${r.pageTitle ?? ''}" /${r.slug ?? ''}${tag}`)
  }
  if (blocked) { console.error(`\nRefusing: ${blocked} document(s) are still referenced.`); process.exit(1) }
  if (!rows.length) return
  if (!apply) return console.log('Dry run only. Set APPLY=1 to delete.')
  let tx = client.transaction()
  for (const r of rows) tx = tx.delete(r._id)
  const res = await tx.commit({ visibility: 'sync' })
  console.log(`deleted ${res.results?.length ?? 0} document(s) (${res.transactionId})`)
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
