'use client'

import { useState } from 'react'

interface NewsletterFormProps {
  /** Where the signup happened, reported to the backend (e.g. "blog", "footer"). */
  source?: string
  emailPlaceholder?: string
  buttonText?: string
  successText?: string
  /** Tailwind classes for the wrapper, input and button so it can match each surface. */
  className?: string
  inputClassName?: string
  buttonClassName?: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterForm({
  source = 'unknown',
  emailPlaceholder = 'din@epost.no',
  buttonText = 'SUBSCRIBE',
  successText = 'Takk! Du er meldt på.',
  className = 'flex gap-0 mt-2 flex-shrink-0 w-full md:w-auto',
  inputClassName = 'bg-white text-[#1F1D1D] text-sm px-4 py-3 outline-none flex-1 md:w-64 focus:ring-1 focus:ring-teal border border-[#D4D8DB]',
  buttonClassName = 'px-6 py-3 text-[11px] font-bold tracking-[0.10em] uppercase text-[#1F1D1D] bg-[#1EEFFA] hover:bg-teal transition-colors duration-200 whitespace-nowrap shadow-button',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'Noe gikk galt. Prøv igjen senere.')
      }
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Noe gikk galt. Prøv igjen senere.')
    }
  }

  if (status === 'success') {
    return (
      <p className="mt-2 text-sm font-semibold text-[#11848C]" role="status">
        {successText}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={emailPlaceholder}
        aria-label="E-postadresse"
        className={inputClassName}
      />
      <button type="submit" disabled={status === 'loading'} className={buttonClassName}>
        {status === 'loading' ? '…' : buttonText}
      </button>
      {status === 'error' && (
        <span className="sr-only" role="alert">
          {error}
        </span>
      )}
    </form>
  )
}
