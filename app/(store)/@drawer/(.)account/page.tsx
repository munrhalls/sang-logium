"use client";
import { redirect } from "next/navigation";
export default function Account() {
  redirect("/account/orders");
  return null;
}
