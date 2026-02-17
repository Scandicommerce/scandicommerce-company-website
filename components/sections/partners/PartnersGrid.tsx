'use client'

import { useState, useMemo, useRef, type ComponentType } from 'react'
import PartnerCard, { Partner } from './PartnerCard'
import { Search, X, ChevronDown, ChevronUp, ShoppingBag, Mail, Headphones, Star, Compass, Package, LayoutGrid, Truck, MapPin, CreditCard } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import type { Image as SanityImage } from 'sanity'

/** Resolved image shape returned by GROQ when using asset-> (dereferenced) */
export interface ResolvedSanityImage {
  asset?: { _id?: string; url?: string }
  crop?: unknown
  hotspot?: unknown
}

/** Image type accepted by PartnersGrid: either Sanity reference or GROQ-resolved */
export type PartnerImage = SanityImage | ResolvedSanityImage

export interface PartnerCategoryItem {
  _id: string
  title: string
  icon?: string
}

interface PartnerData {
  name?: string
  category?: string
  categories?: PartnerCategoryItem[] | string[]
  description?: string
  benefits?: string[]
  /** Sanity image (reference or resolved); used with urlFor when present */
  image?: PartnerImage
  /** Sanity image for logo (reference or resolved) */
  logo?: PartnerImage
  /** Fallback URL when image comes from non-Sanity source */
  imageUrl?: string
  logoUrl?: string
}

interface PartnersGridData {
  partners?: PartnerData[]
}

interface PartnersGridProps {
  partnersGrid?: PartnersGridData
  /** Dynamic category list from Sanity (Partner Categories). When set, filters and sections use this order; otherwise static list is used. */
  categoryList?: PartnerCategoryItem[]
}

// Default partners (used when no Sanity data; add Categories in Sanity for ERP, OMS, Shipping, Logistics, POS)
const defaultPartners: Partner[] = [
  {
    id: 1,
    name: 'Shopify Plus',
    category: 'Platform',
    categories: ['Platform'],
    description: 'Official Shopify Plus partner since 2018. Direct access to Shopify resources and priority support.',
    benefits: ['Priority support access', 'Beta feature access', 'Direct Shopify contacts'],
    image: '/images/partners/partnerGrid/shopify-plus.jpg',
  },
  {
    id: 2,
    name: 'Klaviyo',
    category: 'Email & SMS',
    categories: ['Email & SMS'],
    description: 'Certified Klaviyo partner for email marketing, SMS, and customer data management.',
    benefits: ['Advanced segmentation', 'Revenue attribution', 'Automated flows'],
    image: '/images/partners/partnerGrid/klaviyo.png',
  },
  {
    id: 3,
    name: 'Gorgias',
    category: 'Customer Support',
    categories: ['Customer Support'],
    description: 'Helpdesk integration for seamless customer support connected to your store data.',
    benefits: ['Unified customer view', 'Automated responses', 'Revenue tracking'],
    image: '/images/partners/partnerGrid/gorgias.jpg',
  },
  {
    id: 4,
    name: 'Yotpo',
    category: 'Reviews & UGC',
    categories: ['Reviews & UGC'],
    description: 'Product reviews, ratings, and user-generated content to build trust and increase conversions.',
    benefits: ['Review collection', 'SEO-friendly reviews', 'Photo reviews'],
    image: '/images/partners/partnerGrid/yotpo.jpg',
  },
  {
    id: 5,
    name: 'Okendo',
    category: 'Reviews',
    categories: ['Reviews'],
    description: 'Advanced review platform with attributes, surveys, and rich customer insights.',
    benefits: ['Attribute-based reviews', 'Customer surveys', 'Rich insights'],
    image: '/images/partners/partnerGrid/okendo.jpg',
    logo: '/images/partners/partnerGrid/okendo-logo.png',
  },
  {
    id: 6,
    name: 'Stamped',
    category: 'Loyalty',
    categories: ['Loyalty'],
    description: 'Loyalty programs and rewards to increase customer lifetime value.',
    benefits: ['Points & rewards', 'Referral programs', 'VIP tiers'],
    image: '/images/partners/partnerGrid/stamped.jpg',
    logo: '/images/partners/partnerGrid/stamped-logo.png',
  },
  {
    id: 7,
    name: 'Nosto',
    category: 'Personalization',
    categories: ['Personalization'],
    description: 'AI-powered personalization for product recommendations and content.',
    benefits: ['Smart recommendations', 'A/B testing', 'Behavioral targeting'],
    image: '/images/partners/partnerGrid/nosto.png',
  },
  {
    id: 8,
    name: 'Algolia',
    category: 'Search',
    categories: ['Search'],
    description: 'Lightning-fast search with typo-tolerance and smart merchandising.',
    benefits: ['Instant search', 'Smart ranking', 'Analytics'],
    image: '/images/partners/partnerGrid/algolia.jpg',
  },
  // Example ERP/OMS/Shipping/Logistics/POS partners — replace with real partners and images in Sanity
  {
    id: 9,
    name: 'ERP & OMS Partner',
    category: 'ERP',
    categories: ['ERP', 'OMS'],
    description: 'Enterprise resource planning and order management integrations for unified operations.',
    benefits: ['Inventory sync', 'Order routing', 'Multi-channel fulfillment'],
    image: '/images/partners/partnerGrid/shopify-plus.jpg',
  },
  {
    id: 10,
    name: 'Shipping & Logistics',
    category: 'Shipping',
    categories: ['Shipping', 'Logistics'],
    description: 'Shipping, fulfillment, and logistics solutions for domestic and international delivery.',
    benefits: ['Rates & labels', 'Tracking', 'Warehouse integration'],
    image: '/images/partners/partnerGrid/shopify-plus.jpg',
  },
  {
    id: 11,
    name: 'POS Partner',
    category: 'POS',
    categories: ['POS'],
    description: 'Point-of-sale and in-store solutions integrated with your Shopify store.',
    benefits: ['Unified inventory', 'In-person payments', 'Offline mode'],
    image: '/images/partners/partnerGrid/shopify-plus.jpg',
  },
]

