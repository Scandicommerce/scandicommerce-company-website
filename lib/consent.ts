/**
 * Cookie-consent state shared by the banner and the tracking-script loader.
 *
 * Consent is stored in a first-party cookie (`sc-consent`) as JSON. Two
 * categories beyond strictly-necessary:
 *  - analytics  → GTM / Google Analytics
 *  - marketing  → HubSpot tracking
 *
 * Events:
 *  - "sc-consent-changed"      dispatched (with detail = ConsentState) after save
 *  - "sc-open-cookie-settings" dispatched by e.g. the footer link to reopen the banner
 */

export interface ConsentState {
  analytics: boolean
  marketing: boolean
  /** epoch ms when the choice was made */
  ts: number
  /** consent schema version — bump to re-prompt everyone */
  v: number
}

export const CONSENT_COOKIE = 'sc-consent'
export const CONSENT_VERSION = 1
const MAX_AGE_DAYS = 180

export function readConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
  if (!match) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')))
    if (parsed?.v !== CONSENT_VERSION) return null
    return parsed as ConsentState
  } catch {
    return null
  }
}

export function writeConsent(analytics: boolean, marketing: boolean): ConsentState {
  const state: ConsentState = { analytics, marketing, ts: Date.now(), v: CONSENT_VERSION }
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
    JSON.stringify(state)
  )}; path=/; max-age=${maxAge}; SameSite=Lax`
  updateGtagConsent(state)
  window.dispatchEvent(new CustomEvent('sc-consent-changed', { detail: state }))
  return state
}

/** Google Consent Mode v2 update (defaults are set to denied in the root layout). */
export function updateGtagConsent(state: ConsentState) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  w.gtag?.('consent', 'update', {
    analytics_storage: state.analytics ? 'granted' : 'denied',
    ad_storage: state.marketing ? 'granted' : 'denied',
    ad_user_data: state.marketing ? 'granted' : 'denied',
    ad_personalization: state.marketing ? 'granted' : 'denied',
  })
}
