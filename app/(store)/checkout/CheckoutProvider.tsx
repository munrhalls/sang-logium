"use client";
import { createContext } from "react";
import { useContext } from "react";
import { Address, Status } from "./checkout.types";
import CheckoutProvider from "./CheckoutProvider";

const CheckoutContext = createContext<{
  address: Address | null;
  status: Status;
}>({
  address: null,
  status: "EDITING",
});
