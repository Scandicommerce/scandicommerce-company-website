import { NextRequest, NextResponse } from 'next/server'
import { createCart, addToCart, getCart, updateCartLine, removeCartLine } from '@/lib/shopify'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, variantId, quantity: quantityRaw = 1, cartId, lineId } = body
    const quantity = Number(quantityRaw)

    let result

    if (action === 'update' && cartId && lineId != null && !Number.isNaN(quantity)) {
      if (quantity <= 0) {
        result = await removeCartLine(cartId, lineId)
      } else {
        result = await updateCartLine(cartId, lineId, Math.floor(quantity))
      }
    } else if (action === 'remove' && cartId && lineId) {
      result = await removeCartLine(cartId, lineId)
    } else if (action === 'add' && cartId && variantId) {
      result = await addToCart(cartId, variantId, Number.isNaN(quantity) ? 1 : Math.max(1, Math.floor(quantity)))
    } else if (variantId) {
      result = await createCart(variantId, Number.isNaN(quantity) ? 1 : Math.max(1, Math.floor(quantity)))
    } else {
      return NextResponse.json(
        { error: 'Missing or invalid parameters for cart action' },
        { status: 400 }
      )
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      cart: result.cart,
      checkoutUrl: result.checkoutUrl,
    })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Failed to process cart request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cartId')

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      )
    }

    const cart = await getCart(cartId)

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      cart: {
        ...cart,
        checkoutUrl: cart.checkoutUrl
      }
    })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}
