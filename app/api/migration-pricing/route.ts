import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const source = searchParams.get('source')
  const target = searchParams.get('target')
  const products = searchParams.get('products')
  const customers = searchParams.get('customers')
  const orders = searchParams.get('orders')

  // Validate required parameters
  if (!source || !target || !products || !customers || !orders) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  }

  try {
    const apiUrl = `https://api.litextension.com/api/price-all-in-one?source=${source}&target=${target}&products=${products}&customers=${customers}&orders=${orders}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any required API headers here if needed
        // 'Authorization': `Bearer ${process.env.LITEXTENSION_API_KEY}`,
      },
    })

    if (!response.ok) {
      // If the external API fails, return a calculated estimate instead
      // This is a fallback pricing calculation
      const productsNum = parseInt(products) || 0
      const customersNum = parseInt(customers) || 0
      const ordersNum = parseInt(orders) || 0
      const totalEntities = productsNum + customersNum + ordersNum

      // Base pricing calculation (approximate)
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

      // Estimate time based on entities
      let estimatedDays = 1
      if (totalEntities > 1000) estimatedDays = 2
      if (totalEntities > 10000) estimatedDays = 3
      if (totalEntities > 50000) estimatedDays = 5
      if (totalEntities > 100000) estimatedDays = 7

      return NextResponse.json({
        price: Math.round(basePrice),
        time: estimatedDays,
        estimated: true,
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Migration pricing API error:', error)

    // Fallback calculation if API is unreachable
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

    return NextResponse.json({
      price: Math.round(basePrice),
      time: estimatedDays,
      estimated: true,
    })
  }
}
