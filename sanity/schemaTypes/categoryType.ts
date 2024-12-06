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
        { name: "path", title: "Path", type: "string" }, // e.g., "parent/child/subchild"
        { name: "depth", title: "Depth", type: "number" }, // e.g., 1 = top-level, 2 = subcategory
      ],
    }),
    // defineField({
    //   name: "parentCategory",
    //   title: "Parent Category",
    //   type: "reference",
    //   to: [{ type: "category" }],
    //   validation: (Rule) =>
    //     Rule.custom((value, context) => {
    //       if (!context?.document) return true;
    //       if (value && value._ref === context.document._id) {
    //         return "Cannot reference itself as parent";
    //       }
    //       return true;
    //     }),
    // }),
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
