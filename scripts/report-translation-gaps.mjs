/**
 * Lists post + blogPost documents by language so you can see translation coverage.
 *
 *   node --env-file=.env scripts/report-translation-gaps.mjs
 *
 * Env: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET (read-only; no token required for public dataset)
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const query = `*[_type in ["post", "blogPost"]] | order(title asc) {
  _type,
  title,
  language,
  "slug": slug.current
}`

async function main() {
  const docs = await client.fetch(query)
  const byLang = {}
  for (const d of docs) {
    const lang = d.language || '(unset)'
    if (!byLang[lang]) byLang[lang] = []
    byLang[lang].push(d)
  }

  console.log('\n=== Blog / Post documents by language ===\n')
  for (const lang of Object.keys(byLang).sort()) {
    console.log(`${lang}: ${byLang[lang].length}`)
    for (const d of byLang[lang]) {
      console.log(`  - [${d._type}] ${d.title || '(no title)'}  slug=${d.slug || '—'}`)
    }
    console.log('')
  }
  console.log(`Total: ${docs.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
