import { ProseQuote } from '@/components/sections/shopify/shopify_x_PIM/WhatIsPIM'

interface WhatIsShopifyData {
  title?: string
  paragraph1?: string
  paragraph2?: string
}

export default function WhatIsShopify({ whatIsShopify, lang = 'no' }: { whatIsShopify?: WhatIsShopifyData; lang?: string }) {
  return <ProseQuote eyebrow={lang === 'no' ? 'Hva Shopify er' : 'What Shopify is'} title={whatIsShopify?.title} paragraphs={[whatIsShopify?.paragraph1, whatIsShopify?.paragraph2]} />
}
