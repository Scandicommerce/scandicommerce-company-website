import { CtaBand } from '@/components/integrations/LinkBlocks'

interface CTAData {
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  ctaButtonLink?: string
}

interface ReadyToBuildProps {
  cta?: CTAData
}

/** Closing CTA, the same ink band that ends the integrations pages. */
export default function ReadyToBuild({ cta }: ReadyToBuildProps) {
  if (!cta?.ctaTitle && !cta?.ctaButtonText) return null
  return <CtaBand heading={cta.ctaTitle || 'Klar for å ta steget?'} text={cta.ctaDescription} buttonLabel={cta.ctaButtonText || 'Book møte'} buttonHref={cta.ctaButtonLink || '/kontakt'} />
}
