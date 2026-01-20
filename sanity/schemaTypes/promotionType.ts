import { comprehensiveColorList } from "./colors";

import { defineField, defineType } from "sanity";

const segmentType = {
  type: "object",
  name: "segment",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "highlighted",
      title: "Highlighted",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      options: {
        list: comprehensiveColorList,
      },
      hidden: ({ parent }) => !parent?.highlighted,
    }),
  ],
};

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
      type: "array",
      of: [segmentType],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [segmentType],
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
      type: "array",
      of: [segmentType],
    }),
    defineField({
      name: "actionLabel",
      title: "Action Label",
      type: "array",
      of: [segmentType],
    }),
  ],
  preview: {
    select: {
      title: "internalTitle",
      media: "visual",
    },
    prepare(select) {
      return {
        title: select.title,
        media: select.media,
      };
    },
  },
});
