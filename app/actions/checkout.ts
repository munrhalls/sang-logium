"use server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";

type CartItem = {
  priceId: string;
  quantity: number;
};

type InventoryItem = {
  stripePriceId: string;
  stock: number;
  name: string;
};

/**
 * Creates an embedded Stripe Checkout session
 * Returns client secret for rendering checkout on your site
 */
export async function createEmbeddedCheckoutSession(
  items: CartItem[],
  options?: {
    savePaymentMethod?: boolean;
  }
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  if (!items || items.length === 0) {
    throw new Error("Basket is empty.");
  }

  const priceIds = items.map((item) => item.priceId);

  const inventoryQuery = `
    *[_type == "product" && stripePriceId in $priceIds] {
      stripePriceId,
      stock,
      name
    }
  `;

  const inventoryData: InventoryItem[] = await client.fetch(inventoryQuery, {
    priceIds,
  });

  const inventoryMap = new Map(
    inventoryData.map((item) => [item.stripePriceId, item])
  );

  const validatedLineItems: { price: string; quantity: number }[] = [];

  for (const clientItem of items) {
    const inventoryItem = inventoryMap.get(clientItem.priceId);

    if (!inventoryItem) {
      throw new Error(
        `Product with price ID "${clientItem.priceId}" not found. Please refresh your basket.`
      );
    }

    if (inventoryItem.stock < 1) {
      throw new Error(`Product "${inventoryItem.name}" is now out of stock.`);
    }

    if (clientItem.quantity > inventoryItem.stock) {
      throw new Error(
        `Requested quantity (${clientItem.quantity}) for "${inventoryItem.name}" exceeds available stock (${inventoryItem.stock}).`
      );
    }

    if (clientItem.quantity <= 0) {
      throw new Error(`Invalid quantity for "${inventoryItem.name}".`);
    }

    validatedLineItems.push({
      price: clientItem.priceId,
      quantity: clientItem.quantity,
    });
  }

  if (validatedLineItems.length === 0) {
    throw new Error("No valid items in basket.");
  }

  // Key difference: ui_mode: 'embedded' and return_url instead of success_url
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    ui_mode: "embedded", // ← This makes it embedded!
    line_items: validatedLineItems,
    return_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      userId: userId,
    },
    // If user wants to save payment method, configure Stripe to save it
    ...(options?.savePaymentMethod && {
      payment_intent_data: {
        setup_future_usage: "off_session",
      },
    }),
  });

  // Return the client secret instead of redirecting
  return {
    clientSecret: checkoutSession.client_secret,
    sessionId: checkoutSession.id,
  };
}

/**
 * Process payment with a saved payment method
 * Creates a Payment Intent directly without checkout session
 */
export async function processPaymentWithSavedMethod(
  items: CartItem[],
  paymentMethodId: string
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  if (!paymentMethodId || !paymentMethodId.startsWith("pm_")) {
    throw new Error("Invalid payment method ID");
  }

  if (!items || items.length === 0) {
    throw new Error("Basket is empty.");
  }

  // Validate payment method ownership
  const { validatePaymentMethodOwnership } = await import("./paymentMethods");
  const isOwner = await validatePaymentMethodOwnership(paymentMethodId);
  if (!isOwner) {
    throw new Error("Payment method not found or access denied");
  }

  // Validate inventory (same as embedded checkout)
  const priceIds = items.map((item) => item.priceId);

  const inventoryQuery = `
    *[_type == "product" && stripePriceId in $priceIds] {
      stripePriceId,
      stock,
      name,
      displayPrice
    }
  `;

  const inventoryData: Array<{
    stripePriceId: string;
    stock: number;
    name: string;
    displayPrice: number;
  }> = await client.fetch(inventoryQuery, {
    priceIds,
  });

  const inventoryMap = new Map(
    inventoryData.map((item) => [item.stripePriceId, item])
  );

  let totalAmount = 0;
  const validatedLineItems: Array<{
    priceId: string;
    quantity: number;
    name: string;
    price: number;
  }> = [];

  for (const clientItem of items) {
    const inventoryItem = inventoryMap.get(clientItem.priceId);

    if (!inventoryItem) {
      throw new Error(
        `Product with price ID "${clientItem.priceId}" not found. Please refresh your basket.`
      );
    }

    if (inventoryItem.stock < 1) {
      throw new Error(`Product "${inventoryItem.name}" is now out of stock.`);
    }

    if (clientItem.quantity > inventoryItem.stock) {
      throw new Error(
        `Requested quantity (${clientItem.quantity}) for "${inventoryItem.name}" exceeds available stock (${inventoryItem.stock}).`
      );
    }

    if (clientItem.quantity <= 0) {
      throw new Error(`Invalid quantity for "${inventoryItem.name}".`);
    }

    const itemTotal = inventoryItem.displayPrice * clientItem.quantity;
    totalAmount += itemTotal;

    validatedLineItems.push({
      priceId: clientItem.priceId,
      quantity: clientItem.quantity,
      name: inventoryItem.name,
      price: inventoryItem.displayPrice,
    });
  }

  if (validatedLineItems.length === 0) {
    throw new Error("No valid items in basket.");
  }

  // Get user's Stripe customer ID
  const { getOrCreateStripeCustomer } = await import("./paymentMethods");
  const customerId = await getOrCreateStripeCustomer();

  // Create Payment Intent with saved payment method
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100), // Convert to cents
    currency: "usd",
    customer: customerId,
    payment_method: paymentMethodId,
    confirm: true, // Automatically confirm the payment
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never", // Prevent redirects for saved cards
    },
    metadata: {
      userId: userId,
      source: "saved_payment_method",
    },
  });

  // Check payment status
  if (
    paymentIntent.status !== "succeeded" &&
    paymentIntent.status !== "processing"
  ) {
    throw new Error(
      `Payment failed: ${paymentIntent.status}. Please try again or use a different payment method.`
    );
  }

  // Return payment intent details
  return {
    success: true,
    paymentIntentId: paymentIntent.id,
    status: paymentIntent.status,
    amount: paymentIntent.amount / 100,
  };
}
