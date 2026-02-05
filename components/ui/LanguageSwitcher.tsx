'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Globe } from 'lucide-react'
import { defaultLanguage } from '@/sanity/lib/languages'

/** Placeholder that matches server/first paint to avoid hydration mismatch */
function LanguageSwitcherPlaceholder() {
  const defaultLangTitle = 'English'
  const defaultCode = defaultLanguage.toUpperCase()
  return (
    <div className="relative">
      <div
        className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 text-gray-900 font-medium text-xs border border-gray-200 rounded-md min-w-0"
        aria-hidden
      >
        <Globe className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="hidden xs:inline truncate">{defaultLangTitle}</span>
        <span className="xs:hidden flex-shrink-0">{defaultCode}</span>
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

function LanguageSwitcherInner() {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageChange = (langId: string) => {
    setLanguage(langId)
    setIsOpen(false)
  }

  if (!mounted) {
    return <LanguageSwitcherPlaceholder />
  }

  const currentLang = availableLanguages.find((lang) => lang.id === currentLanguage)

  return (
    <div className="relative min-w-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 text-gray-900 hover:text-teal transition-colors font-medium text-xs border border-gray-200 rounded-md hover:border-teal min-w-0"
        aria-label="Select language"
      >
        <Globe className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="hidden xs:inline truncate max-w-[4.5rem] sm:max-w-none">{currentLang?.title || currentLanguage.toUpperCase()}</span>
        <span className="xs:hidden flex-shrink-0">{currentLanguage.toUpperCase()}</span>
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-[10002]">
          {availableLanguages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id)}
              className={`w-full text-left px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm transition-colors ${
                currentLanguage === lang.id
                  ? 'bg-teal/10 text-teal font-semibold'
                  : 'text-gray-900 hover:bg-gray-50 hover:text-teal'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{lang.title}</span>
                {currentLanguage === lang.id && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function LanguageSwitcher() {
  return (
    <Suspense fallback={<LanguageSwitcherPlaceholder />}>
      <LanguageSwitcherInner />
    </Suspense>
  )
}
