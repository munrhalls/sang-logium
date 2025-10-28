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

  // how should we get server action session to here?

  if (!session || !session.client_secret) {
    throw new Error("Failed to create checkout session");
  }

  return <CheckoutForm clientSecret={session.client_secret} />;
}
