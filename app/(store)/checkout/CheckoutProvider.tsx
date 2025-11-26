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

export default function CheckoutProvider({
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

  // TEMP: DEV HUD
  const DevHUD = () => (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-sm rounded-lg border border-gray-800 bg-black/90 p-4 font-mono text-xs text-green-400 shadow-2xl">
      <div className="mb-2 border-b border-gray-700 pb-1 font-bold text-white">
        DEV STATE (Bret Victor Mode)
      </div>
      <div className="grid grid-cols-[80px_1fr] gap-2">
        <span className="text-gray-500">Status:</span>
        <span
          className={`font-bold ${status === "FIX" ? "text-red-500" : "text-blue-400"}`}
        >
          {status}
        </span>

        <span className="text-gray-500">Address:</span>
        <pre className="max-h-32 overflow-auto text-[10px] text-yellow-300">
          {JSON.stringify(address, null, 2)}
        </pre>
      </div>

      <div className="mt-2 flex gap-2 border-t border-gray-700 pt-2">
        {/* FORCE STATE BUTTONS */}
        <button
          onClick={() => setStatus("FIX")}
          className="bg-red-900 px-2 py-1 hover:bg-red-700"
        >
          Force FIX
        </button>
        <button
          onClick={() => setStatus("CONFIRMED")}
          className="bg-green-900 px-2 py-1 hover:bg-green-700"
        >
          Force CONFIRM
        </button>
        <button
          onClick={() => setAddress(null)}
          className="bg-gray-700 px-2 py-1 hover:bg-gray-600"
        >
          Clear Addr
        </button>
      </div>
    </div>
  );

  // Force visible debug output
  if (typeof window !== "undefined") {
    console.log("🔥 CHECKOUT PROVIDER RENDERED 🔥");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("Status:", status);
    console.log("Address:", address);
  }

  const submitAddress = async (data: Address) => {
    setStatus("LOADING");

    try {
      const result = await submitShippingAction(data);
      console.log("Address submission result:", result);

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
      <DevHUD />
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
