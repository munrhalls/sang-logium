"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useCheckoutStore } from "@/store/checkout";
import { useBasketStore } from "@/store/store";

const { getState: get, setState: set } = useCheckoutStore;

export default function CheckoutPage() {
  // should check basket items
  // should redirect to basket page if basket is empty
  // should initialize cart items from basket

  console.log("redirect");
  redirect("/checkout/shipping");
}
