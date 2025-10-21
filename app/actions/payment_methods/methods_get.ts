"use server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";

export async function getUserPaymentMethods() {
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
  return user?.paymentMethods || [];
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
