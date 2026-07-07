/**
 * One-shot sync of the demo-dataset homepage edits (images + landing pages)
 * to production. Asset IDs are content-addressed, so re-uploading the same
 * bytes into production preserves all references.
 *
 * Usage: node scripts/sync-dev-content-to-prod.mjs
 * Reads SANITY_API_READ_TOKEN (a user token with write access) from .env.local.
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'

const envLocal = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const token = envLocal.match(/^SANITY_API_READ_TOKEN=(.+)$/m)?.[1]?.trim()
if (!token) throw new Error('SANITY_API_READ_TOKEN not found in .env.local')

const base = { projectId: 'fk1tt27l', apiVersion: '2024-01-01', token, useCdn: false }
const dev = createClient({ ...base, dataset: 'development' })
const prod = createClient({ ...base, dataset: 'production' })

const DOC_IDS = [
  'dd9f5b30-766a-4755-80b3-e8bc54f0041e', // landingPage NO (published)
  '2d5913f8-822f-4f38-878f-0f9e9a781c6f', // landingPage EN (published by editor)
  'drafts.2d5913f8-822f-4f38-878f-0f9e9a781c6f', // landingPage EN newer draft
]

// 0) Fetch the docs and discover EVERY asset they reference
const docs = []
const referencedAssets = new Set()
for (const id of DOC_IDS) {
  const doc = await dev.getDocument(id)
  if (!doc) {
    console.log(`skip (not in dev): ${id}`)
    continue
  }
  docs.push(doc)
  for (const m of JSON.stringify(doc).matchAll(/"((?:image|file)-[a-f0-9]{40}-[^"]+)"/g)) {
    referencedAssets.add(m[1])
  }
}
console.log(`docs: ${docs.length}, referenced assets: ${referencedAssets.size}`)

// Which of those are missing in production?
const assetIds = [...referencedAssets]
const inProd = new Set(
  await prod.fetch('*[_id in $ids]._id', { ids: assetIds })
)
const missing = assetIds.filter((id) => !inProd.has(id))
console.log(`missing in prod: ${missing.length}`)

// 1) Copy missing assets. The CDN may re-encode, so the prod asset can get a
//    new content hash — collect a dev-id -> prod-id map and remap references.
const idMap = new Map()
for (const id of missing) {
  const meta = await dev.fetch('*[_id == $id][0]{url, originalFilename}', { id })
  if (!meta?.url) throw new Error(`asset not found in dev: ${id}`)
  const res = await fetch(meta.url)
  if (!res.ok) throw new Error(`download failed ${res.status}: ${meta.url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const uploaded = await prod.assets.upload('image', buf, {
    filename: meta.originalFilename || 'image',
  })
  if (uploaded._id !== id) idMap.set(id, uploaded._id)
  console.log(`asset uploaded: ${id} -> ${uploaded._id} (${buf.length} bytes)`)
}

// 2) Copy documents (dev versions are supersets of prod after this morning's
//    migration), remapping any re-hashed asset references.
function remapAssetRefs(doc) {
  let json = JSON.stringify(doc)
  for (const [from, to] of idMap) json = json.split(from).join(to)
  return JSON.parse(json)
}

const tx = prod.transaction()
for (const doc of docs) {
  delete doc._rev
  tx.createOrReplace(remapAssetRefs(doc))
  console.log(`queued createOrReplace: ${doc._id} (${doc._type})`)
}
const result = await tx.commit()
console.log('committed:', result.results.map((r) => r.id).join(', '))
console.log('DONE')
