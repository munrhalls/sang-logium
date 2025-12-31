import { defineField, defineType } from "sanity";

export const settingsType = defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "mainMenu",
      title: "Main Navigation / Catalogue Structure",
      description: "This tree defines the site URL structure and visual menu.",
      type: "array",
      of: [{ type: "catalogueItem" }],
    }),
  ],
});
