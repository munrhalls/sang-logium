"use client";
import CheckoutProgress from "./CheckoutProgress";
export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="m-3">
      <h1 className="text-2xl font-black">Checkout</h1>
      <CheckoutProgress />
      {children}
    </div>
  );
}
