'use client'

import { useState, useMemo, useRef } from 'react'
import PartnerCard, { Partner } from './PartnerCard'
import { Search, X, ChevronDown, ShoppingBag, Mail, Headphones, Star, Compass } from 'lucide-react'

interface PartnerData {
  name?: string
  category?: string
  description?: string
  benefits?: string[]
  imageUrl?: string
  logoUrl?: string
}

interface PartnersGridData {
  partners?: PartnerData[]
}

interface PartnersGridProps {
  partnersGrid?: PartnersGridData
}

// Default partners
const defaultPartners: Partner[] = [
  {
    id: 1,
    name: 'Shopify Plus',
    category: 'Platform',
    description: 'Official Shopify Plus partner since 2018. Direct access to Shopify resources and priority support.',
    benefits: ['Priority support access', 'Beta feature access', 'Direct Shopify contacts'],
    image: '/images/partners/partnerGrid/shopify-plus.jpg',
  },
  {
    id: 2,
    name: 'Klaviyo',
    category: 'Email & SMS',
    description: 'Certified Klaviyo partner for email marketing, SMS, and customer data management.',
    benefits: ['Advanced segmentation', 'Revenue attribution', 'Automated flows'],
    image: '/images/partners/partnerGrid/klaviyo.png',
  },
  {
    id: 3,
    name: 'Gorgias',
    category: 'Customer Support',
    description: 'Helpdesk integration for seamless customer support connected to your store data.',
    benefits: ['Unified customer view', 'Automated responses', 'Revenue tracking'],
    image: '/images/partners/partnerGrid/gorgias.jpg',
  },
  {
    id: 4,
    name: 'Yotpo',
    category: 'Reviews & UGC',
    description: 'Product reviews, ratings, and user-generated content to build trust and increase conversions.',
    benefits: ['Review collection', 'SEO-friendly reviews', 'Photo reviews'],
    image: '/images/partners/partnerGrid/yotpo.jpg',
  },
  {
    id: 5,
    name: 'Okendo',
    category: 'Reviews',
    description: 'Advanced review platform with attributes, surveys, and rich customer insights.',
    benefits: ['Attribute-based reviews', 'Customer surveys', 'Rich insights'],
    image: '/images/partners/partnerGrid/okendo.jpg',
    logo: '/images/partners/partnerGrid/okendo-logo.png',
  },
  {
    id: 6,
    name: 'Stamped',
    category: 'Loyalty',
    description: 'Loyalty programs and rewards to increase customer lifetime value.',
    benefits: ['Points & rewards', 'Referral programs', 'VIP tiers'],
    image: '/images/partners/partnerGrid/stamped.jpg',
    logo: '/images/partners/partnerGrid/stamped-logo.png',
  },
  {
    id: 7,
    name: 'Nosto',
    category: 'Personalization',
    description: 'AI-powered personalization for product recommendations and content.',
    benefits: ['Smart recommendations', 'A/B testing', 'Behavioral targeting'],
    image: '/images/partners/partnerGrid/nosto.png',
  },
  {
    id: 8,
    name: 'Algolia',
    category: 'Search',
    description: 'Lightning-fast search with typo-tolerance and smart merchandising.',
    benefits: ['Instant search', 'Smart ranking', 'Analytics'],
    image: '/images/partners/partnerGrid/algolia.jpg',
  },
]

// Category groupings for cleaner organization
const categoryGroups: Record<string, string[]> = {
  'Platform': ['Platform'],
  'Marketing': ['Email & SMS', 'Personalization'],
  'Customer Experience': ['Customer Support', 'Loyalty'],
  'Reviews & Content': ['Reviews', 'Reviews & UGC'],
  'Discovery': ['Search'],
}

// Get display group for a category
function getCategoryGroup(category: string): string {
  for (const [group, categories] of Object.entries(categoryGroups)) {
    if (categories.includes(category)) {
      return group
    }
  }
  return category
}

