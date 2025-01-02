import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export const saleType = defineType({
  name: "sale",
  title: "Sale",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Sale Title",
    }),
    defineField({
      type: "slug",
      name: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "discountAmount",
      type: "number",
      title: "Discount Percentage",
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "products",
      type: "array",
      title: "Products on Sale",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "validFrom",
      type: "datetime",
      title: "Valid From",
    }),
    defineField({
      name: "validUntil",
      type: "datetime",
      title: "Valid Until",
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      title: "Is Active",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      discountAmount: "discountAmount",
      isActive: "isActive",
    },
    prepare(selection) {
      const { title, discountAmount, isActive } = selection;
      const status = isActive ? "Active" : "Inactive";
      return {
        title: `${title} (${status})`,
        subtitle: `${discountAmount}% off`,
      };
    },
  },
});
