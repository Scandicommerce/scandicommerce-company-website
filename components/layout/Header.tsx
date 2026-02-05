'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Logo from '@/components/ui/Logo'
import Link from 'next/link'
import LocalizedLink from '@/components/ui/LocalizedLink'
import { HiShoppingBag } from 'react-icons/hi2'
import { useCart } from '@/contexts/CartContext'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

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
  const [mounted, setMounted] = useState(false)

  const { cart, openCart } = useCart()

  // Portal only after mount to avoid hydration mismatch (server has no portal)
  useEffect(() => setMounted(true), [])

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

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
    <>
      <header
        className={`w-full sticky top-0 z-[100] transition-all duration-300 ${isScrolled
          ? 'bg-white/75 backdrop-blur-sm shadow-header'
          : 'bg-white shadow-header'
          }`}
      >
        <nav className="section_container py-2 sm:py-0 mx-auto page-padding-x overflow-visible">
          <div className="flex items-center justify-between h-12 narrow:h-14 sm:h-16 lg:h-20 gap-4 narrow:gap-2 min-h-0">
            <div className="flex items-center gap-1 narrow:gap-2 min-w-0 flex-1 lg:flex-initial">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1 narrow:p-1.5 text-gray-900 hover:text-teal transition-colors flex-shrink-0"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5 narrow:w-6 narrow:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <div className="min-w-0 max-w-[65%] narrow:max-w-[60%] sm:max-w-none shrink">
                <LocalizedLink href="/" className="block w-full min-w-0">
                  <Logo />
                </LocalizedLink>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-center">
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
                  className="flex items-center gap-1 text-gray-900 hover:text-teal transition-colors font-medium text-sm xl:text-base"
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
                    className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[10002]"
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    {servicesMenu.items?.map((item, index) => (
                      <LocalizedLink
                        key={index}
                        href={item.href || '#'}
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-6 py-3 text-gray-900 hover:text-teal hover:bg-gray-50 transition-colors font-medium text-base"
                      >
                        {item.label}
                      </LocalizedLink>
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
                  className="flex items-center gap-1 text-gray-900 hover:text-teal transition-colors font-medium text-sm xl:text-base"
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
                    className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[10002]"
                    onMouseLeave={() => setIsShopifyOpen(false)}
                  >
                    {shopifyMenu.items?.map((item, index) => (
                      <LocalizedLink
                        key={index}
                        href={item.href || '#'}
                        onClick={() => setIsShopifyOpen(false)}
                        className="block px-6 py-3 text-gray-900 hover:text-teal hover:bg-gray-50 transition-colors font-medium text-base"
                      >
                        {item.label}
                      </LocalizedLink>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Nav Links */}
              {mainNavLinks.map((link, index) => (
                <LocalizedLink
                  key={index}
                  href={link.href || '#'}
                  className="text-gray-900 hover:text-teal transition-colors font-medium text-sm xl:text-base"
                >
                  {link.label}
                </LocalizedLink>
              ))}
            </div>

            <div className="flex items-center gap-0.5 narrow:gap-1.5 sm:gap-3 lg:gap-1.5 xl:gap-4 flex-shrink-0 min-w-0">
              <LanguageSwitcher />
              <button
                onClick={openCart}
                className="relative p-1 narrow:p-1.5 sm:p-2 text-gray-900 hover:text-teal transition-colors flex-shrink-0"
                aria-label="Open cart"
              >
                <HiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {cart && cart.totalQuantity > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 narrow:w-5 narrow:h-5 bg-[#03C1CA] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.totalQuantity > 99 ? '99+' : cart.totalQuantity}
                  </span>
                )}
              </button>
              <LocalizedLink
                href={ctaButton.href || '/get-started'}
                className="hidden xs:inline-block bg-teal text-white px-2 py-1.5 narrow:px-3 narrow:py-2 sm:px-6 sm:py-2.5 font-semibold hover:bg-teal-dark transition-colors shadow-button text-[11px] sm:text-base flex-shrink-0"
              >
                {ctaButton.label}
              </LocalizedLink>
            </div>
          </div>

        </nav>
      </header>

      {/* Mobile drop side: portaled to body so fixed position and z-index work regardless of scroll */}
      {mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`lg:hidden fixed left-0 right-0 bottom-0 top-[72px] sm:top-16 z-[9999] transition-opacity duration-300 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
            aria-hidden={!isMobileMenuOpen}
          >
            {/* Backdrop */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
                }`}
              aria-label="Close menu"
            />
            {/* Drawer: left to right, under header */}
            <aside
              className={`absolute left-0 top-0 bottom-0 w-[min(400px,100vw)] bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-out border-t border-[#e2e2e2] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
              <div className="flex flex-col space-y-3 narrow:space-y-4 pt-6 pb-6 px-4">
                {/* Mobile Services Menu */}
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      setIsServicesOpen(!isServicesOpen)
                      setIsShopifyOpen(false)
                    }}
                    className="flex items-center justify-between text-gray-900 hover:text-teal transition-colors font-medium text-base w-full"
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
                        <LocalizedLink
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
                        </LocalizedLink>
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
                    className="flex items-center justify-between text-gray-900 hover:text-teal transition-colors font-medium text-base w-full"
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
                        <LocalizedLink
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
                        </LocalizedLink>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Main Nav Links */}
                {mainNavLinks.map((link, index) => (
                  <LocalizedLink
                    key={index}
                    href={link.href || '#'}
                    className="text-gray-900 hover:text-teal transition-colors font-medium text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </LocalizedLink>
                ))}

                {/* Mobile CTA - only when width <= 425px */}
                <LocalizedLink
                  href={ctaButton.href || '/get-started'}
                  className="hidden max-[425px]:inline-block bg-teal text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-dark transition-colors text-center shadow-button text-base mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {ctaButton.label}
                </LocalizedLink>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </>
  )
}
