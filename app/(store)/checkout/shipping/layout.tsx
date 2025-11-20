import { currentUser } from "@clerk/nextjs/server";
import CheckoutProvider from "./CheckoutProvider";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  let shippingAddress = null;
  if (user) {
    // TODO fetch user address from Sanity and prefill the checkout context with it
    // TODO set shippingAddress
  }
  return <div>{children}</div>;
}
