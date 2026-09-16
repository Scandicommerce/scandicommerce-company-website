import React from 'react'
import LocalizedLink from '@/components/ui/LocalizedLink'
import ManageCookiesLink from '@/components/tracking/ManageCookiesLink'
import NewsletterForm from '@/components/ui/NewsletterForm'
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
  newsletter?: {
    variant?: string
    overskrift?: string
    undertekst?: string
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
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'All Packages', href: '/services/all-packages' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog & Articles', href: '/blog' },
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
    { label: 'Sitemap', href: '/sitemap', slug: null },
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

// 2026 design shared classes
const columnTitleClasses = 'text-white font-bold text-[13px]'
const columnLinkClasses = 'text-[#8a95a0] hover:text-white transition-colors'

export default function Footer({ settings }: FooterProps) {
  // Use Sanity data or fallback to defaults
  const columns = settings?.columns?.length ? settings.columns : defaultColumns
  const connectSection = settings?.connectSection?.email ? settings.connectSection : defaultConnectSection
  const bottomSection = settings?.bottomSection?.badgeText ? settings.bottomSection : defaultBottomSection

  return (
    <footer className="w-full bg-sc-ink-950 text-[#d6dade] mt-auto">
      <div className="section_container mx-auto page-padding-x pt-10 sm:pt-12 lg:pt-16 pb-5 lg:pb-7">
        {/* Top grid: brand column | link columns */}
        <div className="grid gap-8 lg:grid-cols-[1fr_2.2fr] lg:gap-[60px] items-start">
          {/* Brand column */}
          <div>
            <img
              src="/images/brand/logo-white-text.png"
              alt="Scandicommerce"
              className="block h-6 lg:h-[30px] w-auto mb-4"
            />
            <p className="text-[12px] lg:text-[13px] leading-relaxed text-[#8a95a0]">
              {bottomSection.badgeText}
              {bottomSection.badgeText && bottomSection.orgNumber && <br />}
              {bottomSection.orgNumber}
            </p>

            {/* Newsletter signup (reusable block, footer variant) */}
            {settings?.newsletter?.overskrift && (
              <div className="mt-7">
                <div className="text-[13px] font-bold text-white mb-1">
                  {settings.newsletter.overskrift}
                </div>
                {settings.newsletter.undertekst && (
                  <p className="text-[12px] text-[#8a95a0] m-0 mb-3">
                    {settings.newsletter.undertekst}
                  </p>
                )}
                <NewsletterForm
                  source="footer"
                  emailPlaceholder="din@epost.no"
                  buttonText="Meld meg på"
                  successText="Takk! Du er meldt på."
                  className="flex w-full max-w-[320px]"
                  inputClassName="bg-white/[0.06] border border-white/10 text-white placeholder:text-[#5a6670] text-[13px] px-3 py-2.5 outline-none flex-1 rounded-l-lg focus:border-sc-cyan-500"
                  buttonClassName="px-4 py-2.5 text-[12px] font-semibold text-white bg-sc-cyan-500 hover:bg-sc-cyan-600 transition-colors rounded-r-lg whitespace-nowrap"
                />
              </div>
            )}
          </div>

          {/* Link columns: 2 cols on mobile, one row on desktop */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:flex lg:flex-wrap lg:justify-between lg:gap-7 text-[13px]">
            {columns.map((column, index) => (
              <div key={index} className="flex flex-col gap-2.5 lg:min-w-[120px]">
                <span className={columnTitleClasses}>{column.title}</span>
                {column.links?.map((link, linkIndex) => (
                  <LocalizedLink
                    key={linkIndex}
                    href={link.slug ? `/${link.slug}` : (link.href || '#')}
                    className={columnLinkClasses}
                  >
                    {link.label}
                  </LocalizedLink>
                ))}
              </div>
            ))}

            {/* Connect column */}
            <div className="flex flex-col gap-2.5 lg:min-w-[120px]">
              <span className={columnTitleClasses}>{connectSection.title}</span>
              {connectSection.email && (
                <a
                  href={`mailto:${connectSection.email}`}
                  className={`${columnLinkClasses} break-all sm:break-normal`}
                >
                  {connectSection.email}
                </a>
              )}
              {connectSection.phone && (
                <a
                  href={`tel:${connectSection.phone.replace(/\s/g, '')}`}
                  className={columnLinkClasses}
                >
                  {connectSection.phone}
                </a>
              )}
              {connectSection.socialLinks && connectSection.socialLinks.length > 0 && (
                <div className="mt-1 flex gap-3">
                  {connectSection.socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8a95a0] hover:text-white transition-colors"
                      aria-label={social.platform}
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 lg:mt-12 pt-5 border-t border-[rgba(255,255,255,0.08)] text-[12px] text-[#5a6670] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>{bottomSection.copyrightText}</span>
          {bottomSection.legalLinks && bottomSection.legalLinks.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {bottomSection.legalLinks.map((link, index) => (
                <LocalizedLink
                  key={index}
                  href={link.slug ? `/${link.slug}` : (link.href || '#')}
                  className="text-[#5a6670] hover:text-white transition-colors"
                >
                  {link.label}
                </LocalizedLink>
              ))}
              <ManageCookiesLink />
            </div>
          )}
          {(!bottomSection.legalLinks || bottomSection.legalLinks.length === 0) && (
            <ManageCookiesLink />
          )}
        </div>
      </div>
    </footer>
  )
}
