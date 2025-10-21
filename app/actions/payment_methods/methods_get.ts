"use server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { stripe } from "@/lib/stripe";

interface SanityUserPaymentData {
  stripeCustomerId?: string;
  paymentMethods?: Array<{
    stripePaymentMethodId: string;
    type?: string;
    last4?: string;
    brand?: string;
    expMonth?: number;
    expYear?: number;
    isDefault?: boolean;
  }>;
}

export async function getUserPaymentMethods() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const user: SanityUserPaymentData = await client.fetch(
    `*[_type == "user" && clerkUserId == $userId][0]{
            stripeCustomerId,
            paymentMethods
        }`,
    { userId }
  );

  if (!user) {
    return [];
  }

  // If user has a Stripe Customer ID, fetch live payment methods from Stripe
  if (user.stripeCustomerId) {
    try {
      const stripePaymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: "card",
      });

      // Map Stripe payment methods to our expected format
      const livePaymentMethods = stripePaymentMethods.data.map((pm) => {
        // Find if this payment method is marked as default in Sanity
        const sanityMethod = user.paymentMethods?.find(
          (spm) => spm.stripePaymentMethodId === pm.id
        );

        return {
          stripePaymentMethodId: pm.id,
          type: pm.type,
          last4: pm.card?.last4 || "",
          brand: pm.card?.brand || "",
          expMonth: pm.card?.exp_month || 0,
          expYear: pm.card?.exp_year || 0,
          isDefault: sanityMethod?.isDefault || false,
        };
      });

      return livePaymentMethods;
    } catch (error) {
      console.error("Failed to fetch payment methods from Stripe:", error);
      // Fall back to cached Sanity data if Stripe call fails
      return user.paymentMethods || [];
    }
  }

  // If no Stripe Customer ID, return cached Sanity data
  return user.paymentMethods || [];
}

export async function getDefaultPaymentMethod() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const user = await client.fetch(
    `*[_type == "user" && clerkUserId == $userId][0]{
      paymentMethods
    }`,
    { userId }
  );
  const defaultMethod = user?.paymentMethods?.find(
    (pm: { isDefault?: boolean }) => pm.isDefault === true
  );
  return defaultMethod || null;
}

export async function validatePaymentMethodOwnership(
  paymentMethodId: string
): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) {
    return false;
  }
  if (!paymentMethodId || !paymentMethodId.startsWith("pm_")) {
    return false;
  }
  const user = await client.fetch(
    `*[_type == "user" && clerkUserId == $userId][0]{
      paymentMethods
    }`,
    { userId }
  );
  const methodExists = user?.paymentMethods?.some(
    (pm: { stripePaymentMethodId: string }) =>
      pm.stripePaymentMethodId === paymentMethodId
  );
  return methodExists || false;
}
