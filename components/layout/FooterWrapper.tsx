import { client } from '@/sanity/lib/client'
import { footerSettingsQuery } from '@/sanity/lib/queries'
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
  const settings: FooterSettingsData = await client.fetch(
    footerSettingsQuery,
    {},
    { next: { revalidate: 60 } } // Cache for 60 seconds
  )

  return <Footer settings={settings} />
}
