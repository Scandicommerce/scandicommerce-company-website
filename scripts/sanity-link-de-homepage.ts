// TARGET_DATASET=production npx sanity exec scripts/sanity-link-de-homepage.ts --with-user-token
// Links the German homepage into the landingPage translation cluster so
// hreflang and the Studio language switcher see it.
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })

async function main() {
  const de = await client.fetch<{ _id: string } | null>('*[_type == "landingPage" && language == "de" && isHomepage == true && !(_id in path("drafts.**"))][0]{ _id }')
  const meta = await client.fetch<{ _id: string; keys: string[] } | null>('*[_type == "translation.metadata" && "landingPage" in schemaTypes][0]{ _id, "keys": translations[]._key }')
  if (!de || !meta) throw new Error(`missing de homepage (${de?._id}) or metadata (${meta?._id})`)
  if (meta.keys.includes('de')) return console.log(dataset, 'already linked')
  await client.patch(meta._id).insert('after', 'translations[-1]', [{ _key: 'de', value: { _type: 'reference', _ref: de._id, _weak: true, _strengthenOnPublish: { type: 'landingPage' } } }]).commit({ visibility: 'sync' })
  console.log(dataset, 'linked', de._id, 'into', meta._id)
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
