import Link from "next/link";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 md:bg-black/50" />

      <div className="fixed bottom-14 right-0 top-[4rem] z-50 w-full overflow-y-scroll bg-white shadow-lg sm:bottom-0 sm:top-[6rem] sm:w-11/12 sm:max-w-3xl xl:max-w-6xl">
        <nav>
          <Link href="/account/orders">Orders</Link>
          <Link href="/account/addresses">Addresses</Link>
          <Link href="/account/payment-methods">Payment Methods</Link>
          <Link href="/account/settings">Settings</Link>
        </nav>
        <main>{children}</main>
      </div>
    </>
  );
}
