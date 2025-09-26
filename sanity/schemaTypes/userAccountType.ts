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

    // ============ WISHLISTS ============
    defineField({
      name: "wishlists",
      title: "Wishlists",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "wishlistItem",
          fields: [
            {
              name: "id",
              type: "string",
              title: "Wishlist Item ID",
              validation: (Rule) => Rule.required(),
              hidden: true,
            },
            {
              name: "productRef",
              type: "reference",
              to: [{ type: "product" }],
              weak: true,
              title: "Product",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "variantId",
              type: "string",
              title: "Variant ID",
              description: "Specific size/color if applicable",
            },
            {
              name: "addedAt",
              type: "datetime",
              title: "Added Date",
              validation: (Rule) => Rule.required(),
              initialValue: () => new Date().toISOString(),
            },
            {
              name: "priceAtAdd",
              type: "number",
              title: "Price When Added",
              description: "Track price changes",
            },
            {
              name: "note",
              type: "string",
              title: "Personal Note",
              description: "Gift idea, waiting for sale, etc.",
            },
            {
              name: "priority",
              type: "number",
              title: "Priority",
              description: "Sort order (1 = highest)",
              validation: (Rule) => Rule.integer().min(1),
            },
            {
              name: "notifyOnSale",
              type: "boolean",
              title: "Notify on Sale",
              initialValue: true,
            },
            {
              name: "notifyBackInStock",
              type: "boolean",
              title: "Notify When Back in Stock",
              initialValue: true,
            },
          ],
          preview: {
            select: {
              productName: "productRef.name",
              productImage: "productRef.image",
              addedAt: "addedAt",
              note: "note",
            },
            prepare(selection) {
              const date = new Date(selection.addedAt).toLocaleDateString();
              return {
                title: selection.productName || "Product",
                subtitle: `Added ${date}${selection.note ? ` - ${selection.note}` : ""}`,
                media: selection.productImage,
              };
            },
          },
        }),
      ],
    }),

    // ============ PREFERENCES ============
    defineField({
      name: "preferences",
      title: "User Preferences",
      type: "object",
      fields: [
        // Email Notifications
        {
          name: "emailNotifications",
          type: "object",
          title: "Email Preferences",
          fields: [
            {
              name: "orderUpdates",
              type: "boolean",
              title: "Order Updates",
              initialValue: true,
            },
            {
              name: "shipping",
              type: "boolean",
              title: "Shipping Updates",
              initialValue: true,
            },
            {
              name: "promotions",
              type: "boolean",
              title: "Promotions & Sales",
              initialValue: false,
            },
            {
              name: "newsletter",
              type: "boolean",
              title: "Newsletter",
              initialValue: false,
            },
            {
              name: "wishlistAlerts",
              type: "boolean",
              title: "Wishlist Price Drops",
              initialValue: true,
            },
            {
              name: "reviewReminders",
              type: "boolean",
              title: "Review Reminders",
              initialValue: false,
            },
            {
              name: "abandonedCart",
              type: "boolean",
              title: "Abandoned Cart",
              initialValue: false,
            },
          ],
        },
        // Shopping Preferences
        {
          name: "shopping",
          type: "object",
          title: "Shopping Preferences",
          fields: [
            {
              name: "currency",
              type: "string",
              title: "Preferred Currency",
              options: {
                list: [
                  { title: "USD", value: "USD" },
                  { title: "EUR", value: "EUR" },
                  { title: "GBP", value: "GBP" },
                  { title: "CAD", value: "CAD" },
                ],
              },
              initialValue: "USD",
            },
            {
              name: "language",
              type: "string",
              title: "Preferred Language",
              options: {
                list: [
                  { title: "English", value: "en" },
                  { title: "Spanish", value: "es" },
                  { title: "French", value: "fr" },
                  { title: "German", value: "de" },
                ],
              },
              initialValue: "en",
            },
            {
              name: "defaultShippingSpeed",
              type: "string",
              title: "Default Shipping Speed",
              options: {
                list: [
                  { title: "Standard", value: "standard" },
                  { title: "Express", value: "express" },
                  { title: "Next Day", value: "nextday" },
                ],
              },
            },
            {
              name: "saveCardForLater",
              type: "boolean",
              title: "Save Payment Methods",
              initialValue: true,
            },
          ],
        },
        // Privacy Settings
        {
          name: "privacy",
          type: "object",
          title: "Privacy Settings",
          fields: [
            {
              name: "shareDataForPersonalization",
              type: "boolean",
              title: "Personalized Recommendations",
              initialValue: true,
            },
            {
              name: "shareReviewsPublicly",
              type: "boolean",
              title: "Public Reviews",
              initialValue: true,
            },
            {
              name: "allowMarketingTracking",
              type: "boolean",
              title: "Marketing Analytics",
              initialValue: false,
            },
          ],
        },
      ],
    }),

    // ============ LOYALTY & REWARDS ============
    defineField({
      name: "loyalty",
      title: "Loyalty Program",
      type: "object",
      fields: [
        {
          name: "points",
          type: "number",
          title: "Current Points",
          validation: (Rule) => Rule.integer().min(0),
          initialValue: 0,
        },
        {
          name: "tier",
          type: "string",
          title: "Loyalty Tier",
          options: {
            list: [
              { title: "Bronze", value: "bronze" },
              { title: "Silver", value: "silver" },
              { title: "Gold", value: "gold" },
              { title: "Platinum", value: "platinum" },
            ],
          },
          initialValue: "bronze",
        },
        {
          name: "lifetimePoints",
          type: "number",
          title: "Lifetime Points Earned",
          validation: (Rule) => Rule.integer().min(0),
          readOnly: true,
        },
        {
          name: "joinedAt",
          type: "datetime",
          title: "Program Join Date",
        },
        {
          name: "referralCode",
          type: "string",
          title: "Personal Referral Code",
          validation: (Rule) => Rule.uppercase(),
          readOnly: true,
        },
        {
          name: "referredBy",
          type: "reference",
          to: [{ type: "user" }],
          title: "Referred By User",
        },
        {
          name: "referralCount",
          type: "number",
          title: "Successful Referrals",
          validation: (Rule) => Rule.integer().min(0),
          initialValue: 0,
        },
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
      name: "paymentMethods",
      title: "Saved Payment Methods",
      type: "array",
      description: "References to Stripe payment methods",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            {
              name: "stripePaymentMethodId",
              type: "string",
              title: "Stripe Payment Method ID",
              validation: (Rule) => Rule.required(),
              readOnly: true,
            },
            {
              name: "type",
              type: "string",
              title: "Payment Type",
              options: {
                list: [
                  { title: "Card", value: "card" },
                  { title: "Bank Account", value: "bank" },
                  { title: "PayPal", value: "paypal" },
                ],
              },
            },
            {
              name: "last4",
              type: "string",
              title: "Last 4 Digits",
              validation: (Rule) => Rule.length(4),
            },
            {
              name: "brand",
              type: "string",
              title: "Card Brand",
            },
            {
              name: "expMonth",
              type: "number",
              title: "Expiry Month",
              validation: (Rule) => Rule.integer().min(1).max(12),
            },
            {
              name: "expYear",
              type: "number",
              title: "Expiry Year",
              validation: (Rule) =>
                Rule.integer().min(new Date().getFullYear()),
            },
            {
              name: "isDefault",
              type: "boolean",
              title: "Default Payment Method",
              initialValue: false,
            },
            {
              name: "addedAt",
              type: "datetime",
              title: "Added Date",
            },
          ],
          preview: {
            select: {
              type: "type",
              last4: "last4",
              brand: "brand",
              isDefault: "isDefault",
            },
            prepare(selection) {
              const { type, last4, brand, isDefault } = selection;
              return {
                title: `${brand || type} •••• ${last4}${isDefault ? " ⭐" : ""}`,
                subtitle: isDefault ? "Default" : "",
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
