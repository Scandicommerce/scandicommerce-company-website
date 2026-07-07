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
  if (brands.length === 0 && !section.headline) return null;

  return (
    <div className="border-t border-sc-ink-100 pt-12 text-center">
      {section.headline && (
        <h2 className="mx-auto mb-10 max-w-lg text-2xl font-bold tracking-[-0.02em] text-sc-ink-900">
          {section.headline}
        </h2>
      )}

      {brands.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {brands.map((brand, i) => {
            const inner = (
              <span className="flex items-center justify-center">
                {brand.logo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logo.url}
                    alt={brand.logo.alt ?? brand.name ?? "Brand logo"}
                    className="h-12 w-auto object-contain md:h-14"
                    style={{ maxHeight: 56, width: "auto" }}
                  />
                ) : (
                  <span className="text-base font-semibold text-sc-ink-900">{brand.name}</span>
                )}
              </span>
            );

            return brand.url ? (
              <a
                key={i}
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                {inner}
              </a>
            ) : (
              <span key={i} className="opacity-70">
                {inner}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
