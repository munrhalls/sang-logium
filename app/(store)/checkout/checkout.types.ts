export type ShippingAddress = {
  regionCode: string;
  postalCode: string;
  street: string;
  streetNumber: string;
  city: string;
};

export type ValidationStatus =
  | "IDLE"
  | "LOADING"
  | "FIX"
  | "PARTIAL"
  | "CONFIRMED";

export type ServerProduct = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  stripePriceId: string;
  _rev: string;
};

export type BasketCheckoutItem = {
  _id: string;
  quantity: number;
};
