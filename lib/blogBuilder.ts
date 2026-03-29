/**
 * Types for the blog page builder (post document + content blocks).
 * All blocks are optional at runtime; components should guard against missing data.
 */

export interface Post {
  _id: string;
  _type: "post";
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  _updatedAt?: string | null;
  language?: string | null;
  /** Featured / card image URL from Sanity */
  image?: string | null;
  tags?: Array<{ label?: string | null; isPrimary?: boolean | null }> | null;
  content?: PostBlock[] | null;
}

export type PostBlock =
  | RichTextBlock
  | KeyTakeawaysBlock
  | StatsRowBlock
  | TableBlock
  | ComparisonCardsBlock
  | CalloutBlock
  | ProsConsBlock
  | CodeBlock
  | FaqBlock
  | CtaBlock
  | GradientTitleBlock
  | ImageBlock
  | DividerBlock;

export interface RichTextBlock {
  _type: "richTextBlock";
  _key: string;
  body?: unknown; // PortableTextBlock[]
}

export interface KeyTakeawaysBlock {
  _type: "keyTakeawaysBlock";
  _key: string;
  content?: unknown; // PortableTextBlock[]
  backgroundColor?: string | null;
  borderColor?: string | null;
  topBorderColor?: string | null;
  topBorderColorEnd?: string | null;
}

export interface StatItem {
  value?: string | null;
  label?: string | null;
}

export interface StatsRowBlock {
  _type: "statsRowBlock";
  _key: string;
  stats?: StatItem[] | null;
}

export interface TableRow {
  cells?: (string | null)[] | null;
}

export interface TableBlock {
  _type: "tableBlock";
  _key: string;
  title?: string | null;
  columns?: (string | null)[] | null;
  rows?: TableRow[] | null;
}

export interface ComparisonCard {
  title?: string | null;
  body?: unknown; // PortableTextBlock[]
}

export interface ComparisonCardsBlock {
  _type: "comparisonCardsBlock";
  _key: string;
  leftCard?: ComparisonCard | null;
  rightCard?: ComparisonCard | null;
}

export type CalloutVariant = "info" | "warning" | "success" | "tldr";

export interface CalloutBlock {
  _type: "calloutBlock";
  _key: string;
  variant?: CalloutVariant | null;
  title?: string | null;
  content?: string | null;
}

export interface ProsConsBlock {
  _type: "prosConsBlock";
  _key: string;
  consTitle?: string | null;
  cons?: (string | null)[] | null;
  prosTitle?: string | null;
  pros?: (string | null)[] | null;
}

export interface CodeBlock {
  _type: "codeBlock";
  _key: string;
  language?: string | null;
  code?: string | null;
}

export interface FaqItem {
  question?: string | null;
  answer?: string | null;
}

export interface FaqBlock {
  _type: "faqBlock";
  _key: string;
  title?: string | null;
  items?: FaqItem[] | null;
}

export interface CtaBlock {
  _type: "ctaBlock";
  _key: string;
  heading?: string | null;
  body?: unknown; // PortableTextBlock[]
  buttons?: Array<{
    label?: string | null;
    url?: string | null;
    variant?: "primary" | "secondary" | null;
  }> | null;
  // Legacy support for existing docs
  buttonLabel?: string | null;
  buttonUrl?: string | null;
}

export interface GradientTitleBlock {
  _type: "gradientTitleBlock";
  _key: string;
  title?: string | null;
  highlightPrefix?: string | null;
}

export interface ImageAsset {
  _id?: string;
  url?: string;
  metadata?: { dimensions?: unknown; lqip?: string };
}

export interface ImageBlock {
  _type: "imageBlock";
  _key: string;
  image?: { asset?: ImageAsset; alt?: string } | null;
  alt?: string | null;
  caption?: string | null;
}

export interface DividerBlock {
  _type: "dividerBlock";
  _key: string;
  spacing?: "small" | "medium" | "large" | null;
}

export function isPostBlock(block: unknown): block is PostBlock {
  return (
    typeof block === "object" &&
    block !== null &&
    "_type" in block &&
    typeof (block as { _type?: string })._type === "string"
  );
}

export function getBlockKey(block: PostBlock): string {
  return "_key" in block && typeof (block as { _key?: string })._key === "string"
    ? (block as { _key: string })._key
    : String(Math.random());
}
