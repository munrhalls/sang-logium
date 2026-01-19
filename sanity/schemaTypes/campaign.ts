import { defineField, defineType } from "sanity";
import { Megaphone } from "lucide-react"; // Optional icon

export const campaignType = defineType({
  name: "campaign",
  title: "Campaign / Commercial",
  type: "document",
  icon: Megaphone,
  fields: [
    // 1. Internal Management
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      description: "For organizing in Studio (e.g., 'Summer Sale 2025')",
      validation: (Rule) => Rule.required(),
    }),

    // 2. The Content (Atomic & Semantic)
    defineField({
      name: "content",
      title: "Messaging",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow / Badge",
          type: "string",
          description:
            "Small text above headline (e.g., 'New Arrival' or '-50%')",
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "subhead",
          title: "Subhead",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "ctaText",
          title: "Button Label",
          type: "string",
          initialValue: "Shop Now",
        }),
      ],
    }),

    // 3. The "Smart" Data Source (Logic)
    defineField({
      name: "link",
      title: "Destination",
      type: "object",
      fields: [
        defineField({
          name: "type",
          type: "string",
          options: {
            list: [
              { title: "Product Reference", value: "product" },
              { title: "Sale Collection", value: "sale" },
              { title: "Custom URL", value: "custom" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "product",
          type: "reference",
          to: [{ type: "product" }],
          hidden: ({ parent }) => parent?.type !== "product",
        }),
        defineField({
          name: "sale",
          type: "reference",
          to: [{ type: "sale" }],
          hidden: ({ parent }) => parent?.type !== "sale",
        }),
        defineField({
          name: "url",
          type: "url",
          hidden: ({ parent }) => parent?.type !== "custom",
        }),
      ],
    }),

    // 4. Visual Assets
    defineField({
      name: "assets",
      title: "Visual Assets",
      type: "object",
      fields: [
        defineField({
          name: "desktopImage",
          title: "Background Image",
          type: "image",
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        }),
        // Optional: Add mobileImage here if art direction differs significantly
      ],
    }),
  ],
  preview: {
    select: {
      title: "internalTitle",
      subtitle: "content.headline",
      media: "assets.desktopImage",
    },
  },
});