// Category groupings: priority order (Platform first, then ERP/OMS/Shipping/Logistics/POS, then rest)
const categoryGroups: Record<string, string[]> = {
  'Platform': ['Platform'],
  'ERP': ['ERP'],
  'OMS': ['OMS'],
  'Shipping': ['Shipping'],
  'Logistics': ['Logistics'],
  'POS': ['POS'],
  'Marketing': ['Email & SMS', 'Personalization'],
  'Customer Experience': ['Customer Support', 'Loyalty'],
  'Reviews & Content': ['Reviews', 'Reviews & UGC'],
  'Discovery': ['Search'],
}

const GROUP_ORDER = [
  'Platform',
  'ERP',
  'OMS',
  'Shipping',
  'Logistics',
  'POS',
  'Marketing',
  'Customer Experience',
  'Reviews & Content',
  'Discovery',
]

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
    case 'ERP':
      return <Package className={iconClass} />
    case 'OMS':
      return <LayoutGrid className={iconClass} />
    case 'Shipping':
      return <Truck className={iconClass} />
    case 'Logistics':
      return <MapPin className={iconClass} />
    case 'POS':
      return <CreditCard className={iconClass} />
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

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  ShoppingBag,
  Package,
  LayoutGrid,
  Truck,
  MapPin,
  CreditCard,
  Mail,
  Headphones,
  Star,
  Compass,
}

