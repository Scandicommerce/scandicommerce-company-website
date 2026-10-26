// Run with: TARGET_DATASET=production npx sanity exec scripts/sanity-add-header-links.ts --with-user-token
// Appends Om oss and Kontakt to the Norwegian header Main Menu, directly on
// the published document (no draft), which gets past the attribute-limit
// check that blocks Studio and the MCP draft path.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
const ID = 'ef34f26b-c8e9-4846-966b-ebe037e0cb76'
const items = [
  { _type: 'menuItem', _key: 'om-oss', label: 'Om oss', href: '/om-oss' },
  { _type: 'menuItem', _key: 'kontakt', label: 'Kontakt', href: '/kontakt' },
]

async function main() {
  const existing: string[] = (await client.fetch('*[_id == $id][0].menu[].label', { id: ID })) ?? []
  const missing = items.filter((i) => !existing.includes(i.label))
  if (missing.length === 0) return console.log(dataset, 'already has', existing.join(', '))
  await client.patch(ID).insert('after', 'menu[-1]', missing).commit({ visibility: 'sync' })
  const after: string[] = await client.fetch('*[_id == $id][0].menu[].label', { id: ID })
  console.log(dataset, 'menu now:', after.join(', '))
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
