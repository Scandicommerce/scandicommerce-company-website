import { client } from '@/sanity/lib/client'
import { headerSettingsQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getServerLanguage } from '@/lib/language'
import Header from './Header'

export interface HeaderSettingsData {
  _id?: string
  settingsTitle?: string
  servicesMenu?: {
    label?: string
    items?: {
      label?: string
      href?: string
      slug?: string
    }[]
  }
  shopifyMenu?: {
    label?: string
    items?: {
      label?: string
      href?: string
      slug?: string
    }[]
  }
  mainNavLinks?: {
    label?: string
    href?: string
    slug?: string
  }[]
  ctaButton?: {
    label?: string
    href?: string
    slug?: string
  }
}

export default async function HeaderWrapper() {
  // Get language from server (URL params or default)
  const language = await getServerLanguage()
  
  const settings: HeaderSettingsData = await client.fetch(
    headerSettingsQuery,
    getQueryParams({}, language),
    { next: { revalidate: 60 } } // Cache for 60 seconds
  )

  return <Header settings={settings} />
}
