import { ProseQuote } from '@/components/sections/shopify/shopify_x_PIM/WhatIsPIM'

interface EnhancingWithAiData {
  title?: string
  paragraph1?: string
  paragraph2?: string
  quote?: {
    text?: string
    author?: string
  }
}

export default function EnhancingWithAI({ enhancingWithAi, lang = 'no' }: { enhancingWithAi?: EnhancingWithAiData; lang?: string }) {
  return (
    <ProseQuote
      eyebrow={lang === 'no' ? 'Shopify og KI' : 'Shopify and AI'}
      title={enhancingWithAi?.title}
      paragraphs={[enhancingWithAi?.paragraph1, enhancingWithAi?.paragraph2]}
      quote={enhancingWithAi?.quote}
    />
  )
}
