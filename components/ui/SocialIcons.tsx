import React from 'react'
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaLinkedin,
} from 'react-icons/fa'
import { HiEnvelope } from 'react-icons/hi2'

interface SocialIconsProps {
  className?: string
}

export default function SocialIcons({ className = '' }: SocialIconsProps) {
  const iconClass =
    'xl:w-6 xl:h-6 w-4 h-4 text-white hover:text-teal transition-colors cursor-pointer flex-shrink-0'

  return (
    <div className={`flex items-center xl:gap-4 gap-3 ${className}`}>
      <FaInstagram className={iconClass} />
      <FaFacebook className={iconClass} />
      <FaYoutube className={iconClass} />
      <FaTiktok className={iconClass} />
      <HiEnvelope className={iconClass} />
      <FaLinkedin className={iconClass} />
    </div>
  )
}
