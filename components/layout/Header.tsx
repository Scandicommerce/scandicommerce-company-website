'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import LocalizedLink from '@/components/ui/LocalizedLink'
import { HiShoppingBag } from 'react-icons/hi2'
import { useCart } from '@/contexts/CartContext'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { defaultCta, defaultNavigation, liveNavigation } from '@/lib/navigation'
import type { NavCta, NavColumn, NavItem, NavLink } from '@/lib/navigation'

interface HeaderSettings {
  menu?: NavItem[]
  ctaButton?: NavCta
}

interface HeaderProps {
  settings?: HeaderSettings
  language?: string
}

const LOCALE_IDS_SET = new Set(['en', 'no', 'sv', 'da', 'de'])
const COUNTRY_SEGMENTS_SET = new Set(['se', 'dk', 'de'])

/** Build href for a nav item: use page slug when set (strip leading locale/country segments so LocalizedLink adds current lang), else use custom href */
function getNavHref(item: NavLink): string {
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

function hasColumns(item: NavItem): boolean {
  return Boolean(item.columns?.some((column) => column.items?.length))
}

// Shared 2026 design classes
const navLinkClasses =
  'text-[14px] font-medium text-sc-ink-600 hover:text-sc-ink-900 transition-colors'
const dropdownItemClasses =
  'block rounded-lg px-2.5 py-2 hover:bg-sc-ink-50 transition-colors'
const columnTitleClasses =
  'px-2.5 mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-sc-ink-400'

/** One column of links inside a dropdown panel. */
function MenuColumn({
  column,
  onNavigate,
}: {
  column: NavColumn
  onNavigate: () => void
}) {
  return (
    <div className="min-w-[210px]">
      {column.title && <p className={columnTitleClasses}>{column.title}</p>}
      {column.items?.map((item, index) => (
        <LocalizedLink
          key={index}
          href={getNavHref(item)}
          onClick={onNavigate}
          className={`${dropdownItemClasses} ${item.indent ? 'pl-6' : ''}`}
        >
          <span
            className={`block text-[14px] ${
              item.indent ? 'font-normal text-sc-ink-600' : 'font-medium text-sc-ink-900'
            }`}
          >
            {item.label}
          </span>
          {item.description && (
            <span className="mt-0.5 block text-[12.5px] leading-snug text-sc-ink-400">
              {item.description}
            </span>
          )}
        </LocalizedLink>
      ))}
    </div>
  )
}

export default function Header({ settings, language }: HeaderProps) {
  // Index of the open dropdown, or null. One menu is open at a time.
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [openMobileIndex, setOpenMobileIndex] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  const { cart, openCart } = useCart()

  // Portal only after mount to avoid hydration mismatch (server has no portal)
  useEffect(() => setMounted(true), [])

  // Use Sanity data or fall back to the built-in menu for this language
  const menu = liveNavigation(settings?.menu?.length ? settings.menu : defaultNavigation(language))
  const ctaButton = settings?.ctaButton?.label ? settings.ctaButton : defaultCta(language)

  const closeMenus = () => setOpenIndex(null)

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
    if (openIndex === null) return

    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 1024) return
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenIndex(null)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenIndex(null)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [openIndex])

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
            <div ref={navRef} className="hidden lg:flex items-center gap-2 xl:gap-3 ml-2">
              {menu.map((item, index) => {
                if (!hasColumns(item)) {
                  return (
                    <LocalizedLink
                      key={index}
                      href={getNavHref(item)}
                      className={`${navLinkClasses} px-2 py-2`}
                    >
                      {item.label}
                    </LocalizedLink>
                  )
                }

                const isOpen = openIndex === index
                const columns = item.columns ?? []

                return (
                  <div key={index} className="relative" onMouseLeave={closeMenus}>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      onMouseEnter={() => setOpenIndex(index)}
                      aria-expanded={isOpen}
                      className={`flex items-center gap-1 px-2 py-2 ${navLinkClasses}`}
                    >
                      {item.label}
                      <svg
                        className={`w-3.5 h-3.5 text-sc-ink-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Always in the DOM (CSS-hidden when closed) so the links are crawlable.
                        The outer box starts flush at top-full and pads the gap itself, so the
                        cursor never crosses dead space on its way from the button to the panel. */}
                    <div
                      className={`absolute top-full left-0 pt-3 z-[10002] ${isOpen ? '' : 'hidden'}`}
                    >
                      <div className="flex gap-8 bg-white rounded-xl border border-sc-ink-100 shadow-lg p-5">
                        {columns.map((column, columnIndex) => (
                          <MenuColumn key={columnIndex} column={column} onNavigate={closeMenus} />
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
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
              <div className="flex flex-col pt-2 pb-6 px-5">
                {menu.map((item, index) => {
                  const closeDrawer = () => {
                    setIsMobileMenuOpen(false)
                    setOpenMobileIndex(null)
                  }

                  if (!hasColumns(item)) {
                    return (
                      <LocalizedLink
                        key={index}
                        href={getNavHref(item)}
                        className="border-b border-sc-ink-100 py-3.5 text-sc-ink-900 hover:text-sc-ink-600 transition-colors font-medium text-[15px]"
                        onClick={closeDrawer}
                      >
                        {item.label}
                      </LocalizedLink>
                    )
                  }

                  const isOpen = openMobileIndex === index

                  return (
                    <div key={index} className="border-b border-sc-ink-100">
                      <button
                        onClick={() => setOpenMobileIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        className="flex items-center justify-between w-full py-3.5 text-sc-ink-900 hover:text-sc-ink-600 transition-colors font-medium text-[15px]"
                      >
                        {item.label}
                        <svg
                          className={`w-4 h-4 text-sc-ink-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="pb-3">
                          {item.columns?.map((column, columnIndex) => (
                            <div key={columnIndex} className="mb-2 last:mb-0">
                              {column.title && (
                                <p className="px-2.5 mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-sc-ink-400">
                                  {column.title}
                                </p>
                              )}
                              {column.items?.map((link, linkIndex) => (
                                <LocalizedLink
                                  key={linkIndex}
                                  href={getNavHref(link)}
                                  className={`block py-2 text-[14px] text-sc-ink-500 hover:text-sc-ink-900 transition-colors ${
                                    link.indent ? 'pl-7' : 'pl-2.5'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    closeDrawer()
                                  }}
                                >
                                  {link.label}
                                </LocalizedLink>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Mobile CTA */}
                <LocalizedLink
                  href={getNavHref(ctaButton)}
                  className="inline-block bg-sc-ink-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-sc-ink-700 transition-colors text-center text-[13px] mt-5"
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
