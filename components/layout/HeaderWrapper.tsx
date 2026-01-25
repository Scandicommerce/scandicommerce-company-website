import { client } from '@/sanity/lib/client'
import { headerSettingsQuery } from '@/sanity/lib/queries'
import Header from './Header'

export interface HeaderSettingsData {
  _id?: string
  settingsTitle?: string
  servicesMenu?: {
    label?: string
    items?: {
      label?: string
      href?: string
    }[]
  }
  shopifyMenu?: {
    label?: string
    items?: {
      label?: string
      href?: string
    }[]
  }
  mainNavLinks?: {
    label?: string
    href?: string
  }[]
  ctaButton?: {
    label?: string
    href?: string
  }
}

export default async function HeaderWrapper() {
  const settings: HeaderSettingsData = await client.fetch(
    headerSettingsQuery,
    {},
    { next: { revalidate: 60 } } // Cache for 60 seconds
  )

  return <Header settings={settings} />
}
