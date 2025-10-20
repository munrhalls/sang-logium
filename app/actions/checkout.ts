"use server";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

type CartItem = {
  priceId: string;
  quantity: number;
};

export async function createCartCheckoutSession(items: CartItem[]) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/basket`,
    metadata: {
      userId: userId,
    },
  });

  redirect(checkoutSession.url!);
}
