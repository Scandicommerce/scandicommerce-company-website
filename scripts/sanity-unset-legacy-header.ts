// Run with: npx sanity exec <this file> --with-user-token
// Unsets the legacy header fields (declared read-only / unused in the schema)
// directly on the published headerSettings documents, no draft copies.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
async function main() {
  const ids: string[] = await client.fetch('*[_type == "headerSettings" && !(_id in path("drafts.**"))]._id')
  console.log(dataset, 'headerSettings:', ids.length)
  let tx = client.transaction()
  for (const id of ids) tx = tx.patch(id, (p) => p.unset(['mainNavLinks', 'servicesMenu', 'shopifyMenu']))
  const res = await tx.commit({ visibility: 'async' })
  console.log('committed', res.results?.length ?? 0, 'patches', res.transactionId)
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
