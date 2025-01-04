import { defineType, defineField } from "sanity";

export const commercialType = defineType({
  name: "commercial",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "feature",
      type: "string",
      options: {
        list: [
          { title: "Hero", value: "hero" },
          { title: "Category Banner", value: "category" },
          { title: "Campaign", value: "campaign" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      type: "array",
      of: [
        {
          type: "block",
          marks: {
            annotations: [
              {
                type: "textColor",
              },
              {
                type: "highlightColor",
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sale",
      title: "Reference to sale advertised by the commercial",
      type: "reference",
      to: [{ type: "sale" }],
    }),
    defineField({
      name: "products",
      title: "Products featured in commercial (optional)",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
    }),
  ],
});
