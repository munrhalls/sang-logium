"use client";
import ConfirmationView from "./ConfirmationView";
import ShippingFormView from "./ShippingFormView";
import { useCheckout } from "../layout";

export default function Page() {
  const { isAddressValidated, shippingAddress } = useCheckout();

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
