import { defineField, defineType } from "sanity";

export const promotionType = defineType({
  name: "promotion",
  title: "Promotion",
  type: "document",
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "visual",
      title: "Visual Asset",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "discountPercent",
      title: "Discount Percentage",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "actionLabel",
      title: "Action Label",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "internalTitle",
      subtitle: "headline",
      media: "visual",
    },
    prepare(select) {
      return {
        title: select.title,
        subtitle: select.subtitle,
        media: select.media,
      };
    },
  },
});
