"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Address, Status } from "./checkout.types";
import { submitShippingAction } from "@/app/actions/address/address";

type CheckoutContextType = {
  status: Status;
  address: Address | null;
  apiErrors: Record<string, string>;
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
  const [apiErrors, setAPIErrors] = useState<Record<string, string>>({});

  const DevHUD = () => (
    <div className="absolute h-full w-full">
      <div className="absolute left-4 top-4 z-[9999] max-w-sm rounded-lg border border-gray-800 bg-black/90 p-4 font-mono text-xs text-green-400 shadow-2xl">
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

        <div className="grid grid-cols-[80px_1fr] gap-2">
          <span className="text-gray-500">API Errors:</span>
          <pre className="max-h-32 overflow-auto text-[10px] text-red-400">
            {JSON.stringify(apiErrors, null, 2)}
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
            onClick={() => setStatus("CONFIRM")}
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
    </div>
  );

  const submitAddress = async (data: Address) => {
    setStatus("LOADING");
    setAPIErrors({});

    try {
      const response = await submitShippingAction(data);
      const responseStatus = response.status;
      const responseAddress = response.address;

      console.log("Submit Address Response:", response);

      if (responseStatus === "ACCEPT" && responseAddress) {
        setAddress(responseAddress);
        setStatus("ACCEPT");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("FIX");
      setAPIErrors({ form: "Something went wrong. Please try again." });
    }
  };

  const editAddress = () => {
    setStatus("EDITING");
    setAPIErrors({});
  };

  return (
    <CheckoutContext.Provider
      value={{ status, address, apiErrors, submitAddress, editAddress }}
    >
      {process.env.NODE_ENV === "development" && <DevHUD />}
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
