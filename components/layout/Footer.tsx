import React from 'react'
import Logo from '@/components/ui/Logo'
import LocalizedLink from '@/components/ui/LocalizedLink'
import { FaLinkedinIn, FaTwitter, FaInstagram, FaFacebookF, FaYoutube, FaGithub } from 'react-icons/fa'

interface FooterLink {
  label?: string
  slug?: string | null
  href?: string | null
}

interface FooterColumn {
  title?: string
  links?: FooterLink[]
}

interface SocialLink {
  platform?: string
  url?: string
}

interface FooterSettings {
  columns?: FooterColumn[]
  connectSection?: {
    title?: string
    email?: string
    phone?: string
    socialLinks?: SocialLink[]
  }
  bottomSection?: {
    badgeText?: string
    orgNumber?: string
    legalLinks?: FooterLink[]
    copyrightText?: string
  }
}

interface FooterProps {
  settings?: FooterSettings
}

// Default columns
const defaultColumns: FooterColumn[] = [
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Partners', href: '/partners' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'All Packages', href: '/services/all_packages' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog & Articles', href: '/resources/blog' },
    ],
  },
  {
    title: 'Merch',
    links: [
      { label: 'Merch', href: '/merch' },
    ],
  },
]

const defaultConnectSection = {
  title: 'Connect',
  email: 'hello@scandicommerce.no',
  phone: '+47 123 45 678',
  socialLinks: [
    { platform: 'linkedin', url: 'https://linkedin.com' },
    { platform: 'twitter', url: 'https://twitter.com' },
    { platform: 'instagram', url: 'https://instagram.com' },
  ],
}

const defaultBottomSection = {
  badgeText: 'Shopify Plus Partner',
  orgNumber: 'Org.nr: 123 456 789',
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy', slug: null },
    { label: 'Terms', href: '/terms', slug: null },
    { label: 'Cookies', href: '/cookies', slug: null },
  ] as FooterLink[],
  copyrightText: '© 2025 ScandiCommerce. All rights reserved.',
}

// Social icon mapping
const getSocialIcon = (platform?: string) => {
  switch (platform?.toLowerCase()) {
    case 'linkedin':
      return <FaLinkedinIn className="w-4 h-4" />
    case 'twitter':
      return <FaTwitter className="w-4 h-4" />
    case 'instagram':
      return <FaInstagram className="w-4 h-4" />
    case 'facebook':
      return <FaFacebookF className="w-4 h-4" />
    case 'youtube':
      return <FaYoutube className="w-4 h-4" />
    case 'github':
      return <FaGithub className="w-4 h-4" />
    default:
      return null
  }
}

export default function Footer({ settings }: FooterProps) {
  // Use Sanity data or fallback to defaults
  const columns = settings?.columns?.length ? settings.columns : defaultColumns
  const connectSection = settings?.connectSection?.email ? settings.connectSection : defaultConnectSection
  const bottomSection = settings?.bottomSection?.badgeText ? settings.bottomSection : defaultBottomSection

  return (
    <footer className="w-full bg-black text-white mt-auto">
      <div className="section_container mx-auto page-padding-x py-8 sm:py-10 lg:py-12">
        {/* Main Footer Grid */}
        <div className="grid lg:flex justify-between xl:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 sm:gap-12 lg:gap-2 xl:gap-6 2xl:gap-8 mb-8 sm:mb-10 lg:mb-12">
          {/* Logo - Full width on mobile, scales gradually on desktop */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 mb-4 sm:mb-6 lg:mb-0">
            <div className="w-[170px] lg:w-[120px] xl:w-[150px] 2xl:w-[185px]">
              <Logo logoPath='/images/footer-logo.png' />
            </div>
          </div>

          {/* Dynamic Columns */}
          {columns.map((column, index) => (
            <div key={index} className="col-span-1 lg:min-w-[130px] xl:min-w-auto">
              <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 pb-2 border-b border-gray-700">
                {column.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                {column.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <LocalizedLink
                      href={link.slug ? `/${link.slug}` : (link.href || '#')}
                      className="text-gray-300 hover:text-teal transition-colors"
                    >
                      {link.label}
                    </LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect Section */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 pb-2 border-b border-gray-700">
              {connectSection.title}
            </h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              {connectSection.email && (
                <p className="text-gray-300">
                  <a
                    href={`mailto:${connectSection.email}`}
                    className="hover:text-teal transition-colors break-all sm:break-normal"
                  >
                    {connectSection.email}
                  </a>
                </p>
              )}
              {connectSection.phone && (
                <p>
                  <a
                    href={`tel:${connectSection.phone.replace(/\s/g, '')}`}
                    className="text-teal hover:text-teal-light transition-colors"
                  >
                    {connectSection.phone}
                  </a>
                </p>
              )}
            </div>
            {connectSection.socialLinks && connectSection.socialLinks.length > 0 && (
              <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                {connectSection.socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-teal transition-colors"
                    aria-label={social.platform}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Badge and Org Number */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4">
              {bottomSection.badgeText && (
                <span className="bg-gray-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium">
                  {bottomSection.badgeText}
                </span>
              )}
              {bottomSection.orgNumber && (
                <p className="text-gray-400 text-xs sm:text-sm">{bottomSection.orgNumber}</p>
              )}
            </div>

            {/* Legal Links */}
            {bottomSection.legalLinks && bottomSection.legalLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
                {bottomSection.legalLinks.map((link, index) => (
                  <LocalizedLink
                    key={index}
                    href={link.slug ? `/${link.slug}` : (link.href || '#')}
                    className="text-gray-400 hover:text-teal transition-colors"
                  >
                    {link.label}
                  </LocalizedLink>
                ))}
              </div>
            )}
          </div>

          {/* Copyright */}
          {bottomSection.copyrightText && (
            <div className="mt-6 sm:mt-8 text-center sm:text-left lg:text-center">
              <p className="text-gray-500 text-xs sm:text-sm">
                {bottomSection.copyrightText}
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
