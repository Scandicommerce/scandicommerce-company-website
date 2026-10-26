'use client'

import { useState } from 'react'
import { ui } from '@/components/integrations/labels'

interface NewsletterData {
  title?: string
  description?: string
  emailPlaceholder?: string
  buttonText?: string
  successMessage?: string
}

interface NewsletterProps {
  newsletter?: NewsletterData
}

/** Merch newsletter on the ink CTA band: heading and lead left, the form right. */
export default function Newsletter({ newsletter }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const title = newsletter?.title || 'Want Exclusive Drops?'
  const description = newsletter?.description || 'Be the first to know about new merch releases, limited editions, and special discounts.'
  const emailPlaceholder = newsletter?.emailPlaceholder || 'your@email.com'
  const buttonText = newsletter?.buttonText || 'Subscribe'
  const successMessage = newsletter?.successMessage || "Thanks for subscribing! We'll keep you updated."

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'merch' }),
      })
      if (!res.ok) throw new Error('Subscribe failed')
      setIsSubmitted(true)
      setEmail('')
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      console.error('Newsletter signup failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-sc-ink-900 py-16 text-white lg:py-20">
      <div className={`${ui.container} flex flex-wrap items-center justify-between gap-8`}>
        <div className="flex max-w-[560px] flex-col gap-3">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-sc-cyan-300">Newsletter</div>
          <h2 className="m-0 text-[32px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[36px]">{title}</h2>
          <p className="m-0 text-lg leading-relaxed text-sc-ink-200">{description}</p>
        </div>

        <div className="w-full max-w-[440px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="merch-newsletter-email">
              Email
            </label>
            <input
              id="merch-newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={emailPlaceholder}
              className="min-h-[46px] flex-1 rounded-lg border border-sc-ink-600 bg-sc-ink-800 px-4 py-3 text-sm text-white placeholder:text-sc-ink-400 focus:border-sc-cyan-300 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-[46px] items-center justify-center whitespace-nowrap rounded-lg bg-white px-[22px] py-3 text-sm font-semibold tracking-[0.02em] text-sc-ink-900 transition-colors hover:bg-sc-ink-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Subscribing...' : buttonText}
            </button>
          </form>

          {isSubmitted && (
            <p className="m-0 mt-3 text-sm text-sc-cyan-300" role="status">
              {successMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
