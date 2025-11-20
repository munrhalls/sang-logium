"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Address, Status } from "./checkout.types";

type CheckoutContextType = {
  address: Address | null;
  status: Status;
  submit: (formData: Address) => Promise<void>;
  edit: () => void;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within CheckoutProvider");
  }
  return context;
}

type CheckoutProviderProps = {
  children: ReactNode;
  initialAddress: Address | null;
  initialStatus: Status;
};

export default function CheckoutProvider({
  children,
  initialAddress,
  initialStatus,
}: CheckoutProviderProps) {
  const [address, setAddress] = useState<Address | null>(initialAddress);
  const [status, setStatus] = useState<Status>(initialStatus);

  const submit = async (formData: Address) => {
    setStatus("LOADING");

    try {
      const response = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      const { status: validationStatus, correctedAddress } = data;

      if (validationStatus === "CONFIRMED" || validationStatus === "PARTIAL") {
        setAddress(correctedAddress);
        setStatus(validationStatus);
      } else if (validationStatus === "FIX") {
        setAddress(formData);
        setStatus("FIX");
      }
    } catch (error) {
      console.error("Error submitting address:", error);
      setStatus("FIX");
    }
  };

  const edit = () => {
    setStatus("EDITING");
  };

  return (
    <CheckoutContext.Provider value={{ address, status, submit, edit }}>
      {children}
    </CheckoutContext.Provider>
  );
}
