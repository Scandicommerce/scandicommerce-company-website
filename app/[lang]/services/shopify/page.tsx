import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ShopifyStorePage, { shopifyStoreMetadata } from '@/components/pages/services/ShopifyStorePage'
import { getLanguageFromParams } from '@/lib/language'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return shopifyStoreMetadata(getLanguageFromParams({ lang }))
}

export default async function ShopifyStoreRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = getLanguageFromParams({ lang })
  // scandicommerce.com IA (en, sv, da, de); Norwegian lives under /tjenester.
  // Languages without their own copy render the English version.
  if (language === 'no') notFound()

  return <ShopifyStorePage language={language} />
}
