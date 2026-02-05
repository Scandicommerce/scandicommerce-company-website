import { defineField, defineType } from "sanity";

/**
 * Category filter keyword for the Partners page.
 * Add categories here; they appear as filters and section headers on the partner page.
 * Order is automatic: categories with more partners appear first.
 * Assign these categories to partners in the Partners Page → Partners Grid → each partner's Categories field.
 */
export const partnerCategory = defineType({
  name: "partnerCategory",
  title: "Partner Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Category name",
      type: "string",
      description: "Display name (e.g. Platform, ERP, OMS, Shipping, Logistics, POS)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Optional icon name for the filter/section (e.g. ShoppingBag, Package, Truck, MapPin, CreditCard, Mail, Headphones, Star, Compass). Leave empty for default.",
      options: {
        list: [
          { title: "Shopping bag", value: "ShoppingBag" },
          { title: "Package", value: "Package" },
          { title: "Layout grid", value: "LayoutGrid" },
          { title: "Truck", value: "Truck" },
          { title: "Map pin", value: "MapPin" },
          { title: "Credit card", value: "CreditCard" },
          { title: "Mail", value: "Mail" },
          { title: "Headphones", value: "Headphones" },
          { title: "Star", value: "Star" },
          { title: "Compass", value: "Compass" },
        ],
      },
    }),
  ],
  orderings: [
    { title: "Title A–Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
    { title: "Title Z–A", name: "titleDesc", by: [{ field: "title", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title || "Untitled category",
        subtitle: "Order is by partner count on the site",
      };
    },
  },
});
