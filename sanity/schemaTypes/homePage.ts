import { defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        // A. Layout Control
        defineField({
          name: "layout",
          title: "Display Layout",
          type: "string",
          options: {
            list: [
              // Your frontend maps these strings to CSS classes/Components
              {
                title: "Split Screen (Image Left / Text Right)",
                value: "split",
              },
              { title: "Full Background (Overlay Text)", value: "overlay" },
              { title: "Carousel (Multiple Slides)", value: "carousel" },
            ],
          },
          initialValue: "overlay",
        }),

        // B. The Data (References)
        defineField({
          name: "slides",
          title: "Active Campaigns",
          type: "array",
          of: [
            {
              type: "reference",
              to: [{ type: "campaign" }],
              // Optional: You can add "overrides" here if a specific slide
              // needs a tweak just for the Home Page context.
            },
          ],
          validation: (Rule) => Rule.required().min(1),
        }),

        // C. Section Specific Settings (Optional)
        defineField({
          name: "autoRotate",
          title: "Auto Rotate Carousel?",
          type: "boolean",
          hidden: ({ parent }) => parent?.layout !== "carousel",
        }),
      ],
    }),
    // ... other page sections (Bestsellers, etc.)
  ],
});
