'use client'

import { useState } from 'react'
import CalculatorForm from '@/components/sections/shopify/shopify_TCO_calculator/CalculatorForm'
import Hero from '@/components/layout/Hero'
import { Button } from '@/components/ui'

interface TCOCalculatorClientProps {
  hero?: {
    heroTitle?: {
      text?: string
      highlight?: string
    }
    heroDescription?: string
    platforms?: string[]
  }
}

export default function TCOCalculatorClient({ hero }: TCOCalculatorClientProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('WooCommerce')

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform)
    // Scroll to calculator form
    const formElement = document.getElementById('calculator-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <Hero hero={hero}>
        <div className="w-full grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
          {hero?.platforms?.map((platform, index) => (
            <Button
              key={index}
              onClick={() => handlePlatformSelect(platform)}
            >
              {platform}
            </Button>
          ))}
        </div>
      </Hero>
      <div id="calculator-form">
        <CalculatorForm selectedPlatform={selectedPlatform} />
      </div>
    </>
  )
}
