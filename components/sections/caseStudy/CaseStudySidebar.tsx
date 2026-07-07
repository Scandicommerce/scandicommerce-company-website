interface CaseStudySidebarProps {
  industry?: string | null;
  partner?: string | null;
  previousPlatform?: string | null;
  products?: string | null;
}

/**
 * Compact metadata definition list (2026 design) — rendered after the
 * content sections instead of the old right-hand sidebar.
 */
export default function CaseStudySidebar({
  industry,
  partner,
  previousPlatform,
  products,
}: CaseStudySidebarProps) {
  const rows = [
    { label: "Bransje", value: industry },
    { label: "Partner", value: partner },
    { label: "Tidligere plattform", value: previousPlatform },
    { label: "Produkter", value: products },
  ].filter((r): r is { label: string; value: string } => Boolean(r.value));

  if (rows.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-sc-ink-100 pt-6 md:grid-cols-4">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sc-ink-400">
            {row.label}
          </dt>
          <dd className="m-0 text-sm font-semibold text-sc-ink-900">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
