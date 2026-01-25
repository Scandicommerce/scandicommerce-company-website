import { NextResponse } from 'next/server'
import { getShopifyProducts } from '@/lib/shopify'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '250', 10)

    const products = await getShopifyProducts(limit)

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    })
  } catch (error) {
    console.error('Error in /api/products:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        products: [],
      },
      { status: 500 }
    )
  }
}