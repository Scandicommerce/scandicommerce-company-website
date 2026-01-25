'use client'

import { TableOfContentsItem } from '@/lib/articles'

interface TableOfContentsProps {
  items: TableOfContentsItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Split items into two columns
  const midPoint = Math.ceil(items.length / 2)
  const leftColumn = items.slice(0, midPoint)
  const rightColumn = items.slice(midPoint)

  return (
    <div className="bg-white shadow-sm p-8 lg:p-[8rem] lg:px-16">
      <h2 className="text-2xl font-bold text-[#1F1D1D] mb-8">Table of Contents</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {leftColumn.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="flex items-center gap-5 cursor-pointer bg-[#F5F5F5] px-6 py-4 w-full hover:bg-[#EDEDED] transition-colors"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#03C1CA] text-white text-sm font-medium flex-shrink-0">
                {item.number}.
              </span>
              <span className="text-[#565454] text-sm">
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {rightColumn.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="flex items-center gap-5 cursor-pointer bg-[#F5F5F5] px-6 py-4 w-full hover:bg-[#EDEDED] transition-colors"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#03C1CA] text-white text-sm font-medium flex-shrink-0">
                {item.number}.
              </span>
              <span className="text-[#565454] text-sm">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