// Get icon for each category group
function getCategoryIcon(group: string, size: 'sm' | 'md' = 'md') {
  const iconClass = size === 'sm' ? "w-4 h-4" : "w-6 h-6 text-[#03C1CA]"
  switch (group) {
    case 'Platform':
      return <ShoppingBag className={iconClass} />
    case 'Marketing':
      return <Mail className={iconClass} />
    case 'Customer Experience':
      return <Headphones className={iconClass} />
    case 'Reviews & Content':
      return <Star className={iconClass} />
    case 'Discovery':
      return <Compass className={iconClass} />
    default:
      return <ShoppingBag className={iconClass} />
  }
}

export default function PartnersGrid({ partnersGrid }: PartnersGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const partners: Partner[] = partnersGrid?.partners && partnersGrid.partners.length > 0
    ? partnersGrid.partners.map((p, index) => ({
        id: index + 1,
        name: p.name || '',
        category: p.category || '',
        description: p.description || '',
        benefits: p.benefits || [],
        image: p.imageUrl || '',
        logo: p.logoUrl,
      }))
    : defaultPartners

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>()
    partners.forEach(p => {
      if (p.category) cats.add(p.category)
    })
    return Array.from(cats).sort()
  }, [partners])

  // Get unique category groups
  const uniqueGroups = useMemo(() => {
    const groups = new Set<string>()
    categories.forEach(cat => {
      groups.add(getCategoryGroup(cat))
    })
    // Sort groups in a logical order
    const orderedGroups = ['Platform', 'Marketing', 'Customer Experience', 'Reviews & Content', 'Discovery']
    return orderedGroups.filter(g => groups.has(g))
  }, [categories])

  // Filter partners based on search and category
  const filteredPartners = useMemo(() => {
    return partners.filter(partner => {
      const matchesSearch = searchQuery === '' || 
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === null || 
        getCategoryGroup(partner.category) === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [partners, searchQuery, selectedCategory])

  // Group filtered partners by category group
  const groupedPartners = useMemo(() => {
    const groups: Record<string, Partner[]> = {}
    
    filteredPartners.forEach(partner => {
      const group = getCategoryGroup(partner.category)
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(partner)
    })
    
    return groups
  }, [filteredPartners])

  // Scroll to section
  const scrollToSection = (group: string) => {
    setSelectedCategory(null)
    setTimeout(() => {
      const element = sectionRefs.current[group]
      if (element) {
        const headerOffset = 120
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
  }

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== null

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Search & Filter Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] text-center mb-8">
            Find Your Integration Partner
          </h2>
          
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#565454] w-5 h-5" />
              <input
                type="text"
                placeholder="Search partners by name, category, or capability..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border-2 border-[#E5E5E5] focus:border-[#03C1CA] outline-none text-[#222222] placeholder:text-[#999999] text-base lg:text-lg transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#565454] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Navigation */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-[#565454] font-medium">
              <ChevronDown className="w-4 h-4" />
              <span>Jump to category or filter:</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-5 py-2.5 text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  selectedCategory === null
                    ? 'bg-[#03C1CA] text-white'
                    : 'bg-[#F5F5F5] text-[#565454] hover:bg-[#E8E8E8] hover:text-[#222222]'
                }`}
              >
                <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-xs">
                  {partners.length}
                </span>
                All Partners
              </button>
              {uniqueGroups.map(group => {
                const groupCount = partners.filter(p => getCategoryGroup(p.category) === group).length
                return (
                  <button
                    key={group}
                    onClick={() => setSelectedCategory(selectedCategory === group ? null : group)}
                    onDoubleClick={() => scrollToSection(group)}
                    title="Click to filter, double-click to jump"
                    className={`px-5 py-2.5 text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                      selectedCategory === group
                        ? 'bg-[#03C1CA] text-white'
                        : 'bg-[#F5F5F5] text-[#565454] hover:bg-[#E8E8E8] hover:text-[#222222]'
                    }`}
                  >
                    <span className={`${selectedCategory === group ? 'text-white' : 'text-[#03C1CA]'}`}>
                      {getCategoryIcon(group, 'sm')}
                    </span>
                    {group}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      selectedCategory === group 
                        ? 'bg-white/20 text-white' 
                        : 'bg-[#03C1CA]/10 text-[#03C1CA]'
                    }`}>
                      {groupCount}
                    </span>
                  </button>
                )
              })}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="self-start text-sm text-[#03C1CA] hover:text-[#029AA2] font-medium flex items-center gap-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        {hasActiveFilters && (
          <div className="text-center mb-8">
            <p className="text-[#565454]">
              Showing <span className="font-semibold text-[#222222]">{filteredPartners.length}</span> partner{filteredPartners.length !== 1 ? 's' : ''}
              {selectedCategory && <span> in <span className="font-semibold text-[#03C1CA]">{selectedCategory}</span></span>}
              {searchQuery && <span> matching &ldquo;<span className="font-semibold">{searchQuery}</span>&rdquo;</span>}
            </p>
          </div>
        )}
      </div>

      {/* Partners Grid by Category */}
      {filteredPartners.length === 0 ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-[#F8F8F8]">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#E5E5E5] flex items-center justify-center">
              <Search className="w-8 h-8 text-[#999999]" />
            </div>
            <h3 className="text-xl font-semibold text-[#222222] mb-2">No partners found</h3>
            <p className="text-[#565454] mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-[#03C1CA] text-white font-semibold hover:bg-[#029AA2] transition-colors"
            >
              Show all partners
            </button>
          </div>
        </div>
      ) : (
        <div>
          {(selectedCategory === null ? uniqueGroups : [selectedCategory]).map((group, groupIndex) => {
            const groupPartners = groupedPartners[group]
            if (!groupPartners || groupPartners.length === 0) return null

            return (
              <div
                key={group}
                ref={el => { sectionRefs.current[group] = el }}
                className={groupIndex > 0 ? 'mt-16' : ''}
              >
                {/* Category Section Divider */}
                <div className="relative mb-10 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4">
                      {/* Left Line */}
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E5E5E5] to-[#03C1CA]"></div>
                      
                      {/* Category Badge */}
                      <div className="flex items-center gap-4 bg-[#F8F8F8] border border-[#E5E5E5] px-6 py-4">
                        <div className="w-12 h-12 rounded-full bg-[#03C1CA]/10 flex items-center justify-center">
                          {getCategoryIcon(group)}
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#222222]">
                            {group}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#565454]">
                            {groupPartners.length} partner{groupPartners.length !== 1 ? 's' : ''} available
                          </p>
                        </div>
                      </div>
                      
                      {/* Right Line */}
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#E5E5E5] to-[#03C1CA]"></div>
                    </div>
                  </div>
                </div>

                {/* Partner Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {groupPartners.map((partner, index) => (
                    <div
                      key={partner.id}
                      className="animate-fade-in-up opacity-0"
                      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
                    >
                      <PartnerCard
                        partner={partner}
                        imageSizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Navigation - Fixed on scroll */}
      {!hasActiveFilters && uniqueGroups.length > 2 && (
        <div className="fixed bottom-8 right-8 z-40 hidden lg:block">
          <div className="bg-white shadow-lg border border-[#E5E5E5] p-4 max-w-[200px]">
            <p className="text-xs font-semibold text-[#999999] uppercase tracking-wider mb-3">Quick Jump</p>
            <div className="flex flex-col gap-2">
              {uniqueGroups.map(group => (
                <button
                  key={group}
                  onClick={() => scrollToSection(group)}
                  className="text-left text-sm text-[#565454] hover:text-[#03C1CA] transition-colors truncate"
                >
                  → {group}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
