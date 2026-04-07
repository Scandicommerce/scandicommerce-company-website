"use client";

import Image from "next/image";

interface Brand {
  name?: string | null;
  logo?: { url?: string | null; alt?: string | null } | null;
  url?: string | null;
}

interface CaseStudyRelatedSectionProps {
  section: {
    headline?: string | null;
    brands?: Brand[] | null;
  };
}

export default function CaseStudyRelatedSection({ section }: CaseStudyRelatedSectionProps) {
  const brands = (section.brands ?? []).filter((b) => b.name || b.logo?.url);

  return (
    <section className="bg-white py-14 md:py-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {section.headline && (
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1F1D1D] mb-10 max-w-lg mx-auto">
            {section.headline}
          </h2>
        )}

        {brands.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {brands.map((brand, i) => {
              const inner = (
                <div className="flex items-center justify-center">
                  {brand.logo?.url ? (
                    <Image
                      src={brand.logo.url}
                      alt={brand.logo.alt ?? brand.name ?? "Brand logo"}
                      width={140}
                      height={56}
                      className="object-contain h-12 md:h-14 w-auto"
                      style={{ maxHeight: 56, width: "auto" }}
                    />
                  ) : (
                    <span className="text-base font-semibold text-[#1F1D1D]">{brand.name}</span>
                  )}
                </div>
              );

              return brand.url ? (
                <a
                  key={i}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  {inner}
                </a>
              ) : (
                <div key={i} className="opacity-70">
                  {inner}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
