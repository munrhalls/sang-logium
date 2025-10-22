// schemas/user.js
import { UserIcon } from "@sanity/icons";
import { defineType, defineField, defineArrayMember } from "sanity";

export const userType = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserIcon,
  fields: [
    // ============ IDENTITY (Links to Clerk) ============
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      description: "Links to Clerk authentication system",
      validation: (Rule) => Rule.required(),
      readOnly: true, // Set programmatically
      hidden: false, // Visible for debugging
    }),

    // ============ DISPLAY INFO (Cached from Clerk) ============
    defineField({
      name: "displayName",
      title: "Display Name",
      type: "string",
      description: "Cached from Clerk for display purposes",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Cached from Clerk for queries (not source of truth)",
      validation: (Rule) => Rule.required().email(),
      readOnly: true,
    }),
    defineField({
      name: "avatarUrl",
      title: "Avatar URL",
      type: "url",
      description: "Profile picture from Clerk or social login",
    }),

    // ============ ADDRESSES ============
    defineField({
      name: "addresses",
      title: "Saved Addresses",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "address",
          title: "Address",
          fields: [
            {
              name: "id",
              type: "string",
              title: "Address ID",
              validation: (Rule) => Rule.required(),
              hidden: true, // Auto-generated
            },
            {
              name: "label",
              type: "string",
              title: "Label",
              description: "e.g., Home, Work, Mom's House",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "isDefault",
              type: "boolean",
              title: "Default Address",
              description: "Use this address by default",
              initialValue: false,
            },
            {
              name: "type",
              type: "string",
              title: "Address Type",
              options: {
                list: [
                  { title: "Both", value: "both" },
                  { title: "Shipping Only", value: "shipping" },
                  { title: "Billing Only", value: "billing" },
                ],
              },
              initialValue: "both",
            },
            {
              name: "fullName",
              type: "string",
              title: "Full Name",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "line1",
              type: "string",
              title: "Address Line 1",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "line2",
              type: "string",
              title: "Address Line 2",
            },
            {
              name: "city",
              type: "string",
              title: "City",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "state",
              type: "string",
              title: "State/Province",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "postalCode",
              type: "string",
              title: "Postal/ZIP Code",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "country",
              type: "string",
              title: "Country",
              validation: (Rule) => Rule.required(),
              initialValue: "US",
            },
            {
              name: "phone",
              type: "string",
              title: "Phone Number",
            },
            {
              name: "instructions",
              type: "text",
              title: "Delivery Instructions",
              description: "Gate code, apartment number, etc.",
              rows: 2,
            },
          ],
          preview: {
            select: {
              title: "label",
              line1: "line1",
              city: "city",
              isDefault: "isDefault",
            },
            prepare(selection) {
              return {
                title: selection.title + (selection.isDefault ? " ⭐" : ""),
                subtitle: `${selection.line1}, ${selection.city}`,
              };
            },
          },
        }),
      ],
    }),

    // ============ CACHED STATISTICS ============
    defineField({
      name: "stats",
      title: "User Statistics",
      type: "object",
      description: "Cached for performance, recalculated periodically",
      fields: [
        {
          name: "orderCount",
          type: "number",
          title: "Total Orders",
          validation: (Rule) => Rule.integer().min(0),
          readOnly: true,
        },
        {
          name: "totalSpent",
          type: "number",
          title: "Total Spent",
          validation: (Rule) => Rule.min(0),
          readOnly: true,
        },
        {
          name: "averageOrderValue",
          type: "number",
          title: "Average Order Value",
          readOnly: true,
        },
        {
          name: "lastOrderDate",
          type: "datetime",
          title: "Last Order Date",
          readOnly: true,
        },
        {
          name: "reviewCount",
          type: "number",
          title: "Reviews Written",
          validation: (Rule) => Rule.integer().min(0),
          readOnly: true,
        },
        {
          name: "wishlistItemCount",
          type: "number",
          title: "Wishlist Items",
          validation: (Rule) => Rule.integer().min(0),
          readOnly: true,
        },
      ],
    }),

    // ============ METADATA ============
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "object",
      fields: [
        {
          name: "createdAt",
          type: "datetime",
          title: "Account Created",
          validation: (Rule) => Rule.required(),
          readOnly: true,
        },
        {
          name: "updatedAt",
          type: "datetime",
          title: "Last Updated",
          readOnly: true,
        },
        {
          name: "lastSyncedWithClerk",
          type: "datetime",
          title: "Last Clerk Sync",
          description: "When user data was last synced from Clerk",
          readOnly: true,
        },
        {
          name: "source",
          type: "string",
          title: "Registration Source",
          options: {
            list: [
              { title: "Website", value: "web" },
              { title: "Mobile App", value: "mobile" },
              { title: "Guest Conversion", value: "guest_conversion" },
              { title: "Social Login", value: "social" },
              { title: "Admin Created", value: "admin" },
            ],
          },
        },
        {
          name: "tags",
          type: "array",
          of: [{ type: "string" }],
          title: "User Tags",
          description: "VIP, wholesale, staff, etc.",
        },
        {
          name: "notes",
          type: "text",
          title: "Internal Notes",
          description: "Customer service notes (not visible to user)",
          rows: 3,
        },
        {
          name: "isActive",
          type: "boolean",
          title: "Account Active",
          description: "False if suspended or deleted",
          initialValue: true,
        },
        {
          name: "gdprConsent",
          type: "object",
          title: "GDPR Consent",
          fields: [
            { name: "accepted", type: "boolean", title: "Accepted Terms" },
            { name: "acceptedAt", type: "datetime", title: "Acceptance Date" },
            { name: "ip", type: "string", title: "IP Address" },
          ],
        },
      ],
    }),

    // ============ PAYMENT METHODS (References) ============
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
      description:
        "The ID of the customer record in Stripe. Required for saved payment methods.",
      readOnly: true,
    }),
    defineField({
      name: "paymentMethods",
      title: "Saved Payment Methods",
      type: "array",
      description:
        "References to Stripe payment methods. Card details (last4, brand, expiry) are fetched live from Stripe API.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            {
              name: "stripePaymentMethodId",
              type: "string",
              title: "Stripe Payment Method ID",
              description:
                "The token/ID to fetch live card details from Stripe",
              validation: (Rule) => Rule.required(),
              readOnly: true,
            },
            {
              name: "isDefault",
              type: "boolean",
              title: "Default Payment Method",
              description:
                "User's preferred default card for checkout. Consider using Stripe's native default instead.",
              initialValue: false,
            },
            {
              name: "addedAt",
              type: "datetime",
              title: "Added Date",
              description: "When this payment method was first saved",
              readOnly: true,
            },
          ],
          preview: {
            select: {
              methodId: "stripePaymentMethodId",
              isDefault: "isDefault",
            },
            prepare(selection) {
              const { methodId, isDefault } = selection;
              return {
                title: `${methodId}${isDefault ? " ⭐" : ""}`,
                subtitle: isDefault ? "Default" : "Payment Method",
              };
            },
          },
        }),
      ],
    }),
  ],

  // ============ PREVIEW CONFIG ============
  preview: {
    select: {
      displayName: "displayName",
      email: "email",
      orderCount: "stats.orderCount",
      tier: "loyalty.tier",
      isActive: "metadata.isActive",
    },
    prepare(selection) {
      const { displayName, email, orderCount, tier, isActive } = selection;
      return {
        title: `${displayName}${!isActive ? " (Inactive)" : ""}`,
        subtitle: `${email} • ${orderCount || 0} orders • ${tier || "Bronze"}`,
        media: UserIcon,
      };
    },
  },
});
