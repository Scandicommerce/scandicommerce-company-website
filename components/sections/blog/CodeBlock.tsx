"use client";

import type { CodeBlock as CodeBlockType } from "@/lib/blogBuilder";

interface CodeBlockProps {
  block: CodeBlockType;
}

export default function CodeBlock({ block }: CodeBlockProps) {
  const code = block.code?.trim();
  if (!code) return null;

  const language = block.language ?? "text";

  return (
    <section className="my-8 md:my-10">
      <pre className="overflow-x-auto rounded-lg bg-[#1F1D1D] p-4 md:p-6 text-sm text-gray-100 font-mono">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </section>
  );
}
