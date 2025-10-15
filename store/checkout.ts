import { create } from "zustand";

export interface ShippingFormData {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CheckoutState {
  shippingInfo: ShippingFormData | null;
  setShippingInfo: (data: ShippingFormData) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shippingInfo: null,
  setShippingInfo: (data) => set({ shippingInfo: data }),
}));
