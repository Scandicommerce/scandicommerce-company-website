'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useCart } from '@/contexts/CartContext'

const CartDrawer = dynamic(() => import('./CartDrawer'), { ssr: false })

/** Fetches the drawer (and framer-motion with it) the first time the cart opens, then keeps it mounted. */
export default function LazyCartDrawer() {
  const { isCartOpen } = useCart()
  const [opened, setOpened] = useState(false)
  useEffect(() => {
    if (isCartOpen) setOpened(true)
  }, [isCartOpen])
  return opened ? <CartDrawer /> : null
}
