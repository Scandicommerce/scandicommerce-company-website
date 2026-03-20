"use client";

import type { PostBlock } from "@/lib/blogBuilder";
import { getBlockKey, isPostBlock } from "@/lib/blogBuilder";
import KeyTakeaways from "./KeyTakeaways";
import StatsRow from "./StatsRow";
import TableBlock from "./TableBlock";
import ComparisonCards from "./ComparisonCards";
import Callout from "./Callout";
import ProsCons from "./ProsCons";
import CodeBlock from "./CodeBlock";
import FAQ from "./FAQ";
import CTA from "./CTA";
import GradientTitle from "./GradientTitle";
import ImageBlock from "./ImageBlock";
import DividerBlock from "./DividerBlock";
import RichTextBlock from "./RichTextBlock";

interface BlogContentProps {
  content: PostBlock[] | null | undefined;
}

export default function BlogContent({ content }: BlogContentProps) {
  const blocks = Array.isArray(content) ? content : [];
  if (blocks.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {blocks.map((block) => {
        if (!isPostBlock(block)) return null;
        const key = getBlockKey(block);

        switch (block._type) {
          case "richTextBlock":
            return <RichTextBlock key={key} block={block} />;
          case "keyTakeawaysBlock":
            return <KeyTakeaways key={key} block={block} />;
          case "statsRowBlock":
            return <StatsRow key={key} block={block} />;
          case "tableBlock":
            return <TableBlock key={key} block={block} />;
          case "comparisonCardsBlock":
            return <ComparisonCards key={key} block={block} />;
          case "calloutBlock":
            return <Callout key={key} block={block} />;
          case "prosConsBlock":
            return <ProsCons key={key} block={block} />;
          case "codeBlock":
            return <CodeBlock key={key} block={block} />;
          case "faqBlock":
            return <FAQ key={key} block={block} />;
          case "ctaBlock":
            return <CTA key={key} block={block} />;
          case "gradientTitleBlock":
            return <GradientTitle key={key} block={block} />;
          case "imageBlock":
            return <ImageBlock key={key} block={block} />;
          case "dividerBlock":
            return <DividerBlock key={key} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
