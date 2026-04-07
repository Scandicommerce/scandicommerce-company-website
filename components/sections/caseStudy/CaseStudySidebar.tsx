"use client";

interface CaseStudySidebarProps {
  industry?: string | null;
  partner?: string | null;
  previousPlatform?: string | null;
  products?: string | null;
}

interface SidebarRowProps {
  label: string;
  value: string;
}

function SidebarRow({ label, value }: SidebarRowProps) {
  return (
    <div className="py-4 border-t border-gray-200 first:border-t-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#565454] mb-1">
        {label}
      </p>
      <p className="text-base font-medium text-[#1F1D1D]">{value}</p>
    </div>
  );
}

export default function CaseStudySidebar({
  industry,
  partner,
  previousPlatform,
  products,
}: CaseStudySidebarProps) {
  const rows = [
    { label: "Industry", value: industry },
    { label: "Partner", value: partner },
    { label: "Previous Platform", value: previousPlatform },
    { label: "Products", value: products },
  ].filter((r): r is { label: string; value: string } => Boolean(r.value));

  if (rows.length === 0) return null;

  return (
    <aside className="bg-white border-t border-gray-200 lg:border-t-0 lg:pl-10 lg:pt-4">
      <div className="divide-y divide-gray-200">
        {rows.map((row) => (
          <SidebarRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>
    </aside>
  );
}
