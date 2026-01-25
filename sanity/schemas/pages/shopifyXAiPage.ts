import { defineArrayMember, defineField, defineType } from "sanity";

export const shopifyXAiPage = defineType({
  name: "shopifyXAiPage",
  title: "Shopify x AI Page",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "pageTitle", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    // Hero Section
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({
          name: "heroTitle",
          title: "Hero Title",
          type: "object",
          fields: [
            defineField({ name: "text", title: "Main Text", type: "string" }),
            defineField({ name: "highlight", title: "Highlighted Text", type: "string" }),
          ],
        }),
        defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 3 }),
      ],
    }),
    // Enhancing With AI Section
    defineField({
      name: "enhancingWithAi",
      title: "Enhancing With AI Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({ name: "paragraph1", title: "Paragraph 1", type: "text", rows: 4 }),
        defineField({ name: "paragraph2", title: "Paragraph 2", type: "text", rows: 4 }),
        defineField({
          name: "quote",
          title: "Quote Block",
          type: "object",
          fields: [
            defineField({ name: "text", title: "Quote Text", type: "text", rows: 3 }),
            defineField({ name: "author", title: "Author", type: "string" }),
          ],
        }),
      ],
    }),
    // How We Leverage AI Section
    defineField({
      name: "howWeLeverageAi",
      title: "How We Leverage AI Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({
          name: "capabilities",
          title: "AI Capabilities",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
                defineField({ name: "bgColor", title: "Background Color", type: "string", description: "e.g., bg-[#03C1CA] or bg-[#1F1D1D]" }),
                defineField({
                  name: "features",
                  title: "Features",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                }),
                defineField({ name: "impactTitle", title: "Impact Title", type: "string" }),
                defineField({ name: "impactParagraph1", title: "Impact Paragraph 1", type: "text", rows: 3 }),
                defineField({ name: "impactParagraph2", title: "Impact Paragraph 2", type: "text", rows: 3 }),
                defineField({ name: "linkText", title: "Link Text", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),
    // AI Tools Toolkit Section
    defineField({
      name: "aiToolsToolkit",
      title: "AI Tools Toolkit Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({
          name: "toolCategories",
          title: "Tool Categories",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
              ],
            }),
          ],
        }),
        defineField({ name: "bottomText", title: "Bottom Text", type: "text", rows: 3 }),
      ],
    }),
    // How We Apply AI Section
    defineField({
      name: "howWeApplyAi",
      title: "How We Apply AI Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({
          name: "applicationAreas",
          title: "Application Areas",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
                defineField({
                  name: "features",
                  title: "Features",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                }),
                defineField({ name: "benefit", title: "Benefit", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),
    // AI Enhanced Process Section
    defineField({
      name: "aiEnhancedProcess",
      title: "AI Enhanced Process Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({
          name: "processSteps",
          title: "Process Steps",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
              ],
            }),
          ],
        }),
      ],
    }),
    // FAQ Section
    defineField({
      name: "faq",
      title: "FAQ Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Section Title", type: "string" }),
        defineField({
          name: "items",
          title: "FAQ Items",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "question", title: "Question", type: "string" }),
                defineField({ name: "answer", title: "Answer", type: "text", rows: 4 }),
              ],
            }),
          ],
        }),
      ],
    }),
    // CTA Section
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({ name: "buttonText", title: "Button Text", type: "string" }),
        defineField({ name: "buttonLink", title: "Button Link", type: "string" }),
      ],
    }),
    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
        defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: { select: { title: "pageTitle" } },
});
