'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

type LocalizedLinkProps = React.ComponentProps<typeof Link>

export default function LocalizedLink({ href, ...rest }: LocalizedLinkProps) {
  const { localizedHref } = useLanguage()
  const resolvedHref = typeof href === 'string' ? localizedHref(href) : href
  return <Link href={resolvedHref} {...rest} />
}
