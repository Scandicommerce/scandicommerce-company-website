import type { Metadata } from 'next'
import { draftMode, headers } from 'next/headers'
import Script from 'next/script'
import { VisualEditing } from 'next-sanity'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import CartDrawer from '@/components/cart/CartDrawer'
import OrganizationJsonLd from '@/components/OrganizationJsonLd'
import BreadcrumbListJsonLd from '@/components/BreadcrumbListJsonLd'
import RouteJsonLd from '@/components/RouteJsonLd'
import DraftModeBanner from '@/components/ui/DraftModeBanner'
import CookieConsent from '@/components/tracking/CookieConsent'
import TrackingScripts from '@/components/tracking/TrackingScripts'

export const metadata: Metadata = {
  title: 'scandicommerce — Shopify Plus partner agency in Oslo, Norway',
  description:
    'scandicommerce is a Shopify Plus partner agency in Oslo, Norway, serving Norway and the Nordics with headed Shopify themes and headless commerce using Sanity, the Shopify Storefront API, Hydrogen, Klaviyo, and Make.',
  icons: {
    icon: '/images/mainLogoIcon.svg',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const locale = headersList.get('x-locale') || 'en'
  const isDraftMode = draftMode().isEnabled
  return (
    <html lang={locale}>
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
        <OrganizationJsonLd />
        <BreadcrumbListJsonLd />
        <RouteJsonLd />
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

