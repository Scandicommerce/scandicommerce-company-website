'use client'

interface ToolCategory {
  title?: string
  description?: string
}

interface AiToolsToolkitData {
  title?: string
  toolCategories?: ToolCategory[]
  bottomText?: string
}

interface AIToolsToolkitProps {
  aiToolsToolkit?: AiToolsToolkitData
}

export default function AIToolsToolkit({ aiToolsToolkit }: AIToolsToolkitProps) {
  const title = aiToolsToolkit?.title
  const toolCategories = aiToolsToolkit?.toolCategories || []
  const bottomText = aiToolsToolkit?.bottomText

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          {title && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] mb-4">
              {title}
            </h2>
          )}
        </div>

        {/* Three Columns */}
        {toolCategories.length > 0 && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {toolCategories.map((category, index) => {
              const isLastInRow = index === toolCategories.length - 1
              return (
                <div 
                  key={index} 
                  className={`text-center border-l border-[#E5E5E5] p-6 lg:p-8 ${isLastInRow ? 'md:border-r' : ''}`}
                >
                  {category.title && (
                    <h3 className="text-lg lg:text-xl font-semibold text-[#03C1CA] mb-4">
                      {category.title}
                    </h3>
                  )}
                  {category.description && (
                    <p className="text-sm lg:text-base text-[#565454] leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Bottom Text */}
        {bottomText && (
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base lg:text-lg text-[#565454] leading-relaxed">
              {bottomText}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
