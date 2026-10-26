import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ShopifyStorePage, { shopifyStoreMetadata } from '@/components/pages/services/ShopifyStorePage'
import { getLanguageFromParams } from '@/lib/language'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return shopifyStoreMetadata(getLanguageFromParams({ lang }))
}

export default async function ShopifyNettbutikkPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // Norwegian IA only; the English site serves this page under /services.
  if (language !== 'no') notFound()

  return <ShopifyStorePage language={language} />
}
