/**
 * Link the agentic pillar (sales page) to its two educational posts, per language.
 *   TARGET_DATASET=production npx sanity exec scripts/sanity-agentic-pillar-links.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli'

const dataset = process.env.TARGET_DATASET || 'development'
const client = getCliClient({ apiVersion: '2025-02-19' }).withConfig({ dataset })

async function main() {
  for (const lang of ['no', 'en', 'sv', 'da', 'de']) {
    const posts = [`post-agentic-what-is-${lang}`, `post-agentic-ucp-${lang}`]
    const exist = await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: posts })
    const refs = posts.filter((id) => exist.includes(id)).map((id) => ({ _key: id, _type: 'reference', _ref: id, _weak: true }))
    await client.patch(`pillar-agentisk-handel-${lang}`).set({ clusterLinks: refs }).commit()
    console.log(`${dataset}: pillar-agentisk-handel-${lang} -> ${refs.length} posts`)
  }
}
main().catch((e) => { console.error(e); process.exit(1) })
