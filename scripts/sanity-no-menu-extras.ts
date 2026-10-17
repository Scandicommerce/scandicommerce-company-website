// TARGET_DATASET=production npx sanity exec scripts/sanity-no-menu-extras.ts --with-user-token
// Adds "Agentisk handel" (top level, before NexusPOS) and "Bli partner" (in the
// Integrasjoner > Partnere column) to the Norwegian Main Menu.
import { getCliClient } from 'sanity/cli'
const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
const ID = 'ef34f26b-c8e9-4846-966b-ebe037e0cb76'
async function main() {
  const doc = await client.fetch<{ labels: string[]; partnerLinks: string[] }>('*[_id == $id][0]{ "labels": menu[].label, "partnerLinks": menu[_key=="integrasjoner"].columns[_key=="partnere"].items[].label }', { id: ID })
  let p = client.patch(ID)
  if (!doc.labels.includes('Agentisk handel')) p = p.insert('before', 'menu[_key=="nexuspos"]', [{ _type: 'menuItem', _key: 'agentisk', label: 'Agentisk handel', href: '/agentisk-handel' }])
  if (!doc.partnerLinks.includes('Bli partner')) p = p.insert('after', 'menu[_key=="integrasjoner"].columns[_key=="partnere"].items[-1]', [{ _type: 'menuLink', _key: 'pa-bli', label: 'Bli partner', href: '/partnere/bli-partner' }])
  await p.commit({ visibility: 'sync' })
  const after = await client.fetch<string[]>('*[_id == $id][0].menu[].label', { id: ID })
  console.log(dataset, 'menu:', after.join(', '))
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
