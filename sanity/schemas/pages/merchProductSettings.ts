import { defineField, defineType, defineArrayMember } from "sanity";
import { languageField } from "../objects/language";

export const merchProductSettings = defineType({
  name: "merchProductSettings",
  title: "Merch Product Settings",
  type: "document",
  description: "Shared settings for product detail pages (features, details, size guide)",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    languageField,
    defineField({
      name: "settingsTitle",
      title: "Settings Title",
      type: "string",
      description: "Internal name for these settings",
      validation: (rule) => rule.required(),
    }),
    // Product Features Section
    defineField({
      name: "productFeatures",
      title: "Product Features Section",
      type: "object",
      fields: [
        defineField({
          name: "features",
          title: "Features",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "string" }),
              ],
              preview: {
                select: { title: "title", subtitle: "description" },
              },
            }),
          ],
        }),
      ],
    }),
    // Product Details Section
    defineField({
      name: "productDetails",
      title: "Product Details Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({
          name: "bulletPoints",
          title: "Bullet Points",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    // Size Guide Section
    defineField({
      name: "sizeGuide",
      title: "Size Guide Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({ name: "contactButtonText", title: "Contact Button Text", type: "string" }),
        defineField({
          name: "sizes",
          title: "Sizes",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "size", title: "Size", type: "string" }),
                defineField({ name: "chest", title: "Chest", type: "string" }),
                defineField({ name: "length", title: "Length", type: "string" }),
                defineField({ name: "sleeve", title: "Sleeve", type: "string" }),
              ],
              preview: {
                select: { title: "size" },
                prepare({ title }) {
                  return { title: `Size ${title}` };
                },
              },
            }),
          ],
        }),
      ],
    }),
    // Related Products Section
    defineField({
      name: "relatedProducts",
      title: "Related Products Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "products",
          title: "Products to Show",
          description: "Add Shopify product handles to display specific related products. Leave empty to auto-select based on collection.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ 
                  name: "handle", 
                  title: "Product Handle", 
                  type: "string",
                  description: "The Shopify product handle (URL slug)",
                }),
                defineField({ 
                  name: "name", 
                  title: "Display Name (Optional)", 
                  type: "string",
                  description: "Optional override for product name",
                }),
              ],
              preview: {
                select: { title: "handle", subtitle: "name" },
                prepare({ title, subtitle }) {
                  return { 
                    title: subtitle || title || "No handle",
                    subtitle: subtitle ? title : undefined,
                  };
                },
              },
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "settingsTitle" },
  },
});
