'use client'

interface AddOn {
  title?: string
  description?: string
  price?: string
}

interface AddOnsData {
  sectionTitle?: string
  sectionSubtitle?: string
  items?: AddOn[]
}

interface FrequentlyAddedTogetherProps {
  addOns?: AddOnsData
}

// Default add-ons
const defaultAddOns: AddOn[] = [
  {
    title: 'CRO Audit',
    description: 'Comprehensive conversion optimization analysis',
    price: '12.000 kr',
  },
  {
    title: 'Monthly Support',
    description: 'Ongoing updates, bug fixes, and improvements',
    price: '8.000 kr/mo',
  },
]

export default function FrequentlyAddedTogether({ addOns }: FrequentlyAddedTogetherProps) {
  const sectionTitle = addOns?.sectionTitle || 'Frequently added together'
  const sectionSubtitle = addOns?.sectionSubtitle || 'Enhance your package with these popular add-ons'
  const items = addOns?.items && addOns.items.length > 0 ? addOns.items : defaultAddOns

  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-3">
            {sectionTitle}
          </h2>
          <p className="text-base text-gray-500 text-center mb-10">
            {sectionSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((addOn, index) => (
              <div
                key={index}
                className="bg-white p-6 border border-gray-100 shadow-sm relative"
              >
                {/* Add button - top right */}
                <button className="absolute top-5 right-5 bg-[#03C1CA] hover:bg-[#02a9b1] text-white px-5 py-1.5 text-sm font-medium transition-colors duration-200">
                  Add
                </button>
                
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-20">
                  {addOn.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-500 mb-4">{addOn.description}</p>
                
                {/* Price */}
                <p className="text-lg font-bold text-[#03C1CA] font-mono tracking-tight">
                  {addOn.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
