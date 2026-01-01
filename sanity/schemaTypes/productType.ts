// TODO implement the Reference Pattern and switches to Markdown

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
    // TODO FIX 1: Switched to Markdown (Install 'sanity-plugin-markdown')
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
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
    // TODO    RECOMMENDATION: Brand as Reference.

    // The Issue: brand is a string. If you type "Sony" on one product and "Sony Inc." on another, your filtering breaks.

    // The Fix: Make brand a Reference to a brand document. This enforces consistency (Invariant).
    defineField({
      name: "stripePriceId",
      title: "Stripe Price ID",
      type: "string",
      description:
        "The unique ID for the Price object in Stripe (e.g., price_...).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayPrice",
      title: "Display Price (e.g., 19.99)",
      type: "number",
      description: "The human-readable price, must match the price on Stripe.",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      description: "Stock Keeping Unit - Unique identifier for the product",
      validation: (Rule) => Rule.required().min(3),
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
      name: "catalogueLocationKeys",
      title: "Catalogue Location",
      description: "Select where this product appears in the catalogue.",
      type: "array",
      of: [{ type: "string" }],
      // components: { input: MenuLocationInput }, // <--- UNCOMMENT THIS when component exists
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "overviewFields",
      title: "Overview Fields",
      type: "array",
      of: [
        defineArrayMember({
          name: "overviewField",
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "value", type: "string", title: "Value" },
            { name: "information", type: "string", title: "Information" },
          ],
        }),
      ],
    }),
    // TODO Note: Use a different system for Sidebar Filtering.
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      of: [
        defineArrayMember({
          name: "spec",
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Specification Title",
            },
            {
              name: "value",
              type: "string",
              title: "Value",
            },
            {
              name: "information",
              type: "string",
              title: "Information",
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    // TODO preview the category name too
    select: {
      title: "name",
      media: "image",
      price: "displayPrice",
    },
    prepare(select) {
      return {
        title: `${select.title} - $${select.price}`,
        media: select.media,
      };
    },
  },
});

// INITIAL:
// import { defineType, defineField, defineArrayMember } from "sanity";
// import { TrolleyIcon } from "@sanity/icons";

// export const productType = defineType({
//   name: "product",
//   title: "Products",
//   type: "document",
//   icon: TrolleyIcon,
//   fields: [
//     defineField({
//       name: "name",
//       title: "Product Name",
//       type: "string",
//       validation: (Rule) => Rule.required(),
//     }),
//     // FIX 1: Switched to Markdown (Install 'sanity-plugin-markdown')
//     defineField({
//       name: "description",
//       title: "Description",
//       type: "markdown",
//       description: "Product details in standard Markdown.",
//     }),
//     defineField({
//       name: "slug",
//       title: "Slug",
//       type: "slug",
//       options: {
//         source: "name",
//         maxLength: 96,
//       },
//       validation: (Rule) => Rule.required(),
//     }),
//     // FIX 2: Switched to Reference Pattern
//     // We link to the Category Document. The "Path" string lives ON THE CATEGORY, not here.
//     defineField({
//       name: "category",
//       title: "Primary Category",
//       type: "reference",
//       to: [{ type: "category" }],
//       validation: (Rule) => Rule.required(),
//     }),
//     defineField({
//         name: "brand",
//         title: "Brand",
//         type: "string", // Or better: type: "reference", to: [{type: "brand"}]
//         validation: (Rule) => Rule.required(),
//     }),
//     // ... Price, Stock, SKU are fine ...
//     defineField({
//       name: "stripePriceId",
//       title: "Stripe Price ID",
//       type: "string",
//       validation: (Rule) => Rule.required(),
//     }),
//     defineField({
//       name: "displayPrice",
//       title: "Display Price",
//       type: "number",
//       validation: (Rule) => Rule.required().min(0),
//     }),
//     defineField({
//       name: "stock",
//       title: "Stock",
//       type: "number",
//       validation: (Rule) => Rule.min(0),
//     }),
//     defineField({
//       name: "sku",
//       title: "SKU",
//       type: "string",
//       validation: (Rule) => Rule.required().min(3),
//     }),
//     defineField({
//       name: "image",
//       title: "Main Image",
//       type: "image",
//       options: { hotspot: true },
//       validation: (Rule) => Rule.required(),
//     }),
//     defineField({
//       name: "gallery",
//       title: "Image Gallery",
//       type: "array",
//       of: [defineArrayMember({ type: "image" })],
//     }),
//     // ... Specs and Overview ...
//     // Kept as-is for DISPLAY purposes.
//     // Note: Use a different system for Sidebar Filtering.
//     defineField({
//       name: "specifications",
//       title: "Technical Specifications (Table)",
//       type: "array",
//       of: [
//         defineArrayMember({
//           type: "object",
//           name: "spec",
//           fields: [
//             { name: "title", type: "string", title: "Label" },
//             { name: "value", type: "string", title: "Value" },
//           ],
//           preview: {
//             select: { title: "title", subtitle: "value" }
//           }
//         }),
//       ],
//     }),
//   ],
//   preview: {
//     select: {
//       title: "name",
//       media: "image",
//       price: "displayPrice",
//       // You can now preview the category name too!
//       category: "category.name"
//     },
//     prepare(select) {
//       return {
//         title: select.title,
//         subtitle: `${select.category || 'No Category'} | $${select.price}`,
//         media: select.media,
//       };
//     },
//   },
// });
