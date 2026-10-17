import { CtaBand } from '@/components/integrations/LinkBlocks'
import { contactHref } from '@/lib/routes'

interface CTAData {
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  ctaButtonLink?: string
}

interface ReadyToBuildProps {
  cta?: CTAData
  lang?: string
}

/** Closing CTA, the same ink band that ends the integrations pages. */
export default function ReadyToBuild({ cta, lang }: ReadyToBuildProps) {
  const isNo = (lang ?? 'no') === 'no'
  if (!cta?.ctaTitle && !cta?.ctaButtonText) return null
  return <CtaBand heading={cta.ctaTitle || (isNo ? 'Klar for å ta steget?' : 'Ready to take the next step?')} text={cta.ctaDescription} buttonLabel={cta.ctaButtonText || (isNo ? 'Book møte' : 'Book a call')} buttonHref={cta.ctaButtonLink || contactHref(lang ?? 'no')} />
}
