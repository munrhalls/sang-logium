import { defineType, defineField, defineArrayMember } from "sanity";
import { TrolleyIcon } from "@sanity/icons";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
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
      name: "brand",
      title: "Brand",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      type: "array",
      title: "Image Gallery",
      of: [defineArrayMember({ type: "image" })],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      description: "Stock Keeping Unit - Unique identifier for the product",
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "categoryPath",
      title: "Category Path",
      type: "string",
      description:
        "The metadata.path of the category this product belongs to (e.g., 'hi-fi-audio/amplifiers')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Keywords or tags for search and filtering",
    }),
    defineField({
      name: "overviewFields",
      title: "Overview Fields",
      type: "array",
      of: [
        defineField({
          name: "overviewField",
          type: "object",
          fields: [
            defineArrayMember({
              name: "title",
              type: "string",
              title: "Title",
            }),
            defineArrayMember({
              name: "value",
              type: "string",
              title: "Value",
            }),
            defineArrayMember({
              name: "information",
              type: "string",
              title: "Information",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      of: [
        defineArrayMember({
          name: "spec",
          type: "object",
          fields: [
            defineArrayMember({
              name: "title",
              type: "string",
              title: "Specification Title",
            }),
            defineArrayMember({
              name: "value",
              type: "string",
              title: "Value",
            }),
            defineArrayMember({
              name: "information",
              type: "string",
              title: "Information",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      price: "price",
    },
    prepare(select) {
      return {
        title: `${select.title} - $${select.price}`,
        media: select.media,
      };
    },
  },
});
