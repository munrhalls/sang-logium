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
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    ui_mode: "embedded",
    line_items: validatedLineItems,
    return_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    customer_creation: "always",
    ...(options?.savePaymentMethod && {
      setup_future_usage: "off_session",
    }),
    metadata: {
      userId: userId,
    },
    // TODO when GROQ code is ready
    // ...(existingStripeCustomerId && { customer: existingStripeCustomerId }),
  });
  return {
    clientSecret: checkoutSession.client_secret,
    sessionId: checkoutSession.id,
  };
}
