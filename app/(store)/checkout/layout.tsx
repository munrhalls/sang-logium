"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const CheckoutContext = createContext<any>(null);

export function useCheckout() {
  return useContext(CheckoutContext);
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shippingAPIValidation, setShippingAPIValidation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateShipping = async (formData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setShippingAPIValidation(data);

      if (data.status === "CONFIRMED" || data.status === "PARTIAL") {
        router.push("/checkout/shipping/confirmation");
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error validating shipping address:", error);
      setIsLoading(false);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        shippingAPIValidation,
        setShippingAPIValidation,
        validateShipping,
        isLoading,
      }}
    >
      <div>{children}</div>
    </CheckoutContext.Provider>
  );
}
