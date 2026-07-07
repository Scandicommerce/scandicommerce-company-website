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

  const cols =
    stats.length === 1
      ? "sm:grid-cols-1"
      : stats.length === 2
      ? "sm:grid-cols-2"
      : "sm:grid-cols-3";

  return (
    <div>
      {section.headline && (
        <h2 className="mb-6 text-2xl font-bold tracking-[-0.02em] text-sc-ink-900">
          {section.headline}
        </h2>
      )}

      {stats.length > 0 && (
        <div
          className={`grid grid-cols-1 ${cols} overflow-hidden rounded-[10px] border border-sc-ink-100 divide-y divide-sc-ink-100 sm:divide-y-0 sm:divide-x`}
        >
          {stats.map((stat, i) => (
            <div key={i} className="px-7 py-8">
              <div className="text-[40px] font-extrabold leading-none tracking-[-0.03em] text-sc-cyan-500 md:text-[48px]">
                {stat.value}
              </div>
              {stat.label && (
                <div className="mt-2.5 text-sm font-semibold text-sc-ink-600">{stat.label}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
