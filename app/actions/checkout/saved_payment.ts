"use server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { validatePaymentMethodOwnership } from "../payment_methods/methods_get";
import { getOrCreateStripeCustomer } from "../payment_methods/customer";

type CartItem = {
  priceId: string;
  quantity: number;
};

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
  const isOwner = await validatePaymentMethodOwnership(paymentMethodId);
  if (!isOwner) {
    throw new Error("Payment method not found or access denied");
  }
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
  const customerId = await getOrCreateStripeCustomer();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100),
    currency: "usd",
    customer: customerId,
    payment_method: paymentMethodId,
    confirm: true,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
    metadata: {
      userId: userId,
      source: "saved_payment_method",
    },
  });
  if (
    paymentIntent.status !== "succeeded" &&
    paymentIntent.status !== "processing"
  ) {
    throw new Error(
      `Payment failed: ${paymentIntent.status}. Please try again or use a different payment method.`
    );
  }
  return {
    success: true,
    paymentIntentId: paymentIntent.id,
    status: paymentIntent.status,
    amount: paymentIntent.amount / 100,
  };
}
