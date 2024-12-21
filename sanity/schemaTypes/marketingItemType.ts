import { defineType, defineField } from "sanity";

export const marketingItemType = defineType({
  name: "marketingItem",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Marketing Item Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slides",
      title: "Marketing slides",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "backgroundImage", type: "image" }),
            defineField({
              name: "content",
              type: "array",
              of: [
                { type: "block" },
                {
                  type: "reference",
                  to: [
                    {
                      type: "product",
                    },
                    {
                      type: "sale",
                    },
                  ],
                },
                { type: "image" },
              ],
            }),
            defineField({
              name: "textOverlay",
              type: "blockContent",
            }),
          ],
        },
      ],
    }),
  ],
});
