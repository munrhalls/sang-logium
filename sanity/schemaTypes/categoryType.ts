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
      name: "groups",
      title:
        "Groups for grouping children categories, each group will displayed under group header, e.g. By fit - each child must have the same group attribute to be in a category, ungrouped children will be in an unnamed group with no title",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["empty"],
    }),
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "object",
      fields: [
        { name: "path", title: "Path", type: "string" },
        { name: "depth", title: "Depth", type: "number" },
        { name: "group", title: "Group", type: "string" },
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
