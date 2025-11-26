export type Address = {
  regionCode: string;
  postalCode: string;
  street: string;
  streetNumber: string;
  city: string;
};

export type Status = "EDITING" | "LOADING" | "FIX" | "PARTIAL" | "CONFIRM";

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
