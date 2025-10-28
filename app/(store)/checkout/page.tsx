import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Checkout from "@/app/components/features/checkout/Checkout";

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export default async function CheckoutPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  return <Checkout />;
}
