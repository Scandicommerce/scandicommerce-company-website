import Image from "next/image";

interface CaseStudyTestimonialSectionProps {
  section: {
    quote?: string | null;
    company?: string | null;
    authorName?: string | null;
    authorRole?: string | null;
    imageUrl?: string | null;
  };
}

export default function CaseStudyTestimonialSection({ section }: CaseStudyTestimonialSectionProps) {
  if (!section.quote) return null;

  const roleLine = [section.authorRole, section.company].filter(Boolean).join(", ");

  return (
    <figure
      className={`m-0 grid grid-cols-1 items-start gap-6 rounded-[10px] bg-sc-ink-50 p-8 md:gap-8 md:p-12 ${
        section.imageUrl ? "sm:grid-cols-[88px_minmax(0,1fr)]" : ""
      }`}
    >
      {section.imageUrl && (
        <Image
          src={section.imageUrl}
          alt={section.authorName ?? "Portrait"}
          width={88}
          height={88}
          className="h-[88px] w-[88px] rounded-full object-cover"
        />
      )}
      <div>
        <blockquote className="m-0">
          <p className="mb-[18px] mt-0 text-xl font-semibold leading-[1.45] tracking-[-0.01em] text-sc-ink-900 md:text-2xl">
            &laquo;{section.quote}&raquo;
          </p>
        </blockquote>
        {(section.authorName || roleLine) && (
          <figcaption>
            {section.authorName && (
              <div className="text-sm font-semibold text-sc-ink-900">{section.authorName}</div>
            )}
            {roleLine && <div className="text-[13px] text-sc-ink-400">{roleLine}</div>}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
