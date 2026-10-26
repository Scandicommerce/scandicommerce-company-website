'use client'

import { useState, useMemo, useEffect } from 'react'
import ProductCard, { Product, Collection } from './ProductCard'
import { HiChevronDown, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { ui } from '@/components/integrations/labels'

interface ProductGridProps {
  initialProducts?: Product[]
}

type Category = string
type SortOption = 'newest' | 'price-low' | 'price-high' | 'name'

const ITEMS_PER_PAGE = 8

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const [loading, setLoading] = useState(!initialProducts)
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [isSortOpen, setIsSortOpen] = useState(false)

  useEffect(() => {
    if (!initialProducts) {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.products) {
            const transformedProducts: Product[] = data.products
              .map((p: any) => ({
                id: p.id,
                name: p.title,
                description: p.description || '',
                price: p.price,
                currency: p.currencyCode,
                image: p.image,
                collections: p.collections || [],
                slug: p.handle,
                availableForSale: p.availableForSale,
              }))
              .filter((p: Product) => p.collections.length > 0)
            setProducts(transformedProducts)
          }
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching products:', error)
          setLoading(false)
        })
    }
  }, [initialProducts])

  const categories = useMemo(() => {
    const collectionMap = new Map<string, Collection>()

    products.forEach(product => {
      product.collections.forEach(collection => {
        if (!collectionMap.has(collection.handle)) {
          collectionMap.set(collection.handle, collection)
        }
      })
    })

    const collections = Array.from(collectionMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    )

    return [
      { key: 'all', label: 'All', collection: null },
      ...collections.map(collection => ({
        key: collection.handle,
        label: collection.title,
        collection,
      })),
    ]
  }, [products])

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'newest', label: 'Newest' },
    { key: 'price-low', label: 'Price: Low to High' },
    { key: 'price-high', label: 'Price: High to Low' },
    { key: 'name', label: 'Name: A to Z' },
  ]

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    if (activeCategory !== 'all') {
      filtered = products.filter(p => {
        return p.collections.some(collection => collection.handle === activeCategory)
      })
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return sorted
  }, [activeCategory, sortBy, products])

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredAndSortedProducts, currentPage])

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  const handleSortChange = (option: SortOption) => {
    setSortBy(option)
    setCurrentPage(1)
    setIsSortOpen(false)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <section className="bg-white pb-16 lg:pb-20">
        <div className={ui.container}>
          <div className="py-12 text-center">
            <p className="m-0 text-[15px] text-sc-ink-600">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="bg-white pb-16 lg:pb-20">
        <div className={ui.container}>
          <div className="py-12 text-center">
            <p className="m-0 text-[15px] text-sc-ink-600">No products found.</p>
            <p className="m-0 mt-2 text-sm text-sc-ink-500">
              Make sure your Shopify store is connected and has products.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white pb-16 lg:pb-20">
      <div className={`${ui.container} flex flex-col gap-6`}>
        {/* Filter bar: collection chips and the sort menu */}
        <div className="flex flex-col gap-4 border-b border-sc-ink-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => handleCategoryChange(category.key)}
                className={`${ui.chip} flex-shrink-0 whitespace-nowrap transition-colors ${
                  activeCategory === category.key
                    ? 'border-sc-ink-900 bg-sc-ink-900 text-white'
                    : 'hover:border-sc-ink-400 hover:text-sc-ink-900'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-sc-ink-300 bg-white px-4 py-2 text-sm font-medium text-sc-ink-900 transition-colors hover:bg-sc-ink-50 lg:w-auto lg:min-w-[200px]"
            >
              <span>{sortOptions.find(s => s.key === sortBy)?.label || 'Newest'}</span>
              <HiChevronDown
                className={`h-4 w-4 text-sc-ink-500 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isSortOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSortOpen(false)}
                />
                <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-sc-ink-200 bg-white shadow-lg lg:left-auto lg:w-full">
                  {sortOptions.map(option => (
                    <button
                      key={option.key}
                      onClick={() => handleSortChange(option.key)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${sortBy === option.key
                        ? 'bg-sc-ink-900 text-white'
                        : 'text-sc-ink-600 hover:bg-sc-ink-50'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {paginatedProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="m-0 text-[15px] text-sc-ink-600">No products found in this category.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-sc-ink-900 transition-colors hover:text-sc-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
            >
              <HiChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`font-mono text-[15px] transition-colors ${currentPage === page
                  ? 'text-sc-cyan-600'
                  : 'text-sc-ink-900 hover:text-sc-cyan-600'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-sc-ink-900 transition-colors hover:text-sc-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
            >
              <HiChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
