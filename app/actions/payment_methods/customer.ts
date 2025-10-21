"use server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";

export async function getOrCreateStripeCustomer(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const user = await client.fetch(
    `*[_type == "user" && clerkUserId == $userId][0]{
      _id,
      stripeCustomerId,
      email,
      displayName
    }`,
    { userId }
  );
  if (!user) {
    throw new Error("User not found in database");
  }
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.displayName,
    metadata: {
      clerkUserId: userId,
      sanityUserId: user._id,
    },
  });
  await client
    .patch(user._id)
    .set({
      stripeCustomerId: customer.id,
      "metadata.updatedAt": new Date().toISOString(),
    })
    .commit();
  return customer.id;
}
