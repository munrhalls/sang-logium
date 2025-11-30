"use client";

import { useCheckout } from "../CheckoutProvider";
import ConfirmationView from "./ConfirmationView";
import FormView from "./FormView";
import Loader from "@/app/components/common/Loader";

// in all 3 cases, return something that retains feedback on status, address
// dx hoc?

export default function ShippingPage() {
  const { status, address } = useCheckout();

  if (status === "LOADING") {
    return (
      <div className="relative flex min-h-[50vh] items-center justify-center">
        <Loader message="Validating address..." />
      </div>
    );
  }

  if (status === "ACCEPT" && address) {
    return <ConfirmationView />;
  }

  return <FormView />;
}
