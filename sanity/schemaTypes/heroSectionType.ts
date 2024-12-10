import { defineType, defineField } from "sanity";

export const heroSectionType = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "promotionPercentage",
      title: "Promotion Percentage",
      type: "number",
    }),
    defineField({
      name: "ctaText",
      title: "CTA Text",
      type: "string",
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
      subtitle: "subtitle",
      media: "backgroundImage",
      promotionPercentage: "promotionPercentage",
      ctaText: "ctaText",
      ctaLink: "ctaLink",
    },
    prepare(selection) {
      const { title, subtitle, media, promotionPercentage, ctaText, ctaLink } =
        selection;
      return {
        title: `${title} ${promotionPercentage ? `(${promotionPercentage}%)` : ""}`,
        subtitle: `${subtitle ? subtitle + " - " : ""}${ctaText ? ctaText + " (" + ctaLink + ")" : ""}`,
        media: media,
      };
    },
  },
});
