/**
 * HubSpot settings shared by the tracking loader and the newsletter route.
 *
 * Portal 49119369 lives in the EU data centre, so the tracking script loads
 * from the eu1 host. The portal ID is public (it is in every page
 * that loads the tracking code), so it has a safe default; env still wins.
 */
export const HUBSPOT_PORTAL_ID =
  process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '49119369'

export const HUBSPOT_TRACKING_SRC = `https://js-eu1.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`

export const HUBSPOT_FORMS_SUBMIT_URL = (portalId: string, formGuid: string) =>
  `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`

/** Where a signup block sits. `seksjon` is the legacy value of `section`. */
export type NewsletterVariant = 'footer' | 'section' | 'inline'

export function normalizeVariant(value: unknown): NewsletterVariant {
  if (value === 'footer' || value === 'inline') return value
  if (value === 'section' || value === 'seksjon') return 'section'
  return 'inline'
}
