"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export type ShippingAddress = {
  regionCode: string;
  postalCode: string;
  street: string;
  streetNumber: string;
  city: string;
};

export type CheckoutContextType = {
  addressApiValidation: string | null;
  setAddressApiValidation: (status: string | null) => void;
  validateShipping: (formData: ShippingAddress) => Promise<void>;
  shippingAddress: ShippingAddress | null;
};

const CheckoutContext = createContext<CheckoutContextType>(
  {} as CheckoutContextType
);

export function useCheckout() {
  return useContext(CheckoutContext);
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [addressApiValidation, setAddressApiValidation] = useState<
    string | null
  >(null);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const router = useRouter();
  const { user } = useUser();

  // useEffect(() => {
  //   if (user?.publicMetadata?.shippingAddress) {
  //     router.push("/checkout/shipping/confirmation");
  //   }
  // }, [user, router]);

  const validateShipping = async (formData: ShippingAddress) => {
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const {
        status: apiAddressStatus,
        correctedAddress: apiCorrectedAddress,
      } = await res.json();

      if (!apiCorrectedAddress) {
        throw new Error("No corrected address returned from API");
      }
      setAddressApiValidation(apiAddressStatus);

      if (apiAddressStatus === "CONFIRMED" || apiAddressStatus === "PARTIAL") {
        const parsedApiCorrectedAddress: ShippingAddress = {
          street: apiCorrectedAddress.street,
          streetNumber: apiCorrectedAddress.streetNumber,
          city: apiCorrectedAddress.city,
          postalCode: apiCorrectedAddress.postalCode,
          regionCode: apiCorrectedAddress.regionCode,
        };

        setShippingAddress(parsedApiCorrectedAddress);
        // router.push("/checkout/shipping/confirmation");
        return;
      } else {
      }
    } catch (error) {
      console.error("Error validating shipping address:", error);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        addressApiValidation,
        setAddressApiValidation,
        validateShipping,
        shippingAddress,
      }}
    >
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-8 flex justify-center text-3xl font-black uppercase">
          Checkout
        </h1>
        {children}
      </div>
    </CheckoutContext.Provider>
  );
}
