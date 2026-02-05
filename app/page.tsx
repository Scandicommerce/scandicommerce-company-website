import { redirect } from 'next/navigation'
import { defaultLanguage } from '@/sanity/lib/languages'

export default function RootPage() {
  redirect(`/${defaultLanguage}`)
}
