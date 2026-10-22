import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ServicesOverviewPage, { servicesOverviewMetadata } from '@/components/pages/services/ServicesOverviewPage'
import { getLanguageFromParams } from '@/lib/language'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return servicesOverviewMetadata(getLanguageFromParams({ lang }))
}

export default async function TjenesterOverviewPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // Norwegian IA only; the English site serves this page under /services.
  if (language !== 'no') notFound()

  return <ServicesOverviewPage language={language} />
}
