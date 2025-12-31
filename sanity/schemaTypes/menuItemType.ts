import { defineField, defineType } from "sanity";

export const menuItemType = defineType({
  name: "menuItem",
  title: "Menu Item",
  type: "object",
  fields: [
    // 1. The Label (What the user sees)
    defineField({
      name: "title",
      type: "string",
      title: "Label",
      validation: (Rule) => Rule.required(),
    }),
    // 2. The Logic (Is it a clickable link or just a visual header?)
    defineField({
      name: "type",
      title: "Item Type",
      type: "string",
      options: {
        list: [
          { title: "Link (Clickable)", value: "link" },
          { title: "Group Header (Visual Label)", value: "header" },
        ],
        layout: "radio",
      },
      initialValue: "link",
    }),
    // 3. The Destination (Only if it's a link)
    defineField({
      name: "linkTarget",
      title: "Link Target",
      type: "reference",
      to: [{ type: "category" }], // <--- References your existing Category document
      hidden: ({ parent }) => parent?.type === "header", // Hide if it's just a header
    }),
    // 4. The Recursion (Children)
    defineField({
      name: "children",
      title: "Sub-Items",
      type: "array",
      of: [{ type: "menuItem" }], // <--- RECURSION: Use the same type inside itself
    }),
    defineField({
      name: "isHighlighted",
      title: "Highlight this item",
      type: "boolean",
      description: "Make this item stand out (e.g., Orange text)",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", type: "type" },
    prepare({ title, type }) {
      return {
        title: title,
        subtitle: type === "header" ? "📂 Group Header" : "🔗 Link",
      };
    },
  },
});
