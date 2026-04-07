"use client";

import CaseStudyIntroSection from "@/components/sections/caseStudy/CaseStudyIntroSection";
import CaseStudyContentSection from "@/components/sections/caseStudy/CaseStudyContentSection";
import CaseStudyTestimonialSection from "@/components/sections/caseStudy/CaseStudyTestimonialSection";
import CaseStudyStatsSection from "@/components/sections/caseStudy/CaseStudyStatsSection";
import CaseStudyRelatedSection from "@/components/sections/caseStudy/CaseStudyRelatedSection";

type Section = {
  _type: string;
  _key?: string;
  [key: string]: unknown;
};

interface CaseStudyPageSectionRendererProps {
  sections: Section[];
  industry?: string | null;
  partner?: string | null;
  previousPlatform?: string | null;
  products?: string | null;
}

const FULL_WIDTH_TYPES = ["caseStudyStatsSection", "caseStudyRelatedSection"];

export function CaseStudyPageSectionRenderer({
  sections,
  industry,
  partner,
  previousPlatform,
  products,
}: CaseStudyPageSectionRendererProps) {
  const hasSidebarData = !!(industry || partner || previousPlatform || products);

  const sidebarRows = [
    { label: "Industry", value: industry },
    { label: "Partner", value: partner },
    { label: "Previous Platform", value: previousPlatform },
    { label: "Products", value: products },
  ].filter((r): r is { label: string; value: string } => Boolean(r.value));

  const inlineSection = sections.filter((s) => !FULL_WIDTH_TYPES.includes(s._type));
  const fullWidthSections = sections.filter((s) => FULL_WIDTH_TYPES.includes(s._type));

  function renderSection(section: Section) {
    switch (section._type) {
      case "caseStudyIntroSection":
        return <CaseStudyIntroSection section={section as Parameters<typeof CaseStudyIntroSection>[0]["section"]} />;
      case "caseStudyContentSection":
        return <CaseStudyContentSection section={section as Parameters<typeof CaseStudyContentSection>[0]["section"]} />;
      case "caseStudyTestimonialSection":
        return <CaseStudyTestimonialSection section={section as Parameters<typeof CaseStudyTestimonialSection>[0]["section"]} />;
      case "caseStudyStatsSection":
        return <CaseStudyStatsSection section={section as Parameters<typeof CaseStudyStatsSection>[0]["section"]} />;
      case "caseStudyRelatedSection":
        return <CaseStudyRelatedSection section={section as Parameters<typeof CaseStudyRelatedSection>[0]["section"]} />;
      default:
        return null;
    }
  }

  return (
    <div className="bg-white">
      {/* Two-column layout: content + sidebar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className={`${hasSidebarData ? "lg:grid lg:grid-cols-[1fr_260px] lg:gap-12" : ""}`}>
          {/* Main content column */}
          <div>
            {inlineSection.map((section) => (
              <div key={section._key ?? section._type}>
                {renderSection(section)}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          {hasSidebarData && (
            <aside className="mt-10 lg:mt-0 border-t border-gray-200 pt-6 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-10">
              <div>
                {sidebarRows.map((row) => (
                  <div key={row.label} className="py-4 border-b border-gray-200 last:border-b-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#565454] mb-1">
                      {row.label}
                    </p>
                    <p className="text-base font-medium text-[#1F1D1D]">{row.value}</p>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Full-width sections (stats, related brands) */}
      {fullWidthSections.map((section) => (
        <div key={section._key ?? section._type}>
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
}
