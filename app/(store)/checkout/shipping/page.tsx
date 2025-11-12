"use client";
import { useSearchParams } from "next/navigation";
import ConfirmationView from "./confirmation/ConfirmationView";
import ShippingFormView from "./ShippingFormView";

export default function Page() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

  return (
    <>{step === "confirmation" ? <ConfirmationView /> : <ShippingFormView />}</>
  );
}
