import Image from "next/image";
import Link from "next/link";

interface CaseStudyHeroProps {
  title: string;
  clientLogo?: { url: string; alt?: string } | null;
  heroImage?: { url: string; alt?: string; metadata?: { dimensions?: { width: number; height: number } } } | null;
  industry?: string | null;
  pakke?: string | null;
  /** Last breadcrumb segment — partner name or short title */
  breadcrumbLeaf?: string | null;
}

export default function CaseStudyHero({
  title,
  clientLogo,
  heroImage,
  industry,
  pakke,
  breadcrumbLeaf,
}: CaseStudyHeroProps) {
  return (
    <section className="bg-white">
      {/* Breadcrumb */}
      <div className="mx-auto w-full max-w-[960px] px-4 sm:px-6 lg:px-8 pt-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[13px] text-sc-ink-400">
          <Link href="/kundecaser" className="text-sc-ink-600 hover:text-sc-ink-900 transition-colors">
            Kundecaser
          </Link>
          {industry && (
            <>
              <span aria-hidden="true">/</span>
              <Link href="/kundecaser" className="text-sc-ink-600 hover:text-sc-ink-900 transition-colors">
                {industry}
              </Link>
            </>
          )}
          {breadcrumbLeaf && (
            <>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-sc-ink-900">{breadcrumbLeaf}</span>
            </>
          )}
        </nav>
      </div>

      {/* Hero image + chips + title */}
      <div className="mx-auto w-full max-w-[960px] px-4 sm:px-6 lg:px-8 pt-7">
        {heroImage?.url && (
          <div className="relative mb-7 h-[240px] w-full overflow-hidden rounded-[10px] md:h-[440px]">
            <Image
              src={heroImage.url}
              alt={heroImage.alt ?? title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 960px"
              priority
            />
          </div>
        )}

        {(industry || pakke || clientLogo?.url) && (
          <div className="mb-[18px] flex items-center gap-2">
            {industry && (
              <span className="inline-flex items-center rounded-[6px] bg-sc-cyan-50 px-3 py-1.5 text-xs font-semibold text-sc-cyan-700">
                {industry}
              </span>
            )}
            {pakke && (
              <span className="inline-flex items-center rounded-[6px] bg-sc-ink-100 px-3 py-1.5 text-xs font-semibold capitalize text-sc-ink-900">
                {pakke}
              </span>
            )}
            {clientLogo?.url && (
              <Image
                src={clientLogo.url}
                alt={clientLogo.alt ?? "Client logo"}
                width={120}
                height={32}
                className="ml-auto object-contain"
                style={{ height: 32, width: "auto" }}
              />
            )}
          </div>
        )}

        <h1 className="m-0 text-[32px] font-bold leading-[1.06] tracking-[-0.025em] text-sc-ink-900 text-balance md:text-[52px]">
          {title}
        </h1>
      </div>
    </section>
  );
}
