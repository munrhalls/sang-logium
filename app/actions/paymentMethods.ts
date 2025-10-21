"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";

/**
 * Payment Method Management Server Actions
 * Securely handles Stripe customer and payment method operations
 */

// ============================================
// STEP 1: Get or Create Stripe Customer
// ============================================

/**
 * Ensures user has a Stripe customer ID
 * Creates one if it doesn't exist and stores it in Sanity
 *
 * @returns Stripe customer ID (starts with cus_...)
 */
export async function getOrCreateStripeCustomer(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // 1. Check Sanity for existing Stripe customer ID
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

  // 2. If user already has a Stripe customer ID, return it
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // 3. Create new Stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.displayName,
    metadata: {
      clerkUserId: userId,
      sanityUserId: user._id,
    },
  });

  // 4. Save Stripe customer ID to Sanity user document
  await client
    .patch(user._id)
    .set({
      stripeCustomerId: customer.id,
      "metadata.updatedAt": new Date().toISOString(),
    })
    .commit();

  return customer.id;
}

// ============================================
// STEP 2: Save Payment Method
// ============================================

/**
 * Attaches a payment method to the user's Stripe customer
 * and saves the metadata to Sanity
 *
 * Called after user enters card details in Stripe Elements
 *
 * @param paymentMethodId - Stripe payment method ID (starts with pm_...)
 * @returns Payment method metadata
 */
export async function savePaymentMethod(paymentMethodId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  if (!paymentMethodId || !paymentMethodId.startsWith("pm_")) {
    throw new Error("Invalid payment method ID");
  }

  try {
    // 1. Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer();

    // 2. Attach payment method to customer in Stripe
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // 3. Retrieve payment method details from Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    if (paymentMethod.type !== "card") {
      throw new Error("Only card payment methods are currently supported");
    }

    // 4. Get user document with existing payment methods
    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $userId][0]{
        _id,
        paymentMethods
      }`,
      { userId }
    );

    // 5. Check if this is the first payment method (make it default)
    const isFirstMethod =
      !user.paymentMethods || user.paymentMethods.length === 0;

    // 6. Check if payment method already exists
    const methodExists = user.paymentMethods?.some(
      (pm: { stripePaymentMethodId: string }) =>
        pm.stripePaymentMethodId === paymentMethodId
    );

    if (methodExists) {
      throw new Error("This payment method is already saved");
    }

    // 7. Prepare payment method metadata for Sanity
    const paymentMethodData = {
      stripePaymentMethodId: paymentMethod.id,
      type: paymentMethod.type, // "card"
      last4: paymentMethod.card?.last4 || "",
      brand: paymentMethod.card?.brand || "", // visa, mastercard, amex, etc.
      expMonth: paymentMethod.card?.exp_month || 0,
      expYear: paymentMethod.card?.exp_year || 0,
      isDefault: isFirstMethod,
      addedAt: new Date().toISOString(),
    };

    // 8. Save payment method metadata to Sanity
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

    // Clean up: detach payment method if it was attached
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

// ============================================
// STEP 3: List Payment Methods
// ============================================

/**
 * Retrieves all saved payment methods for the current user
 *
 * @returns Array of payment method metadata
 */
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

// ============================================
// STEP 4: Delete Payment Method
// ============================================

/**
 * Detaches a payment method from Stripe and removes it from Sanity
 *
 * @param paymentMethodId - Stripe payment method ID to delete
 */
export async function deletePaymentMethod(paymentMethodId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  if (!paymentMethodId || !paymentMethodId.startsWith("pm_")) {
    throw new Error("Invalid payment method ID");
  }

  try {
    // 1. Get user document
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

    // 2. Verify user owns this payment method
    const methodExists = user.paymentMethods?.find(
      (pm: { stripePaymentMethodId: string; isDefault?: boolean }) =>
        pm.stripePaymentMethodId === paymentMethodId
    );

    if (!methodExists) {
      throw new Error(
        "Payment method not found or doesn't belong to this user"
      );
    }

    // 3. Detach from Stripe
    await stripe.paymentMethods.detach(paymentMethodId);

    // 4. Remove from Sanity
    const updatedMethods = (user.paymentMethods || []).filter(
      (pm: { stripePaymentMethodId: string }) =>
        pm.stripePaymentMethodId !== paymentMethodId
    );

    // 5. If deleted method was default and there are other methods, make the first one default
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

// ============================================
// STEP 5: Set Default Payment Method
// ============================================

/**
 * Sets a payment method as the default for the user
 * Unsets any other default payment methods
 *
 * @param paymentMethodId - Stripe payment method ID to set as default
 */
export async function setDefaultPaymentMethod(paymentMethodId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  if (!paymentMethodId || !paymentMethodId.startsWith("pm_")) {
    throw new Error("Invalid payment method ID");
  }

  try {
    // 1. Get user document
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

    // 2. Verify user owns this payment method
    const methodExists = user.paymentMethods?.find(
      (pm: { stripePaymentMethodId: string }) =>
        pm.stripePaymentMethodId === paymentMethodId
    );

    if (!methodExists) {
      throw new Error(
        "Payment method not found or doesn't belong to this user"
      );
    }

    // 3. Update all methods: set new default, unset others
    const updatedMethods = (user.paymentMethods || []).map(
      (pm: { stripePaymentMethodId: string; isDefault?: boolean }) => ({
        ...pm,
        isDefault: pm.stripePaymentMethodId === paymentMethodId,
      })
    );

    // 4. Update Stripe default payment method (optional but recommended)
    if (user.stripeCustomerId) {
      await stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // 5. Save to Sanity
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

// ============================================
// STEP 6: Get Default Payment Method
// ============================================

/**
 * Retrieves the user's default payment method
 *
 * @returns Default payment method metadata or null
 */
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

// ============================================
// HELPER: Validate Payment Method Ownership
// ============================================

/**
 * Verifies that a payment method belongs to the current user
 * Use this before processing payments with saved methods
 *
 * @param paymentMethodId - Stripe payment method ID to validate
 * @returns boolean indicating ownership
 */
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
