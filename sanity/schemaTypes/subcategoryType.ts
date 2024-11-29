import { defineType, defineField } from "sanity";

export const subcategoryType = defineType({
  name: "subcategory",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "parentCategory",
      type: "reference",
      to: { type: "category" },
      weak: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "parentCategory.title",
    },
    prepare(selection) {
      const { title, category } = selection;
      return {
        title: title,
        subtitle: category ? `In ${category}` : "No parent category",
      };
    },
  },
});
