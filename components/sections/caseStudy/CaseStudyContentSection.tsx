"use client";

import { PortableText } from "@/sanity";

interface Bullet {
  lead?: string | null;
  text?: string | null;
}

interface CaseStudyContentSectionProps {
  section: {
    heading?: string | null;
    body?: unknown[] | null;
    bullets?: Bullet[] | null;
  };
}

export default function CaseStudyContentSection({ section }: CaseStudyContentSectionProps) {
  return (
    <div className="mb-10">
      {section.heading && (
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1F1D1D] leading-tight mb-5">
          {section.heading}
        </h2>
      )}

      {section.body && Array.isArray(section.body) && section.body.length > 0 && (
        <div className="prose prose-base max-w-none text-[#1F1D1D] leading-relaxed mb-6 [&_p]:mb-4 [&_a]:text-[#1F1D1D] [&_a]:underline [&_a]:underline-offset-2">
          <PortableText value={section.body} />
        </div>
      )}

      {section.bullets && section.bullets.length > 0 && (
        <ul className="space-y-5 mt-5">
          {section.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-4">
              <svg
                className="mt-1 flex-shrink-0 w-5 h-5 text-[#03C1CA]"
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
              <span className="text-base leading-relaxed text-[#1F1D1D]">
                {bullet.lead && (
                  <strong className="font-semibold">{bullet.lead}:</strong>
                )}{" "}
                {bullet.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
