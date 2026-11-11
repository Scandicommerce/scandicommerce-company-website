'use client'

import { useId, useState } from 'react'
import LocalizedLink from '@/components/ui/LocalizedLink'
import type { NewsletterVariant } from '@/lib/hubspot'
import { EMAIL_RE, newsletterCopy } from '@/lib/newsletterCopy'

interface NewsletterFormProps {
  /** Placement (footer | section | inline). Shown in the fallback email as `${variant}:${pathname}`. */
  variant: NewsletterVariant
  language?: string | null
  /** Per-block overrides from Sanity; empty falls back to the language default. */
  emailPlaceholder?: string | null
  buttonText?: string | null
  successText?: string | null
  /** `dark` for dark backgrounds (footer), `light` elsewhere. Sets the helper text colours. */
  tone?: 'light' | 'dark'
  /** Tailwind classes for the input row, input and button so it can match each surface. */
  className?: string
  inputClassName?: string
  buttonClassName?: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterForm({
  variant,
  language,
  emailPlaceholder,
  buttonText,
  successText,
  tone = 'light',
  className = 'flex w-full flex-col gap-3 sm:flex-row',
  inputClassName = 'min-h-[46px] flex-1 rounded-lg border border-sc-ink-200 bg-white px-4 py-3 text-sm text-sc-ink-900 placeholder:text-sc-ink-400 focus:border-sc-ink-900 focus:outline-none sm:w-72',
  buttonClassName = 'min-h-[46px] whitespace-nowrap rounded-lg bg-sc-cyan-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sc-cyan-600 disabled:opacity-60',
}: NewsletterFormProps) {
  const copy = newsletterCopy(language)
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const id = useId()
  const errorId = `${id}-error`

  const muted = tone === 'dark' ? 'text-[#8a95a0]' : 'text-sc-ink-500'
  const link = tone === 'dark' ? 'underline hover:text-white' : 'underline hover:text-sc-ink-900'
  const errorColor = tone === 'dark' ? 'text-[#ff8a80]' : 'text-[#c0392b]'
  const successColor = tone === 'dark' ? 'text-sc-cyan-500' : 'text-[#11848C]'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return

    const value = email.trim()
    if (!EMAIL_RE.test(value)) {
      setStatus('error')
      setError(copy.invalidEmail)
      return
    }

    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: value,
          variant,
          language,
          pageUri: window.location.href,
          pageName: document.title,
          website,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data?.error === 'string' ? data.error : copy.genericError)
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error && err.message ? err.message : copy.genericError)
    }
  }

  if (status === 'success') {
    return (
      <p className={`m-0 mt-2 text-sm font-semibold ${successColor}`} role="status">
        {successText || copy.success}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className={className}>
        <label htmlFor={`${id}-email`} className="sr-only">
          {copy.emailLabel}
        </label>
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder={emailPlaceholder || copy.placeholder}
          aria-invalid={status === 'error'}
          aria-describedby={status === 'error' ? errorId : undefined}
          className={inputClassName}
        />
        <button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'} className={buttonClassName}>
          {status === 'loading' ? copy.sending : buttonText || copy.button}
        </button>
      </div>

      {/* Honeypot: hidden from people and screen readers, filled in by bots. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {status === 'error' && error && (
        <p id={errorId} role="alert" className={`m-0 mt-2 text-[13px] ${errorColor}`}>
          {error}
        </p>
      )}
      <p className={`m-0 mt-2 text-[11px] leading-relaxed ${muted}`}>
        {copy.consent}{' '}
        <LocalizedLink href={copy.privacyHref} className={link}>
          {copy.privacyLabel}
        </LocalizedLink>
      </p>
    </form>
  )
}
