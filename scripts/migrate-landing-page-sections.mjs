/**
 * One-time migration: landingPage legacy root fields -> sections[] page builder.
 *
 * Requires write token:
 *   SANITY_API_WRITE_TOKEN
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET (optional, default production)
 *
 * Usage:
 *   node scripts/migrate-landing-page-sections.mjs           # migrate, keep legacy fields
 *   node scripts/migrate-landing-page-sections.mjs --unset   # migrate and remove legacy fields
 *   node scripts/migrate-landing-page-sections.mjs --dry-run
 *
 * Reads env from `.env.local` / `.env` in the project root (see scripts/load-env.mjs).
 */

import './load-env.mjs'
import { createClient } from '@sanity/client'

const dryRun = process.argv.includes('--dry-run')
const unsetLegacy = process.argv.includes('--unset')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error(
    'Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.\n' +
      'Add them to `.env.local` or export them in this shell.'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const LEGACY_FIELD_ORDER = [
  ['hero', 'heroSection'],
  ['trustedBy', 'trustedBySection'],
  ['painPoints', 'painPointsSection'],
  ['servicesShowcase', 'servicesShowcaseSection'],
  ['results', 'resultsSection'],
  ['process', 'processSection'],
  ['partners', 'partnersSection'],
  ['cta', 'ctaSection'],
]

const LEGACY_KEYS = LEGACY_FIELD_ORDER.map(([k]) => k)

function randomKey() {
  return `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}

function isNonEmptyObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length > 0
}

function buildSectionsFromLegacy(doc) {
  const sections = []
  for (const [field, _type] of LEGACY_FIELD_ORDER) {
    const data = doc[field]
    if (!isNonEmptyObject(data)) continue
    const { _type: _ignore, _key: __ignore, ...rest } = data
    sections.push({
      _key: randomKey(),
      _type,
      ...rest,
    })
  }
  return sections
}

async function main() {
  const docs = await client.fetch(`*[_type == "landingPage"]{ ... }`)

  for (const doc of docs) {
    const id = doc._id
    if (Array.isArray(doc.sections) && doc.sections.length > 0) {
      console.log(`[skip] ${id} — already has sections (${doc.sections.length})`)
      continue
    }

    const sections = buildSectionsFromLegacy(doc)
    if (sections.length === 0) {
      console.log(`[skip] ${id} — no legacy section content`)
      continue
    }

    console.log(`[plan] ${id} — ${sections.length} blocks (${sections.map((s) => s._type).join(', ')})`)

    if (dryRun) continue

    let patch = client.patch(id).set({ sections })
    if (unsetLegacy) {
      patch = patch.unset(LEGACY_KEYS)
    }
    await patch.commit({ visibility: 'async' })
    console.log(`[ok] ${id}`)
  }

  if (dryRun) {
    console.log('\nDry run only; no writes.')
  } else if (!unsetLegacy) {
    console.log('\nLegacy root fields are still on documents. Re-run with --unset to remove them after verifying in Studio.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
