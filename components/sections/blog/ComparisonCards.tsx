"use client";

import { PortableText } from "@/sanity";
import type { ComparisonCardsBlock } from "@/lib/blogBuilder";

interface ComparisonCardsProps {
  block: ComparisonCardsBlock;
}

function Card({
  title,
  body,
  headerClass,
}: {
  title: string;
  body?: unknown;
  headerClass: string;
}) {
  const hasBody = Array.isArray(body) && body.length > 0;
  return (
    <div className="border border-black rounded overflow-hidden flex flex-col">
      <div className={`${headerClass} px-4 py-3 text-white font-bold uppercase text-sm`}>
        {title}
      </div>
      <div className="p-6 bg-white flex-1 text-[#1F1D1D] prose prose-slate max-w-none prose-p:my-3 prose-ul:my-3 prose-li:my-1">
        {hasBody ? <PortableText value={body} /> : null}
      </div>
    </div>
  );
}

export default function ComparisonCards({ block }: ComparisonCardsProps) {
  const left = block.leftCard;
  const right = block.rightCard;
  if (!left && !right) return null;

  return (
    <section className="my-8 md:my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {left && (
          <Card
            title={left.title ?? "Left"}
            body={left.body}
            headerClass="bg-red-600"
          />
        )}
        {right && (
          <Card
            title={right.title ?? "Right"}
            body={right.body}
            headerClass="bg-green-600"
          />
        )}
      </div>
    </section>
  );
}
