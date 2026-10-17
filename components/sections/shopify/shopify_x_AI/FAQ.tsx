import { Faq } from '@/components/integrations/LinkBlocks'

interface FAQItem {
  question?: string
  answer?: string
}

interface FAQData {
  title?: string
  items?: FAQItem[]
}

/** The shared Faq accordion, with the Sanity title as heading. */
export default function FAQ({ faq, lang = 'no' }: { faq?: FAQData; lang?: string }) {
  const items = (faq?.items ?? []).filter((f): f is { question: string; answer: string } => !!f?.question && !!f?.answer)
  if (items.length === 0) return null
  return <Faq heading={faq?.title || (lang === 'no' ? 'Vanlige spørsmål' : 'Frequently asked questions')} items={items} />
}
