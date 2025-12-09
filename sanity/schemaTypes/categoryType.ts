// TODO SCHEMA CATEGORIES REDESIGN 1. - EACH CATEGORY IS ITS OWN DOCUMENT, parent id, path...and nothing more, really
// CASE - fetch CATEGORY products === groq === name && === startsWith path ...
// CASE - construct categories menu tree === use parentId to build tree structure
// TODO SCHEMA CATEGORIES REDESIGN 2. update products schema to sync
// TODO SCHEMA CATEGORIES REDESIGN 3. update CATEGORIES MENUS ON DESKTOP / MOBILE, MAKE SURE IT WORKS

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

// INITIAL
// import { defineType, defineField } from "sanity";

// export const categoryType = defineType({
//   name: "category",
//   title: "Category",
//   type: "document",
//   fields: [
//     defineField({
//       name: "title",
//       title: "Title",
//       type: "string",
//     }),
//     defineField({
//       name: "slug",
//       title: "Slug",
//       type: "slug",
//       options: { source: "title" }
//     }),
//     defineField({
//       name: "parent",
//       title: "Parent Category",
//       type: "reference",
//       to: [{ type: "category" }],
//     }),
//     // THE SECRET WEAPON
//     defineField({
//       name: "path",
//       title: "Full Path",
//       type: "string",
//       description: "e.g. men/shoes/running",
//       readOnly: true, // Generated automatically
//     }),
//   ],
// });
