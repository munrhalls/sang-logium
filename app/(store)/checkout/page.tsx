"use client";
import { redirect } from "next/navigation";
export default function CheckoutPage() {
  // TODO LATER /checkout/shipping
  // TODO LATER /checkout progress bar
  redirect("/checkout/payment");
}
