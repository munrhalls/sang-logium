"use client";
import { createCheckoutSession } from "@/app/actions/stripe";

export default function PaymentButton() {
  return (
    <form action={createCheckoutSession}>
      <button
        type="submit"
        role="link"
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Go to Checkout
      </button>
    </form>
  );
}
