import Image from "next/image";
import Link from "next/link";

export interface RelatedCaseStudy {
  _id?: string | null;
  language?: string | null;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  industry?: string | null;
  heroImageUrl?: string | null;
}

interface CaseStudyRelatedCasesProps {
  cases: RelatedCaseStudy[];
  /** Language of the current page (for cross-language links) */
  pageLanguage: string;
}

function caseHref(item: RelatedCaseStudy, pageLanguage: string): string {
  const slug = item.slug ?? "";
  const cardLanguage = item.language ?? pageLanguage;
  return cardLanguage === pageLanguage
    ? `/resources/${slug}`
    : `/${cardLanguage}/resources/${slug}`;
}

export default function CaseStudyRelatedCases({ cases, pageLanguage }: CaseStudyRelatedCasesProps) {
  const items = (cases ?? []).filter((c) => c.slug && c.title);
  if (items.length === 0) return null;

  return (
    <section className="bg-sc-ink-50">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <h2 className="mb-8 text-[28px] font-bold tracking-[-0.02em] text-sc-ink-900 md:text-[32px]">
          Flere kundecaser
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item._id ?? item.slug}
              href={caseHref(item, pageLanguage)}
              className="block overflow-hidden rounded-[10px] border border-sc-ink-100 bg-white transition-shadow duration-200 hover:shadow-lg"
            >
              <div className="relative h-[200px] w-full bg-sc-ink-100">
                {item.heroImageUrl && (
                  <Image
                    src={item.heroImageUrl}
                    alt={item.title ?? ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 424px"
                  />
                )}
              </div>
              <div className="p-[22px]">
                <div className="mb-1 text-[17px] font-bold text-sc-ink-900">{item.title}</div>
                {item.excerpt && (
                  <div className="text-[13px] leading-relaxed text-sc-ink-600 line-clamp-2">
                    {item.excerpt}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
