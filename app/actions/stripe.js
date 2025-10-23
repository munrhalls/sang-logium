"use server";

import { headers } from "next/headers";

import { stripe } from "../../lib/stripe";

export async function fetchClientSecret() {
  const origin = (await headers()).get("origin");

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price: "{{PRICE_ID}}",
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret;
}
