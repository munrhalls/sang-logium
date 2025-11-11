"use client";
import { useCheckout } from "@/app/(store)/checkout/layout";
import { useSearchParams } from "next/navigation";
import ConfirmationView from "./confirmation/ConfirmationView";
import ShippingFormView from "./ShippingFormView";
import Loader from "@/app/components/common/Loader";

export default function Page() {
  const { isLoading } = useCheckout();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : step === "confirmation" ? (
        <ConfirmationView />
      ) : (
        <ShippingFormView />
      )}
    </>
  );
}
