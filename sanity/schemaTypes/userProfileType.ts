import { UserIcon } from "@sanity/icons";
import { defineType, defineField } from "sanity";

export const userProfileType = defineType({
  name: "userProfile",
  title: "User Profile",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "clerkId",
      title: "Clerk ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayName",
      title: "Display Name",
      type: "string",
    }),
    defineField({
      name: "primaryAddress",
      title: "Primary Address",
      type: "object",
      fields: [
        defineField({
          name: "streetAddress",
          title: "Street Address",
          type: "string",
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
        }),
        defineField({
          name: "state",
          title: "State/Province",
          type: "string",
        }),
        defineField({
          name: "postalCode",
          title: "Postal Code",
          type: "string",
        }),
        defineField({
          name: "country",
          title: "Country",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "preferences",
      title: "Preferences",
      type: "object",
      fields: [
        defineField({
          name: "receiveMarketingEmails",
          title: "Receive Marketing Emails",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "darkMode",
          title: "Dark Mode",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "savePaymentInfo",
          title: "Save Payment Information",
          type: "boolean",
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "displayName",
      subtitle: "clerkId",
    },
    prepare(select) {
      return {
        title: select.title || "Unnamed User",
        subtitle: `ID: ${select.subtitle}`,
        media: UserIcon,
      };
    },
  },
});
