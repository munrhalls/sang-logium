import { defineType, defineField } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "object",
      fields: [
        {
          name: "path",
          title: "Full Path",
          type: "string",
          description: "e.g. headphones/wired",
          readOnly: true,
        },
        {
          name: "depth",
          title: "Depth",
          type: "number",
          readOnly: true,
        },
      ],
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
    }),
  ],
});
