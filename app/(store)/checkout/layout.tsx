"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/common/Loader";

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
  validateShipping: (formData: ShippingAddress) => Promise<string | null>;
  handleAddressSubmit: (data: ShippingAddress) => void;
  shippingAddress: ShippingAddress | null;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleAddressSubmit = async (data: ShippingAddress) => {
    try {
      // setIsLoading(true);
      const validationResult = await validateShipping(data);

      if (validationResult === "CONFIRMED" || validationResult === "PARTIAL") {
        await router.push("/checkout/shipping?step=confirmation");
        return;
      }
    } catch (error) {
      console.error("Error during address submission:", error);
      // setIsLoading(false);
    }
  };

  const validateShipping = async (
    formData: ShippingAddress
  ): Promise<string | null> => {
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
      }

      return apiAddressStatus;
    } catch (error) {
      console.error("Error validating shipping address:", error);
      setAddressApiValidation("ERROR");
      return "ERROR";
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        addressApiValidation,
        setAddressApiValidation,
        validateShipping,
        shippingAddress,
        handleAddressSubmit,
        setIsLoading,
        isLoading,
      }}
    >
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-8 flex justify-center text-3xl font-black uppercase">
          Checkout
        </h1>
        {isLoading ? <Loader /> : children}
      </div>
    </CheckoutContext.Provider>
  );
}
