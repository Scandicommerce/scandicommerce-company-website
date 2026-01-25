import { defineArrayMember, defineField } from "sanity";

export const servicesShowcaseSection = defineField({
  name: "servicesShowcase",
  title: "Services Showcase Section",
  type: "object",
  description: "Shopify services packaged like products.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Main Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "highlight",
          title: "Highlighted Text",
          type: "string",
          description: "This text will be highlighted in teal color",
        }),
      ],
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "categories",
      title: "Service Categories",
      type: "array",
      description: "Optional service category cards displayed above packages (Build, Optimize, Support)",
      of: [
        defineArrayMember({
          name: "category",
          title: "Category",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon Name",
              type: "string",
              options: {
                list: [
                  { title: "Cart", value: "cart" },
                  { title: "Chart", value: "chart" },
                  { title: "Chat", value: "chat" },
                ],
              },
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "string",
            }),
            defineField({
              name: "link",
              title: "Link URL",
              type: "string",
            }),
            defineField({
              name: "linkText",
              title: "Link Text",
              type: "string",
              description: "e.g., 'View services'",
              initialValue: "View services",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "price" },
          },
        }),
      ],
    }),
    defineField({
      name: "packages",
      title: "Package Cards",
      type: "array",
      description: "Package cards (Foundation, Growth, Premium, Enterprise)",
      of: [
        defineArrayMember({
          name: "package",
          title: "Package",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description: "e.g., 'Foundation', 'Growth', 'Premium', 'Enterprise'",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "string",
              description: "e.g., 'Launch your Shopify store', 'Scale your existing store', 'Complex e-commerce solutions'",
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "string",
              description: "e.g., '89.000 kr' or 'Custom'",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "priceType",
              title: "Price Type",
              type: "string",
              description: "e.g., 'one-time', 'monthly'",
              initialValue: "one-time",
            }),
            defineField({
              name: "timeline",
              title: "Timeline",
              type: "string",
              description: "e.g., '6-8 weeks', '8-10 weeks', '10-14 weeks'",
              initialValue: "6-8 weeks",
            }),
            defineField({
              name: "rating",
              title: "Rating",
              type: "number",
              description: "Rating out of 5 (e.g., 4.9, 5)",
              validation: (rule) => rule.min(1).max(5),
              initialValue: 5,
            }),
            defineField({
              name: "ratingValue",
              title: "Rating Display",
              type: "string",
              description: "e.g., '4.9', '5'",
              initialValue: "5",
            }),
            defineField({
              name: "bestFor",
              title: "Best For",
              type: "array",
              description: "Bullet points for who this package is best for (e.g., 'New brands launching D2C', 'Simple product catalogs')",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({
              name: "buttonText",
              title: "Button Text",
              type: "string",
              initialValue: "View Details",
            }),
            defineField({
              name: "buttonLink",
              title: "Button Link",
              type: "string",
              description: "e.g., '/services/all_packages/foundation', '/services/all_packages/growth', '/services/all_packages/premium', '/services/all_packages/enterprise'",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "price" },
          },
        }),
      ],
    }),
  ],
});
