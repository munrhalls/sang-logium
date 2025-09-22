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
          { title: "Hero Main", value: "hero-main" },
          { title: "Hero Secondary", value: "hero-secondary" },
          { title: "Bestsellers", value: "bestsellers" },
          { title: "ExtremeQuality", value: "extreme-quality" },
          { title: "MVPMonth", value: "mvp-month" },
          { title: "Newest Release", value: "newest-release" },
          { title: "Featured Products", value: "featured-products" },
          { title: "Main Categories", value: "main-categories" },
          { title: "inactive", value: "inactive" },
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
    }),
    defineField({
      name: "text",
      type: "array",
      of: [
        defineArrayMember({
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
