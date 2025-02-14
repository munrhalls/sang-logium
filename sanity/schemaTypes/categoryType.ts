// categoryType.ts
import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "object",
      fields: [
        { name: "path", title: "Path", type: "string" },
        { name: "depth", title: "Depth", type: "number" },
        { name: "group", title: "Group", type: "number" },
        {
          name: "label",
          title: "Label",
          type: "number",
          options: {
            list: [1, 2],
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare({ title }) {
      return {
        title,
      };
    },
  },
});
