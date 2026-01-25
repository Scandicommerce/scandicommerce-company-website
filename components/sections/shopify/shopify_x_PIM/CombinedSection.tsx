'use client'

interface Step {
  title?: string
  description?: string
}

interface FAQItem {
  question?: string
  answer?: string
}

interface CombinedSectionData {
  choosingPim?: {
    title?: string
    description?: string
    leftColumnTitle?: string
    leftColumnDescription?: string
    selectionCriteria?: string[]
    impactParagraph1?: string
    impactParagraph2?: string
    linkText?: string
  }
  gettingStarted?: {
    title?: string
    description?: string
    steps?: Step[]
    bottomNote?: string
  }
  faq?: {
    title?: string
    items?: FAQItem[]
  }
  transformExperience?: {
    title?: string
    paragraph1?: string
    paragraph2?: string
    quoteText?: string
  }
}

interface CombinedSectionProps {
  combinedSection?: CombinedSectionData
}

export default function CombinedSection({ combinedSection }: CombinedSectionProps) {
  const choosingPim = combinedSection?.choosingPim
  const gettingStarted = combinedSection?.gettingStarted
  const faq = combinedSection?.faq
  const transformExperience = combinedSection?.transformExperience

  const selectionCriteria = choosingPim?.selectionCriteria || []
  const steps = gettingStarted?.steps || []
  const faqItems = faq?.items || []

  return (
    <section className="bg-[#F8F8F8] py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Choosing the Right PIM Section */}
        {choosingPim && (
          <div className="mb-16 lg:mb-24">
            <div className="text-center mb-12 lg:mb-16">
              {choosingPim.title && (
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] mb-4">
                  {choosingPim.title}
                </h2>
              )}
              {choosingPim.description && (
                <p className="text-base lg:text-lg text-[#565454] max-w-5xl mx-auto">
                  {choosingPim.description}
                </p>
              )}
            </div>

            {/* Two Column Layout with wrapper */}
            <div className="bg-white max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Column - Cyan Background */}
                <div className="bg-[#03C1CA] p-6 lg:p-8">
                  {choosingPim.leftColumnTitle && (
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">
                      {choosingPim.leftColumnTitle}
                    </h3>
                  )}
                  {choosingPim.leftColumnDescription && (
                    <p className="text-white/90 mb-6">
                      {choosingPim.leftColumnDescription}
                    </p>
                  )}
                  {selectionCriteria.length > 0 && (
                    <ul className="space-y-4">
                      {selectionCriteria.map((criterion, index) => (
                        <li key={index} className="flex items-start text-white">
                          <span className="mr-3 text-white">•</span>
                          <span className="text-sm lg:text-base">{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Right Column - White Background */}
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  {choosingPim.impactParagraph1 && (
                    <p className="text-base lg:text-lg text-[#565454] mb-6">
                      <span className="font-bold text-[#222222]">The Impact:</span>{' '}
                      {choosingPim.impactParagraph1}
                    </p>
                  )}
                  {choosingPim.impactParagraph2 && (
                    <p className="text-base lg:text-lg text-[#565454] mb-6">
                      {choosingPim.impactParagraph2}
                    </p>
                  )}
                  {choosingPim.linkText && (
                    <a href="/contact" className="text-[#03C1CA] hover:underline font-medium">
                      {choosingPim.linkText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Getting Started Section */}
        {gettingStarted && (
          <div className="mb-16 lg:mb-24 max-w-5xl mx-auto">
            <div className="bg-[#03C1CA] p-8 lg:p-12">
              <div className="text-center mb-12">
                {gettingStarted.title && (
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                    {gettingStarted.title}
                  </h2>
                )}
                {gettingStarted.description && (
                  <p className="text-base lg:text-lg text-white/90 max-w-5xl mx-auto">
                    {gettingStarted.description}
                  </p>
                )}
              </div>

              {/* Steps Grid */}
              {steps.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-12">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="bg-[#1CD8E2] p-6"
                    >
                      <h3 className="text-base lg:text-lg font-semibold text-white mb-2">
                        {index + 1}. {step.title}
                      </h3>
                      {step.description && (
                        <p className="text-sm text-white/90">
                          {step.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Implementation Timeline Note */}
              {gettingStarted.bottomNote && (
                <p className="text-center text-base lg:text-lg text-white max-w-5xl mx-auto">
                  {gettingStarted.bottomNote}
                </p>
              )}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {faq && faqItems.length > 0 && (
          <div className="mb-16 lg:mb-24 max-w-5xl mx-auto">
            {faq.title && (
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] text-center mb-12 lg:mb-16">
                {faq.title}
              </h2>
            )}

            {/* FAQ Items */}
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 lg:p-8"
                >
                  {item.question && (
                    <h3 className="text-base sm:text-lg font-semibold text-[#222222] mb-3">
                      {item.question}
                    </h3>
                  )}
                  {item.answer && (
                    <p className="text-sm sm:text-base text-[#565454] leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transform Experience Section */}
        {transformExperience && (
          <div className="max-w-5xl mx-auto">
            {transformExperience.title && (
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] text-center mb-8">
                {transformExperience.title}
              </h2>
            )}

            {/* Content */}
            <div className="space-y-6 mb-8">
              {transformExperience.paragraph1 && (
                <p className="text-base lg:text-lg text-[#565454] leading-relaxed">
                  {transformExperience.paragraph1}
                </p>
              )}

              {transformExperience.paragraph2 && (
                <p className="text-base lg:text-lg text-[#565454] leading-relaxed">
                  {transformExperience.paragraph2}
                </p>
              )}
            </div>

            {/* Quote Block */}
            {transformExperience.quoteText && (
              <div className="bg-[#1DEFFA15] p-6 lg:p-8">
                <p className="text-sm lg:text-base text-[#565454]">
                  &ldquo;{transformExperience.quoteText}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
