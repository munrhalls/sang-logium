"use client";

import { useCheckout } from "../CheckoutProvider";
import ConfirmationView from "./ConfirmationView";
import ShippingFormView from "./ShippingFormView";
import Loader from "@/app/components/common/Loader";

export default function ShippingPage() {
  const { status, address } = useCheckout();

  if (status === "LOADING") {
    return (
      <div className="relative flex min-h-[50vh] items-center justify-center">
        <Loader message="Validating address..." />
      </div>
    );
  }

  if ((status === "CONFIRMED" || status === "PARTIAL") && address) {
    return <ConfirmationView address={address} />;
  }

  return <ShippingFormView />;
}
