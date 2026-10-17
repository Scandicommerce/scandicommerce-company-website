'use client'

import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { isLocaleId } from '@/sanity/lib/languages'
import { CtaBand } from '@/components/integrations/LinkBlocks'

interface CTAData {
  title?: string
  description?: string
  buttonText?: string
  buttonSlug?: string | null
  buttonLink?: string | null
}

interface CTAProps {
  cta?: CTAData
}

const LOCALE_PREFIX = /^\/(en|no|sv|da|de)(\/|$)/i

/**
 * Shared closing CTA for the Shopify sub-pages (PIM, AI, Why Shopify, Vipps),
 * on the CtaBand the integrations pages use. The href is localised the same
 * way LocalizedLink does it, so /en/... stays in English.
 */
export default function CTA({ cta }: CTAProps) {
  const { localizedHref } = useLanguage()
  const pathname = usePathname() || '/'
  const title = cta?.title
  const buttonText = cta?.buttonText
  if (!title || !buttonText) return null

  const raw = cta?.buttonSlug ? `/${cta.buttonSlug}` : cta?.buttonLink || '/contact'
  let href = localizedHref(raw)
  const seg = pathname.split('/')[1]?.toLowerCase() ?? ''
  const prefix = seg && isLocaleId(seg) ? seg : null
  if (prefix && href.startsWith('/') && !href.startsWith('//') && !LOCALE_PREFIX.test(href) && !href.startsWith('/api/')) {
    href = href === '/' ? `/${prefix}` : `/${prefix}${href}`
  }

  return <CtaBand heading={title} text={cta?.description} buttonLabel={buttonText} buttonHref={href} />
}
