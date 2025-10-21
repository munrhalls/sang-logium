"use server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";

interface SanityUserPaymentData {
  stripeCustomerId?: string; // We must project this!
  paymentMethods?: any[];
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
  if (!user || !user.paymentMethods) {
    return [];
  }
  // *** IMPORTANT NEXT STEP LOGIC (Must be implemented here,
  // but missing from your current code) ***
  // 1. If user.stripeCustomerId exists, you need to use the Stripe API
  //    to fetch the *live* status of those payment methods.
  // 2. Your current code only returns the *Sanity cached* data, which
  //    can quickly become out of date (e.g., if a card expires).
  // 3. For a proper, full solution, the Server Action must:
  //    a) Check if user.stripeCustomerId exists.
  //    b) If yes, call the Stripe API: `stripe.paymentMethods.list({ customer: user.stripeCustomerId, type: 'card' })`
  //    c) Merge/use the live data from Stripe instead of just the cached Sanity data.
  return user.paymentMethods;
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
