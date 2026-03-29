import type { FaqQuestionBlock, JsonLdObject } from './types'
import { SCHEMA_ORG_CONTEXT } from './types'
import { toPlainTextForSchema } from './plainText'
import { normalizeHttpUrl } from './urls'

export interface FaqItem {
  question: string
  answer: string
}

export function buildFaqPageSchema(
  items: FaqItem[] | null | undefined,
  pageUrl: string
): JsonLdObject | null {
  const list = (items ?? []).filter((i) => i.question?.trim() && i.answer?.trim())
  if (!list.length) return null

  const mainEntity: FaqQuestionBlock[] = list.map((item) => ({
    '@type': 'Question',
    name: toPlainTextForSchema(item.question.trim(), 2000),
    acceptedAnswer: {
      '@type': 'Answer',
      text: toPlainTextForSchema(item.answer.trim(), 10000),
    },
  }))

  const schema: JsonLdObject = {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': 'FAQPage',
    mainEntity,
  }

  const base = pageUrl.trim() ? normalizeHttpUrl(pageUrl.replace(/#.*$/, '')) : null
  if (base) schema['@id'] = `${base}#faqpage`

  return schema
}
