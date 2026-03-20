"use client";

import type { DividerBlock as DividerBlockType } from "@/lib/blogBuilder";

interface DividerBlockProps {
  block?: DividerBlockType;
}

const spacingClass = {
  small: "my-4 md:my-6",
  medium: "my-8 md:my-10",
  large: "my-12 md:my-16",
};

export default function DividerBlock({ block }: DividerBlockProps) {
  const spacing = block?.spacing ?? "medium";
  const className = spacingClass[spacing] ?? spacingClass.medium;
  return <div className={`${className} h-4`} aria-hidden />;
}
