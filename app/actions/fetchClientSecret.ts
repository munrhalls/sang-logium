"use server";

import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";

export async function fetchClientSecret(publicBasket) {
  const origin = (await headers()).get("origin");

  const lineItems = publicBasket.map((item) => ({
    price: item.stripePriceId,
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: lineItems,
    mode: "payment",
    return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret;
}
