"use client";

interface Stat {
  value?: string | null;
  label?: string | null;
}

interface CaseStudyStatsSectionProps {
  section: {
    headline?: string | null;
    stats?: Stat[] | null;
  };
}

export default function CaseStudyStatsSection({ section }: CaseStudyStatsSectionProps) {
  const stats = (section.stats ?? []).filter((s) => s.value || s.label);
  if (stats.length === 0 && !section.headline) return null;

  return (
    <section className="bg-white py-14 md:py-20 border-t border-gray-100 mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {section.headline && (
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F1D1D] text-center mb-10">
            {section.headline}
          </h2>
        )}

        {stats.length > 0 && (
          <div
            className={`grid gap-8 text-center ${
              stats.length === 1
                ? "grid-cols-1 max-w-xs mx-auto"
                : stats.length === 2
                ? "grid-cols-2 max-w-lg mx-auto"
                : "grid-cols-1 sm:grid-cols-3"
            }`}
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1F1D1D] leading-none tracking-tight">
                  {stat.value}
                </span>
                {stat.label && (
                  <span className="mt-2 text-sm md:text-base text-[#565454]">
                    {stat.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
