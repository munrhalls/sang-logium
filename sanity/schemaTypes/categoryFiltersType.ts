// categoryFiltersType.ts

import { defineType, defineField } from "sanity";

export const categoryFiltersType = defineType({
  name: "categoryFilters",
  title: "Category Filters",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Name of this category filters collection",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "filters",
      title: "Category-Specific Filters",
      type: "object",
      fields: [
        {
          name: "filterItems",
          title: "Filter Items",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "name",
                  title: "Filter Name",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
                {
                  name: "type",
                  title: "Filter Type",
                  type: "string",
                  options: {
                    list: ["checkbox", "radio", "range", "boolean"],
                  },
                  validation: (rule) => rule.required(),
                },
                {
                  name: "defaultValue",
                  title: "Default Value",
                  type: "string",
                  description:
                    "Option value to select by default (leave empty for no default selection)",
                  hidden: ({ parent }) => parent?.type !== "radio",
                },
                {
                  name: "options",
                  title: "Filter Options",
                  type: "array",
                  of: [{ type: "string" }],
                  description: "List of option names",
                  hidden: ({ parent }) =>
                    parent?.type === "boolean" || parent?.type === "range",
                },
                {
                  name: "min",
                  title: "Minimum Value",
                  type: "number",
                  hidden: ({ parent }) => parent?.type !== "range",
                },
                {
                  name: "max",
                  title: "Maximum Value",
                  type: "number",
                  hidden: ({ parent }) => parent?.type !== "range",
                },
                {
                  name: "step",
                  title: "Step Size",
                  type: "number",
                  hidden: ({ parent }) => parent?.type !== "range",
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: "categoryMappings",
      title: "Category Path Mappings",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "path",
              title: "Category Path",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              name: "filters",
              title: "Filters",
              type: "array",
              of: [{ type: "string" }],
              description: "Names of filters to apply to this category",
            },
          ],
        },
      ],
    }),
  ],
});
