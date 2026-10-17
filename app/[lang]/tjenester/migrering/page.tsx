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

export default async function MigreringPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // Norwegian IA only; the English site serves this page under /services.
  if (language !== 'no') notFound()

  return <MigrationPage language={language} />
}
