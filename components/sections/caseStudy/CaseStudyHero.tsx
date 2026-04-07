"use client";

import Image from "next/image";

interface CaseStudyHeroProps {
  title: string;
  clientLogo?: { url: string; alt?: string } | null;
  heroImage?: { url: string; alt?: string; metadata?: { dimensions?: { width: number; height: number } } } | null;
}

export default function CaseStudyHero({ title, clientLogo, heroImage }: CaseStudyHeroProps) {
  return (
    <section className="bg-white">
      {/* Client logo + title */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        {clientLogo?.url && (
          <div className="mb-6">
            <Image
              src={clientLogo.url}
              alt={clientLogo.alt ?? "Client logo"}
              width={180}
              height={60}
              className="object-contain"
              style={{ height: 60, width: "auto" }}
            />
          </div>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F1D1D] leading-tight">
          {title}
        </h1>
      </div>

      {/* Hero image */}
      {heroImage?.url && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-0">
          <div className="relative w-full h-[320px] md:h-[460px] lg:h-[560px] overflow-hidden">
            <Image
              src={heroImage.url}
              alt={heroImage.alt ?? title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}
