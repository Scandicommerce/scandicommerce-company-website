"use client";

import type { CalloutBlock, CalloutVariant } from "@/lib/blogBuilder";

interface CalloutProps {
  block: CalloutBlock;
}

const variantStyles: Record<
  CalloutVariant,
  { border: string; bg: string; title: string }
> = {
  info: {
    border: "border-l-4 border-l-blue-500",
    bg: "bg-blue-50",
    title: "text-blue-700",
  },
  warning: {
    border: "border-l-4 border-l-amber-500",
    bg: "bg-amber-50",
    title: "text-amber-800",
  },
  success: {
    border: "border-l-4 border-l-green-500",
    bg: "bg-green-50",
    title: "text-green-800",
  },
  tldr: {
    border: "border-l-4 border-l-cyan-400",
    bg: "bg-[#E8F8F8]",
    title: "text-cyan-600",
  },
};

export default function Callout({ block }: CalloutProps) {
  const content = block.content?.trim();
  if (!content) return null;

  const variant = (block.variant ?? "info") as CalloutVariant;
  const style = variantStyles[variant] ?? variantStyles.info;
  const title = block.title?.trim();

  return (
    <section className="my-8 md:my-10">
      <div
        className={`${style.border} ${style.bg} rounded-r p-6 md:p-8 border border-gray-200`}
      >
        {(title || variant === "tldr") && (
          <p className={`font-bold ${style.title} mb-2`}>
            {title || (variant === "tldr" ? "TL;DR:" : "Note")}
          </p>
        )}
        <div className="text-[#1F1D1D] leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </div>
    </section>
  );
}
