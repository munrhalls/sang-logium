"use client";
import ConfirmationView from "./confirmation/ConfirmationView";
import ShippingFormView from "./ShippingFormView";
import { useCheckout } from "../layout";

export default function Page() {
  const { isAddressValidated, shippingAddress } = useCheckout();
  console.log(isAddressValidated, "isAddressValidated in page");

  return (
    <>
      {shippingAddress && isAddressValidated ? (
        <ConfirmationView shippingAddress={shippingAddress} />
      ) : (
        <ShippingFormView />
      )}
    </>
  );
}
