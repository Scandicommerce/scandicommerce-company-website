import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import MigrationPage, { migrationMetadata } from '@/components/pages/services/MigrationPage'
import { getLanguageFromParams } from '@/lib/language'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return migrationMetadata(getLanguageFromParams({ lang }))
}

export default async function MigrationRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // scandicommerce.com IA (en, sv, da, de); Norwegian lives under /tjenester.
  // Languages without their own copy render the English version.
  if (language === 'no') notFound()

  return <MigrationPage language={language} />
}
