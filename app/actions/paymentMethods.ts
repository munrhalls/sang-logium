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

// all of these should be inside /payments folder as separate files
// Suggested File Structure for Payment Actions

// The monolithic file can be split into smaller, more focused files under a dedicated directory like app/actions/payment_methods.

// This approach ensures each file contains functions related to a single domain action (e.g., managing the customer ID, saving/deleting cards).

// New Structure:

// Filepath

// Functions Contained

// Purpose

// customer.ts

// getOrCreateStripeCustomer

// Handles the creation and retrieval of the Stripe Customer ID, which is a prerequisite for all other payment actions.

// methods_get.ts

// getUserPaymentMethods, getDefaultPaymentMethod, validatePaymentMethodOwnership

// Provides read-only access and validation for saved payment methods.

// methods_save.ts

// savePaymentMethod

// Handles the core logic of attaching a new payment method to a customer and saving its metadata to Sanity.

// methods_manage.ts

// deletePaymentMethod, setDefaultPaymentMethod

// Handles modification operations (deleting and setting the default card).
