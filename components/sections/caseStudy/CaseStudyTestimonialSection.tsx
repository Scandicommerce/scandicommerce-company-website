"use client";

interface CaseStudyTestimonialSectionProps {
  section: {
    quote?: string | null;
    company?: string | null;
    authorName?: string | null;
    authorRole?: string | null;
  };
}

export default function CaseStudyTestimonialSection({ section }: CaseStudyTestimonialSectionProps) {
  if (!section.quote) return null;

  return (
    <blockquote className="my-8 border-l-4 border-[#1F1D1D] pl-6">
      <p className="text-lg md:text-xl font-medium text-[#1F1D1D] leading-relaxed mb-5 italic">
        &ldquo;{section.quote}&rdquo;
      </p>
      {(section.company || section.authorName) && (
        <footer>
          {section.company && (
            <p className="text-sm font-semibold text-[#1F1D1D] mb-0.5">{section.company}</p>
          )}
          {(section.authorName || section.authorRole) && (
            <p className="text-sm text-[#565454]">
              {section.authorName}
              {section.authorName && section.authorRole && " — "}
              {section.authorRole}
            </p>
          )}
        </footer>
      )}
    </blockquote>
  );
}
