"use client";

import Link from "next/link";
import { PortableText } from "@/sanity";
import type { CtaBlock } from "@/lib/blogBuilder";

interface CTAProps {
  block: CtaBlock;
}

export default function CTA({ block }: CTAProps) {
  const heading = block.heading?.trim();
  const body = block.body;
  const hasBody = Array.isArray(body) && body.length > 0;
  const buttonsFromSchema = (block.buttons ?? [])
    .filter((b) => b?.label?.trim() && b?.url?.trim())
    .map((b) => ({
      label: b!.label!.trim(),
      url: b!.url!.trim(),
      variant: b?.variant ?? "primary",
    }));

  const legacyButton =
    block.buttonLabel?.trim() && block.buttonUrl?.trim()
      ? [{ label: block.buttonLabel.trim(), url: block.buttonUrl.trim(), variant: "primary" as const }]
      : [];
  const buttons = buttonsFromSchema.length > 0 ? buttonsFromSchema : legacyButton;

  if (!heading && buttons.length === 0) return null;

  return (
    <section className="my-10 md:my-14">
      <div className="bg-black text-white rounded-lg overflow-hidden text-center">
        <div
          className="w-full flex-shrink-0"
          style={{ height: "4px", background: "linear-gradient(to right, #03C1CA, #8B5CF6)" }}
        />
        <div className="p-8 md:p-12">
        {heading && (
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{heading}</h2>
        )}
        {hasBody && (
          <div className="text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed prose prose-invert prose-p:text-gray-300 prose-li:text-gray-300 prose-p:my-3">
            <PortableText value={body} />
          </div>
        )}
        {buttons.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            {buttons.map((button, idx) => (
              <Link
                key={`${button.label}-${idx}`}
                href={button.url}
                className={
                  button.variant === "secondary"
                    ? "inline-block px-8 py-4 rounded-lg font-semibold text-white border border-white/40 hover:bg-white/10 transition-colors"
                    : "inline-block px-8 py-4 rounded-lg font-semibold text-[#1F1D1D] bg-gradient-to-r from-[#03C1CA] to-purple-500 hover:opacity-90 transition-opacity"
                }
              >
                {button.label}
              </Link>
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
