import { safeJsonLdStringify } from '@/lib/schema/safeStringify'
import { buildPageJsonLdNodes, graphFor } from '@/lib/seo/pageJsonLd'

/** The single JSON-LD `@graph` for the current page (rendered in the root `<head>`). */
export default async function JsonLd() {
  let graph = null
  try {
    graph = graphFor(await buildPageJsonLdNodes())
  } catch (err) {
    console.error('[JsonLd] failed to build graph', err)
  }
  if (!graph) return null
  return (
    <script
      id="page-jsonld"
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD requires inline script
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(graph) }}
    />
  )
}
