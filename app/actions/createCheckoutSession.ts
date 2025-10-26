"use server";
// import { createSafeActionClient } from "next-safe-action";
import stripe from "@/lib/stripe";
import { BasketItem } from "@/store/store";

// export const actionClient = createSafeActionClient();

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export type GroupedBasketItem = {
  product: BasketItem;
  quantity: number;
};

export async function createCheckoutSession(
  items: GroupedBasketItem[],
  metadata: Metadata
) {
  console.log("creating checkout session");
  try {
    const itemsWithoutPrice = items.filter(
      (item) => !item.product.displayPrice
    );

    if (itemsWithoutPrice.length > 0) {
      throw Error("Some items do not have price");
    }
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Use headers to get the actual URL in server actions
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_URL ||
      "http://localhost:3000";

    const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
    const cancelUrl = `${baseUrl}/basket`;

    console.log("Success URL:", successUrl);
    console.log("Cancel URL:", cancelUrl);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metadata.customerEmail : undefined,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: items.map((item) => ({
        price: item.product.stripePriceId,
        quantity: item.quantity,
      })),
    });

    console.log("wtf");
    return session.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error; // Re-throw so the client can handle it
  }
}
