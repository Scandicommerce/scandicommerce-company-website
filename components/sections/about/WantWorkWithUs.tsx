import { contactHref, ensureInternalHref } from '@/lib/routes'
import { CtaBand } from '@/components/integrations/LinkBlocks'

interface CTAData {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

/** Closing CTA, the same ink band that ends every other page. */
export default function WantWorkWithUs({ cta, lang = 'no' }: { cta?: CTAData; lang?: string }) {
  if (!cta?.title && !cta?.buttonText) return null
  const href = cta?.buttonLink ? ensureInternalHref(cta.buttonLink) : contactHref(lang)
  return <CtaBand heading={cta?.title || 'Vil du jobbe med oss?'} text={cta?.description} buttonLabel={cta?.buttonText || 'Book en samtale'} buttonHref={href} />
}
