import { CtaBand } from '@/components/integrations/LinkBlocks'
import { ensureInternalHref } from '@/lib/routes'

interface CTAData {
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  ctaButtonLink?: string
}

interface ReadyForOmnichannelProps {
  cta?: CTAData
}

/** Closing CTA, the same ink band that ends every other service page. */
export default function ReadyForOmnichannel({ cta }: ReadyForOmnichannelProps) {
  if (!cta?.ctaTitle && !cta?.ctaButtonText) return null
  return (
    <CtaBand
      heading={cta?.ctaTitle || ''}
      text={cta?.ctaDescription}
      buttonLabel={cta?.ctaButtonText || 'Kontakt oss'}
      buttonHref={ensureInternalHref(cta?.ctaButtonLink)}
    />
  )
}
