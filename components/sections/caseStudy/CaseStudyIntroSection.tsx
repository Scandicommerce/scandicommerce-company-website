import { PortableText } from "@/sanity";

interface CaseStudyIntroSectionProps {
  section: {
    text?: unknown[] | null;
    metrics?: Array<{ text?: string | null }> | null;
  };
}

export default function CaseStudyIntroSection({ section }: CaseStudyIntroSectionProps) {
  const metrics = (section.metrics ?? []).filter((m) => m.text);
  const hasText = Array.isArray(section.text) && section.text.length > 0;
  if (!hasText && metrics.length === 0) return null;

  return (
    <div>
      {hasText && (
        <div className="text-[17px] leading-[1.7] text-sc-ink-600 [&_p]:mb-5 [&_p:last-child]:mb-0 [&_a]:text-sc-cyan-600 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-sc-ink-900">
          <PortableText value={section.text as unknown[]} />
        </div>
      )}

      {metrics.length > 0 && (
        <ul className={`flex flex-wrap gap-x-8 gap-y-3 ${hasText ? "mt-6" : ""}`}>
          {metrics.map((metric, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-sc-cyan-500"
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
              <span className="text-sm font-semibold leading-relaxed text-sc-ink-700">{metric.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
