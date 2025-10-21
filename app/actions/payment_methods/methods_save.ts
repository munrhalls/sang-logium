"use server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { getOrCreateStripeCustomer } from "./customer";

export async function savePaymentMethod(paymentMethodId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  if (!paymentMethodId || !paymentMethodId.startsWith("pm_")) {
    throw new Error("Invalid payment method ID");
  }
  try {
    const customerId = await getOrCreateStripeCustomer();
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    if (paymentMethod.type !== "card") {
      throw new Error("Only card payment methods are currently supported");
    }
    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $userId][0]{
        _id,
        paymentMethods
      }`,
      { userId }
    );
    const isFirstMethod =
      !user.paymentMethods || user.paymentMethods.length === 0;
    const methodExists = user.paymentMethods?.some(
      (pm: { stripePaymentMethodId: string }) =>
        pm.stripePaymentMethodId === paymentMethodId
    );
    if (methodExists) {
      throw new Error("This payment method is already saved");
    }
    const paymentMethodData = {
      stripePaymentMethodId: paymentMethod.id,
      type: paymentMethod.type,
      last4: paymentMethod.card?.last4 || "",
      brand: paymentMethod.card?.brand || "",
      expMonth: paymentMethod.card?.exp_month || 0,
      expYear: paymentMethod.card?.exp_year || 0,
      isDefault: isFirstMethod,
      addedAt: new Date().toISOString(),
    };
    await client
      .patch(user._id)
      .setIfMissing({ paymentMethods: [] })
      .append("paymentMethods", [paymentMethodData])
      .set({ "metadata.updatedAt": new Date().toISOString() })
      .commit();
    return {
      success: true,
      paymentMethod: paymentMethodData,
    };
  } catch (error) {
    console.error("Error saving payment method:", error);
    try {
      await stripe.paymentMethods.detach(paymentMethodId);
    } catch (detachError) {
      console.error("Error detaching payment method:", detachError);
    }
    throw new Error(
      error instanceof Error ? error.message : "Failed to save payment method"
    );
  }
}
