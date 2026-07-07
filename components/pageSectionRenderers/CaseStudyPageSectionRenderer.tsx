import CaseStudyIntroSection from "@/components/sections/caseStudy/CaseStudyIntroSection";
import CaseStudyContentSection from "@/components/sections/caseStudy/CaseStudyContentSection";
import CaseStudyTestimonialSection from "@/components/sections/caseStudy/CaseStudyTestimonialSection";
import CaseStudyStatsSection from "@/components/sections/caseStudy/CaseStudyStatsSection";
import CaseStudyRelatedSection from "@/components/sections/caseStudy/CaseStudyRelatedSection";
import CaseStudySidebar from "@/components/sections/caseStudy/CaseStudySidebar";
import CaseStudyCta from "@/components/sections/caseStudy/CaseStudyCta";
import CaseStudyRelatedCases, {
  type RelatedCaseStudy,
} from "@/components/sections/caseStudy/CaseStudyRelatedCases";

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
  tags?: (string | null)[] | null;
  ctaText?: string | null;
  relatedCaseStudies?: RelatedCaseStudy[] | null;
  language: string;
}

/** Centered 960px content column used for every in-flow block. */
function Column({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`mx-auto w-full max-w-[960px] px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function CaseStudyPageSectionRenderer({
  sections,
  industry,
  partner,
  previousPlatform,
  products,
  tags,
  ctaText,
  relatedCaseStudies,
  language,
}: CaseStudyPageSectionRendererProps) {
  const byType = (type: string) => sections.filter((s) => s._type === type);

  const statsSections = byType("caseStudyStatsSection");
  const contentSections = byType("caseStudyContentSection");
  const introSections = byType("caseStudyIntroSection");
  const testimonialSections = byType("caseStudyTestimonialSection");
  const brandSections = byType("caseStudyRelatedSection");

  const cleanTags = (tags ?? []).filter((t): t is string => Boolean(t));
  // Render tech chips inside the second content section (the "Løsningen"-like
  // section); fall back to a standalone block when there are fewer than two.
  const tagsSectionIndex = contentSections.length >= 2 ? 1 : -1;

  const hasMeta = !!(industry || partner || previousPlatform || products);
  const relatedCases = (relatedCaseStudies ?? []).filter((c) => c?.slug && c?.title);

  return (
    <div className="bg-white">
      {/* Nøkkeltall strip */}
      {statsSections.map((section) => (
        <Column key={section._key ?? section._type} className="pt-12">
          <CaseStudyStatsSection
            section={section as Parameters<typeof CaseStudyStatsSection>[0]["section"]}
          />
        </Column>
      ))}

      {/* Utfordringen / Løsningen / Resultater */}
      {contentSections.map((section, i) => (
        <Column key={section._key ?? `content-${i}`} className={i === 0 ? "pt-[72px]" : "pt-14"}>
          <CaseStudyContentSection
            section={section as Parameters<typeof CaseStudyContentSection>[0]["section"]}
            tags={i === tagsSectionIndex ? cleanTags : undefined}
          />
        </Column>
      ))}

      {/* Standalone tech chips when there is no second content section */}
      {tagsSectionIndex === -1 && cleanTags.length > 0 && (
        <Column className={contentSections.length > 0 ? "pt-8" : "pt-12"}>
          <div className="flex flex-wrap gap-2">
            {cleanTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-[6px] bg-sc-ink-100 px-3 py-1.5 text-[13px] font-medium text-sc-ink-900"
              >
                {tag}
              </span>
            ))}
          </div>
        </Column>
      )}

      {/* Intro / lede + metrics strip */}
      {introSections.map((section, i) => (
        <Column key={section._key ?? `intro-${i}`} className="pt-14">
          <CaseStudyIntroSection
            section={section as Parameters<typeof CaseStudyIntroSection>[0]["section"]}
          />
        </Column>
      ))}

      {/* Compact metadata list (industry / partner / previous platform / products) */}
      {hasMeta && (
        <Column className="pt-14">
          <CaseStudySidebar
            industry={industry}
            partner={partner}
            previousPlatform={previousPlatform}
            products={products}
          />
        </Column>
      )}

      {/* Kundesitat */}
      {testimonialSections.map((section, i) => (
        <Column key={section._key ?? `testimonial-${i}`} className="pt-[72px]">
          <CaseStudyTestimonialSection
            section={section as Parameters<typeof CaseStudyTestimonialSection>[0]["section"]}
          />
        </Column>
      ))}

      {/* Brand logos ("caseStudyRelatedSection") */}
      {brandSections.map((section, i) => (
        <Column key={section._key ?? `brands-${i}`} className="pt-16">
          <CaseStudyRelatedSection
            section={section as Parameters<typeof CaseStudyRelatedSection>[0]["section"]}
          />
        </Column>
      ))}

      {/* CTA — always rendered after the sections */}
      <CaseStudyCta ctaText={ctaText} />

      {/* Flere kundecaser — full-bleed band, hidden when empty */}
      {relatedCases.length > 0 && (
        <CaseStudyRelatedCases cases={relatedCases} pageLanguage={language} />
      )}
    </div>
  );
}
