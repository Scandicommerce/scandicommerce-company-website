import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import B2bPage, { b2bMetadata } from '@/components/pages/services/B2bPage'
import { getLanguageFromParams } from '@/lib/language'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return b2bMetadata(getLanguageFromParams({ lang }))
}

export default async function B2bRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // scandicommerce.com IA (en, sv, da, de); Norwegian lives under /tjenester.
  // Languages without their own copy render the English version.
  if (language === 'no') notFound()

  return <B2bPage language={language} />
}
