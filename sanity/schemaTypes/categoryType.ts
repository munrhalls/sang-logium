// sanity/schemaTypes/categoryType.ts
import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon Name",
      type: "string",
    }),
    defineField({
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "group",
      title: "Menu Group",
      type: "string",
      description: 'The visual group header (e.g., "By Fit", "Home Theater").',
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
    }),
    defineField({
      name: "metadata",
      type: "object",
      readOnly: true,
      fields: [
        { name: "path", type: "string", title: "Full Path" },
        { name: "depth", type: "number", title: "Depth" },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "metadata.path" },
  },
});
