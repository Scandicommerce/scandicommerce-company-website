'use client'

import { useEffect, useState } from 'react'
import { readConsent, updateGtagConsent, type ConsentState } from '@/lib/consent'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-W9VS4NHX'
const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID

function loadScriptOnce(id: string, src: string) {
  if (document.getElementById(id)) return
  const s = document.createElement('script')
  s.id = id
  s.async = true
  s.defer = true
  s.src = src
  document.head.appendChild(s)
}

function loadGtm() {
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
  loadScriptOnce('sc-gtm', `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`)
}

function loadHubSpot() {
  if (!HUBSPOT_PORTAL_ID) return
  loadScriptOnce('hs-script-loader', `https://js.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`)
}

/**
 * Loads GTM and the HubSpot tracking code ONLY after the visitor has consented
 * (see CookieConsent + lib/consent). Google Consent Mode v2 defaults are set to
 * "denied" in the root layout before anything else runs.
 */
export default function TrackingScripts() {
  const [consent, setConsent] = useState<ConsentState | null>(null)

  useEffect(() => {
    setConsent(readConsent())
    const onChange = (e: Event) => setConsent((e as CustomEvent<ConsentState>).detail)
    window.addEventListener('sc-consent-changed', onChange)
    return () => window.removeEventListener('sc-consent-changed', onChange)
  }, [])

  useEffect(() => {
    if (!consent) return
    updateGtagConsent(consent)
    if (consent.analytics) loadGtm()
    if (consent.marketing) loadHubSpot()
  }, [consent])

  return null
}
