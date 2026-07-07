'use client'

/** Footer link that reopens the cookie-consent banner (GDPR: consent must be
 * as easy to withdraw as to give). */
export default function ManageCookiesLink({ label }: { label?: string }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('sc-open-cookie-settings'))}
      className="text-inherit hover:text-white transition-colors"
    >
      {label || 'Administrer informasjonskapsler'}
    </button>
  )
}
