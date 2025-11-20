"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Address, Status } from "./checkout.types";
import { submitShippingAction } from "@/app/actions/checkout";

type CheckoutContextType = {
  status: Status;
  address: Address | null;
  submitAddress: (data: Address) => Promise<void>;
  editAddress: () => void;
};

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export function CheckoutProvider({
  children,
  initialAddress,
  initialStatus,
}: {
  children: ReactNode;
  initialAddress: Address | null;
  initialStatus: Status | null;
}) {
  const [status, setStatus] = useState<Status>(initialStatus || "EDITING");

  const [address, setAddress] = useState<Address | null>(initialAddress);

  const submitAddress = async (data: Address) => {
    setStatus("LOADING");

    try {
      const result = await submitShippingAction(data);

      if (result.status === "FIX") {
        setStatus("FIX");
      } else {
        setAddress(result.correctedAddress);
        setStatus(result.status);
      }
    } catch (error) {
      console.error("Address submission failed:", error);
      setStatus("FIX");
    }
  };

  const editAddress = () => {
    setStatus("EDITING");
  };

  return (
    <CheckoutContext.Provider
      value={{
        status,
        address,
        submitAddress,
        editAddress,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
