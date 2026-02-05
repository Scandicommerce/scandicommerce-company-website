'use client'

import { useState } from 'react'
import { HiShoppingBag, HiCheck } from 'react-icons/hi2'
import { motion } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui'

interface PackageAddToCartProps {
  variantId: string
  productTitle: string
  quantity?: number
  className?: string
}

export default function PackageAddToCart({
  variantId,
  productTitle,
  quantity = 1,
  className = '',
}: PackageAddToCartProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    if (!variantId) {
      setError('Product variant ID is required')
      return
    }

    setIsAddingToCart(true)
    setError(null)

    const result = await addToCart(variantId, quantity, productTitle)

    if (result.success) {
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 2000)
    } else {
      setError(result.error || 'Failed to add to cart')
    }

    setIsAddingToCart(false)
  }

  return (
    <div className={className}>
      <Button
        onClick={handleAddToCart}
        disabled={isAddingToCart || !variantId}
        className={`${isAddingToCart || !variantId
          ? '!bg-gray-300 text-gray-500 cursor-not-allowed'
          : '!bg-[#03C1CA] text-white hover:bg-[#02A8B0]'
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
            <span>Added to Cart!</span>
          </>
        ) : (
          <>
            <HiShoppingBag className="w-5 h-5" />
            <span>Add to Cart</span>
          </>
        )}
      </Button>

      {/* Error Message */}
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
    </div>
  )
}
