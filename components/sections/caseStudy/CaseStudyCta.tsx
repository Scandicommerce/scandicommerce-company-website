import Link from "next/link";

interface CaseStudyCtaProps {
  ctaText?: string | null;
}

export default function CaseStudyCta({ ctaText }: CaseStudyCtaProps) {
  return (
    <div className="mx-auto w-full max-w-[960px] px-4 sm:px-6 lg:px-8 py-[88px] text-center">
      <h2 className="mb-6 text-[32px] font-bold leading-snug tracking-[-0.02em] text-sc-ink-900 md:text-[40px]">
        {ctaText || "Vil du ha samme resultat?"}
      </h2>
      <Link
        href="/kontakt"
        className="inline-flex items-center justify-center rounded-lg bg-sc-cyan-500 px-8 py-4 text-[15px] font-semibold tracking-[0.02em] text-white transition-colors hover:bg-sc-cyan-600"
      >
        Bestill avklaringssamtale
      </Link>
    </div>
  );
}
