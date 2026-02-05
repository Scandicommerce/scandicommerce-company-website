'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Author } from '@/lib/articles'

interface AuthorBioProps {
  author: Author
}

export default function AuthorBio({ author }: AuthorBioProps) {
  return (
    <section className="bg-[#EFEFEF] py-8">
      <div className="section_container mx-auto page-padding-x">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-sm p-8 lg:p-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Author Image */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#03C1CA]/20">
                  <Image
                    src={author.image}
                    alt={author.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              </div>

              {/* Author Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-[#1F1D1D] mb-2">
                  {author.name}
                </h3>
                <p className="text-[#565454] text-sm md:text-base leading-relaxed mb-4">
                  {author.role}
                </p>
                <Link
                  href={`/team/${author.slug}`}
                  className="inline-block px-6 py-2.5 bg-[#03C1CA] text-white text-sm font-medium hover:bg-[#02a8b0] transition-colors"
                >
                  More from {author.name.split(' ')[0]}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

