import React from 'react'
import { HiCube } from 'react-icons/hi2'

interface ServiceCardProps {
  title: string
  price: string
  icon?: React.ReactNode
  isOdd?: boolean
}

export default function ServiceCard({ title, price, icon, isOdd = false }: ServiceCardProps) {
  return (
    <div className={`bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-6 flex items-center gap-4 shadow-md w-full lg:w-[85%] ${isOdd ? 'ml-0 lg:ml-[15%]' : ''}`}>
      <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 bg-teal rounded-full flex items-center justify-center">
        {icon || <HiCube className="w-7 h-7 text-white" />}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 font-sans">{title}</h3>
        <p className="text-xs xs:text-sm text-gray-600 font-mono">{price}</p>
      </div>
    </div>
  )
}

