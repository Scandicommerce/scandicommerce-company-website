'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { sourcePlatforms, targetPlatforms } from '@/lib/platforms'

interface PricingData {
  price: number
  time: number
  estimated?: boolean
}

export default function MigrationCalculator() {
  const [sourcePlatform, setSourcePlatform] = useState<string>('woocommerce')
  const [targetPlatform, setTargetPlatform] = useState<string>('shopify')
  const [numberOfProducts, setNumberOfProducts] = useState<string>('100')
  const [numberOfCustomers, setNumberOfCustomers] = useState<string>('100')
  const [numberOfOrders, setNumberOfOrders] = useState<string>('100')
  const [numberOfBlogs, setNumberOfBlogs] = useState<string>('0')
  const [pricingData, setPricingData] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // Fetch pricing from API (proxies to Litextension price-all-in-one)
  const fetchPricing = useCallback(async (signal?: AbortSignal) => {
    if (
      !sourcePlatform ||
      !targetPlatform ||
      !numberOfProducts ||
      !numberOfCustomers ||
      !numberOfOrders
    ) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        source: sourcePlatform,
        target: targetPlatform,
        products: numberOfProducts,
        customers: numberOfCustomers,
        orders: numberOfOrders,
      })
      if (numberOfBlogs && numberOfBlogs !== '0') {
        params.set('blogs', numberOfBlogs)
      }
      const apiUrl = `/api/migration-pricing?${params.toString()}`
      const response = await fetch(apiUrl, { method: 'GET', signal })

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        throw new Error(
          (errBody as { error?: string }).error || 'Failed to fetch pricing'
        )
      }

      const data = await response.json()

      // Validate API response shape { price, time }
      if (
        typeof data?.price !== 'number' ||
        typeof data?.time !== 'number'
      ) {
        throw new Error('Invalid pricing response')
      }

      setPricingData({
        price: data.price,
        time: data.time,
        estimated: data.estimated === true,
      })
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('Unable to fetch pricing. Please try again.')
      setPricingData(null)
      console.error('API Error:', err)
    } finally {
      setLoading(false)
    }
  }, [
    sourcePlatform,
    targetPlatform,
    numberOfProducts,
    numberOfCustomers,
    numberOfOrders,
    numberOfBlogs,
  ])

  // Fetch pricing when form values change (debounced, cancel previous request)
  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      fetchPricing(controller.signal)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [fetchPricing])

  return (
    <section className="relative overflow-hidden bg-[#00BFC8] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="w-full max-w-2xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-2 uppercase tracking-wider">
              Migration Calculator
            </span>
          </div>

          {/* Title */}
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white text-center mb-4">
            Get Your Migration Quote
          </h2>
          <p className="text-white/90 text-center text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] mb-10">
            Calculate your exact migration cost instantly
          </p>

          {/* White Card with Form */}
          <div className="bg-white shadow-lg px-6 py-8 lg:px-10 lg:py-10">
            <div className="space-y-6">
              {/* Source Platform */}
              <div>
                <label
                  htmlFor="source-platform"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  I&apos;d Like to Migrate From
                </label>
                <div className="relative">
                  <select
                    id="source-platform"
                    value={sourcePlatform}
                    onChange={(e) => setSourcePlatform(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-gray-900 text-base focus:outline-none focus:border-[#03C1CA] appearance-none cursor-pointer"
                  >
                    {sourcePlatforms.map((platform) => (
                      <option key={platform.key} value={platform.key}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Target Platform */}
              <div>
                <label
                  htmlFor="target-platform"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  To
                </label>
                <div className="relative">
                  <select
                    id="target-platform"
                    value={targetPlatform}
                    onChange={(e) => setTargetPlatform(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-gray-900 text-base focus:outline-none focus:border-[#03C1CA] appearance-none cursor-pointer"
                  >
                    {targetPlatforms.map((platform) => (
                      <option key={platform.key} value={platform.key}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Number of Products */}
              <div>
                <label
                  htmlFor="products"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Number of Products
                </label>
                <input
                  type="number"
                  id="products"
                  value={numberOfProducts}
                  onChange={(e) => setNumberOfProducts(e.target.value)}
                  className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-gray-900 text-base focus:outline-none focus:border-[#03C1CA] placeholder-gray-400"
                  placeholder="100"
                  min="0"
                />
              </div>

              {/* Number of Customers */}
              <div>
                <label
                  htmlFor="customers"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Number of Customers
                </label>
                <input
                  type="number"
                  id="customers"
                  value={numberOfCustomers}
                  onChange={(e) => setNumberOfCustomers(e.target.value)}
                  className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-gray-900 text-base focus:outline-none focus:border-[#03C1CA] placeholder-gray-400"
                  placeholder="100"
                  min="0"
                />
              </div>

              {/* Number of Orders */}
              <div>
                <label
                  htmlFor="orders"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Number of Orders
                </label>
                <input
                  type="number"
                  id="orders"
                  value={numberOfOrders}
                  onChange={(e) => setNumberOfOrders(e.target.value)}
                  className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-gray-900 text-base focus:outline-none focus:border-[#03C1CA] placeholder-gray-400"
                  placeholder="100"
                  min="0"
                />
              </div>

              {/* Number of Blogs */}
              <div>
                <label
                  htmlFor="blogs"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Number of Blogs
                </label>
                <input
                  type="number"
                  id="blogs"
                  value={numberOfBlogs}
                  onChange={(e) => setNumberOfBlogs(e.target.value)}
                  className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-gray-900 text-base focus:outline-none focus:border-[#03C1CA] placeholder-gray-400"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Help Text */}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                  ?
                </span>
                <span>How to check the number of entities on your store?</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="mt-10 pt-8 border-t border-[#E5E5E5]">
              <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] text-[#565454] font-bold text-gray-900 mb-6">
                Migration Pricing
              </h3>

              {loading && (
                <div className="flex items-center justify-center gap-3 py-8">
                  <div className="w-6 h-6 border-2 border-[#03C1CA] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600">
                    Calculating your migration cost...
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-center">
                  {error}
                </div>
              )}

              {pricingData && !loading && !error && (
                <div className="bg-[#F8F8F8] border border-[#E5E5E5] p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <span className="block text-sm text-gray-500 mb-1">
                        Total Cost
                      </span>
                      <span className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#03C1CA] font-mono">
                        ${Math.round(pricingData.price).toLocaleString()}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <span className="block text-sm text-gray-500 mb-1">
                        Estimated Time
                      </span>
                      <span className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-gray-900 font-mono">
                        {pricingData.time} days
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!pricingData && !loading && !error && (
                <p className="text-gray-500 text-center py-4">
                  Enter your details to see pricing
                </p>
              )}
            </div>
          </div>

          {/* Bottom Text */}
          <p className="text-white/80 text-center text-sm mt-6">
            99.9% data accuracy • Zero downtime • Full support included
          </p>
        </div>
      </div>
    </section>
  )
}
