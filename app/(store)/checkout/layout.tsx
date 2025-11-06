"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

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
  const { user } = useUser();

  useEffect(() => {
    if (user?.publicMetadata?.shippingAddress) {
      router.push("/checkout/shipping/confirmation");
    }
  }, [user, router]);

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
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-8 flex justify-center text-3xl font-black uppercase">
          Checkout
        </h1>
        {children}
      </div>
    </CheckoutContext.Provider>
  );
}
