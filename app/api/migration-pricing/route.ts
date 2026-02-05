import { NextRequest, NextResponse } from 'next/server'

const LITEXTENSION_API = 'https://api.litextension.com/api/price-all-in-one'

function getFallbackPricing(
  products: string,
  customers: string,
  orders: string
) {
  const productsNum = parseInt(products) || 0
  const customersNum = parseInt(customers) || 0
  const ordersNum = parseInt(orders) || 0
  const totalEntities = productsNum + customersNum + ordersNum

  let basePrice = 0
  if (totalEntities <= 100) {
    basePrice = 49
  } else if (totalEntities <= 1000) {
    basePrice = 69 + (totalEntities - 100) * 0.05
  } else if (totalEntities <= 10000) {
    basePrice = 119 + (totalEntities - 1000) * 0.03
  } else if (totalEntities <= 50000) {
    basePrice = 389 + (totalEntities - 10000) * 0.02
  } else {
    basePrice = 1189 + (totalEntities - 50000) * 0.01
  }

  let estimatedDays = 1
  if (totalEntities > 1000) estimatedDays = 2
  if (totalEntities > 10000) estimatedDays = 3
  if (totalEntities > 50000) estimatedDays = 5
  if (totalEntities > 100000) estimatedDays = 7

  return { price: Math.round(basePrice), time: estimatedDays, estimated: true }
}

/** Normalize Litextension API response to { price, time, estimated? } */
function normalizePricingResponse(data: unknown): {
  price: number
  time: number
  estimated?: boolean
} {
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    const price =
      typeof obj.price === 'number'
        ? obj.price
        : typeof obj.total === 'number'
          ? obj.total
          : typeof obj.amount === 'number'
            ? obj.amount
            : NaN
    const time =
      typeof obj.time === 'number'
        ? obj.time
        : typeof obj.days === 'number'
          ? obj.days
          : typeof obj.duration === 'number'
            ? obj.duration
            : NaN
    if (!Number.isNaN(price) && !Number.isNaN(time)) {
      return {
        price,
        time,
        estimated: obj.estimated === true,
      }
    }
  }
  throw new Error('Invalid API response shape')
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const source = searchParams.get('source')
  const target = searchParams.get('target')
  const products = searchParams.get('products')
  const customers = searchParams.get('customers')
  const orders = searchParams.get('orders')

  if (!source || !target || !products || !customers || !orders) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  }

  // Litextension API target list includes 'shopify' but not 'shopifyplus' – map to shopify
  const targetForApi = target === 'shopifyplus' ? 'shopify' : target

  const query = new URLSearchParams({
    source,
    target: targetForApi,
    products,
    customers,
    orders,
  })
  const blogs = searchParams.get('blogs')
  if (blogs != null && blogs !== '') {
    query.set('blogs', blogs)
  }
  const apiUrl = `${LITEXTENSION_API}?${query.toString()}`

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(process.env.LITEXTENSION_API_KEY && {
          Authorization: `Bearer ${process.env.LITEXTENSION_API_KEY}`,
        }),
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      return NextResponse.json(
        getFallbackPricing(products, customers, orders)
      )
    }

    const data = await response.json()
    const normalized = normalizePricingResponse(data)
    return NextResponse.json(normalized)
  } catch (error) {
    console.error('Migration pricing API error:', error)
    return NextResponse.json(
      getFallbackPricing(products, customers, orders)
    )
  }
}
