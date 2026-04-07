"use client";

import { PortableText } from "@/sanity";

interface CaseStudyIntroSectionProps {
  section: {
    text?: unknown[] | null;
    metrics?: Array<{ text?: string | null }> | null;
  };
}

export default function CaseStudyIntroSection({ section }: CaseStudyIntroSectionProps) {
  return (
    <div className="mb-8">
      {section.text && Array.isArray(section.text) && section.text.length > 0 && (
        <div className="prose prose-base max-w-none text-[#1F1D1D] leading-relaxed mb-6 [&_p]:mb-4 [&_a]:text-[#1F1D1D] [&_a]:underline [&_a]:underline-offset-2">
          <PortableText value={section.text} />
        </div>
      )}

      {section.metrics && section.metrics.length > 0 && (
        <ul className="space-y-3 mt-4">
          {section.metrics.map((metric, i) => (
            <li key={i} className="flex items-start gap-3 text-[#1F1D1D]">
              <svg
                className="mt-0.5 flex-shrink-0 w-5 h-5 text-[#03C1CA]"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base leading-relaxed">{metric.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
