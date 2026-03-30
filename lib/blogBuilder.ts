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
  /** SEO meta description; coalesced from Sanity `seo.metaDescription` or excerpt in GROQ */
  metaDescription?: string | null;
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

function portableTextBlocksToPlain(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  const out: string[] = [];
  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;
    const b = block as { _type?: string; children?: unknown[] };
    if (b._type === "block" && Array.isArray(b.children)) {
      for (const c of b.children) {
        if (c && typeof c === "object" && "text" in c) {
          const t = (c as { text?: string }).text;
          if (t) out.push(t);
        }
      }
    }
  }
  return out.join(" ");
}

function textFromPostBlock(block: PostBlock): string {
  switch (block._type) {
    case "richTextBlock":
      return portableTextBlocksToPlain(block.body);
    case "keyTakeawaysBlock":
      return portableTextBlocksToPlain(block.content);
    case "comparisonCardsBlock": {
      const parts: string[] = [];
      if (block.leftCard?.title) parts.push(block.leftCard.title);
      parts.push(portableTextBlocksToPlain(block.leftCard?.body));
      if (block.rightCard?.title) parts.push(block.rightCard.title);
      parts.push(portableTextBlocksToPlain(block.rightCard?.body));
      return parts.join(" ");
    }
    case "ctaBlock": {
      const parts: string[] = [];
      if (block.heading) parts.push(block.heading);
      parts.push(portableTextBlocksToPlain(block.body));
      for (const btn of block.buttons ?? []) {
        if (btn?.label) parts.push(btn.label);
      }
      if (block.buttonLabel) parts.push(block.buttonLabel);
      return parts.join(" ");
    }
    case "calloutBlock":
      return [block.title, block.content].filter(Boolean).join(" ");
    case "statsRowBlock":
      return (block.stats ?? [])
        .map((s) => [s?.value, s?.label].filter(Boolean).join(" "))
        .join(" ");
    case "tableBlock": {
      const parts: string[] = [];
      if (block.title) parts.push(block.title);
      if (block.columns) parts.push(block.columns.filter(Boolean).join(" "));
      for (const row of block.rows ?? []) {
        parts.push((row.cells ?? []).filter(Boolean).join(" "));
      }
      return parts.join(" ");
    }
    case "prosConsBlock":
      return [
        block.consTitle,
        block.prosTitle,
        ...(block.cons ?? []).filter(Boolean),
        ...(block.pros ?? []).filter(Boolean),
      ]
        .filter(Boolean)
        .join(" ");
    case "codeBlock":
      return block.code ?? "";
    case "faqBlock": {
      const parts: string[] = [];
      if (block.title) parts.push(block.title);
      for (const it of block.items ?? []) {
        parts.push(it?.question ?? "", it?.answer ?? "");
      }
      return parts.join(" ");
    }
    case "gradientTitleBlock":
      return [block.title, block.highlightPrefix].filter(Boolean).join(" ");
    case "imageBlock":
      return [block.alt, block.caption].filter(Boolean).join(" ");
    case "dividerBlock":
      return "";
    default:
      return "";
  }
}

/** Approximate word count from excerpt + page-builder blocks (BlogPosting JSON-LD). */
export function estimateWordCountFromPostContent(
  post: Pick<Post, "content" | "excerpt">
): number | undefined {
  const parts: string[] = [];
  if (post.excerpt?.trim()) parts.push(post.excerpt.trim());
  for (const block of post.content ?? []) {
    const t = textFromPostBlock(block).trim();
    if (t) parts.push(t);
  }
  const text = parts.join(" ");
  if (!text.trim()) return undefined;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return words > 0 ? words : undefined;
}
