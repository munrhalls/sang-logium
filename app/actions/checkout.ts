"use server";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

type CartItem = {
  priceId: string;
  quantity: number;
};

export async function createCartCheckoutSession(items: CartItem[]) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    metadata: {
      userId: session.user.id,
    },
  });

  redirect(checkoutSession.url!);
}
