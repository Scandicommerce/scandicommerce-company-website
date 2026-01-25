'use client'

import React, { useState, useEffect } from 'react'
import Logo from '@/components/ui/Logo'
import Link from 'next/link'
import { HiShoppingBag } from 'react-icons/hi2'
import { useCart } from '@/contexts/CartContext'

interface MenuItem {
  label?: string
  href?: string
}

interface MenuSection {
  label?: string
  items?: MenuItem[]
}

interface HeaderSettings {
  servicesMenu?: MenuSection
  shopifyMenu?: MenuSection
  mainNavLinks?: MenuItem[]
  ctaButton?: {
    label?: string
    href?: string
  }
}

interface HeaderProps {
  settings?: HeaderSettings
}

// Default menu items
const defaultServicesMenu: MenuSection = {
  label: 'Services',
  items: [
    { label: 'Shopify Development', href: '/services/shopify_development' },
    { label: 'Migration to Shopify', href: '/services/migrate' },
    { label: 'Shopify POS', href: '/services/shopify_pos' },
    { label: 'All Packages', href: '/services/all_packages' },
  ],
}

const defaultShopifyMenu: MenuSection = {
  label: 'Shopify',
  items: [
    { label: 'Shopify', href: '/shopify/shopify_platform' },
    { label: 'Shopify POS', href: '/shopify/shopify_POS' },
    { label: 'Shopify Migration', href: '/shopify/shopify_migration' },
    { label: 'Shopify TCO calculator', href: '/shopify/shopify_TCO_calculator' },
    { label: 'Shopify x PIM', href: '/shopify/shopify_x_PIM' },
    { label: 'Shopify X AI', href: '/shopify/shopify_x_AI' },
    { label: 'Why Shopify?', href: '/shopify/why_shopify' },
    { label: 'Vipps Hurtigkasse', href: '/shopify/vipps_hurtigkasse' },
  ],
}

const defaultMainNavLinks: MenuItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Partners', href: '/partners' },
  { label: 'Contact', href: '/contact' },
]

const defaultCtaButton = {
  label: 'GET STARTED',
  href: '/get-started',
}

export default function Header({ settings }: HeaderProps) {
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isShopifyOpen, setIsShopifyOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const { cart, openCart } = useCart()

  // Use Sanity data or fallback to defaults
  const servicesMenu = settings?.servicesMenu?.items?.length 
    ? settings.servicesMenu 
    : defaultServicesMenu
  const shopifyMenu = settings?.shopifyMenu?.items?.length 
    ? settings.shopifyMenu 
    : defaultShopifyMenu
  const mainNavLinks = settings?.mainNavLinks?.length 
    ? settings.mainNavLinks 
    : defaultMainNavLinks
  const ctaButton = settings?.ctaButton?.label 
    ? settings.ctaButton 
    : defaultCtaButton

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isDesktop = window.innerWidth >= 1024
      if (isServicesOpen && isDesktop && !target.closest('.services-menu')) {
        setIsServicesOpen(false)
      }
      if (isShopifyOpen && isDesktop && !target.closest('.shopify-menu')) {
        setIsShopifyOpen(false)
      }
    }

    const isDesktop = window.innerWidth >= 1024
    if ((isServicesOpen || isShopifyOpen) && isDesktop) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isServicesOpen, isShopifyOpen])

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/75 backdrop-blur-sm shadow-header'
        : 'bg-white shadow-header'
        }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {/* Services Menu */}
            <div className="relative services-menu">
              <button
                onClick={() => {
                  setIsServicesOpen(!isServicesOpen)
                  setIsShopifyOpen(false)
                }}
                onMouseEnter={() => {
                  setIsServicesOpen(true)
                  setIsShopifyOpen(false)
                }}
                className="flex items-center gap-1 text-gray-900 hover:text-teal transition-colors font-medium text-base"
              >
                {servicesMenu.label}
                <svg
                  className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isServicesOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  {servicesMenu.items?.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href || '#'}
                      onClick={() => setIsServicesOpen(false)}
                      className="block px-6 py-3 text-gray-900 hover:text-teal hover:bg-gray-50 transition-colors font-medium text-base"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Shopify Menu */}
            <div className="relative shopify-menu">
              <button
                onClick={() => {
                  setIsShopifyOpen(!isShopifyOpen)
                  setIsServicesOpen(false)
                }}
                onMouseEnter={() => {
                  setIsShopifyOpen(true)
                  setIsServicesOpen(false)
                }}
                className="flex items-center gap-1 text-gray-900 hover:text-teal transition-colors font-medium text-base"
              >
                {shopifyMenu.label}
                <svg
                  className={`w-4 h-4 transition-transform ${isShopifyOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isShopifyOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseLeave={() => setIsShopifyOpen(false)}
                >
                  {shopifyMenu.items?.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href || '#'}
                      onClick={() => setIsShopifyOpen(false)}
                      className="block px-6 py-3 text-gray-900 hover:text-teal hover:bg-gray-50 transition-colors font-medium text-base"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Main Nav Links */}
            {mainNavLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href || '#'}
                className="text-gray-900 hover:text-teal transition-colors font-medium text-base"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <button
              onClick={openCart}
              className="relative p-2 text-gray-900 hover:text-teal transition-colors"
              aria-label="Open cart"
            >
              <HiShoppingBag className="w-6 h-6" />
              {cart && cart.totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#03C1CA] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.totalQuantity > 99 ? '99+' : cart.totalQuantity}
                </span>
              )}
            </button>
            
            <Link
              href={ctaButton.href || '/get-started'}
              className="hidden sm:inline-block bg-teal text-white px-6 py-2.5 font-semibold hover:bg-teal-dark transition-colors shadow-button text-base"
            >
              {ctaButton.label}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-900"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200 mt-2">
            <div className="flex flex-col space-y-4 pt-4">
              {/* Mobile Services Menu */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setIsServicesOpen(!isServicesOpen)
                    setIsShopifyOpen(false)
                  }}
                  className="flex items-center justify-between text-gray-900 hover:text-teal transition-colors font-medium text-base"
                >
                  {servicesMenu.label}
                  <svg
                    className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isServicesOpen && (
                  <div className="pl-4 flex flex-col space-y-2">
                    {servicesMenu.items?.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href || '#'}
                        className="text-gray-600 hover:text-teal transition-colors text-base"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsMobileMenuOpen(false)
                          setIsServicesOpen(false)
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Shopify Menu */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setIsShopifyOpen(!isShopifyOpen)
                    setIsServicesOpen(false)
                  }}
                  className="flex items-center justify-between text-gray-900 hover:text-teal transition-colors font-medium text-base"
                >
                  {shopifyMenu.label}
                  <svg
                    className={`w-4 h-4 transition-transform ${isShopifyOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isShopifyOpen && (
                  <div className="pl-4 flex flex-col space-y-2">
                    {shopifyMenu.items?.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href || '#'}
                        className="text-gray-600 hover:text-teal transition-colors text-base"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsMobileMenuOpen(false)
                          setIsShopifyOpen(false)
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Main Nav Links */}
              {mainNavLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href || '#'}
                  className="text-gray-900 hover:text-teal transition-colors font-medium text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile CTA */}
              <Link
                href={ctaButton.href || '/get-started'}
                className="bg-teal text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-dark transition-colors text-center shadow-button text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {ctaButton.label}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
