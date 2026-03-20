"use client";

import { PortableText } from "@/sanity";
import type { RichTextBlock as RichTextBlockType } from "@/lib/blogBuilder";

interface RichTextBlockProps {
  block: RichTextBlockType;
}

export default function RichTextBlock({ block }: RichTextBlockProps) {
  const body = block.body;
  if (!body || !Array.isArray(body) || body.length === 0) return null;

  return (
    <section className="my-6 md:my-8 prose prose-slate max-w-none">
      <PortableText value={body} className="text-[#1F1D1D] leading-relaxed" />
    </section>
  );
}
