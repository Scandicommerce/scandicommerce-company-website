'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

interface PackageAddToCartProps {
  variantId: string
  productTitle: string
  quantity?: number
  className?: string
  /** Button label; defaults to Norwegian. */
  label?: string
  /** Light button for dark cards. */
  onDark?: boolean
}

const T = { add: 'Legg i handlekurv', adding: 'Legger til …', added: 'Lagt i handlekurven', failed: 'Kunne ikke legge i handlekurven' }

/** Add-to-cart on the site's ink button; success and error states inline. */
export default function PackageAddToCart({ variantId, productTitle, quantity = 1, className = '', label = T.add, onDark = false }: PackageAddToCartProps) {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()

  const handle = async () => {
    if (!variantId || busy) return
    setBusy(true)
    setError(null)
    const result = await addToCart(variantId, quantity, productTitle)
    if (result.success) {
      setDone(true)
      setTimeout(() => setDone(false), 2500)
    } else {
      setError(result.error || T.failed)
    }
    setBusy(false)
  }

  const base = 'inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg px-[22px] py-3 text-sm font-semibold tracking-[0.02em] transition-colors disabled:cursor-wait disabled:opacity-70'
  const tone = onDark ? 'bg-white text-sc-ink-900 hover:bg-sc-ink-50' : 'bg-sc-ink-900 text-white hover:bg-sc-ink-700'
  return (
    <div className={className}>
      <button type="button" onClick={handle} disabled={busy || !variantId} className={`${base} ${tone}`} aria-live="polite">
        {busy ? T.adding : done ? `✓ ${T.added}` : label}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
