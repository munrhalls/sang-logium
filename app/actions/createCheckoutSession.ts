"use server";
import { createSafeActionClient } from "next-safe-action";
import stripe from "@/lib/stripe";
import { BasketItem } from "@/store/store";
import { imageUrl } from "@/lib/imageUrl";

export const actionClient = createSafeActionClient();

type Metadata = {
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

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metadata.customerEmail : undefined,
      mode: "payment",
      success_url: `${`https://${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL}`}/checkout/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${`https://${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL}`}/basket`,
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name || "Unnamed Product",
            description: item.product.description || undefined,
            metadata: {
              id: item.product.id,
            },
            images: item.product.image
              ? [imageUrl(item.product.image.url())]
              : undefined,
          },
        },
        quantity: item.quantity,
      })),
    });
  } catch {}
}
