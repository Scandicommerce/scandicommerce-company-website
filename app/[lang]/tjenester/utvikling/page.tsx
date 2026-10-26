import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DevelopmentPage, { developmentMetadata } from '@/components/pages/services/DevelopmentPage'
import { getLanguageFromParams } from '@/lib/language'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return developmentMetadata(getLanguageFromParams({ lang }))
}

export default async function UtviklingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // Norwegian IA only; the English site serves this page under /services.
  if (language !== 'no') notFound()

  return <DevelopmentPage language={language} />
}
