import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DevelopmentPage, { developmentMetadata } from '@/components/pages/services/DevelopmentPage'
import { getLanguageFromParams } from '@/lib/language'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return developmentMetadata(getLanguageFromParams({ lang }))
}

export default async function DevelopmentRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // scandicommerce.com IA (en, sv, da, de); Norwegian lives under /tjenester.
  // Languages without their own copy render the English version.
  if (language === 'no') notFound()

  return <DevelopmentPage language={language} />
}
