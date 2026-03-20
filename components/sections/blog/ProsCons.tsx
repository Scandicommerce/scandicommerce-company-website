"use client";

import type { ProsConsBlock } from "@/lib/blogBuilder";

interface ProsConsProps {
  block: ProsConsBlock;
}

export default function ProsCons({ block }: ProsConsProps) {
  const cons = (block.cons ?? []).filter(
    (c): c is string => c != null && c !== ""
  );
  const pros = (block.pros ?? []).filter(
    (p): p is string => p != null && p !== ""
  );
  const consTitle = block.consTitle ?? "What to avoid";
  const prosTitle = block.prosTitle ?? "What to do";

  if (cons.length === 0 && pros.length === 0) return null;

  return (
    <section className="my-8 md:my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-black rounded overflow-hidden">
          <div className="bg-red-600 text-white px-4 py-3 font-bold uppercase text-sm">
            {consTitle}
          </div>
          <ul className="p-6 bg-white space-y-2">
            {cons.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[#1F1D1D]">
                <span className="text-red-600 shrink-0">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-black rounded overflow-hidden">
          <div className="bg-green-600 text-white px-4 py-3 font-bold uppercase text-sm">
            {prosTitle}
          </div>
          <ul className="p-6 bg-white space-y-2">
            {pros.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[#1F1D1D]">
                <span className="text-green-600 shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
