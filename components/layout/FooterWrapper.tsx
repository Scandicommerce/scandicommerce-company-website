import { client } from '@/sanity/lib/client'
import { footerSettingsQuery } from '@/sanity/lib/queries'
import { getQueryParams } from '@/sanity/lib/queryHelpers'
import { getServerLanguage } from '@/lib/language'
import Footer from './Footer'

export interface FooterSettingsData {
  _id?: string
  settingsTitle?: string
  columns?: {
    title?: string
    links?: {
      label?: string
      href?: string
    }[]
  }[]
  connectSection?: {
    title?: string
    email?: string
    phone?: string
    socialLinks?: {
      platform?: string
      url?: string
    }[]
  }
  bottomSection?: {
    badgeText?: string
    orgNumber?: string
    legalLinks?: {
      label?: string
      href?: string
    }[]
    copyrightText?: string
  }
}

export default async function FooterWrapper() {
  // Get language from server (URL params or default)
  const language = await getServerLanguage()
  
  const settings: FooterSettingsData = await client.fetch(
    footerSettingsQuery,
    getQueryParams({}, language),
    { next: { revalidate: 60 } } // Cache for 60 seconds
  )

  return <Footer settings={settings} />
}
