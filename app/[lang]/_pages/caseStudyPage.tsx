import HeaderWrapper from "@/components/layout/HeaderWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";
import CaseStudyHero from "@/components/sections/caseStudy/CaseStudyHero";
import { CaseStudyPageSectionRenderer } from "@/components/pageSectionRenderers/CaseStudyPageSectionRenderer";
import { getCaseStudyBySlugCached } from "@/lib/sanity/cachedDocuments";
import { getLanguageFromParams } from "@/lib/language";
import { notFound } from "next/navigation";

interface SanityCaseStudy {
  _id?: string | null;
  _type?: string | null;
  language?: string | null;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  metaDescription?: string | null;
  publishedAt?: string | null;
  tags?: (string | null)[] | null;
  heroImage?: {
    asset?: { _id?: string; url?: string; metadata?: { dimensions?: { width: number; height: number } } } | null;
    alt?: string | null;
  } | null;
  clientLogo?: {
    asset?: { _id?: string; url?: string } | null;
    alt?: string | null;
  } | null;
  industry?: string | null;
  partner?: string | null;
  previousPlatform?: string | null;
  products?: string | null;
  sections?: Array<{ _type: string; _key?: string; [key: string]: unknown }> | null;
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ lang: string; slug?: string }>;
}) {
  const { lang, slug } = await params;
  if (!slug) notFound();
  const language = getLanguageFromParams({ lang });

  const lastSegment = slug.split("/").pop() ?? slug;
  const data = (await getCaseStudyBySlugCached(lastSegment, language)) as SanityCaseStudy | null;
  if (!data || !data.title) notFound();

  const heroImage = data.heroImage?.asset?.url
    ? {
        url: data.heroImage.asset.url,
        alt: data.heroImage.alt ?? data.title ?? undefined,
        metadata: data.heroImage.asset.metadata,
      }
    : null;

  const clientLogo = data.clientLogo?.asset?.url
    ? {
        url: data.clientLogo.asset.url,
        alt: data.clientLogo.alt ?? undefined,
      }
    : null;

  const sections = (data.sections ?? []) as Array<{ _type: string; _key?: string; [key: string]: unknown }>;

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-grow bg-white">
        <CaseStudyHero
          title={data.title}
          clientLogo={clientLogo}
          heroImage={heroImage}
        />
        <CaseStudyPageSectionRenderer
          sections={sections}
          industry={data.industry}
          partner={data.partner}
          previousPlatform={data.previousPlatform}
          products={data.products}
        />
      </main>
      <FooterWrapper />
    </div>
  );
}
