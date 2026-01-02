import { defineField, defineType } from "sanity";

export const catalogueType = defineType({
  name: "catalogue",
  title: "Catalogue",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Menu Name",
      type: "string",
      description: "Internal name for this menu (e.g. 'Main Store Menu')",
      initialValue: "Main Menu",
    }),
    defineField({
      name: "catalogue",
      title: "Catalogue",
      description: "This tree defines the site URL structure and visual menu.",
      type: "array",
      of: [{ type: "catalogueItem" }],
    }),
  ],
});