export default function PartnersGrid({ partnersGrid, categoryList }: PartnersGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedPartnerId, setExpandedPartnerId] = useState<number | null>(null)
  const [quickJumpExpanded, setQuickJumpExpanded] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const useDynamicCategories = Array.isArray(categoryList) && categoryList.length > 0

  const partners: Partner[] = partnersGrid?.partners && partnersGrid.partners.length > 0
    ? partnersGrid.partners.map((p, index) => {
      const raw = Array.isArray(p.categories) && p.categories.length > 0
        ? p.categories
        : p.category ? [p.category] : []
      const categories: string[] = raw.map(c =>
        typeof c === 'string' ? c : (c && 'title' in c ? c.title : '')
      ).filter(Boolean)
      const primaryCategory = categories[0] || (typeof p.category === 'string' ? p.category : '') || ''
      const imageUrl = p.image ? urlFor(p.image).url() : (p.imageUrl || '')
      const logoUrl = p.logo ? urlFor(p.logo).url() : p.logoUrl
      return {
        id: index + 1,
        name: p.name || '',
        category: primaryCategory,
        categories,
        description: p.description || '',
        benefits: p.benefits || [],
        image: imageUrl,
        logo: logoUrl,
      }
    })
    : defaultPartners

  // Category titles present on at least one partner
  const categoriesFromPartners = useMemo(() => {
    const cats = new Set<string>()
    partners.forEach(p => {
      if (p.categories?.length) p.categories.forEach(c => c && cats.add(c))
      else if (p.category) cats.add(p.category)
    })
    return Array.from(cats)
  }, [partners])

  // Ordered list of group keys: from Sanity when available (sorted by partner count, most first), else static order
  const uniqueGroups = useMemo(() => {
    if (useDynamicCategories && categoryList) {
      const countByTitle: Record<string, number> = {}
      partners.forEach(p => {
        const tags = p.categories?.length ? p.categories : (p.category ? [p.category] : [])
        tags.forEach(t => { countByTitle[t] = (countByTitle[t] ?? 0) + 1 })
      })
      return [...categoryList]
        .sort((a, b) => (countByTitle[b.title] ?? 0) - (countByTitle[a.title] ?? 0))
        .map(c => c.title)
    }
    const groups = new Set<string>()
    categoriesFromPartners.forEach(cat => groups.add(getCategoryGroup(cat)))
    return GROUP_ORDER.filter(g => groups.has(g))
  }, [useDynamicCategories, categoryList, categoriesFromPartners, partners])

  const QUICK_JUMP_VISIBLE = 6
  const hasMoreCategories = uniqueGroups.length > QUICK_JUMP_VISIBLE

  const getGroupKey = useMemo(() => {
    if (useDynamicCategories) return (cat: string) => cat
    return getCategoryGroup
  }, [useDynamicCategories])

  const getCategoryIconForGroup = (groupTitle: string, size: 'sm' | 'md' = 'md') => {
    const iconClass = size === 'sm' ? "w-4 h-4" : "w-6 h-6 text-[#03C1CA]"
    if (useDynamicCategories && categoryList) {
      const cat = categoryList.find(c => c.title === groupTitle)
      if (cat?.icon && ICON_MAP[cat.icon]) {
        const Icon = ICON_MAP[cat.icon]
        return <Icon className={iconClass} />
      }
    }
    return getCategoryIcon(groupTitle, size)
  }

  // Filter partners based on search and category
  const filteredPartners = useMemo(() => {
    return partners.filter(partner => {
      const tags = partner.categories?.length ? partner.categories : (partner.category ? [partner.category] : [])
      const matchesSearch = searchQuery === '' ||
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        partner.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()))

      const partnerGroups = new Set(tags.map(t => getGroupKey(t)))
      const matchesCategory = selectedCategory === null ||
        partnerGroups.has(selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [partners, searchQuery, selectedCategory, getGroupKey])

  // Group partners: each partner appears in every category group they're tagged with
  const groupedPartners = useMemo(() => {
    const groups: Record<string, Partner[]> = {}
    const tags = (p: Partner) => p.categories?.length ? p.categories : (p.category ? [p.category] : [])
    filteredPartners.forEach(partner => {
      const partnerGroups = new Set(tags(partner).map(t => getGroupKey(t)))
      partnerGroups.forEach(group => {
        if (!groups[group]) groups[group] = []
        groups[group].push(partner)
      })
    })
    return groups
  }, [filteredPartners, getGroupKey])

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
      <div className="section_container mx-auto page-padding-x mb-12">
        {/* Search & Filter Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] text-center mb-8">
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
                className={`px-5 py-2.5 text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${selectedCategory === null
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
                const groupCount = partners.filter(p => {
                  const tags = p.categories?.length ? p.categories : (p.category ? [p.category] : [])
                  return tags.some(t => getGroupKey(t) === group)
                }).length
                return (
                  <button
                    key={group}
                    onClick={() => setSelectedCategory(selectedCategory === group ? null : group)}
                    onDoubleClick={() => scrollToSection(group)}
                    title="Click to filter, double-click to jump"
                    className={`px-5 py-2.5 text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${selectedCategory === group
                      ? 'bg-[#03C1CA] text-white'
                      : 'bg-[#F5F5F5] text-[#565454] hover:bg-[#E8E8E8] hover:text-[#222222]'
                      }`}
                  >
                    <span className={`${selectedCategory === group ? 'text-white' : 'text-[#03C1CA]'}`}>
                      {getCategoryIconForGroup(group, 'sm')}
                    </span>
                    {group}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === group
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
        <div className="section_container mx-auto page-padding-x">
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
        <div className='section_container mx-auto page-padding-x mb-12'>
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
                <div className="relative mb-10">
                  <div className="mx-auto">
                    <div className="flex items-center gap-4">
                      {/* Left Line */}
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E5E5E5] to-[#03C1CA]"></div>

                      {/* Category Badge */}
                      <div className="flex items-center gap-4 bg-[#F8F8F8] border border-[#E5E5E5] px-6 py-4">
                        <div className="w-12 h-12 rounded-full bg-[#03C1CA]/10 flex items-center justify-center">
                          {getCategoryIconForGroup(group)}
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
                <div className="gap-y-1 xs:gap-y-2 md:gap-y-4 xl:gap-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {groupPartners.map((partner, index) => (
                    <div
                      key={partner.id}
                      className={`animate-fade-in-up opacity-0 ${expandedPartnerId === partner.id ? 'relative z-40 overflow-visible' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
                    >
                      <PartnerCard
                        partner={partner}
                        imageSizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        isExpanded={expandedPartnerId === partner.id}
                        onExpandChange={(expanded) => setExpandedPartnerId(expanded ? partner.id : null)}
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
            <div
              className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
              style={{
                maxHeight: hasMoreCategories
                  ? (quickJumpExpanded ? '70vh' : '220px')
                  : 'none',
              }}
            >
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
            {hasMoreCategories && (
              <button
                type="button"
                onClick={() => setQuickJumpExpanded(!quickJumpExpanded)}
                className="flex items-center justify-center gap-1 text-xs font-medium text-[#03C1CA] hover:text-[#029AA2] transition-colors pt-1 border-t border-[#E5E5E5] mt-1 w-full"
              >
                {quickJumpExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                    Show more ({uniqueGroups.length - QUICK_JUMP_VISIBLE} more)
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
