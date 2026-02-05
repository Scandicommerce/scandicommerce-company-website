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
      <div className="section_container mx-auto page-padding-x">
        {/* Title */}
        <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] text-center mb-12 lg:mb-16">
          {title}
        </h2>

        {/* Values Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-[#F5F5F5] px-4 lg:px-6 py-6 lg:py-10"
            >
              <h3 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-[#222222] mb-4 text-center">
                {value.title}
              </h3>
              <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#555555] leading-relaxed text-center">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
