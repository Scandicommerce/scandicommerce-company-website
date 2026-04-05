/**
 * One-time: move legacy landingPage top-level section objects into `sections[]`.
 *
 * Requires: Node 20+ (--env-file) or load .env another way.
 * Env: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN
 *
 * Usage (from repo root):
 *   node --env-file=.env scripts/migrate-landing-page-sections.mjs
 *
 * Skips documents that already have a non-empty `sections` array.
 * Prefer running against a development dataset first.
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

function randomKey() {
  return [...Array(12)]
    .map(() => Math.random().toString(36).charAt(2))
    .join('')
}

function asBlock(type, data) {
  if (!data || typeof data !== 'object') return null
  return { _type: type, _key: randomKey(), ...data }
}

const LEGACY_FIELDS = [
  'hero',
  'trustedBy',
  'painPoints',
  'servicesShowcase',
  'results',
  'process',
  'partners',
  'cta',
]

async function main() {
  const docs = await client.fetch(
    `*[_type == "landingPage"]{ _id, hero, trustedBy, painPoints, servicesShowcase, results, process, partners, cta, sections }`
  )

  for (const doc of docs) {
    if (doc.sections?.length) {
      console.log(`Skip ${doc._id} (already has sections)`)
      continue
    }

    const sections = [
      asBlock('heroSection', doc.hero),
      asBlock('trustedBySection', doc.trustedBy),
      asBlock('painPointsSection', doc.painPoints),
      asBlock('servicesShowcaseSection', doc.servicesShowcase),
      asBlock('resultsSection', doc.results),
      asBlock('processSection', doc.process),
      asBlock('partnersSection', doc.partners),
      asBlock('ctaSection', doc.cta),
    ].filter(Boolean)

    if (sections.length === 0) {
      console.log(`Skip ${doc._id} (no legacy section data)`)
      continue
    }

    await client.patch(doc._id).set({ sections }).unset(LEGACY_FIELDS).commit()
    console.log(`Migrated ${doc._id} (${sections.length} blocks)`)
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
