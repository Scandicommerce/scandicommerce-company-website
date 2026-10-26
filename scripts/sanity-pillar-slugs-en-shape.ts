// TARGET_DATASET=production npx sanity exec scripts/sanity-pillar-slugs-en-shape.ts --with-user-token
// Prefixed languages (sv, da, de) use the English path shape site-wide, so
// the two pillars get the English slugs under /sv, /da and /de.
import { getCliClient } from 'sanity/cli'
const dataset = process.env.TARGET_DATASET || 'production'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })
const SLUGS: Record<string, string> = {
  'pillar-agentisk-handel-sv': 'agentic-commerce', 'pillar-agentisk-handel-da': 'agentic-commerce', 'pillar-agentisk-handel-de': 'agentic-commerce',
  'pillar-bli-partner-sv': 'partners/become-a-partner', 'pillar-bli-partner-da': 'partners/become-a-partner', 'pillar-bli-partner-de': 'partners/become-a-partner',
}
async function main() {
  for (const [id, slug] of Object.entries(SLUGS)) {
    const cur = await client.fetch<string | null>('*[_id == $id][0].slug.current', { id })
    if (cur === null) { console.log(dataset, 'missing', id); continue }
    if (cur === slug) { console.log(dataset, 'ok', id, slug); continue }
    await client.patch(id).set({ 'slug.current': slug }).commit({ visibility: 'sync' })
    console.log(dataset, 'set', id, cur, '->', slug)
  }
}
main().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
