import Link from "next/link";
import { contactHref } from "@/lib/routes";

interface CaseStudyCtaProps {
  ctaText?: string | null;
  language?: string;
}

const BUTTON: Record<string, string> = {
  no: "Bestill avklaringssamtale",
  en: "Book a discovery call",
  sv: "Boka ett samtal",
  da: "Book en samtale",
  de: "Gespräch buchen",
};
const HEADING: Record<string, string> = {
  no: "Vil du ha samme resultat?",
  en: "Want the same results?",
  sv: "Vill du ha samma resultat?",
  da: "Vil du have samme resultat?",
  de: "Wollen Sie dieselben Ergebnisse?",
};

export default function CaseStudyCta({ ctaText, language = "no" }: CaseStudyCtaProps) {
  return (
    <div className="mx-auto w-full max-w-[960px] px-4 sm:px-6 lg:px-8 py-[88px] text-center">
      <h2 className="mb-6 text-[32px] font-bold leading-snug tracking-[-0.02em] text-sc-ink-900 md:text-[40px]">
        {ctaText || HEADING[language] || HEADING.en}
      </h2>
      <Link
        href={contactHref(language)}
        className="inline-flex items-center justify-center rounded-lg bg-sc-cyan-500 px-8 py-4 text-[15px] font-semibold tracking-[0.02em] text-white transition-colors hover:bg-sc-cyan-600"
      >
        {BUTTON[language] || BUTTON.en}
      </Link>
    </div>
  );
}
