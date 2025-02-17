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
      title: "Category Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
    defineField({
      name: "subcategories",
      title: "Subcategories",
      type: "array",
      of: [
        {
          type: "object",
          name: "subcategory",
          title: "Subcategory",
          fields: [{ name: "name", type: "string", title: "Name" }],
        },
        {
          type: "object",
          name: "groupedSubcategory",
          title: "Grouped Subcategory",
          fields: [
            { name: "header", type: "string", title: "Group Header" },
            { name: "name", type: "string", title: "Name" },
          ],
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
