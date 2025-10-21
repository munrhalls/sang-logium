"use server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";

export async function deletePaymentMethod(paymentMethodId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  if (!paymentMethodId || !paymentMethodId.startsWith("pm_")) {
    throw new Error("Invalid payment method ID");
  }
  try {
    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $userId][0]{
        _id,
        paymentMethods
      }`,
      { userId }
    );
    if (!user) {
      throw new Error("User not found");
    }
    const methodExists = user.paymentMethods?.find(
      (pm: { stripePaymentMethodId: string; isDefault?: boolean }) =>
        pm.stripePaymentMethodId === paymentMethodId
    );
    if (!methodExists) {
      throw new Error(
        "Payment method not found or doesn't belong to this user"
      );
    }
    await stripe.paymentMethods.detach(paymentMethodId);
    const updatedMethods = (user.paymentMethods || []).filter(
      (pm: { stripePaymentMethodId: string }) =>
        pm.stripePaymentMethodId !== paymentMethodId
    );
    if (methodExists.isDefault && updatedMethods.length > 0) {
      updatedMethods[0].isDefault = true;
    }
    await client
      .patch(user._id)
      .set({
        paymentMethods: updatedMethods,
        "metadata.updatedAt": new Date().toISOString(),
      })
      .commit();
    return {
      success: true,
      message: "Payment method deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete payment method"
    );
  }
}

export async function setDefaultPaymentMethod(paymentMethodId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  if (!paymentMethodId || !paymentMethodId.startsWith("pm_")) {
    throw new Error("Invalid payment method ID");
  }
  try {
    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $userId][0]{
        _id,
        paymentMethods,
        stripeCustomerId
      }`,
      { userId }
    );
    if (!user) {
      throw new Error("User not found");
    }
    const methodExists = user.paymentMethods?.find(
      (pm: { stripePaymentMethodId: string }) =>
        pm.stripePaymentMethodId === paymentMethodId
    );
    if (!methodExists) {
      throw new Error(
        "Payment method not found or doesn't belong to this user"
      );
    }
    const updatedMethods = (user.paymentMethods || []).map(
      (pm: { stripePaymentMethodId: string; isDefault?: boolean }) => ({
        ...pm,
        isDefault: pm.stripePaymentMethodId === paymentMethodId,
      })
    );
    if (user.stripeCustomerId) {
      await stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }
    await client
      .patch(user._id)
      .set({
        paymentMethods: updatedMethods,
        "metadata.updatedAt": new Date().toISOString(),
      })
      .commit();
    return {
      success: true,
      message: "Default payment method updated",
    };
  } catch (error) {
    console.error("Error setting default payment method:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to save payment method"
    );
  }
}
