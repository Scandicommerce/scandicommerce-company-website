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
              className={`w-full py-4 px-6 border text-left flex items-center justify-between transition-all ${
                error && !selectedVariant
                  ? 'border-red-500 bg-red-50'
                  : selectedVariant
                  ? 'border-[#03C1CA] bg-[#03C1CA]/5'
                  : 'border-[#E5E5E5] hover:border-[#03C1CA]'
              }`}
            >
              <span className={selectedVariant ? 'text-[#222222] font-medium' : 'text-[#666666]'}>
                {selectedVariant ? selectedVariant.title : 'Select Option'}
              </span>
              <HiChevronDown
                className={`w-5 h-5 text-[#666666] transition-transform ${
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
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E5] shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSelect(variant)}
                      disabled={!variant.availableForSale}
                      className={`w-full px-6 py-3 text-left flex items-center justify-between transition-colors ${
                        !variant.availableForSale
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          : selectedVariant?.id === variant.id
                          ? 'bg-[#03C1CA]/10 text-[#03C1CA]'
                          : 'hover:bg-[#F8F8F8] text-[#222222]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{variant.title}</span>
                        {!variant.availableForSale && (
                          <span className="text-xs text-red-500">Out of stock</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">
                          {variant.price} {variant.currencyCode}
                        </span>
                        {selectedVariant?.id === variant.id && (
                          <HiCheck className="w-5 h-5 text-[#03C1CA]" />
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
          className={`flex-1 py-4 px-6 font-medium transition-all flex items-center justify-center gap-2 ${
            isAddingToCart || !hasAvailableVariants
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : showSuccessMessage
              ? 'bg-green-500 text-white'
              : 'bg-[#03C1CA] text-white hover:bg-[#02A8B0]'
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
