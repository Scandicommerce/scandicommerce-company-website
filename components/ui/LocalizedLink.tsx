'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { isLocaleId } from '@/sanity/lib/languages'

type LocalizedLinkProps = React.ComponentProps<typeof Link>

const LOCALE_PREFIX = /^\/(en|no|sv|da|de)(\/|$)/i

/**
 * Link that keeps the visitor in their language. The language context only
 * knows the language after hydration, so the prefix is also derived from the
 * pathname here: server HTML for /sv/... links to /sv/..., not to English.
 */
export default function LocalizedLink({ href, ...rest }: LocalizedLinkProps) {
  const { localizedHref } = useLanguage()
  const pathname = usePathname() || '/'
  const seg = pathname.split('/')[1]?.toLowerCase() ?? ''
  const prefix = seg && isLocaleId(seg) ? seg : null
  let resolved = typeof href === 'string' ? localizedHref(href) : href
  if (typeof resolved === 'string' && prefix && resolved.startsWith('/') && !resolved.startsWith('//') && !LOCALE_PREFIX.test(resolved) && !resolved.startsWith('/api/')) {
    resolved = resolved === '/' ? `/${prefix}` : `/${prefix}${resolved}`
  }
  return <Link href={resolved} {...rest} />
}
