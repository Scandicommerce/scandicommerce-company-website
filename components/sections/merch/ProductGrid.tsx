'use client'

import { useState, useMemo, useEffect } from 'react'
import ProductCard, { Product, Collection } from './ProductCard'
import { HiChevronDown, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

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
      <section className="bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-[#666666]">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-[#666666]">No products found.</p>
            <p className="text-sm text-[#666666] mt-2">
              Make sure your Shopify store is connected and has products.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#E5E5E5]">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-stretch">
            <div className="flex overflow-x-auto border-b lg:border-b-0 border-[#E5E5E5]">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategoryChange(category.key)}
                  className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm font-medium transition-all duration-200 border-r border-[#E5E5E5] whitespace-nowrap flex-shrink-0 ${activeCategory === category.key
                    ? 'text-[#222222]'
                    : 'text-[#666666] hover:text-[#222222]'
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="relative flex items-center lg:border-l border-[#E5E5E5]">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-4 px-4 sm:px-6 py-3 sm:py-4 lg:py-5 text-sm font-medium text-[#666666] hover:text-[#222222] transition-colors w-full lg:w-auto lg:min-w-[180px] justify-between"
              >
                <span>{sortOptions.find(s => s.key === sortBy)?.label || 'Newest'}</span>
                <HiChevronDown
                  className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsSortOpen(false)}
                  />
                  <div className="absolute right-0 left-0 lg:left-auto top-full mt-0 lg:w-full bg-white border border-[#E5E5E5] border-t-0 shadow-lg z-20 overflow-hidden">
                    {sortOptions.map(option => (
                      <button
                        key={option.key}
                        onClick={() => handleSortChange(option.key)}
                        className={`w-full px-4 sm:px-6 py-3 text-left text-sm transition-colors ${sortBy === option.key
                          ? 'bg-[#03C1CA] text-white'
                          : 'text-[#666666] hover:bg-[#F8F8F8]'
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
        </div>

        <div className="border border-[#E5E5E5]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {paginatedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#666666]">No products found in this category.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-[#222222] hover:text-[#03C1CA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`text-lg font-medium transition-colors ${currentPage === page
                  ? 'text-[#03C1CA]'
                  : 'text-[#222222] hover:text-[#03C1CA]'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-[#222222] hover:text-[#03C1CA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

