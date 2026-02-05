'use client'

interface EnhancingWithAiData {
  title?: string
  paragraph1?: string
  paragraph2?: string
  quote?: {
    text?: string
    author?: string
  }
}

interface EnhancingWithAIProps {
  enhancingWithAi?: EnhancingWithAiData
}

export default function EnhancingWithAI({ enhancingWithAi }: EnhancingWithAIProps) {
  const title = enhancingWithAi?.title
  const paragraph1 = enhancingWithAi?.paragraph1
  const paragraph2 = enhancingWithAi?.paragraph2
  const quote = enhancingWithAi?.quote

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        {title && (
          <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-[#222222] text-center mb-8 lg:mb-12">
            {title}
          </h2>
        )}

        <div className="max-w-5xl mx-auto space-y-6">
          {paragraph1 && (
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] leading-relaxed">
              {paragraph1}
            </p>
          )}

          {paragraph2 && (
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] leading-relaxed">
              {paragraph2}
            </p>
          )}

          {/* Quote Block */}
          {quote?.text && (
            <div className="bg-[#1DEFFA15] border-l-4 border-[#03C1CA] p-6 lg:p-8 mt-8">
              <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-[#565454] italic mb-4">
                &ldquo;{quote.text}&rdquo;
              </p>
              {quote.author && (
                <p className="text-[#03C1CA] font-semibold">
                  — {quote.author}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
