import type { Metadata } from 'next'
import { draftMode, headers } from 'next/headers'
import Script from 'next/script'
import { VisualEditing } from 'next-sanity'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import CartDrawer from '@/components/cart/CartDrawer'
import JsonLd from '@/components/JsonLd'
import { getRequestSite } from '@/lib/schema/request'
import { HTML_LANG_BY_LANGUAGE, isLanguage } from '@/lib/site-config'
import { DEFAULT_OG_IMAGE_PATH } from '@/lib/seo/buildMetadata'
import DraftModeBanner from '@/components/ui/DraftModeBanner'
import CookieConsent from '@/components/tracking/CookieConsent'
import TrackingScripts from '@/components/tracking/TrackingScripts'

/**
 * Root metadata. `metadataBase` is the canonical origin of the site that
 * served the request (TECHNICAL-SEO-SPEC Task 2), so every relative URL Next
 * emits (og:image, icons) is absolute on the right domain. Page routes set
 * their own title/description/canonical via `buildMetadata`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getRequestSite()
  const isNo = site.key === 'no'
  return {
    metadataBase: new URL(site.origin),
    title: isNo
      ? 'scandicommerce – Shopify Plus-byrå i Oslo'
      : 'scandicommerce – Shopify Plus partner agency in Oslo, Norway',
    description: isNo
      ? 'scandicommerce er et Shopify Plus-byrå i Oslo som bygger, migrerer og drifter nettbutikker for norske og nordiske merkevarer – med fastpris og integrasjoner mot Vipps, 24SevenOffice, Tripletex og Bring.'
      : 'scandicommerce is a Shopify Plus partner agency in Oslo, Norway, serving Norway and the Nordics with headed Shopify themes and headless commerce using Sanity, the Storefront API, Hydrogen, Klaviyo and Make.',
    openGraph: {
      siteName: 'scandicommerce',
      locale: site.ogLocale,
      type: 'website',
      images: [{ url: DEFAULT_OG_IMAGE_PATH, width: 1200, height: 630, alt: 'scandicommerce' }],
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const locale = headersList.get('x-locale') || 'en'
  const htmlLang = isLanguage(locale) ? HTML_LANG_BY_LANGUAGE[locale] : locale
  const isDraftMode = draftMode().isEnabled
  return (
    <html lang={htmlLang}>
      <head>
        {/* Google Consent Mode v2 — everything denied by default; the cookie
            banner grants per category and TrackingScripts loads GTM/HubSpot
            only after consent. */}
        <Script
          id="consent-defaults"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`,
          }}
        />
        {/* Preload the two critical brand-font weights to shorten the font chain */}
        <link rel="preload" href="/fonts/space-grotesk-400.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/space-grotesk-700.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <JsonLd />
      </head>
      <body>
        <LanguageProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </LanguageProvider>
        {/* Consent-gated tracking (GTM + HubSpot) and the cookie banner */}
        <TrackingScripts />
        <CookieConsent locale={locale} />
        {/* Visual editing: click-to-edit overlays inside the Presentation tool */}
        {isDraftMode && (
          <>
            <VisualEditing />
            <DraftModeBanner />
          </>
        )}
      </body>
    </html>
  )
}

