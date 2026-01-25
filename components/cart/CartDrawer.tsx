'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiXMark, HiShoppingBag, HiMinus, HiPlus, HiTrash } from 'react-icons/hi2'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, isLoading } = useCart()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close drawer when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        closeCart()
      }
    }

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isCartOpen, closeCart])

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeCart()
      }
    }

    if (isCartOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => document.removeEventListener('keydown', handleEscape)
  }, [isCartOpen, closeCart])

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl
    }
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            aria-hidden="true"
          />

          {/* Cart Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <HiShoppingBag className="w-6 h-6 text-[#03C1CA]" />
                <h2 className="text-xl font-bold text-[#222222]">
                  Your Cart
                  {cart && cart.totalQuantity > 0 && (
                    <span className="ml-2 text-sm font-normal text-[#666666]">
                      ({cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-[#F5F5F5] rounded-full transition-colors"
                aria-label="Close cart"
              >
                <HiXMark className="w-6 h-6 text-[#222222]" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 py-12">
                  <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-6">
                    <HiShoppingBag className="w-12 h-12 text-[#CCCCCC]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#222222] mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-[#666666] text-center mb-6">
                    Looks like you haven&apos;t added any items to your cart yet.
                  </p>
                  <Link
                    href="/merch"
                    onClick={closeCart}
                    className="px-6 py-3 bg-[#03C1CA] text-white font-medium hover:bg-[#02A8B0] transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-[#E5E5E5]">
                  {cart.items.map((item) => (
                    <li key={item.id} className="px-6 py-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link
                          href={`/merch/${item.productHandle}`}
                          onClick={closeCart}
                          className="relative w-20 h-20 bg-[#F5F5F5] flex-shrink-0 overflow-hidden"
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.productTitle}
                              fill
                              className="object-contain p-2"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <HiShoppingBag className="w-8 h-8 text-[#CCCCCC]" />
                            </div>
                          )}
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/merch/${item.productHandle}`}
                            onClick={closeCart}
                            className="font-medium text-[#222222] hover:text-[#03C1CA] transition-colors line-clamp-1"
                          >
                            {item.productTitle}
                          </Link>
                          {item.variantTitle !== 'Default Title' && (
                            <p className="text-sm text-[#666666] mt-0.5">
                              {item.variantTitle}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-[#666666]">Qty: {item.quantity}</span>
                            </div>
                            <span className="font-mono font-semibold text-[#222222]">
                              {(item.price * item.quantity).toFixed(2)} {item.currencyCode}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer with Totals and Checkout */}
            {cart && cart.items.length > 0 && (
              <div className="border-t border-[#E5E5E5] px-6 py-5 bg-[#F9F9F9]">
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#666666]">Subtotal</span>
                  <span className="font-mono font-bold text-lg text-[#222222]">
                    {cart.subtotal.toFixed(2)} {cart.currencyCode}
                  </span>
                </div>
                <p className="text-xs text-[#666666] mb-4">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full py-4 bg-[#03C1CA] text-white font-semibold hover:bg-[#02A8B0] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
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
                      Processing...
                    </>
                  ) : (
                    'Checkout'
                  )}
                </button>

                {/* Continue Shopping Link */}
                <button
                  onClick={closeCart}
                  className="w-full mt-3 py-3 border border-[#E5E5E5] text-[#222222] font-medium hover:bg-[#F5F5F5] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
