"use client";

import type { GradientTitleBlock } from "@/lib/blogBuilder";

interface GradientTitleProps {
  block: GradientTitleBlock;
}

const GRADIENT_STYLE = {
  background: "linear-gradient(to right, #03C1CA, #8B5CF6)",
};

export default function GradientTitle({ block }: GradientTitleProps) {
  const title = block.title?.trim();
  const highlightPrefix = block.highlightPrefix?.trim();

  if (!title) return null;

  const prefixMatch =
    highlightPrefix &&
    title.toLowerCase().startsWith(highlightPrefix.toLowerCase());
  const prefix = prefixMatch ? highlightPrefix! : null;
  const rest = prefixMatch ? title.slice(prefix!.length).trimStart() : null;

  return (
    <section className="my-8 md:my-10">
      <div className="text-left">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-black uppercase tracking-tight">
          {prefix != null ? (
            <>
              <span className="inline-block">
                {prefix}
                <span
                  className="block w-16 h-1 mt-2 rounded-full"
                  style={GRADIENT_STYLE}
                />
              </span>
              {rest ? <span className="block mt-2">{rest}</span> : null}
            </>
          ) : (
            <>
              {title}
              <span
                className="block w-16 h-1 mt-2 rounded-full"
                style={GRADIENT_STYLE}
              />
            </>
          )}
        </h2>
      </div>
    </section>
  );
}
