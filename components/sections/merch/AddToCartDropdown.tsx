'use client'

import { useState, useRef, useEffect } from 'react'
import { HiChevronDown, HiCheck, HiShoppingBag } from 'react-icons/hi2'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'

interface Variant {
  id: string
  title: string
  price: number
  currencyCode: string
  availableForSale: boolean
}

interface AddToCartDropdownProps {
  variants: Variant[]
  productTitle: string
  quantity: number
  onVariantSelect?: (variant: Variant | null) => void
}

export default function AddToCartDropdown({
  variants,
  productTitle,
  quantity,
  onVariantSelect,
}: AddToCartDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { addToCart } = useCart()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-select if only one variant
  useEffect(() => {
    if (variants.length === 1) {
      const variant = variants[0]
      setSelectedVariant(variant)
      onVariantSelect?.(variant)
    }
  }, [variants, onVariantSelect])

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant)
    setIsDropdownOpen(false)
    setError(null)
    onVariantSelect?.(variant)
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setError('Please select a variant')
      setIsDropdownOpen(true)
      return
    }

    if (!selectedVariant.availableForSale) {
      setError('This variant is out of stock')
      return
    }

    setIsAddingToCart(true)
    setError(null)

    const result = await addToCart(selectedVariant.id, quantity, productTitle)

    if (result.success) {
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 2000)
    } else {
      setError(result.error || 'Failed to add to cart')
    }

    setIsAddingToCart(false)
  }

  const hasMultipleVariants = variants.length > 1
  const availableVariants = variants.filter(v => v.availableForSale)
  const hasAvailableVariants = availableVariants.length > 0

  return (
    <div className="relative w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Variant Selector Dropdown */}
        {hasMultipleVariants && (
          <div ref={dropdownRef} className="relative flex-1">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex min-h-[46px] w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-left text-sm transition-colors ${
                error && !selectedVariant
                  ? 'border-red-500 bg-red-50'
                  : selectedVariant
                  ? 'border-sc-ink-900'
                  : 'border-sc-ink-300 hover:border-sc-ink-500'
              }`}
            >
              <span className={selectedVariant ? 'font-semibold text-sc-ink-900' : 'text-sc-ink-500'}>
                {selectedVariant ? selectedVariant.title : 'Select Option'}
              </span>
              <HiChevronDown
                className={`h-4 w-4 text-sc-ink-500 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-sc-ink-200 bg-white shadow-lg"
                >
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSelect(variant)}
                      disabled={!variant.availableForSale}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                        !variant.availableForSale
                          ? 'cursor-not-allowed bg-sc-ink-50 text-sc-ink-400'
                          : selectedVariant?.id === variant.id
                          ? 'bg-sc-ink-900 text-white'
                          : 'text-sc-ink-900 hover:bg-sc-ink-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{variant.title}</span>
                        {!variant.availableForSale && (
                          <span className="text-xs text-red-500">Out of stock</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px]">
                          {variant.price} {variant.currencyCode}
                        </span>
                        {selectedVariant?.id === variant.id && (
                          <HiCheck className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !hasAvailableVariants}
          className={`inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-lg px-[22px] py-3 text-sm font-semibold tracking-[0.02em] transition-colors ${
            isAddingToCart || !hasAvailableVariants
              ? 'cursor-not-allowed bg-sc-ink-200 text-sc-ink-500'
              : showSuccessMessage
              ? 'bg-green-500 text-white'
              : 'bg-sc-ink-900 text-white hover:bg-sc-ink-700'
          }`}
        >
          {isAddingToCart ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Adding...</span>
            </>
          ) : showSuccessMessage ? (
            <>
              <HiCheck className="w-5 h-5" />
              <span>Added!</span>
            </>
          ) : !hasAvailableVariants ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <HiShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm mt-3"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
