import { safeJsonLdStringify } from '@/lib/schema/safeStringify'
import type { JsonLdObject } from '@/lib/schema/types'

export type SchemaMarkupSchemaProp = JsonLdObject | JsonLdObject[]

export interface SchemaMarkupProps {
  schema: SchemaMarkupSchemaProp
}

function jsonLdScriptKey(node: JsonLdObject, index: number): string {
  const id = node['@id']
  const typeVal = node['@type']
  const idPart = typeof id === 'string' && id ? id : ''
  const typePart =
    typeof typeVal === 'string'
      ? typeVal
      : Array.isArray(typeVal)
        ? typeVal.join(',')
        : ''
  return idPart || `${typePart}-${index}` || `schema-${index}`
}

/** One `<script type="application/ld+json">` per root node (each carries `@context`). */
export default function SchemaMarkup({ schema }: SchemaMarkupProps) {
  const list = Array.isArray(schema) ? schema : [schema]
  return (
    <>
      {list.map((node, index) => (
        <script
          // eslint-disable-next-line react/no-danger -- JSON-LD requires inline script
          key={`${jsonLdScriptKey(node, index)}::${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(node) }}
        />
      ))}
    </>
  )
}
