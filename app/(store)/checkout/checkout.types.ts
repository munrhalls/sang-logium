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

// Server-side action
export type ValidationLevel =
  | "CONFIRMED"
  | "UNCONFIRMED_BUT_PLAUSIBLE"
  | "UNCONFIRMED_AND_SUSPICIOUS"
  | "UNRECOGNIZED"
  | "MISSING";

export interface FieldResult {
  value: string;
  level: ValidationLevel;
}

export interface ValidatedAddress {
  route: FieldResult;
  streetNumber: FieldResult;
  postalCode: FieldResult;
  city: FieldResult;
  country: FieldResult;
}
