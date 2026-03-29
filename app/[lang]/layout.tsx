import { notFound } from 'next/navigation'
import { LOCALE_IDS } from '@/sanity/lib/languages'
import BreadcrumbListJsonLd from '@/components/BreadcrumbListJsonLd'

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  const lang = typeof rawLang === 'string' ? rawLang.toLowerCase() : ''
  if (!lang || !LOCALE_IDS.includes(lang)) {
    notFound()
  }

  return (
    <>
      <BreadcrumbListJsonLd />
      {children}
    </>
  )
}
