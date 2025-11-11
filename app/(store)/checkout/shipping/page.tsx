"use client";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/(store)/checkout/layout";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ConfirmationView from "./confirmation/ConfirmationView";
import ShippingFormView from "./ShippingFormView";
import Loader from "@/app/components/common/Loader";

type FormData = {
  regionCode: string;
  postalCode: string;
  street: string;
  streetNumber: string;
  city: string;
};

export default function Page() {
  const { validateShipping } = useCheckout();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

  const handleAddressSubmit = async (data: FormData) => {
    setIsLoading(true);
    const validationResult = await validateShipping(data);

    if (validationResult === "CONFIRMED" || validationResult === "PARTIAL") {
      setIsLoading(false);
      router.push("/checkout/shipping?step=confirmation");
      return;
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : step === "confirmation" ? (
        <ConfirmationView />
      ) : (
        <ShippingFormView handleAddressSubmit={handleAddressSubmit} />
      )}
    </>
  );
  // return step === "confirmation" ? (
  //   <ConfirmationView />
  // ) : (
  //   <ShippingFormView
  //     handleAddressSubmit={handleAddressSubmit}
  //     isLoading={isLoading}
  //   />
  // );
}
