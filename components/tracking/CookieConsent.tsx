'use client'

import { useEffect, useState } from 'react'
import { readConsent, writeConsent } from '@/lib/consent'

interface CookieConsentProps {
  locale?: string
}

const COPY = {
  no: {
    title: 'Informasjonskapsler',
    body: 'Vi bruker informasjonskapsler til analyse og markedsføring (Google, HubSpot). Nødvendige kapsler er alltid på. Du kan endre valget når som helst nederst på siden.',
    acceptAll: 'Godta alle',
    necessaryOnly: 'Kun nødvendige',
    customize: 'Tilpass',
    save: 'Lagre valg',
    analytics: 'Analyse',
    analyticsHint: 'Hjelper oss å forstå hvordan siden brukes (Google Analytics / GTM).',
    marketing: 'Markedsføring',
    marketingHint: 'Lar oss følge opp henvendelser og måle kampanjer (HubSpot).',
    privacy: 'Personvern',
  },
  en: {
    title: 'Cookies',
    body: 'We use cookies for analytics and marketing (Google, HubSpot). Necessary cookies are always on. You can change your choice anytime at the bottom of the page.',
    acceptAll: 'Accept all',
    necessaryOnly: 'Necessary only',
    customize: 'Customize',
    save: 'Save choices',
    analytics: 'Analytics',
    analyticsHint: 'Helps us understand how the site is used (Google Analytics / GTM).',
    marketing: 'Marketing',
    marketingHint: 'Lets us follow up enquiries and measure campaigns (HubSpot).',
    privacy: 'Privacy policy',
  },
}

export default function CookieConsent({ locale }: CookieConsentProps) {
  const t = COPY[locale === 'no' ? 'no' : 'en']
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(true)

  useEffect(() => {
    const existing = readConsent()
    if (!existing) setOpen(true)

    const reopen = () => {
      const current = readConsent()
      setAnalytics(current?.analytics ?? true)
      setMarketing(current?.marketing ?? true)
      setExpanded(true)
      setOpen(true)
    }
    window.addEventListener('sc-open-cookie-settings', reopen)
    return () => window.removeEventListener('sc-open-cookie-settings', reopen)
  }, [])

  if (!open) return null

  function save(a: boolean, m: boolean) {
    const before = readConsent()
    writeConsent(a, m)
    setOpen(false)
    setExpanded(false)
    // Downgrading consent can't unload already-running scripts — reload for a clean state.
    if (before && ((before.analytics && !a) || (before.marketing && !m))) {
      window.location.reload()
    }
  }

  return (
    <div
      role="dialog"
      aria-label={t.title}
      className="fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md z-[9998] bg-white border border-sc-ink-100 rounded-t-[10px] sm:rounded-[10px] shadow-lg p-4 sm:p-5"
    >
      <div className="font-bold text-sc-ink-900 mb-1 text-sm sm:text-base">{t.title}</div>
      <p className="text-[12px] sm:text-[13px] leading-snug sm:leading-relaxed text-sc-ink-600 m-0 mb-3 sm:mb-4">{t.body}</p>

      {expanded && (
        <div className="mb-4 flex flex-col gap-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#16a7b3]"
            />
            <span>
              <span className="block text-sm font-semibold text-sc-ink-900">{t.analytics}</span>
              <span className="block text-xs text-sc-ink-400">{t.analyticsHint}</span>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#16a7b3]"
            />
            <span>
              <span className="block text-sm font-semibold text-sc-ink-900">{t.marketing}</span>
              <span className="block text-xs text-sc-ink-400">{t.marketingHint}</span>
            </span>
          </label>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {expanded ? (
          <button
            onClick={() => save(analytics, marketing)}
            className="rounded-lg bg-sc-cyan-500 hover:bg-sc-cyan-600 text-white text-[13px] font-semibold px-4 py-2.5 transition-colors"
          >
            {t.save}
          </button>
        ) : (
          <button
            onClick={() => save(true, true)}
            className="rounded-lg bg-sc-cyan-500 hover:bg-sc-cyan-600 text-white text-[13px] font-semibold px-4 py-2.5 transition-colors"
          >
            {t.acceptAll}
          </button>
        )}
        <button
          onClick={() => save(false, false)}
          className="rounded-lg border border-sc-ink-200 text-sc-ink-900 hover:bg-sc-ink-50 text-[13px] font-semibold px-4 py-2.5 transition-colors"
        >
          {t.necessaryOnly}
        </button>
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-[13px] font-semibold text-sc-ink-500 hover:text-sc-ink-900 px-2 py-2.5 transition-colors"
          >
            {t.customize}
          </button>
        )}
      </div>
    </div>
  )
}
