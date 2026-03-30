import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import CartDrawer from '@/components/cart/CartDrawer'
import OrganizationJsonLd from '@/components/OrganizationJsonLd'
import BreadcrumbListJsonLd from '@/components/BreadcrumbListJsonLd'
import RouteJsonLd from '@/components/RouteJsonLd'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-W9VS4NHX'

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
  return (
    <html lang={locale}>
      <head>
        {/* Google Tag Manager — loaded early via beforeInteractive strategy */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <OrganizationJsonLd />
        <BreadcrumbListJsonLd />
        <RouteJsonLd />
      </head>
      <body>
        {/* GTM noscript fallback for users without JavaScript */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <LanguageProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

