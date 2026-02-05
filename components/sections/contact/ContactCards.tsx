'use client'

import React from 'react'
import { HiOutlineMail } from 'react-icons/hi'
import { FiPhone } from 'react-icons/fi'
import { HiOutlineLocationMarker } from 'react-icons/hi'

interface CardData {
  icon?: string
  title?: string
  subtitle?: string
  detail?: string
  href?: string
}

interface ContactCardsData {
  cards?: CardData[]
}

interface ContactCardsProps {
  contactCards?: ContactCardsData
}

interface ContactCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  detail: string
  href?: string
  showLeftBorder?: boolean
  showRightBorder?: boolean
}

// Default cards
const defaultCards: CardData[] = [
  {
    icon: 'email',
    title: 'Email Us',
    subtitle: 'Get a response within 2 hours',
    detail: 'hello@scandicommerce.no',
    href: 'mailto:hello@scandicommerce.no',
  },
  {
    icon: 'phone',
    title: 'Call Us',
    subtitle: 'Mon-Fri, 9:00-17:00 CET',
    detail: '+47 123 45 678',
    href: 'tel:+4712345678',
  },
  {
    icon: 'location',
    title: 'Visit Us',
    subtitle: 'Oslo, Norway',
    detail: 'Storgata 10, 0155 Oslo',
  },
]

const getIcon = (iconName?: string) => {
  switch (iconName) {
    case 'email':
      return <HiOutlineMail className='w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7' />
    case 'phone':
      return <FiPhone className='w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7' />
    case 'location':
      return <HiOutlineLocationMarker className='w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7' />
    default:
      return <HiOutlineMail className='w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7' />
  }
}

function ContactCard({ icon, title, subtitle, detail, href, showLeftBorder, showRightBorder }: ContactCardProps) {
  const borderClasses = `${showLeftBorder ? 'md:border-l md:border-[#565454]' : ''} ${showRightBorder ? 'md:border-r md:border-[#565454]' : ''}`

  const content = (
    <div className={`flex flex-col items-center text-center py-6 px-8 bg-white ${borderClasses}`}>
      <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#03C1CA] flex items-center justify-center mb-4">
        <div className="text-white text-xl md:text-2xl">
          {icon}
        </div>
      </div>
      <h3 className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-gray-500 mb-1">{subtitle}</p>
      <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#03C1CA] font-medium">{detail}</p>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="w-full md:flex-1 block">
        {content}
      </a>
    )
  }

  return <div className="w-full md:flex-1">{content}</div>
}

export default function ContactCards({ contactCards }: ContactCardsProps) {
  const cards = contactCards?.cards && contactCards.cards.length > 0
    ? contactCards.cards
    : defaultCards

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white">
      <div className="section_container mx-auto page-padding-x">
        <div className="flex flex-col md:flex-row items-stretch justify-center">
          {cards.map((card, index) => (
            <ContactCard
              key={index}
              icon={getIcon(card.icon)}
              title={card.title || ''}
              subtitle={card.subtitle || ''}
              detail={card.detail || ''}
              href={card.href}
              showLeftBorder={index === 0}
              showRightBorder={true}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
