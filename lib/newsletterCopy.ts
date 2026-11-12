/**
 * Default newsletter copy per language. Editors can override the button text
 * and success message per block in Sanity; the consent text is shared because
 * it is the wording HubSpot stores with each opt-in.
 *
 * NO and EN are placeholders until Øyvind supplies the final wording.
 * DA, SV and DE fall back to EN.
 */
export interface NewsletterCopy {
  placeholder: string
  button: string
  sending: string
  success: string
  invalidEmail: string
  genericError: string
  /** Shown under the form and sent to HubSpot as the consent text. */
  consent: string
  privacyLabel: string
  privacyHref: string
  emailLabel: string
}

const COPY: Record<'no' | 'en', NewsletterCopy> = {
  no: {
    placeholder: 'din@epost.no',
    button: 'Meld meg på',
    sending: 'Sender …',
    success: 'Takk! Du er meldt på nyhetsbrevet.',
    invalidEmail: 'Skriv inn en gyldig e-postadresse.',
    genericError: 'Noe gikk galt. Prøv igjen om litt.',
    consent:
      'Ved å melde deg på godtar du å motta nyhetsbrev og markedsføring fra Scandicommerce på e-post. Du kan melde deg av når som helst.',
    privacyLabel: 'Personvern',
    privacyHref: '/legal/personvern',
    emailLabel: 'E-postadresse',
  },
  en: {
    placeholder: 'you@company.com',
    button: 'Subscribe',
    sending: 'Sending …',
    success: 'Thanks! You are subscribed to the newsletter.',
    invalidEmail: 'Enter a valid email address.',
    genericError: 'Something went wrong. Please try again shortly.',
    consent:
      'By subscribing you agree to receive newsletters and marketing emails from Scandicommerce. You can unsubscribe at any time.',
    privacyLabel: 'Privacy policy',
    privacyHref: '/legal/personvern',
    emailLabel: 'Email address',
  },
}

export function newsletterCopy(language?: string | null): NewsletterCopy {
  return language === 'no' ? COPY.no : COPY.en
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
