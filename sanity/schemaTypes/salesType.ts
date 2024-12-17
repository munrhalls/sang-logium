import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export const salesType = defineType({
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
      name: "products",
      type: "array",
      title: "Products on Sale",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "featuredProducts",
      type: "array",
      title: "Featured in Hero",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      description: "Products to highlight in the hero section",
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: "discountAmount",
      type: "number",
      title: "Discount Amount",
      description: "Amount off in percentage or fixed value",
    }),
    defineField({
      name: "couponBased",
      type: "boolean",
      title: "Coupon Based",
    }),
    defineField({
      name: "couponCode",
      type: "string",
      title: "Coupon Code",
      hidden: ({ parent }) => !parent?.couponBased,
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
      description: "Toggle to activate/deactivate the sale",
      initialValue: true,
    }),
    defineField({
      name: "image",
      title: "Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "url",
      initialValue: "/category/sales",
    }),
  ],
  preview: {
    select: {
      title: "title",
      discountAmount: "discountAmount",
      couponCode: "couponCode",
      isActive: "isActive",
      backgroundImage: "backgroundImage",
    },
    prepare(selection) {
      const { title, discountAmount, couponCode, isActive, backgroundImage } =
        selection;
      const status = isActive ? "Active" : "Inactive";
      return {
        title: `${title} (${status})`,
        subtitle: `Discount: ${discountAmount}% - Code: ${couponCode}`,
        media: backgroundImage,
      };
    },
  },
});
