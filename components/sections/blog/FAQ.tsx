"use client";

import { useState } from "react";
import type { FaqBlock } from "@/lib/blogBuilder";

interface FAQProps {
  block: FaqBlock;
}

export default function FAQ({ block }: FAQProps) {
  const items = (block.items ?? []).filter(
    (i) => i && (i.question != null || i.answer != null)
  );
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <section className="my-8 md:my-10">
      {block.title && (
        <h2 className="text-2xl font-bold text-[#1F1D1D] mb-6">
          {block.title}
        </h2>
      )}
      <div className="space-y-2">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="border border-black rounded overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 bg-black text-white px-4 py-4 text-left font-medium"
              >
                <span>{item.question ?? "Question"}</span>
                <span className="text-xl shrink-0">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="p-4 bg-white text-[#1F1D1D] leading-relaxed whitespace-pre-line">
                  {item.answer ?? ""}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
