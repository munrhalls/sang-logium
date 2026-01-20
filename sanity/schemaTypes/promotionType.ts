import { defineField, defineType } from "sanity";

export const promotionType = defineType({
  name: "promotion",
  title: "Promotion",
  type: "document",
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "promotion_text",
      title: "Promotion text",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Normal", value: "normal" },
            { title: "Small", value: "small" },
          ],
          lists: [],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "color",
                type: "object",
                title: "Color",
                fields: [
                  {
                    name: "hex",
                    type: "string",
                    title: "Color",
                    options: {
                      list: [
                        { title: "White", value: "#ffffff" },
                        { title: "Red", value: "#ff0000" },
                        { title: "Blue", value: "#0000ff" },
                        { title: "Green", value: "#00ff00" },
                        { title: "Yellow", value: "#ffff00" },
                        { title: "Purple", value: "#800080" },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "visual",
      title: "Visual Asset",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cta_text",
      title: "CALL TO ACTION button text",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Normal", value: "normal" },
            { title: "Small", value: "small" },
          ],
          lists: [],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "color",
                type: "object",
                title: "Color",
                fields: [
                  {
                    name: "hex",
                    type: "string",
                    title: "Color",
                    options: {
                      list: [
                        { title: "White", value: "#ffffff" },
                        { title: "Red", value: "#ff0000" },
                        { title: "Blue", value: "#0000ff" },
                        { title: "Green", value: "#00ff00" },
                        { title: "Yellow", value: "#ffff00" },
                        { title: "Purple", value: "#800080" },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cta_background",
      title: "CALL TO ACTION button background color",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "internalTitle",
      media: "visual",
    },
  },
});
