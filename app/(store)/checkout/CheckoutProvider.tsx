import { createContext, useContext } from "react";
import { CheckoutContextType } from "./checkout.types";

const CheckoutContext = createContext<CheckoutContextType>(
  {} as CheckoutContextType
);

export function useCheckout() {
  return useContext(CheckoutContext);
}

export default function CheckoutProvider() {
  return <div>CheckoutProvider</div>;
}
