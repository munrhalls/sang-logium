import { defineType, defineField } from "sanity";
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
      name: "image",
      title: "Product Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: { type: "category" },
      weak: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subcategory",
      type: "object",
      fields: [
        {
          name: "ref",
          type: "reference",
          to: [{ type: "category" }],
          weak: true,
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
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
        title: select.title,
        price: `$${select.price}`,
        media: select.media,
      };
    },
  },
});
