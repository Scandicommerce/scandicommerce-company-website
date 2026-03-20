"use client";

import { PortableText } from "@/sanity";
import type { KeyTakeawaysBlock } from "@/lib/blogBuilder";

function parseColor(value: string | null | undefined): string | undefined {
  if (!value || typeof value !== "string") return undefined;
  const v = value.trim();
  return v || undefined;
}

interface KeyTakeawaysProps {
  block: KeyTakeawaysBlock;
}

export default function KeyTakeaways({ block }: KeyTakeawaysProps) {
  const content = block.content;
  const hasContent = Array.isArray(content) && content.length > 0;
  if (!hasContent) return null;

  const bg = parseColor(block.backgroundColor) ?? "#F8FAFA";
  const border = parseColor(block.borderColor) ?? "#E5E7EB";
  const topColor = parseColor(block.topBorderColor) ?? "#03C1CA";
  const topColorEnd = parseColor(block.topBorderColorEnd);

  const topBorderStyle =
    topColorEnd
      ? { background: `linear-gradient(to right, ${topColor}, ${topColorEnd})` }
      : { backgroundColor: topColor };

  return (
    <section className="my-8 md:my-10">
      <div
        className="rounded-b overflow-hidden border border-t-0"
        style={{
          backgroundColor: bg,
          borderColor: border,
        }}
      >
        <div
          className="w-full"
          style={{ ...topBorderStyle, height: "5px" }}
        />
        <div className="p-6 md:p-8 text-[#1F1D1D] prose prose-slate max-w-none">
          <PortableText value={content} className="leading-relaxed" />
        </div>
      </div>
    </section>
  );
}
