'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import LocalizedLink from '@/components/ui/LocalizedLink'
import { HiShoppingBag } from 'react-icons/hi2'
import { useCart } from '@/contexts/CartContext'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

interface MenuItem {
  label?: string
  href?: string
  slug?: string
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
    slug?: string
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

const LOCALE_IDS_SET = new Set(['en', 'no', 'sv', 'da', 'de'])
const COUNTRY_SEGMENTS_SET = new Set(['se', 'dk', 'de'])

/** Build href for a nav item: use page slug when set (strip leading locale/country segments so LocalizedLink adds current lang), else use custom href */
function getNavHref(item: MenuItem | { href?: string; slug?: string }): string {
  if (item.slug) {
    const parts = item.slug.replace(/^\/+/, '').split('/')
    while (parts.length > 1 && (LOCALE_IDS_SET.has(parts[0]) || COUNTRY_SEGMENTS_SET.has(parts[0]))) {
      parts.shift()
    }
    const path = parts.join('/')
    return path ? `/${path}` : '#'
  }
  return item.href || '#'
}

// Shared 2026 design classes
const navLinkClasses =
  'text-[14px] font-medium text-sc-ink-600 hover:text-sc-ink-900 transition-colors'
const dropdownPanelClasses =
  'absolute top-full left-0 mt-3 w-[280px] bg-white rounded-xl border border-sc-ink-100 shadow-lg py-2 z-[10002]'
const dropdownItemClasses =
  'block px-5 py-2.5 text-[14px] font-medium text-sc-ink-600 hover:text-sc-ink-900 hover:bg-sc-ink-50 transition-colors'

export default function Header({ settings }: HeaderProps) {
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isShopifyOpen, setIsShopifyOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
      <header className="w-full sticky top-0 z-[100] bg-[rgba(255,255,255,0.94)] backdrop-blur-md border-b border-sc-ink-100">
        <nav className="section_container mx-auto page-padding-x overflow-visible">
          <div className="flex items-center gap-4 lg:gap-7 h-14 lg:h-[62px]">
            {/* Logo */}
            <LocalizedLink href="/" className="flex-shrink-0 flex items-center">
              <img
                src="/images/brand/logo-dark-text.png"
                alt="Scandicommerce"
                className="block h-6 lg:h-[30px] w-auto"
              />
            </LocalizedLink>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-[26px] ml-4">
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
                  className={`flex items-center gap-1 ${navLinkClasses}`}
                >
                  {servicesMenu.label}
                  <svg
                    className={`w-3.5 h-3.5 text-sc-ink-400 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isServicesOpen && (
                  <div
                    className={dropdownPanelClasses}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    {servicesMenu.items?.map((item, index) => (
                      <LocalizedLink
                        key={index}
                        href={getNavHref(item)}
                        onClick={() => setIsServicesOpen(false)}
                        className={dropdownItemClasses}
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
                  className={`flex items-center gap-1 ${navLinkClasses}`}
                >
                  {shopifyMenu.label}
                  <svg
                    className={`w-3.5 h-3.5 text-sc-ink-400 transition-transform ${isShopifyOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isShopifyOpen && (
                  <div
                    className={dropdownPanelClasses}
                    onMouseLeave={() => setIsShopifyOpen(false)}
                  >
                    {shopifyMenu.items?.map((item, index) => (
                      <LocalizedLink
                        key={index}
                        href={getNavHref(item)}
                        onClick={() => setIsShopifyOpen(false)}
                        className={dropdownItemClasses}
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
                  href={getNavHref(link)}
                  className={navLinkClasses}
                >
                  {link.label}
                </LocalizedLink>
              ))}
            </div>

            {/* Right: language toggle, cart, CTA, hamburger */}
            <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:gap-[18px] flex-shrink-0 min-w-0">
              <span className="text-[12px] font-semibold text-sc-ink-500 flex items-center">
                <LanguageSwitcher />
              </span>
              <button
                onClick={openCart}
                className="relative p-1.5 text-sc-ink-600 hover:text-sc-ink-900 transition-colors flex-shrink-0"
                aria-label="Open cart"
              >
                <HiShoppingBag className="w-5 h-5" />
                {cart && cart.totalQuantity > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-sc-cyan-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.totalQuantity > 99 ? '99+' : cart.totalQuantity}
                  </span>
                )}
              </button>
              <LocalizedLink
                href={getNavHref(ctaButton)}
                className="inline-block bg-sc-ink-900 text-white rounded-lg px-3.5 py-2 lg:px-5 lg:py-2.5 text-[12px] lg:text-[13px] font-semibold hover:bg-sc-ink-700 transition-colors flex-shrink-0 whitespace-nowrap text-center"
              >
                {ctaButton.label}
              </LocalizedLink>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 text-sc-ink-900 hover:text-sc-ink-600 transition-colors flex-shrink-0"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile drop side: portaled to body so fixed position and z-index work regardless of scroll */}
      {mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`lg:hidden fixed left-0 right-0 bottom-0 top-14 z-[9999] transition-opacity duration-300 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
            aria-hidden={!isMobileMenuOpen}
          >
            {/* Backdrop */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`absolute inset-0 bg-sc-ink-950/40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
                }`}
              aria-label="Close menu"
            />
            {/* Drawer: left to right, under header */}
            <aside
              className={`absolute left-0 top-0 bottom-0 w-[min(400px,100vw)] bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-out border-t border-sc-ink-100 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
              <div className="flex flex-col space-y-4 pt-6 pb-6 px-5">
                {/* Mobile Services Menu */}
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      setIsServicesOpen(!isServicesOpen)
                      setIsShopifyOpen(false)
                    }}
                    className="flex items-center justify-between text-sc-ink-900 hover:text-sc-ink-600 transition-colors font-medium text-[15px] w-full"
                  >
                    {servicesMenu.label}
                    <svg
                      className={`w-4 h-4 text-sc-ink-400 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
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
                          href={getNavHref(item)}
                          className="text-sc-ink-500 hover:text-sc-ink-900 transition-colors text-[14px]"
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
                    className="flex items-center justify-between text-sc-ink-900 hover:text-sc-ink-600 transition-colors font-medium text-[15px] w-full"
                  >
                    {shopifyMenu.label}
                    <svg
                      className={`w-4 h-4 text-sc-ink-400 transition-transform ${isShopifyOpen ? 'rotate-180' : ''}`}
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
                          href={getNavHref(item)}
                          className="text-sc-ink-500 hover:text-sc-ink-900 transition-colors text-[14px]"
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
                    href={getNavHref(link)}
                    className="text-sc-ink-900 hover:text-sc-ink-600 transition-colors font-medium text-[15px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </LocalizedLink>
                ))}

                {/* Mobile CTA */}
                <LocalizedLink
                  href={getNavHref(ctaButton)}
                  className="inline-block bg-sc-ink-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-sc-ink-700 transition-colors text-center text-[13px] mt-2"
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
