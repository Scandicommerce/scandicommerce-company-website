'use client'

import { useState } from 'react'
import { HiCheck, HiShoppingBag } from 'react-icons/hi2'
import { useCart } from '@/contexts/CartContext'
import { ui } from '@/components/integrations/labels'

interface AddOn {
  title?: string
  description?: string
  price?: string
  shopifyProduct?: {
    variantId: string
    productTitle: string
    hasVariants: boolean
    variants: Array<{
      id: string
      title: string
      price: number
      currencyCode: string
      availableForSale: boolean
    }>
  }
}

interface AddOnsData {
  sectionTitle?: string
  sectionSubtitle?: string
  items?: AddOn[]
}

interface FrequentlyAddedTogetherProps {
  addOns?: AddOnsData
}

// Add-on Card Component
function AddOnCard({ addOn, index }: { addOn: AddOn; index: number }) {
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    if (!addOn.shopifyProduct) {
      console.warn(`Add-on "${addOn.title}" does not have a Shopify product associated`)
      // Try to find product by title as fallback
      const handle = addOn.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      if (handle) {
        // Show user-friendly message
        alert(`This add-on "${addOn.title}" is not yet available in our store. Please contact us for more information.`)
      }
      return
    }

    const variantId = addOn.shopifyProduct.hasVariants
      ? addOn.shopifyProduct.variants[0]?.id // Use first variant if multiple exist
      : addOn.shopifyProduct.variantId

    if (!variantId) {
      console.error(`No variant ID found for add-on "${addOn.title}"`)
      alert(`Unable to add "${addOn.title}" to cart. Please try again later.`)
      return
    }

    setIsAdding(true)
    try {
      const result = await addToCart(variantId, 1, addOn.shopifyProduct.productTitle)

      if (result.success) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
      } else {
        alert(result.error || `Failed to add "${addOn.title}" to cart. Please try again.`)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert(`An error occurred while adding "${addOn.title}" to cart. Please try again.`)
    } finally {
      setIsAdding(false)
    }
  }

  const hasShopifyProduct = !!addOn.shopifyProduct
  const isDisabled = isAdding

  return (
    <div className="relative rounded-lg border border-sc-ink-100 bg-white p-6">
      {/* Add to Cart button - top right */}
      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`absolute top-5 right-5 text-white px-4 py-2 text-sm font-semibold tracking-[0.02em] transition-colors hidden sm:flex items-center gap-2 rounded-lg ${isDisabled
          ? 'bg-sc-ink-300 cursor-not-allowed'
          : showSuccess
            ? 'bg-green-500 hover:bg-green-600'
            : hasShopifyProduct
              ? 'bg-sc-ink-900 hover:bg-sc-ink-700'
              : 'bg-sc-ink-400 hover:bg-sc-ink-500'
          }`}
        aria-label={`Add ${addOn.title} to cart`}
        title={!hasShopifyProduct ? `This add-on is not yet available for purchase` : `Add ${addOn.title} to cart`}
      >
        {isAdding ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
        ) : showSuccess ? (
          <>
            <HiCheck className="w-4 h-4" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <HiShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </>
        )}
      </button>

      {/* Title */}
      <h3 className="text-lg font-semibold leading-snug text-sc-ink-900 mb-2 pr-20">
        {addOn.title}
      </h3>

      {/* Description */}
      <p className="text-[15px] leading-relaxed text-sc-ink-600 mb-4">{addOn.description}</p>

      {/* Price */}
      <p className="font-mono text-[20px] font-medium tracking-tight text-sc-ink-900 sm:pb-0 pb-4">
        {addOn.price}
      </p>

      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`text-white px-4 py-2 text-sm font-semibold tracking-[0.02em] transition-colors sm:hidden flex items-center gap-2 rounded-lg ${isDisabled
          ? 'bg-sc-ink-300 cursor-not-allowed'
          : showSuccess
            ? 'bg-green-500 hover:bg-green-600'
            : hasShopifyProduct
              ? 'bg-sc-ink-900 hover:bg-sc-ink-700'
              : 'bg-sc-ink-400 hover:bg-sc-ink-500'
          }`}
        aria-label={`Add ${addOn.title} to cart`}
        title={!hasShopifyProduct ? `This add-on is not yet available for purchase` : `Add ${addOn.title} to cart`}
      >
        {isAdding ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
        ) : showSuccess ? (
          <>
            <HiCheck className="w-4 h-4" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <HiShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  )
}

// Default add-ons
const defaultAddOns: AddOn[] = [
  {
    title: 'CRO Audit',
    description: 'Comprehensive conversion optimization analysis',
    price: '12.000 kr',
  },
  {
    title: 'Monthly Support',
    description: 'Ongoing updates, bug fixes, and improvements',
    price: '8.000 kr/mo',
  },
]

export default function FrequentlyAddedTogether({ addOns }: FrequentlyAddedTogetherProps) {
  const sectionTitle = addOns?.sectionTitle || 'Frequently added together'
  const sectionSubtitle = addOns?.sectionSubtitle || 'Enhance your package with these popular add-ons'
  const items = addOns?.items && addOns.items.length > 0 ? addOns.items : defaultAddOns

  return (
    <section className="bg-sc-ink-50 py-16 lg:py-24">
      <div className={ui.container}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[32px] lg:text-[44px] leading-[1.25] font-bold tracking-[-0.02em] text-sc-ink-900 text-center mb-3">
            {sectionTitle}
          </h2>
          <p className="text-base lg:text-lg leading-relaxed text-sc-ink-600 text-center mb-10">
            {sectionSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((addOn, index) => (
              <AddOnCard key={index} addOn={addOn} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
