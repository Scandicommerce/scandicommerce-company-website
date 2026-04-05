import type { Template } from "sanity";

/** Minimal portable text block so required `blockContent` fields validate in new drafts. */
function ptSeed(key: string, placeholder: string) {
  return [
    {
      _type: "block",
      _key: `${key}-blk`,
      style: "normal",
      children: [
        {
          _type: "span",
          _key: `${key}-sp`,
          text: placeholder,
          marks: [],
        },
      ],
      markDefs: [],
    },
  ];
}

const standardPostContent = [
  {
    _type: "keyTakeawaysBlock",
    _key: "kt1",
    content: ptSeed("kt1", "Key takeaways — replace with bullets or short paragraphs."),
  },
  {
    _type: "richTextBlock",
    _key: "rt1",
    body: ptSeed("rt1", "Introduction — replace this text."),
  },
  {
    _type: "gradientTitleBlock",
    _key: "gt1",
    title: "Section 1 — edit heading",
    highlightPrefix: "",
  },
  {
    _type: "calloutBlock",
    _key: "co1",
    variant: "tldr",
    title: "TL;DR",
    content: "Short summary for this section — replace.",
  },
  {
    _type: "richTextBlock",
    _key: "rt2",
    body: ptSeed("rt2", "Section 1 body — replace this text."),
  },
  {
    _type: "gradientTitleBlock",
    _key: "gt2",
    title: "Section 2 — edit heading",
    highlightPrefix: "",
  },
  {
    _type: "calloutBlock",
    _key: "co2",
    variant: "tldr",
    title: "TL;DR",
    content: "Short summary — replace.",
  },
  {
    _type: "richTextBlock",
    _key: "rt3",
    body: ptSeed("rt3", "Section 2 body — replace this text."),
  },
  {
    _type: "gradientTitleBlock",
    _key: "gt3",
    title: "Section 3 — edit heading",
    highlightPrefix: "",
  },
  {
    _type: "calloutBlock",
    _key: "co3",
    variant: "tldr",
    title: "TL;DR",
    content: "Short summary — replace.",
  },
  {
    _type: "richTextBlock",
    _key: "rt4",
    body: ptSeed("rt4", "Section 3 body — replace this text."),
  },
];

const caseStudyPostContent = [
  standardPostContent[0],
  standardPostContent[1],
  {
    _type: "gradientTitleBlock",
    _key: "gt1",
    title: "Utgangspunktet",
    highlightPrefix: "",
  },
  {
    _type: "calloutBlock",
    _key: "co1",
    variant: "tldr",
    title: "TL;DR",
    content: "Summary — replace.",
  },
  {
    _type: "richTextBlock",
    _key: "rt2",
    body: ptSeed("rt2", "Context and starting point — replace."),
  },
  {
    _type: "gradientTitleBlock",
    _key: "gt2",
    title: "Løsningen",
    highlightPrefix: "",
  },
  {
    _type: "calloutBlock",
    _key: "co2",
    variant: "tldr",
    title: "TL;DR",
    content: "Summary — replace.",
  },
  {
    _type: "richTextBlock",
    _key: "rt3",
    body: ptSeed("rt3", "What we built — replace."),
  },
  {
    _type: "gradientTitleBlock",
    _key: "gt3",
    title: "Resultater",
    highlightPrefix: "",
  },
  {
    _type: "calloutBlock",
    _key: "co3",
    variant: "tldr",
    title: "TL;DR",
    content: "Summary — replace.",
  },
  {
    _type: "richTextBlock",
    _key: "rt4",
    body: ptSeed("rt4", "Outcomes and metrics — replace."),
  },
  {
    _type: "tableBlock",
    _key: "tbl1",
    title: "Comparison",
    columns: ["Column A", "Column B"],
    rows: [],
  },
];

/** Extra initial document templates for Post (page builder) and classic Blog post. */
export const blogWorkflowTemplates: Template[] = [
  {
    id: "post-standard-structure",
    title: "Standard blog post (structure)",
    schemaType: "post",
    value: () => ({
      language: "no",
      content: standardPostContent,
    }),
  },
  {
    id: "post-case-study-structure",
    title: "Case study post (structure)",
    schemaType: "post",
    value: () => ({
      language: "no",
      tags: [{ _key: "tag-case", label: "Case Study", isPrimary: true }],
      content: caseStudyPostContent,
    }),
  },
  {
    id: "blogPost-classic-outline",
    title: "Classic article (3 sections)",
    schemaType: "blogPost",
    value: () => ({
      language: "no",
      introduction: "Replace with introduction.",
      sections: [
        {
          _type: "articleSection",
          _key: "sec1",
          id: "section-1",
          title: "Section 1",
          content: "Replace with body text.",
        },
        {
          _type: "articleSection",
          _key: "sec2",
          id: "section-2",
          title: "Section 2",
          content: "Replace with body text.",
        },
        {
          _type: "articleSection",
          _key: "sec3",
          id: "section-3",
          title: "Section 3",
          content: "Replace with body text.",
        },
      ],
    }),
  },
];
