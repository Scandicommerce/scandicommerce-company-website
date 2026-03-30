export const SCHEMA_ORG_CONTEXT = 'https://schema.org' as const

/** Root object passed to JSON-LD script serialization. */
export type JsonLdObject = Record<string, unknown>

export interface SchemaOrgImageObject {
  '@type': 'ImageObject'
  url: string
  width?: number
  height?: number
}

export interface BreadcrumbListItem {
  '@type': 'ListItem'
  position: number
  name: string
  item: string
}

export interface FaqQuestionBlock {
  '@type': 'Question'
  name: string
  acceptedAnswer: {
    '@type': 'Answer'
    text: string
  }
}
