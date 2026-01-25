'use client'

interface Value {
  title?: string
  description?: string
}

interface OurValuesData {
  title?: string
  values?: Value[]
}

interface OurValuesProps {
  ourValues?: OurValuesData
}

// Default values
const defaultValues: Value[] = [
  {
    title: 'Transparency',
    description: "No hidden fees, no surprise costs. You know exactly what you're getting and what it costs.",
  },
  {
    title: 'Results First',
    description: "We're measured by your success. Conversions, revenue, and customer satisfaction matter most.",
  },
  {
    title: 'No BS',
    description: 'We tell you what you need to hear, not what you want to hear. Honest advice always.',
  },
  {
    title: 'Long-term Partnerships',
    description: "We're not project-hopping. We build relationships and grow with our clients.",
  },
]

export default function OurValues({ ourValues }: OurValuesProps) {
  const title = ourValues?.title || 'Our values'
  const values = ourValues?.values && ourValues.values.length > 0 ? ourValues.values : defaultValues

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#222222] text-center mb-12 lg:mb-16">
          {title}
        </h2>

        {/* Values Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-[#F5F5F5] px-4 lg:px-6 py-6 lg:py-10"
            >
              <h3 className="md:text-sm xl:text-lg 2xl:text-xl font-bold text-[#222222] mb-4 text-center">
                {value.title}
              </h3>
              <p className="text-xs xl:text-sm text-[#555555] leading-relaxed text-center">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
