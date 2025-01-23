import { defineField, defineType, defineArrayMember } from "sanity";

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
      name: "variant",
      type: "string",
      options: {
        list: [
          { title: "Text", value: "text" },
          { title: "Products", value: "products" },
        ],
      },
    }),
    defineField({
      name: "displayOrder",
      type: "number",
      initialValue: 0,
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
        defineArrayMember({
          type: "block",
          marks: {
            annotations: [
              defineArrayMember({
                type: "textColor",
              }),
              defineArrayMember({
                type: "highlightColor",
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "sale",
      title: "Reference to sale advertised by the commercial (optional)",
      type: "reference",
      to: [{ type: "sale" }],
    }),
    defineField({
      name: "ctaLink",
      title: "What URL the commercial links to (optional)",
      type: "string",
    }),
    defineField({
      name: "products",
      title: "Products featured in commercial (optional)",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "product" }],
        }),
      ],
    }),
  ],
});
