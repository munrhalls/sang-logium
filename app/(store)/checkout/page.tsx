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
  // how should we get the line items for the checkout session?

  // perhaps server action on the checkout button?

  const session = await stripe.checkout.sessions.create({});

  if (!session || !session.client_secret) {
    throw new Error("Failed to create checkout session");
  }

  return <CheckoutForm clientSecret={session.client_secret} />;
}
