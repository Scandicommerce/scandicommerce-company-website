'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  variantId: string
  variantTitle: string
  quantity: number
  price: number
  currencyCode: string
  productTitle: string
  productHandle: string
  image?: string
}

export interface Cart {
  id: string
  checkoutUrl: string
  items: CartItem[]
  totalQuantity: number
  subtotal: number
  currencyCode: string
}

interface CartContextType {
  cart: Cart | null
  isCartOpen: boolean
  isLoading: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addToCart: (variantId: string, quantity: number, productTitle: string) => Promise<{ success: boolean; error?: string }>
  updateLineQuantity: (lineId: string, quantity: number) => Promise<{ success: boolean; error?: string }>
  removeLine: (lineId: string) => Promise<{ success: boolean; error?: string }>
  updateCartFromResponse: (cartData: any, checkoutUrl: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_ID_KEY = 'scandicommerce_cart_id'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), [])

  const updateCartFromResponse = useCallback((cartData: any, checkoutUrl: string) => {
    if (!cartData) return

    if (cartData.id) {
      localStorage.setItem(CART_ID_KEY, cartData.id)
    }

    // Handle the lines array - it's already transformed from edges/nodes in shopify.ts
    const lines = cartData.lines || []
    
    const items: CartItem[] = lines.map((line: any) => {
      // Handle both direct format and merchandise nested format
      const merchandise = line.merchandise || {}
      const product = merchandise.product || {}
      const price = merchandise.price || {}
      
      return {
        id: line.id || '',
        variantId: merchandise.id || line.variantId || '',
        variantTitle: merchandise.title || line.variantTitle || 'Default Title',
        quantity: typeof line.quantity === 'number' ? line.quantity : parseInt(line.quantity) || 1,
        price: typeof price.amount === 'string' ? parseFloat(price.amount) : (price.amount || 0),
        currencyCode: price.currencyCode || 'NOK',
        productTitle: product.title || line.productTitle || '',
        productHandle: product.handle || line.productHandle || '',
        image: product.images?.edges?.[0]?.node?.url || line.image || undefined,
      }
    })

    // Calculate totals from items
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0)

    // Use Shopify's totalQuantity if available, otherwise use calculated
    const finalTotalQuantity = typeof cartData.totalQuantity === 'number' 
      ? cartData.totalQuantity 
      : totalQuantity

    setCart({
      id: cartData.id,
      checkoutUrl: checkoutUrl || cartData.checkoutUrl || '',
      items,
      totalQuantity: finalTotalQuantity,
      subtotal,
      currencyCode: items[0]?.currencyCode || 'NOK',
    })
  }, [])

  const addToCart = useCallback(async (
    variantId: string,
    quantity: number,
    productTitle: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const cartId = localStorage.getItem(CART_ID_KEY)

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: cartId ? 'add' : 'create',
          variantId,
          quantity,
          cartId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      if (data.cart?.id) {
        localStorage.setItem(CART_ID_KEY, data.cart.id)
      }

      updateCartFromResponse(data.cart, data.checkoutUrl)
      openCart()

      return { success: true }
    } catch (error) {
      console.error('Add to cart error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add to cart',
      }
    } finally {
      setIsLoading(false)
    }
  }, [openCart, updateCartFromResponse])

  const updateLineQuantity = useCallback(
    async (lineId: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
      const cartId = cart?.id ?? localStorage.getItem(CART_ID_KEY)
      if (!cartId) return { success: false, error: 'No cart' }

      setIsLoading(true)
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update', cartId, lineId, quantity }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to update')
        if (!data.cart) throw new Error(data.error || 'Cart not returned')
        updateCartFromResponse(data.cart, data.checkoutUrl ?? data.cart.checkoutUrl)
        return { success: true }
      } catch (error) {
        console.error('Update line error:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update quantity',
        }
      } finally {
        setIsLoading(false)
      }
    },
    [cart?.id, updateCartFromResponse]
  )

  const removeLine = useCallback(
    async (lineId: string): Promise<{ success: boolean; error?: string }> => {
      const cartId = cart?.id ?? localStorage.getItem(CART_ID_KEY)
      if (!cartId) return { success: false, error: 'No cart' }

      setIsLoading(true)
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'remove', cartId, lineId }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to remove')
        if (!data.cart) throw new Error(data.error || 'Cart not returned')
        updateCartFromResponse(data.cart, data.checkoutUrl ?? data.cart.checkoutUrl)
        return { success: true }
      } catch (error) {
        console.error('Remove line error:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to remove item',
        }
      } finally {
        setIsLoading(false)
      }
    },
    [cart?.id, updateCartFromResponse]
  )

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY)
    setCart(null)
  }, [])

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      const cartId = localStorage.getItem(CART_ID_KEY)
      if (!cartId) return

      try {
        const response = await fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`)
        if (response.ok) {
          const data = await response.json()
          if (data.cart) {
            updateCartFromResponse(data.cart, data.cart.checkoutUrl)
          }
        } else {
          // Cart not found, clear the stored ID
          localStorage.removeItem(CART_ID_KEY)
        }
      } catch (error) {
        console.error('Failed to load cart:', error)
      }
    }

    loadCart()
  }, [updateCartFromResponse])

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        isLoading,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateLineQuantity,
        removeLine,
        updateCartFromResponse,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
