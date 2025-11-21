import { currentUser } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { getCheckoutCookie } from "@/lib/checkoutToken";
import CheckoutProvider from "./CheckoutProvider";
import { Address, Status } from "./checkout.types";
import { User } from "@/sanity.types";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  let initialAddress: Address | null = null;
  let initialStatus: Status = "EDITING";

  if (user) {
    try {
      const sanityUser: User | null = await backendClient.fetch(
        `*[_type == "user" && clerkUserId == $id][0]{
            addresses
        }`,
        { id: user.id }
      );

      if (sanityUser?.addresses && sanityUser.addresses.length > 0) {
        const savedAddr =
          sanityUser.addresses.find((a) => a.isDefault) ||
          sanityUser.addresses[0];

        if (savedAddr) {
          initialAddress = {
            street: savedAddr.line1,
            streetNumber: savedAddr.line2,
            city: savedAddr.city,
            postalCode: savedAddr.postalCode,
            regionCode: savedAddr.country,
          };
          initialStatus = "CONFIRMED";
        }
      }
    } catch (error) {
      console.error("Failed to fetch user address from Sanity:", error);
      // Fallback to empty form (IDLE)
    }
  }

  if (initialAddress === null || initialAddress === undefined) {
    const guestContext = await getCheckoutCookie();

    if (guestContext?.address) {
      initialAddress = {
        street: guestContext.address.line1,
        streetNumber: "",
        city: guestContext.address.city,
        postalCode: guestContext.address.postal_code,
        regionCode: guestContext.address.country,
      };
      initialStatus = "CONFIRMED";
    }
  }

  return (
    <CheckoutProvider
      initialAddress={initialAddress}
      initialStatus={initialStatus}
    >
      {children}
    </CheckoutProvider>
  );
}
