// schemas/settings.ts
import { defineField, defineType } from "sanity";

export const settingsType = defineType({
  name: "settings",
  title: "Site Settings",
  type: "document", // <--- THIS is the Document
  fields: [
    defineField({
      name: "mainMenu",
      title: "Main Navigation",
      type: "array",
      of: [{ type: "menuItem" }], // <--- Uses the Object defined before
    }),
  ],
});
