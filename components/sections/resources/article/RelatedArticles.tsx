'use client'

import Image from 'next/image'
import Link from 'next/link'
import { RelatedArticle } from '@/lib/articles'
import { FiClock } from 'react-icons/fi'

interface RelatedArticlesProps {
  articles: RelatedArticle[]
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <section className="bg-[#EFEFEF] py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1F1D1D] text-center mb-10">
          Related Articles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {articles.map((article, index) => (
            <Link
              key={index}
              href={`/resources/${article.slug}`}
              className="group relative overflow-hidden"
            >
              {/* Article Image */}
              <div className="relative w-full h-[280px] md:h-[320px] lg:h-[380px]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Article Info - Overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {/* Category Badge */}
                <span className="inline-block px-3 py-1 bg-[#03C1CA] text-white text-xs font-medium rounded mb-3">
                  {article.category}
                </span>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-[#03C1CA] transition-colors">
                  {article.title}
                </h3>

                {/* Read Time */}
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <FiClock className="w-4 h-4" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

