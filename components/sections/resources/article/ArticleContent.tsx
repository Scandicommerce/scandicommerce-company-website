'use client'

import Image from 'next/image'
import { Article } from '@/lib/articles'
import TableOfContents from './TableOfContents'

interface ArticleContentProps {
  article: Article
}

export default function ArticleContent({ article }: ArticleContentProps) {
  return (
    <section className="bg-[#EFEFEF] py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Image */}
        <div className="max-w-6xl mx-auto mb-12 px-8 lg:px-10">
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden shadow-lg">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
              priority
            />
          </div>
        </div>

        {/* Table of Contents */}
        <div className="max-w-6xl mx-auto mb-12 px-8 lg:px-10">
          <TableOfContents items={article.tableOfContents} />
        </div>

        {/* Article Content */}
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="px-8 lg:px-10 py-0 mb-8">
            <p className="text-[#565454] text-base md:text-lg leading-relaxed">
              {article.introduction}
            </p>
          </div>

          {/* Sections */}
          {article.sections.map((section, index) => (
            <div key={section.id} id={section.id} className="mb-8 scroll-mt-24">
              {/* Section Header */}
              <h2 className="text-2xl md:text-3xl font-bold text-[#1F1D1D] mb-6 px-8 lg:px-10">
                {section.title}
              </h2>

              {/* Section Content */}
              <div className="px-8 lg:px-10 pb-8 lg:pb-10">
                {/* Main Content */}
                <p className="text-[#1F1D1D] text-base md:text-lg leading-relaxed whitespace-pre-line mb-6">
                  {section.content}
                </p>

                {/* Pro Tip Box */}
                {section.proTip && (
                  <div className="mt-8 bg-[#E8F8F8] p-8 lg:p-10">
                    <h3 className="text-xl font-bold text-[#1F1D1D] mb-4">
                      {section.proTip.title}
                    </h3>
                    <p className="text-[#565454] text-base md:text-lg leading-relaxed">
                      {section.proTip.content}
                    </p>
                  </div>
                )}

                {/* Apps Recommendations */}
                {section.apps && section.apps.length > 0 && (
                  <div className="mt-8 space-y-6">
                    {section.apps.map((app, appIndex) => (
                      <div
                        key={appIndex}
                        className="bg-white border border-gray-200 p-8 lg:p-10"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <h3 className="text-xl font-bold text-[#1F1D1D]">
                            {index + 1}. {app.name}
                          </h3>
                          <span className="px-4 py-1.5 bg-[#03C1CA] text-white text-xs font-medium">
                            {app.category}
                          </span>
                        </div>

                        <p className="text-[#1F1D1D] text-base md:text-lg leading-relaxed mb-6">
                          {app.description}
                        </p>

                        {/* Features List */}
                        <ul className="space-y-3">
                          {app.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-center gap-3 text-[#1F1D1D] text-base"
                            >
                              <span className="text-[#565454] text-lg">›</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

