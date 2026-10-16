import { sanityPageFetch } from '@/sanity/lib/fetch'
import { headerSettingsQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getServerLanguage } from '@/lib/language'
import type { NavCta, NavItem } from '@/lib/navigation'
import Header from './Header'

export interface HeaderSettingsData {
  _id?: string
  settingsTitle?: string
  menu?: NavItem[]
  ctaButton?: NavCta
}

export default async function HeaderWrapper() {
  // Get language from server (URL params or default)
  const language = await getServerLanguage()

  const settings: HeaderSettingsData = await sanityPageFetch(
    headerSettingsQuery,
    getQueryParams({}, language),
    { next: { revalidate: 60 } } // Cache for 60 seconds
  )

  return <Header settings={settings} language={language} />
}
