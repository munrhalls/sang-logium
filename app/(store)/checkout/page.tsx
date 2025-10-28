// run stripe functions to create checkout session
// run react stripe embedded checkout component with client secret from session

import { redirect } from "next/navigation";
import CheckoutForm from "@/app/components/CheckoutForm";
import { currentUser } from "@clerk/nextjs/server";
import stripe from "@/lib/stripe";

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export default async function CheckoutPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "custom",
    line_items: [
      {
        // Provide the exact Price ID (e.g. price_1234) of the product you want to sell
        price: "{{PRICE_ID}}",
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${NEXT_PUBLIC_URL}/review.html?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session || !session.client_secret) {
    throw new Error("Failed to create checkout session");
  }

  return <CheckoutForm clientSecret={session.client_secret} />;
}
