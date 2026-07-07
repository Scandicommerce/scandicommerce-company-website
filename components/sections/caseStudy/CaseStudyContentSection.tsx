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
  /** Tech chips rendered after the body (document-level tags[]) */
  tags?: (string | null)[] | null;
}

export default function CaseStudyContentSection({ section, tags }: CaseStudyContentSectionProps) {
  const chips = (tags ?? []).filter((t): t is string => Boolean(t));
  const bullets = (section.bullets ?? []).filter((b) => b.lead || b.text);
  const hasBody = Array.isArray(section.body) && section.body.length > 0;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
      {section.heading && (
        <h2 className="m-0 text-2xl font-bold leading-snug tracking-[-0.02em] text-sc-ink-900">
          {section.heading}
        </h2>
      )}

      <div className={section.heading ? "" : "md:col-start-2"}>
        {hasBody && (
          <div className="text-[17px] leading-relaxed text-sc-ink-600 [&_p]:mb-5 [&_p:last-child]:mb-0 [&_a]:text-sc-cyan-600 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-sc-ink-900">
            <PortableText value={section.body as unknown[]} />
          </div>
        )}

        {bullets.length > 0 && (
          <ul className={`space-y-4 ${hasBody ? "mt-6" : ""}`}>
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-sc-cyan-500"
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
                <span className="text-base leading-relaxed text-sc-ink-600">
                  {bullet.lead && <strong className="font-semibold text-sc-ink-900">{bullet.lead}:</strong>}{" "}
                  {bullet.text}
                </span>
              </li>
            ))}
          </ul>
        )}

        {chips.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-[6px] bg-sc-ink-100 px-3 py-1.5 text-[13px] font-medium text-sc-ink-900"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
